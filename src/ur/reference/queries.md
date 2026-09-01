---
translation_locale: ur
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# استفسارات {#queries}

Iroha استفسارات لیجر کی حالت کو تبدیل کیے بغیر پڑھتے ہیں۔ موجودہ ڈیٹا ماڈل دو وسیع استفسار شکلوں کا پتہ چلتا ہے:

- singular queries، جو ایک اعتراض یا ایک قدر واپس کرتے ہیں
- iterable queries، جو ایک سٹریم یا مجموعہ واپس کرتے ہیں اور فلٹرنگ، ترتیب، پروجیکشن، اور صفحہ بstream کے ساتھ مل کر کیا جا سکتا ہے جہاں استفسار کی قسم اس کی حمایت کرتا

دستی طور پر استفسار لفافے بنانے کے بجائے SDK ٹائپڈ بلڈرز یا CLI استعمال کریں۔ ذیل میں دیئے گئے نام `iroha_data_model::query` کی طرف سے سامنے آنے والے موجودہ استفسار کی اقسام ہیں۔

## چلانے کا وقت اور ترتیب {#runtime-and-configuration}

|استفسار |مقصد |
| --- | --- |
|`FindAbiVersion` |عمل درآمد کا ABI ورژن واپس کریں۔ |
|`FindExecutorDataModel` |عملدرآمد کرنے والے ڈیٹا ماڈل کی تفصیل واپس کریں۔ |
|`FindParameters` |چین پر عملدرآمد کنفیگریشن پیرامیٹرز واپس کریں. |

## اکاؤنٹس اور اجازت نامے {#accounts-and-permissions}

|استفسار |مقصد |
| --- | --- |
|`FindAccountById` |ID کے مطابق ایک اکاؤنٹ تلاش کریں۔ |
|`FindAccountByAlias` |ایک اکاؤنٹ کے نام سے ایک اکاؤنٹ کو حل کریں۔ |
|`FindAccounts` |رجسٹرڈ اکاؤنٹس کی فہرست بنائیں۔ |
|`FindAccountIds` |فہرست رجسٹرڈ اکاؤنٹ IDs. |
|`FindAccountsWithAsset` |ایسے اکاؤنٹس کی فہرست بنائیں جن میں ایک مخصوص اثاثہ تعریف موجود ہو۔ |
|`FindAliasesByAccountId` |کسی اکاؤنٹ سے منسلک ناموں کی فہرست بنائیں۔ |
|`FindAccountRecoveryPolicyByAlias` |ایک عرفی کے لئے وصولی کی پالیسی تلاش کریں. |
|`FindAccountRecoveryRequestByAlias` |ایک عرفی کے لئے وصولی کی درخواست تلاش کریں. |
|`FindRoles` |فہرست کے کردار. |
|`FindRoleIds` |فہرست کا کردار IDs. |
|`FindRolesByAccountId` |ایک اکاؤنٹ کو دیئے گئے کردار کی فہرست دیں۔ |
|`FindPermissionsByAccountId` |کسی اکاؤنٹ کو دی جانے والی اجازتوں کی فہرست بنائیں۔ |

## ڈومینز اور نیٹ ورک نوڈ {#domains-and-peers}

|استفسار |مقصد |
| --- | --- |
|`FindDomainById` |`DomainId` سے ایک ڈومین تلاش کریں. |
|`FindDomains` |رجسٹرڈ ڈومینز کی فہرست بنائیں۔ |
|`FindDomainsByAccountId` |کسی اکاؤنٹ کی ملکیت والے ڈومینز کو درج کریں۔ |
|`FindDomainEndorsements` |ڈومین کی منظوری کے ریکارڈ درج کریں۔ |
|`FindDomainEndorsementPolicy` |ڈومین کی منظوری کی پالیسی واپس کریں۔ |
|`FindDomainCommittee` |ڈومین کمیٹی واپس. |
|`FindPeers` |ان قابلِ اعتماد peers کی فہرست دیں جو رجسٹر کو معلوم ہیں۔ |

