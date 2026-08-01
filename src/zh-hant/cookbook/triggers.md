---
translation_locale: zh-hant
translation_source: /cookbook/triggers.md
translation_source_hash: 93080591f5171c7ce25173eb1ef826d6f5ca661a17797be53e90aedab33ed0c3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 觸發器 {#triggers}

## 結果 {#outcome}

在 Taira 上註冊一個有限的隨機調用觸發器,一次執行它,等待應用最終性,並確認其成功完成從提交區塊歷史.

## 預先條件 {#prerequisites}

- 一個資助簽署者, `taira.client.toml`, `taira.tx-metadata.json`和 `TAIRA_ACCOUNT_ID`從 [連接到 Taira](./connect-to-taira.md).
- Taira 允許註冊`TAIRA_ACCOUNT_ID`的觸發器,並執行所產生的觸發器.相關代幣是`CanRegisterTrigger`由 `authority`和`CanExecuteTrigger`由 `trigger`進行的.
- 如果這些補貼無法獲得,請使用生成的本地網絡及其管理員客戶端. 觸發器權威還需要執行觸發器將執行的指令所要求的所有許可.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## 步驟 {#steps}

### 1. 登記一個以指令支持的觸發器 {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin`接受 JSON 指令陣列. A `Log`指令將這個示例集中在觸發權限而不是第二個賬本對象的權限上.

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

觸發器最多可以運行三次. 它的聲明權威,而不是電話打來執行它的人,授權了操作內部的指示.

### 2. 在執行前檢查聲明 {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

在支付額外費用之前,確認 I105 權限,執行過器,剩餘的重複和單一 `Log`指令.

### 3. 執行並等待兩層 {#_3-execute-and-wait-for-both-layers}

執行交易和觸發行動有明確的證據. `--wait`等待應用交易最終結局; `--trace`還報告了運行完成診斷.

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

Rust 客戶端構建相同的兩個輸入說明.在這裏, `authority` 是一個`AccountId` 和 `client` 標誌作爲該帳戶:

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

掃描已提交的區塊歷史記錄以查看完成和檢查減少重複數量:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

至少一個完成必須報告成功.觸發器必須保持活躍,剩下兩個執行.沒有成功完成觸發器的成功提交並不是充分的驗證.

## 解決問題 {#troubleshooting}

- 被拒絕註冊意味着簽署者缺乏 `CanRegisterTrigger` 聲明的權威機構.執行需要單獨設定範圍的 `CanExecuteTrigger`代幣.
- 一個交易可以到達應用程序,而觸發動作報告失敗.閱讀完成結果和錯誤;然後檢查觸發權威的許可證每個嵌入式指令.
- `trigger not found`可能意味着註冊交易被拒絕,或者用於執行的不同 Torii/鏈配置.
- 當重複達到零時, 造更多的重複是另一個特權的寫法.不要默默地把這個食譜改爲無限的觸發器.
- 爲了清理, `ledger trigger unregister --id "$TRIGGER_ID"`需要 `CanUnregisterTrigger`用於該觸發器加上明確的費用選擇.

## 來源及相關文件 {#source-and-related-docs}

- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/triggers/by_call_trigger.rs)上進行的隨機調用觸發器集成測試
- [在固定的 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events_and_triggers.rs)上進行事件和觸發集成測試
- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)中執行觸發器指令
- [觸發器](/zh-hant/blockchain/triggers.md)
- [觸發器的示例](/zh-hant/blockchain/trigger-examples.md)
- [事件](./stream-events.md)
