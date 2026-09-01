---
translation_locale: zh-hans
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 密码安全 {#password-security}

密码可以保护运营控制台、秘密存储、备份和本地密钥文件，但密码只是其中一道控制措施。应将其与安全的密钥保管、访问控制以及可用时的多因素认证结合使用。

## 使用唯一的随机生成密码 {#use-unique-generated-passwords}

- 为每个账户和环境生成不同的密码。
- 使用密码管理器创建并保存足够长的随机密码。
- 只有当各个词是从足够大的词表中随机选出时，才使用多词密码短语。
- 密码中不得使用姓名、日期、地址、引文、键盘排列或重复使用的片段。
- 服务支持时，使用由服务生成的令牌或加密密钥，而不是人工输入的密码。

长度和不可预测性比装饰性替换更重要。给一个可预测的单词加上符号，并不能使密码安全。

## 保护基于密码的帐户 {#protect-password-based-accounts}

- 可用时启用抗网络钓鱼的多因素认证。
- 对反复出现的认证失败应用速率限制、锁定策略和告警。
- 只通过经过认证的加密通道传输密码。
- 密码和恢复代码不得出现在日志、命令行、源代码仓库、配置文件、工单或聊天中。
- 服务端密码验证值应使用加盐的内存困难型密码哈希函数以及适合相应部署的参数来存储。

## 存储,恢复和更换 {#storage-recovery-and-replacement}

- 使用经过审计的密码管理器，并配置经过测试的加密备份。
- 将恢复代码与其要恢复的设备分开存放。受保护的离线纸质副本可以用于保存恢复材料。
- 限制对密码管理器导出文件和备份介质的访问。
- 怀疑密码暴露、发现未经授权的重复使用，或策略事件要求更换时，应替换密码。
- 在投入生产前测试账户恢复流程。

::: warning

用于解锁私钥的密码无法让已经暴露的私钥副本重新变得安全。怀疑私钥暴露时，应遵循部署规定的密钥替换或撤销流程。

:::

请参阅[运营安全](./operational-security.md)和[存储加密密钥](./storing-cryptographic-keys.md)。
