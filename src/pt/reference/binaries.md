---
translation_locale: pt
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Trabalhar com binários Iroha {#working-with-iroha-binaries}

O fluxo de trabalho do operador Iroha 3 gira em torno de três binários primários:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) para a execução de um daemon peer
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) para os comandos de CLI e operador
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) para chaves, gênese, redes locais e perfis

## Construir com base na fonte {#build-from-source}

A partir da raiz do espaço de trabalho ascendente:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Os binários de liberação são então disponíveis em `target/release/`.

Para inspecionar a superfície de comando:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Execução direta do repositório {#run-directly-from-the-repository}

Se não quiser instalar qualquer coisa globalmente, utilize `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Image {#docker-image}

O espaço de trabalho upstream utiliza `kagami localnet` e `kagami docker` para gerar Docker Compose Os arquivos que correspondem ao código de saída. `hyperledger/iroha:dev` A imagem pode ser usada com os arquivos gerados.

Colocar o CLI em um recipiente:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Caminhar Kagami num recipiente:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Para inicialização de pares, gerar um localnet e Compose arquivo primeiro:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Que Binário Devo Usar? {#which-binary-should-i-use}

- Utilize `irohad` quando estiver a iniciar ou a operar os seus pares.
- Usar `iroha` quando precisar consultar o livro-razão, enviar transações ou inspecionar os pontos finais do operador.
- Use `kagami` quando precisar de chaves, manifestos de gênese, pacotes de perfis ou ativos localnet.
