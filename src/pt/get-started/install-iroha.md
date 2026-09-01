---
translation_locale: pt
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Instalar Iroha 3 {#install-iroha-3}

Esta página aborda o fluxo de instalação atual para o toolchain e binários Iroha 3 usando o espaço de trabalho upstream `hyperledger-iroha/iroha`.

## 1. Pré-requisitos {#_1-prerequisites}

Instale estes primeiro:

- [rustup](https://www.rust-lang.org/tools/install), então o toolchain fixo `rust-toolchain.toml` (`1.93.1`) é instalado automaticamente
- `git`
- opcionalmente, Docker e Docker Compose para o início rápido local com vários pares

## 2. Clonar o Espaço de Trabalho {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Construir o Espaço de Trabalho {#_3-build-the-workspace}

Construa tudo:

```bash
cargo build --workspace
```

Para uma compilação menor voltada para operadores, compile apenas os binários principais:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Os binários resultantes são gravados em `target/debug/` ou `target/release/`.

## 4. Verifique as Ferramentas Instaladas {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Os quatro binários que você normalmente usará são:

- `iroha3d` para um daemon padrão de par de rede
- `iroha3d_taira` para o inicializador do validador canônico Taira
- `iroha` para acessar o Torii e os endpoints de operador pela CLI
- `kagami` para chaves, manifestos de gênese e perfis de rede local

## 5. Localnet Opcional e Caminho Docker {#_5-optional-localnet-and-docker-path}

O fluxo localnet atual com suporte a fonte é gerado por Kagami. Ele escreve as configurações de pares da rede, artefatos de gênese do blockchain, configuração do cliente, scripts auxiliares e um arquivo Compose opcional que corresponde ao código verificado:

- `kagami localnet` para scripts de pares nativos de rede local
- `kagami docker` para Docker Compose gerado a partir de um diretório localnet

Continue com [Iniciar Iroha 3](/pt/get-started/launch-iroha.md).
