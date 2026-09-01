---
translation_locale: my
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# blockchain ပေါ်ထွန်းမှု {#genesis}

blockchain genesis ကစတင်ကွင်းအခြေအနေကိုသတ်မှတ်သည်။ ပြင်ဆင်နိုင်သောအရင်းအမြစ်သည် JSON နည်းပညာထုတ်ပြန်ချက်ဖြစ်ပြီး Iroha 3 node သည် လက်မှတ်ထိုးထားသော Norito ငွေချေးမှု ဖိုင်ကိုသုံးစွဲသည်။

::: details Default blockchain genesis နည်းပညာထုတ်ပြန်ချက်

<<< @/snippets/genesis.json

:::

## ဖိုင်များ {#files}

`defaults/genesis.json` သို့ အလိုအလျောက် နည်းပညာထုတ်လွှင့်စာအုပ်ကို ပို့ပေးသည်။ Kagami မှ ထုတ်လုပ်သော ကွန်ရက်များသည် ၎င်းတို့၏ ကိုယ်ပိုင် နည်းပညာထုတ်လွှင့်စာအုပ်နှင့် လက်မှတ်ရေးထိုးထားသည့် ငွေချေးမှုများကို ထုတ်ကုန်ထုတ်လွှင့် စာရင်းထဲတွင် ရေးသားကြပါသည်။

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ဒီစာရင်းထဲမှာ ဖန်တီးထားတဲ့ `README.md` ဟာ ရွေးချယ်ထားတဲ့ profile အတွက် တိကျတဲ့ file တွေနဲ့ launch command တွေကို မှတ်တမ်းတင်ပါတယ်။

## ကွန်ရက် peer Configuration {#peer-configuration}

`config.toml` ရဲ့ `[genesis]` အပိုင်းမှာ လက်မှတ်ထိုးထားတဲ့ blockchain genesis transaction ကို network peers က ထောက်ပြတယ်။

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

ကွန်ရက်ထဲက ကွန်ယက်တူညီသူအားလုံးဟာ လက်မှတ်ရေးထိုးထားတဲ့ blockchain genesis ငွေကြေးပေးချေမှုနဲ့ blockchain genesis အများသုံး သော့ကို သဘောတူဖို့ လိုပါတယ်။

## လက်မှတ်ရေးထိုးခြင်း blockchain genesis {#signing-genesis}

Technical Manifesto ကို လက်နဲ့ တည်းဖြတ်ရင် Network Peers တွေကို မစတင်ခင် validate နဲ့ sign လုပ်ပါ။

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` သည် ပိုင်ရှင်ထိန်းသိမ်းထားသော mode-`0600`၊ single-link ပုံမှန်ဖိုင်တစ်ခုဖြစ်ရမည်။ တစ်ခုတည်းသော protocol-standard private key multihash နှင့် နောက်ဆုံး newline ကိုပါ ၀ င်သည်။ Kagami က သင်္ကေတဆိုင်ရာ link များကိုငြင်းပယ်ပြီး command line တွင် raw blockchain genesis private key ကို ဘယ်တော့မှ လက်မခံပါ။

NPoS သို့မဟုတ် Nexus ပရိုဖိုင်များအတွက်၊ Topology နှင့် BLS Proof-of-Possession များကို Generated Profile တွင်လိုအပ်သည်။ Kagami `localnet`, `wizard` နှင့် Profile Generation Commands တို့တွင် ထိုအချက်အလက်များကို အလိုအလျောက် စီမံခန့်ခွဲနိုင်သည်။

## blockchain ကို ပြန်လည်စတင်ခြင်း {#recommitting-genesis}

Network peer က blockchain ကို သိုလှောင်မှုအလွတ်ရှိမှသာ ပြီးဆုံးစေပါတယ်။ တစ်ခါသုံး localnet မှာ blockchain အသစ်ကို စမ်းသပ်ဖို့ network peers တွေကို ရပ်တန့်ပါ။ သူတို့ဖန်တီးထားတဲ့ State Directory ကိုဖယ်ရှားပြီး လက်မှတ်ထိုးထားတဲ့ blockchain genesis အသစ်ကနေစပါ။ validator တစ်ခုချင်းစီက တူညီတဲ့ ရွှေ့ပြောင်းမှုကို ညှိနှိုင်းမပေးရင် Running Network မှာ blockchain genesis ကို အစားမထိုးပါနဲ့။
