---
translation_locale: mn
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Барилгын багц {#musubi-kotodama-packages}

Musubi - Kotodama Эх сурвалжийн багц.
Compotable хуваарилах Cargo-ийн шиг ажлын урсгал Kotodama үйл ажиллагаа
багцын тодорхойлогыг SORA болон Iroha нэрний орон зай
Дэлхийн анхны иргэдийн нэрсийн жагсаалт.

Хэрэглээ Musubi шаардлагатай үед:

- дахин ашиглах боломжтой хэвлэл Kotodama эх сурвалжийн номын сан
- Тохирсон шилжих эх үүсвэрийн хамаарлыг `Musubi.lock`
- баталгаажуулсан хамаарлын эх үүсвэрийг сэргээн засварлах SoraFS архивын үүрэг
- dapp-ийн гэрээний нууц үсэгтэй багцын нэр орон зай холбоно
  нэрний орон зай
- Хүлжээний бүртгэлээр дамжуулан багцыг шалгах, хэвлэх, татаж авах, эсвэл нууц нэртэй

## Барилгын нэрүүд {#package-names}

Canonical paketeйн ID-ийг ашиглах:

```text
namespace/package
```

Тухайн нэвтрүүлгийн сэнслэл ашиглах:

```text
namespace/package@version
```

Тэр нь тэргүүлэх хүн байхгүй `@` Нэрний орон зай өмнө. `@` хуваагч нь тусгайлан
Үндсэн хувилбарын хавсралт.

Нэрлэгийн хэсгийг нь Kotodama dapp гэрээ
Үндсэн нэр:

| Барилгын тодруулгыг                | Үүнтэй холбоотой гэрээний цогцолборын хэлбэр |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

Нэрний орон зай нь `<dataspace>` эсвэл `<domain>.<dataspace>` хэлбэр.
багц нь dapp холболттай, Musubi холбоо барих гэрээний алиа
багцтай ижил нэр орон зайны хавсралтыг ашигладаг.

## Өргөдсөн {#manifest}

Барилгын багц нь: `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

Үндсэн зүйлүүд нь тод хувилбарыг ашиглаж болно, анхаарал хандуулж байх шаардлагыг
шаардлагууд, зэрлэг карт `1.*`, эсвэл харьцуулагч жагсаалтууд
`>=1.0.0,<2.0.0`.

`Musubi.lock` сонгогдсон шилжилтийн график нь зангилаасаа бүртгэнэ
бүртгэл. Захирагдсан түймэр бүр сонгогдсон Canonical Package Refer-ийг хадгалдаг
шаардлага, SoraFS нэвтрүүлэг, эх үүсвэрийн архив хэш, байт тоо, файл
тоо, экспортлосон функц, тодорхойлох эх үүсвэрийн архив төлөвлөгөө,
Урьдчилсан нууцал.
Хүрэлтийн файл.

## Орон нутгийн ажлын урсгал {#local-workflow}

Өвөр замаар Iroha Ажлын байрны түлх, гүйлт Musubi ачаа дамжуулан:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

Хэрэглээ `install --offline` тодорхой хувилбарын хувьд шийдвэрлэхгүй мөрийн файл бичиж болно
Үндсэн хэсгийг асуухгүйгээр `install --locked` .д CI .
Үргэлжсэн замбарын файлыг үгүйсгэнэ.

`build` дуудлагыг дахин бичиж, тавигдах хамаарлын эх үүсвэрийг холбоно
`math::add()` тодорхойлолт дотоод Kotodama функцын нэр.
тусгаар тогтнол нь экспортлоогүй функцын дуудлага. Musubi v1 номын сан
зөвхөн үйл ажиллагааны зориулалттай: төрийн мэдэгдлийг агуулсан хамаарлын эх сурвалж,
Тригжер, котоба блок, байнгын элемент эсвэл бусад функцгүй гэрээний зүйл
Хөгжиж байна.

## Эх сурвалжийн архив {#fetching-source-archives}

Musubi шийдэж байх үед эсвэл дараа нь сурагчаагүй хамаарлын эх үүсвэрийг олж авах боломжтой
"Cache" дэд команд:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Амьдралын хаалганы аваргад нэг эсвэл хэд хэдэн SoraFS галт тэрэгний үйлчилгээ үзүүлэгчдийн онцлог:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Үйлчилгээний хэрэглэгчийн ачаалалтын файлууд болон галт тэрэгний үйлчилгээг үзэгчдийн хоорондоо тусгасан
Хэрэв нэгээс илүү багцыг хаасангүй бол
нэвтрүүлгийн үйлчилгээ үзүүлэгч `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, эсвэл
`manifest=<64-hex SoraFS manifest digest>`.

Газарны хаалга `base-url` болон `privacy-url` үнэ цэнэ ашиглах ёстой `https://` Үүнээс өмнө.
Орон нутгийн туршилтын даргыг ашиглах боломжтой `http://localhost`, `http://127.0.0.1`, эсвэл
`http://[::1]` зөвхөн `--gateway-allow-insecure-localhost`. Хөрөгдөл
токенүүд нь ажиллуулах хугацааны итгэмжлэл бөгөөд `Musubi.lock`.

## Хэвлэлийн хэвлэл {#publishing}

`pack` тодорхойлолт тооцоо BLAKE3-256 эх үүсвэрийн архив хэши болон
Эх сурвалж байт, файлын тоо. `--car-out`, `--sorafs-manifest-out`, эсвэл
`--source-plan-out` Энэ нь мөн тодорхойлолттай SoraFS
CAR хэрэглээний ачаалл, SoraFS илтгэл, Musubi эх үүсвэрийн архив төлөвлөгөө
эх файлын багц.

Ном хэвлэхээс өмнө угаах явцыг ашигла:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Үгүйгээр `--dry-run`, `publish` гарын үсэгт хэсгийг
`.musubi/dist/<namespace>/<name>/<version>/`, сонголттайгаар
нэвтрүүлэг, хэрэглээний ачаалл Torii Энэ бол SoraFS хадгаламжийн шилжилтийн төгсгөл нь
`--upload`, үүсгэсэн SoraFS Пин, өргөн мэдүүлэг
`PublishMusubiRelease` тохируулсан Iroha Хэрэглэгч.

Улмаар нийтлэгдсэн мэдээллүүд:

- дуугүй санхүүгийн эх үүсвэрийн архив
- тодорхойлох эх үүсвэрийн архив төлөвлөгөө
- хамгийн багадаа нэг экспортолсон Kotodama үйл ажиллагаа
- хамааралтай байдлын бүртгэл нь татаж авсан чөлөөллийг сонгохгүй
- гэрээний нууц нэр нь багцыг нийцсэн dapp холболт, тухайн тохиолдолд
  нэрний орон зай

## Номын бүртгэлийн асуултууд, амьдралын мөрийг {#registry-queries-and-lifecycle}

Үүнд дараах байдлаар бүртгэлийг хайж шалгаарай:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Янкинг шинэ дугаарлалтын нэвтрүүлгийг нууж байгаа ч одоогийн замбараагүй файлуудыг хадгалж байна
дахин боловсруулах боломжтой:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi дэлхийн нэр хүнд нь `namespace/package` УИХ-ын гишүүн
Номын орон нутагт хэвлэхэд зөвшөөрөл олгох
тухайн тохиолдолд ашигласан өмчлөх ёсны эсвэл бүрэн эрхт зөвшөөрлийн загвар Kotodama
dapp нэрний орон зай. Global short aliases нь багцын ангиллын
эзэмшилт: `SetMusubiShortAlias` . `CanSetMusubiShortAlias`
зөвшөөрөлтэй, зорилтот багцын аль хэдийн хамгийн багадаа нэг идэвхтэй
Харилцааг чөлөөлөх.

## Iroha Гадаргуу {#iroha-surfaces}

Musubi 1-р ангиллын хэрэглээ Iroha заавар, асуултууд:

| Гадаргуу                      | Зорилго                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | Үргэлтгүй багцыг хэвлүүлэх.              |
| `YankMusubiRelease`          | Одоо байгаа нөөц нь хувирсан гэж тэмдэглэ үү.                |
| `SetMusubiShortAlias`        | Бүтээгдэхүүний тавилгаанд дэлхийн хэмжээнд зориулсан товч нэрсийг холбох. |
| `AssertMusubiReleaseExists`  | Тодорхой багц хувилбар байх шаардлагатай.       |
| `FindMusubiReleaseByRef`     | Тухайн багцын дуудлагаар нээлтийг ав.        |
| `FindMusubiPackageVersions`  | Багацааны тодруулгын хувилбар жагсаалт.                    |
| `FindMusubiPackageReleases`  | Барилгын тодрууллын товчлогыг жагсаалт.           |
| `SearchMusubiPackages`       | Тоног төхөөрөмжийн товчлогыг нэр орон зай болон текстээр хайж үзнэ үү.    |
| `FindMusubiShortAliasByName` | Удахгүй л товч нэрээ тодорхойлсон.                     |

Torii Энэ нь Musubi HTTP дэргэдэх маршрутын гэр бүл `/v1/musubi/*`.
Товчлогчийн өмнө MCP хэрэгсэл нь `iroha.musubi.*` Хэдэн нэртэй.
[Torii төгсгөл](/mn/reference/torii-endpoints.md) болон
[хайлтын дуудлага](/mn/reference/queries.md) өргөн хүрээний API Карта.
