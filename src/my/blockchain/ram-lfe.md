---
translation_locale: my
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE Random-Access Machine Laconic Function Evaluation ကို ဆိုလိုပါတယ်။
Iroha, ဒါဟာ အများပြည်သူရဲ့ မူဝါဒတွေအတွက် ပုန်းကွယ်နေတဲ့ လုပ်ဆောင်ချက် အလွှာတစ်ခုပါ။
ချိတ်ဆက်ထားပေမဲ့ တန်ဖိုးသတ်မှတ်သူရဲ့ ယုတ္တိ၊ လျှို့ဝှက် (သို့) ရိုးရိုး input တွေဟာ
ကမ္ဘာ့အဖွဲ့အစည်းကို ရေးသားထားတာပါ။ SORA Nexus Identifier စီးဆင်းမှုများ
ပုဂ္ဂလိကဖုန်း (သို့) အီးမေးလ်ရှာဖွေမှုဖြစ်ပြီး ယေဘုယျအဖြစ်လည်း ဖော်ပြနိုင်သည် Torii
node profile က app ကို မျက်နှာပြုတဲ့ လမ်းကြောင်းတွေကို enable လုပ်တဲ့အခါမှာ program execution assistant ပါ။

ကွင်းဆက်က မူဝါဒဆိုင်ရာ တာဝန်ယူမှုနှင့် လက်ခံလက်မှတ်စစ်ဆေးခြင်း metadata များကို သိမ်းဆည်းထားသည်။
resolver သို့မဟုတ် Torii Runtime က ပုန်းနေတဲ့ အစီအစဉ်ကို အကဲဖြတ်ပြီး
ခွင့်ပြု output ကို, နှင့် client များအတွက်လက်မှတ် attachs, support tooling, သို့မဟုတ်
မှတ်ပုံတင်ထားတဲ့ မူဝါဒကို စစ်ဆေးနိုင်တဲ့ Ledger ညွှန်ကြားချက်ပါ။

## အမည်ပေးခြင်း {#naming}

နာမည်ခွဲခြားချက်က အရေးပါပါတယ်။

| ကာလ | အဓိပ္ပါယ် |
| --- | --- |
| `ram_lfe` | ပြင်ပ ပုန်းကွယ်နေတဲ့ လုပ်ဆောင်ချက် သရုပ်ဖော်မှု: အစီအစဉ် မူဝါဒများ၊ ကတိပေးချက်များ၊ အကောင်အထည်ဖော်မှု လက်မှတ်များနှင့် လက်မှတ်စစ်ဆေးမှု ပုံစံ။ |
| `BFV` | ဘရက်ကာစကီ/ဖန်-ဗာ့ကာူတာရင် ဟိုမော်ဖစ် ကုဒ်သွင်းမှုစနစ်ကို ကုဒ်သွင်းခြင်းဖြင့် အသုံးပြုသည်။ RAM-LFE နောက်ပြန်သွားပါ။ |
| `ram_fhe_profile` | BFV- ပရိုဂရမ်လုပ်ထားတဲ့ ကုဒ်သွင်းတဲ့ အကောင်အထည်ဖော်ရေးစက်အတွက် သီးသန့် metadata ပါ။ RAM-LFE. |

ဒေတာပုံစံမှာ `RamLfeProgramPolicy` နှင့် `RamLfeExecutionReceipt` ရှိသည်
RAM-LFE အမျိုးအစားတွေပေါ့။ BFV ပမာဏများ၊ ကုဒ်စာသားအဖုံးများနှင့်
RAM-FHE Program Profile က encrypted execution backend ကို အသုံးပြုပြီး
မူဝါဒပါ။

## မှတ်တမ်းတင်ချက်များ {#what-it-records}

A ကို RAM-LFE ပရိုဂရမ် မူဝါဒကို ကမ္ဘာတစ်လွှားမှာ မှတ်ပုံတင်ထားပါတယ်။ `program_id`. မူဝါဒ
အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- ပိုင်ဆိုင်သူကွန်ရက်ကို တက်ကြွ၊ ပိတ်လိုက်၊ ဒါမှမဟုတ် အခြားနည်းဖြင့် ပြောင်းလဲနိုင်သော
  မူဝါဒ
- ဖောက်သည်များအား ကြော်ငြာထားသော backend
- လက်ခံရရှိချက် စစ်ဆေးမှုပုံစံ (သို့) `signed` ဒါမှမဟုတ် `proof`
- ပုန်းကွယ်နေတဲ့ အစီအစဉ် metadata နဲ့ evaluator လျှို့ဝှက်ချက်အတွက် ရည်စူးမှု
- လက်မှတ်ရေးထိုးထားတဲ့လက်မှတ်များအတွက် Resolver အများသုံးသော့
- ရွေးချယ်စရာ အများပြည်သူ လျှို့ဝှက်သွင်းတဲ့ metadata များ၊ ဥပမာ BFV ပြိုင်ဘက်များနှင့်
  `ram_fhe_profile`
- တစ် `active` မူဝါဒက လက်မှတ်သစ်တွေ ထုတ်ပေးနိုင်မလားဆိုတာ ထိန်းချုပ်တဲ့ အလံ

ပုန်းကွယ်နေတဲ့ လျှို့ဝှက်ချက်၊ Plaintext ID တန်ဖိုးနဲ့ ပုန်းကွယ်တဲ့ အစီအစဉ် ကိုယ်ခန္ဓာက
ကမ္ဘာအခြေအနေမှာ သိမ်းထားခြင်းမရှိပါ။ ဖောက်သည်တွေဟာ ကတိပေးချက်တွေ၊ မရှင်းလင်းတဲ့ ဟက်ရှ်တွေ၊
လက်ခံရရှိမှု hashes များ၊ encrypted စာသားများနှင့် program digests များသည် opaque protocol values များဖြစ်ပါသည်။

## နောက်ခံများ {#backends}

လက်ရှိ RAM-LFE Support ကို backend ID သုံးခုကို ဗဟိုပြုထားပါတယ်

