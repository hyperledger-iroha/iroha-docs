---
translation_locale: am
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# አፈጻጸም እና መለኪያዎች {#performance-and-metrics}

Iroha አፈፃፀም በስራ ጭነት ፣ በማረጋገጫ ቶፖሎጂ ፣ በአውታረ መረብ ሁኔታዎች እና በስምምነት ቅንብሮች ላይ የተመሠረተ ነው። ስለዚህ አንድ ነጠላ TPS ቁጥር ጠቃሚ የሚሆነው ቋሚ ውቅር ካለው የማጣቀሻ ውጤት ጋር ሲገናኝ ብቻ ነው ።

ለአቅም እቅድ አፈፃፀምን እንደ የአሠራር ውስጣዊነት ይቆጥሩ:

- አውታረመረብ የተጠየቀውን የግብይት ተመን ይቀበላል
- በዒላማው በጀት ውስጥ የዘገየ ጊዜ ቆይታዎችን ያድርጉ
- የግብይት ረድፎች የተገደቡ ሆነው ይቆያሉ።
- ስምምነት በተደጋጋሚ እይታ ለውጦች ወይም መልሶ ማግኛ መንገዶችን ላይ አይተማመንም።

ይህ ገጽ የተሰጠውን የአገናኝ ብዛት ፣ የአውታረ መረብ መዘግየት ደመወዝ እና ዒላማ TPS ለስርጭቱ ከፍተኛ ፣ መካከለኛ ወይም ዝቅተኛ አፈፃፀም ሁኔታ ውስጥ መሆን አለመሆኑን ለመገመት ይጠቀሙ።

## ምን መለካት አለብን? {#what-to-measure}

ከ Torii የተጋለጡ የአሠራር ወለሎች ጋር ይጀምሩ:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

ተመሳሳይ የንባብ-ብቻ ንድፍ ከህዝብ Taira ጋር መሞከር ይችላሉ:

