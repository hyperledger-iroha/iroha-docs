---
translation_locale: zh-hans
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决配置问题 {#troubleshooting-configuration-issues}

本节提供 Iroha 3 配置的故障解决技巧.请先检查 [键](./overview.md#check-the-keys),因为这是 Iroha 中最常见的问题.

如果您所遇到的问题未被描述在这里,请通过 [电报](https://t.me/hyperledgeriroha)联系我们.

## 在 Docker Compose 设置上过时的创世 {#outdated-genesis-on-a-docker-compose-setup}

当您使用 Docker Compose 的版本 Iroha, 你可能会遇到一个对等节点容器的故障问题 `Failed to deserialize raw genesis block` 这通常意味着对等节点,签署的创世交易和生成的配置是由不同的 Iroha 修订或个人资料.

通过以下步骤检查故障:

1. 使用 `docker ps`来检查当前的容器.根据生成的配置文件,您通常会看到`hyperledger/iroha:dev`容器.默认的 Docker Compose 配置文件包含四个对等节点容器,尽管您生成的 `docker-compose.yml`可能不同.

2. 检查日志并寻找`Failed to deserialize raw genesis block`错误. 如果您启动了 Iroha 在 daemon模式中使用`docker compose up -d`,请使用 `docker compose logs`命令.

解决此类问题的方法取决于使用 Iroha.如果这是一个基本的演示程序,并且不需要保存对等节点数据,请重建与 Kagami 相匹配的本地网络或 Docker Compose 捆绑:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

然后从再生的 `genesis.signed.nrt`,对等节点`config.toml`和 `client.toml`文件中删除旧容器状态,重新启动.

如果您需要恢复 Iroha 实例数据,请执行以下操作:

1. 连接第二个 Iroha 对等节点,将复制第一个 (失败) 对等节点的数据.
2. 等新对等节点将数据与第一个对等节点同步.
3. 让新对等节点活跃.
4. 仅作为协调迁移的一部分更新第一个对等节点的生成和配置文件.

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
