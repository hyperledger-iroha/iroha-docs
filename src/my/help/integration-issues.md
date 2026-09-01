---
translation_locale: my
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပေါင်းစပ်မှု ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-integration-issues}

ဤအခန်းတွင် Iroha 3 ပေါင်းစပ်မှုအတွက် ပြဿနာဖြေရှင်းရေး အကြံပေးချက်များကို ဖော်ပြထားပါသည်။ သင်တွေ့နေသည့်ပြဿနာကို ဒီမှာဖော်ပြခြင်းမရှိပါက [အွန်လိုင်း](https://t.me/hyperledgeriroha) မှတစ်ဆင့် ဆက်သွယ်ပါ။

## ဖောက်သည်က ဆက်သွယ်လို့မရ {#client-cannot-connect}

Client Config ကို Network Peer ရဲ့ Torii Address ကို ညွှန်ပြနေတာကို စစ်ဆေးပါ။

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI စစ်ဆေးမှုအတွက် ထပ်တူသော ဖိုင်ကို ရှင်းလင်းစွာ ပေးပို့ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

ကွန်ရက် peer ကို Docker သို့မဟုတ် Kubernetes တွင် run လုပ်ပါက client process မှရောက်ရှိနိုင်သော host (သို့) service address ကိုအသုံးပြုပါ။ container တစ်ခုအတွင်းတွင် `127.0.0.1` သည် host machine မဟုတ်ပါ။

အများပြည်သူ Taira စမ်းသပ်မှုအတွက် လက်မှတ်မထိုးသေးတဲ့ API အဆုံးအဖြတ်စက်နဲ့ စတင်ပါ။

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

`502`, TLS, DNS သို့မဟုတ် အချိန်ကုန်ဆုံးမှုအမှားများနှင့် ပတ်သက်၍ ဤပညတ်ချက်များသည် ပျက်ကွက်ပါက ကွန်ရက်ရရှိနိုင်မှုကို ပြင်ဆင်ရန် (သို့) အကောင့်ခလုတ်များ (သို့မဟုတ်) ငွေပေးချေမှု အသုံးဝင်မှုများကို ချို့ယွင်းမထားမီ အများပြည်သူ testnet API အဆုံးမှတ်ကို စောင့်ဆိုင်းပါ။

## ငွေပေးချေမှုများကို ပယ်ချခြင်း {#transactions-are-rejected}

ငွေချေးမှု ကျရှုံးမှု အများစုဟာ ကိုယ်ပိုင်လက္ခဏာ (သို့) ခွင့်ပြုချက် မညီမျှခြင်းကြောင့် ဖြစ်ပေါ်တာပါ။

- Client Configuration ထဲက Account Public Key က Signage အတွက် အသုံးပြုတဲ့ Private Key နဲ့ မညီပါဘူး။
- အကောင့်ကို blockchain genesis မှာ မှတ်ပုံတင်ထားတာမဟုတ်ဘူး၊ အရင်က ငွေပေးချေမှုတစ်ခုမှာလည်း မှတ်ပုံတင်ထားတာမဟုတ်ဘူး။
- account မှာ software execution environment validator က တောင်းဆိုတဲ့ permission token (သို့) role မရှိပါဘူး။
- Domain ID တစ်ခုမှာ `domain.dataspace` လို ဒေတာနေရာ အရည်အသွေးမရှိပါ။

`--output-format text` ကို အသုံးပြုပြီး CLI command များကို Debug လုပ်နေစဉ် အမှားများကို ဖတ်ရန် ပိုလွယ်ကူစေရန်:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## မေးမြန်းချက်များတွင် ပလပ်သော ရလဒ်များ ပြန်လာသည် {#queries-return-empty-results}

အခမဲ့ မေးမြန်းချက် ရလဒ်တွေက အမြဲတမ်းမေးမြန်းမှု ကျရှုံးတာ မဆိုလိုပါဘူး။ စစ်ဆေးပါ:

- အရာဝတ္ထုကို ဖန်တီးသင့်တဲ့ ငွေပေးချေမှု ပြီးဆုံးသွားပြီ
- မေးမြန်းထားသော domain၊ asset definition သို့မဟုတ် account ID သည် single protocol-standard ဖြစ်ပါသည်။
- စာမျက်နှာပြုပြင်ခြင်း (သို့) စစ်ဆေးမှုများသည် မျှော်မှန်းထားသော အတန်းကို ပယ်ချမထားပါ။
- ဖောက်သည်က အခြား localnet မဟုတ်ဘဲ ရည်ရွယ်ထားတဲ့ ကွန်ရက်နဲ့ ချိတ်ဆက်ထားတာပါ။

ဒိုမင် စစ်ဆေးမှုအတွက် အကြီးမားဆုံး မေးမြန်းချက်နဲ့စပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Event (သို့) Block stream တွေကို အစောပိုင်းမှာ ရပ်တန့်ပေးတယ်။ {#event-or-block-streams-stop-early}

Block နှင့် Event Stream နမူနာများမှာ Torii streaming API အဆုံးသတ်မှတ်ချက်များကို အားကိုးသည်။ ကွန်ရက် peer ကိုအလုပ်လုပ်နေဆဲကိုစစ်ဆေးပြီးနောက် timeout ဖြင့်စမ်းသပ်ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP ပေါင်းစပ်မှုအတွက် သင့်ရဲ့ API အဆုံးသတ်မှတ်တိုင်လမ်းကြောင်းတွေကို current [Torii API အဆုံးသတ်မှတ်ချက် မှတ်တမ်း](/my/reference/torii-endpoints.md) နဲ့ နှိုင်းယှဉ်ပါ။
