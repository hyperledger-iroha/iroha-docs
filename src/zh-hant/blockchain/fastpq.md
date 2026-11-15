---
translation_locale: zh-hant
translation_source: /blockchain/fastpq.md
translation_source_hash: 98c258ab99bcc7d7d51b69ddd26e39b19ef4eb14d53001825f3737144d68f0e5
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ 是 Iroha 針對選定執行效果的 STARK 證明路徑。它不會取代一般的交易執行或共識。交易仍照常經由 ISI、IVM 與 Sumeragi 執行；FastPQ 隨後根據區塊執行所擷取的來源紀錄，證明受支援的效果。

目前的主機整合有兩條主要路徑：

- 已最終確定區塊中的數值資產效果，由節點的證明器通道證明
- SORA Nexus AXT 證明封裝，其 `fastpq_binding` 攜帶 FastPQ 綁定

## 轉移證人的路徑 {#transfer-witness-path}

當指令突變餘額時,透明的數值轉移會產生結構化轉移記錄. 轉錄記錄:

- 來源帳戶,目的地帳戶,資產定義和金額
- 轉移前和後的傳送者和接收者的餘額
- 作為批次雜湊所使用的交易入口點雜湊
- 從提交帳戶中獲取的授權主體資訊
- 一個多爾塔轉錄的Poseidon摘要
- 傳送者與接收者餘額的稀疏 Merkle 更新見證

批次轉移使用多個海域的轉錄. 在這種情況下,一個海域的波西登摘要是缺失的.

區塊執行會依發出轉錄的執行呼叫將轉錄分組，並與區塊的 FastPQ 來源紀錄一併保存。在 AXT 轉移陳述中，每個轉移增量都會成為兩個狀態轉換列：

| 列 | 鍵 | 前值 | 後值 |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| 傳送者借記 | 對應資產定義與來源帳戶的 `FastpqBalanceKeyV1` | 傳送者變更前餘額 | 傳送者變更後餘額 |
| 接收者貸記 | 對應資產定義與目標帳戶的 `FastpqBalanceKeyV1` | 接收者變更前餘額 | 接收者變更後餘額 |

每個鍵都是 `FastpqBalanceKeyV1` 的標準 Norito 訊框，由 `transfer_balance_key` 依據具型別的資產定義與無網域帳戶建構而成。帳戶別名與顯示形式絕不會作為鍵的材料。

## 執行效果 {#execution-effects}

證明器通道會證明完整的執行效果陳述。每個陳述依執行順序涵蓋單一執行項目的所有數量效果：

| 效果 | 更新的值 | 規則 |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| 轉移 | 來源餘額與目標餘額 | 金額在同一資產的兩個餘額之間移動 |
| 鑄造 | 餘額與供給量 | 兩者皆增加相同的非零數量 |
| 銷毀 | 餘額與供給量 | 兩者皆減少相同的數量 |
| 除役 | 供給量與生命週期 | 供給量維持為零，資產的存在值由 1 變為 0 |

供給量絕不會低於任一餘額。每個鍵由域分隔標籤 `iroha:fastpq:execution-quantity-key:v1`、一個 NUL 位元組，以及 `FastpqExecutionQuantityKeyV1` 餘額鍵、供給量鍵或生命週期鍵的 Norito 編碼組成。角色授予、角色撤銷及其他操作不會受到證明。

執行效果陳述與 AXT 轉移陳述中的值，是以資產小數位數表示的精確非負整數單位（`FastpqQuantityUnits`），因此不受 `u64` 限制。陳述建構會拒絕小數位數不符、負差值，以及任何算術或排序上的不一致；它絕不會修補公開值。

## 公共輸入 {#public-inputs}

每個 FastPQ 陳述都帶有公共輸入，將證明綁定至區塊與執行情境：

