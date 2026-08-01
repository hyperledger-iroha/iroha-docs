---
translation_locale: mn
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama багц {#musubi-kotodama-packages}

Musubi нь Kotodama эх үүсвэрийн багцыудын багц менежер юм. Энэ нь хөгжүүлэгчдэд дэлхийн хамгийн түрүүнд ирсэн нэрсийн жагсаалтын оронд SORA болон Iroha нэрний орон нутагт холбогдсон багцын тодорхойлогыг хадгалахын зэрэгцээ зохих Kotodama функцийг хуваалцах Cargo-тай адил ажлын урсгал олгодог.

Хэрэглэхэд Musubi -ийг ашигла:

- дахин ашиглах боломжтой Kotodama эх сурвалжийн номын санг хэвлүүлнэ
- `Musubi.lock` хэмжээнд тохирсон шилжих эх үүсвэрийн хамаарал нь тодорхой
- SoraFS архивын баталгаажуулсан үүрэг гүйцэтгэлээс шалтгаалсан эх үүсвэрийг сэргээн засварлах
- багцын нэр орон зайг ижил нэр орон зай дахь dapp гэрээний нууц үсэгт холбоно
- зах зээлийн бүртгэлээр дамжуулан багцыг шалгах, хэвлэх, татаж авах эсвэл нууц нэртэй

## Барилгын нэрүүд {#package-names}

Canonical багцын ID-ийг ашиглах:

```text
namespace/package
```

Тухайн нэвтрүүлгийн дуудлага ашиглах:

```text
namespace/package@version
```

`@` нь нэрний ордын өмнө тэргүүлэх тэмдэг байхгүй. `@` хуваагч нь хувилбарын хавсралтад зориулагдсан байна.

Нэр орон зайны сегмент Kotodama dapp гэрээний цогцолбоор ашиглаж буй хавсралтын үсэгтэй нийлэнэ:

|Барилгын ID |Үүнтэй холбоотой гэрээний нэрвэлийн хэлбэр |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Номын орон зай нь `<dataspace>` эсвэл `<domain>.<dataspace>` хэлбэртэй. Тус багц нь dapp холболттай бол Musubi нь холбогдох гэрээний аливаа нууц нэр томьёо нь багцтай ижил нэрсийн орон зайны хавсралтыг ашигладаг эсэхийг шалгаж байна.

## Өргөдсөн {#manifest}

Тус багц нь `Musubi.toml` гэж эхэлнэ:

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

Хөдөлгөөнд тулгуурлахад `1.*` гэх мэт тохирсон хувилбар, анхаарал хандуулах шаардлагууд, шилжилтийн шаардлага, галзуу карт эсвэл `>=1.0.0,<2.0.0` гэх мэт харьцуулах жагсаалтыг ашиглах боломжтой юм.

`Musubi.lock` нь сонгогдсон тэтгэврийн графийг зах зээлийн бүртгэлээс хадгалдаг. Хуцагдалтай түймэр бүр өөрийн каноникийн багц ref, сонгосон шаардлагыг, SoraFS манифест дигестыг, эх архив хаш, байт тоо, файлын тоо, экспортлосон функцын, тодорхойлох эх үүсвэрийн архив төлөвлөгөө, хамаарлын нууц нэрсийг хадгалах болно. Удахгүй нээлттэй нууц нэрүүд нь гулгалтын файл руу орж ирэхээс өмнө шийддэг.

## Орон нутгийн ажлын урсгал {#local-workflow}

Iroha ажлын байрны түлхнээс эхлээд, Musubi-ийг Cargo-д дамжуулан ажиллуулж:

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

`install --offline` -ийг ашиглан яг хувилбарын хамаарлын хувьд шийдвэрлэхгүй мөрийн файл бичнэ. CI -д `install --locked`-ийг ашиглан хуучин мөрийн файлыг татгалзаж болно.

`build` нь `math::add()` гэх мэт дуудлуудыг тодорхойлолттай дотоод Kotodama функцийн нэрүүдэд дахин бичиж хадгалах хамаарлын эх үүсвэрийг холбодог. Энэ нь тусгаар тогтнол экспортолсонгүй функцын дуудлыг татдаг. Musubi v1 номын сан нь зөвхөн функцтай байдаг: төрийн мэдэгдэл, триггер, котоба блок, байнгын эсвэл бусад функцгүй гэрээний зүйлсийг агуулсан хамаарлын эх үүсвэрүүдийг татгалздаг.

## Эх сурвалжийн архив авна {#fetching-source-archives}

Musubi нь хадгаламжийн дэд командруудыг шийдвэрлэх үед эсвэл дараагийн байдлаар алдагдалтай хараат байдлын эх үүсвэрийг олж авах боломжтой:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Амьдралтын даргыг авахад нэг эсвэл хэд хэдэн SoraFS даргын хангамжийн үзүүлэлтүүд ашигладаг:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Үйлчилгээний хэрэглэгчийн ачаалалтын файлууд болон галт тэрэгний үйлчилгээг үзэгчдийн нэг үйлдэлд харилцан тусгагдана. Хэрэв нэгээс илүү нууцлагдсан багцыг алдаж байгаа бол `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` эсвэл `manifest=<64-hex SoraFS manifest digest>` зэрэг галт тэрээний үйлчилгээг үзүүлэгчдэд хүрээлэн өгөх болно.

Газарны хаалга `base-url` болон `privacy-url` үнэ цэнэ нь ашиглах ёстой `https://` орон нутгийн туршилтын даргыг ашиглах боломжтой `http://localhost`, `http://127.0.0.1`, эсвэл `http://[::1]` зөвхөн `--gateway-allow-insecure-localhost`. Агаарын токенүүд нь гүйлгээний хугацааны итгэлийг бүрдүүлэх бөгөөд `Musubi.lock`.

## Газар хэвлэл {#publishing}

`pack` тодорхойлолт тооцоолдог BLAKE3-256 эх үүсвэрийн архив хэши болон эх сурвалжийн байт, файлын тоо. `--car-out`, `--sorafs-manifest-out`, эсвэл `--source-plan-out` Энэ нь мөн тодорхойлолттай SoraFS CAR хэрэглээний ачаалл, SoraFS нээлттэй, Musubi эх үүсвэрийн архивын төлөвлөгөө нь ижил эх үүсвэл файлын багтаас.

Ном хэвлэхээс өмнө угаах явцыг ашигла:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Үгүйгээр `--dry-run`, `publish` Үндсэн хуулийн төслүүдийг `.musubi/dist/<namespace>/<name>/<version>/`, сонголт ёсоор manifest болон ашиг ачааллыг дамжуулан борлуулдаг Torii Энэ бол SoraFS хадгаламжийн шилгээний төгсгөл нь `--upload`, олборлосон SoraFS нөөц, өргөн мэдүүлэг `PublishMusubiRelease` тохируулсан Iroha Хэрэглэгч.

Өргөн мэдүүлэгт дараах зүйлс байх ёстой:

- гаралгүй санхүүгийн эх үүсвэрийн архив
- тодорхойлох эх үүсвэрийн архив төлөвлөгөө
- Хамгийн багадаа нэг экспортлосон Kotodama функц
- хамааралтай байдлын бүртгэл нь татаж авсан чөлөөллийг сонгодоггүй
- гэрээний нууц үсэг нь багцын нэр орон зайтай нийцсэн dapp холболт,

## Тус бүртгэлийн асуултууд болон амьдралын мөрийг {#registry-queries-and-lifecycle}

Тус бүртгэлд хайж, шалгаарай:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking нь шинэ дутагдалтайгаар нэвтрүүлгийг нууж байгаа ч одоогийн замбараагүй файлуудыг дахин боловсруулах боломжтой болгодог:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi нь `namespace/package` хэмээх цогцолборын нэр болгоснаар дэлхийн нэрийг харамсалж болохгүй. Номын талбайд хэвлэх нь тухайн Kotodama dapp-ийн нэрний талбайд ашигласан ижил эзэмшигч эсвэл хүлээлгэн өгсөн зөвшөөрлийн загварын зөвшөөрөлтэй байх ёстой. `SetMusubiShortAlias` нь `CanSetMusubiShortAlias` зөвшөөрлийг шаарддаг бөгөөд зорилтот багцын аль хэдийн хамгийн багадаа нэг идэвхтэй гаргалт байх ёстой.

## Iroha Дэлгэрэнгүй {#iroha-surfaces}

Musubi нь нэгдүгээр ангиллын Iroha заавар, асуултыг ашигладаг:

|Гадаргын .|Зорилго|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Үргэлтгүй багцыг хэвлүүлэх. |
|`YankMusubiRelease` |Одоогоор гарч байгаа нэвтрүүлгийг татаж байна. |
|`SetMusubiShortAlias` |Бүтээгдэхүүний тодруулгыг дэлхийн хэмжээнд хуримтлах. |
|`AssertMusubiReleaseExists` |Тодорхой багц хувилбар байх ёстой. |
|`FindMusubiReleaseByRef` |Тухайн жагсаалтыг та бүхэнд хүргэе.|
|`FindMusubiPackageVersions` |Барилгын ID-ийн хувилбаруудыг жагсаал. |
|`FindMusubiPackageReleases` |Барилгын ID-ийн нэвтрүүлэгний товчлогыг жагсаалт. |
|`SearchMusubiPackages` |Тоног төхөөрөмжийн товчлогыг нэр орон зай, текстээр хайж үзээрэй. |
|`FindMusubiShortAliasByName` |Урьдчилсан богино нууц нэрийг шийд.|

Torii Энэ нь Musubi HTTP дэргэдэх маршрутын гэр бүл `/v1/musubi/`. Тус агент руу чиглэсэн MCP хэрэгсэл нь: `iroha.musubi.` Хууль зүйн нэрүүд. [Torii төгсгөлийн цэг](/mn/reference/torii-endpoints.md) болон [хайлтын дуудлага](/mn/reference/queries.md) өргөн хүрээний API Карта.
