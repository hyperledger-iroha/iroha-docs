---
translation_locale: ur
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# اجازت ٹوکن {#permission-tokens}

اس صفحے پر موجودہ Iroha ایگزیکٹر ڈیٹا ماڈل کے ذریعہ ظاہر کردہ ڈیفالٹ اجازت ٹوکن کی اقسام کی فہرست ہے۔ کردار اور اجازتوں کی تصوراتی رہنمائی کے لئے ، [Permissions](/ur/blockchain/permissions.md) دیکھیں۔

اجازت کی جانچ پڑتال فعال رن ٹائم توثیق کنندہ کے ذریعہ نافذ کی جاتی ہے۔ ذیل میں ٹوکن ٹائپ نام معیاری پالیسی سطح کی وضاحت کرتے ہیں ، لیکن ایک نیٹ ورک ایگزیکٹر کو اپ گریڈ کرکے رن ٹائمز کی توثیق کو اپنی مرضی کے مطابق بنا سکتا ہے۔

## ڈیفالٹ ٹوکن {#default-tokens}

|اجازت ٹوکن |زمرہ |آپریشن |
| --- | --- | --- |
|`CanManagePeers` |نیٹ ورک نوڈ |رجسٹر، غیر رجسٹریشن، یا دوسری صورت میں نیٹ ورک نوڈز کا انتظام. |
|`CanManageLaneRelayEmergency` |نیٹ ورک نوڈ |ہنگامی لین ریلے کنٹرولز کا انتظام کریں. |
|`CanRegisterDomain` |ڈومین |ایک ڈومین رجسٹر. |
|`CanUnregisterDomain` |ڈومین |ایک ڈومین کو غیر رجسٹر کریں۔ |
|`CanModifyDomainMetadata` |ڈومین |ڈومین میٹا ڈیٹا میں ترمیم کریں۔ |
|`CanRegisterAccount` |اکاؤنٹ |ایک اکاؤنٹ رجسٹر. |
|`CanUnregisterAccount` |اکاؤنٹ |ایک اکاؤنٹ کو غیر رجسٹر. |
|`CanModifyAccountMetadata` |اکاؤنٹ |اکاؤنٹ کے میٹا ڈیٹا میں ترمیم کریں۔ |
|`CanUnregisterAssetDefinition` |اثاثہ جات کی تعریف |اثاثہ کی تعریف کو منسوخ کرنا۔ |
|`CanModifyAssetDefinitionMetadata` |اثاثہ جات کی تعریف |اثاثہ کی تعریف کے میٹا ڈیٹا میں ترمیم کریں۔ |
|`CanMintAssetWithDefinition` |اثاثہ |مخصوص تعریف کے لیے مائنٹ اثاثہ جات۔ |
|`CanBurnAssetWithDefinition` |اثاثہ |مخصوص تعریف کے لیے اثاثے جلا دیں۔ |
|`CanTransferAssetWithDefinition` |اثاثہ |ایک مخصوص تعریف کے لیے اثاثے منتقل کریں۔ |
|`CanMintAsset` |اثاثہ |ایک مخصوص اثاثہ بیلنس بنانا۔ |
|`CanBurnAsset` |اثاثہ |ایک مخصوص اثاثہ بیلنس جلانے. |
|`CanTransferAsset` |اثاثہ |ایک مخصوص اثاثہ بیلنس منتقل کریں۔ |
|`CanRegisterNft` |NFT |ایک NFT رجسٹر کریں۔ |
|`CanUnregisterNft` |NFT |NFT کو غیر رجسٹر کریں۔ |
|`CanTransferNft` |NFT |ایک NFT منتقل کریں۔ |
|`CanModifyNftMetadata` |NFT |NFT میٹا ڈیٹا میں ترمیم کریں۔ |
|`CanSetParameters` |پیرامیٹرز |چین پر ترتیب پیرامیٹرز مقرر کریں. |
|`CanManageRoles` |کردار |رجسٹر کریں، رجسٹر نہ کریں، کردار ادا کریں یا منسوخ کریں۔|
|`CanRegisterTrigger` |ٹرگر |ایک ٹرگر رجسٹر. |
|`CanExecuteTrigger` |ٹرگر |ایک ٹرگر انجام دیں. |
|`CanUnregisterTrigger` |ٹرگر |ایک ٹرگر غیر رجسٹر کریں. |
|`CanModifyTrigger` |ٹرگر |ٹرگر ترتیب کو تبدیل کریں. |
|`CanModifyTriggerMetadata` |ٹرگر |ٹرگر میٹا ڈیٹا تبدیل کریں. |
|`CanUpgradeExecutor` |کارروائی کرنے والا|رن ٹائم ایگزیکٹر کو اپ گریڈ کریں. |
|`CanRegisterSmartContractCode` |ہوشیار معاہدہ |سمارٹ معاہدے کا کوڈ درج کریں. |
|`CanUseFeeSponsor` |Nexus |ایک مخصوص اسپانسر اکاؤنٹ پر Nexus فیس وصول کریں۔ |

## ملکیت {#ownership}

مالک کے حساس اجازت ٹوکنز کو موجودہ ڈیٹا ماڈل میں استعمال ہونے والے کینیکل آبجیکٹ IDs کا حوالہ دینا چاہئے۔ مثال کے طور پر ، اکاؤنٹ کی اجازتیں کینیکل ڈومینلیس اکاؤنٹ IDs سے مراد ہیں ، ڈومین کی اجازتیں `domain.dataspace` ڈومین IDs سے مراد ہیں۔ اور اثاثوں کی اجازت نامے سے مراد اثاثوں یا اثاثوں IDs کی کینونیکل تعریف ہے.

جب ایک ٹرانزیکشن اجازت کی خرابی کے ساتھ ناکام ہوجاتی ہے تو، دونوں اطراف کی تصدیق کریں:

- ٹرانزیکشن پر دستخط کرنے والا اکاؤنٹ متوقع کینونیکل اکاؤنٹ ہے
- ہدایات میں استعمال ہونے والے عین مطابق اعتراض ID کے لئے اجازت کا ٹوکن یا کردار دیا گیا تھا۔
