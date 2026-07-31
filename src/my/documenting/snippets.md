---
translation_locale: my
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
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

မှတ်ပုံတင်ခံရသူ [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) workflow က clean source checkout ကို verifies လုပ်တယ် `provenance/iroha.json`, ပြန်လည်ပြုပြင်ခြင်း `/src/snippets` နောက်ပြီး Torii OpenAPI snapshot နဲ့ update တွေ SHA-256 hashes များ။ အကြောင်းအရာများနှင့် မူရင်းအပြောင်းအလဲများကို အတူတကွစစ်ဆေးပါ။ ပုံမှန်မှီခိုမှုတပ်ဆင်ခြင်းနှင့် VitePress Builds တွေက check-in file တွေကို mutable branch ကို မယူပဲ စားသုံးကြတာပါ။

## Snippets အပါအဝင် {#including-snippets}

[VitePress code-snippet syntax ](https://vitepress.dev/guide/markdown#import-code-snippets) ကို အသုံးပြုပြီး generated သို့မဟုတ် local source ကို ထည့်သွင်းပါ။

```md
<<< @/snippets/client.template.toml
```

အမည်တပ်ထားတဲ့ ကုဒ်ဒေသကို ၎င်းရဲ့ ဒေသအမည်ကို ချိတ်ဆက်ခြင်းဖြင့် ထည့်သွင်းနိုင်ပါတယ်-

```md
<<< @/example_code/lorem.rs#ipsum
```

လက်ဖြင့်ရေးသားထားသော နမူနာများကို သေးငယ်စေရန်။ အများပြည်သူ ကြားခံစနစ်များ၊ ညွှန်ကြားချက်ပုံစံများ၊ ထုတ်လုပ်သည့် အစီအစဉ်များနှင့် အမိန့်ထုတ်လုပ်မှုအတွက် အသစ်ပြန်လည်ပြုစုထားသော အရင်းအမြစ်လက်ရာများကို ကြိုက်ပါ။
