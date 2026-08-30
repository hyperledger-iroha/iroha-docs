---
translation_locale: zh-hans
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# 创世纪 {#genesis}

Genesis 定义了初始链状态。可编辑源是 JSON 显现，
和一个 Iroha 3 节点消耗一个签名的 Norito 交易文件。

::: details 默认创世清单

<<< @/snippets/genesis.json

:::

## 文件 {#files}

上游存储库在以下位置提供了默认清单 `defaults/genesis.json`.
Kagami-生成的网络将自己的清单和签名的交易写入
输出目录：

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

生成的 `README.md` 在该目录中记录确切的文件并启动
所选配置文件的命令。

## 对等配置 {#peer-configuration}

节点指向已签名的创世交易 `[genesis]` 的部分
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

网络中的所有节点必须就已签名的创世交易和
创世公钥。

## 签署创世纪 {#signing-genesis}

如果您手动编辑清单，请在启动对等点之前验证并对其进行签名：

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` 必须是业主持有模式-`0600`, 单链接
包含一个规范私钥多重哈希和最终的常规文件
换行符。 Kagami 拒绝符号链接并且从不接受原始创世私有
命令行上的键。

对于 NPoS 或 Nexus 配置文件，包括拓扑和 BLS 所有权证明
生成的配置文件所需的。 Kagami `localnet`, `wizard`, 和简介
生成命令会自动处理这些细节。

## 重新承诺创世纪 {#recommitting-genesis}

节点仅在其存储为空时才提交创世。测试新的起源
一次性本地网，停止对等点，删除其生成的状态目录，
并从新签署的创世开始。不要在运行时替换 genesis
网络，除非每个验证者都协调相同的迁移。
