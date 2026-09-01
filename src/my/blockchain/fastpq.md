---
translation_locale: my
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ သည် Iroha ၏ ရွေးချယ်သော အကောင်အထည်ဖော်မှု သက်ရောက်မှုများအတွက် STARK သက်သေခံလမ်းကြောင်းဖြစ်သည်။ ၎င်းသည် ပုံမှန် ငွေကြေးဆောင်ရွက်မှု သို့မဟုတ် သဘောတူညီချက်ကို အစားထိုးခြင်းမဟုတ်ပါ။ ငွေကြေးဆက်သွယ်မှုများ ISI, IVM နဲ့ Sumeragi တို့ကို ပုံမှန်အတိုင်း ဖြတ်သန်းပါ။ FastPQ က deterministic execution witness ကို စားသုံးပြီး supported effects တွေကို proof batches အဖြစ် ပြောင်းပါတယ်။

လက်ရှိ host integration မှာ အဓိကလမ်းကြောင်း သုံးခုရှိပါတယ်။

- ဘလော့ချ် အကောင်အထည်ဖော်မှုအတွင်း မှတ်တမ်းတင်ထားသော ပမာဏအရ အရင်းအမြစ် လွှဲပြောင်းမှုများ
- Nexus verified execution lane relays whose AXT proof data container carries a FastPQ binding
- SCCP ပွင့်လင်းတဲ့ စစ်ဆေးမှု ဒေတာအိုးထဲမှာ FastPQ အထောက်အထားကို ထုပ်ပိုးထားတဲ့ သတင်းအချက်အလက် သက်သေခံ အကူများ။

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

ကိန်းဂဏန်းတန်ဖိုးများကို အလုံးစုံသက်သေ ယူနစ်များအဖြစ် ပုံမှန်သတ်မှတ်ထားပါသည်။ FastPQ အပျက်သဘောမဟုတ်ဘဲ ကိုယ်စားပြုလို့မရဘူးဆိုပါစို့ `u64` ရွေးချယ်ထားတဲ့ ဒသမကိန်းအတိုင်းအတာမှာပါ။

## ပြည်သူ့ဝင်ငွေများ {#public-inputs}

FastPQ ကူးပြောင်းမှုအစုတိုင်းမှာ အတည်ပြုချက်ကို ဘလော့ကတ်နဲ့ အကောင်အထည်ဖော်မှု အခြေအနေကို ချိတ်ဆက်တဲ့ အများပြည်သူ input တွေပါဝင်ပါတယ်။

|ထည့်သွင်းချက်|အဓိပ္ပါယ်|
| ------------- | --------------------------------------------------------------- |
|`dsid` |သေးငယ်သော အိုင်ဒီယန်းဘိုက်များအဖြစ် ကုဒ်သွင်းထားသော ဒေတာနေရာအမှတ်တံဆိပ်|
|`slot` |ဘလော့ဖန်တီးမှု အချိန်ကို နာနိုစက္ကန့်များသို့ ပြောင်းလဲ |
|`old_root` |အဖမ်းခံရသူရဲ့ မျက်မြင်ကနေ ရလာတဲ့ မိဘပြည်နယ် အမြစ်|
|`new_root` |ပြည်နယ်နောက်ပိုင်း အမြစ်က သေနတ်သတ်ဖြတ်ခံရသူရဲ့ သက်သေကနေရတာပါ။|
|`perm_root` |Poseidon cryptographic commitment value ကို Active Role ခွင့်ပြုချက်တွေထက် တန်ဖိုးထားတယ်။ |
|`tx_set_hash` |ဂဏန်းဝှက် hash ကို sorted transaction နှင့် time-trigger entrypoint ဂဏန်း၀ှက် hash များအပေါ် |

host က `fastpq-lane-balanced` ကို ဒီဆော့ချက်တွေအတွက် သတ်မှတ်ထားတဲ့ Single Protocol Standard Parameter အဖြစ်သုံးတယ်။

## သင်္ချာပုံစံ {#mathematical-model}

ဤအပိုင်းတွင် လက်ရှိ Rust စစ်ဆေးသူနှင့်စစ်ဆေးသူက အကောင်အထည်ဖော်ထားသော သင်္ချာကိုဖော်ပြသည်။ အောက်ပါ ကွင်းဆင်းမှုအားလုံးသည် Goldilocks prime ကွင်းပေါ်တွင်ဖြစ်သည်။

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ ကွင်း cryptographic commitment တန်ဖိုးများအတွက် Poseidon2 over `F` ကိုအသုံးပြုသည်။ စုပ်သည်အလျား `t = 3`၊နှုန်း `r = 2` နှင့်စွမ်းအား `1` ရှိသည်။ cryptographic hash သည် rate-2 ဘလော့များတွင်ကွင်း element များကိုစုပ်ယူပြီး နောက်ဆုံး permutation မတိုင်မီ field element တစ်ခုတည်း `1` ကိုထည့်သွင်းပေးသည်။

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Byte string တွေကို 7-byte little-endian limbs ထဲမှာ pack လုပ်ထားလို့ limb တစ်ခုချင်းစီဟာ `p` အောက်မှာ တောင့်တင်းပါတယ်။

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Domain-separated field cryptographic hashs တွေကို အောက်ပါအတိုင်း ဖော်ပြထားပါတယ်

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

