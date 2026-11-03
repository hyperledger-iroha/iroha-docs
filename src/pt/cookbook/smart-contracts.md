---
translation_locale: pt
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Construir e Implantar um Contrato Inteligente {#build-and-deploy-a-smart-contract}

## Resultado {#outcome}

Verifique e compile um contrato Kotodama V1, execute localmente sua função de visualização pública, implante o artefato IVM verificado com taxas pagas pela autoridade e selecionadas explicitamente, e leia a função de visualização implantada através do Torii.

## Pré-requisitos {#prerequisites}

- Uma cópia funcional do código-fonte Iroha no commit `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust, e Cargo.
- O atual `iroha` CLI e `musubi` (executado como `cargo run -p musubi --` na cópia de trabalho) mais um cliente Taira financiado de [Conectar-se a Taira](./connect-to-taira.md).
- Um caminho absoluto em `IROHA_CONFIG`. A vinculação de rede do Musubi armazena uma referência a esse arquivo de cliente e assina a implantação com sua chave de conta.
- Autoridade sobre o alias. O executor exige `CanManageAccountAlias` para o alias exato do contrato ou para seu escopo pai: o domínio proprietário em `name::domain.dataspace`, ou o espaço de dados em `name::dataspace`. Contas registradas não precisam de uma permissão separada de registro de código, e espaços de nomes protegidos também exigem o fluxo de governança da rede. Os exemplos usam `cookbook_tuple::universal`; na Taira, substitua-o por um alias em um domínio seu, ou implante em uma rede local gerada cuja gênese conceda o escopo do alias.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Passos {#steps}

### 1. Copie um contrato Kotodama V1 conhecido por estar bom {#_1-copy-a-known-good-kotodama-v1-contract}

Trabalhe dentro do checkout fixado Iroha e copie o exemplo de retorno de tupla do compilador para que o código-fonte e a cadeia de ferramentas permaneçam no mesmo commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

O código-fonte completo é pequeno: uma função auxiliar privada `fn` e uma `view fn` pública somente leitura que permite explicitamente qualquer chamador:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama tem como alvo a Máquina Virtual Iroha e seu ABI atual. Não é uma linguagem de origem WASM ou EVM.

### 2. Verificar, construir e validar o artefato {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

A primeira compilação publica o artefato e os sidecars autenticados. A segunda funciona no modo somente leitura `--verify` e falha se qualquer saída existente não corresponder exatamente à fonte atual. Trate o arquivo `.to` e seu manifesto técnico como uma única saída de compilação revisada.

### 3. Execute o bytecode localmente {#_3-run-the-bytecode-locally}

`compute` é uma `view fn` pública somente leitura. Execute-a com `debug-view`, que executa localmente o bytecode compilado contra dados de teste opcionais sem enviar ou pagar por uma transação.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama inteiros são representados como JSON cadeias, então a tupla decodificada é `["3", "5"]`.

### 4. Implantar o artefato verificado com Musubi {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` inspeciona contratos, executa suas funções de visualização e os depura, mas não os implanta, então as implantações na Taira passam pelo Musubi. Seu serviço de implantação envia os blocos de bytecode, registra o manifesto técnico verificado e envia uma operação `CommitContractDeployment`. Ele cota cada transação, recusa uma cotação que altere o pagador selecionado, a revisão do patrocinador ou o limite de gas, e implanta o artefato pré-compilado somente depois que a compilação do pacote com dependências travadas reproduz seus hashes de código e de ABI. Em uma rede local gerenciada pelo Kagami, `kagami contract deploy` implanta em vez disso `./build/tuple_return_demo.to` com `--alias cookbook_tuple::universal --json`; seu recibo fica em `.receipt`, e `kagami context show` imprime a configuração do cliente a ser usada como `IROHA_CONFIG`.

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

A vinculação usa `--fee-payer authority`; o Musubi cota a taxa exata, no ativo de taxa da Taira, antes de assinar. Compare o ativo cobrado retornado com o publicado pela política atual do dispensador. As chamadas de contrato só aceitam a seleção de taxas pela cotação ativa tipada; os metadados de transação `gas_asset_id` não fazem parte do contrato da primeira versão.

### 5. Ler a função de visualização implantada {#_5-read-the-deployed-view}

`contract view` executa o ponto de entrada somente leitura no Torii sem transação nem taxa. Uma função de visualização não tem forma de transação: o Torii rejeita um seletor de visualização em suas rotas de chamada.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Verificar {#verify}

Resolva o alias, busque o manifesto técnico on-chain pelo hash criptográfico do código que o Torii informa para a função de visualização implantada e execute a mesma função pelo endereço canônico:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

A implantação só está concluída quando o recibo de implantação informa que o artefato armazenado foi verificado, o alias resolve para o endereço retornado, o manifesto é legível sob o mesmo hash do código, e as funções de visualização local e do Torii retornam `["3", "5"]`.

## Solução de problemas {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`, ou a mensagem do executor `authority is not permitted to manage contract alias`, significa que a conta não pode vincular esse alias. Use um alias em um domínio seu, ou obtenha do proprietário desse escopo a concessão exata do alias ou a concessão do seu domínio ou espaço de dados; na rede local, conceda-a na gênese.
- Uma rejeição por espaço de nomes protegido significa que o espaço de nomes do alias é governado. Listar IDs de contas aprovadoras não é evidência de aprovação; use o fluxo de governança da rede (`iroha app gov deploy propose`) para esse espaço de nomes, ou escolha um alias fora dele.
- Uma incompatibilidade de manifesto ou de ABI significa que o bytecode, o manifesto e o ambiente de execução do nó não descrevem o mesmo artefato. Recompile no commit fixado e depois execute de novo a compilação com `--verify`.
- `fee quote changed ... gas bound` significa que a intenção digitada solicitada e a cotação ao vivo não coincidem. Faça uma nova verificação antes de modificar uma transação assinada.
- Uma implantação interrompida mantém seu plano assinado em um diário. Recupere-a com `musubi deploy --resume <JOURNAL>` em vez de assinar um novo plano.
- `is read-only and cannot be invoked as a transaction` ou `is not a kotoage or lifecycle entrypoint` significa que `compute` foi enviado a um comando de chamada. Este exemplo declara `view fn`, então use `debug-view` localmente e `view` no Torii.
- As chamadas de contrato exigem um limite de gas tipado e positivo. O contrato de chamada da primeira versão rejeita gas no nível superior e metadados do ativo de taxa.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Implementação do comando Kotodama V1 no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Exemplo de código com retorno de tupla no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Comando de implantação do Musubi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) e o [serviço nativo de implantação de contratos](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) no commit fixado
- [Testes de integração de contrato no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Contratos inteligentes](/pt/blockchain/smart-contracts.md)
- [CLI referência](/pt/get-started/operate-iroha-via-cli.md)
