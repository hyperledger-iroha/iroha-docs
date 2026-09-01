---
translation_locale: ja
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# トリガー {#triggers}

## 結果 {#outcome}

Taira 上で有限の技術的呼び出しトリガーを登録し、一度実行し、適用された最終性を待機し、最終化されたブロック履歴からその成功した完了を確認してください。

## 前提条件 {#prerequisites}

- 資金提供を受けた暗号署名者、`taira.client.toml`、`taira.tx-metadata.json`、および `TAIRA_ACCOUNT_ID` が [Taira に接続する](./connect-to-taira.md) からです。
- Taira が `TAIRA_ACCOUNT_ID` のトリガーを登録し、結果として発生するトリガーを実行する許可。`CanRegisterTrigger`（`authority` によってスコープされた）および `CanExecuteTrigger`（`trigger` によってスコープされた）が関連するトークンです。
- これらの助成金が利用できない場合は、生成されたローカルネットワークとその管理者クライアントを使用してください。トリガー認証プリンシパルも、トリガーが実行する指示に必要なすべての権限を持っている必要があります。

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## ステップ {#steps}

### 1. 指示に基づいたトリガーを登録する {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` は JSON の命令配列を受け入れます。`Log` の命令は、この例を2つ目のブロックチェーン台帳オブジェクトの権限ではなく、トリガーの認可に焦点を当てたままにします。

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

トリガーは最大で三回実行できます。その宣言された認可プリンシパルが、偶然それを実行するクライアントではなく、アクション内の命令を認可します。

### 2. 実行前に宣言を確認する {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

別の料金を支払う前に、I105 承認の主体、実行フィルター、残りの繰り返し回数、および単一の `Log` 指示を確認してください。

### 3. 両方のレイヤーを実行して待つ {#_3-execute-and-wait-for-both-layers}

実行トランザクションとトリガーアクションには異なる証拠があります。`--wait`は適用済みトランザクションの確定を待ちます。`--trace`もソフトウェアの実行完了診断を報告します。

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust クライアントは同じ2つのタイプの指示を作成します。ここで `authority` は `AccountId` であり、`client` がそのアカウントとして署名します:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## 確認する {#verify}

完了済みブロック履歴をスキャンして完了を確認し、減算された繰り返し回数を検査する:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

少なくとも1つの完了は成功を報告しなければなりません。トリガーは残り2回の実行でアクティブなままでなければなりません。成功した提出でも、成功したトリガーの完了がなければ十分な検証とはなりません。

## トラブルシューティング {#troubleshooting}

- 許可されていないため登録が拒否されましたとは、暗号署名者が宣言された認可プリンシパルに対して `CanRegisterTrigger` を欠いていることを意味します。実行には、別途スコープされた `CanExecuteTrigger` トークンが必要です。
- トリガーアクションが失敗を報告しても、トランザクションは適用済みになる場合があります。完了結果とエラーを読み取り、その後、組み込まれた各命令についてトリガー認可プリンシパルの権限を確認してください。
- `trigger not found` は、登録トランザクションが拒否されたことを意味する場合や、実行のために異なる Torii/チェーン構成が使用されたことを意味する場合があります。
- 繰り返し回数がゼロに達したときに、さらに繰り返しを発行することは、別の特権付き書き込みです。このレシピを無限トリガーに silently（黙って）変更しないでください。
- クリーンアップのために、`ledger trigger unregister --id "$TRIGGER_ID"` にはそのトリガー用の `CanUnregisterTrigger` と明示的な料金の選択が必要です。

## ソースと関連ドキュメント {#source-and-related-docs}

- [技術的な呼び出しによって、固定されたソースコードのリビジョンで統合テストをトリガーする](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [ピン留めされたソースコードのリビジョンでのイベントおよびトリガー統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [ピン留めされたソースコードのリビジョンで命令の実行をトリガーする](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [トリガー](/ja/blockchain/triggers.md)
- [トリガーの例](/ja/blockchain/trigger-examples.md)
- [イベント](./stream-events.md)
