---
translation_locale: zh-hant
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii 目的地 {#torii-endpoints}

Torii 這是 HTTP, SSE, 及其他 WebSocket 進入的門口 Iroha 3. 這兩者都是好用的.
面向帳號 APIs 並使用者端點.

目前的協議規則是:

- 常識二元格式是 **Norito**
- 許多終點也支持 JSON 當你發送 `Accept: application/json`
- 在 Prometheus 格式中顯示了數值

關於格式細節,內容談判,布局旗,方案哈希,以及
Norito RPC 請參考本文 [Norito 參考](/zh-hant/reference/norito.md).

## 共同的目的 {#common-endpoints}

| 終點點 | 格式 | 目的 |
| --- | --- | --- |
| `POST /transaction` | Norito | 提交簽名的交易 |
| `POST /query` | Norito | 提交簽名查詢 |
| `GET /events` | WebSocket | 加入活動流程 |
| `GET /block/stream` | WebSocket | 預約的區塊 |
| `GET /peers` | JSON | 已被曝光的同行名單 Torii |
| `GET /health` | JSON | 輕量活力終點 |
| `GET /api_version` | JSON | 預設方式 API 的版本 |
| `GET /status` | JSON | 對運營商的高級狀況總結 |
| `GET /metrics` | 普羅梅泰斯 | 顯示了對象的狀況. |
| `GET /schema` | JSON | 數據模型圖案快照由節點提供 |
| `GET /openapi` 或是 `GET /openapi.json` | JSON | OpenAPI 該文件為主動 Torii HTTP 航線 |
| `GET /v1/parameters` | JSON | 點子參數快照 |
| `GET /v1/node/capabilities` | JSON | 關鍵字能力和資料模型元數據 |
| `GET /v1/api/versions` | JSON | 提供支持 Torii API 的版本 |
| `GET /v1/events/sse` | SSE | 長期客戶的活動流程 |
| `GET /v1/time/now` | JSON | 接觸器的截圖 |
| `GET /v1/time/status` | JSON | 時間同步狀態 |

`/openapi` 是執行節點的權威終點列表.
表面取決於建構功能和運行時間配置,
客戶應該更喜歡直播 OpenAPI 在手機複製的路線列表上.
請使用 [Torii API 控制器](/zh-hant/reference/torii-api-console.md) 接下來我們將這部影片
文件,測試 JSON 路線,副本 curl 請使用客戶端代碼,
該方案是目前的.

## 試著活下去 Taira 航線 {#try-live-taira-routes}

公眾 Taira 檢測網顯示相同的 Torii JSON 這種應用程式的表面
這些命令不需要密钥:

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

試圖閱讀目前的世界狀況:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

如果公共測試網路線返回 `502`, 或報告飽和的
列表,把它當作終點可用性問題,
檢查您的客戶代碼.

## 協調和運行時間終點 {#consensus-and-runtime-endpoints}

| 終點點 | 格式 | 目的 |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | 最近的承諾證書總結 |
| `GET /v1/sumeragi/validator-sets` | JSON | 認證器設定歷史 |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | 核准器设置在區塊高度 |
| `GET /v1/sumeragi/status` | Norito 或是 JSON | 詳細的共識狀況快照 |
| `GET /v1/sumeragi/status/sse` | SSE | 持續共識狀態流 |
| `GET /v1/sumeragi/leader` | JSON | 目前的領導者資訊 |
| `GET /v1/sumeragi/qc` | Norito 或是 JSON | 最新的票證書總結 |
| `GET /v1/sumeragi/checkpoints` | JSON | 共識檢查點總結 |
| `GET /v1/sumeragi/consensus-keys` | JSON | 積極的共識鍵 |
| `GET /v1/sumeragi/bls_keys` | JSON | 活動 BLS 協調關鍵 |
| `GET /v1/sumeragi/phases` | JSON | 最新的每階段延遲樣本 |
| `GET /v1/sumeragi/rbc` | JSON | RBC 會議和吞吐量指標 |
| `GET /v1/sumeragi/rbc/sessions` | JSON | 活動 RBC 活動快照 |
| `GET /v1/sumeragi/pacemaker` | JSON | 步調儀狀態 |
| `GET /v1/sumeragi/params` | JSON | 在連鎖上進行的電流 Sumeragi 參數 |
| `GET /v1/sumeragi/collectors` | JSON | 決定性集體計畫的快照 |
| `GET /v1/sumeragi/key-lifecycle` | JSON | 協調關鍵生命周期狀態 |
| `GET /v1/sumeragi/telemetry` | JSON | 協調電測的快照 |
| `GET /v1/sumeragi/evidence` | JSON | 選擇性按查詢字符串過濾的證據紀錄 |
| `GET /v1/sumeragi/evidence/count` | JSON | 證據數量 |
| `POST /v1/sumeragi/evidence/submit` | JSON | 提交共識證據 |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito 或是 JSON | 承諾 QC 區塊哈希的記錄 |
| `GET /v1/runtime/abi/active` | JSON | 活動運行時間 ABI 描述符 |
| `GET /v1/runtime/abi/hash` | JSON | 活動運行時間 ABI 哈希 |
| `GET /v1/runtime/metrics` | JSON | 執行時間數據快照 |
| `GET /v1/runtime/upgrades` | JSON | 執行時間升級列表 |
| `POST /v1/runtime/upgrades/propose` | JSON | 提議進行升級 |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | 啟動預定運行時間升級 |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | 取消預定運行時間升級 |

## 應用程式和 SORA 路線家庭 {#app-and-sora-route-families}

什麼時候 Torii 該軟體使用了應用程式面向的功能組, JSON
為探險家提供家庭, SORA 提供服務,橋梁流量,證據和儲存.
並非所有網際網路配置文件都被啟用.

| 路線家族 | 目的 |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON 閱讀,查詢助手,登入助手以及產品或持有者的視圖 |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT, 實際的資產和機密的資產觀點 |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | 姓名,假名和識別碼的解析 |
| `/v1/explorer/*` | 針對探測器的帳戶,資產,區塊,交易,指令,指標和流量查看 |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | 交易歷史,管道恢復或狀況; ISO 20022 助手 |
| `/v1/contracts/*` | 合同代碼,部署,捆綁,呼叫,查看,事件,活動,推動和狀態路線 |
| `/v1/multisig/*`, `/v1/controls/*` | 多名簽證提案,批准和轉移控制助手 |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | 終點,狀態證明,區塊證據,證據保留和證據查詢路線 |
| `/v1/da/*` | 數據可用性攝取,表達,證明政策,承諾和定位意圖 |
| `/v1/zk/*` | ZK 根源,證據驗證, IVM 證明,投票計數,驗證鍵,證明紀錄和附件 |
| `/v1/gov/*`, `/v1/ministry/*` | 管理提案,投票表,協會狀態,保護名稱空間,議題提議,立法和完成 |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus 線路,數據空間和跨鎖防護輔助器 |
| `/v1/musubi/*` | Musubi 包帳閱讀與指令製作器 |
| `/v1/subscriptions/*` | 購物計劃,購物生命周期,使用和收費助手 |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS 提供商的發現,能力證明,接,儲存收集和公開內容服務 |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud 服務生命周期,私人計算/模型流程,公眾發現和托管的應用程序路由 |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha 聯繫會議, WebSocket 運輸, VPN 會議,簡介及收件 |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | 應用程式 API 結束和捆綁/CID- 支持的內容路由 |
| `/v1/operator/*`, `/v1/mcp` | 運營商的認證和本地 MCP JSON-RPC 橋 |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | 在網路上準備,存儲協議,數據區明示表, [RAM-LFE 助手](/zh-hant/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | 合作,網路連接,推送通知和直播電視集成 |

## ISO 20022 橋 {#iso-20022-bridge}

Torii 顯示了 ISO 橋下20022 `/v1/iso20022/*` 當應用程式面向時
API 這座橋是故意標準的:
沒有一般用途 ISO 沒有任何可能發生的情況,
轉換選項的付款訊息為簽名 Iroha 轉移和跟蹤
他們的帳簿狀況.

### Torii ISO 20022 終點 {#torii-iso-20022-endpoints}

| 方法和終點 | 目的 |
| --- | --- |
| `POST /v1/iso20022/pacs008` | 提交一份 FI- 這就是...FI 客戶信用轉移和建立匹配 Iroha 資產轉移 |
| `POST /v1/iso20022/pacs009` | 提交一份 FI- 這就是...FI 使用的信用轉移 PvP 或與證券相關的現金資金 |
| `POST /v1/iso20022/pacs002` | 提交支付狀況報告 |
| `POST /v1/iso20022/pacs004` | 提交支付申報 |
| `POST /v1/iso20022/camt056` | 提交取消支付的要求 |
| `POST /v1/iso20022/sese023` | 提交證券清算指示 |
| `POST /v1/iso20022/sese024` | 提交證券清算狀況訊息 |
| `POST /v1/iso20022/sese025` | 提交證券決済確認 |
| `POST /v1/iso20022/colr012` | 提交抵押替代訊息 |
| `GET /v1/iso20022/messages/{msg_id}` | 閱讀聖經上的橋梁紀錄, |
| `GET /v1/iso20022/audit/messages` | 閱讀顯示錯誤的訊息審核表 |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | 提供目前的支付狀態為 `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | 提供現行付款回報方式 `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | 提供目前的取消分辨率為 `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | 將目前的清算狀態變為 `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | 提供目前的決済確認 `sese.025` XML |

`pacs.008` 提交的內容必須提供訊息 ID, 銀行間決済
額度,貨幣,清算日期,負債人和債權人 IBANs, 以及負債者,
債權人 BICs. 在設定參考數據時,
BIC, IBAN, 及其他 ISO 在生成的交易之前, 4217 個貨幣交叉路口
進入管道.

`pacs.009` 提交的內容必須提供商業訊息 ID, 訊息的定義
ID, 建立時間,銀行間決済金額,貨幣,決済日期,
授權及授權代理人 BICs, 以及負債者和債權人 IBANs. 如果是
這個訊息包含 `Purp`, 目前橋接受證券目的資金
只有: `Purp=SECU`.

其他國家 `pacs.008` 及其他 `pacs.009` 提交的最終點接受 XML ISO 封筒或
在橋測試中使用的平面場格式. `SplmtryData` 字段
能住目標 Iroha 帳號,來源和目標帳戶 IDs 或地址,
及資產定義 ID. 答案是: `202 Accepted` 在 `message_id`,
`transaction_hash`, `status`, `pacs002_code`, 還有解決的問題
帳號/帳戶/資產背景.

### 更多的解析和映射支持 {#additional-parser-and-mapping-support}

其他國家 IVM ISO 助手也證實並實現下列訊息
包裹驗證,定居地圖或下游的家庭
沒有獨立的國家. Torii 這裡有許多路線.

| 訊息家族 | 目前的支持 |
| --- | --- |
| `head.001` | 經營應用程式標題驗證 ISO 包裹,包括 `BizMsgIdr`, `MsgDefIdr`, 創建時間和可選的發送/接收器 BIC 字段 |
| `pacs.007`, `pacs.028`, `pacs.029` | 轉換付款,狀態要求和調查處理/狀態分析 |
| `pain.001`, `pain.002` | 客戶支付開始和支付狀況報告的驗證 |
| `camt.052`, `camt.053`, `camt.054` | 帳戶報告,報表和通知驗證 |

## Kaigi 會議 {#kaigi-sessions}

Kaigi 提供付費的實時音訊/視頻室, SORA Nexus. 在使用時,
應用程序需要建立本簿支持的會議,變更名單,接觸
顯示,加密訊息和使用計量而不是保存所有
在國外開會.

面向帳號的生命周期是:

- `CreateKaigi`: 在域名下建立呼叫,並存儲其政策,
  該項目的使用時間表,元數據和可選的連接宣言.
- `JoinKaigi` 及其他 `LeaveKaigi`: 在私人模式下,
  參與者使用承諾,廢除和名單證明
  揭露參與者帳戶 IDs 直接使用.
- `RecordKaigiUsage`: 加入計程時間和氣體總數.
- `EndKaigi`: 結束會議,並記錄最後的時間.

Torii 顯示接觸電視測量 `/v1/kaigi/relays`,
`/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, 及其他
`/v1/kaigi/relays/events` 當應用程式 API 並啟動了遠隔測量功能.
該會議狀態反映在 Kaigi 域名事件如
`KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, 及其他 `KaigiUsageSummary`.

### CLI 煙草檢測 {#cli-smoke-test}

首先是: `iroha kaigi` CLI 如果您想確認, Torii 終點點
接受 Kaigi 在連接之前的交易 UI. 快速啟動命令
建立了暫時的空間, Torii 結束點和打印總結
加入命令,並使用呼叫識別碼; SoraNet 子提示:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

管理室內生命周期:

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

使用 `--room-policy public` 沒有觀眾的空間,
票,或 `--room-policy authenticated` 當出口需要觀眾
認證. 使用 `--privacy-mode zk-roster-v1` 只有在網路已
這項政策 Kaigi 列表和使用驗證關鍵配置;否則結合,葉子,
在決定性驗證過程中,

### 試用這些方法 JavaScript 演示活動 {#testing-with-the-javascript-demo}

請使用
[米圖/Iroha-demo-JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
這次的演示是電子和Vue
直接對話的申請 Torii 透過本地 `@iroha/iroha-js`
具有拘束力,包括: `/kaigi` 透過網路傳播器,

使用示範
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
來自: Iroha 顯示器將使用 SDK 通過
`file:../iroha/javascript/iroha_js`, 所以要把兩支現金放在這個兄弟身上
布局:

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

使用 Node.js 20 或更新的, Rust 這樣的工具連鎖, `iroha_js_host`
該模組可以建立. SDK 在兄弟姐妹中 Iroha 改變後收費
它的來源;清潔包裝布局不包含貨物工作空間
需要的 `npm run build:native`.

檢測的情況下, Kaigi- 有能力的 Torii 目的地:

1. 開始一個 Iroha 接觸到 SORA/Kaigi 使用應用程式 APIs 啟動或使用
   公開的終點, Kaigi 您需要的表面.
2. 檢查基本可用性 `/health`, 然後檢查直線路面
   在 `/openapi` 或是 `/openapi.json`. 有些部署也暴露了
   `/v1/health`, 但他們 `/health` 這是可隨身使用寿命檢查.
3. 於 TAIRA, 在試用直播會議之前,檢查接線電視路徑:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   這些檢查證明, Torii 及其他 Kaigi 接收電視可以取得.
   沒有建立會議; `CreateKaigi` 及其他 `JoinKaigi` 還需要資金提供
   錢包和簽名交易提交.
4. 打開演示, **設定**, 設定這個 Torii URL, 讓應用程式加載
   鎖頭 ID 在最後一點開始,
5. 在演示中建立或恢復兩個本地錢包.
   這樣主機和客人有不同的錢包狀態.

為了測試 Kaigi UI:

1. 在主機窗口中, **Kaigi**, 選擇 **開始會議**, 設定一個標題,
   並選擇 **邀請您參加** 或是 **透明的邀請**.
2. 選擇 **打開相機和麥克風** 這樣的 WebRTC 這裡有當地媒體.
3. 選擇 **建立會議連結**. 提供一個現實的錢包 `CreateKaigi`; 這項政策
   該應用程式顯示了 `iroha://kaigi/join?call=...&secret=...` 邀請和一個
   `#/kaigi?...` 這樣的情況會發生.
4. 請將邀請片帶給客人.
5. 在客戶窗口中,打開邀請或粘貼它 **加入會議**, 轉動
   在當地媒體上, **加入會議**. 沒有人能看到
   提供加密的主機優惠 Torii 並提交 `JoinKaigi` 有加密的
   答案的數據.
6. 接待者必須自動通過流媒体或民意調查, Kaigi
   兩個窗口都應該顯示連接的媒體,
   聯繫資料.
7. 或使用 CLI `iroha kaigi end` 該命令
   這樣的呼叫 ID.

獨立 Kaigi 需要保護 XOR 還付私人入口點費用.
顯示私人報告 Kaigi 需要保護 XOR, 使用內應用程式
自動屏蔽提示和重新嘗試創建或加入行動.
沒有直接訊息可用,
透明/手動流量. 在這種情況下, **高級的訊號**, 複製
在另一扇窗口中貼上原始的優惠或答案包.

在演示 repo 中進行自動檢查,執行:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

專注於Vitest套房的封面 Kaigi 建立會議連結,簡體邀請
充電,私人建立/加入/結束橋通話,自衛防線提示,手動
沒有人知道. UI 煙霧測試包括: `/kaigi` 路線
在桌面和手機尺寸的景點上.
需要手動的兩窗口測試, 因為覽器攝像機/麥克風許可
而同行媒體的流量是環境特異性的.

查看樣本集成代碼
[嵌入式 Kaigi 在一個 JavaScript 應用程式](/zh-hant/guide/tutorials/kaigi.md).

## 狀態和指標 {#status-and-metrics}

數據與數值的終點是首要在儀表板中插入的:

- `/status` 顯示最高級的同行,區塊,排隊和共識欄位
- `/metrics` 顯示Prometheus的計數,測量器和 histogram

在此, Nexus- 已啟用的節點,狀態輸出也包括路徑和數據空間意識
在哪裡? `nexus.enabled = false`, 這些部分已被忽略.

## JSON 這樣的情況 Norito {#json-vs-norito}

數位運營者終點返回 Norito 當端點支持
JSON, 發送:

```http
Accept: application/json
```

這對以下情況尤其有用:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

當一個終點接受或返回輸入時 Norito 直接使用
`application/x-norito` 內容類型或首選 `Accept` 價值.
[Norito](/zh-hant/reference/norito.md#torii-and-norito-rpc) 關於運輸細節.

## 遠隔測量圖表 {#telemetry-profiles}

截止點可視性取決於遠隔測量設定.
五個專利層次:

| 網站地圖 | `/status` | `/metrics` | 發展者路線 |
| --- | --- | --- | --- |
| `disabled` | 沒有 | 沒有 | 沒有 |
| `operator` | 是的 | 沒有 | 沒有 |
| `extended` | 是的 | 是的 | 沒有 |
| `developer` | 是的 | 沒有 | 是的 |
| `full` | 是的 | 是的 | 是的 |

## CLI 快捷方式 {#cli-shortcuts}

其他國家 `iroha` CLI 這項目標已完成:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## 上游參考資料 {#upstream-references}

- [README API 以及可觀察性的概述](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 200222 橋梁的實施](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [性能與指標](/zh-hant/guide/advanced/metrics.md)
