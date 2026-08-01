---
translation_locale: zh-hans
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 创世记的引用 {#genesis-reference}

在当前的 Iroha 3 工作流中,一个 `genesis.json`说明描述了网络启动时将应用的第一笔交易和参数.

分发给同行的签名文物是 Norito 编码的`.nrt`文件,由 `kagami genesis sign`制作.

## 主要领域 {#main-fields}

一个基因表可以定义:

- `chain`用于链标识符
- `executor` 对于可选执行器升级字节码路径
- `ivm_dir`用于触发器和升级所使用的 IVM 库
- `consensus_mode` 在公告中宣传的初始模式
- `transactions` 对有序的参数更新,说明,触发器和拓
- `crypto` 对于最初的加密快照

在 `transactions` 里,拓类目录将同等标识和 PoPs 结合在一起:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 创造一个表现 {#generate-a-manifest}

使用 Kagami 来生成一个模板:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

对于公共 SORA Nexus 数据空间,`npos`是预期共识模式.其他 Iroha 3 部署可能根据目标配置文件使用授权或NPoS.

## 签署公告 {#sign-the-manifest}

在编辑和验证 JSON 后,将其签署到可部署的 `.nrt` 区块中:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign`从表格中读取创始公钥,并使用提供的私钥,种子和算法来生成可部署的签名区块.结果是同行应该从他们的配置引用的文件.

## 配置 `irohad` {#configure-irohad}

指向了签署的基因块:

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

对于发电机的实现和命令详情,请参阅 [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
