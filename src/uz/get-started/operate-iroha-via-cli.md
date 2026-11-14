---
translation_locale: uz
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 5fb7abd4e152ece715a8337e8ef8e75330f634d2a1b26e0c5bd8308f1f3793a9
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha 3 orqali CLI orqali harakatlaning {#operate-iroha-3-via-cli}

`iroha` binari - bu Iroha 3 uchun buyruq satri mijozi. Uni katta daftar holatini so'rash, bitimlarni taqdim etish va operator oxirgi nuqtalarini tekshirish uchun ishlating.

## 1. Oldindan ko'rsatilgan shartlar {#_1-prerequisites}

Avval mahalliy tarmoqni ishga tushiring:

- [Iroha 3](./launch-iroha.md) ishga tushirish

Quyidagi misollarda [Iroha 3-ni ishga tushirish](./launch-iroha.md)-da yaratilgan lokalnetdan hosil bo'lgan mijoz konfiguratsiyasi nazarda tutiladi:

```bash
./localnet/client.toml
```

## 2. Asosiy CLI o'rnatish {#_2-basic-cli-setup}

Eng yuqori darajadagi yordamni koʻrsating:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI ushbu yuqori darajadagi qo'mondonlik guruhlariga joylashtirilgan:

- hisoblarni o‘qish va o‘zgartirish uchun `account`
- umumiy filtrlar va sahifalashli explorer tasmalar uchun `explorer`
- tranzaksiya holati va yordamchi amallar uchun `tx`
- `ledger` uchun hisobda o'qish va yozish uchun
- triggerlarni o‘qish, yozish va bajarish uchun `trigger`
- Operator diagnostikasi uchun `ops`
- `app` uchun qo'llanma API yordamchilari
- kontrakt chaqiruvlari, viewlar va mahalliy nosozlik tahlili uchun `contract`; joylashtirish uchun `kagami contract deploy` yoki `musubi deploy`
- `tools` diagnostika va ishlab chiquvchi qo'llab-quvvatlash vositalari uchun
- ma’lumotlar makoni ta’rifini rejalash, qo‘llash va tekshirish uchun `dataspace`
- Taira diagnostikasi va hisoblarni boshlang‘ich sozlash uchun `taira`
- oflayn kodlagichlar, hisobotlar va diagnostika uchun `offline`
- Soracloud ilova platformasi yordamchilari uchun `soracloud`
- SORA Cross-Chain Protocol o‘qishlari, o‘tkazmalari va isbotlari uchun `sccp`

Tranzaksiya yuboradigan har bir buyruqqa `--fee-payer authority` kabi aniq komissiya to‘lovchisi kerak; CLI imzolashdan oldin aniq komissiyani hisoblatadi.

Inson tomonidan o'qiladigan operator ishlab chiqarishi uchun `--output-format text` va qat'iy avtomatlashtirish rejimi uchun `--machine` dan foydalaning.

## 3. Jamoat testnetini sinab ko'ring Taira {#_3-try-the-public-taira-testnet}

Mahalliy tugunni ishga tushirishdan yoki imzochi yaratishdan oldin faqat o'qish uchun ishlatiladigan Taira tekshiruvlarini sinab ko'rishingiz mumkin. Ushbu buyruqlar ommaviy Torii JSON yo'nalishlaridan foydalanadi va testnet XOR ni sarflamaydi.

Taira holatini tekshirish:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` ma’lumotlar makonidagi ochiq domenlarni ko‘rsating:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Bir nechta aktivlar tavsiflari va ularning joriy ta'minotini ko'rsating:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Agar sizda hozirgi `iroha` ikkilamchi bo'lsa, Taira diagnostik yordamchisini ishga tushiring:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

`taira.client.toml`ni faqat imzolangan buyruqlarni sinashga tayyor bo‘lganda yarating. Sozlama, faucet va dastlabki tekshiruv jarayoni uchun [SORA Nexus ma’lumotlar makonlariga ulanish](/uz/get-started/sora-nexus-dataspaces.md)ga qarang. Hisob faucet komissiya aktivi bilan moliyalashtirilmaguncha Taira tarmog‘iga yozish buyruqlarini bajarmang.

Har qanday komissiyali Taira CLI misoli uchun [Taira tarmog‘ida testnet XOR oling](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)dagi oldindan tayyorlashga asoslangan faucet jarayoni bilan imzolovchini moliyalashtiring, so‘ng balansni tekshiring:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Faucet marshruti `502` qaytarsa, kuting va qayta urining. Bu hisob kalitlarini qayta yaratish belgisi emas, ochiq testnet mavjudligi muammosidir.

Balans ko‘ringach, yozishlarni `--fee-payer authority` bilan yuboring. CLI imzolashdan oldin aniq komissiyani Taira tarmog‘ining komissiya aktivida hisoblatadi:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Reyestrning asosiy buyruqlari {#_4-basic-ledger-commands}

Barcha domenlarni roʻyxatdan oʻtkazish:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Oddiy domen yaratish deklarativ alias rejalashtiruvchidan foydalanadi; `ledger domain` buyruqida `register` kichik buyruq yo'q. `docs.universal` uchun sirsiz `AliasSetupPlanRequestV1` niyatni SDK yoki onboarding xizmati bilan tayyorlang, so'ngra uni rejalashtiring va qo'llash:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Niyat ma’lumotlar makoni ID si, kanonik ega hisobi, ijara muddati va joriy hisob himoya shartini mahkamlaydi. Rejalashtiruvchi joriy holatni tekshirib, yuboriladigan aniq atomik `EnsureAlias` rejasini qaytaradi. Himoya qiymatlarini boshqa tarmoqdan qo‘lda ko‘chirmang.

Sodda ping-transaksiya yuboring:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Oxirgi blokni oʻqing yoki blok tadbirlariga obuna boʻling:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Operatorlar qo'mondonlari {#_5-operator-commands}

Konsensus operator buyruqlariga ruxsat ro‘yxatidagi bajarish vaqti kaliti kerak. Uni `client.toml`dan tashqarida saqlang va faqat egaga ochiq faylni mutlaq yo‘li bilan bering:

```bash
: "${OPERATOR_KEY_FILE:=$PWD/secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

O'rinsiz navbat, konveyer, saylov va yo'nalish diagnostikasi:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Commit qilingan konsensus yo‘laklari va shu tugun nusxalari holati:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

Zaryaddagi konsensus parametrlari:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Keyin qayerga borish kerak? {#_6-where-to-go-next}

- [SDK qo'llanmalar](/uz/guide/tutorials/)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
- [Iroha ikkilamchilar bilan ishlash](/uz/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Manba ish nusxasidan to‘liq Markdown yordam suratini chop etish uchun bajaring:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
