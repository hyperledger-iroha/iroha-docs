---
translation_locale: zh-hans
translation_source: /reference/norito.md
translation_source_hash: ff258251887109f6cb28241235caea8e1b6a69df10df60cb7b2e7c2507004b4e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Norito {#norito}

Norito 是 Iroha 它是使用的字节格式.
当同龄人, SDKs, CLI 工具, Torii, Kura, 而生成的文物必须同意
在同样的有效载荷上.

使用 Norito 如果数据是共识,签署,哈希,持久性的部分,
或交叉-SDK 互操作性,使用 JSON 如果一个终点明确提供
用于操作员,仪表板或快速调试.

## 在哪里 Norito 出现 {#where-norito-appears}

| 表面 | 如何? Norito 使用 |
| --- | --- |
| 交易和查询 | 通过提交的签署交易和查询有效载荷 Torii 编码为 Norito. |
| 创世记 | `kagami genesis sign` 产出签名的 `.nrt` 在启动时阻止同行加载. |
| Torii 类型的答案 | 支持输入二进制响应使用的终点 `Accept: application/x-norito`. |
| SDKs | Rust, Python, JavaScript, Kotlin/Java, Swift, 并且 Android 客户使用 Norito 构建器或绑定器,而不是手动组装的字节. |
| Kura 存储 | 区块有效载荷,恢复侧车,列表和承诺标记存储为 Norito- 设置数据. |
| 宣言 | Nexus, 数据可用性, SoraFS, 流媒体和应用程序面向的表格使用 Norito 必须签署或哈希明示表时. |
| 流媒体 | Norito 流媒体使用 Norito 显示器,段头,控制框架和符合性灯具. |

Norito 这不是一个智能合同语言.
包含交易,合同通话,表达和打字的代码 API
运输量.

## 有效载荷模型 {#payload-model}

每个电线或磁盘 Norito 使用负载由一个标题,然后是
无标题或裸体的有效载荷为内部使用保留
哈希,基准和辅助器 APIs 立即将结果包装成一个
在运输前标题.

| 标题字段 | 尺寸 | 目的 |
| --- | ---: | --- |
| 魔术 | 4 字节 | ASCII `NRT0`, 用于拒绝 Norito 早期的数据. |
| 校长 | 1 字节 | 主要版本格式.当前的有效载荷使用 `0`. |
| 年轻人 | 1 字节 | 固定的v1解码提示.当前的有效载荷使用 `0x00`; 布局选项在旗中活跃. |
| 方案哈希 | 16 字节 | 类型识别器用于拒绝意想不到的有效载荷. |
| 压缩 | 1 字节 | `0 = None`, `1 = Zstd`. 不知价值被拒绝. |
| 有效载荷长度 | 8 字节 | 不压缩的有效载荷长度为小 `u64`. |
| CRC64 | 8 字节 | CRC64-XZ 未压缩的有效载荷的检查总量. |
| 旗 | 1 字节 | 包装序列和包装结构的布局标志 |

解码器验证了魔法,版本,支持旗
在重建之前,面具,有效载荷长度,检查数量和方案哈希
输入值.

## 布局旗 {#layout-flags}

Norito 在最后的标题字节中存储布局选项.默认的v1辅助器
发射 `COMPACT_LEN` (`0x02`) 对于紧的每值长度前置.
在调用者编码时,固定宽度长度前置仍然可读
`flags = 0x00`.

| 旗 | 子 | 状态 | 影响 |
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` | 支持 | 编码变量大小的集合,包含偏移表加上连接数据区块. |
| `COMPACT_LEN` | `0x02` | 默认 | 用于每值长度前置符的常规未签名色. |
| `PACKED_STRUCT` | `0x04` | 支持 | 编码衍生生成的 structs作为包装的 поле用载荷. |
| `VARINT_OFFSETS` | `0x08` | 预留 | 在v1中拒绝;包装序列偏移是固定宽度 `u64`. |
| `COMPACT_SEQ_LEN` | `0x10` | 预留 | 在v1中被拒绝;最高级别的序列长度标题是固定宽度 `u64`. |
| `FIELD_BITSET` | `0x20` | 要求支持 | 添加一个对包装结构的位集,因此只需要明确尺寸的字段才能带有尺寸前置. `PACKED_STRUCT` 并且 `COMPACT_LEN`. |

解码器不会从有效载荷的形状中推断布局,
不知名或无效的组合被拒绝
所有同龄人都以相同的方式解释有效载荷.

## 编码规则 {#encoding-rules}

Norito 使用在
在 Iroha 数据模型:

- 字符串是 `[len][utf8-bytes]`; `len` 下面是 `COMPACT_LEN` 如果能.
- 每个值的长度使用紧的涂料,当 `COMPACT_LEN` 是设置的,否则
  固定的8字节小单元 `u64`.
- 序列长度标题是固定的8字节小 `u64` 在v1中.
- `Vec<u8>` 编码为 `[len_u64][raw-bytes]` 而不是每字节一个长度.
- 包装序列使用 `(len + 1)` 单调 `u64` 抵消后的
  连锁元素的有效载荷.
- 地图编码输入数量与固定 `u64` 并且使用确定性关键顺序.
  `HashMap` 在编码之前,输入按键进行排序; `BTreeMap` 使用其
  它们是自然的.
- `BigInt` 使用小二的补充字节 `u32` 字节长度
  和一个512位的帽子.
- `Numeric` 编码为 `(mantissa, scale)`, 鱼储存的
  整数值和尺度存储了部分数字的数量.

这些规则对于签名和哈希斯都很重要. SDKs 它们的构建是相同的.
逻辑交易必须产生相同的定律字节.

## 方案 Hashes {#schema-hashes}

类型 Norito 在标题中包含16字节的图案哈希.
哈希来自完全合格的类型名称.
结构性图案哈希取出了该图案的哈希.

类型的解码器拒绝了方案不匹配. 这可以保护客户端免受意外
解码一个有效的 Norito 框架是错误的类型,这是通常故障模式
当一个 SDK 固定束从节点数据模型中转移.

## 压缩和加速 {#compression-and-acceleration}

Norito 支持明确和适应性压缩,而不会改变逻辑
使用载荷:

| 功能 | 目的 |
| --- | --- |
| `to_bytes` | 编码一个未压缩的标题框载荷. |
| `to_compressed_bytes` | 通过Zstd编码并记录压缩标签在标题中. |
| `to_bytes_auto` | 用确定性论来决定压缩是否值得. |
| CRC64 加速 | 可移动使用 CRC64-XZ 在任何地方, CLMUL 在 x86 上_64或 PMULL 在可用时,在 aarch64 上. |
| GPU CRC64 和压缩 | 可选金属或 CUDA 助手可以加速大型有效载荷,然后倒回 CPU 路径. |

硬件加速永远不会改变解码的内容. CRC 并且 JSON
加速器必须与可移植输出位对位相匹配.
区别在 CPU 并且 GPU 编码器,但解码的有效载荷和 Norito 标题
测试数据的质量

## JSON 支持 {#json-support}

Norito 包括一个本地人 JSON 需要的终端点和工具堆 JSON
没有离开 Norito 类型系统.

| JSON 功能 | 使用案例 |
| --- | --- |
| `norito::json::{to_json, from_json}` | 确定性类型 JSON 编码/解码. |
| 美女和作家的助手 | CLI 输出,灯具和流量 `std::io` 集成. |
| DOM 价值 | 通过程序操作 Norito 现在 JSON 价值模型. |
| 快速打字 JSON | 基于结构带的热型解码/编码 DTO 路径. |
| 零拷贝读器 | 在可能的情况下,从输入中借取字符串的标记扫描. |
| 阶段1加速器 | 选择性 AVX2, NEON, 金属或 CUDA 结构上索引与尺度倒退. |

Iroha 代码应该更好 `norito::json` 用于打字的辅助器 API 增加有效载荷
简单的 `serde_json` 对生产路径的风险与方案不同,
预期的现场处理行为 SDKs 并且 Torii 提取剂.

## 衍生支持 {#derive-support}

Rust 数据类型通常使用衍生宏,而不是手动代码.
衍生层可以产生 Norito 双代码,方案和 JSON 帮助的人.

一般的字段属性是:

| 属性 | 影响 |
| --- | --- |
| `#[norito(rename = "other")]` | 使用稳定的序列化名称来编写方案和 JSON 兼容性. |
| `#[norito(skip)]` | 排放了场地,填满了 `Default` 在解码过程中. |
| `#[norito(default)]` | 使用 `Default` 如果一个解码的有效载荷不携带该领域. |
| `#[norito(skip_serializing_if = "...")]` | 删除从 JSON 在预言匹配时,同时保持确定性解码默认. |

衍生品也暴露了编码长度的提示和精确长度计算,
编码器使用这些提示来保留缓冲,避免额外的复印.

## 盒子特征家庭 {#crate-feature-families}

在建造时 Iroha 或 SDK 来源的结合, Norito 选择哪些功能
可提供辅助器和加速器:

| 功能家族 | 它所能做到的 |
| --- | --- |
| `derive` | 对二进制程序,方案和程序宏进行重新出口 JSON 它们的来源 |
| `compression` | 支持标题框的有效载荷. |
| `packed-seq` | 使用偏移表的集合布局. |
| `packed-struct` | 包装的衍生式结构布局. |
| `compact-len` | 每个值长度的Varint前置. |
| `columnar` | Norito 专块,适应性 AoS/NCB 列代码和扫描重路径的借用视图;包含在默认中 `node-codec` 功能集. |
| `strict-safe` | 转换错误路径中的恐慌解码成结构性错误. |
| `simd-accel` | CPU 如果可用,加快速度,随着决定性倒退. |
| `json` | 原住民 JSON 分析师,作家, DOM, 它们是有字体的,快速的. |
| `json-std-io` | 读者和作家辅助员 JSON 一堆东西. |
| `metal-stage1`, `cuda-stage1` | 选择性 GPU JSON 结构指数后台. |
| `metal-stage2` | 选项金属元数据分类 JSON 结构磁带. |
| `metal-crc64`, `cuda-crc64` | 选择性 GPU CRC64 对于大型用品的辅助员. |
| `gpu-compression` | 可选金属或 CUDA 对于大型有效载荷,Zstd加速. |
| `stage1-validate` | 测试验证 JSON 结构指数与尺度输出. |

功能可用性可能不同 SDKs 电线是什么意思?
格式仍然由标题和方案控制,而不是本地构建旗.

## Torii 并且 Norito RPC {#torii-and-norito-rpc}

Torii 曝光 JSON 对于许多运营商路线,但使用类型二进制路线
Norito. 输入电流的媒体类型 Norito HTTP 身体是
`application/x-norito`.

使用这些标题,当终点接受或返回输入时 Norito:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

当一个终端支持两种表示时,客户可以发送明确的
偏好列表:

```http
Accept: application/x-norito, application/json
```

解码故障按输入显示 Torii 错误并通过远程测量计算.
常见原因包括无效的魔术,不支持版本,不支持功能
标志,检查数量不匹配,错形 UTF-8, 不有效的 enum 标签,以及方案不匹配.

Norito RPC 运输通过运输配置进行选择.
仪表板应追踪请求延迟,故障,活跃连接,
响应字节,以及 `torii_norito_decode_failures_total` 独立于 JSON
交通.

## Norito 流媒体 {#norito-streaming}

Norito 流媒体将相同的确定性方法扩展到媒体和实时
运输表面. 其主要部分是:

| 流媒体功能 | 目的 |
| --- | --- |
| 宣言 | 声明细分承诺,隐私路径,功能,编码器配置文件,加密套件和内容关键元数据. |
| 部分标题 | 绑定段数,持续时间,零件数量,时机,进化模式,音频总结和Merkle根. |
| 部分承诺 | 让观众和继电器在服务或解码之前, |
| 控制框架 | 携带明确的公告,反,关键更新和能力谈判. |
| HPKE 关键更新 | 通过谈判套件和单调增长计数器来旋转运输秘密. |
| 能力谈判 | 交叉支持的功能位,数据图数限制,反序列和隐私要求. |
| FEC 和反 | 使用确定性收件报告和对等决策用于损失实时路径. |
| 符合性向量 | 跨语言设备证明 SDKs 解码相同的表达,段落和体流. |

流量特定的编码和透配置文件与核心分开
Norito 交易/查询格式,但它们的表格和控制数据仍然使用
Norito 因此,路由,发票,重播和审计证据仍然可复制.

## 运营指导 {#operational-guidance}

- 我更喜欢 SDK 建筑物和产生的结合物,而不是手工制品 Norito 字节.
- 处理方案不匹配作为版本或固定问题,而不是暂时的
  网络故障.
- 保持 `.nrt`, `.norito`, 和随着释放或事件的现象
  它们的产物.
- 使用 JSON 预测仪表板和手动检查,但保持 Norito 作为
  签署,哈希或持久数据的真相来源.
- 在添加一个新的打字时 Torii 终点,文件是否接受 JSON,
  Norito, 或两者,并将支持的内容类型暴露在 `/openapi`.
- 在启动加速器时,在之前进行与尺度输出相等性测试
  加速器故障应该清洁地回落,而不是改变
  它们的含义.

## 相关页面 {#related-pages}

- [Torii 终点](/zh-hans/reference/torii-endpoints.md)
- [创世记的参考](/zh-hans/reference/genesis.md)
- [数据模型方案](/zh-hans/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/zh-hans/guide/tutorials/javascript.md)
- [Python SDK](/zh-hans/guide/tutorials/python.md)
- [Swift 和iOS SDK](/zh-hans/guide/tutorials/swift.md)

## 上游引用 {#upstream-references}

- [Norito 格式规范](https://github.com/hyperledger-iroha/iroha/blob/main/norito.md)
- [Norito 箱子 README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/norito/README.md)
