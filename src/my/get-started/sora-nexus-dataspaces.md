---
translation_locale: my
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 3d2285e5a27819897b6dcc6d165c468baead29d2922420728fcfbe2433d36fdd
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# SORA Nexus ပေါ်တွင် တည်ဆောက်ခြင်း: Taira နှင့် Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus သည် Iroha 3 ပေါ်တွင် တည်ဆောက်ထားသော အများသုံး ဖြန့်ချိတပ်ဆင်ရေး လမ်းကြောင်းများကို ပေးသည်။ Taira ပေါ်တွင် ဦးစွာတည်ဆောက်၍ အစမ်းလေ့ကျင့်ပြီး သီးခြား mainnet ကီးများ၊ အခကြေးငွေအတွက် အမှန်တကယ် XOR နှင့် ထုတ်လုပ်ရေးခွင့်ပြုချက် ရှိမှသာ တူညီသော client ပုံစံကို Minamoto သို့ ပြောင်းပါ။

ဤသင်ခန်းစာသည် အများသုံး SORA Nexus ကွန်ရက်များအတွက် Iroha client ကို ပြင်ဆင်သတ်မှတ်ပုံ ပြသည်:

- Taira testnet ကို `https://taira.sora.org` တွင်
- Minamoto အဓိကရထား `https://minamoto.sora.org`

Taira ကို ပေါင်းစပ်မှု စမ်းသပ်ချက်များ၊ testnet မှ ရင်းနှီးမြှုပ်နှံထားသော စာရေးနည်းပြများနှင့် ဖြန့်ချိမှု လေ့ကျင့်ခန်းများအတွက် အသုံးပြုပါ။ Minamoto ကို ထုတ်လုပ်ရန် အသင့်ရှိသည့် အဓိကကွန်ရက် လှုပ်ရှားမှုအတွက်သာ အသုံးပြုပါ။ ကွန်ရက်နှစ်ခုစလုံးသည် XOR တွင် အခွန်ကောက်ခံသည်။

- Taira သည် testnet XOR ကို အများပြည်သူ testnet ဘဏ္ဍာရေးဝန်ဆောင်မှုမှ အသုံးပြုသည်။
- Minamoto သည် အမှန်တကယ် XOR ကို သုံးသည်။ Minamoto အတွက် faucet မရှိပါ။

## ဆောက်လုပ်ရေး လမ်းကြောင်း {#builder-path}

|အဆင့် |Taira Testnet |Minamoto Mainnet |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| ကွန်ရက်အခြေအနေကို စတင်ဖတ်ရှုခြင်း | ကီးများမလိုဘဲ `/status` ကို query လုပ်ပါ | ကီးများမလိုဘဲ `/status` ကို query လုပ်ပါ |
| Data space ရွေးချယ်ခြင်း | သင့်အက်ပ်က အုပ်ချုပ်မှုအောက်ရှိ lane ကို မလိုအပ်ပါက အများသုံး `universal` ကို သုံးပါ | Mainnet ခွင့်ပြုချက်ရပြီးမှသာ တူညီသော data space ကို သုံးပါ |
|အခွန်အရင်းအမြစ်ရယူပါ။|အများပြည်သူ Taira testnet ထောက်ပံ့မှု ဝန်ဆောင်မှုကို အသုံးပြုပါ။ |ငွေကြေးထောက်ပံ့ထားတဲ့ Minamoto အကောင့်မှ (သို့) ခွင့်ပြုထားသော ဘဏ္ဍာငွေစီးဆင်းမှုမှ XOR ကိုရယူခြင်း |
|Test က ရေးထားတယ်|testnet မှ ရင်းနှီးမြှုပ်နှံသည့် စမ်းသပ်မှု XOR ကို အသုံးပြုပါ။ |စမ်းသပ်မှု tooling ကိုမသုံးပါနဲ့; စာရင်းအင်းစရိတ်စစ်မှန် XOR |
| နောက်အဆင့်သို့ ပြောင်းသုံးခြင်း | ပြန်ကြိုးပမ်းမှု logic၊ စောင့်ကြည့်မှုနှင့် လက်မှတ်ထိုးသူ ကိုင်တွယ်မှုကို ထိန်းသိမ်းပါ | သီးခြားကီးများ၊ ငွေဖြည့်မှုနှင့် ထုတ်ဝေမှုထိန်းချုပ်ချက်များကို သုံးပါ |

လက်တွေ့ စီးဆင်းမှုဟာ-

