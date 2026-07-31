---
translation_locale: zh-hant
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 客戶端配置 {#client-configuration}

Iroha CLI 及其他 SDK 客戶使用 TOML 存儲庫將
在目前的默认 `defaults/client.toml`; 建立的本地網絡也寫出
匹配 `client.toml` 在他們的輸出目錄中.

::: details 客戶端配置模板

<<< @/snippets/client.template.toml

:::

## 核心領域 {#core-fields}

最少,一個客戶端配置會識別連鎖, Torii 目的地,以及
簽名帳戶:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` 選擇所提交交易的連鎖.
- `torii_url` 在等級的點數 Torii HTTP API.
- `[account].domain` 是由 CLI 快捷方式和地址選擇器編碼;
  經典 `AccountId` 沒有域名.
- `[account].public_key` 及其他 `[account].private_key` 簽署交易.

這個帳號必須在連鎖上已經存在.
這項計畫由聯合創世記錄處理.

::: info 病情敏感性

Iroha 經典解析後,這些名字對案例敏感.
`wonderland.universal`, `Wonderland.universal`, 及其他
`looking_glass.universal` 這兩種字母是不同的領域.

:::

## 基本認證 {#basic-authentication}

選擇性 `[basic_auth]` 這部分增加了: HTTP `Authorization` 標題為
客戶的要求. Iroha 沒有同行直接解讀這些憑證;
他們在什麼時候 Torii 這位部落客也表示,

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## 交易設定 {#transaction-settings}

交易行為是配置的 `[transaction]` 部分:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` 在毫秒內的交易壽命
- `status_timeout_ms` 控制客戶等待交易的時間
  國家的地位.
- `nonce = true` 要求客戶包含一項不經常的交易
  產生不同的哈希.

## 連接排列設定 {#connect-queue-settings}

目前 Iroha 客戶也可以使用可選的 `[connect]` 地方區
排隊狀態:

```toml
[connect]
queue_root = "./queue"
```

使用此時,工作流需要持久的客戶端排列存儲.

## 如何生成配置 {#generating-configurations}

選擇一次性本地網路, Kagami 因為它寫出匹配 Iroha
3 組圖,創世記,文字, README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

使用生成的 `./localnet/client.toml` 在這個情況下 CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