|輸入|這意味著|
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid` | 資料空間識別碼：其 `u64` 值以小端序排列，後接八個零位元組 |
| `slot` | 以奈秒表示的區塊建立時間，精度為毫秒 |
| `old_root` | 套用陳述前，所涉鍵之稀疏 Merkle 樹的根 |
| `new_root` | 套用陳述後，所涉鍵之稀疏 Merkle 樹的根 |
| `perm_root` | 對執行狀態之角色權限表的承諾 |
| `tx_set_hash` | 對區塊內各筆交易依區塊順序排列之傳輸編碼的承諾 |

`old_root` 與 `new_root` 僅涵蓋陳述所涉及的鍵。它們並非持久保存的世界狀態根。

`perm_root` 是 Iroha 的 32 位元組 `Hash`，其輸入為域分隔標籤 `fastpq:v1:permission-table:blake2b-256`、以小端序 `u64` 表示的項目數，以及排序後的各項目。每個項目由角色 ID 的雜湊、該角色某項權限的雜湊，以及該權限以小端序 `u64` 表示的紀元組成。若表格為空，該值即為 32 個零位元組。這僅是角色與權限情境；它不會證明帳戶成員資格或授權。

`tx_set_hash` 是 Iroha 的 `Hash`，其輸入為域分隔標籤 `iroha:axt:ordered-transaction-wire-set:v1`、一個 NUL 位元組、交易筆數，以及依區塊順序排列之每筆交易的傳輸編碼長度與完整傳輸編碼位元組。筆數與長度皆為小端序 `u64` 值。交易不會經過排序或去除重複，簽章會保留在原像中。

Iroha 的 `Hash` 是將最後一個位元組的最低位元設為 1 的 Blake2b-256。陳述還帶有一個排序雜湊，以及其完整的標準列與來源事實；證明會綁定上述所有內容。

## 證明協定 {#proof-protocol}

標準 FastPQ 產物是以 Goldilocks 有限體及其 4 次擴張體為基礎的遮罩 DEEP 證明。其確切關係、轉錄與查詢幾何結構定義於固定版本的 [FastPQ DEEP 協定契約](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md)。

呼叫端選擇一般陳述或 AXT 陳述以及資源限制，但不會選擇電路、驗證金鑰、查詢數量或轉錄內部細節。一般途徑為 `offline_compact::prove_quantity_ordinary_artifact`；AXT 途徑為 `offline_compact::prove_quantity_axt_artifact`，而 `prove_axt_bound_batch` 會將其包裝，以用於已綁定的批次。透明的 `Prover`、`Proof` 與重播 `verify` API 僅存在於測試與 `dev-tools` 建置中。

## 證明檢查的內容 {#what-the-proof-checks}

在進行任何私有處理之前，生產者會先準備公開陳述。它會檢查帳戶、金額、數值、出現次數、穩定的鍵順序與鍵配置，並拒絕公開事實不一致的陳述。接著，密封關係會針對每個區段中的一次效果或轉移出現，證明兩次完整的 32 層稀疏 Merkle 更新。預設限制允許每個產物最多包含兩個區段。

每條軌跡有 65,536 列。生產者對 301 個私有欄產生承諾，驗證器則獨立重建 41 個公開欄。全新的密碼學熵會遮罩軌跡欄、商多項式，以及一個獨立承諾的組合多項式。商的除法必須能夠整除。生產者在回傳產物之前，會先自行驗證該產物。

公開陳述中的值不會被隱藏。某個操作出現在傳輸格式中，並不代表它會被接受：只有上述列出的效果具備證明關係，而 AXT 陳述僅接受具見證的轉移。

## 經驗者林 {#prover-lane}

除非 Kura 以 `init_mode = "fast"` 啟動，否則 `iroha3d` 會在節點啟動期間、Torii 開始接受提交之前，啟動一個 FastPQ 證明器工作器。工作器會在背景初始化其後端，因此即使初始化失敗，啟動仍會繼續；此時該通道會維持停用。

工作器會輪詢節點的已最終確定狀態與 Kura 儲存空間。對於每個已最終確定的區塊，它會取得經過認證的來源（若來源未儲存，則重播原生執行），並以一般途徑逐一證明該區塊的完整陳述。重新啟動後，它會從固定的已簽署創世區塊重建經過認證的前綴。它會將每個產物存入 Kura 有上限的 FastPQ 儲存區。已儲存的產物僅是一份通告：在繼續之前，生產者會認證來源並再次驗證該產物。

證明產生僅在節點本機進行。它不是交易准入或共識的關卡：執行、提交與最終性都不會等待證明。可重試的失敗會將該工作留待之後的嘗試，且每個行程只會執行一個生產者。

## 驗證 {#verification}

驗證器依據從其自身經過認證之陳述所推導出的預期來檢查產物，絕不依據受檢產物本身。驗證過程會在限制範圍內對每個區段只解碼一次，在域外點只對 AIR 求值一次，並依據已承諾的根認證每個已開啟的列、商葉節點與 FRI 纖維以及完整的 FRI 末層，且最多執行 385 次摺疊檢查。它不會建構任何私有見證、軌跡或完整的低次擴展。

驗證成功即確立與呼叫端預期的一致性。它不會授予任何執行權限、來源最終性、重播准入或 AXT 支出授權。

來自 `offline_compact::VerificationLimits` 的預設限制（一般途徑也使用這些限制）：

|限制|預設方式|
| ------------------------------- | ------------: |
| 每個產物的區段數 | 2 |
| 產物傳輸編碼位元組數 | 1 MiB |
| 子證明訊框 | 500,084 位元組 |
| 所有區段合計的陳述位元組數 | 512 KiB |
| 每個區段的查詢數 | 77 |
| 所有區段合計的查詢數 | 154 |

節點通道還會以 `zk.fastpq.proof_sidecar_max_bytes` 與 Kura 的 FastPQ 物件上限，進一步限制產物傳輸編碼位元組數。在解碼之前，AXT 證明資料塊最多可容納 2 MiB，其內嵌的 FastPQ 酬載最多 1 MiB。

## SORA Nexus AXT 證明封裝 {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT 證明封裝可內嵌 `AxtFastpqBinding`。AXT 封裝的區塊驗證、IVM 主機的 AXT 封裝檢查，以及 `RegisterVerifiedFeeSponsorVaultAllocation`，都要求封裝中具備 `fastpq_binding`，會將其與預期聲明比對，並對封裝及其內嵌證明呼叫 FastPQ 驗證器。缺少綁定或驗證失敗都會使該操作遭到拒絕。

驗證器只接受具見證的轉移聲明，即 `tx_predicate` 與 `value_conservation`。`authorization` 與 `compliance` 聲明類型只是不透明地承載效果，不具轉移關係，驗證會拒絕它們。區塊驗證也會拒絕攜帶遠端支出的封裝，而 IVM 主機則會拒絕獨立的 `AXT_VERIFY_DS_PROOF` 准入。在能夠認證已最終確定的來源根、交易集合與發行方授權之前，兩者都維持無法使用。

### AXT 綁定 {#axt-binding}

對於 SORA Nexus AXT 封裝，會在證明與驗證之前將 `AxtFastpqBinding` 轉成標準形式：

- `parameter`、`source_dataspace`、`source_receipt_id` 與 `verified_effect_type` 會去除首尾空白，且不得為空
- `source_tx_commitment`、`claim_digest`、`witness_commitment` 與 `policy_commitment` 會轉為小寫，且必須是 32 位元組的十六進位編碼
- `verifier_id` 必須為 `fastpq`，`verifier_version` 必須為 `v1`
- `claim_type` 會去除首尾空白並轉為小寫，且必須指定上述四種聲明類型之一
- `target_dsids` 必須非空且嚴格遞增排列
- `remote_spend_intent_commitments` 必須嚴格遞增排列，且不超過首個發布版本的上限

驗證要求確切的標準形式；它不會代替呼叫端將綁定正規化。

綁定會附加到區塊執行已擷取的批次上；它不會建立狀態轉換。該批次必須包含至少一個狀態轉換，並指明綁定的參數集 `fastpq-state-transition-stark-v1`。其 `entry_hash` 中繼資料必須等於 `source_tx_commitment`，其公共 `dsid` 必須編碼綁定的 `source_dsid`。轉移聲明必須帶有至少一個轉移轉錄，且每個轉錄的批次雜湊都必須等於 `source_tx_commitment`。

接著，綁定程序會將與證明綁定的中繼資料寫入批次：標準綁定、其四個摘要、`source_receipt_id`、`target_dsids`、`verified_effect_type`、非空的 `corridor`、非零的資訊清單根、選用的 DA 承諾、選用的非零承諾金額，以及到期時槽（為零表示永不到期）。最後，它會針對綁定以及不含封印的批次加上封印：

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

其中 $E$ 表示標準 Norito 編碼。在綁定之後變更批次、綁定或與證明綁定的值，會導致驗證失敗。驗證器還會將封裝的資料空間、資訊清單根、DA 承諾、承諾金額與到期時間，與證明綁定的值進行比對。

經過驗證的封裝會回報其已證明的 `old_root`、`new_root` 與 `tx_set_hash`，以及一個陳述摘要。該摘要涵蓋以小端序 `u64` 表示的封裝資料空間、其資訊清單根、DA 承諾（若有）、綁定以及陳述：

$$
\operatorname{statement\_digest} =
\operatorname{Hash}(
\texttt{fastpq:axt:statement:v1}\|
\operatorname{le64}(\operatorname{dsid})\|
\operatorname{manifest\_root}\|
\operatorname{da\_commitment}\|
E(\operatorname{binding})\|
E(\operatorname{statement})
)
$$

AXT 批次資訊清單摘要是對規範綁定的 Norito 編碼計算出的 SHA-256：

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## 引數元件 {#parameter-sets}

首個發布版本恰好只有一個參數集：`fastpq-state-transition-stark-v1`。批次與 AXT 綁定都會指明此參數集，AXT 證明則會拒絕任何其他名稱。DEEP 協定契約固定了已發布產物的幾何結構：

| 項目 | 值 |
| -------------------------- | ----------------------------------------------------- |
| 有限體 | Goldilocks `p = 2^64 - 2^32 + 1`，擴張體 `u^4 - 7` |
| 軌跡列數 | 65,536 |
| 求值列數 | 8,388,608（擴展因子 128） |
| FRI 摺疊元數 | `[16, 16, 8, 8, 4]` |
| 查詢 | 77 個相異位置 |
| 研磨 | 無 |
| 承諾與轉錄 | SHA3-256 與 SHAKE256 |

目前尚無正式環境的資格認定。針對此構造的健全性、隱藏性與 Fiat-Shamir 獨立審查尚未完成，而固定版本的 [正式環境就緒紀錄](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md) 並未提出任何以工作量正規化的安全性主張。

## 配置 {#configuration}

FastPQ 配置嵌入`zk.fastpq`下方.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"
proof_sidecar_queue_cap = 1024
proof_sidecar_max_retries = 16

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false

[zk.fastpq.producer]
poll_interval_ms = 1000
step_timeout_ms = 30000
max_native_steps = 16
max_source_entries = 65536
max_source_statements = 16384
```

