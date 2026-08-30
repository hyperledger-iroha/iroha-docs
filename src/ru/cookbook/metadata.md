---
translation_locale: ru
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Метаданные {#metadata}

## Результат {#outcome}

Прочитать метаданные на Taira, установить и проверить значение одного метаданных счета с транзакцией, платящей плату, и снова удалять стоимость. Вы будете хранить метаданные объекта бухгалтерского учета отдельно от метаданных с платежей за транзакцию.

## Предварительные условия {#prerequisites}

- `curl`, `jq`, Python 3.11 или позже, и тока `iroha` CLI.
- Финансируемая сумма `taira.client.toml` и `taira.tx-metadata.json` от [Связь с Taira](./connect-to-taira.md).
- Власть над метаданными целевой учетной записи. Пример нацелен на самого конфигурированного органа; другая учетная запись требует точного разрешения.

## Шаги {#steps}

### 1. Читать метаданные без подписчика. {#_1-read-metadata-without-a-signer}

Метаданные - это проверенная карта `Name` на карту JSON. Пустые карты и пустые фильтрованные результаты являются действительными результатами.

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

Используйте метаданные для небольших описательных или индексирующих полей. Оставьте большие полезные нагрузки вне бухгалтерского учета и храните вместо них ссылку URI или SoraFS.

### 2. Извлечь целевой счет {#_2-derive-the-target-account}

Читайте только публичный ключ из конфигурации Taira и преобразуйте его в каноническую форму без домена I105.

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

### 3. Установить одно значение JSON {#_3-set-one-json-value}

В настоящее время JSON прочитанный из стандартного ввода становится учетной записью `cookbook_profile` В отличие от этого, `--metadata ./taira.tx-metadata.json` Поскольку эти две карты имеют разные цели и цели.

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

CLI цитирует комиссию, подписывает, отправляет и ждет по умолчанию. Не добавляйте `--no-wait`, когда следующая операция зависит от этого значения.

::: warning Ограничение разрешения

Активный валидатор решает, кто может мутировать каждый объект. Обновление другой учетной записи обычно требует `CanModifyAccountMetadata`; домены, определения активов, NFTs, и триггеры имеют свои собственные разрешения на метаданные для конкретных целей. Если Taira не предоставил требуемый авторитет, выполните те же команды учетной записи с помощью `./localnet/client.toml`, замените канонический код генерируемого органа локальной сети I105 ID и упустите файл метаданных по гонорам Taira.

:::

### 4. Убрать ключ. {#_4-remove-the-key}

Сначала прочитайте обязательную стоимость, а затем представьте отдельную транзакцию снятия.

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

Для приложений Python соответствующие типовые конструкторы являются `Instruction.set_account_key_value` и `Instruction.remove_account_key_value`; представьте их с метаданными транзакции и помощником для ожидания из учебника [Python](/ru/guide/tutorials/python.md#shared-setup).

## Проверка {#verify}

После установленной сделки `meta get` должен вернуть объект с `version: 1`. После удаления прямой поиск больше не должен возвращать значение:

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

Отдельный отчет отличает отсутствующий ключ метаданных от ключа Неисправность сети или учетной записи. JSON значение после его установки.

## Устранение неполадок {#troubleshooting}

- Стандартный вход должен содержать одно действительное значение JSON. Для строков необходимы цитаты JSON; объекты и массивы должны быть хорошо сформированы.
- Ключи метаданных являются значениями `Name` и чувствительны к случаям после анализа. Сохраняйте стабильный словарный запас ключей вместо создания версионных ключей для каждого изменения схемы.
- `--metadata` - это метаданные транзакции; он не устанавливает метаданные объекта бухгалтерского учета. `meta set` подкомандование для последнего.
- Успешное представление, за которым следует старое чтение, может быть задержкой распространения. Подождите окончательность применения и перепробуйте запрос перед повторным направлением.
- Отказ в разрешении идентифицирует объект-цель и границу полномочий. Повторяйте на местном уровне или запросите точный токен; не перемещайте частные данные приложения в публичное поле метаданных, чтобы избежать контроля доступа.
- Никогда не храните в метаданных личные ключи, персональные идентификаторы, токены доступа или большие документы.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Тесты интеграции метаданных запросов на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK строители транзакций при закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Метаданные и варианты хранения в бухгалтерском учете](/ru/guide/configure/metadata-and-store-assets.md)
- [Ссылка на инструкцию ](/ru/reference/instructions.md)
- [Токены разрешения](/ru/reference/permissions.md)
