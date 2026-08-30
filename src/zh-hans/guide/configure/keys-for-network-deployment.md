---
translation_locale: zh-hans
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 网络部署的关键 {#keys-for-network-deployment}

每个网络都需要针对客户,同行,创始签名和NPoS或 Nexus 个人资料, BLS 验证者身份.

## 用钥匙的地方 {#where-keys-are-used}

- 客户签名密钥存储在 `client.toml`下 `[account]`.
- 每个同行身份密钥 `config.toml` 存储为 `public_key`和 `private_key`.
- 在 `trusted_peers` 中,同行发现使用每个同行的公钥.
- BLS 验证器 NPoS配置文件的所有权证明存储在 `trusted_peers_pop` 中.
- 在签署表时,Genesis签字使用`[genesis].public_key`在同行配置中和相匹配的私钥.

在本地或测试部署中,让 Kagami 将所有这些文件生成在一起:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

对于现有网络或配置文件,使用导向流程:

```bash
cargo run --bin kagami -- wizard
```

## 创建单个关键对 {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## 同龄人一致 {#peer-consistency}

所有验证者都必须同意相同的创始交易,拓学,可信赖的同行公钥和验证器 PoPs.一个缺失或不匹配的同行关键可以阻止网络启动或达成共识.

为了达到最低的拜占庭错误耐受性,使用至少四个同龄人.每个同行必须有自己的私钥,但每一个同行配置都需要相同的可靠的同行.

## 客户账户 {#client-accounts}

在 `client.toml` 中的客户帐户必须已经存在在链上.它可以通过基因表或以后的交易进行注册.避免使用基因签字 作为长期应用帐户的身份;基因特权仅适用于基因周期,生产客户应该使用自己的账户和角色.
