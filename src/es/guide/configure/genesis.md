---
translation_locale: es
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# Génesis {#genesis}

Génesis define el estado inicial de la cadena.La fuente editable es una JSON manifiesto,
y un Iroha 3 el nodo consume un firmado Norito archivo de transacciones.

::: details Manifiesto de génesis predeterminado

<<< @/snippets/genesis.json

:::

## Archivos {#files}

El repositorio ascendente envía un manifiesto predeterminado en `defaults/genesis.json`.
Kagami-Las redes generadas escriben su propio manifiesto y transacción firmada en
el directorio de salida:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

el generado `README.md` en ese directorio registra los archivos exactos y ejecuta
comandos para el perfil seleccionado.

## Configuración de pares {#peer-configuration}

Los pares señalan la transacción de génesis firmada en el `[genesis]` sección de
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Todos los pares en la red deben estar de acuerdo sobre la transacción de génesis firmada y el
clave pública de génesis.

## Firmando Génesis {#signing-genesis}

Si edita un manifiesto manualmente, valídelo y fírmelo antes de iniciar con los pares:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` debe ser un modelo propiedad del propietario.`0600`, enlace único
archivo normal que contiene un multihash canónico de clave privada y un archivo final
nueva línea. Kagami Rechaza los vínculos simbólicos y nunca acepta una génesis cruda y privada.
clave en la línea de comando.

Para NPoS o Nexus perfiles, incluyen la topología y BLS Pruebas de posesión
requerido por el perfil generado. Kagami `localnet`, `wizard`, y perfil
Los comandos de generación manejan esos detalles automáticamente.

## Reenviar Génesis {#recommitting-genesis}

Un par solo comete génesis cuando su almacenamiento está vacío.Para probar una nueva génesis en
una red local desechable, detener a los pares, eliminar su directorio de estado generado,
y comenzar desde la nueva génesis firmada.No reemplace genesis en un running
red a menos que cada validador esté coordinando la misma migración.
