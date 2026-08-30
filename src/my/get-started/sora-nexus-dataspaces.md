---
translation_locale: my
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3 ကို တည်ဆောက်ပါ: Taira နှင့် Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 သည် app ကို ဦးတည်ပြီး တည်ဆောက်ထားသော အများပြည်သူ ဖြန့်ချိရေးလမ်းကြောင်းဖြစ်သည်။ Iroha 3 နှင့် SORA Nexus. ဆောက်လုပ်ပြီး လေ့ကျင့်ပါ။ Taira ပထမဦးဆုံး၊ အဲဒီနောက်မှာ အလားတူ client shape ကို Minamoto သင်မှာ သီးခြားကလီးတွေရှိရင်သာ၊ တကယ့် XOR အခကြေးနဲ့ ထုတ်လုပ်မှု ခွင့်ပြုချက်အတွက်ပါ။

ဒီသင်ခန်းစာမှာ အများပြည်သူ SORA 3 ကွန်ရက်များအတွက် Iroha ဖောက်သည်ကိုဘယ်လို configure လုပ်ရမလဲပြသထားပါတယ်

- Taira testnet ကို `https://taira.sora.org` တွင်
- Minamoto အဓိကရထား `https://minamoto.sora.org`

Taira ကို ပေါင်းစပ်မှု စမ်းသပ်မှုများ၊ ရေပိုက်မှ ရင်းနှီးမြှုပ်နှံထားသော စာရေးခြင်း ကန်နာရီများနှင့် ဖြန့်ချိမှု လေ့ကျင့်ခန်းများအတွက် အသုံးပြုပါ။ Minamoto ကို ထုတ်လုပ်ရန် အသင့်ရှိသည့် ပင်မကွန်ရက် လှုပ်ရှားမှုအတွက်သာ အသုံးပြုပါ။ ကွန်ရက်နှစ်ခုစလုံးသည် XOR တွင် အခွန်ကောက်ခံကြသည်။

- Taira သည် ပြည်သူ့ရေချိုးခန်းမှ testnet XOR ကို အသုံးပြုသည်။
- Minamoto သည် စစ်မှန်သော XOR ကို အသုံးပြုသည်။ Minamoto faucet မရှိပါ။

## ဆောက်လုပ်ရေး လမ်းကြောင်း {#builder-path}

|အဆင့် |Taira Testnet |Minamoto Mainnet |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|ကွန်ရက်အခြေအနေကို စတင်ဖတ်ရှုပါ |သော့မရှိတဲ့ မေးခွန်း `/status` |သော့မရှိတဲ့ မေးခွန်း `/status` |
|ဒေတာနေရာကို ရွေးချယ်ပါ။|အများသုံး `universal` ကို သုံးပါ၊ သင့်ရဲ့ app မှာ ထိန်းချုပ်ထားတဲ့ လမ်းကြောင်း မလိုဘူးဆိုရင် |အလားတူ ဒေတာနေရာကို အဓိကကွန်ရက် အတည်ပြုပြီးနောက်သာ သုံးပါ။ |
|အခွန်အရင်းအမြစ်ရယူပါ။|အများပြည်သူ Taira faucet ကိုသုံးပါ။|ငွေကြေးထောက်ပံ့ထားတဲ့ Minamoto အကောင့်မှ (သို့) ခွင့်ပြုထားသော ဘဏ္ဍာငွေစီးဆင်းမှုမှ XOR ကိုရယူခြင်း |
|Test က ရေးထားတယ်|faucet-financed test XOR ကို အသုံးပြုပါ။|စမ်းသပ်မှု tooling ကိုမသုံးပါနဲ့; စာရင်းအင်းစရိတ်စစ်မှန် XOR |
|အားဖြည့်ပေးပါ။|ဆင်ခြင်တုံတရား၊ စောင့်ကြည့်မှု၊ လက်မှတ်ရေးထိုးမှုကို ထပ်မံစမ်းသပ်ပါ။|သီးခြားသော့တွေ၊ ဘဏ္ဍာရေးနဲ့ ဖြန့်ချိမှု ထိန်းချုပ်မှုတွေကို သုံးပါ။ |

လက်တွေ့ စီးဆင်းမှုဟာ-

1. client ကို Taira နဲ့ build လုပ်ပြီး public `universal` data space ကို သုံးပါ။
2. လက်မှတ်ရေးထိုးသူကို ထည့်ပြီး Taira faucet နဲ့ ငွေပေးချေပါ။
3. Taira ကို ဆန့်ကျင်ပြီး သင့်ရဲ့ app logic ကို လေ့ကျင့်ပါ၊ ပျက်ကွက်မှုတွေဟာ ငြီးငွေ့စရာဖြစ်ပြီး လေ့လာလို့ရတဲ့ အထိပါ။
4. သီးခြား Minamoto လက်မှတ်ရေးထိုးသူကို ဖန်တီးပြီး တကယ့် XOR ဖြင့် ရင်းနှီးမြှုပ်နှံပြီး သက်သေပြထားတဲ့ လုပ်ငန်းတွေကိုပဲ mainnet သို့ ပြောင်းပါ။

## Cookbook ကို ဆက်သုံးပါ {#continue-with-the-cookbook}

Network ကို ရွေးချယ်ရန်၊ လက်မှတ်ရေးထိုးသူကို သတ်မှတ်ရန်နှင့် ငွေကြေးခများအတွက် ဤလမ်းညွှန်ကို အသုံးပြုပါ။ ထို့နောက်သင်တည်ဆောက်ချင်သော application ပြုမူပုံကိုက်ညီသည့် recipe ကိုဆက်လုပ်ပါ-

|ရည်မှန်းချက်|ချက်ပြုတ်ချက်|
| --- | --- |
|Taira ကို စစ်ဆေးပြီး ဖောက်သည်ကို ညွှန်ပြပါ။ | [Taira](/my/cookbook/connect-to-taira.md) သို့ ချိတ်ဆက်ပါ။|
|ပထမ စာကိုပို့ပြီး ရလဒ်ကို စစ်ဆေးပါ။| [ငွေပေးချေမှုများကို တင်ပြပြီး စစ်ဆေးခြင်း ](/my/cookbook/submit-and-verify-transactions.md) |
|မှတ်ပုံတင်၊ ငွေကြေးထုတ်ပေးပြီး ရွှေ့တန်ဖိုး | [ဖောင်ဂျီနယ် အရင်းအမြစ်များ](/my/cookbook/fungible-assets.md) |
|Filtered application status ကို ဖတ်ပါ။| [Query Ledger State ](/my/cookbook/query-ledger-state.md) |
|ချုပ်ဆိုထားသောပြောင်းလဲမှုများကို တုံ့ပြန်ခြင်း | [Stream Event များ](/my/cookbook/stream-events.md) |

