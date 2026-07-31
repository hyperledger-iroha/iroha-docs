---
translation_locale: my
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` စနေ Iroha 3 Peer Daemon ပါ။

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **အမျိုးအစား:** ဖိုင်လမ်းကြောင်း
- **Alias:** `-c`

လမ်းကြောင်း [ဖွဲ့စည်းပုံ](/my/reference/peer-config/index.md) မှတ်တမ်းတင်ပါ။

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **အမျိုးအစား:** ဖိုင်လမ်းကြောင်း

ဘီဘီစီထုတ်ပြန်ချက်အတွက် ရွေးချယ်စရာလမ်းကြောင်း JSON file ကို အသုံးပြုပါ။
Start ကို generated manifest နဲ့အတူ validates Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Configuration ကိုဖတ်ခြင်းနှင့် parsing ၏ trace log များကို enable လုပ်ပေးသည်။ Configuration ပြဿနာဖြေရှင်းရေးအတွက် အသုံးဝင်နိုင်ပါသည်။

- **အမျိုးအစား:** အလံ
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **အမျိုးအစား:** ဘူးလစ် `--terminal-colors=false` ဒါမှမဟုတ်
  `--terminal-colors=true`
- **အလိုအလျောက်:** အလိုအလျောက် ရှာဖွေရေး terminal support
- **ENV:** `TERMINAL_COLORS`

(သို့) မပြုလုပ်ပါ ANSI- အရောင်ထွက်မှု ရှိ၊ မရှိပါ။

အလိုအလျောက် Iroha terminal က အရောင်ထွက်ကို ထောက်ခံလားဆိုတာ သတ်မှတ်တယ်။
ဒါမှမဟုတ် မဟုတ်ဘူး။

အရောင်တွေကို ရှင်းလင်းစွာ ပိတ်ပစ်ရန်

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **အမျိုးအစား:** ကြိုးများ

Daemon စာတိုများအတွက် အသုံးပြုသော စနစ်ဘာသာစကားကို override လုပ်ပါ။

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **အမျိုးအစား:** အလံ

Sora ကို Activate လုပ်ပါ Nexus လက္ခဏာများအတွက် profile SoraFS, ကော်မတီ SoraNet လက်ဆွဲခြင်း၊
လိုင်းစုံ သဘောတူညီချက် စီးဆင်းမှု။

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **အမျိုးအစား:** `auto`, `cpu`, ဒါမှမဟုတ် `gpu`

Override FASTPQ Prover လုပ်ဆောင်မှု mode ကို။

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **အမျိုးအစား:** `auto`, `cpu`, ဒါမှမဟုတ် `gpu`

Override FASTPQ Poseidon pipeline mode ကို သုံးပါ။

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **အမျိုးအစား:** ကြိုးများ

အပိုဒ်ကို လွှဲပြောင်းပါ FASTPQ တယ်လီမီတာ ကိရိယာတန်းအစား တံဆိပ်။

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **အမျိုးအစား:** ကြိုးများ

အပိုဒ်ကို လွှဲပြောင်းပါ FASTPQ တယ်လီမီထရီ ချစ်ပ်မိသားစု တံဆိပ်။

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **အမျိုးအစား:** ကြိုးများ

အပိုဒ်ကို လွှဲပြောင်းပါ FASTPQ တယ်လီမီတာ GPU- ဒီလို တံဆိပ်မျိုးပေါ့။

```shell
irohad --fastpq-gpu-kind integrated
```
