---
translation_locale: zh-hans
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安全与获取 {#security-and-access}

在 Iroha 应该建立在狭窄的权力,
关键保密,明确网络曝光和可审计的变化.

## 关键的监护 {#key-custody}

- 产生生产级的生产密钥,并存储私有
  在存储库之外的密钥,发行跟踪器,提示程序,聊天日志和 CI
  输出.
- 用单独的关键材料为客户,同行,创始签名,
  验证者,费用赞助商和技术账户.
- 按书面程序旋转键,并在
  现场事件.
- 使用硬件支持或操作系统支持的存储,用于高价值
  在部署风险证明了这一点时,签署钥匙.

看看
[生成加密钥](/zh-hans/guide/security/generating-cryptographic-keys.md)
并且
[存储加密钥](/zh-hans/guide/security/storing-cryptographic-keys.md).

## 许可证 {#permissions}

- 允许支持工作流程的最小权限符号或角色.
- 优先考虑服务,触发器,代理和
  避免通过个人机器运行长寿命的自动化
  运营商账户.
- 审查对同行管理,元数据突变,造的权限
  燃烧,触发注册,执行器变更,以及 SORA/Nexus
  在生产启动前的治理.
- 在维护窗口或迁移后取消临时权限
  这需要他们.

看看 [许可证](/zh-hans/blockchain/permissions.md) 并且
[许可令牌](/zh-hans/reference/permissions.md).

## 网络暴露 {#network-exposure}

- 限制同龄人, Torii, 电力测量和运营商路线
  公共阅读不意味着公开写作或
  运营商访问.
- 使用 VPNs, 防火墙,反向代理, TLS 终止和利率限制
  适用于部署.
- 保持基本作者凭证,代理代币和转发的标题
  承诺的保证.
- 测试未经授权的客户无法进入受限制的路线.

看看 [虚拟私人网络](/zh-hans/guide/security/vpn.md) 并且
[Torii 终点](/zh-hans/reference/torii-endpoints.md).

## 监控欺诈和滥用 {#fraud-and-abuse-monitoring}

- 监控账本事件和意外资产的运营信号
  动作,许可证授予,触发变化,同行变化,
  拒绝的交易.
- 存储证据,包括交易哈希,区块高度,事件记录,
  记录和状态快照.
- 对安全,运营和企业主负责的路线警报
  对受影响的资产或工作流程.

看看 [欺诈监测](/zh-hans/guide/security/fraud-monitoring.md).

## 代理和自动化防护轨道 {#agent-and-automation-guardrails}

- 启动自动化,只使用读取权限,并添加只使用写入权限
  在工作流程进行审查后.
- 需要明确的人类批准,除非
  自动化是一种故意部署的生产服务.
- 不要暴露私钥给代理提示.使用加载的本地代码
  环境变量,钥匙链,硬件签名器的秘密或
  忽略了配置文件.
- 记录自动化决策以支持无泄漏的审计方式
  秘密材料.