ချက်ပြုတ်စာအုပ်က အလုပ်ဖြစ်စဉ်တိုင်းကို အာရုံစိုက်ထားပြီး Taira ထောက်ပံ့မှု (သို့) SORA Nexus ကွန်ရက် အခြေအနေလိုအပ်တဲ့အခါ ဒီနေရာကို ပြန်လည် link လုပ်တယ်။

## (၁) သင်ဘာကို သတ်မှတ်နေမှန်း နားလည်ပါ {#_1-understand-what-you-are-setting-up}

SORA Nexus တွင်, ဒေတာနေရာသည်ကွန်ရက်လမ်းကြောင်းနှင့် လမ်းညွှန်စာရင်း၏တစ်စိတ်တစ်ပိုင်းဖြစ်သည်။ ဖောက်သည်သည်သည် `client.toml` ကိုပြောင်းလဲခြင်းဖြင့်သာ အများပြည်သူအတွက်ဒေတာနေရာသစ်ကိုမဖန်တီးပါ။ Client setup သည်အရာနှစ်ခုကိုလုပ်ဆောင်သည်:

1. client ကို ညာဘက် Torii အဆုံးမှတ်ကို ညွှန်ပြနေသည်
2. ၎င်း၏ Canonical account အတွက် domain နှင့် data space routing context ကိုရွေးချယ်သည်

`AccountId` ဒါက အမြဲတမ်း တရားဝင်ဖြစ်ပြီး နယ်ပယ်မဲ့ပါ။ `[account].domain` တန်ဖိုး `client.toml` Routing နဲ့ alias context တွေကို ပေးထားပြီး Account Identity ရဲ့ အစိတ်အပိုင်း မဖြစ်လာပါဘူး။ အများစုအတွက် အများပြည်သူနဲ့ စတင်ပါ။ `universal` ဒေတာအကွာအဝေး (data space) `domain.dataspace` ဥပမာ ပုံစံ:

```text
wonderland.universal
```

