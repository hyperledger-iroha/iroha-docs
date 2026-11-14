---
translation_locale: az
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` standart Iroha 3 şəbəkə iştirakçısı demonudur. Cargo paketi `irohad` adlanır; buna görə ikili faylı mənbə kodu iş nüsxəsindən belə başladın:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

İctimai Taira testnet üçün buraxılış görüntüsü `iroha3d_taira` istifadə edir. O, eyni CLI-ü qəbul edir, lakin əlavə olaraq tək protokol-standartını tətbiq edir Taira zəncir, doğrulayıcı, yaddaş və iş vaxtı- imzalayan profili. Proqram icrası mühitinin etimadnamələrini açmadan Taira konfiqurasiyasını belə yoxlayın:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Kanonik Taira profilinin operator tərəfindən hazırlanmış formasından istifadə edin; depodakı şablonda hələ yerləşdirmə üçün əvəzedici dəyərlər var. Taira üzərində sınaq keçirərkən onu ümumi SORA Nexus və ya istehsal SoraFS parametrləri ilə əvəz etməyin.

## `--config` {#arg-config}

- Növ: fayl yolu
- Ləqəb: `-c`

[şəbəkə tərəfdaşının konfiqurasiyası](/az/reference/peer-config/index.md) üçün yol.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Növ: fayl yolu

Konsensusun təsdiqi üçün istifadə olunan könüllü blokzincir genesis texniki manifesti JSON.

## `--check-config` {#arg-check-config}

Həll olunmuş konfiqurasiyanı və mövcud blokçeyn başlanğıc materialını yoxlayın, sonra şəbəkə soketlərinə bağlanmadan çıxın.

## `--json` {#arg-json}

- **Növ:** bayraq
- **Tələb edir:** `--check-config`

Bu yığımın və konfiqurasiyanın uyğunluq qiymətlərini `Ready` və ya `Pending` sətri əvəzinə bir Norito JSON obyekti kimi çıxarır.

## `--check-storage` {#arg-check-storage}

- **Növ:** bayraq
- **Birgə istifadə edilmir:** `--check-config`

Dayandırılmış qovşağın Kura anbarını və ən yeni anlıq görüntüsünü bu yığımın dekoderləri ilə yalnız oxuma rejimində yoxlayır, nəticəni bir Norito JSON obyekti kimi çıxarır və uğursuzluqda sıfırdan fərqli çıxış kodu qaytarır. Yoxlama Kura anbar kökünün kilidini alır, buna görə işləyən qovşağın sahib olduğu anbarı rədd edir. Anbarı heç vaxt dəyişmir və yalnız icra zamanı istifadə olunan sirləri açmır.

## `--check-replay` {#arg-check-replay}

- **Növ:** bayraq
- **Birgə istifadə edilmir:** `--check-config`, `--check-storage`

Dayandırılmış qovşağın anbarının nüsxəsini bu yığımla yenidən icra edir və nəticəni bir Norito JSON obyekti kimi çıxarır. Əmr blokları müvəqqəti qovluğa köçürür, orada ən yeni anlıq görüntünü bərpa edir və ya imzalanmış genezisi yenidən icra edir, sonra bütün sonrakı blokları yenidən icra edir. Blok sertifikatlaşdırılmış nəticəsini təkrar yaratmadıqda və ya tələb olunan blok gövdəsi çatışmadıqda sıfırdan fərqli çıxış kodu qaytarır; anbara heç vaxt yazmır və yalnız icra zamanı istifadə olunan sirləri açmır.

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **Növ:** hesab ID-si
- **Tələb edir:** `--check-config`

Oflayn yoxlama zamanı dəqiq imzalanmış genezis icra olunduqdan sonra bu qeydiyyatdan keçmiş hesabın SoraCloud yerləşdirmə səlahiyyətini saxlamasını tələb edir.

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **Növ:** bayraq

Yalnız bu başlanğıc üçün qovşağın konsensus açarlarının bu zəncirdə əvvəllər heç imza atmadığını təsdiq edir. Sumeragi hər açar üçün təhlükəsizlik qeydi saxlayır; belə qeyd olmadıqda, qeydin itirilmədiyinə dair sübut əldə edənədək heç nə imzalamır. Bu bayrağı yeni açarın ilk işə salınmasında bir dəfə ötürün və məlumat itkisindən sonra heç vaxt ötürməyin.

## `--trace-config` {#arg-trace-config}

- Növ: bayraq
- Mühit: `TRACE_CONFIG`

Konfiqurasiya təbəqələri oxunub təhlil edilərkən iz yazılarını aktiv edin.

## `--config-blake3` {#arg-config-blake3}

- Növ: 64-rəqəmli onaltılıq BLAKE3 kriptoqrafik xülasə dəyəri
- Tələb olunur: `--config`

Konfiqurasiya faylının baytlarının verilmiş kriptoqrafik diqest dəyəri ilə uyğun olmasını tələb edin. Bütövlüyə bağlı fayl düzləşdirilməlidir; o, `extends` ehtiva edə bilməz.

## `--terminal-colors` {#arg-terminal-colors}

- Növ: Boolean, `--terminal-colors=true` və ya `--terminal-colors=false` kimi ötürülür
- Defolt: terminalların imkanlarını aşkar etmək
- Mühit: `TERMINAL_COLORS`

ANSI-rəngli çıxışı idarə edin.

## `--language` {#arg-language}

- Növ: mətn

Daemon mesajları üçün istifadə olunan sistemi dilini dəyişdirin.

## `--sora` {#arg-sora}

- Növ: bayraq
- Mühit: `IROHA_SORA_PROFILE`

SoraFS, SoraNet əl sıxması və çoxzolaqlı konsensusun istifadə etdiyi SORA Nexus profilini aktivləşdirir. Taira başlatma proqramı həmişə bu bayraqla çağırılır.

## FastPQ ləğv edir {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` və `--fastpq-poseidon-mode <MODE>` yalnız `cpu` və ya `gpu` qəbul edir. Qalan seçimlər telemetriya etiketlərini üstələyir:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Məsələn:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Yaradılmış kömək {#generated-help}

Yuxarıdakı seçim xülasəsi sabitlənmiş Iroha commit-indəki `iroha3d` arqument təriflərinə əsaslanır. Öz mənbə nüsxəniz üçün dəqiq kömək mətnini yoxlamaq üçün bunu işlədin:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
