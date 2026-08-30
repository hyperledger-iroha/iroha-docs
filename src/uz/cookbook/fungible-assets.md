---
translation_locale: uz
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# O'zgaruvchan aktivlar {#fungible-assets}

## Natija {#outcome}

Toʻgʻri tekshirib koʻring Taira aktivlarning ta'riflari va ro'yxatni to'ldirish, mint, o'tkazish, yoqish va balans tekshiruvi generated lokal tarmoqda oqim. retsept kanonik prefikssiz Base58 aktiv ta'rifidan foydalanadi IDs, domensiz nomlar, domensiz I105 hisob IDs, va to'lovni to'lash.

## Oldingi shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyin, Node.js 24, va joriy `iroha` CLI.
- Faqat o'qish uchun Taira kirish.
- Yozib o'tish uchun [Lunch Iroha](/uz/get-started/launch-iroha.md) orqali yaratilgan mahalliy tarmoq, `./localnet/client.toml` va Torii bilan `http://127.0.0.1:8080`da.

## qadamlar {#steps}

### 1. Taira ta'riflarini imzolamaydigan holda tekshirish {#_1-inspect-taira-definitions-without-a-signer}

Asset ta'riflari shaffof bo'lmagan Base58 ID, ko'rsatuv nomiga ega; mintaqaviylik siyosati, raqamli ko'rsatkichlar, tanlov aliaslari, egasi va umumiy miqdor. Konkret balansda shuningdek uning egasi hisob raqami va ma'lumotlar maydonining ko'rsatkichlari ham mavjud.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

JavaScript shaklini `node taira-assets.mjs` bilan ishga tushiring. Umumiy aktivlar IDs to'liq Base58 qiymatlari; `cookbook_credit#wonderland.universal` kabi o'qiladigan qiymat ushbu qiymatlardan biriga tegishli bo'lgan alias hisoblanadi IDs .

### 2. Mahalliy hokimiyat va yo'nalishlarni tayyorlash {#_2-prepare-the-local-authority-and-destination}

Mahalliy hokimiyatni yaratilgan konfigdagi jamoatchilik kalitidan olib tashlang va boshqa ro'yxatdan o'tgan hisobni qabul qiluvchi sifatida tanlang.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Raqamli ma'lumotni qayd qiling {#_3-register-a-numeric-definition}

Bu faqat mahalliy ID o'rnatilmagan haqiqiy Base58 aktiv ta'rif manzili hisoblanadi. `domain.dataspace` ko'rsatkichlar `2` ikki qismli raqamlarga ruxsat beradi; `--mint-once` defaultni saqlaydi `Infinitely` siyosat.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

ID-ni Taira da qayta ishlatmang. Jamoat tarmog'ida ro'yxatdan o'tish uchun yangi kanonik ID, sizning arizangizga ajratilgan domen/alias, to'lov mablag'lari va ish vaqti aktivlarni ro'yxatga olish ruxsatnomasi talab etiladi.

### 4. Mint, o'tkazish va yoqish {#_4-mint-transfer-and-burn}

Barcha yozish buyruqlari vakolatli organni to'lov to'lovchi sifatida aniq tanlaydi. CLI imzolashdan oldin aniq operatsiyani ko'rsatadi va default bo'yicha kutadi.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Yonilgandan so'ng, manba balansini `64.50`, belgilangan balansni `25.50` va umumiy miqdorni `90.00` kuting.

::: warning Ruxsatlar chegaralari

Taira da krandan olingan `taira.tx-metadata.json` ni qo'shing va har bir yozish uchun `--fee-payer authority` dan foydalaning. Ro'yxatga olish va qalinlashtirish faol tasdiqlovchining ruxsatlarini talab qiladi; o'tkazish va yoqish manba balansini boshqarish huquqiga ega bo'lishi kerak.

:::

## Tekshirish {#verify}

Ikkala aniq balansni o'qing va keyin ma'lumotni o'qing. Ushbu davlatdan keyingi so'rovlar muvaffaqiyat mezonidir; taqdimot rasmining o'zi bunday emas.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Qo'llanmalarning ta'kidlashicha, raqamli qiymatlarni qat'iy nuqtalik o'nlar sifatida solishtirish kerak va ikkilamchi ko'chma nuqta qiymatlari emas, balki ID tanlovi hamda hisobni tekshirish kerak.

## Muammolarni hal qilish {#troubleshooting}

- O ' zbekiston Respublikasi ID tarkibida `#` bir alias yoki aniq balans literal, kanonik aktiv ta'rif emas ID. Base58 qiymatidan foydalaning `--definition`, yoki bogʻlangan alias bilan `--definition-alias`.
- `Scale` xatolar: miqdorning tanlovi ruxsat etganidan ko'ra ko'proq qismli raqamlari bor.
- `Mintability` rad etish - bu `Once`, `Not` yoki `Limited(n)` siyosatining sozlash muddati tugagan yoki ruxsat etilmaganligini anglatadi. Tarixni qayta yozma; tanlov so'rovida qaytarilgan siyosatni ishlating.
- 2-bosqich tasodifiy qayd etilgan maqsadli hisobni tanlaydi. Agar aktiv qabul qilinishi `ExplicitOnly` bo'lsa, maqsadli qoldiqni ruxsatnoma orqali ajrating o'tkazishdan oldin oqim. Shunga o'xshash nom bilan CLI qo'riqchi hisobvaraq yoki balansni ro'yxatga olmaydi; u boshqa ko'rsatma qo'shmasdan abort qiladi.
- To'lovni rad etish odatiy topshiriq muvaffaqiyatli bo'lishidan oldin sodir bo'ladi. To'lovchini tanlang, tarmoqning to'lov aktivlari metadatalaridan foydalaning va uning balansini tekshirish.
- Agar o'rnatilgan mahalliy ta'rif allaqachon avvalgi ishga tushirilgandan keyin mavjud bo'lsa, yangi hosil qilingan lokalnetni ishga tushiring yoki mavjud holatini davom ettiring. Base58 ID uchun hech qachon noto'g'ri shakllangan tasodifiy satrni almashtirmang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Asset lifecycle integratsiyasi sinovlari biriktirilgan commitda](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust o'rnatilgan majburiyatdagi aktivni qurish misollari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Aktivlar](/uz/blockchain/assets.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsat kodlari](/uz/reference/permissions.md)
- [JavaScript va TypeScript](/uz/guide/tutorials/javascript.md)
