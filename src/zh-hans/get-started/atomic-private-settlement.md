---
translation_locale: zh-hans
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 18b5e9c80bfa5542b996548fd07603a311099f76a4443cf143cd959991f80dc3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 运行原子私人跨数据空间解决方案 {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1`在每一个2到255个 SORA Nexus 数据域中协调一个机密结算脚本,并在一项全球状态交易中完成每个脚本.被拒绝,过期或中止的捆绑不适用于任何脚本.透明原生 AMX DvP/PvP 仍然是单独的协议路径.

::: warning 发布状态 这个功能是受规范的,默认禁用,
并且还没有生产能力.在公布的功能,隐私,故障,性能,可复制性构建之前,不要为实际值 CBDC 启用.独立的加密审查,以及文物出版门都通过了准确的发布.

## 协议所隐藏的内容 {#what-the-protocol-hides}

每条腿都使用固定的两输入,三输出私人笔记证明.委员会验证人员验证了证据和不透明状态过渡;他们没有接收平文部分,资产,金额,备忘录或业务结果.授权的本地审计员解密了填充的审计囊,检查了这些内容,并签署了一份针对目的的单独批准.默认政策接受由受监管的审计员集中的一个批准.

公共运输商和收据故意披露:

- 网络和捆绑标识符
- 参与者数据空间路线和参与者的数量
- 时间和过期的高度
- 稳定的不透明池标识符,根,取消符,承诺和固定加密文本插槽
- 委员会当局和准确的3/4可用性,准备和承诺证书
- 支持者,公共网络费用和终端状态

这就是内容的保密性,而不是流量匿名性. 时间表,参与者数量,数据空间身份和稳定池活动仍然是公开的.只容纳一个 CBDC 的数据空间也可以使资产从路线下降,即使没有字面上的资产识别符发布.

## 部署要求 {#deployment-requirements}

在激活之前,运营商需要所有以下条件:

1. 每个参与数据空间的确切四个验证器,具有不同的 BLS 共识密钥和拥有证明.
2. 强制性 Sumeragi DA/RBC 可用于每一个高度
3. 一个管理的机密结算池和每一个数据空间中的初始根
4. 一个活跃的 V1 私人笔记功能和单独的结算证明配置文件
5. 至少有一个受监管的本地 `PrivateSettlementAuditPolicyV1`,包括不同的审计签名和混合加密密钥,一个关键时代,高度有效性和批准门
6. 在配置的保留期内,足够的私人侧车存储
7. 一个能够提交最终公共运营商的中立赞助商账户

审计员也可以运行验证器,但必须使用单独的共识,审计签名和审计加密密钥.保持退休的解密密钥在监管保留期内,或在退休之前管理和测试囊重新包装.

四个验证器权威是国家固的,不是由客户提供. 在表格 `authority_context_height`,每个验证器解决了精确的排列车道/数据空间名单和从需要解决的高度匹配,并验证四个 BLS 钥匙和持有证明. 上传,准备和最终收件录取都使用相同的历史权威.

## 设置录取 {#configure-admission}

所有生产行为都来自节点配置.环境变量不能激活这个路径. 发送的默认是 `enabled = false`;将功能禁用不需要任何定位特定的配置.

管理人员已注册所需的功能,并以适当的通知选择了激活高度后,将每个相关节点都配置一致:

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

该例子使用运送的 V1 限制,而不是性能建议. 在选择运营界限之前,测量预期硬件的存储,证明,囊,载体和延迟包裹. 在 `max_expiry_blocks` 中,三个阶段的时间切断必须适合,并且侧车保留至少应达到该期限窗口.

`max_capsule_bytes`限制了整体 `PrivateSettlementAuditCapsuleV1`的正规 Norito 编码: AAD,非字符,密码文本,向量框架,审计员身份和每一个包裹的 DEK 行.每个配置的填充类别都必须适应至少 `default_min_auditor_approvals`审计员的保守整体囊包裹. Torii 也拒绝了一项新被允许的政策,其 `min_approvals` 位低于该规定的层次,并且拒绝任何实际的囊,其完整的法典编码太大.

`max_carrier_bytes`不仅限于受认证的捆绑,但限制了完全的法规赞助商签署的交易.计数包括注册指令框架,交易权威和元数据,费用意图和签名.普通的网络交易限制仍然适用于独立的上限.

除非管理功能是活跃的,其状态和激活高度符合通知期限,编译的证据配置文件匹配 V1,以及连锁池和审计记录是当前的,否则激活将无法关闭.仅启用配置标志是不够的.

## 结算工作流程 {#settlement-workflow}

客户本地构建证据和加密囊.秘密证人必须留在原生钱包或原生工作者中;不要将它们串行成申请日志, Python 对象, HTTP 请求或持久的协调记录.

包装囊和每个审计人 DEK 的认证数据包括确切国家支委员会和 `authority_context_height`的消化,以及网络,包装的关键不能转移到另一个名单或历史权威背景.

对于每条规律的脚,协调员然后执行这个序列:

1. 将暂时加密材料上传到所有四个验证器,并获得法定准确的3/4可用性证书.
2. 让一个受授权的审计师来检查并解密其囊,重新计算公开约束,并提交批准.
3. 在投票之前,每个验证者独立检查和稳定地进行分别测试.在每一个测试的响应者身上,保持可规定的3/4预备证明.
4. 在每个腿都有准备证书后,建立不可变的完整的准备屏障. 要求和坚持可行的3/4承诺证书. 如果协调器重新启动，请向参与节点查询其在本地持久保存的 Prepare 和 Commit 证书，选择一个与该法定人数等效的规范证书，并在继续之前重新分发；切勿从未经验证的本地缓存重建证书。
5. 有明确的赞助商标签,并提交一个全球航母.航母包含一个 `FinalizeAtomicPrivateSettlementV1` 指令和完整的认证捆绑.协调员和 WSV 飞行前测量了完整的盒装完成指令,包括注册指令框.Torii 和核心一次性运营商的约束力执行`max_carrier_bytes`对准确的法规赞助商签署交易,包括权威,元数据,费用意图和签名.Torii 在其权威背景之前,在或以后的最后一个进入高度可能到期或超出规定的过期期限时拒绝运营商.
6. 查询公开捆绑状态和收件,直到全球最终完成.处理本地侧车状态为暂时的,直到它调整了不可改变的全球终端记录.

Rust 客户端通过包括`certify_and_upload_private_settlement_legs_v1`,`prepare_private_settlement_bundle_v1`,`commit_private_settlement_bundle_v1`和`submit_private_settlement_bundle_v1`在内的方法来暴露这种流动. 可安全应对重新启动的协调流程使用 `recover_or_prepare_private_settlement_bundle_v1` 和 `recover_or_commit_private_settlement_bundle_v1`。委员会和审计人员的呼叫要求明确的角色凭证;它们不会重复使用普通账户签字者.

## 安全地转换审计政策 {#rotate-an-auditor-policy-safely}

使用隐私管理授权的 `RotatePrivateSettlementPoolPolicyV1`指令. 它必须指定当前的确切治理测试,保持相同的路线,合并和资产绑定承诺,提升治理修订一项,使用更新的关键时代和不同的政策/治理测验,并在包含旋转的区块上激活. 游泳池边界,根,取消器,输出,重播集和最终收据被保存. 不包括在旋转的激活高度触摸相同的路线/游泳池的收据;说明拒绝该边界.

公共库预测保留了完全取代的政策修改谱系. 在转换之前完成的收据因此在重新启动后仍然有效,并且重复该确切收据仍然无效.在全球状态变化之前,任何跨越激活界限的旧政策捆绑都会被关闭.保留所有需要打开存储的囊的旧解密钥,或在破坏之前完成一个受管理和测试的囊重新卷回.

## Torii 路线家族 {#torii-route-family}

这些路线使用常规的 Norito 请求和响应对象.验证和限制的响应使用私人 `no-store`缓存行为.

|行动|方法和路径|校长|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|加载脚|`POST /v1/nexus/private-settlements/legs`|圣经账户的签名|
|可用性分享|`POST /v1/nexus/private-settlements/legs/availability-shares`|圣经账户的签名|
|准备投票|`POST /v1/nexus/private-settlements/phases/prepare-votes`|圣经账户的签名|
|承诺投票|`POST /v1/nexus/private-settlements/phases/commit-votes`|圣经账户的签名|
|持续阶段 QC |`POST /v1/nexus/private-settlements/phases/certificates`|圣经账户的签名|
| 恢复阶段 QCs | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | 公示赞助商 |
|腿状况|`GET /v1/nexus/private-settlements/legs/{payload_digest}/status`|圣经账户的签名|
|委员会证据|`GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof`|精确的清单验证器|
|审计囊|`GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule`|管理审计师|
|审计员的批准|`POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals`|管理审计师|
|提交包|`POST /v1/nexus/private-settlements/bundles`|公示赞助商|
|捆绑状态|`GET /v1/nexus/private-settlements/bundles/{bundle_id}`|公共|
|收到或取消|`GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt`|公共|

公共状态和收据 APIs 仅显示已记录的公共领域. 特别是,普通腿部状况不显示批准数量或受控审计者的门.有限制的阅读 故意崩失踪,未经授权,保存过期的材料进入相同不可用响应类.

## 失败和恢复 {#failure-and-recovery}

在全球突变之前,缺失或过时的审计批准,不到三个验证者投票,错误的根源或时代,重复废除,替换的证明或囊,非正规的步骤顺序,过期的捆绑和不匹配的退款条款都会失败.承诺证书永远不会改变私人状态.

验证器在认可之前对侧车,分阶段的海域和阶段证书进行了sync.在重新启动时,他们从常规的持久记录中重建了预订.然后调整不变的全球收据,取消标记或过期.监督调和器还在同步观察到的权威高度进行终端保留剪切,即使是没有终端候选人可以调整,并且由于剪切错误而无法关闭. 只有一个有权威的全球终端记录发布了阶段锁.再播放相同的最终收据是无效的;矛盾的再播放决定性失败.

预订身份包括完整的路线.池头使用 `(route, pool_id, epoch, root)`,取消器使用 `(route, pool_id, nullifier)`,输出使用 `(route, pool_id, commitment)`.在另一条路线上相同的不透明值是独立的;重启过程中仍然锁定了精确路线碰撞.

运营警报应仅使用不透明的捆绑,路线,阶段,消化,高度和理性类字段.永远不要将解密囊,账户或资产识别器,金额,备忘录,查看数据,证据见证者或解析器有效载荷放置在日志,事件,计量标签或追踪范围中.

## 在实际价值之前的资格 {#qualification-before-real-value}

为了查看您打算部署的确切构建和配置,存储包含:

- 抵制性证明,囊,政策,钥匙转换,退款和重播案件
- 2, 3, 4, 8 和 16 个数据库的实际四个验证器进程,包括验证器和协调器重启,认可 5%, 10% 和 20% 的消息丢失,阶段分区,恢复以及持久性边界崩
- 在 Torii, P2P,区块, Kura,快照,查询,事件,日志和远程测量中进行加拿大和差异泄漏分析
- 每个实际网络参与者的数量至少有5次加热和30次测量捆绑, p50,p95,p99,信任间隔,资源,流量,证明和收件大小以及透明的 AMX 作为控制.
- 严格的工作空间测试,和格式检查,随机种子,浸泡,可复制的构建, SBOMs,以及签署的文物哈希.
- 两种正式层次:3/255脚的计数对称性检查和准确的四个验证器委员会索引 N=2验证器重点加上全局限错误,纸质主要 N=3 错误,N=4 清洁,N=3 过期/复制配置,每个委员会的错误预算独立.
- 独立审查证据关系,模拟插槽选择器,资产和囊绑定,退款关系,加密技术和跨数据空间状态机

发布原始和清洁的证据,威胁模型,协议参数,限制,承诺 ID,硬件描述和审计报告在不可变的 DOI 支持的文物中.仅存储库测试不能将该功能转化为生产合格的 CBDC 结算系统.

每次原始故障运行和延迟样本都必须绑定完整的释放承诺, SHA-256 一个结构化的固定硬件描述,以及 SHA-256 存档一个包含N=2,3,4,8,16的法规配置表;每条输入都必须引用保留的配置字节,并声明 每个数据空间都有四个验证器,有3/4的共数,并且必须签署了 RS16 DA/RBC. 发布验证器拒绝基于不同的构建,硬件配置或网络配置生成的总结.每个单独的损失,阶段切割和持久性撞击行都必须额外命名全球不可重复使用的精确 JSONL 记录在内的引用 SHA-256 释放验证器解决这些消化问题,并需要符合运行身份,试验指数和参数,控制器确认或恢复结果的行列连续检查数量,零部分可见性和可用性观察.随后发布的p95/p99比较也拒绝了签署的基线,其硬件,配置,或测量要求与候选人不同.最终验证器将所有报告的百分比重复, MADs, 而不是依靠单独的基准汇总.它同样重新加载了鱼手表, 独立扫描了所有存储的隐私表面.在重新绑定文件消化后, 报告不能压制一个被种植的秘密攻击.档案还必须包含一个法规的差异对宣言连接左边和右边的文件路径,类型,字节长度, SHA-256 声明的根源必须包含对档案库存.最终验证器独立需要相同的尺寸和重新计算 JSON 通过重新编写泄漏报告,无法隐藏相同尺寸的结构泄漏或未配合的差异文件.
