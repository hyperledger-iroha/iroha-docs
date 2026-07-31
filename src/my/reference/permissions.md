---
translation_locale: my
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ခွင့်ပြုချက် လက်မှတ်များ {#permission-tokens}

ဤစာမျက်နှာတွင် လက်ရှိ Iroha အကောင်အထည်ဖော်သူ ဒေတာမော်ဒယ်မှ ဖော်ပြထားသော အလိုလျောက် ခွင့်ပြုချက် အမှတ်တံဆိပ်အမျိုးအစားများကို စာရင်းပေးထားသည်။ အခန်းကဏ္ဍများနှင့် ခွင့်ပြုချက်တွေဆိုင်ရာ သဘောတရား လမ်းညွှန်စာအုပ်အတွက် [ Permissions](/my/blockchain/permissions.md) ကိုကြည့်ပါ။

ခွင့်ပြုချက် စစ်ဆေးမှုများကို တက်ကြွသော runtime validator က အကောင်အထည်ဖော်ပေးသည်။ အောက်ပါ token အမျိုးအစားနာမည်များသည် စံသတ်မှတ်ထားသည့် မူဝါဒမျက်နှာပြင်ကိုဖော်ပြသည်၊ သို့သော်ကွန်ရက်တစ်ခုသည် executor ကို အဆင့်မြှင့်ခြင်းအားဖြင့် runtime validation ကိုလိုက်ဖက်အောင် ပြုပြင်နိုင်သည်။

## Default Tokens များ {#default-tokens}

|ခွင့်ပြုချက် လက်မှတ်|ကဏ္ဍ |လုပ်ဆောင်ချက်|
| --- | --- | --- |
|`CanManagePeers` |အဖော်များ|မှတ်ပုံတင်ခြင်း၊ မှတ်ပုံတင်ခြင်း သို့မဟုတ် အခြားနည်းဖြင့် အဖော်များကို စီမံခန့်ခွဲခြင်း။ |
|`CanManageLaneRelayEmergency` |အဖော်များ|အရေးပေါ်လမ်းကြောင်းဆက်သွယ်မှု ထိန်းချုပ်မှုကို စီမံပါ။ |
|`CanRegisterDomain` |Domain ကို|Domain တစ်ခု မှတ်ပုံတင်ပါ။|
|`CanUnregisterDomain` |Domain ကို|Domain တစ်ခုကို မှတ်ပုံတင်မထားပါ။ |
|`CanModifyDomainMetadata` |Domain ကို|Domain metadata ကို ပြင်ဆင်ပါ။ |
|`CanRegisterAccount` |အကောင့် |အကောင့်တစ်ခု မှတ်ပုံတင်ပါ။|
|`CanUnregisterAccount` |အကောင့် |အကောင့်တစ်ခုကို မှတ်ပုံတင်မထားပါနဲ့။|
|`CanModifyAccountMetadata` |အကောင့် |Account ရဲ့ metadata ကို ပြင်ပါ။ |
|`CanUnregisterAssetDefinition` |အရင်းအမြစ် သတ်မှတ်ချက် |အရင်းအမြစ် သတ်မှတ်ချက်ကို မှတ်ပုံတင်မထားပါ။ |
|`CanModifyAssetDefinitionMetadata` |အရင်းအမြစ် သတ်မှတ်ချက် |အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက် metadata ကိုပြောင်းလဲပါ။ |
|`CanMintAssetWithDefinition` |အရင်းအမြစ်များ|တိကျတဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်အတွက် ငွေကြေးစက္ကူ အရင်းအမြစ်များ |
|`CanBurnAssetWithDefinition` |အရင်းအမြစ်များ|တိကျတဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်အတွက် အရင်းအမြစ်တွေကို မီးရှို့ပါ။ |
|`CanTransferAssetWithDefinition` |အရင်းအမြစ်များ|တိကျတဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်အတွက် အရင်းအမြစ်လွှဲပြောင်းခြင်း။ |
|`CanMintAsset` |အရင်းအမြစ်များ|တိကျတဲ့ အရင်းအမြစ် ဘားလန်ကို လုပ်ပါ။ |
|`CanBurnAsset` |အရင်းအမြစ်များ|တိကျတဲ့ အရင်းအမြစ် balance ကို မီးရှို့ပါ။|
|`CanTransferAsset` |အရင်းအမြစ်များ|တိကျတဲ့ အရင်းအမြစ်စာရင်းကို လွှဲပြောင်းပါ။ |
|`CanRegisterNft` |NFT |NFT ကို မှတ်ပုံတင်ပါ။|
|`CanUnregisterNft` |NFT |NFT စာရင်းကို ဖျက်သိမ်းပါ။ |
|`CanTransferNft` |NFT |NFT ကို လွှဲပြောင်းပါ။ |
|`CanModifyNftMetadata` |NFT |NFT metadata ကို ပြင်ဆင်ပါ။ |
|`CanSetParameters` |ပမာဏများ |Chain ပေါ်က Configuration Parameters ကို သတ်မှတ်ပါ။ |
|`CanManageRoles` |ကဏ္ဍများ |မှတ်ပုံတင်၊ မမှတ်ပုံတင်၊ ပေးအပ်ခြင်း သို့မဟုတ် ရုပ်သိမ်းခြင်း။ |
|`CanRegisterTrigger` |Trigger ကို|trigger တစ်ခုကို မှတ်တမ်းတင်ပါ။|
|`CanExecuteTrigger` |Trigger ကို|ထိုးထည့်လိုက်ပါ|
|`CanUnregisterTrigger` |Trigger ကို|trigger ကို unregister လုပ်ပါ။ |
|`CanModifyTrigger` |Trigger ကို|Trigger Configuration ကို ပြုပြင်ပါ။|
|`CanModifyTriggerMetadata` |Trigger ကို|trigger metadata ကို ပြင်ပါ။ |
|`CanUpgradeExecutor` |အမိန့်ချမှတ်သူ |Runtime အကောင်အထည်ဖော်ရေးကို အဆင့်မြှင့်ပါ။|
|`CanRegisterSmartContractCode` |အသိဉာဏ်ရှိတဲ့ စာချုပ်|Smart Contract Code ကို မှတ်ပုံတင်ပါ။|
|`CanUseFeeSponsor` |Nexus |Nexus အခွန်ကို သတ်မှတ်ထားသော ပံ့ပိုးသူအကောင့်သို့ ချပေးပါ။ |

## ပိုင်ဆိုင်မှု {#ownership}

Owner-sensitive permission tokens များသည် လက်ရှိဒေတာမော်ဒယ်တွင်အသုံးပြုသော canonical object IDs ကိုရည်ညွှန်းရမည်ဖြစ်သည်။ ဥပမာ, account permissions သည် canonical domainless account IDs သို့ရည်ညွှန်းသည်။ domain permissions သည် `domain.dataspace` domain IDs သို့ရည်ညွှန်သည်။ နှင့် အရင်းအမြစ် ခွင့်ပြုချက်များသည် ရှေးရိုးအရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုမှု သို့မဟုတ် အရင်းအမြတ် IDs သို့ ရည်ညွှန်းသည်။

ခွင့်ပြုချက်အမှားနဲ့ ငွေပေးချေမှု ကျရှုံးတဲ့အခါ နှစ်ဖက်စလုံးကို စစ်ဆေးပါ။

- ငွေပေးချေမှုကို လက်မှတ်ရေးထိုးတဲ့စာရင်းဟာ မျှော်လင့်ထားရတဲ့ တရားဝင်စာရင်းပါ။
- ညွှန်ကြားချက်မှာ အသုံးပြုတဲ့ တိကျတဲ့ အရာဝတ္ထု ID အတွက် ခွင့်ပြုချက် လက်မှတ် (သို့) အခန်းကဏ္ဍကို ပေးအပ်ထားတာပါ။
