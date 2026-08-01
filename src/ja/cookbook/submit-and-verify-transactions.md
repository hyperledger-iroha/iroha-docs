---
translation_locale: ja
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: e07cc42a3fd5579db312bfbfbb8010f473062edebe0141eb9bb8c2a0e7faa4da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 取引を提出し確認する {#submit-and-verify-transactions}

## 結果 {#outcome}

Taira トランザクションを先行して,正確な料金の申し出を受け入れて,署名し提出し,適用最終期限を待て,約束されたトランザクションをハッシュで検証します.

## 必須条件 {#prerequisites}

- [によって生産された資金調達した `taira.client.toml`, `taira.tx-metadata.json`,および `TAIRA_ACCOUNT_ID`は, Taira](./connect-to-taira.md)とつながっています.
- `iroha` CLI と `jq`の電流
- Taira の使い捨てサイン.その鍵やこれらのコマンドを Minamoto に書き留めずに使用する.

## ステップ {#steps}

### 1. 目的地,権限,料金のバランスを優先する {#_1-preflight-the-endpoint-authority-and-fee-balance}

順番のスナップショットを最初に読み,その後に当局の手数料余分が可視であることを証明する.接続レシピで生成されたメタデータからBase58資産定義 ID を読み取る.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

アカウントまたは料金の余分がない場合,停止します.有効な指示は,その権限が支払えないとき,手数料入学を通過することはできません.

### 2. 引用し,署名し,1回提出する {#_2-quote-sign-and-submit-once}

CLI は,手数料報價に署名されていない正確な役に立たない負荷を送信し,受付された支払意向をトランザクションに結合し,サインして送信します. JSON モードでは,トランザクションハッシュ,署名したトランザクション,および受付された報价を一緒に返します.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

このレシピでは `--no-wait` を使用しないでください. コマンドは成功の領収書を書く前に確認を待っています.

### 3. 終端パイプライン状態を待機する {#_3-wait-for-terminal-pipeline-state}

HTTP の受付またはキューエントリーから成功を推論する代わりに,入力されたステータスヘルパーを使用します. `--wait`で,安全なルーティング範囲が自動的に選択され,デフォルトターゲットは適用最終性です.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` と `Expired` は終末的な失敗であり,復旧可能な成功状態ではありません.取引を変更または再構築する前にその理由を記録します.

### 4. 保存された取引を読む {#_4-read-the-stored-transaction}

パイプライン状態は,処理が完了したか否かを答えます.トランザクションクエリでは,承認されたトランザクションが同じハッシュで保存されていることを確認します.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

探査機は2番目の 読み取りのみの観測表面で パイプラインの最終的な状態に 少し遅れをとる可能性があります.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

状態変更指示については,変異されたオブジェクトのクエリで終了します. [メタデータ](./metadata.md), [フンジブル資産](./fungible-assets.md),および [NFTs](./nfts.md)レシピには,そのポストステート読み込みが含まれます.

## 確認する {#verify}

すべての3つの記録が同じハッシュで一致し,探検家はもはや待機状態を報告していないことを確認します:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

提出の領収書と最終的な状態を試験証拠として保管する.これらは署名鍵ではなく,公開取引資料を含んでいる.

## 問題を解く {#troubleshooting}

- HTTP `202`または並列状態は,入場のみを証明します. 適用された,拒否された,終了した,または制限されたタイムアウトまで入力された状態の投票を続けます.
- ハッシュを返した後に送信が終了する場合は,別のトランザクションを作成する前にそのハッシュをクエリします.盲目再提出は新しい引用および署名された役に立たない荷物を作成します.
- 署名前に手数料申し出を拒絶することができます. `--fee-payer authority`, `gas_asset_id`,当局のバランス,およびネットワークチェーン ID をチェックします.
- `Rejected`は通常,指示の検証,許可,手数料,または時代遅れ状態を示します. 実行が失敗した証拠であり,輸送再試として再分類してはならない.
- Applied の直後に探査機 `404` が 索引遅延 を 行うことができる.読み取りを再試し,取引を再提出しないでください.
- 権限のある指示が生成されたローカルネットで動作するが Taira がそれを拒否する場合は,正確な Taira 許可または管理された名前空間割り当てを取得します.ローカル結果は公共ネットワークの権限を認めません.

## ソースおよび関連文書 {#source-and-related-docs}

- [取引の提出と固定されたコミットメントで手数料配当を実施](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/tests/tx_confirmation.rs)で取引確認テスト
- [取引](/ja/blockchain/transactions.md)
- [CLI ガイド](/ja/get-started/operate-iroha-via-cli.md)
- [Torii エンドポイント](/ja/reference/torii-endpoints.md)
