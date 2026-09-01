---
translation_locale: zh-hans
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 钱包连接:批准资产转移 {#wallet-connect-approve-an-asset-transfer}

## 结果 {#outcome}

在浏览器中创建 Iroha 连接会话,获取一个 I105 钱包身份的加密批准,要求该钱包签署 Torii 的准确资产转让架,提交单独的签名,然后等待应用最终.

## 预先条件 {#prerequisites}

- 使用 `@iroha/iroha-js`和 HTTPS 的浏览器应用程序.
- 一个实现 Iroha 连接v1的钱包,并控制一个单键Ed25519 I105 帐户.
- 目前的 Taira 链 ID 和链分辨器,钱包注册的小字母Ed25519公钥六字符号,拥有可转移资产,以及规范的 I105 目的地
- 费用资产 ID 由当前的 Taira faucet响应返回.该例子验证了现场费用报价与 ID;它从来没有嵌入复制的资产标识符.
- 在选择的 Torii 上必须启用连接. 在显示一个 QR 或深度链接之前,请检查:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

如果 Taira 报告连接被禁用或返回`404`/`503`,则使用已启动连接的生成本地网络.普通资产转移还需要钱包拥有足够的可转移量和费用余额.

## 步骤 {#steps}

### 1. 提供一个钱包启动控件 {#_1-provide-one-wallet-launch-control}

下面的 JavaScript 在申请页面中预计这一元素:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

在其他设备上的钱包中,输出 URI 与 QR 代码相同的代码. URI 持有了钱包测量式继电符号,因此不要将其放入分析,日志,推器或崩盘报告中.

### 2. 创建,批准,签署和提交 {#_2-create-approve-sign-and-submit}

这个浏览器模块从您的应用程序状态中接受具体值.第一个 `POST /v1/assets/transfer` 省略了签字字段,返回了一个报价,版本的交易结构.第二个只添加钱包的公钥和单独的签名到相同的转移请求.

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

保持 `token_app`, `token_management`, 和 `token_relay` 在应用程序内存中,只有钱包启动 URI 连接认可由帐户身份签署; X25519 `walletPublicKey` 在批准中,有一个暂时的运输密钥,而不是账户的Ed25519签字密钥.

### 3. 在钱包实现中使用 Rust 框架类型 {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust 协议表面只能在钱包解码请求交易,显示其确切的意图,应用政策,并使用批准账户密钥签署后封闭签名.该辅助器接受验证的签名;它不会制造一个:

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

存储库的 `connect_app` 和 `connect_wallet`示例是协议测试资源:它们使用确定性运输密钥,在输出中暴露代币,而钱包测试资源返回了一个假签名.仅用于研究框架,永远不会作为 Taira 钱包实现.

## 验证 {#verify}

保存返回的哈希,通过公共持有端点确认目的地的后状态:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

验证只有当 JavaScript 等待辅助程序对提交的交易哈希观察到 `Applied`,而目的地持有者反映了转移时才会取得成功.仅接受或批准 HTTP 钱包并不是账本的最终性.

## 解决问题 {#troubleshooting}

- `404`, `503`,或`enabled: false`从连接状态意味着在该节点上不能创建中继会话. 切换到启用的本地网络;不要自行运输应用程序或管理代币.
- `USER_DENIED`是一个钱包的决定. 保存它作为终端用户结果,而不是打开反复批准提示.
- 批准账户不一致或无效的批准签名必须结束会议. 在身份绑定失败后,永远不要要求钱包签名.
- `public_key_hex does not control authority`指注册数据和批准的 I105 身份异议.在此领域不能使用短暂的钱包运输密钥.
- 一个签名或结构拒绝通常意味着在准备和提交之间改变的请求字段或现场费用报价. 构建一个新的请求;永远不要移植旧的签名.
- 对已接受签名请求的精确重放具有幂等性。在把超时当作重新开始的理由之前，请查询其返回的交易哈希。

## 来源及相关文件 {#source-and-related-docs}

- [浏览器连接的实现在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [浏览器连接测试在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust 应用程序框架的示例在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust 钱包框架的示例在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [固定 Torii OpenAPI 方案](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus 服务](/zh-hans/blockchain/sora-nexus-services.md)
- [性资产](./fungible-assets.md)
- [提交和核实交易](./submit-and-verify-transactions.md)
