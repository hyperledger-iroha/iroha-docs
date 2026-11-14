---
translation_locale: zh-hant
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ 是 Iroha 對選定的執行效果的 STARK 證明路徑.它不取代正常的交易執行或共識.透過 ISI,IVM 和 Sumeragi 進行正常執行; FastPQ 消耗了確定性執行證明,並將支援的效果轉化為證明批次.

目前的主機整合有兩條主要路徑：

- 在區塊執行期間記錄的透明數值資產轉移
- SORA Nexus AXT 證明封裝，其 `fastpq_binding` 攜帶 FastPQ 綁定

## 轉移證人的路徑 {#transfer-witness-path}

當指令突變餘額時,透明的數值轉移會產生結構化轉移記錄. 轉錄記錄:

- 來源帳戶,目的地帳戶,資產定義和金額
- 轉移前和後的傳送者和接收者的餘額
- 作為批次雜湊所使用的交易入口點雜湊
- 從提交帳戶中獲取的授權主體資訊
- 一個多爾塔轉錄的Poseidon摘要

批次轉移使用多個海域的轉錄. 在這種情況下,一個海域的波西登摘要是缺失的.

在區塊完成時, Iroha 將這些轉錄按輸入點雜湊組分.執行證人然後攜帶原始轉錄捆綁和為檢測器準備的 FastPQ 過渡批次.

每個轉移三角形變成兩個過渡行:

|排列|關鍵形狀|預估值|後值|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|傳送人借款|`asset/<asset-definition>/<source-account>`|之前的傳送人餘額|之後的傳送人餘額|
|收件人信貸|`asset/<asset-definition>/<destination-account>`|之前的收件人餘額|接收者餘額之後|

數值將正常化為整數目擊單位.如果不能在選定的十分數尺度中表示為非負的 `u64`,則對 FastPQ 批次來說,一個值被拒絕

## 公共輸入 {#public-inputs}

每個 FastPQ 過渡批次都包含了將證明繫結到區塊和執行環境的公開輸入:

|輸入|這意味著|
| ------------- | --------------------------------------------------------------- |
| `dsid` | 編碼為小端序位元組的資料空間識別碼 |
|`slot`|區塊建立時間轉換為納秒.|
|`old_root`|來自執行證人的父母狀態根源|
|`new_root`|從執行證人中得到的後狀態根源|
|`perm_root`|西頓對活躍角色許可的承諾|
|`tx_set_hash`|按順序的交易和時間觸發入口點 hashs|

主機對這些批次使用首個發布版本中唯一的參數集 `fastpq-state-transition-stark-v1`。

## 證明協定 {#proof-protocol}

標準轉帳產物是以 Goldilocks 有限體及其 4 次擴張體為基礎的遮罩 DEEP 證明。其確切關係、轉錄與查詢幾何結構定義於固定版本的 [FastPQ DEEP 協定契約](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md)。

## 箴言所檢查的內容 {#what-the-prover-checks}

在構建跟蹤之前, FastPQ 檢測器透過過渡鍵,操作級別和插入序來定製批次順序.傳輸行還需要轉錄後設資料.具有轉錄行但沒有轉錄的批次是無效的.

轉移記錄時,檢查人員的檢查包括:

- 傳送者餘額不得發生下溢
- `sender_after` 必須等於 `sender_before - amount`
- `receiver_after` 必須等於 `receiver_before + amount`
- 轉錄必須涵蓋分批中的每一行轉移
- 一個多爾塔波西登摘要,當存在時,必須與轉錄前圖相匹配
- 條件是稀疏的Merkle證明必須被解碼為版本 1;缺失的路徑由確定性合成證明填充

追蹤包含轉移,鑄造,銷毀,角色授予,角色撤銷,後設資料集和許可權搜尋行的選擇列. 數字操作行還載有簽名的分數,每個資產的分數以及供應計數.

## 經驗者林 {#prover-lane}

`iroha3d`在啟動時啟動 FastPQ 檢查路徑,如果可以初始化檢查後端.該路徑是一個帶有界限的佇列的背景任務.一個區塊生成執行證人之後,提交路徑會提交包含區塊雜湊,高度,檢視和證人的檢查路程.

如果通道沒有執行或排隊滿,工作將被跳過,正常的區塊處理繼續.這意味著背景檢查通道不是一個交易錄取或共識門.它是一個已經執行的狀態上的證明生產路徑.

