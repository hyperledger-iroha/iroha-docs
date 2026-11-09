---
translation_locale: es
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Recarga en caliente Iroha en un contenedor Docker {#hot-reload-iroha-in-a-docker-container}

Utiliza la recarga en caliente solo para la depuración local. Sigue la guía [Lanzar Iroha 3](/es/get-started/launch-iroha.md) para compilar y ejecutar cuatro validadores en Docker con binarios de la misma revisión.

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

Usa `docker ps` para localizar el contenedor. Comprueba la ruta del demonio en la imagen antes de sustituirlo.

## Recomprometer el génesis de la blockchain en una Red Desechable {#recommit-genesis-in-a-disposable-network}

Un nuevo génesis requiere que el almacenamiento del nodo esté vacío. Usa `python3 poc.py down` y `python3 poc.py up` para reiniciar la misma red. Conserva `state/` junto con sus cuatro volúmenes de Docker.

## Usar configuración personalizada {#use-custom-configuration}

La configuración actual del par usa TOML. Monte o copie los archivos generados `config.toml`, `genesis.signed.nrt` y los archivos de claves asociados en las rutas del contenedor que espera la imagen; después reinicie el par. Mantenga juntos los archivos generados: mezclar archivos de distintas ejecuciones de Kagami puede causar fallos de deserialización o de consenso.
