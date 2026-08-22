---
translation_locale: am
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# ጋር በመስራት ላይ Iroha ሁለትዮሽ {#working-with-iroha-binaries}

የ Iroha 3 ኦፕሬተር የስራ ፍሰት በሶስት ዋና ሁለትዮሽ ዙሪያ ያሽከረክራል፡

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) አቻ ዴሞን ለማሄድ
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) ለ CLI እና ከዋኝ ትዕዛዞች
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) ለቁልፍ, ለዘፍጥረት, ለአካባቢያዊ መረቦች እና መገለጫዎች

## ከምንጩ ይገንቡ {#build-from-source}

ከላይ ካለው የስራ ቦታ ስር፡

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

የመልቀቂያው ሁለትዮሾች በ ውስጥ ይገኛሉ `target/release/`.

የትዕዛዝ ወለልን ለመመርመር፡-

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## በቀጥታ ከማከማቻው ያሂዱ {#run-directly-from-the-repository}

በአለምአቀፍ ደረጃ ማንኛውንም ነገር መጫን ካልፈለጉ ይጠቀሙ `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ምስል {#docker-image}

የላይኛው የስራ ቦታ ይጠቀማል `kagami localnet` እና `kagami docker` ለማመንጨት
Docker Compose ከተፈተሸው ኮድ ጋር የሚዛመዱ ፋይሎች።የ `hyperledger/iroha:dev`
ምስል ከተፈጠሩት ፋይሎች ጋር መጠቀም ይቻላል.

አሂድ CLI በመያዣ ውስጥ;

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

ሩጡ Kagami በመያዣ ውስጥ;

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

ለአቻ ጅምር የአካባቢ መረብ ይፍጠሩ እና መጀመሪያ ፋይል ይጻፉ፡

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## የትኛውን ሁለትዮሽ ልጠቀም? {#which-binary-should-i-use}

- ተጠቀም `irohad` እኩዮችን ሲጀምሩ ወይም ሲሰሩ.
- ተጠቀም `iroha` የሂሳብ ደብተሩን ለመጠየቅ፣ ግብይቶችን ለማስገባት ወይም የኦፕሬተር የመጨረሻ ነጥቦችን ለመፈተሽ ሲያስፈልግ።
- ተጠቀም `kagami` ቁልፎች፣ የዘፍጥረት መግለጫዎች፣ የመገለጫ ቅርቅቦች ወይም የአካባቢ መረብ ንብረቶች ሲፈልጉ።

## Kagemusha ልቀቅ ሕትመት እና ልቀት {#kagemusha-release-publication-and-rollout}

ካጌሙሻ V4 ማተም እና ማግበር የተለዩ የተጠበቁ ድንበሮችን ያቋርጣሉ፡

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` የሚለው ነው።
  ማክሮስ-ብቻ፣ ስርወ-ብቻ አታሚ።የተሰካውን ያረጋግጣል Kagami ሁለትዮሽ እና
  ትክክለኛው የአስራ ስድስት-ፋይል እጩ, የሌለውን ያትማል
  `promotion-record-v4.norito` ያለ ምትክ, እና ስኬትን ብቻ ሪፖርት ያደርጋል
  ትክክለኛው የአስራ ሰባት ፋይል አስተዋውቋል ከተለቀቀ በኋላ።
- `iroha offline kagemusha rollout-v4 create-expectations` የተፈረመውን ያረጋግጣል
  ቦታ ማስያዝ፣ አራት የታዘዙ አረጋጋጭ የብቃት ማረጋገጫ ማህተሞች፣ ትክክለኛው
  አስቀድሞ የተፈቀደ የግብይት ሽቦ፣ እና የታመነው የተጠናቀቀ መልህቅ ከዚህ በፊት
  ያለ ምትክ የተፈረመ የሚጠበቁ ማተም.
- `iroha offline kagemusha rollout-v4 submit` በግልፅ ይጠይቃል
  `--write-authorized` ስምምነት.በዘለቄታው መጽሔቶችን ያትማል እና ትክክለኛውን እንደገና ያረጋግጣል
  ከአውታረ መረብ በፊት የሚጠበቁ ነገሮች ይፃፉ ወይም እንደገና ይሞክሩ።አን `Applied` ሁኔታ አይደለም
  በቂ: ትዕዛዙም የተፈጸመውን እገዳ, የመጨረሻነት ተተኪውን ያረጋግጣል
  ሰንሰለት፣ እና ሙሉ ፈቃድ ያለው የግብይት ሽቦ።
- `iroha offline kagemusha rollout-v4 finalize-receipt` ተመሳሳዩን በማስረጃ
  የተደገፈ ማስረጃ የሚሰበስበው ትክክለኛው የማስገቢያ መዝገብ እንደገና
  ከተረጋገጠ በኋላ ብቻ ነው፣ በገለልተኛው ደረሰኝ ሰጪ ይፈርመዋል፣ እና
  ቀኖናዊውን ደረሰኝ ሳይተካ ያትማል።

የተረጋገጠው የከጌሙሻ ምርት ዝግጁነት የስራ ሂደት የማረጋገጫ-ብቻ ነው።
የተረጋገጠውን አታሚ አይደውልም፣ የአረጋጋጭ መመዘኛን አትም።
ማኅተም፣ ገቢር ያስገቡ ወይም የመጨረሻ ደረሰኝ ይፍጠሩ።የተሳካ የስራ ሂደት
ሩጫ ስለዚህ ማስተዋወቅም ሆነ ቀጥታ መልቀቅን አያረጋግጥም።

እነዚህ ትእዛዛት የአካባቢ ቀዳሚዎች እንጂ የቀጥታ ማስረጃዎች ምትክ አይደሉም።ሀ
የምርት ልቀት ከእውነተኛ አካላዊ መተግበሪያ ማረጋገጫ እና እንደታገደ ይቆያል
የእጩ ቅርሶች፣ አራቱም የተጠበቁ የአስተናጋጅ ማህተሞች፣ የአሂድ ጊዜ አስተዳደር እና
ግብዓቶችን መፈረም፣ የቀጥታ ባለአራት አረጋጋጭ ማስረከቢያ እና የመጨረሻነት ማስረጃ፣ እና የ
ቀኖናዊ ውጤታማ-ውቅር ትንበያ.የግል ቁልፎችን ያስቀምጡ ፣
የማረጋገጫ ቁሳቁስ፣ እና የማስተዋወቂያ-ተኮር መለያዎች በተጠበቁ
የአሂድ ጊዜ ጥበቃ;ወደ ምንጭ-ቁጥጥር ሰነዶች አይገለብጡ ወይም
ኦፕሬተር ትኬቶች.
