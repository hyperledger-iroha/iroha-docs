---
translation_locale: mn
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha бинартай ажиллах {#working-with-iroha-binaries}

Iroha 3 операторын ажлын урсгал гурван үндсэн бинар дээр эргэн тойрч байна:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) зэрэглэлийн даемон ажиллуулахын тулд
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) нь CLI болон үйлдвэрийн захиргааны хувьд
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) нөөц, үүсэл, орон нутгийн сүлжээ, профилийн хувьд

## Барилгын эх үүсвэрээс бариарай {#build-from-source}

Хөдөлмөрийн талбайны түлхнээс:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Дараа нь `target/release/` хэлбэрээр нээлттэй хувилбарыг гаргах боломжтой.

Захиргааны давхаргыг шалгахын тулд:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Тодруулгын сангаас шууд ажиллуулна {#run-directly-from-the-repository}

Хэрэв та дэлхийн хэмжээнд юуг ч байрлуулахыг хүсэхгүй байгаа бол `cargo run` -ийг ашигла:

```bash
cargo run --bin irohad -- --help
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
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## -Хайн дундаж хэлбэрийг ашиглах вэ? {#which-binary-should-i-use}

- Хөдөлмөрийг эхлүүлэх, ашиглах үед `irohad` хэрэглэж болно.
- `iroha` -ийг ашиглаж, томоохон бүртгэлээс асуух, гүйлгээ хийх эсвэл операторын төгсгөл хэсгийг шалгах шаардлагатай үед хэрэглэж болно.
- `kagami` нэгийг хэрэглэнэ, генезис манифест, профилийн багц, эсвэл локаль сүлжээний хөрөнгийг хэрэгтэй үед.
