---
translation_locale: dz
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# རྩིས་ཁྲ་དང་ མིང་རྟགས་ཚུ་ {#accounts-and-aliases}

## གྲུབ་འབྲས་ {#outcome}

domainless canonical ཚུ་དང་གཅིག་ཁར་ ཉེན་སྲུང་ལྡན་པའི་ལཱ་འབད་ I105 རྩིས་ཁྲ་ IDs དེ་ལས་ མི་གིས་ལྷག་ཚུགསཔ་སྦེ་ འབྲེལ་བ་འཐབ་མི་ མིང་རྟགས་ཚུ་ དཔེར་ན་ `treasury@payments.universal`. ཁྱོད་ཀྱིས་བརྟག་དཔྱད་འབད་ནི་ཨིན། Taira རྩིས་ཁྲ་ཚུ་, ཁྱོད་རང་གི་ canonical ID, བརྒྱུད་ལམ་གྱི་གནས་སྟངས་དང་ ངོས་འཛིན་ཚུ་ མགུ་འཐོམ་མ་གཏང་པར་ སའི་མིང་ཚུ་ སེལ་ཚུགས།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་ཤུལ་ལས་དང་ current `iroha` CLI
- [ལས་ `taira.client.toml` ཁྱོད་ཀྱི་རྩིས་ཁྲ་བརྟག་དཔྱད་འབད་བའི་སྐབས་ Taira](./connect-to-taira.md) ལུ་འབྲེལ་བ་འཐབ་དགོ།
- རྩིས་ཁྲ་དེ་ Taira faucet ཡང་ན་ net གི་གཞི་བསྟུན་ནང་ འཛུལ་ཞུགས་འབད་ནིའི་ལམ་བརྒྱུད་དེ་ གྲུབ་འབྲས་འབྱུང་འོང་ཟེར་རེ་བ་བསྐྱེད་པའི་ཧེ་མར་ ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### Taira གི་རྩིས་ཁྲ་ཚུ་ བརྟག་ཞིབ་འབདཝ་ཨིན། {#_1-inspect-canonical-accounts-on-taira}

མི་མང་གི་རྩིས་ཁྲ་གི་ཐོ་ཡིག་ནང་ལུ་ ཨ་རྟག་རང་ canonical I105 IDs སླར་ལོག་འབདཝ་ཨིན། primary alias འདི་གདམ་ཁ་ཅན་ཅིག་ཨིནམ་ལས་ ངོ་རྐྱང་སྦེ་ སྙན་ཞུ་འབད་འོང་།

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID ལས་ `.id` གིས་ རྩིས་ཁྲ་གི་ས་ཁོངས་ཚུ་གི་དོན་ལུ་ ཆ་གནས་ཡོདཔ་ཨིན། འདི་ནང་ལུ་ domain མཉམ་འབྲེལ་མ་རྐྱབས། `.primary_alias` གི་མཚན་རྟགས་འདི་ ལག་ལེན་པ་ཁ་ཐུག་འཚོལ་བའི་ལྡེ་མིག་ཅིག་ཨིན་ དེ་ལས་ kanonic ངོ་རྟགས་གཞན་ཅིག་མེན།

### 2. ཁྱོད་ཀྱི་ Taira I105 ID ལས་འབྱུང་ཞིནམ་ལས་ རང་བཞིན་གནས་གོང་བཟོ་དགོ། {#_2-derive-and-normalize-your-taira-i105-id}

ས་གནས་ཀྱི་བཟོ་སྒྲིག་ནང་ལས་ མི་མང་གི་ལྡེ་མིག་རྐྱངམ་ཅིག་ ཀློག་ཚུགས། མི་མང་གི་ལྡི་མིག་དེ་ དབྱེ་བ་སོ་སོར་ལུ་ public network profile ཚུ་གི་དོན་ལུ་ ཨེབ་གཏང་འབདཝ་ཨིན། འདི་འབདཝ་ལས་ `taira` གསལ་ཏོག་ཏོ་སྦེ་གདམ་ཁ་རྐྱབས།

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

གནས་ཚད་གནས་གོང་འདི་ `TAIRA_ACCOUNT_ID` དང་འདྲན་འདྲ་འབད་དགོཔ་ཨིན། TOML ཌའི་ལོག་ནང་ལུ་ `[account].domain` གཞི་སྒྲིག་དེ་ `wonderland.universal` འབད་ནི་ཨིན་རུང་ གནས་གོང་འདི་གིས་ རུ་ཊི་དང་ alias གི་ཐད་ལུ་རྐྱངམ་གཅིག་ གནོད་དོ་ཡོདཔ་ཨིན།

### ༣.རྩིས་ཁྲ་དང་ ཅ་དངོས་ཚུ་ ཀློག་ཐེངས། {#_3-read-the-account-and-its-assets}

