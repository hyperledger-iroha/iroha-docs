---
translation_locale: mn
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Тухайн хөрөнгийн хяналт тавих {#native-asset-escrow}

## Үр дүн {#outcome}

Хөрөнгийн зах зээлийн хадгаламж болон зориулалттай хөрөнгийн буудлын хооронд сонгох, өнөөгийн хэвлэгдсэн амьдралын мөрийг Rust эсвэл Python-ээр гүйцэтгэх, бүх буудалд дахин оролдож байгаа үлдсэн хэмжээг нь та ажигласантай холбох, мөн эх үүсвэрийн Kotodama хадгаламжийн давхаргыг JavaScript-ээс цуглуулж болно.

## Урьдчилсан шаардлага {#prerequisites}

- Санхүүгийн хөрөнгийн тодорхойлолт болон хангалттай хэмжээтэй нээгч / борлуулагч.
- Санхүүжилттэй, нэг гол I105 үйлчлүүлэгчид нь алхам хүргүүлсэн аливаа оролцогчдад зориулалттай байдаг. Төрийн байгууллага төлсөн амьд `fee_payment` санаачлал ашиглаж, төлбөрийн актив нь өнөөгийн Taira крантын хариутай нийцдэг; баримтаас ID хөрөнгийг бүрдүүлж болохгүй.
- Цахилгаан Rust эсвэл Python SDK цаашид Iroha үүрэг гүйцэтгэх `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- Үндсэн хуулийн JavaScript хувилбарч жишээ, Node.js 24 болон орон нутгийн үйлдвэрлэл `@iroha/iroha-js` багц, түүний эх үүсвэр `iroha_js_host`; дараа нь [JavaScript SDK эх үүсвэрийн бүтээн байгуулалтын систем](/mn/guide/tutorials/javascript.md#build-from-source). Бrowser-ийн бүтэцүүд нь `compilerUrl` Нүүдэлчнийг ачаалахын оронд.
- Taira нь хөрөнгийн шилжүүлэн суулгах болон хадгаламжлах чиглэлийг хүлээн зөвшөөрөх ёстой. хөрөнгийн эзэмшигчид өөрийн хөрөнгө бодлого нь зөвшөөрсөн тохиолдолд хэвийн амьдралын мөрийг ашиглах боломжтой; маргааныг шийдвэрлэхэд дэлхийн `CanResolveEscrowDispute` зөвшөөрөл шаардагдана. шаардлагатай олон нийтийн сүлжээний эрх баригч байхгүй үед үүсгэсэн орон нутгийн сүлжээг ашиглах.

Хөрөнгийн зах зээлийн хадгаламжийн загварын борлуулагч, худалдан авагч, гадаад төлбөрийн сүлжээ болон чөлөөлөгч. Женерикийн буудалд зориулалттай газар, сонголттой нь өөрчилсөн нэвтрүүлэг нэрлэгддэг эрх мэдэл; тэд хэсэгчлэн татан буулгах, цуцлах, хугацаа дуусахыг дэмжиж байна.

## Хадгалт {#steps}

### 1. Rust-ээр зах зээлийн хяналтын төлбөрийг гүйцэтгэнэ {#_1-complete-a-marketplace-escrow-with-rust}

Энэ функц нь жинхэнэ түрүүлсэн хүлээн авна IDs 40 нэгжийг нээж, худалдан авагчдаа зах зээлийн төлбөрийг хүлээн авч тэмдэглэх боломжтой. Дараа нь худалдан авагч хяналтын ажиллагааг чөлөөлнө. `FeePaymentIntent`.

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

Ашигт малтмалын хадгаламжийн данс нь номын сангаас удирдаж байдаг. Байгууллагын шилжүүлэн суулгах хэвийн токен олгох нь активт хадгаламжийг даатгуулалтын амьдралын мөрийн гадна ашиглах боломжгүй болгодоггүй.

### 2. Python-ийн хэрэгсэлээр нийтлэг замбарыг нээж, хэсгээр нь тавих. {#_2-open-and-partially-draw-a-generic-lock-with-python}

Хяналтын байгууллагаас гарын үсэг зурсан эх сурвалж бичгийг гаргахаас өмнө асууна. Тухайн `remaining_amount` хэмжээнд дамжих нь эерэг зэрэглэлийг бүрдүүлж байна: a Үргэлжсэн тэнцвэрт хүсэлтийг хоёр удаа хадгаламжийг төлөхөөс өөрөөр нь татгалзах болно.

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

Python SDK нь `expected_remaining_amount` гараагүй байх үедээ автоматтан асууж болно, гэхдээ ажиглагдсан үнэ цэнийг өнгөрүүлснээр гарын үсэг зурсан эдийн засгийн урьдчилсан нөхцөлийг өргөдлийн кодт илрүүлэх болно.

Rust гулгалтын урсгалын хувьд одоогийн бүтээн байгуулагчид мөн ажиглагдаж буй хэмжээг шаарддаг:

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

`DrawdownAssetLock::new` нь гурван үнэт зүйл, `CancelAssetLock::new` нь хоёр үнэт зүйл авдаг. хүлээсэн үлдсэн хэмжээг гаргах нь хуучин, аюулгүй бус дуудлагын хэлбэрийг тодорхойлдог.

### 3. Kotodama-ийн хадгаламжийн давхаргыг JavaScript-ээс бүрдүүлэх. {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript нь төрөлгүй үндсэн заавар суулгах шаардлагагүй юм. Одоогийн компилятор нь номын сэлбэгт хадгаламж барьсан Kotodama-д нэвтрүүлнэ; нэвтрүүлэх болон дуудлага дараа нь [Ухаалаг гэрээг байгуулж, нэвтрүүлж байна](./smart-contracts.md).

Энэ нь `native_escrow.ko` гэж хадгалах:

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

Дараах мэдээллийг `compile-native-escrow.mjs` гэж хадгалж, Node.js-аас яг энэ эх үүсвэрийг цуглуулахын тулд ашигла:

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

Хэрэглэлийг эх үүсвэрийн бүрэлдэхүүнд зориулсан багцын орчинд нь ашиглаж байна:

```bash
node ./compile-native-escrow.mjs
```

## Бүртгэнэ {#verify}

Зах зээл дээр хадгаламжтай байхын тулд хайлт `FindAssetEscrowById` болон хоёр талын хөрөнгийн хадгаламж нь чөлөөлөгдсөн дараа байх ёстой. `Released`, Худалдан авагчын нэрийг өгөөч, үлдсэн хадгаламжгүй байна. Python Үүнээс дээш замбараагүй, эргүүлэн ирсэн ID ба гарын үсэг зурсан асуултыг давтаарай:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Мөн зориулалтын газрын хөрөнгийн эзэмшилтээс асууж, энэ нь дөрвөн нэгжээр нэмэгдсэн гэдгийг баталгаажуул. Хөдөлмөрийн хүлээн зөвшөөрөгдлийг хадгаламжийн бүртгэлгүй, нээлтний дараах байдлын мэдүүлэггүй нь бүрэн баталгаажуулах боломжгүй юм.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- `Not permitted` нээлттэй байх нь ерөнхийдөө байгууллага сонгогдсон хөрөнгийг хяналт тавих боломжгүй гэсэн үг юм. Гэрээний шийдвэрлэлтийн үйл ажиллагаа нь дэлхийн `CanResolveEscrowDispute` Дарга.
- `expected remaining amount` эсэргүүцэл нь таамаглалтай, өрсөлдөөнтэй зөрчил юм. Тодруулгыг дахин асууж, бусад цуцалт / цуцалт хийхээр төлөвлөсөн эсэхийг шийдэж, шинэ дүрмийг зөвхөн шинэ байдал хүлээн зөвшөөрөгдсөн тохиолдолд гарын үсэг зураарай.
- Зөвхөн тохируулсан чөлөөлөх эрх мэдэл нь найдвартай хаалгыг гаргах боломжтой. Зохион байгууламж нь мөнгийг хүлээн авахын тулд зүгээр л чөлөөлөхгүй.
- Хөрөнгийн зах зээл дээр гаргах нь хүлээн зөвшөөрөгдсөн болон төлбөрийг илгээсэн дараа л хүчин төгөлдөр байдаг; цуцлах нь өмнөх амьдралын мөрийн нөхцөлд хязгаарлагдана.
- Урьд шийдэгдэх нь `ExpireAssetLock` өнгөрөх эсэхийг баталгаажуулахын тулд орон нутгийн хошууны цагийн цаг хугацааг хэрэглэдэг.
- Төсвийн алдагдал нь тухайн амьдралын эргэлтийн алхамг өргөн мэдүүлсэн этгээдэд хамаарна. Сангийн худалдан авагч, борлуулагч/ашиглагч болон Taira дээр бие даан чөлөөлөх эрх бүхий байгууллага.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Үндэсний хадгаламжийн зааварчилгааны загварын ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs) тавигдсан үүрэг гүйцэтгэгч
- [Үндэсний хадгаламжийн интеграцийн шинжилгээ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs) байгуулсан үүрэг гүйцэтгэгч
- [Python хадгаламжтай үйлчлүүлэгчдийн үйл ажиллагааны арга барилга](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama дотоод захиаллын үлгэр жишээ нь тавигдсан үүрэг гүйцэтгэгч](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Үндэсний хөрөнгийн хадгаламж ](/mn/blockchain/escrow.md)
- [Ашигт малтмалын хөрөнгө](./fungible-assets.md)
- [Тусгай зөвшөөрөл, үүрэг ](./permissions-and-roles.md)
