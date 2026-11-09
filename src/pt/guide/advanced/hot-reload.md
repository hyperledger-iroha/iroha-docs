---
translation_locale: pt
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Hot Reload Iroha em um Contêiner Docker {#hot-reload-iroha-in-a-docker-container}

Use a recarga a quente apenas para depuração local. Siga o guia [Iniciar Iroha 3](/pt/get-started/launch-iroha.md) para compilar e executar quatro validadores no Docker com binários da mesma revisão.

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

Use `docker ps` para localizar o contêiner. Confira o caminho do daemon na imagem antes de substituí-lo.

## Recomprometer o gênesis da blockchain em uma Rede Descartável {#recommit-genesis-in-a-disposable-network}

Um novo bloco gênese exige que o armazenamento do nó esteja vazio. Use `python3 poc.py down` e `python3 poc.py up` para reiniciar a mesma rede. Mantenha `state/` junto aos quatro volumes do Docker.

## Usar Configuração Personalizada {#use-custom-configuration}

A configuração atual do par de rede usa TOML. Faça uma montagem vinculada ou copie os arquivos gerados `config.toml`, `genesis.signed.nrt` e os arquivos de chave relacionados para os caminhos do contêiner esperados pela imagem; depois, reinicie o par. Mantenha os arquivos gerados juntos: misturar arquivos de execuções distintas do Kagami pode causar falhas de desserialização ou de consenso.
