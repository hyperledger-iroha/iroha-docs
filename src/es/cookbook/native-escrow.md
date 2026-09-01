---
translation_locale: es
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Custodia de Activos Nativos {#native-asset-escrow}

## Resultado {#outcome}

Elija entre un depósito en garantía del mercado y un bloqueo de activos destinado a un destino, ejecute el ciclo de vida tipado actual con Rust o Python, vincule cada reintento de bloqueo al monto restante que realmente observó, y compile la superficie de depósito en garantía nativa Kotodama desde JavaScript.

## Prerrequisitos {#prerequisites}

- Una definición de activo numérico y un aperturista/vendedor que posee suficiente cantidad.
- Clientes financiados de llave única I105 para cada parte que envíe un paso. Utilice una intención `fee_payment` pagada por la autoridad en vivo cuyo activo de tarifa coincida con la respuesta del servicio de financiación de testnet Taira actual; no inserte un ID de activo de la documentación.
- El Rust o Python SDK actual de Iroha compromete `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- Para el ejemplo del compilador JavaScript, Node.js 24 más un paquete `@iroha/iroha-js` construido localmente y su `iroha_js_host` nativo; siga el [JavaScript SDK configuración de source-build](/es/guide/tutorials/javascript.md#build-from-source). Las compilaciones para navegador deben proporcionar `compilerUrl` en lugar de cargar el host nativo.
- Taira debe admitir la transferencia de activos y las instrucciones de custodia. Los propietarios de activos pueden usar el ciclo de vida ordinario cuando su política de activos lo permite; resolver una disputa requiere el permiso global `CanResolveEscrowDispute`. Utilice una red local generada cuando el principal de autorización de red pública necesario esté ausente.

Los modelos de depósito en garantía del mercado incluyen vendedor, comprador, pago fuera de cadena y liberación. Los bloqueos genéricos nombran un destino y opcionalmente un principal de autorización de liberación distinto; admiten retiros parciales, cancelación y vencimiento.

## Pasos {#steps}

### 1. Complete un depósito en garantía del mercado con Rust {#_1-complete-a-marketplace-escrow-with-rust}

Esta función recibe identificaciones reales tipadas y clientes. Abre 40 unidades, permite al comprador aceptar y marcar el pago fuera de cadena, luego permite al vendedor liberar la custodia. Cada envío nombra al pagador principal de la autorización a través de `FeePaymentIntent`.

```rust
use eyre::{Result, ensure};
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
        transaction::FeePaymentIntent,
    },
};
use iroha_crypto::Hash;

