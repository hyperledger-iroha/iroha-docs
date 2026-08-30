---
translation_locale: uz
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hisob-kitoblar va aliaslar {#accounts-and-aliases}

## Natija {#outcome}

Domensiz kanonik I105 hisobini IDs va alohida bog'langan inson tomonidan o'qiladigan aliaslarni, masalan, `treasury@payments.universal` bilan xavfsiz ishlating. Siz Taira hisoblarini tekshiring, o'zingizning kanonik ID hisobingizni keltirib chiqaring va aliaslarni yo'naltirish kontekstini kimlik bilan chalg'itmasdan hal qilasiz.

## Oldindan talablar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyin, va joriy `iroha` CLI.
- [dan `taira.client.toml` O'zingizning hisobingizni tekshirishda Taira](./connect-to-taira.md) raqamiga ulaning.
- Taira kran orqali yoki tarmoqning tartibga solinadigan onboarding yo'li orqali hisobni taqdim etishdan oldin hisob-kitobga oid o'qish muvaffaqiyatli bo'lishini kutish.

## qadamlar {#steps}

### 1. Taira bo'yicha kanonik hisob-kitoblarni tekshiring {#_1-inspect-canonical-accounts-on-taira}

Davlat hisob raqamlari ro'yxati har doim kanonik I105 IDs ni qaytaradi. Birlamchi alias ixtiyoriy bo'lib, alohida ma'lum qilinadi.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID dan `.id` hisob maydonlari uchun haqiqiy. unga domen qo'shmang. `.primary_alias` ning aliasi foydalanuvchiga qaratilgan qidiruv kalitidir, boshqa kanonik identifikatsiya emas.

### 2. O'zingizning Taira I105 ID vositasini aniqlang va normallashtiring. {#_2-derive-and-normalize-your-taira-i105-id}

Faqat mahalliy konfiguratsiyadan ochiq kalitni o'qing. Bir xil ommaviy kalit turli xil ijtimoiy tarmoq profillari uchun boshqacha tarzda kodlanadi, shuning uchun `taira` ni aniq tanlang.

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

Normallashtirilgan qiymat `TAIRA_ACCOUNT_ID` bilan bir xil bo'lishi kerak. TOML faylidagi `[account].domain` moslamasi `wonderland.universal` bo'lishi mumkin, ammo ushbu qiymat faqat yo'nalish va alias kontekstini ta'sir qiladi.

### 3. Hisobot va uning aktivlarini o'qing. {#_3-read-the-account-and-its-assets}

Hisobvaraq ta'minlanganidan so'ng, uni to'g'ridan-to'g'ri so'rang va cheklangan aktiv sahifasini ro'yxatga oling. URL - uni yo'nalishda ishlatishdan oldin I105 qiymatini kodlang.

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

### 4. Hisobga bog'langan aliaslarni qidiring {#_4-look-up-aliases-bound-to-the-account}

Reverse resolver bitta aniq kanonik hisobni qabul qiladi ID. Umumiy ma'lumotlar maydonining satrlarini so'rov imzo boshliqlarisiz o'qish mumkin; cheklangan ma'lumot maydonlariga ruxsat berilgan imzolangan so'rov talab etiladi.

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

`total: 0` haqiqiy: hisob raqamiga alias kerak emas. Agar bog'liqlik mavjud bo'lsa, uning to'liq tasdiqlangan aliasini aniqlab oling va qaytarilgan hisob qaydnomani ID taqqoslang:

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

::: warning Ruxsatlar chegaralari

Taira kran o'z talabgor hisobini ta'minlashi mumkin, ammo bu amalga oshiriladi umumiy hisobni ro'yxatdan o'tkazish yoki aliaslarni boshqarish organini bermaydi. Boshqa hisobni ro'yxatga olish uchun faol tasdiqlovchi ostida `CanRegisterAccount` talab qilinadi. Hisobvaraq aliaslari uchun odatda faol SNS ijara shartnomasi va tegishli alias ruxsatnomalari ham kerak. Qo'llanilgan onboarding / alias rejalashtiruvchidan foydalaning yoki hosil bo'lgan mahalliy tarmoqga nisbatan ro'yxatdan o'tishni mashq qiling.

:::

Mahalliy tarmoqda yangi kanonik `NEW_ACCOUNT_ID` qo'llanilganidan so'ng, ro'yxatdan o'tkazish yuzi quyidagicha:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Tugmalar biriktirilgan xususiy kalitni hujjat yoki ilovalar omboridan tashqarida yaratish va saqlash. ID boshqaruvchisi kalitidan voz kechilganini ro'yxatdan o'tkazish foydalanilmaydigan hisobni yaratadi.

## Tekshirish {#verify}

Konfiguratsiya ochiq kaliti, I105 kodlash va bog'lovchi aliaslarning hammasi bitta kanonik hisobda ID konvergentligini isbotlang:

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

Kanonik hisobni saqlash IDs. Imzolar, ruxsatnomalar va tranzaksiya yo'l-yo'riqlari uchun kanonik IDs dan foydalaning. Ilova chegaralarida aliasni hal qiling. Operatsiya uchun ishlatiladigan kanonik hisob ID ni saqlang.

## Muammolarni hal qilish {#troubleshooting}

- Parse yoki prefix xatosi odatda boshqa tarmoq profili uchun manzil kodiflashtirilganligini anglatadi. `--profile taira` bilan normallashtiring va mos kelmaydiganlarni rad qiling.
- `202` kranidan keyin `404` hisobini tarqatish kechiktirilishi mumkin. Yozishni yuborishdan oldin hisob raqamini yoki mablag' bilan ta'minlangan aktivni so'rang.
- `total: 0` to'g'ridan-to'g'ri resolverdan ko'rinadigan alias bog'lanmaganligini anglatadi; bu hisobni qidirishda xatolik emas.
- `401` yoki `403` alias yo'nalishidan cheklangan ma'lumotlar maydonini yoki yetarlicha aniq hal etish ruxsatnomasini ko'rsatadi.
- O'qib bo'ladigan `name@domain.dataspace` qiymat har yerda qabul qilinmaydi, chunki kanonik I105 ID talab qilinadi.
- Agar mahalliy hisob qaydnomasi muvaffaqiyatli bo'lsa, lekin Taira uni rad qilsa, farq ruxsatdir. `CanRegisterAccount` oling; tasdiqlashni o'tkazib yuborish uchun ID hisobini o'zgartirmang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Kanonik hisob manzilini o'rnatilgan commit-da amalga oshirish ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Hisob va alias sinovlari Torii biriktirilgan qo'yilganda](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Hisobotlar](/uz/blockchain/accounts.md)
- [Ma'lumotlar modeli aliaslari](/uz/blockchain/data-model.md#aliases)
- [Nomlashtirish konvensiyalari](/uz/reference/naming.md)
- [Ruxsat kodlari](/uz/reference/permissions.md)
