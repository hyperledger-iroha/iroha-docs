---
translation_locale: zh-hant
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust 的實現存在於主要工作空間中,並且仍然是與 Iroha 3 代碼庫合作的最直接方式.

## 你得到的 {#what-you-get}

目前,上游存儲庫揭示:

- `iroha` Rust 客戶端盒
- `iroha` CLI 作爲最完整的參考客戶端
- 在 SDK 層中使用的共享數據模型,加密和 Norito 盒

## 建議的起點 {#recommended-starting-point}

對於項目目前的狀態,請從參考 CLI 和工作空間本身開始:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

運行已注入的默認客戶端配置:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## 試看 Taira 只閱讀 {#try-taira-read-only}

在同一個工作場所的現金庫中,嘗試公共診斷助理 Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

在路線級別檢查時,直接使用 Torii 的 JSON API:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

在創建 `taira.client.toml`後,同一個二進制器可以對 Taira 執行簽署的加拿大命令. 保持這些單元測試與普通的測試分開,因爲它們需要採用水龍頭資助的帳戶和現場測試網可用性.

## 使用 Rust 客戶端盒 {#using-the-rust-client-crate}

固定您的網絡所使用的 Iroha Git修改:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

如果您需要最完整的實踐中使用 Rust 表面的例子,請檢查:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

對於賬本管理的託管工作流程,請參見 [原生資產託管](/zh-hant/blockchain/escrow.md#rust-sdk).目前, Rust 數據模型對市場託管,通用資產鎖定,匿名託管,查詢和事件提供了最完整的類型覆蓋範圍.

您可以使用以下方式再生本地 CLI 幫助快照:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## 備忘錄 {#notes}

- CLI 目前比單獨的盒子文件提供了更好的覆蓋.
- 對於運營商式流量, CLI 的文檔是最當前的來源.
