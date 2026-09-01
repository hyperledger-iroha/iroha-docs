---
translation_locale: zh-hans
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 匿名交易 {#anonymous-transactions}

Iroha 中的匿名交易由机密资产操作构成。钱包不会把公开金额的账户间转账写入链上，而是先将价值转入隐私账本，再借助零知识证明花费不透明票据。

公开账本仍会记录机密操作已经发生。它会记录承诺、作废标识符、证明哈希和事件，但不会记录隐私账本内部转移的票据所有者、接收者或金额。普通交易封装仍可能暴露提交账户，因此此处的“匿名”指匿名的资产流转，并不意味着自动获得网络层或账户层的匿名性。

## 核心构件 {#building-blocks}

|概念|账本中的表示|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|隐私票据|钱包保存的私有记录，其中包含资产、金额、所有者数据和随机性。|
|承诺|一个 32 字节的公开值，它对票据做出承诺，却不泄露票据字段。|
|作废标识符|花费票据时派生的 32 字节公开值。Iroha 会拒绝重复的作废标识符，以防止双重花费。|
|Merkle 根|资产承诺树的一个较新根。证明以它来证明被花费的票据确实存在。|
|证明附件|一个 `ProofAttachment`，包含证明字节，以及验证密钥引用或内联验证密钥。|
|机密事件|例如 `ConfidentialEvent::Shielded`、`Transferred` 或 `Unshielded` 的账本事件。|

主要指令如下：

- `RegisterZkAsset`：将资产注册为支持 ZK，并绑定转移、转入隐私账本和转出隐私账本所需的验证密钥。
- `Shield`：从公开余额中扣款，并追加一个隐私票据承诺。
- `ZkTransfer`：花费隐私票据，并生成新的隐私票据承诺。
- `Unshield`：花费隐私票据，并把金额记入公开账户余额。
- `ScheduleConfidentialPolicyTransition` 和 `CancelConfidentialPolicyTransition`：通过治理变更资产的机密策略。

资产定义还包含一个 [`AssetConfidentialPolicy`](/zh-hans/reference/data-model-schema.md)。策略模式决定哪些流程有效：

|模式|含义|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly`|只接受普通的公开余额和转账。|
|`Convertible`|用户可以在公开余额与隐私票据之间转移价值。|
|`ShieldedOnly`|资产发行和转移必须始终留在隐私账本中。|

## 使用流程 {#how-to-use-them}

1. 在验证节点上启用机密功能。所有验证节点必须就验证后端、活动验证密钥、Poseidon/Pedersen 参数 IDs 和机密规则版本达成一致。节点会拒绝机密功能摘要不匹配的对等节点或区块。
2. 发布或注册电路所用的验证密钥和参数集。钱包和运营方应当通过 `VerifyingKeyId` 引用密钥，例如 `halo2/ipa:vk_transfer`。
3. 使用 `RegisterZkAsset` 将资产注册为支持 ZK，或者安排从 `TransparentOnly` 转换到 `Convertible` 或 `ShieldedOnly` 的策略变更。
4. 使用 `Shield` 将公开资金转入隐私账本。钱包在提交交易之前，会为接收者创建票据承诺和加密载荷。
5. 使用 `ZkTransfer` 进行私密转移。钱包生成证明，证明它拥有输入票据、输入与输出的价值平衡，且每张已花费票据都锚定在较新的承诺树中。
6. 仅在资产策略允许时使用 `Unshield`。`Unshield` 会公开金额和接收账户，花费私有票据的作废标识符，并且可以生成私有找零输出。
7. 通过类型化查询和 Torii 端点读取机密事件、证明记录、作废标识符状态和匿名托管记录，以完成审计。

## CLI 示例 {#cli-examples}

ZK CLI 命令主要用于运营和测试流程。生产钱包应在提交相应指令之前，使用钱包/证明器库生成承诺、加密载荷和证明。

注册一个支持 ZK 的混合资产：

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

为隐私票据构建带版本的加密载荷封装：

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI 会准备资产策略、验证密钥引用和加密票据封装。它不提供 `shield` 或 `unshield` 交易子命令。请使用 SDK 构建这些指令，并将其作为完成费用报价和签名的普通交易提交。

`Unshield` 的证明附件具有以下形式：

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

## SDK 示例 {#sdk-example}

具体的证明字节由配置的证明后端生成。交易载荷只需包含公开输入和证明附件：

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

## 匿名资产托管 {#anonymous-asset-escrow}

匿名资产托管使用同样的隐私转移机制处理被托管的价值。托管记录仍会记录各方和托管状态，但资金注入、释放、取消和裁决各阶段都使用隐私作废标识符和输出承诺。

有关托管 ISI 的详细行为和示例，请参阅[原生资产托管](/zh-hans/blockchain/escrow.md#anonymous-escrow)。

生命周期如下：

1. `OpenAnonymousAssetEscrow` 花费用于注资的隐私票据，并创建一个托管承诺。
2. `AcceptAnonymousAssetEscrow` 记录买方。
3. `MarkAnonymousEscrowPaymentSent` 记录买方已在链下发送付款。
4. `ReleaseAnonymousAssetEscrow` 花费托管承诺，并生成给买方的输出承诺。
5. 如果尚未标记付款，`CancelAnonymousAssetEscrow` 会花费托管承诺，并生成返回给卖方的输出承诺。
6. `OpenAnonymousEscrowDispute` 和 `ResolveAnonymousEscrowDispute` 用证据哈希以及由裁决方控制的拆分方案处理有争议的托管。

使用[查询](/zh-hans/reference/queries.md#escrow-and-proof-records)中列出的匿名托管查询来检查托管记录和状态。

## 数学原理 {#math}

下面的符号描述机密资产流程。实现使用资产策略和验证器注册表中的活动电路和参数 IDs，因此客户端应将承诺、作废标识符和证明字节视为钱包/证明器输出的不透明数据。

隐私票据可以表示为：

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

其中，`owner` 由接收者的查看材料或花费材料派生，`rho` 是票据随机性。

票据承诺是一种隐藏型承诺：

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

对于当前的机密转移电路，公开输入包括票据承诺、作废标识符、Merkle 根、资产标签和链标签。电路会强制执行形如以下的承诺关系：

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

花费票据时，钱包会派生一个作废标识符：

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` 是公开的。它不会泄露票据，但对于该票据和该链而言始终不变，因此 Iroha 可以拒绝再次使用同一作废标识符的花费。

承诺树用来证明票据存在。如果钱包花费承诺 `C_i`，证明中会包含一条从 `C_i` 到较新公开根的私有 Merkle 路径：

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

对于隐私账本内部的转移，证明还会强制价值守恒：

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

对于转出隐私账本的操作，等式中会包含公开金额：

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

提交的证明可以概括为：

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

其中，`public_inputs` 包括承诺、作废标识符、根、资产标签、链标签以及任何公开的转出金额。见证数据包含票据金额、随机性、花费材料和 Merkle 路径。验证节点验证证明后，会通过追加输出承诺并将输入作废标识符标记为已花费来更新账本状态。

## 公开信息 {#what-is-public}

匿名交易不会隐藏所有可观测事实。以下数据仍可能公开：

- 交易哈希、区块高度和顺序
- 提交交易的授权主体，除非应用程序使用私有入口点或中继器模式
- 所使用的资产定义
- 作废标识符和输出承诺
- 证明哈希、验证密钥引用和可选封装哈希
- `Unshield` 的公开金额和接收账户
- 匿名托管的卖方、买方、状态、时间戳和证据哈希

应用设计应确保这些公开元数据不会泄露需要保护的业务关系。

## 相关参考 {#related-reference}

- [`AssetConfidentialPolicy`](/zh-hans/reference/data-model-schema.md)
- [`ConfidentialEvent`](/zh-hans/reference/data-model-schema.md)
- [`ProofAttachment`](/zh-hans/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/zh-hans/reference/data-model-schema.md)
- [托管和证明查询](/zh-hans/reference/queries.md#escrow-and-proof-records)
