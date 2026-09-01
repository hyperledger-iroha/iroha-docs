---
translation_locale: am
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# መለያዎች እና ተለዋጭ ስሞች {#accounts-and-aliases}

## ውጤት {#outcome}

ጎራ በሌለው ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መለያ መታወቂያዎች እና እንደ `treasury@payments.universal` ባሉ ሰዎች ሊነበቡ ከሚችሉ ተለዋጭ ስሞች ጋር ደህንነቱ በተጠበቀ ሁኔታ ይስሩ። የ Taira መለያዎችን ይመረምራሉ፣ የራስዎን ነጠላ ፕሮቶኮል-መደበኛ መታወቂያ ያገኛሉ እና የማስተላለፊያ አውድ ከማንነት ጋር ግራ ሳያደርጉ ተለዋጭ ስሞችን ይፈታሉ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Python 3.11 ወይም ከዚያ በኋላ፣ እና የአሁኑ `iroha` CLI።
- A `taira.client.toml` ከ [ይገናኙ Taira](./connect-to-taira.md) የራስዎን መለያ ሲመረምሩ.
- መለያ-ተኮር ንባብ ስኬታማ ይሆናል ከመጠባበቁ በፊት በ Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ወይም በአውታረ መረቡ በሚተዳደረው የመሳፈሪያ መንገድ የቀረበ መለያ።

## እርምጃዎች {#steps}

### 1. በ Taira ላይ ነጠላ ፕሮቶኮል-መደበኛ መለያዎችን ይፈትሹ {#_1-inspect-canonical-accounts-on-taira}

ይፋዊ መለያ ዝርዝር ሁልጊዜ ነጠላ ፕሮቶኮል-መደበኛ I105 መታወቂያዎችን ይመልሳል። ዋና ተለዋጭ ስም አማራጭ ነው እና ለብቻው ሪፖርት ይደረጋል።

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ከ`.id` የመጣ መታወቂያ ለጥብቅ የመለያ መስኮች የሚሰራ ነው። ጎራ በእሱ ላይ አያያይዙት። ከ`.primary_alias` የመጣ ተለዋጭ ስም ለተጠቃሚው የሚመለከት የመፈለጊያ ቁልፍ እንጂ ሌላ ነጠላ ፕሮቶኮል-መደበኛ ማንነት አይደለም።

### 2. የእርስዎን Taira I105 መታወቂያ ያግኙ እና መደበኛ ያድርጉት {#_2-derive-and-normalize-your-taira-i105-id}

ከአካባቢው ውቅር ውስጥ የህዝብ ቁልፍን ብቻ ያንብቡ። ተመሳሳዩ የህዝብ ቁልፍ ለተለያዩ የህዝብ blockchain አውታረ መረብ መገለጫዎች በተለየ መንገድ የተቀመጠ ነው፣ ስለዚህ `taira`ን በግልፅ ይምረጡ።

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

የተለመደው እሴት ከ `TAIRA_ACCOUNT_ID` ጋር ተመሳሳይ መሆን አለበት። በ TOML ፋይል ውስጥ ያለው የ`[account].domain` መቼት `wonderland.universal` ሊሆን ይችላል፣ ነገር ግን ያ እሴት በማዘዋወር እና ተለዋጭ ስም አውድ ላይ ብቻ ተጽዕኖ ያሳድራል።

### 3. መለያውን እና ንብረቶቹን ያንብቡ {#_3-read-the-account-and-its-assets}

መለያው ከቀረበ በኋላ በቀጥታ ይጠይቁት እና የታሰረ የንብረት ገጽ ይዘርዝሩ። URL - በመንገድ ላይ ከመጠቀምዎ በፊት የ I105 እሴቱን ኮድ ያድርጉ።

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

### 4. ከመለያው ጋር የተሳሰሩ ተለዋጭ ስሞችን ይፈልጉ {#_4-look-up-aliases-bound-to-the-account}

የተገላቢጦሽ ፈቺው አንድ ትክክለኛ ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያ ይቀበላል። የህዝብ ዳታ ቦታ ረድፎች ያለ ጥያቄ-ፊርማ ራስጌዎች ሊነበቡ ይችላሉ; የተከለከሉ የውሂብ ቦታዎች የተፈቀደ የተፈረመ ጥያቄ ያስፈልጋቸዋል።

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

`total: 0` ልክ ነው መለያ ተለዋጭ ስም አያስፈልገውም። አስገዳጅ ሲኖር ትክክለኛውን ሙሉ ብቁ ተለዋጭ ስሙን ይፍቱ እና የተመለሰውን የመለያ መታወቂያ ያወዳድሩ

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

::: warning የፍቃድ ወሰን

