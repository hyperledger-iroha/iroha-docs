---
translation_locale: am
translation_source: /guide/advanced/metrics.md
translation_source_hash: ad2bc9f8c53169d8161f7a2f23b1e660ebd24cf03cf8e05f4b00bbd27b7b11fe
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# አፈጻጸም እና መለኪያዎች {#performance-and-metrics}

Iroha አፈጻጸም በስራ ጫና፣ በአረጋጋጭ ቶፖሎጂ፣ በአውታረ መረብ ሁኔታዎች እና በስምምነት ቅንጅቶች ላይ የተመሰረተ ነው።. ስለዚህ አንድ ነጠላ TPS ቁጥር ጠቃሚ የሚሆነው ከቋሚ ውቅር ጋር ካለው የቤንችማርክ ሩጫ ጋር ሲገናኝ ብቻ ነው።.

ለአቅም እቅድ፣ አፈጻጸምን እንደ ኦፕሬቲንግ ዳታ መያዣ ይያዙት -

- አውታረ መረቡ የተጠየቀውን የግብይት መጠን ይቀበላል
- የፕሮቶኮል ማጠናቀቂያ መዘግየት በዒላማው በጀት ውስጥ ይቆያል
- የግብይት ወረፋዎች ውስን ሆነው ይቆያሉ
- መግባባት በተደጋጋሚ የእይታ ለውጦች ወይም የመልሶ ማግኛ መንገዶች ላይ አይተማመንም

ለተወሰነ የኖድ ብዛት፣ የአውታረ መረብ መዘግየት ገደብ እና ዒላማ TPS ማሰማራት በከፍተኛ፣ መካከለኛ ወይም ዝቅተኛ የአፈጻጸም ሁኔታ ውስጥ መሆኑን ለመገመት ይህን ገጽ ይጠቀሙ።

## ምን እንደሚለካ {#what-to-measure}

በይፋዊ ኖድ ነጥብ-በ-ጊዜ የውሂብ እይታ እና ፕሮሜቲየስ መቧጨር ይጀምሩ፣ ከዚያ CLI ለኦፕሬተር የተረጋገጠ የጋራ ስምምነት ሁኔታ ይጠቀሙ። የኦፕሬተር ቁልፉ በታለመው ኖድ መፍቀድ አለበት እና የሚጫነው በሶፍትዌር ማስፈጸሚያ አካባቢ ላይ ብቻ ነው -

```bash
export TORII=http://127.0.0.1:8080
export OPERATOR_KEY_FILE="$PWD/localnet/runtime/operator-signer.key"

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi lanes
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

ይፋዊ Taira ማንነታቸው ያልታወቁ የኖድ የነጥብ-በ-ጊዜ ውሂብ እይታዎችን ቅርፅ ለመማር ጠቃሚ ነው። የእሱ ኦፕሬተር ምርመራዎች ሆን ተብሎ ያለ Taira ኦፕሬተር ቁልፍ አይገኙም -

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now, offset_ms}'
```

ለራስዎ ማሰማራት የህዝብ-ቴስትኔት ምልከታዎችን እንደ የማምረት አቅም ቁጥሮች አይጠቀሙ።

የቴሌሜትሪ ታይነት በተዋቀረው መገለጫ ላይ የተመሰረተ ነው. `operator` የሁኔታውን እና የምርመራ የነጥብ-በ-ጊዜ ውሂብ እይታዎችን ያስችላል። `extended` `/metrics` እና ውድ ጊዜዎችን ይጨምራል፣ `developer` `/metrics` ሳያነቃ እንደ መሪ፣ QC፣ መለኪያዎች እና ማስረጃዎች ያሉ የገንቢ ነጥብ-በጊዜ ውሂብ እይታዎችን ሲጨምር። አንድ ሩጫ ሁለቱንም ስብስቦች ሲፈልግ `full` ይጠቀሙ። `telemetry_profile` ብቸኛው የመጀመሪያ ልቀት የቴሌሜትሪ መቀየሪያ ነው።

