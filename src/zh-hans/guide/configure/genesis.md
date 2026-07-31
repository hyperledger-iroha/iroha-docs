---
translation_locale: zh-hans
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 创世纪 {#genesis}

编辑的来源是 JSON 显明,
一个 Iroha 3 节点消耗一个签名 Norito 交易文件.

::: details 默认生成表

<<< @/snippets/genesis.json

:::

## 文件 {#files}

上游存储器将默认的表格发送到 `defaults/genesis.json`.
Kagami-生成的网络将自己的明示和签名交易写入
输出目录:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

产生的 `README.md` 在那个目录中记录了精确的文件和启动
选定的配置文件的命令.

## 同龄人配置 {#peer-configuration}

经过签署的创始交易 `[genesis]` 部分
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

网络中的所有同行必须同意签署的创始交易和
基因公钥.

## 创世纪的签名 {#signing-genesis}

如果您手动编辑明示,在启动同行之前验证并签署:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

对于NPoS或 Nexus 个人资料,包括拓学和 BLS 持有证据
由生成的配置文件所要求. Kagami `localnet`, `wizard`, 和个人资料
生成命令自动处理这些细节.

## 重复创世记 {#recommitting-genesis}

一个同行只会在储存空时进行生成.
一个可丢弃的本地网络,停止同行,删除它们生成的状态目录,
开始从新的签名基因. 不要在运行上取代基因
网络,除非每个验证器都协调相同的迁移.
