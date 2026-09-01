---
translation_locale: my
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Izanami နဲ့ ဆူညံနေတဲ့ စမ်းသပ်မှု {#chaos-testing-with-izanami}

Izanami သည် upstream Iroha လုပ်ငန်းခွင်တွင် chaosnet orchestrator ဖြစ်ပါသည်။ ၎င်းသည် တစ်ခါသုံး ဒေသခံ Iroha အုပ်စုကိုစတင်ပြီး သတ်မှတ်နိုင်သော အလုပ်အကိုင်ဝန်ဆောင်မှုကို တင်သွင်းကာ ရွေးချယ်ထားသောကွန်ရက်တူညီသူများသို့အမှားများကိုထိုးပေးသည်။ ထို့ကြောင့် operator များသည်ထိန်းချုပ်သောအမှားအတွင်းကကွန်ရက်တိုးတက်မှုရှိမရှိ စစ်ဆေးနိုင်သည်။

Izanami ကို ထုတ်လုပ်မှု ကြိုတင် ခံနိုင်ရည် စစ်ဆေးခြင်း၊ ပြန်လည်ထုတ်လုပ်ခြင်းနှင့် သဘောတူညီချက် ညှိနှိုင်းခြင်းတို့အတွက် အသုံးပြုပါ။ ထုတ်လုပ်ရေးကွန်ရက်ကို မညွှန်းပါနဲ့။ ကိရိယာကို ဒီဇိုင်းထုတ်ထား ပါတယ်။ Network peers တွေကို ပိုင်ဆိုင်ဖို့၊ network peer restarts, storage wipes, temporary trusted peer partitions နဲ့ local CPU (သို့) disk pressure တို့အပါအဝင်။

## လိုအပ်ချက်များ {#prerequisites}

Izanami ကို [Iroha အရင်းအမြစ် မှတ်ပုံတင်](https://github.com/hyperledger-iroha/iroha) မှ run လုပ်ပါ၊ ဒီစာရွက်စာတမ်း သိုလှောင်ခန်းမှမဟုတ်ပါ။

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

binary ကို networked network peers တွေကို ဖန်တီးပြီး ထိန်းချုပ်ဖို့ ရှင်းလင်းစွာ ခွင့်ပြုရပါမယ်။ ခွင့်ပြုချက် `--allow-net` တစ်နိုင်ငံလုံးအတွက်TUI run သို့မဟုတ် enable လုပ်ပါ။ `allow_net` အထဲမှာ TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

အပြန်အလှန် run ကွန်ပြူတာအတွက်:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami သည် user config directory တွင် TUI နှင့် CLI settings များကို ဆက်လက်တည်ရှိသည်။ ပထမထုတ်ပြန်မှုဖိုင်မှာ explicit V1 layout byte တစ်ခုရှိသည်၊ ကြိုတင်ထုတ်ဝေခြင်း (သို့မဟုတ်) အခြားနည်းဖြင့် unversioned settings များအား ပယ်ချပြီး ရွှေ့ပြောင်းခြင်းအစား ပြန်လည်ဖန်တီးသင့်ပါသည်။ လက်ရှိပရိုဖိုင်ကို ပြန်လည်အသုံးပြုရန် မတိုင်မီ ပြသထားသော settings များကို စစ်ဆေးပါ။

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

command, seed, Iroha protocol finalisation, network peer count, faulty-peer count, workload profile, target TPS နဲ့ latency threshold ကို log တွေနဲ့အတူ မှတ်တမ်းတင်ပါ။ ဒီတန်ဖိုးတွေမရှိရင် အခြားအော်ပရေတာက ပျက်ကွက်မှုပုံစံတူကို ပြန်လည်ကစားလို့မရဘူး။

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
|Crash နှင့် restart ကို|`--fault-enable-crash-restart` |network peer process ဆုံးရှုံးမှုနဲ့ ပြန်လည်ထူထောင်ခြင်း |
|Storage ကို ဖျက်ပြီး restart လုပ်ပါ |`--fault-enable-wipe-storage` |ပျောက်ဆုံးနေတဲ့ ဒေသခံပြည်နယ်မှ ပြန်လည်ထူထောင်ခြင်း |
|မမှန်ကန်သော ငွေပေးချေမှု spam |`--fault-enable-spam-invalid-transactions` |လက်ခံခြင်းနှင့် ပယ်ချခြင်း လမ်းကြောင်းများ |
|ကွန်ရက် latency ကို |`--fault-enable-network-latency` |နှေးကွေးတဲ့ ဝေဖန်သံတွေ၊ နောက်ကျနေတဲ့ သဘောတူညီချက် စာတိုတွေ|
|ကွန်ရက်ပိုင်းခြားခြင်း |`--fault-enable-network-partition` |ယာယီ ယုံကြည်မှုရှိတဲ့ အဖော်တွေနဲ့ သီးသန့်ထားခြင်း |
|CPU စိတ်ဖိစီးမှု|`--fault-enable-cpu-stress` |ဒေသတွင်း စစ်ဆေးရေးနှင့် အစီအစဉ်ချရန် ဖိအား |
|Disk saturation ကို|`--fault-enable-disk-saturation` |ဒေသတွင်း သိုလှောင်မှု ဖိအား |

Network partition တစ်ခုတည်းသော run အတွက်:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

`--fault-window-start` နှင့် `--fault-window-end` ကို အသုံးပြု၍ ထိုးသွင်းမှု ပျက်ကွက်ခြင်းမတိုင်မီနှင့်အပြီးတွင် ထိန်းချုပ်ထားသော တည်ငြိမ်နေမှုကာလကို ထိန်းသိမ်းပါ။ ဤနည်းဖြင့် အစပျိုးမှု ဆူညံသံနှင့် အမှား၏ သက်ရောက်မှုကို ခွဲခြားရန် ပိုလွယ်ကူစေသည်။

## ဇာတ်ညွှန်းပုံစံများ {#scenario-shapes}

Upstream Izanami Catalogue က CLI profile တွေကို blockchain ဆက်သွယ်ရေး ပျက်ကွက်မှုပုံစံတွေကို မြေပုံထုတ်ပါတယ်။ ဒါတွေကို အလားတူ အလံတွေနဲ့ ပုံစံထုတ်နိုင်ပါတယ်။

|ဇာတ်ညွှန်း |သာမန်ပုံစံ |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|ရည်မှန်းထားသော ဝန်ဆောင်မှု |`--faulty 0`, မြင့်မားသော `--tps`, တင်သွင်းသူတစ်ဦး၊ မြင့်မားတဲ့ `--max-inflight` |
|ယာယီ ကျရှုံးမှု |အကန့်အသတ်ထားသော fault window အတွင်းတွင်သာ crash/restart လုပ်နိုင်ပါသည်။|
|ရပ်တန့်ခြင်းနဲ့ ပြန်လည်ထူထောင်ခြင်း |crash/ restart နဲ့အတူ ကျရှုံးနေတဲ့ peer population များစွာကို သုံးပါ။|
|ခေါင်းဆောင် အထီးကျန်မှု |Network-partition fault ကိုသာသုံးပြီး network peer တစ်ခုကို အသုံးပြုပါ။ Izanami က Sumeragi leader telemetry ကို လိုက်နာပါတယ်။|

တစ်ကြိမ်မှာ အပြောင်းအလဲ တစ်ခုကို ပြင်ထားပါ။ Network peer count, workload profile, fault window တွေကို ပြောင်းလိုက်ရင် TPS နဲ့အတူတူ ရလဒ်ကို အဓိပ္ပါယ်ဖွင့်ဖို့ ခက်ခဲပါတယ်။

## ဘာကို စောင့်ကြည့်ရမလဲ {#what-to-watch}

ပြေးစဉ်မှာ စွမ်းဆောင်ရည်ကို အတည်ပြုဖို့ သုံးတဲ့ အချက်ပြမှုတွေကို စောင့်ကြည့်ပါ။

- Running network peer တစ်ခုချင်းစီမှာ block-height တိုးတက်မှု
- တင်သွင်း၊ လက်ခံ၊ ပယ်ချပြီး အချိန်ကုန်ဆုံးသည့် ငွေကြေးလုပ်ငန်းများ
- queue depth၊ queue saturation နဲ့ API endpoint backpressure တွေကို
- View changes, recovery paths, missing blocks နဲ့ missing quorum certificates တွေကို ကြည့်ပါ။
- လက်မှတ်ရေးထိုးထားသော RS16 အသုံးပြုနိုင်မှု နောက်ကျနေခြင်း၊ စောင့်ဆိုင်းနေသည့် အစည်းအဝေးများနှင့် သဘောတူညီချက် ရောင်းဝယ်မှု နှောင့်နှေးခြင်း
- CPU, network peers တွေကို run လုပ်နေတဲ့ host က memory, disk နဲ့ network saturation ကို

validation-latency analysis အတွက် main-loop debug log တွေကို enable လုပ်ပါ။

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

ဘလော့တစ်ခုစီသည် `block validation timings` ကို `stateless_ms`, `execution_ms` နှင့် `total_ms` တို့နှင့် ထုတ်လွှင့်သင့်သည်။ သဘောတူညီချက် အချိန်ကာလများကို ပြောင်းလဲရန်မတိုင်မီ ထိုအချိန်ကို p95 ဘလော့ကွာဟချက်များ၊ ရှုထောင့်ပြောင်းလဲမှုတွက်စက်များနှင့် တန်းတန်းဖိအားများနှင့် နှိုင်းယှဉ်ပါ။

## ရလဒ်များကို ဖေါ်ပြခြင်း {#interpreting-results}

ရွေးချယ်ထားတဲ့ ကွန်ရက် အဖော်အားလုံးက ဘလော့တွေကို ပြီးဆုံးအောင် ဆက်လုပ်တဲ့အခါ Run ကို ကျန်းမာစွာ ပြုပြင်ပါ၊ backlog တွေဟာ bound ကင်းမဲ့ ကြီးထွားမလာဘူး၊ configured window အဆုံးသတ်ပြီးနောက် faults တွေက ပြန်လည်ထူထောင်ရေး လှုပ်ရှားမှု အသစ်တွေ ဖြစ်စေတာ ရပ်သွားပါတယ်။

ပြိုင်ပွဲကို ကျရှုံးမှုအဖြစ် သတ်မှတ်ပါ-

- `--progress-timeout` ထက် ပိုရှည်သော Block Progress Stalls များ
- Network peer heights တွေ ကွဲပြားပြီး ပြန်ပြန်မပြောင်းဘူး။
- p95 နှောင့်နှေးမှုသည် `--latency-p95-threshold` ထက်ပိုသည်။
- အဆက်မပြတ် ပြတင်းပေါက်ပိတ်ပြီးနောက် ပြေးလွှားရဲ့ ကျန်တဲ့အပိုင်းမှာ တန်းစီတွေ တိုးလာပါတယ်။
- ငြင်းပယ်ခံရတဲ့ (သို့) အချိန်ကုန်ဆုံးသွားတဲ့ ငွေကြေးလုပ်ငန်းတွေကို ရွေးချယ်ထားတဲ့ အလုပ်အကိုင် ဝန်ဆောင်မှုကြောင့် ရှင်းမပြနိုင်ပါ။
- Network peer restart, storage wipe (သို့) partition recovery ကို manual cleanup လုပ်ဖို့ လိုအပ်ပါတယ်။

ကျရှုံးမှုအပြီးမှာ တူညီတဲ့ မျိုးစေ့နဲ့ ကျရှုံးမှုအမျိုးအစား တစ်မျိုးနည်းနဲ့ ပြန်လည်ဖြန့်ချိပါ။ ဒါက အလုပ်ဝန်ဆောင်မှုနဲ့ အချိန်ကို ပြန်လည်ဖန်တီးနိုင်စေကာ ကျရှုံးမှု မျက်နှာပြင်ကို ကျဉ်းမြောင်းစေတယ်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](./metrics.md)
- [Bare Metal မှာ Running Iroha](./running-iroha-on-bare-metal.md)
- [Torii API အဆုံးသတ်မှတ်ချက်များ](../../reference/torii-endpoints.md)
