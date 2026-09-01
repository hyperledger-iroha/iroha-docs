---
translation_locale: uz
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Metama’lumot {#metadata}

## Natija {#outcome}

Taira-dagi metama’lumotni o‘qing, aniq to‘lovli tranzaksiya orqali hisobning bitta metama’lumot qiymatini o‘rnating va tekshiring, so‘ng qiymatni olib tashlang. Reyestr obyekti metama’lumotini tranzaksiya to‘lovi metama’lumotidan alohida tutasiz.

## Oldindan shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyingi, va joriy `iroha` CLI.
- [Taira-ga ulanish](./connect-to-taira.md) bo‘limida yaratilgan, moliyalashtirilgan `taira.client.toml` va `taira.tx-metadata.json`.
- Maqsad hisob metama’lumoti ustidan vakolat. Misol sozlangan vakolat hisobining o‘zini nishonga oladi; boshqa hisob aniq ruxsatni talab qiladi.

## Qadamlar {#steps}

### 1. Metama’lumotni imzolovchisiz o‘qish {#_1-read-metadata-without-a-signer}

Metama’lumot — tekshirilgan `Name` kalitlaridan JSON qiymatlariga xarita. Bo‘sh xaritalar va filtrning bo‘sh natijasi yaroqli hisoblanadi.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Kichik tavsifiy yoki indekslash maydonlari uchun metama’lumotdan foydalaning. Katta foydali yuklarni reyestrdan tashqarida saqlang va ularning o‘rniga kriptografik dayjest, URI yoki SoraFS havolasini yozing.

### 2. Maqsad hisobini aniqlang {#_2-derive-the-target-account}

Taira sozlamasidan faqat ochiq kalitni o‘qing va uni kanonik, domensiz I105 shakliga aylantiring.

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
```

### 3. Bir JSON qiymatni belgilang {#_3-set-one-json-value}

Standart kirishdan olingan JSON hisobning `cookbook_profile` qiymatiga aylanadi. `--metadata ./taira.tx-metadata.json` esa tranzaksiya metama’lumoti konteyneriga to‘lov maydonlarini qo‘shadi. Bu ikki xaritaning vazifasi boshqa-boshqa.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI to‘lov narxini oladi, tranzaksiyani imzolaydi va yuboradi hamda odatda yakunlanishini kutadi. Keyingi amal shu qiymatga bog‘liq bo‘lsa, `--no-wait` ni qo‘shmang.

::: warning Ruxsat chegarasi

Faol tekshiruvchi har bir obyektni kim o‘zgartira olishini belgilaydi. Boshqa hisobni yangilash odatda `CanModifyAccountMetadata` ni talab qiladi; domenlar, aktiv ta’riflari, NFTs va qo‘zg‘atuvchilarning o‘z maqsadli metama’lumot ruxsatlari bor. Taira zarur ruxsatni bermagan bo‘lsa, ayni hisob buyruqlarini `./localnet/client.toml` bilan bajaring, vakolatning kanonik I105 ID-sini yaratilgan mahalliy tarmoqdagi qiymatga almashtiring va Taira to‘lov metama’lumoti faylini bermang. Mahalliy to‘lovchini baribir aniq tanlang.

:::

### 4. Kalitni olib tashlang {#_4-remove-the-key}

Avval yakunlangan qiymatni o‘qing, so‘ng alohida olib tashlash tranzaksiyasini yuboring.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python ilovalari uchun mos tiplashtirilgan quruvchilar — `Instruction.set_account_key_value` va `Instruction.remove_account_key_value`; ularni tranzaksiya metama’lumoti va [Python qo‘llanmasidagi](/uz/guide/tutorials/python.md#shared-setup) kutish yordamchisi bilan yuboring.

## Tekshirish {#verify}

O‘rnatish tranzaksiyasidan keyin `meta get` `version: 1` qiymatli obyektni qaytarishi kerak. Olib tashlangach, bevosita qidiruv qiymat qaytarmasligi kerak:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Hisobni alohida o‘qish yo‘q metama’lumot kalitini tarmoq yoki hisob xatosidan farqlash imkonini beradi. Ishlab chiqarish kodi qiymatni o‘rnatgach, to‘liq JSON-ni ham tekshirishi kerak.

## Muammolarni bartaraf etish {#troubleshooting}

- Standart kirishda bitta haqiqiy JSON qiymat bo‘lishi kerak. Qatorlar uchun JSON tirnoq kerak; obyektlar va massivlar to‘g‘ri tuzilgan bo‘lishi kerak.
- Metama’lumot kalitlari `Name` qiymatlari bo‘lib, tahlildan keyin registrga sezgir. Har bir sxema o‘zgarishi uchun yangi versiyali kalit yaratish o‘rniga barqaror kalitlar lug‘atini saqlang.
- `--metadata` tranzaksiya metama’lumotidir; u reyestr obyektining metama’lumotini o‘rnatmaydi. Ikkinchisi uchun obyektning `meta set` quyi buyrug‘idan foydalaning.
- Muvaffaqiyatli yuborishdan keyingi eskirgan o‘qish tarqalish kechikishi bo‘lishi mumkin. `Applied` yakuniy holatini kuting va qayta yuborishdan oldin so‘rovni takrorlang.
- Ruxsat rad etilishi maqsad obyekt va vakolat doirasini ko‘rsatadi. Mahalliy tarmoqda mashq qiling yoki aniq tokenni so‘rang; kirish nazoratini chetlab o‘tish uchun xususiy ilova ma’lumotini ochiq metama’lumot maydoniga ko‘chirmang.
- Maxfiy kalitlar, xom shaxsiy identifikatorlar, kirish tokenlari yoki katta hujjatlarni hech qachon metama’lumotda saqlamang.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi metama’lumot so‘rovi integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Mahkamlangan commitdagi Python SDK tranzaksiya quruvchilari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metama’lumot](/uz/blockchain/metadata.md)
- [Metama’lumot va reyestrda saqlash variantlari](/uz/guide/configure/metadata-and-store-assets.md)
- [Ko‘rsatma manbai](/uz/reference/instructions.md)
- [Ruxsat tokenlari](/uz/reference/permissions.md)
