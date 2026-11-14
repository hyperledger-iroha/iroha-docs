---
translation_locale: zh-hans
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 客户端配置 {#client-configuration}

Iroha CLI 和 SDK 客户使用 TOML 存储库将当前的默认设置发送到 `defaults/client.toml`; 创建的本地网络也会写出匹配 `client.toml` 在它们的输出目录中.

::: details 客户端配置模板

<<< @/snippets/client.template.toml

:::

## 核心领域 {#core-fields}

客户端配置至少应指定链、网络身份、Torii 端点、账户的网络上下文及签名密钥：

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain`选择所提交交易属于的链.
- `network_id` 是从创世配置派生的网络身份，每个已签名请求都与其绑定。必须且只能配置 `network_id` 或 `network_id_file` 之一；节点通过 `GET /v1/accounts/capabilities` 公布该值。
- `torii_url`点在对等节点 Torii HTTP API.
- `[account].chain_discriminant` 选择网络的 I105 账户前缀。公开网络也可改用 `[account].profile = "taira"` 或 `"minamoto"`。这两种方式必须选择其一，规范 `AccountId` 本身不包含域。
- `[account].public_key` 和 `[account].private_key` 签署交易；`private_key_file` 可以替代 `private_key`。

帐户必须已经在链上存在.对于默认的本地网络,这是由捆绑的创世表处理的.

::: info 案例敏感性

Iroha 在规范解析后,这些名字对案例敏感. `wonderland.universal`, `Wonderland.universal`, 和 `looking_glass.universal` 它们是不同的字体.

:::

## 基本身份验证 {#basic-authentication}

可选的 `[basic_auth]` 部分将 HTTP `Authorization` 标题添加到客户端请求中. Iroha 对等节点不直接解释这些凭证;在 Torii 在像Nginx这样的反向代理后使用时,使用它们.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## 交易设置 {#transaction-settings}

交易行为设置为 `[transaction]`部分:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms`是数毫秒的交易寿命.
- `status_timeout_ms` 控制客户等待交易状态的时间.
- `nonce = true` 要求客户包含 nonce，使重复交易产生不同的哈希.

## 连接排列设置 {#connect-queue-settings}

`iroha` CLI 还会读取可选的 `[connect]` 部分用于本地队列状态。可重用的 SDK 配置不接受它：

```toml
[connect]
queue_root = "./queue"
```

当工作流需要持久的客户端队列存储时使用此选项。`connect.queue_root` 默认为 `~/.iroha/connect`，相对路径从包含客户端 TOML 文件的目录解析。

## 创建配置 {#generating-configurations}

对于一次性本地网络,更喜欢 Kagami 因为它写出匹配的 Iroha 3 配置,创世,脚本和 README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

使用生成的 `./localnet/client.toml`与 CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
