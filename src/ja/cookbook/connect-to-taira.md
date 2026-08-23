---
translation_locale: ja
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira に接続する {#connect-to-taira}

## 成果 {#outcome}

確認してください Taira 実現可能で,法典的な I105 口座 ID ローカル クライアント構成から,テストネットでサインを資金提供する XOR, このレシピは決して手紙を送らない Minamoto.

## 必須条件 {#prerequisites}

- `curl`,`jq`, Python 3.11またはそれ以降,および現在の `iroha`及び `kagami`バイナリー.
- A `taira.client.toml` 作成した Taira チェーン,エンドポイント,アカウントプロフィール,そして専用のテストネットキー. [作成する Taira クライアント設定](/ja/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ファイルは源制御から外れておく
- 走る準備ができている `taira_faucet_claim.py` から [テストネットを入手 XOR について Taira](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), クライアントのコンフィギュア側で保存されます.

## ステップ {#steps}

### 1. 準備と活力を分離する {#_1-separate-liveness-from-readiness}

`/livez`は,平文プロセス寿命探査機である. `/status`, `/health`,および `/readyz`返信 JSON.必要なサブシステムがブロックされたとき,実行ノードが準備探査機から合法的に`503`を返却することができます.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` を利用して,プロセスが応答するか否かを判断するのみ. `/readyz` を使用して,トラフィックを入力し, JSON ブロックの詳細を調べて, `503` を停電とみなす前に使用します.

### 2. 公共診断を実施する {#_2-run-the-public-diagnostics}

このチェックは読み込みのみであり,サイン設定を載せません.

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

医師 が 硬い DNS, TLS,連鎖,または エンドポイント の 失敗 を 報告 する 時,書き留め を 継続 し て は い ませ ん.飽和 さ れ た 公衆 の 行列 は 暫定 な もの で ある.制限 的 な 政策 に よっ て 待って 再度 試す.

### 3. 秘密を印刷せずに Taira アカウント ID を取得する. {#_3-derive-the-taira-account-id-without-printing-a-secret}

コンフィギュレーションから公開鍵だけ読み,その後コードを Taira I105 プロフィール `[account].domain` 値供給のルーティングコンテキスト;それはアカウントの一部ではない ID.

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

輸出はドメインのないカノニカルな I105 アドレスである. `wallet@payments.universal` のような名称は偽名であり,厳格なアカウントフィールドで使用される前に解決されなければならない.

### 4. 現在の Taira 料金の資産を請求する {#_4-claim-the-current-taira-fee-asset}

料金資産定義の真実源は, faucet応答です. 返済された Base58 ID を他のネットワークまたは古い実行から ID をコピーする代わりに保持します.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

最長1分間の余計を調査する. 資金調達取引が表示される前に faucetは `202 Accepted` を返却することができます.

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

`gas_asset_id`はトランザクションメタデータである.明示的な `--fee-payer authority`選択は署名に拘束されており, CLI は署名する前に正確な料金を取得する.

## 確認する {#verify}

ログの指示を提出し, JSON 領収書を保持し,適用最終期限を待て. `--no-wait` を除外すると,初期送信が確認を待つことにもなる.明示的な状態読み込みは最終パイプラインの状態を示す.

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

最終コマンドは,トランザクションがデフォルトの端末状態 `Applied` に到達した後のみ成功します.テスト証拠にハッシュを保存し,プライベートキーまたは完全なクライアント設定を決して保管しないでください.

## 問題を解く {#troubleshooting}

- `/livez` 返済 `406` 要求されたとき JSON なぜなら,その最終点は `text/plain`. 送信する `Accept: text/plain` 上記のように
- `/health`または`/readyz`は, `/livez`と `/status`が動作している間でも機械的に読み取れるブロックで `503`を返してもよい.そのブロックを固定するか待つこと;再生する鍵はノードの準備性を変更しない.
- `502` faucet,timeout,または時代遅れの proof-of-workアンカーは公共サービスでの失敗です.新しいパズルを持ってきて後で再試してください.
- I105 前尾のエラーは,公钥が誤ったプロフィールで暗号化されたことを意味します.再実行 `iroha tools address convert --profile taira`.
- 料金配当の拒絶は通常,権限が資金提供されていないこと,料金の資産メタデータは時代遅れであること,または明示的な手数料支払者が選ばれていないことを意味します.
- このカナリーが成功した後でも登録,鋳造,または命名空間管理は拒否することができます. これらの操作には,別々の実行時間許可が必要です.Taira へのアクセスが許可されていない場合,生成されたローカルネットワーク.

## ソースおよび関連文書 {#source-and-related-docs}

- [Taira CLI 診断とキャナリーソース ピンされたコンビート](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [明確な料金の選択と,固定されたコミットメント](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)で提出する源 CLI
- [Taira 口座と faucetガイド](/ja/get-started/sora-nexus-dataspaces.md)
- [クライアントの設定](/ja/guide/configure/client-configuration.md)
- [取引](/ja/blockchain/transactions.md)
