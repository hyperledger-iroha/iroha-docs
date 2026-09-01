---
translation_locale: es
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Instalar Iroha 3 {#install-iroha-3}

Esta página cubre el flujo de trabajo de instalación actual para la cadena de herramientas y binarios Iroha 3 utilizando el espacio de trabajo upstream `hyperledger-iroha/iroha`.

## 1. Prerrequisitos {#_1-prerequisites}

Instala estos primero:

- [rustup](https://www.rust-lang.org/tools/install), por lo que la cadena de herramientas fijada `rust-toolchain.toml` (`1.93.1`) se instala automáticamente
- `git`
- opcionalmente, Docker y Docker Compose para el inicio rápido multi-par de la localidad

## 2. Clonar el espacio de trabajo {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Construir el espacio de trabajo {#_3-build-the-workspace}

Construye todo:

```bash
cargo build --workspace
```

Para una compilación más pequeña centrada en el operador, compile solo los binarios principales:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Los binarios resultantes se escriben en `target/debug/` o `target/release/`.

## 4. Verificar las herramientas instaladas {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Los cuatro binarios que usualmente usarás son:

- `iroha3d` para un demonio de par de red estándar
- `iroha3d_taira` para el lanzador de validador canónico Taira
- `iroha` para acceder mediante la CLI a Torii y a los endpoints de operador
- `kagami` para claves, manifiestos de génesis y perfiles de red local

## 5. Localnet opcional y ruta Docker {#_5-optional-localnet-and-docker-path}

El flujo actual de red local respaldado por el origen es generado por Kagami. Escribe configuraciones de pares de red, artefactos de génesis de blockchain, configuración del cliente, scripts auxiliares y un archivo Compose opcional que coincide con el código revisado:

- `kagami localnet` para scripts de pares de red local nativos
- `kagami docker` para Docker Compose generado desde un directorio localnet

Continúa con [Lanzar Iroha 3](/es/get-started/launch-iroha.md).
