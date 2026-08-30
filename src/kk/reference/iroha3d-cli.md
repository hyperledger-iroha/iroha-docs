---
translation_locale: kk
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` - стандартты Iroha 3 теңгерімдік дәймон. жүк пакеті `irohad` деп аталады, сондықтан бинарлық кодты көзбен тексеруден бастаңыз:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Қоғамдық Taira тестілеу желісі үшін босату кескінінде `iroha3d_taira` қолданылады. Ол CLI дегенді қабылдайды. Ол сондай-ақ каноникалық Taira тізбекті, растаушы жиынтығын, сақтау параметрлерін және іске қосу уақытын қолтаңбалау кілттерін орындайды. Taira конфигурациясын келесідей орындалу уақыты куәліктерін ашпай-ақ растаңыз:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Пайдаланушы пайдаланудан бұрын Taira каноникалық профилін көрсетуі тиіс. Тіркелген қойындының үлгі параметрлері бар. Оператор әрбір мысалдық параметрді ауыстыруы тиіс. Денелік препараттарды қолданбаңыз Nexus немесе өндіріс SoraFS сынақ кезінде параметрлер Taira.

## `--config` {#arg-config}

- Түрі: файл жолы
- `-c`

[ peer конфигурациясының ](/kk/reference/peer-config/index.md) жолы.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Түрі: файл жолы

Консенсусты бекіту үшін пайдаланылатын ерікті генез манифесті JSON.

## `--check-config` {#arg-check-config}

Қабылданған конфигурацияны және қол жетімді генез материалдарын растаңыз, содан кейін желілік бұғауларсыз шығыңыз.

## Kagemusha біліктілік мөрі {#kagemusha-qualification-seals}

Бұл файл-жол параметрлері `--check-config` талап етеді және каненикалық мөрді жазудан бұрын толық Кагемуша біліктілігін орындайды:

- `--write-kagemusha-catalog-qualification-seal <PATH>` каталогқа сәйкес келеді.
- `--write-kagemusha-validator-qualification-seal <PATH>` жергiлiктi растаушыны конфигурацияланған қол қойылған көтермелеу резервациясына жатқызуға шақырады.

Екі мөрдің нұсқасы бір-біріне қайшы келеді.

## `--trace-config` {#arg-trace-config}

- Түрі: желек
- Қоршаған орта: `TRACE_CONFIG`

Конфигурация қабаттары оқылып, талдау жүргізіліп жатқанда ізденіс журналдарын қосу.

## `--config-blake3` {#arg-config-blake3}

- Түрі: 64 цифрлы BLAKE3 шешедецималдық терілеу
- Талаптар: `--config`

Конфигурациялық файл байттарын ұсынылған дигеске сәйкес келтіруді талап ету. Тұрақтылыққа байланысты файл жалпақ болуы тиіс; ол `extends` құра алмайды.

## `--terminal-colors` {#arg-terminal-colors}

- Түрі: `--terminal-colors=true` немесе `--terminal-colors=false` деп берілген булельдік
- Әдетті түрде: терминалдың мүмкіндіктерін анықтау
- Қоршаған орта: `TERMINAL_COLORS`

Басқарушы ANSI түсті шығыс.

## `--language` {#arg-language}

- Түрі: жіп

Демон хаттары үшін қолданылатын жүйе тілін өшіріңіз.

## `--sora` {#arg-sora}

- Түрі: желек
- Қоршаған орта: `IROHA_SORA_PROFILE`

Sora Nexus профилін қосу. Бұл профиль SoraFS, SoraNet қолын тигізуді және көп жолдық консенсусты баптайды. Әрқашан осы байрақпен Taira іске қосушыны шақырыңыз.

## FastPQ артықшылықтары {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` және `--fastpq-poseidon-mode <MODE>` тек `cpu` немесе `gpu` таңбаларын ғана қабылдайды. Қалған параметрлер телеметриялық таңбаларды болдырмайды:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Мысалы:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Жаратылған көмек {#generated-help}

Төмендегі толық шығыс Iroha шикізатты дереккөз commit-тен жасалады.

<<< @/snippets/iroha3d-help.md
