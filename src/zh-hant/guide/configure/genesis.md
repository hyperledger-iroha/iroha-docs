---
translation_locale: zh-hant
translation_source: /guide/configure/genesis.md
translation_source_hash: 2a4a43b6ac873cc0c860631e307e52b047ba6a08691bf3e4c5872cc22c81a0bd
translation_status: machine-validated
translation_engine: google-translate+reviewed-delta+reviewed-first-release-source-amendment
---
# 創世紀 {#genesis}

Genesis 定義了初始鏈狀態。可編輯來源是 JSON 顯現， 和一個 Iroha 3 節點消耗一個簽名的 Norito 交易檔案。

::: details 預設創世來源範本（defaults/genesis.template.json）

<<< @/snippets/genesis.json

:::

## 檔案 {#files}

上游儲存庫在 `defaults/genesis.template.json` 提供預設來源範本。範本尚不完整，必須先由 `kagami genesis materialize` 轉成清單，才能驗證、簽署或供節點使用。Kagami 產生的網路會將自己的清單與簽署交易寫入輸出目錄：

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

產生的 `README.md` 在該目錄中記錄確切的檔案並啟動 所選設定檔的命令。

## 對等配置 {#peer-configuration}

對等節點在 `config.toml` 的 `[genesis]` 區段指定簽署的創世交易，並以獨立檔案固定其預期雜湊：

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

網路中的所有對等節點都必須使用相同的簽署創世交易與創世公鑰。每次啟動（無論是首次啟動或重新啟動）都需要預期雜湊：請在 `expected_hash_file` 與內嵌的 `expected_hash` 中恰好設定其中一個。`kagami genesis sign --expected-hash-out` 會寫入該檔案。

## 簽署創世紀 {#signing-genesis}

如果您手動編輯清單，請在啟動對等點之前驗證並對其進行簽名：

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` 必須是由擁有者保管的一般檔案，許可權模式為 `0600` 且硬連結數為 1；檔案內容必須是一個規範的私鑰 multihash，末尾帶換行符。Kagami 拒絕符號連結，且絕不接受透過命令列傳入的原始創世私鑰。

每個簽署的創世資料，無論是許可制或 NPoS，都必須包含恰好 `3f + 1` 個驗證者的拓撲，並為每個驗證者提供 BLS 持有證明。Kagami 的 `localnet generate`、`wizard` 和 `sora-network generate` 命令會自動處理這些細節。

## 重新承諾創世紀 {#recommitting-genesis}

新的網路從其已簽署的創世資料開始執行。若要在可拋棄的本機網路中測試不同的創世資料，請先停止對等節點，刪除其產生的狀態目錄，再以新簽署的創世資料啟動。執行中的網路絕不能以替換創世資料作為升級機制。協定定義的變更需要由治理控制的選擇轉換，並針對所選定的定義與義務完成資格驗證。
