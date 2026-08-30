---
translation_locale: ja
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 国産資産のエスクロー {#native-asset-escrow}

## 結果 {#outcome}

Rust または Python で現在のタイプされたライフサイクルを実行し,すべてのロックリトライを実際に観察した残りの金額に結びつけ,ネイティブ Kotodama エスクロー表面を JavaScript からコンパイルします.

## 必須条件 {#prerequisites}

- 数値的な資産定義と,十分な量を持つ開業者/売り手.
- ステップを提出する各当事者に対して,資金提供された単鍵 I105 クライアント.手数料資産が現在の Taira faucet応答に一致している実体当局の支払った `fee_payment`意図を使用;ドキュメントから資産 ID を埋め込むことなく.
- Iroha からの現在の Rust または Python SDK のコミットメント `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- 目的として JavaScript コンパイラ例 Node.js 24 プラス 地元で作られた `@iroha/iroha-js` 包装とその原産物 `iroha_js_host`; フォローする [JavaScript SDK ソースビルドの設定](/ja/guide/tutorials/javascript.md#build-from-source). ブラウザのビルドは提供する必要があります `compilerUrl` 地元のホストを 負荷する代わりに
- Taira は資産譲渡およびエスクロー指示を認めなければならない.資産所有者は,その資産政策が許可するときに通常のライフサイクルを使用することができる.紛争解決にはグローバルな `CanResolveEscrowDispute` の許可が必要です.必要な公共ネットワーク当局が欠席している場合,生成されたローカルネットワークを使用します.

マーケットプレスエスクローモデルは販売者,購入者,オフチェーン支払い,およびリリース.ジェネリックロックは目的地と選択的に別々のリリース権限を指定する;彼らは部分引き出物,キャンセル,および期限切れをサポートします.

## ステップ {#steps}

### 1. Rust で市場保証書を完了する. {#_1-complete-a-marketplace-escrow-with-rust}

この機能は,リアルタイピングされた IDs とクライアントを受信します.40ユニットを開き,買い手にオフチェーン支払いを受け入れ,マークさせ,その後販売者に保管を解放させます.各投稿では,権限料金を支払う人の名前が `FeePaymentIntent` を介して表示されます.

```rust
use eyre::{Result, ensure};
use iroha::{
    client::Client,
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

    seller.submit_blocking(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit_blocking(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit_blocking(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit_blocking(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller.query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

保管口座は本簿で管理されます.通常の資産転送トークンを授与することは,エスローライフサイクルの外でのアクティブ保管を流出させることはありません.

### 2. Python で通用ロックを開いて部分的に描く. {#_2-open-and-partially-draw-a-generic-lock-with-python}

`remaining_amount`を正確に渡すことは楽観的な同期性をもたらします. 古い並行要求は,保管を2回請求する代わりに拒否されます.

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
    chain_id,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"

    client.open_asset_lock_and_wait(
        chain_id=chain_id,
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
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        chain_id=chain_id,
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
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

Python SDK は, `expected_remaining_amount` が省略されたときに自動的に問い合わせることができるが,観測値を通過すると,署名した経済前提条件がアプリケーションコードに可視化されます.

Rust ロックフローの場合,現在のコンストラクタはまた観察された金額を要求する.

```rust
let before = opener.query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit_blocking(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener.query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit_blocking(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new`は3つの値を取ります. `CancelAssetLock::new`は2つを取ります.予想された残りの金額を除外すると,古い,不安全な呼び出し形状が記述されます.

### 3. Kotodama のエスクロー表面を JavaScript からまとめます {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript は,未分類のネイティブ指示を発明する必要はありません.現在のコンパイラでは,内蔵されたレジャー・エスクローを Kotodama に暴露します.展開と呼び出しが続いて [スマートコントラクトを構築し,展開する](./smart-contracts.md).

`native_escrow.ko`として保存する.

```kotodama
seiyaku NativeEscrowAitai {
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize("Admin") {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

`compile-native-escrow.mjs`として保存し,その正確な源を Node.js からまとめるために使用する.

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

必須条件で説明されているソースビルドパッケージ環境から実行します.

```bash
node ./compile-native-escrow.mjs
```

## 確認する {#verify}

市場エスクローの場合,公開後 `FindAssetEscrowById` と両当事者の資産保有を查る.記録は `Released` でなければならない.受け入れ買い手の名前を示し,残留保管がないことを示します.上記の Python ロックでは,返還された ID を保持して署名した問い合わせを再確認してください:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

また,目的地の資産保有量を查询し,それが4単位増加したことを確認します.エスクロー記録と目的地のポストステートなしのトランザクション領収書は不完全な検証です.

## 問題を解く {#troubleshooting}

- `Not permitted`が開業する際には,通常は指定された資産を保管に移行できないことを意味します.紛争解決には別々のグローバル `CanResolveEscrowDispute` ゲートがあります.
- `expected remaining amount`拒否は楽観的対比性衝突である.記録を再確認し,他の引き取り/キャンセルが意図されたかどうかを決定し,新しい状態が受け入れられる場合にのみ新しい指示に署名します.
- 信頼性の高いロックを抽出できるのは設定されたリリース権限のみです.目的地は資金を受け取るだけでそれを解放することはできません.
- 市場でのリリースは,受付と支払い送信された状態後のみ有効であり,キャンセルは,以前のライフサイクル状態に限定されます.
- `ExpireAssetLock`が経過する証拠として,地元の壁時計のタイムアウトを扱わないでください.
- 料金欠損は,そのライフサイクルステップを提出する当事者に属します. 資金購入者,販売者/開設者,および Taira で独立した解放権限.

## ソースおよび関連文書 {#source-and-related-docs}

- [固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)でネイティブエスクロー指示モデル
- [固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)でネイティブ・エスクロー統合テスト
- [Python 固定されたコミットでエスクロークライアントの方法](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama 固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)のネイティブエスクローサンプル
- [国産資産の保証書](/ja/blockchain/escrow.md)
- [浮動資産](./fungible-assets.md)
- [許可と役割](./permissions-and-roles.md)
