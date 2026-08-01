---
translation_locale: zh-hans
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安装 Iroha 3 {#install-iroha-3}

本页面涵盖了使用上游 `hyperledger-iroha/iroha` 工作空间的 Iroha 3 工具链和二进制器的当前安装工作流.

## 1.先决条件 {#_1-prerequisites}

首先安装这些:

- [rustup](https://www.rust-lang.org/tools/install),因此固定的 `rust-toolchain.toml`工具链 (`1.93.1`) 已自动安装
- `git`
- 选项: Docker 和 Docker Compose 用于当地的多个同行快速启动

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

为了一个较小的操作员集中构建,只编译主要二进制:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

由此产生的二进制字符是以 `target/debug/`或 `target/release/`编写.

## 4. 检查安装的工具 {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

你通常会使用的三个二进制是:

- `irohad` 对同龄妖怪
- `iroha` 对于 CLI 访问 Torii 和运营商终端点
- `kagami` 对于密钥,基因表和局域网配置文件

## 5.可选的局域网和 Docker 路径 {#_5-optional-localnet-and-docker-path}

目前源支持的本地网络流是由 Kagami 生成的.它编写了同行配置,创始文物,客户端配置,辅助脚本以及与检查出来的代码匹配的可选组合文件:

- `kagami localnet`用于原生本地同龄脚本
- `kagami docker`为 Docker Compose 从局域网目录中生成

继续使用 [发射 Iroha 3](/zh-hans/get-started/launch-iroha.md).
