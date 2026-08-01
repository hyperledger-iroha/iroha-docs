---
translation_locale: es
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Génesis {#genesis}

Génesis define el estado inicial de la cadena. La fuente editable es un JSON manifiesto, y un nodo Iroha 3 consume un archivo de transacción firmado Norito.

::: details Manifiesto de génesis por defecto

<<< @/snippets/genesis.json

:::

## Archivos {#files}

El repositorio upstream envía un manifiesto predeterminado al `defaults/genesis.json`. Las redes generadas por Kagami escriben su propio manifiesto y transacción firmada en el directorio de salida:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

El `README.md` generado en ese directorio registra los archivos exactos y los comandos de lanzamiento para el perfil seleccionado.

## Configuración entre pares {#peer-configuration}

Los pares señalan la transacción de génesis firmada en la sección `[genesis]` del `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Todos los pares de la red deben ponerse de acuerdo en la transacción genesis firmada y en la clave pública genesis.

## Firmar el Génesis {#signing-genesis}

Si edita manualmente un manifiesto, valida y firma antes de comenzar a trabajar con pares:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

Para NPOS o Nexus los perfiles, incluyen la topología y BLS Las pruebas de posesión requeridas por el perfil generado. Kagami `localnet`, `wizard`, y los comandos de generación de perfil manejan esos detalles automáticamente.

## Recomiendo el Génesis {#recommitting-genesis}

Para probar una nueva genesis en un localnet desechable, detenga a los pares, elimine su directorio de estado generado y comience desde la nueva genesis firmada. No reemplace la genesis en una red en ejecución a menos que cada validador esté coordinando la misma migración.
