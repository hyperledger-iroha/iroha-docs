---
translation_locale: my
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ကို ဖွဲ့စည်းခြင်း {#configuring-iroha}

Local peer configuration ကို TOML ဖိုင်များတွင်သတ်မှတ်ထားသည်။ ဤသည်မှာ [`SetParameter`](/my/blockchain/instructions.md#setparameter) ညွှန်ကြားချက်များဖြင့်ပြောင်းလဲသော on-chain configuration မှခြားနားသည်။ ထုတ်လုပ်မှုအပြုအမူကို configure file သို့မဟုတ် on-chain parameter တွင်ဖော်ပြရမည်ဖြစ်သည်။ ပတ်ဝန်းကျင်ကိန်းရှင်များသည် feature gates မဟုတ်ပါ။

[`--config`](../irohad-cli#arg-config)CLI ဆွေးနွေးချက်ကို အသုံးပြုပြီး ဖွဲ့စည်းမှုဖိုင်သို့ လမ်းကြောင်းကို သတ်မှတ်ပါ။

## Template ကို {#template}

ပါရီမီတာတိုင်းရဲ့ အသေးစိတ်ဖော်ပြချက်အတွက် [Parameters](./params.md) ကိုကြည့်ပါ။

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## ဖွဲ့စည်းပုံဖိုင်များကို ရေးသားခြင်း {#composing-configuration-files}

TOML ဖိုင်များတွင် `extends` ကွင်းတစ်ခုရှိပြီး အခြား TOML ဖိုင်များကို ညွှန်ပြသည်) တစ်ခုတည်းသောလမ်းကြောင်း သို့မဟုတ် လမ်းကြောင်းများစွာဖြစ်နိုင်တယ်။

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha သည် `extends` တွင် သတ်မှတ်ထားသော ဖိုင်အားလုံးကို ပြန်လည်ဖတ်ရှုပြီး အလွှာများအဖြစ်ဖွဲ့စည်းလိမ့်မည်။ နောက်ပိုင်းက ပမာဏအဆင့်တွင် ယခင်ဖိုင်များကို ထပ်မံရေးသားပါလိမ့်မည်။ ဥပမာ၊ `config.toml` ကိုဖတ်လျှင်:

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

ရလာတဲ့ ဖွဲ့စည်းပုံက `chain` မှ `a.toml`, `max_content_len` မှ `b.toml`, နှင့် `torii.address` မှ `config.toml` ( overwrites) `b.toml`).

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

[`--trace-config`](../irohad-cli#arg-trace-config)CLI အလံကို ဖြတ်ပြီး ဖွဲ့စည်းပုံဖတ်ခြင်းနှင့် စာရင်းစစ်ခြင်းနည်းလမ်း၏ ခြေရာကို မြင်နိုင်ရန်။
