---
translation_locale: zh-hans
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

其他 Rust 实施在主要工作空间中,仍然是最直接的
如何与 Iroha 3 编码基础.

## 你得到的 {#what-you-get}

目前上游存储库揭示:

- 在 `iroha` Rust 客户箱
- 在 `iroha` CLI 作为最完整的参考客户端
- 分享数据模型,加密信息和 Norito 经过 SDK 层

## 建议的起点 {#recommended-starting-point}

关于项目目前的状态,请从参考开始 CLI 在
工作空间本身:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

运行已注入的默认客户端配置:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## 试着 Taira 只有阅读 {#try-taira-read-only}

在同一个工作场所的现金库,试看公众 Taira 诊断助理:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

对于路线级检查,使用 Torii 现在 JSON API 直接:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

在你创造之后, `taira.client.toml`, 同一个二进制可以运行签名的加拿大
命令反对 Taira. 保持这些与普通单元测试分开,因为
他们需要一个水机资助的账户和现场测试网可用性.

## 通过 Rust 客户箱 {#using-the-rust-client-crate}

着 Iroha 网络使用的Git修改:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

如果您需要最完整的例子, Rust 表面在
实践,检查:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

对于本书管理的保证金工作流程,见
[产业资产抵押](/zh-hans/blockchain/escrow.md#rust-sdk). 其他 Rust 数据模型
目前对市场保证金,一般类型最完整的覆盖范围
资产锁定,匿名保证金,查询和事件.

你可以再生一个本地 CLI 帮助使用:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## 备忘录 {#notes}

- 其他 CLI 目前提供了比单独的盒子文件更好的覆盖.
- 对于运营商式流量, CLI 文件是最最新的来源.
