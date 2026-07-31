---
translation_locale: zh-hans
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 运行 Iroha 在纯金属上 {#running-iroha-on-bare-metal}

使用这个工作流程,当你想直接运行同行在主机而不是
通过 Docker Compose. 目前的源树提供 Kagami 发电机
编写匹配的创始,同行配置,客户端配置和启动/停止脚本.

## 1. 构建二进制 {#_1-build-the-binaries}

从上游 Iroha 工作空间:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

这产生了:

- `target/release/irohad` 对于同龄妖魔
- `target/release/iroha` 对于 CLI
- `target/release/kagami` 为关键,发源和本地网络生成

## 2. 创建一个本地网络 {#_2-generate-a-local-network}

产生一个四对的 Iroha 3 地方网:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

输出目录包含生成的 `genesis.json`,
`genesis.signed.nrt`, 同龄人 `config.toml` 文件, `client.toml`, 助手脚本,
和一个产生的 `README.md` 有准确的指令.

## 3. 开始同龄 {#_3-start-peers}

对于生成一次性本地网络,使用生成的脚本:

```bash
./localnet/start.sh
```

如果您需要将每个同行连接到一个过程经理,如 systemd, 使用
发射命令记录在 `./localnet/README.md` 每个同龄人.
一个同龄人 `config.toml`, 密钥,存储目录和端口分开.

## 4. 运营网络 {#_4-operate-the-network}

使用生成的客户端配置:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

停止生成的本地网络:

```bash
./localnet/stop.sh
```

## 5. 产品说明 {#_5-production-notes}

- 产生新鲜的生产私钥,并将它们存储在
  存储库.
- 让每个同行都同意相同的签署基因交易,
  值得信赖的同龄人,以及验证者 PoPs.
- 只有当同行应该将听者地址绑定到主机本地接口时
  其他机器无法使用.
- 使用反向代理或防火墙 Torii 暴露,基本质量 TLS, 和利率
  限制性.
- 处理基因或共识拓学的变化为协调的迁移,而不是
  单同类文件编辑.

对于集装机的本地开发,使用 [发射 Iroha 3](../../get-started/launch-iroha.md)
Docker Compose 工作流程.
