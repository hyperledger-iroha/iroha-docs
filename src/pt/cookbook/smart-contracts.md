---
translation_locale: pt
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Construir e Implantar um Contrato Inteligente {#build-and-deploy-a-smart-contract}

## Resultado {#outcome}

Verifique e compile um contrato Kotodama V1, execute seu ponto de entrada público localmente, implante o artefato IVM verificado, simule o ponto de entrada implantado e envie-o com uma taxa paga pela autoridade e cotada explicitamente.

## Pré-requisitos {#prerequisites}

- Uma cópia funcional do código-fonte Iroha no commit `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust, e Cargo.
- O atual `iroha` CLI mais um cliente Taira financiado de [Conectar-se a Taira](./connect-to-taira.md).
- Caminhos absolutos em `IROHA_CONFIG` e `IROHA_PRIVATE_KEY_FILE`. O arquivo de chave deve ser um arquivo regular de link único mantido pelo proprietário com modo `0600`; o auxiliar de implantação intencionalmente não possui argumento de chave privada em linha.
- Taira aprovação do operador. O registro do código do contrato requer `CanRegisterSmartContractCode`, e implantações protegidas podem exigir atribuição e execução de governança. Se Taira não concedeu esse acesso, execute a implantação em uma rede local gerada cujo gênese da blockchain concede a permissão.

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## Passos {#steps}

### 1. Copie um contrato Kotodama V1 conhecido por estar bom {#_1-copy-a-known-good-kotodama-v1-contract}

Trabalhe dentro do checkout fixado Iroha e copie o exemplo de retorno de tupla do compilador para que o código-fonte e a cadeia de ferramentas permaneçam no mesmo commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

O código-fonte completo é pequeno e usa a sintaxe atual `seiyaku`/`kotoage`:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama tem como alvo a Máquina Virtual Iroha e seu ABI atual. Não é uma linguagem de origem WASM ou EVM.

### 2. Verificar, construir e validar o artefato {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

A primeira compilação publica o artefato e os sidecars autenticados. A segunda funciona no modo somente leitura `--verify` e falha se qualquer saída existente não corresponder exatamente à fonte atual. Trate o arquivo `.to` e seu manifesto técnico como uma única saída de compilação revisada.

### 3. Execute o bytecode localmente {#_3-run-the-bytecode-locally}

`compute` é um ponto de entrada público de `kotoage`. Execute-o com `debug-call`, que é executado contra artefatos de teste locais sem enviar ou pagar por uma transação.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama inteiros são representados como JSON cadeias, então a tupla decodificada é `["3", "5"]`.

### 4. Implantar através do assistente nativo {#_4-deploy-through-the-native-helper}

O assistente envia os blocos de bytecode, registra o manifesto técnico assinado e envia uma operação `CommitContractDeployment`. Ele fornece cotações de taxa para cada transação e recusa uma cotação que altere o pagador selecionado ou o limite de custo de execução da transação.

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

O pedido com `charge_limits` vazio não contém um identificador de ativo copiado: o auxiliar aceita a cotação ativa exata antes de assinar. Compare o ativo cobrado retornado com a resposta atual do dispensador. As chamadas de contrato só aceitam a seleção de taxas pela cotação ativa tipada; os metadados de transação `gas_asset_id` não fazem parte do contrato da primeira versão.

### 5. Simular e chamar o ponto de entrada implantado {#_5-simulate-and-call-the-deployed-entrypoint}

A simulação executa o ponto de entrada público no Torii sem enviá-lo. A chamada seguinte é uma transação e, portanto, seleciona explicitamente a autoridade como pagadora da taxa. Ambos os comandos fixam o limite de gas em 1.500.000.

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## Verificar {#verify}

Resolva o alias, busque o manifesto técnico on-chain pelo hash criptográfico do código retornado e simule o mesmo ponto de entrada público pelo endereço canônico:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

A implantação só está concluída quando o alias resolve para o endereço retornado, o manifesto é legível sob o mesmo hash do código, as simulações locais e da Torii retornam `["3", "5"]` e a chamada enviada chega a `Applied`.

## Solução de problemas {#troubleshooting}

- `CanRegisterSmartContractCode` falhas exigem uma concessão de operador Taira ou uma alteração de gênese/bootstrap na localnet. Uma conta normal não pode se auto-conceder essa permissão após o fato.
- A rejeição de governança ou de faixa protegida significa que a implantação precisa da atribuição exata de aprovador exigida por essa rede. Coordene a lista de aprovadores; não invente IDs de conta.
- Um manifesto técnico ou ABI incompatível significa que o bytecode, o manifesto técnico e o tempo de execução do software do nó não descrevem o mesmo artefato. Recompile no commit fixado com `--verify`.
- `fee quote changed ... gas bound` significa que a intenção digitada solicitada e a cotação ao vivo não coincidem. Faça uma nova verificação antes de modificar uma transação assinada.
- O assistente de implantação rejeita chaves em linha, modos permissivos de arquivo de chave, links simbólicos e arquivos com múltiplos links antes do envio pela rede.
- Um erro de ponto de entrada somente para visualização significa que `compute` foi direcionado pela família de comandos errada. Este exemplo declara `kotoage`, então use simulação de chamada ou envio.
- As chamadas de contrato exigem um limite de gas tipado e positivo. O contrato de chamada da primeira versão rejeita gas no nível superior e metadados do ativo de taxa.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Kotodama V1 implementação do comando no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Exemplo de código com retorno de tupla no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Assistente de implantação nativo no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Testes de integração de contrato no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Contratos inteligentes](/pt/blockchain/smart-contracts.md)
- [CLI referência](/pt/get-started/operate-iroha-via-cli.md)
