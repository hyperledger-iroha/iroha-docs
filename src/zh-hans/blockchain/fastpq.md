---
translation_locale: zh-hans
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ 是 Iroha 对选定的执行效果的 STARK 证明路径.它不取代正常的交易执行或共识.通过 ISI,IVM 和 Sumeragi 进行正常运行; FastPQ 消耗了确定性执行证明,并将支持的效果转化为证明批次.

当前的主机集成有两条主要路径：

- 在区块执行期间记录的透明数值资产转移
- SORA Nexus AXT 证明封装，其 `fastpq_binding` 携带 FastPQ 绑定

## 转移证人的路径 {#transfer-witness-path}

当指令突变余额时,透明的数值转移会产生结构化转移记录. 转录记录:

- 来源账户,目的地账户,资产定义和金额
- 转移前和后的发送者和接收者的余额
- 作为批量哈希所使用的交易入口点哈希
- 从提交账户中获取的授权主体信息
- 一个多尔塔转录的Poseidon摘要

批量转移使用多个海域的转录. 在这种情况下,一个海域的波西登摘要是缺失的.

在区块完成时, Iroha 将这些转录按输入点哈希组分.执行证人然后携带原始转录捆绑和为检测器准备的 FastPQ 过渡批次.

每个转移三角形变成两个过渡行:

|排列|关键形状|预估值|后值|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|发送人借款|`asset/<asset-definition>/<source-account>`|之前的发送人余额|之后的发送人余额|
|收件人信贷|`asset/<asset-definition>/<destination-account>`|之前的收件人余额|接收者余额之后|

数值将正常化为整数目击单位.如果不能在选定的十分数尺度中表示为非负的 `u64`,则对 FastPQ 批量来说,一个值被拒绝

## 公共输入 {#public-inputs}

每个 FastPQ 过渡批量都包含了将证明绑定到区块和执行环境的公开输入:

|输入|这意味着|
| ------------- | --------------------------------------------------------------- |
| `dsid` | 以小端序字节编码的数据空间标识符 |
|`slot`|区块创建时间转换为纳秒.|
|`old_root`|来自执行证人的父母状态根源|
|`new_root`|从执行证人中得到的后状态根源|
|`perm_root`|西顿对活跃角色许可的承诺|
|`tx_set_hash`|按顺序的交易和时间触发入口点 hashs|

主机对这些批次使用首个发布版本中唯一的参数集 `fastpq-state-transition-stark-v1`。

## 证明协议 {#proof-protocol}

规范转账工件是基于 Goldilocks 域及其 4 次扩域的掩码 DEEP 证明。其精确关系、转录和查询几何结构在固定版本的 [FastPQ DEEP 协议契约](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md)中定义。

## 箴言所检查的内容 {#what-the-prover-checks}

在构建跟踪之前, FastPQ 检测器通过过渡键,操作级别和插入序来定制批量顺序.传输行还需要转录元数据.具有转录行但没有转录的批量是无效的.

转移记录时,检查人员的检查包括:

- 发送者余额不得发生下溢
- `sender_after` 必须等于 `sender_before - amount`
- `receiver_after` 必须等于 `receiver_before + amount`
- 转录必须涵盖分批中的每一行转移
- 一个多尔塔波西登摘要,当存在时,必须与转录前图相匹配
- 条件是稀疏的Merkle证明必须被解码为版本 1;缺失的路径由确定性合成证明填充

追踪包含转移,铸造,销毁,角色授予,角色撤销,元数据集和权限搜索行的选择列. 数字操作行还载有签名的分数,每个资产的分数以及供应计数.

## 经验者林 {#prover-lane}

`iroha3d`在启动时启动 FastPQ 检查路径,如果可以初始化检查后端.该路径是一个带有界限的队列的背景任务.一个区块生成执行证人之后,提交路径会提交包含区块哈希,高度,视图和证人的检查路程.

如果通道没有运行或排队满,工作将被跳过,正常的区块处理继续.这意味着背景检查通道不是一个交易录取或共识门.它是一个已经执行的状态上的证明生产路径.

