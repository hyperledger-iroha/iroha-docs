---
translation_locale: zh-hans
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# 事件 {#events}

在区块链中发生某些事情时发出事件,例如创建新的帐户或提交一个区块. 有不同的类型的事件:

- 管道事件
- 数据事件
- 时间事件
- 触发执行事件

## 管道事件 {#pipeline-events}

交易和区块在流水线中流转时会发出流水线事件。交易事件包含交易哈希、区块高度、执行通道和数据空间 ID，以及一个状态：`Queued`、`Expired`、`Approved`，或附带拒绝原因的 `Rejected`。区块事件包含区块头和一个状态：`Created`、`Approved`、附带原因的 `Rejected`、`Committed` 或 `Applied`。

### 在 Taira 试看. {#try-it-on-taira}

检查公共管道事件流是否安装:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

为了一张即时镜头,你可以检查而不让流量开放.阅读最近的探索者交易:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

当您需要现场活动时,在终端打开 SSE 路线:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

如果通道开放时没有提交任何交易,命令可以保持安静,即使路线是健康的.

## 数据事件 {#data-events}

当账本数据发生相关变化时，系统会发出数据事件，例如对等节点、域、账户、资产、资产定义、NFTs、触发器、角色、链上配置、执行器状态、证明、机密资产、桥接或 SORA Nexus 特有对象的变化。这些事件类型用于[数据事件过滤器](./filters.md#data-event-filters)。

## 时间事件 {#time-events}

当世界状态视图准备处理[时间触发器](./triggers.md#time-triggers)时，系统会发出时间事件。

## 引发执行事件 {#trigger-execution-events}

当执行 [`ExecuteTrigger`](./instructions.md#executetrigger)指令时发出触发器执行事件.触发器完成事件在触发器操作结束后发出.
