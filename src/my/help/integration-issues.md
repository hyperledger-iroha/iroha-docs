---
translation_locale: my
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Integration ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-integration-issues}

ဤအပိုဒ်သည် ပြဿနာဖြေရှင်းနည်းများအတွက် အကြံပြုချက်များကိုပေးသည်။ Iroha 3 ပေါင်းစည်းခြင်း။
သင်ခံစားနေရတာက ဒီမှာ ဖော်ပြထားတာမဟုတ်ဘူး။
ကျွန်ုပ်တို့အား ဆက်သွယ်ရန် [Telegram ကို](https://t.me/hyperledgeriroha).

## ဖောက်သည်က ဆက်သွယ်လို့မရ {#client-cannot-connect}

Client Config က peer ကို ညွှန်ပြနေတာကို စစ်ဆေးပါ။ Torii လိပ်စာ:

```toml
torii_url = "http://127.0.0.1:8080/"
```

အတွက် CLI စစ်ဆေးချက်တွေကို ထပ်ပြီး ပြသပေးပါ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

တူညီသူက ဝင်လာရင် Docker (သို့) Kubernetes ကို host သို့မဟုတ် service address ကိုသုံးပြီး
Client Process ကနေ ရယူနိုင်တယ် `127.0.0.1` container အတွင်းမှာ မရှိပါ။
အိမ်ရှင်စက်ပါ။

အများပြည်သူအတွက် Taira စမ်းသပ်မှုတွေမှာ လက်မှတ်မထိုးတဲ့ အဆုံးသတ်စက်နဲ့ စပါ။

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

ဒီအမိန့်တွေ ကျရှုံးရင် `502`, TLS, DNS, အချိန်ကုန်ဆုံးမှုအမှားများ၊ ကွန်ရက်ကို ပြင်ဆင်ခြင်း
ရယူနိုင်မှု (သို့) အကောင့်ကို Debug မလုပ်ခင် အများသုံး testnet အဆုံးမှတ်ကို စောင့်ပါ။
သော့များ (သို့) ငွေပေးချေမှု အသုံးဝင်ပစ္စည်းများ။

## ငွေပေးချေမှုများကို ပယ်ချခြင်း {#transactions-are-rejected}

ငွေချေးမှု ကျရှုံးမှု အများစုဟာ ကိုယ်ပိုင်လက္ခဏာ (သို့) ခွင့်ပြုချက် မညီမျှခြင်းကြောင့် ဖြစ်ပေါ်ပါတယ်။

- Client configuration ထဲက public key က private key နဲ့ မညီဘူး
  လက်မှတ်ရေးထိုးရန် အသုံးပြုသည်
- စာရင်းကို ဘီဘီစီမှာ မှတ်ပုံတင်ထားခြင်းမဟုတ်၊ အရင်က ငွေပေးချေမှုမှ မဟုတ်ပါ။
- အကောင့်မှာ Runtime အတွက် လိုအပ်တဲ့ ခွင့်ပြုချက် လက်မှတ် (သို့) အခန်းကဏ္ဍ မရှိပါ။
  validator
- ဒိုမင်တစ်ခု ID ဒေတာနေရာ အရည်အသွေးကို မပြည့်မီသေးဘူး
  `domain.dataspace`

အသုံးပြုခြင်း `--output-format text` Debug လုပ်နေစဉ် CLI အမှားတွေ ပိုလွယ်အောင် commands တွေ
ဖတ်ဖို့:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## မေးမြန်းချက်များတွင် အလွတ်ရလဒ်များ ပြန်လာသည် {#queries-return-empty-results}

ပလပ်သော မေးမြန်းချက် ရလဒ်များက အမြဲတမ်းမေးမြန်းမှု ကျရှုံးခဲ့သည်မဟုတ်ပါ။ စစ်ဆေးပါ:

- အရာဝတ္ထုကို ဖန်တီးသင့်တဲ့ ငွေပေးချေမှု ကျူးလွန်ခဲ့တယ်။
- မေးမြန်းထားသော ဒိုမင်၊ အရင်းအမြစ် သတ်မှတ်ချက် (သို့) အကောင့် ID ကန်နီကလစ်
- Pageage သို့မဟုတ် filter တွေက မျှော်လင့်ထားတဲ့ row ကို မပယ်ပါဘူး။
- ဖောက်သည်က အခြား localnet မဟုတ်ဘဲ ရည်ရွယ်ထားတဲ့ ကွန်ရက်နဲ့ ချိတ်ဆက်ထားတာပါ။

ဒိုမင်စစ်ဆေးမှုအတွက် အကြီးမားဆုံး မေးမြန်းချက်နဲ့စပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## ဖြစ်ရပ် (သို့) ပိတ်ဆက်မှု စီးကြောင်းများ အစောကြီး ရပ်နား {#event-or-block-streams-stop-early}

Block နဲ့ Event Stream နမူနာတွေက Torii ရောင်းချမှု အဆုံးအသတ်တွေကို စစ်ဆေးပါ။
peer က ဆက်ပြီး Run နေတုန်းပါ၊ နောက်တော့ Timeout နဲ့ စမ်းသပ်ပါ။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

အတွက် HTTP Integrations တွေကို သုံးပြီး သင့်ရဲ့ Endpoint Paths ကို current နဲ့ နှိုင်းယှဉ်ကြည့်ပါ။
[Torii နောက်ဆုံးမှတ်ကို ရည်ညွှန်းချက်](/my/reference/torii-endpoints.md).
