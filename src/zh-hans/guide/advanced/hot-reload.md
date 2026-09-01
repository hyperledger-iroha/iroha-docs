---
translation_locale: zh-hans
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 热的重载 Iroha 在一个 Docker 集装箱 {#hot-reload-iroha-in-a-docker-container}

仅将热重载用于本地调试。对于普通本地开发，优先重新构建映像，或使用新的 Kagami 捆绑重新启动生成的 Docker Compose 栈。

## 取代对等节点二进制 {#replace-the-peer-binary}

从上游工作空间构建一个与Linux兼容的 daemon二进制:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

复制到运行的对等节点容器中,然后重新启动该容器:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

使用 `docker ps`来确认容器名称.在生成的堆中,对等节点容器由 `./docker-compose.yml`定义.

## 在一次性网络中重复创世纪 {#recommit-genesis-in-a-disposable-network}

对等节点仅在其存储为空时提交创世区块。对于一次性 Docker 网络，请停止堆栈、删除生成的状态、重新生成或替换已签名的创世捆绑包，然后重新启动：

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

不要在一个必须保存状态的网络上取代创世.

## 使用定制配置 {#use-custom-configuration}

目前的对等节点配置是 TOML.将生成的 `config.toml`, `genesis.signed.nrt` 和相关关键文件绑定或复制到预期的容器路径中.将生成的文件放在一起;从不同的 Kagami 运行中混合文件可能会导致消产或共识失败.
