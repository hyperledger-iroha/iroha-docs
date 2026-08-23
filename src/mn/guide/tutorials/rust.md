---
translation_locale: mn
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust хэрэгжилт үндсэн ажлын орон нутагт оршин тогтнож байгаа бөгөөд Iroha 3 кодын үндэслэлтэй ажиллах хамгийн шууд арга зам хэвээр байна.

## Та юу авдаг вэ? {#what-you-get}

Үндэсний эргэлтийн хадгаламж одоогийн байдлаар:

- `iroha` Rust үйлчлүүлэгчдийн сан
- `iroha` CLI нь хамгийн бүрэн дурдах үйлчлүүлэгч юм
- Хамтарсан мэдээллийн загвар, крипто, Norito хуудас нь SDK давхар ашигладаг

## Сурталчилгааны эхлэл {#recommended-starting-point}

Төслийн өнөөгийн төлөв байдлын талаар CLI нэвтрүүлэг болон ажлын байрны тухай өгүүллээр эхлээд:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Сэргээлийн клиентийг бүртгүүлсэн загвар өмсөгчийн конфигурацтайгаар ажиллуул:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Taira уншигчдаа л үзээрэй {#try-taira-read-only}

Ажлын байрны мөн адил санхүүжилтээс Taira олон нийтийн оношилгооны туслалцааг үзээрэй:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Замын түвшинд хяналт шалгахын тулд Torii-ийн JSON API хэсгийг шууд ашигла:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Та `taira.client.toml` бүтээсний дараа ижил бинар нь Taira -ийн эсрэг гарын үсэг зурсан канар команд ажиллуулж болно. Тэдгээрийг энгийн нэгжийн туршилтээс тусгаарлан байлгаарай, учир нь тэдгээр нь крантаар санхүүжүүлсэн данс болон амьд туршилтын сүлжээний хүртээмжийг шаардаж байна.

## Rust үйлчлүүлэгчний хайрцаг ашиглах {#using-the-rust-client-crate}

Таны сүлжээ ашиглаж буй Iroha Git-ийн шинэчлэлийг байлгаарай:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Хэрэв та Rust гадаргуудыг практикт хэрхэн ашиглах талаар хамгийн бүрэн жишээ авахыг хүсвэл:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Тогтлан бодох бүртгэлийн хяналтын хадгаламжийн ажлын урсгалын талаар [Төгс хөрөнгийн хадгаламж](/mn/blockchain/escrow.md#rust-sdk)-ийг үзнэ үү. Rust мэдээллийн загварын хувьд зах зээлийн хадгаламжил, нийтлэг хөрөнгийн буудалд, нууц хадгаламжид, асуултууд, үйл явдлуудад хамгийн бүрэн багтаж байна.

Та орон нутгийн CLI туслалцааны снэп-шоутыг:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Мэдээлэл тэмдэглэл {#notes}

- CLI нь одоогоор бие даасан сангийн баримтаас илүү сайн хамгааллыг хангаж байна.
- Үйл ажиллагаа эрхлэгчдийн хэв маягийн урсгалын хувьд CLI баримт бичиг хамгийн сүүлийн үеийн эх үүсвэр юм.
