---
translation_locale: my
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အမည်မသိ ငွေပေးချေမှု {#anonymous-transactions}

Iroha တွင် အမည်မသိ ငွေပေးချေမှုများကို လျှို့ဝှက်သော အရင်းအမြစ်လုပ်ငန်းများမှ တည်ဆောက်ထားသည်။ အများပိုင်ငွေကြေးများဖြင့် အများပြည်သူ၏ အကောင့်မှ အကောင့်သို့ ငွေလွှဲပြောင်းမှုများ ရေးသားခြင်းအစား ပိုက်ဆံအိတ်သည် တန်ဖိုးကို ကာကွယ်ထားသော စာရင်းထဲသို့ ရွှေ့ဆိုင်းပြီး သုညသိပ္ပံသက်သေသနများနှင့်အတူ မရှင်းလင်းတဲ့ မှတ်စုများကို သုံးစွဲသည်။

အများပြည်သူစာရင်းမှာ လျှို့ဝှက်မှုတစ်ခု ဖြစ်ပွားခဲ့ကြောင်း မှတ်တမ်းတင်နေဆဲပါ။ ကတိကဝတ်တွေ၊ ဖျက်သိမ်းချက်တွေ၊ သက်သေခံ ဟက်ရှ်တွေနဲ့ အဖြစ်အပျက်တွေကို မှတ်တမ်းတင်ထားပေမဲ့ မှတ်စုပိုင်ရှင်၊ လက်ခံရရှိသူ (သို့) ကာကွယ်ထားတဲ့ကနေ ကာကွယ်ထားတဲ့ ရွေ့ရှားမှုအတွက် ပမာဏကို မှတ်တမ်းမတင်ဘူး။ ပုံမှန် ငွေပေးချေမှုအဖုံးမှာ တင်သွင်းတဲ့ အကောင့်ကို ဖော်ပြနိုင်သေးတယ်ဆိုတော့ "အမည်မသိ" ဆိုတာက ကွန်ရက်အဆင့် (သို့) အကောင့်အဆင့် အမည်မဖော်လိုတာမဟုတ်ဘဲ အမည်မဲ့ အရင်းအမြစ် ရွေ့ရှားမှုကို ဆိုလိုတာပါ။

## အဆောက်အအုံများ {#building-blocks}

|အယူအဆ|Ledger ကိုယ်စားပြုမှု |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|ပံ့ပိုးထားသော မှတ်ချက်|ပိုင်ဆိုင်သူ ဒေတာ၊ ငွေကြေးပမာဏနဲ့ ကျပန်းမှုပါတဲ့ ပုဂ္ဂလိက ချုပ်ကိုင်ငွေမှတ်တမ်းပါ။ |
|ကတိပေးခြင်း|Note ကို field တွေ မပြဘဲ commit လုပ်တဲ့ 32-byte public value ပါ။ |
|ဖျက်သိမ်းသူ |မှတ်စုတစ်ခု ကုန်ကျတဲ့အခါ ရယူတဲ့ 32-byte အများသုံးတန်ဖိုးပါ။ Iroha နှစ်ထပ်သုံးစွဲမှုကို တားဆီးဖို့ အကြိမ်ကြိမ် ဖျက်သိမ်းတာကို ပယ်ချတယ်။ |
|Merkle အမြစ်|အရင်းအမြစ်ရဲ့ ကတိပေးမှု အပင်ရဲ့ မကြာသေးခင်က အမြစ်ပါ။ အထောက်အထားတွေက ကုန်ကျစရိတ်တွေ ရှိတာကို ပြဖို့ သုံးတယ်။ |
|အထောက်အထား တပ်ဆင်ခြင်း |`ProofAttachment` မှာ proof byte တွေနဲ့ verification key reference (သို့) inline verification key ကို ထည့်သွင်းထားတယ်။ |
|လျှို့ဝှက်ဖြစ်ရပ် |`ConfidentialEvent::Shielded`၊ `Transferred` သို့မဟုတ် `Unshielded` ကဲ့သို့သော စာရင်းအင်းဖြစ်ရပ်များ။ |

အဓိက ညွှန်ကြားချက်တွေကတော့-

- `RegisterZkAsset`: အရင်းအမြစ်ကို ZK-အတတ်နိုင်သူအဖြစ် မှတ်ပုံတင်ပြီး လွှဲပြောင်းမှု၊ ပိတ်ပင်ခြင်းနှင့် ပိတ်ပင်မှုမရှိသော စစ်ဆေးရေး သော့များကို ချည်နှောင်သည်။
- `Shield`: အများပြည်သူ ငွေကြေးစာရင်းကို ချေဖျက်ပြီး ကန့်သတ်ထားသော စာရွက်စာတမ်း အမိန့်ချမှတ်ချက်တစ်ခု ထည့်သွင်းပေးသည်။
- `ZkTransfer`: ပိတ်ပင်ထားသော ငွေကြေးစက္ကူများကို ပိတ်ပင်ထားတဲ့ ငွေကြေး စက္ကူအသစ်များအတွက် ချမှတ်ထားသည့် ကတိပေးချေချက်များသို့ သုံးစွဲသည်။
- `Unshield`: ပိတ်ပင်ထားသော ငွေကြေးစက္ကူများကို သုံးစွဲပြီး အများပိုင်စာရင်းကျန်ရစ်ငွေကို ခရက်ဒစ်ပေးသည်။
- `ScheduleConfidentialPolicyTransition` နှင့် `CancelConfidentialPolicyTransition`: စီမံခန့်ခွဲမှုမှတစ်ဆင့် အရင်းအမြစ်၏ လျှို့ဝှက်မူဝါဒကိုပြောင်းလဲခြင်း။

အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်မှာ [`AssetConfidentialPolicy`](/my/reference/data-model-schema.md) ကိုပါ ထည့်သွင်းထားသည်။ စီးဆင်းမှုများကို ထိန်းချုပ်သည့် မူဝါဒပုံစံသည် သက်ဝင်ပါသည်။

|Mode ကို|အဓိပ္ပါယ်|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |သာမန် ပြည်သူ့ငွေကြေးစာရင်းများနှင့် ငွေလွှဲပြောင်းမှုများကိုသာ လက်ခံသည်။ |
|`Convertible` |သုံးစွဲသူတွေဟာ အများပိုင် ငွေကြေးစာရင်းနဲ့ ပိတ်ထားတဲ့ ငွေစက္ကူတွေကြားမှာ တန်ဖိုးကို ရွေ့ရှားနိုင်ပါတယ်။|
|`ShieldedOnly` |အရင်းအမြစ်ထုတ်လွှင့်ခြင်းနဲ့ ငွေလွှဲပြောင်းမှုတွေဟာ ကာကွယ်ထားတဲ့ စာရင်းထဲမှာ ရှိနေဖို့လိုပါတယ်။ |

## သုံးပုံ {#how-to-use-them}

1. Validator node တွေမှာ လျှို့ဝှက်ထောက်ပံ့မှုကို ဖွင့်ပေးပါ။ Validator တွေဟာ verifier backend, active verifying keys, Poseidon/Pedersen parameter IDs ကို သဘောတူကြရပါမယ်။ ပြီးတော့ လျှို့ဝှက် စည်းမျဉ်းတွေရဲ့ မူကွဲပါ။ node တွေဟာ peers (သို့) blocks တွေကို မညီတဲ့ confidential feature digests နဲ့ ပယ်ချကြတယ်။
2. ပတ်လမ်းတွေသုံးတဲ့ စစ်ဆေးရေး သော့တွေနဲ့ ပမာဏစုတွေကို ထုတ်ဝေ (သို့) မှတ်ပုံတင်ပါ။ Wallet တွေနဲ့ operator တွေက `VerifyingKeyId` မှာ သော့တွေကို ရည်ညွှန်းသင့်တယ်၊ ဥပမာ `halo2/ipa:vk_transfer` ပါ။
3. အရင်းအမြစ်ကို ZK-အရည်အချင်းရှိသူအဖြစ် `RegisterZkAsset` တွင် မှတ်ပုံတင်ခြင်း သို့မဟုတ် `TransparentOnly` မှ `Convertible` သို့ (သို့) `ShieldedOnly` သို့ မူဝါဒကူးပြောင်းမှုတစ်ခု ပြုလုပ်ခြင်း။
4. `Shield` ဖြင့် အများပြည်သူငွေကြေးကိုကာကွယ်ပါ။ ငွေစက္ကူသည် ငွေလွှဲပြောင်းမှုကို မတင်မီ လက်ခံရရှိသူအတွက် စာရွက်စာတမ်းဆိုင်ရာ ကတိပေးချက်တစ်ခုနှင့် ကုဒ်သွင်းထားသော အသုံးဝင်ဝန်ဆောင်မှုများကို ဖန်တီးသည်။
5. `ZkTransfer` ဖြင့် ပုဂ္ဂလိက လွှဲပြောင်းပါ။ ငွေကြေးစက္ကူသည် ဝင်ငွေမှတ်စုများကို ပိုင်ဆိုင်ထားကြောင်း၊ ဝင်ငွေနှင့်ထွက်ငွေတန်ဖိုးများ ဟန်ချက်ညီနေကြောင်း၊ ကုန်ကျသော မှတ်စုတိုင်းဟာ မကြာသေးမီက ကတိပေးမှု သစ်ပင်တွင် ချိတ်ဆက်ထားကြောင်း သက်သေထူစေသည်။
6. `Unshield` ကတော့ အများပြည်သူရဲ့ ငွေကြေးပမာဏနဲ့ လက်ခံရရှိသူရဲ့ အကောင့်ကို ဖော်ထုတ်ပေးပြီး ပုဂ္ဂလိက မှတ်ပုံတင်အငြင်းပွားမှုကို သုံးပြီး ပုဂ္ဂိုလ်ရေး ငွေလဲလှယ်မှု ထုတ်ကုန်တွေ ဖန်တီးနိုင်တာပါ။
7. လျှို့ဝှက်ဖြစ်ရပ်များ၊ အထောက်အထားမှတ်တမ်းများ၊ ဖျက်သိမ်းသူအခြေအနေနှင့် အမည်မသိ ဂိုဏ်းမှတ်တမ်းများကို ရိုက်နှိပ်မေးမြန်းချက်များနှင့် Torii အဆုံးအဖြတ်များမှတစ်ဆင့်ဖတ်ခြင်းဖြင့် စစ်ဆေးခြင်း။

## CLI ဥပမာများ {#cli-examples}

ZK CLI commands တွေကို operator နဲ့ test flow တွေအတွက် ရည်ရွယ်ထားပါတယ်။ Production wallets တွေဟာ ရလာတဲ့ ညွှန်ကြားချက်တွေကို မပို့ခင် commitments တွေ၊ encrypted payloads တွေနဲ့ proofs တွေကို wallet/prover library ကနေ ထုတ်ပေးသင့်ပါတယ်။

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

ကာကွယ်ထားတဲ့ မှတ်စုအတွက် versioned encrypted payload envelope ကို တည်ဆောက်ပါ။

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

အရင်းအမြစ်ရဲ့ ကာကွယ်ထားတဲ့ စာရင်းထဲကို အများပြည်သူ ရင်းနှီးမြှုပ်နှံမှု ပံ့ပိုးပေးပါ။

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

အကာအကွယ်ထုတ်ထားပြီး သက်သေခံတပ်ဆင်ချက် JSON:

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

Anonymous asset escrow သည် escrowed value အတွက် အလားတူ shielded transfer စက်ကိုအသုံးပြုသည်။ ပါတီများနှင့် escrow အခြေအနေများကို escrow မှတ်တမ်းတွင် မှတ်တမ်းတင်ထားသော်လည်း ငွေကြေးထောက်ပံ့မှု၊ ဖြန့်ချိခြင်း၊ ဖျက်သိမ်းခြင်းနှင့် ဖြေရှင်းရေး ခြေထောက်များသည် shielded nullifiers နှင့် output commitments များကို အသုံးပြုသည်။

ISI အပြုအမူနှင့် နမူနာများကို အသေးစိတ်သိရှိလိုပါက [ Native Asset Escrow](/my/blockchain/escrow.md#anonymous-escrow) ကိုကြည့်ပါ။

သက်တမ်း စက်ဝန်းက

1. `OpenAnonymousAssetEscrow` ကမ်းလှမ်းထားတဲ့ ငွေကြေးစာရွက်တွေကို သုံးပြီး ဂိုဏ်းချုပ်တာဝန် တစ်ခုကို ဖန်တီးတယ်။
2. `AcceptAnonymousAssetEscrow` ဝယ်သူကို မှတ်တမ်းတင်တယ်။
3. `MarkAnonymousEscrowPaymentSent` မှာ ဝယ်သူက ငွေပေးချေမှုကို ကွင်းဆက်အပြင်မှာ ပေးပို့ခဲ့တယ်လို့ မှတ်တမ်းတင်ထားတယ်။
4. `ReleaseAnonymousAssetEscrow` သည် ဝယ်ယူသူ၏ ထုတ်ကုန်ဆိုင်ရာ ကတိပေးချေချက်များအတွက် ဂိုဏ်းခံစာ ချုပ်ဆိုမှုကို သုံးသည်။
5. `CancelAnonymousAssetEscrow` သည် ငွေပေးချေမှုကို အမှတ်မထင်မှတ်ထားခြင်းမရှိပါက ရောင်းသူ၏ ထုတ်ကုန်ဆိုင်ရာ တာဝန်ယူမှုများကို ပြန်လည်ဖြည့်ဆည်းသည်။
6. `OpenAnonymousEscrowDispute` နဲ့ `ResolveAnonymousEscrowDispute` တို့ဟာ အငြင်းပွားနေတဲ့ လက်ဝှေ့တွေကို သက်သေပြချက် ဟက်ရှ်တွေနဲ့ ဖြေရှင်းသူက ထိန်းချုပ်တဲ့ ခွဲခြမ်းစိတ်ဖြာမှုတွေနဲ့ ကိုင်တွယ်ကြတယ်။

[Queries ](/my/reference/queries.md#escrow-and-proof-records) တွင်ဖော်ပြထားသော အမည်မသိ escrow မေးမြန်းချက်များကို escrow မှတ်ပုံတင်များနှင့် အခြေအနေများကို စစ်ဆေးရန် အသုံးပြုပါ။

## သင်္ချာ {#math}

အောက်ပါမှတ်သားချက်မှာ လျှို့ဝှက်အထောက်အပံ့စီးဆင်းမှုကို သရုပ်ဖော်ထားသည်။ အကောင်အထည်ဖော်မှုများသည် အရင်းအမြစ်မူဝါဒနှင့် စစ်ဆေးသူ မှတ်ပုံတင်မှ တက်ကြွသော ပတ်လမ်းနှင့် ပမာဏ IDs ကိုအသုံးပြုသည်၊ ထို့ကြောင့် ဖောက်သည်များအနေဖြင့် ကတိကဝတ်များ၊ ဖျက်သိမ်းသူများနှင့် သက်သေခံဘိုက်များကို ငွေကြေးစက္ကူ / စာလုံး၏ မရှင်းလင်းသောထွက်ကုန်များအဖြစ် සලකා බැලිය යුතුය.

ပိတ်ထားသော မှတ်စုကို အောက်ပါအတိုင်း ဖော်ပြနိုင်သည်

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

`owner` သည် လက်ခံသူ၏ ကြည့်ရှုမှု (သို့) ကုန်ကျစရိတ်ပစ္စည်းများမှ ရယူထားပြီး `rho` သည် အမှတ်မထင်ဖြစ်စဉ်ဖြစ်သည်။

စာရွက်စာတမ်း ကတိကဝတ်ဟာ လျှို့ဝှက်ထားတဲ့ ကတိပါ။

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

လက်ရှိ လျှို့ဝှက်လွှဲပြောင်းမှု ပတ်လမ်းများအတွက် အများပြည်သူဝင်ငွေများတွင် မှတ်ပုံတင်တာဝန်၊ ဖျက်သိမ်းချက်များ၊ Merkle အမြစ်တစ်ခု၊ အရင်းအမြစ်လက္ခဏာတစ်ခုနှင့်ကွင်းဆက်လက္ခဏာတစ်ခု ပါဝင်သည်။ ပတ်လမ်းသည်ဤပုံစံ၏ရည်ရွယ်ချက် ဆက်စပ်မှုကိုတင်းကျပ်စေသည်။

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

ငွေစက္ကူတစ်စောင် ကုန်ကျတဲ့အခါ ပိုက်ဆံအိတ်က အငြင်းပွားစရာကို ထုတ်ယူတယ်။

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ဟာ အများပြည်သူပါ။ စာရွက်စာတမ်းကို မဖေါ်ပြပေမဲ့ အဲဒီစာရွက်စာတမ်းနဲ့ ချိတ်ဆက်မှုအတွက် တည်ငြိမ်ပါတယ်၊ ဒီတော့ Iroha ဟာ တူညီတဲ့ nullifier နဲ့ ဒုတိယသုံးစွဲမှုကို ပယ်ချနိုင်မှာပါ။

ကတိပြုချက် အပင်က မှတ်စုတည်ရှိမှုကို သက်သေပြသည်။ ငွေကြေးအိတ်တစ်ခုမှာ ကတိပေးမှု `C_i` ကုန်ကျတယ်ဆိုရင်၊ အထောက်အထားမှာ `C_i` မှ မကြာသေးခင်က အများပြည်သူ အမြစ်သို့ သီးသန့် Merkle လမ်းကြောင်းပါဝင်တယ်။

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

where `public_inputs` are the commitments, nullifiers, root, asset tag, chain tag, and any public unshielded amount. witness contains the note amounts, randomness, spending material, and Merkle paths (စာရွက်စာတမ်းများ၏ ငွေကြေးပမာဏများ၊ ကြုံတွေ့ချက်များ၊ ကုန်ကျစရိတ်ပစ္စည်းများနှင့် Merkle လမ်းကြောင်းများ) Validator တွေက အထောက်အထားကို စစ်ဆေးပြီး ပြီးရင် output commits ကိုထည့်ပြီး input nullifiers တွေကို expended အဖြစ် အမှတ်တံဆိပ်ပေးရင်း ledger state ကို mutate လုပ်ပါတယ်။

## အများပြည်သူ သိရှိနိုင်သော အရာများ {#what-is-public}

အမည်မဲ့ ငွေပေးချေမှုတွေဟာ လေ့လာလို့ရတဲ့ အချက်အလက်တိုင်းကို ပုဂ္ဂလိကအဖြစ် မသတ်မှတ်ပါဘူး။ အောက်ပါအချက်အလက်တွေကို အများပြည်သူ သိရှိနိုင်တုန်းပါ။

- Transaction hash၊ block height နဲ့ ordering တွေကို
- လျှောက်လွှာကို တင်ပြသူ ငွေပေးချေမှု အာဏာပိုင်က သီးသန့်ဝင်ရောက်ရေးမှတ်တိုင် (သို့) ပြန်လည်ထည့်သွင်းခြင်းပုံစံကို အသုံးပြုသည်မဟုတ်ရင်
- အသုံးပြုနေသော အရင်းအမြစ် သတ်မှတ်ချက်
- Nullifiers များနှင့် Output commitments များ
- proof hashes တွေ၊ verifying key references တွေနဲ့ optional envelope hashs တွေ
- `Unshield` အတွက် အများပြည်သူငွေကြေးနှင့် လက်ခံစာရင်း။
- အမည်မသိ ဂိုဏ်းရောင်းသူ၊ ဝယ်သူ၊ အခြေအနေ၊ အချိန်တံဆိပ်များနှင့် သက်သေခံ hashes

ဒီပရိုဂရမ်တွေကို ဒီဇိုင်းထုတ်ပါ၊ ဒီတော့ ဒီ အများသုံး metadata က ကိုယ်ကာကွယ်ဖို့ ကြိုးစားနေတဲ့ စီးပွားရေး ဆက်ဆံရေးကို မဖေါ်ပြနိုင်ပါ။

## ဆက်စပ်သော ရည်ညွှန်းချက် {#related-reference}

- [`AssetConfidentialPolicy`](/my/reference/data-model-schema.md)
- [`ConfidentialEvent`](/my/reference/data-model-schema.md)
- [`ProofAttachment`](/my/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/my/reference/data-model-schema.md)
- [အာမခံနှင့် သက်သေခံမေးမြန်းချက်များ ](/my/reference/queries.md#escrow-and-proof-records)
