---
translation_locale: zh-hans
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

当前的对等节点配置采用 TOML 格式。Kagami 会为每个验证者写入一个 `peerN.toml`，并附带 `genesis.signed.nrt`、`genesis.public_key` 和 `genesis.expected_hash`；由 `kagami docker` 生成的 Compose 文件会将它们挂载到容器中。请重新生成，而不要手动复制文件，然后重启对等节点。请将生成的文件放在一起；混用不同 Kagami 运行生成的文件可能导致反序列化或共识失败。
