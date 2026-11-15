---
translation_locale: zh-hans
translation_source: /blockchain/fastpq.md
translation_source_hash: 98c258ab99bcc7d7d51b69ddd26e39b19ef4eb14d53001825f3737144d68f0e5
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ 是 Iroha 针对选定执行效果的 STARK 证明路径。它不会取代常规的交易执行或共识。交易仍照常经由 ISI、IVM 和 Sumeragi 执行；FastPQ 随后依据区块执行所捕获的源记录，证明受支持的效果。

当前的主机集成有两条主要路径：

- 已最终确定区块中的数值资产效果，由节点的证明器通道证明
- SORA Nexus AXT 证明封装，其 `fastpq_binding` 携带 FastPQ 绑定

## 转移见证路径 {#transfer-witness-path}

当指令修改余额时，透明的数值转移会创建一个结构化的转移转录。该转录记录：

- 来源账户,目的地账户,资产定义和金额
- 转移前和后的发送者和接收者的余额
- 用作批次哈希的交易入口点哈希
- 由提交账户派生的授权主体摘要
- 用于单增量转录的 Poseidon 摘要
- 发送者和接收者余额的稀疏 Merkle 更新见证

批量转移使用一个包含多个增量的转录。在这种情况下，不存在单增量 Poseidon 摘要。

区块执行会按发出转录的执行调用对转录进行分组，并将其与区块的 FastPQ 源记录一起保存。在 AXT 转移陈述中，每个转移增量都会变为两个状态转换行：

| 行 | 键 | 前值 | 后值 |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| 发送者借记 | 对应资产定义和来源账户的 `FastpqBalanceKeyV1` | 发送者变更前余额 | 发送者变更后余额 |
| 接收者贷记 | 对应资产定义和目标账户的 `FastpqBalanceKeyV1` | 接收者变更前余额 | 接收者变更后余额 |

每个键都是 `FastpqBalanceKeyV1` 的规范 Norito 帧，由 `transfer_balance_key` 根据带类型的资产定义和无域账户构建。账户别名和显示形式绝不会作为键材料。

## 执行效果 {#execution-effects}

证明器通道证明完整的执行效果陈述。每个陈述按执行顺序涵盖一个执行条目的全部数量效果：

| 效果 | 更新的值 | 规则 |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| 转移 | 来源余额和目标余额 | 金额在同一资产的两个余额之间转移 |
| 铸造 | 余额和供应量 | 两者增加相同的非零数量 |
| 销毁 | 余额和供应量 | 两者减少相同的数量 |
| 退役 | 供应量和生命周期 | 供应量保持为零，资产的存在值由 1 变为 0 |

供应量绝不会低于任一余额。每个键由域分隔标签 `iroha:fastpq:execution-quantity-key:v1`、一个 NUL 字节，以及 `FastpqExecutionQuantityKeyV1` 余额键、供应量键或生命周期键的 Norito 编码组成。角色授予、角色撤销及其他操作不会被证明。

执行效果陈述和 AXT 转移陈述中的值是按资产小数位数表示的精确非负整数单位（`FastpqQuantityUnits`），因此不受 `u64` 的限制。陈述构建会拒绝小数位数不匹配、负差值以及任何算术或排序上的不一致；它绝不会修复公开值。

## 公共输入 {#public-inputs}

每个 FastPQ 陈述都携带公共输入，用于将证明绑定到区块和执行上下文：

