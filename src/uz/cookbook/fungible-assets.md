---
translation_locale: uz
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# O‘zaro almashtiriladigan aktivlar {#fungible-assets}

## Natija {#outcome}

Taira-dagi jonli aktiv ta’riflarini tekshiring va yaratilgan mahalliy tarmoqda ro‘yxatdan o‘tkazish, chiqarish, o‘tkazish, yoqish hamda balansni tekshirish jarayonini to‘liq bajaring. Retsept kanonik prefikssiz Base58 aktiv ta’rifi identifikatorlari, domen bilan aniqlashtirilgan taxalluslar, domensiz I105 hisob identifikatorlari va aniq to‘lov niyatidan foydalanadi.

## Oldindan shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyin, Node.js 24, va joriy `iroha` CLI.
- Taira-ga faqat o‘qish huquqi bilan kirish.
- Yozish amaliyoti uchun [Iroha-ni ishga tushirish](/uz/get-started/launch-iroha.md) bo‘limida yaratilgan, `./localnet/client.toml` fayliga va `http://127.0.0.1:8080` manzilidagi Torii-ga ega mahalliy tarmoq.

## Qadamlar {#steps}

### 1. Taira ta’riflarini imzolovchisiz tekshirish {#_1-inspect-taira-definitions-without-a-signer}

Aktiv ta’rifida shaffof bo‘lmagan Base58 ID, ko‘rsatiladigan nom, chiqarish siyosati, raqamli aniqlik, ixtiyoriy taxallus, egasi va umumiy miqdor bo‘ladi. Muayyan qoldiqda uni saqlovchi hisob va ixtiyoriy ma’lumotlar makoni doirasi ham mavjud.

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

JavaScript misolini `node taira-assets.mjs` bilan ishga tushiring. Ochiq aktiv identifikatorlari prefikssiz Base58 qiymatlaridir; `cookbook_credit#wonderland.universal` kabi o‘qiladigan qiymat shunday identifikatorlardan biriga bog‘langan taxallusdir.

### 2. Mahalliy vakolat va qabul qiluvchini tayyorlash {#_2-prepare-the-local-authority-and-destination}

Mahalliy vakolat hisobini yaratilgan sozlamadagi ochiq kalitdan hosil qiling va boshqa ro‘yxatdan o‘tgan hisobni qabul qiluvchi sifatida tanlang. Maxfiy kalit chiqarilmaydi.

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

### 3. Sonli aktiv ta’rifini ro‘yxatdan o‘tkazish {#_3-register-a-numeric-definition}

Bu faqat mahalliy tarmoq uchun yaroqli prefikssiz Base58 aktiv ta’rifi manzilidir. Taxallus odam o‘qiy oladigan `domain.dataspace` proyeksiyasini beradi. `2` aniqligi ikkita kasr raqamiga ruxsat beradi; `--mint-once` ni bermaslik standart `Infinitely` siyosatini saqlaydi.

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

Bu ID-ni Taira-da qayta ishlatmang. Ommaviy tarmoqda ro‘yxatdan o‘tkazish yangi kanonik ID, ilovangizga ajratilgan domen/taxallus, to‘lov mablag‘i va bajarish muhitining aktivni ro‘yxatdan o‘tkazish ruxsatini talab qiladi.

### 4. Chiqarish, o‘tkazish va muomaladan chiqarish {#_4-mint-transfer-and-burn}

Barcha yozish buyruqlari vakolat hisobini to‘lovchi sifatida aniq tanlaydi. CLI imzolashdan oldin tranzaksiyaning aniq narxini oladi va standart holatda uning yakunlanishini kutadi.

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

Muomaladan chiqargach, manba qoldig‘i `64.50`, qabul qiluvchi qoldig‘i `25.50` va umumiy miqdor `90.00` bo‘lishi kerak.

::: warning Ruxsatlar chegaralari

Taira-da krandan olingan `taira.tx-metadata.json` ni qo‘shing va har bir yozuv uchun `--fee-payer authority` dan foydalaning. Ro‘yxatdan o‘tkazish va chiqarish faol tekshiruvchining ruxsatlarini talab qiladi; o‘tkazish va muomaladan chiqarish esa manba qoldig‘i ustidan vakolatni talab qiladi. Kran moliyalashtirgan hisob avtomatik ravishda emitent bo‘lib qolmaydi.

:::

## Tekshirish {#verify}

Ikkala muayyan qoldiqni, so‘ng ta’rifni o‘qing. Amaldan keyingi shu so‘rovlar muvaffaqiyat mezonidir; yuborish kvitansiyasining o‘zi yetarli emas.

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

Ilova tekshiruvlari sonli qiymatlarni ikkilik suzuvchi nuqtali qiymatlar emas, sobit nuqtali o‘nliklar sifatida taqqoslashi, shuningdek hisob bilan birga ta’rif ID-sini ham tekshirishi kerak.

## Muammolarni hal qilish {#troubleshooting}

- Tarkibida `#` bo‘lgan ID taxallus yoki muayyan qoldiq literalidir, kanonik aktiv ta’rifi ID-si emas. `--definition` bilan prefikssiz Base58 qiymatini ishlating yoki `--definition-alias` bilan bog‘langan taxallusni bering.
- `Scale` xatosi miqdorda ta’rif ruxsat berganidan ko‘proq kasr raqami borligini anglatadi.
- `Mintability` rad etilishi `Once`, `Not` yoki `Limited(n)` siyosati chiqarish imkonini tugatgani yoxud taqiqlaganini anglatadi. Tarixni qayta yozmang; ta’rif so‘rovi qaytargan siyosatga amal qiling.
- 2-bosqich ataylab ro‘yxatdan o‘tgan qabul qiluvchi hisobni tanlaydi. Aktivni qabul qilish siyosati `ExplicitOnly` bo‘lsa, o‘tkazishdan oldin vakolatli jarayon orqali qabul qiluvchi qoldig‘ini yarating. O‘xshash nomli CLI himoyasi hisob yoki qoldiqni ro‘yxatdan o‘tkazmaydi; u boshqa ko‘rsatma qo‘shish o‘rniga amalni to‘xtatadi.
- To‘lov rad etilishi odatiy ko‘rsatma bajarilishidan oldin yuz beradi. To‘lovchini tanlang, tarmoqning to‘lov aktivi metama’lumotidan foydalaning va uning qoldig‘ini tekshiring.
- Belgilangan mahalliy ta’rif oldingi ishga tushirishdan allaqachon mavjud bo‘lsa, yangi yaratilgan mahalliy tarmoqni ishga tushiring yoki uning mavjud holatidan davom eting. Base58 ID o‘rniga hech qachon noto‘g‘ri shakllangan tasodifiy satr qo‘ymang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi aktiv hayot sikli integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Mahkamlangan commitdagi Rust aktiv tuzish misollari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Aktivlar](/uz/blockchain/assets.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsat tokenlari](/uz/reference/permissions.md)
- [JavaScript va TypeScript](/uz/guide/tutorials/javascript.md)
