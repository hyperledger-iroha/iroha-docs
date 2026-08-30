---
translation_locale: ru
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 263e058a0877e1a3c48b6514b127bc56022e3d244284e0b72881743a4aee0f58
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Подключение к Taira {#connect-to-taira}

## Результат {#outcome}

Подтвердить, что Taira доступен, вывести канонический счет I105 ID из локальной конфигурации клиента, финансировать подписавшего с помощью тестовой сети XOR и представить одну транзакцию по цене. Этот рецепт никогда не отправляет письмо на Minamoto.

## Предварительные условия {#prerequisites}

- `curl`, `jq`, Python 3.11 или более поздние и текущие бинарные `iroha` и `kagami`.
- А . `taira.client.toml` созданные с Taira цепочка, конечная точка, профиль счета и специальный ключ тестирования сети. [Создать Taira Конфигурация клиента](/ru/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) и держать файл вне контроля источника.
- Готовый к запуску `taira_faucet_claim.py` из [Get Testnet XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), сохраненный рядом с конфигурацией клиента.

## Шаги {#steps}

### 1. Отделить жизненность от готовности. {#_1-separate-liveness-from-readiness}

`/livez` - это просто-текстовый процессовый пробный тест. `/status`, `/health`, и `/readyz` возвращение JSON. Работающий узел может законно вернуться `503` из зонды готовности, когда требуемая подсистема блокируется.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Используйте `/livez` только для того, чтобы решить, отвечает ли процесс. Используйте `/readyz` для пропуска дорожного движения и проверьте его детали блокировщика JSON перед тем, как рассматривать `503` в качестве выключения.

### 2. Проведение общественной диагностики {#_2-run-the-public-diagnostics}

Эта проверка доступна только для чтения и не загружает конфигурацию подписи:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Не продолжайте писать, когда врач сообщает о неисправности твердого DNS, TLS, цепочки или конечной точки. Насыщенная общественная очередь - это временное; ждите и попробуйте снова с ограниченной политикой.

### 3. Извлечь счет Taira ID без напечатки секрета. {#_3-derive-the-taira-account-id-without-printing-a-secret}

Прочитайте только общественный ключ из конфигурации, а затем кодируйте его с Taira I105 Профиль. `[account].domain` Контекст маршрутизации ценности; он не является частью учетной записи. ID.

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

Выход представляет собой бездоменный канонический адрес I105. Названия, такие как `wallet@payments.universal`, являются псевдонимами и должны быть решены до того, как они будут использованы в строгих полях учета.

### 4. Заявление текущего актива по счетам Taira {#_4-claim-the-current-taira-fee-asset}

Ответ на трубку является источником истины для определения стоимости актива. Сохраняйте возвращенную Base58 ID вместо копирования ID из другой сети или старой версии.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Проанализируйте баланс на максимум одну минуту. `202 Accepted` до того, как транзакция по финансированию будет видимой.

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

`gas_asset_id` - это метаданные транзакции. Явный выбор `--fee-payer authority` связан подписью, а CLI получает точную цитату платы до подписания.

## Проверка {#verify}

Поставьте инструкцию в журнале, сохраните квитанцию JSON и ждите завершения действия. Выдача `--no-wait` также заставляет первоначальное представление ждать подтверждения; четкое прочтение состояния доказывает окончательное состояние трубопровода.

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

Конечная команда выполняется только после того, как транзакция достигает стандартного состояния `Applied` терминала. Хранить хэш в тестовых доказательствах; никогда не хранить с ним частный ключ или полную конфигурацию клиента.

## Устранение неполадок {#troubleshooting}

- `/livez` возвращения `406` по запросу JSON потому что эта конечная точка `text/plain`. Пошлите . `Accept: text/plain` как показано выше.
- `/health` или `/readyz` могут возвращать `503` с помощью машинночитаемого блокера, даже в то время как `/livez` и `/status` работают. Установите или ждите этого блокера; регенерационные клавиши не изменят готовность узлов.
- Наводка `502`, отсрочка или устаревшая вертикаль работы - это неудача общественного обслуживания.
- Сборник I105 ошибка префикса означает, что общественный ключ был кодирован неправильным профилем. `iroha tools address convert --profile taira`.
- Отказ от пошлины обычно означает, что орган не был профинансирован, метаданные об активах пошлины устарели или нет выбранного явного плательщика пошлины.
- Регистрация, отпечатка или управление именными пространствами все еще могут быть отвергнуты после того, как этот канарный удастся. Эти операции требуют отдельных разрешений на время запуска; репетировать их в генерируемой локальной сети, когда: Taira доступ не предоставлен.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Taira CLI диагностика и канарный источник на финированном комитете](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Явный выбор сборов и источник подачи CLI в закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira учетная запись и руководство к крану](/ru/get-started/sora-nexus-dataspaces.md)
- [Конфигурация клиента](/ru/guide/configure/client-configuration.md)
- [Сделки](/ru/blockchain/transactions.md)
