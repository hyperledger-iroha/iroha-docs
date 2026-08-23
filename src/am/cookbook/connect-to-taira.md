---
translation_locale: am
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ወደ Taira ይገናኙ። {#connect-to-taira}

## ውጤቱ {#outcome}

Taira ተደራሽ መሆኑን ያረጋግጡ ፣ ካኖኒካዊውን I105 መለያ ID ከአከባቢው የደንበኛ ውቅር ይምረጡ ፣ ፊርማውን በቴስትኔት XOR ያግኙ እና አንድ ክፍያ የተጠየቀ የካናሪ ግብይት ያቅርቡ ። ይህ የምግብ አሰራር በጭራሽ ወደ Minamoto መጻፍ አይልክም።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`, `jq`, Python 11 ወይም ከዚያ በኋላ, እና የአሁኑ `iroha` እና `kagami` የሁለትዮሽ.
- በ Taira ሰንሰለት ፣ መጨረሻ ነጥብ ፣ የመለያ መገለጫ እና የተወሰነ የሙከራ ኔትወርክ ቁልፍ የተፈጠረ `taira.client.toml`። የ [ን ይከተሉ። የ Taira ደንበኛ ቅንብር](/am/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ይፍጠሩ እና ፋይሉን ከምንጭ ቁጥጥር ውጭ ያድርጉ ።
- ለመሮጥ ዝግጁ የሆነው `taira_faucet_claim.py` ከ [Testnet ን ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), ከደንበኛው ኮንፊግሬሽን አጠገብ የተቀመጠ።

## እርምጃዎች {#steps}

### 1. ከዝግጅት የመነሳት ችሎታ {#_1-separate-liveness-from-readiness}

`/livez` ቀላል-ጽሑፍ ሂደት-የህይወት ፍተሻ ነው. `/status`, `/health`, እና `/readyz` መመለስ JSON. አንድ የሂደት ኖት የሚፈለገው ንዑስ ስርዓት ሲታገድ ከዝግጅት ምርመራዎች ህጋዊ በሆነ መንገድ `503` መመለስ ይችላል.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` ን በመጠቀም ብቻ ሂደቱ ምላሽ የሚሰጥ መሆኑን ለመወሰን ይጠቀሙ. `/readyz` ን ለትራፊክ ማስገቢያ ይጠቀሙ እና JSON መቆለፊያ ዝርዝሮችን ከመቆጣጠርዎ በፊት `503` ን እንደ ማቋረጥ ይቆጥቡ ።

### 2. የሕዝብ ምርመራዎችን ማካሄድ {#_2-run-the-public-diagnostics}

ይህ ቼክ የሚነበበው ብቻ ነው እና ፊርማ ሰሪውን አያጫንም:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ሐኪሙ ከባድ DNS ፣ TLS ፣ ሰንሰለት ወይም መጨረሻ ነጥብ አለመሳካቱን ሲገልጽ መጻፍዎን አይቀጥሉ። የተሟላ የህዝብ ረድፍ ጊዜያዊ ነው; ይጠብቁ እና በተወሰነ ፖሊሲ እንደገና ይሞክሩ ።

### የ Taira መለያ ID ሚስጥር ሳይታተም ይዞት {#_3-derive-the-taira-account-id-without-printing-a-secret}

የሕዝብ ቁልፍን ብቻ ያንብቡ, ከዚያም በ ኮድ Taira I105 መገለጫ. `[account].domain` የዋጋ አቅርቦቶች የመመሪያ አውድ; ይህ የሂሳብ አካል አይደለም ID.

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

የውጤቱ ጎራ የሌለው ቀኖናዊ I105 አድራሻ ነው ። እንደ `wallet@payments.universal` ያሉ ስሞች ቅጽል ስሞች ናቸው እናም በጥብቅ የሂሳብ መስኮች ውስጥ ከመጠቀምዎ በፊት መፍትሄ ማግኘት አለባቸው።

### የአሁኑን Taira የክፍያ ንብረትን ለመጠየቅ። {#_4-claim-the-current-taira-fee-asset}

የውሃ ቧንቧ ምላሽ የክፍያ ንብረቶች ትርጉም እውነት ምንጭ ነው. ከሌላ አውታረመረብ ወይም ከአሮጌው ሩጫ ID ቅጂ ከመቅዳት ይልቅ የተመለሰውን Base58 ID ይያዙ.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

ሚዛኑን እስከ አንድ ደቂቃ ድረስ ይከታተሉ. የገንዘብ ድጋፍ ግብይቱ ከመታየቱ በፊት የቧንቧው `202 Accepted` መመለስ ይችላል ።

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

`gas_asset_id` የግብይት ሜታዳታ ነው። ግልፅ የሆነው `--fee-payer authority` ምርጫ በፊርማ የተገደበ ነው ፣ እና CLI ከመፈረምዎ በፊት ትክክለኛውን ክፍያ ዋጋ ያገኛል።

## ያረጋግጡ {#verify}

መዝገብ መመሪያ ማስገባት, የ JSON ደረሰኝ መጠበቅ, እና ተግባራዊ ፍጻሜ ድረስ ይጠብቁ. `--no-wait` ማስወገድ ደግሞ የመጀመሪያ ማቅረቢያ ማረጋገጫ የሚጠብቅ ያደርገዋል; ግልፅ ሁኔታ ንባብ የመጨረሻ ቱቦ መስመር ሁኔታ የሚያረጋግጥ.

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

የመጨረሻው ትዕዛዝ የተሳካ የሚሆነው ግብይቱ ነባሪውን `Applied` ተርሚናል ሁኔታ ከደረሰ በኋላ ብቻ ነው። ሃሽ በሙከራ ማስረጃ ውስጥ ይጠብቁ; የግል ቁልፉን ወይም ሙሉ የደንበኞችን ውቅር ከእሱ ጋር በጭራሽ አያከማቹ ።

## ችግሮችን መፍታት {#troubleshooting}

- `/livez` ተመላሾች `406` ሲጠየቁ JSON ምክንያቱም ይህ መጨረሻ ነጥብ `text/plain`. ላክ `Accept: text/plain` ከላይ እንደታየው።
- `/health` ወይም `/readyz` የ `503` ማሽን ሊነበብ በሚችል አግዳሚ አማካኝነት `/livez` እና `/status` በሚሰሩበት ጊዜም እንኳ መልሰው ሊሰጡ ይችላሉ ። ያንን አግዳሚ ያዘጋጁ ወይም ይጠብቁ; የመልሶ ማቋቋም ቁልፎች የአገናኝን ዝግጁነት አይቀይሩም።
- `502` ቧንቧ፣ የጊዜ ገደብ ወይም የቆየ የስራ ማስረጃ አናከር የህዝብ አገልግሎት ውድቀት ነው። አዲስ እንቆቅልሽ አምጣ በኋላ ላይ እንደገና ሞክር።
- የ I105 ቅድመ ቅደም ተከተል ስህተት ማለት የህዝብ ቁልፍ በተሳሳተ መገለጫ ተመዝግቧል ማለት ነው. እንደገና ይሂዱ `iroha tools address convert --profile taira`.
- የክፍያ መጠየቂያ ውድቅ ማድረግ አብዛኛውን ጊዜ ባለሥልጣኑ አልተደገፈም ማለት ነው ፣ የክፍያው አክሲዮን ሜታዳታ የዘመነ ነው ፣ ወይም ምንም ግልፅ ክፍያ ሰጪ አልመረጠም።
- ይህ ካናሪ ስኬታማ ከሆነ በኋላ ምዝገባ ፣ ማጣሪያ ወይም የስም ቦታ አስተዳደር አሁንም ውድቅ ሊደረግ ይችላል ። እነዚህ ሥራዎች የተለየ የአሂድ ጊዜ ፍቃዶችን ይጠይቃሉ; Taira መዳረሻ ያልተሰጠበት ጊዜ በተፈጠረው አካባቢያዊ አውታረ መረብ ላይ ይለማመዱ ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [Taira CLI የዲጂኖስቲክስ እና የካናሪ ምንጭ በፒን የተቀመጠ ኮሚት](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [በግልጽ የሚከፈልበትን ክፍያ መምረጥ እና CLI ማቅረቢያ ምንጭ በተያዘለት ተልእኮ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs) ላይ።
- [Taira ሂሳብ እና የቧንቧ መመሪያ](/am/get-started/sora-nexus-dataspaces.md)
- [የደንበኛው ውቅር](/am/guide/configure/client-configuration.md)
- [ግብይቶች](/am/blockchain/transactions.md)
