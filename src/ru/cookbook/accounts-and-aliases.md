---
translation_locale: ru
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Счета и прозвища {#accounts-and-aliases}

## Результат {#outcome}

Работать безопасно с доменным каноническим I105 счета IDs и отдельно связанные для чтения человеком псевдонимы, такие как `treasury@payments.universal`. Ты проверишь . Taira Расчеты, вывести свой собственный канонический ID, и решать псевдоним, не путая контекст маршрутизации с идентичностью.

## Предварительные условия {#prerequisites}

- `curl`, `jq`, Python 3.11 или позже, и тока `iroha` CLI.
- `taira.client.toml` от [Свяжитесь с Taira](./connect-to-taira.md) при проверке своего собственного счета.
- Счет, предоставленный через кранок Taira или регулируемый маршрут включения сети до того, как ожидается успешное прочтение конкретного счета.

## Шаги {#steps}

### 1. Проверить канонические отчеты по Taira {#_1-inspect-canonical-accounts-on-taira}

В списке публичных счетов всегда возвращается канонический I105 IDs. Первичный псевдоним является необязательным и сообщается отдельно.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Сборник ID от `.id` Не добавляйте к нему домены. `.primary_alias` является пользовательским ключом поиска, а не другой канонической идентичностью.

### 2. Извлечь и нормализовать свой Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

Прочитайте только публичный ключ из локальной конфигурации. Один и тот же публичный ключ кодируется по-разному для разных профилей общественной сети, поэтому выберите `taira` явно.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

Нормализованное значение должно быть идентичным `TAIRA_ACCOUNT_ID`. Настройка `[account].domain` в файле TOML может быть `wonderland.universal`, но это значение влияет только на контекст маршрутизации и псевдонимов.

### 3. Прочитайте счет и его активы {#_3-read-the-account-and-its-assets}

После предоставления счета, запросите его напрямую и перечислите страницу ограниченного актива. URL - кодируйте значение I105 перед использованием его в пути.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Поищите прозвища, связанные с аккаунтом. {#_4-look-up-aliases-bound-to-the-account}

Обратный резюсер принимает один точный канонический учет ID. Публичные строки пространства данных могут быть прочитаны без заголовков подписи запроса; ограниченные пространства данных требуют авторизованного подписания заявки.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` действителен: счету не требуется псевдоним. Если существует обязательное имя, определить точное полноценное псевдонимо и сравнить возвращенный счет ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Ограничение разрешения

В настоящее время Taira крана может предоставить свой счет претендента, но это не предоставляет общий Регистрация счета или орган по управлению прозвищем. `CanRegisterAccount` Под активным валидатором. SNS лизинг и соответствующие разрешения на псевдоним. Используйте регулируемый план бортового/псевдонима, или репетировать регистрацию в отношении генерируемой локальной сети.

:::

В локальной сети, как только безопасный шаг по предоставлению подписи экспортирует новую каноническую `NEW_ACCOUNT_ID`, поверхность регистрации:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Генерация и хранение совпадающего частного ключа за пределами хранилища документации или приложений. Регистрация ID, ключ контроллера которого был отброшен, создает неиспользуемый счет.

## Проверка {#verify}

Доказать, что общественный ключ конфигурации, кодирование I105 и псевдоним связывающий все конвергируют на одну каноническую учетную запись ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Сохранить канонический счет IDs. Используйте канонический IDs Для подписей, разрешений и инструкций по транзакции. псевдоним на границе применения. ID используется для операции.

## Устранение неполадок {#troubleshooting}

- Пароль анализа или префикса обычно означает, что адрес был кодирован для другого профиля сети. `--profile taira` и отвергают разногласия.
- Расчет `404` после крана `202` может быть задержкой распространения. Проанализируйте счет или финансируемые активы перед отправкой письма.
- `total: 0` от реверсного решателя означает, что видимый псевдоним не связан; это не является ошибкой в поиске счета.
- `401` или `403` из маршрута под псевдонимом указывает на ограниченное пространство данных или недостаточное разрешение на точное разрешение.
- Читаемый `name@domain.dataspace` ценность не принимается везде канонический I105 ID Нужно решить это сначала.
- Если регистрация местного счета удастся, но Taira Если он откажется от него, то разница в разрешении. `CanRegisterAccount`; не менять счет ID для обхода проверки.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Использование канонического адреса учетной записи в закрепленном комитете](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Испытания счета и псевдонима Torii на закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Счета](/ru/blockchain/accounts.md)
- [Прозвища данных-модели](/ru/blockchain/data-model.md#aliases)
- [Конвенции по наименованию](/ru/reference/naming.md)
- [Токены разрешения](/ru/reference/permissions.md)
