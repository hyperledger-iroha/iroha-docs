---
translation_locale: am
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የመፍቀድ ምልክት {#permission-tokens}

ይህ ገጽ የአሁኑን የተጋለጡ ነባሪ የመፈቃደሪያ ምልክቶች ዓይነቶችን ያቀርባል
Iroha ለተፈጻሚው የውሂብ ሞዴል.
ተመልከት [ፍቃዶች](/am/blockchain/permissions.md).

የፈቃድ ፍተሻዎች በሥራ ላይ በሚውለው የአሂድ ጊዜ ማረጋገጫ ይፈጸማሉ።
ከታች ያሉት ስሞች መደበኛ ፖሊሲ ገጽታን ይገልጻሉ ፣ ግን አውታረመረብ ማበጀት ይችላል
የሂደት ጊዜ ማረጋገጫ አስፈፃሚውን በማሻሻል።

## ነባሪ ምልክቶች {#default-tokens}

| የመፈቃደሪያ ምልክት | ምድብ | አሠራር |
| --- | --- | --- |
| `CanManagePeers` | እኩዮች | መመዝገብ፣ መዝጋት ወይም በእኩዮችን ማስተዳደር። |
| `CanManageLaneRelayEmergency` | እኩዮች | የድንገተኛ መንገድ-ሪሌይ መቆጣጠሪያዎችን ያስተዳድሩ. |
| `CanRegisterDomain` | ጎራ | ጎራ ይመዝገቡ። |
| `CanUnregisterDomain` | ጎራ | ጎራውን አስወግድ። |
| `CanModifyDomainMetadata` | ጎራ | የጎራ ሜታዳታዎችን ቀይር። |
| `CanRegisterAccount` | ሂሳብ | ሂሳብ ተመዝግቡ. |
| `CanUnregisterAccount` | ሂሳብ | ሂሳብን አስወግድ። |
| `CanModifyAccountMetadata` | ሂሳብ | የሂሳብ ሜታ መረጃዎችን ይለውጡ። |
| `CanUnregisterAssetDefinition` | የንብረት ትርጉም | የአክሲዮን መግለጫን አስወግድ። |
| `CanModifyAssetDefinitionMetadata` | የንብረት ትርጉም | የንብረት-ተወቺ ሜታዳታዎችን መለወጥ። |
| `CanMintAssetWithDefinition` | ንብረቶች | ለተወሰነ ፍቺ የኪራይ ሰብሳቢነት ሀብቶች። |
| `CanBurnAssetWithDefinition` | ንብረቶች | የተወሰነ ትርጉም ለማግኘት ንብረቶችን ያቃጥሉ። |
| `CanTransferAssetWithDefinition` | ንብረቶች | ለተወሰነ ፍቺ የተሰጡ ንብረቶችን ማስተላለፍ |
| `CanMintAsset` | ንብረቶች | የተወሰነ የንብረት ሚዛን አወጣ። |
| `CanBurnAsset` | ንብረቶች | የተወሰነ የንብረት ሚዛን ያቃጥሉ። |
| `CanTransferAsset` | ንብረቶች | የተወሰነ የንብረት ሚዛን ማስተላለፍ። |
| `CanRegisterNft` | NFT | መዝገብ NFT. |
| `CanUnregisterNft` | NFT | ምዝገባን ማስወገድ NFT. |
| `CanTransferNft` | NFT | ማስተላለፍ NFT. |
| `CanModifyNftMetadata` | NFT | ማስተካከል NFT ሜታዳታ። |
| `CanSetParameters` | መለኪያዎች | በሰንሰለት ላይ የቅንብብር መለኪያዎችን ያዘጋጁ። |
| `CanManageRoles` | ሚና | መዝገብ፣ መዝገብ ማስወገድ፣ ድርሻ መስጠት ወይም መሰረዝ። |
| `CanRegisterTrigger` | ማነቃቂያ | ማስነሻ አስመዝግቡ. |
| `CanExecuteTrigger` | ማነቃቂያ | አስነሳ። |
| `CanUnregisterTrigger` | ማነቃቂያ | ማስነሻውን አስወግድ. |
| `CanModifyTrigger` | ማነቃቂያ | የመነሻውን ውቅር ይለውጡ. |
| `CanModifyTriggerMetadata` | ማነቃቂያ | የመነሻ ሜታዳታዎችን ቀይር። |
| `CanUpgradeExecutor` | አስፈፃሚ | የሂደት ጊዜ አስፈፃሚ ማሻሻል. |
| `CanRegisterSmartContractCode` | ብልህ ውል | የስማርት ኮንትራት ኮድ ይመዝገቡ። |
| `CanUseFeeSponsor` | Nexus | ክፍያ Nexus ለተጠቀሰው ስፖንሰር መለያ የሚከፈልባቸው ክፍያዎች። |

## ባለቤትነት {#ownership}

ለባለቤትነት የሚጠቁሙ የመፈቃደሪያ ምልክቶች ወደ ቀኖናዊው ነገር ማጣቀሻ ሊኖራቸው ይገባል IDs ጥቅም ላይ የዋለው
ለምሳሌ ያህል፣ የመለያ ፈቃዶች ወደ ካኖኒካል
ጎራ የሌለው መለያ IDs, የጎራ ፍቃዶች `domain.dataspace` ጎራ
IDs, እና የአክሲዮን ፍቃዶች ወደ ቀኖናዊ የአክሲዮን ትርጉም ወይም ንብረት ያመለክታሉ IDs.

አንድ ግብይት በመፍቀድ ስህተት ሲከሽፍ, ሁለቱንም ወገኖች ያረጋግጡ:

- ግብይቱን የሚፈርመው አካውንት የሚጠበቀው የካኖኒክ አካውንት ነው
- ለትክክለኛው ነገር የተሰጠው ፈቃድ ምልክት ወይም ሚና ተሰጥቷል ID በ
  መመሪያ
