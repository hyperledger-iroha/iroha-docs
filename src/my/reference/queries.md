---
translation_locale: my
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# မေးခွန်းများ {#queries}

Iroha လက်ရှိ ဒေတာပုံစံကို ပြောင်းလဲခြင်းမရှိဘဲ စာရင်းအင်းအခြေအနေကို ဖတ်ပါ။
မေးခွန်းပုံစံ နှစ်မျိုးကို ဖော်ပြပေးတယ်။

- **တစ်ပုဒ်တည်းသော မေးခွန်းများ**, အရာဝတ္ထုတစ်ခု (သို့) တန်ဖိုးတစ်ခုကို ပြန်ပို့တဲ့
- **iterable queries များ**, ရေစီးကြောင်း (သို့) ကောက်ယူမှုကို ပြန်ပို့ပြီး ပေါင်းစပ်နိုင်ပါတယ်။
  စစ်ဆေးခြင်း၊ အမျိုးအစားခွဲခြင်း၊ ပရိုဂျက်ခြင်းနှင့် စာမျက်နှာပြုပြင်ခြင်းဖြင့် မေးမြန်းမှုအမျိုးအစား
  ဒါကို ထောက်ခံတယ်

အသုံးပြုခြင်း SDK စာလုံးရိုက်တဲ့ ဆောက်လုပ်သူ (သို့) CLI မေးမြန်းမှုအဖုံးတွေ တည်ဆောက်မယ့်အစား
အောက်ပါအမည်များမှာ လက်ရှိ query အမျိုးအစားများကို
`iroha_data_model::query`.

## ပြေးဆွဲချိန်နှင့် စီမံခန့်ခွဲမှု {#runtime-and-configuration}

| မေးခွန်း | ရည်ရွယ်ချက် |
| --- | --- |
| `FindAbiVersion` | အကောင်အထည်ဖော်သူကို ပြန်ပေးပါ။ ABI အံဝင်ခွင်ကျပါ။ |
| `FindExecutorDataModel` | executor data model ကိုပြန်ပို့ပါ။ |
| `FindParameters` | ချိတ်ဆက်ထားတဲ့ အပြီးသတ်ရေး ကိရိယာရဲ့ ညွှန်ကြားချက်တွေကို ပြန်ပို့ပါ။ |

## အကောင့်များနှင့် ခွင့်ပြုချက်များ {#accounts-and-permissions}

| မေးခွန်း | ရည်ရွယ်ချက် |
| --- | --- |
| `FindAccountById` | ကနောကျမ်းစာစာရင်းတစ်ခုစီကို ရှာဖွေပါ။ ID. |
| `FindAccountByAlias` | အကောင့်တစ်ခုအတွက် အမည်မဖော်လိုတဲ့ အကောင့်ကို ဖြေရှင်းပါ။ |
| `FindAccounts` | မှတ်ပုံတင်ထားတဲ့ အကောင့်တွေကို စာရင်းပေးပါ။ |
| `FindAccountIds` | မှတ်ပုံတင်စာရင်း IDs. |
| `FindAccountsWithAsset` | သတ်မှတ်ထားသော အရင်းအမြစ်အနက်ဖွင့်ချက်ကို ပိုင်ဆိုင်သည့်စာရင်းများကို စာရင်းပေးပါ။ |
| `FindAliasesByAccountId` | အကောင့်တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ အမည်မဖော်လိုသူတွေကို စာရင်းပေးပါ။ |
| `FindAccountRecoveryPolicyByAlias` | အမည်မဖော်လိုသူအတွက် ပြန်လည်ထူထောင်ရေး မူဝါဒကိုရှာပါ။ |
| `FindAccountRecoveryRequestByAlias` | အမည်မဖော်လိုတဲ့ ပြန်လည်ထူထောင်ရေး တောင်းဆိုချက်ကို ရှာပါ။ |
| `FindRoles` | စာရင်းကဏ္ဍ။ |
| `FindRoleIds` | စာရင်းအင်း အခန်းကဏ္ဍ IDs. |
| `FindRolesByAccountId` | အကောင့်တစ်ခုအတွက် ပေးအပ်သော အခန်းကဏ္ဍများကို စာရင်းပေးပါ။ |
| `FindPermissionsByAccountId` | အကောင့်ကို ပေးထားတဲ့ ခွင့်ပြုချက်တွေကို စာရင်းထည့်ပါ။ |

## ဒိုမင်များနှင့် အဖော်များ {#domains-and-peers}

