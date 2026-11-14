---
translation_locale: am
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 98c351372551b08bda4911f52bfb3cc70c53b6125d8045c17abb205b27960f6d
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# በTaira እና Minamoto በመጠቀም በSORA Nexus ላይ መገንባት {#build-on-sora-3-taira-and-minamoto}

SORA Nexus በIroha 3 ላይ ይሠራል። መተግበሪያዎን መጀመሪያ በTaira ላይ ይገንቡ እና ይፈትሹ። ለዋናው አውታረ መረብ የተለዩ ቁልፎች፣ ለክፍያ የሚሆን እውነተኛ XOR እና በምርት አካባቢ የመሥራት ፈቃድ ሲኖርዎት ብቻ ተመሳሳዩን የደንበኛ ውቅር ወደ Minamoto ያዛውሩ።

ይህ መመሪያ ለሁለቱ የ SORA Nexus ይፋዊ አውታረ መረቦች የIroha ደንበኛን እንዴት ማዋቀር እንደሚቻል ያሳያል።

- Taira የሙከራ መረብ በ `https://taira.sora.org`
- Minamoto ዋና መረብ በ `https://minamoto.sora.org`

ለውህደት ሙከራዎች፣ በቴስትኔት የገንዘብ ድጋፍ ለሚደረግላቸው ካናሪዎች እና ለማሰማራት ልምምዶች Taira ን ይጠቀሙ። Minamoto ን ለምርት ዝግጁ ለሆኑ ዋና መረብ እንቅስቃሴ ብቻ ይጠቀሙ። ሁለቱም አውታረ መረቦች በ XOR ውስጥ ክፍያዎችን ያስከፍላሉ -

- Taira Testnet XOR ከህዝብ Testnet የገንዘብ ድጋፍ አገልግሎት ይጠቀማል።
- Minamoto እውነተኛ XOR ይጠቀማል. Minamoto የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የለም።

## የገንቢ መንገድ {#builder-path}

|ደረጃ|Taira የሙከራ መረብ|Minamoto ዋና መረብ|
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|የአውታረ መረብ ሁኔታን ማንበብ ይጀምሩ|መጠይቅ `/status` ያለ ቁልፎች| በመጀመሪያ የአገልግሎቱን አድራሻና የTLS ምስክር ወረቀት ያረጋግጡ |
|የውሂብ ቦታ ይምረጡ|መተግበሪያዎ የሚተዳደር የማስፈጸሚያ መስመር ካልፈለገ በስተቀር ይፋዊ `universal` ይጠቀሙ|ተመሳሳዩን የውሂብ ቦታ ይጠቀሙ ከዋና ኔት ፈቃድ በኋላ ብቻ|
|የክፍያ ንብረት ያግኙ|የህዝብ Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎትን ይጠቀሙ|XOR በገንዘብ ከተደገፈ Minamoto ሂሳብ ወይም ከተፈቀደ የግምጃ ቤት ፍሰት ይቀበሉ|
| የሙከራ ክዋኔዎች | በገንዘብ አገልግሎቱ የተሞላ የሙከራ XOR ይጠቀሙ | የሙከራ መሣሪያ አይጠቀሙ፤ ክዋኔዎቹ እውነተኛ XOR ያወጣሉ |
|ያስተዋውቁ|አመክንዮ፣ ክትትል እና ምስጠራ ፈራሚ አያያዝን እንደገና ይሞክሩ|የተለዩ ቁልፎችን፣ የገንዘብ ድጋፍን እና የመልቀቂያ መቆጣጠሪያዎችን ይጠቀሙ|

ተግባራዊ ፍሰት የሚከተለው ነው-

1. ደንበኛውን ለTaira ይገንቡ፣ ክፍቱን `universal` የውሂብ ቦታ ይጠቀሙ።
2. ምስጠራ ፈራሚ ያክሉ እና በ Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ይደግፉት።
3. ውድቀቶች አሰልቺ እና ሊታዩ የሚችሉ እስኪሆኑ ድረስ የመተግበሪያዎን አመክንዮ በ Taira ላይ ይለማመዱ።
4. የተለየ Minamoto ምስጠራ ፈራሚ ይፍጠሩ፣ በእውነተኛው XOR የገንዘብ ድጋፍ ያድርጉት እና ተመሳሳይ የተረጋገጡ ስራዎችን ብቻ ወደ mainnet ያንቀሳቅሱት።

## በምግብ ማብሰያ መጽሃፉ ይቀጥሉ {#continue-with-the-cookbook}

አውታረ መረብ ለመምረጥ፣ ምስጠራ ፈራሚ ለማዘጋጀት እና ክፍያዎችን ለመደገፍ ይህንን መመሪያ ይጠቀሙ። ከዚያ መገንባት ከሚፈልጉት የመተግበሪያ ባህሪ ጋር በሚዛመደው የተግባር መመሪያ ይቀጥሉ -

|ግብ|አዘገጃጀት|
| --- | --- |
|Taira ን ያረጋግጡ እና ደንበኛን ያዋቅሩ|[ከ Taira ጋር ይገናኙ](/am/cookbook/connect-to-taira.md)|
|የመጀመሪያ የመጻፍ ክዋኔ ይላኩ እና ውጤቱን ያረጋግጡ|[ግብይቶችን ያስገቡ እና ያረጋግጡ](/am/cookbook/submit-and-verify-transactions.md)|
|ይመዝገቡ፣ ያውጡ እና እሴትን ያንቀሳቅሱ|[ፈንገስ ንብረቶች](/am/cookbook/fungible-assets.md)|
|የተጣራ የመተግበሪያ ሁኔታን ያንብቡ|[መጠይቅ blockchain መዝገብ ሁኔታ](/am/cookbook/query-ledger-state.md)|
|ለተጠናቀቁ ለውጦች ምላሽ ይስጡ|[ክስተቶችን በዥረት ይልቁ](/am/cookbook/stream-events.md)|

