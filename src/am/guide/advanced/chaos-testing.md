---
translation_locale: am
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ከኢዛናሚ ጋር የተደረገ የሁከት ሙከራ {#chaos-testing-with-izanami}

ኢዛናሚ በከፍተኛ ፍሰት ውስጥ የሃውስኔት ኦርኬስትራ ነው Iroha የሥራ ቦታ.
የሚጣሉ አካባቢያዊ ይጀምራል Iroha ክላስተር፣ ሊዋቀር የሚችል የስራ ጭነት ያቀርባል፤
እና የተመረጡ እኩዮች ላይ ስህተቶችን ይጫናል ስለዚህ ኦፕሬተሮች የ
አውታረመረብ ቁጥጥር በሚደረግበት ጊዜ እድገት እያደረገ ነው።

ለቅድመ ምርት የመቋቋም ችሎታ ምርመራዎች ፣ ለሪግሬሽን ማባዛት ፣
እና የጋራ ስምምነት ማመቻቸት. ወደ ምርት አውታረ መረብ አያሳዩት
የጀማመር ዳግም ማስጀመር ፣ ማከማቻን ጨምሮ የሚጀምሩትን እኩዮችን ለመያዝ የተነደፈ
ማጣሪያ, ሰው ሰራሽ ፓኬጅ መጥፋት, እና አካባቢያዊ CPU ወይም የዲስክ ግፊት.

## ቅድመ ሁኔታዎች {#prerequisites}

Izanami ከ አሂድ
[Iroha የመረጃ ቋት](https://github.com/hyperledger-iroha/iroha),
ከዚህ ሰነድ ማከማቻ ውስጥ አይደለም:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

የቢነሪ አውታረ መረብ መፍጠር እና ማቀናበር በግልጽ ሊፈቀድለት ይገባል
የዕድሜ እኩዮች. `--allow-net` ለእያንዳንዱ...TUI ማሄድ ወይም ማስቻል `allow_net` ውስጥ
የ TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

ለአስተያየታዊ ሩጫ ውቅር:

```bash
cargo run -p izanami -- --tui --allow-net
```

ኢዛናሚ ቀጥሏል TUI እና CLI በተጠቃሚው ማዋቀር ማውጫ ስር ያሉ ቅንብሮች፣ ስለዚህ
የቀደመውን መገለጫ እንደገና ከመጠቀምዎ በፊት የሚታዩትን ቅንብሮች ይገምቱ።

## የመነሻ መስመር አሂድ {#baseline-run}

ከባድ ጉድለቶችን ከመጨመርዎ በፊት አንድ ሊታደስ የሚችል የመነሻ መስመር ይጀምሩ:

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

ይህ ሩጫ የሚሳካው ክላስተር የተጠየቀውን የብሎክ ግብ ካገኘ ብቻ ነው።
በጊዜ ገደቡ ውስጥ እድገት እያደረገ የሚቀጥል ሲሆን ከ አማራጭ p95 በታች ይቆያል።
የብሎክ ክፍተት ገደብ.

ትዕዛዙን ጻፍ፤ ዘር ሆይ! Iroha የተሳሳተ፣ የባልደረባዎች ብዛት፣ የተሳሳተ የባልደረቦች ብዛት፣
የስራ ጫና መገለጫ፣ ግብ TPS, ከዘገባዎች ጋር የመዘግየት ገደብ.
እነዚህ እሴቶች, ሌላ ኦፕሬተር ተመሳሳይ ስህተት ንድፍ መጫወት አይችልም.

## የሥራ ጫና መገለጫዎች {#workload-profiles}

ኢዛናሚ ሁለት የስራ ጫና መገለጫዎች አሉት

| መገለጫ  | ለመጠቀም                                         | ማስታወሻዎች                                  |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` | ረዥም የበረዶ ማጥመቂያዎች እና ተደጋጋሚ የአፈፃፀም ምርመራዎች | ለፈፀም አስተማማኝ የሆኑ የምግብ አዘገጃጀት መመሪያዎችን ይደግፋል          |
| `chaos`  | የክፍያ መንገድ ሽፋን                              | ሆን ተብሎ የማይታወቁ የምግብ አዘገጃጀት መመሪያዎችን ያካትታል |

በመጀመሪያ የተረጋጋውን መገለጫ ይጠቀሙ:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

የመነሻ መስመር ቀድሞውኑ ከተረዳ በኋላ ወደ ሁከት መገለጫ ይሂዱ

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

በግልጽ ካልተገለጸ በስተቀር የውል ማሰማራት የምግብ አዘገጃጀት መመሪያዎች በተረጋጋ ሩጫዎች ውስጥ ያሰናክላሉ
የተፈቀደለት:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

አጠቃቀም `--nexus` ሩጫው የተካተተውን መጠቀም ሲኖርበት SORA Nexus ከ
የስራ ቦታው በከፍተኛ ፍሰት ላይ ነው።

## ስህተት መቆጣጠሪያዎች {#fault-controls}

መቼ `--faulty` ከዜሮ በላይ ነው ፣ ቢያንስ አንድ የስህተት ሁኔታ መሆን አለበት
የተነቃቃ. ስህተት ነባሪ ወደ ገቢር ይለወጣል, እና ቡሊያን ባንዲራዎች ሊሆኑ ይችላሉ
የተጎዱ `=false`.

| ስህተት                    | CLI ባንዲራ                                   | ምን ይሠራል                          |
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
| ማሽከርከር እና ዳግም ማስጀመር        | `--fault-enable-crash-restart`             | የአቻ ሂደት ማጣት እና ማገገም             |
| ማከማቻውን ያጥፉ እና እንደገና ይጀምሩ | `--fault-enable-wipe-storage`              | ከጠፋው የአካባቢ ሁኔታ ማገገም          |
| ልክ ያልሆነ የግብይት አይፈለጌ መልዕክት | `--fault-enable-spam-invalid-transactions` | የመቀበልና የማስወገድ መንገዶች              |
| የአውታረ መረብ መዘግየት          | `--fault-enable-network-latency`           | ዘገምተኛ ወሬና የዘገየ የስምምነት መልእክት |
| የአውታረ መረብ ክፍልፍል        | `--fault-enable-network-partition`         | ጊዜያዊ የእምነት አጋር ማግለል           |
| P2P የፓኬት ኪሳራ          | `--fault-enable-network-packet-loss`       | የመተግበሪያ ክፈፍ ትራፊክ መቀነስ          |
| CPU ውጥረት               | `--fault-enable-cpu-stress`                | የአካባቢ ማረጋገጫ እና የጊዜ ሰሌዳ ግፊት   |
| የዲስክ መጨመር          | `--fault-enable-disk-saturation`           | አካባቢያዊ የማከማቻ ግፊት                     |

ለፓኬቶች ማጣት ብቻ:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 20 \
  --faulty 5 \
  --duration 800s \
  --fault-window-start 133s \
  --fault-window-end 266s \
  --tps 200 \
  --submitters 20 \
  --max-inflight 512 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=false \
  --fault-enable-network-packet-loss=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --fault-network-packet-loss-percent 75 \
  --seed 42
```

አጠቃቀም `--fault-window-start` እና `--fault-window-end` ቁጥጥር እንዲደረግበት
ከመከተቡ በፊት እና በኋላ የተረጋጋ ሁኔታ ያለው ጊዜ።
የመነሻ ጫጫታ ከጉድለቱ ውጤት ለመለየት ቀላል ነው።

## የቅጽበታዊ ገጽ እይታ ቅርጾች {#scenario-shapes}

የ Upstream Izanami ካታሎግ ካርታዎች የተለመዱ blockchain ግንኙነት-ከስህተት
ቅርጾች CLI መገለጫዎች. ተመሳሳይ ባንዲራዎች ጋር እነሱን ሞዴል ይችላሉ:

| ሁኔታው              | የተለመደ ቅርጽ                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| የታለመ ጭነት         | `--faulty 0`, ከፍተኛ `--tps`, አንድ ሰጪ፣ ከፍተኛ `--max-inflight`                                                         |
| ጊዜያዊ አለመሳካት     | የአደጋ / ዳግም ማስጀመር የሚቻለው በተገደበ የክፍያ መስኮት ውስጥ ብቻ ነው                                                                  |
| የፓኬት ኪሳራ           | የፓኬት ኪሳራ ብቻ ያስችለዋል, አብዛኛውን ጊዜ በነባሪው 75% ኪሳራ መጠን                                                          |
| ማቆም እና መልሶ ማግኘት | ትልቅ የተበላሸ የዕድሜ ልክ ነዋሪዎች ብዛት በመጠቀም ማሽከርከር / ዳግም ማስጀመር                                                                    |
| የአመራር መለያየት      | ብቻ አውታረ መረብ ክፍልፍል ወይም ፓኬጅ-ማጣት ስህተቶች ጋር በትክክል አንድ የተሳሳተ እኩዮች ይጠቀሙ; Izanami የሚከተለው ነው Sumeragi መሪ ቴሌሜትሪ |

በአንድ ጊዜ አንድ ተለዋዋጭ የተስተካከለ ጠብቅ.
መገለጫ, የክፍያ መስኮት, እና TPS በተመሳሳይ ጊዜ ውጤቱ አስቸጋሪ ነው
አስተርጓሚ።

## ምን መመልከት ይኖርብናል? {#what-to-watch}

በሩጫው ወቅት ለስራ አፈፃፀም ማረጋገጫ ጥቅም ላይ የዋሉትን ተመሳሳይ ምልክቶች ይከታተሉ:

- በእያንዳንዱ ሩጫ እኩዮች ላይ የብሎክ ቁመት እድገት
- የቀረቡት፣ ተቀባይነት ያገኙት፣ ውድቅ ያደረጉትና ጊዜው ያለፈባቸው ግብይቶች
- ረድፍ ጥልቀት፣ ረድፍ መጨናነቅ እና የመጨረሻ ነጥብ የኋላ ግፊት
- የአመለካከት ለውጦች ፣ የመልሶ ማግኛ መንገዶች ፣ የጎደሉ ብሎኮች እና የጎደለው ክውሮም
  የምስክር ወረቀት
- RBC የኋላ ዥረት፣ የተጠበቁ ስብሰባዎች እና የመግባቢያ ትራፊክ መቀነስ ወይም መዘግየት
- CPU, የአቻዎቹን እየሮጠ ባለው አስተናጋጅ ላይ የማስታወሻ ፣ ዲስክ እና አውታረመረብ መጨናነቅ

ለትክክለኛነት-ዘግይተኝነት ትንተና, ዋና ሉፕ ዲቦግ መዝገቦችን ያግኙ:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

እያንዳንዱ ብሎክ ማመንጨት አለበት `block validation timings` ጋር `stateless_ms`,
`execution_ms`, እና `total_ms`. እነዚያን ጊዜያት ከ p95 ብሎክ ጋር አወዳድር
ልዩነቶች፣ የመመልከቻ መለዋወጫዎች እና ከመቀየራቸው በፊት የዝግጅት ግፊት
የስምምነት ጊዜ ሰሌዳዎች።

## ውጤቶች {#interpreting-results}

የተመረጡ እኩዮች ሁሉ ማገድ ሲቀጥሉ ሩጫውን እንደ ጤናማ አድርገው ይመለከቱት ፣
የኋላ መቆለፊያ ያለ ገደብ አይጨምርም ፣ እና ስህተቶች አዲስ ማገገም ያቆማሉ
የተዋቀረው መስኮት ከተጠናቀቀ በኋላ እንቅስቃሴ።

አንድ ሩጫ እንደ ውድቀት ይቆጥቡ:

- የጊዜ ሰሌዳዎች `--progress-timeout`
- የእኩዮች ቁመት ይለያያል እና እንደገና አይቀላቀልም
- p95 መዘግየት ይበልጣል `--latency-p95-threshold`
- የክፍያ መስኮት ከተዘጋ በኋላ ረድፎቹ ለቀሪው ሩጫ ይጨምራሉ
- ውድቅ የተደረጉ ወይም ጊዜው ያለፈባቸው ግብይቶች በተመረጡት
  የሥራ ጫና
- የእኩዮች ዳግም ማስጀመር፣ የማከማቻ ማጽዳት ወይም የፓኬት ኪሳራ መልሶ ማግኘት በእጅ ይፈለጋል
  ማጽዳት

ከስህተት በኋላ, ተመሳሳይ ዘር እና አንድ ያነሰ ስህተት አይነት ጋር ዳግም ይሂዱ.
የስራ ጭነት እና ጊዜያትን እንደገና ሊተገበር የሚችል ሆኖ ሳለ ብልሹነትን ይቀንሳል
ወለል.

## ተዛማጅ ገጾች {#related-pages}

- [አፈጻጸም እና መለኪያዎች](./metrics.md)
- [እየሮጠ Iroha በባዶ ብረት ላይ](./running-iroha-on-bare-metal.md)
- [Torii የመጨረሻ ነጥቦች](../../reference/torii-endpoints.md)
