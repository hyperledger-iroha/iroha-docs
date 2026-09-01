---
translation_locale: ja
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 匿名取引 {#anonymous-transactions}

Iroha における匿名取引は、機密資産操作から構築されます。公開された金額でのアカウント間転送を記録する代わりに、ウォレットは価値をシールドされたブロックチェーン台帳に移動し、その後、ゼロ知識証明を用いて不透明なノートを使用して支払います。

公開ブロックチェーンの元帳は、秘密の操作が行われたことを依然として記録しています。それは暗号的なコミットメント値、ヌリファイア、証明の暗号ハッシュ、およびイベントを記録しますが、シールド間の移動についてはノートの所有者、受取人、または金額を記録しません。通常の取引データコンテナは送信アカウントを依然として明らかにする可能性があるため、ここでの「匿名」とは、ネットワークレベルやアカウントレベルでの自動的な匿名性ではなく、資産の移動の匿名性を意味します。

## 積み木 {#building-blocks}

|コンセプト|ブロックチェーン台帳の表現|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|シールドされたノート|資産、金額、所有者データ、およびランダム性を含むプライベートウォレット記録。|
|暗号化コミットメント値|ノートのフィールドを明らかにすることなく、暗号学的にノートに結びつく32バイトの公開値。|
|無効化装置|ノートが使用されたときに導出される32バイトの公開値。Iroha は二重支払いを防ぐために、繰り返されるヌリファイアを拒否します。|
|マークルルート|資産の暗号コミットメント値ツリーの最近のルート。証明は、消費されたノートが存在することを示すためにそれを使用する。|
|証明書の添付|証明バイトと検証キーの参照またはインライン検証キーを含む `ProofAttachment`。|
|機密イベント|ブロックチェーン台帳のイベント、例えば `ConfidentialEvent::Shielded`、`Transferred`、または `Unshielded`。|

主な指示は次の通りです:

- `RegisterZkAsset`：資産を ZK 対応として登録し、転送、シールド、アンシールドの検証キーをバインドします。
- `Shield`：公開残高を借方計上し、シールド化されたノートの暗号コミットメント値を追加します。
- `ZkTransfer`: シールドされたノートを新しいシールドノートの暗号化コミットメント値に費やします。
- `Unshield`：保護されたノートを使用し、公共口座残高にクレジットする。
- `ScheduleConfidentialPolicyTransition` と `CancelConfidentialPolicyTransition`：ガバナンスを通じて資産の機密方針を変更する。

資産の定義には、…も含まれます [`AssetConfidentialPolicy`](/ja/reference/data-model-schema.md). ポリシーモードは、どのフローが有効かを制御します:

|モード|意味|
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` |通常の公共残高と送金のみが受け入れられます。|
| `Convertible`     |ユーザーは公開残高とシールドノートの間で価値を移動することができます。|
| `ShieldedOnly`    |資産の発行および移転は、シールドされたブロックチェーン台帳内に留まらなければなりません。|

## それらの使い方 {#how-to-use-them}

1. バリデータノードで機密サポートを有効にします。バリデータは、検証者バックエンド、アクティブな検証キー、Poseidon/PedersenパラメータID、および機密ルールのバージョンについて合意する必要があります。ノードは、機密機能の暗号ダイジェストが一致しないネットワークピアまたはブロックを拒否します。
2. 回路で使用された検証用鍵およびパラメータセットを公開または登録してください。ウォレットおよびオペレーターは、例えば`halo2/ipa:vk_transfer`のように`VerifyingKeyId`で鍵を参照する必要があります。
3. `RegisterZkAsset`で資産を ZK 対応として登録するか、`TransparentOnly`から`Convertible`または`ShieldedOnly`へのポリシー移行を段階的に行います。
4. 公的資金を`Shield`で保護します。ウォレットは、取引を送信する前に受信者のためのノート暗号化コミットメント値と暗号化ペイロードを作成します。
5. `ZkTransfer`とプライベートで送金します。ウォレットは、入力のノートを所有していること、入力と出力の値が釣り合っていること、および使用されたすべてのノートが最近の暗号コミットメント値ツリーに固定されていることを証明する証拠を作成します。
6. 資産ポリシーで許可されている場合にのみアンシールドしてください。`Unshield`は公開額と受取人アカウントを公開し、プライベートノートのヌリファイアを使用し、プライベートのおつり出力を作成できます。
7. タイプ入力によるクエリおよび Torii API エンドポイントを通じて、機密イベント、証拠記録、無効化状態、匿名エスクロー記録を読み取ることによる監査。

## CLI 例 {#cli-examples}

ZK CLI コマンドは、オペレーターおよびテストフロー向けに意図されています。本番用ウォレットは、生成された指示を送信する前に、ウォレット/証明者ライブラリを使用して暗号学的コミットメント値、暗号化されたペイロード、および証明を生成する必要があります。

ハイブリッド ZK 対応資産を登録する:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

シールドノートのためのバージョン管理された暗号化ペイロードデータコンテナを作成する:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI は、アセットポリシー、検証キー参照、および暗号化されたノートデータコンテナを準備します。`shield`や`unshield`のトランザクションサブコマンドは公開しません。これらの命令は SDK で構築し、通常の署名済みトランザクションとして手数料価格の見積もりと共に送信してください。

シールドされていないプルーフアタッチメントはこの形をしています:

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
```

## SDK 例 {#sdk-example}

正確な証明バイトは、構成された証明バックエンドから取得されます。トランザクションペイロードには、公開入力と証明の添付ファイルのみが必要です:

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

## 匿名資産エスクロー {#anonymous-asset-escrow}

匿名資産エスクローは、エスクローされた価値のために同じシールドされた転送機構を使用します。関係者およびエスクローの状態は依然としてエスクロー記録に記録されますが、資金提供、解放、キャンセル、そして、解決のための金融転送部分は、遮蔽されたヌリファイアと出力の暗号化コミットメント値を使用します。

詳細なエスクロー ISI の動作や例については、[ネイティブ資産エスクロー](/ja/blockchain/escrow.md#anonymous-escrow) を参照してください。

ライフサイクルは次の通りです:

1. `OpenAnonymousAssetEscrow`は、シールドされた資金ノートを使い、1つのエスクロー暗号コミットメント値を作成します。
2. `AcceptAnonymousAssetEscrow` は購入者を記録します。
3. `MarkAnonymousEscrowPaymentSent`は、購入者がオフチェーンで支払いを送ったことを記録しています。
4. `ReleaseAnonymousAssetEscrow` は、エスクロー暗号コミットメント値を購入者出力暗号コミットメント値に費やします。
5. `CancelAnonymousAssetEscrow` は、支払いがマークされていない場合、エスクロー暗号コミットメント値を売り手の出力暗号コミットメント値に戻します。
6. `OpenAnonymousEscrowDispute` と `ResolveAnonymousEscrowDispute` は、証拠の暗号ハッシュと解決者制御の分割を用いて紛争中のエスクローを処理します。

[クエリ](/ja/reference/queries.md#escrow-and-proof-records) に記載されている匿名エスクロー照会を使用して、エスクロー記録とステータスを確認してください。

## 数学 {#math}

以下の表記は、機密資産フローを示しています。実装では、資産ポリシーと検証者レジストリからアクティブな回路とパラメータIDを使用するため、クライアントは暗号学的コミットメント値、ヌリファイア、および証明バイトをウォレット／証明者の不透明な出力として扱うべきです。

シールドされたノートは次のように説明できます:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

ここで `owner` は受信者の閲覧または支出資料に由来し、`rho` はノートのランダム性です。

ノートの暗号的コミットメント値は、隠蔽型の暗号的コミットメント値です：

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

現在の機密転送回路では、公開入力にはノートの暗号コミットメント値、ヌリファイア、マークルルート、資産タグ、およびチェーンタグが含まれます。回路はこの形の暗号コミットメント値の関係を強制します:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

ノートが使用されると、ウォレットはヌリファイアを導出します：

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N`は公開されています。それはノートを明らかにしませんが、そのノートとチェーンに対して安定しているため、Iroha は同じヌリファイアでの二重支出を拒否することができます。

暗号コミットメント値ツリーはノートの存在を証明します。もしウォレットが暗号コミットメント値 `C_i` を使用する場合、証明には `C_i` から最近の公開ルートへの非公開マークルパスが含まれます。

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

シールド間の送金の場合、証明はまた価値の保存も強制します：

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

アンシールドの場合、公開金額が含まれます：

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

提出された証明は次のように要約できます:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

ここで `public_inputs` は暗号学的コミットメント値、ヌリファイア、ルート、資産タグ、チェーンタグ、および任意の公開シールド解除金額です。ウィットネスには、ノートの金額、ランダムネス、支出資料、およびマークル経路が含まれます。バリデータは証明を検証し、出力暗号コミットメント値を付加し、入力ヌリファイアを使用済みとしてマークすることによってブロックチェーン台帳の状態を変化させます。

## 公共とは何か {#what-is-public}

匿名取引は、すべての観察可能な事実を非公開にするわけではありません。以下のデータは依然として公開される可能性があります:

- 取引の暗号ハッシュ、ブロック高、順序
- アプリケーションがプライベートエントリーポイントやリレーパターンを使用しない限り、取引承認の提出元主体
- 使用されている資産の定義
- 無効化子と出力暗号コミットメント値
- 証明の暗号ハッシュ、検証キー参照、およびオプションのデータコンテナ暗号ハッシュ
- `Unshield` の公開金額および受取人口座
- 匿名エスクロー販売者、購入者、ステータス、タイムスタンプ、証拠の暗号ハッシュ

この公開メタデータが、保護しようとしているビジネス関係を明らかにしないようにアプリケーションを設計してください。

## 関連参考 {#related-reference}

- [`AssetConfidentialPolicy`](/ja/reference/data-model-schema.md)
- [`ConfidentialEvent`](/ja/reference/data-model-schema.md)
- [`ProofAttachment`](/ja/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/ja/reference/data-model-schema.md)
- [エスクローおよび証明に関する問い合わせ](/ja/reference/queries.md#escrow-and-proof-records)
