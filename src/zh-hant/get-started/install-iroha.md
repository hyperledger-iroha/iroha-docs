---
translation_locale: zh-hant
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安裝 Iroha 3 {#install-iroha-3}

本頁面涵蓋了使用上游 `hyperledger-iroha/iroha` 工作空間的 Iroha 3 工具鏈和二進制器的當前安裝工作流.

## 1.先決條件 {#_1-prerequisites}

首先安裝這些:

- [rustup](https://www.rust-lang.org/tools/install),因此固定的 `rust-toolchain.toml`工具鏈 (`1.93.1`) 已自動安裝
- `git`
- 選項: Docker 和 Docker Compose 用於當地的多個同行快速啓動

## 2. 克隆工作場所 {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. 建立工作場所 {#_3-build-the-workspace}

建立一切:

```bash
cargo build --workspace
```

爲了一個較小的操作員集中構建,只編譯主要二進制:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

由此產生的二進制字符是以 `target/debug/`或 `target/release/`編寫.

## 4. 檢查安裝的工具 {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

您通常使用的四個二進制是:

- `iroha3d`用於標準的同齡妖怪
- `iroha3d_taira` 對於法典 Taira 驗證器發射器
- `iroha` 對於 CLI 訪問 Torii 和運營商終端點
- `kagami` 對於密鑰,基因表和局域網配置文件

## 5.可選的局域網和 Docker 路徑 {#_5-optional-localnet-and-docker-path}

目前源支持的本地網絡流是由 Kagami 生成的.它編寫了同行配置,創始文物,客戶端配置,輔助腳本以及與檢查出來的代碼匹配的可選組合文件:

- `kagami localnet`用於原生本地同齡腳本
- `kagami docker`爲 Docker Compose 從局域網目錄中生成

繼續使用 [發射 Iroha 3](/zh-hant/get-started/launch-iroha.md).
