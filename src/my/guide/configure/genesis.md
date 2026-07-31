---
translation_locale: my
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဇင်နဝါရီ {#genesis}

Genesis က အစပိုင်းကွင်းဆက်အခြေအနေကို သတ်မှတ်တယ်။ ပြင်ဆင်နိုင်တဲ့ အရင်းအမြစ်က JSON လက္ခဏာများ
နောက်ပြီး Iroha 3 node သည် လက်မှတ်ထိုးထားသော node ကို သုံးစွဲသည် Norito ငွေပေးချေမှု မှတ်တမ်း။

::: details Default genesis manifest ကို အသုံးပြုရန်

<<< @/snippets/genesis.json

:::

## ဖိုင်များ {#files}

Upstream သိုလှောင်ရုံမှာ default manifest ကို `defaults/genesis.json`.
Kagami-ဖန်တီးထားတဲ့ ကွန်ရက်တွေဟာ သူတို့ရဲ့ ကိုယ်ပိုင် လက်မှတ်ထိုးပြီး လက်မှတ်ထိုးတဲ့ ငွေကြေးပူးပေါင်းမှုကို
output directory ကို:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ထုတ်ကုန်များ `README.md` အဲဒီစာအုပ်ထဲမှာ မှန်ကန်တဲ့ ဖိုင်တွေကို မှတ်တမ်းတင်ထားပြီး
ရွေးချယ်ထားတဲ့ ပရိုဖိုင်အတွက် အမိန့်များ။

## အဖော်များ၏ ပုံသွင်းမှု {#peer-configuration}

လက်မှတ်ရေးထိုးထားတဲ့ Genesis Transaction ကို အဖော်တွေက ထောက်ပြတယ်။ `[genesis]` အပိုင်း
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

လက်မှတ်ရေးထိုးထားတဲ့ Genesis Transaction နဲ့
Genesis အများသုံး သော့ပါ။

## ဇာတိပကတိကို လက်မှတ်ရေးထိုးခြင်း {#signing-genesis}

လက်နဲ့ manifes ကို တည်းဖြတ်ရင် peers တွေကို မစခင် validate နဲ့ sign လုပ်ပါ။

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS သို့မဟုတ် Nexus Profiles များတွင် topology နှင့် BLS ပိုင်ဆိုင်မှု အထောက်အထားများ
ထုတ်လုပ်ထားတဲ့ ပရိုဖိုင်က တောင်းဆိုတာပါ။ Kagami `localnet`, `wizard`, နှင့် profile ကို
Generation commands တွေက အဲဒီအချက်အလက်တွေကို အလိုအလျောက် စီမံပေးပါတယ်။

## Genesis ကို ပြန်လည်ကျင်းပခြင်း {#recommitting-genesis}

တစ်မျိုးတည်းက မျိုးစေ့ကို သိမ်းဆည်းရာမှာ အလွတ်ရှိမှသာ ပြုလုပ်တယ်။
တစ်ခါသုံး localnet တစ်ခု၊ peers တွေကို ရပ်လိုက်ပါ၊ သူတို့ဖန်တီးထားတဲ့ state directory ကို ဖယ်ရှားလိုက်။
နောက်ပြီး လက်မှတ်ထိုးထားတဲ့ မျိုးဆက်သစ်ကနေ စတင်ပါ။
ကွန်ရက်ကို validator တစ်ခုချင်းစီဟာ တူညီတဲ့ ရွှေ့ပြောင်းမှုကို ညှိပေးနေမှမဟုတ်ပါ။
