---
translation_locale: dz
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: human-reviewed
---
# རྩིས་ཐོ་དང་ མིང་རྟགས་ཚུ་ {#accounts-and-aliases}

## གྲུབ་འབྲས་ {#outcome}

མངའ་ཁོངས་མེད ཚད་ལྡན ཚུ་དང་གཅིག་ཁར་ ཉེན་སྲུང་ལྡན་པའི་ལཱ་འབད་ I105 རྩིས་ཐོ་ IDs དེ་ལས་ མི་གིས་ལྷག་ཚུགསཔ་སྦེ་ འབྲེལ་བ་འཐབ་མི་ མིང་རྟགས་ཚུ་ དཔེར་ན་ `treasury@payments.universal`. ཁྱོད་ཀྱིས་བརྟག་དཔྱད་འབད་ནི་ཨིན། Taira རྩིས་ཐོ་ཚུ་, ཁྱོད་རང་གི་ ཚད་ལྡན ID, བརྒྱུད་ལམ་གྱི་གནས་སྟངས་དང་ ངོས་འཛིན་ཚུ་ མགུ་འཐོམ་མ་གཏང་པར་ སའི་མིང་ཚུ་ སེལ་ཚུགས།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`,`jq`, Python 3.11 ཡང་ན་ཤུལ་ལས་དང་ ད་ལྟོའི `iroha` CLI
- [ལས་ `taira.client.toml` ཁྱོད་ཀྱི་རྩིས་ཐོ་བརྟག་དཔྱད་འབད་བའི་སྐབས་ Taira](./connect-to-taira.md) ལུ་འབྲེལ་བ་འཐབ་དགོ།
- རྩིས་ཐོ་དེ་ Taira བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག ཡང་ན་ དྲ་རྒྱ གི་གཞི་བསྟུན་ནང་ འཛུལ་ཞུགས་འབད་ནིའི་ལམ་བརྒྱུད་དེ་ གྲུབ་འབྲས་འབྱུང་འོང་ཟེར་རེ་བ་བསྐྱེད་པའི་ཧེ་མར་ ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### Taira གི་རྩིས་ཐོ་ཚུ་ བརྟག་ཞིབ་འབདཝ་ཨིན། {#_1-inspect-canonical-accounts-on-taira}

མི་མང་རྩིས་ཐོའི་ཐོ་ཡིག་འདི་གིས་ ཨ་རྟག་རང་ ཚད་ལྡན་ I105 ཨའི་ཌི་ཚུ་སླར་ལོག་འབདཝ་ཨིན། གཞི་རིམ་མིང་གཞན་འདི་གདམ་ཁ་ཅན་ཨིནམ་དང་ སོ་སོ་སྦེ་སྙན་ཞུ་འབདཝ་ཨིན།

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id` ལས་ ID འདི་ རྩིས་ཐོ་ས་སྒོ་དམ་དམ་ཚུ་གི་དོན་ལུ་ ནུས་ཅན་ཨིན། དེ་ལུ་མངའ་ཁོངས་ཅིག་མཉམ་སྦྲགས་མ་འབད། `.primary_alias` ལས་ མིང་གཞན་འདི་ ལག་ལེན་པ་ལུ་གདོང་ལན་འབད་མི་ འཚོལ་ཞིབ་ལྡེ་མིག་ཨིན་ གཞན་མི་ ཚད་ལྡན་ངོ་རྟགས་མེན།

### 2. ཁྱོད་ཀྱི་ Taira I105 ID ལས་འབྱུང་ཞིནམ་ལས་ རང་བཞིན་གནས་གོང་བཟོ་དགོ། {#_2-derive-and-normalize-your-taira-i105-id}

ས་གནས་ཀྱི་བཟོ་སྒྲིག་ནང་ལས་ མི་མང་གི་ལྡེ་མིག་རྐྱངམ་ཅིག་ ཀློག་ཚུགས། མི་མང་གི་ལྡི་མིག་དེ་ དབྱེ་བ་སོ་སོར་ལུ་ མི་མང དྲ་རྒྱ གསལ་སྡུད ཚུ་གི་དོན་ལུ་ ཨེབ་གཏང་འབདཝ་ཨིན། འདི་འབདཝ་ལས་ `taira` གསལ་ཏོག་ཏོ་སྦེ་གདམ་ཁ་རྐྱབས།

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

སྤྱིར་བཏང་བཟོ་ཡོད་པའི་གནས་གོང་འདི་ `TAIRA_ACCOUNT_ID` དང་འདྲ་མཚུངས་འོང་དགོ། TOML ཡིག་སྣོད་ནང་ལུ་ `[account].domain` གཞི་སྒྲིག་འདི་ `wonderland.universal` འོང་ནི་ཨིན་རུང་ གནས་གོང་དེ་གིས་ འགྲུལ་ལམ་དང་ མིང་གཞན་སྐབས་དོན་ལུ་རྐྱངམ་ཅིག་ གནོད་པ་བརྐྱབ་ཨིན།

### ༣.རྩིས་ཐོ་དང་ ཅ་དངོས་ཚུ་ ཀློག་ཐེངས། {#_3-read-the-account-and-its-assets}

