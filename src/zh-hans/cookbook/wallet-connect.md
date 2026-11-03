---
translation_locale: zh-hans
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 钱包连接:批准资产转移 {#wallet-connect-approve-an-asset-transfer}

## 结果 {#outcome}

在浏览器中创建 Iroha Connect 会话，获取一个 I105 钱包身份的密码学批准，请该钱包签名 Torii 提供的确切未签名资产转移有效载荷，提交分离式签名，然后等待 Applied 最终性。

## 预先条件 {#prerequisites}

- 使用 `@iroha/iroha-js`和 HTTPS 的浏览器应用程序.
- 一个实现 Iroha Connect v1、控制单密钥 Ed25519 I105 账户，并授予 `sign_transaction` 和 `sign_raw` 方法的钱包。
- 当前的 Taira 网络 ID、钱包已登记的小写 Ed25519 公钥十六进制值、一项自有的可转移资产，以及规范的 I105 目的地。
- 当前 Taira 水龙头政策公布的费用资产 ID。示例会依据该 ID 验证实时费用报价；它从不嵌入复制来的资产标识符。
- 所选的 Torii 必须启用 Connect。在显示 QR 码或深度链接之前，请从公开的账户能力信息中读取网络 ID：

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii 不公开匿名的 Connect 状态：`GET /v1/connect/status` 只会向持有某个会话管理令牌的一方报告该会话，而汇总状态需要运营者签名。当节点禁用 Connect 时，`registerConnectSession` 会以 HTTP `503` 和代码 `connect_disabled` 失败（若构建版本未包含 Connect 则为 `404`），示例也不会显示 QR 码或深度链接；请使用已启用 Connect 的生成式本地网络。普通的资产转移还需要钱包拥有足够的可转移数量和费用余额。

## 步骤 {#steps}

### 1. 提供一个钱包启动控件 {#_1-provide-one-wallet-launch-control}

下面的 JavaScript 在申请页面中预计这一元素:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

在其他设备上的钱包中,输出 URI 与 QR 代码相同的代码. URI 持有了钱包测量式继电符号,因此不要将其放入分析,日志,推器或崩盘报告中.

### 2. 创建,批准,签署和提交 {#_2-create-approve-sign-and-submit}

这个浏览器模块从您的应用程序状态中接受具体值。第一个 `POST /v1/assets/transfer` 省略签名字段，并返回已报价的费用意图和未签名的交易有效载荷。第二个只在相同的转移请求中加入钱包的公钥和分离式签名。Torii 要求两个请求都带有规范的账户签名，因此该模块会让钱包通过 `createConnectCanonicalRequestAuth` 签名它们。

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

存储库中的 `connect_app` 和 `connect_wallet` 示例是协议演示：应用程序会将包含令牌的钱包 URI 打印到标准输出，而钱包则以命令行参数接收其令牌，并在不解码也不显示的情况下签名所请求的字节。仅将它们用于研究帧，切勿作为 Taira 钱包实现。

## 验证 {#verify}

保存返回的哈希,通过公共持有端点确认目的地的后状态:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

验证只有当 JavaScript 等待辅助程序对提交的交易哈希观察到 `Applied`,而目的地持有者反映了转移时才会取得成功.仅接受或批准 HTTP 钱包并不是账本的最终性.

## 解决问题 {#troubleshooting}

- `registerConnectSession` 返回带有代码 `connect_disabled` 的 `503` 或 `404`，表示无法在该节点上创建中继会话。请切换到已启用的本地网络；不要退而自行传输应用程序令牌或管理令牌。
- `USER_DENIED`是一个钱包的决定. 保存它作为终端用户结果,而不是打开反复批准提示.
- 批准账户不一致或无效的批准签名必须结束会议. 在身份绑定失败后,永远不要要求钱包签名.
- `public_key_hex does not control authority`指注册数据和批准的 I105 身份异议.在此领域不能使用短暂的钱包运输密钥.
- 分离式签名被拒绝，通常表示请求字段或实时费用报价在准备与提交之间发生了变化。请创建新的请求；切勿移植旧的签名。
- 对已接受签名请求的精确重放具有幂等性。在把超时当作重新开始的理由之前，请查询其返回的交易哈希。

## 来源及相关文件 {#source-and-related-docs}

- [浏览器连接的实现在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [浏览器连接测试在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust 应用程序框架的示例在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust 钱包框架的示例在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [固定 Torii OpenAPI 方案](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus 服务](/zh-hans/blockchain/sora-nexus-services.md)
- [性资产](./fungible-assets.md)
- [提交和核实交易](./submit-and-verify-transactions.md)