የተግባር መመሪያ ስብስቡ እያንዳንዱን የስራ ሂደት ያተኩራል እና Taira የገንዘብ ድጋፍ ወይም SORA Nexus የአውታረ መረብ አውድ ሲፈልግ ወደዚህ ያገናኛል።

## 1. ምን እያዘጋጁ እንደሆነ ይረዱ {#_1-understand-what-you-are-setting-up}

በSORA Nexus ውስጥ የውሂብ ቦታ ካታሎጉ የውሂብ ቦታዎችን ይገልጻል። የመስመር ካታሎጉ መስመሮችን በተለየ ይገልጻል፦ እያንዳንዱ መስመር አንድ የውሂብ ቦታን ይጠቅሳል፣ አንድ የውሂብ ቦታም ብዙ መስመሮች ሊኖሩት ይችላሉ። ደንበኛ `client.toml`ን ብቻ በመለወጥ አዲስ ክፍት የውሂብ ቦታ አይፈጥርም። የደንበኛ ማዋቀር ሁለት ነገሮችን ያደርጋል:

1. ደንበኛውን ወደ ትክክለኛው የTorii መገናኛ ነጥብ ይመራል
2. ለቀኖናዊ መለያው የአውታረ መረብ አውድና የፊርማ ቁልፍ ይመርጣል

`AccountId` ሁልጊዜ ቀኖናዊና ጎራ የሌለው ነው፣ `client.toml`ም የጎራ ቅንብር የለውም፦ `[account].profile` የአውታረ መረቡን I105 ቅድመ ቅጥያ ብቻ ይመርጣል። የጎራ አውድ የተለዋጭ ስሞችና በጎራ ባለቤትነት ያሉ ነገሮች ነው። ለአብዛኞቹ መተግበሪያዎች በክፍቱ `universal` የውሂብ ቦታ ይጀምሩ። የጎራ አውድ `domain.dataspace` ቅርጽ ይጠቀማል፣ ለምሳሌ:

```text
wonderland.universal
```