```toml
telemetry_profile = "full"
```

## የአፈጻጸም ባንዶች {#performance-bands}

እነዚህን ባንዶች በዒላማው የመተላለፊያ ይዘት `Y` TPS እና የመዘግየት በጀት `L` ሚሊሰከንዶች ለታየ ሩጫ ይጠቀሙ። ማሞቂያን፣ የተረጋጋ ሁኔታን እና ቢያንስ አንድ የሚጠበቀውን ከፍተኛ ጭነት ለማካተት የስራ ጫናውን በበቂ ሁኔታ ያሂዱ።

|ባንድ|ሁኔታዎች|ትርጉም|
| --- | --- | --- |
|ከፍ ያለ|ተቀባይነት ያለው የመተላለፊያ መጠን በ `Y` ወይም ከዚያ በላይ ነው፣ p95 ፕሮቶኮል ማጠናቀቂያ መዘግየት ከ`0.8 * L` በታች ነው፣ ወረፋዎች ከ10% አቅም በታች ይቆያሉ፣ እና የእይታ ለውጥ/መልሶ ማግኛ ቆጣሪዎች ጠፍጣፋ ናቸው|ማሰማራቱ ለተጠየቀው የስራ ጫና አቅም አለው|
|መካከለኛ|ተቀባይነት ያለው የመተላለፊያ መጠን ወደ `Y` ቅርብ ነው፣ የp95 ፕሮቶኮል ማጠናቀቂያ መዘግየት ከ`L` በታች ነው፣ ወረፋዎች ከ50% አቅም በታች የተረጋጉ ናቸው፣ እና የእይታ ለውጦች እምብዛም አይደሉም|ማሰማራቱ ይሰራል፣ ነገር ግን የፍንዳታ መቻቻል ውስን ነው|
|ዝቅተኛ|ተቀባይነት ያለው የመተላለፊያ መጠን ከ `Y` በታች ነው፣ p95 ፕሮቶኮል ማጠናቀቂያ መዘግየት ከ`L` ይበልጣል፣ ወረፋዎች በሩጫው ወቅት ያድጋሉ፣ ወይም የእይታ ለውጥ/የኋላ ግፊት ቆጣሪዎች ያለማቋረጥ ይነሳሉ|የተጠየቀው የስራ ጫና ቢያንስ ከአንድ ማነቆ ይበልጣል|

ዋናው ደንብ የወረፋ አቅጣጫ ነው. ከገባ TPS ከተጠናቀቀው TPS ይበልጣል እና ወረፋው እያደገ ከሄደ፣ አጫጭር ናሙናዎች ጤናማ ቢመስሉም ማሰማራቱ ከመጠን በላይ ተጭኗል።

## የኖድ ቆጠራ እና ሸንጎ {#node-count-and-quorum}

ተጨማሪ አረጋጋጮች የስህተት መቻቻልን ያሻሽላሉ ነገር ግን ቅንጅትን፣ ፊርማ እና የአውታረ መረብ ደጋፊ ወጪዎችን ይጨምራሉ። የመጀመሪያው ልቀት Sumeragi ፕሮቶኮል የሚከተሉትን ይፈልጋል -

- ትክክለኛ `n = 3f + 1` ድምጽ መስጫ ኮሚቴ
- `4 <= n <= 31`፣ ስለዚህ ትክክለኛ መጠኖች 4፣ 7፣ 10 እና የመሳሰሉት ናቸው
- የጋራ መግባባት ማጠናቀቂያ ምልአተ ጉባኤ `2f + 1`
- የታዛቢ አውታረ መረብ እኩዮች ብሎኮችን ያመሳስላሉ ነገር ግን ድምጽ አይሰጡም፣ አያቀርቡም ወይም አይሰበስቡም

