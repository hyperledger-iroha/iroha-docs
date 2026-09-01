---
translation_locale: am
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# blockchain ጀነሲስ {#genesis}

Blockchain ጀነሲስ የመጀመሪያውን ሰንሰለት ሁኔታ ይገልጻል። ሊስተካከል የሚችል ምንጭ JSON ቴክኒካል ማኒፌስት ነው፣ እና Iroha 3 ኖድ የተፈረመ Norito የግብይት ፋይል ይጠቀማል።

::: details ነባሪ blockchain ጀነሲስ ቴክኒካዊ አንጸባራቂ

<<< @/snippets/genesis.json

:::

## ፋይሎች {#files}

የላይኛው ማከማቻ ነባሪ ቴክኒካል ማኒፌስት በ`defaults/genesis.json` ይልካል። Kagami የመነጩ አውታረ መረቦች የራሳቸውን ቴክኒካል ማኒፌስት ይጽፋሉ እና የተፈረሙ ግብይቶችን ወደ ውፅዓት ማውጫ ይጽፋሉ -

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

በዚያ ማውጫ ውስጥ ያለው የመነጨው `README.md` ትክክለኛውን ፋይሎች ይመዘግባል እና ለተመረጠው መገለጫ ትዕዛዞችን ያስጀምራል።

## የአውታረ መረብ አቻ ውቅር {#peer-configuration}

የአውታረ መረብ እኩዮች በ`config.toml` `[genesis]` ክፍል ውስጥ የተፈረመውን የብሎክቼይን ጀነሲስ ግብይት ይጠቁማሉ -

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

የአውታረ መረቡ እኩዮች ሁሉ በተፈረመው የጀነሲስ ግብይትና በጀነሲስ ይፋዊ ቁልፍ ላይ መስማማት አለባቸው።

## የብሎክቼይን ጀነሲስ መፈረም {#signing-genesis}

የቴክኒክ ማኒፌስት እራስዎ ካስተካከሉ የአውታረ መረብ እኩዮችን ከመጀመርዎ በፊት ያረጋግጡ እና ይፈርሙ -

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` በባለቤት የተያዘ ሁነታ-`0600`፣ ነጠላ-አገናኝ መደበኛ ፋይል አንድ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የግል-ቁልፍ መልቲሃሽ እና የመጨረሻውን አዲስ መስመር የያዘ መሆን አለበት።. Kagami ምሳሌያዊ አገናኞችን አይቀበልም እና በትእዛዝ መስመሩ ላይ ጥሬ የብሎክቼይን ጀነሲስ የግል ቁልፍን በጭራሽ አይቀበልም።.

ለNPoS ወይም Nexus መገለጫዎች፣ በተፈጠረው መገለጫ የሚፈለገውን ቶፖሎጂ እና BLS የይዞታ ማረጋገጫዎችን ያካትቱ። Kagami `localnet`፣ `wizard` እና የመገለጫ ማመንጨት ትዕዛዞች እነዚያን ዝርዝሮች በራስ-ሰር ያስተናግዳሉ።

## የብሎክቼይን ጀነሲስ እንደገና መፈጸም {#recommitting-genesis}

የኔትወርክ አቻ የብሎክቼይን ጀነሲስን የሚያጠናቅቀው ማከማቻው ባዶ ሲሆን ብቻ ነው። አዲስ የብሎክቼይን ጀነሲስ በሚጣል የአካባቢ አውታረመረብ ውስጥ ለመፈተሽ የአውታረ መረብ እኩዮቹን ያቁሙ ፣ የመነጨውን የሁኔታ ማውጫቸውን ያስወግዱ እና ከአዲሱ የተፈረመ የብሎክቼይን ጀነሲስ ይጀምሩ። እያንዳንዱ አረጋጋጭ ተመሳሳይ ፍልሰትን ካላስተባብረ በስተቀር የብሎክቼይን ጀነሲስን በሚሮጥ አውታረመረብ ላይ አይተኩ።
