---
translation_locale: uz
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Domenlar {#domains}

Domenlar — `World`da ro‘yxatdan o‘tgan nomlangan nom makonlari. Joriy Iroha 3 ma’lumotlar modelida domen ota ma’lumotlar makoni bilan aniqlashtiriladi, shuning uchun kanonik identifikator quyidagicha:

```text
domain.dataspace
```

Masalan, `payments.universal` — `universal` ma’lumotlar makonidagi `payments` domeni.

## Tuzilishi {#structure}

Ro‘yxatdan o‘tkazilgan `Domain` quyidagilarni o‘z ichiga oladi:

- `id`: ma’lumotlar makoni bilan aniqlashtirilgan `DomainId`
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

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

Niyat `payments.universal`, uning raqamli ma’lumotlar makoni, kanonik I105 egasi, ijara olish muddati va joriy siyosat/to‘lov hisobining himoya shartini belgilaydi. Rejalashtiruvchi endpoint `POST /v1/aliases/setup/plan`; u qaytargan reja zanjir, vakolat, holat va muddatga bog‘langan. Domenni olib tashlash hali ham [`Unregister`](/uz/blockchain/instructions.md#un-register)dan foydalanadi.

Domen yaratish yoki olib tashlash uchun faol bajarish muhiti tekshiruvchisi belgilagan tegishli domen boshqaruv ruxsati kerak. Vakolat shu domenni o‘zgartirish ruxsatiga ega bo‘lsa, domen metama’lumotini [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue) bilan yangilash mumkin.

## Taira da sinab ko‘rish {#try-it-on-taira}

Ochiq Taira sinov tarmog‘ida hozir ko‘rinadigan domenlarni sanang:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Ochiq yo‘lak katalogini ma’lumotlar makonlari taxalluslari bilan moslang:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Ilova domen borligini tekshirishi kerak bo‘lsa, birinchi buyruqdan foydalaning. Ma’lumotlar makoniga bog‘langan yo‘laklar, har bir yo‘lakning ochiq yoki cheklangan ko‘rinishi hamda asosiy yo‘lakka nisbatan sinxronizatsiya holatini ko‘rish uchun yo‘lak katalogidan foydalaning.

Domenni sozlash komissiyali yozish amalidir. Uni Taira tarmog‘ida sinashdan oldin [Taira tarmog‘ida testnet XOR oling](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)dagi oldindan tayyorlashga asoslangan faucet jarayoni bilan imzolovchini moliyalashtiring, so‘ng aniq komissiya to‘lovchisi bilan rejani qo‘llang. CLI imzolashdan oldin aniq komissiyani hisoblatadi:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
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
