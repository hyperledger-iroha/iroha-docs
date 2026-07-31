---
translation_locale: ja
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 匿名取引 {#anonymous-transactions}

Iroha における匿名取引は,機密資産運用から構築される.公共の金額で公的な口座から口座への転送を書き込む代わりに,財布は価値をシールドレジャーに移転し,その後ゼロ知識証明を持つ不透明なメモを費やします.

公的なレジーは依然として機密操作が起こったことを記録しています. 約束,無効化,証明ハッシュ,およびイベントを記録しますが,メモ所有者,受信者,またはシールドからシールドへの移動の金額は記録されません.通常のトランザクション封筒では,提出するアカウントがまだ公開される可能性があるため,ここで"匿名性"とは,ネットワークレベルまたは口座レベルでの自動的な匿名性ではなく,匿名の資産移動を意味する.

## 建築物 {#building-blocks}

|概念|レジャー表示 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|保護されたメモ|資産,金額,所有者データ,ランダム性を含むプライベート財布記録.|
|コミットメント|フィールドを明らかにせずにメモにコミットする32バイトの公開値です.|
|無効化 |Iroha は,二重支出を防ぐために繰り返し無効化することを拒否する. |
|メークルルーツ|資産のコミットメントツリーの 最近の根です 証拠は使った紙幣が存在することを示すために使用します|
|証明装置|証明バイトと検証キー参照またはインライン確認キーを含む `ProofAttachment`. |
|機密事件|`ConfidentialEvent::Shielded`,`Transferred`,または `Unshielded`のような本簿事件. |

主要な指示は:

- `RegisterZkAsset`:資産を ZK - 能力のあるものと登録し,転送,シールド,および非シールドの検証キーを結合します.
- `Shield`:公共の余分を借入し,保護されたメモの約束を追加する.
- `ZkTransfer`: 保護証券を新しい保護証券へのコミットメントに費やす.
- `Unshield`: 保護された紙幣を消費し,公共口座の余分をクレジットする.
- `ScheduleConfidentialPolicyTransition`および `CancelConfidentialPolicyTransition`:管理を通じて資産の機密政策を変更する.

資産定義には [`AssetConfidentialPolicy`](/ja/reference/data-model-schema.md)も含まれています.流動が有効であるポリシーモードの制御は:

|モード|意味|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly`|普通の公共のバランスと移転のみが受け入れられる.|
|`Convertible`|ユーザは,公共のバランスとシールド・ノートの間に値を移動することができる. |
|`ShieldedOnly`|資産の発行と移転は,保護された本簿に留まなければならない.|

## どう 使うか {#how-to-use-them}

1. 検証者ノードにおける機密サポートを有効にする.验证者は,検証者のバックエンド,アクティブの検証キー,ポセイドン/ペデッセンパラメータ IDs,および機密規則バージョンについて合意しなければならない.ノードは非一致する機密機能のダイジェストを持つピアまたはブロックを拒否する.
2. サーキットで使用される検証キーとパラメータセットを公開または登録する.ウォレットおよびオペレーターは `VerifyingKeyId` で鍵を参照する必要があります,例えば `halo2/ipa:vk_transfer`.
3. 資産を登録する ZK- 能力がある `RegisterZkAsset`, 政策の移行を `TransparentOnly` について `Convertible` または `ShieldedOnly`.
4. `Shield`で公共の資金を保護する.財布は,取引を提出する前に受信者にメモコミットメントと暗号化された役に立たない荷物を作成します.
5. `ZkTransfer`でプライベートに転送する.財布は入力メモを所有し,入力と出力値はバランスを取っていて,消費されたすべてのメモが最近のコミットメントツリーに固定されていることを証明します.
6. `Unshield`は,公的な金額と受領者口座を明らかにし,プライベートノート無効化器を費やし,プライベート変更出力を作成することができます.
7. Torii エンドポイントで,機密事件,証明記録,無効者状態および匿名のエスクロー記録を読み取ることで監査.

## CLI 例 {#cli-examples}

ZK CLI コマンドは,オペレーターおよびテストフロー向けである.生成財布は,結果となる指示を提出する前に,財布/試算庫でコミットメント,暗号化された役に立たない荷物,証明を作成する必要があります.

ハイブリッド ZK 資産の登録:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

保護されたメモのためにバージョンの暗号化された用荷包を作成する:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

資産の保護された本簿に公開資金を保存する:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

JSON 防具付きのアンシールド:

```bash
cat > unshield-proof.json <<'JSON'
{
  "backend": "halo2/ipa",
  "proof_b64": "BASE64_PROOF_BYTES",
  "vk_ref": {
    "backend": "halo2/ipa",
    "name": "vk_unshield"
  }
}
JSON

iroha app zk unshield \
  --asset <asset-definition-id> \
  --to <account-id> \
  --amount 1000 \
  --inputs DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF \
  --proof-json unshield-proof.json
```

## SDK 例 {#sdk-example}

正確な証明バイトは設定された証明バックエンドから来ます.トランザクションの役に立たない負荷は,公開入力と証明添付のみを必要とします:

```rust
use iroha_data_model::{
    isi::zk::{Unshield, ZkTransfer},
    prelude::{AccountId, AssetDefinitionId, InstructionBox},
    proof::{ProofAttachment, ProofBox, VerifyingKeyId},
};

fn transfer_instruction(
    asset: AssetDefinitionId,
    input_nullifier: [u8; 32],
    output_commitment: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_transfer");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    ZkTransfer::new(
        asset,
        vec![input_nullifier],
        vec![output_commitment],
        attachment,
        Some(anchor_root),
    )
    .into()
}