```bash
TAIRA=https://taira.sora.org

curl -fsS "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

የሲግናል ስሞችን ለመማር የህዝብ Taira መለኪያዎች ጠቃሚ ናቸው። ለእራስዎ ማሰማራት እንደ የምርት አቅም ቁጥሮች አይጠቀሙባቸው።

ተመሳሳይ የስምምነት ቅጽበታዊ ገጽ እይታዎች በ CLI በኩል ይገኛሉ:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

የቴሌሜትሪ ተደራሽነት በተዋቀረው መገለጫ ላይ የተመሠረተ ነው። `extended` ሲያስፈልግዎት `/metrics` ይጠቀሙ ፣ እና በሙከራ ሩጫዎች ውስጥ ዝርዝር Sumeragi ኦፕሬተር መንገዶችን በሚፈልጉበት ጊዜ `full` ይጠቀሙ።

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## የአፈፃፀም ባንዶች {#performance-bands}

እነዚህን ባንዶች በዒላማው ፍሰት `Y` TPS እና መዘግየት የበጀት `L` ሚሊሰከንዶች ላይ ለተመለከቱት ሩጫ ይጠቀሙ ። ሙቀትን ፣ የተረጋጋ ሁኔታን እና ቢያንስ አንድ ጊዜ የሚጠበቀው ከፍተኛ ጭነት ለማካተት የስራ ጫናውን ለረጅም ጊዜ ያካሂዱ።

|ባንድ |ሁኔታዎች |ትርጉም|
| --- | --- | --- |
|ከፍተኛ .|ተቀባይነት ያለው ፍሰት በ `Y` ወይም ከዚያ በላይ ነው ፣ p95 ተልእኮ መዘግየት ከ `0.8 * L` በታች ነው ፣ ረድፎቹ ከአቅም 10% በታች ሆነው ይቆያሉ ፣ እና የእይታ ለውጥ / መልሶ ማግኛ መቁጠሪያዎች ጠፍጣፋ ናቸው ።|ተልዕኮው ለተጠየቀው የስራ ጫና ቦታ አለው |
|መካከለኛ|ተቀባይነት ያለው ፍሰት ወደ `Y` ቅርብ ነው ፣ p95 ተልእኮ መዘግየት ከ `L` በታች ነው ፣ ረድፎቹ ከአቅም 50% በታች የተረጋጉ ናቸው ፣ እና የእይታ ለውጦች እምብዛም አይከሰቱም።|ትግበራው ይሰራል, ነገር ግን የተገደበ ፍንዳታ መቻቻል አለ.|
|ዝቅተኛ |ተቀባይነት ያለው ፍሰት ከ `Y` በታች ነው ፣ p95 ተልእኮ መዘግየት ከ `L` ይበልጣል ፣ ረድፎቹ በሚሮጡበት ጊዜ ይጨምራሉ ወይም የእይታ-ለውጥ / የኋላ ግፊት ቆጣሪዎች ያለማቋረጥ ይጨምራሉ።|የተጠየቀው የስራ ጫና ቢያንስ ከአንድ የመጠጥ አጥንት በላይ ነው |

ቁልፍው ደንብ ረድፍ አቅጣጫ ነው። የቀረበው TPS ከተቀበለው TPS በላይ ከሆነ እና ረድፉ እየጨመረ የሚሄድ ከሆነ አጭር ናሙናዎች ጤናማ ቢመስሉም እንኳ ልጥፉ ከመጠን በላይ ነው ።

## የቁጥር ብዛት እና ጥራዝ {#node-count-and-quorum}

ተጨማሪ ማረጋገጫዎች የችግር መቻቻል ያሻሽላሉ ነገር ግን የአውታረ መረብ ማስተባበሪያ, ፊርማ እና የውጭ ወጪን ይጨምራሉ. Sumeragi ትግበራ:

- የማረጋገጫ መቁጠሪያ `n` የጉድለት በጀት `f = floor((n - 1) / 3)` ያወጣል
- ለ `n >= 4` የኮሚቲ ክውሮም `2f + 1` ነው
- ለ `n <= 3` ሁሉም ማረጋገጫ ሰጪዎች ተሳትፎ ለማድረግ ያስፈልጋሉ
- የተመልካች እኩዮች የሲንክ ብሎኮችን ያመሳስላሉ ነገር ግን ድምጽ አይሰጡም ፣ አያቀርቡም ወይም አይሰበስቡም።

|ማረጋገጫዎች |የበጀት ስህተት |የቁጥር ማረጋገጫ |የአቅም ማስታወሻ |
| --- | --- | --- | --- |
|ከ1 እስከ 3 |0 ተግባራዊ ከመስመር ውጪ ነፃነት |ሁሉም ማረጋገጫ ሰጪዎች|ለልማት እና ለአነስተኛ ሙከራዎች ጠቃሚ ነው; ማንኛውም የጎደለው ማረጋገጫ ተልእኮዎችን ሊያቆይ ይችላል |
| 4 | 1 | 3 |ለአንድ ስህተት መቻቻል የጋራ ዝቅተኛ መጠን |
| 7 | 2 | 5 |የበለጠ ተጣጣፊነት፣ በበለጠ የድምፅ እና የማሰራጨት ትራፊክ |
| 10 | 3 | 7 |ከፍተኛ የኮርዲኔሽን ወጪ; የአውታረ መረብ እና ሰብሳቢዎች ማስተካከያ የበለጠ አስፈላጊ ነው |

"X ኖዶችን" በሚገመግሙበት ጊዜ የድምፅ ማረጋገጫዎችን ከተመልካቾች ይለዩ ። የተመልካቾችን መጨመር ብዙውን ጊዜ ከማረጋገጫዎች ጋር ሲነፃፀር ያነሰ ዋጋ ያስከፍላል ፣ ግን ተመልካቾች አሁንም ብሎክ ወሬን ፣ የብሎክ ማመሳሰል ፣ ዲስክን እና የአውታረ መረብ ባንድዊድትን ይጠቀማሉ።

## አፈጻጸም ላይ ተጽዕኖ የሚያሳድሩ ነገሮች {#factors-that-influence-performance}

### የስራ ጭነት ቅርጽ {#workload-shape}

ተመሳሳይ TPS እያንዳንዱ ግብይት ምን እንደሚያደርግ በመመርኮዝ ርካሽ ወይም ውድ ሊሆን ይችላል።

- በአንድ ግብይት የሚቀርቡት መመሪያዎች ብዛት
- ፊርማዎች ብዛት እና ፊርማ ስልተ ቀመሮች
- የግብይት ባይት መጠን እና የታመቀ የፍጆታ ጭነት መጠን
- የንባብ/የጽሑፍ ጥምርታ
- የሜታዳታ መጠን እና የአክሲዮን ስራዎች
- የማሰብ ችሎታ ያለው ውል፣ አስነሳሽነት እና IVM አፈፃፀም ወጪ
- ተመሳሳይ እኩዮች ላይ እየሮጠ ያለው የጥያቄ ጭነት

ትናንሽ የዝውውር ግብይቶች ለኮንትራት ከባድ ወይም ሜታዳታ-ከባድ የሥራ ጫናዎች ምትክ አይደሉም.

### የስምምነት ጊዜ {#consensus-timing}

Sumeragi ጊዜ የሚቆጣጠረው ውጤታማ በሆነው Sumeragi መለኪያዎች ነው:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- የ NPoS ሞድ ሲነቃ የ NPOS ምዕራፍ ጊዜ መውጫዎች

የሚከተሉትን ይፈትሹ፦

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

ዝቅተኛ የጊዜ ግቦች መዘግየትን ማሻሻል የሚችሉት የአውታረ መረብ ፣ የማከማቻ እና አፈፃፀም ንብርብሮች ወቅታዊ ሆነው በሚቆዩበት ጊዜ ብቻ ነው። ለውጦችን ካዩ በኋላ ፣ የጎደለው የክፍያ ጭነት ሲመጣ ወይም የመጠባበቂያ ጫና ከተከሰተ በኋላ የጊዜ ሰሌዳዎችን መቀነስ ብዙውን ጊዜ አፈፃፀምን ያባብሳል ።

### ሰብሳቢ ፋኖት {#collector-fanout}

የመሰብሰቢያው ቅንብሮች የቃለ መጠይቅ ድምጾች ምን ያህል በፍጥነት እንደሚቀላቀሉ ይነካሉ:

- `sumeragi.collectors.k` በአንድ ቁመት ላይ ስንት ሰብሳቢዎች ድምጾችን እንደሚሰበስቡ ይቆጣጠራል
- `sumeragi.collectors.redundant_send_r` ከአከባቢው የጊዜ ገደብ በኋላ ተጨማሪ ድምጽ መስጠት ይቆጣጠራል
- `sumeragi.collectors.parallel_topology_fanout` ከቅጂዎች ጋር ጎን ለጎን ቶፖሎጂን ይጨምራል

የ fanout መጨመር በትላልቅ ወይም በአነስተኛ አስተማማኝ አውታረ መረቦች ውስጥ የጀርባ መዘግየትን ሊቀንስ ይችላል ፣ ግን ትራፊክን ይጨምራል ። እነዚህን እሴቶች ከመቀየርዎ በፊት አጠቃላይ ተገኝነት እና የመሰብሰቢያ ቴሌሜትሪን ከዘግየት እና የኋላ ግፊት መለኪያዎች ጋር ያወዳድሩ:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### የአውታረ መረብ ሁኔታዎች {#network-conditions}

የጋራ ስምምነት አፈፃፀም የሚከተሉትን ነገሮች የሚመለከት ነው-

- RTT በመረጃ ማረጋገጫዎች መካከል
- ጭንቀት እና የፓኬት ኪሳራ
- የብሎክ ጥቅማጥቅሞች እና RBC ቁርጥራጮች የመተላለፊያ ይዘት
- በክልሎች መካከል ያሉ ያልተዛመዱ አገናኞች
- NAT, የእኩዮች ግንኙነትን የሚዘገይ የፋየርዎል ወይም ሪሌ ባህሪ።

እንደ እቅድ ደንብ ፣ በርካታ የማረጋገጫ ዙር ጉዞዎችን እና የአፈፃፀም እና የዲስክ ተሳትፎ ጊዜን ለመሸፈን የሚያስችል የላቲንሲ በጀት ከፍ ያድርጉ። p95 አውታረመረብ RTT ቀድሞውኑ ከሚፈለገው p95 ተሳትፎ መዘግየት ጋር ቅርብ ከሆነ ግቡ እውን አይደለም ።

### ረድፎችና የመግቢያ ገደቦች {#queues-and-admission-limits}

የመግቢያ እና ረድፍ ቅንብሮች አንድ ባልደረባ ምን ያህል የበረራ ግፊት ሊወስድ እንደሚችል ይገልጻሉ:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- የጄኔሲስ ግብይት ገደቦች እንደ ከፍተኛ ፊርማዎች ፣ መመሪያዎች ፣ ባይቶች እና የታመሙ ባይቶች ያሉ
- p2p ረድፍ ገደቦች እና የጋራ የመግቢያ ገደቦች

ከፍተኛ ረድፍ አቅም ለተወሰነ ጊዜ ከመጠን በላይ ጭነትን ሊደብቅ ይችላል ፣ ግን ዘላቂውን ፍሰት አይጨምርም ። የተረጋጋ ረድፍ ጤናማ ነው ፣ እየጨመረ የመጣው ረድፍ የኋላ ኋላ ነው።

### ሃርድዌር እና ማከማቻ {#hardware-and-storage}

መሪውን ብቻ ሳይሆን እያንዳንዱን ማረጋገጫ ይለኩ:

- CPU ማረጋገጫ፣ የፊርማ ማረጋገጫ እና አፈፃፀም ወቅት የተሞላበት
- ረድፎች፣ ቅጽበታዊ ገጽ እይታዎች እና ንቁ RBC ክፍለ ጊዜዎች የመታሰቢያ ግፊት
- ለብሎክ ማከማቻ እና ቅጽበታዊ ገጽ እይታዎች የዲስክ መፃፍ መዘግየት
- የአውታረ መረብ የመላኪያ/የተቀባ saturation
- በስራ ጭነት ሲጠቀሙ አማራጭ የሃርድዌር ማፋጠን ቅንጅቶች

በጣም ቀርፋፋው የድምፅ ማረጋገጫ አውታረመረብን ኋላ መዘግየት ሊወስን ይችላል።

## የፕሮሜቴየስ ምልክቶች {#prometheus-signals}

ሜትሪክ ስሞች በመገንባት መገለጫ እና ባህሪያት ስብስብ ላይ ሊለያዩ ይችላሉ. በመጀመሪያ `/metrics` ን በአገናኝዎ ላይ ይፈትሹ ፣ ከዚያ በሚገኙ ተከታታይ ዙሪያ ዳሽቦርዶችን ይገንቡ ።

የተለመዱ ምልክቶች የሚከተሉትን ያካትታሉ:

|ምልክቱ |የፕሮሜቴዎስ ምሳሌዎች |ምን መመልከት |
| --- | --- | --- |
|ተቀባይነት ያለው ፍሰት |`sum(rate(txs{type="accepted"}[5m]))` |በተረጋጋ ሁኔታ ውስጥ ግቡን TPS ማሟላት ወይም አልፎ መሄድ አለበት |
|ውድቅ ማድረግ |`sum(rate(txs{type="rejected"}[5m]))` |በምርመራው እቅድ ሊብራራ ይገባል።|
|መዘግየትን ያድርጉ |`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |p95/p99 ከዘግይቱ በጀት ጋር አወዳድር |
|ረድፍ ጥልቀት |`queue_size` ፣ `sumeragi_tx_queue_depth` |በከፍተኛ ጭነት ወቅት መቆየት አለበት ።|
|ረድፍ saturation |`sumeragi_tx_queue_saturated` |ከዜሮ በላይ ያልሆኑ ተከታታይ እሴቶች አማካይ ጭነት |
|ለውጦችን ይመልከቱ |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |እየጨመሩ ያሉት እሴቶች የጊዜ ሰሌዳ፣ ቶፖሎጂ፣ ጠቃሚ ጭነት ወይም የአውታረ መረብ ችግርን ይጠቁማሉ። |
|የወደቁ መልዕክቶች |`dropped_messages` ፣ `sumeragi_consensus_message_handling_total` |በጭነት ወቅት መውደቅ አብዛኛውን ጊዜ የዘገየበትን ጫፎች ያብራራል ።|
|RBC ግፊት |`sumeragi_rbc_store_pressure` ፣ `sumeragi_rbc_backpressure_deferrals_total` |ለጠቅላላ ጭነት ማግኛ ወይም ለማከማቻ ጠርሙስ መቆለፊያዎች ከዜሮ ውጭ ግፊት ነጥቦች |
|የቁጥር ማረጋገጫ |`sumeragi_commit_signatures_counted` ፣ `sumeragi_commit_signatures_required` |የተዘረዘሩ ፊርማዎች በተፈለገው መጠን በፍጥነት መድረስ አለባቸው ።|

