---
translation_locale: zh-hant
translation_source: /reference/norito.md
translation_source_hash: b3b7c03bc0df3f7fa3df7e44b0ec8d755d615f9edca66bbcfe5613c33c8afbfe
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---
# Norito {#norito}

Norito 是 Iroha 的規範序列化層。當對等節點、SDKs、CLI 工具、Torii、Kura 與產生成品必須對完全相同的承載達成一致時，使用的就是這套位元組格式。

資料涉及共識、簽署、雜湊、持久化或跨 SDK 互通時，請使用 Norito。只有在端點明確提供方便操作員、儀錶板或快速除錯使用的人類可讀投影時，才使用 JSON。

## Norito 的使用位置 {#where-norito-appears}

| 介面 | Norito 的用途 |
| --- | --- |
| 交易與查詢 | 透過 Torii 提交的已簽署交易與查詢承載會編碼為 Norito。 |
| 創世區塊 | `kagami genesis sign` 會產生已簽署的 `.nrt` 區塊，供對等節點在啟動時載入。 |
| Torii 強型別回應 | 支援強型別二進位回應的端點使用 `Accept: application/x-norito`。 |
| SDKs | Rust、Python、JavaScript、Kotlin/Java、Swift 及 Android 使用者端使用 Norito 建構器或繫結，而不是手動組裝位元組。 |
| Kura 儲存 | 區塊承載、復原 sidecar、名冊及提交標記會儲存為帶 Norito 框架的資料。 |
| 資訊清單 | Nexus、資料可用性、SoraFS、串流及面向應用程式的資訊清單需要簽署或雜湊時，會使用 Norito。 |
| 串流 | Norito Streaming 使用 Norito 資訊清單、片段標頭、控制框架及一致性測試資料。 |

Norito 不是智慧合約語言。它是承載交易、合約呼叫、資訊清單及強型別 API 承載的確定性封套與編解碼器。

## 承載模型 {#payload-model}

每個線上上傳輸或儲存於磁碟的 Norito 承載，都由標頭框住，後接編碼後的承載位元組。無標頭的裸承載只保留給內部雜湊、效能基準，以及會在傳輸前立即為結果加上標頭的輔助 APIs。

| 標頭欄位 | 大小 | 用途 |
| --- | ---: | --- |
| Magic | 4 位元組 | ASCII `NRT0`，用來及早拒絕非 Norito 資料。 |
| Major | 1 位元組 | 格式主要版本；目前的承載使用 `0`。 |
| Minor | 1 位元組 | v1 的解碼提示；目前值為 `0x00`。版面配置由 Flags 描述。 |
| Schema hash | 16 位元組 | 型別識別，用於讓強型別解碼器拒絕非預期承載。 |
| Compression | 1 位元組 | `0 = None`、`1 = Zstd`；未知值會遭拒絕。 |
| Payload length | 8 位元組 | 未壓縮承載長度，以小端序 `u64` 表示。 |
| CRC64 | 8 位元組 | 未壓縮承載的 CRC64-XZ 檢查碼。 |
| Flags | 1 位元組 | 緊湊長度、打包序列及打包結構的版面配置旗標。 |

標頭共 40 位元組。解碼器會先驗證 Magic、版本、支援的旗標遮罩、承載長度、總和檢查碼及結構描述雜湊，再重建強型別值。

## 版面配置旗標 {#layout-flags}

Norito 將版面配置選項儲存在標頭的最後一個位元組。預設 v1 輔助函式會輸出 `COMPACT_LEN`（`0x02`），對每個值使用緊湊的長度字首。呼叫端以 `flags = 0x00` 編碼時，明確的固定寬度長度字首仍可讀取。

