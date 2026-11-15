---
translation_locale: am
translation_source: /reference/permissions.md
translation_source_hash: aedb5b658cde78dc7b169877c315cfb2ed860257dedb5b3b0bcfff8cc4f472a1
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# የፍቃድ ቶከኖች {#permission-tokens}

ይህ ገጽ አሁን ባለው Iroha አስፈፃሚ የውሂብ ሞዴል የተጋለጡትን ነባሪ የፍቃድ-ቶከን አይነቶችን ይዘረዝራል። ለሚናዎች እና ፈቃዶች ፅንሰ-ሀሳባዊ መመሪያ [ፈቃዶች](/am/blockchain/permissions.md) ይመልከቱ።

የፍቃድ ፍተሻዎች የሚተገበሩት በነቃ የሶፍትዌር ማስፈጸሚያ አካባቢ አረጋጋጭ ነው። ከታች ያሉት የቶከን አይነት ስሞች መደበኛውን የፖሊሲ ገጽታ ይገልጻሉ፣ ነገር ግን አውታረ መረብ አስፈፃሚውን በማሻሻል የሶፍትዌር ማስፈጸሚያ አካባቢ ማረጋገጫን ማበጀት ይችላል።

## ነባሪ ቶከኖች {#default-tokens}

|የፍቃድ ቶከን|ምድቦች|ቀዶ ጥገና|
| --- | --- | --- |
|`CanManagePeers`|የአውታረ መረብ አቻ|የአውታረ መረብ እኩዮችን ይመዝገቡ፣ ይመዝገቡ ወይም በሌላ መንገድ ያስተዳድሩ።|
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
|`CanMintAssetToAccount`|ንብረት|የተወሰነ የንብረት ቀሪ ሂሳብ ያውጡ።|
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
|`CanManageSmartContractCode`|ስማርት ውል|ያልተጠቀሱ የኮድ አርቲፋክቶችን ያስወግዱ እና የኮንትራት መግቢያ ነጥቦችን ውክልና ይስጡ። የተመዘገቡ መለያዎች ያለዚህ ፈቃድ የተረጋገጡ አርቲፋክቶችን መፍጠር ይችላሉ።|
| `CanManageFeeSponsorProgram` | SORA Nexus | የተወሰነው ስፖንሰር መለያ የሚያዝዛቸውን ፕሮግራሞች ማስተዳደር። |
| `CanEnrollFeeSponsorProgram` | SORA Nexus | የአንድ የተወሰነ ስፖንሰር ፕሮግራም ተጠቃሚዎችን ማስተዳደር። |

## ባለቤትነት {#ownership}

ባለቤት-ሚስጥራዊነት ያላቸው የፍቃድ ቶከኖች አሁን ባለው የውሂብ ሞዴል ጥቅም ላይ የሚውሉትን ነጠላ ፕሮቶኮል-መደበኛ የነገር መታወቂያዎችን ማመልከት አለባቸው። ለምሳሌ፣ የመለያ ፈቃዶች ነጠላን ያመለክታሉ ፕሮቶኮል-መደበኛ ጎራ አልባ መለያ መታወቂያዎች፣ የጎራ ፈቃዶች `domain.dataspace` የጎራ መታወቂያዎችን ያመለክታሉ፣ እና የንብረት ፈቃዶች ነጠላ ፕሮቶኮል-መደበኛ የንብረት ፍቺን ወይም የንብረት መታወቂያዎችን ያመለክታሉ።

ግብይቱ በፍቃድ ስህተት ሳይሳካ ሲቀር ሁለቱንም ወገኖች ያረጋግጡ -

- ግብይቱን የሚፈርመው መለያ የሚጠበቀው ነጠላ ፕሮቶኮል-መደበኛ መለያ ነው
- በመመሪያው ውስጥ ጥቅም ላይ ለዋለው ትክክለኛ የነገር መታወቂያ የፍቃድ ቶከን ወይም ሚና ተሰጥቷል
