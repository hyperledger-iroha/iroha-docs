---
translation_locale: ja
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 触発機 {#triggers}

## 成果 {#outcome}

Taira に限られたバイ・コールトリガーを登録し,一度実行して,適用終了を待て,コミットブロック履歴から成功の完了を確認する.

## 必須条件 {#prerequisites}

- 資金調達した署名者 `taira.client.toml`, `taira.tx-metadata.json`, そして `TAIRA_ACCOUNT_ID` から [接続する Taira](./connect-to-taira.md).
- Taira 引き金を登録する許可 `TAIRA_ACCOUNT_ID` 関連トークンは, `CanRegisterTrigger` 対象となる `authority` そして `CanExecuteTrigger` 対象となる `trigger`.
- これらの補助金は利用できない場合は,生成されたローカルネットワークとその管理者クライアントを使用します.トリガー権限はまた,トリガーが実行する指示によって要求されるすべての許可を必要とします.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## ステップ {#steps}

### 1. 指示付きの触発機を登録する {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` は JSON の指示配列を受け入れます. A `Log` の指示では,この例は第二のレジャーオブジェクトの許可よりも触発権限に焦点を当てています.

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

触発機は最大3回実行できます.その宣言された権限は,それを実行する呼び出し者ではなく,動作内の指示を許可します.

### 2. 申告を執行する前に確認する {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

I105 の権限,実行フィルター,残りの繰り返し,および単一の `Log`指示を追加料金を支払う前に確認してください.

### 3. 両層を実行し,待ちます {#_3-execute-and-wait-for-both-layers}

実行トランザクションとトリガーアクションには明確な証拠がある. `--wait`は,適用されたトランザクションの最終性を待っている; `--trace`はまた,ランタイム完了診断を報告する.

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

Rust クライアントは同じ2つの入力指示を作成します.ここで `authority` は,そのアカウントとして`AccountId`と `client` のサインです:

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

完了のために,コミットブロック履歴をスキャンし,減量された重複数を確認する.

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

少なくとも1つの完了が成功を報告しなければならない.トリガーは2回の実行が残ったままにアクティブでなければならない.成功した送信が成功したトリガーの完成がなければ,十分な検証ではない.

## 問題を解く {#troubleshooting}

- 登録が拒否された場合,署名者が申告した当局に `CanRegisterTrigger` が欠けていることを意味します.実行には別途対象となる `CanExecuteTrigger` トークンが必要です.
- トランザクションは,トリガーアクションが失敗を報告する間に Applied に到達できます.完了結果とエラーを読み,その後すべての埋め込み指示のトリガー権限を確認します.
- `trigger not found`は,登録取引が拒否されたか,または実行のために別の Torii/チェーン設定が使用されたかを意味する可能性があります.
- 繰り返し が ゼロ に 達 する 時,さらに 繰り返す こと を 作る の は もう 一つ の 特権 的 な 書い物 です.この レシピ を 無限に 引き出せる よう に し て 黙っ て 変更 さ れ ませ ん.
- 清掃のために, `ledger trigger unregister --id "$TRIGGER_ID"` はそのトリガーと明示的な料金の選択のために `CanUnregisterTrigger` を要求します.

## ソースおよび関連文書 {#source-and-related-docs}

- [固定された commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)でのバイコールトリガー統合テスト
- [固定された commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)でイベントとトリガー統合テスト
- [](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs) ピンされた commit で触発指示を実行する
- [触発機](/ja/blockchain/triggers.md)
- [トリガーの例](/ja/blockchain/trigger-examples.md)
- [事件](./stream-events.md)
