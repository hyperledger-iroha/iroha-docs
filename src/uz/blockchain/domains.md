---
translation_locale: uz
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Domenlar {#domains}

Domenlar — `World` da ro‘yxatdan o‘tgan nomlar makonlari. Joriy Iroha 3 ma’lumotlar modelida domen ota ma’lumotlar makoni bilan aniqlashtiriladi, shu sabab kanonik identifikator quyidagicha:

```text
domain.dataspace
```

Masalan, `payments.universal` — `universal` ma’lumotlar makonidagi `payments` domeni.

## Tuzilishi {#structure}

Ro‘yxatdan o‘tkazilgan `Domain` quyidagilarni o‘z ichiga oladi:

- `id`: ma’lumotlar makoni bilan aniqlashtirilgan `DomainId`;
- `logo`: domen logotipi uchun ixtiyoriy `SoraFS` URI;
- `metadata`: ixtiyoriy kalit-qiymat metama’lumotlari;
- `owned_by`: domenga egalik qiladigan hisob, odatda uni ro‘yxatdan o‘tkazgan hisob.

Domenni yaratish uchun ishlatiladigan boshlang‘ich foydali yuk `NewDomain` dir. U `id`, ixtiyoriy `logo` va dastlabki `metadata` ni o‘z ichiga oladi. Bajarish muhiti `owned_by` qiymatini vakolat hisobidan oladi. Oddiy mijozlar bu foydali yukni bevosita yubormaydi.

## Ro‘yxatdan o‘tkazish {#registration}

Oddiy domen yaratishda deklarativ taxallus sozlash jarayoni ishlatiladi. U SNS ijarasi, egaga tegishli imkoniyatlar, narx taklifi himoyasi va domen yozuvini bitta atomik `EnsureAlias` tranzaksiyasida saqlaydi. `Register::Domain` genezis va dastlabki yuklashga xos yuza bo‘lib qoladi; `ledger domain` buyrug‘ida `register` quyi buyrug‘i yo‘q.

SDK yoki foydalanuvchini qabul qilish xizmati orqali sirsiz `AliasSetupPlanRequestV1` niyatini tuzing, keyin CLI yordamida uni jonli holatga nisbatan rejalashtirib, hosil bo‘lgan aniq rejani yuboring:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Niyat `payments.universal`, uning raqamli ma’lumotlar makoni, kanonik I105 egasi, ijara muddati va joriy siyosat/haq narxi himoyasini belgilaydi. Rejalashtiruvchi yo‘nalishi — `POST /v1/aliases/setup/plan`; u qaytargan reja zanjir, vakolat, holat va oxirgi muddatga bog‘langan. Domenni olib tashlash uchun hamon [`Unregister`](/uz/blockchain/instructions.md#un-register) ishlatiladi.

Domen yaratish yoki olib tashlash uchun faol bajarish muhiti tekshiruvchisi belgilagan tegishli domen boshqaruv ruxsati kerak. Vakolat shu domenni o‘zgartirish ruxsatiga ega bo‘lsa, domen metama’lumotini [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue) bilan yangilash mumkin.

## Taira da sinab ko‘rish {#try-it-on-taira}

Ochiq Taira sinov tarmog‘ida hozir ko‘rinadigan domenlarni sanang:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Ochiq yo‘lak katalogini ma’lumotlar makoni taxalluslari bilan birga oling:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Domen mavjudligini tekshirish uchun birinchi buyruqdan foydalaning. Ma’lumotlar makoni ochiq, cheklangan yoki asosiy yo‘lakdan ortda qolganini tekshirish uchun yo‘lak katalogidan foydalaning.

Domenni sozlash haq talab qiladigan yozish amalidir. Uni Taira-da sinashdan oldin [Taira-da sinov tarmog‘i XOR aktivini olish](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bo‘limidagi yordamchini `taira_faucet_claim.py` sifatida saqlang, imzolovchini ochiq sinov mablag‘i xizmati orqali moliyalashtiring va haq metama’lumotini biriktiring:

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

Sinov tarmog‘ini takroran ishlatishda yagona domen nomi uchun niyat yarating va Taira-ning joriy siyosati hamda haq aktivi narxi himoyasidan foydalaning. Mahalliy tarmoq yoki Minamoto uchun yaratilgan rejani qayta ishlatmang.

## Boshqa subyektlar bilan munosabatlar {#relationship-to-other-entities}

Domenlar reyestr obyektlarini guruhlaydi va domen doirasidagi ma’lumot uchun nomlar makonini taqdim etadi. Aktiv ta’riflari domen bilan aniqlashtirilgan identifikatorlardan foydalanadi; so‘rovlar domenlarni ro‘yxatlash yoki muayyan domen doirasidagi obyektlarni topishi mumkin. Joriy ma’lumotlar modelida hisoblarning o‘zi domensiz, biroq hisoblar domenlarga egalik qilishi va ta’rifi domen ostida joylashgan aktivlarni saqlashi mumkin.

Shuningdek qarang:

- [Global holat](/uz/blockchain/world.md)
- [Aktivlar](/uz/blockchain/assets.md)
- [Metama’lumotlar](/uz/blockchain/metadata.md)
- [Nomlash qoidalari](/uz/reference/naming.md)
