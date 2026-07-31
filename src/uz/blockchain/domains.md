---
translation_locale: uz
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Domenlar {#domains}

Domenlar nomli nom maydonlari boʻlib, `World`. Hozirgi vaqtda Iroha
3 ma'lumotlar modeli domen o'z ota-ona ma'lumot maydoni bilan kvalifikatsiya qilinadi, shuning uchun kanonik
identifikator:

```text
domain.dataspace
```

Masalan, `payments.universal` nomlari `payments` domen ichida
`universal` ma'lumotlar maydoni.

## Qurilish {#structure}

Ro'yxatdan o'tgan `Domain` tarkibida:

- `id`: ma'lumotlar maydonida malakali `DomainId`
- `logo`: tanlov `SoraFS` URI domen logotipi uchun
- `metadata`: O'zboshimchalik bilan kalit qiymatli metadotlar
- `owned_by`: domeniga egalik qiluvchi hisob raqami, odatda
  ro'yxatga olingan

Domenni materiallashtirish uchun ishlatiladigan bootstrap payload `NewDomain`. U oʻz ichiga oladi .
ko'rsatilgan `id`, ko'rsatkich `logo`, va dastlabki `metadata`. Ish vaqti toʻldiradi
`owned_by` Oddiy mijozlar ushbu yukni taqdim etmaydilar
to'g'ridan-to'g'ri.

## Ro'yxatga olish {#registration}

Oddiy domen yaratish deklarativ alias o'rnatish oqimidan foydalanadi.
SNS ijara shartnomasi, egalik qilish qobiliyati, narxlarni himoya qilish va bitta atom vositasida domenlar qatorlari
`EnsureAlias` muomala. `Register::Domain` genesis/bootstrap bo'lib qoladi
yuzasi va `ledger domain` buyruq yoʻq `register` subkomand.

Sirsiz yaratish `AliasSetupPlanRequestV1` niyat bilan SDK yoki o'rnatish
xizmat, keyin bor CLI uni tirik holatga qarshi rejalashtiring va to'g'ri so'zlarni taqdim eting
reja:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Niyat aniqlanadi `payments.universal`, uning raqamli ma'lumotlar maydonchasi, kanonik
I105 mulkdor, ijara shartnomasini sotib olish muddati va joriy siyosat/to'lov quote saqlovchi.
Tizimning oxirgi nuqtasi: `POST /v1/aliases/setup/plan`; qaytarilgan rejasi
Zaminni olib tashlash hali ham ishlatiladi
[`Unregister`](/uz/blockchain/instructions.md#un-register).

Domeni yaratish yoki olib tashlash uchun tegishli domenlarni boshqarish kerak
faol ishga tushirish vaqtini tasdiqlovchi boʻyicha ruxsatnoma.
[`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue)
agar hokimiyat ushbu domeni o'zgartirish uchun ruxsatnomaga ega bo'lsa.

## Uni sinab koʻring . Taira {#try-it-on-taira}

Jamoatda hozirda koʻrinadigan domenlarni roʻyxatga oling Taira sinov tarmog'i:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Jamoat yoʻli katalogini maʼlumotlar maydoni aliaslariga qaytarish:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Ilova domen mavjudligini tekshirish uchun birinchi buyruqni ishlating.
ma'lumotlar maydonining ommaviyligini tasdiqlash uchun yo'l katalogini ko'rsatish;
cheklangan yoki asosiy yo'nalishda orqada qolgan.

Domenni o'rnatish - bu pul to'lanadigan yozish. Taira, saqlab qolish
suv quvurlari yordamchisi
[Testnetni olish XOR to ' g'risida Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
sifatida `taira_faucet_claim.py`, imzochiga ommaviy kran orqali mablag' ajratish; va
qo'shimcha to'lov metadatalari:

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

Tekroriy testnet ishlatiladigan domen nomi uchun niyatni yaratish va foydalanish
Taira amaldagi siyosat va to ' lov aktivlari quote qo ' riqlash.
lokalnet uchun yoki Minamoto.

## Boshqa subyektlar bilan munosabatlar {#relationship-to-other-entities}

Domenlar guruhi ob'ektlarini guruhlaydi va domen miqyosidagi ma'lumotlar uchun nom maydonini taqdim etadi.
Asset ta'riflari domenlar uchun identifikatorlardan foydalanadi va so'rovlar ro'yxatga olishi mumkin
domenlar yoki domenga doiradagi ob'ektlarni topish. Hisobotlarning o'zi
mavjud ma'lumotlar modelida domensiz, lekin hisoblar domenlarga ega bo'lishi mumkin va
Ma'lumotlar domenlar ostida mavjud bo'lgan aktivlar.

Shuningdek qarang:

- [Dunyo](/uz/blockchain/world.md)
- [Aktivlar](/uz/blockchain/assets.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Nomlash qoidalari](/uz/reference/naming.md)
