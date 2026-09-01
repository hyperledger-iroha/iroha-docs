---
translation_locale: zh-hans
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安全与获取 {#security-and-access}

Iroha 的安全实践应基于严格授权主体,控制密钥保管,明确网络曝光和可审计的变化.

## 关键的监护 {#key-custody}

- 生成生产级的输入密钥,并在存储库外存储私钥,发行跟踪器,提示,聊天日志和 CI 输出.
- 使用单独的密钥材料为客户,对等节点,创世签名,验证者,费用赞助商和技术账户.
- 按书面程序旋转键,然后在现场事件之前练习恢复.
- 使用硬件支持或操作系统支持的存储,当部署风险合理时使用高价值签名密钥.

查看 [生成加密密钥](/zh-hans/guide/security/generating-cryptographic-keys.md)和 [存储加密密码密钥 ](/zh-hans/guide/security/storing-cryptographic-keys.md).

## 许可证 {#permissions}

- 允许支持工作流程的最小权限符号或角色.
- 最好为服务,触发器,代理和自动化提供专用技术账户. 避免通过个人运营商帐户运行长期自动化.
- 在生产启动之前,审查对等节点管理,元数据突变,铸造、销毁,触发注册,执行器更改和 SORA/Nexus 治理权.
- 在需要这些临时权限的维护时段或迁移完成后，撤销这些权限。

查看 [许可证](/zh-hans/blockchain/permissions.md)和 [许可证代币 ](/zh-hans/reference/permissions.md).

## 网络暴露 {#network-exposure}

- 根据环境限制对等节点到对等节点, Torii,远程测量和运营商路线.公众阅读访问并不意味着公开写入或运营商访问.
- 使用 VPNs,防火墙,反向代理, TLS 终止和适合部署时的速度限制.
- 保持基本作者凭证,代理代币和转发的标题在已提交配置之外.
- 测试未经授权的客户无法进入受限制的路线.

查看 [虚拟私人网络](/zh-hans/guide/security/vpn.md)和 [Torii 端点](/zh-hans/reference/torii-endpoints.md).

## 监控欺诈和滥用 {#fraud-and-abuse-monitoring}

- 监控账本事件和运营信号,以发现意外的资产流动,许可授予,触发变化,对等节点变化以及反复拒绝交易.
- 保存证据使用交易哈希,区块高度,事件记录,日志和状态快照.
- 对受影响的资产或工作流程负责的安全,运营和企业所有者提供路线警报.

查看 [欺诈监控](/zh-hans/guide/security/fraud-monitoring.md).

## 代理和自动化防护轨道 {#agent-and-automation-guardrails}

- 使用只读权限启动自动化,并仅在工作流程被审查后添加写入权限.
- 要求人类明确批准现场网络突变,除非自动化是故意部署的生产服务.
- 不要把私钥暴露在代理人的提示上.使用局部代码,从环境变量,键链,硬件签名器或无视配置文件中加载秘密.
- 记录自动化决策以支持审计的方式,而不泄露秘密材料.
