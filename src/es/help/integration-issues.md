---
translation_locale: es
translation_source: /help/integration-issues.md
translation_source_hash: 2146a236adb3a3b3b896a1992daeecf6713988183ca53e4412f9b616ed2e9085
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Solución de problemas de integración {#troubleshooting-integration-issues}

Esta sección ofrece consejos para la solución de problemas de la integración de Iroha 3. Si el problema que está experimentando no se describe aquí, contáctenos a través de [Telegram](https://t.me/hyperledgeriroha).

## El cliente no puede conectarse {#client-cannot-connect}

Verifique que la configuración del cliente apunte a la dirección Torii del par de la red:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Para los cheques CLI, pase el mismo archivo explícitamente:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Si el par de red se ejecuta en Docker o Kubernetes, use la dirección del host o del servicio que sea accesible desde el proceso cliente. `127.0.0.1` dentro de un contenedor no es la máquina host.

Para las pruebas en la red pública Taira, comience con una comprobación sin firmar del punto de acceso:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Si estos comandos fallan con `502` o errores de TLS, DNS o tiempo de espera, resuelva la conectividad de red o espere a que esté disponible el punto de acceso de la testnet pública antes de depurar las claves de la cuenta o los datos de las transacciones.

## Las transacciones son rechazadas {#transactions-are-rejected}

La mayoría de los fallos en las transacciones son causados por una discrepancia de identidad o autorización:

- la clave pública de la cuenta en la configuración del cliente no coincide con la clave privada utilizada para firmar
- la cuenta no está registrada en el génesis de la blockchain ni por una transacción previa
- la cuenta carece del token de permiso o del rol requerido por el validador de tiempo de ejecución del software
- un ID de dominio carece de la calificación de su espacio de datos, como en `domain.dataspace`

Usa `--output-format text` mientras depuras los comandos CLI para que los errores sean más fáciles de leer:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority --output-format text tx ping --msg "hello"
```

## Las consultas devuelven resultados vacíos {#queries-return-empty-results}

Los resultados vacíos de la consulta no siempre significan que la consulta falló. Verifica:

- la transacción que debería crear el objeto fue confirmada
- el dominio consultado, la definición de activo o el ID de la cuenta es canónico
- la paginación o los filtros no están excluyendo la fila esperada
- el cliente está conectado a la red prevista, no a otra red local

Para las comprobaciones de dominio, comienza con la consulta más amplia:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

## Los flujos de eventos o bloques se detienen temprano {#event-or-block-streams-stop-early}

Los ejemplos de flujos de bloques y eventos utilizan los puntos de acceso de transmisión de Torii. Verifique que el par siga en ejecución y, después, pruebe con un tiempo de espera:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Para las integraciones HTTP, compare las rutas de sus puntos de acceso con la [referencia actual de puntos de acceso de Torii](/es/reference/torii-endpoints.md).
