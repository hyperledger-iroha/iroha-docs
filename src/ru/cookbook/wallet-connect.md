---
translation_locale: ru
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Wallet Connect: Подтвердите перевод актива {#wallet-connect-approve-an-asset-transfer}

## Результат {#outcome}

Создайте сессию Iroha Connect в браузере, получите криптографическое одобрение для одной идентичности кошелька I105, попросите этот кошелек подписать точную неподписанную полезную нагрузку передачи активов Torii, отправьте отдельную подпись и дождитесь окончательного применения.

## Предварительные требования {#prerequisites}

- Браузерное приложение с использованием `@iroha/iroha-js` и HTTPS.
- Кошелек, который реализует Iroha Connect v1, управляет аккаунтом Ed25519 I105 с одним ключом и предоставляет методы `sign_transaction` и `sign_raw`.
- Текущий идентификатор сети Taira, зарегистрированный в кошельке публичный ключ Ed25519 в нижнем регистре в шестнадцатеричном формате, принадлежащий вам передаваемый актив и каноническое назначение I105.
- Идентификатор актива комиссии, опубликованный текущей политикой службы финансирования тестовой сети Taira. Пример сверяет с этим идентификатором текущую оценку комиссии и никогда не встраивает скопированный идентификатор актива.
- На выбранном Torii должен быть включён Connect. Прочитайте идентификатор сети из публичных возможностей аккаунта перед отображением QR или глубокой ссылки:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii не публикует анонимный статус Connect: `GET /v1/connect/status` сообщает о сессии только владельцу её токена управления, а сводный статус требует подписи оператора. Когда узел отключает Connect, `registerConnectSession` завершается ошибкой HTTP `503` с кодом `connect_disabled` (`404`, если сборка не включает Connect), и пример не показывает ни QR-кода, ни глубокой ссылки; используйте сгенерированную локальную сеть с включенным Connect. Обычная передача активов также требует, чтобы в кошельке было достаточно передаваемого количества и баланса для оплаты комиссии.

## Шаги {#steps}

### 1. Обеспечьте один контроль запуска кошелька {#_1-provide-one-wallet-launch-control}

Ниже приведённый JavaScript ожидает этот элемент на странице приложения:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Отобразите тот же URI как QR код для кошелька на другом устройстве. URI содержит токен реле, ограниченный кошельком, поэтому не помещайте его в аналитику, логи, источники ссылок или отчёты о сбоях.

### 2. Создавать, утверждать, подписывать и отправлять {#_2-create-approve-sign-and-submit}

Этот браузерный модуль принимает конкретные значения из состояния вашего приложения. Первый `POST /v1/assets/transfer` пропускает поля подписи и возвращает намерение оплаты комиссии с котировкой и неподписанную полезную нагрузку транзакции. Второй добавляет только открытый ключ кошелька и отдельную подпись к тому же запросу на перевод. Torii требует каноническую подпись аккаунта для обоих запросов, поэтому модуль поручает кошельку подписать их через `createConnectCanonicalRequestAuth`.

```js
import { buildCanonicalJsonRequest } from '@iroha/iroha-js/canonical-request'
import {
  NetworkId,
  createConnectAppSession,
  createConnectCanonicalRequestAuth,
  createConnectSessionPreview,
  deleteConnectSession,
  registerConnectSession,
  toHex,
} from '@iroha/iroha-js/connect-browser'
import { ToriiBrowserClient } from '@iroha/iroha-js/torii-browser'

const baseUrl = 'https://taira.sora.org'
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const decodeBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
const encodeBase64 = (bytes) =>
  btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))

async function postSignedJson(path, body, auth, networkId) {
  const request = await buildCanonicalJsonRequest({
    nativeIdentity: auth.nativeIdentity,
    accountId: auth.authAccountId,
    networkId,
    method: 'POST',
    path,
    baseUrl,
    body,
    sign: auth.sign,
  })
  const response = await fetch(`${baseUrl}${path}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
  if (!response.ok) {
    throw new Error(
      `${path}: HTTP ${response.status}: ${await response.text()}`,
    )
  }
  return response.json()
}

