---
translation_locale: am
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# አፈጻጸም እና መለኪያዎች {#performance-and-metrics}

Iroha አፈፃፀም በስራ ጭነት፣ በማረጋገጫ አናት ላይ፣ በአውታረ መረብ ላይ የተመካ ነው
አንድ ነጠላ TPS ስለዚህ ቁጥር ጠቃሚ ብቻ ነው
ከተስተካከለ ውቅር ጋር በተያያዘ አንድ የማጣቀሻ ፍሰት ላይ ሲታሰር።

የአቅም እቅድ ለማዘጋጀት አፈፃፀምን እንደ የስራ አጠቃቀም ውስጣዊነት አድርገው ይመለከቱ

- አውታረመረብ የተጠየቀውን የግብይት ተመን ይቀበላል
- በዒላማው በጀት ውስጥ መዘግየት እንዲኖር ማድረግ
- የግብይት መስመሮች የተገደቡ ሆነው ይቆያሉ
- ስምምነት በተደጋጋሚ የዕይታ ለውጦች ወይም የመልሶ ማግኛ መንገዶች ላይ የተመሠረተ አይደለም

አንድ ልውውጥ ከፍተኛ, መካከለኛ ወይም ዝቅተኛ መሆኑን ለመገመት ይህን ገጽ ይጠቀሙ
ለተሰጠው ኖድ ብዛት የአፈፃፀም ሁኔታ ፣ የኔትወርክ መዘግየት ጠርዝ እና ግብ
TPS.

## ምን መለካት እንዳለበት {#what-to-measure}

በ የተጋለጡ የኦፕሬተር ወለሎች ይጀምሩ Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

ተመሳሳይ የንባብ-ብቻ ንድፍ ከሕዝብ ጋር መሞከር ይችላሉ Taira:

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

የሕዝብ Taira መለኪያዎች የምልክት ስሞችን ለመማር ጠቃሚ ናቸው.
የራስህን አገልግሎት ለመስጠት የሚያስችል የምርት አቅም ቁጥሮች።

ተመሳሳይ ስምምነት ቅጽበታዊ ገጽ እይታዎች በ CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

የቴሌሜትሪ ተደራሽነት ከተዋቀረው መገለጫ ላይ የተመሠረተ ነው። `extended` አንተ
አስፈላጊነት `/metrics`, እና አጠቃቀም `full` በሙከራ ሩጫዎች ወቅት ዝርዝር መረጃ የሚያስፈልግዎት
Sumeragi የኦፕሬተር መንገዶች።

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## የአፈፃፀም ባንዶች {#performance-bands}

እነዚህን ባንዶች በዒላማ ፍሰት ላይ ለተመለከቱት ሩጫ ይጠቀሙ `Y` TPS እና መዘግየት
በጀት `L` ሚሊ ሰከንዶች. ሙቀት ማሞቂያ ጨምሮ የስራ ጭነት በቂ ጊዜ ይሂዱ,
የተረጋጋ ሁኔታ እና ቢያንስ አንድ ጊዜ የሚጠበቀው ከፍተኛ ጭነት።

| ባንድ | ሁኔታዎች | ትርጉም |
| --- | --- | --- |
| ከፍተኛ | ተቀባይነት ያለው ፍሰት በ ወይም ከዚያ በላይ ነው `Y`, p95 የኮሚት መዘግየት ከዚህ በታች ነው `0.8 * L`, ረድፎቹ ከአቅም 10% በታች ሆነው የሚቆዩ ሲሆን የመመልከቻ ለውጥ / መልሶ ማግኛ መቁጠሪያዎች ጠፍተዋል | ተልዕኮው ለተጠየቀው የስራ ጭነት ቦታ አለው |
| መካከለኛ | ተቀባይነት ያለው ፍሰት ወደ `Y`, p95 የኮሚት መዘግየት ከዚህ በታች ነው `L`, ረድፎቹ ከ 50% በታች የተረጋጉ ናቸው ፣ እና የእይታ ለውጦች እምብዛም አይደሉም | ማሰማሪያው ይሠራል፣ ነገር ግን የተገደበ የመፈንዳታ መቻቻል አለ |
| ዝቅተኛ | ተቀባይነት ያለው ፍሰት ከዚህ በታች ነው `Y`, p95 commit latency ይበልጣል `L`, ረድፎቹ በሩጫው ወቅት እየጨመሩ ወይም የጨረር ለውጥ/የኋላ ግፊት መቁጠሪያዎች ያለማቋረጥ እየጨመሩ። | የተጠየቀው የስራ ጭነት ቢያንስ ከአንድ የመጠጥ አጥንት በላይ ነው |

