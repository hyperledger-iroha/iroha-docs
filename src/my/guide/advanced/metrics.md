---
translation_locale: my
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ {#performance-and-metrics}

Iroha စွမ်းဆောင်ရည်က အလုပ်အကိုင်၊ validator topology, network တို့အပေါ် မူတည်ပါတယ်။
အခြေအနေများနှင့် သဘောတူညီချက် setting များ။ TPS ဒါကြောင့် ကိန်းဂဏန်းက အသုံးဝင်တာပဲ
သတ်မှတ်ထားတဲ့ configuration တစ်ခုနဲ့ benchmark run ကို ချိတ်ဆက်ထားတဲ့အခါမှာ

စွမ်းဆောင်ရည် စီမံခန့်ခွဲမှုအတွက် လုပ်ဆောင်ချက်များကို လုပ်ငန်းခွင်တစ်ခုအဖြစ် သတ်မှတ်ပါ။

- ကွန်ရက်က တောင်းဆိုထားတဲ့ ငွေလဲလှယ်နှုန်းကို လက်ခံတယ်။
- ရည်မှန်းထားတဲ့ ဘတ်ဂျက်အတွင်းမှာ အချိန်ဆွဲမှု ထိန်းသိမ်းဖို့ ကတိပေးပါ။
- ငွေပေးချေမှုတန်းများ ကန့်သတ်ထားခြင်း
- Consensus ဟာ အကြိမ်ကြိမ် မြင်ကွင်း ပြောင်းလဲမှု (သို့) ပြန်လည်ထူထောင်ရေး လမ်းကြောင်းတွေကို အားကိုးတာမဟုတ်ဘူး။

ဒီစာမျက်နှာကို အသုံးပြုပြီး deployment တစ်ခုဟာ high, medium, or low မှာရှိလား ခန့်မှန်းပါ
သတ်မှတ် node count အတွက် performance state၊ network latency threshold နဲ့ target
TPS.

## တိုင်းထွာရန် {#what-to-measure}

Operator ရဲ့ မျက်နှာပြင်တွေကို စပြီး Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

လူထုကို ဆန့်ကျင်တဲ့ စာဖတ်မှု ပုံစံကိုပဲ စမ်းကြည့်နိုင်ပါတယ်။ Taira:

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

အများပြည်သူ Taira မက်ထရစ်တွေဟာ အချက်ပြမှု အမည်တွေကို သင်ယူဖို့ အသုံးဝင်ပါတယ်။
သင့်ကိုယ်ပိုင် တပ်ဆင်မှုအတွက် ထုတ်လုပ်နိုင်စွမ်း ကိန်းဂဏန်းတွေအဖြစ်။

တူညီတဲ့ သဘောတူညီချက် snapshots တွေကို CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

Telemetry အမြင်က ဖွဲ့စည်းထားတဲ့ ပရိုဖိုင်အပေါ် မူတည်ပါတယ်။ `extended` သင်
လိုအပ်ချက် `/metrics`, အသုံးပြုခြင်း `full` အသေးစိတ်အချက်အလက်တွေ လိုအပ်တဲ့ စမ်းသပ်မှုတွေမှာ
Sumeragi လုပ်ငန်းရှင်လမ်းကြောင်းများ။

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## စွမ်းဆောင်မှု ဘက်တီးရီးယားများ {#performance-bands}

ဒီ bands တွေကို target throughput မှာ စောင့်ကြည့်တဲ့ run တစ်ခုအတွက် သုံးပါ။ `Y` TPS နောက်ဆုတ်ခြင်း
ဘတ်ဂျက် `L` မီလီစက္ကန့်တွေပေါ့၊ အပူချိန်ကို ထည့်သွင်းဖို့ အလုပ်အလျှပ်အစီးကို အချိန်ကြာအောင် လုပ်ပေးပါ။
တည်ငြိမ်တဲ့ အခြေအနေနဲ့ မျှော်လင့်ထားတဲ့ အမြင့်ဆုံး ဝန်ဆောင်မှု ကာလတစ်ခုလောက်ပါ။

| တီးဝိုင်း | အခြေအနေများ | အဓိပ္ပါယ် |
| --- | --- | --- |
| မြင့်မား | လက်ခံရရှိသော ထုတ်ကုန်နှုန်းသည် (သို့) အထက်ပါ `Y`, p95 commit latency က အောက်မှာရှိတယ် `0.8 * L`, အတန်းတွေဟာ စွမ်းပကားရဲ့ ၁၀% အောက်မှာရှိနေပြီး ရှုထောင့်ပြောင်း/ပြန်လည်ထူထောင်ရေး ကိန်းတွက်စက်တွေက ပိတ်ထားတယ်။ | တပ်ဆင်မှုမှာ တောင်းဆိုထားတဲ့ အလုပ်အကိုင်အတွက် နေရာရှိတယ် |
| အလတ်စား | လက်ခံရရှိသော ထုတ်ကုန်နှုန်းသည် `Y`, p95 commit latency က အောက်မှာရှိတယ် `L`, အတန်းတွေဟာ စွမ်းအင်ရဲ့ ၅၀% အောက်မှာ တည်ငြိမ်ပြီး မြင်ကွင်း ပြောင်းလဲမှုဟာ ရှားပါးပါတယ်။ | တပ်ဆင်မှု အလုပ်ဖြစ်ပေမဲ့ ပေါက်ကွဲမှု သည်းခံမှု ကန့်သတ်ထားတယ်။ |
| အနိမ့် | လက်ခံတဲ့ ထုတ်ကုန်နှုန်းက အောက်ပါအတိုင်းပါ။ `Y`, p95 commit latency exceeds `L`, ပြေးစဉ်မှာ တန်းစီတွေ တိုးလာတယ်၊ ဒါမှမဟုတ် အမြင်ပြောင်း/နောက်ပြန်ဖိအားတွက်စက်တွေက ဆက်တိုက်တိုးလာတယ် | တောင်းဆိုထားသော အလုပ်အကိုင် ဝန်ဆောင်မှုသည် အနည်းဆုံး bottleneck တစ်ခုထက်ပိုသည်။ |

အဓိက စည်းကမ်းကတော့ queue direction ပါ။ TPS ကတိပြုထားသည်ထက် ပိုများသည်။ TPS
အတန်းက ဆက်ပြီး ကြီးထွားလာနေတယ်၊ အသင့်သုံးမှုဟာ တိုတောင်းတဲ့ နမူနာတွေတောင် ဝန်ပိနေတယ်။
ကျန်းမာနေပုံပါ။

## Node Count နှင့် Quorum {#node-count-and-quorum}

ပိုများတဲ့ အတည်ပြုကိရိယာတွေက အမှားခံနိုင်ရည်ကို တိုးတက်စေပေမဲ့ ညှိနှိုင်းမှု၊ လက်မှတ်၊
လက်ရှိတွင် ကွန်ရက်ထုတ်လုပ်ရေး ကုန်ကျစရိတ်များ Sumeragi အကောင်အထည်ဖော်ခြင်း

- အတည်ပြုသူအရေအတွက် `n` ကျရှုံးမှု ဘတ်ဂျက်ကို ထုတ်ယူတယ်။ `f = floor((n - 1) / 3)`
- အတွက် `n >= 4`, အမိန့်ချမှတ်မှု ကော်မတီက `2f + 1`
- အတွက် `n <= 3`, အမိန့်ချမှတ်ဖို့ validators အားလုံးလိုအပ်တယ်။
- observer peers တွေဟာ sync blocks တွေကို လုပ်ပေမဲ့ မဲမပေး၊ အဆိုမတင်ဘူး၊ စုဆောင်းတာမျိုး မဟုတ်ဘူး။

| အတည်ပြုကိရိယာများ | အမှား ဘတ်ဂျက် | အမိန့်ချမှတ်မှု ကော်မတီ | အရည်အသွေး မှတ်ချက် |
| --- | --- | --- | --- |
| ၁ မှ ၃ | အွန်လိုင်းမှာ လက်တွေ့ လုပ်နိုင်စွမ်းမရှိပါ။ | အားလုံးကို validator များ | ဖွံ့ဖြိုးရေးနှင့် စမ်းသပ်မှု အသေးစားအတွက် အသုံးဝင်သည်။ ပျောက်ဆုံးသော validator မည်သည်မဆို commits ကိုရပ်ဆိုင်းနိုင်သည်။ |
| 4 | 1 | 3 | အမှားတစ်ခုတည်းကို ခံနိုင်ရည်ရှိမှုအတွက် အများဆုံးနည်းဆုံး |
| 7 | 2 | 5 | ပိုပြီး ခံနိုင်ရည်ရှိပြီး မဲပေးပို့မှုနှင့် ကြေညာရေး ယာဉ်များ ပိုမိုတိုးတက်လာစေရန် |
| 10 | 3 | 7 | ညှိနှိုင်းမှု ကုန်ကျစရိတ် မြင့်မားလာသည်၊ ကွန်ရက်နှင့် ကလက်ကထရောကို ညှိပေးရန် ပိုအရေးကြီးသည်။ |

"X node" တွေကို အကဲဖြတ်တဲ့အခါ အတည်ပြုသူတွေကို လေ့လာသူတွေကနေ ခွဲခြားပါ။
လေ့လာသူတွေဟာ ပုံမှန်အားဖြင့် validator တွေကို ပေါင်းထည့်တာထက် စျေးပိုနည်းပေမဲ့ လေ့လာသူတွေက သုံးစွဲနေဆဲပါ။
ဝေဖန်ပြောဆိုမှုကို တားဆီး၊ sync ကို တားဆီးကာ ဒစ်ကစ်နဲ့ ကွန်ရက် ဘက်ဒေးဘုတ်ကို ပိတ်ပါ။

## စွမ်းဆောင်ရည်ကို သက်ရောက်စေသော အကြောင်းရင်းများ {#factors-that-influence-performance}

### Workload ပုံစံ {#workload-shape}

အလားတူပဲ TPS ငွေပေးချေမှုတစ်ခုစီက ဘာလုပ်လဲဆိုတာ အပေါ် မူတည်ပြီး စျေးပေါ (သို့) စျေးကြီးနိုင်ပါတယ်။
မှတ်တမ်း:

- ငွေပေးချေမှုတစ်ခုစီအတွက် ညွှန်ကြားချက်အရေအတွက်
- လက်မှတ်တွက်ချက်ခြင်းနှင့် လက်မှတ်ရေးထိုးခြင်း အယ်လ်ဂိုရစ်သမ်များ
- Transaction byte size နဲ့ decompressed payload size တွေကို
- စာဖတ်/ရေးခြင်း နှုန်း
- metadata အရွယ်အစားနှင့် အရင်းအမြစ်လုပ်ငန်းများ
- smart contract၊ trigger နဲ့ IVM အကောင်အထည်ဖော်မှုစရိတ်
- တူညီတဲ့ peers တွေကို run လုပ်နေတဲ့ query load ကို

သေးငယ်တဲ့ လွှဲပြောင်းမှုလုပ်ငန်းတွေဟာ စာချုပ်အခက်အခဲ (သို့) metadata-heavy အတွက် ကိုယ်စားလှယ်မဟုတ်ဘူး။
အလုပ်ဝန်ဆောင်မှု။

### သဘောတူညီချက် အချိန်ဆွဲခြင်း {#consensus-timing}

Sumeragi အချိန်ကို ထိရောက်တဲ့ Sumeragi ကန့်သတ်ချက်များ

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- NPoS mode ဖွင့်ထားသည့် NPoS phase timeouts များ

သူတို့ကို စစ်ဆေးပါ

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

အချိန်ချမှတ်မှု ရည်မှန်းချက်တွေကို လျှော့ချပေးခြင်းက ကွန်ရက်၊ သိုလှောင်ရေးနဲ့
execution layer တွေကို လိုက်နာနိုင်ပါတယ်
အချိန်ကို လျှော့ချခြင်းက စွမ်းဆောင်မှုကို ပိုဆိုးစေပါတယ်။

### စုဆောင်းသူ Fanout {#collector-fanout}

ကောက်ခံသူတွေရဲ့ သတ်မှတ်ချက်တွေက အမိန့်ပေးမည့် မဲတွေ ဘယ်လောက်မြန်မြန် ပေါင်းစပ်လာတာကို သက်ရောက်စေပါတယ်။

- `sumeragi.collectors.k` အရွယ်အစားတစ်ခုအတွက် မဲဆန္ဒရှင်တွေ ဘယ်လောက် စုစည်းတယ်ဆိုတာကို ထိန်းချုပ်တယ်။
- `sumeragi.collectors.redundant_send_r` ကော်မတီက အတည်ပြုချက်ချမှတ်ပြီးနောက်
  ဒေသတွင်း အချိန်ဆွဲခြင်း
- `sumeragi.collectors.parallel_topology_fanout` Topology ကို Fanuut အနားမှာထည့်ပေးတယ်။
  စုဆောင်းသူ

Fanout တိုးလာခြင်းက ပိုကြီးမားတဲ့ (သို့) မလုံလောက်တဲ့ ကွန်ရက်တွေမှာ Tail latency ကို လျော့ကျစေနိုင်ပါတယ်။
စုစုပေါင်းရရှိနိုင်မှုနှင့် ကောက်ခံသူကို နှိုင်းယှဉ်ပါ။
ဒီတန်ဖိုးတွေကို ပြောင်းလဲမပေးခင် latency နဲ့ backpressure metrics တွေနဲ့ telemetry:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### ကွန်ရက် အခြေအနေများ {#network-conditions}

သဘောတူညီမှု စွမ်းဆောင်ရည်က အောက်ပါအချက်တွေကို အာရုံစိုက်ပါတယ်။

- RTT validator တွေကြားမှာ
- jitter နဲ့ packaging ဆုံးရှုံးမှု
- ဘလော့အကူအညီများအတွက် bandwidth နှင့် RBC အပိုင်းများ
- ဒေသများအကြားရှိ အချိုးမညီသော ဆက်သွယ်မှုများ
- NAT, firewall သို့မဟုတ် peer connectivity ကို နှောင့်နှေးစေတဲ့ relay ပြုမူမှု

စီမံကိန်း စည်းမျဉ်းတစ်ခုအနေနဲ့ အချိန်ဆွဲမှု ဘတ်ဂျက်ကို အများအပြားအတွက် ဖုံးအုပ်နိုင်လောက်အောင် မြင့်မားစွာ သတ်မှတ်ပါ။
validator round-trips plus execution နဲ့ disk commit time တွေကို RTT ရှိသည်
လိုချင်တဲ့ p95 commit latency နီးစပ်နေပြီဆိုတော့ ရည်မှန်းချက်က လက်တွေ့မကျဘူး။

### အတန်းများနှင့် ဝင်ခွင့် ကန့်သတ်ချက်များ {#queues-and-admission-limits}

Admission နဲ့ queue settings တွေက peer တစ်ခုရဲ့ burst pressure ဘယ်လောက် စုပ်ယူနိုင်တယ်ဆိုတာကို သတ်မှတ်ပေးပါတယ်။

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- max လက်မှတ်၊ ညွှန်ကြားချက်များ၊ bytes နှင့်
  decompressed bytes များ
- p2p queue caps နှင့် သဘောတူညီချက်ဝင်ရောက်မှု ကန့်သတ်ချက်များ

မြင့်မားတဲ့ တန်းစီနိုင်စွမ်းက အပူချိန်လျှော့ချမှုကို ခဏကြာ ဖုံးကွယ်ပေးနိုင်ပေမဲ့ တိုးမလာဘူး။
တည်ငြိမ်တဲ့ တန်းစီဟာ ကျန်းမာပါတယ်၊ တိုးပွားနေတဲ့ တန်းစီက နောက်ကျနေတာပါ။

### Hardware နှင့် Storage {#hardware-and-storage}

ခေါင်းဆောင်တင်မဟုတ်ပဲ အတည်ပြုသူတိုင်းကို တိုင်းတာပါ။

- CPU အတည်ပြုချက်၊ လက်မှတ်စစ်ဆေးမှုနှင့် အကောင်အထည်ဖော်မှုအတွင်း ကျေနပ်မှု
- စာတန်းများမှ မှတ်ဉာဏ်ဖိအား၊ snapshots များနှင့် active RBC အစည်းအဝေးများ
- ဘလော့ storage နှင့် snapshots များအတွက် disk write latency
- Network transmit/receive saturation
- အလုပ်ဝန်ထမ်းက သုံးတဲ့အခါ ရွေးချယ်စရာ Hardware အရှိန်နှုန်းသတ်မှတ်ချက်များ

အနှေးဆုံး မဲပေးတဲ့ အကောင်အထည်ဖော်သူက ကွန်ရက်ရဲ့ နောက်ဆုတ်မှု နှောင့်ယှက်မှုကို သတ်မှတ်နိုင်တယ်။

## Prometheus အချက်ပြချက်များ {#prometheus-signals}

မက်ထရစ်အမည်များသည် build profile နှင့် feature set ကိုလိုက်၍ကွဲပြားနိုင်သည်။ `/metrics` အပေါ်
ပထမဦးဆုံး node ကို တည်ဆောက်ပြီးနောက်မှာ ရယူနိုင်တဲ့ series တွေအနီးမှာ dashboard တွေကို ဆောက်လုပ်ပါ။

အများသုံး အချက်ပြမှုတွေကတော့

| အချက်ပြချက် | Prometheus နမူနာများ | ဘာကို ကြည့်ရမလဲ |
| --- | --- | --- |
| လက်ခံသော ထုတ်ကုန်ထုတ်လုပ်မှု | `sum(rate(txs{type="accepted"}[5m]))` | ရည်မှန်းချက်ကို ဖြည့်ဆည်းသင့်တယ် ဒါမှမဟုတ် ကျော်သင့်တယ် TPS တည်ငြိမ်တဲ့ အခြေအနေမှာ |
| ပယ်ချခြင်း | `sum(rate(txs{type="rejected"}[5m]))` | စမ်းသပ်မှု အစီအစဉ်နဲ့ ရှင်းပြရမယ်။ |
| အချိန်ဆွဲမှုကို ချုပ်ဆိုပါ | `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` | p95/p99 ကို latency ဘတ်ဂျက်နဲ့ နှိုင်းယှဉ်ပါ။ |
| အတန်းအနက် | `queue_size`, `sumeragi_tx_queue_depth` | အမြင့်ဆုံး ဝန်ဆောင်မှုအတွင်းမှာ အမိန့်ချမှတ်ထားသင့်ပါတယ်။ |
| အတန်း saturation | `sumeragi_tx_queue_saturated` | တည်တံ့သော သုညမဟုတ်တဲ့ တန်ဖိုးများဆိုသည်မှာ ဝန်ပိမှုအလွန် |
| အပြောင်းအလဲများကို ကြည့်ရှုရန် | `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` | မြင့်တက်လာတဲ့ တန်ဖိုးတွေက အချိန်၊ ထိပ်ပိုင်းဆိုင်ရာ၊ အသုံးဝင်မှု (သို့) ကွန်ရက် ပြဿနာကို ပြသပေးတယ်။ |
| ချန်ထားသော စာတိုများ | `dropped_messages`, `sumeragi_consensus_message_handling_total` | ဝန်ဆောင်မှုအတွင်း ကျဆင်းမှုဟာ မကြာခဏဆိုသလို အချိန်ဆွဲမှု မြင့်တက်မှုကို ရှင်းပြပါတယ်။ |
| RBC ဖိအား | `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` | အသုံးဝင် ဝန်ဆောင်မှု ပြန်လည်ထူထောင်ရေး (သို့) သိုလှောင်ခြင်းအတွက် သုညမဟုတ်သော ဖိအားမှတ်ချက်များ |
| အမိန့်ချမှတ်မှု ကော်မတီ | `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` | လက်မှတ်တွေ ရေတွက်ခံရရင် လိုအပ်တဲ့ ကော်ရန်မ်ကို အမြန်ရောက်ရှိသင့်ပါတယ်။ |

မက်ထရစ်တစ်ခုဟာ `/v1/sumeragi/status`, ဖမ်းယူ JSON snapshot ကို
Prometheus scraping နဲ့တူတဲ့ လက်ရာတွေပါ။

## ခန့်မှန်းချက် လုပ်ငန်းခွင် {#estimation-workflow}

1. ဇာတ်လမ်းကို သတ်မှတ်ပါ
   - validator နဲ့ observer တွေရဲ့အရေအတွက်
   - သဘောတူညီမှုပုံစံ
   - ရည်မှန်းချက် TPS
   - p95 နှင့် p99 commit latency ဘတ်ဂျက်များ
   - ငွေပေးချေမှု ပေါင်းစပ်ခြင်း
   - မျှော်မှန်းထားသော ကွန်ရက် RTT, jitter နဲ့ bandwidth
2. ထိရောက်တဲ့ ဖွဲ့စည်းမှုကို မှတ်တမ်းတင်ပါ။

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. ပစ်မှတ်ကို အလုပ်အလျှော့ပေးပါ။ TPS.
4. ပြိုင်ပွဲရဲ့ အစ၊ အလယ်နဲ့ အဆုံးမှာ အခြေအနေနဲ့ မက်ထရစ်တွေကို ဖမ်းယူပါ။
5. စွမ်းဆောင်မှုအချိုးအစားဇယားနဲ့ ပြေးလွှားကို အမျိုးအစားသတ်မှတ်ပါ။
6. Band က Medium (သို့) Low ဆိုရင် တစ်ကြိမ်မှာ အချက်တစ်ခုပြောင်းပြီး ထပ်လုပ်ပါ။

## Benchmark အစီရင်ခံစာ Template {#benchmark-report-template}

စွမ်းဆောင်မှု နံပါတ်တွေကို ပြန်လည်ထုတ်ဖော်ဖို့ လုံလောက်တဲ့ အခြေအနေနဲ့သာ ထုတ်ဝေပါ။

- Iroha commit, release နှင့် feature flag များ
- အတည်ပြုသူနဲ့ လေ့လာသူတွက်ချက်
- သဘောတူညီမှုပုံစံနဲ့ Sumeragi ကန့်သတ်ချက်
- စုဆောင်းသူ `k`, လျှော့ပေးပို့ခြင်း `r`, Topology ကို
- တယ်လီမီတာ ပရိုဖိုင်
- hardware, storage နှင့် OS အသေးစိတ်
- ကွန်ရက် RTT, jitter၊ loss နဲ့ bandwidth အယူအဆတွေ
- ကုန်သွယ်မှုပေါင်းစပ်မှုနဲ့ အသုံးဝင် ဝန်ဆောင်မှု အရွယ်အစားများ
- ကမ်းလှမ်း TPS ပြေးလွှားချိန်
- လက်ခံ/ ပယ်ချ TPS
- p50/p95/p99 commit latency
- အတန်းအနက်နဲ့ ပြည့်သိပ်မှု
- အပြောင်းအလဲတွေကို ကြည့်၊ မေ့ပစ်တဲ့ စာတိုတွေ RBC ဖိအားနဲ့ ပျောက်နေတဲ့ အသုံးဝင် ဝန်ဆောင်မှု ကိန်းတွက်စက်
- CPU, မှတ်ဉာဏ်၊ ဒစ်ကစ်နဲ့ validator တစ်ခုချင်းအတွက် ကွန်ရက်သုံးစွဲမှု

ဒီ အသေးစိတ်တွေမရှိရင် TPS ကိန်းဂဏန်းကို သရုပ်ဖော်ချက်အဖြစ် ယူဆသင့်ပါတယ်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [Izanami နဲ့ Chaos စမ်းသပ်မှု](./chaos-testing.md)
- [Torii အဆုံးသတ်မှတ်ချက်များ](../../reference/torii-endpoints.md)
- [လုပ်ဆောင်မှု Iroha 3 အပြင် CLI](../../get-started/operate-iroha-via-cli.md)
- [Peer ဖွဲ့စည်းမှု ရည်ညွှန်းချက်](../../reference/peer-config/params.md)
