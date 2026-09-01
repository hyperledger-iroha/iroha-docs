---
translation_locale: ru
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Отправить и Проверить Транзакции {#submit-and-verify-transactions}

## Результат {#outcome}

Предварительно проверьте транзакцию Taira, примите точную оценку комиссии, подпишите и отправьте её, дождитесь применённой окончательности и проверьте завершённую транзакцию по криптографическому хэшу.

## Предварительные требования {#prerequisites}

- Финансируемый `taira.client.toml`, `taira.tx-metadata.json` и `TAIRA_ACCOUNT_ID`, произведённый [Подключиться к Taira](./connect-to-taira.md).
- Текущий `iroha` CLI и `jq`.
- Одноразовый Taira криптографический подписант. Не используйте повторно его ключ или эти команды записи на Minamoto.

## Шаги {#steps}

### 1. Выполните предварительную проверку конечной точки API, основного пользователя авторизации и баланса комиссии {#_1-preflight-the-endpoint-authority-and-fee-balance}

Сначала прочитайте снимок данных очереди, затем докажите, что баланс комиссии субъекта авторизации виден. Прочитайте Base58 ID определения актива из метаданных, созданных рецептом подключения.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Остановитесь, если отсутствует баланс счёта или комиссия. Действительная инструкция не может пройти проверку комиссии, если её главный авторизационный источник не может оплатить.

### 2. Цитируйте, подпишите и отправьте один раз {#_2-quote-sign-and-submit-once}

CLI отправляет точную неподписанную полезную нагрузку для оценки стоимости комиссии, связывает принятую платёжную Intent в транзакцию, подписывает и отправляет. Режим JSON возвращает криптографический хэш транзакции, подписанную транзакцию и принятую котировку вместе.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Не используйте `--no-wait` в этом рецепте. Команда ждет подтверждения перед тем, как записать запись успешного протокольного результата.

### 3. Подождите, пока программное обеспечение терминала обработает состояние рабочего процесса {#_3-wait-for-terminal-pipeline-state}

Используйте помощник по статусу с набором текста вместо того, чтобы делать вывод о успехе на основе принятия HTTP или допуска в очередь. С `--wait` область безопасной маршрутизации выбирается автоматически, а целевой параметр по умолчанию — Применённая окончательность.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` и `Expired` являются конечными ошибками, а не повторяемыми успешными состояниями. Зафиксируйте их причину перед изменением или перестройкой транзакции.

### 4. Прочитайте сохранённую транзакцию {#_4-read-the-stored-transaction}

Статус рабочего процесса обработки программного обеспечения указывает, завершена ли обработка. Запрос транзакции проверяет, что принятая транзакция хранится под тем же криптографическим хешем.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Обозреватель — это вторичный интерфейс наблюдения только для чтения. Он может ненадолго отставать от финальности конвейера обработки.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Для инструкции, изменяющей состояние, завершайте запросом объекта, который был изменён. Рецепты [Метаданные](./metadata.md), [Взаимозаменяемые активы](./fungible-assets.md) и [NFTs](./nfts.md) включают эти чтения после изменения состояния.

## Проверить {#verify}

Проверьте, что все три записи совпадают по одному и тому же криптографическому хэшу и что обозреватель больше не сообщает о состоянии ожидания:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Сохраняйте запись результата протокола подачи и окончательный статус в качестве доказательства тестирования. Они содержат материалы о публичных транзакциях, а не ключ подписи.

## Устранение неполадок {#troubleshooting}

- HTTP `202` или состояние в очереди доказывает только прием. Продолжайте опрашивать указанный статус до получения Applied, Rejected, Expired или до истечения ограниченного времени ожидания.
- Если время подачи истекает после возврата криптографического хэша, запросите этот криптографический хэш перед созданием другой транзакции. Слепая повторная подача создает новый цитируемый и подписанный полезный нагрузочный пакет.
- Оценка цены комиссии может быть отклонена до подписания. Проверьте `--fee-payer authority`, `gas_asset_id`, баланс полномочного представителя и идентификатор цепочки сети.
- `Rejected` обычно указывает на проверку инструкции, разрешения, сборы или устаревшее состояние. Это окончательное подтверждение неудавшегося выполнения и не должно переклассифицироваться как повторная попытка передачи.
- Если сразу после состояния Applied обозреватель возвращает `404`, причиной может быть задержка индексации. Повторите чтение; не отправляйте транзакцию заново.
- Если привилегированная инструкция работает на сгенерированной локальной сети, но Taira её отклоняет, получите точное разрешение Taira или назначение управляемого пространства имён. Локальный результат не предоставляет полномочий субъекта авторизации публичной сети блокчейн.

## Исходные и связанные документы {#source-and-related-docs}

- [Отправка транзакции и реализация запроса комиссии на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Реализация подтверждения транзакции и тесты на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Транзакции](/ru/blockchain/transactions.md)
- [CLI руководство](/ru/get-started/operate-iroha-via-cli.md)
- [Torii API конечные точки](/ru/reference/torii-endpoints.md)