ቁልፍ ደንብ ረድፍ አቅጣጫ ነው. TPS ከተቀበለው በላይ ነው TPS
እና ረድፍ እየጨመረ ይሄዳል, አጭር ናሙናዎች እንኳ ጭነት ነው
ጤናማ ሆነው ይታያሉ።

## የቁጥር ቁጥር እና ጥራዝ {#node-count-and-quorum}

ተጨማሪ ማረጋገጫዎች የችግር መቻቻል ያሻሽላሉ ነገር ግን ማስተባበሪያ, ፊርማ,
እና የኔትወርክ ወጪዎች. Sumeragi ተግባራዊ ማድረግ:

- የማረጋገጫ ሰጪዎች ቁጥር `n` የጉድለት በጀት ያመነጫል `f = floor((n - 1) / 3)`
- ለ `n >= 4`, የኮሚቲ ክውሮም `2f + 1`
- ለ `n <= 3`, ሁሉም ማረጋገጫ ሰጪዎች ተሳትፎ ለማድረግ ያስፈልጋሉ
- ታዛቢ እኩዮች የሲንክ ብሎኮችን ያመሳስላሉ ግን አይመርጡም ፣ አያቀርቡም ወይም አያሰባስቡም

| ማረጋገጫ መሳሪያዎች | የተሳሳተ በጀት | የድርጊት ማረጋገጫ | የአቅም ማስታወሻ |
| --- | --- | --- | --- |
| 1 እስከ 3 | 0 ተግባራዊ ከመስመር ውጪ | ሁሉም ማረጋገጫ ሰጪዎች | ለልማት እና ለአነስተኛ ሙከራዎች ጠቃሚ ነው; ማንኛውም የጎደለው ማረጋገጫ ተልእኮዎችን ሊያቆይ ይችላል |
| 4 | 1 | 3 | ለአንድ ስህተት የመቻቻል አጠቃላይ ዝቅተኛ |
| 7 | 2 | 5 | የበለጠ ተጣጣፊነት ያለው፣ በበለጠ የድምፅ እና የማሰራጨት ትራፊክ |
| 10 | 3 | 7 | ከፍተኛ የኮርዲኔሽን ወጪ; የአውታረ መረብ እና የመሰብሰቢያው ማስተካከያ የበለጠ አስፈላጊ ነው |

"X ኖዶችን" በሚገመግሙበት ጊዜ የድምፅ ማረጋገጫዎችን ከተመልካቾች ይለያሉ።
ታዛቢዎች አብዛኛውን ጊዜ ማረጋገጫዎችን ከመጨመር ያነሰ ወጪ ያስከፍላሉ ፣ ግን ታዛቢዎቹ አሁንም ይጠቀማሉ
ወሬዎችን ማገድ፣ ማስተባበርን ማገድ፣ ዲስክን እና የአውታረ መረብ ባንድዊድትን ማገድ።

## አፈጻጸም ላይ ተጽዕኖ የሚያሳድሩ ነገሮች {#factors-that-influence-performance}

### የስራ ጭነት ቅርፅ {#workload-shape}

ተመሳሳይ TPS እያንዳንዱ ግብይት ምን እንደሚያደርግ በመመርኮዝ ርካሽ ወይም ውድ ሊሆን ይችላል።
መዝገብ:

