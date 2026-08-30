---
translation_locale: mn
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Bare Metal дээр ажилладаг {#running-iroha-on-bare-metal}

Энэ ажлын урсгалыг Docker Compose -ийн оронд хост дээр шууд хамтын ажиллагаа явуулахдаа ашигла. Одоогийн эх үүсвэрийн мод нь Kagami генераторуудыг өгдөг бөгөөд энэ нь нийцсэн генезис, хамтын ажиллагааны конфигурацыуд, үйлчлүүлэгчдийн конфигурациуд болон эхлүүлэх / зогсоох скриптүүдийг бичиж болно.

## 1. Бинарын системүүдийг бариарай {#_1-build-the-binaries}

Iroha тоног төхөөрөмжийн урсгалын өмнөд хэсгээр:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Энэ нь:

- `target/release/iroha3d` өрсөлдөгч даймон
- `target/release/iroha` нь CLI
- `target/release/kagami` нөөц, генез, локалийн сүлжээний үйлдвэрлэлийн хувьд

## 2. Орон нутгийн сүлжээг бий болгох {#_2-generate-a-local-network}

Дөрвөн ижил төстэй Iroha 3 локалийн сүлжээг бий болгох:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Урьдчилгааны товчоо нь үүсгэн бүтээсэн `genesis.json`, `genesis.signed.nrt`, өрсөлдөгчийн `config.toml` файл, `client.toml`, туслах скрипт ба тухайн багцын тохирсон захирамжтай үүсгэсэн `README.md` байдаг.

## 3. Эрдэнэс залуус эхлүүлэх {#_3-start-peers}

Жинэсэн нэг удаагийн локаль сүлжээний хувьд үүсгэсэн скрипт ашиглах:

```bash
./localnet/start.sh
```

Хэрэв та systemd гэх мэт үйл явцын менежерд аль нэг дотроо дамжуулах шаардлагатай бол `./localnet/README.md` -нд бүртгэгдсэн эхлүүлэх командыг ашиглаж, тус бүрийн дотроо `config.toml`, хувийн түлхүүр, хадгаламжийн товчоо, гамшуулгыг тусдаа хадгал.

## 4. Тээврийн сүлжээг ашиглах {#_4-operate-the-network}

Хэрэглэгчийн тохируулалтыг ашиглах:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Тухайн локаль сүлжээг:

```bash
./localnet/stop.sh
```

## 5. Үйлдвэрлэлийн тэмдэглэл {#_5-production-notes}

- Үйлдвэрлэлийн зориулалтаар шинэхэн хувийн түлхүүр бий болгож, хадгаламжийн гадна хадгалж болно.
- Бүх өрсөлдөгчид ижил гарын үсэг зурсан эх үүсвэрийн гүйлгээ, топологи, итгэмжлэгдсэн өрсөлөгч, баталгаажуулагч PoPs дээр тохиролцох.
- Зөвхөн бусад машиноос дутагдахгүй бол хост-локалын интерфейс дээр сонсогчдыг байгуулж байх ёстой.
- Torii халдварын, үндсэн auth, TLS болон түвшлийн хязгаарлалтын тулд эргэн төлөөлөгч эсвэл цахилгаан дугуй ашиглана.
- Женезис болон тохиролцооны топологийн өөрчлөлтийг нэгдмэл файлын зохицуулалт биш, зөвлөлдөх шилжилт гэж үзээрэй.

Контейнерийн орон нутгийн хөгжлийн хувьд [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose ажлын урсгалыг ашиглах.
