---
translation_locale: zh-hans
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 客户端配置 {#client-configuration}

Iroha CLI 和 SDK 客户使用 TOML 存储库将当前的默认设置发送到 `defaults/client.toml`; 创建的本地网络也会写出匹配 `client.toml` 在它们的输出目录中.

::: details 客户端配置模板

<<< @/snippets/client.template.toml

:::

## 核心领域 {#core-fields}

至少,客户端配置识别链, Torii 终点和签字帐户:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain`选择所提交交易属于的链.
- `torii_url`点在同行 Torii HTTP API.
- `[account].domain`是由 CLI 快捷方式和地址选择器编码所使用的;正规 `AccountId`本身是无域名.
- `[account].public_key`和`[account].private_key`签署交易.

帐户必须已经在链上存在.对于默认的本地网络,这是由捆绑的基因表处理的.

::: info 案例敏感性

Iroha 在法典解析后,这些名字对案例敏感. `wonderland.universal`, `Wonderland.universal`, 和 `looking_glass.universal` 它们是不同的字体.

:::

## 基本身份验证 {#basic-authentication}

可选的 `[basic_auth]` 部分将 HTTP `Authorization` 标题添加到客户端请求中. Iroha 同龄人不直接解释这些凭证;在 Torii 在像Nginx这样的反向代理后使用时,使用它们.

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
- `nonce = true` 要求客户包含一个非如此重复的交易产生不同的哈希.

## 连接排列设置 {#connect-queue-settings}

目前的 Iroha 客户端也可以使用可选的 `[connect]` 部分进行本地队列状态:

```toml
[connect]
queue_root = "./queue"
```

如果工作流需要持久的客户端排队存储时,请使用此方法.

## 创建配置 {#generating-configurations}

对于一次性本地网络,更喜欢 Kagami 因为它写出匹配的 Iroha 3 配置,基因,脚本和 README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

使用生成的 `./localnet/client.toml`与 CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
