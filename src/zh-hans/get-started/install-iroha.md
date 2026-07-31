---
translation_locale: zh-hans
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安装 Iroha 3 {#install-iroha-3}

本页面涵盖了目前的安装工作流程 Iroha 3 工具链
和使用上游的二进制 `hyperledger-iroha/iroha` 工作空间.

## 1.先决条件 {#_1-prerequisites}

首先安装这些:

- [rustup](https://www.rust-lang.org/tools/install), 所以被住的
  `rust-toolchain.toml` 工具链 (`1.93.1`) 自动安装
- `git`
- 选择性, Docker 并且 Docker Compose 对于本地多个同行快速启动

## 2. 克隆工作场所 {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. 建立工作场所 {#_3-build-the-workspace}

建立一切:

```bash
cargo build --workspace
```

为了一个更小的操作员集中构建,只编译主要二进制:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

结果的二进制是写到 `target/debug/` 或 `target/release/`.

## 4. 检查安装的工具 {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

你通常使用的三个二进制是:

- `irohad` 对于同龄妖魔
- `iroha` 对于 CLI 获取 Torii 运营商终端点
- `kagami` 对于密钥,基因表和本地网配置文件

## 5.可选的本地网络和 Docker 路径 {#_5-optional-localnet-and-docker-path}

目前的源支持本地网络流量由 Kagami. 它写的同龄人
配置,创始文物,客户端配置,辅助脚本以及可选的
编写与已退出代码相匹配的文件:

- `kagami localnet` 对于本地同行脚本
- `kagami docker` 对于 Docker Compose 从 localnet目录中生成

继续 [发射 Iroha 3](/zh-hans/get-started/launch-iroha.md).
