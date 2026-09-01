---
translation_locale: my
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ {#performance-and-metrics}

Iroha စွမ်းဆောင်ရည်သည် အလုပ်အကိုင်၊ validator topology, network အခြေအနေများနှင့် သဘောတူညီချက် setting များအပေါ် မူတည်သည်။ ထို့ကြောင့် တစ်ခုတည်းသော TPS နံပါတ်သည် တည်ငြိမ်တဲ့ ဖွဲ့စည်းမှုရှိ benchmark run ကို ချိတ်ဆက်ထားလျှင်သာ အသုံးဝင်သည်။

အရည်အသွေး စီမံကိန်းအတွက် စွမ်းဆောင်ရည်ကို လုပ်ငန်းဆိုင်ရာ ဒေတာ ကွန်တိန်နာတစ်ခုအဖြစ် သတ်မှတ်ပေးပါ။

- ကွန်ရက်က တောင်းဆိုထားတဲ့ ငွေလဲလှယ်နှုန်းကို လက်ခံတယ်။
- protocol finalisation latency ကို ရည်မှန်းထားတဲ့ ဘတ်ဂျက်အတွင်းမှာ ရှိနေပါတယ်။
- ငွေပေးချေမှု အတန်းများ ကန့်သတ်ထားခြင်း
- သဘောတူညီချက်ဟာ အကြိမ်ကြိမ် မြင်ကွင်း ပြောင်းလဲမှု (သို့) ပြန်လည်ထူထောင်ရေးလမ်းကြောင်းတွေကို အားကိုးတာမဟုတ်ဘူး။

ဤစာမျက်နှာကို အသုံးပြု၍ node count, network latency threshold နှင့် target TPS အတွက် deployment တစ်ခုသည် high, medium, or low performance state တွင်ရှိ၊မရှိ ခန့်မှန်းပါ။

## ဘာကို တိုင်းတာရမလဲ {#what-to-measure}

Public node point-in-time data view နဲ့ Prometheus scrape ကိုစပြီး operator-authenticated consensus state အတွက် CLI ကို အသုံးပြုပါ။ operator key ကို target node က ခွင့်ပြုထားရပြီး software execution environment မှာသာ load လုပ်ပေးရပါမယ်။

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

Public Taira သည် အမည်မသိ node snapshots များ၏ပုံစံကို သင်ယူရန် အသုံးဝင်သည်။ ၎င်း၏ operator diagnostics ကို Taira operator key မပါဘဲ ရည်ရွယ်ချက်ရှိ၍မရနိုင်ပါ။

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

သင့်ကိုယ်ပိုင် တပ်ဆင်မှုအတွက် ထုတ်လုပ်နိုင်စွမ်း ကိန်းဂဏန်းအဖြစ် အများပြည်သူ စမ်းသပ်ရေးကွန်ရက် လေ့လာချက်တွေကို မသုံးပါနဲ့။

Telemetry မြင်ကွင်းသည် သတ်မှတ်ထားသော ပရိုဖိုင်အပေါ် မူတည်သည်။ `operator` အခြေအနေနဲ့ ရောဂါရှာဖွေရေး snapshots တွေကို enable လုပ်ပေးပါတယ်။ `extended` ပေါင်းထည့်သည် `/metrics` ကုန်ကျစရိတ်မြင့်မားတဲ့ အချိန်ကာလတွေရှိပြီး `developer` leader ကဲ့သို့သော developer point-in-time data views များကို ထည့်သွင်းပေးသည်။ QC, ပါရမီတာများနှင့် သက်သေခံချက်များကို မပြုလုပ်ဘဲ `/metrics`. အသုံးပြုခြင်း `full` ပြေးပွဲတစ်ခုမှာ နှစ်ခုစလုံး လိုအပ်တဲ့အခါပါ။ `telemetry_profile` ဒါက ပထမဆုံးထုတ်လွှတ်တဲ့ တယ်လီမီထရီ ခလုတ်တစ်ခုတည်းပါ။

```toml
telemetry_profile = "full"
```

## စွမ်းဆောင်မှု ကြိုးများ {#performance-bands}

အဆိုပါ bands များကို target throughput `Y` TPS နှင့် latency budget `L` မီလီစက္ကန့်များတွင် စောင့်ကြည့်ရန်အသုံးပြုပါ။ အပူချိန်၊ တည်ငြိမ်မှုအခြေအနေနှင့်မျှော်လင့်ထားသော အမြင့်ဆုံးအဝန်ဆောင်မှုကာလတစ်ခုထက်နည်း၍ပါဝင်နိုင်လောက်အောင် အလုပ်အလျှပ်အစီးကို run လုပ်ပါ။

|တီးဝိုင်း|အခြေအနေများ |အဓိပ္ပါယ်|
| --- | --- | --- |
|မြင့်မားတယ်။|လက်ခံထားရသောအထွက်နှုန်းသည် `Y` သို့မဟုတ်အထက်ရှိသည်၊ p95 ပရိုတိုကောလ် အဆုံးသတ်မှု နှောင့်နှေးမှုက `0.8 * L` အောက်ရှိသည်၊ တန်းတန်းများသည် စွမ်းအား၏ ၁၀% အောက်တွင်ရှိနေပြီး ရှုထောင့်ပြောင်းလဲ / ပြန်လည်ထူထောင်ရေး counter များသည် flat ပါတယ်။|တပ်ဆင်မှုမှာ လိုအပ်တဲ့ အလုပ်အကိုင်အတွက် နေရာရှိပါတယ် |
|ပျမ်းမျှ |လက်ခံထားရသောအထွက်နှုန်းသည် `Y` နီးပါးရှိသည်၊ p95 ပရိုတိုကောလ်အဆုံးသတ်ခြင်း latency သည် `L` အောက်တွင်ရှိသည်၊ တန်းတန်းများသည်စွမ်းအား၏ ၅၀% အောက်မှာ တည်ငြိမ်ပြီး ရှုမြင်မှုပြောင်းလဲမှုများသည်ရှားပါးသည်။ |တပ်ဆင်မှုက အလုပ်ဖြစ်ပေမဲ့ ပေါက်ကွဲမှု သည်းခံမှု ကန့်သတ်ချက်ရှိတယ်။|
|အနိမ့်ဆုံး|လက်ခံထားရသောအထွက်နှုန်းသည် `Y` အောက်မှာရှိသည်၊ p95 ပရိုတိုကော၏ နောက်ဆုံးသတ်မှတ်မှု နှောင့်နှေးမှုက `L` ထက်ပို၍ရှိသည်၊ ပြေးဆွဲနေစဉ်တွင် တန်းတန်းများ တိုးလာသည် သို့မဟုတ် အမြင်ပြောင်းလဲ/နောက်ပြန်ဖိအား ကိရိယာများသည် ဆက်လက်တိုးတက်သည်။ |တောင်းဆိုထားတဲ့ အလုပ်အကိုင် ဝန်ဆောင်မှုဟာ အနည်းဆုံး bottleneck တစ်ခုထက်ပိုပါတယ်။ |

အဓိက စည်းကမ်းကတော့ queue direction ပါ။ တင်သွင်းထားတဲ့ TPS ဟာ နောက်ဆုံးတင်ထားတဲ့ TPS ထက် ပိုများပြီး queue ကြီးထွားနေတုန်းဆိုရင်၊ အသေးစား နမူနာတွေ ကျန်းမာတယ်လို့ ထင်ရတောင်မှ deployment ကို overload လုပ်ပေးပါတယ်။

## Node Count နှင့် Quorum {#node-count-and-quorum}

ပိုများသော validator များသည် fault tolerance ကိုတိုးတက်စေသော်လည်း ညှိနှိုင်းခြင်း၊ လက်မှတ်ရေးထိုးခြင်းနှင့်ကွန်ရက်ထုတ်လုပ်မှု ကုန်ကျစရိတ်များကို မြှင့်တင်ပေးသည်။ ပထမထွက်ရှိ Sumeragi ပရိုတိုကောသည်လိုအပ်သည် -

- အတိအကျ `n = 3f + 1` မဲပေးရေး ကော်မတီ
- `4 <= n <= 31` ဆိုတော့ valid size တွေက 4, 7, 10, စသဖြင့်ပါ။
- `2f + 1` ၏ သဘောတူညီချက် အပြီးသတ်မှု ကော်မတီ
- observer network peers တွေက sync blocks တွေကို မဲမပေးကြဘူး၊ အဆိုမတင်ကြဘူး ဒါမှမဟုတ် ကောက်ယူကြတာမဟုတ်ဘူး။

|အတည်ပြုကိရိယာများ|မလုံလောက်တဲ့ ဘတ်ဂျက်|သဘောတူညီချက် အပြီးသတ်ရေး ကော်မတီ |အရည်အချင်း မှတ်ချက် |
| --- | --- | --- | --- |
| 4 | 1 | 3 |တစ်ခုတည်းသော အမှားခံနိုင်မှုအတွက် တူညီတဲ့ အနိမ့်ဆုံး |
| 7 | 2 | 5 |ပိုပြီး ခံနိုင်ရည်ရှိပြီး မဲပေးခြင်းနှင့် ပျံ့နှံ့မှု ပိုမိုများလာစေသည်။ |
| 10 | 3 | 7 |ပိုမြင့်မားတဲ့ ညှိနှိုင်းမှုစရိတ်၊ ကွန်ရက်နဲ့ ဝင်ရောက်မှုညှိနှိုင်းမှုဟာ ပိုအရေးကြီးပါတယ်။|
| 31 | 10 | 21 |အများဆုံး ပထမအကြိမ် ထုတ်ပြန်ရေး ကော်မတီ၊ စံချိန်တင်ချက် ညှိနှိုင်းမှုနှင့် လက်မှတ်ထိုးခြင်း ကုန်ကျစရိတ်ကို သေချာစွာ |

blockchain genesis generation နဲ့ startup validation တွေက ကော်မတီ အရွယ်အစားတွေ မလိုက်နာတာကို ပယ်ချတယ်။ ထုတ်ပြန်မှုက လက်မခံနိုင်တဲ့ topology ကို benchmark မလုပ်ပါနဲ့။

"X node" ကို အကဲဖြတ်တဲ့အခါ မဲပေးတဲ့ validator တွေကို လေ့လာသူတွေကနေ ခွဲခြားပါ။ လေ့လာသူတွေကို ထည့်သွင်းတာက validator တွေထည့်တာထက် နည်းပါတယ်။ ဒါပေမဲ့ လေ့လာသူတွေဟာ ဘလော့ဂ် ဝေါဟာရ၊ ဘလော့ sync, disk နဲ့ ကွန်ရက် bandwidth ကို သုံးစွဲကြတုန်းပဲလေ။

## စွမ်းဆောင်ရည်အပေါ် သက်ရောက်မှုရှိစေသော အချက်များ {#factors-that-influence-performance}

### Workload ပုံစံ {#workload-shape}

TPS တစ်ခုချင်းစီရဲ့ လုပ်ဆောင်ချက်အပေါ် မူတည်ပြီး စျေးပေါ (သို့) စျေးကြီးနိုင်ပါတယ်။ မှတ်တမ်း:

- ငွေပေးချေမှုအတွက် ညွှန်ကြားချက်အရေအတွက်
- လက်မှတ်တွက်ချက်ခြင်းနှင့် လက်မှတ်ရေးထိုးခြင်း အယ်လ်ဂိုရစ်သမ်များ
- Transaction byte အရွယ်အစားနှင့် decompressed payload အရွယ်အစား
- စာဖတ်/ရေးခြင်း အချိုးအစား
- metadata အရွယ်အစားနှင့် အရင်းအမြစ်လုပ်ငန်းများ
- စမတ်ကုထုံး၊ trigger နဲ့ IVM အကောင်အထည်ဖော်မှု ကုန်ကျစရိတ်
- တူညီတဲ့ network peers တွေကို run လုပ်နေတဲ့ query load

သေးငယ်တဲ့ ငွေလွှဲပြောင်းမှုတွေဟာ စာချုပ်ကြီးမားတဲ့ (သို့) metadata လေးလံတဲ့ အလုပ်ဝန်ဆောင်မှုအတွက် ကိုယ်စားလှယ်မဟုတ်ဘူး။

### သဘောတူညီချက် ကဒင်စီ {#consensus-cadence}

ထိရောက်တဲ့ Sumeragi သတ်မှတ်ချက် အချိန်ကာလ ဒေတာမြင်ကွင်းမှာ လက်မှတ်ထိုးထားတဲ့ မပြောင်းလဲနိုင်တဲ့ ဘလော့ကက်ဒန်နဲ့ နာရီ-မောင်းနှင်မှု ကန့်သတ်ချက် ပါဝင်ပါတယ်။

- `block_cadence_ms`
- `max_clock_drift_ms`

ဒါတွေကို စစ်ဆေးပါ။

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` ကို လက်မှတ်ထိုးထားတဲ့ blockchain genesis ကနေ Fix လုပ်ပြီး Startup မှာ Freeze လုပ်ထားတယ်။ ဒါက Live Tuning ခလုတ်မဟုတ်ဘူး။ ခြားနားတဲ့ လက်မှတ်ထိုး blockchain genesis input တွေနဲ့ ကွန်ရက်တွေကို သီးခြား benchmark စင်္ကြံတွေအဖြစ်ပဲ နှိုင်းယှဉ်ပါ။ အပြောင်းအလဲများ၊ ပျောက်နေတဲ့ အသုံးဝင် ဝန်ဆောင်မှု ရယူမှုများ (သို့) backpressure တွေ ပေါ်လာတာနဲ့ ပိုတိုတဲ့ ကြိမ်နှုန်းဟာ ပုံမှန်အားဖြင့် ရေရှည်တည်တံ့တဲ့ ထုတ်ကုန်ထုတ်လုပ်မှုကို မြှင့်တင်မယ့်အစား overload ကို ပိုပြီး မြင်သာစေပါတယ်။

### ကိုယ်စားလှယ်လောင်းနှင့် ဝင်ရောက်ခွင့် ကန့်သတ်ချက်များ {#candidate-and-ingress-bounds}

Node-local Sumeragi နယ်နိမိတ်တွေက validator တစ်ခုက မှတ်တမ်းတင်နိုင်တဲ့ အလုပ်အကိုင်နဲ့ ပြန်လည်ထူထောင်မှု ဘယ်လောက်ကို သတ်မှတ်ပေးပါတယ်။

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` နှင့် `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks`, နှင့် `sumeragi.queues.ready_bodies`

အလွန်သေးငယ်တဲ့ ကန့်သတ်ချက်တွေက တန်းစီ (သို့) အသုံးဝင် ဝန်ဆောင်မှု ပြန်လည်ထူထောင်ရေး ဖိအားကို ဖန်တီးပေးတယ်။ ကြီးမားတဲ့ ကန့်ကွက်ချက်တွေဟာ ထိန်းသိမ်းထားတဲ့ မှတ်ဉာဏ်နဲ့ မကောင်းမွန်တဲ့ ကွန်ရက်အတွက် ရနိုင်တဲ့ အလုပ်ပမာဏကို မြှင့်တင်ပါတယ်။ peer. တစ်ချိန်တည်းမှာ တစ်ခုချင်းစီကို ပြောင်းလဲမည့် Diagnostics point-in-time data view ကို process memory, message handling နဲ့ missing-body metrics တွေနဲ့ နှိုင်းယှဉ်ကြည့်ပါ။

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### ကွန်ရက်အခြေအနေများ {#network-conditions}

သဘောတူညီမှု စွမ်းဆောင်ရည်က အောက်ပါအချက်တွေကို ထိခိုက်စေပါတယ်။

- RTT အတည်ပြုသူများအကြား
- jitter နဲ့ package ဆုံးရှုံးမှု
- ဘလော့ကယ်များနှင့် လက်မှတ်ထိုးထားသော RS16 အပိုင်းများအတွက် bandwidth
- ဒေသများအကြား မညီမျှသော ဆက်နွယ်မှုများ
- NAT, network peer connectivity ကို နှောင့်နှေးစေတဲ့ firewall (သို့) relay ပြုမူမှု

စီမံကိန်းစည်းမျဉ်းတစ်ခုအဖြစ် validator round-trip များနှင့်အတူလုပ်ဆောင်မှုနှင့် disk persistence အချိန်ကိုဖုံးအုပ်နိုင်လောက်အောင် latency ဘတ်ဂျက်ကိုမြင့်မားစွာသတ်မှတ်ပါ။ p95 ကွန်ရက် RTT သည်ရည်ရွယ်သော p95 ပရိုတိုကောအပြီးသတ်ခြင်း latency နီးစပ်နေပါက ရည်မှန်းချက်သည် လက်တွေ့မကျပါ။

### အတန်းများနှင့် ဝင်ခွင့် ကန့်သတ်ချက်များ {#queues-and-admission-limits}

Admission နဲ့ queue setting တွေက network peer တစ်ခုရဲ့ burst ဖိအား ဘယ်လောက် စုပ်ယူနိုင်တယ်ဆိုတာကို သတ်မှတ်ပေးပါတယ်-

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- blockchain genesis transaction limit များမှာ max လက်မှတ်များ၊ ညွှန်ကြားချက်များ၊ bytes နှင့် decompressed bytes တို့ပါဝင်ပါသည်။
- p2p အတန်းထိပ်များနှင့် သဘောတူညီချက်ဝင်ရောက်မှု ကန့်သတ်ချက်တွေ

မြင့်မားသော queue capacity က overload ကို ခဏလောက် လျှို့ဝှက်နိုင်ပေမဲ့ ရေရှည်တည်တံ့တဲ့ throughput ကို မတိုးစေပါဘူး။ တည်ငြိမ်တဲ့ queue ဟာ ကျန်းမာတယ်။ တိုးပွားနေတဲ့ queue က နောက်ကျနေတာပါ။

### Hardware နှင့် Storage {#hardware-and-storage}

အတည်ပြုသူတိုင်းကို တိုင်းတာပါ၊ ခေါင်းဆောင်တင်မဟုတ်ဘူး။

- CPU အတည်ပြုချက်၊ လက်မှတ်စစ်ဆေးမှုနှင့် အကောင်အထည်ဖော်မှုအတွင်း ကျေနပ်မှု
- အတန်းများမှ မှတ်ဉာဏ်ဖိအား၊ အချိန်ကာလ အချက်အလက်အမြင်များနှင့် အသုံးဝင်ဝန်ဆောင်မှု ပြန်လည်ထူထောင်ရေး ဘူဖာများ
- Block storage နဲ့ point-in-time data view တွေအတွက် disk write latency
- Network transmit/receive saturation ကို ပေးပို့ခြင်း
- အလုပ်ဝန်ဆောင်မှုအတွက် အသုံးပြုတဲ့အခါ ရွေးချယ်စရာ Hardware အရှိန်မြှင့်ချက် setting များ

အနှေးဆုံး မဲပေးတဲ့ validator က ကွန်ရက်ရဲ့ Tail latency ကို သတ်မှတ်နိုင်တယ်။

## Prometheus လက္ခဏာများ {#prometheus-signals}

မက်ထရစ်အမည်များသည် စစ်ဆေးထားသော တယ်လီမီတာစာရင်းမှ လာသည်။ စီးရီးရရှိနိုင်မှုနှင့် နမူနာကောက်ယူခြင်းသည် တည်ဆောက်မှုလက္ခဏာများနှင့် `telemetry_profile` မှဆက်စပ်နေဆဲဖြစ်သည်၊ ထို့ကြောင့် ပရိုဂျက်ဘုတ်မဆောက်ခင် ရည်မှန်းချက် node တွင် `/metrics` ကိုစစ်ဆေးပါ။

သာမန် အချက်ပြမှုတွေကတော့

|အချက်ပြချက်|Prometheus နမူနာများ |ဘာကို ကြည့်ရမလဲ|
| --- | --- | --- |
|လက်ခံသော ထုတ်ကုန်များ |`sum(rate(txs{type="accepted"}[5m]))` |တည်ငြိမ်တဲ့ အခြေအနေမှာ ရည်မှန်းချက် TPS ကို ဖြည့်ဆည်းသင့်တယ် (သို့) ကျော်သင့်တယ် |
|ငြင်းပယ်ခြင်း |`sum(rate(txs{type="rejected"}[5m]))` |စမ်းသပ်မှု အစီအစဉ်နဲ့ ရှင်းပြရမယ်။|
|ပရိုတိုကောလ အပြီးသတ်ခြင်း နှောင့်နှေးမှု |`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |P95/p99 ကို latency ဘတ်ဂျက်နဲ့ နှိုင်းယှဉ်ကြည့်ပါ။|
|အတန်းအနက်|`queue_size`, `sumeragi_tx_queue_depth` |ဝန်ဆောင်မှု အမြင့်ဆုံးကာလအတွင်းမှာ ကန့်သတ်ထားသင့်ပါတယ်။|
|queue saturation ကို |`sumeragi_tx_queue_saturated` |တည်ငြိမ်သော သုညမဟုတ်တဲ့ တန်ဖိုးများဆိုသည်မှာ ဝန်ထုပ်လျှော့ချမှုပါ။ |
|အပြောင်းအလဲများကို ကြည့်ရှု |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total`|မြင့်တက်နေတဲ့ တန်ဖိုးတွေက အချိန်ကာလ၊ ထိပ်ပိုင်းဆိုင်ရာ၊ အသုံးဝင်တဲ့ ဝန်ဆောင်မှု (သို့) ကွန်ရက် ပြဿနာကို ညွှန်ပြတယ်။ |
|ပိတ်ထားသော စာတိုများ |`dropped_messages`, `sumeragi_consensus_message_handling_total` |ဝန်ဆောင်မှုအတွင်း ကျဆင်းမှုဟာ မကြာခဏဆိုသလို နှောင့်နှေးမှု မြင့်တက်မှုကို ရှင်းပြပါတယ်။|
|အသုံးဝင် ဝန်ဆောင်မှုနှင့် DA ပြန်လည်ထူထောင်ခြင်း |`sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |အမြဲတမ်းတောင်းဆိုချက်တွေ၊ အသက်ကြီးလာတာ၊ (သို့) ထပ်ခါထပ်ခါ DA ဂိတ်တွေက ခန္ဓာကိုယ် (သို့) အစိတ်အပိုင်းဝယ်ယူမှု ပြဿနာကို ညွှန်ပြတယ်။|
|သဘောတူညီချက် အပြီးသတ်ရေး ကော်မတီ |`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |လက်မှတ်တွေ ရေတွက်ခံရရင် လိုအပ်တဲ့ ကွမ်အိုရမ်ကို အမြန်ဆုံး ရောက်ရှိသင့်ပါတယ်။|

`/v1/sumeragi/status` တွင်သာ မက်ထရစ်တစ်ခုရှိပါက Prometheus scrape နှင့်အတူတူ run artefacts များတွင် JSON point-in-time data view ကိုရိုက်ယူပါ။

## ခန့်မှန်းချက် လုပ်ငန်းခွင် {#estimation-workflow}

1. ဇာတ်လမ်းကို သတ်မှတ်ပါ။
   - validator count နဲ့ observer count ကို
   - သဘောတူညီချက် mode
   - ရည်မှန်းချက် TPS
   - p95 နှင့် p99 ပရိုတိုကောလ်များ အပြီးသတ်ခြင်း-နောက်ကျမှု ဘတ်ဂျက်များ
   - ငွေပေးချေမှု ပေါင်းစပ်ခြင်း
   - expected network RTT, jitter, and bandwidth
2. ထိရောက်တဲ့ ဖွဲ့စည်းမှုကို မှတ်တမ်းတင်ပါ။

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. ရည်မှန်းချက် TPS မှာ အလုပ်အကိုင်ကို လုပ်ဆောင်ပါ။
4. ပြိုင်ပွဲရဲ့ အစ၊ အလယ်ပိုင်းနဲ့ အဆုံးမှာ အခြေအနေနဲ့ မက်ထရစ်တွေကို ရိုက်ယူပါ။
5. ပြေးလွှာကို စွမ်းဆောင်မှုအချိုးအစားဇယားနဲ့ ခွဲခြားပါ။
6. Band က Medium (သို့) Low ဆိုရင် တစ်ကြိမ်မှာ ကိရိယာ တစ်ခုကို ပြောင်းပြီး ထပ်လုပ်ပါ။

## Benchmark အစီရင်ခံစာ Template {#benchmark-report-template}

စွမ်းဆောင်မှု ကိန်းဂဏန်းတွေကို ပြန်လည်ထုတ်ဖော်ဖို့ လုံလောက်တဲ့ အခြေအနေနဲ့သာ ထုတ်ဝေပါ။

- Iroha ပရိုတိုကော၏ နောက်ဆုံးသတ်မှတ်ချက်၊ ထုတ်ပြန်ခြင်းနှင့် လုပ်ဆောင်မှု အလံများ
- အတည်ပြုသူနဲ့ လေ့လာသူတွက်ချက်
- သဘောတူညီမှုပုံစံ၊ လက်မှတ်ထိုးထားတဲ့ ဘလော့ကက်ဒင်နဲ့ DA စီစဉ်ချက်
- တိကျသော `3f + 1` ကော်မတီ၊ အစုလိုက်အပြုံလိုက်အဖွဲ့နှင့် လေ့လာသူစာရင်း
- `sumeragi.block`, `sumeragi.queues`, `sumeragi.limits`၊ ကွန်ရက်ဝင်ရောက်ခြင်းနှင့် ငွေပေးချေမှုတန်းသတ်မှတ်ချက်များ။
- တယ်လီမီတာ ပရိုဖိုင်
- ကုန်ကြမ်း၊ သိုလှောင်ခြင်းနှင့် OS အသေးစိတ်အချက်အလက်များ
- network RTT, jitter, loss နှင့် bandwidth အယူအဆများ
- ငွေလဲလှယ်မှု ပေါင်းစပ်ခြင်းနှင့် အသုံးဝင် ဝန်ဆောင်မှု အရွယ်အစားများ
- ကမ်းလှမ်းထားသော TPS နှင့် ပြေးဆွဲမှုသက်တမ်း
- လက်ခံရရှိ/ပယ်ချ TPS
- p50/p95/p99 ပရိုတိုကောလ် အပြီးသတ်ခြင်း နှောင့်နှေးမှု
- queue depth နဲ့ saturation တွေ
- View changes, dropped messages, missing-block picks, and DA-gate counters
- CPU, မှတ်ဉာဏ်၊ disk နှင့် validator တစ်ခုစီအတွက် network အသုံးပြုမှု

ဒီ အသေးစိတ်အချက်အလက်တွေမရှိရင် TPS ကိန်းဂဏန်းကို သရုပ်ဖော်ချက်တစ်ခုအဖြစ် ယူဆသင့်ပါတယ်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [Izanami နဲ့ ဆူညံနေတဲ့ စမ်းသပ်မှု](./chaos-testing.md)
- [Torii API အဆုံးသတ်မှတ်ချက်များ](../../reference/torii-endpoints.md)
- [Iroha 3 ကို CLI မှတစ်ဆင့် လည်ပတ်ပါ။](../../get-started/operate-iroha-via-cli.md)
- [Network peer configuration ကို ရည်ညွှန်းချက်](../../reference/peer-config/params.md)
