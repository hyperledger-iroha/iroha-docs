---
translation_locale: am
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# አስጀምር Iroha 3 {#launch-iroha-3}

የስርዓቶችን ውህደት በግል አካባቢ ለመፈተሽ አራት የIroha 3 አረጋጋጮችን በአንድ የLinux ምናባዊ ማሽን (VM) ላይ ያስኪዱ። የተፈረመ ግብይት ይላኩ፣ አንድ አረጋጋጭ ያቁሙና የቀሩት ሦስቱ ሁለተኛውን ግብይት ማረጋገጣቸውን ይፈትሹ። በዚህ መንገድ ፈቃድ ላላቸው ብቻ የሚከፈት ራሱን የቻለ መዝገብ ይፈጠራል። ይህን መዝገብ እንደ የሚተዳደር የውሂብ ቦታ ከ SORA Nexus ጋር ለማገናኘት የተለየ ዝግጅት ያስፈልጋል።

## አዘጋጁ VM {#prepare-the-vm}

Linux x86_64 ን ከDocker Engine፣ Buildx፣ Compose v2፣ Python 3.8 ወይም ከዚያ የበለጠ አዲስ ስሪት፣ እና `unzip` ጋር ይጠቀሙ። መለያዎ Docker ን የመጠቀም ፈቃድ ይፈልጋል። ለመጀመሪያው ግንባታ ወደ GitHub፣ Docker Hub፣ የDebian ጥቅል መስታወት አገልጋዮች እና crates.io በHTTPS የመገናኘት አቅም ያስፈልጋል።

ጥቂት ሰው ሠራሽ ግብይቶችን በመጠቀም ኪቱን በ VM በስድስት ቪሲፒዩዎች እና 32 GiB RAM ገንብተን ሞክረናል። ለራስዎ የስራ ጫና እና የማቆያ ጊዜ የመጠን ማከማቻ። በ Docker ሞተር አንድ የኪት ቅጂ ይጠቀሙ እና የ loopback ወደቦች 18080-18083 እንዲገኙ ያድርጉ።

[ባለአራት-አረጋጋጭ ኪት ያውርዱ](/downloads/iroha-trade-poc.zip)። አስጀማሪውን፣ የተቆለፈ የጥገኝነት ዝርዝርን እና አረጋጋጩን እና ደንበኛውን ከተመሳሳይ የተሰካ Iroha ክለሳ ለመገንባት የሚያገለግሉ ጥገናዎችን ያካትታል። ማውረዱን ከያዘው ማውጫ ውስጥ ያረጋግጡ እና ይንቀሉት።

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## አራቱንም አረጋጋጮች ይጀምሩ እና ያረጋግጡ {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

ለመጀመሪያ ጊዜ ሲነሳ የኮንቴይነር ምስሉ ይገነባል። የሰንሰለቱ መታወቂያ፣ ቁልፎቹ እና የተፈረመው የመጀመሪያ ብሎክ በ VM ላይ ይፈጠራሉ። እያንዳንዱ አረጋጋጭ የራሱ ቋሚ ማከማቻ አለው። የሙከራ ፕሮግራሙ የሙከራ ግብይት ይፈርማል፤ አራቱም አረጋጋጮች እያንዳንዳቸው ከሦስት አቻዎች ጋር መገናኘታቸውንና የአዲሱ ብሎክ ሃሽ አንድ መሆኑን እስኪያሳውቁ ይጠብቃል። የመጀመሪያው ብሎክ የናሙና መለያዎችን ይዟል። ለሙከራ የተሠራ ውሂብ ይጠቀሙ፣ APIs በአካባቢያዊ loopback ብቻ እንዲደረስበት ያድርጉ።

የመጀመሪያውን አረጋጋጭ ሁኔታ ከ VM ለማንበብ JSON ን በግልፅ ይጠይቁ።

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## የማረጋገጫ ውድቀትን ይሞክሩ {#test-a-validator-failure}

```sh
python3 poc.py failover
```

ሙከራው አንድ አረጋጋጭ ያቆማል፣ አዲስ ግብይት ይልካል፣ የተረጋገጠውን ብሎክ ሃሽ በቀሩት ሦስት አረጋጋጮች ላይ ይፈትሻል። ከዚያም አራተኛውን አረጋጋጭ እንደገና አስነስቶ ያውን ብሎክ እስኪደርስ ይጠብቃል። VM ከተቋረጠ አራቱም ይቆማሉ። የማንኛውም አንድ አካላዊ አገልጋይ መቋረጥን ለመፈተሽ እያንዳንዱን አረጋጋጭ ከአራት ነጻ አገልጋዮች በአንዱ ላይ ያኑሩ።

## አቁም እና ከቆመበት ቀጥል {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

ሁለቱንም ትዕዛዞች ከተመሳሳይ የወጣ ማውጫ ያሂዱ። እንደገና የተጀመሩት አረጋጋጮች ተመሳሳይ የብሎክቼይን መዝገብ መክፈት እንዲችሉ የ`state/` ማውጫውን እና አራቱን Docker ጥራዞች አንድ ላይ ያቆዩት። ጅምር ከቆመ `python3 poc.py logs`ን እዚያ ያሂዱ።

## ይፋዊውን API የመጨረሻ ነጥብ ይሞክሩ {#try-the-public-endpoint}

መተግበሪያ ለመዝገቡ ምናባዊ ማሽን (VM) ሳያስኬድ በTaira ላይ ያለውን የ SORA Nexus ሁለንተናዊ የውሂብ ቦታ ማንበብ ይችላል። `curl` እና `jq` ከተጫነበት የሥራ ጣቢያ ይህን የንባብ ጥያቄ ወደ የሙከራ አውታረ መረብ ይላኩ።

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ምላሹ የተጠየቀውን ኖድ የተገናኙ የአውታረ መረብ እኩዮችን፣ የተጠናቀቁ ብሎኮችን፣ የጸደቁ ግብይቶችን እና ወረፋ ግብይቶችን ሪፖርት አድርጓል። ለማሰማራት እቅድ፣ [የአውታረ መረብ ማሰማራት](/am/guide/best-practices/network-deployment.md) ይመልከቱ።
