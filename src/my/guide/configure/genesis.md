---
translation_locale: my
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဇင်နဝါရီ {#genesis}

Genesis က အစပိုင်းကွင်းဆက်အခြေအနေကိုသတ်မှတ်သည်။ ပြင်ဆင်နိုင်သောအရင်းအမြစ်သည် JSON manifest ဖြစ်ပြီး Iroha 3 node သည် လက်မှတ်ထိုးထားသော Norito ငွေကြေးဖိုင်ကိုသုံးစွဲသည်။

::: details Default genesis manifest ကို အသုံးပြုရန် လိုအပ်ပါသည်။

<<< @/snippets/genesis.json

:::

## ဖိုင်များ {#files}

Upstream repository က default manifest ကို `defaults/genesis.json`. Kagami-ဖန်တီးထားတဲ့ ကွန်ရက်တွေဟာ ထုတ်ကုန် directory ထဲမှာ ကိုယ်ပိုင် manifesto နဲ့ လက်မှတ်ထိုးတဲ့ transaction တွေကို ရေးကြတယ်။

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ဒီစာရင်းထဲမှာ ဖန်တီးထားတဲ့ `README.md` ဟာ ရွေးချယ်ထားတဲ့ profile အတွက် တိကျတဲ့ file တွေနဲ့ launch command တွေကို မှတ်တမ်းတင်ပါတယ်။

## တန်းတူညီမျှမှု {#peer-configuration}

`config.toml` ၏ `[genesis]` အပိုင်းတွင် လက်မှတ်ရေးထိုးထားသော Genesis ငွေပေးချေမှုအပေါ် တူညီသည့် အချက်များ:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

ကွန်ယက်ထဲက တူညီသူအားလုံးက လက်မှတ်ထိုးထားတဲ့ genesis transaction နဲ့ genesis public key ကို သဘောတူဖို့လိုပါတယ်။

## Genesis ကို လက်မှတ်ရေးထိုးခြင်း {#signing-genesis}

မန်နီဖစ်ကို လက်နဲ့ တည်းဖြတ်ရင် တူညီသူတွေကို စမလုပ်ခင် validate နဲ့ sign လုပ်ပါ။

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS သို့မဟုတ် Nexus ပရိုဖိုင်များအတွက်၊ Topology နှင့် BLS Proof-of-Possession များကို Generated Profile တွင်လိုအပ်သည်။ Kagami `localnet`, `wizard` နှင့် Profile Generation Commands တို့တွင် ထိုအချက်အလက်များကို အလိုအလျောက် စီမံခန့်ခွဲနိုင်သည်။

## Genesis ကို ပြန်လည်ကျင်းပခြင်း {#recommitting-genesis}

Peer သည် ၎င်း၏ သိုလှောင်မှုအလွတ်ရှိမှသာ genesis ကိုပြုလုပ်သည်။ တစ်ခါသုံး localnet တွင် genesis အသစ်တစ်ခုကိုစမ်းသပ်ရန် peers များကိုရပ်ဆိုင်းခြင်း၊ သူတို့ဖန်တီးထားသော state directory ကိုဖယ်ရှားခြင်းနှင့် လက်မှတ်ထိုးထားတဲ့ genesis အသစ်ကနေစတင်ခြင်း။ validator တစ်ခုချင်းစီသည်တူညီသောအပြောင်းရွှေ့မှုကို ညှိနှိုင်းမနေလျှင် ပြေးဆွဲနေသည့် ကွန်ရက်တစ်ခုပေါ်တွင် genesis ကိုအစားထိုးခြင်းမရှိပါ။
