---
translation_locale: uz
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# O‘zaro almashtiriladigan aktivlar {#fungible-assets}

## Natija {#outcome}

Taira-dagi jonli aktiv ta’riflarini tekshiring va yaratilgan mahalliy tarmoqda chiqarish, o‘tkazish, muomaladan chiqarish hamda balansni tekshirish jarayonini to‘liq bajaring. Retsept kanonik prefikssiz Base58 aktiv ta’rifi identifikatorlari, domensiz I105 hisob identifikatorlari va to‘lovning aniq to‘lanishidan foydalanadi.

## Oldindan shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyingi versiya, Node.js 24 hamda joriy `iroha` va `kagami` buyruq qatori vositalari (CLIs).
- Taira-ga faqat o‘qish huquqi bilan kirish.
- Yozish amaliyoti uchun [Iroha-ni ishga tushirish](/uz/get-started/launch-iroha.md) bo‘limidagidek `kagami localnet generate --peers 4 --out-dir ./localnet` buyrug‘iga `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` qo‘shib yaratilgan mahalliy tarmoq. U `./localnet/client.toml` faylini va `http://127.0.0.1:8080` manzilidagi Torii-ni beradi.

## Qadamlar {#steps}

### 1. Taira ta’riflarini imzolovchisiz tekshirish {#_1-inspect-taira-definitions-without-a-signer}

Aktiv ta’rifida shaffof bo‘lmagan Base58 ID, ko‘rsatiladigan nom, chiqarish siyosati, raqamli aniqlik, ixtiyoriy taxallus, egasi, unga egalik qiluvchi ixtiyoriy domen yoki ma’lumotlar makoni, balans siyosati va umumiy miqdor bo‘ladi. Muayyan qoldiqda uni saqlovchi hisob va ixtiyoriy ma’lumotlar makoni doirasi ham mavjud.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

Mahalliy vakolat hisobini yaratilgan sozlamadagi ochiq kalitdan hosil qiling, so‘ng yangi qabul qiluvchi hisob uchun kalit juftini yarating va uni ro‘yxatdan o‘tkazing. Maxfiy kalit chiqarilmaydi.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Mijozga tegishli sonli aktiv ta’rifidan foydalanish {#_3-use-a-client-owned-numeric-definition}

Genezisdan tashqarida ta’rif o‘zining egasi bo‘ladigan, imzolovchiga tegishli `--domain` ostida ro‘yxatdan o‘tkaziladi, yaratilgan mahalliy tarmoq mijozi esa hech qanday domenga egalik qilmaydi. `--asset-definition-id` bilan yaratilgan mahalliy tarmoqda bu ta’rif allaqachon mavjud: genezis uni cheklanmagan aniqlik bilan ro‘yxatdan o‘tkazgan, mijozni uning egasi qilgan va mijozga 1,000,000,000 birlik chiqargan.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Bu ID-ni Taira-da qayta ishlatmang. Ommaviy tarmoqda ro‘yxatdan o‘tkazish yangi kanonik ID, hisobingiz egalik qiladigan va ta’rifga egalik qiluvchi domen (`ledger asset definition register` buyrug‘iga `--domain` sifatida beriladi), har qanday taxallus uchun berilgan `CanManageAssetDefinitionAlias` ruxsati va to‘lov mablag‘ini talab qiladi.

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

Muomaladan chiqargach, manba qoldig‘i `1000000064.50`, qabul qiluvchi qoldig‘i `25.50` va umumiy miqdor `1000000090.00` bo‘lishi kerak.

::: warning Ruxsatlar chegaralari

Taira-da har bir yozish amali uchun `--fee-payer authority` dan foydalaning; CLI imzolashdan oldin Taira to‘lov aktividagi aniq to‘lov narxini oladi. Ro‘yxatdan o‘tkazish uchun ta’rifning `--domain` domeniga egalik qilish kerak, taxallus uchun esa `CanManageAssetDefinitionAlias` ham zarur. Chiqarish ta’rifga egalik qilishni yoki `CanMintAssetWithDefinition` yoxud `CanMintAssetToAccount` ruxsatiga ega bo‘lishni talab qiladi; o‘tkazish va muomaladan chiqarish esa manba qoldig‘i ustidan vakolatni talab qiladi. Kran moliyalashtirgan hisob avtomatik ravishda emitent bo‘lib qolmaydi.

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
- 2-bosqich qabul qiluvchi hisobni aniq ro‘yxatdan o‘tkazadi, shuning uchun hisobni qabul qilish siyosati `ExplicitOnly` bo‘lganda ham o‘tkazish ishlaydi. O‘xshash nomli CLI himoyasi hisob yoki qoldiqni ro‘yxatdan o‘tkazmaydi; u boshqa ko‘rsatma qo‘shish o‘rniga amalni to‘xtatadi.
- To‘lov rad etilishi odatiy ko‘rsatma bajarilishidan oldin yuz beradi. To‘lovchini tanlang, CLI olgan to‘lov narxidagi to‘lov aktivi va eng yuqori miqdorni tekshiring hamda shu aktivdagi qoldiqni tasdiqlang.
- Ayni mahalliy tarmoqda qayta ishga tushirish oldingi qoldiqlardan boshlanadi, `kagami keys` esa mavjud `./cookbook-recipient` ni rad etadi. Yangi yaratilgan mahalliy tarmoqni ishga tushiring va o‘sha katalogni o‘chiring yoki mutlaq qiymatlar o‘rniga qoldiq o‘zgarishlarini taqqoslang. Base58 ID o‘rniga hech qachon noto‘g‘ri shakllangan tasodifiy satr qo‘ymang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi aktiv hayot sikli integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Mahkamlangan commitdagi Rust aktiv tuzish misollari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Aktivlar](/uz/blockchain/assets.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsat tokenlari](/uz/reference/permissions.md)
- [JavaScript va TypeScript](/uz/guide/tutorials/javascript.md)
