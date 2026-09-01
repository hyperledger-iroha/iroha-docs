---
translation_locale: zh-hans
translation_source: /reference/binaries.md
translation_source_hash: 3d1cddb466092770376bcb150963d5df29a6ebc5cf6e670baa3a5c277082fdab
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 使用 Iroha 二进制程序 {#working-with-iroha-binaries}

Iroha 3 操作员的工作流程围绕四个主要二进制:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad)用于运行一个对等节点守护进程
- `iroha3d_taira` 对于规范 Taira 验证器启动器
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli)用于 CLI 和操作员指令
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami)用于密钥,创世,局域网和个人资料

## 建立从源头 {#build-from-source}

从上游工作空间的根源:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

在 `target/release/` 中,释放二进制品可使用.

为了检查指挥面:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## 直接从存储库中运行 {#run-directly-from-the-repository}

如果您不想在全球范围内安装任何东西,请使用 `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 图像 {#docker-image}

上游工作空间使用 `kagami localnet` 和 `kagami docker` 产生 Docker Compose 文件与检查出来的代码相匹配. `hyperledger/iroha:dev` 图像可以与生成的文件一起使用.

运行 CLI 在一个容器中:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

在容器中运行 Kagami:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

为对等节点启动,先生成一个本地网,然后编写文件:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## 我应该使用哪个二进制程序？ {#which-binary-should-i-use}

- 使用 `iroha3d` 当您在公共 Taira 验证器版本之外启动或运行对等节点时.
- 使用 `iroha3d_taira --sora` 仅用于规范的 Taira 验证器部署;它强制执行 Taira 的链,存储和运行时签字符配置文件.
- 在需要查询账本,提交交易或检查运营商端点时使用 `iroha`.
- 使用 `kagami`当您需要密钥,创世清单,个人资料捆绑或本地网资产时.