fn complete_marketplace_escrow(
    seller: &Client,
    buyer: &Client,
    escrow_id: EscrowId,
    asset_definition: AssetDefinitionId,
) -> Result<AssetEscrowRecord> {
    let fee = FeePaymentIntent::authority(Vec::new(), None);

    seller.submit_blocking(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit_blocking(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit_blocking(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit_blocking(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller.query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

La cuenta de custodia se gestiona mediante libro mayor. Otorgar un token de transferencia de activos normal no hace que la custodia activa sea drenable fuera del ciclo de vida del depósito en garantía.

### 2. Abrir y dibujar parcialmente un candado genérico con Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

El principal de autorización de liberación consulta el registro nativo firmado antes de retirar fondos. Pasar ese `remaining_amount` exacto proporciona concurrencia optimista: se rechaza una solicitud paralela obsoleta en lugar de debitar la custodia dos veces.

```python
import secrets
import time
from decimal import Decimal


def escrow_status(record):
    status = record["status"]
    if isinstance(status, dict):
        return status.get("status", status.get("kind"))
    return str(status)


def open_and_draw_lock(
    *,
    client,
    chain_id,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"

    client.open_asset_lock_and_wait(
        chain_id=chain_id,
        authority=opener,
        private_key=opener_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        asset_definition_id=asset_definition_id,
        destination=destination,
        amount="10",
        release_authority=release_authority,
        expires_at_ms=int(time.time() * 1000) + 3_600_000,
        wait=True,
    )

    before = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        chain_id=chain_id,
        authority=release_authority,
        private_key=release_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        amount="4",
        expected_remaining_amount=before["remaining_amount"],
        wait=True,
    )
    after = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

El Python SDK puede consultar automáticamente cuando se omite `expected_remaining_amount`, pero pasar el valor observado hace que la precondición económica firmada sea visible en el código de la aplicación.

Para los flujos de bloqueo Rust, los constructores actuales también requieren la cantidad observada:

```rust
let before = opener.query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit_blocking(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener.query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit_blocking(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` toma tres valores; `CancelAssetLock::new` toma dos. Omitir la cantidad restante esperada describe una forma de llamada más antigua e insegura.

### 3. Compile la superficie de depósito en garantía Kotodama de JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript no necesita inventar instrucciones nativas no tipadas. El compilador actual expone las funciones incorporadas de custodia del libro mayor de la blockchain a Kotodama; el despliegue y las llamadas luego siguen a [Construir y desplegar un contrato inteligente](./smart-contracts.md).

Guarda esto como `native_escrow.ko`:

```kotodama
seiyaku NativeEscrowAitai {
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize("Admin") {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

Guarde lo siguiente como `compile-native-escrow.mjs` y úselo para compilar ese mismo código fuente de Node.js:

```js
import { readFile } from 'node:fs/promises'
import { compileKotodamaProgram } from '@iroha/iroha-js/kotodama-compiler'

const source = await readFile('./native_escrow.ko', 'utf8')

const result = await compileKotodamaProgram(source, {
  sourceName: 'native_escrow.ko',
})
if (!result.ok) {
  throw new Error(JSON.stringify(result.diagnostics, null, 2))
}
console.log({
  codeHashHex: result.output.codeHashHex,
  entrypoints: result.output.manifest.entrypoints.map(({ name }) => name),
})
```

Ejecutarlo desde el entorno de paquete construido desde la fuente descrito en los prerrequisitos:

```bash
node ./compile-native-escrow.mjs
```

## Verificar {#verify}

Para la custodia del mercado, consulte `FindAssetEscrowById` y las tenencias de activos de ambas partes después de la liberación. El registro debe ser `Released`, nombrar al comprador que acepta y no mostrar custodia restante. Para el bloqueo Python anterior, retenga el ID devuelto y repita la consulta firmada:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

También consulta la tenencia de activos del destino y confirma que aumentó en cuatro unidades. Un registro de resultado del protocolo de transacción sin el registro de depósito en custodia y el estado posterior del destino es una verificación incompleta.

## Solución de problemas {#troubleshooting}

- `Not permitted` al abrir generalmente significa que el principal de autorización no puede transferir el activo seleccionado a la custodia. La resolución de disputas tiene la puerta global separada `CanResolveEscrowDispute`.
- `expected remaining amount` el rechazo es un conflicto de concurrencia optimista. Vuelva a consultar el registro, decida si la otra retirada/cancelación fue intencionada, y firme una nueva instrucción únicamente si el nuevo estado es aceptable.
- Solo el principal de autorización de liberación configurado puede ejecutar un bloqueo confiable. El destino no puede liberarlo simplemente porque recibirá los fondos.
- La publicación en el mercado es válida solo después de la aceptación y del estado de pago enviado; la cancelación está limitada a los estados anteriores del ciclo de vida.
- La expiración utiliza el tiempo del libro mayor autoritario de la blockchain. No considere un tiempo de espera del reloj local como prueba de que `ExpireAssetLock` pasará.
- Un incumplimiento de tarifa pertenece a la parte que envía ese paso del ciclo de vida. Comprador de fondos, vendedor/abridor y principal de autorización de liberación de forma independiente en Taira.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Modelo de instrucción de fideicomiso nativo en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Pruebas de integración de custodia nativa en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python métodos del cliente de depósito en garantía en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama ejemplo de custodia nativa en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Fideicomiso de activos nativos](/es/blockchain/escrow.md)
- [Activos fungibles](./fungible-assets.md)
- [Permisos y roles](./permissions-and-roles.md)
