---
translation_locale: zh-hant
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 創世記的引用 {#genesis-reference}

在當前的 Iroha 3 工作流中,一個 `genesis.json`說明描述了網絡啓動時將應用的第一筆交易和參數.

分發給同行的簽名文物是 Norito 編碼的`.nrt`文件,由 `kagami genesis sign`製作.

## 主要領域 {#main-fields}

一個基因表可以定義:

- `chain`用於鏈標識符
- `executor` 對於可選執行器升級字節碼路徑
- `ivm_dir`用於觸發器和升級所使用的 IVM 庫
- `consensus_mode` 在公告中宣傳的初始模式
- `transactions` 對有序的參數更新,說明,觸發器和拓
- `crypto` 對於最初的加密快照

在 `transactions` 裏,拓類目錄將同等標識和 PoPs 結合在一起:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 創造一個表現 {#generate-a-manifest}

使用 Kagami 來生成一個模板:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

對於公共 SORA Nexus 數據空間,`npos`是預期共識模式.其他 Iroha 3 部署可能根據目標配置文件使用授權或NPoS.

## 簽署公告 {#sign-the-manifest}

在編輯和驗證 JSON 後,將其簽署到可部署的 `.nrt` 區塊中:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign`從表格中讀取創始公鑰,並使用提供的私鑰,種子和算法來生成可部署的簽名區塊.結果是同行應該從他們的配置引用的文件.

## 配置 `irohad` {#configure-irohad}

指向了簽署的基因塊:

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

對於發電機的實現和命令詳情,請參閱 [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