- በአንድ ግብይት ላይ የተሰጠውን መመሪያ ቁጥር
- ፊርማ መቁጠሪያ እና ፊርማ ስልተ ቀመሮች
- የግብይት ባይት መጠን እና የታመቀ የፍጆታ ጭነት መጠን
- የንባብ/የጽሑፍ ጥምርታ
- የሜታዳታ መጠን እና የአክሲዮን ስራዎች
- ብልጥ ውል፣ አስነሳሽነት እና IVM የማስፈጸሚያ ወጪ
- ተመሳሳይ እኩዮች ላይ እየሮጠ ያለው የጥያቄ ጭነት

ትናንሽ ዝውውሮች ለውል ከባድ ወይም ሜታዳታ-ከባድ ምትክ አይደሉም
የስራ ጭነቶች።

### የስምምነት ጊዜ {#consensus-timing}

Sumeragi የጊዜ ሰሌዳ ውጤታማ በሆነ Sumeragi መለኪያዎች:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- የ NPoS ሞድ ሲነቃ የ NPOS ምዕራፍ ጊዜያት

የሚከተሉትን ይፈትሹ፦

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

ዝቅተኛ የጊዜ ግቦች የአውታረ መረብ ፣ የማከማቻ እና
የአፈፃፀም ንብርብሮች መከታተል ይችላሉ. አንድ ጊዜ ለውጦችን ይመልከቱ, የጎደለው payload ያመጣል, ወይም
የጊዜ ሰሌዳዎችን መቀነስ ብዙውን ጊዜ አፈፃፀምን ያባብሳል።

### ሰብሳቢ ፋኖት {#collector-fanout}

የስብሰባ ሰጪዎች ቅንብሮች የተሳካላቸው ድምጾች ምን ያህል በፍጥነት እንደሚቀላቀሉ ተጽዕኖ ያሳድራሉ

- `sumeragi.collectors.k` በድምጽ አሰባሳቢዎች ብዛት ላይ ቁጥጥር ይደረጋል።
- `sumeragi.collectors.redundant_send_r` ተጨማሪ ድምጽ ከሰጠ በኋላ ቁጥጥር
  የአካባቢው የጊዜ ገደብ
- `sumeragi.collectors.parallel_topology_fanout` አክሎ ቶፖሎጂን ወደ ጎን ይጨምራል
  ሰብሳቢዎች

የፋኖውት መጠን መጨመር በትላልቅ ወይም በአነስተኛ አስተማማኝ አውታረመረቦች ውስጥ የጀርባ መዘግየትን ሊቀንስ ይችላል ፣
አጠቃላይ ተደራሽነት እና ሰብሳቢ
እነዚህ እሴቶች ከመቀየራቸው በፊት የዘገየ እና የኋላ ግፊት መለኪያዎች ያላቸው ቴሌሜትሪ:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### የአውታረ መረብ ሁኔታዎች {#network-conditions}

የስምምነት አፈፃፀም ለ:

- RTT በቫሊዲተሮች መካከል
- ዥረት እና የፓኬት ኪሳራ
- ለብሎክ ጥቅማጥቅሞች ባንድዊድዝ እና RBC ቁርጥራጮች
- በክልሎች መካከል ያሉ ያልተዛመዱ አገናኞች
- NAT, የባልደረባ ግንኙነትን የሚዘገይ የእሳት ግድግዳ ወይም ሪሌ ባህሪ

እንደ እቅድ ደንብ, በርካታ ሽፋን ለመሸፈን በቂ ከፍተኛ መዘግየት በጀት ያዘጋጁ
ፒ95 አውታረመረብ ከሆነ RTT ነው
ቀድሞውኑ የሚፈለገውን የ p95 ተልእኮ መዘግየት ቅርብ ነው, ዒላማው እውን አይደለም.

### ረድፎችና የመግቢያ ገደቦች {#queues-and-admission-limits}

