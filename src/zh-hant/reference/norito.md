---
translation_locale: zh-hant
translation_source: /reference/norito.md
translation_source_hash: ff258251887109f6cb28241235caea8e1b6a69df10df60cb7b2e7c2507004b4e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Norito {#norito}

Norito 是的 Iroha 這是使用的字节格式.
當他們同行時, SDKs, CLI 工具, Torii, Kura, 而產生的文物必須同意.
完全相同的有效載荷.

使用 Norito 如果這些數據是共識,簽名,哈希,堅持的部分,
或是交叉-SDK 互操作性. 使用 JSON 如果一個終點明顯提供
對操作員,儀表板或快速預測進行可讀的投影.

## 在哪裡? Norito 顯示 {#where-norito-appears}

| 表面 | 如何? Norito 使用 |
| --- | --- |
| 交易和查詢 | 通過提交的簽名交易和查詢有效負荷 Torii 已加碼為 Norito. |
| 創世記 | `kagami genesis sign` 產生簽名的 `.nrt` 在開始時, 阻止同行加載. |
| Torii 輸入的回應 | 支持輸入二元回應使用的終點 `Accept: application/x-norito`. |
| SDKs | Rust, Python, JavaScript, Kotlin 這樣的情況, Swift, 及其他 Android 客戶使用 Norito 而不是手工組成的字節. |
| Kura 儲存 | 區塊用荷物,恢復側車,列表和承諾標記被儲存為 Norito 我們的數據. |
| 顯示 | Nexus, 數據的可用性, SoraFS, 應用程式的使用, Norito 必須簽名或加密明示表時. |
| 播放 | Norito 流通使用 Norito 顯示器,區段標題,控制框和適合性燈具. |

Norito 這種語言並不是智能契約的語言.
包含交易,合同通話,明示和打字的代碼 API
提供使用量.

## 使用負荷模型 {#payload-model}

每個線上或磁盤 Norito 標籤:
沒有頭號或裸體的用載量為內部使用
哈希,基准和助手 APIs 立即將結果包裹成
在運輸前的頭條.

| 標題欄位 | 尺寸 | 目的 |
| --- | ---: | --- |
| 魔术 | 4 字節 | ASCII `NRT0`, 使用於拒絕非 Norito 數據提前. |
| 其他國家: | 1 字節 | 格式化主要版本.目前使用的有效載荷 `0`. |
| 年輕人 | 1 字節 | 固定的v1解碼提示.目前使用有效載荷 `0x00`; 這種方式可以在旗中使用. |
| 圖表的哈希 | 16 字节 | 打字解碼器使用的類型識別, |
| 壓縮方式 | 1 字節 | `0 = None`, `1 = Zstd`. 不知數值被拒絕. |
| 使用量長度 | 8 字节 | 沒有壓縮的有效載荷長度, `u64`. |
| CRC64 | 8 字节 | CRC64-XZ 沒有壓縮的有效負荷的檢查總數. |
| 國旗 | 1 字節 | 列表的標籤為簡約長度,包裝序列和包裝插曲. |

解碼器認證了魔法,版本,支持旗
在重建的前面,
輸入值.

## 布局旗 {#layout-flags}

Norito 在最後的標題字节中儲存布局選擇.
發射 `COMPACT_LEN` (`0x02`) 對於簡約的每值長度前.
在呼叫者編碼時,固定寬度長度前置仍然可讀
`flags = 0x00`.

| 國旗 | 沒有任何其他方法 | 狀態 | 影響 |
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` | 提供支持 | 編碼變量大小的集合,包含偏移表加上連接數據區塊. |
| `COMPACT_LEN` | `0x02` | 預設方式 | 使用法規未簽名的色在每值長度前置詞中. |
| `PACKED_STRUCT` | `0x04` | 提供支持 | 編碼由衍生的 structs, |
| `VARINT_OFFSETS` | `0x08` | 預留時間 | 在 v1 中被拒絕;包裝序列的偏移是固定寬度 `u64`. |
| `COMPACT_SEQ_LEN` | `0x10` | 預留時間 | 在 v1 中被拒絕;最高級序列長度標題是固定寬度的 `u64`. |
| `FIELD_BITSET` | `0x20` | 支持要求 | 增加包裝字體的位數組,因此只需要明顯尺寸的欄位才有尺寸前置. `PACKED_STRUCT` 及其他 `COMPACT_LEN`. |

解碼器並不根據使用負荷的形狀推斷布局,
不知名或無效的組合會被拒絕,
這種情況下,

## 編碼規則 {#encoding-rules}

Norito 使用在
這項政策 Iroha 數據模型:

- 這裡的字符串 `[len][utf8-bytes]`; `len` 接下來 `COMPACT_LEN` 如果有機會,
- 在每值長度使用密集色, `COMPACT_LEN` 已設定,否則
  固定 8 字段的小 `u64`.
- 序列長度的標題是固定的 8 字節小 `u64` 在 v1 中.
- `Vec<u8>` 編碼為 `[len_u64][raw-bytes]` 而不是每字节的一個長度.
- 包裝序列使用 `(len + 1)` 單純的 `u64` 接著是:
  連鎖的元素使用負荷.
- 圖表加碼入口數量以固定 `u64` 並使用決定性關鍵順序.
  `HashMap` 在編碼之前,輸入按鍵排序; `BTreeMap` 使用其
  沒有任何問題.
- `BigInt` 使用小二的補充字节 `u32` 字節長度
  還有512位的帽子.
- `Numeric` 編碼為 `(mantissa, scale)`, 在那裡 mantissa儲存
  整數值和尺度儲存分數的數字.

這項規則對於簽名和哈希斯都很重要. SDKs 這樣的建築物
這項交易必須產生相同的法定字節.

## 圖表標籤 {#schema-hashes}

類型 Norito 在標題中包含16字節的圖案哈希.
這個字符來自完全合格的類型名稱.
而是從法規圖案中取出哈希.

這樣可以保護客戶免於意外發生
解碼一個有效的 Norito 架是錯誤型的, 這是通常故障模式
在一個 SDK 固件捆綁從節點數據模型中導向.

## 壓縮與加速 {#compression-and-acceleration}

Norito 支持明顯和適應的壓縮,而沒有改變逻辑
使用量:

| 功能 | 目的 |
| --- | --- |
| `to_bytes` | 沒有壓縮的頭蓋骨用荷物. |
| `to_compressed_bytes` | 在標題中記錄壓縮標籤. |
| `to_bytes_auto` | 決定壓縮是否值得使用. |
| CRC64 加速 | 隨身使用 CRC64-XZ 在任何地方, CLMUL 在 x86 上_或是 PMULL 在 aarch64 提供時. |
| GPU CRC64 和壓縮 | 選擇性金屬或 CUDA 幫助者可能加快大型用荷物, CPU 我們的路線. |

這種速度從來沒有改變解碼內容. CRC 及其他 JSON
快速器必須與可移植輸出位相匹配.
區別在 CPU 及其他 GPU 但解碼的有效負荷和 Norito 標題
數據仍是核准的決定性.

## JSON 支持 {#json-support}

Norito 包括一個本地人 JSON 需要使用的端點和工具堆 JSON
沒有離開 Norito 這種系統.

| JSON 功能 | 使用案例 |
| --- | --- |
| `norito::json::{to_json, from_json}` | 決定性型 JSON 編碼/解碼. |
| 很漂亮的作家和助手 | CLI 輸出,燈具和流動 `std::io` 整合. |
| DOM 價值 | 透過程序操作, Norito 沒有任何問題 JSON 價值模型. |
| 快速打字 JSON | 基于結構性磁帶的解碼/加密方式, DTO 我們的路線. |
| 沒有副本讀者 | 在可能情況下, |
| 步-1加速器 | 選擇性 AVX2, NEON, 屬金或 CUDA 結構上索引與可回落. |

Iroha 這個代碼應該比較好 `norito::json` 打字的助手 API 增加使用量
沒有任何問題 `serde_json` 產品路徑的風險與方案不同,
預期的實地操作行為 SDKs 及其他 Torii 取劑.

## 導致的支持 {#derive-support}

Rust 數據類型通常使用衍生宏,而不是手動代碼.
導向層可以生成 Norito 兩元代碼,方案和 JSON 幫助他們.

常見的字段属性是:

| 屬性 | 影響 |
| --- | --- |
| `#[norito(rename = "other")]` | 使用穩定的序列化名稱, JSON 互換性 |
| `#[norito(skip)]` | 排斥了這個字段, `Default` 在解碼過程中. |
| `#[norito(default)]` | 使用方式 `Default` 如果已解密的有效載荷不承載該場域. |
| `#[norito(skip_serializing_if = "...")]` | 省略了從 JSON 還是保留定位解碼的默認故障. |

衍生品也暴露加碼長度的提示和正確長度的計算,
編碼器使用這些提示來儲存緩衝,

## 盒子特色的家庭 {#crate-feature-families}

在建造時 Iroha 或是 SDK 來自來源的結合, Norito 選擇哪些功能
提供助手和加速器:

| 功能家族 | 能幫助我們做什麼? |
| --- | --- |
| `derive` | 對二元程式,方案和程序宏重新出口 JSON 這種情況下, |
| `compression` | 支持頭蓋框使用的有效載荷. |
| `packed-seq` | 使用偏移表的集合布局. |
| `packed-struct` | 包裝的衍生式結構布局. |
| `compact-len` | 預先表示每值長度的 Varint. |
| `columnar` | Norito 列區,可適應 AoS/NCB 在預設中包含的行代克和借用於掃描繁重路径的視圖 `node-codec` 功能集 |
| `strict-safe` | 轉換可錯的路徑中的恐慌解碼為結構性錯誤. |
| `simd-accel` | CPU 如果有可行的加速,與決定性倒退. |
| `json` | 來自本地地區 JSON 分析師,作家, DOM, 這種方式, 很快就能帶來改變. |
| `json-std-io` | 讀者與筆者助手, JSON 這裡有許多人. |
| `metal-stage1`, `cuda-stage1` | 選擇性 GPU JSON 結構指數的後退. |
| `metal-stage2` | 選擇性金屬元數據分類 JSON 結構性膠帶. |
| `metal-crc64`, `cuda-crc64` | 選擇性 GPU CRC64 幫助大型貨物運作. |
| `gpu-compression` | 選擇性金屬或 CUDA 在大型用荷物中加速. |
| `stage1-validate` | 檢測速度的變更 JSON 結構指數與尺度輸出. |

功能可用性可能不同, SDKs 透過線上傳輸,
格式仍由標題和圖案控制,而不是本地建立的旗.

## Torii 及其他 Norito RPC {#torii-and-norito-rpc}

Torii 顯示性 JSON 許多運營者路線使用,但打字二元路線使用
Norito. 打字的電流介質類型 Norito HTTP 身體是
`application/x-norito`.

使用這些標題,當端點接受或返回輸入時 Norito:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

當端點支持兩種表示時, 客戶可以發送明顯的
選擇名單:

```http
Accept: application/x-norito, application/json
```

解碼故障顯示如記錄 Torii 顯示錯誤,並以遠隔計數計算.
常見的原因包括無效魔法,未支持版本,未支持功能
旗,檢查數量不一致,有變形 UTF-8, 沒有效果,與方案不一致.

Norito RPC 運輸由運輸配置選取.
顯示板應追蹤要求延遲,故障,活動連接,
答案字节,以及 `torii_norito_decode_failures_total` 獨立於 JSON
沒有交通工具.

## Norito 播放 {#norito-streaming}

Norito 流通將相同的決定性方法延伸到媒體和實時
運輸表面. 其主要部分是:

| 流動功能 | 目的 |
| --- | --- |
| 顯示 | 声明區域的承諾,隱私路徑,功能,代克配置文件,加密套件和內容關鍵數據. |
| 部分標題 | 聯繫區段數,時間,零件數量,時機,進位模式,音頻總結和Merkle根. |
| 部分承諾 | 請讓觀眾和接觸器在服務或解碼之前, |
| 控制 | 提供明顯的公告,反,關鍵更新和能力談判. |
| HPKE 關鍵更新 | 透過協商套件, 旋轉運輸秘密, |
| 能力談判 | 提供支持的功能位,數據圖表限制,反序列和隱私要求. |
| FEC 以及反 | 使用決定性接收者報告和對等式決策, |
| 符合性向量 | 跨語言的裝置證明 SDKs 解碼相同的表達, 分段和進水流. |

流量特定的代克和透型態與核心分離
Norito 交易/查詢格式,但他們的表單和控制數據仍然使用
Norito 這樣的路由,收費,重播和監控證據仍然可複製.

## 經營指南 {#operational-guidance}

- 我更喜歡 SDK 建造物和產生的接,而不是手工制造 Norito 這樣的數字也會增加.
- 處理圖案不匹配的情況是版本或固定問題,而不是暫時
  網路故障.
- 保持 `.nrt`, `.norito`, 隨著釋放或事件而顯現的文物
  這是一種產生他們.
- 使用 JSON 預測儀表和手動檢查, Norito 這樣的
  簽名,哈希或持續的數據的真相來源.
- 在添加新的打字時 Torii 目的地,文件是否接受 JSON,
  Norito, 或兩者,並將支持的內容類型暴露在 `/openapi`.
- 在啟動加速器時, 執行對度測試與尺度輸出之前
  加速器故障應該清潔地回落,
  這種方法可以幫助我們.

## 有關頁面 {#related-pages}

- [Torii 終點點](/zh-hant/reference/torii-endpoints.md)
- [創世記的參考](/zh-hant/reference/genesis.md)
- [數據模型方案](/zh-hant/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/zh-hant/guide/tutorials/javascript.md)
- [Python SDK](/zh-hant/guide/tutorials/python.md)
- [Swift 和iOS SDK](/zh-hant/guide/tutorials/swift.md)

## 上游參考資料 {#upstream-references}

- [Norito 格式規格](https://github.com/hyperledger-iroha/iroha/blob/main/norito.md)
- [Norito 箱子 README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/norito/README.md)
