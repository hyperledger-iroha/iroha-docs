---
translation_locale: hy
translation_source: /cookbook/native-escrow.md
translation_source_hash: d399284a2baec507e4c979c762d6e216d8c3fbc5b4b4fe221b6bbb0049ee9fd9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Բնական ակտիվների վարկավճարը {#native-asset-escrow}

## Արդյունքը {#outcome}

Ընտրեք շուկայական պահպանակի եւ նպատակային կապակցված ակտիվների փակման միջեւ, գործարկեք ընթացիկ տիպավորված կյանքի ցիկլը Rust կամ Python, միացրեք յուրաքանչյուր փակման փորձը այն մնացած գումարի վրա, որը իրականում նկատել եք, եւ կազմեք բնօրինակ Kotodama պահպանակային մակերեսը JavaScript:

## Նախադրյալներ {#prerequisites}

- Թվային ակտիվի սահմանում եւ բացող/վաճառող, որը ունի բավարար քանակություն:
- Ֆինանսավորված, մեկ բանալիով I105 հաճախորդներ յուրաքանչյուր կողմի համար, որը ներկայացնում է քայլ։ Օգտագործեք լիազոր հաշվի կողմից վճարվող ընթացիկ `fee_payment` մտադրություն, որի վճարային ակտիվը համընկնում է Taira-ի faucet-ի ընթացիկ քաղաքականության հրապարակած ակտիվի հետ; մի՛ ներդրեք փաստաթղթերից վերցված ակտիվի ID։
- Ներկայումս Rust կամ Python SDK _ ից Iroha commit `c8c872461e92f04325c350cdd952f4276e96f9dc`.
- JavaScript կոմպիլերային օրինակի համար, Node.js 24 գումարած տեղական կառուցված `@iroha/iroha-js` փաթեթ եւ դրա ներկառուցված `iroha_js_host`; հետեւեք [JavaScript SDK աղբյուրի շինարարության կարգավորմանը](/hy/guide/tutorials/javascript.md#build-from-source): Բրաուզերի շինարարությունները պետք է ապահովեն `compilerUrl` ՝ փոխարենը ներբեռնելու ներկառուցված հոստը:
- Taira-ը պետք է ընդունի ակտիվների փոխանցման եւ գրավման հրահանգները: Գույքի սեփականատերերը կարող են օգտագործել սովորական կյանքի ցիկլը, երբ իրենց ակտիվային քաղաքականությունը դա թույլ է տալիս; վեճի լուծումը պահանջում է գլոբալ `CanResolveEscrowDispute` թույլտվություն: Օգտագործեք ստեղծված տեղական ցանց, երբ բացակայել է անհրաժեշտ հանրային ցանցի լիազոր հաշիվը:

Շուկայի պահպանակային մոդելներ վաճառող, գնորդ, վճարման եւ թողարկումից դուրս: Գնացական բանալիները անվանում են նպատակակետ եւ ընտրանքային տարբերակի թողարկման լիազոր հաշիվ. նրանք աջակցում են մասնակի հանմանը, չեղյալ հայտարարմանը եւ ժամկետի ավարտին:

## Քայլեր {#steps}

### 1. Rust-ով լրացրեք շուկայական պահպանումը: {#_1-complete-a-marketplace-escrow-with-rust}

Այս ֆունկցիան ստանում է իրական տիպված IDs եւ հաճախորդներ: Այն բացում է 40 միավոր, թույլ է տալիս գնորդին ընդունել եւ նշել վճարումը դուրս շղթայից, ապա թույլ է տալիս վաճառողին ազատել պահպանումը: Յուրաքանչյուր ներկայացում անվանում է լիազոր հաշվի վճարման վճարողի միջոցով `FeePaymentIntent`.

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

Պահպանման հաշիվը կառավարվում է գլխավոր գրքում: Գործիքների փոխանցման սովորական տոքեր տրամադրելը ակտիվ պահպանումը չի դարձնում սպորտային կյանքի ցիկլից դուրս:

### 2. Բացեք եւ մասամբ նկարեք Python-ով ընդհանուր փակումը: {#_2-open-and-partially-draw-a-generic-lock-with-python}

Ազատման լիազոր հաշիվը մինչև դուրսբերումը հարցումով կարդում է ստորագրված բնիկ գրառումը։ Հենց այդ `remaining_amount`-ի փոխանցումն ապահովում է լավատեսական զուգահեռություն: հնացած զուգահեռ հայտը մերժվում է՝ պահառության միջոցները երկու անգամ դուրս գրելու փոխարեն։ `client`-ը `ToriiClient` է, որը ստեղծված է `local_signing_context=LocalSigningContext(network_id)`-ով և ցանցի `chain_discriminant`-ով; գործարքների օգնականները ցանցի նույնականությունը վերցնում են այդ համատեքստից, իսկ ստորագրված հարցումները՝ որպես `network_id`։

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

Գլխավոր էջ Python SDK կարող է ավտոմատ կերպով հարցում կատարել, երբ `expected_remaining_amount` բաց թողնվում է, սակայն դիտարկված արժեքը անցնելով՝ ստորագրված տնտեսական նախադրյալը տեսանելի է դառնում դիմման կոդում:

Rust փակման հոսքերի համար ընթացիկ շինարարները պահանջում են նաեւ դիտարկված քանակը.

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

`DrawdownAssetLock::new`-ն ընդունում է արգելափակումը, գումարը և դիտարկված մնացորդային գումարը; `CancelAssetLock::new`-ն ընդունում է արգելափակումը և դիտարկված մնացորդային գումարը։ Ռեեստրը մերժում է այս հրահանգներից ցանկացածը, եթե մնացորդային գումարը մինչ այդ փոխվել է։

### 3. Kotodama գրավման մակերեսը կազմեք JavaScript-ից: {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript-ին պետք չէ հորինել անտիպ բնիկ հրահանգներ։ Ընթացիկ կոմպիլյատորը Kotodama-ին տրամադրում է ռեեստրի էսքրոուի ներկառուցված ֆունկցիաները; տեղակայումն այնուհետև հետևում է [Խելացի պայմանագրի կառուցում և տեղակայում](./smart-contracts.md) էջին։ `open_offer` մուտքի կետը `authorize(Admin)` է, ուստի կատարողը պահանջում է, որ այն կանչողն ունենա `CanUseContractPermission` տեղակայված հասցեի և `permission: "Admin"`-ի համար։

Պահպանեք հետեւյալը՝ `native_escrow.ko`:

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

Պահպանեք հետեւյալը որպես `compile-native-escrow.mjs` եւ օգտագործեք այն, որպեսզի կազմեք ճիշտ աղբյուրը Node.js-ից:

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

Գործարկեք այն աղբյուրի վրա կառուցված փաթեթավորման միջավայրից, որը նկարագրված է նախապայմաններում.

```bash
node ./compile-native-escrow.mjs
```

## Փորձարկել {#verify}

Պաշտոնական պահպանումների համար կատարեք հարցում `FindAssetEscrowById` եւ երկու կողմերի ակտիվները թողարկվելուց հետո: Գրանցումը պետք է լինի `Released`, նշեք ընդունող գնորդի անունը եւ ցույց տվեք, որ մնացած պահպանումը չկա: Վերեւում գտնվող Python կոճակի համար պահպանեք վերադարձված ID եւ կրկնել ստորագրված հարցումը.

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

Բացի այդ, կատարեք հարցում նպատակակետի ակտիվների պահպանումը եւ հաստատեք, որ այն ավելացել է չորս միավորով: Գործարքի ստուգումը առանց գրառման արձանագրության եւ նպատակակետային հետագա վիճակի լիարժեք չէ ստուգում.

## Խնդիրների լուծում {#troubleshooting}

- `Not permitted` բացման ընթացքում սովորաբար նշանակում է, որ լիազոր հաշիվը չի կարող ընտրված ակտիվը տեղափոխել պահպանում: վեճերի լուծումը ունի առանձին գլոբալ `CanResolveEscrowDispute` մուտք:
- `asset lock remaining amount changed since the drawdown was prepared` (կամ `...since the cancellation was prepared`) սխալը լավատեսական զուգահեռության կոնֆլիկտ է։ Կրկին հարցումով կարդացեք գրառումը, որոշեք՝ արդյոք մյուս դուրսբերումը/չեղարկումը նախատեսված էր, և նոր հրահանգ ստորագրեք միայն այն դեպքում, եթե նոր վիճակն ընդունելի է։
- Միայն կարգավորված ազատագրման լիազոր հաշիվը կարող է հանել վստահելի բանալին: Կայքը չի կարող ազատագրել այն միայն այն պատճառով, որ նա կստանա միջոցները:
- Շուկայում թողարկումը վավեր է միայն ընդունման եւ վճարման ուղարկված վիճակի հետո, չեղյալ հայտարարությունը սահմանափակվում է նախորդ կյանքի ցիկլային վիճակների հետ:
- Գործադրանքի ավարտը օգտագործում է հեղինակավոր գրառման ժամանակը: Մի վերաբերվեք տեղական պատային ժամացույցի ժամանակահատվածին որպես ապացույց, որ `ExpireAssetLock` կանցնի:
- Հաշվարկի ձախողումը պատկանում է այն կողմին, որը ներկայացրել է այդ կենսամյակային փուլը: Հիմնադրամի գնորդը, վաճառողը / բացողը եւ ազատագրման իրավունքը անկախ են Taira:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Սահմանված commit վրա ստուգման ներկառուցված մոդելը ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/escrow.rs)
- [Native escrow ինտեգրման փորձարկումները փակված commit վրա](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/native_escrow.rs)
- [Python գրավյալ հաճախորդի մեթոդները փակված commit վրա](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/src/iroha_python/client.py)
- [Kotodama ներքին պահապանների նմուշը փակված commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Բնային ակտիվների պահպանում](/hy/blockchain/escrow.md)
- [Գործունակ ակտիվներ](./fungible-assets.md)
- [թույլտվություններ եւ դերակատարություններ](./permissions-and-roles.md)
