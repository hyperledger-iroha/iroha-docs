---
translation_locale: my
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ခွင့်ပြုချက် လက်မှတ်များ {#permission-tokens}

ဤစာမျက်နှာတွင် လက်ရှိအမှတ်တံဆိပ်များအား ဖော်ပြထားသော အလိုလျောက်ခွင့်ပြုချက် အမှတ်တံဆိပ်အမျိုးအစားများကို စာရင်းပေးထားသည်
Iroha အကောင်အထည်ဖော်သူ ဒေတာပုံစံ။ အခန်းကဏ္ဍများနှင့် ခွင့်ပြုချက်များအတွက် စိတ်ကူး လမ်းညွှန်ချက်အတွက်၊
ကြည့်ပါ [ခွင့်ပြုချက်များ](/my/blockchain/permissions.md).

ခွင့်ပြုချက် စစ်ဆေးမှုများကို Active Runtime Validator က အကောင်အထည်ဖော်သည်။
အောက်ပါအမည်များက ပုံမှန် မူဝါဒမျက်နှာပြင်ကို ဖော်ပြသော်လည်း ကွန်ရက်တစ်ခုသည် အသင့်သုံးနိုင်သည်။
Runtime validation ကို executor ကို upgrade လုပ်ပြီး verify လုပ်ပါ။

## Default Tokens များ {#default-tokens}

| ခွင့်ပြုချက် လက်မှတ် | အမျိုးအစား | လုပ်ဆောင်ချက် |
| --- | --- | --- |
| `CanManagePeers` | တူညီသူ | မှတ်ပုံတင်၊ မမှတ်ပုံတင်၊ ဒါမှမဟုတ် အခြားနည်းနဲ့ အဖော်တွေကို စီမံခန့်ခွဲပါ။ |
| `CanManageLaneRelayEmergency` | တူညီသူ | အရေးပေါ်လမ်းကြောင်းဆက်သွယ်မှု ထိန်းချုပ်မှုကို စီမံပါ။ |
| `CanRegisterDomain` | ဒိုမင် | Domain တစ်ခု မှတ်ပုံတင်ပါ။ |
| `CanUnregisterDomain` | ဒိုမင် | Domain တစ်ခုကို မှတ်ပုံတင်မထားပါ။ |
| `CanModifyDomainMetadata` | ဒိုမင် | Domain metadata ကို ပြင်ဆင်ပါ။ |
| `CanRegisterAccount` | အကောင့် | အကောင့်တစ်ခု မှတ်ပုံတင်ပါ။ |
| `CanUnregisterAccount` | အကောင့် | အကောင့်တစ်ခုကို မှတ်ပုံတင်မထားပါ။ |
| `CanModifyAccountMetadata` | အကောင့် | Account ရဲ့ metadata ကို ပြင်ပါ။ |
| `CanUnregisterAssetDefinition` | အရင်းအမြစ် သတ်မှတ်ချက် | အရင်းအမြစ် သတ်မှတ်ချက်တစ်ခုကို မှတ်ပုံတင်မထားပါ။ |
| `CanModifyAssetDefinitionMetadata` | အရင်းအမြစ် သတ်မှတ်ချက် | Asset Definition ရဲ့ metadata တွေကို ပြင်ဆင်ပါ။ |
| `CanMintAssetWithDefinition` | အရင်းအမြစ်များ | တိကျတဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်အတွက် ငွေကြေးစျေးကွက် အရင်းအမြစ်များ။ |
| `CanBurnAssetWithDefinition` | အရင်းအမြစ်များ | တိကျတဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်အတွက် အရင်းအမြစ်တွေကို မီးရှို့ပါ။ |
| `CanTransferAssetWithDefinition` | အရင်းအမြစ်များ | တိကျတဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်အတွက် အရင်းအမြစ်လွှဲပြောင်းခြင်း |
| `CanMintAsset` | အရင်းအမြစ်များ | တိကျတဲ့ အရင်းအမြစ် ဘားအံကို ဖန်တီးပါ။ |
| `CanBurnAsset` | အရင်းအမြစ်များ | တိကျတဲ့ အရင်းအမြစ် ဟန်ချက်ညီမှုကို မီးရှို့ပါ။ |
| `CanTransferAsset` | အရင်းအမြစ်များ | တိကျတဲ့ အရင်းအမြစ် ဘားလန်ကို လွှဲပြောင်းပါ။ |
| `CanRegisterNft` | NFT | မှတ်ပုံတင် NFT. |
| `CanUnregisterNft` | NFT | မှတ်ပုံတင်ခြင်း NFT. |
| `CanTransferNft` | NFT | လွှဲပြောင်းခြင်း NFT. |
| `CanModifyNftMetadata` | NFT | ပြင်ဆင်ခြင်း NFT metadata တွေ။ |
| `CanSetParameters` | ကန့်သတ်ချက် | ချိတ်ဆက်ထားတဲ့ ကွန်ပြူတာ သတ်မှတ်ချက်တွေကို သတ်မှတ်ပါ။ |
| `CanManageRoles` | အခန်းကဏ္ဍ | မှတ်ပုံတင်ခြင်း၊ မှတ်ပုံတင်ခြင်းမရှိခြင်း၊ ကမ်းလှမ်းခြင်း၊ သို့မဟုတ် ရုပ်သိမ်းခြင်း။ |
| `CanRegisterTrigger` | ထရီဂါး | လှုပ်ခတ်မှုကို မှတ်တမ်းတင်ပါ။ |
| `CanExecuteTrigger` | ထရီဂါး | လှုပ်ခတ်မှုတစ်ခု လုပ်ပါ။ |
| `CanUnregisterTrigger` | ထရီဂါး | trigger တစ်ခုကို မှတ်ပုံတင်မထားပါ။ |
| `CanModifyTrigger` | ထရီဂါး | Trigger ကို ပြုပြင်ပါ။ |
| `CanModifyTriggerMetadata` | ထရီဂါး | trigger metadata ကို ပြင်ပါ။ |
| `CanUpgradeExecutor` | အကောင်အထည်ဖော်သူ | Runtime Executor ကို Upgrade လုပ်ပါ။ |
| `CanRegisterSmartContractCode` | အသိဉာဏ်ရှိတဲ့ စာချုပ် | စမတ်ကုဒ်ကို မှတ်ပုံတင်ပါ။ |
| `CanUseFeeSponsor` | Nexus | အခွန်များ Nexus သတ်မှတ်ထားတဲ့ sponsor account တစ်ခုကို ပေးသွင်းတဲ့ အခွန်များ။ |

## ပိုင်ဆိုင်မှု {#ownership}

Owner-sensitive permission tokens တွေဟာ Canonic object ကို ရည်ညွှန်းဖို့လိုပါတယ်။ IDs အသုံးပြုခြင်း
ဥပမာ Account Permissions က Canonical ကို ရည်ညွှန်းပါတယ်။
domainless အကောင့် IDs, Domain ခွင့်ပြုချက်များ `domain.dataspace` နယ်ပယ်
IDs, နှင့် အရင်းအမြစ်ခွင့်ပြုချက်များသည် အရင်းအမြစ်ကို သတ်မှတ်ခြင်း (သို့) အရင်းအမြတ်ကို ရည်ညွှန်းသည်။ IDs.

ခွင့်ပြုချက်အမှားနဲ့ ငွေပေးချေမှု ကျရှုံးတဲ့အခါ နှစ်ဘက်စလုံးကို စစ်ဆေးပါ။

- ငွေပေးချေမှုကို လက်မှတ်ထိုးတဲ့စာရင်းဟာ မျှော်လင့်ထားတဲ့ ကန်နီကလစ်စာရင်းပါ။
- ခွင့်ပြုချက်မှတ်တံဆိပ် (သို့) အခန်းကဏ္ဍကို တိကျတဲ့ အရာဝတ္ထုအတွက် ပေးအပ်ခဲ့သည် ID အသုံးပြုထားသော
  သင်ကြားချက်
