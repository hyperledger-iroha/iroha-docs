---
translation_locale: es
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aseguración de activos nativos {#native-asset-escrow}

## El resultado {#outcome}

Elegir entre un escrow de mercado y un bloqueo de activos vinculado a destino, ejecutar el ciclo de vida tipado actual con Rust o Python, vincular cada intento de bloqueo al monto restante que realmente haya observado, y compilar la superficie de escrow nativa Kotodama desde JavaScript.

## Los requisitos previos {#prerequisites}

- Una definición numérica del activo y un operador/vendedor que posea una cantidad suficiente.
- Clientes de llave única I105 financiados para cada parte que presente un paso. Utilice una intención `fee_payment` pagada por la autoridad en vivo cuyo activo de honorario coincida con la respuesta actual del grifo Taira; no incorpore un activo ID de la documentación.
- La corriente Rust o Python SDK de Iroha Compromiso `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- Para el JavaScript ejemplo de compilador, Node.js 24 más una construida localmente `@iroha/iroha-js` envasado y su origen `iroha_js_host`; seguir el [JavaScript SDK configuración de la construcción fuente](/es/guide/tutorials/javascript.md#build-from-source). Las construcciones del navegador deben proporcionar `compilerUrl` En vez de cargar al anfitrión nativo.
- Taira debe admitir las instrucciones de transferencia y custodia de activos. Los propietarios de activos pueden utilizar el ciclo normal de vida cuando su política de activos lo permita; la resolución de una disputa requiere el permiso global `CanResolveEscrowDispute`.

Modelos de custodia del mercado vendedor, comprador, pago fuera de la cadena y liberación. Los bloqueos genéricos nombran un destino y opcionalmente una liberación distinta Autoridad; apoyan la retirada parcial, la cancelación y la caducidad.

## Los pasos {#steps}

### 1. Completa una fianza en el mercado con Rust {#_1-complete-a-marketplace-escrow-with-rust}

Esta función recibe real typed IDs y clientes. Abre 40 unidades, permite al comprador aceptar y marcar el pago fuera de la cadena, luego permite que el vendedor libere la custodia. Cada presentación nombra al pagador de las tarifas de autoridad a través de `FeePaymentIntent`.

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

La cuenta de custodia se gestiona en un libro mayor. La concesión de un token normal de transferencia de activos no hace que la custodia activa sea drenable fuera del ciclo de vida de la fianza.

### 2. Abrir y dibujar parcialmente un bloqueo genérico con Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

La autoridad de liberación consulta el registro nativo firmado antes de retirarlo. Pasar ese `remaining_amount` exacto proporciona una concurrencia optimista: se rechaza una solicitud paralela obsoleta en lugar de cobrar la custodia dos veces.

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

El Python SDK puede hacer consultas automáticamente cuando se omite `expected_remaining_amount`, pero pasar el valor observado hace que la condición económica firmada sea visible en el código de aplicación.

Para los flujos de bloqueo Rust, los constructores de corriente también requieren la cantidad observada:

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

### 3. Compila la superficie de garantía Kotodama a partir de JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript no necesita inventar instrucciones nativas destipulizadas. El compilador actual expone el registro de garantía integrado a Kotodama; implementación y llamadas luego siguen [Construir e implementar un contrato inteligente](./smart-contracts.md).

Salvar esto como `native_escrow.ko`:

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

Guarde lo siguiente como `compile-native-escrow.mjs` y use para compilar esa fuente exacta a partir de Node.js:

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

Se ejecuta desde el entorno de paquete basado en la fuente descrito en los requisitos previos:

```bash
node ./compile-native-escrow.mjs
```

## Verificar {#verify}

Para el escrow de mercado, consulta `FindAssetEscrowById` y las tenencias de activos de ambas partes después de la liberación. El registro debe ser `Released`, nombrar al comprador que acepta, y no mostrar ninguna custodia restante. Para la cerradura Python anterior, retenga el devolvido ID y repita la consulta firmada:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

También consulte la tenencia de activos del destino y confirme que aumentó en cuatro unidades. Un recibo de transacción sin el registro de garantía y el estado postal del destino es una verificación incompleta.

## Solución de problemas {#troubleshooting}

- `Not permitted` al abrir, por lo general significa que la autoridad no puede transferir el activo seleccionado en custodia. La resolución de disputas tiene el sistema global `CanResolveEscrowDispute` Por la puerta.
- El rechazo de `expected remaining amount` es un conflicto entre el optimismo y la competencia. Reanudar el registro, decidir si se pretendía la otra retirada / cancelación, y firmar una nueva instrucción sólo si el nuevo estado es aceptable.
- Sólo la autoridad de liberación configurada puede dibujar un bloqueo confiable. El destino no puede liberarlo simplemente porque recibirá los fondos.
- La liberación en el mercado es válida sólo después de la aceptación y el estado de envío del pago; la cancelación se limita a los estados anteriores del ciclo de vida.
- Expiry utiliza el tiempo de registro autorizado. No trate un tiempo local del reloj de la pared como prueba de que `ExpireAssetLock` pasará.
- El incumplimiento de las tarifas pertenece a la parte que presenta el paso del ciclo de vida. El comprador, el vendedor/abrior de fondos y la autoridad para liberar los fondos independientemente Taira.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Modelo nativo de instrucciones de escrow en el commit fijado ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Pruebas de integración nativa en la fijación del compromiso](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python Métodos de custodia del cliente en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama muestra de garantía nativa en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Escrow de activos nativos ](/es/blockchain/escrow.md)
- [Activos funcionales ](./fungible-assets.md)
- [Permisos y funciones ](./permissions-and-roles.md)
