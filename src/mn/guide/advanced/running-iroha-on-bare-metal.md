---
translation_locale: mn
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Босоо металл дээр Iroha ажиллах {#running-iroha-on-bare-metal}

Сүлжээний хамтрагчдыг Docker Compose-ын дамжуулалгүйгээр шууд хост дээр ажиллуулахыг хүсэж байвал энэ ажлын урсгалыг ашиглана уу. Одоогийн эх сурвалжийн мод нь тохирох блокчэйн genesis, сүлжээний хамтрагчдын тохиргоо, клиент тохиргоо, эхлэх/зогсоох скриптийг бичдэг Kagami генераторуудыг өгдөг.

## 1. Бинар файлуудыг бүтээх {#_1-build-the-binaries}

Эх үүсвэр Iroha ажлын талбараас:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Үүний үр дүнд:

- `target/release/iroha3d` сүлжээний хөрш даэмон-д зориулсан
- `target/release/iroha` нь CLI-д зориулсан
- `target/release/kagami` түлхүүр, блокчэйн үүсэл, ба localnet үүсгэхэд

## 2. Орон нутгийн сүлжээ үүсгэх {#_2-generate-a-local-network}

Дөрвөн хөрштэй Iroha 3 localnet үүсгээрэй:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Гаралт директор нь үүсгэсэн `genesis.json`, `genesis.signed.nrt`, сүлжээний түнш `config.toml` файлууд, `client.toml`, туслах скриптүүд, болон тухайн багцад зориулсан яг командуудтай үүсгэгдсэн `README.md`-ийг агуулна.

## 3. Сүлжээний хөршүүдийг эхлүүлэх {#_3-start-peers}

Үүсгэсэн түр ашиглах локаль сүлжээний хувьд, үүсгэсэн скриптийг ашиглана:

```bash
./localnet/start.sh
```

Хэрэв танд сүлжээний тус бүрийн түншийг systemd гэх процесс менежер рүү холбох шаардлагатай бол сүлжээний тус бүрийн түншийн хувьд `./localnet/README.md`-д бичигдсэн эхлүүлэх командыг ашигла. Сүлжээний тус бүрийн түншийн `config.toml`, хувийн түлхүүр, хадгалах хавтас, портуудыг тусгаарлаж байлга.

## 4. Сүлжээг ажиллуулах {#_4-operate-the-network}

Үүсгэсэн клиент тохиргоог ашигла:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Дараах командыг ашиглан үүсгэсэн локалнетийг зогсооно:

```bash
./localnet/stop.sh
```

## 5. Үйлдвэрлэлийн тэмдэглэл {#_5-production-notes}

- Үйлдвэрлэлийн зориулалттай шинэ хувийн түлхүүр үүсгээд тэдгээрийг репозиторийн гадна хадгал.
- Зангилаа бүр ижил гарын үсэгтэй genesis гүйлгээ, топологи, итгэмжлэгдсэн зангилаа болон баталгаажуулагчийн PoPs-ийг ашиглаж буйг баталгаажуулах.
- Сүлжээний оролцогч бусад машинуудаас хүрч болохгүй үед л хураагуурын сонсогчийн хаягийг зөвхөн локаль интерфэйсүүдэд холбож бай.
- Torii-ийн нийтийн хандалт, үндсэн баталгаажуулалт, TLS ба давтамжийн хязгаарт урвуу прокси эсвэл галт хана ашиглах.
- Блокчэйн үүслийн эсвэл консенсусын топологийн өөрчлөлтийг нэг компьютерт файл засварлах биш, зохион байгуулалттай шилжилт гэж үз.

Савласан локал хөгжүүлэлтийн хувьд [Эхлүүлэх Iroha 3](../../get-started/launch-iroha.md) Docker Compose ажлын урсгалыг ашигла.
