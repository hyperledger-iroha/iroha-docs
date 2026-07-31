---
translation_locale: my
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-configuration-issues}

ဤအပိုဒ်သည် ပြဿနာဖြေရှင်းနည်းများအတွက် အကြံပြုချက်များကိုပေးသည်။ Iroha 3 Configuration ကို.
[သော့တွေကို စစ်ခဲ့တယ်။](./overview.md#check-the-keys) ပထမဦးဆုံးအနေနဲ့ ဒါဟာ အများဆုံး
ပြည်ထောင်စုလွှတ်တော် Iroha.

သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီမှာ ဖော်ပြမထားဘူးဆိုရင်
[Telegram ကို](https://t.me/hyperledgeriroha).

## A ပေါ်က ခေတ်နောက်ကျတဲ့ ဇီ၀ဖြစ်စဉ် Docker Compose တပ်ဆင်ခြင်း {#outdated-genesis-on-a-docker-compose-setup}

သင်သုံးနေစဉ် Docker Compose မူကွဲများ Iroha, တွေ့ကြုံတွေ့နိုင်တယ်
အချိုးအစားအချင်း container တစ်ခုရဲ့ပြဿနာကို
`Failed to deserialize raw genesis block` အမှားပါ။ ဒါက အများအားဖြင့် တူညီသူကို ဆိုလိုတာပါ။
လက်မှတ်ရေးထိုးထားသော genesis transaction နှင့် generated configuration ကို
ခြားနားမှု Iroha ပြင်ဆင်မှု (သို့) ကိုယ်စားလှယ်ပုံစံများ။

ဤအဆင့်များဖြင့် ပျက်ကွက်မှုကို စစ်ဆေးပါ

1. အသုံးပြုခြင်း `docker ps` လက်ရှိ container တွေကို စစ်ဆေးဖို့
   Generated profile ကိုတွေ့ရမယ် `hyperledger/iroha:dev`
   containers ကို default က Docker Compose Profile လေးခုပါဝင်ပါတယ်
   ထုတ်ကုန်များ `docker-compose.yml` ကွဲပြားနိုင်ပါတယ်။

2. မှတ်တမ်းတွေကို စစ်ဆေးပြီး
   `Failed to deserialize raw genesis block` အမှားပါ။
   Iroha daemon mode မှာ `docker compose up -d`, အသုံးပြုမှု
   `docker compose logs` အမိန့်ပေးပါ။

ဒီလိုပြဿနာကို ဖြေရှင်းနည်းက Iroha. ဒါက
အခြေခံ demo နဲ့ peer data တွေကို ထိန်းသိမ်းဖို့မလိုပါဘူး
localnet သို့မဟုတ် Docker Compose အစုအဝေး Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

ပြီးရင် container အခြေအနေဟောင်းကို ဖယ်ရှားပြီး regenerated ကနေ restart လုပ်ပါ။
`genesis.signed.nrt`, တူညီသူ `config.toml` ဖိုင်များ၊ `client.toml`.

ပြန်လည်ထူထောင်ဖို့လိုတယ်ဆိုရင် Iroha ဥပမာ အချက်အလက်များ၊ အောက်ပါအတိုင်း လုပ်ပါ။

1. ဒုတိယကို ချိတ်ဆက်ပါ Iroha peer က ပထမဦးဆုံးမှဒေတာကိုကူးယူမည်
   (မအောင်မြင်) တူညီသူ။
2. peer အသစ်က ပထမ peer နဲ့ ဒေတာကို synchronize လုပ်ဖို့ စောင့်ပါ။
3. အဖော်သစ်ကို တက်ကြွစေပါ။
4. ပထမဦးဆုံး peer ၏ဖြစ်စဉ်နှင့် configuration ဖိုင်များကို update လုပ်ပါ
   ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုပါ။

::: info

Genesis ကို Live မှာ အစားထိုးဖို့ အထွေထွေ အလိုအလျောက် ပြန်ရေးခြင်း လမ်းကြောင်းမရှိဘူး။
ဒါကို ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုအဖြစ် ဆက်ဆံပါ။
ကိုက်ညီတဲ့ peers ကိုတင်ပြီးနောက် validators ကို configuration အသစ်သို့သာပြောင်း
လုပ်ငန်းရှင်တွေဟာ ရွှေ့ပြောင်းရေး အစီအစဉ်ကို သဘောတူကြတယ်။

:::

## ပုဂ္ဂလိကနှင့် အများပိုင် သော့များ၏ Multihash Format {#multihash-format-of-private-and-public-keys}

သင်ကကြည့်ရင်
[Client ကို configuration](/my/guide/configure/client-configuration.md), သင်ဟာ
အဲဒီက သော့တွေကို ထည့်သွင်းထားတာကို သတိပြုပါ။
[multi-hash ဖိုရမ်](https://github.com/multiformats/multihash).

Multi-hash နဲ့ အရင်က အလုပ်မလုပ်ဖူးဘူးဆိုရင်
ညာဘက်က key byte တွေရဲ့ hexadecimal representation မဟုတ်ဘူး။
(byte တစ်ခုလျှင် သင်္ကေတနှစ်လုံး) သို့မဟုတ်ဘဲ ASCII (သို့) UTF-8),
ဖုန်းခေါ်ပါ `from_hex` နှစ်ခုစလုံးမှာ string စာလုံး `public_key` နှင့်
`private_key` ဥပမာတစ်ခု။

အခေါ်အဝေါ် `PrivateKey::try_from_str` အပေါ်
string literal ကတော့ မှန်ကန်တဲ့ key ကိုပဲ ရမှာပါ
32 bytes vs 64 ဆိုတဲ့ key ထဲက bits တွေကို မှားယွင်းထားရင် error ဖြစ်သွားမှာပါ
သတင်းစကား။

**ဒီယူဆချက် နှစ်ခုစလုံး မှားယွင်းတယ်။** ကံမကောင်းစွာနဲ့ အမှားသတင်းစကားတွေက
ဒီမအောင်မြင်မှုမျိုးကို ဖြေရှင်းဖို့ မကူညီဘူး။

**ပြင်ဆင်နည်း**: အသုံးပြုမှု `hex_literal`. ဒါကလည်း ဆိုးဝါးတဲ့ ကြိုးတစ်ချောင်းကို ပြောင်းသွားလိမ့်မယ်။
ဂဏန်းတွေကို လှပတဲ့ နံပါတ်ခြောက်ခုနစ်လုံးပါတဲ့ စားပွဲလေးတစ်ခုထဲ ထည့်လိုက်တယ်။

::: warning

အင်း၊ `try_from_str` အကောင်အထည်ဖော်ခြင်းသည် ပေးထားသော string သည်
အတည်ပြု `PrivateKey` မဟုတ်ရင် သတိပေးမယ်။

အမှားအယွင်းတွေကို ဖမ်းမိပါလိမ့်မယ် ဥပမာ string မှာ invalid
ဒါပေမဲ့ အဓိကပုံစံများစွာကို ထောက်ပံ့ဖို့ ရည်ရွယ်တာကြောင့် သိပ်မလုပ်နိုင်ပါဘူး။
အခြားတစ်ခုက ၎င်းဟာ သော့က _မှန်ကန်မှု_ ပုဂ္ဂလိက သော့ _ပေးထားတဲ့အတွက်
အကောင့်_ သင်ဟာ ညွှန်ကြားချက် မပေးဘူးဆိုရင်

:::

These အတိအကျ မှားယွင်းမှု အမျိုးမျိုးကို ရှောင်ရှားနိုင်ပါတယ်၊ ဥပမာ၊
ကြိုးစာလုံးတွေကနေ တိုက်ရိုက် deserialising လုပ်ခြင်း (သို့) အသစ်တစ်ခု ဖန်တီးခြင်းဖြင့်
အဓိပ္ပါယ်ရှိတဲ့ နေရာတွေမှာ သော့စုံပါ။
