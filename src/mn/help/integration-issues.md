---
translation_locale: mn
translation_source: /help/integration-issues.md
translation_source_hash: 2146a236adb3a3b3b896a1992daeecf6713988183ca53e4412f9b616ed2e9085
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Интеграцийн асуудлыг шийдвэрлэх {#troubleshooting-integration-issues}

Энэ хэсэг нь Iroha 3 интеграцтай холбоотой асуудлыг шийдвэрлэх зөвлөмжийг санал болгодог. Хэрэв та тулгарч буй асуудал энд тайлбарлагдаагүй бол бидэнтэй [Телеграм](https://t.me/hyperledgeriroha) хаягаар холбоо барина уу.

## Клиент холбогдож чадахгүй байна {#client-cannot-connect}

Клиентын тохиргоо сүлжээний холбоотны Torii хаяг руу зааж байгааг шалгана уу:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Файл CLI шалгалтанд зориулж, ижил файлыг тодорхой зааж өг:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Хэрэв сүлжээний хамтрагч Docker эсвэл Kubernetes дээр ажиллаж байвал, клиент процессоос хүрч болох хост эсвэл үйлчилгээний хаягийг ашиглана уу. Савны дотор байгаа `127.0.0.1` нь хост машин биш юм.

Нийтэд нээлттэй Taira туршилтыг гарын үсэггүй төгсгөлийн цэгийн шалгалтаас эхэлнэ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Эдгээр команд `502`, TLS, DNS эсвэл хугацаа хэтэрсэн алдаа гаргавал дансны түлхүүр, гүйлгээний агуулгыг шалгахаас өмнө сүлжээний холболтыг засах эсвэл нийтэд нээлттэй туршилтын төгсгөлийн цэгийг хүлээнэ.

## Гүйлгээүүд татгалзагдана {#transactions-are-rejected}

Гүйлгээний ихэнх алдаа нь таних мэдээлэл эсвэл зөвшөөрөл зөрснөөс үүддэг:

- клиентийн тохиргооны дансны олон нийтэд зориулсан түлхүүр нь гарын үсэг зурахад ашиглагдсан нууц түлхүүртэй таарахгүй байна
- тогтмол бүртгэл нь блокчэйн дээд эхлэлд эсвэл өмнөх гүйлгээгээр бүртгэгдээгүй байна
- тэнцвэржүүлэгч програмын гүйцэтгэлийн орчны шаарддаг зөвшөөрлийн токен эсвэл үүрэг бүртгэлд байхгүй байна
- домэйны ID-д `domain.dataspace` зэрэг өгөгдлийн орон зайгаар бүрэн тодорхойлох хэсэг дутсан

CLI командыг алдаа гарсан тохиолдолд илүү амархан уншихын тулд дибаг хийх үед `--output-format text`-г ашиглаарай:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority --output-format text tx ping --msg "hello"
```

## Асуултууд хоосон үр дүнг буцаана {#queries-return-empty-results}

Хоосон асуух үр дүн нь үргэлж асуулт амжилтгүй болсон гэсэн үг биш юм. Шалгана уу:

- объектыг үүсгэх ёстой гүйлгээ дууссан
- асуултанд өртсөн домэйн, хөрөнгийн тодорхойлолт, эсвэл дансны ID нь нэг протоколын стандарттай байна
- хуудсалалт эсвэл шүүлтүүрүүд нь хүлээгдэж буй мөрийг хасаж байгаагүй
- хэрэглэгч нь өөр локаль сүлжээ биш, зорьсон сүлжээнд холбогдсон байна

Салбар шалгалт хийхдээ хамгийн өргөн хайлтаас эхэлнэ үү:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

## Үйл явдал эсвэл блок урсгалууд эрт зогсдог {#event-or-block-streams-stop-early}

Блок ба үйл явдлын урсгалын жишээ Torii урсгалын төгсгөлийн цэгт тулгуурладаг. Зангилаа ажиллаж байгааг шалгаж, дараа нь хугацааны хязгаартай туршина:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP интеграцын хувьд өөрийн төгсгөлийн цэгийн замыг одоогийн [Torii төгсгөлийн цэгийн лавлахтай](/mn/reference/torii-endpoints.md) харьцуулна.
