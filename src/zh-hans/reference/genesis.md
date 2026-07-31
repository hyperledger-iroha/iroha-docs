---
translation_locale: zh-hans
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 创世记 {#genesis-reference}

在当前 Iroha 3 工作流程 `genesis.json` 宣言描述了第一个
当网络启动时将应用的交易和参数.

签署的文物, 分发给同龄人是 Norito- 编码 `.nrt` 文件
由 `kagami genesis sign`.

## 主要领域 {#main-fields}

一个基因表可以定义:

- `chain` 对链标识符
- `executor` 为可选执行器升级字节码路径
- `ivm_dir` 对于 IVM 触发器和升级所使用的库
- `consensus_mode` 在公告中宣传的初始模式
- `transactions` 对有序的参数更新,说明,触发器和拓
- `crypto` 对于最初的加密快照

在内 `transactions`, 顶级条目对同行ID和 PoPs 一起:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 创造一个表现 {#generate-a-manifest}

使用 Kagami 为生成一个模板:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

为了公众 SORA Nexus 数据空间, `npos` 是预期的共识模式.
其他 Iroha 3 部署可能使用允许或NPoS,取决于目标
个人资料.

## 签署宣言 {#sign-the-manifest}

在编辑和验证后, JSON, 签署到可部署的 `.nrt` 区块:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` 阅读出本文公开关键的表格和使用
提供的私钥,种子和算法来生成可部署的签名
结果是同行应该从他们的配置中引用的文件.

## 配置 `irohad` {#configure-irohad}

指向了签署的基因区块:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## 相关工具 {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

对于生成器的实现和命令详情,请参见
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