fn unshield_instruction(
    asset: AssetDefinitionId,
    recipient: AccountId,
    amount: u128,
    input_nullifier: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_unshield");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    Unshield::new(
        asset,
        recipient,
        amount,
        vec![input_nullifier],
        attachment,
        Some(anchor_root),
    )
    .into()
}
```

## アナノミスト・アセット エスクロー {#anonymous-asset-escrow}

アナノミア・アセット・エスクローは,エスクローの価値に対して同じシールド・トランスフォーメーションマシンを使用します.当事者とエスクローの状態はまだエスクロー記録に記されていますが,資金提供,リリース,キャンセル,および決済の足には,シールド・ナリファイヤーと出力コミットメントを使用しています.

詳細なエスクロー ISI の行動と例については, [ネイティブ・アセット エスクロー](/ja/blockchain/escrow.md#anonymous-escrow)を参照してください.

生命周期は:

1. `OpenAnonymousAssetEscrow`は保護された資金債券を費やし,エスクローの約束を1つ作ります.
2. `AcceptAnonymousAssetEscrow` 購入者を記録する
3. `MarkAnonymousEscrowPaymentSent`は,購入者が支給をオフチェーンで送ったことを記録している.
4. `ReleaseAnonymousAssetEscrow`は,エスクローのコミットメントを購入者の出荷へのコミットメントに費やします.
5. `CancelAnonymousAssetEscrow`は,支払いがマークされていない場合,エスクローの約束を売り手の出荷コミットメントに返します.
6. `OpenAnonymousEscrowDispute`と `ResolveAnonymousEscrowDispute`は,証拠ハッシュおよび解決者制御された分割による論争の的担保を処理する.

[查询](/ja/reference/queries.md#escrow-and-proof-records)に記載されている匿名のエスクロー問い合わせを使用して,エスクロー記録とステータスを検査します.

## 数学 {#math}

以下の記号は,機密資産流程を記述しています.実装では,資産ポリシーおよび検証者レジストリからのアクティブ回路とパラメータ IDs を使用しているため,クライアントはコミットメント,無効化,証明バイトを財布/proverの不透明輸出として扱うべきです.

保護されたメモは,次のように記述できます.

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

`owner`は受領者の閲覧または支出資料から得られ,および `rho`はランダム性である.

ノートの約束は 隠れた約束だ

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

現在の機密転送回路では,公的な入力にはノートコミットメント,無効化器,メルケルルーツ,アセットタグ,チェーンタグが含まれています.この回路はこのような形式のコミットメント関係を強制します:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

紙幣が消耗されると,財布は無効化符を出す.

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` は公開されています. 紙幣を明らかにしませんが,その紙幣と鎖に安定しているため, Iroha は同じ無効化符で2度目の支出を拒否することができます.

コミットメントツリーはメモの存在を証明する.財布がコミットメント `C_i` を費やしている場合,証明には `C_i` から最近の公開ルートまでのプライベート・メルクル経路が含まれます:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

保護されたものから保護されたものへの移転の場合,証明書はまた価値の保存を強制します.

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

保護されていない場合,公的金額は以下のとおりです.

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

提出された証拠は以下の形でまとめられます.

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

`public_inputs`は,コミットメント,無効化,ルーツ,資産タグ,チェーンタグ,およびすべての公開未保護金額である.目撃者は,ノート額,ランダム性,支出材料,メルケル経路を含む.バリダーターは,出力コミットメントを追加し,入力無効化符を費やされたようにマークすることによって証明を確認し,その後レジスタ状態を変異します.

## 公衆 に 公開 さ れ て いる もの {#what-is-public}

匿名取引は,観察可能なすべての事実を秘密にするわけではありません.以下のデータは依然として公開することができます:

- 取引ハッシュ,ブロック高度,注文
- 提出するトランザクション当局は,申請がプライベートエントリーポイントまたはリレーラーパターンを使用しない限り
- 運用されている資産定義
- 無効化および出力コミットメント
- 証明ハッシュ,検証鍵参照およびオプションの包装ハッシュ
- `Unshield`に関する公的な金額と受領者口座
- アノニメス・エスクローセラー,買い手,ステータス,タイムスタンプ,証拠ハッシュ

この公共のメタデータは 保護しようとしているビジネス関係を明らかにしないように アプリケーションをデザインします

## 関連参照 {#related-reference}

- [`AssetConfidentialPolicy`](/ja/reference/data-model-schema.md)
- [`ConfidentialEvent`](/ja/reference/data-model-schema.md)
- [`ProofAttachment`](/ja/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/ja/reference/data-model-schema.md)
- [担保と証明の問い合わせ](/ja/reference/queries.md#escrow-and-proof-records)
