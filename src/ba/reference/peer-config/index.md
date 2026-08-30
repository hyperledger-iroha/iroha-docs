---
translation_locale: ba
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha конфигурацияһы {#configuring-iroha}

TOML файлдарҙа урындағы тиңдәш конфигурацияһы ҡуйылған. Был [`SetParameter`](/ba/blockchain/instructions.md#setparameter) күрһәтмәләре буйынса үҙгәртелгән сылбыр конфигурацияһынан айырыла. Производство тәртибе конфигурация файлында йәки сылбыр буйынса параметрҙа күрһәтергә тейеш; Тирә-яҡ мөхиттең үҙгәреүсәндәре функциялар ҡапҡалары түгел.

Конфигурация файлына юлды билдәләү өсөн [`--config`](../iroha3d-cli#arg-config)CLI аргументын файҙаланығыҙ.

## Һүрәт {#template}

Һәр параметрҙы ентекле һүрәтләү өсөн [ Параметры](./params.md) шиғырына ҡарағыҙ.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Конфигурация файлдарын төҙөү {#composing-configuration-files}

TOML конфигурация файлдарының өҫтәмә `extends` полеһы бар, ул башҡа TOML файлдарҙы күрһәтә. Был бер юлы йәки күп юлдар булыуы мөмкин:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha `extends` -ла күрһәтелгән бөтә файлдарҙы рекурсив рәүештә уҡып сығара һәм уларҙы ҡатламдарға бүлә, һуңғылары параметр кимәлендә элеккеләрҙең өҫтөндә яҙа. Мәҫәлән, әгәр `config.toml` -ны уҡығанда:

::: code-group

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

[`--trace-config`](../iroha3d-cli#arg-trace-config)CLI байрағын үткәреп, конфигурация нисек уҡыла һәм анализлана икәнен күрер өсөн.
