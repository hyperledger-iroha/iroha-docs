---
translation_locale: zh-hans
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 发射 Iroha 3 {#launch-iroha-3}

本页面通过使用上游存储库中的默认工作空间资产来查看 Iroha 3 的当前本地网络流动.

## 1. 创建一个地方多同行网络 {#_1-generate-a-local-multi-peer-network}

从当前的 Kagami 代码生成一个四对子本地网络:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

输出目录包含相匹配的同行配置, `genesis.json`, `genesis.signed.nrt`, `client.toml`和辅助脚本.

在本地烟雾测试中,直接启动生成的同龄人:

```bash
./localnet/start.sh
```

在一个容器运行中,从同一 localnet目录生成 Compose:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

默认生成的堆曝光:

- 同等 P2P 端口 `1337`到 `1340`
- Torii HTTP 港口 `8080`到 `8083`
- 在 `./localnet/client.toml` 设置已完成的客户端配置

## 2. 检查网络是否开通 {#_2-verify-that-the-network-is-up}

检查第一个同行状态终点:

```bash
curl http://127.0.0.1:8080/status
```

默认健康检查还使用:

```bash
curl http://127.0.0.1:8080/status/blocks
```

您可以立即将 CLI 指向捆绑的客户端配置:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus 个人资料 {#_3-nexus-profile}

存储库还将一个以 SORA Nexus 为导向的配置资料发送到 `defaults/nexus/`.

运行一个具有 Nexus 配置文件的原生同行:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

使用 `defaults/nexus/client.toml`来获取 CLI 该配置文件.

## 4. 停止本地网络 {#_4-stop-the-local-network}

对于原生生成的本地网络:

```bash
./localnet/stop.sh
```

对于生成的Compose堆:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

网络运行后,继续使用 [通过 CLI](/zh-hans/get-started/operate-iroha-via-cli.md)运行 Iroha 3.
