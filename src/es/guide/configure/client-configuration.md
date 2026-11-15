---
translation_locale: es
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Configuración del cliente {#client-configuration}

Los clientes Iroha, CLI y SDK utilizan la configuración TOML. El repositorio incluye el valor predeterminado actual en `defaults/client.toml`; las redes locales generadas también escriben un `client.toml` correspondiente en su directorio de salida.

::: details Plantilla de configuración del cliente

<<< @/snippets/client.template.toml

:::

## Campos principales {#core-fields}

Como mínimo, la configuración de un cliente identifica la cadena, su identidad de red, el punto de acceso de Torii, el contexto de red de la cuenta y la clave de firma:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` selecciona la cadena a la que pertenecen las transacciones enviadas.
- `network_id` es la identidad de red derivada del génesis a la que se vincula cada solicitud firmada. Configure exactamente uno de estos campos: `network_id` o `network_id_file`; el nodo publica el valor en `GET /v1/accounts/capabilities`.
- `torii_url` apunta al par de red Torii HTTP API.
- `[account].chain_discriminant` selecciona el prefijo I105 de las cuentas de la red. En las redes públicas puede utilizarse `[account].profile = "taira"` o `"minamoto"` en su lugar. Se requiere una de estas dos opciones, y el propio `AccountId` canónico carece de dominio.
- `[account].public_key` y `[account].private_key` firman transacciones; `private_key_file` puede reemplazar a `private_key`.

La cuenta ya debe existir en la cadena. Para la red local predeterminada, esto se maneja mediante el manifiesto técnico de génesis de blockchain incluido.

::: info Sensibilidad a mayúsculas y minúsculas

Iroha los nombres distinguen entre mayúsculas y minúsculas después del análisis canónico. Por ejemplo, `wonderland.universal`, `Wonderland.universal` y `looking_glass.universal` son literales de dominio distintos.

:::

## Autenticación básica {#basic-authentication}

La sección opcional `[basic_auth]` agrega un encabezado HTTP `Authorization` a las solicitudes del cliente. Los pares de red Iroha no interpretan estas credenciales directamente; úselas cuando Torii está detrás de un proxy inverso como Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Configuración de transacciones {#transaction-settings}

El comportamiento de la transacción se configura con la sección `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` es la duración de la transacción en milisegundos.
- `status_timeout_ms` controla cuánto tiempo espera el cliente por el estado de la transacción.
- `nonce = true` solicita al cliente que incluya un nonce para que las transacciones repetidas produzcan hashes distintos.

## Configuración de la cola de conexión {#connect-queue-settings}

La CLI `iroha` también lee una sección opcional `[connect]` para el estado de la cola local. La configuración reutilizable del SDK no la acepta:

```toml
[connect]
queue_root = "./queue"
```

Utilícela cuando un flujo de trabajo necesite almacenamiento duradero de la cola en el cliente. El valor predeterminado de `connect.queue_root` es `~/.iroha/connect`; las rutas relativas se resuelven desde el directorio que contiene el archivo TOML del cliente.

## Generando configuraciones {#generating-configurations}

Para redes locales desechables, prefiera Kagami porque escribe configuraciones coincidentes Iroha 3, génesis de blockchain, scripts y un README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Usa el `./localnet/client.toml` generado con el CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
