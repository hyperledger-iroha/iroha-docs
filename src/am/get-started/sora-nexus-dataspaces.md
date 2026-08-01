---
translation_locale: am
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 8cc510f79468efa58732b806c254155d4d7225c0876272bd8126ea07e8607888
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# በ SORA 3 ላይ ይገንቡ: Taira እና Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 በመተግበሪያዎች ላይ የተመሠረተ የህዝብ ማሰማራት ትራክ ነው Iroha 3 እና SORA Nexus. ላይ መገንባት እና ለመለማመድ Taira በመጀመሪያ, ከዚያም ተመሳሳይ ደንበኛ ቅርጽ ወደ Minamoto ብቻ የተለዩ የማይንኔት ቁልፎች ካሉዎት, እውነተኛ XOR ለክፍያ እና ለምርት ማረጋገጫ።

ይህ መመሪያ ለሕዝብ SORA 3 አውታረ መረቦች የ Iroha ደንበኛ እንዴት እንደሚዋቀር ያሳያል:

- Taira የሙከራ መረብ በ `https://taira.sora.org`
- Minamoto ዋና መረብ በ `https://minamoto.sora.org`

Taira ን ለመዋሃድ ሙከራዎች ፣ በቧንቧ የተደገፉ የጽሑፍ ካናሪዎችን እና የማሰማራት ልምምዶችን ይጠቀሙ ። Minamoto ን ለምርታማነት ዝግጁ ዋና አውታረመረብ እንቅስቃሴ ብቻ ይጠቀሙ። ሁለቱም አውታረመረቦች በ XOR ውስጥ ክፍያ ያስከፍላሉ-

- Taira ከሕዝብ ቧንቧው የተገኘ የሙከራ መርጃ XOR ይጠቀማል.
- Minamoto እውነተኛ XOR ይጠቀማል Minamoto ቧንቧ የለም።

## የግንባታ መንገድ {#builder-path}

|ደረጃ |Taira የሙከራ ኔት |Minamoto ማይንት |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|የአውታረ መረብ ሁኔታን ማንበብ ጀምር |ጥያቄ `/status` ያለ ቁልፍ |ጥያቄ `/status` ያለ ቁልፍ |
|የውሂብ ቦታ ይምረጡ|አፕሊኬሽኑ የሚተዳደር ጎዳና ካልፈለገ በስተቀር `universal` ይጠቀሙ።|ተመሳሳይ የመረጃ ቦታን መጠቀም የሚቻለው ከዋናው አውታረመረብ ማጽደቅ በኋላ ብቻ ነው |
|የክፍያ ገቢ ያግኙ ።|የሕዝብ Taira ቧንቧ ይጠቀሙ።|XOR ከገንዘብ የተደገፈ Minamoto ሂሳብ ወይም ከተፈቀደለት የግምጃ ቤት ፍሰት ያግኙ |
|ሙከራ ይጽፋል |በቧንቧ የተደገፈ ሙከራ ይጠቀሙ XOR |የሙከራ መሳሪያ አይጠቀሙ; እውነተኛ ወጪ ይጽፋል XOR |
|ማስተዋወቅ |ሎጂክ, ክትትል, እና ፊርማ አያያዝ እንደገና ይሞክሩ |የተለዩ ቁልፎችን፣ የገንዘብ ድጋፍ እና የመልቀቂያ ቁጥጥር ይጠቀሙ |

ተግባራዊ ፍሰት:

1. ደንበኛው Taira ላይ ይገንቡ እና የህዝብ `universal` የመረጃ ቦታን ይጠቀሙ.
2. አንድ ፊርማ ይጨምሩ እና Taira ቧንቧ ጋር የገንዘብ ድጋፍ.
3. ስህተቶች አሰልቺ እና ሊታዩ እስኪችሉ ድረስ የመተግበሪያዎን አመክንዮ በ Taira ላይ ይለማመዱ ።
4. የተለየ Minamoto ፊርማ ይፍጠሩ, ከእውነተኛ XOR ጋር የገንዘብ ድጋፍ ያድርጉት, እና ወደ ዋናው ኔትወርክ ተመሳሳይ የተረጋገጡ ስራዎችን ብቻ ያስተላልፉ.

## የምግብ አዘገጃጀት መመሪያዎች {#continue-with-the-cookbook}

ይህንን መመሪያ በመጠቀም አውታረመረብን ለመምረጥ፣ ፊርማውን ለማዋቀር እና የፋይናንስ ክፍያዎችን ለመደገፍ ይጠቀሙ። ከዚያ ለመገንባት የሚፈልጉትን የመተግበሪያ ባህሪ የሚስማማውን የምግብ አዘገጃጀት መመሪያ ይቀጥሉ-

|ግብ|የምግብ አሰራር |
| --- | --- |
|Taira ይፈትሹ እና ደንበኛን ያዋቅሩ | [ወደ Taira](/am/cookbook/connect-to-taira.md) ይገናኙ።|
|የመጀመሪያውን ጻፍ እና ውጤቱን ያረጋግጡ ።| [ግብይቶችን ማቅረብ እና ማረጋገጥ ](/am/cookbook/submit-and-verify-transactions.md) |
|የምዝገባ፣ የማዕድን ማውጫ እና የመንቀሳቀስ እሴት | [ተለዋዋጭ ሀብቶች](/am/cookbook/fungible-assets.md) |
|የተጣራውን የማመልከቻ ሁኔታ ያንብቡ | [ጥያቄ መቁጠሪያ ሁኔታ ](/am/cookbook/query-ledger-state.md) |
|ለተቀጠሩት ለውጦች ምላሽ መስጠት | [የዥረት ክስተቶች](/am/cookbook/stream-events.md) |

