---
translation_locale: uz
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Mahalliy aktiv eskrousi {#native-asset-escrow}

## Natija {#outcome}

Bozor eskrousi bilan manzilga bog‘langan aktiv qulfi orasidan tanlang, joriy turlangan hayotiy siklni Rust yoki Python orqali bajaring, qulf bo‘yicha har bir qayta urinishni o‘zingiz kuzatgan qoldiq miqdoriga bog‘lang va mahalliy Kotodama eskrou sathini JavaScript orqali kompilyatsiya qiling.

## Oldindan shartlar {#prerequisites}

- Raqamli aktiv ta’rifi va yetarli miqdorga ega ochuvchi/sotuvchi.
- Har bir bosqichni yuboradigan tomon uchun mablag‘ bilan ta’minlangan, bitta kalitli I105 mijoz. To‘lov aktivi joriy Taira krani javobiga mos keladigan, vakolat hisobi to‘laydigan amaldagi `fee_payment` niyatidan foydalaning; hujjatlardan ko‘chirilgan aktiv identifikatorini kiritmang.
- Iroha’ning `0010c5a70039eac101a4846499ba9ceaf43eb65c` commitidagi joriy Rust yoki Python SDK.
- JavaScript kompilyatori misoli uchun Node.js 24, mahalliy qurilgan `@iroha/iroha-js` paketi va uning mahalliy `iroha_js_host` komponenti; [JavaScript SDK ni manbadan qurish sozlamasi](/uz/guide/tutorials/javascript.md#build-from-source) bo‘yicha ishlang. Brauzer qurilmalari mahalliy xostni yuklash o‘rniga `compilerUrl` berishi kerak.
- Taira aktiv o‘tkazish va eskrou ko‘rsatmalarini qabul qilishi kerak. Aktiv siyosati ruxsat bersa, aktiv egalari oddiy hayotiy sikldan foydalana oladi; nizoni hal qilish uchun global `CanResolveEscrowDispute` ruxsati kerak. Ochiq tarmoqda zarur vakolat bo‘lmasa, yaratilgan mahalliy tarmoqdan foydalaning.

Bozor eskrousi sotuvchi, xaridor, reyestrdan tashqari to‘lov va mablag‘ni chiqarishni modellashtiradi. Umumiy qulflar manzilni ko‘rsatadi va ixtiyoriy ravishda alohida chiqarish vakolatini belgilaydi; ular qisman yechish, bekor qilish va muddat tugashini qo‘llab-quvvatlaydi.

## Qadamlar {#steps}

### 1. Rust bilan bozor eskrousini yakunlash {#_1-complete-a-marketplace-escrow-with-rust}

Bu funksiya haqiqiy turlangan identifikatorlar va mijozlarni oladi. U 40 birlik uchun eskrou ochadi, xaridorga uni qabul qilish va reyestrdan tashqari to‘lov yuborilganini belgilash imkonini beradi, so‘ng sotuvchi saqlovdagi mablag‘ni chiqaradi. Har bir yuborish `FeePaymentIntent` orqali vakolat hisobini to‘lovchi sifatida ko‘rsatadi.

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

Saqlov hisobini reyestr boshqaradi. Oddiy aktiv o‘tkazish tokenini berish faol saqlovdan eskrou hayotiy sikli tashqarisida mablag‘ yechish imkonini bermaydi.

### 2. Python bilan umumiy qulfni ochish va qisman yechish {#_2-open-and-partially-draw-a-generic-lock-with-python}

Chiqarish vakolati mablag‘ni yechishdan oldin imzolangan mahalliy yozuvni so‘raydi. Aynan shu `remaining_amount` ni uzatish optimistik parallel bajarishni ta’minlaydi: eskirgan parallel so‘rov saqlovdan ikki marta yechish o‘rniga rad etiladi.

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

`expected_remaining_amount` berilmasa, Python SDK uni avtomatik so‘rashi mumkin; ammo kuzatilgan qiymatni uzatish imzolangan iqtisodiy shartni ilova kodida yaqqol ko‘rsatadi.

Rust qulf oqimlarida ham joriy konstruktorlar kuzatilgan miqdorni talab qiladi:

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

`DrawdownAssetLock::new` uchta qiymat, `CancelAssetLock::new` esa ikkita qiymat oladi. Kutilayotgan qoldiq miqdorini bermaslik eski va xavfsiz bo‘lmagan chaqiruv shaklini anglatadi.

### 3. Kotodama eskrou sathini JavaScript orqali kompilyatsiya qilish {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript turlanmagan mahalliy ko‘rsatmalarni o‘zi tuzishi shart emas. Joriy kompilyator reyestr eskrousining ichki funksiyalarini Kotodama’ga taqdim etadi; joylashtirish va chaqiruvlar esa [Aqlli shartnomani yaratish va joylashtirish](./smart-contracts.md) bo‘yicha bajariladi.

Buni `native_escrow.ko` sifatida saqlang:

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

Quyidagini `compile-native-escrow.mjs` nomi bilan saqlang va aynan shu manbani Node.js orqali kompilyatsiya qilish uchun ishlating:

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

Uni oldindan shartlarda ta’riflangan, manbadan qurilgan paket muhitida ishga tushiring:

```bash
node ./compile-native-escrow.mjs
```

## Tekshirish {#verify}

Bozor eskrousi uchun chiqarishdan keyin `FindAssetEscrowById` va ikkala tomonning aktiv qoldiqlarini so‘rang. Yozuv `Released` bo‘lishi, qabul qilgan xaridorni ko‘rsatishi va saqlovda qoldiq yo‘qligini bildirishi kerak. Yuqoridagi Python qulfi uchun qaytarilgan identifikatorni saqlang va imzolangan so‘rovni takrorlang:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Manzildagi aktiv qoldig‘ini ham so‘rang va u to‘rt birlikka oshganini tasdiqlang. Eskrou yozuvi va manzilning amaldan keyingi holatisiz tranzaksiya kvitansiyasi to‘liq tekshiruv emas.

## Muammolarni bartaraf etish {#troubleshooting}

- Ochish paytidagi `Not permitted` odatda vakolat hisobi tanlangan aktivni saqlovga o‘tkaza olmasligini anglatadi. Nizoni hal qilish alohida global `CanResolveEscrowDispute` ruxsati bilan himoyalangan.
- `expected remaining amount` rad etilishi optimistik parallel bajarish ziddiyatidir. Yozuvni qayta so‘rang, boshqa yechish yoki bekor qilish mo‘ljallanganligini aniqlang va yangi holat maqbul bo‘lsagina yangi ko‘rsatmani imzolang.
- Ishonchli qulfdan faqat sozlangan chiqarish vakolati mablag‘ yecha oladi. Manzil mablag‘ni olishi uning qulfni chiqarishiga vakolat bermaydi.
- Bozor eskrousidagi chiqarish faqat qabul qilish va to‘lov yuborilgan holatidan keyin yaroqli; bekor qilish oldingi hayotiy sikl holatlari bilan cheklanadi.
- Muddat tugashi reyestrning ishonchli vaqtiga asoslanadi. Mahalliy tizim soatidagi taymautni `ExpireAssetLock` o‘tishining isboti deb qabul qilmang.
- To‘lov xatosi o‘sha hayotiy sikl bosqichini yuborayotgan tomonga tegishli. Taira’da xaridor, sotuvchi/ochuvchi va chiqarish vakolatini alohida-alohida mablag‘ bilan ta’minlang.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi mahalliy eskrou ko‘rsatmalari modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Mahkamlangan commitdagi mahalliy eskrou integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Mahkamlangan commitdagi Python eskrou mijoz usullari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Mahkamlangan commitdagi Kotodama mahalliy eskrou namunasi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Mahalliy aktiv eskrousi](/uz/blockchain/escrow.md)
- [Almashtiriladigan aktivlar](./fungible-assets.md)
- [Ruxsatlar va rollar](./permissions-and-roles.md)