|አረጋጋጮች|የተሳሳተ በጀት|የጋራ መግባባት ማጠናቀቂያ ምልአተ ጉባኤ|የአቅም ማስታወሻ|
| --- | --- | --- | --- |
| 4 | 1 | 3 |ለአንድ ስህተት መቻቻል የጋራ ዝቅተኛው|
| 7 | 2 | 5 |የበለጠ ጠንካራ ፣ በበለጠ የድምጽ እና የስርጭት ትራፊክ|
| 10 | 3 | 7 |ከፍተኛ የማስተባበር ወጪ; አውታረ መረብ እና የመግቢያ ማስተካከያ ጉዳይ የበለጠ|
| 31 | 10 | 21 |ከፍተኛው የመጀመሪያ ልቀት ኮሚቴ; የቤንችማርክ ማስተባበር እና የፊርማ ዋጋ በጥንቃቄ|

የብሎክቼይን ጀነሲስ ማመንጨት እና ጅምር ማረጋገጫ የማይስማሙ የኮሚቴ መጠኖችን ውድቅ ያደርጋሉ; ልቀቱ ሊቀበለው የማይችለውን ቶፖሎጂ አያመካክቱ።

'X nodes' ሲገመግሙ የድምጽ መስጫ አረጋጋጮችን ከተመልካቾች ይለዩ። ታዛቢዎችን ማከል ብዙውን ጊዜ አረጋጋጮችን ከመጨመር ያነሰ ዋጋ ያስከፍላል፣ ነገር ግን ታዛቢዎች አሁንም ብሎክ ወሬ፣ ማመሳሰል፣ ዲስክ እና የአውታረ መረብ ባንድዊድዝ ይጠቀማሉ።

## በአፈፃፀም ላይ ተጽዕኖ የሚያሳድሩ ምክንያቶች {#factors-that-influence-performance}

### የስራ ጫና ቅርጽ {#workload-shape}

እያንዳንዱ ግብይት በሚያደርገው ላይ በመመስረት ተመሳሳይ TPS ርካሽ ወይም ውድ ሊሆን ይችላል። መዝገብ

- በአንድ ግብይት የመመሪያዎች ብዛት
- የፊርማ ቆጠራ እና ስልተ ቀመሮችን መፈረም
- የግብይት ባይት መጠን እና ያልተጨመቀ የጭነት መጠን
- ጥምርታ አንብብ/ፃፍ
- ሜታዳታ መጠን እና የንብረት ስራዎች
- ስማርት ኮንትራት፣ ቀስቅሴ እና IVM የማስፈጸሚያ ወጪ
- በተመሳሳዩ የአውታረ መረብ እኩዮች ላይ የሚሰራ የጥያቄ ጭነት

አነስተኛ የዝውውር ግብይቶች ለኮንትራት-ከባድ ወይም ሜታዳታ-ከባድ የስራ ጫናዎች ተኪ አይደሉም።

### የጋራ መግባባት ካዴንስ {#consensus-cadence}

ውጤታማው Sumeragi መለኪያ ነጥብ-በ-ጊዜ ውሂብ እይታ የተፈረመውን የማይለወጥ የብሎክ ምት እና የሰዓት-ተንሸራታች የታሰረ ይዟል -

- `block_cadence_ms`
- `max_clock_drift_ms`

