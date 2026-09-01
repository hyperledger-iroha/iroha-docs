---
translation_locale: zh-hans
translation_source: /reference/norito.md
translation_source_hash: b3b7c03bc0df3f7fa3df7e44b0ec8d755d615f9edca66bbcfe5613c33c8afbfe
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---
# Norito {#norito}

Norito 是 Iroha 的规范序列化层。当对等节点、SDKs、CLI 工具、Torii、Kura 和生成的工件必须对完全相同的载荷达成一致时，使用的就是这种字节格式。

当数据涉及共识、签名、哈希、持久化或跨 SDK 互操作性时，请使用 Norito。只有在端点明确为运维人员、仪表板或快速调试提供人类可读投影时，才使用 JSON。

## Norito 的使用位置 {#where-norito-appears}

| 接口 | Norito 的用途 |
| --- | --- |
| 交易和查询 | 通过 Torii 提交的已签名交易和查询载荷编码为 Norito。 |
| 创世区块 | `kagami genesis sign` 生成已签名的 `.nrt` 区块，供对等节点在启动时加载。 |
| Torii 类型化响应 | 支持类型化二进制响应的端点使用 `Accept: application/x-norito`。 |
| SDKs | Rust、Python、JavaScript、Kotlin/Java、Swift 和 Android 客户端使用 Norito 构建器或绑定，而不是手动组装字节。 |
| Kura 存储 | 区块载荷、恢复辅助文件、名册和提交标记以 Norito 帧数据的形式存储。 |
| 清单 | Nexus、数据可用性、SoraFS、流媒体和面向应用的清单在需要签名或哈希时使用 Norito。 |
| 流媒体 | Norito Streaming 使用 Norito 清单、分段头、控制帧和一致性测试数据。 |

Norito 不是智能合约语言。它是承载交易、合约调用、清单和类型化 API 载荷的确定性封装与编解码器。

## 载荷模型 {#payload-model}

每个在线传输或磁盘存储的 Norito 载荷都由一个头部成帧，后跟编码后的载荷字节。无头部的裸载荷仅保留用于内部哈希、基准测试，以及会在传输前立即为结果添加头部的辅助 APIs。

| 头部字段 | 大小 | 用途 |
| --- | ---: | --- |
| Magic | 4 字节 | ASCII `NRT0`，用于尽早拒绝非 Norito 数据。 |
| Major | 1 字节 | 格式主版本；当前载荷使用 `0`。 |
| Minor | 1 字节 | v1 的解码提示；当前值为 `0x00`。布局由 Flags 描述。 |
| Schema hash | 16 字节 | 类型标识，供类型化解码器拒绝意外的载荷类型。 |
| Compression | 1 字节 | `0 = None`、`1 = Zstd`；未知值会被拒绝。 |
| Payload length | 8 字节 | 未压缩载荷的长度，以小端序 `u64` 表示。 |
| CRC64 | 8 字节 | 未压缩载荷的 CRC64-XZ 校验和。 |
| Flags | 1 字节 | 紧凑长度、打包序列和打包结构的布局标志。 |

头部共 40 字节。解码器在重建类型化值之前，会验证 Magic、版本、受支持的标志掩码、载荷长度、校验和及模式哈希。

## 布局标志 {#layout-flags}

Norito 将布局选项存储在头部的最后一个字节中。默认 v1 辅助函数发出 `COMPACT_LEN`（`0x02`），为每个值使用紧凑长度前缀。调用方以 `flags = 0x00` 编码时，显式固定宽度长度前缀仍然可读。

