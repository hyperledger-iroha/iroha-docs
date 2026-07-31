---
translation_locale: mn
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Хөдөлмөрийн Rust хэрэгжүүлэл нь гол ажлын орон нутагт оршдог бөгөөд хамгийн шууд
Хөдөлмөр эрхлэгчдийн Iroha 3 код үндсэн дээр.

## Та юу авдаг вэ? {#what-you-get}

Өргөдлийн сан нь одоогийн байдлаар:

- УИХ-ын гишүүн `iroha` Rust үйлчлүүлэгчдийн хайрцаг
- УИХ-ын гишүүн `iroha` CLI хамгийн томоохон сүлжээний үйлчлүүлэгч
- хуваалцсан мэдээллийн загвар, крипто, Norito БНХАУ-ын SDK давхар

## Сурталчилсан эхлэлийн цэг {#recommended-starting-point}

Төслийн өнөөгийн төлөв байдлын талаар CLI болон
Ажлын газар өөрөө:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Сэтгэцийн клиентийг бүртгэгдсэн үл хөдлөсөн клиентын конфигурацтайгаар ажиллуул:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Та үүнийг туршиж үзээрэй. Taira Зөвхөн уншигч {#try-taira-read-only}

Ажлын байрны төлбөрийн сангаас олон нийтэд шалгаарай Taira диагностикийн туслах:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Замын түвшинд хяналт шалгахын тулд ашиглах Torii Энэ бол JSON API шууд:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Та бүтээсэн дараа `taira.client.toml`, ижил двойник нь гарын үсэг зурсан канар ашиглаж болно
эсрэг захирамж Taira. Эдгээр нь энгийн нэгжийн туршилтаас ангижралтай байх учир
Тэдэнд цахилгаан замын санхүүжилттэй данс, амьд тест сүлжээний хүртээмж шаарддаг.

## Үүнд зориулсан Rust Хэрэглэгчийн сан {#using-the-rust-client-crate}

Хөгжүүлнэ Iroha Таны сүлжээний Git-ийн шинэчлэл:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Хэрэв та хамгийн томоохон жишээг Rust гадаргуудыг ашигладаг
Тэмцэл, хяналт:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Номын сангийн удирдлагатай хадгаламжийн ажлын урсгал, үзнэ үү
[Үндэсний хөрөнгийн хяналт](/mn/blockchain/escrow.md#rust-sdk). Хөдөлмөрийн Rust мэдээллийн загвар
зах зээлийн хадгаламжийн зах зээлд хамгийн бүрэн түгээмэл хамрагдалтай
Ашигт малтмалын замбараагүй, нууцлан хадгалах, асуултууд, үйл явдал.

Та орон нутгийг сэргээж болно CLI туслах хүйтэн зураг:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Хэвлэл {#notes}

- Хөдөлмөрийн CLI Одоогийн байдлаар тусгаар тогтносон хайрцаг документой харьцуулахад илүү сайн хамгааллыг хангаж байна.
- Үйлчлүүлэгчдийн хэв маягийн урсгал CLI баримт бичиг хамгийн сүүлийн үеийн эх үүсвэр юм.
