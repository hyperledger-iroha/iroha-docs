---
translation_locale: zh-hant
translation_source: /reference/torii-endpoints.md
translation_source_hash: 9bec41b1b419e252fdcff8328e7950a294bdad3ac40112a5a7f2ce451d19e9cb
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Torii 端點 {#torii-endpoints}

Torii 是 Iroha 3 的 HTTP、SSE 與 WebSocket 閘道，同時提供面向分類帳的 APIs 及操作員端點。

目前的通訊協定規則如下：

- 規範二進位格式是 **Norito**
- 傳送 `Accept: application/json` 時，許多端點也支援 JSON
- 指標以 Prometheus 格式公開

格式細節、內容協商、版面配置旗標、結構描述雜湊及 Norito RPC 指引，請參閱 [Norito 參考](/zh-hant/reference/norito.md)。

## 常用端點 {#common-endpoints}

| 端點 | 格式 | 用途 |
| --- | --- | --- |
| `POST /transaction` | Norito | 提交已簽署的交易 |
| `POST /query` | Norito | 提交已簽署的查詢 |
| `GET /events` | WebSocket | 訂閱事件資料流 |
| `GET /block/stream` | WebSocket | 串流已完成共識提交的區塊 |
| `GET /peers` | JSON | Torii 公開的對等節點清單 |
| `GET /health` | JSON | 輕量型存活端點 |
| `GET /api_version` | JSON | 預設 API 版本 |
| `GET /status` | JSON | 供操作員使用的高階狀態摘要 |
| `GET /metrics` | Prometheus | Prometheus 抓取端點 |
| `GET /schema` | JSON | 節點提供的資料模型結構描述快照 |
| `GET /openapi` or `GET /openapi.json` | JSON | 作用中 Torii HTTP 路由的 OpenAPI 文件 |
| `GET /v1/parameters` | JSON | 節點參數快照 |
| `GET /v1/node/capabilities` | JSON | 節點能力及資料模型中繼資料 |
| `GET /v1/api/versions` | JSON | 支援的 Torii API 版本 |
| `GET /v1/events/sse` | SSE | 長時間連線用戶端的事件資料流 |
| `GET /v1/time/now` | JSON | 節點牆上時鐘快照 |
| `GET /v1/time/status` | JSON | 時間同步狀態 |

對執行中的節點而言，`/openapi` 是權威的端點清單。確切介面取決於建置功能與執行階段組態，因此產生的用戶端應以即時 OpenAPI 文件為準，不要依賴手動複製的路由清單。使用 [Torii API 主控台](/zh-hant/reference/torii-api-console.md)可載入該即時文件、測試 JSON 路由、複製 curl 請求，並依目前結構描述產生用戶端程式碼。

## 試用 Taira 即時路由 {#try-live-taira-routes}

公開 Taira 測試網公開與應用程式用戶端相同的 Torii JSON 介面，可供唯讀探索。下列命令不需要金鑰：

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

嘗試讀取目前世界狀態中的資源：

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

若公開測試網路路由傳回 `502`、逾時或回報佇列已飽和，請先視為端點可用性問題並稍後重試，再開始除錯用戶端程式碼。

## 共識與執行階段端點 {#consensus-and-runtime-endpoints}

| 端點 | 格式 | 用途 |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | 最近的提交憑證摘要 |
| `GET /v1/sumeragi/validator-sets` | JSON | 驗證者集合歷程 |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | 指定區塊高度的驗證者集合 |
| `GET /v1/sumeragi/status` | Norito or JSON | 詳細共識狀態快照 |
| `GET /v1/sumeragi/status/sse` | SSE | 持續的共識狀態資料流 |
| `GET /v1/sumeragi/leader` | JSON | 目前領導者資訊 |
| `GET /v1/sumeragi/qc` | Norito or JSON | 最新的法定人數憑證摘要 |
| `GET /v1/sumeragi/checkpoints` | JSON | 共識檢查點摘要 |
| `GET /v1/sumeragi/consensus-keys` | JSON | 作用中的共識金鑰 |
| `GET /v1/sumeragi/bls_keys` | JSON | 作用中的 BLS 共識金鑰 |
| `GET /v1/sumeragi/phases` | JSON | 最新的各階段延遲樣本 |
| `GET /v1/sumeragi/rbc` | JSON | RBC 工作階段及輸送量指標 |
| `GET /v1/sumeragi/rbc/sessions` | JSON | 作用中的 RBC 工作階段快照 |
| `GET /v1/sumeragi/pacemaker` | JSON | Pacemaker 狀態 |
| `GET /v1/sumeragi/params` | JSON | 目前的鏈上 Sumeragi 參數 |
| `GET /v1/sumeragi/collectors` | JSON | 確定性的收集者計畫快照 |
| `GET /v1/sumeragi/key-lifecycle` | JSON | 共識金鑰生命週期狀態 |
| `GET /v1/sumeragi/telemetry` | JSON | 共識遙測快照 |
| `GET /v1/sumeragi/evidence` | JSON | 證據記錄，可選擇依查詢字串篩選 |
| `GET /v1/sumeragi/evidence/count` | JSON | 證據記錄數量 |
| `POST /v1/sumeragi/evidence/submit` | JSON | 提交共識證據 |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito or JSON | 指定區塊雜湊的 Commit QC 記錄 |
| `GET /v1/runtime/abi/active` | JSON | 作用中的執行階段 ABI 描述器 |
| `GET /v1/runtime/abi/hash` | JSON | 作用中的執行階段 ABI 雜湊 |
| `GET /v1/runtime/metrics` | JSON | 執行階段指標快照 |
| `GET /v1/runtime/upgrades` | JSON | 執行階段升級清單 |
| `POST /v1/runtime/upgrades/propose` | JSON | 提議執行階段升級 |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | 啟用已提議的執行階段升級 |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | 取消已提議的執行階段升級 |

## 應用程式與 SORA 路由族群 {#app-and-sora-route-families}

以面向應用程式的功能集建置 Torii 時，Torii 會為區塊瀏覽器、SORA 服務、橋接流程、證明及儲存公開額外的 JSON 族群。並非每種網路設定檔都會啟用所有族群。

| 路由族群 | 用途 |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON 讀取、查詢輔助函式、上線輔助函式，以及資產組合或持有人檢視 |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT、實體資產及機密資產檢視 |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | 名稱、別名及識別碼解析 |
| `/v1/explorer/*` | 面向區塊瀏覽器的帳戶、資產、區塊、交易、指令、指標及資料流檢視 |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | 交易歷程、管線復原或狀態，以及 ISO 20022 輔助函式 |
| `/v1/contracts/*` | 合約程式碼、部署、套件、呼叫、檢視、事件、活動、Rollup 及狀態路由 |
| `/v1/multisig/*`, `/v1/controls/*` | 多重簽章提案、核准及轉帳控制輔助函式 |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | 最終性、狀態證明、區塊證明、證明保留及證明查詢路由 |
| `/v1/da/*` | 資料可用性擷取、資訊清單、證明政策、承諾及釘選意圖 |
| `/v1/zk/*` | ZK 根、證明驗證、IVM 證明、投票計數、驗證金鑰、證明記錄及附件 |
| `/v1/gov/*`, `/v1/ministry/*` | 治理提案、選票、委員會狀態、受保護命名空間、議程提案、施行及定案 |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus 通道、資料空間及跨鏈證明輔助函式 |
| `/v1/musubi/*` | Musubi 套件登錄讀取及指令建構器 |
| `/v1/subscriptions/*` | 訂閱方案、訂閱生命週期、用量及計費輔助函式 |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS 提供者探索、容量證明、釘選、儲存擷取及公開內容提供 |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud 服務生命週期、私有運算／模型流程、公開探索及託管應用程式路由 |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha Connect 工作階段、WebSocket 傳輸、VPN 工作階段、設定檔及收據 |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | App API 繫結及由套件／CID 支援的內容路由 |
| `/v1/operator/*`, `/v1/mcp` | 操作員驗證及原生 MCP JSON-RPC 橋接器 |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | 離線就緒狀態、儲存庫協議、資料空間資訊清單及 [RAM-LFE 輔助函式](/zh-hant/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | 協作、Webhook、推播通知及即時遙測整合 |

## ISO 20022 橋 {#iso-20022-bridge}

面向應用程式的 API 與橋接執行階段啟用時，Torii 會在 `/v1/iso20022/*` 公開 ISO 20022 橋接器。此橋接器刻意限制範圍：它不是通用 ISO 20022 清算閘道，而是受支援的子集，用來將指定付款訊息轉換為已簽署的 Iroha 轉帳，並追蹤其分類帳狀態。

### Torii ISO 20022 端點 {#torii-iso-20022-endpoints}

| 方法與端點 | 用途 |
| --- | --- |
| `POST /v1/iso20022/pacs008` | 提交 FI-to-FI 客戶貸記轉帳，並建立相符的 Iroha 資產轉帳 |
| `POST /v1/iso20022/pacs009` | 提交用於付款對付款（PvP）或證券相關現金撥款的 FI-to-FI 貸記轉帳 |
| `POST /v1/iso20022/pacs002` | 提交付款狀態報告 |
| `POST /v1/iso20022/pacs004` | 提交付款退回訊息 |
| `POST /v1/iso20022/camt056` | 提交付款取消請求 |
| `POST /v1/iso20022/sese023` | 提交證券結算指示 |
| `POST /v1/iso20022/sese024` | 提交證券結算狀態訊息 |
| `POST /v1/iso20022/sese025` | 提交證券結算確認 |
| `POST /v1/iso20022/colr012` | 提交擔保品替換訊息 |
| `GET /v1/iso20022/messages/{msg_id}` | 讀取單一訊息的規範橋接記錄 |
| `GET /v1/iso20022/audit/messages` | 讀取可偵測竄改的訊息稽核資訊清單 |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | 將目前付款狀態轉譯為 `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | 將目前付款退回內容轉譯為 `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | 將目前取消處理結果轉譯為 `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | 將目前結算狀態轉譯為 `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | 將目前結算確認轉譯為 `sese.025` XML |

`pacs.008` 提交內容必須提供訊息 ID、銀行間結算金額、幣別、結算日期、債務人與債權人的 IBANs，以及債務人與債權人的 BICs。若已設定參照資料，橋接器也會在產生的交易進入管線前，檢查 BIC、IBAN 及 ISO 4217 幣別的對照關係。

`pacs.009` 提交內容必須提供業務訊息 ID、訊息定義 ID、建立時間、銀行間結算金額、幣別、結算日期、指示代理人與受指示代理人的 BICs，以及債務人與債權人的 IBANs。若訊息包含 `Purp`，橋接器目前只接受證券用途的資金：`Purp=SECU`。

`pacs.008` 與 `pacs.009` 提交端點接受 XML ISO 封套，或橋接器測試使用的扁平欄位格式。選用的 `SplmtryData` 欄位可固定目標 Iroha 分類帳、來源與目標帳戶 IDs 或位址，以及資產定義 ID。回應為 `202 Accepted`，並包含 `message_id`、`transaction_hash`、`status`、`pacs002_code` 及解析後的分類帳／帳戶／資產內容。

### 其他剖析與對應支援 {#additional-parser-and-mapping-support}

IVM ISO 輔助函式也會驗證並具現化下列訊息族群，以進行封套驗證、結算對應或下游對帳。這些訊息族群沒有獨立的 Torii 路由。

| 訊息族群 | 目前支援 |
| --- | --- |
| `head.001` | ISO 封套的業務應用程式標頭驗證，包括 `BizMsgIdr`、`MsgDefIdr`、建立時間，以及選用的傳送者／接收者 BIC 欄位 |
| `pacs.007`, `pacs.028`, `pacs.029` | 付款沖銷、狀態請求，以及調查處理結果／狀態剖析 |
| `pain.001`, `pain.002` | 客戶付款發起及付款狀態報告驗證 |
| `camt.052`, `camt.053`, `camt.054` | 帳戶報告、對帳單及通知驗證 |

## Kaigi 工作階段 {#kaigi-sessions}

Kaigi 在 SORA Nexus 上提供付費的即時音訊／視訊房間。當應用程式需要由帳本支援的工作階段建立、名單變更、中繼資訊清單、加密信令與用量計量，而不是將所有會議狀態保留在鏈下時，請使用 Kaigi。

面向帳本的生命週期如下：

- `CreateKaigi`：在某個網域下建立通話，並儲存其政策、排程、中繼資料及選用的中繼資訊清單。
- `JoinKaigi` 與 `LeaveKaigi`：更新通話名單。在私密模式中，參與者使用承諾、nullifier 與名單證明，而不直接暴露參與者的帳戶 IDs。
- `RecordKaigiUsage`：附加經計量的持續時間與 Gas 總量。
- `EndKaigi`：關閉工作階段並記錄最終時間戳記。

啟用應用程式 API 與遙測功能時，Torii 會在 `/v1/kaigi/relays`、`/v1/kaigi/relays/{relay_id}`、`/v1/kaigi/relays/health` 與 `/v1/kaigi/relays/events` 公開中繼遙測資料。工作階段狀態會透過 `KaigiRosterSummary`、`KaigiRelayManifestUpdated`、`KaigiRelayHealthUpdated` 與 `KaigiUsageSummary` 等 Kaigi 網域事件呈現。

### CLI 冒煙測試 {#cli-smoke-test}

若要在連接 UI 前確認 Torii 端點可接受 Kaigi 交易，請先使用 `iroha kaigi` CLI。快速入門命令會對目前使用中的 Torii 端點建立暫時房間，並輸出包含通話識別碼、加入命令與 SoraNet spool 提示的摘要：

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

對於指令碼流程，請明確管理房間的生命週期：

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

若中繼可在沒有檢視者票證的情況下公開房間，請使用 `--room-policy public`；若出口必須要求檢視者驗證身分，則使用 `--room-policy authenticated`。只有在網路已設定 Kaigi 名單與用量驗證金鑰後，才能使用 `--privacy-mode zk-roster-v1`；否則，加入、離開與私密用量記錄都會在確定性驗證期間失敗。

### 使用 JavaScript 示範應用程式測試 {#testing-with-the-javascript-demo}

使用 [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) 桌面示範應用程式進行端對端錢包測試。此示範是 Electron 與 Vue 應用程式，透過本機 `@iroha/iroha-js` 繫結直接與 Torii 通訊，並包含支援瀏覽器原生一對一媒體的 `/kaigi` 路由。

請搭配 Iroha 原始碼存放庫中的 [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) 使用此示範應用程式。示範會透過 `file:../iroha/javascript/iroha_js` 固定 SDK，因此請將兩個簽出目錄保持為下列同層配置：

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

請使用 Node.js 20 或更新版本及 Rust 工具鏈，以便建置原生 `iroha_js_host` 模組。變更 SDK 原始碼後，請在同層的 Iroha 簽出目錄中重新建置；乾淨的套件配置不包含 `npm run build:native` 所需的 Cargo 工作區。

若要進行受控測試，請讓示範應用程式連線至支援 Kaigi 的 Torii 端點：

1. 啟動已啟用 SORA/Kaigi 應用程式對外 APIs 的 Iroha 節點，或使用公開了所需 Kaigi 介面的公用端點。
2. 先以 `/health` 檢查基本連線能力，再以 `/openapi` 或 `/openapi.json` 檢查即時路由介面。部分部署也會公開 `/v1/health`，但 `/health` 是可攜式的存活檢查端點。
3. 對於 TAIRA，嘗試即時會議前先驗證中繼遙測路由：

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   這些檢查只能證明 Torii 與 Kaigi 中繼遙測可連線，並不會建立會議；`CreateKaigi` 與 `JoinKaigi` 仍需要已有資金的錢包並提交已簽署的交易。
4. 開啟示範應用程式，前往 **Settings**，設定 Torii URL，讓應用程式從端點載入鏈 ID 與網路前綴。
5. 在示範應用程式中建立或還原兩個本機錢包。請使用不同的應用程式視窗、設定檔或機器，讓主機與來賓各自擁有獨立的錢包狀態。

若要測試 Kaigi UI：

1. 在主機視窗中開啟 **Kaigi**，選取 **Start meeting**，設定標題，再選擇 **Private invite** 或 **Transparent invite**。
2. 選取 **Turn on camera and mic**，讓 WebRTC 取得本機媒體。
3. 選取 **Create meeting link**。實際連線的錢包會提交 `CreateKaigi`；接著應用程式會顯示 `iroha://kaigi/join?call=...&secret=...` 邀請，以及 `#/kaigi?...` 備援路由。
4. 保持主機視窗開啟，並與來賓分享邀請。
5. 在來賓視窗開啟邀請，或將其貼入 **Join meeting**；啟用本機媒體後選取 **Join meeting**。實際連線的錢包會從 Torii 取得已加密的主機 offer，並以加密的 answer 中繼資料提交 `JoinKaigi`。
6. 主機應透過串流或輪詢 Kaigi 通話信令，自動套用第一個 answer。兩個視窗都應顯示已連線的媒體與更新後的連線詳細資料。
7. 從主機結束工作階段，或對同一個通話 ID 使用 CLI `iroha kaigi end` 命令。

私密 Kaigi 需要隱私保護（shielded）的 XOR 才能支付私密進入點費用。如果示範應用程式回報私密 Kaigi 需要隱私保護（shielded）的 XOR，請使用應用程式內的自行屏蔽提示，再重試建立或加入操作。若證明產生、私密資金或即時信令不可用，示範應用程式可退回透明／手動流程。在此情況下，開啟 **Advanced signaling**，複製原始 offer 或 answer 封包，再貼到另一個視窗中。

若要在示範應用程式存放庫中執行自動化檢查，請執行：

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

這些聚焦的 Vitest 測試套件涵蓋 Kaigi 會議連結建立、精簡邀請載入、私密建立／加入／結束橋接呼叫、自行屏蔽提示、手動備援與 answer 輪詢。UI 冒煙測試會在桌面與行動裝置大小的視窗中涵蓋 `/kaigi` 路由。兩個錢包間的即時媒體仍須進行手動雙視窗測試，因為瀏覽器攝影機／麥克風權限與對等媒體串流會因環境而異。

整合程式碼範例請參閱[在 JavaScript 應用程式中嵌入 Kaigi](/zh-hant/guide/tutorials/kaigi.md)。

## 狀態與指標 {#status-and-metrics}

狀態與指標端點應優先接入儀表板：

- `/status` 公開最上層的對等節點、區塊、佇列與共識欄位
- `/metrics` 公開 Prometheus 計數器、量測器與直方圖

在已啟用 Nexus 的節點上，狀態輸出也包含通道與資料空間感知的區段。當 `nexus.enabled = false` 時，這些區段會省略。

## JSON 與 Norito {#json-vs-norito}

部分維運端點預設傳回 Norito。當端點支援 JSON 時，請傳送：

```http
Accept: application/json
```

這對下列端點特別有用：

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

當端點直接接受或傳回具型別的 Norito 時，請使用 `application/x-norito` 作為內容類型或偏好的 `Accept` 值。傳輸細節請參閱 [Norito](/zh-hant/reference/norito.md#torii-and-norito-rpc)。

## 遙測設定檔 {#telemetry-profiles}

端點可見性取決於節點的 `telemetry.profile` 設定。目前的設定提供五個設定檔等級：

| 設定檔 | `/status` | `/metrics` | 開發者路由 |
| --- | --- | --- | --- |
| `disabled` | 否 | 否 | 否 |
| `operator` | 是 | 否 | 否 |
| `extended` | 是 | 是 | 否 |
| `developer` | 是 | 否 | 是 |
| `full` | 是 | 是 | 是 |

## CLI 快捷方式 {#cli-shortcuts}

`iroha` CLI 已封裝其中許多端點：

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## 上游參考資料 {#upstream-references}

- [README API 與可觀測性概述](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 橋接實作](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [效能與指標](/zh-hant/guide/advanced/metrics.md)