| Backend ကို | အသုံးပြုခြင်း |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | အမိန့်ချမှတ်ခြင်း PRF အကဲဖြတ်ခြင်း။ |
| `bfv-affine-sha3-256-v1` | BFV ကုဒ်သွင်းထားတဲ့ မှတ်သားစရာ နေရာတွေထက် လျှို့ဝှက် အချိတ်အနှီး အကဲဖြတ်မှုကို ထောက်ခံတယ်။ |
| `bfv-programmed-sha3-256-v1` | BFV- ကုဒ်သွင်းထားတဲ့ မှတ်ပုံတင်များနဲ့ မော်ရီလမ်းကြောင်းတွေပေါ်မှာ ပရိုဂရမ်လုပ်ပြီး အကောင်အထည်ဖော်တယ်။ |

မှတ်သားရေး မူဝါဒများအတွက် အစီအစဉ်ချထားသော BFV backend ဟာ အရေးကြီးတဲ့ ခေတ်သစ်
path. ဒါက wallet တွေကို ပုံမှန် input ကို ဒေသတွင်းမှာ encrypt လုပ်ခွင့်ပေးတယ်
ငွေပေးချေမှုမှာ အများပြည်သူအသိကို မမြင်ဘဲ အကဲဖြတ်ပြီး ပြန်ပို့တဲ့
ရလဒ် hash ကို မှတ်ပုံတင်ထားတဲ့ ပရိုဂရမ် မူဝါဒနဲ့ ချိတ်ဆက်တဲ့ လက်ခံစာပါ။

## သင်္ချာ {#math}

ဤအပိုဒ်သည် လက်ရှိအသုံးပြုသော အကောင်အထည်ဖော်မှုအဆင့် အက္ခရာကိုဖော်ပြသည်။
RAM-LFE code ဆိုတာ လုံခြုံမှု သက်သေပြချက်မဟုတ်ပါဘူး၊ ဒါက deterministic transcript ပါ။
မူဝါဒများ၊ လက်မှတ်များနှင့် ဖောက်သည်များအတွက်
သဘောတူပါတယ်။

### မှတ်ချက်တင်ခြင်း {#notation}

ပေးပါ။

-  H(m) \) be Iroha `Hash::new(m)`: Blake2b-32 ပြီးသွားပြီ `m`, အနည်းဆုံး
  နောက်ဆုံး byte ရဲ့ သိသိသာသာကို `1`.
- \(N(x)\) ကနေနီကျမ်းဖြစ်ဖို့ Norito ကုဒ်သွင်းခြင်း `x`.
- \(a \parallel b\) byte-string concatenation ကို ဆိုလိုတာပါ။
- Operatorname{le64} (i) \) ကို 8-byte အနည်းဆုံး Endian ကုဒ်ဖြစ်ပါ
  လက်မှတ်မထိုးတဲ့ တစ်လုံးလုံးပါ။
- \(s\) ကမ္ဘာအပြင် နိုင်ငံမှာရှိတဲ့ လျှို့ဝှက်ချက် ဖြေရှင်းသူဖြစ်ဖို့ပါ။
- \(P\) အများပြည်သူရေးရာ မူဝါဒတွေ ဖြစ်ဖို့ပါ။
- \(A\) ဆက်စပ် ဒေတာကို တောင်းဆိုပါ။
- \(x\) ပုံမှန် input bytes သို့မဟုတ် a Norito- encoded encrypted input
  အနောက်ဘက်ကို မှီခိုပြီး စာအိတ်ပါ။

RAM-LFE ဒိုမင်ခွဲခြား hash တွေကို အသုံးပြုပါတယ်။ အောက်ပါ ပုံသေနည်းတွေက
ရည်ရွယ်ချက်၊ ၎င်းတို့၏ လက်ရှိ byte string များမှာ:

