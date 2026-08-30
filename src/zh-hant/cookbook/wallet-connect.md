---
translation_locale: zh-hant
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 錢包連接:批准資產轉移 {#wallet-connect-approve-an-asset-transfer}

## 結果 {#outcome}

在瀏覽器中創建 Iroha 連接會話,獲取一個 I105 錢包身份的加密批准,要求該錢包簽署 Torii 的準確資產轉讓架,提交單獨的簽名,然後等待應用最終.

## 預先條件 {#prerequisites}

- 使用 `@iroha/iroha-js`和 HTTPS 的瀏覽器應用程序.
- 一個實現 Iroha 連接v1的錢包,並控制一個單鍵Ed25519 I105 帳戶.
- 目前的 Taira 鏈 ID 和鏈分辨器,錢包註冊的小字母Ed25519公鑰六字符號,擁有可轉移資產,以及正規的 I105 目的地
- 費用資產 ID 由當前的 Taira faucet響應返回.該例子驗證了現場費用報價與 ID;它從來沒有嵌入複製的資產標識符.
- 在選擇的 Torii 上必須啓用連接. 在顯示一個 QR 或深度鏈接之前,請檢查:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

如果 Taira 報告連接被禁用或返回`404`/`503`,則使用已啓動連接的生成本地網絡.普通資產轉移還需要錢包擁有足夠的可轉移量和費用餘額.

## 步驟 {#steps}

### 1. 提供一個錢包發射控制 {#_1-provide-one-wallet-launch-control}

下面的 JavaScript 在申請頁面中預計這一元素:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

在其他設備上的錢包中,輸出 URI 與 QR 代碼相同的代碼. URI 持有了錢包測量式繼電符號,因此不要將其放入分析,日誌,推器或崩盤報告中.

### 2. 創建,批准,簽署和提交 {#_2-create-approve-sign-and-submit}

這個瀏覽器模塊從您的應用程序狀態中接受具體值.第一個 `POST /v1/assets/transfer` 省略了簽字字段,返回了一個引用,版本的交易架子.第二個只添加錢包的公鑰和單獨的簽名到相同的轉移請求.

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

保持 `token_app`, `token_management`, 和 `token_relay` 在應用程序內存中,只有錢包啓動 URI 連接認可由帳戶身份簽署; X25519 `walletPublicKey` 在批准中,有一個暫時的運輸密鑰,而不是賬戶的Ed25519簽字密鑰.

### 3. 在錢包實現中使用 Rust 框架類型 {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust 協議表面只能在錢包解碼請求交易,顯示其確切的意圖,應用政策,並使用批准賬戶密鑰簽署後封閉簽名.該輔助器接受驗證的簽名;它不會製造一個:

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

存儲庫的 `connect_app` 和 `connect_wallet`示例是協議固定器:它們使用確定性運輸密鑰,在輸出中暴露代幣,而錢包固定器返回了一個假簽名.僅用於研究框架,永遠不會作爲 Taira 錢包實現.

## 驗證 {#verify}

保存返回的哈希,通過公共持有端點確認目的地的後狀態:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

驗證只有當 JavaScript 服務員對提交的交易哈希觀察到 `Applied`,而目的地持有者反映了轉移時纔會取得成功.僅接受或批准 HTTP 錢包並不是賬本的最終性.

## 解決問題 {#troubleshooting}

- `404`, `503`,或`enabled: false`從連接狀態意味着在該節點上不能創建繼電話. 切換到啓用的本地網絡;不要自行運輸應用程序或管理代幣.
- `USER_DENIED`是一個錢包的決定. 保存它作爲終端用戶結果,而不是打開反覆批准提示.
- 批准賬戶不一致或無效的批准簽名必須結束會議. 在身份綁定失敗後,永遠不要要求錢包簽名.
- `public_key_hex does not control authority`指註冊數據和批准的 I105 身份異議.在此領域不能使用短暫的錢包運輸密鑰.
- 一個簽名或架子拒絕通常意味着在準備和提交之間改變的請求字段或現場費用報價. 構建一個新的請求;永遠不要移植舊的簽名.
- 已接受的簽署請求的複製是無效的.查詢返回的交易哈希,然後把時間作爲重新開始的理由.

## 來源及相關文件 {#source-and-related-docs}

- [瀏覽器連接的實現在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [瀏覽器連接測試在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust 應用程序框架的示例在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust 錢包框架的示例在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [固定 Torii OpenAPI 方案](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus 服務](/zh-hant/blockchain/sora-nexus-services.md)
- [性資產](./fungible-assets.md)
- [提交和核實交易](./submit-and-verify-transactions.md)
