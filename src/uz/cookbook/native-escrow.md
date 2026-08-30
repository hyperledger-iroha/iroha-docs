---
translation_locale: uz
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Native Asset Escrow {#native-asset-escrow}

## Natija {#outcome}

Bozordagi depozit va manzilga bog'liq aktivni qulflash o'rtasida tanlang, Rust yoki Python bilan joriy yozib olingan hayot davomini bajaring, har bir qulfning qayta urinishini siz amalda kuzatgan qolgan miqdorga bog'lang va JavaScript dan asl Kotodama depozit yuzasini yig'ing.

## Oldindan talablar {#prerequisites}

- Raqamli aktiv ta'rifi va etarli miqdorda egalik qiluvchi ochuvchi/sotuvchi.
- Har bir qadamni taqdim etadigan tomon uchun moliyalashtirilgan, bitta kalitli I105 mijozlardan foydalaning. To'lov aktivlari joriy Taira kran javoblariga mos bo'lgan jonli hokimiyat tomonidan to'lanadigan `fee_payment` niyatidan foydalaning; hujjatlardan ID aktivini o'rnatmang.
- Rust yoki Python SDK sohasi Iroha bilan bog'liq bo'lgan majburiyat `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- O ' zbekiston Respublikasining JavaScript yig'uvchi namuna, Node.js 24 va mahalliy ishlab chiqarilgan `@iroha/iroha-js` to'plam va uning natijasi `iroha_js_host`; qoʻllash [JavaScript SDK manba konstruksiyalarini o'rnatish](/uz/guide/tutorials/javascript.md#build-from-source). Brauzerni yaratish uchun `compilerUrl` o'rniga mahalliy uy egasini yuklab olish.
- Taira aktivlarni o'tkazish va depozit qo'yish yo'l-yo'riqlarini qabul qilishi kerak. Asset egalari oddiy hayot davridan foydalanishi mumkin, agar ularning aktiv siyosati bunga ruxsat beradi; nizolarni hal qilish uchun global `CanResolveEscrowDispute` ruxsati talab etiladi. Kerakli ommaviy tarmoq hokimiyati mavjud bo'lmaganida hosil qilingan mahalliy tarmoqdan foydalanish.

Marketplace escrow modellari sotuvchi, xaridor, zaryaddan tashqarida to'lov va chiqarilgan. Ochiq qulflar manzilni va tanlov bo'yicha alohida chiqarilish vakolatini nomlaydi; ular qisman tortib olish, bekor qilish va muddati tugagani qo'llab-quvvatlaydi.

## qadamlar {#steps}

### 1. Rust bilan bozor depozitini to'ldiring. {#_1-complete-a-marketplace-escrow-with-rust}

Ushbu funktsiya haqiqiy IDs va mijozlarni qabul qiladi. U 40 birlikni ochadi, xaridorga zanjirdan tashqari to'lovni qabul qilish va belgilash imkonini beradi, so'ngra sotuvchiga vasiyatxonani ozod qilishga imkon beradi. Har bir taqdimnoma `FeePaymentIntent` orqali hokimiyat to'lovi to'lovchi nomi bilan nomlanadi.

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

Himoya hisobi katta kitob tomonidan boshqariladi. Oddiy aktivni o'tkazish belgisini berish aktsiyalarning hayot davri tashqarisida faol ehtiyotxonalarni tozalash imkonini bermaydi.

### 2. Python bilan umumiy qulfni oching va qisman chizing. {#_2-open-and-partially-draw-a-generic-lock-with-python}

Bo'shatish organi imzolangan tug'ma hujjatni olib tashlashdan oldin so'raydi. To'g'ri `remaining_amount` o'tkazib yuborish optimizmli bir vaqtning o'zidalikni ta'minlaydi: qaramog'ini ikki marta debitatsiya qilishning o'rniga, eski parallel talab rad qilinadi.

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

Python SDK `expected_remaining_amount` qoldirilganda avtomatik ravishda so'rov berishi mumkin, ammo kuzatilgan qiymatni o'tkazib yuborish imzolangan iqtisodiy oldindan ko'rinadigan shartni ariza kodida ko'rish uchun imkon beradi.

Rust qulf oqimlari uchun joriy konstruktorlar, shuningdek, kuzatilgan miqdorni talab qiladi:

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

`DrawdownAssetLock::new` uchta qiymatni oladi; `CancelAssetLock::new` ikkitani oladi. kutilayotgan qolgan miqdorni chiqarib tashlash eski, xavfsiz bo'lmagan qo'ng'iroq shaklini tasvirlaydi.

### 3. Kotodama depozit yuzasini JavaScript dan yig'ish. {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript untyped nativ ko'rsatmalarni ixtiro qilish shart emas. Hozirgi kompilatorda katta qog'oz eshrovi o'rnatilgan Kotodama; ishga tushirish va qo'ng'iroqlar keyinchalik [Build va smart kontraktni ishga tushirish](./smart-contracts.md) .

Buni `native_escrow.ko` deb saqlang:

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

Quyidagilarni `compile-native-escrow.mjs` sifatida saqlash va ushbu aniq manbani Node.js dan to'plash uchun ishlatish:

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

Uni dastlabki shartlarda tavsiflangan manbaga moslashtirilgan paket muhitidan ishga tushiring:

```bash
node ./compile-native-escrow.mjs
```

## Tekshirish {#verify}

Bozor joyidagi depozit uchun `FindAssetEscrowById` va ikkala tomonning ham aktivlarini chiqarilgandan keyin so'rang. Hisobot `Released` bo'lishi kerak, qabul qiluvchi sotib oluvchining nomi ko'rsatiladi va qolmagani ko'rsatilmaydi. Yuqorida keltirilgan Python qulfining uchun qaytarib berilgan ID ni saqlang va imzolangan so'rovni takrorlang:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Shuningdek, manzilning aktivlari saqlanishini so'rang va ular to'rt nafarga oshganligini tasdiqlang. Garov qaydnomasi va yo'nalish bo'yicha poststatsiz tranzaksiya tasdig'i to'liq tekshirilmagan.

## Muammolarni hal qilish {#troubleshooting}

- `Not permitted` ochilganda odatda bu organ tanlangan aktivni nazoratga olishi mumkin emasligini anglatadi. nizolarni hal etish uchun alohida global `CanResolveEscrowDispute` darvozasi mavjud.
- `expected remaining amount` rad etish - bu optimist-tashkilot ziddiyati. Hisobotni qayta so'rang, boshqa to'lov/to'xtatish rejalashtirilganmi yoki yo'qligini hal qiling va faqat yangi holat qabul qilinishi mumkin bo'lganda yangi ko'rsatma imzolang.
- Faqatgina konfiguratsiyalangan ruxsat berish hokimiyati ishonchli qulf chizishi mumkin. Yo'nalish faqat pulni olishi uchun uni ozod qilish mumkin emas.
- Bozorda chiqarilish faqat qabul qilish va to'lovni jo'natish holatidan so'ng haqiqiy bo'ladi; bekor qilish avvalgi hayot davomiyligi holatlariga cheklanadi.
- Vaqt o'tishi (expiry) sahifa hisobida vaqtni ishlatadi. `ExpireAssetLock` o'tishini tasdiqlovchi dalil sifatida mahalliy devor soati vaqtini ko'rsatmang.
- To'lov bo'lmaganligi ushbu hayot davri bosqichini taqdim etgan tomonga tegishli. Jamg'arma sotib oluvchi, sotuvchi / ochuvchi va Taira da mustaqil ravishda ozod qilish vakolatlari.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Native escrow yo'l-yo'riq modeli ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs) biriktirilgan commitda
- [Native escrow integratsiyasi testlari ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs) to'xtatilgan majburiyatda
- [Python garovga ega bo'lgan mijozlarning to'g'ri yo'l-yo'riqlari qo'yilgan majburiyatlarda](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama tug'ma depozit namunasini qo'lga kiritilgan majburiyatlarda](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Asosiy aktivlar garovi](/uz/blockchain/escrow.md)
- [O'zgaruvchan aktivlar](./fungible-assets.md)
- [Ruxsatlar va vazifalar ](./permissions-and-roles.md)
