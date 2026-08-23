---
translation_locale: es
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Resolución de problemas en la integración {#troubleshooting-integration-issues}

Esta sección ofrece consejos de solución de problemas para la integración Iroha 3. Si el problema que está experimentando no está descrito aquí, póngase en contacto con nosotros a través de [Telegram](https://t.me/hyperledgeriroha).

## El cliente no puede conectarse {#client-cannot-connect}

Compruebe que la configuración del cliente apunta a la dirección Torii de la pareja:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Para los controles CLI, pase el mismo expediente explícitamente:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Si el peer se ejecuta en Docker o Kubernetes, utilice la dirección del host o servicio que sea accesible desde el proceso cliente. `127.0.0.1` dentro de un recipiente no es la máquina host.

Para los ensayos públicos Taira, comience con una sonda de punto final sin firmar:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Si estos comandos fallan con `502`, TLS, DNS o errores de tiempo límite, fije la accesibilidad a la red o espere al punto final de testnet público antes de desactivar las claves de cuenta o las cargas útiles de las transacciones.

## Las transacciones se rechazan {#transactions-are-rejected}

La mayoría de las fallas en las transacciones son causadas por una incompatibilidad de identidad o autorización:

- La clave pública de la cuenta en la configuración del cliente no coincide con la clave privada utilizada para firmar.
- la cuenta no está registrada en génesis o por una transacción previa
- la cuenta carece del token de permiso o el papel requerido por el validador de tiempo de ejecución
- un dominio ID carece de su calificación de espacio de datos, como `domain.dataspace`

Utilice `--output-format text` mientras haga el depuración de los comandos CLI para que se puedan leer más fácilmente los errores:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Las consultas devuelven resultados vacíos {#queries-return-empty-results}

Los resultados de la consulta vacíos no siempre significan que la consulta haya fallado.

- se cometió la transacción que debería crear el objeto
- el dominio, la definición de activos o la cuenta ID solicitados es canónico
- Paginación o filtros no excluyen la fila esperada
- el cliente está conectado a la red prevista y no a otra red local

Para las comprobaciones de dominio, comience con la consulta más amplia:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Las corrientes de eventos o bloqueo se detienen temprano {#event-or-block-streams-stop-early}

Los ejemplos de flujo de bloques y eventos dependen de los puntos finales de streaming Torii. Verifique si el peer todavía se ejecuta, luego prueba con un tiempo:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Para las integraciones HTTP, compare sus rutas de punto final con la referencia actual [Torii del punto final ](/es/reference/torii-endpoints.md).
