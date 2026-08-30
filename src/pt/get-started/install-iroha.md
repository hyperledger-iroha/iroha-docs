---
translation_locale: pt
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Instalação Iroha 3 {#install-iroha-3}

Esta página abrange o fluxo de trabalho de instalação atual para a cadeia de ferramentas Iroha 3 e os binários que utilizam o espaço de trabalho upstream `hyperledger-iroha/iroha`.

## 1. Pré-requisitos {#_1-prerequisites}

Instale estes primeiro:

- [rustup](https://www.rust-lang.org/tools/install), para que a cadeia de ferramentas fixada `rust-toolchain.toml` (`1.93.1`) seja instalada automaticamente.
- `git`
- opcionalmente, Docker e Docker Compose para o arranque rápido local multi-peer

## 2. Clonar o espaço de trabalho {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Construir o Espaço de Trabalho {#_3-build-the-workspace}

Construir tudo:

```bash
cargo build --workspace
```

Para uma construção menor focada no operador, compilar apenas os binários principais:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Os binários resultantes são escritos a `target/debug/` ou a `target/release/`.

## 4. Verifique as ferramentas instaladas. {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Os quatro binários que você usará normalmente são:

- `iroha3d` para um daemon padrão
- `iroha3d_taira` para o lançador de validador canônico Taira
- `iroha` para CLI acesso a Torii e pontos finais do operador
- `kagami` para chaves, manifestos de gênese e perfis da rede local

## 5. Localnet opcional e caminho Docker {#_5-optional-localnet-and-docker-path}

O fluxo localnet atual apoiado pela fonte é gerado por Kagami. Ele escreve configurações de pares, artefatos genéticos, configuração do cliente, scripts auxiliares e um arquivo Compose opcional que corresponde ao código chequeado:

- `kagami localnet` para escritos locais nativos por pares
- `kagami docker` para o Docker Compose gerado a partir de um diretório localnet

Continuar com [Lançamento Iroha 3](/pt/get-started/launch-iroha.md).
