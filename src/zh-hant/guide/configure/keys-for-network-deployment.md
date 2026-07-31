---
translation_locale: zh-hant
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 網路部署的關鍵 {#keys-for-network-deployment}

每個網絡都需要不同的關鍵資料,
在 NPOS 或 Nexus 專案, BLS 證明人身份.

## 關鍵在哪裡使用 {#where-keys-are-used}

- 客戶簽名密碼存儲在 `client.toml` 在下 `[account]`.
- 每個同行存储的同行身份密钥 `config.toml` 這樣的 `public_key` 及其他
  `private_key`.
- 該網站使用每個同行的公開關鍵, `trusted_peers`.
- BLS 證據存儲在 `trusted_peers_pop` 對於 NPOS
  其他國家.
- 創世記簽名使用 `[genesis].public_key` 在同行聯盟和
  在簽署明細書時與私钥相匹配.

在本地或測試部署中, Kagami 將所有這些檔案共生成:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

在現有網路或配置文件中,使用導向流程:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## 建立個別的關鍵對 {#generate-individual-key-pairs}

使用 `kagami keys` 在獨立的關鍵材料上:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

於 BLS 核准材料,包括所有權證明:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

使用 `--seed` 僅適用於可複製的開發設備.
部署,生成新的關鍵和儲存私密關鍵在資料庫之外.

## 協調性 {#peer-consistency}

所有驗證者必須同意相同的基因交易,
公眾密钥和验证器 PoPs. 單個缺失或不匹配的同行鍵可
阻止網路開啟或達到共識.

請使用至少四個同行.
每個同行設定都需要相同的密碼.
值得信賴的同行.

## 客戶帳號 {#client-accounts}

客戶的帳號在 `client.toml` 這種情況可能會發生.
請避免使用本文或其他文件.
基因簽名身份作為長期應用帳號;基因特權
只有在產生過程中使用,
該組織的帳戶和角色.
