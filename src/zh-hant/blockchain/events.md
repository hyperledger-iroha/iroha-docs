---
translation_locale: zh-hant
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件 {#events}

在區塊鏈中發生某些事情時發出事件,例如建立新的帳戶或提交一個區塊. 有不同的型別的事件:

- 管道事件
- 資料事件
- 時間事件
- 觸發執行事件

## 管道事件 {#pipeline-events}

當交易被提交、執行或寫入已提交區塊時，會發出管線事件。管線事件包含以下資訊：引發事件的實體（交易或區塊）型別、其雜湊及狀態。狀態可以是 `Validating`（正在驗證）、`Rejected` 或 `Committed`。如果實體遭到拒絕，還會提供拒絕原因。

### 在 Taira 試看. {#try-it-on-taira}

檢查公共管道事件流是否安裝:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

為了一張即時鏡頭,你可以檢查而不讓流量開放.閱讀最近的探索者交易:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

當您需要現場活動時,在終端開啟 SSE 路線:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

如果通道開放時沒有提交任何交易,命令可以保持安靜,即使路線是健康的.

## 資料事件 {#data-events}

當帳本資料發生相關變更時，系統會發出資料事件，例如對等節點、網域、帳戶、資產、資產定義、NFTs、觸發器、角色、鏈上設定、執行器狀態、證明、機密資產、橋接或 SORA/Nexus 特有物件的變更。這些事件類型用於[資料事件篩選器](./filters.md#data-event-filters)。

## 時間事件 {#time-events}

當世界狀態檢視準備處理[時間觸發器](./triggers.md#time-triggers)時，系統會發出時間事件。

## 引發執行事件 {#trigger-execution-events}

當執行 [`ExecuteTrigger`](./instructions.md#executetrigger)指令時發出觸發器執行事件.觸發器完成事件在觸發器操作結束後發出.