## اثاثہ جات، NFTs، اور RWAs {#assets-nfts-and-rwas}

|استفسار |مقصد |
| --- | --- |
|`FindAssets` |اثاثوں کے بیلنس درج کریں۔ |
|`FindAssetsDefinitions` |اثاثہ جات کی تعریفیں درج کریں۔ |
|`FindAssetsByAccountId` |ایک اکاؤنٹ کے ذریعہ رکھے گئے اثاثوں کی فہرست بنائیں۔ |
|`FindAssetById` |`AssetId` سے ایک اثاثہ بیلنس تلاش کریں۔ |
|`FindAssetDefinitionById` |ID سے اثاثہ کی ایک تعریف تلاش کریں۔ |
|`FindNfts` |فہرست NFTs. |
|`FindNftsByAccountId` |ایک اکاؤنٹ کے مالک کی فہرست NFTs۔ |
|`FindRwas` |رجسٹرڈ حقیقی دنیا کے اثاثوں کی فہرست. |

## ایایسکرو اور ثبوت ریکارڈ {#escrow-and-proof-records}

ایایسکرو استفسارات [نیٹیو اثاثہ ایایسکرو ISIs](/ur/blockchain/escrow.md) کے ذریعہ بنائے گئے ریکارڈوں کا معائنہ کرتے ہیں ، بشمول مارکیٹ پلیس ایایسکرو ، عام اثاثہ تالے ، اور گمنام ایایسکرو ریکارڈز۔

|استفسار |مقصد |
| --- | --- |
|`FindAssetEscrows` |اثاثہ جات کے کریڈٹ ریکارڈز درج کریں۔ |
|`FindAssetEscrowById` |ID کے ذریعہ ایک اثاثہ محفوظ کریں. |
|`FindAssetEscrowsBySeller` |بیچنے والے کے مطابق اثاثوں کی فہرست بنائیں۔ |
|`FindAssetEscrowsByBuyer` |خریدار کے ذریعہ اثاثوں کی فہرست بنائیں۔ |
|`FindAssetEscrowsByStatus` |اسٹیٹس کے لحاظ سے اثاثہ جات کی فہرست بنائیں۔ |
|`FindAnonymousAssetEscrows` |گمنام اثاثوں کے کریڈٹ ریکارڈز درج کریں۔ |
|`FindAnonymousAssetEscrowById` |ID تک ایک گمنام اثاثہ ایسکرو تلاش کریں. |
|`FindAnonymousAssetEscrowsBySeller` |بیچنے والے کے مطابق گمنام گروہوں کی فہرست بنائیں۔ |
|`FindAnonymousAssetEscrowsByBuyer` |خریدار کی طرف سے گمنام کریڈٹ درج کریں۔ |
|`FindAnonymousAssetEscrowsByStatus` |anonymous escrows کو status کے مطابق درج کریں۔ |
|`FindProofRecordById` |ID سے ایک ثبوت ریکارڈ تلاش کریں. |
|`FindProofRecords` |ثبوت ریکارڈ درج کریں. |
|`FindProofRecordsByBackend` |ایک ثبوت بیک اینڈ کے لئے ثبوت ریکارڈز درج کریں. |
|`FindProofRecordsByStatus` |حیثیت کے لحاظ سے ثبوت ریکارڈ درج کریں۔ |

## Nexus، ڈیٹا کی دستیابی اور پیکیج {#nexus-data-availability-and-packages}