兩種模式都只接受 `cpu` 或 `gpu`，預設值為 `cpu`。將任一模式設為 `gpu` 後，證明雜湊運算便必須使用裝置：在 macOS 上為 Metal，在其他平台上為 CUDA。如果未將 GPU 支援編譯進來，或裝置未通過預檢，證明器通道會維持停用；它絕不會退回 CPU。裝置負責大量執行 Merkle 葉節點與下層父節點的雜湊運算；轉錄、有序的上層樹與軌跡運算則留在 CPU 上。設定 `poseidon_mode = "gpu"` 時，若另一項預檢通過，節點還會在 GPU 上批次計算轉錄的 Poseidon 摘要；否則會在 CPU 上計算。

`proof_sidecar_max_bytes` 會限制節點持久保存並驗證的已編碼產物大小，預設值為證明器的最大證明訊框。`producer` 表會約束每次證明嘗試：其輪詢間隔、時間預算、原生重播步數（1 到 64），以及在配置之前接受的來源項目與陳述。`metal_queue_fanout` 接受 1 到 4。

模式與遙測標籤設定也可以透過 `iroha3d` 覆寫：

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

`iroha3d` 在讀取設定檔時會忽略環境變數，因此請在 TOML 中或使用上述選項設定這些值。

## 計量 {#metrics}

