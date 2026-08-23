---
translation_locale: mn
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хөгжлийн асуудлыг шийдвэрлэх {#troubleshooting-integration-issues}

Энэ хэсэг нь Iroha 3 -ийн интеграцын асуудал шийдэх зөвлөмжийг санал болгодог. Хэрэв та дурдаж буй асуудал энд тодорхойлсонгүй бол [Telegram](https://t.me/hyperledgeriroha)-ээр бидэнтэй холбоо бариарай.

## Клиент холбогдож чадахгүй {#client-cannot-connect}

Хэрэглэгчийн конфигурац нь ижил төстэй Torii хаяг руу чиглүүлж байгааг шалгана уу:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI хяналт шалгалтын хувьд ижил файлыг тодорхой дамжуулан:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Хэрэв хамтарч нь орж ирвэл Docker эсвэл Kubernetes, үйлчлүүлэгчийн үйл явцаас хүрэх хост эсвэл үйлчилгээний хаяг ашиглах. `127.0.0.1` контейнерийн дотор байрлах машин биш.

Олон нийтийн Taira туршилтын хувьд гарын үсэг зурсан төгсгөлийн шинжилгээгээр эхэлнэ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Хэрэв эдгээр тушаалууд `502`, TLS, DNS эсвэл цаг хугацааны дуусгалын алдаатай бол сүлжээний хүртээмжтэй байдлыг зохицуулах эсвэл бүртгэлийн товчоо болон гүйлгээний ашиг ачааллыг засварлахдаа олон нийтийн тестнэтийн төгсгөл хэсгийг хүлээх хэрэгтэй.

## Арилжаа хүлээн зөвшөөрөгдөхгүй {#transactions-are-rejected}

Транзакцын ихэнх алдаа нь танин мэдэхүйн болон зөвшөөрлийн зөрчилээс үүдэлтэй:

- Хэрэглэгчийн конфигурацынд бүртгэгдсэн дансны олон нийтийн цөм нь гарын үсэг зурахдаа ашигласан хувийн цөмтэй нийцэхгүй
- данс эх үүсвэр болон урьдчилсан гүйлгээгээр бүртгэгдээгүй
- данс нь гүйлгээний хугацааны баталгаажуулагч шаарддаг зөвшөөрлийн тэмдэгт эсвэл үүрэг байхгүй
- ID домен нь `domain.dataspace` гэх мэт мэдээллийн орон тооны шалгуургүй байна.

`--output-format text` командлыг алдааг уншихад хялбар болохын тулд CLI командтыг засварлахдаа ашигла:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Судалгааны үр дүн нь хол байна {#queries-return-empty-results}

Халуун хайлтын үр дүн нь үргэлж хайлтын алдаатай гэсэн үг биш юм.

- объект үүсэх ёстой гүйлгээ хийгдсэн
- Хэрэглэгдэж буй домен, хөрөнгийн тодорхойлолт эсвэл ID бүртгэл нь хууль ёсны байдаг.
- Pagination эсвэл filter нь хүлээсэн шугамг хориглодоггүй
- үйлчлүүлэгч нь өөр орон нутгийн сүлжээ биш, зорилтот сүлжээнд холбогдсон байна

Доменийн шалгалтыг хамгийн өргөн хүрээний асуултаар эхлүүлнэ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Үргэлтийн урсгал нь эрт зогсдог {#event-or-block-streams-stop-early}

Блок, үйл явдлын урсгалын жишээ нь Torii дамжуулах төгсгөлийн цэг дээр тулгуурлана. Хөгжлийн хөөцөлдөж байгаа эсэхийг шалгаж, дараа нь цаг хугацаатайгаар туршиж үзээрэй:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP интеграцын хувьд эцсийн цэгтийн замыг одоогийн [Torii эцсийн нөөцийн сүлжээн](/mn/reference/torii-endpoints.md)тай харьцуулаарай.
