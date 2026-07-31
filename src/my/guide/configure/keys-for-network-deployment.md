---
translation_locale: my
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကွန်ရက် ဖြန့်ချိမှုအတွက် သော့ချက်များ {#keys-for-network-deployment}

ကွန်ရက်တိုင်းမှာ ဖောက်သည်တွေ၊ အဖော်တွေနဲ့ genesis လက်မှတ်ရေးထိုးဖို့ သီးခြား အဓိက ပစ္စည်းတွေ လိုအပ်တယ်။
ပြီးတော့ NPoS အတွက် Nexus ကိုယ်စားလှယ်များ၊ BLS အတည်ပြုသူ လက္ခဏာများ။

## သော့များ အသုံးပြုရာ {#where-keys-are-used}

- Client လက်မှတ်ရေးထိုးသော့များကို သိမ်းထားသည် `client.toml` အောက် `[account]`.
- Peer Identity Key တွေကို peer တစ်ခုချင်းစီမှာ သိမ်းထားတယ်။ `config.toml` အတိုင်း `public_key` နှင့်
  `private_key`.
- Peer discovery က peer တစ်ခုချင်းရဲ့ အများသုံး သော့ကို သုံးပါတယ်။ `trusted_peers`.
- BLS validator ပိုင်ဆိုင်မှု အထောက်အထားများကို `trusted_peers_pop` NPOS အတွက်
  ကိုယ်စားလှယ်များ။
- Genesis လက်မှတ်ထိုးခြင်းမှာ `[genesis].public_key` peer config နဲ့
  လက်မှတ်ရေးထိုးတဲ့အခါ ပုဂ္ဂလိက သော့နဲ့ ကိုက်ညီတာပါ။

ဒေသတွင်း (သို့) စမ်းသပ်မှု နေရာချထားမှုအတွက် Kagami ဒီဖိုင်တွေအားလုံးကို အတူတူ ဖန်တီးပါ။

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ရှိနေတဲ့ ကွန်ရက် (သို့) ပရိုဖိုင်အတွက် လမ်းညွှန်စီးကြောင်းကို အသုံးပြုပါ။

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## သီးခြားသော့စုံကို ဖန်တီးပါ {#generate-individual-key-pairs}

အသုံးပြုခြင်း `kagami keys` တစ်ကိုယ်တည်းသော သော့ပစ္စည်းများအတွက်-

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

အတွက် BLS validator ပစ္စည်းမှာ ပိုင်ဆိုင်မှု သက်သေခံစာပါ

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

အသုံးပြုခြင်း `--seed` ပြန်လည်ထုတ်လုပ်နိုင်သော ဖွံ့ဖြိုးရေး ကိရိယာများအတွက်သာ
deployment လုပ်ပေးခြင်း၊ သော့သစ်တွေ ထုတ်လုပ်ပေးခြင်းနဲ့ ပုဂ္ဂလိက သော့တွေကို repositorium အပြင်မှာ သိုလှောင်ပေးခြင်း။

## တူညီမှု {#peer-consistency}

အတည်ပြုသူအားလုံးဟာ တူညီတဲ့ ဘီဘီစီလုပ်ငန်းစဉ်၊ ထိပ်ပိုင်းဆိုင်ရာ၊ ယုံကြည်မှုရှိတဲ့
peer public key တွေနဲ့ validator တွေ PoPs. ပျောက်နေတဲ့ (သို့) မတူညီတဲ့ peer key တစ်ခုတည်း
ကွန်ရက်ကို စတင်ဖို့ (သို့) သဘောတူညီမှုရဖို့ မတားဆီးပါ။

အနည်းဆုံး ဗစ်ဇာနိတ်အမှားကို သည်းခံတဲ့ တပ်ဆင်မှုအတွက် အနည်းဆုံး လေးယောက်လောက် သုံးပါ။
peer မှာ ကိုယ်ပိုင် private key ရှိဖို့လိုပေမဲ့ peer configuration တစ်ခုချင်းစီမှာ တူညီတဲ့
ယုံကြည်ရတဲ့ အဖော်စုပါ။

## ဖောက်သည်စာရင်းများ {#client-accounts}

ဖောက်သည်စာရင်းမှာ `client.toml` ချိတ်ဆက်မှုမှာ ရှိပြီးသား ဖြစ်ဖို့လိုပါတယ်။
Genesis Manifesto သို့မဟုတ် နောက်ပိုင်း ငွေပေးချေမှုဖြင့် မှတ်ပုံတင်ထားသည်
genesis လက်မှတ်ရေးထိုးခြင်း မှတ်ပုံတင်အမည်သည် သက်တမ်းရှည်လျှောက်လွှာအဖြစ်ဖြစ်သည်; genesis အခွင့်အရေးများ
Genesis round မှာသာ သုံးပြီး ထုတ်လုပ်ရေး ဖောက်သည်တွေက သူတို့ ကိုယ်ပိုင်
စာရင်းအင်းများနှင့် အခန်းကဏ္ဍများ
