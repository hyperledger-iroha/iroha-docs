---
translation_locale: zh-hant
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 網路部署的關鍵 {#keys-for-network-deployment}

每個網路都需要針對客戶,對等節點,創世簽名和NPoS或 Nexus 個人資料, BLS 驗證者身份.

## 用鑰匙的地方 {#where-keys-are-used}

- 客戶簽名金鑰儲存在 `client.toml`下 `[account]`.
- 每個對等節點身份金鑰 `config.toml` 儲存為 `public_key`和 `private_key`.
- 在 `trusted_peers` 中,對等節點發現使用每個對等節點的公鑰.
- BLS 驗證器 NPoS配置檔案的所有權證明儲存在 `trusted_peers_pop` 中.
- 在簽署表時,Genesis簽字使用`[genesis].public_key`在對等節點配置中和相匹配的私鑰.

在本地或測試部署中,讓 Kagami 將所有這些檔案生成在一起:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

對於現有網路或配置檔案,使用導向流程:

```bash
cargo run --bin kagami -- wizard
```

## 建立單個關鍵對 {#generate-individual-key-pairs}

使用 `kagami keys` 產生獨立的金鑰材料：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

對於 BLS 驗證者金鑰材料，還要包含持有證明：

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

只有在建立可重現的開發測試資料時，才將 `--seed-hex` 與長度恰好為 32 位元組的十六進位秘密值一起使用。生產部署時應省略此選項，讓 Kagami 使用作業系統的隨機來源，再將未加密的私密金鑰匯出副本移入核准的託管邊界。此命令絕不會印出私密金鑰。

## 對等節點一致 {#peer-consistency}

所有驗證者都必須同意相同的創世交易,拓撲,可信賴的對等節點公鑰和驗證器 PoPs.一個缺失或不匹配的對等節點關鍵可以阻止網路啟動或達成共識.

為了達到最低的拜占庭錯誤耐受性,使用至少四個對等節點.每個對等節點必須有自己的私鑰,但每一個對等節點配置都需要相同的可靠的對等節點.

## 客戶帳戶 {#client-accounts}

在 `client.toml` 中的客戶帳戶必須已經存在在鏈上.它可以透過創世表或以後的交易進行註冊.避免使用創世簽字 作為長期應用帳戶的身份;創世特權僅適用於創世週期,生產客戶應該使用自己的帳戶和角色.
