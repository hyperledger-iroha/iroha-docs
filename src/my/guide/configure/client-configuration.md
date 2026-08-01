---
translation_locale: my
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Client Configuration ကို အသုံးပြုရန် {#client-configuration}

Iroha CLI နှင့် SDK ဖောက်သည်များ အသုံးပြု TOML Configuration: repository က လက်ရှိ default ကို `defaults/client.toml`; ဒေသတွင်းကွန်ရက်များလည်းထုတ်လုပ်ထားသည် ကိုက်ညီသောရေးသား `client.toml` ၎င်းတို့ရဲ့ output directory ထဲကို ထည့်ပေးပါ။

::: details Client Configuration Template ကို

<<< @/snippets/client.template.toml

:::

## Core Fields များ {#core-fields}

အနည်းဆုံး Client Configuration မှာ Chain, Torii Endpoint နဲ့ Signing Account တွေကို သတ်မှတ်ထားပါတယ်

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` သည် တင်ပြထားသော ငွေကြေးပူးပေါင်းဆောင်ရွက်မှုများ ပါဝင်သည့် ချုပ်ဆက်ကို ရွေးချယ်သည်။
- `torii_url` တူညီတဲ့ အမှတ်တွေ Torii HTTP API.
- `[account].domain` ကို CLI shortcuts နဲ့ address-selector encoding တွေက သုံးပါတယ်။ Canonical `AccountId` itself က domainless ပါ။
- `[account].public_key` နှင့် `[account].private_key` တို့သည် လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုများဖြစ်သည်။

အဲဒီအကောင့်ဟာ ချိတ်ဆက်ထားပြီးသား ဖြစ်ရပါမယ်။ ဒေသခံကွန်ရက်အတွက်တော့ ဒါက ဘူးတွဲထားတဲ့ Genesis Manifesto ကနေ စီမံပေးပါတယ်။

::: info ကိစ္စအသိစိတ်

Iroha နာမည်များသည် Canonical Parsing အပြီးတွင် Case-sensitive ဖြစ်ပါသည်။ ဥပမာ, `wonderland.universal`, `Wonderland.universal` နှင့် `looking_glass.universal` တို့သည်ကွဲပြားခြားနားသော domain literal များဖြစ်သည်။

:::

## အခြေခံ အထောက်အထား {#basic-authentication}

ရွေးချယ်စရာ `[basic_auth]` အပိုဒ်မှာ HTTP `Authorization` ဖောက်သည်တောင်းဆိုချက်များအတွက် ခေါင်းစဉ်။ Iroha တူညီသူတွေဟာ ဒီလက်မှတ်တွေကို တိုက်ရိုက် အဓိပ္ပါယ်ကောက်မပေးကြဘူး။ Torii Nginx လို reverse proxy တစ်ခုရဲ့ နောက်မှာ ရှိနေပါတယ်။

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## ငွေပေးချေမှု Settings {#transaction-settings}

Transaction behavior ကို `[transaction]` အပိုင်းနဲ့ သတ်မှတ်ထားတယ်။

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` သည် ငွေပေးချေမှုသက်တမ်းကို မီလီစက္ကန့်များတွင် သတ်မှတ်သည်။
- `status_timeout_ms` ကောက်သည်က ငွေပေးချေမှုအခြေအနေကို ဘယ်လောက်ကြာ စောင့်နေတယ်ဆိုတာကို ထိန်းချုပ်တယ်။
- `nonce = true` က client ကို nonce တစ်ခု ထည့်သွင်းဖို့ တောင်းဆိုတယ် ဒီတော့ အကြိမ်ကြိမ်လုပ်တဲ့ transactions တွေဟာ hash အမျိုးမျိုး ဖြစ်ပေါ်စေတယ်။

## Queue Settings ကို ချိတ်ဆက်ပါ {#connect-queue-settings}

လက်ရှိ Iroha ဖောက်သည်များသည် ဒေသတွင်းတန်းအခြေအနေအတွက် ရွေးချယ်စရာ `[connect]` အပိုင်းကိုလည်း အသုံးပြုနိုင်သည်။

```toml
[connect]
queue_root = "./queue"
```

Workflow တစ်ခုအတွက် ရေရှည်တည်တံ့တဲ့ Client-side queue storage လိုတဲ့အခါ ဒါကို သုံးပါ။

## Configurations များကို ဖန်တီးခြင်း {#generating-configurations}

တစ်ခါသုံး ဒေသတွင်းကွန်ရက်များအတွက် Kagami ကို ကြိုက်သည်မှာ Iroha 3 ကောင်ဖိုင်များ၊ ဇာစ်မြစ်များ၊ စာသားများနှင့် တူညီသော README ကို ရေးထားသည့်ကြောင့်ဖြစ်သည်။

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ထုတ်လုပ်ထားသော `./localnet/client.toml` ကို CLI နှင့်အတူ အသုံးပြုပါ-

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
