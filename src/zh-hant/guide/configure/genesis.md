---
translation_locale: zh-hant
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# 創世紀 {#genesis}

Genesis 定義了初始鏈狀態。可編輯來源是 JSON 顯現， 和一個 Iroha 3 節點消耗一個簽名的 Norito 交易檔案。

::: details 預設創世清單

<<< @/snippets/genesis.json

:::

## 檔案 {#files}

上游儲存庫在以下位置提供了預設清單 `defaults/genesis.json`. Kagami-產生的網路將自己的清單和簽署的交易寫入 輸出目錄：

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

產生的 `README.md` 在該目錄中記錄確切的檔案並啟動 所選設定檔的命令。

## 對等配置 {#peer-configuration}

節點指向已簽署的創世交易 `[genesis]` 的部分 `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

網路中的所有對等節點都必須就已簽署的創世交易和創世公鑰達成一致。

## 簽署創世紀 {#signing-genesis}

如果您手動編輯清單，請在啟動對等點之前驗證並對其進行簽名：

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` 必須是由擁有者保管的一般檔案，許可權模式為 `0600` 且硬連結數為 1；檔案內容必須是一個規範的私鑰 multihash，末尾帶換行符。Kagami 拒絕符號連結，且絕不接受透過命令列傳入的原始創世私鑰。

對於 NPoS 或 Nexus 配置檔案，包括拓撲和 BLS 所有權證明 生成的配置檔案所需的。 Kagami `localnet`, `wizard`, 和簡介 產生命令會自動處理這些細節。

## 重新承諾創世紀 {#recommitting-genesis}

節點僅在其儲存為空時才提交創世。測試新的起源 一次性本地網，停止對等點，刪除其產生的狀態目錄， 並從新簽署的創世開始。請勿在執行時替換 genesis 網路，除非每個驗證者都協調相同的遷移。
