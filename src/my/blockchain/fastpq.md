---
translation_locale: my
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ ရှိသည် Iroha ဒါက STARK ရွေးချယ်ထားတဲ့ အကောင်အထည်ဖော်မှု သက်ရောက်မှုတွေအတွက် သက်သေခံလမ်းကြောင်းပါ။
ပုံမှန် ငွေပေးချေမှု အကောင်အထည်ဖော်မှု (သို့) သဘောတူညီချက်ကို အစားထိုးမထားပါ။
ဖြတ်သွားပါ ISI, IVM, နှင့် Sumeragi အမြဲလိုသလိုပဲ FastPQ စားသုံးသူ
deterministic execution witness နဲ့ supported effects တွေကို သက်သေအဖြစ် ပြောင်းပေးတယ်
အစုလိုက်ပါ

လက်ရှိ အိမ်ရှင်ပေါင်းစပ်မှုမှာ အဓိကလမ်းကြောင်း သုံးခုရှိပါတယ်။

- ဘလော့ကတ်ကို အကောင်အထည်ဖော်ရာတွင် မှတ်တမ်းတင်ထားသည့် ပွင့်လင်းမြင်သာသော ကိန်းဂဏန်းအရ အရင်းအမြစ်လွှဲပြောင်းမှုများ
- Nexus verified lane relays တွေကို AXT အထောက်အထားအဖုံးမှာ FastPQ
  ချုပ်ဆိုချက်
- SCCP ပွင့်လင်းမြင်သာတဲ့ သတင်းအချက်အလက် သက်သေခံ အကူအညီများ FastPQ အထောက်အထား
  ပွင့်လင်းတဲ့ စစ်ဆေးမှု အဝှေ့

## သမ္မာကျမ်းစာလမ်းကို လွှဲပြောင်းခြင်း {#transfer-witness-path}

ပွင့်လင်းမြင်သာတဲ့ ကိန်းဂဏန်းလွှဲပြောင်းမှုတွေက တည်ဆောက်ထားတဲ့ လွှဲပြောင်းရေး စာသားကို ဖန်တီးပေးတယ်
ညွှန်ကြားချက်က ဟန်ချက်ညီမှုကို ပြောင်းလဲစေတယ်။

- အရင်းအမြစ်စာရင်း၊ ရည်ရွယ်ချက်စာရင်း၊ ပိုင်ဆိုင်မှု သတ်မှတ်ချက်နှင့် ပမာဏ
- လွှဲပြောင်းခြင်းမတိုင်မီနှင့် နောက်ပိုင်းတွင် ပေးပို့သူနှင့် လက်ခံသူ၏ ငွေကြေးညီညွတ်မှု
- အစုလိုက်အပြုံလိုက် hash အဖြစ် အသုံးပြုသော ငွေချေးမှုဝင်ရောက်မှတ် hash
- တင်ပြစာရင်းမှ ရယူထားသော အာဏာပိုင် မှတ်တမ်း
- Single-delta transcripts အတွက် Poseidon digest တစ်ခု

Batch transfer တွေမှာ Delta များနဲ့အတူ transcript တစ်ခုကို သုံးပါတယ်။
Poseidon ရဲ့ တစ်ဒယ်လ်တာ အစာချေမှုန်းမှုဟာ မရှိပါဘူး။

ဘလော့ကို အဆုံးသတ်တဲ့အခါ Iroha ဒီစာသားတွေကို entry point hash နဲ့ အုပ်စုလိုက်ပါ။
အဲဒီနောက်မှာ သေနတ်သတ်ဖြတ်ခံရသူဟာ မူရင်း စာရွက်စာတမ်းတွေကို သယ်ဆောင်လာပါတယ်။
ကော်မတီ FastPQ အပြောင်းအလဲစစ်ဆေးရေးအတွက် ပြင်ဆင်ထားသော ဆဲလ်များ။

Transfer delta တစ်ခုစီဟာ ကူးပြောင်းမှု အတန်းနှစ်ခု ဖြစ်လာတယ်။

| အတန်း             | အဓိကပုံစံ                                        | ကြိုတင်တန်ဖိုး               | တန်ဖိုးအပြီး             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| ပေးပို့သူ ငွေချေးငွေ    | `asset/<asset-definition>/<source-account>`      | ပေးပို့သူ ဘောလုံးစာရင်း   | ပေးပို့သူ balance နောက်   |
| လက်ခံရရှိသူ၏ ခရက်ဒစ် | `asset/<asset-definition>/<destination-account>` | လက်ခံရရှိသူရဲ့ ဘောလုံးစာရင်း | လက်ခံရရှိသူရဲ့ ငွေကြေးပမာဏ |

ကိန်းဂဏန်းတန်ဖိုးတွေကို အလုံးစုံ သက်သေအမှတ်ယူနစ်တွေအဖြစ် ပုံမှန်ပြုလုပ်တယ်။ တန်ဖိုးတစ်ခုက
ငြင်းပယ်ခံရသည် FastPQ အပျက်သဘောမဟုတ်ဘဲ ကိုယ်စားပြုလို့မရဘူးဆိုရင်
`u64` ရွေးချယ်ထားတဲ့ ဆယ်ဂဏန်း စကေးမှာပါ။

## အများပြည်သူဝင်ငွေ {#public-inputs}

လူတိုင်း FastPQ transition batch က proof ကို bind လုပ်တဲ့ public inputs တွေကို သယ်ဆောင်ပါတယ်။
Block နဲ့ Execution context ကို:

| ထည့်သွင်းမှု         | အဓိပ္ပါယ်                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | ဒေတာနေရာအမှတ်တံဆိပ်ကို အနည်းဆုံး byte များအဖြစ် ကုဒ်သွင်းထားသည်             |
| `slot`        | ဘလော့ဖန်တီးမှု အချိန်ကို နာနိုစက္ကန့်များသို့ ပြောင်းလဲ                    |
| `old_root`    | မိဘပြည်နယ် အမြစ်က သေနတ်သတ်ဖြတ်ခံရသူရဲ့ သက်သေကနေရတာပါ။            |
| `new_root`    | ပြည်ထောင်စုနောက်ပိုင်း အမြစ်က သေနတ်သတ်ဖြတ်ခံရသူရဲ့ သက်သေကနေရတာပါ။              |
| `perm_root`   | ပိုးစီဒွန်က တက်ကြွမှု အခန်းကဏ္ဍ ခွင့်ပြုချက်အပေါ် ကတိပေးထားသည်                |
| `tx_set_hash` | hash ကို sorted transaction နဲ့ time-trigger entry point hash တွေကို |

