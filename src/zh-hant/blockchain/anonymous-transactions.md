---
translation_locale: zh-hant
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 匿名交易 {#anonymous-transactions}

在 Iroha 中的匿名交易由機密資產運營構成.而不是將公開賬戶到賬戶轉賬,錢包將價值轉移到一個屏蔽的大冊子中,然後用零知識證明的不透明的筆記.

公開賬本仍然記錄了祕密的操作發生. 它記錄了承諾,取消者,證據哈希和事件,但它不記錄了筆記所有者,收件人或額外的屏蔽到屏蔽的流動.通常的交易包裹可能仍然顯示提交帳戶,因此"匿名"在這裏意味着匿名資產流動,而不是自動網絡級或賬戶級匿名性.

## 建築物 {#building-blocks}

|概念|賬本表現|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|屏蔽的筆記|一個私人錢包記錄包含資產,金額,所有者數據和隨機性. |
|承諾|一個32字節的公值,它會承諾一個筆記,而不會透露其字段. |
|取消者|一個32字節公開值,當一個筆記被花費時得到. Iroha 拒絕反覆廢除,以防止雙重支出. |
|梅克爾根|資產的承諾樹的一個近期根源.證據使用它來證明消費紙幣存在.|
|證據附件|包含證明字節加上驗證密鑰引用或直線驗證密碼的 `ProofAttachment`. |
|祕密事件|一個賬本事件,例如 `ConfidentialEvent::Shielded`, `Transferred`或 `Unshielded`. |

主要指令是:

- `RegisterZkAsset`:將資產註冊爲具有 ZK 能力,並綁定轉移,屏蔽和非屏蔽驗證密鑰.
- `Shield`:抵押公開餘額,並附加封閉紙幣承諾.
- `ZkTransfer`:將屏蔽的紙幣用於新的屏蔽的賬單承諾.
- `Unshield`:支付屏蔽的紙幣,並將公開賬戶餘額抵免.
- `ScheduleConfidentialPolicyTransition`和`CancelConfidentialPolicyTransition`:通過管理改變資產的保密政策.

資產定義還包含[`AssetConfidentialPolicy`](/zh-hant/reference/data-model-schema.md).流動的政策模式控制是有效的:

|模式|這意味着|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly`|只有正常的公共餘額和轉賬才被接受.|
|`Convertible`|用戶可以在公共餘額和屏蔽紙幣之間移動價值. |
|`ShieldedOnly`|資產發行和轉移必須保持在保護賬本中.|

## 如何使用它們 {#how-to-use-them}

1. 啓用驗證器節點的保密支持.驗證器必須同意驗證器後端,活躍驗證鍵,Poseidon/Pedersen參數 IDs,和機密規則版本.節點拒絕與不匹配的機密功能消化等同類或區塊.
2. 發佈或註冊電路所使用的驗證密鑰和參數組.錢包和運營商應以 `VerifyingKeyId`爲例 `halo2/ipa:vk_transfer`引用密鑰.
3. 登記資產爲 ZK- 有能力 `RegisterZkAsset`, 或將政策轉型從 `TransparentOnly` 在 `Convertible` 或 `ShieldedOnly`.
4. 通過 `Shield`來保護公共資金,錢包在提交交易之前爲收件人創建了筆記承諾和加密有效負載.
5. 個人轉移與 `ZkTransfer`. 錢包建立了一個證明,它擁有輸入筆記,而每張花費的紙幣都紮根於一個近期承諾樹上.
6. 僅在資產政策允許的情況下解除保險. `Unshield`顯示公開的金額和收件人賬戶,使用私人筆記無效化器,並且可以創建私人變換輸出.
7. 通過通過輸入查詢和 Torii 終點閱讀機密事件,證據記錄,無效者狀態以及匿名保證人記錄進行審計.

## CLI 舉例 {#cli-examples}

ZK CLI 命令是用於運營商和測試流程的.生產錢包在提交結果說明之前應生成承諾,加密有效載荷和證據,使用一個錢包/檢驗器庫.

註冊混合資產 ZK 資產:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

構建一個版本的加密有效載荷封面,爲保護筆記:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

保護公共資金存入資產的保護賬本:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

具有防裝置 JSON 的脫屏:

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

## SDK 舉例 {#sdk-example}

正確的證明字節來自配置的證據後端. 交易有效負載只需要公開輸入和證據附件:

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

## 匿名資產保證金 {#anonymous-asset-escrow}

匿名資產託管使用相同的保護轉移機器來保證值.當事人和託管狀態仍然記錄在託管記錄中,但融資,釋放,取消和解決腿部使用保護廢除和輸出承諾.

詳細的保證券 ISI 行爲和示例,請參見 [本國資產保證券](/zh-hant/blockchain/escrow.md#anonymous-escrow).

生命週期是:

1. `OpenAnonymousAssetEscrow`支付保密資金券,並創建一個保證金承諾.
2. `AcceptAnonymousAssetEscrow`記錄了買家.
3. `MarkAnonymousEscrowPaymentSent`記錄買方在鏈外發送付款的情況.
4. `ReleaseAnonymousAssetEscrow`將保證金承諾用於買方的產出承諾.
5. `CancelAnonymousAssetEscrow`在沒有標記付款時,將保證承諾返回出售商的輸出承諾.
6. `OpenAnonymousEscrowDispute`和 `ResolveAnonymousEscrowDispute`處理有爭議的保證金,包括證據哈希以及由解決者控制的分離.

在 [查詢](/zh-hant/reference/queries.md#escrow-and-proof-records)中列出的匿名託管查詢,以檢查託管記錄和狀態.

## 數學 {#math}

下面的註釋描述了機密資產流動.實現使用資產政策和驗證人登記器中的活躍電路和參數 IDs,因此客戶應將承諾,取消符號和證明字節視爲錢包/證明的不透明輸出.

一個屏蔽的筆記可以描述爲:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

在 `owner` 來自收件人查看或花費的材料中,並且 `rho`是註釋隨機性.

筆記承諾是隱藏的承諾:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

對於當前的機密傳輸電路,公開輸入包括筆記承諾,取消器,Merkle根,資產標籤和鏈接標籤.該電路強制執行這樣的承諾關係:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

當一個筆記被花費時,錢包得到了取消符:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N`是公開的.它不披露筆記,但對於該筆記和鏈條來說它是穩定的,因此 Iroha 可以拒絕使用相同的廢除符的第二次支出.

承諾樹證明了筆記的存在.如果一個錢包花費承諾 `C_i`,證據包括從 `C_i` 到最近公開根的私人Merkle路徑:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

對於屏蔽到屏蔽的轉移,證明還強制保護價值:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

對於無屏蔽的貨物,公開金額包括:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

提交的證據可以總結爲:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

在 `public_inputs` 中包括承諾,廢除者,根,資產標籤,鏈標籤以及任何公開未保證金額.證人包含筆記金額,隨機性,支出材料和Merkle路徑.驗證器通過添加輸出承諾和標記輸入廢除符來驗證證明,然後突變本書狀態.

## 公共的內容 {#what-is-public}

匿名交易不會使所有可觀察的事實都變得私密.以下數據仍然可以公開:

- 交易哈希,區塊高度和訂單
- 提交交易權威機構,除非申請使用私人輸入點或重疊模式
- 使用的資產定義
- 廢除器和輸出承諾
- 證據哈希,驗證密鑰引用和可選包裹哈希
- `Unshield`的公開資金和收益人賬戶
- 匿名的保證人賣家,買方,狀態,時間印和證據哈希

設計應用程序,以便這些公開的元數據不透露你試圖保護的商業關係.

## 相關參考 {#related-reference}

- [`AssetConfidentialPolicy`](/zh-hant/reference/data-model-schema.md)
- [`ConfidentialEvent`](/zh-hant/reference/data-model-schema.md)
- [`ProofAttachment`](/zh-hant/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/zh-hant/reference/data-model-schema.md)
- [擔保和證據查詢](/zh-hant/reference/queries.md#escrow-and-proof-records)