async function waitForApplied(transactionHash) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const url = new URL('/v1/pipeline/transactions/status', baseUrl)
    url.searchParams.set('hash', transactionHash)
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (response.status === 404) {
      await wait(1_000)
      continue
    }
    if (!response.ok) {
      throw new Error(`pipeline status: HTTP ${response.status}`)
    }
    const status = await response.json()
    const kind = status.status?.kind
    if (kind === 'Applied') return status
    if (kind === 'Rejected' || kind === 'Expired') {
      throw new Error(`${kind}: ${JSON.stringify(status.status)}`)
    }
    await wait(1_000)
  }
  throw new Error('transaction did not reach Applied within 60 seconds')
}

export async function transferWithWallet({
  networkIdLiteral,
  authority,
  publicKeyHex,
  assetDefinitionId,
  destination,
  amount,
  faucetFeeAssetDefinitionId,
}) {
  if (!/^[0-9a-f]{64}$/.test(publicKeyHex)) {
    throw new Error('publicKeyHex must be 32-byte lower-case Ed25519 hex')
  }
  const networkId = NetworkId.parse(networkIdLiteral)
  const torii = new ToriiBrowserClient(baseUrl, { networkId })

  const preview = createConnectSessionPreview({
    networkId,
    node: baseUrl,
  })
  const relay = await registerConnectSession(
    baseUrl,
    preview,
    {
      node: baseUrl,
    },
  )
  let connect

  try {
    connect = createConnectAppSession({
      baseUrl,
      preview,
      session: relay,
      inspectAccountIdentity: (accountId, options) =>
        torii.inspectAccountIdentity(accountId, options),
      permissions: {
        methods: ['sign_transaction', 'sign_raw'],
        resources: [assetDefinitionId],
      },
      appMeta: { name: 'Iroha cookbook transfer' },
    })

    const launch = document.querySelector('#wallet-connect')
    if (!(launch instanceof HTMLAnchorElement)) {
      throw new Error('missing #wallet-connect anchor')
    }
    launch.href = relay.wallet_uri
    launch.hidden = false

    const approval = await connect.waitForApproval()
    if (approval.accountId !== authority) {
      throw new Error('wallet approved a different I105 account')
    }
    if (toHex(approval.signingPublicKey) !== publicKeyHex) {
      throw new Error('enrolled public key does not control authority')
    }
    const auth = await createConnectCanonicalRequestAuth(connect)

    const transfer = {
      authority,
      asset_definition_id: assetDefinitionId,
      asset_balance_scope: 'global',
      amount,
      destination,
      fee_payment: {
        payer: 'authority',
        value: { charge_limits: [], gas_limit: null },
      },
      creation_time_ms: Date.now(),
      transaction_ttl_ms: 120_000,
      memo: 'iroha-cookbook-wallet-connect',
    }

    const prepared = await postSignedJson(
      '/v1/assets/transfer',
      transfer,
      auth,
      networkId,
    )
    if (!prepared.ok || prepared.submitted) {
      throw new Error('Torii did not return an unsigned transaction payload')
    }
    const limits = prepared.intent.fee_payment.value.charge_limits
    if (
      limits.some(
        (limit) =>
          limit.asset_definition_id !== faucetFeeAssetDefinitionId,
      )
    ) {
      throw new Error(
        'live fee quote uses an asset other than the faucet policy asset',
      )
    }

    const signature = await connect.signTransaction(
      decodeBase64(prepared.transaction_payload_b64),
    )
    if (signature.length !== 64) {
      throw new Error('wallet returned a non-Ed25519 signature length')
    }

    const submitted = await postSignedJson(
      '/v1/assets/transfer',
      {
        ...transfer,
        public_key_hex: publicKeyHex,
        signature_base64: encodeBase64(signature),
      },
      auth,
      networkId,
    )
    if (!submitted.ok || !submitted.submitted) {
      throw new Error('signed transfer was not accepted')
    }

    return {
      transactionHash: submitted.transaction_hash_hex,
      pipelineStatus: await waitForApplied(submitted.transaction_hash_hex),
    }
  } finally {
    connect?.close('application finished request')
    await deleteConnectSession(baseUrl, relay.sid, {
      tokenManagement: relay.token_management,
    })
  }
}
```

Держите `token_app`, `token_management` и `token_relay` в памяти приложения. Только при запуске кошелька URI/токен передаются в кошелек. Подтверждение Connect подписывается идентификацией аккаунта; X25519 `walletPublicKey` в подтверждении является временным транспортным ключом, а не ключом подписи Ed25519 аккаунта.

### 3. Используйте типы рамок Rust в реализации кошелька {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Поверхность протокола Rust может зафиксировать подпись только после того, как кошелек расшифровал запрошенную транзакцию, показал её точное намерение, применил политику и подписал с использованием одобренного ключа учетной записи. Этот помощник принимает эту проверенную подпись; он не создает её самостоятельно:

```rust
use iroha_crypto::{Algorithm, Signature};
use iroha_torii_shared::{connect as proto, connect_sdk as sdk};

