---
translation_locale: am
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የፍቃድ ቶከኖች {#permission-tokens}

ይህ ገጽ አሁን ባለው Iroha አስፈፃሚ የውሂብ ሞዴል የተጋለጡትን ነባሪ የፍቃድ-ቶከን አይነቶችን ይዘረዝራል። ለሚናዎች እና ፈቃዶች ፅንሰ-ሀሳባዊ መመሪያ [ፈቃዶች](/am/blockchain/permissions.md) ይመልከቱ።

የፍቃድ ፍተሻዎች የሚተገበሩት በነቃ የሶፍትዌር ማስፈጸሚያ አካባቢ አረጋጋጭ ነው። ከታች ያሉት የቶከን አይነት ስሞች መደበኛውን የፖሊሲ ገጽታ ይገልጻሉ፣ ነገር ግን አውታረ መረብ አስፈፃሚውን በማሻሻል የሶፍትዌር ማስፈጸሚያ አካባቢ ማረጋገጫን ማበጀት ይችላል።

## ነባሪ ቶከኖች {#default-tokens}

|የፍቃድ ቶከን|ምድቦች|ቀዶ ጥገና|
| --- | --- | --- |
|`CanManagePeers`|የአውታረ መረብ አቻ|የአውታረ መረብ እኩዮችን ይመዝገቡ፣ ይመዝገቡ ወይም በሌላ መንገድ ያስተዳድሩ።|
|`CanManageLaneRelayEmergency`|የአውታረ መረብ አቻ|የአደጋ ጊዜ ሌይን-ማስተላለፊያ መቆጣጠሪያዎችን ያስተዳድሩ።|
|`CanRegisterDomain`|ጎራ|ጎራ ይመዝገቡ።|
|`CanUnregisterDomain`|ጎራ|ጎራ ይመዝገቡ።|
|`CanModifyDomainMetadata`|ጎራ|የጎራ ሜታዳታን አሻሽል።|
|`CanRegisterAccount`|መለያ|መለያ ያስመዝግቡ።|
|`CanUnregisterAccount`|መለያ|መለያ ይመዝገቡ።|
|`CanModifyAccountMetadata`|መለያ|የመለያ ሜታዳታ አሻሽል።|
|`CanUnregisterAssetDefinition`|የንብረት ፍቺ|የንብረት ፍቺን ይመዝግቡ።|
|`CanModifyAssetDefinitionMetadata`|የንብረት ፍቺ|የንብረት-ፍቺ ሜታዳታን ያስተካክሉ።|
|`CanMintAssetWithDefinition`|ንብረት|ለተወሰነ ፍቺ ንብረቶችን ያውጡ።|
|`CanBurnAssetWithDefinition`|ንብረት|ለተወሰነ ፍቺ ንብረቶችን ያጥፋሉ።|
|`CanTransferAssetWithDefinition`|ንብረት|ለተወሰነ ትርጉም ንብረቶችን ያስተላልፉ።|
|`CanMintAsset`|ንብረት|የተወሰነ የንብረት ቀሪ ሂሳብ ያውጡ።|
|`CanBurnAsset`|ንብረት|የተወሰነ የንብረት ቀሪ ሂሳብን ያጠፋል።|
|`CanTransferAsset`|ንብረት|የተወሰነ የንብረት ቀሪ ሂሳብ ያስተላልፉ።|
|`CanRegisterNft`|NFT|ይመዝገቡ NFT።|
|`CanUnregisterNft`|NFT|NFT ን ይምዝግቡ።|
|`CanTransferNft`|NFT|NFT ያስተላልፉ።|
|`CanModifyNftMetadata`|NFT|NFT ሜታዳታ አሻሽል።|
|`CanSetParameters`|መለኪያዎች|በሰንሰለት ላይ የማዋቀር መለኪያዎችን ያዘጋጁ።|
|`CanManageRoles`|ሚናዎች|ሚናዎችን ይመዝገቡ፣ ይመዝገቡ፣ ይስጡ ወይም ይሰርዙ።|
|`CanRegisterTrigger`|ቀስቅሴ|ቀስቅሴ ይመዝገቡ።|
|`CanExecuteTrigger`|ቀስቅሴ|ቀስቅሴ ያስፈጽሙ።|
|`CanUnregisterTrigger`|ቀስቅሴ|ቀስቅሴ ይመዝገቡ።|
|`CanModifyTrigger`|ቀስቅሴ|ቀስቅሴ ውቅረትን ያስተካክሉ።|
|`CanModifyTriggerMetadata`|ቀስቅሴ|ቀስቅሴ ሜታዳታን አሻሽል።|
|`CanUpgradeExecutor`|አስፈፃሚ|የሶፍትዌር ማስፈጸሚያ አካባቢ አስፈፃሚውን ያሻሽሉ።|
|`CanRegisterSmartContractCode`|ስማርት ውል|ብልጥ የኮንትራት ኮድ ይመዝገቡ።|
|`CanUseFeeSponsor`|Nexus|ለተወሰነ የስፖንሰር መለያ Nexus ክፍያዎችን ያስከፍሉ።|

## ባለቤትነት {#ownership}

ባለቤት-ሚስጥራዊነት ያላቸው የፍቃድ ቶከኖች አሁን ባለው የውሂብ ሞዴል ጥቅም ላይ የሚውሉትን ነጠላ ፕሮቶኮል-መደበኛ የነገር መታወቂያዎችን ማመልከት አለባቸው። ለምሳሌ፣ የመለያ ፈቃዶች ነጠላን ያመለክታሉ ፕሮቶኮል-መደበኛ ጎራ አልባ መለያ መታወቂያዎች፣ የጎራ ፈቃዶች `domain.dataspace` የጎራ መታወቂያዎችን ያመለክታሉ፣ እና የንብረት ፈቃዶች ነጠላ ፕሮቶኮል-መደበኛ የንብረት ፍቺን ወይም የንብረት መታወቂያዎችን ያመለክታሉ።

ግብይቱ በፍቃድ ስህተት ሳይሳካ ሲቀር ሁለቱንም ወገኖች ያረጋግጡ -

- ግብይቱን የሚፈርመው መለያ የሚጠበቀው ነጠላ ፕሮቶኮል-መደበኛ መለያ ነው
- በመመሪያው ውስጥ ጥቅም ላይ ለዋለው ትክክለኛ የነገር መታወቂያ የፍቃድ ቶከን ወይም ሚና ተሰጥቷል
