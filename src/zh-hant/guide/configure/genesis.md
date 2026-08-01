---
translation_locale: zh-hant
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 創世記 {#genesis}

創世紀定義了初始鏈狀態.可編輯的源是 JSON 表格,一個 Iroha 3 節點消耗了一個簽署的 Norito 交易文件.

::: details 默認基因表

<<< @/snippets/genesis.json

:::

## 文件 {#files}

在 `defaults/genesis.json` 上游存儲庫中,輸出目錄中寫入 Kagami 生成的網絡自己的表格和簽署交易:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

在該目錄中生成的 `README.md`記錄了選定的個人資料的精確文件和啓動命令.

## 同齡人配置 {#peer-configuration}

在 `config.toml` 的 `[genesis]` 節中,同行指出簽署的創始交易:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

網絡中的所有同行必須同意簽署的基因交易和基因公鑰.

## 創世紀的簽名 {#signing-genesis}

如果您手動編輯表格,在啓動同行之前驗證並簽字:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

對於NPOS或 Nexus 個人資料,包括拓學和 BLS 根據生成的配置文件所要求的擁有證明. Kagami `localnet`, `wizard`, 配置文件生成命令將自動處理這些細節.

## 重複創世記 {#recommitting-genesis}

一個同行只會在存儲空時進行生成.在一次性本地網中測試一個新的生成,停止同行,刪除其生成的狀態目錄,並從新簽署的生成開始.除非每個驗證器協調相同的遷移,否則不要在運行的網絡上替換基因.
