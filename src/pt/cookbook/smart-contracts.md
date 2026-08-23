---
translation_locale: pt
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Construir e implementar um contrato inteligente {#build-and-deploy-a-smart-contract}

## Resultados {#outcome}

Verificar e compilar um contrato Kotodama V1, executar o seu ponto de entrada público localmente, implantar o artefato verificado IVM, simular o ponto de entrada implantado e apresentá-lo com uma taxa explicitamente cotada pela autoridade.

## Pré-requisitos {#prerequisites}

- Um checkout de fonte Iroha em commit `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust e Cargo.
- O cliente atual `iroha` CLI mais um cliente financiado Taira de [Conecta-se a Taira ](./connect-to-taira.md).
- Caminhos absolutos em `IROHA_CONFIG` e `IROHA_PRIVATE_KEY_FILE`. O arquivo-chave deve ser um arquivo regular de ligação única com o modo `0600`, mantido pelo proprietário; o auxiliar de implantação não tem intencionalmente nenhum argumento de chave privada.
- Autorização do operador Taira. O registro de código de contrato requer `CanRegisterSmartContractCode`, e as implantações protegidas podem exigir atribuição e promulgação de governança. Se Taira não tiver concedido esse acesso, execute a implantação em uma rede local gerada cuja genética concede a permissão.

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

### 1. Copia de um contrato conhecido de bom Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

Trabalhe dentro do checkout Iroha fixado e copie a amostra de retorno duplo do compilador para que a fonte e a cadeia de ferramentas permaneçam no mesmo commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

A fonte completa é pequena e utiliza a sintaxe `seiyaku`/`kotoage` atual:

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

A Kotodama destina-se à máquina virtual Iroha e à sua corrente ABI. Não é uma linguagem de origem WASM ou EVM.

### 2. Verificar, construir e verificar o artefato. {#_2-check-build-and-verify-the-artifact}

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

A primeira construção publica o artefato e os sidecars autenticados. A segunda executa em modo apenas de leitura `--verify` e falha se qualquer saída existente não corresponder exatamente à fonte atual. Trata o arquivo `.to` e seu manifesto como uma saída revisada da construção.

### 3. Exibir o código de byte localmente. {#_3-run-the-bytecode-locally}

`compute` é um ponto de entrada público `kotoage`. Execute-o com `debug-call`, que executa contra dispositivos locais sem apresentar ou pagar uma transação.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Os números inteiros Kotodama são representados como cordas JSON, de modo que o tuple decodificado é `["3", "5"]`.

### 4. Envolver através do auxiliar nativo {#_4-deploy-through-the-native-helper}

O ajudante carrega bits de código, registra o manifesto assinado e envia uma operação `CommitContractDeployment`. Ele cita taxas em cada transação e recusa uma cotação que mude o pagador selecionado ou gas bond.

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

O pedido vazio `charge_limits` não é um identificador de ativo copiado: o ajudante aceita a cotação exata ao vivo antes de assinar. Compare o ativo de cobrança devolvido com a resposta atual da torneira. Não anexe os metadados legais `gas_asset_id` às chamadas de contrato.

### 5. Simulação e chamada do ponto de entrada implantado. {#_5-simulate-and-call-the-deployed-entrypoint}

A simulação executa o ponto de entrada público em Torii sem submissão. A chamada a seguir é uma transação e, portanto, seleciona explicitamente o pagador da taxa de autoridade.

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

Resolver o alias, buscar o manifesto na cadeia com o hash de código devolvido e simular o mesmo ponto de entrada público por endereço canônico:

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

A implantação é completa somente quando o alias se resolve para o endereço devolvido, o manifesto é legível sob o mesmo código hash, a devolução de simulações locais e Torii `["3", "5"]`, e a chamada enviada atinge `Applied`.

## Resolução de problemas {#troubleshooting}

- As falhas `CanRegisterSmartContractCode` exigem uma concessão ao operador Taira ou uma alteração de gênese/bootstrap na localnet. Uma conta normal não pode conceder essa permissão após o fato.
- Governança ou rejeição de linha protegida significa que a implantação precisa da atribuição exata de aprovação exigida por essa rede. Coordinar a lista de aprovadores; não inventar conta IDs.
- Um manifesto ou ABI desajuste significa que o código de byte, manifesto e tempo de execução do nó não descrevem o mesmo artefato. Reconstruir no commit fixado com `--verify`.
- `fee quote changed ... gas bound` significa o desacordo entre a intenção digitada solicitada e a cotação em directo.
- O assistente de implantação rejeita as chaves inline, os modos permissivos de arquivo de chave, os links simbólicos e a multiplicação dos arquivos vinculados antes da submissão da rede.
- Um erro de ponto de entrada apenas para visualização significa que `compute` foi encaminhado através da família de comandos errada. Esta amostra declara `kotoage`, por isso use simulação de chamada ou submissão.
- As chamadas contratuais exigem um limite de gás tipado positivo. Foram rejeitados os metadados sobre o gás ou ativos legais de nível superior.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Kotodama V1 Implementação do comando no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [Amostra de fonte dupla-retorno no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Auxiliar de implantação nativo no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Ensaios de integração de contratos no compromisso fixado ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs)
- [Contratos inteligentes](/pt/blockchain/smart-contracts.md)
- [Referência CLI](/pt/get-started/operate-iroha-via-cli.md)
