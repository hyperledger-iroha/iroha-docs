---
translation_locale: my
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration ပြဿနာများကို ဖြေရှင်းခြင်း {#troubleshooting-configuration-issues}

ဤအပိုဒ်သည် ပြဿနာဖြေရှင်းရေး အကြံပြုချက်များကို ပေးသည်။ Iroha 3 Configuration ကို သေချာအောင်လုပ် [သော့တွေကို စစ်ခဲ့တယ်။](./overview.md#check-the-keys) ပထမဦးဆုံးအနေနဲ့ ဒါဟာ ပြဿနာတွေရဲ့ အများဆုံးရင်းမြစ်ဖြစ်တာကြောင့် Iroha.

သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီမှာ ဖော်ပြမထားဘူးဆိုရင် [Telegram ](https://t.me/hyperledgeriroha) မှ ဆက်သွယ်ပါ။

## Docker Compose စီမံခန့်ခွဲမှုမှာ ခေတ်နောက်ကျနေသော ဇီဝဖြစ်စဉ် {#outdated-genesis-on-a-docker-compose-setup}

Iroha ၏ Docker Compose ဗားရှင်းကို အသုံးပြုနေစဉ်တွင် `Failed to deserialize raw genesis block` မှားယွင်းမှုရှိသည့် peer container တစ်ခု၏ပြဿနာနှင့် ကြုံတွေ့နိုင်သည်။ ဆိုလိုသည်မှာ peer, signed genesis transaction နှင့် generated configuration တို့ကို Iroha မူကွဲများ သို့မဟုတ် ပရိုဖိုင်များမှ ထုတ်လုပ်ခဲ့ခြင်းဖြစ်သည်။

ဤအဆင့်များဖြင့် ပျက်ကွက်မှုကို စစ်ဆေးပါ-

1. `docker ps` ကိုသုံးပြီး လက်ရှိ container များကို စစ်ဆေးပါ။ ထုတ်လုပ်ထားသော profile ကိုအမှီပြု၍ `hyperledger/iroha:dev` containers များကို တွေ့မြင်နိုင်သည်။ ကြိုတင်သွင်းထားသော Docker Compose profile တွင် peer containers လေးခုပါဝင်သော်လည်း ထုတ်ပေးထားသည့် `docker-compose.yml` ကွာခြားနိုင်ပါသည်။

2. log များကို စစ်ဆေးပြီး `Failed to deserialize raw genesis block` အမှားကိုရှာပါ။ သင်သည် Iroha ကို daemon mode တွင် `docker compose up -d` ဖြင့်စတင်ခဲ့ပါက `docker compose logs` command ကိုအသုံးပြုပါ။

Iroha ကို အသုံးပြုခြင်းဖြင့် ဤကဲ့သို့သော ပြဿနာကို ဖြေရှင်းနိုင်ရန် နည်းလမ်းများရှိသည်။ ဤသည်မှာ အခြေခံပြသနာတစ်ခုဖြစ်ပါက နှင့်သင်၏ peer data များကို ထိန်းသိမ်းရန် မလိုပါက Kagami နှင့်အတူသင့်လျော်သော localnet သို့မဟုတ် Docker Compose ဘန်ဒယ်ကို ပြန်လည်ဖန်တီးပါ။

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

အဲဒီနောက် container အခြေအနေဟောင်းကို ဖယ်ရှားပြီး ပြန်လည်ပြုပြင်ထားတဲ့ `genesis.signed.nrt`, peer `config.toml` နဲ့ `client.toml` ဖိုင်တွေကနေ ပြန်စတင်ပေးပါ။

Iroha instance data ကို ပြန်လည်ထူထောင်ရန် လိုအပ်ပါက အောက်ပါအတိုင်း လုပ်ပါ။

1. ဒုတိယ Iroha peer ကို ချိတ်ဆက်ပေးပါ ပထမ (မအောင်မြင်) peer ကနေ ဒေတာကို ကူးယူပါမည်။
2. peer အသစ်က ပထမဆုံး peer နဲ့ ဒေတာကို synchronize လုပ်ဖို့ စောင့်ပါ။
3. အဖော်သစ်ကို တက်ကြွအောင်ထားပါ။
4. Coordinated migration တစ်ခုရဲ့ အစိတ်အပိုင်းအဖြစ်သာ ပထမဦးဆုံး peer ရဲ့ ဖြစ်စဉ်နဲ့ ဖွဲ့စည်းမှု ဖိုင်တွေကို Update လုပ်ပေးပါ။

::: info

တိုက်ရိုက်ကွန်ရက်တစ်ခုမှာ genesis အစားထိုးဖို့ အထွေထွေ အလိုအလျောက်ပြန်ရေးလမ်းမရှိပါ။ ဒါကို ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုအဖြစ် සලකාကြည့်ပါ-ဟောင်းအခြေအနေကို ထိန်းသိမ်းခြင်း၊ လိုက်ဖက်တဲ့ တူညီသူတွေကို ထုတ်ယူခြင်းနှင့် အတည်ပြုသူများကို ရွှေ့ပြောင်းပေးသူများသည် ရွှေ့ပြောင်းရေး အစီအစဉ်အပေါ် သဘောတူပြီးနောက်မှသာ အသစ်အဆင့်သို့ ရွှေ့ပြောင်းနိုင်သည်။

:::

## ပုဂ္ဂလိကနှင့် အများပိုင် သော့များ၏ Multi-Hash Format {#multihash-format-of-private-and-public-keys}

[client configuration](/my/guide/configure/client-configuration.md) ကိုကြည့်ရင် အဲဒီမှာရှိတဲ့ သော့တွေကို [multi-hash format ](https://github.com/multiformats/multihash) မှာ ပေးထားတာကို သတိပြုမိမှာပါ။

သင်ဟာ multi-hash ကို အရင်က တစ်ခါမှ မလုပ်ခဲ့ဘူးဆိုရင်၊ လက်ယာဘက်မှာ key byte တွေရဲ့ hexadecimal ကိုယ်စားပြုချက် မဟုတ်ဘဲ ASCII (သို့မဟုတ် UTF-8) လို့ ကုဒ်သွင်းထားတဲ့ byte တွေကိုသာ ယူဆဖို့ သဘာဝပါ။ နောက်ပြီး `public_key` နဲ့ `private_key` နှစ်ခုစလုံးမှာ string စာလုံးစာရင်းမှာ `from_hex` ကိုခေါ်ပါ။

`PrivateKey::try_from_str` ကို ကြိုးစာလုံးမှာခေါ်ဆိုခြင်းက မှန်ကန်တဲ့ သော့ကိုသာ ထုတ်ပေးလိမ့်မယ်လို့ ယူဆဖို့လည်း သဘာဝကျပါတယ်။ ဒီတော့ သော့ထဲက ဘိုက်တွေအရေအတွက် မှားယွင်းရင် ဥပမာ 32 bytes vs 64, ဒါကအမှားသတင်းစကားတစ်စောင် ဖြစ်ပေါ်စေပါလိမ့်မယ်။

ဒီယူဆချက် နှစ်ခုစလုံး မှားယွင်းတယ်။ ကံမကောင်းစွာနဲ့ ဒီအမှားအယွင်းတွေကို ဖြေရှင်းဖို့ အမှားသတင်းတွေက မကူညီဘူး။

ပြင်ဆင်နည်း: `hex_literal` ကိုသုံးပါ။ ဒါကလည်း မိုက်မဲတဲ့ စာလုံးကြိုးကို သိသိသာသာ ခြောက်ဆယ်ကိန်း ဂဏန်းပါတဲ့ လှပတဲ့ စားပွဲလေးတစ်ခုအဖြစ် ပြောင်းပေးပါလိမ့်မယ်။

::: warning

`try_from_str` အကောင်အထည်ဖော်မှုတောင်မှ သတ်မှတ်ထားတဲ့ string တစ်ခုက valid `PrivateKey` ဆိုတာကို စစ်ဆေးလို့မရနိုင်ပြီး မဟုတ်ရင် သတိပေးနိုင်ပါတယ်။

သော့ကလစ်ဟာ မတည်ငြိမ်တဲ့ သင်္ကေတတစ်ခုပါဝင်တယ်ဆိုပါစို့၊ အမှားအယွင်းတွေကို ဖမ်းမိပါလိမ့်မယ်။ ဒါပေမဲ့ ကျွန်တော်တို့က အဓိကပုံစံများစွာကို ထောက်ပံ့ဖို့ ရည်ရွယ်တာကြောင့် အခြားနည်းတွေ အများကြီး လုပ်လို့မရဘူး။ သင် ညွှန်ကြားချက်မတင်ရင် ခလုတ်ဟာ သတ်မှတ်ထားတဲ့ အကောင့်အတွက် မှန်ကန်တဲ့ ပုဂ္ဂလိက ခလုတ်လားဆိုတာလည်း မသိနိုင်ပါ။

:::

ဒီလိုသိမ်မွေ့တဲ့ အမှားတွေကို ရှောင်ရှားနိုင်ပါတယ်။ ဥပမာ string literal တွေကနေ တိုက်ရိုက် deserialising လုပ်ခြင်း (သို့) အဓိပ္ပါယ်ရှိတဲ့ နေရာတွေမှာ သော့စုံအသစ်တစ်ခု ဖန်တီးခြင်းပါ။
