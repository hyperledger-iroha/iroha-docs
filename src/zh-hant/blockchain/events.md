---
translation_locale: zh-hant
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件 {#events}

某些事件發生在區塊內,
建立新的帳戶或封鎖.
事件的情況:

- 管道事件
- 數據事件
- 時間事件
- 引發執行事件

## 管道事件 {#pipeline-events}

在交易提交,執行或
道事件包含以下資訊:
造成事件 (交易或封鎖) 的實體類型,其哈希
這種狀態可能是 `Validating` (正在進行核實),
`Rejected`, 或是 `Committed`. 如果被拒絕,
否則提供拒絕.

### 試著使用 Taira {#try-it-on-taira}

檢查公共管道事件流是否安裝:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

您可以在不開的情況下查看即時拍照,
探索者交易:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

打開這個 SSE 需要現場活動時,

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

如果在開啟的時間內沒有提交任何交易,
雖然路線很健康,

## 數據事件 {#data-events}

數據事件會發出,
該項目的使用方式: NFTs, 引發器,
角色,連鎖配置,執行狀態,證據,機密資產,
橋,或 SORA/Nexus 這些事件在
[數據事件過濾器](./filters.md#data-event-filters).

## 時間上的事件 {#time-events}

當世界觀準備好處理時,
[時間導致器](./triggers.md#time-triggers).

## 導致執行事件 {#trigger-execution-events}

引發執行事件會發出,
[`ExecuteTrigger`](./instructions.md#executetrigger) 指示是
導致完成事件在導致行動後發出
終於完成了.