通道构建一个具有:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

两个设置均默认为 `cpu`。选择 `gpu` 是显式的 fail-closed 请求：如果未编译 GPU 支持，或所请求的 GPU 后端未通过预检，证明器通道将保持禁用。首个版本没有 `auto` 值，也不会从请求的 GPU 模式回退到 CPU。

## 验证 {#verification}

FastPQ 证明验证重建了规范批量承诺,并重复了公开转录.验证器检查了协议版本,参数设置版本,重播限制,追踪承诺,公开输入,采样的Merkle打开口,AIR 打开口和 FRI 查询链.

默认重播限制包括:

|限制|默认方式|
| ------------------ | ------: |
|过渡行|     256 |
|批量有效载荷大小|256 KiB |
|FRI 层|      16 |
|查询开放时间|     128 |

## SORA Nexus AXT 证明封装 {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT 证明封装可以嵌入 `AxtFastpqBinding`。AXT 封装的区块校验、IVM 主机的 AXT 封装检查以及 `RegisterVerifiedFeeSponsorVaultAllocation` 都要求封装中存在 `fastpq_binding`，会将其与预期声明进行核对，并对封装及其内嵌证明调用 FastPQ 验证器。缺少绑定或验证失败都会导致该操作被拒绝。

### AXT 绑定数学 {#axt-binding-math}

对于 SORA Nexus AXT 封装，证明重放前会先规范化 `AxtFastpqBinding`。空的 `parameter`、`verifier_id` 或 `verifier_version` 值会被拒绝；验证器 ID 必须为 `fastpq`，版本必须为 `v1`，而仍在维护的 AXT 流程使用 `fastpq-state-transition-stark-v1`。声明类型会去除首尾空白并转换为小写。

AXT FastPQ 公共输入是确定性字节哈希:

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

AXT 过渡键是:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

在 `authorization` 索赔中插入了授予资金的行:

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

以及绑定授权策略的元数据行。`compliance` 声明插入两行元数据：一行对应策略，另一行对应目标数据空间。

对于 `tx_predicate` 和 `value_conservation`,当结合物包含正源或目的量时,使用明确效果数值.否则代码将获得有限的确定性数值:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

然后使用相同的转移方程:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

合成发送者和接收者账户ID由关键种子生成:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

转让批量哈希是:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT 批量清单摘要是对规范绑定的 Norito 编码计算出的 SHA-256：

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## 参数组件 {#parameter-sets}

首个发布版本恰好只有一个规范参数集：`fastpq-state-transition-stark-v1`。它的目标是在 Goldilocks 域及其 4 次扩域（`X^4 - 7`）上提供 128 位安全性，并使用 `2^16` 的迹大小、`2^19` 的 LDE 大小、FRI 元数 2、扩展因子 8、最多 17 次归约以及 136 次查询。

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

同样的执行和远程测量标签可以在 `iroha3d` 中取消:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

环境变量也支持配置字段. FastPQ 特定的变量包括:

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

## 计量 {#metrics}

在启用远程测量时, FastPQ 将对后端选择和金属运行时行为进行出口:

|计量|这意味着|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|根据后端和设备标签的要求和解决执行模式 |
|`fastpq_poseidon_pipeline_total`|索取和解决了Poseidon管道的路径|
|`fastpq_metal_queue_depth`|Metal 队列限制、最大并发数、调度数量和采样窗口|
|`fastpq_metal_queue_ratio`|金属队列繁忙和重叠比例 |
|`fastpq_zero_fill_duration_ms`|为金属运行提供零填充持续时间 |
|`fastpq_zero_fill_bandwidth_gbps`|产生的零填充带宽|

在 [ 性能和指标](/zh-hans/guide/advanced/metrics.md)中列出的共识和队列信号中使用一般的绩效分类.

## 相关参考 {#related-reference}

- [节点授权类型快照数据模型方案](/zh-hans/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ 的选项](/zh-hans/reference/iroha3d-cli.md#fastpq-overrides)
