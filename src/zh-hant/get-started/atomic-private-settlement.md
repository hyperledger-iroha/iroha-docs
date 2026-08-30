---
translation_locale: zh-hant
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 18b5e9c80bfa5542b996548fd07603a311099f76a4443cf143cd959991f80dc3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 運行原子私人跨數據空間解決方案 {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1`在每一個2到255個 SORA Nexus 數據域中協調一個機密結算腳本,並在一項全球狀態交易中完成每個腳本.被拒絕,過期或中止的捆綁不適用於任何腳本.透明原生 AMX DvP/PvP 仍然是單獨的協議路徑.

::: warning 發佈狀態 這個功能是受規範的,默認禁用,
並且還沒有生產能力.在公佈的功能,隱私,故障,性能,可複製性構建之前,不要爲實際值 CBDC 啓用.獨立的加密審查,以及文物出版門都通過了準確的發佈.

## 協議所隱藏的內容 {#what-the-protocol-hides}

每條腿都使用固定的兩輸入,三輸出私人筆記證明.委員會驗證人員驗證了證據和不透明狀態過渡;他們沒有接收平文部分,資產,金額,備忘錄或業務結果.授權的本地審計員解密了填充的審計囊,檢查了這些內容,並簽署了一份針對目的的單獨批准.默認政策接受由受監管的審計員集中的一個批准.

公共運輸商和收據故意披露:

- 網絡和捆綁標識符
- 參與者數據空間路線和參與者的數量
- 時間和過期的高度
- 穩定的不透明池標識符,根,取消符,承諾和固定加密文本插槽
- 委員會當局和準確的3/4可用性,準備和承諾證書
- 支持者,公共網絡費用和終端狀態

這就是內容的保密性,而不是流量匿名性. 時間表,參與者數量,數據空間身份和穩定池活動仍然是公開的.只容納一個 CBDC 的數據空間也可以使資產從路線下降,即使沒有字面上的資產識別符發佈.

## 部署要求 {#deployment-requirements}

在激活之前,運營商需要所有以下條件:

1. 每個參與數據空間的確切四個驗證器,具有不同的 BLS 共識密鑰和擁有證明.
2. 強制性 Sumeragi DA/RBC 可用於每一個高度
3. 一個管理的機密結算池和每一個數據空間中的初始根
4. 一個活躍的 V1 私人筆記功能和單獨的結算證明配置文件
5. 至少有一個受監管的本地 `PrivateSettlementAuditPolicyV1`,包括不同的審計簽名和混合加密密鑰,一個關鍵時代,高度有效性和批准門
6. 在配置的保留期內,足夠的私人側車存儲
7. 一個能夠提交最終公共運營商的中立贊助商賬戶

審計員也可以運行驗證器,但必須使用單獨的共識,審計簽名和審計加密密鑰.保持退休的解密密鑰在監管保留期內,或在退休之前管理和測試囊重新包裝.

四個驗證器權威是國家固的,不是由客戶提供. 在表格 `authority_context_height`,每個驗證器解決了精確的排列車道/數據空間名單和從需要解決的高度匹配,並驗證四個 BLS 鑰匙和持有證明. 上傳,準備和最終收件錄取都使用相同的歷史權威.

## 設置錄取 {#configure-admission}

所有生產行爲都來自節點配置.環境變量不能激活這個路徑. 發送的默認是 `enabled = false`;將功能禁用不需要任何定位特定的配置.

管理人員已註冊所需的功能,並以適當的通知選擇了激活高度後,將每個相關節點都配置一致:

```toml
[nexus.atomic_private_settlement]
enabled = true
activation_height = 500000
minimum_activation_notice_blocks = 7200
proof_profile_version = 1
max_participants = 255
max_expiry_blocks = 7200
audit_timeout_blocks = 1200
prepare_timeout_blocks = 1200
commit_timeout_blocks = 1200
capsule_padding_classes_bytes = [4096, 16384, 65536, 262144]
max_proof_bytes = 8388608
max_capsule_bytes = 1048576
max_carrier_bytes = 4194304
sidecar_retention_blocks = 1000000
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
default_min_auditor_approvals = 1
permitted_policy_versions = [1]
```

該例子使用運送的 V1 限制,而不是性能建議. 在選擇運營界限之前,測量預期硬件的存儲,證明,囊,載體和延遲包裹. 在 `max_expiry_blocks` 中,三個階段的時間切斷必須適合,並且側車保留至少應達到該期限窗口.

`max_capsule_bytes`限制了整體 `PrivateSettlementAuditCapsuleV1`的正規 Norito 編碼: AAD,非字符,密碼文本,向量框架,審計員身份和每一個包裹的 DEK 行.每個配置的填充類別都必須適應至少 `default_min_auditor_approvals`審計員的保守整體囊包裹. Torii 也拒絕了一項新被允許的政策,其 `min_approvals` 位低於該規定的層次,並且拒絕任何實際的囊,其完整的法典編碼太大.

`max_carrier_bytes`不僅限於受認證的捆綁,但限制了完全的法規贊助商簽署的交易.計數包括註冊指令框架,交易權威和元數據,費用意圖和簽名.普通的網絡交易限制仍然適用於獨立的上限.

除非管理功能是活躍的,其狀態和激活高度符合通知期限,編譯的證據配置文件匹配 V1,以及連鎖池和審計記錄是當前的,否則激活將無法關閉.僅啓用配置標誌是不夠的.

## 結算工作流程 {#settlement-workflow}

客戶本地構建證據和加密囊.祕密證人必須留在原生錢包或原生工作者中;不要將它們串行成申請日誌, Python 對象, HTTP 請求或持久的協調記錄.

包裝囊和每個審計人 DEK 的認證數據包括確切國家支委員會和 `authority_context_height`的消化,以及網絡,包裝的關鍵不能轉移到另一個名單或歷史權威背景.

對於每條規律的腳,協調員然後執行這個序列:

1. 將暫時加密材料上傳到所有四個驗證器,並獲得法定準確的3/4可用性證書.
2. 讓一個受授權的審計師來檢查並解密其囊,重新計算公開約束,並提交批准.
3. 在投票之前,每個驗證者獨立檢查和穩定地進行分別測試.在每一個測試的響應者身上,保持可規定的3/4預備證明.
4. 在每個腿都有準備證書後,建立不可變的完整的準備屏障. 要求和堅持可行的3/4承諾證書. 如果協調器重新啟動，請向參與節點查詢其在本機持久保存的 Prepare 和 Commit 憑證，選擇一個與該法定人數等效的規範憑證，並在繼續之前重新分發；切勿從未經驗證的本機快取重建憑證。
5. 有明確的贊助商標籤,並提交一個全球航母.航母包含一個 `FinalizeAtomicPrivateSettlementV1` 指令和完整的認證捆綁.協調員和 WSV 飛行前測量了完整的盒裝完成指令,包括註冊指令框.Torii 和核心一次性運營商的約束力執行`max_carrier_bytes`對準確的法規贊助商簽署交易,包括權威,元數據,費用意圖和簽名.Torii 在其權威背景之前,在或以後的最後一個進入高度可能到期或超出規定的過期期限時拒絕運營商.
6. 查詢公開捆綁狀態和收件,直到全球最終完成.處理本地側車狀態爲暫時的,直到它調整了不可改變的全球終端記錄.

Rust 客戶端通過包括`certify_and_upload_private_settlement_legs_v1`,`prepare_private_settlement_bundle_v1`,`commit_private_settlement_bundle_v1`和`submit_private_settlement_bundle_v1`在內的方法來暴露這種流動. 可安全因應重新啟動的協調流程使用 `recover_or_prepare_private_settlement_bundle_v1` 和 `recover_or_commit_private_settlement_bundle_v1`。委員會和審計人員的呼叫要求明確的角色憑證;它們不會重複使用普通賬戶簽字者.

## 安全地轉換審計政策 {#rotate-an-auditor-policy-safely}

使用隱私管理授權的 `RotatePrivateSettlementPoolPolicyV1`指令. 它必須指定當前的確切治理測試,保持相同的路線,合併和資產綁定承諾,提升治理修訂一項,使用更新的關鍵時代和不同的政策/治理測驗,並在包含旋轉的區塊上激活. 游泳池邊界,根,取消器,輸出,重播集和最終收據被保存. 不包括在旋轉的激活高度觸摸相同的路線/游泳池的收據;說明拒絕該邊界.

公共庫預測保留了完全取代的政策修改譜系. 在轉換之前完成的收據因此在重新啓動後仍然有效,並且重複該確切收據仍然無效.在全球狀態變化之前,任何跨越激活界限的舊政策捆綁都會被關閉.保留所有需要打開存儲的囊的舊解密鑰,或在破壞之前完成一個受管理和測試的囊重新捲回.

## Torii 路線家族 {#torii-route-family}

這些路線使用常規的 Norito 請求和響應對象.驗證和限制的響應使用私人 `no-store`緩存行爲.

|行動|方法和路徑|校長|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|加載腳|`POST /v1/nexus/private-settlements/legs`|聖經賬戶的簽名|
|可用性分享|`POST /v1/nexus/private-settlements/legs/availability-shares`|聖經賬戶的簽名|
|準備投票|`POST /v1/nexus/private-settlements/phases/prepare-votes`|聖經賬戶的簽名|
|承諾投票|`POST /v1/nexus/private-settlements/phases/commit-votes`|聖經賬戶的簽名|
|持續階段 QC |`POST /v1/nexus/private-settlements/phases/certificates`|聖經賬戶的簽名|
| 恢復階段 QCs | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | 公示贊助商 |
|腿狀況|`GET /v1/nexus/private-settlements/legs/{payload_digest}/status`|聖經賬戶的簽名|
|委員會證據|`GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof`|精確的清單驗證器|
|審計囊|`GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule`|管理審計師|
|審計員的批准|`POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals`|管理審計師|
|提交包|`POST /v1/nexus/private-settlements/bundles`|公示贊助商|
|捆綁狀態|`GET /v1/nexus/private-settlements/bundles/{bundle_id}`|公共|
|收到或取消|`GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt`|公共|

公共狀態和收據 APIs 僅顯示已記錄的公共領域. 特別是,普通腿部狀況不顯示批准數量或受控審計者的門.有限制的閱讀 故意崩失蹤,未經授權,保存過期的材料進入相同不可用響應類.

## 失敗和恢復 {#failure-and-recovery}

在全球突變之前,缺失或過時的審計批准,不到三個驗證者投票,錯誤的根源或時代,重複廢除,替換的證明或囊,非正規的步驟順序,過期的捆綁和不匹配的退款條款都會失敗.承諾證書永遠不會改變私人狀態.

驗證器在認可之前對側車,分階段的海域和階段證書進行了sync.在重新啓動時,他們從常規的持久記錄中重建了預訂.然後調整不變的全球收據,取消標記或過期.監督調和器還在同步觀察到的權威高度進行終端保留剪切,即使是沒有終端候選人可以調整,並且由於剪切錯誤而無法關閉. 只有一個有權威的全球終端記錄發佈了階段鎖.再播放相同的最終收據是無效的;矛盾的再播放決定性失敗.

預訂身份包括完整的路線.池頭使用 `(route, pool_id, epoch, root)`,取消器使用 `(route, pool_id, nullifier)`,輸出使用 `(route, pool_id, commitment)`.在另一條路線上相同的不透明值是獨立的;重啓過程中仍然鎖定了精確路線碰撞.

運營警報應僅使用不透明的捆綁,路線,階段,消化,高度和理性類字段.永遠不要將解密囊,賬戶或資產識別器,金額,備忘錄,查看數據,證據見證者或解析器有效載荷放置在日誌,事件,計量標籤或追蹤範圍中.

## 在實際價值之前的資格 {#qualification-before-real-value}

爲了查看您打算部署的確切構建和配置,存儲包含:

- 抵制性證明,囊,政策,鑰匙轉換,退款和重播案件
- 2, 3, 4, 8 和 16 個數據庫的實際四個驗證器進程,包括驗證器和協調器重啓,認可 5%, 10% 和 20% 的消息丟失,階段分區,恢復以及持久性邊界崩
- 在 Torii, P2P,區塊, Kura,快照,查詢,事件,日誌和遠程測量中進行加拿大和差異泄漏分析
- 每個實際網絡參與者的數量至少有5次加熱和30次測量捆綁, p50,p95,p99,信任間隔,資源,流量,證明和收件大小以及透明的 AMX 作爲控制.
- 嚴格的工作空間測試,和格式檢查,隨機種子,浸泡,可複製的構建, SBOMs,以及簽署的文物哈希.
- 兩種正式層次:3/255腳的計數對稱性檢查和準確的四個驗證器委員會索引 N=2驗證器重點加上全侷限錯誤,紙質主要 N=3 錯誤,N=4 清潔,N=3 過期/複製配置,每個委員會的錯誤預算獨立.
- 獨立審查證據關係,模擬插槽選擇器,資產和囊綁定,退款關係,加密技術和跨數據空間狀態機

發佈原始和清潔的證據,威脅模型,協議參數,限制,承諾 ID,硬件描述和審計報告在不可變的 DOI 支持的文物中.僅存儲庫測試不能將該功能轉化爲生產合格的 CBDC 結算系統.

每次原始故障運行和延遲樣本都必須綁定完整的釋放承諾, SHA-256 一個結構化的固定硬件描述,以及 SHA-256 存檔一個包含N=2,3,4,8,16的法規配置表;每條輸入都必須引用保留的配置字節,並聲明 每個數據空間都有四個驗證器,有3/4的共數,並且必須簽署了 RS16 DA/RBC. 發佈驗證器拒絕基於不同的構建,硬件配置或網絡配置生成的總結.每個單獨的損失,階段切割和持久性撞擊行都必須額外命名全球不可重複使用的精確 JSONL 記錄在內的引用 SHA-256 釋放驗證器解決這些消化問題,並需要符合運行身份,試驗指數和參數,控制器確認或恢復結果的行列連續檢查數量,零部分可見性和可用性觀察.隨後發佈的p95/p99比較也拒絕了簽署的基線,其硬件,配置,或測量要求與候選人不同.最終驗證器將所有報告的百分比重複, MADs, 而不是依靠單獨的基準彙總.它同樣重新加載了魚手錶, 獨立掃描了所有存儲的隱私表面.在重新綁定文件消化後, 報告不能壓制一個被種植的祕密攻擊.檔案還必須包含一個法規的差異對宣言連接左邊和右邊的文件路徑,類型,字節長度, SHA-256 聲明的根源必須包含對檔案庫存.最終驗證器獨立需要相同的尺寸和重新計算 JSON 通過重新編寫泄漏報告,無法隱藏相同尺寸的結構泄漏或未配合的差異文件.
