---
translation_locale: my
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Client Configuration ကို အသုံးပြုရန် {#client-configuration}

Iroha CLI နှင့် SDK ဖောက်သည်များ အသုံးပြု TOML Configuration: repository က လက်ရှိ default ကို `defaults/client.toml`; ဒေသတွင်းကွန်ရက်များလည်းထုတ်လုပ်ထားသည် ကိုက်ညီသောရေးသား `client.toml` ၎င်းတို့ရဲ့ output directory ထဲကို ထည့်ပေးပါ။

::: details Client Configuration Template ကို

<<< @/snippets/client.template.toml

:::

## Core Fields များ {#core-fields}

အနည်းဆုံး Client Configuration တစ်ခုမှာ Chain, Torii API Endpoint နဲ့ Signing Account တွေကို သတ်မှတ်ထားတယ်။

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` သည် တင်ပြထားသော ငွေကြေးပူးပေါင်းဆောင်ရွက်မှုများ ပါဝင်သည့် ချုပ်ဆက်ကို ရွေးချယ်သည်။
- `torii_url` ကွန်ရက် peer မှာ အချက်တွေ Torii HTTP API.
- `[account].domain` ကို CLI shortcuts နဲ့ address-selector encoding တွေက သုံးပါတယ်။ Single protocol standard `AccountId` က domainless ပါ။
- `[account].public_key` နှင့် `[account].private_key` တို့သည် လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုများဖြစ်သည်။

အွန်လိုင်းမှာ ရှိပြီးသား ဖြစ်ရပါမယ်။ ပုံမှန် ဒေသတွင်းကွန်ရက်အတွက်တော့ ဒါက ဘူးတွဲထားတဲ့ blockchain genesis technical manifest ကနေ ကိုင်တွယ်ပါတယ်။

::: info ကိစ္စအသိစိတ်

Iroha နာမည်များသည် single protocol-standard parsing နောက်ပိုင်းတွင် case sensitive ဖြစ်ကြသည်။ ဥပမာ, `wonderland.universal`, `Wonderland.universal` နှင့် `looking_glass.universal` သည်ခြားနားသော domain literal များဖြစ်သည်။

:::

## အခြေခံ အတည်ပြုမှု {#basic-authentication}

ရွေးချယ်စရာ `[basic_auth]` အပိုဒ်မှာ HTTP `Authorization` ဖောက်သည်တောင်းဆိုချက်များအတွက် ခေါင်းစဉ်။ Iroha Network peers တွေက ဒီလက်မှတ်တွေကို တိုက်ရိုက် အဓိပ္ပါယ်ကောက်မပေးကြဘူး။ Torii Nginx လို reverse proxy တစ်ခုရဲ့ နောက်မှာ ရှိနေပါတယ်။

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
- `nonce = true` က client ကို cryptographic nonce value ထည့်သွင်းဖို့တောင်းဆိုသည်မှာ အကြိမ်ကြိမ်ပြုလုပ်တဲ့ ငွေချေးမှုတွေက မတူညီတဲ့ cryptographic hash တွေကို ဖြစ်ပေါ်စေဖို့ပါ။

## Queue Settings ကို ချိတ်ဆက်ပါ {#connect-queue-settings}

လက်ရှိ Iroha ဖောက်သည်များသည် ဒေသတွင်းတန်းအခြေအနေအတွက် ရွေးချယ်စရာ `[connect]` အပိုင်းကိုလည်း အသုံးပြုနိုင်သည်။

```toml
[connect]
queue_root = "./queue"
```

Workflow တစ်ခုအတွက် ရေရှည်တည်တံ့တဲ့ Client-side queue storage လိုတဲ့အခါ ဒါကို သုံးပါ။

## Configurations များကို ဖန်တီးခြင်း {#generating-configurations}

တစ်ခါသုံး ဒေသတွင်းကွန်ရက်များအတွက် Kagami ကိုရွေးချယ်ပါ၊ အကြောင်းက Iroha 3 ဖွဲ့စည်းပုံ၊ blockchain မျိုးဆက်၊ စာသားများနှင့် README ကို လိုက်ဖက်စွာရေးသားလို့ပါ။

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

ထုတ်လုပ်ထားသော `./localnet/client.toml` ကို CLI နှင့်အတူ အသုံးပြုပါ-

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
