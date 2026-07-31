---
translation_locale: my
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Code Snippets များ {#code-snippets}

Generated snippets တွေဟာ code, configuration နဲ့ schemes တွေနဲ့ ဆက်စပ်ထားတဲ့ နမူနာတွေကို ထိန်းထားတယ်။
ကော်မတီ Iroha ဒါတွေကို ထုတ်လုပ်ခဲ့တဲ့ အပြောင်းအလဲပါ။

## အားဖြည့်ပေးခြင်း Iroha လက်ရာများ {#refreshing-iroha-artifacts}

Iroha- derived snippets တွေကို စစ်ဆေးထားတယ် ဒီတော့ သာမန် site builds တွေက မလိုတော့ဘူး
ကွန်ရက်ဝင်ရောက်မှု (သို့) ညီမစာရင်းကို ရှင်းလင်းစွာ ပြင်ဆင်ပါ။

```bash
pnpm refresh:iroha --source /path/to/iroha
```

မှတ်ပုံတင်ခံရသူ
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
workflow က clean source checkout ကို စစ်ဆေးတယ် `provenance/iroha.json`,
ပြန်လည်ပြုပြင်ခြင်း `/src/snippets` နောက်ပြီး Torii OpenAPI snapshot နဲ့ update တွေ SHA-256
hashes များ။ အကြောင်းအရာနှင့် မူရင်း ပြောင်းလဲမှုကို အတူတကွ ကြည့်ပါ။ ပုံမှန်မှီခိုမှု
တပ်ဆင်ခြင်းနှင့် VitePress builds တွေက checked-in file တွေကို
ပြောင်းလွယ်ပြောင်းလွယ်တဲ့ ကဏ္ဍကို ယူလာတာပါ။

## Snippets ကိုပါ ၀ င်သည်။ {#including-snippets}

သုံးပါ
[VitePress code-snippet syntax ကို](https://vitepress.dev/guide/markdown#import-code-snippets)
ထုတ်ကုန်ထုတ်လုပ်သူ (သို့) ဒေသတွင်းအရင်းအမြစ်ကို ထည့်သွင်းရန်:

```md
<<< @/snippets/client.template.toml
```

အမည်တပ်ထားတဲ့ ကုဒ်ဒေသကို ၎င်းရဲ့ ဒေသအမည်ကို ထည့်သွင်းခြင်းဖြင့် ထည့်သွင်းနိုင်ပါတယ်-

```md
<<< @/example_code/lorem.rs#ipsum
```

လက်နဲ့ရေးထားတဲ့ နမူနာတွေကို သေးငယ်အောင် ထိန်းထားပါ။ အများပြည်သူအတွက် ပြန်လည်ဆန်းသစ်တဲ့ အရင်းအမြစ်ပစ္စည်းတွေကို ပိုနှစ်သက်တယ်။
Interface များ၊ configuration templates များ၊ generated schemes များနှင့် command output များ။