የምግብ አሰራር መጽሐፉ እያንዳንዱ የስራ ፍሰት ትኩረቱን የሚይዝ ሲሆን Taira የገንዘብ ድጋፍ ወይም SORA Nexus የአውታረ መረብ ዐውደ-ጽሑፍ በሚያስፈልገው ጊዜ ወደዚህ ያገናኛል ።

## 1. የምታስቀመጡትን ነገር መረዳት {#_1-understand-what-you-are-setting-up}

በ SORA Nexus ውስጥ የውሂብ ቦታ የአውታረ መረብ ጎዳና እና የመመሪያ ካታሎግ አካል ነው ። አንድ ደንበኛ `client.toml` ን በመቀየር ብቻ አዲስ የህዝብ ውሂብ ቦታ አይፈጥርም ። የደንበኛው ማዋቀር ሁለት ነገሮችን ያደርጋል-

1. ደንበኛው ወደ ቀኝ Torii መጨረሻ ነጥብ ያመለክታል
2. ለካኖኒካል መለያው የጎራ እና የመረጃ ቦታን የማዞሪያ አውድ ይመርጣል ።

`AccountId` ሁሌም መደበኛ እና ጎራ የሌለው ነው። በ `client.toml` ውስጥ ያለው `[account].domain` እሴት የጉዞ እና የአጠራር አውድ ያቀርባል ፣ እሱ የመለያ መታወቂያ አካል አይሆንም። ለአብዛኞቹ መተግበሪያዎች ከህዝብ `universal` የውሂብ ቦታ ይጀምሩ ። የጎራ አውድ `domain.dataspace` ቅፅን ይጠቀማል ፣ ለምሳሌ፡

```text
wonderland.universal
```

