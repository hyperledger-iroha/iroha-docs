---
translation_locale: ja
translation_source: /blockchain/transactions.md
translation_source_hash: 91c06ab61c7f8ec96554bc89b31b2f281bb3a7d7edd484defe61dcde5a3fb710
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

ここまでは読み取り専用の操作です。トランザクションの送信には、署名済みの Norito エンベロープ、正しいチェーン ID とネットワーク ID、明示的な手数料支払者、フォーセットから資金を受け取った Taira アカウントが必要です。

Taira で手数料が発生する例を試すには、[Taira でテストネット XOR を取得する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)に記載された、事前準備を伴うフォーセットの手順で署名者に資金を供給し、手数料資産の残高を確認してください。

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

フォーセットの経路が `502` を返した場合は、トランザクション自体を調査する前に、しばらく待って再試行してください。

次に、トランザクションの送信時に手数料支払者を選択します。`--fee-payer authority` を指定すると署名アカウントが支払い、CLI は署名前に Taira の手数料資産で正確な手数料を見積もります。

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## オフライントランザクション {#offline-transactions}

Iroha には2つのオフライントランザクションワークフローがあります：

- オフライン署名は、署名デバイスが切断されている間に通常の署名済みトランザクションを作成します。このトランザクションは、オンラインクライアントが署名済みデータコンテナを Torii に提出するまで処理されないため、依然として正しいチェーンID、認可プリンシパル、権限、手数料が必要です。およびトランザクションの寿命。
- **Kagemusha オフライン現金**では、登録済みでハードウェアに保護されたウォレットにオンライン時に価値をロードします。両方のウォレットがオフラインの間もウォレット間で支払いができ、再びオンラインになったときに残りの価値を台帳上のアカウントへアンロードできます。

Torii が公開する Kagemusha の経路は `POST /v1/kagemusha/enrollment` の一つです。アカウント認証済みの `application/x-norito` 登録フレームを受け付け、キャッシュしてはならない非公開の応答を返します。このライフサイクルの台帳側の処理では、`KagemushaWalletLedgerV1` 命令を含む通常の署名済みトランザクションを使います。

| 操作 | 目的 |
| --- | --- |
| `Activate` | 登録済みウォレットを有効にする。ネイティブのブートストラップ検証は必須 |
| `IssueLoad` | 支払者の残高を引き落とし、ウォレットの次の Load をアトミックに記録する |
| `Unload` | 完全な Unload 請求に対し、その請求に結び付けられたアカウントへ最大一度だけ支払う |
| `ClaimFee` | 完全な手数料請求に対し、固定された受益者へ支払う |
| `Abandon` | 未使用の登録を放棄する |

典型的な流れは次の通りです：

1. 型付き API を備えた Swift または Android のウォレットで `/v1/kagemusha/enrollment` を通じて登録し、その後ウォレットを有効にします。
2. `IssueLoad` トランザクションを送信します。実行時には、次の Load の期待通番と、リクエスト ID がゼロでないことを検査するため、古い要求や内容を変更した再試行は失敗します。応答を受け取れなかった場合は、別の Load に署名せず、元の Load の受領記録を読み取ってください。
3. 両方のウォレットがオフラインの間に、ローカルで支払いを交換して検証します。各送金の受領を通知する前に、ウォレットの状態を永続化してください。
4. ウォレットが再びオンラインになったら、Unload 請求を送信してファイナリティを待ちます。

ブロックチェーン台帳は、ノートの状態がオンラインのライフサイクルを通じて戻るまで、矛盾するオフラインの引き渡しを検知することはできません。したがって、ウォレットおよびオペレーターのポリシーは、価値の上限、有効期限、受け入れ可能な発行者、耐久性のあるローカルストレージ、および照合ウィンドウを強制すべきです。

こちらは、`Grant` 命令を使用して新しいトランザクションを作成する例です。このトランザクションでは、Mouse が Alice に指定された役割 (`role_id`) を付与しています。[完全な例](./permissions.md#register-a-new-role) を確認してください。

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
