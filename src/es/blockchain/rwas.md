---
translation_locale: es
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Activos del mundo real {#real-world-assets}

Los activos del mundo real (RWAs) modelan activos fuera de la cadena cuya propiedad o control se rastrea en la cadena. En Iroha, un RWA es un lote registrado en el libro mayor de blockchain con un identificador generado, una cuenta propietaria, una cantidad, metadatos comerciales, procedencia y controles de ciclo de vida opcionales.

RWAs son diferentes de los saldos de activos numéricos:

- un activo numérico es un saldo fungible mantenido por una cuenta
- un NFT es un registro único en la cadena con un solo propietario
- un RWA es un lote que puede contener metadatos comerciales, cantidad, retenciones, congelamientos, estado de redención, procedencia y política de control

Usa RWAs cuando el libro mayor de la blockchain necesite representar un lote específico fuera de la cadena en lugar de solo un saldo fungible.

## RWA Lote {#rwa-lot}

Un lote RWA contiene:

- `id`: el identificador canónico RWA generado, mostrado como `<hash>$<domain>`
- `owned_by`: la cuenta que actualmente posee el lote
- `quantity`: la cantidad pendiente representada por el lote
- `spec`: especificación de cantidad, como la escala decimal
- `primary_reference`: el registro principal del resultado del protocolo fuera de la cadena, certificado, factura o referencia del registro
- `status`: texto de estado comercial opcional
- `metadata`: campos compactos JSON utilizados para contexto empresarial e indexación
- `parents`: lotes de origen utilizados para derivar este lote
- `controls`: cuentas de controlador, roles de controlador y operaciones de controlador habilitadas
- `is_frozen` y `held_quantity`: estado del ciclo de vida impuesto por el tiempo de ejecución del software

Mantén la carga útil en la cadena compacta. Almacena grandes documentos legales, informes de inspección y paquetes de auditoría fuera de WSV, luego coloca un valor de resumen criptográfico, URI, ruta SoraFS o referencia de manifiesto técnico en los metadatos de RWA.

## Identificadores {#identifiers}

`RegisterRwa` no acepta un `id` elegido por el llamante, y no acepta un campo `owner`. El principal de autorización de la transacción se convierte en la cuenta `owned_by` inicial, y el entorno de ejecución del software genera el `RwaId` en el dominio de destino.

La forma textual de un ID RWA es:

```text
<generated-hash>$<domain>
```

Por ejemplo:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Las aplicaciones deben almacenar su identificador de negocio en `primary_reference` o `metadata`, y luego descubrir el `RwaId` generado desde `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, o la ruta del explorador establecida después de que la transacción se confirme.

## Ciclo de vida {#lifecycle}

Los flujos de trabajo comunes RWA incluyen:

|Operación|Comportamiento implementado|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              |Crear un lote con ID generado en un dominio; el principal de autorización de la transacción se convierte en `owned_by`.|
| `TransferRwa`                              |Mover cantidad a otra cuenta. Una transferencia completa puede cambiar `owned_by`. Una transferencia parcial crea un lote hijo separado con un ID generado.|
| `HoldRwa`                                  |Cantidad de reserva. Requiere un controlador configurado y `hold_enabled`.|
| `ReleaseRwa`                               |Eliminar la cantidad retenida. Requiere un controlador configurado y `hold_enabled`.|
| `FreezeRwa`                                |Bloquear operaciones ordinarias del propietario. Requiere un controlador configurado y `freeze_enabled`.|
| `UnfreezeRwa`                              |Volver a habilitar las operaciones ordinarias del propietario. Requiere un controlador configurado y `freeze_enabled`.|
|`RedeemRwa`                                |Sustraer permanentemente la cantidad de la circulación. El propietario o un controlador pueden enviarlo cuando `redeem_enabled` sea verdadero.|
| `MergeRwas`                                |Combine cantidades de lotes parentales con el mismo dominio y especificación en un lote hijo generado.|
| `ForceTransferRwa`                         |Mover la cantidad a través de un flujo de controlador. Requiere un controlador configurado y `force_transfer_enabled`.|
| `SetRwaControls`                           |Reemplazar la política de control de lotes. Requiere al propietario o a un controlador.|
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Actualizar los metadatos del lote. Requiere el propietario o un controlador; los lotes congelados requieren un controlador.|

No hay ninguna instrucción `UnregisterRwa` en el código actual. Dar de baja un lote fuera de la cadena con `RedeemRwa` cuando la cantidad representada sea entregada, consumida, liquidada o de otro modo retirada de circulación.

## Metadatos y Controles {#metadata-and-controls}

Utilice metadatos para hechos compactos que ayuden a las aplicaciones a identificar y verificar el lote:

- clase de activo, emisor, custodio o referencia del registro
- almacén, bóveda, ISIN, factura o identificadores de certificado
- hashes criptográficos de contenido para atestaciones y documentos legales
- SoraFS rutas o referencias de manifiesto técnico para paquetes de evidencia más grandes
- madurez, jurisdicción o etiquetas de cumplimiento utilizadas por servicios fuera de la cadena

El `RwaControlPolicy` implementado tiene estos campos:

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

Las cuentas y roles del controlador solo pueden realizar las operaciones habilitadas por las banderas booleanas correspondientes. La carga útil de control actual contiene las identidades del controlador y las banderas de operación. Las listas de permitidos de transferencia y las reglas anidadas `transfers` están fuera de esta carga útil.

## Consultas, Eventos y APIs {#queries-events-and-apis}

Usar [`FindRwas`](/es/reference/queries.md#assets-nfts-and-rwas) para listar registrados RWA muchos. Las aplicaciones que necesitan actualizaciones en tiempo real pueden suscribirse a [`Rwa` eventos de datos](/es/blockchain/filters.md#data-event-filters) para creado, propietario cambiado, dividido, fusionado, redimido, congelado, descongelado, eventos de sostenido, liberado, transferido por fuerza, cambio de controles y metadatos.

Torii expone rutas del estado de la cadena como `/v1/rwas` y `/v1/rwas/query`, además de rutas de explorador como `/v1/explorer/rwas` y `/v1/explorer/rwas/{rwa_id}` cuando se habilita esa familia de rutas. Los clientes generados deberían preferir la transmisión en vivo [`/openapi.json`](/es/reference/torii-endpoints.md#common-endpoints) documento para la forma exacta de respuesta expuesta por un nodo.

### Pruébalo en Taira {#try-it-on-taira}

Verifique si el público Taira actualmente tiene registrados RWA lotes:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Enumere las rutas RWA expuestas por el documento en vivo Taira OpenAPI:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Se espera una salida vacía `items` cuando aún no se han registrado lotes públicos. El registro, la transferencia, la retención, la congelación y el reembolso son transacciones firmadas.

## Pruébalo {#try-it}

Los ejemplos a continuación utilizan las superficies Python SDK de [Configuración compartida](/es/guide/tutorials/python.md#shared-setup). Reemplace los ID de cuenta, las claves privadas y los ID de lote generados con valores de su propia red antes de enviar una transacción.

### Descubre las rutas RWA API {#discover-rwa-api-routes}

Este ejemplo de solo lectura consulta a un nodo Torii en funcionamiento qué rutas RWA orientadas a la aplicación están habilitadas:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Si la lista está vacía, el nodo aún puede soportar instrucciones y consultas RWA a través de otros Torii APIs, pero no está exponiendo la familia de rutas opcional JSON.

### Registrar un registro de resultado del protocolo de almacén {#register-a-warehouse-receipt}

Use un borrador cuando una acción comercial deba convertirse en una transacción firmada. El número de registro del resultado del protocolo comercial va en `primary_reference`; el ID del libro mayor de blockchain se genera después de que la transacción se confirma.

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

Después de que la transacción se confirme, liste los IDs generados RWA. Las rutas del estado de la cadena exponen los IDs canónicos; use eventos o rutas de detalle del explorador cuando necesite hacer coincidir un ID de nuevo con `primary_reference` o metadatos:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Los nodos habilitados para Explorer también pueden devolver proyecciones más completas:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Transferencia con Retención Temporal {#transfer-with-a-temporary-hold}

Utilice el ID generado RWA devuelto por la cadena. Este ejemplo asume que `alice` es el propietario y también está configurado como controlador con `hold_enabled`.

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

Envíe `ReleaseRwa` después de que el proceso fuera de la cadena tenga éxito:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Agregar controles y metadatos de auditoría {#add-controls-and-audit-metadata}

Los controles y los metadatos están separados. Use los controles para la política del controlador, y los metadatos para los hechos que las aplicaciones o los auditores necesitan mostrar:

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

### Canjear o dar de baja la cantidad {#redeem-or-retire-quantity}

Envíe `RedeemRwa` después de que el activo fuera de la cadena representado sea entregado, consumido, desmantelado o de otra manera retirado de la circulación. Esto resta permanentemente la cantidad enviada del lote. El lote debe tener `redeem_enabled`. El firmante criptográfico debe ser el propietario o un controlador.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Congelarse durante la revisión de cumplimiento {#freeze-during-compliance-review}

Envíe `FreezeRwa` cuando una revisión fuera de la cadena deba bloquear las operaciones normales del propietario. El firmante criptográfico debe ser un controlador. El lote debe tener `freeze_enabled`.

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

Envíe `UnfreezeRwa` después de que la revisión sea aprobada:

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

### Factura por cobrar {#invoice-receivable}

Represente una factura como un lote RWA almacenando el número de factura en `primary_reference` y los metadatos. Después del registro, utilice el ID generado para la transferencia y el canje.

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

Cuando la cuenta por cobrar sea financiada o pagada, utilice el ID del lote de facturas generado:

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

Canjee el monto representado después del liquidación fuera de la cadena:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Retiro de créditos de carbono {#carbon-credit-retirement}

Envíe `RedeemRwa` para retirar los créditos de carbono reclamados de la circulación. Almacene el certificado fuera de la cadena o la prueba del registro en los metadatos:

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

### Fusionar dos lotes {#merge-two-lots}

Combina lotes cuando se consolidan dos posiciones fuera de la cadena. Los padres deben estar en el mismo dominio y usar la misma especificación de cantidad. El tiempo de ejecución del software genera el ID del lote hijo.

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

Para el ejemplo completo de la transacción Python, vea [Activos del mundo real](/es/guide/tutorials/python.md#real-world-assets).

## Documentos relacionados {#related-docs}

- [Activos](/es/blockchain/assets.md)
- [Metadatos](/es/blockchain/metadata.md)
- [Iroha Operaciones de instrucción](/es/blockchain/instructions.md)
- [Consultas](/es/reference/queries.md#assets-nfts-and-rwas)
- [Torii API puntos finales](/es/reference/torii-endpoints.md#app-and-sora-route-families)
