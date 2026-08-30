---
translation_locale: am
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ግብይቶችን ማስገባት እና ማረጋገጥ {#submit-and-verify-transactions}

## ውጤቱ {#outcome}

የ Taira ግብይትን አስቀድመው ይቀበሉ ፣ ትክክለኛ ክፍያ ዋጋን ይቀበሉ ፣ ይፈርሙ እና ያቅርቡት ፣ የተተገበረውን ፍፃሜ ይጠብቁ ፣ እና የተሰጠውን ግብይት በሃሽ ያረጋግጡ ።

## ቅድመ ሁኔታዎች {#prerequisites}

- የገንዘብ ድጋፍ `taira.client.toml`, `taira.tx-metadata.json`, እና `TAIRA_ACCOUNT_ID` በ [ጋር ይገናኙ Taira](./connect-to-taira.md).
- የአሁኑ `iroha` CLI እና `jq`።
- ለአንድ ጊዜ የሚውል Taira ፊርማ። ቁልፉ ወይም እነዚህን ትዕዛዞች በ Minamoto ላይ እንደገና አይጠቀሙ።

## እርምጃዎች {#steps}

### 1. የፍጻሜ ነጥብ፣ ሥልጣን እና የክፍያ ሚዛን አስቀድመህ አስብ። {#_1-preflight-the-endpoint-authority-and-fee-balance}

በመጀመሪያ ረድፍ ቅጽበታዊ ገጽ እይታን ያንብቡ ፣ ከዚያ የሥልጣን ክፍያ ቀሪውን የሚታይ መሆኑን ያረጋግጡ ። በግንኙነት የምግብ አዘገጃጀት መመሪያው ከተፈጠረው ሜታዳታ ከ Base58 ንብረት መግለጫ ID ያንብቡ።

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

ሂሳቡ ወይም የክፍያ ቀሪው ካለ ማቆም። አንድ ትክክለኛ መመሪያ ባለሥልጣኑ መክፈል በማይችልበት ጊዜ የክፍያ ምዝገባን ማለፍ አይችልም።

### 2. አንድ ጊዜ መጥቀስ፣ ፊርማ ማድረግና ማቅረብ {#_2-quote-sign-and-submit-once}

CLI ለተቀበለው ክፍያ ዋጋ ትክክለኛውን ያልተፈረመ ጥቅማጥቅምን ይልካል ፣ ተቀባይነት ያለው የክፍያ ዓላማን ወደ ግብይቱ ያገናኛል ፣ ይፈርማል እና ያቀርባል ። JSON ሁነታ የግብይቱን ሃሽ ፣ የተፈረመውን ግብይት እና የተቀበለውን ዋጋ አንድ ላይ ይመልሳል ።

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

በዚህ የምግብ አዘገጃጀት ውስጥ `--no-wait` አይጠቀሙ። ትዕዛዙ የተሳካ ደረሰኝ ከመጻፉ በፊት ማረጋገጫን ይጠብቃል.

### 3. የጨረር ቧንቧ መስመር ሁኔታውን ይጠብቁ። {#_3-wait-for-terminal-pipeline-state}

ከ HTTP ተቀባይነት ወይም ረድፍ መግቢያ ስኬት ከመወሰን ይልቅ የተጻፈ ሁኔታ ረዳት ይጠቀሙ። በ `--wait` አማካኝነት ደህንነቱ የተጠበቀ የጉዞ አቅጣጫ በራስ-ሰር ይመረጣል እና ነባሪው ግብ ተግባራዊ ፍጻሜ ነው.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` እና `Expired` ተርሚናል ውድቀቶች ናቸው ፣ ሊመለሱ የማይችሉ የስኬት ሁኔታዎች አይደሉም ። ግብይቱን ከመቀየር ወይም ከመገንባት በፊት ምክንያታቸውን ይመዝገቡ።

### 4. የተከማቹትን ግብይቶች አንብቡ። {#_4-read-the-stored-transaction}

የፓይፕላይን ሁኔታ ማቀነባበሪያው ተጠናቅቋል ወይ የሚል መልስ ይሰጣል ። የተፈቀደለት ግብይት በተመሳሳይ ሃሽ ስር መቀመጡን የሚያረጋግጥ የትራንስክሽን መጠይቅ ነው።

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

ኤክስፕሎረር ሁለተኛው የንባብ-ብቻ የመመልከቻ ገጽ ነው ። ከቧንቧው ፍፃሜ ጥቂት ሊቆይ ይችላል።

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

ለውጦቹን ለማስተላለፍ፣ የተለወጠውን ነገር በጥያቄ ያጠናቅቁ። [ሜታዳታ](./metadata.md), [ተለዋዋጭ ሀብቶች](./fungible-assets.md), እና [NFTs](./nfts.md) የምግብ አዘገጃጀት መመሪያዎች ከመንግሥት በኋላ የሚቀርቡትን ያካትታሉ።

## ያረጋግጡ {#verify}

ሦስቱም መዝገቦች በአንድ ሃሽ ላይ የተስማሙ መሆናቸውን እና ተመራማሪው ከአሁን በኋላ ያልተጠበቀ ሁኔታን አለመዘገቡን ያረጋግጡ ።

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

የዝግጅት ደረሰኝ እና የመጨረሻው ሁኔታ እንደ የሙከራ ማስረጃ ይያዙ። እነሱ የሕዝብ ግብይት ቁሳቁስ እንጂ ፊርማ ቁልፍ አይደሉም።

## ችግሮችን መፍታት {#troubleshooting}

- HTTP `202` ወይም ረድፍ ያለው ሁኔታ የመግቢያ ብቻ ነው የሚያረጋግጠው። ተግባራዊ ፣ ውድቅ ፣ ጊዜው እስኪያበቃ ድረስ የተጻፈውን ሁኔታ መመርመሩን ይቀጥሉ.
- አንድ ሃሽ ከተመለሰ በኋላ የማቅረቢያ ጊዜ ካለ ሌላ ግብይት ከመፍጠርዎ በፊት ያንን ሃሽ ይጠይቁ። ዓይነ ስውር ዳግም ማቅረቢያ አዲስ የተጠቀሰው እና የተፈረመ ተጠቃሚ ጭነት ይፈጥራል።
- ከመፈረምዎ በፊት የክፍያ ቅናሽ መከልከል ይቻላል። `--fee-payer authority`, `gas_asset_id`, ባለሥልጣኑ ቀሪ ሂሳብ እና የአውታረ መረብ ሰንሰለት ID ይመልከቱ.
- `Rejected` አብዛኛውን ጊዜ የትእዛዝ ማረጋገጫ ፣ ፈቃዶች ፣ ክፍያዎች ወይም የቆየ ሁኔታን ያመለክታል ። ይህ የተሳሳተ አፈፃፀም የተረጋገጠ ማስረጃ ነው እናም እንደ መጓጓዣ ዳግም ሙከራ እንደገና መታወቅ የለበትም።
- አንድ አሰሳ `404` Applied በኋላ ወዲያውኑ ማውጫ መዘግየት ሊሆን ይችላል. እንደገና ያንብቡ; ግብይት ዳግም ማስገባት አይደለም.
- አንድ የተመረጠ መመሪያ በተፈጠረው አካባቢያዊ አውታረመረብ ላይ የሚሰራ ከሆነ ግን Taira ውድቅ የሚያደርግ ከሆነ ትክክለኛውን Taira ፈቃድ ወይም የተቆጣጠረ የስም ቦታ አሰጣጥ ያግኙ። አካባቢያዊው ውጤት ለህዝብ አውታረ መረብ ስልጣን አይሰጥም.

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [የግብይት ማቅረቢያ እና የተጣራ ግዴታ ላይ የክፍያ መጠየቂያ አፈፃፀም ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [የግብይት ማረጋገጫ ሙከራዎች በተጣበቀው ተሳትፎ ላይ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [ግብይቶች](/am/blockchain/transactions.md)
- [CLI መመሪያ](/am/get-started/operate-iroha-via-cli.md)
- [Torii መጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