የመግቢያ እና ረድፍ ቅንብሮች አንድ እኩይ ምን ያህል የብርጭቆ ግፊት ሊወስድ እንደሚችል ይገልጻሉ

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- የጄኔሲስ ግብይት ገደቦች ለምሳሌ ከፍተኛ ፊርማዎች ፣ መመሪያዎች ፣ ባይቶች እና
  የተጨመሩ ባይት
- p2p ረድፍ ገደቦች እና የስምምነት የመግቢያ ገደቦች

ከፍተኛ የጥድፊያ አቅም ለተወሰነ ጊዜ ከመጠን በላይ ጭነትን ሊደብቅ ይችላል ፣ ግን አይጨምርም
የተረጋጋ ረድፍ ጤናማ ነው፤ እየጨመረ የመጣው ረድፍ ደግሞ የኋላ ኋላ ነው።

### ሃርድዌር እና ማከማቻ {#hardware-and-storage}

መሪውን ብቻ ሳይሆን እያንዳንዱን ማረጋገጫ ይለካሉ

- CPU በማረጋገጫ ፣ በፊርማ ማረጋገጫ እና አፈፃፀም ወቅት መጨናነቅ
- ከቁጥሮች ፣ ቅጽበታዊ ገጽ እይታዎች እና ንቁ የመታሰቢያ ግፊት RBC ስብሰባዎች
- ለብሎክ ማከማቻ እና ቅጽበታዊ ገጽ እይታዎች የዲስክ መጻፊያ መዘግየት
- የአውታረ መረብ ማስተላለፍ/መቀበል saturation
- በስራ ጭነት ሲጠቀሙ አማራጭ የሃርድዌር ማፋጠን ቅንጅቶች

በጣም ቀርፋፋው የድምፅ ማረጋገጫ አውታረመረብን ኋላ መዘግየት ሊወስን ይችላል።

## የፕሮሜቴየስ ምልክቶች {#prometheus-signals}

የሜትሪክ ስሞች በመገንባት መገለጫ እና ባህሪያት ስብስብ ላይ ሊለያዩ ይችላሉ. `/metrics` ላይ
በመጀመሪያ አንጓህን፣ ከዚያም በተገኙት ተከታታይ ዙሪያ ዳሽቦርዶችን መገንባት።

የተለመዱ ምልክቶች የሚከተሉትን ያካትታሉ

| ምልክት | የፕሮሜቲየስ ምሳሌዎች | ምን መመልከት እንዳለብህ |
| --- | --- | --- |
| ተቀባይነት ያለው ፍሰት | `sum(rate(txs{type="accepted"}[5m]))` | ግቡን ማሟላት ወይም ማለፍ አለበት TPS በተረጋጋ ሁኔታ ውስጥ |
| ውድቅ | `sum(rate(txs{type="rejected"}[5m]))` | በሙከራው ዕቅድ ሊብራራ ይገባል |
| የጊዜ መዘግየት | `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` | p95/p99 ን ከዘግይቱ በጀት ጋር አወዳድር |
| ረድፍ ጥልቀት | `queue_size`, `sumeragi_tx_queue_depth` | በከፍተኛ ጭነት ወቅት መቆየት አለበት |
| ረድፍ መጨናነቅ | `sumeragi_tx_queue_saturated` | ከዜሮ ያልሆኑ ተከታታይ እሴቶች አማካይ ከመጠን በላይ ጭነት |
| ለውጦችን ይመልከቱ | `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` | እየጨመሩ ያሉት እሴቶች ጊዜን፣ ቶፖሎጂን፣ ጠቃሚ ጭነት ወይም የአውታረ መረብ ችግርን ይጠቁማሉ |
| የተጣሉ መልዕክቶች | `dropped_messages`, `sumeragi_consensus_message_handling_total` | በተጫኑበት ጊዜ የሚከሰቱ ቅናሾች አብዛኛውን ጊዜ የዘገየበትን ጫፍ ያብራራሉ |
| RBC ግፊት | `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` | ለጠቅላላ ጭነት ማግኛ ወይም ለማከማቸት የመጠጥ መቆለፊያዎች የዜሮ ያልሆኑ የግፊት ነጥቦች |
| የድርጊት ማረጋገጫ | `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` | የተዘረዘሩ ፊርማዎች በፍጥነት ወደሚፈለገው አኃዝ መድረስ አለባቸው |