རྩིས་ཐོ་འདི་ གཞི་བཙུགས་ཚར་བའི་ཤུལ་ལས་ ཐད་ཀར་དུ་དྲིས་ཞིནམ་ལས་ ཚད་འཛིན་ཅན་གྱི་ རྒྱུ་དངོས་གི་ཤོག་ལེབ་ཅིག་བཀོད་དགོ། URL-ལམ་སྟོན་ནང་ལུ་ ལག་ལེན་འཐབ་པའི་ཧེ་མར་ I105 གནས་གོང་ལུ་ ཨེབ་གཏང་འབད་.

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

### 4.རྩིས་ཐོ་དང་འབྲེལ་བའི་མིང་རྟགས་ཚུ་འཚོལ་དགོ། {#_4-look-up-aliases-bound-to-the-account}

ཕྱིར་ལོག་ཐབས་ཤེས་འདི་གིས་ ཚད་ལྡན་རྩིས་ཐོ་ཨའི་ཌི་གཅིག་ངེས་བདེན་ངོས་ལེན་འབདཝ་ཨིན། མི་མང་གནད་སྡུད་ས་སྟོང་གྲལ་ཐིག་ཚུ་ ཞུ་བ་-མིང་རྟགས་མགོ་ཡིག་ཚུ་མེད་པར་ལྷག་ཚུགས། བཀག་ཆ་འབད་ཡོད་པའི་གནད་སྡུད་ས་སྒོ་ཚུ་ལུ་ དབང་སྤྲོད་ཡོད་པའི་མིང་རྟགས་བཀོད་ཡོད་པའི་ཞུ་བ་དགོཔ་ཨིན།

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

`total: 0` ནུས་ཅན་ཨིན་: རྩིས་ཐོ་ཅིག་ལུ་ མིང་གཞན་དགོཔ་མེད། བཱའིན་ཌིང་ཅིག་ཡོད་པའི་སྐབས་ དེ་གི་ངེས་བདེན་ཡོངས་རྫོགས་ཤེས་ཚད་ཅན་གྱི་མིང་གཞན་འདི་སེལ་འཐུ་འབད་ཞིནམ་ལས་ སླར་ལོག་འབད་ཡོད་པའི་རྩིས་ཐོ་ཨའི་ཌི་འདི་ག་བསྡུར་རྐྱབ།

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

Taira བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག གིས་ རང་སོའི་རྩིས་ཐོ་ལེན་མི་ལུ་བྱིན་རུང་ འདི་གིས་ སྤྱིར་བཏང་རྩིས་ཐོ་གི་ཐོ་ཡིག་དང་ ཡང་ན་ མིང་རྟགས་འཛིན་སྐྱོང་དབང་འཛིན་མ་བྱིན་པས། གཞན་གྱི་རྩིས་ཐོ་ཅིག་གུ་ ཐོ་བཀོད་འབད་དགོ་པ་ཅིན་ `CanRegisterAccount` འདི་ལག་རྩལ་ཅན་གྱི་ཨེབ་རྟ་ནང་བཙུགས་དགོཔ་ཨིན། རྩིས་ཐོ་གི་མིང་རྟགས་འདི་ཡང་ སྤྱིར་བཏང་ལུ་ SNS གྱི་ལག་ལེན་དང་ འོས་འབབ་ཅན་གྱི་མིང་རྟགས་ཀྱི་ཆོག་ཐམ་ཚུ་ དགོཔ་ཨིན། སྒྲིག་གཞི་བཟོ་ཡོད་པའི་ ནང་ཐོ་བཀོད་/མིང་རྟགས་འཆར་གཞིའི་ལག་ལེན་འཐབ་ ཡང་ན་ ཐོན་སྐྱེད་འབད་མི་ ས་གནས་ཁ་ཐུག་ལས་ ཐོ་བཀོད་ཉམས་མྱོང་འབད་ཚུགས།

:::

ཉེ་གནས་ཡོངས་འབྲེལ་གུ་ལུ་ ཉེན་སྲུང་ཅན་གྱི་མིང་རྟགས་བཀོད་མི་-བཀྲམ་སྤེལ་གྱི་གོ་རིམ་ཅིག་གིས་ ཚད་ལྡན་གསརཔ་ `NEW_ACCOUNT_ID` ཕྱིར་འདྲེན་འབད་ཚར་བའི་ཤུལ་ལས་ ཐོ་བཀོད་ཁ་ཐོག་འདི་:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

ཡིག་ཆ་ཡང་ན་གློག་རིམ་མཛོད་ཁང་གི་ཕྱི་ཁར་མཐུན་སྒྲིག་སྒེར་གྱི་ལྡེ་མིག་འདི་བཟོ་བཏོན་འབད་དེ་གསོག་འཇོག་འབད། ཚད་འཛིན་ལྡེ་མིག་བཏོན་བཏང་ཡོད་པའི་ཨའི་ཌི་ཅིག་ཐོ་བཀོད་འབད་མི་འདི་གིས་ ལག་ལེན་འཐབ་མ་བཏུབ་པའི་རྩིས་ཐོ་ཅིག་གསར་བསྐྲུན་འབདཝ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

