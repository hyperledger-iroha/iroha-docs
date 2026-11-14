---
translation_locale: my
translation_source: /blockchain/instructions.md
translation_source_hash: 86d253317376ad8d7a8c0e30689c7e0c0cd786af83299dd5ac1a904c653192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha ညွှန်ကြားမှု လုပ်ငန်းများ {#iroha-special-instructions}

[Iroha အလုပ်လုပ်ပုံ](/my/blockchain/iroha-explained) ကို ရှင်းပြစဉ် Iroha Special Instructions သည် world state ကို ပြင်ဆင်ရန် တစ်ခုတည်းသော နည်းလမ်းဖြစ်ကြောင်း ပြောခဲ့သည်။ ထို့ကြောင့် မည်သည့် အထူးညွှန်ကြားချက်များ ရှိသနည်း။ ဤသင်ခန်းစာရှိ ဘာသာစကားတစ်ခုစီအတွက် လမ်းညွှန်များကို ဖတ်ပြီးလျှင် `Register<Account>` နှင့် `Mint<Numeric>` ဟူသော ညွှန်ကြားချက်နှစ်ခုကို တွေ့ပြီးဖြစ်မည်။

Iroha သင်ကြားမှု လုပ်ငန်းများ၏ အပြည့်အစုံစာရင်းကို ဖော်ပြပါသည်-

|ညွှန်ကြားချက်|သရုပ်ဖော်ချက်များ |
| --------------------------------------------------------- | ------------------------------------------------ |
|[မှတ်ပုံတင်/မမှတ်ပုံတင်ခြင်း](#un-register) |blockchain ပေါ်က entity အသစ်ကို ID ပေးပါ။ |
|[Mint/Burn](#mint-burn) |Mint/burn ကိန်းဂဏန်းအရင်းအမြစ်များ (သို့) trigger ထပ်ကျော့ခြင်း။ |
|[SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |blockchain object metadata ကို update လုပ်ပါ။ |
|[SetParameter](#setparameter) |Chainwide parameter ကို သတ်မှတ်ပါ။ |
| [Grant/Revoke](#grant-revoke) | ခွင့်ပြုချက်များနှင့် role များကို ပေးအပ်ခြင်း သို့မဟုတ် ဖယ်ရှားခြင်း။ |
|[လွှဲပြောင်းခြင်း](#transfer) |ပိုင်ဆိုင်မှု သို့မဟုတ် အရင်းအမြစ်တန်ဖိုး လွှဲပြောင်းခြင်း။ |
|[ရင်းနှီးမြှုပ်နှံမှု (native escrow) နှင့် အရင်းအမြစ်ပိတ်ခြင်း](#native-escrow-and-asset-locks) |ပရိုတိုကောလစ် ထိန်းသိမ်းမှုမှာ ကိန်းဂဏန်းအရင်းအမြစ်တွေကို Lock လုပ်ပါ။|
| [အက်တမ်နည်းဖြင့် လျှို့ဝှက်ငွေရှင်းခြင်း](#atomic-private-settlement) | လျှို့ဝှက် pool များနှင့် အက်တမ် bundle များကို အုပ်ချုပ်စီမံသည်။ |
|[ExecuteTrigger](#executetrigger) |trigger တွေကို လုပ်ဆောင်ပါ။ |
|[Log/Custom/Upgrade](#other-instructions) |ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် အပြုအမူကို မှတ်တမ်းတင်ခြင်း၊ တိုးချဲ့ခြင်း သို့မဟုတ် အဆင့်မြှင့်ခြင်း။ |

Iroha ညွှန်ကြားမှု လုပ်ဆောင်ချက်တွေရဲ့ အကျဉ်းချုပ်တစ်ခုနဲ့ စရအောင်။ ညွှန်ပြချက်တိုင်းအတွက် ဘယ်အရာတွေကို ခေါ်ယူနိုင်ပြီး အရာတိုင်းအတွက် ဘယ်ညွှန်ကြားချက်တွေ ရနိုင်လဲ။

## အတိုကောက် {#summary}

ညွှန်ကြားချက်တစ်ခုစီအတွက် ဤညွှန်ကြားချက်ကို လုပ်ဆောင်နိုင်သော အရာဝတ္ထုစာရင်းရှိသည်။ ဥပမာ၊ လွှဲပြောင်းမှုဗားရှင်းများသည် ပိုင်ဆိုင်နိုင်သော blockchain လက်မှတ်ကြီးအရာဝတ္ထုများနှင့် နံပါတ်အရင်းအမြစ်များကို ဖုံးအုပ်ထားပြီး ထုတ်ဝေခြင်းသည် နံပါတ် အရင်းအမြစ်ကိုဖုံးအုပ်ထားကာ အကြိမ်ကြိမ်ဖြစ်ပေါ်စေသည်။

အချို့ ညွှန်ကြားချက်များအတွက် ဦးတည်ရာကို သတ်မှတ်ရသည်။ ဥပမာ ပိုင်ဆိုင်မှုများကို လွှဲပြောင်းလျှင် မည်သည့်အကောင့်သို့ လွှဲပြောင်းမည်ကို အမြဲသတ်မှတ်ရသည်။ တစ်ဖက်တွင် တစ်စုံတစ်ရာကို မှတ်ပုံတင်လျှင် မှတ်ပုံတင်လိုသော အရာဝတ္ထုသာ လိုအပ်သည်။

|ညွှန်ကြားချက်|ပစ္စည်းများ |ရည်မှန်းချက် |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) | ပုံမှန် domain၊ data space alias နှင့် အကောင့် alias ပြင်ဆင်တည်ဆောက်ခြင်း | |
|[မှတ်ပုံတင်/မမှတ်ပုံတင်ခြင်း](#un-register) |အကောင့်များ၊ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs, အခန်းကဏ္ဍများ, trigger များ, ကွန်ရက်တူညီသူများ; ဒိုမင်ပယ်ဖျက်ခြင်း |                      |
|[Mint/Burn](#mint-burn) |ကိန်းဂဏန်းအရင်းအမြစ်တွေ၊ အစပျိုးမှု ထပ်ခါထပ်ခါ |အကောင့်များ (သို့) trigger များ|
|[SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[metadata များ](./metadata.md) ရှိသော အရာဝတ္ထုများ: ဒိုမင်များ၊ အကောင့်များ၊ အရင်းအမြစ်ဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs၊ RWAs၊ trigger များ |                      |
|[SetParameter](#setparameter) |ကွင်းဆက် parameters |                      |
| [Grant/Revoke](#grant-revoke) | [role များ၊ ခွင့်ပြုချက် token များ](/my/blockchain/permissions.md) | အကောင့်များ သို့မဟုတ် role များ |
|[လွှဲပြောင်းခြင်း](#transfer) |ဒိုမင်များ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ, ကိန်းဂဏန်းအရင်းအမြစ်များ NFTs |အကောင့်များ|
| [မူလပံ့ပိုးထားသော escrow နှင့် ပိုင်ဆိုင်မှု lock များ](#native-escrow-and-asset-locks) | ကိန်းဂဏန်းပိုင်ဆိုင်မှု escrow များ၊ ပိုင်ဆိုင်မှု lock များ၊ အခြေအနေအလိုက် escrow များ | ဝယ်သူများ၊ ဦးတည်ရာများ သို့မဟုတ် အငြင်းပွားမှု ဖြေရှင်းရာတွင် ခွဲဝေပမာဏများ |
|[အက်တမ် ပုဂ္ဂလိက ဘဏ္ဍာရေး ငွေပေးချေမှု ဖြေရှင်းခြင်း](#atomic-private-settlement) |လမ်းကြောင်းကန့်သတ်ထားတဲ့ လျှို့ဝှက် ပရိုတိုကော ဒေတာအုပ်စုတွေ၊ မူဝါဒလည်ပတ်မှု၊ ပြီးဆုံးတဲ့ ဘက်လ်များနဲ့ ဖျက်သိမ်းရေး အမှတ်တံဆိပ်တွေပါ။|                      |
|[ExecuteTrigger](#executetrigger) |trigger များ|                      |
|[Log/Custom/Upgrade](#other-instructions) |မှတ်တမ်းများ၊ အကောင်အထည်ဖော်သူဆိုင်ရာ အသုံးဝင်ဝန်ဆောင်မှုများ၊ အကောင် အထည်ဖော်မှု အဆင့်မြှင့်တင်ခြင်းများ |                      |

ISI ကို ကြည့်ဖို့ အခြားနည်းလမ်းတစ်ခုလည်းရှိတယ်၊ သူတို့ ထိတွေ့တဲ့ blockchain ledger ပိုင်ဆိုင်မှုအရပါ။

|ရည်မှန်းချက်|ညွှန်ကြားချက်များ|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|အကောင့်|မှတ်ပုံတင်/မမှတ်ပုံတင်စာရင်းများ၊ လက်ခံရရှိမှုအရင်းအမြစ်များ၊ စာရင်း မီတာဒေတာများကို update လုပ်ခြင်း၊ ခွင့်ပြုချက်များ ပေးအပ်/ငြိမ်းသိမ်းခြင်းနှင့် အခန်းကဏ္ဍများ |
| ဒိုမိန်း | ဒိုမိန်းဖွဲ့စည်းမှုကို သေချာစေခြင်း၊ ဒိုမိန်းများကို မှတ်ပုံတင်မှ ပယ်ဖျက်ခြင်း၊ ဒိုမိန်းပိုင်ဆိုင်မှုကို လွှဲပြောင်းခြင်း၊ ဒိုမိန်း မက်တာဒေတာကို ပြင်ဆင်ခြင်း |
| ပိုင်ဆိုင်မှု သတ်မှတ်ချက် | သတ်မှတ်ချက်များကို မှတ်ပုံတင်ခြင်း/မှတ်ပုံတင်ပယ်ဖျက်ခြင်း၊ ပိုင်ဆိုင်မှု လွှဲပြောင်းခြင်း၊ metadata ပြင်ဆင်ခြင်း |
|အရင်းအမြစ်များ|သံပုရာသီး / မီးရှို့မှု ကိန်းဂဏန်းအရေအတွက်၊ လွှဲပြောင်းမှု ကိန်း ဂဏန်း အရေအတွက် |
|ဘဏ္ဍာရေး |ပေးပို့တဲ့ ငွေပေးချေမှုကို ဖွင့်၊ လက်ခံ၊ မှတ်သား၊ ထုတ်လွှတ်၊ ဖျက်သိမ်း၊ အငြင်းပွား၊ ဖြေရှင်း၊ ဆွဲထုတ်၊ ဒါမှမဟုတ် သက်တမ်းကုန်ဆုံးစေတဲ့ မူရင်း ထိန်းသိမ်းမှု မှတ်တမ်းများ|
|NFT |register/unregister NFTs, transfer ownership, update metadata  မှတ်ပုံတင်ခြင်းမရှိ|
|RWA |စာရင်းအင်း၊ လွှဲပြောင်းမှုအရေအတွက်၊ ထိန်းသိမ်း/လွှတ်တင်ခြင်း၊ အေးခဲခြင်း/အေးဆေးခြင်း၊ ပြန်လည်ဖြည့်ဆည်းခြင်း၊ ပေါင်းစပ်ခြင်း၊ မီတာဒေတာများနှင့် ထိန်းချုပ်ချက်များကို ပြင်ဆင်ခြင်း |
| Trigger | မှတ်ပုံတင်ခြင်း/မှတ်ပုံတင်ပယ်ဖျက်ခြင်း၊ trigger ထပ်ခါလုပ်ဆောင်နိုင်မှု အရေအတွက် တိုးခြင်း/လျှော့ခြင်း၊ trigger လုပ်ဆောင်ခြင်း၊ trigger metadata ပြင်ဆင်ခြင်း |
| ကမ္ဘာလုံးဆိုင်ရာ | Peer များနှင့် role များကို မှတ်ပုံတင်ခြင်း/ပယ်ဖျက်ခြင်း၊ ပါရာမီတာများ သတ်မှတ်ခြင်း၊ executor ကို အဆင့်မြှင့်ခြင်း |

## CLI ဥပမာများ {#cli-examples}

ဤစာမျက်နှာရှိ ဥပမာများသည် upstream Iroha workspace မှ command များကို မူလ ဒေသတွင်း client ပြင်ဆင်သတ်မှတ်မှုဖြင့် လုပ်ဆောင်နေသည်ဟု ယူဆသည်။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

`iroha` binary ကို ထည့်သွင်းထားပါက ၎င်းအစား `iroha --config ./defaults/client.toml` ကို သုံးပါ။ Transaction တင်သွင်းသော command များတွင် လက်မှတ်ထိုးသည့် အကောင့်ထံမှ အခကြေးငွေကောက်ခံသည့် `--fee-payer authority` ကိုလည်း ထည့်ပါ။ CLI သည် လက်မှတ်မထိုးမီ အခကြေးငွေအတိအကျကို တွက်ချက်ဖော်ပြသည်။ အောက်ပါ နေရာလွတ်အစားထိုးတန်ဖိုးများကို သင့်ကွန်ရက်၏ တန်ဖိုးများဖြင့် အစားထိုးပါ:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

အများသုံး Taira testnet ကို အသုံးပြုသောအခါ Taira client ပြင်ဆင်သတ်မှတ်မှုကို သုံးပြီး [Taira တွင် Testnet XOR ရယူခြင်း](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ရှိ ကြိုတင်ပြင်ဆင်သည့် faucet လုပ်ငန်းစဉ်ဖြင့် ၎င်း၏ အကောင့်ကို ငွေဖြည့်ပါ။ အခကြေးငွေပေးရသော နမူနာများ မလုပ်ဆောင်မီ အခကြေးငွေသုံး ပိုင်ဆိုင်မှု၏ လက်ကျန်ကို မြင်ရကြောင်း စစ်ဆေးပါ:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Taira ရေးသားမှုများတွင်လည်း `--fee-payer authority` ကို ရွေးချယ်ပြီး CLI သည် Taira ၏ အခကြေးငွေသုံး ပိုင်ဆိုင်မှုဖြင့် အခကြေးငွေကို တွက်ချက်ဖော်ပြသည်။ `gas_asset_id` ကဲ့သို့ အခကြေးငွေဆိုင်ရာ ကီးများကို transaction metadata အဖြစ် မထည့်ပါနှင့်။ Client က ၎င်းတို့ကို ငြင်းပယ်သည်:

```bash
cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --fee-payer authority \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` သည် ပထမထုတ်ဝေမှုတွင် domain များနှင့် ၎င်းတို့၏ SNS ငှားရမ်းခွင့်များ ဖန်တီးရန် ပုံမှန်လမ်းကြောင်းဖြစ်သည်။ ၎င်းက data space အတိအကျ၊ ပိုင်ရှင်၊ ငှားရမ်းသက်တမ်းနှင့် quote စစ်ဆေးချက်တို့ကို ကြေညာသတ်မှတ်ကာ ချည်နှောင်ပြီး လိုအပ်သော အခြေအနေအားလုံးကို ခွဲမရသော လုပ်ဆောင်မှုတစ်ခုအဖြစ် ဖန်တီး သို့မဟုတ် ပြုပြင်သည်။ စစ်မှန်ကြောင်း အတည်ပြုထားသော `POST /v1/aliases/setup/plan` endpoint သို့မဟုတ် ကိုက်ညီသည့် CLI လုပ်ငန်းစဉ်ကို သုံးပါ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./domain.plan.json
```

ရည်ရွယ်ချက်နှင့် အစီအစဉ်သည် လျှို့ဝှက်မှုမရှိသော်လည်း အဆင့်မှတ်သားများကိုအသုံးပြုပြီး သတ်မှတ်ထားသောအကောင့်နှင့်အတူ သာမန် ငွေကြေးလွှဲပြောင်းမှုကိုတင်သွင်းသည်။ အစီအစဉ်တစ်ခုသည် ၎င်း၏ချိတ်ဆက်မှု၊ ခွင့်ပြုချက် မူဝါဒ၊ သက်ရှိအခြေအနေ ancillary နှင့် နောက်ဆုံးအချိန်ကို ချည်နှောင်ထားသည်။ အခြားကွန်ရက်တွင်တစ်ခါမှ ပြန်လည်အသုံးပြုခြင်းမဟုတ်ပါ။

## (Un) မှတ်ပုံတင် {#un-register}

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းသည် blockchain ပေါ်က အဖွဲ့အစည်းသစ်အား ID ပေးရန် အသုံးပြုသည့် ညွှန်ကြားချက်များဖြစ်သည်။

မှတ်ပုံတင်နိုင်သော အရာတိုင်းသည် `Registrable` နှင့် `Identifiable` နှစ်ခုစလုံး ဖြစ်သော်လည်း `Identifiable` ဖြစ်တိုင်း `Registrable` မဖြစ်ပါ။ အများစုကို တိုက်ရိုက် မှတ်ပုံတင်သော်လည်း အချို့ကိစ္စများတွင် blockchain ပေါ်ရှိ ကိုယ်စားပြုဖွဲ့စည်းပုံ၌ ဒေတာ ပိုမိုများပြားသည်။ လုံခြုံရေးနှင့် စွမ်းဆောင်ရည်အတွက် ထိုဒေတာဖွဲ့စည်းပုံများ၌ builder များကို သုံးသည် (ဥပမာ `NewAccount`)။ Peer မှတ်ပုံတင်ခြင်းအတွက်လည်း ကီးပိုင်ဆိုင်ကြောင်း သက်သေပြသည့် သီးသန့်ညွှန်ကြားချက် ရှိသည်။ ယေဘုယျအားဖြင့် မှတ်ပုံတင်နိုင်သော အရာတိုင်းကို မှတ်ပုံတင်ပယ်ဖျက်နိုင်သော်လည်း ယင်းသည် ခြွင်းချက်မရှိသော စည်းမျဉ်း မဟုတ်ပါ။

အကောင့်များ၊ ပိုင်ဆိုင်မှုသတ်မှတ်ချက်များ၊ NFTs များ၊ peer များ၊ role များနှင့် trigger များကို မှတ်ပုံတင်နိုင်သည်။ Domain တည်ဆောက်မှုသည် `EnsureAlias` ကို သုံးသည်။ `Register::Domain` payload အကြမ်းကို genesis သို့မဟုတ် ကနဦးတည်ဆောက်မှုအတွက်သာ သီးသန့်ထားသည်။ Peer မှတ်ပုံတင်မှုသည် peer ကီး ပိုင်ဆိုင်ကြောင်း အထောက်အထားပါသော `RegisterPeerWithPop` ကို သုံးသည်။ အရာဝတ္ထုအမည်များအပေါ် ကန့်သတ်ချက်များကို သိရှိရန် ကျွန်ုပ်တို့၏ [အမည်ပေး စည်းမျဉ်းများ](/my/reference/naming.md) ကို ကြည့်ပါ။

RWA အပိုဒ်များကို သီးသန့် `RegisterRwa` ညွှန်ကြားချက်ဖြင့် ဖန်တီးထားသည်။ လက်ရှိကုဒ်တွင် `UnregisterRwa` ညွှန်ပြချက်ကို ဖော်ပြခြင်းမရှိပေ။ `RedeemRwa` ကို ကိုယ်စားပြုသည့် ပမာဏကို ဖျက်သိမ်းရန် အသုံးပြုပါ။

::: info

`genesis.json` တွင် [genesis ဘလော့ခ်](/my/guide/configure/genesis.md) ကို မည်သို့ တည်ဆောက်မည်ဟူသော ဆုံးဖြတ်ချက်အပေါ် မူတည်၍၊ အထူးသဖြင့် ခွင့်ပြုချက် token များ မှတ်ပုံတင်ခြင်း ပါဝင်မပါဝင်အပေါ် မူတည်၍၊ အကောင့်မှတ်ပုံတင်သည့် လုပ်ငန်းစဉ်သည် အလွန်ကွာခြားနိုင်ကြောင်း သတိပြုပါ။ ယေဘုယျအားဖြင့် အောက်ပါအတိုင်း အကျဉ်းချုပ်နိုင်သည်။

- အများပိုင် blockchain တစ်ခုမှာ ဘယ်သူမဆို အကောင့်တစ်ခုကို မှတ်ပုံတင်နိုင်သင့်ပါတယ်။
- ပုဂ္ဂလိက blockchain တွင် အကောင့်များကို မှတ်ပုံတင်ရန်အတွက် ထူးခြားသော လုပ်ငန်းစဉ်တစ်ခုရှိနိုင်သည်။ သာမန်ပုဂ္ဂလိက Blockchain တွင်၊ ဆိုလိုသည်မှာ အကောင့်များမှတ်ပုံတင်ခြင်းအတွက် ထူးခြားတဲ့ လုပ်ငန်းစဉ်မရှိသည့် blockchain တွင် အခြားအကောင့်တစ်ခုကို မှတ်ပုံတင်ဖို့ အကောင့်တစ်ခုလိုအပ်သည်။

ဒီခြားနားချက်တွေကို [ပုဂ္ဂလိကနဲ့ အများပိုင် blockchain တွေကို နှိုင်းယှဉ်ကြည့်ပါ။](/my/guide/configure/modes.md) မှာ အသေးစိတ် ဆွေးနွေးပါတယ်။

:::

::: info

ကွန်ရက် peer ကို မှတ်ပုံတင်ခြင်းသည် လက်ရှိတွင် ကွန်ရက်သို့ မူလ ယုံကြည်မှုရှိတဲ့ ကွန်ရက် peers ကိုမပါဝင်သော network peers များကို ထည့်သွင်းရန်အတွက် တစ်ခုတည်းသောနည်းလမ်းဖြစ်သည်။

:::

blockchain အရာဝတ္ထုများကို မှတ်ပုံတင်ရန် ဘာသာစကားဆိုင်ရာ လမ်းညွှန်ကို အသုံးပြုပါ။

|ဘာသာစကား|လမ်းညွှန် |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |[Iroha CLI](/my/get-started/operate-iroha-via-cli.md) ကို အသုံးပြုပြီး ဒိုမင်များ ဖန်တီးရန်၊ အကောင့်များနှင့် အရင်းအမြစ်များကို မှတ်ပုံတင်ရန်။ |
|Rust |[Rust သင်ခန်းစာ](/my/guide/tutorials/rust.md) ကို အသုံးပြုပါ။|
|Kotlin/Java |[Kotlin/Java သင်ခန်းစာ](/my/guide/tutorials/kotlin-java.md) ကို အသုံးပြုပါ။|
|Python |[Python သင်ခန်းစာ](/my/guide/tutorials/python.md) ကို အသုံးပြုပါ။|
|JavaScript/TypeScript |[JavaScript/TypeScript သင်ကြားချက်](/my/guide/tutorials/javascript.md) ကို အသုံးပြုပါ။|

သာမန်ဒိုမင်ကို စီစဉ်ပြီး အသုံးချပါ၊ ဒီနောက် domain ကို မလိုအပ်တော့တဲ့အခါမှာ မှတ်ပုံတင်ခြင်းမရှိပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain unregister --id docs.universal
```

မှတ်ပုံတင်စာရင်းများနှင့် မှတ်ပုံတင်ခြင်းမရှိသော စာရင်းများ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account unregister --id "$BOB"
```

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းဆိုင်ရာ အရင်းအမြစ်အနက်ကောက်ချက်များ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition register \
  --domain docs.universal \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition unregister --id "$ASSET_DEF"
```

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်း NFTs. NFT မှတ်ပုံတင်က ၎င်းရဲ့ အကြောင်းအရာကို ဖတ်တယ်။ JSON ပုံမှန် input မှ:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft unregister --id 'badge$docs.universal'
```

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းဆိုင်ရာ အခန်းကဏ္ဍ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role unregister --id operators
```

Register နှင့် unregister trigger များ။ Trigger မှတ်ပုံတင်သည် compiled IVM bytecode သို့မဟုတ် serialized ညွှန်ကြားချက်စာရင်းကိုလိုအပ်သည်။ ဤဥပမာသည် `Log` ညွှန်ပြချက်ကို CLI ဖြင့်တည်ဆောက်ပြီး trigger မှတ်ပုံတွင် pipes ကို:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --emit-instructions \
  tx ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger unregister --id hourly_cleanup
```

Peer များကို မှတ်ပုံတင်ခြင်းနှင့် မှတ်ပုံတင်ပယ်ဖျက်ခြင်း ပြုလုပ်ပါ။ BLS ကီးနှင့် PoP မရှိသေးလျှင် `kagami` ဖြင့် ထုတ်လုပ်ပါ။

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger peer unregister --key "$PEER_KEY"
```

## ပိုင်ဆိုင်မှု ထပ်မံထုတ်ဝေခြင်းနှင့် ဖျက်သိမ်းခြင်း {#mint-burn}

ထုတ်ဝေခြင်းနှင့် ဖျက်ဆီးခြင်းသည် ကိန်းဂဏန်းအရင်းအမြစ်များကို ရည်ညွှန်းနိုင်ပြီး အကြိမ်ကြိမ်ပြုလုပ်မှု အနည်းအကျဉ်းရှိသည့် trigger များဖြစ်သည်။ asset တစ်ချို့ကို non-mintable အဖြစ်ကြေညာနိုင်သည်မှာ မှတ်ပုံတင်ပြီးနောက်တစ်ကြိမ်သာ ထုတ်ပြန်နိုင်ခြင်းဖြစ်သည်။

အရင်းအမြစ်များကို သီးခြားစာရင်းတစ်ခုသို့ ထုတ်လွှင့်ခြင်းဖြစ်သည်၊ ယေဘုယျအားဖြင့်အရင်းအမြစ်ကို ပထမဆုံး မှတ်ပုံတင်ထားသောစာရင်းဖြစ်သည်။ အရင်းအမြတ်ပမာဏများသည် အပျက်သဘောမဟုတ်သည့်အတွက် သင်တစ်ခါမှ `$-1.0` အရင်းအမြစ်ကိုမပိုင်ဆိုင်နိုင်ပါ။ (သို့) အပျက်သဘောပမာဏကိုဖျက်ဆီးပြီးထုတ်ပြန်မှုရယူနိုင်ပါ။

Blockchain အရင်းအမြစ်များကို ထုတ်ဝေရန် ဘာသာစကားဆိုင်ရာ လမ်းညွှန်ကို အသုံးပြုပါ။

- [CLI](/my/get-started/operate-iroha-via-cli.md)
- [Rust](/my/guide/tutorials/rust.md)
- [Kotlin/Java](/my/guide/tutorials/kotlin-java.md)
- [Python](/my/guide/tutorials/python.md)
- [JavaScript/TypeScript](/my/guide/tutorials/javascript.md)

ငွေကြေးကို ဖျက်ဆီးခြင်းရဲ့ နမူနာတွေကတော့-

- [CLI](/my/get-started/operate-iroha-via-cli.md)
- [Rust](/my/guide/tutorials/rust.md)

ကိန်းဂဏန်းအရင်းအမြစ်များကို ထုတ်ပေးခြင်းနှင့် ဖျက်ဆီးခြင်း၊

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

trigger repeat တွေကို ထုတ်ပေးပြီး ဖျက်ဆီးပေးပါ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger burn --id hourly_cleanup --repetitions 1
```

## လွှဲပြောင်းခြင်း {#transfer}

ငွေလွှဲပြောင်းခြင်းသည် ပိုင်ဆိုင်မှု (သို့) တန်ဖိုးကို အကောင့်များအကြား ရွေ့လျားစေသည်။ ယေဘုယျငွေလွှဲပြောင်းမှု ဗားရှင်းများသည် ဒိုမင်များ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ၊ ကိန်းဂဏန်းအရင်းအမြစ်များ၊ နှင့် NFTs. RWA အရေအတွက်လှုပ်ရှားမှု dedicated ကိုအသုံးပြုသည် `TransferRwa` နှင့် `ForceTransferRwa` ညွှန်ကြားချက်များ [လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ](/my/blockchain/rwas.md).

ဒါလုပ်ဖို့ အကောင့်တစ်ခု ပေးဖို့လိုပါတယ်။ [အရင်းအမြစ်လွှဲပြောင်းခွင့်](/my/reference/permissions.md). အရင်းအမြစ်တွေကို ဘယ်လို လွှဲပြောင်းရမလဲဆိုတဲ့ ဥပမာကို ကြည့်ပါ။ [CLI](/my/get-started/operate-iroha-via-cli.md) ဒါမှမဟုတ် [Rust](/my/guide/tutorials/rust.md).

ကိန်းဂဏန်းအရင်းအမြစ်များ လွှဲပြောင်းခြင်း

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Transfer domain၊ asset definition နဲ့ NFT ပိုင်ဆိုင်မှု:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Native Escrow နှင့် Asset Lock များ {#native-escrow-and-asset-locks}

မူလပံ့ပိုးထားသော escrow ညွှန်ကြားချက်များသည် ကိန်းဂဏန်းပိုင်ဆိုင်မှုများကို လယ်ဂျာက စီမံခန့်ခွဲသော ပရိုတိုကော ထိန်းသိမ်းမှုတွင် lock လုပ်ထားသည်။ ၎င်းတို့ကို စျေးကွက်ပုံစံ ငွေစာရင်းရှင်းလင်းမှု၊ ယေဘုယျ ပိုင်ဆိုင်မှု lock များနှင့် သက်သေခံအတည်ပြုသူနှင့် ချိတ်ဆက်ထားသော အခြေအနေအလိုက် escrow များအတွက် အသုံးပြုသည်။

စျေးကွက် escrow သည် `OpenAssetEscrow`၊ `AcceptAssetEscrow`၊ `MarkEscrowPaymentSent`၊ `ReleaseAssetEscrow`၊ `CancelAssetEscrow`၊ `OpenEscrowDispute` နှင့် `ResolveEscrowDispute` ကို အသုံးပြုသည်။ ယေဘုယျ ပိုင်ဆိုင်မှု lock များသည် `OpenAssetLock`၊ `DrawdownAssetLock`၊ `CancelAssetLock` နှင့် `ExpireAssetLock` ကို အသုံးပြုသည်။ အခြေအနေအလိုက် escrow သည် `OpenConditionalEscrow`၊ `AttestEscrowCondition` နှင့် `ExpireConditionalEscrow` ကို အသုံးပြုသည်။

ဤ ISIs များမှာ လက်ရှိတွင်ပထမတန်းစား CLI commands မရှိပါ။ ရိုက်နှိပ်ထားသော SDK builders သို့မဟုတ် serialized instruction payloads ကိုအသုံးပြုပြီး ဘဝပတ်လည် အသေးစိတ်၊ ခွင့်ပြုချက်များ၊ မေးမြန်းမှုများ၊ အဖြစ်အပျက်များနှင့် Rust နမူနာများအတွက် [ပိုင်ဆိုင်မှုများကို စံညွှန်ကြားချက်ဖြင့် ကြားခံထိန်းသိမ်းခြင်း](/my/blockchain/escrow.md) ကိုကြည့်ပါ။

## Atomic ပုဂ္ဂလိက ဘဏ္ဍာရေး ငွေပေးချေမှု ဖြေရှင်းခြင်း {#atomic-private-settlement}

ထိန်းချုပ်ထားတဲ့ အက်တမ်-ပုဂ္ဂလိက settlement ညွှန်ကြားချက်မိသားစုဟာ ပွင့်လင်းမြင်သာတဲ့ Native AMX ကနေ ခွဲခြားထားတယ်။ `ActivatePrivateSettlementPoolV1` ဟာ တည်းဖြတ်ထားတဲ့ အုပ်ချုပ်မှု ပရောဂျက်နဲ့ Single Protocol Standard origin cryptographic commitment တန်ဖိုးတွေကနေ လမ်းကြောင်းအချိုးအစားတစ်ခုရှိတဲ့ လျှို့ဝှက်ပရိုတိုကုတ်ဒေတာအုပ်စုတစ်ခုကို သတ်မှတ်ပါတယ်။ `FinalizeAtomicPrivateSettlementV1` ကော်မတီက အသိအမှတ်ပြုထားတဲ့ အစုတစ်ခုလုံးကို အက်တမ်နည်းနဲ့ အသုံးချပြီး `AbortAtomicPrivateSettlementV1` က ပံ့ပိုးသူက ခွင့်ပြုတဲ့ အများပြည်သူ terminal marker ကိုသာ ထုတ်ဝေပါတယ်။

`RotatePrivateSettlementPoolPolicyV1` ကို ကိုယ်ရေးလုံခြုံမှုဆိုင်ရာ အုပ်ချုပ်မှုအတွက်သာ ကန့်သတ်ထားသည်။ ၎င်းသည် လက်ရှိ အုပ်ချုပ်မှု digest အတိအကျကို လိုအပ်ပြီး လမ်းကြောင်း၊ pool၊ ပိုင်ဆိုင်မှုချည်နှောင်မှု ကတိပြုတန်ဖိုး၊ အခြေအနေ frontier၊ ပြန်လည်လုပ်ဆောင်မှု အစုများနှင့် အပြီးသတ်ထားသော receipt များကို ထိန်းသိမ်းသည်။ အများမြင် revision ကို တစ်တိုးပြီး ပိုသစ်သော auditor ကီး epoch ကို သုံးသည်။ အစားထိုးမှုသည် ၎င်းပါဝင်သော ဘလော့ခ်အမြင့်တွင် အသက်ဝင်ပြီး တူညီသော လမ်းကြောင်း/pool အတွက် receipt နှင့် ထိုအမြင့်ကို မျှဝေနိုင်ပါ။ အများမြင် revision မျိုးဆက်မှတ်တမ်းကြောင့် အစားထိုးမှုမတိုင်မီ အပြီးသတ်ထားသော receipt များသည် ပြန်စတင်ပြီးနောက်လည်း မှန်ကန်နေကာ အတိအကျ ပြန်လည်လုပ်ဆောင်လျှင် ရလဒ်မပြောင်းပါ။ လုပ်ဆောင်ဆဲ မူဝါဒဟောင်း bundle များကို မလက်ခံဘဲ ပိတ်ပင်သည်။ အော်ပရေတာများသည် သိမ်းထားသော capsule များအတွက် စာဝှက်ဖြည်ကီးဟောင်းများကို ထိန်းသိမ်းရမည်၊ သို့မဟုတ် ထိုကီးများကို မဖျက်ဆီးမီ capsule များကို ကီးအသစ်ဖြင့် ပြန်ထုပ်ပိုးခြင်းအား အုပ်ချုပ်မှုအရ အတည်ပြုပြီး စမ်းသပ်ရမည်။

ဤလမ်းကြောင်းကို ပုံသေအားဖြင့် ပိတ်ထားပြီး ထုတ်လုပ်ရေးသုံး အရည်အချင်းစစ် အတည်ပြုမပြီးသေးပါ။ ပြင်ဆင်သတ်မှတ်မှု၊ authority၊ စာရင်းစစ်၊ ပြန်လည်ရယူမှုနှင့် ထုတ်ဝေမှု လိုအပ်ချက်များကို [Data Space များအကြား အက်တမ်သဘောရှိသော သီးသန့် ငွေစာရင်းရှင်းလင်းမှု လုပ်ဆောင်ခြင်း](/my/get-started/atomic-private-settlement) တွင် ကြည့်ပါ။

## ထောက်ပံ့မှု / ပြန်လည်သိမ်းဆည်းခြင်း {#grant-revoke}

ငွေပေးချေခြင်းနှင့် ပြန်လည်သိမ်းဆည်းခြင်းဆိုင်ရာ ညွှန်ကြားချက်များကို [ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍများ](permissions.md) သို့ အသုံးပြုသည်။

`Grant` ကို အသုံးပြုသူအား ခွင့်ပြုချက် တစ်ခုတည်း (သို့) ခွင့်ပြုမှု အုပ်စုတစ်ခု ("ခန်းကဏ္ဍ") ကို အမြဲတမ်းပေးရန်အသုံးပြုသည်။ ပေးအပ်သောခန်းကဏ္ဍများနှင့် ခွင့်ပြုချက်ကို `Revoke` ညွှန်ကြားချက်မှသာ ဖယ်ရှားနိုင်သည်။ ထို့ကြောင့် ဤညွှန်ကြားချက်များကို ဂရုစိုက်စွာ သုံးသင့်သည်။

အကောင့်တစ်ခုပေါ်က အခန်းကဏ္ဍကို ထောက်ပံ့ပြီး ရုပ်သိမ်းခြင်း

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account role revoke --id "$BOB" --role operators
```

ခွင့်ပြုချက် လက်မှတ်များအား ပေးအပ်ခြင်းနှင့် ပယ်ဖျက်ခြင်း။ ခွင့်ပြုမှု အမိန့်များတွင် ခွင့်ပြုချက်တွေ ရှိသည့် အရာဝတ္ထုကို ပုံမှန် input မှ ဖတ်ရှုနိုင်ပါသည်။

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account permission revoke --id "$BOB"
```

အခန်းကဏ္ဍတစ်ခုအတွက် ခွင့်ပြုချက်ပေးပြီး ရုပ်သိမ်းခြင်း:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

ဤညွှန်ကြားချက်များမှာ [metadata များ](/my/blockchain/metadata.md) အရာဝတ္ထုကို update လုပ်ပါ။ metadata entry ကိုထည့်သွင်းရန် သို့မဟုတ် အစားထိုးရန် `SetKeyValue` ကို အသုံးပြုပြီး `RemoveKeyValue` ကို delete လုပ်ပါ။

Metadata `set` command တွေမှာ Standard input ကနေ JSON တန်ဖိုးကို ဖတ်တယ်။

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain meta remove --id docs.universal --key environment
```

စာရင်းများ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs, RWAs နှင့် trigger များအတွက်လည်း အလားတူပုံစံရှိသည်-

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` သည် Active Data Model နှင့် executor တို့က ထုတ်လွှင့်ထားသော Chainwide Parameters များကို ပြောင်းလဲစေသည်။

Standard input မှာ single parameter JSON object တစ်ခုကို ဖြတ်ပြီး parameter ကို သတ်မှတ်ပေးပါ

```bash
printf '{"Sumeragi":{"MaxClockDriftMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ဒီညွှန်ကြားချက်ကို [trigger များ](./triggers.md) လုပ်ဖို့ အသုံးပြုတယ်။

CLI သည် ပုံသေ `execute` စစ်ထုတ်မှုဖြင့် မှတ်ပုံတင်ထားသော trigger အတွက် ကိုယ်တိုင်စတင်လုပ်ဆောင်မည့် `ExecuteTrigger` ညွှန်ကြားချက်ကို တင်သွင်းသည်။ လိုအပ်ပါက JSON argument များ ထည့်နိုင်ပြီး trigger လုပ်ဆောင်မှု ဖြစ်ရပ်များကိုလည်း စာရင်းသွင်းစောင့်ကြည့်နိုင်သည်:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger execute docs_on_call --args-json '{"reason":"manual run"}'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events --timeout 30s trigger-execute
```

## အခြားညွှန်ကြားချက်များ {#other-instructions}

Iroha သည် software execution environment နှင့် executor integration တို့အတွက် အောက်ခြေအဆင့် ညွှန်ကြားချက်များကိုလည်း ဖော်ပြထားသည်။

- `Log`: အကောင်အထည်ဖော်မှုအတွင်း မှတ်ပုံတင်မှတ်တမ်းကို ထုတ်လွှင့်ပါ။
- `CustomInstruction`: အကောင်အထည်ဖော်သူအတွက် အထူး အသုံးဝင်သော ဝန်ဆောင်မှုများ JSON ကို သယ်ယူပို့ဆောင်ခြင်း
- `Upgrade`: အကောင်အထည်ဖော်သူ အဆင့်မြှင့်တင်မှုကို ဖွင့်ပါ။

`Log` ညွှန်ကြားချက်ကို ping အကူနဲ့တင်ပြပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  tx ping --log-level INFO --msg "hello from docs"
```

`InstructionBox` အဖြစ် custom executor ညွှန်ကြားချက်ကို တင်ပါ။ အသုံးဝင်ဝန်ဆောင်မှုပုံစံက executor-specific ဖြစ်သည်၊ ထို့ကြောင့် ညွှန်ပြချက်ကို ကိုက်ညီသော SDK သို့မဟုတ် executor tooling ဖြင့်ထုတ်လုပ်ပါ:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  tx stdin
```

IVM bytecode file တစ်ခုမှ အကောင်အထည်ဖော်သူကို အဆင့်မြှင့်တင်ပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
