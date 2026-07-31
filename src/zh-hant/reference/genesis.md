---
translation_locale: zh-hant
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 創世記的引用 {#genesis-reference}

在目前的情況下 Iroha 3 工作流程, `genesis.json` 顯示表述了第一
網路啟動時應用的交易和參數.

已簽署的文物, 分享給同行是 Norito- 已加密 `.nrt` 文件
由 `kagami genesis sign`.

## 主要領域 {#main-fields}

基因表可以定義:

- `chain` 對於連鎖識別子
- `executor` 選擇性執行器升級字段碼路徑
- `ivm_dir` 關於 IVM 啟動和升級使用的圖書館
- `consensus_mode` 在公告中宣傳的初始模式
- `transactions` 順序的參數更新,指令,啟動器和拓
- `crypto` 關於最初的加密快照

在內部 `transactions`, 標籤是對同類ID, PoPs 共同使用:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 發明一個宣言 {#generate-a-manifest}

使用 Kagami 建立一個模板:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

公開使用 SORA Nexus 數據空間, `npos` 是預期的共識模式.
其他 Iroha 3 部署可能使用授權或NPoS,
這樣的情況

## 簽署公告 {#sign-the-manifest}

在編輯和驗證後, JSON, 請將它寫成可部署的文件 `.nrt` 區塊:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` 閱讀出創世記公钥,
提供的私密鍵,種子和算法以生成可部署的簽名
該檔案是同行在設定中引用的檔案.

## 設定方式 `irohad` {#configure-irohad}

請指向已簽署的基因區塊:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## 有關工具 {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

請查看電源發電器的執行及命令詳情.
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
