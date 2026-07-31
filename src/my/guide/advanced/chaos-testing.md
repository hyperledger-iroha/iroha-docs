---
translation_locale: my
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Izanami နဲ့ Chaos စမ်းသပ်မှု {#chaos-testing-with-izanami}

Izanami ဟာ မြစ်ကြီးနားက Chaosnet Orchestrator ပါ။ Iroha အလုပ်ခွင်။
တစ်ကြိမ်သုံးနိုင်တဲ့ ဒေသကို စတယ်။ Iroha Cluster ကတော့ configurable workload ကို တင်ပေးပါတယ်။
အော်ပရေတာတွေ စစ်ဆေးနိုင်အောင် ရွေးချယ်ထားတဲ့ peers တွေကို fault တွေထိုးပေးတယ်။
ကွန်ရက်ဟာ ထိန်းချုပ်ထားတဲ့ ပျက်ကွက်မှုအောက်မှာ တိုးတက်မှုကို ဆက်လုပ်နေတယ်။

Izanami ကို ထုတ်လုပ်မှု ကြိုတင် ခံနိုင်ရည် စစ်ဆေးမှု၊ ပြန်လည်ဖန်တီးခြင်းအတွက် အသုံးပြုပါ။
ထုတ်လုပ်ရေးကွန်ရက်ကို ဦးတည်မထားပါနဲ့။ ကိရိယာက
၎င်းစတင်သည့် peers ကိုပိုင်ဆိုင်ရန်ဒီဇိုင်းထုတ်ထားသည်၊ peer restarts အပါအဝင်, သိုလှောင်ခြင်း
အဝတ်လျှော်စက်တွေ၊ ကျယ်ပြန့်တဲ့အိတ်တွေ ဆုံးရှုံးမှုတွေနဲ့ ဒေသတွင်း CPU (သို့) disk ဖိအားပါ။

## လိုအပ်ချက်များ {#prerequisites}

Izanami ကို Run ကနေ
[Iroha အရင်းအမြစ် သိုလှောင်ရုံ](https://github.com/hyperledger-iroha/iroha),
ဒီစာရွက်စာတမ်း သိုလှောင်ခန်းမှမဟုတ်ပါ

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

binary ကို networked ကို ဖန်တီးပြီး manipulate လုပ်ခွင့်ပြုရပါမယ်။
တူညီသူတွေ၊ ခွင့်ပြုပါ။ `--allow-net` မလုပ်တဲ့ လူတိုင်းအတွက်TUI run လုပ်၊ activate လုပ် `allow_net` အထဲမှာ
ကော်မတီ TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Interactive run configuration အတွက်:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami က ဆက်လက်နေဆဲပါ။ TUI နှင့် CLI user config directory အောက်က settings တွေကို
အရင် profile တစ်ခုကို ပြန်သုံးမလုပ်ခင် ပြထားတဲ့ settings တွေကို review လုပ်ပါ။

## မူလတန်း Run {#baseline-run}

ပြင်းထန်တဲ့ အမှားတွေ မဖြည့်ခင် ပြန်လည်ဖန်တီးနိုင်တဲ့ အခြေခံအဆင့်တစ်ခုနဲ့စပါ။

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

ဒီ run ဟာ cluster က requested block target ကို ရောက်သွားရင်သာ အောင်မြင်ပါတယ်။
အချိန်ကာလအတွင်း တိုးတက်မှုရှိပြီး ရွေးချယ်စရာ p95 အောက်မှာရှိနေ
ပိတ်ချိန်အကန့်အသတ်နိမိတ်။

အမိန့်ကို မှတ်တမ်းတင်ပါ၊ မျိုးစေ့။ Iroha commit, peer count, faulty peer count
အလုပ်အကိုင်ပရိုဖိုင်း၊ ရည်မှန်းချက် TPS, မှတ်တမ်းတွေနဲ့အတူ အချိန်ဆွဲမှုနိမ့်နိမိတ်ပါ။
ဒီတန်ဖိုးတွေဆိုရင် အခြား operator တစ်ခုက တူညီတဲ့ ပျက်ကွက်မှုပုံစံကို ပြန်မပြနိုင်ဘူး။

## အလုပ်အကိုင် ဝန်ဆောင်မှု Profiles {#workload-profiles}

Izanami မှာ Workload Profiles နှစ်ခုရှိပါတယ်။

| အမည်စာရင်း  | ဒါကို အသုံးပြုပါ။                                         | မှတ်ချက်များ                                  |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` | ရေစုပ်တာရှည်နဲ့ ပြန်လည်ဖန်တီးနိုင်တဲ့ စွမ်းဆောင်ရည် စစ်ဆေးမှု | ကျင့်သုံးမှု ဘေးကင်းတဲ့ ဟင်းသီးဟင်းရွက်တွေ          |
| `chaos`  | ကျရှုံးမှုလမ်းကြောင်းအကာအကွယ်                              | ရည်ရွယ်ချက်မရှိတဲ့ ချက်ပြုတ်စာတွေ ပါတယ် |

အရင်ဆုံး Stable Profile ကို သုံးပါ။

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

အခြေခံအတန်းကို နားလည်ပြီးပြီဆိုရင် ဆူညံသံသယဖြစ်မှု ဘက်ထရီကို ပြောင်းပါ။

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Contract deployment recipe တွေကို တိကျစွာ မပြောဆိုရင် Stable Run တွေမှာ ပိတ်ထားတယ်။
ခွင့်ပြုချက်:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

အသုံးပြုခြင်း `--nexus` Run မှာ embedded ကို အသုံးပြုသင့်တဲ့ အချိန် SORA Nexus ကွဲပြားချက်များ
အထက်စီးဆင်းတဲ့ အလုပ်ခွင်ပါ။

## အမှားထိန်းချုပ်မှု {#fault-controls}

ဘယ်အချိန်မှာ `--faulty` သုညထက် ပိုများပါက အနည်းဆုံးအမှားတစ်ခုဖြစ်ရပါမယ်။
default to enabled ကို error toggles လုပ်ပြီး Boolean flag တွေကို
မသန်စွမ်းသူများ `=false`.

| အမှား                    | CLI အလံ                                   | ၎င်းက ဘာကို လေ့ကျင့်ပေးသလဲ                          |
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
| Crash နှင့် restart        | `--fault-enable-crash-restart`             | အချိုးအစားများ ဆုံးရှုံးခြင်းနှင့် ပြန်လည်ထူထောင်ခြင်း             |
| သိုလှောင်မှုကို ပိတ်ပြီး ပြန်လည်စတင်ပါ။ | `--fault-enable-wipe-storage`              | ပျောက်ဆုံးနေသော ဒေသတွင်းပြည်နယ်မှ ပြန်လည်ထူထောင်ခြင်း          |
| မတည်ငြိမ်သော ငွေကြေးပို့ဆောင်မှု spam | `--fault-enable-spam-invalid-transactions` | လက်ခံခြင်းနှင့် ငြင်းပယ်ခြင်း လမ်းကြောင်းများ              |
| ကွန်ရက် latency          | `--fault-enable-network-latency`           | နှေးကွေးတဲ့ ဝေဖန်ပြောဆိုခြင်းနဲ့ သဘောတူညီမှု စာတိုတွေ နောက်ကျသွားတာ |
| ကွန်ရက်ပိုင်းခြားခြင်း        | `--fault-enable-network-partition`         | ယာယီ အမှီအခိုကင်းစင်မှု           |
| P2P အိတ်ပျက်စီးမှု          | `--fault-enable-network-packet-loss`       | Application Frame Traffic ကျဆင်းသွားပြီ          |
| CPU စိတ်ဖိစီးမှု               | `--fault-enable-cpu-stress`                | ဒေသတွင်းအတည်ပြုမှုနှင့် အစီအစဉ်ချခြင်း ဖိအား   |
| ဒစ်ကီ saturation          | `--fault-enable-disk-saturation`           | ဒေသတွင်း သိုလှောင်မှု ဖိအား                     |

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

အသုံးပြုခြင်း `--fault-window-start` နှင့် `--fault-window-end` ထိန်းချုပ်ထားဖို့
ထိုးသွင်းမှု ပျက်ကွက်မှုမတိုင်ခင်နဲ့ နောက်ပိုင်းမှာ steady state ကာလပါ။
အမှားရဲ့ သက်ရောက်မှုကနေ စတင်သံကို ခွဲခြားဖို့ ပိုလွယ်ပါတယ်။

## ဇာတ်ညွှန်းပုံစံများ {#scenario-shapes}

Upstream Izanami ကလက်ဂရမ်များအကြားတွင်ဖြစ်သော blockchain ဆက်သွယ်ရေးပြဿနာများ
ပုံသဏ္ဍာန်များ CLI ဒီပရိုဖိုင်တွေကို အလံတွေနဲ့ ပုံစံထုတ်နိုင်ပါတယ်။

| ဇာတ်ညွှန်း              | သာမန်ပုံစံ                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| ရည်မှန်းထားသော ဝန်ဆောင်မှု         | `--faulty 0`, မြင့်မား `--tps`, တင်ပြသူတစ်ဦး၊ မြင့်မား `--max-inflight`                                                         |
| ယာယီ ပျက်ကွက်မှု     | အကန့်အသတ်ထားတဲ့ fault window အတွင်းမှာသာ crash/restart လုပ်နိုင်ပါ                                                                  |
| အိတ်ပျက်စီးမှု           | Packet loss ကိုသာ enable လုပ်နိုင်ပါသည်၊ ပုံမှန်အားဖြင့် default 75% loss rate နဲ့                                                          |
| ရပ်တန့်ခြင်းနှင့် ပြန်လည်ထူထောင်ခြင်း | crash/restart နဲ့အတူ ကျရှုံးနေတဲ့ peer လူစုကို အသုံးပြုပါ။                                                                    |
| ခေါင်းဆောင် သီးသန့်ထားခြင်း      | Network partition သို့မဟုတ် packet loss fault တွေကိုသာ အသုံးပြုပြီး Izanami ကိုသုံးပါ။ Sumeragi ခေါင်းဆောင် တယ်လီမီထရီ |

တစ်ချိန်တည်းမှာ ကိန်းရှင် တစ်ခုကို တည်ငြိမ်ထားပါ။
Profile, fault window နဲ့ TPS တစ်ချိန်တည်းမှာ ရလဒ်က ခက်ခဲပါတယ်။
အနက်ပြန်ပါ။

## ဘာကိုကြည့်သင့်သလဲ {#what-to-watch}

ပြေးစဉ်မှာ စွမ်းဆောင်မှု အတည်ပြုဖို့ သုံးတဲ့ အချက်ပြမှုတွေကို စောင့်ကြည့်ပါ။

- ပြေးနေတဲ့ အဖော်တိုင်းမှာ ဘလော့ အမြင့် တိုးတက်မှု
- တင်သွင်း၊ လက်ခံ၊ ပယ်ချပြီး အချိန်ကုန်ဆုံးတဲ့ ငွေကြေးလုပ်ငန်းများ
- queue depth၊ queue saturation နဲ့ endpoint backpressure တွေကို
- အပြောင်းအလဲများ၊ ပြန်လည်ထူထောင်ရေးလမ်းကြောင်းများ၊ ပျောက်ဆုံးသော ဘလော့များနှင့် ပျောက်ဆုံးနေသည့် ကွမ်ရမ်
  အထောက်အထားများ
- RBC နောက်ကျနေမှုတွေ၊ စောင့်ဆိုင်းနေတဲ့ အစည်းအဝေးတွေနဲ့ သဘောတူညီချက် ရောင်းဝယ်မှု ကျဆင်းတာ (သို့) နှောင့်နှေးသွားတာ
- CPU, memory, disk နဲ့ network saturation တွေကို peers ကို run လုပ်နေတဲ့ host မှာ

validation-latency analysis အတွက် main-loop debug log တွေကို enable လုပ်ပါ။

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

ဘလော့က တစ်ခုချင်းစီ ထုတ်လွှတ်သင့်ပါတယ်။ `block validation timings` နှင့်အတူ `stateless_ms`,
`execution_ms`, နှင့် `total_ms`. အဲဒီအချိန်တွေကို p95 ဘလော့နဲ့ နှိုင်းယှဉ်ကြည့်ပါ။
Intervals, view change counters နဲ့ queue pressure တွေကို ပြောင်းလဲမလုပ်ခင်
သဘောတူညီချက် အချိန်ဆွဲသူ။

## ရလဒ်များကို အနက်ကောက်ခြင်း {#interpreting-results}

ရွေးချယ်ထားတဲ့ အဖော်တွေအားလုံး ဆက်ပြီး တားမြစ်မှုတွေ လုပ်နေတဲ့အခါ ပြေးတာကို ကျန်းမာတယ်လို့ ယူဆပါ။
backlog သည် bound မပါဘဲ ကြီးထွားခြင်းမရှိတော့ပါ။ အမှားများက ပြန်လည်ထူထောင်မှုကို ဖြစ်ပေါ်စေတာ ရပ်တန့်သွားသည်
ပြတင်းပေါက်ဖွင့်ပြီးနောက် လှုပ်ရှားမှု။

ပြိုင်ပွဲကို ကျရှုံးမှုအဖြစ် သတ်မှတ်ပါ

- Block တိုးတက်မှု stalls များထက်ပို `--progress-timeout`
- တူညီတဲ့ အမြင့်တွေက ကွဲပြားပြီး ပြန်မဆုံဘူး။
- p95 latency exceeds `--latency-p95-threshold`
- ပြေးလွှာတစ်ခု ပိတ်ပြီးနောက် အတန်းတွေ ဆက်တိုးလာတယ်
- ငြင်းပယ်ခံရတဲ့ (သို့) အချိန်ကုန်ဆုံးသွားတဲ့ ငွေကြေးလုပ်ငန်းတွေကို ရွေးချယ်ထားတဲ့
  အလုပ်အကိုင်
- peer restart၊ storage wipe သို့မဟုတ် packet loss recovery အတွက် manual လိုအပ်ပါတယ်။
  သန့်ရှင်းရေး

ကျရှုံးမှုအပြီးမှာ မျိုးစေ့တစ်ခုတည်းနဲ့ ကျရှုံးမှုအမျိုးအစား တစ်မျိုးနည်းနဲ့ ထပ်လုပ်ပါ။
အလုပ်ချိန်နဲ့ အချိန်ကို ပြန်လည်ဖန်တီးနိုင်အောင် ထိန်းထားပြီး ပျက်ကွက်မှုကို ကျဉ်းမြောင်းစေပါတယ်။
မျက်နှာပြင်။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](./metrics.md)
- [ပြေးနေခြင်း Iroha Bare Metal ပေါ်မှာ](./running-iroha-on-bare-metal.md)
- [Torii အဆုံးသတ်မှတ်ချက်များ](../../reference/torii-endpoints.md)
