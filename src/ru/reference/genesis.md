---
translation_locale: ru
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Справочник по Бытию {#genesis-reference}

В настоящее время Iroha 3 рабочий процесс, а `genesis.json` манифест описывает первый
транзакции и параметры, которые будут применяться при запуске сети.

Подписанный артефакт, распространяемый среди одноранговых узлов, представляет собой Norito-закодированный `.nrt` файл
произведено `kagami genesis sign`.

## Основные поля {#main-fields}

Манифест происхождения может определять:

- `chain` для идентификатора цепочки
- `executor` для дополнительного пути байт-кода обновления исполнителя
- `ivm_dir` для IVM библиотеки, используемые триггерами и обновлениями
- `consensus_mode` для начального режима, объявленного манифестом
- `transactions` для упорядоченных обновлений параметров, инструкций, триггеров и топологии
- `crypto` для первоначального крипто-снимка

В пределах `transactions`, записи топологии, пары идентификаторов узлов и PoPs вместе:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Создать манифест {#generate-a-manifest}

Использовать Kagami для создания шаблона:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Для публики SORA Nexus пространство данных, `npos` — ожидаемый режим консенсуса.
Другой Iroha 3 развертывания могут использовать разрешенные или NPoS в зависимости от цели
профиль.

## Подпишите манифест {#sign-the-manifest}

После редактирования и проверки JSON, подпишите его в развертываемый `.nrt` блокировать:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` считывает открытый ключ Genesis из манифеста и использует
закрытый ключ из обычного файла с одной ссылкой, хранящегося владельцем, для создания
развертываемый подписанный блок.Файл должен содержать один канонический приватный ключ.
мультихэш, за которым следует новая строка; Kagami отклоняет символические ссылки и модифицирует другие
чем `0600`. Необработанные закрытые ключи не принимаются в командной строке.Результат
— это файл, на который пиры должны ссылаться из своей конфигурации.

## Настроить `iroha3d` {#configure-iroha3d}

Наведите демон на подписанный блок генезиса:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Сопутствующие инструменты {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Подробности о реализации генератора и командах см.
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
