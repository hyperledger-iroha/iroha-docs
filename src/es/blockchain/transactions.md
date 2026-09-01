---
translation_locale: es
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Transacciones {#transactions}

Una transacción es una solicitud firmada para ejecutar trabajo en la blockchain. La carga ejecutable puede ser una secuencia ordenada de [instrucciones](./instructions.md), una llamada a contrato, IVM bytecode, o una ejecución IVM comprobada. Véase [Contratos Inteligentes](./smart-contracts.md) para el modelo actual de ejecución de contratos.

Las transacciones realizan trabajos ejecutables o que cambian el estado. La inspección de solo lectura utiliza consultas firmadas o puntos finales públicos de lectura API y no crea una transacción.

Una transacción admitida en un bloque comprometido se almacena con su resultado de ejecución, incluida una rechazo de ejecución. Las solicitudes rechazadas antes de la admisión en el bloque, como un contenedor de datos inválido o una transacción rechazada por la cola, no se almacenan en un bloque.

Para el movimiento de activos que preserva la privacidad, vea [Transacciones anónimas](./anonymous-transactions.md). Las transacciones anónimas utilizan notas de activos protegidas, compromisos, anuladores y pruebas de conocimiento cero en lugar de cambios públicos de saldo de cuenta a cuenta.

Para pruebas de evidencia sobre efectos de ejecución transparentes seleccionados, consulte [FastPQ](./fastpq.md). FastPQ consume testigos de ejecución después de la ejecución normal de la transacción y construye lotes de prueba deterministas para transiciones de estado compatibles.

## Pruébalo en Taira {#try-it-on-taira}

Usa las rutas del explorador para inspeccionar los bloques públicos recientes Taira y los estados de las transacciones sin una cuenta de firma:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Para seguir una transacción que su aplicación envió anteriormente, copie el `hash` de la lista e inspeccione la ruta de detalle del explorador:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Esto todavía es de solo lectura. Enviar una transacción requiere un contenedor de datos Norito firmado, un ID de cadena correcto, metadatos de tarifas y una cuenta Taira financiada en testnet.

Para los ejemplos con tarifa en Taira, guarde el auxiliar de [Obtener XOR de prueba en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py` y financie primero al firmante mediante el dispensador público:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si el enigma del servicio de financiamiento de la red de prueba o la ruta de reclamación devuelve `502`, espere y vuelva a intentarlo antes de depurar la transacción en sí.

Luego adjunte los metadatos del activo de tarifa Taira al enviar la transacción:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Transacciones sin conexión {#offline-transactions}

Iroha tiene dos flujos de trabajo de transacciones fuera de línea:

- La firma fuera de línea crea una transacción firmada normal mientras el dispositivo de firma está desconectado. La transacción no se procesa hasta que un cliente en línea envía el contenedor de datos firmado a Torii, por lo que todavía necesita el ID de cadena correcto, el principal de autorización, los permisos y las tarifas, y la duración de la transacción.
- El efectivo sin conexión de Kagemusha recarga una cartera mientras está en línea, admite transferencias de cartera a cartera iniciadas por el receptor mientras ambas carteras están sin conexión, y canjea el estado resultante de la nota cuando el destinatario vuelve a estar en línea.

Torii expone el ciclo de vida completo de Kagemusha bajo `/v1/offline/*`:

|Método y endpoint API|Propósito|
| --- | --- |
| `GET /v1/offline/readiness` |Evaluar la preparación de Kagemusha para uno `asset_definition_id`|
| `POST /v1/offline/receiver-lineage` |Resolver la línea de registro activa con prueba vinculante para una solicitud de receptor firmada|
| `POST /v1/offline/top-up` |Enviar una operación de recarga en línea a fuera de línea firmada|
| `POST /v1/offline/redeem` |Enviar una operación de canje fuera de línea firmada|
| `GET /v1/offline/operations/{operation_id}` |Lea el estado canónico de una recarga o redención|

Verifique la preparación del activo antes de construir una operación sin conexión:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

La preparación vincula la billetera al puente activo ABI 21 y al conjunto de artefactos autenticados V4. Las solicitudes de linaje, recarga y redención utilizan archivos tipados `application/x-norito`. Devolución de recarga y redención `202 Accepted` con un encabezado `Location` que apunta al recurso de operación; el ID de operación no nulo incrustado proporciona la clave de idempotencia.

El flujo típico es:

1. Consulta la preparación y detente si `ready` es falso o si se aplica algún bloqueador.
2. Utilice una billetera tipeada Swift o JVM para construir el archivo de recarga canónico, envíelo y conserve tanto el estado de la nota de entrada como el ID de la operación hasta que la operación alcance un estado final en la cadena.
3. Resuelva la línea de registro del receptor cuando sea necesario, construya y verifique cada transferencia entre pares de la red localmente, y persista el estado de la nota cifrada antes de reconocer la transferencia.
4. Cuando el destinatario esté en línea, construya el archivo de redención canónico, envíelo y consulte su recurso de operación hasta completarlo.

El libro mayor de la blockchain no puede observar una transferencia fuera de línea conflictiva hasta que el estado de la nota regrese a través del ciclo de vida en línea. Por lo tanto, la política de billetera y operadora debe hacer cumplir límites de valor, vencimiento, emisores aceptados, almacenamiento local duradero y ventanas de reconciliación.

Aquí hay un ejemplo de cómo crear una nueva transacción con la instrucción `Grant`. En esta transacción, Mouse está otorgando a Alice el rol especificado (`role_id`). Consulte [el ejemplo completo](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