| မေးခွန်း | ရည်ရွယ်ချက် |
| --- | --- |
| `FindDomainById` | Domain တစ်ခုကို ရှာပါ `DomainId`. |
| `FindDomains` | မှတ်ပုံတင်ထားတဲ့ ဒိုမင်တွေကို စာရင်းပေးပါ။ |
| `FindDomainsByAccountId` | အကောင့်ပိုင်ဆိုင်တဲ့ ဒိုမင်တွေကို စာရင်းပေးပါ။ |
| `FindDomainEndorsements` | ဒိုမင် ထောက်ခံမှု မှတ်တမ်းတွေကို စာရင်းပေးပါ။ |
| `FindDomainEndorsementPolicy` | Domain ထောက်ခံမှု မူဝါဒကို ပြန်ပို့ပါ။ |
| `FindDomainCommittee` | Domain ကော်မတီကို ပြန်ပေးပါ။ |
| `FindPeers` | စာရင်းထဲမှာသိတဲ့ ယုံကြည်ရတဲ့ အဖော်တွေကို စာရင်းပေးပါ။ |

## အရင်းအမြစ်များ NFTs, နှင့် RWAs {#assets-nfts-and-rwas}

| မေးခွန်း | ရည်ရွယ်ချက် |
| --- | --- |
| `FindAssets` | အရင်းအမြစ်စာရင်းတင်ပါ။ |
| `FindAssetsDefinitions` | အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို စာရင်းပေးပါ။ |
| `FindAssetsByAccountId` | အကောင့်တစ်ခုမှာရှိတဲ့ အရင်းအမြစ်တွေကို စာရင်းတင်ပါ။ |
| `FindAssetById` | ငွေကြေးပမာဏကို တစ်ပုံတည်းရှာဖွေပါ `AssetId`. |
| `FindAssetDefinitionById` | အရင်းအမြစ်အနက်ကောက်ချက် တစ်ခုကို ရှာဖွေပါ ID. |
| `FindNfts` | စာရင်း NFTs. |
| `FindNftsByAccountId` | စာရင်း NFTs အကောင့်တစ်ခုပိုင်ဆိုင်တယ်။ |
| `FindRwas` | စာရင်းမှာ တကယ့်ကမ္ဘာက ပိုင်ဆိုင်မှုအချို့ကို မှတ်ပုံတင်ထားတယ်။ |

## ငွေကြေးထောက်ပံ့မှု မှတ်တမ်းများ {#escrow-and-proof-records}

Escrow queries တွေက ဖန်တီးထားတဲ့ မှတ်တမ်းတွေကို စစ်ဆေးတယ်။
[ဒေသခံ အရင်းအမြစ်များအတွက် ဂိုဏ်းငွေ ISIs](/my/blockchain/escrow.md), စျေးကွက်အပါအဝင်
အချုပ်အခြာငွေ၊ ယေဘုယျ အရင်းအမြစ် ပိတ်ခြင်းနဲ့ အမည်မသိ အချုပ်အခမဲ့ မှတ်တမ်းများ။

| မေးခွန်း | ရည်ရွယ်ချက် |
| --- | --- |
| `FindAssetEscrows` | အရင်းအမြစ် အလှူခံ မှတ်တမ်းတွေကို စာရင်းပေးပါ။ |
| `FindAssetEscrowById` | အရင်းအမြစ် တစ်ခုကို ရှာဖွေပါ။ ID. |
| `FindAssetEscrowsBySeller` | ရောင်းသူအလိုက် အရင်းအမြစ်တွေကို စာရင်းပေးပါ။ |
| `FindAssetEscrowsByBuyer` | ဝယ်သူအလိုက် အရင်းအမြစ်များကို စာရင်းပေးပါ။ |
| `FindAssetEscrowsByStatus` | အရင်းအမြစ်တွေကို အခြေအနေအလိုက် စာရင်းပေးပါ။ |
| `FindAnonymousAssetEscrows` | အမည်မသိ အရင်းအမြစ် ဂိုဏ်းမှတ်တမ်းတွေကို စာရင်းပေးပါ။ |
| `FindAnonymousAssetEscrowById` | အမည်မသိ အရင်းအမြစ်တစ်ခုစီကို ရှာဖွေပါ။ ID. |
| `FindAnonymousAssetEscrowsBySeller` | ရောင်းသူအလိုက် အမည်မဲ့ ဂိုဏ်းတွေကို စာရင်းပေးပါ။ |
| `FindAnonymousAssetEscrowsByBuyer` | ဝယ်သူအလိုက် အမည်မဲ့ ဂိုဏ်းတွေကို စာရင်းပေးပါ။ |
| `FindAnonymousAssetEscrowsByStatus` | အမည်မသိ ငွေကြေးထောက်ပံ့သူတွေကို အခြေအနေအရ စာရင်းပေးပါ။ |
| `FindProofRecordById` | အထောက်အထား မှတ်တမ်း တစ်ခုကို ရှာပါ။ ID. |
| `FindProofRecords` | သက်သေခံ မှတ်တမ်းတွေကို စာရင်းပေးပါ။ |
| `FindProofRecordsByBackend` | သက်သေခံ backend တစ်ခုအတွက် အထောက်အထား မှတ်တမ်းတွေကို စာရင်းပေးပါ။ |
| `FindProofRecordsByStatus` | အခြေအနေအလိုက် သက်သေပြမှတ်တမ်းတွေကို စာရင်းပေးပါ။ |

