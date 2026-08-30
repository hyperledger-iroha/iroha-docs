---
translation_locale: mn
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 байгууламж {#install-iroha-3}

Энэ хуудас нь Iroha 3 төхөөрөмжийн сүлжээ болон `hyperledger-iroha/iroha` урсгалын өмнө ажиллах талбайг ашиглаж байгаа бинарын одоогийн монтажтын ажлын урсгалг хамардаг.

## 1.Өргөдлийн шаардлага {#_1-prerequisites}

Хамгийн түрүүнд тэдгээрийг байлгаарай:

- [rustup](https://www.rust-lang.org/tools/install), тиймээс тавигдсан `rust-toolchain.toml` хэрэгслийн сүлжээ (`1.93.1`) нь автоматжуулалтад оршино
- `git`
- Docker болон Docker Compose нь орон нутгийн олон түвшний хурдны шуурхай хөдөлгөөн

## 2. Үйлдвэрлэлийн орон замыг клоонлах {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Ажлын байр бариарай {#_3-build-the-workspace}

Бүх зүйлийг бариарай:

```bash
cargo build --workspace
```

Операторуудад төвлөрсөн жижиг бүтээн байгуулалтын хувьд зөвхөн үндсэн бинардыг оруулах:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Энэ нь `target/debug/` эсвэл `target/release/` дугаарт бичигддэг байна.

## 4. Тавигдсан хэрэгслийг шалгаарай. {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Та ихэвчлэн ашигладаг дөрвөн бинар нь:

- `iroha3d` стандартын ижил хүйстүүний даемон
- `iroha3d_taira` нь санхүүгийн Taira баталгаажуулагч шуурхайн хувьд
- `iroha` нь CLI-ийн Torii болон үйл ажиллагаа эрхлэгчдийн төгсгөлийн цэг дээр .
- `kagami` нөөц, генезисийн тэмдэг болон локалийн сүлжээний хувилбар

## 5. Локалийн сүлжээ болон Docker замыг сонгох боломжтой {#_5-optional-localnet-and-docker-path}

Одоогийн эх үүсвэрийн дэмжлэгтэй lokalnet урсгалыг Kagami бий болгодог. Энэ нь ижил төстэй конфигурац, генез артефакт, үйлчлүүлэгч конфигураци, туслах скрипт болон шалгарсан кодтой нийцсэн сонголттой Compose файл бичдэг:

- `kagami localnet` орон нутгийн өргөн зохиолд зориулсан
- `kagami docker` нь Docker Compose-ийн хувьд локалийн сүлжээний захиалгаас үүссэн

[Иргүүлэлт Iroha 3](/mn/get-started/launch-iroha.md)-ийг үргэлжлүүлээрэй.
