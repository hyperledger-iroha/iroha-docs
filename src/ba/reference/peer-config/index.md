---
translation_locale: ba
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha конфигурацияһы {#configuring-iroha}

Урындағы тиңдәш конфигурацияһы ҡуйылған TOML Файлдар. Был селтәрҙәге конфигурацияһы үҙгәртелгән [`SetParameter`](/ba/blockchain/instructions.md#setparameter) күрһәтмәләре. Производство тәртибе конфигурация файлында йәки сылбыр параметрында күрһәтергә тейеш; тирә-яҡ мөхит үҙгәреүсәндәре функциялар ҡапҡалары түгел.

Конфигурация файлына юлды билдәләү өсөн [`--config`](../irohad-cli#arg-config)CLI аргументын файҙаланығыҙ.

## Һүрәт {#template}

Һәр параметрҙы ентекле һүрәтләү өсөн [ Параметры](./params.md) шиғырына ҡарағыҙ.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Конфигурация файлдарын төҙөү {#composing-configuration-files}

TOML конфигурация файлдар өҫтәмә `extends` һылтанма башҡа TOML файлдар. Был бер юлы йәки күп юл була ала:

::: код төркөмө

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha рекурсив рәүештә бөтә файлдарҙы уҡый `extends` һәм уларҙы ҡатламдарға йыйып, һуңғылары параметр кимәлендә элеккеләрен арттырып яҙа. Мәҫәлән, әгәр уҡығанда `config.toml`:

::: код төркөмө

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

Һөҙөмтәлә конфигурация буласаҡ `chain` от `a.toml`, `max_content_len` от `b.toml`, һәм `torii.address` от `config.toml` (өсөнән яҙыла) `b.toml`).

## Проблемаларҙы хәл итеү {#troubleshooting}

[`--trace-config`](../irohad-cli#arg-trace-config)CLI байрағын үткәреп, конфигурация нисек уҡыла һәм анализлана икәнен күрер өсөн.
