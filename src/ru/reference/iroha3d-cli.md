---
translation_locale: ru
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` является стандартным демоном сети Iroha 3. Пакет Cargo называется `irohad`, поэтому запускайте бинарный файл из рабочей копии исходного кода с помощью:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Для публичного тестнета Taira образ релиза использует `iroha3d_taira`. Он принимает тот же CLI, но дополнительно обеспечивает канонический профиль цепочки Taira, валидатора, хранилища и подписи времени выполнения. Проверьте конфигурацию Taira без раскрытия учетных данных времени выполнения программного обеспечения следующим образом:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Используйте операторскую форму канонического профиля Taira; зарегистрированный шаблон все еще содержит заполнитель для развертывания. Не заменяйте универсальные настройки Nexus или производственные SoraFS при тестировании с Taira.

## `--config` {#arg-config}

- Тип: путь к файлу
- Псевдоним: `-c`

Путь к [конфигурация сетевого узла](/ru/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Тип: путь к файлу

Опциональный технический манифест генезиса блокчейна JSON, используемый для проверки консенсуса.

## `--check-config` {#arg-check-config}

Проверьте разрешённую конфигурацию и доступный материал генезиса блокчейна, затем выйдите, не привязывая сетевые сокеты.

## Печати квалификации Кагемуши {#kagemusha-qualification-seals}

Эти параметры пути к файлу требуют `--check-config` и выполняют полную квалификацию Kagemusha перед записью канонической печати:

- `--write-kagemusha-catalog-qualification-seal <PATH>` квалифицирует каталог.
- `--write-kagemusha-validator-qualification-seal <PATH>` проверяет местный валидатор на соответствие настроенной подписанной резервной записи продвижения.

Два варианта печати противоречат друг другу.

## `--trace-config` {#arg-trace-config}

- Тип: флаг
- Окружающая среда: `TRACE_CONFIG`

Включите трассировку журналов при чтении и разборе слоев конфигурации.

## `--config-blake3` {#arg-config-blake3}

- Тип: 64-значное шестнадцатеричное BLAKE3 криптографическое значение хэша
- Требуется: `--config`

Требовать, чтобы байты файла конфигурации соответствовали предоставленному значению криптографического дайджеста. Файл с привязкой к целостности должен быть уплощённым; он не может содержать `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Тип: Boolean, передаётся как `--terminal-colors=true` или `--terminal-colors=false`
- По умолчанию: обнаружение возможностей терминала
- Окружающая среда: `TERMINAL_COLORS`

Управление выводом цвета ANSI.

## `--language` {#arg-language}

- Тип: строка

Переопределите язык системы, используемый для сообщений демона.

## `--sora` {#arg-sora}

- Тип: флаг
- Окружающая среда: `IROHA_SORA_PROFILE`

Включите профиль Sora Nexus, используемый SoraFS, рукопожатие SoraNet и консенсус с несколькими линиями. Запускатор Taira всегда вызывается с этим флагом.

## FastPQ переопределяет {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` и `--fastpq-poseidon-mode <MODE>` принимают только `cpu` или `gpu`. Остальные варианты переопределяют метки телеметрии:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Например:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Созданная помощь {#generated-help}

Выше приведено краткое описание параметров, проверенное по текущим определениям аргументов `iroha3d`. Зафиксированный снимок сгенерированных справочных данных намеренно не отображается, пока ожидается статус его происхождения. Чтобы просмотреть точную справку для вашей версии, выполните:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
