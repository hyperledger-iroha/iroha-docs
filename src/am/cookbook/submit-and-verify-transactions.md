---
translation_locale: am
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ግብይቶችን ያስገቡ እና ያረጋግጡ {#submit-and-verify-transactions}

## ውጤት {#outcome}

የ Taira ግብይትን አስቀድመው ይብረሩ፣ ትክክለኛውን የክፍያ ዋጋ ግምት ይቀበሉ፣ ይፈርሙ እና ያስገቡት፣ የተተገበረውን የመጨረሻነት ይጠብቁ እና የተጠናቀቀውን ግብይት በምስጠራ ሃሽ ያረጋግጡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በገንዘብ የተደገፈ `taira.client.toml`፣ `taira.tx-metadata.json` እና `TAIRA_ACCOUNT_ID` በ[ከ Taira ጋር ይገናኙ](./connect-to-taira.md) የተሰራ።
- አሁን ያለው `iroha` CLI እና `jq`።
- ሊጣል የሚችል Taira ምስጠራ ፈራሚ። ቁልፉን እንደገና አይጠቀሙ ወይም እነዚህን በ Minamoto ላይ ትዕዛዞችን ይፃፉ።

## እርምጃዎች {#steps}

### 1. የ API የመጨረሻ ነጥብ፣ የፍቃድ ዋና እና የክፍያ ቀሪ ሂሳብን አስቀድመው ይተሩ {#_1-preflight-the-endpoint-authority-and-fee-balance}

መጀመሪያ የወረፋውን ነጥብ-በጊዜ ውሂብ ይመልከቱ ያንብቡ፣ ከዚያ የፍቃድ ርእሰ መምህሩ የክፍያ ቀሪ ሂሳብ መታየቱን ያረጋግጡ። በግንኙነት የተግባር መመሪያ ከተፈጠረው ሜታዳታ የBase58 ንብረት-ፍቺ መታወቂያውን ያንብቡ።

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

መለያው ወይም የክፍያ ቀሪ ሂሳቡ ከጠፋ ያቁሙ። ትክክለኛ መመሪያ የፍቃድ ርእሰ መምህሩ መክፈል በማይችልበት ጊዜ የክፍያ መግቢያን ማለፍ አይችልም።

### 2. ይጥቀሱ፣ ይፈርሙ እና አንድ ጊዜ ያስገቡ {#_2-quote-sign-and-submit-once}

CLI ትክክለኛውን ያልተፈረመ ጭነት ለክፍያ ዋጋ ግምት ይልካል፣ ተቀባይነት ያለው የክፍያ ዓላማ ከግብይቱ ጋር ያስራል፣ ይፈርማል እና ያስገባል። JSON ሁነታ የግብይቱን ምስጠራ ሃሽ፣ የተፈረመ ግብይት እና ተቀባይነት ያለው የክፍያ ዋጋ ግምት አንድ ላይ ይመልሳል።

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

በዚህ የተግባር መመሪያ ውስጥ `--no-wait` አይጠቀሙ. ትዕዛዙ የተሳካ የደረሰኝ ከመጻፉ በፊት ማረጋገጫን ይጠብቃል።

### 3. የተርሚናል ሶፍትዌር ማቀነባበሪያ የስራ ፍሰት ሁኔታን ይጠብቁ {#_3-wait-for-terminal-pipeline-state}

ከ HTTP ተቀባይነት ወይም ወረፋ መግቢያ ስኬትን ከመገመት ይልቅ የተተየበውን ሁኔታ አጋዥ ይጠቀሙ። በ`--wait`፣ ደህንነቱ የተጠበቀ የማስተላለፊያ ወሰን በራስ-ሰር ይመረጣል እና ነባሪው ኢላማው የተተገበረ የመጨረሻነት ነው።

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

`Rejected` እና `Expired` የተርሚናል ውድቀቶች እንጂ እንደገና ሊሞከሩ የሚችሉ የስኬት ግዛቶች አይደሉም። ግብይቱን ከመቀየርዎ ወይም እንደገና ከመገንባትዎ በፊት ምክንያታቸውን ይመዝግቡ።

### 4. የተከማቸ ግብይት ያንብቡ {#_4-read-the-stored-transaction}

የሶፍትዌር ማቀነባበሪያ የስራ ፍሰት ሁኔታ ሂደቱ መጠናቀቁን ያሳያል። የግብይት መጠይቅ የተቀበለው ግብይት በተመሳሳይ ምስጠራ ሃሽ ስር መከማቸቱን ያረጋግጣል።

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

አሳሹ ሁለተኛ፣ ተነባቢ-ብቻ የመመልከቻ ወለል ነው። ከሶፍትዌር ማቀነባበሪያ የስራ ሂደት መጨረሻ ለአጭር ጊዜ ወደ ኋላ ሊዘገይ ይችላል።

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

ለሁኔታ የሚቀይር መመሪያ፣ የተቀየረውን ነገር ጥያቄ ይጨርሱ። የ[ሜዳዳታ](./metadata.md)፣ [ፈንገስ ሊሆኑ የሚችሉ ንብረቶች](./fungible-assets.md) እና [NFTs](./nfts.md) የተግባር መመሪያዎች እነዚያን የድህረ-ሁኔታ ንባቦችን ያካትታሉ።

## አረጋግጥ {#verify}

ሦስቱም መዝገቦች በተመሳሳይ ምስጠራ ሃሽ ላይ መስማማታቸውን እና አሳሹ በመጠባበቅ ላይ ያለ ሁኔታን እንደማይዘግብ ያረጋግጡ -

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

የማስረከቢያ ደረሰኝ እና የመጨረሻውን ሁኔታ እንደ የሙከራ ማስረጃ ያቆዩ። የፊርማ ቁልፉን ሳይሆን የህዝብ ግብይት ቁሳቁሶችን ይይዛሉ።

## መላ ፍለጋ {#troubleshooting}

- HTTP `202` ወይም ወረፋ ያለው ሁኔታ መግቢያን ብቻ ያረጋግጣል። የተተየበውን ሁኔታ እስኪተገበረ፣ ውድቅ እስኪደረግ፣ ጊዜው ያለፈበት ወይም የተገደበው የጊዜ ማብቂያ እስኪደርስ ድረስ ድምጽ መስጠቱን ይቀጥሉ።
- ምስጠራ ሃሽ ከተመለሰ በኋላ የማስረከቢያው ጊዜ ካለፈ፣ ሌላ ግብይት ከመገንባትዎ በፊት ያንን ምስጠራ ሃሽ ይጠይቁ። ዓይነ ስውር እንደገና ማስገባት አዲስ የተጠቀሰ እና የተፈረመ ጭነት ይፈጥራል።
- ከመፈረምዎ በፊት የክፍያ ዋጋ ግምት ውድቅ ሊደረግ ይችላል። `--fee-payer authority`፣ `gas_asset_id`፣ የፍቃድ ርእሰ መምህሩን ቀሪ ሂሳብ እና የአውታረ መረብ ሰንሰለት መታወቂያን ያረጋግጡ።
- `Rejected` ብዙውን ጊዜ የመመሪያ ማረጋገጫን፣ ፈቃዶችን፣ ክፍያዎችን ወይም የቆየ ሁኔታን ያሳያል። ያልተሳካ አፈፃፀም የተጠናቀቀ ማስረጃ ነው እና እንደ የትራንስፖርት ድጋሚ ሙከራ እንደገና መመደብ የለበትም።
- አሳሽ `404` ከተተገበረ በኋላ ወዲያውኑ የመረጃ ጠቋሚ መዘግየት ሊያጋጥመው ይችላል። ንባቡን እንደገና ይሞክሩ; ግብይቱን እንደገና አያስገቡ።
- ልዩ መመሪያ በተፈጠረ localnet ላይ የሚሰራ ከሆነ ነገር ግን Taira ውድቅ ካደረገ፣ ትክክለኛውን Taira ፍቃድ ወይም የሚተዳደር የስም ቦታ ምደባ ያግኙ። የአካባቢ ውጤቱ ለህዝብ blockchain አውታረ መረብ ፍቃድ ዋና አይሰጥም።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የግብይት ማቅረቢያ እና የክፍያ ዋጋ ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የግብይት ማረጋገጫ ትግበራ እና ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [ግብይቶች](/am/blockchain/transactions.md)
- [CLI መመሪያ](/am/get-started/operate-iroha-via-cli.md)
- [Torii API የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
