---
translation_locale: my
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# မေးခွန်းများ {#queries}

Iroha query တွေက blockchain ledger state ကို မပြောင်းဘဲ ဖတ်တယ်။ လက်ရှိ data model က query ပုံစံ နှစ်မျိုးကို ဖော်ပြပါတယ်။

- object (သို့) value တစ်ခုကိုပြန်ပေးသော singular queries များ
- iterable queries တွေဟာ stream (သို့) collection ကိုပြန်ပို့ပေးပြီး filter, sorting, projection နဲ့ pagination တို့နဲ့ ပေါင်းစပ်နိုင်ပါတယ်။ query type က ထောက်ပံ့တဲ့နေရာမှာ

SDK typeed builders (သို့) CLI ကို လက်နဲ့ query data container တွေကို တည်ဆောက်မယ့်အစား သုံးပါ။ အောက်ပါအမည်တွေက `iroha_data_model::query` က ဖော်ပြထားတဲ့ လက်ရှိ query အမျိုးအစားတွေပါ။

## ဆော့ဖ်ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်နှင့် ဖွဲ့စည်းပုံ {#runtime-and-configuration}

|မေးခွန်း|ရည်ရွယ်ချက်|
| --- | --- |
|`FindAbiVersion` |အကောင်အထည်ဖော်သူ ABI ကို ပြန်ပို့ပါ။ |
|`FindExecutorDataModel` |အကောင်အထည်ဖော်သူ ဒေတာပုံစံ သရုပ်ဖော်ချက်ကို ပြန်ပို့ပါ။ |
|`FindParameters` |ချိတ်ဆက်ထားတဲ့ executor configuration parameters တွေကို ပြန်ပေးပါ။ |

## အကောင့်များနှင့် ခွင့်ပြုချက်များ {#accounts-and-permissions}

|မေးခွန်း|ရည်ရွယ်ချက်|
| --- | --- |
|`FindAccountById` |Single Protocol Standard Account ID ကို သုံးပြီး account တစ်ခုကို ရှာပါ။ |
|`FindAccountByAlias` |အကောင့်တစ်ခုအတွက် အမည်မဖော်လိုတဲ့ အကောင့်ကို ဖြေရှင်းပါ။|
|`FindAccounts` |မှတ်ပုံတင်ထားတဲ့ အကောင့်တွေကို စာရင်းပေးပါ။ |
|`FindAccountIds` |မှတ်ပုံတင်ထားတဲ့ အကောင့် ID တွေကို စာရင်းပေးပါ။ |
|`FindAccountsWithAsset` |သတ်မှတ်ထားတဲ့ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက် ရှိတဲ့ အကောင့်တွေကို စာရင်းပေးပါ။ |
|`FindAliasesByAccountId` |အကောင့်တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ အမည်မဖော်လိုသူတွေကို စာရင်းပေးပါ။ |
|`FindAccountRecoveryPolicyByAlias` |အမည်မဖော်လိုသူအတွက် ပြန်လည်ထူထောင်ရေး မူဝါဒကိုရှာပါ။|
|`FindAccountRecoveryRequestByAlias` |အမည်မဖော်လိုတဲ့ recovery request ကိုရှာပါ။ |
|`FindRoles` |အခန်းကဏ္ဍတွေကို စာရင်းပေးပါ။|
|`FindRoleIds` |အခန်းကဏ္ဍ ID တွေကို စာရင်းပေးပါ။ |
|`FindRolesByAccountId` |အကောင့်ကို ပေးအပ်သော အခန်းကဏ္ဍများကို စာရင်းပေးပါ။ |
|`FindPermissionsByAccountId` |အကောင့်ကို ပေးထားတဲ့ ခွင့်ပြုချက်များကို စာရင်းထည့်ပါ။ |

## ဒိုမင်များနှင့် ကွန်ရက်ပြိုင်ဘက်များ {#domains-and-peers}

|မေးခွန်း|ရည်ရွယ်ချက်|
| --- | --- |
|`FindDomainById` |`DomainId` ကို domain တစ်ခုရှာပါ။ |
|`FindDomains` |မှတ်ပုံတင်ထားတဲ့ domain တွေကို စာရင်းပေးပါ။ |
|`FindDomainsByAccountId` |အကောင့်တစ်ခုပိုင်ဆိုင်တဲ့ ဒိုမင်တွေကို စာရင်းပေးပါ။ |
|`FindDomainEndorsements` |ဒိုမင်မှတ်ပုံတင် မှတ်တမ်းတွေကို စာရင်းပေးပါ။ |
|`FindDomainEndorsementPolicy` |Domain ထောက်ခံမှု မူဝါဒကို ပြန်ပို့ပါ။ |
|`FindDomainCommittee` |Domain ကော်မတီကို ပြန်ပေးပါ။|
|`FindPeers` |blockchain ledger မှာသိတဲ့ ယုံကြည်စိတ်ချရတဲ့ network peers တွေကို စာရင်းပေးပါ။ |

