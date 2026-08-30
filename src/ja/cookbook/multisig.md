---
translation_locale: ja
translation_source: /cookbook/multisig.md
translation_source_hash: 9654923faf6c84dfd21a428ebe3c53dbd074b8e3274c12c8aa41bf31884686f7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 重いマルチシグ {#weighted-multisig}

## 成果 {#outcome}

Taira で3人の重量型マルチシグアカウントを登録し,メタデータ指示を提案し,クォーラムを満たすために十分な重量で承認し,マルチシッグ口座の状態から実行を確認する.

## 必須条件 {#prerequisites}

- 3つの法典 I105 署名者 IDs 中 `SIGNER_A`, `SIGNER_B`, そして `SIGNER_C`.
- 署名者 A と C のための資金提供された Taira コンフィギュレーション.提案者と承認者それぞれが自分の取引を支払う.
- `taira.tx-metadata.json`は,現在の faucet 応答から構築され,決してコピーされた料金資産 ID から作られていません.
- Rust クライアントプロジェクトは,登録段階において Taira と同じ Iroha ソース修正に固定されている.後の提案および承認段階では, CLI を使用する.
- 現行の実行者のマルチシグ機能が有効です.登録はデフォルト Iroha 3 ランタイムで通常のアカウントに利用できますが, Taira ポリシーと料金の入荷はまだ適用されます.公共の展開がそれを拒否した場合,ローカルネットを使用します.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## ステップ {#steps}

### 1.重量化政策を登録する {#_1-register-a-weighted-policy}

記号Cは2重;AとBは1重.3のクオラムでは,Cを加えてAまたはBが必要である.登録前にその正確なポリシーから正規説明を導き出し,同じ値を `MultisigRegister::with_account` に渡す:

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

CLI のステップで印刷された値を保存する.

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

CLI 登録コマンドは,実行時に再設定される前に一時的な種子を印刷します.その種子をコントローラーとして再利用しないでください.コントローラプライベートキーはありません.マルチシグ権限は承認された提案からのみ得られます.

### 2. 指示 を 提出 し て も 一 つ の 命令 を 作る {#_2-build-one-instruction-without-submitting-it}

グローバル `-o` スイッチは,指示配列を標準出力にシリアライズします.取引を提出しませんので,手数料を払いません.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. 署名者として提案する A {#_3-propose-as-signer-a}

提案者は自動的に自己負担をします. CLI で印刷された正確な指示ハッシュを捕まえ;承認はそのハッシュに結合する.

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

まだ待機中の提案を明示的に限定した選択器でリストする.

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. 署名者として承認 C {#_4-approve-as-signer-c}

A の重量 1 + C の重量 2 はクオラム 3 に達し,提案された指示をマルチシグアカウントとして実行します.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust クライアントは,同じポリシーによる口座と上記2つのライフサイクルの指示を継続することができる.

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

提案がもう待機していないことを確認します

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

メタデータ値は `"approved"` でなければならないし,キャプテッドされた指示ハッシュはもはや待機として表示されなくなり,検査されたコントローラは重量 `1, 1, 2` をクオラム `3` と表示しなければならない.

## 問題を解く {#troubleshooting}

- `signatory is not part of multisig`とは,提案または承認するクライアントがポリシーに登録されている I105 IDs の1つと一致しないことを意味します.
- マルチシグアカウントが提案された指示を実行する許可がない場合,最終的な承認は拒否される.マルチシグ口座に権限を与え,個々の署名者だけでなく,残りの署名者に再試させます.
- TTL が終了した,または誤った指示ハッシュ/アカウント選択者が使用されたことを意味する. 再提案する前にポストステートに問いかけます.
- 複製の承認は重量を加えません.登録した署名者は最大で1回だけ設定された重量を提供します.
- 管理者として通常の取引を直接署名することは禁止されています.常に `MultisigPropose`と `MultisigApprove`を使用します.
- CLI 登録中に印刷されたアカウントが見つからない場合,あなたは一時的なシードを捕まえた.注文したポリシーからカノニカルアカウントを誘導し,上記の値で登録します.

## ソースおよび関連文書 {#source-and-related-docs}

- [固定された commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)でマルチシグ統合テスト
- [固定された commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs) のマルチシグデータモデル
- [CLI マルチシグ実装 ピン commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [取引](/ja/blockchain/transactions.md)
- [許可と役割](./permissions-and-roles.md)
