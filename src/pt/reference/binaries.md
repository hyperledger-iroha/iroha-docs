---
translation_locale: pt
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Trabalhar com binários Iroha {#working-with-iroha-binaries}

O fluxo de trabalho do operador Iroha 3 gira em torno de quatro binários primários:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) para a execução de um daemon peer
- `iroha3d_taira` para o lançador de validador canônico Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) para os comandos de CLI e operador
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) para chaves, gênese, redes locais e perfis

## Construir com base na fonte {#build-from-source}

A partir da raiz do espaço de trabalho ascendente:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Os binários de liberação são então disponíveis em `target/release/`.

Para inspecionar a superfície de comando:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Execução direta do repositório {#run-directly-from-the-repository}

Se não quiser instalar qualquer coisa globalmente, utilize `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Image {#docker-image}

O espaço de trabalho upstream utiliza `kagami localnet` e `kagami docker` para gerar Docker Compose Os arquivos que correspondem ao código de saída. `hyperledger/iroha:dev` A imagem pode ser usada com os arquivos gerados.

Coloque o CLI num recipiente:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Caminhar Kagami num recipiente:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Para inicialização de pares, gerar um localnet e Compose arquivo primeiro:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Que Binário Devo Usar? {#which-binary-should-i-use}

- Use `iroha3d` quando estiver a iniciar ou a operar pares fora da versão pública de validador Taira.
- Utilize `iroha3d_taira --sora` apenas para uma implantação de validador canônico Taira; impõe o perfil de cadeia, armazenamento e assinatura de tempo de execução do Taira.
- Usar `iroha` quando precisar consultar o livro-razão, enviar transações ou inspecionar os pontos finais do operador.
- Use `kagami` quando precisar de chaves, manifestos de gênese, pacotes de perfis ou ativos localnet.
