---
translation_locale: zh-hant
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

其他國家 Rust 實現在主要工作領域,
如何與 Iroha 3 這種方法是:

## 你會得到什麼? {#what-you-get}

目前上流資料庫揭露:

- 這項政策 `iroha` Rust 客戶箱
- 這項政策 `iroha` CLI 作为最完整的參考客戶
- 分享數據模型,加密碼和 Norito 該組織使用的盒子 SDK 層次

## 推薦的開始點 {#recommended-starting-point}

關於該項目目前的狀況, CLI 這種情況
工作空間本身:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

執行已注入的預設客戶端配置:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## 請試下 Taira 只有閱讀 {#try-taira-read-only}

在同一工作場的櫃台, Taira 診斷助理:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

在路線級檢查中,使用 Torii 沒有任何問題 JSON API 直接:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

在你創造後, `taira.client.toml`, 這樣的二進碼可以執行簽名的加拿大
禁止使用的命令 Taira. 保持這些與普通單位測試分離,
需要使用水龙头资助的帳戶和實際測試網可用.

## 透過使用 Rust 客戶櫃子 {#using-the-rust-client-crate}

住這個 Iroha 您的網路使用的 Git 修改:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

如果您需要最完整的例子, Rust 表面使用在
實踐,檢查:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

查看本簿管理的保證工作流程,
[預借本地資產](/zh-hant/blockchain/escrow.md#rust-sdk). 其他國家 Rust 數據模型
目前為市場保證所提供的最完整的類型覆蓋,
沒有任何可能的證券,

您可以再生一個本地 CLI 幫助使用:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## 註冊 {#notes}

- 其他國家 CLI 目前提供比獨立的櫃子文件更好的覆蓋.
- 在操作員式流程中, CLI 資料是最新的來源.
