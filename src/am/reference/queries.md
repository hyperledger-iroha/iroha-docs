---
translation_locale: am
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ጥያቄዎች {#queries}

Iroha የአሁኑ የውሂብ ሞዴል
ሁለት ሰፊ የጥያቄ ቅርጾችን ያጋልጣል-

- **ነጠላ ጥያቄዎች**, አንድ ነገር ወይም አንድ እሴት የሚመልሱ
- **ተደጋጋሚ ጥያቄዎች**, አንድ ጅረት ወይም ስብስብ የሚመልሱ እና ሊዋሃዱ የሚችሉ
  መጠይቅ አይነት ጋር በማጣራት, ማ sorting, ፕሮጀክት, እና pagination
  ይደግፋል

አጠቃቀም SDK የተጻፉ ገንቢዎች ወይም CLI መጠይቅ ፖስታዎችን ከመገንባት ይልቅ
የሚከተሉት ስሞች በ
`iroha_data_model::query`.

## የስራ ሰዓት እና አወቃቀር {#runtime-and-configuration}

| ጥያቄ | ዓላማ |
| --- | --- |
| `FindAbiVersion` | አስፈፃሚውን መልሱ ABI ስሪት. |
| `FindExecutorDataModel` | አስፈፃሚ መረጃ ሞዴል መግለጫን ይመልሱ. |
| `FindParameters` | ሰንሰለት ላይ አስፈፃሚ ውቅር መለኪያዎችን ይመልሱ. |

## ሂሳቦችና ፈቃዶች {#accounts-and-permissions}

| ጥያቄ | ዓላማ |
| --- | --- |
| `FindAccountById` | አንድን ታሪክ በካኖኒክ ዘገባ ይፈልጉ ID. |
| `FindAccountByAlias` | የሂሳብ ስያሜን ለመፍታት. |
| `FindAccounts` | የተመዘገቡትን ሂሳቦች ጻፍ። |
| `FindAccountIds` | ዝርዝር የተመዘገበ ሂሳብ IDs. |
| `FindAccountsWithAsset` | የተወሰነ የንብረት ማብራሪያ የሚይዙትን ሂሳቦች ይዘርዝሩ። |
| `FindAliasesByAccountId` | ከአንድ መለያ ጋር የተያያዙ ስሞች ይዘርዝሩ። |
| `FindAccountRecoveryPolicyByAlias` | የአስማት ስም መልሶ ማግኛ ፖሊሲን ያግኙ። |
| `FindAccountRecoveryRequestByAlias` | የስም ማመልከቻ ጥያቄን ያግኙ. |
| `FindRoles` | የዝርዝር ሚናዎች። |
| `FindRoleIds` | የዝርዝር ሚና IDs. |
| `FindRolesByAccountId` | ለሂሳብ የተሰጡትን ሚናዎች ይዘርዝሩ። |
| `FindPermissionsByAccountId` | ለአንድ መለያ የተሰጡ ፍቃዶችን ይዘርዝሩ። |

## ጎራዎች እና እኩዮች {#domains-and-peers}

| ጥያቄ | ዓላማ |
| --- | --- |
| `FindDomainById` | አንድ ጎራ ለማግኘት `DomainId`. |
| `FindDomains` | የተመዘገቡ ጎራዎችን ጻፍ። |
| `FindDomainsByAccountId` | በሂሳብ የተያዙ ጎራዎችን ይዘርዝሩ። |
| `FindDomainEndorsements` | የጎራ ማረጋገጫ መዝገቦችን ጻፍ። |
| `FindDomainEndorsementPolicy` | የጎራ ማረጋገጫ ፖሊሲውን መልሰው ይስጡ. |
| `FindDomainCommittee` | የጎራ ኮሚቴውን መልሰህ ስጠው። |
| `FindPeers` | በመጽሐፍ ቅዱስ ውስጥ የታወቁ ታማኝ እኩዮችን ጻፍ። |

## ንብረቶች NFTs, እና RWAs {#assets-nfts-and-rwas}

| ጥያቄ | ዓላማ |
| --- | --- |
| `FindAssets` | የንብረቶችን ቀሪ ሂሳብ ያዘጋጁ። |
| `FindAssetsDefinitions` | የአክሲዮን ትርጉሞችን ይዘርዝሩ። |
| `FindAssetsByAccountId` | በሂሳብ የተያዙ ንብረቶችን መዝገብ። |
| `FindAssetById` | አንድ ንብረቶች ሚዛን ለማግኘት `AssetId`. |
| `FindAssetDefinitionById` | አንድ የንብረት ትርጉም ለማግኘት ID. |
| `FindNfts` | ዝርዝር NFTs. |
| `FindNftsByAccountId` | ዝርዝር NFTs በሂሳብ ባለቤትነት የተያዘ። |
| `FindRwas` | ዝርዝር የተመዘገቡት እውነተኛ ዓለም-አክሲዮኖች. |

## የኤስኮር እና የማረጋገጫ መዛግብት {#escrow-and-proof-records}

የኤስኮር መጠይቆች በ
[የአገሬው ንብረት ኤስኮር ISIs](/am/blockchain/escrow.md), የገበያ ቦታን ጨምሮ
ዋስትናዎች፣ አጠቃላይ የንብረት መቆለፊያዎች እና የማይታወቁ የዋስትና መዝገቦች።

| ጥያቄ | ዓላማ |
| --- | --- |
| `FindAssetEscrows` | የንብረቶችን መዝገብ አዘጋጅ። |
| `FindAssetEscrowById` | አንድን የዋጋ ማስከበሪያ ለማግኘት ID. |
| `FindAssetEscrowsBySeller` | የሽያጩን ንብረቶች መዝገብ ይዘርዝሩ። |
| `FindAssetEscrowsByBuyer` | የገዢው የዋጋ ማስከበሪያዎችን ይዘርዝሩ። |
| `FindAssetEscrowsByStatus` | የዋጋ ማስከበሪያዎችን በደረጃዎች ይዘርዝሩ። |
| `FindAnonymousAssetEscrows` | ስም አልባ የሆኑ የንብረት መዝገቦችን ይዘርዝሩ። |
| `FindAnonymousAssetEscrowById` | አንድ ስም አልባ ንብረት ማስከበሪያ ለማግኘት ID. |
| `FindAnonymousAssetEscrowsBySeller` | ስም አልባ የሆኑ የዋስትና ማረጋገጫዎችን በሸማች ዝርዝር ውስጥ ያስገቡ። |
| `FindAnonymousAssetEscrowsByBuyer` | ስም አልባ የሆኑ የዋስትና ማረጋገጫዎችን በገዢዎች ዝርዝር ውስጥ ያስገቡ። |
| `FindAnonymousAssetEscrowsByStatus` | ስም አልባ የሆኑትን የዋስትና ባለቤቶች በደረጃዎቻቸው ዝርዝር ውስጥ ያስገቡ። |
| `FindProofRecordById` | አንድ ማስረጃ መዝገብ ለማግኘት ID. |
| `FindProofRecords` | የመረጃ መዝገቦችን ጻፍ። |
| `FindProofRecordsByBackend` | ለሙከራ ዳግም ፍለጋ የማረጋገጫ መዝገቦችን ይዘርዝሩ. |
| `FindProofRecordsByStatus` | የመረጃውን መዝገብ በደረጃው ይዘርዝሩ። |

## Nexus, የመረጃ ተደራሽነት እና ጥቅሎች {#nexus-data-availability-and-packages}

| ጥያቄ | ዓላማ |
| --- | --- |
| `FindRepoAgreements` | በሰንሰለት ላይ የተከማቹ የመረጃ ቋት ስምምነቶችን ይዘርዝሩ። |
| `FindTwitterBindingByHash` | በትዊተር ላይ የተደረገውን ትስስር በሃሽ መፍታት። |
| `FindDaPinIntentByTicket` | በቲኬት መሠረት የመረጃ ተደራሽነት ፒን ዕቅድ ያግኙ። |
| `FindDaPinIntentByManifest` | በግልጽ በማጣቀሻ በኩል የፒን ዓላማን ፈልግ። |
| `FindDaPinIntentByAlias` | የአስማት ስያሜውን ለማግኘት። |
| `FindDaPinIntentByLaneEpochSequence` | በመንገድ፣ በዘመናትና በተከታታይ የፒን ዓላማ ይፈልጉ። |
| `FindLaneRelayEnvelopeByRef` | የተረጋገጠ የመንገድ-ሪሌይ ፖስታ ያግኙ. |
| `FindSorafsProviderOwner` | ባለቤቱን ለመፍታት SoraFS አቅራቢ. |
| `FindDataspaceNameOwnerById` | የውሂብ ቦታ ስም ባለቤት መፍታት. |
| `FindMusubiReleaseByRef` | አንድ ያግኙ Musubi በመጥቀስ ይለቀቃል። |
| `FindMusubiPackageVersions` | የዝርዝር ስሪቶች Musubi ፓኬጅ። |
| `FindMusubiPackageReleases` | የዝርዝሮች ለ Musubi ፓኬጅ። |
| `FindMusubiShortAliasByName` | አንድ መፍትሔ Musubi አጭር ቅጽል ስሞች። |

## ማስነሳት፣ ውል፣ ግብይት እና ማገድ {#triggers-contracts-transactions-and-blocks}

| ጥያቄ | ዓላማ |
| --- | --- |
| `FindActiveTriggerIds` | አክቲቭ ማነቃቂያ ይዘርዝሩ IDs. |
| `FindTriggers` | የዝርዝር አስነሳሾች. |
| `FindTriggerById` | አንድ ማስነሻ ለማግኘት ID. |
| `FindContractManifestByCodeHash` | የስማርት ኮንትራት ማንፊስት በኮድ ሃሽ ይፈልጉ። |
| `FindTransactions` | የተዋቀሩ ግብይቶች ዝርዝር። |
| `FindBlocks` | የዝርዝሮች ብሎኮች. |
| `FindBlockHeaders` | የብሎክ ራስጌዎችን ይዘርዝሩ። |

## ማጣሪያ እና ገጽ ማውጣት {#filtering-and-pagination}

ሊለጠፉ የሚችሉ መጠይቆች የፕሪካድ እና የመምረጥ ድጋፍ ሊያጋልጡ ይችላሉ
ከታዩት ማጣሪያዎች SDK ስለዚህ የማጣሪያ ግብዓት ጥያቄ ውፅዓት አይነት ጋር ይዛመዳል.
ለትላልቅ ውጤት ስብስቦች እንደ ካርሰር እና ገደብ ያሉ የጥያቄ መለኪያዎችን ይጠቀሙ
እያንዳንዱን ረድፍ በአንድ ጊዜ ማምጣት።
