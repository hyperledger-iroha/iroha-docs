---
translation_locale: uz
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hisoblar va taxalluslar {#accounts-and-aliases}

## Natija {#outcome}

Domensiz kanonik I105 hisob IDs va `treasury@payments.universal` kabi alohida bog‘langan, odam o‘qiy oladigan taxalluslar bilan xavfsiz ishlang. Taira hisoblarini tekshirasiz, o‘z kanonik ID-ingizni hosil qilasiz va yo‘naltirish kontekstini shaxsiyat bilan adashtirmasdan taxalluslarni yechasiz.

## Oldindan shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyin, va joriy `iroha` CLI.
- O‘z hisobingizni tekshirish uchun [Taira-ga ulanish](./connect-to-taira.md) bo‘limida yaratilgan `taira.client.toml`.
- Hisobga xos o‘qish muvaffaqiyatli bo‘lishidan oldin Taira krani yoki tarmoqning boshqariladigan qabul jarayoni orqali yaratilgan hisob.

## Qadamlar {#steps}

### 1. Taira-dagi kanonik hisoblarni tekshirish {#_1-inspect-canonical-accounts-on-taira}

Ochiq hisoblar ro‘yxati doim kanonik I105 IDs ni qaytaradi. Asosiy taxallus ixtiyoriy bo‘lib, alohida ko‘rsatiladi.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id` maydonidagi ID qat’iy hisob maydonlari uchun yaroqli. Unga domen qo‘shmang. `.primary_alias` maydonidagi taxallus foydalanuvchi uchun qidiruv kalitidir, boshqa kanonik shaxsiyat emas.

### 2. Taira I105 ID-ingizni hosil qilish va me’yorlashtirish {#_2-derive-and-normalize-your-taira-i105-id}

Mahalliy sozlamadan faqat ochiq kalitni o‘qing. Ayni ochiq kalit turli ommaviy tarmoq profillari uchun turlicha kodlanadi, shu sabab `taira` profilini aniq tanlang.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

Me’yorlashtirilgan qiymat `TAIRA_ACCOUNT_ID` bilan aynan bir xil bo‘lishi kerak. TOML faylidagi `[account].domain` sozlamasi `wonderland.universal` bo‘lishi mumkin, ammo bu qiymat faqat yo‘naltirish va taxallus kontekstiga ta’sir qiladi.

### 3. Hisob va uning aktivlarini o‘qish {#_3-read-the-account-and-its-assets}

Hisob yaratilgach, uni bevosita so‘rang va aktivlarning chegaralangan sahifasini oling. I105 qiymatini yo‘lda ishlatishdan oldin URL-kodlang.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Hisobga bog‘langan taxalluslarni qidirish {#_4-look-up-aliases-bound-to-the-account}

Teskari yechuvchi aynan bitta kanonik hisob ID-sini qabul qiladi. Ochiq ma’lumotlar makoni yozuvlarini so‘rov imzosi sarlavhalarisiz o‘qish mumkin; cheklangan makonlar vakolatli imzolangan so‘rovni talab qiladi.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` — yaroqli natija: hisobga taxallus shart emas. Bog‘lanish mavjud bo‘lsa, uning aniq to‘liq malakali taxallusini yeching va qaytarilgan hisob ID-sini taqqoslang:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Ruxsat chegarasi

Taira krani da’vogarning hisobini yaratishi mumkin, ammo bu umumiy hisoblarni ro‘yxatdan o‘tkazish yoki taxalluslarni boshqarish vakolatini bermaydi. Boshqa hisobni ro‘yxatdan o‘tkazish uchun faol tekshiruvchi ostida `CanRegisterAccount` talab qilinadi. Hisob taxalluslari odatda faol SNS ijarasi va tegishli taxallus ruxsatlarini ham talab qiladi. Boshqariladigan qabul/taxallus rejalashtiruvchisidan foydalaning yoki ro‘yxatdan o‘tkazishni yaratilgan mahalliy tarmoqda mashq qiling.

:::

Mahalliy tarmoqda xavfsiz imzolovchini tayyorlash bosqichi yangi kanonik `NEW_ACCOUNT_ID` ni eksport qilgach, ro‘yxatdan o‘tkazish interfeysi quyidagicha bo‘ladi:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Mos maxfiy kalitni hujjatlar yoki ilova repozitoriysidan tashqarida yarating va saqlang. Boshqaruvchi kaliti tashlab yuborilgan ID-ni ro‘yxatdan o‘tkazish ishlatib bo‘lmaydigan hisob yaratadi.

## Tekshirish {#verify}

Sozlamadagi ochiq kalit, I105 kodlanishi va taxallus bog‘lanishi bitta kanonik hisob ID-siga mos kelishini isbotlang:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Kanonik hisob IDs ni saqlang. Imzolar, ruxsatlar va tranzaksiya ko‘rsatmalarida kanonik IDs dan foydalaning. Taxallusni ilova chegarasida yeching. Amal uchun ishlatilgan kanonik hisob ID-sini saqlab qoling.

## Muammolarni hal qilish {#troubleshooting}

- Tahlil yoki prefiks xatosi odatda manzil boshqa tarmoq profili uchun kodlanganini anglatadi. Uni `--profile taira` bilan me’yorlashtiring va nomuvofiqlikni rad eting.
- Kran `202` qaytargach hisob uchun `404` olish tarqalish kechikishi bo‘lishi mumkin. Yozuv yuborishdan oldin hisob yoki mablag‘ tushgan aktivni takroran so‘rang.
- Teskari yechuvchining `total: 0` javobi ko‘rinadigan taxallus bog‘lanmaganini anglatadi; bu hisobni qidirish xatosi emas.
- Taxallus yo‘nalishining `401` yoki `403` javobi cheklangan ma’lumotlar makoni yoxud aynan yechish uchun ruxsat yetishmasligini bildiradi. Keng prefiksli qidiruvni zaxira usuli sifatida ishlatmang.
- Odam o‘qiy oladigan `name@domain.dataspace` qiymati kanonik I105 ID talab qilinadigan har bir joyda qabul qilinmaydi. Avval uni yeching.
- Mahalliy hisobni ro‘yxatdan o‘tkazish muvaffaqiyatli bo‘lib, Taira uni rad etsa, farq vakolatdadir. `CanRegisterAccount` ni oling; tekshiruvni chetlab o‘tish uchun hisob ID-sini o‘zgartirmang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi kanonik hisob manzili amalga oshirishi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Mahkamlangan commitdagi Torii hisob va taxallus sinovlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Hisoblar](/uz/blockchain/accounts.md)
- [Ma’lumotlar modeli taxalluslari](/uz/blockchain/data-model.md#aliases)
- [Nomlash qoidalari](/uz/reference/naming.md)
- [Ruxsat tokenlari](/uz/reference/permissions.md)
