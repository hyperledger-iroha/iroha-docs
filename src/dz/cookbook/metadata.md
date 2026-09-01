---
translation_locale: dz
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: human-reviewed
---
# གཞི་རྟེན་འབྱུང་ཁུངས་ {#metadata}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ ཟུར་གནས་གནད་སྡུད བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་རྩིས་ཐོ་གི་ ཟུར་གནས་གནད་སྡུད ཚད་གཞི་ཅིག་ གཞི་སྒྲིག་དང་བརྟག་དཔྱད་འབད་ཞིནམ་ལས་ ཐད་ཀར་དུ་འཐུས་སྤྲོད་མི་ཞལ་འདེབས་ལེན་ཐོག་ལས་ གནས་གོང འདི་ཡང་བཏོན་གཏང་འོང་། ཁྱོད་ཀྱིས་ རྩིས་དེབ-དངོས་པོ ཟུར་གནས་གནད་སྡུད འདི་ ཚོང་འབྲེལ གླ་ཡོན ཟུར་གནས་གནད་སྡུད ལས་སོ་སོར་བཞག་འོང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་ཤུལ་ལས་དང་ ད་ལྟོའི `iroha` CLI
- དངུལ་འབྲེལ་མཐུན་རྐྱེན་ཚུ་ `taira.client.toml` དང་ `taira.tx-metadata.json` ལས་ [འབྲེལ་མཐུད་འབད་ Taira](./connect-to-taira.md).
- དམིགས་གཏད་རྩིས་ཀྱི་ ཟུར་གནས་གནད་སྡུད གྱི་དབང་འཛིན་འབད་ཐབས། དཔེ་འདི་བཀོད་སྒྲིག་ཅན་གྱི་དབང་འཛིན་ལུ་དམིགས་ཏེ་ཨིན། རྩིས་ཐོ་གཞན་ཅིག་གིས་ ཡོངས་འབྲེལ་ཐོག་ལས་ ངོས་ལེན་འབད་དགོཔ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### ༡ མེ་ཊ་ཌེ་ཊ་ཚུ་ ལག་ལེན་པ་མ་བཙུགས་པར་ ཀློག་ཐེངས། {#_1-read-metadata-without-a-signer}

ཟུར་གནས་གནད་སྡུད འདི་ `Name` ལས་ JSON གི་ནང་འཁོད་ལུ་ཐོ་བཀོད་འབད་ཡོད་མི་ ས་ཁྲ་ཨིན། ས་ཁྲ་སྟོངམ་དང་ བསྒྲགས་འབད་མི་ཐོན་སྐྱེད་སྟོངམ་འདི་ གྲུབ་འབྲས་བདེན་ཡོདཔ་ཨིན།

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

གསལ་བཀོད་དང་ ཚད་འཛིན་འབད་སའི་ ས་ཁོངས་ཆུང་ཀུ་ཚུ་གི་དོན་ལུ་ མེ་ཊ་ཌེ་ཊ་ཚུ་ལག་ལེན་འཐབ་ཨིན། ནང་དོན་གནད་སྡུད་གྱི་ཁེ་རྒུད་སྦོམ་ཚུ་ ལེན་ཐོ་ནང་ལས་བཏོན་ཏེ་ URI ཡང་ན་ SoraFS བལྟ་བཤལཔ་ཅིག་བཞག་དགོ།

### 2. དམིགས་གཏད་རྩིས་བཏོན་ {#_2-derive-the-target-account}

Taira གཞི་སྒྲིག་ནང་ལས་ མི་མང་གི་ལྡེ་མིག་རྐྱངམ་ཅིག་ ཀློག་ཞིནམ་ལས་ ཌོ་མེནམེད་མི་ I105 ཐོ་བཀོད་ལུ་བསྒྱུར་གཏང་དགོ།

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

JSON ཚད་ལྡན་ནང་ཐོ་བཀོད་ནང་ལས་ བསྐྱར་ཞིབ་འབད་མི་དེ་ རྩིས་ཐོ་གི་གནས་གོང་ `cookbook_profile` ལུ་འགྱུར་ཡོདཔ་ཨིན། དེ་དང་ཕྱདཔ་ད་ `--metadata ./taira.tx-metadata.json` གིས་ དངུལ་སྤྲོད་ཀྱི་ས་ཆ་ཚུ་ གླ་འཁོར་གྱི་ཁེབས་ལུ་ མཐུད་སྦྲེལ་འབདཝ་ཨིན། ས་ཁྲམ་གཉིས་ཆ་ར་གིས་ དམིགས་གཏད་དང་དོན་གནད་སོ་སོ་ཡོད་ཨིན།

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

