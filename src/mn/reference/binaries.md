---
translation_locale: mn
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хөдөлмөр эрхлэгч Iroha Дүйцэтгэл {#working-with-iroha-binaries}

Хөдөлмөрийн Iroha 3 операторгийн ажлын урсгал гурван үндсэн бинар дээр эргэлздэг:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) "Дэрслэг" дэймоныг удирдах
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) . CLI үйлдвэрийн команд
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) түлхүүр, эх үүсвэр, орон нутгийн сүлжээ болон хувилбар

## Эх сурвалжаас бариарай {#build-from-source}

Хөдөлмөрийн орон зайн доорх түлшээс:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Дараа нь дугаарлалтын бинар нь `target/release/`.

Захиргааны давхаргыг шалгах:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Тодруулгын сангаас шууд ажиллуулж байна {#run-directly-from-the-repository}

Хэрэв та дэлхийн хэмжээнд юу ч байршуулахыг хүсэхгүй бол `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Зураг {#docker-image}

Өндөр урсгалт ажлын байр ашигладаг `kagami localnet` болон `kagami docker` үйлдвэрлэх
Docker Compose Хяналт шалгагдсан кодтой нийцсэн файлууд `hyperledger/iroha:dev`
зураг нь үүсгэсэн файлуудын хамт ашиглах боломжтой.

Хөдөлмөрийг ажиллуулах CLI агууламжид:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Уурхай. Kagami агууламжид:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Хөгжлийн эхлүүлэхэд локаль сүлжээг үүсгэн, хамгийн түрүүнд файлыг бүрдүүлээрэй:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## -Хайн дундаж валютыг ашиглах вэ? {#which-binary-should-i-use}

- Хэрэглээ `irohad` та нар хамтын ажиллагааг эхлүүлж, ашиглаж байгаа үед
- Хэрэглээ `iroha` томоохон бүртгэлээс асуух, гүйлгээ хийх, операторын төгсгөл хэсгийг шалгах шаардлагатай үед.
- Хэрэглээ `kagami` Хэрэв та ачкыч, эх үүсвэрийн тэмдэгт, профилийн багц эсвэл локаль сүлжээний хөрөнгө хэрэгтэй бол.
