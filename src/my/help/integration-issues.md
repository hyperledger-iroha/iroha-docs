---
translation_locale: my
translation_source: /help/integration-issues.md
translation_source_hash: 2146a236adb3a3b3b896a1992daeecf6713988183ca53e4412f9b616ed2e9085
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ပေါင်းစပ်မှု ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-integration-issues}

ဤအခန်းတွင် Iroha 3 ပေါင်းစပ်မှုအတွက် ပြဿနာဖြေရှင်းရေး အကြံပေးချက်များကို ဖော်ပြထားပါသည်။ သင်တွေ့နေသည့်ပြဿနာကို ဒီမှာဖော်ပြခြင်းမရှိပါက [အွန်လိုင်း](https://t.me/hyperledgeriroha) မှတစ်ဆင့် ဆက်သွယ်ပါ။

## ဖောက်သည်က ဆက်သွယ်လို့မရ {#client-cannot-connect}

client ပြင်ဆင်သတ်မှတ်မှုသည် peer ၏ Torii လိပ်စာသို့ ညွှန်နေကြောင်း စစ်ဆေးပါ။

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI စစ်ဆေးမှုအတွက် ထပ်တူသော ဖိုင်ကို ရှင်းလင်းစွာ ပေးပို့ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

အဆင့်တူနိုဒ်သည် Docker သို့မဟုတ် Kubernetes တွင် လည်ပတ်နေပါက ကလိုင်းယင့်ပရိုဆက်စ်မှ ရောက်ရှိနိုင်သော လက်ခံကွန်ပျူတာ သို့မဟုတ် ဝန်ဆောင်မှုလိပ်စာကို အသုံးပြုပါ။ ကွန်တိန်နာအတွင်းရှိ `127.0.0.1` သည် လက်ခံကွန်ပျူတာ မဟုတ်ပါ။

အများပြည်သူ Taira စမ်းသပ်မှုအတွက် လက်မှတ်မထိုးသေးတဲ့ API အဆုံးအဖြတ်စက်နဲ့ စတင်ပါ။

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

`502`, TLS, DNS သို့မဟုတ် အချိန်ကုန်ဆုံးမှုအမှားများနှင့် ပတ်သက်၍ ဤပညတ်ချက်များသည် ပျက်ကွက်ပါက ကွန်ရက်ရရှိနိုင်မှုကို ပြင်ဆင်ရန် (သို့) အကောင့်ခလုတ်များ (သို့မဟုတ်) ငွေပေးချေမှု အသုံးဝင်မှုများကို ချို့ယွင်းမထားမီ အများပြည်သူ testnet API အဆုံးမှတ်ကို စောင့်ဆိုင်းပါ။

## ငွေပေးချေမှုများကို ပယ်ချခြင်း {#transactions-are-rejected}

transaction ချို့ယွင်းမှုအများစုသည် အထောက်အထား သို့မဟုတ် ခွင့်ပြုချက် မကိုက်ညီခြင်းကြောင့် ဖြစ်သည်။

- client ပြင်ဆင်သတ်မှတ်မှုရှိ အကောင့်အများသုံးကီးသည် လက်မှတ်ထိုးရာတွင် အသုံးပြုသော ကိုယ်ပိုင်ကီးနှင့် မကိုက်ညီခြင်း
- အကောင့်ကို blockchain genesis မှာ မှတ်ပုံတင်ထားတာမဟုတ်ဘူး၊ အရင်က ငွေပေးချေမှုတစ်ခုမှာလည်း မှတ်ပုံတင်ထားတာမဟုတ်ဘူး။
- အကောင့်တွင် လည်ပတ်မှုပတ်ဝန်းကျင်၏ စစ်ဆေးအတည်ပြုသူက လိုအပ်သော ခွင့်ပြုချက်တိုကင် သို့မဟုတ် အခန်းကဏ္ဍ မရှိခြင်း
- domain ID တွင် `domain.dataspace` ကဲ့သို့ data space ဖြင့် အမည်အပြည့်အစုံ သတ်မှတ်မှု မပါဝင်ခြင်း

`--output-format text` ကို အသုံးပြုပြီး CLI command များကို Debug လုပ်နေစဉ် အမှားများကို ဖတ်ရန် ပိုလွယ်ကူစေရန်:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority --output-format text tx ping --msg "hello"
```

## မေးမြန်းချက်များတွင် ပလပ်သော ရလဒ်များ ပြန်လာသည် {#queries-return-empty-results}

အခမဲ့ မေးမြန်းချက် ရလဒ်တွေက အမြဲတမ်းမေးမြန်းမှု ကျရှုံးတာ မဆိုလိုပါဘူး။ စစ်ဆေးပါ:

- အရာဝတ္ထုကို ဖန်တီးသင့်တဲ့ ငွေပေးချေမှု ပြီးဆုံးသွားပြီ
- မေးမြန်းထားသော domain၊ asset definition သို့မဟုတ် account ID သည် single protocol-standard ဖြစ်ပါသည်။
- စာမျက်နှာပြုပြင်ခြင်း (သို့) စစ်ဆေးမှုများသည် မျှော်မှန်းထားသော အတန်းကို ပယ်ချမထားပါ။
- ဖောက်သည်က အခြား localnet မဟုတ်ဘဲ ရည်ရွယ်ထားတဲ့ ကွန်ရက်နဲ့ ချိတ်ဆက်ထားတာပါ။

ဒိုမင် စစ်ဆေးမှုအတွက် အကြီးမားဆုံး မေးမြန်းချက်နဲ့စပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

## Event (သို့) Block stream တွေကို အစောပိုင်းမှာ ရပ်တန့်ပေးတယ်။ {#event-or-block-streams-stop-early}

ဘလောက်နှင့် ဖြစ်ရပ်စီးကြောင်း နမူနာများသည် Torii စီးကြောင်းဝင်ပေါက်များကို အသုံးပြုသည်။ အဆင့်တူနိုဒ် လည်ပတ်နေဆဲဖြစ်ကြောင်း စစ်ဆေးပြီးနောက် အချိန်ကန့်သတ်ချက်ဖြင့် စမ်းသပ်ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP ပေါင်းစပ်မှုအတွက် သင့်ရဲ့ API အဆုံးသတ်မှတ်တိုင်လမ်းကြောင်းတွေကို current [Torii API အဆုံးသတ်မှတ်ချက် မှတ်တမ်း](/my/reference/torii-endpoints.md) နဲ့ နှိုင်းယှဉ်ပါ။
