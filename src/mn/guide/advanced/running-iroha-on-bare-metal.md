---
translation_locale: mn
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Уурхай явна Iroha Bare Metal дээр {#running-iroha-on-bare-metal}

Энэ ажлын урсгалыг хост дээр шууд хамтын ажиллагаа явуулахын оронд ашигла
дамжуулан Docker Compose. Одоогийн эх үүсвэрийн мод нь Kagami үйлдвэрлэгч
зохицох генезис, дундаж config, клиентын config, start/stop скрипт бичнэ.

## 1. Бинариудыг бариарай {#_1-build-the-binaries}

Өвөр замаар Iroha Ажлын газар:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Энэ нь:

- `target/release/irohad` Эрдэнэт даймон
- `target/release/iroha` . CLI
- `target/release/kagami` түлхүүр, генез болон локаль сүлжээний үйлдвэрлэл

## 2. Орон нутгийн сүлжээг бий болгох {#_2-generate-a-local-network}

Дөрвөн тамирч бий болгох Iroha 3 орон нутгийн сүлжээ

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Эрдөөний сүлжээнд үүсгэсэн `genesis.json`,
`genesis.signed.nrt`, өрсөлдөгч `config.toml` файл, `client.toml`, туслах зохиол,
болон үүссэн `README.md` Тухайн бандлын тод командтай.

## 3. Эрдэнэс нар {#_3-start-peers}

Жинэсэн нэг удаагийн локаль сүлжээний хувьд үүсгэсэн скриптийг ашигла:

```bash
./localnet/start.sh
```

Хэрэв та аливаа хамтын ажиллагааг процессийн менежерээр дамжуулах шаардлагатай бол systemd, ашиглах
Нэвтрүүлгийн команд `./localnet/README.md` Нэгэнт нэг нь үлдээе.
Эдгээрийн `config.toml`, Хувийн ач холбогдол, хадгаламжийн товчоо, галт тэрэгний нэвтрүүлэг.

## 4. Тээврийн сүлжээг ашиглах {#_4-operate-the-network}

Хэрэглэгчийн тохируулалтыг ашигла:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Тулгарсан локаль сүлжээг:

```bash
./localnet/stop.sh
```

## 5. Үйлдвэрлэлийн тэмдэглэл {#_5-production-notes}

- Үйлдвэрлэлийн зориулалттай шинэхэн хувийн түлхүүр бий болгож,
  хадгаламж.
- Бүх эрдэмтэд ижил гарын үсэг зурсан эх үүсвэрийн гүйлгээ, топологи,
  Итгэмжлэгдсэн хамтрагч, баталгаажуулах PoPs.
- Хөгжимчийн хаяг нь хост-хост интерфейсэд зөвхөн ижил төстэй байх үед л холбоно
  бусад машиноос хүрэх боломжгүй.
- Үүнээс өөр арга хэмжээ авах . Torii халдвар, үндсэн авт TLS, болон түвшин
  хязгаарлагдмал.
- Женезис болон консенсусийн топологийн өөрчлөлтийг зохицуулсан шилжилт гэж үздэг, биш
  Нэг дугаартай файлыг зохицуулах.

Контейнерт байрлах орон нутгийн хөгжлийн тулд [Нэвтрүүлэг Iroha 3](../../get-started/launch-iroha.md)
Docker Compose ажлын урсгал.