## အရင်းအမြစ်များ NFTs နှင့် RWAs {#assets-nfts-and-rwas}

|မေးခွန်း|ရည်ရွယ်ချက်|
| --- | --- |
|`FindAssets` |အရင်းအမြစ်လက်ကျန်စာရင်း။ |
|`FindAssetsDefinitions` |အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေကို စာရင်းပေးပါ။ |
|`FindAssetsByAccountId` |အကောင့်တစ်ခုမှာရှိတဲ့ အရင်းအမြစ်တွေကို စာရင်းပေးပါ။ |
|`FindAssetById` |`AssetId` ကနေ အရင်းအမြစ်စာရင်းတစ်ခုရှာပါ။ |
|`FindAssetDefinitionById` |ID နဲ့ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက် တစ်ခု ရှာပါ။ |
|`FindNfts` |စာရင်း NFTs. |
|`FindNftsByAccountId` |စာရင်းပိုင်ဆိုင်သူ NFTs ။ |
|`FindRwas` |မှတ်ပုံတင်ထားတဲ့ ကမ္ဘာစစ် အရင်းအမြစ်တွေကို စာရင်းပေးပါ။|

## အာမခံစာရင်းနှင့် သက်သေခံစာရင်းများ {#escrow-and-proof-records}

[ရင်းနှီးမြှုပ်နှံမှု ISIs](/my/blockchain/escrow.md) မှဖန်တီးသော မှတ်တမ်းများကို စစ်ဆေးခြင်း၊ စျေးကွက်မှတ်တမ်းများ၊ ယေဘုယျအရင်းအမြစ်ပိတ်ရက်များနှင့် အမည်မသိမှတ်တမ်းများအပါအဝင်။

|မေးခွန်း|ရည်ရွယ်ချက်|
| --- | --- |
|`FindAssetEscrows` |အရင်းအမြစ် အလှူခံ မှတ်တမ်းတွေကို စာရင်းပေးပါ။ |
|`FindAssetEscrowById` |ID နဲ့ အရင်းအမြစ် တစ်ခုကို ရှာပါ။ |
|`FindAssetEscrowsBySeller` |ရောင်းသူအလိုက် အရင်းအမြစ်တွေကို မှတ်ပုံတင်ပါ။ |
|`FindAssetEscrowsByBuyer` |အရင်းအမြစ်များကို ဝယ်ယူသူအလိုက် မှတ်တမ်းတင်ပါ။ |
|`FindAssetEscrowsByStatus` |အရင်းအမြစ်များကို အခြေအနေအလိုက် စာရင်းပေးပါ။ |
|`FindAnonymousAssetEscrows` |အမည်မသိ အရင်းအမြစ်ဂိုဏ်း မှတ်တမ်းတွေကို စာရင်းပေးပါ။|
|`FindAnonymousAssetEscrowById` |ID ကနေ အမည်မသိ အရင်းအမြစ် တစ်ခုကို ရှာပါ။|
|`FindAnonymousAssetEscrowsBySeller` |ရောင်းသူအလိုက် အမည်မဲ့ ဂိုဏ်းစာရင်းပေးပါ။ |
|`FindAnonymousAssetEscrowsByBuyer` |ဝယ်သူအလိုက် အမည်မဲ့ ဂိုဏ်းတွေကို စာရင်းပေးပါ။|
|`FindAnonymousAssetEscrowsByStatus` |အမည်မဲ့ ငွေပေးချေသူတွေကို အခြေအနေအလိုက် စာရင်းပေးပါ။ |
|`FindProofRecordById` |အထောက်အထား မှတ်တမ်း တစ်ခုကို ID နဲ့ ရှာပါ။|
|`FindProofRecords` |အထောက်အထား မှတ်တမ်းတွေကို စာရင်းပေးပါ။|
|`FindProofRecordsByBackend` |အထောက်အထား backend တစ်ခုအတွက် သက်သေခံ မှတ်တမ်းတွေကို စာရင်းပေးပါ။ |
|`FindProofRecordsByStatus` |အခြေအနေအလိုက် မှတ်တမ်းတွေကို စာရင်းပေးပါ။ |

## Nexus, ဒေတာရရှိနိုင်မှုနှင့် Packages {#nexus-data-availability-and-packages}

