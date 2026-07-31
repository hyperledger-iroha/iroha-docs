---
translation_locale: zh-hans
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决部署问题 {#troubleshooting-deployment-issues}

本节提供了解决问题建议 Iroha 3 如果问题发生,
你正在经历的情况并未被描述在这里,
通过 [电报](https://t.me/hyperledgeriroha).

## 开始使用生成的文物 {#start-with-generated-artifacts}

对于本地和测试部署,最好采用由 Kagami 而不是
在手写的同行档案中:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

生成的目录包含同行配置,创始材料,开始
编写的脚本, README 对于 Iroha 3 建设线.

## 同龄人不开始 {#peer-does-not-start}

首先要检查这些物品:

- `irohad --config <path>` 在同龄人自己的积分 TOML 文件.
- `public_key` 并且 `private_key` 在同行配置中属于同一键
  一对.
- `genesis.public_key` 与签署创世交易的密钥相匹配.
- 验证器同行身份使用 BLS- 通常的钥匙, `trusted_peers_pop`
  包含本地密钥和值得信赖的同龄人的所有权证明条目.
- 的港口 Torii 并且 P2P 没有其他过程的约束.
- 在 Kura 商店目录属于同一个链,并不是从
  不同的网络配置文件.

使用配置追踪,当妖怪阅读多个 TOML 层:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker 和编译 {#docker-and-compose}

生成从当前构成 Kagami 局域网输出,所以命令行
参数和配置文件与已退出的代码一致:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

如果构建部署启动,然后停滞,检查 daemon日志:

- 不匹配 `chain`
- 一个使用不同的基因交易或表现的同行
- 广告 P2P 只有在集装箱网络内工作的地址
- 在再生产后的本地体积重复使用

在测试新产物时,删除旧产物 Kura 在重新启动前的量
保持旧块的存储器和一个新的基因将使重播失败.

## 科伯尼特斯 {#kubernetes}

对于Kubernetes来说,将每个验证器视为具有状态的基础设施:

- 给每个同龄人一个稳定的身份密钥和稳定的持久量
- 暴露 P2P 其他同行可以从集群内部解决的地址
- 将配置和创始文件作为部署不可变的配置
- 任何基因或拓变化都是故意的,而不是自动的
  配置地图更新

如果一个子重启一次又一次,则将该子中的转载配置与
预期 [`peer.template.toml`](/zh-hans/reference/peer-config/index.md#template) 并且
检查同龄人是否重播旧 Kura 数据.

## 索拉的个人资料 {#sora-profile}

Iroha 3 使用的部署 Nexus, SoraFS, 或多道流动应开始
具有 Sora 配置的恶魔:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

在同一网络中的验证器中使用相同的配置文件.
