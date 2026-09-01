---
translation_locale: zh-hant
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 錢包連線:批准資產轉移 {#wallet-connect-approve-an-asset-transfer}

## 結果 {#outcome}

在瀏覽器中建立 Iroha 連線會話,獲取一個 I105 錢包身份的加密批准,要求該錢包簽署 Torii 的準確資產轉讓架,提交單獨的簽名,然後等待應用最終.

## 預先條件 {#prerequisites}

- 使用 `@iroha/iroha-js`和 HTTPS 的瀏覽器應用程式.
- 一個實現 Iroha 連線v1的錢包,並控制一個單鍵Ed25519 I105 帳戶.
- 目前的 Taira 鏈 ID 和鏈分辨器,錢包註冊的小字母Ed25519公鑰六字元號,擁有可轉移資產,以及規範的 I105 目的地
- 費用資產 ID 由當前的 Taira faucet響應返回.該例子驗證了現場費用報價與 ID;它從來沒有嵌入複製的資產識別符號.
- 在選擇的 Torii 上必須啟用連線. 在顯示一個 QR 或深度連結之前,請檢查:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

如果 Taira 報告連線被禁用或返回`404`/`503`,則使用已啟動連線的生成本地網路.普通資產轉移還需要錢包擁有足夠的可轉移量和費用餘額.

## 步驟 {#steps}

### 1. 提供一個錢包啟動控制項 {#_1-provide-one-wallet-launch-control}

下面的 JavaScript 在申請頁面中預計這一元素:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

在其他裝置上的錢包中,輸出 URI 與 QR 程式碼相同的程式碼. URI 持有了錢包測量式繼電符號,因此不要將其放入分析,日誌,推器或崩盤報告中.

### 2. 建立,批准,簽署和提交 {#_2-create-approve-sign-and-submit}

這個瀏覽器模組從您的應用程式狀態中接受具體值.第一個 `POST /v1/assets/transfer` 省略了簽字欄位,返回了一個報價,版本的交易結構.第二個只新增錢包的公鑰和單獨的簽名到相同的轉移請求.

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

儲存庫的 `connect_app` 和 `connect_wallet`示例是協定測試資源:它們使用確定性運輸金鑰,在輸出中暴露代幣,而錢包測試資源返回了一個假簽名.僅用於研究框架,永遠不會作為 Taira 錢包實現.

## 驗證 {#verify}

儲存返回的雜湊,透過公共持有端點確認目的地的後狀態:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

驗證只有當 JavaScript 等待輔助程式對提交的交易雜湊觀察到 `Applied`,而目的地持有者反映了轉移時才會取得成功.僅接受或批准 HTTP 錢包並不是賬本的最終性.

## 解決問題 {#troubleshooting}

- `404`, `503`,或`enabled: false`從連線狀態意味著在該節點上不能建立中繼會話. 切換到啟用的本地網路;不要自行運輸應用程式或管理代幣.
- `USER_DENIED`是一個錢包的決定. 儲存它作為終端使用者結果,而不是開啟反覆批准提示.
- 批准帳戶不一致或無效的批准簽名必須結束會議. 在身份繫結失敗後,永遠不要要求錢包簽名.
- `public_key_hex does not control authority`指註冊資料和批准的 I105 身份異議.在此領域不能使用短暫的錢包運輸金鑰.
- 一個簽名或結構拒絕通常意味著在準備和提交之間改變的請求欄位或現場費用報價. 構建一個新的請求;永遠不要移植舊的簽名.
- 對已接受簽署要求的精確重放具有冪等性。在將逾時視為重新開始的理由之前，請查詢其傳回的交易雜湊。

## 來源及相關檔案 {#source-and-related-docs}

- [瀏覽器連線的實現在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [瀏覽器連線測試在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust 應用程式框架的示例在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust 錢包框架的示例在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [固定 Torii OpenAPI 方案](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus 服務](/zh-hant/blockchain/sora-nexus-services.md)
- [性資產](./fungible-assets.md)
- [提交和核實交易](./submit-and-verify-transactions.md)
