---
translation_locale: zh-hant
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 客戶端配置 {#client-configuration}

Iroha CLI 和 SDK 客戶使用 TOML 儲存庫將當前的預設設定傳送到 `defaults/client.toml`; 建立的本地網路也會寫出匹配 `client.toml` 在它們的輸出目錄中.

::: details 客戶端配置模板

<<< @/snippets/client.template.toml

:::

## 核心領域 {#core-fields}

至少,客戶端配置識別鏈, Torii 端點和簽字帳戶:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain`選擇所提交交易屬於的鏈.
- `torii_url`點在對等節點 Torii HTTP API.
- `[account].domain`是由 CLI 快捷方式和地址選擇器編碼所使用的;規範 `AccountId`本身是無域名.
- `[account].public_key`和`[account].private_key`簽署交易.

帳戶必須已經在鏈上存在.對於預設的本地網路,這是由捆綁的創世表處理的.

::: info 案例敏感性

Iroha 在規範解析後,這些名字對案例敏感. `wonderland.universal`, `Wonderland.universal`, 和 `looking_glass.universal` 它們是不同的字型.

:::

## 基本身份驗證 {#basic-authentication}

可選的 `[basic_auth]` 部分將 HTTP `Authorization` 標題新增到客戶端請求中. Iroha 對等節點不直接解釋這些憑證;在 Torii 在像Nginx這樣的反向代理後使用時,使用它們.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## 交易設定 {#transaction-settings}

交易行為設定為 `[transaction]`部分:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms`是數毫秒的交易壽命.
- `status_timeout_ms` 控制客戶等待交易狀態的時間.
- `nonce = true` 要求客戶包含 nonce，使重複交易產生不同的雜湊.

## 連線排列設定 {#connect-queue-settings}

目前的 Iroha 客戶端也可以使用可選的 `[connect]` 部分進行本地佇列狀態:

```toml
[connect]
queue_root = "./queue"
```

如果工作流需要持久的客戶端排隊儲存時,請使用此方法.

## 建立配置 {#generating-configurations}

對於一次性本地網路,更喜歡 Kagami 因為它寫出匹配的 Iroha 3 配置,創世,指令碼和 README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

使用生成的 `./localnet/client.toml`與 CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
