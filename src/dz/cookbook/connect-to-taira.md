---
translation_locale: dz
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# Taira ལུ་མཐུད་སྦྲེལ་འབད་ {#connect-to-taira}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ལྷོད་ཚུགསཔ་ངེས་གཏན་བཟོ། ས་གནས ཞབས་ཏོག་ལེན་མི རིམ་སྒྲིག ནང་ལས་ ཚད་ལྡན I105 རྩིས་ཐོ ID བཏོན། མིང་རྟགས་འགོད་མི འདི་ བརྟག་དཔྱད་དྲ་རྒྱ XOR གིས་དངུལ་བཙུགས་ཏེ་ འཐུས་བཀོད་ཡོདཔ སྔོན་ཚོད་བརྟག་དཔྱད ཚོང་འབྲེལ གཅིག་ཕུལ། ཟས༌སྦྱོར༌ལག༌དེབ འདི་གིས་ Minamoto ལུ་ བྲི་ བྱ་བ རྩ་ལས་མི་བཏང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་དེ་གི་ཤུལ་ལས་དང་ ད་ལྟོའི་ `iroha` དང་ `kagami` བའི་ནར་ཚུ་
- Taira གི་ སྡེབ་ཚན་རིམ་ཐག་ (chain) དང་ ངེས་བདེན་གྱི་ `network_id`, མཐའ་མཇུག་ས་ཚིགས་ རྩིས་ཐོའི་གསལ་སྡུད་ དེ་ལས་ བརྟག་དཔྱད་དྲ་རྒྱའི་དོན་ལུ་རྐྱངམ་ཅིག་ ལག་ལེན་འཐབ་མི་ ལྡེ་མིག་ཅིག་གིས་ བཟོ་ཡོད་པའི་ `taira.client.toml` ཅིག། [Taira ཞབས་ཏོག་ལེན་མིའི་རིམ་སྒྲིག་ གསར་བསྐྲུན་འབད་](/dz/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ལུ་ བལྟ་སྟེ་ འབད་ཞིནམ་ལས་ ཡིག་སྣོད་དེ་ འབྱུང་ཁུངས་ཚད་འཛིན་གྱི་ཕྱི་ཁར་ བཞག།
- བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གི་ ཉིན་ཐོའི་དོན་ལུ་ འབྲི་ཚུགས་པའི་ ལཱ་གི་སྣོད་ཐོ་ཅིག། `iroha taira account faucet prepare` གིས་ `./taira-faucet` འདི་ སྒེར་དོན་སྦེ་ གསར་བསྐྲུན་འབདཝ་ཨིནམ་དང་ ཧེ་མ་ལས་ཡོད་པའི་ སྣོད་ཐོ་ཅིག་ ཚབ་བཙུགས་ནི་ ངོས་ལེན་མི་འབད།

## རིམ་པ་ཚུ་ {#steps}

### 1. གྲ་སྒྲིག་འབད་ནི་ལས་ འཚོ་བ་མེད་པར་སྡོད་ནི་ {#_1-separate-liveness-from-readiness}

`/livez`, `/health`, དང་ `/readyz` ཚུ་ ཡིག་ཐོག་རྐྱང་པའི་ བརྟག་ཞིབ་ཚུ་ཨིན། `/status` གིས་ JSON ལོག་བྱིནམ་ཨིན། གཡོག་བཀོལ་དོ་ཡོད་པའི་ མཐུད་མཚམས་ཅིག་གིས་ མོས་མཐུན་གྱི་ངོས་ལེན་ ཡང་ན་ དགོས་མཁོ་ཡོད་པའི་ ཡན་ལག་རིམ་ལུགས་གཞན་ཅིག་ ལག་ལེན་འཐབ་མ་ཚུགས་པའི་སྐབས་ `/readyz` ལས་ `503` ཆ་གནས་ཅན་སྦེ་ ལོག་བྱིན་ཚུགས།

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

ལས་སྦྱོར་འདི་གིས་ ལན་བྱིནམ་ཨིན་ན་མེན་ན་ ཐག་བཅད་ནི་ལུ་རྐྱངམ་ཅིག་ `/livez` ལག་ལེན་འཐབ། འགྲུལ་སྐྱོད་ངོས་ལེན་གྱི་དོན་ལུ་ `/readyz` ལག་ལེན་འཐབ། དེ་གི་ `503` འདི་ བཀག་ཆ་གི་ཁ་གསལ་ མེད་པའི་ `service_unavailable` འཛོལ་བའི་ཁེབས་ཤུབས་ཅིག་ཨིན། དེ་འབདཝ་ལས་ དེ་ ཞབས་ཏོག་བར་ཆད་སྦེ་ མ་བརྩི་བའི་ཧེ་མ་ འོག་གི་བརྟག་དཔྱད་ཚུ་ གཡོག་བཀོལ།

### 2. མི་མང་གི་བརྟག་དཔྱད་ཚུ་ འགོ་འདྲེན་འཐབ་ནི། {#_2-run-the-public-diagnostics}

ཞིབ་དཔྱད་འདི་ལྷག་རྐྱངམ་ཅིག་ཨིནམ་དང་ མིང་རྟགས་བཀོད་མི་རིམ་སྒྲིག་འདི་མངོན་གསལ་མི་འབད།

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

དྲུང་འཚོ་གྱིས་ DNS, TLS, ལྕགས་ཐག་ ཡང་ན་ མཐའ་མཇུག་གི་ཐིག་ཁྲམ་ཚུ་ སྐྱོན་ཤོར་ཡོད་པའི་ སྙན་ཞུ་རྐྱབ་པའི་སྐབས་ འཕྲོ་མཐུད་དེ་ ཡིག་འབྲུ་འབྲི་མི་དགོ་ ཡོངས་བསྡོམས་ཀྱི་གྲལ་རིམ་འདི་ དུས་ཡུན་ཐུང་ཀུ་ཅིག་ཨིན། སྒུག་སྡོད་ཞིནམ་ལས་ སྲིད་བྱུས་ཚད་འཛིན་འབད་ཐོག་ལས་ ལོག་སྟེ་རང་ བརྟག་དཔྱད་འབད་ཚུགས།

### 3. Taira རྩིས་ཐོ་ ID གསང་ཡིག་མ་བསྐྲུན་པར་བཏོན་གཏང་། {#_3-derive-the-taira-account-id-without-printing-a-secret}

རིམ་སྒྲིག་ནང་ལས་ མི་མང་ལྡེ་མིག་རྐྱངམ་ཅིག་ ལྷག་ཞིནམ་ལས་ དེ་ Taira I105 གསལ་སྡུད་ཀྱིས་ ཨིན་ཀོཌ་འབད། རྩིས་ཐོ་ ID ནང་ མངའ་ཁོངས་ མེད། `[account].profile` གིས་ དེ་གི་ དྲ་རྒྱའི་སྔོན་སྦྱོར་རྐྱངམ་ཅིག་ གདམ་ཁ་རྐྱབཔ་ཨིན།

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

ཐོན་སྐྱེད་འདི་ མངའ་ཁོངས་མེད ཚད་ལྡན I105 ཁ་བྱངཨིན། མིང་དཔེར་ན་ `wallet@payments.universal` འདི་ཚུ་ མིང་གཞན་ཚུ ཨིནམ་དང་ དམ་དྲག རྩིས་ཐོ ས་སྒོ་ཚུ ནང་ ལག་ལེན་འཐབ་པའི་ཧེ་མ་ སེལ་འཐུ་འབད་དགོཔ་ཨིན།

### 4. ད་ལྟོའི་ Taira རིན་བསྡུར་ཁྲལ་གྱི་ རྒྱུ་དངོས་ཚུ་ ཐོབ་བརྗོད་བཀོད་དགོ། {#_4-claim-the-current-taira-fee-asset}

བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གི་སྲིད་བྱུས་ཀྱིས་ ད་ལྟོའི་ འཐུས་རྒྱུ་དངོས་ངེས་ཚིག་གི་མིང་ བཏགསཔ་ཨིན། དྲ་རྒྱ་གཞན་ཅིག་ ཡང་ན་ ཧེ་མའི་གཡོག་བཀོལ་ཐེངས་ཅིག་ལས་ ID འདྲ་བཤུས་རྐྱབ་ནིའི་ཚབ་ལུ་ དེ་གི་ Base58 ID བཞག། སྲིད་བྱུས་འདི་ མིང་རྟགས་མ་བཀོད་པའི་ འཚོལ་ཞིབ་གནད་སྡུད་ཨིནམ་ལས་ རང་འགུལ་ལས་རིམ་ཚུ་གིས་ ལན་རེ་རེ་ལུ་ བློ་གཏད་ནིའི་ཚབ་ལུ་ རེ་བ་བསྐྱེད་མི་ བཏོན་སྤེལ་པ་དང་ རྒྱུ་དངོས་ངེས་ཚིག་ དེ་ལས་ འབོར་ཚད་ཚུ་ གཏན་བཟུང་འབད་དགོ།

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

`prepare` གིས་ ལཱ་གི་བདེན་ཁུངས་ (proof of work) ཀྱི་དཀའ་རྙོག་ སེལ་ཞིནམ་ལས་ མིང་རྟགས་བཀོད་ཡོད་པའི་ ཚོང་འབྲེལ་ངེས་བདེན་འདི་ སྲུང་བཞགཔ་ཨིན། `submit` གིས་ དེ་ ཚར་གཅིག་ གཏང་ཞིནམ་ལས་ དེ་ ལག་ལེན་ལུ་བཀལ་ཚར་བའི་ཤུལ་ལས་ ལོག་འོངམ་ཨིན། `submit` གིས་ `Pending` སྙན་ཞུ་འབད་བ་ ཡང་ན་ དུས་ཚོད་རྫོགས་པ་ཅིན་ ཐོབ་ཞུ་གཞན་ཅིག་ གྲ་སྒྲིག་འབད་ནིའི་ཚབ་ལུ་ རིམ་སྒྲིག་དང་ ཉིན་ཐོ་གཅིག་པ་དང་གཅིག་ཁར་ `taira account faucet resume` གཡོག་བཀོལ། དེ་ལས་ ལྷག་ལུས་འདི་ མཐོ་ཤོས་ སྐར་མ་གཅིག་གི་རིང་ ཡང་ཡང་ ཞིབ་དཔྱད་འབད།

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

Taira གི་ འབྲི་ནིའི་ཚོང་འབྲེལ་རེ་རེ་གི་དོན་ལུ་ `--fee-payer authority` ལག་ལེན་འཐབ། གདམ་ཁ་འདི་ མིང་རྟགས་ལུ་ བཅིངས་ཏེ་ཡོདཔ་ཨིན། CLI གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ Taira གི་འཐུས་རྒྱུ་དངོས་ནང་ འཐུས་ངེས་བདེན་གྱི་ གོང་ཚད་བཀོདཔ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

དྲན་ཐོའི་བཀོད་རྒྱ་ཅིག་བཙུགས་ཞིནམ་ལས་ JSON མཐུན་སྒྲིག་གྲུབ་འབྲས་དྲན་ཐོ་བཞག་ཞིནམ་ལས་ འཇུག་སྤྱོད་འབད་ཡོད་པའི་མཐའ་མཇུག་ལུ་སྒུག་སྡོད། `--no-wait` བཏོན་བཏང་མི་འདི་གིས་ཡང་ འགོ་ཐོག་བཙུགས་མི་འདི་ ངེས་གཏན་གྱི་དོན་ལུ་ བསྒུག་བཅུགཔ་ཨིན། གསལ་ཏོག་ཏོ་གནས་ཚད་ལྷག་མི་འདི་གིས་ མཐའ་མཇུག་ལས་སྦྱོར་གྱི་མདོང་ལམ་གནས་སྟངས་འདི་བདེན་ཁུངས་བསྐྱལཝ་ཨིན།

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

མཐའ་མཇུག་གི་བཀའ་རྒྱ་འདི་ ངེས་བདེན་གྱི་ ཡོངས་ཁྱབ་གནས་ཚད་ཀྱིས་ གནས་སྟངས་ལས་ཐག་བཅད་ཡོད་པའི་ `Applied` མཐར་ཐུག་གནས་སྟངས་ སྙན་ཞུ་འབད་ཚར་བའི་ཤུལ་ལས་རྐྱངམ་ཅིག་ མཐར་འཁྱོལ་འབྱུངམ་ཨིན། ཧེཤ་འདི་ བརྟག་དཔྱད་ཀྱི་སྒྲུབ་བྱེད་ནང་ བཞག། སྒེར་གྱི་ལྡེ་མིག་ ཡང་ན་ ཞབས་ཏོག་ལེན་མིའི་རིམ་སྒྲིག་ཆ་ཚང་ དེ་དང་གཅིག་ཁར་ ནམ་ཡང་ གསོག་འཇོག་མ་འབད།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `/livez`, `/health`, དང་ `/readyz` ཚུ་གིས་ `text/plain` ནང་ ལན་བྱིནམ་ལས་ JSON རྐྱངམ་ཅིག་ ཞུ་བ་ཅིན་ `406` ལོག་བྱིནམ་ཨིན། གོང་ལུ་སྟོན་ཡོད་པའི་ `Accept` མགོ་ཡིག་ཚུ་ གཏང་།
- `/livez` དང་ `/status` ལཱ་འབད་དོ་ཡོད་རུང་ `/readyz` གིས་ `service_unavailable` འཛོལ་བའི་ཁེབས་ཤུབས་དང་གཅིག་ཁར་ `503` ལོག་བྱིན་སྲིད། གྲ་སྒྲིག་འབྱུངམ་ཚུན་ སྒུག། ཡང་ན་ `iroha taira doctor` གཡོག་བཀོལ། ལྡེ་མིག་ཚུ་ ལོག་བཟོ་རུང་ མཐུད་མཚམས་ཀྱི་ གྲ་སྒྲིག་ མི་འགྱུར།
- `submit` གི་སྐབས་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་ `502` ཡང་ན་ དུས་ཚོད་རྫོགས་པ་ཅིན་ ཐོབ་ཞུ་གི་གྲུབ་འབྲས་ མ་ཤེསཔ་སྦེ་ ལུསཔ་ཨིན། ཐོབ་ཞུ་གཞན་ཅིག་ གྲ་སྒྲིག་འབད་ནིའི་ཚབ་ལུ་ རིམ་སྒྲིག་དང་ ཉིན་ཐོ་གཅིག་པ་དང་གཅིག་ཁར་ `taira account faucet resume` གཡོག་བཀོལ། ལཱ་གི་བདེན་ཁུངས་ཀྱི་ གཞི་རྟེན་ (anchor) རྙིངམ་ཅིག་ ཡོད་པ་ཅིན་ `prepare` འཐུས་ཤོར་འབྱུངམ་ཨིན། ཉིན་ཐོའི་སྣོད་ཐོ་གསརཔ་ཅིག་ནང་ ལོག་སྟེ་ གྲ་སྒྲིག་འབད།
- I105 སྔོན་སྒྲིག་འཛོལ་བ་འདི་གིས་ མི་མང་ལྡེ་མིག་འདི་ གསལ་སྡུད་འཛོལ་བ་དང་གཅིག་ཁར་ ཨེན་ཀོ་ཌི་འབད་ཡོདཔ་སྦེ་ཨིན། `iroha tools address convert --profile taira` ལོག་གཡོག་བཀོལ།
- འཐུས་ཀྱི་གོང་ཚད་བཀོད་པ་ བཀག་ཆ་འབད་བ་ཅིན་ སྤྱིར་བཏང་ དབང་འཛིན་ལུ་ མ་དངུལ་མ་བཙུགས་པ་ ཡང་ན་ རིམ་སྒྲིག་འབད་ཡོད་པའི་ `network_id` འདི་ Taira གི་ མེནམ་སྦེ་ སྟོནམ་ཨིན། `--fee-payer` མེད་པ་ ཡང་ན་ `--metadata` ནང་ `gas_asset_id` བཟུམ་གྱི་ འཐུས་ལྡེ་མིག་ཅིག་ ཡོད་པ་ཅིན་ གོང་ཚད་བཀོད་པའི་ཧེ་མ་ ས་གནས་ནང་ར་ འཐུས་ཤོར་འབྱུངམ་ཨིན།
- ཐོ་བཀོད་, བཏོན་ནི, ཡང་ན་མིང་གནས་འཛིན་སྐྱོང་འདི་ སྔོན་བརྟག གིས་ གྲུབ་འབྲས་ཐོབ་པའི་ཤུལ་ལས་ཡང་མ་བཏུབ་ཨིན། འདི་བཟུམ་གྱི་ལཱ་ཚུ་གི་དོན་ལུ་དམིགས་བསལ་ ལག་བསྟར་མཉེན་ཆས ངོས་ལེན་ཚུ་ དགོཔ་ཨིན། Taira ཐོབ་ཐངས་མ་བྱིན་པའི་སྐབས་ལུ་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཁ་ཐུག་གི་དྲ་རྒྱ་ནང་ལུ་ བསྐྱར་ཞིབ་འབད་ཚུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- གཏན་སྦྱར་ཡོད་པའི་ Git commit ནང་གི་ [Taira CLI བརྟག་དཔྱད་དང་ སྔོན་བརྟག་གི་ འབྱུང་ཁུངས་](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) དང་ [བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གི་ བཀའ་རྒྱ་ཚུ་](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [ཟད་འགྲོ་བཏང་མི་འཐུས་གདམ་ཁ་དང་ CLI བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ ཁས་བླངས་ཀྱི་འབྱུང་ཁུངས་ — གཏན་སྦྱར་ཡོད་པའི Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)།
- [Taira རྩིས་ཐོ་དང་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གི་ལམ་སྟོན་](/dz/get-started/sora-nexus-dataspaces.md)
- [སྲོལ་འཛིན་གྱི་སྒྲིག་གཞི་](/dz/guide/configure/client-configuration.md)
- [ལས་སྣ་ཚུ་](/dz/blockchain/transactions.md)