FastPQ သည် byte-domain cryptographic digests မှစ၍ cryptographic hash များအတွက် ပထမရှစ် little-endian bytes ကို field ထဲသို့ မြေပုံထုတ်ပေးသည်။

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

ဒီနေရာမှာ `Hash` ဆိုသည်မှာ Iroha ရဲ့ `iroha_crypto::Hash::new` ကိုဆိုလိုရာ၊ ဘိုင် ၃၂ ဘိုက် Blake2bVar ပရိုဂရမ် Digest တန်ဖိုးကိုဆိုလိုပါက၊ Formula တစ်ခုတွင် Poseidon2 သို့မဟုတ် SHA-256 ကို ရှင်းလင်းစွာ အမည်မပေးခဲ့ဘူး ဆိုပါစို့။

### နယ်မြေ သင်္ချာ {#field-arithmetic}

Rust ကုဒ်သည် `[0,p)` တွင် တစ်ခုတည်းသော ပရိုတိုကောစံညွှန်း `u64` တန်ဖိုးများအဖြစ် ကွင်းအပိုင်းများကို ကိုယ်စားပြုသည်။

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

Goldilocks Reduction က ဒီနောက် Identity ကိုသုံးပါတယ်။

$$
2^{64}\equiv2^{32}-1\pmod p
$$

အောက်ပါအတိုင်းဖြစ်ပါသည်

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ပြီးရင် Reducer က တွက်ချက်တယ်။

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