fn seal_wallet_signature(
    wallet_direction_key: &[u8; 32],
    sid: &[u8; 32],
    sequence: u64,
    validated_signature: Signature,
) -> proto::ConnectFrameV1 {
    let payload = proto::ConnectPayloadV1::SignResultOk {
        signature: proto::WalletSignatureV1::new(
            Algorithm::Ed25519,
            validated_signature,
        ),
    };
    sdk::seal_envelope_current(
        wallet_direction_key,
        sid,
        proto::Dir::WalletToApp,
        sequence,
        payload,
    )
}
```

Примеры репозитория `connect_app` и `connect_wallet` являются демонстрациями протокола: приложение выводит URI кошелька вместе с его токеном в стандартный вывод, а кошелёк получает свои токены в виде аргументов командной строки и подписывает запрошенные байты, не декодируя и не отображая их. Используйте их только для изучения фреймов, никогда не как реализацию кошелька Taira.

## Проверить {#verify}

Сохраните возвращённый криптографический хеш и подтвердите пост-состояние назначения через публичный эндпоинт держателей API:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

Проверка проходит успешно только тогда, когда JavaScript официант наблюдает за `Applied` для предоставленного криптографического хэша транзакции, и приемник отображает перевод. Одобрение HTTP или одобрение кошелька само по себе не является окончательностью распределённого реестра блокчейна.

## Устранение неполадок {#troubleshooting}

- `503` с кодом `connect_disabled` или `404` от `registerConnectSession` означает, что на этом узле невозможно создать сеанс ретрансляции. Переключитесь на включенную локальную сеть; не возвращайтесь к транспортировке токенов приложения или управления самостоятельно.
- `USER_DENIED` — это решение кошелька. Сохраняйте его как результат для конечного пользователя, вместо того чтобы открывать повторяющиеся запросы на одобрение.
- Несоответствие одобрения и аккаунта или недействительная подпись одобрения должны приводить к закрытию сессии. Никогда не просите кошелёк подписывать после неудачного связывания идентичности.
- `public_key_hex does not control authority` означает данные регистрации, и утвержденная идентичность I105 не совпадает. Временный ключ транспортировки кошелька не может использоваться в этом поле.
- Отклонённая отдельная подпись обычно означает, что поле запроса или текущая оценка комиссии изменились между подготовкой и отправкой. Создайте новый запрос; никогда не переносите старую подпись.
- Точная повторная отправка уже принятого подписанного запроса является идемпотентной. Сначала запросите хэш криптографической транзакции, который был возвращен, прежде чем рассматривать тайм-аут как причину для начала заново.

## Исходные и связанные документы {#source-and-related-docs}

- [Реализация Browser Connect на закрепленной редакции исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Browser Connect тестирует на закрепленной ревизии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust пример фрейма приложения на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust пример рамки кошелька на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Закрепленная схема Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus услуги](/ru/blockchain/sora-nexus-services.md)
- [Взаимозаменяемые активы](./fungible-assets.md)
- [Отправлять и проверять транзакции](./submit-and-verify-transactions.md)