| သင်္ကေတ | Domain string များ |
| --- | --- |
| \(D_{\mathrm{policy}}\) | `iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{secret}}\) | `iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{salt}}\) | `iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_opaque}}\) | `iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_receipt}}\) | `iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{opaque}}\) | `iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{receipt}}\) | `iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{affine\_circuit}}\) | `iroha.ram_lfe.bfv_affine.circuit.v1` |
| \(D_{\mathrm{affine\_opaque}}\) | `iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
| \(D_{\mathrm{affine\_receipt}}\) | `iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
| \(D_{\mathrm{program\_memory}}\) | `iroha.ram_lfe.bfv_program.memory.v1` |
| \(D_{\mathrm{program\_opaque}}\) | `iroha.ram_lfe.bfv_program.opaque_hash.v1` |
| \(D_{\mathrm{program\_receipt}}\) | `iroha.ram_lfe.bfv_program.receipt_hash.v1` |
| \(D_{\mathrm{program\_digest}}\) | `iroha.ram_lfe.bfv_program.digest.v1` |
| \(D_{\mathrm{output}}\) | `iroha.ram_lfe.output_hash.v1` |
| \(D_{\mathrm{id\_opaque}}\) | `iroha.ram_lfe.identifier.opaque_hash.v1` |
| \(D_{\mathrm{id\_receipt}}\) | `iroha.ram_lfe.identifier.receipt_hash.v1` |
| \(D_{\mathrm{bfv\_keygen}}\) | `iroha.crypto.fhe.bfv.keygen.v1` |
| \(D_{\mathrm{bfv\_encrypt}}\) | `iroha.crypto.fhe.bfv.encrypt.v1` |
| \(D_{\mathrm{id\_keygen}}\) | `iroha.crypto.fhe.bfv.identifier.keygen.v1` |
| \(D_{\mathrm{id\_slot}}\) | `iroha.crypto.fhe.bfv.identifier.slot.v1` |

### မူဝါဒဆိုင်ရာ ကတိပေးချက် {#policy-commitment}

မူဝါဒ ကတိကဝတ်ကို အများပြည်သူ parameters နှင့် လျှို့ဝှက် resolver လျှို့ဝက်
ပထမအချက်က လျှို့ဝှက်ချက်ဟာ သီးခြားလုပ်ထားတာပါ။

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

အဲဒီနောက်မှာ မူဝါဒရဲ့ အပြည့်အစုံကို ကုဒ်သွင်းထားတယ်။

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

ပြီးတော့ ထုတ်ဝေထားတဲ့ မူဝါဒ hash ကတော့

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

သံကြိုးပေါ်က `PolicyCommitment` ဖြစ်ပါသည်။

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

အကဲဖြတ်ချက်က Runtime လျှို့ဝှက်ချက်ကနေ တူညီတဲ့တန်ဖိုးကို ပြန်တွက်တယ်။
ပြန်လည် တွက်ချက်ထားတဲ့ hash ကွာခြားတယ်၊ အကဲဖြတ်မှု ကျရှုံးတာက commitment မညီမျှမှုနဲ့ပါ။

### HKDF-SHA3-512 Backend ကို {#hkdf-sha3-512-backend}

အတွက် `hkdf-sha3-512-prf-v1`, output က normalized input ကိုပဲဆိုပေမဲ့
opaque ID နဲ့ လက်မှတ် hash တွေဟာ လျှို့ဝှက် ချည်နှောင်ထားတယ်။ PRF ထုတ်ကုန်များ။

တောင်းဆိုချက်စာရင်းက-

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

နိုင်ငံခြားရေး HKDF ဆားနဲ့ pseudorandom key တွေက

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

မရှင်းလင်းတဲ့ ပစ္စည်းကို ကျယ်ပြန့်ပြီး hash လုပ်တယ်။

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

လက်ခံရရှိမှုပစ္စည်းက မရှင်းလင်းတဲ့ ID ကို ထပ်ပြီး ချိတ်ဆက်ပေးပါတယ်။

$$
m_r =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK},
D_{\mathrm{hkdf\_receipt}} \parallel T_{\mathrm{req}}
\parallel \mathrm{opaque\_id}, 32)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{receipt}} \parallel m_r \parallel \mathrm{opaque\_id})
$$

Backend က ပြန်လာတယ်

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV ထုံးစံအတိုင်း {#bfv-primer}

BFV "Homomorphic" ဆိုသည်မှာ ဂိတ်ပေါ်အခြေခံသော homomorphic encryption scheme ကို ဆိုလိုသည်။
ပရိုဂရမ်တစ်ခုဟာ ကုဒ်သွင်းထားတဲ့ တန်ဖိုးတွေကို ထပ်ဖြည့်ပြီး မြှောက်နိုင်ပြီး ကုဒ်ချိုးပြီးနောက်မှာ
ထပ်ပေါင်းခြင်းနဲ့ မြှောက်ခြင်းတွေကို လုပ်ခဲ့သလိုပဲ ရလဒ်တစ်ခုရမယ်။
Plaintext တန်ဖိုးတွေအကြောင်း

အတွက် RAM-LFE, BFV ကုဒ်သွင်းတဲ့ အချက်အလက်ပေးစနစ်အဖြစ် အသုံးပြုပါတယ်။

1. ငွေကြေးအိတ်က ဖုန်းနံပါတ် (သို့) အီးမေးလ်လို ပုဂ္ဂလိကတန်ဖိုးကို ပုံမှန်ပြုပြင်ပေးတယ်။
   လိပ်စာ။
2. ပိုက်ဆံအိတ်က ဘိုင်တာတွေကို အလုံးစုံပေါက်လေးတွေအဖြစ် ပြောင်းပေးတယ်။
3. slot တစ်ခုစီကို resolver ရဲ့ BFV အများသုံး သော့ပါ။
4. Resolver Runtime က အဲဒီ ကုဒ်စာသားတွေကို သုံးပြီး ပုန်းနေတဲ့ အစီအစဉ်ကို အကဲဖြတ်တယ်။
5. Runtime က ပုန်းနေတဲ့ Program Output တွေကိုပဲ decrypt လုပ်ပေးတယ်
   လက်မှတ်။

BFV ဂဏန်းလုံးပေါင်းက တိကျတဲ့ ကိန်းဂဏန်းပါ၊ နီးစပ်တဲ့ ဂဏန်းမဟုတ်ဘူး။
Identifier bytes နဲ့ အသေးစား modular computations တွေအတွက် ပိုတော်ပါတယ်။
floating point model မှန်းဆချက် Iroha current ကို BFV အသုံးပြုမှု တစ်ခုစီကို ကုဒ်သွင်းထားသည်
slot က scalar value တစ်ခုကို မော်ဒူးလို သယ်ဆောင်ထားပါတယ် \(t\), ပုံမှန်အားဖြင့် byte သို့မဟုတ် byte အလျား
နယ်ပယ်။ ကုဒ်စာသားကိုယ်တိုင်က အများကြီးပိုကြီးတဲ့ integer တစ်ခုကို modulo ကိုနေထိုင် \(q\). နိုင်ငံခြားရေး
ကွာဟချက် \(q\) နှင့် \(t\) encryption ကိုအသံအတွက် decryption နေရာပေး
ပြီးတော့ homomorphic operations တွေကို introduce လုပ်ပေးတယ်။

A ကို BFV ciphertext မှာ polynomial အစိတ်အပိုင်း နှစ်ခုရှိပါတယ်။

$$
c=(c_0,c_1)
$$

လျှို့ဝှက်သော့က အခြား polynomial တစ်ခုပါ။ \(s_k\). ဒီကုဒ်ဖေါ်ထုတ်မှုဟာ
အစိတ်အပိုင်းများ

$$
v = c_0 + c_1s_k
$$

ကုဒ်စာသားကို မှန်ကန်စွာ ဖွဲ့စည်းထားပြီး ဆူညံသံက လုံလောက်အောင်သေးတယ်ဆိုရင်
\(v\) ကျယ်ပြန့်တဲ့ စာသားနဲ့ နီးစပ်တယ်။ Rounding ကစာသားကို ပြန်လည်ထူထောင်ပေးပါတယ်။
ကော်ဖီနန်း Modulo \(t\). အသုံးဝင်တဲ့ ဂုဏ်သတ္တိက ကုဒ်စာသား လုပ်ဆောင်ချက်ပါ။
ဒီဖွဲ့စည်းမှုကို ထိန်းသိမ်းထားပါ။

| လတ်တလော လုပ်ဆောင်မှု | ကုဒ်စာသား လုပ်ဆောင်ချက် |
| --- | --- |
| \(m+n\) | သော့ချက်စာသား အစိတ်အပိုင်းတွေ ထည့်ပါ။ |
| \(m+\alpha\) | စကေးထားတဲ့ plaintext ကိန်းသေကို \(c_0\). |
| \(\alpha m\) | သတ္မွတ္စာသား အပိုင္းႏွစ္ခုစလံုးကို scale by \(\alpha\). |
| \(mn\) | ကုဒ်စာသား polynomials များကို မြှောက်ပြီး ပြန်လည်ကျယ်ပြန့်အောင်လုပ်ပါ။ |

Multiplication က စျေးကြီးတဲ့ လုပ်ငန်းစဉ်ပါ။ နှစ်ခုရဲ့ နှစ်ခုပါတဲ့ ထုတ်ကုန်တစ်ခု
ciphertexts က သဘာဝအတိုင်း သုံးဖွဲ့စည်းမှုရှိတဲ့ ciphertext တစ်ခုကို ဖန်တီးပေးပြီး
\(1\), \(s_k\), နှင့် \(s_k^2\). Relinearization သည် ထုတ်ဝေထားသော အကဲဖြတ်ရေး သော့ကို အသုံးပြုသည်။
ကိုထည့်ဖို့ \(s_k^2\) ဒီစာလုံးဟာ ပုံမှန် နှစ်ခုပါတဲ့ စာသားကို ပြန်သုံးပါတယ်။
နောက်ပိုင်းမှာ ထပ်ပေါင်းခြင်းနဲ့ မြှောက်ခြင်းတွေကိုလည်း အလားတူ ကုဒ်စာသားပုံစံကို သုံးပြီး ထိန်းထားတယ်။

BFV "leveled" ဖြစ်ပါသည် - ကုဒ်သွင်းထားသော လုပ်ငန်းတိုင်းတွင် ဆူညံသံ ဘတ်ဂျက်တစ်ချို့ကို သုံးစွဲသည်။
ဒီအကောင်အထည်ဖော်မှုက ဒီဘတ်ဂျက်ကို ပြန်လည်ဆန်းသစ်ဖို့ ဆော့ဖ်ဝဲစာသားတွေကို bootstrap မလုပ်ဘူး။
ဒီအစား RAM-LFE အနည်းငယ် ထုတ်ဝေတယ်။ `ram_fhe_profile` ကန့်သတ်ထားတဲ့ အကန့်အသတ်ကိုသာ လက်ခံတယ်။
ပရိုဂရမ်ပုံစံကို ဖုံးကွယ်ထားတယ်။ ဒါက သတ်မှတ်ချက်စုရဲ့ အကဲဖြတ်မှုကို ထိန်းထားတာပါ။
ပရိုဂရမ်လုပ်ထားတဲ့ လက်ရှိ profile က fixed register ကိုခွင့်ပြုတယ်
Count, fixed memory-lane count နဲ့ အများဆုံး codetext-codetext တစ်ခု
အစီအစဉ်ချထားတဲ့ အဆင့်တစ်ခုအတွက် မြှောက်ခြင်း။

ဒီထဲမှာ RAM-LFE ဒီဇိုင်း၊ BFV အများပြည်သူစာရင်းထဲက ဒေတာကနေ ဖောက်သည် input ကို ပုန်းထားပြီး
Transaction (သို့) Route သုံးစွဲသူကိုသာ မြင်တဲ့ လေ့လာသူတွေကနေပါ။
ချိတ်ဆက်မှုဟာ အလိုလို ကုဒ်သွင်းထားတဲ့ အစီအစဉ်တွေကို ကိုယ်တိုင် လုပ်ဆောင်ပါတယ်။ Torii resolver ကို
runtime ကိုပိုင်ဆိုင်ဆဲ BFV လျှို့ဝှက်ပစ္စည်း၊ ဖွဲ့စည်းထားသော hidden ကိုအကဲဖြတ်
Program က ခွင့်ပြုထားတဲ့ output ကို decrypt လုပ်ပြီး ရလဒ်ကို သက်သေပြပါတယ်။
ထို့နောက် ချိတ်ဆက်ထားသော မူဝါဒဆိုင်ရာ ကတိပေးချက်နှင့် ပတ်သက်၍ သက်သေခံစာရင်းကို စစ်ဆေးခြင်း၊
အများသုံး သော့ (သို့) သက်သေခံ metadata ကို resolver လုပ်ပါ။

Identifier အသုံးပြုမှု ကိစ္စက ရိုးရှင်းတဲ့ ကိုယ်စားပြုမှုကို ရည်ရွယ်ပြီး ရွေးချယ်တယ်။
normalized string ကို အောက်ပါအတိုင်း ကုဒ်ပေးထားပါတယ်

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

ဒြပ်စင်တိုင်းဟာ ၎င်းရဲ့ ကိုယ်ပိုင်အဖြစ် ကုဒ်သွင်းထားတယ်။ BFV scalar encryption text ကို ဒီပုံစံက
normalization နဲ့ envelope validation explicit ကို wallet တွေကို encrypted build လုပ်ခွင့်ပေးတယ်
Public parameters ကေန ေတာင္းဆိုခ်က္မ်ားကို ျပဳလုပ္ၿပီး Resolver ကို Equivalent ကို canonicalize လုပ္ေပးနိုင္ပါတယ္။
သော့ဝဲသွင်းချက်တွေကို တည်ငြိမ်တဲ့ လက်မှတ်စာရင်းမှာ ထည့်ထားတယ်။

### BFV လက်စွပ်ပုံစံ {#bfv-ring-model}

နိုင်ငံခြားရေး BFV backends တွေဟာ negacyclic polynomial ring ကိုသုံးကြပါတယ်

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

ပြီးတော့ စာသားအရှင်းလေးတွေ:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

ဘယ်နေရာမှာ:

- \(n\) ရှိသည် `polynomial_degree`, နှစ်ခုအား
- \(q\) ရှိသည် `ciphertext_modulus`
- \(t\) ရှိသည် `plaintext_modulus`
- \(q > t\) နှင့် \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Plaintext ကော်ဖစ်ကိန်း vectors တွေကို ကော်ဖီရှင် တစ်ခုစီကို scale လုပ်ပြီး encode လုပ်ပါတယ်။

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

decryption center-lifts ကို coefficient တစ်ခုစီကို:

$$
v = c_0 + c_1 s_k \in R_q
$$

ပြီးရင် ဒါကို ပြန်လည်ထည့်လိုက်ပါ \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

ဒီမှာ \(s_k\) အဲဒါက BFV လျှို့ဝှက်သော့ polynomial, အပြင်ဘက်မဟုတ် RAM-LFE resolver ကို
လျှို့ဝှက်ချက် \(s\).

### BFV အဓိက မျိုးဆက် {#bfv-key-generation}

ကုဒ်သွင်းထားတဲ့ မှတ်သားရေး အချက်အလက်အတွက်၊ BFV အဓိက ပစ္စည်းက deterministic ကို
resolver လျှို့ဝှက်ချက်များနှင့် ဆက်စပ်သော အချက်အလက်များ

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

နိုင်ငံခြားရေး BFV RNG မျိုးစေ့ကို အောက်ပါအတိုင်း စိုက်ထားသည်-

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

အဓိက ထုတ်လုပ်သူ နမူနာများ:

- \(s_k \in \{-1,0,1\}^n\), ကိုယ်စားပြုသော modulo \(q\)
- \(a \leftarrow R_q\) တညီတညွတ်တည်း
- \(e \in \{-1,0,1\}^n\)

အများသုံး သော့က-

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

ပြန်လည်ချိတ်ဆက်ခြင်းအတွက် \(s_k^2\) ကြေးနီထုတ်ကုန်ဖြစ်ပါ \(R_q\). တစ်ခုချင်းစီအတွက်
အခြေခံ -\(B\) ဂဏန်း \(j\), နမူနာ \(a_j\) တစ်ညီတည်းနဲ့ \(e_j\) ငယ်ငယ်လေးတွေကနေ
ဖြန့်ဝေပြီးနောက် ထုတ်ပြန်လိုက်ပါ

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

အများပြည်သူ BFV မူဝါဒ metadata တွေမှာ public key ပါတယ်
`max_input_bytes`. နိုင်ငံခြားရေး BFV လျှို့ဝှက်သော့နှင့် relinearization သော့
Resolver Runtime ကို

### BFV ကုဒ်သွင်းခြင်းနှင့် လုပ်ငန်းများ {#bfv-encryption-and-operations}

Plaintext polynomial ကို encrypt လုပ်ဖို့ \(m\), အကောင်အထည်ဖော်မှု မျိုးစေ့များ
ChaCha20 RNG မှ:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

ဒါက နမူနာတွေ \(u,e_1,e_2 \in \{-1,0,1\}^n\) ကွန်ပျူတာတွေ

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

သတ္မွတ္စာက \(c=(c_0,c_1)\).

ဟိုမော်ဖစ် ပေါင်းထည့်ခြင်းသည် အစိတ်အပိုင်းအရသာရှိသည်

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Plaintext scalar ကိုထည့်ခြင်း \(\alpha\) Coefficient သုည ပြောင်းလဲမှုအတွက်သာ
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Plaintext scalar ဖြင့် မြှောက်ခြင်း \(\alpha\) အစိတ်အပိုင်း နှစ်ခုစလုံးကို ကျယ်ပြန့်စေသည်

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

စာလုံးပေါင်း နှစ်ခုအတွက် \(c=(c_0,c_(၁) ) နှင့် (၃)_0,d_(၁) \), ကုဒ်စာသား
multiplication က ပထမဦးဆုံး size-၃ ကုဒ်စာသားကို တွက်ချက်ပြီး တိုင်းတာ
ပြန်ညွှန်းကိန်း \(t/q\):

$$
\tilde c_0 = \left\lfloor \frac{t(c_0 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_1 =
\left\lfloor \frac{t(c_0 d_1 + c_1 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_2 = \left\lfloor \frac{t(c_1 d_1)}{q} \right\rceil \bmod q
$$

အထက်ပါထုတ်ကုန်အားလုံးသည် Negcyclic Ring ထုတ်ကုန်များဖြစ်သည်။ \(R_q\). ဒါဆို
\(\tilde c_2\) အခြေခံအဖြစ် ဆွေးမြေ့သွားပါတယ်။\(B\) polynomials:

$$
\tilde c_2 = \sum_j B^j u_j
$$

နောက်ပြီး ပြန်လည်ချိတ်ဆက်ထားပါတယ်

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

ရလဒ်က ထပ်ပြီး နှစ်ခုပါဝင်တဲ့ BFV ကုဒ်စာသား။

### Identifier စာလုံးဝှက်စာအုပ် အိတ် {#identifier-ciphertext-envelope}

ID input byte string ကို:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

scalar slots တွေမှာ ကုဒ်သွင်းထားပါတယ်

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

ကျန်တဲ့ slot တွေက သုညအထိပါ။ `max_input_bytes + 1`. စကလာတစ်ခုစီ
slot ကို coefficient-zero plaintext polynomial အဖြစ် encrypt လုပ်ထားပါတယ် \([m_i]\).
သော့တစ်ပေါက်အတွက် ကုဒ်သွင်းမှု မျိုးစေ့က

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

ကုဒ်သွင်းထားတဲ့ မှတ်သားရေးအိတ်က

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

ဘယ်မှာ \(M=\mathrm{max\_input\_bytes}\).

### BFV အပြန်အလှန်ဆက်သွယ်မှု {#bfv-affine-backend}

အတွက် `bfv-affine-sha3-256-v1`, Runtime က ပထမဦးဆုံး ရယူ BFV အဓိက ပစ္စည်းများ
\(s\) နှင့် \(A\). ရယူထားတဲ့ အများပြည်သူ ပမာဏတွေဟာ အများပြည်သူနဲ့ အတိအကျ ကိုက်ညီဖို့လိုတယ်။
ချိတ်ဆက်မှုမှာ တာဝန်ယူထားတဲ့ parameters တွေပါ။

ရင်းနှီးတဲ့ ပတ်လမ်းမျိုးစေ့က

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

ဒီမျိုးစေ့ကနေ Runtime နမူနာတွေ modulo \(t\), ၃၂ တန်းဆက်စပ်သော ပတ်လမ်း:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

ဘယ်မှာ \(m_i\) Homomorphically က တွက်ချက်ပေးတယ်
စာလုံးပေါင်းများအတွက် တူညီသောတန်ဖိုး:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Resolver တစ်ခုစီကို decrypts \(C_j\), နောက်ဆက်တွဲ စာသားအားလုံးကို လိုအပ်ပါတယ်။
Coefficients to be zero ကိုဗစ်ကိန်းကို bytes သို့ပြောင်းပေးပြီး
ပုံစံများ:

$$
O=(y_0,\ldots,y_{31})
$$

အဲဒီနောက်မှာ

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{affine\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{affine\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_id})
$$

### BFV ပရိုဂရမ်ပြုလုပ်ထားသော Backend {#bfv-programmed-backend}

အတွက် `bfv-programmed-sha3-256-v1`, အများပြည်သူ parameters ကိုဖုံးအုပ် BFV မှတ်သားချက်
encryption parameters plus hidden-program digest တွေကို ထည့်ပေးပါ

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

လက်ရှိ RAM-FHE Profile က-

| ကွင်း | တန်ဖိုး |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

စာသားတင်သွင်းမှု Torii အဲဒီထဲမှာ ကုဒ်သွင်းထားတယ်။ BFV ပုံးအိတ်
server-side encryption အတွက် deterministic seed က

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

အပြင်ဘက်မှ ပေးပို့သော ကုဒ်သွင်းမှုအတွက် resolver က ID ကို decrypts
envelope နဲ့ ပြန်လည် encrypt လုပ်ပြီး ဒီ deterministic envelope ကို မလုပ်ခင်မှာ
အဲဒီ canonicalization က ရယူချက် hash တွေကို semantically equal မှာ တည်ငြိမ်အောင် ထိန်းထားတယ်။
BFV ကုဒ်စာသားများ။

ပထမဦးဆုံး ကုဒ်သွင်းထားတဲ့ မှတ်ဉာဏ်လမ်းကြောင်းတွေဟာ အောက်ပါကနေ ရတာပါ။

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

လမ်းကြောင်း ၃၂ ခုစီအတွက် ပြေးဆွဲချိန် နမူနာများ_j \in [0,t)\) နဲ့ stores a ကို BFV
ciphertext ကို encrypt လုပ်ခြင်း \(r_j\). ပုန်းကွယ်နေတဲ့ အစီအစဉ်က ကုဒ်သွင်းထားတာကို ပြီးရင် အကောင်အထည်ဖော်တယ်။
မှတ်ပုံတင်များနှင့် ကုဒ်သွင်းထားသော မှတ်ဉာဏ်:

| သင်ကြားချက် | အက္ခရာ |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a) \) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), ပြီးရင် ပြန်တန်းလိုက်ပါ |
| `SelectEqZero(dst, cond, z, nz)` | ပိုးသတ်ခြင်း \(R_{\mathrm{cond}}\); ရွေးချယ်ခြင်း \(R_z\) သုညရှိရင် မဟုတ်ရင် \(R_{nz}\). |
| `Output(src)` | ချိတ်ဆက်ချက် \(R_{\mathrm{src}}\) ထုတ်ကုန် မှတ်ပုံတင်စာရင်းကိုပါ။ |

ညွှန်ကြားချက်အချပ်ကို ပြီးဆုံးပြီးနောက် Resolver က output တစ်ခုစီကို decrypts
မှတ်ပုံတင်၊ 0 ကိုဘိုင်တာအဖြစ် ပြောင်းပြီး ဘိုင်တာတွေကို ချိတ်ဆက်ပေးတယ်။

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

ပရိုဂရမ်လုပ်ထားတဲ့ backend hash တွေက:

$$
\mathrm{opaque\_hash} =
H(D_{\mathrm{program\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash}_{\mathrm{program}} =
H(D_{\mathrm{program\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_hash})
$$

ကြိုတင်ပြင်ဆင်ထားသော ID tape မှာ input slot ၆၄ ခုရှိသည်။
\(i\), input slot ကို load လုပ်ပြီး memory lane ကို load လုပ်တယ်။ \(i \bmod 32\), ဒါတွေကို ထပ်ဖြည့်ပေးတယ်။
ရလဒ်ကို ထုတ်ပေးတယ်။

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### ထုတ်ကုန် hash များနှင့် လက်မှတ်များ {#output-hashes-and-receipts}

ယေဘုယျဆေး RAM-LFE execution receipt က raw output ကို လက်မှတ်မထိုးဘူး။
ထုတ်ကုန် hash:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

အတွက် Torii RAM-LFE execution လက်မှတ်များ, ဆက်စပ်သောဒေတာသည် Canonical
Program Identifier ဘိုက်များ

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

လက်မှတ်ရေးထိုးထားတဲ့ လက်မှတ်အကူအညီက-

$$
R =
(\mathrm{program\_id},
\mathrm{program\_digest},
\mathrm{backend},
\mathrm{verification\_mode},
\mathrm{output\_hash},
\mathrm{associated\_data\_hash},
\mathrm{executed\_at\_ms},
\mathrm{expires\_at\_ms})
$$

အတွက် `signed` Mode:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

စစ်ဆေးချက်က လက်မှတ်ကို `resolver_public_key` ဒါကို ငြင်းပယ်တယ်။
လက်ခံရရှိမှုဆိုသည်မှာ ဒီညီမျှချက်အားလုံးက

$$
R.\mathrm{program\_id} = \mathrm{policy.program\_id}
$$

$$
R.\mathrm{backend} = \mathrm{policy.backend}
$$

$$
R.\mathrm{verification\_mode} = \mathrm{policy.verification\_mode}
$$

$$
R.\mathrm{program\_digest} =
\mathrm{policy.public\_parameters.hidden\_program\_digest}
$$

$$
R.\mathrm{associated\_data\_hash} =
H(N(\mathrm{policy.program\_id}))
$$

ဖုန်းခေါ်ဆိုသူက ထောက်ပံ့တယ်ဆိုရင် `output_hex`, စစ်ဆေးသူကလည်း စစ်ဆေးပါတယ်။

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

အတွက် `proof` mode မှာ သက်သေခံစာမှာ အထောက်အထားအဖုံးအစား
လက်မှတ်။ စစ်ဆေးချက်က သက်သေခံ backend၊ ပတ်လမ်း ID၊
အများပြည်သူ input schema hash၊ verifying key hash နဲ့ exposed public instances တွေ
proof verifier metadata နဲ့ encoded receipt-payload hash ကို match လုပ်ပါ။

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

မျှော်မှန်းထားသော အများပြည်သူဖြစ်ရပ်များမှာ တစ်ခု-element ကိုလံ ၄ ခုဖြစ်သည်။ \(j\)
ဘိုက်များပါဝင်သည် \(h_{8j}\ldots h_{8j+7}\) နောက်မှာ 24 သုည byte:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Identifier ပရိုဂျက် {#identifier-projection}

Identifier Resolution က generic backend ကို မသုံးပါ။ `opaque_hash` ကော်မတီ
အသုံးပြုသူကို မျက်နှာမူထားသော မရှင်းလင်းတဲ့ အကောင့်အမှတ်တံဆိပ်ပါ။ RAM-LFE output hash ကို
Identifier-specific domains များမှတဆင့်:

$$
\mathrm{opaque\_id}_{\mathrm{id}} =
H(D_{\mathrm{id\_opaque}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash})
$$

$$
\mathrm{receipt\_hash}_{\mathrm{id}} =
H(D_{\mathrm{id\_receipt}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash}
\parallel \mathrm{opaque\_id}_{\mathrm{id}})
$$

အန် `IdentifierResolutionReceipt` ပိုမြင့်မားတဲ့ အသုံးဝင် ဝန်ဆောင်မှုတစ်ခုမှာ လက်မှတ်ထိုးထားတယ်။

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

လက်မှတ်ထိုးထားတဲ့ မှတ်သားရေးလက်မှတ်များအတွက်-

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` လက်မှတ် (သို့) အထောက်အထားကို လက်မှတ်ထိုးပြီးသာ လက်ခံရရှိမှုကို လက်ခံပါတယ်။
valid, embedded ကို RAM-LFE အကောင်အထည်ဖော်မှု အသုံးဝင်ဝန်ပိုးက referenced program ကိုက်ညီသည်
မူဝါဒနှင့် `uaid` နှင့် `account_id` ချုပ်ဆိုမှု တောင်းခံနေတာပါ။

