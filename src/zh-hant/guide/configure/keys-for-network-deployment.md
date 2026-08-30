---
translation_locale: zh-hant
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 網絡部署的關鍵 {#keys-for-network-deployment}

每個網絡都需要針對客戶,同行,創始簽名和NPoS或 Nexus 個人資料, BLS 驗證者身份.

## 用鑰匙的地方 {#where-keys-are-used}

- 客戶簽名密鑰存儲在 `client.toml`下 `[account]`.
- 每個同行身份密鑰 `config.toml` 存儲爲 `public_key`和 `private_key`.
- 在 `trusted_peers` 中,同行發現使用每個同行的公鑰.
- BLS 驗證器 NPoS配置文件的所有權證明存儲在 `trusted_peers_pop` 中.
- 在簽署表時,Genesis簽字使用`[genesis].public_key`在同行配置中和相匹配的私鑰.

在本地或測試部署中,讓 Kagami 將所有這些文件生成在一起:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

對於現有網絡或配置文件,使用導向流程:

```bash
cargo run --bin kagami -- wizard
```

## 創建單個關鍵對 {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## 同齡人一致 {#peer-consistency}

所有驗證者都必須同意相同的創始交易,拓學,可信賴的同行公鑰和驗證器 PoPs.一個缺失或不匹配的同行關鍵可以阻止網絡啓動或達成共識.

爲了達到最低的拜占庭錯誤耐受性,使用至少四個同齡人.每個同行必須有自己的私鑰,但每一個同行配置都需要相同的可靠的同行.

## 客戶賬戶 {#client-accounts}

在 `client.toml` 中的客戶帳戶必須已經存在在鏈上.它可以通過基因表或以後的交易進行註冊.避免使用基因簽字 作爲長期應用帳戶的身份;基因特權僅適用於基因週期,生產客戶應該使用自己的賬戶和角色.