አዲስ የድርጅት የውሂብ ቦታ ከፈለጉ ከመደበኛ የደንበኛ መለያ ለመመዝገብ ከመሞከር ይልቅ የካታሎግና የማዘዋወር ሀሳብ ያዘጋጁ። ከታች [አዲስ የውሂብ ቦታ ያቋቁሙ](#_8-provision-a-new-data-space) ይመልከቱ።

## 2. ይፋዊ Torii የመጨረሻ ነጥብ ያረጋግጡ {#_2-check-the-public-torii-endpoint}

የTaira የሙከራ አውታረ መረብ ሁኔታን በ`curl` እና `jq` ይፈትሹ። ለዚህ ምርመራ ቁልፎች ወይም አካባቢያዊ ኖድ አያስፈልጉም።

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ኖዱ የሚያቀርበውን የውሂብ ቦታና የመስመር እይታ ይመርምሩ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Minamotoን ከመጠቀምዎ በፊት የዋናውን አውታረ መረብ አገልግሎት አድራሻ ከኦፕሬተሩ ጋር ያረጋግጡ፤ የTLS ምስክር ወረቀቱ ከአስተናጋጁ ስም ጋር መዛመዱንም ይፈትሹ።

## Taira MCP ለወኪሎች {#taira-mcp-for-agents}

Taira እንዲሁም ለወኪል ሶፍትዌር ማስፈጸሚያ አካባቢዎች Torii ቤተኛ የሞዴል አውድ ፕሮቶኮል (MCP) ድልድይ ያጋልጣል። አንድ ወኪል መጀመሪያ ብጁ Torii ደንበኛ ሳይገነቡ የቀጥታ ቴስትኔት ንባብ፣ ስክሪፕት የተደረጉ ምርመራዎች ወይም በጥብቅ የተገመገሙ የመፃፍ ልምምዶችን ሲፈልግ ይጠቀሙበት።

|ቅንብር|እሴት|
| --- | --- |
|MCP የመጨረሻ ነጥብ|`https://taira.sora.org/v1/mcp`|
|የአውታረ መረብ ስርወ|`https://taira.sora.org`|
|የታቀደ አጠቃቀም|Taira Testnet ያነባል እና በቴስትኔት የገንዘብ ድጋፍ የሚደረግላቸው የመፃፍ ልምምዶች|
| የምርት አካባቢ አቻ |ዋና መረብ MCP የመጨረሻ ነጥብ እና የመልቀቂያ መቆጣጠሪያዎች በግልፅ ካልፀደቁ በስተቀር ይህንን ግቤት በ Minamoto አይጠቁሙ|

ድልድዩ ሁኔታ የማያቆዩ JSON-RPC `POST` ጥያቄዎችን ብቻ ይቀበላል። የፊርማ መረጃ ከማከልዎ በፊት የማግኛ ሜታዳታውን ያረጋግጡ:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

በወኪሉ ሶፍትዌር ማስፈጸሚያ አካባቢ ውስጥ URL ን እንደ ተጠቃሚ-አካባቢያዊ MCP አገልጋይ ያዋቅሩ። ወኪሉን MCP ውቅረት፣ API ቶከኖች፣ የተላለፉ የማረጋገጫ ራስጌዎች፣ `authority` ወይም `private_key` እሴቶችን ወደዚህ ሰነድ ሪፖ ወይም የመተግበሪያ ሪፖ ውስጥ አያስቀምጡ።

ከ Taira ጋር በደንብ የሚሰሩ የወኪል ፈጣን ህጎች -

- ከመደወልዎ በፊት ከ MCP አገልጋይ መሳሪያዎችን ያግኙ; አገልጋዩ `listChanged` ሪፖርት ካደረገ እንደገና ያግኙ።
- ከጥሬ `torii.*` መሳሪያዎች ይልቅ የተሰበሰቡ `iroha.*` መሳሪያዎችን ይምረጡ።
- ተነባቢ-ብቻ ጀምር የመጻፍ ክዋኔዎችን ከማቅረቡ በፊት ሁኔታን፣ መለያዎችን፣ ንብረቶችን፣ ተለዋጭ ስሞችን፣ ብሎኮችን፣ የአስተዳደር ሁኔታን እና የግብይት ሁኔታን ይፈትሹ።
- ከቀጥታ የቴስትኔት ሚውቴሽን በፊት ግልጽ የሆነ የሰው መመሪያ ይጠይቁ። አስቀድመው ለተፈረሙ የግብይት ውሂብ ኮንቴይነሮች፣ ወኪሉ ከማቅረብ ይልቅ ውጤቱን እንዲጠብቅ `iroha.transactions.submit_and_wait` ይጠቀሙ።
- በወኪሉ ምላሽ ውስጥ የግብይት ምስጠራ ሃሽዎችን፣ የመጨረሻ ሁኔታን እና የአገልጋይ ማረጋገጫ ስህተቶችን ጠቅለል አድርጎ ያቅርቡ።

### ከወኪሎች ጋር የልማት የስራ ፍሰት {#development-workflow-with-agents}

ወኪሎችን ለ Iroha ደንበኞች፣ የግብይት ግንበኞች፣ የምርመራ ስክሪፕቶች እና የቴስትኔት ሩጫ ደብተሮች እንደ ልማት አጋዥ ይጠቀሙ። የወኪሉን ፍቃድ ዋና ጠባብ ያድርጉት - ኮድን መመርመር፣ Taira ሁኔታን ማንበብ፣ ለውጦችን ማቅረብ እና የአካባቢ ሙከራዎችን ማካሄድ ይችላል፣ ነገር ግን አንድ ሰው ትክክለኛውን ክዋኔ እስኪያፀድቅ ድረስ የቀጥታ ኔትወርክን መቀየር የለበትም።

ተግባራዊ የስራ ሂደት የሚከተለው ነው-

1. ኮድ ከመጻፉ በፊት ወኪሉ አግባብነት ያላቸውን ሰነዶች፣ SDK ኮድ፣ CLI ትዕዛዝ ወይም MCP የመሳሪያ ንድፍ እንዲመረምር ይጠይቁት።
2. ወኪሉ መጀመሪያ ትንሹን የደንበኛ መንገድ እንዲጽፍ ያድርጉ የሁኔታ ፍተሻ፣ መለያ ፍለጋ፣ ተለዋጭ ስም መፍታት ወይም ቀሪ ሒሳብ ፍለጋ።
3. የግብይት-ግንባታ ኮድ ያክሉ ተነባቢ-ብቻ ጥያቄዎች በ Taira ላይ ከሰሩ በኋላ ብቻ ነው።
4. የቀጥታ-አውታረ መረብ ሙከራዎችን መርጠው እንዲገቡ ያድርጉ፣ ለምሳሌ ከ`TAIRA_LIVE=1` በስተጀርባ፣ ስለዚህ መደበኛ የክፍል ሙከራ ሩጫ በቴስትኔት ፈንድ አያወጣም ወይም በአውታረ መረብ ተገኝነት ላይ የተመሰረተ ነው።
5. ወኪሉ ማንኛውንም ግብይት ከማቅረቡ በፊት የኔትወርክ ሥር፣ ሰንሰለት፣ የፍቃድ ዋና መለያ፣ የመመሪያ ማጠቃለያ፣ የክፍያ ንብረት እና የሚጠበቀው የሁኔታ ለውጥ ሪፖርት እንዲያደርግ ይጠይቁ።
6. ወደ CI ወይም ዋና መረብ የስራ ፍሰቶች ከማስተዋወቅዎ በፊት ለሚስጥር አያያዝ፣ ባህሪን እንደገና ለሙከራ፣ ለአይደምፖተንሲ እና ውድቅ አያያዝ የመነጨ ኮድ ይገምግሙ።

ለልማት ጠቃሚ ተነባቢ-ብቻ MCP መሳሪያዎች የመለያ ንብረት ፍለጋዎችን፣ ተለዋጭ ስም መፍታትን፣ የብሎክ ፍለጋን፣ የግብይት ፍለጋን፣ የግብይት ዝርዝሮችን እና የሶፍትዌር ማቀናበሪያ የስራ ፍሰት ሁኔታ ፍተሻዎችን ያካትታሉ። ማንኛውንም የተፈረመ ጭነት ከማስገባትዎ በፊት በራስ መተማመንን ለመገንባት እነዚህን ይጠቀሙ።

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### የግብይት የስራ ፍሰት በወኪሎች በኩል {#transaction-workflow-through-agents}

የ MCP ድልድይ የተፈረመ የ Iroha ግብይት ማስገባት ይችላል፣ ነገር ግን መደበኛውን የግብይት መስፈርቶች አያስወግድም። ግብይት አሁንም ትክክለኛ የፈቃድ ባለቤት፣ ፈቃዶች፣ የክፍያ ገንዘብ፣ የሰንሰለት ID፣ ሜታዳታ እና ፊርማ ያስፈልገዋል።

ለጥሬ Iroha ግብይቶች የግብይት ውሂብ መያዣውን በ SDK ወይም CLI ይገንቡ እና ይፈርሙ እና ከዚያ ለወኪሉ ነጠላ ብቻ ይስጡት ፕሮቶኮል-ደረጃውን የጠበቀ የተፈረመ የግብይት ባይት እንደ `body_base64` ተቀምጠዋል። ወኪሉ የውሂብ መያዣውን በ`iroha.transactions.submit_and_wait` ማስገባት ወይም በ`iroha.transactions.submit` እና በ`iroha.transactions.wait` የሕዝብ አስተያየት መስጠት ይችላል።

የግል ቁልፎችን ወደ ወኪል መጠየቂያ አይለጥፉ። አንድ ወኪል ግብይት መገንባት ከፈለገ ከተጠቃሚው የሶፍትዌር ማስፈጸሚያ አካባቢ ሚስጥሮችን በሚጭን የአካባቢ ኮድ ላይ ይጠቁሙት። አካባቢ፣ የቁልፍ ሰንሰለት፣ የሃርድዌር ምስጠራ ፈራሚ ወይም ችላ የተባለ የቴስትኔት ውቅር ፋይል። ወኪሉ ቁልፉን ወደ ማርክዳውን፣ የሙከራ አብነቶችን፣ ምዝግብ ማስታወሻዎችን ወይም ማጠናቀቂያዎችን በፍፁም መፃፍ የለበትም።

ግብይት ከማቅረቡ በፊት ወኪሉ አጭር የግብይት እቅድ እንዲያዘጋጅ ያድርጉ -

- `network` Taira testnet root እና ሰንሰለት መታወቂያ
- `authority` ክፍያዎችን የሚፈርም እና የሚከፍል መለያ
- `instructions` መመዝገብ፣ ማውጣት፣ ማጥፋት፣ ማስተላለፍ፣ ሜታዳታ፣ ፈቃድ ወይም የኮንትራት ቴክኒካል ጥሪ ማጠቃለያ
- `fee asset` በ Taira ላይ የሚከፍል ንብረት
- `preflight reads` መለያ፣ የንብረት ቀሪ ሂሳብ፣ ፈቃዶች፣ ተለዋጭ ስም ወይም የብሎክ ቼኮች አስቀድመው ተከናውነዋል
- `expected result` ከተረጋገጠ በኋላ መታየት ያለበት ሁኔታ
- `idempotency` ተመሳሳይ ጥያቄ እንደገና ከተሞከረ ምን ይከሰታል

ካስገቡ በኋላ ወኪሉ የተርሚናል ሁኔታን እንዲጠብቅ ያድርጉት፣ ከዚያ የስቴት ለውጡን በተነበበ መጠይቅ ያረጋግጡ። ጠቃሚ የማጠናቀቂያ ሪፖርት የሚከተሉትን ያጠቃልላል

- ግብይት ምስጠራ ሃሽ
- እንደ `Committed`፣ `Applied`፣ `Rejected` ወይም `Expired` ያሉ የተርሚናል ሁኔታ
- ሲገኝ ዝርዝርን ብሎክ ወይም አሳሽ
- ማረጋገጫ የተነበበ ውጤቶች
- ውድቅ መልእክት እና ውድቀቱ ፈቃዶች፣ ክፍያዎች፣ ማረጋገጫ፣ የቆየ ሁኔታ ወይም የመጨረሻ ነጥብ ተገኝነት ይመስላል

ምሳሌ የተጠበቀ ጥያቄ -

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

የተፈረመው የውሂብ መያዣ አስቀድሞ ሲዘጋጅ -

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP ን እንደ ይፋዊ የቴስትኔት መቆጣጠሪያ ወለል አድርገው ይያዙት። Taira ቁልፎች፣ ቴስትኔት XOR፣ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ሂሳቦች እና የካናሪ ምስጠራ ፈራሚዎች የሚጣሉ ናቸው እና ከ Minamoto ቁልፎች እና የምርት ልቀት የስራ ፍሰቶች ተለይተው መቆየት አለባቸው።

## አሁን ሊሞክሯቸው የሚችሏቸው የአሻንጉሊት ምሳሌዎች {#toy-examples-you-can-try-now}

እነዚህ ምሳሌዎች የመለያ ቁልፎችን ሳይጠቀሙ ከTaira መረጃ ያነባሉ።

Taira የሚያቀርባቸውን የክፍት ውሂብ ቦታ መስመሮች ዘርዝሩ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | select(.visibility == "public")
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ለዳሽቦርድ፣ ቦት ወይም ማሰማራት ቼክ ትንሽ Node.js የሁኔታ ምርመራ ይገንቡ -

```bash
node --input-type=module <<'EOF'
const response = await fetch('https://taira.sora.org/status', {
  headers: { Accept: 'application/json' },
});
if (!response.ok) throw new Error(`Taira HTTP ${response.status}`);
const status = await response.json();
const publicLanes = status.teu_lane_commit
  .filter((lane) => lane.visibility === 'public')
  .map((lane) => `${lane.alias}@${lane.dataspace_alias}:${lane.block_height}`)
  .join(', ');
console.log(`Taira: ${status.blocks} blocks, ${status.queue_size} queued, public lanes ${publicLanes}`);
EOF
```

የመጀመሪያው ቀላል የመጻፍ ክዋኔ የ Taira የቴስትኔት ገንዘብ ድጋፍ ጥያቄ መሆን አለበት። የቴስትኔት XOR ይጠቀማል እና ፈጽሞ ወደ Minamoto መጠቆም የለበትም።

## 3. የ Taira የደንበኛ ውቅር ይፍጠሩ {#_3-create-a-taira-client-config}

አስቀድመው ከሌለዎት የቁልፍ ጥንድ ይፍጠሩ -

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

`taira.client.toml` ይፍጠሩ

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

በላይኛው ደረጃ ያለው `chain` ትክክለኛው የTaira ግብይት ሰንሰለት ID ነው፣ `network_id` ደግሞ እያንዳንዱ ፊርማ የሚያስረው ትክክለኛ የአውታረ መረብ ማንነት ነው። `network_id` ወይም `network_id_file` ከሁለቱ በትክክል አንዱን ያዋቅሩ። `[account].profile = "taira"` ቅንብር የTaira I105 የሰንሰለት መለያያ በተናጠል ይመርጣል። የሰንሰለት ID የመለያውን መገለጫ አይመርጥም።

ተነባቢ-ብቻ ቼክ ያሂዱ -

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

ፈተናዎችን ከመጻፍዎ በፊት ይፋዊውን Taira ምርመራዎችን ያሂዱ -

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ክፍያ የሚፈልጉ የሁኔታ ለውጥ ክዋኔዎችን ከማስኬድዎ በፊት የTaira መለያውን በፋውሴት ይሙሉ። ቀድሞ የማዘጋጀት ፋውሴት ሂደቱ በ[በTaira ላይ የሙከራ አውታረ መረብ XOR ማግኘት](#_4-get-testnet-xor-on-taira) ውስጥ አለ።

መለያው ከተሞላ በኋላ የተፈረመ log መመሪያ አማራጭ መሠረታዊ የሁኔታ ለውጥ ሙከራ ነው። እያንዳንዱ የሚላክ ግብይት ከፋዩን ይሰይማል፣ CLIም ከመፈረም በፊት ትክክለኛውን ክፍያ ያስላል:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

ትዕዛዙ ማረጋገጫን ይጠብቃል። Taira ክፍት የሙከራ አውታረ መረብ ነው፣ ስለዚህ ፋውሴቱ ራሱ ቢሠራም ወረፋው መሙላት pingን ሊያከሽፍ ይችላል። `taira doctor` የሞላ ወረፋ ከዘገበ ወይም ping `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` ከመለሰ እንደ የደንበኛ ውቅር ስህተት ከመቆጠርዎ በፊት ይጠብቁና እንደገና ይሞክሩ።

ያለ ቀጥታ ክትትል ለሚሠሩ መሠረታዊ ሙከራዎች pingን የተወሰነ ገደብ ባለው የዳግም ሙከራ ዙር ያስኬዱ:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

`iroha taira doctor` ከባድ ውድቀቶችን ካሳየ እንደገና መሞከርዎን ያቁሙ። ወረፋ ሙሌት እና የክፍያ መግቢያ ውድቅ ጊዜያዊ የህዝብ-ቴስትኔት ሁኔታዎች ናቸው። DNS፣ TLS ወይም `status = "fail"` ምርመራዎች አይደሉም።

## የ SORA Nexus መለያ መታወቂያ ይፍጠሩ {#generate-a-sora-nexus-account-id}

የSORA Nexus መለያ ID ከመለያው የሕዝብ ቁልፍና ከዒላማ አውታረ መረቡ ቅድመ ቅጥያ የተመነጨ ቀኖናዊ I105 አድራሻ ነው። ያው የሕዝብ ቁልፍ በTaira እና Minamoto ወደ የተለያዩ IDዎች ይቀየራል፣ የእውነተኛ ሥራ አካባቢ ተጠቃሚዎችም ለMinamoto የተለየ ጥንድ ቁልፍ ማመንጨት አለባቸው።

መለያውን የሚቆጣጠረውን የ Ed25519 ቁልፍ ጥንድ ይፍጠሩ ወይም ይጫኑ -

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

ይፋዊ ቁልፉን ወደ Taira መለያ መታወቂያ ይለውጡ

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

የ Minamoto የህዝብ ቁልፍን ከዋናው መረብ ቅድመ ቅጥያ ጋር ይቀይሩ

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

የSORA Nexus API ወይም CLI ትዕዛዝ ቀኖናዊ የመለያ ID በጠየቀበት ሁሉ የተገኘውን መለያ ID ይጠቀሙ፣ ለምሳሌ በቀሪ ሒሳብ ጥያቄዎች፣ በጥብቅ የመለያ መስኮች ወይም በተለዋጭ ስም ትስስሮች። ተዛማጁን የግል ቁልፍ በደንበኛ ውቅርዎ ያቆዩ፣ ያንኑ ክፍት አውታረ መረብም በ`[account].profile = "taira"` ወይም `[account].profile = "minamoto"` ይምረጡ።

መታወቂያውን ማመንጨት በራሱ በገንዘብ የተደገፈ በሰንሰለት ላይ መለያ አይፈጥርም። በ Taira ላይ፣ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ለቴስትኔት የመጻፍ ክዋኔዎች መለያውን መፍጠር እና መደገፍ ይችላል። በ Minamoto ላይ፣ የተፈቀደ የዋና መረብ መሳፈሪያ ወይም የግምጃ ቤት ፍሰት ይጠቀሙ።

### ቁልፍ ማከማቻ እና ምትኬ {#key-storage-and-backup}

የመለያ መታወቂያው እና የህዝብ ቁልፍ ሊጋራ ይችላል። የሚዛመደው የግል ቁልፍ፣ የይለፍ ሐረግ፣ ዘር እና የመልሶ ማግኛ ቁሳቁስ እንደ ሚስጥር መታየት አለባቸው።

እነዚህን ልምዶች ለ SORA Nexus መለያዎች ይጠቀሙ፦

- የግል ቁልፎችን በተመሰጠረ የይለፍ ቃል አስተዳዳሪ፣ በሃርድዌር የተደገፈ የቁልፍ ማከማቻ ወይም ልዩ የፊርማ አገልግሎት ውስጥ ያከማቹ። የማጠናቀቂያ ቁልፎችን ለምንጭ ቁጥጥር አያድርጉ ወይም የምርት ቁልፎችን በሼል ታሪክ፣ ምዝግብ ማስታወሻዎች፣ ውይይቶች፣ ቲኬቶች ወይም ያልተመሰጠሩ መጠባበቂያዎች ውስጥ አይተዉት።
- ለእያንዳንዱ ቮልት ወይም የምርት ምስጠራ ፈራሚ ልዩ የሆነ ከፍተኛ-ኢንትሮፒ የይለፍ ሐረግ ይጠቀሙ። የይለፍ ሀረጎችን በይለፍ ቃል አስተዳዳሪ ወይም በተከፈለ የጥበቃ ሂደት ውስጥ ያከማቹ እንጂ ከተመሰጠረው የግል ቁልፍ ጋር በተመሳሳይ ፋይል ወይም የመጠባበቂያ ጥቅል ውስጥ አይደለም።
- Taira እና Minamoto ቁልፎችን ለየብቻ ያቆዩ። የ Taira ቁልፎችን እንደ ሊጣል የሚችል የቴስትኔት ቁሳቁስ እና Minamoto ቁልፎችን እንደ የምርት ፈንድ ፈቃድ ዋና አድርገው ይያዙ።
- ምስጠራ ፈራሚውን ወደነበረበት ለመመለስ የሚያስፈልጉትን የግል ቁልፍ፣ የህዝብ ቁልፍ፣ የመለያ መታወቂያ፣ የመለያ መገለጫ እና ማንኛውንም የመለያ መልሶ ማግኛ ወይም የጥበቃ ማስታወሻዎች ምትኬ ያስቀምጡ። የአውታረ መረብ አውድ የሌለበት የግል ቁልፍ በማገገም ጊዜ አላግባብ መጠቀም ቀላል ነው።
- ለምርት ምስጠራ ፈራሚዎች ቢያንስ አንድ የተመሰጠረ ከመስመር ውጭ ምትኬ እና አንድ ጂኦግራፊያዊ የተለየ የተመሰጠረ ምትኬ ያስቀምጡ። በመጠባበቂያው ላይ በመመስረት በፊት በትንሽ ተነባቢ-ብቻ ክዋኔ መልሶ ማግኘትን ይሞክሩ።
- የግል ቁልፉ፣ የይለፍ ቃሉ፣ የመጠባበቂያ ሚዲያ ወይም የፊርማ አስተናጋጁ ከተጋለጠ ምስጠራ ፈራሚውን ያሽከርክሩ ወይም ይተኩ።

ለበለጠ ዝርዝር [ምስጠራ ቁልፎችን ማከማቸት](/am/guide/security/storing-cryptographic-keys.md) እና [የይለፍ ቃል ደህንነት](/am/guide/security/password-security.md) ይመልከቱ።

## 4. በ Taira ላይ ቴስትኔት XOR ያግኙ {#_4-get-testnet-xor-on-taira}

በCLI ቀድሞ የማዘጋጀት ፋውሴት ሂደት የሙከራ አውታረ መረብ XOR ይጠይቁ። ፋውሴቱ በ`taira.client.toml` የተዋቀረውን መለያ ይሞላል፣ ገና ከሌለም በመጀመሪያ ይመዘግበዋል። ሂደቱ እንዲህ ነው:

1. ክፍቱን የፋውሴት ፖሊሲ ያንብቡ፦ የፋውሴት ፈቃድ ያለው አካል፣ የክፍያ ንብረት እና መጠን።
2. ጥያቄውን ያዘጋጁ። CLI የሥራ ማስረጃውን ይፈታል፣ Torii የሚያዘጋጀውንና የሚፈርመውን ትክክለኛ ግብይት ያረጋግጣል፣ ሳይልከውም በግል ጆርናል ማውጫ ያስቀምጠዋል።
3. የተቀመጠውን ግብይት አንድ ጊዜ ይላኩ።
4. ክፍያ የሚፈልጉ የሁኔታ ለውጥ ክዋኔዎችን ከመላክዎ በፊት የንብረቱ ቀሪ ሒሳብ እስኪታይ ይጠብቁ።

ፖሊሲውን ያንብቡ:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

ምላሹ ይህ ቅርጽ አለው

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

ፖሊሲው ያልተፈረመ የማግኛ ውሂብ ነው። አውቶሜሽን እያንዳንዱን ምላሽ ከማመን ይልቅ የሚጠብቀውን ፈቃድ ያለው አካል፣ የንብረት ትርጉምና መጠን አስቀድሞ መወሰን አለበት። `prepare` ከሰጧቸው እሴቶች የሚለይ የተዘጋጀ ግብይት አይቀበልም።

ጥያቄውን ያዘጋጁና ይላኩ:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` የጆርናል ማውጫውን በግል መዳረሻ ይፈጥራል፣ ያለውንም መተካት አይቀበልም፤ ስለዚህ ለእያንዳንዱ ጥያቄ አዲስ ማውጫ ይጠቀሙ። ፋውሴቱ ክፍት የሙከራ አውታረ መረብ አገልግሎት ነው። `submit` `Pending` ካለ፣ ጊዜው ካለቀ ወይም `502` ካገኘ ሌላ ጥያቄ ከማዘጋጀት ይልቅ በዚያው ውቅርና ጆርናል `taira account faucet resume` ያስኪዱ። ያረጀ የሥራ ማስረጃ መልሕቅ `prepare`ን ያከሽፋል፤ በአዲስ የጆርናል ማውጫ እንደገና ያዘጋጁ።

ከዚያ የራስዎን ክፍያ የሚከፍሉ ግብይቶችን ከማስገባትዎ በፊት ለተደገፈው ንብረት ድምጽ ይስጡ -

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

ጥያቄው ከተተገበረ ግን ንብረቱ ገና ካልታየ ሁኔታን የሚቀይሩ ክዋኔዎችን ከመላክዎ በፊት ይጠብቁና ንባቡን እንደገና ይሞክሩ።

የገንዘብ አገልግሎቱ ለ Taira ሙከራ መረብ ገንዘብ ብቻ ነው። በ Minamoto ፍሰቶች ውስጥ የሙከራ XOR፣ የገንዘብ አገልግሎት መለያዎች ወይም የ Taira የቅድመ-ማስጠንቀቂያ ፈራሚዎችን አይጠቀሙ።

## 5. የ Minamoto የደንበኛ ውቅር ይፍጠሩ {#_5-create-a-minamoto-client-config}

Minamotoን ከመጠቀምዎ በፊት የዋናውን አውታረ መረብ አገልግሎት አድራሻ ከኦፕሬተሩ ጋር ያረጋግጡ፤ የTLS ምስክር ወረቀቱ ከአስተናጋጁ ስም ጋር መዛመዱንም ይፈትሹ።

ለ Minamoto የተለየ የቁልፍ ጥንድ ይጠቀሙ። ለዋና መረብ Taira ቁልፎችን እንደገና አይጠቀሙ።

`minamoto.client.toml` ይፍጠሩ

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

በላይኛው ደረጃ ያለው `chain` የአሁኑ የSORA Nexus ዋና አውታረ መረብ ሰንሰለት ID ነው፣ `network_id` ደግሞ ትክክለኛው የMinamoto አውታረ መረብ ማንነት ነው፤ ከመጀመሪያው የተፈረመ ክዋኔ በፊት ከcapabilities መንገድ ያንብቡት። `[account].profile = "minamoto"` የMinamoto I105 የሰንሰለት መለያያን ይመርጣል፤ የመገናኛ ነጥቡ አስተናጋጅ ስምና የሰንሰለት ID በስውር አይመርጡትም።

የ Minamoto የህዝብ ቁልፍን ከዋና መረብ ቅድመ ቅጥያ ጋር ወደ ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መለያ መታወቂያ ይለውጡ

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

መለያው በዋና መረብ የመሳፈሪያ ወይም የአስተዳደር ፍሰት በኩል እስኪቀርብ እና እስኪደገፍ ድረስ የተነበበ ጎን ቼኮችን ብቻ ያሂዱ -

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

የTaira ፋውሴት ወይም መሠረታዊ ሙከራ ትዕዛዞችን በMinamoto ላይ አያስኪዱ።

## 6. የ Minamoto መለያን በ XOR ይደግፉ {#_6-fund-a-minamoto-account-with-xor}

Minamoto ክፍያዎች የሚከፈሉት በምርት XOR ነው፣ እና Minamoto ምንም የህዝብ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የለውም። የተዋቀረውን መለያ በተፈቀደው የዋና መረብ መሳፈሪያ ወይም የግምጃ ቤት ዝውውር የገንዘብ ድጋፍ ያድርጉ ወይም XOR ከነባር የገንዘብ ድጋፍ Minamoto መለያ ይቀበሉ።

የመጻፍ ክዋኔ ከማስገባትዎ በፊት ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የመለያ መታወቂያ እና የገንዘብ ድጋፍ በተነባቢ-ብቻ ቼኮች ያረጋግጡ። Minamoto XOR ን እንደ የምርት ፈንድ ይያዙ በመጀመሪያ በ Taira ላይ ተመሳሳይ ክዋኔን ይለማመዱ፣ የተለዩ የምርት ቁልፎችን ያስቀምጡ እና የዋና ኔት ግብይት ዳግም ሊጀመር ይችላል ብለው አያስቡ።

Taira XOR የ Minamoto ክፍያዎችን አይከፍልም። የሙከራ መረብ ቀሪ ሂሳቦችና የገንዘብ ጥያቄዎች ወደ Minamoto አይተላለፉም።

## 7. በነባር የውሂብ ቦታ ውስጥ ይሥሩ {#_7-work-inside-an-existing-data-space}

በውሂብ ቦታ ውስጥ ለሚኖሩ የመዝገብ ነገሮች ሙሉ የተገለጹ የጎራ ስሞችን ይጠቀሙ። ለምሳሌ በክፍት የውሂብ ቦታ ያለ የፕሮጀክት ጎራ ይህን መጠቀም አለበት:

```text
apps.universal
```

መለያዎ የሚፈለጉትን ፈቃዶች ካገኘ በኋላ ለጎራው ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ ይፍጠሩ እና ገላጭ እቅድ አውጪውን ይጠቀሙ -

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

ለ Minamoto፣ የተለየ የዋና መረብ ዓላማ እና እቅድ ያፍጠሩ እና ያጽድቁ። ዕቅዶች ከሰንሰለታቸው፣ ከፍቃድ ርእሰ መምህራን፣ ከቀጥታ-ሁኔታ መልህቅ እና ከጊዜ ገደብ ጋር የተሳሰሩ ናቸው፣ ስለዚህ የ Taira እቅድ ሊተዋወቅ ወይም ሊደግም አይችልም -

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

የመለያ ተለዋጭ ስሞች ያንኑ የውሂብ ቦታ ድህረ ቅጥያ ይጠቀማሉ:

```text
alice@apps.universal
alice@universal
```

ጥብቅ የመለያ መስኮች አሁንም ነጠላ ፕሮቶኮል-መደበኛ I105 መለያ መታወቂያዎችን ይጠቀማሉ። ተለዋጭ ስሞችን ወደ ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያዎች የሚፈቱ በሰው ሊነበቡ የሚችሉ ማሰሪያዎች አድርገው ይያዙ።

## 8. አዲስ የውሂብ ቦታ ያቋቁሙ {#_8-provision-a-new-data-space}

አዲስ የውሂብ ቦታ የኦፕሬተርና የአስተዳደር ለውጥ ነው። ክፍቱ የTorii መገናኛ ነጥብ ትራፊክን ወደ ተዋቀሩ የውሂብ ቦታዎች ሊመራ ይችላል፣ ያልታወቁ የውሂብ ቦታ ተለዋጭ ስሞችን ግን ይከለክላል።

ለውጥ ከማዘጋጀትዎ በፊት የአሁኑን የቀጥታ ካታሎግ ይያዙ

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ለኦፕሬተር መለያ፣ እንዲሁም የማስፈጸሚያ መስመር ቴክኒካል አንጸባራቂ አቀማመጥን ያረጋግጡ -

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

የመስመር ID፣ የውሂብ ቦታ ID፣ የአረጋጋጭ ስብስብ፣ የብልሽት መቋቋም አቅም፣ ማኒፌስት፣ የማዘዋወር ደንቦችና የአሠራር ባለቤት በጋራ ካልተገመገሙ አዲስ ተለዋጭ ስም ወደ ሥራ አያስገቡ። የሚፈለጉት ፈቃዶች ያሉት መደበኛ የተጠቃሚ መለያ በነባር የውሂብ ቦታ ውስጥ ጎራና የSNS ኪራዩን በተለዋጭ ስም ዕቅድ አውጪው ሊያገኝ ይችላል፤ አዲስ ክፍት የውሂብ ቦታ በደህና መጨመር አይችልም።

ለግል ወይም ለድርጅት የውሂብ ቦታ እነዚህን የያዘ የካታሎግ ለውጥ ያዘጋጁ:

- ልዩ የውሂብ ቦታ ተለዋጭ ስም እና ቁጥራዊ `id`
- ተዛማጅ የማስፈጸሚያ መስመር ግቤት ወይም ነባር የማስፈጸሚያ መስመር ምደባ
- የውሂብ ቦታው `fault_tolerance`
- ወደዚያ መሄድ ያለባቸውን መመሪያዎች ወይም የመለያ ወሰን የማስተላለፊያ ህጎች
- የውሂብ ቦታው የUAID ችሎታዎችን ሲያቀርብ የSpace Directory ማኒፌስት ወይም ተመጣጣኝ የማሰራጨት ማስረጃ
- ለአረጋጋጭ፣ ተገዢነት፣ የፋይናንስ ግብይት ማጠናቀቂያ እና የክትትል ፖሊሲ የአስተዳደር ማፅደቅ

ሊገመገም የሚችል የውቅረት ቁርጥራጭ ይህን ይመስላል

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

የኦፕሬተር ተቀባይነት እነዚህን በሮች ማካተት አለበት -

- `iroha3d --sora --config <config.toml> --trace-config` በተፈታው የኖድ ውቅር ላይ ያልፋል
- የተፈጠረው ወይም የተገመገመው ቴክኒካል ማኒፌስት በምስጠራ ሃሽዎች እና ፊርማዎች ተቀምጧል
- የየመጀመሪያ የስራ ሙከራዎች ከማንኛውም Minamoto ማስተዋወቂያ በፊት Taira ያልፋሉ
- ከለውጡ በኋላ ያለው `/status` ካታሎግ የታሰበውን መስመርና የውሂብ ቦታ ያሳያል
- `iroha app nexus lane-report --summary` የጠፉ አስፈላጊ ቴክኒካዊ መግለጫዎችን ሪፖርት አያደርግም

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ያንኑ የውሂብ ቦታ ወደ Minamoto የሚያስተላልፉት የTaira ስምሪት፣ መሠረታዊ ሙከራዎች፣ ክትትልና የአስተዳደር ማስረጃ ከተጠናቀቁ በኋላ ብቻ ነው።

## ተዛማጅ ገጾች {#related-pages}

- [Iroha 3 ን ጫን](/am/get-started/install-iroha.md)
- [Iroha 3 በ CLI በኩል ያሂዱ](/am/get-started/operate-iroha-via-cli.md)
- [ለግል የውሂብ ቦታ ክፍያዎችን በስፖንሰር ይሸፍኑ](/am/get-started/private-dataspace-fee-sponsor.md)
- [Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [የብሎክቼይን ጀነሲስ ማጣቀሻ](/am/reference/genesis.md)
