---
translation_locale: ru
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Метаданные {#metadata}

## Результат {#outcome}

Прочитайте метаданные на Taira, установите и проверьте одно значение метаданных аккаунта с явной транзакцией с оплатой комиссии, а затем снова удалите это значение. Вы будете держать метаданные распределенного реестра блокчейна отдельно от метаданных комиссий за транзакции.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Python 3.11 или более поздняя версия, и текущий `iroha` CLI.
- Финансируется `taira.client.toml` и `taira.tx-metadata.json` от [Подключиться к Taira](./connect-to-taira.md).
- основной субъект авторизации для метаданных целевого аккаунта. В примере нацелен сам настроенный основной субъект авторизации; другой аккаунт требует точного разрешения.

## Шаги {#steps}

### 1. Читать метаданные без криптографической подписи {#_1-read-metadata-without-a-signer}

Метаданные — это проверенная `Name` до JSON карта. Пустые карты и пустой отфильтрованный результат являются допустимыми результатами.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Используйте метаданные для небольших описательных или индексных полей. Размещайте большие полезные данные вне распределённого реестра блокчейна и храните вместо них криптографическое значение дайджеста, URI, или ссылку SoraFS.

### 2. Выведите целевой аккаунт {#_2-derive-the-target-account}

Прочитайте только открытый ключ из конфигурации Taira и преобразуйте его в каноническую форму без домена I105.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. Установите одно значение JSON {#_3-set-one-json-value}

Значение JSON, считанное со стандартного ввода, становится значением `cookbook_profile` аккаунта. Напротив, `--metadata ./taira.tx-metadata.json` прикрепляет поля комиссии к контейнеру данных транзакции. У двух карт разные цели и назначения.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI цитирует сбор, подписывает, отправляет и ожидает по умолчанию. Не добавляйте `--no-wait`, когда следующая операция зависит от этого значения.

::: warning Граница разрешений

Активный валидатор решает, кто может изменять каждый объект. Обновление другого аккаунта обычно требует `CanModifyAccountMetadata`; домены, определения активов, NFTs и триггеры имеют свои собственные метаданные разрешений, специфичные для цели. Если Taira не предоставил требуемого полномочного лица, выполните те же команды аккаунта с `./localnet/client.toml`, замените сгенерированный местный полномочный идентификатор сети на канонический I105 ID и опустите файл метаданных платы Taira. Сохраняйте явный выбор плательщика местной комиссии.

:::

### 4. Выньте ключ {#_4-remove-the-key}

Сначала прочтите окончательное значение, затем отправьте отдельную транзакцию на удаление.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Для приложений Python соответствующими типизированными сборщиками являются `Instruction.set_account_key_value` и `Instruction.remove_account_key_value`; отправьте их вместе с метаданными транзакции и помощником ожидания из [Python учебное пособие](/ru/guide/tutorials/python.md#shared-setup).

## Проверить {#verify}

После установленной транзакции `meta get` должен вернуть объект с `version: 1`. После удаления прямой поиск больше не должен возвращать значение:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Отдельное чтение учетной записи различает отсутствующий ключ метаданных от сбоя сети или учетной записи. Производственный код также должен проверять полное значение JSON после его установки.

## Устранение неполадок {#troubleshooting}

- Стандартный ввод должен содержать одно допустимое значение JSON. Строки должны быть в кавычках JSON; объекты и массивы должны быть корректно сформированы.
- Ключи метаданных имеют значения `Name` и учитывают регистр после анализа. Сохраняйте стабильный словарь ключей вместо того, чтобы создавать версии ключей при каждом изменении схемы.
- `--metadata` — это метаданные транзакции; они не устанавливают метаданные объекта распределенного реестра блокчейна. Для последнего используйте подкоманду `meta set` сущности.
- Успешная отправка, за которой следует старая запись, может быть задержкой распространения. Дождитесь окончательного применения и повторите запрос перед повторной отправкой.
- Отклонение разрешения идентифицирует целевой объект и границу полномочий субъекта авторизации. Репетируйте локально или запросите точный токен; не перемещайте приватные данные приложения в публичное метаданное поле, чтобы избежать нарушения контроля доступа.
- Никогда не храните приватные ключи, необработанные личные идентификаторы, токены доступа или большие документы в метаданных.

## Источник и связанные документы {#source-and-related-docs}

- [Интеграционные тесты запросов метаданных на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK создатели транзакций на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Метаданные и варианты распределенного хранения реестра блокчейна](/ru/guide/configure/metadata-and-store-assets.md)
- [Справка по инструкции](/ru/reference/instructions.md)
- [Токены разрешений](/ru/reference/permissions.md)
