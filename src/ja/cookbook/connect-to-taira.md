---
translation_locale: ja
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Taira に接続する {#connect-to-taira}

## 結果 {#outcome}

Taira に到達可能か確認し、ローカルクライアントの設定から標準的な I105 アカウントIDを導出し、暗号署名者にテストネットの XOR を資金提供し、1件の手数料見積もり済みカナリアトランザクションを送信してください。この手順では、Minamoto への書き込みは一切行いません。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Python 3.11以降、および最新の`iroha`と`kagami`のバイナリ。
- Taira チェーン、API エンドポイント、アカウントプロファイル、および専用のテストネットキーで作成された `taira.client.toml`。 [Taira クライアント設定を作成](/ja/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) に従い、ファイルをソース管理から除外してください。
- クライアント設定の横に保存された、[Taira でテストネット XOR を入手する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)からの実行準備完了の`taira_faucet_claim.py`。

## ステップ {#steps}

### 1. レディネスとライブネスを分離する {#_1-separate-liveness-from-readiness}

`/livez` はプレーンテキストのプロセス稼働状態プローブです。`/status`、`/health`、および `/readyz` は JSON を返します。必要なサブシステムがブロックされている場合、稼働中のノードはレディネスプローブから正当に `503` を返すことがあります。

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` は、プロセスが応答するかどうかを判断するためだけに使用してください。`/readyz` はトラフィックの受け入れに使用し、`503` を障害として扱う前に、その JSON ブロッカーの詳細を確認してください。

### 2. 公開診断を実行する {#_2-run-the-public-diagnostics}

このチェックは読み取り専用で、暗号化署名者の設定を読み込みません：

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

医師がハード DNS、TLS、チェーン、または API のエンドポイント障害を報告した場合は、書き込みを続けないでください。飽和したパブリックキューは一時的なものです。待って、制限付きポリシーで再試行してください。

### 3. 秘密を印刷せずに Taira アカウントIDを導出する {#_3-derive-the-taira-account-id-without-printing-a-secret}

設定から公開鍵だけを読み取り、それを Taira I105 プロファイルでエンコードします。`[account].domain` の値はルーティングコンテキストを提供します；アカウントIDの一部ではありません。

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

出力はドメインのない正規の I105 アドレスです。`wallet@payments.universal` のような名前はエイリアスであり、厳密なアカウントフィールドで使用される前に解決する必要があります。

### 4. 現在の Taira 手数料資産を請求する {#_4-claim-the-current-taira-fee-asset}

テストネット資金提供サービスの応答は、手数料資産定義の信頼できる情報源です。他のネットワークや古い実行からIDをコピーするのではなく、返されたBase58 IDを保持してください。

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

残高を最大で1分間確認してください。テストネットの資金提供サービスは、資金提供トランザクションが表示される前に`202 Accepted`を返すことがあります。

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` は取引のメタデータです。明示的な `--fee-payer authority` の選択は署名に紐付いており、CLI は署名前に正確な手数料の見積もりを取得します。

## 確認する {#verify}

ログ指示を提出し、JSON プロトコルの結果記録を保持し、Appliedの最終確定を待ちます。`--no-wait`を省略すると、初回の提出も確認を待つことになり、明示的なステータス読み取りによって最終的なソフトウェア処理のワークフロー状態が証明されます。

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

最終コマンドは、トランザクションがデフォルトの`Applied`端末状態に達した後にのみ成功します。暗号化ハッシュはテスト証拠として保持し、秘密鍵や完全なクライアント設定をそこに保存しないでください。

## トラブルシューティング {#troubleshooting}

- `/livez` は JSON を求められたときに `406` を返します。なぜなら、その API エンドポイントは `text/plain` だからです。上記のように `Accept: text/plain` を送信してください。
- `/health` または `/readyz` は、`/livez` と `/status` が動作している間でも、機械判読可能なブロッカー付きで `503` を返すことがあります。そのブロッカーを修正するか待つ必要があります。キーを再生成してもノードの準備状態は変わりません。
- テストネットの資金提供サービス `502`、タイムアウト、または古いプルーフ・オブ・ワークのアンカーは公共サービスの障害です。新しいパズルを取得して後で再試行してください。
- I105 プレフィックスエラーとは、公開鍵が誤ったプロファイルでエンコードされたことを意味します。`iroha tools address convert --profile taira` を再実行してください。
- 料金見積もりの拒否は通常、承認元金が資金提供されていない、手数料資産のメタデータが古い、または明示的な手数料支払者が選択されていないことを意味します。
- このカナリアが成功しても、登録、発行、またはネームスペース管理は依然として拒否されることがあります。これらの操作には別のソフトウェア実行権限が必要です。Taira のアクセスが付与されていない場合、生成されたローカルネットワークでそれらをリハーサルしてください。

## ソースと関連ドキュメント {#source-and-related-docs}

- [Taira CLI 診断および固定されたソースコードリビジョンでのカナリアソース](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [明示的な料金選択と、固定されたソースコードのリビジョンでの CLI 提出元](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira アカウントおよびテストネット資金提供サービスガイド](/ja/get-started/sora-nexus-dataspaces.md)
- [クライアント設定](/ja/guide/configure/client-configuration.md)
- [取引](/ja/blockchain/transactions.md)
