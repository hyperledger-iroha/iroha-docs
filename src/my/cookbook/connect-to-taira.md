---
translation_locale: my
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira သို့ ချိတ်ဆက်ပါ။ {#connect-to-taira}

## ရလဒ် {#outcome}

Taira ကိုရောက်ရှိနိုင်ကြောင်း အတည်ပြုခြင်း၊ ဒေသခံဖောက်သည်ကွန်ဖိုင်နံပါတ်မှ Single Protocol-Standard I105 အကောင့် ID ကိုထုတ်ယူခြင်း၊ testnet XOR ဖြင့် cryptographic signer ကိုထောက်ပံ့ခြင်းနှင့် fee quoted canary ငွေပေးချေမှုတစ်ခုတင်သွင်းခြင်း။ ဤနည်းပြချက်သည် Minamoto သို့ စာရေးသားခြင်းတစ်ခါမျှ မပို့ပါ။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊နှင့် လက်ရှိ `iroha` နှင့် `kagami` ဘိုင်နရီများ။
- A ကို `taira.client.toml` ဖန်တီးခဲ့သည် Taira သံကြိုး၊ API endpoint, account profile နဲ့ testnet key ကို လိုက်နာပါ။ [A ကို ဖန်တီးပါ။ Taira Client Config ကို](/my/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ပြီးတော့ ဖိုင်ကို အရင်းအမြစ် ထိန်းချုပ်မှုကနေ ထုတ်ပစ်ပါ။
- Run-ready `taira_faucet_claim.py` from [Testnet XOR ကို Taira သို့ခေါ်ယူပါ။](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ကနေ client configuration အနားမှာ သိမ်းထားတယ်။

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

ဤစစ်ဆေးချက်သည် ဖတ်နိုင်မှုသာရှိပြီး cryptographic signer configuration ကို မတင်ပါ

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

DNS ၊ TLS၊ ကွင်းဆက် (သို့) API အဆုံးသတ်မှတ်ချက် ပျက်ကွက်မှုအကြောင်း ဆရာဝန်က အစီရင်ခံတဲ့အခါ စာကို ဆက်မရေးပါနဲ့။ ပြည့်ဝတဲ့ အများပြည်သူတန်းဟာ ယာယီဖြစ်တယ်၊ နယ်နိမိတ်ထားတဲ့ မူဝါဒတစ်ခုနဲ့ စောင့်ပြီး ထပ်မံ စမ်းပါ။

### (၃) လျှို့ဝှက်ချက် မနှိပ်ဘဲ Taira အကောင့် ID ကို ရယူပါ။ {#_3-derive-the-taira-account-id-without-printing-a-secret}

config ထဲက public key ကိုသာ ဖတ်ပြီး Taira I105 profile နဲ့ encode လုပ်ပါ။ `[account].domain` value က routing context ကို ပေးပါတယ်။ account ID မှာ မပါဝင်ပါဘူး။

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

Output သည် domainless single protocol-standard I105 အမည်ဖြစ်သည်။ `wallet@payments.universal` ကဲ့သို့သောအမည်များသည် aliases များဖြစ်ပြီး တင်းကျပ်သောစာရင်းကွင်းများတွင်မသုံးမီ ဖြေရှင်းရန်လိုအပ်သည်။

### (၄) လက်ရှိ Taira အခွန်လိုင်စင်ကို တောင်းဆိုခြင်း {#_4-claim-the-current-taira-fee-asset}

testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှု တုံ့ပြန်မှုက အခွန်လက်ဝယ် သတ်မှတ်ချက်အတွက် အမှန်တရားရဲ့ အရင်းအမြစ်ပါ။ အခြားကွန်ရက်တစ်ခု (သို့) ရှေးဟောင်း run တစ်ခုမှ ID ကို ကူးယူမယ့်အစား ပြန်လည်ပေးပို့ထားတဲ့ Base58 ID ကို သိမ်းထားပါ။

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

အများဆုံး တစ်မိနစ်လောက် ဟန်ချက်ညီမှုကို စစ်ဆေးပါ။ testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှုက ငွေကြေးပေးချေမှုကို မြင်နိုင်မချင်း `202 Accepted` ပြန်ပို့နိုင်ပါတယ်။

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

`gas_asset_id` သည် ငွေပေးချေမှု metadata ဖြစ်သည်။ ရှင်းလင်းသော `--fee-payer authority` ရွေးချယ်မှုက လက်မှတ်ဖြင့် ချည်နှောင်ထားပြီး CLI သည် လက်မှတ်မထိုးမီမှာ အခွန်စျေးနှုန်းခန့်မှန်းချက်ကို တိကျစွာရရှိသည်။

## စစ်ဆေးပါ {#verify}

JSON ပရိုတိုကောရဲ့ ရလဒ် မှတ်တမ်းကို သိမ်းထားပြီး Applied Finality ကို စောင့်ပါ။ `--no-wait` ကို ထုတ်ပစ်ခြင်းက အစပိုင်း တင်သွင်းမှုကို အတည်ပြုမှုအတွက် စောင့်ခိုင်းစေတယ်။ ရှင်းလင်းတဲ့ အခြေအနေဖတ်ခြင်းဟာ နောက်ဆုံး ဆော့ဝဲ စီမံခန့်ခွဲရေး လုပ်ငန်းစဉ်အခြေအနေကို သက်သေပြပါတယ်။

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

နောက်ဆုံးအမိန့်က ငွေကြေးပူးပေါင်းမှုသည် default `Applied` terminal state ကိုရောက်ရှိပြီးနောက်မှသာ အောင်မြင်သည်။ cryptographic hash ကို test evidence တွင် သိမ်းထားပါ။ private key သို့မဟုတ် complete client config ကို ဘယ်တော့မှ မသိမ်းဆည်းပါနဲ့။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `/livez` ပြန်လည်ပေးသွင်းခြင်း `406` တောင်းဆိုတဲ့အခါမှာ JSON ဘာလို့လဲဆိုတော့ API အဆုံးသတ်မှတ်ချက်က `text/plain`. ပို့ပေးပါ `Accept: text/plain` အထက်က ပြထားသလိုပါ။
- `/health` သို့မဟုတ် `/readyz` တို့သည် `/livez` နှင့် `/status` တို့ အလုပ်လုပ်နေစဉ်တွင်တောင် စက်ဖတ်လို့ရတဲ့ ဘလော့ကာဖြင့် `503` ကိုပြန်ပို့နိုင်သည်။ ထိုဘလော့ကာကို ပြင်ဆင်ရန် (သို့မဟုတ်) စောင့်ဆိုင်းရန်; ပြန်လည်ပြုပြင်ရေးခလုတ်များသည် node အသင့်ရှိမှုကို မပြောင်းလဲစေပါ။
- testnet ဘဏ္ဍာရေးဝန်ဆောင်မှု `502`, အချိန်ကုန်ဆုံးခြင်း (သို့) အလုပ်အကိုင်သက်သေခံမှု ခေတ်ဟောင်းသည် အများပြည်သူ ဝန်ဆောင်မှု ကျရှုံးမှုဖြစ်သည်။ ပဟေဠိအသစ်တစ်ခုယူပြီး နောက်တစ်ကြိမ် ထပ်ကြိုးစားပါ။
- I105 ကြိုတင်အမှားဆိုသည်မှာ အများသုံးသော့ကို မှားယွင်းသောပရိုဖိုင်ဖြင့် ကုဒ်သွင်းထားခြင်းဖြစ်သည်။ `iroha tools address convert --profile taira` ကိုပြန်လည် run လုပ်ပါ။
- အခွန် quote ကို ငြင်းပယ်ခြင်းဆိုသည်မှာ ခွင့်ပြုချက် အရင်းအမြစ်ကို ငွေကြေးမထောက်ပံ့ခဲ့ခြင်း၊ အခွန်အရင်းအမြစ် metadata များက မသုံးစွဲနေခြင်း သို့မဟုတ် ရှင်းလင်းသော အခွန်ပေးသူတစ်ဦးမှ ရွေးချယ်ခြင်း မရှိခြင်းဖြစ်သည်။
- ဒီ canary အောင်မြင်ပြီးနောက်မှာ မှတ်ပုံတင်ခြင်း၊ ထုတ်လွှင့်ခြင်း သို့မဟုတ် နာမည်နေရာ စီမံခန့်ခွဲမှုများကို ပယ်ချနိုင်သည်။ ထိုလုပ်ဆောင်ချက်များသည် သီးခြားသော ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် ခွင့်ပြုချက်များလိုအပ်သည်; Taira ဝင်ရောက်ခွင့်မပေးသည့်အခါထုတ်လုပ်ထားသော ဒေသတွင်းကွန်ရက်တွင်သင်ယူပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Taira CLI ရောဂါစစ်ဆေးခြင်းနှင့် ပိတ်ထားသော အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုတွင် ကန်နာရီရင်းမြစ်](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်ချက်မှာ အခွန် ရွေးချယ်မှုနဲ့ CLI တင်ပြမှု အရင်းအမြစ်ကို ရှင်းလင်းစွာရွေးချယ်ပါ။](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira အကောင့်နှင့် testnet ထောက်ပံ့ရေး ဝန်ဆောင်မှု လမ်းညွှန်ချက်](/my/get-started/sora-nexus-dataspaces.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [ငွေပေးချေမှု](/my/blockchain/transactions.md)
