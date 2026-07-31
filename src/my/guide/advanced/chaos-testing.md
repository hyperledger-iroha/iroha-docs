---
translation_locale: my
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Izanami နဲ့ ဆူညံနေတဲ့ စမ်းသပ်မှု {#chaos-testing-with-izanami}

Izanami သည် upstream Iroha လုပ်ငန်းခွင်တွင် chaosnet orchestrator ဖြစ်သည်။ ၎င်းသည် တစ်ခါသုံး ဒေသခံ Iroha အုပ်စုကိုစတင်ပြီး သတ်မှတ်နိုင်သော အလုပ်အကိုင်အားသွင်းမှုကို ပေးပို့ကာ ရွေးချယ်ထားသည့် အဖော်များသို့အမှားများကို ထိုးပေးခြင်းဖြင့် ကွန်ရက်က ထိန်းချုပ်မှုပျက်စီးမှုအောက်မှာ တိုးတက်မှုရှိမရှိ စစ်ဆေးနိုင်သည်။

Izanami ကိုထုတ်လုပ်မှုမတိုင်မီ ခံနိုင်ရည် စစ်ဆေးခြင်း၊ ပြန်လည်ဖန်တီးခြင်းနှင့် သဘောတူညီချက် ညှိနှိုင်းမှုအတွက် အသုံးပြုပါ။ ထုတ်လုပ်ရေးကွန်ရက်ကို မညွှန်းပါနဲ့။ ကိရိယာသည် peer restarts, storage wipes, artificial packet loss နှင့် ဒေသတွင်း CPU သို့မဟုတ် disk ဖိအားအပါအဝင်စတင်သည့် peers ကိုပိုင်ဆိုင်ရန်ဒီဇိုင်းပြုပြင်ထားသည်။

## လိုအပ်ချက်များ {#prerequisites}

Izanami ကို [Iroha source repository ](https://github.com/hyperledger-iroha/iroha) မှ run လုပ်ပါ၊ ဤစာရွက်စာတမ်း repository မှမဟုတ်ပါ။

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

TUI မဟုတ်သော run တစ်ခုစီအတွက် `--allow-net` ကို Pass လုပ်ရန် သို့မဟုတ် TUI တွင် `allow_net` ကို Activate လုပ်ရန် အတည်ပြုရမည်။

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

အပြန်အလှန် run ကွန်ပြူတာအတွက်:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami သည် user config directory တွင် TUI နှင့် CLI setting များကို ဆက်ရှိနေသည်၊ ထို့ကြောင့် ယခင် profile ကို ပြန်လည်အသုံးပြုရန်မတိုင်မီ ပြထားသော settings များအား စစ်ဆေးပါ။

## မူလတန်း Run {#baseline-run}

ပြင်းထန်တဲ့ အမှားတွေ မဖြည့်ခင် ပြန်လည်ဖန်တီးနိုင်တဲ့ အခြေခံအဆင့်တစ်ခုနဲ့ စတင်ပါ။

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

ဒီ run ဟာ cluster က requested block target ကို ရောက်ရှိပြီး timeout အတွင်းမှာ တိုးတက်မှုကို ဆက်လက်ပြုလုပ်နေကာ optional p95 block interval threshold အောက်မှာ ရှိနေရင်သာ အောင်မြင်မှာပါ။

command, seed, Iroha commit, peer count, faulty-peer count, workload profile, target TPS နဲ့ latency threshold ကို log တွေနဲ့အတူ မှတ်တမ်းတင်ပါ။ ဒီတန်ဖိုးတွေမရှိရင် အခြား operator တစ်ခုက ပျက်ကွက်မှုပုံစံကို ပြန်လည်ရိုက်ကူးလို့မရဘူး။

## Workload Profiles များ {#workload-profiles}

Izanami မှာ workload profile နှစ်ခုရှိပါတယ်-

|Profile ကို |ဒါကို အသုံးပြုပါ။|မှတ်ချက်များ|
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable` |ရှည်လျားတဲ့ ရေစိုခံမှုတွေနဲ့ ပြန်လည်ဖန်တီးနိုင်တဲ့ စွမ်းဆောင်ရည် စစ်ဆေးမှုတွေ |ကျင့်သုံးမှု ဘေးကင်းတဲ့ ချက်ပြုတ်ချက်တွေကို ထောက်ခံတယ်။|
|`chaos` |ကျရှုံးမှုလမ်းကြောင်းအကာအကွယ် |ရည်ရွယ်ချက်မရှိတဲ့ ချက်ပြုတ်စာတွေ ပါဝင်ပါတယ်။ |

အရင်ဆုံး Stable Profile ကို သုံးပါ။

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

အခြေခံအဆောက်အအုံကို နားလည်ပြီးသား အချိန်မှာ ဆူညံမှုပုံစံဆီ ပြောင်းပါ။

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Contract deployment recipe တွေကို သီးသန့် ခွင့်ပြုချက်မရှိရင် Stable Run တွေမှာ ပိတ်ထားတယ်။

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

`--nexus` ကို run က upstream အလုပ်ခွင်က embedded SORA Nexus default တွေကို အသုံးပြုသင့်တဲ့အခါမှာ သုံးပါ။

## အမှားထိန်းချုပ်မှု {#fault-controls}

`--faulty` သည် သုညထက်ကြီးသည်ဆိုလျှင် အနည်းဆုံးအမှားစင်္ကျရီတစ်ခုကိုဖွင့်ထားရမည်ဖြစ်သည်။ Error ကို default to enabled သို့ပြောင်းပေးပြီး Boolean Flag များကို `=false` ဖြင့်ပိတ်နိုင်သည်။

|အမှား|CLI အလံ |၎င်းက ဘာကို လေ့ကျင့်ပေးလဲ။|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Crash နှင့် restart ကို|`--fault-enable-crash-restart` |Peer process ဆုံးရှုံးမှုနှင့် ပြန်လည်ထူထောင်ခြင်း |
|Storage ကို ဖျက်ပြီး restart လုပ်ပါ |`--fault-enable-wipe-storage` |ပျောက်ဆုံးနေတဲ့ ဒေသခံပြည်နယ်မှ ပြန်လည်ထူထောင်ခြင်း |
|မမှန်ကန်သော ငွေပေးချေမှု spam |`--fault-enable-spam-invalid-transactions` |လက်ခံခြင်းနှင့် ပယ်ချခြင်း လမ်းကြောင်းများ |
|ကွန်ရက် latency ကို |`--fault-enable-network-latency` |နှေးကွေးတဲ့ ဝေဖန်သံတွေ၊ နောက်ကျနေတဲ့ သဘောတူညီချက် စာတိုတွေ|
|ကွန်ရက်ပိုင်းခြားခြင်း |`--fault-enable-network-partition` |ယာယီ ယုံကြည်မှုရှိတဲ့ အဖော်တွေနဲ့ သီးသန့်နေခြင်း |
|P2P Package ဆုံးရှုံးမှု|`--fault-enable-network-packet-loss` |Application Framework Traffic ကျဆင်းသွားပြီ|
|CPU စိတ်ဖိစီးမှု|`--fault-enable-cpu-stress` |ဒေသတွင်း စစ်ဆေးရေးနှင့် အစီအစဉ်ချရန် ဖိအား |
|Disk saturation ကို|`--fault-enable-disk-saturation` |ဒေသတွင်း သိုလှောင်မှု ဖိအား |

Package-loss-only run အတွက်:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 20 \
  --faulty 5 \
  --duration 800s \
  --fault-window-start 133s \
  --fault-window-end 266s \
  --tps 200 \
  --submitters 20 \
  --max-inflight 512 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=false \
  --fault-enable-network-packet-loss=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --fault-network-packet-loss-percent 75 \
  --seed 42
```

`--fault-window-start` နှင့် `--fault-window-end` ကို အသုံးပြု၍ ထိုးသွင်းမှု ပျက်ကွက်ခြင်းမတိုင်မီနှင့်အပြီးတွင် ထိန်းချုပ်ထားသော တည်ငြိမ်နေမှုကာလကို ထိန်းသိမ်းပါ။ ဤနည်းဖြင့် အစပျိုးမှု ဆူညံသံနှင့် အမှား၏ သက်ရောက်မှုကို ခွဲခြားရန် ပိုလွယ်ကူစေသည်။

## ဇာတ်ညွှန်းပုံစံများ {#scenario-shapes}

Upstream Izanami Catalogue က CLI profile တွေကို blockchain ဆက်သွယ်ရေး ပျက်ကွက်မှုပုံစံတွေကို မြေပုံထုတ်ပါတယ်။ ဒါတွေကို အလားတူ အလံတွေနဲ့ ပုံစံထုတ်နိုင်ပါတယ်။

|ဇာတ်ညွှန်း |သာမန်ပုံစံ |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|ရည်မှန်းထားသော ဝန်ဆောင်မှု |`--faulty 0`, မြင့်မားသော `--tps`, တင်သွင်းသူတစ်ဦး၊ မြင့်မားတဲ့ `--max-inflight` |
|ယာယီ ကျရှုံးမှု |အကန့်အသတ်ထားသော fault window အတွင်းတွင်သာ crash/restart လုပ်နိုင်ပါသည်။|
|Package ဆုံးရှုံးမှု |Packet Loss ကိုသာ Activate လုပ်ပေးပါ အများအားဖြင့် default 75% loss rate နဲ့|
|ရပ်တန့်ခြင်းနဲ့ ပြန်လည်ထူထောင်ခြင်း |crash/ restart နဲ့အတူ ကျရှုံးနေတဲ့ peer population များစွာကို သုံးပါ။|
|ခေါင်းဆောင် အထီးကျန်မှု |Network partition (သို့) packet loss) အမှားများသာရှိသည့် မှားယွင်းသော peer တစ်ခုကိုတိကျစွာအသုံးပြုပါ Izanami သည် Sumeragi leader telemetry ကိုလိုက်နာသည်။ |

အပြောင်းအလဲတစ်ခုတည်းကို တစ်ချိန်တည်းမှာ တည်ငြိမ်ထားပါ။ သင်ဟာ peer count, workload profile, fault window နဲ့ TPS ကို တစ်ကြိမ်တည်း ပြောင်းလိုက်ရင် ရလဒ်ကို အဓိပ္ပါယ်ဖွင့်ဖို့ ခက်ခဲပါတယ်။

## ဘာကို စောင့်ကြည့်ရမလဲ {#what-to-watch}

ပြေးစဉ်မှာ စွမ်းဆောင်ရည်ကို အတည်ပြုဖို့ သုံးတဲ့ အချက်ပြမှုတွေကို စောင့်ကြည့်ပါ။

- ပြေးလွှားနေတဲ့ တူချင်းတိုင်းမှာ ဘလော့ အမြင့် တိုးတက်မှု
- တင်သွင်း၊ လက်ခံ၊ ပယ်ချပြီး အချိန်ကုန်ဆုံးသည့် ငွေကြေးလုပ်ငန်းများ
- queue depth၊ queue saturation နဲ့ endpoint backpressure တွေကို
- View changes, recovery paths, missing blocks နဲ့ missing quorum certificates တွေကို ကြည့်ပါ။
- RBC နောက်ကျနေခြင်း၊ စောင့်ဆိုင်းနေသော အစည်းအဝေးများနှင့် သဘောတူညီမှု ရောင်းအားလျှော့ချခြင်း (သို့မဟုတ်) နှောင့်နှေးခြင်း
- CPU, မှတ်ဉာဏ်, disk နှင့် peer များကို run host တွင်ကွန်ရက် saturation

validation-latency analysis အတွက် main-loop debug log တွေကို enable လုပ်ပါ။

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

ဘလော့တစ်ခုစီသည် `block validation timings` ကို `stateless_ms`, `execution_ms` နှင့် `total_ms` တို့နှင့် ထုတ်လွှင့်သင့်သည်။ သဘောတူညီချက် အချိန်ကာလများကို ပြောင်းလဲရန်မတိုင်မီ ထိုအချိန်ကို p95 ဘလော့ကွာဟချက်များ၊ ရှုထောင့်ပြောင်းလဲမှုတွက်စက်များနှင့် တန်းတန်းဖိအားများနှင့် နှိုင်းယှဉ်ပါ။

## ရလဒ်များကို ဖေါ်ပြခြင်း {#interpreting-results}

ရွေးချယ်ထားတဲ့ တူညီသူအားလုံးက ဘလော့တွေကို ဆက်လုပ်တဲ့အခါ Run ကို ကျန်းမာစွာ ပြုပြင်ပါ။ နောက်ကျပ်မှုတွေဟာ ချည်နှောင်ခြင်းမရှိဘဲ ကြီးထွားတာမဟုတ်ဘူး၊ ဖွဲ့စည်းထားတဲ့ ပြူတင်းပေါက် အဆုံးသတ်ပြီးနောက် အမှားတွေက ပြန်လည်ထူထောင်ရေး လှုပ်ရှားမှုကို ဖြစ်စေတာ ရပ်သွားတာပါ။

ပြိုင်ပွဲကို ကျရှုံးမှုအဖြစ် သတ်မှတ်ပါ-

- `--progress-timeout` ထက် ပိုရှည်သော Block Progress Stalls များ
- တူညီတဲ့ အမြင့်တွေက ကွဲပြားပြီး ပြန်မဆုံရဘူး။
- p95 နှောင့်နှေးမှုသည် `--latency-p95-threshold` ထက်ပိုသည်။
- အဆက်မပြတ် ပြတင်းပေါက်ပိတ်ပြီးနောက် ပြေးလွှားရဲ့ ကျန်တဲ့အပိုင်းမှာ တန်းစီတွေ တိုးလာပါတယ်။
- ငြင်းပယ်ခံရတဲ့ (သို့) အချိန်ကုန်ဆုံးသွားတဲ့ ငွေကြေးလုပ်ငန်းတွေကို ရွေးချယ်ထားတဲ့ အလုပ်အကိုင် ဝန်ဆောင်မှုကြောင့် ရှင်းမပြနိုင်ပါ။
- peer restart၊ storage wipe (သို့) packet loss recovery ကို manual cleanup လုပ်ဖို့လိုပါတယ်။

ကျရှုံးမှုအပြီးမှာ တူညီတဲ့ မျိုးစေ့နဲ့ ကျရှုံးမှုအမျိုးအစား တစ်မျိုးနည်းနဲ့ ပြန်လည်ဖြန့်ချိပါ။ ဒါက အလုပ်ဝန်ဆောင်မှုနဲ့ အချိန်ကို ပြန်လည်ဖန်တီးနိုင်စေကာ ကျရှုံးမှု မျက်နှာပြင်ကို ကျဉ်းမြောင်းစေတယ်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ ](./metrics.md)
- [Iroha ကို Bare Metal](./running-iroha-on-bare-metal.md) ပေါ်တွင် လည်ပတ်နေသည်။
- [Torii အဆုံးသတ်မှတ်ချက်များ](../../reference/torii-endpoints.md)
