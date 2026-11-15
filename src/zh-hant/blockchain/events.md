---
translation_locale: zh-hant
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# 事件 {#events}

在區塊鏈中發生某些事情時發出事件,例如建立新的帳戶或提交一個區塊. 有不同的型別的事件:

- 管道事件
- 資料事件
- 時間事件
- 觸發執行事件

## 管道事件 {#pipeline-events}

交易與區塊在管線中流轉時會發出管線事件。交易事件包含交易雜湊、區塊高度、通道與資料空間 ID，以及一個狀態：`Queued`、`Expired`、`Approved`，或附帶拒絕原因的 `Rejected`。區塊事件包含區塊標頭與一個狀態：`Created`、`Approved`、附帶原因的 `Rejected`、`Committed` 或 `Applied`。

### 在 Taira 試看. {#try-it-on-taira}

檢查公共管道事件流是否安裝:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

為了一張即時鏡頭,你可以檢查而不讓流量開放.閱讀最近的探索者交易:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

當您需要現場活動時,在終端開啟 SSE 路線:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

如果通道開放時沒有提交任何交易,命令可以保持安靜,即使路線是健康的.

## 資料事件 {#data-events}

當帳本資料發生相關變更時，系統會發出資料事件，例如對等節點、網域、帳戶、資產、資產定義、NFTs、觸發器、角色、鏈上設定、執行器狀態、證明、機密資產、橋接或 SORA Nexus 特有物件的變更。這些事件類型用於[資料事件篩選器](./filters.md#data-event-filters)。

## 時間事件 {#time-events}

當世界狀態檢視準備處理[時間觸發器](./triggers.md#time-triggers)時，系統會發出時間事件。

## 引發執行事件 {#trigger-execution-events}

當執行 [`ExecuteTrigger`](./instructions.md#executetrigger)指令時發出觸發器執行事件.觸發器完成事件在觸發器操作結束後發出.
