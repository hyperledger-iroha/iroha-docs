---
translation_locale: zh-hans
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决整合问题 {#troubleshooting-integration-issues}

本节提供了解决问题建议 Iroha 3 如果问题是
你正在经历的情况并未被描述在这里,
通过 [电报](https://t.me/hyperledgeriroha).

## 客户端无法连接 {#client-cannot-connect}

检查客户端配置指向同行的 Torii 地址:

```toml
torii_url = "http://127.0.0.1:8080/"
```

对于 CLI 检查,将相同的文件明确传递:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

如果同行走进 Docker 或Kubernetes,使用主机或服务地址
通过客户程序可访问. `127.0.0.1` 在容器内没有
接待机器.

公共服务 Taira 试验,开始于未签名的终点探测器:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

如果这些命令失败 `502`, TLS, DNS, 或时间过期错误,修复网络
在调试账户之前,可访问性或等待公共测试网端点
密钥或交易有效载荷.

## 交易被拒绝 {#transactions-are-rejected}

大多数交易失败是由身份或授权不匹配造成的:

- 客户端配置中的帐户公钥不匹配私钥
  用于签字
- 账户没有在创始或之前的交易中注册
- 账户缺乏运行时间所需的许可令牌或角色
  验证器
- 域名 ID 缺少数据空间资格,如
  `domain.dataspace`

使用 `--output-format text` 在调试过程中 CLI 命令使错误更容易
阅读:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## 查询返回空结果 {#queries-return-empty-results}

空查询结果并不总是意味着查询失败.

- 应创建对象的交易已发生
- 查询域名,资产定义或账户 ID 是法典的
- 页面化或过器不排除预期行
- 客户端连接到预期网络,而不是其他本地网络

对于域名检查,从最广泛的查询开始:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 事件或区块流早点停止 {#event-or-block-streams-stop-early}

区块和事件流的例子依赖于 Torii 查看
测试时间:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

对于 HTTP 结合,比较您的终点路径与电流
[Torii 终点参考](/zh-hans/reference/torii-endpoints.md).
