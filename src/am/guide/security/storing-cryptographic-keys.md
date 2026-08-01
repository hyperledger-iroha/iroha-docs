---
translation_locale: am
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# ምስጠራ ቁልፎችን ማከማቸት {#storing-cryptographic-keys}

የግል ቁልፍ ለባለሥልጣኑ የተፈቀደውን ማንኛውንም እርምጃ ሊፈቅድለት ይችላል። የግል ቁልፍን በጭራሽ አይጋሩ ። የዘር ቁሳቁስ ፣ የማግኛ ምስጢሮች ፣ ተሸካሚ ቶከኖችን እና ወደ ውጭ የሚላኩ ቁልፍ ፋይሎችን በተመሳሳይ ጥንቃቄ ይጠብቁ።

የምርት ጅምር ከመጀመሩ በፊት የጥበቃ ዲዛይን ይምረጡ ። ዲዛይኑ ከስጋት ዋጋ ፣ ከሂሳብ ተቆጣጣሪ ፖሊሲ እና ከማሰማራቱ ማገገም ሂደት ጋር የሚስማማ መሆን አለበት።

## የእንክብካቤ ገደቡን መወሰን {#define-the-custody-boundary}

- እያንዳንዱ ባለሥልጣን፣ የህዝብ ቁልፍ፣ ስልተ ቀመር፣ አካባቢ፣ አላማ፣ ጠባቂ፣ የማከማቻ ቦታ፣ የመጠባበቂያ እና የመተካት አሰራር ዝርዝር ይያዙ።
- ለልማት፣ ለሙከራ፣ ለምርት፣ ለተለመዱ ግብይቶች፣ ለአስተዳደር፣ ለማሰማራት እና ለማገገም የተለያዩ ቁልፎችን ይጠቀሙ።
- ሰዎች እና ሂደቶች በድርሻቸው የሚፈለጉትን ቁልፎች ብቻ እንዲያገኙ ማድረግ።
- ለከፍተኛ ዋጋ ወይም ለአስተዳደር ፊርማ የራስ ገዝ ማረጋገጫ ይጠይቃሉ ፣ የችግሩ ሞዴል ሲጠይቀው።
- አንድ ፊርማ ሰጪ የትኛውን አውታረመረብና ሥልጣን ሊጠቀምበት እንደሚችል መዝገብ። አንድ የፊርማ አገልግሎት ከዚህ አቅም ውጭ ያሉ ጥያቄዎችን ውድቅ ማድረግ አለበት።

## ተስማሚ የሆነ የማከማቻ ዘዴ ምረጥ {#choose-an-appropriate-storage-method}

ለlocal development፣ ለcontrolled test ወይም ለsecure custody handoff ቁልፍን ፈቃዱ ወደተገደበ ፋይል export ማድረግ ይቻላል። በሚደገፍ Unix መድረክ `kagami`ን በመጠቀም አዲስ የቁልፍ ማውጫ ይፍጠሩ፦

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

የወላጅ ማውጫው መኖር አለበት። ዒላማው አዲስ ወይም ቀድሞውኑ የአሁኑ ተጠቃሚ ንብረት፣ በ`0700` mode፣ ያለ symbolic link እና ባዶ መሆን አለበት። Kagami `public.key` እና `private.key`ን በ`0600` mode ይጽፋል፤ `--pop` `pop.hex`ንም ይጽፋል። Kagami የባለቤት-ብቻ የፋይል ስርዓት ደንቦችን ማስገደድ በማይችልበት መድረክ ትዕዛዙ በስህተት ይቋረጣል።

የግል ቁልፍ ፋይሉ ያልተመሰጠረ export ነው። ከsource control፣ shared folder፣ log፣ ticket፣ chat እና build artifact ውጭ ያቆዩት። የምርት ቁልፍን ወደተፈቀደ custody boundary ያስገቡ፣ ከዚያ export ፋይሉን በdeployment አሰራር መሠረት ያስወግዱ። የdevelopment ቁልፍን በምርት እንደገና አይጠቀሙ።

ለምርቱ እንደ የሚከተሉትን የተረጋገጠ የጥበቃ ገደብ ይመርጣሉ:

- የሃርድዌር የደህንነት ሞዱል ወይም በሃርድዌሩ የተደገፈ ቁልፍ ማከማቻ
- የኦፕሬቲንግ ሲስተም ወይም የሞባይል ቁልፍ ማከማቻ
- የተለዩ የፊርማ አገልግሎት
- አንድ ምስጢራዊ ሥራ አስኪያጅ ቁልፉን ለፈቀደለት የስራ ጭነት ብቻ የሚለቅ

የተመረጠው ውህደት ያንን ባህሪ የሚደግፍ ከሆነ ቁልፍ ቁሳቁስ ወደ ውጭ የማይላክ እንዲሆን ያድርጉ። የጥበቃ ስርዓቱ በ Iroha ባለሥልጣን የሚጠየቀውን የአልጎሪዝም እና የፊርማ ሥራ እንደሚደግፍ ያረጋግጡ።

Encryption at rest የተከማቸውን ቅጂ ብቻ ይጠብቃል። ያልተፈቀደ process ወይም operator decrypted bytesን ካገኘ በኋላ ቁልፉን አይጠብቅም። Host-ን ያጠናክሩ፣ runtime accessን ይገድቡ እና signing activityን ይቆጣጠሩ።