አንድ ሜትሪክ ውስጥ ብቻ የሚገኝ ጊዜ `/v1/sumeragi/status`, ያግኙ JSON ፈጣን ምስል
ከፕሮሜቴየስ ክሬፕ ጋር ተመሳሳይ የሆኑ የእጅ ዕቃዎች።

## ግምታዊ የሥራ ፍሰት {#estimation-workflow}

1. ሁኔታውን ግለጽ።
   - የማረጋገጫ ሰጪዎችና ታዛቢዎች ቁጥር
   - የስምምነት ሁነታ
   - ግብ TPS
   - p95 እና p99 የተዋጣለት መዘግየት በጀት
   - የግብይት ድብልቅ
   - የሚጠበቀው አውታረመረብ RTT, jitter እና የመተላለፊያ ይዘት
2. ውጤታማውን ውቅር መዝገብ:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. የስራ ጭነት ወደ ዒላማው ይሂዱ TPS.
4. በሩጫው መጀመሪያ፣ አጋማሽ እና መጨረሻ ላይ ያለውን ሁኔታና መለኪያዎች ይያዙ።
5. ሩጫውን በአፈፃፀም ባንድ ጠረጴዛው ላይ ያድርጉ።
6. ባንድው መካከለኛ ወይም ዝቅተኛ ከሆነ በአንድ ጊዜ አንድን ነገር መለወጥ እና መድገም.

## የአስተያየት ሪፖርት አብነት {#benchmark-report-template}

የአፈፃፀም ቁጥሮችን ለማባዛት በቂ ዐውደ-ጽሑፍ ብቻ ያትሙ

- Iroha የኮሚት፣ የመልቀቂያ እና የባህርይ ባንዲራዎች
- የማረጋገጫ እና የተመልካች ቁጥሮች
- የስምምነት ሁነታ እና Sumeragi መለኪያዎች
- ሰብሳቢ `k`, የተፈናቀለ መላክ `r`, እና የቶፖሎጂ ፍኖተ
- የቴሌሜትሪ መገለጫ
- ሃርድዌር፣ ማከማቻ እና OS ዝርዝሮች
- አውታረመረብ RTT, jitter, ኪሳራ እና የመተላለፊያ ይዘት ግምቶች
- የግብይት ድብልቅ እና የፍጆታ ጭነት መጠኖች
- የቀረበ TPS እና የአሂድ ጊዜ
- ተቀባይነት ያለው/የተወገደ TPS
- p50/p95/p99 የኮሚት መዘግየት
- ረድፍ ጥልቀት እና መጨናነቅ
- ለውጦችን ይመልከቱ፣ መልዕክቶችን ይጥሉ፣ RBC ግፊት እና የጉልበት ጭነት መቁጠሪያዎች
- CPU, የማስታወሻ፣ ዲስክ እና የአውታረ መረብ አጠቃቀም በአንድ ማረጋገጫ ሰጪ

እነዚህ ዝርዝሮች ያለ, TPS ቁጥር እንደ አናክዶት መታየት አለበት።

## ተዛማጅ ገጾች {#related-pages}

- [ከኢዛናሚ ጋር የተደረገ የሁከት ሙከራ](./chaos-testing.md)
- [Torii የመጨረሻ ነጥቦች](../../reference/torii-endpoints.md)
- [ይሠራል Iroha 3 በኩል CLI](../../get-started/operate-iroha-via-cli.md)
- [የአቻ ውቅር ማጣቀሻ](../../reference/peer-config/params.md)