በሚከተሉት ይፈትሹዋቸው -

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` በተፈረመው የብሎክቼይን ጀነሲስ ተዘጋጅቶ በሚነሳበት ጊዜ ተቆልፏል; በቅጽበት ሊስተካከል አይችልም. አውታረ መረቦችን ከተለያዩ የተፈረሙ የብሎክቼይን ጀነሲስ ግብዓቶች ጋር እንደ የተለየ የቤንችማርክ ሁኔታዎች ብቻ ያወዳድሩ። አንዴ እይታ ከተቀየረ፣ የጎደለው ጭነት ወይም የኋላ ግፊት ከታየ፣ አጭር ጊዜ ያለው ፍጥነት ዘላቂ ፍጆታን ከመጨመር ይልቅ ከመጠን በላይ መጫኑን የበለጠ እንዲታይ ያደርገዋል።

### እጩ እና የመግቢያ ድንበሮች {#candidate-and-ingress-bounds}

የብሎክ መጠንና የግብይት ገደቦች ከተፈረመ genesis እና commit ከተደረጉ የሰንሰለት መለኪያዎች ይመጣሉ። አካባቢያዊ የኖድ `[sumeragi]` ቅንብሮች የተሳትፎ ሚና፣ የፊርማ ቁሳቁስ ጥበቃ፣ የደህንነት መዝገብ መንገዶች እና በሰነድ የተገለጹ አካባቢያዊ የጊዜ ገደብና ማመሳሰል ለውጦችን ይይዛሉ።

የአውታረ መረብ መግቢያና የግብይት ወረፋ ገደቦች በኖዱ የሚቀመጥ ሥራን ይቆጣጠራሉ። የሥራ ገደብ ከመቀየርዎ በፊት የምርመራ ቅጽበታዊ ቅጂውን ከፕሮሰስ ማህደረ ትውስታ፣ ከመልዕክት አያያዝ እና ከጎደለ የብሎክ አካል መለኪያዎች ጋር ያወዳድሩ። የተመሳሳይ አውታረ መረብ ሙከራዎችን ሲያወዳድሩ የተፈረሙ የሰንሰለት መለኪያዎችን አይቀይሩ:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### የአውታረ መረብ ሁኔታዎች {#network-conditions}

የጋራ መግባባት አፈጻጸም ለሚከተሉት ስሜታዊ ነው -

- RTT በአረጋጋጮች መካከል
- የጅረት እና የፓኬት መጥፋት
- የመተላለፊያ ይዘት ለጭነቶች እና የተፈረሙ RS16 ቁርጥራጮች
- በክልሎች መካከል ያልተመጣጠነ አገናኞች
- NAT፣ የአውታረ መረብ አቻ ግንኙነትን የሚያዘገይ ፋየርዎል ወይም የማስተላለፊያ ባህሪ

እንደ እቅድ ደንብ፣ ብዙ አረጋጋጭ የክብ ጉዞዎችን እና የማስፈጸሚያ እና የዲስክ ጽናት ጊዜን ለመሸፈን የመዘግየት በጀቱን ከፍ ያድርጉት። p95 አውታረ መረብ RTT ቀድሞውኑ ወደሚፈለገው የp95 ፕሮቶኮል ማጠናቀቂያ መዘግየት ቅርብ ከሆነ፣ ዒላማው እውን አይደለም።

### ወረፋዎች እና የመግቢያ ገደቦች {#queues-and-admission-limits}

የመግቢያ እና የወረፋ ቅንጅቶች የአውታረ መረብ አቻ ምን ያህል የፍንዳታ ግፊት ሊወስድ እንደሚችል ይገልጻሉ -

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- እንደ ከፍተኛ ፊርማዎች፣ መመሪያዎች፣ ባይቶች እና የተጨመቁ ባይቶች ያሉ የብሎክቼይን ጀነሲስ የግብይት ገደቦች
- P2P ወረፋ ካፕ እና የጋራ መግባባት የመግቢያ ገደቦች

ከፍተኛ ወረፋ አቅም ለተወሰነ ጊዜ ከመጠን በላይ መጫንን ሊደብቅ ይችላል, ነገር ግን ዘላቂ የፍጆታ መጠን አይጨምርም. የተረጋጋ ወረፋ ጤናማ ነው; እያደገ ያለው ወረፋ የኋላ መዝገብ ነው።

### ሃርድዌር እና ማከማቻ {#hardware-and-storage}

መሪውን ብቻ ሳይሆን እያንዳንዱን አረጋጋጭ ይለኩ -

- CPU በማረጋገጫ፣ በፊርማ ማረጋገጫ እና በአፈፃፀም ወቅት ሙሌት
- የማህደረ ትውስታ ግፊት ከወረፋዎች፣ ነጥብ-በ-ጊዜ የውሂብ እይታዎች እና ጭነት-መልሶ ማግኛ ቋቶች
- ለብሎክ ማከማቻ እና ነጥብ-በ-ጊዜ የውሂብ እይታዎች የዲስክ መፃፍ መዘግየት
- የአውታረ መረብ ማስተላለፊያ/ሙሌት
- በስራ ጫናው ሲጠቀሙ አማራጭ የሃርድዌር ማጣደፍ ቅንጅቶች

በጣም ቀርፋፋው የድምጽ መስጫ አረጋጋጭ የአውታረ መረቡን ጅራት መዘግየት ሊወስን ይችላል።

## የፕሮሜቲየስ ምልክቶች {#prometheus-signals}

ሜትሪክ ስሞች ከተመዝግበው የቴሌሜትሪ ካታሎግ የመጡ ናቸው። ተከታታይ ተገኝነት እና ናሙና አሁንም በግንባታ ባህሪያት እና `telemetry_profile` ላይ የተመሰረተ ነው፣ ስለዚህ ዳሽቦርድ ከመገንባትዎ በፊት በዒላማው ኖድ ላይ `/metrics` ይፈትሹ።

የተለመዱ ምልክቶች የሚከተሉትን ያካትታሉ

|ምልክት|የፕሮሜቲየስ ምሳሌዎች|ምን መታየት እንዳለበት|
| --- | --- | --- |
|ተቀባይነት ያለው የመተላለፊያ ይዘት|`sum(rate(txs{type="accepted"}[5m]))`|በተረጋጋ ሁኔታ ዒላማውን TPS ማሟላት ወይም ማለፍ አለበት|
|አለመቀበል|`sum(rate(txs{type="rejected"}[5m]))`|በፈተና እቅድ ሊገለጽ የሚችል መሆን አለበት|
|የፕሮቶኮል ማጠናቀቂያ መዘግየት|`histogram_quantile(0.95, sum by (le) (rate(sumeragi_commit_latency_ms_bucket{lane="global"}[5m])))`፣ `last_commit_time_ms`|p95/p99 ን ከመዘግየት በጀት ጋር ያወዳድሩ|
|የወረፋ ጥልቀት|`queue_size`፣ `sumeragi_tx_queue_depth`|በከፍተኛ ጭነት ጊዜ ታስቦ መቆየት አለበት|
|ወረፋ ሙሌት|`sumeragi_tx_queue_saturated`|ዘላቂ ዜሮ ያልሆኑ እሴቶች ማለት ከመጠን በላይ መጫን ማለት ነው|
|ለውጦችን ይመልከቱ|`view_changes`፣ `sumeragi_view_changes_total`፣ `sumeragi_timeout_votes_total`|እየጨመረ የሚሄደው እሴቶች ጊዜን፣ ቶፖሎጂን፣ ጭነት ወይም የአውታረ መረብ ችግርን ያመለክታሉ|
|የተጣሉ መልዕክቶች|`sumeragi_dropped_total`፣ `p2p_queue_dropped_total`|በጭነት ጊዜ ጠብታዎች ብዙውን ጊዜ የመዘግየት ነጠብጣቦችን ያብራራሉ|
|የጭነት እና የመከታተያ ማምጣቶች|`sumeragi_fetch_requests_total{kind="body"}`፣ `sumeragi_fetch_requests_total{kind="sync"}`|የማያቋርጡ የአካል ወይም የማመሳሰል ማምጣቶች በጭነት ማግኛ ወይም በመከታተያ ማመሳሰል ላይ ችግርን ያመለክታሉ|
|የማጠናቀቂያ ሂደት|`sumeragi_committed_height`፣ `sumeragi_applied_height`|የተረጋገጡ እና የተተገበሩ ከፍታዎች አብረው መራመድ አለባቸው|

መለኪያ በ`/v1/sumeragi/status` ውስጥ ብቻ ሲኖር፣ የ JSON ነጥብ-በ-ጊዜ የውሂብ እይታን እንደ ፕሮሜቲየስ መቧጨር በተመሳሳይ የሩጫ አርቲፋክቶች ይያዙ።

## የግምት የስራ ፍሰት {#estimation-workflow}

1. ሁኔታውን ይግለጹ
   - የማረጋገጫ ቆጠራ እና የታዛቢዎች ብዛት
   - የጋራ መግባባት ሁነታ
   - ዒላማ TPS
   - P95 እና P99 ፕሮቶኮል ማጠናቀቂያ-መዘግየት በጀቶች
   - የግብይት ድብልቅ
   - የሚጠበቀው አውታረ መረብ RTT፣ ጅረት እና የመተላለፊያ ይዘት
2. ውጤታማውን ውቅር ይመዝግቡ -

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. የሥራውን ጫና በዒላማው ላይ ያሂዱ TPS.
4. በሩጫው መጀመሪያ፣ መሃል እና መጨረሻ ላይ ሁኔታን እና መለኪያዎችን ይያዙ።
5. ሩጫውን ከአፈጻጸም-ባንድ ሠንጠረዥ ጋር ይመድቡት።
6. ባንዱ መካከለኛ ወይም ዝቅተኛ ከሆነ አንድ ምክንያት በአንድ ጊዜ ይቀይሩ እና ይድገሙት።

## የቤንችማርክ ሪፖርት አብነት {#benchmark-report-template}

የአፈጻጸም ቁጥሮችን እንደገና ለማግኘት የሚያስችል በቂ አውድ ሲኖር ብቻ ያትሙ፦

- Iroha ፕሮቶኮል ማጠናቀቅ፣ መልቀቅ እና የባህሪ ባንዲራዎች
- አረጋጋጭ እና ታዛቢ ይቆጥራል
- የጋራ ስምምነት ሁነታ፣ የተፈረመ የብሎክ ምት እና DA አቀማመጥ
- ትክክለኛ `3f + 1` ኮሚቴ፣ ምልአተ ጉባኤ እና የታዛቢዎች ዝርዝር
- የተፈረሙ የሰንሰለት መለኪያዎች፣ አካባቢያዊ የSumeragi ለውጦች፣ የአውታረ መረብ መግቢያ እና የግብይት ወረፋ ገደቦች
- የቴሌሜትሪ መገለጫ
- ሃርድዌር፣ ማከማቻ እና OS ዝርዝሮች
- አውታረ መረብ RTT፣ መንቀጥቀጥ፣ ኪሳራ እና የመተላለፊያ ይዘት ግምቶች
- የግብይት ድብልቅ እና የጭነት መጠኖች
- የቀረበ TPS እና የቆይታ ጊዜ አሂድ
- ተቀባይነት አግኝቷል/ውድቅ ተደርጓል TPS
- P50 / P95 / P99 ፕሮቶኮል ማጠናቀቂያ መዘግየት
- የወረፋ ጥልቀት እና ሙሌት
- የእይታ ለውጦች፣ የጊዜ ማብቂያ ድምጾች፣ የSumeragi ጠብታዎች እና የአካል እና የማመሳሰል ማምጣቶች
- CPU፣ ማህደረ ትውስታ፣ ዲስክ እና የአውታረ መረብ አጠቃቀም በአንድ አረጋጋጭ

እነዚህ ዝርዝሮች ከሌሉ TPS ቁጥር እንደ ተጨባጭ መታየት አለበት።

## ተዛማጅ ገጾች {#related-pages}

- [ከኢዛናሚ ጋር ትርምስ ሙከራ](./chaos-testing.md)
- [Torii የመጨረሻ ነጥቦች](../../reference/torii-endpoints.md)
- [Iroha 3 በ CLI በኩል ያሂዱ](../../get-started/operate-iroha-via-cli.md)
- [የአውታረ መረብ አቻ ውቅር ማጣቀሻ](../../reference/peer-config/params.md)
