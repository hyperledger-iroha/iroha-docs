---
translation_locale: ru
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: утверждение передачи активов {#wallet-connect-approve-an-asset-transfer}

## Результат {#outcome}

Создайте сессию Iroha Connect в браузере, получите криптографическое одобрение для одной идентификации кошелька I105, попросите этот кошелек подписать точную платформу передачи активов Torii, представьте отдельную подпись и подождите завершение действия.

## Предварительные условия {#prerequisites}

- Приложение для браузера с использованием `@iroha/iroha-js` и HTTPS.
- Кошелек, который реализует Iroha Connect v1 и контролирует учетную запись Ed25519 I105 с одним ключом.
- Текущая цепочка Taira ID и дискриминатор цепочки, зарегистрированная в кошельке мелкая буква Ed25519 с открытым ключом, принадлежащий передаваемый актив и канонический пункт назначения I105.
- Актив сбора ID, возвращенный текущим ответом на трубку Taira. Пример проверяет цитату сбора в режиме реального действия по сравнению с этим ID; он никогда не включает копированный идентификатор активов.
- Подключение должно быть включено на выбранном Torii. Перед показанием QR или глубокой ссылки проверьте:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Если Taira сообщает об отключении соединения или возвращает `404`/`503`, используйте генерируемую локальную сеть с включением соединения. Обычный перевод активов также требует, чтобы кошелек обладал достаточным количеством передаваемых средств и балансом сборов.

## Шаги {#steps}

### 1. Обеспечьте единый контроль за запуском кошелька {#_1-provide-one-wallet-launch-control}

В JavaScript ниже ожидается этот элемент на странице заявки:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Сделайте то же самое . URI в качестве QR Код для кошелька на другом устройстве. URI содержит релейный токен с помощью кошелька, поэтому не помещайте его в аналитику, журналы, справочники или отчеты о взрывах.

### 2. Создание, утверждение, подписание и представление {#_2-create-approve-sign-and-submit}

Этот модуль браузера принимает конкретные значения из вашего состояния приложения. Первый `POST /v1/assets/transfer` исключает поля подписания и возвращает цитированный, версионный транзакционный скелет. Второй добавляет только публичный ключ кошелька и отдельную подпись к тому же запросу на передачу.

```js
import { AccountAddress } from '@iroha/iroha-js/address'
import {
  createConnectAppSession,
  createConnectSessionPreview,
  deleteConnectSession,
  registerConnectSession,
} from '@iroha/iroha-js/connect-browser'

const baseUrl = 'https://taira.sora.org'
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const decodeBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
const encodeBase64 = (bytes) =>
  btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))

async function postJson(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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
  chainId,
  chainDiscriminant,
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
  const derivedAuthority = AccountAddress.fromAccount({
    publicKey: publicKeyHex,
    algorithm: 'ed25519',
  }).toI105(chainDiscriminant)
  if (derivedAuthority !== authority) {
    throw new Error('enrolled public key does not control authority')
  }

  const preview = createConnectSessionPreview({
    chainId,
    node: baseUrl,
  })
  const relay = await registerConnectSession(
    baseUrl,
    preview.sidBase64Url,
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
      permissions: {
        methods: ['sign_transaction'],
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

    const transfer = {
      authority,
      asset_definition_id: assetDefinitionId,
      asset_balance_scope: 'global',
      amount,
      destination,
      fee_payment: {
        payer: 'authority',
        value: { charge_limits: [] },
      },
      creation_time_ms: Date.now(),
      transaction_ttl_ms: 120_000,
      memo: 'iroha-cookbook-wallet-connect',
    }

    const prepared = await postJson('/v1/assets/transfer', transfer)
    if (!prepared.ok || prepared.submitted) {
      throw new Error('Torii did not return a pending-signature scaffold')
    }
    const limits = prepared.intent.fee_payment.value.charge_limits
    if (
      limits.some(
        (limit) =>
          limit.asset_definition_id !== faucetFeeAssetDefinitionId,
      )
    ) {
      throw new Error(
        'live fee quote uses an asset other than the faucet response',
      )
    }

    const signature = await connect.signTransaction(
      decodeBase64(prepared.transaction_scaffold_base64),
    )
    if (signature.length !== 64) {
      throw new Error('wallet returned a non-Ed25519 signature length')
    }

    const submitted = await postJson('/v1/assets/transfer', {
      ...transfer,
      public_key_hex: publicKeyHex,
      signature_base64: encodeBase64(signature),
    })
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

Держи . `token_app`, `token_management`, и `token_relay` В памяти приложения. Только запуск кошелька URI Подтверждение Connect подписывается идентификатором счета; X25519 `walletPublicKey` в одобрении находится эфемерный транспортный ключ, а не подпись счета Ed25519

### 3. Использовать типы кадров Rust в реализации кошелька {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Поверхность протокола Rust может запечатать подпись только после того, как кошелек расшифровал запрашиваемую транзакцию, отобразил ее точное намерение, применил политику и подписался с утвержденным ключом к учетной записи. Этот помощник принимает эту проверенную подпись; он не производит:

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

Примеры хранилища `connect_app` и `connect_wallet` являются протокольными фиксаторами: они используют детерминистические транспортные ключи, выделяют токены в выходе, а фиксатор кошелька возвращает поддельную подпись. Используйте их только для изучения кадров, никогда не в качестве реализации кошелька Taira.

## Проверка {#verify}

Сохранить возвращенный хэш и подтвердить пост-статус назначения через конечный пункт публичных владельцев:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Проверка может быть осуществлена только тогда, когда: JavaScript Официант замечает `Applied` для представленной сделки хэш и местонахождение отражает передачу. HTTP только принятие или одобрение кошелька не является окончательным результатом бухгалтерского учета.

## Устранение неполадок {#troubleshooting}

- `404`, `503`, или `enabled: false` из статуса Connect означает, что на этом узле не может быть создана эстафета. Перейти на включенную локальную сеть; не возвращайтесь к транспортировке приложений или токенов управления самостоятельно.
- `USER_DENIED` - это решение кошелька. Сохранить его в качестве результата терминального пользователя, вместо того чтобы открывать повторяющиеся запросы на одобрение.
- Несовместимость с аккаунтом одобрения или недействительная подпись одобрения должны закрыть сессию. Никогда не просите кошелек подписаться после того, как связывание личности не удалось.
- `public_key_hex does not control authority` означает данные о регистрации и утвержденный I105 несогласие об идентификации. Нельзя использовать эфемерный ключ для транспортировки кошелька в этой области.
- Отказ от подписи или эскафолда обычно означает изменение поля заявки или цитаты на живую плату между подготовкой и подачей. Создать новый запрос; никогда не пересаживайте старый подпись.
- Точное воспроизведение уже принятого подписанного запроса является недействительным. Запроси его возвращенный хэш транзакции, прежде чем рассматривать перерыв времени как причину для начала.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Использование Browser Connect на закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Тесты Browser Connect на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Пример рамки приложения Rust на финированном комитете](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust пример рамки кошелька на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Застегнутые Torii OpenAPI схема](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [Услуги SORA Nexus](/ru/blockchain/sora-nexus-services.md)
- [Функциональные активы](./fungible-assets.md)
- [Предоставление и проверка транзакций](./submit-and-verify-transactions.md)