አንድ መለኪያ `/v1/sumeragi/status` ውስጥ ብቻ በሚገኝበት ጊዜ, የ Prometheus scraping ጋር ተመሳሳይ አሂድ artefacts ውስጥ JSON ቅጽበታዊ ገጽ እይታ ይያዙ.

## ግምታዊ የስራ ፍሰት {#estimation-workflow}

1. ሁኔታውን ግለጽ።
   - የማረጋገጫ ሰጪዎች እና ታዛቢዎች ቁጥር
   - የስምምነት ሁነታ
   - ግቡ TPS
   - p95 እና p99 የኃላፊነት መዘግየት በጀቶች
   - የግብይት ድብልቅ
   - የሚጠበቀው አውታረመረብ RTT ፣ jitter እና ባንድዊድዝ
2. ውጤታማውን ውቅር ይመዝገቡ:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. የስራ ጭነት በዒላማው TPS ላይ ይሂዱ.
4. በሩጫው መጀመሪያ, አጋማሽ እና መጨረሻ ላይ ያለውን ሁኔታ እና መለኪያዎችን ይያዙ.
5. የአፈፃፀም ባንድ ሰንጠረዥን በመጠቀም ሩጫውን ያከፋፍሉ.
6. ባንድው መካከለኛ ወይም ዝቅተኛ ከሆነ በአንድ ጊዜ አንድን ነገር መለወጥ እና መድገም.