|မေးခွန်း|ရည်ရွယ်ချက်|
| --- | --- |
|`FindRepoAgreements` |ကွင်းဆက်မှာ သိုလှောင်ထားတဲ့ မှတ်ပုံတင် သဘောတူညီချက်တွေကို စာရင်းပေးပါ။ |
|`FindTwitterBindingByHash` |Cryptographic hash ဖြင့် Twitter binding ကို ဖြေရှင်းပါ။ |
|`FindDaPinIntentByTicket` |Ticket ကေန Data Availability pin intent ကို ရှာပါ။ |
|`FindDaPinIntentByManifest` |Technical Manifesto Reference နဲ့ pin intent ကို ရှာပါ။ |
|`FindDaPinIntentByAlias` |အမည်မဖော်လိုတဲ့ ခလုတ် ရည်ရွယ်ချက်ကို ရှာပါ။|
|`FindDaPinIntentByLaneEpochSequence` |အပြီးသတ်မှုလမ်းကြောင်း၊ ခေတ်နဲ့ အစဉ်အတန်းကနေ pin intent ကိုရှာပါ။ |
|`FindLaneRelayEnvelopeByRef` |မှန်ကန်တဲ့ Lane-relay ဒေတာ ကွန်တိန်နာကို ရှာပါ။ |
|`FindSorafsProviderOwner` |SoraFS ပေးသွင်းသူ၏ ပိုင်ရှင်ကို ဖြေရှင်းပါ။ |
|`FindDataspaceNameOwnerById` |ဒေတာနေရာအမည်ရှင်ကို ဖြေရှင်းပါ။ |
|`FindMusubiExactPackageV1` |တိကျတဲ့ package record တစ်ခုနဲ့ လက်ရှိ ပြင်ဆင်ချက်တွေကို ဖတ်ပါ။|
|`FindMusubiExactReleaseV1` |တိကျတဲ့ ထုတ်လွှင့်ချက် တစ်ပုံကို ဖတ်ပါ။|
|`FindMusubiProviderBundleAttestationV1` |ပေးသွင်းသူတစ်ဦးရဲ့ မှတ်တမ်းစု အထောက်အထားကို ဖတ်ပါ။ |
|`FindMusubiResolverIndexV1` |နောက်ဆုံးသတ်မှတ်ထားတဲ့ Resolver Index ကို Page လုပ်ပါ။ |
|`FindMusubiVersionsV1` |စာမျက်နှာ တစ်ခုအတွက် နောက်ဆုံးပြုလုပ်ထားသော မူကွဲများ။ |
|`FindMusubiMaintainersV1` |Page က Maintenance တွေနဲ့ စောင့်ဆိုင်းနေတဲ့ ဖိတ်ကြားချက်တွေကို လက်ခံခဲ့ပါတယ်။ |
|`FindMusubiArchiveLocationsV1` |စာမျက်နှာတစ်ခုအတွက် SoraFS တည်နေရာများကို နောက်ဆုံးသတ်မှတ်ခဲ့သည်။ |
|`FindMusubiArchiveRetentionV1` |စာမျက်နှာ မှတ်တမ်းတင်မှတ်တမ်းများ။|
|`FindMusubiAliasV1` |Global alias ရဲ့ လက်ရှိ ရည်မှန်းချက်နဲ့ ပြင်ဆင်မှုကို ဖတ်ပါ။ |
|`FindMusubiAliasHistoryV1` |Global alias တစ်ခုရဲ့ မပြောင်းလဲနိုင်တဲ့ retarget သမိုင်းကို Page လုပ်ပါ။ |
|`FindMusubiOrderedPrefixV1` |စာမျက်နှာပက်ကတ်များမှာ စီစဉ်ထားသော အဆောက်အအုံ ကြိုတင်စာရင်းတစ်ခုပါ |

## ကြိုးပမ်းချက်များ၊ စာချုပ်များ၊ ငွေပေးချေမှုများနှင့် ပိတ်ပင်ခြင်း {#triggers-contracts-transactions-and-blocks}

|မေးခွန်း|ရည်ရွယ်ချက်|
| --- | --- |
|`FindActiveTriggerIds` |Active trigger ID တွေကို စာရင်းထည့်ပါ။ |
|`FindTriggers` |List trigger တွေ။|
|`FindTriggerById` |ID နဲ့ trigger တစ်ခုရှာပါ။ |
|`FindContractManifestByCodeHash` |Code cryptographic hash နဲ့ smart-contract technical manifest ကိုရှာပါ။ |
|`FindTransactions` |ပြီးဆုံးသွားတဲ့ ငွေပေးချေမှုစာရင်း။|
|`FindBlocks` |စာရင်းအင်းတွေ။|
|`FindBlockHeaders` |Block headers တွေကို စာရင်းပေးပါ။|

## စစ်ဆေးခြင်းနှင့် စာမျက်နှာတင်ခြင်း {#filtering-and-pagination}

Iterable query များတွင် predicate နှင့် selector support ကို ဖော်ပြနိုင်သည်။ SDK မှ query-specific typeed filter များကို အသုံးပြု၍ filter input သည် query output type နှင့် ကိုက်ညီစေရန်။ ကြီးမားသော ရလဒ် set များအတွက်ဆိုလျှင် row တစ်ခုစီကို တစ်ပြိုင်နက်ရယူခြင်းအစား cursor နှင့် limit ကဲ့သို့သော query parameters များကိုအသုံးပြုပါ။
