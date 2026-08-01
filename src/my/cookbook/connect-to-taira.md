---
translation_locale: my
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira သို့ ချိတ်ဆက်ပါ။ {#connect-to-taira}

## ရလဒ် {#outcome}

Taira ကိုရောက်ရှိနိုင်ကြောင်း အတည်ပြုခြင်း၊ ဒေသခံဖောက်သည် ဖွဲ့စည်းမှုတစ်ခုမှ ကန်နီကလစ် I105 အကောင့် ID ကို ရယူခြင်း၊ စာချုပ်ထိုးသူအား testnet XOR ဖြင့် ငွေကြေးထောက်ပံ့ခြင်းနှင့် အခွန်တင်ဒါဖြင့် ကန်နာရီရောင်းချမှုတစ်ခုကို တင်သွင်းခြင်း။ ဤနည်းပြချက်သည် Minamoto သို့စာရင်းတစ်စောင်မျှ မပို့ပါ။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊နှင့် လက်ရှိ `iroha` နှင့် `kagami` ဘိုင်နရီများ။
- Taira ကွင်းဆက်၊ အဆုံးအသတ်မှတ်ချက်၊ အကောင့်ပရိုဖိုင်နှင့် သီးသန့် testnet ခလုတ်ဖြင့်ဖန်တီးထားသော `taira.client.toml` ကိုလိုက်နာပါ။ [ ကိုလိုက်နာပြီး Taira Client Config](/my/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ကိုဖန်တီး၍ ရင်းမြစ်ထိန်းချုပ်မှုမှ ဖိုင်ကိုရှောင်ရှားပါ။
- Run-ready `taira_faucet_claim.py` from [Get Testnet XOR on Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), saved next to the client configuration ကိုနှိပ်ပါ။

## ခြေလှမ်း {#steps}

### (၁) အသင့်ရှိခြင်းနှင့် သက်တောင့်သက်သာကို ကွဲပြားစေရန် {#_1-separate-liveness-from-readiness}

`/livez` ဒါက ရိုးရှင်းတဲ့ စာသားဖြစ်စဉ် သက်ရှိမှု စူးစမ်းရေးပါ။ `/status`, `/health`, နှင့် `/readyz` ပြန်လာခြင်း JSON. Running node တစ်ခုက တရားဝင် ပြန်လာနိုင်ပါတယ် `503` လိုအပ်တဲ့ subsystem တစ်ခုကို ပိတ်လိုက်တဲ့အခါ အသင့်ရှိမှု စွန်းတွေကနေပါ။

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` ကို အသုံးပြုပြီး လုပ်ငန်းစဉ်က ဖြေကြားမှုရှိမရှိကိုသာ ဆုံးဖြတ်ပါ။ `/readyz` ကို သုံးပြီး ယာဉ်မသွားနိုင်အောင် ဝင်ခွင့်ပြုပြီး JSON ဘလော့ကာရဲ့ အသေးစိတ်အချက်အလက်တွေကို စစ်ဆေးပါ `503` ကို အပြတ်အသတ်အဖြစ် မသုံးခင်။

### (၂) ပြည်သူလူထုရဲ့ ရောဂါစစ်ဆေးမှုကို ဆောင်ရွက်ပါ။ {#_2-run-the-public-diagnostics}

ဤစစ်ဆေးမှုက ဖတ်နိုင်မှုသာရှိပြီး လက်မှတ်ရေးထိုးသူကွန်ဖိုင်ကို မထည့်ပါ။

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

DNS, TLS၊ ကွင်းဆက် (သို့) အဆုံးသတ်မှတ်ချက် ကျရှုံးမှုအကြောင်း ဆရာဝန်က အစီရင်ခံတဲ့အခါ စာကို ဆက်မရေးပါနဲ့။ ပြည့်သိပ်တဲ့ အများပြည်သူတန်းဟာ ယာယီဖြစ်တယ်၊ နယ်နိမိတ်ထားတဲ့ မူဝါဒတစ်ခုနဲ့ စောင့်ပြီး ထပ်စမ်းပါ။

### (၃) လျှို့ဝှက်ချက် မနှိပ်ဘဲ Taira အကောင့်ကို ID မှထုတ်ယူပါ။ {#_3-derive-the-taira-account-id-without-printing-a-secret}

Config ထဲက Public Key ကိုပဲ ဖတ်ပြီး Code လုပ်ပါ။ Taira I105 Profile ကို `[account].domain` value supplies routing context ဆိုသည်မှာ ငွေစာရင်း၏ အစိတ်အပိုင်း မဟုတ်ပါ။ ID.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

output သည် domainless canonical I105 လိပ်စာဖြစ်သည်။ `wallet@payments.universal` ကဲ့သို့သောအမည်များသည် aliases များဖြစ်ပြီး တင်းကျပ်သောစာရင်းကွင်းများတွင်မအသုံးပြုမီဖြေရှင်းရန်လိုအပ်သည်။

### (၄) လက်ရှိ Taira အခွန်လိုင်စင်ကို တောင်းဆိုခြင်း {#_4-claim-the-current-taira-fee-asset}

Faucet Response သည် fee asset သတ်မှတ်ချက်အတွက် အမှန်တရား၏ အရင်းအမြစ်ဖြစ်သည်။ အခြားကွန်ရက်တစ်ခုမှ ID ကိုကူးယူခြင်းအစား ပြန်လည်ပို့သော Base58 ID ကိုသိမ်းပါ။

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

အများဆုံး တစ်မိနစ်လောက် ဟန်ချက်ညီမှုကို စစ်ဆေးပါ။ ရေပိုက်က ငွေကြေးထောက်ပံ့မှုလုပ်ငန်းကို မမြင်ရခင် `202 Accepted` ပြန်ပို့နိုင်သည်။

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` သည် ငွေပေးချေမှု metadata ဖြစ်သည်။ ရှင်းလင်းသော `--fee-payer authority` ရွေးချယ်မှုက လက်မှတ်ဖြင့် ချည်နှောင်ထားပြီး CLI သည် လက်မှတ်မထိုးခင်မှာ တိကျတဲ့ အခွန် quote ကိုရယူသည်။

## စစ်ဆေးပါ {#verify}

JSON လက်မှတ်ကို သိမ်းထားပြီး Applied Finality ကို စောင့်ပါ။ `--no-wait` ကို ထုတ်ပေးခြင်းသည်လည်း အစပိုင်းတင်သွင်းမှုကို အတည်ပြုမှုအတွက်စောင့်စေသည်။ ရှင်းလင်းသောအခြေအနေဖတ်ခြင်းက နောက်ဆုံး pipeline အခြေအနေကို သက်သေပြသည်။

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

နောက်ဆုံးအမိန့်က ငွေပေးချေမှုသည် default `Applied` terminal state ကိုရောက်ရှိပြီးနောက်မှသာအောင်မြင်သည်။ hash ကိုစမ်းသပ်မှုသက်သေများတွင် သိမ်းဆည်းထားပါ။ ပုဂ္ဂလိက key သို့မဟုတ် client အပြည့်အဝ config ကိုနှင့်အတူ ဘယ်တော့မှသိမ်းဆည်းမထားပါ။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `/livez` ပြန်လည်ပေးသွင်းခြင်း `406` တောင်းဆိုတဲ့အခါမှာ JSON အကြောင်းက အဲဒီအဆုံးသတ်မှတ်ချက်က `text/plain`. ပို့ပေးပါ `Accept: text/plain` အထက်က ပြထားသလိုပါ။
- `/health` သို့မဟုတ် `/readyz` တို့သည် `/livez` နှင့် `/status` တို့ အလုပ်လုပ်နေစဉ်တွင်တောင် စက်ဖတ်လို့ရတဲ့ ဘလော့ကာဖြင့် `503` ကိုပြန်ပို့နိုင်သည်။ ထိုဘလော့ကာကို ပြင်ဆင်ရန် (သို့မဟုတ်) စောင့်ဆိုင်းရန်; ပြန်လည်ပြုပြင်ရေးခလုတ်များသည် node အသင့်ရှိမှုကို မပြောင်းလဲစေပါ။
- `502` faucet (သို့) timeout (သို့) ခေတ်နောက်ကျနေတဲ့ proof-of-work anchor ဟာ အများပြည်သူဝန်ဆောင်မှု ပျက်ကွက်မှုပါ။ ပဟေဠိအသစ်တစ်ခုယူပြီး နောက်မှာ ထပ်စမ်းပါ။
- I105 ကြိုတင်အမှားဆိုသည်မှာ အများသုံးသော့ကို မှားယွင်းသောပရိုဖိုင်ဖြင့် ကုဒ်သွင်းထားခြင်းဖြစ်သည်။ `iroha tools address convert --profile taira` ကိုပြန်လည် run လုပ်ပါ။
- အခွန်တင်ဒါကို ငြင်းပယ်ခြင်းဆိုသည်မှာ အာဏာပိုင်က ငွေကြေးထောက်ပံ့မှုမရှိ၊ အခွန်လက်မှတ် metadata က ခေတ်နောက်ကျနေသည် သို့မဟုတ် ရှင်းလင်းသော အခွန်ပေးသွင်းသူတစ်ဦးမှ ရွေးချယ်ခြင်း မရှိခြင်းဖြစ်သည်။
- မှတ်ပုံတင်ခြင်း၊ minting သို့မဟုတ် namespace ကို စီမံခန့်ခွဲခြင်းသည် ဤ canary သည်အောင်မြင်ပြီးနောက်ပင် ငြင်းပယ်နိုင်သည်။ ထိုလုပ်ဆောင်ချက်များသည် သီးခြား runtime ခွင့်ပြုချက်များကိုလိုအပ်သည်။ Taira ဝင်ရောက်ခွင့်မပေးသည့်အခါထုတ်လုပ်ထားသော ဒေသတွင်းကွန်ရက်တွင်သင်ယူပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Taira CLI ရောဂါစစ်ဆေးခြင်းနှင့် ပိတ်ထားသော commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs) တွင်ရှိသည့် ကန်နာရီ အရင်းအမြစ်
- [အခွန်ရွေးချယ်ခြင်းနှင့် CLI တင်ပြမှု အရင်းအမြစ်ကို ချိတ်ဆက်ထားသော ကတိပြုချက်](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Taira စာရင်းနှင့်ရေချိုးလမ်းညွှန်](/my/get-started/sora-nexus-dataspaces.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [ငွေပေးချေမှု](/my/blockchain/transactions.md)
