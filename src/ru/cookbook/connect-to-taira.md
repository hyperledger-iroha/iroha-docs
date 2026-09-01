---
translation_locale: ru
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Подключиться к Taira {#connect-to-taira}

## Результат {#outcome}

Подтвердите, что Taira доступен, определите канонический идентификатор аккаунта I105 из локальной конфигурации клиента, пополните криптографического подписанта тестнет XOR и отправьте одну транзакцию с канарейкой с указанной комиссией. Этот рецепт никогда не отправляет запись в Minamoto.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Python версии 3.11 или выше, а также текущие бинарные файлы `iroha` и `kagami`.
- A `taira.client.toml`, созданный с использованием цепочки Taira, конечной точки API, профиля аккаунта и выделенного ключа тестовой сети. Следуйте [Создать клиентскую конфигурацию Taira](/ru/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) и храните файл вне системы управления исходным кодом.
- Готовый к запуску `taira_faucet_claim.py` от [Получить тестовую сеть XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), сохранённый рядом с конфигурацией клиента.

## Шаги {#steps}

### 1. Разделите проверку живости и готовности {#_1-separate-liveness-from-readiness}

`/livez` — это проверка работоспособности процесса в виде обычного текста. `/status`, `/health` и `/readyz` возвращают JSON. Рабочий узел может законно возвращать `503` из проверок готовности, когда необходимая подсистема заблокирована.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Используйте `/livez` только для того, чтобы определить, отвечает ли процесс. Используйте `/readyz` для допуска трафика и проверьте его детали блокировщика JSON перед тем, как рассматривать `503` как сбой.

### 2. Запустите общедоступную диагностику {#_2-run-the-public-diagnostics}

Эта проверка только для чтения и не загружает конфигурацию криптографического подписанта:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Не продолжайте писать, когда врач сообщает о жестком DNS, TLS, цепочечном или API сбое конечной точки. Переполненная публичная очередь является временной; подождите и повторите попытку с ограниченной политикой.

### 3. Получите идентификатор аккаунта Taira, не выводя секрет {#_3-derive-the-taira-account-id-without-printing-a-secret}

Считайте только открытый ключ из конфигурации, затем закодируйте его с помощью профиля Taira I105. Значение `[account].domain` обеспечивает контекст маршрутизации; оно не является частью идентификатора аккаунта.

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

Ответ службы финансирования тестовой сети является источником истины для определения актива комиссии. Сохраняйте возвращенный Base58 ID вместо того, чтобы копировать ID из другой сети или старого запуска.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Проверяйте баланс не более одной минуты. Сервис финансирования тестовой сети может вернуть `202 Accepted` до того, как транзакция финансирования станет видимой.

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

`gas_asset_id` — это метаданные транзакции. Явный выбор `--fee-payer authority` привязан к подписи, и CLI получает точную оценку стоимости комиссии до того, как подпишет.

## Проверить {#verify}

Отправьте инструкцию журнала, сохраните запись результата протокола JSON и ожидайте окончательного применения. Пропуск `--no-wait` также заставляет первоначальную отправку ожидать подтверждения; явное чтение статуса подтверждает окончательное состояние рабочего процесса программной обработки.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Окончательная команда выполняется только после того, как транзакция достигает состояния терминала по умолчанию `Applied`. Храните криптографический хэш в тестовых доказательствах; никогда не сохраняйте с ним приватный ключ или полную конфигурацию клиента.

## Устранение неполадок {#troubleshooting}

- `/livez` возвращает `406`, когда запрашивается JSON, потому что этот API конечный пункт `text/plain`. Отправьте `Accept: text/plain`, как показано выше.
- `/health` или `/readyz` могут возвращать `503` с машинно-читаемым блокером, даже когда `/livez` и `/status` работают. Исправьте или дождитесь этого блокера; повторная генерация ключей не изменит готовность узла.
- Служба финансирования тестовой сети `502`, тайм-аут или устаревший якорь доказательства работы являются сбоем публичной службы. Получите новую задачу и попробуйте позже.
- Ошибка префикса I105 означает, что открытый ключ был закодирован с неправильным профилем. Повторно выполните `iroha tools address convert --profile taira`.
- Отклонение запроса на оплату обычно означает, что основной счет авторизации не был профинансирован, метаданные актива комиссии устарели или не был выбран явный плательщик комиссии.
- Регистрация, выдача или управление пространством имён могут быть отклонены даже после успешного выполнения этого канарейки. Для этих операций требуются отдельные разрешения времени выполнения программного обеспечения; репетируйте их в созданной локальной сети, когда доступ Taira не предоставлен.

## Исходные и связанные документы {#source-and-related-docs}

- [Taira CLI диагностика и пробный источник на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Явный выбор комиссии и источник подачи CLI в закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Руководство по аккаунту Taira и услугам финансирования тестовой сети](/ru/get-started/sora-nexus-dataspaces.md)
- [Конфигурация клиента](/ru/guide/configure/client-configuration.md)
- [Транзакции](/ru/blockchain/transactions.md)
