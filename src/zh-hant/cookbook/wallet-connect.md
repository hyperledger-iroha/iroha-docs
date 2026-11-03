---
translation_locale: zh-hant
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 錢包連線:批准資產轉移 {#wallet-connect-approve-an-asset-transfer}

## 結果 {#outcome}

在瀏覽器中建立 Iroha Connect 會話，取得一個 I105 錢包身分的密碼學批准，請該錢包簽署 Torii 提供的確切未簽署資產轉移有效載荷，提交分離式簽名，然後等待 Applied 最終性。

## 預先條件 {#prerequisites}

- 使用 `@iroha/iroha-js`和 HTTPS 的瀏覽器應用程式.
- 一個實作 Iroha Connect v1、控制單金鑰 Ed25519 I105 帳戶，並授予 `sign_transaction` 和 `sign_raw` 方法的錢包。
- 目前的 Taira 網路 ID、錢包已登記的小寫 Ed25519 公鑰十六進位值、一項自有的可轉移資產，以及規範的 I105 目的地。
- 目前 Taira 水龍頭政策公布的費用資產 ID。範例會依據該 ID 驗證即時費用報價；它從不嵌入複製來的資產識別碼。
- 所選的 Torii 必須啟用 Connect。在顯示 QR 碼或深層連結之前，請從公開的帳戶功能資訊中讀取網路 ID：

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii 不公開匿名的 Connect 狀態：`GET /v1/connect/status` 只會向持有某個會話管理權杖的一方回報該會話，而彙總狀態需要營運者簽名。當節點停用 Connect 時，`registerConnectSession` 會以 HTTP `503` 和代碼 `connect_disabled` 失敗（若建置版本未包含 Connect 則為 `404`），範例也不會顯示 QR 碼或深層連結；請使用已啟用 Connect 的產生式本地網路。一般的資產轉移還需要錢包擁有足夠的可轉移數量和費用餘額。

## 步驟 {#steps}

### 1. 提供一個錢包啟動控制項 {#_1-provide-one-wallet-launch-control}

下面的 JavaScript 在申請頁面中預計這一元素:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

在其他裝置上的錢包中,輸出 URI 與 QR 程式碼相同的程式碼. URI 持有了錢包測量式繼電符號,因此不要將其放入分析,日誌,推器或崩盤報告中.

### 2. 建立,批准,簽署和提交 {#_2-create-approve-sign-and-submit}

這個瀏覽器模組從您的應用程式狀態中接受具體值。第一個 `POST /v1/assets/transfer` 省略簽署欄位，並返回已報價的費用意圖和未簽署的交易有效載荷。第二個只在相同的轉移請求中加入錢包的公鑰和分離式簽名。Torii 要求兩個請求都帶有規範的帳戶簽名，因此該模組會讓錢包透過 `createConnectCanonicalRequestAuth` 簽署它們。

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

保持 `token_app`, `token_management`, 和 `token_relay` 在應用程式記憶體中,只有錢包啟動 URI 連線認可由帳戶身份簽署; X25519 `walletPublicKey` 在批准中,有一個暫時的運輸金鑰,而不是帳戶的Ed25519簽字金鑰.

### 3. 在錢包實現中使用 Rust 框架型別 {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust 協議表面只能在錢包解碼請求交易,顯示其確切的意圖,應用政策,並使用批准帳戶金鑰簽署後封閉簽名.該輔助器接受驗證的簽名;它不會製造一個:

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

儲存庫中的 `connect_app` 和 `connect_wallet` 範例是協定示範：應用程式會將包含權杖的錢包 URI 列印到標準輸出，而錢包則以命令列參數接收其權杖，並在不解碼也不顯示的情況下簽署所請求的位元組。僅將它們用於研究訊框，切勿作為 Taira 錢包實作。

## 驗證 {#verify}

儲存返回的雜湊,透過公共持有端點確認目的地的後狀態:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

驗證只有當 JavaScript 等待輔助程式對提交的交易雜湊觀察到 `Applied`,而目的地持有者反映了轉移時才會取得成功.僅接受或批准 HTTP 錢包並不是賬本的最終性.

## 解決問題 {#troubleshooting}

- `registerConnectSession` 返回帶有代碼 `connect_disabled` 的 `503` 或 `404`，表示無法在該節點上建立中繼會話。請切換到已啟用的本地網路；不要退而自行傳送應用程式權杖或管理權杖。
- `USER_DENIED`是一個錢包的決定. 儲存它作為終端使用者結果,而不是開啟反覆批准提示.
- 批准帳戶不一致或無效的批准簽名必須結束會議. 在身份繫結失敗後,永遠不要要求錢包簽名.
- `public_key_hex does not control authority`指註冊資料和批准的 I105 身份異議.在此領域不能使用短暫的錢包運輸金鑰.
- 分離式簽名被拒絕，通常表示請求欄位或即時費用報價在準備與提交之間發生了變化。請建立新的請求；切勿移植舊的簽名。
- 對已接受簽署要求的精確重放具有冪等性。在將逾時視為重新開始的理由之前，請查詢其傳回的交易雜湊。

## 來源及相關檔案 {#source-and-related-docs}

- [瀏覽器連線的實現在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [瀏覽器連線測試在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust 應用程式框架的示例在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust 錢包框架的示例在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [固定 Torii OpenAPI 方案](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus 服務](/zh-hant/blockchain/sora-nexus-services.md)
- [性資產](./fungible-assets.md)
- [提交和核實交易](./submit-and-verify-transactions.md)
