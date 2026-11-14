---
translation_locale: ru
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# генезис блокчейна ссылка {#genesis-reference}

В текущем рабочем процессе Iroha 3 технический манифест `genesis.json` описывает первые транзакции и параметры, которые будут применены при запуске сети.

Подписанный артефакт, распространяемый среди узлов сети, представляет собой файл `.nrt`, закодированный с помощью Norito и созданный `kagami genesis sign`.

## Основные поля {#main-fields}

Технический манифест генезиса блокчейна может определять:

- `chain` для идентификатора цепи
- `chain_discriminant` задаёт сетевой префикс I105 для кодирования литералов учётных записей в манифесте
- `executor` для необязательного пути обновления байткода исполнителя
- `ivm_dir` для IVM библиотек, используемых триггерами и улучшениями
- `consensus_mode` для первоначального режима, указанного в техническом манифесте
- `transactions` для упорядоченного обновления параметров, инструкций, триггеров и топологии
- `sumeragi_context` задаёт подписанные параметры контекста высоты Sumeragi
- `crypto_admission_policy` задаёт точный перечень допускаемых цепочкой алгоритмов подписи и контроллеров в `allowed_algorithms`

Внутри `transactions` записи топологии сопоставляют идентификаторы сетевых узлов и PoPs вместе:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Создать технический манифест {#generate-a-manifest}

Создайте шаблон с помощью Kagami. Повторите `--allowed-signing` для каждого допускаемого алгоритма в каноническом порядке по возрастанию. Kagami не добавляет пропущенные алгоритмы:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
```

Для публичного пространства данных SORA Nexus ожидается режим консенсуса `npos`. Другие развёртывания Iroha 3 могут использовать режим с разрешённым набором участников или NPoS в зависимости от целевого профиля.

## Подпишите технический манифест {#sign-the-manifest}

После редактирования и проверки JSON подпишите его в развертываемый блок `.nrt`:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` считывает публичный ключ генезиса блокчейна из технического манифеста и использует приватный ключ из хранимого владельцем однозвенного обычного файла для создания развертываемого подписанного блока. Файл должен содержать один канонический приватный ключ в виде многохеша, за которым следует переход на новую строку; Kagami отклоняет символические ссылки и режимы, отличные от `0600`. Сырые приватные ключи не принимаются в командной строке. Результатом является файл, на который сетевые узлы должны ссылаться в своей конфигурации.

## Настроить `iroha3d` {#configure-iroha3d}

Укажите демону подписанный блок генезиса и файл, закрепляющий его ожидаемый хеш. Команда `kagami genesis sign --expected-hash-out` записывает этот файл; он обязателен как при первом запуске, так и при перезапусках:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Связанные инструменты {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Для реализации генератора и деталей команд смотрите [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
