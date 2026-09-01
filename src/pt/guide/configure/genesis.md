---
translation_locale: pt
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# gênese da blockchain {#genesis}

a gênese da blockchain define o estado inicial da cadeia. A fonte editável é um manifesto técnico JSON, e um nó Iroha 3 consome um arquivo de transação assinado Norito.

::: details Manifesto técnico de gênese de blockchain padrão

<<< @/snippets/genesis.json

:::

## Arquivos {#files}

O repositório upstream envia um manifesto técnico padrão em `defaults/genesis.json`. Redes geradas por Kagami escrevem seu próprio manifesto técnico e transação assinada no diretório de saída:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

O `README.md` gerado nesse diretório registra os arquivos exatos e os comandos de inicialização para o perfil selecionado.

## Configuração do par de rede {#peer-configuration}

Os pares apontam para a transação de gênese assinada na seção `[genesis]` de `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Todos os pares da rede devem usar a mesma transação de gênese assinada e a mesma chave pública de gênese.

## Assinar a gênese {#signing-genesis}

Se editar um manifesto manualmente, valide-o e assine-o antes de iniciar os pares:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` deve ser um arquivo comum de link único, pertencente ao usuário e no modo `0600`, que contenha um único multihash canônico de chave privada e termine com uma nova linha. Kagami rejeita links simbólicos e nunca aceita uma chave privada bruta de gênese na linha de comando.

Nos perfis NPoS ou Nexus, inclua a topologia e as provas de posse BLS exigidas pelo perfil gerado. Os comandos `localnet`, `wizard` e de geração de perfis do Kagami cuidam desses detalhes automaticamente.

## Confirmar novamente a gênese {#recommitting-genesis}

Um par só confirma a gênese quando seu armazenamento está vazio. Para testar uma nova gênese em uma rede local descartável, pare os pares, remova o diretório de estado gerado e inicie com a nova gênese assinada. Não substitua a gênese de uma rede ativa, a menos que todos os validadores coordenem a mesma migração.