| 旗標 | 十六進位 | 狀態 | 效果 |
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` | 支援 | 以偏移量表加上連續資料區塊，編碼大小不一的集合。 |
| `COMPACT_LEN` | `0x02` | 預設 | 每個值的長度字首使用規範無號 varint。 |
| `PACKED_STRUCT` | `0x04` | 支援 | 將 derive 產生的結構編碼為打包欄位承載。 |
| `VARINT_OFFSETS` | `0x08` | 保留 | v1 會拒絕；打包序列偏移量是固定寬度 `u64`。 |
| `COMPACT_SEQ_LEN` | `0x10` | 保留 | v1 會拒絕；最上層序列長度標頭是固定寬度 `u64`。 |
| `FIELD_BITSET` | `0x20` | 有條件支援 | 為打包結構加入位元集合，讓只有需要明確大小的欄位攜帶大小字首。必須同時啟用 `PACKED_STRUCT` 與 `COMPACT_LEN`。 |

旗標是明確指定的。解碼器不會根據承載形狀、次要版本或啟發法推斷版面配置。未知或無效的組合會遭拒絕，確保所有對等節點都以相同方式解讀承載。

## 編碼規則 {#encoding-rules}

Norito 對 Iroha 資料模型中的常見資料形狀使用確定性版面配置：

- 字串格式為 `[len][utf8-bytes]`；啟用 `COMPACT_LEN` 時，`len` 遵循該旗標。
- 設定 `COMPACT_LEN` 時，每個值的長度使用緊湊 varint。
- 未設定 `COMPACT_LEN` 時，每個值的長度是 8 位元組小端序 `u64`。
- v1 的序列長度標頭是固定 8 位元組小端序 `u64`。
- `Vec<u8>` 編碼為 `[len_u64][raw-bytes]`，而不是為每個位元組各寫一個長度。
- 打包序列使用 `(len + 1)` 個單調遞增的 `u64` 偏移量，後接串接的元素承載。
- 對應表以固定 `u64` 編碼專案數，並使用確定性的索引鍵順序。`HashMap` 專案會在編碼前依索引鍵排序；`BTreeMap` 使用其自然順序。
- `BigInt` 使用小端序二補數位元組，以 `u32` 表示位元組長度，上限為 512 位元。
- `Numeric` 編碼為 `(mantissa, scale)`；mantissa 儲存整數值，scale 儲存小數位數。

這些規則會影響簽章與雜湊。兩個 SDKs 建立相同邏輯交易時，必須產生相同的規範位元組。

## 結構描述雜湊 {#schema-hashes}

強型別 Norito 承載的標頭包含 16 位元組結構描述雜湊。預設雜湊衍生自完整限定型別名稱；啟用結構式結構描述雜湊的建置，則改由規範結構描述衍生雜湊。

強型別解碼器會拒絕結構描述不符。這可避免使用者端誤將有效的 Norito 框架解碼成錯誤型別；SDK 測試資料套件與節點資料模型不同步時，通常就會以此方式失敗。

## 壓縮和加速 {#compression-and-acceleration}

Norito 支援明確指定及自適應壓縮，而不改變邏輯承載：

| 功能 | 用途 |
| --- | --- |
| `to_bytes` | 編碼標頭，後接未壓縮承載。 |
| `to_compressed_bytes` | 使用 Zstd 編碼，並在標頭記錄壓縮標籤。 |
| `to_bytes_auto` | 使用確定性啟發法判斷壓縮是否值得。 |
| CRC64 加速 | 所有平臺都使用可攜式 CRC64-XZ；可用時，x86_64 使用 CLMUL，aarch64 使用 PMULL。 |
| GPU CRC64 與壓縮 | 選用的 Metal 或 CUDA 輔助函式可加速大型承載，之後在需要時回退至 CPU 路徑。 |

硬體加速絕不會改變解碼後的內容。CRC 與 JSON 加速器的輸出必須逐位元符合可攜式實作。CPU 與 GPU 編碼器產生的 Zstd 框架位元組可能不同，但解碼後的承載及 Norito 標頭中用於驗證的中繼資料仍保持確定性。

## JSON 支援 {#json-support}

Norito 內含原生 JSON 堆疊，讓需要 JSON 的端點與工具不必離開 Norito 型別系統。

| JSON 功能 | 使用情境 |
| --- | --- |
| `norito::json::{to_json, from_json}` | 確定性的強型別 JSON 編碼與解碼。 |
| 美化與 writer 輔助函式 | CLI 輸出、測試資料，以及串流 `std::io` 整合。 |
| DOM 值 | 透過 Norito 的 JSON 值模型進行程式化操作。 |
| 快速強型別 JSON | 以結構磁帶為基礎，為高頻 DTO 路徑解碼與編碼。 |
| 零複製讀取器 | 進行 token 掃描，並在可行時直接借用輸入中的字串。 |
| Stage-1 加速器 | 選用 AVX2、NEON、Metal 或 CUDA 結構索引，並提供純量回退路徑。 |

Iroha 程式碼處理強型別 API 承載時，應優先使用 `norito::json` 輔助函式。在生產路徑直接加入 `serde_json`，可能偏離 SDKs 與 Torii extractor 預期的結構描述及欄位處理行為。

## 衍生功能支援 {#derive-support}

Rust 資料型別通常使用 derive 巨集，而不是手寫編解碼程式碼。derive 層可產生 Norito 二進位編解碼器、結構描述及 JSON 輔助函式。

常用欄位屬性如下：

| 屬性 | 效果 |
| --- | --- |
| `#[norito(rename = "other")]` | 使用穩定的序列化名稱，維持結構描述及 JSON 相容性。 |
| `#[norito(skip)]` | 編碼器省略該欄位；解碼器提供其 `Default` 值。 |
| `#[norito(default)]` | 解碼後的承載未包含該欄位時，使用 `Default`。 |
| `#[norito(skip_serializing_if = "...")]` | 述詞符合時從 JSON 省略欄位，同時保留確定性的解碼預設值。 |

