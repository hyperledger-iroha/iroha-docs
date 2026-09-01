---
translation_locale: ja
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ウォレット接続：資産の転送を承認 {#wallet-connect-approve-an-asset-transfer}

## 結果 {#outcome}

ブラウザで Iroha Connect セッションを作成し、1 つの I105 ウォレットのIDについて暗号承認を取得し、そのウォレットに Torii の正確な資産転送生成スタータ構造に署名するよう依頼し、分離された署名を送信して、適用された確定を待ちます。

## 前提条件 {#prerequisites}

- `@iroha/iroha-js` と HTTPS を使用するブラウザアプリケーションです。
- 単一鍵のEd25519 I105 アカウントを制御し、Iroha Connect v1 を実装するウォレット。
- 現在の Taira チェーンIDとチェーン識別子、ウォレットに登録された小文字のEd25519公開鍵の16進数、所有する譲渡可能な資産、および標準の I105 宛先。
- 現在の Taira テストネット資金提供サービスのレスポンスによって返される手数料資産ID。例では、そのIDに基づく実際の手数料価格の見積もりを検証します；コピーされた資産IDを埋め込むことは決してありません。
- 選択された Torii で接続を有効にする必要があります。QR またはディープリンクを表示する前に確認してください:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

もし Taira が Connect 無効を報告するか、`404`/`503` を返す場合は、Connect 有効の生成されたローカルネットワークを使用してください。通常の資産転送でも、ウォレットが十分な転送可能数量と手数料残高を所有している必要があります。

## ステップ {#steps}

### 1. 1つのウォレット起動コントロールを提供する {#_1-provide-one-wallet-launch-control}

以下の JavaScript は、アプリケーションページでこの要素を期待しています:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

別のデバイスでウォレット用の QR コードとして同じ URI をレンダリングします。URI はウォレット専用のリレートークンを保持しているため、分析、ログ、リファラー、クラッシュレポートには含めないでください。

### 2. 作成、承認、署名、提出 {#_2-create-approve-sign-and-submit}

このブラウザモジュールは、アプリケーションの状態から具体的な値を受け取ります。最初の`POST /v1/assets/transfer`は署名フィールドを省略し、手数料の見積もり付きのバージョン付きトランザクションスタータ構造を返します。2つ目は、同じ転送リクエストにウォレットの公開鍵と分離署名のみを追加します。

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

リポジトリの `connect_app` と `connect_wallet` の例はプロトコルテストのアーティファクトです：これらは決定論的なトランスポートキーを使用し、出力にトークンを表示し、ウォレットのテストアーティファクトはダミー署名を返します。これらはフレームを学習するためだけに使用し、決して Taira のウォレット実装として使用しないでください。

## 確認する {#verify}

返された暗号ハッシュを保持し、公開保有者 API エンドポイントを通じて宛先のポストステートを確認してください:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

検証は、JavaScript のウェイターが提出されたトランザクションの暗号ハッシュに対して`Applied`を観察し、送金先の保有が転送を反映した場合にのみ成功します。HTTP の承認やウォレットの承認だけでは、ブロックチェーン台帳の最終性にはなりません。

## トラブルシューティング {#troubleshooting}

- Connectステータスの`404`、`503`、または`enabled: false`は、そのノードでリレーセッションを作成できないことを意味します。有効なローカルネットに切り替えてください；アプリや管理トークンを自分でフォールバックして運ぶことはしないでください。
- `USER_DENIED` はウォレットの決定です。繰り返し承認を求めるプロンプトを開くのではなく、端末ユーザーの結果として保存してください。
- 承認アカウントの不一致や無効な承認署名がある場合、セッションは終了しなければなりません。IDのバインディングに失敗した後にウォレットに署名を求めてはいけません。
- `public_key_hex does not control authority` は登録データを意味し、承認された I105 身元と一致しません。このフィールドでは、一時的なウォレット輸送キーを使用できません。
- 署名または生成されたスターターストラクチャの拒否は、通常、準備と送信の間にリクエストフィールドやライブ手数料の見積もりが変更されたことを意味します。新しいリクエストを作成し、古い署名を移植してはいけません。
- すでに受理された署名付きリクエストの正確なリプレイは冪等です。タイムアウトを理由に最初からやり直す前に、その返されたトランザクションの暗号ハッシュを照会してください。

## ソースおよび関連文書 {#source-and-related-docs}

- [ピン留めされたソースコードのリビジョンでのブラウザ接続の実装](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [ブラウザ接続はピン留めされたソースコードのリビジョンでテストされます](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust ピン留めされたソースコードのリビジョンでのアプリアフレームの例](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust ピン留めされたソースコードのリビジョンでのウォレットフレームの例](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [固定された Torii OpenAPI スキーマ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus サービス](/ja/blockchain/sora-nexus-services.md)
- [代替可能な資産](./fungible-assets.md)
- [取引を提出して確認する](./submit-and-verify-transactions.md)
