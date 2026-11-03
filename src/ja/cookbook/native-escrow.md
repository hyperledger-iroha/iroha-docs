---
translation_locale: ja
translation_source: /cookbook/native-escrow.md
translation_source_hash: d399284a2baec507e4c979c762d6e216d8c3fbc5b4b4fe221b6bbb0049ee9fd9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ネイティブ資産エスクロー {#native-asset-escrow}

## 結果 {#outcome}

マーケットプレイスのエスクローと目的地向け資産ロックの間で選択し、現在の型付きライフサイクルを Rust または Python で実行し、すべてのロック再試行を実際に観測した残額に紐づけ、JavaScript からネイティブ Kotodama エスクロースーフェスをコンパイルします。

## 前提条件 {#prerequisites}

- 数値資産の定義と、十分な量を所有しているオープナー/セラー。
- ステップを提出するすべてのパーティのために、資金提供されたシングルキー I105 クライアントを使用してください。手数料資産が現在の Taira フォーセットポリシーで公開されているものと一致する、認可主体払いのライブ `fee_payment` インテントを使用してください。ドキュメントから資産IDを埋め込まないでください。
- 現在の Rust または Python SDK は、Iroha プロトコルの最終化`c8c872461e92f04325c350cdd952f4276e96f9dc`です。
- のために JavaScript コンパイラの例、 Node.js ローカル開発環境に組み込まれた24プラス `@iroha/iroha-js` パッケージとそのネイティブ `iroha_js_host`; 従う [JavaScript SDK ソースビルドの設定](/ja/guide/tutorials/javascript.md#build-from-source). ブラウザビルドは提供する必要があります `compilerUrl` ネイティブホストを読み込む代わりに。
- Taira は資産移転およびエスクローの指示を承認しなければなりません。資産所有者は、資産ポリシーが許可する場合、通常のライフサイクルを使用することができます；解決策は紛争にはグローバル`CanResolveEscrowDispute`の権限が必要です。必要なパブリックブロックチェーンネットワークの認可主体がない場合は、生成されたローカルネットワークを使用してください。

マーケットプレイスのエスクローは、売り手、買い手、オフチェーン支払い、およびリリースをモデル化します。一般的なロックは、宛先を指定し、必要に応じて異なるリリース認可主体を指定します。これにより、一部引き出し、キャンセル、期限切れがサポートされます。

## ステップ {#steps}

### 1. Rust とマーケットプレイスのエスクローを完了する {#_1-complete-a-marketplace-escrow-with-rust}

この関数は、実際にタイプされたIDとクライアントを受け取ります。40ユニットを開き、購入者が受け入れてオフチェーンの支払いをマークできるようにし、その後、売り手が保管を解放できるようにします。各送信は、`FeePaymentIntent`を通じて認可された主要な手数料支払者の名前を指定します。

```rust
use eyre::{Result, ensure};
use iroha::{
    blocking::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
        transaction::FeePaymentIntent,
    },
};
use iroha_crypto::Hash;

fn complete_marketplace_escrow(
    seller: &Client,
    buyer: &Client,
    escrow_id: EscrowId,
    asset_definition: AssetDefinitionId,
) -> Result<AssetEscrowRecord> {
    let fee = FeePaymentIntent::authority(Vec::new(), None);

    seller.submit(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller
        .client()
        .query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

カストディ口座はブロックチェーン台帳によって管理されています。通常の資産移転トークンを付与しても、エスクローのライフサイクル外でアクティブなカストディを引き出せるようにはなりません。

### 2. Python で一般的なロックを開けて部分的に描く {#_2-open-and-partially-draw-a-generic-lock-with-python}

引き出す前に、リリース承認の担当者は署名済みのネイティブ記録を照会します。その正確な`remaining_amount`を渡すことで楽観的同時実行が提供され、古い並列リクエストは却下され、保管を二重に引き落とすことが防止されます。`client` は、`local_signing_context=LocalSigningContext(network_id)` とネットワークの `chain_discriminant` を指定して作成した `ToriiClient` です。トランザクションヘルパーはそのコンテキストからネットワーク識別情報を取得し、署名付きクエリはそれを `network_id` として受け取ります。

```python
import secrets
import time
from decimal import Decimal


def escrow_status(record):
    status = record["status"]
    if isinstance(status, dict):
        return status.get("status", status.get("kind"))
    return str(status)


def open_and_draw_lock(
    *,
    client,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"
    network_id = client.local_signing_context.network_id

    client.open_asset_lock_and_wait(
        authority=opener,
        private_key=opener_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        asset_definition_id=asset_definition_id,
        destination=destination,
        amount="10",
        release_authority=release_authority,
        expires_at_ms=int(time.time() * 1000) + 3_600_000,
        wait=True,
    )

    before = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        network_id=network_id,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        authority=release_authority,
        private_key=release_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        amount="4",
        expected_remaining_amount=before["remaining_amount"],
        wait=True,
    )
    after = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        network_id=network_id,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

Python SDK は `expected_remaining_amount` が省略されたときに自動的にクエリを実行できますが、観測された値を渡すと、サイン付きの経済的前提条件がアプリケーションコードで可視化されます。

〜のために Rust フローをロックすると、現在のコンストラクターでも観測された量が必要です:

```rust
let before = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` はロック、金額、および観測された残額を取ります。`CancelAssetLock::new` はロックと観測された残額を取ります。残額が先に変化していた場合、台帳はどちらの命令も拒否します。

### 3. JavaScript から Kotodama エスクロー表面をコンパイルする {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript は型のないネイティブ命令を発明する必要はありません。現在のコンパイラはブロックチェーン台帳のエスクロービルトインを Kotodama に公開しており、その後のデプロイメントは [スマートコントラクトを構築してデプロイする](./smart-contracts.md) に従います。`open_offer` エントリポイントは `authorize(Admin)` であるため、実行者は呼び出し元に対し、デプロイされたアドレスと `permission: "Admin"` を対象とする `CanUseContractPermission` を保持していることを要求します。

これを `native_escrow.ko` として保存してください:

```kotodama
seiyaku NativeEscrowAitai {
    permission Admin;
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize(Admin) {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

次の内容を `compile-native-escrow.mjs` として保存し、Node.js からその正確なソースをコンパイルするために使用してください:

```js
import { readFile } from 'node:fs/promises'
import { compileKotodamaProgram } from '@iroha/iroha-js/kotodama-compiler'

const source = await readFile('./native_escrow.ko', 'utf8')

const result = await compileKotodamaProgram(source, {
  sourceName: 'native_escrow.ko',
})
if (!result.ok) {
  throw new Error(JSON.stringify(result.diagnostics, null, 2))
}
console.log({
  codeHashHex: result.output.codeHashHex,
  entrypoints: result.output.manifest.entrypoints.map(({ name }) => name),
})
```

事前条件に記載されているソースビルド済みパッケージ環境から実行します:

```bash
node ./compile-native-escrow.mjs
```

## 確認する {#verify}

マーケットプレイスのエスクローの場合、`FindAssetEscrowById` および解放後の両当事者の資産保有状況を照会してください。記録は `Released` でなければならず、受け入れた購入者の名前を記載し、残りの保管がないことを示してください。上記の Python ロックについては、返されたIDを保持し、署名済みの照会を繰り返してください:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    network_id=client.local_signing_context.network_id,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

また、宛先の資産保有を照会し、それが4単位増加していることを確認してください。エスクロー記録と宛先後状態がない取引プロトコル結果記録は、不完全な検証です。

## トラブルシューティング {#troubleshooting}

- `Not permitted` を開く際は、通常、認可主体が選択した資産をカストディに移管できないことを意味します。紛争解決は、別のグローバルな `CanResolveEscrowDispute` ゲートを持っています。
- `asset lock remaining amount changed since the drawdown was prepared`（または `...since the cancellation was prepared`）は楽観的同時実行の競合です。レコードを再クエリし、他の引き出し/キャンセルが意図されたものであるかどうかを判断し、新しい状態が受け入れ可能な場合にのみ新しい指示に署名してください。
- 設定されたリリース承認主体のみが信頼されたロックを引き出すことができます。宛先は資金を受け取るだけではそれを解放できません。
- マーケットプレイスでのリリースは、承認および支払い送信状態の後にのみ有効です。キャンセルは、より早いライフサイクルの状態に限定されます。
- 有効期限は権威あるブロックチェーン台帳の時間を使用します。ローカルシステムの時計のタイムアウトを、`ExpireAssetLock`が通過する証拠として扱わないでください。
- 手数料の不履行は、そのライフサイクルステップを提出する当事者に属します。資金の購入者、売り手／オープナー、および解放承認権限者は、Taira 上で独立しています。

## ソースおよび関連文書 {#source-and-related-docs}

- [固定されたソースコードリビジョンでのネイティブエスクロー指示モデル](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/escrow.rs)
- [固定されたソースコードのリビジョンでのネイティブエスクロー統合テスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/native_escrow.rs)
- [Python ピン留めされたソースコードのリビジョンでのエスクロークライアントメソッド](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/src/iroha_python/client.py)
- [Kotodama ピン留めされたソースコードのリビジョンでのネイティブエスクローサンプル](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/native_escrow.ko)
- [ネイティブ資産エスクロー](/ja/blockchain/escrow.md)
- [代替可能な資産](./fungible-assets.md)
- [権限と役割](./permissions-and-roles.md)
