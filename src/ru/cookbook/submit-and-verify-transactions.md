---
translation_locale: ru
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Представление и проверка транзакций {#submit-and-verify-transactions}

## Результат {#outcome}

Заранее совершить транзакцию Taira, принять точную ставку по счетам, подписать и представить ее, подождать завершения действия и проверить обязательную транзакцию хэшем.

## Предварительные условия {#prerequisites}

- Финансируемый `taira.client.toml`, `taira.tx-metadata.json` и `TAIRA_ACCOUNT_ID`, произведенный [Связь с Taira](./connect-to-taira.md).
- Текущий `iroha` CLI и `jq`.
- Одноразовый Taira подписитель. Не используйте его ключ или записывайте эти команды на Minamoto.

## Шаги {#steps}

### 1. Определить цель, полномочия и баланс сборов. {#_1-preflight-the-endpoint-authority-and-fee-balance}

Сначала прочтите снимок очереди, а затем докажите, что баланс сборов органа видим. ID из метаданных, полученных по рецепту подключения.

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

При отсутствии баланса счета или сборов, остановитесь.Действительное указание не может пройти прием сборов при невозможности оплаты.

### 2. Цитировать, подписать и представить один раз. {#_2-quote-sign-and-submit-once}

В настоящее время CLI отправляет точную неподписанную полезную нагрузку за предложение по счету, связывает принятое платное намерение с транзакцией, подписывает и подает. JSON в режиме возвращается хэш транзакции, подписанная транзакция и принятая цена вместе.

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

Не используйте `--no-wait` в этом рецепте. Команда ждет подтверждения, прежде чем написать успешный квитанция.

### 3. Подождите, пока трубопровод будет в состоянии. {#_3-wait-for-terminal-pipeline-state}

Используйте помощник типового статуса вместо того, чтобы выводить успех из приема HTTP или ввода в очередь. При помощи `--wait` безопасный маршрутизационный диапазон автоматически отображается, а по умолчанию целевая задача - Finality Applied.

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

`Rejected` и `Expired` являются терминальными неудачами, а не пересматриваемыми состояниями успеха.Запишите их причину перед изменением или восстановлением сделки.

### 4. Прочитайте сохраненную транзакцию {#_4-read-the-stored-transaction}

Статус трубопровода отвечает на вопрос о том, завершена ли обработка. Запрос транзакции проверяет, что допустимая транзакция хранится под тем же хэшем.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Исследователь - это вторая, только для чтения поверхность наблюдения. Это может немного отстать от окончательности трубопровода.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Для инструкции по изменению состояния, заканчивайте запросом об объекте, который был мутирован. Рецепты [Метаданные](./metadata.md), [Фангические активы](./fungible-assets.md) и [NFTs](./nfts.md) включают эти послестоящие чтения.

## Проверка {#verify}

Проверьте , согласны ли все три записи на одном и том же хэштеге и что исследователь больше не сообщает о состоянии ожидания:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Сохраняйте получение заявления и окончательный статус в качестве доказательства. Они содержат информацию о публичной сделке, а не ключ от подписания.

## Устранение неполадок {#troubleshooting}

- HTTP `202` или статус в очереди доказывает только прием. Продолжайте опросы типового статуса, пока не будет применено, отклонено, истек срок действия или ограничено время выхода.
- Если время подачи истекает после возвращения хэша, запрашивайте этот хэш перед созданием другой транзакции. Слепой повторный подача создает новую цитируемую и подписанную полезную нагрузку.
- Предложение о сборе может быть отклонено до подписания. Проверьте `--fee-payer authority`, `gas_asset_id`, баланс органа и сетевую цепочку ID.
- `Rejected` обычно указывает на проверку инструкции, разрешения, сборы или устаревшее состояние. Он является доказательством неудачного исполнения и не должен быть перераспределен как повторная транспортная попытка.
- Исследователь `404` сразу после применения может индексировать задержку. Попробуйте перечислить, но не возвращайте сделку.
- Если привилегированная инструкция работает на генерируемой локальной сети, но Taira отклоняет ее, получите точное разрешение Taira или назначение регулируемого пространства имен.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Подача транзакции и реализация квоты по счетам на финированном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Тесты подтверждения транзакции на закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Сделки](/ru/blockchain/transactions.md)
- [руководство CLI](/ru/get-started/operate-iroha-via-cli.md)
- [конечные точки Torii](/ru/reference/torii-endpoints.md)
