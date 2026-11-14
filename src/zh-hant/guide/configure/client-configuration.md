---
translation_locale: zh-hant
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 客戶端配置 {#client-configuration}

Iroha CLI 和 SDK 客戶使用 TOML 儲存庫將當前的預設設定傳送到 `defaults/client.toml`; 建立的本地網路也會寫出匹配 `client.toml` 在它們的輸出目錄中.

::: details 客戶端配置模板

<<< @/snippets/client.template.toml

:::

## 核心領域 {#core-fields}

用戶端設定至少須指定鏈、其網路身分、Torii 端點、帳戶的網路脈絡，以及簽署金鑰：

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain`選擇所提交交易屬於的鏈.
- `network_id` 是由創世資料衍生、每個簽署請求都會綁定的網路身分。請在 `network_id` 與 `network_id_file` 之間恰好設定其中一項；節點會透過 `GET /v1/accounts/capabilities` 公布此值。
- `torii_url`點在對等節點 Torii HTTP API.
- `[account].chain_discriminant` 選擇網路的 I105 帳戶前綴。公開網路也可改用 `[account].profile = "taira"` 或 `"minamoto"`。兩種選擇方式必須設定其中一種；標準 `AccountId` 本身不含網域。
- `[account].public_key` 與 `[account].private_key` 用於簽署交易；`private_key_file` 可取代 `private_key`。

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

`iroha` CLI 也會讀取選用的 `[connect]` 區段，以處理本機佇列狀態。可重複使用的 SDK 設定則不接受這個區段：

```toml
[connect]
queue_root = "./queue"
```

當流程需要用戶端的持久佇列儲存時，請使用此設定。`connect.queue_root` 預設為 `~/.iroha/connect`；相對路徑以用戶端 TOML 檔案所在目錄為基準解析。

## 建立配置 {#generating-configurations}

對於一次性本地網路,更喜歡 Kagami 因為它寫出匹配的 Iroha 3 配置,創世,指令碼和 README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

使用生成的 `./localnet/client.toml`與 CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
