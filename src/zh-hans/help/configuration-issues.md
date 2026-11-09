---
translation_locale: zh-hans
translation_source: /help/configuration-issues.md
translation_source_hash: 9d153d9cb8ce0341b35ba5a7e3823198e58464768e2a9a92ff8a5723f85e9351
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决配置问题 {#troubleshooting-configuration-issues}

本节提供 Iroha 3 配置的故障解决技巧.请先检查 [键](./overview.md#check-the-keys),因为这是 Iroha 中最常见的问题.

如果您所遇到的问题未被描述在这里,请通过 [电报](https://t.me/hyperledgeriroha)联系我们.

## 在 Docker Compose 设置上过时的创世 {#outdated-genesis-on-a-docker-compose-setup}

当您使用 Docker Compose 的版本 Iroha, 你可能会遇到一个对等节点容器的故障问题 `Failed to deserialize raw genesis block` 这通常意味着对等节点,签署的创世交易和生成的配置是由不同的 Iroha 修订或个人资料.

在工具包目录中运行 `python3 poc.py logs` 即可查看验证节点的日志。 请参阅 [启动 Iroha 3](/zh-hans/get-started/launch-iroha.md)，使用同一版本的可执行文件，在 Docker 中构建并启动四个验证节点。

依次运行 `python3 poc.py down` 和 `python3 poc.py up` 以重启同一网络。请将 `state/` 与其四个 Docker 数据卷一起保留。

::: info

在现场网络上,没有一般的自动重写路径来替换创世.把它视为一个协调的迁移:保存旧状态,提起兼容的对等节点,并且只有经营者同意迁徙计划后才将验证器转移到新配置.

:::

## 密钥和公钥的多哈希格式 {#multihash-format-of-private-and-public-keys}

如果您查看 [客户端配置](/zh-hans/guide/configure/client-configuration.md),您会注意到那里的密钥是以 [多哈什格式](https://github.com/multiformats/multihash).

如果您以前从未使用多哈什,那么自然可以假设右边不是六分之一.代表关键字节 (每字节的两个符号),而更好的是编码为 ASCII (或 UTF-8),并调用 `from_hex` 在两个字符串上, `public_key` 和 `private_key` 一个实例.

也是自然的假设,在字符串字母上调用 `PrivateKey::try_from_str`只会产生正确的键.所以如果你错误地读取键中的比特数量,例如32字节对64字节,那就会引起一个错误信息.

这两种假设都是错误的. 遗憾的是,错误信息并没有帮助解决这种特殊的失败.

如何修复:使用 `hex_literal`. 这也将使一个丑的字符串变成一个很好的小表,显然是六十分数.

::: warning

即使是 `try_from_str` 实现也无法验证给定的字符串是否是一个有效的 `PrivateKey`,并且警告你如果不是.

它会发现一些明显的错误,例如如果字符串包含无效的符号.然而,由于我们旨在支持许多键格式,它不能做很多其他事情. 除非您提交指示外,它也无法判断密钥是否是给定的帐户的正确私钥.

:::

这种微妙的错误可以避免,例如,通过直接从字符串文字中排序,或者在有意义的地方生成一个新的键对.
