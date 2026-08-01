---
translation_locale: kk
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha баптау {#configuring-iroha}

Жергілікті теңгерімдік конфигурация TOML файлдарында орнатылады. Бұл [`SetParameter`](/kk/blockchain/instructions.md#setparameter) нұсқаулары арқылы өзгертілген тізбектік конфигурацияға қарағанда өзгеше. Өндірістік мінез-құлық конфигурациялық файл немесе тізбекті параметрде бейнеленуі керек; қоршаған ортаның айнымалылары функциялы қақпалар болып табылмайды.

Конфигурация файлына жолды келтіруге [`--config`](../irohad-cli#arg-config) CLI аргументін қолданыңыз.

## Үлгі {#template}

Әрбір параметрдің егжей-тегжейлі сипаттамасы үшін [ Параметрлер](./params.md) сілтемесін қараңыз.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Конфигурациялық файлдарды жасау {#composing-configuration-files}

TOML конфигурация файлдарында басқа TOML файлдарға сілтеме беретін қосымша `extends` өрісі болады. Бұл бір жол немесе бірнеше жол болуы мүмкін:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha рекурсивті түрде `extends` -да көрсетілген барлық файлдарды оқиды және оларды қабаттарға бөледі, онда соңғылары параметр деңгейінде алдыңғыларын қайталап жазады. Мысалы, егер `config.toml` -де оқу:

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

Нәтижесінде конфигурация: `chain` бойынша `a.toml`, `max_content_len` бойынша `b.toml`, және `torii.address` бойынша `config.toml` (көшіріп жазылады) `b.toml`).

## Қиындықтарды шешу {#troubleshooting}

Конфигурацияның қалай оқылып, талдау жүргізілетінін білу үшін [`--trace-config`](../irohad-cli#arg-trace-config) CLI байрағын өткізіңіз.
