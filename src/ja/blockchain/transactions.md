---
translation_locale: ja
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 取引 {#transactions}

トランザクションは、ブロックチェーン上で作業を実行するための署名付きリクエストです。実行可能なペイロードは、[指示](./instructions.md) の順序付けられたシーケンス、契約の技術的呼び出し、IVM バイトコード、または証明された IVM 実行である可能性があります。現在の契約実行モデルについては [スマートコントラクト](./smart-contracts.md) を参照してください。

取引は状態を変更する作業や実行可能な作業を行います。読み取り専用の検査は署名付きクエリまたは公開読み取り API エンドポイントを使用し、取引を作成しません。

最終的なブロックに承認された取引は、実行拒否を含むその実行結果とともに保存されます。無効なデータコンテナやキューによって拒否された取引のように、ブロック承認前に拒否された要求は、ブロックに保存されません。

プライバシー保護された資産移動については、[匿名取引](./anonymous-transactions.md) を参照してください。匿名取引では、公開されるアカウント間の残高変更の代わりに、シールド資産ノート、暗号的コミットメント値、ヌリファイア、およびゼロ知識証明が使用されます。

選択された透明な実行効果に関する証拠については、[FastPQ](./fastpq.md) を参照してください。FastPQ は通常のトランザクション実行後に実行証人を消費し、サポートされる状態遷移のための決定論的な証明バッチを構築します。

## Taira でこのワークフローを実行してください {#try-it-on-taira}

署名アカウントなしで、エクスプローラルートを使用して最近の公開 Taira ブロックおよびトランザクションのステータスを確認してください：

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

以前にアプリが送信したトランザクションを追跡するには、リストから `hash` をコピーし、エクスプローラーの詳細ルートを確認してください。

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

これはまだ読み取り専用です。トランザクションを送信するには、署名済みの Norito データコンテナ、正しいチェーンID、手数料メタデータ、そしてテストネットで資金が供給された Taira アカウントが必要です。

手数料支払いの例については、Taira で、テストネット資金提供サービスヘルパーを[Taira でテストネット XOR を入手](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)から`taira_faucet_claim.py`として保存し、まず公開テストネット資金提供サービスを通じて暗号署名者に資金を提供してください。

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

テストネットの資金提供サービスのパズルまたは請求ルートが `502` を返す場合は、トランザクション自体をデバッグする前に待って再試行してください。

それから、取引を提出する際に Taira 手数料資産のメタデータを添付してください：

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## オフライントランザクション {#offline-transactions}

Iroha には2つのオフライントランザクションワークフローがあります：

- オフライン署名は、署名デバイスが切断されている間に通常の署名済みトランザクションを作成します。このトランザクションは、オンラインクライアントが署名済みデータコンテナを Torii に提出するまで処理されないため、依然として正しいチェーンID、認可プリンシパル、権限、手数料が必要です。およびトランザクションの寿命。
- 影武者オフラインキャッシュは、ウォレットがオンラインのときにトップアップし、両方のウォレットがオフラインのときでも受信者主導のウォレット間譲渡をサポートし、受信者がオンラインに戻ったときに生成されたノート状態を換金します。

Torii は、`/v1/offline/*` の下で完全なカゲムシャのライフサイクルを公開します:

|メソッドと API エンドポイント|目的|
| --- | --- |
| `GET /v1/offline/readiness` |Kagemusha の準備状況を `asset_definition_id` に対して評価する|
| `POST /v1/offline/receiver-lineage` |署名付き受信者リクエストの証明保持アクティブ登録系譜を解決する|
| `POST /v1/offline/top-up` |署名済みのオンラインからオフラインへのチャージ操作を提出する|
| `POST /v1/offline/redeem` |署名済みのオフライン償還操作を送信する|
| `GET /v1/offline/operations/{operation_id}` |トップアップまたは償還の正典的地位を読む|

オフライン操作を構築する前に、資産の準備状況を確認してください：

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

準備状態はウォレットをアクティブなブリッジ ABI 21および認証済み V4 アーティファクトセットに結び付けます。系統、チャージ、および償還リクエストは型付き`application/x-norito`アーカイブを使用します。チャージおよび償還の戻り値 `202 Accepted` は、操作リソースを指す `Location` ヘッダーを伴う；埋め込まれたゼロでない操作IDが冪等性キーを提供する。

典型的な流れは次の通りです：

1. 準備状況を確認し、`ready` が false である場合、または何らかのブロッカーが適用される場合は停止してください。
2. 型付きの Swift または JVM ウォレットを使用して、正規のチャージアーカイブを構築し、提出し、操作が最終的なチェーン状態に達するまで、入力ノートの状態と操作IDの両方を保持してください。
3. 必要な場合には受信者登録の系統を解決し、各ネットワークピアの引き継ぎをローカルで構築して確認し、転送を承認する前に暗号化されたノートの状態を保持します。
4. 受信者がオンラインのとき、標準的な引換アーカイブを作成し、提出し、その操作リソースを最終段階までポーリングします。

ブロックチェーン台帳は、ノートの状態がオンラインのライフサイクルを通じて戻るまで、矛盾するオフラインの引き渡しを検知することはできません。したがって、ウォレットおよびオペレーターのポリシーは、価値の上限、有効期限、受け入れ可能な発行者、耐久性のあるローカルストレージ、および照合ウィンドウを強制すべきです。

こちらは、`Grant` 命令を使用して新しいトランザクションを作成する例です。このトランザクションでは、Mouse が Alice に指定された役割 (`role_id`) を付与しています。[完全な例](./permissions.md#register-a-new-role) を確認してください。

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
