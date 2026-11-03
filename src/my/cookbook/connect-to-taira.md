---
translation_locale: my
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Taira သို့ ချိတ်ဆက်ပါ။ {#connect-to-taira}

## ရလဒ် {#outcome}

Taira ကိုရောက်ရှိနိုင်ကြောင်း အတည်ပြုခြင်း၊ ဒေသခံဖောက်သည်ကွန်ဖိုင်နံပါတ်မှ Single Protocol-Standard I105 အကောင့် ID ကိုထုတ်ယူခြင်း၊ testnet XOR ဖြင့် cryptographic signer ကိုထောက်ပံ့ခြင်းနှင့် fee quoted canary ငွေပေးချေမှုတစ်ခုတင်သွင်းခြင်း။ ဤနည်းပြချက်သည် Minamoto သို့ စာရေးသားခြင်းတစ်ခါမျှ မပို့ပါ။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊နှင့် လက်ရှိ `iroha` နှင့် `kagami` ဘိုင်နရီများ။
- Taira chain၊ တိကျသော `network_id`၊ endpoint၊ အကောင့် profile နှင့် သီးသန့် testnet သော့တစ်ခုဖြင့် ဖန်တီးထားသော `taira.client.toml` တစ်ခု။ [Taira client ပြင်ဆင်သတ်မှတ်ချက်ဖိုင် ဖန်တီးခြင်း](/my/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ကို လိုက်နာပြီး ဖိုင်ကို source control ထဲသို့ မထည့်ပါနှင့်။
- faucet journal အတွက် ရေးသားခွင့်ရှိသော လုပ်ငန်းဖိုင်တွဲတစ်ခု- `iroha taira account faucet prepare` သည် `./taira-faucet` ကို သီးသန့်ခွင့်ပြုချက်ဖြင့် ဖန်တီးပြီး ရှိပြီးသား ဖိုင်တွဲကို အစားထိုးရန် ငြင်းဆိုသည်။

## ခြေလှမ်း {#steps}

### (၁) အသင့်ရှိခြင်းနှင့် သက်တောင့်သက်သာကို ကွဲပြားစေရန် {#_1-separate-liveness-from-readiness}

`/livez`၊ `/health` နှင့် `/readyz` တို့သည် plain-text probe များ ဖြစ်ပြီး `/status` သည် JSON ကို ပြန်ပေးသည်။ လည်ပတ်နေသော node တစ်ခုသည် consensus ဝင်ခွင့် သို့မဟုတ် လိုအပ်သော အခြား subsystem တစ်ခု မရရှိနိုင်သည့်အခါ `/readyz` မှ `503` ကို ပုံမှန်အတိုင်းပင် ပြန်ပေးနိုင်သည်။

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

process က တုံ့ပြန်ခြင်း ရှိမရှိကို ဆုံးဖြတ်ရန်အတွက်သာ `/livez` ကို အသုံးပြုပါ။ traffic ဝင်ခွင့်အတွက် `/readyz` ကို အသုံးပြုပါ။ ၎င်း၏ `503` သည် blocker အသေးစိတ်မပါသော `service_unavailable` error envelope ဖြစ်သောကြောင့် ၎င်းကို ပြတ်တောက်မှုအဖြစ် မသတ်မှတ်မီ အောက်ပါ diagnostics ကို လုပ်ဆောင်ပါ။

### (၂) ပြည်သူလူထုရဲ့ ရောဂါစစ်ဆေးမှုကို ဆောင်ရွက်ပါ။ {#_2-run-the-public-diagnostics}

ဤစစ်ဆေးချက်သည် ဖတ်နိုင်မှုသာရှိပြီး cryptographic signer configuration ကို မတင်ပါ

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

DNS ၊ TLS၊ ကွင်းဆက် (သို့) API အဆုံးသတ်မှတ်ချက် ပျက်ကွက်မှုအကြောင်း ဆရာဝန်က အစီရင်ခံတဲ့အခါ စာကို ဆက်မရေးပါနဲ့။ ပြည့်ဝတဲ့ အများပြည်သူတန်းဟာ ယာယီဖြစ်တယ်၊ နယ်နိမိတ်ထားတဲ့ မူဝါဒတစ်ခုနဲ့ စောင့်ပြီး ထပ်မံ စမ်းပါ။

### (၃) လျှို့ဝှက်ချက် မနှိပ်ဘဲ Taira အကောင့် ID ကို ရယူပါ။ {#_3-derive-the-taira-account-id-without-printing-a-secret}

config မှ အများသုံးသော့ကိုသာ ဖတ်ပြီးနောက် ၎င်းကို Taira I105 profile ဖြင့် encode လုပ်ပါ။ အကောင့် ID တွင် ဒိုမင် မပါဝင်ပါ။ `[account].profile` သည် ၎င်း၏ network prefix ကိုသာ ရွေးချယ်သည်။

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

faucet မူဝါဒသည် လက်ရှိ အခွန်အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို ဖော်ပြသည်။ အခြားကွန်ရက်တစ်ခု သို့မဟုတ် ယခင်လုပ်ဆောင်မှုတစ်ခုမှ ID ကို ကူးယူမည့်အစား ၎င်း၏ Base58 ID ကို ထိန်းသိမ်းပါ။ မူဝါဒသည် လက်မှတ်မထိုးထားသော discovery ဒေတာ ဖြစ်သောကြောင့် automation သည် တုံ့ပြန်မှုတိုင်းကို ယုံကြည်မည့်အစား ၎င်းမျှော်လင့်သော ထုတ်ပေးသူ၊ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်နှင့် ပမာဏကို ပုံသေသတ်မှတ်ထားသင့်သည်။

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` သည် proof-of-work ကို ဖြေရှင်းပြီး လက်မှတ်ထိုးထားသော တိကျသည့် transaction ကို သိမ်းဆည်းသည်။ `submit` သည် ၎င်းကို တစ်ကြိမ် ပေးပို့ပြီး apply ဖြစ်ပြီးနောက် ပြန်လာသည်။ `submit` က `Pending` ဟု အစီရင်ခံပါက သို့မဟုတ် အချိန်ကုန်သွားပါက နောက်ထပ်တောင်းဆိုမှုတစ်ခုကို ပြင်ဆင်မည့်အစား တူညီသော config နှင့် journal ဖြင့် `taira account faucet resume` ကို လုပ်ဆောင်ပါ။ ထို့နောက် လက်ကျန်ကို အများဆုံး တစ်မိနစ်အထိ poll လုပ်ပါ။

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

Taira ရေးသွင်းမှုတိုင်းအတွက် `--fee-payer authority` ကို အသုံးပြုပါ။ ဤရွေးချယ်မှုသည် လက်မှတ်နှင့် ချိတ်ဆက်ထားပြီး CLI သည် လက်မှတ်မထိုးမီ Taira ၏ အခွန်အရင်းအမြစ်ဖြင့် တိကျသော အခွန်ကို ခန့်မှန်းတွက်ချက်ပြသသည်။

## စစ်ဆေးပါ {#verify}

JSON ပရိုတိုကောရဲ့ ရလဒ် မှတ်တမ်းကို သိမ်းထားပြီး Applied Finality ကို စောင့်ပါ။ `--no-wait` ကို ထုတ်ပစ်ခြင်းက အစပိုင်း တင်သွင်းမှုကို အတည်ပြုမှုအတွက် စောင့်ခိုင်းစေတယ်။ ရှင်းလင်းတဲ့ အခြေအနေဖတ်ခြင်းဟာ နောက်ဆုံး ဆော့ဝဲ စီမံခန့်ခွဲရေး လုပ်ငန်းစဉ်အခြေအနေကို သက်သေပြပါတယ်။

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

နောက်ဆုံး command သည် တိကျသော global status က state အရ ဖြေရှင်းပြီးသော `Applied` finality ကို အစီရင်ခံပြီးမှသာ အောင်မြင်သည်။ hash ကို စမ်းသပ်မှု အထောက်အထားထဲတွင် သိမ်းထားပါ။ ပုဂ္ဂလိကသော့ သို့မဟုတ် client ၏ config အပြည့်အစုံကို ၎င်းနှင့်အတူ ဘယ်သောအခါမျှ မသိမ်းဆည်းပါနှင့်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `/livez`၊ `/health` နှင့် `/readyz` တို့သည် `text/plain` ဖြင့် ဖြေကြားသောကြောင့် JSON ကိုသာ တောင်းဆိုသည့်အခါ `406` ကို ပြန်ပေးသည်။ အထက်တွင် ပြထားသော `Accept` header များကို ပေးပို့ပါ။
- `/livez` နှင့် `/status` အလုပ်လုပ်နေစဉ်တွင်ပင် `/readyz` သည် `service_unavailable` error envelope ဖြင့် `503` ကို ပြန်ပေးနိုင်သည်။ အသင့်ဖြစ်သည်အထိ စောင့်ပါ သို့မဟုတ် `iroha taira doctor` ကို လုပ်ဆောင်ပါ။ သော့များကို ပြန်လည်ထုတ်လုပ်ခြင်းသည် node ၏ အသင့်ဖြစ်မှုကို ပြောင်းလဲမည် မဟုတ်ပါ။
- `submit` အတွင်း faucet `502` သို့မဟုတ် အချိန်ကုန်ဆုံးမှု ဖြစ်ပါက တောင်းဆိုမှု၏ ရလဒ်ကို မသိရတော့ပါ- နောက်ထပ်တောင်းဆိုမှုတစ်ခုကို ပြင်ဆင်မည့်အစား တူညီသော config နှင့် journal ဖြင့် `taira account faucet resume` ကို လုပ်ဆောင်ပါ။ ခေတ်နောက်ကျနေသော proof-of-work anchor သည် `prepare` ကို မအောင်မြင်စေပါ။ journal ဖိုင်တွဲအသစ်တစ်ခုတွင် ထပ်မံ ပြင်ဆင်ပါ။
- I105 ကြိုတင်အမှားဆိုသည်မှာ အများသုံးသော့ကို မှားယွင်းသောပရိုဖိုင်ဖြင့် ကုဒ်သွင်းထားခြင်းဖြစ်သည်။ `iroha tools address convert --profile taira` ကိုပြန်လည် run လုပ်ပါ။
- အခွန်စျေးနှုန်းခန့်မှန်းချက် ငြင်းပယ်ခံရခြင်းသည် များသောအားဖြင့် authority ကို ငွေမထည့်ရသေးခြင်း သို့မဟုတ် ပြင်ဆင်သတ်မှတ်ထားသော `network_id` သည် Taira နှင့် မကိုက်ညီခြင်းကို ဆိုလိုသည်။ `--fee-payer` မပါခြင်း သို့မဟုတ် `--metadata` ထဲတွင် `gas_asset_id` ကဲ့သို့သော အခွန် key ပါဝင်ခြင်းသည် ခန့်မှန်းတွက်ချက်ခြင်းမပြုမီ ဒေသတွင်း၌ပင် မအောင်မြင်ပါ။
- ဒီ canary အောင်မြင်ပြီးနောက်မှာ မှတ်ပုံတင်ခြင်း၊ ထုတ်လွှင့်ခြင်း သို့မဟုတ် နာမည်နေရာ စီမံခန့်ခွဲမှုများကို ပယ်ချနိုင်သည်။ ထိုလုပ်ဆောင်ချက်များသည် သီးခြားသော ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် ခွင့်ပြုချက်များလိုအပ်သည်; Taira ဝင်ရောက်ခွင့်မပေးသည့်အခါထုတ်လုပ်ထားသော ဒေသတွင်းကွန်ရက်တွင်သင်ယူပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- ပုံသေသတ်မှတ်ထားသော commit ရှိ [Taira CLI diagnostics နှင့် canary source](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) နှင့် [faucet command များ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်ချက်မှာ အခွန် ရွေးချယ်မှုနဲ့ CLI တင်ပြမှု အရင်းအမြစ်ကို ရှင်းလင်းစွာရွေးချယ်ပါ။](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira အကောင့်နှင့် testnet ထောက်ပံ့ရေး ဝန်ဆောင်မှု လမ်းညွှန်ချက်](/my/get-started/sora-nexus-dataspaces.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [ငွေပေးချေမှု](/my/blockchain/transactions.md)
