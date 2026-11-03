---
translation_locale: ja
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ウォレット接続：資産の転送を承認 {#wallet-connect-approve-an-asset-transfer}

## 結果 {#outcome}

ブラウザで Iroha Connect セッションを作成し、1 つの I105 ウォレットのIDについて暗号承認を取得し、そのウォレットに Torii の正確な未署名の資産転送ペイロードに署名するよう依頼し、分離された署名を送信して、適用済み（Applied）の確定を待ちます。

## 前提条件 {#prerequisites}

- `@iroha/iroha-js` と HTTPS を使用するブラウザアプリケーションです。
- Iroha Connect v1 を実装し、単一鍵の Ed25519 I105 アカウントを制御し、`sign_transaction` と `sign_raw` メソッドを許可するウォレット。
- 現在の Taira ネットワークID、ウォレットに登録された小文字のEd25519公開鍵の16進数、所有する譲渡可能な資産、および標準の I105 宛先。
- 現在の Taira フォーセットポリシーで公開されている手数料資産ID。例では、そのIDに基づいて実際の手数料価格の見積もりを検証します；コピーされた資産IDを埋め込むことは決してありません。
- 選択された Torii で Connect が有効になっている必要があります。QR またはディープリンクを表示する前に、公開アカウントの機能情報からネットワークIDを読み取ってください:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii は匿名の Connect ステータスを公開しません。`GET /v1/connect/status` は 1 つのセッションの状態をその管理トークンに対してのみ報告し、集約ステータスにはオペレーターの署名が必要です。ノードが Connect を無効にしている場合、`registerConnectSession` は HTTP `503` とコード `connect_disabled` で失敗し（ビルドに Connect が含まれていない場合は `404`）、例では QR コードもディープリンクも表示されません。Connect が有効な生成されたローカルネットワークを使用してください。通常の資産転送でも、ウォレットが十分な転送可能数量と手数料残高を所有している必要があります。

## ステップ {#steps}

### 1. 1つのウォレット起動コントロールを提供する {#_1-provide-one-wallet-launch-control}

以下の JavaScript は、アプリケーションページでこの要素を期待しています:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

別のデバイスでウォレット用の QR コードとして同じ URI をレンダリングします。URI はウォレット専用のリレートークンを保持しているため、分析、ログ、リファラー、クラッシュレポートには含めないでください。

### 2. 作成、承認、署名、提出 {#_2-create-approve-sign-and-submit}

このブラウザモジュールは、アプリケーションの状態から具体的な値を受け取ります。最初の`POST /v1/assets/transfer`は署名フィールドを省略し、見積もり済みの手数料インテントと未署名のトランザクションペイロードを返します。2つ目は、同じ転送リクエストにウォレットの公開鍵と分離署名のみを追加します。Torii は両方のリクエストに正規のアカウント署名を要求するため、モジュールは `createConnectCanonicalRequestAuth` を通じてウォレットにそれらへ署名させます。

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

`token_app`、`token_management`、および `token_relay` をアプリケーションのメモリに保持してください。ウォレットの起動 URI/トークン のみがウォレットに渡ります。接続の承認はアカウントの識別によって署名されます；承認内の X25519 `walletPublicKey` は一時的な輸送キーであり、アカウントの Ed25519 署名キーではありません。

### 3. ウォレットの実装で Rust フレームタイプを使用する {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust プロトコル・サーフェスは、ウォレットが要求されたトランザクションをデコードし、その正確な意図を表示し、ポリシーを適用し、承認されたアカウントキーで署名した後にのみ署名を封印できます。このヘルパーは、その検証済み署名を受け入れます；作成することはありません：

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

リポジトリの `connect_app` と `connect_wallet` の例はプロトコルのデモンストレーションです：アプリはトークンを含むウォレット URI を標準出力に出力し、ウォレットはトークンをコマンドライン引数として受け取り、要求されたバイト列をデコードも表示もせずに署名します。これらはフレームを学習するためだけに使用し、決して Taira のウォレット実装として使用しないでください。

## 確認する {#verify}

返された暗号ハッシュを保持し、公開保有者 API エンドポイントを通じて宛先のポストステートを確認してください:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

検証は、JavaScript のウェイターが提出されたトランザクションの暗号ハッシュに対して`Applied`を観察し、送金先の保有が転送を反映した場合にのみ成功します。HTTP の承認やウォレットの承認だけでは、ブロックチェーン台帳の最終性にはなりません。

## トラブルシューティング {#troubleshooting}

- `registerConnectSession` からのコード `connect_disabled` を伴う `503`、または `404` は、そのノードでリレーセッションを作成できないことを意味します。有効なローカルネットに切り替えてください；アプリや管理トークンを自分で運ぶ方法にフォールバックしないでください。
- `USER_DENIED` はウォレットの決定です。繰り返し承認を求めるプロンプトを開くのではなく、端末ユーザーの結果として保存してください。
- 承認アカウントの不一致や無効な承認署名がある場合、セッションは終了しなければなりません。IDのバインディングに失敗した後にウォレットに署名を求めてはいけません。
- `public_key_hex does not control authority` は登録データを意味し、承認された I105 身元と一致しません。このフィールドでは、一時的なウォレット輸送キーを使用できません。
- 分離署名が拒否された場合、通常、準備と送信の間にリクエストフィールドやライブ手数料の見積もりが変更されたことを意味します。新しいリクエストを作成し、古い署名を移植してはいけません。
- すでに受理された署名付きリクエストの正確なリプレイは冪等です。タイムアウトを理由に最初からやり直す前に、その返されたトランザクションの暗号ハッシュを照会してください。

## ソースおよび関連文書 {#source-and-related-docs}

- [ピン留めされたソースコードのリビジョンでのブラウザ接続の実装](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [ブラウザ接続はピン留めされたソースコードのリビジョンでテストされます](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust ピン留めされたソースコードのリビジョンでのアプリアフレームの例](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust ピン留めされたソースコードのリビジョンでのウォレットフレームの例](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [固定された Torii OpenAPI スキーマ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus サービス](/ja/blockchain/sora-nexus-services.md)
- [代替可能な資産](./fungible-assets.md)
- [取引を提出して確認する](./submit-and-verify-transactions.md)