## Nexus, ဒေတာရရှိနိုင်မှုနှင့် Packages {#nexus-data-availability-and-packages}

| မေးခွန်း | ရည်ရွယ်ချက် |
| --- | --- |
| `FindRepoAgreements` | ချိတ်ဆက်ထားသော မှတ်ပုံတင်စာချုပ်များကို စာရင်းပေးပါ။ |
| `FindTwitterBindingByHash` | ဟက်ရှ်ဖြင့် Twitter ချိတ်ဆက်မှုကို ဖြေရှင်းပါ။ |
| `FindDaPinIntentByTicket` | Ticket တစ်ခုနဲ့ ဒေတာရရှိမှု ပိုက်ရည်ရွယ်ချက်ကို ရှာပါ။ |
| `FindDaPinIntentByManifest` | ပိုင်ရည်ရွယ်ချက်ကို manifest reference မှတဆင့်ရှာပါ။ |
| `FindDaPinIntentByAlias` | အမည်မဖော်လိုတဲ့ ခလုတ်ရည်ရွယ်ချက်ကို ရှာပါ။ |
| `FindDaPinIntentByLaneEpochSequence` | လမ်းကြောင်း၊ ခေတ်နဲ့ အစဉ်အတန်းအရ ပိုက်ရည်ရွယ်ချက်ကို ရှာပါ။ |
| `FindLaneRelayEnvelopeByRef` | မှန်ကန်တဲ့ လိုင်နို-ရေ Relay အဝှမ်းကိုရှာပါ။ |
| `FindSorafsProviderOwner` | ရင်းနှီးမြှုပ်နှံမှု SoraFS ပေးသွင်းသူ။ |
| `FindDataspaceNameOwnerById` | ဒေတာနေရာအမည်ပိုင်ရှင်ကို ဖြေရှင်းပါ။ |
| `FindMusubiReleaseByRef` | ရှာပါ Musubi ကိုးကားချက်ဖြင့် ထုတ်ပေးခြင်း။ |
| `FindMusubiPackageVersions` | စာရင်းထုတ်ပြန်ချက်များ Musubi ပါကစ်ပါ။ |
| `FindMusubiPackageReleases` | စာရင်းထုတ်ပြန်ချက်များ Musubi ပါကစ်ပါ။ |
| `FindMusubiShortAliasByName` | A ကို ဖြေရှင်းပါ Musubi အမည်တိုတွေပေါ့။ |

## အစပျိုးချက်များ၊ စာချုပ်များ၊ ငွေပေးချေမှုများနှင့် ပိတ်ဆို့မှု {#triggers-contracts-transactions-and-blocks}

| မေးခွန်း | ရည်ရွယ်ချက် |
| --- | --- |
| `FindActiveTriggerIds` | Active trigger ကို စာရင်းထည့်ပါ။ IDs. |
| `FindTriggers` | List trigger တွေပါ။ |
| `FindTriggerById` | တစ်ခုကို ရှာလိုက်ပါ ID. |
| `FindContractManifestByCodeHash` | Code hash နဲ့ smart-contract manifest ကိုရှာပါ။ |
| `FindTransactions` | ချုပ်ဆိုထားသော ငွေကြေးပူးပေါင်းမှုစာရင်း။ |
| `FindBlocks` | စာရင်းအင်းတွေ။ |
| `FindBlockHeaders` | စာရင်းအင်း ခေါင်းစဉ်တွေ။ |

## စစ်ဆေးခြင်းနှင့် စာမျက်နှာတင်ခြင်း {#filtering-and-pagination}

Iterable query တွေက predicate နဲ့ selector support ကို ဖော်ပြနိုင်ပါတယ်။ query-specific ကို အသုံးပြုပါ။
Typed Filters ကနေ SDK ဒီတော့ filter input က query output type နဲ့ ကိုက်ညီပါတယ်။
ကြီးမားတဲ့ ရလဒ်များအတွက် ကော်ဆာနဲ့ အကန့်အသတ်လို မေးမြန်းမှု ပမာဏတွေကို သုံးပါ။
အတန်းတိုင်းကို ချက်ချင်းခေါ်ယူဖို့ပါ။
