---
translation_locale: zh-hans
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 重量多位数 {#weighted-multisig}

## 结果 {#outcome}

在 Taira 上注册3个成员权重多签账户,提出一个元数据指令,以足够的权重来批准该帐户,并从多签账单状态检查执行.

## 预先条件 {#prerequisites}

- 三种规范 I105 签字者 IDs 在 `SIGNER_A`, `SIGNER_B`, 和 `SIGNER_C`.
- 为签署者A和C提供资金的 Taira 配置. 提出者和每个批准者都为自己的交易付费.
- CLI 写入使用 `--fee-payer authority`；CLI 会在签名前给出以 Taira 费用资产计价的确切费用报价。
- 用于注册阶段的 Rust 客户端项目，依赖 `iroha` 和 `iroha_model_base`，并固定到与 Taira 相同的 Iroha 源代码修订版。后续的提案和批准阶段使用 CLI。
- 现行执行程序的多签名功能已启用.普通账户可以在默认 Iroha 3 运行时内进行注册,尽管 Taira 政策和收费仍然适用于;如果公众部署拒绝使用 localnet.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## 步骤 {#steps}

### 1. 注册权重政策 {#_1-register-a-weighted-policy}

签名者 C 的权重为 2；A 和 B 的权重各为 1。因此，法定人数 3 需要 C 加上 A 或 B。这里的 `registrar` 是一个 `iroha::blocking::Client`，其 `submit` 会等待 Applied 最终性。在注册前，从该确切的政策推导出规范账户，然后将相同的值传给 `MultisigRegister::with_account`：

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigProposalId, MultisigProposalNonce,
        MultisigPropose, MultisigRegister, MultisigSpec,
    },
};
use iroha_model_base::domain::DomainId;

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

registrar.submit::<InstructionBox>(
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

在固定的提交中，CLI 注册命令会在运行时为其重新设置密钥之前打印其临时种子。不要将该种子重复用作控制器。不存在控制器私钥：多签权限只来自已批准的提案。若要改用 CLI 注册，请将由政策推导出的值传给 `ledger multisig register --account`。

### 2. 编写一个指令,而不是提交它 {#_2-build-one-instruction-without-submitting-it}

全局 `--emit-instructions` 开关会将指令数组打印到标准输出，而不是提交它，因此不会花费任何费用。

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. 作为签名者提出A {#_3-propose-as-signer-a}

提议者会自动贡献自己的权重。生成一个新的提案 nonce，并在任何重试时保留它。记录 CLI 打印的提案 ID 和指令哈希；批准会同时绑定这两者。

```bash
PROPOSAL_NONCE="$(openssl rand -hex 32)"
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    ledger multisig propose \
    --proposal-nonce "$PROPOSAL_NONCE" \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

PROPOSAL_ID="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^proposal_id: //p' |
    head -n 1
})"
INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$PROPOSAL_ID"
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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust 客户端可以继续使用同一个由政策推导出的账户，以及上面使用的两个生命周期指令。每个签名者客户端都是一个 `iroha::blocking::Client`；提案 ID 由客户端的网络、多签账户和一个新的 nonce 推导而来：

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
// A fresh nonzero nonce, for example from `openssl rand -hex 32`.
let proposal_nonce: MultisigProposalNonce = "<FRESH_64_HEX_NONCE>".parse()?;
let proposal_id = MultisigProposalId::derive(
    signer_a_client.client().network_id(),
    &multisig_account,
    &proposal_nonce,
);
signer_a_client.submit::<InstructionBox>(
    MultisigPropose::new(
        multisig_account.clone(),
        proposal_nonce,
        instructions,
        None,
    )
    .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit::<InstructionBox>(
    MultisigApprove::new(multisig_account, proposal_id, instructions_hash)
        .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## 验证 {#verify}

阅读后报,并确认该提案不再在待定:

```bash
iroha --config "$SIGNER_A_CONFIG" account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

元数据值必须是 `"approved"`，所记录的提案 ID 和指令哈希必须不再显示为待处理，而检查到的控制器必须显示 `threshold` `3`、`total_weight` `4`，以及成员权重 1、1 和 2；成员按公钥顺序列出。

## 解决问题 {#troubleshooting}

- `not qualified to propose multisig` 或 `not qualified to approve multisig` 表示提议或批准的客户端不对应于政策中注册的任一 I105 ID。
- 如果多签名账户没有执行建议的指令的许可,最终批准可以被拒绝. 授权多签名帐户,而不是仅仅给其单个签署者,然后让剩余签署者再次尝试.
- 找不到待处理的提案，可能表示已达到法定人数、TTL 已过期，或使用了错误的提案 ID、指令哈希或账户选择器。在使用新的 nonce 再次提议之前，请先查询事后状态。
- 重复批准不会增加权重。每个已注册签名者最多贡献一次其配置的权重。
- 直接签署正常交易,因为控制者是禁止的.总是使用 `MultisigPropose`和 `MultisigApprove`.
- 如果后来的命令无法找到在 CLI 注册过程中打印的帐户,则您已经捕获了临时种子. 从订单的政策中取出规范账户并以上图所示的值注册.

## 来源及相关文件 {#source-and-related-docs}

- [在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)上进行多位一体化测试
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)的多位数据模型
- [CLI multisig 实现在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [交易](/zh-hans/blockchain/transactions.md)
- [许可证和角色](./permissions-and-roles.md)
