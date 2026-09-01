---
translation_locale: am
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# መጠይቆች {#queries}

Iroha መጠይቆች የብሎክቼይን መዝገብ ሁኔታን ሳይቀይሩ ያነባሉ። አሁን ያለው የውሂብ ሞዴል ሁለት ዋና ዋና የመጠይቅ ዓይነቶችን ያቀርባል -

- ነጠላ ጥያቄዎች፣ አንድ እቃ ወይም አንድ ዋጋ የሚመልሱ
- ሊደጋገሙ የሚችሉ መጠይቆች፣ ዥረት ወይም ስብስብ የሚመልሱ እና የመጠይቁ አይነት ከሚደግፈው ከማጣራት፣ ከመደርደር፣ ከትንበያ እና ከገጽ ጋር ሊጣመሩ ይችላሉ።

የመጠይቅ ውሂብ መያዣዎችን በእጅ ከመገንባት ይልቅ SDK የተተየቡ ግንበኞችን ወይም CLI ን ይጠቀሙ። ከታች ያሉት ስሞች በ`iroha_data_model::query` የተጋለጡ ወቅታዊ የመጠይቅ ዓይነቶች ናቸው።

## የሶፍትዌር ማስፈጸሚያ አካባቢ እና ውቅር {#runtime-and-configuration}

|መጠይቅ|ዓላማ|
| --- | --- |
|`FindAbiVersion`|አስፈፃሚውን ABI ስሪት ይመልሱ።|
|`FindExecutorDataModel`|የአስፈፃሚውን የውሂብ-ሞዴል መግለጫ ይመልሱ።|
|`FindParameters`|በሰንሰለት አስፈፃሚ ውቅር መለኪያዎችን ይመልሱ።|

## መለያዎች እና ፈቃዶች {#accounts-and-permissions}

|መጠይቅ|ዓላማ|
| --- | --- |
|`FindAccountById`|አንድ መለያ በአንድ ፕሮቶኮል-መደበኛ መለያ መታወቂያ ያግኙ።|
|`FindAccountByAlias`|የመለያ ተለዋጭ ስም ወደ መለያ ይፍቱ።|
|`FindAccounts`|የተመዘገቡ መለያዎችን ይዘርዝሩ ።|
|`FindAccountIds`|የተመዘገቡ መለያ መታወቂያዎችን ይዘርዝሩ።|
|`FindAccountsWithAsset`|የተሰጠውን የንብረት ፍቺ የያዙ መለያዎችን ይዘርዝሩ።|
|`FindAliasesByAccountId`|ከመለያ ጋር የተሳሰሩ ተለዋጭ ስሞችን ይዘርዝሩ።|
|`FindAccountRecoveryPolicyByAlias`|ለተለዋጭ ስም የመልሶ ማግኛ ፖሊሲን ያግኙ።|
|`FindAccountRecoveryRequestByAlias`|ለተለዋጭ ስም የመልሶ ማግኛ ጥያቄን ያግኙ።|
|`FindRoles`|ሚናዎችን ይዘርዝሩ።|
|`FindRoleIds`|የሚና መታወቂያዎችን ይዘርዝሩ።|
|`FindRolesByAccountId`|ለመለያ የተሰጡ ሚናዎችን ይዘርዝሩ።|
|`FindPermissionsByAccountId`|ለመለያ የተሰጡ ፈቃዶችን ይዘርዝሩ።|

## ጎራዎች እና የአውታረ መረብ እኩዮች {#domains-and-peers}

|መጠይቅ|ዓላማ|
| --- | --- |
|`FindDomainById`|አንድ ጎራ በ `DomainId` ያግኙ።|
|`FindDomains`|የተመዘገቡ ጎራዎችን ይዘርዝሩ።|
|`FindDomainsByAccountId`|በመለያ ባለቤትነት የተያዙትን ጎራዎች ይዘርዝሩ።|
|`FindDomainEndorsements`|የጎራ ድጋፍ መዝገቦችን ይዘርዝሩ።|
|`FindDomainEndorsementPolicy`|የጎራ ድጋፍ ፖሊሲውን ይመልሱ።|
|`FindDomainCommittee`|የጎራ ኮሚቴውን ይመልሱ።|
|`FindPeers`|በብሎክቼይን መዝገብ የሚታወቁ የታመኑ የአውታረ መረብ እኩዮችን ይዘርዝሩ።|

