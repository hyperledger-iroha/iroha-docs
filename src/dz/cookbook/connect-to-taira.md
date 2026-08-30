---
translation_locale: dz
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 263e058a0877e1a3c48b6514b127bc56022e3d244284e0b72881743a4aee0f58
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira ལུ་མཐུད་སྦྲེལ་འབད་ {#connect-to-taira}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ལྷོད་ཚུགསཔ་སྦེ་ངོས་ལེན་འབད་ཞིནམ་ལས་ ས་གནས་ཀྱི་མགྲོན་པ་ཚུ་གི་སྒྲིག་གཞི་ནང་ལས་ ཀ་ནོ་ནི་ཀཱན་གྱི་རྩིས་ཁྲ་ I105 ID བཏོན་ཏེ་ ཐོ་བཀོད་འབད་མི་འདི་ལུ་ testnet XOR ལག་ལེན་འཐབ་ཐོག་ལས་ དངུལ་ཕོགས་བྱིན་ཞིནམ་ལས་ རིན་བསྡུར་གྱི་རིན་ཐོ་བཀོད་འབད་མི་ Canary ཌོག་ཊར་གཅིག་ ཕུལ་དགོ། འ་ནི་ལས་ཀ་འདི་གིས་ Minamoto ལུ་ ཡིག་འབྲུ་རྩ་ལས་རང་མི་བཏང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་དེ་གི་ཤུལ་ལས་དང་ ད་ལྟོའི་ `iroha` དང་ `kagami` བའི་ནར་ཚུ་
- `taira.client.toml` བཟོ་སྐྲུན་འབད་ཡོདཔ་ཨིན། Taira ལྕགས་ཐག་དང་མཐའན་མཇུག་གི་ཐིག་ཁྲ། རྩིས་སྤྲོད་ཡིག་སྣོད་དང་ དམིགས་གཏད་ཅན་གྱི་ བརྟག་དཔྱད་ཧིང་ལྡེ་མིག་ཅིག་གིས་བཟོ་བཀོད་འབདཝ་ཨིན། [འདི་ལག་ལེན་འཐབ་ཞིནམ་ལས་ Taira ཌའི་ལོག་གཞི་སྒྲིག་](/dz/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)བཟོ་སྟེ་ གཞི་རྟེན་འཛིན་སྐྱོང་མ་འཐབ་པར་སྡོད་འོང་།
- [Get Testnet ལས་ XOR ལུ་ལག་ལེན་འཐབ་ནིའི་དོན་ལུ་ གྲ་སྒྲིག་འབད་ཡོད་པའི་ `taira_faucet_claim.py`འདི་ Taira](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ལུ་བཞག་ཡོདཔ་ཨིན། འདི་གིས་ client config ཀྱི་སྦོ་ལོགས་ཁར་གནས་འོང་།

## རིམ་པ་ཚུ་ {#steps}

### 1. གྲ་སྒྲིག་འབད་ནི་ལས་ འཚོ་བ་མེད་པར་སྡོད་ནི་ {#_1-separate-liveness-from-readiness}

`/livez` དྭངས་གསལ་ཡིག་འབྲུ་ནང་ལུ་ བྱ་རིམ་གྱི་གནས་ཚད་བརྟག་དཔྱད་འབདཝ་ཨིན། `/status`, `/health`, དང་ `/readyz` སླར་ལོག་འབདཝ་ཨིན། JSON. འགྲུལ་བསྐྱོད་འབད་ཐངས་འདི་ ཁྲིམས་མཐུན་སྦེ་ལོག་འོང་ཚུགསཔ་ཨིན། `503` དགོས་མཁོ་ཅན་གྱི་ སྣུམ་འཁོར་འོག་རིམ་ལུགས་ཅིག་བཀག་པའི་སྐབས་ གྲ་སྒྲིག་གི་བརྟག་དཔྱད་འབད་ཐངས་ལས་ཨིན།

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` ལག་ལེན་འཐབ་ནི་དེ་ བྱ་རིམ་འདི་སེལ་འཐུ་འབད་ཡོདཔ་ཨིན་ན་མེན་ནའི་ཐག་བཅད་ནིའི་དོན་ལུ་རྐྱངམ་གཅིག་ཨིན། འགྲུལ་ལམ་ནང་འཛུལ་ནིའི་དོན་ལས་ `/readyz` ལག་ལེན་འཐབ་ནི་དང་ JSON སྦྲེལ་ཐིག་ཚུ་ བརྟག་ཞིབ་མ་འབད་བའི་ཧེ་མར་ `503` འདི་ སེལ་མ་ཚུགསཔ་ཅིག་སྦེ་ལག་ལེན་འཐབ་དགོ།

### 2. མི་མང་གི་བརྟག་དཔྱད་ཚུ་ འགོ་འདྲེན་འཐབ་ནི། {#_2-run-the-public-diagnostics}

འ་ནི་བརྟག་དཔྱད་འདི་ ཀློག་རྐྱངམ་ཅིག་ཨིནམ་དང་ ལག་ལེན་རྟགས་མ་བཟོ་མི་ཚུ་ བཏོན་མི་ཚུགས།

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

དྲུང་འཚོ་གྱིས་ DNS, TLS, ལྕགས་ཐག་ ཡང་ན་ མཐའ་མཇུག་གི་ཐིག་ཁྲམ་ཚུ་ སྐྱོན་ཤོར་ཡོད་པའི་ སྙན་ཞུ་རྐྱབ་པའི་སྐབས་ འཕྲོ་མཐུད་དེ་ ཡིག་འབྲུ་འབྲི་མི་དགོ་ ཡོངས་བསྡོམས་ཀྱི་གྲལ་རིམ་འདི་ དུས་ཡུན་ཐུང་ཀུ་ཅིག་ཨིན། སྒུག་སྡོད་ཞིནམ་ལས་ སྲིད་བྱུས་ཚད་འཛིན་འབད་ཐོག་ལས་ ལོག་སྟེ་རང་ བརྟག་དཔྱད་འབད་ཚུགས།

### 3. Taira རྩིས་ཁྲ་ ID གསང་ཡིག་མ་བསྐྲུན་པར་བཏོན་གཏང་། {#_3-derive-the-taira-account-id-without-printing-a-secret}

གཞི་སྒྲིག་ནང་ལས་ མི་མང་གི་ལྡེ་མིག་རྐྱངམ་ཅིག་ ཀློག་ཞིནམ་ལས་ Taira I105 གི་ཡིག་གཟུགས་དང་གཅིག་ཁར་ ཨེབ་གཏང་འབདཝ་ཨིན། `[account].domain` གྱི་གོང་ཚད་འདི་ རུ་ཊི་འབད་ནིའི་དོན་ལས་ཨིན། དེ་གིས་རྩིས་ཁྲ་ ID གི་ཡན་ལག་མེདཔ།

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

ཐོན་སྐྱེད་འདི་ domainless canonical I105 Addressཨིན། མིང་དཔེར་ན་ `wallet@payments.universal` འདི་ཚུ་ aliases ཨིནམ་དང་ strict account fields ནང་ ལག་ལེན་འཐབ་པའི་ཧེ་མ་ སེལ་འཐུ་འབད་དགོཔ་ཨིན།

### 4. ད་ལྟོའི་ Taira རིན་བསྡུར་ཁྲལ་གྱི་ རྒྱུ་དངོས་ཚུ་ ཐོབ་བརྗོད་བཀོད་དགོ། {#_4-claim-the-current-taira-fee-asset}

ཐབ་ཤིང་གི་ལན་འདི་ fees asset definition གི་བདེན་པའི་འབྱུང་ཁུངས་ཨིན། བསྒྱུར་བསྐྱངས་འབད་ཡོད་པའི་ Base58 ID འདི་ ID གྱི་ཚབ་ལུ་ གཞན་མི་དྲ་ལམ་ལས་ ཡང་ན་ ཨེབ་ཐག་རྙིངམ་ནང་ལས་ བཏོན་གཏང་དགོ།

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

ཟད་འགྲོ་དེ་ དུས་ཡུན་སྐར་མ་༡ དེ་ཅིག་གི་རིང་ བརྟག་ཞིབ་འབད་ཚུགས། དངུལ་འབྲེལ་གྱི་ཞལ་འདེབས་འདི་མཐོང་ཚུགས་པའི་ཧེ་མར་ འབུབ་འདི་ `202 Accepted` ལོག་གཏང་ཚུགས།

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

`gas_asset_id` ཌེ་བི་ཊཱནསི་གི་རྩིས་ཁྲ་ཨིན། `--fee-payer authority` ཌེ་བིཊཱནའི་རྟགས་མཚན་གྱིས་གདམ་ཁ་འབད་ཡོདཔ་ད་ CLI གིས་ ཐོ་བཀོད་མ་ཚར་བའི་ཧེ་མར་ དངུལ་ཕོགས་ཀྱི་ཚིག་ཡིག་ཅིག་ཐོབ་ཡོདཔ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

ཐོ་བཀོད་ཐོ་ཡིག་ནང་བཀོད་རྒྱ་བཙུགས་ཏེ་ JSON བཏང་བཞག་ཞིནམ་ལས་ Applied finality བར་ན་སྒུག་སྡོད་འབད་ཐབས། ཁྱོད་ཀྱིས་ `--no-wait` བྱིན་པ་ཅིན་ འགོ་ཐོག་གི་ཡིག་ཆ་འདི་ confirmation བར་ན་བསྒུགས་སྡོད་དགོཔ་ཨིན། མངོན་གསལ་ཅན་གྱི་གནས་གོང་བཀླག་མི་དེ་གིས་ pipeline གི་མཐའ་མའི་གནས་སྟངས་ལུ་ གསལ་སྟོན་འབདཝ་ཨིན།

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

མཐའན་མཇུག་གི་བཀའ་རྒྱ་འདི་ ཌེ་པཱོལ་ `Applied` གི་མཐའ་མཚམས་གནས་སྟངས་ལུ་ལྷོད་པའི་ཤུལ་ལས་རྐྱངམ་གཅིག་ གྲུབ་འབྲས་ཐོན་ཡོདཔ་ཨིན། བརྟག་དཔྱད་ཀྱི་རྟགས་མཚན་ནང་ ཧེཤ་བཞག་ནི། སྒེར་གྱི་ལྡེ་མིག་དང་ ཡང་ཅིན་ ཡོངས་ཁྱབ་ཡིག་ཚང་བཟོ་སྒྲིག་དེ་ འདི་དང་གཅིག་ཁར་ གཏང་མ་ཚུགས།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `/livez` གིས་ `406` སླར་ལོག་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ JSON འཚོལ་དགོ་པ་ཅིན་ འདི་མཇུག་གི་ཐོ་བཀོད་དེ་ `text/plain` ཨིན་པས་ ཡར་ལུ་སྟོན་དོ་བཟུམ་སྦེ་ `Accept: text/plain` བཏང་དགོ།
- `/health` ཡང་ན་ `/readyz` གིས་ `503` བཏབ་ནི་འབད་ཚུགས། འདི་ཡང་ `/livez` དང་ `/status` ཚུ་ལཱ་འབད་སྡོད་པའི་བར་ན་ འཕྲུལ་ཆས་གིས་ཀློག་བཏུབ་པའི་ལྡེ་མིག་ལག་ལེན་འཐབ་ཐོག་ལས་ཨིན། དེ་གི་དོན་ལུ་ སེལ་འཐུ་འབད། ཡང་ན་ སྒུག་སྡོད་; སླར་ལོག་ལྡེ་མིག་ཚུ་གིས་ ལྡེ་མིག་གི་གྲ་སྒྲིག་ལུ་བསྒྱུར་བཅོས་མི་འབད་འོང་།
- `502` ཝེཊི་མོའུཌ་ (timeout) ཡང་ན་ ལཱ་འབད་ཐངས་མ་མཐུན་པའི་ཨེན་ཀ་ར་ཚུ་ ཞབས་ཏོག་ལྷན་ཁག་ནང་ འཛོལ་མེདཔ་ཨིན། རིག་རྩལ་གསརཔ་འཚོལ་ཞིནམ་ལས་ ལོག་ལྟབ་སྦེ་ བརྟག་དཔྱད་གནང་།
- I105 སྔོན་སྒྲིག་གི་འཛོལ་བ་གིས་ མི་སེར་གྱི་ལྡེ་མིག་འདི་ ཀི་པིཌ་དང་འབྲེལ་བའི་ཡིག་གཟུགས་མ་བདེཝ་སྦེ་བཟོ་ཡོདཔ་ཨིན། སླར་ལོག་འབད་ `iroha tools address convert --profile taira`
- རིན་བསྡུར་ཁྲལ་མ་བཏུབ་པའི་དོན་ལས་ དབང་འཛིན་གྱིས་ མ་དངུལ་མ་བྱིན་པར་ཡོདཔ་དང་ རིན་བསྡུའི་རྒྱུ་དངོས་ཀྱི་ གནད་སྡུད་ཚུ་ དུས་རྒྱུན་མེདཔ་ ཡང་ན་ རིན་བསྡོམས་ཁྲལ་སྤྲོད་མི་ གསལ་ཏོག་ཏོ་སྦེ་ བཙག་འཐུ་འབད་མ་ཚུགས་ཟེར་ཨིན་མས།
- ཐོ་བཀོད་, minting, ཡང་ན་མིང་གནས་འཛིན་སྐྱོང་འདི་ Canary གིས་ གྲུབ་འབྲས་ཐོབ་པའི་ཤུལ་ལས་ཡང་མ་བཏུབ་ཨིན། འདི་བཟུམ་གྱི་ལཱ་ཚུ་གི་དོན་ལུ་དམིགས་བསལ་ runtime ངོས་ལེན་ཚུ་ དགོཔ་ཨིན། Taira ཐོབ་ཐངས་མ་བྱིན་པའི་སྐབས་ལུ་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཁ་ཐུག་གི་དྲ་རྒྱ་ནང་ལུ་ བསྐྱར་ཞིབ་འབད་ཚུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [Taira CLI ནད་གཞི་བརྟག་དཔྱད་དང་ ཀ་ནའི་རི་གི་འབྱུང་ཁུངས་ཚུ་ པིན་ཌི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [ཟད་འགྲོ་བཏང་མི་འཐུས་གདམ་ཁ་དང་ CLI བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ ཁས་བླངས་ཀྱི་འབྱུང་ཁུངས་](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)།
- [Taira རྩིས་ཁྲ་དང་ ཐབ་ཤིང་གི་ལམ་སྟོན་](/dz/get-started/sora-nexus-dataspaces.md)
- [སྲོལ་འཛིན་གྱི་སྒྲིག་གཞི་](/dz/guide/configure/client-configuration.md)
- [ལས་སྣ་ཚུ་](/dz/blockchain/transactions.md)
