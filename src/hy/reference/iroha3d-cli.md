---
translation_locale: hy
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` է ստանդարտ Iroha 3 զուգընկերային դեյմոն: Cargo փաթեթը կոչվում է `irohad`, այնպես որ հրավիրեք բինարային աղբյուրից ստուգման հետ:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Հասարակական Taira թեստային ցանցի համար, թողարկման պատկերն օգտագործում է `iroha3d_taira`: Այն ընդունում է նույնը CLI. Այն նաեւ ուժի մեջ է մտնում Taira կանոնիկ շղթան, վավերացնող հավաքածու, պահեստավորման կարգավորումները եւ գործնական ժամկետի ստորագրման բանալիները: Վավերացրեք Taira կոֆիգուրացիան առանց բացելու վարկային ժամանակահատվածի հավատարմագրեր, ինչպիսիք են հետեւյալը.

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Օպերատորը պետք է նախքան օգտագործումը ներկայացնի Taira կանոնիկ պրոֆիլը: Գրանցված ձեւանմուշը պարունակում է օրինակային կարգավորումներ: Օպերատորը պետք է փոխարինի յուրաքանչյուր օրինակային կարգավորումը: Չօգտագործել Nexus կամ արտադրության SoraFS պարամետրերը, երբ փորձարկում են Taira-ի նկատմամբ:

## `--config` {#arg-config}

- Տիպ: ֆայլերի ուղին
- Անանուններ: `-c`

Ճանապարհ դեպի [ զուգընկերների կարգավորումը ](/hy/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Տիպ: ֆայլերի ուղին

Ընտրական գենեզի մանիֆես JSON, որն օգտագործվում է համաձայնության հաստատման համար:

## `--check-config` {#arg-check-config}

Վավերացրեք լուծված կոնֆիգուրացիան եւ մատչելի գեներիզային նյութը, ապա դուրս եկեք առանց կապելու ցանցային սոցետները:

## Kagemusha որակավորման կնիքներ {#kagemusha-qualification-seals}

Այս ֆայլերի ուղու ընտրանքները պահանջում են `--check-config` եւ կատարում են լիարժեք Kagemusha որակավորում, նախքան քանոնիկ փաթեթը գրել:

- `--write-kagemusha-catalog-qualification-seal <PATH>` որակավորում է կատալոգը:
- `--write-kagemusha-validator-qualification-seal <PATH>` հավասարեցնում է տեղական վավերացնողին կոնֆիգուրացված ստորագրված առաջխաղացման պահեստավորման համար:

Երկու պտուղային տարբերակները հակասում են միմյանց:

## `--trace-config` {#arg-trace-config}

- Տիպ: դրոշ
- Շրջակա միջավայր. `TRACE_CONFIG`

Սեղմել հետագա արձանագրությունները, երբ կոմֆիգուրացիոն շերտերը ընթերցվում եւ վերլուծվում են.

## `--config-blake3` {#arg-config-blake3}

- Տիպ. 64 թվային հեքսադեկիմալ BLAKE3 դիժեսթ
- պահանջներ. `--config`

Պահանջել է կոնֆիգուրացիոն ֆայլի բայտները համապատասխանեն մատակարարված դիժեստին: Անկախության կապակցությամբ ֆայլը պետք է հարթացվի, այն չի կարող պարունակել `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Տիպ. Բուլյան, փոխանցվել է որպես `--terminal-colors=true` կամ `--terminal-colors=false`
- Նախադրյալ՝ վերջնական հնարավորությունների հայտնաբերում
- Շրջակա միջավայր. `TERMINAL_COLORS`

վերահսկողություն ANSI գույնի արտադրանքը:

## `--language` {#arg-language}

- Տիպ: շղթա

Հաշվի առեք դեյմոնային հաղորդագրությունների համար օգտագործվող համակարգի լեզուն:

## `--sora` {#arg-sora}

- Տիպ: դրոշ
- Շրջակա միջավայր. `IROHA_SORA_PROFILE`

Սեղմեք Sora Nexus պրոֆիլը: Այս պրոֆիլը կազմավորում է SoraFS, SoraNet ձեռքի սեղմումը եւ բազմակողմանի կոնսենսուսը: Միշտ հրավիրեք Taira արձակիչը այս դրոշով:

## FastPQ վերաբացումներ {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` եւ `--fastpq-poseidon-mode <MODE>`-ը ընդունում են միայն `cpu` կամ `gpu`: Մնացած տարբերակները գերազանցում են հեռաչափության տեքստերը.

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Օրինակ՝

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Ծրագրված օգնություն {#generated-help}

Ստորեւ բերված ամբողջական արտադրանքը ստեղծվում է փաթեթավորված Iroha աղբյուրի կապիտից:

<<< @/snippets/iroha3d-help.md