အိမ်ရှင်က အသုံးပြုသည် `fastpq-lane-balanced` ကန်နီကလစ် ပမာဏအဖြစ် သတ်မှတ်
ဒီအစုတွေကိုပါ။

## သင်္ချာပုံစံ {#mathematical-model}

ဤအပိုဒ်သည် လက်ရှိကွန်ပျူတာ၏ အကောင်အထည်ဖော်ထားသော သင်္ချာကိုဖော်ပြသည်။ Rust
အောက်က ကွင်းဆင်းမှုအားလုံးဟာ Goldilocks အထက်မှာပါ။
prime ကွင်း:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 ကို သုံးတယ်။ `F` ကွင်းဆင်းတာဝန်တွေအတွက်ပါ။ စုပ်ကန့်ဟာ ကျယ်ပြန့်တယ်။
`t = 3`, ငွေကြေးနှုန်း `r = 2`, အရည်အသွေး `1`. hash က field element တွေကို
rate-2 blocks နဲ့ field element တစ်ခုကို ထည့်ပေးတယ် `1` နောက်ဆုံးပွဲမတိုင်ခင်
အပြောင်းအလဲ:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Byte string တွေကို 7-byte အစိတ်အပိုင်းလေးတွေထဲ ထည့်ထားလို့ အစိတ်အပိုင်းတိုင်းဟာ
ပြတ်သားစွာ အောက်မှာ `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Domain-separated field hashs တွေကို အောက်ပါအတိုင်း ဖော်ပြထားပါတယ်

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Byte-domain digests တွေကနေ စတင်တဲ့ hash တွေအတွက် FastPQ ပထမ ရှစ်ခုကို မြေပုံ
ကွင်းထဲတွင် အိုင်ဒီယန်အသေးစား ဘိုက်များ:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

ဒီမှာ `Hash` ဆိုလိုသည်မှာ Iroha ဒါက `iroha_crypto::Hash::new`, 32 ဘိုက် Blake2bVar
Poseidon2 သို့မဟုတ် SHA-256.

### နယ်မြေ သင်္ချာ {#field-arithmetic}

နိုင်ငံခြားရေး Rust code က field element တွေကို canonical အဖြစ် ကိုယ်စားပြုတယ် `u64` တန်ဖိုးများ
`[0,p)`. ပေါင်းထည့်ခြင်းနှင့် လျှော့ချခြင်းမှာ-

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Multiplication က ပထမ 128-bit ရလဒ်ကို တွက်ချက်တယ်။

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks လျှော့ချမှုဆိုတာက ဒီနောက် ကိုယ်ပိုင်လက္ခဏာကို သုံးတယ်။

$$
2^{64}\equiv2^{32}-1\pmod p
$$

အောက်ပါအတိုင်းဖြစ်ပါသည်-

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ဒီနောက် Reducer က တွက်ချက်တယ်။

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

အကောင်အထည်ဖော်ခြင်းသည် စည်းကမ်းချက်အရ ပေါင်းထည့်ခြင်း သို့မဟုတ် လျှော့ချခြင်း `p` ရလဒ်က
လက်မှတ်ရေးထိုးထားတဲ့ အပြည့်ကိန်းတွေဖြစ်တဲ့ balance delta တွေကို အောက်ပါအတိုင်း ထည့်သွင်းထားပါတယ်။

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 အပြောင်းအလဲ {#poseidon2-permutation}

Poseidon2 အပြောင်းအလဲအခြေအနေက

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

၎င်းရဲ့ S-box က

$$
S(x)=x^5
$$

FastPQ ၄ လုံးလုံး၊ ၅၇ လုံး၊ ၄ လုံး ထပ်သုံးတယ်။
Full rounds တစ်လုံးလုံး၊ Round constants တွေနဲ့
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` ဖြစ်ပါသည်။

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

အပိုင်းတစ်ဝိုက်က-

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

ပေါင်းထည့်ခြင်းနှင့် မြှောက်ခြင်းအားလုံးမှာ `F`. တရားဝင် MDS matrix က

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Field hash က သုညအခြေအနေကနေ စတင်ပါတယ်။ အဆင့်-2 ဘလော့တစ်ခုစီအတွက်
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

နောက်ဆုံး ဘလော့က `1` နောက်ဆုံးတစ်ခုမတိုင်ခင် အထည်အလိပ်
Permutation. output က `x_0`.

### အများပြည်သူဝင်ငွေ ချုပ်ဆိုချက် {#public-input-binding}

host က data space id ကို its `u64` တန်ဖိုးကို ပထမ
၁၆ ဘိုင်တာ ကွင်းရဲ့ အနည်းငယ်အင်းဒီယန်းဘိုက် ၈ လုံး:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

ဘလော့က ဖန်တီးတဲ့ အချိန်ကို မီလီစက္ကန့်ကနေ နာနို စက္ကန့်တွေအဖြစ် ပြောင်းပါတယ်။

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Transaction-set hash သည် sorted entry point ပေါ်တွင် byte-domain hash ဖြစ်သည်။
hashes:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

ဘယ်မှာ `h_i` ရယူမှုနှင့် အချိန် trigger entry point hash တွေကို sort လုပ်ထားပါတယ်
အထောက်အထား အများပြည်သူ IO, သင်က `perm_root` ဒါမှမဟုတ် `tx_set_hash` အားလုံး သုညဖြစ်တယ်
prover သည် fallback တန်ဖိုးများကိုဖြည့်သည်:

$$
\operatorname{perm\_root} =
\begin{cases}
0^{32},& \text{if there are no permission hashes}\\
\operatorname{Hash}(\texttt{fastpq:v1:perm\_root}\|p_0\|\cdots\|p_{n-1}),
& \text{otherwise}
\end{cases}
$$

$$
\operatorname{tx\_set\_hash}_{fallback} =
\operatorname{Hash}(\texttt{fastpq:v1:tx\_set}\|\operatorname{ordering\_hash})
$$

### ကိန်းဂဏန်းဆိုင်ရာ ပုံမှန်ဖြစ်စဉ် {#numeric-normalization}

Transfer delta တစ်ခုစီအတွက် ရည်မှန်းချက် ဆယ်ဂဏန်းစကေးဟာ အမြင့်ဆုံး ဖြတ်တောက်ထားတာပါ။
ပမာဏအနှံ့က စကေးနဲ့ ဘန်ကောက်ချက် နှစ်ခုစလုံးရဲ့ snapshots:

$$
s =
\max(
\operatorname{scale}(a),
\operatorname{scale}(f_0),
\operatorname{scale}(f_1),
\operatorname{scale}(t_0),
\operatorname{scale}(t_1)
)
$$

