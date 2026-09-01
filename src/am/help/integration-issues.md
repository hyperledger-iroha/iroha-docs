---
translation_locale: am
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የውህደት ጉዳዮችን መላ መፈለግ {#troubleshooting-integration-issues}

ይህ ክፍል ለ Iroha 3 ውህደት የመላ መፈለጊያ ምክሮችን ይሰጣል። እያጋጠመዎት ያለው ችግር እዚህ ካልተገለጸ፣ በ[ቴሌግራም](https://t.me/hyperledgeriroha) በኩል ያግኙን።

## ደንበኛ መገናኘት አይችልም {#client-cannot-connect}

የደንበኛው ውቅር ወደ አውታረ መረብ አቻ Torii አድራሻ እንደሚያመለክት ያረጋግጡ -

```toml
torii_url = "http://127.0.0.1:8080/"
```

ለ CLI ቼኮች፣ ተመሳሳዩን ፋይል በግልፅ ያስተላልፉ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

የአውታረ መረብ አቻው በ Docker ወይም Kubernetes ውስጥ የሚሰራ ከሆነ ከደንበኛው ሂደት ሊደረስበት የሚችለውን አስተናጋጅ ወይም የአገልግሎት አድራሻ ይጠቀሙ። `127.0.0.1` በኮንቴይነር ውስጥ የአስተናጋጅ ማሽን አይደለም።.

ለህዝብ Taira ሙከራዎች፣ ባልተፈረመ API የመጨረሻ ነጥብ ምርመራ ይጀምሩ -

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

እነዚህ ትዕዛዞች በ`502`፣ TLS፣ DNS ወይም የጊዜ ማብቂያ ስህተቶች ካልተሳኩ የመለያ ቁልፎችን ወይም የግብይት ጭነቶችን ከማረምዎ በፊት የአውታረ መረብ ተደራሽነትን ያስተካክሉ ወይም ይፋዊ ቴስትኔት API የመጨረሻ ነጥብ ይጠብቁ።

## ግብይቶች ውድቅ ተደርገዋል {#transactions-are-rejected}

አብዛኛዎቹ የግብይት ውድቀቶች የሚከሰቱት በማንነት ወይም በፍቃድ አለመመጣጠን ነው -

- በደንበኛው ውቅር ውስጥ ያለው የመለያ ይፋዊ ቁልፍ ለመፈረም ጥቅም ላይ ከሚውለው የግል ቁልፍ ጋር አይዛመድም
- መለያው በብሎክቼይን ጀነሲስ ወይም በቀደመው ግብይት አልተመዘገበም
- መለያው በሶፍትዌር ማስፈጸሚያ አካባቢ አረጋጋጭ የሚፈለገው የፍቃድ ቶከን ወይም ሚና የለውም
- የጎራ መታወቂያ እንደ `domain.dataspace` ያሉ የውሂብ ቦታ መመዘኛዎች ይጎድላሉ

ስህተቶች ለማንበብ ቀላል እንዲሆኑ CLI ትዕዛዞችን በሚያርሙበት ጊዜ `--output-format text`ን ይጠቀሙ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## መጠይቆች ባዶ ውጤቶችን ይመልሳሉ {#queries-return-empty-results}

ባዶ የመጠይቅ ውጤቶች ሁልጊዜ መጠይቁ አልተሳካም ማለት አይደለም። ይፈትሹ

- እቃውን መፍጠር ያለበት ግብይት ተጠናቅቋል
- የተጠየቀው ጎራ፣ የንብረት ፍቺ ወይም የመለያ መታወቂያ ነጠላ ፕሮቶኮል-መደበኛ ነው።
- አጀንዳ ወይም ማጣሪያዎች የሚጠበቀውን ረድፍ አያካትቱም
- ደንበኛው ከታሰበው አውታረ መረብ ጋር የተገናኘ ነው እንጂ ሌላ የአካባቢ አውታረ መረብ አይደለም

ለጎራ ፍተሻዎች፣ በሰፊው መጠይቅ ይጀምሩ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## የክስተት ወይም የብሎክ ዥረቶች ቀደም ብለው ይቆማሉ {#event-or-block-streams-stop-early}

ብሎክ እና የክስተት ዥረት ምሳሌዎች በ Torii ዥረት API የመጨረሻ ነጥቦች ላይ ይተማመናሉ። የአውታረ መረብ አቻው አሁንም እየሰራ መሆኑን ያረጋግጡ፣ ከዚያ በጊዜ ማብቂያ ይሞክሩ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

ለ HTTP ውህደቶች፣ የእርስዎን API የመጨረሻ ነጥብ መንገዶች አሁን ካለው [Torii API የመጨረሻ ነጥብ ማጣቀሻ](/am/reference/torii-endpoints.md) ጋር ያወዳድሩ።
