---
translation_locale: uz
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Domenlar {#domains}

Domenlar `World` da ro'yxatdan o'tgan nom maydonlari deb ataladi. Hozirgi Iroha 3 ma'lumotlar modelida domen ona ma'lumot maydonlari bilan kvalifikatsiya qilinadi, shuning uchun kanonik identifikator quyidagicha:

```text
domain.dataspace
```

Misol uchun, `payments.universal` `payments` domenining `universal` ma'lumotlar maydonidagi nomlari.

## Tashkilot {#structure}

Ro'yxatga olingan `Domain` tarkibida quyidagilar mavjud:

- `id`: ma'lumotlar maydonida malakali bo'lgan `DomainId`
- `logo`: domen logotipi uchun `SoraFS` URI ko'rsatkich
- `metadata`: o'zboshimchalik bilan kalit qiymatli metadotlar
- `owned_by`: domeniga ega bo'lgan hisob raqamlari, odatda uni ro'yxatdan o'tkazgan hisob raqami

Domenni materiallashtirish uchun ishlatiladigan bootstrap payload: `NewDomain`. U o ' z ichiga `id`, ko'rsatkich `logo`, va dastlabki `metadata`. Ish vaqti toʻldirilgan `owned_by` Oddiy mijozlar bu yukni to'g'ridan-to'g'ri topshirmaydilar.

## Ro'yxatdan o'tish {#registration}

Oddiy domen yaratish deklarativ alias o'rnatish oqimini ishlatadi. Bu SNS ijara shartnomasini, egalik qilish qobiliyatlarini, narxlarni himoya qilishni va domen qatorini bitta atomik `EnsureAlias` muomalada saqlaydi. `Register::Domain` genesis / bootstrap yuzasi bo'lib qoladi va `ledger domain` buyruqida `register` kichik buyruq yo'q.

SDK yoki onboarding xizmati bilan sirsiz `AliasSetupPlanRequestV1` niyatni yaratish, so'ngra CLI uni jonli holatga qarshi rejalashtirish va to'g'ri rejani taqdim etish uchun:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Niyat `payments.universal`, uning raqamli ma'lumotlar maydonini, kanonik I105 egasini, ijara sotib olish muddati va joriy siyosat / to'lov quote qo'riqchini aniqlaydi. rejalashtiruvchining oxirgi nuqtasi `POST /v1/aliases/setup/plan`; uning qaytarilgan rejasi zanjir, vakolat, davlat va muddatga bog'liq . Domenlarni olib tashlash hali ham [`Unregister`](/uz/blockchain/instructions.md#un-register)dan foydalanadi.

Domeni yaratish yoki olib tashlash uchun aktiv ishga tushirish vaqtini tasdiqlash vositasida tegishli domen boshqaruv ruxsatnomasi kerak. [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue) bilan domen metadatalari yangilanishi mumkin, agar hokimiyat ushbu domenni o'zgartirishga ruxsatnomaga ega bo'lsa.

## Taira bilan sinab ko'ring. {#try-it-on-taira}

Hozirda ommaviy Taira testnetida ko'rinadigan domenlarni ro'yxatga oling:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Jamoat yoʻli katalogini maʼlumotlar maydonining aliaslariga qaytarish:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Ilova domen mavjudligini tekshirish uchun birinchi buyruqdan foydalaning. Ma'lumotlar maydonining ommaviy, cheklangan yoki asosiy yo'nalish orqasida qolganligini tasdiqlash uchun yo'l katalogidan foydalanishingiz kerak.

Domenni o'rnatish - bu pul to'lanadigan yozish. Taira, faucet yordamchisini qutqarish [Testnetni olish XOR bilan Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) koʻrsatilgan `taira_faucet_claim.py`, imzochiga ommaviy kran orqali mablag' ajratish va to'lov metadatalarini qo'shish:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Tekroriy testnet ishlarida noyob domen nomi uchun niyatni yaratish va foydalanish Taira amaldagi siyosat va to'lov aktivlari quote himoya. lokalnet yoki Minamoto.

## Boshqa subyektlar bilan munosabatlar {#relationship-to-other-entities}

Domenlar ob'ektlarni guruhiga qo'shadi va domen ko'lamli ma'lumotlar uchun nom maydonini taqdim etadi. Asset ta'riflari domen malakali identifikatorlardan foydalanadi, so'rovlar domenlarni ro'yxatga olishi yoki domenga doiradagi ob'ektlar topilishi mumkin. Hisobotlarning o'zi joriy ma'lumotlar modelida domensiz, ammo hisobotlar domenlarga ega bo'lishi va ularning ta'riflari domenlar ostida yashaydigan aktivlarni saqlashi mumkin.

Shuningdek qarang:

- [Jahon](/uz/blockchain/world.md)
- [Aktivlar](/uz/blockchain/assets.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Nomlash qoidalari](/uz/reference/naming.md)