A ကို `Numeric` value with mantissa `m` ကျယ်ပြန့်မှု `q` လက်ခံရရှိသည်မှာသာ
`m >= 0` နှင့် `q <= s`. ၎င်းရဲ့ FastPQ သက်သေတန်ဖိုးက-

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

ပုံမှန်ပြုလုပ်ထားသော ရလဒ်သည် `u64`.

### ကနွန်နီကလစ် အမိန့် {#canonical-ordering}

ခြေရာခံမှု မလုပ်ခင် အစုကို ကူးပြောင်းရေး သော့၊ လုပ်ဆောင်ချက်နဲ့ ခွဲခြားထားတယ်။
အဆင့်နဲ့ မူရင်းထည့်သွင်းမှု အညွှန်းကိန်း

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

အမိန့်ချိမှု ကဏ္ဍမှာ Poseidon2 နယ်ပယ် hash တစ်ခုရှိပါတယ်
`fastpq:v1:ordering` ပြီးတော့ Norito အမျိုးအစားခွဲထားတဲ့ ကူးပြောင်းမှုများကို ကုဒ်သွင်းခြင်း

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

ဘယ်မှာ `P` 7 byte packaging ဖြစ်တယ် `E` ရှိသည် Norito ကုဒ်သွင်းခြင်း `D_o` ရှိသည်
`fastpq:v1:ordering`, နှင့် `T*` ဒါက အမျိုးအစားခွဲထားတဲ့ ကူးပြောင်းစာရင်းပါ။

### Transfer Equations များ {#transfer-equations}

ငွေလွှဲပြောင်းမှုအတွက် `a`, ပေးပို့သူ balance `f`, လက်ခံသူရဲ့ ငွေကြေးပမာဏ `t`,
FastPQ ခြေရာခံမှု မတည်ဆောက်ခင် ပုံမှန်သက်သေတန်ဖိုးတွေကို အတည်ပြုပါတယ်။

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

အဲဒီနောက်မှာ ကူးပြောင်းရေးလိုင်းတွေက ကုဒ်သွင်းပေးကြပါတယ်

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

