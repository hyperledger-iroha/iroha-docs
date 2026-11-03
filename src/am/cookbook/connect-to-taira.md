---
translation_locale: am
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ከ Taira ጋር ይገናኙ {#connect-to-taira}

## ውጤት {#outcome}

Taira ሊደረስበት የሚችል መሆኑን ያረጋግጡ፣ ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መለያ መታወቂያ ከአካባቢያዊ ደንበኛ ውቅር ያውጡ፣ ምስጠራ ፈራሚውን በቴስትኔት XOR የገንዘብ ድጋፍ ያድርጉ እና አንድ በክፍያ የተጠቀሰ የካናሪ ግብይት ያስገቡ። ይህ የተግባር መመሪያ ወደ Minamoto የመጻፍ ክዋኔ በጭራሽ አይልክም።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Python ስሪት 3.11 ወይም ከዚያ በኋላ፣ እና የአሁኑ `iroha` እና `kagami` ሁለትዮሽ።
- በ Taira ሰንሰለት፣ ትክክለኛ `network_id`፣ API የመጨረሻ ነጥብ፣ የመለያ መገለጫ እና የተወሰነ የቴስትኔት ቁልፍ የተፈጠረ `taira.client.toml`። [የ Taira የደንበኛ ውቅር ይፍጠሩ](/am/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)ን ይከተሉ እና ፋይሉን ከምንጭ ቁጥጥር ውጭ ያድርጉት።
- ለቴስትኔት የገንዘብ ድጋፍ አገልግሎቱ የሂደት መዝገብ (journal) ሊጻፍበት የሚችል የስራ ማውጫ፦ `iroha taira account faucet prepare` `./taira-faucet`ን ለባለቤቱ ብቻ በሚደረስ መልኩ ይፈጥራል እና ቀድሞ ያለን ማውጫ አይተካም።

## እርምጃዎች {#steps}

### 1. ሕያውነትን ከዝግጁነት ይለዩ {#_1-separate-liveness-from-readiness}

`/livez`፣ `/health` እና `/readyz` ግልጽ የጽሑፍ (plain-text) ምርመራዎች ናቸው፤ `/status` JSON ይመልሳል። የስምምነት (consensus) መግቢያ ወይም ሌላ የሚፈለግ ንዑስ ስርዓት በማይገኝበት ጊዜ የሚሰራ ኖድ ከ`/readyz` `503` በህጋዊ መንገድ መመለስ ይችላል።

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

ሂደቱ ምላሽ መስጠቱን ለማወቅ `/livez`ን ብቻ ይጠቀሙ። ትራፊክን ለመቀበል `/readyz`ን ይጠቀሙ። የእሱ `503` ምንም የእንቅፋት ዝርዝር የሌለው የ`service_unavailable` የስህተት ውሂብ መያዣ ነው፣ ስለዚህ እንደ መቋረጥ ከመቁጠርዎ በፊት ከታች ያሉትን ምርመራዎች ያሂዱ።

### 2. የህዝብ ምርመራዎችን ያሂዱ {#_2-run-the-public-diagnostics}

ይህ ቼክ ተነባቢ-ብቻ ነው እና ምስጠራ ፈራሚ ውቅረትን አይጭንም -

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ዶክተሩ ከባድ DNS፣ TLS፣ ሰንሰለት ወይም API የመጨረሻ ነጥብ ውድቀትን ሲዘግብ መጻፍዎን አይቀጥሉ። የተሞላ የህዝብ ወረፋ ጊዜያዊ ነው; ይጠብቁ እና በተገደበ ፖሊሲ እንደገና ይሞክሩ።

### 3. ሚስጥር ሳያትሙ የ Taira መለያ መታወቂያውን ያግኙ {#_3-derive-the-taira-account-id-without-printing-a-secret}

የህዝብ ቁልፉን ከማዋቀሩ ብቻ ያንብቡ እና ከዚያ በ Taira I105 መገለጫ ኮድ ያድርጉት። የመለያ መታወቂያው ምንም ጎራ አይይዝም፤ `[account].profile` የሚመርጠው የአውታረ መረብ ቅድመ ቅጥያውን ብቻ ነው።

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

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ፖሊሲ የአሁኑን የክፍያ ንብረት ፍቺ ይሰይማል። መታወቂያውን ከሌላ አውታረ መረብ ወይም ከአሮጌ ሩጫ ከመቅዳት ይልቅ የፖሊሲውን Base58 መታወቂያ ያስቀምጡ። ፖሊሲው ለማግኘት የሚያገለግል ያልተፈረመ ውሂብ ነው፣ ስለዚህ አውቶሜሽን እያንዳንዱን ምላሽ ከማመን ይልቅ የሚጠብቃቸውን ሰጪ፣ የንብረት ፍቺ እና መጠን በቋሚነት መወሰን አለበት።

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` የስራ ማረጋገጫውን (proof of work) ይፈታል እና ትክክለኛውን የተፈረመ ግብይት ያስቀምጣል፤ `submit` ግብይቱን አንድ ጊዜ ይልካል እና ከተተገበረ በኋላ ይመለሳል። `submit` `Pending` ሪፖርት ካደረገ ወይም ጊዜው ካለፈ፣ ሌላ የይገባኛል ጥያቄ ከማዘጋጀት ይልቅ በተመሳሳይ ውቅር እና የሂደት መዝገብ `taira account faucet resume`ን ያሂዱ። ከዚያም ቀሪ ሒሳቡን ቢበዛ ለአንድ ደቂቃ በየጊዜው ይጠይቁ።

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

ለእያንዳንዱ የ Taira የመጻፍ ክዋኔ `--fee-payer authority` ይጠቀሙ። ምርጫው ከፊርማው ጋር የተሳሰረ ነው፣ እና CLI ከመፈረሙ በፊት ትክክለኛውን ክፍያ በ Taira የክፍያ ንብረት የሚገልጽ የክፍያ ዋጋ ግምት ያቀርባል።

## አረጋግጥ {#verify}

የምዝግብ ማስታወሻ መመሪያ ያስገቡ፣ የ JSON ደረሰኝ ያስቀምጡ እና የተተገበረውን የመጨረሻነት ይጠብቁ። `--no-wait`ን መተው የመጀመሪያውን ግቤት ማረጋገጫ እንዲጠብቅ ያደርገዋል። ግልጽ የሆነው ሁኔታ ንባብ የመጨረሻውን የሶፍትዌር ማቀነባበሪያ የስራ ፍሰት ሁኔታን ያረጋግጣል።

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

የመጨረሻው ትዕዛዝ የሚሳካው ትክክለኛው ዓለም አቀፍ ሁኔታ በብሎክቼይን መዝገብ ሁኔታ የተፈታ (state-resolved) `Applied` የመጨረሻነትን ሪፖርት ካደረገ በኋላ ብቻ ነው። ምስጠራውን ሃሽ በሙከራ ማስረጃ ውስጥ ያስቀምጡ፤ የግል ቁልፉን ወይም ሙሉውን የደንበኛ ውቅር ከእሱ ጋር በጭራሽ አያከማቹ።

## መላ ፍለጋ {#troubleshooting}

- `/livez`፣ `/health` እና `/readyz` JSON ብቻ ሲጠየቁ `406` ይመልሳሉ፣ ምክንያቱም ምላሻቸውን በ`text/plain` ይሰጣሉ። ከላይ የሚታዩትን የ`Accept` ራስጌዎች ይላኩ።
- `/livez` እና `/status` በሚሰሩበት ጊዜም ቢሆን `/readyz` `503`ን ከ`service_unavailable` የስህተት ውሂብ መያዣ ጋር ሊመልስ ይችላል። ዝግጁነትን ይጠብቁ ወይም `iroha taira doctor` ያሂዱ፤ ቁልፎችን እንደገና ማደስ የኖድ ዝግጁነትን አይለውጥም።
- በ`submit` ወቅት የሚከሰት የቴስትኔት የገንዘብ ድጋፍ አገልግሎት `502` ወይም የጊዜ ማብቂያ የይገባኛል ጥያቄውን ውጤት የማይታወቅ ያደርገዋል፦ ሌላ የይገባኛል ጥያቄ ከማዘጋጀት ይልቅ በተመሳሳይ ውቅር እና የሂደት መዝገብ `taira account faucet resume`ን ያሂዱ። የቆየ የስራ ማረጋገጫ መልህቅ `prepare`ን ያከሽፋል፤ በአዲስ የሂደት መዝገብ ማውጫ ውስጥ እንደገና ያዘጋጁ።
- የ I105 ቅድመ ቅጥያ ስህተት ማለት ይፋዊ ቁልፉ በተሳሳተ መገለጫ ተመዝግቧል ማለት ነው። እንደገና ያሂዱ `iroha tools address convert --profile taira`።
- የክፍያ ዋጋ ግምት አለመቀበል ብዙውን ጊዜ የፈቃድ ባለቤቱ የገንዘብ ድጋፍ አልተደረገለትም ወይም የተዋቀረው `network_id` የ Taira አይደለም ማለት ነው። የጎደለ `--fee-payer`፣ ወይም በ`--metadata` ውስጥ እንደ `gas_asset_id` ያለ የክፍያ ቁልፍ፣ ከዋጋ ግምቱ በፊት በአካባቢው አይሳካም።
- ይህ ካናሪ ከተሳካ በኋላ ምዝገባ፣ መስጠት ወይም የስም ቦታ አስተዳደር አሁንም ውድቅ ሊደረግ ይችላል። እነዚያ ክዋኔዎች የተለየ የሶፍትዌር ማስፈጸሚያ አካባቢ ፈቃዶችን ይፈልጋሉ; Taira መዳረሻ ካልተሰጠ በተፈጠረው የአካባቢ አውታረመረብ ላይ ይለማመዱዋቸው።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- በተሰካው የምንጭ-ኮድ ክለሳ ላይ ያሉት [Taira CLI ምርመራ እና የካናሪ ምንጭ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) እና [የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ትዕዛዞች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [ግልጽ የሆነ የክፍያ ምርጫ እና CLI የማስረከቢያ ምንጭ በተሰካው የምንጭ-ኮድ ክለሳ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira የመለያ እና የቴስትኔት የገንዘብ ድጋፍ አገልግሎት መመሪያ](/am/get-started/sora-nexus-dataspaces.md)
- [የደንበኛ ውቅር](/am/guide/configure/client-configuration.md)
- [ግብይቶች](/am/blockchain/transactions.md)
