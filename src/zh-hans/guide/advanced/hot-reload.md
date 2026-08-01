---
translation_locale: zh-hans
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 热的重载 Iroha 在一个 Docker 集装箱 {#hot-reload-iroha-in-a-docker-container}

对于正常的本地开发,更好重建图像或从新增的 Kagami 捆绑中重新启动生成的 Docker Compose 堆

## 取代同行二进制 {#replace-the-peer-binary}

从上游工作空间构建一个与Linux兼容的 daemon二进制:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

复制到运行的同行容器中,然后重新启动该容器:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

使用 `docker ps`来确认容器名称.在生成的堆中,同等容器由 `./localnet/docker-compose.yml`定义.

## 在一次性网络中重复创世纪 {#recommit-genesis-in-a-disposable-network}

在一个一次性 Docker 网络中,停止堆,删除生成状态,再生或更换签署的创新捆绑,然后重新启动:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

不要在一个必须保存状态的网络上取代基因.

## 使用定制配置 {#use-custom-configuration}

目前的同行配置是 TOML.将生成的 `config.toml`, `genesis.signed.nrt` 和相关关键文件绑定或复制到预期的容器路径中.将生成的文件放在一起;从不同的 Kagami 运行中混合文件可能会导致消产或共识失败.
