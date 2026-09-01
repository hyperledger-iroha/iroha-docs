---
translation_locale: mn
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Уугуул хөрөнгийн хадгаламж {#native-asset-escrow}

## Үр дүн {#outcome}

Зах зээл дээрх итгэлцлийн сан ба зорилтот чиглэлийн хөрөнгийн түгжээгийн хооронд сонголт хийх, одоогийн бичсэн амьдралын мөчлөгийг Rust эсвэл Python-тэй гүйцэтгэх, бүх түгжээний дахин оролдлогыг та үнэндээ ажигласан үлдсэн хэмжээнд холбож, JavaScript-аас эх орон нутгийн Kotodama итгэлцлийн гадаргууг бүрдүүлэх.

## Өмнөх шаардлага {#prerequisites}

- Тооцооны хөрөнгийн тодорхойлолт болон хангалттай тоотой эзэмшигч нээлт/борлуулагч.
- Санхүүжүүлсэн, ганц түлхүүртэй I105 үйлчлүүлэгчид алхам илгээсэн бүх намын хувьд. Гүйлгээг гарын үсэг зурсан данс `fee_payment`-аар төлсөн амьд зорилгыг ашигла; түүний төлбөрийн хөрөнгө нь одоогийн Taira тестнет санхүүжүүлэх үйлчилгээний хариутай тохирч байвал сайн; баримт бичгээс хөрөнгийн ID оруулахгүй.
- Одоогийн Rust эсвэл Python SDK нь Iroha протоколын эцсийн хэлэлцээрээс `0010c5a70039eac101a4846499ba9ceaf43eb65c` юм.
- JavaScript компиляторын жишээний хувьд, Node.js 24 ба орон нутгийн хөгжүүлэлтийн орчинд `@iroha/iroha-js` багцыг бүтээж, түүний анхны `iroha_js_host`-ийг ашиглана; [JavaScript SDK эх үүсвэр бүтээх тохиргоо](/mn/guide/tutorials/javascript.md#build-from-source)-ийг дагана уу. Вэб хөтчийн бүтээлүүд нь анхны хостыг ачааллахын оронд `compilerUrl`-ийг өгөх ёстой.
- Taira нь хөрөнгийн шилжүүлэг болон хадгалалтын зааврыг хүлээн зөвшөөрөх ёстой. Хөрөнгийн эзэмшигчид хөрөнгийн бодлогын зөвшөөрөлтэй бол энгийн амьдралын мөчлөгийг ашиглаж болно; шийдвэрлэх маргаан нь дэлхийн `CanResolveEscrowDispute` зөвшөөрлийг шаарддаг. Хэрэв шаардлагатай олон нийтийн блокчэйн сүлжээний эрх олголтын гол нь байхгүй бол үүсгэсэн локал сүлжээг ашиглана уу.

Зах зээлийн хадгаламжийн загвар нь худалдан борлуулагч, худалдан авагч, гадаад хэлбэрийн төлбөр ба чөлөөлөлтийг агуулдаг. Ерөнхий түгжээнүүд нь зориулсан газрыг нэрлэж, шаардлагатай бол ялгаатай чөлөөлөх эрх бүхий эрх мэдлийг зааж өгдөг; үүнийг хэсэгчлэн татах, цуцлах, хугацаа дуусахыг дэмждэг.

## Алхамууд {#steps}

### 1. Rust-тай зах зээлийн төлбөр зуучлалыг дуусгах {#_1-complete-a-marketplace-escrow-with-rust}

Энэхүү функц нь бодит байдлаар оруулсан ID болон үйлчлүүлэгчдийг хүлээн авдаг. Энэ нь 40 нэгжийг нээж, худалдан авагчийг зөвшөөрч, офф-чейн төлбөрийг тэмдэглэх боломж олгож, дараа нь борлуулагчид хариуцлагыг гаргах боломжийг олгодог. Бүх илгээх үед зөвшөөрлийн гол хураамж төлөгчийг `FeePaymentIntent`-ээр нэрлэдэг.

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

Харъяаллын дансыг блокчэйн бүртгэл удирддаг. Энгийн хөрөнгө шилжүүлэх токен олгох нь идэвхтэй харъяаллыг хадгалах хугацааны гадагш урсгах боломжийг олгодоггүй.

### 2. Python-аар ерөнхий түгжээг нээж, хэсэгчлэн зурна уу {#_2-open-and-partially-draw-a-generic-lock-with-python}

Гаргалтын зөвшөөрлийн үндсэн хэрэглэгч татахын өмнө гарын үсэг зурсны төрөлхийн бичлэгийг шалгадаг. Тэр яг `remaining_amount`-г дамжуулснаар итгэл найдвар бүхий зэрэгцээ ажиллагааг хангана: хуучирсан зэрэгцээ хүсэлтийг хоёр удаа хадгаламжнаас хасахын оронд татгалздаг.

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

Python SDK нь `expected_remaining_amount`-ыг орхих үед автоматаар лавлагаа авч болно, гэхдээ ажиглагдсан утгыг дамжуулах нь хэрэглээний кодод гарын үсэг зурагдсан эдийн засгийн урьдчилсан нөхцөлийг ил тод болгодог.

Rust түгжих урсгад зориулсан одоогийн бүтээгчид бас ажиглагдсан хэмжээг шаардана:

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

`DrawdownAssetLock::new` нь гурван утгыг авна; `CancelAssetLock::new` нь хоёр утгыг авна. Хүлээгдэж буй үлдсэн хэмжээг орхих нь хуучин, аюулгүй бус техникийн дуудах хэлбэрийг илэрхийлдэг.

### 3. JavaScript -оос Kotodama арилжааны хөрсийг бүрдүүлэх {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript нь төрөлгүй дотоод заавруудыг зохион бүтээх шаардлагагүй. Одоогийн компилятор блокчейн бүртгэлийн эскроу-д орох үндсэн функцуудыг Kotodama-д нэвтрүүлдэг; байрлуулалт ба техникийн дуудлагууд дараа нь [Ухаалаг гэрээг бүтээж, хэрэгжүүл](./smart-contracts.md)-ыг дагана.

Үүнийг `native_escrow.ko` гэж хадгална уу:

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

Дараахыг `compile-native-escrow.mjs` гэсэн нэрээр хадгалж, үүнийг Node.js -аас яг тэр эх кодыг нийлүүлэхэд ашиглана уу:

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

Үүнийг шаардлагын хэсэгт тайлбарласан эх үүсвэрээс бүтээсэн багц орчиндоо ажиллуулна уу:

```bash
node ./compile-native-escrow.mjs
```

## Баталгаажуулах {#verify}

Зах зээлийн хадгаламжийн хувьд, гарсан хураан авсны дараах `FindAssetEscrowById` болон хоёр талын хөрөнгийн хэмжээний мэдээллийг асуугаарай. Бичлэг нь `Released` байх ёстой, хүлээн авагч худалдан авагчийн нэрийг оруулж, үлдсэн хадгаламж байхгүй байгааг харуулна. Дээрх Python түгжээнд зориулж буцаасан ID-г хадгалж, гарын үсэгтэй асуултыг давтана:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Мөн зорьсон газрын хөрөнгө эзэмшлийг лавлаж, дөрвөн нэгжээр нэмэгдсэн болохыг баталгаажуул. Энскроу бичлэг болон зорьсон газрын дараах төлөвгүй гүйлгээний протоколын үр дүнгийн бичлэг нь дутуу баталгаажуулалт юм.

## Алдааг олох болон засах {#troubleshooting}

- `Not permitted` нээхэд ихэвчлэн эрх олгогч гол субъект сонгосон хөрөнгийг хадгалалтанд шилжүүлж чадахгүй гэсэн үг юм. Маргааныг шийдвэрлэхэд тусдаа дэлхийн `CanResolveEscrowDispute` хаалга байдаг.
- `expected remaining amount` татгалзалт бол оптимист өнөө-усан зэрэгцээ мөргөлдөөн юм. Бичлэгийг дахин асууж, нөгөө татан авалт/цахилгаан цуцлах нь зориуд байсан эсэхийг тодорхойлж, шинэ нөхцөл байдал зөв бол шинэ заавар бичиж гарын үсэг зурна уу.
- Зөвхөн тохируулагдсан гаргах эрх бүхий үндсэн субъект итгэмжлэгдсэн түгжээг тайлж болно. Хүлээн авагч санхүүгийн хөрөнгийг авах гэж байгаа учраас үүнийг гаргаж чадахгүй.
- Маркетплейсийн гаргалт зөвхөн хүлээн зөвшөөрөгдсөн ба төлбөр илгээгдсэн төлөвт байхад хүчинтэй; цуцлалт нь өмнөх амьдралын мөчлөгийн төлөвүүдтэй хязгаарлагдана.
- Дуусах хугацаа нь эрх бүхий блокчэйн бүртгэлийн цагийг ашигладаг. Орон нутгийн системийн цагийн хугацаа дууссан болохыг `ExpireAssetLock` дамжих баталгаа гэж бүү үз.
- Төлбөрийн алдаа нь тухайн амьдралын мөчлөгийн алхмыг илгээж буй талд хамаарна. Санхүүгийн худалдан авагч, худалдаачин/нээгч, болон гаргах эрх олгох гол арга хэмжээ Taira дээр бие даан ажиллана.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Төлөвлөсөн эх кодын өөрчлөлтөд үндэсний баталгаат зааврын модель](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Эх үүсвэрийн кодын тогтоосон хувилбарт нутгийн эскроу интеграцийн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python эскроу клиент аргачлалуудыг тогтсон эх кодын хувилбараас](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama бэхлэгдсэн эх кодын хувилбарт эх нутгийн итгэмжлэгдсэн дээж](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Уугуул хөрөнгийн итгэмжлэл](/mn/blockchain/escrow.md)
- [Ширээний хөрөнгө](./fungible-assets.md)
- [Зөвшөөрөл болон үүрэг](./permissions-and-roles.md)
