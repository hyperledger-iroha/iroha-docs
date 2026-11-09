---
translation_locale: my
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 8d3ec8cf5a6ee09d9c05dd63c018ebb656f9e340f9d30f9e335baf2101c39055
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira နှင့် Minamoto ကို အသုံးပြု၍ SORA Nexus ပေါ်တွင် တည်ဆောက်ခြင်း {#build-on-sora-3-taira-and-minamoto}

SORA Nexus သည် Iroha 3 ပေါ်တွင် အလုပ်လုပ်သည်။ အက်ပ်ကို Taira ပေါ်တွင် ဦးစွာ တည်ဆောက်၍ စမ်းသပ်ပါ။ ပင်မကွန်ရက်အတွက် သီးခြားသော့များ၊ ဝန်ဆောင်ခပေးရန် XOR အစစ်နှင့် လက်တွေ့အသုံးပြုခွင့် အတည်ပြုချက် ရရှိပြီးမှ ထိုကလိုင်းယင့်ဆက်တင်များကို Minamoto သို့ ပြောင်းသုံးပါ။

ဤလမ်းညွှန်တွင် SORA Nexus ၏ အများသုံးကွန်ရက်နှစ်ခုအတွက် Iroha ကလိုင်းယင့်ကို မည်သို့ သတ်မှတ်ရမည်ကို ရှင်းပြထားသည်။

- Taira testnet ကို `https://taira.sora.org` တွင်
- Minamoto အဓိကရထား `https://minamoto.sora.org`

Taira ကို ပေါင်းစပ်မှု စမ်းသပ်ချက်များ၊ testnet မှ ရင်းနှီးမြှုပ်နှံထားသော စာရေးနည်းပြများနှင့် ဖြန့်ချိမှု လေ့ကျင့်ခန်းများအတွက် အသုံးပြုပါ။ Minamoto ကို ထုတ်လုပ်ရန် အသင့်ရှိသည့် အဓိကကွန်ရက် လှုပ်ရှားမှုအတွက်သာ အသုံးပြုပါ။ ကွန်ရက်နှစ်ခုစလုံးသည် XOR တွင် အခွန်ကောက်ခံသည်။

- Taira သည် testnet XOR ကို အများပြည်သူ testnet ဘဏ္ဍာရေးဝန်ဆောင်မှုမှ အသုံးပြုသည်။
- Minamoto real ကို အသုံးပြုသည် XOR. မရှိဘူး။ Minamoto testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု။

## ဆောက်လုပ်ရေး လမ်းကြောင်း {#builder-path}

|အဆင့် |Taira Testnet |Minamoto Mainnet |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| ကွန်ရက်အခြေအနေကို စစ်ဆေးခြင်း | သော့မသုံးဘဲ `/status` မှ ဒေတာကို ရယူပါ | ဝန်ဆောင်မှုလိပ်စာနှင့် TLS လက်မှတ်ကို ဦးစွာ အတည်ပြုပါ |
|ဒေတာနေရာကို ရွေးချယ်ပါ။|အများသုံး `universal` ကို သုံးပါ၊ သင့်ရဲ့ app မှာ စီမံခန့်ခွဲထားတဲ့ အကောင်အထည်ဖော်ရေး လမ်းကြောင်း မလိုဘူးဆိုရင်|အလားတူ ဒေတာနေရာကို အဓိကကွန်ရက် အတည်ပြုပြီးနောက်သာ သုံးပါ။ |
|အခွန်အရင်းအမြစ်ရယူပါ။|အများပြည်သူ Taira testnet ထောက်ပံ့မှု ဝန်ဆောင်မှုကို အသုံးပြုပါ။ |ငွေကြေးထောက်ပံ့ထားတဲ့ Minamoto အကောင့်မှ (သို့) ခွင့်ပြုထားသော ဘဏ္ဍာငွေစီးဆင်းမှုမှ XOR ကိုရယူခြင်း |
|Test က ရေးထားတယ်|testnet မှ ရင်းနှီးမြှုပ်နှံသည့် စမ်းသပ်မှု XOR ကို အသုံးပြုပါ။ |စမ်းသပ်မှု tooling ကိုမသုံးပါနဲ့; စာရင်းအင်းစရိတ်စစ်မှန် XOR |
|အားဖြည့်ပေးပါ။|Logic, monitoring နဲ့ cryptographic signer ကို ပြန်ပြီး စမ်းကြည့်ပါ။ |သီးခြားသော့တွေ၊ ဘဏ္ဍာရေးနဲ့ ဖြန့်ချိမှု ထိန်းချုပ်မှုတွေကို သုံးပါ။ |

လက်တွေ့ စီးဆင်းမှုဟာ-

1. client ကို Taira နဲ့ build လုပ်ပြီး public `universal` data space ကို သုံးပါ။
2. cryptographic signer ကိုထည့်ပြီး Taira testnet ငွေကြေးထောက်ပံ့မှုဝန်ဆောင်မှုဖြင့် ရင်းနှီးမြှုပ်နှံပါ။
3. Taira ကို ဆန့်ကျင်ပြီး သင့်ရဲ့ app logic ကို လေ့ကျင့်ပါ၊ ပျက်ကွက်မှုတွေဟာ ငြီးငွေ့စရာဖြစ်ပြီး လေ့လာလို့ရတဲ့ အထိပါ။
4. သီးခြား Minamoto လက်မှတ်ထိုးသူတစ်ဦးကို ဖန်တီးပြီး အမှန်တကယ်တန်ဖိုးရှိသော XOR ဖြည့်ပေးပါ။ စမ်းသပ်အတည်ပြုပြီးဖြစ်သည့် တူညီသောလုပ်ဆောင်မှုများကိုသာ mainnet သို့ ပြောင်းရွှေ့ပါ။

## Cookbook ကို ဆက်သုံးပါ {#continue-with-the-cookbook}

ကွန်ရက်တစ်ခုကို ရွေးချယ်ရန်၊ cryptographic signer ကို သတ်မှတ်ရန်နှင့် ငွေကြေးခများအတွက် ဤလမ်းညွှန်ကို အသုံးပြုပါ။ ပြီးရင် သင်တည်ဆောက်ချင်တဲ့ application behavior ကိုက်ညီသည့် recipe ကို ဆက်လုပ်ပါ။

|ရည်မှန်းချက်|ချက်ပြုတ်ချက်|
| --- | --- |
|Taira ကို စစ်ဆေးပြီး ဖောက်သည်ကို ညွှန်ပြပါ။ |[Taira သို့ ချိတ်ဆက်ပါ။](/my/cookbook/connect-to-taira.md) |
|ပထမ စာကိုပို့ပြီး ရလဒ်ကို စစ်ဆေးပါ။|[ငွေပေးချေမှုများကို တင်သွင်းပြီး စစ်ဆေးခြင်း](/my/cookbook/submit-and-verify-transactions.md) |
|မှတ်ပုံတင်၊ ထုတ်လွှင့်၊ ရွှေ့တန်ဖိုး |[ဖောင်ဂျီတယ် အရင်းအမြစ်များ](/my/cookbook/fungible-assets.md) |
|Filtered application status ကို ဖတ်ပါ။|[မေးမြန်းချက် blockchain ledger ပြည်နယ်](/my/cookbook/query-ledger-state.md) |
|အပြီးသတ်ပြောင်းလဲမှုများကို တုံ့ပြန်ခြင်း |[အဖြစ်အပျက်များကို Stream](/my/cookbook/stream-events.md) |

ချက်ပြုတ်စာအုပ်က အလုပ်ဖြစ်စဉ်တိုင်းကို အာရုံစိုက်ထားပြီး Taira ထောက်ပံ့မှု (သို့) SORA Nexus ကွန်ရက် အခြေအနေလိုအပ်တဲ့အခါ ဒီနေရာကို ပြန်လည် link လုပ်တယ်။

## (၁) သင်ဘာကို သတ်မှတ်နေမှန်း နားလည်ပါ {#_1-understand-what-you-are-setting-up}

SORA Nexus တွင်ဒေတာနေရာသည်ကွန်ရက်လုပ်ဆောင်မှုလမ်းကြောင်းနှင့် လမ်းညွှန်စာရင်း၏တစ်စိတ်တစ်ပိုင်းဖြစ်သည်။ ဖောက်သည်သည်သည် `client.toml` ကိုပြောင်းလဲရုံဖြင့် အများသုံးဒေတာနေရာသစ်ကိုမဖန်တီးပါ။ Client setup သည်အရာနှစ်ခုကိုလုပ်သည်:

1. Torii API အဆုံးမှတ်ရဲ့ ညာဘက်မှာ ဖောက်သည်ကို ညွှန်ပြတယ်။
2. Single protocol-standard account အတွက် domain နဲ့ data space routing context ကို ရွေးချယ်ပေးတယ်။

`AccountId` သည်အမြဲတမ်း single protocol-standard နှင့် domainless ဖြစ်ပါသည်။ `client.toml` တွင်ရှိသော `[account].domain` တန်ဖိုးသည် လမ်းညွှန်ခြင်းနှင့် alias အခြေအနေကိုပေးသည်။ ၎င်းသည်အကောင့်သမိုင်း၏တစ်စိတ်တစ်ပိုင်းမဟုတ်ပေ။ applications များအတွက်တော့ အများပြည်သူ `universal` ဒေတာနေရာမှစပါ။ Domain context က `domain.dataspace` ပုံစံကိုအသုံးပြုသည်၊ ဥပမာ:

```text
wonderland.universal
```

သင်ဟာ အဖွဲ့အစည်းဆိုင်ရာ ဒေတာဇုန်သစ်တစ်ခု လိုအပ်ရင် သာမန် ဖောက်သည်အကောင့်ကနေ မှတ်ပုံတင်ဖို့ ကြိုးစားမယ့်အစား စာရင်းစာရင်းနဲ့ လမ်းညွှန်မှု အဆိုပြုချက်ကို ပြင်ဆင်ပါ။ အောက်ပါ [ဒေတာနေရာသစ်ပေးခြင်း](#_8-provision-a-new-dataspace) ကို ကြည့်ပါ။

## (၂) အများပြည်သူ Torii API အဆုံးမှတ်ကို စစ်ဆေးပါ။ {#_2-check-the-public-torii-endpoint}

`curl` နှင့် `jq` ကို သုံးပြီး Taira စမ်းသပ်ကွန်ရက်၏ အခြေအနေကို စစ်ဆေးပါ။ ဤစစ်ဆေးမှုအတွက် သော့ သို့မဟုတ် ကိုယ်ပိုင်ကွန်ရက်ဆုံမှတ် မလိုပါ။

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

node က ဖော်ပြထားတဲ့ data space နဲ့ execution lane view ကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Minamoto ကို အသုံးမပြုမီ ပင်မကွန်ရက်ဝန်ဆောင်မှု၏ လိပ်စာကို ကွန်ရက်စီမံသူထံမှ အတည်ပြုပြီး TLS လက်မှတ်သည် ဆာဗာ၏ အမည်နှင့် ကိုက်ညီကြောင်း စစ်ဆေးပါ။

## Taira MCP Agents များအတွက် {#taira-mcp-for-agents}

Taira သည် agent software အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်များအတွက် Torii-native Model Context Protocol (MCP) တံတားကိုလည်းဖေါ်ပြထားသည်။ ပထမဆုံး custom Torii client ကိုမတည်ဆောက်ဘဲ live testnet readings, scripted diagnostics သို့မဟုတ် ကျယ်ကျယ်ပြန့်စွာစစ်ဆေးသော write rehearsals များလိုအပ်သည့်အခါအသုံးပြုပါ။

|Settings ကို|တန်ဖိုး |
| --- | --- |
|MCP API အဆုံးသတ်မှတ်ချက် |`https://taira.sora.org/v1/mcp` |
|ကွန်ရက် root ကို|`https://taira.sora.org` |
|ရည်ရွယ်ချက်များ |Taira testnet စာဖတ်ခြင်းနဲ့ testnet မှ ရင်းနှီးမြှပ်နှံတဲ့ စာရေးမှု လေ့ကျင့်ခန်းများ |
|ထုတ်လုပ်ရေး ညီမျှမှု | ဤစာရင်းကို Minamoto အဓိက ကွန်ရက်မှလွဲရင် MCP API Endpoint နဲ့ release control တွေကို ရှင်းလင်းစွာ ခွင့်ပြုထားပါတယ်။ |

လက်မှတ်ရေးထိုးတဲ့ ပစ္စည်းတွေ မထည့်ခင် တံတား metadata ကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

agent ၏ runtime တွင် ထို URL ကို အသုံးပြုသူစက်အတွင်းရှိ MCP ဆာဗာအဖြစ် ပြင်ဆင်သတ်မှတ်ပါ။ agent အတွက် MCP ပြင်ဆင်သတ်မှတ်ချက်၊ API token များ၊ တစ်ဆင့်ပို့ထားသော အထောက်အထားစစ်ဆေးရေး header များ၊ `authority` သို့မဟုတ် `private_key` တန်ဖိုးများကို ဤစာတမ်း repository သို့မဟုတ် အက်ပ် repository ထဲသို့ commit မလုပ်ပါနှင့်။

Taira နဲ့ ကောင်းမွန်စွာ အလုပ်လုပ်တဲ့ Agent prompt စည်းမျဉ်းတွေ

- MCP ဆာဗာမှ လုပ်ဆောင်ကိရိယာများကို မခေါ်ယူမီ ရှာဖွေစာရင်းပြုပါ။ ဆာဗာက `listChanged` ဟု အကြောင်းကြားပါက ထပ်မံရှာဖွေစာရင်းပြုပါ။
- `iroha.*` ကိရိယာတွေကို အသားတင် `torii.*` ကိရိယာတွေထက် ပိုနှစ်သက်တယ်။
- ဖတ်ရှုခြင်းသက်သက်ဖြင့် စတင်ပါ။ ဒေတာရေးသားရန် အဆိုမပြုမီ အခြေအနေ၊ အကောင့်များ၊ ပိုင်ဆိုင်မှုများ၊ alias များ၊ ဘလော့ခ်များ၊ အုပ်ချုပ်မှုအခြေအနေနှင့် transaction အခြေအနေတို့ကို စစ်ဆေးပါ။
- Live testnet အပြောင်းအလဲမဖြစ်ခင် လူသားရဲ့ ရှင်းလင်းတဲ့ ညွှန်ကြားချက်တစ်ခု တောင်းဆိုပါ။ ကြိုတင်လက်မှတ်ထိုးထားတဲ့ ငွေကြေးဆိုင်ရာ ဒေတာ ကွန်တိန်နာများအတွက် `iroha.transactions.submit_and_wait` ကို အသုံးပြုပါ၊ ဒီတော့ ကိုယ်စားလှယ်က ရလဒ်ကို တင်ပေးတာအစား စောင့်ကြည့်တယ်။
- Agent တုံ့ပြန်မှုမှာ transaction cryptographic hashes၊ နောက်ဆုံးအခြေအနေနဲ့ server validation error တွေကို စုစည်းပါ။

### ကိုယ်စားလှယ်များနှင့်အတူ ဖွံ့ဖြိုးတိုးတက်ရေး လုပ်ငန်းစဉ် {#development-workflow-with-agents}

Iroha ဖောက်သည်များ၊ ငွေပေးချေမှု တည်ဆောက်သူများ၊ ရောဂါစစ်ဆေးရေး စကရစ်များနှင့် testnet runbooks များအတွက် agent များကို development assistant အဖြစ် အသုံးပြုပါ။ Agent ၏ authorization မူဝါဒကို ကျဉ်းမြောင်းစွာထားပါ: ၎င်းဟာ ကုဒ်ကို စိစစ်နိုင်တယ်၊ Taira အခြေအနေကို ဖတ်နိုင်တယ်၊ အပြောင်းအလဲတွေကို အဆိုပြုနိုင်ပြီး ဒေသတွင်း စမ်းသပ်မှုတွေ လုပ်နိုင်တယ်။ ဒါပေမဲ့ လူသားက တိကျတဲ့ လုပ်ငန်းစဉ်ကို ခွင့်မပြုခင်မှာ သက်ဆိုင်ရာ ကွန်ရက်ကို မပြောင်းလဲသင့်ပါဘူး။

လက်တွေ့ အလုပ်ဖြစ်စဉ်က-

1. SDK ကုဒ်၊ CLI အမိန့်၊ (သို့) MCP ကိရိယာ အစီအစဉ်ကို စာရေးမပေးခင် သက်ဆိုင်ရာ Docs ကို စစ်ဆေးရန် Agent ကိုတောင်းဆိုပါ။
2. အခြေအနေစစ်ဆေးခြင်း၊ အကောင့်ရှာဖွေခြင်း၊ alias ဖြေရှင်းခြင်း သို့မဟုတ် လက်ကျန်ရှာဖွေခြင်းကဲ့သို့ အငယ်ဆုံး client လုပ်ဆောင်လမ်းကြောင်းကို agent အား ဦးစွာရေးခိုင်းပါ။
3. ဖတ်ရှုခြင်းသက်သက် ခေါ်ယူမှုများက Taira နှင့် အလုပ်လုပ်ပြီးမှသာ transaction တည်ဆောက်သည့်ကုဒ်ကို ထည့်ပါ။
4. ပုံမှန်ယူနစ်စမ်းသပ်မှုက testnet ရန်ပုံငွေ မသုံးစွဲစေရန်နှင့် ကွန်ရက်ရရှိနိုင်မှုအပေါ် မမှီခိုစေရန် တိုက်ရိုက်ကွန်ရက် စမ်းသပ်မှုများကို ရွေးချယ်ဖွင့်ထားမှသာ လုပ်ဆောင်စေပါ။ ဥပမာ `TAIRA_LIVE=1` ဖြင့်သာ ဖွင့်နိုင်စေပါ။
5. ငွေပေးချေမှုတစ်ခုခု မတင်မီက ကွန်ရက် root, chain, authorization principal account, instruction summary, fee asset နှင့် expected state change ကို အစီရင်ခံရန် agent ကို တောင်းဆိုပါ။
6. CI (သို့) mainnet အလုပ်ဖြစ်စဉ်များသို့ မတင်မီ လျှို့ဝှက်ကိုင်တွယ်မှု၊ ပြန်လည်စမ်းသပ်မှုအပြုအမူ၊ idempotency နှင့် rejection ကိုင်တွယ်ခြင်းအတွက် ဖန်တီးထားတဲ့ ကုဒ်ကို Review လုပ်ပါ။

ဖွံ့ဖြိုးရေးအတွက် အသုံးဝင်သော ဖတ်ရှုခြင်းသက်သက် MCP လုပ်ဆောင်ကိရိယာများတွင် အကောင့်ပိုင်ဆိုင်မှုရှာဖွေခြင်း၊ alias ဖြေရှင်းခြင်း၊ ဘလော့ခ်ရှာဖွေခြင်း၊ transaction ရှာဖွေခြင်း၊ transaction စာရင်းများနှင့် pipeline အခြေအနေစစ်ဆေးခြင်းတို့ ပါဝင်သည်။ လက်မှတ်ထိုးထားသော payload တစ်ခုခုကို မတင်သွင်းမီ ယုံကြည်စိတ်ချမှုရရှိရန် ဤလုပ်ဆောင်ချက်များကို အသုံးပြုပါ။

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ငွေပေးချေမှု လုပ်ငန်းစဉ်များ Agent များမှတဆင့် {#transaction-workflow-through-agents}

MCP ချိတ်ဆက်စနစ်သည် လက်မှတ်ထိုးထားသော Iroha transaction ကို တင်သွင်းနိုင်သော်လည်း ပုံမှန် transaction လိုအပ်ချက်များကို ပယ်ဖျက်မပေးပါ။ transaction တွင် မှန်ကန်သော authority အကောင့်၊ ခွင့်ပြုချက်များ၊ အခကြေးငွေအတွက် ရန်ပုံငွေ၊ ဘလော့ခ်ချိန်း ID၊ metadata နှင့် လက်မှတ်တို့ လိုအပ်ဆဲဖြစ်သည်။

မူရင်း Iroha transaction များအတွက် transaction envelope ကို SDK သို့မဟုတ် CLI ဖြင့် ဦးစွာတည်ဆောက်၍ လက်မှတ်ထိုးပါ။ ထို့နောက် `body_base64` အဖြစ် ကုဒ်ပြောင်းထားသော စံသတ်မှတ်ပုံစံရှိ လက်မှတ်ထိုးပြီး transaction ဘိုက်များကိုသာ agent အား ပေးပါ။ agent သည် envelope ကို `iroha.transactions.submit_and_wait` ဖြင့် တင်သွင်းနိုင်သည်၊ သို့မဟုတ် `iroha.transactions.submit` ဖြင့် တင်သွင်းပြီး `iroha.transactions.wait` ဖြင့် အခြေအနေကို ထပ်တလဲလဲ စစ်ဆေးနိုင်သည်။

ကိုယ်ပိုင်ကီးများကို agent အားပေးသည့် ညွှန်ကြားစာထဲသို့ ကူးမထည့်ပါနှင့်။ agent က transaction တည်ဆောက်ရန် လိုအပ်ပါက အသုံးပြုသူ၏ runtime ပတ်ဝန်းကျင်၊ keychain၊ ဟာ့ဒ်ဝဲလက်မှတ်ထိုးကိရိယာ သို့မဟုတ် version control မှ ဖယ်ထားသော testnet ပြင်ဆင်သတ်မှတ်ဖိုင်မှ လျှို့ဝှက်ချက်များကို ဖတ်ယူသည့် စက်တွင်းကုဒ်ထံ ညွှန်ပြပါ။ agent သည် ကီးအချက်အလက်များကို Markdown၊ စမ်းသပ်ဒေတာ၊ မှတ်တမ်းများ သို့မဟုတ် commit များထဲသို့ လုံးဝ မရေးသားသင့်ပါ။

transaction ကို မတင်သွင်းမီ agent အား transaction အစီအစဉ်အကျဉ်းတစ်ခု ထုတ်ပေးခိုင်းပါ။

- `network`: Taira testnet root နှင့် chain ID
- `authority`: စာရင်းမှတ်ပုံတင်ပြီး အခွန်ပေးသွင်းတဲ့စာရင်း
- `instructions`: မှတ်ပုံတင်ခြင်း၊ ထုတ်ပေးခြင်း၊ ဖျက်ဆီးခြင်း၊ လွှဲပြောင်းခြင်း၊ မီတာဒေတာများ၊ ခွင့်ပြုချက်များ သို့မဟုတ် စာချုပ်ဆိုင်ရာ နည်းပညာခေါ်ယူမှု အကျဉ်းချုပ်
- `fee asset`: Taira တွင် ငွေကောက်ခံမည့် အရင်းအမြစ်များ
- `preflight reads`: လုပ်ဆောင်ပြီးဖြစ်သော အကောင့်၊ ပိုင်ဆိုင်မှုလက်ကျန်၊ ခွင့်ပြုချက်၊ alias သို့မဟုတ် ဘလော့ခ် စစ်ဆေးမှုများ
- `expected result`: အတည်ပြုပြီးနောက် မြင်ရသင့်သော အခြေအနေ
- `idempotency`: အလားတူတောင်းဆိုချက်ကို ထပ်မံစစ်ဆေးပါက ဘာတွေဖြစ်မလဲ။

စာပို့ပြီးနောက် terminal status ကိုစောင့်ခိုင်းပြီး state change ကို read query ဖြင့် စစ်ဆေးပါ။ အသုံးဝင်ပြီးစီးမှု အစီရင်ခံစာမှာ:

- transaction cryptographic hash
- `Committed`, `Applied`, `Rejected` သို့မဟုတ် `Expired` တို့လို terminal status များ။
- Block (သို့) explorer အသေးစိတ်များရှိပါက
- စစ်ဆေးမှု ဖတ်စာ ရလဒ်များ
- ငြင်းပယ်ခြင်းသတင်းစကားနှင့် ပျက်ကွက်မှုသည် ခွင့်ပြုချက်များ၊ အခွန်များ၊ အတည်ပြုချက်များ, ရပ်ဆိုင်းထားသော အခြေအနေများ သို့မဟုတ် API အဆုံးအဖြတ်မှတ်ရရှိနိုင်မှုကဲ့သို့ ဖြစ်နေသလား

နမူနာစောင့်ရှောက်မှု ချက်ချင်း:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

လက်မှတ်ထိုးထားတဲ့ အချက်အလက် ကွန်တိန်နာကို ကြိုတင်ပြင်ဆင်ထားပါက-

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP ကို အများသုံး testnet ထိန်းချုပ်ရေးမျက်နှာပြင်အဖြစ် သဘောထားပါ။ Taira ကီးများ၊ testnet XOR၊ faucet အကောင့်များနှင့် canary လက်မှတ်ထိုးသူများသည် စွန့်ပစ်အစားထိုးနိုင်သော အရာများဖြစ်ပြီး Minamoto ကီးများနှင့် ထုတ်လုပ်သုံးစွဲရေး ထုတ်ဝေမှုလုပ်ငန်းစဉ်များမှ သီးခြားထားရမည်။

## ယခုစမ်းသပ်နိုင်သော ကစားစရာများ {#toy-examples-you-can-try-now}

ဤဥပမာများသည် အကောင့်သော့များမသုံးဘဲ Taira မှ အချက်အလက်များကို ဖတ်ရှုပါသည်။

Taira က ဖော်ပြထားသော အများပြည်သူ ဒေတာနေရာ အကောင်အထည်ဖော်ရေးလမ်းကြောင်းများကို ဖော်ပြပါ-

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | select(.visibility == "public")
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Dashboard, bot, သို့မဟုတ် deployment စစ်ဆေးရန်အတွက် အသေးစား Node.js အခြေအနေ sonde ကိုတည်ဆောက်ပါ။

```bash
node --input-type=module <<'EOF'
const response = await fetch('https://taira.sora.org/status', {
  headers: { Accept: 'application/json' },
});
if (!response.ok) throw new Error(`Taira HTTP ${response.status}`);
const status = await response.json();
const publicLanes = status.teu_lane_commit
  .filter((lane) => lane.visibility === 'public')
  .map((lane) => `${lane.alias}@${lane.dataspace_alias}:${lane.block_height}`)
  .join(', ');
console.log(`Taira: ${status.blocks} blocks, ${status.queue_size} queued, public lanes ${publicLanes}`);
EOF
```

Taira testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု တောင်းဆိုချက်ဖြစ်သင့်ပြီး Testnet XOR ကို အသုံးပြုပြီး Minamoto သို့ ဘယ်တော့မှ ညွှန်ပြမထားသင့်ပါ။

## 3. Taira client ပြင်ဆင်သတ်မှတ်ချက် ဖန်တီးခြင်း {#_3-create-a-taira-client-config}

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

ထိပ်ဆုံးအဆင့် `chain` သည်တိကျသော Taira ငွေကြေးချိတ်ဆက် ID ဖြစ်သည်။ `[account].profile = "taira"` သတ်မှတ်ချက်သည် Taira I105 ချိတ်ဆက်မှု ခွဲခြားကိန်းကို သီးသန့်ရွေးချယ်သည်။ ချိတ်ဆက်ခြင်း ID သည်အကောင့်ပရိုဖိုင်ကိုရွေးချယ်ခြင်းမဟုတ်ပါ။

စာဖတ်လို့ရတဲ့ စစ်ဆေးချက်တစ်ခု လုပ်ပါ။

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

စာရေးတဲ့ စမ်းသပ်မှု မလုပ်ခင် အများပြည်သူ Taira ရောဂါစစ်ဆေးမှုကို လုပ်ပါ။

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira အကောင့်ကို testnet ဘဏ္ဍာရေးဝန်ဆောင်မှုမှတစ်ဆင့် ငွေကြေးထောက်ပံ့ရန် အခွန်ပေးသွင်းသည့် စာရွက်စာတမ်းများကို မစတင်ခင် ရင်းနှီးမြှုပ်နှံပါ။ တိုက်ရိုက် testnet ဘဏ်ထောက်ပံ့မှု ဝန်ဆောင်မှု စီးဆင်းမှုသည် [Testnet XOR ကို Taira သို့ခေါ်ယူပါ။](#_4-get-testnet-xor-on-taira) တွင်ဖြစ်သည်။

testnet ထောက်ပံ့မှု ဝန်ဆောင်မှု တောင်းဆိုချက်အား လက်ခံပြီး အကောင့်ကို ငွေကြေးထောက်ပံ့ပြီးနောက် Taira canary သည်ရွေးချယ်စရာ စာရေးခြင်း မီးခိုးစမ်းသပ်မှုဖြစ်သည်။

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

canary သည် လက်မှတ်ထိုးထားသော ping ကို တင်သွင်းပြီး အတည်ပြုချက်ကို စောင့်ဆိုင်းကာ `--write-config` ကို ပေးထားလျှင် runtime လက်မှတ်ထိုးသူ၏ ပြင်ဆင်သတ်မှတ်ချက်ကို ရေးသားသည်။ Taira သည် အများသုံး testnet ဖြစ်သဖြင့် faucet ကိုယ်တိုင် အလုပ်လုပ်နေသော်လည်း စောင့်ဆိုင်းစာရင်းပြည့်ကျပ်မှုကြောင့် လက်မှတ်ထိုးထားသော ping မအောင်မြင်နိုင်ပါ။ `taira doctor` က စောင့်ဆိုင်းစာရင်းပြည့်ကျပ်နေကြောင်း ပြောပါက သို့မဟုတ် canary က `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` ကို ပြန်ပေးပါက client ပြင်ဆင်သတ်မှတ်မှု အမှားဟု မယူဆမီ စောင့်ဆိုင်းပြီး ထပ်စမ်းပါ။

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

SORA Nexus အကောင့် ID သည် အကောင့်၏ အများသုံးကီးနှင့် ရည်မှန်းကွန်ရက်၏ ရှေ့ဆက်ကုဒ်မှ ဆင်းသက်လာသော စံသတ်မှတ်ပုံစံ I105 လိပ်စာဖြစ်သည်။ ၎င်းသည် client TOML ထဲရှိ `[account].domain` တန်ဖိုး မဟုတ်ပါ။ တူညီသော အများသုံးကီးကို Taira နှင့် Minamoto တွင် မတူညီသော ID များအဖြစ် ကုဒ်ပြောင်းပြီး ထုတ်လုပ်သုံးစွဲသူများသည် Minamoto အတွက် သီးခြားကီးအတွဲတစ်ခု ထုတ်လုပ်သင့်သည်။

Account ကို Control လုပ်ပေးမယ့် Ed25519 Keypair ကို Generate (သို့) load လုပ်ပါ။

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

အများသုံး သော့ကို Taira အကောင့် ID သို့ ပြောင်းပါ။

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto အများသုံးကီးကို mainnet ရှေ့ဆက်ကုဒ်ဖြင့် ပြောင်းလဲပါ။

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

SORA Nexus API သို့မဟုတ် CLI command က စံသတ်မှတ်ပုံစံ အကောင့် ID တောင်းသည့်နေရာတိုင်းတွင် ရရှိလာသော အကောင့် ID ကို သုံးပါ။ ဥပမာ Taira faucet ၏ `account_id`၊ လက်ကျန် query များ၊ တင်းကျပ်စွာစစ်ဆေးသော အကောင့်အကွက်များ သို့မဟုတ် alias ချိတ်ဆက်မှုများတွင် သုံးပါ။ ကိုက်ညီသော ကိုယ်ပိုင်ကီးကို client ပြင်ဆင်သတ်မှတ်ချက်ထဲတွင် သိမ်းထားပြီး `[account].profile = "taira"` သို့မဟုတ် `[account].profile = "minamoto"` ဖြင့် အလားတူ အများသုံးကွန်ရက်ကို ရွေးပါ။

ID ထုတ်လုပ်ခြင်းတစ်ခုတည်းက ရန်ပုံငွေဖြည့်ထားသော on-chain အကောင့်ကို မဖန်တီးပေးပါ။ Taira တွင် faucet က testnet ပေါ် ရေးသားမှုများအတွက် အကောင့်ကို ဖန်တီး၍ ရန်ပုံငွေဖြည့်ပေးနိုင်သည်။ Minamoto တွင် အတည်ပြုပြီး mainnet အသုံးပြုသူအသစ်ထည့်သွင်းရေး သို့မဟုတ် ဘဏ္ဍာရေးလုပ်ငန်းစဉ်ကို သုံးပါ။

### ကီးသိုလှောင်ခြင်းနှင့် အရန်သိမ်းခြင်း {#key-storage-and-backup}

အကောင့် ID နှင့် အများသုံး သော့ကို မျှဝေနိုင်သည်။ လိုက်ဖက်သော ပုဂ္ဂလိက သော့၊ စကားဝှက်စကားစုများ၊ မျိုးစေ့များနှင့် ပြန်လည်ထူထောင်ရေး ပစ္စည်းများကို လျှို့ဝှက်ထားရန် လိုပါသည်။

SORA Nexus စာရင်းများအတွက် ဤနည်းလမ်းများကို အသုံးပြုပါ-

- ကိုယ်ပိုင်ကီးများကို ကုဒ်ဝှက်ထားသော စကားဝှက်စီမံခန့်ခွဲကိရိယာ၊ ဟာ့ဒ်ဝဲအခြေခံ ကီးသိုလှောင်ခန်း သို့မဟုတ် သီးသန့်လက်မှတ်ထိုးဝန်ဆောင်မှုတွင် သိမ်းပါ။ ကီးများကို source control ထဲသို့ commit မလုပ်ပါနှင့်။ ထုတ်လုပ်သုံးစွဲရေးကီးများကို shell မှတ်တမ်း၊ လုပ်ဆောင်မှုမှတ်တမ်းများ၊ စကားပြောခန်း၊ အကူအညီတောင်းခံမှတ်တမ်းများ သို့မဟုတ် ကုဒ်မဝှက်ထားသော အရန်မိတ္တူများတွင် မထားပါနှင့်။
- ဝဲလ် (သို့) ထုတ်ကုန် cryptographic လက်မှတ်ရေးထိုးသူတိုင်းအတွက် ထူးခြားတဲ့ entropy မြင့်သော စကားဝှက်စကားစုကို အသုံးပြုပါ။ စကားဝှက် စီမံခန့်ခွဲမှု သို့မဟုတ် ခွဲဝေထားတဲ့ ထိန်းသိမ်းမှု လုပ်ငန်းစဉ်တွင် စကားဝှက်များကို သိမ်းဆည်းပါ၊ ကုဒ်သွင်းထားသော ပုဂ္ဂလိက သော့နဲ့အတူတူမဟုတ်ဘဲ ဖိုင်တစ်ခုတည်းသို့မဟုတ် Backup ဘက်ဒယ်မှာပါ။
- Taira နဲ့ Minamoto ခလုတ်တွေကို သီးခြားထားပါ။ Taira ခလုတ်ကို တစ်ကြိမ်သုံး စမ်းသပ်ရေးကွန်ရက် ပစ္စည်းအဖြစ်နဲ့ Minamoto ခလုတ်များကို ထုတ်လုပ်မှု ရင်းနှီးမြှုပ်နှံမှု ခွင့်ပြုချက် မူဝါဒအဖြစ် ဆက်ဆံပါ။
- လျှို့ဝှက်လက်မှတ်ရေးထိုးသူကို ပြန်လည်ထူထောင်ရန်လိုအပ်သည့် ပုဂ္ဂလိက သော့၊ အများသုံး သော့၊ အကောင့် ID၊ အကောင့်ပရိုဖိုင်နှင့် အကောင့်ပြန်လည်ထူထောင်ခြင်း (သို့) ထိန်းသိမ်းမှု မှတ်စုများအား Backup လုပ်ပါ။ ကွန်ရက် အခြေအနေမရှိသော ပုဂ္ဂလိက် သော့ကို ပြန်လည်ထည့်သွင်းရာတွင် အလွယ်တကူ မတရားအသုံးပြုနိုင်သည်။
- ထုတ်လုပ်သုံးစွဲရေး လက်မှတ်ထိုးသူများအတွက် ကုဒ်ဝှက်ထားသော အော့ဖ်လိုင်းအရန်မိတ္တူ အနည်းဆုံးတစ်ခုနှင့် ပထဝီအနေအထားအရ သီးခြားနေရာတွင် ကုဒ်ဝှက်ထားသော အရန်မိတ္တူတစ်ခု ထားပါ။ အရန်မိတ္တူကို အားကိုးမသုံးမီ ဖတ်ရှုခြင်းသက်သက် လုပ်ဆောင်မှုငယ်တစ်ခုဖြင့် ပြန်လည်ရယူနိုင်မှုကို စမ်းသပ်ပါ။
- ကိုယ်ပိုင်ကီး၊ လျှို့ဝှက်စကားစု၊ အရန်သိမ်းဆည်းသည့်မီဒီယာ သို့မဟုတ် လက်မှတ်ထိုးသည့် host ပေါက်ကြားသွားနိုင်ပါက လက်မှတ်ထိုးသူကို လဲလှယ်ပါ သို့မဟုတ် အစားထိုးပါ။

အသေးစိတ်အချက်အလက်များအတွက် [Cryptographic Key ကို သိုလှောင်ခြင်း](/my/guide/security/storing-cryptographic-keys.md) နှင့် [စကားဝှက်လုံခြုံမှု](/my/guide/security/password-security.md) ကိုကြည့်ပါ။

## (၄) Testnet XOR ကို Taira သို့ခေါ်ယူပါ။ {#_4-get-testnet-xor-on-taira}

testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှုကို တိုက်ရိုက်အသုံးပြုပါ။ စီးဆင်းမှုက

1. Cryptographic signer တစ်ခုကို ဖန်တီး (သို့မဟုတ်) ထည့်သွင်းပြီး ၎င်းရဲ့ Single Protocol Standard Taira Account ID ကို တွက်ချက်ပါ။
2. လက်ရှိ Testnet ထောက်ပံ့ရေး ဝန်ဆောင်မှု ပဟေဠိကို ယူလာပါ။
3. `difficulty_bits` သည် `0` ထက် ပိုများလျှင် ပဟေဠိကို ဖြေရှင်းပါ။
4. Testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု တောင်းဆိုချက်ကို တင်ပြပါ။
5. ငွေပေးချေစာရင်း (သို့) ပိုင်ဆိုင်မှု ဘားလန်ကို ပေးသွင်းရန် မတိုင်မီ မြင်နိုင်အောင် စောင့်ကြည့်ပါ။

Taira I105 အကောင့် ID ကို testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှုမှ မျှော်လင့်ထားသော အများသုံး သော့ကို ပြောင်းပါ။

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

ပဟေဠိကို ယူလာပါ။

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှုသည် အများပြည်သူ testnet ဝန်ဆောင်မှုတစ်ခုဖြစ်သည်။ ပဟေဠိ (သို့) တောင်းဆိုချက် API အဆုံးအသတ်မှတ်ချက်က `502` ကိုပြန်ပို့ပါက၊ အချိန်ကုန်ခြင်း သို့မဟုတ် အခြားဂိတ်ဝိတ်အဆင့်အမှားတစ်ခုရှိပါက သော့များ (သို့မဟုတ်) ဖောက်သည်ပုံပြင်ကိုမပြောင်းလဲခင် စောင့်ပြီး ထပ်မံကြိုးစားပါ။

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

`difficulty_bits` သည် `0` ဖြစ်ပါက စာရင်း ID ကိုသာ တင်ပြပါ-

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits` သည် `0` ထက်ပို၍ရှိပါက ပဟေဠိကိုဖြေရှင်းပြီး ancor အမြင့်နှင့် cryptographic nonce တန်ဖိုးကို ထည့်သွင်းပါ:

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
   - UTF-8 အကောင့် ID
   - `anchor_height` ကို big-endian အဖြစ် `u64`
   - `anchor_block_hash_hex` ကို byte အဖြစ် decoded လုပ်ထားတယ်။
   - `challenge_salt_hex` ကို ဘိုက်များအဖြစ် ဖေါ်ထုတ်ထားသည်မှာ
2. `u64` cryptographic nonce values ကို big-endian 8-byte values အဖြစ် encoded လုပ်ကြည့်ပါ။
3. cryptographic nonce value တစ်ခုစီအတွက် scrypt ကို run လုပ်ပါ။
   - Password: 8-byte cryptographic nonce value ကို
   - ဆား: 32 ဘိုက် စိန်ခေါ်မှု
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - ထုတ်ကုန်အလျား: 32 bytes
4. အနိုင်ရသည့် cryptographic nonce တန်ဖိုးသည်အနည်းဆုံး `difficulty_bits` ဦးဆောင်သော သုည bits နှင့်အတူပထမဆုံး cryptographic digest တန်ဖိုးဖြစ်ပါသည်။

testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှု တုံ့ပြန်မှုမှာ ရင်းနှီးမြှုပ်နှံထားသော အရင်းအမြစ်နှင့် ထိပ်တန်းရောင်းဝယ်မှုများအတွက် cryptographic hash ပါဝင်သည်-

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

လက်ရှိမှာ HTTP `202 Accepted` ဖြင့် ပြန်လည်ဖြေကြားထားပြီး ၎င်း၏ `asset_definition_id` သည် testnet ဘဏ္ဍာရေးဝန်ဆောင်မှုမှ ရံပုံငွေပေးချေသည့် လက်ရှိ Taira အခွန်လက်မှတ်ဖြစ်သည်။ ဥပမာ ID ကို ကူးယူခြင်းအစား တုံ့ပြန်မှုကနေ ထုတ်ယူပါ။ testnet ထောက်ပံ့ရေး ဝန်ဆောင်မှုက `tx_hash_hex` နဲ့ `status: "QUEUED"` ပြန်ပို့တဲ့အခါ တောင်းဆိုချက်ကို လက်ခံထားတယ်။

ပြီးရင် ငွေကြေးထောက်ပံ့ထားတဲ့ အရင်းအမြစ်အတွက် စစ်တမ်းကောက်ယူပြီး သင့်ကိုယ်ပိုင် အခွန်ပေးချေမှုလုပ်ငန်းတွေကို မတင်ခင်:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု တောင်းဆိုချက်ကို လက်ခံခဲ့သော်လည်း အကောင့် (သို့) ပိုင်ဆိုင်မှုက မမြင်ရသေးပါက ငွေပေးချေမှုသည် အများပြည်သူ testnet queue processing နောက်ကွယ်တွင် ရှိနေဆဲဖြစ်သည်။ စာသားပို့ခြင်းမတိုင်မီ ဖတ်ရှုမှုကို စောင့်ကြည့်ပြီး ထပ်မံကြိုးစားပါ။

API စစ်ဆေးရန် အသင့်ရှိသည့် တိုက်ရိုက်စစ်ဆေးမှုအတွက် ဤစာရင်းကို `taira_faucet_claim.py` အဖြစ် သိမ်းထားပြီး Taira I105 အကောင့် ID ကို ပေးသွင်းပါ။

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

testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှုသည် Taira testnet ရင်းနှီးမြှုပ်နှံမှုများအတွက်သာဖြစ်သည်။ testnet XOR၊ testnet ဘဏ္ဍာရေးဝန်ဆောင်မှု အကောင့်များ (သို့မဟုတ်) Taira ကန်နာရီ crypto signers များကို Minamoto စီးဆင်းမှုတွင် မသုံးပါ။

## 5. Minamoto client ပြင်ဆင်သတ်မှတ်ချက် ဖန်တီးခြင်း {#_5-create-a-minamoto-client-config}

Minamoto ကို အသုံးမပြုမီ ပင်မကွန်ရက်ဝန်ဆောင်မှု၏ လိပ်စာကို ကွန်ရက်စီမံသူထံမှ အတည်ပြုပြီး TLS လက်မှတ်သည် ဆာဗာ၏ အမည်နှင့် ကိုက်ညီကြောင်း စစ်ဆေးပါ။

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

အထက်တန်းအဆင့် `chain` သည် လက်ရှိ SORA Nexus mainnet ကွင်းဆက် ID ဖြစ်သည်။ `[account].profile = "minamoto"` သည် Minamoto I105 ကွင်းဆက် ခွဲခြားကိန်းကိုရွေးချယ်သည်။ API အဆုံးအသတ်မှတ် Hostname နှင့် Chain ID တို့သည် အလိုလိုမရွေးချယ်ပါ။

Minamoto အများသုံးသော့ကို ၎င်း၏ တစ်ခုတည်းသော ပရိုတိုကုတ်စံညွှန်း I105 အကောင့် ID သို့ mainnet ကြိုတင်စာရင်းဖြင့် ပြောင်းပါ။

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

mainnet အသုံးပြုသူအသစ်ထည့်သွင်းရေး သို့မဟုတ် အုပ်ချုပ်မှုလုပ်ငန်းစဉ်မှတစ်ဆင့် အကောင့်ကို ပြင်ဆင်ဖန်တီး၍ ရန်ပုံငွေဖြည့်ပြီးသည်အထိ ဖတ်ရှုဘက် စစ်ဆေးမှုများကိုသာ လုပ်ဆောင်ပါ။

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှုကို Minamoto နှင့်မဆိုင်ဘဲ မသုံးပါ။

## (၆) ရန်ပုံငွေ Minamoto ငွေစာရင်း XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto အခကြေးကိုထုတ်လုပ်မှု XOR ဖြင့်ပေးဆပ်ခြင်းဖြစ်ပြီး Minamoto တွင် testnet ဘဏ္ဍာရေးဝန်ဆောင်မှုမရှိပါ။ ခွင့်ပြုထားသော mainnet onboarding သို့မဟုတ် treasury transfer များမှတစ်ဆင့် ဖွဲ့စည်းထားသည့်စာရင်းကို ရင်းနှီးမြှုပ်နှံခြင်း၊ (သို့) တည်ရှိပြီးသား ဘဏ္ဍာငွေဖြင့် ရင်းနှီးမြုပ်နှံထားသော Minamoto အကောင့်မှ XOR ကိုရရှိခြင်း။

စာရင်းတင်မပေးမီ ဖတ်နိုင်သည့် စစ်ဆေးချက်များဖြင့် တစ်ကိုယ်ရေ ပရိုတိုကုတ်စံညွှန်းစာရင်း ID နှင့် ငွေကြေးကို စစ်ဆေးပါ။ Minamoto XOR ကို ထုတ်လုပ်မှုငွေအဖြစ်ဆက်ဆံပါ: Taira တွင်ပထမဦးဆုံး လုပ်ဆောင်ချက်တစ်ခုတည်းကိုလေ့ကျင့်ပါ၊ သီးခြားထုတ်လုပ်ရေး သော့တွေကို ထိန်းထားပြီး အဓိကကွန်ရက်ရောင်းဝယ်မှုကို ပြန်လည်စတင်နိုင်တယ်လို့ မထင်ပါနဲ့။

Taira XOR သည် Minamoto အခွန်များကို မပေးနိုင်ပါ။ Testnet ကွင်းဆင်းငွေနှင့် testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှု တောင်းဆိုချက်များသည် Minamoto သို့ လွှဲပြောင်းခြင်းမရှိပေ။

## (၇) တည်ရှိသော ဒေတာနေရာအတွင်းတွင် အလုပ်လုပ်ပါ။ {#_7-work-inside-an-existing-dataspace}

ဒေတာဇုန်တစ်ခုအတွင်းရှိ blockchain ledger အရာဝတ္ထုများအတွက်အပြည့်အစုံအရည်အချင်းရှိသောဒိုမင်နာမည်များကိုအသုံးပြုပါ။ ဥပမာ, အများပြည်သူဒေတာဇုန်ထဲက ပရောဂျက်ဒိုမိုင်းတစ်ခုမှာသုံးသင့်သည်:

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

Minamoto အတွက် သီးခြား အဓိကကွန်ရက်ရည်ရွယ်ချက်နှင့် အစီအစဉ်ကိုထုတ်လုပ်ပြီး ခွင့်ပြုပါ။ အစီအစဉ်များသည် ၎င်းတို့၏ချိတ်ဆက်မှု၊ ခွင့်ပြုမှု မူဝါဒ၊ လက်ရှိအခြေအနေ ချုံ့ချက်နှင့် နောက်ဆုံးအချိန်နှင့် ကန့်သတ်ထားသည်ဖြစ်၍ Taira အစီအစဉ်ကို တိုးမြှင့်ခြင်း (သို့) ပြန်လည်ကစားခြင်းမရှိပါ။

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

Strict account fields များတွင် single protocol-standard I105 account ID များကို အသုံးပြုလျက်ရှိသည်။ aliases များကို လူသားများ ဖတ်ရှုနိုင်သော bindings များအဖြစ် ကုသ၍ single protocol-standar account ID များသို့ ဖြေရှင်းပေးပါ။

## (၈) ဒေတာနေရာသစ်ပေးခြင်း {#_8-provision-a-new-dataspace}

ဒေတာဇုန်သစ်သည် လုပ်ငန်းရှင်နှင့် အုပ်ချုပ်မှုပြောင်းလဲခြင်းဖြစ်သည်။ အများပြည်သူ Torii API အဆုံးမှတ်သည် သတ်မှတ်ထားသောဒေတာဇုန်များသို့ ယာဉ်သွားလာမှုကို ညွှန်ကြားနိုင်သော်လည်း မသိသောဒေတာ ဇုန်အမည်များကို ပယ်ချလိမ့်မည်။

အပြောင်းအလဲ မလုပ်ခင် လက်ရှိ Live Catalogue ကို ရိုက်ယူပါ

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

အော်ပရေတာအကောင့်အတွက်လည်း အကောင်အထည်ဖော်ရေးလမ်းကြောင်းရဲ့ နည်းပညာ manifest posture ကို စစ်ဆေးပါ။

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

lane ID၊ data space ID၊ validator အစု၊ ချို့ယွင်းမှုခံနိုင်ရည်၊ manifest၊ လမ်းကြောင်းသတ်မှတ်စည်းမျဉ်းများနှင့် လုပ်ငန်းလည်ပတ်မှုတာဝန်ခံကို အတူတကွ ပြန်လည်သုံးသပ်ပြီးမှသာ alias အသစ်ကို အသုံးပြုရန် မြှင့်တင်ပါ။ လိုအပ်သော ခွင့်ပြုချက်များရှိသည့် ပုံမှန်အသုံးပြုသူအကောင့်သည် ရှိပြီးသား data space အတွင်းရှိ domain နှင့် ၎င်း၏ SNS ငှားရမ်းအသုံးပြုခွင့်ကို alias စီစဉ်ကိရိယာမှတစ်ဆင့် ရယူနိုင်သည်။ သို့သော် အများသုံး data space အသစ်ကို ဘေးကင်းစွာ ထပ်ထည့်နိုင်ခြင်း မရှိပါ။

ပုဂ္ဂလိက (သို့) အဖွဲ့အစည်းဆိုင်ရာ ဒေတာဇုန်အတွက်၊ အောက်ပါအတိုင်း စာရင်းအပြောင်းအလဲတစ်ခု ပြင်ဆင်ပါ။

- တစ်ခုတည်းသော ဒေတာနေရာအမည်နှင့် နံပါတ်များ `id`
- သက်ဆိုင်တဲ့ အကောင်အထည်ဖော်ရေးလမ်းကြောင်းဝင်မှု (သို့) လက်ရှိ အကောင်အ ထည်ဖော်ရေး လမ်းကြောင်းတာဝန်တစ်ခု
- ဒေတာနေရာ `fault_tolerance`
- လမ်းညွှန်ချက်များ (သို့) အဲဒီမှာ ဆင်းသက်သင့်တဲ့ အကောင့်အကွာအဝေးများအတွက် လမ်းကြောင်းစည်းမျဉ်းများ
- data space က UAID လုပ်ဆောင်နိုင်စွမ်းများကို ဖွင့်ပေးထားပါက data space လမ်းညွှန် manifest သို့မဟုတ် အလားတူ ဖြန့်ချိမှုအထောက်အထား
- Validator၊ Compliance, Financial Transaction Settlement နှင့် Monitoring Policy များအတွက် အုပ်ချုပ်မှု ခွင့်ပြုချက်

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

- ဖြေရှင်းတွက်ချက်ပြီးဖြစ်သော နိုဒ်ပြင်ဆင်သတ်မှတ်ချက်အပေါ် `iroha3d --sora --config <config.toml> --trace-config` အောင်မြင်သည်
- ဖန်တီးထားသော (သို့) ပြန်လည်သုံးသပ်ထားသော Technical Manifesto ကို cryptographic hashes နှင့် လက်မှတ်များဖြင့် archived ပြုလုပ်ရမည်။
- မီးခိုးစမ်းသပ်မှု Taira ကို Minamoto တိုးမြှင့်ခြင်းတစ်ခုခုမတိုင်မီ ဖြတ်သန်းပါ။
- `/status` ပြင်ဆင်ပြီးနောက် စာရင်းမှာ စီစဉ်ထားတဲ့ အကောင်အထည်ဖော်ရေးလမ်းကြောင်းနဲ့ ဒေတာနေရာကို ပြသထားပါတယ်။
- `iroha app nexus lane-report --summary` သည် လိုအပ်သော နည်းပညာထုတ်ပြန်ချက်များ ပျောက်ဆုံးနေကြောင်း မပြောဆိုပါ။

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Taira ဖြန့်ချိခြင်း၊ မီးခိုးစမ်းသပ်မှု၊ စောင့်ကြည့်ခြင်းနှင့် အုပ်ချုပ်မှုသက်သေများ ပြီးဆုံးပြီးမှသာ Minamoto သို့တူညီသော ဒေတာနေရာကို တိုးတက်စေရန်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [တပ်ဆင်ရန် Iroha 3](/my/get-started/install-iroha.md)
- [Iroha 3 ကို CLI မှတစ်ဆင့် လည်ပတ်ပါ။](/my/get-started/operate-iroha-via-cli.md)
- [ပုဂ္ဂလိက ဒေတာနေရာအတွက် ထောက်ပံ့မှု အခွန်များ](/my/get-started/private-dataspace-fee-sponsor.md)
- [Torii API အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
- [blockchain Genesis ကို ရည်ညွှန်းချက်](/my/reference/genesis.md)
