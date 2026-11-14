---
translation_locale: my
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ သည် Iroha ၏ ရွေးချယ်သော အကောင်အထည်ဖော်မှု သက်ရောက်မှုများအတွက် STARK သက်သေခံလမ်းကြောင်းဖြစ်သည်။ ၎င်းသည် ပုံမှန် ငွေကြေးဆောင်ရွက်မှု သို့မဟုတ် သဘောတူညီချက်ကို အစားထိုးခြင်းမဟုတ်ပါ။ ငွေကြေးဆက်သွယ်မှုများ ISI, IVM နဲ့ Sumeragi တို့ကို ပုံမှန်အတိုင်း ဖြတ်သန်းပါ။ FastPQ က deterministic execution witness ကို စားသုံးပြီး supported effects တွေကို proof batches အဖြစ် ပြောင်းပါတယ်။

လက်ရှိ host ပေါင်းစည်းမှုတွင် အဓိကလမ်းကြောင်း နှစ်ခုရှိသည်:

- ဘလော့ချ် အကောင်အထည်ဖော်မှုအတွင်း မှတ်တမ်းတင်ထားသော ပမာဏအရ အရင်းအမြစ် လွှဲပြောင်းမှုများ
- `fastpq_binding` တွင် FastPQ ချိတ်ဆက်မှု ပါဝင်သော SORA Nexus AXT သက်သေ envelope များ

## သက်သေခံလမ်းကို လွှဲပြောင်းခြင်း {#transfer-witness-path}

ပွင့်လင်းမြင်သာတဲ့ ကိန်းဂဏန်းလွှဲပြောင်းမှုတွေဟာ ညွှန်ကြားချက်က ဟန်ချက်ညီမှုကို ပြောင်းလဲတဲ့အခါ တည်ဆောက်ထားတဲ့ လွှဲပြောင်းရေး စာသားကို ဖန်တီးပါတယ်။ စာသားလွှဲပြောင်းမှုက မှတ်တမ်းတင်တယ်။

- အရင်းအမြစ်စာရင်း၊ ရည်ရွယ်ချက်စာရင်း၊ ပိုင်ဆိုင်မှု သတ်မှတ်ချက်နှင့် ပမာဏ
- လွှဲပြောင်းခြင်းမတိုင်မီနှင့် နောက်ပိုင်းတွင် ပေးပို့သူနှင့် လက်ခံသူ၏ ငွေကြေးညီမျှမှု
- အစုလိုက်အပြုံလိုက် cryptographic hash အဖြစ် အသုံးပြုသော transaction entry point cryptographic Hash ကို
- ခွင့်ပြုချက်ထုတ်လွှင့်သူစာရင်းမှ ရယူထားသော အဓိက cryptographic digest တန်ဖိုး
- Single-delta transcripts တွေအတွက် Poseidon cryptographic digest value တစ်ခု

Batch transfer တွေမှာ delta အမျိုးမျိုးပါတဲ့ transcript တစ်ခုကို သုံးပါတယ်။ ဒီကိစ္စထဲမှာ single-delta Poseidon cryptographic digest value က မရှိပါဘူး။

Iroha သည် ဤစာသားများကို entrypoint cryptographic hash ဖြင့်စုစည်းပေးသည်။ အကောင်အထည်ဖော်မှုသက်သေသည်နောက်တွင်မူလစာသားပူးတွဲများနှင့် Prover အတွက်ပြင်ဆင်ထားသော FastPQ ကူးပြောင်းမှုဗားရှင်းများကို သယ်ဆောင်ပါမည်။

Transfer delta တစ်ခုချင်းစီဟာ ကူးပြောင်းမှု အတန်းနှစ်ခုဖြစ်လာတယ်။

|အတန်း |သော့ပုံစံ|ကြိုတင်တန်ဖိုး |တန်ဖိုးအပြီး |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|ပေးပို့သူ ချေးငွေ|`asset/<asset-definition>/<source-account>` |အရင်က ပေးပို့သူ ဘန်လန်|ပေးပို့သူစာရင်းအင်းနောက်|
|လက်ခံရရှိသူကွင်းငွေ |`asset/<asset-definition>/<destination-account>` |receiver balance ကို အရင်က|လက်ခံရရှိသူရဲ့ ငွေကြေးပမာဏ |

