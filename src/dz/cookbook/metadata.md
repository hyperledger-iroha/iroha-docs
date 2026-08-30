---
translation_locale: dz
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# གཞི་རྟེན་འབྱུང་ཁུངས་ {#metadata}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ metadata བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་རྩིས་ཁྲ་གི་ metadata ཚད་གཞི་ཅིག་ གཞི་སྒྲིག་དང་བརྟག་དཔྱད་འབད་ཞིནམ་ལས་ ཐད་ཀར་དུ་འཐུས་སྤྲོད་མི་ཞལ་འདེབས་ལེན་ཐོག་ལས་ value འདི་ཡང་བཏོན་གཏང་འོང་། ཁྱོད་ཀྱིས་ ledger-object metadata འདི་ transaction fee metadata ལས་སོ་སོར་བཞག་འོང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་ཤུལ་ལས་དང་ current `iroha` CLI
- དངུལ་འབྲེལ་མཐུན་རྐྱེན་ཚུ་ `taira.client.toml` དང་ `taira.tx-metadata.json` ལས་ [འབྲེལ་མཐུད་འབད་ Taira](./connect-to-taira.md).
- དམིགས་གཏད་རྩིས་ཀྱི་ metadata གྱི་དབང་འཛིན་འབད་ཐབས། དཔེ་འདི་བཀོད་སྒྲིག་ཅན་གྱི་དབང་འཛིན་ལུ་དམིགས་ཏེ་ཨིན། རྩིས་ཁྲ་གཞན་ཅིག་གིས་ ཡོངས་འབྲེལ་ཐོག་ལས་ ངོས་ལེན་འབད་དགོཔ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### ༡ མེ་ཊ་ཌེ་ཊ་ཚུ་ ལག་ལེན་པ་མ་བཙུགས་པར་ ཀློག་ཐེངས། {#_1-read-metadata-without-a-signer}

metadata འདི་ `Name` ལས་ JSON གི་ནང་འཁོད་ལུ་ཐོ་བཀོད་འབད་ཡོད་མི་ ས་ཁྲ་ཨིན། ས་ཁྲ་སྟོངམ་དང་ བསྒྲགས་འབད་མི་ཐོན་སྐྱེད་སྟོངམ་འདི་ གྲུབ་འབྲས་བདེན་ཡོདཔ་ཨིན།

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

གསལ་བཀོད་དང་ ཚད་འཛིན་འབད་སའི་ ས་ཁོངས་ཆུང་ཀུ་ཚུ་གི་དོན་ལུ་ མེ་ཊ་ཌེ་ཊ་ཚུ་ལག་ལེན་འཐབ་ཨིན། ཁེ་ཕན་གྱི་ཁེ་རྒུད་སྦོམ་ཚུ་ ལེན་ཐོ་ནང་ལས་བཏོན་ཏེ་ URI ཡང་ན་ SoraFS བལྟ་བཤལཔ་ཅིག་བཞག་དགོ།

### 2. དམིགས་གཏད་རྩིས་བཏོན་ {#_2-derive-the-target-account}

