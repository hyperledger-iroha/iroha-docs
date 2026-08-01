---
translation_locale: am
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የመዋሃድ ችግሮች {#troubleshooting-integration-issues}

ይህ ክፍል ለ Iroha 3 ውህደት የችግር መፍታት ጠቃሚ ምክሮችን ይሰጣል ። የሚያጋጥማችሁት ችግር እዚህ ያልተገለጸ ከሆነ በቴሌግራም [ ቴሌግራም](https://t.me/hyperledgeriroha) በኩል ያነጋግሩን ።

## ደንበኛው መገናኘት አይችልም {#client-cannot-connect}

የደንበኛው ውቅር ወደ ባልደረባው Torii አድራሻ የሚያመለክት መሆኑን ያረጋግጡ:

```toml
torii_url = "http://127.0.0.1:8080/"
```

ለ CLI ምርመራዎች ተመሳሳይ ፋይል በግልጽ አሳልፉ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

እኩዮቹ ከገቡ Docker ወይም Kubernetes፣ ከደንበኛው ሂደት ተደራሽ የሆነውን አስተናጋጅ ወይም የአገልግሎት አድራሻ ይጠቀሙ። `127.0.0.1` በአንድ መያዣ ውስጥ ያለው አስተናጋጅ ማሽን አይደለም።

ለሕዝብ ሙከራዎች Taira ፣ ያልተፈረመ የጨረታ ነጥብ ምርመራ ይጀምሩ

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

እነዚህ ትዕዛዞች `502`, TLS, DNS ወይም የጊዜ ገደብ ስህተቶች ካልተሳካላቸው የአውታረ መረብ ተደራሽነትን ያስተካክሉ ወይም የሂሳብ ቁልፎችን ወይም የግብይት ጥቅማጥቅሞችን ከማስተካከልዎ በፊት ለህዝባዊ የሙከራ አውታረመረብ መጨረሻ ነጥብ ይጠብቁ።

## ግብይቶች ውድቅ ይደረጋሉ። {#transactions-are-rejected}

አብዛኛዎቹ የግብይት ውድቀቶች የሚከሰቱት በማንነት ወይም በፈቃድ መዛባት ምክንያት ነው

- በደንበኛው ውቅር ውስጥ ያለው የመለያ የህዝብ ቁልፍ ለመፈረም ጥቅም ላይ የዋለው የግል ቁልፍ ጋር አይመሳሰልም።
- ሂሳቡ በጀነሲስ ወይም በቀደመ ግብይት የተመዘገበ አይደለም
- ሂሳቡ በስራ ሰዓት ማረጋገጫው የሚፈለገው የመፈቀደለት ምልክት ወይም ሚና የለውም ።
- አንድ ጎራ ID እንደ `domain.dataspace` የመረጃ ቦታ ማረጋገጫ የጎደለው ነው

ስህተቶች ለማንበብ ቀላል እንዲሆን የ `--output-format text` ትዕዛዞችን ሳያስተካክሉ CLI ይጠቀሙ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## መጠይቆች ባዶ ውጤቶችን ይመልሳሉ {#queries-return-empty-results}

ባዶ መጠይቅ ውጤቶች ሁልጊዜ ጥያቄው አልተሳካም ማለት አይደለም. ያረጋግጡ:

- ዕቃውን ሊፈጥር የሚገባው ግብይት የተፈጸመ ነው
- የተጠየቀው ጎራ፣ የንብረት ትርጉም ወይም መለያ ID ቀኖናዊ ነው
- ገጾች ወይም ማጣሪያዎች የሚጠበቁትን ረድፍ አያካትቱም
- ደንበኛው ከተፈለገው አውታረመረብ ጋር የተገናኘ ነው እንጂ ሌላ አካባቢያዊ አውታረ መረብ አይደለም።

ለጎራ ፍተሻዎች በጣም ሰፊውን ጥያቄ ይጀምሩ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## ክስተት ወይም ማገድ ዥረቶች ቀደም ብለው ያቆማሉ {#event-or-block-streams-stop-early}

የብሎክ እና ክስተት ዥረት ምሳሌዎች በ Torii ዥረት መጨረሻ ነጥቦች ላይ የተመሰረቱ ናቸው ። የእኩዮች አሁንም እየሰራ መሆኑን ያረጋግጡ ፣ ከዚያ ጊዜ ቆይታን ይሞክሩ-

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP ውህደቶች, የአሁኑ [Torii መጨረሻ ነጥብ ማጣቀሻ ጋር የእርስዎን የመጨረሻ ነጥብ ዱካዎች ለማወዳደር ](/am/reference/torii-endpoints.md).
