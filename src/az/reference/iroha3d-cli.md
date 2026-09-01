---
translation_locale: az
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
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

Tək protokol-standart Taira profilinin operator tərəfindən təqdim olunan formasından istifadə edin; qeydiyyata alınmış şablon hələ də yerləşdirmə yerlərini ehtiva edir. Taira-ə qarşı test edərkən ümumi Nexus və ya istehsal SoraFS parametrlərini əvəz etməyin.

## `--config` {#arg-config}

- Növ: fayl yolu
- Ləqəb: `-c`

[şəbəkə tərəfdaşının konfiqurasiyası](/az/reference/peer-config/index.md) üçün yol.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Növ: fayl yolu

Konsensusun təsdiqi üçün istifadə olunan könüllü blokzincir genesis texniki manifesti JSON.

## `--check-config` {#arg-check-config}

Həll olunmuş konfiqurasiyanı və mövcud blokçeyn başlanğıc materialını yoxlayın, sonra şəbəkə soketlərinə bağlanmadan çıxın.

## Kagemusha ixtisas möhürləri {#kagemusha-qualification-seals}

Bu fayl yolu seçimləri `--check-config` tələb edir və tək bir protokol-standart möhür yazmadan əvvəl tam Kagemusha sertifikatlaşdırmasını həyata keçirir:

- `--write-kagemusha-catalog-qualification-seal <PATH>` kataloqu təsdiqləyir.
- `--write-kagemusha-validator-qualification-seal <PATH>` yerli yoxlayıcını konfiqurasiya edilmiş imzalanmış təşviq rezervi ilə təsdiqləyir.

İki möhür variantı bir-biri ilə ziddiyyət təşkil edir.

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

SoraFS tərəfindən istifadə olunan Sora Nexus profilini, SoraNet əl sıxışmasını və çoxsəviyyəli konsensusu aktiv edin. Taira işə salıcısı həmişə bu bayraqla çağırılır.

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

Yuxarıdakı seçim xülasəsi mövcud `iroha3d` arqument tərifləri ilə yoxlanılıb. Yoxlanılmış yaradılan kömək nöqtəsindəki məlumat görünüşü, mənşəyinin statusu gözləmə vəziyyətində olduğu üçün qəsdən göstərilmir. Çıxarmanız üçün dəqiq kömək məlumatını yoxlamaq üçün aşağıdakı əmri icra edin:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
