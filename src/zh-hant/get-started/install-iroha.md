---
translation_locale: zh-hant
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安裝 Iroha 3 {#install-iroha-3}

本頁面涵蓋了使用上游 `hyperledger-iroha/iroha` 工作空間的 Iroha 3 工具鏈和二進位制器的當前安裝工作流.

## 1.先決條件 {#_1-prerequisites}

首先安裝這些:

- [rustup](https://www.rust-lang.org/tools/install),因此固定的 `rust-toolchain.toml`工具鏈 (`1.93.1`) 已自動安裝
- `git`
- 選項: Docker 和 Docker Compose 用於當地的多個對等節點快速啟動

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

為了一個較小的操作員集中構建,只編譯主要二進位制:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

由此產生的二進位制字元是以 `target/debug/`或 `target/release/`編寫.

## 4. 檢查安裝的工具 {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

您通常使用的四個二進位制是:

- `iroha3d`用於標準的對等節點守護程式
- `iroha3d_taira` 對於規範 Taira 驗證器啟動器
- `iroha` 對於 CLI 訪問 Torii 和運營商端點
- `kagami` 對於金鑰,創世表和區域網配置檔案

## 5.可選的區域網和 Docker 路徑 {#_5-optional-localnet-and-docker-path}

目前源支援的本地網路流是由 Kagami 生成的.它編寫了對等節點配置,創世構件,客戶端配置,輔助指令碼以及與檢查出來的程式碼匹配的可選組合檔案:

- `kagami localnet` 用於原生本機對等節點指令碼
- `kagami docker`為 Docker Compose 從區域網目錄中生成

繼續使用 [啟動 Iroha 3](/zh-hant/get-started/launch-iroha.md).
