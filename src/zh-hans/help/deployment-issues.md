---
translation_locale: zh-hans
translation_source: /help/deployment-issues.md
translation_source_hash: 3e4042ed4e92a8df567f3500a84cfe32a3d10e22663204b07423ff4cf0fd0c5c
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决部署问题 {#troubleshooting-deployment-issues}

本节为 Iroha 3 部署提供了故障解决技巧.如果您遇到的问题没有描述在这里,请通过 [电报](https://t.me/hyperledgeriroha)联系我们

## 从生成的构件开始. {#start-with-generated-artifacts}

对于本地和测试部署,优先使用 Kagami 生成的构件而不是手写的对等节点文件:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

生成的目录包含对等节点配置,创世材料,启动脚本以及 README 为 Iroha 3 构建线.

## 对等节点不开始 {#peer-does-not-start}

首先要检查这些物品:

- `iroha3d --config <path>`在对等节点自己的档案 TOML 中的点.
- 在同等配置中, `public_key` 和 `private_key`属于同一键对.
- `genesis.public_key`与签署创世交易所使用的密钥相匹配.
- 验证器对等节点身份使用 BLS-正常密钥,并且`trusted_peers_pop`包含本地密钥和可信任对等节点的拥有证明条目.
- Torii 和 P2P 的港口已经没有其他工艺的约束.
- Kura 存储目录属于同一个链,并不是从不同的网络配置文件复制.

如果 daemon 阅读超过一个 TOML 层时,请使用配置追踪:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker 和复合 {#docker-and-compose}

请参阅 [启动 Iroha 3](/zh-hans/get-started/launch-iroha.md)，使用同一版本的可执行文件，在 Docker 中构建并启动四个验证节点。

在工具包目录中运行 `python3 poc.py logs` 即可查看验证节点的日志。

如果构建部署开始,然后停下来,请检查 daemon日志:

- 没有匹配 `chain`
- 一个使用不同的创世交易或表现的对等节点
- 广告的 P2P 地址,仅在集装箱网络内工作
- 在再生产后的本地体积重复使用

使用新的创世区块时，节点的存储空间必须为空。 依次运行 `python3 poc.py down` 和 `python3 poc.py up` 以重启同一网络。请将 `state/` 与其四个 Docker 数据卷一起保留。

## 科伯尼特 {#kubernetes}

对于Kubernetes来说,将每个验证器视为具有状态的基础设施:

- 给每个对等节点一个稳定的身份密钥和稳定的持久量
- 暴露其他对等节点可以从集群内部解决的 P2P 地址
- 装备配置和生成文件作为部署不可变的配置
- 推出所有创世或拓变化是故意的,而不是作为自动配置地图更新

如果一个模块重启一次,请将模块中的转载配置与预期的 [`peer.template.toml`](/zh-hans/reference/peer-config/index.md#template)进行比较,并检查对等节点是否正在播放旧的 Kura 数据.

## SORA Nexus 配置模式 {#sora-profile}

如果私有或本地 Iroha 3 部署使用 SORA Nexus、SoraFS 或多个通道，请启用此配置模式并启动标准守护进程。

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

在同一网络中的验证器中,使用相同的配置文件.

公共的 Taira 验证器使用专用启动器,它执行 Taira 的精确链接,列表,禁用嵌入式存储- SoraFS 和运行时签署者配置.在启动之前验证呈现的 Taira 配置:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

不要开始一个公众 Taira 具有通用验证器 `iroha3d`; 查看 [`iroha3d` CLI 参考](/zh-hans/reference/iroha3d-cli.md) 对于强制性个人资料.
