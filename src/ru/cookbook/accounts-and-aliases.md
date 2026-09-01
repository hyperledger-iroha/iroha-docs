---
translation_locale: ru
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Аккаунты и псевдонимы {#accounts-and-aliases}

## Результат {#outcome}

Работайте безопасно с каноническими идентификаторами учетных записей без домена I105 и отдельно привязанными человекочитаемыми псевдонимами, такими как `treasury@payments.universal`. Вы будете проверять учетные записи Taira, создавать собственный канонический идентификатор и разрешать псевдонимы, не путая контекст маршрутизации с идентичностью.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Python 3.11 или более поздняя версия, и текущий `iroha` CLI.
- Ошибка `taira.client.toml` от [Подключиться к Taira](./connect-to-taira.md) при проверке вашего собственного аккаунта.
- Учетная запись, предоставленная через службу финансирования тестовой сети Taira или управляемый путь подключения сети, перед тем как ожидать успешного выполнения запроса на чтение, специфичного для учетной записи.

## Шаги {#steps}

### 1. Проверьте канонические учетные записи на Taira {#_1-inspect-canonical-accounts-on-taira}

Список публичных аккаунтов всегда возвращает канонические идентификаторы I105. Основной псевдоним является необязательным и указывается отдельно.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Идентификатор из `.id` действителен для строгих полей аккаунта. Не добавляйте к нему домен. Псевдоним из `.primary_alias` является ключом для поиска пользователем, а не другой канонической идентичностью.

### 2. Выведите и нормализуйте свой Taira I105 идентификатор {#_2-derive-and-normalize-your-taira-i105-id}

Читайте только открытый ключ из локальной конфигурации. Один и тот же открытый ключ кодируется по-разному для разных профилей публичной блокчейн-сети, поэтому явно выберите `taira`.

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

Нормализованное значение должно быть идентично `TAIRA_ACCOUNT_ID`. Параметр `[account].domain` в файле TOML может быть `wonderland.universal`, но это значение влияет только на маршрутизацию и контекст псевдонима.

### 3. Прочитайте счет и его активы {#_3-read-the-account-and-its-assets}

После того как учетная запись будет создана, запросите ее напрямую и выведите страницу с ограниченным активом. URL-кодируйте значение I105 перед использованием его в пути.

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

### 4. Просмотрите псевдонимы, привязанные к аккаунту {#_4-look-up-aliases-bound-to-the-account}

Обратный резолвер принимает один точный канонический идентификатор аккаунта. Строки публичного пространства данных можно читать без заголовков подписи запроса; ограниченные пространства данных требуют авторизованного подписанного запроса.

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

`total: 0` действителен: учетной записи не нужен псевдоним. Когда привязка существует, определите ее точный полностью квалифицированный псевдоним и сравните возвращенный идентификатор учетной записи:

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

::: warning Граница разрешений

Сервис финансирования тестовой сети Taira может пополнять свой аккаунт заявителя, но это не предоставляет общего права на регистрацию аккаунтов или управления псевдонимами. Регистрация другого аккаунта требует `CanRegisterAccount` под активным валидатором. Псевдонимы учетной записи обычно также требуют активной аренды SNS и соответствующих разрешений для псевдонима. Используйте регулируемый планировщик подключения/псевдонимов или репетируйте регистрацию через созданную локальную сеть.

:::

В локальной сети, как только шаг безопасного криптографического предоставления ключа подписи экспортировал новый канонический `NEW_ACCOUNT_ID`, поверхность регистрации выглядит следующим образом:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Создайте и сохраните соответствующий закрытый ключ вне документации или репозитория приложения. Регистрация идентификатора, контроллерский ключ которого был утерян, создаёт непригодную для использования учетную запись.

## Проверить {#verify}

Докажите, что конфигурационный открытый ключ, кодирование I105 и привязка псевдонима все сходятся к одному каноническому идентификатору аккаунта:

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

Храните канонические идентификаторы аккаунтов. Используйте канонические идентификаторы для подписей, разрешений и инструкций транзакций. Разрешайте псевдоним на границе приложения. Сохраняйте канонический идентификатор аккаунта, использованный для операции.

## Устранение неполадок {#troubleshooting}

- Ошибка синтаксического разбора или префикса обычно означает, что адрес был закодирован для другого сетевого профиля. Нормализуйте с помощью `--profile taira` и отклоняйте несоответствия.
- Счёт `404` после тестовой сети финансирования `202` может подвергаться задержке распространения. Проверьте счёт или финансируемый актив перед отправкой записи.
- `total: 0` от обратного резольвера означает, что видимый псевдоним не связан; это не ошибка поиска учетной записи.
- `401` или `403` через маршрут-псевдоним указывают на ограниченное пространство данных или недостаточные права на точное разрешение. Не используйте широкий поиск по префиксу в качестве резервного варианта.
- Читаемое значение `name@domain.dataspace` не принимается везде, где требуется канонический идентификатор I105. Сначала решите эту проблему.
- Если регистрация локальной учетной записи проходит успешно, но Taira ее отклоняет, разница заключается в авторизации. Получите `CanRegisterAccount`; не меняйте идентификатор учетной записи, чтобы обойти проверку.

## Исходные и связанные документы {#source-and-related-docs}

- [реализация канонического адреса аккаунта на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Тесты аккаунта и псевдонима Torii на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Счета](/ru/blockchain/accounts.md)
- [Псевдонимы модели данных](/ru/blockchain/data-model.md#aliases)
- [Конвенции именования](/ru/reference/naming.md)
- [Токены разрешений](/ru/reference/permissions.md)