ကိန်းဂဏန်းတန်ဖိုးများကို ကိန်းပြည့် witness ယူနစ်များအဖြစ် စံပြုပြောင်းလဲသည်။ ရွေးချယ်ထားသော ဒသမစကေးတွင် အနုတ်မဟုတ်သည့် `u64` အဖြစ် မဖော်ပြနိုင်သော တန်ဖိုးကို FastPQ အစုလိုက်လုပ်ဆောင်မှုအတွက် ပယ်ချသည်။

## ပြည်သူ့ဝင်ငွေများ {#public-inputs}

FastPQ ကူးပြောင်းမှုအစုတိုင်းမှာ အတည်ပြုချက်ကို ဘလော့ကတ်နဲ့ အကောင်အထည်ဖော်မှု အခြေအနေကို ချိတ်ဆက်တဲ့ အများပြည်သူ input တွေပါဝင်ပါတယ်။

|ထည့်သွင်းချက်|အဓိပ္ပါယ်|
| ------------- | --------------------------------------------------------------- |
| `dsid` | little-endian byte များဖြင့် ကုဒ်သွင်းထားသော data space identifier |
|`slot` |ဘလော့ဖန်တီးမှု အချိန်ကို နာနိုစက္ကန့်များသို့ ပြောင်းလဲ |
| `old_root` | လုပ်ဆောင်မှု သက်သေဒေတာမှ ရရှိသည့် မိဘအခြေအနေ၏ အမြစ်တန်ဖိုး |
| `new_root` | လုပ်ဆောင်မှု သက်သေဒေတာမှ ရရှိသည့် လုပ်ဆောင်ပြီးနောက် အခြေအနေ၏ အမြစ်တန်ဖိုး |
|`perm_root` |Poseidon cryptographic commitment value ကို Active Role ခွင့်ပြုချက်တွေထက် တန်ဖိုးထားတယ်။ |
|`tx_set_hash` |ဂဏန်းဝှက် hash ကို sorted transaction နှင့် time-trigger entrypoint ဂဏန်း၀ှက် hash များအပေါ် |

Host သည် ဤ batch များအတွက် ပထမထုတ်ဝေမှု၏ တစ်ခုတည်းသော ပါရာမီတာအစုဖြစ်သည့် `fastpq-state-transition-stark-v1` ကို အသုံးပြုသည်။

## သက်သေ ပရိုတိုကော {#proof-protocol}

စံ လွှဲပြောင်းမှု ရလဒ်များသည် ဒီဂရီ-၄ တိုးချဲ့မှုပါသော Goldilocks ကွင်းပေါ်ရှိ ဖုံးကွယ်ထားသော (masked) DEEP သက်သေများ ဖြစ်သည်။ ၎င်းတို့၏ တိကျသော ဆက်နွယ်ချက်၊ transcript နှင့် query ဂျီဩမေတြီကို pin လုပ်ထားသော [FastPQ DEEP ပရိုတိုကော သတ်မှတ်ချက်](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) တွင် သတ်မှတ်ထားသည်။

## သမ္မာကျမ်းရဲ့ စစ်ဆေးချက်များ {#what-the-prover-checks}

FastPQ Prover သည် trace ကိုတည်ဆောက်ရန်မတိုင်မီမှာ အပြောင်းအလဲခလုတ်၊ လုပ်ဆောင်မှုတန်းအစားနှင့်ထည့်သွင်းခြင်းအစီအစဉ်ဖြင့် အုပ်စုအမိန့်ကို canonicalize လုပ်သည်။ လွှဲပြောင်းမှုလိုင်းများတွင်လည်း transcript metadata များလိုအပ်ပါသည်။ လွှဲပြောင်းရေးလိုင်းများရှိသော်လည်း transfer transcripts မရှိသည့် အုပ်စုသည် invalid ဖြစ်ပါသည်။

ငွေလွှဲပြောင်းမှု စာရွက်စာတမ်းများအတွက် အတည်ပြုချက်အပြင် စစ်ဆေးမှုများမှာ အောက်ပါအချက်တွေ ပါဝင်ပါတယ်။

