---
translation_locale: ru
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ссылка на Бытие {#genesis-reference}

В настоящее время Iroha 3 рабочий процесс, `genesis.json` манифест описывает первый
транзакции и параметры, которые будут применяться при запуске сети.

Подписанный артефакт, распределенный среди сверстников Norito-кодируются `.nrt` файл
произведенные `kagami genesis sign`.

## Основные области {#main-fields}

Проявление генезиса может определить:

- `chain` для идентификатора цепи
- `executor` для дополнительного выполнителя обновления маршрута байткода
- `ivm_dir` для IVM библиотеки, используемые в процессе запуска и обновления
- `consensus_mode` для первоначального режима, объявленного в манифесте
- `transactions` для обновлений параметров, инструкций, триггеров и топологии
- `crypto` для первоначального криптовалютного снимка

Внутри `transactions`, Топологические записи пары идентификаторы и PoPs вместе:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Создать манифест {#generate-a-manifest}

Использование Kagami для создания шаблона:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Для населения SORA Nexus пространство данных, `npos` - ожидаемый режим консенсуса.
Другие Iroha 3 развертывания могут использовать разрешенные или NPoS в зависимости от цели
Профиль.

## Подпишите манифест {#sign-the-manifest}

После редактирования и подтверждения JSON, Подпишите его в развертываемый `.nrt` блок:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` Читает публичный ключ генезиса из манифеста и используется
предоставленный частный ключ, семя и алгоритм для производства развертываемого подписанного
Результат - файл, к которому должны ссылаться коллеги из конфигурации.

## Конфигурация `irohad` {#configure-irohad}

Направьте демона на подписанный блок генезиса:

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

Подробности внедрения генератора и команды см.
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
