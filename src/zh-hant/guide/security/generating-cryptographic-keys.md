---
translation_locale: zh-hant
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 如何生成密碼關鍵 {#generating-cryptographic-keys}

使用 `kagami keys` 產生客戶端,同行和驗證碼關鍵資料
Iroha 3.

## 基本使用方式 {#basic-usage}

來自: Iroha 來源清算:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON 输出通常最容易複製到 TOML 或自動化:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

命令打印了公钥和公開的私钥.
密钥是秘密材料;不要承擔生成的生產鍵.

## 算法 {#algorithms}

常見的算法是:

- `ed25519` 提供客戶帳戶,流動身份和大部分開發
  網路.
- `secp256k1` 如果您需要 Secp256K1 帳戶身份.
- `bls_normal` 在建構中啟用時, BLS 提供支持.

檢查您建立的正確算法:

```bash
cargo run --bin kagami -- keys --help
```

## 決定性發展的關鍵 {#deterministic-development-keys}

適用於可複製的裝置,將種子放過:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

種子是私密的材料.

## BLS 擁有證據 {#bls-proofs-of-possession}

國家安全局和 Nexus 核准器的配置文件需要 BLS 驗證碼鍵和 PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

其他國家 JSON 包含: `pop_hex` 什麼時候 `--pop` 使用這個值,
產生的拓物或 `trusted_peers_pop` 該表格所要求的入口.

## 输出格式 {#output-formats}

使用預設輸出進行終端檢查, `--json` 自動化,以及
`--compact` 如果另一種字體需要單純的直線定向值:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

完全發電的產品 Kagami 幫助:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
