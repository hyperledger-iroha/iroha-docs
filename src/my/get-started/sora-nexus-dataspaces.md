---
translation_locale: my
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဆက်လက်တည်ဆောက်ပါ SORA 3: Taira နှင့် Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 သည် app ကို ဦးတည်ပြီး တည်ဆောက်ထားသော အများပြည်သူ ဖြန့်ချိရေးလမ်းကြောင်းဖြစ်သည်။ Iroha 3 နှင့် SORA
Nexus. ဒါကို တည်ဆောက်ပြီး လေ့ကျင့်ပါ။ Taira ပထမဦးဆုံး၊ အဲဒီနောက်မှာ Client ပုံစံတူကို ရွေ့ရှားပါ။
သို့ Minamoto သင်မှာ သီးခြားကလီးတွေရှိတဲ့အခါပဲ၊ တကယ့် XOR အခွန်အတွက်၊
ထုတ်လုပ်မှု ခွင့်ပြုချက်

ဒီသင်ခန်းစာက ဘယ်လို configure လုပ်ရမလဲဆိုတာ ပြပေးပါတယ် Iroha အများပြည်သူအတွက် ဖောက်သည် SORA 3
ကွန်ရက်များ

- Taira testnet ကို `https://taira.sora.org`
- Minamoto မန်ယူမှာ `https://minamoto.sora.org`

အသုံးပြုခြင်း Taira ပေါင်းစပ်မှု စမ်းသပ်မှုများအတွက်၊ ရေပိုက်များမှ ငွေကြေးထောက်ပံ့ပေးသော စာရေးသားခြင်းဆိုင်ရာ ကန်နာရီများအတွက်၊
စေလွှတ်ရေး လေ့ကျင့်ခန်းတွေ သုံးပါ။ Minamoto ထုတ်လုပ်မှု ပြင်ဆင်ထားသော မိုက်နတ်အတွက်သာ
လုပ်ငန်းခွင်: ကွန်ရက် နှစ်ခုစလုံးမှာ အခွန်ကောက်ခံကြသည်။ XOR:

- Taira testnet ကို အသုံးပြုသည် XOR ပြည်သူ့ရေချိုးခန်းကပါ။
- Minamoto real ကို အသုံးပြုသည် XOR. မရှိဘူး။ Minamoto ရေနွေးကြော်စက်ပါ။

## ဆောက်လုပ်ရေး လမ်းကြောင်း {#builder-path}

| အဆင့်                        | Taira Testnet                                                | Minamoto မိုင်းနတ်                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| ကွန်ရက်အခြေအနေကို ဖတ်ရန်စတင်ပါ | မေးခွန်း `/status` သော့မရှိဘဲ                                 | မေးခွန်း `/status` သော့မရှိဘဲ                       |
| ဒေတာနေရာကို ရွေးချယ်ပါ။            | အများပြည်သူ အသုံးပြုခြင်း `universal` သင့်ရဲ့ app က ထိန်းချုပ်ထားတဲ့ လမ်းကြောင်းကို မလိုဘူးဆိုရင် | အဓိကကွန်ရက် ခွင့်ပြုချက်ရပြီးနောက်ပဲ ဒေတာနေရာကို သုံးပါ။ |
| အခကြေးငွေရယူပါ။               | အများပြည်သူကို သုံးပါ။ Taira ရေပိုက်                                  | လက်ခံရရှိခြင်း XOR ငွေကြေးထောက်ပံ့တဲ့ Minamoto ငွေစာရင်း သို့မဟုတ် ခွင့်ပြုထားသော ဘဏ္ဍာငွေ စီးဆင်းမှု |
| စာမေးပွဲ ရေးသား                 | faucet မှ ရင်းနှီးမြှုပ်နှံထားသော စမ်းသပ်မှုကို အသုံးပြုပါ။ XOR                                   | စမ်းသပ်မှု tooling ကိုမသုံးပါနဲ့; စာသားများအစစ်အကျဆုံးကုန်ကျ XOR     |
| အားပေးခြင်း                     | ဆင်ခြင်တုံတရား၊ စောင့်ကြည့်ရေးနဲ့ လက်မှတ်ထိုးသူ ကိုင်တွယ်မှုကို ထပ်မံကြိုးစားပါ။            | သီးခြားသော့တွေ၊ ငွေကြေးထောက်ပံ့မှု၊ ဖြန့်ချိမှု ထိန်းချုပ်မှုကို သုံးပါ။   |

လက်တွေ့ စီးဆင်းမှုက-

1. ဖောက်သည်ကို ဆန့်ကျင်အောင် တည်ဆောက်ပါ။ Taira အများပြည်သူကို သုံးဖို့ `universal` ဒေတာနေရာ။
2. လက်မှတ်ရေးထိုးသူကို ထည့်ပြီး ငွေကြေးထောက်ပံ့ပေးပါ Taira ရေနွေးကြော်စက်ပါ။
3. app logic ကို Taira ကျရှုံးမှုတွေက ငြီးငွေ့စရာမဖြစ်ခင်အထိ
   လေ့လာလို့ရတယ်။
4. သီးသန့် ဖန်တီးပါ Minamoto လက်မှတ်ရေးထိုးသူ၊ ငွေကြေးကို အရှိန်အဟုန်နဲ့ ရယူပါ။ XOR, ရွေ့ရှားဖို့ပဲ
   အလားတူ သက်သေပြထားတဲ့ လုပ်ငန်းတွေပဲ ဆက်လုပ်နေတာပါ။

## (၁) သင်ပေးနေတာကို နားလည်ပါ {#_1-understand-what-you-are-setting-up}

အတွင်းမှာ SORA Nexus, ဒေတာနေရာဟာ ကွန်ရက်လမ်းကြောင်းနဲ့ လမ်းညွှန်စာရင်းရဲ့ အစိတ်အပိုင်းပါ။
ဖောက်သည်သည်က ပြောင်းလဲခြင်းဖြင့်သာ အများပြည်သူ ဒေတာနေရာသစ်ကို ဖန်တီးခြင်းမဟုတ်ပါ။
`client.toml`. Client Setup က နှစ်ခုလုပ်တယ်။

