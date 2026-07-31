---
translation_locale: zh-hans
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 网络部署的关键 {#keys-for-network-deployment}

每个网络都需要不同的关键材料,
和,对于NPoS或 Nexus 个人资料, BLS 验证者身份.

## 用钥匙的地方 {#where-keys-are-used}

- 客户签名密钥存储在 `client.toml` 下面 `[account]`.
- 每个同龄人身份密钥都存储在每个同龄人中 `config.toml` 作为 `public_key` 并且
  `private_key`.
- 随时使用每一个同行的公钥 `trusted_peers`.
- BLS 验证器所有权证明存储在 `trusted_peers_pop` 对于NPOS
  个人资料.
- 创世记签字使用 `[genesis].public_key` 在同龄化和
  在签署公开文件时与私钥相匹配.

对于本地或测试部署,让 Kagami 将所有这些文件一起生成:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

在现有网络或配置文件中,使用指导流程:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## 创建单个关键对 {#generate-individual-key-pairs}

使用 `kagami keys` 对于独立的关键材料:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

对于 BLS 验证器材料,包括持有证明:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

使用 `--seed` 仅适用于可复制的发展装置.
部署,生成新密钥和存储私有密钥在库外.

## 同龄人一致 {#peer-consistency}

所有验证者都必须同意相同的基因交易,拓,可信
同等公开密钥和验证器 PoPs. 一个缺失或不匹配的同行钥匙可以
防止网络启动或达成共识.

为了实现最小的拜占庭错误耐受性,至少使用四个同龄人.
每个同行必须有自己的私钥,但每个同行配置都需要相同的
一个值得信赖的同龄人.

## 客户账户 {#client-accounts}

客户账户 `client.toml` 它们可能已经在链上存在.
在本文或以后的交易中注册.
基因签名身份作为长期应用账户;基因特权
只有在产生的周期内适用,生产客户应使用自己的
账户和角色.
