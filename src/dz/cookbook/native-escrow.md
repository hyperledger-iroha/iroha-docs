---
translation_locale: dz
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# རང་སོའི་རྒྱུ་དངོས་ཚུ་གི་ ཉེན་སྲུང་འབད་ཐབས། {#native-asset-escrow}

## གྲུབ་འབྲས་ {#outcome}

ཚོང་འབྲེལ་ས་ཁོངས་གི་གཏེར་ཁ་དང་ དམིགས་ཡུལ་ནང་བཅའ་མར་གཏོགས་མི་ རྒྱུ་དངོས་ཀྱི་ལྡེ་མིག་ཚུ་གི་བར་ན་ གདམ་ཁ་རྐྱབས་ཞིནམ་ལས་ Rust ཡང་ན་ Python དང་གཅིག་ཁར་ ད་ལྟོའི་ཨེབ་གཏང་འབད་ཡོད་པའི་ཚེ་རིམ་དེ་ལག་ལེན་བསྟར་སྤྱོད་འབད། ལྡེ་མིག་གི་ལྡེ་མིག་རེ་ལུ་ ཁྱོད་ཀྱིས་ཐད་ཀར་དུ་མཐོང་མིའི་དངུལ་ཀྲམ་ལྷག་ལུས་ལུ་ བསྡུ་སྒྲིག་འབད། དེ་ལས་ JavaScript ལས་ རང་ལུགས་ཀྱི་ Kotodama གཏེར་ཁའི་ལྡེ་མིག་སྤེལ་འབད།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- ཨང་གྲངས་ཀྱི་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་དང་ འཕྱེས་/བཙོང་མི་ཅིག་ལུ་ ཚད་ལྡན་ཡོད་མི་དེ་ཨིན།
- དངུལ་རྐྱང་གི་ལྡེ་མིག་ I105 ལས་བྱེདཔ་ཚུ་གི་དོན་ལུ་ ཐབས་ལམ་འདི་བཙུགས་ཏེ་ ལག་ལེན་འཐབ་ཨིན། འབྲེལ་ཡོད་དབང་འཛིན་ཀྱིས་སྤྲོད་འོང་མི་ `fee_payment` དམིགས་གཏད་ལག་ལེན་དེ་ ལག་ལེན་འཐབ་ནི་ཨིནམ་དང་ རིན་གོང་དངུལ་ཀྲམ་དེ་ ད་ལྟོའི་ Taira ཆུ་གཡུར་གྱི་ལན་ཐོ་བཀོད་དང་འདྲན་འདྲ་ཨིན་; ཡིག་ཆ་ནང་ལས་ རྒྱུ་དངོས་ཅིག་ ID ནང་མ་སྦྲེལ་གཏང་།
- ད་ལྟོའི་ Rust ཡང་ན་ Python SDK ལས་ Iroha ཁས་བླངས་འབད་ `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- གྱི་དོན་ལུ་ JavaScript དཔེ་སྒྲོམ་བཟོ་མི་ Node.js 24 དེ་ལས་ ས་གནས་ཀྱི་བཟོ་སྐྲུན་འབད་མི་ཅིག་ `@iroha/iroha-js` སྦ་སྒོར་དང་ ཨའི་གི་ཐོན་ཁུངས་ `iroha_js_host`; ལྟ་རྟོག་འབད་ [JavaScript SDK source-build གཞི་སྒྲིག་འབདཝ་ཨིན།](/dz/guide/tutorials/javascript.md#build-from-source). བལྟ་བཤལཔ་གིས་བཟོ་སྐྲུན་འབད་དགོཔ་ཨིན། `compilerUrl` ས་གནས་ཀྱི་མགྲོན་པོ་ལུ་ བཀྲམ་སྤེལ་འབད་ནི་མེན་པར་
- Taira གིས་ རྒྱུ་དངོས་གནས་སྤེལ་དང་ གཏན་འཁེལ་གྱི་བཀོད་རྒྱ་ཚུ་ ངོས་ལེན་འབད་དགོཔ་ཨིན། རྒྱུ་དངོས་གི་ཇོ་བདག་ཚུ་གིས་ རང་བཞིན་གྱི་ སྲིད་བྱུས་དེ་གིས་ དེ་གི་དོན་ལུ་ གོ་སྐབས་ཡོད་པ་ཅིན་ ཚེ་སྲོག་འཁོར་ལོའི་ལག་ལེན་འཐབ་ཚུགས། རྩོད་གཞི་འདི་ སེལ་ཐབས་ལུ་ འཛམ་གླིང་ཡོངས་ཀྱི་ `CanResolveEscrowDispute` གི་ཆོག་ཐམ་ དགོཔ་ཨིན། དགོས་མཁོ་ཅན་གྱི་ མི་མང་གི་དྲ་ལམ་དབང་འཛིན་མེད་པ་ཅིན་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཁ་ཐུག་གི་དྲ་ལམ་ལག་ལེན་འཐབ་འོང་།

ཚོང་ཁང་གི་ཚོང་ཚབ་དང་ཉོ་མི་ དེ་ལས་ ཕྱི་འབྲེལ་སྤྲོད་ལེན་ དེ་ལས་གློག་བརྙན་བཏོན་ཐབས། སྤྱིར་བཏང་ལྡེ་མིག་ཚུ་གིས་ དམིགས་ཡུལ་ཅིག་དང་ གདམ་ཁ་རྐྱབ་པ་ཅིན་ གློག་བརྙན་བཀྲམ་སྤེལ་དབང་འཛིན་སོ་སོར་གྱི་ མིང་བཏགས་དོ་ཡོདཔ་ད་ ཁོང་གིས་ ཆ་ཤས་ཀྱི་ཕྱིར་འཐེན་འབད་ནི་དང་ བཏོན་གཏང་ནི་ དེ་ལས་ དུས་མཐའན་མཇུག་ལུ་ རྒྱབ་སྐྱོར་འབདཝ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### 1. Rust དང་གཅིག་ཁར་ཚོང་ཁྲོམ་གྱི་གཏེར་ཡིག་འདི་ མཇུག་བསྡུ་དགོ། {#_1-complete-a-marketplace-escrow-with-rust}

འ་ནི་འགན་ཁུར་འདི་ IDs དང་ client ཚུ་ཐོབ་ཨིན། དེ་གིས་ ཡུ་ནིཊ་༤༠ སྒོ་བསྡམས་ཏེ་ ཉོ་མི་ལུ་ accept and mark off-chain payment འབད་ཚུགསཔ་བཟོཝ་ཨིན། དེ་ལས་བཙོང་མི་ཚུ་གིས་ custody དགོངས་ཡངས་གཏང་ཚུགསཔ་བཟོཝ་ཨིན་མས། བགོ་བཀྲམ་རེ་གིས་དབང་འཛིན་གྱི་འཐུས་སྤྲོད་མི་གི་མིང་འདི་ `FeePaymentIntent` ཟེར་མི་ནང་བཙུགས་འོང་།

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

སྲུང་སྐྱོབ་རྩིས་ཁྲ་འདི་ ལེ་ཇར་གིས་ འཛིན་སྐྱོང་འབད་དོ་ཡོདཔ་ཨིན། རྒྱུ་དངོས་གནས་སྤེལ་གྱི་རྒྱུན་ལྡན་རྟགས་མ་བྱིན་པ་ཅིན་ སྲུང་སྐྱོབ་བརྟན་ཏོག་ཏོ་དེ་ སྲུང་སྐྱོབ་ཚེ་ཚད་ཀྱི་མཐའ་མཚམས་ལས་ ཕྱི་ཁར་བཏོན་ཚུགསཔ་ཅིག་སྦེ་མི་འགྱུར་བས།

### ༢. Python གྱི་ཐོག་ལས་ སྤྱིར་བཏང་ལྡེ་མིག་ཅིག་ཕྱེ་སྟེ་ ཆ་ཤས་ཅིག་སྦེ་བཏོན་དགོ། {#_2-open-and-partially-draw-a-generic-lock-with-python}

བཀྲམ་སྤེལ་དབང་འཛིན་གྱིས་ ཡིག་ཆ་ཨེབ་གཏང་མ་འབད་བའི་ཧེ་མར་ ཐོ་བཀོད་འབད་ཡོད་པའི་ རང་བཞིན་གྱི་ཐོ་ཡིག་ཚུ་ དྲི་དཔྱད་འབདཝ་ཨིན། འདི་བདེན་པའི་ `remaining_amount` མཐར་འཁྱོལ་ཅན་ཅིག་ཨིནམ་ལས་ དུས་རྒྱུན་གྱི་མཉམ་འབྲེལ་ཞུ་ཡིག་འདི་ ཆ་མེད་བཏང་ instead of custody debiting ཚར་གཉིས་སྦེ་ཨིན།

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

Python SDK གིས་ `expected_remaining_amount` བརྗོད་མ་ཚར་བའི་སྐབས་ རང་བཞིན་གྱིས་དྲི་བ་དྲི་ཚུགས། ཨིན་རུང་ མཐོང་ཡོད་པའི་གོང་ཚད་འདི་བརྒལ་བ་ཅིན་ ཐོ་བཀོད་འབད་ཡོད་པའི་ དཔལ་འབྱོར་གྱི་གནས་སྟངས་འདི་ ལག་ལེན་ཡིག་ནང་མཐོང་ཚུགསཔ་བཟོཝ་ཨིན།

Rust ལྡེ་མིག་གི་རྒྱུན་འགྲུལ་ཚུ་གི་དོན་ལུ་ ད་ལྟོའི་བཟོ་སྐྲུན་འབད་མི་ཚུ་གིས་ བརྟག་ཞིབ་འབད་ཡོད་པའི་གདམ་ཁ་དེ་ཡང་ དགོཔ་ཨིན།

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

`DrawdownAssetLock::new` གིས་ གནས་གོང་༣ དང་ `CancelAssetLock::new` གིས་ གནས་གོང་༢ ལེན་དོ་ཡོདཔ་ཨིན། མཇུག་བསྡུཝ་ད་ བརླག་གཏང་ནི་དེ་ རྒས་ཤོས་དང་ ཉེན་སྲུང་མེད་པའི་འབོ་ནི་གི་རྣམ་གཞག་ཅིག་ཨིན་མས།

### ༣. Kotodama གི་གཏེར་ཁའི་ས་ཁོངས་འདི་ JavaScript ལས་ བསྡུ་སྒྲིག་འབད་དགོ། {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript གིས་ རང་ལུགས་ཀྱི་བསླབ་བྱ་ཚུ་བཟོ་མི་དགོ་། ད་ལྟོའི་ཡིག་འབྲུ་བསྡུ་སྒྲོམ་འདི་གིས་ ལེ་ཌཇར་ཨེགསརོཨའི་ནང་བཙུགས་ཡོད་པའི་ Kotodama ལུ་བཏོན་གཏངམ་ཨིན། བགོ་བཀྲམ་འབད་ནི་དང་འབོ་ནི་ དེ་ལས་ [ བཟོ་ཞིནམ་ལས་ གློག་རིག་གི་འཆམ་ཡིག་](./smart-contracts.md) གཞི་བཙུགས་འབདཝ་ཨིན།

འདི་ལུ་ `native_escrow.ko`སྦེ་བཞག་ནི།

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

འོག་གི་ཡིག་ཆ་འདི་ `compile-native-escrow.mjs`སྦེ་བཞག་ཞིནམ་ལས་ Node.js ལས་ངོ་མ་དེ་ བསྡུ་སྒྲིག་འབད་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་དགོ།

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

གཞི་རྟེན་བཟོ་སྐྲུན་འབད་ཡོད་པའི་ ཕབ་ལེནཌ་གི་ གནས་སྟངས་ནང་ལས་ བཏོན་གཏང་ནི།

```bash
node ./compile-native-escrow.mjs
```

## བརྟག་དཔྱད་འབད་ {#verify}

ཚོང་འབྲེལ་གྱི་ས་ཁོངས་ནང་ གཏན་འཁེལ་གྱི་དོན་ལུ་ དྲི་བ་ཞུ་ནི། `FindAssetEscrowById` དེ་ལས་ ཐོ་བཀོད་འབད་ཚར་བའི་ཤུལ་ལུ་ སྲིད་དོན་ཚོགས་པ་གཉིས་ཆ་རའི་ རྒྱུ་དངོས་ཚུ་ནང་ འཛིན་བཟུང་འབདཝ་ཨིན། `Released`, ངོས་ལེན་འབད་མི་ཉོ་མི་གི་མིང་བཏོན་ཏེ་ བསྐྱིན་ཚབ་མ་བྱིན་པར་ བཞག་ཡོདཔ་ཨིན། Python ལྕགས་སྒོ་བསྡམས་ཏེ་ བཏང་བཞག་ནུག ID དེ་ལས་རྟགས་བཀོད་ཅན་གྱི་དྲི་ལན་འདི་ སླར་ལོག་འབད་:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

དེ་མ་ཚད་ འགྲོ་འགྲུལ་འབད་སའི་ས་ཁོངས་ཀྱི་ རྒྱུ་དངོས་གི་གནས་ཚད་ཡང་འཚོལ་ཞིནམ་ལས་ བརྒྱ་ཆ་༤ ལུ་ ཡར་སེང་སོང་ཡི་ཟེར་ངོས་ལེན་འབད་ཡོདཔ་ཨིན། གཏན་འཁེལ་གྱི་ཐོ་ཡིག་དང་ འགྲོ་འགྲུལ་འབད་བའི་ཤུལ་ལུ་ གནས་སྡུད་མེད་མི་ ཌེ་སི་ཊེནཊི་གི་རྩིས་ཐོ་བཀོད་འདི་ དམ་ཚིག་མ་ཚང་བའི་བདེན་འཛིན་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `Not permitted` སྒོ་བསྡམས་པའི་སྐབས་ལུ་ དབང་འཛིན་གྱིས་ བཙག་འཐུ་འབད་ཡོད་མི་ རྒྱུ་དངོས་ཚུ་ ཉེན་སྲུང་གི་གནས་སྟངས་ནང་ བཏང་མི་ཚུགས་ཟེར་ཨིན་མས། རྩོད་གཞི་འདི་ སེལ་ཐབས་ལུ་ ཕྱོགས་སོ་སོ་སྦེ་ ཡོངས་འབྲེལ་སྒོ་ར་ `CanResolveEscrowDispute` ཡོདཔ་ཨིན།
- `expected remaining amount` ཆ་མེད་གཏང་ནི་དེ་ དོ་འགྲན་འབད་མི་དང་ བཀྲམ་སྤེལ་འཐབ་འཛིང་ཨིན། ཐོ་བཀོད་འདི་ ལོག་སྟེ་ར་དྲི་དགོ་། གཞན་གྱི་ཕྱིར་བཏོན་/ཕྱིར་འབུད་འབད་ནིའི་འཆར་གཞི་ཡོདཔ་ཨིན་ན་ ཐག་བཅད་དགོ་ དེ་ལས་ བཀའ་རྒྱ་གསརཔ་ཅིག་གུ་ མཚན་རྟགས་བཀོད་པ་ཅིན་རྐྱངམ་གཅིག་ གནས་སྟངས་གསརཔ་དེ་ ངོས་ལེན་འབད་ཚུགས་འོང་།
- ཐོ་བཀོད་འབད་ཡོད་པའི་དབང་འཛིན་རྐྱངམ་གཅིག་གིས་ ཡིད་ཆེས་ལྡན་པའི་ལྡེ་མིག་ཅིག་བཏོན་ཚུགས། འགྲོ་འགྲུལ་འབད་སའི་ས་ཁོངས་དེ་ དངུལ་ཕོགས་ཐོབ་པའི་དོན་ལས་རྐྱངམ་གཅིག་ལུ་ བཏོན་གཏང་མི་ཚུགས་འོང་།
- ཚོང་འབྲེལ་གྱི་གནས་སྟངས་འདི་ ངོས་ལེན་དང་ སྐྱིན་འགྲུལ་སྤྲོད་པའི་ཤུལ་ལས་རྐྱངམ་གཅིག་ འཐོབ་ཚུགསཔ་ཨིན། ཆ་མེད་གཏང་ནི་དེ་ ཧེ་མ་གི་ཚེ་རིང་གི་ གནས་སྟངས་ཚུ་ནང་རྐྱངམ་ཅིག་ བཀག་ཆ་འབད་ཡོདཔ་ཨིན།
- expiry གིས་ ཡིད་ཆེས་ཅན་གྱི་དུས་དེབ་ལག་ལེན་འཐབ་ཨིན། ས་གནས་ཀྱི་ Wall-clock timeout འདི་ `ExpireAssetLock` རྒྱུན་ཆད་འབྱུང་ནིའི་རྟགས་མཚན་སྦེ་མ་བལྟ་ཤིག
- དངུལ་ཕོགས་མ་བྱིན་མི་དེ་ སྲོལ་འཁོར་གྱི་རིམ་པ་དེ་ ཕུལ་མི་སྡེ་ཚན་ལུ་ཨིན། མ་དངུལ་ཉོ་མི་དང་བཙོང་མི་/སྒོ་ཕྱེས་མི་ དེ་ལས་ རང་དབང་རང་བཙན་སྦེ་ Taira ལུ་གླར་སྤྱོད་འབད་ནིའི་དབང་ཚད་ཡོདཔ་ཨིན།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [རང་ལུགས་ཀྱི་གཏེར་ཁའི་བརྡ་སྟོན་གྱི་རྣམ་གཞག་ ཚོད་བསྲེ་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [རང་ལུགས་ཀྱི་གཏེར་ཁའི་མཐུན་འབྲེལ་གྱི་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་གི་བཅའ་ཁྲིམས་ནང་](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python ཟད་འགྲོ་ཕབ་ལེན་འབད་ནིའི་ ཐབས་ལམ་ཚུ་](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama རང་སོའི་གཏེར་དངུལ་གྱི་དཔེ་རྙིཊ་ཚུ་ ཕབ་ལེན་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [རང་སོའི་རྒྱུ་དངོས་གི་གཏའ་མ་](/dz/blockchain/escrow.md)
- [དངུལ་རྐྱང་གི་རྒྱུ་དངོས་ཚུ་](./fungible-assets.md)
- [འཁྲུན་ཆོད་དང་ འགན་ཁུར་ཚུ་](./permissions-and-roles.md)