རིམ་སྒྲིག་མི་མང་ལྡེ་མིག་དང་ I105 ཨིན་ཀོ་ཌིང་ དེ་ལས་ མིང་གཞན་བསྡམ་བཞག་མི་ཚུ་ག་ར་ ཚད་ལྡན་རྩིས་ཐོ་ཨའི་ཌི་གཅིག་གུ་བསྡུ་སྒྲིག་འབདཝ་ཨིནམ་བདེན་ཁུངས་བཀལ།

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

ཚད་ལྡན རྩིས་ཐོ IDs ཚུ་བསག་བཞག་འབད། མིང་རྟགས, གནང་བ དང་ ཚོང་འབྲེལ བཀོད་རྒྱ ཚུ་ལུ་ ཚད་ལྡན IDs ལག་ལེན་འཐབ། གློག་རིམ མཐའ་མཚམས གུ་ མིང་གཞན སེལ འབད་ཞིནམ་ལས་ བཀོལ་སྤྱོད ལུ་ལག་ལེན་འཐབ་མི་ ཚད་ལྡན རྩིས་ཐོ ID དེ་བཞག།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- དབྱེ་དཔྱད་ཡང་ན་སྔོན་སྒྲིག་འཛོལ་བ་འདི་གིས་ སྤྱིར་བཏང་ལུ་ ཁ་བྱང་ཅིག་ ཡོངས་འབྲེལ་གསལ་སྡུད་སོ་སོ་ཅིག་གི་དོན་ལུ་ ཨིན་ཀོ་ཌི་འབད་ཡོདཔ་སྦེ་ གོཝ་ཨིན། `--profile taira` དང་ཅིག་ཁར་སྤྱིར་བཏང་བཟོ་ཞིནམ་ལས་ མ་མཐུན་མི་ཚུ་ ངོས་ལེན་མ་འབད།
- བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་ `404` གི་ཤུལ་ལས་ རྩིས་ཐོ་ `202` འདི་ ཁྱབ་སྤེལ་ཕྱིར་འགྱངས་འབད་ཚུགས། འབྲི་མ་གཏང་པའི་ཧེ་མ་ རྩིས་ཐོ་ཡང་ན་ མ་དངུལ་བཏང་ཡོད་པའི་རྒྱུ་དངོས་འདི་ འོས་འདེམས་འབད།
- `total: 0` ཕྱིར་ལོག་ཐག་གཅོད་འབད་མི་ལས་ མཐོང་གསལ་ཅན་གྱི་མིང་གཞན་ཅིག་ཡང་ མཐུད་མེདཔ་ཨིན། འདི་རྩིས་ཐོ་འཚོལ་ཞིབ་འཐུས་ཤོར་ཅིག་མེན།
- `401` ཡང་ན་ `403` མིང་གཞན་འགྲུལ་ལམ་ལས་ བཀག་ཆ་འབད་ཡོད་པའི་ གནད་སྡུད་ས་སྟོང་ ཡང་ན་ ཏག་ཏག་ཐབས་ཤེས་གནང་བ་ལངམ་སྦེ་མེདཔ་སྦེ་སྟོནམ་ཨིན། རྒྱ་ཆེ་བའི་སྔོན་སྒྲིག་འཚོལ་ཞིབ་འདི་ ཕོལབེཀ་སྦེ་ལག་ལེན་མ་འཐབ།
- ཀློག་ཚུགས་པའི་ `name@domain.dataspace` ཚད་གཞི་འདི་ ཆ་མེད་གཏང་ནི་ཨིནམ་ད་ དངོས་གྲུབ་ཅན་གྱི་ I105 ID དགོཔ་ཨིན། དང་པ་འདི་ སེལ་འཐུ་འབད།
- ས་གནས་ཀྱི་རྩིས་ཐོ་གི་ ཐོ་བཀོད་དེ་ གྲུབ་འབྲས་ཐོན་རུང་ Taira གིས་ ཆ་མེད་བཏང་པ་ཅིན་ ཁྱད་པར་འདི་ ངོས་ལེན་འབད་ནི་ཨིན། `CanRegisterAccount`ཐོབ་ནི་; སྒྲིག་འཇུག་མ་སྤར་བའི་དོན་ལུ་རྩིས་ཐོ་ ID བསྒྱུར་བཅོས་མ་རྐྱབས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [ཚད་ལྡན་གྱི་རྩིས་ཐོའི་ཁ་བྱང་ཚུ་ གཏན་སྦྱར་ཡོད་པའི་གི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs) ལུ་ལག་ལེན་འཐབ་ནི།
- [རྩིས་ཐོ་དང་ མིང་རྟགས་ Torii བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs) ལུ་འབདཝ་ཨིན།
- [རྩིས་ཐོ་ཚུ་](/dz/blockchain/accounts.md)
- [ཌའི་ཊ་གི་དཔེ་ཆ་གྱི་མིང་རྟགས་](/dz/blockchain/data-model.md#aliases)
- [མིང་བཏགས་པའི་ཞལ་འཆེས་](/dz/reference/naming.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