သင်ဟာ အဖွဲ့အစည်းဆိုင်ရာ ဒေတာဇုန်သစ်တစ်ခု လိုအပ်ရင် သာမန်ဖောက်သည်အကောင့်ကနေ မှတ်ပုံတင်ဖို့ကြိုးစားမယ့်အစား စာရင်းစာရင်းနဲ့ လမ်းညွှန်မှု အဆိုပြုချက်ကို ပြင်ဆင်ပါ။ အောက်ပါ [ Provision a New Dataspace](#_8-provision-a-new-dataspace) ကိုကြည့်ပါ။

## (၂) အများပြည်သူ Torii အဆုံးသတ်မှတ်ချက်ကို စစ်ဆေးပါ။ {#_2-check-the-public-torii-endpoint}

လက်မှတ်ရေးထိုးသူကို ညွှန်ကြားမပေးခင် ပစ်မှတ်သတ်မှတ်ချက်က live ဖြစ်နေတာကို စစ်ဆေးပါ။

Taira အတွက်:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto အတွက်:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

node ကဖွင့်ထားတဲ့ data space နဲ့ lane view ကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

`https://minamoto.sora.org/status` နဲ့ အတူတူ command ကို mainnet အတွက် သုံးပါ။

## Taira MCP Agents များအတွက် {#taira-mcp-for-agents}

Taira သည် agent runtime များအတွက် Torii-native Model Context Protocol (MCP) တံတားကိုလည်းဖေါ်ပြထားသည်။ Agent တစ်ခုသည် ပထမဆုံး custom Torii client ကိုမတည်ဆောက်ဘဲ Live testnet စာဖတ်ခြင်း၊ scripted diagnostics သို့မဟုတ် ကျယ်ကျယ်ပြန့်စွာစစ်ဆေးသော write rehearsals များလိုအပ်သည့်အခါအသုံးပြုပါ။

|Settings ကို|တန်ဖိုး |
| --- | --- |
|MCP အဆုံးသတ်မှတ်ချက် |`https://taira.sora.org/v1/mcp` |
|ကွန်ရက် root ကို|`https://taira.sora.org` |
|ရည်ရွယ်ချက်များ |Taira testnet စာဖတ်ခြင်းနဲ့ faucet မှ ရင်းနှီးမြှပ်နှံတဲ့ စာရေးမှု လေ့ကျင့်ခန်းများ |
|ထုတ်လုပ်ရေး ညီမျှမှု |ဤစာရင်းကို Minamoto သို့ မညွှန်းပါနဲ့။ အဓိကကွန်ရက် MCP အဆုံးသတ်မှတ်ချက်နှင့် ဖြန့်ချိမှုထိန်းချုပ်ချက်များကို ရှင်းလင်းစွာ ခွင့်ပြုခြင်း မရှိပါကသာပါ။ |

လက်မှတ်ရေးထိုးတဲ့ ပစ္စည်းတွေ မထည့်ခင် တံတား metadata ကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL ကို agent runtime တွင် user-local MCP server အဖြစ် configure လုပ်ပါ။ ဒီ docs repo သို့မဟုတ် application repo ထဲသို့ agent MCP config, API tokens, forwarded auth headers, `authority` သို့မဟုတ် `private_key` တန်ဖိုးများကို မချမှတ်ပါနဲ့။

Taira နဲ့ ကောင်းမွန်စွာ အလုပ်လုပ်တဲ့ Agent prompt စည်းမျဉ်းတွေ

- MCP ဆာဗာမှ ကိရိယာများကို ဖုန်းမခေါ်ခင် ရှာဖွေပါ။ ဆာဗားက `listChanged` အစီရင်ခံစာကို ပြန်လည်ရှာဖွေပါ။
- `iroha.` ကိရိယာတွေကို raw `torii.` ကိရိယာတွေထက် ပိုနှစ်သက်တယ်။
- စာရွက်စာတမ်းများ၊ အရင်းအမြစ်များ၊ အမည်မဖော်လိုသူများ၊ ဘလော့များ၊ အုပ်ချုပ်မှုအခြေအနေနှင့် ငွေပေးချေမှုအခြေအနေများကို တင်ပြရန် မတိုင်မီ စာဖတ်ခြင်းမှသာ စပါ။
- Live testnet အပြောင်းအလဲမတိုင်ခင် လူသားရဲ့ ရှင်းလင်းတဲ့ ညွှန်ကြားချက်တစ်ခု တောင်းဆိုပါ။ ကြိုတင်လက်မှတ်ထိုးထားတဲ့ ငွေကြေးဖုံးအုပ်တွေအတွက် `iroha.transactions.submit_and_wait` ကို အသုံးပြုပါ၊ ဒီတော့ ကိုယ်စားလှယ်က ရလဒ်ကို တင်တာအစား စောင့်တာပါ။
- Agent တုံ့ပြန်မှုတွင် ငွေပေးချေမှု hash များ၊ နောက်ဆုံးအခြေအနေများနှင့် ဆာဗာအတည်ပြုချက် အမှားများကို စုစည်းပါ။

### ကိုယ်စားလှယ်များနှင့်အတူ ဖွံ့ဖြိုးတိုးတက်ရေး လုပ်ငန်းစဉ် {#development-workflow-with-agents}

Iroha ဖောက်သည်များ၊ ငွေပေးချေမှု တည်ဆောက်သူများ၊ ရောဂါစစ်ဆေးရေး စကရစ်များနှင့် testnet runbooks များအတွက် agent များကို development assistant အဖြစ် အသုံးပြုပါ။ Agent ၏ အာဏာကို ကျဉ်းမြောင်းစေရန်။ ၎င်းဟာ ကုဒ်ကို စိစစ်နိုင်တယ်၊ Taira အခြေအနေကို ဖတ်နိုင်တယ်၊ အပြောင်းအလဲတွေကို အဆိုပြုနိုင်ပြီး ဒေသတွင်း စမ်းသပ်မှုတွေ လုပ်နိုင်တယ်။ ဒါပေမဲ့ လူသားက တိကျတဲ့ လုပ်ငန်းစဉ်ကို ခွင့်မပြုခင်မှာ သက်ဆိုင်ရာ ကွန်ရက်ကို မပြောင်းလဲသင့်ပါဘူး။

လက်တွေ့ အလုပ်ဖြစ်စဉ်က-

1. SDK ကုဒ်၊ CLI အမိန့်၊ (သို့) MCP ကိရိယာ အစီအစဉ်ကို စာရေးမပေးခင် သက်ဆိုင်ရာ Docs ကို စစ်ဆေးရန် Agent ကိုတောင်းဆိုပါ။
2. အေဂျင့်က ပထမဆုံး အသေးဆုံး ဖောက်သည်လမ်းကြောင်းကို ရေးခိုင်းပါ။ အခြေအနေ စစ်ဆေးခြင်း၊ အကောင့်ရှာဖွေမှု၊ အမည်မဖော်လိုတဲ့ ဆုံးဖြတ်ချက် (သို့) ဟန်ချက်စာရင်း ရှာဖွေခြင်း။
3. Taira နဲ့ စာဖတ်လို့သာရတဲ့ ဖုန်းခေါ်ဆိုမှုတွေ လုပ်ပြီးနောက်ပဲ Transaction building code ကို ထည့်သွင်းပါ။
4. တိုက်ရိုက်ကွန်ရက် စမ်းသပ်မှုများကို `TAIRA_LIVE=1` နောက်မှာ ရွေးချယ်ထားပါ။ ဒီတော့ ပုံမှန် unit test run တစ်ခုဟာ testnet ရင်းနှီးမြှုပ်နှံမှုကို ဘယ်တော့မှ ကုန်ကျခြင်းမဟုတ်ဘူး၊ ကွန်ရက်ရရှိနိုင်မှုအပေါ် မူတည်တယ်။
5. ငွေပေးချေမှု မပြုလုပ်မီမှာ ကွန်ရက် အမြစ်၊ ကွင်းဆက်၊ အာဏာပိုင်စာရင်း၊ ညွှန်ကြားချက်စုဆောင်းချက်၊ အခွန်အရင်းအမြစ်နဲ့ မျှော်လင့်ထားသော အခြေအနေ ပြောင်းလဲမှုကို သတင်းပို့ဖို့ အေဂျင့်ကို တောင်းဆိုပါ။
6. CI (သို့) mainnet အလုပ်ဖြစ်စဉ်များသို့ မတင်မီ လျှို့ဝှက်ကိုင်တွယ်မှု၊ ပြန်လည်စမ်းသပ်မှုအပြုအမူ၊ idempotency နှင့် rejection ကိုင်တွယ်ခြင်းအတွက် ဖန်တီးထားတဲ့ ကုဒ်ကို Review လုပ်ပါ။

ဖွံ့ဖြိုးတိုးတက်ရေးအတွက် အသုံးဝင်သော ဖတ်နိုင်မှုသာရှိတဲ့ MCP ကိရိယာများမှာ အကောင့်အင်းအမြစ်ရှာဖွေမှု၊ အမည်မဖော်လိုတဲ့ အဖြေ၊ ဘလော့ရှာဖွေမှု၊ ငွေပေးချေမှု ရှာဖွေခြင်း၊ ငွေလဲလှယ်စာရင်းများနှင့် pipeline အခြေအနေ စစ်ဆေးခြင်းတို့ ပါဝင်ပါတယ်။ လက်မှတ်ထိုးထားတဲ့ အကျိုးဆောင်ဝန်ပိုးတစ်ခုခုကို မတင်မီ ယုံကြည်မှုကို တည်ဆောက်ရန် ဒါတွေကို အသုံးပြုပါ။

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ငွေပေးချေမှု လုပ်ငန်းစဉ်များ Agent များမှတဆင့် {#transaction-workflow-through-agents}

MCP တံတားသည် လက်မှတ်ရေးထိုးထားသော Iroha ငွေပေးချေမှုကို တင်ပြနိုင်သော်လည်း ပုံမှန်ငွေပေးချေမှု လိုအပ်ချက်များကို ဖယ်ရှားခြင်းမရှိပေ။ ငွေပေးချေးမှုတစ်ခုအတွက် မှန်ကန်သော အာဏာ၊ ခွင့်ပြုချက်များ၊ အခွန်ထောက်ပံ့မှု၊ ချိတ်ဆက်ချက် ID၊ မီတာဒေတာနှင့် လက်မှတ်လိုအပ်ပါသေးတယ်။

ရိုးရိုး Iroha ငွေပေးချေမှုအတွက် ပထမဦးဆုံးအနေနဲ့ SDK သို့မဟုတ် CLI စာလုံးဖြင့် ငွေလဲလှယ်မှုအဖုံးကို တည်ဆောက်ပြီး လက်မှတ်ထိုးပြီး နောက်မှ ကိုယ်စားလှယ်အား သာမန်စာလုံးသာ ပေးပါ။ `body_base64` အဖြစ် ကုဒ်သွင်းထားသော လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှု ဘိုက်များ။ ကိုယ်စားလှယ်သည် စာအိတ်ကို `iroha.transactions.submit_and_wait` ဖြင့်တင်ပြနိုင်ပြီး (သို့) `iroha.transactions.submit` နှင့် စစ်တမ်းကို `iroha.transactions.wait` ဖြင့် တင်ပြနိုင်ပါတယ်။

Private key တွေကို agent prompt ထဲမှာ မထည့်ပါနဲ့။ agent က transaction တစ်ခု တည်ဆောက်ဖို့လိုတယ်ဆိုရင် user ရဲ့ runtime ရဲ့ လျှို့ဝှက်ချက်တွေကို load လုပ်တဲ့ local code ကို ညွှန်ပြပါ။ environment, keychain, hardware signer, or ignored testnet config file. agent က key material ကို Markdown, fixtures, logs, or commits ထဲမှာ ဘယ်တော့မှ မရေးသင့်ပါဘူး။

ငွေပေးချေမှု မတင်မီ ကိုယ်စားလှယ်ကို ငွေပေးချေးမှု အစီအစဉ် အတိုထုတ်လုပ်ခိုင်းပါ။

- `network`: Taira testnet root နှင့် chain ကို ID
- `authority`: စာရင်းမှတ်ပုံတင်ပြီး အခွန်ပေးသွင်းတဲ့စာရင်း
- `instructions`: မှတ်ပုံတင်၊ မိတ်ကပ်၊ မီးရှို့၊ လွှဲပြောင်းခြင်း၊ metadata များ၊ ခွင့်ပြုချက်များ သို့မဟုတ် စာချုပ်ခေါ်ဆိုမှု အကျဉ်းချုပ်
- `fee asset`: Taira တွင် ငွေကောက်ခံမည့် အရင်းအမြစ်များ
- `preflight reads`: အကောင့်၊ အရင်းအမြစ်စုဆောင်းမှု၊ ခွင့်ပြုချက်များ၊ အမည်မဖော်လိုသူများ (သို့မဟုတ်) ဘလော့စစ်ဆေးမှုများ
- `expected result`: အတည်ပြုပြီးနောက် မြင်ရသင့်သော အခြေအနေ
- `idempotency`: အလားတူတောင်းဆိုချက်ကို ထပ်မံစစ်ဆေးပါက ဘာတွေဖြစ်မလဲ။

စာပို့ပြီးနောက် terminal status ကိုစောင့်ခိုင်းပြီး state change ကို read query ဖြင့် စစ်ဆေးပါ။ အသုံးဝင်ပြီးစီးမှု အစီရင်ခံစာမှာ:

- Transaction hash
- `Committed`, `Applied`, `Rejected` သို့မဟုတ် `Expired` တို့လို terminal status များ။
- Block (သို့) explorer အသေးစိတ်များရှိပါက
- စစ်ဆေးမှု ဖတ်စာ ရလဒ်များ
- ငြင်းပယ်ခြင်းသတင်းစကားနှင့် ပျက်ကွက်မှုသည် ခွင့်ပြုချက်များ၊ အခွန်များ၊ အတည်ပြုချက်များ, ရပ်ဆိုင်းထားသောအခြေအနေများ သို့မဟုတ် အဆုံးသတ်မှတ်တိုင်ရရှိနိုင်မှုကဲ့သို့ ထင်မြင်နေသလား။

နမူနာစောင့်ရှောက်မှု ချက်ချင်း:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

လက်မှတ်ထိုးထားတဲ့ စာအိတ်ကို ကြိုတင်ပြင်ဆင်တဲ့အခါမှာ-

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP ကို အများသုံး စမ်းသပ်ရေးကွန်ရက် ထိန်းချုပ်မှု မျက်နှာပြင်တစ်ခုအဖြစ် ဆက်ဆံပါ။ Taira ခလုတ်များ၊ စမ်းသပ်ရေးကုန်းများ XOR၊ faucet account များနှင့် canary signers တို့ကို တစ်ကြိမ်သုံးနိုင်ပြီး Minamoto ခလုတ်တွေနဲ့ ထုတ်လုပ်မှုထုတ်လုပ်မှု လုပ်ငန်းခွင်များမှ သီးခြားထားသင့်သည်။

## ယခုစမ်းသပ်နိုင်သော ကစားစရာများ {#toy-examples-you-can-try-now}

ဒီဥပမာတွေဟာ မှတ်သားမထားဘူးဆိုရင် ဖတ်လို့ ရနိုင်တာပါ၊ သော့တွေ မထုတ်ခင် အလုပ်ဖြစ်ပြီး အများသုံးကွန်ရက် နှစ်ခုစလုံးကို တိုက်ခိုက်ဖို့ ဘေးကင်းပါတယ်။

Taira testnet နှင့် Minamoto mainnet ကျန်းမာရေးကို နှိုင်းယှဉ်ကြည့်ပါ-

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira မှ ထုတ်ပြန်ထားသော အများပြည်သူ ဒေတာနေရာလမ်းကြောင်းများကို ဖော်ပြပါ-

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Minamoto ကို အဓိကကွန်ရက်အမြင်ကိုလိုအပ်တဲ့အခါမှာ အလားတူ command ကို run လုပ်ပါ။

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Dashboard, bot, သို့မဟုတ် deployment စစ်ဆေးရန်အတွက် အသေးစား Node.js အခြေအနေ sonde ကိုတည်ဆောက်ပါ။

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

Taira faucet claim ဖြစ်သင့်သည်။ testnet XOR ကို အသုံးပြုပြီး Minamoto သို့ ဘယ်တော့မှ ညွှန်မထားသင့်ပါ။

## 3. Taira Client Config ကိုဖန်တီးပါ။ {#_3-create-a-taira-client-config}

လက်ရှိမှာ မရှိဘူးဆိုရင် Keypair ကို Generate လုပ်ပါ။

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

`taira.client.toml` ကို ဖန်တီးပါ

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ထိပ်ဆုံးအဆင့် `chain` တိကျတဲ့ Taira ငွေပေးချေမှု ကွင်းဆက် ID. နိုင်ငံတကာ `[account].profile = "taira"` setting က လွတ်လပ်စွာ ရွေးချယ်တယ်။ Taira I105 ကွင်းဆက်ခွဲခြားမှု။ ID Account profile ကို မရွေးချယ်ပါ။

စာဖတ်လို့ရတဲ့ စစ်ဆေးချက်တစ်ခု လုပ်ပါ။

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

စာရေးတဲ့ စမ်းသပ်မှု မလုပ်ခင် အများပြည်သူ Taira ရောဂါစစ်ဆေးမှုကို လုပ်ပါ။

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ဘဏ္ဍာငွေ Taira ငွေပေးချေမှု စာရင်းကို မဖွင့်ခင် faucet ကိုဖြတ်ပြီး account လုပ်ပါ။ [Testnet ကို ရယူပါ။ XOR အပေါ် Taira](#_4-get-testnet-xor-on-taira).

Faucet claim ကို လက်ခံပြီး အကောင့်ကို ငွေကြေးထောက်ပံ့ပြီးနောက် Taira canary သည်ရွေးချယ်စရာ write smoke test ဖြစ်ပါသည်။

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Canary က လက်မှတ်ထိုးထားတဲ့ ping ကိုတင်ပေးပြီး အတည်ပြုမှုကို စောင့်ဆိုင်းပြီး `--write-config` ပေးတဲ့အခါ Runtime Signer Config ကို ရေးပါတယ်။ Taira ဟာ အများပြည်သူ စမ်းသပ်ရေးကွန်ရက်တစ်ခုပါ။ ဒီတော့ queue saturation က faucet ကိုယ်တိုင်အလုပ်လုပ်နေချိန်မှာတောင် လက်မှတ်ထိုးထားတဲ့ ping ကို ကျရှုံးစေနိုင်ပါတယ်။ `taira doctor` သည်ပြည့်ဝတဲ့ queue တစ်ခုကို အစီရင်ခံပေးပါက (သို့) Canary က `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` ကိုပြန်ပို့ပါက၊ ဒါကို client configuration error အဖြစ်မယူခင် စောင့်ပြီး ထပ်မံကြိုးစားပါ။

ထိန်းချုပ်မှုမရှိတဲ့ မီးခိုးစမ်းသပ်မှုတွေအတွက် ကန်နာရီကို နယ်နိမိတ်ထားတဲ့ ပြန်လည်စမ်းသပ်မှု loop ထဲမှာ ဝိုင်းထားပါ။

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

`iroha taira doctor` သည် ပြင်းထန်သော ကျရှုံးမှုများကိုပြသပါက ထပ်မံစမ်းသပ်ခြင်းကိုရပ်ဆိုင်းပါ။ အတန်းအပြည့်အဝခြင်းနှင့် အခွန်လက်ခံမှု ငြင်းပယ်မှုများသည် အများပြည်သူစစ်ဆေးရေးကွန်ရက်၏ ယာယီအခြေအနေဖြစ်သည်; DNS, TLS သို့မဟုတ် `status = "fail"` ရောဂါရှာဖွေမှုများသည်မဟုတ်ပါ။

## SORA Nexus Account ID ကို ဖန်တီးပါ။ {#generate-a-sora-nexus-account-id}

A ကို SORA Nexus အကောင့် ID ကနောဂဗေဒဆိုင်ရာ I105 Account public key နဲ့ target network prefix တွေကနေ ရယူထားတဲ့ Address ပါ။ `[account].domain` ဖောက်သည်မှာ တန်ဖိုး TOML. တူညီတဲ့ အများသုံး သော့က ကွဲပြားခြားနားတဲ့ IDs အပေါ် Taira နှင့် Minamoto, ထုတ်ကုန်သုံးစွဲသူများအတွက် သီးခြား keypair တစ်ခုကို ဖန်တီးသင့်သည်။ Minamoto.

Account ကို Control လုပ်ပေးမယ့် Ed25519 Keypair ကို Generate (သို့) load လုပ်ပါ။

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

အများသုံး သော့ကို Taira အကောင့် ID သို့ ပြောင်းပါ။

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto public key ကို mainnet prefix နဲ့ ပြောင်းပေးပါ။

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

ရလာတဲ့ အကောင့်ကို အသုံးပြုပါ။ ID ဘယ်နေရာမှာမဆို Nexus API ဒါမှမဟုတ် CLI အမိန့်က တရားဝင်စာရင်းကို တောင်းဆိုတယ်။ ID, ဥပမာ Taira ရေပိုက် `account_id`, balance queries များ၊ stringent account fields များ (သို့) alias bindings များကို ပြုလုပ်ပါ။ private key ကို client configuration ထဲမှာ ထည့်ပြီး public network ကို select လုပ်ပါ။ `[account].profile = "taira"` ဒါမှမဟုတ် `[account].profile = "minamoto"`.

ID ကိုထုတ်လုပ်ခြင်းသည် ၎င်းဘာသာမှ ငွေကြေးပေးချေမှုအစီအစဉ်ပေါ်က အကောင့်ကို ဖန်တီးခြင်းမဟုတ်ပါ။ Taira တွင်၊ faucet သည် testnet ရေးသားချက်များအတွက် အကောင့်ကိုဖန်တီးနိုင်ပြီး ဘဏ္ဍာငွေပေးနိုင်သည်။ Minamoto တွင်, ခွင့်ပြုထားသော mainnet onboarding သို့မဟုတ် treasury flow ကိုအသုံးပြုပါ။

### Key Storage နှင့် Backup {#key-storage-and-backup}

ID အကောင့်နဲ့ အများသုံး သော့ကို မျှဝေနိုင်ပြီး လိုက်ဖက်တဲ့ ပုဂ္ဂလိက သော့၊ စကားဝှက်စကားစု၊ မျိုးစေ့နဲ့ ပြန်လည်ထူထောင်ရေး ပစ္စည်းတွေကို လျှို့ဝှက်ထားရမယ်။

SORA Nexus စာရင်းများအတွက် ဤနည်းလမ်းများကို အသုံးပြုပါ-

- Private keys ကို encrypted password manager, hardware-backed keystore (သို့) dedicated signing service ထဲမှာ သိမ်းထားပါ။ source control အတွက် key တွေကို မချမှတ်ပါနဲ့။ ဒါမှမဟုတ် production keys တွေကို shell history, logs, chat, tickets, or unencrypted backups တွေထဲမှာမထားပါနဲ့။
- ဝဲလ် (သို့) ထုတ်လုပ်ရေး လက်မှတ်ထိုးသူတိုင်းအတွက် ထူးခြားတဲ့ entropy မြင့်သော စကားဝှက်စကားစုကို အသုံးပြုပါ။ လျှို့ဝှက်ချက်ချထားတဲ့ ပုဂ္ဂလိက သော့နဲ့ အတူတူမဟုတ်ဘဲ စကားဝှက် စီမံခန့်ခွဲသူ (သို့) ခွဲထားသော ထိန်းသိမ်းမှု လုပ်ငန်းစဉ်မှာ စကားဝှက်တွေကို သိမ်းဆည်းလိုက်ပါ။
- Taira နှင့် Minamoto သော့တွေကို သီးခြားထားပါ။ Taira သော့ကို တစ်ကြိမ်သုံး စမ်းသပ်ရေးကွန်ရက် ပစ္စည်းအဖြစ်နဲ့ Minamoto သော့ကို ထုတ်လုပ်မှု ရင်းနှီးမြှုပ်နှံမှု အာဏာပိုင်အဖြစ် ဆက်ဆံပါ။
- Private key, public key, account ID, account profile, and any account recovery or custody notes needed to restore the signer ကို back up လုပ်ပါ။ network context ကင်းမဲ့သော private key ကို recovery လုပ်နေစဉ် အလွယ်တကူ မကောင်းမွန်စွာ အသုံးပြုနိုင်သည်။
- ထုတ်လုပ်ရေး လက်မှတ်ထိုးသူများအတွက် အနည်းဆုံး ကုဒ်သွင်းထားသော offline backup တစ်ခုနှင့် ပထဝီပိုင်းဆိုင်ရာ သီးခြားကုဒ်သွင်းထားသည့် backup တစ်ခုကို ထိန်းသိမ်းပါ။ Backup ကိုမှီခိုမီ read-only operation လေးတစ်ခုဖြင့် ပြန်လည်ထူထောင်မှုကို စမ်းသပ်ပါ။
- Private key, passphrase, backup media (သို့) signing host တွေကို ပွင့်လင်းမြင်သာလာနိုင်တယ်ဆိုရင် လက်မှတ်ထိုးသူကို လှည့်လိုက် (သို့) အစားထိုးပါ။

အသေးစိတ်သိရှိလိုပါက [Storing Cryptographic Keys](/my/guide/security/storing-cryptographic-keys.md) နှင့် [Password Security](/my/guide/security/password-security.md) ကိုကြည့်ပါ။

## (၄) Testnet XOR ကို Taira သို့ခေါ်ယူပါ။ {#_4-get-testnet-xor-on-taira}

ပြည်သူ့ရေချိုးခန်းကို တိုက်ရိုက်သုံးပါ။ စီးဆင်းမှုက:

1. လက်မှတ်ရေးထိုးသူကို ဖန်တီးခြင်း (သို့) တင်ခြင်းနှင့် ၎င်း၏ Canonical Taira Account ID ကို တွက်ချက်ခြင်း။
2. လက်ရှိ faucet puzzle ကို ယူလာပါ။
3. `difficulty_bits` သည် `0` ထက် ပိုများလျှင် ပဟေဠိကို ဖြေရှင်းပါ။
4. faucet တောင်းဆိုချက်ကို တင်ပြပါ။
5. ငွေပေးချေစာရင်း (သို့) ပိုင်ဆိုင်မှု ဘားလန်ကို ပေးသွင်းရန် မတိုင်မီ မြင်နိုင်အောင် စောင့်ကြည့်ပါ။

အများသုံး သော့ကို Taira I105 အကောင့် ID faucet မှမျှော်လင့်ချက်:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

ပဟေဠိကို ယူလာပါ။

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

Faucet သည် အများပိုင် testnet ဝန်ဆောင်မှုတစ်ခုဖြစ်သည်။ ပဟေဠိ (သို့) တောင်းဆိုချက်အဆုံးမှတ်က `502`၊ အချိန်ကုန်ခြင်း သို့မဟုတ် အခြားဂိတ်ဝဲအဆင့်အမှားကိုပြန်ပို့ပါက သော့များ (သို့မဟုတ်) ဖောက်သည်သတ်မှတ်ချက်ကိုမပြောင်းလဲခင် စောင့်ပြီး ထပ်မံကြိုးစားပါ။

ဒီတုံ့ပြန်မှုက ဒီလိုပုံစံရှိပါတယ်။

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

`difficulty_bits` သည် `0` ဖြစ်ပါက, စာရင်းကိုသာ တင်ပြပါ ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits` သည် `0` ထက်ပို၍ရှိပါက ပဟေဠိကိုဖြေရှင်းပြီး ancor height plus nonce ကို ထည့်သွင်းပါ။

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

ပဟေဠိရဲ့ အယ်လ်ဂိုရစ်သမ်က

1. စိန်ခေါ်မှုကို SHA-256 အဖြစ် တည်ဆောက်ပါ။
   - `iroha:accounts:faucet:pow:v2` ၏ ဘိုက်များ
   - UTF-8 စာရင်း ID
   - `anchor_height` ကို big-endian အဖြစ် `u64`
   - `anchor_block_hash_hex` ကို byte အဖြစ် decoded လုပ်ထားတယ်။
   - `challenge_salt_hex` ကို ဘိုက်များအဖြစ် ဖေါ်ထုတ်ထားသည်မှာ
2. `u64` nonces များကို big-endian 8-byte တန်ဖိုးများအဖြစ် ကုဒ်ပေးပါ။
3. nonce တစ်ခုစီအတွက် scrypt ကို run လုပ်ပါ။
   - စကားဝှက်: 8-byte nonce
   - ဆား: 32-byte စိန်ခေါ်မှု
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - ထုတ်ကုန်အလျား: 32 bytes
4. နိုင်တဲ့ nonce ဟာ အနည်းဆုံး `difficulty_bits` က သုည bits ကို ဦးဆောင်တဲ့ ပထမဆုံး digest ဖြစ်တယ်။

Faucet တုံ့ပြန်မှုမှာ ငွေကြေးထောက်ပံ့တဲ့ အရင်းအမြစ်နဲ့ queued transaction hash ပါပါတယ်။

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

လက်ရှိတွင် HTTP `202 Accepted` ဖြင့် ပြန်လည်ဖြေကြားခြင်းဖြစ်သည်။ ၎င်း၏ `asset_definition_id` သည် အများပြည်သူ faucet မှထောက်ပံ့သောလက်ရှိ Taira အခွန်အရင်းအမြစ်ဖြစ်သည်; ဥပမာတစ်ခုကို ကူးယူခြင်းအစား တုံ့ပြန်မှုမှ ရယူပါ။ ID ကိုပြန်လည်ပို့ပေးသောအခါ faucet ကတောင်းဆိုချက်ကို လက်ခံခဲ့သည်။ `tx_hash_hex` နှင့် `status: "QUEUED"`.

ပြီးရင် ငွေကြေးထောက်ပံ့ထားတဲ့ အရင်းအမြစ်အတွက် စစ်တမ်းကောက်ယူပြီး သင့်ကိုယ်ပိုင် အခွန်ပေးချေမှုလုပ်ငန်းတွေကို မတင်ခင်:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Faucet claim ကို လက်ခံခဲ့ပေမဲ့ အကောင့် (သို့) အရင်းအမြစ်က မမြင်ရသေးဘူးဆိုရင်၊ ငွေပေးချေမှုသည် အများပြည်သူ testnet queue processing နောက်ကွယ်မှာ ရှိနေဆဲပါ။ စာရေးပို့ခြင်းမတိုင်ခင် ဖတ်စာကို စောင့်ပြီး ထပ်မံကြိုးစားပါ။

API စစ်ဆေးရန် အသင့်ရှိသည့် တိုက်ရိုက်စစ်ဆေးမှုအတွက် ဤစာရင်းကို `taira_faucet_claim.py` အဖြစ် သိမ်းထားပြီး Taira I105 အကောင့် ID ကို ပေးပို့ပါ။

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

Taira testnet ရင်းနှီးမြှုပ်နှံမှုအတွက်သာ faucet ကို အသုံးပြုပါ။ XOR testnet၊ faucet accounts သို့မဟုတ် Taira canary signers များကို Minamoto စီးဆင်းမှုများတွင် မသုံးပါနဲ့။

## (၅) Minamoto Client Config ကို ဖန်တီးပါ။ {#_5-create-a-minamoto-client-config}

Minamoto အတွက် သီးခြားသော့စုံကို အသုံးပြုပါ။ အဓိကကွန်ရက်အတွက် Taira သော့တွေကို ပြန်မသုံးပါနဲ့။

`minamoto.client.toml` ကို ဖန်တီးပါ

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ထိပ်ဆုံးအဆင့် `chain` current ဆိုတာ Nexus အဓိက ကွန်ရက်ကွင်းဆက် ID. `[account].profile = "minamoto"` ရွေးချယ်ခြင်း Minamoto I105 ကွင်းဆက်ခွဲခြားသူ၊ အဆုံးအသတ်မှတ်ချက်ရဲ့ အိမ်ရှင်နာမည်နဲ့ ကွင်းဆက် ID အတိအကျ မရွေးချယ်ပါနဲ့။

Minamoto အများသုံးသော့ကို ၎င်း၏ တရားဝင် I105 အကောင့် ID တွင် mainnet ကြိုတင်စာရင်းနှင့်အတူ ပြောင်းပါ။

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Account ကို mainnet onboarding (သို့) governance flow ကနေ ထောက်ပံ့ပြီး ငွေကြေးထောက်ပံ့မပေးတဲ့အထိ read-side checks တွေကိုသာ လုပ်ပါ။

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira faucet (သို့) write-canary assistant ကို Minamoto နဲ့မတိုက်ပါနဲ့။

## (၆) ရန်ပုံငွေ Minamoto ငွေစာရင်း XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto အခကြေးကိုထုတ်လုပ်မှု XOR ဖြင့်ပေးဆပ်ခြင်းဖြစ်ပြီး Minamoto တွင် အများပြည်သူရေပြွန်မရှိပါ။ ခွင့်ပြုထားသော ပင်မကွန်ရက်ပေါ်တင်သွင်းခြင်း (သို့မဟုတ်) ဘဏ္ဍာငွေလွှဲပြောင်းခြင်းမှတစ်ဆင့် ဖွဲ့စည်းထားသည့်စာရင်းကို ရင်းနှီးမြှုပ်နှံခြင်း၊ သို့မဟုတ် တည်ရှိပြီးသား ငွေကြေးထောက်ပံ့ထားသော Minamoto အကောင့်မှ XOR ကိုရယူခြင်း။

စာရွက်စာတမ်းတင်မပေးခင် Canonical account ID နှင့် ငွေကြေးကို ဖတ်ရှုမှုသာ စစ်ဆေးပါ။ Minamoto XOR ကိုထုတ်လုပ်ရေးငွေအဖြစ်ဆက်ဆံပါ၊ အရင်ဆုံး Taira မှာတူညီတဲ့ လုပ်ငန်းစဉ်ကို လေ့ကျင့်၊ သီးခြားထုတ်လုပ်ရေး သော့တွေကို ထိန်းထားပြီး အဓိကကွန်ရက်ရောင်းဝယ်မှုကို ပြန်လည်ဖွင့်နိုင်တယ်လို့ မယူဆပါနဲ့။

Taira XOR သည် Minamoto အခွန်ကို မပေးနိုင်ပါ။ Testnet ကွင်းကျန်များနှင့် faucet claims များသည် Minamoto သို့ လွှဲပြောင်းခြင်းမရှိပါ။

## (၇) တည်ရှိသော ဒေတာနေရာအတွင်းတွင် အလုပ်လုပ်ပါ။ {#_7-work-inside-an-existing-dataspace}

အပြည့်အဝ ကျင့်သုံးထားတဲ့ ဒေတာနေရာအတွင်းမှာ နေထိုင်တဲ့ Ledger အရာဝတ္ထုတွေအတွက် Domain Name တွေကို အသုံးပြုပါ။ ဥပမာ အများပြည်သူဒေတာနေရာထဲက Project Domain တစ်ခုမှာ သုံးသင့်တာက:

```text
apps.universal
```

သင့်အကောင့်မှာ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေရှိပြီးနောက် domain အတွက် လျှို့ဝှက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်ကို ဖန်တီးပြီး Declarative Planner ကိုသုံးပါ။

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto အတွက် သီးခြား အဓိကကွန်ရက်ရည်ရွယ်ချက်နှင့် အစီအစဉ်တစ်ခု ဖန်တီးပြီး ခွင့်ပြုပါ။ စီမံကိန်းများသည် ၎င်းတို့၏ချိတ်ဆက်မှု၊ အာဏာ၊ သက်ရှိအခြေအနေ ချုပ်ပိုးမှုနှင့် နောက်ဆုံးအချိန်ကို ချည်နှောင်ထားသည်ဖြစ်၍ Taira အစီအစဉ်ကို တိုးမြှင့်ခြင်း သို့မဟုတ် ပြန်လည်ကစားနိုင်ခြင်းမရှိပေ:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Account aliases တွေက data space ကို သုံးတဲ့ suffix တစ်ခုတည်းကို သုံးပါတယ်။

```text
alice@apps.universal
alice@universal
```

Strict account fields တွေမှာ Canonical ကို အသုံးပြုနေဆဲပါ။ I105 အကောင့် IDs. အမည်မဖော်လိုတာတွေကို လူသားတွေ ဖတ်လို့ရတဲ့ ချည်နှောင်မှုတွေနဲ့ ဆက်ဆံပါ။ IDs.

## (၈) ဒေတာနေရာသစ်ပေးခြင်း {#_8-provision-a-new-dataspace}

ဒေတာဇုန်သစ်သည် လုပ်ငန်းရှင်နှင့် အုပ်ချုပ်မှုပြောင်းလဲခြင်းဖြစ်သည်။ အများပြည်သူ Torii အဆုံးမှတ်သည် သတ်မှတ်ထားသောဒေတာဇုန်များသို့ရုံးလွှမ်းမှုကို လမ်းညွှန်နိုင်သော်လည်းမသိသောဒေတာ ဇုန်အမည်များကို ပယ်ချလိမ့်မည်။

အပြောင်းအလဲ မလုပ်ခင် လက်ရှိ Live Catalogue ကို ရိုက်ယူပါ

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

အော်ပရေတာအကောင့်အတွက် လမ်းကြောင်းပြသနာပုံအနေအထားကိုလည်း စစ်ဆေးပါ။

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

လမ်းကြောင်း ID, ဒေတာနေရာ ID, validator set, fault tolerance, manifest, routing rules နှင့် operational owner တို့ကို အတူတကွ ပြန်လည်သုံးသပ်ထားမှသာ alias အသစ်တစ်ခုကို မကြေညာပါနဲ့။ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေနဲ့ သာမန် အသုံးပြုသူ အကောင့်တစ်ခုဟာ တည်ရှိနေတဲ့ ဒေတာဝက်ဘ်ဆိုက်အတွင်းမှာ ဒိုမင်တစ်ခုရယူနိုင်ပြီး SNS လိုင်စင်ကို အမည်မဲ့ စီမံကိန်းမှတစ်ဆင့် ချေးယူနိုင်ပါတယ်။ ဒါက အများသုံး ဒေတာဝိုင်းသစ်ကို ဘေးကင်းစွာ မဖြည့်ဆည်းနိုင်ပါဘူး။

ပုဂ္ဂလိက (သို့) အဖွဲ့အစည်းဆိုင်ရာ ဒေတာဇုန်အတွက်၊ အောက်ပါအတိုင်း စာရင်းအပြောင်းအလဲတစ်ခု ပြင်ဆင်ပါ။

- တစ်ခုတည်းသော ဒေတာနေရာအမည်နှင့် နံပါတ်များ `id`
- အချိတ်အဆက်လမ်းထည့်သွင်းမှု (သို့) တည်ဆဲလမ်းထည့်သတ်မှတ်ချက်
- ဒေတာနေရာ `fault_tolerance`
- လမ်းညွှန်ချက်များ (သို့) အဲဒီမှာ ဆင်းသက်သင့်တဲ့ အကောင့်အကွာအဝေးများအတွက် လမ်းကြောင်းစည်းမျဉ်းများ
- Space Directory manifest (သို့မဟုတ်) ဒေတာနေရာက UAID အရည်အချင်းတွေကို ဖော်ပြတဲ့အခါ အလားတူ ဖြန့်ချိမှု အထောက်အထားပါ။
- Validator၊ compliance, settlement နှင့် monitoring policy များအတွက် အုပ်ချုပ်မှု ခွင့်ပြုချက်

စစ်ဆေးလို့ရတဲ့ config အပိုင်းအစက ဒီလိုပါ။

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

Operator လက်ခံမှုမှာ အောက်ပါဂိတ်တွေ ပါဝင်သင့်ပါတယ်။

- `iroha3d --sora --config <config.toml> --trace-config` သည် ဖြေရှင်းသော node configuration ကို လွှဲပြောင်းပေးသည်
- ဖန်တီးထားသော (သို့) ပြန်လည်သုံးသပ်ထားသော စာရင်းကို hash နှင့် လက်မှတ်များဖြင့် သိမ်းဆည်းထားသည်။
- မီးခိုးစမ်းသပ်မှု Taira ကို Minamoto တိုးမြှင့်ခြင်းတစ်ခုခုမတိုင်မီ ဖြတ်သန်းပါ။
- ပြင်ဆင်ပြီးနောက် စာရင်း `/status` တွင် ရည်ရွယ်ထားသောလမ်းကြောင်းနှင့် ဒေတာနေရာကို ဖော်ပြထားသည်။
- `iroha app nexus lane-report --summary` မှာ လိုအပ်တဲ့ မော်နီဖောင်းတွေ ပျောက်နေတာကို ဖော်ပြမထားပါ။

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Taira ဖြန့်ချိခြင်း၊ မီးခိုးစမ်းသပ်မှု၊ စောင့်ကြည့်ခြင်းနှင့် အုပ်ချုပ်မှုသက်သေများ ပြီးဆုံးပြီးမှသာ Minamoto သို့တူညီသော ဒေတာနေရာကို တိုးတက်စေရန်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [Iroha 3](/my/get-started/install-iroha.md) ကို တပ်ဆင်ပါ။
- [လည်ပတ်မှု Iroha 3 မှတဆင့် CLI](/my/get-started/operate-iroha-via-cli.md)
- [ပုဂ္ဂလိက ဒေတာနေရာအတွက် ပံ့ပိုးမှု အခွန်များ ](/my/get-started/private-dataspace-fee-sponsor.md)
- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
- [Genesis ကို ရည်ညွှန်းချက် ](/my/reference/genesis.md)
