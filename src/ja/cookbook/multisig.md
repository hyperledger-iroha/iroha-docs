---
translation_locale: ja
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 重み付きマルチシグ {#weighted-multisig}

## 結果 {#outcome}

Taira で三人委任の加重マルチシグアカウントを登録し、メタデータ指示を提案し、定足数を満たすのに十分な重みで承認し、マルチシグアカウントの状態から実行を確認します。

## 前提条件 {#prerequisites}

- 3つの正格な I105 署名者IDは、`SIGNER_A`、`SIGNER_B`、および`SIGNER_C`です。
- 暗号署名者AおよびCのために Taira の設定に資金を提供しました。提案者とすべての承認者はそれぞれ自分の取引の費用を支払います。
- `taira.tx-metadata.json` は、複製された手数料資産IDからではなく、現在のテストネット資金提供サービスの応答から構築されます。
- 登録ステップのために、Taira と同じ Iroha ソースリビジョンに固定された Rust クライアントプロジェクト。後の提案および承認ステップでは CLI を使用します。
- 現在の実行者のマルチシグ機能が有効になっています。登録はデフォルトの Iroha 3 ソフトウェアランタイムで通常のアカウントが可能ですが、Taira のポリシーと手数料の適用は引き続き有効です。公開デプロイで拒否される場合は、ローカルネットを使用してください。

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## ステップ {#steps}

### 1. 重み付きポリシーを登録する {#_1-register-a-weighted-policy}

暗号署名者Cの重みは2、AとBの重みはそれぞれ1です。したがって、3の定足数にはCとAまたはBのいずれかが必要です。登録前にその正確なポリシーから標準アカウントを導出し、同じ値を`MultisigRegister::with_account`に渡してください。

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

CLI ステップの印刷された値を保存してください:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

固定されたソースコードのリビジョンでは、CLI 登録コマンドはソフトウェア実行時にキーを再生成する前に一時的なシードを出力します。そのシードをコントローラーとして再利用しないでください。コントローラーの秘密鍵は存在しません：マルチシグ認可の主体は承認された提案からのみ発生します。

### 2. 提出せずに1つの指示を作成する {#_2-build-one-instruction-without-submitting-it}

グローバル`-o`スイッチは、命令配列を標準出力にシリアライズします。トランザクションを送信しないため、手数料はかかりません。

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. 暗号署名者Aとして提案する {#_3-propose-as-signer-a}

提案者は自動的に自分自身の重みを寄付します。CLI に表示された正確な指示の暗号ハッシュをキャプチャしてください。承認はその暗号ハッシュに拘束されます。

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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust クライアントは、同じポリシー由来のアカウントおよび上記で使用された2つのライフサイクル指示を使って続行できます:

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

## 確認する {#verify}

事後の状態を読み取り、提案がもはや保留中でないことを確認してください：

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

メタデータの値は`"approved"`でなければならず、取得された命令の暗号ハッシュはもはや保留として表示されてはいけません。また、検査されたコントローラーは、重み`1, 1, 2`と定足数`3`を示す必要があります。

## トラブルシューティング {#troubleshooting}

- `signatory is not part of multisig` は、提案または承認するクライアントが、ポリシーに登録されている I105 ID のいずれにも該当しないことを意味します。
- 提案された指示を実行する権限がマルチシグアカウントにない場合、最終承認は拒否されることがあります。権限を個々の暗号署名者にだけでなく、マルチシグアカウント自体に付与し、その後残りの暗号署名者に再試行させてください。
- 欠落している保留中の提案は、すでに定足数が達していた、TTL が期限切れになった、または誤った命令ハッシュ/アカウントセレクタが使用されたことを意味する可能性があります。再度提案する前に、ポストステートを照会してください。
- 重複した承認は重みを加えません。各登録済み署名者は、設定された重みを最大でも一度だけ寄与します。
- コントローラーとして通常のトランザクションに直接署名することは禁止されています。必ず `MultisigPropose` と `MultisigApprove` を使用してください。
- もし後のコマンドが CLI 登録時に表示されたアカウントを見つけられない場合、あなたは一時的なシードを取得しました。順序付けられたポリシーから正規のアカウントを導出し、上記のようにその値で登録してください。

## ソースと関連ドキュメント {#source-and-related-docs}

- [固定されたソースコードのリビジョンでのマルチシグ統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [ピン留めされたソースコードのリビジョンにおけるマルチシグデータモデル](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI ピン留めされたソースコードのリビジョンでのマルチシグ実装](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [取引](/ja/blockchain/transactions.md)
- [権限と役割](./permissions-and-roles.md)
