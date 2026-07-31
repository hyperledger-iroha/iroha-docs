---
translation_locale: mn
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Интеграцийн асуудлыг шийдвэрлэх {#troubleshooting-integration-issues}

Энэ хэсгээс Iroha 3 нэгтгэл.
та эдэлж байгаа зүйл энд тодорхойлдоггүй,
бидэнтэй холбоо бариарай [Телеграм](https://t.me/hyperledgeriroha).

## Хэрэглэгчид холбож чадахгүй {#client-cannot-connect}

Хэрэглэгчийн конфигурац нь ижил төстэй чиглэлийг харуулж байна эсэхийг шалгана Torii хаяг:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Үүнд CLI хяналт шалгах, ижил файлыг тодорхой дамжуулах:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Хэрэв дундаж нь орж ирвэл Docker эсвэл Kubernetes-ийг ашиглаж, хостинг болон үйлчилгээний хаягийг
үйлчлүүлэгчийн үйл явцаас хүрэх боломжтой. `127.0.0.1` агууламжийн дотор нь
Үйлчлүүлэгч машин.

Нийтийн зориулалттай Taira шинжилгээ, гарын үсэг зурдаггүй төгсгөл тоног төхөөрөмжээр эхэлнэ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Хэрэв эдгээр захирамж `502`, TLS, DNS, эсвэл цаг хугацааны алдаа, сүлжээг засварлах
нэвтрүүлэгт хангах ёсгүй байдал эсвэл хилс хэрэгслийн дэбэглэмийг хийхээс өмнө testnet-ийн олон нийтийн төгсгөл хэсгийг хүлээх
нөөц, транзакцийн ачаалл.

## Арилжааг татгалздаг {#transactions-are-rejected}

Транзакцын ихэнх алдаа нь тодорхойлолт эсвэл зөвшөөрлийн зөрчилээс үүдэлтэй:

- Хэрэглэгчийн конфигурацынд бүртгэгдсэн дансны олон нийтийн цөм нь хувийн цөмтэй нийцэхгүй
  гарын үсэг зурахад ашиглагддаг
- бүртгэл нь эх үүсвэрт эсвэл урьдчилсан гүйлгээгээр бүртгэгдээгүй
- данс нь зардах цаг шаарддаг зөвшөөрлийн тэмдэгт эсвэл үүрэг байхгүй
  баталгаажуулагч
- домен ID мэдээллийн орон тооны шалгуургүй байх,
  `domain.dataspace`

Хэрэглээ `--output-format text` хяналт тавихдаа CLI алдааг илүү хялбар болгохын тулд команд
унших:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Судалгааны үр дүн нь хол байна {#queries-return-empty-results}

Үргэлжгүй асуултын үр дүн нь үргэлж асуултын алдааг илэрхийлдэггүй.

- объектыг бий болгох ёстой гүйлгээ хийгдсэн
- хүсэлт гаргасан домен, активын тодорхойлолтоор эсвэл дансанд ID хуулийн дагуу байдаг
- Pageation эсвэл filter нь хүлээгдсэн шугамг хориглохгүй
- үйлчлүүлэгчид өөр локалийн сүлжээ биш, төлөвлөсөн сүлжээтэй холбогдсон байна

Доменийн шалгалт хийхэд хамгийн өргөн асуултаар эхлээрэй:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Үргэлт, хязгаарлалтын урсгал эрт зогсоно {#event-or-block-streams-stop-early}

Блок, үйл явдлын урсгал жишээ нь Torii Хөдөлмөрийн түвшинд дамжуулах төгсгөлийн цэгүүд
Peer-ийг үргэлжлүүлэн ажиллуулж байна, дараа нь Timeout-тайгаар шалгаж:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Үүнд HTTP integrations, одоогийн чиглэлтэй харьцуулж
[Torii эцсийн тоонд сүүлд](/mn/reference/torii-endpoints.md).
