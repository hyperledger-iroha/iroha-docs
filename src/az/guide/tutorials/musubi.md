---
translation_locale: az
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Paketlər {#musubi-kotodama-packages}

Musubi Kotodama mənbə paketləri üçün ilk buraxılış paketin idarəçisidir. Zəncirdə tam bir asılılıq qrafikini həll edir, SoraFS təsdiqləyir. mənbə arxivləri, seçilmiş iş məkanını tərtib edir və sınaqdan keçirir, kanonik CAR arxivlərini qurur və Iroha vasitəsilə dəyişməz buraxılışlar dərc edir.

Aşağıdakı hallarda Musubi istifadə edin:

- Yenidən istifadə edilə bilən Kotodama funksiya kitabxanalarını dərc etmək
- `Musubi.lock` ilə dəqiq keçid grafiqinə vurun
- SoraFS arxiv öhdəliklərindən asılılığın mənbəyini yenidən qurmaq
- Bir paket və ya çox paketli iş məkanının qurulması və sınaqdan keçirilməsi
- zəncirlə bağlı qeydiyyat vasitəsilə paketləri yoxlamaq, dərc etmək, çəkmək, saxlamaq və ya alias

## Paket adları {#package-names}

Canonical paket seçiciləri istifadə edir:

```text
namespace/package
```

Düzgün buraxılış identifikatorları bir versiya əlavə edir:

```text
namespace/package@version
```

Ad boşluğundan əvvəl heç bir lider `@` yoxdur. Bir ad sahəsi ya bir məlumat sahəsi kök kimi `universal` və ya domenə uyğun məlumat sahəsi, məsələn: `dex.universal`. Lider, bir paket tələb edilmədən əvvəl bu struktur ad sahəsini sabit bir ev məlumat sahəsinə bağlayır.

## Manifest və Lockfile {#manifest-and-lockfile}

Bir paketdə qapalı ilk buraxılışdan istifadə olunur `Musubi.toml` Şema. Manifesti elan etmək lazımdır `manifest-version = 1`, Kotodama nüsxəsi `"1"`, və IVM ABI versiyası `1`; alternativ manifest yoxdur və ya ABI üsul.

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

Bağımlılıqlar dəqiq versiyalardan, qayğı və ya tilde tələblərindən, `1.*` kimi vahid kartlarından və `>=1.0.0,<2.0.0` kimi virüslə ayrılmış müqayisəçi dəstlərindən istifadə edə bilər. Bağımlıluq cədvəlinin açarı ana-lokal idxal aliasıdır; `package` həmişə kanonik qeydiyyat seçicisidir.

`Musubi.lock` qrafi tam mənşədən alınan `NetworkId` və yekunlaşdırılmış qeydiyyat sürətinə bağlayır. Seçilmiş iş məkanının köklərini və dəyişməz buraxılış dərəcəsini qeyd edir, buraxılış, mənbə, interfeys, arxiv, ABI və dəqiq asılılıq kənarları öhdəlikləri daxil olmaqla. həll edilmiş grafinin tələb etdiyi zaman paralel versiyalara icazə verilir.

## Konfiqurasiya Taira SoraFS Getmək {#configure-taira-sorafs-fetching}

Taira bu iş axını üçün ictimai test şəbəkəsidir. Verili zəncir və şəbəkə kimliyi ilə Taira müştəri konfigurasiyasından başlayın, sonra aşağıda provayder xüsusi təsdiqlənmiş götürmə bağlarını əlavə edin. Hesabın imzalanması materialı və provayder operatoru açarları yalnız sahibkarlar üçün işləmə vaxtı sənədlərində qalmalıdır.

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

İctimai test şəbəkə kökündən Taira qəbul edilmiş provayderləri tapın:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Təchizatçı kataloq təchizatçı kimliklərini və elan edilən son nöqtələri təmin edir. Seçilmiş təchizatçıdan uyğunlaşdırıcı operator icazəsi alın. İndirmə vaxtı bu açarı sərhədli axın nömrələrini tələb etmək üçün istifadə edir; nömrələr nə CLI argumentləri, nə də qapanma faylının məzmunudur.

A istifadə etməyin Taira təsdiqləyici pin URL kimi `url`. Qeydiyyatdan keçmiş təsdiqləyicilər daxil edilmişdir. SoraFS saxlama məhdudlaşdırılmışdır. `https://taira-validator-{1,2,3,4}.sora.org` son nöqtələr pin qeydiyyatı qəbul edərək, arxiv oxumaları seçilmiş qəbul edilmiş provayderin HTTPS mənşəli.

## Yerli iş axını {#local-workflow}

Əvvəlcədən Iroha iş məkanının kökündən paketlər dizaynını yaratın və ya daxil edin və Musubi yük vasitəsilə çalıştırın:

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

`fetch` yekunlaşdırılmış qeydiyyat qrafikini həll edir, icazə verildikdə `Musubi.lock`-ni yeniləyir və təsdiqlənmiş SoraFS yerlərdən dəyişməz yerli kaş doldurur. `check`, `build`, `test` və `package` öz işlərindən əvvəl eyni qrafik və kaş yoxlamalarını aparırlar.

Qapalı fayl dəyişikliyini rədd etmək üçün `--locked` istifadə edin. Yalnız qeydiyyat indeksinin və tələb olunan hər bir arxivin əvvəlcədən saxlandığı zaman `--offline` istifadə edin. `--frozen` bu iki məhdudiyyəti birləşdirir. Offline kaş səhv edir; Musubi heç vaxt həll edilməmiş qapanı faylı yazmır.

Bağımlılıq mənbələri `math::add()` kimi keyfiyyətli çağırışların deterministik daxili Kotodama adlarına yenidən yazılması ilə əlaqələndirilir. İxrac edilməmiş bir funksiyaya bağlılıq çağırışı rədd edilir. Dövlətləşdirilmiş kitabxanalar funksiyaları açıqlayır; yerli `[[contract]]` və `[[test]]` hədəflər açıq paket hədəfləri olaraq qalırlar.

## Kaş verifikasiyası və təmiri {#cache-verification-and-repair}

İctimai saxlama əmrləri dəyişməz, qeydə alınmış arxivlərdə işləyir:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` karantin etibarlı nəsilləri pozur və dəqiq provayder sübutları buna icazə verdiyi zaman dəqiq arxivləri yenidən düzəldir. Musubi canlı boş olmayan kəsmə mutasiyasını rədd edir. Sınıflandırılmış namizədləri yoxlamaq üçün `--dry-run` istifadə edin.

## Qutlama və nəşr {#packaging-and-publishing}

Arxiv yazmadan əvvəl təmiz müsbət fayl dəstini yoxlayın, sonra kanonik paket qurun:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` yazır `target/package/<namespace>-<name>-<version>.car`. İndiki CAR kanonik paket manifestini, semantik buraxılış manifestini, dəqiq yoxlama qapanını, mənbə ağacını, interfeys həzmini bağlayır və SoraFS Arxiv öhdəliyi yoxdur. `pack`, `--car-out`, `--sorafs-manifest-out`, və ya `--source-plan-out` Əvvəlki buraxılışda əmrlər CLI.

Nəşr imzalanmış, bərpa edilə bilən bir şəbəkə iş axınıdır. Seçilmiş `client.toml` istehsalı `[musubi.publication]` bağlamaları, eləcə də hesab və Taira şəbəkənin konfigürasiyası olmalıdır.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

İstifadə `--detach` Əməliyyat jurnalı və toxum giriş sərhədi davamlı olduqda geri dönmək üçün. `publish --resume <operation-id> --config client.toml`. Daha dar olan `--recover <operation-id>` yol yalnız bir qədim girişdən əvvəlki jurnal üçün itkin dəyişməz yan avtomobillərini yenidən qurur. `--dry-run` və ya ümumi ictimai yükləmə fallback; qaçır `package --list` və `package` Yerli uçuşdan əvvəl.

## Qeydiyyat sualları və həyat dövrü {#registry-queries-and-lifecycle}

Taira müştəri konfigurasiyası ilə yekunlaşdırılmış qeydiyyatı axtarın və yoxlayın:

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

Yanking yeni qətnamələrdən dəyişməz bir buraxılışı istisna edir, mövcud dəqiq kilidlər təkrarlana bilər. Əvvəlcə cari yank yenidənqurmasını oxuyun, sonra müqayisə və düzəliş mutasiyasını təqdim edin:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

`unyank` istifadə eyni paket, versiya və təzə oxunmuş yenidən bu vəziyyətin geri qaytarılması üçün. Paket sahibi və saxlama rolları nəzarət yayımlamaq, yank, metadata Qlobal aliases öz qiymətli qeydiyyatına, yenidən hədəfləmə tarixinə və müqayisə-və müəyyənləşdirmə tənzimlənmələrinə malikdirlər; onlar paket mülkiyyətinin qısa yolları deyil.

## Iroha Səthlər {#iroha-surfaces}

Musubi ilk buraxılışın V1 təlimatlarını və suallarını istifadə edir:

|Səth |Məqsəd|
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Ad boşluğu sabit ev məlumat boşluğuna bağlayın. |
|`RegisterMusubiArchiveV1` |Dəyişməz bir təsdiqlənmiş mənbə arxiv öhdəliyi qeyd edin. |
|`AddMusubiArchiveLocationV1` |Əlavə etmək və ya yeniləmək sübut edilmiş SoraFS arxiv yeri. |
|`PublishMusubiReleaseV1` |Bir paket tələb edin və ya yeniləyin və bir dəyişməz buraxılış yayımlayın. |
|`SetMusubiReleaseYankV1` |Düzgün buraxılışın çıxarılmış vəziyyətini müqayisə edin və təyin edin. |
|`InviteMusubiPackageMaintainerV1` |Açıq paket rol çağırış axını başlatın. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Hökumət altında olan qlobal aliası qeydiyyatdan keçirin və ya yenidən hədəfləyin. |
|`AssertMusubiReleaseDigestV1` |Tam dəyişməz buraxılış həzmini təsdiqləyin. |
|`FindMusubiExactPackageV1` |Bir paket və onun dəyişikliklərini oxuyun. |
|`FindMusubiExactReleaseV1` |Bir dəqiq buraxılış görüntüsünü oxuyun. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Qeydiyyatdan çıxmış namizədləri həll edin və ya siyahıya alın. |
|`FindMusubiArchiveLocationsV1` |Təchizatçı tərəfindən dəstəklənənmiş arxiv yerlərini oxuyun. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Mövcud alias hədəfi və ya onun dəyişməz tarixini oxuyun. |

Torii tətbiq yolları ailəsinin aşkar edilməsi `/v1/musubi/`. MCP vasitələr axını istifadə `iroha.musubi.queries.` və `iroha.musubi.instructions.*` Adlar. [Torii son nöqtələri](/az/reference/torii-endpoints.md) və [sorğu istinadı](/az/reference/queries.md) daha geniş üçün API Xəritə.
