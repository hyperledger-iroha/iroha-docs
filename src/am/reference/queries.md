---
translation_locale: am
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ጥያቄዎች {#queries}

Iroha መጠይቆች መለያውን ሁኔታ ሳይቀይሩ ያነባሉ ። የአሁኑ የመረጃ ሞዴል ሁለት ሰፊ የጥያቄ ቅርጾችን ያሳያል-

- አንድን ነገር ወይም አንድ እሴት የሚመልሱ ነጠላ ጥያቄዎች
- የሚደጋገሙ መጠይቆች፣ አንድ ዥረት ወይም ስብስብ ይመልሳሉ እና መጠይቅ አይነት በሚደግፍበት ጊዜ ከማጣራት ፣ ከመደርደሪያ ፣ ከፕሮጀክሽን እና ከገጽ አሰጣጥ ጋር ሊዋሃዱ ይችላሉ።

የጥያቄዎችን ፖስታዎች በእጅ ከመገንባት ይልቅ SDK የተጻፉ ገንቢዎችን ወይም CLI ን ይጠቀሙ። ከታች ያሉት ስሞች በ `iroha_data_model::query` የተጋለጡ ወቅታዊ የጥያቄ ዓይነቶች ናቸው ።

## የስራ ሰዓት እና አወቃቀር {#runtime-and-configuration}

|ጥያቄ |ዓላማ|
| --- | --- |
|`FindAbiVersion` |ABI የተፈፀመውን ስሪት ይመልሱ። |
|`FindExecutorDataModel` |የአስፈጻሚው የውሂብ ሞዴል መግለጫን ይመልሱ። |
|`FindParameters` |ሰንሰለት ላይ አስፈፃሚ ውቅር መለኪያዎችን ይመልሱ. |

## ሂሳቦችና ፈቃዶች {#accounts-and-permissions}

|ጥያቄ |ዓላማ|
| --- | --- |
|`FindAccountById` |ID በካኖኒካል ሂሳብ አንድ መለያ ያግኙ። |
|`FindAccountByAlias` |የሂሳብ ስያሜን ለመፍታት.|
|`FindAccounts` |የተመዘገቡ ሂሳቦችን ጻፍ። |
|`FindAccountIds` |ዝርዝር የተመዘገበ ሂሳብ IDs። |
|`FindAccountsWithAsset` |የተወሰነ የንብረት ትርጉም ያላቸውን ሂሳቦች ይዘርዝሩ። |
|`FindAliasesByAccountId` |ከሂሳብ ጋር የተገናኙ ስያሜዎችን ጻፍ። |
|`FindAccountRecoveryPolicyByAlias` |የአስማት ስም ለማግኘት የማገገም ፖሊሲ ይፈልጉ። |
|`FindAccountRecoveryRequestByAlias` |የአስማት ስም ለማግኘት የማገገም ጥያቄ ያግኙ። |
|`FindRoles` |ዝርዝር ሚናዎች። |
|`FindRoleIds` |የዝርዝር ሚና IDs.|
|`FindRolesByAccountId` |ለሂሳብ የተሰጡትን ሚናዎች ይዘርዝሩ። |
|`FindPermissionsByAccountId` |ለሂሳብ የተሰጡ ፍቃዶችን ይዘርዝሩ። |

## የጎራዎች እና እኩዮች {#domains-and-peers}

|ጥያቄ |ዓላማ|
| --- | --- |
|`FindDomainById` |በ `DomainId` አንድ ጎራ ይፈልጉ።|
|`FindDomains` |የተመዘገቡ ጎራዎችን ይዘርዝሩ። |
|`FindDomainsByAccountId` |የአንድ መለያ ባለቤት የሆኑ ጎራዎችን ይዘርዝሩ። |
|`FindDomainEndorsements` |የጎራ ማረጋገጫ መዝገቦችን ጻፍ። |
|`FindDomainEndorsementPolicy` |የጎራ ማረጋገጫ ፖሊሲውን ይመልሱ። |
|`FindDomainCommittee` |የጎራ ኮሚቴውን መልሰህ ስጥ።|
|`FindPeers` |በመጽሐፉ ውስጥ የታወቁ ታማኝ እኩዮችን ጻፍ። |

## NFTs እና RWAs ያሉ ንብረቶች። {#assets-nfts-and-rwas}

|ጥያቄ |ዓላማ|
| --- | --- |
|`FindAssets` |የንብረት ቀረጻዎችን ጻፍ። |
|`FindAssetsDefinitions` |የአክሲዮን ትርጉሞችን ይዘርዝሩ። |
|`FindAssetsByAccountId` |በሂሳብ የተያዙ ንብረቶችን መዝገብ። |
|`FindAssetById` |በ `AssetId` ውስጥ አንድ የንብረት ቀሪውን ይፈልጉ። |
|`FindAssetDefinitionById` |በ ID ውስጥ አንድ የንብረት ትርጉም ይፈልጉ። |
|`FindNfts` |ዝርዝር NFTs.|
|`FindNftsByAccountId` |የሂሳብ ባለቤትነት ያለው ዝርዝር NFTs. |
|`FindRwas` |ዝርዝር የተመዘገቡ እውነተኛ ዓለም-አክሲዮን ዕቃዎች.|

## የኤስኮር እና የምስክር ወረቀቶች {#escrow-and-proof-records}

የኤስኮር መጠይቆች በ [አገር ውስጥ ሀብት ኤስኮር ISIs ](/am/blockchain/escrow.md) የተፈጠሩ መዝገቦችን ይመረምራሉ ፣ ይህም የገበያ ቦታ ኤስኮሮችን ፣ አጠቃላይ የአክሲዮን መቆለፊያዎችን እና ስም አልባ ኤስኮርን መዝገብን ያጠቃልላል ።

|ጥያቄ |ዓላማ|
| --- | --- |
|`FindAssetEscrows` |የዋጋ ማስከበሪያ መዝገቦችን ጻፍ። |
|`FindAssetEscrowById` |በ ID ውስጥ አንድ የንብረት ዋስትና ያግኙ። |
|`FindAssetEscrowsBySeller` |በሻጩ የተያዙትን ንብረቶች መዝገብ። |
|`FindAssetEscrowsByBuyer` |በገዢው የተያዙ ንብረቶችን መዝገብ። |
|`FindAssetEscrowsByStatus` |የዋጋ ማስከበሪያዎችን በደረጃው ይዘርዝሩ። |
|`FindAnonymousAssetEscrows` |የማይታወቁ የንብረት ማስከበሪያ መዝገቦችን ጻፍ። |
|`FindAnonymousAssetEscrowById` |በ ID በኩል አንድ ስም አልባ ንብረት ማስያዣ ያግኙ። |
|`FindAnonymousAssetEscrowsBySeller` |ስም አልባ የሆኑ የዋስትና ማረጋገጫዎችን በሸማች ዝርዝር ውስጥ ያስገቡ። |
|`FindAnonymousAssetEscrowsByBuyer` |ስም አልባ የሆኑ የዋስትና ማረጋገጫዎችን በገዢዎች ዝርዝር ውስጥ ያስገቡ። |
|`FindAnonymousAssetEscrowsByStatus` |ስማቸው ያልታወቀ የሆኑ የቁጠባ ባለቤቶችን በደረጃው ይዘርዝሩ። |
|`FindProofRecordById` |ID ውስጥ አንድ ማስረጃ መዝገብ ያግኙ.|
|`FindProofRecords` |የምስክር ወረቀቶችን ጻፍ።|
|`FindProofRecordsByBackend` |የዳሰሳ ጥናት መዝገቦችን ለዳሰሳ ድጋሜ ያዘጋጁ። |
|`FindProofRecordsByStatus` |የማረጋገጫ መዝገቦችን በደረጃዎች ተዘርዝሩ። |

## Nexus፣ የውሂብ ተደራሽነትና ጥቅሎች {#nexus-data-availability-and-packages}

|ጥያቄ |ዓላማ|
| --- | --- |
|`FindRepoAgreements` |በሰንሰለት ላይ የተከማቹ የመረጃ ቋት ስምምነቶችን ይዘርዝሩ።|
|`FindTwitterBindingByHash` |በሃሽ በኩል የትዊተር አገናኝን መፍታት። |
|`FindDaPinIntentByTicket` |በቲኬት በኩል የመረጃ ተደራሽነት ፒን ዓላማ ያግኙ። |
|`FindDaPinIntentByManifest` |በመግለጫ ማጣቀሻ አንድ ፒን ዓላማ ያግኙ።|
|`FindDaPinIntentByAlias` |በቅጽል ስያሜ የፒን ዕቅድ ያግኙ።|
|`FindDaPinIntentByLaneEpochSequence` |ከመንገድ፣ ዘመንና ቅደም ተከተል በመነሳት የፒን ዓላማ ይፈልጉ። |
|`FindLaneRelayEnvelopeByRef` |አንድ የተረጋገጠ የመንገድ-ሪሌይ ፖስታ ያግኙ.|
|`FindSorafsProviderOwner` |የ SoraFS አቅራቢ ባለቤት መፍትሄ። |
|`FindDataspaceNameOwnerById` |የውሂብ ቦታ ስም ባለቤት መፍታት. |
|`FindMusubiReleaseByRef` |የ Musubi መለቀቅ በመረጃ አማካኝነት ይፈልጉ። |
|`FindMusubiPackageVersions` |ለ Musubi ጥቅል ስሪቶችን ይዘርዝሩ። |
|`FindMusubiPackageReleases` |ለ Musubi ጥቅል የዝርዝር መግለጫዎች። |
|`FindMusubiShortAliasByName` |አንድ Musubi አጭር ቅጽል ስም መፍታት.|

## ተነሳሽነት፣ ውል፣ ግብይት እና ማገድ {#triggers-contracts-transactions-and-blocks}

|ጥያቄ |ዓላማ|
| --- | --- |
|`FindActiveTriggerIds` |አክቲቭ ማነቃቂያ IDs ይመዝገቡ። |
|`FindTriggers` |የዝርዝር ማስነሻዎች.|
|`FindTriggerById` |በ ID ውስጥ አንድ አስጀማሪ ያግኙ.|
|`FindContractManifestByCodeHash` |የስማርት ኮንትራት መገለጫን በኮድ ሃሽ ይፈልጉ።|
|`FindTransactions` |የተደራጁ ግብይቶች ዝርዝር። |
|`FindBlocks` |የዝርዝር ዕቃዎች።|
|`FindBlockHeaders` |የብሎክ ራስጌዎችን ይዘርዝሩ።|

## ማጣሪያ እና ገጾች {#filtering-and-pagination}

ተለዋዋጭ መጠይቆች የፕሬዲኬትን እና የመምረጥ ድጋፍ ሊጋለጡ ይችላሉ ። የጥያቄ-ተኮር የተጻፉ ማጣሪያዎችን ከ SDK ይጠቀሙ ፣ ስለሆነም የማጣሪያ ግብዓት ከጥያቄው የውጤት ዓይነት ጋር ይዛመዳል ። ለትላልቅ ውጤቶች ስብስቦች እያንዳንዱን ረድፍ በአንድ ጊዜ ከማምጣት ይልቅ እንደ ካርሰር እና ገደብ ያሉ የጥያቄ መለኪያዎችን ይጠቀሙ።
