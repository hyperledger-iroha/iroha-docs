---
translation_locale: zh-hant
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 創世記參考 {#genesis-reference}

在當前 Iroha 3 工作流程，一個 `genesis.json` 清單描述了第一個 網路啟動時將套用的事務和引數。

分發給同級的簽章工件是 Norito-編碼的 `.nrt` 檔案 生產者 `kagami genesis sign`.

## 主要領域 {#main-fields}

創世清單可以定義：

- `chain` 對於鏈識別符號
- `executor` 對於可選的執行程式升級位元組碼路徑
- `ivm_dir` 為了 IVM 觸發器和升級使用的函式庫
- `consensus_mode` 對於清單所公佈的初始模式
- `transactions` 用於有序引數更新、指令、觸發器和拓撲
- `crypto` 對於初始加密快照

之內 `transactions`, 拓樸條目對對等 ID 和 PoPs 一起：

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 產生清單 {#generate-a-manifest}

使用 Kagami 生成模板：

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

對於公眾 SORA Nexus 資料空間， `npos` 是預期的共識模式。 其他 Iroha 3 根據目標，部署可以使用許可或 NPoS 輪廓。

## 簽約艙單 {#sign-the-manifest}

編輯並驗證後 JSON, 將其簽署到可部署的 `.nrt` 堵塞：

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` 從清單讀取創世公鑰，並使用由擁有者保管、硬連結數為 1 的一般檔案中的私鑰來產生可部署的簽名區塊。該檔案必須包含一個規範的私鑰 multihash，後接一個換行符；Kagami 拒絕符號連結以及許可權模式不是 `0600` 的檔案。命令列不接受原始私鑰。產生的檔案就是對等節點應在設定中引用的檔案。

## 配置 `iroha3d` {#configure-iroha3d}

將守護程式指向已簽署的創世區塊：

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## 相關工具 {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

有關生成器的實現和命令詳細資訊，請參閱 [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
