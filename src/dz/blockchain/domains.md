---
translation_locale: dz
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ས་ཁོངས་ཚུ་ {#domains}

Domain འདི་ `World` ནང་མིང་ཐོ་བཀོད་འབད་ཡོད་པའི་ namepaces གི་མིང་ཨིན། ད་ལྟོའི་ Iroha 3 ཌའི་ཊ་ མոդելནང་ལུ་ domain འདི་ its parent datapace ལུ་ཆ་བཞག་ཡོདཔ་ལས་ canonical identifierའདི་འདི་:

```text
domain.dataspace
```

དཔེར་ན་ `payments.universal` གིས་ `payments` ཌའི་ཊ་ས་པི་སི་ནང་ལུ་ `universal` ཌེ་ཊ་ས་བིཌ་གི་མིང་བཏགས་ནུག

## བཟོ་བཀོད་ {#structure}

ཐོ་བཀོད་འབད་མི་ `Domain` ནང་འཁོད་ནང་ལུ་:

- `id`: data space-qualified `DomainId` ཌེ་ཊ་ས་པི་ལེན
- `logo`: ཌོ་मेनརྟགས་མཚན་གི་དོན་ལུ་ གདམ་ཁ་རྐྱབ་མི་ `SoraFS` URI
- `metadata`: རང་འདོད་ཅན་གྱི་ལྡེ་མིག་གི་གོང་ཚད་ཀྱི་བརྡ་དོན་ཚུ་
- `owned_by`: ས་ཁོངས་དེ་གི་བདག་འཛིན་འཐབ་མི་རྩིས་ཁྲིད། སྤྱིར་བཏང་ལུ་ ས་ཁོངས་འདི་ ཐོ་བཀོད་འབད་མི་རྩིས་ཁྲི།

ཌོ་मेनཅིག་བཟོ་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་མི་ bootstrap ཁེ་ཕན་གྱི་ཁེ་རྒུད་འདི་ `NewDomain`. འདི་ནང་ལུ་ `id`, གདམ་ཁ་རྐྱབས། `logo`, དང་པ་ `metadata`. འགྲུལ་སྐྱོད་དུས་ཚོད་འདི་ བསྡུ་སྟེ་ཡོདཔ་ཨིན། `owned_by` སྤྱིར་བཏང་མགྲོན་པ་ཚུ་གིས་ ཐད་ཀར་དུ་ ཁེ་ཕན་གྱི་འགན་ཁུར་འདི་ བཏང་མི་ཚུགས།

## ཐོ་བཀོད་འབད་ {#registration}

སྤྱིར་བཏང་ domain བཟོ་སྐྲུན་ནང་ declarative alias setup flow ལག་ལེན་འཐབ་ཨིན། འདི་གིས་ SNS རིན་བསྡུར་, སྦྱིན་བདག་ལྕོགས་གྲུབ་, quotation guard, དང་ domain row འདི་ atomic `EnsureAlias` ཌའི་ལོག་ལག་ལེན་གཅིག་ནང་ལུ་བཞག་ཡོདཔ་ཨིན། `Register::Domain` གིས་ genesis/bootstrap ས་ཁུདཔ་ཅིག་སྦེ་ར་སྡོད་དོ་ཡོདཔ་ད་ `ledger domain` བཀའ་རྒྱ་འདི་གིས་ `register` གི་འོག་གི་བཀའ་རྒྱ་མེད་ཨིན།

SDK ཡང་ན་ འཛུལ་ཞུགས་ཞབས་ཏོག་དང་གཅིག་ཁར་ གསང་བ་མེད་པའི་ intent `AliasSetupPlanRequestV1` བཟོ་ཞིནམ་ལས་ CLI གི་འཆར་གཞི་འདི་ live state དང་ཕྱདཔ་ད་བཙུགས་ཏེ་ འཆར་གཞི་ངོ་མ་དེ་ ཕུལ་:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

དམིགས་གཏད་འདི་ `payments.universal` འདི་དང་ ཨང་གྲངས་ཀྱི་ གནད་སྡུད་ས་ཁོངས་དེ་དང་ I105 གི་ དམ་ཚིག་ཅན་གྱི་ ཇོ་བདག་དང་ ཁང་གླ་ཉོ་ནི་གི་དུས་ཡུན་ དེ་ལས་ ད་རེས་ནངས་པའི་ སྲིད་བྱུས་/སྤྲོད་ལེན་གྱི་གནས་གོང་སྲུང་བ་ཚུ་ ངོ་རྟགས་འབདཝ་ཨིན། འཆར་འགོད་པའི་མཇུག་ཐིག་འདི་ `POST /v1/aliases/setup/plan`ཨིན། འདི་ལོག་འགྱོ་བའི་འཆར་གཞི་དེ་ ལྕགས་ཐག་དང་ དབང་ཚད་དང་ མངའ་སྡེ་ དེ་ལས་ དུས་ཡུན་མཐའ་མ་ལུ་བཅའ་མར་གཏོགསཔ་ཨིན། ཌོ་मेनསེལ་འཐུ་འབད་མི་དེ་ཡང་ [`Unregister`](/dz/blockchain/instructions.md#un-register) ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

domain བཟོ་སྐྲུན་འབད་ནི་དང་སེལ་འཐུ་འབད་ནི་ལུ་ active runtime validator གི་འོག་ལུ་ appropriate domain-management permission དགོཔ་ཨིན། Domain metadata འདི་ [`SetKeyValue` དང་ `RemoveKeyValue`](/dz/blockchain/instructions.md#setkeyvalue-removekeyvalue) དང་གཅིག་ཁར་ ད་ལྟོའི་གནས་སྟངས་ནང་བཟོ་བཅོས་འབད་ཚུགས་དོ་ཡོདཔ་ཨིན།

## Taira ལུ་ བརྟག་དཔྱད་རྐྱབས། {#try-it-on-taira}

མི་མང་གི་ Taira བརྟག་དཔྱད་དྲ་ལམ་ནང་ལུ་ ད་རེས་མཐོང་ཚུགས་པའི་ ས་ཁོངས་ཚུ་ཐོ་འགོད་འབད་:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

མི་མང་གི་ལམ་ཐོ་ཡིག་འདི་ གནས་སྡུད་གནས་སྟངས་ཀྱི་ མིང་རྟགས་ལུ་ལོག་ mapping:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

ཌའི་ཊ་ས་པི་ལེན (data space) འདི་ མི་མང་གི་ལག་ལེན་དང་འབྲེལ་བ་མེད་མི་ ཡང་ན་ གཞི་རྟེན་ལམ་གྱི་རྒྱབ་ལས་ རྒྱབ་འགྱུརཝ་ཨིན་ན་ བརྟག་ཞིབ་འབད་ནིའི་དོན་ལུ་ ཨེབ་གོང་བཀའ་འདི་ ལག་ལེན་འཐབ་དགོ།

ཌོ་མེ་ནེསི་ གཞི་བཙུགས་འདི་ རྩིས་ཁྲ་སྤྲོད་ནི་གི་ཡིག་འབྲུ་ཨིན། ཁྱོད་ཀྱིས་དེ་ བརྟག་དཔྱད་མ་འབད་བ་ཅིན་ Taira, མཐུད་སྦྲེལ་འབད་ནིའི་འཕྲུལ་ཆས་འདི་ [Testnet བཏོན་ཐོབ། XOR འབད་ནི་ Taira](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) འདི་བཟུམ་སྦེ་ `taira_faucet_claim.py`, མཚའ་རྟགས་མ་བཙུགས་མི་ལུ་ མི་མང་གི་ལག་ལེན་ཐོག་ལས་ དངུལ་ཕོགས་སྤྲོད་ནི་ དེ་ལས་ ཟད་འགྲོ་རྩིས་ཚུ་ མཐུད་སྦྲེལ་འབད་ནི་:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

ཐད་ཀར་དུ་ བརྟག་དཔྱད་འབད་ཡོད་པའི་དྲ་ལམ་ནང་ ཁྱད་པར་ཅན་ ཌོ་मेनམིང་གི་དོན་གྱི་དམིགས་གཏད་བཟོ་ནི་ དེ་ལས་ Taira གི་གནས་སྐབས་ཀྱི་ སྲིད་བྱུས་དང་འཐུས་ཅན་གྱི་ རྒྱུ་དངོས་ཚུ་གི་ཐོ་ཡིག་སྲུང་བ་འདི་ལག་ལེན་འཐབ་དགོ། localnet ཡང་ན་ Minamoto གི་དོན་ལུ་ བཟོ་སྐྲུན་འབད་མི་འཆར་གཞི་དེ་ ལོག་སྟེ་ལག་ལེན་འཐབ་མ་བཅུག།

## ལས་སྡེ་གཞན་ཚུ་དང་འབྲེལ་བའི་འབྲེལ་བ་ {#relationship-to-other-entities}

ཌོ་མེ་ན (domains) གི་སྡེ་ཚན་ཚུ་ ལེ་ཇེར་གྱི་དངོས་རྫས་དང་ ཌོ་เมན (domein-scoped data) གི་དོན་ལས་མིང་སྟོང་པ་བཟོ་ཡོདཔ་ཨིན། རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ནང་ལུ་ ཌོ་મેན (Domain) ལུ་ ཁྱད་ཚད་ལྡན་པའི་ ངོ་རྟགས་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་མ་ཚད་ བརྟག་དཔྱད་འབད་མི་ཚུ་ལུ་ ཌོ་ମେན (domenes) གི་ཐོ་ཡིག་བཀོད་ཚུགས། ཡང་ན་འཚོལ་ཚུགས། ས་ཁོངས་ཅིག་ལུ་ ཁྱབ་ཚད་ཡོད་པའི་དངོས་པོ་ཚུ་ཨིན། རྩིས་ཁྲ་དེ་ རང་རང་གིས་རང་ ད་ལྟོའི་གནས་སྡུད་དཔེ་ནང་ ས་ཁོངས་མེད་རུང་ རྩིས་ཁྲ་ཚུ་གིས་ ས་ཁོངས་ཚུ་ བདག་འཛིན་འཐབ་ཚུགས་ནི་ཨིནམ་མ་ཚད་ ས་ཁོངས་ཚུ་གི་འོག་ལུ་ གནས་སྡུད་ཡོད་མི་ཚུ་ཡང་བཞག་ཚུགས།

འདི་ཡང་བལྟ་:

- [འཛམ་གླིང་](/dz/blockchain/world.md)
- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [metadata](/dz/blockchain/metadata.md)
- [མིང་བཏགས་ཐོ་བཀོད་གི་ལམ་ལུགས་](/dz/reference/naming.md)
