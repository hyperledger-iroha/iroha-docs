---
translation_locale: es
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
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
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Si el par de red se ejecuta en Docker o Kubernetes, use la dirección del host o del servicio que sea accesible desde el proceso cliente. `127.0.0.1` dentro de un contenedor no es la máquina host.

Para las pruebas públicas Taira, comience con una sonda de extremo API sin firmar:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Si estos comandos fallan con `502`, TLS, DNS o errores de tiempo de espera, solucione la conectividad de la red o espere al punto final de la testnet pública API antes de depurar las claves de la cuenta o las cargas útiles de las transacciones.

## Las transacciones son rechazadas {#transactions-are-rejected}

La mayoría de los fallos en las transacciones son causados por una discrepancia de identidad o autorización:

- la clave pública de la cuenta en la configuración del cliente no coincide con la clave privada utilizada para firmar
- la cuenta no está registrada en el génesis de la blockchain ni por una transacción previa
- la cuenta carece del token de permiso o del rol requerido por el validador de tiempo de ejecución del software
- un ID de dominio carece de su calificación de espacio de datos, como `domain.dataspace`

Usa `--output-format text` mientras depuras los comandos CLI para que los errores sean más fáciles de leer:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Las consultas devuelven resultados vacíos {#queries-return-empty-results}

Los resultados vacíos de la consulta no siempre significan que la consulta falló. Verifica:

- la transacción que debería crear el objeto fue confirmada
- el dominio consultado, la definición de activo o el ID de la cuenta es canónico
- la paginación o los filtros no están excluyendo la fila esperada
- el cliente está conectado a la red prevista, no a otra red local

Para las comprobaciones de dominio, comienza con la consulta más amplia:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Los flujos de eventos o bloques se detienen temprano {#event-or-block-streams-stop-early}

Los ejemplos de flujo de bloques y eventos dependen de los endpoints de transmisión API de Torii. Verifique que el par de red todavía esté en funcionamiento y luego pruebe con un tiempo de espera:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Para las integraciones HTTP, compare sus rutas de endpoint API con el [Torii API referencia del endpoint](/es/reference/torii-endpoints.md) actual.
