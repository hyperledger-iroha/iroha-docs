---
translation_locale: kk
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha баптау {#configuring-iroha}

Жергілікті теңгерімдік конфигурация орнатылды TOML файлдар. Бұл желідегі конфигурациядан өзгеше [`SetParameter`](/kk/blockchain/instructions.md#setparameter) нұсқаулар. Өндірістік мінез-құлық конфигурация файлында немесе тізбектік параметрде бейнеленуі керек; қоршаған ортаның айнымалылары функциялы қақпалар болып табылмайды.

Пайдалану [`--config`](../irohad-cli#arg-config) CLI конфигурация файлына жолды анықтау үшін аргумент.

## Үлгі {#template}

Әрбір параметрдің егжей-тегжейлі сипаттамасы үшін [ Параметрлер](./params.md) сілтемесін қараңыз.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Конфигурациялық файлдарды жасау {#composing-configuration-files}

TOML конфигурация файлдарының қосымша `extends` басқа жерлерге сілтейтін TOML Бұл бір жол немесе бірнеше жол болуы мүмкін:

::: код тобы

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha барлық файлдарды рекурсивті түрде оқиды `extends` және оларды қабаттарға құрастырып, соңғылары параметр деңгейінде бұрынғыларын қайталап жазады. Мысалы, егер оқу `config.toml`:

::: код тобы

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

Өткізу [`--trace-config`](../irohad-cli#arg-trace-config) CLI конфигурацияның қалай оқылып, талдау жүргізілетінін білу үшін байрақ.
