---
translation_locale: my
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` သည် စံ Iroha 3 peer အတွက် daemon ဖြစ်သည်။ Cargo ပက်ကေ့ချ်အမည်မှာ `irohad` ဖြစ်သောကြောင့် checkout လုပ်ထားသော ရင်းမြစ်မှ binary ကို အောက်ပါအတိုင်း ခေါ်ယူပါ။

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

အများသုံး Taira testnet အတွက် ထုတ်ဝေမှု image သည် `iroha3d_taira` ကို အသုံးပြုသည်။ တူညီသော CLI ကို လက်ခံသော်လည်း စံသတ်မှတ် Taira chain၊ validator၊ သိုလှောင်မှုနှင့် လည်ပတ်ချိန်လက်မှတ်ထိုးသူပရိုဖိုင်တို့ကို ထပ်မံလိုက်နာစေသည်။ လည်ပတ်ချိန်အထောက်အထားများကို မဖွင့်ဘဲ Taira ပြင်ဆင်သတ်မှတ်မှုကို အောက်ပါအတိုင်း စစ်ဆေးပါ။

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

စံ Taira ပရိုဖိုင်၏ အော်ပရေတာက တန်ဖိုးဖြည့်ပြင်ဆင်ပြီးသောပုံစံကို သုံးပါ။ ရင်းမြစ်ကုဒ်သိုလှောင်ရာတွင် ပါဝင်သော ပုံစံခွက်၌ ဖြန့်ချိတပ်ဆင်မှုအတွက် အစားထိုးဖြည့်ရမည့်တန်ဖိုးများ ပါနေဆဲဖြစ်သည်။ Taira နှင့် စမ်းသပ်ရာတွင် ယေဘုယျ SORA Nexus သို့မဟုတ် ထုတ်လုပ်ရေးသုံး SoraFS သတ်မှတ်ချက်များဖြင့် အစားမထိုးပါနှင့်။

## `--config` {#arg-config}

- အမျိုးအစား: ဖိုင်လမ်းကြောင်း
- အမည်အမည်: `-c`

[နိုဒ်ပြင်ဆင်သတ်မှတ်မှု](/my/reference/peer-config/index.md) သို့ လမ်းကြောင်း။

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- အမျိုးအစား: ဖိုင်လမ်းကြောင်း

သဘောတူညီချက် အတည်ပြုမှုအတွက် အသုံးပြုသော ရွေးချယ်စရာ blockchain genesis technical manifest JSON။

## `--check-config` {#arg-check-config}

ဖြေရှင်းထားတဲ့ ဖွဲ့စည်းပုံနဲ့ ရနိုင်တဲ့ blockchain genesis ပစ္စည်းကို အတည်ပြုပြီး ကွန်ရက် sockets တွေ မချိတ်ဆက်ဘဲ ထွက်ပါ။

## `--json` {#arg-json}

- **အမျိုးအစား:** flag
- **လိုအပ်ချက်:** `--check-config`

`Ready` သို့မဟုတ် `Pending` စာကြောင်းအစား ဤ build နှင့် ပြင်ဆင်သတ်မှတ်မှု၏ ကိုက်ညီမှုတန်ဖိုးများကို Norito JSON object တစ်ခုအဖြစ် ဖော်ပြသည်။

## `--check-storage` {#arg-check-storage}

- **အမျိုးအစား:** flag
- **တွဲသုံး၍မရသောအရာ:** `--check-config`

ရပ်ထားသော နိုဒ်၏ Kura သိုလှောင်မှုနှင့် နောက်ဆုံး snapshot ကို ဤ build ၏ decoder များဖြင့် ဖတ်ရှုမှုသက်သက် စစ်ဆေးပြီး ရလဒ်ကို Norito JSON object တစ်ခုအဖြစ် ဖော်ပြကာ မအောင်မြင်ပါက သုညမဟုတ်သော exit code ဖြင့် ထွက်သည်။ စစ်ဆေးမှုက Kura သိုလှောင်မှု root lock ကို ယူသဖြင့် လည်ပတ်နေသော နိုဒ်က ပိုင်ဆိုင်ထားသည့် သိုလှောင်မှုကို ငြင်းပယ်သည်။ သိုလှောင်မှုကို မည်သည့်အခါမျှ မပြောင်းလဲသလို လုပ်ဆောင်ချိန်သီးသန့် လျှို့ဝှက်ချက်များကိုလည်း မဖွင့်ပါ။

## `--check-replay` {#arg-check-replay}

- **အမျိုးအစား:** flag
- **တွဲသုံး၍မရသောအရာ:** `--check-config`၊ `--check-storage`

ရပ်ထားသော နိုဒ်၏ သိုလှောင်မှုမိတ္တူကို ဤဆော့ဖ်ဝဲတည်ဆောက်မှုဖြင့် ပြန်လုပ်ဆောင်ပြီး ရလဒ်ကို Norito JSON အရာဝတ္ထုတစ်ခုအဖြစ် ထုတ်ပြသည်။ ညွှန်ကြားချက်သည် ဘလော့ခ်များကို ယာယီဖိုင်တွဲသို့ ကူးယူကာ ထိုနေရာတွင် နောက်ဆုံးအခြေအနေမိတ္တူကို ပြန်ရယူခြင်း သို့မဟုတ် လက်မှတ်ထိုးထားသော ကနဦးဘလော့ခ်ကို ပြန်လုပ်ဆောင်ခြင်းပြုလုပ်ပြီး နောက်ပိုင်းဘလော့ခ်တိုင်းကို ပြန်လုပ်ဆောင်သည်။ ဘလော့ခ်တစ်ခု၏ အတည်ပြုလက်မှတ်ရရလဒ်ကို ပြန်မရလျှင် သို့မဟုတ် လိုအပ်သော ဘလော့ခ်အကြောင်းအရာ ပျောက်နေလျှင် သုညမဟုတ်သော ထွက်ခွာကုဒ်ဖြင့် အဆုံးသတ်သည်။ မူရင်းသိုလှောင်မှုသို့ မည်သည့်အခါမျှ မရေးသလို လည်ပတ်ချိန်သီးသန့် လျှို့ဝှက်ချက်များကိုလည်း မဖွင့်ပါ။

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **အမျိုးအစား:** အကောင့် ID
- **လိုအပ်ချက်:** `--check-config`

အော့ဖ်လိုင်း စစ်ဆေးချိန်တွင် လက်မှတ်ထိုးထားသော genesis အတိအကျကို လုပ်ဆောင်ပြီးနောက် ဤမှတ်ပုံတင်ထားသော အကောင့်၌ SoraCloud ဖြန့်ချိတပ်ဆင်ခွင့် authority ဆက်ရှိရန် လိုအပ်သည်။

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **အမျိုးအစား:** flag

ဤစတင်မှုတစ်ကြိမ်အတွက်သာ နိုဒ်၏ consensus ကီးများသည် ဤချိန်းအတွက် မည်သည့်အခါမျှ လက်မှတ်မထိုးဖူးကြောင်း အခိုင်အမာ ကြေညာသည်။ Sumeragi သည် ကီးတစ်ခုစီအတွက် ဘေးကင်းရေးမှတ်တမ်းကို ထိန်းသိမ်းပြီး မှတ်တမ်းမပျောက်ဆုံးကြောင်း သက်သေမရမချင်း မှတ်တမ်းမရှိဘဲ မည်သည့်အရာကိုမျှ လက်မှတ်မထိုးပါ။ ဤ flag ကို ကီးအသစ်၏ ပထမစတင်မှုတွင် တစ်ကြိမ်သာ ပေးပြီး ဒေတာပျောက်ဆုံးပြီးနောက် မည်သည့်အခါမျှ မပေးပါနှင့်။

## `--trace-config` {#arg-trace-config}

- အမျိုးအစား: အလံ
- ပတ်ဝန်းကျင်: `TRACE_CONFIG`

ဖွဲ့စည်းမှု အလွှာတွေကို ဖတ်ပြီး ဆန်းစစ်နေစဉ်မှာ ခြေရာခံမှတ်တမ်းကို ဖွင့်ပါ။

## `--config-blake3` {#arg-config-blake3}

- အမျိုးအစား: 64-digit hexadecimal value BLAKE3 cryptographic digest value
- လိုအပ်ချက်များ: `--config`

ပြင်ဆင်သတ်မှတ်မှုဖိုင်၏ ဘိုက်များသည် ပေးထားသော digest နှင့် ကိုက်ညီရမည်။ ပြည့်စုံမှန်ကန်မှုအတွက် ချိတ်ထားသောဖိုင်သည် အလွှာအားလုံးပေါင်းစည်းထားရမည်ဖြစ်ပြီး `extends` မပါရပါ။

## `--terminal-colors` {#arg-terminal-colors}

- အမျိုးအစား: `--terminal-colors=true` (သို့) `--terminal-colors=false` အဖြစ် ထုတ်လွှင့်ထားသော ဘူးလစ်
- အလိုအလျောက်: terminal capacity ကိုရှာဖွေခြင်း
- ပတ်ဝန်းကျင်: `TERMINAL_COLORS`

ANSI အရောင်ထွက်ကို ထိန်းချုပ်ပါ။

## `--language` {#arg-language}

- အမျိုးအစား: string

Daemon စာတိုများအတွက် အသုံးပြုသော စနစ် ဘာသာစကားကို override လုပ်ပါ။

## `--sora` {#arg-sora}

- အမျိုးအစား: အလံ
- ပတ်ဝန်းကျင်: `IROHA_SORA_PROFILE`

SoraFS၊ SoraNet ဆက်သွယ်မှုစတင်သဘောတူညီချက်နှင့် လမ်းကြောင်းများစွာသုံး သဘောတူညီမှုအတွက် အသုံးပြုသော SORA Nexus ပရိုဖိုင်ကို ဖွင့်သည်။ Taira စတင်ပေးသည့်ကိရိယာကို ဤရွေးချယ်မှုဖြင့် အမြဲခေါ်ယူသည်။

## FastPQ အပိုဒ်များ {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` နှင့် `--fastpq-poseidon-mode <MODE>` တို့သည် `cpu` သို့မဟုတ် `gpu` ကိုသာ လက်ခံကြသည်။ ကျန်သော ရွေးချယ်စရာများတွင် တယ်လီမထရီ တံဆိပ်များကို လွှဲပြောင်းထားသည်-

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

ဥပမာ-

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## ရလာသော အကူအညီ {#generated-help}

အထက်ပါ ရွေးချယ်စရာအကျဉ်းချုပ်သည် သတ်မှတ်ထားသော Iroha commit ရှိ `iroha3d` argument သတ်မှတ်ချက်များကို လိုက်နာသည်။ သင့် checkout ၏ အကူအညီအတိအကျကို စစ်ဆေးရန်:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