གནད་སྡུད་སོ་སོ་ལུ་ བསྒྱུར་བཅོས་འབད་དགོ་པའི་ འགན་འཁྲི་འདི་ ལག་ལེན་ཅན་གྱི་བདེན་འཛིན་ཅན་གྱིས་ གྲོས་ཐག་ཆོད་འབདཝ་ཨིན། རྩིས་ཐོ་གཞན་ཅིག་ ད་ལྟོའི་བར་ན་ཡང་ `CanModifyAccountMetadata`; ས་ཁོངས་ཚུ་དང་ རྒྱུ་དངོས་ཚུ་གི་འགྲེལ་བཤད་ཚུ་ NFTs, ཌི་ཇི་ཊར་ཚུ་གིས་ དམིགས་གཏད་ལུ་དམིགས་ཏེ་ ཟུར་གནས་གནད་སྡུད ངོས་ལེན་ཚུ་ཡོདཔ་ཨིན། གལ་སྲིད་ Taira དགོས་མཁོ་ཅན་གྱི་དབང་ཆ་མ་བྱིན་པས། འདི་བཟུམ་སྦེ་རྩིས་ཐོ་གི་བཀའ་རྒྱ་ཚུ་ལག་ལེན་འཐབ་དགོ། `./localnet/client.toml`, བཟོ་སྐྲུན་འབད་ཡོད་པའི་ ས་གནས་བརྟག་དཔྱད་དྲ་རྒྱ དབང་ཚད གི་ ཚད་ལྡན འདི་ཚབ་བཙུགས་དགོ། I105 ID, དེ་ལས་སེལ་འཐུ་འབད་ཚུགས། Taira ཟད་འགྲོ་གི་རྩིས་ཐོ་ཡིག་སྣོད་འདི་ བསྡུ་སྒྲིག་འབད་དགོ་ ས་གནས་ཀྱི་འཐུས་སྤྲོད་མི་གདམ་ཁ་འདི་ གསལ་ཏོག་ཏོ་སྦེ་བཞག་དགོ།

:::

### 4.ལྡེ་མིག་འཐུ་འབད། {#_4-remove-the-key}

དང་པ་ ཁས་བླངས་འབད་ཡོད་པའི་གནས་གོང་ལྷག་ཞིནམ་ལས་ བཏོན་གཏང་ནིའི་ཚོང་འབྲེལ་སོ་སོ་ཅིག་བཙུགས།

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

