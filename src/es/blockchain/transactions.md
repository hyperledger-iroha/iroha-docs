---
translation_locale: es
translation_source: /blockchain/transactions.md
translation_source_hash: d9227effcdb4d54ac76f6288ba213de20f2574e1585e13b96a5202c44b69f3be
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Esto sigue siendo de solo lectura. Enviar una transacción requiere un sobre Norito firmado, los identificadores correctos de cadena y de red, un pagador explícito de comisiones y una cuenta de Taira con fondos obtenidos del servicio de fondos de prueba.

Para los ejemplos de Taira que pagan comisiones, asigne fondos al firmante mediante el flujo preparado del servicio de fondos de prueba en [Obtener XOR de testnet en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) y, después, compruebe el saldo del activo de comisiones:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si una ruta del servicio de fondos de prueba devuelve `502`, espere y vuelva a intentarlo antes de depurar la propia transacción.

Después, seleccione el pagador de comisiones al enviar la transacción. Con `--fee-payer authority`, paga la cuenta firmante, y la CLI indica la comisión exacta en el activo de comisiones de Taira antes de firmar:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## Transacciones sin conexión {#offline-transactions}

Iroha tiene dos flujos de trabajo de transacciones fuera de línea:

- La firma fuera de línea crea una transacción firmada normal mientras el dispositivo de firma está desconectado. La transacción no se procesa hasta que un cliente en línea envía el contenedor de datos firmado a Torii, por lo que todavía necesita el ID de cadena correcto, el principal de autorización, los permisos y las tarifas, y la duración de la transacción.
- **El efectivo sin conexión de Kagemusha** carga valor en una billetera inscrita y respaldada por hardware mientras está conectada, permite pagos entre billeteras cuando ambas están desconectadas y devuelve el valor restante a una cuenta del libro mayor cuando la billetera vuelve a conectarse.

Torii expone una ruta de mutación de Kagemusha, `POST /v1/kagemusha/enrollment`. Acepta tramas de inscripción `application/x-norito` autenticadas por la cuenta y devuelve respuestas privadas que no deben almacenarse en caché. Las rutas de lectura del SDK firmadas por la cuenta bajo `/v1/kagemusha/{scheme}/wallets/{wallet}/` devuelven comprobantes de operaciones Load y evidencias de finalidad; no figuran en `/openapi.json`. La parte del ciclo de vida que corresponde al libro mayor utiliza transacciones firmadas ordinarias que contienen una instrucción `KagemushaWalletLedgerV1`:

|Acción|Propósito|
| --- | --- |
| `Activate` | Activar una billetera inscrita; la verificación nativa de inicialización es obligatoria |
| `IssueLoad` | Debitar al pagador y registrar atómicamente la siguiente operación Load de la billetera |
| `Unload` | Pagar una solicitud completa de Unload a su cuenta vinculada como máximo una vez |
| `ClaimFee` | Pagar una solicitud completa de comisiones a su beneficiario fijo |
| `Abandon` | Abandonar una inscripción no utilizada |

El flujo típico es:

1. Inscriba la billetera mediante `/v1/kagemusha/enrollment` utilizando la implementación tipada para Swift o Android y, después, actívela.
2. Envíe una transacción `IssueLoad`. La ejecución comprueba el ordinal esperado de la siguiente operación Load y que el identificador de solicitud no sea cero, por lo que un reintento obsoleto o modificado falla. Si se pierde una respuesta, consulte el comprobante de la operación Load original en vez de firmar otra operación Load.
3. Intercambie y verifique los pagos localmente entre las billeteras mientras estén desconectadas, y guarde de forma persistente el estado de la billetera antes de confirmar cada transferencia.
4. Cuando la billetera vuelva a conectarse, envíe su solicitud de Unload y espere a que alcance finalidad.

Kagemusha no está calificado para su lanzamiento: siguen pendientes la calificación monetaria en vivo y el registro, la activación y el pago de teléfonos en dispositivos físicos.

El libro mayor de la blockchain no puede observar una transferencia fuera de línea conflictiva hasta que el estado de la nota regrese a través del ciclo de vida en línea. Por lo tanto, la política de billetera y operadora debe hacer cumplir límites de valor, vencimiento, emisores aceptados, almacenamiento local duradero y ventanas de reconciliación.

Aquí hay un ejemplo de cómo crear una nueva transacción con la instrucción `Grant`. En esta transacción, Mouse está otorgando a Alice el rol especificado (`role_id`). Consulte [el ejemplo completo](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```
