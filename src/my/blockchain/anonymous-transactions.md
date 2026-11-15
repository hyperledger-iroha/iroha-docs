---
translation_locale: my
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c498808369cd53406960e2dc7d88cea1d9c24affe1ba9a351a3192422959ed2e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# အမည်မသိ ငွေပေးချေမှု {#anonymous-transactions}

Iroha တွင် အမည်မသိ ငွေပေးချေမှုများကို လျှို့ဝှက်သော အရင်းအမြစ်လုပ်ငန်းများမှ တည်ဆောက်ထားသည်။ အများပြည်သူငွေကြေးဖြင့် အများပိုင်စာရင်းမှ စာရင်းသို့ ငွေလွှဲပြောင်းမှုများ ရေးသားခြင်းအစား ပိုက်ဆံအိတ်သည် တန်ဖိုးကို ကန့်သတ်ထားတဲ့ blockchain လက်မှတ်ထဲသို့ ရွှေ့ဆိုင်းပြီး သုညသိပ္ပံသက်သေသနနှင့်အတူ မရှင်းလင်းတဲ့ မှတ်စုများကို သုံးစွဲသည်။

အများမြင် လယ်ဂျာတွင် လျှို့ဝှက်လုပ်ဆောင်ချက် ဖြစ်ပွားခဲ့ကြောင်းကို မှတ်တမ်းတင်ထားဆဲဖြစ်သည်။ ကတိပြုတန်ဖိုးများ၊ နလီဖိုင်ယာများ၊ သက်သေ ဟက်ရှ်များနှင့် ဖြစ်ရပ်များကို မှတ်တမ်းတင်သော်လည်း အကာအကွယ်ပေးထားသည့်တန်ဖိုးကို အကာအကွယ်ပေးထားသည့်တန်ဖိုးသို့ လွှဲပြောင်းရာတွင် မှတ်စု၏ ပိုင်ရှင်၊ လက်ခံသူ သို့မဟုတ် ပမာဏကို မှတ်တမ်းမတင်ပါ။ ပုံမှန် ငွေလွှဲအိတ်ပုံစံသည် တင်သွင်းသည့် အကောင့်ကို ဖော်ပြနိုင်သေးသောကြောင့် ဤနေရာတွင် “အမည်မဖော်” ဆိုသည်မှာ ပိုင်ဆိုင်မှုတန်ဖိုး ရွှေ့ပြောင်းမှုကို အမည်မဖော်ခြင်းသာ ဖြစ်ပြီး ကွန်ရက်အဆင့် သို့မဟုတ် အကောင့်အဆင့် အမည်ဝှက်ခြင်းကို အလိုအလျောက် ဆိုလိုခြင်းမဟုတ်ပါ။

## အဆောက်အအုံများ {#building-blocks}

|အယူအဆ|blockchain ledger ကို ကိုယ်စားပြုခြင်း |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| ဖုံးကွယ်ထားသော note | ပိုင်ဆိုင်မှု၊ ပမာဏ၊ ပိုင်ရှင်ဒေတာနှင့် ကျပန်းတန်ဖိုးတို့ ပါဝင်သည့် wallet ၏ လျှို့ဝှက်မှတ်တမ်း။ |
|cryptographic commitment တန်ဖိုး |32-byte အများသုံးတန်ဖိုးတစ်ခု၊ ၎င်းရဲ့နယ်ပယ်တွေကို မဖေါ်ပြဘဲ မှတ်စုကို cryptographically ချိတ်ဆက်ပါတယ်။ |
|ဖျက်သိမ်းသူ |မှတ်စုတစ်ခု ကုန်ကျတဲ့အခါ ရယူတဲ့ 32-byte အများသုံးတန်ဖိုးပါ။ Iroha နှစ်ထပ်သုံးစွဲမှုကို တားဆီးဖို့ အကြိမ်ကြိမ် ဖျက်သိမ်းတာကို ပယ်ချတယ်။ |
|Merkle အမြစ်|ရင်းနှီးမြှုပ်နှံမှုအတွက် cryptographic commitment value tree ရဲ့ မကြာသေးခင်က အမြစ်ပါ။ သက်သေခံတွေက သုံးစွဲထားတဲ့ ငွေစက္ကူတွေ ရှိတာကို ပြသဖို့သုံးတယ်။ |
| အထောက်အထား ပူးတွဲချက် | အထောက်အထား byte များအပြင် စစ်ဆေးကီးသို့ ရည်ညွှန်းချက် သို့မဟုတ် တိုက်ရိုက်ထည့်ထားသော စစ်ဆေးကီး ပါဝင်သည့် `ProofAttachment`။ |
|လျှို့ဝှက်ဖြစ်ရပ် |`ConfidentialEvent::Shielded`, `Transferred` သို့မဟုတ် `Unshielded` ကဲ့သို့သော blockchain ledger အဖြစ်အပျက်များ။ |

