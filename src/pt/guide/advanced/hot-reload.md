---
translation_locale: pt
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Hot Reload Iroha em um Contêiner Docker {#hot-reload-iroha-in-a-docker-container}

Use o recarregamento a quente apenas para depuração local. Para desenvolvimento local normal, prefira reconstruir a imagem ou reiniciar a pilha Docker Compose gerada a partir de um novo pacote Kagami.

## Substituir o binário do par de rede {#replace-the-peer-binary}

Construa um binário de daemon compatível com Linux a partir do espaço de trabalho upstream:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Copie-o para um contêiner de par de rede em execução e, em seguida, reinicie esse contêiner:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Use `docker ps` para confirmar o nome do contêiner. Na pilha gerada, os contêineres pares de rede são definidos por `./docker-compose.yml`.

## Recomprometer o gênesis da blockchain em uma Rede Descartável {#recommit-genesis-in-a-disposable-network}

Um par de rede realiza o gênesis da blockchain apenas quando seu armazenamento está vazio. Para uma rede descartável Docker, pare a stack, remova o estado gerado, regenere ou substitua o pacote de gênesis da blockchain assinado e inicie novamente:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Não substitua a gênese de uma rede cujo estado precise ser preservado.

## Usar Configuração Personalizada {#use-custom-configuration}

A configuração atual do par de rede usa TOML. Faça uma montagem vinculada ou copie os arquivos gerados `config.toml`, `genesis.signed.nrt` e os arquivos de chave relacionados para os caminhos do contêiner esperados pela imagem; depois, reinicie o par. Mantenha os arquivos gerados juntos: misturar arquivos de execuções distintas do Kagami pode causar falhas de desserialização ou de consenso.
