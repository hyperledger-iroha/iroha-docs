---
translation_locale: dz
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: human-reviewed
---
# Taira ལུ་མཐུད་སྦྲེལ་འབད་ {#connect-to-taira}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ལྷོད་ཚུགསཔ་ངེས་གཏན་བཟོ། ས་གནས ཞབས་ཏོག་ལེན་མི རིམ་སྒྲིག ནང་ལས་ ཚད་ལྡན I105 རྩིས་ཐོ ID བཏོན། མིང་རྟགས་འགོད་མི འདི་ བརྟག་དཔྱད་དྲ་རྒྱ XOR གིས་དངུལ་བཙུགས་ཏེ་ འཐུས་བཀོད་ཡོདཔ སྔོན་ཚོད་བརྟག་དཔྱད ཚོང་འབྲེལ གཅིག་ཕུལ། ཟས༌སྦྱོར༌ལག༌དེབ འདི་གིས་ Minamoto ལུ་ བྲི་ བྱ་བ རྩ་ལས་མི་བཏང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་དེ་གི་ཤུལ་ལས་དང་ ད་ལྟོའི་ `iroha` དང་ `kagami` བའི་ནར་ཚུ་
- `taira.client.toml` བཟོ་སྐྲུན་འབད་ཡོདཔ་ཨིན། Taira ལྕགས་ཐག་དང་མཐའན་མཇུག་གི་ཐིག་ཁྲ། རྩིས་སྤྲོད་ཡིག་སྣོད་དང་ དམིགས་གཏད་ཅན་གྱི་ བརྟག་དཔྱད་ཧིང་ལྡེ་མིག་ཅིག་གིས་བཟོ་བཀོད་འབདཝ་ཨིན། [འདི་ལག་ལེན་འཐབ་ཞིནམ་ལས་ Taira ཌའི་ལོག་གཞི་སྒྲིག་](/dz/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)བཟོ་སྟེ་ གཞི་རྟེན་འཛིན་སྐྱོང་མ་འཐབ་པར་སྡོད་འོང་།
- [Taira ལས་ བརྟག་དཔྱད་དྲ་རྒྱ XOR ལེན་ནི](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ནང་ཡོད་པའི་ ཐད་ཀར་ལག་ལེན་འཐབ་ཚུགས་པའི་ `taira_faucet_claim.py` འདི་ ཞབས་ཏོག་ལེན་མི རིམ་སྒྲིག གི་སྦོ་ལོགས་ཁར་བཞག།

## རིམ་པ་ཚུ་ {#steps}

### 1. གྲ་སྒྲིག་འབད་ནི་ལས་ འཚོ་བ་མེད་པར་སྡོད་ནི་ {#_1-separate-liveness-from-readiness}

`/livez` འདི་ ཚིག་ཡིག་གསལ་པོ་བྱ་རིམ་-སྲོག་ལྡན་འཚོལ་ཞིབ་ཅིག་ཨིན། `/status`, `/health`, དང་ `/readyz` གིས་ JSON སླར་ལོག་འབདཝ་ཨིན། གཡོག་བཀོལ་བའི་མཐུད་མཚམས་ཅིག་གིས་ དགོས་མཁོའི་ཡན་ལག་རིམ་ལུགས་ཅིག་བཀག་བཞག་པའི་སྐབས་ གྲ་སྒྲིག་འཚོལ་ཞིབ་ཚུ་ལས་ ཁྲིམས་མཐུན་ཐོག་ལས་ `503` སླར་ལོག་འབད་ཚུགས།

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

ལས་སྦྱོར་འདི་གིས་ལན་བཏབ་མི་བཏུབ་ག་ ཐག་བཅད་ནི་ལུ་རྐྱངམ་ཅིག་ `/livez` ལག་ལེན་འཐབ། འགྲུལ་སྐྱོད་འཛུལ་སྤྱོད་ཀྱི་དོན་ལུ་ `/readyz` ལག་ལེན་འཐབ་སྟེ་ `503` འདི་ བཀག་ཆ་སྦེ་ མ་བརྩི་བའི་ཧེ་མ་ དེ་གི་ JSON བཀག་ཆ་འབད་མི་ཁ་གསལ་ཚུ་ བརྟག་ཞིབ་འབད།

### 2. མི་མང་གི་བརྟག་དཔྱད་ཚུ་ འགོ་འདྲེན་འཐབ་ནི། {#_2-run-the-public-diagnostics}

ཞིབ་དཔྱད་འདི་ལྷག་རྐྱངམ་ཅིག་ཨིནམ་དང་ མིང་རྟགས་བཀོད་མི་རིམ་སྒྲིག་འདི་མངོན་གསལ་མི་འབད།

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

དྲུང་འཚོ་གྱིས་ DNS, TLS, ལྕགས་ཐག་ ཡང་ན་ མཐའ་མཇུག་གི་ཐིག་ཁྲམ་ཚུ་ སྐྱོན་ཤོར་ཡོད་པའི་ སྙན་ཞུ་རྐྱབ་པའི་སྐབས་ འཕྲོ་མཐུད་དེ་ ཡིག་འབྲུ་འབྲི་མི་དགོ་ ཡོངས་བསྡོམས་ཀྱི་གྲལ་རིམ་འདི་ དུས་ཡུན་ཐུང་ཀུ་ཅིག་ཨིན། སྒུག་སྡོད་ཞིནམ་ལས་ སྲིད་བྱུས་ཚད་འཛིན་འབད་ཐོག་ལས་ ལོག་སྟེ་རང་ བརྟག་དཔྱད་འབད་ཚུགས།

### 3. Taira རྩིས་ཐོ་ ID གསང་ཡིག་མ་བསྐྲུན་པར་བཏོན་གཏང་། {#_3-derive-the-taira-account-id-without-printing-a-secret}

གཞི་སྒྲིག་ནང་ལས་ མི་མང་གི་ལྡེ་མིག་རྐྱངམ་ཅིག་ ཀློག་ཞིནམ་ལས་ Taira I105 གི་ཡིག་གཟུགས་དང་གཅིག་ཁར་ ཨེབ་གཏང་འབདཝ་ཨིན། `[account].domain` གྱི་གོང་ཚད་འདི་ རུ་ཊི་འབད་ནིའི་དོན་ལས་ཨིན། དེ་གིས་རྩིས་ཐོ་ ID གི་ཡན་ལག་མེདཔ།

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

བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་ལན་འདེབས་འདི་ འཐུས་རྒྱུ་དངོས་ངེས་ཚིག་གི་དོན་ལུ་ བདེན་པ་གི་འབྱུང་ཁུངས་ཨིན། ཡོངས་འབྲེལ་གཞན་མི་ཅིག་ལས་ ཡང་ན་ གཡོག་བཀོལ་རྙིངམ་ཅིག་ལས་ ཨའི་ཌི་འདྲ་བཤུས་རྐྱབ་ནིའི་ཚབ་ལུ་ སླར་ལོག་འབད་ཡོད་པའི་ Base58 ID འདི་བཞག།

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

ལྷག་ལུས་འདི་ མཐོ་ཤོས་སྐར་མ་གཅིག་གི་རིང་ལུ་ འོས་འདེམས་འབད། མ་དངུལ་གྱི་ཚོང་འབྲེལ་འདི་མ་མཐོང་པའི་ཧེ་མ་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་འདི་གིས་ `202 Accepted` སླར་ལོག་འབད་ཚུགས།

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

`gas_asset_id` ཌེ་བི་ཊཱནསི་གི་རྩིས་ཐོ་ཨིན། `--fee-payer authority` ཌེ་བིཊཱནའི་རྟགས་མཚན་གྱིས་གདམ་ཁ་འབད་ཡོདཔ་ད་ CLI གིས་ ཐོ་བཀོད་མ་ཚར་བའི་ཧེ་མར་ དངུལ་ཕོགས་ཀྱི་ཚིག་ཡིག་ཅིག་ཐོབ་ཡོདཔ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

དྲན་ཐོའི་བཀོད་རྒྱ་ཅིག་བཙུགས་ཞིནམ་ལས་ JSON མཐུན་སྒྲིག་གྲུབ་འབྲས་དྲན་ཐོ་བཞག་ཞིནམ་ལས་ འཇུག་སྤྱོད་འབད་ཡོད་པའི་མཐའ་མཇུག་ལུ་སྒུག་སྡོད། `--no-wait` བཏོན་བཏང་མི་འདི་གིས་ཡང་ འགོ་ཐོག་བཙུགས་མི་འདི་ ངེས་གཏན་གྱི་དོན་ལུ་ བསྒུག་བཅུགཔ་ཨིན། གསལ་ཏོག་ཏོ་གནས་ཚད་ལྷག་མི་འདི་གིས་ མཐའ་མཇུག་ལས་སྦྱོར་གྱི་མདོང་ལམ་གནས་སྟངས་འདི་བདེན་ཁུངས་བསྐྱལཝ་ཨིན།

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

མཐའ་མཇུག་བརྡ་བཀོད་འདི་ བརྗེ་སོར་འདི་ སྔོན་སྒྲིག་ `Applied` ཊར་མི་ནཱལ་གནས་སྟངས་ལུ་ལྷོད་པའི་ཤུལ་ལས་རྐྱངམ་ཅིག་ མཐར་འཁྱོལ་འབྱུང་འོང་། བརྟག་དཔྱད་སྒྲུབ་བྱེད་ནང་ ཧ་ཤི་བཞག། སྒེར་གྱི་ལྡེ་མིག་ཡང་ན་ མཁོ་སྤྲོད་རིམ་སྒྲིག་ཆ་ཚང་འདི་ དེ་དང་གཅིག་ཁར་ ནམ་ཡང་ གསོག་འཇོག་མ་འབད།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `/livez` གིས་ JSON དྲིཝ་ད་ `406` སླར་ལོག་འབདཝ་ཨིན་ ག་ཅི་འབད་ཟེར་བ་ཅིན་ མཇུག་སྣོད་དེ་ `text/plain` ཨིན། གོང་ལུ་སྟོན་ཡོད་དོ་བཟུམ་སྦེ་ `Accept: text/plain` གཏང་།
- `/health` ཡང་ན་ `/readyz` གིས་ `503` དང་ `/livez` ལཱ་འབད་བའི་སྐབས་ལུ་ཡང་ འཕྲུལ་ཆས་ལྷག་བཏུབ་པའི་བཀག་ཆ་འབད་མི་དང་གཅིག་ཁར་ `/status` སླར་ལོག་འབད་འོང་། བཀག་ཆ་འབད་མི་འདི་ བཅོ་ཁ་རྐྱབ་ནི་ཡང་ན་བསྒུག་སྡོད། ལྡེ་མིག་ཚུ་བསྐྱར་བཟོ་འབད་མི་འདི་གིས་ མཐུད་མཚམས་གྲ་སྒྲིག་འདི་བསྒྱུར་བཅོས་མི་འབད།
- བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་ `502` དུས་ཚོད་རྫོགས་མི་ ཡང་ན་ ལཱ་གི་བདེན་ཁུངས་རྙིངམ་གི་ གཞི་རྟེན་འདི་ མི་མང་ཞབས་ཏོག་འཐུས་ཤོར་ཅིག་ཨིན། མགུ་ཐོམ་གསརཔ་ཅིག་འབག་འོང་ཞིནམ་ལས་ ཤུལ་ལས་ལོག་སྟེ་འབད་རྩོལ་བསྐྱེད།
- I105 སྔོན་སྒྲིག་འཛོལ་བ་འདི་གིས་ མི་མང་ལྡེ་མིག་འདི་ གསལ་སྡུད་འཛོལ་བ་དང་གཅིག་ཁར་ ཨེན་ཀོ་ཌི་འབད་ཡོདཔ་སྦེ་ཨིན། `iroha tools address convert --profile taira` ལོག་གཡོག་བཀོལ།
- འཐུས་-ཚིག་བརྗོད་བཀག་ཆ་འབད་མི་འདི་ སྤྱིར་བཏང་ལུ་ དབང་འཛིན་ལུ་ མ་དངུལ་མ་བྱིན་མི་དང་ འཐུས་རྒྱུ་དངོས་མེ་ཊ་ཌེ་ཊ་འདི་ རྙིངམ་འགྱོ་མི་ ཡང་ན་ འཐུས་སྤྲོད་མི་གསལ་ཏོག་ཏོ་ཅིག་ སེལ་འཐུ་མ་འབད་མི་ལུ་གོཝ་ཨིན།
- ཐོ་བཀོད་, བཏོན་ནི, ཡང་ན་མིང་གནས་འཛིན་སྐྱོང་འདི་ སྔོན་བརྟག གིས་ གྲུབ་འབྲས་ཐོབ་པའི་ཤུལ་ལས་ཡང་མ་བཏུབ་ཨིན། འདི་བཟུམ་གྱི་ལཱ་ཚུ་གི་དོན་ལུ་དམིགས་བསལ་ ལག་བསྟར་མཉེན་ཆས ངོས་ལེན་ཚུ་ དགོཔ་ཨིན། Taira ཐོབ་ཐངས་མ་བྱིན་པའི་སྐབས་ལུ་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཁ་ཐུག་གི་དྲ་རྒྱ་ནང་ལུ་ བསྐྱར་ཞིབ་འབད་ཚུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [Taira CLI ནད་གཞི་བརྟག་དཔྱད་དང་ ཀ་ནའི་རི་གི་འབྱུང་ཁུངས་ཚུ་ པིན་ཌི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [ཟད་འགྲོ་བཏང་མི་འཐུས་གདམ་ཁ་དང་ CLI བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ ཁས་བླངས་ཀྱི་འབྱུང་ཁུངས་ — གཏན་སྦྱར་ཡོད་པའི Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)།
- [Taira རྩིས་ཐོ་དང་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གི་ལམ་སྟོན་](/dz/get-started/sora-nexus-dataspaces.md)
- [སྲོལ་འཛིན་གྱི་སྒྲིག་གཞི་](/dz/guide/configure/client-configuration.md)
- [ལས་སྣ་ཚུ་](/dz/blockchain/transactions.md)
