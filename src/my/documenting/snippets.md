---
translation_locale: my
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Code Snippets များ {#code-snippets}

Generated snippets တွေဟာ Iroha ပြင်ဆင်မှုကနေ ကုဒ်၊ ဖွဲ့စည်းပုံနဲ့ အစီအစဉ်တွေနဲ့ ဆက်စပ်ထားတဲ့ နမူနာတွေကို သိမ်းထားတယ်။

## Iroha အားကောင်းစရာ လက်ရာများ {#refreshing-iroha-artifacts}

Iroha မှ ရယူသော snippets များကို သာမန် site build များတွင် စစ်ဆေးထားသည်မှာကွန်ရက်ဝင်ရောက်မှု (သို့) ညီမလေး repositories ကိုလိုအပ်ခြင်းမရှိပါ။ သူတို့ကို ရှင်းလင်းစွာ update လုပ်ပါ:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

စစ်ဆေးထားသော `etc/refresh-iroha.ts` အလုပ်ဖြစ်စဉ်သည် clean source checkout ကို `provenance/iroha.json` နှင့် နှိုင်းယှဉ်၍စစ်ဆေးပြီး `/src/snippets` နှင့် Torii OpenAPI point-in-time data view များကို ပြန်လည်ထုတ်လုပ်သည်။ SHA-256 cryptographic hashes ကို update လုပ်ပါ။ အကြောင်းအရာနဲ့ မူလနေရာ ပြောင်းလဲမှုတွေကို အတူတကွလေ့လာပါ။ ပုံမှန်မှီခိုမှု တပ်ဆင်ခြင်းနှင့် VitePress builds သည်ပြောင်းလဲနိုင်သောခွဲကို မယူဘဲ စစ်ဆေးထားသောဖိုင်များကိုစားသုံးသည်။

## Snippets အပါအဝင် {#including-snippets}

[VitePress code-snippet syntax ကို](https://vitepress.dev/guide/markdown#import-code-snippets) ကို အသုံးပြုပြီး generated (သို့) local source ကို ထည့်သွင်းပါ။

```md
<<< @/snippets/client.template.toml
```

အမည်တပ်ထားတဲ့ ကုဒ်ဒေသကို ၎င်းရဲ့ ဒေသအမည်ကို ချိတ်ဆက်ခြင်းဖြင့် ထည့်သွင်းနိုင်ပါတယ်-

```md
<<< @/example_code/lorem.rs#ipsum
```

လက်ဖြင့်ရေးသားထားသော နမူနာများကို သေးငယ်စေရန်။ အများပြည်သူ ကြားခံစနစ်များ၊ ညွှန်ကြားချက်ပုံစံများ၊ ထုတ်လုပ်သည့် အစီအစဉ်များနှင့် အမိန့်ထုတ်လုပ်မှုအတွက် အသစ်ပြန်လည်ပြုစုထားသော အရင်းအမြစ်လက်ရာများကို ကြိုက်ပါ။
