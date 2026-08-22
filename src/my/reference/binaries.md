---
translation_locale: my
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# အတူအလုပ်လုပ် Iroha Binaries {#working-with-iroha-binaries}

ဟိ Iroha 3 အော်ပရေတာ အလုပ်အသွားအလာသည် အဓိက binaries သုံးခုကို လှည့်ပတ်နေသည်-

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) peer daemon ကို run ရန်
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) အတွက် CLI အော်ပရေတာ အမိန့်များ
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) သော့များ၊ ဥပါဒ်များ၊ localnets နှင့် ပရိုဖိုင်များအတွက်

## အရင်းအမြစ်မှတည်ဆောက်ပါ။ {#build-from-source}

အထက်စီးကြောင်း workspace root မှ-

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ထွက်လာသည့် ဒွိစုံများကို ရရှိနိုင်ပါပြီ။ `target/release/`.

အမိန့်ပေးမျက်နှာပြင်ကို စစ်ဆေးရန်-

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Repository မှ တိုက်ရိုက် Run ပါ။ {#run-directly-from-the-repository}

တစ်ကမ္ဘာလုံးတွင် မည်သည့်အရာကိုမျှ မတပ်ဆင်လိုပါက အသုံးပြုပါ။ `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ပုံ {#docker-image}

အထက်ပိုင်းအလုပ်ခွင်ကို အသုံးပြုသည်။ `kagami localnet` နှင့် `kagami docker` generate လုပ်ဖို့
Docker Compose ထုတ်ယူထားသောကုဒ်နှင့် ကိုက်ညီသောဖိုင်များ။ဟိ `hyperledger/iroha:dev`
ထုတ်ပေးထားသော ဖိုင်များဖြင့် ပုံအား အသုံးပြုနိုင်သည်။

ပြေးပါ။ CLI ကွန်တိန်နာတစ်ခုတွင်-

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

ပြေး Kagami ကွန်တိန်နာတစ်ခုတွင်-

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

သက်တူရွယ်တူ စတင်ခြင်းအတွက်၊ localnet တစ်ခုကို ထုတ်ပေးပြီး ဖိုင်ကို အရင်ရေးပါ-

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## ဘယ် Binary ကိုသုံးသင့်သလဲ {#which-binary-should-i-use}

- သုံးပါ။ `irohad` သင်စတင်ခြင်း သို့မဟုတ် လည်ပတ်နေချိန်တွင် လုပ်ဖော်ကိုင်ဖက်များ။
- သုံးပါ။ `iroha` လယ်ဂျာကို စုံစမ်းမေးမြန်းရန် လိုအပ်သည့်အခါ၊ ငွေပေးငွေယူများ တင်သွင်းရန်၊ သို့မဟုတ် အော်ပရေတာ အဆုံးမှတ်များကို စစ်ဆေးပါ။
- သုံးပါ။ `kagami` သင်သည် သော့များ၊ ဥပါဒ် သရုပ်ဖော်မှုများ၊ ပရိုဖိုင် အစုအဝေးများ သို့မဟုတ် စက်တွင်းကွန်ရက် ပိုင်ဆိုင်မှုများကို လိုအပ်သည့်အခါ။

## Kagemusha ထုတ်ဝေဖြန့်ချိမှုနှင့် ထုတ်ဝေမှု {#kagemusha-release-publication-and-rollout}

Kagemusha V4 ထုတ်ဝေခြင်းနှင့် အသက်သွင်းခြင်းတို့သည် သီးခြားကာကွယ်ထားသော နယ်နိမိတ်များကို ဖြတ်ကျော်သည်-

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` သည်
  macOS သီးသန့်၊ အမြစ်သီးသန့်ထုတ်ဝေသူ။၎င်းသည် pinned ကိုစစ်မှန်ကြောင်းသက်သေပြသည်။ Kagami binary နှင့်
  အတိအကျ ဆယ့်ခြောက်ဖိုင် ကိုယ်စားလှယ်လောင်း၊ ပျက်ကွက်ကို ထုတ်ပြန်သည်။
  `promotion-record-v4.norito` အစားထိုးခြင်းမရှိဘဲ အောင်မြင်မှုကိုသာ ဖော်ပြသည်။
  အတိအကျ ဆယ့်ခုနစ်ဖိုင်ကို မြှင့်တင်ပြီးနောက် ထုတ်ဝေမှုကို အတည်ပြုသည်။
- `iroha offline kagemusha rollout-v4 create-expectations` လက်မှတ်ရေးထိုး အတည်ပြုသည်။
  ကြိုတင်မှာကြားထားမှု၊ တိကျသော အရည်အချင်းစစ် တံဆိပ်တုံးလေးခု၊
  ခွင့်ပြုပြီးသား ငွေပေးငွေယူဝါယာကြိုးနှင့် ယုံကြည်စိတ်ချရသော အပြီးသတ်ကျောက်ဆူးများ
  အစားထိုးခြင်းမရှိဘဲ လက်မှတ်ရေးထိုးထားသော မျှော်လင့်ချက်များကို ထုတ်ဝေခြင်း။
- `iroha offline kagemusha rollout-v4 submit` ပြတ်သားစွာလိုအပ်သည်။
  `--write-authorized` သဘောတူညီချက်အဲဒါကို ဂျာနယ်တွေမှာ အတိအကျ ပြန်ပြီး စိစစ်တယ်။
  ကွန်ရက်တစ်ခုမရေးမီ သို့မဟုတ် ထပ်စမ်းကြည့်ပါ။တစ်ခု `Applied` အခြေနေက မဟုတ်ဘူး။
  လုံလောက်သည်- အမိန့်သည် ကတိပြုထားသော ဘလောက်၊ နောက်ဆုံးဆက်ခံသူကိုလည်း စစ်ဆေးသည်။
  ကွင်းဆက်၊ နှင့် ခွင့်ပြုချက်အပြည့်အ၀ရှိသော ငွေပေးငွေယူဝါယာကြိုး။
- `iroha offline kagemusha rollout-v4 finalize-receipt` သည် တိကျသော submission
  journal အား ပြန်လည်အတည်ပြုပြီးမှသာ တူညီသော proof-anchored အထောက်အထားကို
  စုဆောင်းကာ၊ လွတ်လပ်သော ပြေစာထုတ်ပေးသူဖြင့် လက်မှတ်ရေးထိုးပြီး canonical ပြေစာကို
  အစားမထိုးဘဲ ထုတ်ဝေသည်။

စာရင်းသွင်းထားသော Kagemusha ထုတ်လုပ်မှု-အဆင်သင့်လုပ်ဆောင်မှုအသွားအလာသည် အတည်ပြုခြင်းသာဖြစ်သည်။
၎င်းသည် စစ်မှန်သော ထုတ်ဝေသူကို မခေါ်ပါ၊ မှန်ကန်သော အရည်အချင်းစစ် ထုတ်ဝေသူကို မခေါ်ပါ။
တံဆိပ်ခတ်ခြင်း၊ အသက်သွင်းခြင်းတစ်ခုတင်ပြပါ သို့မဟုတ် နောက်ဆုံးလက်ခံဖြတ်ပိုင်းတစ်ခုဖန်တီးပါ။အောင်မြင်သောအလုပ်အသွားအလာ
ထို့ကြောင့် run သည် ပရိုမိုးရှင်းနှင့် တိုက်ရိုက်ထုတ်လွှင့်မှုကို သက်သေမပြပါ။

ဤအမိန့်များသည် တိုက်ရိုက်အထောက်အထားအတွက် အစားထိုးခြင်း မဟုတ်ဘဲ ဒေသဆိုင်ရာ မူလအစများဖြစ်သည်။တစ်
ရုပ်ပိုင်းဆိုင်ရာ အက်ပ်အတည်ပြုချက်အစစ်အမှန်မရှိဘဲ ထုတ်လုပ်ဖြန့်ချိမှုကို ပိတ်ဆို့ထားဆဲဖြစ်သည်။
ကိုယ်စားလှယ်လောင်း ပစ္စည်းများ၊ အကာအကွယ်ပေးထားသည့် တံဆိပ် လေးခုလုံး၊ runtime အုပ်ချုပ်မှုနှင့်
လက်မှတ်ထိုး သွင်းအားစုများ၊ တိုက်ရိုက် တရားဝင် တင်သွင်းမှု လေးခုနှင့် နောက်ဆုံး အထောက်အထားများ နှင့်
canonical effective-configuration projectionသီးသန့်သော့များထားရှိရန်၊
စစ်မှန်ကြောင်း အထောက်အထား နှင့် ကာကွယ်ထားသော အရောင်းမြှင့်တင်ရေးဆိုင်ရာ သတ်မှတ်ထားသော အထောက်အထားများ
အချုပ်အနှောင်၊၎င်းတို့ကို အရင်းအမြစ်-ထိန်းချုပ်ထားသော စာရွက်စာတမ်းများ သို့မဟုတ် ကူးယူခြင်းမပြုပါနှင့်
အော်ပရေတာလက်မှတ်များ။
