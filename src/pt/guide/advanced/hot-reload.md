---
translation_locale: pt
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Recarregamento a quente Iroha em um recipiente Docker {#hot-reload-iroha-in-a-docker-container}

Usar recarga quente apenas para depuração local. Para desenvolvimento local normal, prefira reconstruir a imagem ou reiniciar a pilha Docker Compose gerada a partir de um pacote Kagami novo.

## Substitua o binário de pares {#replace-the-peer-binary}

Construa um binário de demônios compatível com o Linux a partir do espaço de trabalho upstream:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Copiá-lo em um recipiente peer em execução, e depois reiniciar o recipiente:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Use `docker ps` para confirmar o nome do recipiente. Na pilha gerada, os recipientes de pares são definidos por `./localnet/docker-compose.yml`.

## Recomenda Genesis em uma rede descartável {#recommit-genesis-in-a-disposable-network}

Um par comete a gênese somente quando o seu armazenamento está vazio. Para uma rede descartável Docker, parar a pilha, remover o estado gerado, regenerar ou substituir o pacote genético assinado. e começar de novo:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Não substituam a gênese numa rede cujo estado deve ser preservado.

## Usar configuração personalizada {#use-custom-configuration}

A configuração de peer atual é TOML. Ligue ou copie os arquivos-chave gerados `config.toml`, `genesis.signed.nrt` e relacionados para os caminhos do contêiner esperados pela imagem, em seguida, reinicie o peer. Mantenha os arquivos gerados juntos; misturar arquivos de diferentes corridas Kagami pode produzir deserialização ou falhas de consenso.