## የፊርማ ሥራ ፍሰቶችን ይጠብቁ {#protect-signing-workflows}

- የተሰየሙ የኦፕሬተር ማንነቶችን፣ ጠንካራ የማረጋገጫ እና ወደ ፊርማ ስርዓቶች የተረጋገጠ መዳረሻ ይጠቀሙ።
- ከትእዛዝ መስመር ክርክሮች, የሻል ታሪክ, የአካባቢ ማስወገጃዎች, የሂደት ዝርዝሮች, የአደጋ ሪፖርቶች እና የመተግበሪያ መዝገቦች ውስጥ ጥሬ ቁልፎችን ያስወግዱ.
- ፊርማውን ለተፈለገው ተግባር ብቻ ይክፈቱ. ክፍለ ጊዜው ከተጠቀመ በኋላ ይዘጋል ወይም ያበቃል።
- ፈቃድ ከመሰጠቱ በፊት ባለሥልጣኑን፣ አውታረ መረቡን፣ መመሪያዎቹን፣ ንብረቶቹንና ክፍያዎቹን ያሳዩት።
- ለprivileged ወይም ከፍተኛ ዋጋ ግብይቶች ግልጽ ማረጋገጫ ይጠይቁ።
- ብጁ የደንበኛ ውህደት ፊርማውን ሊሰጥ በሚችልበት ጊዜ ጥሬ የግል ቁልፎችን ከአሳሽ ገጾች እና ከጠቅላላው ዓላማ የመተግበሪያ ሂደቶች ውጭ ያቆዩ ።

Plain-text client configuration ለlocal development እና controlled test ብቻ ተስማሚ ነው። የምርት integration ፊርማዎችን በተፈቀደ custody boundary በኩል ማግኘት አለበት። Standard Iroha CLI የግል ቁልፍን ከclient configuration ያነባል እና generic external-signer adapter አያቀርብም። Custom client-ዎች transaction payload hashን ገንብተው በexternal signer የተፈጠረ ፊርማ ማያያዝ ይችላሉ።

## ቁልፎችን ወደ ኋላ መልሶ ማግኘት {#back-up-and-recover-keys}

- የrecovery policy ምትኬ የሚጠይቅላቸውን ቁልፎች ብቻ backup ያድርጉ።
- Backup-ዎችን encrypt ያድርጉ እና ከlive signer ለይተው ያስቀምጡ።
- በbackup ላይ ከlive key ጋር ተመሳሳይ access እና approval control ይተግብሩ።
- Separation of duties ሲያስፈልግ recovery credentialsን በindependent custody ስር ያስቀምጡ።
- የምርት ቁልፍ ቁሳቁስን ሳያጋልጡ restorationን ይፈትኑ።
- እያንዳንዱን backup creation፣ access፣ restore እና destruction ይመዝግቡ እና ይገምግሙ።

ተያያዥነት የሌለው የኪስ ቦርሳ mnemonic ቅርጸት Iroha የግል ቁልፍን ሊያመለክት ይችላል ብለው አያስቡ ። በተመረጠው የመጠባበቂያ ስርዓት የሚደገፍ እና የተፈተነ የማገገም ቅርጸት ብቻ ይጠቀሙ።

## የተጋለጡ ወይም ከአገልግሎት የወጡ ቁልፎችን ይተኩ {#replace-exposed-or-retired-keys}

ክስተት ከመከሰቱ በፊት ለመተካት ይዘጋጁ። አሰራሩ የሚከተሉትን መለየት አለበት፦

1. ቁልፉ የተጋለጠ ወይም ከአገልግሎት የወጣ መሆኑን ማን ሊያውጅ እንደሚችል
2. የተጎዳው signer እንዴት isolate እንደሚደረግ
3. አዲስ ቁልፍ እንዴት እንደሚመነጭ እና በapproved custody ውስጥ እንደሚቀመጥ
4. ለaccount፣ authorized controller replacement ወይም social recovery አዲስ canonical `AccountId`ን እንዴት እንደሚፈጥር እና linked stateን እንዴት እንደሚያዘዋውር
5. ለnode ወይም peer፣ authorized on-chain consensus-key rotation ወይም disablement ከBLS PoP፣ activation and overlap policy፣ local key configuration፣ `trusted_peers_pop` እና deployment topology ጋር እንዴት እንደሚቀናጅ
6. Dependent configuration-ዎች፣ application-ዎች እና operator-ዎች አዲሱን `AccountId`፣ public key ወይም peer identity እንዴት እንደሚቀበሉ
7. የድሮው ቁልፍ authority እንዴት እንደሚወገድ እና ቅጂዎቹ እንዴት archive ወይም destroy እንደሚደረጉ
8. ከዚያ በኋላ network እና dependent application-ዎች እንዴት እንደሚረጋገጡ

::: warning

ምስጠራ ወይም አዲስ የይለፍ ቃል የተገለበጠውን የግል ቁልፍ እንደገና ደህንነቱ የተጠበቀ ማድረግ አይችልም። ተጋላጭነት ሲጠረጠር ቁልፉን መጠቀም ማቆም እና ተቀባይነት ያለው የመተካት ወይም የማስወገድ አሰራርን መከተል አለብዎት።

:::

ተመልከት [ምስጠራ ቁልፎችን ማመንጨት](./generating-cryptographic-keys.md), [የአሠራር ደህንነት](./operational-security.md), እና [የደህንነት መርሆዎች](./security-principles.md).