1. Client ကို Taira နှင့် ချိတ်ဆက်တည်ဆောက်ပြီး အများသုံး `universal` data space ကို သုံးပါ။
2. လက်မှတ်ထိုးသူတစ်ဦး ထည့်ပြီး Taira faucet ဖြင့် ငွေဖြည့်ပါ။
3. Taira ကို ဆန့်ကျင်ပြီး သင့်ရဲ့ app logic ကို လေ့ကျင့်ပါ၊ ပျက်ကွက်မှုတွေဟာ ငြီးငွေ့စရာဖြစ်ပြီး လေ့လာလို့ရတဲ့ အထိပါ။
4. သီးခြား Minamoto လက်မှတ်ထိုးသူတစ်ဦးကို ဖန်တီးပြီး အမှန်တကယ်တန်ဖိုးရှိသော XOR ဖြည့်ပေးပါ။ စမ်းသပ်အတည်ပြုပြီးဖြစ်သည့် တူညီသောလုပ်ဆောင်မှုများကိုသာ mainnet သို့ ပြောင်းရွှေ့ပါ။

## Cookbook ကို ဆက်သုံးပါ {#continue-with-the-cookbook}

ကွန်ရက်ရွေးချယ်ခြင်း၊ လက်မှတ်ထိုးသူ ပြင်ဆင်သတ်မှတ်ခြင်းနှင့် အခကြေးငွေအတွက် ငွေဖြည့်ခြင်းတို့အတွက် ဤလမ်းညွှန်ကို သုံးပါ။ ထို့နောက် သင်တည်ဆောက်လိုသော အက်ပ်အပြုအမူနှင့် ကိုက်ညီသည့် နည်းလမ်းကို ဆက်လက်လုပ်ဆောင်ပါ။

|ရည်မှန်းချက်|ချက်ပြုတ်ချက်|
| --- | --- |
|Taira ကို စစ်ဆေးပြီး ဖောက်သည်ကို ညွှန်ပြပါ။ |[Taira သို့ ချိတ်ဆက်ပါ။](/my/cookbook/connect-to-taira.md) |
| ပထမ ရေးသားမှုကို ပို့ပြီး ရလဒ်ကို စစ်ဆေးခြင်း | [Transaction များ တင်သွင်း၍ စစ်ဆေးခြင်း](/my/cookbook/submit-and-verify-transactions.md) |
|မှတ်ပုံတင်၊ ထုတ်လွှင့်၊ ရွှေ့တန်ဖိုး |[ဖောင်ဂျီတယ် အရင်းအမြစ်များ](/my/cookbook/fungible-assets.md) |
|Filtered application status ကို ဖတ်ပါ။|[မေးမြန်းချက် blockchain ledger ပြည်နယ်](/my/cookbook/query-ledger-state.md) |
|အပြီးသတ်ပြောင်းလဲမှုများကို တုံ့ပြန်ခြင်း |[အဖြစ်အပျက်များကို Stream](/my/cookbook/stream-events.md) |

ချက်ပြုတ်စာအုပ်က အလုပ်ဖြစ်စဉ်တိုင်းကို အာရုံစိုက်ထားပြီး Taira ထောက်ပံ့မှု (သို့) SORA Nexus ကွန်ရက် အခြေအနေလိုအပ်တဲ့အခါ ဒီနေရာကို ပြန်လည် link လုပ်တယ်။

## (၁) သင်ဘာကို သတ်မှတ်နေမှန်း နားလည်ပါ {#_1-understand-what-you-are-setting-up}

SORA Nexus တွင် data space ကတ်တလောက်က data space များကို သတ်မှတ်သည်။ Lane ကတ်တလောက်က lane များကို သီးခြားသတ်မှတ်သည်။ Lane တစ်ခုစီက data space တစ်ခုကို ရည်ညွှန်းပြီး data space တစ်ခုတွင် lane အများအပြား ရှိနိုင်သည်။ Client သည် `client.toml` ကို ပြောင်းရုံဖြင့် အများသုံး data space အသစ်ကို မဖန်တီးနိုင်ပါ။ Client ပြင်ဆင်တည်ဆောက်မှုသည် အရာနှစ်ခုကို လုပ်သည်:

1. client ကို မှန်ကန်သော Torii ၏ endpoint သို့ ညွှန်ပြသည်
2. ၎င်း၏ စံအကောင့်အတွက် ကွန်ရက် context နှင့် လက်မှတ်ထိုးကီးကို ရွေးချယ်သည်

