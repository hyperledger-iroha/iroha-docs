---
translation_locale: zh-hant
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 重量多位數 {#weighted-multisig}

## 結果 {#outcome}

在 Taira 上註冊3個成員權重多籤帳戶,提出一個後設資料指令,以足夠的權重來批准該帳戶,並從多籤賬單狀態檢查執行.

## 預先條件 {#prerequisites}

- 三種規範 I105 簽字者 IDs 在 `SIGNER_A`, `SIGNER_B`, 和 `SIGNER_C`.
- 為簽署者A和C提供資金的 Taira 配置. 提出者和每個批准者都為自己的交易付費.
- CLI 寫入使用 `--fee-payer authority`；CLI 會在簽署前給出以 Taira 費用資產計價的確切費用報價。
- 用於註冊階段的 Rust 客戶端專案，依賴 `iroha` 和 `iroha_model_base`，並固定到與 Taira 相同的 Iroha 原始碼修訂版。後續的提案和批准階段使用 CLI。
- 現行執行程式的多簽名功能已啟用.普通帳戶可以在預設 Iroha 3 執行階段內進行註冊,儘管 Taira 政策和收費仍然適用於;如果公眾部署拒絕使用 localnet.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## 步驟 {#steps}

### 1. 註冊權重政策 {#_1-register-a-weighted-policy}

簽署者 C 的權重為 2；A 和 B 的權重各為 1。因此，法定人數 3 需要 C 加上 A 或 B。這裡的 `registrar` 是一個 `iroha::blocking::Client`，其 `submit` 會等待 Applied 最終性。在註冊前，從該確切的政策推導出規範帳戶，然後將相同的值傳給 `MultisigRegister::with_account`：

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

儲存 CLI 步驟的列印值:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

在固定的提交中，CLI 註冊命令會在執行階段為其重新設定金鑰之前列印其臨時種子。不要將該種子重複用作控制器。不存在控制器私鑰：多簽權限只來自已批准的提案。若要改用 CLI 註冊，請將由政策推導出的值傳給 `ledger multisig register --account`。

### 2. 編寫一個指令,而不是提交它 {#_2-build-one-instruction-without-submitting-it}

全域 `--emit-instructions` 開關會將指令陣列列印到標準輸出，而不是提交它，因此不會花費任何費用。

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. 作為簽名者提出A {#_3-propose-as-signer-a}

提議者會自動貢獻自己的權重。產生一個新的提案 nonce，並在任何重試時保留它。記錄 CLI 列印的提案 ID 和指令雜湊；批准會同時繫結這兩者。

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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust 客戶端可以繼續使用同一個由政策推導出的帳戶，以及上面使用的兩個生命週期指令。每個簽署者客戶端都是一個 `iroha::blocking::Client`；提案 ID 由客戶端的網路、多簽帳戶和一個新的 nonce 推導而來：

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

## 驗證 {#verify}

閱讀後報,並確認該提案不再在待定:

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

後設資料值必須是 `"approved"`，所記錄的提案 ID 和指令雜湊必須不再顯示為待處理，而檢查到的控制器必須顯示 `threshold` `3`、`total_weight` `4`，以及成員權重 1、1 和 2；成員按公鑰順序列出。

## 解決問題 {#troubleshooting}

- `not qualified to propose multisig` 或 `not qualified to approve multisig` 表示提議或批准的客戶端不對應於政策中註冊的任一 I105 ID。
- 如果多簽名帳戶沒有執行建議的指令的許可,最終批准可以被拒絕. 授權多簽名帳戶,而不是僅僅給其單個簽署者,然後讓剩餘簽署者再次嘗試.
- 找不到待處理的提案，可能表示已達到法定人數、TTL 已過期，或使用了錯誤的提案 ID、指令雜湊或帳戶選擇器。在使用新的 nonce 再次提議之前，請先查詢事後狀態。
- 重複核准不會增加權重。每個已註冊簽署者最多貢獻一次其設定的權重。
- 直接簽署正常交易,因為控制者是禁止的.總是使用 `MultisigPropose`和 `MultisigApprove`.
- 如果後來的命令無法找到在 CLI 註冊過程中列印的帳戶,則您已經捕獲了臨時種子. 從訂單的政策中取出規範帳戶並以上圖所示的值註冊.

## 來源及相關檔案 {#source-and-related-docs}

- [在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)上進行多位一體化測試
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)的多位資料模型
- [CLI multisig 實現在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [交易](/zh-hant/blockchain/transactions.md)
- [許可證和角色](./permissions-and-roles.md)
