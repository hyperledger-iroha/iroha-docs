---
translation_locale: zh-hans
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 客户端配置 {#client-configuration}

Iroha CLI 并且 SDK 客户使用 TOML 存储库将运送
现在的默认 `defaults/client.toml`; 生成的本地网络也写一个
匹配 `client.toml` 在它们的输出目录中.

::: details 客户端配置模板

<<< @/snippets/client.template.toml

:::

## 核心领域 {#core-fields}

最少,一个客户端配置识别了链接, Torii 终点,以及
签字账户:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` 选择所提交交易属于的链.
- `torii_url` 在等级的点 Torii HTTP API.
- `[account].domain` 是由 CLI 快捷方式和地址选择器编码;
  圣经 `AccountId` 它本身是无域的.
- `[account].public_key` 并且 `[account].private_key` 签署交易.

对于默认的本地网络,这是
通过集成的基因表来处理.

::: info 案例敏感性

Iroha 根据法典分析,这些名字对案例敏感.
`wonderland.universal`, `Wonderland.universal`, 并且
`looking_glass.universal` 它们是不同的域字面.

:::

## 基本身份验证 {#basic-authentication}

选择性 `[basic_auth]` 部分添加一个 HTTP `Authorization` 标题到
客户的要求. Iroha 同龄人不直接解释这些凭证;使用
什么时候? Torii 像Nginx这样的反向代理.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## 交易设置 {#transaction-settings}

交易行为配置为 `[transaction]` 部分:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` 交易寿命在毫秒.
- `status_timeout_ms` 控制客户等待交易的时间
  情况.
- `nonce = true` 要求客户包括一个非如此重复的交易
  产生不同的哈希.

## 连接排列设置 {#connect-queue-settings}

电流 Iroha 客户也可以使用可选的 `[connect]` 地方部门
排队状态:

```toml
[connect]
queue_root = "./queue"
```

如果工作流需要持久的客户端排队存储时使用此方法.

## 生成配置 {#generating-configurations}

对于一次性本地网络,最好 Kagami 因为它写出匹配 Iroha
3 组合,创始,脚本和一个 README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

使用生成的 `./localnet/client.toml` 在 CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