- ပေးပို့သူ balance ကို underflow မဖြစ်သင့်ပါ။
- `sender_after` သည် `sender_before - amount` နှင့်ညီရမည်။
- `receiver_after` သည် `receiver_before + amount` နှင့်ညီရမည်။
- စာရွက်စာတမ်းက အလှူအတန်းတစ်ခုစီကို ဖုံးအုပ်ရပါမယ်။
- Single-delta Poseidon cryptographic digest value ရှိပါက transcript preimage နဲ့ ကိုက်ညီရပါမယ်။
- စပါး-Merkle proofs တွေကို version 1 အဖြစ် decode လုပ်ရပါမယ်။ ပျောက်နေတဲ့ paths တွေကို deterministic synthetic proofs တွေနဲ့ဖြည့်ထားတယ်။

Trace တွင် transfer, issue, destroy, role grant, role revoke, metadata set နှင့် permission search row များအတွက် selector columns များပါဝင်သည်။ numeric operation rows များတွင်လည်း လက်မှတ်ထိုးထားသော delta များ၊ asset-per-asset delta များနှင့် supply counters တို့ပါ ၀ င်သည်။

## Prover စီမံခန့်ခွဲမှုလမ်းကြောင်း {#prover-lane}

`iroha3d` သည် FastPQ prover execution lane ကို startup တွင်စတင်ပါက prover backend ကို အစပျိုးနိုင်သည်။ အကောင်အထည်ဖော်ရေး lane သည်သတ်မှတ်ထားသော queue နှင့်အတူနောက်ခံအလုပ်ဖြစ်သည်။ ဘလော့က အကောင်အထည်ဖော်မှု သက်သေကိုထုတ်ပြီးနောက် သဘောတူညီချက် အဆုံးသတ်ခြင်းလမ်းကြောင်းသည် ဘလော့က crypto hash, အမြင့်, view နှင့် witness ကိုပါ ၀ င်သော prover အလုပ်ကိုတင်ပြသည်။

Lane မလည်ပတ်နေပါက သို့မဟုတ် တန်းစီစာရင်း ပြည့်နေပါက အလုပ်ကို ကျော်သွားပြီး ပုံမှန် ဘလော့ခ်လုပ်ဆောင်မှုကို ဆက်လုပ်သည်။ ထို့ကြောင့် နောက်ခံ proof ထုတ်ပေးသည့် lane သည် transaction ဝင်ခွင့် သို့မဟုတ် consensus ကို ဆုံးဖြတ်သော အတားအဆီး မဟုတ်ပါ။ ၎င်းသည် လုပ်ဆောင်ပြီးသား အခြေအနေအပေါ် proof ထုတ်ပေးသော လမ်းကြောင်းဖြစ်သည်။

အကောင်အထည်ဖော်ရေးလမ်းကြောင်းမှာ အောက်ပါအချက်အလက်များပါဝင်တဲ့ prover တစ်ခုကို တည်ဆောက်ထားတယ်။

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

ဆက်တင်နှစ်ခုစလုံး၏ မူလတန်ဖိုးမှာ `cpu` ဖြစ်သည်။ `gpu` ကို ရွေးခြင်းသည် ရှင်းလင်းစွာ တောင်းဆိုခြင်းဖြစ်ပြီး မအောင်မြင်လျှင် ပိတ်ထားမည်။ GPU ပံ့ပိုးမှုကို compile မလုပ်ထားလျှင် သို့မဟုတ် တောင်းဆိုထားသော GPU backend က ကြိုတင်စစ်ဆေးမှု မအောင်မြင်လျှင် prover lane ကို ပိတ်ထားဆဲဖြစ်သည်။ ပထမထုတ်ဝေမှုတွင် `auto` တန်ဖိုး မရှိဘဲ တောင်းဆိုထားသော GPU မုဒ်မှ CPU သို့ ပြောင်း၍ ဆက်လုပ်ခြင်းလည်း မရှိပါ။

## စစ်ဆေးခြင်း {#verification}

FastPQ proof စစ်ဆေးမှုသည် စံ batch ကတိပြုတန်ဖိုးကို ပြန်တည်ဆောက်ပြီး အများမြင် transcript ကို ပြန်လည်လုပ်ဆောင်သည်။ စစ်ဆေးသူသည် ပရိုတိုကောဗားရှင်း၊ ပါရာမီတာအစုဗားရှင်း၊ ပြန်လည်လုပ်ဆောင်မှု ကန့်သတ်ချက်များ၊ trace ကတိပြုတန်ဖိုး၊ အများမြင် အဝင်ဒေတာများ၊ နမူနာယူထားသော Merkle ဖွင့်ပြအထောက်အထားများ၊ AIR ဖွင့်ပြအထောက်အထားများနှင့် FRI query ကွင်းဆက်ကို စစ်ဆေးသည်။

