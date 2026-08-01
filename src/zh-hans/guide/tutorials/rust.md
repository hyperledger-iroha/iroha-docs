---
translation_locale: zh-hans
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust 的实现存在于主要工作空间中,并且仍然是与 Iroha 3 代码库合作的最直接方式.

## 你得到的 {#what-you-get}

目前,上游存储库揭示:

- `iroha` Rust 客户端盒
- `iroha` CLI 作为最完整的参考客户端
- 在 SDK 层中使用的共享数据模型,加密和 Norito 盒

## 建议的起点 {#recommended-starting-point}

对于项目目前的状态,请从参考 CLI 和工作空间本身开始:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

运行已注入的默认客户端配置:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## 试看 Taira 只阅读 {#try-taira-read-only}

在同一个工作场所的现金库中,尝试公共诊断助理 Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

在路线级别检查时,直接使用 Torii 的 JSON API:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

在创建 `taira.client.toml`后,同一个二进制器可以对 Taira 执行签署的加拿大命令. 保持这些单元测试与普通的测试分开,因为它们需要采用水龙头资助的帐户和现场测试网可用性.

## 使用 Rust 客户端盒 {#using-the-rust-client-crate}

固定您的网络所使用的 Iroha Git修改:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

如果您需要最完整的实践中使用 Rust 表面的例子,请检查:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

对于账本管理的托管工作流程,请参见 [原生资产托管](/zh-hans/blockchain/escrow.md#rust-sdk).目前, Rust 数据模型对市场托管,通用资产锁定,匿名托管,查询和事件提供了最完整的类型覆盖范围.

您可以使用以下方式再生本地 CLI 帮助快照:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## 备忘录 {#notes}

- CLI 目前比单独的盒子文件提供了更好的覆盖.
- 对于运营商式流量, CLI 的文档是最当前的来源.
