---
translation_locale: zh-hans
translation_source: /cookbook/triggers.md
translation_source_hash: 93080591f5171c7ce25173eb1ef826d6f5ca661a17797be53e90aedab33ed0c3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 触发器 {#triggers}

## 结果 {#outcome}

在 Taira 上注册一个有限的随机调用触发器,一次执行它,等待应用最终性,并确认其成功完成从提交区块历史.

## 预先条件 {#prerequisites}

- 一个资助签署者, `taira.client.toml`, `taira.tx-metadata.json`和 `TAIRA_ACCOUNT_ID`从 [连接到 Taira](./connect-to-taira.md).
- Taira 允许注册`TAIRA_ACCOUNT_ID`的触发器,并执行所产生的触发器.相关代币是`CanRegisterTrigger`由 `authority`和`CanExecuteTrigger`由 `trigger`进行的.
- 如果这些补贴无法获得,请使用生成的本地网络及其管理员客户端. 触发器权威还需要执行触发器将执行的指令所要求的所有许可.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## 步骤 {#steps}

### 1. 登记一个以指令支持的触发器 {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin`接受 JSON 指令阵列. A `Log`指令将这个示例集中在触发权限而不是第二个账本对象的权限上.

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

触发器最多可以运行三次. 它的声明权威,而不是电话打来执行它的人,授权了操作内部的指示.

### 2. 在执行前检查声明 {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

在支付额外费用之前,确认 I105 权限,执行过器,剩余的重复和单一 `Log`指令.

### 3. 执行并等待两层 {#_3-execute-and-wait-for-both-layers}

执行交易和触发行动有明确的证据. `--wait`等待应用交易最终结局; `--trace`还报告了运行完成诊断.

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

Rust 客户端构建相同的两个输入说明.在这里, `authority` 是一个`AccountId` 和 `client` 标志作为该帐户:

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

## 验证 {#verify}

扫描已提交的区块历史记录以查看完成和检查减少重复数量:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

至少一个完成必须报告成功.触发器必须保持活跃,剩下两个执行.没有成功完成触发器的成功提交并不是充分的验证.

## 解决问题 {#troubleshooting}

- 被拒绝注册意味着签署者缺乏 `CanRegisterTrigger` 声明的权威机构.执行需要单独设定范围的 `CanExecuteTrigger`代币.
- 一个交易可以到达应用程序,而触发动作报告失败.阅读完成结果和错误;然后检查触发权威的许可证每个嵌入式指令.
- `trigger not found`可能意味着注册交易被拒绝,或者用于执行的不同 Torii/链配置.
- 当重复达到零时, 造更多的重复是另一个特权的写法.不要默默地把这个食谱改为无限的触发器.
- 为了清理, `ledger trigger unregister --id "$TRIGGER_ID"`需要 `CanUnregisterTrigger`用于该触发器加上明确的费用选择.

## 来源及相关文件 {#source-and-related-docs}

- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/triggers/by_call_trigger.rs)上进行的随机调用触发器集成测试
- [在固定的 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events_and_triggers.rs)上进行事件和触发集成测试
- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)中执行触发器指令
- [触发器](/zh-hans/blockchain/triggers.md)
- [触发器的示例](/zh-hans/blockchain/trigger-examples.md)
- [事件](./stream-events.md)
