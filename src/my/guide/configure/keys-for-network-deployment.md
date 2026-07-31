---
translation_locale: my
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကွန်ရက် ဖြန့်ချိခြင်းအတွက် သော့ချက်များ {#keys-for-network-deployment}

ကွန်ရက်တိုင်းမှာ ဖောက်သည်များ၊ တူညီသူများအတွက် သီးခြားသော အဓိကပစ္စည်းတွေ လိုအပ်ပြီး NPoS (သို့) Nexus ပရိုဖိုင်တွေအတွက်လည်း BLS validator identities တွေလိုပါတယ်။

## သော့များ အသုံးပြုရာ {#where-keys-are-used}

- ဖောက်သည် လက်မှတ်ရေးထိုးသော သော့များကို `client.toml` တွင် `[account]` အောက်တွင် သိမ်းထားပါသည်။
- တူညီသူတစ်ဦးရဲ့ လိပ်စာကို တူညီသူတိုင်း `config.toml` မှာ `public_key` နဲ့ `private_key` အဖြစ် သိမ်းထားတယ်။
- Peer discovery က `trusted_peers` မှာ peer တစ်ခုစီရဲ့ public key ကို သုံးပါတယ်။
- BLS validator NPoS profile များအတွက် ပိုင်ဆိုင်မှုသက်သေများကို `trusted_peers_pop` တွင် သိမ်းဆည်းထားပါသည်။
- Genesis လက်မှတ်ရေးထိုးရာတွင် `[genesis].public_key` ကို peer configuration တွင် အသုံးပြုပြီး ပြက္ခဒိန်ကို လက်မှတ်ရေးဆွဲရာတွင် လိုက်ဖက်သော private key ကို အသုံးပြုသည်။

ဒေသတွင်း (သို့) စမ်းသပ်မှု ဖြန့်ချိချက်များအတွက် Kagami သည် ဤဖိုင်အားလုံးကို စုပေါင်းထုတ်လုပ်ပါ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ရှိနေတဲ့ ကွန်ရက် (သို့) ပရိုဖိုင်အတွက် guide flow ကိုသုံးပါ။

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## ပုဂ္ဂိုလ်ရေး သော့စုံများ ဖန်တီးခြင်း {#generate-individual-key-pairs}

`kagami keys` ကို standalone key material အတွက် အသုံးပြုပါ။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

BLS အတည်ပြုပစ္စည်းအတွက် ပိုင်ဆိုင်မှု သက်သေခံစာကို ထည့်သွင်းပါ။

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--seed` ကို ပြန်လည်ဖန်တီးနိုင်သော ဖွံ့ဖြိုးရေး ကိရိယာများအတွက်သာ အသုံးပြုပါ။ ထုတ်လုပ်မှု ဖြန့်ချိရန်အတွက် အသစ်သော့များကို ဖန်တီးပြီး သီးသန့်သော့များကို သိုလှောင်ထားပါ။

## အတန်းတူညီမှု {#peer-consistency}

အတည်ပြုသူအားလုံးက အလားတူ genesis transaction, topology, trusted peer public keys နှင့် validator PoPs ကို သဘောတူဖို့လိုပါတယ်။ ပျောက်နေတဲ့ (သို့) မသင့်တော်တဲ့ peer key တစ်ခုတည်းက ကွန်ရက်ကိုစတင်ခြင်း သို့မဟုတ် သဘောတူညီမှုရဖို့ တားဆီးနိုင်သည်။

အနည်းဆုံး Byzantine fault-tolerant deployment အတွက် အနည်းဆုံး peer လေးခုကို အသုံးပြုပါ။ peer တစ်ခုစီမှာ ကိုယ်ပိုင် private key ရှိဖို့လိုပေမဲ့ peer configuration တစ်ခုစီအတွက်တော့ ယုံကြည်မှုရှိတဲ့ peer set တစ်မျိုးတည်းလိုအပ်ပါတယ်။

## ဖောက်သည်စာရင်းများ {#client-accounts}

`client.toml` တွင်ရှိသော ဖောက်သည်အကောင့်သည် ချိတ်ဆက်ထားပြီးသားဖြစ်ရမည်။ ၎င်းကို genesis manifest သို့မဟုတ် နောက်ပိုင်း ငွေချေးမှုဖြင့် မှတ်ပုံတင်နိုင်သည်။ genesis လက်မှတ်ရေးထိုးလက္ခဏာကို သက်တမ်းရှည်လျှောက်လွှာအကောင့်အဖြစ်အသုံးပြုခြင်းရှောင်ပါ။ genesis privileges တွေဟာ genesis round မှာသာ သက်ရောက်ပြီး ထုတ်လုပ်ရေး ဖောက်သည်တွေဟာ သူတို့ကိုယ်ပိုင် အကောင့်တွေနဲ့ အခန်းကဏ္ဍတွေကို သုံးသင့်ပါတယ်။