አዲስ የድርጅት የውሂብ ክልል ከፈለጉ ከተለመደው የደንበኛ መለያ ለመመዝገብ ከመሞከር ይልቅ ካታሎግ እና የመመሪያ ሀሳብ ያዘጋጁ። ከዚህ በታች [የአዲስ የውሂብ ክፍል ማቅረብ ](#_8-provision-a-new-dataspace) ይመልከቱ.

## የህዝብ Torii መጨረሻ ነጥብ ይመልከቱ። {#_2-check-the-public-torii-endpoint}

ፊርማውን ከማዋቀርዎ በፊት የዒላማው መጨረሻ ነጥብ ቀጥተኛ መሆኑን ያረጋግጡ ።

ለ Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ለ Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

የአውታረ መረብ የተጋለጠውን የውሂብ ቦታ እና የመንገድ እይታ ይፈትሹ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ለዋና አውታረ መረብ ተመሳሳይ ትዕዛዝ ከ `https://minamoto.sora.org/status` ጋር ይጠቀሙ።

## Taira ለወኪሎች MCP {#taira-mcp-for-agents}

Taira ለወኪል አሂድ ጊዜዎች የ Torii-አፍ መፍቻ ሞዴል አውታረ መረብ (MCP) ድልድይንም ያጋልጣል ። አንድ ወኪል በቀጥታ የሙከራ ኔት ንባቦችን ፣ ስክሪፕት ምርመራዎችን ወይም በጥብቅ የተከለከሉ የጽሑፍ ልምምዶችን ሲፈልግ በመጀመሪያ ብጁ Torii ደንበኛ ሳይገነቡ ይጠቀሙበት።

|ማዘጋጀት |ዋጋ |
| --- | --- |
|MCP መጨረሻ ነጥብ |`https://taira.sora.org/v1/mcp` |
|የአውታረ መረብ |`https://taira.sora.org` |
|የታሰበበት አጠቃቀም |Taira የሙከራ አውታረ መረብ ማንበብ እና ቧንቧ-የተደገፈ መጻፍ ልምምድ |
|የምርት እኩልነት |ይህንን ጽሑፍ በ Minamoto ላይ አያመለክቱ ፣ የዋና አውታረመረብ MCP መጨረሻ ነጥብ እና የመልቀቂያ ቁጥሮች በግልጽ ካልተፈፀሙ በስተቀር ።|

ፊርማ ቁሳቁስ ከመጨመርዎ በፊት የድልድይ ሜታዳታውን ያረጋግጡ:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL ን እንደ ተጠቃሚ አካባቢያዊ MCP አገልጋይ በኤጀንት አሂድ ጊዜ ላይ ያዋቅሩ. የኤጀንት MCP ውቅርን ፣ API ቶከኖችን ፣ የተላለፉ የደራሲ ራስጌዎችን ፣ `authority` ወይም `private_key` እሴቶችን ወደዚህ ሰነድ ሪፖ ወይም የመተግበሪያ ሪፖ አይገቡ።

Taira ጋር በጥሩ ሁኔታ የሚሠሩ ወኪል ፈጣን ደንቦች:

- ከመደወልዎ በፊት MCP አገልጋይ ላይ ያሉትን መሳሪያዎች ያግኙ; አገልጋዩ `listChanged` ሪፖርት ካደረገ እንደገና ያግኙ።
- የተመረጡትን `iroha.` መሳሪያዎች ከ ጥሬው `torii.` መሳሪያዎች ይመርጣሉ።
- ማንበብ ብቻ ይጀምሩ: የጽሑፍ ጥያቄ ከመጠየቅዎ በፊት የአስተዳደር ሁኔታን, ሂሳቦችን, ንብረቶችን, ቅጽል ስሞችን, ብሎኮችን እና የግብይት ሁኔታን ያረጋግጡ.
- የቀጥታ የሙከራ አውታረ መረብ ለውጦች በፊት በግልጽ የሰውን መመሪያ ይጠይቁ። አስቀድሞ ለተፈረሙ የግብይት ፖስታዎች `iroha.transactions.submit_and_wait` ይጠቀሙ ፣ ስለሆነም ወኪሉ ውጤቱን ከማቅረብ ይልቅ ይጠብቃል ።
- በኤጀንት ምላሽ ውስጥ የግብይት ሃሽ, የመጨረሻ ሁኔታ እና የአገልጋይ ማረጋገጫ ስህተቶችን ለማጠቃለል.

### ከወኪሎች ጋር የልማት የስራ ፍሰት {#development-workflow-with-agents}

ለ Iroha ደንበኞች፣ የግብይት ገንቢዎች፣ የምርመራ ስክሪፕቶች እና የሙከራ አውታረመረብ ሩጫ መጽሐፍት እንደ ልማት ረዳቶች ወኪሎችን ይጠቀሙ። የወኪሉን ስልጣን ጠባብ ያድርጉ: ኮዱን መመርመር፣ Taira ሁኔታን ማንበብ፣ ለውጦችን ማቀናበር እና አካባቢያዊ ሙከራዎችን ማድረግ ይችላል፤ ነገር ግን አንድ ሰው ትክክለኛውን አሠራር እስኪያጸድቅ ድረስ የቀጥታ አውታረመረብን መቀየር የለበትም.

ተግባራዊ የሆነ የስራ ፍሰት:

1. ወኪሉ ኮድ ከመጻፉ በፊት አግባብነት ያላቸውን ሰነዶች ፣ SDK ኮድ ፣ CLI ትዕዛዝ ወይም MCP መሳሪያ መርሃግብር እንዲመረምር ይጠይቁ።
2. ወኪሉ መጀመሪያ አነስተኛውን የደንበኛ መንገድ እንዲጽፍ ያድርጉት-የስቴቱ ማረጋገጫ፣ የመለያ ፍለጋ፣ የአጠራር ጥራት ወይም የሂሳብ ሚዛን ፍለጋ።
3. የግብይት ግንባታ ኮድ ማከል የሚቻለው በ Taira ላይ ብቻ ከተነበቡ በኋላ ብቻ ነው።
4. የቀጥታ አውታረመረብ ሙከራዎች ለምሳሌ ከ `TAIRA_LIVE=1` በስተጀርባ ይከተሉ ፣ ስለሆነም መደበኛ የአሃድ የሙከራ ሩጫ በጭራሽ ለሙከራ አውታረ መረብ ገንዘብ አያወጣም ወይም በኔትወርክ ተገኝነት ላይ የተመሠረተ አይደለም።
5. ወኪሉ ማንኛውንም ግብይት ከማቅረብዎ በፊት የኔትወርክ ሥር ፣ ሰንሰለት ፣ ባለስልጣን ሂሳብ ፣ የትእዛዝ ማጠቃለያ ፣ የዋጋ አክሲዮን እና የሚጠበቀው የስቴት ለውጥ ሪፖርት እንዲያደርግ ይጠይቁ።
6. ወደ CI ወይም ዋነኛ የስራ ፍሰቶች ከማስተዋወቅዎ በፊት ለስውር አያያዝ ፣ እንደገና ለመሞከር ባህሪ ፣ ለ idempotency እና ውድቅ አያያዝ የተፈጠረውን ኮድ ይገምግሙ ።

ለልማት ጠቃሚ የንባብ-ብቻ MCP መሳሪያዎች የመለያ ሀብት ፍለጋዎችን ፣ የማጠራቀሚያ መፍትሄን ፣ የብሎክ ፍለጋን ፣ የግብይት ፍለጋውን ፣ የግብይቶች ዝርዝሮችን እና የቧንቧ መስመር ሁኔታን ለመፈተሽ ያካትታሉ ። የተፈረሙ ጥቅማጥቅሞችን ከማቅረባቸው በፊት እምነትን ለመገንባት እነዚህን ይጠቀሙ።

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### በወኪሎች አማካኝነት የግብይት የሥራ ፍሰት {#transaction-workflow-through-agents}

የ MCP ድልድይ የተፈረመ Iroha ግብይት ማቅረብ ይችላል ፣ ግን መደበኛውን የግብይት መስፈርቶችን አያስወግድም ። አንድ ግብይት አሁንም ትክክለኛ ባለስልጣን ፣ ፈቃዶች ፣ የክፍያ የገንዘብ ድጋፍ ፣ ሰንሰለት ID ፣ ሜታዳታ እና ፊርማ ይፈልጋል።

ጥሬ Iroha ግብይቶች፣ የግብይት ፖስታን በመገንባት እና በ SDK ወይም CLI በመጀመሪያ, ከዚያም ወኪል ብቻ እንደ encoded የተፈረሙትን ቀኖናዊ የግብይት ባይቶች መስጠት `body_base64`. ወኪሉ መልዕክቱን በ `iroha.transactions.submit_and_wait`, ወይም ያቅርቡ `iroha.transactions.submit` እና የምርመራ ጋር `iroha.transactions.wait`.

የግል ቁልፎችን በወኪል ግብይት ውስጥ አይጣበቁ። አንድ ወኪል ግብይት ለመገንባት ከፈለገ፣ ምስጢሮችን በሚጭነው አካባቢያዊ ኮድ ላይ ያነጣጠረው። የተጠቃሚው የስራ ሰዓት አካባቢ፣ ቁልፍ ሰንሰለት፣ ሃርድዌር ፊርማ ወይም ችላ የተባለው የሙከራ ኔት ውቅር ፋይል። ወኪሉ ቁልፍ ቁሳቁሶቹን በጭራሽ ወደ ማርክዳውን ፣ ማጣቀሻዎች ፣ መዝገቦች ወይም ግዴታዎች መጻፍ የለበትም ።

ግብይት ከማቅረብዎ በፊት ወኪሉ አጭር የግብይት ዕቅድ እንዲያዘጋጅ ያድርጉት:

- `network`: Taira የሙከራ ኔትወርክ ሥር እና ሰንሰለት ID
- `authority`: ፊርማ እና ክፍያ የሚከፍል ሂሳብ
- `instructions`: የምዝገባ፣ የማዕድን ማውጫ፣ ማቃጠል፣ ማስተላለፍ፣ ሜታዳታ፣ ፈቃድ ወይም የውል ጥሪ ማጠቃለያ።
- `fee asset`: በ Taira ላይ የሚከፈልበት ንብረት
- `preflight reads`: ቀድሞውኑ የተከናወኑ የሂሳብ፣ የንብረት ሚዛን፣ ፍቃዶች፣ ቅጽል ስሞች ወይም የብሎክ ምርመራዎች
- `expected result`: ከተረጋገጠ በኋላ ሊታይ የሚገባው ሁኔታ
- `idempotency`: ተመሳሳይ ጥያቄ እንደገና ከተጠየቀ ምን ይሆናል?

ከቀረበ በኋላ ወኪሉ የደረጃ ሁኔታን እስኪጠብቅ ያድርጉት ፣ ከዚያ የአቋም ለውጥን በማንበብ መጠይቅ ያረጋግጡ ። ጠቃሚ የማጠናቀቅ ሪፖርት የሚከተሉትን ያካትታል

- የግብይት ሃሽ
- እንደ `Committed`, `Applied`, `Rejected` ወይም `Expired` ያሉ የደረጃ ደረጃዎች
- የብሎክ ወይም የማሰስ ዝርዝሮች በሚገኙበት ጊዜ
- የማረጋገጫ ውጤቶች
- ውድቀት መልዕክት እና አለመሳካቱ እንደ ፍቃዶች ፣ ክፍያዎች ፣ ማረጋገጫ ፣ የቆየ ሁኔታ ወይም የጨረታ ነጥብ ተደራሽነት ይመስላል

ምሳሌ ተጠብቆ ወዲያውኑ:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

የተፈረመው ፖስታ ቀድሞውኑ ሲዘጋጅ:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP የህዝብ የሙከራ መረብ ቁጥጥር ገጽ ሆኖ ይይዛል። Taira ቁልፎች ፣ የሙከራ መረቡ XOR ፣ የቧንቧ ሂሳቦች እና የካናሪ ፊርማዎች የሚጣሉ ናቸው እናም ከ Minamoto ቁልፎች እና የምርት ፍሰት የሥራ ፍሰቶች ተለይተው መቆየት አለባቸው።

## አሁን ሊሞክሯቸው የሚችሏቸው የመጫወቻዎች ምሳሌዎች {#toy-examples-you-can-try-now}

እነዚህ ምሳሌዎች ካልተጠቀሱ በስተቀር ለማንበብ ብቻ ናቸው. ቁልፎችን ከማመንጨትዎ በፊት ይሰራሉ እና በሁለቱም የህዝብ አውታረመረቦች ላይ ለመሮጥ ደህንነታቸው የተጠበቀ ነው.

Taira የሙከራ መረብ እና Minamoto ዋና መረብ ጥንካሬን ያወዳድሩ:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

በ Taira የተጋለጡ የህዝብ የመረጃ ቦታ ጎዳናዎችን ይዘርዝሩ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

በዋና አውታረ መረብ እይታ በሚፈልጉበት ጊዜ Minamoto ላይ ተመሳሳይ ትእዛዝ ይሂዱ:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

አንድ ዳሽቦርድ, ቦት, ወይም ማሰማራት ለመፈተሽ ትንሽ Node.js ሁኔታ ምርመራ ይገንቡ:

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

የመጀመሪያው የመጻፍ ጎን መጫወቻ Taira የቧንቧ አመልካች መሆን አለበት ። እሱ የሙከራ ኔት XOR ን ይጠቀማል እና በጭራሽ ወደ Minamoto ማመልከት የለበትም ።

## 3. የ Taira ደንበኛ ቅንብር ይፍጠሩ {#_3-create-a-taira-client-config}

ቀድሞውኑ ከሌለዎት የቁልፍ ሰሌዳ ማመንጨት:

```bash
kagami keys --algorithm ed25519 --json
```

`taira.client.toml` ይፍጠሩ:

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

ከፍተኛው ደረጃ `chain` ትክክለኛ ነው Taira የግብይት ሰንሰለት ID. የ `[account].profile = "taira"` ቅንብር በራስ-ሰር ይምረጣል Taira I105 ሰንሰለት ልዩነት. ID የሂሳብ መገለጫውን አይመርጥም።

ለንባብ ብቻ የሚሆን ቼክ ያድርጉ:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

ከጽሑፍ ምርመራዎች በፊት የህዝብ Taira ምርመራዎችን ያካሂዱ:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ክፍያ የሚከፈልበትን ጽሁፍ ከማካሄድዎ በፊት Taira መለያውን በቧንቧው በኩል ያግኙ። ቀጥተኛ የቧንቧ ፍሰት በ [Get Testnet XOR ላይ ነው Taira](#_4-get-testnet-xor-on-taira) ።

የቧንቧ ማመልከቻ ከተቀበለ እና ሂሳቡ ከተደገፈ በኋላ Taira ካናሪ አማራጭ የመጻፍ ጭስ ሙከራ ነው-

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

ካናሪው የተፈረመ ፒንግ ያቀርባል ፣ ማረጋገጫን ይጠብቃል እና `--write-config` ሲቀርብ የስራ ሰዓት ፊርማ አውድ ይጽፋል ። Taira የህዝብ ፈተና ኔት ነው ፣ ስለዚህ ረድፍ መጨናነቅ የተፈረመውን ፒንግ በራሱ ፍሰት በሚሰራበት ጊዜም እንኳ ሊያበላሽ ይችላል ። `taira doctor` የተሞላ ረድፍ ሪፖርት የሚያደርግ ከሆነ ወይም ካናሪው `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` የሚመለስ ከሆነ ፣ እንደ ደንበኛ ውቅር ስህተት ከመያዝዎ በፊት ይጠብቁ እና እንደገና ይሞክሩ።

ያለ ክትትል የጭስ ሙከራዎች ካናሪውን በተወሰነ ዳግም ሙከራ ሉፕ ውስጥ ይሸፍኑ:

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

`iroha taira doctor` ከባድ ውድቀቶችን የሚያሳይ ከሆነ እንደገና መሞከርዎን ያቁሙ ። የ queue saturation እና fee-admission rejections ጊዜያዊ የህዝብ ሙከራ አውታረመረብ ሁኔታዎች ናቸው; DNS, TLS ወይም `status = "fail"` ምርመራዎች አይደሉም.

## የ SORA Nexus መለያ ID ይፍጠሩ {#generate-a-sora-nexus-account-id}

SORA Nexus መለያ ID ከሂሳብ የህዝብ ቁልፍ እና ከዒላማው አውታረመረብ ቅድመ-ጽሑፍ የተገኘ የካኖኒክ I105 አድራሻ ነው ፣ በደንበኛ TOML ውስጥ ያለው `[account].domain` ዋጋ አይደለም። ተመሳሳይ የህዝብ ቁልፍ በ Taira እና Minamoto ላይ ለተለያዩ IDs ኮዶች ይሰጣል ፣ እናም የምርት ተጠቃሚዎች ለ Minamoto የተለየ ቁልፍ ጥንድ መፍጠር አለባቸው ።

ሂሳቡን የሚቆጣጠር Ed25519 ቁልፍ ጥንድ ያመነጩ ወይም ይጫኑ:

```bash
kagami keys --algorithm ed25519 --json
```

የሕዝብ ቁልፍን ወደ Taira መለያ ID መለወጥ:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

የ Minamoto የህዝብ ቁልፍን በዋና አውታረ መረብ ቅድመ ማስያዣ ይለውጡ:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

የተገኘውን መለያ ይጠቀሙ ID የትም ቦታ Nexus API ወይም CLI ትዕዛዙ የቅዱሳን መጻሕፍትን ዘገባ ይጠይቃል ID, ለምሳሌ Taira ቧንቧ `account_id`, ሚዛን መጠይቆች ፣ ጥብቅ የሂሳብ መስኮች ወይም ቅጽል ስም ግዴታዎች። መመሳሰል ይቀጥሉ። የደንበኛዎ ውቅር ውስጥ የግል ቁልፍ, እና ጋር ተመሳሳይ የህዝብ አውታረ መረብ ይምረጡ `[account].profile = "taira"` ወይም `[account].profile = "minamoto"`.

የ ID ማመንጨት በራሱ በሰንሰለት ላይ የሚደገፍ መለያ አይፈጥርም ። በ Taira ላይ ቧንቧው ለሙከራ ኔትወርክ ጽሁፎች መለያውን መፍጠር እና ፋይናንስ ማድረግ ይችላል ። በ Minamoto ላይ የተረጋገጠ ዋና አውታረመረብ ውህደት ወይም የግምጃ ቤት ፍሰት ይጠቀሙ።

### ቁልፎችን ማከማቸትና ምትኬ ማድረግ {#key-storage-and-backup}

የሂሳብ ID እና የሕዝብ ቁልፍ ሊጋሩ ይችላሉ. የሚዛመዱ የግል ቁልፎች, የይለፍ ቃላት, ዘሮች, እና ማግኛ ቁሳቁስ እንደ ሚስጥር መያዝ አለበት.

እነዚህን ልምዶች ለ SORA Nexus ሂሳቦች ይጠቀሙ:

- የግል ቁልፎችን በተመሰጠረ የይለፍ ቃል አስተዳዳሪ ፣ በሃርድዌር የተደገፈ የቁልፍ ማከማቻ ወይም በልዩ ፊርማ አገልግሎት ውስጥ ያከማቹ። ቁልፎቹን የመረጃ ምንጭ ቁጥጥር ለማድረግ ወይም የምርት ቁልፍዎችን በሻል ታሪክ ፣ በመዝገብ, በውይይት ፣ በቲኬቶች ወይም ባልተመሰጠረ ምትኬዎች ውስጥ አይተው።
- ለእያንዳንዱ ዋልት ወይም ለምርቱ ፊርማ ልዩ የሆነ ከፍተኛ ኤንትሮፒ የይለፍ ቃል ይጠቀሙ። የይለፍ ቃላትን ከስክሪፕት የግል ቁልፍ ጋር በሚመሳሰል ፋይል ወይም የመጠባበቂያ ጥቅል ሳይሆን በፓስዎርድ አስተዳዳሪ ወይም በተከፋፈለ የጥበቃ ሂደት ውስጥ ያስቀምጡ።
- Taira እና Minamoto ቁልፎችን በተናጠል ያድርጉ። Taira ቁልፎቹን እንደ የአንድ ጊዜ ሙከራ መርጃ ቁሳቁስ እና Minamoto ቁልፍዎችን እንደ የምርት ገንዘብ ባለስልጣን ይያዙ ።
- የግል ቁልፍ, የህዝብ ቁልፍ, መለያ ID, መለያ መገለጫ, እና ማንኛውም መለያ ማግኛ ወይም ፊርማ ለማስመለስ የሚያስፈልጉትን የመጠባበቂያ ማስታወሻዎች ምትኬ. የአውታረ መረብ አውድ ያለ የግል ቁልፍ በማግኛ ወቅት አላግባብ መጠቀም ቀላል ነው.
- ለአምራች ፊርማዎች ቢያንስ አንድ የተመሰጠረ ከመስመር ውጭ የመጠባበቂያ ምትኬ እና አንድ ጂኦግራፊያዊ ለየት ያለ የተመሰጠረ የመጠባበቂያ ምትኬ ይያዙ። ከመጠባበቂያው ላይ በመመርኮዝ አነስተኛ ንባብ-ብቻ ክወና ጋር መልሶ ማግኘትን ይሞክሩ ።
- የግል ቁልፍ፣ የይለፍ ቃል፣ የመጠባበቂያ ሚዲያ ወይም ፊርማ አስተናጋጅ የተጋለጡ ሊሆኑ የሚችሉ ከሆነ ፊርማውን ይዞሩ ወይም መተካት ይችላሉ።

ለተጨማሪ ዝርዝሮች [የምስጠራ ቁልፎችን ማከማቸት ](/am/guide/security/storing-cryptographic-keys.md) እና [ የይለፍ ቃል ደህንነት](/am/guide/security/password-security.md) ይመልከቱ።

## 4. Testnet XOR በ Taira ላይ ያግኙ። {#_4-get-testnet-xor-on-taira}

የሕዝብ ቧንቧን በቀጥታ ይጠቀሙ.

1. ፊርማውን ማመንጨት ወይም መጫን እና የካኖኒካል Taira ሂሳብ ID ማስላት።
2. የአሁኑን የቧንቧ እንቆቅልሽ አምጣ.
3. `difficulty_bits` ከ `0` የሚበልጥ ከሆነ እንቆቅልሹን መፍታት።
4. የቧንቧ ማመልከቻውን ያቅርቡ።
5. ክፍያ የሚከፈልበትን ደብዳቤ ከመላክህ በፊት ሂሳቡ ወይም ንብረቱ ሚዛን የሚታየው እስኪሆን ጠብቅ።

የሕዝብ ቁልፍን ወደ Taira I105 መለያ ID ይለውጡ፤

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

እንቆቅልሹን አምጣ:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

ቧንቧው የህዝብ የሙከራ አውታረመረብ አገልግሎት ነው። እንቆቅልሽ ወይም የይገባኛል ጥያቄ መጨረሻ ነጥብ `502` ፣ የጊዜ ገደብ ወይም ሌላ የጌትዌይ ደረጃ ስህተት ከተመለሰ ቁልፎችንዎን ወይም የደንበኛ ውቅርዎን ከመቀየርዎ በፊት ይጠብቁ እና እንደገና ይሞክሩ።

መልሱ የሚከተለው መልክ አለው፦

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

መቼ ነው `difficulty_bits` ነው `0`, ሂሳቡን ብቻ ያቅርቡ ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits` ከ `0` የሚበልጥ ከሆነ እንቆቅልሽውን ይፍቱ እና የአንከር ቁመት እና nonce ን ያካትቱ:

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

የእንቆቅልሽ ስልተ ቀመር:

1. ፈተናውን እንደ SHA-256 ይገንቡ:
   - የ `iroha:accounts:faucet:pow:v2` ባይት
   - የ UTF-8 መለያ ID
   - `anchor_height` እንደ ትልቅ አህያ `u64`
   - `anchor_block_hash_hex` በባይቶች ተለይቷል
   - `challenge_salt_hex` በሚገኝበት ጊዜ እንደ ባይት የተገለጸው
2. `u64` nonces እንደ ትልቅ-ኢንዲያን 8-ባይት እሴቶች ኮድ ይሞክሩ.
3. ለእያንዳንዱ nonce, ስክሪፕት ጋር ይሂዱ:
   - የይለፍ ቃል: 8-ባይት nonce
   - ጨው: የ 32-ባይት ፈተና
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - የውጤት ርዝመት: 32 ባይት
4. አሸናፊው nonce ቢያንስ `difficulty_bits` ዜሮ ቢት ይመራል ጋር የመጀመሪያው digest ነው.

የውሃ ቧንቧ ምላሽ የገንዘብ ድጋፍ የተደረገበትን ንብረት እና ረድፍ የግብይት ሃሽ ያካትታል:

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

ምላሹ በአሁኑ ጊዜ በ HTTP `202 Accepted` ተመላሽ ነው ። የእሱ `asset_definition_id` የህዝብ ቧንቧ የገንዘብ ድጋፍ የሚያደርግ የአሁኑ Taira ክፍያ ንብረት ነው ፣ ከመልሱ በመውሰድ ምሳሌውን ከመቅዳት ይልቅ ID። ቧንፉ `tx_hash_hex` እና `status: "QUEUED"` ሲመለስ ጥያቄውን ተቀበለ ።

ከዚያ የራስዎን ክፍያ የሚከፍሉ ግብይቶች ከማቅረባቸው በፊት ለገንዘብ የተደገፈ ንብረቱ የሕዝብ አስተያየት መስጠት:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

የቧንቧ ጥያቄ ተቀባይነት ካገኘ ግን ሂሳቡ ወይም ንብረቱ ገና የማይታይ ከሆነ ግብይቱ አሁንም ከህዝባዊ የሙከራ ኔትወርክ ረድፍ ማቀነባበሪያ በስተጀርባ ይገኛል.

ለፈፃሚነት ዝግጁ የሆነ ቀጥተኛ API ቼክ ይህንን እንደ `taira_faucet_claim.py` ያስቀምጡ እና የ Taira I105 መለያ ID ያቅርቡ:

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

ቧንቧው ለ Taira የሙከራ ኔትሮች ብቻ ነው ። በ Minamoto ፍሰቶች ውስጥ የሙከራ ኔት XOR ፣ የቧንቧ ሂሳቦችን ወይም Taira ካናሪ ፊርማዎችን አይጠቀሙ ።

## 5. የ Minamoto ደንበኛ ቅንብር ይፍጠሩ {#_5-create-a-minamoto-client-config}

ለ Minamoto የተለየ የቁልፍ ሰሌዳ ይጠቀሙ. ለዋናው አውታረመረብ Taira ቁልፎችን ዳግም አይጠቀሙ.

`minamoto.client.toml` ይፍጠሩ:

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

ከፍተኛው ደረጃ `chain` የአሁኑ ነው Nexus ዋናው የኔት ሰንሰለት ID. `[account].profile = "minamoto"` ይምረጣል Minamoto I105 ሰንሰለት ልዩነት; የጨረታ ነጥብ አስተናጋጅ ስም እና ሰንሰለት ID በተዘዋዋሪነት አይምረጡት።

Minamoto የህዝብ ቁልፍን በ I105 ካኖኒካል ሂሳቡ ID ውስጥ በማይኔት ቅድመ አገናኝ ይለውጡ:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

ሂሳቡ በዋና አውታረ መረብ ላይ በመጫን ወይም በአስተዳደር ፍሰት አማካኝነት እስከሚሰጥበት ጊዜ ድረስ የንባብ-ጎን ቁጥጥር ብቻ ያካሂዱ:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

የ Taira ቧንቧ ወይም የጻፍ-ካናሪ ረዳት ከ Minamoto ጋር አይተላለፉ።

## የ Minamoto ሂሳብ በ XOR ላይ ይፋ ያድርጉ። {#_6-fund-a-minamoto-account-with-xor}

Minamoto ክፍያዎች ከምርቱ ጋር ይከፈላሉ XOR, እና Minamoto የተዋቀረውን ሂሳብ በፈቃደኝነት በተረጋገጠ ዋና አውታረመረብ ውስጥ በማስገባት ወይም በግምጃ ቤት ዝውውር በኩል ያካሂዱ ፣ ወይም ይቀበሉ XOR ከቀድሞው የገንዘብ ድጋፍ Minamoto ሂሳብ።

ID ካኖኒካዊ ሂሳቡን እና የገንዘብ አጠባበቅን በንባብ-ብቻ ቼኮች ከመቅረጹ በፊት ያረጋግጡ ። Minamoto XOR ን እንደ የምርት ገንዘብ ይያዙ: በመጀመሪያ ተመሳሳይ ክወና በ Taira ላይ ይለማመዱ ፣ የተለያዩ የምርት ቁልፎችን ይጠብቁ ፣ እና ዋናው የኔትወርክ ግብይት ዳግም ሊጀመር ይችላል ብለው አይገምቱም ።

Taira XOR የ Minamoto ክፍያዎችን መክፈል አይችልም። የሙከራ መረብ ቀሪዎች እና የቧንቧ ግዴታዎች ወደ Minamoto አይተላለፉም.

## 7. አሁን ባለው የውሂብ ክልል ውስጥ መሥራት {#_7-work-inside-an-existing-dataspace}

በአንድ የውሂብ ቦታ ውስጥ ለሚኖሩ መቁጠሪያ ዕቃዎች ሙሉ በሙሉ ብቃት ያላቸው የጎራ ስሞችን ይጠቀሙ። ለምሳሌ, በአደባባይ የመረጃ ቦታ ውስጥ አንድ ፕሮጀክት ጎራ የሚከተሉትን መጠቀም አለበት:

```text
apps.universal
```

መለያዎ የተጠየቁትን ፍቃዶች ካገኘ በኋላ ለጎራው ሚስጥራዊ ያልሆነ `AliasSetupPlanRequestV1` ዓላማ ይፍጠሩ እና የማስጠንቀቂያ ዕቅድ አውጪውን ይጠቀሙ:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

ለ Minamoto የተለየ ዋና አውታረመረብ ዓላማ እና ዕቅድ ይፍጠሩ እና ያፀድቁ። እቅዶች ከእነሱ ሰንሰለት ፣ ስልጣን ፣ የቀጥታ ሁኔታ አናከር እና ጊዜ ገደብ ጋር የተቆራኙ ናቸው ፣ ስለሆነም አንድ Taira ዕቅድ ሊስተዋወቅ ወይም እንደገና መጫወት አይችልም።

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

የሂሳብ ስያሜዎች ተመሳሳይ የመረጃ ቋት ቅደም ተከተል ይጠቀማሉ-

```text
alice@apps.universal
alice@universal
```

ጥብቅ የሂሳብ መስኮች አሁንም የካኖኒካል I105 ሂሳብ IDs ይጠቀማሉ ። ቅጽል ስሞችን በሰው ሊነበብ የሚችል እና ወደ ካኖኒካል መለያ IDs የሚፈታ ትስስር አድርገው ይመለከቱ።

## 8. አዲስ የመረጃ ቋት ማዘጋጀት {#_8-provision-a-new-dataspace}

አዲስ የውሂብ ክልል አንድ ኦፕሬተር እና የአስተዳደር ለውጥ ነው. የህዝብ Torii መጨረሻ ነጥብ ትራፊክን ወደ የተዋቀሩ የውሂብ ክፍሎች ሊያመራ ይችላል ፣ ግን ያልታወቁ የውሂብ ቦታ ቅጽል ስሞችን ይቃወማል።

ለውጥ ከማዘጋጀትዎ በፊት የአሁኑን የቀጥታ ካታሎግ ይያዙ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ለኦፕሬተር መለያ ደግሞ የመንገድ ማሳያ አቀማመጥ ያረጋግጡ:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

የመንገድ ID ፣ የውሂብ ቦታ ID ፣ የማረጋገጫ ስብስብ ፣ የስህተት መቻቻል ፣ ማሳያ ፣ የጉዞ ደንቦች እና የአሠራር ባለቤት በአንድ ላይ ካልተመለከቱ በስተቀር አዲስ ቅጽል ስም አያስተዋውቁ። የሚያስፈልጉ ፍቃዶችን የያዘ መደበኛ የተጠቃሚ መለያ በአንድ ነባር የውሂብ ቦታ ውስጥ ጎራ እና SNS ኪራይ ማግኘት ይችላል፤ አዲስ የህዝብ ውሂብ ቦታን በደህና ማከል አይችልም።

ለግል ወይም ለድርጅት የመረጃ ቦታ የሚከተሉትን ካታሎግ ለውጦች ያዘጋጁ:

- አንድ ልዩ የውሂብ ቦታ ስያሜ እና ቁጥር `id`
- የሚመሳሰል የመንገድ መግቢያ ወይም ነባር የመንገድ አሰጣጥ
- የውሂብ ቦታ `fault_tolerance`
- እዚያ ለመድረስ የሚያስፈልጉትን መመሪያዎችን ወይም የሂሳብ ስኮፖችን ለማስተላለፍ የሚረዱ መመሪያዎች
- የውሂብ ክፍሉ UAID ችሎታዎችን በሚያጋልጥበት ጊዜ የቦታ ማውጫ ማኒፌስት ወይም ተመጣጣኝ የማሰማራት ማስረጃ
- የአስተዳደር ማረጋገጫ፣ ተገዢነት፣ የፍጆታ ማስፈጸሚያና ክትትል ፖሊሲዎች

ሊተነተን የሚችል የማዋቀር ክፍል እንደዚህ ይመስላል:

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

የኦፕሬተር ተቀባይነት የሚከተሉትን በሮች ሊያካትት ይገባል-

- `irohad --sora --config <config.toml> --trace-config` የተፈታውን የአገናኝ ውቅር ያስተላልፋል
- የተፈጠረው ወይም የተጠናቀቀው ሰነድ በሃሽስ እና ፊርማዎች ይከበራል ።
- የጭስ ሙከራዎች ከማንኛውም Minamoto ማስተዋወቂያ በፊት በ Taira ውስጥ ማለፍ
- ከለውጥ በኋላ `/status` ካታሎግ የታቀደውን ጎዳና እና የመረጃ ቦታ ያሳያል ።
- `iroha app nexus lane-report --summary` የሚፈለገውን ማኒፌስት የጎደለው ሪፖርት አያደርግም

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ተመሳሳይ የመረጃ ቦታን ወደ Minamoto ማስተዋወቅ የሚቻለው Taira ማሰማራት ፣ የጭስ ሙከራዎች ፣ ክትትል እና የአስተዳደር ማስረጃዎች ከተጠናቀቁ በኋላ ብቻ ነው።

## ተዛማጅ ገጾች {#related-pages}

- [Iroha 3](/am/get-started/install-iroha.md) መጫን
- [በ Iroha 3 በኩል ይሠራል CLI](/am/get-started/operate-iroha-via-cli.md)
- [ለግል የውሂብ ቦታ ስፖንሰር ክፍያዎች](/am/get-started/private-dataspace-fee-sponsor.md)
- [Torii መጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [የዘፍጥረት ማጣቀሻ](/am/reference/genesis.md)
