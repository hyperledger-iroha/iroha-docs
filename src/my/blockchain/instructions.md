---
translation_locale: my
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha အထူးညွှန်ကြားချက်များ {#iroha-special-instructions}

ကျွန်မတို့ ပြောခဲ့တုန်းက [ဘယ်လို Iroha လုပ်ငန်းဆောင်ရွက်](/my/blockchain/iroha-explained), ကျွန်မတို့
ပြောခဲ့တာက Iroha အထူးညွှန်ကြားချက်တွေက ကမ္ဘာကို ပြောင်းလဲဖို့ တစ်ခုတည်းသောနည်းလမ်းပါ။
ဒီတော့ ကျွန်တော်တို့မှာ ဘယ်လို အထူးညွှန်ကြားချက်တွေရှိလဲ။
ဒီသင်ခန်းစာမှာ ဘာသာစကားဆိုင်ရာ လမ်းညွှန်ချက်တွေရှိပါတယ်
ညွှန်ကြားချက်: `Register<Account>` နှင့် `Mint<Numeric>`.

ဒီမှာ အပြည့်အဝစာရင်းပါ Iroha အထူးညွှန်ကြားချက်များ

| သင်ကြားချက်                                               | သရုပ်ဖော်ချက်များ                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [မှတ်ပုံတင်/မမှတ်ပုံတင်ခြင်း](#un-register)                       | ပေးပါ ID blockchain ပေါ်မှာရှိတဲ့ အဖွဲ့အစည်းသစ်တစ်ခုဆီပါ။    |
| [သံပုရာသီး / မီးရှို့ခြင်း](#mint-burn)                                   | Mint/burn ကိန်းဂဏန်းအရင်းအမြစ်များ (သို့) trigger ထပ်ကျော့ခြင်းများ |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | blockchain object metadata ကို update လုပ်ပါ။               |
| [SetParameter](#setparameter)                             | ကွင်းဆက်အနှံ့ သတ်မှတ်ချက်တစ်ခုကို သတ်မှတ်ပါ။                      |
| [ထောက်ပံ့မှု / ပြန်လည်သိမ်းဆည်းခြင်း](#grant-revoke)                             | ခွင့်ပြုချက်တွေနဲ့ အခန်းကဏ္ဍတွေကို ပေးပါ (သို့) ဖျက်ပါ။            |
| [လွှဲပြောင်းခြင်း](#transfer)                                     | ပိုင်ဆိုင်မှု သို့မဟုတ် အရင်းအမြစ်တန်ဖိုးကို လွှဲပြောင်းပါ။               |
| [ဒေသခံဂိုဏ်းနှင့် အရင်းအမြစ်ပိတ်ခြင်း](#native-escrow-and-asset-locks) | ပရိုတိုကောလစ် ထိန်းသိမ်းမှုမှာ ကိန်းဂဏန်းအရင်းအမြစ်တွေကို Lock လုပ်ပါ။     |
| [ExecuteTrigger](#executetrigger)                         | trigger တွေကို လုပ်ဆောင်ပါ။                                |
| [မှတ်ပုံတင် / အလိုက်အလျောက် / အဆင့်မြှင့်တင်ခြင်း](#other-instructions)                 | Runtime အပြုအမူကို မှတ်တမ်းတင်၊ တိုးချဲ့၊ ဒါမှမဟုတ် အဆင့်မြှင့်ပါ။        |

အစပိုင်းမှာ Iroha အထူး ညွှန်ကြားချက်များ၊ မည်သည့်အရာကို ရည်ရွယ်သည်
ညွှန်ကြားချက်တစ်ခုခုကို တောင်းဆိုနိုင်ပြီး တစ်ဦးချင်းအတွက် ဘယ်ညွှန်ကြားချက်များရှိလဲ
အရာဝတ္ထု။

## အတိုကောက် {#summary}

ညွှန်ကြားချက်တစ်ခုစီအတွက် ဒီညွှန်ကြားချက်က
ဥပမာ Transfer Variants တွေက Ownable Ledger Object တွေကို ဖုံးအုပ်ပါတယ်။
အရေအတွက်အရင်းအမြစ်များနှင့် trigger များကိုဖုံးအုပ်ထားပြီး minting ကတော့
ထပ်ကျော့ခြင်း။

အချို့ညွှန်ကြားချက်များတွင် ရည်ရွယ်ချက်ကို သတ်မှတ်ရန် လိုအပ်သည်။ ဥပမာ၊
ကိုယ်က အရင်းအမြစ်တွေကို လွှဲပြောင်းတဲ့အခါ ဘယ်စာရင်းမှာရှိတယ်ဆိုတာ အမြဲပြောဖို့လိုပါတယ်။
အခြားတစ်ဖက်မှာ သင်ဟာ တစ်ခုခုကို မှတ်ပုံတင်နေတဲ့အခါ
သင်လိုအပ်တာက မှတ်ပုံတင်ချင်တဲ့ အရာပါ။

| သင်ကြားချက်                                               | ပစ္စည်းများ                                                                                                 | ရည်မှန်းချက်          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | သာမန်ဒိုမင်၊ ဒေတာနေရာအမည်များနှင့် အကောင့်အမည်များအတွက် setup                                                 |                      |
| [မှတ်ပုံတင်/မမှတ်ပုံတင်ခြင်း](#un-register)                       | ငွေကြေးစာရင်း၊ အရင်းအမြစ်အနက်ကောက်ချက်များ NFTs, Roles, triggers, peers; domain ကိုဖယ်ရှားခြင်း                                |                      |
| [သံပုရာသီး / မီးရှို့ခြင်း](#mint-burn)                                   | ကိန်းဂဏန်းအရင်းအမြစ်များ၊ အစပျိုးမှု ထပ်ခါထပ်ခါ                                                                     | အကောင့်များ (သို့) trigger များ |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | ရှိတဲ့ အရာဝတ္ထုများ [metadata များ](./metadata.md): ဒိုမင်များ၊ အကောင့်များ၊ အရင်းအမြစ်အနက်ကောက်ချက်များ NFTs, RWAs, trigger များ |                      |
| [SetParameter](#setparameter)                             | ကွင်းဆက် parameters များ                                                                                        |                      |
| [ထောက်ပံ့မှု / ပြန်လည်သိမ်းဆည်းခြင်း](#grant-revoke)                             | [အခန်းကဏ္ဍများ၊ ခွင့်ပြုချက် လက်မှတ်များ](/my/blockchain/permissions.md)                                                  | အကောင့်များ သို့မဟုတ် အခန်းကဏ္ဍများ    |
| [လွှဲပြောင်းခြင်း](#transfer)                                     | ဒိုမင်များ၊ အရင်းအမြစ်အနက်ကောက်ချက်များ၊ ကိန်းဂဏန်းအရင်းအမြစ်များ NFTs                                                        | အကောင့်များ             |
| [ဒေသခံဂိုဏ်းနှင့် အရင်းအမြစ်ပိတ်ခြင်း](#native-escrow-and-asset-locks) | အရေအတွက်အရ အရင်းအမြစ်များ၏ ကန့်သတ်ချက်များ၊ အရင်းအမြတ်ပိတ်ခြင်းများ၊ အမည်မသိ ကန့်သတ်ချက်တွေ                                    | ဝယ်ယူသူ၊ ခရီးသွားနေရာများ သို့မဟုတ် အငြင်းပွားမှု ခွဲထွက်မှုများ |
| [ExecuteTrigger](#executetrigger)                         | trigger များ                                                                                                |                      |
| [မှတ်ပုံတင် / အလိုက်အလျောက် / အဆင့်မြှင့်တင်ခြင်း](#other-instructions)                 | logs, executor-specific payloads, executor upgrade များ                                                     |                      |

အခြားနည်းလမ်းတစ်ခုလည်း ရှိပါတယ် ISI, စာရင်းအင်းအရာဝတ္ထုအရ
သူတို့ ထိတွေ့ကြတယ်

| ရည်မှန်းချက်           | ညွှန်ကြားချက်များ                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| အကောင့်          | မှတ်ပုံတင်/မမှတ်ပုံတင်စာရင်းများ၊ လက်ခံလက်ဝယ်များ၊ စာရင်း မီတာဒေတာများကို update လုပ်ခြင်း၊ ခွင့်ပြုချက်များ ပေးအပ်/ငြင်းပယ်ခြင်းနှင့် ကဏ္ဍများ    |
| ဒိုမင်           | ဒိုမင်ကို သတ်မှတ်ခြင်း၊ မှတ်ပုံတင်ခြင်းမှ ရပ်ဆိုင်းခြင်း၊ ဒိုမိုင်းပိုင်ဆိုင်မှုကို လွှဲပြောင်းခြင်း၊ဒိုမင် metadata ကို update လုပ်ခြင်း                    |
| အရင်းအမြစ် သတ်မှတ်ချက် | မှတ်ပုံတင် / မှတ်ပုံတင်မတင်ခြင်းဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ၊ လွှဲပြောင်းပိုင်ခွင့်၊ မီတာဒေတာကို update လုပ်ခြင်း                                         |
| အရင်းအမြစ်များ            | မိတ်ကပ်/မီးရှို့မှု ကိန်းဂဏန်းအရေအတွက်၊ လွှဲပြောင်းမှု ကိန်း ဂဏန်းအရရေ                                                        |
| ငွေကြေးထောက်ပံ့မှု           | ပေးပို့ထားသော ငွေပေးချေမှုကို ဖွင့်ခြင်း၊ လက်ခံခြင်း၊ မှတ်ပုံတင်ခြင်း၊ ပြန်လွှတ်ခြင်း၊ ဖျက်သိမ်းခြင်း၊ အငြင်းပွားခြင်း၊ ဖြေရှင်းခြင်း၊ ထုတ်ယူခြင်း သို့မဟုတ် သက်တမ်းကုန်ဆုံးခြင်း |
| NFT              | မှတ်ပုံတင်/ဖျက်သိမ်းခြင်း NFTs, ပိုင်ဆိုင်မှု လွှဲပြောင်းခြင်း၊ မီတာဒေတာကို update လုပ်ခြင်း                                                |
| RWA              | စာရင်းတင်ခြင်း၊ လွှဲပြောင်းခြင်းအရေအတွက်၊ ထိန်းသိမ်း/လွှတ်ပေးခြင်း၊ အေးခဲ/အေးဆေးခြင်း၊ ပြန်လည်ဖြည့်ဆည်းခြင်း၊ ပေါင်းစပ်ခြင်း၊ မီတာဒေတာများနှင့် ထိန်းချုပ်မှုများကို ခေတ်မီစေခြင်း |
| နှိုးဆော်စက်          | register/unregister, mint/burn trigger repeats, execute trigger, update trigger metadata များကို မှတ်ပုံတင်ခြင်း                 |
| ကမ္ဘာကြီး            | register/unregister peers and roles များ၊ parameters ကို သတ်မှတ်ခြင်း၊ executor ကို upgrade လုပ်ခြင်း                                    |

## CLI ဥပမာများ {#cli-examples}

ဤစာမျက်နှာ၏ဥပမာများတွင်သင်သည် upstream မှ command များကို run လုပ်နေသည်ကို ယူဆပါ
Iroha Default Local Client Configuration ကို အသုံးပြုပြီး Workspace:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

သင် install လုပ်ခဲ့ရင် `iroha` ဘိုင်နရီ၊ အသုံးပြု
`iroha --config ./defaults/client.toml` ဒီအစား နေရာယူသူတွေကို အစားထိုးပါ။
အောက်မှာက သင့်ကွန်ရက်ထဲက တန်ဖိုးတွေနဲ့

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

အများပြည်သူကို ပစ်မှတ်ထား Taira testnet ကိုသုံးပါ Taira Client ကို ဖွဲ့စည်းထားတယ်။
အခွန်ပေးတဲ့ ဥပမာတွေကို မဖွင့်ခင် faucet helper ကို Save လုပ်ပါ။
[Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
အတိုင်း `taira_faucet_claim.py`, ထို့နောက် claim testnet XOR ရေနံတံခါးမှ

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

ရေပိုက်မှ ငွေကြေးထောက်ပံ့တဲ့ အရင်းအမြစ် မြင်နိုင်ပြီးနောက် လိုအပ်တဲ့ ဓာတ်ငွေ့အရင်းအမြစ်ကို ချိတ်ဆက်ပါ။
ငွေလဲလှယ်မှု မှတ်တမ်းတင်ရန်အတွက် metadata:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` Domain တွေကို ဖန်တီးဖို့ ပုံမှန် ပထမဆုံး ထုတ်ဝေတဲ့ လမ်းကြောင်းပါ။
သူတို့ရဲ့ SNS ဒေတာနေရာ၊ ပိုင်ရှင်၊ ငှားရမ်းမှု
term နဲ့ quote guard ကို သုံးပြီး လိုအပ်တဲ့ အခြေအနေအားလုံးကို အက်တမ်နည်းနဲ့ ဖန်တီး (သို့) ပြုပြင်တယ်။
အတည်ပြုထားသော စာမျက်နှာကို အသုံးပြုပါ `POST /v1/aliases/setup/plan` အဆုံးအသတ်မှတ်ချက် (သို့) ကိုက်ညီမှု
CLI အလုပ်ဖြစ်စဉ်:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

ရည်ရွယ်ချက်နဲ့ အစီအစဉ်ဟာ လျှို့ဝှက်မှုမရှိပေမဲ့ အဆင့်အမှတ်တွေကို သုံးပြီး
စီမံကိန်းတစ်ခုဟာ ၎င်းရဲ့
သံကြိုး၊ အာဏာ၊ သက်ရှိနိုင်ငံချောင်းနဲ့ နောက်ဆုံးရက်။ တစ်ခုကိုတစ်ခု ထပ်မသုံးပါနဲ့
ကွန်ရက်။

## (Un) မှတ်ပုံတင် {#un-register}

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းသည် ID a သို့
blockchain ပေါ်မှာ တည်ရှိမှု အသစ်ပါ။

မှတ်ပုံတင်လို့ရတဲ့ အရာတိုင်းဟာ နှစ်ခုစလုံးပါ။ `Registrable` နှင့် `Identifiable`,
ဒါပေမဲ့ ဒါတွေအားလုံးတော့ မဟုတ်ဘူး။ `Identifiable` ရှိသည် `Registrable`. အများစုက
တိုက်ရိုက်မှတ်ပုံတင်ထားပေမဲ့ တစ်ခါတစ်လေမှာ blockchain မှာကိုယ်စားပြုမှု
လုံခြုံရေးနဲ့ စွမ်းဆောင်ရည် အကြောင်းပြချက်တွေကြောင့်
ဒီလို ဒေတာဖွဲ့စည်းမှုအတွက် ဆောက်လုပ်သူ (ဥပမာ။ `NewAccount`), နှင့် peer
မှတ်ပုံတင်မှာ ကိုယ်ပိုင်ပိုင်ဆိုင်မှု သက်သေခံ ညွှန်ကြားချက်ရှိပါတယ်
မှတ်ပုံတင်လို့ရတဲ့ အရာတိုင်းဟာလည်း မှတ်ပုံတင်မရနိုင်ပေမဲ့ ဒါကတော့ မဟုတ်ဘူး။
ခဲယဉ်းပြီး မြန်တဲ့ စည်းကမ်းပါ။

အကောင့်တွေ မှတ်ပုံတင်လို့ရတယ်၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေ၊ NFTs, တူညီသူတွေ၊ အခန်းကဏ္ဍတွေနဲ့
trigger များ။ ဒိုမင်တပ်ဆင်မှု အသုံးပြုချက် `EnsureAlias`; အသားအရေ `Register::Domain` အသုံးဝင်သော ဝန်ဆောင်မှု
genesis/bootstrap အတွက်သာ သတ်မှတ်ထားပါသည်။
`RegisterPeerWithPop`, Peer Key ကို ပိုင်ဆိုင်မှု သက်သေခံထားတယ်။
[ညီလာခံအမည်များ](/my/reference/naming.md) ကန့်သတ်ချက်တွေကို သိရှိဖို့
အဖွဲ့အစည်းအမည်တွေ တင်ပါ။

RWA အစုလိုက်အပြုံလိုက်လုပ်ကိုင်မှု `RegisterRwa` ညွှန်ကြားချက်
လက်ရှိကုဒ်က `UnregisterRwa` ညွှန်ကြားချက်၊ အသုံးပြုမှု
`RedeemRwa` ကိုယ်စားပြုတဲ့ ပမာဏကို အငြိမ်းစားယူဖို့ပါ။

::: info

သတိထားပါ သင့်ရဲ့
[ဘီလူး](/my/guide/configure/genesis.md) အထဲမှာ `genesis.json`
(အထူးသဖြင့် ခွင့်ပြုချက် မှတ်ပုံတင်ကို ထည့်သွင်းထားမလား၊ မပါသေးလား)
ငွေစာရင်းမှတ်ပုံတင်ခြင်းလုပ်ငန်းစဉ်သည် အလွန်ကွဲပြားနိုင်သည်။
ဗိုလ်ချုပ်ကြီး၊ ဒါကို ဒီလို အကျဉ်းချုပ်နိုင်ပါတယ်-

- အထဲမှာ _အများပြည်သူ_ blockchain မှာ ဘယ်သူမဆို အကောင့်တစ်ခု မှတ်ပုံတင်နိုင်သင့်ပါတယ်။
- အထဲမှာ _ပုဂ္ဂလိက_ blockchain မှာ မှတ်ပုံတင်ဖို့ ထူးခြားတဲ့ လုပ်ငန်းစဉ်တစ်ခု ရှိနိုင်ပါတယ်။
  အကောင့်များတွင် _သာမန်_ ပုဂ္ဂလိက blockchain၊ ဆိုလိုတာက blockchain မရှိတဲ့
  အကောင့်တွေ မှတ်ပုံတင်ဖို့ တစ်မျိုးတည်းသော လုပ်ငန်းစဉ်တိုင်းအတွက် အကောင့်တစ်ခု လိုအပ်ပါတယ်။
  နောက်စာရင်းတစ်ခု မှတ်ပုံတင်ပါ။

ဒီခြားနားချက်တွေကို ကျွန်တော်တို့ အသေးစိတ် ဆွေးနွေးကြတယ်
[ပုဂ္ဂလိကနဲ့ အများပိုင် blockchain တွေကို နှိုင်းယှဉ်ကြည့်ပါ။](/my/guide/configure/modes.md).

:::

::: info

peer ကို မှတ်ပုံတင်ခြင်းဟာ လက်ရှိမှာ peers မပါဝင်တဲ့ peers တွေကို ထည့်သွင်းဖို့ တစ်ခုတည်းသောနည်းလမ်းပါ။
ကွန်ရက်ကို သတ်မှတ်ထားတဲ့ မူရင်း ယုံကြည်မှုရှိသူရဲ့ အစိတ်အပိုင်းပါ။

:::

Refer ဘာသာစကားဆိုင်ရာ လမ်းညွှန်ချက်တစ်ခုဆီ သွားပြီး သင်တို့ကို
blockchain ထဲမှာ အရာဝတ္ထုတွေကို မှတ်ပုံတင်ခြင်း လုပ်ငန်းစဉ်:

| ဘာသာစကား              | လမ်းညွှန်                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | သုံးပါ [Iroha CLI](/my/get-started/operate-iroha-via-cli.md) ဒိုမင်တွေ ဖန်တီးဖို့နဲ့ အကောင့်တွေနဲ့ အရင်းအမြစ်တွေကို မှတ်ပုံတင်ဖို့ပါ။ |
| Rust                  | သုံးပါ [Rust သင်ခန်းစာ](/my/guide/tutorials/rust.md).                                                      |
| Kotlin/Java           | သုံးပါ [Kotlin/Java သင်ခန်းစာ](/my/guide/tutorials/kotlin-java.md).                                        |
| Python                | သုံးပါ [Python သင်ခန်းစာ](/my/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | သုံးပါ [JavaScript/TypeScript သင်ခန်းစာ](/my/guide/tutorials/javascript.md).                               |

သာမန်ဒိုမင်တပ်ဆင်မှုကို စီစဉ်ပြီး အသုံးချပါ၊ နောက်ပြီး မဖြစ်တဲ့အခါ ဒိုမင်ကို မှတ်ပုံတင်ခြင်းမရှိပါ။
ပိုကြာမြင့်စွာ လိုအပ်ပါသည်

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

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်း NFTs. NFT မှတ်ပုံတင်က ၎င်းရဲ့ အကြောင်းအရာကို ဖတ်တယ်။ JSON မှ
ပုံမှန် input:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

မှတ်ပုံတင်ခြင်းနှင့် မမှတ်ပုံတင်ခြင်းဆိုင်ရာ အခန်းကဏ္ဍများ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

မှတ်ပုံတင်ခြင်းနှင့် မှတ်ပုံတင်မလုပ်ခြင်း trigger များ
စုစည်းထားသည် IVM bytecode သို့မဟုတ် serialized ညွှန်ကြားချက်စာရင်းကို.
(က) `Log` ညွှန်ကြားချက် CLI ဒါကို trigger မှတ်ပုံတင်ထဲ ထိုးသွင်းပေးတယ်။

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

မှတ်ပုံတင်ပြီး မှတ်ပုံတင်မလုပ်ပါ။ BLS သော့နဲ့ PoP နှင့်အတူ `kagami`
သင့်မှာ မရှိသေးဘူးဆိုရင်-

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## သံပုရာသီး / မီးရှို့ခြင်း {#mint-burn}

Minting နှင့် မီးရှို့ခြင်းသည် ကိန်းဂဏန်းအရင်းအမြစ်များနှင့် ကန့်သတ်ထားသော trigger များကို ရည်ညွှန်းနိုင်သည်။
တစ်ချို့လက်ဝယ်များကို မသုံးနိုင်သောအဖြစ် သတ်မှတ်နိုင်သည်
မှတ်ပုံတင်ပြီးနောက်မှာ တစ်ကြိမ်သာ လုပ်နိုင်တာပါ။

အရင်းအမြစ်များကို သီးခြားစာရင်းတစ်ခုသို့ ချမှတ်ထားသည်၊ ပုံမှန်အားဖြင့် မှတ်ပုံတင်ထားသောစာရင်း
အရင်းအမြစ်အရေအတွက်တွေဟာ အပျက်သဘောမဟုတ်တော့
ဘယ်တော့မှ မလုပ်ဖူးဘူး။ `$-1.0` အရင်းအမြစ်တစ်ခုရဲ့ အပျက်သဘော ပမာဏကို မီးရှို့ပြီး ငွေကြေးရယူပါ။

ဘာသာရပ်ဆိုင်ရာ လမ်းညွှန်ချက် တစ်ခုကို သွားကြည့်ပါ။
blockchain ထဲမှာ အရင်းအမြစ်တွေကို မိတ်ဆက်ခြင်း လုပ်ငန်းစဉ်:

- [CLI](/my/get-started/operate-iroha-via-cli.md)
- [Rust](/my/guide/tutorials/rust.md)
- [Kotlin/Java](/my/guide/tutorials/kotlin-java.md)
- [Python](/my/guide/tutorials/python.md)
- [JavaScript/TypeScript](/my/guide/tutorials/javascript.md)

မီးရှို့တဲ့ အရင်းအမြစ်တွေရဲ့ နမူနာတွေကတော့-

- [CLI](/my/get-started/operate-iroha-via-cli.md)
- [Rust](/my/guide/tutorials/rust.md)

Mint နှင့် burn ကိန်းဂဏန်းအရင်းအမြစ်များ:

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

Mint နဲ့ burn trigger ထပ်ကျော့ခြင်း

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## လွှဲပြောင်းခြင်း {#transfer}

ငွေလွှဲပြောင်းခြင်းသည် ပိုင်ဆိုင်မှု (သို့) တန်ဖိုးကို အကောင့်များအကြား လွှဲပြောင်းခြင်းဖြစ်သည်။
ကဏ္ဍများ၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ၊ ကိန်းဂဏန်းအရင်းအမြစ်များနှင့် NFTs. RWA
အရေအတွက်လှုပ်ရှားမှု dedicated ကိုအသုံးပြုသည် `TransferRwa` နှင့် `ForceTransferRwa`
ညွှန်ကြားချက်များ [လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ](/my/blockchain/rwas.md).

ဒါလုပ်ဖို့တော့ အကောင့်တစ်ခု ပေးဖို့လိုပါတယ်။
[အရင်းအမြစ်လွှဲပြောင်းခွင့်](/my/reference/permissions.md). ကိုးကားပါ
ငွေလွှဲပြောင်းမှုဆိုင်ရာ ဥပမာ
[CLI](/my/get-started/operate-iroha-via-cli.md) ဒါမှမဟုတ်
[Rust](/my/guide/tutorials/rust.md).

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

Native escrow instruction များကို book-managed protocol ထဲမှာ နံပါတ်အရင်းအမြစ်များကို lock လုပ်ပေးရန်
စျေးကွက်ပုံစံ ဖြေရှင်းမှုအတွက် အသုံးပြုကြတယ်၊ အထွေထွေ အရင်းအမြစ်
Lock တွေနဲ့ အမည်မဲ့ ကန့်သတ်ထားတဲ့ escrow စီးဆင်းမှုတွေပေါ့။

စျေးကွက်မှာ ငွေကြေးထောက်ပံ့မှု သုံးစွဲချက် `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, နှင့် `ResolveEscrowDispute`. ယေဘုယျ အရင်းအမြစ်ပိတ်ခြင်း အသုံးပြုမှု
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, နှင့်
`ExpireAssetLock`. Anonymous escrow က စျေးကွက်ရဲ့ သက်တမ်း စက်ဝန်းကို
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, နှင့်
`ResolveAnonymousEscrowDispute`.

ဒါတွေကို ISIs လက်ရှိမှာ ပထမတန်းအစား မရှိဘူး။ CLI commands ကိုသုံးပါ SDK
ဆောက်လုပ်သူများ (သို့) အစဉ်လိုက် ညွှန်ကြားမှု အသုံးဝင်ပစ္စည်းများ
[Native Asset Escrow](/my/blockchain/escrow.md) ဘဝပတ်ဝန်းကျင် အသေးစိတ်အတွက်၊
ခွင့်ပြုချက်များ၊ မေးမြန်းမှုများ၊ ဖြစ်ရပ်များနှင့် Rust နမူနာတွေ

## ထောက်ပံ့မှု / ပြန်လည်သိမ်းဆည်းခြင်း {#grant-revoke}

ငွေပေးချေခြင်းနှင့် ပယ်ဖျက်ခြင်းဆိုင်ရာ ညွှန်ကြားချက်များကို အကောင့်အတွက် အသုံးပြုသည်။
[ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍများ](permissions.md).

`Grant` သုံးစွဲသူကို ခွင့်ပြုချက် တစ်ခုတည်းကို အမြဲတမ်းပေးရန် အသုံးပြုသည် သို့မဟုတ်
ခွင့်ပြုချက် အုပ်စု ("role" ဆိုသည်မှာ) ခွင့်ပြုမှုများနှင့် ခွင့်ပြုချက်ကို ပေးအပ်ထားသော အခန်းကဏ္ဍများသည်
ကိုင်တွယ်ခြင်း `Revoke` ညွှန်ကြားချက်များ
ဂရုတစိုက်သုံးပါ။

အကောင့်တစ်ခုပေါ်က ကဏ္ဍကို ပေးအပ်ပြီး ရုပ်သိမ်းခြင်း

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

ခွင့်ပြုချက် လက်မှတ်များကို ပေးအပ်ပြီး ရုပ်သိမ်းပါ။ ခွင့်ပြုမှု အမိန့်များက ခွင့်ပြုချက်ကို ဖတ်ရှု
Standard input မှ Object ကို:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

အခန်းကဏ္ဍတစ်ခုအတွက် ခွင့်ပြုချက်ပေးပြီး ရုပ်သိမ်းခြင်း

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

ဤညွှန်ကြားချက်များ update object ကို [metadata များ](/my/blockchain/metadata.md). အသုံးပြုခြင်း
`SetKeyValue` metadata entry ကိုထည့်သွင်းဖို့ (သို့) အစားထိုးဖို့ `RemoveKeyValue` သို့
တစ်ခုကို ဖျက်ပစ်ပါ။

မီတာဒေတာ `set` command တွေကို ဖတ်ပါ။ JSON Standard input မှ တန်ဖိုး:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

စာရင်း၊ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေမှာလည်း အလားတူ ပုံစံရှိပါတယ် NFTs, RWAs,
နောက်ပြီး trigger တွေက-

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

`SetParameter` Active data တွေက ဖော်ပြတဲ့ Chainwide Parameters တွေကို ပြောင်းလဲပေးတယ်။
မော်ဒယ်နဲ့ အကောင်အထည်ဖော်သူ။

ကန့်သတ်ချက်တစ်ခုကို တစ်ကန့်သတ်ချက်ကို ဖြတ်ပြီး သတ်မှတ်ပါ။ JSON စံချိန်တင်ထားသော object
input:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ဤညွှန်ကြားချက်ကို လုပ်ဆောင်ရန် အသုံးပြုသည် [trigger များ](./triggers.md).

နိုင်ငံခြားရေး CLI trigger တွေကို မှတ်တမ်းတင်နိုင်ပြီး trigger execution events ကို subscribe လုပ်နိုင်ပါတယ်။
တိုက်ရိုက် မပေးပါဘူး `execute trigger` အမိန့်ကို
လမ်းညွှန်စာရွက်ကို တင်ပြပါ `ExecuteTrigger` ညွှန်ကြားချက်တစ်ခု ဖန်တီးပါ
`InstructionBox` အမည်နှင့် SDK ဒါမှမဟုတ် အကောင်အထည်ဖော်ရေး ကိရိယာနဲ့ ရလာတဲ့ JSON
array ကို ဖြတ်သန်း `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## အခြားညွှန်ကြားချက်များ {#other-instructions}

Iroha Runtime နဲ့ executor အတွက် အောက်ခြေအဆင့် ညွှန်ကြားချက်တွေကိုလည်း ဖော်ပြပေးပါတယ်။
ပေါင်းစပ်ခြင်း

- `Log`: အကောင်အထည်ဖော်မှုအတွင်း log entry ကို ထုတ်ပေးပါ
- `CustomInstruction`: အကောင်အထည်ဖော်သူအတွက် သီးသန့် ဆောင်ရွက်ခြင်း JSON အသုံးဝင်သော ဝန်ဆောင်မှုများ
- `Upgrade`: executor upgrade ကို activate လုပ်ပါ

တင်ပြပါ `Log` ping အကူနဲ့ သင်ကြားချက်:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Custom Executor ညွှန်ကြားချက်ကို serialized တစ်ခုအဖြစ်တင်ပါ။ `InstructionBox`. နိုင်ငံခြားရေး
payload ပုံစံက executor-specific ဖြစ်လို့ ညွှန်ကြားချက်ကို
ကိုက်ညီမှု SDK ဒါမှမဟုတ် အကောင်အထည်ဖော်ရေး ကိရိယာ:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

compile လုပ်ထားတဲ့ executor ကို upgrade လုပ်ပါ။ IVM byte code ဖိုင်:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
