---
translation_locale: ja
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# 重み付きマルチシグ {#weighted-multisig}

## 結果 {#outcome}

Taira で三人委任の加重マルチシグアカウントを登録し、メタデータ指示を提案し、定足数を満たすのに十分な重みで承認し、マルチシグアカウントの状態から実行を確認します。

## 前提条件 {#prerequisites}

- 3つの正格な I105 署名者IDは、`SIGNER_A`、`SIGNER_B`、および`SIGNER_C`です。
- 暗号署名者AおよびCのために Taira の設定に資金を提供しました。提案者とすべての承認者はそれぞれ自分の取引の費用を支払います。
- CLI による書き込みでは `--fee-payer authority` を使用します。CLI は署名前に、Taira の手数料資産で表した正確な手数料の見積もりを提示します。
- 登録ステップのために、`iroha` と `iroha_model_base` に依存し、Taira と同じ Iroha ソースリビジョンに固定された Rust クライアントプロジェクト。後の提案および承認ステップでは CLI を使用します。
- 現在の実行者のマルチシグ機能が有効になっています。登録はデフォルトの Iroha 3 ソフトウェアランタイムで通常のアカウントが可能ですが、Taira のポリシーと手数料の適用は引き続き有効です。公開デプロイで拒否される場合は、ローカルネットを使用してください。

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## ステップ {#steps}

### 1. 重み付きポリシーを登録する {#_1-register-a-weighted-policy}

暗号署名者Cの重みは2、AとBの重みはそれぞれ1です。したがって、3の定足数にはCとAまたはBのいずれかが必要です。ここでの `registrar` は `iroha::blocking::Client` であり、その `submit` は適用済み（Applied）の確定まで待機します。登録前にその正確なポリシーから標準アカウントを導出し、同じ値を `MultisigRegister::with_account` に渡してください:

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

CLI ステップの印刷された値を保存してください:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

固定されたソースコードのリビジョンでは、CLI 登録コマンドはランタイムがキーを再生成する前に一時的なシードを出力します。そのシードをコントローラーとして再利用しないでください。コントローラーの秘密鍵は存在しません：マルチシグ認可の主体は承認された提案からのみ発生します。代わりに CLI から登録するには、ポリシーから導出した値を `ledger multisig register --account` に渡してください。

### 2. 提出せずに1つの指示を作成する {#_2-build-one-instruction-without-submitting-it}

グローバル `--emit-instructions` スイッチは、命令配列を送信する代わりに標準出力へ出力するため、手数料はかかりません。

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. 暗号署名者Aとして提案する {#_3-propose-as-signer-a}

提案者は自動的に自分自身の重みを寄与します。新しい提案ナンスを生成し、再試行に備えて保持してください。CLI に表示された提案 ID と指示の暗号ハッシュをキャプチャしてください。承認はその両方に結び付けられます。

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

明示的な有限セレクターを使って、まだ保留中の提案を一覧にしてください:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. 暗号署名者Cとして承認する {#_4-approve-as-signer-c}

Aの重み1とCの重み2が定足数3に達し、マルチシグアカウントとして提案された命令を実行します。

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust クライアントは、同じポリシー由来のアカウントおよび上記で使用された2つのライフサイクル指示を使って続行できます。各署名者のクライアントは `iroha::blocking::Client` であり、提案 ID はクライアントのネットワーク、マルチシグアカウント、および新しいナンスから導出されます:

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

## 確認する {#verify}

事後の状態を読み取り、提案がもはや保留中でないことを確認してください：

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

メタデータの値は`"approved"`でなければならず、取得された提案 ID と命令の暗号ハッシュはもはや保留として表示されてはいけません。また、検査されたコントローラーは `threshold` `3`、`total_weight` `4`、およびメンバーの重み 1、1、2 を示す必要があります。メンバーは公開鍵の順に一覧表示されます。

## トラブルシューティング {#troubleshooting}

- `not qualified to propose multisig` または `not qualified to approve multisig` は、提案または承認するクライアントが、ポリシーに登録されている I105 ID のいずれにも該当しないことを意味します。
- 提案された指示を実行する権限がマルチシグアカウントにない場合、最終承認は拒否されることがあります。権限を個々の暗号署名者にだけでなく、マルチシグアカウント自体に付与し、その後残りの暗号署名者に再試行させてください。
- 欠落している保留中の提案は、すでに定足数が達していた、TTL が期限切れになった、または誤った提案 ID、命令ハッシュ、アカウントセレクタが使用されたことを意味する可能性があります。新しいナンスで再度提案する前に、ポストステートを照会してください。
- 重複した承認は重みを加えません。各登録済み署名者は、設定された重みを最大でも一度だけ寄与します。
- コントローラーとして通常のトランザクションに直接署名することは禁止されています。必ず `MultisigPropose` と `MultisigApprove` を使用してください。
- もし後のコマンドが CLI 登録時に表示されたアカウントを見つけられない場合、あなたは一時的なシードを取得しました。順序付けられたポリシーから正規のアカウントを導出し、上記のようにその値で登録してください。

## ソースと関連ドキュメント {#source-and-related-docs}

- [固定されたソースコードのリビジョンでのマルチシグ統合テスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [ピン留めされたソースコードのリビジョンにおけるマルチシグデータモデル](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI ピン留めされたソースコードのリビジョンでのマルチシグ実装](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [取引](/ja/blockchain/transactions.md)
- [権限と役割](./permissions-and-roles.md)