Taira གཞི་སྒྲིག་ནང་ལས་ མི་མང་གི་ལྡེ་མིག་རྐྱངམ་ཅིག་ ཀློག་ཞིནམ་ལས་ ཌོ་मेनམེད་མི་ I105 ཐོ་བཀོད་ལུ་བསྒྱུར་གཏང་དགོ།

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
```

### ༣. JSON གི་གོང་ཚད་གཅིག་གཏན་འབེབས། {#_3-set-one-json-value}

JSON ཚད་ལྡན་ནང་ཐོ་བཀོད་ནང་ལས་ བསྐྱར་ཞིབ་འབད་མི་དེ་ རྩིས་ཁྲ་གི་གནས་གོང་ `cookbook_profile` ལུ་འགྱུར་ཡོདཔ་ཨིན། དེ་དང་ཕྱདཔ་ད་ `--metadata ./taira.tx-metadata.json` གིས་ དངུལ་སྤྲོད་ཀྱི་ས་ཆ་ཚུ་ གླ་འཁོར་གྱི་ཁེབས་ལུ་ མཐུད་སྦྲེལ་འབདཝ་ཨིན། ས་ཁྲམ་གཉིས་ཆ་ར་གིས་ དམིགས་གཏད་དང་དོན་གནད་སོ་སོ་ཡོད་ཨིན།

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI གིས་འཐུས་ཨེབ་གནང། རྟགས་ཐོ་བཀོད། བཏང་། དེ་ལས་སྒུགས་ནི་དེ་ སྔོན་སྒྲིག་སྦེ་ཨིན། ཁྱོད་ཀྱིས་ `--no-wait` ཚུ་མ་སྣོན་འབད་དོ་ཡོདཔ་ད་ ལས་རིམ་གཞན་འདི་གོང་ཚད་འདི་ལས་བརྟེན་ཨིན།

::: warning ངོས་ལེན་གྱི་ཚད་ཐིག་

གནད་སྡུད་སོ་སོ་ལུ་ བསྒྱུར་བཅོས་འབད་དགོ་པའི་ འགན་འཁྲི་འདི་ ལག་ལེན་ཅན་གྱི་བདེན་འཛིན་ཅན་གྱིས་ གྲོས་ཐག་ཆོད་འབདཝ་ཨིན། རྩིས་ཁྲ་གཞན་ཅིག་ ད་ལྟོའི་བར་ན་ཡང་ `CanModifyAccountMetadata`; ས་ཁོངས་ཚུ་དང་ རྒྱུ་དངོས་ཚུ་གི་འགྲེལ་བཤད་ཚུ་ NFTs, ཌི་ཇི་ཊར་ཚུ་གིས་ དམིགས་གཏད་ལུ་དམིགས་ཏེ་ metadata ངོས་ལེན་ཚུ་ཡོདཔ་ཨིན། གལ་སྲིད་ Taira དགོས་མཁོ་ཅན་གྱི་དབང་ཆ་མ་བྱིན་པས། འདི་བཟུམ་སྦེ་རྩིས་ཁྲ་གི་བཀའ་རྒྱ་ཚུ་ལག་ལེན་འཐབ་དགོ། `./localnet/client.toml`, བཟོ་སྐྲུན་འབད་ཡོད་པའི་ localnet authority གི་ canonical འདི་ཚབ་བཙུགས་དགོ། I105 ID, དེ་ལས་སེལ་འཐུ་འབད་ཚུགས། Taira ཟད་འགྲོ་གི་རྩིས་ཁྲ་ཡིག་སྣོད་འདི་ བསྡུ་སྒྲིག་འབད་དགོ་ ས་གནས་ཀྱི་འཐུས་སྤྲོད་མི་གདམ་ཁ་འདི་ གསལ་ཏོག་ཏོ་སྦེ་བཞག་དགོ།

:::

### 4.ལྡེ་མིག་འཐུ་འབད། {#_4-remove-the-key}

དང་པ་ ཁས་བླངས་གྱི་གོང་ཚད་ཚུ་ ཀློག་ཞིནམ་ལས་ ཟད་འགྲོ་ཕྱིར་བཏོན་འབད་ནིའི་ བྱ་བ་སོ་སོ་ཅིག་ བཏང་དགོ།

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python གི་ལག་ལེན་ཚུ་གི་དོན་ལུ་ ཁྱད་ཚད་ལྡན་པའི་བཟོ་སྐྲུན་འཕྲུལ་ཆས་འདི་ `Instruction.set_account_key_value` དང་ `Instruction.remove_account_key_value` ཨིན། འདི་ཚུ་ transaction metadata དང་ waiting assistantལས་ [Python tutorial ](/dz/guide/tutorials/python.md#shared-setup) ལས་བཙུགས་དགོ།

## བརྟག་དཔྱད་འབད་ {#verify}

ཟད་འགྲོ་བཏང་ཚར་བའི་ཤུལ་ལས་ `meta get` གིས་ གནད་དོན་འདི་ `version: 1` ལུ་ལོག་གཏོགསཔ་ཨིན། བསྡུ་ལེན་འབད་བའི་ཤུལ་ལུ་ ཐད་ཀར་དུ་འཚོལ་ཞིནམ་ལས་ གནས་གོང་སླར་ལོག་མི་འབད་འོང་།

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

རྩིས་ཁྲ་དབྱེ་ཁག་ཅིག་གིས་ ཀློག་ཐེངསམ་ད་ མེད་པའི་ metadata key འདི་ net ཡང་ན་ account གྱི་འཛོལ་བ་ལས་ཁྱད་པར་བཟོཝ་ཨིན། བཟོ་སྐྲུན་ code འདི་ཡང་ JSON གི་གོང་ཚད་འདི་ གཞི་སྒྲིག་འབད་བའི་ཤུལ་ལས་ བརྟག་ཞིབ་འབད་དགོཔ་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- གནས་ཚད་ཅན་གྱི་ནང་ཐོ་བཀོད་ནང་ལུ་ ཁྱད་ལྡན་ JSON གྱངས་ཁ་གཅིག་ཡོད་དགོཔ་ཨིན། string འདི་ལུ་ JSON གི་ཚིག་ཡིག་ཚུ་ དགོཔ་ཨིན། ཨེབ་ཐག་དང་ array འདི་ལེགས་ཤོམ་སྦེ་བཟོ་དགོཔ་ཨིན།
- metadata keys འདི་ `Name` གྱི་གོང་ཚད་ཚུ་ཨིནམ་ད་ བརྟག་ཞིབ་འབད་བའི་ཤུལ་ལས་ case-sensitiveཨིན། རྟག་བརྟན་ key vocabulary བཟོ་ནི་གི་ཚབ་ལུ་ schema འགྱུར་བ་རེ་རེ་གི་དོན་ལུ་ versioned keys བཟོ་དགོ།
- `--metadata` འདི་ transaction metadataཨིན། དེ་གིས་ ledger-object metadata གཞི་བཙུགས་མི་འབདཝ་ཨིན། འ་ནི་མཇུག་གི་དོན་ལུ་ ལས་འཛིན་གྱི་ `meta set` subcommand ལག་ལེན་འཐབ་དགོ།
- གྲུབ་འབྲས་ཅན་སྦེ་ བཏང་བའི་ཤུལ་ལུ་ ཀློག་ཐངས་རྙིངམ་ཅིག་ བཏང་ཚུགས་པ་ཅིན་ ཁྱབ་སྤེལ་དུས་ཡུན་འགོར་ནི་ཨིན་མས། ལག་ལེན་མཇུག་མ་བསྡུ་བར་སྒུག་སྟེ་ སླར་ཡང་ བཏང་པའི་ཧེ་མ་ དྲི་བ་དེ་ ལོག་ལྟབ་སྦེ་ བཏོན་གཏང་དགོ།
- ངོས་ལེན་མ་བཏུབ་པ་ཅིན་ དམིགས་གཏད་ཅན་གྱི་ ობიექტიདང་དབང་འཛིན་གྱི་མཐའ་མཚམས་ཚུ་ ངོས་འཛིན་འབདཝ་ཨིན། ས་གནས་ནང་བསྐྱར་ཞིབ་འབད་ ཡང་ན་ ཐོ་བཀོད་ཕྲང་བའི་བརྡ་དོན་འདི་ཞུ་འབད། ཐོབ་ཐངས་བཀག་ཐབས་ཀྱི་དོན་ལུ་ སྒེར་གྱི་ལག་ལེན་གི་ གནད་སྡུད་ཚུ་ གསལ་བསྒྲགས་འབད་ཡོད་པའི་ metadata field ནང་སྤོ་མི་དགོ།
- གསང་བའི་ལྡེ་མིག་ཚུ་དང་ རང་སོའི་ངོ་རྟགས་ངོ་མ་ཚུ་ ཐད་ཀར་དུ་མ་བརྐོ་ནི་ ཌོག་ཊཱོན་ཚུ་དང་ ཡིག་ཆ་སྦོམ་ཚུ་ metadataནང་ལུ་བཞག་ནི་མི་འོང་།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [རྩིས་སྒྲིག་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs) ལུ་ metadata query འབྲེལ་མཐུད་དཔྱད་འབདཝ་ཨིན།
- [Python SDK འབྲེལ་གཏད་བཟོ་སྐྲུན་འབད་མི་ཚུ་ ཕིན་ཌ་གི་བཅའ་ཁྲིམས་ནང་](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [metadata](/dz/blockchain/metadata.md)
- [མེ་ཊ་ཌའི་ཊ་དང་ ལེ་ཇར་གི་གནས་སྡུད་བཞག་ནིའི་ གདམ་ཁ་ཚུ་](/dz/guide/configure/metadata-and-store-assets.md)
- [བརྡ་བཀོད་གི་ཁ་བྱང་](/dz/reference/instructions.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
