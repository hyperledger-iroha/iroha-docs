---
translation_locale: my
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# client ပြင်ဆင်သတ်မှတ်မှု {#client-configuration}

Iroha CLI နှင့် SDK client များသည် TOML ပြင်ဆင်သတ်မှတ်ချက်ကို အသုံးပြုသည်။ repository တွင် လက်ရှိမူလသတ်မှတ်ချက်ကို `defaults/client.toml` ၌ ထည့်ပေးထားသည်။ ထုတ်လုပ်ထားသော စက်တွင်းကွန်ရက်များကလည်း ကိုက်ညီသော `client.toml` ကို ၎င်းတို့၏ ရလဒ်ဖိုင်တွဲထဲသို့ ရေးထုတ်သည်။

::: details client ပြင်ဆင်သတ်မှတ်မှုပုံစံခွက်

<<< @/snippets/client.template.toml

:::

## Core Fields များ {#core-fields}

အနည်းဆုံး client ပြင်ဆင်သတ်မှတ်မှုတွင် ချိန်း၊ ၎င်း၏ ကွန်ရက် identity၊ Torii endpoint၊ အကောင့်၏ ကွန်ရက် context နှင့် လက်မှတ်ထိုးကီးကို သတ်မှတ်ရသည်:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` သည် တင်ပြထားသော ငွေကြေးပူးပေါင်းဆောင်ရွက်မှုများ ပါဝင်သည့် ချုပ်ဆက်ကို ရွေးချယ်သည်။
- `network_id` သည် genesis မှ ဆင်းသက်ရယူသော ကွန်ရက် identity ဖြစ်ပြီး လက်မှတ်ထိုးထားသော တောင်းဆိုမှုတိုင်းနှင့် ချည်နှောင်ထားသည်။ `network_id` သို့မဟုတ် `network_id_file` နှစ်ခုအနက် တစ်ခုအတိအကျကို သတ်မှတ်ပါ။ နိုဒ်သည် တန်ဖိုးကို `GET /v1/accounts/capabilities` တွင် ဖော်ပြသည်။
- `torii_url` သည် peer ၏ Torii HTTP API ကို ညွှန်သည်။
- `[account].chain_discriminant` သည် ကွန်ရက်၏ I105 အကောင့်ရှေ့ဆက်ကို ရွေးချယ်သည်။ အများသုံးကွန်ရက်များတွင် ၎င်းအစား `[account].profile = "taira"` သို့မဟုတ် `"minamoto"` ကို သုံးနိုင်သည်။ နှစ်မျိုးအနက် တစ်မျိုး လိုအပ်ပြီး စံ `AccountId` ကိုယ်တိုင်တွင် domain မပါဝင်ပါ။
- `[account].public_key` နှင့် `[account].private_key` သည် transaction များကို လက်မှတ်ထိုးသည်။ `private_key_file` ကို `private_key` အစား သုံးနိုင်သည်။

အွန်လိုင်းမှာ ရှိပြီးသား ဖြစ်ရပါမယ်။ ပုံမှန် ဒေသတွင်းကွန်ရက်အတွက်တော့ ဒါက ဘူးတွဲထားတဲ့ blockchain genesis technical manifest ကနေ ကိုင်တွယ်ပါတယ်။

::: info ကိစ္စအသိစိတ်

စံပုံစံအတိုင်း parse လုပ်ပြီးနောက် Iroha အမည်များသည် စာလုံးအကြီးအသေး ခွဲခြားသည်။ ဥပမာ `wonderland.universal`၊ `Wonderland.universal` နှင့် `looking_glass.universal` တို့သည် မတူညီသော domain တန်ဖိုးများဖြစ်သည်။

:::

## အခြေခံ အတည်ပြုမှု {#basic-authentication}

ရွေးချယ်ထည့်နိုင်သော `[basic_auth]` အပိုင်းသည် client တောင်းဆိုမှုများတွင် HTTP `Authorization` ခေါင်းစီးကို ပေါင်းထည့်သည်။ Iroha peer များသည် ဤအထောက်အထားများကို တိုက်ရိုက် မဖတ်ဆိုပါ။ Torii သည် Nginx ကဲ့သို့ ပြောင်းပြန် proxy နောက်တွင် ရှိသောအခါ ၎င်းတို့ကို သုံးပါ။

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
- `nonce = true` သည် ထပ်ခါတလဲလဲ transaction များမှ မတူညီသော ဟက်ရှ်များ ရရှိစေရန် client အား nonce တစ်ခု ထည့်ပေးရန် တောင်းဆိုသည်။

## Queue Settings ကို ချိတ်ဆက်ပါ {#connect-queue-settings}

`iroha` CLI သည် ဒေသတွင်း တန်းစီစာရင်း အခြေအနေအတွက် မဖြစ်မနေမဟုတ်သော `[connect]` အပိုင်းကိုလည်း ဖတ်သည်။ ပြန်လည်အသုံးပြုနိုင်သည့် SDK ပြင်ဆင်သတ်မှတ်မှုက ၎င်းကို လက်မခံပါ:

```toml
[connect]
queue_root = "./queue"
```

လုပ်ငန်းစဉ်တွင် client ဘက်၌ တန်းစီစာရင်းကို ရေရှည်တည်မြဲစွာ သိမ်းဆည်းရန် လိုအပ်သောအခါ ၎င်းကို သုံးပါ။ `connect.queue_root` ၏ ပုံသေမှာ `~/.iroha/connect` ဖြစ်ပြီး နှိုင်းရလမ်းကြောင်းကို client TOML ဖိုင်ပါဝင်သော directory မှ စတင်ဖြေရှင်းသည်။

## Configurations များကို ဖန်တီးခြင်း {#generating-configurations}

တစ်ခါသုံး ဒေသတွင်းကွန်ရက်များအတွက် Kagami ကိုရွေးချယ်ပါ၊ အကြောင်းက Iroha 3 ဖွဲ့စည်းပုံ၊ blockchain မျိုးဆက်၊ စာသားများနှင့် README ကို လိုက်ဖက်စွာရေးသားလို့ပါ။

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

ထုတ်လုပ်ထားသော `./localnet/client.toml` ကို CLI နှင့်အတူ အသုံးပြုပါ-

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
