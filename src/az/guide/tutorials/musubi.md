---
translation_locale: az
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Paketlər {#musubi-kotodama-packages}

Musubi Kotodama mənbə paketləri üçün paket idarəçisidir. Bu, inkişaf etdiricilərə qlobal ilk gələn ad cədvəlinin əvəzinə SORA və Iroha ad məkanlarına bağlı olaraq paket kimliyini saxlayaraq komponable Kotodama funksiyalarını bölüşmək üçün Cargo bənzər bir iş axını verir.

Aşağıdakı hallarda Musubi istifadə edin:

- Yenidən istifadə edilə bilən Kotodama mənbə kitabxanalarını dərc etmək
- `Musubi.lock` üzrə dəqiq keçid mənbələrindən asılılıqlar
- SoraFS arxiv öhdəliklərindən asılılıq mənbəyini yenidən qurmaq
- paket ad sahəsini eyni ad sahəsindəki dapp müqavilə aliasları ilə bağlayın
- zəncirlə bağlı qeydiyyat vasitəsilə paketləri yoxlamaq, nəşr etmək, çəkmək və ya alias etmək

## Paket adları {#package-names}

Canonical paket kimliklərinin istifadəsi:

```text
namespace/package
```

Düzgün buraxılış istinadları istifadə:

```text
namespace/package@version
```

Ad boşluğundan əvvəl `@` başlıca yoxdur. `@` ayırıcı versiya sufiksi üçün ayrılmışdır.

Adlar sahəsi bölməsi Kotodama dapp müqavilə əlifbası ilə istifadə olunan sufikslə uyğundur:

|Paket id |Əlaqəli müqavilə adının forması |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Ad boşluqları ya `<dataspace>` və ya `<domain>.<dataspace>` formasına malikdirlər. Bir paketdə dapp bağlantısı varsa, Musubi hər bir əlaqəli müqavilə aliasının paketlə eyni ad boşluğu sufiksin istifadə etdiyini yoxlayır.

## Məlumat {#manifest}

Bir paket `Musubi.toml` ilə başlayır:

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

Təsadüfiyyətlər dəqiq versiyalardan, qayğı tələblərindən, tilde tələblərindən, `1.*` kimi vahid kartlardan və ya `>=1.0.0,<2.0.0` kimi müqayisə siyahılarından istifadə edə bilər.

`Musubi.lock` seçilmiş keçidli qrafiyanı zəncirlə bağlı qeydiyyatdan qeyd edir. Hər bir kilidli nod öz kanonik paket ref, seçilmiş tələb, SoraFS manifest digest, mənbə arxivini hash, bayt sayımı, fayl sayımı, ixrac edilmiş funksiyaları, deterministik mənbə arxivi planı və asılılıq aliaslarını saxlayır. Qısa aliaslar kilidləmədən əvvəl həll edilir.

## Yerli iş axını {#local-workflow}

Yuxarıdakı Iroha iş məkanı kökündən Musubi yük vasitəsilə işlətmək:

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

`install --offline` -dən istifadə edərək bir düyünə müraciət etmədən dəqiq versiya asılılıqları üçün həll edilməmiş kilid faylını yazın. CI -dəki `install --locked` -dən istifadə edin ki, köhnəlmiş kilidfaylini rədd edin.

`build` `math::add()` kimi çağırışları deterministik daxili Kotodama funksiya adlarına yenidən yazaraq saxlanmış asılılıq mənbələrini əlaqələndirir. Musubi v1 kitabxanaları yalnız funksiyaya aiddir: dövlət bəyannamələri, tetiklər, kotoba blokları, sabitlər və ya digər qeyri-funksiyalı müqavilə maddələri olan bağlılıq mənbələri rədd edilir.

## Mənbə Arxivləri gətirmək {#fetching-source-archives}

Musubi həll edərkən və ya daha sonra saxlama alt əmrləri vasitəsilə yox olan asılılıq mənbələrini ala bilər:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Canlı qapı çatdırmalarında bir və ya daha çox SoraFS qapı təchizatçısı xüsusiyyətlərindən istifadə olunur:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Təchizatçı payload faylları və qapı provayderləri bir yükləmə əməliyyatı üçün qarşılıqlı olaraq ayrıdırlar. Birdən çox kilidli paket yoxdursa, hər qapı provayderi `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` və ya `manifest=<64-hex SoraFS manifest digest>` ilə əhatə edin.

Qapı. `base-url` və `privacy-url` qiymətləri istifadə etmək lazımdır `https://` Standart olaraq. Yerli test qapıları istifadə edə bilər `http://localhost`, `http://127.0.0.1`, və ya `http://[::1]` yalnız `--gateway-allow-insecure-localhost`. Axın simvolları iş vaxtı təsdiqlərdir və daxil edilmir `Musubi.lock`.

## Nəşriyyat {#publishing}

`pack` Deterministik hesablama BLAKE3-256 mənbə arxivini hash əlavə mənbə bayt və fayl sayılır. `--car-out`, `--sorafs-manifest-out`, və ya `--source-plan-out` təchiz olunur, o da müəyyənləşdirici qurur SoraFS CAR payload, SoraFS açıqlanıb və Musubi mənbə arxiv planı eyni mənbə fayl dəstindən.

Nəşr edilməzdən əvvəl quru bir sürüşmə istifadə edin:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Heç bir `--dry-run`, `publish` default əşyaları aşağıda yazır `.musubi/dist/<namespace>/<name>/<version>/`, seçim yolu ilə manifest və payload yükləyir Torii Bu ... SoraFS saxlama pin son nöqtəsi ilə `--upload`, istehsal olunan SoraFS pin, və təqdim edir `PublishMusubiRelease` konfiqurasiya edilmiş Iroha Müştəri.

Nəşr olunan məlumatlar aşağıdakıları əhatə edir:

- boş olmayan kanonik mənbə arxivü
- Deterministik mənbə arxiv planı
- Ən azı bir ixrac edilən Kotodama funksiyası
- Çıxılmış buraxılışları seçməyən asılılıq qeydləri
- müqavilə əlifbaları paket ad boşluğuna uyğun olan bir dapp bağlantısı, mövcud olduqda

## Qeydiyyat sualları və həyat dövrü {#registry-queries-and-lifecycle}

Reyestrə baxın və yoxlayın:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking yeni çözünürlükdən bir buraxılışı gizlədirir, lakin mövcud qapalı faylları təkrarlana biləcək olaraq saxlayır:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi, `namespace/package` kanoniki paket adını yaratmaqla qlobal ad əhatəsinin qarşısını alır. Ad boşluğuna nəşr etmək həmin Kotodama dapp ad boşluğu üçün istifadə olunan eyni mülkiyyət və ya səlahiyyətli icazə modeli tərəfindən icazə verilməlidir. Curated global short aliases package ownership-dan ayrıdır: `SetMusubiShortAlias` üçün `CanSetMusubiShortAlias` icazəsi lazımdır və hədəf paketində artıq ən azı bir aktiv buraxılış olmalıdır.

## Iroha Səthlər {#iroha-surfaces}

Musubi birinci dərəcəli Iroha təlimatları və sorğuları istifadə edir:

|Səth |Məqsəd|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Dəyişməz paket yayımını dərc edin. |
|`YankMusubiRelease` |Mövcud bir buraxılışı çəkilmiş kimi qeyd edin. |
|`SetMusubiShortAlias` |Qloballaşdırılmış bir qlobal qısamüddətli aliası paket kimliyinə bağlayın. |
|`AssertMusubiReleaseExists` |Təbii paket versiyasının mövcudluğu tələb olunur. |
|`FindMusubiReleaseByRef` |Paketin dəqiq istinadına əsasən bir buraxılış alın.|
|`FindMusubiPackageVersions` |Paket kimliyi üçün versiyaları siyahıya alın. |
|`FindMusubiPackageReleases` |Bir paket kimliyini təqdim etmək üçün buraxılışların ümumiləşdirilməsini siyahıya alın. |
|`SearchMusubiPackages` |Namespace və mətn ilə paketlərin ümumiləşdirmələrini axtarın. |
|`FindMusubiShortAliasByName` |Qısa bir alimi həll edin. |

Torii Bu, Musubi HTTP keçid ailəsi `/v1/musubi/`. Agentlə üzləşmək MCP vasitələr kimi aşkar edilir `iroha.musubi.` - Görürsən? [Torii son nöqtələr](/az/reference/torii-endpoints.md) və [sorğu istinadı](/az/reference/queries.md) daha geniş üçün API Xəritə.
