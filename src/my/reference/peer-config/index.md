---
translation_locale: my
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ကို ဖွဲ့စည်းခြင်း {#configuring-iroha}

စက်တွင်း peer ပြင်ဆင်သတ်မှတ်မှုကို TOML ဖိုင်များတွင် သတ်မှတ်သည်။ ၎င်းသည် [`SetParameter`](/my/blockchain/instructions.md#setparameter) ညွှန်ကြားချက်များဖြင့် ပြောင်းလဲသော ဘလော့ခ်ချိန်းပေါ်ရှိ ပြင်ဆင်သတ်မှတ်မှုနှင့် ကွာခြားသည်။ တကယ့်လုပ်ငန်းသုံးအပြုအမူကို ပြင်ဆင်သတ်မှတ်မှုဖိုင် သို့မဟုတ် ဘလော့ခ်ချိန်းပေါ်ပါရာမီတာတွင် ဖော်ပြရမည်။ ပတ်ဝန်းကျင်တန်ဖိုးများကို အင်္ဂါရပ်ဖွင့်ပိတ်ကိရိယာအဖြစ် မသုံးရပါ။

အသုံးပြုခြင်း [`--config`](../iroha3d-cli#arg-config) CLI ဖွဲ့စည်းမှုဖိုင်သို့ လမ်းကြောင်းကို သတ်မှတ်ရန် argument ကို။

## Template ကို {#template}

ပါရမီတာတိုင်းရဲ့ အသေးစိတ်ဖော်ပြချက်အတွက် [ပမာဏများ](./params.md) ကို ကြည့်ပါ။

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

ခွင့်ပြုချက် [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI ဖွဲ့စည်းပုံကို ဖတ်ပြီး စာရင်းခွဲစိတ်ပုံကို ခြေရာခံဖို့ အလံပါ။