## የማጣቀሻ ሪፖርት አብነት {#benchmark-report-template}

የአፈፃፀም ቁጥሮችን ለማባዛት በቂ ዐውደ-ጽሑፍ ብቻ ያዘጋጁ:

- Iroha የተዋጣለት፣ የተለቀቀ እና ባህሪ ባንዲራዎች
- እውቅና ሰጪ እና ታዛቢዎች ቁጥር
- የስምምነት ሁነታ እና Sumeragi መለኪያዎች
- መሰብሰብ `k`, redundant መላክ `r`, እና የቶፖሎጂ fanout
- የቴሌሜትሪ መገለጫ
- የሃርድዌር ፣ የማከማቻ እና OS ዝርዝሮች
- የአውታረ መረብ RTT, jitter, ኪሳራ እና የመተላለፊያ ይዘት ግምቶች
- የግብይት ድብልቅ እና የፍጆታ ጭነት መጠን
- የቀረበው TPS እና የስራ ፍጥነት
- ተቀባይነት ያለው/የተከለከለ TPS
- p50/p95/p99 የኮሚት መዘግየት
- ረድፍ ጥልቀት እና መጨናነቅ
- የመመልከቻ ለውጦች፣ የተጣሉ መልዕክቶች፣ RBC ግፊት እና የጎደለው የፍጆታ ጭነት መለኪያዎች
- CPU, የማስታወሻ, ዲስክ እና የአውታረ መረብ አጠቃቀም በእያንዳንዱ ማረጋገጫ

እነዚህ ዝርዝሮች ከሌሉ የ TPS ቁጥር እንደ አስቂኝ ነገር ተደርጎ መወሰድ አለበት።

## ተዛማጅ ገጾች {#related-pages}

- [ከኢዛናሚ ጋር ካኦስ ሙከራ ](./chaos-testing.md)
- [Torii መጨረሻ ነጥቦች](../../reference/torii-endpoints.md)
- [በ Iroha 3 በኩል ይሠራል CLI](../../get-started/operate-iroha-via-cli.md)
- [የእኩዮች ውቅር ማጣቀሻ ](../../reference/peer-config/params.md)
