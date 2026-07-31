---
translation_locale: my
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖွဲ့စည်းခြင်း Iroha {#configuring-iroha}

Local peer configuration ကို set လုပ်ထားသည် TOML ဖိုင်တွေ။ ဒါက အွန်ကွင်းနဲ့ မတူဘူး။
configuration ကို ပြောင်းလဲ [`SetParameter`](/my/blockchain/instructions.md#setparameter)
ညွှန်ကြားချက်များ။ ထုတ်လုပ်မှုအပြုအမူကို configuration ဖိုင်တစ်ခုမှာ ကိုယ်စားပြုရမယ်။
(သို့) ချိတ်ဆက်ထားတဲ့ ပမာဏတစ်ခု။ ပတ်ဝန်းကျင် ကိန်းရှင်တွေဟာ feature gate တွေမဟုတ်ဘူး။

အသုံးပြုခြင်း [`--config`](../irohad-cli#arg-config) CLI configuration file ကိုသွားတဲ့လမ်းကြောင်းကို သတ်မှတ်ဖို့ argument ပါ။

## Template {#template}

ပါရမီတာတိုင်းရဲ့ အသေးစိတ်ဖော်ပြချက်အတွက် အောက်ပါစာမျက်နှာကို ကြည့်ပါ။ [ကန့်သတ်ချက်](./params.md) ရည်ညွှန်းချက်။

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## ဖွဲ့စည်းပုံဖိုင်များ ရေးသားခြင်း {#composing-configuration-files}

TOML configuration files တွေမှာ ထပ်မံ `extends` အခြားနေရာကို ညွှန်ပြနေသော ကွင်း TOML file ((s) ဖြစ်နိုင်ပါတယ်။
လမ်းကြောင်းပေါင်းစုံ:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha ကော်မရှင်မှာ ဖော်ပြထားတဲ့ ဖိုင်အားလုံးကို ထပ်တလဲလဲ ဖတ်မယ်။ `extends` ဒါတွေကို အလွှာလိုက်ပြီး နောက်ပိုင်းမှာ ရေးသားကြတာပါ
အတိုင်းအတာအဆင့်မှာ အရင်က `config.toml`:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

The ရလာမယ့် ဖွဲ့စည်းပုံက `chain` မှ `a.toml`, `max_content_len` မှ `b.toml`, နှင့် `torii.address` မှ
`config.toml` ( overwrites) `b.toml`).

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

ခွင့်ပြုချက် [`--trace-config`](../irohad-cli#arg-trace-config) CLI ဖွဲ့စည်းပုံကို ဖတ်ပြီး စာရင်းထုတ်ပုံကို ခြေရာခံဖို့ အလံပါ။
