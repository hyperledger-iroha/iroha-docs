---
translation_locale: zh-hans
translation_source: /help/deployment-issues.md
translation_source_hash: 5c7d26b39d4ddf4e7e164f7bef79c9e1659db51587fb0dde9cf3f1dc0e3b057b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决部署问题 {#troubleshooting-deployment-issues}

本节为 Iroha 3 部署提供了故障解决技巧.如果您遇到的问题没有描述在这里,请通过 [电报](https://t.me/hyperledgeriroha)联系我们

## 从生成的文物开始. {#start-with-generated-artifacts}

对于本地和测试部署,优先使用 Kagami 生成的文物而不是手写的同行文件:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

生成的目录包含同行配置,基因材料,启动脚本以及 README 为 Iroha 3 构建线.

## 同龄人不开始 {#peer-does-not-start}

首先要检查这些物品:

- `iroha3d --config <path>`在同行自己的档案 TOML 中的点.
- 在同等配置中, `public_key` 和 `private_key`属于同一键对.
- `genesis.public_key`与签署基因交易所使用的密钥相匹配.
- 验证器同行身份使用 BLS-正常密钥,并且`trusted_peers_pop`包含本地密钥和可信任同行的拥有证明条目.
- Torii 和 P2P 的港口已经没有其他工艺的约束.
- Kura 存储目录属于同一个链,并不是从不同的网络配置文件复制.

如果 daemon 阅读超过一个 TOML 层时,请使用配置追踪:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker 和复合 {#docker-and-compose}

生成 从当前的 Kagami localnet输出中编写,以便命令行参数和配置文件与已检查出来的代码匹配:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

如果构建部署开始,然后停下来,请检查 daemon日志:

- 没有匹配 `chain`
- 一个使用不同的基因交易或表现的同行
- 广告的 P2P 地址,仅在集装箱网络内工作
- 在再生产后的本地体积重复使用

在测试新基因时,在重新启动堆之前删除旧的 Kura 卷.将旧块存储到新的基因中会导致重播失败.

## 科伯尼特 {#kubernetes}

对于Kubernetes来说,将每个验证器视为具有状态的基础设施:

- 给每个同龄人一个稳定的身份密钥和稳定的持久量
- 暴露其他同行可以从集群内部解决的 P2P 地址
- 装备配置和生成文件作为部署不可变的配置
- 推出所有基因或拓变化是故意的,而不是作为自动配置地图更新

如果一个模块重启一次,请将模块中的转载配置与预期的 [`peer.template.toml`](/zh-hans/reference/peer-config/index.md#template)进行比较,并检查同行是否正在播放旧的 Kura 数据.

## 索拉的个人资料 {#sora-profile}

Iroha 3 使用 Nexus, SoraFS 或多道流的部署应启动索拉配置文件的妖怪:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

在同一网络中的验证器中,使用相同的配置文件.
