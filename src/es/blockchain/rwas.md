---
translation_locale: es
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Activos en el mundo real {#real-world-assets}

Activos del mundo real (RWAs) modelo de activos fuera de la cadena cuya propiedad o control se rastrea en la cadena. En Iroha, un RWA es un lote registrado con un identificador generado, una cuenta del propietario, una cantidad, metadatos comerciales, procedencia y controles opcionales del ciclo de vida.

RWAs son diferentes de los saldos numéricos de activos:

- un activo numérico es un saldo fungible mantenido por una cuenta
- un NFT es un registro único en cadena con un solo propietario
- un RWA es un lote que puede contener metadatos comerciales, cantidad, reservas, congelaciones, estado de redención, procedencia y política del controlador.

Utilice RWAs cuando el libro mayor necesite representar un lote específico fuera de la cadena en lugar de solo un saldo fungible.

## RWA Lote {#rwa-lot}

Un lote de RWA contiene:

- `id`: el identificador canónico RWA generado, mostrado como `<hash>$<domain>`.
- `owned_by`: la cuenta que actualmente es dueña del lote
- `quantity`: la cantidad pendiente representada por el lote.
- `spec`: especificación de cantidad, por ejemplo en escala decimal
- `primary_reference`: el recibo, certificado, factura o referencia de registro principal fuera de la cadena.
- `status`: texto opcional sobre el estado de la empresa
- `metadata`: campos compactos JSON utilizados para el contexto empresarial y la indexación.
- `parents`: lotes de origen utilizados para obtener este lote
- `controls`: Cuentas del controlador, funciones del controlador y operaciones habilitadas del controlador.
- `is_frozen` y `held_quantity`: estado del ciclo de vida aplicado por el tiempo de ejecución.

Mantenga la carga útil en cadena compacta. Guarde documentos legales grandes, informes de inspección y paquetes de auditoría fuera del WSV, luego coloque un digesto, URI, SoraFS camino o referencia manifiesta en los metadatos RWA.

## Identificadores {#identifiers}

`RegisterRwa` no acepta una llamada elegida por el solicitante `id`, y no acepta un campo `owner`. La autoridad de transacción se convierte en la cuenta inicial `owned_by`, y el tiempo de ejecución genera el `RwaId` en el dominio objetivo.

La forma textual de un RWA ID es:

```text
<generated-hash>$<domain>
```

Por ejemplo:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Las solicitudes deben almacenar su identificación comercial en `primary_reference` o `metadata`, y luego descubrir la `RwaId` generada a partir de `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, o la ruta del explorador establecida después de que la transacción se comprometa.

## Ciclo de vida {#lifecycle}

Los flujos de trabajo comunes RWA incluyen:

|Operación |El comportamiento implementado |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Crear un lote generado- ID en un dominio; la autoridad de transacción se convierte en `owned_by`. |
|`TransferRwa` |Trasladar la cantidad a otra cuenta Una transferencia completa puede cambiar `owned_by`; una transferencia parcial crea un lote de hijos generado. |
|`HoldRwa` |Cantidad de reserva Requiere un controlador configurado y `hold_enabled`. |
|`ReleaseRwa` |Retira la cantidad retenida. Requiere un controlador configurado y `hold_enabled`. |
|`FreezeRwa` |Bloqueo de las operaciones del propietario ordinario. Requiere un controlador configurado y `freeze_enabled`. |
|`UnfreezeRwa` |Rehabilitar las operaciones ordinarias del propietario. Requiere un controlador configurado y `freeze_enabled`. |
|`RedeemRwa` |Se requiere el propietario o un controlador y `redeem_enabled`. |
|`MergeRwas` |Combine las cantidades de los lotes padres con el mismo dominio y especificación en un lote de hijos generado. |
|`ForceTransferRwa` |Mover la cantidad a través de un flujo del controlador. Requiere un controlador configurado y `force_transfer_enabled`. |
|`SetRwaControls` |Requiere el propietario o un controlador. |
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Actualización de los metadatos del lote Requiere el propietario o un controlador; lotes congelados requieren un controlador. |

No hay instrucción `UnregisterRwa` en el código actual. Retirar un lote fuera de la cadena con `RedeemRwa` cuando se entregue, consuma, liquide o retire de otra manera la cantidad representada de la circulación.

## Metadatos y controles {#metadata-and-controls}

Usar metadatos para datos compactos que ayuden a las aplicaciones a identificar y verificar el lote:

- Clasificación de activos, emisor, custodio o referencia del registro
- Identificadores de almacén, bóveda, ISIN, factura o certificado
- hashes de contenido para los certificados y documentos legales
- SoraFS trayectorias o referencias manifiestas para paquetes de pruebas más grandes
- etiquetas de vencimiento, jurisdicción o cumplimiento utilizadas por los servicios fuera de la cadena

El `RwaControlPolicy` implementado contiene los siguientes campos:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

Las cuentas y funciones del controlador solo pueden realizar las operaciones del controlador habilitadas por la bandera booleana correspondiente. La carga útil de control actual no es una política de transferencia de listas permitidas y no contiene reglas anidadas `transfers`.

## Encuestas, eventos y APIs {#queries-events-and-apis}

Utilización [`FindRwas`](/es/reference/queries.md#assets-nfts-and-rwas) a la lista registrada RWA Las aplicaciones que necesitan actualizaciones en vivo pueden suscribirse a [`Rwa` eventos de datos](/es/blockchain/filters.md#data-event-filters) para crear, cambiar de propietario, dividir, fusionar, canjear, congelar, descongelar, mantener, liberar, transferir por la fuerza, cambiar los controles; y eventos de metadatos.

Torii expone rutas de estado en cadena como `/v1/rwas` y `/v1/rwas/query`, además de rutas exploradoras como `/v1/explorer/rwas` y `/v1/explorer/rwas/{rwa_id}` cuando esa familia de rutas está habilitada. Los clientes generados deben preferir el documento en vivo [`/openapi`](/es/reference/torii-endpoints.md#common-endpoints) para la forma exacta de respuesta expuesta por un nodo.

### Pruébalo en Taira {#try-it-on-taira}

Verifique si el Taira público ha registrado actualmente lotes RWA:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Lista de las rutas RWA expuestas por el documento en vivo Taira OpenAPI:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Se espera una salida vacía `items` cuando aún no se han registrado lotes públicos. Las transacciones de registro, transferencia, retención, congelación y canje son firmadas.

## Pruébalo. {#try-it}

Los ejemplos a continuación utilizan el Python SDK las superficies de [Configuración compartida](/es/guide/tutorials/python.md#shared-setup). Reemplazar la cuenta IDs, llaves privadas, y lote generado IDs con los valores de su propia red antes de enviar una transacción.

### Descubra las rutas RWA API {#discover-rwa-api-routes}

Este ejemplo de sólo lectura pide a un nodo Torii en ejecución cuáles rutas RWA orientadas a la aplicación están habilitadas:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Si la lista está vacía, el nodo aún puede admitir instrucciones y consultas RWA a través de otras Torii APIs, pero no expone la familia de rutas JSON opcional.

### Registro de un recibo del almacén {#register-a-warehouse-receipt}

Utilice un borrador cuando una acción comercial debe convertirse en una transacción firmada. El número de recibo comercial entra en `primary_reference`; el libro mayor ID se genera después de que la transacción se comprometa.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Después de que la transacción se comprometa, se genera una lista RWA IDs. Las rutas en estado de cadena exponen el canónico IDs; utilice eventos o rutas detalladas del explorador cuando necesite emparejar un ID de vuelta a `primary_reference` o metadatos:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Los nodos habilitados con explorador también pueden devolver proyecciones más ricas:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Traslado con una retención temporal {#transfer-with-a-temporary-hold}

Utilice el generado RWA ID devuelto por la cadena. Este ejemplo supone que `alice` es el propietario y también está configurado como un controlador con `hold_enabled`.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Cuando el proceso fuera de la cadena esté completado, liberar la sujeción:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Añadir metadatos de control y auditoría {#add-controls-and-audit-metadata}

Los controles y los metadatos son separados. Utilice controles para la política del controlador, y metadatos para hechos que las aplicaciones o auditores necesitan mostrar:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Cantidad de rescate o retirada {#redeem-or-retire-quantity}

Cuantidad de rescate cuando el activo representado fuera de la cadena ha sido entregado, consumido, retirado; El lote debe haber sido retirado de circulación. `redeem_enabled`, y el firmante debe ser el propietario o un controlador.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Se congela durante la revisión del cumplimiento {#freeze-during-compliance-review}

Se congela mucho cuando una revisión fuera de la cadena debe bloquear las operaciones ordinarias del propietario. El firmante debe ser un controlador y el lote debe tener `freeze_enabled`.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Descongelarlo al pasar la revisión:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Las facturas que se deben recibir {#invoice-receivable}

Representar una factura como lote RWA almacenando el número de la factura en `primary_reference` y los metadatos. Después del registro, utilice la ID generada para su transferencia y canje.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Cuando se financie o pague el crédito, utilice el lote de facturas generado ID:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Redención del importe representado después de la liquidación fuera de la cadena:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Retiro del crédito por carbono {#carbon-credit-retirement}

Utilice la redención para retirar los créditos después de que sean reclamados. Los metadatos apuntan al certificado fuera de cadena o a la prueba del registro:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Fusión de dos lotes {#merge-two-lots}

Combinar los lotes cuando se consolidan dos posiciones fuera de la cadena. Los padres deben estar en el mismo dominio y usar la misma especificación de cantidad. El tiempo de ejecución genera el lote hijo ID.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Para el ejemplo completo de la transacción Python, véase [Real-World Assets](/es/guide/tutorials/python.md#real-world-assets).

## Documentación relacionada {#related-docs}

- [Activos ](/es/blockchain/assets.md)
- [Metadatos ](/es/blockchain/metadata.md)
- [Iroha Instrucciones especiales](/es/blockchain/instructions.md)
- [Las consultas ](/es/reference/queries.md#assets-nfts-and-rwas)
- [Puntos finales Torii](/es/reference/torii-endpoints.md#app-and-sora-route-families)
