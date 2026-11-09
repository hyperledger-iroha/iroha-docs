---
translation_locale: es
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Trabajando con los binarios Iroha {#working-with-iroha-binaries}

El flujo de trabajo del operador Iroha 3 gira en torno a cuatro binarios principales:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) para ejecutar un demonio de pares de red
- `iroha3d_taira` para el lanzador de validador canónico Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) para CLI y comandos del operador
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) para claves, génesis de blockchain, redes locales y perfiles

## Construir desde la fuente {#build-from-source}

Desde la raíz del espacio de trabajo ascendente:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Los binarios de la versión lanzada están entonces disponibles en `target/release/`.

Para inspeccionar la superficie de comando:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Ejecutar directamente desde el repositorio {#run-directly-from-the-repository}

Si no quieres instalar nada de manera global, usa `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Imagen {#docker-image}

Sigue la guía [Lanzar Iroha 3](/es/get-started/launch-iroha.md) para compilar y ejecutar cuatro validadores en Docker con binarios de la misma revisión.

## ¿Qué binario debo usar? {#which-binary-should-i-use}

- Use `iroha3d` cuando esté iniciando u operando pares de red fuera de la versión pública del validador Taira.
- Use `iroha3d_taira --sora` solo para un despliegue canónico de un validador de Taira; aplica el perfil de cadena, almacenamiento y firmante del entorno de ejecución de Taira.
- Use `iroha` cuando necesite consultar el libro mayor de la blockchain, enviar transacciones o inspeccionar los endpoints de operador API.
- Usa `kagami` cuando necesites claves, manifiestos técnicos de génesis de blockchain, paquetes de perfil o activos de la red local.