ခြေရာခံမှုအတွင်းမှာ လက်မှတ်ထိုးထားတဲ့ ဒယ်လ်တာတွေဟာ `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

ရွေးချယ်စရာ single-delta transfer digest က ကုဒ်သွင်းထားတဲ့ လွှဲပြောင်းမှုကို ပြုလုပ်တယ်။
preimage:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Multi-delta transfer transcripts အတွက် လက်ရှိပုံစံက ဒီလိုလိုအပ်ပါတယ်။
အဆင့်မြင့် အစာခြေခြင်း မရှိပါ။

လွှဲပြောင်းရေး စာရွက်စာတမ်းများအတွက် လက်ခံအာဏာပိုင်ရဲ့ သောက်သုံးမှုမှာ-

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### ခြေရာခံမှု အတန်းများ {#trace-rows}

အပြောင်းအလဲစာရင်းကို အမျိုးအစားထားပါ `n` အစစ်အမှန် အတန်းများ။ ခြေရာရှည်က
2 ရဲ့ နောက် စွမ်းအား:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

အတန်းများ `0..n-1` တက်ကြွနေသည်၊ အတန်းများ `n..N-1` အစစ်အမှန်တန်းတိုင်းမှာ
တစ်ခုတည်းသော Operation Selector Set:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Selector ကိုလံအားလုံးက Boolean ပါ။

$$
s(s-1)=0
$$

ခွင့်ပြုချက်ရှာဖွေရေးတန်းတွေဟာ အခန်းကဏ္ဍပေးခြင်းနဲ့ အခန်းကန့်ပယ်ခြင်းလိုမျိုးပါ။

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

ကိန်းဂဏန်းအစီအစဉ်များအတွက်:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

ဆောက်လုပ်သူဟာ အရင်းအမြစ်တစ်ခုချင်း ဒယ်လ်တာတွေကိုလည်း ခြေရာခံပါတယ်။

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

မင်တာနဲ့ မီးရှို့တဲ့ အတန်းတွေပဲ ထောက်ပံ့ရေး ကိန်းဂဏန်းကို update လုပ်ပေးကြတာပါ။

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

metadata နှင့် dataspace trace columns တို့သည် row မတိုင်မီမှ ရယူထားသော field hash များဖြစ်သည်။
ရုပ်ဝတ္ထုပြုခြင်း

$$
\operatorname{metadata\_hash} =
\begin{cases}
0,& \text{if metadata is empty}\\
H_D(E(\text{metadata})),& \text{otherwise}
\end{cases}
$$

$$
\operatorname{dsid\_trace}=H_D(\operatorname{public\_input\_dsid})
$$

metadata hash, data space hash နဲ့ slot တွေဟာ ဘေးချင်းကပ်နေတဲ့ နေရာတွေမှာ တည်ငြိမ်ပါတယ်။
ခြေရာခံလိုင်းများ:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Merkle Columns ကို လွှဲပြောင်းခြင်း {#transfer-merkle-columns}

Transfer Row တွေမှာ 32-level Merkle path က ရှားပါးပါတယ်။ host proof ဆိုရင်
ပျောက်သွားရင် prover က row key ကနေ deterministic path ကို synthesizes လုပ်ပေးတယ်။
pre-balance နဲ့ row က sender (သို့) receiver ဘက်လားဆိုတာပါ။

အတုလမ်းကြောင်းတွေအတွက် အရသာဆားက `fastpq:smt:from` ပေးပို့သူတန်းများအတွက်
နှင့် `fastpq:smt:to` လက်ခံစက်တန်းများအတွက်-

$$
K =
\operatorname{Hash}(\texttt{fastpq:smt:key|}\|\operatorname{salt}\|\operatorname{key})
$$

$$
V =
\operatorname{Hash}(\texttt{fastpq:smt:value|}\|\operatorname{salt}\|\operatorname{le64}(\operatorname{balance}))
$$

$$
b_\ell = \operatorname{bit}_\ell(K)
$$

$$
s_\ell =
\operatorname{Hash}(
\texttt{fastpq:smt:sibling|}\|
\operatorname{le64}(\ell)\|K\|\operatorname{le64}(\operatorname{balance})\|\operatorname{salt}
)
$$

Synthetic Leaf နဲ့ အတွင်းပိုင်း node တွေက

$$
L = \operatorname{Hash}(
\texttt{fastpq:smt:leaf|}\|
K\|V
)
$$

$$
N_{\ell+1} =
\operatorname{Hash}(
\texttt{fastpq:smt:node|}\|
\operatorname{left}_\ell\|
\operatorname{right}_\ell
)
$$

ခြေရာခံချက်က အပိုင်းကို မှတ်တမ်းတင်တယ်။ `b_l`, ညီမ `s_l`, input node များ `x_l`, နှင့်
output node ကို `x_{l+1}` အဆင့်တိုင်းမှာ ကုဒ်ရဲ့ ကဏ္ဍဆိုင်ရာ ညီလာခံနဲ့

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### ခွင့်ပြုချက် Hashs {#permission-hashes}

Role grant နှင့် revoke rows များမှာ permission witness ကို hash လုပ်ထားသည်

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

host ခွင့်ပြုချက်ဇယား root ကိုအဝင်များကို role bytes, ခွင့်ပြုချက်ကို
bytes နဲ့ epoch byte တွေကို ဖန်တီးပြီး Poseidon2 Merkle သစ်ပင်ကို တည်ဆောက်တယ်။

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Odd-width level တွေက နောက်ဆုံး element ကို နှစ်ဆလုပ်တယ်။

### ခြေရာခံမှု ကတိပေးခြင်း {#trace-commitment}

ခြေရာခံမှုတိုင်တိုင်းအတွက် `c`, FastPQ ပထမက column values တွေကို interpolates လုပ်ပေးတယ်
trace domain နဲ့ hashs ကို coefficient vector တွေကို

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

ခြေရာခံ အမြစ်က ကော်လံတာဝန်တွေအပေါ် Poseidon2 Merkle အမြစ်ပါ။

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

နောက်ဆုံး Trace ကတိက Domain, Parameters Set ပေါ်မှာ byte hash တစ်ခုပါ။
ခြေရာပုံ၊ အတိုင်အထုံးများနှင့် ခြေရာအမြစ်များ:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

ဘယ်မှာ `D_c` ရှိသည် `fastpq:v1:trace_commitment`.

### AIR ပေါင်းစပ်မှု {#air-composition}

နိုင်ငံခြားရေး V1 AIR ပေါင်းစပ်မှုတန်ဖိုးက အတန်း-နေရာကျန်ပစ္စည်းတွေရဲ့ မျဉ်းလိုက် ပေါင်းစပ်မှုပါ။
စာသားကို ရိုက်ကူးထားတာက စိန်ခေါ်မှု နှစ်ခုပါ။

$$
\alpha_0,\alpha_1 \in F
$$

နီးစပ်ရာ အတန်းစုံတိုင်းအတွက် `(i,i+1)`, စာမေးသူက တွက်ချက်တာက

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

ကျန်ပစ္စည်းများ `rho` ကြော်ငြာအစီအစဉ်မှာ:

$$
\rho=s(s-1)
\quad\text{for each selector column}
$$

$$
\rho =
s_{\text{active}} -
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}}+
s_{\text{role\_grant}}+s_{\text{role\_revoke}}+s_{\text{meta\_set}})
$$

$$
\rho =
s_{\text{perm}}-(s_{\text{role\_grant}}+s_{\text{role\_revoke}})
$$

$$
\rho =
s_{\text{active},i+1}(1-s_{\text{active},i})
$$

ကိန်းဂဏန်းအတန်းများအတွက်-

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Stable batch context columns အတွက်လည်း

$$
\rho =
\operatorname{metadata\_hash}_i-\operatorname{metadata\_hash}_{i+1}
$$

$$
\rho =
\operatorname{dsid}_i-\operatorname{dsid}_{i+1}
$$

$$
\rho =
\operatorname{slot}_i-\operatorname{slot}_{i+1}
$$

စစ်ဆေးသူက ပြန်တွက်ချက်တယ်။ `A_i` နမူနာထုတ်ယူထားသော အတန်းအပေါက်များအတွက် စစ်ဆေးခြင်း
အချိုးအစား တန်ဖိုးကို AIR ပေါင်းစပ်မှု Merkle
အမြစ်။

### ရှာဖွေရေး ထုတ်ကုန် {#lookup-product}

ခွင့်ပြုချက် ရှာဖွေရေး accumulator က Fiat-Shamir စိန်ခေါ်မှုကိုသုံးတယ်။ `gamma`.
အဆင့်နိမ့်တဲ့ တိုးချဲ့မှု အကဲဖြတ်ချက်များ `s_perm` နှင့် `perm_hash`, ကော်မတီ
လည်ပတ်နေတဲ့ ထုတ်ကုန်က-

$$
z_0=1
$$

$$
z_{i+1}=
\begin{cases}
z_i\cdot(w_i+\gamma),& s_{\text{perm},i}\ne0\\
z_i,& s_{\text{perm},i}=0
\end{cases}
$$

သက်သေခံ မှတ်တမ်းများ:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### အဆင့်နိမ့်သော တိုးချဲ့ခြင်း {#low-degree-extension}

ခွင့်ပြုပါ။ `omega_T` Trace-domain generator ဖြစ်ဖို့၊ `omega_E` ကော်မတီ
အကဲဖြတ်နယ်ပယ်ထုတ်လုပ်သူ၊ `g` configured coset offset အတွက်
တန်ဖိုးများနှင့်အတူ trace column `v_i`, interpolation က coefficients တွေကို ထုတ်ပေးတယ် `a_j`
ဒီလိုမျိုး၊

$$
f(\omega_T^i)=v_i
$$

အဆင့်နိမ့်တဲ့ တိုးချဲ့မှုက coset ပေါ်မှာ တူညီတဲ့ polynomial ကို အကဲဖြတ်တယ်။

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

အကောင်အထည်ဖော်မှုသည် Coefficients များကို Power of
အရင်က coset offset ကို FFT:

$$
a'_j = a_j g^j
$$

နောက်ပြီး အကဲဖြတ် `a'` အကဲဖြတ်မှု နယ်ပယ်မှာ

နိုင်ငံခြားရေး CPU FFT ကုိလီ - တိုက္ေကး Transform ကို iterative radix-2
bit-reversed input တွေ။ အဆင့်ရှည်မှာ `L`, တစ်ဝက်အလျား `H=L/2`, စင်မြင့်
အမြစ်:

$$
\omega_L=\omega^{N/L}
$$

ပုရွက်ဆိတ်တိုင်းက တွက်ချက်တယ်။

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

ဆန့်ကျင်ဘက် FFT တူညီတဲ့ Transform ကို `omega^{-1}` အတိုင်းအတာတွေကို
ဆန့်ကျင်ဘက် domain အရွယ်အစား:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Catalogue Roots တွေကို အသုံးပြုမပြီးရင် validate လုပ်ပေးရပါမယ်။

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Catalogue Root ကနေ ရယူထားတဲ့ ပိုသေးတဲ့ ဒိုမင်များအတွက် Generator ဟာ:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### အတန်းနှင့် အရွက်များ {#row-and-leaf-hashes}

