---
translation_locale: ru
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# генезис блокчейна ссылка {#genesis-reference}

В текущем рабочем процессе Iroha 3 технический манифест `genesis.json` описывает первые транзакции и параметры, которые будут применены при запуске сети.

Подписанный артефакт, распространяемый среди узлов сети, представляет собой файл `.nrt`, закодированный с помощью Norito и созданный `kagami genesis sign`.

## Основные поля {#main-fields}

Технический манифест генезиса блокчейна может определять:

- `chain` для идентификатора цепи
- `executor` для необязательного пути обновления байткода исполнителя
- `ivm_dir` для IVM библиотек, используемых триггерами и улучшениями
- `consensus_mode` для первоначального режима, указанного в техническом манифесте
- `transactions` для упорядоченного обновления параметров, инструкций, триггеров и топологии
- `crypto` для первоначального снимка криптоданных

Внутри `transactions` записи топологии сопоставляют идентификаторы сетевых узлов и PoPs вместе:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Создать технический манифест {#generate-a-manifest}

Используйте Kagami для создания шаблона:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Для публичного пространства данных SORA Nexus ожидаемый режим консенсуса — `npos`. Другие развертывания Iroha 3 могут использовать разрешенный режим или NPoS в зависимости от целевого профиля.

## Подпишите технический манифест {#sign-the-manifest}

После редактирования и проверки JSON подпишите его в развертываемый блок `.nrt`:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` считывает публичный ключ генезиса блокчейна из технического манифеста и использует приватный ключ из хранимого владельцем однозвенного обычного файла для создания развертываемого подписанного блока. Файл должен содержать один канонический приватный ключ в виде многохеша, за которым следует переход на новую строку; Kagami отклоняет символические ссылки и режимы, отличные от `0600`. Сырые приватные ключи не принимаются в командной строке. Результатом является файл, на который сетевые узлы должны ссылаться в своей конфигурации.

## Настроить `iroha3d` {#configure-iroha3d}

Укажите демону на подписанный блок генезиса блокчейна:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Связанные инструменты {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Для реализации генератора и деталей команд смотрите [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
