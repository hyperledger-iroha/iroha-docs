---
translation_locale: zh-hans
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 热重载 Iroha 在一个 Docker 集装箱 {#hot-reload-iroha-in-a-docker-container}

对于正常的本地开发,最好选择:
重建图像或重新启动生成的图像 Docker Compose 一个
新鲜 Kagami 包裹.

## 取代同行二进制 {#replace-the-peer-binary}

从上游工作空间构建一个与Linux兼容的 daemon二进制:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

复制到运行的同行容器,然后重新启动该容器:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

使用 `docker ps` 在生成的堆中,
容器的定义是: `./localnet/docker-compose.yml`.

## 在一次性网络中重复创世纪 {#recommit-genesis-in-a-disposable-network}

一个同龄人只有在储存空时才开始产生. Docker
网络,停止堆,删除生成状态,再生或取代
签署的基因组,然后重新开始:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

不要替代一个必须保存状态的网络上的起源.

## 使用定制配置 {#use-custom-configuration}

目前的同行配置是 TOML. 绑定安装或复制生成的
`config.toml`, `genesis.signed.nrt`, 和相关的关键文件进入容器
然后重新启动同行.保存生成的文件
一起;混合不同文件 Kagami 运行可能产生消毒化或
没有共识.
