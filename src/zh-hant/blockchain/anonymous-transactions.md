---
translation_locale: zh-hant
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 匿名交易 {#anonymous-transactions}

Iroha 中的匿名交易由機密資產操作構成。錢包不會將公開金額的帳戶間轉帳寫入鏈上，而是先將價值轉入隱私帳本，再透過零知識證明花費不透明票據。

公開帳本仍會記錄機密操作已經發生。它會記錄承諾、作廢標識符、證明雜湊和事件，但不會記錄隱私帳本內部轉移的票據擁有者、接收者或金額。一般交易封裝仍可能暴露提交帳戶，因此此處的「匿名」是指匿名的資產流轉，並不會自動提供網路層或帳戶層的匿名性。

## 核心構件 {#building-blocks}

| 概念 | 帳本中的表示 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 隱私票據 | 由錢包保存的私有記錄，其中包含資產、金額、擁有者資料和隨機值。 |
| 承諾 | 一個 32 位元組的公開值，用來承諾一張票據而不洩露其欄位。 |
| 作廢標識符 | 花費票據時衍生出的 32 位元組公開值。Iroha 會拒絕重複的作廢標識符，以防止雙重花費。 |
| Merkle 根 | 資產承諾樹的一個近期根。證明以它來證明被花費的票據確實存在。 |
| 證明附件 | 一個 `ProofAttachment`，包含證明位元組，以及驗證金鑰參照或內嵌驗證金鑰。 |
| 機密事件 | 例如 `ConfidentialEvent::Shielded`、`Transferred` 或 `Unshielded` 的帳本事件。 |

主要指令如下：

- `RegisterZkAsset`：將資產註冊為支援 ZK，並繫結轉移、轉入隱私帳本和轉出隱私帳本所需的驗證金鑰。
- `Shield`：從公開餘額扣款，並追加一個隱私票據承諾。
- `ZkTransfer`：花費隱私票據，並產生新的隱私票據承諾。
- `Unshield`：花費隱私票據，並將金額記入公開帳戶餘額。
- `ScheduleConfidentialPolicyTransition` 和 `CancelConfidentialPolicyTransition`：透過治理變更資產的機密策略。

資產定義還包含一個 [`AssetConfidentialPolicy`](/zh-hant/reference/data-model-schema.md)。策略模式決定哪些流程有效：

| 模式 | 含義 |
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` | 只接受一般的公開餘額與轉帳。 |
| `Convertible` | 使用者可以在公開餘額與隱私票據之間轉移價值。 |
| `ShieldedOnly` | 資產發行與轉移必須始終留在隱私帳本中。 |

## 使用流程 {#how-to-use-them}

1. 在驗證節點上啟用機密功能。所有驗證節點必須就驗證後端、有效的驗證金鑰、Poseidon/Pedersen 參數 IDs 和機密規則版本達成一致。節點會拒絕機密功能摘要不相符的對等節點或區塊。
2. 發布或註冊電路所用的驗證金鑰和參數集。錢包與營運方應透過 `VerifyingKeyId` 參照金鑰，例如 `halo2/ipa:vk_transfer`。
3. 使用 `RegisterZkAsset` 將資產註冊為支援 ZK，或安排從 `TransparentOnly` 轉換到 `Convertible` 或 `ShieldedOnly` 的策略變更。
4. 使用 `Shield` 將公開資金轉入隱私帳本。錢包在提交交易之前，會為接收者建立票據承諾和加密承載資料。
5. 使用 `ZkTransfer` 進行私密轉移。錢包會產生證明，證明它擁有輸入票據、輸入與輸出的價值平衡，且每張已花費票據都錨定在近期的承諾樹中。
6. 僅在資產策略允許時使用 `Unshield`。`Unshield` 會公開金額和接收帳戶，花費私有票據的作廢標識符，並可產生私有找零輸出。
7. 透過型別化查詢和 Torii 端點讀取機密事件、證明記錄、作廢標識符狀態和匿名託管記錄，以完成稽核。

## CLI 範例 {#cli-examples}

ZK CLI 命令主要用於營運與測試流程。正式環境中的錢包應先使用錢包／證明器函式庫產生承諾、加密承載資料和證明，再提交相應指令。

註冊一項支援 ZK 的混合資產：

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

為隱私票據建立帶版本的加密承載資料封裝：

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI 會準備資產策略、驗證金鑰參照和加密票據封裝。它不提供 `shield` 或 `unshield` 交易子命令。請使用 SDK 建立這些指令，並將其作為完成費用報價與簽署的一般交易提交。

`Unshield` 的證明附件具有以下形式：

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

## SDK 範例 {#sdk-example}

具體的證明位元組由設定的證明後端產生。交易承載資料只需包含公開輸入和證明附件：

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

## 匿名資產託管 {#anonymous-asset-escrow}

匿名資產託管使用相同的隱私轉移機制處理託管中的價值。託管記錄仍會記載各方與託管狀態，但資金注入、釋放、取消和裁決各階段都使用隱私作廢標識符與輸出承諾。

有關託管 ISI 的詳細行為和範例，請參閱[原生資產託管](/zh-hant/blockchain/escrow.md#anonymous-escrow)。

生命週期如下：

1. `OpenAnonymousAssetEscrow` 花費用來注資的隱私票據，並建立一個託管承諾。
2. `AcceptAnonymousAssetEscrow` 記錄買方。
3. `MarkAnonymousEscrowPaymentSent` 記錄買方已在鏈下傳送付款。
4. `ReleaseAnonymousAssetEscrow` 花費託管承諾，並為買方產生輸出承諾。
5. 如果尚未標記付款，`CancelAnonymousAssetEscrow` 會花費託管承諾，並產生回到賣方的輸出承諾。
6. `OpenAnonymousEscrowDispute` 和 `ResolveAnonymousEscrowDispute` 透過證據雜湊以及由裁決方控制的拆分方案處理有爭議的託管。

使用[查詢](/zh-hant/reference/queries.md#escrow-and-proof-records)中列出的匿名託管查詢，檢查託管記錄與狀態。

## 數學原理 {#math}

下列符號描述機密資產流程。實作會使用資產策略與驗證器登錄檔中的有效電路和參數 IDs，因此用戶端應將承諾、作廢標識符和證明位元組視為錢包／證明器輸出的不透明資料。

隱私票據可以表示為：

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

其中，`owner` 由接收者的檢視材料或花費材料衍生，`rho` 是票據的隨機值。

票據承諾是一種隱藏型承諾：

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

對目前的機密轉移電路而言，公開輸入包括票據承諾、作廢標識符、Merkle 根、資產標籤和鏈標籤。電路會強制執行如下的承諾關係：

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

花費票據時，錢包會衍生出一個作廢標識符：

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` 是公開的。它不會洩露票據，但對該票據與該鏈而言始終不變，因此 Iroha 可以拒絕再次使用同一作廢標識符的花費。

承諾樹用來證明票據存在。如果錢包花費承諾 `C_i`，證明會包含一條從 `C_i` 到近期公開根的私有 Merkle 路徑：

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

對隱私帳本內部的轉移而言，證明還會強制價值守恆：

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

對轉出隱私帳本的操作而言，等式會包含公開金額：

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

提交的證明可概括為：

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

其中，`public_inputs` 包括承諾、作廢標識符、根、資產標籤、鏈標籤以及任何公開的轉出金額。見證資料包含票據金額、隨機值、花費材料和 Merkle 路徑。驗證節點驗證證明後，會追加輸出承諾並將輸入作廢標識符標記為已花費，藉此更新帳本狀態。

## 公開資訊 {#what-is-public}

匿名交易不會隱藏所有可觀測的事實。以下資料仍可能公開：

- 交易雜湊、區塊高度和順序
- 提交交易的授權主體，除非應用程式使用私有進入點或中繼器模式
- 使用的資產定義
- 作廢標識符和輸出承諾
- 證明雜湊、驗證金鑰參照和可選的封裝雜湊
- `Unshield` 的公開金額與接收帳戶
- 匿名託管的賣方、買方、狀態、時間戳記和證據雜湊

應用程式設計應確保這些公開的中繼資料不會洩露需要保護的業務關係。

## 相關參考 {#related-reference}

- [`AssetConfidentialPolicy`](/zh-hant/reference/data-model-schema.md)
- [`ConfidentialEvent`](/zh-hant/reference/data-model-schema.md)
- [`ProofAttachment`](/zh-hant/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/zh-hant/reference/data-model-schema.md)
- [託管與證明查詢](/zh-hant/reference/queries.md#escrow-and-proof-records)