အဓိက ညွှန်ကြားချက်တွေကတော့-

- `RegisterZkAsset`: အရင်းအမြစ်ကို ZK-အတတ်နိုင်သူအဖြစ် မှတ်ပုံတင်ပြီး လွှဲပြောင်းမှု၊ ပိတ်ပင်ခြင်းနှင့် ပိတ်ပင်မှုမရှိသော စစ်ဆေးရေး သော့များကို ချည်နှောင်သည်။
- `Shield`: အများမြင် လက်ကျန်ငွေမှ နုတ်ယူပြီး အကာအကွယ်ပေးထားသော မှတ်စု၏ ခရစ်ပ်တိုဂရပ်ဖစ် ကတိပြုတန်ဖိုးကို ထည့်သွင်းသည်။
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

1. validator နိုဒ်များတွင် လျှို့ဝှက်ဒေတာ ပံ့ပိုးမှုကို ဖွင့်ပါ။ validator များသည် စစ်ဆေးသည့် backend၊ လက်ရှိအသုံးပြုသော စစ်ဆေးကီးများ၊ Poseidon/Pedersen ပါရာမီတာ သတ်မှတ်နံပါတ်များနှင့် လျှို့ဝှက်ဒေတာ စည်းမျဉ်းဗားရှင်းတို့ကို တူညီစွာ သတ်မှတ်ရမည်။ လျှို့ဝှက်ဒေတာ လုပ်ဆောင်ချက် digest မကိုက်ညီသည့် peer များ သို့မဟုတ် ဘလော့ခ်များကို နိုဒ်များက ပယ်ချသည်။
2. ပတ်လမ်းတွေသုံးတဲ့ စစ်ဆေးရေး သော့တွေနဲ့ ပမာဏစုတွေကို ထုတ်ဝေ (သို့) မှတ်ပုံတင်ပါ။ Wallet တွေနဲ့ operator တွေက `VerifyingKeyId` မှာ သော့တွေကို ရည်ညွှန်းသင့်တယ်၊ ဥပမာ `halo2/ipa:vk_transfer` ပါ။
3. အရင်းအမြစ်ကို ZK-အရည်အချင်းရှိသူအဖြစ် `RegisterZkAsset` တွင် မှတ်ပုံတင်ခြင်း သို့မဟုတ် `TransparentOnly` မှ `Convertible` သို့ (သို့) `ShieldedOnly` သို့ မူဝါဒကူးပြောင်းမှုတစ်ခု ပြုလုပ်ခြင်း။
4. `Shield` ဖြင့် အများပြည်သူငွေကြေးကိုကာကွယ်ပါ။ ငွေစက္ကူသည် ငွေလွှဲပြောင်းမှုကို မတင်မီ လက်ခံရရှိသူအတွက် စာဝှက်စာရင်းချိတ်ဆက်မှုတန်ဖိုးနှင့် ကုဒ်သွင်းထားသော အသုံးဝင်ဝန်ဆောင်မှုများကို ဖန်တီးသည်။
5. `ZkTransfer` ဖြင့် ပုဂ္ဂလိက လွှဲပြောင်းပါ။ ငွေကြေးစက္ကူသည် ဝင်ငွေမှတ်စုများကို ပိုင်ဆိုင်ကြောင်း၊ ဝင်ငွေနှင့်ထွက်ငွေတန်ဖိုးများ ဟန်ချက်ညီမှုရှိကြောင်း၊ ကုန်ကျသောမှတ်စုတိုင်းကို မကြာမီက cryptographic commitment value tree တွင် ချိတ်ဆက်ထားကြောင်း သက်သေထူစေသည်။
6. ပိုင်ဆိုင်မှုမူဝါဒက ခွင့်ပြုမှသာ ဖုံးကွယ်မှုကို ဖယ်ရှားပါ။ `Unshield` သည် အများသိနိုင်သော ပမာဏနှင့် လက်ခံသူအကောင့်ကို ဖော်ထုတ်ပြီး လျှို့ဝှက် note ၏ nullifier ကို သုံးစွဲကာ လျှို့ဝှက် ပြန်အမ်းအကြွေ output များကိုလည်း ဖန်တီးနိုင်သည်။
7. လျှို့ဝှက်ဖြစ်ရပ်များ၊ သက်သေမှတ်တမ်းများနှင့် nullifier အခြေအနေကို အမျိုးအစားသတ်မှတ်ထားသော မေးမြန်းချက်များနှင့် Torii endpoint များမှတဆင့် ဖတ်ရှုခြင်းဖြင့် စစ်ဆေးပါ။

## CLI ဥပမာများ {#cli-examples}

