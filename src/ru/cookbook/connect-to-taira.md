---
translation_locale: ru
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Подключиться к Taira {#connect-to-taira}

## Результат {#outcome}

Подтвердите, что Taira доступен, определите канонический идентификатор аккаунта I105 из локальной конфигурации клиента, пополните криптографического подписанта тестнет XOR и отправьте одну транзакцию с канарейкой с указанной комиссией. Этот рецепт никогда не отправляет запись в Minamoto.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Python версии 3.11 или выше, а также текущие бинарные файлы `iroha` и `kagami`.
- Файл `taira.client.toml`, созданный с использованием цепочки Taira, точного `network_id`, конечной точки API, профиля аккаунта и выделенного ключа тестовой сети. Следуйте [Создать клиентскую конфигурацию Taira](/ru/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) и храните файл вне системы управления исходным кодом.
- Доступный для записи рабочий каталог для журнала службы финансирования тестовой сети: `iroha taira account faucet prepare` создаёт `./taira-faucet` с закрытыми правами доступа и отказывается заменять существующий каталог.

## Шаги {#steps}

### 1. Разделите проверку живости и готовности {#_1-separate-liveness-from-readiness}

`/livez`, `/health` и `/readyz` — это проверки в виде обычного текста; `/status` возвращает JSON. Рабочий узел может законно возвращать `503` из `/readyz`, когда допуск к консенсусу или другая необходимая подсистема недоступны.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Используйте `/livez` только для того, чтобы определить, отвечает ли процесс. Используйте `/readyz` для допуска трафика. Его `503` — это оболочка ошибки `service_unavailable` без сведений о блокировщике, поэтому выполните приведённую ниже диагностику, прежде чем считать это сбоем.

### 2. Запустите общедоступную диагностику {#_2-run-the-public-diagnostics}

Эта проверка только для чтения и не загружает конфигурацию криптографического подписанта:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Не продолжайте писать, когда врач сообщает о жестком DNS, TLS, цепочечном или API сбое конечной точки. Переполненная публичная очередь является временной; подождите и повторите попытку с ограниченной политикой.

### 3. Получите идентификатор аккаунта Taira, не выводя секрет {#_3-derive-the-taira-account-id-without-printing-a-secret}

Считайте только открытый ключ из конфигурации, затем закодируйте его с помощью профиля Taira I105. Идентификатор аккаунта не содержит домена; `[account].profile` выбирает только его сетевой префикс.

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
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

Выходной результат — это бездоменный канонический адрес I105. Имена, такие как `wallet@payments.universal`, являются псевдонимами и должны быть разрешены перед использованием в строгих полях учетной записи.

### 4. Получите текущий актив комиссии Taira {#_4-claim-the-current-taira-fee-asset}

Политика службы финансирования тестовой сети указывает текущее определение актива комиссии. Сохраняйте его ID Base58 вместо того, чтобы копировать ID из другой сети или старого запуска. Политика — это неподписанные данные для обнаружения, поэтому автоматизация должна фиксировать ожидаемых эмитента, определение актива и сумму, а не доверять каждому ответу.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` решает задачу доказательства работы и сохраняет точную подписанную транзакцию; `submit` отправляет её один раз и возвращается после её применения. Если `submit` сообщает `Pending` или истекает время ожидания, выполните `taira account faucet resume` с той же конфигурацией и журналом вместо подготовки новой заявки. Затем проверяйте баланс не более одной минуты.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

Используйте `--fee-payer authority` для каждой записи в Taira. Выбор привязан к подписи, и CLI получает точную котировку комиссии в активе комиссии Taira до подписания.

## Проверить {#verify}

Отправьте инструкцию журнала, сохраните запись результата протокола JSON и ожидайте окончательного применения. Пропуск `--no-wait` также заставляет первоначальную отправку ожидать подтверждения; явное чтение статуса подтверждает окончательное состояние рабочего процесса программной обработки.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Окончательная команда выполняется успешно только после того, как точный глобальный статус сообщает о финальности `Applied`, подтверждённой состоянием. Храните криптографический хэш в тестовых доказательствах; никогда не сохраняйте с ним приватный ключ или полную конфигурацию клиента.

## Устранение неполадок {#troubleshooting}

- `/livez`, `/health` и `/readyz` возвращают `406`, когда запрашивается только JSON, потому что они отвечают в `text/plain`. Отправляйте заголовки `Accept`, показанные выше.
- `/readyz` может возвращать `503` с оболочкой ошибки `service_unavailable`, даже когда `/livez` и `/status` работают. Дождитесь готовности или выполните `iroha taira doctor`; повторная генерация ключей не изменит готовность узла.
- Ответ `502` или тайм-аут службы финансирования тестовой сети во время `submit` оставляет результат заявки неизвестным: выполните `taira account faucet resume` с той же конфигурацией и журналом вместо подготовки новой заявки. Устаревший якорь доказательства работы приводит к сбою `prepare`; подготовьте заявку заново в новом каталоге журнала.
- Ошибка префикса I105 означает, что открытый ключ был закодирован с неправильным профилем. Повторно выполните `iroha tools address convert --profile taira`.
- Отклонение котировки комиссии обычно означает, что полномочный субъект не пополнен или настроенный `network_id` не принадлежит Taira. Отсутствие `--fee-payer` или ключ комиссии, например `gas_asset_id`, в `--metadata` приводит к локальной ошибке ещё до котировки.
- Регистрация, выдача или управление пространством имён могут быть отклонены даже после успешного выполнения этого канарейки. Для этих операций требуются отдельные разрешения времени выполнения программного обеспечения; репетируйте их в созданной локальной сети, когда доступ Taira не предоставлен.

## Исходные и связанные документы {#source-and-related-docs}

- [Диагностика CLI Taira и исходный код канареечной проверки](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) и [команды крана](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) на закрепленной версии исходного кода
- [Явный выбор комиссии и источник подачи CLI в закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Руководство по аккаунту Taira и услугам финансирования тестовой сети](/ru/get-started/sora-nexus-dataspaces.md)
- [Конфигурация клиента](/ru/guide/configure/client-configuration.md)
- [Транзакции](/ru/blockchain/transactions.md)
