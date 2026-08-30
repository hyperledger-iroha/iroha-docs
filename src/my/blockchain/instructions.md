---
translation_locale: my
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Iroha အထူးညွှန်ကြားချက်များ {#iroha-special-instructions}

ကျွန်မတို့ ပြောခဲ့တုန်းက [ဘယ်လို Iroha လုပ်ဆောင်ချက်များ](/my/blockchain/iroha-explained), ကျွန်တော်တို့ ပြောခဲ့တာက Iroha အထူး ညွှန်ကြားချက်တွေက ကမ္ဘာ့နိုင်ငံကို ပြောင်းလဲဖို့ တစ်ခုတည်းသောနည်းလမ်းပါ။ ဒီတော့ ဒီသင်ခန်းစာထဲက ဘာသာစကားဆိုင်ရာ လမ်းညွှန်ချက်တွေကို ဖတ်ခဲ့ရင် သင်ဟာ ညွှန်ကြားချက် အချို့ကို မြင်ပြီးသားပါ။ `Register<Account>` နှင့် `Mint<Numeric>`.

Iroha အထူးညွှန်ကြားချက်များ အပြည့်အစုံကို အောက်ပါအတိုင်း ဖော်ပြထားပါသည်။

|ညွှန်ကြားချက်|သရုပ်ဖော်ချက်များ |
| --------------------------------------------------------- | ------------------------------------------------ |
| [မှတ်ပုံတင်/ပိတ်မှတ်ပုံတင် ](#un-register) |ID ကို blockchain ပေါ်က entity အသစ်ကို ပေးပါ။ |
| [Mint/Burn](#mint-burn) |Mint/burn ကိန်းဂဏန်းအရင်းအမြစ်များ (သို့) trigger ထပ်ကျော့ခြင်း။ |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |blockchain object metadata ကို update လုပ်ပါ။ |
| [SetParameter](#setparameter) |Chainwide parameter ကို သတ်မှတ်ပါ။ |
| [Grant/Revoke ](#grant-revoke) |ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍများကို ပေးပါ (သို့) ဖယ်ရှားပါ|
| [လွှဲပြောင်းခြင်း ](#transfer) |ပိုင်ဆိုင်မှု သို့မဟုတ် အရင်းအမြစ်တန်ဖိုး လွှဲပြောင်းခြင်း။ |
| [Native escrow နှင့် asset lock များ ](#native-escrow-and-asset-locks) |ပရိုတိုကောလစ် ထိန်းသိမ်းမှုမှာ ကိန်းဂဏန်းအရင်းအမြစ်တွေကို Lock လုပ်ပါ။|
| [အက်တမ်မစ် သီးသန့် စာရင်းရှင်းလင်းမှု](#atomic-private-settlement) | လျှို့ဝှက် pool များနှင့် အက်တမ်မစ် bundle များကို အုပ်ချုပ်သည်။ |
| [ExecuteTrigger](#executetrigger) |trigger တွေကို လုပ်ဆောင်ပါ။ |
| [Log/Custom/Upgrade](#other-instructions) |Runtime အပြုအမူကို မှတ်တမ်းတင်၊ တိုးချဲ့ (သို့) အဆင့်မြှင့်ပါ။ |

Iroha အထူးညွှန်ကြားချက်တွေရဲ့ အကျဉ်းချုပ်တစ်ခုနဲ့ စရအောင်။ ညွှန်ကြားချက်တိုင်းမှာ ဘယ်အရာတွေကို ခေါ်ယူနိုင်ပြီး အရာတိုင်းအတွက် ဘယ်လို ညွှန်ပြချက်တွေ ရနိုင်လဲ။

## အတိုကောက် {#summary}

ညွှန်ကြားချက်တစ်ခုစီအတွက် ဤညွှန်ကြားချက်ကို လုပ်ဆောင်နိုင်သော အရာဝတ္ထုစာရင်းရှိသည်။ ဥပမာ၊ လွှဲပြောင်းမှုဗားရှင်းများသည် ပိုင်ဆိုင်နိုင်သောအမှတ်တံဆိပ်အရာဝတ္ထုများနှင့် ကိန်းဂဏန်းအရင်းအမြစ်များကို ဖုံးအုပ်ထားပြီး minting သည်ကိန်းဂဏန်း အရင်းအမြစ်ကိုဖုံးအုပ်ထားကာ အကြိမ်ကြိမ်ဖြစ်ပွားမှုကို ဖြစ်ပေါ်စေသည်။

တစ်ချို့ ညွှန်ကြားချက်တွေမှာ ရည်မှန်းချက်တစ်ခု သတ်မှတ်ဖို့ လိုအပ်ပါတယ်။ ဥပမာ၊ ပိုင်ဆိုင်မှုတွေကို လွှဲပြောင်းရင် ဘယ်အကောင့်ကို လွှဲပြောင်းနေလဲဆိုတာ အမြဲသတိပေးဖို့လိုတယ်။ အခြားတစ်ဖက်မှာ တစ်ခုခု မှတ်ပုံတင်တဲ့အခါ သင်လိုအပ်တာက မှတ်ပုံတင်ချင်တဲ့ အရာဝတ္ထုပါ။

|ညွှန်ကြားချက်|ပစ္စည်းများ |ရည်မှန်းချက် |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |သာမန်ဒိုမင်၊ ဒေတာနေရာ-အမည်များနှင့် အကောင့်-အမည်တပ်ဆင်ခြင်း |                      |
| [မှတ်ပုံတင်/ပိတ်မှတ်ပုံတင် ](#un-register) |အကောင့်များ၊ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs, အခန်းကဏ္ဍများ, trigger များ၊ peers များ; ဒိုမင်ပယ်ဖျက်ခြင်း |                      |
| [Mint/Burn](#mint-burn) |ကိန်းဂဏန်းအရင်းအမြစ်တွေ၊ အစပျိုးမှု ထပ်ခါထပ်ခါ |အကောင့်များ (သို့) trigger များ|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[ metadata ](./metadata.md) ရှိသောအရာများ: ဒိုမင်များ, အကောင့်များ, အရင်းအမြစ်အနက်ကောက်ချက်များ, NFTs, RWAs, trigger များ |                      |
| [SetParameter](#setparameter) |ကွင်းဆက် parameters |                      |
| [Grant/Revoke ](#grant-revoke) | [ကဏ္ဍများ၊ ခွင့်ပြုချက် လက်မှတ်များ ](/my/blockchain/permissions.md) |အကောင့်များ သို့မဟုတ် အခန်းကဏ္ဍများ |
| [လွှဲပြောင်းခြင်း ](#transfer) |ဒိုမင်များ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ, ကိန်းဂဏန်းအရင်းအမြစ်များ NFTs |ငွေစာရင်းများ|
| [Native escrow နှင့် asset lock များ ](#native-escrow-and-asset-locks) |ကိန်းဂဏန်းအရ အရင်းအမြစ် အချုပ်အခြာများ၊ ရင်းနှီးမြှုပ်နှံမှု ပိတ်သိမ်းချက်များ၊ အမည်မသိ အချုပ်အခမဲ့ ချေးငွေချေးခြင်း |ဝယ်ယူသူတွေ၊ ခရီးသွားနေရာတွေ (သို့) အငြင်းပွားမှု ကွဲပြားမှု |
| [အက်တမ်မစ် သီးသန့် စာရင်းရှင်းလင်းမှု](#atomic-private-settlement) | route အလိုက် လျှို့ဝှက် pool များ၊ policy rotation များ၊ finalize လုပ်ပြီး bundle များနှင့် abort marker များ | |
| [ExecuteTrigger](#executetrigger) |trigger များ|                      |
| [Log/Custom/Upgrade](#other-instructions) |မှတ်တမ်းများ၊ အကောင်အထည်ဖော်သူဆိုင်ရာ အသုံးဝင်ဝန်ဆောင်မှုများ၊ အကောင် အထည်ဖော်မှု အဆင့်မြှင့်တင်ခြင်းများ |                      |

ISI ကို ကြည့်ဖို့ အခြားနည်းလမ်းတစ်ခုလည်းရှိတယ်၊ သူတို့ ထိတွေ့တဲ့ စာရင်းအင်းအရာဝတ္ထုနဲ့ ပတ်သက်ပြီးပါ။

|ရည်မှန်းချက်|ညွှန်ကြားချက်များ|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|အကောင့် |မှတ်ပုံတင်/မမှတ်ပုံတင်စာရင်းများ၊ လက်ခံရရှိမှုအရင်းအမြစ်များ၊ စာရင်း မီတာဒေတာများကို update လုပ်ခြင်း၊ ခွင့်ပြုချက်များ ပေးအပ်/ငြိမ်းသိမ်းခြင်းနှင့် အခန်းကဏ္ဍများ |
|Domain ကို|ဒိုမင်စီမံခန့်ခွဲမှုကို သေချာစေရန်၊ ဒိုမိုင်းများကို မှတ်ပုံတင်ခြင်းမရှိစေရန်၊ဒိုမင်ပိုင်ဆိုင်မှုကို လွှဲပြောင်းပေးရန်၊ဒୋမင်မီတာဒေတာကို update လုပ်ပေးရန် |
|အရင်းအမြစ် သတ်မှတ်ချက် |Register/unregister definitions, transfer ownership, update metadata  မှတ်ပုံတင်ခြင်း / မှတ်ပုံတင်မလုပ်ခြင်း|
|အရင်းအမြစ်များ|သံပုရာသီး / မီးရှို့မှု ကိန်းဂဏန်းအရေအတွက်၊ လွှဲပြောင်းမှု ကိန်း ဂဏန်း အရေအတွက် |
|ဘဏ္ဍာရေး |ပေးပို့တဲ့ ငွေပေးချေမှုကို ဖွင့်၊ လက်ခံ၊ မှတ်သား၊ ထုတ်လွှတ်၊ ဖျက်သိမ်း၊ အငြင်းပွား၊ ဖြေရှင်း၊ ဆွဲထုတ်၊ ဒါမှမဟုတ် သက်တမ်းကုန်ဆုံးစေတဲ့ မူရင်း ထိန်းသိမ်းမှု မှတ်တမ်းများ|
|NFT |register/unregister NFTs, transfer ownership, update metadata  မှတ်ပုံတင်ခြင်းမရှိ|
|RWA |စာရင်းအင်း၊ လွှဲပြောင်းမှုအရေအတွက်၊ ထိန်းသိမ်း/လွှတ်တင်ခြင်း၊ အေးခဲခြင်း/အေးဆေးခြင်း၊ ပြန်လည်ဖြည့်ဆည်းခြင်း၊ ပေါင်းစပ်ခြင်း၊ မီတာဒေတာများနှင့် ထိန်းချုပ်ချက်များကို ပြင်ဆင်ခြင်း |
|Trigger ကို|register/unregister, mint/burn trigger repetitions, execute trigger, update trigger metadata များကို မှတ်ပုံတင်ရန်|
|ကမ္ဘာကြီး|register/unregister peers and roles, parameters set, executor ကို upgrade လုပ်ပေး |

## CLI ဥပမာများ {#cli-examples}

ဤစာမျက်နှာတွင်ပြထားသောဥပမာများသည် သင်သည် upstream Iroha လုပ်ငန်းခွင်မှ command များကို default ဒေသခံ client ဖွဲ့စည်းမှုနှင့်ဆန့်ကျင်၍ run လုပ်နေသည်ဟု ယူဆပါ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

`iroha` ဘိုင်နရီကို တပ်ဆင်ထားပါက `iroha --config ./defaults/client.toml` ကို အသုံးပြုပါ။ အောက်ပါ နေရာထိန်းကိရိယာတွေကို ကွန်ရက်ထဲက တန်ဖိုးတွေနဲ့ အစားထိုးပါ။

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

လူထုကို ပစ်မှတ်ထားတဲ့အခါ Taira testnet ကိုသုံးပါ Taira အခွန်ပေးတဲ့ ဥပမာတွေကို မဖွင့်ခင် faucet helper ကို Save လုပ်ပါ။ [Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) အတိုင်း `taira_faucet_claim.py`, ထို့နောက် claim testnet XOR ရေပိုက်ကနေ:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Faucet မှ ရင်းနှီးမြှုပ်နှံထားသော အရင်းအမြစ်ကို မြင်နိုင်ပြီးနောက်၊ လိုအပ်တဲ့ ဓာတ်ငွေ့အရင်းအမြစ် metadata ကို ချိတ်ဆက်၍ ငွေကြေးလုပ်ငန်းများကို ရေးသားပါ-

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` သည်ဒိုမင်များနှင့် ၎င်းတို့၏ SNS ငှားရမ်းမှုအတွက် ပုံမှန်ပထမဆုံးထုတ်ဝေခြင်းလမ်းကြောင်းဖြစ်သည်။ ၎င်းသည်တိကျသော ဒေတာနေရာ၊ ပိုင်ရှင်၊ ငှားရန်သက်တမ်းနှင့် quote guard ကိုကြေညာချက်အရ ချည်နှောင်ပြီးနောက်လိုအပ်သည့်အခြေအနေအားလုံးကို အက်တမ်နည်းဖြင့်ဖန်တီး (သို့မဟုတ် ပြင်ဆင်သည်။) စစ်ဆေးထားတဲ့ `POST /v1/aliases/setup/plan` အဆုံးမှတ် (သို့) ကိုက်ညီတဲ့ CLI အလုပ်ဖြစ်စဉ်ကို အသုံးပြုပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

ရည်ရွယ်ချက်နှင့် အစီအစဉ်သည် လျှို့ဝှက်မှုမရှိသော်လည်း ခြေလှမ်းမှတ်သားများကိုအသုံးပြုပြီး သတ်မှတ်ထားသောစာရင်းနှင့်အတူ သာမန် ငွေပေးချေမှုကိုတင်သွင်းသည်။ စီမံကိန်းတစ်ခုသည် ၎င်း၏ကွင်းဆက်၊ အာဏာ၊ live-state ancillary နှင့် နောက်ဆုံးရက်သို့ ချည်နှောင်နေသည်; အခြားကွန်ရက်တွင်တစ်ခါမှ ပြန်လည်သုံးစွဲခြင်းမဟုတ်။

## (Un) မှတ်ပုံတင် {#un-register}

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းသည် ID ကို blockchain ပေါ်က အဖွဲ့အစည်းသစ်အား ပေးအပ်ရန် အသုံးပြုသော ညွှန်ကြားချက်များဖြစ်သည်။

မှတ်ပုံတင်လို့ရတဲ့ အရာတိုင်းဟာ `Registrable` နဲ့ `Identifiable` နှစ်ခုစလုံးပါ။ ဒါပေမဲ့ `Identifiable` ရှိသမျှဟာ `Registrable` မဟုတ်ဘူး။ အများစုဟာ တိုက်ရိုက်မှတ်ပုံတင်ခံရပေမဲ့ တချို့ကိစ္စတွေမှာ blockchain ထဲက ကိုယ်စားလှယ်မှုက သိသိသာသာ ပိုများတဲ့ ဒေတာတွေရှိပါတယ်။ လုံခြုံရေးနှင့် စွမ်းဆောင်ရည်ဆိုင်ရာ အကြောင်းပြချက်များအတွက် ကျွန်ုပ်တို့သည် ဤကဲ့သို့သော ဒေတာဖွဲ့စည်းမှုများကို တည်ဆောက်သူများ (ဥပမာ `NewAccount`) ကိုအသုံးပြုကြပြီး တန်းတူ မှတ်ပုံတင်တွင် ပိုင်ဆိုင်မှုကို သက်သေပြရန် သီးသန့် ညွှန်ကြားချက်တစ်ခုရှိသည်။ ပုံမှန်အားဖြင့် မှတ်ပုံတင်နိုင်သည့် အရာတိုင်းကိုလည်း မှတ်ပုံတင်ခြင်းမရှိနိုင်သော်လည်း ဒါက ခက်ခဲပြီး မြန်ဆန်တဲ့ စည်းမျဉ်းမဟုတ်ပါ။

NFTs, peers, roles and triggers များကို မှတ်ပုံတင်နိုင်ပါသည်။ Domain setup သည် `EnsureAlias` ကိုအသုံးပြုသည်။ raw `Register::Domain` payload ကို genesis/bootstrap အတွက်စုဆောင်းထားသည်။ peer registration သည် peer key ကိုပိုင်ဆိုင်မှုသက်သေပြုချက်နှင့်အတူဆောင်သော `RegisterPeerWithPop` ကိုသုံးသည်။ ကျွန်ုပ်တို့ [ နာမည်ပေးခြင်းဆိုင်ရာ စည်းမျဉ်းစည်းကမ်းများ](/my/reference/naming.md) ကို စစ်ဆေးပြီး Entity Name များအပေါ် ချမှတ်ထားသော ကန့်သတ်ချက်များကို သိရှိလိုပါမည်။

RWA အပိုင်းများကို သီးသန့် `RegisterRwa` ညွှန်ကြားချက်ဖြင့် ဖန်တီးထားသည်။ လက်ရှိကုဒ်တွင် `UnregisterRwa` ညွှန်ပြချက်ကို ဖော်ပြခြင်းမရှိပေ။ ကိုယ်စားပြုသည့် အရေအတွက်ကို ပြန်လည်ထုတ်ယူရန် `RedeemRwa` ကို အသုံးပြုပါ။

::: info

[genesis block](/my/guide/configure/genesis.md) ကို `genesis.json` မှာ ဘယ်လို set up လုပ်မလဲဆိုတာအပေါ်မှာ မူတည်ပြီး (အထူးသဖြင့် ခွင့်ပြုချက်မှတ်တံဆိပ်တွေ မှတ်ပုံတင်ထားမလား၊ မထားဘူးလား) အကောင့်တစ်ခုကို မှတ်ပုံတင်တဲ့ လုပ်ငန်းစဉ်ဟာ အရမ်းခြားနားနိုင်တာကို သတိပြုပါ။ ယေဘုယျအားဖြင့် ဒါကို ဒီလိုချုပ်ပြနိုင်ပါတယ်။

- အများပိုင် blockchain တစ်ခုမှာ ဘယ်သူမဆို အကောင့်တစ်ခုကို မှတ်ပုံတင်နိုင်သင့်ပါတယ်။
- ပုဂ္ဂလိက blockchain တွင် အကောင့်များကို မှတ်ပုံတင်ရန်အတွက် ထူးခြားသော လုပ်ငန်းစဉ်တစ်ခုရှိနိုင်သည်။ သာမန်ပုဂ္ဂလိက Blockchain တွင်၊ ဆိုလိုသည်မှာ အကောင့်များမှတ်ပုံတင်ခြင်းအတွက် ထူးခြားတဲ့ လုပ်ငန်းစဉ်မရှိသည့် blockchain တွင် အခြားအကောင့်တစ်ခုကို မှတ်ပုံတင်ဖို့ အကောင့်တစ်ခုလိုအပ်သည်။

ဒီခြားနားချက်တွေကို ကျွန်တော်တို့ အသေးစိတ် ဆွေးနွေးတဲ့အခါမှာ [ပုဂ္ဂလိကနဲ့ အများပိုင် blockchain တွေကို နှိုင်းယှဉ်ကြည့်ပါ။](/my/guide/configure/modes.md).

:::

::: info

လက်ရှိတွင် peer ကို မှတ်ပုံတင်ခြင်းသည် ကွန်ရက်သို့ မူလ ယုံကြည်မှုရှိသော peer ၏ အစိတ်အပိုင်းမဟုတ်သော peers များကို ထည့်သွင်းရန်အတွက် တစ်ခုတည်းသောနည်းလမ်းဖြစ်သည်။

:::

blockchain အရာဝတ္ထုများကို မှတ်ပုံတင်ရန် ဘာသာစကားဆိုင်ရာ လမ်းညွှန်ကို အသုံးပြုပါ။

|ဘာသာစကား|လမ်းညွှန် |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |[Iroha CLI](/my/get-started/operate-iroha-via-cli.md) ကို အသုံးပြုပြီး ဒိုမင်များ တည်ဆောက်ရန်နှင့် အကောင့်များနှင့် အရင်းအမြစ်များကို မှတ်ပုံတင်ရန်။ |
|Rust |[Rust သင်ခန်းစာ ](/my/guide/tutorials/rust.md) ကို အသုံးပြုပါ။ |
|Kotlin/Java |[Kotlin/Java Tutorial](/my/guide/tutorials/kotlin-java.md) ကို အသုံးပြုပါ။ |
|Python |[Python သင်ခန်းစာ ](/my/guide/tutorials/python.md) ကို အသုံးပြုပါ။ |
|JavaScript/TypeScript | သုံးပါ [JavaScript/TypeScript သင်ခန်းစာ](/my/guide/tutorials/javascript.md).                               |

သာမန်ဒိုမင်ကို စီစဉ်ပြီး အသုံးချပါ၊ ဒီနောက် domain ကို မလိုအပ်တော့တဲ့အခါမှာ မှတ်ပုံတင်ခြင်းမရှိပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

မှတ်ပုံတင်စာရင်းများနှင့် မှတ်ပုံတင်ခြင်းမရှိသော စာရင်းများ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းဆိုင်ရာ အရင်းအမြစ်အနက်ကောက်ချက်များ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်း NFTs. NFT မှတ်ပုံတင်က ၎င်းရဲ့ အကြောင်းအရာကို ဖတ်တယ်။ JSON ပုံမှန် input မှ:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းဆိုင်ရာ အခန်းကဏ္ဍ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Register နှင့် unregister trigger များ။ Trigger မှတ်ပုံတင်သည် compiled IVM bytecode သို့မဟုတ် serialized ညွှန်ကြားချက်စာရင်းကိုလိုအပ်သည်။ ဤဥပမာသည် `Log` ညွှန်ပြချက်ကို CLI ဖြင့်တည်ဆောက်ပြီး trigger မှတ်ပုံတွင် pipes ကို:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

တန်းတူလူငယ်တွေ မှတ်ပုံတင်ပြီး မမှတ်ပုံတင်ပါ။ Generate ကို BLS သော့နဲ့ PoP နှင့်အတူ `kagami` သင့်မှာ မရှိသေးဘူးဆိုရင်-

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Mint/Burn {#mint-burn}

Minting နှင့် မီးရှို့ခြင်းသည် ကိန်းဂဏန်းအရင်းအမြစ်များကို ရည်ညွှန်းနိုင်ပြီး အကြိမ်ကြိမ်ပြုလုပ်မှု အကန့်အသတ်ရှိသည့် trigger များဖြစ်သည်။ asset အချို့ကို non-mintable အဖြစ်ကြေညာနိုင်သည်မှာ မှတ်ပုံတင်ပြီးနောက်တစ်ကြိမ်သာ mint လုပ်နိုင်သည်။

အရင်းအမြစ်များသည် အပျက်သဘောမဟုတ်သောအရေအတွက်ဖြစ်သည်၊ ထို့ကြောင့် သင်သည် ဘယ်တော့မှ `$-1.0` အရင်းအမြစ်ကို မရရှိနိုင်သည် သို့မဟုတ် အပျက်သဘောပမာဏကို မီးရှို့၍ ငွေစက္ကူရယူမရနိုင်ပါ။

Mint blockchain အရင်းအမြစ်များအတွက် ဘာသာစကားဆိုင်ရာ လမ်းညွှန်ကို အသုံးပြုပါ။

- [CLI](/my/get-started/operate-iroha-via-cli.md)
- [Rust](/my/guide/tutorials/rust.md)
- [Kotlin/Java](/my/guide/tutorials/kotlin-java.md)
- [Python](/my/guide/tutorials/python.md)
- [JavaScript/TypeScript](/my/guide/tutorials/javascript.md)

မီးရှို့ခံရတဲ့ အရင်းအမြစ်တွေရဲ့ နမူနာတွေကတော့-

- [CLI](/my/get-started/operate-iroha-via-cli.md)
- [Rust](/my/guide/tutorials/rust.md)

Mint နှင့် burn ကိန်းဂဏန်းများ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Mint နဲ့ burn trigger ထပ်တလဲလဲ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## လွှဲပြောင်းခြင်း {#transfer}

ငွေလွှဲပြောင်းခြင်းသည် ပိုင်ဆိုင်မှု (သို့) တန်ဖိုးကို အကောင့်များအကြား ရွေ့လျားစေသည်။ ယေဘုယျငွေလွှဲပြောင်းမှု ဗားရှင်းများသည် ဒိုမင်များ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ၊ ကိန်းဂဏန်းအရင်းအမြစ်များ၊ နှင့် NFTs. RWA အရေအတွက်လှုပ်ရှားမှု dedicated ကိုအသုံးပြုသည် `TransferRwa` နှင့် `ForceTransferRwa` ညွှန်ကြားချက်များ [လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ](/my/blockchain/rwas.md).

ဤအတွက် ](/my/reference/permissions.md) အရင်းအမြစ်များကို လွှဲပြောင်းရန် [ ခွင့်ပြုချက်ကို အကောင့်တစ်ခုသို့ ပေးအပ်ရမည်ဖြစ်သည်။ [CLI](/my/get-started/operate-iroha-via-cli.md) သို့မဟုတ် [Rust](/my/guide/tutorials/rust.md) တွင်အရင်းအမြစ်များလွှဲပြောင်းနည်းဥပမာကို ကြည့်ပါ။

ကိန်းဂဏန်းအရင်းအမြစ်များ လွှဲပြောင်းခြင်း

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Transfer domain၊ asset definition နဲ့ NFT ပိုင်ဆိုင်မှု:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Native Escrow နှင့် Asset Lock များ {#native-escrow-and-asset-locks}

Native escrow ညွှန်ကြားချက်များသည် ledger-managed protocol custody တွင်ကိန်းဂဏန်းအရင်းအမြစ်များကိုပိတ်ထားသည်။ ၎င်းတို့ကိုစျေးကွက်ပုံစံပေးဆပ်မှုများ၊ ယေဘုယျအရင်းအမြစ်ကိုပိတ်ထားခြင်းနှင့်မည်မသိကာကွယ်သော escrow စီးဆင်းမှုတို့အတွက် အသုံးပြုသည်။

စျေးကွက်အမှတ်တံဆိပ်သုံးစွဲမှု `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, နှင့် `ResolveEscrowDispute`. ယေဘုယျ အရင်းအမြစ်ပိတ်ခြင်း အသုံးပြုမှု `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, နှင့် `ExpireAssetLock`. Anonymous escrow ဟာ စျေးကွက်ရဲ့ သက်တမ်း စက်ဝန်းကို ပုံဖော်ပါတယ်။ `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, နှင့် `ResolveAnonymousEscrowDispute`.

ဤ ISIs များမှာ လက်ရှိတွင်ပထမတန်းစား CLI commands မရှိပါ။ SDK builders သို့မဟုတ် serialized instruction payloads ကိုသုံးပြီး [ Native Asset Escrow](/my/blockchain/escrow.md) ကိုကြည့်ပါ သက်တမ်းပတ်စဉ် အသေးစိတ်၊ ခွင့်ပြုချက်များ၊ မေးမြန်းမှုများ၊ အဖြစ်အပျက်များနှင့် Rust နမူနာများအတွက်။

## အက်တမ်မစ် သီးသန့် စာရင်းရှင်းလင်းမှု {#atomic-private-settlement}

အုပ်ချုပ်မှုအောက်ရှိ အက်တမ်မစ် သီးသန့်စာရင်းရှင်းလင်းမှု instruction များသည် ပွင့်လင်းမြင်သာသော Native AMX နှင့် သီးခြားဖြစ်သည်။ `ActivatePrivateSettlementPoolV1` သည် ဖျောက်ထားသော governance projection နှင့် canonical origin commitment များမှ တိကျသော route တစ်ခုအတွက် လျှို့ဝှက် `pool` တစ်ခု ဖန်တီးသည်။ `FinalizeAtomicPrivateSettlementV1` သည် ပါဝင်သော committee အားလုံးက အသိအမှတ်ပြုထားသည့် bundle အပြည့်အစုံကို အက်တမ်မစ်နည်းဖြင့် အသုံးချသည်။ `AbortAtomicPrivateSettlementV1` သည် sponsor က ခွင့်ပြုထားသော အများမြင် terminal marker ကိုသာ ထုတ်ပြန်သည်။

`RotatePrivateSettlementPoolPolicyV1` ကို ကိုယ်ရေးလုံခြုံမှုဆိုင်ရာ အုပ်ချုပ်မှုကသာ လုပ်ဆောင်နိုင်သည်။ Instruction သည် လက်ရှိ governance digest နှင့် အတိအကျကိုက်ညီရန် လိုအပ်ပြီး route၊ `pool`၊ asset-binding commitment၊ state frontier၊ replay set များနှင့် finalize လုပ်ပြီး receipt များကို ထိန်းသိမ်းထားကာ public revision ကို တစ်ဆင့်တိုး၍ auditor key epoch အသစ်ကို သုံးသည်။ Rotation သည် inclusion height တွင် အလုပ်လုပ်ပြီး ထို height မှာ တူညီသော route နှင့် `pool` ၏ receipt ကို finalize မလုပ်နိုင်ပါ။ Public revision lineage ကြောင့် rotation မတိုင်မီ finalize လုပ်ထားသော receipt များသည် restart ပြီးနောက်လည်း မှန်ကန်နေပြီး တူညီသော receipt ကို ထပ်မံအသုံးချခြင်းသည် idempotent ဖြစ်သည်။ Policy အဟောင်းဖြင့် လုပ်ဆောင်နေဆဲ bundle များသည် state မပြောင်းမီ fail closed ဖြစ်သည်။ Operator များသည် decryption key အဟောင်းများကို သိမ်းထားရမည်၊ သို့မဟုတ် key မဖျက်မီ governance အောက်တွင် capsule များကို rewrap လုပ်ပြီး စမ်းသပ်ရမည်။

ဤလမ်းကြောင်းသည် မူလအတိုင်း ပိတ်ထားပြီး production အသုံးပြုရန် အရည်အချင်းစစ် မပြီးသေးပါ။ Configuration၊ authority၊ audit၊ recovery နှင့် release လိုအပ်ချက်များအတွက် [ဒေတာစပေ့စ်များကြား အက်တမ်မစ် သီးသန့်စာရင်းရှင်းလင်းမှု လုပ်ဆောင်ခြင်း](/get-started/atomic-private-settlement) ကိုကြည့်ပါ။

## ထောက်ပံ့မှု / ပြန်လည်သိမ်းဆည်းခြင်း {#grant-revoke}

ငွေပေးချေခြင်းနှင့် ပြန်လည်သိမ်းဆည်းခြင်းဆိုင်ရာ ညွှန်ကြားချက်များကို စာရင်း [ ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍများ ](permissions.md).

`Grant` ကို အသုံးပြုသူအား ခွင့်ပြုချက် တစ်ခုတည်း (သို့) ခွင့်ပြုမှု အုပ်စုတစ်ခု ("ခန်းကဏ္ဍ") ကို အမြဲတမ်းပေးရန်အသုံးပြုသည်။ ပေးအပ်သောခန်းကဏ္ဍများနှင့် ခွင့်ပြုချက်ကို `Revoke` ညွှန်ကြားချက်မှသာ ဖယ်ရှားနိုင်သည်။ ထို့ကြောင့် ဤညွှန်ကြားချက်များကို ဂရုစိုက်စွာ သုံးသင့်သည်။

အကောင့်တစ်ခုပေါ်က အခန်းကဏ္ဍကို ထောက်ပံ့ပြီး ရုပ်သိမ်းခြင်း

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

ခွင့်ပြုချက် လက်မှတ်များအား ပေးအပ်ခြင်းနှင့် ပယ်ဖျက်ခြင်း။ ခွင့်ပြုမှု အမိန့်များတွင် ခွင့်ပြုချက်တွေ ရှိသည့် အရာဝတ္ထုကို ပုံမှန် input မှ ဖတ်ရှုနိုင်ပါသည်။

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

အခန်းကဏ္ဍတစ်ခုအတွက် ခွင့်ပြုချက်ပေးပြီး ရုပ်သိမ်းခြင်း:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

ဤညွှန်ကြားချက်များမှာ object [metadata](/my/blockchain/metadata.md) ကို update လုပ်ရန် `SetKeyValue` ကိုသုံးပြီး metadata entry တစ်ခုကိုထည့်သွင်း (သို့) အစားထိုးရန်နှင့် `RemoveKeyValue` ကိုအသုံးပြု၍ delete လုပ်ရန်ဖြစ်သည်။

Metadata `set` command တွေမှာ Standard input ကနေ JSON တန်ဖိုးကို ဖတ်တယ်။

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

စာရင်းများ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs, RWAs နှင့် trigger များအတွက်လည်း အလားတူပုံစံရှိသည်-

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` သည် Active Data Model နှင့် executor တို့က ထုတ်လွှင့်ထားသော Chainwide Parameters များကို ပြောင်းလဲစေသည်။

Standard input မှာ single parameter JSON object တစ်ခုကို ဖြတ်ပြီး parameter ကို သတ်မှတ်ပေးပါ

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ဤညွှန်ကြားချက်သည် [ trigger](./triggers.md) များကိုလုပ်ဆောင်ရန်အသုံးပြုသည်။

CLI သည် trigger များကို မှတ်ပုံတင်နိုင်ပြီး trigger execution events ကို တိုက်ရိုက် subscribe လုပ်နိုင်သည်။ ၎င်းသည် `execute trigger` command ကို ရိုက်ထည့်ခြင်းမရှိဘဲ၊ လက်စွဲ `ExecuteTrigger` ညွှန်ကြားချက်များကို ပေးပို့ရန်အတွက်ဖြစ်သည်။ SDK (သို့) အကောင်အထည်ဖော်ရေး ကိရိယာဖြင့် serialized `InstructionBox` ကိုထုတ်လုပ်ပြီး ရလဒ်ဖြစ်သော JSON array ကို `ledger transaction stdin` မှ ဖြတ်သန်းပါ။

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## အခြားညွှန်ကြားချက်များ {#other-instructions}

Iroha သည် runtime နှင့် executor integration အတွက် အောက်ခြေအဆင့် ညွှန်ကြားချက်များကိုလည်း ဖော်ပြထားသည်-

- `Log`: အကောင်အထည်ဖော်မှုအတွင်း မှတ်ပုံတင်မှတ်တမ်းကို ထုတ်လွှင့်ပါ။
- `CustomInstruction`: အကောင်အထည်ဖော်သူအတွက် အထူး အသုံးဝင်သော ဝန်ဆောင်မှုများ JSON ကို သယ်ယူပို့ဆောင်ခြင်း
- `Upgrade`: အကောင်အထည်ဖော်သူ အဆင့်မြှင့်တင်မှုကို ဖွင့်ပါ။

`Log` ညွှန်ကြားချက်ကို ping အကူနဲ့တင်ပြပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

`InstructionBox` အဖြစ် custom executor ညွှန်ကြားချက်ကို တင်ပါ။ အသုံးဝင်ဝန်ဆောင်မှုပုံစံက executor-specific ဖြစ်သည်၊ ထို့ကြောင့် ညွှန်ပြချက်ကို ကိုက်ညီသော SDK သို့မဟုတ် executor tooling ဖြင့်ထုတ်လုပ်ပါ:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

IVM bytecode file တစ်ခုမှ အကောင်အထည်ဖော်သူကို အဆင့်မြှင့်တင်ပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
