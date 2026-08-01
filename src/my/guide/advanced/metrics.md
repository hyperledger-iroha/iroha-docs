---
translation_locale: my
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ {#performance-and-metrics}

Iroha စွမ်းဆောင်ရည်သည် အလုပ်အကိုင်၊ validator topology, network အခြေအနေများနှင့် သဘောတူညီချက် setting များအပေါ် မူတည်သည်။ ထို့ကြောင့် တစ်ခုတည်းသော TPS နံပါတ်သည် တည်ငြိမ်တဲ့ ဖွဲ့စည်းမှုရှိ benchmark run ကို ချိတ်ဆက်ထားလျှင်သာ အသုံးဝင်သည်။

အရည်အသွေး စီမံကိန်းအတွက် စွမ်းဆောင်ရည်ကို လုပ်ငန်းခွင်တစ်ခုအဖြစ် သတ်မှတ်ပေးပါ။

- ကွန်ရက်က တောင်းဆိုထားတဲ့ ငွေလဲလှယ်နှုန်းကို လက်ခံတယ်။
- ရည်မှန်းထားတဲ့ ဘတ်ဂျက်အတွင်းမှာ အချိန်ဆွဲမှု ထိန်းသိမ်းဖို့ ကတိပေးပါ။
- ငွေပေးချေမှု အတန်းများ ကန့်သတ်ထားခြင်း
- သဘောတူညီချက်ဟာ အကြိမ်ကြိမ် မြင်ကွင်း ပြောင်းလဲမှု (သို့) ပြန်လည်ထူထောင်ရေးလမ်းကြောင်းတွေကို အားကိုးတာမဟုတ်ဘူး။

ဤစာမျက်နှာကို အသုံးပြု၍ node count, network latency threshold နှင့် target TPS အတွက် deployment တစ်ခုသည် high, medium, or low performance state တွင်ရှိ၊မရှိ ခန့်မှန်းပါ။

## ဘာကို တိုင်းတာရမလဲ {#what-to-measure}

Torii ကဖွင့်ထားသော operator မျက်နှာပြင်များမှစ၍:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

အများပြည်သူ Taira နဲ့ စာဖတ်လို့သာရတဲ့ ပုံစံကို စမ်းကြည့်နိုင်ပါတယ်။

```bash
TAIRA=https://taira.sora.org

curl -fsS "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

အများပြည်သူ Taira မီတာတွေဟာ အချက်ပြမှုအမည်တွေကို သင်ယူဖို့ အသုံးဝင်ပါတယ်။ ဒါတွေကို ကိုယ်ပိုင် ဖြန့်ဖြူးရေးအတွက် ထုတ်လုပ်မှုစွမ်းဆောင်ရည် ကိန်းဂဏန်းတွေအဖြစ် မသုံးပါနဲ့။

CLI မှတစ်ဆင့် တူညီသော သဘောတူညီချက် snapshots များကိုရရှိနိုင်ပါသည်။

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

Telemetry မြင်ကွင်းသည် သတ်မှတ်ထားသော ပရိုဖိုင်အပေါ် မူတည်သည်။ အသုံးပြုခြင်း `extended` လိုအပ်တဲ့အခါမှာ `/metrics`, အသုံးပြုခြင်း `full` အသေးစိတ်အချက်အလက်တွေလည်း လိုအပ်တဲ့အခါ စမ်းသပ်မှုတွေမှာ Sumeragi လုပ်ငန်းရှင် လမ်းကြောင်းတွေပေါ့။

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## စွမ်းဆောင်မှု ကြိုးများ {#performance-bands}

အဆိုပါ bands များကို target throughput `Y` TPS နှင့် latency budget `L` မီလီစက္ကန့်များတွင် စောင့်ကြည့်ရန်အသုံးပြုပါ။ အပူချိန်၊ တည်ငြိမ်မှုအခြေအနေနှင့်မျှော်လင့်ထားသော အမြင့်ဆုံးအဝန်ဆောင်မှုကာလတစ်ခုထက်နည်း၍ ပါဝင်နိုင်လောက်အောင် အလုပ်အလျှပ်အစီးကို run လုပ်ပါ။

|တီးဝိုင်း|အခြေအနေများ |အဓိပ္ပါယ်|
| --- | --- | --- |
|မြင့်မားတယ်။|လက်ခံတဲ့ ထုတ်လွှင့်မှုနှုန်းဟာ `Y` ထက် (သို့) ပိုမြင့်တယ်၊ p95 commit latency က `0.8 * L` အောက်မှာရှိတယ်၊ တန်းတန်းတွေဟာ စွမ်းဆောင်ရည်ရဲ့ ၁၀% အောက်မှာရှိနေပြီး ရှုထောင့်ပြောင်း/ပြန်လည်ထူထောင်ရေး counter တွေက flat ပါတယ်။|တပ်ဆင်မှုမှာ လိုအပ်တဲ့ အလုပ်အကိုင်အတွက် နေရာရှိပါတယ် |
|ပျမ်းမျှ |လက်ခံထားရသောအထွက်နှုန်းသည် `Y` နီးပါးရှိသည်၊ p95 commit latency သည် `L` အောက်တွင်ရှိသည်၊ တန်းတန်းများသည် စွမ်းအား၏ ၅၀% အောက်မှာ တည်ငြိမ်ပြီး ရှုမြင်မှုပြောင်းလဲမှုများက ရှားပါးသည်။ |တပ်ဆင်မှုက အလုပ်ဖြစ်ပေမဲ့ ပေါက်ကွဲမှု သည်းခံမှု ကန့်သတ်ချက်ရှိတယ်။|
|အနိမ့်ဆုံး|လက်ခံတဲ့ ထုတ်လွှင့်မှုနှုန်းက `Y` အောက်မှာရှိတယ်၊ p95 commit latency က `L` ကိုကျော်တယ်၊ ပြေးစဉ်မှာ queues ကြီးထွားနေတယ်၊ ဒါမှမဟုတ် view-change/backpressure counters တွေဟာ ဆက်တိုက်တိုးနေပါတယ် |တောင်းဆိုထားတဲ့ အလုပ်အကိုင် ဝန်ဆောင်မှုဟာ အနည်းဆုံး bottleneck တစ်ခုထက်ပိုပါတယ်။ |

အဓိက စည်းကမ်းကတော့ queue direction ပါ။ တင်သွင်းထားတဲ့ TPS က committed TPS ထက် ပိုများပြီး queue ကြီးထွားနေတုန်းဆိုရင်၊ short samples တွေဟာ ကျန်းမာတယ်လို့ ထင်တောင်မှ deployment ကို overload လုပ်သွားမှာပါ။

## Node Count နှင့် Quorum {#node-count-and-quorum}

ပိုများသော validators များသည် fault tolerance ကိုတိုးတက်စေသော်လည်း koordination, လက်မှတ်ထိုးခြင်းနှင့် netout ကုန်ကျစရိတ်များကိုတိုးမြှင့်ပေးသည်။ ယခု Sumeragi အကောင်အထည်ဖော်မှုတွင်:

- validator count `n` မှ fault budget `f = floor((n - 1) / 3)` ကိုရယူသည်။
- `n >= 4` အတွက် commit quorum ကို `2f + 1` ဖြစ်ပါသည်။
- `n <= 3` အတွက် အမိန့်ချမှတ်ဖို့ validator တွေအားလုံး လိုအပ်တယ်။
- observer peers တွေဟာ sync blocks တွေကို လုပ်ပေမဲ့ မဲမပေးကြဘူး၊ အဆိုမပြုကြဘူး ဒါမှမဟုတ် စုဆောင်းကြတာမဟုတ်ဘူး။

|အတည်ပြုကိရိယာများ|မလုံလောက်တဲ့ ဘတ်ဂျက်|အစုလိုက်အပြုံလိုက် ဆုံးဖြတ်ချက် ချမှတ် |အရည်အချင်း မှတ်ချက် |
| --- | --- | --- | --- |
|၁ မှ ၃ |အွန်လိုင်းမှာ လက်တွေ့ကျတဲ့ ချောမွေ့မှုမရှိဘူး။|အတည်ပြုသူအားလုံး|ဖွံ့ဖြိုးရေးနှင့် စမ်းသပ်မှု အသေးစားများအတွက် အသုံးဝင်သည်။ ပျောက်ဆုံးနေသော validator မည်သည်မျှ commits ကိုနှောင့်ယှက်နိုင်ပါသည်။ |
| 4 | 1 | 3 |တစ်ခုတည်းသော အမှားခံနိုင်မှုအတွက် တူညီတဲ့ အနိမ့်ဆုံး |
| 7 | 2 | 5 |ပိုပြီး ခံနိုင်ရည်ရှိပြီး မဲပေးခြင်းနှင့် ပျံ့နှံ့မှု ပိုမိုများလာစေသည်။ |
| 10 | 3 | 7 |ညှိနှိုင်းမှု ကုန်ကျစရိတ် မြင့်မားလာသည်၊ ကွန်ရက်နှင့် ကော်လီကတ်များကို ညှိပေးရန် ပိုမိုအရေးကြီးသည်။ |

"X node" ကို အကဲဖြတ်တဲ့အခါ မဲပေးတဲ့ validator တွေကို လေ့လာသူတွေကနေ ခွဲခြားပါ။ လေ့လာသူတွေကို ထည့်သွင်းတာက validator တွေထည့်တာထက် နည်းပါတယ်။ ဒါပေမဲ့ လေ့လာသူတွေဟာ ဘလော့ဂ် ဝေါဟာရ၊ ဘလော့ sync, disk နဲ့ ကွန်ရက် bandwidth ကို သုံးစွဲကြတုန်းပဲလေ။

## စွမ်းဆောင်ရည်အပေါ် သက်ရောက်မှုရှိစေသော အကြောင်းရင်းများ {#factors-that-influence-performance}

### Workload ပုံစံ {#workload-shape}

TPS တစ်ခုချင်းစီရဲ့ လုပ်ဆောင်ချက်အပေါ် မူတည်ပြီး စျေးပေါ (သို့) စျေးကြီးနိုင်ပါတယ်။ မှတ်တမ်း:

- ငွေပေးချေမှုအတွက် ညွှန်ကြားချက်အရေအတွက်
- လက်မှတ်တွက်ချက်ခြင်းနှင့် လက်မှတ်ရေးထိုးခြင်း အယ်လ်ဂိုရစ်သမ်များ
- Transaction byte အရွယ်အစားနှင့် decompressed payload အရွယ်အစား
- စာဖတ်/ရေးခြင်း အချိုးအစား
- metadata အရွယ်အစားနှင့် အရင်းအမြစ်လုပ်ငန်းများ
- စမတ်ကုထုံး၊ trigger နဲ့ IVM အကောင်အထည်ဖော်မှု ကုန်ကျစရိတ်
- တူညီတဲ့ အမ်ဳိးသားမ်ားကို ဆက္သြယ္ေနေသာ query load

သေးငယ်တဲ့ ငွေလွှဲပြောင်းမှုတွေဟာ စာချုပ်ကြီးမားတဲ့ (သို့) metadata လေးလံတဲ့ အလုပ်ဝန်ဆောင်မှုအတွက် ကိုယ်စားလှယ်မဟုတ်ဘူး။

### သဘောတူညီချက် အချိန်ဆွဲခြင်း {#consensus-timing}

Sumeragi အချိန်ကို ထိရောက်သော Sumeragi သတ်မှတ်ချက်များဖြင့် ထိန်းချုပ်ထားသည်-

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- NPoS mode ဖွင့်ထားပါက NPOS phase timeouts များ

ဒါတွေကို စစ်ဆေးပါ။

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

အချိန်ကိုလျော့ချရန် ရည်မှန်းချက်များသည် ကွန်ရက်၊ သိုလှောင်ခြင်းနှင့် လုပ်ဆောင်မှု အလွှာများ လိုက်နာနိုင်သည့် အခါသာ နှောင့်နှေးမှုကို မြှင့်တင်ပေးနိုင်သည်။ ပြောင်းလဲမှုများ၊ ပျောက်ဆုံးသော အသုံးဝင် ဝန်ဆောင်မှု ရယူမှု သို့မဟုတ် နောက်ပြန်ဖိအား ပေါ်လာတာနဲ့ အချိန်ကိုလျှော့ချခြင်းက ပုံမှန်အားဖြင့် စွမ်းဆောင်ရည်ကို ပိုဆိုးစေသည်။

### စုဆောင်းသူ Fanout {#collector-fanout}

အစုလိုက်အပြုံလိုက် မဲဆန္ဒရှင်တွေ ဘယ်လောက်မြန်မြန် စုစည်းလာတယ်ဆိုတာကို ကောက်ခံသူတွေရဲ့ သတ်မှတ်ချက်တွေက သက်ရောက်စေပါတယ်။

- `sumeragi.collectors.k` ကောက်ခံသူတွေက အမြင့်တစ်ခုအတွက် မဲဘယ်လောက် စုဆောင်းတယ်ဆိုတာကို ထိန်းချုပ်တယ်။
- `sumeragi.collectors.redundant_send_r` သည် ဒေသတွင်း အချိန်ဆွဲပြီးနောက် ထပ်မံမဲပေးခြင်းအား ထိန်းချုပ်သည်။
- `sumeragi.collectors.parallel_topology_fanout` ကောက်ခံသူတွေနဲ့အတူ topology fanout ကိုထည့်ပေးတယ်။

Fanout တိုးလာခြင်းက ပိုကြီးမားတဲ့ (သို့) အားနည်းတဲ့ ကွန်ရက်တွေမှာ အမြီးနှောင့်ယှက်မှုကို လျှော့ချနိုင်ပေမဲ့ Traffic ကိုလည်း မြှင့်တင်နိုင်ပါတယ်။ ဒီတန်ဖိုးတွေကို မပြောင်းခင် စုစုပေါင်းရရှိမှုနှင့် ကောက်ခံသူ တယ်လီမီထရီကို နှိုင်းယှဉ်ပါ။

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### ကွန်ရက်အခြေအနေများ {#network-conditions}

သဘောတူညီမှု စွမ်းဆောင်ရည်က အောက်ပါအချက်တွေကို ထိခိုက်စေပါတယ်။

- RTT အတည်ပြုသူအကြား
- jitter နဲ့ package ဆုံးရှုံးမှု
- Block payloads နှင့် RBC chunks များအတွက် bandwidth
- ဒေသများအကြား မညီမျှသော ဆက်နွယ်မှုများ
- NAT, peer connectivity ကို နှောင့်နှေးစေတဲ့ firewall (သို့) relay ပြုမူမှု

စီမံကိန်းစည်းမျဉ်းတစ်ခုအဖြစ် validator round trip များအပြင် execution နှင့် disk commit time ကိုဖုံးအုပ်နိုင်လောက်အောင် latency ဘတ်ဂျက်ကိုမြင့်မားစွာသတ်မှတ်ပါ။ p95 network RTT သည်ရည်ရွယ်သော p95 commit latency နီးစပ်နေပြီဆိုရင် ရည်မှန်းချက်က လက်တွေ့မကျဘူး။

### အတန်းများနှင့် ဝင်ခွင့် ကန့်သတ်ချက်များ {#queues-and-admission-limits}

Admission နဲ့ queue settings တွေက peer တစ်ခုရဲ့ burst pressure ကို ဘယ်လောက် စုပ်ယူနိုင်တယ်ဆိုတာကို သတ်မှတ်ပေးပါတယ်။

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- max လက်မှတ်၊ ညွှန်ကြားချက်တွေ၊ bytes နဲ့ decompressed bytes တို့လို genesis transaction limit တွေပါ။
- p2p queue cap များနှင့် သဘောတူညီချက်ဝင်ရောက်မှု ကန့်သတ်ချက်များ

မြင့်မားသော queue capacity က overload ကို ခဏလောက် လျှို့ဝှက်နိုင်ပေမဲ့ ရေရှည်တည်တံ့တဲ့ throughput ကို မတိုးစေပါဘူး။ တည်ငြိမ်တဲ့ queue ဟာ ကျန်းမာတယ်။ တိုးပွားနေတဲ့ queue က နောက်ကျနေတာပါ။

### Hardware နှင့် Storage {#hardware-and-storage}

အတည်ပြုသူတိုင်းကို တိုင်းတာပါ၊ ခေါင်းဆောင်တင်မဟုတ်ဘူး။

- CPU အတည်ပြုချက်၊ လက်မှတ်စစ်ဆေးမှုနှင့် အကောင်အထည်ဖော်မှုအတွင်း ကျေနပ်မှု
- စာတန်းတွေ၊ snapshots တွေနဲ့ active RBC sessions တွေထဲက memory pressure
- ဘလော့ storage နဲ့ snapshots တွေအတွက် disk write latency ကို
- Network transmit/receive saturation ကို ပေးပို့ခြင်း
- အလုပ်ဝန်ဆောင်မှုအတွက် အသုံးပြုတဲ့အခါ ရွေးချယ်စရာ Hardware အရှိန်မြှင့်ချက် setting များ

အနှေးဆုံး မဲပေးတဲ့ validator က ကွန်ရက်ရဲ့ Tail latency ကို သတ်မှတ်နိုင်တယ်။

## Prometheus လက္ခဏာများ {#prometheus-signals}

မက်ထရစ်အမည်များသည် build profile နှင့် feature set ကိုလိုက်၍ ကွဲပြားနိုင်သည်။ node တွင် `/metrics` ကို အရင်စစ်ဆေးပြီးရရှိနိုင်သော series အနီးတွင် dashboard များကို တည်ဆောက်ပါ။

သာမန် အချက်ပြမှုတွေကတော့

|အချက်ပြချက်|Prometheus နမူနာများ |ဘာကို ကြည့်ရမလဲ|
| --- | --- | --- |
|လက်ခံသော ထုတ်ကုန်များ |`sum(rate(txs{type="accepted"}[5m]))` |တည်ငြိမ်တဲ့ အခြေအနေမှာ ရည်မှန်းချက် TPS ကို ဖြည့်ဆည်းသင့်တယ် (သို့) ကျော်သင့်တယ် |
|ငြင်းပယ်ခြင်း |`sum(rate(txs{type="rejected"}[5m]))` |စမ်းသပ်မှု အစီအစဉ်နဲ့ ရှင်းပြသင့်ပါတယ်။|
|အချိန်ဆွဲမှုကို ချုပ်ဆို |`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |P95/p99 ကို latency ဘတ်ဂျက်နဲ့ နှိုင်းယှဉ်ကြည့်ပါ။|
|အတန်းအနက်|`queue_size`၊ `sumeragi_tx_queue_depth`|ဝန်ဆောင်မှု အမြင့်ဆုံးကာလအတွင်းမှာ ကန့်သတ်ထားသင့်ပါတယ်။|
|queue saturation ကို |`sumeragi_tx_queue_saturated` |တည်ငြိမ်သော သုညမဟုတ်တဲ့ တန်ဖိုးများဆိုသည်မှာ ဝန်ထုပ်လျှော့ချမှု |
|အပြောင်းအလဲများကို ကြည့်ရှု |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total`|မြင့်တက်နေတဲ့ တန်ဖိုးတွေက အချိန်ကာလ၊ ထိပ်ပိုင်းဆိုင်ရာ၊ အသုံးဝင်တဲ့ ဝန်ဆောင်မှု (သို့) ကွန်ရက် ပြဿနာကို ညွှန်ပြတယ်။ |
|ပိတ်ထားသော စာတိုများ |`dropped_messages`၊ `sumeragi_consensus_message_handling_total`|ဝန်ဆောင်မှုအတွင်း ကျဆင်းမှုဟာ မကြာခဏဆိုသလို နှောင့်နှေးမှု မြင့်တက်မှုကို ရှင်းပြပါတယ်။|
|RBC ဖိအား |`sumeragi_rbc_store_pressure`၊ `sumeragi_rbc_backpressure_deferrals_total`|အသုံးဝင် ဝန်ဆောင်မှု ပြန်လည်ထူထောင်ရေး (သို့) သိုလှောင်ခြင်းအတွက် သုညမဟုတ်တဲ့ ဖိအားမှတ်ချက်များ |
|အစုလိုက်အပြုံလိုက် ဆုံးဖြတ်ချက် ချမှတ် |`sumeragi_commit_signatures_counted`၊ `sumeragi_commit_signatures_required`|လက်မှတ်တွေ ရေတွက်ခံရရင် လိုအပ်တဲ့ အချိုးအစားကို အမြန်ဆုံး ရောက်ရှိသင့်ပါတယ်။|

`/v1/sumeragi/status` မှာသာ မက်ထရစ်တစ်ခုရှိတဲ့အခါ Prometheus scraping နဲ့အတူတူ Run artefacts တွေမှာ JSON snapshot ကိုရိုက်ယူပါ။

## ခန့်မှန်းချက် လုပ်ငန်းခွင် {#estimation-workflow}

1. ဇာတ်လမ်းကို သတ်မှတ်ပါ။
   - validator count နဲ့ observer count ကို
   - သဘောတူညီချက် mode
   - ရည်မှန်းချက် TPS
   - p95 နဲ့ p99 commit latency ဘတ်ဂျက်များ
   - ငွေပေးချေမှု ပေါင်းစပ်ခြင်း
   - expected network RTT, jitter, and bandwidth
2. ထိရောက်တဲ့ ဖွဲ့စည်းမှုကို မှတ်တမ်းတင်ပါ။

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. ရည်မှန်းချက် TPS မှာ အလုပ်အကိုင်ကို ပြေးဆွဲပါ။
4. ပြိုင်ပွဲရဲ့ အစ၊ အလယ်ပိုင်းနဲ့ အဆုံးမှာ အခြေအနေနဲ့ မက်ထရစ်တွေကို ရိုက်ယူပါ။
5. ပြေးလွှာကို စွမ်းဆောင်မှုအချိုးအစားဇယားနဲ့ သတ်မှတ်ပါ။
6. Band က Medium (သို့) Low ဆိုရင် တစ်ကြိမ်မှာ ကိရိယာ တစ်ခုကို ပြောင်းပြီး ထပ်လုပ်ပါ။

## Benchmark အစီရင်ခံစာ Template {#benchmark-report-template}

စွမ်းဆောင်မှု ကိန်းဂဏန်းတွေကို ပြန်လည်ထုတ်ဖော်ဖို့ လုံလောက်တဲ့ အခြေအနေနဲ့သာ ထုတ်ဝေပါ။

- Iroha commit၊ release နှင့် feature flag များ
- အတည်ပြုသူနဲ့ လေ့လာသူတွက်ချက်
- သဘောတူညီမှုပုံစံနှင့် Sumeragi သတ်မှတ်ချက်များ
- collector `k`, redundant send `r`, and topology fanout
- တယ်လီမီတာ ပရိုဖိုင်
- ပစ္စည်းကိရိယာ၊ သိုလှောင်ခြင်းနှင့် OS အသေးစိတ်အချက်အလက်များ
- network RTT, jitter, loss နှင့် bandwidth အယူအဆများ
- ငွေလဲလှယ်မှု ပေါင်းစပ်ခြင်းနှင့် အသုံးဝင် ဝန်ဆောင်မှု အရွယ်အစားများ
- ကမ်းလှမ်း TPS နှင့် ပြေးဆွဲမှုသက်တမ်း
- လက်ခံ/ပယ်ချ TPS
- p50/p95/p99 commit latency
- queue depth နဲ့ saturation တွေ
- View changes, dropped messages, pressure RBC နဲ့ missing payload counters တွေကို ကြည့်ပါ။
- CPU, မှတ်ဉာဏ်၊ disk နှင့် validator တစ်ခုစီအတွက် network အသုံးပြုမှု

ဒီ အသေးစိတ်အချက်အလက်တွေမရှိရင် TPS ကိန်းဂဏန်းကို သရုပ်ဖော်ချက်တစ်ခုအဖြစ် ယူဆသင့်ပါတယ်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [Izanami နဲ့ Chaos Testing ](./chaos-testing.md)
- [Torii အဆုံးသတ်မှတ်ချက်များ](../../reference/torii-endpoints.md)
- [လည်ပတ်မှု Iroha 3 မှတဆင့် CLI](../../get-started/operate-iroha-via-cli.md)
- [Peer configuration Reference ](../../reference/peer-config/params.md)
