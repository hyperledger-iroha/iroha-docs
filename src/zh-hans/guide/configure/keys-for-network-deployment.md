---
translation_locale: zh-hans
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 网络部署的关键 {#keys-for-network-deployment}

每个网络都需要针对客户,对等节点,创世签名和NPoS或 Nexus 个人资料, BLS 验证者身份.

## 用钥匙的地方 {#where-keys-are-used}

- 客户签名密钥存储在 `client.toml`下 `[account]`.
- 每个对等节点身份密钥 `config.toml` 存储为 `public_key`和 `private_key`.
- 在 `trusted_peers` 中,对等节点发现使用每个对等节点的公钥.
- BLS 验证器 NPoS配置文件的所有权证明存储在 `trusted_peers_pop` 中.
- 在签署表时,Genesis签字使用`[genesis].public_key`在对等节点配置中和相匹配的私钥.

在本地或测试部署中,让 Kagami 将所有这些文件生成在一起:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

对于现有网络或配置文件,使用导向流程:

```bash
cargo run --bin kagami -- wizard
```

## 创建单个关键对 {#generate-individual-key-pairs}

使用 `kagami keys` 生成独立的密钥材料：

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

对于 BLS 验证器密钥材料，还要包含持有证明：

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

仅在创建可复现的开发测试数据时，才将 `--seed-hex` 与长度恰好为 32 字节的十六进制秘密值一起使用。生产部署中应省略该选项，让 Kagami 使用操作系统的随机源，然后将未加密的私钥导出副本移入获准的托管边界。该命令绝不会打印私钥。

## 对等节点一致 {#peer-consistency}

所有验证者都必须同意相同的创世交易,拓扑,可信赖的对等节点公钥和验证器 PoPs.一个缺失或不匹配的对等节点关键可以阻止网络启动或达成共识.

为了达到最低的拜占庭错误耐受性,使用至少四个对等节点.每个对等节点必须有自己的私钥,但每一个对等节点配置都需要相同的可靠的对等节点.

## 客户账户 {#client-accounts}

在 `client.toml` 中的客户帐户必须已经存在在链上.它可以通过创世表或以后的交易进行注册.避免使用创世签字 作为长期应用帐户的身份;创世特权仅适用于创世周期,生产客户应该使用自己的账户和角色.
