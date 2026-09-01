# Native Asset Escrow

## Outcome

Choose between a marketplace escrow and a destination-bound asset lock,
execute the current typed lifecycle with Rust or Python, bind every lock
retry to the remaining amount you actually observed, and compile the native
Kotodama escrow surface from JavaScript.

## Prerequisites

- A numeric asset definition and an opener/seller that owns enough
  quantity.
- Funded, single-key I105 clients for every party that submits a step. Use
  a live authority-paid `fee_payment` intent whose fee asset matches the
  current Taira faucet response; do not embed an asset ID from
  documentation.
- The current Rust or Python SDK from Iroha commit
  `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- For the JavaScript compiler example, Node.js 24 plus a locally built
  `@iroha/iroha-js` package and its native `iroha_js_host`; follow the
  [JavaScript SDK source-build setup](/guide/tutorials/javascript.md#build-from-source).
  Browser builds must provide `compilerUrl` instead of loading the native host.
- Taira must admit the asset transfer and escrow instructions. Asset owners
  can use the ordinary lifecycle when their asset policy allows it;
  resolving a dispute requires the global `CanResolveEscrowDispute`
  permission. Use a generated local network when the needed public-network
  authority is absent.

Marketplace escrow models seller, buyer, off-chain payment, and release.
Generic locks name a destination and optionally a distinct release
authority; they support partial drawdown, cancellation, and expiry.

## Steps

### 1. Complete a marketplace escrow with Rust

This function receives real typed IDs and clients. It opens 40 units, lets
the buyer accept and mark off-chain payment, then lets the seller release
custody. Each submission names the authority fee payer through
`FeePaymentIntent`.

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

The custody account is ledger-managed. Granting a normal asset-transfer
token does not make active custody drainable outside the escrow lifecycle.

### 2. Open and partially draw a generic lock with Python

The release authority queries the signed native record before drawing down.
Passing that exact `remaining_amount` provides optimistic concurrency: a
stale parallel request is rejected instead of debiting custody twice.

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

The Python SDK can query automatically when `expected_remaining_amount` is
omitted, but passing the observed value makes the signed economic
precondition visible in application code.

For Rust lock flows, the current constructors also require the observed
amount:

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

`DrawdownAssetLock::new` takes three values; `CancelAssetLock::new` takes
two. Omitting the expected remaining amount describes an older, unsafe call
shape.

### 3. Compile the Kotodama escrow surface from JavaScript

JavaScript does not need to invent untyped native instructions. The current
compiler exposes the ledger escrow built-ins to Kotodama; deployment and
calls then follow
[Build and deploy a smart contract](./smart-contracts.md).

Save this as `native_escrow.ko`:

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

Save the following as `compile-native-escrow.mjs` and use it to compile that
exact source from Node.js:

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

Run it from the source-built package environment described in the
prerequisites:

```bash
node ./compile-native-escrow.mjs
```

## Verify

For marketplace escrow, query `FindAssetEscrowById` and both parties' asset
holdings after release. The record must be `Released`, name the accepting
buyer, and show no remaining custody. For the Python lock above, retain the
returned ID and repeat the signed query:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Also query the destination's asset holding and confirm that it increased by
four units. A transaction receipt without the escrow record and destination
post-state is incomplete verification.

## Troubleshooting

- `Not permitted` while opening usually means the authority cannot transfer
  the selected asset into custody. Dispute resolution has the separate
  global `CanResolveEscrowDispute` gate.
- `expected remaining amount` rejection is an optimistic-concurrency
  conflict. Re-query the record, decide whether the other drawdown/cancel
  was intended, and sign a new instruction only if the new state is
  acceptable.
- Only the configured release authority can draw a trusted lock. The
  destination cannot release it merely because it will receive the funds.
- Marketplace release is valid only after acceptance and payment-sent
  state; cancellation is limited to the earlier lifecycle states.
- Expiry uses authoritative ledger time. Do not treat a local wall-clock
  timeout as proof that `ExpireAssetLock` will pass.
- A fee failure belongs to the party submitting that lifecycle step. Fund
  buyer, seller/opener, and release authority independently on Taira.

## Source and related docs

- [Native escrow instruction model at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Native escrow integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python escrow client methods at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama native escrow sample at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Native asset escrow](/blockchain/escrow.md)
- [Fungible assets](./fungible-assets.md)
- [Permissions and roles](./permissions-and-roles.md)