နောက်ပိုင်း LDE, FastPQ အားလုံးပေါ်က row တစ်ခုစီကို hashes LDE ကိုလံများအတွက် `m` အတန်းများ:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

အကယ်၍ row hashes တွေက trace domain မှာရှိသေးတယ်ဆိုရင်
domain ကို Prover က Interpolates လုပ်ပြီး အဲဒီ single row-hash column ကို ဖြန့်ဖြူးပေးတယ်။
တူညီသော coset နှင့် LDE လုပ်ငန်းစဉ်။

### Merkle အပေါက်များ {#merkle-openings}

LDE တန်ဖိုးတွေကို အောက်ပါ အပိုင်းတွေအဖြစ် အုပ်စုလိုက်ပါတယ်။

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

အရွက်တစ်ခြမ်းစီက

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merkle ရဲ့မိဘတွေက

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Odd Level တွေက နောက်ဆုံး node ကို duplicate လုပ်တယ်။ query paths တွေဟာ ဘယ်ဘက် (သို့)
အဆင့်တိုင်းမှာ query leaf index parity ကို လိုက်နာပါတယ်။

အညွှန်းကိန်းမှာ စာရွက်အတွက် `i`, လမ်းကြောင်း `(s_0,\ldots,s_{d-1})` စစ်ဆေးချက်များ
အမြစ် `R` ပြန်လည်ဖြစ်ပေါ်ခြင်းအားဖြင့်

$$
y_0=L_i
$$

$$
y_{k+1}=
\begin{cases}
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),y_k,s_k),
& \lfloor i/2^k\rfloor \equiv 0 \pmod 2\\
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),s_k,y_k),
& \lfloor i/2^k\rfloor \equiv 1 \pmod 2
\end{cases}
$$

စစ်ဆေးမှုကို:

$$
y_d=R
$$

AIR ခြေရာခံတဲ့ အတန်းစာရွက်တွေက

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR ပေါင်းစပ်မှု အရွက်များမှာ-

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

