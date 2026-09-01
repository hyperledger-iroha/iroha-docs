---
translation_locale: my
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` သည် Iroha 3 network peer daemon ဖြစ်သည်။ Cargo package ကို `irohad` ဟုအမည်ပေးထားသည်၊ ထို့ကြောင့် ဘိုင်နရီကို အောက်ပါအတိုင်း source code အလုပ် copy မှခေါ်ယူပါ-

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

အများပြည်သူအတွက် Taira testnet အတွက် release image က `iroha3d_taira` ကို အသုံးပြုပါတယ်။ ၎င်းက တူညီတဲ့ CLI ကို လက်ခံပေမဲ့ ထပ်မံ single protocol-standard ကို ထိုးဖောက်ပေးတယ်။ Taira ကွင်းဆက်၊ validator, storage နှင့် runtime-signer profile ကိုဖွင့်ရန်။ ဤကဲ့သို့သော software execution environment credentials များကိုမဖွင့်ဘဲ Taira configuration ကိုစစ်ဆေးပါ။

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Single protocol-standard ရဲ့ operator ရောင်ပြန်ကြားထားတဲ့ ပုံစံကို သုံးပါ။ Taira Profile: check-in template မှာ deployment placeholder တွေ ရှိနေဆဲပါ။ Nexus ဒါမှမဟုတ် ထုတ်လုပ်မှု SoraFS စစ်ဆေးရာတွင် setting များ Taira.

## `--config` {#arg-config}

- အမျိုးအစား: ဖိုင်လမ်းကြောင်း
- အမည်အမည်: `-c`

[ကွန်ရက် peer ဖွဲ့စည်းမှု](/my/reference/peer-config/index.md) သို့ လမ်းကြောင်း။

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- အမျိုးအစား: ဖိုင်လမ်းကြောင်း

သဘောတူညီချက် အတည်ပြုမှုအတွက် အသုံးပြုသော ရွေးချယ်စရာ blockchain genesis technical manifest JSON။

## `--check-config` {#arg-check-config}

ဖြေရှင်းထားတဲ့ ဖွဲ့စည်းပုံနဲ့ ရနိုင်တဲ့ blockchain genesis ပစ္စည်းကို အတည်ပြုပြီး ကွန်ရက် sockets တွေ မချိတ်ဆက်ဘဲ ထွက်ပါ။

## Kagemusha အရည်အချင်း တံဆိပ်များ {#kagemusha-qualification-seals}

ဒီဖိုင်လမ်းကြောင်းရွေးချယ်မှုများသည် `--check-config` ကိုလိုအပ်ပြီး တစ်ခုတည်းသော ပရိုတိုကောစံညွှန်း တံဆိပ်မရေးခင် Kagemusha အရည်အချင်းပြည့်စုံအောင်မြင်ခြင်း:

- `--write-kagemusha-catalog-qualification-seal <PATH>` က စာရင်းကို အရည်အသွေးပေးတယ်။
- `--write-kagemusha-validator-qualification-seal <PATH>` ကော်မတီက လက်မှတ်ထိုးထားတဲ့ တိုးမြှင့်မှု မှတ်ပုံတင်ချက်အတွက် ဒေသခံ အတည်ပြုသူကို သတ်မှတ်ပေးတယ်။

တံဆိပ် ရွေးချယ်မှု နှစ်ခုဟာ အချင်းချင်း ပဋိပက္ခဖြစ်နေတယ်။

## `--trace-config` {#arg-trace-config}

- အမျိုးအစား: အလံ
- ပတ်ဝန်းကျင်: `TRACE_CONFIG`

ဖွဲ့စည်းမှု အလွှာတွေကို ဖတ်ပြီး ဆန်းစစ်နေစဉ်မှာ ခြေရာခံမှတ်တမ်းကို ဖွင့်ပါ။

## `--config-blake3` {#arg-config-blake3}

- အမျိုးအစား: 64-digit hexadecimal value BLAKE3 cryptographic digest value
- လိုအပ်ချက်များ: `--config`

Configuration file bytes တွေကို ပေးပို့ထားတဲ့ cryptographic digest value နဲ့ ကိုက်ညီအောင် တောင်းဆိုပါ။ integrity bound ဖိုင်ကို flat လုပ်ရပါမယ်၊ `extends` မပါနိုင်ပါဘူး။

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

SoraFS မှအသုံးပြုသော Sora Nexus ပရိုဖိုင်၊ SoraNet လက်ဆွဲခြင်းနှင့် multi-lane သဘောတူညီချက်များကို Activate လုပ်ပါ။ Taira လွှတ်တင်စက်ကို ဤအလံဖြင့်အမြဲတမ်းခေါ်ယူသည်။

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

အထက်ပါ option summary ကို လက်ရှိ `iroha3d` argument definition တွေနဲ့ စစ်ဆေးပါတယ်။ check-in လုပ်ထားတဲ့ help point-in-time data view ကို ၎င်းရဲ့ provenance status ကို စောင့်ဆိုင်းနေတုန်းမှာ ရည်ရွယ်ချက်အရ render မလုပ်ပါဘူး။ checkout အတွက် တိကျတဲ့ အကူအညီကို စစ်ဆေးဖို့ run:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