རྩིས་ཁྲ་འདི་ གཞི་བཙུགས་ཚར་བའི་ཤུལ་ལས་ ཐད་ཀར་དུ་དྲིས་ཞིནམ་ལས་ ཚད་འཛིན་ཅན་གྱི་ རྒྱུ་དངོས་གི་ཤོག་ལེབ་ཅིག་བཀོད་དགོ། URL-ལམ་སྟོན་ནང་ལུ་ ལག་ལེན་འཐབ་པའི་ཧེ་མར་ I105 གནས་གོང་ལུ་ ཨེབ་གཏང་འབད་.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4.རྩིས་ཁྲ་དང་འབྲེལ་བའི་མིང་རྟགས་ཚུ་འཚོལ་དགོ། {#_4-look-up-aliases-bound-to-the-account}

གནད་དོན་རྒྱབ་ཕྱོགས་ཀྱི་ resolver གིས་ canonical account ID ཅིག་ཆ་ལེན་འབད་ཡོདཔ་ཨིན། མི་མང་གི་ datapace གྲལ་ཐིག་ཚུ་ request-signature headers མ་བཙུགས་པར་ ཀློག་ཚུགས། restricted dataspaces require an authorized signed request.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` ཆ་གནས་ཡོདཔ་ད་ རྩིས་ཁྲ་ཅིག་ལུ་ མིང་རྟགས་མ་དགོ་པའི་ཁར་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་སྐབས་ མིང་རྟགས་ངོ་མ་ཆ་མཉམ་ཡོད་མི་དེ་ སེལ་འཐུ་འབད་ཞིནམ་ལས་ ཕྱིར་བཏོན་འབད་མི་རྩིས་ཁྲ་ ID དབྱེ་ཞིབ་འབད་:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning ངོས་ལེན་གྱི་ཚད་ཐིག་

Taira faucet གིས་ རང་སོའི་རྩིས་ཁྲ་ལེན་མི་ལུ་བྱིན་རུང་ འདི་གིས་ སྤྱིར་བཏང་རྩིས་ཁྲ་གི་ཐོ་ཡིག་དང་ ཡང་ན་ མིང་རྟགས་འཛིན་སྐྱོང་དབང་འཛིན་མ་བྱིན་པས། གཞན་གྱི་རྩིས་ཁྲ་ཅིག་གུ་ ཐོ་བཀོད་འབད་དགོ་པ་ཅིན་ `CanRegisterAccount` འདི་ལག་རྩལ་ཅན་གྱི་ཨེབ་རྟ་ནང་བཙུགས་དགོཔ་ཨིན། རྩིས་ཁྲ་གི་མིང་རྟགས་འདི་ཡང་ སྤྱིར་བཏང་ལུ་ SNS གྱི་ལག་ལེན་དང་ འོས་འབབ་ཅན་གྱི་མིང་རྟགས་ཀྱི་ཆོག་ཐམ་ཚུ་ དགོཔ་ཨིན། སྒྲིག་གཞི་བཟོ་ཡོད་པའི་ ནང་ཐོ་བཀོད་/མིང་རྟགས་འཆར་གཞིའི་ལག་ལེན་འཐབ་ ཡང་ན་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཁ་ཐུག་ལས་ ཐོ་བཀོད་ཉམས་མྱོང་འབད་ཚུགས།

:::

ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ ཐོ་བཀོད་འབད་མི་ཚུ་ ཉེན་སྲུང་ཅན་གྱི་བརྡ་དོན་སྤྲོད་འབད་ནི་ལས་ ཕྱིར་ཚོང་འབད་ཚར་བའི་ཤུལ་ལས་ ཐོ་བཀོད་ཀྱི་ས་ཁོངས་འདི་ `NEW_ACCOUNT_ID` ཨིན་:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

གནད་སྡུད་དང་འབྲེལ་བའི་ སྒེར་གྱི་ལྡེ་མིག་འདི་ ཡིག་ཆ་དང་ལག་ལེན་ཡིག་ཚང་གི་ཕྱི་ཁར་ བཟོ་སྟེ་བཞག་ནི། ID འདི་འཛིན་སྐྱོང་ལྡེ་མིག་ཅིག་མེདཔ་སྦེ་ ཐོ་བཀོད་འབད་བ་ཅིན་ ལག་ལེན་འཐབ་མ་ཚུགས་པའི་རྩིས་ཁྲ་བཟོ་ཡོདཔ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

གཞི་སྒྲིག་གི་སྤྱིར་བཏང་ལྡེ་མིག་, I105 ཨེབ་གཏང་ཐངས་,དང་ bonding alias འདི་ཚུ་ག་ར་ canonical account ID གཅིག་ཁར་བསྡོམས་ཡོདཔ་སྦེ་བཏོན་དགོ།

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

ཐོ་བཀོད་འབད་ཡོད་པའི་རྩིས་ཁྲ་ IDs. Canonical ལག་ལེན་འཐབ་ནི་ IDs ཐོ་བཀོད་དང་ ངོས་ལེན་ དེ་ལས་ ཚོང་འབྲེལ་གྱི་བཀོད་རྒྱ་ཚུ་གི་དོན་ལུ་ བཏོན་གཏང་། ཐོ་བཀོད་ཐོ་བཀོད་ཀྱི་མཐའ་མཚམས་ལུ་ མཆིན་ཡིག་མིང་། ཐོ་བཀོད་ཀྱི་མཐའ་མཚམས་ལུ་ ID ལས་འགུལ་གྱི་དོན་ལུ་ ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- བརྟག་ཞིབ་ ཡང་ན་ སྔོན་སྒྲིག་གི་འཛོལ་བ་འདི་ སྤྱིར་བཏང་ལུ་ཁ་བྱང་ཅིག་གིས་ ཁྱད་པར་ཅན་གྱི་དྲ་ལམ་གི་ཡིག་གཟུགས་གི་དོན་ལུ་ ཨེབ་གཏང་འབད་ཡོད་པའི་དོན་ལས་ཨིན། `--profile taira` ལུ་གནས་གོང་བཟོ་ནི་དང་མ་འདྲ་བ་ཚུ་ཆ་མེད་གཏང་།
- རྩིས་ཁྲ་ `404` གི་ཤུལ་ལུ་ faucet `202` སྦེ་ཁྱབ་སྤེལ་དུས་ཡུན་བཟློག་ཚུགས། རྩིས་ཁྲལ་དང་མ་དངུལ་གྱི་རྒྱུ་དངོས་ཚུ་ བགོ་བཀྲམ་འབད་བའི་ཧེ་མ་ ཞིབ་འཚོལ་འབད་ཞིནམ་ལས་འབྲི་ཤོག་བཏང་ཚུགས།
- `total: 0` ལས་རྒྱབ་ཕྱོགས་ resolver གིས་ མཐོང་ཚུགས་པའི་ alias འབྲེལ་བ་མེདཔ་ཨིན། འདི་རྩིས་འཚོལ་བའི་འཛོལ་བ་མེན།
- `401` ཡང་ན་ `403` མཆིན་ཡིག་གི་ལམ་ལས་ གནས་སྡུད་ཀྱི་ས་སྟོང་ཚད་མ་ཆོགཔ་སྦེ་སྟོན་དོ་ཡོདཔ་དང་ ཡང་ཅིན་ ཡི་ངེས་ཅན་གྱི་གནས་གོང་བཀོད་ནིའི་ཆོག་ཐམ་མངམ་མེད་ཟེར་སྟོན་དོ་ཡོདཔ་ཨིན། ཁྱབ་ཆེ་བའི་ སྔོན་སྒྲིག་འཚོལ་དེ་ རྒྱབ་སྐྱོར་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་ནི་མི་འོང་།
- ཀློག་ཚུགས་པའི་ `name@domain.dataspace` ཚད་གཞི་འདི་ ཆ་མེད་གཏང་ནི་ཨིནམ་ད་ དངོས་གྲུབ་ཅན་གྱི་ I105 ID དགོཔ་ཨིན། དང་པ་འདི་ སེལ་འཐུ་འབད།
- ས་གནས་ཀྱི་རྩིས་ཁྲ་གི་ ཐོ་བཀོད་དེ་ གྲུབ་འབྲས་ཐོན་རུང་ Taira གིས་ ཆ་མེད་བཏང་པ་ཅིན་ ཁྱད་པར་འདི་ ངོས་ལེན་འབད་ནི་ཨིན། `CanRegisterAccount`ཐོབ་ནི་; སྒྲིག་འཇུག་མ་སྤར་བའི་དོན་ལུ་རྩིས་ཁྲ་ ID བསྒྱུར་བཅོས་མ་རྐྱབས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [ཀ་ནོ་ནི་ཀཱན་གྱི་རྩིས་ཁྲའི་ཁ་བྱང་ཚུ་ ཕིན་ཌི་གི་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs) ལུ་ལག་ལེན་འཐབ་ནི།
- [རྩིས་ཁྲ་དང་ མིང་རྟགས་ Torii བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs) ལུ་འབདཝ་ཨིན།
- [རྩིས་ཁྲ་ཚུ་](/dz/blockchain/accounts.md)
- [ཌའི་ཊ་གི་དཔེ་ཆ་གྱི་མིང་རྟགས་](/dz/blockchain/data-model.md#aliases)
- [མིང་བཏགས་པའི་ཞལ་འཆེས་](/dz/reference/naming.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
