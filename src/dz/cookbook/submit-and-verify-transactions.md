---
translation_locale: dz
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ཚོང་འབྲེལ་ཚུ་ བཏང་ནི་དང་ བདེན་དཔྱད་འབད་ནི། {#submit-and-verify-transactions}

## གྲུབ་འབྲས་ {#outcome}

Taira འབྲེལ་གཏད་འདི་ སྔོན་འགོག་འབད་ཞིནམ་ལས་ ཟད་འགྲོ་བཏང་གི་ཚིག་ཡིག་ཅིག་ ཆ་འཇོག་འབད་ཞིནམ་ལས་ ཐོ་བཀོད་དང་ བཏང་ དེ་ལས་ ལག་ལེན་མཇུག་བསྡུ་བའི་དོན་ལུ་ སྒུག་སྟེ་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་རྩིས་ཁྲ་དེ་ ཧེཤ་ཐོག་ལས་ བརྟག་ཞིབ་འབདཝ་ཨིན།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `taira.tx-metadata.json`དང་ `TAIRA_ACCOUNT_ID`གིས་དངུལ་རྒྱབ་སྐྱོར་འབད་ཡོད་པའི་ `taira.client.toml` དེ་ལས་ [གིས་ བཟོ་སྐྲུན་འབད་མི་ འབྲེལ་མཐུད་དེ་ར་ Taira](./connect-to-taira.md) ལུ་ཡོདཔ་ཨིན།
-  current `iroha` CLI དང་ `jq`.
- Taira ལག་ལེན་འཐབ་མ་བཏུབ་པའི་རྟགས་མཚན་འདི་ ལག་ལེན་འཐབ་མ་དགོ་ ཡང་ན་ Minamoto ལུ་བཀའ་བཀོད་ཚུ་འབྲི་དགོ།

## རིམ་པ་ཚུ་ {#steps}

### 1. མཐའ་མཇུག་གི་གནས་ཚད་དང་ དབང་ཚད་དང་ འཐུས་ཚུ་ སྔོན་འགོག་འབད་དགོ། {#_1-preflight-the-endpoint-authority-and-fee-balance}

དང་པ་གྲལ་ཐིག་གི་གློག་བརྙན་འདི་ ཀློག་ཞིནམ་ལས་ གཞུང་དབང་གི་འཐུས་དངུལ་ཀྲམ་དེ་མཐོང་ཚུགསཔ་སྦེ་ བརྟག་ཞིབ་འབད་ འབྲེལ་མཐུད་བཟོ་ཐབས་ལུ་ བཟོ་སྐྲུན་འབད་མི་ metadataནང་ལས་ Base58 asset-definition ID ཀློག་ပါ။

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

རྩིས་ཁྲ་དང་གླ་འཐུས་ཀྱི་ལྷག་ལུས་མེད་པ་ཅིན་ བཀག་བཞག་ནི། བཀའ་རྒྱ་ལག་ལེན་ཅན་ཅིག་གིས་ གླ་འཐུས་སྤྲོད་མ་ཚུགས་པའི་སྐབས་ འཛུལ་ཞུགས་འབད་མ་ཚུགས།

### ༢༽ ཨེབ་གཏང་དང་རྟགས་བཀོད་ དེ་ལས་ལན་རྐྱབས། {#_2-quote-sign-and-submit-once}

CLI གིས་འཐུས་སྤྲོད་ལེན་གྱི་དོན་ལུ་ ཐོ་བཀོད་མ་འབད་མི་ ཁེ་ཕན་ཅ་ཆས་ཚུ་བཏང་ཞིནམ་ལས་ ངོས་ལེན་འབད་ཡོད་པའི་ སྐྱིན་འགྲུལ་གི་དམིགས་དོན་འདི་ གླ་ཆའི་ནང་བསྡུམས་ཏེ་ ངོས་ལེན་འབདཝ་ཨིན། JSON བཟོ་རིམ་གྱིས་ གླ་ཆུའི་ཧེཤ་དང་ ངོས་ལེན་ཅན་གྱི་གླ་ཆའི་གནས་སྟངས་ དེ་ལས་ ངོས་ལེན་འབད་མི་གླ་ཆེའི་གནས་ཚད་ཚུ་ གཅིག་ཁར་ལོག་གཏངམ་ཨིན།

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

འདི་ནང་ལུ་ `--no-wait` ལག་ལེན་འཐབ་མ་དགོ་ བཀའ་རྒྱ་འདི་གིས་ གྲུབ་འབྲས་ཐོན་པའི་ཐོག་ལས་ བཏང་བའི་ཧེ་མར་ ཆ་འཇོག་གྲུབ་པའི་དོན་ལུ་སྒུག་སྡོད་འོང་།

### 3. མཐའ་མཇུག་གི་སྣུམ་འཁོར་ལམ་གྱི་གནས་སྟངས་ལུ་སྒུག་དགོ། {#_3-wait-for-terminal-pipeline-state}

HTTP ངོས་ལེན་ ཡང་ན་གྲལ་ཐིག་འཛུལ་ལས་ གྲུབ་འབྲས་བཏོན་ནིའི་ཚབ་ལུ་ ཐོ་བཀོད་ཅན་གྱི་གནས་གོང་གི་རོགས་རམ་འདི་ལག་ལེན་འཐབ་ཨིན། `--wait` དང་གཅིག་ཁར་ ཉེན་སྲུང་ལྡན་པའི་ལམ་འགྲུལ་གྱི་ཁྱབ་ཚད་འདི་ རང་བཞིན་གྱིས་གདམ་ཁ་འབད་ཡོདཔ་ད་ སྔོན་སྒྲིག་དམིགས་གཏད་དེ་ Applied finality ཨིན་པས།

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected`དང་ `Expired`ཚུ་ མཐའ་མཇུག་གི་འཛོལ་བ་ཨིནམ་ལས་ བསྐྱར་གསོ་འབད་ཚུགས་པའི་ གྲུབ་འབྲས་མེད་པའི་ མངོན་གསལ་ཚུ་ཨིན། ཕྱིར་ཚོང་འདི་མ་འགྱུར་གོང་ལུ་ གནད་དོན་དེའི་རྒྱུ་མཚན་འདི་ ཡིག་ཐོག་བཀོད་དགོ།

### 4. སྦྲགས་ཡོད་པའི་ཚོང་འབྲེལ་ཚུ་ ཀློག་ཐེངས། {#_4-read-the-stored-transaction}

pipeline status གིས་ processing མཇུག་བསྡུ་ཡོདཔ་ཨིན་ན་མེན་ཟེར་བཀའ་ལན་གནངམ་ཨིན། transaction query གིས་ admitted transaction འདི་ same hash གྱི་འོག་ལུ་བཞག་ཡོད་མེད་ བརྟག་ཞིབ་འབདཝ་ཨིན།

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

བརྟག་ཞིབ་འབད་མི་དེ་ ཨང་གཉིས་པ་ཅིག་ཨིནམ་ལས་ བལྟ་བཤལཔ་རྐྱངམ་གཅིག་གིས་ ཀློག་བཏུབ་ཨིན། དེ་གིས་ ཆུ་སྣོད་མཇུག་བསྡུ་ནི་ལུ་ ཡུདཔ་ཐེངས་ཅིག་གི་རྒྱབ་ཁར་སྡོད་ཚུགས།

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

གནས་སྟངས་བསྒྱུར་བཅོས་ཀྱི་བསླབ་བྱ་གི་དོན་ལུ་ བསྒྱུར་བཅོས་འབད་ཡོད་པའི་དངོས་པོ་གི་དྲི་བ་འདི་ མཇུག་བསྡུ་དགོ། [Metadata](./metadata.md), [Fungible assets](./fungible-assets.md)དང་ [NFTs](./nfts.md) བཟོ་ཐོ་བཀོད་ཚུ་ནང་ གནས་རིམ་གྱི་ཤུལ་ལུ་ ཀློག་ཐོ་བཀོད་ཀྱི་གྲངས་ཡང་ཡོདཔ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

ཐོ་བཀོད་གསུམ་ཆ་རང་ལུ་ ཧེཤ་གཅིག་གུ་མཐུན་ཡོདཔ་དང་ བརྟག་ཞིབ་འབད་མི་དེ་ ད་ལྟོའི་གནས་སྟངས་ཅིག་ སྙན་ཞུ་མ་འབད་བར་ཡོད་མེད་བརྟག་དཔྱད་འབད།

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

ཐོ་བཀོད་ཡིག་སྣེ་ལེན་དང་ མཐའ་མའི་གནས་ཚད་འདི་ བརྟག་དཔྱད་ཀྱི་དཔང་རྟགས་སྦེ་བཞག་དགོ། དེ་ཚུ་ནང་ མི་མང་གི་ཚོང་འབྲེལ་གྱི་ གནད་དོན་ཡོད་མ་གཏོགས་ མཚམས་འཇོག་གི་ལྡེ་མིག་མེདཔ།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- HTTP `202` ཡང་ན་གྲལ་ཐིག་གི་གནས་སྟངས་འདི་ འཛུལ་ཞུགས་རྐྱངམ་ཅིག་ཨིན་ཟེར་ཁུངས་བཀལཝ་ཨིན། ལག་ལེན་ཅན་གྱི་ གནས་སྟངས་, ཆ་མེད་གཏང་མི་ གནས་སྟངས་, དུས་ཡུན་མཇུག་མ་བསྡུ་ཚུན་ཚོད་ ཐོ་བཀོད་འབད་མི་ གནས་སྟངས་དེ་ བསྐྱར་ཞིབ་འབད་དགོ་ཟེར་ཨིན་པས།
- གལ་སྲིད་ བཏང་ནིའི་དུས་ཚོད་འདི་ ཧེཤ་ཅིག་སླར་ལོག་འབད་ཞིནམ་ལས་ བཏང་ཚར་བ་ཅིན་ ཕྱིར་ཚོང་མ་རྐྱབ་པའི་ཧེ་མར་ ཧེཤ་དེ་དྲི་འབད། མིག་ཏོ་ཞརཝ་བསྐྱར་དུ་ བཏང་ནི་འདི་གིས་ ཨེབ་གཏང་དང་མིང་ཐོ་བཀོད་འབད་ཡོད་པའི་ ཁེ་ཕན་ཐོན་སྐྱེད་གསརཔ་བཟོཝ་ཨིན།
- ཟད་འགྲོ་བཏབ་མ་གཏང་པའི་ཧེ་མར་ དངུལ་ཕོགས་སྤྲོད་ནི་དེ་ ཆ་མེད་གཏང་ཚུགས། `--fee-payer authority`, `gas_asset_id`, ཁྲི་འཛིན་གྱི་དངུལ་རྐྱང་དང་ འབྲེལ་བ་འབྱུང་ཐིག་ ID བརྟག་ཞིབ་འབད་དགོ།
- `Rejected` གིས་ སྤྱིར་བཏང་ལུ་ བཀའ་རྒྱ་ལག་ལེན་བསྟར་སྤྱོད་འབད་ནི་དང་ ངོས་ལེན་འབད་ནི་དང་འཐུས་སྤྲོད་ནི་ དེ་ལས་ ཡང་ཅིན་ གནས་སྟངས་ཉམས་མྱོང་མེདཔ་སྦེ་སྟོན་དོ་ཡོདཔ་ལས་ འཛིན་སྐྱོང་འཐབ་མ་ཚུགས་པའི་ཁུངས་ཅིག་ཨིནམ་ལས་ བརྒྱུད་འཕྲིན་བསྐྱར་བཅོས་འབད་ནིའི་ དཔའ་བཅམ་མི་དགོ་ཟེར་ཨིན་པས།
- བརྟག་ཞིབ་འབད་མི་ `404` Applied གི་ཤུལ་ལུ་ ཌའི་ལོག་ཨེབ་གཏང་འབད་ཚུགས། ཀློག་ཐེངསམ་བསྐྱར་དུ་བརྟག་དཔྱད་འབད། ཚོང་འབྲེལ་འདི་ ལོག་བཙུགས་མ་བཅུག།
- གལ་སྲིད་ ཁྱད་ལྡན་བཀོད་རྒྱ་ཅིག་གིས་ localnet བཟོ་སྐྲུན་འབད་རུང་ Taira གིས་ འདི་མ་བཏུབ་པ་ཅིན་ ཁྱོད་ཀྱིས་ Taira གི་བདེན་པའི་ཆོག་ཐམ་དང་ ཡང་ན་ མིང་གི་ས་སྟོང་གི་བཅའ་ཡིག་ཚུ་ཐོབ་ཚུགས། ས་གནས་ཀྱི་གྲུབ་འབྲས་འདི་གིས་ མི་མང་གི་དྲ་ལམ་ལུ་ དབང་ཚད་བྱིན་མི་ཚུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [ཚོང་འབྲེལ་གྱི་གནད་དོན་ཚུ་ བསྡུ་ལེན་འབད་ནི་དང་ དངུལ་ཕོགས་ཀྱི་བཅའ་ཡིག་ལག་ལེན་འཐབ་ནི་](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs) ལུ་ གཞི་བཙུགས་འབདཝ་ཨིན།
- [བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs) ལུ་ transaction confirmation testing
- [ལས་སྣ་ཚུ་](/dz/blockchain/transactions.md)
- [CLI ལམ་སྟོན་](/dz/get-started/operate-iroha-via-cli.md)
- [Torii ཚད་མཇུག་གི་ཐིག་ཁྲ།](/dz/reference/torii-endpoints.md)
