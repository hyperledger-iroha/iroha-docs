---
translation_locale: es
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Trabajo con binarios Iroha {#working-with-iroha-binaries}

El flujo de trabajo del operador Iroha 3 gira en torno a cuatro binarios primarios:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) para ejecutar un demonio de igual edad
- `iroha3d_taira` para el lanzador de validadores canónicos Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) para las órdenes de CLI y el operador
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) para llaves, génesis, redes locales y perfiles

## Construye desde la fuente {#build-from-source}

Desde la raíz del espacio de trabajo ascendente:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Los binarios de liberación estarán disponibles en `target/release/`.

Para inspeccionar la superficie de mando:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Se ejecuta directamente desde el repositorio {#run-directly-from-the-repository}

Si no desea instalar nada en todo el mundo, utilice `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Imagen {#docker-image}

El espacio de trabajo upstream utiliza `kagami localnet` y `kagami docker` para generar archivos Docker Compose que coinciden con el código verificado. La imagen `hyperledger/iroha:dev` se puede usar con esos archivos generados.

Coloque el CLI en un contenedor:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Se ejecutará Kagami en un recipiente:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Para la inicialización de pares, genera una red local y compone el archivo primero:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## ¿Qué tipo de binario debería usar? {#which-binary-should-i-use}

- Utilice `iroha3d` cuando esté iniciando o operando pares fuera de la versión pública del validador Taira.
- Utilizar `iroha3d_taira --sora` sólo para un despliegue de validador canónico Taira; hace cumplir el perfil de cadena, almacenamiento y firma de tiempo de ejecución de Taira.
- Utilice `iroha` cuando necesite consultar el libro mayor, enviar transacciones o inspeccionar los puntos finales del operador.
- Utilice `kagami` cuando necesite claves, manifiestos de génesis, paquetes de perfiles o activos de localnet.
