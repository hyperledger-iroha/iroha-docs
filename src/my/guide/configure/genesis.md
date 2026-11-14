---
translation_locale: my
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta+reviewed-first-release-source-amendment
---
# blockchain ပေါ်ထွန်းမှု {#genesis}

genesis သည် ဘလော့ခ်ချိန်း၏ ကနဦးအခြေအနေကို သတ်မှတ်သည်။ ပြင်ဆင်နိုင်သော မူရင်းသည် JSON manifest ဖြစ်ပြီး Iroha 3 နိုဒ်သည် လက်မှတ်ထိုးထားသော Norito transaction ဖိုင်ကို ဖတ်ယူအသုံးပြုသည်။

::: details မူလသတ်မှတ်ထားသော genesis manifest

<<< @/snippets/genesis.json

:::

## ဖိုင်များ {#files}

မူရင်း repository တွင် `defaults/genesis.template.json` ၌ ပုံသေမူရင်း template ပါဝင်သည်။ Template သည် မပြည့်စုံသေးသောကြောင့် `kagami genesis materialize` က manifest အဖြစ် မပြောင်းမချင်း စစ်ဆေး၊ လက်မှတ်ထိုး သို့မဟုတ် နိုဒ်က အသုံးပြု၍ မရပါ။ Kagami က ထုတ်လုပ်သော ကွန်ရက်များသည် ကိုယ်ပိုင် manifest နှင့် လက်မှတ်ထိုးထားသော transaction ကို ရလဒ်သိမ်း directory ထဲတွင် ရေးသားသည်:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

ထိုဖိုင်တွဲတွင် ထုတ်လုပ်ထားသော `README.md` သည် ရွေးချယ်ထားသော ပရိုဖိုင်အတွက် ဖိုင်အတိအကျနှင့် စတင် command များကို မှတ်တမ်းတင်ထားသည်။

## peer ပြင်ဆင်သတ်မှတ်မှု {#peer-configuration}

Peer များသည် `config.toml` ၏ `[genesis]` အပိုင်းတွင် လက်မှတ်ထိုးထားသော genesis transaction ကို ညွှန်ပြပြီး မျှော်မှန်းထားသော ဟက်ရှ်ကို သီးခြားဖိုင်တစ်ခုတွင် သတ်မှတ်ချည်နှောင်ထားသည်:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

ကွန်ရက်ရှိ peer အားလုံးသည် လက်မှတ်ထိုးထားသော genesis transaction နှင့် genesis အများသုံးကီးအပေါ် သဘောတူညီရသည်။ မျှော်မှန်းဟက်ရှ်ဖိုင်သည် အသစ်စတင်ချိန်နှင့် ပြန်စတင်ချိန် နှစ်မျိုးစလုံးတွင် လိုအပ်ပြီး `kagami genesis sign --expected-hash-out` က ၎င်းကို ရေးသားသည်။

## လက်မှတ်ရေးထိုးခြင်း blockchain genesis {#signing-genesis}

Manifest ကို လက်ဖြင့် ပြင်ဆင်လျှင် peer များ မစတင်မီ ၎င်းကို စစ်ဆေးပြီး လက်မှတ်ထိုးပါ။

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` သည် ပိုင်ရှင်က ထိန်းသိမ်းထားပြီး mode-`0600` သတ်မှတ်ထားသော လင့်ခ်တစ်ခုသာရှိသည့် ပုံမှန်ဖိုင်ဖြစ်ရမည်။ ထိုဖိုင်တွင် စံသတ်မှတ်ပုံစံ ကိုယ်ပိုင်ကီး multihash တစ်ခုနှင့် နောက်ဆုံးစာကြောင်းသစ်တစ်ခု ပါဝင်ရမည်။ Kagami သည် သင်္ကေတလင့်ခ်များကို ပယ်ချပြီး command စာကြောင်းပေါ်မှ မူရင်း genesis ကိုယ်ပိုင်ကီးကို လုံးဝ လက်မခံပါ။

NPoS သို့မဟုတ် SORA Nexus ၏ profile များအတွက် ထုတ်လုပ်ထားသော profile က လိုအပ်သည့် ကွန်ရက်ချိတ်ဆက်ပုံနှင့် BLS ကီးပိုင်ဆိုင်ကြောင်း သက်သေများကို ထည့်ပါ။ Kagami ၏ `localnet generate`၊ `wizard` နှင့် `sora-network generate` command များက ဤအသေးစိတ်များကို အလိုအလျောက် ကိုင်တွယ်ပေးသည်။

## blockchain ကို ပြန်လည်စတင်ခြင်း {#recommitting-genesis}

ကွန်ရက်အသစ်သည် ၎င်း၏ လက်မှတ်ထိုးထားသော genesis မှ စတင်သည်။ တစ်ခါသုံး localnet တွင် မတူသော genesis ကို စမ်းသပ်ရန် peer များကို ရပ်တန့်ပြီး ၎င်းတို့၏ ထုတ်လုပ်ထားသော အခြေအနေဖိုင်တွဲကို ဖယ်ရှားကာ လက်မှတ်ထိုးထားသော genesis အသစ်မှ စတင်ပါ။ လည်ပတ်နေသော ကွန်ရက်သည် အဆင့်မြှင့်နည်းအဖြစ် genesis ကို လုံးဝ အစားမထိုးရပါ။ Protocol သတ်မှတ်ချက်များ ပြောင်းလဲရန် အုပ်ချုပ်မှုအရ အတည်ပြုသော ရွေးချယ်မှုပြောင်းလဲမှုများနှင့် ရွေးချယ်ထားသော သတ်မှတ်ချက်များ၊ တာဝန်ဝတ္တရားများအတွက် အရည်အချင်းစစ်ဆေးမှု လိုအပ်သည်။
