---
translation_locale: kk
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` стандартты Iroha 3 желілік түйін демоны болып табылады. Cargo пакеті `irohad` деп аталады, сондықтан орындалатын файлды дереккөз кодынан жұмыс көшірмесінен келесі түрде іске қосыңыз:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Жалпыға ашық Taira сынақ желісінде шығарылым кескіні `iroha3d_taira` пайдаланады. Ол сол CLI пәрмендерін қабылдайды, сонымен бірге канондық Taira тізбегі, валидатор, сақтау және орындау ортасының қол қою профилін міндетті етеді. Орындау ортасының тіркелгі деректерін ашпай, Taira конфигурациясын былай тексеріңіз:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Бір протокол стандартты Taira профилінің оператор арқылы өңделген нұсқасын пайдаланыңыз; тіркелген шаблон әлі де орналастыруға арналған орындалу нүктелерін қамтиды. Taira-ке қарсы тестілеу кезінде жалпы Nexus немесе өндірістік SoraFS баптауларын алмастырмаңыз.

## `--config` {#arg-config}

- Түрі: файл жолы
- Лақап аты: `-c`

[торап әріптесінің конфигурациясы](/kk/reference/peer-config/index.md) жолы.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Түрі: файл жолы

Келісімге тексеру үшін қолданылатын ерікті блокчейн бастаушы техникалық манифесті JSON.

## `--check-config` {#arg-check-config}

Шешілген конфигурацияны және қолжетімді блокчейн генезис материалын растап, желі сокеттеріне байланбай шығу.

## Кагемуша біліктілік мөрлері {#kagemusha-qualification-seals}

Бұл файл жолы нұсқалары `--check-config` қажет етеді және бір протокол-стандартты мөрді жазбас бұрын толық Kagemusha біліктілігін орындайды:

- `--write-kagemusha-catalog-qualification-seal <PATH>` каталогты сертификаттайды.
- `--write-kagemusha-validator-qualification-seal <PATH>` жергілікті тексерушіні бапталған қол қойылған насихаттау резервімен сәйкестендіреді.

Екі мөрлеу нұсқасы бір-бірімен қайшылыққа келеді.

## `--trace-config` {#arg-trace-config}

- Түрі: ту
- Қоршаған орта: `TRACE_CONFIG`

Конфигурация қабаттары оқылып, талданған кезде трассалық журналдарды қосыңыз.

## `--config-blake3` {#arg-config-blake3}

- Түрі: 64-өлшемді он алтылық BLAKE3 криптографиялық хэш мәні
- Талап етіледі: `--config`

Конфигурация файлының байттары берілген криптографиялық дайджест мәніне сәйкес келуін талап етіңіз. Стандартқа тәуелді файл тегіс болуы керек; ол `extends` қамти алмайды.

## `--terminal-colors` {#arg-terminal-colors}

- Түрі: Булин, `--terminal-colors=true` немесе `--terminal-colors=false` ретінде жіберіледі
- Әдепкі: терминал мүмкіндіктерін анықтау
- Қоршаған орта: `TERMINAL_COLORS`

ANSI түсті шығуды басқару.

## `--language` {#arg-language}

- Түрі: жол

Демон хабарламаларында қолданылатын жүйе тілін қайта жазу.

## `--sora` {#arg-sora}

- Түрі: ту
- Қоршаған орта: `IROHA_SORA_PROFILE`

Қолданушы SoraFS пайдаланатын Sora Nexus профильін, SoraNet қол беру рәсімін және көп жолақты консенсусды қосыңыз. Taira іске қосқышы әрқашан осы белгімен шақырылады.

## FastPQ үстемелейді {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` және `--fastpq-poseidon-mode <MODE>` тек `cpu` немесе `gpu` қабылдайды. Қалған опциялар телеметриялық белгілерді басып озады:

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

## Жасалған көмек {#generated-help}

Жоғарыдағы опциялар жиынтығы ағымдағы `iroha3d` аргумент анықтамаларымен салыстырылып тексерілген. Репозиторийге тіркелген генерацияланған анықтама кескіні оның шығу тегі мәртебесі анықталғанша әдейі көрсетілмейді. Жұмыс көшірмеңіздегі дәл анықтаманы көру үшін мынаны орындаңыз:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
