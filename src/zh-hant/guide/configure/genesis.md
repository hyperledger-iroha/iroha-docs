---
translation_locale: zh-hant
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 創世記 {#genesis}

編輯的來源是 JSON 顯示,
和一個 Iroha 3 節點使用簽名 Norito 交易檔案.

::: details 預設基因表

<<< @/snippets/genesis.json

:::

## 文件 {#files}

預設地址: `defaults/genesis.json`.
Kagami 該網站將其自行寫入,
输出目錄:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

產生的 `README.md` 在該目錄中記錄正確的檔案,
選取的配置文件的命令.

## 同級人的設定 {#peer-configuration}

該組織的同行指出, `[genesis]` 該部分
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

該組織的所有同行必須同意簽署的創始交易,
基因公開鍵.

## 創世記的簽名 {#signing-genesis}

如果您手動編輯明示,

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

適用於 NPoS 或 Nexus 該項目包括對象和 BLS 擁有證據
由生成的配置文件所要求. Kagami `localnet`, `wizard`, 及個人形象
該命令自動處理這些細節.

## 恢復創世記 {#recommitting-genesis}

只有在儲存空時才會進行創新.
停止同行,取消他們生成的國家目錄,
並從新簽名的基因開始.
除非每個驗證器都協調相同的遷移.
