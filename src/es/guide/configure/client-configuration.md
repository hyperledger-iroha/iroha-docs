---
translation_locale: es
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Configuración del cliente {#client-configuration}

Los clientes Iroha, CLI y SDK utilizan la configuración TOML. El repositorio incluye el valor predeterminado actual en `defaults/client.toml`; las redes locales generadas también escriben un `client.toml` correspondiente en su directorio de salida.

::: details Plantilla de configuración del cliente

<<< @/snippets/client.template.toml

:::

## Campos principales {#core-fields}

Como mínimo, una configuración de cliente identifica la cadena, el endpoint Torii API y la cuenta de firma:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` selecciona la cadena a la que pertenecen las transacciones enviadas.
- `torii_url` apunta al par de red Torii HTTP API.
- `[account].domain` es utilizado por los atajos de CLI y la codificación del selector de direcciones; el `AccountId` canónico en sí mismo no tiene dominio.
- `[account].public_key` y `[account].private_key` firman transacciones.

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

Los clientes actuales Iroha también pueden usar la sección opcional `[connect]` para el estado de la cola local:

```toml
[connect]
queue_root = "./queue"
```

Use esto cuando un flujo de trabajo necesite almacenamiento de cola duradero en el lado del cliente.

## Generando configuraciones {#generating-configurations}

Para redes locales desechables, prefiera Kagami porque escribe configuraciones coincidentes Iroha 3, génesis de blockchain, scripts y un README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Usa el `./localnet/client.toml` generado con el CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
