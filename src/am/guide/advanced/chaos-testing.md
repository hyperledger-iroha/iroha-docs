---
translation_locale: am
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ከኢዛናሚ ጋር የሁከት ሙከራ {#chaos-testing-with-izanami}

Izanami በቅድመ-መንገድ Iroha የስራ ቦታ ውስጥ ካኦስኔት ኦርኬስተራተር ነው ። አንድ ነጠላ የአካባቢያዊ Iroha ክላስተር ይጀምራል ፣ ሊዋቀር የሚችል የሥራ ጭነት ያቀርባል ፣ እና የተመረጡ እኩዮችን ስህተቶችን ያስገባል ስለዚህ ኦፕሬተሮች አውታረ መረቡ በተቆጣጠረው ውድቀት ወቅት እድገት እያደረገ መሆኑን ማረጋገጥ ይችላሉ ።

ኢዛናሚን ለቅድመ ምርት የመቋቋም ችሎታ ፍተሻዎች ፣ ወደ ኋላ መመለስ እና የጋራ ስምምነት ማስተካከያ ይጠቀሙ። በማምረቻ አውታረመረብ ላይ አያሳዩት-መሣሪያው የሚጀምራቸውን እኩዮች እንዲይዝ የተቀየሰ ነው ፣ ይህም የእኩዮችን ዳግም ማስጀመር ፣ የማከማቻ wipes ፣ ጊዜያዊ የታመነ-እኩዮች ክፍልፍሎች እና አካባቢያዊ CPU ወይም የዲስክ ግፊት ጨምሮ ።

## ቅድመ ሁኔታዎች {#prerequisites}

Izanami ከ [Iroha ምንጭ ማከማቻ ](https://github.com/hyperledger-iroha/iroha) ይሂዱ ፣ ከዚህ የ ሰነድ ማከማቸት ሳይሆን:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

የቢነሪ አውታረመረብ እኩዮችን ለመፍጠር እና ለማስተዳደር በግልጽ መፈቀድ አለበት ። TUI ያልሆነ እያንዳንዱን ሩጫ `--allow-net` ማለፍ ፣ ወይም በ TUI ውስጥ `allow_net` ን ያግኙ።

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

በይነተገናኝ አሂድ ውቅር ለማግኘት:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami TUI እና CLI ቅንብሮች በተጠቃሚዎች ማዋቀር ማውጫ ውስጥ ይቀራሉ. የመጀመሪያው ልቀት ፋይል አንድ ግልፅ V1 አቀማመጥ ባይት አለው; ቅድመ-ልቀት ወይም በሌላ መንገድ ያልተገለጹ ቅንብሮች ውድቅ ይደረጋሉ እናም ከመሰደድ ይልቅ እንደገና መፈጠር አለባቸው. የአሁኑን መገለጫ እንደገና ከመጠቀምዎ በፊት የሚታዩትን ቅንብሮች ይመልከቱ።

## የመነሻ መስመር አሂድ {#baseline-run}

ከባድ ስህተቶችን ከመጨመርዎ በፊት አንድ ሊታደስ የሚችል የመነሻ መስመር ይጀምሩ-

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

ይህ ሩጫ የሚሳካው ክላስተሩ የተጠየቀውን የብሎክ ግብ ካገኘ፣ በጊዜ ገደቡ ውስጥ እድገት ሲያደርግ እና ከ አማራጭ p95 ብሎክ ልዩነት ጠርዝ በታች ከሆነ ብቻ ነው።

ትዕዛዙን ፣ ዘርፉን ፣ Iroha ግዴታውን ፣ የእኩዮቹን ብዛት ፣ የተሳሳተ-እኩዮችን ብዛት ፣ የስራ ጭነት መገለጫውን ፣ ዒላማውን TPS እና የዘገየበትን ደመወዝ በመመዝገብ ላይ ይያዙ። እነዚህ እሴቶች ከሌሉ ሌላ ኦፕሬተር ተመሳሳይ የስህተት ንድፍ እንደገና ማጫወት አይችልም ።

## የስራ ጫና መገለጫዎች {#workload-profiles}

ኢዛናሚ ሁለት የሥራ ጫና መገለጫዎች አሉት-

|መገለጫ |ይጠቀሙበት |ማስታወሻዎች|
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable` |ረዥም የመጠጥ ሩጫዎች እና እንደገና ሊታዩ የሚችሉ አፈፃፀም ምርመራዎች |በሥራ ላይ የማይውሉ የምግብ አዘገጃጀት መመሪያዎችን ይወዳል።|
|`chaos` |የክፍያ መንገድ ሽፋን | intentionally invalid recipes ያካትታል|

በመጀመሪያ የተረጋጋውን መገለጫ ይጠቀሙ:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

የመነሻው መስመር ቀድሞውኑ ከተረዳ በኋላ ወደ ሁከት መገለጫ ይሂዱ:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

በግልጽ ካልተፈቀደ በስተቀር የውል ማሰማሪያ የምግብ አዘገጃጀት መመሪያዎች በተረጋጋ ሩጫዎች ውስጥ ያሰናክላሉ:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

ሩጫው ከቅድመ ፍሰት የስራ ቦታ የተካተቱትን SORA Nexus ነባሪ መስፈርቶች ሲጠቀም `--nexus` ይጠቀሙ።

## ስህተት መቆጣጠሪያዎች {#fault-controls}

`--faulty` ከዜሮ ሲበልጥ ቢያንስ አንድ የስህተት ሁኔታ መቻል አለበት ። የስህተት ነባሪ ወደ ተቀባይነት ይለውጣል ፣ እና የቦሊያን ባንዲራዎች በ `=false` ሊሰናከሉ ይችላሉ።

|ስህተት |CLI ባንዲራ|ምን ያደርጋል?|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|ማጥፋት እና ዳግም ማስጀመር |`--fault-enable-crash-restart` |የእኩዮች ሂደት ኪሳራ እና ማገገም |
|ማከማቻውን ማጽዳት እና ዳግም ማስጀመር |`--fault-enable-wipe-storage` |ከጠፋው የአከባቢ ሁኔታ ማገገም |
|ልክ ያልሆነ የግብይት አይፈለጌ መልእክት |`--fault-enable-spam-invalid-transactions` |ተቀባይነት እና ውድቀት መንገዶች |
|የኔትወርክ መዘግየት |`--fault-enable-network-latency` |ዘገምተኛ ወሬ እና የዘገየ የስምምነት መልእክት |
|የአውታረ መረብ ክፍልፍል |`--fault-enable-network-partition` |ጊዜያዊ የእምነት አጋር ገለልተኛነት |
|CPU ውጥረት |`--fault-enable-cpu-stress` |አካባቢያዊ የማረጋገጫ እና የጊዜ ሰሌዳ ግፊት |
|የዲስክ መጨናነቅ |`--fault-enable-disk-saturation` |አካባቢያዊ የማከማቻ ግፊት |

የአውታረ መረብ ክፍልፍል ብቻ የሚሰራበት:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

`--fault-window-start` እና `--fault-window-end` በመጠቀም ከመተጣጠሉ በፊት እና በኋላ ቁጥጥር የሚደረግበት ቋሚ ሁኔታን ለመጠበቅ ይጠቀሙ። ይህ የመነሻ ጫጫታ ከስህተት ውጤት መለያየት ቀላል ያደርገዋል።

## የቅጽበታዊ ገጽ እይታዎች {#scenario-shapes}

የ Upstream Izanami ካታሎግ ወደ CLI መገለጫዎች የተለመዱ blockchain ግንኙነት ውድቀት ቅርጾች ካርታዎች. አንተ ተመሳሳይ ባንዲራዎች ጋር ሞዴል እነሱን ይችላሉ:

|ሁኔታው |የተለመደ ቅርጽ |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|የታለመ ጭነት |`--faulty 0`, ከፍተኛ `--tps`, አንድ አቀራረብ, ከፍተኛ `--max-inflight` |
|ጊዜያዊ አለመሳካት |ማሽቆልቆል / ዳግም ማስጀመር የሚቻለው በተወሰነ የክፍያ መስኮት ውስጥ ብቻ ነው።|
|ማቆም እና ማገገም |በአደጋ / ዳግም ማስጀመር ውስጥ ትልቅ የተሳሳተ-አቻ ህዝብ ይጠቀሙ |
|የአመራር መለያየት |ብቻ የኔትወርክ ክፍልፍል ስህተት ጋር በትክክል አንድ የተሳሳተ ባልደረባ መጠቀም; Izanami ይከተላል Sumeragi መሪ ቴሌሜትሪ |

በአንድ ጊዜ አንድ ተለዋዋጭን ቋሚ ያድርጉ። በተመሳሳይ ሩጫ ውስጥ የእኩዮችን ብዛት ፣ የስራ ጭነት መገለጫ ፣ የስህተት መስኮት እና TPS ን ከቀየሩ ውጤቱን ለመተርጎም አስቸጋሪ ነው።

## ምን መመልከት ይኖርብናል? {#what-to-watch}

በሩጫው ወቅት ለስራ አፈፃፀም ማረጋገጫ ጥቅም ላይ የዋሉትን ተመሳሳይ ምልክቶች ይከታተሉ።

- በእያንዳንዱ ሩጫ እኩዮች ላይ የብሎክ ቁመት እድገት
- የቀረቡት፣ ተቀባይነት ያገኙት፣ ውድቅ የተደረጉት እና ጊዜው ያለፈባቸው ግብይቶች
- ረድፍ ጥልቀት፣ ረድፍ መጨናነቅ እና የመጨረሻው ነጥብ የኋላ ግፊት
- የመመልከቻ ለውጦች፣ መልሶ ማግኛ መንገዶች፣ የጎደሉ ብሎኮች እና የጎደሉ የኳሮም የምስክር ወረቀቶች
- የተፈረመ RS16 ተደራሽነት የኋላ ታሪክ፣ የሚጠበቁ ስብሰባዎች እና የዘገየ የጋራ ስምምነት ትራፊክ
- CPU, ማህደረ ትውስታ, ዲስክ, እና የአውታረ መረብ እኩዮችን እየሮጠ አስተናጋጅ ላይ saturation

ለማረጋገጫ-ዘግይቶነት ትንተና, ዋና ሉፕ debugging መዝገቦችን ያስችሉ:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

እያንዳንዱ ብሎክ `block validation timings` ከ `stateless_ms` ፣ `execution_ms` እና `total_ms` ጋር ማሰራጨት አለበት ። እነዚህን ጊዜያት ከመቀየራቸው በፊት p95 የብሎክ ክፍተቶችን ፣ የእይታ-ለውጥ ቆጣሪዎችን እና ረድፍ ግፊትን ያነፃፅሩ ።

## ውጤቶችን መተርጎም {#interpreting-results}

የተመረጡ እኩዮች ሁሉ ብሎኮችን መፈፀማቸውን ሲቀጥሉ ሩጫውን ጤናማ አድርገው ይመለከቱት ፣ የኋላ ዥረት ያለ ገደብ አይጨምርም ፣ እና የተዋቀረው መስኮት ከተጠናቀቀ በኋላ ስህተቶች አዲስ የማገገም እንቅስቃሴን ማድረጉን ያቁሙ ።

አንድ ሩጫ እንደ ውድቀት ይቆጥሩ:

- ከ `--progress-timeout` በላይ የሆኑ የብሎክ እድገት ማቆሚያዎች
- የእኩዮች ቁመቶች ይለያያሉ እና እንደገና አይገናኙም
- p95 መዘግየት ከ `--latency-p95-threshold` ይበልጣል
- የተበላሸ መስኮት ከተዘጋ በኋላ ረድፎቹ ለቀሪው ሩጫ ይጨምራሉ።
- ውድቅ የተደረጉ ወይም ጊዜው ያለፈባቸው ግብይቶች በተመረጠው የስራ ጫና ምክንያት አይብራሩም።
- የእኩዮች ዳግም ማስጀመር፣ የማከማቻ ማጽዳት ወይም ክፍልፍል መልሶ ማግኛ በእጅ ማጽዳት ይጠይቃል

ከስህተት በኋላ ተመሳሳይ ዘርን እና አንድ የተበላሸ ዓይነት እንደገና ይጀምሩ ። ይህ የስራ ጭነት እና ጊዜውን እንደገና ሊተገበር የሚችል ሆኖ ሳለ የስህተት ወለሉን እየቀነሰ ነው።

## ተዛማጅ ገጾች {#related-pages}

- [አፈፃፀም እና መለኪያዎች ](./metrics.md)
- [ሩጫ Iroha በባዶ ብረት ላይ](./running-iroha-on-bare-metal.md)
- [Torii መጨረሻ ነጥቦች](../../reference/torii-endpoints.md)
