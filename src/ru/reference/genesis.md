---
translation_locale: ru
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ссылка на Бытие {#genesis-reference}

В текущем процессе работы Iroha 3 манифест `genesis.json` описывает первые транзакции и параметры, которые будут применяться при запуске сети.

Подписанный артефакт, распространенный среди сверстников, представляет собой файл Norito-кодированный `.nrt`, созданный `kagami genesis sign`.

## Основные поля {#main-fields}

Генезисный манифест может определить:

- `chain` для идентификатора цепи
- `executor` для факультативного выполнителя обновления маршрута байткода
- `ivm_dir` для библиотек IVM, используемых в процессах запуска и модернизации
- `consensus_mode` для исходного режима, объявленного в манифесте
- `transactions` для обновления параметров, инструкций, триггеров и топологии.
- `crypto` для первоначального криптовалютного снимка

В пределах `transactions`, топологические записи пары идентифицируют однородных и PoPs вместе:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Создать манифест {#generate-a-manifest}

Используйте Kagami для создания шаблона:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Для общественности SORA Nexus пространство данных, `npos` - ожидаемый режим консенсуса. Iroha 3 развертывания могут использовать разрешение или NPoS в зависимости от профиля цели.

## Подпишите заявление {#sign-the-manifest}

После редактирования и проверки JSON, подпишите его в развертываемый блок `.nrt`:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` читает общественный ключ генезиса из манифеста и использует предоставленный частный ключ, семя и алгоритм для создания развертываемого подписанного блока.

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

Для деталей внедрения генератора и команды см. [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
