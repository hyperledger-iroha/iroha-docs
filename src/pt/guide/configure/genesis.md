---
translation_locale: pt
translation_source: /guide/configure/genesis.md
translation_source_hash: 2a4a43b6ac873cc0c860631e307e52b047ba6a08691bf3e4c5872cc22c81a0bd
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# gênese da blockchain {#genesis}

a gênese da blockchain define o estado inicial da cadeia. A fonte editável é um manifesto técnico JSON, e um nó Iroha 3 consome um arquivo de transação assinado Norito.

::: details Modelo de origem da gênese padrão (defaults/genesis.template.json)

<<< @/snippets/genesis.json

:::

## Arquivos {#files}

O repositório upstream fornece um modelo padrão em `defaults/genesis.template.json`. Um modelo é incompleto e não pode ser validado, assinado ou usado por um nó até que `kagami genesis materialize` o transforme em um manifesto. Redes geradas por Kagami gravam seu próprio manifesto e a transação assinada no diretório de saída:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

O `README.md` gerado nesse diretório registra os arquivos exatos e os comandos de inicialização para o perfil selecionado.

## Configuração do par de rede {#peer-configuration}

Os pares apontam para a transação de gênese assinada na seção `[genesis]` de `config.toml` e fixam o hash esperado em um arquivo separado:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

Todos os pares da rede devem concordar com a transação de gênese assinada e com a chave pública da gênese. Toda inicialização, seja a primeira ou uma reinicialização, precisa do hash esperado: configure exatamente um entre `expected_hash_file` e o `expected_hash` em linha. `kagami genesis sign --expected-hash-out` grava o arquivo.

## Assinar a gênese {#signing-genesis}

Se editar um manifesto manualmente, valide-o e assine-o antes de iniciar os pares:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` deve ser um arquivo comum de link único, pertencente ao usuário e no modo `0600`, que contenha um único multihash canônico de chave privada e termine com uma nova linha. Kagami rejeita links simbólicos e nunca aceita uma chave privada bruta de gênese na linha de comando.

Toda gênese assinada, permissionada ou NPoS, deve incluir uma topologia exata de `3f + 1` validadores com uma Prova-de-Posse BLS para cada validador. Os comandos Kagami `localnet generate`, `wizard` e `sora-network generate` tratam desses detalhes automaticamente.

## Confirmar novamente a gênese {#recommitting-genesis}

Uma rede nova começa a partir de seu gênese assinado. Para testar um gênese diferente em uma rede local descartável, pare os nós pares, remova o diretório de estado gerado por eles e inicie a rede a partir do novo gênese assinado. Uma rede em funcionamento nunca deve substituir o gênese como mecanismo de atualização. Alterações nas definições do protocolo exigem transições de seleção aprovadas pela governança e qualificação para as definições e obrigações selecionadas.
