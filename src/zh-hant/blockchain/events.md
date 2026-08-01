---
translation_locale: zh-hant
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件 {#events}

在區塊鏈中發生某些事情時發出事件,例如創建新的帳戶或提交一個區塊. 有不同的類型的事件:

- 管道事件
- 數據事件
- 時間事件
- 觸發執行事件

## 管道事件 {#pipeline-events}

一個管道事件包含以下信息:導致事件 (交易或區塊) 的實體類型,其哈希和狀態.狀態可以是 `Validating` (正在進行驗證), `Rejected`,或 `Committed`.如果實體被拒絕,則提供拒絕的理由.

### 在 Taira 試看. {#try-it-on-taira}

檢查公共管道事件流是否安裝:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

爲了一張即時鏡頭,你可以檢查而不讓流量開放.閱讀最近的探索者交易:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

當您需要現場活動時,在終端打開 SSE 路線:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

如果通道開放時沒有提交任何交易,命令可以保持安靜,即使路線是健康的.

## 數據事件 {#data-events}

數據事件在與賬本數據相關的變化發生時發行,如同類,域名,帳戶,資產,資產定義, NFTs,觸發因素,角色等,鏈上配置,執行狀態,證據,機密資產,橋樑或 SORA/Nexus 特定對象.這些類型的事件用於[數據事件過器](./filters.md#data-event-filters).

## 時間事件 {#time-events}

當世界狀態視圖準備好處理 [時間觸發器](./triggers.md#time-triggers)時,時間事件會發射.

## 引發執行事件 {#trigger-execution-events}

當執行 [`ExecuteTrigger`](./instructions.md#executetrigger)指令時發出觸發器執行事件.觸發器完成事件在觸發器操作結束後發出.
