---
translation_locale: zh-hans
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 生成加密密钥 {#generating-cryptographic-keys}

使用 `kagami keys` 为 Iroha 3 生成客户端、对等节点和验证器密钥材料。

## 基本使用 {#basic-usage}

在 Iroha 源代码检出目录中运行：

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON 输出通常最便于复制到 TOML 或用于自动化：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

该命令会打印一个公钥和一个暴露的私钥。必须将私钥视为秘密材料；不得把生成的生产密钥提交到版本控制中。

若要在受支持的 Unix 平台上进行安全的本地导出或保管交接，应将新密钥对写入一个仅所有者可访问的空目录，而不是打印私钥：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

父目录必须已经存在。目标目录必须是新目录，或已经由当前用户所有；其模式必须为 `0700`，不得包含符号链接，并且必须为空。`kagami` 会以 `0600` 模式写入 `public.key` 和 `private.key`，且不会打印私钥。使用 `--pop` 时还会写入 `pop.hex`。

在 Kagami 无法强制执行这些仅所有者文件系统规则的平台上，`--out-dir` 会安全地拒绝执行。私钥文件是未加密的导出文件，并非硬件签名器或不可导出的生产签名器。应将其导入获批的保管边界，再按照部署流程删除该导出文件。

## 算法 {#algorithms}

常用算法包括：

- `ed25519`：用于客户端账户和流式身份。
- `secp256k1`：客户端账户需要 secp256k1 身份时使用。
- `bls_normal`：构建启用 BLS 支持时，每个节点或对等节点的共识身份都使用此算法。

使用以下命令检查当前构建确切支持的算法：

```bash
cargo run --bin kagami -- keys --help
```

## 确定性开发密钥 {#deterministic-development-keys}

为了得到可复现的夹具，可传入一个编码为 64 个十六进制字符的 32 字节种子。也可以带 `0x` 前缀：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

种子属于私钥材料。确定性种子只能用于本地开发和测试。生成生产密钥时应省略 `--seed-hex`，由操作系统随机源生成密钥。

## BLS 共识密钥和持有证明 {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 的节点和对等节点共识身份使用 BLS-normal 密钥。使用以下命令生成 BLS-normal 密钥和持有证明（PoP）：

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` 只能与 `bls_normal` 一起使用。JSON 输出包含 `pop_hex`。已签名的创世配置要求每个投票验证器都提供匹配的 PoP。在对等节点配置中，非空的 `trusted_peers_pop` 映射会选定验证器子集；未列入该非空映射的可信对等节点是观察者。如果映射为空，所有使用 BLS-normal 的可信对等节点都会进入引导候选集，但投票者 PoPs 仍必须由已签名的创世配置提供。

## 输出格式 {#output-formats}

终端检查使用默认输出，自动化使用 `--json`；当其他脚本需要按行排列的纯文本值时使用 `--compact`：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

要生成完整的 Kagami 帮助文档，请运行：

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
