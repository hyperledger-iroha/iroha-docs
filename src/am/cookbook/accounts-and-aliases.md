---
translation_locale: am
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# መለያዎችና ስሞች {#accounts-and-aliases}

## ውጤቱ {#outcome}

ጎራ የሌለው ካኖኒካል ጋር ደህንነቱ በተጠበቀ ሁኔታ ይሰራሉ I105 ሂሳብ IDs እና በተናጠል የተገናኙ ለሰው ሊነበብ የሚችል ስያሜዎች ለምሳሌ `treasury@payments.universal`. አንተም ትመረምራለህ Taira ሂሳቦች, የራስህን የካኖኒካል ማግኘት ID, እንዲሁም የጉዞ አውድ ከማንነት ጋር ሳያጣምሩ ስያሜዎችን መፍታት።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`, `jq`, Python 11 ወይም ከዚያ በኋላ, እና የአሁኑ `iroha` CLI.
- ሀ `taira.client.toml` ከ [ጋር ይገናኙ Taira](./connect-to-taira.md) የራስህን ሂሳብ ሲመረምር።
- በ Taira ቧንቧ ወይም በአውታረ መረቡ የሚተዳደረው የመጫኛ መንገድ በኩል የተቀመጠው ሂሳብ ለሂሳቡ የተወሰነ ንባብ እንዲሳካ ከመጠበቁ በፊት።

## እርምጃዎች {#steps}

### 1. Taira ላይ የሚገኙትን የካኖኒክ ሂሳቦች መመርመር። {#_1-inspect-canonical-accounts-on-taira}

የሕዝብ ሂሳብ ዝርዝር ሁልጊዜ የካኖኒካል I105 IDs ይመለከታል. የመጀመሪያ ስም አማራጭ ነው እና በተናጠል ሪፖርት ይደረጋል.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID ከ `.id` ለጠንካራ የሂሳብ መስኮች ይሰራል. ጎራ አይጨምሩበት። ከ `.primary_alias` ቅጽል ስም ለተጠቃሚው የሚመጥን ፍለጋ ቁልፍ ነው, ሌላ መደበኛ ማንነት አይደለም.

### 2. የ Taira I105 ID ዎን ማመንጨት እና መደበኛ ማድረግ። {#_2-derive-and-normalize-your-taira-i105-id}

በአካባቢያዊ ውቅር ላይ ያለውን የሕዝብ ቁልፍ ብቻ ያንብቡ. ተመሳሳይ የህዝብ ቁልፍ ለተለያዩ የህዝብ አውታረ መረብ መገለጫዎች በተለየ መንገድ ይኮድ ነው, ስለዚህ `taira` ን በግልጽ ይምረጡ.

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

መደበኛ ዋጋው ከ `TAIRA_ACCOUNT_ID` ጋር ተመሳሳይ መሆን አለበት ። በ TOML ፋይል ውስጥ ያለው የ `[account].domain` ቅንብር `wonderland.universal` ሊሆን ይችላል ፣ ግን ያ እሴት በመንገድ እና በስያሜ አውድ ብቻ ይነካል ።

### 3. ሂሳቡንና ሀብቱን አንብብ። {#_3-read-the-account-and-its-assets}

ሂሳቡ ከተዘጋጀ በኋላ በቀጥታ ይጠይቁት እና የተወሰነ የንብረት ገጽ ይዘርዝሩ ። URL -በመንገድ ውስጥ ከመጠቀምዎ በፊት የ I105 እሴት ኢንኮድ ያድርጉ።

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

### 4. ከሂሳቡ ጋር የተያያዙ ቅጽል ስሞችን ፈልግ {#_4-look-up-aliases-bound-to-the-account}

Reverse Resolver አንድ ትክክለኛ የካኖኒክ መለያ ID ይቀበላል ። የህዝብ የመረጃ ቋት ረድፎች ያለ ጥያቄ-መፈረም ራስጌዎች ሊነበብ ይችላል ፣ የተገደቡ የመረጃ ቋቶች የተፈቀደ ፊርማ ያለበት ጥያቄ ይጠይቃሉ ።

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

`total: 0` ትክክለኛ ነው: አንድ መለያ ስያሜ አያስፈልገውም. አስገዳጅነት በሚኖርበት ጊዜ, ሙሉ በሙሉ የተረጋገጠ ስያሜውን በትክክል ይፈትሹ እና ተመላሽ የሆነውን መለያ ID ያወዳድሩ

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

::: warning የተፈቀደለት ገደብ

የ Taira ቧንቧ የአመልካች አካውንቱን ማቅረብ ይችላል ፣ ግን ይህ አጠቃላይ የሂሳብ ምዝገባ ወይም ቅጽል ስም-አስተዳደር ባለስልጣን አይሰጥም ። ሌላ ሂሳብ መመዝገብ በሥራ ላይ ባለው የማረጋገጫ ሰጪ ስር `CanRegisterAccount` ይጠይቃል። የሂሳብ ስያሜዎች በተለምዶ ንቁ SNS ኪራይ እና ተገቢውን የስያሜ ስም ፍቃዶች ይጠይቃሉ ። የሚተዳደረውን የኦንቦርድ / ስያሜ ፕላነር ይጠቀሙ ፣ ወይም ከተፈጠረው አካባቢያዊ አውታረ መረብ ጋር ምዝገባን ይለማመዱ።

:::

በአካባቢያዊ አውታረመረብ ላይ, ደህንነቱ የተጠበቀ ፊርማ ማቅረብ እርምጃ አዲስ ቀኖናዊ `NEW_ACCOUNT_ID` ወደ ውጭ ከተላከ በኋላ, የምዝገባው ወለል ነው:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

ተመጣጣኝ የሆነውን የግል ቁልፍ ከ ሰነድ ወይም ከመተግበሪያ መዝገብ ውጭ ማመንጨት እና ማስቀመጥ ። ID ተቆጣጣሪው ቁልፍ የተጣለበት የማይሰራ አካውንት ይፈጥራል።

## ያረጋግጡ {#verify}

የማስመሰል የህዝብ ቁልፍ ፣ I105 ኢንኮዲንግ እና ሁሉንም የሚያገናኝ ቅጽል ስም በአንድ የካኖኒካል መለያ ID ላይ እንደሚቀላቀል ያረጋግጡ:

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

ቀኖናዊ መለያ IDs ያስቀምጡ። ለመፈረም ፣ ለፍቃዶች እና ለግብይት መመሪያዎች ቀኖናዊውን IDs ይጠቀሙ። በመተግበሪያው ወሰን ላይ ቅጽል ስም መፍታት ። ለድርጊቱ ጥቅም ላይ የዋለውን ቀኖናዊ መለያ ID ያቆዩ ።

## ችግሮችን መፍታት {#troubleshooting}

- የፓርሰስ ወይም ቅድመ ቅደም ተከተል ስህተት ብዙውን ጊዜ አንድ አድራሻ ለተለየ የአውታረ መረብ መገለጫ የተመዘገበ መሆኑን ያመለክታል. `--profile taira` ጋር መደበኛ እና አለመጣጣም ውድቅ ማድረግ.
- ከፋይ `202` በኋላ ያለው ሂሳብ `404` የዝግመተ ለውጥ መዘግየት ሊሆን ይችላል። ደብዳቤ ከመላክህ በፊት ሂሳቡን ወይም የገንዘብ ድጋፍ ያደረገውን ንብረት ጥናት አድርግ።
- `total: 0` ከገቢው ፈታኝ ማለት ምንም የሚታይ ስያሜ የለም; ይህ የሂሳብ ፍለጋ ውድቀት አይደለም.
- `401` ወይም `403` ከቅጽል ስያሜ መንገድ የተገደበ የውሂብ ቦታ ወይም በቂ ትክክለኛ መፍትሄ ፍቃድ አለመኖሩን ያመለክታል. እንደ ውድቀት ሰፋፊ የቅድመ ፊደላት ፍለጋን አይጠቀሙ።
- ሊነበብ የሚችል `name@domain.dataspace` ዋጋ በሁሉም ቦታ ተቀባይነት የለውም ቀኖናዊ I105 ID ያስፈልጋል.
- የአከባቢው መለያ ምዝገባ ስኬታማ ከሆነ ግን Taira ውድቅ የሚያደርግ ከሆነ ልዩነቱ ፈቃድ ነው. `CanRegisterAccount` ያግኙ; ማረጋገጫን ለማለፍ መለያውን ID አይለውጡ ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በፒን የተቀመጠ ኮሚቴ ላይ የካኖኒካል መለያ አድራሻ ትግበራ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs)
- [የሂሳብ እና ቅጽል ስም ሙከራዎች Torii በፒን የተደረገለት ተልእኮ ላይ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [መለያዎች](/am/blockchain/accounts.md)
- [የውሂብ ሞዴል ስያሜዎች](/am/blockchain/data-model.md#aliases)
- [የስም ስምምነቶች ](/am/reference/naming.md)
- [የፈቃድ ማስያዣዎች](/am/reference/permissions.md)
