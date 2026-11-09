---
translation_locale: mn
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Байнариудтай ажиллах {#working-with-iroha-binaries}

Тэр Iroha 3 операторын ажлын урсгал дөрвөн үндсэн хоёртын системийн эргэн тойронд эргэлддэг:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) сүлжээний ижил түвшнийDaemon ажиллуулахад
- `iroha3d_taira` ганц протокол-стандарт Taira баталгаажуулагч эхлүүлэгчийн хувьд
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) ийн тулд CLI ба операторын командууд
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) түлхүүрүүд, блокчейн генезис, локалнетүүд, ба профайлууд

## Эх сурвалжаас барих {#build-from-source}

Дээд урсгалын ажлын орчны үндэснээс:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Нээлтийн бинар файлууд дараа нь `target/release/` дээр байрлах болно.

Командын самбарыг шалгахын тулд:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Сангаас шууд ажиллуул {#run-directly-from-the-repository}

Хэрэв та ямар нэг зүйлийг дэлхий даяар суулгахыг хүсэхгүй бол `cargo run` ашиглаарай:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Зураг {#docker-image}

Нэг эх кодын хувилбараас бүтээсэн хоёртын файлуудаар Docker дээр дөрвөн баталгаажуулагч ажиллуулахдаа [Эхлүүлэх Iroha 3](/mn/get-started/launch-iroha.md) зааврыг дагана уу.

## Али binary-г ашиглах ёстой вэ? {#which-binary-should-i-use}

- Нийт олон Taira батлагчийн хувилбараас гадуур сүлжээний хамтрагчийг эхлүүлэх буюу ажиллуулах үед `iroha3d`-ыг ашиглана уу.
- `iroha3d_taira --sora`-г зөвхөн каноник Taira баталгаажуулагч байршуулалтад ашиглана; энэ нь Taira-ийн сүлжээ, хадгалалт болон гүйцэтгэх орчны гарын үсэг зурагчийн профайлыг мөрдүүлнэ.
- Blockchain бүртгэлийн түүхийг асууж, гүйлгээ явуулах эсвэл операторын API төгсгөлүүдийг шалгах хэрэгтэй бол `iroha`-ыг ашиглана уу.
- Түлхүүр, блокчэйн genesis техникийн баримт бичиг, профайл багц, эсвэл localnet хөрөнгүүд хэрэгтэй бол `kagami` ашиглана уу.
