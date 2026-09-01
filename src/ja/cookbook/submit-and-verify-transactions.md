---
translation_locale: ja
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 取引を提出して確認する {#submit-and-verify-transactions}

## 結果 {#outcome}

プリフライト a Taira 取引、正確な手数料見積もりを受け入れ、署名して提出する、 適用の最終性を待ち、暗号ハッシュによって最終化されたトランザクションを検証します。

## 前提条件 {#prerequisites}

- [Taira に接続する](./connect-to-taira.md)によって制作された、資金提供された`taira.client.toml`、`taira.tx-metadata.json`、および`TAIRA_ACCOUNT_ID`。
- 現在の`iroha`CLI と`jq`です。
- 使い捨ての Taira 暗号署名者。Minamoto でそのキーやこれらの書き込みコマンドを再使用しないでください。

## ステップ {#steps}

### 1. API エンドポイント、認証プリンシパル、および手数料残高をプレフライトする {#_1-preflight-the-endpoint-authority-and-fee-balance}

まずキューのデータスナップショットを読み取り、その後、認証プリンシパルの手数料残高が表示されていることを確認します。接続レシピによって生成されたメタデータから、Base58の資産定義IDを読み取ります。

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

口座または手数料の残高がない場合は停止してください。有効な指示は、認可の元本が支払いできない場合、手数料の承認を通過できません。

### 2. 見積もりを出し、署名して、一度提出する {#_2-quote-sign-and-submit-once}

CLI は、手数料の見積もりのために正確な署名されていないペイロードを送信し、承認された支払い意図をトランザクションにバインドして、署名し、送信します。JSON モードは、トランザクションの暗号ハッシュ、署名済みトランザクション、承認された見積もりを一緒に返します。

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

このレシピでは`--no-wait`を使用しないでください。コマンドは、成功したプロトコル結果の記録を書き込む前に確認を待ちます。

### 3. ターミナルソフトウェアの処理ワークフロー状態を待つ {#_3-wait-for-terminal-pipeline-state}

成功を HTTP の受理やキューへの受け入れから推測するのではなく、入力されたステータスヘルパーを使用してください。`--wait`では、安全なルーティング範囲が自動的に選択され、デフォルトのターゲットは適用された確定性です。

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

`Rejected` と `Expired` は再試行可能な成功状態ではなく、末端での失敗です。トランザクションを変更または再構築する前に、その理由を記録してください。

### 4. 保存された取引を読む {#_4-read-the-stored-transaction}

ソフトウェア処理ワークフローのステータスは、処理が完了したかどうかを示します。トランザクエリは、承認されたトランザクションが同じ暗号ハッシュの下に保存されていることを確認します。

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

エクスプローラーは、第二の読み取り専用の観察面です。ソフトウェア処理のワークフロー完了に対して一時的に遅れることがあります。

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

状態を変更する命令の場合、変更されたオブジェクトのクエリで終了してください。[メタデータ](./metadata.md)、[代替可能な資産](./fungible-assets.md)、および [NFTs](./nfts.md) のレシピには、それらの状態後の読み取りが含まれています。

## 確認する {#verify}

3つのレコードがすべて同じ暗号ハッシュで一致していること、およびエクスプローラーが保留状態を報告していないことを確認してください:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

提出プロトコルの結果の記録と最終ステータスをテスト証拠として保持してください。それらには公開取引資料が含まれており、署名キーは含まれていません。

## トラブルシューティング {#troubleshooting}

- HTTP `202` またはキュー状態は入場のみを証明します。指定された状態が Applied、Rejected、Expired になるか、または制限時間に達するまで、状態のポーリングを続けてください。
- 送信処理がハッシュを返した後にタイムアウトした場合は、別のトランザクションを作成する前にそのハッシュを照会してください。確認せずに再送信すると、手数料見積もり済みで署名済みの新しいペイロードが作成されます。
- 料金見積もりは署名前に拒否することができます。`--fee-payer authority`、`gas_asset_id`、承認者の残高、ネットワークチェーンIDを確認してください。
- `Rejected` は通常、命令の検証、権限、手数料、または古い状態を示します。これは失敗した実行の確定的な証拠であり、通信の再試行として再分類されるべきではありません。
- 探索者 `404` は Applied の直後にインデックス遅延が発生する可能性があります。読み取りを再試行してください。トランザクションを再送信しないでください。
- 特権命令が生成されたローカルネットで動作する場合でも、Taira がこれを拒否する場合は、正確な Taira 権限または管理対象のネームスペースの割り当てを取得してください。ローカルの結果は、パブリックブロックチェーンネットワークの認可プリンシパルを付与するものではありません。

## ソースと関連ドキュメント {#source-and-related-docs}

- [固定されたソースコードのリビジョンでのトランザクション送信および手数料見積もりの実装](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ピン留めされたソースコードのリビジョンでの取引確認の実装とテスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [取引](/ja/blockchain/transactions.md)
- [CLI ガイド](/ja/get-started/operate-iroha-via-cli.md)
- [Torii API エンドポイント](/ja/reference/torii-endpoints.md)