Python གློག་རིམ་ཚུ་གི་དོན་ལུ་ མཐུན་སྒྲིག་ཡིག་དཔར་རྐྱབ་ཡོད་པའི་བཟོ་བསྐྲུན་པ་ཚུ་ `Instruction.set_account_key_value` དང་ `Instruction.remove_account_key_value` ཨིན། དེ་ཚུ་ བརྗེ་སོར་གྱི་མེ་ཊ་ཌེ་ཊ་དང་ [Python སློབ་སྟོན་](/dz/guide/tutorials/python.md#shared-setup) ལས་ བསྒུག་སྡོད་མི་གྲོགས་རམ་དང་གཅིག་ཁར་ བཙུགས།

## བརྟག་དཔྱད་འབད་ {#verify}

གཞི་སྒྲིག་འབད་ཡོད་པའི་ཚོང་འབྲེལ་གྱི་ཤུལ་ལས་ `meta get` གིས་ `version: 1` དང་ཅིག་ཁར་དངོས་པོ་འདི་སླར་ལོག་འབད་དགོ། བཏོན་གཏང་པའི་ཤུལ་ལས་ ཐད་ཀར་འཚོལ་ཞིབ་ཅིག་གིས་ ད་ལས་ཕར་ གནས་གོང་ཅིག་སླར་ལོག་འབད་མི་བཏུབ།

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

རྩིས་ཐོ་དབྱེ་ཁག་ཅིག་གིས་ ཀློག་ཐེངསམ་ད་ མེད་པའི་ ཟུར་གནས་གནད་སྡུད ལྡེ་མིག འདི་ དྲ་རྒྱ ཡང་ན་ རྩིས་ཐོ གྱི་འཛོལ་བ་ལས་ཁྱད་པར་བཟོཝ་ཨིན། བཟོ་སྐྲུན་ ལས་རིམ་ཨང་རྟགས འདི་ཡང་ JSON གི་གོང་ཚད་འདི་ གཞི་སྒྲིག་འབད་བའི་ཤུལ་ལས་ བརྟག་ཞིབ་འབད་དགོཔ་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- གནས་ཚད་ཅན་གྱི་ནང་ཐོ་བཀོད་ནང་ལུ་ ཁྱད་ལྡན་ JSON གྱངས་ཁ་གཅིག་ཡོད་དགོཔ་ཨིན། ཡིག་རྒྱུན འདི་ལུ་ JSON གི་ཚིག་ཡིག་ཚུ་ དགོཔ་ཨིན། ཨེབ་ཐག་དང་ ཨེ་རེ འདི་ལེགས་ཤོམ་སྦེ་བཟོ་དགོཔ་ཨིན།
- མེ་ཊ་ཌེ་ཊ་ལྡེ་མིག་ཚུ་ `Name` གནས་གོང་ཚུ་ཨིནམ་དང་ དབྱེ་དཔྱད་འབད་བའི་ཤུལ་ལས་ ཡིག་འབྲུ་སྦོམ་ཚུ་ ཚོར་ཤུགས་ཅན་ཨིན། ལས་རིམ་བསྒྱུར་བཅོས་རེ་རེ་གི་དོན་ལུ་ ཐོན་རིམ་བཟོ་ཡོད་པའི་ལྡེ་མིག་ཚུ་གསར་བསྐྲུན་འབད་ནིའི་ཚབ་ལུ་ ལྡེ་མིག་མིང་ཚིག་གཏན་ཏོག་ཏོ་ཅིག་བཞག།
- `--metadata` འདི་ ཚོང་འབྲེལ་གྱི་མེ་ཊ་ཌེ་ཊ་ཨིན། དེ་གིས་ ལེ་ཇར་-དངོས་པོ་མེ་ཊ་ཌེ་ཊ་གཞི་སྒྲིག་མི་འབད། ཤུལ་མམ་གྱི་དོན་ལུ་ ངོ་བོ་གི་ `meta set` ཡན་ལག་བརྡ་བཀོད་ལག་ལེན་འཐབ།
- ལྷག་ཐངས་རྙིངམ་ཅིག་གི་ཤུལ་ལས་ མཐར་འཁྱོལ་ཅན་གྱི་ཕུལ་མི་འདི་ ཁྱབ་སྤེལ་ཕྱིར་འགྱངས་འབད་ཚུགས། འཇུག་སྤྱོད་འབད་ཡོད་པའི་མཐའ་མཇུག་ལུ་སྒུག་ཞིནམ་ལས་ ལོག་སྟེ་མ་ཕུལ་བའི་ཧེ་མ་ འདྲི་དཔྱད་འདི་ལོག་སྟེ་འབད་རྩོལ་བསྐྱེད།
- གནང་བ་བཀག་ཆ་འདི་གིས་ དམིགས་གཏད་དངོས་པོ་དང་དབང་ཚད་མཚམས་ངོས་འཛིན་འབདཝ་ཨིན། ས་གནས་ནང་ སྦྱོང་བརྡར་འབད་ནི་ཡང་ན་ རྟགས་མཚན་ངེས་བདེན་ ཞུ་བ་འབད་ནི། འཛུལ་སྤྱོད་ཚད་འཛིན་ལས་ བཀག་ཐབས་ལུ་ སྒེར་གྱི་གློག་རིམ་གནད་སྡུད་འདི་ མི་མང་མེ་ཊ་གནད་སྡུད་ས་སྒོ་ཅིག་ནང་ སྤོ་བཤུད་མ་འབད།
- སྒེར་གྱི་ལྡེ་མིག་དང་ མི་སྒེར་གྱི་ངོས་འཛིན་འབད་མི་ འཛུལ་སྤྱོད་བརྡ་མཚོན་ ཡང་ན་ ཡིག་ཆ་སྦོམ་ཚུ་ མེ་ཊ་ཌེ་ཊ་ནང་ ནམ་ཡང་ གསོག་འཇོག་མ་འབད།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [རྩིས་སྒྲིག་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs) ལུ་ ཟུར་གནས་གནད་སྡུད འདྲི་དཔྱད འབྲེལ་མཐུད་དཔྱད་འབདཝ་ཨིན།
- [Python SDK འབྲེལ་གཏད་བཟོ་སྐྲུན་འབད་མི་ཚུ་ ཕིན་ཌ་གི་བཅའ་ཁྲིམས་ནང་ — གཏན་སྦྱར་ཡོད་པའི Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [ཟུར་གནས་གནད་སྡུད](/dz/blockchain/metadata.md)
- [མེ་ཊ་ཌའི་ཊ་དང་ ལེ་ཇར་གི་གནས་སྡུད་བཞག་ནིའི་ གདམ་ཁ་ཚུ་](/dz/guide/configure/metadata-and-store-assets.md)
- [བརྡ་བཀོད་གི་ཁ་བྱང་](/dz/reference/instructions.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
