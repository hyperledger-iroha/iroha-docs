---
translation_locale: my
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Cryptographic Key များကို ထုတ်လုပ်ခြင်း {#generating-cryptographic-keys}

`kagami keys` ကိုသုံးပြီး Iroha 3 အတွက် client, network peer နှင့် validator key material များကို ဖန်တီးပါ။

## အခြေခံ အသုံးပြုမှု {#basic-usage}

Iroha အရင်းအမြစ်ကုဒ်အတွက် အလုပ်လက်မှတ်:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

မူရင်း directory ရှိပြီးသား ဖြစ်ရပါမယ်။ ရည်မှန်းချက်ဟာ အသစ် (သို့) လက်ရှိအသုံးပြုသူပိုင်ဆိုင်နေပြီဖြစ်ရပါမယ်။ `0700`, သင်္ကေတဆိုင်ရာ သံယောဇဉ်တွေ ကင်းလွတ်ပြီး အလွတ်ပါ။ `kagami` စာရေးသည် `public.key` နှင့် `private.key` mode နဲ့ `0600` key material တွေကို မနှိပ်ဘူး။ `--pop`, ဒါကလည်း ရေးထားတယ်။ `pop.hex`.

`--out-dir` သည် Kagami က ဤပိုင်ရှင်များသာရှိသော ဖိုင်စနစ်စည်းမျဉ်းများကို အကောင်အထည်ဖော်နိုင်ခြင်းမရှိသည့် ပလက်ဖောင်းများတွင်ပိတ်ရန် ပျက်ကွက်သည်. hardware (သို့) မတင်ပို့နိုင်သော ထုတ်လုပ်ရေး cryptographic signer ကို တင်သွင်းပြီး ခွင့်ပြုထားတဲ့ custody boundary ထဲကို တင်သွင်းပြီး deployment လုပ်နည်းအတိုင်း export ကို ဖယ်ရှားပါ။

## အယ်လ်ဂိုရစ်သမ်များ {#algorithms}

ပုံမှန် အယ်လ်ဂိုရစ်သမ်များမှာ-

- `ed25519` ဖောက်သည်အကောင့်များနှင့် streaming အမည်များအတွက်။
- `secp256k1` ဖောက်သည်စာရင်းအတွက် secp256k1 ကိုယ်ပိုင်လက္ခဏာလိုအပ်ပါက။
- `bls_normal` node (သို့) network peer consensus identity တစ်ခုစီအတွက်။

သင့်ရဲ့ build က ထောက်ပံ့တဲ့ အယ်လ်ဂိုရစ်သမ်တွေကို တိကျစွာ စစ်ဆေးပါ

```bash
cargo run --bin kagami -- keys --help
```

## ဆုံးဖြတ်ချက်ချမှု ဖွံ့ဖြိုးတိုးတက်ရေး သော့ချက်များ {#deterministic-development-keys}

ပြန်လည်ဖန်တီးနိုင်သော စမ်းသပ်မှုလက်ရာများအတွက် ၆၄ hexadecimal စာလုံးအဖြစ် ကုဒ်သွင်းထားသော 32-byte မျိုးစေ့ကို ဖြတ်သန်းပါ။ ရွေးချယ်စရာ `0x` ကြိုတင်ကိန်းကို လက်ခံသည်:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

မျိုးစေ့သည် သီးသန့်သော့ပစ္စည်းဖြစ်သည်။ ဒေသတွင်းဖွံ့ဖြိုးတိုးတက်မှုနှင့်စမ်းသပ်မှုများအတွက်သာ deterministic မျိုးစေ့များကိုအသုံးပြုပါ။ လည်ပတ်ရေးစနစ်၏ ကျပန်းဖြစ်စဉ်မှထုတ်လုပ်ရေးသော့တစ်ခု ဖန်တီးရန် `--seed-hex` ကိုရှောင်ပါ။

## BLS သဘောတူညီချက်သော့များနှင့် ပိုင်ဆိုင်မှု အထောက်အထားများ {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 node နှင့် network peer consensus identity များကို အသုံးပြုခြင်း BLS- ပုံမှန် ခလုတ်များ။ BLS- ပုံမှန် သော့နဲ့ ပိုင်ဆိုင်မှု အထောက်အထား (PoP) နှင့်:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` သည် `bls_normal` နှင့်သာ သက်ဝင်သည်။ ၎င်းသည် ထိန်းသိမ်းမှုညွှန်ကြားချက်သို့ `pop.hex` ကိုထည့်သွင်းသည်။ လက်မှတ်ရေးထိုးထားသော blockchain မျိုးဆက်သည် မဲပေးသူတိုင်းအတွက်သင့်လျော်သည့် PoP ကိုလိုအပ်သည်။ Network peer configuration မှာ non-empty `trusted_peers_pop` map က validator subset ကို ရွေးချယ်တယ်။ အဲဒီ non-emptive map ထဲက လွတ်သွားတဲ့ trusted network peers တွေဟာ Observer တွေပါ။ မြေပုံက အလွတ်ရှိပါက BLS ပုံမှန် ယုံကြည်မှုရှိတဲ့ ကွန်ရက် တူညီသူအားလုံးသည် bootstrap ကိုယ်စားလှယ်စုထဲ ဝင်ကြပြီး မဲပေးသူ PoPs ကို လက်မှတ်ထိုးထားတဲ့ blockchain genesis ကနေ ဆက်လက်ဖြည့်ဆည်းပေးတယ်။

## ထိန်းသိမ်းမှု ထုတ်ကုန်များ {#custody-output}

`kagami keys` လိုအပ်ချက် `--out-dir` Standard output ကို private key material ကို ဘယ်တော့မှ မရေးပါဘူး။ `public.key`, `private.key`, ရွေးချယ်စရာ `pop.hex` ဖိုင်တစ်ခုစီမှာ တစ်ခုတည်းသော ပရိုတိုကောစံညွှန်းတန်ဖိုးကိုပါ ၀ င်သည်။ နောက်မှာ newline တစ်ခုရှိတယ်၊ ဒါက ရှင်းလင်းတဲ့ file based automation ကို လွယ်ကူစေတယ်။

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

Full generated Kagami အကူအညီအတွက်-

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
