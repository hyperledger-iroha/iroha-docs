---
translation_locale: am
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ዘፍጥረት {#genesis}

ዘፍጥረት የመጀመሪያውን ሰንሰለት ሁኔታ ይገልጻል። JSON ግልፅ፣
እና አንድ Iroha 3 አንጓ የተፈረመውን ይጠቀማል Norito የግብይት መዝገብ።

::: details ነባሪ የጅነዚስ ማኒፌስት

<<< @/snippets/genesis.json

:::

## ፋይሎች {#files}

የቅድመ-መንገድ ማከማቻ በ ላይ ነባሪ ማሳያ መላክ `defaults/genesis.json`.
Kagami-የተፈጠሩ አውታረ መረቦች የራሳቸውን ማኒፌስት እና የተፈረሙ ግብይቶች ወደ
የውጤት ማውጫ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የተፈጠረው `README.md` በዚያ ማውጫ ውስጥ ትክክለኛ ፋይሎችን ይመዝገቡ እና ማስጀመር
ለተመረጠው መገለጫ ትዕዛዞች።

## የእኩዮች አወቃቀር {#peer-configuration}

የጋራ ግብይቶች በስምምነት ላይ የተፈረሙ `[genesis]` ክፍል
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

በኔትወርኩ ውስጥ ያሉ ሁሉም እኩዮች የተፈረመውን የመነሻ ግብይት እና
የዘፍጥረት የሕዝብ ቁልፍ።

## የዘፍጥረት መጽሐፍ {#signing-genesis}

አንድን ማኒፌስት በእጅ ከታዘዙ፣ እኩዮችን ከመጀመርዎ በፊት ያረጋግጡትና ይፈርሙበት።

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

ለ NPoS ወይም Nexus መገለጫዎች, የቶፖሎጂ እና BLS ባለቤትነት ማስረጃ
የተፈጠረው መገለጫ የሚጠይቀው። Kagami `localnet`, `wizard`, እና መገለጫ
የጄኔሬሽን ትዕዛዞች እነዚያን ዝርዝሮች በራስ-ሰር ያስተናግዳሉ።

## ዘፍጥረት ዳግመኛ መፈጸሙ {#recommitting-genesis}

አንድ እኩይ ሰው ጄኔሲስን የሚፈጽምበት ቦታ ባዶ በሚሆንበት ጊዜ ብቻ ነው።
የአካባቢያዊ አውታረ መረብ፣ አቻዎችን ያቁሙ፣ የተፈጠረውን የስቴት ማውጫ ያስወግዱ፣
እና አዲስ የተፈረመ ጀነዝ ጀምሮ.
ሁሉም ማረጋገጫ ሰጪዎች ተመሳሳይ ፍልሰት በማስተባበር ካልሆነ በስተቀር አውታረ መረብ።
