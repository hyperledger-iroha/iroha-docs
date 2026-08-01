---
translation_locale: es
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Trabajo con binarios Iroha {#working-with-iroha-binaries}

El flujo de trabajo del operador Iroha 3 gira en torno a tres binarios principales:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) para ejecutar un demonio de igual edad
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) para las órdenes de CLI y el operador
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) para llaves, génesis, redes locales y perfiles

## Construye desde la fuente {#build-from-source}

Desde la raíz del espacio de trabajo ascendente:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Los binarios de liberación estarán disponibles en `target/release/`.

Para inspeccionar la superficie de mando:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Se ejecuta directamente desde el repositorio {#run-directly-from-the-repository}

Si no desea instalar nada en todo el mundo, utilice `cargo run`:

```bash
cargo run --bin irohad -- --help
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
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## ¿Qué tipo de binario debo usar? {#which-binary-should-i-use}

- Utilice `irohad` cuando esté comenzando o operando a sus compañeros.
- Utilice `iroha` cuando necesite consultar el libro mayor, enviar transacciones o inspeccionar los puntos finales del operador.
- Utilice `kagami` cuando necesite claves, manifiestos de génesis, paquetes de perfiles o activos de localnet.
