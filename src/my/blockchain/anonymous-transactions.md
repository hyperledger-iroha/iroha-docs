---
translation_locale: my
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အမည်မသိ ငွေပေးချေမှု {#anonymous-transactions}

အမည်မသိ ငွေကြေးဖလှယ်မှု Iroha လျှို့ဝှက်သော အရင်းအမြစ်မှ တည်ဆောက်ထားသည်
ငွေလွှဲပြောင်းမှုများကို စာရင်းမှစာရင်းသို့ ရေးသားခြင်းအစား
အများပြည်သူအတွက် ငွေကြေးပိုက်ဆံရှိရင် Wallet ဟာ တန်ဖိုးကို ပိတ်ထားတဲ့ စာရင်းထဲ ရွှေ့ပြီး သုံးပါတယ်။
သုည အသိအမှတ်ပြုချက်တွေနဲ့ မရှင်းလင်းတဲ့ မှတ်စုတွေ။

အများပြည်သူစာရင်းထဲမှာ လျှို့ဝှက်မှုတစ်ခု ဖြစ်ပျက်ခဲ့တယ်လို့ မှတ်တမ်းတင်ထားဆဲပါ။
commitments, nullifiers, proof hashes နဲ့ ဖြစ်ရပ်တွေကို မှတ်တမ်းတင်ထားပေမဲ့
မှတ်တမ်းတင်ထားသော ငွေစက္ကူပိုင်ရှင်၊ လက်ခံရရှိသူ (သို့) ပိတ်ပင်ထားသည့်ငွေကြေးအတွက် ငွေကြေးပိတ်သိမ်းမှု
အပြောင်းအလဲ။ ပုံမှန် ငွေပေးချေမှုအဖုံးမှာ တင်ပြနေတဲ့အချက်တွေကို ဖော်ပြနိုင်သေးတယ်
account ဆိုတော့ "အမည်မသိ" ဆိုတာက အမည်မဲ့ အရင်းအမြစ် ရွေ့လျားမှုကို ဆိုလိုတာပါ။ အလိုအလျောက်မဟုတ်ဘူး။
ကွန်ရက်အဆင့် (သို့) အကောင့်အဆင့် အမည်မဲ့ခြင်း။

## အဆောက်အအုံများ {#building-blocks}

| အယူအဆ            | Ledger ကိုယ်စားပြုမှု                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| ကာကွယ်ထားသော မှတ်ပုံတင်      | ပိုင်ဆိုင်သူ ဒေတာ၊ ငွေကြေးပမာဏနဲ့ ကျပန်းဖြစ်စဉ်တွေပါတဲ့ ပုဂ္ဂလိက ငွေကြေးစက္ကူမှတ်တမ်းပါ။                                   |
| ကတိပေးခြင်း         | မှတ်စုတစ်ခုရဲ့ ကွင်းတွေကို မဖေါ်ပြဘဲ ချုပ်ဆိုထားတဲ့ ဘိုင် ၃၂ ဘိုက် အများသုံးတန်ဖိုးပါ။                                        |
| ဖျက်သိမ်းသူ          | မှတ်စုတစ်ခု ကုန်ကျတဲ့အခါ ရယူတဲ့ ဘိုက် ၃၂ အများသုံးတန်ဖိုးပါ။ Iroha နှစ်ထပ်သုံးစွဲမှုကို တားဆီးဖို့ အကြိမ်ကြိမ် ဖျက်သိမ်းတဲ့ ကိစ္စတွေကို ပယ်ချတယ်။ |
| Merkle အမြစ်        | ငွေကြေးထောက်ပံ့မှု အပင်ရဲ့ မကြာသေးခင်က အမြစ်ပါ။ အထောက်အထားတွေက သုံးစွဲထားတဲ့ စာရွက်တွေ ရှိတာကို ပြသဖို့ အသုံးပြုတယ်။                        |
| အထောက်အထား တပ်ဆင်ခြင်း   | A ကို `ProofAttachment` အတည်ပြုချက် ဘိုက်များနှင့် စစ်ဆေးရေး သော့ကို ရည်ညွှန်းခြင်း (သို့) Inline စစ်ဆေးရေးသော့ကို ထည့်သွင်းထားသည်။                 |
| လျှို့ဝှက်ဖြစ်ရပ် | Ledger အဖြစ်အပျက်တစ်ခု `ConfidentialEvent::Shielded`, `Transferred`, ဒါမှမဟုတ် `Unshielded`.                              |

အဓိက ညွှန်ကြားချက်တွေကတော့-

- `RegisterZkAsset`: အရင်းအမြစ်တစ်ခုအဖြစ် မှတ်ပုံတင်သည် ZK- အရည်အသွေးရှိပြီး ချုပ်ကိုင်ထားသော လွှဲပြောင်းမှု
  shield နဲ့ unshielded verification keys တွေပါ။
- `Shield`: အများပြည်သူရဲ့ ငွေကြေးစာရင်းကို ချေဖျက်ပြီး ကန့်သတ်ထားတဲ့ စာရွက်စာတမ်း အမိန့်ချမှတ်ချက်ကို ထည့်သွင်းပေးပါတယ်။
- `ZkTransfer`: ကန့်သတ်ထားတဲ့ ငွေစက္ကူတွေကို ကန့်သတ်ချက်အသစ်တွေအဖြစ် သုံးပါတယ်။
- `Unshield`: ငွေကြေးငွေကို ချုပ်ကိုင်ထားပြီး အများပိုင်စာရင်းကွင်းကျန်ကို ခွင့်ပြုပေးတယ်။
- `ScheduleConfidentialPolicyTransition` နှင့်
  `CancelConfidentialPolicyTransition`: အရင်းအမြစ်ရဲ့ လျှို့ဝှက်မှုကို ပြောင်းလဲပစ်ပါ။
  နိုင်ငံရေးကို အုပ်ချုပ်မှုမှတဆင့် ဆောင်ရွက်ပေးရန်။

အရင်းအမြစ် သတ်မှတ်ချက်မှာလည်း
[`AssetConfidentialPolicy`](/my/reference/data-model-schema.md).
စီးဆင်းမှုများကို ထိန်းချုပ်သည့် မူဝါဒ mode က valid:

| Mode ကို              | အဓိပ္ပါယ်                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` | သာမန် အများပြည်သူ ငွေကြေးစာရင်းများနှင့် ငွေလွှဲပြောင်းမှုများသာ လက်ခံသည်။          |
| `Convertible`     | သုံးစွဲသူတွေဟာ အများပြည်သူရဲ့ ငွေကြေးပမာဏနဲ့ ကာကွယ်ထားတဲ့ ငွေစက္ကူတွေကြားမှာ တန်ဖိုးကို ရွှေ့နိုင်ပါတယ်။ |
| `ShieldedOnly`    | အရင်းအမြစ်ထုတ်လွှင့်ခြင်းနှင့် ငွေလွှဲပြောင်းခြင်းသည် ကာကွယ်ထားသောစာရင်းတွင် ဆက်ရှိနေရမည်။   |

## သုံးပုံ {#how-to-use-them}

1. Validator node တွေမှာ လျှို့ဝှက်ထောက်ပံ့မှုကို enable လုပ်ပါ။
   verifier backend, active verifying keys, Poseidon/Pedersen parameter
   IDs, node တွေက peers (သို့) blocks ကို reject လုပ်ကြတယ်
   မမှန်ကန်တဲ့ လျှို့ဝှက်ချက် အချက်အလက်တွေ
2. Verification keys နဲ့ parameters set တွေကို ထုတ်ဝေ (သို့) မှတ်ပုံတင်ပါ။
   ဘောလုံးများနှင့် operator များသည် key ကို
   `VerifyingKeyId`, ဥပမာ `halo2/ipa:vk_transfer`.
3. အရင်းအမြစ်ကို မှတ်ပုံတင်ခြင်း ZK- အရည်အသွေးနဲ့ `RegisterZkAsset`, (သို့) အဆင့် A
   မူဝါဒကူးပြောင်းမှု `TransparentOnly` သို့ `Convertible` ဒါမှမဟုတ်
   `ShieldedOnly`.
4. ပြည်သူ့ဘဏ္ဍာငွေကို ကာကွယ်ပေးရန် `Shield`. ပိုက်ဆံအိတ်က စာရွက်စာတမ်းကို ချုပ်ဆိုပေးတယ်။
   လက်ခံရရှိသူအတွက် ကုဒ်သွင်းထားတဲ့ အသုံးဝင်ဝန်ဆောင်မှု
   ငွေပေးချေမှု။
5. ငွေလွှဲပြောင်းရေး `ZkTransfer`. ပိုက်ဆံအိတ်က သက်သေပြတာက
   input note တွေကို ပိုင်ဆိုင်ထားပြီး input နဲ့ output တန်ဖိုးတွေကို balance လုပ်ထားပြီး
   ကုန်ကျတဲ့ ငွေစက္ကူတိုင်းဟာ မကြာသေးခင်က ကတိပေးထားတဲ့ သစ်ပင်မှာ ခိုင်မာစွာ ချိတ်ဆက်ထားတယ်။
6. ပိုင်ဆိုင်မှု မူဝါဒက ခွင့်ပြုတဲ့အခါပဲ ကန့်သတ်ထားပါ။ `Unshield` ပြသနေတာက
   အများပြည်သူငွေကြေးနဲ့ လက်ခံရရှိသူရဲ့ အကောင့်ကိုသုံးပြီး ပုဂ္ဂလိက ငွေစက္ကူအငြင်းပွားစေတဲ့ ငွေကြေး
   ကိုယ်ပိုင် ပြောင်းလဲမှု ထုတ်ကုန်တွေ ဖန်တီးနိုင်ပါတယ်။
7. လျှို့ဝှက်ဖြစ်ရပ်များ၊ သက်သေခံမှတ်တမ်းများ၊ ဖျက်သိမ်းသူ အခြေအနေများကို ဖတ်ရှုခြင်းဖြင့် စစ်ဆေးခြင်း၊
   အမည်မသိ ဂိုဏ်းမှတ်တမ်းတွေကို ရိုက်နှိပ်မေးမြန်းချက်တွေနဲ့ Torii အဆုံးသတ်မှတ်ချက်တွေ။

## CLI ဥပမာများ {#cli-examples}

နိုင်ငံခြားရေး ZK CLI အမိန့်များသည် operator နှင့် test flow များအတွက် ရည်ရွယ်ထားသည်။
ငွေကြေးအိတ်များမှာ ကတိပေးချက်များ၊ ကုဒ်သွင်းထားသော အသုံးဝင်ပစ္စည်းများနှင့် သက်သေခံအချက်အလက်များကို
ရလာတဲ့ ညွှန်ကြားချက်တွေကို မတင်ခင် wallet/provider library ကိုပါ။

ဟိုက်ဘရစ်ကို မှတ်ပုံတင်ပါ။ ZK- အရင်းအမြစ်အတတ်နိုင်မှု:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

ကာကွယ်ထားတဲ့ မှတ်စုအတွက် versioned encrypted payload envelope ကို တည်ဆောက်ပါ။

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

ငွေကြေးပမာဏကို ပိုင်ဆိုင်မှုအပြည့်အဝရှိစေရန်၊

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

အကာအကွယ်မပါဘဲ အထောက်အထားတပ်ဆင်ထားခြင်း JSON:

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

## SDK ဥပမာ {#sdk-example}

အတိအကျအထောက်အထား bytes ကို configured proof backend မှလာသည်။
ရောင်းဝယ်မှု အသုံးဝင် ဝန်ဆောင်မှုအတွက် အများပြည်သူ အချက်အလက်များနှင့် သက်သေခံ အထောက်အထားကိုသာ လိုအပ်ပါသည်။

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

## အမည်မသိ အရင်းအမြစ်များအတွက် အာမခံ {#anonymous-asset-escrow}

အမည်မသိ အရင်းအမြစ်အထောက်အပံ့ပေးသည်မှာ အလားတူကာကွယ်ထားသော ငွေလွှဲပြောင်းစက်ကို အသုံးပြုသည်။
ငွေကြေးထောက်ပံ့မှုအခွင်အကျ
ဘဏ္ဍာရေး၊ ပြန်လည်ပေးသွင်းမှု၊ ဖျက်သိမ်းခြင်းနဲ့ ဖြေရှင်းမှု ခြေထောက်များ
ပိတ်ပင်ထားသော ဖျက်သိမ်းရေးကိရိယာများနှင့် ထုတ်ကုန်ဆိုင်ရာ ကတိပေးချက်များကို အသုံးပြုပါ။

အသေးစိတ်ဂိုဏ်းအတွက် ISI အပြုအမူနှင့် နမူနာများကို ကြည့်ပါ
[Native Asset Escrow](/my/blockchain/escrow.md#anonymous-escrow).

သက်တမ်း စက်ဝန်းက

1. `OpenAnonymousAssetEscrow` ငွေကြေးထောက်ပံ့မှုအခွန်ကို ပေးပြီး
   ငွေကြေးထောက်ပံ့မှု ကတိပါ။
2. `AcceptAnonymousAssetEscrow` ဝယ်သူကို မှတ်တမ်းတင်တယ်။
3. `MarkAnonymousEscrowPaymentSent` ဝယ်ယူသူက ပေးပို့တဲ့ မှတ်တမ်းများ
   ချိတ်ဆက်မှုအပြင်မှာပါ။
4. `ReleaseAnonymousAssetEscrow` ဝယ်ယူသူအတွက် အချုပ်အခြာခံစာကို သုံးတယ်။
   ထုတ်ကုန် ကတိပေးချက်များ။
5. `CancelAnonymousAssetEscrow` ရောင်းသူဆီ ပြန်လည်ပေးပို့တဲ့ ကတိကဝတ်ကို သုံးတယ်။
   ငွေပေးချေမှု မှတ်သားမထားသေးတဲ့ ထုတ်ကုန် ကတိတွေ
6. `OpenAnonymousEscrowDispute` နှင့် `ResolveAnonymousEscrowDispute` လက်ကိုင်
   အငြင်းပွားဖွယ် သွင်းချက်များနှင့် သက်သေခံ hashes နှင့် resolver ထိန်းချုပ် split ကို။

အမည်မသိ ဂိုဏ်းစာရင်းတွင် ဖော်ပြထားသော မေးမြန်းချက်များကို အသုံးပြုပါ။
[မေးခွန်းများ](/my/reference/queries.md#escrow-and-proof-records) ငွေကြေးထောက်ပံ့မှုကို စစ်ဆေးဖို့
မှတ်တမ်းများနှင့် အခြေအနေများ

## သင်္ချာ {#math}

အောက်ပါ စာရင်းမှာ လျှို့ဝှက်အထောက်အပံ့စီးဆင်းမှုကို ဖော်ပြထားပါတယ်။
Active circuit နဲ့ parameter ကို သုံးပါ။ IDs အရင်းအမြစ် မူဝါဒနှင့် စစ်ဆေးသူမှ
registry, ဒီတော့ဖောက်သည်များက commitment များ၊ nullifiers များနှင့်သက်သေ bytes ကိုကုသသင့်ပါတယ်
ပိုက်ဆံအိတ်/ပရိုဂျက်ရဲ့ မရှင်းလင်းတဲ့ ထွက်ပေါက်တွေအဖြစ်။

ကာကွယ်ထားတဲ့ မှတ်စုကို အောက်ပါအတိုင်း ဖော်ပြနိုင်ပါတယ်

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

ဘယ်မှာ `owner` ရယူသူရဲ့ ကြည့်ရှုမှု (သို့) ကုန်ကျစရိတ် ပစ္စည်းကနေရတာပါ။
`rho` ဒါက အမှတ်တရဖြစ်စဉ်ပါ။

စာရွက်စာတမ်း ကတိကဝတ်ဟာ လျှို့ဝှက်ထားတဲ့ ကတိပါ။

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

လက်ရှိ လျှို့ဝှက်လွှဲပြောင်းမှု ပတ်လမ်းများအတွက် အများပြည်သူဝင်ငွေများမှာ
ကတိပေးချက်တွေ၊ ဖျက်သိမ်းသူတွေ၊ Merkle အမြစ်၊ အရင်းအမြစ် အမှတ်တံဆိပ်နဲ့ သံစဉ် အမှတ်တံဆိန်တွေ
စက်ဝန်းက ဒီလိုပုံစံမျိုး ကတိပေးမှု ဆက်စပ်မှုကို အားဖြည့်ပေးတယ်။

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

ငွေစက္ကူတစ်စောင် ကုန်ကျတဲ့အခါ ပိုက်ဆံအိတ်က အငြင်းပွားစရာတစ်ခု ရပါတယ်။

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ဒါက မှတ်စုကို မဖော်ထုတ်ပေမဲ့ အဲဒီမှတ်စုအတွက် တည်ငြိမ်ပါတယ်။
ပြီးတော့ သံကြိုးတွေ Iroha နောက်တစ်ကြိမ် သုံးစွဲမှုကိုလည်း အငြင်းပွားစေတဲ့ ကိရိယာတစ်ခုတည်းနဲ့ ပယ်ချနိုင်ပါတယ်။

ကတိပေးမှု အပင်က မှတ်စု တည်ရှိမှုကို သက်သေပြတယ်။ ငွေကြေးအိတ်တစ်ခုက ကတိပေးမှုကို သုံးရင်
`C_i`, အထောက်အထားမှာ Merkle လမ်းကြောင်းတစ်ခု ပါဝင်ပါတယ်။ `C_i` မကြာသေးခင်က
အများပြည်သူ root:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

အကာအကွယ်ပေးထားတဲ့ ငွေလွှဲပြောင်းမှုအတွက် အထောက်အထားက တန်ဖိုးကိုလည်း အားဖြည့်ပေးတယ်။
ထိန်းသိမ်းရေး

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

ပံ့ပိုးမှုမရှိတဲ့အတွက် အများပြည်သူငွေကြေးကိုပါ ၀ င်ပါတယ်

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

တင်ပြထားတဲ့ အထောက်အထားကို အောက်ပါအတိုင်း စုစည်းနိုင်ပါတယ်

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

ဘယ်မှာ `public_inputs` ကတိပေးချက်တွေ၊ ဖျက်သိမ်းသူတွေ၊ အမြစ်၊ အရင်းအမြစ် အမှတ်တံဆိပ်တွေ
သံကြိုးတံဆိပ်နဲ့ အများပြည်သူအတွက် ပိတ်ထားမှုမရှိတဲ့ ငွေအကုန်လုံး
အရေအတွက်များ၊ ကျပန်းဖြစ်စဉ်၊ ကုန်ကျစရိတ် ပစ္စည်းများနှင့် Merkle လမ်းကြောင်းများ။
အထောက်အထားနဲ့ နောက်ပြီး အပြောင်းအလဲပြုလုပ်တဲ့ စာရင်းမှတ်တမ်းအခြေအနေကို ထုတ်ကုန်ဆိုင်ရာ ကတိပေးချက်တွေကို ချိတ်ဆက်ခြင်းဖြင့်
သုံးစွဲထားတဲ့ input nullifiers တွေကို အမှတ်တံဆိပ်ပေးပါ။

## အများပြည်သူ သိရှိနိုင်သော အရာများ {#what-is-public}

အမည်မဲ့ ငွေပေးချေမှုတွေဟာ လေ့လာလို့ရတဲ့ အချက်အလက်တိုင်းကို ပုဂ္ဂလိကအဖြစ် မသတ်မှတ်ပါဘူး။
အောက်ပါ အချက်အလက်များ အများပြည်သူသိရှိနိုင်သေးသည်။

- Transaction hash၊ block height နဲ့ ordering ကို
- လျှောက်လွှာကို တင်ပြသူ ငွေပေးချေမှု အာဏာပိုင်က
  ပုဂ္ဂလိကဝင်ရောက်မှုမှတ်တိုင် (သို့) ပြန်လည်တင်သွင်းခြင်းပုံစံ
- အသုံးပြုနေသော အရင်းအမြစ် သတ်မှတ်ချက်
- အငြင်းပွားမှုနှင့် ထုတ်ကုန်ဆိုင်ရာ ကတိပေးချက်များ
- proof hashes တွေ၊ verifying key references တွေနဲ့ optional envelope hashs တွေ
- အများပြည်သူအတွက် ငွေကြေးပမာဏနှင့် လက်ခံစာရင်း `Unshield`
- အမည်မသိ ဂိုဏ်းရောင်းသူ၊ ဝယ်သူ၊ အခြေအနေ၊ အချိန်စိပ်များနှင့် သက်သေခံ hashes

ဒီဇိုင်း Application တွေကိုဒီပရော်ဖက်ရှင်နယ် metadata ကိုမဖော်ထုတ်နိုင်အောင်
ကိုယ်ကာကွယ်ဖို့ ကြိုးစားနေတဲ့ ဆက်ဆံရေးပါ။

## ဆက်စပ်သော ရည်ညွှန်းချက်များ {#related-reference}

- [`AssetConfidentialPolicy`](/my/reference/data-model-schema.md)
- [`ConfidentialEvent`](/my/reference/data-model-schema.md)
- [`ProofAttachment`](/my/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/my/reference/data-model-schema.md)
- [ငွေကြေးထောက်ပံ့မှုနှင့် သက်သေပြချက်များ](/my/reference/queries.md#escrow-and-proof-records)
