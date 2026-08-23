---
translation_locale: uz
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadatalar {#metadata}

## Natija {#outcome}

Taira dagi metadatalarni o'qing , bitta hisobning metadata qiymatini belgilab oling va tasdiqlang to'lovlarni to'lash bilan amalga oshiriladi va qiymatni yana olib tashlaydi. Transaksiya to'lovlari metadatalaridan bir-biriga bog'liq bo'lgan ob'ektlarni saqlaysiz.

## Oldindan talablar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyin, va joriy `iroha` CLI.
- [dan Taira](./connect-to-taira.md)ga bog'lanish uchun moliyalashtirilgan `taira.client.toml` va `taira.tx-metadata.json`
- Maqsadli hisobning metadatalari ustidan hokimiyat. Misol konfiguratsiya qilingan ma'muriyatni o'ziga qaratilgan; boshqa hisob aniq ruxsat talab qiladi.

## qadamlar {#steps}

### 1. Metadatalarni imzolamaydigan holda o'qing {#_1-read-metadata-without-a-signer}

Metadotlar `Name` to JSON xaritasiga cheklangan. Bo'sh xaritalar va bo'sh filtrlangan mahsulot haqiqiy natijalardir.

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

Kichik tavsif yoki indekslash maydonlari uchun metadatalardan foydalaning. Katta faydali yuklarni hisobdan chiqarish va o'rniga URI yoki SoraFS ma'lumotlarini saqlash.

### 2. Maqsad hisobini aniqlang {#_2-derive-the-target-account}

Taira konfigidan faqat ommaviy kalitni o'qib, uni kanonik domensiz I105 shakliga aylantiring.

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

### 3. Bir JSON qiymatini belgilash {#_3-set-one-json-value}

JSON standart kirishdan o'qib, hisobning `cookbook_profile` qiymatiga aylanadi. Boshqa tomondan, `--metadata ./taira.tx-metadata.json` to'lov maydonlarini tranzaksiya zarfasiga qo'shadi. Ikkala xaritada turli maqsadlar va maqsadlar mavjud.

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

CLI to'lovni ko'rsatadi, belgilaydi, taqdim etadi va default ravishda kutadi. `--no-wait` keyingi operatsiya ushbu qiymatga bog'liq bo'lganda qo'shmaydi.

::: warning Ruxsatlar chegaralari

Har bir ob'ektni kim o'zgartirishi mumkinligini faol tasdiqlovchi hal qiladi. Boshqa hisobni yangilash uchun odatda `CanModifyAccountMetadata` talab qilinadi; domenlar, aktivlarning ta'riflari, NFTs va qo'zg'atuvchilar o'z maqsadga mos metadatalarga ruxsatnomalariga ega. Agar Taira talab qilingan vakolatni berilmagan bo'lsa, xuddi shu hisob buyruqlarini `./localnet/client.toml` bilan ishga tushiring, hosil qilingan lokalnet hokimiyatining kanonik I105 ID ni almashtiring va Taira to'lov metadata faylini qoldiring.

:::

### 4. Ochiqni olib tashlang. {#_4-remove-the-key}

Avval belgilangan qiymatni o'qing, so'ngra alohida olib tashlash operatsiyasi taqdim eting.

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

uchun Python qo'llanmalar, moslashtirilgan turdagi qurilmalar `Instruction.set_account_key_value` va `Instruction.remove_account_key_value`; Transaksiya metadatalari va kutish yordamchisi bilan ularni taqdim etish [Python qoʻllanma](/uz/guide/tutorials/python.md#shared-setup).

## Tekshirish {#verify}

O'rnatilgan bitimdan keyin `meta get` ob'ektni `version: 1` bilan qaytarishi kerak. O'chirishdan so'ng, to'g'ridan-to'g'ri qidiruv qiymatini qaytarishi mumkin emas:

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

Jismoniy hisobdan o'qilganda yo'qolgan metadata kalitini tarmoq yoki hisobdagi xatolardan ajratib turadi. Mahsulot kodi, uni sozlaganidan keyin butun JSON qiymatini ham tekshirish kerak.

## Muammolarni hal qilish {#troubleshooting}

- Standart kirish bitta haqiqiy JSON qiymatini o'z ichiga olishi kerak. Satrlarga JSON ko'rsatmalari kerak; ob'ektlar va jadvallar yaxshi shakllangan bo'lishi kerak.
- Metadata kalitlari `Name` qiymatlar bo'lib, tahlildan keyin holatga mos keladi. Har bir sxema o'zgarishi uchun versiyalangan kalitlarni yaratishning o'rniga barqaror kalit so'zlar to'plamini ushlab turing.
- `--metadata` Transaksiya metadatalar; bu katta qog'oz ob'ekti metadatalarini o'rnatmaydi. `meta set` so'nggilar uchun kichik qo'mondon.
- Muvaffaqiyatli topshirilganda eski o'qishga ergashgan holda tarqatish kechikishi mumkin. Qo'llaniladigan yakuniylikni kuting va so'rovni qayta yuborishdan oldin yana sinab ko'ring.
- Ruxsatlarni rad etish maqsad ob'ekti va hokimiyat chegaralarini aniqlaydi. Mahalliy ravishda o'rganing yoki to'g'ri tokenni so'rang; kirish nazoratidan qochish uchun xususiy ilova ma'lumotlarini ommaviy metadata maydonlariga ko'chirmang.
- Maxsus kalitlarni, shaxsiy identifikatorlarni, kirish tokenlarini yoki katta hujjatlarni hech qachon metadatalarda saqlamang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Metadata so'rovlarini integratsiyalash sinovlari pinned commitda](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs)
- [Python SDK o'rnatilgan majburiyatdagi tranzaksiya quruvchilari](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Metadatalar va katta qog'ozlarni saqlash variantlari ](/uz/guide/configure/metadata-and-store-assets.md)
- [Ko'rsatma ma'lumotnomasi ](/uz/reference/instructions.md)
- [Ruxsat kodlari](/uz/reference/permissions.md)
