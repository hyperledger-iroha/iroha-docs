---
translation_locale: am
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# በ SORA 3 Taira እና Minamoto ላይ ይገንቡ {#build-on-sora-3-taira-and-minamoto}

SORA 3 በ Iroha 3 እና SORA Nexus ላይ የተገነባው መተግበሪያን የሚመለከት የህዝብ ማሰማራት ትራክ ነው። መጀመሪያ በ Taira ላይ ይገንቡ እና ይለማመዱ፣ ከዚያ ተመሳሳዩን የደንበኛ ቅርፅ ወደ Minamoto ያንቀሳቅሱት የተለየ የዋና መረብ ቁልፎች፣ እውነተኛ XOR ለክፍያ እና ለምርት ማጽደቅ ሲኖርዎት ብቻ ነው።

ይህ አጋዥ ስልጠና የ Iroha ደንበኛን ለህዝብ SORA 3 አውታረ መረቦች እንዴት ማዋቀር እንደሚቻል ያሳያል -

- Taira የሙከራ መረብ በ `https://taira.sora.org`
- Minamoto ዋና መረብ በ `https://minamoto.sora.org`

ለውህደት ሙከራዎች፣ በቴስትኔት የገንዘብ ድጋፍ ለሚደረግላቸው ካናሪዎች እና ለማሰማራት ልምምዶች Taira ን ይጠቀሙ። Minamoto ን ለምርት ዝግጁ ለሆኑ ዋና መረብ እንቅስቃሴ ብቻ ይጠቀሙ። ሁለቱም አውታረ መረቦች በ XOR ውስጥ ክፍያዎችን ያስከፍላሉ -

- Taira Testnet XOR ከህዝብ Testnet የገንዘብ ድጋፍ አገልግሎት ይጠቀማል።
- Minamoto እውነተኛ XOR ይጠቀማል. Minamoto የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የለም።

## የገንቢ መንገድ {#builder-path}

|ደረጃ|Taira የሙከራ መረብ|Minamoto ዋና መረብ|
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|የአውታረ መረብ ሁኔታን ማንበብ ይጀምሩ|መጠይቅ `/status` ያለ ቁልፎች|መጠይቅ `/status` ያለ ቁልፎች|
|የውሂብ ቦታ ይምረጡ|መተግበሪያዎ የሚተዳደር የማስፈጸሚያ መስመር ካልፈለገ በስተቀር ይፋዊ `universal` ይጠቀሙ|ተመሳሳዩን የውሂብ ቦታ ይጠቀሙ ከዋና ኔት ፈቃድ በኋላ ብቻ|
|የክፍያ ንብረት ያግኙ|የህዝብ Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎትን ይጠቀሙ|XOR በገንዘብ ከተደገፈ Minamoto ሂሳብ ወይም ከተፈቀደ የግምጃ ቤት ፍሰት ይቀበሉ|
| የሙከራ ክዋኔዎች | በገንዘብ አገልግሎቱ የተሞላ የሙከራ XOR ይጠቀሙ | የሙከራ መሣሪያ አይጠቀሙ፤ ክዋኔዎቹ እውነተኛ XOR ያወጣሉ |
|ያስተዋውቁ|አመክንዮ፣ ክትትል እና ምስጠራ ፈራሚ አያያዝን እንደገና ይሞክሩ|የተለዩ ቁልፎችን፣ የገንዘብ ድጋፍን እና የመልቀቂያ መቆጣጠሪያዎችን ይጠቀሙ|

ተግባራዊ ፍሰት የሚከተለው ነው-

1. ደንበኛውን በ Taira ላይ ይገንቡ እና ይፋዊውን `universal` የውሂብ ቦታ ይጠቀሙ።
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