နိုင်ငံခြားရေး LDE query opening ကလည်း evaluation index မှာဖွင့်ထားတဲ့ value ကို စစ်ဆေးတယ်
`i` ၎င်းရဲ့ စစ်ဆေးထားတဲ့ အစိတ်အပိုင်းမှာ ရှိနေတာပါ။

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI ခေါက်ခြင်း {#fri-folding}

FRI ကတိပေးထားသည် AIR ပေါင်းစပ်မှု အကဲဖြတ်ချက်များ `l`, ကော်မတီ
စာလုံးပေါင်းမူကြမ်းတွေ စိန်ခေါ်မှုတစ်ခု `beta_l`. အလွှာကို multiple ကို pad လုပ်ထားတယ်။
Arity အရွယ်အစား အုပ်စုတစ်ခုစီက

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

ဘယ်မှာ `a` အဲဒါက FRI verifier က နမူနာထုတ်တဲ့ မေးခွန်းတိုင်းအတွက် စစ်ဆေးတယ်။
ကွင်းဆက်၊

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

ပြီးတော့ ဖွင့်ထားတဲ့ တစ်ခုချင်းကို စစ်ဆေးတယ်။ FRI အစုလိုက်အပြုံလိုက် FRI အလွှာ
အမြစ်။

### Fiat-Shamir Transcript {#fiat-shamir-transcript}

Canonical Parameters Catalogue က transcript hash ကို SHA3-256.
လက်ရှိ Prover နှင့် Verifier အကောင်အထည်ဖော်မှုသည် Challenge bytes များကို
`iroha_crypto::Hash::new`, ဒါက 32-byte Blake2bVar digest တစ်ခုပါ
ပထမ ၈-byte အနည်းငယ်ကို `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

စိန်ခေါ်မှုဖုန်းတွေကို စာသားပြန်ရိုက်တဲ့ အခြေအနေမှာ အပြည့်အဝ ထည့်သွင်းပါ။
အစီအစဉ်က-

1. အများပြည်သူ IO, protocol version၊ parameter version နဲ့ parameter name
2. LDE အမြစ်နှင့် ခြေရာအမြစ်
3. `gamma`
4. AIR ရှုပ်ထွေးမှု စိန်ခေါ်မှုများ `alpha_0`, `alpha_1`
5. AIR ခြေရာခံ အမြစ်နဲ့ AIR ပေါင်းစပ်မှု အမြစ်
6. lookup ကြီးမားတဲ့ ထုတ်ကုန်
7. FRI အလွှာ အမြစ်များနှင့် `beta_l` စိန်ခေါ်မှုများ
8. နမူနာထုတ်ယူထားသော မေးမြန်းမှု အညွှန်းကိန်းများ

မေးမြန်းမှု နမူနာယူခြင်းသည် 32-byte စိန်ခေါ်မှု digests များကိုဆွဲပြီး
အင်းဒီးယန်းလေး `u64` requested unique number ကိုရတဲ့အထိ
အညွှန်းကိန်းများ:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

နမူနာယူထားတဲ့ အစုကို အမျိုးအစားအလိုက် ပြန်ပို့ပေးပါတယ်။

### Verifier ကို ပြန်လည်ဖြည့်သည် {#verifier-replay}

စစ်ဆေးသူက ပထမအကြိမ် အစုလိုက်အပြုံလိုက် ကတိပေးမှုကို ပြန်လည် တွက်ချက်တယ်။

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

ပြီးတော့ လိုအပ်တာက-

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

ဒါကလည်း အများပြည်သူကို ပြန်လည်တည်ဆောက်ပေးတယ်။ IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

ကွင်းတိုင်းဟာ သက်သေခံရဲ့ အများပြည်သူနဲ့ ကိုက်ညီဖို့လိုတယ်။ IO byte-for-byte ကို verifier ကို
အဲဒီနောက်မှာ တူညီတဲ့ စာသားကို ပြန်လည်ထုတ်ပြီး တူညီတာကို ရယူပါတယ်။

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

နမူနာကောက်ခံတဲ့ မေးခွန်းတိုင်းအတွက် `q`, ၎င်းက စစ်ဆေးတယ်။

$$
\operatorname{MerkleVerify}(
R_{\text{lde}},
L_{\lfloor q/B_{\text{lde}}\rfloor},
\lfloor q/B_{\text{lde}}\rfloor,
\pi_{\text{lde}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_q,
q,
\pi_{\text{air,current}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_{q+1\bmod N_{\text{eval}}},
q+1\bmod N_{\text{eval}},
\pi_{\text{air,next}}
)
$$

ပြီးတော့

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

နိုင်ငံခြားရေး AIR အစိတ်အပိုင်းဖွင့်ခြင်းသည် `R_air_composition`.
နိုင်ငံခြားရေး FRI ကွင်းဆက်က အဲဒီကနေ စပါတယ်။ `A_q` နောက်ပြီး အဆုံးသတ်မှာက
အတည်ပြုချက် နောက်ဆုံး FRI terminal အောက်က အရွက် FRI အမြစ်။

## သမ္မာကျမ်းရဲ့ စစ်ဆေးချက်များ {#what-the-prover-checks}

ခြေရာကို မတည်ဆောက်ခင် FastPQ prover က အဖြဲ႕အစည္းအေ၀းကို ေစာင့္ေရွာက္ေပးတယ္။
Transition key, operation rank နဲ့ insertion order တွေကို လိုက်ပြီး
Transcript metadata လိုတယ်။ Transfer row တွေနဲ့ batch တစ်ခုဆိုပေမဲ့ transfer မရှိဘူး။
စာရွက်စာတမ်းဟာ မတည်ငြိမ်ပါ။

ငွေလွှဲပြောင်းစာရွက်များအတွက် စာရင်းအင်းဘက် စစ်ဆေးမှုမှာ အောက်ပါအချက်တွေ ပါဝင်ပါတယ်။

- ပေးပို့သူရဲ့ ဘားလန်က အောက်စီးဆင်းမှု မဖြစ်သင့်ပါဘူး။
- `sender_after` ညီမျှရမယ်။ `sender_before - amount`
- `receiver_after` ညီမျှရမယ်။ `receiver_before + amount`
- စာသားလွှာမှာ အလှူအတန်းတစ်ခုချင်းစီကို ဖုံးအုပ်ရမယ်။
- Poseidon ကို တစ်ဒယ်လ်တာ သောက်သုံးခြင်းမှာ ရှိပါက စာသားကို လိုက်ဖက်အောင် လုပ်ပေးရပါမယ်။
  preimage
- ရှားပါးတဲ့ Merkle proofs တွေကို version 1 အဖြစ် decode လုပ်ရပါမယ်။ ပျောက်နေတဲ့ paths က
  အချိုးသတ်တဲ့ synthetic proof တွေနဲ့ ပြည့်နေတာပါ။

Trace မှာ Transfer, Mint, Burn, Role Grant တွေအတွက် Selector Column တွေ ပါတယ်
Role revocation, metadata set, and permission search rows. ကိန်းဂဏန်းဆိုင်ရာ လုပ်ဆောင်ချက်
အတန်းတွေမှာလည်း လက်မှတ်ထိုးထားတဲ့ ဒယ်လ်တာတွေ၊ အရင်းအမြစ်တစ်ခုချင်းဒယ်လ်တာတွေနဲ့ ဖြည့်စွက်တဲ့
စာရေးသူ။

## Prover Lane {#prover-lane}

`irohad` စတဲ့ FastPQ Prover backend က Start လုပ်နိုင်တယ်ဆိုရင်
Line ကို အစပြုပါ။ Lane က နောက်ခံလုပ်ဆောင်ချက်တစ်ခုဖြစ်ပြီး အတန်းကသတ်မှတ်ထားတယ်။
Block က execution witness ကို ထုတ်ပေးတယ်၊ commit path က prob job ကို တင်ပြတယ်။
ဘလော့က hash၊ အမြင့်၊ ရှုထောင့်နဲ့ သက်သေကိုပါ ၀ င်ပါတယ်။

လမ်းကြောင်းမစီးရင် (သို့) အတန်းက ပြည့်နေရင် အလုပ်ကို ခလုတ်ချပြီး
ပုံမှန် ဘလော့က processing ဆက်လုပ်နေတာပါ။ ဆိုလိုတာက နောက်ခံ Prover Lane က
ငွေလဲလှယ်မှုလက်ခံခြင်း (သို့) သဘောတူညီချက်ဂိတ်မဟုတ်ပါ။ ဒါက သက်သေပြထုတ်လုပ်မှုတစ်ခု
နိုင်ငံတကာကို ဖြတ်သန်းတဲ့ လမ်းကြောင်းဟာ ပြီးရင် အကောင်အထည်ဖော်ပြီးသားပါ။

လမ်းကြောင်းမှာ prover တစ်ခုကို ဆောက်လုပ်ထားပါတယ်

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` Prover က backend ကို ရွေးချယ်ခွင့်ပေးတယ်။ `cpu` pin တွေကို အကောင်အထည်ဖော်
အန်အယ်လ်ဒီ CPU. `gpu` အနှစ်သက်ဆုံး GPU စီမံခန့်ခွဲမှု CPU ကျဆင်းသွားတဲ့နေရာ
backend က requested kernel တွေကို သုံးလို့မရဘူး။

## စစ်ဆေးခြင်း {#verification}

FastPQ အထောက်အထား စစ်ဆေးခြင်းသည် ကနောနိက အစုလိုက်အပြုံလိုက် တာဝန်ယူမှုကို ပြန်လည်တည်ဆောက်ပေးပြီး
အများပြည်သူရဲ့ စာသားကို ပြန်ရိုက်တယ်။ စစ်ဆေးသူက ပရိုတိုကောလ်ဗားရှင်းကို စစ်တယ်၊
parameters-set version, play limit, trace commitment, public inputs
နမူနာထုတ်ထားတဲ့ Merkle အပေါက်တွေ AIR အပေါက်များ၊ FRI မေးမြန်းမှု အစဉ်။

Default playback ကန့်သတ်ချက်များမှာ:

| ကန့်သတ်ချက်              | အလိုအလျောက် |
| ------------------ | ------: |
| အပြောင်းအလဲတန်းများ    |     256 |
| အလှူအတန်းများ၏ အရွယ်အစား | 256 KiB |
| FRI အလွှာများ         |      16 |
| မေးမြန်းမှု ဖွင့်ပွဲများ     |     128 |

## Nexus စစ်ဆေးထားသော Relay များ {#nexus-verified-relays}

Nexus AXT အထောက်အထားအဖုံးများတွင် `AxtFastpqBinding`. ဘယ်အချိန်မှာ
`RegisterVerifiedLaneRelay` အပြီးသတ်တယ်။ Iroha:

1. လမ်းကြောင်းဆက်သွယ်ရေးအဖုံးကို စစ်ဆေးပြီး FastPQ အထောက်အထားပစ္စည်း
2. ဒေတာနေရာနှင့် manifest root ကို စစ်ဆေးသည်
3. decodes ကို AXT အထောက်အထားအဖုံး
4. လိုအပ်ချက် `fastpq_binding`
5. ပြန်လည်တည်ဆောက်ခြင်း FastPQ ထိုအချုပ်ခြင်းမှထွက်သော အစု
6. embedded ကို decodes လုပ်ပါ FastPQ အထောက်အထား
7. ဖုန်းခေါ်ဆို FastPQ ပြန်လည်တည်ဆောက်ထားတဲ့ အစုအဝေးနဲ့ သက်သေခံ

စစ်ဆေးမှု အောင်မြင်ရင် Iroha သိုလှောင်သည် `VerifiedLaneRelayRecord`
Relay Reference, Original Envelope, proof payload hash ကိုပါ ၀ င်သည်။
စစ်ဆေးမှု အမြင့်၊ အမြင်အရင်းအမြစ်နဲ့ FastPQ ချည်နှောင်မှု။

Lane relay envelopes တွေမှာလည်း compact ပါတယ် FastPQ အထောက်အထား ပစ္စည်း။
လမ်းကြောင်း ID, ဒေတာနေရာ ID, ဘလော့က အမြင့်၊ စစ်ဆေးမှု
height, block header hash, settlement hash, and manifest root.
ပေါင်းစပ်ခြင်းသည် နှစ်ခုစလုံးပါဝင်ပါကသာ လက်ခံနိုင်သည်။ QC အတည်ပြုချက် FastPQ အထောက်အထား
ပစ္စည်း။

### AXT သင်္ချာကို ချုပ်ဆို {#axt-binding-math}

အတွက် Nexus AXT စာအိတ်များ၊ `AxtFastpqBinding` သက်သေခံမပြုခင် ကနောနိကအဖြစ် သတ်မှတ်ထားတယ်။
replay. empty parameter values ကို default ကနေ `fastpq-lane-balanced`; အလွတ်
verifier id နှင့် version ကို default လုပ်ရန် `fastpq` နှင့် `v1`; တောင်းဆိုမှု အမျိုးအစားကို ဖြတ်တောက်ထားသည်
နောက်ပြီး အချိုးကျခံရတယ်။

နိုင်ငံခြားရေး AXT FastPQ အများသုံး input တွေက deterministic byte hash တွေပါ

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

AXT ကူးပြောင်းရေး သော့များမှာ-

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

နိုင်ငံခြားရေး `authorization` အဆိုပြုချက်တွင် အခန်းကဏ္ဍ ထောက်ပံ့မှု စာတန်းကို ထည့်သွင်းပါသည်-

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

ခွင့်ပြုချက် မူဝါဒကို ချုပ်နှောင်တဲ့ metadata စာတန်းတစ်ခုနဲ့။ `compliance` တောင်းဆိုချက်
metadata နှစ်တန်းကိုထည့်ပေးသည် - မူဝါဒအတွက်တစ်ခုနှင့် ရည်မှန်းချက် ဒေတာဇယားများအတွက်တစ်ခု။

အတွက် `tx_predicate` နှင့် `value_conservation`, သက်ရောက်မှု ပွင့်လင်းမြင်သာတဲ့ အရေအတွက်က
ချည်နှောင်မှုမှာ အပြုသဘောအရင်းအမြစ် (သို့) ရည်ရွယ်ချက် အရေအတွက်ရှိတဲ့အခါ အသုံးပြုတယ်။
ဒါမဟုတ်ရင် ကုဒ်က အကန့်အသတ်ရှိတဲ့ သတ်မှတ်မှုအရေအတွက်ကို ထုတ်ယူတယ်။

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

Synthetic sender နဲ့ receiver account ID တွေကို key seeds တွေကနေ ထုတ်ပေးပါတယ်။

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Transfer batch hash ကို:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

နိုင်ငံခြားရေး AXT batch manifest digest က SHA-256 အပေါ် Norito ကုဒ်သွင်းခြင်း
တရားဝင် စည်းမျဉ်းစည်းကမ်း:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP ပွင့်လင်းမြင်သာသော သတင်းအချက်အလက် အထောက်အထားများ {#sccp-transparent-message-proofs}

နိုင်ငံခြားရေး SCCP အကူအကူသေတ္တာလည်း သုံးတယ်။ FastPQ ပွင့်လင်းမြင်သာတဲ့ ကွင်းဆက်ဖြတ် message အတွက်
ဒီလမ်းကြောင်းဟာ `irohad` နောက်ခံ prover lane ကို။
a ကို တည်ဆောက် FastPQ တိုက်ရိုက်တစ်ဆုပ်မှ SCCP သတင်းအချက်အလက် အထောက်အထား package နဲ့
ပြသပြီးနောက် ရလာတဲ့ အထောက်အထားကို ပွင့်လင်းတဲ့ စစ်ဆေးမှုအတွက် ဖုံးအုပ်တယ်။

နိုင်ငံခြားရေး SCCP အစုလိုက် အသုံးပြုမှု `fastpq-lane-balanced` ပြီးတော့ metadata အပြောင်းအလဲ သုံးခုပါ

| သော့                             | လုပ်ဆောင်ချက် |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

၎င်း၏ အများပြည်သူဝင်ငွေများသည် SCCP ပွင့်လင်းတဲ့ အတွင်းပိုင်း အထောက်အထား:

| FastPQ input ကို  | SCCP အရင်းအမြစ်                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | ပထမ ၁၆ ဘိုင်တာ Blake2b သတ္မွတ္ခ်က္ hash ကို |
| `slot`        | အပြီးသတ်မှု အမြင့်                                            |
| `old_root`    | အသုံးဝင်မှု hash                                               |
| `new_root`    | ရည်စူးမှု အမြစ်                                            |
| `perm_root`   | နောက်ဆုံးသတ်မှတ်ချက် ဟက်ရှ်                                        |
| `tx_set_hash` | ကြေညာချက် hash                                             |

နိုင်ငံခြားရေး SCCP canonical encoders တွေက integer များကို write small-endian နဲ့ encode လုပ်ကြတယ်
variable-length byte arrays တွေကို အောက်ပါအတိုင်း

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

ပွင့်လင်းမြင်သာတဲ့ အများသုံး input byte string က

$$
P =
\operatorname{version}\|
\operatorname{message\_id}\|
\operatorname{payload\_hash}\|
\operatorname{le32}(\operatorname{target\_domain})\|
\operatorname{commitment\_root}\|
\operatorname{le64}(\operatorname{finality\_height})\|
\operatorname{finality\_block\_hash}
$$

Transparent statement bytes တွေဟာ version, chain တို့ရဲ့ concatenation ပါ။
မိသားစု၊ ဒေသတွင်းနှင့် ငွေကြေးရေးမိတ်ဖက်ဒိုမီနိုင်းများ၊ လုံခြုံမှုပုံစံ၊ ခုံရုံးအုပ်ချုပ်ရေး
Account codec, finality model, verifier target, verifier backend မိသားစု
length prefixed chain/backend/manifest fields, destination binding hash
Account codec key, payload type, public input bytes နဲ့ payload hash တွေကို
statement hash က

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

နိုင်ငံခြားရေး FastPQ ဤအထောက်အထားလမ်းကြောင်းအတွက် dataspace id သည်ပထမဆုံး ၁၆ ဘိုက်များဖြစ်သည်
နောက်တစ်ခုက Blake2b ကို စောစောထည့်ထားတဲ့ အစာချေမှုန်းချက်:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

နိုင်ငံခြားရေး SCCP FastPQ အစုလိုက်အပြုံလိုက်က တိတိကျကျပါ။

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

ပြီးရင် အတူတူစီစဉ် FastPQ အမိန့်ပေးတဲ့ စည်းကမ်းပါ။

နိုင်ငံခြားရေး OpenVerify စစ်ဆေးသူရဲ့ တာဝန်ရှိမှု SHA-256 အပေါ် SCCP စာတိုအနောက်ခံ
နာမည်နှင့် တရားဝင် FastPQ စစ်ဆေးသူရဲ့ သရုပ်ဖော်ချက်:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

အသားအရေ FastPQ အထောက်အထားက Norito- ကုဒ်သွင်းထားတဲ့ `StarkFriOpenProofV1`, အဲဒီနောက်
တစ်ထည်ထဲ ဝိုင်းထားပြီး `OpenVerifyEnvelope` backend နဲ့ `Stark`. SCCP စစ်ဆေးခြင်း
ပြန်လည်တည်ဆောက်ခြင်း FastPQ အိတ်နဲ့ ထုတ်လွှင့်ထားတဲ့ စာရင်းကနေ စစ်ဆေး
open verification envelope metadata ကိုဖွင့်ပြီး FastPQ စစ်ဆေးသူ
ပြန်လည်တည်ဆောက်ထားတဲ့ အစုနဲ့ သက်သေခံပါ။

## အပိုင်းသတ်မှတ်ချက် Sets {#parameter-sets}

Canonical Parameters Catalogue က parameters အစု ၂ ခုကို ဖေါ်ပြထားပါတယ်
prover lane ကို လက်ရှိ အသုံးပြုနေသည် `fastpq-lane-balanced`.

| ကန့်သတ်ချက်              | ရည်ရွယ်ချက်                    | ကွင်း                          | ဟက်ရှ်များ                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | ဟန်ချက်ညီသော Prover ထုတ်ကုန်များ | Goldilocks quadratic extension ကို | Poseidon2 ကတိကဝတ်များ၊ စာရင်း SHA3 တံဆိပ် | Arity 8, blowup 8, 46 မေးခွန်းများ   |
| `fastpq-lane-latency`  | အချိန်ဆွဲမှု ထိခိုက်လွယ်တဲ့ လမ်းကြောင်းများ    | Goldilocks quadratic extension ကို | Poseidon2 ကတိကဝတ်များ၊ စာရင်း SHA3 တံဆိပ် | Arity 16, blowup 16, 34 မေးခွန်းများ |

128-bit လုံခြုံရေးကို ရည်ရွယ်ပြီး Trace Domain အရွယ်အစား `2^16`. နိုင်ငံခြားရေး
Rust V1 transcript ကို replay ကုဒ်ကိုလက်ရှိ Fiat-Shamir စိန်ခေါ်မှု derives
bytes နှင့်အတူ `iroha_crypto::Hash::new` တိုက်ရိုက် တောင်းဆိုတာထက်
SHA3-256.

Catalogue constants တွေကို Rust အတည်ပြုချက်များမှာ-

| အမြဲတမ်း             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
| `trace_root`         |   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
| `fri_blowup`         |                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
| `fri_queries`        |                     46 |                    34 |

## ဖွဲ့စည်းပုံ {#configuration}

FastPQ configuration ကို nested အောက်မှာ `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "auto"
poseidon_mode = "auto"

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
metal_debug_fused = false
```

တူညီတဲ့ အကောင်အထည်ဖော်မှုနှင့် တယ်လီမီတာ တံဆိပ်တွေကို `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

ပြင်ဆင်မှု ကွင်းများအတွက် ပတ်ဝန်းကျင် ကိန်းရှင်များကိုလည်း ထောက်ပံ့ပေးသည်။
FastPQ- သီးသန့်ကိန်းရှင်များမှာ အောက်ပါတို့ပါဝင်သည်-

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
- `FASTPQ_DEBUG_FUSED`

## မက်ထရစ်များ {#metrics}

တယ်လီမီထရီကို ဖွင့်လိုက်တဲ့အခါ FastPQ နောက်ခံရွေးချယ်မှုအတွက် တင်ပို့မှု မက်ထရစ်များနှင့်
သတ္တု runtime အပြုအမူ:

| မက်ထရစ်                            | အဓိပ္ပါယ်                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | backend နှင့် device labels များဖြင့် requested နှင့် resolved execution mode ကို          |
| `fastpq_poseidon_pipeline_total`  | တောင်းဆိုပြီး ဖြေရှင်းထားသော Poseidon Pipeline Path                               |
| `fastpq_metal_queue_depth`        | သတ္တုတန်းသတ်မှတ်ချက်၊ အမြင့်ဆုံး လေယာဉ်ခရီးစဉ်အရေအတွက်၊ ပို့ဆောင်မှုအရေအတွက်နဲ့ နမူနာယူခြင်း ပြတင်းပေါက် |
| `fastpq_metal_queue_ratio`        | သံမဏိတန်း အလုပ်ရှုပ်မှုနှင့် အချိုးအစားများ                                         |
| `fastpq_zero_fill_duration_ms`    | သတ္တုစီးဆင်းမှုအတွက် အိမ်ရှင် သုညဖြည့်ချိန်ကာလ                                      |
| `fastpq_zero_fill_bandwidth_gbps` | ရယူသော သုညဖြည့်မှု bandwidth                                                 |

ယေဘုယျ စွမ်းဆောင်ရည်ခွဲခြားမှုအတွက် သဘောတူညီချက်နဲ့ တန်းစီကိုသုံးပါ။
စာရင်းထဲတွင် ဖော်ပြထားသော အချက်ပြချက်များ [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md).

## ဆက်စပ်သော ရည်ညွှန်းချက်များ {#related-reference}

- [ဒေတာပုံစံ အစီအစဉ်](/my/reference/data-model-schema.md) ထုတ်ပေးသော အမျိုးအစားအတွက်
  အသေးစိတ်
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ ရွေးချယ်စရာများ](/my/reference/irohad-cli.md#arg-fastpq-execution-mode)