မူလ replay ကန့်သတ်ချက်များတွင် အောက်ပါတို့ ပါဝင်သည်။

|ကန့်သတ်ချက်|အလိုအလျောက်|
| ------------------ | ------: |
|အပြောင်းအလဲတန်းများ |     256 |
|အစုလိုက်အပြုံလိုက် ဝန်ဆောင်မှု အရွယ်အစား |၂၅၆ KiB|
|FRI အလွှာများ |      16 |
|မေးမြန်းမှု ဖွင့်ပွဲများ |     128 |

## SORA Nexus AXT သက်သေ Envelope များ {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT သက်သေ envelope များတွင် `AxtFastpqBinding` ကို ထည့်သွင်းနိုင်သည်။ AXT envelope များ၏ ဘလော့ခ်စစ်ဆေးမှု၊ IVM host ၏ AXT envelope စစ်ဆေးမှုများနှင့် `RegisterVerifiedFeeSponsorVaultAllocation` တို့သည် envelope ၏ `fastpq_binding` ကို လိုအပ်ပြီး ၎င်းကို မျှော်မှန်းထားသော ကြေညာချက် (claim) နှင့် တိုက်စစ်ကာ envelope နှင့် ၎င်းတွင် ထည့်သွင်းထားသော သက်သေအပေါ် FastPQ စစ်ဆေးသူကို ခေါ်ဆိုသည်။ ချိတ်ဆက်မှု မရှိခြင်း သို့မဟုတ် စစ်ဆေးမှု မအောင်မြင်ခြင်းသည် လုပ်ဆောင်ချက်ကို ငြင်းပယ်စေသည်။

### AXT ချုပ်ကိုင်တဲ့ သင်္ချာ {#axt-binding-math}

SORA Nexus AXT envelope များအတွက် သက်သေကို ပြန်လည်စစ်ဆေးမီ `AxtFastpqBinding` ကို စံပုံစံသို့ ပြောင်းသည်။ ဗလာဖြစ်နေသော `parameter`၊ `verifier_id` သို့မဟုတ် `verifier_version` တန်ဖိုးများကို ငြင်းပယ်သည်။ စစ်ဆေးသူ ID သည် `fastpq` ဖြစ်ရမည်ဖြစ်ပြီး ဗားရှင်းသည် `v1` ဖြစ်ရမည်၊ ထိန်းသိမ်းထားသော AXT လုပ်ငန်းစဉ်များသည် `fastpq-state-transition-stark-v1` ကို အသုံးပြုသည်။ Claim အမျိုးအစား၏ ရှေ့နောက်နေရာလွတ်များကို ဖြုတ်ပြီး စာလုံးအသေးသို့ ပြောင်းသည်။