በ SORA Nexus ውስጥ፣ የውሂብ ቦታ የአውታረ መረብ ማስፈጸሚያ መስመር እና የማስተላለፊያ ካታሎግ አካል ነው። ደንበኛ `client.toml` በመቀየር ብቻ አዲስ የህዝብ ዳታ ቦታ አይፈጥርም። የደንበኛ ማዋቀር ሁለት ነገሮችን ያደርጋል -

1. ደንበኛውን በቀኝ በኩል ይጠቁማል Torii API የመጨረሻ ነጥብ
2. ለነጠላ ፕሮቶኮል-መደበኛ መለያው የጎራ እና የውሂብ ቦታ ማዘዋወር አውድ ይመርጣል

`AccountId` ሁልጊዜ ነጠላ ፕሮቶኮል-መደበኛ እና ጎራ የሌለው ነው። በ`client.toml` ውስጥ ያለው የ`[account].domain` እሴት ማዘዋወር እና ተለዋጭ ስም አውድ ያቀርባል; የመለያ ማንነት አካል አይሆንም። ለአብዛኛዎቹ መተግበሪያዎች፣ በይፋዊ `universal` የውሂብ ቦታ ይጀምሩ። የጎራ አውድ የ`domain.dataspace` ቅጹን ይጠቀማል፣ ለምሳሌ -

```text
wonderland.universal
```

