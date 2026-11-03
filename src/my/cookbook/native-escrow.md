---
translation_locale: my
translation_source: /cookbook/native-escrow.md
translation_source_hash: d399284a2baec507e4c979c762d6e216d8c3fbc5b4b4fe221b6bbb0049ee9fd9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Native Asset Escrow {#native-asset-escrow}

## ရလဒ် {#outcome}

Rust သို့မဟုတ် Python ဖြင့် လက်ရှိရိုက်ကူးထားသော သက်တမ်းလည်ပတ်မှု စက်ဝန်းကို အကောင်အထည်ဖော်၊ ပိတ်သိမ်းမှုအား ပြန်လည်ကြိုးစားတိုင်းကို သင်တကယ်လေ့လာခဲ့သည့် ကျန်တဲ့ပမာဏနှင့် ချည်နှောင်ပြီး ဒေသခံ Kotodama ကော်မတီ၏ ပိတ်သိမ်းခြင်းမျက်နှာပြင်ကို JavaScript မှ စုစည်းပါ။

## လိုအပ်ချက်များ {#prerequisites}

- အရင်းအမြစ်ရဲ့ ကိန်းဂဏန်းဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ချက်နဲ့ လုံလောက်တဲ့ ပမာဏကို ပိုင်ဆိုင်ထားတဲ့ ဖွင့်သူ/ရောင်းသူပါ။
- အဆင့်တစ်ခုကို တင်သွင်းသည့် ပါဝင်သူတိုင်းအတွက် ငွေထည့်ထားသော သော့တစ်ခုတည်းသုံး I105 client များ။ အခွန်အရင်းအမြစ်သည် လက်ရှိ Taira faucet မူဝါဒက ထုတ်ပြန်ထားသည့် အရင်းအမြစ်နှင့် ကိုက်ညီသော authority က ပေးဆောင်သည့် live `fee_payment` intent ကို အသုံးပြုပါ။ စာရွက်စာတမ်းများမှ asset ID ကို ထည့်သွင်းမထားပါနှင့်။
- လက်ရှိ Rust သို့မဟုတ် Python SDK ကနေ Iroha ပရိုတိုကောကို အဆုံးသတ်ခြင်း `c8c872461e92f04325c350cdd952f4276e96f9dc` ။
- JavaScript compiler နမူနာအတွက်, ဒေသတွင်းဖွံ့ဖြိုးရေးပတ်ဝန်းကျင်တွင်တည်ဆောက်ထားသော Node.js 24 နှင့်အပါအဝင် `@iroha/iroha-js` ပက်ကတ်နှင့် ၎င်း၏မိခင် `iroha_js_host` ကိုလိုက်ပါ၊ [JavaScript SDK အရင်းအမြစ်တည်ဆောက်မှုအစီအစဉ်](/my/guide/tutorials/javascript.md#build-from-source) ကိုလိုက်နာပါ။ ဘရာဆာ builds သည်မိခင် host ကို load လုပ်ခြင်းအစား`compilerUrl` ကိုပေးရန်လိုအပ်သည်။
- Taira သည် အရင်းအမြစ်လွှဲပြောင်းခြင်းနှင့် အာမခံပေးခြင်း ညွှန်ကြားချက်များကို လက်ခံရမည်ဖြစ်သည်။ အရင်းအမြတ်ပိုင်ရှင်များသည် ၎င်းတို့၏အရင်းအမြစ်မူဝါဒက ခွင့်ပြုသည့်အခါ သာမန်သက်တမ်းလည်ပတ်မှုကို အသုံးပြုနိုင်သည်။ အငြင်းပွားမှုအတွက် ကမ္ဘာလုံးဆိုင်ရာ `CanResolveEscrowDispute` ခွင့်ပြုချက်လိုအပ်သည်။ လိုအပ်သော အများပိုင် blockchain ကွန်ရက် ခွင့်ပြုမှု မူဝါဒမရှိတဲ့အခါ ဖန်တီးထားတဲ့ ဒေသတွင်းကွန်ယက်ကိုအသုံးပြုပါ။

ရောင်းသူ၊ ဝယ်သူ၊ ချိတ်ဆက်မှုအပြင် ငွေပေးချေခြင်းနှင့် ထုတ်လွှင့်ခြင်း စသည်တို့ကို Marketplace escrow မော်ဒယ်များအဖြစ် သတ်မှတ်ထားသည်။ ယေဘုယျ lock များသည်ပန်းတိုင်တစ်ခုနှင့် ရွေးချယ်နိုင်သော သီးခြားထုတ်လွှင့်ခွင့် မူလစာရင်းကို အမည်ပေးထားပြီး တစ်စိတ်တစ်ပိုင်းဆွဲယူခြင်း၊ ဖျက်သိမ်းခြင်းနှင့် သက်တမ်းကုန်ဆုံးခြင်းကို ထောက်ပံ့သည်။

## ခြေလှမ်း {#steps}

### (၁) Rust ဖြင့် စျေးကွက်စာချုပ်ကို ဖြည့်စွက်ပေးပါ။ {#_1-complete-a-marketplace-escrow-with-rust}

ဤလုပ်ဆောင်ချက်သည် အစစ်အမှန်ရိုက်ကူးထားသော ID များနှင့်ဖောက်သည်များကိုလက်ခံရရှိသည်။ ၎င်းသည်ယူနစ် ၄၀ ကိုဖွင့်၍ ၀ ယ်သူအားချိတ်ဆက်မှုအပြင်မှပေးသွင်းမှုကို လက်ခံပြီး အမှတ်တံဆိပ်သတ်မှတ်ခွင့်ပြုကာ ရောင်းသူအား ထိန်းသိမ်းမှုကိုလွတ်မြောက်စေသည်။ တင်ပို့မှုတစ်ခုစီသည် `FeePaymentIntent` မှတစ်ဆင့် ခွင့်ပြုချက်လိုင်စင်ခ ပေးဆောင်သူ၏နာမည်ကိုပေးသည်။

```rust
use eyre::{Result, ensure};
use iroha::{
    blocking::Client,
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

    seller.submit(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller
        .client()
        .query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

ပိုင်ဆိုင်မှု အကောင့်ကို blockchain ledger က စီမံခန့်ခွဲပါတယ်။ ပုံမှန် အရင်းအမြစ်လွှဲပြောင်းရေး token ကိုပေးခြင်းအားဖြင့် အငှားသက်တမ်း စက်ဝန်းအပြင်မှာ တက်ကြွတဲ့ ပိုင်ဆိုင်မှုကို စွန့်လွှတ်နိုင်စွမ်းမရှိပါ။

### (၂) Python ဖြင့် ယေဘုယျပိတ်တံကို ဖွင့်ပြီး တစ်စိတ်တစ်ပိုင်း ဆွဲပါ။ {#_2-open-and-partially-draw-a-generic-lock-with-python}

ထုတ်ပေးခွင့်ရှိသူသည် drawdown မပြုလုပ်မီ လက်မှတ်ထိုးထားသော native မှတ်တမ်းကို မေးမြန်းသည်။ ထိုတိကျသော `remaining_amount` ကို ပေးပို့ခြင်းဖြင့် optimistic concurrency ကို ရရှိစေသည်။ ခေတ်နောက်ကျနေသော အပြိုင် request တစ်ခုကို custody မှ နှစ်ကြိမ် နုတ်ယူမည့်အစား ငြင်းပယ်သည်။ `client` သည် `local_signing_context=LocalSigningContext(network_id)` နှင့် ကွန်ရက်၏ `chain_discriminant` ဖြင့် ဖန်တီးထားသော `ToriiClient` ဖြစ်သည်။ transaction helper များသည် ကွန်ရက်အထောက်အထားကို ထို context မှ ယူပြီး လက်မှတ်ထိုးထားသော query များသည် ၎င်းကို `network_id` အဖြစ် ယူသည်။

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
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"
    network_id = client.local_signing_context.network_id

    client.open_asset_lock_and_wait(
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
        network_id=network_id,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
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
        network_id=network_id,
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
let before = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` သည် lock၊ ပမာဏနှင့် တွေ့ရှိထားသော ကျန်ရှိပမာဏကို ယူသည်။ `CancelAssetLock::new` သည် lock နှင့် တွေ့ရှိထားသော ကျန်ရှိပမာဏကို ယူသည်။ ကျန်ရှိပမာဏသည် အရင်ပြောင်းလဲသွားခဲ့ပါက ledger သည် ညွှန်ကြားချက် နှစ်ခုအနက် မည်သည့်တစ်ခုကိုမဆို ငြင်းပယ်သည်။

### (၃) Kotodama ဂိုဏ်းလွှာမျက်နှာပြင်ကို JavaScript မှ စုစည်းပါ။ {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript သည် untyped native ညွှန်ကြားချက်များကို တီထွင်ရန် မလိုအပ်ပါ။ လက်ရှိ compiler သည် ledger escrow built-in များကို Kotodama သို့ ထုတ်ဖော်ပေးထားပြီး ထို့နောက် ဖြန့်ချိခြင်းသည် [Smart Contract ကို ဆောက်လုပ်ပြီး ဖြန့်ချိပါ](./smart-contracts.md) အတိုင်း ဆက်လက်လုပ်ဆောင်သည်။ `open_offer` entrypoint သည် `authorize(Admin)` ဖြစ်သောကြောင့် executor သည် ၎င်း၏ခေါ်ဆိုသူအား ဖြန့်ချိထားသော လိပ်စာနှင့် `permission: "Admin"` အတွက် `CanUseContractPermission` ကို ကိုင်ဆောင်ထားရန် လိုအပ်သည်။

`native_escrow.ko` အဖြစ် သိမ်းထားပါ-

```kotodama
seiyaku NativeEscrowAitai {
    permission Admin;
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize(Admin) {
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

စျေးကွက်စာချုပ်အတွက် မေးမြန်းချက် `FindAssetEscrowById` ငွေကြေးထုတ်လွှင့်ပြီးနောက် နှစ်ဖက်လုံး၏ အရင်းအမြစ်ပိုင်ဆိုင်မှုများ `Released`, လက်ခံတဲ့ ဝယ်သူရဲ့ အမည်ကို ဖော်ပြပြီး ကျန်နေတဲ့ ထိန်းသိမ်းမှုကို မပြပါ။ Python အထက်မှာ Lock လုပ်ပြီး ပြန်လာတဲ့ ID ကို သိမ်းထားပြီး လက်မှတ်ထိုးထားတဲ့ query ကို ထပ်လုပ်ပါ။

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    network_id=client.local_signing_context.network_id,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

ထို့အပြင် ရည်မှန်းချက် အရင်းအမြစ် ထိန်းသိမ်းမှုကို မေးမြန်းပြီး ၄ ယူနစ် တိုးမြှင့်ထားကြောင်း အတည်ပြုပါ။ ဂိုဏ်းမှတ်တမ်းနှင့် ရည်မှန်းချက် နောက်ပိုင်းအခြေအနေမရှိသော ငွေချေးမှု ပရိုတိုကော ရလဒ် မှတ်တမ်းတစ်ခုသည် မပြည့်စုံတဲ့ စစ်ဆေးခြင်းဖြစ်သည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `Not permitted` ဖွင့်နေစဉ်မှာ ခွင့်ပြုချက် ရင်းနှီးမြှုပ်နှံသူက ရွေးချယ်ထားတဲ့ အရင်းအမြစ်ကို ထိန်းသိမ်းမှုထဲ လွှဲပြောင်းလို့မရဘူးလို့ ဆိုလိုပါတယ်။ ပဋိပက္ခဖြေရှင်းရေးမှာ သီးခြားကမ္ဘာလုံးဆိုင်ရာ `CanResolveEscrowDispute` ဂိတ်ရှိသည်။
- `asset lock remaining amount changed since the drawdown was prepared` (သို့မဟုတ် `...since the cancellation was prepared`) သည် optimistic-concurrency ပဋိပက္ခ ဖြစ်သည်။ မှတ်တမ်းကို ပြန်လည်မေးမြန်းပါ၊ အခြား drawdown/cancel ကို ရည်ရွယ်ထားခြင်း ရှိမရှိ ဆုံးဖြတ်ပါ၊ အခြေအနေသစ်ကို လက်ခံနိုင်မှသာ ညွှန်ကြားချက်အသစ်တစ်ခုကို လက်မှတ်ထိုးပါ။
- Configured Release Authorization Principal ကသာ ယုံကြည်စိတ်ချရတဲ့ Lock ကို ဆွဲနိုင်ပြီး ရည်ရွယ်ချက်က ငွေကြေးကို လက်ခံရရှိမှာမို့လို့ အဲဒါကို မထုတ်လွှတ်နိုင်ပါဘူး။
- စျေးကွက်ထုတ်လွှင့်မှုသည် လက်ခံခြင်းနှင့် ငွေပေးချေမှုပို့ခြင်းအခြေအနေမှသာ သက်ဝင်သည်။ ဖျက်သိမ်းခြင်းသည် ပိုမိုစောသော ဘဝပတ်ဝန်းကျင်အခြေအနေများဖြင့်သာ ကန့်သတ်ထားသည်။
- Expiry သည် ခိုင်မာသော blockchain ledger အချိန်ကို အသုံးပြုသည်။ `ExpireAssetLock` ကို ဖြတ်သန်းသွားမည်ဟု သက်သေအဖြစ် ဒေသတွင်းဒေသခံစနစ်နာရီအချိန်ဖြတ်တောက်မှုကို မသုံးစွဲပါ။
- Taira တွင် ရင်းနှီးမြှုပ်နှံသူ၊ ရောင်းသူ/ဖွင့်လှစ်သူနှင့် ထုတ်ပြန်ခွင့်ပြုမှု မူဝါဒကို လွတ်လပ်စွာတင်သွင်းခြင်း။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Native escrow instruction model at the pinned source-code revision (ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှု)](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/escrow.rs)
- [Native escrow integration tests at the pinned source-code revision (ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှု)](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/native_escrow.rs)
- [Python ပိတ်ထားသော အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုတွင် ဂိုဏ်းဝယ်ယူသူနည်းလမ်းများ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/src/iroha_python/client.py)
- [Kotodama ဒေသခံ escrow နမူနာကို pinned source code ပြင်ဆင်မှု](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/native_escrow.ko)
- [မွေးမြူရင်းနှီးမြှုပ်နှံမှု အာမခံချက်](/my/blockchain/escrow.md)
- [ငွေကြေးအထောက်အပံ့များ](./fungible-assets.md)
- [ခွင့်ပြုချက်များနှင့် ကဏ္ဍများ](./permissions-and-roles.md)