## စီမံခန့်ခွဲမှု စီးဆင်းမှု {#execution-flow}

ယေဘုယျဆေး RAM-LFE အပြီးသတ်မှုဟာ ဒီလိုပုံစံမျိုးပါ။

1. အုပ်ချုပ်မှု သို့မဟုတ် လုပ်ငန်းရှင် မှတ်ပုံတင်များ `RamLfeProgramPolicy`.
2. ပိုင်ရှင်က မူဝါဒကို တက်ကြွစေတယ်။
3. Client က Public Policy metadata ကို ဖတ်တယ်။ Torii.
4. Client က Resolver ကို input form တစ်ခုကို ပို့ပေးတယ်
   `input_hex` (သို့) ကုဒ်သွင်းထားတဲ့ BFV input envelope ကိုပါ။
5. Runtime က ပုန်းနေတဲ့ အစီအစဉ်ကို အကဲဖြတ်ပြီး ပြန်ပေးတယ် `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, နှင့် a
   `RamLfeExecutionReceipt`.
6. ဖောက်သည် (သို့) backend က ထုတ်ဝေထားတဲ့ မူဝါဒကို အခြေခံပြီး လက်ခံရရှိမှုကို စစ်ဆေးတယ်။
   ပြန်ပို့ထားတာကို ရွေးချယ်ပြီး စစ်ဆေးခြင်း `output_hex` လက်မှတ်အတွက် hashes
   `output_hash`.
7. အဆင့်မြင့် သင်ကြားမှုတစ်ခု၊ ဥပမာ `ClaimIdentifier`, ကိုထည့်သွင်းနိုင်ပါတယ်
   ရိုးရိုး အချက်အလက်ကို ထည့်သွင်းခြင်းအစား လက်မှတ်ထိုးလက်ခံရရှိမှုပါ။

```mermaid
flowchart LR
    client["Wallet or application"] --> policy["Read program policy"]
    policy --> input["Normalize and optionally encrypt input"]
    input --> torii["Torii RAM-LFE runtime"]
    torii --> eval["Hidden evaluator"]
    eval --> receipt["Output and execution receipt"]
    receipt --> verify["Client or ledger verifies receipt"]
    verify --> claim["Use receipt in higher-level flow"]
