---
translation_locale: am
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ዘፍጥረት {#genesis}

ዘፍጥረት የመጀመሪያውን ሰንሰለት ሁኔታ ይገልጻል። ሊስተካከል የሚችል ምንጭ JSON ማኒፌስት ሲሆን Iroha 3 አንጓ የተፈረመ Norito የግብይት ፋይል ያጠቃልላል ።

::: details ነባሪ የጄኔዚስ ማኒፌስት

<<< @/snippets/genesis.json

:::

## ፋይሎች {#files}

የቅድመ ፍሰት ማከማቻ በ ላይ ነባሪ ማንቂያ ይልካል `defaults/genesis.json`. Kagami-የተፈጠሩ አውታረ መረቦች የራሳቸውን ማሳያ እና የተፈረሙ ግብይቶች ወደ የውጤት ማውጫ ይጽፋሉ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

በዚያ ማውጫ ውስጥ የተፈጠረው `README.md` ለተመረጠው መገለጫ ትክክለኛውን ፋይሎች እና የመነሻ ትዕዛዞችን ይመዝግባል።

## የእኩዮች አሠራር {#peer-configuration}

በ `config.toml` `[genesis]` ክፍል ውስጥ የተፈረመውን የጀኔዝ ግብይት የሚያመለክቱ አቻዎች:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

በአውታረ መረቡ ውስጥ ያሉ ሁሉም እኩዮች የተፈረመውን የጄኔዝ ግብይት እና የጄኔዚስ የህዝብ ቁልፍ መስማማት አለባቸው ።

## የዘፍጥረት መጽሐፍ ፊርማ {#signing-genesis}

አንድን ማኒፌስት በእጅ የሚያርትዑ ከሆነ, እኩዮችን ከመጀመርዎ በፊት ያረጋግጡ እና ይፈርሙበት:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

ለ NPoS ወይም Nexus መገለጫዎች ፣ የቶፖሎጂ እና BLS የተፈጠረው መገለጫ የሚጠይቀው የንብረት ማስረጃ። Kagami `localnet`, `wizard`, እና የመገለጫ ትውልድ ትዕዛዞች እነዚያን ዝርዝሮች በራስ-ሰር ያስተናግዳሉ.

## ዘፍጥረት ዳግመኛ መፈጸሙ {#recommitting-genesis}

አንድ እኩይ ብቻ ማከማቻው ባዶ በሚሆንበት ጊዜ ጀኔሲስን ይፈጽማል ። በአንድ ነጠላ localnet ውስጥ አዲስ ጀኔሲስ ለመሞከር ፣ እኩዮቹን ያቁሙ ፣ የተፈጠረውን የስቴት ማውጫቸውን ያስወግዱ እና ከአዲሱ የተፈረመ ጅኔሲስ ይጀምሩ። እያንዳንዱ ማረጋገጫ ሰጪ ተመሳሳይ ፍልሰት ካልተቀናጀ በስተቀር በሂደቱ አውታረ መረብ ላይ ጄኔሲን አይተካ።
