---
translation_locale: my
translation_source: /cookbook/native-escrow.md
translation_source_hash: 0185b6a341ee90ed6cd52fb9f510549b20592468abe6627d3efa639c3b67d1fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Native Asset Escrow {#native-asset-escrow}

## ရလဒ် {#outcome}

Rust သို့မဟုတ် Python ဖြင့် လက်ရှိရိုက်ကူးထားသော သက်တမ်းလည်ပတ်မှု စက်ဝန်းကို အကောင်အထည်ဖော်ပြီး Lock တစ်ခုစီကို သင်တကယ်လေ့လာခဲ့သည့် ကျန်တဲ့ပမာဏနှင့် ချိတ်ဆက်ကာ ဒေသခံ Kotodama Escrow မျက်နှာပြင်ကို JavaScript မှ စုစည်းပါ။

## လိုအပ်ချက်များ {#prerequisites}

- အရင်းအမြစ်ရဲ့ ကိန်းဂဏန်းဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ချက်နဲ့ လုံလောက်တဲ့ ပမာဏကို ပိုင်ဆိုင်ထားတဲ့ ဖွင့်သူ/ရောင်းသူပါ။
- ငွေကြေးထောက်ပံ့မှု (one-key) I105 အဆင့်တစ်ဆင့် တင်ပြတဲ့ အဖွဲ့တိုင်းအတွက် ဖောက်သည်များ။ သက်ရှိအာဏာပိုင်မှ ပေးဆပ်သော `fee_payment` ရည်ရွယ်ချက်၊ အခွန်အရင်းအမြစ်သည် လက်ရှိနှင့် ကိုက်ညီသည်။ Taira faucet response; အရင်းအမြစ်ကို ထည့်သွင်းမထားပါ။ ID စာရွက်စာတမ်းကနေပါ။
- Rust (သို့) Python SDK မှ Iroha ကမ်းလှမ်းချက်အား `bc7114ed1c7f265a156d2100ff09e851cc95702c`
- နိုင်ငံခြားရေးဝန်ကြီး JavaScript compilator ဥပမာ၊ Node.js ၂၄ ထပ်ပြီး ဒေသတွင်းတည်ဆောက်ထားတဲ့ `@iroha/iroha-js` အိတ်အိတ်နှင့် ၎င်း၏ မူလနေရာ `iroha_js_host`; နောက်လိုက်ပါ [JavaScript SDK source build ကို setup လုပ်ပေးခြင်း](/my/guide/tutorials/javascript.md#build-from-source). Browser builds တွေက ပေးရပါမယ်။ `compilerUrl` ဒေသခံ အိမ်ရှင်ကို တင်တာအစားပါ။
- Taira သည် အရင်းအမြစ်လွှဲပြောင်းခြင်းနှင့် အာမခံပေးခြင်း ညွှန်ကြားချက်များကို လက်ခံရမည်ဖြစ်သည်။ အရင်းအမြတ်ပိုင်ရှင်များသည် ၎င်းတို့၏အရင်းအမြစ်မူဝါဒက ခွင့်ပြုသည့်အခါ သာမန်သက်တမ်းလည်ပတ်မှုကို အသုံးပြုနိုင်သည်။ ပဋိပက္ခဖြေရှင်းရန်အတွက် ကမ္ဘာလုံးဆိုင်ရာ `CanResolveEscrowDispute` ခွင့်ပြုချက်လိုအပ်သည်။ လိုအပ်သော အများပြည်သူကွန်ရက်အာဏာပိုင်မရှိပါက ဖန်တီးထားသော ဒေသတွင်းကွန်ရက်ကိုအသုံးပြုပါ။

ရောင်းသူ၊ ဝယ်ယူသူ၊ ချိတ်ဆက်မှုအပြင် ငွေပေးချေခြင်းနှင့် ပြန်လည်ထုတ်လွှတ်ခြင်း စျေးကွက်ကော်မတီပုံစံများ။ ယေဘုယျ Lock များသည်ပန်းတိုင်တစ်ခုနှင့် ရွေးချယ်နိုင်သော သီးခြားပြန်လည်ထုတ်လွှတ်ခွင့်အာဏာကို သတ်မှတ်ထားပြီး အပိုင်းပိုင်းဆွဲခြင်း၊ ဖျက်သိမ်းခြင်းနှင့် သက်တမ်းကုန်ကျခြင်းကိုထောက်ပံ့သည်။

## ခြေလှမ်း {#steps}

### (၁) Rust ဖြင့် စျေးကွက်စာချုပ်ကို ဖြည့်စွက်ပေးပါ။ {#_1-complete-a-marketplace-escrow-with-rust}

IDs နှင့် ဖောက်သည်များကို ရယူသည်။ ၄၀ ယူနစ်ကိုဖွင့်ပြီး ၀ ယ်သူအား အပြင်က ငွေပေးချေမှုကို လက်ခံ၍ အမှတ်တံဆိပ်ပြုစေပြီး နောက်မှရောင်းသူအား ထိန်းသိမ်းမှုလွတ်မြောက်စေသည်။ တင်သွင်းမှုတိုင်းမှာ အာဏာခလစာ ပေးသူအား `FeePaymentIntent` မှတစ်ဆင့်အမည်ပေးထားသည်။

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

ဂိုဏ်းထိန်းသိမ်းမှု အကောင့်ကို စာရင်းအင်းမှ စီမံခန့်ခွဲထားသည်။ ပုံမှန် အရင်းအမြစ်လွှဲပြောင်းရေး လက်မှတ်ပေးခြင်းသည် သက်တမ်းကာလအပြင်တွင် တက်ကြွတဲ့ ဂိုဏန်းထိန်းသိမ်းမှုကို သယ်ဆောင်နိုင်စွမ်းမရှိစေပါ။

### (၂) Python ဖြင့် ယေဘုယျပိတ်တံကို ဖွင့်ပြီး တစ်စိတ်တစ်ပိုင်း ဆွဲပါ။ {#_2-open-and-partially-draw-a-generic-lock-with-python}

လွတ်မြောက်ရေး အာဏာပိုင်က လက်မှတ်ထိုးထားတဲ့ မူလ မှတ်တမ်းကို ဆွဲမယူခင် မေးမြန်းတယ်။ ဒီတိကျတဲ့ `remaining_amount` ကို ကျော်လွှားခြင်းက အကောင်းမြင်တဲ့ တပြိုင်နက်မှုတစ်ခု ဖန်တီးတယ်။ အဆက်မပြတ် parallel request ကို နှစ်ကြိမ် custody ကို debit လုပ်မယ့်အစား ပယ်ချလိုက်ပါတယ်။

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

Python SDK သည် `expected_remaining_amount` ကို ချန်ထားသည့်အခါ အလိုအလျောက် မေးမြန်းနိုင်သည်၊ သို့သော်လည်း လေ့လာသောတန်ဖိုးကို ဖြတ်သန်းခြင်းအားဖြင့် လက်မှတ်ရေးထိုးထားသော စီးပွားရေး ကြိုတင်အခြေအနေသည် လျှောက်လွှာကုဒ်တွင် မြင်သာစေသည်။

Rust lock flow များအတွက်တော့ current constructors တွေကလည်း observed quantity ကိုလိုအပ်ပါတယ်။

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

`DrawdownAssetLock::new` က တန်ဖိုး သုံးခုယူပြီး `CancelAssetLock::new` က နှစ်ခုယူတယ်။ မျှော်မှန်းထားတဲ့ ကျန်တဲ့ ပမာဏကို ဖယ်ရှားလိုက်ရင် ပိုဟောင်း၊ မလုံခြုံတဲ့ ဖုန်းခေါ်ဆိုမှု ပုံစံတစ်ခုကို သရုပ်ဖော်ပါတယ်။

### (၃) Kotodama ဂိုဏ်းလွှာမျက်နှာပြင်ကို JavaScript မှ စုစည်းပါ။ {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript သည် untyped native ညွှန်ကြားချက်များကိုတီထွင်ရန်မလိုပါ။ လက်ရှိ compiler က ledger escrow ကို built-in ကို Kotodama သို့ဖေါ်ပြသည်။ ဖြန့်ဖြူးခြင်းနှင့်ခေါ်ဆိုမှုများနောက်သို့လိုက်ပါ [Smart Contract ကို တည်ဆောက်ပြီးဖြန့်ဖြူးပါ ](./smart-contracts.md).

`native_escrow.ko` အဖြစ် သိမ်းထားပါ-

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

`compile-native-escrow.mjs` အဖြစ် အောက်ပါအချက်တွေကို သိမ်းထားပြီး Node.js မှ တိကျတဲ့ အရင်းအမြစ်ကို စုစည်းရန် အသုံးပြုပါ။

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

ကြိုတင်လိုအပ်ချက်များတွင်ဖော်ပြထားသော source-built package environment မှ run လုပ်ပါ:

```bash
node ./compile-native-escrow.mjs
```

## စစ်ဆေးပါ {#verify}

စျေးကွက်စာချုပ်အတွက် မေးမြန်းချက် `FindAssetEscrowById` ငွေကြေးထုတ်လွှင့်ပြီးနောက် နှစ်ဖက်လုံး၏ အရင်းအမြစ်ပိုင်ဆိုင်မှုများ `Released`, လက်ခံတဲ့ ဝယ်သူရဲ့ အမည်ကို ဖော်ပြပြီး ကျန်နေတဲ့ ထိန်းသိမ်းမှုကို မပြပါ။ Python အပေါ်က Lock ကို ပြန်ပေးထားပြီး ပြန်ပေးထားတဲ့ ID လက်မှတ်ရေးထိုးထားတဲ့ မေးမြန်းချက်ကို ထပ်မံလုပ်ပါ။

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

ထို့အပြင် ရည်မှန်းချက် အရင်းအမြစ် ထိန်းသိမ်းမှုကို မေးမြန်းပြီး ၄ ယူနစ် တိုးမြှင့်ထားကြောင်း အတည်ပြုပါ။ ဂိုဏ်းမှတ်တမ်းမရှိတဲ့ ငွေပေးချေမှုလက်မှတ်တစ်ခုနှင့် ရည်မှန်းချက်နောက်ပိုင်းအခြေအနေက မပြည့်စုံတဲ့ စစ်ဆေးခြင်းဖြစ်သည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `Not permitted` ဖွင့်ထားစဉ်မှာ အာဏာပိုင်က ရွေးချယ်ထားတဲ့ အရင်းအမြစ်ကို ထိန်းသိမ်းမှုထဲ လွှဲပြောင်းလို့မရဘူးလို့ ဆိုလိုပါတယ်။ ပဋိပက္ခဖြေရှင်းရေးမှာ သီးခြားကမ္ဘာလုံးဆိုင်ရာ `CanResolveEscrowDispute` ဂိတ်ရှိတယ်။
- `expected remaining amount` ပယ်ချခြင်းသည် အကောင်းမြင်မှုနှင့် ပြိုင်ဆိုင်မှု ပဋိပက္ခဖြစ်ပါသည်။ မှတ်တမ်းကို ပြန်လည်မေးမြန်းခြင်း၊ အခြားထုတ်ယူ / ဖျက်သိမ်းခြင်းကို ရည်ရွယ်ထားသည်ကို ဆုံးဖြတ်ခြင်း၊ နိုင်ငံသစ်က လက်ခံနိုင်ပါကသာ ညွှန်ကြားချက်အသစ်တစ်စောင်ကို လက်မှတ်ထိုးပါ။
- စိတ်ချရတဲ့ ပိတ်တံကို ဖွဲ့စည်းထားတဲ့ ထုတ်လွှတ်ခွင့် အာဏာပိုင်ကပဲ ဆွဲထုတ်နိုင်တာပါ။ ရည်ရွယ်ချက်က ငွေကြေးရယူဖို့ကြောင့်သာ ထုတ်လွှတ်လို့မရဘူး။
- စျေးကွက်ထုတ်လွှင့်မှုသည် လက်ခံခြင်းနှင့် ငွေပေးချေမှုပို့ခြင်းအခြေအနေမှသာ သက်ဝင်သည်။ ဖျက်သိမ်းခြင်းသည် ပိုမိုစောသော ဘဝပတ်ဝန်းကျင်အခြေအနေများဖြင့်သာ ကန့်သတ်ထားသည်။
- `ExpireAssetLock` ကို ဖြတ်သန်းသွားမှာကို သက်သေပြဖို့ ဒေသတွင်း နံရံနာရီ အချိန်ဖြတ်တာကို မသုံးပါနဲ့။
- ငွေကြေးပေးချေမှု ကျရှုံးမှုသည် သက်တမ်းပတ်စဉ်အဆင့်ကို တင်ပြသည့် ဖက်သည်ဖြစ်ပါသည်။ ရင်းနှီးမြှုပ်နှံမှုဝယ်သူ၊ရောင်းသူ/ဖွင့်လှစ်သူနှင့် Taira တွင် လွတ်လပ်စွာလွှတ်တင်ခွင့်ရှိသူ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Native escrow instruction model at the pinned commit ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/isi/escrow.rs)
- [Native escrow integration tests at the pinned commit ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/native_escrow.rs) (ရင်းနှီးမြှုပ်နှံမှု)
- [Python ကန့်သတ်ထားသော commit တွင် escrow client method များ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama အမိန့်ချမှတ်ထားသော commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/native_escrow.ko) တွင် မူရင်း escrow နမူနာ
- [တိုင်းရင်းသားလက်နက်ကိုင် အရင်းအမြစ် (Native asset escrow) ](/my/blockchain/escrow.md)
- [ငွေကြေးအထောက်အပံ့များ ](./fungible-assets.md)
- [ခွင့်ပြုချက်များနှင့် ကဏ္ဍများ ](./permissions-and-roles.md)
