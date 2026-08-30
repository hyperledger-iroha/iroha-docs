---
translation_locale: mn
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha бинартай ажиллах {#working-with-iroha-binaries}

Iroha 3 операторын ажлын урсгал дөрвөн үндсэн бинар дээр эргэн тойронд эргэж байна:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) зэрэглэлийн даемон ажиллуулахын тулд
- `iroha3d_taira` нь санхүүгийн Taira баталгаажуулагч шуурхайн хувьд
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) нь CLI болон үйлдвэрийн захиргааны хувьд
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) нөөц, үүсэл, орон нутгийн сүлжээ, профилийн хувьд

## Барилгын эх үүсвэрээс бариарай {#build-from-source}

Хөдөлмөрийн талбайны түлхнээс:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Дараа нь `target/release/` хэлбэрээр нээлттэй хувилбарыг гаргах боломжтой.

Захиргааны давхаргыг шалгахын тулд:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Тодруулгын сангаас шууд ажиллуулна {#run-directly-from-the-repository}

Хэрэв та дэлхийн хэмжээнд юуг ч байрлуулахыг хүсэхгүй байгаа бол `cargo run` -ийг ашигла:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Зураг {#docker-image}

Өндөр урсгалын ажлын орон зай нь `kagami localnet` болон `kagami docker`-ийг ашиглаж, шалгарсан кодтой нийцсэн Docker Compose файлуудыг бий болгодог. `hyperledger/iroha:dev` зургийг эдгээр үүсгэсэн файлуудад ашиглах боломжтой.

CLI -ийг контейнерийн дотор хэрэглэх:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami нь контейнерд хэрэглэнэ:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Хөгжлийн эхлүүлэхэд, локалийн сүлжээг үүсгэн байгуулж, хамгийн түрүүнд файлыг бүрдүүлээрэй:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## -Хайн дундаж хэлбэрийг ашиглах вэ? {#which-binary-should-i-use}

- Олон нийтийн Taira баталгаажуулагчны нэвтрүүлэгээс гадуур ижил хүйстнийг эхлүүлэх эсвэл ашиглахдаа `iroha3d` ашигла.
- Taira баталгаажуулагчаар ашиглах зөвхөн `iroha3d_taira --sora`; энэ нь Taira-ийн зангил, хадгаламж, гүйлгээний хугацааны гарын үсэг зурагч профилийг хэрэгжүүлнэ.
- `iroha` -ийг ашиглаж, томоохон бүртгэлээс асуух, гүйлгээ хийх эсвэл операторын төгсгөл хэсгийг шалгах шаардлагатай үед хэрэглэж болно.
- `kagami` нэгийг хэрэглэнэ, генезис манифест, профилийн багц, эсвэл локаль сүлжээний хөрөнгийг хэрэгтэй үед.