```

## မှတ်သားရေး မူဝါဒများ {#identifier-policies}

Identifier မူဝါဒများသည် RAM-LFE. သူတို့ဟာ လုပ်ငန်းတစ်ခု ထပ်ဖြည့်ပေးကြတယ်။
နာမည်နေရာနှင့် ပုံမှန်ပြုပြင်ခြင်း စည်းမျဉ်းကို ယေဘုယျ အစီအစဉ် မူဝါဒတစ်ခုအပေါ်မှာ ထည့်သွင်းထားသည်

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "<POLICY_OWNER>",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "phone#team",
  owner = "<POLICY_OWNER>",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "phone#team")
```

Identifier layer က RAM-LFE လက်မှတ်ကို ချုပ်ဆိုရန်:

- `policy_id`
- လျှို့ဝှက် လုပ်ဆောင်ချက်မှ ရယူသော မရှင်းလင်းတဲ့ မှတ်သားစရာ
- အချိုးသတ်ချက် `receipt_hash`
- အကောင့်က UAID
- တရားဝင် `account_id`
- ယေဘုယျဆေး RAM-LFE အကောင်အထည်ဖော်မှု အသုံးဝင် ဝန်ဆောင်မှု

သုံးစွဲသူကို ဦးတည်တဲ့ Onboarding အတွက် Account အမည်တွေကို Private နဲ့ သီးခြားထားပါ။
အမည်မဖော်လိုသူတွေဟာ အများပြည်သူရဲ့ နာမည်တွေ၊ ဖုန်းနံပါတ်၊ အီးမေးလ်လိပ်စာတွေနဲ့
အလားတူတန်ဖိုးတွေဟာ မှတ်သားရေး မူဝါဒတွေနဲ့ လက်မှတ်တွေကနေ စီးဆင်းသင့်ပါတယ်။

