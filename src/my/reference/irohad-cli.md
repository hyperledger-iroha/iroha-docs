---
translation_locale: my
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` ကတော့ Iroha 3 peer daemon ကို စပါတယ်။

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- အမျိုးအစား: ဖိုင်လမ်းကြောင်း
- အမည်အမည်: `-c`

[configuration ](/my/reference/peer-config/index.md) file ကိုသွားတဲ့လမ်းကြောင်း။

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- အမျိုးအစား: ဖိုင်လမ်းကြောင်း

Genesis manifest JSON ဖိုင်သို့ ရွေးချယ်စရာလမ်းကြောင်း။ deployment သည် Kagami မှထုတ်လုပ်သော manifest နှင့် startup ကိုအတည်ပြုသည့်အခါဤကိုအသုံးပြုပါ။

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

ဖွဲ့စည်းမှု စာဖတ်ခြင်းနှင့် ဆန်းစစ်ခြင်း၏ ခြေရာခံမှတ်တမ်းများကို ဖွင့်ပေးသည်။ ဖွဲ့စည်းချက် ပြဿနာဖြေရှင်းရေးအတွက် အသုံးဝင်နိုင်ပါသည်။

- အမျိုးအစား: အလံ
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- အမျိုးအစား: `--terminal-colors=false` သို့မဟုတ် `--terminal-colors=true` ဘူးလိန်း
- Default: အလိုအလျောက်ရှာဖွေရေး terminal support
- ENV: `TERMINAL_COLORS`

ANSI အရောင်ထုတ်လုပ်မှုကို လုပ်နိုင်မလား၊ မလုပ်နိုင်ဘူးလား။

default အနေနဲ့ Iroha ဟာ terminal က အရောင်ထွက်ကို ထောက်ပံ့ပေးတာလား၊ မထောက်ပံ့ဘူးလားဆိုတာ သတ်မှတ်ပါတယ်။

အရောင်တွေကို တိတိကျကျ ပိတ်ပစ်ရန်

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- အမျိုးအစား: ကြိုး

Daemon စာတိုများအတွက် အသုံးပြုသော စနစ် ဘာသာစကားကို override လုပ်ပါ။

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- အမျိုးအစား: အလံ

SoraFS အတွက် Sora Nexus feature profile၊ SoraNet handshake နဲ့ multi-lane consensus flows တွေကို enable လုပ်ပါ။

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- အမျိုးအစား: `auto`, `cpu`, (သို့) `gpu`

FASTPQ prover execution mode ကို override လုပ်ပါ။

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- အမျိုးအစား: `auto`, `cpu`, (သို့) `gpu`

FASTPQ Poseidon pipeline mode ကို override လုပ်ပါ။

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- အမျိုးအစား: ကြိုး

FASTPQ telemetry device class label ကို override လုပ်ပါ။

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- အမျိုးအစား: ကြိုး

FASTPQ telemetry chip-family label ကို override လုပ်ပါ။

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- အမျိုးအစား: ကြိုး

FASTPQ telemetry GPU အမျိုးအစား တံဆိပ်ကို override လုပ်ပါ။

```shell
irohad --fastpq-gpu-kind integrated
```