通道構建一個具有:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

兩個設定均預設為 `cpu`。選擇 `gpu` 是明確的 fail-closed 請求：如果未編譯 GPU 支援，或所要求的 GPU 後端未透過預檢，證明器通道將保持停用。首個版本沒有 `auto` 值，也不會從要求的 GPU 模式退回 CPU。

## 驗證 {#verification}

FastPQ 證明驗證重建了規範批次承諾,並重復了公開轉錄.驗證器檢查了協議版本,引數設定版本,重播限制,追蹤承諾,公開輸入,取樣的Merkle開啟口,AIR 開啟口和 FRI 查詢鏈.

預設重播限制包括:

|限制|預設方式|
| ------------------ | ------: |
|過渡行|     256 |
|批次有效載荷大小|256 KiB |
|FRI 層|      16 |
|查詢開放時間|     128 |

## SORA Nexus AXT 證明封裝 {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT 證明封裝可內嵌 `AxtFastpqBinding`。AXT 封裝的區塊驗證、IVM 主機的 AXT 封裝檢查，以及 `RegisterVerifiedFeeSponsorVaultAllocation`，都要求封裝中具備 `fastpq_binding`，會將其與預期聲明比對，並對封裝及其內嵌證明呼叫 FastPQ 驗證器。缺少綁定或驗證失敗都會使該操作遭到拒絕。

### AXT 繫結數學 {#axt-binding-math}

對於 SORA Nexus AXT 封裝，會在重播證明前將 `AxtFastpqBinding` 轉成標準形式。空白的 `parameter`、`verifier_id` 或 `verifier_version` 值會遭拒絕；驗證器 ID 必須為 `fastpq`，版本必須為 `v1`，而持續維護的 AXT 流程使用 `fastpq-state-transition-stark-v1`。聲明類型則會去除首尾空白並轉為小寫。

AXT FastPQ 公共輸入是確定性位元組雜湊:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT 過渡鍵是:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

在 `authorization` 索賠中插入了授予資金的行:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

以及一個綁定授權政策的中繼資料列。`compliance` 聲明會插入兩個中繼資料列：一個用於政策，另一個用於目標資料空間。

對於 `tx_predicate` 和 `value_conservation`,當結合物包含正源或目的量時,使用明確效果數值.否則程式碼將獲得有限的確定性數值:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

然後使用相同的轉移方程:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

合成傳送者和接收者帳戶ID由關鍵種子生成:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

轉讓批次雜湊是:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT 批次資訊清單摘要是對規範綁定的 Norito 編碼計算出的 SHA-256：

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## 引數元件 {#parameter-sets}

首個發布版本恰好只有一個標準參數集：`fastpq-state-transition-stark-v1`。它的目標是在 Goldilocks 有限體及其 4 次擴張體（`X^4 - 7`）上提供 128 位元安全性，並使用 `2^16` 的軌跡大小、`2^19` 的 LDE 大小、FRI 元數 2、擴展因子 8、最多 17 次歸約，以及 136 次查詢。

## 配置 {#configuration}

FastPQ 配置嵌入`zk.fastpq`下方.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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
```

同樣的執行和遠端測量標籤可以在 `iroha3d` 中取消:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

環境變數也支援配置欄位. FastPQ 特定的變數包括:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## 計量 {#metrics}

在啟用遠端測量時, FastPQ 將對後端選擇和金屬執行階段行為進行出口:

|計量|這意味著|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|根據後端和裝置標籤的要求和解決執行模式 |
|`fastpq_poseidon_pipeline_total`|索取和解決了Poseidon管道的路徑|
|`fastpq_metal_queue_depth`|Metal 佇列限制、最大並行數、派送數量和取樣視窗|
|`fastpq_metal_queue_ratio`|金屬佇列繁忙和重疊比例 |
|`fastpq_zero_fill_duration_ms`|為金屬執行提供零填充持續時間 |
|`fastpq_zero_fill_bandwidth_gbps`|產生的零填充頻寬|

在 [ 效能和指標](/zh-hant/guide/advanced/metrics.md)中列出的共識和佇列訊號中使用一般的績效分類.

## 相關參考 {#related-reference}

- [節點授權型別快照資料模型方案](/zh-hant/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ 的選項](/zh-hant/reference/iroha3d-cli.md#fastpq-overrides)
