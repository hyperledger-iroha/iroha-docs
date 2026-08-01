---
translation_locale: zh-hant
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 產生密碼金鑰 {#generating-cryptographic-keys}

使用 `kagami keys` 產生 Iroha 3 用戶端、對等節點及驗證者的金鑰材料。

## 基本用法 {#basic-usage}

在 Iroha 原始碼檢出目錄中執行：

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON 輸出通常最方便複製至 TOML 或自動化流程：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

此命令會印出公開金鑰及明文私鑰。私鑰必須視為祕密資料；切勿將產生的生產金鑰提交至版本控制。

若要在支援的 Unix 平台安全地匯出至本機或交付給保管系統，請將新金鑰對寫入僅擁有者可存取的空目錄，而不要印出私鑰：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

父目錄必須已存在。目標目錄必須是新目錄，或已由目前使用者擁有、模式為 `0700`、不含符號連結且內容為空。`kagami` 會以模式 `0600` 寫入 `public.key` 與 `private.key`，且不會印出私鑰；搭配 `--pop` 時也會寫入 `pop.hex`。

若 Kagami 無法強制執行這些僅限擁有者的檔案系統規則，`--out-dir` 會採取安全失敗並拒絕操作。私鑰檔是未加密的匯出物，不是硬體式或不可匯出的生產簽署器。請將它匯入經核准的保管邊界，然後依部署程序移除該匯出物。

## 演算法 {#algorithms}

常用演算法如下：

- `ed25519`：用於用戶端帳戶與串流身分。
- `secp256k1`：用於需要 secp256k1 身分的用戶端帳戶。
- `bls_normal`：建置啟用 BLS 支援時，用於每個節點或對等節點的共識身分。

使用下列命令查看目前建置實際支援的演算法：

```bash
cargo run --bin kagami -- keys --help
```

## 確定性的開發金鑰 {#deterministic-development-keys}

若要建立可重現的測試固定資料，請傳入編碼為 64 個十六進位字元的 32 位元組種子；也可加上 `0x` 前綴：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

種子屬於私鑰材料。確定性種子只能用於本機開發與測試。產生生產金鑰時應省略 `--seed-hex`，讓作業系統的隨機來源產生金鑰。

## BLS 共識金鑰與持有證明 {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 節點及對等節點的共識身分使用 BLS-normal 金鑰。使用下列命令產生 BLS-normal 金鑰與持有證明（PoP）：

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` 只能搭配 `bls_normal` 使用。JSON 輸出包含 `pop_hex`。已簽署的創世區塊要求每個具投票權的驗證者都有相符的 PoP。在對等節點組態中，非空的 `trusted_peers_pop` 對應表會選出驗證者子集；未列入該非空對應表的可信任對等節點是觀察者。若對應表為空，所有使用 BLS-normal 的可信任對等節點都會進入啟動候選集合，而投票者 PoPs 仍由已簽署的創世區塊提供。

## 輸出格式 {#output-formats}

終端檢查請使用預設輸出，自動化請使用 `--json`；其他指令碼需要純文字逐行值時，請使用 `--compact`：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

若要取得完整產生的 Kagami 說明：

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
