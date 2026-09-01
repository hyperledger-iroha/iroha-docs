---
translation_locale: mn
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

Rust хэрэгжилт гол ажлын орчинд байрладаг бөгөөд Iroha 3 кодын сан дээр ажиллах хамгийн шууд арга хэвээр байна.

## Та юу авах вэ {#what-you-get}

Эх үүсвэрийн агуулах одоогоор ил тавигдаж байна:

- төрөл `iroha` Rust клиентийн програм хангамжийн багц
- `iroha` CLI-ыг хамгийн бүрэн гүйцэт лавлах хэрэглэгчээр
- хуваалцсан өгөгдлийн модель, крипто, болон Norito программ хангамжийн багцуудыг SDK давхарга ашигладаг

## Зөвлөсөн эхлэх цэг {#recommended-starting-point}

Төслийн одоогийн байдалд зориулж, эхлээд лавлагаа CLI болон ажлын орчныг өөрийг нь ашиглаарай:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Багцалсан анхны тохиргоотой лавлах үйлчлүүлэгчийг ажиллуулна уу:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Оролдоно уу Taira Зөвхөн унших {#try-taira-read-only}

Ижил ажлын орон зайнаас шалгаж, олон нийтийн Taira оношлогооны туслах программыг туршиж үзнэ үү:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Замын түвшний шалгалтуудын хувьд Torii-ийн JSON API-ийг шууд ашиглана уу:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Та `taira.client.toml`-г үүсгэсэнээс хойш, ижил бинар файл Taira-д гарын үсэгтэй канаар команд ажиллуулж чадна. Эдгээрийг энгийн нэгж тестээс тусгаар байлгаарай, учир нь тэд тестнетээр санхүүжүүлсэн данс болон амьд тестнетийн боломж шаарддаг.

## Rust Клиентын програм хангамжийн багцыг ашиглах {#using-the-rust-client-crate}

Таны сүлжээнд ашигласан Iroha Git хувилбарыг тогтооно уу:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Хэрэв та Rust гадаргууг практикт хэрхэн ашигладаг тухай хамгийн бүрэн гүйцэд жишээнүүдийг хэрэгтэй бол бол дараахыг шалгаарай:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Блокчейн бүртгэлийн зуучлалын ажиллаж буй урсгалын хувьд, [Уугуул хөрөнгийн хадгаламж](/mn/blockchain/escrow.md#rust-sdk)-ыг үзнэ үү. Одоогоор Rust өгөгдлийн загвар нь зах зээлийн зуучлал, ерөнхий хөрөнгийн түгжээг, нэргүй зуучлал, лавлагаа, болон үүрэг арга хэмжээний хамгийн бүрэн төрөлтэй хамрах хүрээтэй байдаг.

Та орон нутгийн CLI тусламжийн цаг үеийн өгөгдлийн харагдацыг дараах байдлаар дахин үүсгэж болно:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Тэмдэглэл {#notes}

- Одоогийн CLI тусдаа програм хангамжийн багцын баримт бичгээс илүү сайн хамрах хүрээг үзүүлж байна.
- Оператор маягийн урсгалуудад, CLI баримт бичиг нь хамгийн сүүлийн үеийн эх сурвалж юм.
