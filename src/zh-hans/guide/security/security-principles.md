---
translation_locale: zh-hans
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 安全原则 {#security-principles}

Iroha 账本验证已签名的指令并应用权限规则，但它不会保护私钥、主机、应用、运营人员工作站或治理流程。这些系统必须由部署方保护。

设计和运营 Iroha 网络时应遵循以下原则。

## 将权限主体视为安全边界 {#treat-authority-as-a-security-boundary}

- 控制私钥的人员或进程能够以分配给该密钥的权限主体行事。
- 为每个环境和运营角色设置独立的权限主体。
- 将生产密钥和恢复密钥与日常开发、测试凭据分开。
- 记录每个权限主体的所有者、其签名器的保管位置，以及替换或撤销方式。

请参阅[公钥密码学](./public-key-cryptography.md)和[存储加密密钥](./storing-cryptographic-keys.md)。

## 应用最小权限 {#apply-least-privilege}

- 只授予角色所需的 Iroha 权限、主机访问和网络访问。
- 将日常交易签名与治理、部署和恢复权限分离。
- 对可能影响验证器成员关系、特权权限或高价值资产的变更要求独立批准。
- 角色变更后审查访问权，并移除不再需要的访问权。

## 使用保护层 {#use-layers-of-protection}

- 保护签名器、应用、操作系统、网络和物理访问，不要只依赖单一控制措施。
- 只公开部署所需的 Torii、对等节点、监控和应用路由。
- 对管理访问和敏感数据使用经过认证的加密通道。
- 保持系统补丁最新，并禁用部署不使用的服务。
- 秘密不得进入源代码管理、命令行、日志、工单、聊天或公开文档。

## 让部署可审查 {#make-deployments-reviewable}

- 将非秘密配置和部署自动化保存在版本控制中。
- 审查二进制文件、配置、创世材料、验证器成员关系、权限和公共路由的变更。
- 部署前验证发布制品，并记录获批的版本和哈希。
- 测试生产环境将要运行的确切二进制文件和配置组合。
- 保持网络行为的确定性；硬件加速不得改变对等节点可见的结果。

## 监控和保存证据 {#monitor-and-preserve-evidence}

- 监控对等节点健康状况、共识进度、权限变更、特权指令、认证失败和意外配置变更。
- 将重要告警发送到不依赖受影响主机的系统。
- 保留相关日志、账本引用、配置快照和交易哈希，并附可靠时间戳。
- 将监控数据缺失视为必须调查的运营问题。

## 上线前准备恢复方案 {#prepare-recovery-before-launch}

- 定义谁可以宣布事件，以及谁可以批准恢复操作。
- 测试备份、还原、密钥替换、权限撤销和对等节点恢复流程。
- 确保事件期间能够取得可信的发布制品、配置、创世记录和清单。
- 先恢复读取和监控；只有恢复后的网络及依赖应用通过检查后，才能恢复写入。
- 复盘每起事件，并更新控制措施、自动化和演练。

::: warning

账本操作可能不可逆。提交恢复或治理交易前，应遵循预先审查过的流程并取得所需批准。

:::

接下来请参阅[运营安全](./operational-security.md)和[发布就绪检查](../best-practices/release-readiness.md)。
