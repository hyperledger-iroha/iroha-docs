---
translation_locale: es
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuración del cliente {#client-configuration}

Iroha CLI y SDK los clientes utilizan TOML Configuración. El repositorio envía el estado predeterminado actual a `defaults/client.toml`; las redes locales generadas también escriben una correspondencia `client.toml` en su directorio de salida.

::: details Modelo de configuración del cliente

<<< @/snippets/client.template.toml

:::

## Los campos centrales {#core-fields}

Por lo menos, una configuración de cliente identifica la cadena, el punto final Torii y la cuenta de firma:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` selecciona la cadena a la que pertenecen las operaciones presentadas.
- `torii_url` puntos en el punto de comparación Torii HTTP API.
- `[account].domain` es utilizado por los atajos CLI y la codificación del seleccionador de direcciones; el canónico `AccountId` en sí mismo es sin dominio.
- `[account].public_key` y `[account].private_key` firmarán las transacciones.

La cuenta debe ya existir en la cadena. Para la red local predeterminada esto es manejado por el manifiesto de génesis agrupado.

::: info Sensibilidad del caso

Los nombres Iroha son sensibles a los casos después del análisis canónico. Por ejemplo, `wonderland.universal`, `Wonderland.universal` y `looking_glass.universal` son dominios literales distintos.

:::

## Autenticación básica {#basic-authentication}

La sección `[basic_auth]` opcional agrega un encabezado HTTP `Authorization` a las solicitudes del cliente. Los pares Iroha no interpretan estas credenciales directamente; uselas cuando Torii está detrás de una proxy inversa como Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Configuración de las transacciones {#transaction-settings}

El comportamiento de la transacción se configura con la sección `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` es el período de vida de la transacción en milisegundos.
- `status_timeout_ms` controla cuánto tiempo espera el cliente para el estado de la transacción.
- `nonce = true` pide al cliente que incluya un nonce para que las transacciones repetidas produzcan diferentes hashes.

## Conectar la configuración de cola {#connect-queue-settings}

Los clientes Iroha actuales también pueden utilizar la sección opcional `[connect]` para el estado de cola local:

```toml
[connect]
queue_root = "./queue"
```

Use esto cuando un flujo de trabajo necesita almacenamiento duradero en la cola del lado del cliente.

## Generación de configuraciones {#generating-configurations}

Para las redes locales desechables, prefiere Kagami porque escribe configuras, génesis, scripts y un README que coincidan con Iroha 3:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Utilice el `./localnet/client.toml` generado con el CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
