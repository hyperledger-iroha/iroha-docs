---
translation_locale: am
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የፈቃድ ምልክቶች {#permission-tokens}

ይህ ገጽ የአሁኑ Iroha አስፈፃሚ የውሂብ ሞዴል የተጋለጡትን ነባሪ የፍቃድ-ትዕዛዝ አይነቶችን ያቀርባል ። ለድርሻዎች እና ፍቃዶች ፅንሰ-ሀሳብ መመሪያ ፣ [ፍቃዶችን](/am/blockchain/permissions.md) ይመልከቱ።

ፍቃድ ምርመራዎች በንቃት ሩጫ ጊዜ ማረጋገጫ ይተገበራሉ. ከዚህ በታች ያሉት የቲኮን አይነት ስሞች መደበኛ ፖሊሲ ወለልን ያብራራሉ, ነገር ግን አውታረ መረብ አስፈፃሚውን በማሻሻል የሩጫ ጊዜ ማረጋገጥን ሊበጅ ይችላል.

## ነባሪ ምልክቶች {#default-tokens}

|የፈቃድ ምልክት |ምድብ|እንቅስቃሴ |
| --- | --- | --- |
|`CanManagePeers` |እኩዮች |መመዝገብ፣ ማስመዝገብ ወይም በሌላ መንገድ የእኩዮችን ማስተዳደር። |
|`CanManageLaneRelayEmergency` |እኩዮች |የአስቸኳይ ጊዜ የመንገድ-ሪሌይ መቆጣጠሪያዎችን ያስተዳድሩ ።|
|`CanRegisterDomain` |ጎራ |አንድ ጎራ መመዝገብ.|
|`CanUnregisterDomain` |ጎራ |ጎራውን አስወግድ። |
|`CanModifyDomainMetadata` |ጎራ |የጎራ ሜታዳታዎችን ቀይር። |
|`CanRegisterAccount` |መለያ |ሂሳብ መመዝገብ። |
|`CanUnregisterAccount` |መለያ |ሂሳብን አስወግድ።|
|`CanModifyAccountMetadata` |መለያ |የሂሳብ ሜታ መረጃዎችን መቀየር። |
|`CanUnregisterAssetDefinition` |የንብረት ትርጉም |የአክሲዮን መግለጫን አስወግድ። |
|`CanModifyAssetDefinitionMetadata` |የንብረት ትርጉም |የንብረት ትርጓሜ ሜታዳታዎችን መቀየር። |
|`CanMintAssetWithDefinition` |ንብረቶች|ለትክክለኛ ትርጓሜ የተሰጡ የገንዘብ ምንዛሬዎች። |
|`CanBurnAssetWithDefinition` |ንብረቶች|ንብረቶችን ለአንድ የተወሰነ ትርጉም ያቃጥሉ።|
|`CanTransferAssetWithDefinition` |ንብረቶች|ንብረቶችን ለተወሰነ ፍቺ ማስተላለፍ። |
|`CanMintAsset` |ንብረቶች|አንድ የተወሰነ የንብረት ሚዛን አወጣ። |
|`CanBurnAsset` |ንብረቶች|የተወሰነ የንብረት ሚዛን ያቃጥሉ.|
|`CanTransferAsset` |ንብረቶች|የተወሰነ የንብረት ቀሪ ሂሳብ ማስተላለፍ |
|`CanRegisterNft` |NFT |አንድ NFT መመዝገብ።|
|`CanUnregisterNft` |NFT |የ NFT ምዝገባን ማስወገድ። |
|`CanTransferNft` |NFT |የ NFT ማስተላለፍ።|
|`CanModifyNftMetadata` |NFT |NFT ሜታዳታዎችን መለወጥ። |
|`CanSetParameters` |መለኪያዎች|በሰንሰለት ላይ ያሉ የቅንብብር መለኪያዎችን ያዘጋጁ። |
|`CanManageRoles` |ሚና |መመዝገብ፣ ማስመዝገብ፣ መስጠት ወይም መሰረዝ። |
|`CanRegisterTrigger` |ማነቃቂያ |ማስነሻ አስመዝግቡ.|
|`CanExecuteTrigger` |ማነቃቂያ |አስነሳ። |
|`CanUnregisterTrigger` |ማነቃቂያ |ማስነሻውን አስወግድ። |
|`CanModifyTrigger` |ማነቃቂያ |የመነሻውን ውቅር ቀይር። |
|`CanModifyTriggerMetadata` |ማነቃቂያ |የማስነቃቂያ ሜታዳታዎችን ቀይር። |
|`CanUpgradeExecutor` |አስፈፃሚ |የሂደት ጊዜ አስፈጻሚ ማሻሻል. |
|`CanRegisterSmartContractCode` |ብልህ ውል |የስማርት ኮንትራት ኮድ መመዝገብ። |
|`CanUseFeeSponsor` |Nexus |Nexus ክፍያዎች ለተጠቀሰው ስፖንሰር መለያ ይከፍላሉ ። |

## ባለቤትነት {#ownership}

የባለቤትነት-ስሜታዊ ፈቃድ ምልክቶች የአሁኑ የውሂብ ሞዴል የሚጠቀመውን የካኖኒካል ንጥረ ነገር IDs ማመልከት አለባቸው። ለምሳሌ ፣ የመለያ ፈቃዶች ወደ ካኖኒካዊ የጎራ የሌለው ሂሳብ IDs ፣ የጎራ ፈቃዶች ወደ `domain.dataspace` ጎራ IDs ያመለክታሉ ፣ እና የንብረቶች ፍቃዶች ወደ ቀኖናዊ የንብረት ትርጓሜ ወይም ንብረት IDs ያመለክታሉ።

አንድ ግብይት በፈቃድ ስህተት ሲከሽፍ, ሁለቱም ወገኖች ያረጋግጡ:

- ግብይቱን የሚፈርመው አካውንት የሚጠበቀው የካኖኒክ አካውንት ነው
- መመሪያው ውስጥ ለተጠቀሰው ትክክለኛ ነገር ID የተፈቀደለት ምልክት ወይም ሚና ተሰጠው
