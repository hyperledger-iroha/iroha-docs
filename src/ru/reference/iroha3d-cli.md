---
translation_locale: ru
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` является стандартным Iroha 3 peer daemon. Пакет Cargo называется `irohad`, поэтому вызывайте бинарный код из источника с:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Для публичной тестовой сети Taira в изображении выпуска используется `iroha3d_taira`. Он принимает тот же CLI. Он также обеспечивает каноническую цепь Taira, набор валидаторов, настройки хранения и ключи для подписи запускного времени. Валидировать конфигурацию Taira без открытия учетных записей за время выполнения, как:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Перед использованием оператор должен показать канонический Taira профиль. В зарегистрированном шаблоне есть примерные настройки. Оператор должен заменить все примерные настройки. Не используйте настройки генерального Nexus или производственного SoraFS при испытаниях против Taira.

## `--config` {#arg-config}

- Тип: путь файла
- Прозвище: `-c`

Путь к конфигурации [ peer ](/ru/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Тип: путь файла

Факультативный генезисный манифест JSON используется для согласования.

## `--check-config` {#arg-check-config}

Подтвердить решенную конфигурацию и доступный генезисный материал, а затем выйти без связывающих сетевых узлов.

## Квалификационные печати Kagemusha {#kagemusha-qualification-seals}

Эти варианты пути файла требуют `--check-config` и выполняют полную квалификацию Kagemusha перед написанием канонической печати:

- `--write-kagemusha-catalog-qualification-seal <PATH>` соответствует требованиям каталога.
- `--write-kagemusha-validator-qualification-seal <PATH>` квалифицирует местного валидатора в отношении конфигурированной подписанной рекламной резервации.

Два варианта печати противоречат друг другу.

## `--trace-config` {#arg-trace-config}

- Тип: флаг
- Окружающая среда: `TRACE_CONFIG`

Включить журналы отслеживания во время чтения и анализа слоев конфигурации.

## `--config-blake3` {#arg-config-blake3}

- Тип: 64-значный шестадецимальный перевал BLAKE3
- Требования: `--config`

Требуйте, чтобы байты конфигурационного файла соответствовали поставленному дигесту. Файл, связанный с целостностью, должен быть равенным; он не может содержать `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Тип: Булевый, проставленный как `--terminal-colors=true` или `--terminal-colors=false`
- По умолчанию: обнаружение возможностей терминала
- Окружающая среда: `TERMINAL_COLORS`

Управление выходом цвета ANSI.

## `--language` {#arg-language}

- Тип: строка

Отменить системный язык, используемый для сообщений демона.

## `--sora` {#arg-sora}

- Тип: флаг
- Окружающая среда: `IROHA_SORA_PROFILE`

Включить профиль Sora Nexus. Этот профиль настраивает SoraFS, рукопожатие SoraNet и консенсус по нескольким полосам. Всегда призывайте запускщик Taira с этим флагом.

## Перемены FastPQ {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` и `--fastpq-poseidon-mode <MODE>` принимать только `cpu` или `gpu`. Остальные варианты превышают телеметрические этикетки:

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

## Создаваемая помощь {#generated-help}

Полный вывод ниже генерируется из закрепленного Iroha источникового комитета.

<<< @/snippets/iroha3d-help.md