አዲስ ድርጅታዊ የመረጃ ቦታ ካስፈለገዎት፣ ከመደበኛ የደንበኛ መለያ ለመመዝገብ ከመሞከር ይልቅ የካታሎግ እና የማስተላለፊያ ፕሮፖዛል ያዘጋጁ። ከታች [አዲስ የመረጃ ቦታ ያቅርቡ](#_8-provision-a-new-dataspace) ይመልከቱ።

## 2. ይፋዊ Torii API የመጨረሻ ነጥብ ያረጋግጡ {#_2-check-the-public-torii-endpoint}

ምስጠራ ፈራሚን ከማዋቀርዎ በፊት የዒላማው API የመጨረሻ ነጥብ ቀጥታ መሆኑን ያረጋግጡ።

ለ Taira

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ለ Minamoto

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

በኖድ የተጋለጠውን የውሂብ ቦታ እና የማስፈጸሚያ መስመር እይታ ይፈትሹ -

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ለዋና መረብ ከ `https://minamoto.sora.org/status` ጋር ተመሳሳይ ትዕዛዝ ይጠቀሙ።

## Taira MCP ለወኪሎች {#taira-mcp-for-agents}

Taira እንዲሁም ለወኪል ሶፍትዌር ማስፈጸሚያ አካባቢዎች Torii ቤተኛ የሞዴል አውድ ፕሮቶኮል (MCP) ድልድይ ያጋልጣል። አንድ ወኪል መጀመሪያ ብጁ Torii ደንበኛ ሳይገነቡ የቀጥታ ቴስትኔት ንባብ፣ ስክሪፕት የተደረጉ ምርመራዎች ወይም በጥብቅ የተገመገሙ የመፃፍ ልምምዶችን ሲፈልግ ይጠቀሙበት።

|ቅንብር|እሴት|
| --- | --- |
|MCP API የመጨረሻ ነጥብ|`https://taira.sora.org/v1/mcp`|
|የአውታረ መረብ ስርወ|`https://taira.sora.org`|
|የታቀደ አጠቃቀም|Taira Testnet ያነባል እና በቴስትኔት የገንዘብ ድጋፍ የሚደረግላቸው የመፃፍ ልምምዶች|
| የምርት አካባቢ አቻ |ዋና መረብ MCP API የመጨረሻ ነጥብ እና የመልቀቂያ መቆጣጠሪያዎች በግልፅ ካልፀደቁ በስተቀር ይህንን ግቤት በ Minamoto አይጠቁሙ|

የመፈረሚያ ቁሳቁሶችን ከማከልዎ በፊት የድልድዩን ሜታዳታ ያረጋግጡ -

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
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
3. የግብይት-ግንባታ ኮድ ያክሉ ተነባቢ-ብቻ API ጥያቄዎች በ Taira ላይ ከሰሩ በኋላ ብቻ ነው።
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
- ውድቅ መልእክት እና ውድቀቱ ፈቃዶች፣ ክፍያዎች፣ ማረጋገጫ፣ የቆየ ሁኔታ ወይም API የመጨረሻ ነጥብ ተገኝነት ይመስላል

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

እነዚህ ምሳሌዎች ካልተጠቀሱ በስተቀር ተነባቢ-ብቻ ናቸው። ቁልፎችን ከማመንጨትዎ በፊት ይሰራሉ እና በሁለቱም የህዝብ አውታረ መረቦች ላይ ለመስራት ደህና ናቸው።

Taira testnet እና Minamoto mainnet healthን ያወዳድሩ -

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

በ Taira የተጋለጡትን ይፋዊ የውሂብ ቦታ ማስፈጸሚያ መስመሮችን ይዘርዝሩ -

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

የዋና መረብ እይታ በሚፈልጉበት ጊዜ በ Minamoto ላይ ተመሳሳይ ትዕዛዝ ያሂዱ -

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ለዳሽቦርድ፣ ቦት ወይም ማሰማራት ቼክ ትንሽ Node.js የሁኔታ ምርመራ ይገንቡ -

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
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
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ከፍተኛው ደረጃ `chain` ትክክለኛው Taira የግብይት ሰንሰለት መታወቂያ ነው። የ`[account].profile = "taira"` ቅንብር በተናጥል የ Taira I105 ሰንሰለትን ልዩነት ይመርጣል። የሰንሰለት መታወቂያው መለያውን አይመርጥም.

ተነባቢ-ብቻ ቼክ ያሂዱ -

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

ፈተናዎችን ከመጻፍዎ በፊት ይፋዊውን Taira ምርመራዎችን ያሂዱ -

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ክፍያ የሚጠይቁ የመጻፍ ክዋኔዎችን ከማካሄድዎ በፊት የ Taira መለያውን በሙከራ ገንዘብ አገልግሎቱ ይሙሉ። ቀጥተኛው ሂደት [በ Taira የሙከራ XOR ያግኙ](#_4-get-testnet-xor-on-taira) ውስጥ ነው።

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የይገባኛል ጥያቄ ተቀባይነት ካገኘ እና ሂሳቡ የገንዘብ ድጋፍ ከተደረገ በኋላ፣ Taira ካናሪ አማራጭ የጭስ ማውጫ ሙከራ ነው።

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

ካናሪው የተፈረመ ፒንግ ያቀርባል፣ ማረጋገጫን ይጠብቃል፣ እና `--write-config` ሲቀርብ የሶፍትዌር ማስፈጸሚያ አካባቢን ምስጠራ ፈራሚ ውቅር ይጽፋል። Taira ይፋዊ የሙከራ መረብ ነው፣ ስለዚህ የወረፋ ሙሌት የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ራሱ እየሰራ ቢሆንም የተፈረመው ፒንግ እንዲወድቅ ሊያደርግ ይችላል። `taira doctor` የተሞላ ወረፋን ሪፖርት ካደረገ ወይም ካናሪ ከተመለሰ `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`፣ እንደ ደንበኛ ውቅር ስህተት ከመቁጠርዎ በፊት ይጠብቁ እና እንደገና ይሞክሩ።

ያልተጠበቁ የየመጀመሪያ የስራ ሙከራዎች፣ ካናሪውን በተገደበ የድጋሚ ሙከራ ዑደት ውስጥ ይሸፍኑት -

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

`iroha taira doctor` ከባድ ውድቀቶችን ካሳየ እንደገና መሞከርዎን ያቁሙ። ወረፋ ሙሌት እና የክፍያ መግቢያ ውድቅ ጊዜያዊ የህዝብ-ቴስትኔት ሁኔታዎች ናቸው። DNS፣ TLS ወይም `status = "fail"` ምርመራዎች አይደሉም።

## የ SORA Nexus መለያ መታወቂያ ይፍጠሩ {#generate-a-sora-nexus-account-id}

የ SORA Nexus መለያ መታወቂያ ከመለያው የህዝብ ቁልፍ እና ከዒላማው አውታረ መረብ ቅድመ ቅጥያ የተገኘ ነጠላ ፕሮቶኮል-ስታንዳርድ I105 አድራሻ ነው። የ`[account].domain` እሴት አይደለም በደንበኛ TOML። ተመሳሳይ የህዝብ ቁልፍ በ Taira እና Minamoto ላይ ለተለያዩ መታወቂያዎች ኮድ ያደርጋል፣ እና የምርት ተጠቃሚዎች ለ Minamoto የተለየ የቁልፍ ጥንድ ማመንጨት አለባቸው።

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

የ Nexus፣ API ወይም CLI ትዕዛዝ አንድ ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያ በሚጠይቅበት ቦታ ሁሉ የተገኘውን የመለያ መታወቂያ ይጠቀሙ፣ ለምሳሌ የ Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎት `account_id`፣ ቀሪ ሒሳብ መጠይቆች፣ ጥብቅ የመለያ መስኮች ወይም ተለዋጭ ስም ማሰሪያዎች። የሚዛመደውን የግል ቁልፍ በደንበኛ ውቅረትዎ ውስጥ ያስቀምጡት እና ከ`[account].profile = "taira"` ወይም `[account].profile = "minamoto"` ጋር ተመሳሳይ የህዝብ አውታረ መረብ ይምረጡ።

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

የህዝብ testnet የገንዘብ ድጋፍ አገልግሎትን በቀጥታ ይጠቀሙ። ፍሰቱ የሚከተለው ነው

1. ምስጠራ ፈራሚ ይፍጠሩ ወይም ይጫኑ እና ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ Taira መለያ መታወቂያውን ያሰሉ።
2. የአሁኑን የቴስትኔት የገንዘብ ድጋፍ አገልግሎት እንቆቅልሽ አምጡ።
3. `difficulty_bits` ከ`0` የሚበልጥ ከሆነ እንቆቅልሹን ይፍቱ።
4. የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የይገባኛል ጥያቄ ያስገቡ።
5. ክፍያ የሚከፍሉ የመጻፍ ክዋኔዎችን ከመላክዎ በፊት መለያው ወይም የንብረት ቀሪ ሂሳቡ እስኪታይ ድረስ ይጠብቁ።

የህዝብ ቁልፍን በቴስትኔት የገንዘብ ድጋፍ አገልግሎት ወደሚጠበቀው Taira I105 መለያ መታወቂያ ይለውጡ -

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

እንቆቅልሹን አምጡ -

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የህዝብ ቴስትኔት አገልግሎት ነው። እንቆቅልሹ ወይም የይገባኛል ጥያቄው API የመጨረሻ ነጥብ `502`፣ ጊዜ ማብቂያ ወይም ሌላ የመግቢያ ደረጃ ስህተት ከተመለሰ ቁልፎችዎን ወይም የደንበኛ ውቅር ከመቀየርዎ በፊት ይጠብቁ እና እንደገና ይሞክሩ።

ምላሹ ይህ ቅርጽ አለው

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

`difficulty_bits` `0` ሲሆን የመለያ መታወቂያውን ብቻ ያስገቡ -

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits` ከ`0` ሲበልጥ እንቆቅልሹን ይፍቱ እና የመልህቅ ቁመቱን እና ምስጠራ ኖስ እሴትን ያካትቱ

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

የእንቆቅልሽ ስልተ ቀመር የሚከተለው ነው-

1. ፈተናውን እንደ SHA-256 ይገንቡ -
   - የ `iroha:accounts:faucet:pow:v2`
   - የ UTF-8 መለያ መታወቂያ
   - `anchor_height` እንደ ቢግ-ኢንዲያን `u64`
   - `anchor_block_hash_hex` እንደ ባይት ተፈትኗል
   - `challenge_salt_hex` እንደ ባይት ዲኮድ ፣ ሲገኝ
2. እንደ ትልቅ-ኢንዲያን ባለ 8-ባይት እሴቶች የተመሰጠሩ `u64` ምስጠራ ኖስ እሴቶችን ይሞክሩ።
3. ለእያንዳንዱ ምስጠራ ኖስ እሴት፣ scryptን በሚከተለው ያሂዱ -
   - የይለፍ ቃል ባለ 8-ባይት ምስጠራ NONCE እሴት
   - ጨው የ 32 ባይት ፈተና
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - የውጤት ርዝመት 32 ባይት
4. አሸናፊው ምስጠራ ኖስ እሴት ቢያንስ `difficulty_bits` ዜሮ ቢት የሚመራ የመጀመሪያው የክሪፕቶግራፊያዊ ዳይጀስት ነው።

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ምላሽ በገንዘብ የተደገፈውን ንብረት እና ወረፋ ያለው ግብይት ምስጠራ ሃሽ ያካትታል -

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

ምላሹ በአሁኑ ጊዜ በ HTTP `202 Accepted` ተመልሷል። የእሱ `asset_definition_id` በሕዝብ ቴስትኔት የገንዘብ ድጋፍ አገልግሎት የሚደገፈው የአሁኑ Taira ክፍያ ንብረት ነው። የምሳሌ መታወቂያ ከመቅዳት ይልቅ ከምላሹ ያግኙት። የቴስትኔት የገንዘብ ድጋፍ አገልግሎት `tx_hash_hex` እና `status: "QUEUED"` ሲመለስ ጥያቄውን ተቀብሏል።

ከዚያ የራስዎን ክፍያ የሚከፍሉ ግብይቶችን ከማስገባትዎ በፊት ለተደገፈው ንብረት ድምጽ ይስጡ -

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የይገባኛል ጥያቄ ተቀባይነት ካገኘ ነገር ግን መለያው ወይም ንብረቱ እስካሁን ካልታየ፣ ግብይቱ አሁንም በይፋዊ የቴስትኔት ወረፋ ሂደት ውስጥ ወደ ኋላ ቀርቷል። የመጻፍ ክዋኔዎችን ከመላክዎ በፊት ይጠብቁ እና ለማንበብ እንደገና ይሞክሩ።

ለመሮጥ ዝግጁ የሆነ ቀጥተኛ API ቼክ፣ ይህንን እንደ `taira_faucet_claim.py` ያስቀምጡ እና Taira I105 መለያ መታወቂያውን ያስተላልፉ -

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

የገንዘብ አገልግሎቱ ለ Taira ሙከራ መረብ ገንዘብ ብቻ ነው። በ Minamoto ፍሰቶች ውስጥ የሙከራ XOR፣ የገንዘብ አገልግሎት መለያዎች ወይም የ Taira የቅድመ-ማስጠንቀቂያ ፈራሚዎችን አይጠቀሙ።

## 5. የ Minamoto የደንበኛ ውቅር ይፍጠሩ {#_5-create-a-minamoto-client-config}

ለ Minamoto የተለየ የቁልፍ ጥንድ ይጠቀሙ። ለዋና መረብ Taira ቁልፎችን እንደገና አይጠቀሙ።

`minamoto.client.toml` ይፍጠሩ

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ከፍተኛው ደረጃ `chain` የአሁኑ Nexus የዋና መረብ ሰንሰለት መታወቂያ ነው። `[account].profile = "minamoto"` የ Minamoto I105 ሰንሰለት መለያን ይመርጣል; የ API የመጨረሻ ነጥብ አስተናጋጅ ስም እና የሰንሰለት መታወቂያ በተዘዋዋሪ አይመርጡትም።

የ Minamoto የህዝብ ቁልፍን ከዋና መረብ ቅድመ ቅጥያ ጋር ወደ ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መለያ መታወቂያ ይለውጡ

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

መለያው በዋና መረብ የመሳፈሪያ ወይም የአስተዳደር ፍሰት በኩል እስኪቀርብ እና እስኪደገፍ ድረስ የተነበበ ጎን ቼኮችን ብቻ ያሂዱ -

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

የ Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎትን ወይም በ Minamoto ላይ የካናሪ ረዳት አያሂዱ።

## 6. የ Minamoto መለያን በ XOR ይደግፉ {#_6-fund-a-minamoto-account-with-xor}

Minamoto ክፍያዎች የሚከፈሉት በምርት XOR ነው፣ እና Minamoto ምንም የህዝብ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የለውም። የተዋቀረውን መለያ በተፈቀደው የዋና መረብ መሳፈሪያ ወይም የግምጃ ቤት ዝውውር የገንዘብ ድጋፍ ያድርጉ ወይም XOR ከነባር የገንዘብ ድጋፍ Minamoto መለያ ይቀበሉ።

የመጻፍ ክዋኔ ከማስገባትዎ በፊት ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የመለያ መታወቂያ እና የገንዘብ ድጋፍ በተነባቢ-ብቻ ቼኮች ያረጋግጡ። Minamoto XOR ን እንደ የምርት ፈንድ ይያዙ በመጀመሪያ በ Taira ላይ ተመሳሳይ ክዋኔን ይለማመዱ፣ የተለዩ የምርት ቁልፎችን ያስቀምጡ እና የዋና ኔት ግብይት ዳግም ሊጀመር ይችላል ብለው አያስቡ።

Taira XOR የ Minamoto ክፍያዎችን አይከፍልም። የሙከራ መረብ ቀሪ ሂሳቦችና የገንዘብ ጥያቄዎች ወደ Minamoto አይተላለፉም።

## 7. አሁን ባለው የውሂብ ቦታ ውስጥ ይስሩ {#_7-work-inside-an-existing-dataspace}

በዳታ ቦታ ውስጥ ላሉ የብሎክቼይን መዝገብ ዕቃዎች ሙሉ ብቁ የሆኑ የጎራ ስሞችን ይጠቀሙ። ለምሳሌ፣ በይፋዊ ዳታ ቦታ ውስጥ ያለ የፕሮጀክት ጎራ የሚከተሉትን መጠቀም አለበት -

```text
apps.universal
```

መለያዎ የሚፈለጉትን ፈቃዶች ካገኘ በኋላ ለጎራው ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ ይፍጠሩ እና ገላጭ እቅድ አውጪውን ይጠቀሙ -

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

ለ Minamoto፣ የተለየ የዋና መረብ ዓላማ እና እቅድ ያፍጠሩ እና ያጽድቁ። ዕቅዶች ከሰንሰለታቸው፣ ከፍቃድ ርእሰ መምህራን፣ ከቀጥታ-ሁኔታ መልህቅ እና ከጊዜ ገደብ ጋር የተሳሰሩ ናቸው፣ ስለዚህ የ Taira እቅድ ሊተዋወቅ ወይም ሊደግም አይችልም -

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

የመለያ ተለዋጭ ስሞች ተመሳሳይ የውሂብ ቦታ ቅጥያ ይጠቀማሉ -

```text
alice@apps.universal
alice@universal
```

ጥብቅ የመለያ መስኮች አሁንም ነጠላ ፕሮቶኮል-መደበኛ I105 መለያ መታወቂያዎችን ይጠቀማሉ። ተለዋጭ ስሞችን ወደ ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያዎች የሚፈቱ በሰው ሊነበቡ የሚችሉ ማሰሪያዎች አድርገው ይያዙ።

## 8. አዲስ የውሂብ ቦታ ያቅርቡ {#_8-provision-a-new-dataspace}

አዲስ የውሂብ ቦታ ኦፕሬተር እና የአስተዳደር ለውጥ ነው። የህዝብ Torii API የመጨረሻ ነጥብ ትራፊክን ወደ ተዋቀሩ የውሂብ ቦታዎች ማዞር ይችላል፣ ነገር ግን ያልታወቁ የውሂብ ቦታ ተለዋጭ ስሞችን ውድቅ ያደርጋል።

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

የማስፈጸሚያ ሌይን መታወቂያ፣ የውሂብ ቦታ መታወቂያ፣ አረጋጋጭ ስብስብ፣ የስህተት መቻቻል፣ ቴክኒካል ማኒፌስት፣ የማስተላለፊያ ህጎች እና የአሠራር ባለቤት አንድ ላይ ካልተገመገሙ በስተቀር አዲስ ተለዋጭ ስም አያስተዋውቁ። የሚፈለጉት ፈቃዶች ያለው መደበኛ የተጠቃሚ መለያ ጎራ እና SNS የሊዝ ውል አሁን ባለው የውሂብ ቦታ ውስጥ በተለዋጭ ስም እቅድ አውጪ ማግኘት ይችላል። አዲስ የህዝብ የውሂብ ቦታ በደህና ማከል አይችልም።

ለግል ወይም ድርጅታዊ የውሂብ ቦታ፣ የካታሎግ ለውጥን ያዘጋጁ -

- ልዩ የውሂብ ቦታ ተለዋጭ ስም እና ቁጥር `id`
- ተዛማጅ የማስፈጸሚያ መስመር ግቤት ወይም ነባር የማስፈጸሚያ መስመር ምደባ
- የውሂብ ቦታ `fault_tolerance`
- ወደዚያ መሄድ ያለባቸውን መመሪያዎች ወይም የመለያ ወሰን የማስተላለፊያ ህጎች
- የውሂብ ቦታው UAID ችሎታዎችን ሲያጋልጥ የጠፈር ማውጫ ቴክኒካል ማኒፌስት ወይም ተመጣጣኝ የልቀት ማስረጃ
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
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

የኦፕሬተር ተቀባይነት እነዚህን በሮች ማካተት አለበት -

- `iroha3d --sora --config <config.toml> --trace-config` በተፈታው የኖድ ውቅር ላይ ያልፋል
- የተፈጠረው ወይም የተገመገመው ቴክኒካል ማኒፌስት በምስጠራ ሃሽዎች እና ፊርማዎች ተቀምጧል
- የየመጀመሪያ የስራ ሙከራዎች ከማንኛውም Minamoto ማስተዋወቂያ በፊት Taira ያልፋሉ
- የድህረ-ለውጥ `/status` ካታሎግ የታሰበውን የማስፈጸሚያ መስመር እና የውሂብ ቦታ ያሳያል
- `iroha app nexus lane-report --summary` የጠፉ አስፈላጊ ቴክኒካዊ መግለጫዎችን ሪፖርት አያደርግም

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ተመሳሳዩን የውሂብ ቦታ ወደ Minamoto ያስተዋውቁት Taira ማሰማራት፣ የየመጀመሪያ የስራ ሙከራዎች፣ የክትትል እና የአስተዳደር ማስረጃዎች ከተጠናቀቁ በኋላ ብቻ ነው።

## ተዛማጅ ገጾች {#related-pages}

- [Iroha 3 ን ጫን](/am/get-started/install-iroha.md)
- [Iroha 3 በ CLI በኩል ያሂዱ](/am/get-started/operate-iroha-via-cli.md)
- [ለግል የውሂብ ቦታ የስፖንሰር ክፍያዎች](/am/get-started/private-dataspace-fee-sponsor.md)
- [Torii API የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [የብሎክቼይን ጀነሲስ ማጣቀሻ](/am/reference/genesis.md)