|输入|含义|
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid` | 数据空间标识符：其 `u64` 值按小端序排列，后接八个零字节 |
| `slot` | 以纳秒表示的区块创建时间，精度为毫秒 |
| `old_root` | 应用陈述前，所涉键的稀疏 Merkle 树的根 |
| `new_root` | 应用陈述后，所涉键的稀疏 Merkle 树的根 |
| `perm_root` | 对执行状态中角色权限表的承诺 |
| `tx_set_hash` | 对区块内按区块顺序排列的交易传输编码的承诺 |

`old_root` 和 `new_root` 仅涵盖陈述所涉及的键。它们不是持久化的世界状态根。

`perm_root` 是 Iroha 的 32 字节 `Hash`，其输入为域分隔标签 `fastpq:v1:permission-table:blake2b-256`、以小端序 `u64` 表示的条目数，以及排序后的各条目。每个条目由角色 ID 的哈希、该角色某项权限的哈希，以及该权限以小端序 `u64` 表示的纪元组成。若表为空，该值为 32 个零字节。这仅是角色与权限上下文；它不证明账户成员资格或授权。

`tx_set_hash` 是 Iroha 的 `Hash`，其输入为域分隔标签 `iroha:axt:ordered-transaction-wire-set:v1`、一个 NUL 字节、交易数量，以及按区块顺序排列的每笔交易的传输编码长度及其完整传输编码字节。数量和长度均为小端序 `u64` 值。交易不会被排序或去重，签名保留在原像中。

Iroha 的 `Hash` 是将最后一个字节的最低位置为 1 的 Blake2b-256。陈述还携带一个排序哈希，以及其完整的规范行和源事实；证明会绑定上述所有内容。

## 证明协议 {#proof-protocol}

规范 FastPQ 工件是基于 Goldilocks 域及其 4 次扩域的掩码 DEEP 证明。其精确关系、转录和查询几何结构在固定版本的 [FastPQ DEEP 协议契约](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md)中定义。

调用方选择普通陈述或 AXT 陈述以及资源限制，但不选择电路、验证密钥、查询数量或转录内部细节。普通路径为 `offline_compact::prove_quantity_ordinary_artifact`；AXT 路径为 `offline_compact::prove_quantity_axt_artifact`，`prove_axt_bound_batch` 会将其封装，用于已绑定的批次。透明的 `Prover`、`Proof` 和重放 `verify` API 仅存在于测试和 `dev-tools` 构建中。

## 证明检查的内容 {#what-the-proof-checks}

在进行任何私有处理之前，生产者会先准备公开陈述。它会检查账户、金额、数值、出现次数、稳定的键顺序和键分配，并拒绝公开事实不一致的陈述。随后，密封关系会针对每个分段中的一次效果或转移出现，证明两次完整的 32 层稀疏 Merkle 更新。默认限制允许每个工件最多包含两个分段。

每条迹有 65,536 行。生产者对 301 个私有列生成承诺，验证器则独立重建 41 个公开列。新的密码学熵会对迹列、商多项式以及一个独立承诺的组合多项式进行掩码。商的除法必须能够整除。生产者在返回工件之前，会先验证自己的工件。

公开陈述中的值不会被隐藏。某个操作出现在传输格式中，并不意味着它会被接受：只有上文列出的效果具备证明关系，而 AXT 陈述只接受有见证的转移。

## 证明器通道 {#prover-lane}

除非 Kura 以 `init_mode = "fast"` 启动，否则 `iroha3d` 会在节点启动期间、Torii 开始接受提交之前，启动一个 FastPQ 证明器工作器。工作器在后台初始化其后端，因此即使初始化失败，启动过程也会继续；此时该通道保持禁用。

工作器会轮询节点的已最终确定状态和 Kura 存储。对于每个已最终确定的区块，它会获取经过认证的源（若源未存储，则重放原生执行），并使用普通路径逐一证明该区块的完整陈述。重启后，它会依据固定的已签名创世区块重建经过认证的前缀。它将每个工件存入 Kura 有上限的 FastPQ 存储区。已存储的工件仅是一份通告：在继续之前，生产者会认证源并再次验证该工件。

证明生成仅在节点本地进行。它不是交易准入或共识的关卡：执行、提交和最终性都不会等待证明。可重试的失败会将该工作留待之后的尝试，并且每个进程只运行一个生产者。

## 验证 {#verification}

验证器依据从其自身经过认证的陈述中推导出的预期来检查工件，绝不依据被检查的工件本身。验证过程在限制范围内对每个分段只解码一次，在域外点处只对 AIR 求值一次，依据已承诺的根认证每个已打开的行、商叶节点和 FRI 纤维以及完整的 FRI 末层，并执行最多 385 次折叠检查。它不会构建任何私有见证、迹或完整的低度扩展。

验证成功即确立了与调用方预期的一致性。它不授予任何执行权限、源最终性、重放准入或 AXT 支出授权。

来自 `offline_compact::VerificationLimits` 的默认限制（普通路径也使用这些限制）：

|限制|默认值|
| ------------------------------- | ------------: |
| 每个工件的分段数 | 2 |
| 工件传输编码字节数 | 1 MiB |
| 子证明帧 | 500,084 字节 |
| 所有分段合计的陈述字节数 | 512 KiB |
| 每个分段的查询数 | 77 |
| 所有分段合计的查询数 | 154 |

节点通道还会用 `zk.fastpq.proof_sidecar_max_bytes` 和 Kura 的 FastPQ 对象上限进一步限制工件传输编码字节数。在解码之前，AXT 证明数据块最多可容纳 2 MiB，其内嵌的 FastPQ 有效载荷最多 1 MiB。

## SORA Nexus AXT 证明封装 {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT 证明封装可以嵌入 `AxtFastpqBinding`。AXT 封装的区块校验、IVM 主机的 AXT 封装检查以及 `RegisterVerifiedFeeSponsorVaultAllocation` 都要求封装中存在 `fastpq_binding`，会将其与预期声明进行核对，并对封装及其内嵌证明调用 FastPQ 验证器。缺少绑定或验证失败都会导致该操作被拒绝。

验证器只接受有见证的转移声明，即 `tx_predicate` 和 `value_conservation`。`authorization` 和 `compliance` 声明类型只是不透明地承载效果，不具备转移关系，验证会拒绝它们。区块校验也会拒绝携带远程支出的封装，IVM 主机则拒绝独立的 `AXT_VERIFY_DS_PROOF` 准入。在能够认证已最终确定的源根、交易集合和发行方授权之前，这两者都保持不可用。

### AXT 绑定 {#axt-binding}

对于 SORA Nexus AXT 封装，`AxtFastpqBinding` 会在证明和验证之前进行规范化：

- `parameter`、`source_dataspace`、`source_receipt_id` 和 `verified_effect_type` 会去除首尾空白，且不得为空
- `source_tx_commitment`、`claim_digest`、`witness_commitment` 和 `policy_commitment` 会转换为小写，且必须是 32 字节的十六进制编码
- `verifier_id` 必须为 `fastpq`，`verifier_version` 必须为 `v1`
- `claim_type` 会去除首尾空白并转换为小写，且必须是上述四种声明类型之一
- `target_dsids` 必须非空且严格升序
- `remote_spend_intent_commitments` 必须严格升序，且不超过首个发布版本的上限

验证要求严格的规范形式；它不会代替调用方对绑定进行规范化。

绑定附加到区块执行已捕获的批次上；它不会创建状态转换。该批次必须包含至少一个状态转换，并指明绑定的参数集 `fastpq-state-transition-stark-v1`。其 `entry_hash` 元数据必须等于 `source_tx_commitment`，其公共 `dsid` 必须编码绑定的 `source_dsid`。转移声明必须携带至少一个转移转录，且每个转录的批次哈希都必须等于 `source_tx_commitment`。

随后，绑定过程会将与证明绑定的元数据写入批次：规范绑定、其四个摘要、`source_receipt_id`、`target_dsids`、`verified_effect_type`、非空的 `corridor`、非零的清单根、可选的 DA 承诺、可选的非零承诺金额，以及到期槽位（为零表示不会到期）。最后，它会对绑定和不含封印的批次添加一个封印：

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

其中 $E$ 表示规范 Norito 编码。在绑定之后更改批次、绑定或与证明绑定的值，会导致验证失败。验证器还会将封装的数据空间、清单根、DA 承诺、承诺金额和到期时间与证明绑定的值进行比较。

经过验证的封装会报告其已证明的 `old_root`、`new_root` 和 `tx_set_hash`，以及一个陈述摘要。该摘要涵盖以小端序 `u64` 表示的封装数据空间、其清单根、DA 承诺（如存在）、绑定以及陈述：

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

AXT 批次清单摘要是对规范绑定的 Norito 编码计算出的 SHA-256：

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## 参数集 {#parameter-sets}

首个发布版本恰好只有一个参数集：`fastpq-state-transition-stark-v1`。批次和 AXT 绑定都会指明该参数集，AXT 证明会拒绝任何其他名称。DEEP 协议契约固定了已发布工件的几何结构：

| 项目 | 值 |
| -------------------------- | ----------------------------------------------------- |
| 域 | Goldilocks `p = 2^64 - 2^32 + 1`，扩域 `u^4 - 7` |
| 迹行数 | 65,536 |
| 求值行数 | 8,388,608（扩展因子 128） |
| FRI 折叠元数 | `[16, 16, 8, 8, 4]` |
| 查询 | 77 个不同位置 |
| 研磨 | 无 |
| 承诺与转录 | SHA3-256 和 SHAKE256 |

目前尚无生产环境资格认定。针对该构造的可靠性、隐藏性和 Fiat-Shamir 的独立审查尚未完成，固定版本的 [生产就绪记录](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md) 也未提出任何按工作量归一化的安全性主张。

## 配置 {#configuration}

FastPQ 配置嵌套在 `zk.fastpq` 之下。

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

两种模式都只接受 `cpu` 或 `gpu`，默认值为 `cpu`。将任一模式设为 `gpu` 后，证明哈希计算就必须使用设备：在 macOS 上为 Metal，在其他平台上为 CUDA。如果未编译 GPU 支持，或设备未通过预检，证明器通道将保持禁用；它绝不会回退到 CPU。设备负责批量执行 Merkle 叶节点和下层父节点的哈希计算；转录、有序的上层树和迹运算仍在 CPU 上进行。设置 `poseidon_mode = "gpu"` 时，如果另一项预检通过，节点还会在 GPU 上批量计算转录的 Poseidon 摘要；否则在 CPU 上计算。

`proof_sidecar_max_bytes` 限制节点持久化并验证的已编码工件大小，默认值为证明器的最大证明帧。`producer` 表约束每次证明尝试：其轮询间隔、时间预算、原生重放步数（1 到 64），以及在分配之前接受的源条目和陈述。`metal_queue_fanout` 接受 1 到 4。

模式和遥测标签设置也可以通过 `iroha3d` 覆盖：

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

`iroha3d` 在读取配置文件时会忽略环境变量，因此请在 TOML 中或使用上述选项设置这些值。

## 指标 {#metrics}

启用遥测后，FastPQ 会导出有关后端选择、证明持久化和 Metal 运行时行为的指标：

|指标|含义|
| ----------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|按后端和设备标签统计的请求执行模式与解析后的执行模式 |
|`fastpq_poseidon_pipeline_total`|请求的与解析后的 Poseidon 管道路径|
| `fastpq_gpu_disable_total` | 按加速器、原因和设备标签统计的 GPU 加速器禁用事件 |
| `fastpq_gpu_parity_failure_total` | 按加速器、原因和设备标签统计的抽样 GPU 一致性校验失败 |
| `fastpq_proof_sidecar_queue_depth` | 排队中的 FastPQ 证明辅助记录附件 |
| `fastpq_proof_sidecar_events_total` | 按事件统计的证明辅助记录持久化事件 |
|`fastpq_metal_queue_depth`|Metal 队列限制、最大并发数、调度数量和采样窗口|
|`fastpq_metal_queue_ratio`|Metal 队列的繁忙比例和重叠比例 |
|`fastpq_zero_fill_duration_ms`|Metal 运行的主机零填充持续时间 |
|`fastpq_zero_fill_bandwidth_gbps`|推导出的零填充带宽|

模式、GPU、Metal 队列和零填充指标需要 `extended` 或 `full` 遥测配置级别，并且在 Kura 以 `init_mode = "fast"` 启动时不会导出。Metal 队列和零填充指标还需要 macOS 上的 `fastpq-gpu` 构建。

进行一般性能问题的初步排查时，请将这些指标与[性能和指标](/zh-hans/guide/advanced/metrics.md)中列出的共识和队列信号结合使用。

## 相关参考 {#related-reference}

- [数据模型方案](/zh-hans/reference/data-model-schema.md)，提供以节点为准的类型快照
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [`iroha3d` FastPQ 的选项](/zh-hans/reference/iroha3d-cli.md#fastpq-overrides)
