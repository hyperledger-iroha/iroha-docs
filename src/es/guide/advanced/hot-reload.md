---
translation_locale: es
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Recarga en caliente Iroha en un contenedor Docker {#hot-reload-iroha-in-a-docker-container}

Usa la recarga en caliente solo para depuración local. Para el desarrollo local normal, es preferible reconstruir la imagen o reiniciar la pila generada Docker Compose desde un paquete Kagami nuevo.

## Reemplazar el par de red Binary {#replace-the-peer-binary}

Construya un binario de demonio compatible con Linux desde el espacio de trabajo original:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Cópialo en un contenedor de par de red en funcionamiento, luego reinicia ese contenedor:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Utilice `docker ps` para confirmar el nombre del contenedor. En la pila generada, los contenedores pares de red están definidos por `./docker-compose.yml`.

## Recomprometer el génesis de la blockchain en una Red Desechable {#recommit-genesis-in-a-disposable-network}

Un par de red solo comete el génesis de blockchain cuando su almacenamiento está vacío. Para una red desechable Docker, detenga la pila, elimine el estado generado, regenere o reemplace el paquete de génesis de blockchain firmado y comience de nuevo:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

No sustituya el génesis de una red cuyo estado deba conservarse.

## Usar configuración personalizada {#use-custom-configuration}

La configuración actual del par usa TOML. Monte o copie los archivos generados `config.toml`, `genesis.signed.nrt` y los archivos de claves asociados en las rutas del contenedor que espera la imagen; después reinicie el par. Mantenga juntos los archivos generados: mezclar archivos de distintas ejecuciones de Kagami puede causar fallos de deserialización o de consenso.
