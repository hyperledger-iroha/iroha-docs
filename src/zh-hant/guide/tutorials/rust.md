---
translation_locale: zh-hant
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust 的實現存在於主要工作空間中,並且仍然是與 Iroha 3 程式碼庫合作的最直接方式.

## 你得到的 {#what-you-get}

目前,上游儲存庫揭示:

- `iroha` Rust 客戶端盒
- `iroha` CLI 作為最完整的參考客戶端
- 在 SDK 層中使用的共享資料模型,加密和 Norito 盒

## 建議的起點 {#recommended-starting-point}

對於專案目前的狀態,請從參考 CLI 和工作空間本身開始:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

執行已注入的預設客戶端配置:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## 試看 Taira 只閱讀 {#try-taira-read-only}

在同一工作區檢出目錄中，嘗試公用 Taira 診斷助手：

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

在路線級別檢查時,直接使用 Torii 的 JSON API:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

在建立 `taira.client.toml`後,同一個二進位制器可以對 Taira 執行已簽署的 canary 命令. 保持這些單元測試與普通的測試分開,因為它們需要採用水龍頭資助的帳戶和現場測試網可用性.

## 使用 Rust 客戶端盒 {#using-the-rust-client-crate}

固定您的網路所使用的 Iroha Git修改:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

如果您需要最完整的實踐中使用 Rust 表面的例子,請檢查:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

對於賬本管理的託管工作流程,請參見 [原生資產託管](/zh-hant/blockchain/escrow.md#rust-sdk).目前, Rust 資料模型對市場託管,通用資產鎖定,匿名託管,查詢和事件提供了最完整的型別覆蓋範圍.

您可以使用以下方式再生本地 CLI 幫助快照:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## 備忘錄 {#notes}

- CLI 目前比單獨的盒子檔案提供了更好的覆蓋.
- 對於運營商式流量, CLI 的文件是最當前的來源.