derive 實作也會在可行時公開編碼長度提示及精確長度計算。編碼器利用這些提示預留緩衝區，避免額外複製。

## Rust 套件功能族群 {#crate-feature-families}

從原始碼建置 Iroha 或 SDK 繫結時，Norito 功能會決定可用的輔助函式與加速器：

| 功能族群 | 啟用內容 |
| --- | --- |
| `derive` | 重新匯出用於二進位、結構描述及 JSON derive 的程式巨集。 |
| `compression` | 支援具有標頭框架的承載使用 Zstd。 |
| `packed-seq` | 使用偏移量表的打包集合版面配置。 |
| `packed-struct` | 打包由 derive 產生的結構版面配置。 |
| `compact-len` | 每個值使用 varint 長度字首。 |
| `columnar` | Norito Column Blocks、自適應 AoS/NCB 資料列編解碼器，以及掃描密集路徑使用的借用檢視；包含於預設 `node-codec` 功能集。 |
| `strict-safe` | 將可失敗路徑中的解碼 panic 轉換為結構化錯誤。 |
| `simd-accel` | 在可用處使用 CPU 加速，並提供確定性回退。 |
| `json` | 原生 JSON parser、writer、DOM、強型別 derive 及快速路徑。 |
| `json-std-io` | 建立在 JSON 堆疊上的 reader 與 writer 輔助函式。 |
| `metal-stage1`, `cuda-stage1` | 選用的 GPU JSON 結構索引後端。 |
| `metal-stage2` | 選用的 Metal 中繼資料分類，用於 JSON 結構磁帶。 |
| `metal-crc64`, `cuda-crc64` | 大型承載可選用的 GPU CRC64 輔助函式。 |
| `gpu-compression` | 大型承載可選用的 Metal 或 CUDA Zstd 加速。 |
| `stage1-validate` | 除錯驗證，將加速後的 JSON 結構索引與純量輸出比較。 |

