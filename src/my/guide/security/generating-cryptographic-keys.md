---
translation_locale: my
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Cryptographic Key များကို ထုတ်လုပ်ခြင်း {#generating-cryptographic-keys}

အသုံးပြုခြင်း `kagami keys` client, peer, and validator key material များအတွက် ထုတ်လုပ်နိုင်ရန်
Iroha 3.

## အခြေခံ အသုံးပြုမှု {#basic-usage}

ကနေ Iroha အရင်းအမြစ် စစ်ဆေးမှု:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON output ကို copy လုပ်ဖို့ အလွယ်ဆုံးဖြစ်ပါတယ် TOML သို့မဟုတ် အလိုအလျောက်လုပ်ခြင်း

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

အစိုးရက အများသုံး သော့နဲ့ သီးသန့် သော့ကို ရိုက်နှိပ်တယ်။
key ကို လျှို့ဝှက်ပစ္စည်းအဖြစ်သုံးပြီး ထုတ်လုပ်မှု key တွေကို မယူပါနဲ့။

## အယ်လ်ဂိုရစ်သမ်များ {#algorithms}

အများသုံး အယ်လ်ဂိုရစ်သမ်များမှာ

- `ed25519` ဖောက်သည်စာရင်းများ၊ စီးမျောမှု လက္ခဏာများနှင့် အများစုအတွက် ဖွံ့ဖြိုးတိုးတက်မှု
  ကွန်ရက်များ။
- `secp256k1` Secp256K1 အကောင့်ရဲ့ လက္ခဏာကို လိုအပ်တဲ့အခါမှာပါ။
- `bls_normal` Build လုပ်နိုင်တဲ့အခါ validator consensus key တွေအတွက် BLS ထောက်ပံ့မှု။

သင့်ရဲ့ build က ထောက်ပံ့တဲ့ အယ်လ်ဂိုရစ်သမ်တွေကို တိကျစွာ စစ်ဆေးပါ

```bash
cargo run --bin kagami -- keys --help
```

## ဆုံးဖြတ်ချက် ချမှတ်ရေး ဖွံ့ဖြိုးမှု သော့ချက်များ {#deterministic-development-keys}

မျိုးပွားနိုင်သော တပ်ဆင်ချက်များအတွက် အစေ့ကို ပေးပါ။

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

မျိုးစေ့တွေဟာ ပုဂ္ဂလိက အဓိက ပစ္စည်းတွေပါ၊ ဒေသတွင်း ဖွံ့ဖြိုးမှုနဲ့ စမ်းသပ်မှုတွေ အတွက်သာ သုံးပါ။

## BLS ပိုင်ဆိုင်မှု အထောက်အထားများ {#bls-proofs-of-possession}

NPOS နှင့် Nexus validator profile တွေလိုအပ်တယ် BLS validator key တွေနဲ့ PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

နိုင်ငံခြားရေး JSON ပါဝင်သည် `pop_hex` ဘယ်အချိန်မှာ `--pop` ဒီတန်ဖိုးကို
generated topology သို့မဟုတ် `trusted_peers_pop` ကိုယ်ရေးကိုယ်တာအချက်အလက်များအတွက် လိုအပ်သော စာရင်းများ

## ထုတ်ကုန်ပုံစံများ {#output-formats}

terminal စစ်ဆေးမှုအတွက် default output ကိုသုံးပါ။ `--json` အလိုအလျောက်လုပ်ခြင်းအတွက်၊
`--compact` အခြား script တစ်ခုက ရိုးရှင်းတဲ့ line oriented values တွေကို လိုအပ်တဲ့အခါမှာ

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

အပြည့်အဝ ထုတ်ကုန်များအတွက် Kagami အကူအညီ

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
