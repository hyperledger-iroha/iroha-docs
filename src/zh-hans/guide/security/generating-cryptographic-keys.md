---
translation_locale: zh-hans
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 生成加密密钥 {#generating-cryptographic-keys}

使用 `kagami keys` 为 Iroha 3 生成客户端、对等节点和验证器密钥材料。

## 基本使用 {#basic-usage}

在 Iroha 源码检出目录中：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

父目录必须已存在。目标目录必须是新目录或已归当前用户所有，权限模式为 `0700`，不含符号链接且为空。`kagami` 以 `0600` 模式写入 `public.key` 和 `private.key`，并且不会打印密钥材料。使用 `--pop` 时，它还会写入 `pop.hex`。

如果 Kagami 无法在某个平台上强制执行这些仅限所有者访问的文件系统规则，`--out-dir` 会以安全关闭方式拒绝操作。私钥文件是未加密的导出副本，并非硬件签名器或不可导出的生产签名器。请将其导入获准的托管边界，并按照部署规程删除该导出副本。

## 算法 {#algorithms}

常用算法包括：

- `ed25519`：用于客户端账户和流式传输身份。
- `secp256k1`：用于需要 secp256k1 身份的客户端账户。
- `bls_normal`：用于每个节点或对等节点的共识身份。

使用以下命令查看当前构建确切支持的算法：

```bash
cargo run --bin kagami -- keys --help
```

## 确定性开发密钥 {#deterministic-development-keys}

对于可复现的测试数据，请传入一个 32 字节的种子，并将其编码为 64 个十六进制字符。可以带上可选的 `0x` 前缀：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

种子属于私钥材料。确定性种子只能用于本地开发和测试。生成生产密钥时请省略 `--seed-hex`，以使用操作系统的随机源。

## BLS 共识密钥和持有证明 {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 的节点和对等节点共识身份使用 BLS-normal 密钥。使用以下命令生成 BLS-normal 密钥和持有证明 (PoP)：

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` 仅可与 `bls_normal` 一起使用；它会在托管目录中添加 `pop.hex`。签名的创世配置要求每个投票验证器都有匹配的 PoP。在对等节点配置中，非空的 `trusted_peers_pop` 映射用于选择验证器子集；未列入该非空映射的受信任对等节点是观察者。如果映射为空，所有使用 BLS-normal 的受信任对等节点都会进入引导候选集，而投票者的 PoPs 仍由签名的创世配置提供。

## 托管输出 {#custody-output}

`kagami keys` 要求提供 `--out-dir`，并且绝不会将私钥材料写入标准输出。请从生成的目录读取 `public.key`、`private.key` 以及可选的 `pop.hex`。每个文件都包含一个规范值，后跟一个换行符，因此可以直接实现显式的文件自动化：

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

要获取完整生成的 Kagami 帮助：

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