不同 SDKs 與發行設定檔可用的功能可能不同。線上傳輸格式仍由標頭與結構描述規範，而不是由本機建置旗標決定。

## Torii 和 Norito RPC {#torii-and-norito-rpc}

Torii 的許多操作員路由會提供 JSON，但強型別二進位路由使用 Norito。目前強型別 Norito HTTP 內文的媒體型別是 `application/x-norito`。

端點接受或傳回強型別 Norito 時，請使用下列標頭：

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

端點同時支援兩種表示法時，使用者端可傳送明確的偏好清單：

```http
Accept: application/x-norito, application/json
```

解碼失敗會呈現為強型別 Torii 錯誤，並由遙測計數。常見原因包括 Magic 無效、版本不受支援、功能旗標不受支援、總和檢查碼不符、UTF-8 格式錯誤、列舉標籤無效，以及結構描述不符。

Norito RPC 傳輸方式由傳輸組態選定。操作員儀錶板應追蹤請求延遲、失敗、作用中連線、回應位元組及 `torii_norito_decode_failures_total`，並與 JSON 流量分開統計。

## Norito 串流 {#norito-streaming}

Norito Streaming 將相同的確定性方法延伸至媒體與即時傳輸介面。其主要組成如下：

| 串流功能 | 用途 |
| --- | --- |
| 資訊清單 | 宣告片段承諾、隱私路由、能力、編解碼器設定檔、加密套件及內容金鑰中繼資料。 |
| 片段標頭 | 繫結片段編號、持續時間、chunk 數量、時間資訊、熵模式、音訊摘要及 Merkle 根。 |
| Chunk 承諾 | 讓檢視者與轉送節點在提供或解碼資料前，依資訊清單驗證承載 chunk。 |
| 控制框架 | 承載資訊清單公告、回饋、金鑰更新及能力協商。 |
| HPKE 金鑰更新 | 使用協商後的套件及單調遞增計數器輪替傳輸秘密。 |
| 能力協商 | 取雙方支援的功能位元、資料包大小上限、回饋頻率及隱私要求之交集。 |
| FEC 與回饋 | 對有封包遺失的即時路徑使用確定性的接收端報告及同位元決策。 |
| 一致性向量 | 跨語言測試資料證明各 SDKs 會解碼出相同的資訊清單、片段及熵資料流。 |

串流專用編解碼器與熵設定檔和核心 Norito 交易／查詢格式彼此獨立，但其資訊清單及控制資料仍使用 Norito，使路由、計費、重播及稽核證據保持可重現。

## 營運指引 {#operational-guidance}

- 優先使用 SDK 建構器及產生的繫結，不要手工製作 Norito 位元組。
- 將結構描述不符視為版本或測試資料問題，而不是暫時性網路故障。
- 將 `.nrt`、`.norito` 及資訊清單成品封存於產生它們的發行或事件套件中。
- 已簽署、已雜湊或持久化資料應以 Norito 為單一真實來源；JSON 投影僅供儀錶板與人工檢查使用。
- 在新增一個新型的 Torii 端點時,記錄它是否接受 JSON, Norito 或兩者,並在 `/openapi.json` 中暴露支援的內容型別.
- 啟用加速器前，請執行與純量輸出的同等性測試。加速器失敗時，使用確定性的純量回退；承載語意不得改變。

## 相關頁面 {#related-pages}

- [Torii 端點](/zh-hant/reference/torii-endpoints.md)
- [創世區塊參考](/zh-hant/reference/genesis.md)
- [資料模型結構描述](/zh-hant/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/zh-hant/guide/tutorials/javascript.md)
- [Python SDK](/zh-hant/guide/tutorials/python.md)
- [Swift 與 iOS SDK](/zh-hant/guide/tutorials/swift.md)

## 上游引用 {#upstream-references}

- [Norito 格式的規範](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/norito.md)
- [Norito crate README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/norito/README.md)
