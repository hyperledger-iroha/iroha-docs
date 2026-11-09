---
translation_locale: zh-hans
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 热的重载 Iroha 在一个 Docker 集装箱 {#hot-reload-iroha-in-a-docker-container}

热重载仅适用于本地调试。 请参阅 [启动 Iroha 3](/zh-hans/get-started/launch-iroha.md)，使用同一版本的可执行文件，在 Docker 中构建并启动四个验证节点。

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

使用 `docker ps` 查找容器，并在替换守护进程前确认它在镜像中的路径。

## 在一次性网络中重复创世纪 {#recommit-genesis-in-a-disposable-network}

使用新的创世区块时，节点的存储空间必须为空。 依次运行 `python3 poc.py down` 和 `python3 poc.py up` 以重启同一网络。请将 `state/` 与其四个 Docker 数据卷一起保留。

## 使用定制配置 {#use-custom-configuration}

目前的对等节点配置是 TOML.将生成的 `config.toml`, `genesis.signed.nrt` 和相关关键文件绑定或复制到预期的容器路径中.将生成的文件放在一起;从不同的 Kagami 运行中混合文件可能会导致消产或共识失败.
