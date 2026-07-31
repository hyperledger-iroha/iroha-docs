---
translation_locale: es
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Las transacciones {#transactions}

Una transacción es una solicitud firmada para ejecutar el trabajo en la cadena de bloques. [instrucciones](./instructions.md), una llamada contractual, IVM código de byte, o una prueba IVM La ejecución. [Los contratos inteligentes](./smart-contracts.md) para el modelo actual de ejecución del contrato.

Las transacciones realizan un trabajo de cambio de estado o ejecutable. La inspección sólo para lectura utiliza consultas firmadas o puntos finales públicos de lectura y no crea una transacción.

Una transacción admitida en un bloque comprometido se almacena con su resultado de ejecución, incluido un rechazo de ejecución. Las solicitudes rechazadas antes de la admisión del bloque, como un sobre inválido o una transacción rechazada por la cola, no se almacenan en un bloque.

Para el movimiento de activos que preservan la privacidad, véase [Transacciones Anónimas](./anonymous-transactions.md). Las transacciones anónimas utilizan notas de activos protegidas, compromisos, anuladores y pruebas de conocimiento cero en lugar de cambios del saldo entre cuentas públicas.

Para obtener pruebas sobre los efectos de ejecución transparentes seleccionados, véase [FastPQ](./fastpq.md). FastPQ consume testigos de ejecución después de la ejecución normal de transacciones y construye lotes de prueba determinista para las transiciones de estado soportadas.

## Pruébalo en Taira {#try-it-on-taira}

Utilice las rutas exploradoras para inspeccionar los bloques públicos recientes y los estados de transacciones Taira sin una cuenta de firma:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Para seguir una transacción que su aplicación envió antes, copie el `hash` de la lista e inspeccione la ruta detallada del explorador:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

El envío de una transacción requiere un sobre Norito firmado, una cadena correcta ID, metadatos de tarifas y una cuenta Taira financiada por grifo.

Para los ejemplos de pago de cuotas en Taira, salvo el ayudante del grifo de [Obtenga el Testnet XOR en el Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, luego financie al firmante a través del grifo público primero:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si el rompecabezas del grifo o la ruta de reclamo devuelve `502`, espere y vuelva a intentar deshacerse de la transacción misma.

A continuación, adjunta los metadatos del activo de cuota Taira al momento de presentar la transacción:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Transacciones fuera de línea {#offline-transactions}

Iroha tiene dos flujos de trabajo de transacciones fuera de línea:

- La firma fuera de línea crea una transacción firmada normal mientras el dispositivo firmante está desconectado. La transacción no se procesa hasta que un cliente en línea envíe el sobre firmado a Torii, por lo que todavía necesita la cadena correcta ID, autoridad, permisos, tarifas y vida útil de la transacción.
- Kagemusha cash offline supera una billetera mientras está en línea, admite las entregas de billetera a billetera iniciadas por el receptor mientras ambas billeteras están fuera de línea y canjea el estado de la nota resultante cuando el destinatario vuelve en línea.

Torii expone el ciclo de vida completo del Kagemusha en `/v1/offline/*`:

|Método y punto final |El propósito .|
| --- | --- |
|`GET /v1/offline/readiness` |Evaluar la preparación de Kagemusha para una `asset_definition_id` |
|`POST /v1/offline/receiver-lineage` |Resolver el linaje activo de registro con prueba para una solicitud firmada por el destinatario |
|`POST /v1/offline/top-up` |Presentar una operación de recarga online-offline firmada |
|`POST /v1/offline/redeem` |Presentar una operación de canje sin conexión firmada |
|`GET /v1/offline/operations/{operation_id}` |Leer el estado canónico de una recarga o redención |

Verifique la preparación del activo antes de construir una operación fuera de línea:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

La preparación une la billetera al puente activo. ABI 21 y autenticado V4 El linaje, la composición y las solicitudes de redención utilizan `application/x-norito` Arquivos, recarga y reembolso `202 Accepted` con un `Location` encabezado que apunta al recurso de operación; la operación no cero integrada ID provee la llave de impotencia.

El flujo típico es:

1. Encuentra la preparación y deténgase si `ready` es falso o se aplica cualquier bloqueador.
2. Utilice una cartera Swift o JVM mecanografiada para construir el archivo de recarga canónico, enviarlo y conservar tanto el estado de la nota de entrada como la operación ID hasta que la operación alcance un estado final de cadena.
3. Resolver el linaje de registro del receptor cuando sea necesario, construir y verificar cada transmisión de pares localmente, y persistir en el estado de la nota cifrada antes de reconocer la transferencia.
4. Cuando el destinatario esté en línea, construya el archivo canónico de redención, envíelo y encuesta su recurso operativo hasta la finalidad.

El libro mayor no puede observar una transferencia fuera de línea conflictiva hasta que el estado de la nota regrese a través del ciclo de vida en línea.

Este es un ejemplo de la creación de una nueva transacción con `Grant` En esta transacción, Mouse le otorga a Alice el papel especificado (`role_id`El cheque . [el ejemplo completo](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
