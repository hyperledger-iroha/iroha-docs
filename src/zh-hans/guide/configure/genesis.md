---
translation_locale: zh-hans
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 创世记 {#genesis}

创世纪定义了初始链状态.可编辑的源是 JSON 表格,一个 Iroha 3 节点消耗了一个签署的 Norito 交易文件.

::: details 默认基因表

<<< @/snippets/genesis.json

:::

## 文件 {#files}

在 `defaults/genesis.json` 上游存储库中,输出目录中写入 Kagami 生成的网络自己的表格和签署交易:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

在该目录中生成的 `README.md`记录了选定的个人资料的精确文件和启动命令.

## 同龄人配置 {#peer-configuration}

在 `config.toml` 的 `[genesis]` 节中,同行指出签署的创始交易:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

网络中的所有同行必须同意签署的基因交易和基因公钥.

## 创世纪的签名 {#signing-genesis}

如果您手动编辑表格,在启动同行之前验证并签字:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

对于NPOS或 Nexus 个人资料,包括拓学和 BLS 根据生成的配置文件所要求的拥有证明. Kagami `localnet`, `wizard`, 配置文件生成命令将自动处理这些细节.

## 重复创世记 {#recommitting-genesis}

一个同行只会在存储空时进行生成.在一次性本地网中测试一个新的生成,停止同行,删除其生成的状态目录,并从新签署的生成开始.除非每个验证器协调相同的迁移,否则不要在运行的网络上替换基因.
