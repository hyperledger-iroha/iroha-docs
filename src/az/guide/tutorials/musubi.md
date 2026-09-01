---
translation_locale: az
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama Paketlər {#musubi-kotodama-packages}

Musubi Kotodama mənbə paketləri üçün ilk buraxılış paket meneceridir. O, dəqiq zəncirdəki asılılıq qrafını həll edir, SoraFS mənbəni autentifikasiya edir seçilmiş iş sahəsini arxivləşdirir, tərtib edir və sınaqdan keçirir, tək protokol-standart CAR arxivlərini qurur və dəyişməz versiyaları Iroha vasitəsilə yayımlayır.

İhtiyacınız olduqda Musubi-dən istifadə edin:

- təkrar istifadəyə yararlı Kotodama funksiyalar kitabxanalarını dərc edin
- `Musubi.lock` daxilində dəqiq ötürücü qrafı pin edin
- bitmiş SoraFS arxiv kriptoqrafik öhdəlik dəyərlərindən asılılıq mənbəyini yenidən qurmaq
- bir paket və ya çox paketli iş mühitini qurmaq və sınaqdan keçirmək
- paketləri zəncirdəki qeydiyyat vasitəsilə yoxlamaq, yayımlamaq, dartmaq, saxlamaq və ya təxəllüs vermək

## Paket Adları {#package-names}

tək protokol-standart paket seçicilərindən istifadə:

```text
namespace/package
```

Dəqiq buraxılış identifikatorları versiyanı əlavə edir:

```text
namespace/package@version
```

Bir ad sahəsinin əvvəlində heç bir `@` yoxdur. Bir ad sahəsi ya `universal` kimi bir məlumat sahəsi kökü, ya da `dex.universal` kimi domen-təyin olunmuş məlumat sahəsidir. Blokçeyn dəftəri bu struktur ad sahəsini paketi iddia etmədən əvvəl bir sabit ev məlumat sahəsinə bağlayır.

## texniki manifest və Lockfile {#manifest-and-lockfile}

Bir paket bağlı ilk buraxılış `Musubi.toml` sxeməsindən istifadə edir. Texniki manifesto `manifest-version = 1`, Kotodama nəşr `"1"` və IVM ABI versiya `1`-ü elan etməlidir; alternativ texniki manifesto və ya ABI rejimi yoxdur.

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

Asılılıqlar dəqiq versiyalardan, qayçı (caret) və ya tilde tələblərindən, `1.*` kimi joker simvollardan və `>=1.0.0,<2.0.0` kimi vergüllə ayrılmış müqayisə dəstlərindən istifadə edə bilər. Asılılıq cədvəlinin açarı valideyn-lokal idxal təxəllüsüdür; `package` həmişə tək protokol-standart reyestr seçicisidir.

`Musubi.lock` qrafı dəqiq başlanğıcdan törəyən `NetworkId` və yekunlaşdırılmış qeydiyyat anbarına bağlayır. O, seçilmiş iş sahəsi köklərini və dəyişməz buraxılış düyünlərini qeyd edir, buraya buraxılış, mənbə, interfeys, arxiv, ABI və dəqiq asılılıq-kənar kriptoqrafik öhdəlik dəyərləri daxildir. Həll olunmuş qrafik tələb etdikdə paralel versiyalara icazə verilir.

## Taira SoraFS Konfiqurasiya edilir, alınır {#configure-taira-sorafs-fetching}

Taira bu iş axını üçün ictimai test şəbəkəsidir. Yoxlanılmış zəncir və cari sabitlənmiş genesis-dən törəmə şəbəkə şəxsiyyəti ilə Taira müştəri konfiqurasiyasından başlayın, sonra isə aşağıda provayder-əsaslı autentifikasiya olunmuş fetch bağlamalarını əlavə edin. Bir Taira sıfırlaması `NetworkId`-ı dəyişə bilər; onu sabit zəncir UUID-dən nəticə çıxarmaq əvəzinə imzalanmış yerləşdirmə profilindən yeniləyin. Hesab imzalama materialı və təminatçı operator açarları yalnız sahibin icra mühitindəki proqram fayllarında qalmalıdır.

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

İctimai testnet kökündən Taira-in qəbul edilmiş təminatçılarını kəşf edin:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Təchizatçı kataloqu təchizatçı kimliklərini və elan edilmiş API son nöqtələrini təqdim edir. Seçilmiş təchizatçıdan uyğun operator icazəsini əldə edin. Proqramın icra mühiti həmin açardan bağlı axın tokenlərini tələb etmək üçün istifadə edir; tokenlər həm CLI arqumentləri, həm də kilidləmə faylı məzmunu deyildir.

İstifadə etməyin Taira doğrulayıcı pin URL kimi `url`. Qeydiyyatdan keçmiş təsdiqləyicilər daxil edilib SoraFS yaddaş deaktiv edilib. Onların `https://taira-validator-{1,2,3,4}.sora.org` API son nöqtələr pin qeydiyyatını qəbul edir, arxiv oxumaları isə seçilmiş təsdiqlənmiş provayderdən istifadə edir HTTPS mənbə

## Yerli İş Axını {#local-workflow}

Yuxarı axın Iroha iş sahəsi kökündən, paket qovluğunu yaradın və ya ora daxil olun və Cargo vasitəsilə Musubi işlədin:

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

`fetch` yekunlaşdırılmış qeydiyyat qrafikini həll edir, icazə verildikdə `Musubi.lock`-i yeniləyir və autentifikasiya edilmiş SoraFS yerlərindən dəyişməz yerli keşini doldurur. `check`, `build`, `test` və `package` öz işlərinə başlamazdan əvvəl eyni qrafik və keş yoxlamalarını həyata keçirirlər.

`--locked`-dən hər hansı bir kilid faylı dəyişikliklərini rədd etmək üçün istifadə edin. `--offline`-dən yalnız həm reyestr indeksi, həm də tələb olunan bütün arxivlər artıq keşdə olduqda istifadə edin. `--frozen` bu iki şərti birləşdirir. Offline keşdə çatışmazlıq baş verir; Musubi heç vaxt həll olunmamış kilid faylını yazmır.

Asılılıq mənbələri, `math::add()` kimi ixtisaslaşdırılmış texniki çağırışları deterministik daxili Kotodama adlara yenidən yazarq əlaqələndirilir. Bir asılılıq texniki İxrac edilmemiş funksiyaya çağırış rədd olunur. İdxal edilmiş kitabxanalar funksiyaları ortaya qoyur; yerli `[[contract]]` və `[[test]]` hədəflər açıq paket hədəfləri olaraq qalır.

## Keşin Yoxlanılması və Təmir Edilməsi {#cache-verification-and-repair}

İctimai cache əmrləri, qeydiyyatda dərc olunmuş dəyişməz arxivlərdə işləyir:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` etibarlı nəslini qarantinə alır və yekunlaşdırılmış təminatçı sübutu icazə verdikdə dəqiq arxivləri yenidən götürür. Budama canlı boş olmayan mutasiya üçün qəsdən bağlanmış uğursuzluq şəklindədir; təsnif edilmiş namizədləri yoxlamaq üçün `--dry-run`-dən istifadə edin.

## Qablaşdırma və Yayım {#packaging-and-publishing}

Arxivi yazmazdan əvvəl təmiz müsbət fayl dəstini yoxlayın, sonra tək protokol-standart paketini qurun:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` yazır `target/package/<namespace>-<name>-<version>.car`. CAR tək protokol-standart paketi texniki manifestini, semantik buraxılış texniki manifestini, dəqiq yoxlama kilidini, mənbə ağacını bağlayır, interfeys kriptoqrafik xülasə dəyəri və SoraFS arxiv kriptoqrafik öhdəlik dəyəri. İlk buraxılış CLI-də ayrıca `pack`, `--car-out`, `--sorafs-manifest-out` və ya `--source-plan-out` əmrləri yoxdur.

Nəşr imzalanmış, bərpa edilə bilən şəbəkə iş axınıdır. Seçilmiş `client.toml` tələb olunan `[musubi.publication]` bağlanmaları, həmçinin hesab və Taira şəbəkə konfiqurasiyasını daxil etməlidir. Dəqiq olaraq bir iş sahəsi üzvünü paketləyin:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Əməliyyat jurnalı və toxum-ingress sərhədi davamlı olduqdan sonra geri qayıtmaq üçün `--detach`-dən istifadə edin. Davamlı bir əməliyyatı `publish --resume <operation-id> --config client.toml` ilə davam etdirin. Daha dar `--recover <operation-id>` yolu yalnız yenidən qurur təmiz əvvəlcədən daxil edilmiş jurnal üçün əskik dəyişməz əlavə qeydlər. Nəşr `--dry-run` və ya ümumi ictimai yükləmə ehtiyatı yoxdur; yerli qabaqcadan yoxlama üçün `package --list` və `package`-i işlədin.

## Qeydiyyat Sorğuları və Həyat Dövrü {#registry-queries-and-lifecycle}

Eyni Taira müştəri konfiqurasiyası ilə yekunlaşdırılmış reyestri axtarın və yoxlayın:

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

Yank, mövcud dəqiq kilidlər yenidən yaradılabilər halda qalarkən, dəyişməz bir buraxılışı yeni qərarlardan çıxarır. Əvvəlcə cari yank dəyişikliyini oxuyun, sonra isə müqayisə-və-təyinat mutasiyasını təqdim edin:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

O vəziyyəti geri çevirmək üçün eyni paket, versiya və yeni oxunmuş reviziya ilə `unyank` istifadə edin. Paket sahibi və tərtibatçı rolları yayımlama, geri çəkmə, metadataları idarə edir, və arxiv-lokasiya icazələri. Qlobal əlaltılar öz qiymətli qeydiyyatı, yenidən hədəfləmə tarixi və müqayisə-və-təyin yeniləmələrinə malikdirlər; onlar paket mülkiyyəti üçün qısayollar deyillər.

## Iroha Səthlər {#iroha-surfaces}

Musubi ilk buraxılış V1 təlimatları və sorğularından istifadə edir:

|Səth|Məqsəd|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |Bir ad sahəsini sabit ev məlumat məkanına bağlayın.|
| `RegisterMusubiArchiveV1`                            |Dəyişməz təsdiqlənmiş mənbə arxivinin kriptoqrafik öhdəlik dəyərini qeydiyyatdan keçirin.|
| `AddMusubiArchiveLocationV1`                         |Sınaqdan çıxmış SoraFS arxiv yerini əlavə edin və ya yeniləyin.|
| `PublishMusubiReleaseV1`                             |Bir paketi tələb edin və ya yeniləyin və bir dəyişməz buraxılış dərc edin.|
| `SetMusubiReleaseYankV1`                             |Dəqiq buraxılışın çıxarılmış vəziyyətini müqayisə edib təyin et.|
| `InviteMusubiPackageMaintainerV1`                    |Açıq paket rolu dəvət axınını başladın.|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |İdarə olunan qlobal əvəzetməni qeydiyyatdan keçirin və ya yenidən hədəfləyin.|
| `AssertMusubiReleaseDigestV1`                        |Dəqiq dəyişməz buraxılış kriptoqrafik xülasə dəyərini təsdiqləyin.|
| `FindMusubiExactPackageV1`                           |Bir paket və onun dəyişikliklərini oxuyun.|
| `FindMusubiExactReleaseV1`                           |Bir dəqiq buraxılış anının surətini oxuyun.|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Həll edin və ya təsdiqlənmiş buraxılış namizədlərini siyahıya alın.|
| `FindMusubiArchiveLocationsV1`                       |Təklif olunmuş təminatçı tərəfindən dəstəklənən arxiv yerlərini oxuyun.|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     |Cari alias hədəfini və ya onun dəyişməz tarixçəsini oxuyun.|

Torii tətbiq marşrutu ailəsini `/v1/musubi/*` altında göstərir. MCP alətləri mövcud `iroha.musubi.queries.*` və `iroha.musubi.instructions.*` adlarından istifadə edir. Daha geniş API xəritəsi üçün [Torii API son nöqtələr](/az/reference/torii-endpoints.md) və [sorğu istinadı](/az/reference/queries.md) baxın.
