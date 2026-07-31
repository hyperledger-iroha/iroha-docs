---
translation_locale: es
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Carga de nuevo caliente Iroha en un contenedor Docker {#hot-reload-iroha-in-a-docker-container}

Para el desarrollo local normal, prefiere reconstruir la imagen o reiniciar la pila generada Docker Compose a partir de un paquete nuevo Kagami.

## Sustituye el binario de pares {#replace-the-peer-binary}

Construir un binario de daemon compatible con Linux desde el espacio de trabajo upstream:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Copie en un contenedor de pares en funcionamiento, y luego reinicie ese contenedor:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Utilice `docker ps` para confirmar el nombre del contenedor. En la pila generada, los contenedores equivalentes se definen por `./localnet/docker-compose.yml`.

## Recomienda Génesis en una red desechable {#recommit-genesis-in-a-disposable-network}

Para una red desechable Docker, detenga la pila, eliminen el estado generado, regeneren o reemplazan el paquete de genesis firmado y comienzan de nuevo:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

No sustituya la génesis en una red cuyo estado debe ser preservado.

## Utilice la configuración personalizada {#use-custom-configuration}

La configuración de peer actual es TOML. Enlace o copie los archivos clave generados `config.toml`, `genesis.signed.nrt`, y los relacionados a las vías del contenedor esperadas por la imagen, luego reinicie el peer. Mantenga los archivos generados juntos; mezclar archivos de diferentes Kagami ejecuciones puede producir deserialización o fallos de consenso.
