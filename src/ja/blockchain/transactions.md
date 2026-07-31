---
translation_locale: ja
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 取引 {#transactions}

取引は,ブロックチェーン上の作業を実行するための署名された要求である.実行可能なメリットロードは [指示](./instructions.md)の順序,契約呼び出し, IVM バイトコード,または証明された IVM の実行である.[スマート契約](./smart-contracts.md)については,現在の契約執行モデルを参照してください.

トランザクションは,状態変更または実行可能な作業を行います. 読み込みのみ検査では署名されたクエリや公開の読み込みエンドポイントを使用し,取引を作成しません.

約束されたブロックに認められたトランザクションは,実行拒否を含む執行結果とともに保存されます.ブロックの承認前に拒絶された要求,例えば無効な封筒またはキューによって拒否された取引は,ブロックに保存されません.

プライバシーを守る資産移動については, [匿名トランザクション](./anonymous-transactions.md)を参照してください.匿名の取引は,公開アカウントから口座のバランスの変更ではなく,保護された資産メモ,コミットメント,無効化符,ゼロ知識証明を使用します.

選択された透明な実行効果に対する証明証拠については, [FastPQ](./fastpq.md)を参照してください. FastPQ は通常のトランザクションを実行後に実行証人を消費し,サポートされている状態移行のために決定的な証明パッチを構築します.

## Taira で試してみてください {#try-it-on-taira}

最近の公開 Taira ブロックとトランザクションステータスを署名アカウントなしで確認するために,探査者ルートを使用する.

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

`hash`をリストからコピーし,探検家の詳細路線を確認します.

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

トランザクションを提出するには,署名された Norito 封筒,正しいチェーン ID,料金のメタデータ, faucet資金による Taira アカウントが必要です.

料金を支払う例では Taira, ポンプの助手から [テストネットを入手 XOR について Taira](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) のように `taira_faucet_claim.py`, 署名者はまず公共のファックスを利用して資金提供します

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

ポンプパズルまたはクレーム経路が `502` を返した場合は,トランザクションそのものをデバッグする前に待って再試してください.

その後,取引を提出する際に Taira 料金の資産のメタデータを添付します.

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## オフライン取引 {#offline-transactions}

Iroha には2つのオフライントランザクションワークフローがある.

- オフライン署名は,サインデバイスが接続から離れている間に通常の署名されたトランザクションを作成します.オンラインクライアントが Torii に署名した封筒を提出するまで取引は処理されません.したがって,依然として正しいチェーン ID,権限,許可,料金は必要であり,取引寿命も必要です.
- カゲムシャオフラインキャッシュは,オンライン中に財布をトップアップし,両財布がオフラインである間に受信者が開始した財布から財布への転送をサポートし,受信者がオンラインに戻ったときに結果となるメモの状態を償還します.

Torii は,Kagemusha の全生命周期を `/v1/offline/*` に表す.

|方法と終点|目的|
| --- | --- |
|`GET /v1/offline/readiness`|`asset_definition_id` の Kagemushaの準備を評価する |
|`POST /v1/offline/receiver-lineage`|署名された受領者申請の証明付きのアクティブ登録系を解決する|
|`POST /v1/offline/top-up`|署名されたオンラインからオフラインの補充作戦を提出する|
|`POST /v1/offline/redeem`|オフラインで署名された償還作戦を提出する|
|`GET /v1/offline/operations/{operation_id}`|補充または償還の定例的な状態を読む|

オフライン運用を建設する前に,資産の準備を確認する.

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

準備は財布を活性橋に結びつける ABI 21 及び認証 V4 配列,補充,および償還要求は入力された `application/x-norito` アーカイブ 補充と償還返済 `202 Accepted` と a `Location` 操作リソースを指すヘッダ;内蔵された非ゼロ操作 ID アイデンポテンシー・キーを供給する

典型的な流れは:

1. `ready`が偽りである場合,または任意のブロックが適用される場合は,準備を問わず停止します.
2. タイプした文字を使用 Swift または JVM キャノニカル補充アーカイブを構築し,送信し,入力メモの状態と動作の両方を保持する財布 ID 操作が最終的な鎖状態に達するまで.
3. 必要に応じて受信者の登録系を解決し,各ペア転送を現地で構築して確認し,転送を認めない前に暗号化されたメモ状態を維持する.
4. 受信者がオンラインになると 定例的な救赎アーカイブを作成して 提出し,その運用リソースを最終的に調査します.

本書は,オンラインライフサイクルを通じてメモの状態が返るまで,オフライン転送の矛盾を観察することはできません.したがって,ウォレットとオペレーターのポリシーは値制限,期限切れ,承認された発行者,持続的なローカルストレージ,和解ウィンドウを強制する必要があります.

この例は,新しい取引を `Grant` この取引では,マウスはアリスに指定された役割を授与する (`role_id`チェック [完全な例](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
