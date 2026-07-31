---
translation_locale: my
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

Command က Public Key နဲ့ Exposed Private Key တို့ကို ရိုက်နှိပ်ပေးတယ်။ Private Key ကို လျှို့ဝှက်ပစ္စည်းအဖြစ် ဆက်ဆံပါ။ ထုတ်လုပ်ထားတဲ့ Production Keys တွေကို မလုပ်ပါနဲ့။

## အယ်လ်ဂိုရစ်သမ်များ {#algorithms}

ပုံမှန် အယ်လ်ဂိုရစ်သမ်များမှာ-

- `ed25519` ဖောက်သည်အကောင့်များ၊ စီးမျောမှု ကိုယ်ပိုင်လက္ခဏာများနှင့် အများစုဖွံ့ဖြိုးရေးကွန်ရက်များအတွက်။
- `secp256k1` သင် secp256k1 အကောင့်အမည်ကိုလိုအပ်တဲ့အခါမှာ။
- `bls_normal` အတွက် validator consensus key များအတွက် build က BLS support ကို enable လုပ်ထားပါက။

သင့်ရဲ့ build က ထောက်ပံ့တဲ့ အယ်လ်ဂိုရစ်သမ်တွေကို တိကျစွာ စစ်ဆေးပါ

```bash
cargo run --bin kagami -- keys --help
```

## ဆုံးဖြတ်ချက်ချမှု ဖွံ့ဖြိုးတိုးတက်ရေး သော့ချက်များ {#deterministic-development-keys}

ပြန်လည်ဖန်တီးနိုင်သော ကိရိယာများအတွက် မျိုးစေ့ကို ဖြတ်သန်းပါ။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

မျိုးစေ့တွေဟာ ပုဂ္ဂလိက အဓိက ပစ္စည်းတွေပါ။ ဒေသတွင်း ဖွံ့ဖြိုးတိုးတက်မှုနဲ့ စမ်းသပ်မှုတွေ အတွက်သာ သုံးပါ။

## BLS ပိုင်ဆိုင်မှု အထောက်အထားများ {#bls-proofs-of-possession}

NPoS နှင့် Nexus validator profile များအတွက် BLS validator keys နှင့် PoPs တို့ကို လိုအပ်သည်-

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON မှာ `pop_hex` ကိုပါဝင်ပါတယ်။ `--pop` ကိုအသုံးပြုတဲ့အခါ ဒီတန်ဖိုးကိုထုတ်လုပ်ထားတဲ့ topology (သို့) profile ကတောင်းဆိုတဲ့ `trusted_peers_pop` entries နဲ့အတူ အသုံးပြုပါ။

## ထုတ်ကုန်ပုံစံများ {#output-formats}

terminal inspection အတွက် default output ကို အသုံးပြုပါ။ `--json` ကို အလိုအလျောက် စစ်ဆေးဖို့နဲ့ `--compact` ကို အခြား script တစ်ခုအတွက် ရိုးရှင်းတဲ့ line-oriented တန်ဖိုးတွေ လိုအပ်တဲ့အခါမှာ သုံးပါ။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Full generated Kagami အကူအညီအတွက်-

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
