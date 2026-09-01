---
translation_locale: my
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အမည်မသိ ငွေပေးချေမှု {#anonymous-transactions}

Iroha တွင် အမည်မသိ ငွေပေးချေမှုများကို လျှို့ဝှက်သော အရင်းအမြစ်လုပ်ငန်းများမှ တည်ဆောက်ထားသည်။ အများပြည်သူငွေကြေးဖြင့် အများပိုင်စာရင်းမှ စာရင်းသို့ ငွေလွှဲပြောင်းမှုများ ရေးသားခြင်းအစား ပိုက်ဆံအိတ်သည် တန်ဖိုးကို ကန့်သတ်ထားတဲ့ blockchain လက်မှတ်ထဲသို့ ရွှေ့ဆိုင်းပြီး သုညသိပ္ပံသက်သေသနနှင့်အတူ မရှင်းလင်းတဲ့ မှတ်စုများကို သုံးစွဲသည်။

အများပြည်သူ blockchain ledger သည် လျှို့ဝှက်လုပ်ဆောင်မှုတစ်ခုဖြစ်ပွားခဲ့ကြောင်း မှတ်တမ်းတင်နေဆဲဖြစ်သည်။ ၎င်းသည် cryptographic commitment တန်ဖိုးများ၊ nullifiers များ၊ သက်သေခံ cryptographic hash များနှင့်ဖြစ်ရပ်များကိုမှတ်တမ်းတင်ထားသော်လည်း note ပိုင်ရှင်၊ လက်ခံရရှိသူ သို့မဟုတ် shielded to shielded လှုပ်ရှားမှုအတွက်ပမာဏကိုမှတ်တမ်းတင်ခြင်းမရှိပါ။ ပုံမှန် ငွေပေးချေမှု ဒေတာ ကွန်တိန်နာမှာ တင်သွင်းတဲ့ အကောင့်ကို ဆက်လက် ဖော်ပြနိုင်တာကြောင့် "အမည်မသိ" ဆိုတာက ကွန်ရက်အဆင့် (သို့) အကောင့်အဆင့် အမည်မဲ့ခြင်းမဟုတ်ဘဲ အမည်မဲ့ အရင်းအမြစ် ရွေ့ရှားမှုကို ဆိုလိုတာပါ။

## အဆောက်အအုံများ {#building-blocks}

|အယူအဆ|blockchain ledger ကို ကိုယ်စားပြုခြင်း |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|ပံ့ပိုးထားသော မှတ်ချက်|ပိုင်ဆိုင်သူ ဒေတာ၊ ငွေကြေးပမာဏနဲ့ ကျပန်းမှုပါတဲ့ ပုဂ္ဂလိက ချုပ်ကိုင်ငွေမှတ်တမ်းပါ။ |
|cryptographic commitment တန်ဖိုး |32-byte အများသုံးတန်ဖိုးတစ်ခု၊ ၎င်းရဲ့နယ်ပယ်တွေကို မဖေါ်ပြဘဲ မှတ်စုကို cryptographically ချိတ်ဆက်ပါတယ်။ |
|ဖျက်သိမ်းသူ |မှတ်စုတစ်ခု ကုန်ကျတဲ့အခါ ရယူတဲ့ 32-byte အများသုံးတန်ဖိုးပါ။ Iroha နှစ်ထပ်သုံးစွဲမှုကို တားဆီးဖို့ အကြိမ်ကြိမ် ဖျက်သိမ်းတာကို ပယ်ချတယ်။ |
|Merkle အမြစ်|ရင်းနှီးမြှုပ်နှံမှုအတွက် cryptographic commitment value tree ရဲ့ မကြာသေးခင်က အမြစ်ပါ။ သက်သေခံတွေက သုံးစွဲထားတဲ့ ငွေစက္ကူတွေ ရှိတာကို ပြသဖို့သုံးတယ်။ |
|အထောက်အထား တပ်ဆင်ခြင်း |`ProofAttachment` မှာ proof byte တွေနဲ့ verification key reference (သို့) inline verification key ကို ထည့်သွင်းထားတယ်။ |
|လျှို့ဝှက်ဖြစ်ရပ် |`ConfidentialEvent::Shielded`, `Transferred` သို့မဟုတ် `Unshielded` ကဲ့သို့သော blockchain ledger အဖြစ်အပျက်များ။ |

အဓိက ညွှန်ကြားချက်တွေကတော့-

- `RegisterZkAsset`: အရင်းအမြစ်ကို ZK-အတတ်နိုင်သူအဖြစ် မှတ်ပုံတင်ပြီး လွှဲပြောင်းမှု၊ ပိတ်ပင်ခြင်းနှင့် ပိတ်ပင်မှုမရှိသော စစ်ဆေးရေး သော့များကို ချည်နှောင်သည်။
- `Shield`: အများပြည်သူငွေကြေးစာရင်းကို ချေဖျက်ပြီး ကပ်လှည့်ထားတဲ့ ငွေစက္ကူအတွက် cryptographic commitment value ကိုထည့်သွင်းတယ်။
- `ZkTransfer`: ပိတ်ထားသော ငွေကြေးစက္ကူများကို ပိတ်ထားသည့် ငွေကြေး စက္ကူအသစ်များ၏ cryptographic commitment values များသို့ သုံးစွဲပေးသည်။
- `Unshield`: ပိတ်ပင်ထားသော ငွေကြေးစက္ကူများကို သုံးစွဲပြီး အများပိုင်စာရင်းကျန်ရစ်ငွေကို ခရက်ဒစ်ပေးသည်။
- `ScheduleConfidentialPolicyTransition` နှင့် `CancelConfidentialPolicyTransition`: စီမံခန့်ခွဲမှုမှတစ်ဆင့် အရင်းအမြစ်၏ လျှို့ဝှက်မူဝါဒကိုပြောင်းလဲခြင်း။

အရင်းအမြစ် သတ်မှတ်ချက်မှာလည်း [`AssetConfidentialPolicy`](/my/reference/data-model-schema.md). စီးဆင်းမှုများကို ထိန်းချုပ်သည့် မူဝါဒပုံစံသည် သက်ဝင်သည်။

|Mode ကို|အဓိပ္ပါယ်|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |သာမန် ပြည်သူ့ငွေကြေးစာရင်းများနှင့် ငွေလွှဲပြောင်းမှုများကိုသာ လက်ခံသည်။ |
|`Convertible` |သုံးစွဲသူတွေဟာ အများပိုင် ငွေကြေးစာရင်းနဲ့ ပိတ်ထားတဲ့ ငွေစက္ကူတွေကြားမှာ တန်ဖိုးကို ရွေ့ရှားနိုင်ပါတယ်။|
|`ShieldedOnly` |အရင်းအမြစ်ထုတ်လွှင့်မှုနဲ့ လွှဲပြောင်းမှုတွေဟာ ကာကွယ်ထားတဲ့ blockchain လက်မှတ်ထဲမှာ ရှိနေဖို့လိုပါတယ်။ |

## သုံးပုံ {#how-to-use-them}

1. Validator node များတွင် လျှို့ဝှက်ထောက်ပံ့မှုကိုဖွင့်ပါ။ validators တို့သည် verifier backend, active verifying keys, Poseidon/Pedersen parameter IDs နှင့် confidential rules version တို့ကို သဘောတူညီရန်လိုအပ်သည်။ node များက network peers သို့မဟုတ် confidential feature တွေနှင့်မလိုက်ဖက်သော cryptographic digests များရှိသည့် blocks ကိုငြင်းပယ်ရမည်။
2. ပတ်လမ်းတွေသုံးတဲ့ စစ်ဆေးရေး သော့တွေနဲ့ ပမာဏစုတွေကို ထုတ်ဝေ (သို့) မှတ်ပုံတင်ပါ။ Wallet တွေနဲ့ operator တွေက `VerifyingKeyId` မှာ သော့တွေကို ရည်ညွှန်းသင့်တယ်၊ ဥပမာ `halo2/ipa:vk_transfer` ပါ။
3. အရင်းအမြစ်ကို ZK-အရည်အချင်းရှိသူအဖြစ် `RegisterZkAsset` တွင် မှတ်ပုံတင်ခြင်း သို့မဟုတ် `TransparentOnly` မှ `Convertible` သို့ (သို့) `ShieldedOnly` သို့ မူဝါဒကူးပြောင်းမှုတစ်ခု ပြုလုပ်ခြင်း။
4. `Shield` ဖြင့် အများပြည်သူငွေကြေးကိုကာကွယ်ပါ။ ငွေစက္ကူသည် ငွေလွှဲပြောင်းမှုကို မတင်မီ လက်ခံရရှိသူအတွက် စာဝှက်စာရင်းချိတ်ဆက်မှုတန်ဖိုးနှင့် ကုဒ်သွင်းထားသော အသုံးဝင်ဝန်ဆောင်မှုများကို ဖန်တီးသည်။
5. `ZkTransfer` ဖြင့် ပုဂ္ဂလိက လွှဲပြောင်းပါ။ ငွေကြေးစက္ကူသည် ဝင်ငွေမှတ်စုများကို ပိုင်ဆိုင်ကြောင်း၊ ဝင်ငွေနှင့်ထွက်ငွေတန်ဖိုးများ ဟန်ချက်ညီမှုရှိကြောင်း၊ ကုန်ကျသောမှတ်စုတိုင်းကို မကြာမီက cryptographic commitment value tree တွင် ချိတ်ဆက်ထားကြောင်း သက်သေထူစေသည်။
6. `Unshield` ကတော့ အများပြည်သူရဲ့ ငွေကြေးပမာဏနဲ့ လက်ခံရရှိသူရဲ့ အကောင့်ကို ဖော်ထုတ်ပေးပြီး ပုဂ္ဂလိက မှတ်ပုံတင်အငြင်းပွားမှုကို သုံးပြီး ပုဂ္ဂိုလ်ရေး ငွေလဲလှယ်မှု ထုတ်ကုန်တွေ ဖန်တီးနိုင်တာပါ။
7. လျှို့ဝှက်ဖြစ်ရပ်များ၊ အထောက်အထားမှတ်တမ်းများ၊ ဖျက်သိမ်းသူအခြေအနေနှင့် အမည်မသိ ကမ်းလှမ်းမှု မှတ်တမ်းများကို Torii API အဆုံးအဖြတ်ချက်များမှတဆင့် ဖတ်ရှုခြင်းဖြင့် စစ်ဆေးခြင်း။

## CLI ဥပမာများ {#cli-examples}

ZK CLI commands တွေကို operator နဲ့ test flow တွေအတွက် ရည်ရွယ်ထားပါတယ်။ Production wallets တွေဟာ resulting instruction တွေကို မပို့ခင်မှာ cryptographic commitment values တွေ၊ encrypted payloads တွေနဲ့ proofs တွေကို wallet/prover စာကြည့်တိုက်နဲ့ ထုတ်ပေးသင့်ပါတယ်။

ဟိုက်ဘရစ် ZK အရည်အချင်းရှိတဲ့ ပိုင်ရှင်ကို မှတ်ပုံတင်ပါ

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

ကာကွယ်ထားတဲ့ မှတ်စုအတွက် versioned encrypted payload data container တစ်ခုကို တည်ဆောက်ပါ။

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI သည် အရင်းအမြစ်မူဝါဒ၊ စစ်ဆေးရေးအဓိက အချက်အလက်များနှင့် ကုဒ်သွင်းထားသော မှတ်ပုံတင် ဒေတာ ကွန်တိန်နာကို ပြင်ဆင်သည်။ ၎င်းသည် `shield` သို့မဟုတ် `unshield` ငွေကြေးပံ့ပိုးမှု အစိတ်အပိုင်းများကို ဖော်ပြခြင်းမရှိပါ။ ထိုညွှန်ကြားချက်များကို SDK ဖြင့် တည်ဆောက်ပြီး အခွန်စျေးနှုန်းခန့်မှန်းချက်ဖြင့် ပုံမှန် လက်မှတ်ထိုးထားသည့် ငွေကြေးပေးချေမှုအဖြစ် တင်ပြပါမည်။

အကာအကွယ်မရှိတဲ့ အထောက်အပံ့တစ်ခုမှာ ဒီလိုပုံစံရှိပါတယ်။

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

## SDK ဥပမာ {#sdk-example}

အတိအကျအထောက်အထား bytes ကို configured proof backend မှလာသည်။ transaction payload တွင် အများသုံး input နှင့် proof attachment များသာလိုအပ်သည်:

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

## အမည်မဖော်လိုသော အရင်းအမြစ်ငှားရန် {#anonymous-asset-escrow}

အမည်မသိ အရင်းအမြစ်အမှတ်တံဆိပ်က သိမ်းထားတဲ့ တန်ဖိုးအတွက် အလားတူ ကာကွယ်ထားတဲ့ ငွေလွှဲပြောင်းရေး စက်ကို သုံးတယ်။ ဖက်ရှင်များနှင့် သိမ်းထားမှုအခြေအနေဟာ သိမ်းထားမှု မှတ်တမ်းမှာ မှတ်တမ်းတင်နေဆဲဖြစ်ပေမဲ့ ဘဏ္ဍာငွေ၊ လွှတ်ပေးခြင်း၊ ဖျက်သိမ်းမှု၊ ငွေကြေးလွှဲပြောင်းမှု အစိတ်အပိုင်းများတွင် ပိတ်ပင်ထားသော nullifiers များကို အသုံးပြုပြီး cryptographic commitment တန်ဖိုးများကို ထုတ်ပေးသည်။

ISI အပြုအမူနှင့် နမူနာများအတွက် [Native Asset Escrow](/my/blockchain/escrow.md#anonymous-escrow) ကို ကြည့်ပါ။

ဘဝ စက်ဝန်းက-

1. `OpenAnonymousAssetEscrow` ကမ်းလှမ်းထားတဲ့ ငွေကြေးမှတ်ပုံတင်ငွေတွေကို သုံးပြီး ဂိုဏ်းဝှက်ချိတ်ဆက်မှု တန်ဖိုး တစ်ခုကို ဖန်တီးတယ်။
2. `AcceptAnonymousAssetEscrow` ဝယ်သူကို မှတ်တမ်းတင်တယ်။
3. `MarkAnonymousEscrowPaymentSent` မှာ ဝယ်သူက ငွေပေးချေမှုကို ကွင်းဆက်အပြင်မှာ ပေးပို့ခဲ့တယ်လို့ မှတ်တမ်းတင်ထားတယ်။
4. `ReleaseAnonymousAssetEscrow` ကော်ပိုရေးရှင်းက ၀ယ်ယူသူထုတ်ပြန်တဲ့ ဝှက်ဝှက်ဝှက်ချေးငွေတန်ဖိုးကို ဂိုဏ်းဝှက်စာရင်းချမှတ်မှု တန်ဖိုးကိုသုံးတယ်။
5. `CancelAnonymousAssetEscrow` သည် ငွေပေးချေမှု မှတ်တမ်းတင်ခြင်းမရှိပါက ရောင်းသူထုတ်ပြန်သည့် စာဝှက် ချုပ်ဆိုချက် တန်ဖိုးကို ပြန်လည်သုံးစွဲသည်။
6. `OpenAnonymousEscrowDispute` နှင့် `ResolveAnonymousEscrowDispute` တို့သည် သက်သေခံအချက်အလက်များအတွက် cryptographic hash များနှင့် resolver ထိန်းချုပ်ထားသော split ကိုပြုလုပ်၍ အငြင်းပွားဖွယ် escrow များကို စီမံခန့်ခွဲသည်။

[မေးခွန်းများ](/my/reference/queries.md#escrow-and-proof-records) တွင်ဖော်ပြထားသော အမည်မသိ ဂိုဏ်းမှတ်တမ်းများကို အသုံးပြု၍ ဂိုဏန်းမှတ်တမ်းနှင့် အခြေအနေများကို စစ်ဆေးပါ။

## သင်္ချာ {#math}

အောက်ပါမှတ်သားချက်မှာ လျှို့ဝှက်အရင်းအမြစ်စီးဆင်းမှုကို သရုပ်ဖော်ထားသည်။ အကောင်အထည်ဖော်မှုများသည် အရင်းအမြစ်မူဝါဒနှင့် စစ်ဆေးသူ မှတ်ပုံတင်မှ တက်ကြွသော ပတ်လမ်းနှင့် ပမာဏ ID များကိုအသုံးပြုသည်၊ ထို့ကြောင့် ဖောက်သည်တို့သည် cryptographic commitment တန်ဖိုးများ၊ nullifiers နှင့် proof bytes တို့ကို wallet / prover ၏ မရှင်းလင်းသောထွက်ကုန်များအဖြစ်ပြုပြင်သင့်သည်။

ပိတ်ထားသော မှတ်စုကို အောက်ပါအတိုင်း ဖော်ပြနိုင်သည်

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

`owner` သည် လက်ခံသူ၏ ကြည့်ရှုမှု (သို့) ကုန်ကျစရိတ်ပစ္စည်းများမှ ရယူထားပြီး `rho` သည် အမှတ်မထင်ဖြစ်စဉ်ဖြစ်သည်။

စာရွက်စာတမ်း cryptographic commitment တန်ဖိုးသည် ပုန်းကွယ်နေတဲ့ cryptographic engagement တန်ဖိုးဖြစ်ပါသည်။

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

လက်ရှိ လျှို့ဝှက်လွှဲပြောင်းမှု ပတ်လမ်းများအတွက် အများပြည်သူဝင်ငွေများတွင် မှတ်စု cryptographic commitment တန်ဖိုးများ၊ nullifiers များ၊ Merkle အမြစ်တစ်ခု၊ အရင်းအမြစ် tag တစ်ခုနှင့် Chain Tag ကိုပါ ၀ င်သည်။ ပတ်လမ်းသည်ဤပုံစံ၏ cryptographic engagement value ဆက်နွယ်မှုကိုတင်းမာစေသည်။

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

ငွေစက္ကူတစ်စောင် ကုန်ကျတဲ့အခါ ပိုက်ဆံအိတ်က အငြင်းပွားစရာကို ထုတ်ယူတယ်။

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ဟာ အများပြည်သူပါ။ စာရွက်စာတမ်းကို မဖေါ်ပြပေမဲ့ အဲဒီစာရွက်စာတမ်းနဲ့ ချိတ်ဆက်မှုအတွက် တည်ငြိမ်ပါတယ်၊ ဒီတော့ Iroha ဟာ တူညီတဲ့ nullifier နဲ့ ဒုတိယသုံးစွဲမှုကို ပယ်ချနိုင်မှာပါ။

cryptographic commitment value tree သည် note တည်ရှိမှုကို သက်သေပြသည်။ wallet တစ်ခုသည် cryptographic engagement value `C_i` ကိုသုံးစွဲပါက သက်သေခံမှာ `C_i` မှ မကြာသေးမီက အများပြည်သူ root သို့ သီးသန့် Merkle လမ်းကြောင်းတစ်ခုပါဝင်သည်။

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

အကာအကွယ်ကနေ ပိတ်ထားတဲ့ လွှဲပြောင်းမှုအတွက် သက်သေက တန်ဖိုးကို ထိန်းသိမ်းဖို့လည်း အာမခံပေးပါတယ်။

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

ပံ့ပိုးမှုမရှိတဲ့အတွက် အများပြည်သူငွေကြေးကို ထည့်သွင်းထားပါတယ်-

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

တင်ပြထားသော အထောက်အထားကို အောက်ပါအတိုင်း စုစည်းနိုင်သည်-

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

`public_inputs` သည် cryptographic commitment values များ၊ nullifiers များ၊ root များ၊ asset tag များ၊ chain tag များနှင့် public unshielded ပမာဏများဖြစ်ပါသည်။ သက်သေသည် note amounts များ၊ randomness များ၊ spend material များနှင့် Merkle paths များကိုပါဝင်သည်။ Validators တွေက သက်သေကို စစ်ဆေးပြီး ပြီးရင် ထုတ်ပြန်တဲ့ cryptographic commitment တန်ဖိုးတွေကို ထည့်သွင်းရင်းနဲ့ input nullifiers တွေကို ကုန်ကျသလို အမှတ်တံဆိပ်ပေးရင်း blockchain ledger အခြေအနေကို ပြောင်းပစ်ပါတယ်။

## အများပြည်သူ သိရှိနိုင်သော အရာများ {#what-is-public}

အမည်မဲ့ ငွေပေးချေမှုတွေဟာ လေ့လာလို့ရတဲ့ အချက်အလက်တိုင်းကို ပုဂ္ဂလိကအဖြစ် မသတ်မှတ်ပါဘူး။ အောက်ပါအချက်အလက်တွေကို အများပြည်သူ သိရှိနိုင်တုန်းပါ။

- Transaction cryptographic hash၊ block height နဲ့ ordering တွေကို
- လျှောက်လွှာတွင် ပုဂ္ဂလိကဝင်ရောက်မှုမှတ်တိုင် (သို့) ပြန်လည်ထည့်သွင်းပုံပုံစံကို အသုံးပြုခြင်းမရှိပါက တင်ပြသည့် ငွေချေးငွေ ခွင့်ပြုချက် မူလစာရင်း
- အသုံးပြုနေသော အရင်းအမြစ် သတ်မှတ်ချက်
- Nullifiers များနှင့် Output cryptographic commitment values များ
- proof cryptographic hashes များ၊ verifying key references များနှင့် optional data container cryptographic Hashs များ။
- `Unshield` အတွက် အများပြည်သူငွေကြေးနှင့် လက်ခံစာရင်း။
- Anonymous escrow seller, buyer, status, timestamp, and evidence cryptographic hashes ကို အမည်မဖော်လိုသူ

ဒီပရိုဂရမ်တွေကို ဒီဇိုင်းထုတ်ပါ၊ ဒီတော့ ဒီ အများသုံး metadata က ကိုယ်ကာကွယ်ဖို့ ကြိုးစားနေတဲ့ စီးပွားရေး ဆက်ဆံရေးကို မဖေါ်ပြနိုင်ပါ။

## ဆက်စပ်သော ရည်ညွှန်းချက် {#related-reference}

- [`AssetConfidentialPolicy`](/my/reference/data-model-schema.md)
- [`ConfidentialEvent`](/my/reference/data-model-schema.md)
- [`ProofAttachment`](/my/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/my/reference/data-model-schema.md)
- [ငွေကြေးထောက်ပံ့မှုနှင့် သက်သေပြမှု မေးခွန်းများ](/my/reference/queries.md#escrow-and-proof-records)