## Torii လမ်းကြောင်းများ {#torii-routes}

app ကို မျက်နှာပြုတဲ့ လမ်းကြောင်း မိသားစုကို ဖွင့်လိုက်တဲ့အခါ Torii ထုတ်လွှင့်ချက်များ RAM-LFE နှင့်
အထောက်အပံ့များ:

| လမ်းကြောင်း | ရည်ရွယ်ချက် |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | တက်ကြွပြီး မတက်ကြွတဲ့ စာရင်း RAM-LFE အစီအစဉ် မူဝါဒများနှင့် အများပြည်သူ အကောင်အထည်ဖော်မှု metadata များ။ |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | Program တစ်ခုကို Run လုပ်ပါ။ `input_hex` ဒါမှမဟုတ် `encrypted_input` ပြီးတော့ ထုတ်ကုန် hash တွေကို ပြန်ပို့ပေးပြီး နိုင်ငံမဲ့ လက်မှတ်တစ်စောင် ပေးပါ။ |
| `POST /v1/ram-lfe/receipts/verify` | စစ်ဆေးပါ `RamLfeExecutionReceipt` ထုတ်ပြန်ထားသော မူဝါဒကို နှိုင်းယှဉ်ပြီး ရွေးချယ်မှုတစ်ခုခုနဲ့ ယှဉ်ကြည့်ပါ။ `output_hex` သို့ `output_hash`. |
| `GET /v1/identifier-policies` | စာရင်းမှတ်သားရေး မူဝါဒများ၊ ပုံမှန်ပြုလုပ်မှု mode များ၊ resolver key များနှင့် encrypted-input metadata များ။ |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | အသုံးပြုသူက ထည့်သွင်းနိုင်မယ့် လက်မှတ်ကို ထုတ်ပေးပါ `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | Active Claim ရှိပါက ချိတ်ဆက်ထားသောစာရင်းသို့ ပုံမှန်မှတ်သားချက်သွင်းမှုကို ဖြေရှင်းပါ။ |
| `GET /v1/identifiers/receipts/{receipt_hash}` | စစ်ဆေးရေးနှင့် ထောက်ပံ့ရေး ကိရိယာများအတွက် လက်မှတ် hash ဖြင့် persisted identifier claim ကိုရှာပါ။ |

အမြဲတမ်း ရည်မှန်းထားတဲ့ node တွေကို စစ်ကြည့်ပါ။ `/openapi` ဒါမှမဟုတ် `/openapi.json` အရင်စာရွက်စာတမ်း
ဒီလမ်းကြောင်းတွေကို ဆောက်လုပ်ခြင်း။ ရရှိနိုင်မှုက node build နဲ့
ကွန်ယက် ပရိုဖိုင်း

## Node Runtime {#node-runtime}

Torii လုပ်နေဆဲပါ။ RAM-LFE Runtime ကို အောက်မှာ သတ်မှတ်ထားပါတယ်
`torii.ram_lfe.programs[*]`, keyed by `program_id`. ဖွဲ့စည်းထားသော အစီအစဉ်တိုင်း
ချိတ်ဆက်ထားသော မူဝါဒ commitment ကို လိုက်ဖက်အောင်လုပ်ပြီး runtime ကိုပေးရပါမယ်။
လက်မှတ်များကို အကဲဖြတ်ပြီး သက်သေခံရန် လိုအပ်သော ပစ္စည်းများ
Runtime တစ်ခုတည်း၊ သီးခြား Identifier-Resolver configuration ကို မလိုပါ။
မျက်နှာပြင်။

ချိတ်ဆက်ထားသော မူဝါဒကို မှတ်ပုံတင်ခြင်းသည် ၎င်းဘာသာ မလုံလောက်ပါ။ ရည်မှန်းချက် node သည်
လမ်းကြောင်းမိသားစုကိုလည်းဖေါ်ပြပြီး runtime ကိုက်ညီတဲ့ပစ္စည်းရှိပါတယ်
စီမံကိန်းတွေ လုပ်ဆောင်ဖို့ မျှော်လင့်ထားတယ်။

## လုပ်ဆောင်မှုစောင့်ရှောက်ရေး ရထားများ {#operational-guardrails}

- မူဝါဒတွေကို မလုပ်ဆောင်နိုင်အောင် မှတ်ပုံတင်ပါ၊ အများပြည်သူရဲ့ metadata ကို စစ်ဆေးပြီး ဒါတွေကို တက်ကြွပါ။
- အကဲဖြတ်သူရဲ့ လျှို့ဝှက်ချက်တွေကို ပုန်းထားပါ၊ Resolver လက်မှတ်ထိုးတဲ့ သော့တွေ၊ BFV လျှို့ဝှက်ချက်
  စာရွက်စာတမ်းတွေ၊ မှတ်စုတွေ၊ ငွေကြေးဆိုင်ရာ ကိစ္စရပ်တွေနဲ့ ဖောက်သည်တွေထဲက ပစ္စည်းတွေပါ။
- Account aliases, transaction metadata တွေမှာ raw identifier တွေ မထည့်ပါနဲ့။
  ဖြစ်ရပ်တွေ (သို့) ကမ္ဘာ့နိုင်ငံနယ်ပယ်တွေပါ။
- အဆင့်မြင့် ညွှန်ကြားချက်တွေ မပို့ခင် လက်မှတ်တွေကို ဖောက်သည်ဘက်က စစ်ဆေးပါ။
  ဘယ်အချိန်မှာ SDK စစ်ဆေးသူကို ဖေါ်ထုတ်ပေးတယ်။
- သက်တမ်းကုန်ဆုံးတဲ့ ကွင်းတွေကို သုံးပါ၊ ရှေးဟောင်းလက်မှတ်တွေဟာ ထာဝရ မတည်ငြိမ်သင့်ပါဘူး။
- Program အသစ် (သို့) ID မူဝါဒသစ်ကို မှတ်ပုံတင်ရင်း၊ ရွှေ့ပြောင်းတဲ့ ဖောက်သည်များဖြင့် Rotate လုပ်ပါ။
  ငွေကြေး အသစ်တွေ ရလာတာနဲ့ မူဝါဒဟောင်းကို ပိတ်လိုက်မယ်။

## ဆက်စပ်သော အကြောင်းအရာများ {#related-topics}

- [ပုဂ္ဂလိက ဒေတာနေရာအတွက် ထောက်ပံ့မှု အခွန်များ](/my/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii နောက်ဆုံးအချက်များ](/my/reference/torii-endpoints.md#app-and-sora-route-families)
- [အမည်မသိ ငွေပေးချေမှု](/my/blockchain/anonymous-transactions.md)
