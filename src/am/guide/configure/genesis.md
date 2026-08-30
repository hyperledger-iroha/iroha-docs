---
translation_locale: am
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# ኦሪት ዘፍጥረት {#genesis}

ዘፍጥረት የመጀመሪያውን ሰንሰለት ሁኔታ ይገልጻል።ሊስተካከል የሚችል ምንጭ ሀ JSON ገላጭ፣
እና አንድ Iroha 3 መስቀለኛ መንገድ የተፈረመበትን ይበላል Norito የግብይት ፋይል.

::: details ነባሪ ዘፍጥረት አንጸባራቂ

<<< @/snippets/genesis.json

:::

## ፋይሎች {#files}

ወደ ላይ ያለው ማከማቻ ነባሪ አንጸባራቂን በ `defaults/genesis.json`.
Kagami-የተፈጠሩ አውታረ መረቦች የራሳቸውን መግለጫ እና የተፈረመ ግብይት ይጽፋሉ
የውጽአት ማውጫ፡

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

የተፈጠረው `README.md` በዚያ ማውጫ ውስጥ ትክክለኛውን ፋይሎች ይመዘግባል እና ያስነሳል።
ለተመረጠው መገለጫ ትዕዛዞች.

## የአቻ ውቅር {#peer-configuration}

በ ውስጥ የተፈረመው የዘፍጥረት ግብይት ላይ እኩዮች ይጠቁማሉ `[genesis]` ክፍል የ
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

በአውታረ መረቡ ውስጥ ያሉ ሁሉም እኩዮች በተፈረመበት የዘፍጥረት ግብይት እና በ
ዘፍጥረት የህዝብ ቁልፍ.

## ዘፍጥረትን መፈረም {#signing-genesis}

አንጸባራቂን እራስዎ አርትዕ ካደረጉት አጽድተው እኩዮችን ከመጀመርዎ በፊት ይፈርሙት፡-

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` በባለቤትነት የተያዘ ሁነታ መሆን አለበት-`0600`, ነጠላ-አገናኝ
አንድ ቀኖናዊ የግል-ቁልፍ መልቲሃሽ እና የመጨረሻውን የያዘ መደበኛ ፋይል
አዲስ መስመር. Kagami ምሳሌያዊ አገናኞችን አይቀበልም እና ጥሬ ዘፍጥረትን በጭራሽ አይቀበልም።
በትእዛዝ መስመር ላይ ቁልፍ.

ለ NPoS ወይም Nexus መገለጫዎች, ቶፖሎጂን እና ያካትታሉ BLS የይዞታ ማረጋገጫዎች
በተፈጠረው መገለጫ ያስፈልጋል. Kagami `localnet`, `wizard`, እና መገለጫ
የትውልድ ትዕዛዞች እነዚያን ዝርዝሮች በራስ-ሰር ያስተናግዳሉ።

## ዘፍጥረትን እንደገና ማስጀመር {#recommitting-genesis}

እኩያ ዘፍጥረትን የሚፈጽመው ማከማቻው ባዶ ሲሆን ብቻ ነው።ውስጥ አዲስ ዘፍጥረትን ለመሞከር
ሊጣል የሚችል የአካባቢ መረብ፣ እኩዮቹን ያቁሙ፣ የፈጠሩትን የግዛት ማውጫ ያስወግዱ፣
እና ከአዲሱ የተፈረመ ዘፍጥረት ይጀምሩ።በሩጫ ላይ ዘፍጥረትን አትተኩ
እያንዳንዱ አረጋጋጭ ተመሳሳይ ፍልሰትን እያስተባበረ ካልሆነ በስተቀር አውታረ መረብ።
