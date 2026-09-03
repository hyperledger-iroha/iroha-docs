---
translation_locale: my
translation_source: /reference/torii-endpoints.md
translation_source_hash: 29cb291e63f427a4e71296e4244eaf71dc4651d486e3d15fb3d1045230f6023e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii အဆုံးသတ်ချက်များ {#torii-endpoints}

Torii အဲဒါက HTTP, SSE, နှင့် WebSocket ဂိတ်တံခါး Iroha 3. ၎င်းဟာ စာရင်းအင်းကို မျက်နှာပြုပြီး နှစ်ခုစလုံးအတွက် အသုံးဝင်ပါတယ်။ APIs အော်ပရေတာအဆုံးမှတ်တွေပေါ့။

လက်ရှိ စည်းမျဉ်းစည်းကမ်းများမှာ-

- Canonical binary format သည် Norito ဖြစ်သည်။
- အဆုံးအဖြတ်များစွာကလည်း ထောက်ခံတယ်။ JSON ပေးပို့တဲ့အခါ `Accept: application/json`
- metrics တွေကို Prometheus format မှာ ဖော်ပြထားပါတယ်

ဖွဲ့စည်းပုံ အသေးစိတ်၊ အကြောင်းအရာ ညှိနှိုင်းမှု၊ စီမံကိန်း အလံများ၊ schema hashes များအတွက်နှင့် Norito RPC လမ်းညွှန်ချက်၊ [Norito ရည်ညွှန်းချက်](/my/reference/norito.md).

## တူညီသော အဆုံးသတ်ချက်များ {#common-endpoints}

|အဆုံးသတ်ချက် |Format ကို |ရည်ရွယ်ချက်|
| --- | --- | --- |
|`POST /v1/pipeline/transactions` |Norito |လက်မှတ်ရေးထိုးထားတဲ့ ငွေပေးချေမှု တင်ပြပါ|
|`POST /v1/query` |Norito |လက်မှတ်ထိုးသော မေးမြန်းချက်ကို တင်ပြပါ |
|`GET /v1/events/ws` |WebSocket |Event streams ကို subscribe လုပ်ပါ |
|`GET /v1/events/sse` |SSE |SSE ကျော် Event Streams ကို Subscribe လုပ်ပါ။ |
|`GET /v1/blocks/stream` |WebSocket |ချုပ်ဆိုထားသော ဘလော့များ Stream |
|`GET /v1/peers` |JSON |Torii မှ ထုတ်ပြန်ထားသော အချိုးအစားစာရင်း|
|`GET /livez` |စာသား|လုပ်ငန်းစဉ်တစ်ခုတည်းသော သက်ရှိစွမ်းဆောင်ရည်၊ ပရိုတိုကောလက်လျှာက်မှု မဆိုလိုပါ။ |
|`GET /readyz` |JSON |offline cash checks အပါအဝင် node အသင့်ရှိမှုပြည့်စုံခြင်း |
|`GET /health` |JSON |ပြင်ဆင်မှု စွန်ဒါနဲ့အတူတူ offline-cash invariant ကို |
|`GET /v1/api/version` |စာသား|လက်ရှိ Block Header ဗားရှင်းများ |
|`GET /status` |Norito သို့မဟုတ် JSON |အဆင့်မြင့် ရောဂါစစ်ဆေးမှုအခြေအနေ၊ JSON ကို ရှင်းလင်းစွာ တောင်းဆိုခြင်း |
|`GET /metrics` |Prometheus |Prometheus scrape အဆုံးမှတ် |
|`GET /v1/schema` |JSON |Data-model schema snapshot ကို node က activated လုပ်တဲ့အခါမှာ ပြသပေးပါတယ်။ |
|`GET /openapi` သို့မဟုတ် `GET /openapi.json` |JSON | OpenAPI တက်ကြွမှုအတွက် စာရွက်စာတမ်း Torii HTTP လမ်းကြောင်းများ |
|`GET /v1/parameters` |JSON |Node Parameters snapshot ကို ရိုက်ယူပါ|
|`GET /v1/node/capabilities` |JSON |Node အရည်အသွေးနှင့် ဒေတာပုံစံ metadata များ |
|`GET /v1/time/now` |JSON |Node နံရံနာရီ snapshot ကို |
|`GET /v1/time/status` |JSON |အချိန်ပေါင်းစပ်မှုအခြေအနေ |

SSE တောင်းဆိုချက်အတွက် ဒေသခံစီးကြောင်းကို ထပ်မံရိုက်ထည့်လိုက်တဲ့ ကျော့ပြန်မှုတစ်ခုနဲ့ ကြော်ငြာပါ။

```http
Accept: text/event-stream, application/json
```

Torii သည် ပထမဦးဆုံးအားဖြင့် JSON သို့မဟုတ် Norito ကိုယ်စားပြုချက်ကို တောင်းဆိုမှုလွှာတွင် ညှိနှိုင်းပြီးနောက် ဒေသခံ `text/event-stream` တုံ့ပြန်မှုကို အတည်ပြုသည်။ ထို့ကြောင့် `text/event-stream` ကိုသာ ပို့ခြင်းသည် `406` ဖြင့် ပယ်ချခံရသည်။ [ စီးမျောမှုဖြစ်စဉ်နည်းလမ်း ](/my/cookbook/stream-events.md) တွင်အပြည့်အစုံသော ခေါင်းစီးကို အသုံးပြုသည်။

`/openapi` အစီအစဉ်မှာ ဖော်ပြထားတဲ့ လမ်းကြောင်းတွေအတွက် အဓိကထုတ်လုပ်တဲ့ စာချုပ်ပါ။ လက်ရှိစာရွက်စာတမ်းမှာ အပြည့်အဝ လုပ်ဆောင်မှု စူးစမ်းစစ်ဆေးရေး စာရင်းမရှိပါဘူး။ `/livez` နှင့် `/readyz`, ၎င်း၏ `/health` သရုပ်ဖော်ချက်က အသင့်ရှိမှု စီမံခန့်ခွဲရေးကို နောက်ကျသွားနိုင်သည်။ တိုက်ရိုက်စာရွက်စာတမ်းမှ လမ်းကြောင်းဖောက်သည်များကို ဖန်တီးပါ။ ဒါပေမဲ့ တက်ကြွမှုနဲ့ အသင့်ရှိမှုကို ပြေးနေတဲ့ node နဲ့ ပိတ်ထားတဲ့ handle တွေနဲ့ တိုက်ရိုက် အတည်ပြုပါ။ တိကျတဲ့ မျက်နှာပြင်က build features နဲ့ runtime configuration တွေအပေါ် မူတည်နေဆဲပါ။ [Torii API console ကို](/my/reference/torii-api-console.md) ဒီလက်ရှိစာရွက်စာတမ်းကို တင်ဖို့ စမ်းသပ်ပါ။ JSON လမ်းကြောင်းများ၊ ပုံတူ curl request တွေကို လုပ်ပြီး လက်ရှိ schema ကနေ client code ကို ထုတ်ပေးပါ။

## Taira တိုက်ရိုက်လမ်းကြောင်းတွေကို စမ်းကြည့်ပါ။ {#try-live-taira-routes}

အများပြည်သူ Taira testnet သည် application clients များက read-only exploration အတွက် အသုံးပြုသော Torii JSON မျက်နှာပြင်ကိုပဲ ဖော်ပြသည်။ ဤအမိန့်များအတွက် key တွေလိုအပ်ခြင်းမရှိပါ။

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

အများသုံး testnet လမ်းကြောင်းတစ်ခုက `502` ကိုပြန်ပို့ပေးပါက (သို့) အချိန်ဖြတ်ပြီး (သို့) ကျေနပ်နေတဲ့ queue တစ်ခုကို အစီရင်ခံပေးပါက အဆုံးအမှတ်ရရှိမှုပြဿနာတစ်ခုအဖြစ် ကုသခြင်းနှင့်နောက်ပိုင်းတွင် သင်၏ဖောက်သည်ကုဒ်ကို debugging မလုပ်ခင် ပြန်ကြိုးစားပါ။

## သဘောတူညီချက်နှင့် Runtime အဆုံးသတ်မှတ်ချက်များ {#consensus-and-runtime-endpoints}

|အဆုံးသတ်ချက် |Format ကို |ရည်ရွယ်ချက်|
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |မကြာသေးမီက ကတိပေးချမှတ်ချက် အနှစ်ချုပ်များ |
|`GET /v1/sumeragi/validator-sets` |JSON |Validator Set သမိုင်း |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |အတည်ပြုကိရိယာကို ဘလော့ အမြင့်မှာ သတ်မှတ်ထားတယ်။|
|`GET /v1/sumeragi/status` |Norito သို့မဟုတ် JSON |အသေးစိတ် သဘောတူညီချက် အခြေအနေ snapshot ကို |
|`GET /v1/sumeragi/status/sse` |SSE |ဆက်တိုက် သဘောတူညီမှုအခြေအနေစီးကြောင်း |
|`GET /v1/sumeragi/leader` |JSON |လက်ရှိ ခေါင်းဆောင် သတင်းအချက်အလက် |
|`GET /v1/sumeragi/qc` |Norito သို့မဟုတ် JSON |နောက်ဆုံး Quorum-certificate အနှစ်ချုပ်|
|`GET /v1/sumeragi/checkpoints` |JSON |သဘောတူညီချက် စစ်ဆေးရေးစခန်း အတိုကောက် |
|`GET /v1/sumeragi/consensus-keys` |JSON |Active Consensus Key များ |
|`GET /v1/sumeragi/bls_keys` |JSON |Active BLS သဘောတူညီချက် ခလုတ်များ |
|`GET /v1/sumeragi/phases` |JSON |နောက်ဆုံးအဆင့်တစ်ခုချင်း latency နမူနာ |
|`GET /v1/sumeragi/rbc` |JSON |RBC session နဲ့ throughput metrics တွေ|
|`GET /v1/sumeragi/rbc/sessions` |JSON |တက်ကြွတဲ့ RBC အစည်းအဝေး snapshot |
|`GET /v1/sumeragi/pacemaker` |JSON |နှလုံးခုန်စက်အခြေအနေ |
|`GET /v1/sumeragi/params` |JSON |လက်ရှိ ချိတ်ဆက်ထားသော ပမာဏများ Sumeragi |
|`GET /v1/sumeragi/collectors` |JSON |Deterministic Collector အစီအစဉ်ရဲ့ snapshot ကို |
|`GET /v1/sumeragi/key-lifecycle` |JSON |သဘောတူညီချက် အဓိက သက်တမ်း စက်ဝန်း အခြေအနေ |
|`GET /v1/sumeragi/telemetry` |JSON |Consensus telemetry snapshot ကို ရိုက်ယူပါ|
|`GET /v1/sumeragi/evidence` |JSON |အတည်ပြုချက် မှတ်တမ်းများ၊ ရွေးချယ်မှုအရ မေးမြန်းမှု string ဖြင့် စစ်ဆေး |
|`GET /v1/sumeragi/evidence/count` |JSON |အထောက်အထား မှတ်တမ်းအရေအတွက်|
|`POST /v1/sumeragi/evidence/submit` |JSON |သဘောတူညီမှု အထောက်အထားတွေ တင်ပြပါ။|
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito သို့မဟုတ် JSON |Block hash အတွက် QC မှတ်တမ်းကို commit လုပ်ပါ။ |
|`GET /v1/runtime/abi/active` |JSON |Active runtime ABI သရုပ်ဖော်ချက် |
|`GET /v1/runtime/abi/hash` |JSON |Active runtime ABI hash |
|`GET /v1/runtime/metrics` |JSON |Runtime မက်ထရစ်များ snapshot ကို |
|`GET /v1/runtime/upgrades` |JSON |Runtime မြှင့်တင်ခြင်းစာရင်း |
|`POST /v1/runtime/upgrades/propose` |JSON |Runtime ကို upgrade လုပ်ဖို့ အဆိုပြုပါ |
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |အဆိုပြုထားတဲ့ runtime upgrade ကို activate လုပ်ပါ။ |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |အဆိုပြုထားတဲ့ runtime upgrade ကို ဖျက်သိမ်းပါ။ |

## App နှင့် SORA လမ်းကြောင်းမိသားစုများ {#app-and-sora-route-families}

Torii ကို app-facing feature set ဖြင့်တည်ဆောက်တဲ့အခါ စူးစမ်းရှာဖွေသူများအတွက် နောက်ထပ် JSON မိသားစုများ၊ SORA ဝန်ဆောင်မှုများ၊ တံတားစီးကြောင်းများ၊ အထောက်အထားများနှင့် သိုလှောင်မှုများကို ဖော်ပြသည်။ ဤမိသားစုအားလုံးသည်ကွန်ရက်ပရိုဖိုင်တိုင်းတွင်စွမ်းဆောင်နိုင်ခြင်းမရှိပါ။

|လမ်းကြောင်း မိသားစု |ရည်ရွယ်ချက်|
| --- | --- |
|`/v1/accounts/`, `/v1/domains/`, `/v1/assets/*`|JSON စာဖတ်သူ၊ မေးမြန်းမှု အကူအညီပေးသူ၊ တင်သွင်းခြင်း အကူအညီ ပေးသူ၊ ပရိုဖိုင် (သို့) ထိန်းသိမ်းသူ အမြင်များ |
|`/v1/nfts/`, `/v1/rwas/`, `/v1/confidential/*`|NFT, ဒိဌလောကဝင်ငွေများနှင့် လျှို့ဝှက်ဝင်ငွေများကို ကြည့်ရှုခြင်း |
|`/v1/aliases/`, `/v1/assets/aliases/`, `/v1/sns/`၊ `/v1/identifiers/` |နာမည်၊ အမည်မဖော်လိုသူနှင့် မှတ်သားရေးမှတ်ချက် |
|`/v1/explorer/*` |Explorer-oriented account, asset, block, transaction, instruction, metric နဲ့ stream view တွေကို ကြည့်ပါ။|
|`/v1/transactions/`, `/v1/pipeline/`, `/v1/iso20022/*`|ငွေပေးချေမှု သမိုင်း၊ ရေငွေ့လိုင်း ပြန်လည်ထူထောင်ခြင်း သို့မဟုတ် အခြေအနေနှင့် ISO 20022 အကူအညီများ |
|`/v1/contracts/*` |Contract code, deployment, bundle, call, view, event, activity, rollup နဲ့ state routes တွေကို တင်ပေးပါ။ |
|`/v1/multisig/`, `/v1/controls/` |Multisig အဆိုပြုချက်များ၊ ခွင့်ပြုချက်များနှင့် လွှဲပြောင်းမှုထိန်းချုပ်ရေး အကူအညီများ |
|`/v1/bridge/`, `/v1/ledger/`, `/v1/proofs/*`|အပြီးသတ်ချက်၊ ပြည်နယ်သက်သေ၊ ပိတ်ဆို့မှုသက်သေ၊ သက်သေခံ ထိန်းသိမ်းခြင်းနဲ့ သက်သေခံမေးမြန်းမှု လမ်းကြောင်းများ |
|`/v1/da/*` |ဒေတာရရှိနိုင်မှုသုံးစွဲမှု၊ ထုတ်ပြန်ချက်များ၊ အထောက်အထားမူဝါဒများ၊ ကတိပေးချက်များနှင့် ပစ်မှတ်ရည်ရွယ်ချက်များ |
|`/v1/zk/*` |ZK root, proof verification, IVM proofing, vote counting, verification keys, proof records, and attachments  အတည်ပြုချက်များအား စစ်ဆေးခြင်း|
|`/v1/gov/`, `/v1/ministry/` |အုပ်ချုပ်ရေး အဆိုပြုချက်များ၊ မဲစာရင်းများ၊ ကောင်စီအခြေအနေ၊ ကာကွယ်ထားသော နာမည်နေရာများ၊ အစီအစဉ်ဆိုင်ရာ အဆိုပြုချက် များ၊ ဥပဒေချမှတ်ခြင်းနှင့် နောက်ဆုံးသတ်မှတ်ခြင်း |
|`/v1/nexus/`, `/v1/sccp/` |Nexus လမ်းကြောင်း၊ ဒေတာနေရာနဲ့ cross-chain proof အကူအညီများ|
|`/v1/musubi/*` |Musubi package registry readers နဲ့ ညွှန်ကြားချက် ဆောက်လုပ်သူများ |
|`/v1/subscriptions/*` |စာရင်းသွင်းခြင်း အစီအစဉ်များ၊ စာရင်းသွင်းသက်တမ်း စက်ဝန်း၊ အသုံးပြုမှုနှင့် အကူအညီတောင်းခံသူများ |
|`/v1/sorafs/`, `/sorafs/`, `/.well-known/sorafs/*`|SoraFS ပေးသွင်းသူ ရှာဖွေမှု၊ စွမ်းဆောင်မှု သက်သေခံမှု၊ ပိုက်ချိတ်ခြင်း၊ သိုလှောင်ခြင်း၊ အများပြည်သူအတွက် ထုတ်လွှင့်ပေးခြင်း |
|`/v1/soracloud/`, `/v1/soradns/`, `/soradns/`၊ `/api/` |SoraCloud ဝန်ဆောင်မှုသက်တမ်းကာလ၊ ပုဂ္ဂလိက ကွန်ပျူတာ/မော်ဒယ်စီးကြောင်းများ၊ အများပြည်သူ ရှာဖွေခြင်းနှင့် ဟိုတယ် အက်ပ်များကို လမ်းညွှန်ပေးခြင်း |
|`/v1/connect/`, `/v1/vpn/` | Iroha ချိတ်ဆက်မှု အစည်းအဝေးတွေ၊ WebSocket ပို့ဆောင်ရေး၊ VPN အစည်းအဝေးများ၊ ပရိုဖိုင်းများနှင့် လက်မှတ်များ |
|`/v1/app-api/`, `/v1/api/`, `/v1/content/*`|App API ချိတ်ဆက်ချက်များနှင့် bundle/CID ထောက်ပံ့ထားသော content routing |
|`/v1/operator/*`, `/v1/mcp` |Operator authentication နှင့် native MCP JSON-RPC bridge ကို|
|`/v1/offline/`, `/v1/repo/`, `/v1/space-directory/`၊ `/v1/ram-lfe/` |အွန်လိုင်းပြင်ဆင်မှု, မှတ်ပုံတင်သဘောတူညီချက်များ, ဒေတာနေရာထုတ်ပြန်ချက်များနှင့် [RAM-LFE အကူအညီပေးသူများ ](/my/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/`, `/v1/webhooks/`, `/v1/notify/`၊ `/v1/telemetry/` |ပူးပေါင်းဆောင်ရွက်မှု, webhook, push အသိပေးချက်များနှင့် live telemetry ပေါင်းစပ်ခြင်း |

## Account Authentication, Visibility နှင့် Explorer Cursors များ {#account-authentication-visibility-and-explorer-cursors}

App-facing ledger read တွေမှာ optional canonical account-signature boundary တစ်ခုကို သုံးပါတယ်။ လက်မှတ်မထိုးသေးတဲ့ တောင်းဆိုချက်တစ်ခုက တက်ကြွတဲ့ အများသုံး ဒေတာစေးတွေသာ ရရှိတယ်။ သက်ဝင်လက်မှတ်ထိုးထားတဲ့တောင်းဆိုချက်တစ်ခုဟာ ဖုန်းခေါ်သူရဲ့ ဒေတာစေ့တွေကို ချိတ်ဆက်ပေးပါတယ်။ လက်ရှိ UAID အဲဒီအကောင့်ရဲ့ ဒေတာနေရာလမ်းကြောင်းတွေကို တိကျစွာ `CanReadRestrictedDataspace` ခွင့်ပြုချက်များ။ `CanReadAllLedgerData` ဒေတာနေရာတိုင်းမှာ မြင်နိုင်မှုပေးတယ်။ `X-Iroha-Account`, ဒါမှမဟုတ် မပြည့်စုံတဲ့ (သို့) မှားယွင်းနေတဲ့ လက်မှတ် ခေါင်းစဉ်တွေ တစ်စုံတစ်ရာ ပြန်ပေးထားတယ်။ `401 Unauthorized`; ဒါက အမည်မဲ့ မြင်နိုင်မှုဆီ ပြန်မကျဘူး။

NFT, RWA, holder နှင့် Explorer တို့သည်စာရင်း၊ ဒိုမင်၊ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များနှင့်အတူတူသော မြင်နိုင်မှုအရာဝတ္ထုများကို စစ်ဆေးသည်။ ပျောက်ကွယ်နေသည့် အရာဝတ္ထုတစ်ခုနှင့်ခေါ်သူ၏မြင်နိုင်တဲ့လမ်းကြောင်းအပြင်ရှိရာ အရာဝတ္ထုကို ရည်ရွယ်၍ ခွဲခြားမရပါ။ Transaction အတွက် မှတ်တမ်းတင်ထားသော route leg တစ်ခုချင်းစီကို မြင်နိုင်သည့်အခါသာ Committed transaction နှင့် instruction history ကိုပြသပေးပါသည်။ ဒါကြောင့် ပါဝင်သူရဲ့ ခြေထောက်တစ်ခုတောင်မှ ဖုန်းခေါ်ဆိုသူရဲ့ နယ်ပယ်အပြင်မှာ ရှိတဲ့အခါ ပုန်းကွယ်နေတာပါ။ ပျောက်နေတဲ့၊ ခေတ်မမီတဲ့ (သို့) မှားယွင်းတဲ့ လမ်းညွှန်ရေး အခြေအနေဟာ ကမ္ဘာလုံးဆိုင်ရာ စာဖတ်သူအတွက်သာ မြင်နိုင်တာပါ။

Torii သည် SSE, WebSocket၊ စာချုပ်ဖြစ်စဉ်နှင့်ပြန်လည်ကစားခြင်းလမ်းကြောင်းများပေါ်တွင် အသုံးပြုသူစစ်ဆေးခြင်း၊ စာမျက်နှာပြုပြင်ခြင်း၊ ရေတွက်ခြင်း သို့မဟုတ် ခန့်မှန်းမှုမလုပ်မီ ဤအကန့်အသတ်ကိုအသုံးပြုသည်။ သက်တမ်းရှည် streams များသည် ledger ခွင့်ပြုချက်များကိုပြောင်းလဲသည့်အခါတူညီသော ခွင့်ပြုချက်ကို ပြန်လည်တန်ဖိုးဖြတ်ပြီး ဝင်ရောက်ခွင့်ရှိပြီးနောက် ယေဘုယျ ခွင့်ပြုမှု ကျရှုံးမှုဖြင့် အဆုံးသတ်သည်။ ရုပ်သိမ်းခံရတယ်။

ကမ္ဘာအနှံ့ထောက်ပံ့ထားတဲ့ Explorer ကော်လီကေးရှင်း ခြောက်ခုမှာ ပွင့်လင်းမြင်သာမှုမရှိတဲ့ base64url ခလုတ်စု ညွှန်ပြချက်တွေကို အသုံးပြုပါတယ်။ ကြိုတင်သတ်မှတ်ထားသော စာမျက်နှာက ၂၅၊ အမြင့်ဆုံးက ၁၀၀ဖြစ်ပြီး စာမျက်နှာတစ်ခုဟာ အများဆုံး 512 ပြိုင်ဘက်ခလုတ်ကို စစ်ဆေးတယ်။ Cursor တစ်ခုစီဟာ ၎င်းရဲ့ စုစည်းမှု၊ စစ်ဆေးမှုတွေ၊ Canonical Last Key နဲ့ ဖုန်းခေါ်သူရဲ့ မြင်နိုင်တဲ့ လမ်းကြောင်း-set digest တွေနဲ့ ချည်နှောင်ထားလို့ အခြားမေးခွန်းတစ်ခုမှာ (သို့) ဖုန်းခေါ်သူ၏ မြင်နိုင်စွမ်း ပြောင်းလဲပြီးနောက်မှာ ပြန်လည်ကစားလို့မရပါဘူး။

ဘလော့၊ ငွေပေးချေမှု၊ နောက်ဆုံး ငွေလဲလှယ်မှု၊ ညွှန်ကြားချက်နဲ့ နောက်ဆုံး ညွှန်ပြချက်များ history cursors တွေက commit snapshot အမြင့်ကို ထပ်မံသတ်မှတ်ပြီး hash ကို ပိတ်ထားတယ်။ တုံ့ပြန်မှု ထုတ်ဖော် `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`, နှင့် `pagination.has_more`. အခြားလမ်းကြောင်း (သို့) စစ် filter set အတွက် cursor တစ်ခု၊ changed visibility digest တစ်ခု၊ (သို့) node က validate လုပ်လို့မရတော့တဲ့ snapshot ကို ပိတ်ထားတယ်။ Torii ရဲ့ query-admission ခွင့်ပြုချက်အတွင်းမှာ မှတ်တမ်းကို စကင်လုပ်နေတုန်း blocking worker က run လုပ်နေတာပါ။

Explorer WebSocket streams က filtered summaries တွေကို emit လုပ်ပေးပြီး ledger ခွင့်ပြုချက်တွေ ပြောင်းလဲလာတာနဲ့အမျှ အမြင်အာရုံကို ပြန်လည် တွက်ချက်ပေးပါတယ်။ ဒေသခံ `GET /v1/blocks/stream` လမ်းကြောင်းက ခြားနားပါတယ်: ၎င်းဟာ complete ကို emit ပါတယ်။ လက်ညှိနှိုင်းမှုအတွင်း `CanReadAllLedgerData` ကိုလိုအပ်ပြီး ထိုခွင့်ပြုချက်ကို နောက်ပိုင်း ပယ်ဖျက်လိုက်ပါက ပိတ်ထားသည်။ ဒေတာနေရာကို စကုပ်ထားတဲ့ Explorer အတွက် native stream ကို မသုံးပါ။

တိုက်ရိုက် `GET /v1/sumeragi/status/sse` သဘောတူညီချက်-စစ်ဆေးမှုစီးကြောင်းသည်လည်းမည်မသိဒေတာနေရာ feed မဟုတ်ပါ။ ဆက်သွယ်ရေးကြိုးပမ်းတိုင်းတွင် operator-signature ခေါင်းစဉ် quartet အပြည့်အဝလိုအပ်သည်။ ဖောက်သည်များက တိကျတဲ့စီးကြောင်း URI အတွက် လက်မှတ်သစ်တစ်ခု ဖန်တီးပြီး အလိုအလျောက် သယ်ယူပို့ဆောင်မှု ထပ်မံကြိုးစားခြင်းဖြင့် ညွှန်ကြားချက်များကို လိုက်နာခြင်း သို့မဟုတ် လက်မှတ်ထိုးထားသော ကြိုးပမ်းမှုကို ပြန်လည်ကစားခြင်းမရှိပါ။

## ISO 20022 တံတား {#iso-20022-bridge}

Torii ပွင့်လင်းမြင်သာမှု ISO 20022 တံတားအောက် `/v1/iso20022/*` app ကို မျက်နှာပြုတဲ့အခါမှာ API တံတားက ရည်ရွယ်ချက်ရှိပြီး အသုံးချမှုမရှိပါ။ ISO 20022 ရှင်းလင်းရေးဂိတ်တံခါး၊ ဒါပေမဲ့ ရွေးချယ်ထားတဲ့ ငွေပေးချေမှု သတင်းအချက်အလက်တွေကို လက်မှတ်ထိုးချက်အဖြစ် ပြောင်းဖို့ ထောက်ပံ့တဲ့ အစိတ်အပိုင်းစု Iroha ငွေလွှဲပြောင်းခြင်းများနှင့် ၎င်းတို့၏ စာရင်းအင်းအခြေအနေကို ခြေရာခံရန်အတွက်ပါ။

### Torii ISO 20022 နိဂုံးချုပ်ချက်များ {#torii-iso-20022-endpoints}

|နည်းစနစ်နဲ့ အဆုံးသတ်ချက် |ရည်ရွယ်ချက်|
| --- | --- |
|`POST /v1/iso20022/pacs008` |FI-to-FI customer credit transfer ကို တင်သွင်းပြီး သင့်တော်တဲ့ Iroha asset transfer ကို တည်ဆောက်ပါ။ |
|`POST /v1/iso20022/pacs009` |FI မှFI သို့ PvP သို့မဟုတ် စာရင်းအင်းများနှင့် ဆက်စပ်သည့် ငွေကြေးထောက်ပံ့မှုအတွက် အသုံးပြုသော ချေးငွေလွှဲပြောင်းမှုကို တင်ပြပါ။ |
|`POST /v1/iso20022/pacs002` |ငွေပေးချေမှုအခြေအနေ အစီရင်ခံစာကို တင်ပြပါ  ငွေပေးချေးမှု လိုအပ်ချက်များ|
|`POST /v1/iso20022/pacs004` |ငွေပေးချေမှု ပြန်လည်ထုတ်ပြန်ချက် ပေးပို့ခြင်း|
|`POST /v1/iso20022/camt056` |originator ပိုင်ဆိုင်သော ငွေပေးချေမှုကို ဖျက်သိမ်းရန် တောင်းဆိုချက် တင်ပြပါ |
|`POST /v1/iso20022/sese023` |စာရွက်စာတမ်းများ ဖြေရှင်းရန် ညွှန်ကြားချက် ပေးပို့ခြင်း |
|`POST /v1/iso20022/sese024` |ငွေပေးချေမှု အခြေအနေကို အပြန်အလှန်ပိုင်ဆိုင်သော စာရွက်စာတမ်းများတွင် သတင်းပို့ခြင်း |
|`POST /v1/iso20022/sese025` |ငွေလဲလှယ်မှုအထောက်အထားကို အတည်ပြုရန်|
|`POST /v1/iso20022/colr012` |အာမခံ အစားထိုးမှု သတင်းစာကို ပေးပို့ပါ။|
|`GET /v1/iso20022/messages/{msg_id}` |စာတိုတစ်ပုဒ်အတွက် Canonical Bridge မှတ်တမ်းကို ဖတ်ပါ။|
|`GET /v1/iso20022/audit/messages` |အမှားအယွင်းထင်ရှားတဲ့ သတင်းစာ စစ်ဆေးမှု မှတ်တမ်းကို ဖတ်ပါ။|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |လက်ရှိငွေပေးချေမှုအခြေအနေကို `pacs.002` XML အဖြစ်ပြန်ညွှန်းပါ။|
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |လက်ရှိ ငွေပေးချေမှု မှတ်ပုံတင်ကို `pacs.004` XML အဖြစ် ပေးသွင်းပါ။ |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |လက်ရှိ ဖျက်သိမ်းမှု ဆုံးဖြတ်ချက်ကို `camt.029` XML အဖြစ်ပြန်ညွှန်းပါ။ |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |လက်ရှိ ငွေပေးချေမှုအခြေအနေကို `sese.024` XML အဖြစ်ပြန်ညွှန်းပါ။|
|`GET /v1/iso20022/messages/{msg_id}/sese025` |လက်ရှိ ငွေပေးချေမှု အတည်ပြုချက်ကို `sese.025` XML အဖြစ် ပေးပို့ပါ။|

`pacs.008` တင်ပြချက်တွေက သတင်းအချက်အလက်ကို ပေးပို့ရမယ်။ ID, ဘဏ်အချင်းချင်းဖြေရှင်းမှု ပမာဏ၊ ငွေကြေးငွေ၊ ဖြေရှင်းရက်၊ ချုပ်ဆိုသူနှင့် ပေးချေသူ IBANs, အကြွေးရှင်နဲ့ ချေးငွေပေးသူ BICs. Reference data တွေကို configured လုပ်တဲ့အခါ bridge ကလည်း check လုပ်တယ်။ BIC, IBAN, နှင့် ISO 4217 ငွေကြေးဖြတ်သန်းမှု ဖြစ်ပေါ်လာသည့် ငွေပေးချေမှုသည် ဘိုက်လိုင်းသို့ မဝင်မီ။

`pacs.009` စာရွက်စာတမ်းများတွင် စီးပွားရေးသတင်းစကား ID၊ သတင်းစကား အဓိပ္ပါယ်ဖွင့်ဆိုချက် ID၊ ဖန်တီးချိန်၊ ဘဏ်အချင်းချင်းဖြေရှင်းမှု ပမာဏ၊ ငွေကြေးငွေ၊ ဖြေရှင်းသည့်နေ့ရက်တို့ ပါဝင်ရမည်။ ညွှန်ကြားချက်ပေးသူနှင့် ညွှန် ကြားခံသူ BICs နှင့် ချေးငွေရှင်နှင့် ခရက်ဒစ်ရှင် IBANs. သတင်းစာတွင် `Purp` ပါရှိပါက တံတားသည် လက်ရှိတွင် စာရင်းအင်းများအတွက် ငွေကြေးထောက်ပံ့မှုများကိုသာ လက်ခံနေသည်။ `Purp=SECU`

`pacs.008` နှင့် `pacs.009` တင်ပြမှုအဆုံးမှတ်များတွင် XML ISO ပတ်စောင်များ (သို့) တံတားစမ်းသပ်မှုများတွင် အသုံးပြုသော ပွင့်လင်းတဲ့ ကွင်းပုံစံကို လက်ခံနိုင်သည်။ ရွေးချယ်စရာ `SplmtryData` ကွင်းများသည် ရည်မှန်းချက်စာအုပ် Iroha ကို pin လုပ်နိုင်ပါသည်။ အရင်းအမြစ်နှင့်ရည်မှန်းချက်စာရင်း IDs သို့မဟုတ်လိပ်စာများ၊ ပိုင်ဆိုင်မှုဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက် ID။ အဖြေသည် `202 Accepted` နှင့် `message_id`, `transaction_hash`, `status`, `pacs002_code` နှင့် ဖြေရှင်းထားသော လက်မှတ်/စာရင်း/ပိုင်ဆိုင်မှု အခြေအနေဖြစ်သည်။

### ပါဝင်သူ၏ ခွင့်ပြုချက်နှင့် သက်တမ်းပတ်လည်ပိုင်ဆိုင်မှု {#participant-authorization-and-lifecycle-ownership}

အကောင်အထည်ဖော်ထားသော တံတားတိုင်းတွင် ပါဝင်သူစာရင်းရှိသည်။ ပါဝင်သူ စာရင်းတစ်ခုစီမှာ ထူးခြားတဲ့ ပါဝင်သူ ID ၊ လုပ်ငန်းရှင် အများသုံး သော့တစ်လုံး (သို့မဟုတ်) များ၊ ငွေရေးကြေးဆိုင်ရာ မှတ်သားစရာ တစ်ခု (သို့) များ၊ ခွင့်ပြုထားတဲ့ ပရိုဖိုင်စုနှင့် `originator`, `counterparty` သို့မဟုတ် နှစ်ခုစလုံးကဏ္ဍရှိသည်။ `audit_admin_keys` ကို သီးခြားသတ်မှတ်ပါ။ စစ်ဆေးမှု-စီမံအုပ်ချုပ်ရေးမှူး သော့သည်လည်း ပါဝင်သူ အပြောင်းအလဲ သော့ဖြစ်မရနိုင်ပါ။

ISO လမ်းကြောင်းအားလုံးမှာ လုပ်ငန်းရှင်လက်မှတ်သစ်တစ်ခု လိုအပ်ပါတယ်။ ပထမဦးဆုံး `pacs.008`, `pacs.009`, `sese.023` သို့မဟုတ် `colr.012` တင်ပြမှုအတွက် စစ်ဆေးထားတဲ့ လုပ်ငန်းရှင်ဟာ လျှောက်လွှာခေါင်းစဉ် `From` ရဲ့ ငွေရေးကြေးကိုယ်စားလှယ်အဖြစ် သတ်မှတ်ထားတဲ့ ပါဝင်သူကို ပိုင်ဆိုင်ရမှာပါ။ `To` ကိုယ်ပိုင်လက္ခဏာသည် အခြားသတ်မှတ်ထားသော ပါဝင်သူတစ်ဦး၏ နာမည်ကို သတ်မှတ်ရမည်ဖြစ်ပြီး ရွေးချယ်ထားသည့် ပရိုဖိုင်ကို နှစ်ဖက်စလုံးအတွက် ခွင့်ပြုရမည်။ ရေရှည်ဝင်ရောက်မှုသည် မူရင်းဖြစ်သူ၊ အပြန်အလှန်ဘက်၊ ဝင်ရောက်ယှဉ်ပြိုင်သူနှင့် လုပ်ငန်းရှင်ဆော့ဝဲနှင့် မူရင်းပရိုဖိုင်းနှင့် ပေါင်းစပ်လက်မှတ်မူဝါဒများကို မှတ်တမ်းတင်သည်။

သက်တမ်းပတ်လည် ခွင့်ပြုချက်ဟာ ဖုန်းခေါ်သူက ရွေးချယ်တဲ့ တန်ဖိုးတွေထက် ဒီမပြောင်းလဲနိုင်တဲ့ မှတ်တမ်းကနေ ရတာပါ။

|ဘဝပတ်လည် သတင်းစကား |လိုအပ်တဲ့ ပါဝင်သူ |
| --- | --- |
|`pacs.002`, `pacs.004`, `sese.024`၊ `sese.025` |`counterparty` အခန်းကဏ္ဍရှိ မူရင်းပဋိပက္ခသည် |
|`camt.056` |`originator` အခန်းကဏ္ဍနဲ့ မူရင်းထုတ်ပြန်သူ |

မူလ profile နဲ့ လက်မှတ်ရေးထိုးတဲ့ မူဝါဒဟာ တစ်လျှောက်လုံး ပိတ်ထားနေဆဲပါ။ lifecycle ဆိုတော့ ဖုန်းခေါ်သူဟာ update လုပ်ဖို့ အားနည်းတဲ့ profile ကို ရွေးလို့မရဘူး။ `pacs.002` Settlement ကို ကိုယ်စားပြုတဲ့ ကုဒ် (`ACSC`, `ACCP`, `SETT`, ဒါမှမဟုတ် `SETTLED`) မူလစာရင်းကို settled အဖြစ် ပြောင်းလဲလိုက်ပါကသာ Torii ငွေလဲလှယ်မှု အထောက်အထားကို ချုပ်ဆိုခဲ့သူပါ။

မူရင်းပါတီ နှစ်ခုစလုံးသည် ၎င်း၏ သတင်းအချက်အလက် မှတ်တမ်းနှင့် ထုတ် generated outbox စာရွက်စာတမ်းများကိုဖတ်ရှုနိုင်သည်။ စစ်ဆေးရေးအဆုံးမှတ်သည် အထောက်အထားရရှိသူက originator သို့မဟုတ် counterparty ဖြစ်သည့် မှတ်တမ်းများသာ ပြန်လည်ပို့ပေးသည်။ သီးခြားသတ်မှတ်ထားသော စစ်ဆေးရေး အုပ်ချုပ်ရေးမှူးသည် တစ်ကမ္ဘာလုံး စာဖတ်ခြင်းသာ ရှိသည့် စစ်ဆေးမှု အမြင်ကို ရရှိပြီး သတင်းအချက်အလက်များကို ပေးပို့ရန် သို့မဟုတ် ပြောင်းလဲရန် မဖြစ်နိုင်ပါ။ မသိသော ပါဝင်သူများနှင့် ဆက်စပ်မှုမရှိသော သတင်းအချက်အလက် identifikator များကို ထုတ်ပြန်ခြင်း မရှိပါ။

### ခိုင်ခံ့သော ပြန်လည်ဖြန့်ဝေမှု မှတ်တမ်းများနှင့် လက်မှတ်ထိုးထားသော Outbox Documents {#durable-replay-identity-and-signed-outbox-documents}

ISO record store တွေက schema ကိုပဲ လက်ခံကြတယ် V3 မှတ်တမ်းတွေတင်ပြီး သင်္ချိုင်းကျောက်တွေကို ပြန်လည်ပြသတယ်။ Torii တည်ငြိမ်နေတဲ့ ဒေတာက ဒီစခီမားနဲ့ မက်ညီတဲ့အခါ ရှင်းလင်းတဲ့ မလိုက်ဖက်မှုအမှားတစ်ခုနဲ့ စတင်မဖြစ်ဘူး။ ဒီတော့ ပထမဆုံးထုတ်ဝေတဲ့ ဆိုင်တွေနဲ့ ကိရိယာတွေကို ပြန်လည်ဖန်တီးဖို့လိုတယ်။ ချမ်းသာတဲ့ မှတ်တမ်းတိုင်းကို ထိန်းထားတယ်။ မပြောင်းလဲနိုင်တဲ့ ပါဝင်သူရဲ့ မူလနေရာ။ သီးခြား ရေရှည်တည်တံ့တဲ့ သင်္ချိုင်းကျောက်က သတင်းစကားကို ထိန်းထားတယ်။ ID, အသုံးဝင်မှု hash, စီးပွားရေးသတင်းစကား ID, နှင့် UETR ပြီးပြည့်စုံတဲ့ deduplication အတွက် TTL ချမ်းသာတဲ့ မှတ်တမ်း အသေးစိတ်တွေ ဖြတ်ပြီးတောင်ပါ။

Torii သည် Lifecycle သတင်းစကားတစ်စောင်ကို လက်မှတ်မထိုးခင် (သို့) စီမံခန့်ခွဲခြင်းမပြုမီတွင် ပြန်လည်ကစားခွင့်ပြုမှုကို ဆက်လက်တည်ရှိသည်။ သက်တမ်းမကုန်သေးသည့် ပြန်လည်ကစားပိုင်ခွင့်ကို ဘယ်တော့မှ ပယ်ရှားခြင်းမရှိပါ။ သတ်မှတ်ထားသော မှတ်တမ်းအရည်အသွေးသည် TTL ကာကွယ်ထားသော ၀ န်ဆောင်မှုများကိုသာပါဝင်ပါက၊ ဘဝပတ်စဉ် သို့မဟုတ် စာရင်းအင်းအခြေအနေကိုပြောင်းလဲခြင်းမရှိဘဲ ပြန်လည်သုံးစွဲနိုင်သော `503 Service Unavailable` ကိုလွှဲပြောင်းမှုများကိုရရှိပါသည်။

ထုတ်လုပ်မှုတိုင်းမှာ `pacs.002`, `pacs.004`, `camt.029`, `sese.024`, ဒါမှမဟုတ် `sese.025` စာရွက်စာတမ်းကို ပြန်ပို့ခြင်း `application/xml` ဒီတုံ့ပြန်မှု ခေါင်းစဉ်တွေနဲ့:

|ခေါင်းစဉ် |အဓိပ္ပါယ်|
| --- | --- |
|`X-Iroha-Iso-Signature-Domain` |အမြဲတမ်း `iroha.iso20022.outbound.v2`|
|`X-Iroha-Iso-Signer` |configured bridge signer အတွက် Canonical public key ကို အသုံးပြုပါ။|
|`X-Iroha-Iso-Signature` |ဒိုမင်ခွဲခြားထားသော XML ဘိုက်များအပေါ် Base64 လက်မှတ် |

UTF-8 byte sequence `iroha.iso20022.outbound.v2`, zero byte တစ်ခုနဲ့ တိကျတဲ့ တုံ့ပြန်မှု body ပေါ်က လက်မှတ်ကို စစ်ဆေးပါ။ စစ်ဆေးခြင်းမတိုင်ခင် XML ကို ပြန်လည်ဖေါ်မြူတာ (သို့မဟုတ်) ပုံမှန်မပြုလုပ်ပါနဲ့။

### နောက်ထပ် Parser နှင့် မြေပုံထုတ်ခြင်း Support {#additional-parser-and-mapping-support}

IVM ISO အကူသည်လည်း envelope validation, settlement mapping သို့မဟုတ် downstream reconciliation အတွက် အောက်ပါ message families များကို validates နှင့် materializes သည်။ ၎င်းတို့တွင် standalone Torii လမ်းကြောင်းမရှိပါ။

|စာတို မိသားစု|လက်ရှိထောက်ပံ့မှု |
| --- | --- |
|`head.001` |`BizMsgIdr`, `MsgDefIdr`၊ ဖန်တီးချိန်နှင့် ရွေးချယ်စရာ ပေးပို့သူ/လက်ခံသူ BIC ကွင်းများအပါအဝင် ISO စာစောင်များအတွက် စီးပွားရေး လျှောက်လွှာ ခေါင်းစဉ် အတည်ပြုခြင်း |
|`pacs.007`, `pacs.028`, `pacs.029`|ငွေပေးချေမှု ပြန်လည်ကောက်ခံခြင်း၊ အခြေအနေတောင်းဆိုခြင်းနှင့် စုံစမ်းစစ်ဆေးမှုဖြေရှင်းရေး/အခြေအနေ စစ်ဆေးခြင်း |
|`pain.001`, `pain.002` |Customer payment initiation နှင့် ငွေပေးချေမှုအခြေအနေ အစီရင်ခံစာကို အတည်ပြုခြင်း |
|`camt.052`, `camt.053`, `camt.054`|စာရင်းအင်း အစီရင်ခံစာ၊ ထုတ်ပြန်ချက်နှင့် အသိပေးချက် အတည်ပြုချက် |

## Kaigi အစည်းအဝေး {#kaigi-sessions}

Kaigi သည် SORA Nexus တွင် ငွေပေးချေသော real-time audio / video rooms များကိုထောက်ပံ့သည်။ အကောင်အထည်ဖော်မှုတစ်ခုအတွက်စာအုပ်နောက်ခံအစည်းအဝေးဖန်တီးခြင်း၊ စာရင်းပြောင်းခြင်းများ၊ relay manifests များ၊ ကုဒ်သွင်းထားသောအချက်ပြချက်များနှင့်အသုံးပြုမှုတိုင်းတာမှုများလိုအပ်သည့်အခါ၎င်းကိုအသုံးပြုပါ။

စာရင်းအင်းနဲ့ဆိုင်တဲ့ သက်တမ်း စက်ဝန်းက-

- `CreateKaigi`: domain တစ်ခုအောက်တွင် call ကိုဖန်တီးပြီး ၎င်း၏ policy, schedule, metadata နှင့် optional relay manifest များကို သိမ်းဆည်းပါ။
- `JoinKaigi` နှင့် `LeaveKaigi`: ဖုန်းခေါ်ဆိုမှုစာရင်းကို update လုပ်ပါ။ ပုဂ္ဂလိက mode မှာ ပါဝင်သူတွေဟာ ပါဝင်သူရဲ့ account IDs ကို တိုက်ရိုက် ဖော်ပြတာအစား commitment တွေ၊ nullifiers တွေနဲ့ roster proofs တွေကို သုံးပါတယ်။
- `RecordKaigiUsage`: ရေတွက်ထားသောသက်တမ်းနှင့် ဓာတ်ငွေ့ စုစုပေါင်းကို ထည့်သွင်းပါ။
- `EndKaigi`: အစည်းအဝေးကို ပိတ်ပြီး နောက်ဆုံး အချိန်တံဆိပ်ကို မှတ်တမ်းတင်ပါ။

Torii Relay telemetry ကို Exposes under `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, နှင့် `/v1/kaigi/relays/events` app ကိုသုံးတဲ့အခါ API အစည်းအဝေးအခြေအနေကို အွန်လိုင်းမှ Kaigi နယ်ပယ်ဖြစ်ရပ်များ `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, နှင့် `KaigiUsageSummary`.

### CLI မီးခိုး စမ်းသပ်မှု {#cli-smoke-test}

စလိုက်ပါ `iroha kaigi` CLI a ကို စစ်ဆေးချင်တဲ့အခါ Torii endpoint က လက်ခံတယ်။ Kaigi ချိတ်ဆက်ခြင်းမတိုင်မီ ငွေချေးမှု UI. Quickstart command က Active အတြက္ ယာယီအခန်းကို ဖန်တီးပေးတယ်။ Torii endpoint နဲ့ call identifier ပါတဲ့ summary ကို ရိုက်ထည့်ပြီး join command နဲ့ SoraNet Spool ကို ညွှန်ပြချက်:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

scripted စီးဆင်းမှုအတွက် အခန်းသက်တမ်း စက်ဝန်းကို တိတိကျကျ စီမံခန့်ခွဲပါ။

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

အသုံးပြုခြင်း `--room-policy public` ကြည့်ရှုသူလက်မှတ်မပါဘဲ Relay တွေက ထုတ်လွှင့်နိုင်တဲ့ အခန်းများအတွက်၊ သို့မဟုတ် `--room-policy authenticated` Exits တွေမှာ Viewer Authentication လိုနေရင် သုံးပါ။ `--privacy-mode zk-roster-v1` ကွန်ရက်က Kaigi စာရင်းနှင့် အသုံးပြုမှု စစ်ဆေးရေး ခလုတ်များ ဖွဲ့စည်းထားသည်၊ အခြားနည်းဖြင့် ချိတ်ဆက်ခြင်း၊ စာရွက်များ၊ ပြီးတော့ သီးသန့်သုံးစွဲမှု မှတ်တမ်းတွေဟာ deterministic verification လုပ်နေစဉ်မှာ ကျရှုံးသွားပါတယ်။

### JavaScript မော်ဒယ်နဲ့ စမ်းသပ်မှု {#testing-with-the-javascript-demo}

သုံးပါ [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) Desktop Demo ကို End-to-End Wallet စမ်းသပ်မှုအတွက်ပါ။ ဒီမိုဟာ Electron နဲ့ Vue Application တစ်ခုဖြစ်ပြီး Torii ဒေသတွင်းကနေ `@iroha/iroha-js` အမိန့်ချမှတ်ထားပြီး `/kaigi` browser-native media တစ်ခုမှတစ်ဆင့် လမ်းကြောင်း။

Iroha အရင်းအမြစ် သိုလှောင်ရုံမှ [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) နှင့်အတူ demo ကိုအသုံးပြုပါ။ ဒီမို pins များသည် SDK မှ `file:../iroha/javascript/iroha_js` အထိဖြစ်သည်၊ ထို့ကြောင့် စစ်ဆေးမှု နှစ်ခုစလုံးကိုညီအစ်ကိုစီအစဉ်တွင်ထားပါ:

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

Node.js 20 သို့မဟုတ် ပိုမိုသစ်သောနှင့် Rust toolchain ကိုအသုံးပြု၍ ဒေသခံ `iroha_js_host` မော်ဒူးကို တည်ဆောက်နိုင်သည်။ အရင်းအမြစ်ပြောင်းပြီးနောက် ညီအစ်ကို Iroha checkout တွင် SDK ကိုပြန်လည်တည်ဆောက်ပါ။ သန့်ရှင်းသော package layout တွင် `npm run build:native` အတွက်လိုအပ်သည့် Cargo အလုပ်ခွင်မရှိပါ။

Controlled test အတွက် Kaigi-capable Torii endpoint ကို demo ကို ညွှန်ပြပါ။

1. SORA/Kaigi app-facing APIs ကို enable လုပ်ပြီး Iroha node တစ်ခုကိုစတင်ပါ သို့မဟုတ် လိုအပ်တဲ့ Kaigi မျက်နှာပြင်တွေကို ဖော်ပြပေးမယ့် အများသုံး endpoint ကို အသုံးပြုပါ။
2. `/health` ဖြင့် အခြေခံရရှိနိုင်မှုကို စစ်ဆေးပြီး `/openapi` သို့မဟုတ် `/openapi.json` ဖြင့် သက်ရှိလမ်းကြောင်း မျက်နှာပြင်ကို စစ်ဆေးပါ။ တစ်ချို့ တပ်ဆင်မှုတွေမှာလည်း `/v1/health` ကို နှိပ်စက်ထားပေမဲ့ `/health` ကတော့ သယ်ယူပို့ဆောင်ရေးသက်တမ်းစစ်ဆေးခြင်းဖြစ်သည်။
3. TAIRA အတွက် တိုက်ရိုက် အစည်းအဝေးကို မကြိုးစားခင် Relay Telemetry လမ်းကြောင်းတွေကို စစ်ဆေးပါ။

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

ဒီစစ်ဆေးမှုတွေက Torii နဲ့ Kaigi အဆက်အသွယ် တယ်လီမီထရီကို ရောက်ရှိနိုင်တယ်ဆိုတာ သက်သေပြတယ်။ ဒါတွေဟာ အစည်းအဝေးတစ်ခု ဖန်တီးတာမဟုတ်ဘူး။ `CreateKaigi` နဲ့ `JoinKaigi` တို့ဟာ ငွေကြေးထောက်ပံ့ထားတဲ့ ပိုက်ဆံအိတ်တွေနဲ့ လက်မှတ်ထိုးတဲ့ ငွေပေးချေမှုတင်သွင်းဖို့ လိုအပ်တုန်းပါ။
4. ဒီမိုကိုဖွင့်ပြီး Settings ကိုသွားပြီး Torii URL ကိုသတ်မှတ်ပြီး app က endpoint ကနေ chain ID နဲ့ network prefix ကို load လုပ်ပေးပါ။
5. ဒီမိုမှာ ဒေသတွင်း wallet နှစ်ခုကို ဖန်တီး (သို့) ပြန်လည်ထူထောင်ပါ။ ပရိုဖိုင်များ၊ စက်များအတွက် သီးခြား app ပြူတင်းပေါက်များကို အသုံးပြု၍ အိမ်ရှင်နှင့် ဧည့်သည်တို့သည် သီးခြား wallet အခြေအနေရှိစေရန်။

Kaigi UI ကို စမ်းသပ်ရန်:

1. Host ပြတင်းပေါက်တွင် Kaigi ကိုဖွင့်ပြီး အစည်းအဝေးစတင်ရန် ရွေးချယ်ပါ ခေါင်းစဉ်ကိုသတ်မှတ်ပြီး Private invite သို့မဟုတ် Transparent invitation ကိုရွေးပါ။
2. ကင်မရာနဲ့ မိုက်ခရိုဖုန်းကို ဖွင့်လိုက်လို့ WebRTC မှာ ဒေသတွင်းမီဒီယာတွေရှိမယ်။
3. အစည်းအဝေးကွန်ရက်ကို ဖန်တီးရန်ရွေးပါ။ Live Wallet ကိုတင်ပေးသည် `CreateKaigi`; အဲဒီနောက်မှာ app က `iroha://kaigi/join?call=...&secret=...` ဖိတ်ကြားခြင်းနှင့် `#/kaigi?...` နောက်ပြန်လမ်းကြောင်းပါ။
4. အိမ်ရှင် ပြတင်းပေါက်ကို ဖွင့်ထားပြီး ဖိတ်စာကို ဧည့်သည်နဲ့ မျှဝေပါ။
5. ဧည့်သည် ပြူတင်းပေါက်တွင် ဖိတ်ကြားချက်ကိုဖွင့်ပါ (သို့) Join meeting တွင်ထည့်ပါ။ ဒေသတွင်းမီဒီယာများကို ဖွင့်ပြီး Join meeting ကိုရွေးပါ။ တိုက်ရိုက် Wallet သည် Torii မှကုဒ်သွင်းထားသော host ကမ်းလှမ်းမှုကိုယူပြီး `JoinKaigi` ကိုကုဒ်သွင်းထားတဲ့ အဖြေ metadata နှင့်အတူတင်ပေးသည်။
6. အိမ်ရှင်သည် Kaigi ဖုန်းခေါ်ဆိုမှု အချက်ပြချက်များကို streaming သို့မဟုတ် polling ပြုလုပ်ခြင်းဖြင့် ပထမဆုံးအဖြေကို အလိုအလျောက်အသုံးပြုသင့်သည်။ ပြူတင်းပေါက်နှစ်ခုစလုံးတွင် ချိတ်ဆက်ထားသော မီဒီယာများနှင့် ဆက်သွယ်ရေး အသေးစိတ်အချက်အလက်များကို ပြသရမည်ဖြစ်သည်။
7. host မှ session ကို အဆုံးသတ်ရန် သို့မဟုတ် CLI `iroha kaigi end` command ကို အသုံးပြုပြီး ဖုန်းခေါ်ဆိုမှုတစ်ခုတည်းအတွက် ID ကို သုံးပါ။

Private Kaigi needs shielded XOR to pay the private entry point fee. demo မှာ private Kaigi needs protected XOR ကို အစီရင်ခံထားတယ်ဆိုရင်, app ထဲက self-shield prompt ကိုသုံးပြီး create (သို့) join လုပ်ရပ်ကို ထပ်မံကြိုးစားပါ။ အထောက်အထားထုတ်လုပ်ခြင်း၊ ပုဂ္ဂလိကထောက်ပံ့မှု (သို့) တိုက်ရိုက်အချက်ပြခြင်း မရှိပါက demo သည် ပွင့်လင်းမြင်သာသော / လက်ကိုင်စီးဆင်းမှုအဖြစ် ပြန်ကျသွားနိုင်သည်။ ထိုကိစ္စတွင် Advanced Signaling ကိုဖွင့်ပြီး ရိုးရိုးလက်ဆောင် (သို့မဟုတ်) အဖြေအိတ်ကို ကူးယူပြီး အခြား ပြတင်းပေါက်ထဲကပ်ပါ။

demo repo မှာ အလိုအလျောက် စစ်ဆေးမှုအတွက်: run:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

ဗဟိုပြု Vitest Suites သည် Kaigi အစည်းအဝေးကွန်ရက်ဖန်တီးခြင်း, ကွန်ကက်ဖိတ်ကြားမှု တင်သွင်းခြင်း၊ ပုဂ္ဂလိက create/join/end bridge ခေါ်ဆိုမှုများ, Self-shield prompt များ, လက်စွဲ fallback များနှင့် အဖြေတွက်ချက်မှုများကို ဖုံးအုပ်သည်။ UI မီးခိုးစမ်းသပ်မှုတွင် desktop နှင့် မိုဘိုင်းအရွယ်အစား viewports တွင် `/kaigi` လမ်းကြောင်းပါဝင်သည်။ Wallet နှစ်ခုအကြား Live Media ဟာ Browser Camera/Microphone ခွင့်ပြုချက်တွေနဲ့ peer media streams တွေဟာ ပတ်ဝန်းကျင်ကို သီးသန့် သတ်မှတ်ထားလို့ Manual Two-Window Test လိုနေတုန်းပါ။

နမူနာပေါင်းစပ်ရေးကုဒ်အတွက် ကြည့်ပါ။ [ထည့်သွင်းထားသည် Kaigi a တွင် JavaScript App ကို](/my/guide/tutorials/kaigi.md).

## အခြေအနေနှင့် မက်ထရစ်များ {#status-and-metrics}

Status နဲ့ metrics endpoints တွေဟာ Dashboards ထဲမှာ ပထမဆုံး ထည့်သွင်းရမယ့် အရာတွေပါ။

- `/status` အဆင့်မြင့် peer, block, queue, and consensus fields တွေကို ဖော်ပြတယ်။
- `/metrics` က Prometheus counters တွေ၊ gauges တွေနဲ့ histograms တွေကို ဖေါ်ပြပါတယ်။

Nexus လုပ်နိုင်သော node များတွင် status output တွင် lane နှင့် data-space ကို သိရှိနားလည်သည့် sections များလည်း ပါဝင်သည်။ `nexus.enabled = false` ရှိပါက ထို sections များကို ချန်ထားပါ။

## JSON နှင့် Norito {#json-vs-norito}

အော်ပရေတာအဆုံးသတ်မှတ်ချက်များစွာသည် အလိုလျောက် Norito ကိုပြန်လည်ပို့ပေးသည်။ အဆုံးသတ်မှတ်ချက်သည် JSON ကိုထောက်ပံ့သောအခါ, ပေးပို့ပါ:

```http
Accept: application/json
```

ဒါက အထူးသဖြင့် အသုံးဝင်ပါတယ်။

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

အဆုံးသတ်မှတ်ချက်တစ်ခုက Norito ကို တိုက်ရိုက်လက်ခံတဲ့အခါ (သို့) ပြန်ပို့တဲ့အခါ `application/x-norito` ကို အကြောင်းအရာအမျိုးအစား (သို့) ဦးစားပေး `Accept` တန်ဖိုးအဖြစ်အသုံးပြုပါ။ သယ်ယူပို့ဆောင်မှု အသေးစိတ်အတွက် [Norito](/my/reference/norito.md#torii-and-norito-rpc) ကိုကြည့်ပါ။

## Telemetry Profiles များ {#telemetry-profiles}

Endpoint မြင်ကွင်းသည် node ၏ `telemetry.profile` သတ်မှတ်ချက်အပေါ် မူတည်သည်။ လက်ရှိ configuration သည် profile အဆင့်ငါးခုကိုဖေါ်ပြထားပါသည်။

|Profile ကို |`/status` |`/metrics` |ဆောက်လုပ်ရေးလမ်းကြောင်းများ |
| --- | --- | --- | --- |
|`disabled` |မဟုတ်ဘူး။|မဟုတ်ဘူး။|မဟုတ်ဘူး။|
|`operator` |ဟုတ်ပါတယ်|မဟုတ်ဘူး။|မဟုတ်ဘူး။|
|`extended` |ဟုတ်ပါတယ်|ဟုတ်ပါတယ်|မဟုတ်ဘူး။|
|`developer` |ဟုတ်ပါတယ်|မဟုတ်ဘူး။|ဟုတ်ပါတယ်|
|`full` |ဟုတ်ပါတယ်|ဟုတ်ပါတယ်|ဟုတ်ပါတယ်|

## CLI ဖြတ်လမ်းများ {#cli-shortcuts}

`iroha` CLI ကတော့ ဒီအဆုံးသတ်မှတ်ချက်များစွာကို ပိတ်ထားပြီးသားပါ။

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## အထက်ပိုင်းဆိုင်ရာ ရည်ညွှန်းချက်များ {#upstream-references}

- [README API နှင့် လေ့လာနိုင်မှု အပြည့်အစုံ](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 တံတား အကောင်အထည်ဖော်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md)
