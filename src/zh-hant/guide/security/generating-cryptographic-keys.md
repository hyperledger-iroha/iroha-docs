---
translation_locale: zh-hant
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 產生密碼金鑰 {#generating-cryptographic-keys}

使用 `kagami keys` 產生 Iroha 3 使用者端、對等節點及驗證者的金鑰材料。

## 基本用法 {#basic-usage}

在 Iroha 原始碼簽出目錄中：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

上層目錄必須已存在。目標目錄必須是新目錄或已由目前使用者擁有，許可權模式為 `0700`，不含符號連結且為空。`kagami` 會以 `0600` 模式寫入 `public.key` 和 `private.key`，而且不會印出金鑰材料。使用 `--pop` 時，它也會寫入 `pop.hex`。

如果 Kagami 無法在某個平臺上強制執行這些僅限擁有者存取的檔案系統規則，`--out-dir` 會採安全關閉方式拒絕操作。私密金鑰檔案是未加密的匯出副本，並非硬體簽署器或不可匯出的生產簽署器。請將其匯入核准的託管邊界，並依部署程式刪除該匯出副本。

## 演演算法 {#algorithms}

常用演演算法包括：

- `ed25519`：用於使用者端帳戶及串流身分。
- `secp256k1`：用於需要 secp256k1 身分的使用者端帳戶。
- `bls_normal`：用於每個節點或對等節點的共識身分。

使用以下命令檢視目前建置確切支援的演演算法：

```bash
cargo run --bin kagami -- keys --help
```

## 確定性的開發金鑰 {#deterministic-development-keys}

對於可重現的測試資料，請傳入一個 32 位元組的種子，並將其編碼成 64 個十六進位字元。可以加上選用的 `0x` 字首：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

種子屬於私密金鑰材料。確定性種子只能用於本機開發和測試。產生生產金鑰時請省略 `--seed-hex`，以使用作業系統的隨機來源。

## BLS 共識金鑰與持有證明 {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 的節點與對等節點共識身分使用 BLS-normal 金鑰。使用以下命令產生 BLS-normal 金鑰及持有證明 (PoP)：

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` 僅可與 `bls_normal` 一起使用；它會在託管目錄中加入 `pop.hex`。已簽署的創世設定要求每個投票驗證者都有相符的 PoP。在對等節點設定中，非空的 `trusted_peers_pop` 對映會選出驗證者子集；未列入該非空對映的受信任對等節點是觀察者。如果對映為空，所有使用 BLS-normal 的受信任對等節點都會進入啟動候選集合，而投票者的 PoPs 仍由已簽署的創世設定提供。

## 託管輸出 {#custody-output}

`kagami keys` 要求提供 `--out-dir`，而且絕不會將私密金鑰材料寫入標準輸出。請從產生的目錄讀取 `public.key`、`private.key` 及選用的 `pop.hex`。每個檔案都包含一個規範值，後接一個換行字元，因此可以直接實作明確的檔案式自動化：

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

若要取得完整產生的 Kagami 說明：

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
