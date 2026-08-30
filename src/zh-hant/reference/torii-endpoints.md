---
translation_locale: zh-hant
translation_source: /reference/torii-endpoints.md
translation_source_hash: 995701cfca9594b88a0da73a5b582c75c5962449a9ccf150e65738d3656d4f02
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii 終點 {#torii-endpoints}

Torii 是 HTTP, SSE, 和 WebSocket 的門戶 Iroha 3. 它們都面向本書. APIs 和運營商終端點.

目前的協議規則是:

- 常規二進制格式爲 Norito
- 在發送 `Accept: application/json`時,許多終端也支持 JSON
- 數字表是以Prometheus格式呈現的.

對於格式細節,內容談判,佈局標誌,方案哈希和 Norito RPC 指導,請參見[Norito 參考](/zh-hant/reference/norito.md).

## 共同的終點 {#common-endpoints}

|終點|格式| 用途                                                          |
| ------------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions`|Norito|提交簽署的交易|
|`POST /v1/query`|Norito|提交一個簽名的查詢|
|`GET /v1/events/ws`|WebSocket|訂閱活動流|
|`GET /v1/events/sse`|SSE|訂閱 SSE 以上的事件流|
|`GET /v1/blocks/stream`|WebSocket|流動承諾的區塊|
|`GET /v1/peers`|JSON|Torii 所暴露的同行列表 |
|`GET /livez`|文本|只有流程活力;它並不意味着協議準備性 |
|`GET /readyz`|JSON|無線現金檢查,包括強制性的無線現貨檢查|
|`GET /health`|JSON|準備探測器與相同的離線現金不變量|
|`GET /v1/api/version`|文本|現在的區塊標題版本|
|`GET /status`|Norito 或 JSON |高級診斷狀態; 明確請求 JSON |
|`GET /metrics`|普羅梅蒂烏斯|普羅梅斯的剪傷終點|
|`GET /v1/schema`|JSON|當啓用時,節點服務的數據模型方案快照|
|`GET /openapi`或 `GET /openapi.json` |JSON|OpenAPI 文件,用於活躍的 Torii HTTP 航線|
|`GET /v1/parameters`|JSON|節點參數快照|
|`GET /v1/node/capabilities`|JSON|節點能力和數據模型元數據|
|`GET /v1/time/now`|JSON|節點牆時鐘快照|
|`GET /v1/time/status`|JSON|時間同步狀態|

對於 SSE 請求,廣告原始流量加上輸入後退:

```http
Accept: text/event-stream, application/json
```

Torii 首先在請求層上談判 JSON 或 Norito 的代表性,然後驗證原生`text/event-stream`響應.因此只發送`text/event-stream`被拒絕使用`406`;[流事件配方](/zh-hant/cookbook/stream-events.md)使用完整標題.

`/openapi`是該方案中表示的路線的主要生成合同,而不是完整的運營探測器庫存.當前文檔遺漏`/livez`和`/readyz`,其 `/health`描述可能會落後於準備處理器.從現場文檔生成路線客戶端,但直接對運行節點和固定處理器進行活力和準備驗證.確切的表面仍然取決於構建功能和運行時間配置.使用 [Torii API 控制檯](/zh-hant/reference/torii-api-console.md)來加載該現場文檔,測試 JSON 路線,複製 curl 請求,並從當前的方案中生成客戶端代碼.

## 嘗試直播 Taira 路線 {#try-live-taira-routes}

公共的 Taira 測試網暴露出應用客戶端僅用於閱讀探索的相同的 Torii JSON 表面.這些命令不需要密鑰:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

試看資源對當前世界狀況:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

如果公開測試網絡路線返回 `502`,時間停止,或報告一個和的隊列,將其視爲終點可用性問題,然後在調整客戶端代碼之前再嘗試.

## 達成共識和運行時間終點 {#consensus-and-runtime-endpoints}

|終點|格式| 用途 |
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates`|JSON|最近的承諾證書總結 |
|`GET /v1/sumeragi/validator-sets`|JSON|驗證器設置歷史記錄|
|`GET /v1/sumeragi/validator-sets/{height}`|JSON|驗證器設置在一個區塊高度|
|`GET /v1/sumeragi/status`|Norito 或 JSON |詳細的共識狀態快照|
|`GET /v1/sumeragi/status/sse`|SSE|持續的共識狀態流|
|`GET /v1/sumeragi/leader`|JSON|目前的領導信息 |
|`GET /v1/sumeragi/qc`|Norito 或 JSON |最新的數證書總結 |
|`GET /v1/sumeragi/checkpoints`|JSON|共識檢查點總結|
|`GET /v1/sumeragi/consensus-keys`|JSON|活躍的共識密鑰|
|`GET /v1/sumeragi/bls_keys`|JSON|活躍的 BLS 共識密鑰|
|`GET /v1/sumeragi/phases`|JSON|最新的每個階段延遲樣本|
|`GET /v1/sumeragi/rbc`|JSON|RBC 會議和吞吐量指標 |
|`GET /v1/sumeragi/rbc/sessions`|JSON|活動的 RBC 會議快照|
|`GET /v1/sumeragi/pacemaker`|JSON|心臟緩慢器的狀態|
|`GET /v1/sumeragi/params`|JSON| 連鎖電流 Sumeragi 參數 |
|`GET /v1/sumeragi/collectors`|JSON|確定性集體計劃的快照|
|`GET /v1/sumeragi/key-lifecycle`|JSON|共識關鍵生命週期狀態|
|`GET /v1/sumeragi/telemetry`|JSON|共識遠程測量快照|
|`GET /v1/sumeragi/evidence`|JSON|選擇性通過查詢字符串過的證據記錄|
|`GET /v1/sumeragi/evidence/count`|JSON|證據記錄數量|
|`POST /v1/sumeragi/evidence/submit`|JSON|提交共識證據|
|`GET /v1/sumeragi/commit_qc/{hash}`|Norito 或 JSON |提交 QC 記錄爲區塊哈希|
|`GET /v1/runtime/abi/active`|JSON|活躍運行時間描述器 ABI |
|`GET /v1/runtime/abi/hash`|JSON|活躍運行時間 ABI 哈希|
|`GET /v1/runtime/metrics`|JSON|運行時間指標快照|
|`GET /v1/runtime/upgrades`|JSON|運行時間升級列表|
|`POST /v1/runtime/upgrades/propose`|JSON|提議升級運行時間|
|`POST /v1/runtime/upgrades/activate/{id}`|JSON|啓動擬議的運行時間升級|
|`POST /v1/runtime/upgrades/cancel/{id}`|JSON|取消擬議的運行時間升級|

## 應用程序和 SORA 路線家庭 {#app-and-sora-route-families}

當 Torii 用面向應用程序的功能集構建時,它會暴露在探索者, SORA 服務,橋樑流量,證明和存儲的額外 JSON 家庭中.這些家庭並非所有網絡配置文件都啓用.

`/openapi`描述了在生成的app-API 目錄中註冊的路線;它對所包含的條目是權威的,而不是每個安裝的路線. 特別是公共局域 SoraFS CID 和已知路線在生成的文件之外安裝,必須直接進行探測.

|路線家族| 用途                                                                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/`, `/v1/domains/`,`/v1/assets/*` |JSON 閱讀,查詢輔助器,登錄輔助器以及投資組合或持有者的視圖|
|`/v1/nfts/`, `/v1/rwas/`,`/v1/confidential/*` |NFT,現實資產,以及機密資產視圖|
|`/v1/aliases/`, `/v1/assets/aliases/`,`/v1/sns/`, `/v1/identifiers/` |姓名,別名和識別符分辨率|
|`/v1/explorer/*`|基於探索器的賬戶,資產,區塊,交易,指令,指標和流量視圖.|
|`/v1/transactions/`, `/v1/pipeline/`,`/v1/iso20022/*` |交易歷史,管道恢復或狀態以及 ISO 20022助理|
|`/v1/contracts/*`|合同代碼,部署,捆綁,呼叫,視圖,事件,活動,推進和狀態路線|
|`/v1/multisig/`, `/v1/controls/` |多簽署的提案,批准和轉移控制輔助者 |
|`/v1/bridge/`, `/v1/ledger/`,`/v1/proofs/*` |終止性,狀態證明,區塊證明,證據保留和證據查詢路線|
|`/v1/da/*`|數據可用性攝入,表格,證明政策,承諾和明確意圖 |
|`/v1/zk/*`|ZK 根,證據驗證, IVM 證明,投票計數,驗證鑰匙,證據記錄和附件 |
|`/v1/gov/`, `/v1/ministry/` |管理提案,投票表,理事會狀態,保護名字空間,議程建議,頒佈和最終制定|
|`/v1/nexus/`, `/v1/sccp/` |Nexus 車道,數據空間和跨鏈防護輔助員|
|`/v1/musubi/*`|Musubi 包裝註冊表閱和指令製造商|
|`/v1/subscriptions/*`|訂閱計劃,訂閱生命週期,使用和收費助手|
|`/v1/sorafs/`, `/sorafs/`,`/.well-known/sorafs/*` |SoraFS 供應商的發現,能力驗證,粘貼,存儲收集和公開內容服務 |
|`/v1/soracloud/`, `/v1/soradns/`,`/soradns/`, `/api/` |SoraCloud 服務生命週期,私人計算/模型流量,公開發現和託管應用程序路由 |
|`/v1/connect/`, `/v1/vpn/` |Iroha 連接會話, WebSocket 運輸,VPN 會議,個人資料和收據|
|`/v1/app-api/`, `/v1/api/`,`/v1/content/*` |應用程序 API 綁定和捆綁/CID 支持的內容路由 |
|`/v1/operator/*`, `/v1/mcp` |運營商認證和本地 MCP JSON-RPC 橋樑 |
|`/v1/offline/`, `/v1/repo/`,`/v1/space-directory/`, `/v1/ram-lfe/` |在線準備,存儲協議,數據空間表格和[RAM-LFE 助手](/zh-hant/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/`, `/v1/webhooks/`,`/v1/notify/`, `/v1/telemetry/` |合作,網絡連接,推送通知和直播遠程測量集成|

## 賬戶身份驗證,可見性和探險器的客 {#account-authentication-visibility-and-explorer-cursors}

### 應用程序帳戶請求協議 {#app-account-request-protocol}

面向應用程序的路線不接受任何身份驗證標題,一個直接單鍵證明或一個多簽證人. 每個身份驗證標題必須最多一次出現.

爲了得到直接的證據,請把四個標題都放在一起:

- `X-Iroha-Account`:正確的法典小字母 `0x`賬戶地址六字母或活躍的法典 ASCII 賬戶別名. I105 文本不安全作爲一個 HTTP 字段值;使用法典六字母拼寫爲該帳戶.
- `X-Iroha-Signature`:嚴格填充的64基簽名有效載荷.
- `X-Iroha-Timestamp-Ms`:在設置的偏差窗口內,以毫秒爲例的法定未簽字的十進制Unix時間標誌.
- `X-Iroha-Nonce`: 1至256可打印 ASCII 字節 (`0x21` 通過 `0x7e`),在重播窗口中是唯一的.

已註冊的單鍵控制器簽署了這些字節:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

標準查詢結構分析原始查詢爲 `application/x-www-form-urlencoded` (`+` 百分比解碼其對,按它們進行排序 `(key, value)`, 該協議允許最多 64 個解碼的對和 64 個 KiB 在原始查詢文本中. 哈希體的字節正如傳輸一樣.不要插入固定32字節網絡之間的分隔器 ID 和大字母方法.

在分析之前, V1 驗證器還將方法代幣限制在32字節,以百分比編碼的請求路徑爲64 KiB,以及直接帳戶身份爲36 KiB.帳戶別名具有三個名稱段加上分區的更嚴格結構限制.超過一個字節在簽名驗證或源大小分配之前未能進行認證.

一個多籤控器必須發送 `X-Iroha-Witness` 作爲嚴格的加基64法規 Norito 和遺漏 `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms`, 和 `X-Iroha-Nonce`. `X-Iroha-Account` 在此形式是可選的;當存在時,它必須等於證人 `subject_account`. 其他 `CanonicalRequestWitnessV1` 含有 `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, 一個 Iroha `Hash` 通過體內消化,但沒有每個成員國都簽署了"法典"的 Norito 沒有簽名陣列的同樣的有效載荷編碼.密碼的證人被限制在1 MiB.

提供無身份驗證標題選擇匿名訪問.提供任何部分,混合,重複,錯形,過時或重播的證據失敗了身份驗證;它從來沒有回到匿名可見性.

### 運營商請求協議 {#operator-request-protocol}

標記爲經營者認證的路線需要所有四個單標頭:

- `x-iroha-operator-public-key`:正規的 Iroha 多密碼公鑰.
- `x-iroha-operator-timestamp-ms`:在毫秒的常規未簽字的Unix時刻標記.
- `x-iroha-operator-nonce`: 1至256個可打印的 ASCII 字節,是重播窗口中的該鍵的唯一字節.
- `x-iroha-operator-signature`:嚴格填充的64基簽名有效載荷.

標題值不得包含周圍的白色空間.操作員關鍵符號:

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

路徑,查詢,體格,時刻標籤和nonce規則是應用程序協議使用的相同的常規規規則.關鍵也必須由 `[torii.operator_signatures]`:在 `allowed_public_keys`中列出它,或在使用節點鍵時明確啓用`allow_node_key`.當重播緩存充足時, Torii 將請求拒絕使用 `503 Service Unavailable`.可選的 WebAuthn 或mTLS操作員身份驗證是一個額外的因素,從來沒有取代了這個確切的請求籤名.

ISO 20022路線採用兩個獨立的檢查. 要求必須首先通過運營商許可名單和簽字協議; ISO 處理器則需要相同的密鑰,以佔據以下描述的準確參與者或審計角色.

### 賬本可見性和探險器曲者 {#ledger-visibility-and-explorer-cursors}

應用程序面向賬本閱讀使用上述可選的應用程序帳戶邊界.未簽名請求只接收爲公開配置的數據庫.有效的簽名請求添加連接到調用者的當前 UAID 的數據空間,每個受限的數據空間以精確的 `CanReadRestrictedDataspace { dataspace }`許可命名,或者所有路線如果賬戶有 `CanReadAllLedgerData`.

同樣的可見性對象過帳戶,域名,資產定義,資產, NFT, RWA,持有者和探險器.一個缺失的對象和一個在調用者的可見路線之外的對象是故意無法區分的.只有當交易所記錄的每條路線腳都可見時,就會顯示已提交的交易和指令歷史.因此,當連一個參與者腿都不在調用者的範圍之外時,隱藏; 缺失,過時或錯誤的路由文本僅可見於全球讀者.

全球支持的六個Explorer集合使用不透明的正規base64url鍵盤設置緩衝器.默認頁面限制爲 25,最大是100,一個頁面檢查最多512個候選鍵.每個緩解器都與其集合,過器,法定最後鍵和調用者的可見路線設置消化聯繫在一起,因此不能在另一個查詢或調用者可視性發生變化後再播放

區塊,交易,最新交易,指令和最新指令歷史線索 additionally pin the committed snapshot height and block hash.響應顯示`pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`,和 `pagination.has_more`.Torii 拒絕對另一個路線或過器設置,改變的可見性消化或節點不再可以驗證的快照進行緩解.在阻塞工作者運行時,歷史掃描仍然存在於 Torii 的查詢錄取許可中.

隨着賬本權限的變化, Explorer WebSocket 流發出過總結和重新計算可見性.本地 `GET /v1/blocks/stream` 路線不同:它發射完整在手握時需要 `CanReadAllLedgerData`,並在後面撤銷該許可的情況下關閉.

## ISO 20022 橋 {#iso-20022-bridge}

Torii 將 ISO 20022橋暴露在 `/v1/iso20022/*`下,當應用程序面向 API 和橋運行時間啓用時.橋是故意設定的:它不是一個一般用途的 ISO 20022清算網關,而是用於將選定的支付消息轉換爲簽署的 Iroha 轉賬和跟蹤其賬本狀態的支持子集.

在允許任何提交之前配置一個持久的本地 `torii.iso_bridge.store_dir`. 配置字段僅是可選的,因此節點可以啓動只用於閱讀或診斷使用:每個認證的 ISO 提交都需要目錄,並且在沒有持久性或重播墓碑或富記錄寫失敗時返回可複試`503 Service Unavailable`.

### Torii ISO 20022 終點 {#torii-iso-20022-endpoints}

|方法和終點| 用途 |
| --- | --- |
|`POST /v1/iso20022/pacs008`|提交 FI 到 FI 客戶信貸轉賬,並構建匹配的 Iroha 資產轉賬|
|`POST /v1/iso20022/pacs009`|提交用於 PvP 或與證券相關的現金資助的 FI 到 FI 信用轉賬|
|`POST /v1/iso20022/pacs002`|提交對方所擁有的支付狀況報告;結算需要承諾的交易證據|
|`POST /v1/iso20022/pacs004`|提交對方所擁有的付款申報表|
|`POST /v1/iso20022/camt056`|提交原始人的取消支付請求|
|`POST /v1/iso20022/sese023`|提交證券結算說明|
|`POST /v1/iso20022/sese024`|提交對方所有的證券結算狀態信息 |
|`POST /v1/iso20022/sese025`|提交對方持有的證券結算確認|
|`POST /v1/iso20022/colr012`|提交一個擔保替代信息|
|`GET /v1/iso20022/messages/{msg_id}`|閱讀一條經典的橋樑記錄|
|`GET /v1/iso20022/audit/messages`|閱讀"改"的信息審計表|
|`GET /v1/iso20022/messages/{msg_id}/pacs002`|將當前支付狀況歸納爲 `pacs.002` XML |
|`GET /v1/iso20022/messages/{msg_id}/pacs004`|提交當前支付申報表爲 `pacs.004` XML |
|`GET /v1/iso20022/messages/{msg_id}/camt029`|輸出當前取消分辨率爲 `camt.029` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese024`|轉換當前結算狀態爲 `sese.024` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese025`|提交當前結算確認號爲 `sese.025` XML |

`pacs.008` 提交的內容必須提供信息 ID, 銀行間結算金額,貨幣,結算日期,債務人和債權人 IBANs, 債務人和債權人 BICs. 當設置參考數據時,橋也會檢查 BIC, IBAN, 和 ISO 在生成的交易進入管道之前,4217個貨幣交叉路口.

`pacs.009`提交的信息必須包含業務消息 ID,信息定義 ID,創建時間,銀行間結算額,貨幣,結算日期,指示和指令代理人 BICs,債務人和信貸者 IBANs.如果信息包含`Purp`,橋樑目前只接受用於證券的資金: `Purp=SECU`.

其他 `pacs.008` 和 `pacs.009` 提交終點接受 XML ISO 在橋樑測試中使用的封筒或平面場格式.可選 `SplmtryData` 字段可以定目標 Iroha 總賬戶,來源和目標帳戶 IDs 或地址,以及資產定義 ID. 答案是 `202 Accepted` 與 `message_id`, `transaction_hash`, `status`, `pacs002_code`, 解決賬本/帳戶/資產背景.

### 參與者授權和生命週期所有權 {#participant-authorization-and-lifecycle-ownership}

每個啓用橋都有參與者目錄.每個參與者入口都有一個獨特的參與者 ID,一個或多個運營商公鑰,一個或更多的財務標識符,允許的個人資料集以及`originator`, `counterparty`或兩者的角色.運營商密鑰和財務識別符不能屬於多個參與者.單獨配置 `audit_admin_keys`;審計管理員密鑰也不能成爲參與者的突變密鑰.

所有的 ISO 路線需要新的運營商簽名. `pacs.008`, `pacs.009`, `sese.023`, 或 `colr.012` 提交,驗證的運營商必須屬於申請標題所識別的參與者 `From` 金融身份. `To` 認同必須解決一個配置的參與者與 `counterparty` 長期錄取記錄原始人,對方,加入參與者和運營商密鑰,以及原始配置文件和嵌入式簽名政策.

生命週期授權來源於該不可改變的記錄,而不是來自調用者選擇的值:

|生命週期信息|要求參與者|
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`,`sese.024`, `sese.025` |具有 `counterparty`角色的原始對方 |
|`camt.056`|具有 `originator`角色的原始創始人|

原始的個人資料和簽名政策將保留在整個文件中調用者不能選擇一個較弱的配置文件來更新. `pacs.002` 代表結算的代碼 (`ACSC`, `ACCP`, `SETT`, 或 `SETTLED`) 只有當原始記錄被調整爲結算 Torii 已提交交易證據.

原始交易的任一方都可以讀取其訊息記錄及產生的寄件匣文件。稽核端點只會傳回已驗證參與者為發起方或交易對手方的記錄。另行設定的稽核管理員可取得全域唯讀稽核檢視，但不能提交或變更訊息。系統不會揭露未知參與者或不相關訊息識別碼是否存在。

### 持久重播身份和簽署的輸出箱文件 {#durable-replay-identity-and-signed-outbox-documents}

複製墓碑是嚴格的入口界限. Torii 爲不可讀取,超大尺寸,錯形,命名錯誤,衝突或明確不兼容的墓石進行啓動.它還爲一個富有記錄提供了明確不兼容的方案版本,與當前配置缺失的參與者,個人資料或簽名政策,或者缺乏或不匹配的現場墓碑.

其他豐富記錄損壞處理方式不同:無法讀取或超大文件,無效的 JSON,無效的流程圖表記錄,非正規的文件名和衝突的重播身份被登記或跳過.從保存的記錄中再生出不可讀或無效的當前版本審計指數;只有一個明確不兼容的審計指標版本纔會停止啓動.監控啓動日誌,並調整再生的審覈表格,而不是假設每個腐敗的富錄文件都阻止節點服務.

每個保存的豐富記錄都保持了不變的參與者起源. ID, 使用負載哈希,業務信息 ID, 和 UETR 對於完整的減倍 TTL 即使有豐富的記錄細節被剪切.

Torii 在簽署或處理生命週期消息之前仍然存在重播錄取.它永遠不會驅逐未到期的重播身份. 如果配置容量完全被保護的記錄或未到期的重播身份所佔據,提交的信息在沒有改變生命週期或會計狀態的情況下獲得可回覆的 `503 Service Unavailable`.

每個生成的 `pacs.002`, `pacs.004`, `camt.029`, `sese.024`或 `sese.025` 文件都以`application/xml` 返回這些響應標題:

|標題| 含義                                               |
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain`|總是 `iroha.iso20022.outbound.v2`|
|`X-Iroha-Iso-Signer`|配置橋簽名器的公開標準鑰匙|
|`X-Iroha-Iso-Signature`|在域分隔的 XML 字節上使用Base64簽名|

驗證 UTF-8 字節序列 `iroha.iso20022.outbound.v2`,一個零字節,以及精確的響應體上的簽名. 在驗證之前不要重新格式化或正常化 XML.

### 額外的解析和繪圖支持 {#additional-parser-and-mapping-support}

IVM ISO 輔助器還驗證並實現下列信息家族,用於包裹驗證,定居地圖化或下游調整.它們沒有獨立的 Torii 路線.

|消息家庭|目前的支持|
| --- | --- |
|`head.001`|商業應用程序標題驗證 ISO 封,包括 `BizMsgIdr`, `MsgDefIdr`,創建時間和可選的發送/接收者 BIC 字段|
|`pacs.007`, `pacs.028`,`pacs.029` |支付逆轉,狀態要求和調查解決/狀態分析|
|`pain.001`, `pain.002` |客戶支付啓動和支付狀態報告驗證 |
|`camt.052`, `camt.053`,`camt.054` | 帳戶報告、對帳單與通知的驗證 |

## Kaigi 會議 {#kaigi-sessions}

Kaigi 在 SORA Nexus 上提供付費的實時音頻/視頻室. 使用它,當應用程序需要創建賬本支持的會話,變更名單,繼電錶格,加密信號和使用計量,而不是將所有會議狀態關閉鏈.

面向賬本的生命週期是:

- `CreateKaigi`:在域名下創建呼叫,並存儲其政策,時間表,元數據和可選的繼電說明書.
- `JoinKaigi`和`LeaveKaigi`:更新呼叫名單.在私人模式下,參與者使用承諾,取消符號和名單證明,而不是直接暴露參與者的帳戶 IDs.
- `RecordKaigiUsage`:添加計量時間和氣體總數.
- `EndKaigi`:結束會議並記錄最後的時刻.

Torii 顯示繼電器遠程測量 `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, 和 `/v1/kaigi/relays/events` 當應用程序 API 會議狀態反映通過: Kaigi 領域事件如: `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, 和 `KaigiUsageSummary`.

### CLI 煙霧測試 {#cli-smoke-test}

在連接一個 UI 之前,開始使用`iroha kaigi` CLI 來驗證 Torii 終端點接受 Kaigi 交易.快啓動命令對活躍的 Torii 終端點創建一個臨時空間,並打印了一個總結,包含呼叫標識符,加入命令和 SoraNet 卷軸提示:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

對於編寫的流量,明確管理房間生命週期:

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

使用 `--room-policy public` 對於繼電器可以在沒有觀衆門票的情況下暴露的房間,或 `--room-policy authenticated` 當出口必須需要觀衆身份驗證時. `--privacy-mode zk-roster-v1` 只有在網絡獲得了 Kaigi 列表和使用驗證鍵配置;否則連接,頁面,在確定性驗證過程中,私人使用記錄失敗.

### 使用 JavaScript 示範測試 {#testing-with-the-javascript-demo}

使用 [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript)桌面演示程序進行端到端錢包測試.該演示程序是電子和Vue應用程序,通過本地 `@iroha/iroha-js`綁定直接與 Torii 交談,幷包括瀏覽器原生一個對一個媒體的 `/kaigi`路線.

使用 [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js)從 Iroha 源存儲庫的演示.演示針是 SDK 到 `file:../iroha/javascript/iroha_js`,所以保持這兩個支票在兄弟佈局:

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

使用 Node.js 20 或更新版本和 Rust 工具鏈,以便本土的 `iroha_js_host` 模塊構建.在改變其源頭後重建 Iroha 收銀器中的 SDK;清潔包裝佈局不包含 `npm run build:native` 所需的貨物工作空間.

在控制測試中,指向示範器到一個 Kaigi - 能力的 Torii 終點:

1. 啓動一個 Iroha 節點,使用 SORA/Kaigi 應用程序面向 APIs 啓用,或者使用一個公開的終端點,將所需的 Kaigi 表面暴露出來.
2. 通過 `/health`檢查基本可達性,然後使用 `/openapi`或 `/openapi.json`檢查實行路線表面.一些部署也會暴露`/v1/health`,但`/health`是便攜式活力檢測.
3. 對於 TAIRA,在嘗試現場會議之前,驗證繼電器遠程測量路線

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

這些檢查證明 Torii 和 Kaigi 繼電遠程測量可訪問.它們不會創建會議;`CreateKaigi`和`JoinKaigi`仍然需要資助的錢包和簽署交易提交.
4. 打開演示,進入設置,設置 Torii URL,然後讓應用程序從終端點上加載鏈接 ID 和網絡前.
5. 在演示中創建或恢復兩個本地錢包. 使用單獨的應用程序窗戶,個人資料或機器,以便主機和客人有單獨的錢包狀態.

爲了測試 Kaigi UI:

1. 在主機窗口中,打開 Kaigi,選擇開始會議,設置標題,然後選擇私人邀請或透明邀請.
2. 選擇開攝像頭和麥克風,所以 WebRTC 有本地媒體.
3. 選擇創建會議鏈接. 一個現場錢包提交 `CreateKaigi`;然後應用程序顯示`iroha://kaigi/join?call=...&secret=...`邀請和`#/kaigi?...`迴歸路線.
4. 保持主機窗戶開放,並與客人分享邀請.
5. 在客戶窗口中,打開邀請或粘貼在加入會議中,啓動本地媒體,然後選擇加入會議. 現場錢包從 Torii 獲取加密的主機報價,並提交`JoinKaigi`加密答案元數據.
6. 主機應通過播放或投票 Kaigi 電話信號自動應用第一個答案. 兩個窗口都應該顯示連接的媒體和更新的連接細節.
7. 從主機中結束會議,或者使用 CLI `iroha kaigi end` 命令進行相同的調用 ID.

個人 Kaigi 保護的需求 XOR 如果演示報告說私人進入點費用, Kaigi 保護的需求 XOR, 使用應用程序內自屏幕提示,再嘗試創建或加入操作.如果無法生成證據,私人資金或直播信號,則演示程序可以恢復到透明/手動流程.在這種情況下,打開高級信號,複製原始的報價或答案包,然後將其粘貼在另一個窗口.

在測試 repo 中進行自動檢查,運行:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

專注的Vitest套房覆蓋面 Kaigi 會議鏈接創建,緊的邀請加載,私人創建/加入/結束 警衛,手動反彈和回答民意調查. UI 煙霧測試包括: `/kaigi` 在桌面和移動尺寸的視頻端上. 兩個錢包之間的直播媒體仍然需要手動兩窗口測試,因爲瀏覽器攝像頭/麥克風權限和同行媒體流量是特定環境的.

對於樣本集成代碼,請見 [在 JavaScript App](/zh-hant/guide/tutorials/kaigi.md)中包含 Kaigi.

## 狀態和指標 {#status-and-metrics}

狀態和指標終端點是第一個進入儀表板的東西:

- `/status` 揭示頂級同行,區塊,隊列和共識領域
- `/metrics` 暴露了Prometheus計量器,測量儀和歷史圖表

在啓用 Nexus 的節點上,狀態輸出還包括車道和數據空間意識的部分.當`nexus.enabled = false`時,這些部分會被省略.

## JSON vs Norito {#json-vs-norito}

幾個運營商終端點默認返回 Norito.當終端點支持 JSON,發送:

```http
Accept: application/json
```

這對於以下情況尤其有用:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

當終端點接收或直接輸入 Norito 時,使用`application/x-norito`作爲內容類型或首選 `Accept`值.查看 [Norito](/zh-hant/reference/norito.md#torii-and-norito-rpc)的運輸細節.

## 遠程測量個人資料 {#telemetry-profiles}

終點可見性取決於節點的 `telemetry.profile`設置.當前配置顯示了五個個人資料級別:

|個人資料|`/status`|`/metrics`|開發人員的路線|
| --- | --- | --- | --- |
|`disabled`|沒有.|沒有.|沒有.|
|`operator`|是的.|沒有.|沒有.|
|`extended`|是的.|是的.|沒有.|
|`developer`|是的.|沒有.|是的.|
|`full`|是的.|是的.|是的.|

## CLI 快捷方式 {#cli-shortcuts}

`iroha` CLI 已經包裹了許多這些終端點:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## 上游引用 {#upstream-references}

- [README API 和可觀測性概述](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022橋樑實施](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [性能和指標](/zh-hant/guide/advanced/metrics.md)
