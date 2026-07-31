---
translation_locale: my
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Client Configuration ကို {#client-configuration}

Iroha CLI နှင့် SDK ဖောက်သည်များ အသုံးပြု TOML configuration ကို။ သိုလှောင်ရုံက
current default ကို `defaults/client.toml`; local network တွေကိုလည်း ရေးပေးတယ်
ကိုက်ညီမှု `client.toml` ထုတ်ကုန်စာရင်းထဲ ထည့်ပါ။

::: details Client Configuration Template ကို

<<< @/snippets/client.template.toml

:::

## Core Fields များ {#core-fields}

အနည်းဆုံးတော့ client ဖွဲ့စည်းမှုတစ်ခုက ကွင်းဆက်ကို ဖော်ထုတ်တယ်။ Torii အဆုံးအသတ်မှတ်ချက်နဲ့
လက်မှတ်ထိုးစာရင်း:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` တင်ပြထားသော ငွေကြေးလုပ်ငန်းများ ပါဝင်သည့် ချုပ်ဆက်ကို ရွေးချယ်သည်။
- `torii_url` တူညီတဲ့ အမှတ်တွေ Torii HTTP API.
- `[account].domain` အသုံးပြုသူ CLI shortcuts နဲ့ address-selector ကို encoding လုပ်ပေးခြင်း။
  တရားဝင် `AccountId` ၎င်းဘာသာဟာ နယ်ပယ်မဲ့ပါ။
- `[account].public_key` နှင့် `[account].private_key` ငွေပေးချေမှုကို လက်မှတ်ထိုးပါ။

Account က အင္တာနက္မွာ ရွိေနရတယ္
ဘူးတွဲထားတဲ့ မျိုးရိုးဗီဇ ပြဋ္ဌာန်းချက်နဲ့ ကိုင်တွယ်ထားပါတယ်။

::: info ကိစ္စအသိစိတ်

Iroha နာမည်တွေဟာ Canonical Parsing ပြီးရင် Case-sensitive ဖြစ်တယ်။ ဥပမာ၊
`wonderland.universal`, `Wonderland.universal`, နှင့်
`looking_glass.universal` ကွဲပြားတဲ့ နယ်ပယ် စာလုံးသားတွေပါ။

:::

## အခြေခံ အထောက်အထား {#basic-authentication}

ရွေးချယ်စရာ `[basic_auth]` အပိုဒ်က HTTP `Authorization` ခေါင်းစဉ်
ဖောက်သည်တွေရဲ့ တောင်းဆိုချက်တွေပေါ့။ Iroha အထက်ပါအချက်အလက်များကို အဖော်များက တိုက်ရိုက် အဓိပ္ပါယ်ကောက်ယူခြင်းမရှိပါ။
သူတို့ကို ဘယ်တော့ Torii Nginx လို အပြောင်းအလဲ ကိုယ်စားလှယ်ရဲ့ နောက်မှာ ရှိတယ်။

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Transaction Settings များ {#transaction-settings}

Transaction behavior ကို `[transaction]` ကဏ္ဍ:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` ငွေလဲလှယ်မှုသက်တမ်းကို မီလီစက္ကန့်များဖြင့် သတ်မှတ်ထားသည်။
- `status_timeout_ms` ငွေပေးချေမှုအတွက် ဖောက်သည်က ဘယ်လောက်ကြာ စောင့်နေလဲဆိုတာ ထိန်းချုပ်တယ်။
  အခြေအနေ။
- `nonce = true` ဖောက်သည်ကို ထပ်တလဲလဲ ငွေကြေးချေမှုန်းမှုကို ထည့်သွင်းရန် တောင်းဆိုသည်။
  ဟက်ရှ် အမျိုးမျိုးကို ထုတ်လုပ်ပေးတယ်။

## Queue Settings ကို ချိတ်ဆက်ပါ {#connect-queue-settings}

လက်ရှိ Iroha ဖောက်သည်တွေကလည်း ရွေးချယ်စရာကို သုံးနိုင်ပါတယ်။ `[connect]` ဒေသဆိုင်ရာ အပိုင်း
queue state:

```toml
[connect]
queue_root = "./queue"
```

Workflow တစ်ခုအတွက် Client-side queue storage လိုတဲ့အခါ ဒါကို သုံးပါ။

## Configurations များကို ဖန်တီးခြင်း {#generating-configurations}

တစ်ခါသုံး ဒေသတွင်းကွန်ရက်များအတွက် ဦးစားပေး Kagami ဘာလို့လဲဆိုတော့ စာလုံးက လိုက်ဖက်တဲ့စာလုံးလို့ ရေးနေလို့ပါ။ Iroha
3 configs, genesis, script တွေနဲ့ README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ထုတ်လုပ်ထားသော `./localnet/client.toml` နှင့်အတူ CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
