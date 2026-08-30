---
translation_locale: my
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` ဟာ စံချိန်တင် Iroha 3 peer daemon ပါ။ Cargo package ကို `irohad` လို့အမည်ပေးထားတော့ source checkout ကနေ binary ကိုခေါ်ယူပါ

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

အများပြည်သူအတွက် Taira testnet အတွက် release image မှာ `iroha3d_taira` ကို သုံးပါတယ်။ တူညီသော CLI ကို လက်ခံသည်။ Taira ကွင်းဆက်၊ validator set၊ storage settings နဲ့ runtime signing keys တွေကိုလည်း ချမှတ်ပေးပါတယ်။ Taira Configuration ကို Runtime Credentials တွေ မဖွင့်ဘဲ အတည်ပြုပါ

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

အသုံးပြုမှုမတိုင်မီ operator က Canonical Taira profile ကို render လုပ်ရပါမယ်။ Check-in template မှာ Example Settings တွေရှိပါတယ် Operator က နမူနာ setting တစ်ခုစီကို အစားထိုးပေးရပါမယ်။ Taira နှင့် စမ်းသပ်ရာတွင် ယေဘုယျ Nexus သို့မဟုတ် ထုတ်လုပ်ရေး SoraFS သတ်မှတ်ချက်များကို မသုံးရပါ။

## `--config` {#arg-config}

- အမျိုးအစား: ဖိုင်လမ်းကြောင်း
- အမည်အမည်: `-c`

[ peer configuration ](/my/reference/peer-config/index.md) သို့သွားသောလမ်းကြောင်း

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- အမျိုးအစား: ဖိုင်လမ်းကြောင်း

သဘောတူညီချက် အတည်ပြုမှုအတွက် အသုံးပြုသော ရွေးချယ်စရာ မျိုးဆက်ထုတ်ပြန်ချက် JSON ။

## `--check-config` {#arg-check-config}

ဖြေရှင်းထားတဲ့ ဖွဲ့စည်းပုံနဲ့ ရယူနိုင်တဲ့ ဂျင်းစီစ် ပစ္စည်းကို အတည်ပြုပြီး ကွန်ရက် ဆော့ကက်တွေ မချိတ်ဆက်ဘဲ ထွက်ပါ။

## Kagemusha အရည်အချင်း တံဆိပ်များ {#kagemusha-qualification-seals}

ဤဖိုင်လမ်းကြောင်းရွေးချယ်မှုများသည် `--check-config` ကိုလိုအပ်ပြီး တရားဝင် တံဆိပ်မရေးခင် Kagemusha အရည်အချင်းပြည့်စုံကိုပြုလုပ်သည်:

- `--write-kagemusha-catalog-qualification-seal <PATH>` က စာရင်းကို အရည်အသွေးပေးတယ်။
- `--write-kagemusha-validator-qualification-seal <PATH>` ကော်မတီက လက်မှတ်ထိုးထားတဲ့ တိုးမြှင့်မှု မှတ်ပုံတင်ချက်အတွက် ဒေသခံ အတည်ပြုသူကို သတ်မှတ်ပေးတယ်။

တံဆိပ် ရွေးချယ်မှု နှစ်ခုဟာ အချင်းချင်း ပဋိပက္ခဖြစ်နေတယ်။

## `--trace-config` {#arg-trace-config}

- အမျိုးအစား: အလံ
- ပတ်ဝန်းကျင်: `TRACE_CONFIG`

ဖွဲ့စည်းမှု အလွှာတွေကို ဖတ်ပြီး ဆန်းစစ်နေစဉ်မှာ ခြေရာခံမှတ်တမ်းကို ဖွင့်ပါ။

## `--config-blake3` {#arg-config-blake3}

- အမျိုးအစား - ၆၄ ဂဏန်း hexadecimal BLAKE3 digest
- လိုအပ်ချက်များ: `--config`

Configuration file bytes တွေကို ပေးပို့ထားတဲ့ digest နဲ့ ကိုက်ညီဖို့ တောင်းဆိုပါ။ integrity bound ဖိုင်ကို flat လုပ်ဖို့လိုပါတယ်။ `extends` မပါနိုင်ပါဘူး။

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

Sora Nexus Profile ကို Activate လုပ်ပါ။ ဒီပရိုဖိုင်မှာ SoraFS, SoraNet လက်ဆွဲခြင်းနဲ့ multi-lane သဘောတူညီချက်တွေကို သတ်မှတ်ထားတယ်။ ဒီအလံနဲ့ Taira လွှတ်တင်ကိရိယာကို အမြဲတမ်းခေါ်ယူပါ။

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

အောက်ပါအပြည့်အစုံထုတ်လုပ်မှုသည် Iroha ပိတ်ထားတဲ့ အရင်းအမြစ် commit မှထုတ်လုပ်ထားသည်။

<<< @/snippets/iroha3d-help.md
