---
translation_locale: zh-hant
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 觸發器 {#triggers}

## 結果 {#outcome}

在 Taira 上註冊一個有限的隨機呼叫觸發器,一次執行它,等待應用最終性,並確認其成功完成從提交區塊歷史.

## 預先條件 {#prerequisites}

- 一個資助簽署者, `taira.client.toml`, `taira.tx-metadata.json`和 `TAIRA_ACCOUNT_ID`從 [連線到 Taira](./connect-to-taira.md).
- Taira 允許註冊`TAIRA_ACCOUNT_ID`的觸發器,並執行所產生的觸發器.相關代幣是`CanRegisterTrigger`由 `authority`和`CanExecuteTrigger`由 `trigger`進行的.
- 如果這些授權無法獲得,請使用生成的本地網路及其管理員客戶端. 觸發器授權主體還需要執行觸發器將執行的指令所要求的所有許可.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## 步驟 {#steps}

### 1. 登記一個以指令支援的觸發器 {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin`接受 JSON 指令陣列. A `Log`指令將這個示例集中在觸發許可權而不是第二個賬本物件的許可權上.

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

觸發器最多可以執行三次. 它的宣告授權主體,而不是執行它的呼叫者,授權了操作內部的指示.

### 2. 在執行前檢查宣告 {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

在支付額外費用之前,確認 I105 許可權,執行過濾器,剩餘的重複和單一 `Log`指令.

### 3. 執行並等待兩層 {#_3-execute-and-wait-for-both-layers}

執行交易和觸發行動有明確的證據. `--wait`等待應用交易最終結局; `--trace`還報告了執行完成診斷.

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

Rust 客戶端構建相同的兩個輸入說明.在這裡, `authority` 是一個`AccountId` 和 `client` 標誌作為該帳戶:

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

## 驗證 {#verify}

掃描已提交的區塊歷史記錄以檢視完成和檢查減少重複數量:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

至少一個完成必須報告成功.觸發器必須保持活躍,剩下兩個執行.沒有成功完成觸發器的成功提交並不是充分的驗證.

## 解決問題 {#troubleshooting}

- 被拒絕註冊意味著簽署者缺乏 `CanRegisterTrigger` 宣告的授權主體機構.執行需要單獨設定範圍的 `CanExecuteTrigger`代幣.
- 一個交易可以到達應用程式,而觸發動作報告失敗.閱讀完成結果和錯誤;然後檢查觸發授權主體的許可證每個嵌入式指令.
- `trigger not found`可能意味著註冊交易被拒絕,或者用於執行的不同 Torii/鏈配置.
- 當重複達到零時, 造更多的重複是另一項特權寫入.不要默默地把這個操作指南改為無限的觸發器.
- 為了清理, `ledger trigger unregister --id "$TRIGGER_ID"`需要 `CanUnregisterTrigger`用於該觸發器加上明確的費用選擇.

## 來源及相關檔案 {#source-and-related-docs}

- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)上進行的隨機呼叫觸發器整合測試
- [在固定的 commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)上進行事件和觸發整合測試
- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)中執行觸發器指令
- [觸發器](/zh-hant/blockchain/triggers.md)
- [觸發器的示例](/zh-hant/blockchain/trigger-examples.md)
- [事件](./stream-events.md)
