---
translation_locale: zh-hans
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 设置问题 {#troubleshooting-configuration-issues}

本节提供了解决问题建议 Iroha 3 确保您
[检查了钥匙](./overview.md#check-the-keys) 首先,这是最
共同的问题来源 Iroha.

如果您所遇到的问题没有在这里描述,请通过
[电报](https://t.me/hyperledgeriroha).

## 已过时的起源 Docker Compose 设置 {#outdated-genesis-on-a-docker-compose-setup}

当您使用 Docker Compose 的版本 Iroha, 你可能会遇到
一个同等容器的故障
`Failed to deserialize raw genesis block` 这通常意味着同行,
创始交易签署,生成的配置是由
不同 Iroha 修订或个人资料.

使用以下步骤检查故障:

1. 使用 `docker ps` 检查目前的容器.
   您通常会看到 `hyperledger/iroha:dev`
   默认的 Docker Compose 个人资料包含四个同行
   容器,虽然您的产生的 `docker-compose.yml` 可能不同.

2. 查看日志,寻找
   `Failed to deserialize raw genesis block` 如果你开始了你的
   Iroha 在 daemon 模式下 `docker compose up -d`, 使用
   `docker compose logs` 命令.

解决此类问题的方法取决于使用 Iroha. 如果这是一个
你不需要保存同行数据,重新创建匹配
局域网或 Docker Compose 包装 Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

然后删除旧容器状态,从再生的重启
`genesis.signed.nrt`, 同龄人 `config.toml` 文件,以及 `client.toml`.

如果您需要恢复 Iroha 实例数据,如下:

1. 连接第二个 Iroha 同行将复制第一个数据
   没有成功的.
2. 等新同行与第一个同行同步数据.
3. 让新同龄人活跃.
4. 更新第一个同行的基因和配置文件仅作为一部分
   一个协调的迁移.

::: info

没有一般的自动重写路径来替代生态在一个直播
作为一个协调的迁移:
只有移动验证器到新的配置后
运营商同意迁徙计划.

:::

## 个人和公共密钥的多哈希格式 {#multihash-format-of-private-and-public-keys}

如果你看到了
[客户端配置](/zh-hans/guide/configure/client-configuration.md), 你会
请注意,其中的钥匙
[多哈希格式](https://github.com/multiformats/multihash).

如果您以前从未使用多个hash,
右侧不是对键字节的六分之一表示
(每字节两个符号),而更好的是编码为 ASCII (或 UTF-8),
打电话 `from_hex` 在两个字符串上 `public_key` 并且
`private_key` 在此,

也是自然的假设 `PrivateKey::try_from_str` 在
字母字符串只能输出正确的键.
在错误键中的位,例如32字节对64字节,这会产生错误
收到的信息.

**这两种假设都是错误的.** 不幸的是,错误信息
这种失败不会帮助我们去除这些问题.

**如何修复**: 使用 `hex_literal`. 这也会变成一个丑的连线
在一个小的表中,显然是六成数.

::: warning

即使是 `try_from_str` 执行不能验证给定的字符串是否是
有效 `PrivateKey` 如果没有,我会警告你.

它会发现一些明显的错误,例如如果字符串包含一个无效的字符
但是,由于我们希望支持许多关键格式,
其他.它不能知道关键是 _正确的_ 个人钥匙 _给定的
账户_ 除非你提出指示.

:::

These 例如,可以避免各种微妙的错误
直接从字符串文字中消化,或通过产生新鲜的
在有意义的地方.
