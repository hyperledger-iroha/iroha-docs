---
translation_locale: my
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration ပြဿနာများကို ဖြေရှင်းခြင်း {#troubleshooting-configuration-issues}

ဤအပိုင်းတွင် Iroha 3 ဖွဲ့စည်းမှုအတွက်ပြဿနာဖြေရှင်းရေး အကြံပြုချက်များကို ဖော်ပြထားပါသည်။ [သော့တွေကို စစ်ခဲ့တယ်။](./overview.md#check-the-keys) ကို အရင်ဆုံးစစ်ဆေးရန် သေချာစေပါ၊ ၎င်းသည် Iroha တွင်ဖြစ်ပေါ်သော ပြဿနာများ၏ အများဆုံးရင်းမြစ်ဖြစ်သည်။

သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီမှာ ဖော်ပြမထားဘူးဆိုရင် [အွန်လိုင်း](https://t.me/hyperledgeriroha) မှ ဆက်သွယ်ပါ။

## Docker Compose setup ပေါ်တွင် ခေတ်နောက်ကျသော blockchain genesis {#outdated-genesis-on-a-docker-compose-setup}

Iroha ရဲ့ Docker Compose ဗားရှင်းကို သုံးနေစဉ်မှာ `Failed to deserialize raw genesis block` အမှားနဲ့ ကျရှုံးနေတဲ့ ကွန်ရက် တူညီတဲ့ container တစ်ခုရဲ့ ပြဿနာကို တွေ့နိုင်ပါတယ်။ ဤသည်မှာ ပုံမှန်အားဖြင့်ကွန်ရက် peer, လက်မှတ်ရေးထိုး blockchain ကိုဗစ်လုပ်ငန်းစဉ်များနှင့်ဖန်တီးထားသော configuration များကို Iroha မတူညီသော revisions သို့မဟုတ် profile များဖြင့်ထုတ်လုပ်ခဲ့သည်။

ဤအဆင့်များဖြင့် ပျက်ကွက်မှုကို စစ်ဆေးပါ-

1. လက်ရှိ container များကိုစစ်ဆေးရန် `docker ps` ကိုအသုံးပြုပါ။ ဖန်တီးထားသော profile ကိုအမှီပြု၍ `hyperledger/iroha:dev` containers များကိုတွေ့မြင်နိုင်သည်။ ကြိုတင်သွင်းထားသော Docker Compose profile တွင် network peer containers လေးခုပါဝင်သည်၊ သို့သော်လည်း သင်ဖန်တီးထားသော `docker-compose.yml` ကွာခြားနိုင်သည်။

2. log များကို စစ်ဆေးပြီး `Failed to deserialize raw genesis block` အမှားကိုရှာပါ။ သင်သည် Iroha ကို daemon mode တွင် `docker compose up -d` ဖြင့်စတင်ခဲ့ပါက `docker compose logs` command ကိုအသုံးပြုပါ။

Iroha ကို အသုံးပြုခြင်းဖြင့် ဤကဲ့သို့သော ပြဿနာကို ဖြေရှင်းရန် နည်းလမ်းသည် မူလ demo တစ်ခုဖြစ်ပါက Kagami နှင့် လိုက်ဖက်သော localnet သို့မဟုတ် Docker Compose ဘန်ဒယ်ကို ပြန်လည်ပြုပြင်ပါ။

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

ထို့နောက် ပြန်လည်ထုတ်လုပ်ထားသော `genesis.signed.nrt`, network peer `config.toml` နှင့် `client.toml` ဖိုင်များမှ container အခြေအနေဟောင်းကိုဖယ်ရှားပြီး restart လုပ်ပါ။

Iroha instance data ကို ပြန်လည်ထူထောင်ရန် လိုအပ်ပါက အောက်ပါအတိုင်း လုပ်ပါ။

1. ဒုတိယ Iroha network peer ကို ချိတ်ဆက်ပေးပါ ပထမ (မအောင်မြင်) network peer ကနေ ဒေတာကို ကူးယူပါမည်။
2. Network peer အသစ်က ပထမဆုံး network peer နဲ့ ဒေတာကို synchronize လုပ်ဖို့ စောင့်ပါ။
3. ကွန်ရက်အသစ်ရဲ့ peer ကို တက်ကြွအောင်လုပ်ပါ။
4. ပထမဦးဆုံးကွန်ရက် peer ရဲ့ blockchain ဖြစ်စဉ်နဲ့ ဖွဲ့စည်းမှုဖိုင်တွေကို ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုရဲ့ အစိတ်အပိုင်းအဖြစ်ပဲ Update လုပ်ပါ။

::: info

Live network တွင် genesis ကို အစားထိုးရန် ယေဘုယျ အလိုအလျောက်ပြန်ရေးလမ်းကြောင်း မရှိပါ။ ၎င်းကို ညှိနှိုင်းထားသော migration အဖြစ် မှတ်ယူပါ။ အဟောင်း state ကို ထိန်းသိမ်းပါ၊ ကိုက်ညီသော peer များကို စတင်ပါ၊ operator များက migration plan ကို သဘောတူပြီးနောက်မှသာ validator များကို configuration အသစ်သို့ ရွှေ့ပါ။

:::

## ပုဂ္ဂလိကနှင့် အများပိုင် သော့များ၏ Multi-Hash Format {#multihash-format-of-private-and-public-keys}

[Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md) ကို ကြည့်လိုက်ရင် အဲဒီမှာရှိတဲ့ သော့တွေကို [multi-hash ဖိုရမ်](https://github.com/multiformats/multihash) မှာ ပေးထားတာကို သတိပြုမိမှာပါ။

Multi-hash ကို အရင်က တစ်ခါမှ မလုပ်ခဲ့ဘူးဆိုရင် လက်ယာဘက်ဟာ key byte တွေရဲ့ hexadecimal representation မဟုတ်ဘူးလို့ ယူဆဖို့ သဘာဝပါ။ ASCII (သို့မဟုတ် UTF-8) အဖြစ် ကုဒ်ပေးထားသော bytes များအစား၊ `public_key` နှင့် `private_key` နှစ်ခုစလုံးတွင် string စာလုံးစာရင်းမှာ `from_hex` ကိုခေါ်ဆိုသည်။

`PrivateKey::try_from_str` ကို ကြိုးစာလုံးမှာခေါ်ဆိုခြင်းက မှန်ကန်တဲ့ သော့ကိုသာ ထုတ်ပေးလိမ့်မယ်လို့ ယူဆဖို့လည်း သဘာဝကျပါတယ်။ ဒီတော့ သော့ထဲက ဘိုက်တွေအရေအတွက် မှားယွင်းရင် ဥပမာ 32 bytes vs 64, ဒါကအမှားသတင်းစကားတစ်စောင် ဖြစ်ပေါ်စေပါလိမ့်မယ်။

ဒီယူဆချက် နှစ်ခုစလုံး မှားယွင်းတယ်။ ကံမကောင်းစွာနဲ့ ဒီအမှားအယွင်းတွေကို ဖြေရှင်းဖို့ အမှားသတင်းတွေက မကူညီဘူး။

ပြင်ဆင်နည်း: `hex_literal` ကိုသုံးပါ။ ဒါကလည်း မိုက်မဲတဲ့ စာလုံးကြိုးကို သိသိသာသာ ခြောက်ဆယ်ကိန်း ဂဏန်းပါတဲ့ လှပတဲ့ စားပွဲလေးတစ်ခုအဖြစ် ပြောင်းပေးပါလိမ့်မယ်။

::: warning

`try_from_str` အကောင်အထည်ဖော်မှုတောင်မှ သတ်မှတ်ထားတဲ့ string တစ်ခုက valid `PrivateKey` ဆိုတာကို စစ်ဆေးလို့မရနိုင်ပြီး မဟုတ်ရင် သတိပေးနိုင်ပါတယ်။

သော့ကလစ်ဟာ မတည်ငြိမ်တဲ့ သင်္ကေတတစ်ခုပါဝင်တယ်ဆိုပါစို့၊ အမှားအယွင်းတွေကို ဖမ်းမိပါလိမ့်မယ်။ ဒါပေမဲ့ ကျွန်တော်တို့က အဓိကပုံစံများစွာကို ထောက်ပံ့ဖို့ ရည်ရွယ်တာကြောင့် အခြားအရာတွေ အများကြီး လုပ်လို့မရဘူး။ သင်ညွှန်ကြားချက်မတင်ရင် Key က သတ်မှတ်ထားတဲ့ အကောင့်အတွက် မှန်ကန်တဲ့ Private Key ဖြစ်မလားဆိုတာလည်း မသိနိုင်ပါဘူး။

:::

ဒီလိုသိမ်မွေ့တဲ့ အမှားတွေကို ရှောင်ရှားနိုင်ပါတယ်။ ဥပမာ string literal တွေကနေ တိုက်ရိုက် deserialising လုပ်ခြင်း (သို့) အဓိပ္ပါယ်ရှိတဲ့ နေရာတွေမှာ သော့စုံအသစ်တစ်ခု ဖန်တီးခြင်းပါ။
