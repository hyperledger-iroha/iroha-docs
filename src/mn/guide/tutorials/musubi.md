---
translation_locale: mn
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama Багцууд {#musubi-kotodama-packages}

Musubi бол Kotodama эх кодын багцуудын анхны хувилбарын багцын менежер юм. Энэ нь хэвтэж буй нарийвчлалтай хамааралтын графыг шийдэж, SoraFS эх кодыг баталгаажуулдаг сонгогдсон ажлын орчийг архивлаж, эмхэтгэн, туршиж, нэг протоколын стандартын CAR архивуудыг бүтээж, өөрчлөгдөшгүй хувилбаруудыг Iroha замаар нийтэлдэг.

Та шаардлагатай үед Musubi-ийг ашиглаарай:

- дахин ашиглах боломжтой Kotodama функцийн санг нийтлэх
- `Musubi.lock` дахь яг дамжуулах графыг тогтоох
- төгс болгосон SoraFS архивын криптографийн амлалтын утгаас хамаарал эхийг сэргээх
- нэг багц эсвэл олон багцын ажлын талбарыг бүтээж, турших
- онлайн бүртгэлээр дамжуулан багцыг шалгах, нийтлэх, татаж авах, хадгалах, эсвэл өөр нэрээр ашиглах

## Багцын нэрс {#package-names}

нэг протокол-стандарт багцын сонгогчид ашигладаг:

```text
namespace/package
```

Тодорхой гаргах таних тэмдгүүд нь хувилбар нэмдэг:

```text
namespace/package@version
```

Нэрсийн сангийн эхэнд ямар ч `@` байхгүй. Нэрсийн сан нь `universal` шиг өгөгдлийн сангийн үндэс эсвэл `dex.universal` шиг домайн-д зориулсан өгөгдлийн сан байж болно. Блокчэйн бүртгэл нь тэр бүтцийн нэрсийн сэнгийг нэг тогтвортой үндсэн өгөгдлийн сантай холбодог бөгөөд багцыг авах боломжтой болоход.

## техникийн манифест ба Локфайл {#manifest-and-lockfile}

Багц нь анх гарсан хаалттай `Musubi.toml` схемийг ашиглаж байна. Техникийн тодорхойлолт нь `manifest-version = 1`, Kotodama хэвлэл `"1"`, ба IVM ABI хувилбар `1`-ыг зааж өгөх ёстой; өөр техникийн тодорхойлолт эсвэл ABI горим байхгүй.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

Хамааралтууд нарийн хувилбар, семиколон ба тире шаардлагуудыг, `1.*` мэт оруулгуудыг, мөн `>=1.0.0,<2.0.0` мэт таслалаар ялгасан харьцуулалтын багцуудыг ашиглаж болно. Хамааралтын хүснэгтэд түлхүүр нь эцэг-оройн импортын эсвэл нэрлэсэн alias; `package` нь үргэлж цорын ганц протокол-стандард бүртгэлийн сонгогч юм.

`Musubi.lock` нь графийг яг эх үүсвэрээс гаралтай `NetworkId` ба эцсийн бүртгэлийн агшинг тайлагнахтай холбодог. Энэ нь сонгогдсон ажлын талбарын үндэс болон өөрчлөгдөшгүй гарсан хувилбарын зангилааг бичдэг, түрүүлэлт, эх сурвалж, интерфейс, архив, ABI, ба яг хамааралтай ирмэг криптографын баталгааны утгуудыг оруулах. Шийдэгдсэн граф нь шаардвал зэрэгцээ хувилбаруудыг зөвшөөрнө.

## Тохируулах Taira SoraFS Үзнэ {#configure-taira-sorafs-fetching}

Taira нь энэ ажлын урсгалын нийтийн тест сүлжээ юм. Шалгагдсан гинжлэгдсэн болон одоогийн зурсан үүссэн сүлжээний танигдсан идентифкатортой Taira клиент тохиргооноос эхлээд, дараа нь доорхи үйлчилгээ үзүүлэгчид зориулсан баталгаажсан fetch холбоосуудыг нэмнэ үү. A Taira дахин тохируулах нь `NetworkId`-ыг өөрчилж болно; үүнийг тогтвортой гинж UUID-аас таамаглахын оронд гарын үсэг зурсан байрлуулалтын профилээс шинэчил. Дансны гарын үсгийн материал болон үйлчилгээ үзүүлэгчийн операторын түлхүүрүүд нь зөвхөн эзэмшигчийн програм хангамжийн гүйцэтгэх орчинд хадгалагдах ёстой.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

Олон нийтийн тестнет үндэсээс Taira-ийн баталгаажсан үйлчилгээ үзүүлэгчдийг олж мэдээрэй:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Нийлүүлэгчийн каталог нь нийлүүлэгчийн танилцуулга болон зарласан API төгөлдөр бусад эцсийн цэгүүдийг өгдөг. Сонгогдсон нийлүүлэгчээс тохирох операторын зөвшөөрлийг авна уу. Програм хангамжийн гүйцэтгэлийн орчин нь тухайн түлхүүрийг ашиглан хязгаарлагдмал урсгалын токенуудыг хүсдэг; токенууд нь CLI аргумент эсвэл түгжээний файлын агуулга биш юм.

`url` болгон Taira баталгаажуулагч пин URL ашиглаарай. Шалгагдсан баталгаажуулагчид суулгасан SoraFS хадгалах боломж идэвхгүй болсон. Тэдний `https://taira-validator-{1,2,3,4}.sora.org` API төгсгөлүүд пин бүртгэл хүлээн авдаг бол архив уншлагаас сонгогдсон зөвшөөрөгдсөн нийлүүлэгчийн HTTPS эх сурвалжийг ашигладаг.

## Орон нутгийн ажлын урсгал {#local-workflow}

Дээд урсгалын Iroha ажлын орчны үндэснээс, пакетийн директорийг үүсгэж эсвэл ороод, Musubi-ийг Cargo ашиглан ажиллуулна:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` эцэслэгдсэн бүртгэлийн графыг шийдвэрлэж, зөвшөөрөгдсөн үед `Musubi.lock`-ийг шинэчилж, батлагдсан SoraFS байршлаас өөрчлөгдөшгүй локал кэшийг бөглөж өгдөг. `check`, `build`, `test`, болон `package` өөрсдийн ажлыг эхлүүлэхээс өмнө ижил граф болон кэш шалгалтыг гүйцэтгэдэг.

Хэрэв ямар нэгэн lockfile-ийн өөрчлөлтийг татгалзах шаардлагатай бол `--locked`-г ашиглана уу. `--offline`-г зөвхөн бүртгэлийн индекс болон шаардлагатай бүх архив аль хэдийнэ кэшлэгдсэн үед ашиглана. `--frozen` эдгээр хоёр нөхцлийг хослуулдаг. Офлайн кэш алдагдсан тохиолдолд амжилтгүй болно; Musubi шийдээгүй lockfile-ийг огт бичдэггүй.

Хамааралтын эх үүсвэрийг `math::add()` зэрэг чанартай техникийн дуудлагыг тодорхой дотоод Kotodama нэрээр дахин бичих замаар холбодог. Хамааралтын техникийн экспорт хийгдээгүй функц рүү дуудахыг татгалзав. Импортын номын сангууд функцүүдийг ил гаргадаг; локал `[[contract]]` ба `[[test]]` зорилтууд тодорхой багцын зорилт хэвээр байна.

## Кэшийн баталгаажуулалт ба засвар {#cache-verification-and-repair}

Олон нийтийн кэш командууд нь бүртгэлд нийтлэгдсэн өөрчлөгдөшгүй архив дээр ажилладаг:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` итгэлтэй удамынханийг тусгаарлаж, эцэслэгдсэн үйлчилгээний нотолгоо зөвшөөрөл олгосон тохиолдолд яг архивуудыг дахин татдаг. Амьд хоосон бус хувьсгалд урьдчилан хаах байдлаар сарниулдаг; ангилагдсан нэр дэвшигчдийг шалгахын тулд `--dry-run`-ийг ашигла.

## Сав баглаа боодол ба хэвлэн нийтлэх {#packaging-and-publishing}

Архив үүсгэхээс өмнө цэвэр эерэг файлын багцыг шалгаж, дараа нь нэг протокол стандартын багцыг бүрдүүлнэ:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` нь `target/package/<namespace>-<name>-<version>.car` файлыг бичнэ. CAR нь каноник багцын манифест, семантик гаргалтын манифест, яг таарах баталгаажуулалтын lock, эх мод, interface digest болон SoraFS архивын амлалтыг хооронд нь холбоно. Эхний хувилбарын CLI-д тусдаа `pack`, `--car-out`, `--sorafs-manifest-out` эсвэл `--source-plan-out` команд байхгүй.

Нийтлэл нь гарын үсэг зурсан, дахин үргэлжлүүлж болох сүлжээний урсгал юм. Сонгогдсон `client.toml` нь шаардлагатай `[musubi.publication]` холбоосууд болон данс болон Taira сүлжээний тохиргоог агуулсан байх ёстой. Зөвхөн нэг ажлын байрны гишүүнийг багцла:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Үйл ажиллагааны дэвтэр ба үрийн орох хязгаар бат бөх байхаар буцахад `--detach`-ыг ашиглана уу. `publish --resume <operation-id> --config client.toml`-ээр бат бөх үйл ажиллагааг үргэлжлүүлээрэй. Илүү нарийн `--recover <operation-id>` зам зөвхөн дахин сэргээдэг шинэ, анхны дэвтрийн хувьд алдагдсан өөрчлөгдөшгүй туслах бичлэгүүд. `--dry-run` нийтлэл эсвэл ерөнхий олон нийтийн татан оруулах арга байхгүй; орон нутгийн урьдчилсан шалгалт хийхэд `package --list` ба `package`-ийг ажиллуулна уу.

## Бүртгэлийн асуултууд ба амьдралын мөчлөг {#registry-queries-and-lifecycle}

Ижил Taira клиент тохиргоотой баталгаажсан бүртгэлийг хайж шалгана уу:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

Yanking нь шинэ шийдвэрүүдээс өөрчлөгдөшгүй хувилбарыг оруулахгүй байлгадаг ба одоо байгаа нарийн түгжээнүүд хэвээрээ дахин бүтээж болно. Эхлээд одоогийн yank хувилбарыг унш, дараа нь compare-and-set өөрчлөлт хий:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Тэр байдлыг буцаахын тулд ижил пакет, хувилбар, шинээр уншсан шинэчлэлттэй `unyank`-ийг ашиглана уу. Пакетийн эзэмшил ба удирдагчийн үүрэг нь нийтлэх, татах, метадатаг хянахад нөлөөлдөг. мөн архивын байрлалын зөвшөөрөл. Дэлхий даяар хэрэглэгддэг нэрүүд нь өөрийн үнэтэй бүртгэл, дахин чиглүүлэх түүх, харьцуулах ба тохируулах шинэчлэлтүүдтэй; тэд багцын эзэмшлийн товчлуурууд биш юм.

## Iroha Гадаргуу {#iroha-surfaces}

Musubi нь анхныхаа хувилбарын V1 заавар болон асуултыг ашигладаг:

|Гадаргуур|Зорилго|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |Нэрийн орон зайг тогтвортой гэрийн мэдээллийн сан руу холбох.|
| `RegisterMusubiArchiveV1`                            |Өөрчлөгдөшгүй баталгаажсан эх сурвалжийн архивын криптографийн амлалтын утгыг бүртгэх.|
| `AddMusubiArchiveLocationV1`                         |Батлагдсан SoraFS архивын байршлыг нэмэх эсвэл шинэчлэх.|
| `PublishMusubiReleaseV1`                             |Багцыг нэхэмжлэх эсвэл шинэчлэх ба нэг өөрчлөгддөггүй хувилбарыг нийтлэх.|
| `SetMusubiReleaseYankV1`                             |Тодорхой гаргасан төлөвийн татсан төлөвийг харьцуулж тогтооно уу.|
| `InviteMusubiPackageMaintainerV1`                    |Ил тод багцын үүрэгт урилгын урсгалыг эхлүүлнэ үү.|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |Зохицуулагдсан дэлхийн хэмжээнд хэрэглэгддэг орлуулагчийг бүртгэх эсвэл дахин чиглүүлэх.|
| `AssertMusubiReleaseDigestV1`                        |Ямар ч өөрчлөлтгүй гаргасан криптографийн хураангуй утгыг яг таамагла.|
| `FindMusubiExactPackageV1`                           |Нэг яг багц болон түүний шинэчлэлтүүдийг уншина уу.|
| `FindMusubiExactReleaseV1`                           |Нэг яг хэвлэлийн агшныг уншина уу.|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Шийдэж эсвэл эцэслэгдсэн гаргах боломжтой кандидатуудыг жагсаагаарай.|
| `FindMusubiArchiveLocationsV1`                       |Төгсөлсөн, үйлчилгээ үзүүлэгчийн баталгаажуулсан архивын байршлыг уншна уу.|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     |Одоогийн нэрийн дор байгаа зорилгыг эсвэл түүний өөрчлөгддөггүй түүхийг уншина уу.|

Torii нь програмын маршрут гэр бүлийг `/v1/musubi/*` дор илчилдэг. MCP хэрэгслүүд нь одоогийн `iroha.musubi.queries.*` болон `iroha.musubi.instructions.*` нэрсийг ашигладаг. Илүү өргөн API газрын зургийг үзэхийн тулд [Torii API төгсгөлийн цэгүүд](/mn/reference/torii-endpoints.md) болон [асуултын лавлагаа](/mn/reference/queries.md)-ыг харна уу.
