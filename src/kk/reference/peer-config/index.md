---
translation_locale: kk
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha баптау {#configuring-iroha}

Жергілікті желі серіктес параметрлері мына жерде орнатылады TOML файлдар. Бұл тізбелік конфигурация арқылы өзгертілгеннен өзгеше [`SetParameter`](/kk/blockchain/instructions.md#setparameter) нұсқаулар. Өндірістік мінез-құлық конфигурацияда көрсетілуі тиіс файл немесе тізбек параметрі; ортаның айнымалылары функциялық шектеулер емес.

Пайдалану [`--config`](../iroha3d-cli#arg-config) CLI конфигурациялық файлдың жолын көрсету үшін аргумент.

## Үлгі {#template}

Әр параметрдің толық сипаттамасын көру үшін [Параметрлер](./params.md) сілтемесіне қараңыз.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Конфигурациялық файлдарды құрастыру {#composing-configuration-files}

TOML конфигурациялық файлдардың қосымша `extends` өрісі бар, ол басқа TOML файл(дар)ына нұсқайды. Бұл бір жол немесе бірнеше жол болуы мүмкін:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha `extends` көрсетілген барлық файлдарды рекурсивті түрде оқып, оларды қабаттарға біріктіретін болады, мұнда кейінгі файлдар параметр деңгейінде алдыңғы файлдарды басып озады. Мысалы, егер `config.toml` оқылса:

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

Соңғы конфигурация `a.toml`-ден `chain`, `b.toml`-тен `max_content_len`, және `config.toml`-тен `torii.address` болады (`b.toml`-ны қайта жазады).

## Ақауларды жою {#troubleshooting}

Өту [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI конфигурация қалай оқылып, талданатынын қадағалау үшін жалауша.
