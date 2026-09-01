---
translation_locale: my
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ညွှန်ကြားမှု လုပ်ငန်းများ {#iroha-special-instructions}

[Iroha အလုပ်လုပ်ပုံ](/my/blockchain/iroha-explained) အကြောင်းပြောတဲ့အခါ ပြောခဲ့တာက Iroha ညွှန်ကြားမှု လုပ်ဆောင်ချက်တွေဟာ ကမ္ဘာ့အခြေအနေကို ပြောင်းလဲဖို့ တစ်ခုတည်းသောနည်းလမ်းပါ။ ဒီတော့ ဘယ်လို ညွှန်ပြချက်မျိုးလဲ။ `Register<Account>` နဲ့ `Mint<Numeric>` ဆိုတဲ့ ညွှန်ကြားချက်တွေကို ခင်ဗျားတို့ မြင်နိုင်ကြမှာပါ။

Iroha သင်ကြားမှု လုပ်ငန်းများ၏ အပြည့်အစုံစာရင်းကို ဖော်ပြပါသည်-

|ညွှန်ကြားချက်|သရုပ်ဖော်ချက်များ |
| --------------------------------------------------------- | ------------------------------------------------ |
|[မှတ်ပုံတင်/မမှတ်ပုံတင်ခြင်း](#un-register) |blockchain ပေါ်က entity အသစ်ကို ID ပေးပါ။ |
|[Mint/Burn](#mint-burn) |Mint/burn ကိန်းဂဏန်းအရင်းအမြစ်များ (သို့) trigger ထပ်ကျော့ခြင်း။ |
|[SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |blockchain object metadata ကို update လုပ်ပါ။ |
|[SetParameter](#setparameter) |Chainwide parameter ကို သတ်မှတ်ပါ။ |
|[ထောက်ပံ့မှု / ပြန်လည်သိမ်းဆည်းခြင်း](#grant-revoke) |ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍများကို ပေးပါ (သို့) ဖယ်ရှားပါ|
|[လွှဲပြောင်းခြင်း](#transfer) |ပိုင်ဆိုင်မှု သို့မဟုတ် အရင်းအမြစ်တန်ဖိုး လွှဲပြောင်းခြင်း။ |
|[ရင်းနှီးမြှုပ်နှံမှု (native escrow) နှင့် အရင်းအမြစ်ပိတ်ခြင်း](#native-escrow-and-asset-locks) |ပရိုတိုကောလစ် ထိန်းသိမ်းမှုမှာ ကိန်းဂဏန်းအရင်းအမြစ်တွေကို Lock လုပ်ပါ။|
|[အက်တမ် ပုဂ္ဂလိက ဘဏ္ဍာရေး ငွေပေးချေမှု ဖြေရှင်းခြင်း](#atomic-private-settlement) |Confidential protocol data groups နဲ့ atomic bundles တွေကို ထိန်းချုပ်ပါ။|
|[ExecuteTrigger](#executetrigger) |trigger တွေကို လုပ်ဆောင်ပါ။ |
|[Log/Custom/Upgrade](#other-instructions) |ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် အပြုအမူကို မှတ်တမ်းတင်ခြင်း၊ တိုးချဲ့ခြင်း သို့မဟုတ် အဆင့်မြှင့်ခြင်း။ |

Iroha ညွှန်ကြားမှု လုပ်ဆောင်ချက်တွေရဲ့ အကျဉ်းချုပ်တစ်ခုနဲ့ စရအောင်။ ညွှန်ပြချက်တိုင်းအတွက် ဘယ်အရာတွေကို ခေါ်ယူနိုင်ပြီး အရာတိုင်းအတွက် ဘယ်ညွှန်ကြားချက်တွေ ရနိုင်လဲ။

## အတိုကောက် {#summary}

ညွှန်ကြားချက်တစ်ခုစီအတွက် ဤညွှန်ကြားချက်ကို လုပ်ဆောင်နိုင်သော အရာဝတ္ထုစာရင်းရှိသည်။ ဥပမာ၊ လွှဲပြောင်းမှုဗားရှင်းများသည် ပိုင်ဆိုင်နိုင်သော blockchain လက်မှတ်ကြီးအရာဝတ္ထုများနှင့် နံပါတ်အရင်းအမြစ်များကို ဖုံးအုပ်ထားပြီး ထုတ်ဝေခြင်းသည် နံပါတ် အရင်းအမြစ်ကိုဖုံးအုပ်ထားကာ အကြိမ်ကြိမ်ဖြစ်ပေါ်စေသည်။

တစ်ချို့ ညွှန်ကြားချက်တွေမှာ ရည်မှန်းချက်တစ်ခု သတ်မှတ်ဖို့ လိုအပ်ပါတယ်။ ဥပမာ၊ ပိုင်ဆိုင်မှုတွေကို လွှဲပြောင်းရင် ဘယ်အကောင့်ကို လွှဲပြောင်းနေလဲဆိုတာ အမြဲသတိပေးဖို့လိုတယ်။ အခြားတစ်ဖက်မှာ တစ်ခုခု မှတ်ပုံတင်တဲ့အခါ သင်လိုအပ်တာက မှတ်ပုံတင်ချင်တဲ့ အရာဝတ္ထုပါ။

|ညွှန်ကြားချက်|ပစ္စည်းများ |ရည်မှန်းချက် |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
|[EnsureAlias](#ensurealias) |သာမန်ဒိုမင်၊ ဒေတာနေရာ-အမည်များနှင့် အကောင့်-အမည်တပ်ဆင်ခြင်း |                      |
|[မှတ်ပုံတင်/မမှတ်ပုံတင်ခြင်း](#un-register) |အကောင့်များ၊ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs, အခန်းကဏ္ဍများ, trigger များ, ကွန်ရက်တူညီသူများ; ဒိုမင်ပယ်ဖျက်ခြင်း |                      |
|[Mint/Burn](#mint-burn) |ကိန်းဂဏန်းအရင်းအမြစ်တွေ၊ အစပျိုးမှု ထပ်ခါထပ်ခါ |အကောင့်များ (သို့) trigger များ|
|[SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[metadata များ](./metadata.md) ရှိသော အရာဝတ္ထုများ: ဒိုမင်များ၊ အကောင့်များ၊ အရင်းအမြစ်ဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs၊ RWAs၊ trigger များ |                      |
|[SetParameter](#setparameter) |ကွင်းဆက် parameters |                      |
|[ထောက်ပံ့မှု / ပြန်လည်သိမ်းဆည်းခြင်း](#grant-revoke) |[ကဏ္ဍများ၊ ခွင့်ပြုချက် လက်မှတ်များ](/my/blockchain/permissions.md) |အကောင့်များ သို့မဟုတ် အခန်းကဏ္ဍများ |
|[လွှဲပြောင်းခြင်း](#transfer) |ဒိုမင်များ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ, ကိန်းဂဏန်းအရင်းအမြစ်များ NFTs |အကောင့်များ|
|[ရင်းနှီးမြှုပ်နှံမှု (native escrow) နှင့် အရင်းအမြစ်ပိတ်ခြင်း](#native-escrow-and-asset-locks) |ကိန်းဂဏန်းအရ အရင်းအမြစ် အချုပ်အခြာများ၊ ရင်းနှီးမြှုပ်နှံမှု ပိတ်သိမ်းချက်များ၊ အမည်မသိ အချုပ်အခမဲ့ cryptographic commitment values များ |ဝယ်ယူသူတွေ၊ ခရီးသွားနေရာတွေ (သို့) အငြင်းပွားမှု ကွဲပြားမှု |
|[အက်တမ် ပုဂ္ဂလိက ဘဏ္ဍာရေး ငွေပေးချေမှု ဖြေရှင်းခြင်း](#atomic-private-settlement) |လမ်းကြောင်းကန့်သတ်ထားတဲ့ လျှို့ဝှက် ပရိုတိုကော ဒေတာအုပ်စုတွေ၊ မူဝါဒလည်ပတ်မှု၊ ပြီးဆုံးတဲ့ ဘက်လ်များနဲ့ ဖျက်သိမ်းရေး အမှတ်တံဆိပ်တွေပါ။|                      |
|[ExecuteTrigger](#executetrigger) |trigger များ|                      |
|[Log/Custom/Upgrade](#other-instructions) |မှတ်တမ်းများ၊ အကောင်အထည်ဖော်သူဆိုင်ရာ အသုံးဝင်ဝန်ဆောင်မှုများ၊ အကောင် အထည်ဖော်မှု အဆင့်မြှင့်တင်ခြင်းများ |                      |

ISI ကို ကြည့်ဖို့ အခြားနည်းလမ်းတစ်ခုလည်းရှိတယ်၊ သူတို့ ထိတွေ့တဲ့ blockchain ledger ပိုင်ဆိုင်မှုအရပါ။

|ရည်မှန်းချက်|ညွှန်ကြားချက်များ|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|အကောင့်|မှတ်ပုံတင်/မမှတ်ပုံတင်စာရင်းများ၊ လက်ခံရရှိမှုအရင်းအမြစ်များ၊ စာရင်း မီတာဒေတာများကို update လုပ်ခြင်း၊ ခွင့်ပြုချက်များ ပေးအပ်/ငြိမ်းသိမ်းခြင်းနှင့် အခန်းကဏ္ဍများ |
| ဒိုမိန်း | ဒိုမိန်းဖွဲ့စည်းမှုကို သေချာစေခြင်း၊ ဒိုမိန်းများကို မှတ်ပုံတင်မှ ပယ်ဖျက်ခြင်း၊ ဒိုမိန်းပိုင်ဆိုင်မှုကို လွှဲပြောင်းခြင်း၊ ဒိုမိန်း မက်တာဒေတာကို ပြင်ဆင်ခြင်း |
|အရင်းအမြစ် သတ်မှတ်ချက် |Register/unregister definitions, transfer ownership, update metadata  မှတ်ပုံတင်ခြင်း / မှတ်ပုံတင်မလုပ်ခြင်း|
|အရင်းအမြစ်များ|သံပုရာသီး / မီးရှို့မှု ကိန်းဂဏန်းအရေအတွက်၊ လွှဲပြောင်းမှု ကိန်း ဂဏန်း အရေအတွက် |
|ဘဏ္ဍာရေး |ပေးပို့တဲ့ ငွေပေးချေမှုကို ဖွင့်၊ လက်ခံ၊ မှတ်သား၊ ထုတ်လွှတ်၊ ဖျက်သိမ်း၊ အငြင်းပွား၊ ဖြေရှင်း၊ ဆွဲထုတ်၊ ဒါမှမဟုတ် သက်တမ်းကုန်ဆုံးစေတဲ့ မူရင်း ထိန်းသိမ်းမှု မှတ်တမ်းများ|
|NFT |register/unregister NFTs, transfer ownership, update metadata  မှတ်ပုံတင်ခြင်းမရှိ|
|RWA |စာရင်းအင်း၊ လွှဲပြောင်းမှုအရေအတွက်၊ ထိန်းသိမ်း/လွှတ်တင်ခြင်း၊ အေးခဲခြင်း/အေးဆေးခြင်း၊ ပြန်လည်ဖြည့်ဆည်းခြင်း၊ ပေါင်းစပ်ခြင်း၊ မီတာဒေတာများနှင့် ထိန်းချုပ်ချက်များကို ပြင်ဆင်ခြင်း |
|Trigger ကို|register/unregister, mint/burn trigger repetitions, execute trigger, update trigger metadata များကို မှတ်ပုံတင်ရန်|
|ကမ္ဘာကြီး|Register/unregister network peers and roles, parameters set, executor ကို upgrade လုပ်ပေး |

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

အများပြည်သူ Taira testnet ကို ပစ်မှတ်ထားတဲ့အခါ Taira client configuration ကိုသုံးပါ။ အခွန်ပေးတဲ့ နမူနာတွေကို မလုပ်ခင် testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု အကူအညီကို [Testnet XOR ကို Taira သို့ခေါ်ယူပါ။](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) မှ `taira_faucet_claim.py` အဖြစ် သိမ်းဆည်းပြီး testnet ဘ႑ာရေးဝန်ဆောင်မှုကနေ testnet XOR ကို တောင်းဆိုလိုက်ပါ။

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

testnet မှ ရင်းနှီးမြှုပ်နှံထားသော အရင်းအမြစ်ကို မြင်နိုင်ပြီးနောက်၊ လိုအပ်တဲ့ ငွေကြေးဆိုင်ရာ ကုန်ကျစရိတ်အရင်းအမြစ် metadata ကို ချိတ်ဆက်၍ ငွေကြေးရေးဆွဲမှုများကို ရေးသားပါ။

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` သည် ဒိုမင်များနှင့် ၎င်းတို့၏ SNS ငှားရမ်းမှုများကို ဖန်တီးရန်အတွက် ပုံမှန် ပထမအကြိမ် ထုတ်ဝေခြင်းလမ်းကြောင်းဖြစ်သည်။ ၎င်းသည် တိကျသော ဒေတာနေရာ၊ ပိုင်ရှင်၊ ငှားရန်သက်တမ်းကို ကြေညာချက်အရ ချည်နှောင်ထားသည်။ နောက်ပြီး လိုအပ်တဲ့အခြေအနေအားလုံးကို အက်တမ်နည်းဖြင့် ဖန်တီး (သို့) ပြင်ဆင်ပါ။ စစ်ဆေးထားတဲ့ `POST /v1/aliases/setup/plan` API အဆုံးမှတ် (သို့) ကိုက်ညီသော CLI အလုပ်ဖြစ်စဉ်ကို အသုံးပြုပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

ရည်ရွယ်ချက်နှင့် အစီအစဉ်သည် လျှို့ဝှက်မှုမရှိသော်လည်း အဆင့်မှတ်သားများကိုအသုံးပြုပြီး သတ်မှတ်ထားသောအကောင့်နှင့်အတူ သာမန် ငွေကြေးလွှဲပြောင်းမှုကိုတင်သွင်းသည်။ အစီအစဉ်တစ်ခုသည် ၎င်း၏ချိတ်ဆက်မှု၊ ခွင့်ပြုချက် မူဝါဒ၊ သက်ရှိအခြေအနေ ancillary နှင့် နောက်ဆုံးအချိန်ကို ချည်နှောင်ထားသည်။ အခြားကွန်ရက်တွင်တစ်ခါမှ ပြန်လည်အသုံးပြုခြင်းမဟုတ်ပါ။

## (Un) မှတ်ပုံတင် {#un-register}

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းသည် blockchain ပေါ်က အဖွဲ့အစည်းသစ်အား ID ပေးရန် အသုံးပြုသည့် ညွှန်ကြားချက်များဖြစ်သည်။

မှတ်ပုံတင်လို့ရတဲ့ အရာတိုင်းဟာ `Registrable` နဲ့ `Identifiable` နှစ်ခုစလုံးပါ။ ဒါပေမဲ့ `Identifiable` ရှိသမျှဟာ `Registrable` မဟုတ်ဘူး။ အများစုဟာ တိုက်ရိုက်မှတ်ပုံတင်ခံရပေမဲ့ တချို့ကိစ္စတွေမှာ blockchain ထဲက ကိုယ်စားလှယ်မှုက သိသိသာသာ ပိုများတဲ့ ဒေတာတွေရှိပါတယ်။ လုံခြုံရေးနှင့် စွမ်းဆောင်ရည်ဆိုင်ရာ အကြောင်းပြချက်များအတွက် ကျွန်ုပ်တို့သည် ဤကဲ့သို့သော ဒေတာဖွဲ့စည်းမှု (ဥပမာ `NewAccount`) များအတွက် ဆောက်လုပ်သူများကို အသုံးပြုကြပြီး ကွန်ရက် peer မှတ်ပုံတင်တွင် ပိုင်ဆိုင်မှုကို သက်သေပြရန် သီးသန့် ညွှန်ကြားချက်တစ်ခုရှိသည်။ ပုံမှန်အားဖြင့် မှတ်ပုံတင်နိုင်သည့် အရာတိုင်းကိုလည်း မှတ်ပုံတင်ခြင်းမရှိနိုင်ပေ။ ဒါပေမဲ့ ဒါက ခက်ခဲပြီး မြန်ဆန်တဲ့ စည်းကမ်းမဟုတ်ပါ။

Account များ၊ Asset Definitions NFTs ၊ Network Peers, Roles နှင့် Trigger များကို မှတ်ပုံတင်နိုင်သည်။ Domain Setup အသုံးပြုသည် `EnsureAlias`; Raw `Register::Domain` အသုံးဝင်မှု load ကို genesis/bootstrap. network peer registration uses `RegisterPeerWithPop`, which carries a proof of possession for the network peer key. entity names on restrictions on entities names ကိုသတ်မှတ်ထားသော ကန့်သတ်ချက်များအကြောင်းသိရှိလိုပါက ကျွန်ုပ်တို့၏ [ညီလာခံအမည်ပေးခြင်း](/my/reference/naming.md) ကိုကြည့်ပါ။

RWA အပိုဒ်များကို သီးသန့် `RegisterRwa` ညွှန်ကြားချက်ဖြင့် ဖန်တီးထားသည်။ လက်ရှိကုဒ်တွင် `UnregisterRwa` ညွှန်ပြချက်ကို ဖော်ပြခြင်းမရှိပေ။ `RedeemRwa` ကို ကိုယ်စားပြုသည့် ပမာဏကို ဖျက်သိမ်းရန် အသုံးပြုပါ။

::: info

[blockchain ဘလော့ဂ်](/my/guide/configure/genesis.md) ကို `genesis.json` မှာ ဘယ်လိုချမှတ်မလဲဆိုတာအပေါ်မှာ မူတည်ပြီး (အထူးသဖြင့် ခွင့်ပြုချက် လက်မှတ်မှတ်တွေ မှတ်ပုံတင်ထားမလား၊ မထားဘူးလား) အကောင့်တစ်ခုကို မှတ်ပုံတင်တဲ့ လုပ်ငန်းစဉ်ဟာ အရမ်းခြားနားနိုင်တာကို သတိပြုပါ။ ယေဘုယျအားဖြင့် ဒါကို ဒီလိုချုပ်ဆိုနိုင်ပါတယ်။

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

Network peers တွေကို မှတ်ပုံတင်ပြီး မမှတ်ပုံတင်ပါ။ Generate ကို BLS သော့နဲ့ PoP နှင့်အတူ `kagami` သင့်မှာ မရှိသေးဘူးဆိုရင်-

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

trigger repeat တွေကို ထုတ်ပေးပြီး ဖျက်ဆီးပေးပါ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## လွှဲပြောင်းခြင်း {#transfer}

ငွေလွှဲပြောင်းခြင်းသည် ပိုင်ဆိုင်မှု (သို့) တန်ဖိုးကို အကောင့်များအကြား ရွေ့လျားစေသည်။ ယေဘုယျငွေလွှဲပြောင်းမှု ဗားရှင်းများသည် ဒိုမင်များ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ၊ ကိန်းဂဏန်းအရင်းအမြစ်များ၊ နှင့် NFTs. RWA အရေအတွက်လှုပ်ရှားမှု dedicated ကိုအသုံးပြုသည် `TransferRwa` နှင့် `ForceTransferRwa` ညွှန်ကြားချက်များ [လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ](/my/blockchain/rwas.md).

ဒါလုပ်ဖို့ အကောင့်တစ်ခု ပေးဖို့လိုပါတယ်။ [အရင်းအမြစ်လွှဲပြောင်းခွင့်](/my/reference/permissions.md). အရင်းအမြစ်တွေကို ဘယ်လို လွှဲပြောင်းရမလဲဆိုတဲ့ ဥပမာကို ကြည့်ပါ။ [CLI](/my/get-started/operate-iroha-via-cli.md) ဒါမှမဟုတ် [Rust](/my/guide/tutorials/rust.md).

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

Native escrow ညွှန်ကြားချက်များသည် blockchain ledger ပရိုတိုကော ထိန်းသိမ်းမှုမှ စီမံခန့်ခွဲသော ကိန်းဂဏန်းအရင်းအမြစ်များကိုပိတ်ထားသည်။ ၎င်းတို့ကိုစျေးကွက်ပုံစံငွေကြေးဆောင်ရွက်မှုဖြေရှင်းရေး၊ ယေဘုယျအရင်းအမြစ်ကိုပိတ်ထားခြင်းနှင့်မည်မသိကာကွယ်ထားတဲ့ escrow စီးဆင်းမှုများအတွက် အသုံးပြုပါသည်။

စျေးကွက်အမှတ်တံဆိပ်သုံးစွဲမှု `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, နှင့် `ResolveEscrowDispute`. ယေဘုယျ အရင်းအမြစ်ပိတ်ခြင်း အသုံးပြုမှု `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, နှင့် `ExpireAssetLock`. Anonymous escrow ဟာ စျေးကွက်ရဲ့ သက်တမ်း စက်ဝန်းကို ပုံဖော်ပါတယ်။ `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, နှင့် `ResolveAnonymousEscrowDispute`.

ဤ ISIs များမှာ လက်ရှိတွင်ပထမတန်းစား CLI commands မရှိပါ။ ရိုက်နှိပ်ထားသော SDK builders သို့မဟုတ် serialized instruction payloads ကိုအသုံးပြုပြီး ဘဝပတ်လည် အသေးစိတ်၊ ခွင့်ပြုချက်များ၊ မေးမြန်းမှုများ၊ အဖြစ်အပျက်များနှင့် Rust နမူနာများအတွက် [Native Asset Escrow](/my/blockchain/escrow.md) ကိုကြည့်ပါ။

## Atomic ပုဂ္ဂလိက ဘဏ္ဍာရေး ငွေပေးချေမှု ဖြေရှင်းခြင်း {#atomic-private-settlement}

ထိန်းချုပ်ထားတဲ့ အက်တမ်-ပုဂ္ဂလိက settlement ညွှန်ကြားချက်မိသားစုဟာ ပွင့်လင်းမြင်သာတဲ့ Native AMX ကနေ ခွဲခြားထားတယ်။ `ActivatePrivateSettlementPoolV1` ဟာ တည်းဖြတ်ထားတဲ့ အုပ်ချုပ်မှု ပရောဂျက်နဲ့ Single Protocol Standard origin cryptographic commitment တန်ဖိုးတွေကနေ လမ်းကြောင်းအချိုးအစားတစ်ခုရှိတဲ့ လျှို့ဝှက်ပရိုတိုကုတ်ဒေတာအုပ်စုတစ်ခုကို သတ်မှတ်ပါတယ်။ `FinalizeAtomicPrivateSettlementV1` ကော်မတီက အသိအမှတ်ပြုထားတဲ့ အစုတစ်ခုလုံးကို အက်တမ်နည်းနဲ့ အသုံးချပြီး `AbortAtomicPrivateSettlementV1` က ပံ့ပိုးသူက ခွင့်ပြုတဲ့ အများပြည်သူ terminal marker ကိုသာ ထုတ်ဝေပါတယ်။

`RotatePrivateSettlementPoolPolicyV1` ဟာ ပုဂ္ဂလိကလွတ်လပ်ရေး အုပ်ချုပ်မှုအတွက် ကန့်သတ်ထားတာပါ။ ၎င်းဟာ လက်ရှိ အုပ်ချုပ်မှုရဲ့ တိကျတဲ့ cryptographic digest တန်ဖိုးကို လိုအပ်တယ်၊ လမ်းကြောင်း၊ ပရိုတိုကောဒေါင် ဒေတာအုပ်စု၊ အရင်းအမြစ် ချုပ်ဆိုထားတဲ့ cryptographic commitment တန်ဖိုး၊ ပြည်နယ် နယ်နိမိတ်၊ replay set တွေနဲ့ အဆုံးသတ် protocol ရလဒ်မှတ်တမ်းတွေကို ထိန်းသိမ်းတယ်။ အများပြည်သူ အပြန်အလှန် ပြန်လည်သုံးသပ်မှုကို တစ်ဆင့် တိုးတက်စေပြီး ပိုမိုသစ်တဲ့ စာရင်းစစ်ဆေးရေး ခလုတ်ခေတ်ကို သုံးပါတယ်။ လည်ပတ်မှုက ၎င်းရဲ့ ပါဝင်မှု အမြင့်မှာ တက်ကြွလာပြီး အလားတူ လမ်းကြောင်း/ရေကန်အတွက် ပရိုတိုကော ရလဒ် မှတ်တမ်းတစ်ခုနဲ့ ဒီအမြင့်ကို မျှဝေလို့မရပါ။ Public revision lineage သည် rotation restart-valid နှင့် exact-replay idempotent မတိုင်မီတွင် protocol ရလဒ်မှတ်တမ်းများကို ပြီးဆုံးစေသည်။ လေယာဉ်မောင်းနှင်မှုအတွင်းရှိ မူဝါဒဟောင်းအစုများပိတ်နိုင်ခြင်းမရှိပါ။ သယ်ဆောင်သူများသည် သိမ်းဆည်းထားသော kapsules များအတွက်ဟောင်း decryption key များကိုသိမ်းထားရမည်ဖြစ်သည် သို့မဟုတ် ဖျက်ဆီးရန်မတိုင်ခင် govern နှင့် test capsule ပြန်ထည့်သွင်းခြင်းကို ထိန်းချုပ်ရမည်ဖြစ်သည်။

လမ်းကြောင်းသည် အလိုအလျောက်ပိတ်ထားပြီး ထုတ်လုပ်မှု အရည်အသွေးမရှိပါ။ ဖွဲ့စည်းပုံ၊ ခွင့်ပြုချက် မူဝါဒ၊ စစ်ဆေးမှု၊ ပြန်လည်ထူထောင်ခြင်းနှင့် ဖြန့်ချိရေးလိုအပ်ချက်များအတွက် [Atomic Private Cross-Dataspace ဘဏ္ဍာရေး ငွေကြေးငွေပေးချေမှု Settlement ကို Run](/my/get-started/atomic-private-settlement) ကိုကြည့်ပါ။

## ထောက်ပံ့မှု / ပြန်လည်သိမ်းဆည်းခြင်း {#grant-revoke}

ငွေပေးချေခြင်းနှင့် ပြန်လည်သိမ်းဆည်းခြင်းဆိုင်ရာ ညွှန်ကြားချက်များကို [ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍများ](permissions.md) သို့ အသုံးပြုသည်။

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

ဤညွှန်ကြားချက်များမှာ [metadata များ](/my/blockchain/metadata.md) အရာဝတ္ထုကို update လုပ်ပါ။ metadata entry ကိုထည့်သွင်းရန် သို့မဟုတ် အစားထိုးရန် `SetKeyValue` ကို အသုံးပြုပြီး `RemoveKeyValue` ကို delete လုပ်ပါ။

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

ဒီညွှန်ကြားချက်ကို [trigger များ](./triggers.md) လုပ်ဖို့ အသုံးပြုတယ်။

နိုင်ငံတကာ CLI trigger တွေကို မှတ်တမ်းတင်ပြီး trigger execution events ကို တိုက်ရိုက် subscribe လုပ်နိုင်ပါတယ် `execute trigger` ညွှန်ကြားချက်ကို ပေးပို့ဖို့ `ExecuteTrigger` ညွှန်ကြားချက်, serialized ကိုဖန်တီး `InstructionBox` (၁) SDK (သို့) အကောင်အထည်ဖော်ရေး ကိရိယာနဲ့ ရလာတဲ့ pass ကို JSON array မှတစ်ဆင့် `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## အခြားညွှန်ကြားချက်များ {#other-instructions}

Iroha သည် software execution environment နှင့် executor integration တို့အတွက် အောက်ခြေအဆင့် ညွှန်ကြားချက်များကိုလည်း ဖော်ပြထားသည်။

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
