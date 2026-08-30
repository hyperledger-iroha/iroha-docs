---
translation_locale: ba
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` - стандарт Iroha 3 peer daemon. Cargo пакеты исеме `irohad`, шуға күрә сығанаҡ иҫбатлауҙан бинарды саҡырығыҙ:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Йәмәғәт Taira тест селтәре өсөн, сығарыу һүрәте `iroha3d_taira` ҡулланыла. Ул шул уҡ CLI ҡабул итә. Ул шулай уҡ Taira кананик селтәрен, валидатор йыйылмаһын, һаҡлау көйләүҙәрен һәм ғәмәлгә ашырыу ваҡытын ҡултамғалау сымдарын үтәй. Taira конфигурацияһын асыҡламайынса раҫлағыҙ:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Оператор ҡулланыр алдынан Taira каноник профилен күрһәтергә тейеш. Кабул ителгән өлгөлә миҫалдар ҡуйылған. Оператор һәр миҫал ҡушымтаһын алмаштырырға тейеш. Nexus йәки SoraFS стандарттарын ҡулланырға ярамай, Taira менән һынағанда.

## `--config` {#arg-config}

- Тип: файл юлы
- Исеме: `-c`

[ peer конфигурацияһына юллау](/ba/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Тип: файл юлы

Һайланма генез манифесты JSON консенсус менән раҫлау өсөн ҡулланыла.

## `--check-config` {#arg-check-config}

Ҡабул ителгән конфигурацияны һәм бар генез материалын раҫлау, һуңынан бәйләүсе селтәр инеүлектәрһеҙ сығыу.

## "Кагемуша" квалификация маркалары {#kagemusha-qualification-seals}

Был файл юлдары варианттары `--check-config` талап итә һәм кагемуша квалификацияһын тулыһынса үтәп, ҡануни мөһөр яҙыр алдынан:

- `--write-kagemusha-catalog-qualification-seal <PATH>` каталогҡа квалификация бирә.
- `--write-kagemusha-validator-qualification-seal <PATH>` урындағы валидаторҙы конфигурацияланған ҡул ҡуйылған продвижение резервацияһы буйынса квалификация бирә.

Ике мөһер варианты бер-береһе менән ҡапма-ҡаршы тора.

## `--trace-config` {#arg-trace-config}

- Тип: флаг
- Тирә-яҡ мөхит: `TRACE_CONFIG`

Конфигурация ҡатламдары уҡылып, анализланған саҡта эҙҙәр журналын булдырыу.

## `--config-blake3` {#arg-config-blake3}

- Тип: 64-шәр һанлы BLAKE3 гексадецимал биҙрәлеү
- `--config`

Конфигурация файлы байттарҙы тәьмин ителгән дигес менән тап килеү өсөн кәрәк. Берҙәмлек менән бәйләнгән файл яҫыланырға тейеш; ул `extends` эсенә инә алмай.

## `--terminal-colors` {#arg-terminal-colors}

- Тип: `--terminal-colors=true` йәки `--terminal-colors=false` тип күрһәтелгән булеан
- Дефолт: терминалдың һәләтен асыҡлау
- Тирә-яҡ мөхит: `TERMINAL_COLORS`

Контроль ANSI төҫтәге сығарыу.

## `--language` {#arg-language}

- Тип: ҡыл

Демон хәбәрҙәре өсөн ҡулланылған система теленә өҫтөнлөк бирегеҙ.

## `--sora` {#arg-sora}

- Тип: флаг
- Тирә-яҡ мөхит: `IROHA_SORA_PROFILE`

Сора Nexus профилен эшләтеп ҡуйыу. Был профиль SoraFS, SoraNet ҡул һелкеү һәм күп юллы консенсус булдыра. Һәр ваҡыт был флаг менән Taira стартлаусы саҡыра.

## FastPQ өҫтөнлөклө {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` һәм `--fastpq-poseidon-mode <MODE>` тик `cpu` йәки `gpu` билдәләрен генә ҡабул итә.

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Мәҫәлән:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Төҙөлгән ярҙам {#generated-help}

Түбәндәге тулы сығанаҡ ҡуйылған Iroha сығанаҡ commit-тан барлыҡҡа килә.

<<< @/snippets/iroha3d-help.md