1. client ကိုညာဘက်ကို ညွှန်ပြပေးတယ်။ Torii အဆုံးသတ်မှတ်ချက်
2. ၎င်း၏ Canonical Account အတွက် Domain နှင့် Data Space Routing အခြေအနေကို ရွေးချယ်သည်

`AccountId` ဒါက အမြဲတမ်း ကနောဂဗေဒနဲ့ နယ်ပယ်မဲ့ပါ။ `[account].domain` တန်ဖိုး
`client.toml` Routing နှင့် alias context ကိုပေးသည်။
အကောင့်အမှတ်အသား။ လျှောက်လွှာအများစုအတွက် အများပြည်သူနဲ့ စတင်ပါ။
`universal` ဒေတာအကွာအဝေး။ Domain context ကို အသုံးပြုသည် `domain.dataspace` ပုံစံအတွက်
ဥပမာ:

```text
wonderland.universal
```

သင့်မှာ အဖွဲ့အစည်းဆိုင်ရာ ဒေတာနေရာသစ်တစ်ခု လိုအပ်တယ်ဆိုရင် စာရင်းအင်းနဲ့ လမ်းညွှန်ရေးကို ပြင်ဆင်ပါ။
သာမန် ဖောက်သည်စာရင်းကနေ မှတ်ပုံတင်ဖို့ ကြိုးစားမယ့်အစား အဆိုပြုချက်ပါ။
ကြည့်ပါ။ [ဒေတာနေရာသစ်ကို စီစဉ်ပေးခြင်း](#_8-provision-a-new-dataspace) အောက်မှာပါ။

## (၂) အများပြည်သူကို စစ်ဆေးပါ။ Torii အဆုံးသတ်ချက် {#_2-check-the-public-torii-endpoint}

လက်မှတ်ရေးထိုးသူကို သတ်မှတ်မပေးခင် Target Endpoint ကို live လုပ်ထားတာကို စစ်ဆေးပါ။

အတွက် Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

အတွက် Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

node ကဖွင့်ထားတဲ့ data space နဲ့ lane view ကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

command ကိုပဲသုံးပါ `https://minamoto.sora.org/status` မိုက်နတ်အတွက်ပါ။

## Taira MCP Agents များအတွက် {#taira-mcp-for-agents}

Taira နောက်ပြီး Torii- ဒေသခံပုံစံ ပဟေဠိစာချုပ် (MCP) တံတားအတွက်
Agent Runtimes ကိုသုံးပါ။ Agent က live testnet ဖတ်ဖို့လိုအပ်တဲ့အခါ scripted
ရောဂါရှာဖွေမှု (သို့) ကျင့်ဝတ်ကို တည်ဆောက်ခြင်းမရှိဘဲ ကျွမ်းကျင်စွာ ပြန်လည်သုံးသပ်တဲ့ စာရေးလေ့ကျင့်ခန်းများ
Torii ဖောက်သည်က အရင်ဆုံးပါ။

| ချမှတ်ခြင်း | တန်ဖိုး |
| --- | --- |
| MCP အဆုံးသတ်မှတ်ချက် | `https://taira.sora.org/v1/mcp` |
| ကွန်ရက် root | `https://taira.sora.org` |
| ရည်ရွယ်ချက် | Taira testnet စာဖတ်ခြင်းနှင့် faucet မှ ရင်းနှီးမြှုပ်နှံထားသော စာရေးမှု စမ်းသပ်မှုများ |
| ထုတ်လုပ်ရေး ညီမျှမှု | ဤစာရင်းကို Minamoto မိုက်နတ်တစ်ချောင်းမှလွဲရင် MCP အဆုံးသတ်မှတ်ချက်နဲ့ ထုတ်လွှတ်မှု ထိန်းချုပ်မှုကို ရှင်းလင်းစွာ ခွင့်ပြုထားပါတယ် |

လက်မှတ်ရေးထိုးတဲ့ ပစ္စည်း မထည့်ခင် တံတား metadata ကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Configure ကို URL user-local အဖြစ် MCP Server ကို Agent Runtime မှာ
အမိန့်ပေးသူ MCP config ကို API tokens, forwarded author headers များ၊ `authority`, ဒါမှမဟုတ်
`private_key` ဒီ Docs repo ဒါမှမဟုတ် application repo ထဲမှာရှိတဲ့ တန်ဖိုးတွေပါ။

Agent အလျင်အမြန် စည်းမျဉ်းတွေကို ကောင်းမွန်စွာအလုပ်လုပ် Taira:

- ရုံးခန်းထဲက ကိရိယာတွေကို ရှာဖွေပါ။ MCP သူတို့ကို ဖုန်းမခေါ်ခင် ဆာဗာကို ပြန်လည်ရှာဖွေပါ။
  server အစီရင်ခံစာများ `listChanged`.
- အလှူခံတွေကို ပိုနှစ်သက်တယ်။ `iroha.*` ရေနံထက် ကိရိယာများ `torii.*` ကိရိယာတွေ
- စာဖတ်မှုသာ စပါ: အခြေအနေ၊ အကောင့်များ၊ အရင်းအမြစ်များ၊ အမည်မဖော်လိုသူများ၊ ဘလော့များကို စစ်ဆေးပါ။
  စီမံခန့်ခွဲမှုအခြေအနေ၊ တင်ပြမည့် စာရွက်စာတမ်းများ မတင်မီ ငွေကြေးဆိုင်ရာ အခြေအနေ။
- သက်ရှိ စမ်းသပ်မှု ကွန်ရက် ဗီဇပြောင်းခြင်းမတိုင်ခင် လူသားရဲ့ ရှင်းလင်းတဲ့ ညွှန်ကြားချက်တစ်ခု လိုအပ်ပါတယ်။
  ကြိုတင်လက်မှတ်ရေးထိုးထားသော ငွေလွှာများ၊ အသုံးပြုမှု `iroha.transactions.submit_and_wait`
  ဒီတော့ ကိုယ်စားလှယ်က ရလဒ်ကို စောင့်နေတာပါ။ တင်ပြတာအစားပေါ့။
- Transaction hashes များ၊ နောက်ဆုံးအခြေအနေများနှင့် server validation error များကို
  ကိုယ်စားလှယ်ရဲ့ တုံ့ပြန်မှုပါ။

### ကိုယ်စားလှယ်များနှင့်အတူ ဖွံ့ဖြိုးတိုးတက်ရေး လုပ်ငန်းစဉ် {#development-workflow-with-agents}

ဖွံ့ဖြိုးတိုးတက်မှုအတွက် အကူအညီအဖြစ် အေဂျင့်တွေကို အသုံးပြုပါ။ Iroha ဖောက်သည်များ၊ ငွေပေးချေမှု တည်ဆောက်သူများ၊
ရောဂါစစ်ဆေးရေး စကရစ်တွေ၊ စမ်းသပ်မှု ကွန်ရက် ပြေးဆွဲစာအုပ်တွေ။
ကုဒ်ကို စစ်ဆေးနိုင်တယ်၊ ဖတ်နိုင်တယ်။ Taira ပြည်နယ်၊ ပြင်ဆင်ရေး အကြံပြုချက်တွေ၊ ဒေသတွင်း စမ်းသပ်မှုတွေ လုပ်ပေးတယ်။
ဒါပေမဲ့ လူသားက တိကျတဲ့
လုပ်ငန်းစဉ်။

လက်တွေ့ အလုပ်ဖြစ်စဉ်က-

1. ကိုယ်စားလှယ်ကို သက်ဆိုင်ရာ ဆရာဝန်တွေကို စစ်ဆေးဖို့ တောင်းဆိုပါ။ SDK ကုဒ်၊ CLI အမိန့်ပေးခြင်း၊ သို့မဟုတ် MCP
   code ကိုရေးမပေးခင် tool schema
2. အေဂျင့်ကို ပထမဆုံး Client လမ်းကြောင်းအသေးဆုံးကို ရေးခိုင်းပါ။ အခြေအနေ စစ်ဆေး၊ အကောင့်
   Search, alias resolution (သို့) balance search
3. Read Only Calls ကို အသုံးပြုပြီးနောက်မှသာ Transaction Building Code ကို ထည့်သွင်းပါ။
   Taira.
4. အွန်လိုင်းစစ်ဆေးမှုများကို လက်ခံရန် ရွေးချယ်ထားပါ။ ဥပမာ နောက်ကွယ်မှာ `TAIRA_LIVE=1`, ဒီတော့ a
   ပုံမှန် unit test run က testnet ငွေတွေကို ဘယ်တော့မှ မသုံးဘူး၊ ကွန်ရက်ကို မှီခိုတယ်
   ရရှိနိုင်မှု။
5. ကိုယ်စားလှယ်ကို ကွန်ရက် root, chain, authority account ကို တိုင်ကြားဖို့ တောင်းဆိုပါ။
   ညွှန်ကြားချက်စုဆောင်းမှု၊ အခွန်လက်ဝှေ့နှင့် မတင်မီ မျှော်လင့်ထားသောအခြေအနေပြောင်းလဲမှု
   မည်သည့် ငွေပေးချေမှုမဆို။
6. လျှို့ဝှက်ကိုင်တွယ်မှု၊ ပြန်လည်စမ်းသပ်မှု အပြုအမူ၊ လွတ်လပ်ခွင့်နဲ့ ပတ်သက်ပြီး ဖန်တီးထားတဲ့ ကုဒ်ကို Review လုပ်ပါ။
   ပယ်ချခြင်း မပြုလုပ်မီ CI (သို့) အလုပ်ဖြစ်စဉ်တွေကို ဆက်လက်လုပ်ကိုင်ပါ။

အသုံးဝင်တဲ့ စာဖတ်ခြင်းသာ MCP ဖွံ့ဖြိုးရေးအတွက် ကိရိယာများမှာ ငွေစာရင်း အရင်းအမြစ်ရှာဖွေမှု ပါဝင်ပါတယ်။
alias resolution, block search, transaction search, transact lists နဲ့
pipeline status checks များကို အသုံးပြုပြီး
လက်မှတ်ထိုးထားတဲ့ အသုံးဝင် ဝန်ဆောင်မှုပါ။

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ငွေပေးချေမှု လုပ်ငန်းစဉ်များ Agent များမှတဆင့် {#transaction-workflow-through-agents}

နိုင်ငံခြားရေး MCP bridge က လက်မှတ်ထိုးထားတဲ့ စာရွက်စာတမ်းကို တင်ပြနိုင်ပါတယ် Iroha ငွေလဲလှယ်နှုန်းသမိုင်း
ငွေလဲလှယ်မှုအတွက် မှန်ကန်တဲ့
အာဏာ၊ ခွင့်ပြုချက်များ၊ အခွန်ထောက်ပံ့မှု၊ ကွင်းဆက် ID, metadata နဲ့ လက်မှတ်။

အသားအရေအတွက် Iroha ငွေလဲလှယ်နှုန်း အီလက်ထရောနစ်
SDK ဒါမှမဟုတ် CLI ပထမဦးဆုံးအနေနဲ့ ကိုယ်စားလှယ်ကို လက်မှတ်ထိုးထားတဲ့ တရားဝင် ငွေပေးချေမှုကိုသာ ပေးပါ။
bytes ကို encoded as `body_base64`. ကိုယ်စားလှယ်က စာအိတ်ကို
`iroha.transactions.submit_and_wait`, (သို့) တင်ပြခြင်း
`iroha.transactions.submit` နှင့် မဲဆန္ဒပြ `iroha.transactions.wait`.

Private keys ကို agent prompt ထဲ မထည့်ပါနဲ့။
transaction ကို user ရဲ့ runtime ထဲက လျှို့ဝှက်ချက်တွေကို load လုပ်တဲ့ ဒေသခံကုဒ်ကို ညွှန်ပြပါ
ပတ်ဝန်းကျင်၊ keychain၊ hardware signer သို့မဟုတ် testnet config ဖိုင်ကို လျစ်လျူရှုခြင်း။
Agent က key material ကို Markdown, fixtures, logs ထဲမှာ ဘယ်တော့မှ မရေးသင့်ဘူး
ကတိပေးတယ်။

ငွေပေးချေမှုကို မတင်ခင်မှာ ကိုယ်စားလှယ်ကို အတိုချုပ် ငွေပေးချေးမှု လုပ်ခိုင်းပါ။
အစီအစဉ်:

- `network`: Taira testnet root နဲ့ chain တွေ ID
- `authority`: စာရင်းမှတ်ပုံတင်ပြီး အခွန်ပေးတယ်
- `instructions`: မှတ်ပုံတင်၊ မိတ်ကပ်၊ မီးရှို့၊ လွှဲပြောင်းခြင်း၊ မီတာဒေတာများ၊ ခွင့်ပြုချက်များ သို့မဟုတ်
  စာချုပ်ခေါ်ဆိုမှု အကျဉ်းချုပ်
- `fee asset`: ငွေကြေးငွေကို စရိတ်ကောက်ခံမည် Taira
- `preflight reads`: အကောင့်၊ အရင်းအမြစ်စာရင်း၊ ခွင့်ပြုချက်များ၊ အမည်မဖော်လိုသူများ သို့မဟုတ် ဘလော့ကဒ်များ
  ပြီးစီးပြီး စစ်ဆေးမှု
- `expected result`: အတည်ပြုပြီးနောက် မြင်ရသင့်တဲ့ အခြေအနေ
- `idempotency`: အလားတူ တောင်းဆိုချက်ကို ထပ်မံစမ်းသပ်ရင် ဘာဖြစ်မလဲ။

တင်ပြပြီးနောက် Agent ကို terminal status ကိုစောင့်ခိုင်းပြီး
Read query နဲ့ state change လုပ်ပါ။ အသုံးဝင်ပြီးစီးမှု အစီရင်ခံစာမှာ အောက်ပါအချက်တွေ ပါဝင်ပါတယ်။

- ငွေပေးချေမှု hash
- terminal status ဥပမာ `Committed`, `Applied`, `Rejected`, ဒါမှမဟုတ် `Expired`
- Block သို့မဟုတ် explorer အသေးစိတ်ရှိပါက
- စစ်ဆေးမှုဖတ်ရှုချက် ရလဒ်များ
- ငြင်းပယ်မှု သတင်းစာနဲ့ ပျက်ကွက်မှုက ခွင့်ပြုချက်တွေ၊ အခွန်တွေလိုလား၊
  အတည်ပြုချက်၊ ခေတ်မမီတဲ့ အခြေအနေ (သို့) အဆုံးအဖြတ်မှတ်ရှိမှု

ဥပမာ စောင့်ရှောက်မှု ချက်ချင်း:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

လက်မှတ်ထိုးထားတဲ့ စာအိတ်ကို ပြင်ဆင်ပြီးသားမှာ

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

ကုသမှု Taira MCP အများပြည်သူ စမ်းသပ်ရေးကွန်ရက် ထိန်းချုပ်မှု မျက်နှာပြင်အဖြစ်။ Taira သော့၊ စမ်းသပ်မှု ကွန်ရက် XOR,
ရေပိုက်စာရင်းများနှင့် ကန်နာရီ လက်မှတ်ရေးထိုးသူများကို တစ်ကြိမ်သုံးနိုင်ပြီး သီးခြားထားရမည်
Minamoto Key တွေနဲ့ Production Release Workflows တွေ။

## လက်ရှိတွင် စမ်းကြည့်နိုင်သော ကစားစရာများ {#toy-examples-you-can-try-now}

ဒီဥပမာတွေဟာ မှတ်ချက်မတင်ရင် ဖတ်နိုင်တာပဲ
သော့တွေရှိပြီး အများသုံးကွန်ရက် နှစ်ခုစလုံးနဲ့ အန္တရာယ်ကင်းပါတယ်။

နှိုင်းယှဉ် Taira testnet နဲ့ Minamoto ကျန်းမာရေး:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

အများပြည်သူ ဒေတာနေရာလမ်းကြောင်းများကို ဖော်ပြပါ Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

အလားတူ အမိန့်ကို ဆန့်ကျင် Minamoto အဓိကကွန်ရက် ရှုထောင့်ကို လိုအပ်တဲ့အခါ

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

အသေးစားတစ်ခု ဆောက်လိုက်ပါ။ Node.js Dashboard၊ bot သို့မဟုတ် deployment အတွက် status probe
စစ်ဆေးပါ

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

ပထမဦးဆုံး စာရေးတဲ့ ကစားစရာက Taira faucet claim ကို testnet ကို သုံးတယ်။
XOR ဘယ်တော့မှ မပြသင့်ပါဘူး။ Minamoto.

## (၃) a ကို ဖန်တီးပါ။ Taira Client Config ကို {#_3-create-a-taira-client-config}

လက်ရှိ မရှိရင် Keypair တစ်ခုကို ဖန်တီးပါ။

```bash
kagami keys --algorithm ed25519 --json
```

ဖန်တီးခြင်း `taira.client.toml`:

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

ထိပ်ဆုံးအဆင့် `chain` တိကျတဲ့ Taira ငွေပေးချေမှု အစဉ် ID. နိုင်ငံခြားရေး
`[account].profile = "taira"` setting က သီးသန့်ရွေးချယ်တယ်။ Taira I105
ကွင်းဆက်ခွဲခြားမှု။ ID Account profile ကို မရွေးချယ်ပါ။

ဖတ်လို့သာရတဲ့ စစ်ဆေးချက်တစ်ခု လုပ်ပါ။

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

အများပြည်သူကို ဦးဆောင်ပါ။ Taira စာရေးခြင်း စမ်းသပ်မှုမတိုင်ခင် ရောဂါစစ်ဆေးချက်များ:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ဘဏ္ဍာငွေ Taira ငွေပေးချေစာရင်းတွေ မဖွင့်ခင် ရေနံတံခါးကို ဖြတ်ပြီး အကောင့်သွင်းပါ။
တိုက်ရိုက်ရေတံစီးဆင်းမှုသည်
[Testnet ကို ရယူပါ။ XOR အပေါ် Taira](#_4-get-testnet-xor-on-taira).

Faucet claim ကို လက်ခံပြီး အကောင့်ကို ငွေကြေးထောက်ပံ့ပြီးနောက် Taira
Canary ဟာ ရွေးချယ်စရာ စာရေးတဲ့ မီးခိုး စမ်းသပ်မှုပါ။

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Canary က လက်မှတ်ထိုးထားတဲ့ ping ကို တင်ပြပြီး အတည်ပြုမှုကို စောင့်ဆိုင်းပြီး
runtime signer ကို config လုပ်တဲ့အခါ `--write-config` ပေးထားတယ်။ Taira အများပြည်သူ
testnet, ထို့ကြောင့်အတန်း saturation ကလက်မှတ်ရေးထိုးထားသော ping ပျက်ကွက်နိုင်သည်တောင်မှ
faucet ကိုယ်တိုင် အလုပ်ဖြစ်တယ် `taira doctor` ကျေနပ်နေတဲ့ တန်းစီတစ်ခု (သို့)
ကန်နာရီ ပြန်လာမှု `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, ကြိုပြီး ထပ်ကြိုးစားပါ
ဒါကို Client Configuration အမှားအဖြစ် ကုသပေးတယ်။

ထိန်းချုပ်မှုမရှိတဲ့ မီးခိုးစမ်းသပ်မှုအတွက် ကန်နာရီကို နယ်နိမိတ်ထားတဲ့ ပြန်လည်စမ်းသပ်မှု loop တစ်ခုမှာ ဝိုင်းထားပါ။

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

ထပ်ပြီး စမ်းတာ ရပ်လိုက်ပါ `iroha taira doctor` ပြင်းထန်တဲ့ ကျရှုံးမှုတွေပြတယ်။
ငွေကြေးလက်ခံမှု ငြင်းပယ်ခြင်းသည် ပြည်သူ့စစ်ဆေးရေးကွန်ရက်အတွက် ယာယီအခြေအနေဖြစ်သည် DNS,
TLS, ဒါမှမဟုတ် `status = "fail"` ရောဂါရှာဖွေမှုက မဟုတ်ဘူး။

## A ကို ဖန်တီးပါ SORA Nexus အကောင့် ID {#generate-a-sora-nexus-account-id}

A ကို SORA Nexus အကောင့် ID ကနောဂဗေဒ I105 အမည်ကို
Account public key နှင့် target network prefix ကို အသုံးပြုပါ။
`[account].domain` client value ကို TOML. တူညီတဲ့ အများသုံး သော့ကို ကုဒ်များ
ခြားနားသော IDs အပေါ် Taira နှင့် Minamoto, ထုတ်လုပ်ရေး အသုံးပြုသူများက
ကွဲပြားသော keypair များအတွက် Minamoto.

Account ကို Control လုပ်ပေးမယ့် Ed25519 keypair ကို Generate သို့မဟုတ် load လုပ်ပါ။

```bash
kagami keys --algorithm ed25519 --json
```

အများသုံး သော့ကို Taira အကောင့် ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

a ကိုပြောင်း Minamoto အများသုံး သော့ကို mainnet ကြိုတင်စာရင်းနဲ့:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

ရလာတဲ့ အကောင့်ကို အသုံးပြုပါ။ ID ဘယ်နေရာမှာမဆို Nexus API ဒါမှမဟုတ် CLI အမိန့်ပေးချက်က
တရားဝင်စာရင်း ID, ဥပမာ Taira ရေပိုက် `account_id`, ဟန်ချက်ညီမှု
မေးမြန်းချက်တွေ၊ တင်းကျပ်တဲ့ အကောင့်ကွင်းတွေ (သို့) alias bindings တွေပါ။
private key ကို client configuration ထဲမှာ ထည့်ပြီး public network ကို
`[account].profile = "taira"` ဒါမှမဟုတ် `[account].profile = "minamoto"`.

ထုတ်ပေးခြင်း ID ငွေကြေးပေးချေမှုအစီအစဉ်မှာ ငွေကြေးထောက်ပံ့တဲ့ အကောင့်တစ်ခု ဖန်တီးတာမဟုတ်ဘူး။
Taira, faucet က testnet ရေးသားတဲ့ account ကို ဖန်တီးပြီး ငွေကြေးထောက်ပံ့နိုင်ပါတယ်။
Minamoto, ခွင့်ပြုထားတဲ့ Mainnet Onboarding (သို့) Treasury flow ကို သုံးပါ။

### သော့များ သိုလှောင်ခြင်းနှင့် Backup {#key-storage-and-backup}

စာရင်း ID အများသုံး သော့ကို မျှဝေတာလို့ရတယ်။
စကားဝှက်စကားလုံး၊ မျိုးစေ့နဲ့ ပြန်လည်ထူထောင်ရေး ပစ္စည်းတွေကို လျှို့ဝှက်ထားဖို့လိုပါတယ်။

ဒီလေ့ကျင့်ခန်းတွေကို သုံးပြီး SORA Nexus အကောင့်များ

- သီးသန့်သော့များကို ကုဒ်သွင်းထားသော စကားဝှက် စီမံခန့်ခွဲရေးစနစ်တွင် သိမ်းဆည်းပါ
  key store သို့မဟုတ် dedicated signing service ကို အသုံးပြုပါ။ source key ကို မပေးပါနဲ့။
  ပရိုဂရမ် သမိုင်း၊ မှတ်တမ်းများ၊ စကားပြောဆိုချက်များ၊ လက်မှတ်များတွင် ထုတ်လုပ်ရေး သော့များကို ထိန်းချုပ်ထားရန် သို့မဟုတ် ထားရှိရန်။
  ဒါမှမဟုတ် ကုဒ်မတပ်ထားတဲ့ Backup တွေပါ။
- ပိုက်ထုပ်တစ်ခုစီအတွက် ထူးခြားတဲ့ high-entropy စကားဝှက်ကို သုံးပါ။
  စကားဝှက်များကို password manager သို့မဟုတ် split custody process များတွင် သိမ်းဆည်းရန်။
  ကုဒ်သွင်းထားတဲ့ ပုဂ္ဂလိက သော့နဲ့အတူတူတဲ့ ဖိုင် (သို့) Backup Bundle ပါ။
- ဆက်ထားပါ။ Taira နှင့် Minamoto သော့တွေကို ခွဲထားပါ။ Taira တစ်ကြိမ်သုံးလို့ရတဲ့ သော့တွေ
  testnet ပစ္စည်းနဲ့ Minamoto Key တွေကို Production Fund အာဏာပိုင်အဖြစ် သတ်မှတ်ထားတယ်။
- ပုဂ္ဂလိက သော့၊ အများသုံး သော့၊ အကောင့်ကို back up လုပ်ပါ။ ID, အကောင့်အမှတ်တံဆိပ်၊
  လက်မှတ်ရေးထိုးသူကို ပြန်လည်ထူထောင်ရန် လိုအပ်သော အကောင့်ပြန်လည်သိမ်းဆည်းခြင်း သို့မဟုတ် ထိန်းသိမ်းမှု မှတ်စုများ
  Network context ကင်းမဲ့သော့ကို Recovery လုပ်နေစဉ် အလွယ်တကူ မကောင်းမွန်စွာ အသုံးပြုနိုင်ပါသည်။
- အနည်းဆုံး ပိတ်ထားတဲ့ offline backup တစ်ခုနဲ့ Geographically တစ်ခုကို သိမ်းထားပါ။
  ထုတ်လုပ်ရေး လက်မှတ်ထိုးစက်များအတွက် သီးခြား ကုဒ်သွင်းထားတဲ့ backup ကို။
  Backup ကို မူတည်ပြီး ဖတ်ဖို့သာ လုပ်တဲ့ အသေးစား လုပ်ငန်းစဉ်ပါ။
- Private key၊ passphrase, backup media တွေကို
  (သို့) လက်မှတ်ရေးထိုးတဲ့ အိမ်ရှင်ဟာ ပွင့်လင်းမြင်သာမှုရှိခဲ့လောက်တယ်။

အသေးစိတ်သိရှိလိုပါက
[Cryptographic Key များကို သိုလှောင်ခြင်း](/my/guide/security/storing-cryptographic-keys.md)
နှင့် [စကားဝှက်လုံခြုံမှု](/my/guide/security/password-security.md).

## 4. Testnet ကိုယူပါ။ XOR အပေါ် Taira {#_4-get-testnet-xor-on-taira}

အများသုံးရေချိုးခန်းကို တိုက်ရိုက် သုံးပါ။ စီးဆင်းမှုက:

1. လက်မှတ်ရေးထိုးသူကို ဖန်တီး (သို့) တင်ပြီး ၎င်းရဲ့ Canonical ကို တွက်ချက်ပါ။ Taira အကောင့် ID.
2. လက်ရှိ faucet ပဟေဠိကို ယူလာပါ။
3. ပဟေဠိကို ဖြေရှင်းပါ `difficulty_bits` ပိုကြီးတယ် `0`.
4. ရေနွေးကြိုးလျှောက်လွှာကို တင်ပြပါ။
5. ငွေစာရင်း (သို့) ပိုင်ဆိုင်မှု ဘားလန်ကို ပို့မပေးခင် မြင်နိုင်အောင် စောင့်ပါ။
   အခွန်ပေးစာရေးတယ်။

အများသုံး သော့ကို Taira I105 အကောင့် ID ရေပိုက်က မျှော်လင့်ထားတာက

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

ပဟေဠိကို ယူလာပါ။

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

Faucet ဟာ အများပြည်သူ စမ်းသပ်ရေးကွန်ရက် ဝန်ဆောင်မှုပါ။
ပြန်လည်ပေးသွင်းခြင်း `502`, Timeout (သို့) Gateway အဆင့်အမှားတစ်ခုခုကို စောင့်ပြီး ထပ်မံကြိုးစားပါ။
ခင်ဗျားရဲ့ သော့တွေ (သို့) Client Configuration ကို မပြောင်းခင်

တုံ့ပြန်မှုက ဒီလိုပုံစံပါ။

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

ဘယ်အချိန်မှာ `difficulty_bits` ရှိသည် `0`, အကောင့်ကိုသာ တင်ပြပါ ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

ဘယ်အချိန်မှာ `difficulty_bits` ပိုကြီးတယ် `0`, ပဟေဠိကို ဖြေရှင်းပြီး
ခေါက်ဆွဲ အမြင့် + nonce:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

ပဟေဠိ အယ်လ်ဂိုရစ်သမ်က

1. စိန်ခေါ်မှုကို SHA-256 ပြီးသွားပြီ
   - bytes ကို `iroha:accounts:faucet:pow:v2`
   - ကော်မတီ UTF-8 အကောင့် ID
   - `anchor_height` big-endian လို `u64`
   - `anchor_block_hash_hex` bytes အဖြစ် decoded
   - `challenge_salt_hex` ရှိပါက bytes အဖြစ် decoded
2. စမ်းကြည့်ပါ။ `u64` nonces ကို big-endian 8-byte တန်ဖိုးတွေအဖြစ် ကုဒ်သွင်းထားတယ်။
3. nonce တစ်ခုစီအတွက် scrypt ကို run လုပ်ပါ
   - စကားဝှက်: 8-byte nonce
   - ဆား: 32-byte စိန်ခေါ်မှု
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - ထုတ်ကုန်အလျား: 32 bytes
4. အနိုင်ရမယ့် nonce ကတော့ ပထမဦးဆုံး digest ဖြစ်ပါတယ် `difficulty_bits`
   သုည bits ကို ဦးဆောင်တယ်။

Faucet တုံ့ပြန်မှုမှာ ရင်းနှီးမြှုပ်နှံထားတဲ့ အရင်းအမြစ်နဲ့ queued transaction hash ပါဝင်ပါတယ်။

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

တုံ့ပြန်မှုက လက်ရှိမှာ HTTP `202 Accepted`. အရင်းအမြစ်
အဓိပ္ပါယ်ဖွင့်ဆိုချက် ID အထက်က Taira ပြည်သူ့ရေချိုးခန်းမှ ရင်းနှီးမြှုပ်နှံသည့် အခွန်လက်ဝယ်များ။
faucet က ပြန်လာတဲ့အခါ တောင်းဆိုချက်ကို လက်ခံလိုက်ပြီ `tx_hash_hex` နှင့်
`status: "QUEUED"`.

ပြီးရင် သင့်ကိုယ်ပိုင် အခကြေးငွေကို တင်မပေးခင် ရင်းနှီးမြှုပ်နှံထားတဲ့ အရင်းအမြစ်အတွက် မဲဆွယ်မှုလုပ်ပါ။
ငွေပေးချေမှု

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Faucet claim ကို လက်ခံခဲ့ပေမယ့် account (သို့) asset ကတော့ မမြင်ရဘူးဆိုရင်
ဒါပေမဲ့ ဒီလုပ်ငန်းဟာ အများပြည်သူရဲ့ စာရင်းအင်းစာစဉ် စီမံကိန်းနောက်မှာ ရှိနေဆဲပါ။
စာမပို့ခင် ပြန်ဖတ်ကြည့်ပါ။

ပြေးရန် အဆင်သင့်ဖြစ်သော တိုက်ရိုက်အတွက် API check ကို Save လုပ်ပါ။ `taira_faucet_claim.py`
ပြီးရင် Taira I105 အကောင့် ID:

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

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
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
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

ရေနံတံဆိပ်က Taira testnet ငွေကြေး။ testnet ကို မသုံးပါနဲ့ XOR, ရေပိုက်
အကောင့်များ သို့မဟုတ် Taira ကန်နာရီ လက်မှတ်ရေးထိုးသူ Minamoto စီးဆင်းပါတယ်။

## (၅) a ကို ဖန်တီးပါ။ Minamoto Client Config ကို {#_5-create-a-minamoto-client-config}

သီးသန့် keypair ကို အသုံးပြုပါ။ Minamoto. ပြန်မသုံးပါနဲ့ Taira အဓိက ကွန်ရက်အတွက် သော့တွေ။

ဖန်တီးခြင်း `minamoto.client.toml`:

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

ထိပ်ဆုံးအဆင့် `chain` current ကို Nexus မိုက်နတ်ချောင်း ID.
`[account].profile = "minamoto"` ရွေးချယ်ခြင်း Minamoto I105 သံကြိုး
ကွဲပြားမှုရှိသည်; အဆုံးအသတ်မှတ်ချက်၏ အိမ်ရှင်နာမည်နှင့် အစဉ် ID ဒါကို အတိအကျ မရွေးချယ်ပါနဲ့။

a ကိုပြောင်း Minamoto အများသုံး သော့ကို ၎င်းရဲ့ တရားဝင် I105 အကောင့် ID နှင့်အတူ
မိုင်းနတ် ရှေ့ဆက်:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

အကောင့်ကို ထောက်ပံ့ပြီး ဘဏ္ဍာငွေပေးချေတဲ့အထိ စာဖတ်ချက်ဘက် စစ်ဆေးမှုများကိုသာ လုပ်ပါ။
အဓိကကွန်ရက်ပေါ်တင်ခြင်း (သို့) အုပ်ချုပ်မှုစီးကြောင်းမှတစ်ဆင့်:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

မသုံးပါနဲ့ Taira ရေနံတံဆိပ် (သို့မဟုတ်) စာရေးသူအကူအညီ Minamoto.

## (၆) ရန်ပုံငွေ Minamoto အကောင့်နှင့် XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto အခွန်တွေကို ထုတ်လုပ်မှုနဲ့အတူ ပေးဆပ်ပါတယ်။ XOR, နှင့် Minamoto အများပြည်သူ မရှိ
ရေနံကြိုး။ ခွင့်ပြုထားတဲ့ အဓိကကွန်ရက်ပေါ်တင်ခြင်းဖြင့် ဖွဲ့စည်းထားသော အကောင့်ကို ငွေကြေးထောက်ပံ့ပါ။
ငွေလွှဲပြောင်းမှု (သို့) လက်ခံရရှိမှု XOR ရှိနေတဲ့ ငွေကြေးထောက်ပံ့မှုကနေ Minamoto
အကောင့်။

တရားဝင်စာရင်းကို စစ်ဆေးပါ ID စာဖတ်မှုသာ စစ်ဆေးခြင်းဖြင့် ဘဏ္ဍာငွေပေးချေခြင်း
စာသားကို တင်ပြနေတာပါ။ Minamoto XOR ထုတ်လုပ်ရေး ရင်းနှီးမြှုပ်နှံမှုအဖြစ်
အလားတူ လုပ်ဆောင်ချက် Taira ပထမဦးဆုံးအနေနဲ့ သီးခြားထုတ်လုပ်ရေး သော့တွေ ထားပြီး မထားပါ။
Mainnet ငွေလဲလှယ်မှုကို ပြန်လည်ဖွင့်နိုင်တယ်လို့ ယူဆပါ။

Taira XOR ငွေမပေးနိုင် Minamoto အခွန်များ - Testnet balance နှင့် faucet claim များ
မလွှဲပြောင်းခြင်း Minamoto.

## (၇) တည်ရှိသော ဒေတာနေရာအတွင်းတွင် အလုပ်လုပ်ရန် {#_7-work-inside-an-existing-dataspace}

အပြည့်အဝ အရည်အသွေးရှိတဲ့ domain name တွေကို ledger ပစ္စည်းတွေအတွက် အသုံးပြုပါ။
ဒေတာစကေး: ဥပမာ, အများပြည်သူဒေတာစကီးမှာစီမံကိန်း domain တစ်ခုဟာ
အသုံးပြုမှု:

```text
apps.universal
```

သင့်အကောင့်မှာ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေရှိပြီးနောက် လျှို့ဝှက်မှုမဲ့
`AliasSetupPlanRequestV1` Domain အတွက် ရည်ရွယ်ချက်နဲ့ Declarative Planner ကိုသုံးပါ။

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

အတွက် Minamoto, အဓိကရည်ရွယ်ချက်နဲ့ အစီအစဉ်ကို သီးခြားထုတ်လုပ်ပြီး အတည်ပြုပါ။
၎င်းတို့ရဲ့ သံကြိုး၊ အာဏာ၊ အသက်ရှင်နေထိုင်မှု ခလုတ်နဲ့ နောက်ဆုံးရက်ကို ချည်နှောင်ထားပြီး
Taira အစီအစဉ်ကို မတိုးမြှင့်နိုင်၊ ပြန်လည်ကစားလို့မရ:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Account aliases တွေမှာ data space အဆက်ကိုပဲ သုံးပါတယ်။

```text
alice@apps.universal
alice@universal
```

ကန့်သတ်မှတ်ချက်ကွင်းများတွင် Canonical ကိုအသုံးပြုနေဆဲဖြစ်သည်။ I105 အကောင့် IDs. အမည်မဖော်လိုသူတွေကို ကုသပါ။
လူသားတွေ ဖတ်လို့ရတဲ့ အချိတ်အဆက်တွေအဖြစ် ကနွန်နစ် မှတ်တမ်းကို ဖြေရှင်းပေးတယ်။ IDs.

## ၈. ဒေတာနေရာသစ်တစ်ခုပေးခြင်း {#_8-provision-a-new-dataspace}

ဒေတာနေရာသစ်တစ်ခုဟာ လုပ်ငန်းရှင်နဲ့ အုပ်ချုပ်မှု ပြောင်းလဲမှုပါ။ Torii
endpoint က traffic ကို configured data spaces သို့ route လုပ်နိုင်ပေမဲ့ reject လုပ်ပေးမှာပါ။
မသိတဲ့ ဒေတာနေရာ အမည်မဖော်လိုပါ။

ပြင်ဆင်ရန် မတိုင်ခင် လက်ရှိ Live Catalogue ကို ရိုက်ကူးပါ

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Operator account အတွက်လည်း lane manifest post ကို စစ်ဆေးပါ

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

လမ်းကြောင်းမပါက အမည်သစ်ကို မကြော်ငြာပါနဲ့ ID, ဒေတာနေရာ ID, validator set ကို
fault tolerance, manifest, routing စည်းမျဉ်းများနှင့် လုပ်ငန်းပိုင်ရှင်များ
လိုအပ်တဲ့ ခွင့်ပြုချက်တွေနဲ့ သာမန် အသုံးပြုသူ အကောင့်က
ဒေသတစ်ခုရယူပြီး ၎င်း၏ SNS လက်ရှိ ဒေတာနေရာတစ်ခုအတွင်းက ငှားရန်
alias Planner ဆိုတာက လူသိရှင်ကြား ဒေတာနေရာသစ်ကို လုံခြုံစွာ မဖြည့်နိုင်ပါဘူး။

ပုဂ္ဂလိက (သို့) အဖွဲ့အစည်းဆိုင်ရာ ဒေတာနေရာအတွက်၊ အောက်ပါအတိုင်း စာရင်းအပြောင်းအလဲကို ပြင်ဆင်ပါ။

- ထူးခြားတဲ့ ဒေတာနေရာ အမည်နဲ့ ကိန်းဂဏန်း `id`
- လမ်းကြောင်းဝင်ပေါက်နဲ့ သက်ဆိုင်တဲ့လမ်းကြောင်း သို့မဟုတ် ရှိနေတဲ့လမ်းကြောင်းတာဝန်
- ဒေတာနေရာ `fault_tolerance`
- ဆင်းသက်သင့်တဲ့ ညွှန်ကြားချက်များ (သို့) အကောင့်အကွာအဝေးများအတွက် လမ်းညွှန်စည်းမျဉ်းများ
  အဲဒီမှာ
- Space Directory Manifesto (သို့) ညီမျှတဲ့ ဖြန့်ချိမှု အထောက်အထားတစ်ခု၊
  ဒေတာအကွာအဝေး UAID စွမ်းဆောင်ရည်များ
- Validator, compliance, settlement နဲ့ monitoring အတွက် အုပ်ချုပ်မှု ခွင့်ပြုချက်
  မူဝါဒ

စစ်ဆေးလို့ရတဲ့ Config အပိုင်းအစက ဒီလိုပါ။

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

- `irohad --sora --config <config.toml> --trace-config` အပိုဒ်များ
  ဖြေရှင်းသော node configuration
- ဖန်တီးထားသော (သို့) ပြန်လည်သုံးသပ်ထားသည့် စာရင်းကို hash နှင့် လက်မှတ်များဖြင့် သိမ်းဆည်းထားသည်။
- မီးခိုးစမ်းသပ်ချက်တွေက ဆက်ပြီး Taira ဘယ်အချိန်မဆို Minamoto မြှင့်တင်ခြင်း
- အပြောင်းအလဲ နောက်ပိုင်း `/status` စာရင်းမှာ ရည်ရွယ်ထားတဲ့ လမ်းကြောင်းနဲ့ ဒေတာနေရာကို ပြသထားတယ်။
- `iroha app nexus lane-report --summary` ပျောက်ဆုံးနေတာကို မပြောဆိုပါ
  ပြဌာန်းချက်များ

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

အလားတူ ဒေတာအကွာအဝေးကို Minamoto နောက်မှသာ Taira တပ်ဆင်ရေး၊
မီးခိုးစမ်းသပ်မှု၊ စောင့်ကြည့်မှုနဲ့ အုပ်ချုပ်မှု အထောက်အထားတွေ ပြီးစီးတယ်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [တပ်ဆင်ခြင်း Iroha 3](/my/get-started/install-iroha.md)
- [လုပ်ဆောင်မှု Iroha 3 အပြင် CLI](/my/get-started/operate-iroha-via-cli.md)
- [ပုဂ္ဂလိက ဒေတာနေရာအတွက် ထောက်ပံ့မှု အခွန်များ](/my/get-started/private-dataspace-fee-sponsor.md)
- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
- [Genesis ကို ရည်ညွှန်းချက်](/my/reference/genesis.md)
