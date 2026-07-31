---
translation_locale: uz
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operatsiya qilish Iroha 3 orqali CLI {#operate-iroha-3-via-cli}

O ' zbekiston Respublikasi `iroha` binar - bu buyruq satridagi mijoz Iroha 3. Soʻrov uchun ishlatish
katta qog'ozlarni qayd etish, tranzaksiyalarni taqdim etish va operatorning oxirgi nuqtalarini tekshirish.

## 1. Kerak-sharoitlar {#_1-prerequisites}

Avval mahalliy tarmoqni ishga tushiring:

- [Uchratish Iroha 3](./launch-iroha.md)

Quyida keltirilgan misollarda lokalnetdan hosil qilingan mijoz konfiguratsiyasi koʻrsatilgan .
yaratilgan [Uchratish Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Asosiy CLI Oʻrnatish {#_2-basic-cli-setup}

Eng yuqori darajadagi yordamni koʻrsating:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

O ' zbekiston Respublikasi CLI yuqori darajadagi qo'mondonlar guruhlariga tashkil etiladi:

- `account` hisob-kitobga yo'naltirilgan qisqartmalar uchun
- `tx` Transaksiya darajasidagi yordamchilar uchun
- `ledger` koʻrsatkichlarni oʻqib yozish uchun
- `ops` operator diagnostikasi uchun
- `app` ilova uchun API yordamchilar
- `contract` kontraktlarni ishga tushirish va qo'ng'iroqlar uchun
- `tools` diagnostika va ishlab chiquvchi qo'llab-quvvatlash vositalari uchun
- `taira` uchun Taira va Nexus-maqsadli ish oqimlari

O ' zbekiston Respublikasi `ledger` guruhda domenga oid tranzaksiya yordamchilari ham mavjud:
`ledger transaction`.

Foydalanish `--output-format text` inson tomonidan o'qiladigan operator ishlab chiqarishi uchun va `--machine`
qat'iy avtomatlashtirish rejimi uchun.

## 3. Jamoatchilikni sinab ko'ring Taira Sinov tarmoqlari {#_3-try-the-public-taira-testnet}

Siz faqat oʻqish bilan sinab koʻrishingiz mumkin Taira mahalliy tengdoshni ishga tushirishdan yoki
Ushbu buyruqlar ommaviy foydalanish uchun Torii JSON yo'nalishlar va testnet sarflash emas
XOR.

Tekshirish Taira sog'liqni saqlash:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

O ' zbekiston Respublikasida davlat domenlarini ro ' yxatga olish `universal` ma'lumotlar maydonlari:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Bir nechta aktivlarning ta'riflari va ularning joriy takliflarini ko'rsatish:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Agar sizda joriy bo'lsa `iroha` ikkilamchi, ishga tushirish Taira diagnostika yordamchisi:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

yaratish `taira.client.toml` Faqat imzolangan buyruqlarni sinab ko'rishga tayyor bo'lganingizda.
Koʻring [Bogʻlanish SORA Nexus Ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md)
Konfig, kran va kanari oqimi uchun.
Taira hisobvaraq kran to'lov aktividan mablag' bilan ta'minlanguniga qadar.

Har qanday haq to'lash uchun Taira CLI misol uchun, kran yordamchisini saqlab qolish
[Testnetni olish XOR to ' g'risida Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
sifatida `taira_faucet_claim.py`, so'ngra talabnoma testnet XOR Birinchidan:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Agar kran puzzli yoki talabnoma yo'nalishi qaytarib kelsa `502`, kutib turing va yana sinab ko'ring.
ommaviy testnet mavjudligi muammosi, hisob kalitlarini qayta tiklash uchun signal emas.

Saldo ko'rinadigan bo'lganidan so'ng, to'lov aktivlari metadatalarini quyidagicha yozish uchun ilova qiling:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Asosiy Ledger buyruqlari {#_4-basic-ledger-commands}

Hamma domenlarni roʻyxatdan oʻtkazish:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Oddiy domen yaratish deklarativ alias rejalashtiruvchini ishlatadi; `ledger
domain` buyruq yoʻq `register` Qo'shinchi, sirsiz qo'shini tayyorlang.
`AliasSetupPlanRequestV1` maqsad uchun `docs.universal` bilan SDK yoki
Onboarding xizmati, so'ngra uni rejalashtirish va qo'llash:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Maqsadlar ma'lumotlar maydonini pin qiladi ID, kanonik mulkdor hisob raqami, ijara muddati va
rejalashtiruvchi jonli holatni tekshiradi va to'g'ri
atom `EnsureAlias` Qo'riqchi qiymatlarini boshqalardan nusxa ko'chirmang.
tarmoq.

Sodda ping-transaksiya yuboring:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Yaqinda boʻlgan blokni oʻqing yoki blok tadbirlariga obuna boʻling:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Operator qo'mondonlari {#_5-operator-commands}

Konsensus holati:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Faza boʻyicha kechikish vaqtini koʻrish:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

mavjudligi, to'plamchi, RBC orqaga chiqish va VRF tezkor surat:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Zaryaddagi konsensus parametrlari:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Keyingi qadamlar {#_6-where-to-go-next}

- [SDK ta'limotlar](/uz/guide/tutorials/)
- [Torii oxirgi nuqtalar](/uz/reference/torii-endpoints.md)
- [bilan ishlash Iroha ikkilamchi](/uz/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Foydalanuvchi kassatdan to'liq Markdown yordam fotosuratini qayta tiklash uchun quyidagilarni ishga tushiring:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
