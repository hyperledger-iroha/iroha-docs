---
translation_locale: zh-hans
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 在裸机上运行 Iroha {#running-iroha-on-bare-metal}

当您想通过 Docker Compose 而不是在主机上直接运行对等节点时使用此工作流程.当前的源树提供 Kagami 生成器,用于编写匹配创世组,对等节点配置,客户端配置和启动/停止脚本.

## 1. 构建二进制 {#_1-build-the-binaries}

从上游 Iroha 工作空间:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

这产生了:

- `target/release/iroha3d` 对等节点守护进程
- `target/release/iroha`用于 CLI
- `target/release/kagami`用于关键,创世和局域网生成

## 2. 创建本地网络 {#_2-generate-a-local-network}

创建一个四对的 Iroha 3 本地网络:

```bash
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

输出目录包含生成的 `genesis.json`、`genesis.signed.nrt`、`genesis.expected_hash`、每个验证者一个的 `peerN.toml`、`client.toml`、`start.sh` 和 `stop.sh` 脚本，以及一个生成的 `README.md`，其中包含该捆绑包的确切命令。

## 3. 启动对等节点 {#_3-start-peers}

对于生成一次性本地网络,使用生成的脚本:

```bash
./localnet/start.sh
```

如果您需要将每个对等节点接入 systemd 等进程管理器，请遵循 `./localnet/start.sh` 中针对每个对等节点的命令：在 `<bundle>/state/peerN` 目录下运行 `iroha3d --config <bundle>/peerN.toml`，并且仅在该对等节点首次启动时传入 `--sumeragi-assert-fresh-key`。请将每个对等节点的 `peerN.toml`、私钥、存储目录和端口分开保存。

## 4. 运营网络 {#_4-operate-the-network}

使用生成的客户端配置:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

停止生成的本地网络:

```bash
./localnet/stop.sh
```

## 5. 产品说明 {#_5-production-notes}

- 为生产环境生成新的私钥，并将其存放在代码仓库之外。
- 让每个对等节点都同意相同的签名创世交易,拓,可信任的对等节点和验证器 PoPs.
- 只有在其他机器不能从对等节点到达时,将收听器绑定到主机本地接口.
- 使用反向代理或防火墙来对 Torii 曝光,基础 auth, TLS 和速度限制.
- 将创世或共识拓扑的变化视为协调迁移,而不是单双文件编辑.

对于集装本地开发,请使用 [启动 Iroha 3](../../get-started/launch-iroha.md) Docker Compose 工作流.
