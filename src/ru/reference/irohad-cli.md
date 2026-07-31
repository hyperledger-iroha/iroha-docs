---
translation_locale: ru
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` начинается Iroha 3 Пир-Деймон.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **Тип:** Путь файлов
- **Прозвище:** `-c`

Путь к [конфигурация](/ru/reference/peer-config/index.md) Досье.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **Тип:** Путь файлов

Факультативный путь к генезисному манифесту JSON Используйте это при развертывании
подтверждает запуск на манифест, созданный Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Возможность отслеживания журналов чтения и анализа конфигурации. Может быть полезно для решения проблем с конфигурацией.

- **Тип:** флаг
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **Тип:** Бульский `--terminal-colors=false` или
  `--terminal-colors=true`
- **По умолчанию:** поддержка терминала автоматического обнаружения
- **ENV:** `TERMINAL_COLORS`

Включить ANSI- Цветовой выпуск или нет.

По умолчанию, Iroha определяет, поддерживает ли терминал цветный выход
или нет.

Чтобы явно отключить цвета:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **Тип:** Струнные

Переоценить системный язык, используемый для сообщений демонов.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **Тип:** флаг

Включить Сору Nexus профиль характеристик для SoraFS, в) SoraNet рукопожатие и
многостраничные консенсусные потоки.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **Тип:** `auto`, `cpu`, или `gpu`

Переоценка FASTPQ режим выполнения просмотра.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **Тип:** `auto`, `cpu`, или `gpu`

Переоценка FASTPQ Посейдонский трубопровод.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **Тип:** Струнные

Переоценить FASTPQ этикетка класса телеметрических устройств.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **Тип:** Струнные

Переоценить FASTPQ Телеметрическая семья чипов.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **Тип:** Струнные

Переоценить FASTPQ телеметрия GPU- Такой маркер.

```shell
irohad --fastpq-gpu-kind integrated
```