အကောင်အထည်ဖော်မှုသည် စည်းကမ်းချက်အရ `p` ကို ပေါင်းထည့်ခြင်း (သို့မဟုတ်) လျှော့ချခြင်းဖြင့် ရလဒ်တစ်ခုတည်းသော ပရိုတိုကုတ်စံညွှန်းဖြစ်သည်အထိဖြစ်သည်။ လက်မှတ်ထိုး integers များ၊ balance deltas ကဲ့သို့သောအခြားအရာများတွင်:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 အပြောင်းအလဲ {#poseidon2-permutation}

Poseidon2 အပြောင်းအလဲ အခြေအနေက-

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

၎င်းရဲ့ S-box ကတော့

$$
S(x)=x^5
$$

FastPQ Full round လေးလုံး၊ part round ၅၇ လုံး ထပ်ပြီး Full round လေးလုံးကို သုံးတယ်။ Round constants တွေပါတဲ့ Full round `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` ဖြစ်သည်-

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

တစ်စိတ်တစ်ပိုင်း ကျော့ကွင်းမှာ

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

ပေါင်းထည့်ခြင်းနှင့် မြှောက်မှုအားလုံးသည် `F` တွင်ရှိသည်။ Single Protocol-standard MDS matrix သည်:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

ကွင်း cryptographic hash သည် သုညအခြေအနေမှစသည်။ ပြည့်စုံသော rate-2 ဘလော့တစ်ခုစီအတွက် `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

နောက်ဆုံး ဘလော့က `1` padding element ကို နောက်ဆုံး permutation တစ်ခုမတိုင်ခင် ချိတ်ဆက်ပေးတယ်။ ထုတ်ကုန်ကတော့ `x_0` ပါ။

### အများပြည်သူဝင်ငွေ ချုပ်ဆိုမှု {#public-input-binding}

host သည် `u64` တန်ဖိုးကို 16-byte ကွင်း၏ ပထမရှစ် little-endian byte များသို့ရေးခြင်းဖြင့် data space id ကို encodes လုပ်သည်။

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

Transaction-set cryptographic hash သည် sorted entrypoint cryptographic Hash များအပေါ် byte-domain cryptographic hashtag ဖြစ်ပါသည်။

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

where `h_i` are sorted transaction and time-trigger entrypoint cryptographic hashes. proof public IO တွင်, `perm_root` သို့မဟုတ် `tx_set_hash` သည် သုညဖြစ်ပါက, prover သည် fallback တန်ဖိုးများကိုဖြည့်သည်:

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

### ကိန်းဂဏန်း Normalization {#numeric-normalization}

လွှဲပြောင်းမှုဒယ်လ်တာတစ်ခုစီအတွက် ရည်မှန်းချက် ဒသမကိန်းက ပမာဏအနှံ့ အမြင့်ဆုံး ဖြတ်တောက်ထားတဲ့ စကေးဖြစ်ပြီး နှစ်ခုစလုံးမှာ အချိန်ကာလ အချက်အလက် ကြည့်ရှုမှုကို ဟန်ချက်ညီစေတယ်။

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

A ကို `Numeric` mantissa နဲ့ တန်ဖိုး `m` အတိုင်းအတာ `q` လက်ခံထားရတာက `m >= 0` နှင့် `q <= s`. ၎င်းရဲ့ FastPQ သက်သေတန်ဖိုးက-

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

ပုံမှန်ပြုလုပ်ထားသော ရလဒ်သည် `u64` သို့ထည့်သွင်းရမည်။

### တစ်ခုတည်းသော ပရိုတိုကုတ်စံညွှန်း အမိန့်ချမှတ်ခြင်း {#canonical-ordering}

Trace Construction မလုပ်ခင် အစုကို ကူးပြောင်းရေး သော့၊ လုပ်ဆောင်မှု အဆင့်နဲ့ မူလထည့်သွင်းချက်အညွှန်းအရ ခွဲခြားထားတယ်။

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

အမိန့်ချမှတ်ရေး cryptographic commitment တန်ဖိုးသည် Poseidon2 ကွင်း cryptographic hash ကို domain `fastpq:v1:ordering` နှင့် sorted transitions များ၏ Norito encoding ပေါ်တွင်ဖြစ်ပါသည်။

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

`P` သည် 7-byte packaging ဖြစ်ပါက, `E` သည် Norito ကို encoding ဖြစ်ပါသည်; `D_o` သည် `fastpq:v1:ordering` ဖြစ်ပါသည်နှင့် `T*` သည် sorted transition list ပါ။

### Transfer Equations များ {#transfer-equations}

Transfer amount `a`, sender balance `f` နှင့် receiver balance `t` တို့အတွက်, FastPQ သည် trace build မလုပ်မီ normalized witness values များကို validates:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

အဲဒီနောက်မှာ အပြောင်းအလဲလိုင်းတွေက ကုဒ်ပေးကြပါတယ်-

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

ခြေရာခံချက်အတွင်းမှာ လက်မှတ်ထိုးထားတဲ့ ဒယ်လ်တာတွေကို `F` အဖြစ် လျှော့ချပေးပါတယ်။

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

ရွေးချယ်စရာ single-delta transfer cryptographic digest value က ကုဒ်သွင်းထားတဲ့ transfer preimage ကို ပြီးဆုံးစေပါတယ်။

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Multi-delta transfer transcripts တွေအတွက် လက်ရှိပုံစံက အဆင့်မြင့် cryptographic digest value ကို မရှိဖို့ လိုအပ်ပါတယ်။

Transfer transcripts အတွက် host authorization ရဲ့ အဓိက cryptographic digest value ကတော့

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### ခြေရာခံမှု အတန်းများ {#trace-rows}

`n` အစစ်အမှန်တန်းတွေ ပါဝင်စေ။ ခြေရာအလျားက နောက်နှစ်ခုရဲ့ စွမ်းအားပါ။

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

အတန်းများ `0..n-1` တက်ကြွနေသည်၊ အတန်းများ `n..N-1` အစစ်တန်းတိုင်းမှာ လုပ်ဆောင်ချက် ရွေးချယ်မှုတစ်ခုစီရှိပါတယ်

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Selector Columns အားလုံးက Boolean ပါ။

$$
s(s-1)=0
$$

ခွင့်ပြုချက် ရှာဖွေရေး အတန်းတွေဟာ အခန်းကဏ္ဍပေးခြင်းနဲ့ အခန်းကွင်းဖျက်ခြင်း အတန်းတွေပါပဲ။

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

ကိန်းဂဏန်းအစီအစဉ်များအတွက်-

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

ဆောက်လုပ်သူက အရင်းအမြစ်တစ်ခုချင်း ဒယ်လ်တာတွေကိုလည်း ခြေရာခံထားတယ်။

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

ဖြည့်စွက်ရေးတွက်စက်ကို Update လုပ်ပေးပြီး ဖျက်ပစ်တဲ့ စာတန်းတွေပဲ ထုတ်ပေးပါ။

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

metadata နှင့် dataspace trace columns တို့သည် row materialization မတိုင်မီမှ ရယူထားသော field cryptographic hash များဖြစ်ပါသည်။

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

metadata cryptographic hash, dataspace cryptographic Hash နှင့် slot တို့သည်အနီးကပ်သော trace row များတွင်တည်ငြိမ်သည်။

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

Transfer rows များတွင် 32-level Merkle path ပါရှိသည်။ host proof တစ်ခုပျောက်နေပါက, prover သည် row key မှ deterministic path ကို synthesizes, pre-balance နှင့် row က sender သို့မဟုတ် receiver ဘက်ဖြစ်သည်မဟုတ်ပါ။

Synthetic paths အတွက် အရသာဆားက `fastpq:smt:from` for sender rows နဲ့ `fastpq:smt:to` for receiver rows တို့ပါ။

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

Synthetic Leaf နဲ့ အတွင်းပိုင်း node တွေက-

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

ခြေရာခံချက်က အပိုင်းကို မှတ်တမ်းတင်တယ်။ `b_l`, ညီအစ်မ `s_l`, input node များ `x_l`, output node ကို `x_{l+1}` အဆင့်တိုင်းမှာပါ။ ကုဒ်ရဲ့ ကဏ္ဍဆိုင်ရာ ညီလာခံနဲ့:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### ခွင့်ပြုချက် cryptographic hashes {#permission-hashes}

Role grant and revoke rows cryptographic hash ခွင့်ပြုချက်သက်သေကို:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

host permission table root က entry တွေကို role byte, permission byte နဲ့ epoch byte တွေနဲ့ sort လုပ်ပြီး Poseidon2 Merkle tree ကို တည်ဆောက်တယ်။

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Odd-width level တွေက နောက်ဆုံး element ကို duplicate လုပ်တယ်။

### Trace cryptographic commitment value ကိုရှာဖွေပါ။ {#trace-commitment}

ခြေရာခံမှုတိုင်တစ်ခုစီအတွက် `c`, FastPQ ပထမဆုံး Trace Domain ပေါ်က Column Value တွေကို Interpolates လုပ်ပြီး Coefficient vector ကို cryptographic hashs လုပ်ပေးပါတယ်။

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Trace Root က Column cryptographic commitment values တွေထက် Poseidon2 Merkle root တစ်ခုပါ။

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

နောက်ဆုံး trace cryptographic commitment value သည် domain, parameter set, trace shape, column cryptographic digests နှင့် trace root တို့ပေါ်တွင် byte cryptographic hash ဖြစ်ပါသည်။

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

`D_c` သည် `fastpq:v1:trace_commitment` ဖြစ်သောနေရာ။

### AIR ပေါင်းစပ်မှု {#air-composition}

V1 AIR ပေါင်းစပ်မှုတန်ဖိုးသည် အတန်း-ဒေသခံ ကျန်ကြွင်းချက်များ၏ မျဉ်းလိုက်ပေါင်းစပ်ခြင်းဖြစ်သည်။ သရုပ်ဖော်မှုနမူနာများသည်စိန်ခေါ်မှုနှစ်ခုကိုဆောင်ရွက်သည်။

$$
\alpha_0,\alpha_1 \in F
$$

နီးစပ်ရာ row pair တစ်ခုစီအတွက် `(i,i+1)` အတွက် prover က တွက်ချက်သည် -

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

ကျန်ပစ္စည်းများ `rho` ကို ကုဒ်အစီအစဉ်အရ အောက်ပါအတိုင်း သတ်မှတ်ထားပါသည်။

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

စစ်ဆေးသူက `A_i` ကို နမူနာထုတ်ယူထားသော row openings များအတွက် ပြန်လည် တွက်ချက်ပြီး AIR composition Merkle root အောက်တွင် cryptographically ချိတ်ဆက်ထားတဲ့ ပေါင်းစပ်မှုတန်ဖိုးနှင့်စစ်ဆေးတယ်။

### ရှာဖွေရေး ထုတ်ကုန် {#lookup-product}

ခွင့်ပြုချက်ရှာဖွေရေးအစုလိုက်က Fiat-Shamir စိန်ခေါ်မှု `gamma` ကိုအသုံးပြုသည်။ `s_perm` နှင့် `perm_hash` ၏ နိမ့်အဆင့်တိုးချဲ့မှု အကဲဖြတ်မှုများတွင် လည်ပတ်နေသည့်ထုတ်ကုန်သည်:

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

ခွင့်ပြုပါ။ `omega_T` Trace-domain generator ဖြစ်ဖို့၊ `omega_E` အကဲဖြတ်နယ်ပယ်ထုတ်လုပ်သူ၊ `g` configured coset offset ကို။ တန်ဖိုးရှိတဲ့ trace column အတွက် `v_i`, interpolation က coefficients တွေကို ထုတ်ပေးတယ်။ `a_j` ဒီလိုမျိုး၊

$$
f(\omega_T^i)=v_i
$$

ဒီဂရီနိမ့်တဲ့ တိုးချဲ့မှုက coset ပေါ်မှာ တူညီတဲ့ polynomial ကို အကဲဖြတ်တယ်။

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

အကောင်အထည်ဖော်ခြင်းသည် FFT မတိုင်မီ coset offset ၏ စွမ်းအားများဖြင့် ကိုက်ညီချက်များကို မြှောက်၍ ဤကိန်းကို တွက်ချက်သည်-

$$
a'_j = a_j g^j
$$

နောက်ပြီး `a'` ကို အကဲဖြတ်မှု နယ်ပယ်မှာ အကဲဖြတ်ခြင်း။

CPU FFT သည် bit-reversed input များအပေါ် iterative radix-2 Cooley-Tukey အပြောင်းအလဲတစ်ခုဖြစ်သည်။ အဆင့်အရှည် `L`, တစ်ဝက်အလျား `H=L/2` နှင့်အဆင့်အမြစ်တွင်:

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

ဆန့်ကျင်ဘက် FFT သည် `omega^{-1}` နှင့်အတူတူသော အပြောင်းအလဲကိုလုပ်ဆောင်ပြီး ဆန့်ကျင်ဖက်ဒိုမင်အရွယ်အစားဖြင့် ကျယ်ပြန့်စေသည်:

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

Catalogue Root ကနေ ရယူထားတဲ့ ပိုသေးတဲ့ Domain တွေအတွက် Generator ဟာ:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Row နှင့် Leaf cryptographic hashes များ {#row-and-leaf-hashes}

LDE အပြီးမှာ FastPQ သည် LDE ကော်လံများအနှံ့တွင် row တစ်ခုချင်းစီကို cryptographic hashs လုပ်သည်။ `m` ကော်လံအတွက်:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Row cryptographic hashs တွေက အကဲဖြတ်မှု domain ထက် trace domain မှာ ရှိနေသေးတယ်ဆိုရင် prover က အဲဒီ single row-hash column ကို same coset LDE process နဲ့ interpolates လုပ်ပြီး တိုးချဲ့ပေးပါတယ်။

### Merkle Openings များ {#merkle-openings}

LDE တန်ဖိုးများကို အောက်ပါ အပိုင်းများသို့ အုပ်စုစည်းထားသည်-

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

အရွက်တစ်ရွက်စီမှာ:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merkle ရဲ့မိဘတွေက

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Odd Levels က နောက်ဆုံး node ကို duplicate လုပ်ပေးတယ်။ query paths တွေကို level တစ်ခုစီမှာ query leaf index parity နဲ့အညီ ဘယ်ဘက် (သို့) ညာဘက် hash လုပ်ပြီး စစ်ဆေးပါတယ်။

အညွှန်းကိန်းမှာ စာရွက်အတွက် `i`, လမ်းကြောင်း `(s_0,\ldots,s_{d-1})` root ကို verifies လုပ်တယ်။ `R` အကြိမ်ကြိမ်ဖြစ်ပွားခြင်းအားဖြင့်

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

စစ်ဆေးမှုမှာ:

$$
y_d=R
$$

AIR လိပ်စာ အရွက်များမှာ-

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR အစိတ်အပိုင်း အရွက်များမှာ-

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE မေးမြန်းမှုဖွင့်ခြင်းသည် အကဲဖြတ်ချက်ညွှန်းကိန်း `i` တွင် ဖွင့်ထားသော တန်ဖိုးသည် ၎င်း၏ စစ်ဆေးခံရသည့် အစိတ်အပိုင်းတွင်ရှိသည်ကိုလည်း စစ်ဆေးသည်။

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

FRI cryptographically binds to AIR ပေါင်းစပ်မှု အကဲဖြတ်ချက်များ `l`, Transcript နမူနာတွေကို စိန်ခေါ်မှုတစ်ခု `beta_l`. အလွှာကို နောက်ဆုံးတန်ဖိုးကို ထပ်ခါပြောခြင်းဖြင့် arity ၏ အမြောက်အမြားသို့ ဖြည့်ပေးသည်။ arity အရွယ်အစား အုပ်စုတစ်ခုစီသည် အောက်ပါအတိုင်း ခေါက်ထားသည်။

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

`a` သည် FRI အရည်အသွေးရှိသည်။ စစ်ဆေးသူသည် နမူနာကောက်ခံသည့် မေးမြန်းချက်ချောင်းတစ်ခုစီအတွက်:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

ပြီးတော့ ဖွင့်ထားတဲ့ FRI အုပ်စုတိုင်းကို ကိုက်ညီတဲ့ FRI အလွှာ root နဲ့ စစ်ဆေးပါတယ်။

### Fiat-Shamir စာရွက်စာတမ်း {#fiat-shamir-transcript}

Single Protocol Standard Parameters Catalogue က transcript cryptographic hash ကို SHA3-256 လို့ တံဆိပ်တပ်ထားတယ်။ လက်ရှိ Prover နဲ့ Verifier အကောင်အထည်ဖော်ခြင်း `iroha_crypto::Hash::new` နဲ့ စိန်ခေါ်မှု byte တွေကို ထုတ်ယူတယ်၊ ဒါက 32-byte Blake2bVar cryptographic digest value ဖြစ်ပြီး ပထမ ၈ little-endian byte ကို `F` အဖြစ် လျှော့ချတယ်။

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

စိန်ခေါ်တန်ဖိုးကို တွက်ချက်သည့် ခေါ်ဆိုမှုများက ဟက်ရှ်အနှစ်ချုပ်တန်ဖိုး အပြည့်အစုံကို မှတ်တမ်းအခြေအနေထဲသို့ နောက်ဆက်တွဲ ပေါင်းထည့်သည်။ ပြန်လည်လုပ်ဆောင်သည့် အစီအစဉ်မှာ အောက်ပါအတိုင်းဖြစ်သည်-

1. အများပြည်သူ IO, protocol version, parameter version, and parameter name
2. LDE root နှင့် trace root
3. `gamma`
4. AIR ပေါင်းစပ်မှု စိန်ခေါ်မှုများ `alpha_0`, `alpha_1`
5. AIR ခြေရာအမြစ်နှင့် AIR ပေါင်းစပ်မှု အမြစ်
6. ရှာဖွေမှု ကြီးမားတဲ့ ထုတ်ကုန်
7. FRI အလွှာ အမြစ်များနှင့် `beta_l` စိန်ခေါ်မှုများ
8. နမူနာထုတ်ယူထားသော မေးမြန်းမှု အညွှန်းကိန်းများ

query sampling က 32-byte challenge cryptographic digests တွေကို ဆွဲယူပြီး requested number of unique indices ကိုရတဲ့အထိ `u64` အပိုင်းလေးတွေအဖြစ်ဖတ်တယ်။

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

နမူနာယူထားတဲ့ အစုကို အမျိုးအစားအလိုက် ပြန်ပို့ပေးပါတယ်။

### Verifier ကို ပြန်လည်ကစားရန် {#verifier-replay}

စစ်ဆေးသူက ပထမအကြိမ် အစုအဝေး cryptographic commitment value ကို ပြန်လည်တွက်ချက်တယ်။

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

ပြီးတော့ လိုအပ်တာက-

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

IO အများပြည်သူကို ပြန်လည်တည်ဆောက်ပေးသည်

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

ကွင်းတိုင်းသည် သက်သေခံ၏ အများပြည်သူ IO byte-for-byte နှင့် ကိုက်ညီရမည်။ နောက်ပြီး စစ်ဆေးသူက တူညီသော transcript ကိုပြန်လည်တည်ဆောက်၍ တူညီသောအကြောင်းရင်းကိုရယူသည်။

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

နမူနာကောက်ခံမှုတစ်ခုစီအတွက် `q` အတွက် စစ်ဆေးခြင်း

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

နိုင်ငံတကာ AIR အစိတ်အပိုင်းဖွင့်ခြင်းသည်အထောက်အထား `R_air_composition`. နိုင်ငံတကာ FRI ကွင်းဆက်က အဲဒီကနေ စပါတယ်။ `A_q` ပြီးရင် အတည်ပြုထားတဲ့ နောက်ဆုံးမှာ အဆုံးသတ်ရမယ်။ FRI terminal အောက်က အရွက် FRI အမြစ်။

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

အကောင်အထည်ဖော်ရေးလမ်းကြောင်းသည် မပြေးနေပါက (သို့) တန်းဖြည့်ထားပါက, အလုပ်ကို skip လုပ်ပြီး ပုံမှန် block processing ဆက်လက်ဖြစ်ပေါ်သည်။ ဆိုလိုသည်မှာနောက်ခံ prover အကောင်အ ထည်ဖော်ရေး လမ်းကြောင်းသည် transaction admission သို့မဟုတ် consensus gate မဟုတ်ပေ။ ၎င်းသည်လုပ်ဆောင်ပြီးသားအခြေအနေတစ်ခုအပေါ် proof-production path ဖြစ်ပါသည်။

အကောင်အထည်ဖော်ရေးလမ်းကြောင်းမှာ အောက်ပါအချက်အလက်များပါဝင်တဲ့ prover တစ်ခုကို တည်ဆောက်ထားတယ်။

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

အဆိုပါ settings နှစ်ခုစလုံး default ကို `cpu`. ရွေးချယ်ခြင်း `gpu` ပြတ်သားပြီး ကျရှုံးမှုမရှိသော တောင်းဆိုချက်တစ်ခုဖြစ်ပါသည်- GPU ထောက်ပံ့မှုစုစည်းခြင်း သို့မဟုတ် တောင်းဆိုခြင်း မရှိပါ။ GPU backend က pre-flight ကျရှုံးသွားတယ်၊ Prover execution lane ဟာ မသန်စွမ်းနေတုန်းပါ။ ပထမ release မှာတော့ `auto` တန်ဖိုးရှိပြီး တောင်းဆိုချက်ကနေ နောက်ပြန်မကျဘူး။ GPU mode ကို CPU.

## စစ်ဆေးခြင်း {#verification}

FastPQ proof verification က single protocol standard batch cryptographic commitment value ကို ပြန်လည်တည်ဆောက်ပြီး public transcript ကိုပြန်လည်ထည့်သွင်းပါတယ်။ verifier က protocol ကိုစစ်တယ်။ version, parameter-set version, replay limits, trace cryptographic commitment value, public inputs, sample Merkle openings, AIR openings, and FRI query chain.

Default playback ကန့်သတ်ချက်များမှာ:

|ကန့်သတ်ချက်|အလိုအလျောက်|
| ------------------ | ------: |
|အပြောင်းအလဲတန်းများ |     256 |
|အစုလိုက်အပြုံလိုက် ဝန်ဆောင်မှု အရွယ်အစား |၂၅၆ KiB|
|FRI အလွှာများ |      16 |
|မေးမြန်းမှု ဖွင့်ပွဲများ |     128 |

## Nexus စစ်ဆေးသော Relay များ {#nexus-verified-relays}

Nexus AXT သက်သေခံဒေတာ ကွန်တိန်နာများတွင် `AxtFastpqBinding` ကိုထည့်သွင်းနိုင်သည်။ `RegisterVerifiedLaneRelay` လုပ်တဲ့အခါမှာ, Iroha:

1. အကောင်အထည်ဖော်ရေးလမ်းကြောင်း Relay Data Container နဲ့ FastPQ proof material ကို စစ်ဆေးပါတယ်။
2. ဒေတာနေရာနှင့် နည်းပညာထုတ်ပြန်ချက် root ကို စစ်ဆေးသည်
3. AXT proof data container ကို decodes လုပ်ပေးတယ်။
4. `fastpq_binding` ကို လိုအပ်ပါသည်။
5. FastPQ ကောက်ကြောင်းကို ပြန်လည်တည်ဆောက်ပေးသည်
6. Embedded proof FastPQ ကို decodes လုပ်ပါ။
7. FastPQ verifier ကို ပြန်လည်တည်ဆောက်ထားတဲ့ batch နဲ့ proof ပေါ်မှာ ခေါ်ယူတယ်။

စစ်ဆေးမှု အောင်မြင်ခဲ့လျှင် Iroha သည် `VerifiedLaneRelayRecord` ကို သိုလှောင်ထားပြီး ရေလွှမ်းမိုးချက်၊ မူရင်းဒေတာ ကွန်တိန်နာ၊ သက်သေခံ အသုံးအဆောင် သင်္ကေတ hash၊ စစ်ဆေးမှု အမြင့်၊ နည်းပညာ manifest root နှင့် FastPQ ချည်နှောင်ခြင်းတို့ပါဝင်သည်။

execution lane relay data containers တွေမှာလည်း FastPQ proof material ကပ်ထားတယ်။ ဒီပစ္စည်းဟာ execution lane id, dataspace id, block height, verification height တို့ထက် cryptographic digest value တစ်ခုပါ။ Block header cryptographic hash, financial transaction settlement cryptographic Hash, and technical manifest root. a relay ကို QC နှင့် valid FastPQ proof material နှစ်ခုစလုံးရှိပါကသာ ပေါင်းစပ်ခွင့်ပြုသည်။

### AXT ချုပ်ကိုင်တဲ့ သင်္ချာ {#axt-binding-math}

Nexus AXT ဒေတာအိုးများအတွက်, `AxtFastpqBinding` ကို သက်သေပြမှုပြန်လည်ကစားခြင်းမတိုင်မီ canonicalized လုပ်ထားသည်. အလွတ် parameter တန်ဖိုးများကို default ကို `fastpq-lane-balanced`; empty verifier id နှင့် version ကို default ကို `fastpq` နှင့် `v1`; claim အမျိုးအစားကို trimmed နှင့် lowercased ဖြစ်ပါသည်။

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

`compliance` တောင်းဆိုချက်မှာ metadata အတန်းနှစ်ခု ထည့်သွင်းထားတယ်၊ တစ်ခုက မူဝါဒနဲ့တစ်ခုက ရည်ရွယ်တဲ့ ဒေတာနေရာတွေအတွက်ပါ။

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

Synthetic sender နဲ့ receiver account id တွေကို key seeds တွေကနေ ထုတ်ပေးပါတယ်။

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

AXT batch technical manifest cryptographic digest value သည် single protocol-standard binding ၏ Norito ကုဒ်သွင်းမှုအပေါ် SHA-256 ဖြစ်ပါသည်။

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP ပွင့်လင်းမြင်သာသော သတင်းအချက်အလက် သက်သေခံချက်များ {#sccp-transparent-message-proofs}

SCCP အကူအကူ ဆော့ဖ်ဝဲပက်ကတ်မှာ ပွင့်လင်းမြင်သာတဲ့ ကွင်းဆက်ဆန့်ကျင် သတင်းအချက်အလက် သက်သေခံမှုအတွက်လည်း FastPQ ကို အသုံးပြုပါတယ်။ ဒီလမ်းကြောင်းဟာ `iroha3d` နောက်ခံ prover လုပ်ဆောင်ရေးလမ်းကြောင်းကနေ သီးခြားပါ။ SCCP သတင်းအချက်အလက် အထောက်အထားအစုနှင့် နည်းပညာထုတ်ပြန်ချက်များမှ တိုက်ရိုက် FastPQ အုပ်စုကို တည်ဆောက်ပြီး ရလဒ်ရရှိသော အထောက်အထားကို ဖွင့်လှစ်စစ်ဆေးရန် ပိတ်ထားသည်။

SCCP အုပ်စုမှာ `fastpq-lane-balanced` နဲ့ metadata အပြောင်းအလဲ သုံးခုကိုသုံးပါတယ်။

|သော့|လုပ်ဆောင်ချက်|
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

၎င်းရဲ့ အများသုံး input တွေကို SCCP ပွင့်လင်းမြင်သာတဲ့ အတွင်းပိုင်း သက်သေခံချက်ကနေ ရယူထားတာပါ။

|FastPQ input ကို|SCCP မူရင်း |
| ------------- | ---------------------------------------------------------- |
|`dsid` |ပထမ ၁၆ ဘိုက် Blake2b cryptographic digest တန်ဖိုးကို statement ကို cryptographic hash ထက်|
|`slot` |အပြီးသတ်မှု အမြင့်|
|`old_root` |အသုံးဝင်သော ထိုးသွင်းမှု cryptographic hash |
|`new_root` |cryptographic commitment value root |
|`perm_root` |Finality Block ကို cryptographic hash လုပ်ပေးပါ။|
|`tx_set_hash` |ကြေညာချက် cryptographic hash |

SCCP single protocol-standard encoders တွေက integer တွေကို small-endian နဲ့ ရေးပြီး variable length byte arrays တွေကို အောက်ပါအတိုင်း encode လုပ်ပါတယ်။

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

ပွင့်လင်းမြင်သာသော အများပြည်သူ input byte string ကို:

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

Transparent statement bytes များမှာ version, chain family, local and counterparty domains, security model, anchor governance, account codec, finality model, verifier target, verifier backend family, length-prefixed chain/backend/manifest fields တို့ကို ပေါင်းစည်းထားခြင်းဖြစ်သည်။ destination binding cryptographic hash, account codec key, payload type, public input bytes, and payload cryptographic Hash တို့ကို သတ်မှတ်ထားပါသည်။

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

ဤအထောက်အထားလမ်းကြောင်းအတွက် FastPQ ဒေတာနေရာ id သည် Blake2b cryptographic digest value တစ်ခု၏ပထမ ၁၆ ဘိုက်များဖြစ်သည်။

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ ကောက်ကြောင်းက တိတိကျကျ:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

အဲဒီနောက်မှာ FastPQ မှာယူတဲ့ စည်းကမ်းအတိုင်း စီစဉ်ပေးတယ်။

နိုင်ငံတကာ OpenVerify verifier cryptographic commitment value ကတော့ SHA-256 အပေါ်က SCCP Message backend နာမည်နှင့် Single Protocol စံနှုန်း FastPQ verifier descriptor:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

မူကြမ်း FastPQ အထောက်အထားကို Norito ကို `StarkFriOpenProofV1` အဖြစ် ကုဒ်သွင်းပြီး နောက်ပိုင်းမှာ backend `Stark` ရှိတဲ့ `OpenVerifyEnvelope` ကို ဖုံးအုပ်လိုက်ပါတယ်။ SCCP စစ်ဆေးချက်က အလားတူပဲ ပြန်လည်တည်ဆောက်တယ်။ FastPQ batch from the bundle and technical manifest, checks the open verification data container metadata, and invokes the FastPQ verifier on the reconstructed batch and proof (ပြန်လည်တည်ဆောက်ထားတဲ့ batch နဲ့ သက်သေခံ)

## Parameters Sets များ {#parameter-sets}

Single Protocol Standard Parameter Catalogue မှာ parameters set နှစ်ခုကို ဖော်ပြထားပါတယ်။ host prover execution lane က လက်ရှိမှာ `fastpq-lane-balanced` ကို သုံးပါတယ်။

|Parameter ကို|ရည်ရွယ်ချက်|ကွင်း |cryptographic hashes များ|FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |ဟန်ချက်ညီသော ဆာဗာ ဖြတ်သန်းမှု |Goldilocks quadratic extension ကို|Poseidon2 cryptographic commitment values, catalogue SHA3 label |အခန်း ၈၊ ပေါက်ကွဲမှု ၈၊ ၄၆ မေးခွန်း|
|`fastpq-lane-latency` |latency ထိခိုက်လွယ်တဲ့ အကောင်အထည်ဖော်ရေးလမ်းကြောင်းများ |Goldilocks quadratic extension ကို|Poseidon2 cryptographic commitment values, catalogue SHA3 label |Arity 16, blowup 16, 34 မေးခွန်းများ |

နှစ်ခုစလုံးသည် 128-bit လုံခြုံမှုကိုရည်ရွယ်ပြီး `2^16` ၏ ခြေရာ domain အရွယ်အစားကိုအသုံးပြုသည်။ Rust V1 စာသားပြန်လည်ဖြည့်သွင်းရေးကုဒ်သည် လက်ရှိတွင် Fiat-Shamir စိန်ခေါ်မှု bytes ကို `iroha_crypto::Hash::new` ဖြင့် တိုက်ရိုက်ဖေါ်ထုတ်ခြင်းထက်သာ၍ SHA3-256 ကို ထုတ်ယူသည်။

Rust Prover သုံးတဲ့ တိကျတဲ့ စာရင်း ကိန်းသေတွေဟာ:

|အမြဲတမ်း|`fastpq-lane-balanced` |`fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
|`target_security` |                    128 |                   128 |
|`grinding_bits` |                     23 |                    21 |
|`trace_log_size` |                     16 |                    16 |
|`trace_root` |`0x002a247f81c6f850` |`0x6a9f4eb38fb9b892` |
|`lde_log_size` |                     19 |                    20 |
|`lde_root` |`0x60263388dbbf9b2a` |`0x9c9c3a571b6f89ac` |
|`permutation_size` |                 65,536 |                65,536 |
|`lookup_log_size` |                     19 |                    20 |
|`omega_coset` |`0x6af325e825ad5c18` |`0x3a5fd4171e3c3a4d` |
|`fri_arity` |                      8 |                    16 |
|`fri_blowup` |                      8 |                    16 |
|`fri_max_reductions` |                      8 |                     6 |
|`fri_queries` |                     46 |                    34 |

## ဖွဲ့စည်းပုံ {#configuration}

FastPQ configuration ကို `zk.fastpq` အောက်မှာ nested ထားတယ်။

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
metal_debug_fused = false
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
- `FASTPQ_DEBUG_FUSED`

## မက်ထရစ်များ {#metrics}

FastPQ က Backend ရွေးချယ်ခြင်းနှင့် Metal Software အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် အပြုအမူအတွက် မက်ထရစ်များကို တင်ပို့သည်။

|မက်ထရစ် |အဓိပ္ပါယ်|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |requested and resolved execution mode by backend and device labels  နောက်ဆက်တွဲအဆုံးနှင့်ကိရိယာလိပ်များဖြင့်တောင်းဆိုထားသောနှင့်ဖြေရှင်းထားသော လုပ်ဆောင်မှုပုံစံ|
|`fastpq_poseidon_pipeline_total` |requested and resolved Poseidon software processing workflow path ကိုရှာဖွေပြီး ဖြေရှင်းခဲ့ပါတယ် |
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
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ ရွေးချယ်စရာများ](/my/reference/iroha3d-cli.md#fastpq-overrides)