| 标志 | 十六进制 | 状态 | 效果 |
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` | 支持 | 使用偏移表和连续数据块对大小可变的集合进行编码。 |
| `COMPACT_LEN` | `0x02` | 默认 | 每个值的长度前缀使用规范无符号 varint。 |
| `PACKED_STRUCT` | `0x04` | 支持 | 将 derive 生成的结构编码为打包字段载荷。 |
| `VARINT_OFFSETS` | `0x08` | 保留 | v1 中会被拒绝；打包序列偏移量是固定宽度 `u64`。 |
| `COMPACT_SEQ_LEN` | `0x10` | 保留 | v1 中会被拒绝；顶层序列长度头为固定宽度 `u64`。 |
| `FIELD_BITSET` | `0x20` | 有条件支持 | 为打包结构添加位集，使只有需要显式大小的字段才携带大小前缀。要求同时设置 `PACKED_STRUCT` 和 `COMPACT_LEN`。 |

这些标志是显式的。解码器不会根据载荷形状、次版本或启发式方法推断布局。未知或无效的组合会被拒绝，从而确保所有对等节点以相同方式解释载荷。

## 编码规则 {#encoding-rules}

Norito 对 Iroha 数据模型中的常见数据形状使用确定性布局：

- 字符串格式为 `[len][utf8-bytes]`；启用 `COMPACT_LEN` 时，`len` 遵循该标志。
- 设置 `COMPACT_LEN` 时，每个值的长度使用紧凑 varint。
- 未设置 `COMPACT_LEN` 时，每个值的长度是 8 字节小端序 `u64`。
- v1 的序列长度头是固定 8 字节小端序 `u64`。
- `Vec<u8>` 编码为 `[len_u64][raw-bytes]`，而不是为每个字节各写一个长度。
- 打包序列使用 `(len + 1)` 个单调递增的 `u64` 偏移量，后跟拼接的元素载荷。
- 映射以固定 `u64` 编码条目数，并使用确定性的键顺序。`HashMap` 条目在编码前按键排序；`BTreeMap` 使用其自然顺序。
- `BigInt` 使用小端序二进制补码字节，以 `u32` 表示字节长度，上限为 512 位。
- `Numeric` 编码为 `(mantissa, scale)`；mantissa 存储整数值，scale 存储小数位数。

这些规则对签名和哈希至关重要。两个 SDKs 构建相同逻辑交易时，必须生成相同的规范字节。

## 模式哈希 {#schema-hashes}

类型化 Norito 载荷的头部包含 16 字节模式哈希。默认哈希由完全限定类型名称派生；启用结构化模式哈希的构建则改为从规范模式派生哈希。

类型化解码器会拒绝模式不匹配。这可防止客户端意外地将有效 Norito 帧解码为错误类型；当 SDK 测试数据包与节点数据模型不同步时，通常会以这种方式失败。

## 压缩和加速 {#compression-and-acceleration}

Norito 支持显式压缩和自适应压缩，而不会改变逻辑载荷：

| 功能 | 用途 |
| --- | --- |
| `to_bytes` | 编码头部，后跟未压缩载荷。 |
| `to_compressed_bytes` | 使用 Zstd 编码，并在头部记录压缩标签。 |
| `to_bytes_auto` | 使用确定性启发法判断压缩是否值得。 |
| CRC64 加速 | 所有平台均使用可移植的 CRC64-XZ；可用时，x86_64 使用 CLMUL，aarch64 使用 PMULL。 |
| GPU CRC64 与压缩 | 可选的 Metal 或 CUDA 辅助函数可以加速大型载荷，并在需要时回退到 CPU 路径。 |

硬件加速绝不会改变解码后的内容。CRC 和 JSON 加速器必须与可移植实现的输出逐位匹配。CPU 与 GPU 编码器生成的 Zstd 帧字节可能不同，但解码后的载荷和 Norito 头部元数据仍然保持验证所需的确定性。

## JSON 支持 {#json-support}

Norito 包含原生 JSON 栈，使需要 JSON 的端点和工具无需离开 Norito 类型系统。

| JSON 功能 | 用例 |
| --- | --- |
| `norito::json::{to_json, from_json}` | 确定性的类型化 JSON 编码与解码。 |
| 美化输出和 writer 辅助函数 | CLI 输出、测试数据和流式 `std::io` 集成。 |
| DOM 值 | 通过 Norito 的 JSON 值模型进行编程操作。 |
| 快速类型化 JSON | 基于结构磁带，为高频 DTO 路径进行解码和编码。 |
| 零拷贝读取器 | 扫描 token，并在可行时直接借用输入中的字符串。 |
| Stage-1 加速器 | 可选的 AVX2、NEON、Metal 或 CUDA 结构索引，并提供标量回退。 |

Iroha 代码处理类型化 API 载荷时，应优先使用 `norito::json` 辅助函数。在生产路径中直接添加 `serde_json`，可能偏离 SDKs 和 Torii extractor 预期的模式及字段处理行为。

## 派生功能支持 {#derive-support}

Rust 数据类型通常使用 derive 宏，而不是手写编解码代码。derive 层可以生成 Norito 二进制编解码器、模式和 JSON 辅助函数。

常用字段属性如下：

| 属性 | 效果 |
| --- | --- |
| `#[norito(rename = "other")]` | 使用稳定的序列化名称，以保持模式和 JSON 兼容性。 |
| `#[norito(skip)]` | 编码器省略该字段；解码器提供其 `Default` 值。 |
| `#[norito(default)]` | 解码后的载荷不含该字段时，使用 `Default`。 |
| `#[norito(skip_serializing_if = "...")]` | 谓词匹配时从 JSON 中省略字段，同时保留确定性的解码默认值。 |

在可行时，derive 实现还会公开编码长度提示和精确长度计算。编码器使用这些提示预留缓冲区并避免额外拷贝。

## Rust 软件包功能系列 {#crate-feature-families}

从源代码构建 Iroha 或 SDK 绑定时，Norito 功能决定可用的辅助函数和加速器：