啟用遙測後，FastPQ 會匯出有關後端選擇、證明持久保存與 Metal 執行階段行為的指標：

|計量|這意味著|
| ----------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|根據後端和裝置標籤的要求和解決執行模式 |
|`fastpq_poseidon_pipeline_total`|索取和解決了Poseidon管道的路徑|
| `fastpq_gpu_disable_total` | 依加速器、原因與裝置標籤統計的 GPU 加速器停用事件 |
| `fastpq_gpu_parity_failure_total` | 依加速器、原因與裝置標籤統計的取樣 GPU 一致性檢查失敗 |
| `fastpq_proof_sidecar_queue_depth` | 佇列中的 FastPQ 證明輔助紀錄附件 |
| `fastpq_proof_sidecar_events_total` | 依事件統計的證明輔助紀錄持久保存事件 |
|`fastpq_metal_queue_depth`|Metal 佇列限制、最大並行數、派送數量和取樣視窗|
|`fastpq_metal_queue_ratio`|金屬佇列繁忙和重疊比例 |
|`fastpq_zero_fill_duration_ms`|為金屬執行提供零填充持續時間 |
|`fastpq_zero_fill_bandwidth_gbps`|產生的零填充頻寬|

模式、GPU、Metal 佇列與零填充指標需要 `extended` 或 `full` 遙測設定檔，且在 Kura 以 `init_mode = "fast"` 啟動時不會匯出。Metal 佇列與零填充指標還需要 macOS 上的 `fastpq-gpu` 建置。

在 [ 效能和指標](/zh-hant/guide/advanced/metrics.md)中列出的共識和佇列訊號中使用一般的績效分類.

## 相關參考 {#related-reference}

- [節點授權型別快照資料模型方案](/zh-hant/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [`iroha3d` FastPQ 的選項](/zh-hant/reference/iroha3d-cli.md#fastpq-overrides)
