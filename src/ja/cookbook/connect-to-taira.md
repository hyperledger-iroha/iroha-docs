---
translation_locale: ja
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Taira に接続する {#connect-to-taira}

## 結果 {#outcome}

Taira に到達可能か確認し、ローカルクライアントの設定から標準的な I105 アカウントIDを導出し、暗号署名者にテストネットの XOR を資金提供し、1件の手数料見積もり済みカナリアトランザクションを送信してください。この手順では、Minamoto への書き込みは一切行いません。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Python 3.11以降、および最新の`iroha`と`kagami`のバイナリ。
- Taira チェーン、正確な `network_id`、API エンドポイント、アカウントプロファイル、および専用のテストネットキーで作成された `taira.client.toml`。 [Taira クライアント設定を作成](/ja/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) に従い、ファイルをソース管理から除外してください。
- フォーセットジャーナル用の書き込み可能な作業ディレクトリ。`iroha taira account faucet prepare` は `./taira-faucet` を所有者専用の権限で作成し、既存のディレクトリを置き換えることは拒否します。

## ステップ {#steps}

### 1. レディネスとライブネスを分離する {#_1-separate-liveness-from-readiness}

`/livez`、`/health`、および `/readyz` はプレーンテキストのプローブです。`/status` は JSON を返します。コンセンサスへの受け入れやその他の必要なサブシステムが利用できない場合、稼働中のノードは `/readyz` から正当に `503` を返すことがあります。

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` は、プロセスが応答するかどうかを判断するためだけに使用してください。`/readyz` はトラフィックの受け入れに使用してください。その `503` はブロッカーの詳細を含まない `service_unavailable` エラーエンベロープであるため、障害として扱う前に以下の診断を実行してください。

### 2. 公開診断を実行する {#_2-run-the-public-diagnostics}

このチェックは読み取り専用で、暗号化署名者の設定を読み込みません：

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

医師がハード DNS、TLS、チェーン、または API のエンドポイント障害を報告した場合は、書き込みを続けないでください。飽和したパブリックキューは一時的なものです。待って、制限付きポリシーで再試行してください。

### 3. 秘密を印刷せずに Taira アカウントIDを導出する {#_3-derive-the-taira-account-id-without-printing-a-secret}

設定から公開鍵だけを読み取り、それを Taira I105 プロファイルでエンコードします。アカウントIDにはドメインが含まれません。`[account].profile` が選択するのはネットワークプレフィックスだけです。

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

フォーセットポリシーは現在の手数料資産定義を示します。他のネットワークや古い実行からIDをコピーするのではなく、そのBase58 IDを保持してください。このポリシーは署名されていないディスカバリーデータであるため、自動化では各応答を信頼するのではなく、想定する発行者、資産定義、および金額を固定する必要があります。

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` はプルーフ・オブ・ワークを解き、正確な署名済みトランザクションを保存します。`submit` はそれを一度だけ送信し、適用された後に戻ります。`submit` が `Pending` を報告するかタイムアウトした場合は、別の請求を準備するのではなく、同じ設定とジャーナルで `taira account faucet resume` を実行してください。その後、残高を最大で1分間確認してください。

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

Taira へのすべての書き込みに `--fee-payer authority` を使用してください。この選択は署名に紐付いており、CLI は署名前に、Taira の手数料資産で表した正確な手数料の見積もりを提示します。

## 確認する {#verify}

ログ指示を提出し、JSON プロトコルの結果記録を保持し、Appliedの最終確定を待ちます。`--no-wait`を省略すると、初回の提出も確認を待つことになり、明示的なステータス読み取りによって最終的なソフトウェア処理のワークフロー状態が証明されます。

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

最終コマンドは、正確なグローバルステータスが状態として解決された `Applied` の確定を報告した後にのみ成功します。暗号化ハッシュはテスト証拠として保持し、秘密鍵や完全なクライアント設定をそこに保存しないでください。

## トラブルシューティング {#troubleshooting}

- `/livez`、`/health`、および `/readyz` は、JSON だけを求められると `406` を返します。これらは `text/plain` で応答するためです。上記の `Accept` ヘッダーを送信してください。
- `/readyz` は、`/livez` と `/status` が動作している間でも、`service_unavailable` エラーエンベロープ付きで `503` を返すことがあります。準備が整うのを待つか、`iroha taira doctor` を実行してください。キーを再生成してもノードの準備状態は変わりません。
- `submit` 中のフォーセットの `502` やタイムアウトでは、請求の結果が不明なままになります。別の請求を準備するのではなく、同じ設定とジャーナルで `taira account faucet resume` を実行してください。古いプルーフ・オブ・ワークのアンカーでは `prepare` が失敗します。新しいジャーナルディレクトリで再度準備してください。
- I105 プレフィックスエラーとは、公開鍵が誤ったプロファイルでエンコードされたことを意味します。`iroha tools address convert --profile taira` を再実行してください。
- 料金見積もりの拒否は通常、認可主体に資金が提供されていないか、設定された `network_id` が Taira のものではないことを意味します。`--fee-payer` の欠落や、`--metadata` 内の `gas_asset_id` などの手数料キーは、見積もりの前にローカルで失敗します。
- このカナリアが成功しても、登録、発行、またはネームスペース管理は依然として拒否されることがあります。これらの操作には別のソフトウェア実行権限が必要です。Taira のアクセスが付与されていない場合、生成されたローカルネットワークでそれらをリハーサルしてください。

## ソースと関連ドキュメント {#source-and-related-docs}

- 固定されたソースコードのリビジョンでの [Taira CLI の診断とカナリアのソース](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) と [フォーセットコマンド](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [明示的な料金選択と、固定されたソースコードのリビジョンでの CLI 提出元](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira アカウントおよびテストネット資金提供サービスガイド](/ja/get-started/sora-nexus-dataspaces.md)
- [クライアント設定](/ja/guide/configure/client-configuration.md)
- [取引](/ja/blockchain/transactions.md)
