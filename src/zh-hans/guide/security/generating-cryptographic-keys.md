---
translation_locale: zh-hans
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 生成加密钥 {#generating-cryptographic-keys}

使用 `kagami keys` 生成客户端,同行和验证器关键材料
Iroha 3.

## 基本使用 {#basic-usage}

通过 Iroha 来源清算:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON 输出通常最容易复制到 TOML 或自动化:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

命令打印了公钥和私钥.
密钥作为秘密材料;不要承担生成的生产钥匙.

## 算法 {#algorithms}

常见的算法是:

- `ed25519` 对于客户帐户,流媒体身份和大多数开发
  网络.
- `secp256k1` 如果您需要Secp256K1账户身份.
- `bls_normal` 对于验证器共识密钥,当构建启用 BLS 支持.

查看您的构建支持的精确算法:

```bash
cargo run --bin kagami -- keys --help
```

## 确定性发展的关键 {#deterministic-development-keys}

对于可复制的装置,将种子传递:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

种子是私钥材料,只用于本地开发和测试.

## BLS 持有证据 {#bls-proofs-of-possession}

其他国家和地区 Nexus 验证器配置文件要求 BLS 验证器密钥和 PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

其他 JSON 包括 `pop_hex` 什么时候 `--pop` 使用该值为
产生的拓或 `trusted_peers_pop` 个人资料所要求的条目.

## 输出格式 {#output-formats}

使用默认输出用于终端检查, `--json` 为自动化,以及
`--compact` 当另一个脚本需要简单的线路导向值时:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

对于全发电 Kagami 帮助:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
