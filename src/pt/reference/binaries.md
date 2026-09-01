---
translation_locale: pt
translation_source: /reference/binaries.md
translation_source_hash: 3d1cddb466092770376bcb150963d5df29a6ebc5cf6e670baa3a5c277082fdab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Trabalhando com Binários Iroha {#working-with-iroha-binaries}

O fluxo de trabalho do operador Iroha 3 gira em torno de quatro binários principais:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) para executar um daemon de par de rede
- `iroha3d_taira` para o inicializador do validador canônico Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) para CLI e comandos do operador
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) para chaves, gênese de blockchain, redes locais e perfis

## Construir a partir do código-fonte {#build-from-source}

A partir da raiz do espaço de trabalho upstream:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Os binários de lançamento estão então disponíveis em `target/release/`.

Para inspecionar a superfície do comando:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Executar Diretamente do Repositório {#run-directly-from-the-repository}

Se você não quiser instalar nada globalmente, use `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Imagem {#docker-image}

O espaço de trabalho upstream usa `kagami localnet` e `kagami docker` para gerar arquivos Docker Compose que correspondem ao código retirado do repositório. A imagem `hyperledger/iroha:dev` pode ser usada com esses arquivos gerados.

Execute o CLI em um contêiner:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Execute Kagami em um contêiner:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Para o inicialização do par de rede, gere primeiro um localnet e um arquivo Compose:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Qual binário devo usar? {#which-binary-should-i-use}

- Use `iroha3d` quando estiver iniciando ou operando pares de rede fora da versão pública do validador Taira.
- Use `iroha3d_taira --sora` apenas para uma implantação de validador Taira canônica; ele aplica o perfil de cadeia, armazenamento e assinante de tempo de execução de Taira.
- Use `iroha` quando você precisar consultar o livro-razão da blockchain, enviar transações ou inspecionar os endpoints do operador API.
- Use `kagami` quando precisar de chaves, manifestos de gênese, pacotes de perfil ou ativos da rede local.
