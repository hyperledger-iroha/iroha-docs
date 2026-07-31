---
translation_locale: zh-hans
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 匿名交易 {#anonymous-transactions}

无名交易 Iroha 由机密资产构建
转账,而不是写入公共账户的账户转移
一个钱包将价值转移到一个屏蔽的账本,然后花费
无透明的笔记,具有零知识证明.

公共账本仍然记录了一个机密的操作发生.
记录承诺,取消符号,证据哈希和事件,但它没有
记录纸币的所有者,收件人或额度为屏蔽到屏蔽
常规交易包裹可能仍然显示提交
账户,所以"匿名"在这里意味着匿名资产流动,而不是自动
网络级或账户级的匿名性.

## 建筑物 {#building-blocks}

| 概念            | 账本表现                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 屏蔽的笔记      | 一个私人钱包记录,包含资产,金额,所有者数据和随机性.                                   |
| 承诺         | 一个32字节的公共值,它承诺对一个注释而不会透露其领域.                                        |
| 废除器          | 一个在笔记被花费时获得的32字节公值. Iroha 拒绝反复废除,以防止双重支出. |
| 梅克尔根        | 资产承诺树的近期根源.证据使用它来证明消费纸币存在.                        |
| 证明附件   | 一个 `ProofAttachment` 含有证明字节加上验证密钥参考或直线验证密码.                 |
| 秘密事件 | 一个账本事件,如 `ConfidentialEvent::Shielded`, `Transferred`, 或 `Unshielded`.                              |

主要指令是:

- `RegisterZkAsset`: 注册资产为 ZK- 具有能力和绑定性转移,
  屏蔽和无屏蔽的验证钥匙.
- `Shield`: 抵押公开余额,并附加封存笔记承诺.
- `ZkTransfer`: 投资者将其资金支付给其他公司.
- `Unshield`: 支付保密纸币和公开账户余额.
- `ScheduleConfidentialPolicyTransition` 并且
  `CancelConfidentialPolicyTransition`: 改变资产的机密性
  政策通过治理.

资产定义也包含
[`AssetConfidentialPolicy`](/zh-hans/reference/data-model-schema.md).
流动的政策模式控制有效:

| 模式              | 含义                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` | 只有正常的公共余额和转账才被接受.          |
| `Convertible`     | 用户可以在公共平衡和屏蔽的纸币之间移动价值. |
| `ShieldedOnly`    | 资产发行和转移必须保持在保护账本中.   |

## 如何使用它们 {#how-to-use-them}

1. 在验证器节点上启用保密支持.验证器必须同意
   验证器后端,活性验证键,Poseidon/Pedersen参数
   IDs, 节点拒绝同行或区块
   错误的机密特征消化.
2. 发布或注册验证密钥和参数组
   钱包和运营商应通过
   `VerifyingKeyId`, 例如: `halo2/ipa:vk_transfer`.
3. 登记资产为 ZK- 有能力 `RegisterZkAsset`, 或阶段a
   政策转型 `TransparentOnly` 在 `Convertible` 或
   `ShieldedOnly`.
4. 保护公共资金 `Shield`. 钱包创造了一个笔记承诺
   在收件人提交文件之前,
   交易.
5. 个人转移与 `ZkTransfer`. 钱包建立了一个证据
   拥有输入笔记,输出和输入值平衡,
   每张花费的纸币都扎根于最近的一棵承诺树上.
6. 只有资产政策允许时才能解除保护. `Unshield` 揭示了
   公共资金和收件人账户,花费私人纸币无效证,
   而可以创造私人变化输出.
7. 通过阅读机密事件,证据记录,无效状态进行审计;
   通过输入查询和 Torii 终点.

## CLI 举例 {#cli-examples}

其他 ZK CLI 操作员和测试流程的命令.
钱包应该产生承诺,加密有效载荷和证据
在提交结果指令之前,提取钱包/提示器库.

登记混合物 ZK- 资产:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

构建一个版本的加密有效载荷包,

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

保护公共资金进入资产的保护账本:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

具有防护装置的脱 JSON:

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

## SDK 举个例子 {#sdk-example}

确切的证据字节来自配置的证据后端.
交易有效载荷只需要公开输入和证明附件:

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

## 匿名资产保证 {#anonymous-asset-escrow}

匿名资产保证使用相同的保护转移机器
担保额和担保情况仍在
监管记录,但资金,释放,取消和解决的步骤
使用屏蔽的废除器和输出承诺.

详细的保证 ISI 行为和示例,见
[产业资产抵押](/zh-hans/blockchain/escrow.md#anonymous-escrow).

生命周期是:

1. `OpenAnonymousAssetEscrow` 投资金,并创建一个
   担保承诺.
2. `AcceptAnonymousAssetEscrow` 记录买家的情况.
3. `MarkAnonymousEscrowPaymentSent` 买方发送付款的记录
   没有链接.
4. `ReleaseAnonymousAssetEscrow` 对买方的保证金承诺
   产量承诺.
5. `CancelAnonymousAssetEscrow` 将保证金交给卖方
   没有标记付款时的输出承诺.
6. `OpenAnonymousEscrowDispute` 并且 `ResolveAnonymousEscrowDispute` 处理器
   证据和解决方案控制的分离.

使用在
[问题](/zh-hans/reference/queries.md#escrow-and-proof-records) 检查保证金
记录和状态.

## 数学 {#math}

下面的标记描述了机密资产流动.
使用主动电路和参数 IDs 从资产政策和验证人
因此,客户应该处理承诺,取消和证明字节
作为钱包/口袋的不透明输出.

一个屏蔽的笔记可以描述为:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

在哪里 `owner` 由收件人查看或使用的材料中得出,
`rho` 是注意随机性.

笔记承诺是隐藏的承诺:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

对于当前的机密传输电路,公共输入包括
一个 Merkle 根,一个资产标签和一个链条标签.
电路强制执行这种形式的承诺关系:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

当钱包被花费时,钱包得到了无效符号:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` 它不透露笔记,但它对该笔记是稳定的
和链,所以 Iroha 通过相同的废除器,可以拒绝第二次支出.

承诺树证明了笔记存在.
`C_i`, 证据包括一个私人Merkle路径 `C_i` 在最近的一次
公共根:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

对于屏蔽到屏蔽转移,证据也强制值
保护:

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

在哪里 `public_inputs` 是承诺,取消者,根,资产标签,
证人包含了这份信件.
验证器检测到
通过添加输出承诺,证明然后突变本账户状态;
标记输入无效符号为消耗.

## 公共的内容 {#what-is-public}

匿名交易并不能使所有可观察的事实都私密.
下列数据仍可公开:

- 交易哈希,区块高度和订单
- 提交交易权威机构,除非申请使用
  专用入口点或继承层模式
- 使用的资产定义
- 无效和输出承诺
- 证据哈希,验证密钥引用和可选包裹哈希
- 公共资金和收件人账户 `Unshield`
- 匿名的保证人卖家,买方,状态,时间印和证据哈希

设计应用程序,以便这些公共的元数据不显示业务
你试图保护的关系.

## 相关参考 {#related-reference}

- [`AssetConfidentialPolicy`](/zh-hans/reference/data-model-schema.md)
- [`ConfidentialEvent`](/zh-hans/reference/data-model-schema.md)
- [`ProofAttachment`](/zh-hans/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/zh-hans/reference/data-model-schema.md)
- [担保和证据查询](/zh-hans/reference/queries.md#escrow-and-proof-records)
