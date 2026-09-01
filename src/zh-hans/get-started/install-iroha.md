---
translation_locale: zh-hans
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安装 Iroha 3 {#install-iroha-3}

本页面涵盖了使用上游 `hyperledger-iroha/iroha` 工作空间的 Iroha 3 工具链和二进制器的当前安装工作流.

## 1.先决条件 {#_1-prerequisites}

首先安装这些:

- [rustup](https://www.rust-lang.org/tools/install),因此固定的 `rust-toolchain.toml`工具链 (`1.93.1`) 已自动安装
- `git`
- 选项: Docker 和 Docker Compose 用于当地的多个对等节点快速启动

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
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

由此产生的二进制字符是以 `target/debug/`或 `target/release/`编写.

## 4. 检查安装的工具 {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

您通常使用的四个二进制是:

- `iroha3d`用于标准的对等节点守护进程
- `iroha3d_taira` 对于规范 Taira 验证器启动器
- `iroha` 对于 CLI 访问 Torii 和运营商端点
- `kagami` 对于密钥,创世表和局域网配置文件

## 5.可选的局域网和 Docker 路径 {#_5-optional-localnet-and-docker-path}

目前源支持的本地网络流是由 Kagami 生成的.它编写了对等节点配置,创世构件,客户端配置,辅助脚本以及与检查出来的代码匹配的可选组合文件:

- `kagami localnet` 用于原生本地对等节点脚本
- `kagami docker`为 Docker Compose 从局域网目录中生成

继续使用 [启动 Iroha 3](/zh-hans/get-started/launch-iroha.md).
