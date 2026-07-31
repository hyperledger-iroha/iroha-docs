---
translation_locale: es
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Instalar Iroha 3 {#install-iroha-3}

Esta página cubre el flujo de trabajo de instalación actual para la cadena de herramientas Iroha 3 y los binarios que utilizan el espacio de trabajo `hyperledger-iroha/iroha` upstream.

## 1.Los requisitos previos {#_1-prerequisites}

Instala esto primero:

- [rustup](https://www.rust-lang.org/tools/install), por lo que se instala automáticamente la cadena de herramientas fijada `rust-toolchain.toml` (`1.93.1`)
- `git`
- opcionalmente, Docker y Docker Compose para el arranque rápido local multi-peer.

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

Para una construcción más pequeña centrada en el operador, compilar sólo los binarios principales:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Los binarios resultantes se escribirán a `target/debug/` o a `target/release/`.

## 4. Verificar las herramientas instaladas {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Los tres binarios que usualmente usará son:

- `irohad` para el demonio de la pareja
- `iroha` para el acceso de CLI a Torii y puntos finales del operador
- `kagami` para las claves, los manifestos de génesis y los perfiles de localnet

## 5. Localnet y ruta Docker opcionales. {#_5-optional-localnet-and-docker-path}

El flujo localnet actual respaldado por la fuente es generado por Kagami. Escribe configuraciones de pares, artefactos genesis, configuración del cliente, scripts auxiliares y un archivo Compose opcional que coincide con el código eliminado:

- `kagami localnet` para las escrituras locales nativas por igual
- `kagami docker` para Docker Compose generado a partir de un directorio localnet.

Sigue con [Lanzamiento Iroha 3 ](/es/get-started/launch-iroha.md).
