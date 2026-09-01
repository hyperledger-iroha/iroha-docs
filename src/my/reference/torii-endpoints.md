---
translation_locale: my
translation_source: /reference/torii-endpoints.md
translation_source_hash: f04e5e78329996d70926c4fd5dc034d41605d0a82fffd6460f67b252269480d9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii API အဆုံးသတ်မှတ်ချက်များ {#torii-endpoints}

Torii အဲဒါက HTTP, SSE, နှင့် WebSocket ဂိတ်တံခါး Iroha 3. ၎င်းဟာ blockchain ledger နဲ့ တုံ့ပြန်ဆက်သွယ်မှု နှစ်ခုစလုံးအတွက် အသုံးဝင်ပါတယ်။ APIs လုပ်ငန်းရှင်များ API အဆုံးသတ်မှတ်ချက်များ။

လက်ရှိ စည်းမျဉ်းစည်းကမ်းများမှာ-

- Single protocol standard binary format ကို Norito လို့ သတ်မှတ်ထားပါတယ်။
- API အဆုံးမှတ်များစွာကလည်း JSON ကို ထောက်ပံ့ပေးပြီး `Accept: application/json` ပေးပို့တဲ့အခါမှာ
- metrics တွေကို Prometheus format မှာ ဖော်ပြထားပါတယ်

ပုံစံ အသေးစိတ်၊ အကြောင်းအရာ ညှိနှိုင်းမှု၊ စီစဉ်ချက် အလံများ၊ စကေမကာကွယ်ရေး hash များနှင့် Norito RPC လမ်းညွှန်ချက်များကို [Norito ကိုးကားချက်](/my/reference/norito.md) ကို ကြည့်ပါ။

## တူညီသော API အဆုံးသတ်မှတ်ချက်များ {#common-endpoints}

|API အဆုံးသတ်မှတ်ချက် |Format ကို |ရည်ရွယ်ချက်|
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions` |Norito |လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှု တင်ပြပါ |
|`POST /v1/query` |Norito |လက်မှတ်ထိုး မေးမြန်းချက် တင်ပါ |
|`GET /v1/events/ws` |WebSocket |Event streams ကို subscribe လုပ်ပါ |
|`GET /v1/events/sse` |SSE |SSE ကျော် Event Streams ကို Subscribe လုပ်ပါ။ |
|`GET /v1/blocks/stream` |WebSocket |နောက်ဆုံးသတ်မှတ်ထားတဲ့ blocks တွေကို Stream လုပ်ပါ။|
|`GET /v1/peers` |JSON |Torii မှ ထုတ်လွှင့်ထားသော ကွန်ရက်အချင်းချင်းစာရင်း |
|`GET /livez` |စာသား|လုပ်ငန်းစဉ်များအတွက်သာ သက်ဝင်မှုရှိသည်ဆိုပါစို့၊ ပရိုတိုကောလာ အသင့်ဖြစ်ခြင်း မဆိုလိုပါ။|
|`GET /readyz` |JSON |offline cash checks အပါအဝင် node အသင့်ရှိမှုပြည့်စုံခြင်း |
|`GET /health` |JSON |ပြင်ဆင်မှု စွန်ဒါနဲ့အတူတူ offline-cash invariant ကို |
|`GET /v1/api/version` |စာသား|လက်ရှိ Block Header ဗားရှင်းများ |
|`GET /status` |Norito သို့မဟုတ် JSON |အဆင့်မြင့် ရောဂါစစ်ဆေးမှုအခြေအနေ၊ JSON ကို ရှင်းလင်းစွာ တောင်းဆိုခြင်း |
|`GET /metrics` |Prometheus |Prometheus scrape API အဆုံးမှတ် |
|`GET /v1/schema` |JSON |Data-model schema point-in-time data view ကို node က activated လုပ်တဲ့အခါမှာ ပြသပေးပါတယ်။ |
|`GET /openapi.json` |JSON | OpenAPI တက်ကြွမှုအတွက် စာရွက်စာတမ်း Torii HTTP လမ်းကြောင်းများ                |
|`GET /v1/parameters` |JSON |Node Parameters Point-in-Time ဒေတာအမြင် |
|`GET /v1/node/capabilities` |JSON |Node အရည်အသွေးနှင့် ဒေတာပုံစံ metadata များ |
|`GET /v1/time/now` |JSON |Local node system clock point-in-time ဒေတာအမြင် |
|`GET /v1/time/status` |JSON |အချိန်ပေါင်းစပ်မှုအခြေအနေ |

SSE တောင်းဆိုချက်အတွက် ဒေသခံစီးကြောင်းကို ထပ်မံရိုက်ထည့်လိုက်တဲ့ ကျော့ပြန်မှုတစ်ခုနဲ့ ကြော်ငြာပါ။

```http
Accept: text/event-stream, application/json
```

Torii သည် ပထမဦးဆုံးအနေနဲ့ JSON သို့မဟုတ် Norito ကိုယ်စားပြုချက်ကို တောင်းဆိုမှု အလွှာတွင် ညှိနှိုင်းပြီးနောက် ဒေသခံ `text/event-stream` တုံ့ပြန်မှုကို အတည်ပြုသည်။ ထို့ကြောင့် `text/event-stream` ကိုသာ ပေးပို့ခြင်းသည် `406` ဖြင့် ပယ်ချခံရသည်။ [တိုက်ရိုက်ဖြစ်စဉ်များအတွက်နည်းပြချက်](/my/cookbook/stream-events.md) သည်အပြည့်အစုံသော ခေါင်းစဉ်ကိုအသုံးပြုသည်။

`/openapi.json` သည် schema တွင်ဖော်ပြထားသောလမ်းကြောင်းများအတွက်ထုတ်လုပ်သည့်စာချုပ်ဖြစ်ပြီး အပြည့်အဝ operational-probe စာရင်းမဟုတ်ပေ။ လက်ရှိစာရွက်စာတမ်းတွင် `/livez` နှင့် `/readyz` တို့ကိုဖယ်ရှားထားပြီး ၎င်း၏ `/health` သရုပ်ဖော်ချက်သည် အသင့်ဖြစ်မှုထိန်းချုပ်ရေးကိရိယာကိုနောက်ကျောနိုင်သည်။ တိုက်ရိုက်စာရွက်စာတမ်းမှ လမ်းကြောင်း client များကိုထုတ်လုပ်ပါ, ဒါပေမဲ့ Running node နှင့် pinned handleers ကိုတိုက်ရိုက်သက်ရောက်မှုနှင့်ပြင်ဆင်မှုကို validate လုပ်ပါ။ တိကျတဲ့မျက်နှာပြင်က build features တွေပေါ်မူတည်ပြီး [Torii API ကွန်ဆော](/my/reference/torii-api-console.md) ကိုသုံးပြီး live document ကို load လုပ်၊ JSON လမ်းကြောင်းတွေကို test လုပ်၊ curl request တွေကို copy လုပ်ပြီး လက်ရှိ schema ကနေ client code ကို generate လုပ်ပါ။

Catalog-backed တစ်ခုချင်းစီ OpenAPI လုပ်ဆောင်ချက်မှာ `x-iroha-route-auth` object ကို Catalogue မှထောက်ပံ့ထားသည် MCP ကိရိယာတွေက တူညီတဲ့ စာချုပ်ကို ဖော်ပြတယ်။ `_meta["iroha/routeAuth"]`. အဆိုပြုချက် နှစ်ခုစလုံးက `schemaVersion`, `stableRouteId`, `authentication`, နှင့် `admission`. ကုသမှုပုံစံ `1` တိကျတဲ့ စာချုပ်တစ်ခုအဖြစ်: ထောက်ခံမှုမရှိတဲ့ စာချုပ်ကို ငြင်းပယ်ခြင်း `schemaVersion` ၎င်းရဲ့ အထောက်အထား (သို့) လက်မှတ်ရေးထိုးတဲ့ တံဆိပ်တွေကို ဘယ်လို အဓိပ္ပါယ်ဖွင့်ရမယ်ဆိုတာ မှန်းဆတာအစားပါ။ လမ်းကြောင်း metadata က request နယ်နိမိတ်ကို သရုပ်ဖော်ပြီး အဲဒီနယ်နိမိတ်က တောင်းဆိုတဲ့ credentials တွေကို အစားထိုးပေးတာမဟုတ်ပါဘူး။

## Taira တိုက်ရိုက်လမ်းကြောင်းတွေကို စမ်းကြည့်ပါ။ {#try-live-taira-routes}

အများပြည်သူ Taira testnet သည် application clients များက read-only exploration အတွက် အသုံးပြုသော Torii JSON မျက်နှာပြင်ကိုပဲ ဖေါ်ပြပေးသည်။ ဤ commands များတွင် key များလိုအပ်ခြင်းမရှိပါ။

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

လက်ရှိကမ္ဘာအခြေအနေကို စမ်းကြည့်ပါ။

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

အများသုံး testnet လမ်းကြောင်းတစ်ခုက `502` ကိုပြန်ပို့ပေးပါက၊ အချိန်ထုတ်ပေးပါက (သို့) ပြည့်ဝတဲ့ queue တစ်ခုကို အစီရင်ခံပါက API အဆုံးမှတ်ရရှိမှုပြဿနာအဖြစ် ကုသပြီး client code ကို debug မလုပ်ခင် နောက်ပိုင်းတွင် ထပ်မံကြိုးစားပါ။

## သဘောတူညီချက်နှင့် ဆော့ဝဲ အကောင်အထည်ဖော်ရေး ပတ်ဝန်းကျင် API အဆုံးသတ်မှတ်ချက်များ {#consensus-and-runtime-endpoints}

အောက်ပါ Sumeragi လမ်းကြောင်းတိုင်းတွင် operator request လက်မှတ်ကိုလိုအပ်သည်။ အခြေအနေ၊ ရောဂါစစ်ဆေးမှု၊ စီးဆင်းမှု၊ ခေါင်းဆောင်၊ သော့၊ QC နှင့် ပမာဏလမ်းကြောင်းများအတွက်လည်း တယ်လီမီထရီစွမ်းဆောင်ရည်ရှိ build တစ်ခု လိုအပ်ပါသည်။

|API အဆုံးသတ်မှတ်ချက် |Format ကို |ရည်ရွယ်ချက်|
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
|`GET /v1/sumeragi/status` |Norito သို့မဟုတ် JSON |အာဏာပိုင် Reducer ပိုင်ဆိုင်သော သဘောတူညီချက်အခြေအနေ |
|`GET /v1/sumeragi/diagnostics` |JSON |မ authoritative software processing workflow, queue နဲ့ execution lane diagnostics တွေကို ပြုလုပ်ခြင်း |
|`GET /v1/sumeragi/status/sse` |SSE |Continuous authoritative consensus status stream ကို အတည်ပြုပေးခြင်း|
|`GET /v1/sumeragi/leader` |JSON |လက်ရှိ ခေါင်းဆောင် သတင်းအချက်အလက် |
|`GET /v1/sumeragi/qc` |Norito သို့မဟုတ် JSON |အမြင့်ဆုံးနှင့် ပိတ်ထားသော quorum-certificate point-in-time data views များ |
|`GET /v1/sumeragi/consensus-keys` |JSON |Active Consensus Key များ |
|`GET /v1/sumeragi/bls-keys` |JSON |Active BLS သဘောတူညီချက် သော့များ |
|`GET /v1/sumeragi/params` |JSON |လက်ရှိကွင်းဆက် Sumeragi သတ်မှတ်ချက်များ |
|`GET /v1/sumeragi/evidence` |JSON |အတည်ပြုချက် မှတ်တမ်းများ၊ ရွေးချယ်မှုအရ query string ဖြင့် filter လုပ်ထားသည် |
|`GET /v1/sumeragi/evidence/count` |JSON |အထောက်အထား မှတ်တမ်းအရေအတွက်|
|`GET /v1/runtime/abi/active` |JSON |တက်ကြွတဲ့ ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် ABI သရုပ်ဖော်ချက် |
|`GET /v1/runtime/abi/hash` |JSON |Active software execution environment ABI cryptographic hash |
|`GET /v1/runtime/metrics` |JSON |ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် မက်ထရစ်များ point-in-time ဒေတာမြင်ကွင်း |
|`GET /v1/runtime/upgrades` |JSON |ဆော့ဝဲ အကောင်အထည်ဖော်ရေး ပတ်ဝန်းကျင် အဆင့်မြှင့်တင်ခြင်း စာရင်း |
|`POST /v1/runtime/upgrades/propose` |JSON |ဆော့ဝဲ အကောင်အထည်ဖော်ရေး ပတ်ဝန်းကျင်ကို အဆင့်မြှင့်တင်ဖို့ အဆိုပြုပါ |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |အဆိုပြုထားသော ဆော့ဝဲ အကောင်အထည်ဖော်ရေး ပတ်ဝန်းကျင် အဆင့်မြှင့်တင်မှုကို တက်ကြွစေရန် |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |အဆိုပြုထားတဲ့ ဆော့ဖ်ဝဲ အကောင်အထည်ဖော်ရေး ပတ်ဝန်းကျင် အဆင့်မြှင့်တင်မှုကို ဖျက်သိမ်း |

## App နှင့် SORA လမ်းကြောင်းမိသားစုများ {#app-and-sora-route-families}

Torii ကို app-facing feature set ဖြင့်တည်ဆောက်တဲ့အခါ စူးစမ်းရှာဖွေသူများအတွက် နောက်ထပ် JSON မိသားစုများ၊ SORA ဝန်ဆောင်မှုများ၊ တံတားစီးကြောင်းများ၊ အထောက်အထားများနှင့် သိုလှောင်မှုများကို ဖော်ပြသည်။ ဤမိသားစုအားလုံးသည်ကွန်ရက်ပရိုဖိုင်တိုင်းတွင်စွမ်းဆောင်နိုင်ခြင်းမရှိပါ။

`/openapi.json` သည်ထုတ်လုပ်ထားသော app-API စာရင်းတွင် မှတ်ပုံတင်ထားသည့် လမ်းကြောင်းများကို ဖော်ပြသည်၊ ၎င်းပါဝင်သော စာရင်းများအတွက် ခွင့်ပြုချက်ရှိပြီး တပ်ဆင်ထားသောလမ်းကြောင်းတိုင်းအတွက် မဟုတ်ပါ။ အထူးသဖြင့် ပြည်သူ့လမ်းကြောင်း SoraFS CID နှင့် နာမည်ကြီး လမ်းကြောင်းများကို ထုတ်ပေးထားသည့် စာရွက်စာတမ်းအပြင်ဘက်တွင် တပ်ဆင်ထားပြီး တိုက်ရိုက် စစ်ဆေးရန် လိုအပ်သည်။

|လမ်းကြောင်း မိသားစု |ရည်ရွယ်ချက်|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*`|JSON စာဖတ်သူ၊ မေးမြန်းမှု အကူအညီပေးသူ၊ တင်သွင်းခြင်း အကူအညီ ပေးသူ၊ ပရိုဖိုင် (သို့) ထိန်းသိမ်းသူ အမြင်များ |
|`/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*`|NFT, ဒိဌလောကဝင်ငွေများနှင့် လျှို့ဝှက်ဝင်ငွေများကို ကြည့်ရှုခြင်း |
|`/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`၊ `/v1/identifiers/*` |နာမည်၊ အမည်မဖော်လိုသူနှင့် မှတ်သားရေးမှတ်ချက် |
|`/v1/explorer/*` |Explorer-oriented account, asset, block, transaction, instruction, metric နဲ့ stream view တွေကို ကြည့်ပါ။|
|`/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*`|ငွေပေးချေမှု သမိုင်း၊ ဆော့ဝဲ စီမံခန့်ခွဲရေး လုပ်ငန်းစဉ် ပြန်လည်ထူထောင်ခြင်း သို့မဟုတ် အခြေအနေနှင့် ISO 20022 အကူအညီများ |
|`/v1/contracts/*` |Contract code, deployment, bundle, call, view, event, activity, rollup နဲ့ state routes တွေကို တင်ပေးပါ။ |
|`/v1/multisig/*`၊ `/v1/controls/*`|Multisig အဆိုပြုချက်များ၊ ခွင့်ပြုချက်များနှင့် လွှဲပြောင်းမှုထိန်းချုပ်ရေး အကူအညီများ |
|`/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*`|အပြီးသတ်ချက်၊ ပြည်နယ်သက်သေ၊ ပိတ်ဆို့မှုသက်သေ၊ သက်သေခံ ထိန်းသိမ်းခြင်းနဲ့ သက်သေခံမေးမြန်းမှု လမ်းကြောင်းများ |
|`/v1/da/*` |ဒေတာရရှိနိုင်မှုသုံးစွဲမှု၊ နည်းပညာထုတ်ပြန်ချက်များ၊ သက်သေခံမူဝါဒများ၊ cryptographic commitment တန်ဖိုးများနှင့် pin intentions |
|`/v1/zk/*` |ZK root, proof verification, IVM proofing, vote counting, verification keys, proof records, and attachments  အတည်ပြုချက်များအား စစ်ဆေးခြင်း|
|`/v1/gov/*`၊ `/v1/ministry/*`|အုပ်ချုပ်ရေး အဆိုပြုချက်များ၊ မဲစာရင်းများ၊ ကောင်စီအခြေအနေ၊ ကာကွယ်ထားသော နာမည်နေရာများ၊ အစီအစဉ်ဆိုင်ရာ အဆိုပြုချက် များ၊ ဥပဒေချမှတ်ခြင်းနှင့် နောက်ဆုံးသတ်မှတ်ခြင်း |
|`/v1/nexus/*`၊ `/v1/sccp/*`|Nexus အကောင်အထည်ဖော်ရေးလမ်းကြောင်း, ဒေတာနေရာ, နှင့် cross-chain ကိုထောက်ပံ့သူများ |
|`/v1/musubi/*` |Musubi package registry readers and instruction builders |
|`/v1/subscriptions/*` |စာရင်းသွင်းခြင်း အစီအစဉ်များ၊ စာရင်းသွင်းသက်တမ်း စက်ဝန်း၊ အသုံးပြုမှုနှင့် အကူအညီတောင်းခံသူများ |
|`/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*`|SoraFS ပေးသွင်းသူ ရှာဖွေမှု၊ စွမ်းဆောင်မှု သက်သေခံမှု၊ ပိုက်ချိတ်ခြင်း၊ သိုလှောင်ခြင်း၊ အများပြည်သူအတွက် ထုတ်လွှင့်ပေးခြင်း |
|`/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`၊ `/api/*` |SoraCloud ဝန်ဆောင်မှုသက်တမ်းကာလ၊ ပုဂ္ဂလိက ကွန်ပျူတာ/မော်ဒယ်စီးကြောင်းများ၊ အများပြည်သူ ရှာဖွေခြင်းနှင့် ဟိုတယ် အက်ပ်များကို လမ်းညွှန်ပေးခြင်း |
|`/v1/connect/*`၊ `/v1/vpn/*`|Iroha ချိတ်ဆက်မှု အစည်းအဝေးများ, WebSocket သယ်ယူပို့ဆောင်ရေး, VPN အစည်းအတန်းများ, ပရိုဖိုင်များနှင့် ပရိုတိုကောလစ် ရလဒ် မှတ်တမ်းများ |
|`/v1/app-api/*`, `/v1/api/*`, `/v1/content/*`|App API ချိတ်ဆက်ချက်များနှင့် bundle/CID ထောက်ပံ့ထားသော content routing |
|`/v1/operator/*`၊ `/v1/mcp`|Operator authentication နှင့် native MCP JSON-RPC bridge ကို|
|`/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`၊ `/v1/ram-lfe/*` |Offline readiness, repositories agreements, data space technical manifests, and [RAM-LFE အကူအညီပေးသူများ](/my/blockchain/ram-lfe.md#torii-routes)|
|`/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`၊ `/v1/telemetry/*` |ပူးပေါင်းဆောင်ရွက်မှု, webhook, push အသိပေးချက်များနှင့် live telemetry ပေါင်းစပ်ခြင်း |

## Account Authentication, Visibility နှင့် Explorer Cursors များ {#account-authentication-visibility-and-explorer-cursors}

### App Account တောင်းဆိုမှု ပရိုတိုကော {#app-account-request-protocol}

App-facing routes များတွင် စစ်ဆေးရေး ခေါင်းစီးများ၊ တိုက်ရိုက် single-key proof သို့မဟုတ် multisig witness တစ်ခုကို လက်မခံနိုင်ပါ။ စစ်ဆေးရေးခေါင်းစီးတိုင်းသည် အများဆုံးတစ်ကြိမ်သာ ပေါ်ပေါက်ရမည်ဖြစ်သည်။

တိုက်ရိုက်သက်သေခံဖို့ ခေါင်းစဉ်လေးခုကို အတူတကွပို့ပါ။

- `X-Iroha-Account`: အတိအကျ Single Protocol Standard Smallcase `0x` Account Address Hex သို့မဟုတ် Active Single Protocol Standard ASCII Account alias ကိုသုံးပါ။ I105 စာသားဟာ HTTP ကွင်းတန်ဖိုးအဖြစ် လုံခြုံမှုမရှိဘူး၊ အဲဒီစာရင်းအတွက် Single Protocol Standard Hex သဒ္ဒါကို အသုံးပြုပါ။
- `X-Iroha-Signature`: ကျဉ်းမြောင်းတဲ့ padded-base64 လက်မှတ်အကူအညီဝန်ဆောင်မှု။
- `X-Iroha-Timestamp-Ms`: သတ်မှတ်ထားသော ဘက်လိုက်မှု ပြူတင်းပေါက်အတွင်းရှိ မီလီစက္ကန့်များတွင် လက်မှတ်မထိုးသေးတဲ့ Unix အချိန်တံဆိပ်တစ်လုံး။
- `X-Iroha-Nonce`: ပုံနှိပ်နိုင်သော ASCII byte (`0x21` မှ `0x7e`) 1 မှ 256 အထိ၊ ပြန်လည်ကစားခြင်း ပြူတင်းပေါက်အတွင်းမှာ တစ်မျိုးတည်းဖြစ်ပါသည်။

မှတ်ပုံတင်ထားတဲ့ Single-key controller က ဒီတိကျတဲ့ byte တွေကို လက်မှတ်ထိုးတယ်။

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

single protocol-standard query construction က raw query ကို `application/x-www-form-urlencoded` (`+` ဆိုသည်မှာ space ကိုဆိုလိုသည်) အဖြစ်စစ်ဆေးပြီး % - decodes its pairs, sorts them by `(key, value)` နှင့် form - encodes them again. အဆိုပါပရိုတိုကောသည် အများဆုံး ၆၄ decoded pairs နှင့် 64 KiB raw query စာသားကိုလက်ခံသည်။ cryptographic hash ကိုအခွံ bytes exactly as transmitted။ တည်ငြိမ် 32-byte ကွန်ရက် ID နှင့်အကြီးအကျယ်နည်းလမ်းကြားတွင်ခွဲခြားမှုတစ်ခုထည့်မပါ။

V1 verifier သည် method token ကို 32 byte, %-encoded request path ကို 64 KiB နှင့် direct account identity ကို 36 KiB တွင် parsing မလုပ်မီတွင် caps လုပ်ပေးသည်။ Account aliases တွေမှာ name segment သုံးခု plus their separators ရဲ့ stricter structural limit ရှိပြီး bound တစ်ခုကျော်ရင် လက်မှတ်စစ်ဆေးခြင်း (သို့) source size allocation မတိုင်ခင် စစ်ဆေးမှု ကျရှုံးသွားမှာပါ။

multisig controller တစ်ခုက `X-Iroha-Witness` ကြမ်းတမ်းသော padded-base64 single protocol-standard အဖြစ် Norito ကလစ်နှိပ်ခြင်း `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms`, နှင့် `X-Iroha-Nonce`. `X-Iroha-Account` ဤပုံစံတွင် ရွေးချယ်မှုရှိသည်မှာ၊ ရှိပါက သက်သေနှင့် ညီမျှရမည်။ `subject_account`. နိုင်ငံတကာ `CanonicalRequestWitnessV1` ပါဝင်ပါတယ်။ `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, တစ် Iroha `Hash` ခန္ဓာကိုယ် cryptographic digest value ကနေ အတိအကျကွန်ရက်တောင်းဆိုချက် bytes များ၊ ဒါပေမဲ့ freshness field တွေမရှိပါ။ အဖွဲ့ဝင်တစ်ဦးချင်းစီက Single Protocol Standard ကို လက်မှတ်ထိုးကြသည်။ Norito Signature array မပါဘဲ အလားတူ payload ကို encoding လုပ်ပေးခြင်းပါ။ စာရင်းရဲ့ လက်ရှိ multisig မူဝါဒကို ဖြည့်ဆည်းပေးရပါမယ်။ ကုဒ်သွင်းထားတဲ့ သက်သေက 1 MiB.

အတည်ပြုမှုခေါင်းစဉ်မရှိခြင်းသည် အမည်မသိဝင်ရောက်မှုကိုရွေးချယ်သည်။ တစ်စိတ်တစ်ပိုင်း၊ ရောနှောထားခြင်း၊ ထပ်ကျော့ခြင်း၊ မှားယွင်းခြင်း၊ ခေတ်နောက်ကျနေခြင်း သို့မဟုတ် ပြန်လည်ပြသသည့် အထောက်အထားတစ်ခုခုကိုပေးခြင်းသည် အတည်ပြုခြင်းကို ကျရှုံးစေပြီး မည်သည့်အခါမှ အမည်မသိမြင်နိုင်မှုသို့ မပြန်လာပါ။

### အော်ပရေတာ တောင်းဆိုချက် မှတ်ပုံတင် {#operator-request-protocol}

operator-authenticated အဖြစ် အမှတ်ပေးထားသော လမ်းကြောင်းများအတွက် singleton headers လေးခုစလုံးလိုအပ်သည်

- `x-iroha-operator-public-key`: Single protocol-standard Iroha multihash အများသုံးသော့။
- `x-iroha-operator-timestamp-ms`: မီလီစက္ကန့်များတွင် လက်မှတ်မထိုးသေးသော Unix အချိန်တံဆိပ်တစ်ခုတည်း။
- `x-iroha-operator-nonce`: ပုံနှိပ်နိုင်သော ASCII ဘိုက် (၁) မှ ၂၅၆ အထိ၊ ပြန်လည်ကစားရန် ပြူတင်းပေါက်အတွင်းရှိ အဲဒီခလုတ်အတွက် သီးသန့်ပါ။
- `x-iroha-operator-signature`: ကျဉ်းမြောင်းတဲ့ padded-base64 လက်မှတ်အကူအညီဝန်ဆောင်မှု။

ခေါင်းစဉ်တန်ဖိုးတွေဟာ ပတ်ဝန်းကျင်က အဖြူရောင်နေရာကို မပါရစေပါ။ Operator Key အချက်ပြချက်တွေက

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Path, query, body, timestamp, and cryptographic nonce value rules are the same single protocol-standard rules used by the app protocol. key ကိုလည်း အသုံးပြုရပါမည်။ `[torii.operator_signatures]`: `allowed_public_keys` မှာစာရင်းပေးပါ (သို့) node key ကိုသုံးတဲ့အခါ explicitly enable `allow_node_key` လုပ်ပါ။ replay-cache saturation ကို `503 Service Unavailable` နဲ့ပိတ်မထားဘူး။

အတိအကျတောင်းဆိုချက် လက်မှတ်ရေးထိုးခြင်းသည် အမြဲတမ်းလိုအပ်သည်။ `[torii.operator_auth].enabled = true` တွင် သာမန်အသုံးပြုသူလမ်းကြောင်းတစ်ခုစီသည်လည်း သက်ဝင်သော `x-iroha-operator-session` ကိုလိုအပ်သည်။ `require_mtls = true` တွင်၎င်းသည်အပြင် ယုံကြည်မှုရှိသည့် ဝင်ရောက်မှုမှ `x-forwarded-client-cert` ကိုလိုအပ်သည်။ မည်သည့်အချက်မဆို တောင်းဆိုချက်လက်မှတ်ကိုအစားထိုးမပြုပါ။

WebAuthn မှတ်ပုံတင်ခြင်းနှင့် လက်မှတ်ရေးထိုးခြင်းမှာ JSON API နောက်ဆုံးအချက်လေးခုကို အသုံးပြုပါ။

|Method နဲ့ API အဆုံးသတ်မှတ်ချက် |ရည်ရွယ်ချက်|
| --------------------------------------------- | ---------------------------------------- |
|`POST /v1/operator/auth/registration/options` |WebAuthn ခွင့်ပြုချက် မှတ်ပုံတင်စတင်ခြင်း |
|`POST /v1/operator/auth/registration/verify` |ခွင့်ပြုချက်ကို စစ်ဆေးပြီး ဆက်လက်တည်ဆောက်ပါ |
|`POST /v1/operator/auth/login/options` |WebAuthn စစ်ဆေးမှုကို စတင်ပါ။ |
|`POST /v1/operator/auth/login/verify` |အဆိုပြုချက်ကို စစ်ဆေးပြီး အစည်းအဝေးတစ်ခု ထုတ်ပေးပါ |

`torii.operator_auth.tokens` ကို ရည်စူးထားတဲ့ bootstrap တန်ဖိုးများဖြင့် သတ်မှတ်ပါ။ မည်သည့် ခွင့်ပြုချက် စာရွက်စာတမ်းမဆို မတည်ရှိခင်မှာ ပထမ မှတ်ပုံတင်ကို စတင်ရန် `x-iroha-operator-token` အဖြစ် တစ်လုံးပို့ပါ။ ထိုသင်္ကေတသည် ပုံမှန် operator လမ်းကြောင်းတစ်ခုကို ဘယ်တော့မှ ခွင့်မပြုဘူး၊ ဒီစီးဆင်းမှုအတွက် နားထောင်သူ `x-api-token` တန်ဖိုးများကို ဘယ်တော့မှ ပြန်လည်အသုံးပြုခြင်းမရှိပါ။ ခွင့်ပြုချက်တစ်ခုရှိပြီဆိုတာနဲ့ အခြားခွင့်ပြုချက်တစ်ခုကို မှတ်ပုံတင်ဖို့ စစ်ဆေးတဲ့ အစည်းအဝေးတစ်ခုလိုအပ်တယ်။ ဝင်ရောက်စစ်ဆေးမှုက အစည်းအုံမှတ်တံဆိပ်ကို အတိအကျကွန်ရက်စီမံခန့်ခွဲသူတောင်းဆိုချက် လက်မှတ်အသစ်တိုင်းနှင့်အတူပို့ဖို့ပြန်ပေးပါတယ်။ `<torii.data_dir>/operator_auth/operator_webauthn.json` အောက်မှာ ခွင့်ပြုချက်တွေ ဆက်ရှိနေသည်။

ISO 20022 လမ်းကြောင်းတွေမှာ လွတ်လပ်တဲ့ စစ်ဆေးမှု နှစ်ခုရှိပါတယ်။ တောင်းဆိုချက်က ဒီစီမံခန့်ခွဲသူ ခွင့်ပြုချက်စာရင်းနဲ့ လက်မှတ်ရေးထိုးခြင်း ပရိုတိုကောကို အရင်ဆုံး ကျော်လွှားဖို့လိုပါတယ်။ ISO ကိုင်တွယ်သူက အောက်မှာဖော်ပြထားတဲ့ အတိအကျ ပါဝင်သူ (သို့) စာရင်းစစ်ဆေးမှုအခန်းကဏ္ဍကို သိမ်းပိုက်ဖို့ တူညီတဲ့ သော့ကို လိုအပ်တယ်။

### blockchain ledger အမြင်အာရုံနှင့် Explorer Cursors များ {#ledger-visibility-and-explorer-cursors}

App-facing blockchain ledger readers များမှာ အထက်ပါ optional app account boundary ကို အသုံးပြုသည်။ လက်မှတ်မထိုးသေးတဲ့ request သည် အများပြည်သူအဖြစ် သတ်မှတ်ထားသော dataspaces များကိုသာ ရရှိသည်။ သက်ဝင်သည့် လက်မှတ်ထိုး request တစ်ခုဖြစ်သည်။ ဖုန်းခေါ်ဆိုသူ၏ လက်ရှိ UAID သို့ ချိတ်ဆက်ထားသော ဒေတာဇုန်များ၊ တိကျသော `CanReadRestrictedDataspace { dataspace }` ခွင့်ပြုချက်ဖြင့် အမည်ပေးထားသည့် ကန့်သတ်ထားတဲ့ ဒေတာဇုံတစ်ခုစီ သို့မဟုတ် အကောင့်တွင် `CanReadAllLedgerData` ရှိပါက လမ်းကြောင်းအားလုံးကို ထည့်သွင်းသည်။

ဖုန်းခေါ်ဆိုသူရဲ့ ခွင့်ပြုချက် မူရင်းနဲ့ ကိုက်ညီတဲ့ လမ်းကြောင်းကို သုံးပါ။

|Method နဲ့ API အဆုံးသတ်မှတ်ချက် |အတည်ပြုခြင်းနှင့် မြင်နိုင်မှု |
| ------------------------------------- | --------------------------------------------------------------- |
|`POST /v1/transactions/visible/query` |Single protocol-standard account လက်မှတ်ထိုးခြင်း။ ဖုန်းခေါ်သူရဲ့ မြင်နိုင်မှုကို အသုံးချပါတယ်။ |
|`POST /v1/transactions/query` |Operator တောင်းဆိုချက် လက်မှတ်ရေးထိုးခြင်း; global operator view ကိုခွင့်ပြု |
|`GET /v1/triggers/completed` |Operator တောင်းဆိုချက် လက်မှတ်ရေးထိုးခြင်း node-local ပြီးစီးမှု မှတ်တမ်းများ ဖတ်ရှု |

NFT, RWA, holder နှင့် Explorer တို့သည်စာရင်း၊ ဒိုမင်၊ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များနှင့်အတူတူသော မြင်နိုင်မှုအရာဝတ္ထုများကို စစ်ဆေးသည်။ ပျောက်ကွယ်သည့် အရာဝတ္ထုတစ်ခုနှင့်ခေါ်သူ၏မြင်ရတဲ့ လမ်းကြောင်းများအပြင်ရှိရာ အရာဝတ္ထုကို ရည်ရွယ်၍ ခွဲခြားမရပါ။ နောက်ဆုံးပြုလုပ်ထားသော ငွေပေးချေမှုနှင့် ညွှန်ကြားချက်များ၏ သမိုင်းကို ရောင်းဝယ်မှုအတွက် မှတ်တမ်းတင်ထားသည့် လမ်းကြောင်းငွေကြေးလွှဲပြောင်းမှု အစိတ်အပိုင်းတိုင်း မြင်နိုင်မှသာ ပြသနိုင်သည်။ ထို့ကြောင့် ပါဝင်သူ တစ်ဦးတည်းသော ငွေကြေးလွှဲပြောင်းမှု အပိုင်းသည်လည်း ဖုန်းခေါ်ဆိုသူ၏ လက်လှမ်းမီမှုအပြင်မှာ ရှိပါက ပုန်းကွယ်နေသည်။ ပျောက်နေတဲ့၊ ခေတ်နောက်ကျနေသည့် (သို့မဟုတ်) မှားယွင်းသော လမ်းညွှန်ရေး အခြေအနေကို ကမ္ဘာလုံးဆိုင်ရာ စာဖတ်သူတစ်ဦးသာ မြင်နိုင်သည်။

ကမ္ဘာအနှံ့ထောက်ပံ့သော Explorer ကော်လီကေးရှင်း ခြောက်ခုသည် ပွင့်လင်းမြင်သာမှုမရှိသည့် single protocol-standard base64url keyset cursors များကိုအသုံးပြုသည်။ ကြိုတင်သတ်မှတ်ထားသောစာမျက်နှာက ၂၅, အမြင့်ဆုံးက ၁၀၀ နှင့် စာမျက်နှာတစ်ခုသည် အများဆုံး 512 ပြိုင်ဘက်ခလုတ်များကိုစစ်ဆေးသည်။ Cursor တစ်ခုချင်းစီဟာ ၎င်းရဲ့ စုစည်းမှု၊ စစ်ဆေးမှုတွေ၊ Single Protocol Standard Last Key နဲ့ Caller ရဲ့ မြင်နိုင်တဲ့ လမ်းကြောင်း သတ်မှတ်ထားတဲ့ cryptographic digest တန်ဖိုးနဲ့ ချည်နှောင်ထားတယ်။ ဒီတော့ အခြားမေးမြန်းချက်တစ်ခုမှာ (သို့) Caller ရဲ့မြင်ကွင်း ပြောင်းလဲပြီးနောက်မှာ ပြန်လည်ကစားလို့မရဘူး။

Block, transaction, latest-transaction, instruction နှင့် latest-instruction history cursors များကို အသုံးပြုပါ။ ထို့အပြင် အပြီးသတ်မှတ်ထားသော point-in-time data view အမြင့်ကို pin နှင့် cryptographic hash ကိုပိတ်ပါ။ တုံ့ပြန်မှု ထုတ်ဖော် `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`, နှင့် `pagination.has_more`. အခြားလမ်းကြောင်း (သို့) စစ် filter set တစ်ခုအတွက် cursor, changed visibility cryptographic digest value၊ (သို့) node က validate မလုပ်နိုင်တော့တဲ့ point-in-time data view ကို ပိတ်ထားတယ်။ Torii ရဲ့ query-admission ခွင့်ပြုချက်အတွင်းမှာ မှတ်တမ်းကို စကင်လုပ်နေတုန်း blocking worker က run လုပ်နေတာပါ။

Explorer WebSocket စီးကြောင်းများသည် စစ်ဆေးသော summaries များကိုထုတ်လွှတ်ပြီး blockchain ledger ခွင့်ပြုချက်များပြောင်းလဲသည်နှင့်အတူမြင်ကွင်းပြန်တွက်ချက်ခြင်း။ ဒေသခံ `GET /v1/blocks/stream` လမ်းကြောင်းကိုခြားနားသည်။ `CanReadAllLedgerData` ကို လက်ညှိုးထိုးမှုအတွင်း ထုတ်လွှင့်ပြီး ခွင့်ပြုချက် ပြန်လည်သိမ်းဆည်းခံရပါက ပိတ်ထားသည်။ ဒေတာနေရာ စကုပ်ထားတဲ့ Explorer အတွက် native stream ကိုမသုံးပါနဲ့။

## ISO 20022 တံတား {#iso-20022-bridge}

Torii ပွင့်လင်းမြင်သာမှု ISO 20022 တံတားအောက် `/v1/iso20022/*` app ကို မျက်နှာပြုတဲ့အခါမှာ API bridge software အကောင်အထည်ဖော်ရေးပတ်ဝန်းကျင်ကို enable လုပ်ထားသည်။ bridge ကိုရည်ရွယ်ချက်ရှိပြီး ISO 20022 ရှင်းလင်းရေးဂိတ်တံခါး၊ ဒါပေမဲ့ ရွေးချယ်ထားတဲ့ ငွေပေးချေမှု သတင်းအချက်အလက်တွေကို လက်မှတ်ထိုးချက်အဖြစ် ပြောင်းဖို့ ထောက်ပံ့တဲ့ အစိတ်အပိုင်းစု Iroha ငွေလွှဲပြောင်းမှုတွေနဲ့ သူတို့ရဲ့ blockchain ledger အခြေအနေကို ခြေရာခံဖို့ပါ။

မည်သည့်ပို့မှုမဆို လက်ခံရန်မတိုင်မီ ရေရှည်တည်တံ့သော ဒေသခံ `torii.iso_bridge.store_dir` ကိုသတ်မှတ်ပါ။ သတ်မှတ်ချက် ကွင်းသည် ရွေးချယ်စရာတစ်ခုတည်းဖြစ်သည်၊ ထို့ကြောင့် node သည်ဖတ်ခြင်းသာ သို့မဟုတ် ရောဂါရှာဖွေရေးအသုံးပြုမှုအတွက် စတင်နိုင်သည်: စစ်ဆေးထားသော ISO တင်သွင်းမှုတိုင်းမှာ ပြတိုက်ကိုလိုအပ်ပြီး persistence မရှိတဲ့အခါ (သို့) replay-tombstone သို့မဟုတ် rich-record ရေးသားမှု ကျရှုံးတဲ့အခါ ပြန်လည်စစ်ဆေးလို့ရတဲ့ `503 Service Unavailable` ကိုပြန်ပို့တယ်။

### Torii ISO 20022 API အဆုံးသတ်မှတ်ချက်များ {#torii-iso-20022-endpoints}

|Method နဲ့ API အဆုံးသတ်မှတ်ချက် |ရည်ရွယ်ချက်|
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
|`POST /v1/iso20022/pacs008` |FI-to-FI customer credit transfer ကို တင်သွင်းပြီး သင့်တော်တဲ့ Iroha asset transfer ကို တည်ဆောက်ပါ။ |
|`POST /v1/iso20022/pacs009` |FI မှFI သို့ PvP သို့မဟုတ် စာရင်းအင်းများနှင့် ဆက်စပ်သည့် ငွေကြေးထောက်ပံ့မှုအတွက် အသုံးပြုသော ချေးငွေလွှဲပြောင်းမှုကို တင်ပြပါ။ |
|`POST /v1/iso20022/pacs002` |ငွေပေးချေမှုအခြေအနေ အစီရင်ခံစာကို ဆန့်ကျင်ဘက်ပိုင်ရှင်ထံ တင်ပြပါ။ ဘဏ္ဍာရေးဆောင်ရွက်ချက်များ ဖြေရှင်းရန်အတွက် နောက်ဆုံးရဆောင်ရွက်မှု အထောက်အထားများ လိုအပ်ပါသည်။|
|`POST /v1/iso20022/pacs004` |ငွေပေးချေမှု ပြန်လည်ထုတ်ပြန်ချက် ပေးပို့ခြင်း|
|`POST /v1/iso20022/camt056` |originator ပိုင်ဆိုင်သော ငွေပေးချေမှုကို ဖျက်သိမ်းရန် တောင်းဆိုချက် တင်ပြပါ |
|`POST /v1/iso20022/sese023` |စာရင်းအင်း ငွေကြေးပဋိပက္ခ ဖြေရှင်းရေး ညွှန်ကြားချက် ပေးပို့ခြင်း |
|`POST /v1/iso20022/sese024` |ငွေလဲလှယ်မှုဆိုင်ရာ ငွေကြေးပဋိပက္ခဖြေရှင်းမှုအခြေအနေသတင်းစာကို ဆန့်ကျင်ဘက်ပိုင်ဆိုင်သော စာရွက်စာတမ်းများတွင် တင်ပြပါ |
|`POST /v1/iso20022/sese025` |ငွေရေးကြေးရေး ငွေချေးမှု ချေမှုန်းခြင်း အတည်ပြုချက် ကို ဆန့်ကျင်ဘက်ပိုင်ဆိုင်သော စာရွက်စာတမ်းများတွင် တင်သွင်းပါ |
|`POST /v1/iso20022/colr012` |အာမခံ အစားထိုးမှု သတင်းစာကို တင်ပါ |
|`GET /v1/iso20022/messages/{msg_id}` |စာတိုတစ်စောင်အတွက် Single Protocol Standard တံတားမှတ်တမ်းကို ဖတ်ပါ။|
|`GET /v1/iso20022/audit/messages` |အမှားအယွင်းထင်ရှားတဲ့ သတင်းစာ စစ်ဆေးမှု နည်းပညာထုတ်ပြန်ချက်ကို ဖတ်ပါ။|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |လက်ရှိငွေပေးချေမှုအခြေအနေကို `pacs.002` XML အဖြစ်ပြန်ညွှန်းပါ။|
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |လက်ရှိ ငွေပေးချေမှု မှတ်ပုံတင်ကို `pacs.004` XML အဖြစ် ပေးသွင်းပါ။ |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |လက်ရှိ ဖျက်သိမ်းမှု ဆုံးဖြတ်ချက်ကို `camt.029` XML အဖြစ်ပြန်ညွှန်းပါ။ |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |လက်ရှိ ငွေရေးကြေးရေးဆောင်ရွက်မှု ဖြေရှင်းမှု အခြေအနေကို `sese.024` XML အဖြစ်ပြန်ညွှန်းပါ။|
|`GET /v1/iso20022/messages/{msg_id}/sese025` |လက်ရှိ ငွေကြေးပဋိပက္ခဖြေရှင်းမှု အတည်ပြုချက်ကို `sese.025` XML အဖြစ်ပြန်ညွှန်းပါ။ |

`pacs.008` စာရွက်စာတမ်းများတွင် သတင်းအချက်အလက် ID၊ ဘဏ်အချင်းချင်း ငွေရေးကြေးဆိုင်ရာ ငွေပေးချေမှု ပေးသွင်းရန် လိုအပ်ပါသည်။ ငွေလဲနှုန်းသမိုင်း၊ ငွေကြေးပမာဏ၊ ဘဏ္ဍာရေးဆောင်ရွက်မှု ဖြေရှင်းရက်၊ အကြွေးရှင်နှင့် ချေးငွေပေးသွင်းသူ IBANs, အကြွေးရှင်နဲ့ ချေးငွေပေးသူ BICs. Reference data တွေကို configured လုပ်တဲ့အခါ bridge ကလည်း check လုပ်တယ်။ BIC, IBAN, နှင့် ISO 4217 ငွေကြေး crosswalks များသည်ထုတ်လုပ်သောရောင်းဝယ်မှုသည် software processing workflow ထဲသို့မဝင်မီတွင်ဖြစ်သည်။

`pacs.009` တင်ပြချက်များတွင် စီးပွားရေးသတင်းစကား ID၊ သတင်းစကား အဓိပ္ပါယ်ဖွင့်ဆိုမှု ID၊ ဖန်တီးချိန်ကို ဖော်ပြရမည်။ ဘဏ်များအကြား ငွေရေးကြေးဆိုင်ရာ ငွေပေးချေမှုဖြေရှင်းမှု ပမာဏ၊ ငွေလဲနှုန်းသမိုင်း၊ ငွေကြေးဆိုင်ရာငွေပေးချေမှုကို ဖြေရှင်းသည့်နေ့၊ ညွှန်ကြားချက်ပေးသူနှင့် ညွှန်ပြထားသော အရာရှိ BICs, အကြွေးရှင်နဲ့ ချေးငွေပေးသူ IBANs. သတင်းအချက်အလက်မှာ ပါဝင်ပါက `Purp`, လက်ရှိတွင် တံတားသည် စာရင်းအင်းများအတွက် ရင်းနှီးမြှုပ်နှံမှုများကိုသာ လက်ခံနေသည်- `Purp=SECU`.

နိုင်ငံတကာ `pacs.008` နှင့် `pacs.009` တင်ပြချက် API အဆုံးသတ်မှတ်ချက်များ လက်ခံ XML ISO တံတားစမ်းသပ်မှုတွေမှာ အသုံးပြုတဲ့ ဒေတာ ကွန်တိန်နာ (သို့) ပွင့်လင်းတဲ့ ကွင်းပုံစံပါ။ `SplmtryData` ကွင်းတွေက ပစ်မှတ်ကို ညှိနိုင်တယ် Iroha blockchain ledger, အရင်းအမြစ်နှင့်ရည်မှန်းချက်စာရင်း IDs သို့မဟုတ်လိပ်စာများနှင့်အရင်းအမြစ်အဓိပ္ပာယ်သတ်မှတ်မှု ID များကို။ `202 Accepted` နှင့်အတူ `message_id`, `transaction_hash`, `status`, `pacs002_code`, ပြတ်တောက်နေတဲ့ စာရင်းအင်း/စာရင်း/အရင်းအမြစ် အခြေအနေ။

### ပါဝင်သူ၏ ခွင့်ပြုချက်နှင့် သက်တမ်းပတ်လည်ပိုင်ဆိုင်မှု {#participant-authorization-and-lifecycle-ownership}

အကောင်အထည်ဖော်ထားသော တံတားတိုင်းတွင် ပါဝင်သူစာရင်းရှိသည်။ ပါဝင်သူဝင်ရောက်မှုတစ်ခုစီမှာ ထူးခြားတဲ့ ပါဝင်သူ ID၊ လုပ်ငန်းရှင် အများသုံး သော့တစ်လုံး (သို့မဟုတ်) ပိုများများ၊ ငွေကြေးသိမှတ်ချက်တစ်ခု (သို့) ပိုများ၊ ခွင့်ပြုထားတဲ့ ပရိုဖိုင်အစုနှင့် `originator`, `counterparty` သို့မဟုတ် နှစ်ခုစလုံးပါဝင်သည်။ `audit_admin_keys` ကို သီးခြားသတ်မှတ်ပါ။ စစ်ဆေးမှု-စီမံအုပ်ချုပ်ရေးမှူး သော့သည်လည်း ပါဝင်သူ အပြောင်းအလဲ သော့ဖြစ်မရနိုင်ပါ။

ISO လမ်းကြောင်းအားလုံးအတွက် လုပ်ငန်းရှင်လက်မှတ်သစ်တစ်ခုလိုအပ်သည်။ ပထမဦးဆုံး `pacs.008`, `pacs.009`, `sese.023` သို့မဟုတ် `colr.012` တင်ပြမှုအတွက် စစ်ဆေးသော လုပ်ငန်းရှင်သည် လျှောက်လွှာခေါင်းစဉ် `From` ဖြင့် သတ်မှတ်ထားသည့် ပါဝင်သူ၏ ဘဏ္ဍာရေးအမည်ကို ပိုင်ဆိုင်ရမည်။ `To` လက္ခဏာဟာ `counterparty` အခန်းကဏ္ဍနဲ့ ဖွဲ့စည်းထားတဲ့ ပါဝင်သူတစ်ဦးကို ဖြေရှင်းရပြီး ရွေးချယ်တဲ့ ပရိုဖိုင်ကို နှစ်ဖက်စလုံးအတွက် ခွင့်ပြုဖို့လိုပါတယ်။ တည်တံ့တဲ့ လက်မှတ်ရေးထိုးခြင်းသည် မူရင်းထုတ်ပြန်သူ၊ ငွေပေးချေသူ၊ လက်မှတ်ရေးဆွဲသူနှင့် လုပ်ငန်းရှင်လက်မှတ်ရေးထိုးသူ၊ မူရင်းပရိုဖိုင်းနှင့် ထည့်သွင်းထားသော လက်မှတ် ရေးထိုးမှု မူဝါဒကို မှတ်တမ်းတင်သည်။

သက်တမ်းပတ်လည် ခွင့်ပြုချက်ဟာ ဖုန်းခေါ်သူက ရွေးချယ်တဲ့ တန်ဖိုးတွေထက် ဒီမပြောင်းလဲနိုင်တဲ့ မှတ်တမ်းကနေ ရတာပါ။

|ဘဝပတ်လည် သတင်းစကား |လိုအပ်တဲ့ ပါဝင်သူ |
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`, `sese.024`၊ `sese.025` |`counterparty` အခန်းကဏ္ဍရှိ မူရင်းပဋိပက္ခသည် |
|`camt.056` |`originator` အခန်းကဏ္ဍနဲ့ မူရင်းထုတ်ပြန်သူ |

မူလ profile နဲ့ လက်မှတ်ရေးထိုးတဲ့ မူဝါဒဟာ တစ်လျှောက်လုံး ပိတ်ထားနေဆဲပါ။ lifecycle ဆိုတော့ ဖုန်းခေါ်သူဟာ update လုပ်ဖို့ အားနည်းတဲ့ profile ကို ရွေးလို့မရဘူး။ `pacs.002` ငွေရေးကြေးဆိုင်ရာ ငွေချေးမှု ဖြေရှင်းမှုကို ကိုယ်စားပြုတဲ့ ကုဒ် (`ACSC`, `ACCP`, `SETT`, ဒါမှမဟုတ် `SETTLED`) မူလစာရင်းကို settled အဖြစ် ပြောင်းလဲလိုက်ပါကသာ Torii ငွေပေးချေမှု အထောက်အထားကို အပြီးသတ်ထုတ်ပြန်ထားပါတယ်။

မူရင်းပါတီ နှစ်ခုစလုံးသည် ၎င်း၏သတင်းအချက်အလက် မှတ်တမ်းနှင့် ထုတ် generated outbox စာရွက်စာတမ်းများကိုဖတ်ရှုနိုင်သည်။ စစ်ဆေးခြင်း API နောက်ဆုံးမှတ်ချက်တွင် စစ်ဆေးခံရသော ပါဝင်သူသည် originator (သို့) counterparty ဖြစ်သည့် မှတ်တမ်းများသာ ပြန်လည်ပို့ပေးသည်။ သီးခြားသတ်မှတ်ထားသော စစ်ဆေးရေး အုပ်ချုပ်ရေးမှူးသည် တစ်ကမ္ဘာလုံး စာဖတ်ခြင်းသာ ရှိသည့် စစ်ဆေးမှု အမြင်ကို ရရှိပြီး သတင်းအချက်အလက်များကို ပေးပို့ရန် သို့မဟုတ် ပြောင်းလဲရန် မဖြစ်နိုင်ပါ။ မသိသော ပါဝင်သူများနှင့် ဆက်စပ်မှုမရှိသော သတင်းအချက်အလက် identifikator များကို ထုတ်ပြန်ခြင်း မရှိပါ။

### ခိုင်ခံ့သော ပြန်လည်ဖြန့်ဝေမှု မှတ်တမ်းများနှင့် လက်မှတ်ရေးထိုးထားသော Outbox Documents {#durable-replay-identity-and-signed-outbox-documents}

Replay ရေရှည် ဖျက်ပစ်ရေး အမှတ်တံဆိပ်တွေဟာ ခိုင်မာတဲ့ လက်ခံမှု နယ်နိမိတ်ပါ။ Torii က မဖတ်နိုင်၊ ကြီးမားလွန်း၊ မှားယွင်း၊ အမည်မှား၊ ပဋိပက္ခဖြစ်တာ (သို့) တိတိကျကျ incompatible ရေရှည်ဖျက်ပစ်ရေးမှတ်တံဆိပ်အတွက်စတင်ခြင်းကို ဖယ်ရှားတယ်။ ၎င်းသည် explicitly incompatible schema version, လက်ရှိ configuration မှပျောက်ကွယ်သော participant, profile, သို့မဟုတ်လက်မှတ်မူဝါဒများနှင့်အတူ Rich Record အတွက်လည်း aborts, သို့မဟုတ်ပျောက်ဆုံးနေသည့် (သို့) မညီမျှသော Live ရေရှည်တည်တံ့မှု ဖျက်ခြင်း marker ကို.

Rich-record ပျက်စီးမှုအခြားအရာများကို မတူညီစွာ စီမံခန့်ခွဲနိုင်သည် - မဖတ်ရှုနိုင်သော သို့မဟုတ် အလွန်အကျွံကြီးမားသော ဖိုင်များ၊ မမှန်ကန်သော JSON, မမှန်ကန်သည့် current-schema မှတ်တမ်းများ, တစ်ခုတည်းသော ပရိုတိုကောစံညွှန်းမဟုတ်သော ဖိုင်နာမည်များနှင့် ဝိရောဓိရှိသော replay လက္ခဏာများကိုမှတ်ပုံတင်ခြင်း (သို့မဟုတ်) ခလုတ်ခြင်း။ မဖတ်နိုင်တဲ့ (သို့) မတည်ငြိမ်တဲ့ လက်ရှိဗားရှင်း စစ်ဆေးရေး အညွှန်းကိန်းကို ထိန်းသိမ်းထားသော မှတ်တမ်းများမှ ပြန်လည်ပြုပြင်ပေးသည်။ ရှင်းလင်းစွာမလိုက်ဖက်သည့် စစ်ဆေးရေးအညွှန်းကိန်း ဗားရှင်းတစ်ခုတည်းက စတင်ခြင်းများကို ရပ်ဆိုင်းပေးသည်။ startup log တွေကို စောင့်ကြည့်ပြီး ပြန်လည်ပြုပြင်ထားတဲ့ audit technical manifest ကို reconcile လုပ်လိုက်ပါ၊ ချိုးဖောက်နေတဲ့ rich-record ဖိုင်တိုင်းက node ကို serve မဖြစ်အောင် တားဆီးပေးတယ်လို့ ယူဆတာအစားပါ။

သိမ်းဆည်းထားသည့် Rich Record တစ်ခုစီသည် ပါဝင်သူ၏ မပြောင်းလဲနိုင်သော မူရင်းနေရာကို ထိန်းသိမ်းထားသည်။ သီးခြား ရေရှည်တည်တံ့သော ရေရှည်ခံ ဖျက်ခြင်း အမှတ်တံဆိပ်တစ်ခုသည် Rich Record အသေးစိတ်များကို ဖြတ်တောက်ပြီးနောက်တောင် အပြည့်အဝ deduplication TTL အတွက် Message ID၊ Payload cryptographic hash, Business message ID နှင့် UETR ကိုထိန်းသိမ်းထားသည်။

Torii သည် lifecycle သတင်းစကားတစ်စောင်ကို လက်မှတ်မထိုးခင် သို့မဟုတ် စီမံခန့်ခွဲခင် ပြန်လည်ကစားခွင့်ပြုမှုကို ဆက်လက်တည်ရှိသည်။ သက်တမ်းမကုန်သေးတဲ့ ပြန်လည်ကစားလက္ခဏာတစ်ခုကို ဘယ်တော့မှ ပယ်ရှားခြင်းမရှိပါ။ သတ်မှတ်ထားသော အရည်အချင်းက ကာကွယ်ထားတဲ့ မှတ်တမ်းများ (သို့) သက်တမ်းမကုန်သေးတဲ့ ပြန်လည်ရိုက်ကူးမှုအမည်များဖြင့် အပြည့်အဝ နေရာယူထားသည်ဆိုပါစို့၊ တင်သွင်းချက်များသည် ဘဝပတ်ဝန်းကျင် သို့မဟုတ် စာရင်းအခြေအနေကို ပြောင်းလဲခြင်းမရှိဘဲ ပြန်လည်သုံးစွဲနိုင်သော `503 Service Unavailable` ကို ရရှိသည်။

ထုတ်လုပ်မှုတိုင်းမှာ `pacs.002`, `pacs.004`, `camt.029`, `sese.024`, ဒါမှမဟုတ် `sese.025` စာရွက်စာတမ်းကို ပြန်ပို့ခြင်း `application/xml` ဒီတုံ့ပြန်မှု ခေါင်းစဉ်တွေနဲ့:

|ခေါင်းစဉ် |အဓိပ္ပါယ်|
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain` |အမြဲတမ်း `iroha.iso20022.outbound.v2`|
|`X-Iroha-Iso-Signer` |configured bridge cryptographic signer အတွက် single protocol-standard public key ကို အသုံးပြုရန် |
|`X-Iroha-Iso-Signature` |ဒိုမင်ခွဲခြားထားသော XML ဘိုက်များပေါ်တွင် Base64 လက်မှတ် |

UTF-8 byte sequence `iroha.iso20022.outbound.v2`, zero byte တစ်ခုနဲ့ တိကျတဲ့ တုံ့ပြန်မှု body ပေါ်က လက်မှတ်ကို စစ်ဆေးပါ။ စစ်ဆေးခြင်းမတိုင်မီ XML ကို ပြန်လည်ဖေါ်မြူတာ (သို့မဟုတ်) ပုံမှန်မပြုလုပ်ပါနဲ့။

### နောက်ထပ် Parser နှင့် မြေပုံထုတ်ခြင်း Support {#additional-parser-and-mapping-support}

IVM ISO အကူသည်လည်း data container validation, financial transaction settlement mapping သို့မဟုတ် downstream reconciliation အတွက် အောက်ပါ message families များကို validates နှင့် materializes လုပ်ပေးသည်။ ၎င်းတို့မှာ standalone Torii လမ်းကြောင်းမရှိပါ။

|စာတို မိသားစု|လက်ရှိထောက်ပံ့မှု |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
|`head.001` |ISO ဒေတာ ကွန်တိန်နာများအတွက် စီးပွားရေး လျှောက်လွှာ ခေါင်းစဉ် အတည်ပြုချက်၊ `BizMsgIdr`, `MsgDefIdr`, ဖန်တီးချိန်နှင့် ရွေးချယ်စရာ ပေးပို့သူ/လက်ခံသူ BIC ကွင်းများအပါအဝင် |
|`pacs.007`, `pacs.028`, `pacs.029`|ငွေပေးချေမှု ပြန်လည်ကောက်ခံခြင်း၊ အခြေအနေတောင်းဆိုခြင်းနှင့် စုံစမ်းစစ်ဆေးမှုဖြေရှင်းရေး/အခြေအနေ စစ်ဆေးခြင်း |
|`pain.001`၊ `pain.002`|Customer payment initiation နှင့် ငွေပေးချေမှုအခြေအနေ အစီရင်ခံစာကို အတည်ပြုခြင်း |
|`camt.052`, `camt.053`, `camt.054`|စာရင်းအင်း အစီရင်ခံစာ၊ ထုတ်ပြန်ချက်နှင့် အသိပေးချက် အတည်ပြုချက် |

## Kaigi အစည်းအဝေး {#kaigi-sessions}

Kaigi သည် SORA Nexus တွင် ငွေပေးချေသော real-time audio / video rooms များကိုထောက်ပံ့သည်။ ပရိုဂရမ်တစ်ခုသည် blockchain ledger session ဖန်တီးခြင်း၊ စာရင်းပြောင်းလဲခြင်းများ၊ ပြန်ကြားရေးနည်းပညာ manifest များ၊ ကုဒ်သွင်းထားတဲ့ အချက်ပြမှုနှင့် အသုံးပြုမှု တိုင်းတာခြင်းတို့ဖြင့် ထောက်ခံရန်လိုအပ်သည့်အခါအသုံးပြုပါ။

blockchain ledger နဲ့ တုံ့ပြန်ဆက်သွယ်တဲ့ ဘဝပတ်လမ်းက:

- `CreateKaigi`: domain တစ်ခုအောက်တွင် call ကိုဖန်တီးပြီး ၎င်း၏ policy, schedule, metadata နှင့် optional relay technical manifest များကို သိုလှောင်ပါ။
- `JoinKaigi`: ဖိတ်ကြားစာရင်းကို update လုပ်ပါ။ `zk-roster-v1` mode မှာ အများပြည်သူဖိတ်ကြားမှုအမြင်က ပါဝင်သူ အကောင့် ID တွေအစား cryptographic commitment value နဲ့ nullifier counts ကို ဖော်ပြပါတယ်။
- `LeaveKaigi`: ပွင့်လင်းမြင်သာတဲ့ ခေါ်ဆိုမှုမှ ပါဝင်သူကို ဖယ်ရှားပါ။ ပုဂ္ဂလိက mode က ထွက်ခွာမှုဟာ ပထမထုတ်လွှင့်ရေး ပရိုတိုကလုမှာ ချိတ်ဆက်ခြင်းမရှိပါဘူး။
- `RecordKaigiUsage`: မီတာသက်တမ်းနှင့် ငွေပေးချေမှု အကောင်အထည်ဖော်မှု ကုန်ကျစရိတ် စုစုပေါင်းကို ဖြည့်စွက်ပါ။
- `EndKaigi`: အစည်းအဝေးကို ပိတ်ပြီး နောက်ဆုံး အချိန်တံဆိပ်ကို မှတ်တမ်းတင်ပါ။

Torii သည် အောက်ပါ app ကို မျက်နှာမူဖတ်ခြင်းများကို ဖော်ပြသည်-

|လမ်းကြောင်း |အတည်ပြုခြင်း |ရည်ရွယ်ချက်|
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
|`/v1/kaigi/calls/{call_id}` |အများပြည်သူ|လက်ရှိ ဖုန်းခေါ်ဆိုမှု မှတ်တမ်း|
|`/v1/kaigi/calls/{call_id}/signals` |Single Protocol Standard အတိအကျ ကွန်ရက်စာရင်းတောင်းဆိုချက် |စာမျက်နှာပြုပြင်ပြီးဆုံးဖြတ်သော အချက်ပြမှု metadata များ |
|`/v1/kaigi/calls/{call_id}/events` |Single Protocol Standard အတိအကျ ကွန်ရက်စာရင်းတောင်းဆိုချက် |call lifecycle stream ကိုခေါ်ယူပါ။|
|`/v1/kaigi/relays` |allow list operator တောင်းဆိုချက် |Relay summary ကို |
|`/v1/kaigi/relays/{relay_id}` |allow list operator တောင်းဆိုချက် |အဆက်အသွယ်တစ်ခုရဲ့ မှတ်ပုံတင်နဲ့ ကျန်းမာရေး အသေးစိတ်အချက်အလက်တွေ|
|`/v1/kaigi/relays/health` |allow list operator တောင်းဆိုချက် |စုစုပေါင်း Relay ကျန်းမာရေး |
|`/v1/kaigi/relays/events` |Single Protocol Standard အတိအကျ ကွန်ရက်စာရင်းတောင်းဆိုချက် |Relay မှတ်ပုံတင်ခြင်းနှင့် ကျန်းမာရေးဖြစ်စဉ်စီးဆင်းမှု |

App API ကို activated လုပ်ထားရပါမယ်။ Relay summary နဲ့ health routes တွေဟာ စာဖတ်လို့သာရတဲ့ operator surfaces ဖြစ်ပေမဲ့ လက်မှတ်မထိုးထားတဲ့ `curl` request ကတော့ Kaigi နယ်ပယ်ဖြစ်ရပ်များမှတစ်ဆင့်လည်း ထင်ဟပ်သည်။ ဥပမာ `KaigiRosterSummary`၊ `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated` နှင့် `KaigiUsageSummary` တို့။

### CLI မီးခိုး စမ်းသပ်မှု {#cli-smoke-test}

စလိုက်ပါ `iroha app kaigi` CLI a ကို စစ်ဆေးချင်တဲ့အခါ Torii API endpoint က လက်ခံတယ်။ Kaigi ချိတ်ဆက်ခြင်းမတိုင်မီ ငွေချေးမှု UI. Quickstart command က configured ကို ဆန့်ကျင်တဲ့ room တစ်ခုကို ဖန်တီးပေးတယ်။ API endpoint နဲ့ call ID ကို ရိုက်နှိပ်ပြီး metadata တွေကို ပေါင်းထည့်ပေးတယ်။

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

scripted စီးဆင်းမှုအတွက် အခန်းသက်တမ်း စက်ဝန်းကို တိတိကျကျ စီမံခန့်ခွဲပါ။

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

အသုံးပြုခြင်း `--room-policy public` ကြည့်ရှုသူလက်မှတ်မပါဘဲ Relay တွေက ထုတ်လွှင့်နိုင်တဲ့ အခန်းများအတွက်၊ သို့မဟုတ် `--room-policy authenticated` Exits တွေမှာ Viewer Authentication လိုနေရင် သုံးပါ။ `--privacy-mode zk-roster-v1` ကွန်ရက်က Kaigi စာရင်းနှင့် အသုံးပြုမှု စစ်ဆေးရေး ခလုတ်များ ဖွဲ့စည်းထားသည်၊ အခြားနည်းဖြင့် ချိတ်ဆက်ခြင်း၊ စာရွက်များ၊ ပြီးတော့ သီးသန့်သုံးစွဲမှု မှတ်တမ်းတွေဟာ deterministic verification လုပ်နေစဉ်မှာ ကျရှုံးသွားပါတယ်။

### JavaScript ပေါင်းစပ်ခြင်း {#javascript-integration}

လက်ရှိ [Iroha JavaScript demo ကို](https://github.com/soramitsu/iroha-demo-javascript) ပရိုတိုကောရဲ့ အချက်အလက်တွေကို မဖေါ်ပြဘဲ၊ `zk-roster-v1` proof flow. ၎င်းရဲ့ renderer က ဖန်တီးပေးတယ်။ WebRTC ကမ်းလှမ်းချက်တွေနဲ့ ဖြေဆိုချက်တွေ၊ အခွင့်ထူးခံ တံတားတစ်ခုက ဒေသတွင်းသုံးတဲ့ [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) စာရင်းပေးသွင်းရန်၊ လက်မှတ်ရေးထိုးရန်၊ တင်ပြရန်နှင့် အဆုံးသတ်ရန်စောင့်ဆိုင်းရန် checkout Kaigi ငွေပေးချေမှု။

[Kaigi ကို JavaScript App တွင်ထည့်သွင်းထားသည်](/my/guide/tutorials/kaigi.md) ကိုကြည့်ပါ လမ်းကြောင်းအစစ်အမှန်၊ ဖိတ်ကြားမှုပုံစံ၊ တံတားနယ်နိမိတ်နဲ့ လက်ရှိ demo စမ်းသပ်မှု အမိန့်များ။

## အခြေအနေနှင့် မက်ထရစ်များ {#status-and-metrics}

အခြေအနေနှင့် မက်ထရစ်များ API အဆုံးမှတ်များသည် Dashboard များထဲတွင် ပထမဦးစွာ ထည့်သွင်းရန် လိုအပ်သည်-

- `/status` ကွန်ရက်ထိပ်တန်း peer, block, queue နဲ့ consensus fields တွေကို ဖော်ပြတယ်။
- `/metrics` က Prometheus counters တွေ၊ gauges တွေနဲ့ histograms တွေကို ဖေါ်ပြပါတယ်။

Nexus လုပ်နိုင်သော node များတွင် status output တွင် execution lane နှင့် data space-aware sections တို့လည်း ပါဝင်သည်။ `nexus.enabled = false` ရှိသောအခါ ထို sections များကို ချန်ထားခြင်းဖြစ်သည်။

## JSON vs Norito {#json-vs-norito}

Operator API အဆုံးသတ်မှတ်ချက်များစွာက default အနေနဲ့ Norito ကိုပြန်ပို့ပေးပါတယ်။ API အဆုံးသတ်မှတ်ချက်က JSON ကိုထောက်ပံ့တဲ့အခါမှာ၊

```http
Accept: application/json
```

ဒါက အထူးသဖြင့် အသုံးဝင်ပါတယ်။

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

API အပြီးသတ်မှတ်ချက်တစ်ခုက Norito ကို တိုက်ရိုက်လက်ခံတဲ့အခါ (သို့) ပြန်ပို့တဲ့အခါမှာ `application/x-norito` ကို အကြောင်းအရာအမျိုးအစား (သို့) ဦးစားပေး `Accept` တန်ဖိုးအဖြစ်အသုံးပြုပါ။ သယ်ယူပို့ဆောင်မှု အသေးစိတ်အတွက် [Norito](/my/reference/norito.md#torii-and-norito-rpc) ကိုကြည့်ပါ။

## Telemetry Profiles များ {#telemetry-profiles}

API အဆုံးမှတ်ရဲ့ မြင်နိုင်မှုက node ရဲ့ `telemetry.profile` သတ်မှတ်ချက်အပေါ် မူတည်ပါတယ်။ လက်ရှိ ဖွဲ့စည်းပုံက profile အဆင့်ငါးခုကို ဖော်ပြတယ်။

|Profile ကို |`/status` |`/metrics` |ဆောက်လုပ်ရေးလမ်းကြောင်းများ |
| ----------- | --------- | ---------- | ---------------- |
|`disabled` |မဟုတ်ဘူး။|မဟုတ်ဘူး။|မဟုတ်ဘူး။|
|`operator` |ဟုတ်ပါတယ်|မဟုတ်ဘူး။|မဟုတ်ဘူး။|
|`extended` |ဟုတ်ပါတယ်|ဟုတ်ပါတယ်|မဟုတ်ဘူး။|
|`developer` |ဟုတ်ပါတယ်|မဟုတ်ဘူး။|ဟုတ်ပါတယ်|
|`full` |ဟုတ်ပါတယ်|ဟုတ်ပါတယ်|ဟုတ်ပါတယ်|

## CLI ဖြတ်လမ်းများ {#cli-shortcuts}

`iroha` CLI ကတော့ ဒီ API အဆုံးအဖြတ်များစွာကို ပိတ်ထားပြီးသားပါ။

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## အထက်ပိုင်းဆိုင်ရာ ရည်ညွှန်းချက်များ {#upstream-references}

- [README API နှင့် လေ့လာနိုင်မှု အနှစ်ချုပ်](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 တံတား အကောင်အထည်ဖော်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md)