የ Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ለይገባኛል ጥያቄ አቅራቢው መለያው ገንዘብ ሊሰጥ ይችላል፣ ነገር ግን ያ አጠቃላይ የመለያ-ምዝገባ ወይም ተለዋጭ ስም አስተዳደር ስልጣን አይሰጥም። ሌላ መለያ መመዝገብ በነቃ አረጋጋጩ ስር `CanRegisterAccount` ያስፈልገዋል። የመለያ ተለዋጭ ስሞች በመደበኛነት ንቁ SNS የሊዝ ውል እና ተገቢውን ተለዋጭ ስም ፈቃዶች ያስፈልጋቸዋል። የሚተዳደረውን የመሳፈሪያ/ተለዋጭ ስም እቅድ አውጪን ይጠቀሙ ወይም በተፈጠረው የአካባቢ አውታረ መረብ ላይ ምዝገባን ይለማመዱ።

:::

በአካባቢያዊ አውታረመረብ ላይ፣ አንዴ ደህንነቱ የተጠበቀ የምስጠራ ፊርማ-ቁልፍ አቅርቦት እርምጃ አዲስ ነጠላ ፕሮቶኮል-ስታንዳርድ `NEW_ACCOUNT_ID` ወደ ውጭ ከላከ፣ የመመዝገቢያ ገጽታ -

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

ተዛማጅ የግል ቁልፍን ከሰነዱ ወይም ከመተግበሪያ ማከማቻ ውጭ ያፍጠሩ እና ያከማቹ። የመቆጣጠሪያ ቁልፉ የተጣለውን መታወቂያ መመዝገብ ጥቅም ላይ ሊውል የማይችል መለያ ይፈጥራል።

## አረጋግጥ {#verify}

የማዋቀሪያው የህዝብ ቁልፍ፣ I105 ኢንኮዲንግ እና ተለዋጭ ስም ማሰር ሁሉም በአንድ ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያ ላይ እንደሚሰበሰቡ ያረጋግጡ።

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

ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያዎችን ያከማቹ። ለፊርማዎች፣ ፈቃዶች እና የግብይት መመሪያዎች ነጠላ ፕሮቶኮል-መደበኛ መታወቂያዎችን ይጠቀሙ። በመተግበሪያው ወሰን ላይ ተለዋጭ ስም ይፍቱ። ለቀዶ ጥገናው ጥቅም ላይ የዋለውን ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያ ያቆዩ።

## መላ ፍለጋ {#troubleshooting}

- የመተንተን ወይም ቅድመ ቅጥያ ስህተት ብዙውን ጊዜ አድራሻ ለተለየ የአውታረ መረብ መገለጫ ተቀምጧል ማለት ነው። በ`--profile taira` መደበኛ ያድርጉ እና አለመመጣጠን ውድቅ ያድርጉ።
- ከገንዘብ አገልግሎቱ `202` በኋላ የመለያ `404` ምላሽ በስርጭት መዘግየት ሊከሰት ይችላል። የመጻፍ ክዋኔ ከመላክዎ በፊት መለያውን ወይም የተሞላውን ንብረት በየጊዜው ይጠይቁ።
- `total: 0` ከተገላቢጦሽ ፈቺ ማለት ምንም የሚታይ ተለዋጭ ስም አልታሰረም ማለት ነው; የመለያ ፍለጋ አለመሳካት አይደለም።.
- `401` ወይም `403` ከተለዋጭ ስም መንገድ የተገደበ የውሂብ ቦታ ወይም በቂ ያልሆነ ትክክለኛ የመፍታት ፍቃድ ያሳያል። ሰፊ ቅድመ ቅጥያ ፍለጋን እንደ ተተኪ አማራጭ አይጠቀሙ።
- ሊነበብ የሚችል `name@domain.dataspace` እሴት በሁሉም ቦታ ተቀባይነት የለውም ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መታወቂያ ያስፈልጋል። መጀመሪያ ይፍቱት.
- የአካባቢ መለያ ምዝገባ ከተሳካ ነገር ግን Taira ውድቅ ካደረገ ልዩነቱ ፍቃድ ነው። `CanRegisterAccount` ያግኙ; ማረጋገጫን ለማለፍ የመለያ መታወቂያውን አይቀይሩ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [ነጠላ ፕሮቶኮል-መደበኛ የመለያ አድራሻ ትግበራ በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ መለያ እና ተለዋጭ ስም Torii ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [መለያዎች](/am/blockchain/accounts.md)
- [የውሂብ-ሞዴል ተለዋጭ ስሞች](/am/blockchain/data-model.md#aliases)
- [ስምምነቶችን መሰየም](/am/reference/naming.md)
- [የፍቃድ ምልክቶች](/am/reference/permissions.md)
