---
translation_locale: zh-hans
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 重量多位数 {#weighted-multisig}

## 结果 {#outcome}

在 Taira 上注册3个成员权重多签账户,提出一个元数据指令,以足够的权重来批准该帐户,并从多签账单状态检查执行.

## 预先条件 {#prerequisites}

- 三种法典 I105 签字者 IDs 在 `SIGNER_A`, `SIGNER_B`, 和 `SIGNER_C`.
- 为签署者A和C提供资金的 Taira 配置. 提出者和每个批准者都为自己的交易付费.
- `taira.tx-metadata.json`从当前的水龙头响应中构建,从未从复制费资产 ID 中构建.
- 一个 Rust 客户端项目,用于注册阶段与 Taira 相同的 Iroha 源修改.后续的提案和批准阶段使用 CLI.
- 现行执行程序的多签名功能已启用.普通账户可以在默认 Iroha 3 运行时间内进行注册,尽管 Taira 政策和收费仍然适用于;如果公众部署拒绝使用 localnet.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## 步骤 {#steps}

### 1. 注册权重政策 {#_1-register-a-weighted-policy}

签字符C的重量为2;A和B的重量各为1.因此,3的定数需要C加上A或B.在注册前从该准则中导出正规账号,然后将相同值传递到 `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigPropose, MultisigRegister, MultisigSpec,
    },
};

let spec = MultisigSpec::new(
    BTreeMap::from([
        (signer_a.clone(), 1),
        (signer_b.clone(), 1),
        (signer_c.clone(), 2),
    ]),
    NonZeroU16::new(3).unwrap(),
    NonZeroU64::new(3_600_000).unwrap(),
);
let members = spec
    .signatories
    .iter()
    .map(|(account, weight)| {
        let key = account
            .controller()
            .single_signatory()
            .expect("multisig members must be single-key accounts");
        MultisigMember::new(key.clone(), u16::from(*weight))
            .expect("weights are nonzero")
    })
    .collect();
let policy = MultisigPolicy::new(spec.quorum.get(), members)?;
let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(
    multisig_account.clone(),
    None::<DomainId>,
    spec,
);

registrar.submit_blocking::<InstructionBox>(
    register.into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
println!("{}", multisig_account.canonical_i105()?);
```

保存 CLI 步骤的打印值:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

在固定提交时, CLI 注册命令在运行时间重新设置之前打印其临时种子.不要再使用该种子作为控制器.没有控制器私钥:多签证权限仅来自批准的提案.

### 2. 编写一个指令,而不是提交它 {#_2-build-one-instruction-without-submitting-it}

全球 `-o` 交换器将指令阵列串行到标准输出. 它不提交交易,因此没有费用.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. 作为签名者提出A {#_3-propose-as-signer-a}

提议者自动贡献自己的权重.捕获按 CLI 打印的准确指令哈希;批准与该哈希绑定.

```bash
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger multisig propose \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$INSTRUCTIONS_HASH"
```

列出尚未提出的提案,并使用明确的有限选项:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. 作为签名人C的批准 {#_4-approve-as-signer-c}

A的重量1加 C的重量2达到3号和执行拟议的指令作为多签字账户.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust 客户可以继续使用相同的政策衍生账户和上述使用的两个生命周期指令:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
signer_a_client.submit_blocking::<InstructionBox>(
    MultisigPropose::new(multisig_account.clone(), instructions, None).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit_blocking::<InstructionBox>(
    MultisigApprove::new(multisig_account, instructions_hash).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## 验证 {#verify}

阅读后报,并确认该提案不再在待定:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

转移数据值必须是: `"approved"`, 捕获的指令哈希必须不再显示为悬而未决,并且检查控制器必须显示重量 `1, 1, 2` 通过定制 `3`.

## 解决问题 {#troubleshooting}

- `signatory is not part of multisig` 表示提出或批准的客户不符合保险中注册的 I105 IDs 中的一个.
- 如果多签名账户没有执行建议的指令的许可,最终批准可以被拒绝. 授权多签名帐户,而不是仅仅给其单个签署者,然后让剩余签署者再次尝试.
- 缺失待定的提议可能意味着已经达到了权限, TTL 已过期,或者使用了错误的指令哈希/帐户选择器. 在再次提议之前,请查询后状态.
- 复制批准不增加重量.每名注册签署者至少一次贡献其配置的重量.
- 直接签署正常交易,因为控制者是禁止的.总是使用 `MultisigPropose`和 `MultisigApprove`.
- 如果后来的命令无法找到在 CLI 注册过程中打印的帐户,则您已经捕获了临时种子. 从订单的政策中取出正规账户并以上图所示的值注册.

## 来源及相关文件 {#source-and-related-docs}

- [在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)上进行多位一体化测试
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)的多位数据模型
- [CLI multisig 实现在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [交易](/zh-hans/blockchain/transactions.md)
- [许可证和角色](./permissions-and-roles.md)