`AccountId` သည် အမြဲ စံပုံစံဖြစ်ပြီး domain မပါဝင်ပါ။ `client.toml` တွင် domain သတ်မှတ်ချက် မရှိပါ။ `[account].profile` သည် ကွန်ရက်၏ I105 ရှေ့ဆက်ကိုသာ ရွေးချယ်သည်။ Domain ဆိုင်ရာ အကြောင်းအရာသည် alias များနှင့် domain ပိုင် object များတွင် ရှိသည်။ အက်ပ်အများစုအတွက် အများသုံး `universal` data space မှ စတင်ပါ။ Domain ဆိုင်ရာ အကြောင်းအရာသည် `domain.dataspace` ပုံစံကို သုံးသည်၊ ဥပမာ:

```text
wonderland.universal
```

အဖွဲ့အစည်းဆိုင်ရာ data space အသစ် လိုအပ်ပါက ပုံမှန် client အကောင့်မှ မှတ်ပုံတင်ရန် ကြိုးစားမည့်အစား ကတ်တလောက်နှင့် လမ်းကြောင်းရွေးချယ်မှု အဆိုပြုချက်ကို ပြင်ဆင်ပါ။ အောက်ပါ [Data space အသစ် ဖန်တီးပြင်ဆင်ခြင်း](#_8-provision-a-new-data-space) ကို ကြည့်ပါ။

## 2. အများသုံး Torii ၏ Endpoint ကို စစ်ဆေးခြင်း {#_2-check-the-public-torii-endpoint}

လက်မှတ်ထိုးသူကို မပြင်ဆင်သတ်မှတ်မီ ပစ်မှတ် endpoint အသက်ဝင်နေကြောင်း စစ်ဆေးပါ။

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

နိုဒ်က ဖော်ပြသော data space နှင့် lane မြင်ကွင်းကို စစ်ဆေးပါ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

`https://minamoto.sora.org/status` နဲ့ အတူတူ command ကို mainnet အတွက် သုံးပါ။

## Taira MCP Agents များအတွက် {#taira-mcp-for-agents}

Taira သည် agent software အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်များအတွက် Torii-native Model Context Protocol (MCP) တံတားကိုလည်းဖေါ်ပြထားသည်။ ပထမဆုံး custom Torii client ကိုမတည်ဆောက်ဘဲ live testnet readings, scripted diagnostics သို့မဟုတ် ကျယ်ကျယ်ပြန့်စွာစစ်ဆေးသော write rehearsals များလိုအပ်သည့်အခါအသုံးပြုပါ။

|Settings ကို|တန်ဖိုး |
| --- | --- |
| MCP endpoint | `https://taira.sora.org/v1/mcp` |
|ကွန်ရက် root ကို|`https://taira.sora.org` |
|ရည်ရွယ်ချက်များ |Taira testnet စာဖတ်ခြင်းနဲ့ testnet မှ ရင်းနှီးမြှပ်နှံတဲ့ စာရေးမှု လေ့ကျင့်ခန်းများ |
| ထုတ်လုပ်ရေးသုံး ညီမျှမှု | Mainnet MCP endpoint နှင့် ထုတ်ဝေမှုထိန်းချုပ်ချက်များကို တိတိကျကျ ခွင့်မပြုထားပါက ဤစာရင်းကို Minamoto သို့ မညွှန်ပါနှင့် |

တံတားသည် အခြေအနေမထိန်းသိမ်းသော JSON-RPC `POST` တောင်းဆိုမှုများကိုသာ လက်ခံသည်။ လက်မှတ်ထိုးပစ္စည်းများ မထည့်မီ ၎င်း၏ ရှာဖွေတွေ့ရှိမှု metadata ကို စစ်ဆေးပါ:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
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
6. CI သို့မဟုတ် mainnet လုပ်ငန်းစဉ်များတွင် အသုံးမပြုမီ ထုတ်လုပ်ထားသော ကုဒ်၏ လျှို့ဝှက်ချက်ကိုင်တွယ်ပုံ၊ ပြန်ကြိုးပမ်းပုံ၊ ထပ်မံလုပ်ဆောင်လည်း ရလဒ်မပြောင်းသည့် သဘောနှင့် ငြင်းပယ်မှုကိုင်တွယ်ပုံတို့ကို ပြန်လည်သုံးသပ်ပါ။

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
- ငြင်းပယ်မက်ဆေ့ချ်နှင့် မအောင်မြင်မှုသည် ခွင့်ပြုချက်၊ အခကြေးငွေ၊ စစ်ဆေးမှု၊ ဟောင်းနေသော အခြေအနေ သို့မဟုတ် endpoint ရရှိနိုင်မှု ပြဿနာဖြစ်ပုံ ရှိမရှိ

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

Taira က ဖော်ပြသော အများသုံး data space lane များကို စာရင်းပြုပါ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Mainnet အခြေအနေကို ကြည့်ရန် လိုအပ်သောအခါ တူညီသော command ကို Minamoto အတွက် လုပ်ဆောင်ပါ။

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ကြည့်ရှုမျက်နှာပြင်၊ bot သို့မဟုတ် ဖြန့်ချိမှုစစ်ဆေးခြင်းအတွက် Node.js အခြေပြု အခြေအနေစမ်းသပ်ကိရိယာငယ်တစ်ခု တည်ဆောက်ပါ။

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

Taira testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု တောင်းဆိုချက်ဖြစ်သင့်ပြီး Testnet XOR ကို အသုံးပြုပြီး Minamoto သို့ ဘယ်တော့မှ ညွှန်ပြမထားသင့်ပါ။

## 3. Taira client ပြင်ဆင်သတ်မှတ်ချက် ဖန်တီးခြင်း {#_3-create-a-taira-client-config}

လက်ရှိမှာ မရှိဘူးဆိုရင် Keypair ကို Generate လုပ်ပါ။

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

`taira.client.toml` ကို ဖန်တီးပါ

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ထိပ်ဆုံးအဆင့် `chain` သည် Taira transaction ချိန်း ID အတိအကျဖြစ်ပြီး `network_id` သည် လက်မှတ်တိုင်းနှင့် ချည်နှောင်သည့် ကွန်ရက် identity အတိအကျဖြစ်သည်။ `network_id` သို့မဟုတ် `network_id_file` နှစ်ခုအနက် တစ်ခုအတိအကျကို သတ်မှတ်ပါ။ `[account].profile = "taira"` သတ်မှတ်ချက်သည် Taira I105 ချိန်းခွဲခြားတန်ဖိုးကို သီးခြားရွေးချယ်သည်။ ချိန်း ID သည် အကောင့် profile ကို မရွေးချယ်ပါ။

စာဖတ်လို့ရတဲ့ စစ်ဆေးချက်တစ်ခု လုပ်ပါ။

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

စာရေးတဲ့ စမ်းသပ်မှု မလုပ်ခင် အများပြည်သူ Taira ရောဂါစစ်ဆေးမှုကို လုပ်ပါ။

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

အခကြေးငွေပေးရသော ရေးသားမှုများ မလုပ်ဆောင်မီ Taira အကောင့်ကို faucet မှတစ်ဆင့် ငွေဖြည့်ပါ။ ကြိုတင်ပြင်ဆင်သည့် faucet လုပ်ငန်းစဉ်ကို [Taira တွင် Testnet XOR ရယူခြင်း](#_4-get-testnet-xor-on-taira) တွင် ကြည့်ပါ။

အကောင့်ကို ငွေဖြည့်ပြီးနောက် လက်မှတ်ထိုးထားသော log ညွှန်ကြားချက်ကို မဖြစ်မနေမဟုတ်သည့် ရေးသားမှုအခြေခံစမ်းသပ်ချက်အဖြစ် သုံးနိုင်သည်။ တင်သွင်းသော transaction တိုင်းက အခကြေးငွေပေးသူကို အမည်ပေးပြီး CLI သည် လက်မှတ်မထိုးမီ အခကြေးငွေအတိအကျကို တွက်ချက်ဖော်ပြသည်:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

Command သည် အတည်ပြုချက်ကို စောင့်သည်။ Taira သည် အများသုံး testnet ဖြစ်သောကြောင့် faucet ကိုယ်တိုင် အလုပ်လုပ်သော်လည်း တန်းစီစာရင်းပြည့်နေမှုက ping မအောင်မြင်စေနိုင်သည်။ `taira doctor` က တန်းစီစာရင်းပြည့်နေကြောင်း ပြပါက သို့မဟုတ် ping က `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` ပြန်ပေးပါက client ပြင်ဆင်သတ်မှတ်မှု အမှားဟု မယူဆမီ စောင့်ပြီး ပြန်ကြိုးစားပါ။

လူမကြီးကြပ်သော အခြေခံစမ်းသပ်မှုများအတွက် ping ကို အကြိမ်ရေကန့်သတ်ထားသော ပြန်ကြိုးစားမှု loop ထဲ ထည့်ပါ:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

`iroha taira doctor` သည် ပြင်းထန်သော ကျရှုံးမှုများကိုပြသပါက ထပ်မံစမ်းသပ်ခြင်းကိုရပ်ဆိုင်းပါ။ အတန်းအပြည့်အဝခြင်းနှင့် အခွန်လက်ခံမှု ငြင်းပယ်မှုများသည် အများပြည်သူစစ်ဆေးရေးကွန်ရက်၏ ယာယီအခြေအနေဖြစ်သည်; DNS, TLS သို့မဟုတ် `status = "fail"` ရောဂါရှာဖွေမှုများသည်မဟုတ်ပါ။

## SORA Nexus Account ID ကို ဖန်တီးပါ။ {#generate-a-sora-nexus-account-id}

SORA Nexus အကောင့် ID သည် အကောင့်အများသုံးကီးနှင့် ပစ်မှတ်ကွန်ရက်ရှေ့ဆက်မှ ဆင်းသက်ရယူထားသော စံ I105 လိပ်စာဖြစ်သည်။ တူညီသော အများသုံးကီးကို Taira နှင့် Minamoto တွင် မတူသော ID များအဖြစ် ကုဒ်သွင်းပြီး ထုတ်လုပ်ရေးအသုံးပြုသူများသည် Minamoto အတွက် သီးခြားကီးအတွဲ ထုတ်လုပ်သင့်သည်။

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

SORA Nexus ၏ API သို့မဟုတ် CLI command က စံအကောင့် ID တောင်းသည့်နေရာတိုင်းတွင် ရလာသော အကောင့် ID ကို သုံးပါ၊ ဥပမာ လက်ကျန် query များ၊ တင်းကျပ်သော အကောင့် field များ သို့မဟုတ် alias ချိတ်ဆက်မှုများဖြစ်သည်။ ကိုက်ညီသော ကိုယ်ပိုင်ကီးကို client ပြင်ဆင်သတ်မှတ်မှုထဲ ထိန်းသိမ်းပြီး `[account].profile = "taira"` သို့မဟုတ် `[account].profile = "minamoto"` ဖြင့် တူညီသော အများသုံးကွန်ရက်ကို ရွေးချယ်ပါ။

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

CLI ၏ ကြိုတင်ပြင်ဆင်သည့် faucet လုပ်ငန်းစဉ်ဖြင့် testnet XOR ကို တောင်းခံပါ။ Faucet သည် `taira.client.toml` တွင် သတ်မှတ်ထားသော အကောင့်ကို ငွေဖြည့်ပြီး အကောင့်မရှိသေးပါက ဦးစွာမှတ်ပုံတင်သည်။ လုပ်ငန်းစဉ်မှာ:

1. အများသုံး faucet မူဝါဒကို ဖတ်ပါ။ Faucet authority၊ အခကြေးငွေသုံး ပိုင်ဆိုင်မှုနှင့် ပမာဏတို့ ပါဝင်သည်။
2. တောင်းခံမှုကို ပြင်ဆင်ပါ။ CLI သည် အလုပ်လုပ်ပြီးကြောင်း သက်သေကို ဖြေရှင်းပြီး Torii က ပြင်ဆင်လက်မှတ်ထိုးသော transaction အတိအကျကို စစ်ဆေးကာ မတင်သွင်းဘဲ သီးသန့် journal သိမ်းဆည်းရာ directory ထဲ သိမ်းဆည်းသည်။
3. သိမ်းဆည်းထားသော transaction ကို တစ်ကြိမ်သာ တင်သွင်းပါ။
4. အခကြေးငွေပေးရသော ရေးသားမှုများ မပို့မီ ပိုင်ဆိုင်မှုလက်ကျန်ကို မြင်ရသည်အထိ စောင့်ပါ။

မူဝါဒကို ဖတ်ပါ:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

ဒီတုံ့ပြန်မှုက ဒီလိုပုံစံရှိပါတယ်။

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

မူဝါဒသည် လက်မှတ်မထိုးထားသော ရှာဖွေတွေ့ရှိမှုဒေတာဖြစ်သည်။ အလိုအလျောက်စနစ်သည် တုံ့ပြန်ချက်တိုင်းကို ယုံကြည်မည့်အစား မျှော်မှန်းထားသော authority၊ ပိုင်ဆိုင်မှုသတ်မှတ်ချက်နှင့် ပမာဏကို သတ်မှတ်ချည်နှောင်ထားသင့်သည်။ `prepare` သည် သင်ပေးထားသော တန်ဖိုးများနှင့် မတူသည့် ပြင်ဆင်ပြီး transaction ကို ငြင်းပယ်သည်။

တောင်းခံမှုကို ပြင်ဆင်၍ တင်သွင်းပါ:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` သည် journal သိမ်းဆည်းရာ directory ကို သီးသန့်ဖန်တီးပြီး ရှိပြီးသားကို အစားထိုးရန် ငြင်းပယ်သောကြောင့် တောင်းခံမှုတစ်ခုစီအတွက် directory အသစ်ကို သုံးပါ။ Faucet သည် အများသုံး testnet ဝန်ဆောင်မှုဖြစ်သည်။ `submit` က `Pending` ဟု ဖော်ပြပါက၊ အချိန်ကုန်သွားပါက သို့မဟုတ် `502` လက်ခံရပါက နောက်တောင်းခံမှု ပြင်ဆင်မည့်အစား တူညီသော ပြင်ဆင်သတ်မှတ်မှုနှင့် journal ဖြင့် `taira account faucet resume` ကို လုပ်ဆောင်ပါ။ အလုပ်လုပ်ပြီးကြောင်း သက်သေ၏ anchor ဟောင်းနေပါက `prepare` မအောင်မြင်ပါ။ Journal သိမ်းဆည်းရာ directory အသစ်တွင် ထပ်မံပြင်ဆင်ပါ။

ပြီးရင် ငွေကြေးထောက်ပံ့ထားတဲ့ အရင်းအမြစ်အတွက် စစ်တမ်းကောက်ယူပြီး သင့်ကိုယ်ပိုင် အခွန်ပေးချေမှုလုပ်ငန်းတွေကို မတင်ခင်:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

တောင်းခံမှု အသုံးချပြီးသော်လည်း ပိုင်ဆိုင်မှုကို မမြင်ရသေးပါက ရေးသားမှုမပို့မီ စောင့်ပြီး ဖတ်ရှုမှုကို ပြန်ကြိုးစားပါ။

Faucet သည် Taira testnet ငွေအတွက်သာ ဖြစ်သည်။ Minamoto လုပ်ငန်းစဉ်များတွင် testnet XOR၊ faucet အကောင့်များ သို့မဟုတ် Taira canary လက်မှတ်ထိုးသူများကို မသုံးပါနှင့်။

## 5. Minamoto client ပြင်ဆင်သတ်မှတ်ချက် ဖန်တီးခြင်း {#_5-create-a-minamoto-client-config}

Minamoto အတွက် သီးခြားသော့စုံကို အသုံးပြုပါ။ အဓိကကွန်ရက်အတွက် Taira သော့တွေကို ပြန်မသုံးပါနဲ့။

`minamoto.client.toml` ကို ဖန်တီးပါ

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ထိပ်ဆုံးအဆင့် `chain` သည် လက်ရှိ SORA Nexus ၏ mainnet ချိန်း ID ဖြစ်ပြီး `network_id` သည် Minamoto ၏ ကွန်ရက် identity အတိအကျဖြစ်သည်။ ပထမ လက်မှတ်ထိုးလုပ်ဆောင်မှု မပြုမီ capabilities လမ်းကြောင်းမှ ၎င်းကို ဖတ်ပါ။ `[account].profile = "minamoto"` သည် Minamoto I105 ချိန်းခွဲခြားတန်ဖိုးကို ရွေးချယ်သည်။ Endpoint host အမည်နှင့် ချိန်း ID တို့က ၎င်းကို အလိုအလျောက် မရွေးချယ်ပါ။

Minamoto အများသုံးသော့ကို ၎င်း၏ တစ်ခုတည်းသော ပရိုတိုကုတ်စံညွှန်း I105 အကောင့် ID သို့ mainnet ကြိုတင်စာရင်းဖြင့် ပြောင်းပါ။

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

mainnet အသုံးပြုသူအသစ်ထည့်သွင်းရေး သို့မဟုတ် အုပ်ချုပ်မှုလုပ်ငန်းစဉ်မှတစ်ဆင့် အကောင့်ကို ပြင်ဆင်ဖန်တီး၍ ရန်ပုံငွေဖြည့်ပြီးသည်အထိ ဖတ်ရှုဘက် စစ်ဆေးမှုများကိုသာ လုပ်ဆောင်ပါ။

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira ၏ faucet သို့မဟုတ် အခြေခံစမ်းသပ်မှု command များကို Minamoto တွင် မလုပ်ဆောင်ပါနှင့်။

## (၆) ရန်ပုံငွေ Minamoto ငွေစာရင်း XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto အခကြေးကိုထုတ်လုပ်မှု XOR ဖြင့်ပေးဆပ်ခြင်းဖြစ်ပြီး Minamoto တွင် testnet ဘဏ္ဍာရေးဝန်ဆောင်မှုမရှိပါ။ ခွင့်ပြုထားသော mainnet onboarding သို့မဟုတ် treasury transfer များမှတစ်ဆင့် ဖွဲ့စည်းထားသည့်စာရင်းကို ရင်းနှီးမြှုပ်နှံခြင်း၊ (သို့) တည်ရှိပြီးသား ဘဏ္ဍာငွေဖြင့် ရင်းနှီးမြုပ်နှံထားသော Minamoto အကောင့်မှ XOR ကိုရရှိခြင်း။

စာရင်းတင်မပေးမီ ဖတ်နိုင်သည့် စစ်ဆေးချက်များဖြင့် တစ်ကိုယ်ရေ ပရိုတိုကုတ်စံညွှန်းစာရင်း ID နှင့် ငွေကြေးကို စစ်ဆေးပါ။ Minamoto XOR ကို ထုတ်လုပ်မှုငွေအဖြစ်ဆက်ဆံပါ: Taira တွင်ပထမဦးဆုံး လုပ်ဆောင်ချက်တစ်ခုတည်းကိုလေ့ကျင့်ပါ၊ သီးခြားထုတ်လုပ်ရေး သော့တွေကို ထိန်းထားပြီး အဓိကကွန်ရက်ရောင်းဝယ်မှုကို ပြန်လည်စတင်နိုင်တယ်လို့ မထင်ပါနဲ့။

Taira XOR သည် Minamoto အခွန်များကို မပေးနိုင်ပါ။ Testnet ကွင်းဆင်းငွေနှင့် testnet ငွေကြေးထောက်ပံ့မှု ဝန်ဆောင်မှု တောင်းဆိုချက်များသည် Minamoto သို့ လွှဲပြောင်းခြင်းမရှိပေ။

## 7. ရှိပြီးသား Data space အတွင်း လုပ်ဆောင်ခြင်း {#_7-work-inside-an-existing-data-space}

Data space အတွင်းရှိ လယ်ဂျာ object များအတွက် domain အမည်အပြည့်အစုံကို သုံးပါ။ ဥပမာ အများသုံး data space ရှိ စီမံကိန်း domain သည် အောက်ပါအတိုင်း သုံးသင့်သည်:

```text
apps.universal
```

သင့်အကောင့်မှာ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေရှိပြီးနောက် domain အတွက် လျှို့ဝှက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်ကို ဖန်တီးပြီး Declarative Planner ကိုသုံးပါ။

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto အတွက် သီးခြား အဓိကကွန်ရက်ရည်ရွယ်ချက်နှင့် အစီအစဉ်ကိုထုတ်လုပ်ပြီး ခွင့်ပြုပါ။ အစီအစဉ်များသည် ၎င်းတို့၏ချိတ်ဆက်မှု၊ ခွင့်ပြုမှု မူဝါဒ၊ လက်ရှိအခြေအနေ ချုံ့ချက်နှင့် နောက်ဆုံးအချိန်နှင့် ကန့်သတ်ထားသည်ဖြစ်၍ Taira အစီအစဉ်ကို တိုးမြှင့်ခြင်း (သို့) ပြန်လည်ကစားခြင်းမရှိပါ။

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

အကောင့် alias များသည် တူညီသော data space နောက်ဆက်ကို သုံးသည်:

```text
alice@apps.universal
alice@universal
```

တိကျသော အကောင့်အမျိုးအစား လိုအပ်သည့် field များတွင် စံ I105 အကောင့် ID များကိုသာ သုံးဆဲဖြစ်သည်။ Alias များကို စံအကောင့် ID သို့ ဖြေရှင်းပေးသော လူဖတ်လွယ် ချည်နှောင်မှုများအဖြစ် သဘောထားပါ။

## 8. Data space အသစ် ဖန်တီးပြင်ဆင်ခြင်း {#_8-provision-a-new-data-space}

Data space အသစ်သည် အော်ပရေတာနှင့် အုပ်ချုပ်မှုဆိုင်ရာ အပြောင်းအလဲဖြစ်သည်။ အများသုံး Torii ၏ endpoint သည် ပြင်ဆင်သတ်မှတ်ထားသော data space များသို့ အသွားအလာကို ပို့နိုင်သော်လည်း မသိသော data space alias များကို ငြင်းပယ်မည်။

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

Lane ID၊ data space ID၊ validator အစု၊ ချို့ယွင်းမှုခံနိုင်ရည်၊ manifest၊ လမ်းကြောင်းစည်းမျဉ်းများနှင့် လည်ပတ်ရေးတာဝန်ခံတို့ကို အတူတကွ မသုံးသပ်မချင်း alias အသစ်ကို မတင်မြှောက်ပါနှင့်။ လိုအပ်သော ခွင့်ပြုချက်များရှိသည့် ပုံမှန်အသုံးပြုသူအကောင့်သည် alias အစီအစဉ်ရေးဆွဲသူမှတစ်ဆင့် ရှိပြီးသား data space အတွင်း domain နှင့် SNS ငှားရမ်းခွင့်ကို ရယူနိုင်သည်။ အများသုံး data space အသစ်ကို ဘေးကင်းစွာ မထည့်နိုင်ပါ။

သီးသန့် သို့မဟုတ် အဖွဲ့အစည်းဆိုင်ရာ data space အတွက် အောက်ပါတို့ပါ ကတ်တလောက်အပြောင်းအလဲကို ပြင်ဆင်ပါ:

- တစ်ခုတည်းသာရှိသော data space alias နှင့် ကိန်းဂဏန်း `id`
- သက်ဆိုင်တဲ့ အကောင်အထည်ဖော်ရေးလမ်းကြောင်းဝင်မှု (သို့) လက်ရှိ အကောင်အ ထည်ဖော်ရေး လမ်းကြောင်းတာဝန်တစ်ခု
- data space ၏ `fault_tolerance`
- လမ်းညွှန်ချက်များ (သို့) အဲဒီမှာ ဆင်းသက်သင့်တဲ့ အကောင့်အကွာအဝေးများအတွက် လမ်းကြောင်းစည်းမျဉ်းများ
- data space က UAID စွမ်းရည်များကို ဖွင့်ပေးပါက နေရာစာရင်း manifest သို့မဟုတ် တူညီသော ဖြန့်ချိမှုအထောက်အထား
- validator၊ စည်းမျဉ်းလိုက်နာမှု၊ ငွေရှင်းခြင်းနှင့် စောင့်ကြည့်မှု မူဝါဒတို့အတွက် အုပ်ချုပ်မှုအတည်ပြုချက်

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
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

Operator လက်ခံမှုမှာ အောက်ပါဂိတ်တွေ ပါဝင်သင့်ပါတယ်။

- ဖြေရှင်းတွက်ချက်ပြီးဖြစ်သော နိုဒ်ပြင်ဆင်သတ်မှတ်ချက်အပေါ် `iroha3d --sora --config <config.toml> --trace-config` အောင်မြင်သည်
- ထုတ်လုပ်ထားသော သို့မဟုတ် ပြန်လည်သုံးသပ်ထားသော manifest ကို ဟက်ရှ်များ၊ လက်မှတ်များနှင့်အတူ မော်ကွန်းတင်ထားခြင်း
- မီးခိုးစမ်းသပ်မှု Taira ကို Minamoto တိုးမြှင့်ခြင်းတစ်ခုခုမတိုင်မီ ဖြတ်သန်းပါ။
- ပြောင်းလဲပြီးနောက် `/status` ကတ်တလောက်တွင် ရည်ရွယ်ထားသော lane နှင့် data space ကို ဖော်ပြခြင်း
- `iroha app nexus lane-report --summary` သည် လိုအပ်သော နည်းပညာထုတ်ပြန်ချက်များ ပျောက်ဆုံးနေကြောင်း မပြောဆိုပါ။

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Taira ဖြန့်ချိတပ်ဆင်မှု၊ အခြေခံစမ်းသပ်မှုများ၊ စောင့်ကြည့်မှုနှင့် အုပ်ချုပ်မှုအထောက်အထားများ ပြည့်စုံပြီးမှသာ တူညီသော data space ကို Minamoto သို့ တင်မြှောက်ပါ။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [တပ်ဆင်ရန် Iroha 3](/my/get-started/install-iroha.md)
- [Iroha 3 ကို CLI မှတစ်ဆင့် လည်ပတ်ပါ။](/my/get-started/operate-iroha-via-cli.md)
- [သီးသန့် data space အတွက် အခကြေးငွေ ပံ့ပိုးပေးခြင်း](/my/get-started/private-dataspace-fee-sponsor.md)
- [Torii ၏ endpoint များ](/my/reference/torii-endpoints.md)
- [blockchain Genesis ကို ရည်ညွှန်းချက်](/my/reference/genesis.md)
