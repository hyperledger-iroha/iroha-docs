---
translation_locale: ru
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` запускает Iroha 3 сотоварищной демона.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- Тип: Путь файла
- Прозвище: `-c`

Путь в файл конфигурации [](/ru/reference/peer-config/index.md).

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Тип: Путь файла

Опциональный путь к файлу генезис-манифест JSON. Используйте его, когда развертывание подтверждает запуск против манифеста, созданного Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Возможность отслеживания журналов чтения и анализа конфигураций. Может быть полезно для решения проблем с конфигурацией.

- Тип: флаг
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Тип: Булевой, либо `--terminal-colors=false` или `--terminal-colors=true`
- По умолчанию: поддержка терминала для автоматического обнаружения
- ENV: `TERMINAL_COLORS`

Включить или не включить выход цвета ANSI.

По умолчанию Iroha определяет, поддерживает ли терминал цветный выход или нет.

Чтобы явно отключить цвета:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Тип: струны

Отменить системный язык, используемый для сообщений демона.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Тип: флаг

Включить профиль функций Sora Nexus для SoraFS, рукопожатия и консенсусных потоков с несколькими полосами SoraNet.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Тип: `auto`, `cpu`, или `gpu`

Преодоление режима исполнения провайдера FASTPQ.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Тип: `auto`, `cpu`, или `gpu`

Перевернуть режим трубопровода "Посейдон" FASTPQ.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Тип: струны

Отменить маркировку класса телеметрических устройств FASTPQ.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Тип: струны

Отменить этикетку семейства чипов телеметрии FASTPQ.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Тип: струны

Отрицать этикетку типа FASTPQ телеметрии GPU.

```shell
irohad --fastpq-gpu-kind integrated
```
