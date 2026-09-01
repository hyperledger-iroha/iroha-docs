---
translation_locale: my
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကွန်ရက် ဖြန့်ချိခြင်းအတွက် သော့ချက်များ {#keys-for-network-deployment}

ကွန်ရက်တိုင်းမှာ ဖောက်သည်များ၊ ကွန်ယက်တူညီသူများအတွက် သီးခြားသော အဓိကပစ္စည်းတွေ လိုအပ်တယ်၊ blockchain genesis လက်မှတ်ထိုးခြင်း၊ NPoS သို့မဟုတ် Nexus ပရိုဖိုင်တွေအတွက်တော့ BLS အတည်ပြုသူ လက္ခဏာတွေပါ။

## သော့များ အသုံးပြုရာ {#where-keys-are-used}

- ဖောက်သည် လက်မှတ်ရေးထိုးသော သော့များကို `client.toml` တွင် `[account]` အောက်တွင် သိမ်းထားပါသည်။
- Network peer identity keys များကို network peer `config.toml` တစ်ခုစီတွင် `public_key` နှင့် `private_key` အဖြစ် သိမ်းထားပါသည်။
- Network peer discovery မှာ `trusted_peers` ထဲမှာ network peer တစ်ခုစီရဲ့ public key ကို အသုံးပြုပါတယ်။
- BLS validator NPoS profile များအတွက် ပိုင်ဆိုင်မှုသက်သေများကို `trusted_peers_pop` တွင် သိမ်းဆည်းထားပါသည်။
- blockchain genesis လက်မှတ်ရေးထိုးခြင်းသည် `[genesis].public_key` ကိုကွန်ရက် peer config တွင်အသုံးပြုပြီး Technical Manifesto ကိုလက်မှတ်ရေးထိုးရာတွင်အဆင်ပြေသော Private Key ကိုသုံးသည်။

ဒေသတွင်း (သို့) စမ်းသပ်မှု ဖြန့်ချိချက်များအတွက် Kagami သည် ဤဖိုင်အားလုံးကို စုပေါင်းထုတ်လုပ်ပါ:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ရှိနေတဲ့ ကွန်ရက် (သို့) ပရိုဖိုင်အတွက် guide flow ကိုသုံးပါ။

```bash
cargo run --bin kagami -- wizard
```

## ပုဂ္ဂိုလ်ရေး သော့စုံများ ဖန်တီးခြင်း {#generate-individual-key-pairs}

`kagami keys` ကို standalone key material အတွက် အသုံးပြုပါ။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

BLS အတည်ပြုပစ္စည်းအတွက် ပိုင်ဆိုင်မှု သက်သေခံစာကို ထည့်သွင်းပါ။

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--seed-hex` ကို ပြန်လည်ဖန်တီးနိုင်သော ဖွံ့ဖြိုးတိုးတက်ရေးကိရိယာများအတွက် တိကျတဲ့ 32-byte hexadecimal လျှို့ဝှက်ချက်နှင့်သာအသုံးပြုပါ။ ထုတ်လုပ်မှု ဖြန့်ချိရန်အတွက် Kagami သည် operating-system randomness ကိုသုံး၍ ခွင့်ပြုထားသည့် ထိန်းသိမ်းမှု နယ်နိမိတ်သို့ မကုဒ်သွင်းသေးသော private key တင်ပို့မှုကို ရွှေ့ပါ။ အမိန့်က ပုဂ္ဂလိက သော့တွေကို ဘယ်တော့မှ ပုံနှိပ်မပေးဘူး။

## Network peer ကိုညီညွတ်မှု {#peer-consistency}

အတည်ပြုသူအားလုံးသည် blockchain ပင်မကုန်သွယ်မှု, topology, trusted network peer public keys နှင့် validator PoPs တို့အပေါ် သဘောတူညီရမည်ဖြစ်သည်။ ပျောက်နေသော (သို့မဟုတ်) မလိုက်ဖက်သည့် ကွန်ရက် peer key တစ်ခုတည်းကွန်ရက်ကိုစတင်ခြင်း သို့မဟုတ်သဘောတူညီချက်ရရှိခြင်းကို တားဆီးနိုင်သည်။

အနည်းဆုံး Byzantine fault-tolerant deployment အတွက် network peer လေးခုလောက် သုံးပါ။ network peer တစ်ခုစီမှာ ကိုယ်ပိုင် private key ရှိဖို့လိုပါတယ်။ ဒါပေမဲ့ network peer configuration တစ်ခုချင်းအတွက်တော့ အလားတူ trusted network peer set လိုပါတယ်။

## ဖောက်သည်စာရင်းများ {#client-accounts}

`client.toml` ထဲက ဖောက်သည်စာရင်းဟာ ချိတ်ဆက်မှုမှာ ရှိပြီးသား ဖြစ်ရပါမယ်။ ဒါကို blockchain Genesis Technical Manifesto သို့မဟုတ် နောက်ပိုင်း ငွေပေးချေမှုဖြင့် မှတ်ပုံတင်နိုင်သည်။ blockchain genesis လက်မှတ်ရေးထိုးတဲ့ ကိုယ်ပိုင်လက္ခဏာကို သက်တမ်းရှည် အက်ပ်အကောင့်အဖြစ် အသုံးပြုခြင်းကနေ ရှောင်ရှားပါ။ blockchain genesis အခွင့်အရေးတွေဟာ blockchain genesis round အတွင်းမှာသာ သက်ရောက်ပြီး ထုတ်လုပ်မှု ဖောက်သည်တွေက သူတို့ကိုယ်ပိုင် အကောင့်တွေနဲ့ အခန်းကဏ္ဍတွေကို သုံးသင့်ပါတယ်။
