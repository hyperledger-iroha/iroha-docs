---
translation_locale: my
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii နောက်ဆုံးအချက်များ {#torii-endpoints}

Torii အဲဒါက HTTP, SSE, နှင့် WebSocket ဂိတ်တံခါး Iroha 3. နှစ်ခုစလုံးအတွက် အကျိုးရှိပါတယ်
စာရင်းအင်းကို မျက်နှာမူ APIs ပြီးတော့ အော်ပရေတာအဆုံးမှတ်တွေပေါ့။

လက်ရှိ စည်းမျဉ်းစည်းကမ်းများမှာ-

- Canonical binary format ကတော့ **Norito**
- အဆုံးအဖြတ်များစွာကလည်း ထောက်ပံ့ JSON သင်ပို့တဲ့အခါ `Accept: application/json`
- မက်ထရစ်များကို Prometheus ပုံစံဖြင့် ဖော်ပြထားသည်

ပုံစံ အသေးစိတ်၊ အကြောင်းအရာ ညှိနှိုင်းမှု၊ စီမံကိန်း အလံများ၊ စခီမာ ဟက်ရှ်များနှင့်
Norito RPC လမ်းညွှန်ချက်၊ [Norito ရည်ညွှန်းချက်](/my/reference/norito.md).

## တူညီသော အဆုံးသတ်ချက်များ {#common-endpoints}

| အဆုံးသတ်ချက် | ပုံစံထုတ်ခြင်း | ရည်ရွယ်ချက် |
| --- | --- | --- |
| `POST /transaction` | Norito | လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှု တင်ပြပါ |
| `POST /query` | Norito | လက်မှတ်ထိုးမေးမြန်းမှုတင်ပါ |
| `GET /events` | WebSocket | Event Streams ကို Subscribe လုပ်ပါ။ |
| `GET /block/stream` | WebSocket | ချုပ်ဆိုထားသော ဘလော့များ |
| `GET /peers` | JSON | အထက်ပါစာရင်းကို ဖော်ပြထားသည် Torii |
| `GET /health` | JSON | သက်ရှိမှုအဆုံးသတ်ချက် |
| `GET /api_version` | JSON | အလိုအလျောက် API မူကွဲ |
| `GET /status` | JSON | လုပ်ငန်းရှင်များအတွက် အဆင့်မြင့် အခြေအနေ အကျဉ်းချုပ် |
| `GET /metrics` | Prometheus | Prometheus scrape အဆုံးမှတ် |
| `GET /schema` | JSON | node ကပြတဲ့ Data Model Schema snapshot ကို |
| `GET /openapi` ဒါမှမဟုတ် `GET /openapi.json` | JSON | OpenAPI Active အတွက် စာရွက်စာတမ်း Torii HTTP လမ်းကြောင်းများ |
| `GET /v1/parameters` | JSON | Node Parameters snapshot ကို ရိုက်ကူးရန် |
| `GET /v1/node/capabilities` | JSON | Node အရည်အသွေးနှင့် ဒေတာပုံစံ metadata |
| `GET /v1/api/versions` | JSON | ထောက်ပံ့မှု Torii API မူကွဲများ |
| `GET /v1/events/sse` | SSE | သက်တမ်းရှည်သော ဖောက်သည်များအတွက် ဖြစ်ရပ်စီးကြောင်း |
| `GET /v1/time/now` | JSON | Node နံရံနာရီ snapshot ကို |
| `GET /v1/time/status` | JSON | အချိန်ကို synchronization အခြေအနေ |

`/openapi` Running node အတွက် အတည်ပြုတဲ့ Endpoint စာရင်းပါ။
မျက်နှာပြင်က build features နဲ့ runtime configuration တွေကို မှီခိုပြီး ဒီလိုမျိုး ထုတ်လုပ်ပေးထားတာပါ။
ဖောက်သည်တွေက Live ကို ပိုနှစ်သက်သင့်ပါတယ်။ OpenAPI လမ်းကြောင်းစာရင်းကို လက်နဲ့ကူးယူထားတဲ့ စာရွက်စာတမ်းပါ။
သုံးပါ [Torii API ကွန်စောလ်](/my/reference/torii-api-console.md) ဒါကို တိုက်ရိုက်တင်ဖို့
စာရွက်စာတမ်း၊ စမ်းသပ်မှု JSON လမ်းကြောင်းများ၊ ပုံတူ curl တောင်းဆိုချက်များနှင့် client code များကို
လက်ရှိ အစီအစဉ်ပါ။

## Live ကို စမ်းကြည့်ပါ။ Taira လမ်းကြောင်းများ {#try-live-taira-routes}

အများပြည်သူ Taira testnet က အလားတူ Torii JSON application ကို surface လုပ်ပေးခြင်း
စာဖတ်လို့ရတဲ့ ရှာဖွေရေးအတွက် သုံးတဲ့ client တွေပါ။ ဒီ commands တွေမှာ key မလိုပါဘူး။

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

လက်ရှိကမ္ဘာ့အခြေအနေကို စမ်းကြည့်ပါ။

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

အများသုံး စမ်းသပ်ရေးကွန်ရက်လမ်းကြောင်း ပြန်လာရင် `502`, အချိန်ထုတ်တာ (သို့) ကျေနပ်တဲ့
queue ကို endpoint availability ပြဿနာတစ်ခုအဖြစ်သုံးပြီး နောက်ပိုင်းမှာပြန်ကြိုးစားပါ။
ခင်ဗျားရဲ့ Client Code ကို Debug လုပ်နေတာပါ။

## သဘောတူညီချက်နှင့် Runtime အဆုံးသတ်မှတ်ချက်များ {#consensus-and-runtime-endpoints}

| အဆုံးသတ်ချက် | ပုံစံထုတ်ခြင်း | ရည်ရွယ်ချက် |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | မကြာသေးမီက ကတိပြုချက်များ |
| `GET /v1/sumeragi/validator-sets` | JSON | Validator Set သမိုင်း |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | အချိုးအမြင့်မှာ သတ်မှတ်ထားတဲ့ validator |
| `GET /v1/sumeragi/status` | Norito ဒါမှမဟုတ် JSON | အသေးစိတ် သဘောတူညီချက်အခြေအနေ snapshot |
| `GET /v1/sumeragi/status/sse` | SSE | ဆက်တိုက် သဘောတူညီချက်အခြေအနေစီးကြောင်း |
| `GET /v1/sumeragi/leader` | JSON | လက်ရှိ ခေါင်းဆောင် သတင်းအချက်အလက်များ |
| `GET /v1/sumeragi/qc` | Norito ဒါမှမဟုတ် JSON | နောက်ဆုံး Quorum Certificate အနှစ်ချုပ် |
| `GET /v1/sumeragi/checkpoints` | JSON | သဘောတူညီချက် စစ်ဆေးရေးမှတ်တိုင် အကျဉ်းချုပ် |
| `GET /v1/sumeragi/consensus-keys` | JSON | Active Consensus Key များ |
| `GET /v1/sumeragi/bls_keys` | JSON | တက်ကြွမှု BLS သဘောတူညီချက် အချက်များ |
| `GET /v1/sumeragi/phases` | JSON | နောက်ဆုံးအဆင့်တစ်ခုချင်း latency နမူနာ |
| `GET /v1/sumeragi/rbc` | JSON | RBC session နဲ့ throughput metrics တွေ |
| `GET /v1/sumeragi/rbc/sessions` | JSON | တက်ကြွမှု RBC အစည်းအဝေး snapshot |
| `GET /v1/sumeragi/pacemaker` | JSON | နှလုံးခုန်စက် အခြေအနေ |
| `GET /v1/sumeragi/params` | JSON | လက်ရှိအဆက်ဆက် Sumeragi ပမာဏများ |
| `GET /v1/sumeragi/collectors` | JSON | Deterministic Collector Plan snapshot ကို ရိုက်ယူရန် |
| `GET /v1/sumeragi/key-lifecycle` | JSON | သဘောတူညီချက် အဓိက သက်တမ်း စက်ဝန်းအခြေအနေ |
| `GET /v1/sumeragi/telemetry` | JSON | Consensus telemetry snapshot ကို ရိုက်ယူရန် |
| `GET /v1/sumeragi/evidence` | JSON | အတည်ပြုချက် မှတ်တမ်းများ၊ မေးမြန်းမှု string ဖြင့် ရွေးချယ်ပြီး စစ်ဆေးထားသည် |
| `GET /v1/sumeragi/evidence/count` | JSON | အထောက်အထား မှတ်တမ်းအရေအတွက် |
| `POST /v1/sumeragi/evidence/submit` | JSON | သဘောတူညီမှု အထောက်အထား တင်ပြခြင်း |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito ဒါမှမဟုတ် JSON | ကတိပေးခြင်း QC Block hash အတွက် မှတ်တမ်း |
| `GET /v1/runtime/abi/active` | JSON | တက်ကြွတဲ့ ပြေးဆွဲချိန် ABI သရုပ်ဖော်ချက် |
| `GET /v1/runtime/abi/hash` | JSON | တက်ကြွတဲ့ ပြေးဆွဲချိန် ABI ဟက်ရှ် |
| `GET /v1/runtime/metrics` | JSON | Runtime မက်ထရစ်များ snapshot |
| `GET /v1/runtime/upgrades` | JSON | Runtime အတိုးမြှင့်စာရင်း |
| `POST /v1/runtime/upgrades/propose` | JSON | Runtime upgrade ကို အဆိုပြုပါ |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | အဆိုပြုထားသော runtime upgrade ကို Activate လုပ်ပါ။ |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | အဆိုပြုသော runtime upgrade ကို ဖျက်သိမ်းပါ |

## App နှင့် SORA လမ်းကြောင်း မိသားစုများ {#app-and-sora-route-families}

ဘယ်အချိန်မှာ Torii app ကို မျက်နှာပြု feature set နဲ့ တည်ဆောက်ထားပြီး နောက်ထပ်အချက်အလက်တွေကို ဖော်ပြပေးပါတယ်။ JSON
စူးစမ်းရှာဖွေသူတွေအတွက် မိသားစုတွေ၊ SORA ဝန်ဆောင်မှုတွေ၊ တံတားစီးဆင်းမှု၊ အထောက်အထားနဲ့ သိုလှောင်ခြင်း
မိသားစုတွေအားလုံးဟာ ကွန်ရက် ပရိုဖိုင်တိုင်းမှာ မဖွင့်နိုင်ပါဘူး။

| လမ်းကြောင်း မိသားစု | ရည်ရွယ်ချက် |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON စာဖတ်သူ၊ မေးမြန်းရေး အကူအညီပေးသူ၊ Onboarding အကူအညီ ပေးသူနှင့် Portfolio သို့မဟုတ် holder views |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT, လက်တွေ့ကမ္ဘာက အရင်းအမြစ်များနှင့် လျှို့ဝှက်အရင်းအမြစ်အမြင် |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | နာမည်၊ အမည်မဖော်လိုသူနှင့် မှတ်သားရေး ကိန်းဂဏန်း |
| `/v1/explorer/*` | Explorer-oriented account, asset, block, transaction, instruction, metric, and stream views များကို ကြည့်ရှုခြင်း |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | ငွေလဲလှယ်မှု သမိုင်း၊ ရေငွေ့လိုင်း ပြန်လည်ထူထောင်ခြင်း (သို့) အခြေအနေ ISO 20022 အကူအညီပေးသူများ |
| `/v1/contracts/*` | Contract code, deploy, bundle, call, view, event, activity, rollup နဲ့ state routes တွေကို အသုံးပြုဖို့ |
| `/v1/multisig/*`, `/v1/controls/*` | Multisig အဆိုပြုချက်များ၊ ခွင့်ပြုချက်များနှင့် လွှဲပြောင်းထိန်းချုပ်မှု အကူအညီများ |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | အဆုံးသတ်ချက်၊ ပြည်နယ်သက်သေ၊ ပိတ်ဆို့မှုသက်သေ၊ သက်သေခံ ထိန်းသိမ်းခြင်းနှင့် သက်သေခံမေးမြန်းမှု လမ်းကြောင်းများ |
| `/v1/da/*` | ဒေတာရရှိနိုင်မှုသုံးစွဲမှု၊ မော်နီဖစ်များ၊ သက်သေပြရေး မူဝါဒများ၊ ကတိပေးချက်များနှင့် ပင်မရည်ရွယ်ချက်များ |
| `/v1/zk/*` | ZK အမြစ်၊ သက်သေခံ စစ်ဆေးမှု IVM အထောက်အထား၊ မဲစာရင်း၊ စစ်ဆေးရေး သော့များ၊ သက်သေခံ မှတ်တမ်းများနှင့် လက်တွဲပစ္စည်းများ |
| `/v1/gov/*`, `/v1/ministry/*` | အုပ်ချုပ်ရေး အဆိုပြုချက်များ၊ မဲစာရင်းများ၊ ကောင်စီနိုင်ငံတော်၊ ကာကွယ်ထားသော နာမည်နေရာများ၊ အစီအစဉ် အဆိုပြုချက်၊ ဥပဒေချမှတ်ခြင်းနှင့် နောက်ဆုံးသတ်မှတ်ခြင်း |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus lane, data space နဲ့ cross-chain proof အကူအညီတွေ |
| `/v1/musubi/*` | Musubi package register ကိုဖတ်ပြီး ညွှန်ကြားချက် ဆောက်လုပ်သူ |
| `/v1/subscriptions/*` | စာရင်းသွင်းခြင်း အစီအစဉ်များ၊ စာရင်းသွင်းမှု သက်တမ်းပတ်ဝန်းကျင်၊ အသုံးပြုမှု၊ အကူအညီပေးသူများကို စရိတ်ကောက်ခံခြင်း |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS ဝန်ဆောင်မှုပေးသူ ရှာဖွေမှု၊ စွမ်းအားသက်သေ၊ ပိုက်ချိတ်ခြင်း၊ သိုလှောင်ရေးယူခြင်းများနှင့် အများပြည်သူပါဝင်မှုကို ပို့ဆောင်ခြင်း |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud ဝန်ဆောင်မှု သက်တမ်းပတ်ဝန်းကျင်၊ ပုဂ္ဂလိက ကွန်ပျူတာ/မော်ဒယ်စီးကြောင်းများ၊ အများပြည်သူ ရှာဖွေတွေ့ရှိခြင်းနှင့် ဟိုတယ် အက်ပ်များကို လမ်းညွှန်ပေးခြင်း |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha ဆက်သွယ်မှု အစည်းအဝေးများ၊ WebSocket သယ်ယူပို့ဆောင်ရေး VPN အစည်းအဝေးများ၊ ပရိုဖိုင်များနှင့် လက်မှတ်များ |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | App ကို API ချည်နှောင်ခြင်းနှင့် ပူးပေါင်းခြင်း/CID- backed content routing |
| `/v1/operator/*`, `/v1/mcp` | Operator ကို စစ်ဆေးခြင်းနှင့် native MCP JSON-RPC တံတား |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | အွန်လိုင်းပြင်ဆင်မှု, မှတ်ပုံတင်သဘောတူညီချက်များ, ဒေတာဇယားထုတ်ပြန်ချက်များ [RAM-LFE အကူအညီပေးသူများ](/my/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | ပူးပေါင်းဆောင်ရွက်မှု၊ webhook၊ push အသိပေးချက်များနှင့် တိုက်ရိုက် telemetry ပေါင်းစည်းခြင်း |

## ISO 20022 တံတား {#iso-20022-bridge}

Torii အဖြဲ႕အစည္းက ISO 20022 တံတားအောက် `/v1/iso20022/*` app ကို ဦးတည်တဲ့အခါ
API တံတားက ရည်ရွယ်ချက်ရှိပြီး
ယေဘုယျ ရည်ရွယ်ချက်မရှိ ISO 20022 clearing gateway ကို support လုပ်ထားပေမယ့်
ရွေးချယ်ထားသော ငွေပေးချေမှု သတင်းအချက်အလက်များကို လက်မှတ်ထိုးခြင်း Iroha ငွေလွှဲပြောင်းခြင်းနှင့် ခြေရာခံခြင်း
သူတို့ရဲ့ စာရင်းအင်းအခြေအနေပါ။

### Torii ISO 20022 အဆုံးသတ်မှတ်ချက်များ {#torii-iso-20022-endpoints}

| နည်းစနစ်နှင့် အဆုံးသတ်မှတ်ချက် | ရည်ရွယ်ချက် |
| --- | --- |
| `POST /v1/iso20022/pacs008` | တင်ပြပါ FI- အင်း...FI ဖောက်သည်များအတွက် ငွေချေးလွှဲပြောင်းခြင်းနှင့် ကိုက်ညီမှု တည်ဆောက်ခြင်း Iroha အရင်းအမြစ်လွှဲပြောင်းမှု |
| `POST /v1/iso20022/pacs009` | တင်ပြပါ FI- အင်း...FI ငွေလွှဲပြောင်းမှု PvP သို့မဟုတ် စာရင်းအင်းများနှင့် သက်ဆိုင်သော ငွေကြေးထောက်ပံ့မှု |
| `POST /v1/iso20022/pacs002` | ငွေပေးချေမှုအခြေအနေ အစီရင်ခံစာ တင်ပြပါ |
| `POST /v1/iso20022/pacs004` | ငွေပေးချေမှု ပြန်လည်တင်သွင်းခြင်း |
| `POST /v1/iso20022/camt056` | ငွေပေးချေမှု ဖျက်သိမ်းရန် တောင်းဆိုချက် တင်ပြပါ |
| `POST /v1/iso20022/sese023` | ငွေကြေးဆိုင်ရာ စာရင်းပေးချေမှု ညွှန်ကြားချက် ပေးပို့ခြင်း |
| `POST /v1/iso20022/sese024` | တန်ဖိုးထားငွေပေးချေမှုအခြေအနေသတင်းစာကိုတင်သွင်းပါ |
| `POST /v1/iso20022/sese025` | ငွေကြေးဆိုင်ရာ စာရင်းပေးချေမှု အတည်ပြုချက် တင်သွင်းခြင်း |
| `POST /v1/iso20022/colr012` | အာမခံ အစားထိုးမှု သတင်းစာပို့ခြင်း |
| `GET /v1/iso20022/messages/{msg_id}` | စာတိုတစ်ပုဒ်အတွက် ကနွန်နစ် တံတား မှတ်တမ်းကို ဖတ်ပါ။ |
| `GET /v1/iso20022/audit/messages` | အမှားအယွင်းဖြစ်ကြောင်း သက်သေပြတဲ့ သတင်းစာ စစ်ဆေးမှု မှတ်တမ်းကို ဖတ်ပါ။ |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | လက်ရှိငွေပေးချေမှုအခြေအနေကို `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | လက်ရှိငွေပေးချေမှု ပြန်လည်ထုတ်ပြန်ချက်ကို `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | လက်ရှိ ဖျက်သိမ်းမှု ဆုံးဖြတ်ချက်ကို `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | လက်ရှိ ငွေပေးချေမှု အခြေအနေကို `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | လက်ရှိ ငွေပေးချေမှု အတည်ပြုချက်ကို `sese.025` XML |

`pacs.008` တင်ပြချက်တွေက သတင်းအချက်အလက်ကို ပေးပို့ရမယ်။ ID, ဘဏ်အချင်းချင်း ငွေပေးချေမှု
ငွေကြေး၊ ငွေကြေးငွေ၊ ဖြေရှင်းရက်၊ ချုပ်ဆိုသူနှင့် ချေးယူသူ IBANs, ချေးငွေရှင်နဲ့
ချေးငွေပေးချေသူ BICs. Reference data တွေကို configured လုပ်တဲ့အခါ bridge ကလည်း
BIC, IBAN, နှင့် ISO 4217 ငွေကြေးဖြတ်သန်းမှုများကို ထုတ်ပေးမည့် ငွေချေးမှု
ဘိုက်လိုင်းထဲကို ဝင်ပါတယ်။

`pacs.009` တင်ပြချက်တွေဟာ စီးပွားရေး သတင်းစကားကို ပေးပို့ရမှာပါ။ ID, သတင်းစကား အဓိပ္ပါယ်ဖွင့်ဆိုချက်
ID, ဖန်တီးချိန်၊ ဘဏ်အချင်းချင်းဖြေရှင်းမှု ပမာဏ၊ ငွေကြေးငွေ၊ ဖြေရှင်းရက်
ညွှန်ကြားချက်ပေးသူနှင့် ညွှန်ပြထားသော အရာရှိ BICs, ချေးငွေရှင်နဲ့ ငွေပေးချေသူ IBANs. (သို့)
စာတိုထဲတွင် ပါဝင်သည် `Purp`, တံတားက လက်ရှိတွင် ငွေကြေးထောက်ပံ့မှုများကို လက်ခံထားရသည်။
သာ: `Purp=SECU`.

နိုင်ငံခြားရေး `pacs.008` နှင့် `pacs.009` တင်ပြမှု အဆုံးအသတ်မှတ်ချက်များ လက်ခံ XML ISO စာအိတ်များ သို့မဟုတ်
တံတား စမ်းသပ်မှုတွေမှာ အသုံးပြုတဲ့ ပကတိ ကွင်းပုံစံပါ။ `SplmtryData` ကွင်းများ
ပစ်မှတ်ကို ချိတ်နိုင်တယ် Iroha စာရင်းအင်း၊ အရင်းအမြစ်နှင့် ရည်မှန်းချက်စာရင်း IDs (သို့) လိပ်စာများ
အရင်းအမြစ် သတ်မှတ်ချက် ID. အဖြေက `202 Accepted` နှင့်အတူ `message_id`,
`transaction_hash`, `status`, `pacs002_code`, ပြီးဆုံးသွားတဲ့
စာရင်းအင်း/စာရင်း/လက်ဝယ် အခြေအနေ။

### နောက်ထပ် Parser နှင့် Mapping Support ကို {#additional-parser-and-mapping-support}

နိုင်ငံခြားရေး IVM ISO အကူအညီပေးသူက အောက်ပါ သတင်းစကားကိုလည်း အတည်ပြုပြီး ရုပ်လုံးဖေါ်တယ်။
စာအိတ်ကို အတည်ပြုဖို့၊ နေရာချထားမှု မြေပုံထုတ်ဖို့ (သို့) နောက်ဆက်တွဲအတွက် မိသားစုများ
ငြိမ်းချမ်းရေးဆိုတာ သူတို့မှာ သီးသန့်မရှိဘူး။ Torii လမ်းကြောင်းတွေပေါ့။

| စာတို မိသားစု | လက်ရှိထောက်ပံ့မှု |
| --- | --- |
| `head.001` | လုပ်ငန်းလျှောက်လွှာ ခေါင်းစဉ်ကို အတည်ပြုခြင်း ISO အိတ်အဖုံးများ `BizMsgIdr`, `MsgDefIdr`, ဖန်တီးမှု အချိန်နှင့် ရွေးချယ်စရာ ပေးပို့သူ/လက်ခံသူ BIC ကွင်းများ |
| `pacs.007`, `pacs.028`, `pacs.029` | ငွေပေးချေမှု ပြန်လည်ကောက်ခံခြင်း၊ အခြေအနေတောင်းဆိုခြင်းနှင့် စုံစမ်းစစ်ဆေးရေး ဖြေရှင်း/အခြေအနေ စစ်ဆေးခြင်း |
| `pain.001`, `pain.002` | Customer payment initiation နှင့် ငွေပေးချေမှုအခြေအနေ အစီရင်ခံစာကို validation |
| `camt.052`, `camt.053`, `camt.054` | စာရင်းအင်း အစီရင်ခံစာ၊ ထုတ်ပြန်ချက်နှင့် အကြောင်းကြားချက် အတည်ပြုချက် |

## Kaigi အစည်းအဝေး {#kaigi-sessions}

Kaigi ငွေပေးချေပြီး အချိန်နှင့်တပြေးညီ အသံ/ဗီဒီယိုခန်းများ ပေးသွင်းခြင်း SORA Nexus. ဒါကို သုံးတဲ့အခါ
အပ်လီကေးရှင်းတစ်ခုအတွက် Ledger-backed session creation, roster changes, relay လိုပါတယ်။
အမည်စာရင်းများ၊ ကုဒ်သွင်းထားတဲ့ အချက်ပြမှုများနှင့် အသုံးပြုမှု တိုင်းတာချက်များကို
နိုင်ငံခြားကွန်ဖရင့်ချိတ်ဆက်ခြင်း။

စာရင်းအင်းကို ဦးတည်တဲ့ သက်တမ်း စက်ဝန်းက-

- `CreateKaigi`: Domain တစ်ခုအောက်မှာ Call လုပ်ပြီး ၎င်းရဲ့ Policy ကို သိမ်းထားပါ။
  အစီအစဉ်၊ metadata နဲ့ ရွေးချယ်စရာ Relay Manifesto
- `JoinKaigi` နှင့် `LeaveKaigi`: ဖုန်းခေါ်ဆိုမှု စာရင်းကို update လုပ်ပါ။
  ပါဝင်သူများက ကတိပေးချက်များ၊ ဖျက်သိမ်းမှု မှတ်တမ်းများနှင့် စာရင်းသက်သေများကို အသုံးပြုကြသည်။
  အခန်းကဏ္ဍဝင်စာရင်း IDs တိုက်ရိုက်ပါ။
- `RecordKaigiUsage`: ရေတွက်ထားတဲ့အသက်တမ်းနဲ့ ဓာတ်ငွေ့ စုစုပေါင်းကို ထည့်သွင်းပါ။
- `EndKaigi`: အစည်းအဝေးကို ပိတ်ပြီး နောက်ဆုံး အချိန်တံဆိပ်ကို မှတ်တမ်းတင်ပါ။

Torii Relay telemetry ကို `/v1/kaigi/relays`,
`/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, နှင့်
`/v1/kaigi/relays/events` app ကိုသုံးတဲ့အခါ API telemetry feature တွေကို ဖွင့်ထားတယ်။
အစည်းအဝေးအခြေအနေကို Kaigi နယ်ပယ်ဖြစ်ရပ်များ
`KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, နှင့် `KaigiUsageSummary`.

### CLI ဆေးလိပ် စမ်းသပ်မှု {#cli-smoke-test}

စပြီး `iroha kaigi` CLI သင်ဟာ a ကို စစ်ဆေးချင်တဲ့အခါ Torii အဆုံးသတ်မှတ်ချက်
လက်ခံ Kaigi ငွေလဲလှယ်နှုန်းသမိုင်း UI. Quickstart command ကို
တက်ကြွတဲ့သူတွေအတွက် ယာယီအခန်းတစ်ခု ဖန်တီးတယ်။ Torii အဆုံးသတ်မှတ်ချက်နဲ့ အကျဉ်းချုပ်ကို ရိုက်နှိပ်တယ်။
ဖုန်းခေါ်ဆိုမှု မှတ်သားချက်နှင့်အတူ Command ကို Join လုပ်ပြီး SoraNet Spool ကို ညွှန်ပြချက်:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

scripted စီးဆင်းမှုအတွက် အခန်းသက်တမ်း စက်ဝန်းကို ရှင်းလင်းစွာ စီမံခန့်ခွဲပါ။

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

အသုံးပြုခြင်း `--room-policy public` ကြည့်ရှုသူမရှိဘဲ Relay တွေက ပွင့်လင်းစေနိုင်တဲ့ အခန်းတွေအတွက်
လက်မှတ်များ သို့မဟုတ် `--room-policy authenticated` အပြင်ထွက်ဖို့ ကြည့်ရှုသူ လိုအပ်တဲ့အခါ
အတည်ပြုမှု `--privacy-mode zk-roster-v1` ကွန်ရက်က
ကော်မတီ Kaigi စာရင်းနှင့် အသုံးပြုမှု စစ်ဆေးရေး သော့များ ဖွဲ့စည်းထားသည်၊ အခြားနည်းဖြင့် ချိတ်ဆက်ခြင်း၊ အရွက်များ၊
ပြီးတော့ သီးသန့်သုံးစွဲမှု မှတ်တမ်းတွေဟာ deterministic verification လုပ်နေစဉ်မှာ ကျရှုံးနေတယ်။

### စမ်းသပ်ခြင်း JavaScript Demo {#testing-with-the-javascript-demo}

သုံးပါ
[soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript)
Desktop demo ကို end-to-end wallet စမ်းသပ်မှုအတွက်ပါ။ Demo က Electron နဲ့ Vue
တိုက်ရိုက် ဆက်သွယ်တဲ့ လျှောက်လွှာ Torii ဒေသတွင်း `@iroha/iroha-js`
အမိန့်ချမှတ်ချက် `/kaigi` browser-native media တစ်ခုမှတစ်ဆင့် လမ်းကြောင်း။

ဒီမိုကို သုံးပါ
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
ကနေ Iroha ရင်းမြစ် သိုလှောင်ခန်း။ demo pin တွေက SDK ဖြတ်သန်း
`file:../iroha/javascript/iroha_js`, ဒီတော့ ဒီညီမလေးမှာ နှစ်ခုစလုံးကို ထိန်းထားပါ။
စီစဉ်ပုံ:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

အသုံးပြုခြင်း Node.js (၂၀) သို့မဟုတ် ပိုသစ်ပြီး Rust toolchain ဆိုတော့ ဒေသခံ `iroha_js_host`
မော်ဂျူးကို တည်ဆောက်နိုင်တယ်၊ SDK ညီမလေးမှာ Iroha အပြောင်းအလဲပြီးနောက် စစ်ဆေးမှု
အရင်းအမြစ်။ သန့်ရှင်းတဲ့ package layout မှာ Cargo အလုပ်ခွင် မပါပါဘူး။
လိုအပ်ချက်များ `npm run build:native`.

ထိန်းချုပ်တဲ့ စမ်းသပ်မှုအတွက် demo ကို Kaigi- အရည်အချင်းရှိသူ Torii အဆုံးသတ်မှတ်ချက်:

1. စလုပ်ပါ Iroha node ကို SORA/Kaigi app ကို မျက်နှာမူ APIs activated, သို့မဟုတ် အသုံးပြုခြင်း
   အများပြည်သူအဆုံးသတ်မှတ်ချက်က Kaigi လိုအပ်တဲ့ မျက်နှာပြင်တွေပေါ့။
2. အခြေခံ လက်လှမ်းမီမှုကို စစ်ဆေးပါ `/health`, အဲဒီနောက်မှာ live route မျက်နှာပြင်ကို စစ်ကြည့်ပါ။
   နှင့်အတူ `/openapi` ဒါမှမဟုတ် `/openapi.json`. တစ်ချို့ တပ်ဆင်မှုတွေကလည်း
   `/v1/health`, ဒါပေမဲ့ `/health` ဒါကတော့ portable lifetime check ပါ။
3. အတွက် TAIRA, တိုက်ရိုက်တွေ့ဆုံမှု မလုပ်ခင် Relay Telemetry လမ်းကြောင်းတွေကို စစ်ဆေးပါ။

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   ဒီစစ်ဆေးချက်တွေက သက်သေပြတာက Torii နှင့် Kaigi Relay telemetry ကို ရောက်ရှိနိုင်ပါတယ်
   အစည်းအဝေးကို မဖွဲ့စည်းပါ။ `CreateKaigi` နှင့် `JoinKaigi` ငွေကြေးထောက်ပံ့မှု လိုအပ်နေဆဲ
   ငွေကြေးအိတ်တွေနဲ့ လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှု တင်ပြချက်။
4. ဒီမိုကို ဖွင့်လိုက်၊ **Settings များ**, set ကို Torii URL, app ကို load လုပ်ပေးပါ
   သံကြိုး ID အဆုံးမှတ်ကနေ ကွန်ရက် ကြိုတင်ကိန်းပါ။
5. ဒီမိုမှာ ဒေသခံ wallet နှစ်ခု ဖန်တီး (သို့) ပြန်လည်ထူထောင်ပါ။ သီးခြား app ပြတင်းပေါက်တွေသုံးပြီး
   ပရိုဖိုင်တွေ၊ ဒါမှမဟုတ် စက်တွေဆိုတော့ အိမ်ရှင်နဲ့ ဧည့်သည်တို့ဟာ သီးခြား ငွေကြေးအခြေအနေ ရှိတယ်။

စမ်းသပ်ဖို့ Kaigi UI:

1. အိမ်ရှင် ပြတင်းပေါက်မှာ ဖွင့်ထားတယ်။ **Kaigi**, ရွေးချယ်ခြင်း **အစည်းအဝေးကို စတင်ပါ။**, ခေါင်းစဉ်တစ်ခု သတ်မှတ်ပါ။
   ရွေးချယ်ဖို့ **ပုဂ္ဂလိက ဖိတ်ကြားချက်** ဒါမှမဟုတ် **ပွင့်လင်းမြင်သာသော ဖိတ်ကြားချက်**.
2. ရွေးချယ်ခြင်း **ကင်မရာနဲ့ မိုက်ခရိုဖုန်းကို ဖွင့်လိုက်ပါ** ဒီတော့ WebRTC ဒေသတွင်း မီဒီယာတွေ ရှိတယ်။
3. ရွေးချယ်ခြင်း **အစည်းအဝေးကို link လုပ်ပါ**. Live Wallet က တင်ပြထားပါတယ် `CreateKaigi`; ကော်မတီ
   app ကတော့ `iroha://kaigi/join?call=...&secret=...` ဖိတ်ကြားခြင်းနှင့်
   `#/kaigi?...` ကျဆင်းသွားတဲ့ လမ်းကြောင်းပါ။
4. အိမ်ရှင် ပြတင်းပေါက်ကို ဖွင့်ထားပြီး ဖိတ်စာကို ဧည့်သည်နဲ့ မျှဝေပါ။
5. ဧည့်သည် ပြူတင်းပေါက်တွင် ဖိတ်ကြားချက်ကိုဖွင့်ပါ (သို့) ထည့်သွင်းပါ **အစည်းအဝေးမှာ ပါဝင်ပါ**, လှည့်
   ဒေသတွင်းမီဒီယာများတွင် ရွေးချယ်ပါ **အစည်းအဝေးမှာ ပါဝင်ပါ**. အသက်ဝင်တဲ့ ငွေကြေးအိတ်က
   ကုဒ်သွင်းထားတဲ့ host ကမ်းလှမ်းချက် Torii တင်ပြချက် `JoinKaigi` ကုဒ်သွင်းထားသော
   metadata ကို ဖြေပါ။
6. အိမ်ရှင်က ပထမဆုံး အဖြေကို အလိုအလျောက် streaming (သို့) polling လုပ်ပြီး လျှောက်ထားသင့်ပါတယ်။ Kaigi
   ဖုန်းခေါ်ဆိုမှု အချက်ပြချက်များ။ ပြတင်းပေါက်နှစ်ခုစလုံးတွင် ချိတ်ဆက်ထားသော မီဒီယာများကို ပြသရန်နှင့်
   ဆက်သွယ်မှု အသေးစိတ်။
7. host ကနေ session ကို အဆုံးသတ်ဖို့ (သို့) CLI `iroha kaigi end` command ကို
   တူညီတဲ့ ဖုန်းခေါ်ဆိုမှု ID.

ပုဂ္ဂလိက Kaigi လိုအပ်ချက်များကို ကာကွယ်ပေးရန် XOR ပုဂ္ဂလိကဝင်ရောက်မှုမှတ်တိုင် အခွန်ကို ပေးဆောင်ရန်။
demo အစီရင်ခံစာများ Kaigi လိုအပ်ချက်များကို ကာကွယ်ပေးရန် XOR, app ထဲမှာ သုံးပါ။
Self-shield prompt လုပ်ပြီး Create (သို့) Join Action ကို ထပ်မံကြိုးစားပါ။
သီးသန့်ထောက်ပံ့မှု (သို့) တိုက်ရိုက်အချက်ပြမှုမရှိဘူးဆိုရင် demo က
ပွင့်လင်း/လက်ကိုင် စီးဆင်းမှုရှိပါက ဖွင့်ထားပါ။ **အဆင့်မြင့် အချက်ပြမှု**, ကော်ပီ
ရိုးရိုး ကမ်းလှမ်းချက် (သို့) အဖြေပက်ကတ်ကို အခြား ပြတင်းပေါက်ထဲထည့်ပါ။

demo repo မှာ အလိုအလျောက် စစ်ဆေးမှုအတွက် run:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

ဗဟိုပြုထားတဲ့ Vitest Suites cover ကို Kaigi အစည်းအဝေးကွန်ရက်ကို ဖန်တီးခြင်း၊ ဖိတ်ကြားမှု ညွှန်ကြားချက်
Loading, private create/join/end bridge calls, self-shield prompt များ၊ manual များ
ကျဆင်းမှုတွေ၊ စစ်တမ်းကောက်ယူခြင်းတွေနဲ့ UI မီးခိုးစမ်းသပ်မှုမှာ `/kaigi` လမ်းကြောင်း
Desktop နဲ့ mobile အရွယ်အစား viewports တွေမှာ Live media ကို wallet နှစ်ခုကြားက
browser camera/microphone ခွင့်ပြုချက်တွေကြောင့် manually two-window test လုပ်ဖို့လိုပါတယ်။
ပြီးတော့ peer media streams တွေဟာ ပတ်ဝန်းကျင်ကို သီးသန့် သတ်မှတ်ထားတယ်။

နမူနာပေါင်းစပ်ရေးကုဒ်အတွက် ကြည့်ပါ။
[ပူးပေါင်းခြင်း Kaigi a တွင် JavaScript App ကို](/my/guide/tutorials/kaigi.md).

## အခြေအနေနှင့် မက်ထရစ်များ {#status-and-metrics}

Status နဲ့ metrics endpoints တွေဟာ Dashboard ထဲမှာ ပထမဆုံး ထည့်သွင်းပေးရမယ့် အရာတွေပါ။

- `/status` အဆင့်မြင့် peer, block, queue နှင့် consensus fields များကို ဖော်ပြသည်
- `/metrics` Prometheus counters, gauges နဲ့ histograms တွေကို ဖေါ်ပြပေးပါတယ်။

အပေါ် Nexus-enabled node တွေ၊ status output မှာ lane နဲ့ data space- aware တွေလည်း ပါဝင်ပါတယ်။
အပိုင်းများ။ `nexus.enabled = false`, အဲဒီအပိုင်းတွေကို ချန်ထားတယ်။

## JSON ဆန့်ကျင် Norito {#json-vs-norito}

အော်ပရေတာအဆုံးမှတ်များစွာ ပြန်လာသည် Norito default က Endpoint ကို support လုပ်တဲ့အခါ
JSON, ပေးပို့ပါ

```http
Accept: application/json
```

ဒါက အထူးသဖြင့် အသုံးဝင်ပါတယ်။

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

အဆုံးမှတ်က လက်ခံတဲ့အခါ (သို့) ရိုက်တာပြန်တဲ့အခါ Norito တိုက်ရိုက် အသုံးပြုခြင်း
`application/x-norito` အကြောင်းအရာအမျိုးအစား (သို့) ဦးစားပေးအဖြစ် `Accept` တန်ဖိုးကို ကြည့်ပါ။
[Norito](/my/reference/norito.md#torii-and-norito-rpc) သယ်ယူပို့ဆောင်ရေး အသေးစိတ်အတွက်ပါ။

## တယ်လီမီထရီ Profiles {#telemetry-profiles}

အဆုံးမှတ်အမြင်က telemetry setting များအပေါ် မူတည်သည်။ Upstream Docs ကဖော်ပြသည်
အဆင့်ငါးခု:

| အမည်စာရင်း | `/status` | `/metrics` | ဆောက်လုပ်ရေး လမ်းကြောင်းများ |
| --- | --- | --- | --- |
| `disabled` | မဟုတ်ဘူး | မဟုတ်ဘူး | မဟုတ်ဘူး |
| `operator` | ဟုတ်ပါတယ် | မဟုတ်ဘူး | မဟုတ်ဘူး |
| `extended` | ဟုတ်ပါတယ် | ဟုတ်ပါတယ် | မဟုတ်ဘူး |
| `developer` | ဟုတ်ပါတယ် | မဟုတ်ဘူး | ဟုတ်ပါတယ် |
| `full` | ဟုတ်ပါတယ် | ဟုတ်ပါတယ် | ဟုတ်ပါတယ် |

## CLI ဖြတ်လမ်းများ {#cli-shortcuts}

နိုင်ငံခြားရေး `iroha` CLI အခုလို အဆုံးသတ်ချက်များစွာကို ချိတ်ဆက်ထားပြီးသားပါ။

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## မြင့်တက်သော ရည်ညွှန်းချက်များ {#upstream-references}

- [README API ပြီးတော့ လေ့လာနိုင်မှု အမြင်တစ်ခု](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 တံတား အကောင်အထည်ဖော်မှု](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md)