## ንብረቶች፣ NFTs፣ እና RWAs {#assets-nfts-and-rwas}

|መጠይቅ|ዓላማ|
| --- | --- |
|`FindAssets`|የንብረት ቀሪ ሂሳቦችን ይዘርዝሩ።|
|`FindAssetsDefinitions`|የንብረት ትርጓሜዎችን ይዘርዝሩ።|
|`FindAssetsByAccountId`|በመለያ የተያዙ ንብረቶችን ይዘርዝሩ።|
|`FindAssetById`|አንድ የንብረት ቀሪ ሂሳብ በ `AssetId` ያግኙ።|
|`FindAssetDefinitionById`|አንድ ያግኙ የንብረት ፍቺ በመታወቂያ.|
|`FindNfts`|ዝርዝር NFTs።|
|`FindNftsByAccountId`|በመለያ ባለቤትነት የተያዘው NFTs ይዘረዝሩ።|
|`FindRwas`|የተመዘገቡ የገሃዱ ዓለም የንብረት ዕጣዎችን ይዘርዝሩ።|

## Escrow እና የማረጋገጫ መዝገቦች {#escrow-and-proof-records}

የ Escrow መጠይቆች በ[ቤተኛ የንብረት ማስያዣ ISIs](/am/blockchain/escrow.md) የተፈጠሩ መዝገቦችን ይመረምራሉ፣ የገበያ ቦታ ማስያዣዎችን፣ አጠቃላይ የንብረት መቆለፊያዎችን እና ማንነታቸው ያልታወቁ የማስያዣ መዝገቦችን ጨምሮ።

|መጠይቅ|ዓላማ|
| --- | --- |
|`FindAssetEscrows`|የንብረት ማስያዣ መዝገቦችን ይዘርዝሩ።|
|`FindAssetEscrowById`|አንዱን ያግኙ የንብረት ማስያዣ በመታወቂያ.|
|`FindAssetEscrowsBySeller`|የንብረት ማስያዣዎችን በሻጭ ይዘርዝሩ።|
|`FindAssetEscrowsByBuyer`|የንብረት ማስያዣዎችን በገዢ ይዘርዝሩ።|
|`FindAssetEscrowsByStatus`|የንብረት ማስያዣዎችን በሁኔታ ይዘርዝሩ።|
|`FindAnonymousAssetEscrows`|ማንነታቸው ያልታወቁ የንብረት ማስያዣ መዝገቦችን ይዘርዝሩ።|
|`FindAnonymousAssetEscrowById`|አንድ ስም-አልባ የንብረት ማስያዣ በ መታወቂያ.|
|`FindAnonymousAssetEscrowsBySeller`|በሻጭ የማይታወቁ escrows ይዘርዝሩ።|
|`FindAnonymousAssetEscrowsByBuyer`|በገዢ የማይታወቁ escrows ይዘርዝሩ።|
|`FindAnonymousAssetEscrowsByStatus`|ማንነታቸው ያልታወቁ escrows በሁኔታ ይዘርዝሩ።|
|`FindProofRecordById`|አንድ የማረጋገጫ መዝገብ በ መታወቂያ.|
|`FindProofRecords`|የማረጋገጫ መዝገቦችን ይዘርዝሩ።|
|`FindProofRecordsByBackend`|ለማረጋገጫ ጀርባ የማረጋገጫ መዝገቦችን ይዘርዝሩ።|
|`FindProofRecordsByStatus`|የማረጋገጫ መዝገቦችን በሁኔታ ይዘርዝሩ።|

## Nexus፣ የውሂብ ተገኝነት እና ጥቅሎች {#nexus-data-availability-and-packages}

