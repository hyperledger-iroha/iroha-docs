---
translation_locale: es
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# génesis de la blockchain {#genesis}

El génesis de la blockchain define el estado inicial de la cadena. La fuente editable es un manifiesto técnico JSON, y un nodo Iroha 3 consume un archivo de transacción firmado Norito.

::: details Manifiesto técnico génesis de blockchain predeterminado

<<< @/snippets/genesis.json

:::

## Archivos {#files}

El repositorio ascendente envía un manifiesto técnico predeterminado en `defaults/genesis.json`. Las redes generadas por Kagami escriben su propio manifiesto técnico y transacción firmada en el directorio de salida:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

El `README.md` generado en ese directorio registra los archivos exactos y los comandos de lanzamiento para el perfil seleccionado.

## Configuración de par de red {#peer-configuration}

Los pares apuntan a la transacción de génesis firmada en la sección `[genesis]` de `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Todos los pares de la red deben usar la misma transacción de génesis firmada y la misma clave pública de génesis.

## Firmar el génesis {#signing-genesis}

Si edita un manifiesto manualmente, valídelo y fírmelo antes de iniciar los pares:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` debe ser un archivo normal de un solo enlace, propiedad del usuario y con modo `0600`, que contenga un único multihash canónico de clave privada y termine con un salto de línea. Kagami rechaza los enlaces simbólicos y nunca acepta una clave privada de génesis sin procesar en la línea de comandos.

Para los perfiles NPoS o Nexus, incluya la topología y las pruebas de posesión BLS que exige el perfil generado. Los comandos `localnet`, `wizard` y de generación de perfiles de Kagami se ocupan automáticamente de esos detalles.

## Volver a confirmar el génesis {#recommitting-genesis}

Un par solo confirma el génesis cuando su almacenamiento está vacío. Para probar un génesis nuevo en una red local desechable, detenga los pares, elimine el directorio de estado generado y arranque con el nuevo génesis firmado. No sustituya el génesis de una red activa salvo que todos los validadores coordinen la misma migración.
