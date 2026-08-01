---
translation_locale: zh-hans
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决整合问题 {#troubleshooting-integration-issues}

这个节目提供了解决问题的建议 Iroha 3 如果您所遇到的问题不详细介绍,请通过 [电报](https://t.me/hyperledgeriroha).

## 客户端无法连接 {#client-cannot-connect}

检查客户端配置是否指向同行的 Torii 地址:

```toml
torii_url = "http://127.0.0.1:8080/"
```

对于 CLI 检查,明确传递相同的文件:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

如果同行走进 Docker 或Kubernetes,使用客户端进程可访问的主机或服务地址. `127.0.0.1` 在容器内,不是主机.

对于公共测试 Taira,开始使用未签名的终点探测器:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

如果这些命令失败于 `502`, TLS,DNS 或截止时间错误,请修复网络可访问性或等待公共测试网端点才能调整帐户密钥或交易有效负载.

## 交易被拒绝 {#transactions-are-rejected}

大多数交易失败是由身份或授权不匹配造成的:

- 客户端配置中的帐户公钥不匹配签名所使用的私钥
- 账户没有在创始或之前的交易中注册
- 账户缺乏运行时间验证器所要求的许可令牌或角色
- 一个域名 ID 缺乏其数据空间资格,例如 `domain.dataspace`

使用 `--output-format text` 在调试 CLI 命令时,以便更容易读取错误:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## 查询返回空结果 {#queries-return-empty-results}

查询结果并不总是意味着查询失败.

- 应创建对象的交易已发生
- 被查询的域名,资产定义或账户 ID 是法定.
- 页面化或过器不排除预期行
- 客户端连接到预期网络,而不是另一个本地网

对于域名检查,请从最广泛的查询开始:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 事件或区块流早点停止 {#event-or-block-streams-stop-early}

区块和事件流的示例依赖于 Torii 流媒体终端点. 检查同行仍然运行,然后使用时间限测试:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

对于 HTTP 集成,将端点路径与当前的 [Torii 端点引用](/zh-hans/reference/torii-endpoints.md)进行比较.