|استفسار |مقصد |
| --- | --- |
|`FindRepoAgreements` |آن لائن ذخیرہ شدہ مخزن معاہدوں کی فہرست بنائیں۔ |
|`FindTwitterBindingByHash` |ہیش کے ذریعہ ٹویٹر بائنڈنگ کو حل کریں۔ |
|`FindDaPinIntentByTicket` |ٹکٹ کے ذریعے ڈیٹا کی دستیابی پن کا ارادہ تلاش کریں. |
|`FindDaPinIntentByManifest` |مینیفیس ریفرنس کے ذریعہ پن کی نیت تلاش کریں۔ |
|`FindDaPinIntentByAlias` |عرف کی طرف سے ایک پن ارادہ تلاش کریں. |
|`FindDaPinIntentByLaneEpochSequence` |لین، دورانیہ، اور ترتیب کے مطابق پن کا ارادہ تلاش کریں. |
|`FindLaneRelayEnvelopeByRef` |ایک تصدیق شدہ لین ریلے لفافہ تلاش کریں. |
|`FindSorafsProviderOwner` |SoraFS فراہم کنندہ کے مالک کو حل کریں. |
|`FindDataspaceNameOwnerById` |ایک ڈیٹا اسپیس نام مالک کو حل کریں. |
|`FindMusubiExactPackageV1` |ایک عین مطابق پیکج ریکارڈ اور اس کے موجودہ نظر ثانیوں کو پڑھیں. |
|`FindMusubiExactReleaseV1` |ایک عین مطابق ریلیز اسنیپ شاٹ پڑھیں۔ |
|`FindMusubiProviderBundleAttestationV1` |ایک فراہم کنندہ کے آرکائیو کٹ کی تصدیق پڑھیں۔ |
|`FindMusubiResolverIndexV1` |حتمی حل کرنے والے انڈیکس کا صفحہ. |
|`FindMusubiVersionsV1` |صفحہ ایک پیکج کے لئے حتمی ورژن. |
|`FindMusubiMaintainersV1` |صفحہ نے منتظمین کو قبول کیا اور زیر التواء دعوت نامے. |
|`FindMusubiArchiveLocationsV1` |صفحہ ایک آرکائیو کے لئے SoraFS مقامات کو حتمی. |
|`FindMusubiArchiveRetentionV1` |صفحہ محفوظ شدہ دستاویزات کے ریکارڈ. |
|`FindMusubiAliasV1` |ایک عالمی عرف کا موجودہ ہدف اور نظر ثانی پڑھیں۔ |
|`FindMusubiAliasHistoryV1` |ایک عالمی عرف کی ناقابل تبدیل ری ٹارگٹ تاریخ کا صفحہ. |
|`FindMusubiOrderedPrefixV1` |صفحے کے پیکجوں کو ایک ترتیب شدہ ڈھانچے کی پیش گوئی کے تحت ترتیب دیا گیا ہے۔ |

## ٹرگرز، معاہدوں، لین دین اور بلاک {#triggers-contracts-transactions-and-blocks}

|استفسار |مقصد |
| --- | --- |
|`FindActiveTriggerIds` |فعال ٹرگر درج کریں IDs. |
|`FindTriggers` |فہرست ٹرگرز. |
|`FindTriggerById` |ID سے ایک ٹرگر تلاش کریں. |
|`FindContractManifestByCodeHash` |کوڈ ہیش کے ذریعے ایک ذہین معاہدے کی دستاویزی تلاش کریں. |
|`FindTransactions` |مقررہ ٹرانزیکشنز کی فہرست |
|`FindBlocks` |فہرست بلاکس. |
|`FindBlockHeaders` |بلاک ہیڈرز کی فہرست. |

## فلٹرنگ اور صفحہ بندی {#filtering-and-pagination}

Iterable queries predicate اور selector کی حمایت کو بے نقاب کرسکتے ہیں۔ SDK سے استفسار کے مخصوص ٹائپ کردہ فلٹرز کا استعمال کریں تاکہ فلٹر ان پٹ استفسار آؤٹ پٹ کی قسم سے مماثل ہو۔ بڑے نتائج کے سیٹوں کے ل query ، ہر سطر کو ایک ساتھ لینے کے بجائے کرسر اور حد جیسے استفسار پیرامیٹرز استعمال کریں۔
