---
translation_locale: zh-hans
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 匿名交易 {#anonymous-transactions}

在 Iroha 中的匿名交易由机密资产运营构成.而不是将公开账户到账户转账,钱包将价值转移到一个屏蔽的大册子中,然后用零知识证明的不透明的笔记.

公开账本仍然记录了秘密的操作发生. 它记录了承诺,取消者,证据哈希和事件,但它不记录了笔记所有者,收件人或额外的屏蔽到屏蔽的流动.通常的交易包裹可能仍然显示提交帐户,因此"匿名"在这里意味着匿名资产流动,而不是自动网络级或账户级匿名性.

## 建筑物 {#building-blocks}

|概念|账本表现|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|屏蔽的笔记|一个私人钱包记录包含资产,金额,所有者数据和随机性. |
|承诺|一个32字节的公值,它会承诺一个笔记,而不会透露其字段. |
|取消者|一个32字节公开值,当一个笔记被花费时得到. Iroha 拒绝反复废除,以防止双重支出. |
|梅克尔根|资产的承诺树的一个近期根源.证据使用它来证明消费纸币存在.|
|证据附件|包含证明字节加上验证密钥引用或直线验证密码的 `ProofAttachment`. |
|秘密事件|一个账本事件,例如 `ConfidentialEvent::Shielded`, `Transferred`或 `Unshielded`. |

主要指令是:

- `RegisterZkAsset`:将资产注册为具有 ZK 能力,并绑定转移,屏蔽和非屏蔽验证密钥.
- `Shield`:抵押公开余额,并附加封闭纸币承诺.
- `ZkTransfer`:将屏蔽的纸币用于新的屏蔽的账单承诺.
- `Unshield`:支付屏蔽的纸币,并将公开账户余额抵免.
- `ScheduleConfidentialPolicyTransition`和`CancelConfidentialPolicyTransition`:通过管理改变资产的保密政策.

资产定义还包含[`AssetConfidentialPolicy`](/zh-hans/reference/data-model-schema.md).流动的政策模式控制是有效的:

|模式|这意味着|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly`|只有正常的公共余额和转账才被接受.|
|`Convertible`|用户可以在公共余额和屏蔽纸币之间移动价值. |
|`ShieldedOnly`|资产发行和转移必须保持在保护账本中.|

## 如何使用它们 {#how-to-use-them}

1. 启用验证器节点的保密支持.验证器必须同意验证器后端,活跃验证键,Poseidon/Pedersen参数 IDs,和机密规则版本.节点拒绝与不匹配的机密功能消化等同类或区块.
2. 发布或注册电路所使用的验证密钥和参数组.钱包和运营商应以 `VerifyingKeyId`为例 `halo2/ipa:vk_transfer`引用密钥.
3. 登记资产为 ZK- 有能力 `RegisterZkAsset`, 或将政策转型从 `TransparentOnly` 在 `Convertible` 或 `ShieldedOnly`.
4. 通过 `Shield`来保护公共资金,钱包在提交交易之前为收件人创建了笔记承诺和加密有效负载.
5. 个人转移与 `ZkTransfer`. 钱包建立了一个证明,它拥有输入笔记,而每张花费的纸币都扎根于一个近期承诺树上.
6. 仅在资产政策允许的情况下解除保险. `Unshield`显示公开的金额和收件人账户,使用私人笔记无效化器,并且可以创建私人变换输出.
7. 通过通过输入查询和 Torii 终点阅读机密事件,证据记录,无效者状态以及匿名保证人记录进行审计.

## CLI 举例 {#cli-examples}

ZK CLI 命令是用于运营商和测试流程的.生产钱包在提交结果说明之前应生成承诺,加密有效载荷和证据,使用一个钱包/检验器库.

注册混合资产 ZK 资产:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

构建一个版本的加密有效载荷封面,为保护笔记:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

保护公共资金存入资产的保护账本:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

具有防装置 JSON 的脱屏:

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

## SDK 举例 {#sdk-example}

正确的证明字节来自配置的证据后端. 交易有效负载只需要公开输入和证据附件:

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

## 匿名资产保证金 {#anonymous-asset-escrow}

匿名资产托管使用相同的保护转移机器来保证值.当事人和托管状态仍然记录在托管记录中,但融资,释放,取消和解决腿部使用保护废除和输出承诺.

详细的保证券 ISI 行为和示例,请参见 [本国资产保证券](/zh-hans/blockchain/escrow.md#anonymous-escrow).

生命周期是:

1. `OpenAnonymousAssetEscrow`支付保密资金券,并创建一个保证金承诺.
2. `AcceptAnonymousAssetEscrow`记录了买家.
3. `MarkAnonymousEscrowPaymentSent`记录买方在链外发送付款的情况.
4. `ReleaseAnonymousAssetEscrow`将保证金承诺用于买方的产出承诺.
5. `CancelAnonymousAssetEscrow`在没有标记付款时,将保证承诺返回出售商的输出承诺.
6. `OpenAnonymousEscrowDispute`和 `ResolveAnonymousEscrowDispute`处理有争议的保证金,包括证据哈希以及由解决者控制的分离.

在 [查询](/zh-hans/reference/queries.md#escrow-and-proof-records)中列出的匿名托管查询,以检查托管记录和状态.

## 数学 {#math}

下面的注释描述了机密资产流动.实现使用资产政策和验证人登记器中的活跃电路和参数 IDs,因此客户应将承诺,取消符号和证明字节视为钱包/证明的不透明输出.

一个屏蔽的笔记可以描述为:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

在 `owner` 来自收件人查看或花费的材料中,并且 `rho`是注释随机性.

笔记承诺是隐藏的承诺:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

对于当前的机密传输电路,公开输入包括笔记承诺,取消器,Merkle根,资产标签和链接标签.该电路强制执行这样的承诺关系:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

当一个笔记被花费时,钱包得到了取消符:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N`是公开的.它不披露笔记,但对于该笔记和链条来说它是稳定的,因此 Iroha 可以拒绝使用相同的废除符的第二次支出.

承诺树证明了笔记的存在.如果一个钱包花费承诺 `C_i`,证据包括从 `C_i` 到最近公开根的私人Merkle路径:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

对于屏蔽到屏蔽的转移,证明还强制保护价值:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

对于无屏蔽的货物,公开金额包括:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

提交的证据可以总结为:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

在 `public_inputs` 中包括承诺,无效证书,根,资产标签,链标签以及任何公开未保证金额.证人包含笔记金额,随机性,验证器通过添加输出承诺和标记输入无效符来验证证明,然后突变本体状态.

## 公共的内容 {#what-is-public}

匿名交易不会使所有可观察的事实都变得私密.以下数据仍然可以公开:

- 交易哈希,区块高度和订单
- 提交交易权威机构,除非申请使用私人输入点或重叠模式
- 使用的资产定义
- 废除器和输出承诺
- 证据哈希,验证密钥引用和可选包裹哈希
- `Unshield`的公开资金和收益人账户
- 匿名的保证人卖家,买方,状态,时间印和证据哈希

设计应用程序,以便这些公开的元数据不透露你试图保护的商业关系.

## 相关参考 {#related-reference}

- [`AssetConfidentialPolicy`](/zh-hans/reference/data-model-schema.md)
- [`ConfidentialEvent`](/zh-hans/reference/data-model-schema.md)
- [`ProofAttachment`](/zh-hans/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/zh-hans/reference/data-model-schema.md)
- [担保和证据查询](/zh-hans/reference/queries.md#escrow-and-proof-records)
