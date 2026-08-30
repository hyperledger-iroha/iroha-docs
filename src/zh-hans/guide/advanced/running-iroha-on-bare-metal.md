---
translation_locale: zh-hans
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 在 Bare Metal 上运行 Iroha {#running-iroha-on-bare-metal}

当您想通过 Docker Compose 而不是在主机上直接运行同行时使用此工作流程.当前的源树提供 Kagami 生成器,用于编写匹配基因组,同行配置,客户端配置和启动/停止脚本.

## 1. 构建二进制 {#_1-build-the-binaries}

从上游 Iroha 工作空间:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

这产生了:

- `target/release/iroha3d` 对同龄妖怪
- `target/release/iroha`用于 CLI
- `target/release/kagami`用于关键,基因和局域网生成

## 2. 创建本地网络 {#_2-generate-a-local-network}

创建一个四对的 Iroha 3 本地网络:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

输出目录包含生成的 `genesis.json`, `genesis.signed.nrt`,同行`config.toml`文件, `client.toml`,辅助脚本以及生成的 `README.md`,其中包含该捆绑的确切命令.

## 3. 开始同龄 {#_3-start-peers}

对于生成一次性本地网络,使用生成的脚本:

```bash
./localnet/start.sh
```

如果您需要将每个同行连接到像 systemd 这样的进程管理器中,请使用为每一个同行记录在 `./localnet/README.md` 的启动命令. 保持每个同行的 `config.toml`,私钥,存储目录和端口分开.

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

- 创建生产的新私钥,并将其存储在仓库外.
- 让每个同龄人都同意相同的签名基因交易,拓,可信任的同龄人和验证器 PoPs.
- 只有在其他机器不能从同行到达时,将收听器绑定到主机本地接口.
- 使用反向代理或防火墙来对 Torii 曝光,基础 auth, TLS 和速度限制.
- 将基因或共识拓学的变化视为协调迁移,而不是单双文件编辑.

对于集装本地开发,请使用 [启动 Iroha 3](../../get-started/launch-iroha.md) Docker Compose 工作流.
