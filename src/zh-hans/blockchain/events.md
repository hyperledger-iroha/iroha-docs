---
translation_locale: zh-hans
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件 {#events}

在区块链中发生某些事情时,事件发射.
创建新账户或提交一个区块.
事件:

- 管道事件
- 数据事件
- 时间事件
- 触发执行事件

## 管道事件 {#pipeline-events}

在交易提交,执行或执行时发出管道事件
一个管道事件包含以下信息:
导致事件 (交易或区块) 的实体类型,其哈希
状态可能是 `Validating` (正在进行验证),
`Rejected`, 或 `Committed`. 如果一个实体被拒绝,
提供拒绝.

### 试着. Taira {#try-it-on-taira}

检查公共管道事件流是否安装:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

您可以在没有开放的流中查看一张快照,
探索者交易:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

打开 SSE 需要现场活动时,在终端的路线:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

如果没有交易提交,当流开放时,命令可以停下来
虽然路线是健康的,但它很安静.

## 数据事件 {#data-events}

数据事件发行时与本书数据相关的变化
作为同行,域名,账户,资产,资产定义, NFTs, 触发器,
角色,连锁配置,执行状态,证据,机密资产
桥梁或 SORA/Nexus 这些类型的事件用于
[数据事件过器](./filters.md#data-event-filters).

## 时间事件 {#time-events}

当世界观准备好处理时,时间事件发射.
[时间触发器](./triggers.md#time-triggers).

## 触发执行事件 {#trigger-execution-events}

引发执行事件在
[`ExecuteTrigger`](./instructions.md#executetrigger) 指令是
触发器完成事件在触发器操作后发射
结束了.
