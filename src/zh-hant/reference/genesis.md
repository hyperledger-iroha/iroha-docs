---
translation_locale: zh-hant
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 創世記參考 {#genesis-reference}

在當前 Iroha 3 工作流程，一個 `genesis.json` 清單描述了第一個 網路啟動時將套用的事務和引數。

分發給同級的簽章工件是 Norito-編碼的 `.nrt` 檔案 生產者 `kagami genesis sign`.

## 主要領域 {#main-fields}

創世清單可以定義：

- `chain` 對於鏈識別符號
- `chain_discriminant`：指定清單內帳戶文字值編碼所用的 I105 網路前綴
- `executor` 對於可選的執行程式升級位元組碼路徑
- `ivm_dir` 為了 IVM 觸發器和升級使用的函式庫
- `consensus_mode` 對於清單所公佈的初始模式
- `wire_protocol_version`：首個發布版本的共識傳輸協定版本
- `consensus_fingerprint`：共識參數的選用型別化指紋，JSON 清單會明確宣告此欄位
- `transactions` 用於有序引數更新、指令、觸發器和拓撲
- `sumeragi_context`：指定簽署的 Sumeragi 高度脈絡參數
- `crypto_admission_policy`：指定鏈明確准入的簽署與控制器演算法，列於 `allowed_algorithms`

之內 `transactions`, 拓樸條目對對等 ID 和 PoPs 一起：

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 產生清單 {#generate-a-manifest}

使用 Kagami 產生範本。請依標準遞增順序，為每個准入的演算法重複傳入 `--allowed-signing`；Kagami 不會補上省略的演算法：

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

公開的 SORA Nexus 資料空間預期使用 `npos` 共識模式。其他 Iroha 3 部署則可依目標設定檔採用許可制或 NPoS。

## 簽約艙單 {#sign-the-manifest}

編輯並驗證後 JSON, 將其簽署到可部署的 `.nrt` 堵塞：

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` 從由擁有者保管、硬連結數為 1 的一般檔案中的私鑰衍生創世金鑰對，以產生可部署的簽名區塊。傳入 `--expected-public-key` 可要求其與已發布的創世公鑰相符。該檔案必須包含一個規範的私鑰 multihash，後接一個換行符；Kagami 拒絕符號連結以及權限模式不是 `0600` 的檔案。命令列不接受原始私鑰。產生的檔案就是對等節點應在設定中引用的檔案。

## 配置 `iroha3d` {#configure-iroha3d}

請為常駐程式指定簽署的創世區塊，以及固定其預期雜湊的檔案。`kagami genesis sign --expected-hash-out` 會寫入該檔案；節點在首次啟動與重新啟動時都需要它：

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## 相關工具 {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

有關生成器的實現和命令詳細資訊，請參閱 [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
