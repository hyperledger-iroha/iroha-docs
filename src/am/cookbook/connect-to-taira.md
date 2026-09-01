---
translation_locale: am
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ከ Taira ጋር ይገናኙ {#connect-to-taira}

## ውጤት {#outcome}

Taira ሊደረስበት የሚችል መሆኑን ያረጋግጡ፣ ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መለያ መታወቂያ ከአካባቢያዊ ደንበኛ ውቅር ያውጡ፣ ምስጠራ ፈራሚውን በቴስትኔት XOR የገንዘብ ድጋፍ ያድርጉ እና አንድ በክፍያ የተጠቀሰ የካናሪ ግብይት ያስገቡ። ይህ የተግባር መመሪያ ወደ Minamoto የመጻፍ ክዋኔ በጭራሽ አይልክም።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Python ስሪት 3.11 ወይም ከዚያ በኋላ፣ እና የአሁኑ `iroha` እና `kagami` ሁለትዮሽ።
- በ Taira ሰንሰለት፣ API የመጨረሻ ነጥብ፣ የመለያ መገለጫ እና የተወሰነ የቴስትኔት ቁልፍ የተፈጠረ `taira.client.toml`። [የ Taira የደንበኛ ውቅር ይፍጠሩ](/am/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)ን ይከተሉ እና ፋይሉን ከምንጭ ቁጥጥር ውጭ ያድርጉት።
- ለመሮጥ ዝግጁ `taira_faucet_claim.py` ከ [Testnet ያግኙ XOR በርቷል Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), ከደንበኛው ውቅር አጠገብ ተቀምጧል።

## እርምጃዎች {#steps}

### 1. ሕያውነትን ከዝግጁነት ይለዩ {#_1-separate-liveness-from-readiness}

`/livez` ግልጽ የሆነ የጽሑፍ ሂደት-ሕያው ምርመራ ነው።. `/status`፣ `/health` እና `/readyz` ይመለሳሉ JSON። የሚፈለገው ንዑስ ስርዓት ሲታገድ የሚሮጥ ኖድ `503` ከዝግጁነት መመርመሪያዎች በህጋዊ መንገድ መመለስ ይችላል።

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

ሂደቱ ምላሽ መስጠቱን ለማወቅ `/livez`ን ብቻ ይጠቀሙ። ትራፊክን ለመቀበል `/readyz`ን ይጠቀሙ፤ `503`ን እንደ መቋረጥ ከመቁጠርዎ በፊት የ JSON የእንቅፋት ዝርዝሮቹን ይመርምሩ።

### 2. የህዝብ ምርመራዎችን ያሂዱ {#_2-run-the-public-diagnostics}

ይህ ቼክ ተነባቢ-ብቻ ነው እና ምስጠራ ፈራሚ ውቅረትን አይጭንም -

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ዶክተሩ ከባድ DNS፣ TLS፣ ሰንሰለት ወይም API የመጨረሻ ነጥብ ውድቀትን ሲዘግብ መጻፍዎን አይቀጥሉ። የተሞላ የህዝብ ወረፋ ጊዜያዊ ነው; ይጠብቁ እና በተገደበ ፖሊሲ እንደገና ይሞክሩ።

### 3. ሚስጥር ሳያትሙ የ Taira መለያ መታወቂያውን ያግኙ {#_3-derive-the-taira-account-id-without-printing-a-secret}

የህዝብ ቁልፉን ከማዋቀሩ ብቻ ያንብቡ እና ከዚያ በ Taira I105 መገለጫ ኮድ ያድርጉት። የ `[account].domain` እሴት የማስተላለፊያ አውድ ያቀርባል; የመለያ መታወቂያው አካል አይደለም።

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

ውጤቱ ጎራ የሌለው ነጠላ ፕሮቶኮል-መደበኛ I105 አድራሻ ነው። እንደ `wallet@payments.universal` ያሉ ስሞች ተለዋጭ ስሞች ናቸው እና በጥብቅ የመለያ መስኮች ውስጥ ጥቅም ላይ ከመዋላቸው በፊት መፈታት አለባቸው።

### 4. የአሁኑን Taira ክፍያ ንብረት ይጠይቁ {#_4-claim-the-current-taira-fee-asset}

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ምላሽ ለክፍያ ንብረት ፍቺ የእውነት ምንጭ ነው። መታወቂያውን ከሌላ አውታረ መረብ ወይም ከአሮጌ ሩጫ ከመቅዳት ይልቅ የተመለሰውን Base58 መታወቂያ ያስቀምጡ።

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

ቀሪ ሒሳቡን ቢበዛ ለአንድ ደቂቃ ይመርጡ። የገንዘብ ድጋፍ ግብይቱ ከመታየቱ በፊት የቴስትኔት የገንዘብ ድጋፍ አገልግሎት `202 Accepted` ሊመለስ ይችላል።

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

`gas_asset_id` የግብይት ሜታዳታ ነው። ግልጽ የሆነው `--fee-payer authority` ምርጫው ከፊርማው ጋር የተሳሰረ ነው፣ እና CLI ከመፈረሙ በፊት ትክክለኛ የክፍያ ዋጋ ግምት ያገኛል።.

## አረጋግጥ {#verify}

የምዝግብ ማስታወሻ መመሪያ ያስገቡ፣ የ JSON ደረሰኝ ያስቀምጡ እና የተተገበረውን የመጨረሻነት ይጠብቁ። `--no-wait`ን መተው የመጀመሪያውን ግቤት ማረጋገጫ እንዲጠብቅ ያደርገዋል። ግልጽ የሆነው ሁኔታ ንባብ የመጨረሻውን የሶፍትዌር ማቀነባበሪያ የስራ ፍሰት ሁኔታን ያረጋግጣል።

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

የመጨረሻው ትዕዛዝ የሚሳካው ግብይቱ ነባሪው `Applied` ተርሚናል ሁኔታ ላይ ከደረሰ በኋላ ብቻ ነው። ምስጠራውን ሃሽ በሙከራ ማስረጃ ውስጥ ያስቀምጡ; የግል ቁልፉን ወይም ሙሉውን የደንበኛ ውቅር በጭራሽ አያከማቹ።

## መላ ፍለጋ {#troubleshooting}

- `/livez` JSON ሲጠየቅ `406` ይመልሳል ምክንያቱም ያ API የመጨረሻ ነጥብ `text/plain` ነው። ከላይ እንደሚታየው `Accept: text/plain` ይላኩ።
- `/health` ወይም `/readyz` `/livez` እና `/status` በሚሰሩበት ጊዜም ቢሆን `503` በማሽን ሊነበብ በሚችል እንቅፋት ሊመለሱ ይችላሉ። ያንን እንቅፋት ያስተካክሉ ወይም ይጠብቁ; ቁልፎችን እንደገና ማደስ የኖድ ዝግጁነትን አይለውጥም።
- የቴስትኔት የገንዘብ ድጋፍ አገልግሎት `502`፣ የጊዜ ማብቂያ ወይም የቆየ የስራ ማረጋገጫ መልህቅ የህዝብ አገልግሎት ውድቀት ነው። አዲስ እንቆቅልሽ አምጡ እና በኋላ እንደገና ይሞክሩ።
- የ I105 ቅድመ ቅጥያ ስህተት ማለት ይፋዊ ቁልፉ በተሳሳተ መገለጫ ተመዝግቧል ማለት ነው። እንደገና ያሂዱ `iroha tools address convert --profile taira`።
- የክፍያ ዋጋ አለመቀበል ብዙውን ጊዜ የፈቃድ ርዕሰ መምህሩ የገንዘብ ድጋፍ አልተደረገለም፣ የክፍያ ንብረት ሜታዳታ ጊዜው ያለፈበት ወይም ምንም ግልጽ ክፍያ ከፋይ አልተመረጠም ማለት ነው።
- ይህ ካናሪ ከተሳካ በኋላ ምዝገባ፣ መስጠት ወይም የስም ቦታ አስተዳደር አሁንም ውድቅ ሊደረግ ይችላል። እነዚያ ክዋኔዎች የተለየ የሶፍትዌር ማስፈጸሚያ አካባቢ ፈቃዶችን ይፈልጋሉ; Taira መዳረሻ ካልተሰጠ በተፈጠረው የአካባቢ አውታረመረብ ላይ ይለማመዱዋቸው።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [Taira CLI ምርመራ እና የካናሪ ምንጭ በተሰካው የምንጭ-ኮድ ክለሳ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [ግልጽ የሆነ የክፍያ ምርጫ እና CLI የማስረከቢያ ምንጭ በተሰካው የምንጭ-ኮድ ክለሳ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira የመለያ እና የቴስትኔት የገንዘብ ድጋፍ አገልግሎት መመሪያ](/am/get-started/sora-nexus-dataspaces.md)
- [የደንበኛ ውቅር](/am/guide/configure/client-configuration.md)
- [ግብይቶች](/am/blockchain/transactions.md)
