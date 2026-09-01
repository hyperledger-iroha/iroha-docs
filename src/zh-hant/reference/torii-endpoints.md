---
translation_locale: zh-hant
translation_source: /reference/torii-endpoints.md
translation_source_hash: f04e5e78329996d70926c4fd5dc034d41605d0a82fffd6460f67b252269480d9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Torii 端點 {#torii-endpoints}

Torii 是 Iroha 3 的 HTTP、SSE 和 WebSocket 閘道。它同時提供面向帳本的 APIs 和維運端點。

目前的協議規則是:

- 規範二進位制格式為 Norito
- 在傳送 `Accept: application/json`時,許多終端也支援 JSON
- 在Prometheus格式中顯示了指標.

對於格式細節,內容談判,佈局標誌,方案雜湊和 Norito RPC 指導,請參見[Norito 參考](/zh-hant/reference/norito.md).

## 共同的端點 {#common-endpoints}

|端點|格式| 用途                                                          |
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions`|Norito|提交簽署的交易|
|`POST /v1/query`|Norito|提交一個簽名的查詢|
|`GET /v1/events/ws`|WebSocket|訂閱活動流程|
|`GET /v1/events/sse`|SSE|訂閱 SSE 以上的事件流|
|`GET /v1/blocks/stream`|WebSocket|流動提交的區塊|
|`GET /v1/peers`|JSON|Torii 所暴露的對等節點列表 |
|`GET /livez`|文字|只有流程活力;它並不意味著協議準備性 |
| `GET /readyz` | JSON | 完整節點就緒狀態，包括強制離線現金檢查 |
|`GET /health`|JSON|準備探測器使用相同的離線現金不可變數|
|`GET /v1/api/version`|文字|現在的區塊標題版本|
|`GET /status`|Norito 或 JSON |高階診斷狀態; 明確請求 JSON |
|`GET /metrics`|普羅梅蒂烏斯|普羅梅斯的剪傷端點|
|`GET /v1/schema`|JSON|當啟用時,節點服務的資料模型方案快照|
|`GET /openapi.json`|JSON|OpenAPI 檔案,用於活躍的 Torii HTTP 航線|
|`GET /v1/parameters`|JSON|節點引數快照|
|`GET /v1/node/capabilities`|JSON|節點能力和資料模型後設資料|
|`GET /v1/time/now`|JSON|節點牆時鐘快照|
|`GET /v1/time/status`|JSON|時間同步狀態|

對於 SSE 請求,廣告原始流量加上輸入後退:

```http
Accept: text/event-stream, application/json
```

Torii 首先在請求層上談判 JSON 或 Norito 的代表性,然後驗證原生`text/event-stream`響應.因此只傳送`text/event-stream`被拒絕使用`406`;[流事件操作指南](/zh-hant/cookbook/stream-events.md)使用完整標題.

`/openapi.json`是該方案中表示的路線的生成合同,而不是完整的運營探測器庫存.當前文件遺漏了`/livez`和`/readyz`,其 `/health`描述可能會落後於準備處理器從現場文件生成路線客戶端,但直接對執行節點和固定處理器進行活力和準備驗證.確切的表面仍然取決於構建功能和執行階段配置.使用 [Torii API 控制檯](/zh-hant/reference/torii-api-console.md)來載入該現場文件,測試 JSON 路線,複製 curl 請求,並從當前的方案中生成客戶端程式碼.

每個名單支援的 OpenAPI 操作都包含一個`x-iroha-route-auth`物件.名單支援 MCP 的工具都暴露出與 `_meta["iroha/routeAuth"]`相同的合同.兩個投影都攜帶`schemaVersion`, `stableRouteId`, `authentication`和 `admission`.處理版本 `1`作為一個準確的合同:拒絕不支援的 `schemaVersion` 而不是猜測其認證或錄取標籤應該如何解釋.路線後設資料描述了請求邊界;它不會取代該邊界所要求的憑證.

## 試看直播 Taira 路線 {#try-live-taira-routes}

公共的 Taira 測試網暴露出應用客戶端僅用於閱讀探索的相同的 Torii JSON 表面.這些命令不需要金鑰:

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

如果公開測試網路路線返回 `502`,時間停止,或報告一個和的佇列,將其視為端點可用性問題,然後在調整客戶端程式碼之前再嘗試.

## 達成共識和執行階段端點 {#consensus-and-runtime-endpoints}

下面的每個 Sumeragi 路線都需要運營商請求籤名.狀態,診斷,流,領導者,關鍵, QC 和引數路線也需要設定遠端測量功能.

|端點|格式| 用途                                                 |
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
|`GET /v1/sumeragi/status`|Norito 或 JSON |權威的減產者持有的共識狀態|
|`GET /v1/sumeragi/diagnostics`|JSON|無權威的管道,排隊和通道診斷|
| `GET /v1/sumeragi/status/sse` | SSE | 持續的權威共識狀態串流 |
|`GET /v1/sumeragi/leader`|JSON|目前的領導資訊 |
|`GET /v1/sumeragi/qc`|Norito 或 JSON |最高的和鎖定的數證書快照|
|`GET /v1/sumeragi/consensus-keys`|JSON|活躍的共識金鑰|
|`GET /v1/sumeragi/bls-keys`|JSON|活躍的 BLS 共識金鑰|
|`GET /v1/sumeragi/params`|JSON| 連鎖電流 Sumeragi 引數                    |
|`GET /v1/sumeragi/evidence`|JSON|選擇性按查詢字串過的證據記錄|
|`GET /v1/sumeragi/evidence/count`|JSON|證據記錄數量|
|`GET /v1/runtime/abi/active`|JSON|活躍執行階段描述器 ABI |
|`GET /v1/runtime/abi/hash`|JSON|活躍執行階段 ABI 雜湊|
|`GET /v1/runtime/metrics`|JSON|執行階段指標快照|
|`GET /v1/runtime/upgrades`|JSON|執行階段升級列表|
|`POST /v1/runtime/upgrades/propose`|JSON|提議升級執行階段|
|`POST /v1/runtime/upgrades/activate/{id}`|JSON|啟動擬議的執行階段升級|
|`POST /v1/runtime/upgrades/cancel/{id}`|JSON|取消擬議的執行階段升級|

## 應用程式和 SORA 路線家庭 {#app-and-sora-route-families}

當 Torii 用面向應用程式的功能集構建時,它會暴露在探索者, SORA 服務,橋樑流量,證明和儲存的額外 JSON 家庭中.這些家庭並非所有網路配置檔案都啟用.

`/openapi.json`描述了在生成的app-API 目錄中註冊的路線;它對所包含的條目是權威的,而不是每個安裝的路線. 特別是公共局域 SoraFS CID 和已知路線在生成的檔案之外安裝,必須直接進行探測.

|路線家族| 用途                                                                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/*`, `/v1/domains/*`,`/v1/assets/*` |JSON 閱讀,查詢輔助器,登入輔助器以及投資組合或持有者的檢視|
|`/v1/nfts/*`, `/v1/rwas/*`,`/v1/confidential/*` |NFT,現實資產,以及機密資產檢視|
|`/v1/aliases/*`, `/v1/assets/aliases/*`,`/v1/sns/*`, `/v1/identifiers/*` |姓名,別名和識別符解析度|
|`/v1/explorer/*`|基於探索器的帳戶,資產,區塊,交易,指令,指標和流量檢視.|
|`/v1/transactions/*`, `/v1/pipeline/*`,`/v1/iso20022/*` |交易歷史,管道恢復或狀態以及 ISO 20022助理|
|`/v1/contracts/*`|合同程式碼,部署,捆綁,呼叫,檢視,事件,活動,推進和狀態路線|
|`/v1/multisig/*`, `/v1/controls/*` |多簽署的提案,批准和轉移控制輔助者 |
|`/v1/bridge/*`, `/v1/ledger/*`,`/v1/proofs/*` |終止性,狀態證明,區塊證明,證明保留和證明查詢路線|
|`/v1/da/*`|資料可用性攝入,清單,證明政策,承諾和明確意圖 |
|`/v1/zk/*`|ZK 根,證明驗證, IVM 證明,投票計數,驗證鑰匙,證明記錄和附件 |
|`/v1/gov/*`, `/v1/ministry/*` |管理提案,投票表,理事會狀態,保護名字空間,議程建議,頒佈和最終制定|
|`/v1/nexus/*`, `/v1/sccp/*` |Nexus 通道,資料空間和跨鏈防護輔助員|
|`/v1/musubi/*`|Musubi 包裝登錄檔閱和指令製造商|
|`/v1/subscriptions/*`|訂閱計劃,訂閱生命週期,使用和收費助手|
|`/v1/sorafs/*`, `/sorafs/*`,`/.well-known/sorafs/*` |SoraFS 供應商的發現,能力驗證,釘選,儲存收集和公開內容服務 |
|`/v1/soracloud/*`, `/v1/soradns/*`,`/soradns/*`, `/api/*` |SoraCloud 服務生命週期,私人計算/模型流量,公開發現和託管應用程式路由 |
|`/v1/connect/*`, `/v1/vpn/*` |Iroha 連線會話, WebSocket 運輸,VPN 會議,個人資料和收據|
|`/v1/app-api/*`, `/v1/api/*`,`/v1/content/*` |應用程式 API 繫結和捆綁/CID 支援的內容路由 |
|`/v1/operator/*`, `/v1/mcp` |運營商認證和本地 MCP JSON-RPC 橋樑 |
|`/v1/offline/*`, `/v1/repo/*`,`/v1/space-directory/*`, `/v1/ram-lfe/*` |線上準備,儲存協議,資料空間清單和[RAM-LFE 助手](/zh-hant/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/*`, `/v1/webhooks/*`,`/v1/notify/*`, `/v1/telemetry/*` |合作,網路連線,推送通知和直播遠端測量整合|

## 帳戶身份驗證、可見性和 Explorer 遊標 {#account-authentication-visibility-and-explorer-cursors}

### 應用程式帳戶請求協議 {#app-account-request-protocol}

面向應用程式的路由接受下列三種形式之一：不帶任何驗證標頭、一個直接單一金鑰證明，或一個多重簽章見證。每個驗證標頭最多隻能出現一次。

為了得到直接的證明,請把四個標題都放在一起:

- `X-Iroha-Account`:正確的規範小字母 `0x`帳戶地址六字母或活躍的規範 ASCII 帳戶別名. I105 文字不安全作為一個 HTTP 欄位值;使用規範六字母拼寫為該帳戶.
- `X-Iroha-Signature`:嚴格填充的64基簽名有效載荷.
- `X-Iroha-Timestamp-Ms`：規範的無符號十進位 Unix 毫秒時間戳，且位於設定的時鐘偏差視窗內。
- `X-Iroha-Nonce`: 1至256可列印 ASCII 位元組 (`0x21` 透過 `0x7e`),在重播視窗中是唯一的.

已註冊的單鍵控制器簽署了這些位元組:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

規範查詢建構會將原始查詢剖析為 `application/x-www-form-urlencoded`（`+` 表示空格），對各鍵值對進行百分號解碼，按 `(key, value)` 排序，然後重新進行表單編碼。協定最多允許 64 個解碼後的鍵值對和 64 KiB 原始查詢文字。必須對傳輸時的確切本文位元組進行雜湊。不得在固定的 32 位元組網路 ID 與大寫方法之間插入分隔符號。

V1 驗證器還會在剖析前將方法權杖限制為 32 位元組、將百分號編碼的要求路徑限制為 64 KiB，並將直接帳戶身分限制為 36 KiB。帳戶別名有更嚴格的結構限制：三個名稱區段及其分隔符號。超過任一限制會在簽章驗證或按來源大小配置記憶體之前導致驗證失敗。

多重簽章控制器必須改為將 `X-Iroha-Witness` 作為嚴格且帶填補的 Base64 規範 Norito 傳送，並省略 `X-Iroha-Signature`、`X-Iroha-Timestamp-Ms` 和 `X-Iroha-Nonce`。在此形式下，`X-Iroha-Account` 是選擇性的；如果存在，它必須等於見證中的 `subject_account`。`CanonicalRequestWitnessV1` 包含 `schema_version`、`subject_account`、`timestamp_ms`、`nonce`、從方法到本文摘要的精確網路要求位元組之 Iroha `Hash`（不含新鮮度欄位），以及最多 64 個成員簽章。每個成員都對不含簽章陣列之同一承載的規範 Norito 編碼簽章。已驗證成員必須滿足該帳戶目前的多重簽章原則。編碼後的見證上限為 1 MiB。

提供無身份驗證標題選擇匿名訪問.提供任何部分,混合,重複,錯形,過時或重播的證明失敗了身份驗證;它從來沒有回到匿名可見性.

### 運營商請求協議 {#operator-request-protocol}

標記為經營者認證的路線需要所有四個單標頭:

- `x-iroha-operator-public-key`:規範的 Iroha 多密碼公鑰.
- `x-iroha-operator-timestamp-ms`:在毫秒的規範未簽名的Unix時刻標誌.
- `x-iroha-operator-nonce`: 1至256個可列印的 ASCII 位元組,是重播視窗中的該鍵的唯一位元組.
- `x-iroha-operator-signature`:嚴格填充的64基簽名有效載荷.

標頭值不得包含前後空白。維運人員金鑰對以下內容簽署：

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

路徑,查詢,體格,時刻印章和nonce規則是應用程式協議使用的相同的規範規規則.關鍵也必須由 `[torii.operator_signatures]`:列出在 `allowed_public_keys`,或明確啟用`allow_node_key`當使用節點鍵時.重放快取飽和時，系統會以 `503 Service Unavailable` 採用失敗關閉策略。

準確的申請簽名是必須的. `[torii.operator_auth].enabled = true`, 每個普通運營商路線也需要有效的路線 `x-iroha-operator-session`; 什麼時候 `require_mtls = true`, 它還要求 `x-forwarded-client-cert` 任何一個因素都不能取代請求籤名.

WebAuthn 註冊和登入使用以下四個 JSON 端點:

|方法和端點| 用途                                  |
| --------------------------------------------- | ---------------------------------------- |
|`POST /v1/operator/auth/registration/options`|開始 WebAuthn 憑證註冊|
|`POST /v1/operator/auth/registration/verify`|驗證和堅持憑證|
|`POST /v1/operator/auth/login/options`|開始 WebAuthn 身份驗證|
|`POST /v1/operator/auth/login/verify`|驗證宣告,併發出會議.|

配置 `torii.operator_auth.tokens` 用專門的啟動鏈值.在任何證書存在之前,請傳送一個為 `x-iroha-operator-token`開始首次註冊.該代幣從來不授權普通操作員路線,而聽取者`x-api-token`值永遠不會用於此流程.一旦一個憑證存在,註冊另一個憑證需要進行驗證的會話.登入驗證返回會話代幣以與每個新鮮的網路操作員請求籤名一起傳送.憑證在 `<torii.data_dir>/operator_auth/operator_webauthn.json`下保留.

ISO 20022路線採用兩個獨立的檢查. 要求必須首先透過運營商許可名單和簽字協議; ISO 處理器則需要相同的金鑰,以佔據以下描述的準確參與者或審計角色.

### 賬本可見性和探險器曲者 {#ledger-visibility-and-explorer-cursors}

應用程式面向賬本閱讀使用上述可選的應用程式帳戶邊界.未簽名請求只接收為公開配置的資料空間.有效的簽名請求新增連線到呼叫者的當前 UAID 的資料空間,每個受限的資料空間以準確的 `CanReadRestrictedDataspace { dataspace }`許可命名,或者所有路線,如果帳戶有 `CanReadAllLedgerData`.

使用與呼叫者的授權主體相匹配的路線:

|方法和端點|驗證和可見性|
| ------------------------------------- | --------------------------------------------------------------- |
|`POST /v1/transactions/visible/query`|卡通帳戶簽名;應用呼叫者的可見性|
|`POST /v1/transactions/query`|運營商請求籤名;允許全球運營商檢視|
|`GET /v1/triggers/completed`|運營商請求籤名;讀取節點本地完成記錄|

同一可見性物件會篩選帳戶、網域、資產定義、資產、NFT、RWA、持有者和 Explorer 讀取。不存在的物件與位於呼叫者可見路由之外的物件會刻意保持不可區分。只有交易所記錄的每個路由區段均可見時，才會顯示已提交的交易和指令歷程。因此，只要有一個參與方路由區段超出呼叫者範圍，混合資料空間交易就會被隱藏；缺失、過時或格式錯誤的路由內容僅對全域讀取者可見。

由世界狀態支援的六個 Explorer 集合使用不透明的規範 base64url 鍵集遊標。預設頁面限制為 25，最大值為 100，每頁最多檢查 512 個候選鍵。每個遊標都繫結至其集合、篩選條件、規範最後鍵，以及呼叫者的可見路由集摘要，因此不能在另一個查詢中重放，也不能在呼叫者可見性發生變更後重放。

區塊,交易,最新交易,指令和最新指令的歷史游標還會固定已提交快照的高度與區塊雜湊.響應顯示`pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`,和 `pagination.has_more`.另一個路線或過濾器設定的導向器,改變的可見性摘要,或者節點不再可以驗證的快照被關閉.在阻塞工作者執行時,歷史掃描仍然存在於 Torii 的查詢錄取許可中.

Explorer WebSocket 串流會發出經過篩選的摘要，並隨著帳本許可權變更重新計算可見性。原生 `GET /v1/blocks/stream` 路由有所不同：它會發出完整的已簽署區塊，在交握期間要求 `CanReadAllLedgerData`，並在該許可權後來遭到撤銷時關閉。不要將原生串流用於限定資料空間範圍的 Explorer。

## ISO 20022 橋 {#iso-20022-bridge}

Torii 將 ISO 20022橋暴露在 `/v1/iso20022/*`下,當應用程式面向 API 和橋執行階段啟用時.橋是故意設定的:它不是一個一般用途的 ISO 20022清算閘道器,而是用於將選定的支付訊息轉換為簽署的 Iroha 轉賬和跟蹤其賬本狀態的支援子集.

在允許任何提交之前配置一個持久的本地 `torii.iso_bridge.store_dir`. 配置欄位僅是可選的,因此節點可以啟動只用於閱讀或診斷使用:每個認證的 ISO 提交都需要目錄,並且在沒有永續性或重播重播防護標記或富記錄寫失敗時返回可複試`503 Service Unavailable`.

### Torii ISO 20022 端點 {#torii-iso-20022-endpoints}

|方法和端點| 用途                                                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
|`POST /v1/iso20022/pacs008`|提交 FI 到 FI 客戶信貸轉賬,並構建匹配的 Iroha 資產轉賬|
|`POST /v1/iso20022/pacs009`|提交用於 PvP 或與證券相關的現金資助的 FI 到 FI 信用轉賬|
|`POST /v1/iso20022/pacs002`|提交對方所擁有的支付狀態報告;結算需要提交的交易證據 |
|`POST /v1/iso20022/pacs004`|提交對方所擁有的付款申報表|
|`POST /v1/iso20022/camt056`|提交原始人的取消支付請求|
|`POST /v1/iso20022/sese023`|提交證券結算說明|
|`POST /v1/iso20022/sese024`|提交對方所有的證券結算狀態資訊 |
|`POST /v1/iso20022/sese025`|提交對方持有的證券結算確認|
|`POST /v1/iso20022/colr012`|提交一個擔保替代資訊|
|`GET /v1/iso20022/messages/{msg_id}`|閱讀一條經典的橋樑記錄|
|`GET /v1/iso20022/audit/messages`|閱讀"改"的資訊審計表|
|`GET /v1/iso20022/messages/{msg_id}/pacs002`|將當前支付狀況歸納為 `pacs.002` XML |
|`GET /v1/iso20022/messages/{msg_id}/pacs004`|提交當前支付申報表為 `pacs.004` XML |
|`GET /v1/iso20022/messages/{msg_id}/camt029`|輸出當前取消解析度為 `camt.029` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese024`|轉換當前結算狀態為 `sese.024` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese025`|提交當前結算確認號為 `sese.025` XML |

`pacs.008` 提交的內容必須提供資訊 ID, 銀行間結算金額,貨幣,結算日期,債務人和債權人 IBANs, 債務人和債權人 BICs. 當設定參考資料時,橋也會檢查 BIC, IBAN, 和 ISO 在生成的交易進入管道之前,4217個貨幣交叉路口.

`pacs.009`提交的資訊必須包含業務訊息 ID,資訊定義 ID,建立時間,銀行間結算額,貨幣,結算日期,指示和指令代理人 BICs,債務人和信貸者 IBANs.如果資訊包含`Purp`,橋樑目前只接受用於證券的資金: `Purp=SECU`.

其他 `pacs.008` 和 `pacs.009` 提交端點接受 XML ISO 封裝，或橋接測試所用的扁平欄位格式。可選的 `SplmtryData` 欄位可以固定目標 Iroha 賬本、來源和目標帳戶 IDs 或位址以及資產定義 ID。回應為 `202 Accepted`，並包含 `message_id`、`transaction_hash`、`status`、`pacs002_code` 和解析後的賬本／帳戶／資產上下文。

### 參與者授權和生命週期所有權 {#participant-authorization-and-lifecycle-ownership}

每個啟用橋都有參與者目錄.每個參與者入口都有一個獨特的參與者 ID,一個或多個運營商公鑰,一個或更多的財務識別符號,允許配置檔案集以及`originator`, `counterparty`或兩個角色.運營商金鑰和財務識別符不能屬於多個參與者.單獨配置 `audit_admin_keys`;審計管理員金鑰也不能成為參與者的突變金鑰.

所有 ISO 路由都要求新的操作員簽章。對於首次提交 `pacs.008`、`pacs.009`、`sese.023` 或 `colr.012`，經過驗證的操作員必須屬於應用程式標頭 `From` 中的金融身分所識別的參與者。`To` 身分必須解析為具有 `counterparty` 角色的已設定參與者，且所選設定檔必須同時獲準用於雙方。持久准入記錄會儲存發起方、交易對手方、准入參與者和操作員金鑰，以及原始設定檔和內嵌簽章原則。

生命週期授權來源於該不可改變的記錄,而不是來自呼叫者選擇的值:

|生命週期資訊|要求參與者|
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`,`sese.024`, `sese.025` |具有 `counterparty`角色的原始對方 |
|`camt.056`|具有 `originator`角色的原始創始人|

原始的個人資料和簽名政策將保留在整個檔案中呼叫者不能選擇一個較弱的配置檔案來更新. `pacs.002` 代表結算的程式碼 (`ACSC`, `ACCP`, `SETT`, 或 `SETTLED`) 只有當原始記錄被調整為結算 Torii 已提交交易證據.

原始交易的任一方都可以讀取其訊息記錄及產生的寄件匣文件。稽核端點只會傳回已驗證參與者為發起方或交易對手方的記錄。另行設定的稽核管理員可取得全域唯讀稽核檢視，但不能提交或變更訊息。系統不會揭露未知參與者或不相關訊息識別碼是否存在。

### 持久重播身份和簽署的輸出箱檔案 {#durable-replay-identity-and-signed-outbox-documents}

重放重播防護標記是嚴格的准入邊界。對於無法讀取、過大、格式錯誤、名稱錯誤、衝突或明確不相容的重播防護標記，Torii 會中止啟動。對於結構描述版本明確不相容的詳細記錄、目前設定中不存在的參與者、設定檔或簽章原則，或缺失或不相符的即時重播防護標記，Torii 也會中止啟動。

其他詳細記錄損壞的處理方式不同：不可讀或過大的檔案、無效 JSON、無效的目前架構記錄、非規範檔名以及相互衝突的重播身分，會記入日誌或略過。不可讀或無效的目前版本稽核索引會根據保留的記錄重新產生；只有明確不相容的稽核索引版本才會中止啟動。請監控啟動日誌並核對重新產生的稽核資訊清單，不要假定每個損壞的詳細記錄檔案都會阻止節點提供服務。

每筆保留的詳細記錄都儲存不可變的參與者來源。即使詳細記錄內容遭到清除，一個獨立的持久重播防護標記仍會在完整的去重 TTL 期間保留訊息 ID、承載雜湊、業務訊息 ID 和 UETR。

Torii 會在簽署或處理生命週期訊息之前持久化重放准入記錄。它絕不會逐出尚未到期的重放身分。如果設定容量完全由受保護記錄或尚未到期的重放身分佔用，提交會收到可重試的 `503 Service Unavailable`，且不會變更生命週期或記帳狀態。

每個生成的 `pacs.002`, `pacs.004`, `camt.029`, `sese.024`或 `sese.025` 文件都以`application/xml` 為回應標題返回:

|標題| 含義                                               |
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain`|總是 `iroha.iso20022.outbound.v2`|
|`X-Iroha-Iso-Signer`|配置橋簽名器的公開標準鑰匙|
|`X-Iroha-Iso-Signature`|在域分隔的 XML 位元組上使用Base64簽名|

驗證 UTF-8 位元組序列 `iroha.iso20022.outbound.v2`,一個零位元組,以及精確的響應體上的簽名. 在驗證之前不要重新格式化或正常化 XML.

### 額外的解析和繪圖支援 {#additional-parser-and-mapping-support}

IVM ISO 輔助器還驗證並實現下列資訊家族,用於封裝驗證,定居地圖化或下游調整.它們沒有獨立的 Torii 路線.

|訊息家庭|目前的支援|
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
|`head.001`|商業應用程式標題驗證 ISO 封,包括 `BizMsgIdr`, `MsgDefIdr`,建立時間和可選的傳送/接收者 BIC 欄位|
|`pacs.007`, `pacs.028`,`pacs.029` |支付逆轉,狀態要求和調查解決/狀態分析|
|`pain.001`, `pain.002` |客戶支付啟動和支付狀態報告驗證 |
|`camt.052`, `camt.053`,`camt.054` | 帳戶報告、對帳單與通知的驗證                                                                                               |

## Kaigi 會議 {#kaigi-sessions}

Kaigi 在 SORA Nexus 上提供付費的實時音訊/影片室. 使用它,當應用程式需要建立賬本支援的會話,變更名單,繼電錶格,加密訊號和使用計量,而不是將所有會議狀態關閉鏈.

面向賬本的生命週期是:

- `CreateKaigi`:在域名下建立呼叫,並儲存其政策,時間表,後設資料和可選的繼電說明書.
- `JoinKaigi`:更新呼叫名單.在 `zk-roster-v1`模式下,公開呼叫檢視顯示了承諾和無效數量,而不是參與者帳戶 IDs.
- `LeaveKaigi`:將參與者從透明呼叫中移除.私人模式的離開在首發協議中是離鏈的.
- `RecordKaigiUsage`:新增計量時間和gas總數.
- `EndKaigi`:結束會議並記錄最後的時刻.

Torii 揭示了以下面嚮應用程式的讀數:

|路線|驗證| 用途                                    |
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
|`/v1/kaigi/calls/{call_id}`|公共|目前的呼叫記錄|
|`/v1/kaigi/calls/{call_id}/signals`|準確網路帳戶要求|頁面化的提交訊號傳輸後設資料|
|`/v1/kaigi/calls/{call_id}/events`|準確網路帳戶要求|呼叫生命週期流程|
|`/v1/kaigi/relays`|允許上市的運營商請求|連線總結|
|`/v1/kaigi/relays/{relay_id}`|允許上市的運營商請求|一個繼電器的註冊和健康細節 |
|`/v1/kaigi/relays/health`|允許上市的運營商請求|綜合繼電器健康|
|`/v1/kaigi/relays/events`|準確網路帳戶要求|連線註冊和健康活動流程|

必須啟用應用程式 API。中繼摘要和健康狀態路由即使是唯讀的，也屬於營運者介面；未簽署的 `curl` 要求不是有效的可用性探測。工作階段狀態還會透過 `KaigiRosterSummary`、`KaigiRelayManifestUpdated`、`KaigiRelayHealthUpdated` 和 `KaigiUsageSummary` 等 Kaigi 網域事件反映。

### CLI 冒煙測試 {#cli-smoke-test}

開始使用 `iroha app kaigi` CLI 當您想驗證 Torii 端點在連線 UI 之前接受 Kaigi 交易時.快啟動命令會對配置的端點建立一個空間,列印其呼叫識別符號,並加入後設資料:

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

對於編寫的流量,明確管理房間生命週期:

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

使用 `--room-policy public` 對於繼電器可以在沒有觀眾門票的情況下暴露的房間,或 `--room-policy authenticated` 當出口必須需要觀眾身份驗證時. `--privacy-mode zk-roster-v1` 只有在網路獲得了 Kaigi 列表和使用驗證鍵配置;否則連線,頁面,在確定性驗證過程中,私人使用記錄失敗.

### JavaScript 整合 {#javascript-integration}

目前的 [Iroha JavaScript 演示](https://github.com/soramitsu/iroha-demo-javascript)實現了透明,認證的一對一會議配置檔案.它不暴露協議的`zk-roster-v1`證明流程.它的渲染器建立 WebRTC 的提議和應答,而特權橋樑使用本地 [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js)工作副本來報價,簽署,提交併等待完成的 Kaigi 交易.

檢視 [在 JavaScript App](/zh-hant/guide/tutorials/kaigi.md)中嵌入 Kaigi,準確的路線身份驗證,邀請格式,橋邊界和當前的演示測試指令.

## 狀態和指標 {#status-and-metrics}

狀態和指標端點是第一個進入儀錶板的東西:

- `/status` 揭示頂級對等節點,區塊,佇列和共識領域
- `/metrics` 暴露了Prometheus計量器,測量儀和歷史圖表

在啟用 Nexus 的節點上,狀態輸出還包括通道和資料空間意識的部分.當`nexus.enabled = false`時,這些部分會被省略.

## JSON vs Norito {#json-vs-norito}

幾個運營商端點預設返回 Norito.當端點支援 JSON,傳送:

```http
Accept: application/json
```

這對於以下情況尤其有用:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

當端點接收或直接輸入 Norito 時,使用`application/x-norito`作為內容型別或首選 `Accept`值.檢視 [Norito](/zh-hant/reference/norito.md#torii-and-norito-rpc)的運輸詳細資訊.

## 遠端測量個人資料 {#telemetry-profiles}

端點可見性取決於節點的 `telemetry.profile`設定.當前配置顯示了五個個人資料級別:

|個人資料|`/status`|`/metrics`|開發人員的路線|
| ----------- | --------- | ---------- | ---------------- |
|`disabled`|沒有.|沒有.|沒有.|
|`operator`|是的.|沒有.|沒有.|
|`extended`|是的.|是的.|沒有.|
|`developer`|是的.|沒有.|是的.|
|`full`|是的.|是的.|是的.|

## CLI 快捷方式 {#cli-shortcuts}

`iroha` CLI 已經包裹了許多這些端點:

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## 上游引用 {#upstream-references}

- [README API 和可觀測性概述](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 橋接實作](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [效能和指標](/zh-hant/guide/advanced/metrics.md)
