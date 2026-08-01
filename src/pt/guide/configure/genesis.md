---
translation_locale: pt
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Gênesis {#genesis}

O Genesis define o estado inicial da cadeia. A fonte editável é um manifesto JSON, e um nó Iroha 3 consome um arquivo de transação assinado Norito.

::: details Manifesto de gênese por defeito

<<< @/snippets/genesis.json

:::

## Arquivos {#files}

O repositório upstream envia um manifesto padrão em `defaults/genesis.json`. As redes geradas por Kagami escrevem o seu próprio manifesto e a sua transação assinada no diretório de saída:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

O `README.md` gerado nesse diretório regista os arquivos exatos e os comandos de lançamento para o perfil selecionado.

## Configuração entre pares {#peer-configuration}

Os pares apontam para a transação genética assinada na secção `[genesis]` da `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Todos os pares da rede devem concordar sobre a transacção genésica assinada e a chave pública genésica.

## A assinatura do Gênesis {#signing-genesis}

Se você editar um manifesto manualmente, validá-lo e assiná-lo antes de começar os pares:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

Para o NPoS ou Nexus Profiles, incluindo a topologia e BLS Profissionais de posse exigidos pelo perfil gerado Kagami `localnet`, `wizard`, e os comandos de geração de perfil lidam automaticamente com esses detalhes.

## Recomeçar o Gênesis {#recommitting-genesis}

Um peer só comete a gênese quando seu armazenamento está vazio. Para testar uma nova gênese em uma rede local descartável, pare os peers, remova o diretório de estado gerado e comece a partir da nova gênesis assinada. Não substitua a gênesis em uma rede em execução a menos que cada validador esteja coordenando a mesma migração.
