---
translation_locale: my
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# blockchain ပေါ်ထွန်းမှု {#genesis}

genesis သည် ဘလော့ခ်ချိန်း၏ ကနဦးအခြေအနေကို သတ်မှတ်သည်။ ပြင်ဆင်နိုင်သော မူရင်းသည် JSON manifest ဖြစ်ပြီး Iroha 3 နိုဒ်သည် လက်မှတ်ထိုးထားသော Norito transaction ဖိုင်ကို ဖတ်ယူအသုံးပြုသည်။

::: details မူလသတ်မှတ်ထားသော genesis manifest

<<< @/snippets/genesis.json

:::

## ဖိုင်များ {#files}

မူရင်း repository တွင် မူလ manifest ကို `defaults/genesis.json` ၌ ထည့်ပေးထားသည်။ Kagami ဖြင့် ထုတ်လုပ်သော ကွန်ရက်များသည် ၎င်းတို့၏ ကိုယ်ပိုင် manifest နှင့် လက်မှတ်ထိုးထားသော transaction ကို ရလဒ်ဖိုင်တွဲထဲသို့ ရေးထုတ်သည်။

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ဒီစာရင်းထဲမှာ ဖန်တီးထားတဲ့ `README.md` ဟာ ရွေးချယ်ထားတဲ့ profile အတွက် တိကျတဲ့ file တွေနဲ့ launch command တွေကို မှတ်တမ်းတင်ပါတယ်။

## peer ပြင်ဆင်သတ်မှတ်မှု {#peer-configuration}

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

`GENESIS_PRIVATE_KEY_FILE` သည် ပိုင်ရှင်က ထိန်းသိမ်းထားပြီး mode-`0600` သတ်မှတ်ထားသော လင့်ခ်တစ်ခုသာရှိသည့် ပုံမှန်ဖိုင်ဖြစ်ရမည်။ ထိုဖိုင်တွင် စံသတ်မှတ်ပုံစံ ကိုယ်ပိုင်ကီး multihash တစ်ခုနှင့် နောက်ဆုံးစာကြောင်းသစ်တစ်ခု ပါဝင်ရမည်။ Kagami သည် သင်္ကေတလင့်ခ်များကို ပယ်ချပြီး command စာကြောင်းပေါ်မှ မူရင်း genesis ကိုယ်ပိုင်ကီးကို လုံးဝ လက်မခံပါ။

NPoS သို့မဟုတ် SORA Nexus ပရိုဖိုင်များအတွက် ထုတ်လုပ်ထားသော ပရိုဖိုင်က လိုအပ်သည့် ချိတ်ဆက်ဖွဲ့စည်းပုံနှင့် BLS ကီးပိုင်ဆိုင်မှုအထောက်အထားများကို ထည့်ပါ။ Kagami ၏ `localnet`၊ `wizard` နှင့် ပရိုဖိုင်ထုတ်လုပ်သည့် command များက ဤအသေးစိတ်များကို အလိုအလျောက် ကိုင်တွယ်ပေးသည်။

## blockchain ကို ပြန်လည်စတင်ခြင်း {#recommitting-genesis}

peer သည် ၎င်း၏ သိုလှောင်မှုအလွတ်ဖြစ်သောအခါမှသာ genesis ကို commit လုပ်သည်။ စွန့်ပစ်အစားထိုးနိုင်သော စက်တွင်းကွန်ရက်တွင် genesis အသစ်ကို စမ်းသပ်ရန် peer များကို ရပ်တန့်ပါ၊ ထုတ်လုပ်ထားသော အခြေအနေဖိုင်တွဲကို ဖယ်ရှားပါ၊ ထို့နောက် လက်မှတ်ထိုးထားသော genesis အသစ်မှ စတင်ပါ။ validator အားလုံးက တူညီသောပြောင်းရွှေ့မှုကို ညှိနှိုင်းဆောင်ရွက်နေခြင်း မရှိလျှင် လုပ်ဆောင်နေသောကွန်ရက်ပေါ်တွင် genesis ကို မအစားထိုးပါနှင့်။
