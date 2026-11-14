---
translation_locale: mn
translation_source: /get-started/install-iroha.md
translation_source_hash: b2ba22db6a25e3b67cf18dc6959f95f57bd861b232b1d4a9d881bbe3cdf7844a
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Суурилуулна уу Iroha 3 {#install-iroha-3}

Энэ хуудас нь `hyperledger-iroha/iroha` ажлын орчныг ашиглан Iroha 3 хэрэгслийн багц ба бинаруудыг одоогийн суулгах ажлын урсгалыг хамардаг.

Хост дээр шууд суулгах бол доорх Rust зааврыг дагана. Docker ашиглан дөрвөн баталгаажуулагч ажиллуулах бол [Iroha 3-ыг эхлүүлэх](/mn/get-started/launch-iroha.md) заавраас эхэлнэ.

## 1. Урьдач нөхцөл {#_1-prerequisites}

Эдгээрийг эхлээд суулгана уу:

- [rustup](https://www.rust-lang.org/tools/install), тэгэхээр холбоотой `rust-toolchain.toml` хэрэгслийн сүлжээ (`1.99.1`) автоматаар суурилагдсан байна
- `git`
- сонголтоор, орон нутгийн олон түншийн хурдан эхлүүлэхэд Docker болон Docker Compose

## 2. Ажлын орчныг хуулбарлах {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Ажлын орчныг байгуулах {#_3-build-the-workspace}

Бүх зүйлийг барь

```bash
cargo build --workspace
```

Жижиг оператор төвтэй хувилбарын хувьд зөвхөн гол бинаруудыг эвлүүлнэ үү:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Үр дүнд гарсан хоёртын файлууд `target/debug/` эсвэл `target/release/` дээр бичигдэнэ.

## 4. Суулгасан хэрэгслүүдийг баталгаажуулна уу {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Та ерөнхийдөө ашиглах дөрвөн хоёртын файл нь:

- `iroha3d` стандарт сүлжээний хамтрагч дэвлийн хувьд
- `iroha3d_taira` ганц протокол-стандарт Taira баталгаажуулагч эхлүүлэгчийн хувьд
- Torii болон операторын төгсгөлийн цэгт CLI-ээр хандахад `iroha`
- `kagami` түлхүүрүүд, блокчэйн үүсгэл техникийн нотолгоо, болон локалнет профайлд зориулсан

## 5. Сонголтоор Localnet ба Docker Зам {#_5-optional-localnet-and-docker-path}

Одоогийн эх сурвалжаар дэмжигдсэн локалнет урсгалыг Kagami үүсгэж байна. Энэ нь сүлжээний түншийн тохиргоонууд, блокчейн генерацын бүтээлүүд, клиент тохиргоо, туслах скриптүүд, болон шалгасан кодтой таарах үүрэгтэй Compose файлыг бичдэг:

- Kagami өөрөө эхлүүлж, хянадаг удирдлагатай дотоод сүлжээнд `kagami localnet up`
- дотоод зангилааг шууд ажиллуулах скриптүүдэд `kagami localnet generate`
- `kagami docker` нь Docker Compose -аас localnet директороос үүсгээгдсэн

[Эхлүүлэх Iroha 3](/mn/get-started/launch-iroha.md) хэсгийг үргэлжлүүлнэ үү.
