---
translation_locale: pt
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Recarregamento a quente Iroha em um recipiente Docker {#hot-reload-iroha-in-a-docker-container}

Usar recarga quente apenas para depuração local. Para desenvolvimento local normal, prefira reconstruir a imagem ou reiniciar a pilha Docker Compose gerada a partir de um pacote Kagami novo.

## Substitua o binário de pares {#replace-the-peer-binary}

Construa um binário de demônios compatível com o Linux a partir do espaço de trabalho upstream:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Copiá-lo em um recipiente peer em execução, e depois reiniciar o recipiente:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Use `docker ps` para confirmar o nome do recipiente. Na pilha gerada, os recipientes de pares são definidos por `./docker-compose.yml`.

## Recomenda Genesis em uma rede descartável {#recommit-genesis-in-a-disposable-network}

Um par comete a gênese somente quando o seu armazenamento está vazio. Para uma rede descartável Docker, parar a pilha, remover o estado gerado, regenerar ou substituir o pacote genético assinado. e começar de novo:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Não substituam a gênese numa rede cujo estado deve ser preservado.

## Usar configuração personalizada {#use-custom-configuration}

A configuração de peer atual é TOML. Ligue ou copie os arquivos-chave gerados `config.toml`, `genesis.signed.nrt` e relacionados para os caminhos do contêiner esperados pela imagem, em seguida, reinicie o peer. Mantenha os arquivos gerados juntos; misturar arquivos de diferentes corridas Kagami pode produzir deserialização ou falhas de consenso.