AXT FastPQ အများပြည်သူ input တွေဟာ deterministic byte cryptographic hash တွေပါ။

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT ကူးပြောင်းသော့များမှာ-

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` လျှောက်လွှာမှာ အခန်းကဏ္ဍ ထောက်ပံ့မှု စာတန်းကို ထည့်သွင်းထားပါတယ်

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

နှင့် ခွင့်ပြုရေးမူဝါဒကို ချည်နှောင်ထားသော metadata အတန်းတစ်ခု ပါဝင်သည်။ `compliance` claim သည် မူဝါဒအတွက် တစ်တန်းနှင့် ပစ်မှတ် data space များအတွက် တစ်တန်း၊ စုစုပေါင်း metadata အတန်းနှစ်ခုကို ထည့်သည်။

`tx_predicate` နှင့် `value_conservation` တို့အတွက်၊ ချည်နှောင်မှုတွင် အပြုသဘောအရင်းအမြစ် (သို့) ရည်မှန်းချက် အရေအတွက်ရှိပါက ရှင်းလင်းသော သက်ရောက်မှုအရေအတွက်ကို အသုံးပြုသည်။ မဟုတ်ရင် ကုဒ်သည် ကန့်သတ်သတ်ထားသော သတ်မှတ်ချက်အရေအတွက်တစ်ခုကို ရယူနိုင်သည်။

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

အဲဒီနောက်မှာ အလားတူ transfer equations တွေကို သုံးပါတယ်။

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

စမ်းသပ်ဖန်တီးထားသော ပေးပို့သူနှင့် လက်ခံသူ အကောင့်သတ်မှတ်နံပါတ်များကို ကီးဖန်တီးမှု seed များမှ ထုတ်ပေးသည်။

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Transfer batch cryptographic hash ကတော့:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT အစု manifest ၏ digest သည် စံ binding ကို Norito ဖြင့် encode လုပ်ထားသည့် ဒေတာပေါ်တွင် တွက်ချက်သော SHA-256 ဖြစ်သည်။

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Parameters Sets များ {#parameter-sets}

ပထမထုတ်ဝေမှုတွင် စံ ပါရာမီတာအစု တစ်ခုတည်းသာ ရှိပြီး ၎င်းမှာ `fastpq-state-transition-stark-v1` ဖြစ်သည်။ ၎င်းသည် ဒီဂရီ-၄ တိုးချဲ့မှု (`X^4 - 7`) ပါသော Goldilocks ကွင်းပေါ်တွင် 128-bit လုံခြုံရေးကို ပစ်မှတ်ထားပြီး trace အရွယ်အစား `2^16`၊ LDE အရွယ်အစား `2^19`၊ FRI arity 2၊ blowup 8၊ အများဆုံး လျှော့ချမှု 17 ကြိမ်နှင့် query 136 ခုကို အသုံးပြုသည်။

## ဖွဲ့စည်းပုံ {#configuration}

FastPQ ပြင်ဆင်သတ်မှတ်မှုသည် `zk.fastpq` အောက်တွင် ရှိသည်။

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
```

`iroha3d` မှတူညီသော အကောင်အထည်ဖော်မှုနှင့် တယ်လီမီတာ တံဆိပ်များကို လွှဲပြောင်းနိုင်သည်

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

ပြင်ဆင်မှု ကွင်းများအတွက် ပတ်ဝန်းကျင် ကိန်းရှင်များကိုလည်း ထောက်ပံ့ထားသည်။ FastPQ အတွက် သီးသန့် ကိန်းရှင်များသည် အောက်ပါအတိုင်းဖြစ်သည်။

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## မက်ထရစ်များ {#metrics}

FastPQ က Backend ရွေးချယ်ခြင်းနှင့် Metal Software အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် အပြုအမူအတွက် မက်ထရစ်များကို တင်ပို့သည်။

|မက်ထရစ် |အဓိပ္ပါယ်|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total` | backend နှင့် စက်အညွှန်းအလိုက် တောင်းဆိုထားသည့် လုပ်ဆောင်မှု mode နှင့် အမှန်တကယ်ရွေးချယ်ထားသည့် mode |
| `fastpq_poseidon_pipeline_total` | တောင်းဆိုထားသည့် Poseidon လုပ်ငန်းစဉ် လမ်းကြောင်းနှင့် အမှန်တကယ်ရွေးချယ်ထားသည့် လမ်းကြောင်း |
|`fastpq_metal_queue_depth` |သတ္တုတန်းကန့်သတ်ချက်၊ အမြင့်ဆုံး လေယာဉ်ခရီးစဉ်အရေအတွက်၊ ပို့ဆောင်မှုအရေအတွက်နဲ့ နမူနာယူခြင်း ပြတင်းပေါက် |
|`fastpq_metal_queue_ratio` |သံမဏိလိုင်း အလုပ်ရှုပ်ပြီး အပြန်အလှန် ကွဲပြားမှုနှုန်းများ |
|`fastpq_zero_fill_duration_ms` |Metal Run များအတွက် Host သုညဖြည့်ခြင်းသက်တမ်း |
|`fastpq_zero_fill_bandwidth_gbps` |Derived zero-fill bandwidth ကို |

ယေဘုယျ စွမ်းဆောင်ရည်ခွဲခြားမှုအတွက် [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md) တွင်စာရင်းသွင်းထားသော သဘောတူညီချက်နှင့် တန်းစီအချက်ပြများနှင့်အတူ သုံးပါ။

## ဆက်စပ်သော ရည်ညွှန်းချက် {#related-reference}

- [ဒေတာပုံစံ အစီအစဉ်](/my/reference/data-model-schema.md) node-authoritative type point-in-time data view အတွက်
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ ရွေးချယ်စရာများ](/my/reference/iroha3d-cli.md#fastpq-overrides)
