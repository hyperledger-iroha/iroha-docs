---
translation_locale: zh-hant
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 重量多位數 {#weighted-multisig}

## 結果 {#outcome}

在 Taira 上註冊3個成員權重多籤帳戶,提出一個後設資料指令,以足夠的權重來批准該帳戶,並從多籤賬單狀態檢查執行.

## 預先條件 {#prerequisites}

- 三種規範 I105 簽字者 IDs 在 `SIGNER_A`, `SIGNER_B`, 和 `SIGNER_C`.
- 為簽署者A和C提供資金的 Taira 配置. 提出者和每個批准者都為自己的交易付費.
- `taira.tx-metadata.json`從當前的水龍頭響應中構建,從未從複製費資產 ID 中構建.
- 一個 Rust 客戶端專案,用於註冊階段與 Taira 相同的 Iroha 源修改.後續的提案和批准階段使用 CLI.
- 現行執行程式的多簽名功能已啟用.普通帳戶可以在預設 Iroha 3 執行階段內進行註冊,儘管 Taira 政策和收費仍然適用於;如果公眾部署拒絕使用 localnet.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## 步驟 {#steps}

### 1. 註冊權重政策 {#_1-register-a-weighted-policy}

簽字元C的重量為2;A和B的重量各為1.因此,3的定數需要C加上A或B.在註冊前從該準則中匯出規範賬號,然後將相同值傳遞到 `MultisigRegister::with_account`:

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

儲存 CLI 步驟的列印值:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

在固定提交時, CLI 註冊命令在執行階段重新設定之前列印其臨時種子.不要再使用該種子作為控制器.沒有控制器私鑰:多簽證許可權僅來自批准的提案.

### 2. 編寫一個指令,而不是提交它 {#_2-build-one-instruction-without-submitting-it}

全球 `-o` 交換器將指令陣列序列到標準輸出. 它不提交交易,因此沒有費用.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. 作為簽名者提出A {#_3-propose-as-signer-a}

提議者自動貢獻自己的權重.捕獲按 CLI 列印的準確指令雜湊;批准與該雜湊繫結.

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

列出尚未提出的提案,並使用明確的有限選項:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. 作為簽名人C的批准 {#_4-approve-as-signer-c}

A的重量1加 C的重量2達到3號和執行擬議的指令作為多簽字帳戶.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust 客戶可以繼續使用相同的政策衍生帳戶和上述使用的兩個生命週期指令:

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

## 驗證 {#verify}

閱讀後報,並確認該提案不再在待定:

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

轉移資料值必須是: `"approved"`, 捕獲的指令雜湊必須不再顯示為懸而未決,並且檢查控制器必須顯示重量 `1, 1, 2` 透過定製 `3`.

## 解決問題 {#troubleshooting}

- `signatory is not part of multisig` 表示提出或批准的客戶不符合保險中註冊的 I105 IDs 中的一個.
- 如果多簽名帳戶沒有執行建議的指令的許可,最終批准可以被拒絕. 授權多簽名帳戶,而不是僅僅給其單個簽署者,然後讓剩餘簽署者再次嘗試.
- 缺失待定的提議可能意味著已經達到了許可權, TTL 已過期,或者使用了錯誤的指令雜湊/帳戶選擇器. 在再次提議之前,請查詢後狀態.
- 重複核准不會增加權重。每個已註冊簽署者最多貢獻一次其設定的權重。
- 直接簽署正常交易,因為控制者是禁止的.總是使用 `MultisigPropose`和 `MultisigApprove`.
- 如果後來的命令無法找到在 CLI 註冊過程中列印的帳戶,則您已經捕獲了臨時種子. 從訂單的政策中取出規範帳戶並以上圖所示的值註冊.

## 來源及相關檔案 {#source-and-related-docs}

- [在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)上進行多位一體化測試
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)的多位資料模型
- [CLI multisig 實現在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [交易](/zh-hant/blockchain/transactions.md)
- [許可證和角色](./permissions-and-roles.md)
