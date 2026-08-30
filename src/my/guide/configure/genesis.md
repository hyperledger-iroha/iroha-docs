---
translation_locale: my
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# ကမ္ဘာဦး {#genesis}

ကမ္ဘာဦးကျမ်းက ကနဦးကွင်းဆက်အခြေအနေကို သတ်မှတ်သည်။တည်းဖြတ်နိုင်သော အရင်းအမြစ်မှာ တစ်ခုဖြစ်သည်။ JSON ထင်ရှား၊
နှင့် တစ်ခု Iroha 3 node သည် signed ကိုစားသုံးသည်။ Norito ငွေပေးငွေယူဖိုင်။

::: details ပုံသေ ဥပါဒ် ထင်ရှား

<<< @/snippets/genesis.json

:::

## ဖို {#files}

အထက်ပိုင်း သိုလှောင်ရေးဌာနသည် မူရင်း manifest ကို ပေးပို့သည်။ `defaults/genesis.json`.
Kagami-generated networks များသည် ၎င်းတို့၏ကိုယ်ပိုင် manifest ကိုရေးပြီး အရောင်းအ ၀ ယ်သို့လက်မှတ်ထိုးပါ။
အထွက်လမ်းညွှန်-

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ထုတ်ပေးသည်။ `README.md` အဲဒီလမ်းညွှန်ထဲမှာ ဖိုင်တွေကို အတိအကျ မှတ်တမ်းတင်ပြီး စတင်လိုက်ပါ။
ရွေးချယ်ထားသော ပရိုဖိုင်အတွက် ညွှန်ကြားချက်များ။

## သက်တူရွယ်တူ ဖွဲ့စည်းမှု {#peer-configuration}

သက်တူရွယ်တူများသည် နိမိတ်လက္ခဏာ၌ ဥပါဒ် အရောင်းအဝယ်ကို ထောက်ပြကြသည်။ `[genesis]` အပိုင်း
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

ကွန်ရက်ရှိ သက်တူရွယ်တူများအားလုံးသည် လက်မှတ်ရေးထိုးထားသော ဥပါဒ် အရောင်းအဝယ်နှင့် အဆိုပါအပေါ် သဘောတူရပါမည်။
ဥပါဒ် ြကီး။

## ကမ္ဘာဦးနိမိတ် {#signing-genesis}

မန်နီးဖက်စ်တစ်ခုကို သင်ကိုယ်တိုင် တည်းဖြတ်ပါက၊ သက်တူရွယ်တူများကို မစတင်မီ ၎င်းကို အတည်ပြုပြီး လက်မှတ်ထိုးပါ။

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` ပိုင်ရှင်ထိန်းမုဒ် ဖြစ်ရမည်-`0600`, single-link
canonical private-key multihash တစ်ခုနှင့် နောက်ဆုံးတစ်ခုပါရှိသော ပုံမှန်ဖိုင်
လိုင်းအသစ်။ Kagami ပုံဆောင်လင့်ခ်များကို ငြင်းပယ်ပြီး အကြမ်းဥပါဒ်သီးသန့်ကို ဘယ်တော့မှ လက်မခံပါ။
command line တွင် သော့။

NPoS အတွက် သို့မဟုတ် Nexus ပရိုဖိုင်များ၊ topology နှင့် ပါဝင်သည်။ BLS ပိုင်ဆိုင်မှုအထောက်အထားများ
ထုတ်ပေးသော ပရိုဖိုင်မှ လိုအပ်သည်။ Kagami `localnet`, `wizard`, နှင့် ပရိုဖိုင်
Generation command များသည် ထိုအသေးစိတ်အချက်အလက်များကို အလိုအလျောက် ကိုင်တွယ်ပါသည်။

## ကမ္ဘာဦးကျမ်းကို ပြန်လည်လက်ခံခြင်း။ {#recommitting-genesis}

သက်တူရွယ်တူတစ်ဦးသည် ၎င်း၏သိုလှောင်မှုအလွတ်တွင်သာ ဥပါဒ်ကျူးလွန်သည်။ဥပါဒ်အသစ်ကို စမ်းသပ်ရန်
တစ်ခါသုံး localnet၊ ရွယ်တူများကို ရပ်ပါ၊ ၎င်းတို့၏ ထုတ်လုပ်ထားသော ပြည်နယ်လမ်းညွှန်ကို ဖယ်ရှားပါ၊
လက်မှတ်ရေးထိုးထားသော ဥပါဒ်အသစ်မှ စတင်ပါ။ပြေးခြင်းတွင် ဥပါဒ်ကို အစားထိုးခြင်းမပြုပါနှင့်
တရားဝင်သူတိုင်းသည် တူညီသောပြောင်းရွှေ့မှုကို ညှိနှိုင်းဆောင်ရွက်ခြင်းမပြုပါက ကွန်ရက်။
