---
translation_locale: zh-hans
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件 {#events}

在区块链中发生某些事情时发出事件,例如创建新的帐户或提交一个区块. 有不同的类型的事件:

- 管道事件
- 数据事件
- 时间事件
- 触发执行事件

## 管道事件 {#pipeline-events}

一个管道事件包含以下信息:导致事件 (交易或区块) 的实体类型,其哈希和状态.状态可以是 `Validating` (正在进行验证), `Rejected`,或 `Committed`.如果实体被拒绝,则提供拒绝的理由.

### 在 Taira 试看. {#try-it-on-taira}

检查公共管道事件流是否安装:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

为了一张即时镜头,你可以检查而不让流量开放.阅读最近的探索者交易:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

当您需要现场活动时,在终端打开 SSE 路线:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

如果通道开放时没有提交任何交易,命令可以保持安静,即使路线是健康的.

## 数据事件 {#data-events}

数据事件在与账本数据相关的变化发生时发行,如同类,域名,帐户,资产,资产定义, NFTs,触发因素,角色等,链上配置,执行状态,证据,机密资产,桥梁或 SORA/Nexus 特定对象.这些类型的事件用于[数据事件过器](./filters.md#data-event-filters).

## 时间事件 {#time-events}

当世界状态视图准备好处理 [时间触发器](./triggers.md#time-triggers)时,时间事件会发射.

## 引发执行事件 {#trigger-execution-events}

当执行 [`ExecuteTrigger`](./instructions.md#executetrigger)指令时发出触发器执行事件.触发器完成事件在触发器操作结束后发出.