|መጠይቅ|ዓላማ|
| --- | --- |
|`FindRepoAgreements`|በሰንሰለት ላይ የተከማቹ የማከማቻ ስምምነቶችን ይዘርዝሩ።|
|`FindTwitterBindingByHash`|የትዊተር ማሰሪያን በምስጠራ ሃሽ ይፍቱ።|
|`FindDaPinIntentByTicket`|በቲኬት የውሂብ ተገኝነት ፒን ዓላማ ያግኙ።|
|`FindDaPinIntentByManifest`|በቴክኒካል አንጸባራቂ ማጣቀሻ የፒን ዓላማን ያግኙ።|
|`FindDaPinIntentByAlias`|በተለዋጭ ስም የፒን ዓላማን ያግኙ።|
|`FindDaPinIntentByLaneEpochSequence`|በማስፈጸሚያ መስመር፣ ዘመን እና ቅደም ተከተል የፒን ዓላማን ያግኙ።|
|`FindLaneRelayEnvelopeByRef`|የተረጋገጠ የሌይን-ማስተላለፊያ ውሂብ መያዣ ያግኙ።|
|`FindSorafsProviderOwner`|የ SoraFS አቅራቢውን ባለቤት ይፍቱ።|
|`FindDataspaceNameOwnerById`|የውሂብ ቦታ-ስም ባለቤትን ይፍቱ።|
|`FindMusubiExactPackageV1`|አንድ ትክክለኛ የጥቅል መዝገብ እና የአሁኑን ክለሳዎች ያንብቡ።|
|`FindMusubiExactReleaseV1`|አንድ ትክክለኛ የመልቀቂያ ቅጽበታዊ ገጽ እይታን ያንብቡ።|
|`FindMusubiProviderBundleAttestationV1`|የአንድ አቅራቢን ማህደር-ጥቅል ማረጋገጫ ያንብቡ።|
|`FindMusubiResolverIndexV1`|የተጠናቀቀውን የመፍትሄ መረጃ ጠቋሚ ገጽ ያድርጉ።|
|`FindMusubiVersionsV1`|ለአንድ ጥቅል ገጽ የተጠናቀቁ ስሪቶች።|
|`FindMusubiMaintainersV1`|ገጽ ተቀብሏል ጠባቂዎች እና በመጠባበቅ ላይ ያሉ ግብዣዎች።|
|`FindMusubiArchiveLocationsV1`|ገጽ ተጠናቅቋል SoraFS ቦታዎች ለአንድ ማህደር.|
|`FindMusubiArchiveRetentionV1`|የገጽ ማህደር-ማቆያ መዝገቦች.|
|`FindMusubiAliasV1`|የአሁኑን ኢላማ እና የአለምአቀፍ ተለዋጭ ስም ክለሳ ያንብቡ።|
|`FindMusubiAliasHistoryV1`|የአለምአቀፍ ተለዋጭ ስም የማይለወጥ ዳግም ኢላማ ታሪክን ገጽ ገጽ።|
|`FindMusubiOrderedPrefixV1`|በአንድ የታዘዘ መዋቅራዊ ቅድመ ቅጥያ ስር የገጽ ጥቅሎች።|

## ቀስቅሴዎች፣ ኮንትራቶች፣ ግብይቶች እና ብሎኮች {#triggers-contracts-transactions-and-blocks}

|መጠይቅ|ዓላማ|
| --- | --- |
|`FindActiveTriggerIds`|ንቁ ቀስቅሴ መታወቂያዎችን ይዘርዝሩ።|
|`FindTriggers`|ቀስቅሴዎችን ይዘርዝሩ።|
|`FindTriggerById`|አንዱን ያግኙ ቀስቅሴ በመታወቂያ.|
|`FindContractManifestByCodeHash`|ስማርት-ኮንትራት ቴክኒካል ማኒፌስት በኮድ ምስጠራ ሃሽ ያግኙ።|
|`FindTransactions`|የተጠናቀቁ ግብይቶችን ይዘርዝሩ።|
|`FindBlocks`|ብሎኮችን ይዘርዝሩ።|
|`FindBlockHeaders`|የብሎክ ራስጌዎችን ይዘርዝሩ።|

## ማጣራት እና አምልኮ {#filtering-and-pagination}

ሊደጋገሙ የሚችሉ መጠይቆች ቅድመ -ተባይ እና መራጭ ድጋፍን ሊያጋልጡ ይችላሉ። የማጣሪያው ግቤት ከጥያቄው ውፅዓት አይነት ጋር እንዲዛመድ ከ SDK በጥያቄ ላይ የተተየቡ ማጣሪያዎችን ይጠቀሙ። ለትልቅ የውጤት ስብስቦች እያንዳንዱን ረድፍ በአንድ ጊዜ ከማምጣት ይልቅ እንደ ጠቋሚ እና ገደብ ያሉ የመጠይቅ መለኪያዎችን ይጠቀሙ።
