---
translation_locale: zh-hant
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 裝置 Iroha 3 {#install-iroha-3}

這頁面涵蓋了目前的安裝工作流程 Iroha 3 工具链
並使用上流的二元 `hyperledger-iroha/iroha` 工作空間.

## 1. 必須的前提 {#_1-prerequisites}

首先要安裝這些:

- [rustup](https://www.rust-lang.org/tools/install), 這樣的子
  `rust-toolchain.toml` 工具链 (`1.93.1`) 自動安裝
- `git`
- 選擇性上, Docker 及其他 Docker Compose 該區域的多人快速啟動

## 2. 複製工作空間 {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. 建立工作空間 {#_3-build-the-workspace}

建立一切:

```bash
cargo build --workspace
```

僅限於主要二元數量:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

這種二項是: `target/debug/` 或是 `target/release/`.

## 4. 檢查安裝的工具 {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

您通常使用的三個二元是:

- `irohad` 為了同行妖怪
- `iroha` 關於 CLI 接觸到 Torii 和運營者終點
- `kagami` 關鍵,基因表格和局域網配置文件

## 5.可選的本地網路和 Docker 路徑 {#_5-optional-localnet-and-docker-path}

根據本源支持的本地網流量由 Kagami. 這裡寫著"同行".
設定,基因文物,客戶端配置,助手脚本,以及可選的
列出與已退出代碼相匹配的文件:

- `kagami localnet` 在本地同行文字中,
- `kagami docker` 關於 Docker Compose 由 localnet目錄生成

繼續閱讀 [發射 Iroha 3](/zh-hant/get-started/launch-iroha.md).
