---
translation_locale: zh-hans
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 发射 Iroha 3 {#launch-iroha-3}

这个页面通过当前的本地网络流 Iroha 3 通过
从上游存储库中的默认工作空间资产.

## 1. 创建一个地方多同行网络 {#_1-generate-a-local-multi-peer-network}

从当前生成一个四对的本地网络 Kagami 代码:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

输出目录包含匹配的同行配置, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, 和助手的剧本.

在本地烟雾测试中,直接启动生成的同龄人:

```bash
./localnet/start.sh
```

对于一个容器运行,从同一 localnet目录生成 Compose:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

默认生成的堆显示:

- 同龄人 P2P 港口 `1337` 在 `1340`
- Torii HTTP 港口 `8080` 在 `8083`
- 一个准备的客户配置在 `./localnet/client.toml`

## 2. 检查网络是否开通 {#_2-verify-that-the-network-is-up}

在第一个同行上检查状态终点:

```bash
curl http://127.0.0.1:8080/status
```

默认健康检查还使用:

```bash
curl http://127.0.0.1:8080/status/blocks
```

您可以立即指向 CLI 在捆绑的客户端配置中:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus 个人资料 {#_3-nexus-profile}

存储库还运送一个 SORA Nexus- 导向配置资料
`defaults/nexus/`.

为了与本地同龄人 Nexus 个人资料:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

使用 `defaults/nexus/client.toml` 对于 CLI 访问该个人资料.

## 4. 停止本地网络 {#_4-stop-the-local-network}

对于本地生成的局域网:

```bash
./localnet/stop.sh
```

对于生成的复合堆:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

在网络运行后,继续使用
[运行 Iroha 3 通过 CLI](/zh-hans/get-started/operate-iroha-via-cli.md).
