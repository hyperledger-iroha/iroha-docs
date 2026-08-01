---
translation_locale: ja
translation_source: /cookbook/wallet-connect.md
translation_source_hash: ab5b6c560ed8b0a208666e5854306ba6adce7af1210fc3c94b9c560d8e6eb686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 財布接続:資産移転を承認する {#wallet-connect-approve-an-asset-transfer}

## 成果 {#outcome}

Iroha 接続セッションをブラウザで作成し, I105 財布のアイデンティティに対する暗号化承認を取得し,その財布に Torii の正確な資産転送エスカファルドに署名するよう要求し,分離した署名を送信し,適用最終期間の待ち.

## 必須条件 {#prerequisites}

- `@iroha/iroha-js`と HTTPS を使用するブラウザアプリケーション.
- Iroha Connect v1 を実装し,単鍵 Ed25519 I105 アカウントを制御する財布.
- 現在の Taira チェーン ID と鎖識別子,財布の登録された小文字 Ed25519 公钥ヘックス,所有する譲渡可能資産,および正規目的地 I105.
- 現行の Taira faucet 応答で返済された料金資産 ID.この例は,その ID に対してライブ料金の配当を検証する;コピーされた資産識別子を組み込むことは決してありません.
- 接続は選択された Torii で有効化する必要があります. QR または深いリンクを表示する前に確認してください:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Taira が Connect を無効化または `404`/`503` を返信する場合は,Connect が有効化された生成されたローカルネットワークを使用します.通常の資産転送では,財布に十分な移転可能な量と手数料余分を持つ必要があります.

## ステップ {#steps}

### 1. ウォレット発射制御を1つ提供する {#_1-provide-one-wallet-launch-control}

JavaScript は,この要素を申請ページに期待する.

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

同じように URI のように QR 他のデバイスにある財布のコードです URI 財布に記録されたリレートークンを保持しているので,分析,ログ,レファレンス,またはクラッシュレポートに載せません.

### 2. 作成,承認,署名,提出 {#_2-create-approve-sign-and-submit}

このブラウザモジュールは,アプリケーションの状態から具体的な値を受け入れます.最初の `POST /v1/assets/transfer` は署名フィールドを省略し,引用されたバージョンのトランザクションエスカファルドを返します.第2は,同じ転送要求に財布の公開鍵と分離したサインのみを追加します.

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

保持する `token_app`, `token_management`, そして `token_relay` アプリケーションのメモリで. ウォレット起動のみ URI 接続承認はアカウントのアイデンティティによって署名されます. X25519 `walletPublicKey` 承認には一時的な運輸鍵が含まれています アカウントのエド25519サインキーではありません

### 3. 財布実装で Rust フレームタイプを使用する {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust プロトコル表面は,ウォレットが要求されたトランザクションを解読し,その正確な意図,適用されたポリシーを表示し,承認されたアカウントキーで署名した後のみ署名をシールすることができます.このヘルパーはその認証された署名を受け入れます;それは1つを作らない:

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

リポジトリの `connect_app` と `connect_wallet` の例は,プロトコル固定装置である.それらは決定的な輸送キーを使用し,輸出でトークンを暴露し,財布固定装置が偽署名を返します.それらをフレームのみを研究するために使用し,決して Taira 財布実装として使わない.

## 確認する {#verify}

返されたハッシュを保持し,公開保有者エンドポイントを通じて目的地のポストステートを確認する:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

検証は, JavaScript ウェイターが提出されたトランザクションハッシュについて `Applied` を観察し,目的地保有が転送を反映した場合のみに成功します. HTTP の受け入れまたは財布承認だけでは本簿最終的なものではない.

## 問題を解く {#troubleshooting}

- `404`, `503`,または`enabled: false`は,接続状態からそのノードでリレーセッションが作成できないことを意味します.有効なローカルネットに切り替える;アプリや管理トークンを自分で運ぶことに戻らないでください.
- `USER_DENIED` は財布の決定です. 繰り返し承認提示を開く代わりに,端末ユーザの結果として保存します.
- 承認アカウントの不一致または無効な承認署名がセッションを終了しなければならない.アイデンティティ結合が失敗した後,財布にサインするよう決して要求しないでください.
- `public_key_hex does not control authority` は登録データと承認された I105 アイデンティティの異議を意味します.このフィールドでは,一時的な財布輸送キーは使用できません.
- 署名またはエスカファルドの拒否は通常,準備と提出の間に変更されたリクエストフィールドやライブ料金表を表します.新しいリクエストを作成してください.古いサインを移植しないでください.
- すでに承認された署名リクエストの正確な再生は無効です. タイムアウトを再開理由として扱う前に返済したトランザクションハッシュを查ります.

## ソースおよび関連文書 {#source-and-related-docs}

- [ブラウザ接続の実装は,ピンされたコミット](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/src/connect.browser.js) で
- [ブラウザコネクトテストは,ピンされた commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/test/connect.browser.test.js) で
- [Rust アプリフレームの例 ピンされた commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust 固定された commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_wallet.rs)の財布フレーム例
- [ピン Torii OpenAPI スキーマ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/artifacts/openapi/torii.json)
- [SORA Nexus サービス](/ja/blockchain/sora-nexus-services.md)
- [浮動資産](./fungible-assets.md)
- [取引を提出し確認する](./submit-and-verify-transactions.md)