ZK CLI command များသည် အော်ပရေတာနှင့် စမ်းသပ်မှု လုပ်ငန်းစဉ်များအတွက် ဖြစ်သည်။ တကယ့်အသုံးပြုမှု ပိုက်ဆံအိတ်များသည် ရလဒ်ညွှန်ကြားချက်များကို မတင်သွင်းမီ ပိုက်ဆံအိတ် သို့မဟုတ် အထောက်အထားထုတ်ပေးသည့် ဆော့ဖ်ဝဲစာကြည့်တိုက်ဖြင့် ကတိပြုတန်ဖိုးများ၊ ကုဒ်ဝှက်ထားသော payload များနှင့် အထောက်အထားများကို ထုတ်ပေးသင့်သည်။

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

`N` သည် အများသိတန်ဖိုးဖြစ်သည်။ ၎င်းက သီးသန့် note ကို မဖော်ပြသော်လည်း ထို note နှင့် chain အတွက် တည်ငြိမ်သောကြောင့် တူညီသည့် nullifier ဖြင့် ဒုတိယအကြိမ် သုံးစွဲမှုကို Iroha က ငြင်းပယ်နိုင်သည်။

Commitment သစ်ပင်သည် note တည်ရှိကြောင်းကို သက်သေပြသည်။ Wallet တစ်ခုက commitment `C_i` ကို သုံးစွဲလျှင် သက်သေတွင် `C_i` မှ မကြာသေးမီက အများသိ root သို့ လျှို့ဝှက် Merkle လမ်းကြောင်း ပါဝင်သည်။

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

ဤနေရာတွင် `public_inputs` သည် ခရစ်ပ်တိုဂရပ်ဖစ် ကတိပြုတန်ဖိုးများ၊ နလီဖိုင်ယာများ၊ root၊ ပိုင်ဆိုင်မှု tag၊ chain tag နှင့် အများမြင် အကာအကွယ်ဖြုတ် ပမာဏရှိပါက ထိုပမာဏတို့ဖြစ်သည်။ လျှို့ဝှက်သက်သေဒေတာတွင် note ပမာဏများ၊ randomness၊ spend material နှင့် Merkle path များ ပါဝင်သည်။ အတည်ပြုသူများက proof ကို စစ်ဆေးပြီးနောက် အထွက် ခရစ်ပ်တိုဂရပ်ဖစ် ကတိပြုတန်ဖိုးများကို ထည့်ကာ အဝင် နလီဖိုင်ယာများကို သုံးစွဲပြီးကြောင်း မှတ်သားခြင်းဖြင့် လယ်ဂျာအခြေအနေကို ပြောင်းလဲသည်။

## အများပြည်သူ သိရှိနိုင်သော အရာများ {#what-is-public}

အမည်မဲ့ ငွေပေးချေမှုတွေဟာ လေ့လာလို့ရတဲ့ အချက်အလက်တိုင်းကို ပုဂ္ဂလိကအဖြစ် မသတ်မှတ်ပါဘူး။ အောက်ပါအချက်အလက်တွေကို အများပြည်သူ သိရှိနိုင်တုန်းပါ။

- Transaction cryptographic hash၊ block height နဲ့ ordering တွေကို
- လျှောက်လွှာတွင် ပုဂ္ဂလိကဝင်ရောက်မှုမှတ်တိုင် (သို့) ပြန်လည်ထည့်သွင်းပုံပုံစံကို အသုံးပြုခြင်းမရှိပါက တင်ပြသည့် ငွေချေးငွေ ခွင့်ပြုချက် မူလစာရင်း
- အသုံးပြုနေသော အရင်းအမြစ် သတ်မှတ်ချက်
- Nullifiers များနှင့် Output cryptographic commitment values များ
- အထောက်အထား ဟက်ရှ်များ၊ စစ်ဆေးကီး ရည်ညွှန်းချက်များနှင့် ရွေးချယ်ထည့်နိုင်သော envelope ဟက်ရှ်များ
- `Unshield` အတွက် အများပြည်သူငွေကြေးနှင့် လက်ခံစာရင်း။

ဒီပရိုဂရမ်တွေကို ဒီဇိုင်းထုတ်ပါ၊ ဒီတော့ ဒီ အများသုံး metadata က ကိုယ်ကာကွယ်ဖို့ ကြိုးစားနေတဲ့ စီးပွားရေး ဆက်ဆံရေးကို မဖေါ်ပြနိုင်ပါ။

## ဆက်စပ်သော ရည်ညွှန်းချက် {#related-reference}

- [`AssetConfidentialPolicy`](/my/reference/data-model-schema.md)
- [`ConfidentialEvent`](/my/reference/data-model-schema.md)
- [`ProofAttachment`](/my/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/my/reference/data-model-schema.md)
- [အာမခံအပ်နှံမှုနှင့် အထောက်အထား query များ](/my/reference/queries.md#escrow-and-proof-records)
