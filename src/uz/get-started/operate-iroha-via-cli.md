---
translation_locale: uz
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: ab8f3bf6d2259dc1ea649273e695429a992108b936475b263fe9d1fae59e8766
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 orqali CLI orqali harakatlaning {#operate-iroha-3-via-cli}

`iroha` binari - bu Iroha 3 uchun buyruq satri mijozi. Uni katta daftar holatini so'rash, bitimlarni taqdim etish va operator oxirgi nuqtalarini tekshirish uchun ishlating.

## 1. Oldindan ko'rsatilgan shartlar {#_1-prerequisites}

Avval mahalliy tarmoqni ishga tushiring:

- [Iroha 3](./launch-iroha.md) ishga tushirish

Quyidagi misollarda [Launch Iroha 3](./launch-iroha.md)-da yaratilgan lokalnetdan hosil bo'lgan mijoz konfiguratsiyasi nazarda tutiladi:

```bash
./localnet/client.toml
```

## 2. Asosiy CLI o'rnatish {#_2-basic-cli-setup}

Eng yuqori darajadagi yordamni koʻrsating:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI ushbu yuqori darajadagi qo'mondonlik guruhlariga joylashtirilgan:

- `account` hisob-kitobga yo'naltirilgan qisqartmalar uchun
- `tx` tranzaksiya darajasida yordamchilar uchun
- `ledger` uchun hisobda o'qish va yozish uchun
- Operator diagnostikasi uchun `ops`
- `app` uchun qo'llanma API yordamchilari
- `contract` shartnomalarni ishga tushirish va qo'ng'iroqlar uchun
- `tools` diagnostika va ishlab chiquvchi qo'llab-quvvatlash vositalari uchun
- `taira` uchun Taira va Nexus-maqsadli ish oqimlari

`ledger` guruhi, shuningdek, `ledger transaction` kabi domenga oid tranzaksiya yordamchilari ham mavjud.

Inson tomonidan o'qiladigan operator ishlab chiqarishi uchun `--output-format text` va qat'iy avtomatlashtirish rejimi uchun `--machine` dan foydalaning.

## 3. Jamoat testnetini sinab ko'ring Taira {#_3-try-the-public-taira-testnet}

Mahalliy tengdoshni ishga tushirishdan yoki imzochi yaratishdan oldin faqat o'qish uchun ishlatiladigan Taira tekshiruvlarini sinab ko'rishingiz mumkin. Ushbu buyruqlar ommaviy Torii JSON yo'nalishlaridan foydalanadi va testnet XOR ni sarflamaydi.

Taira holatini tekshirish:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` ma'lumotlar maydonida ommaviy domenlarni ro'yxatdan o'tkazish:

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

Yaratish `taira.client.toml` Faqat imzolangan buyruqlarni sinab ko'rish uchun tayyor bo'lganingizda. [Bogʻlanish SORA Nexus Ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md) Config, faucet va kanary oqimi uchun. Taira hisobvaraq kran to'lov aktividan mablag' bilan ta'minlanguniga qadar.

Har qanday haq to'lash uchun Taira CLI Misol uchun, kran yordamchisini saqlash [Testnetni olish XOR bilan Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) koʻrsatilgan `taira_faucet_claim.py`, so'ngra talabnoma testnet XOR Birinchidan:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Agar kran puzzli yoki talabnoma yo'nalishi `502` qaytarsa, kuting va yana sinab ko'ring. Bu testnetning ochiq mavjudligi muammosi, hisob kalitlarini qayta tiklash uchun signal emasdir.

Saldo ko'rinadigan bo'lganidan so'ng, to'lov aktivlari metadatalarini quyidagicha yozish uchun ilova qiling:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Asosiy Ledger buyruqlari {#_4-basic-ledger-commands}

Barcha domenlarni roʻyxatdan oʻtkazish:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Oddiy domen yaratish deklarativ alias rejalashtiruvchidan foydalanadi; `ledger domain` buyruqida `register` kichik buyruq yo'q. `docs.universal` uchun sirsiz `AliasSetupPlanRequestV1` niyatni SDK yoki onboarding xizmati bilan tayyorlang, so'ngra uni rejalashtiring va qo'llash:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Niyat pinslar ma'lumotlar maydoni ID, kanonik egasi hisob raqami, ijara muddati va joriy quote himoya. rejalashtiruvchi jonli holatni tekshiradi va taqdim etish uchun aniq atom `EnsureAlias` rejasini qaytarib beradi. Boshqa tarmoqdan qo'l nusxasi saqlanish qiymatlari emas.

Sodda ping-transaksiya yuboring:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Oxirgi blokni oʻqing yoki blok tadbirlariga obuna boʻling:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Operatorlar qo'mondonlari {#_5-operator-commands}

Konsensus holati:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Fazalar boʻyicha kechiktirilganlik fotosurati:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Bo'lish imkoniyati, to'plamchi, RBC orqa tomoni va VRF tezkor fotosurati:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Zaryaddagi konsensus parametrlari:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Keyin qayerga borish kerak? {#_6-where-to-go-next}

- [SDK qo'llanmalar](/uz/guide/tutorials/)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
- [Iroha ikkilamchilar bilan ishlash](/uz/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Manba hisobidan to'liq Markdown yordam fotosuratini qayta tiklash uchun quyidagilarni ishga tushiring:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
