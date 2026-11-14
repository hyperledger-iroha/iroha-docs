---
translation_locale: es
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# génesis de la blockchain {#genesis}

El génesis de la blockchain define el estado inicial de la cadena. La fuente editable es un manifiesto técnico JSON, y un nodo Iroha 3 consume un archivo de transacción firmado Norito.

::: details Manifiesto técnico génesis de blockchain predeterminado

<<< @/snippets/genesis.json

:::

## Archivos {#files}

El repositorio de origen incluye una plantilla predeterminada en `defaults/genesis.template.json`. Una plantilla está incompleta y no puede validarse, firmarse ni utilizarse en un nodo hasta que `kagami genesis materialize` la convierta en un manifiesto. Las redes generadas por Kagami escriben su propio manifiesto y su transacción firmada en el directorio de salida:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

El `README.md` generado en ese directorio registra los archivos exactos y los comandos de lanzamiento para el perfil seleccionado.

## Configuración de par de red {#peer-configuration}

Los pares indican la transacción de génesis firmada en la sección `[genesis]` de `config.toml` y fijan su hash esperado en un archivo separado:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

Todos los pares de la red deben coincidir en la transacción de génesis firmada y en la clave pública de génesis. El archivo con el hash esperado es obligatorio tanto en el primer arranque como en los reinicios; `kagami genesis sign --expected-hash-out` lo genera.

## Firmar el génesis {#signing-genesis}

Si edita un manifiesto manualmente, valídelo y fírmelo antes de iniciar los pares:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` debe ser un archivo normal de un solo enlace, propiedad del usuario y con modo `0600`, que contenga un único multihash canónico de clave privada y termine con un salto de línea. Kagami rechaza los enlaces simbólicos y nunca acepta una clave privada de génesis sin procesar en la línea de comandos.

Para los perfiles NPoS o SORA Nexus, incluya la topología y las pruebas de posesión BLS requeridas por el perfil generado. Los comandos de Kagami `localnet generate`, `wizard` y `sora-network generate` se encargan de esos detalles automáticamente.

## Volver a confirmar el génesis {#recommitting-genesis}

Una red nueva comienza con su génesis firmado. Para probar un génesis diferente en una red local desechable, detenga los pares, elimine su directorio de estado generado y arranque con el nuevo génesis firmado. Una red en funcionamiento nunca debe sustituir el génesis como mecanismo de actualización. Los cambios en las definiciones del protocolo requieren transiciones de selección regidas por la gobernanza y una cualificación que cubra las definiciones y obligaciones seleccionadas.
