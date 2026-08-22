---
translation_locale: mn
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# Хамтран ажиллаж байна Iroha Хоёртын файлууд {#working-with-iroha-binaries}

The Iroha 3 Операторын ажлын урсгал гурван үндсэн хоёртын файлыг тойрон эргэдэг:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) үе тэнгийн демоныг ажиллуулахад зориулагдсан
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) төлөө CLI болон операторын командууд
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) түлхүүр, генезис, локалнет, профайлд зориулагдсан

## Эх сурвалжаас бүтээх {#build-from-source}

Дээд талын ажлын талбарын үндэсээс:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Хувилбарын хоёртын файлууд дараа нь боломжтой болно `target/release/`.

Тушаалын гадаргууг шалгахын тулд:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Хадгалах газраас шууд ажиллуул {#run-directly-from-the-repository}

Хэрэв та дэлхий даяар ямар нэгэн зүйл суулгахыг хүсэхгүй байгаа бол ашиглаарай `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Зураг {#docker-image}

Дээд талын ажлын талбар ашигладаг `kagami localnet` болон `kagami docker` үүсгэх
Docker Compose гарсан кодтой таарч байгаа файлууд.The `hyperledger/iroha:dev`
зургийг тэдгээр үүсгэсэн файлд ашиглаж болно.

-г ажиллуул CLI саванд:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Гүй Kagami саванд:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Үе тэнгийнхэн эхлүүлэхийн тулд эхлээд локалнет үүсгэж, файл бичих:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Би аль хоёртын хувилбарыг ашиглах ёстой вэ? {#which-binary-should-i-use}

- Ашиглах `irohad` үе тэнгийнхэнээ эхэлж эсвэл ажиллуулж байх үед.
- Ашиглах `iroha` дэвтэрээс лавлагаа авах, гүйлгээ хийх, операторын төгсгөлийн цэгүүдийг шалгах шаардлагатай үед.
- Ашиглах `kagami` Танд түлхүүр, генезис манифест, профайл багц эсвэл локалнетийн хөрөнгө хэрэгтэй үед.

## Kagemusha Release Publication and Rollout {#kagemusha-release-publication-and-rollout}

Кагемуша V4 Нийтлэл ба идэвхжүүлэлт нь тусдаа хамгаалагдсан хил хязгаарыг давж байна:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` нь
  Зөвхөн macOS, зөвхөн root нийтлэгч.Энэ нь бэхлэгдсэнийг баталгаажуулдаг Kagami хоёртын ба
  яг арван зургаан файлын нэр дэвшигч, эзгүйд нийтэлдэг
  `promotion-record-v4.norito` орлуулахгүйгээр, зөвхөн амжилтыг мэдээлдэг
  яг арван долоон файлын сурталчилсан хувилбарыг баталгаажуулсны дараа.
- `iroha offline kagemusha rollout-v4 create-expectations` гарын үсэг зурсныг баталгаажуулна
  захиалга, дөрвөн захиалга баталгаажуулагч мэргэшлийн тамга, яг
  аль хэдийн зөвшөөрөгдсөн гүйлгээний утас, өмнө нь итгэмжлэгдсэн эцсийн зангуу
  гарын үсэг зурсан хүлээлтийг орлуулахгүйгээр нийтлэх.
- `iroha offline kagemusha rollout-v4 submit` тодорхой байхыг шаарддаг
  `--write-authorized` зөвшөөрөл.Энэ нь бат бөх тэмдэглэл хөтөлж, үнэн зөвийг дахин баталгаажуулдаг
  сүлжээ бичих эсвэл дахин оролдохын өмнөх хүлээлт.Ан `Applied` статус биш
  хангалттай: тушаал нь мөн хүлээсэн блок, эцсийн залгамжлагчийг баталгаажуулдаг
  гинжин хэлхээ, болон бүрэн зөвшөөрөл агуулсан гүйлгээний утас.
- `iroha offline kagemusha rollout-v4 finalize-receipt` ижил нотолгоонд
  тулгуурласан баримтыг зөвхөн яг тохирох илгээлтийн журнал дахин баталгаажсаны
  дараа цуглуулж, бие даасан баримт гаргагчаар гарын үсэг зуруулан, каноник
  баримтыг солихгүйгээр нийтэлнэ.

Шалгасан Кагемушагийн үйлдвэрлэлийн бэлэн байдлын ажлын урсгал нь зөвхөн баталгаажуулалт юм.
Энэ нь баталгаажуулсан нийтлэгчийг дууддаггүй, нийтлэх баталгаажуулагчийн мэргэшил
битүүмжлэх, идэвхжүүлэх, эсвэл эцсийн баримт үүсгэх.Амжилттай ажлын урсгал
ажиллуулах нь сурталчилгаа эсвэл шууд нэвтрүүлгийн аль алиныг нь нотлохгүй.

Эдгээр тушаалууд нь амьд нотлох баримтыг орлох биш харин орон нутгийн командууд юм.А
Бодит бодит App Attest болон
нэр дэвшигч олдворууд, бүх дөрвөн хамгаалагдсан хост тамга, ажиллах цагийн засаглал болон
гарын үсэг зурах оролт, амьд дөрвөн баталгаажуулагч илгээх болон эцсийн нотлох баримт, болон
каноник үр дүнтэй тохиргооны төсөөлөл.Хувийн түлхүүрээ хадгалах,
баталгаажуулалтын материал, сурталчилгааны тусгай таниулбарууд хамгаалагдсан
ажлын цагийг хадгалах;тэдгээрийг эх сурвалжийн хяналттай баримт бичигт хуулж болохгүй эсвэл
операторын тасалбар.
