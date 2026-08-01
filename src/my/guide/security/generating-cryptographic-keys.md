---
translation_locale: my
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Cryptographic Key များကို ထုတ်လုပ်ခြင်း {#generating-cryptographic-keys}

`kagami keys` ကိုသုံးပြီး Iroha 3 အတွက် client, peer, and validator key material များကိုထုတ်လုပ်ပါ။

## အခြေခံ အသုံးပြုမှု {#basic-usage}

Iroha အရင်းအမြစ် စစ်ဆေးမှုမှ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON ထုတ်ကုန်ကို TOML သို့ ကူးယူရန် (သို့) အလိုအလျောက် ပြုလုပ်ရန် သာမန်အားဖြင့် လွယ်ကူဆုံးဖြစ်သည်။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Command က public key နှင့် ဖော်ထုတ်ထားသော private key ကို ရိုက်နှိပ်ပေးသည်။ Private key ကို လျှို့ဝှက်ပစ္စည်းအဖြစ် သတ်မှတ်ပါ။ ထုတ်လုပ်ထားသော production key များကို repository သို့ commit မလုပ်ပါနှင့်။

ပံ့ပိုးထားသော Unix ပလက်ဖောင်းတွင် လုံခြုံသော ဒေသတွင်းထုတ်ယူမှု သို့မဟုတ် ထိန်းသိမ်းမှုသို့ လွှဲပြောင်းရန် private key ကို ရိုက်နှိပ်မည့်အစား ပိုင်ရှင်တစ်ဦးတည်းသာ ဝင်ရောက်နိုင်သော ဗလာ directory သို့ key pair အသစ်ကို ရေးပါ။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

မိဘ directory သည် ရှိပြီးသားဖြစ်ရမည်။ ရည်မှန်းထားသော directory သည် အသစ်ဖြစ်ရမည် သို့မဟုတ် လက်ရှိအသုံးပြုသူက ပိုင်ဆိုင်ပြီးသားဖြစ်ရမည်၊ mode `0700` ဖြစ်ရမည်၊ symbolic link မပါရ၊ ဗလာဖြစ်ရမည်။ `kagami` က `public.key` နှင့် `private.key` ကို mode `0600` ဖြင့် ရေးပြီး private key ကို မရိုက်နှိပ်ပါ။ `--pop` ဖြင့် `pop.hex` ကိုလည်း ရေးသည်။

ပိုင်ရှင်တစ်ဦးတည်းသာ ဝင်ရောက်နိုင်သည့် ဖိုင်စနစ်စည်းမျဉ်းများကို Kagami မပြဋ္ဌာန်းနိုင်သော ပလက်ဖောင်းများတွင် `--out-dir` သည် လုံခြုံစွာ ပျက်ကွက်သည်။ Private-key ဖိုင်သည် စာဝှက်မထားသော ထုတ်ယူမှုဖြစ်ပြီး hardware ဖြင့် ကာကွယ်ထားသော သို့မဟုတ် ထုတ်ယူ၍မရသော production signer မဟုတ်ပါ။ ၎င်းကို ခွင့်ပြုထားသော ထိန်းသိမ်းမှုနယ်နိမိတ်သို့ ထည့်သွင်းပြီး ဖြန့်ချထားမှုလုပ်ငန်းစဉ်အတိုင်း ထုတ်ယူထားသည့်ဖိုင်ကို ဖယ်ရှားပါ။

## အယ်လ်ဂိုရစ်သမ်များ {#algorithms}

ပုံမှန် အယ်လ်ဂိုရစ်သမ်များမှာ-

- `ed25519` client account များနှင့် streaming identity များအတွက်။
- `secp256k1` ဖောက်သည်စာရင်းအတွက် secp256k1 ကိုယ်ပိုင်လက္ခဏာလိုအပ်ပါက။
- build က BLS support ကို enable လုပ်တဲ့အခါ node (သို့) peer consensus identity တစ်ခုစီအတွက် `bls_normal`.

သင့်ရဲ့ build က ထောက်ပံ့တဲ့ အယ်လ်ဂိုရစ်သမ်တွေကို တိကျစွာ စစ်ဆေးပါ

```bash
cargo run --bin kagami -- keys --help
```

## သတ်မှတ်ထားသော ဖွံ့ဖြိုးရေးသော့များ {#deterministic-development-keys}

ပြန်လည်ဖန်တီးနိုင်သော fixtures များအတွက် 64 hexadecimal characters အဖြစ်ကုဒ်ထားသော 32-byte seed ကိုဖြည့်ပါ။ ရွေးချယ်စရာ `0x` prefix ကိုလက်ခံသည်။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

မျိုးစေ့သည် private-key ပစ္စည်းဖြစ်သည်။ deterministic မျိုးစေ့များကို ဒေသတွင်းဖွံ့ဖြိုးရေးနှင့် စမ်းသပ်မှုများအတွက်သာ အသုံးပြုပါ။ လည်ပတ်ရေးစနစ်၏ ကျပန်းဖြစ်စဉ်မှ production key တစ်ခု ဖန်တီးရန် `--seed-hex` ကို ချန်လှပ်ပါ။

## BLS သဘောတူညီချက်သော့များနှင့် ပိုင်ဆိုင်မှု အထောက်အထားများ {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 node နှင့် peer consensus identity များသည် BLS-normal key များကို အသုံးပြုသည်။ BLS-normal key နှင့် ပိုင်ဆိုင်မှုအထောက်အထား (PoP) ကို ဖန်တီးရန် အောက်ပါ command ကို သုံးပါ။

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` သည် `bls_normal` နှင့်သာ သက်ဝင်သည်။ JSON output တွင် `pop_hex` ပါဝင်သည်။ လက်မှတ်ထိုးထားသော genesis သည် မဲပေးသည့် validator တစ်ခုစီအတွက် ကိုက်ညီသော PoP ကို လိုအပ်သည်။ Peer configuration တွင် ဗလာမဟုတ်သော `trusted_peers_pop` map က validator subset ကို ရွေးသည်။ ထိုဗလာမဟုတ်သော map တွင် မပါသည့် trusted peer များသည် observer များဖြစ်သည်။ Map ဗလာဖြစ်လျှင် BLS-normal key ရှိသည့် trusted peer အားလုံး bootstrap candidate set ထဲဝင်ပြီး မဲပေးသည့် validator များ၏ PoPs ကို လက်မှတ်ထိုးထားသော genesis က ဆက်လက်ပံ့ပိုးသည်။

## အထွက်ပုံစံများ {#output-formats}

terminal inspection အတွက် default output ကို အသုံးပြုပါ။ `--json` ကို အလိုအလျောက် စစ်ဆေးဖို့နဲ့ `--compact` ကို အခြား script တစ်ခုအတွက် ရိုးရှင်းတဲ့ line-oriented တန်ဖိုးတွေ လိုအပ်တဲ့အခါမှာ သုံးပါ။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Full generated Kagami အကူအညီအတွက်-

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
