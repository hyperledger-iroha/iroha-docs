---
translation_locale: am
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የመዋሃድ ችግሮች {#troubleshooting-integration-issues}

ይህ ክፍል ለችግር መፍታት ጠቃሚ ምክሮችን ይሰጣል Iroha 3 ውህደት
የምታጋጥመው ነገር እዚህ አልተገለጸም፣
እኛን በ [ቴሌግራም](https://t.me/hyperledgeriroha).

## ደንበኛው መገናኘት አይችልም {#client-cannot-connect}

የደንበኛው ውቅር የእኩዮቹን ነጥቦች ያመለክታል መሆኑን ያረጋግጡ Torii አድራሻ

```toml
torii_url = "http://127.0.0.1:8080/"
```

ለ CLI ቁጥጥር፣ ተመሳሳይ ፋይል በግልጽ ያስተላልፉ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

እኩያውም ቢገባ Docker ወይም Kubernetes, አስተናጋጅ ወይም አገልግሎት አድራሻ ይጠቀሙ
ከደንበኛው ሂደት ተደራሽ ነው። `127.0.0.1` በአንድ መያዣ ውስጥ አይደለም
አስተናጋጅ ማሽን.

ለሕዝብ Taira ሙከራዎች የሚጀምሩት ያልተፈረመ የፍጻሜ ነጥብ ምርመራ በማድረግ ነው።

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

እነዚህ ትዕዛዞች ከማይሳካ `502`, TLS, DNS, ወይም የጊዜ ገደብ ስህተቶች, አውታረ መረብ ማስተካከል
ተደራሽነት ወይም የህዝብ የሙከራ አውታረመረብ መጨረሻ ነጥብ ከመነሻው በፊት መጠበቅ
ቁልፎች ወይም የግብይት ጥቅማጥቅሞች።

## ግብይቶች ውድቅ ይደረጋሉ {#transactions-are-rejected}

አብዛኛዎቹ የግብይት ውድቀቶች የሚከሰቱት በማንነት ወይም በፈቃድ መዛባት ምክንያት ነው

- በደንበኛው ውቅር ውስጥ ያለው የሂሳብ የህዝብ ቁልፍ ከግል ቁልፍ ጋር አይጣጣምም
  ለመፈረም ጥቅም ላይ ይውላል
- ሂሳቡ በጄኔሲስ ወይም በቀደመ ግብይት አልተመዘገበም
- ሂሳቡ በሂደት ጊዜ የሚፈለገውን የመፈቀደለት ምልክት ወይም ሚና የለውም
  ማረጋገጫ
- አንድ ጎራ ID የመረጃ ቦታ ብቃቱን ያጣ ነው, ለምሳሌ
  `domain.dataspace`

አጠቃቀም `--output-format text` ማረም ሳለ CLI ትዕዛዞች ስህተቶች ቀላል ናቸው
ለማንበብ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## መጠይቆች ባዶ ውጤቶችን ይመልሳሉ {#queries-return-empty-results}

ባዶ መጠይቅ ውጤቶች ሁልጊዜ ጥያቄው አልተሳካም ማለት አይደለም.

- ዕቃውን ሊፈጥር የሚገባው ግብይት የተፈጸመ ነው
- የተጠየቀው ጎራ፣ የንብረት ትርጉም ወይም ሂሳብ ID በካኖኒክ
- ገጽታ ወይም ማጣሪያዎች የሚጠበቁትን ረድፍ አይጥሉም
- ደንበኛው ከተፈለገው አውታረመረብ ጋር የተገናኘ ነው እንጂ ሌላ የአካባቢው አውታረ መረብ አይደለም።

ለጎራ ቁጥጥር በጣም ሰፊውን መጠይቅ ይጀምሩ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## ክስተት ወይም ማገድ ዥረቶች ቀደም ብለው ያቆማሉ {#event-or-block-streams-stop-early}

የብሎክ እና ክስተት ዥረት ምሳሌዎች Torii የዥረት መጨረሻ ነጥቦች.
ፒር አሁንም እየሮጠ ነው, ከዚያም ጊዜ ጋር ሙከራ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

ለ HTTP ውህደቶች, የአሁኑ ጋር የመጨረሻ ነጥብ ጎዳናዎች ማወዳደር
[Torii የፍጻሜ ነጥብ ማጣቀሻ](/am/reference/torii-endpoints.md).
