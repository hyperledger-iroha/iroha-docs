---
translation_locale: mn
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama багц {#musubi-kotodama-packages}

Musubi нь Kotodama эх үүсвэрийн багцыудын анхны нэвтрүүлгийн багц менежер юм. Энэ нь зах зээлийн хамааралтай байдлын тод жагсаалтыг шийдэж, SoraFS-ийг баталгаажуулдаг эх үүсвэрийн архив, сонгогдсон ажлын хэсгийг цуглуулж, шинжилгээ хийж, CAR архивын санхүүжилтийг бий болгож, Iroha -ийн дамжуулан өөрчлөгдөхгүй хэвлэлийг хэвлүүлж байна.

Хэрэглэхэд Musubi -ийг ашигла:

- дахин ашиглах боломжтой Kotodama функцийн номын сан хэвлүүлэх
- `Musubi.lock` хэмжээнд томоохон шилжих график байлгана
- эцэслэсэн SoraFS архивын үүрэг гүйцэтгээс шалтгаалсан эх үүсвэрийг сэргээн засварлах
- нэг багц эсвэл олон багцтай ажлын байрыг бүтээн байгуулах, туршиж үзэх
- зах зээлийн бүртгэлээр багцыг шалгах, хэвлэх, татаж авах, хадгалах, эсвэл нууц нэртэй

## Барилгын нэрүүд {#package-names}

Canonical paketeйн сонгогч нь:

```text
namespace/package
```

Тухайн дугаарлалтын тодруулагчид:

```text
namespace/package@version
```

Урьдчилсан хүн байхгүй. `@` Нэр орон зай нь мэдээллийн орон нутгийн түлх юм. `universal` эсвэл тухайн доменд зориулсан мэдээллийн орон тоо `dex.universal`. Тодруулга нь тухайн бүтцийн нэрний орон зайг нэг тогтвортой эх сурвалжийн өгөгдлийн газарт холбож, багцыг эргүүлэн авах боломжтой.

## Манифест, замбарын файл {#manifest-and-lockfile}

Нэг багц нь нээлттэй анхны хувилбарыг ашигладаг `Musubi.toml` Схема. Манифест нь `manifest-version = 1`, Kotodama хэвлэл `"1"`, болон IVM ABI хувилбар `1`; өөр ямар ч тэмдэглэл байхгүй, эсвэл ABI хэв маяг.

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

Хөдөлгөөнүүд нь тод хувилбарууд, хяналт тавих ёсны шаардлагууд, `1.*` гэх мэт галзуу карт болон `>=1.0.0,<2.0.0` гэх мэт сүлжээнд хуваагдсан харьцуулагчийн багц ашиглах боломжтой. Хөдөлгүйн хүснэгтийн түлүүр нь эх оронч импортны нууц нэр; `package` бол үргэлж хуулийн бүртгэлийн сонгогч.

`Musubi.lock` график нь яг генезээс үүдэлтэй `NetworkId` болон эцсийн бүртгэлийн хяналт тавилгатай холбоотой. Энэ нь сонгогдсон ажлын байрны түлхүүд, өөрчлөгдөхгүй нөөц нуруудыг тэмдэглэдэг, нэвтрүүлэг, эх үүсвэр, интерфейс, архив, ABI болон тод хамаарлын хээрийн үүрэг гүйцэтгэгчдийг хамруулж байна.

## Taira SoraFS татаж авахыг тохируулна {#configure-taira-sorafs-fetching}

Taira нь энэ ажлын урсгалын олон нийтийн туршилтын сүлжээ юм. Taira үйлчлүүлэгчний конфигурациас эхлээд зангил болон сүлжээний тодорхойлолттайгаар шалгаруулж, дараа нь үйлчилгээ үзүүлэгчд зориулсан баталгаажуулсан татаж авах холбоосыг доор нэмнэ. Санхүүжилтийн гарын үсэг зурах материалын болон үйлчилгээ үзүүлэгчний операторын түлхүүр нь зөвхөн эзэмшигчдэд зориулсан гүйлгээний цаг хугацааны файлуудтай байх ёстой.

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

Taira-ийн хүлээн зөвшөөрөгдсөн үйлчилгээ үзүүлэгчдийг олон нийтийн тестний сүлжээний гарал дээрээс олж мэднэ:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Үйлчлөгч каталог нь үйлчилгээ үзүүлэгчний тодруулгыг болон зарласан төгсгөлийн цэгүүдийг хангадаг. сонгогдсон үйлчилгээ үзүүлэгчээс тохируулалтын операторын зөвшөөрлийг аваарай. Хөдөлмөрийн цаг энэ түлхүүр ашиглаж, хязгаарлалттай урлагийн токенүүдийг хүснэ; токенүүд CLI аргумент эсвэл замбарааны файлын агуулга биш юм.

Хөдөлмөрийг хэрэглэхгүй Taira баталгаажуулах түлхүүр URL тухайн `url`. Чатгалсан баталгаажуулагч нь SoraFS Хөдөлмөрийн хадгаламж хүчингүй. `https://taira-validator-{1,2,3,4}.sora.org` төгсгөлийн цэгүүд PIN бүртгэлийг хүлээн авдаг бол архив уншигч нь сонгогдсон зөвшөөрөлтэй үйлчилгээ үзүүлэгчдийн HTTPS эх үүсвэр.

## Орон нутгийн ажлын урсгал {#local-workflow}

Iroha ажлын байрны түлхнээс эхлэн багцын захиалгыг бий болгож, Musubi -ийг Cargo-д дамжуулан ажиллуулж:

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

`fetch` эцсийн бүртгэлийн граф, шинэчлэлийг шийддэг `Musubi.lock` зөвшөөрөлтэй бол, баталгаажуулсанээс өөрчлөх боломжгүй орон нутгийн хоолой SoraFS байршил. `check`, `build`, `test`, болон `package` өөрийн ажил хийхээс өмнө ижил график, хоолой шалгалтыг хийж гүйцэтгэх.

`--locked` -ийг ашиглан хаац файлын өөрчлөлтийг татгалзаж болно. `--offline`-ийг зөвхөн бүртгэлийн индекс болон бүх шаардлагатай архив аль хэдийн хадгалагдсан тохиолдолд ашиглана. `--frozen` нь эдгээр хоёр хязгаарлалтыг нэгтгэдэг. Газар буцалтгүй хоолой алдаа; Musubi хэзээ ч шийдвэрлэхгүй хаац файлыг бичихгүй байна.

Харилцааны эх үүсвэрийг `math::add()` гэх мэт шалгаруулалтыг дэтерминист дотоод Kotodama нэрүүдэд дахин бичсээр холбоно. Экспортолгүй функц руу хамаарлын дуудлыг татгалздаг. Импортын номын сан нь функцийг илрүүлнэ; орон нутгийн `[[contract]]` болон `[[test]]` зорилтууд нь тодорхой багцын зорилт хэвээр байна.

## "Cache" хяналт тавих {#cache-verification-and-repair}

Олон нийтийн хоолой команд нь өөрчлөгдөхгүй, регистрийн үүрэг гүйцэтгэгч архив дээр ажилладаг:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` карантин нь итгэмжлэгдсэн үр хүүхдүүдийг гэмтүүлж, эцсийн гэрчилгээний баталгаанаас зөвшөөрөл авсан тохиолдолд тохирсон архив нь шинэчлэгддэг. Musubi амьд цэвэрлэгээгүй шийтгэх мутацийг үгүйсгэдэг. `--dry-run`-ийг ашиглан ангилагдсан нэр дэвшигчдийг шалгаж үзээрэй.

## Багаруулга, хэвлэл {#packaging-and-publishing}

Архив бичихийн өмнө цэвэр эерэг файлын багтаалыг шалгаарай, дараа нь каноникийн багц бүтээх:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` бичиж байна `target/package/<namespace>-<name>-<version>.car`. Үндсэн хуулийн CAR Canonical package manifest, semantic release manifest, exact verification lock, source tree, interface digest, болон SoraFS Архивын үүрэг гүйцэтгэх. `pack`, `--car-out`, `--sorafs-manifest-out`, эсвэл `--source-plan-out` Анх нэвтрүүлэг дэх команд CLI.

Публикац бол гарын үсэг зурсан, дахин эхлэх боломжтой сүлжээний ажлын урсгал юм. сонгогдсон `client.toml` нь үйлдвэрлэлийн `[musubi.publication]` холболт, мөн бүртгэл болон Taira сүлжээгийн конфигурацийг бүрдүүлэх ёстой:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Хэрэглээ `--detach` Хөдөлмөрийн журмын болон үр тарианы нэвтрүүлгийн хязгаар тогтвортой болсноос хойш буцаж ирнэ. `publish --resume <operation-id> --config client.toml`. Удахгүй. `--recover <operation-id>` Path нь зөвхөн нэвтрүүлгийн өмнөх сэтгүүлд зориулсан хохиролгүй саад машиныг сэргээн засварлан бүтээжээ. `--dry-run` эсвэл нийтлэг олон нийтийн борлуулалтын дутагдал; гүйлт `package --list` болон `package` Орон нутгийн нислэгээс өмнө.

## Тус бүртгэлийн асуултууд болон амьдралын мөрийг {#registry-queries-and-lifecycle}

Taira үйлчлүүлэгчдийн ижил конфигурацитай эцсийн бүртгэлд хайж, шалгана уу:

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

Yanking нь шинэ дугаарлалтын өөрчлөлтийг үгүйсгэхгүй бөгөөд одоогийн томоохон замбарууд дахин боловсруулах боломжтой. Хамгийн түрүүнд одоогийн YANK-ийн шинэчлэлийг уншина уу, дараа нь харьцуулаад байгуулсан мутацийг өргөн мэдүүлнэ үү:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

`unyank` -ийг ижил багц, хувилбар болон шинээр уншсан шинэчлэлгээр ашиглаж, энэ байдлыг буулгах болно. Пакейн эзэмшигч, хадгаламжийн үүрэг нь нийтлэх, татаж авах, метадэтгэл, архив байрны зөвшөөрлийг хянах. Дэлхий даяар зориулсан нууц нэрүүд нь өөрийн гэсэн үнээр бүртгэлтэй, дахин чиглэлийн түүхтэй, болон харьцуулж, тогтоосон шинэчлэл; тэдгээр нь багцын эзэмшлийн товч зам биш юм.

## Iroha Дэлгэрэнгүй {#iroha-surfaces}

Musubi нь анхны нэвтрүүлгийн V1 заавар, асуултыг ашигладаг:

|Газар .|Зорилго|
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Үндсэн өгөгдлийн орон нутагт нэр дэвсгэрийг байлгана. |
|`RegisterMusubiArchiveV1` |Өөрчлөлгүй баталгаажуулсан эх үүсвэрийн архивын үүргийг бүртгэнэ. |
|`AddMusubiArchiveLocationV1` |SoraFS архивын тогтоосон байршлыг нэмэх эсвэл шинэчлэх. |
|`PublishMusubiReleaseV1` |Барилгыг өргөжүүлэх, шинэчлэх, нэг өөрчлөгдөхгүй хэвлэлийг гаргах. |
|`SetMusubiReleaseYankV1` |Дашрамдсан нөхцөл байдлыг харьцуулж, тохиргоо. |
|`InviteMusubiPackageMaintainerV1` |Дашрамдсан багц үүргийн уриалтын урсгалыг эхлүүлнэ. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Тодруул, эсвэл захиргааны дэлхийн нууц нэрийг дахин хаяж. |
|`AssertMusubiReleaseDigestV1` |Үргэлжгүй ангиллын тохиргоог баталгаажуул.|
|`FindMusubiExactPackageV1` |Тухайн багц болон түүний шинэчлэлийг уншина уу. |
|`FindMusubiExactReleaseV1` |Тухайн нэг илтгэлийг уншина уу. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Дахиалсан чөлөөлөх нэр дэвшигчдийн жагсаалтыг шийдвэрлэх. |
|`FindMusubiArchiveLocationsV1` |Даатгуулагч дэмжсэн архив байршуудыг эцсийн байдлаар уншина уу. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Одоогийн нууц нэртэй зорилтыг уншина уу, эсвэл түүний өөрчлөгдөхгүй түүхийг. |

Torii нь `/v1/musubi/` дэргэдэх аппликетийн замын гэр бүлийг илрүүлнэ. MCP хэрэгсэлүүд одоогийн `iroha.musubi.queries.` болон `iroha.musubi.instructions.*` нэрүүдийг ашигладаг. илүү өргөн хүрээтэй API газрын зургийг үзэхэд [Torii эцсийн цэг ](/mn/reference/torii-endpoints.md) болон [ хайлтын сүлжээнд ](/mn/reference/queries.md) хараарай .