| 功能族 | 启用内容 |
| --- | --- |
| `derive` | 重新导出用于二进制、模式和 JSON derive 的过程宏。 |
| `compression` | 为带头部帧的载荷提供 Zstd 支持。 |
| `packed-seq` | 使用偏移表的打包集合布局。 |
| `packed-struct` | 打包由 derive 生成的结构布局。 |
| `compact-len` | 每个值使用 varint 长度前缀。 |
| `columnar` | Norito Column Blocks、自适应 AoS/NCB 行编解码器，以及扫描密集路径使用的借用视图；包含在默认 `node-codec` 功能集中。 |
| `strict-safe` | 将可失败路径中的解码 panic 转换为结构化错误。 |
| `simd-accel` | 在可用处使用 CPU 加速，并提供确定性回退。 |
| `json` | 原生 JSON parser、writer、DOM、类型化 derive 和快速路径。 |
| `json-std-io` | 构建在 JSON 栈之上的 reader 和 writer 辅助函数。 |
| `metal-stage1`, `cuda-stage1` | 选用的 GPU JSON 结构索引后端。 |
| `metal-stage2` | 可选的 Metal 元数据分类，用于 JSON 结构磁带。 |
| `metal-crc64`, `cuda-crc64` | 大型载荷可选用的 GPU CRC64 辅助函数。 |
| `gpu-compression` | 大型载荷可选用的 Metal 或 CUDA Zstd 加速。 |
| `stage1-validate` | 调试验证，将加速后的 JSON 结构索引与标量输出进行比较。 |

不同 SDKs 和发布配置可用的功能可能不同。传输格式仍由头部和模式规定，而不是由本地构建标志决定。

## Torii 和 Norito RPC {#torii-and-norito-rpc}

Torii 的许多运维路由提供 JSON，但类型化二进制路由使用 Norito。当前类型化 Norito HTTP 正文的媒体类型是 `application/x-norito`。

当端点接受或返回类型化 Norito 时，请使用以下头部：

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

当端点同时支持两种表示形式时，客户端可以发送显式偏好列表：

```http
Accept: application/x-norito, application/json
```

解码失败会显示为类型化 Torii 错误，并由遥测进行计数。常见原因包括 Magic 无效、版本不受支持、功能标志不受支持、校验和不匹配、UTF-8 格式错误、枚举标签无效和模式不匹配。

Norito RPC 传输由传输配置选择。运维仪表板应跟踪请求延迟、失败、活动连接、响应字节和 `torii_norito_decode_failures_total`，并与 JSON 流量分开统计。

## Norito 流式传输 {#norito-streaming}

Norito Streaming 将同样的确定性方法扩展到媒体和实时传输接口。其关键组成如下：

| 流媒体功能 | 用途 |
| --- | --- |
| 清单 | 声明分段承诺、隐私路由、能力、编解码器配置文件、加密套件和内容密钥元数据。 |
| 分段头 | 绑定分段编号、持续时间、chunk 数量、时序、熵模式、音频摘要和 Merkle 根。 |
| Chunk 承诺 | 使观看者和中继在提供或解码数据前，能够对照清单验证载荷 chunk。 |
| 控制帧 | 用于承载清单公告、接收方反馈信息、传输密钥更新信息以及端点之间的能力协商。 |
| HPKE 密钥更新 | 使用协商后的套件和单调递增计数器轮换传输秘密。 |
| 能力协商 | 对受支持的功能位、数据报限制、反馈频率和隐私要求取交集。 |
| FEC 与反馈 | 对有损实时路径使用确定性的接收方报告和奇偶校验决策。 |
| 一致性向量 | 跨语言测试数据证明各 SDKs 会解码出相同的清单、分段和熵数据流。 |

流媒体专用编解码器和熵配置文件与核心 Norito 交易／查询格式相互独立，但其清单和控制数据仍使用 Norito，因此路由、计费、重放和审计证据保持可重现。

## 运维指南 {#operational-guidance}

- 优先使用 SDK 构建器和生成的绑定，而不是手工制作 Norito 字节。
- 将模式不匹配视为版本或测试数据问题，而不是暂时性网络故障。
- 将 `.nrt`、`.norito` 和清单工件归档到生成它们的发布包或事件包中。
- 对于已签名、已哈希或持久化的数据，以 Norito 为事实来源；JSON 投影仅用于仪表板和手动检查。
- 在添加一个新型的 Torii 端点时,记录它是否接受 JSON, Norito 或两者,并在 `/openapi.json` 中暴露支持的内容类型.
- 启用加速器前，请针对标量输出运行一致性测试。如果加速器失败，请使用确定性的标量回退；载荷语义必须保持不变。

## 相关页面 {#related-pages}

- [Torii 端点](/zh-hans/reference/torii-endpoints.md)
- [创世区块参考](/zh-hans/reference/genesis.md)
- [数据模型模式](/zh-hans/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/zh-hans/guide/tutorials/javascript.md)
- [Python SDK](/zh-hans/guide/tutorials/python.md)
- [Swift 与 iOS SDK](/zh-hans/guide/tutorials/swift.md)

## 上游参考 {#upstream-references}

- [Norito 格式的规范](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/norito.md)
- [Norito crate README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/norito/README.md)
