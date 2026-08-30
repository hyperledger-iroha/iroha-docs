---
translation_locale: az
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` standart Iroha 3 peer daemondur. Cargo paketi `irohad` adlanır, buna görə də ikili bir mənbə hesabından çağırın:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

İctimaiyyət üçün Taira testnet, buraxılış görüntüsü `iroha3d_taira` istifadə edir. Eyni CLI qəbul edir. O, həmçinin kanonik Taira zəncirini, təsdiqləyici dəstini, saxlama parametrlərini və icra vaxtının imzalanması açarlarını tətbiq edir. Taira konfigürasiyasını aşağıdakı kimi icra vaxtının təsdiqini açmadan təsdiqləyin:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

İstifadəçi istifadədən əvvəl kanonik Taira profilini təqdim etməlidir. Qeydiyyatdan keçmiş şablonun nümunə parametrləri var. Operator bütün nümunə parametrlərini əvəz etməlidir. Taira ilə müqayisədə test edərkən ümumi Nexus və ya istehsal SoraFS parametrlərindən istifadə etməyin.

## `--config` {#arg-config}

- Tipi: fayl yolu
- Alias: `-c`

[ peer konfigurasiyasına gedən yol ](/az/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipi: fayl yolu

Konsensus təsdiqlənməsi üçün istifadə olunan seçməli genesis manifestı JSON.

## `--check-config` {#arg-check-config}

Qeydiyyatlı konfigüratsiyanı və mövcud genesis materialını təsdiqləyin, sonra bağlanmayan şəbəkə socketləri olmadan çıxın.

## Kagemusha təsnifat möhürləri {#kagemusha-qualification-seals}

Bu sənəd yolu seçimləri `--check-config` tələb edir və kanonik möhür yazmadan əvvəl tam Kagemusha ixtisasını yerinə yetirir:

- `--write-kagemusha-catalog-qualification-seal <PATH>` kataloqa uyğunlaşdırır.
- `--write-kagemusha-validator-qualification-seal <PATH>` yerli təsdiqləyicini konfiqurasiya edilmiş imzalanan promosyon rezervasyonuna uyğunlaşdırır.

İki möhür seçimi bir-biri ilə ziddiyyət təşkil edir.

## `--trace-config` {#arg-trace-config}

- Tip: bayraq
- Ətraf mühit: `TRACE_CONFIG`

Konfiqurasiya təbəqələrinin oxunduğu və təhlil edildiyi müddətdə izləmə qeydlərini aktivləşdirin.

## `--config-blake3` {#arg-config-blake3}

- Tip: 64 rəqəmli hexadecimal BLAKE3 həzm
- Tələblər: `--config`

Konfiqurasiya faylının baytlarını təqdim edilmiş digestə uyğunlaşdırmaq üçün tələb edin. Bütünlüklə bağlı bir fayl düzləşdirilməlidir; `extends` içərisində ola bilməz.

## `--terminal-colors` {#arg-terminal-colors}

- Tipi: `--terminal-colors=true` və ya `--terminal-colors=false` kimi qəbul edilmiş boolean
- Standart: terminal qabiliyyətinin aşkarlanması
- Ətraf mühit: `TERMINAL_COLORS`

Kontrol ANSI rəngli çıxışı.

## `--language` {#arg-language}

- Tip: xətti

Daemon mesajları üçün istifadə olunan sistem dilini ləğv edin.

## `--sora` {#arg-sora}

- Tip: bayraq
- Ətraf mühit: `IROHA_SORA_PROFILE`

Sora Nexus profilini aktivləşdirin. Bu profil SoraFS, SoraNet əl sıxışını və bir çox yollu konsensusı qurur. Həmişə bu bayraqla Taira fırlatıcıya müraciət edin.

## FastPQ üstünlükləri {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` və `--fastpq-poseidon-mode <MODE>` yalnız `cpu` və ya `gpu` qəbul edir. Qalan variantlar telemetriya etiketlərinə üstünlük verir:

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

## İstehsal olunmuş yardım {#generated-help}

Aşağıda göstərilən tam çıxış Iroha mənbə komitindən əldə edilir.

<<< @/snippets/iroha3d-help.md
