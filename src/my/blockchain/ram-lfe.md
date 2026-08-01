---
translation_locale: my
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE သည် Random-Access Machine Laconic Function Evaluation ကိုဆိုလိုသည်။ Iroha တွင်၎င်းသည် အများပြည်သူ၏မူဝါဒများကချိတ်ဆက်ထားသောပရိုဂရမ်များအတွက် ယေဘုယျလျှို့ဝှက်လုပ်ဆောင်ချက်လွှာဖြစ်သော်လည်း ၀ င်ရောက်ရှိမှုများကိုကမ္ဘာနိုင်ငံသို့မရေးသားသင့်ပါ။ ၎င်းကို SORA Nexus ကိုယ်ပိုင်ဖုန်း (သို့) အီးမေးလ်ရှာဖွေရေးလို ID စီးဆင်းမှုများမှ အသုံးပြုပြီး node profile တစ်ခုက app ကို မျက်နှာမူတဲ့ လမ်းကြောင်းများကို enable လုပ်တဲ့အခါမှာ ယေဘုယျ Torii ပရိုဂရမ် အကူအညီအဖြစ်လည်း ထုတ်ဖော်နိုင်သည်။

ကွင်းဆက်က မူဝါဒဆိုင်ရာ တာဝန်ယူမှုနှင့် လက်မှတ်အတည်ပြုမှု metadata ကို သိမ်းဆည်းထားသည်။ Resolver သို့မဟုတ် Torii runtime သည်ပုန်းကွယ်သော အစီအစဉ်ကို အကဲဖြတ်ပြီး ခွင့်ပြုချက်ရှိ output ကိုသာပြန်လည်ပို့ပေးပြီး ဖောက်သည်များ၊ ထောက်ပံ့ရေး tooling သို့မဟုတ် ledger ညွှန်ကြားချက်များကို မှတ်ပုံတင်မူဝါဒနှင့်ယှဉ်၍ စစ်ဆေးနိုင်သည့်လက်မှတ်တစ်စောင်ကို ချိတ်ဆက်တယ်။

## အမည်ပေးခြင်း {#naming}

နာမည်ခွဲခြားချက်က အရေးပါပါတယ်။

|သက်တမ်း |အဓိပ္ပါယ်|
| --- | --- |
|`ram_lfe` |ပြင်ပ လျှို့ဝှက်လုပ်ဆောင်မှု abstraction: ပရိုဂရမ်မူဝါဒများ၊ ကတိပေးချက်များ၊ အကောင်အထည်ဖော်မှုလက်မှတ်များနှင့် လက်မှတ်စစ်ဆေးခြင်း mode ကို။ |
|`BFV` |Brakerski/Fan-Vercauteren ကို encrypted input RAM-LFE backends တွေနဲ့ အသုံးပြုတဲ့ homomorphic encryption scheme ပါ။ |
|`ram_fhe_profile` |Programmed encrypted execution machine အတွက် BFV သီးသန့် metadata ပါ။ ဒါက RAM-LFE ရဲ့ ဒုတိယအမည်မဟုတ်ဘူး။ |

ဒေတာပုံစံမှာ `RamLfeProgramPolicy` နှင့် `RamLfeExecutionReceipt` ရှိသည် RAM-LFE အမျိုးအစားတွေပေါ့။ BFV parameters, encrypted text envelopes တွေနဲ့ ပုန်းနေတဲ့ RAM-FHE ပရိုဂရမ်ပရိုဖိုင်ဟာ မူဝါဒတစ်ခုမှာ အသုံးပြုတဲ့ encrypted-executing backend ကိုပါ ပါဝင်ပါတယ်။

## မှတ်တမ်းတင်ချက်များ {#what-it-records}

RAM-LFE အစီအစဉ် မူဝါဒကို ကမ္ဘာအနှံ့မှာ `program_id` က မှတ်ပုံတင်ထားပြီး မူဝါဒမှာ အောက်ပါအချက်တွေ ပါဝင်ပါတယ်။

- မူဝါဒကို တက်ကြွ၊ ပိတ်ပင် (သို့) အခြားနည်းဖြင့် ပြောင်းလဲနိုင်သော ပိုင်ရှင်စာရင်း
- ဖောက်သည်များအား ကြော်ငြာထားသော backend
- လက်မှတ်စစ်ဆေးမှုပုံစံ `signed` သို့မဟုတ် `proof`
- လျှို့ဝှက်ထားတဲ့ ပရိုဂရမ် metadata နဲ့ အကဲဖြတ်သူလျှို့ဝှက်ချက်အတွက် ရည်စူးမှု
- လက်မှတ်ရေးထိုးထားတဲ့လက်မှတ်များအတွက် Resolver အများသုံးသော့
- BFV ပမာဏများနှင့် `ram_fhe_profile` ကဲ့သို့သော ရွေးချယ်စရာ အများပြည်သူ လျှို့ဝှက်သွင်းမှု metadata များ။
- `active` လိပ်ပြာက မူဝါဒက လက်မှတ်အသစ်တွေ ထုတ်ပေးနိုင်လားဆိုတာ ထိန်းချုပ်တယ်။

ပုန်းကွယ်သော လျှို့ဝှက်ချက်၊ ပွင့်လင်းစာသားအမှတ်တံဆိပ်တန်ဖိုးနှင့် ပုန်းကွယ်သည့်ပရိုဂရမ်ခန္ဓာကို ကမ္ဘာအခြေအနေတွင် သိမ်းထားခြင်းမရှိပါ။ ဖောက်သည်များသည် ကတိပေးချက်များ၊ မရှင်းလင်းတဲ့ ဟက်ရှ်များ၊ လက်ခံရရှိမှု ဟတ်ရှ်များ, ကုဒ်စာသားများနှင့် ပရိုဂရမ်း digests များကို မရှင်းလင်းသော ပရိုဂရပ်စ်တန်ဖိုးများအဖြစ် සලකා බැලිය යුතුය။

## နောက်ခံသတင်းများ {#backends}

လက်ရှိ RAM-LFE ထောက်ပံ့မှုက backend identifiers သုံးခုကို ဗဟိုပြုထားတာပါ။

|Backend |အသုံးပြုခြင်း |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |ကတိပြုချက်ချမှတ်ထားသော PRF အကဲဖြတ်မှု။ |
|`bfv-affine-sha3-256-v1` |BFV ထောက်ပံ့ထားတဲ့ လျှို့ဝှက် အချိတ်အနှီး အကဲဖြတ်မှု ကုဒ်သွင်းထားတဲ့ မှတ်သားစရာ slot တွေမှာ။|
|`bfv-programmed-sha3-256-v1` |BFV ကိုထောက်ပံ့ထားတဲ့ ပရိုဂရမ်လုပ်တဲ့ အကောင်အထည်ဖော်မှုက ကုဒ်သွင်းထားတဲ့ မှတ်ပုံတင်တွေနဲ့ မှတ်ဉာဏ်လမ်းကြောင်းတွေပေါ်မှာပါ။ |

ID မူဝါဒများအတွက် BFV ပရိုဂရမ်ပြု backend သည် အရေးကြီးသော ခေတ်မီလမ်းကြောင်းဖြစ်သည်။ ၎င်းသည် Wallet များကို ပုံမှန်ဝင်ရောက်မှုများကို ဒေသတွင်းတွင် ကုဒ်သွင်းခွင့်ပေးသည်။ ငွေချေးမှုလုပ်ငန်းစဉ်တွင် အများပြည်သူအမှတ်တံဆိပ်ကိုမမြင်ဘဲ resolver ကို အကဲဖြတ်နိုင်စေသည်။ ရလဒ် hash ကို မှတ်ပုံတင်ထားတဲ့ ပရိုဂရမ် မူဝါဒနဲ့ ချိတ်ဆက်တဲ့ လက်မှတ်ကို ပြန်ပို့တယ်။

## သင်္ချာ {#math}

ဤအပိုင်းသည် လက်ရှိ RAM-LFE ကုဒ်ဖြင့်အသုံးပြုသော အကောင်အထည်ဖော်မှုအဆင့် အက္ခရာကိုဖော်ပြသည်။ ဒါဟာလုံခြုံရေးသက်သေမဟုတ်ပေ။ မူဝါဒများ၊လက်မှတ်များနှင့်ဖောက်သည်များသည် သဘောတူညီရန်လိုအပ်သည့် သတ်မှတ်ချက်စာရင်းနှင့်ကုဒ်သွင်းထားသောတန်ဖိုးဖြတ်ခြင်းပုံစံဖြစ်သည်။

### မှတ်ချက်တင်ခြင်း {#notation}

ခွင့်ပြုပါ။

- Iroha `Hash::new(m)`: Blake2b-32 over `m` ဖြစ်ပြီး နောက်ဆုံး byte ရဲ့ အနည်းဆုံး သိသာတဲ့ bit ကို `1` သို့ တွန်းပို့ပေးတယ်။
- \(N(x)\) သည် `x` ၏ Canonical Norito ကုဒ်ဖြစ်ရမည်။
- \(a \parallel b\) byte-string concatenation ကိုဆိုလိုပါတယ်။
- \(\operatorname{le64} ((i)\) သည် လက်မှတ်မထိုးသေးတဲ့ အလုံးတစ်လုံး၏ 8-byte အသေးအမွှား encoding ကိုဖြစ်ရမည်။
- \(s\) ပြင်ပကမ္ဘာနိုင်ငံမှာ ထိန်းသိမ်းထားတဲ့ လျှို့ဝှက်ချက် ဖြေရှင်းသူဖြစ်ဖို့။
- \(P\) ပြည်သူ့မူဝါဒ ပမာဏတွေဖြစ်ဖို့ပါ။
- \(A\) နှင့် ဆက်စပ်သော အချက်အလက်များကို တောင်းဆိုပါ။
- \(x\) ကို ပုံမှန် input bytes သို့မဟုတ် Norito ကုဒ်သွင်းထားတဲ့ encrypted-input envelope ကို backend အပေါ် မူတည်ပြီး ဖြစ်စေ။

RAM-LFE သည်ဒိုမင်ခွဲခြားသော hash များကိုအသုံးပြုသည်။ အောက်ပါ ပုံသေနည်းများသည်ဒိုမိုင်းများကိုရည်ရွယ်ချက်အရအမည်ပေးထားသည်၊ ၎င်းတို့၏လက်ရှိ byte string များမှာ:

|သင်္ကေတ |Domain string ကို|
| --- | --- |
|\(D_{\mathrm{policy}}\) |`iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{secret}}\) |`iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{salt}}\) |`iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_opaque}}\) |`iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_receipt}}\) |`iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{opaque}}\) |`iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{receipt}}\) |`iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{affine\_circuit}}\) |`iroha.ram_lfe.bfv_affine.circuit.v1` |
|\(D_{\mathrm{affine\_opaque}}\) |`iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
|\(D_{\mathrm{affine\_receipt}}\) |`iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
|\(D_{\mathrm{program\_memory}}\) |`iroha.ram_lfe.bfv_program.memory.v1` |
|\(D_{\mathrm{program\_opaque}}\) |`iroha.ram_lfe.bfv_program.opaque_hash.v1` |
|\(D_{\mathrm{program\_receipt}}\) |`iroha.ram_lfe.bfv_program.receipt_hash.v1` |
|\(D_{\mathrm{program\_digest}}\) |`iroha.ram_lfe.bfv_program.digest.v1` |
|\(D_{\mathrm{output}}\) |`iroha.ram_lfe.output_hash.v1` |
|\(D_{\mathrm{id\_opaque}}\) |`iroha.ram_lfe.identifier.opaque_hash.v1` |
|\(D_{\mathrm{id\_receipt}}\) |`iroha.ram_lfe.identifier.receipt_hash.v1` |
|\(D_{\mathrm{bfv\_keygen}}\) |`iroha.crypto.fhe.bfv.keygen.v1` |
|\(D_{\mathrm{bfv\_encrypt}}\) |`iroha.crypto.fhe.bfv.encrypt.v1` |
|\(D_{\mathrm{id\_keygen}}\) |`iroha.crypto.fhe.bfv.identifier.keygen.v1` |
|\(D_{\mathrm{id\_slot}}\) |`iroha.crypto.fhe.bfv.identifier.slot.v1` |

### မူဝါဒ ကတိပြုချက် {#policy-commitment}

မူဝါဒ ကတိကဝတ်တစ်ခုဟာ အများပြည်သူသတ်မှတ်ချက်တွေနဲ့ ပိတ်ထားတဲ့ လျှို့ဝှက် resolver ကို backend တစ်ခုနဲ့ ချည်နှောင်တယ်။ ပထမဦးဆုံးအနေနဲ့ လျှို့၀ှက်မှုကို သီးခြားချည်နှောင်ပါတယ်။

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

အဲဒီနောက်မှာ မူဝါဒရဲ့ အပြည့်အစုံကို ကုဒ်သွင်းလိုက်ပါတယ်။

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

ပြီးတော့ ထုတ်ဝေထားတဲ့ မူဝါဒ hash ကတော့

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

ချိတ်ဆက်ထားသော `PolicyCommitment` သည်:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

အကဲဖြတ်မှုက runtime လျှို့ဝှက်ချက်ကနေ တူညီတဲ့တန်ဖိုးကိုပြန်တွက်တယ်။ ပြန်တွက် hash ကွာခြားရင် အကဲဖြတ်မှုဟာ commitment မလိုက်ဖက်မှုကြောင့် ကျရှုံးပါတယ်။

### HKDF-SHA3-512 Backend {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1` အတွက်ထုတ်ကုန်သည် ပုံမှန်ဝင်ရောက်မှုတစ်ခုတည်းဖြစ်သည်၊ သို့သော် opaque identifier နှင့်လက်မှတ် hash သည် လျှို့ဝှက်ချည်နှောင်ထားသော PRF ထုတ်ကုန်များဖြစ်သည်။

တောင်းဆိုချက်စာရင်းက-

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF ဆားနဲ့ pseudorandom key တွေက-

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

opaque ပစ္စည်းကို ကျယ်ပြန့်ပြီး hashed:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

လက်ခံရရှိမှုပစ္စည်းက ပွင့်လင်းမြင်သာမှုမရှိတဲ့ ID ကို ထပ်ပြီး ချိတ်ဆက်ပေးပါတယ်။

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

Backend ကပြန်လာတယ်

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV ထုံးစံ {#bfv-primer}

BFV သည် ကျော့ကွင်းအခြေခံ homomorphic encryption scheme တစ်ခုဖြစ်သည်။ "homomorphic" ဆိုသည်မှာ ပရိုဂရမ်တစ်ခုသည် encrypted values များကိုထည့်သွင်းနိုင်ပြီး မြှောက်နိုင်ခြင်းဖြစ်ပြီး decryption ပြီးနောက် plaintext တန်ဖိုးများပေါ်တွင် additions နှင့် multiplications များကိုလုပ်ခဲ့ပါကတူညီသော ရလဒ်ကိုရရှိနိုင်သည်။

RAM-LFE အတွက်တော့ BFV ကို encrypted input mechanism အဖြစ် အသုံးပြုပါတယ်။

1. ငွေကြေးအိတ်ဟာ ဖုန်းနံပါတ် (သို့) အီးမေးလ်လိပ်စာလို ပုဂ္ဂလိကတန်ဖိုးကို ပုံမှန်ဖြစ်စေတယ်။
2. ပိုက်ဆံအိတ်က ဘိုင်က်တွေကို အလုံးစုံပေါက်လေးတွေအဖြစ် ပြောင်းပေးတယ်။
3. slot တစ်ခုစီကို resolver ရဲ့ public key BFV နဲ့ encrypt လုပ်ထားတယ်။
4. Resolver Runtime က အဲဒီ ကုဒ်စာသားတွေကို သုံးပြီး ပုန်းနေတဲ့ အစီအစဉ်ကို အကဲဖြတ်တယ်။
5. Runtime က ပုန်းကွယ်နေတဲ့ အစီအစဉ် ထုတ်ကုန်ကိုသာ ဖေါ်ထုတ်ပေးပြီး လက်မှတ်ထိုးတာ (သို့) လက်ခံလက်မှတ်ကို သက်သေပြတယ်။

BFV ဟာ တိကျတဲ့ အလုံးစုံ သင်္ချာပါ၊ နီးစပ်တဲ့ သင်္ချာမဟုတ်ဘူး။ ဒါကြောင့် ၎င်းဟာ floating-point model inference ထက် identifier byte နဲ့ အသေးစား modular computations တွေအတွက် ပိုတော်ပါတယ်။ အတွင်းမှာ Iroha current ကို BFV အသုံးပြုမှု, သွယ်ဝှက် slot တစ်ခုစီကို scalar တန်ဖိုး modulo ကိုဆောင်ထားပါတယ် \(t\), သာမန်အားဖြင့် ဘိုင်တာ (သို့) ဘိုင်တာအလျားကွင်းပါ။ ပိုးမွှားစာသားကိုယ်တိုင်က အများကြီး ပိုကြီးတဲ့ integer \(q\) ကို modulo လုပ်နေတာပါ။ အကြားက ကွာဟချက် \(q\) နှင့် \(t\) encryption နှင့် homomorphic operation များအတွက်အသံကို decryption နေရာပေးသည် မိတ်ဆက်ပေးပါ။

BFV ကုဒ်စာသားမှာ polynomial အစိတ်အပိုင်း နှစ်ခုရှိပါတယ်။

$$
c=(c_0,c_1)
$$

လျှို့ဝှက်သော့က နောက်ထပ် polynomial \(s_k\) ပါ။ decryption က အောက်ပါ အစိတ်အပိုင်းတွေကို ပေါင်းစပ်ပေးပါတယ်။

$$
v = c_0 + c_1s_k
$$

\(v\) သည် scaleed plaintext နှင့် နီးစပ်သည်။ Rounding က plaintext ကိုက်ညီမှု modulo \(t\) ကိုပြန်လည်ရရှိစေသည်။ အသုံးဝင်သော ဂုဏ်သတ္တိက ciphertext လုပ်ဆောင်ချက်များသည်ဤဖွဲ့စည်းမှုကို ထိန်းသိမ်းထားခြင်းဖြစ်သည်။

|ရိုးရှင်းတဲ့ လုပ်ဆောင်ချက် |ကုဒ်စာသား လုပ်ဆောင်ချက် |
| --- | --- |
|\(m+n\) |ကုဒ်စာသား အစိတ်အပိုင်းတွေ ထည့်ပါ။ |
|\(m+\alpha\) |\(c_0\) ကို scale လုပ်ထားတဲ့ plaintext ကိန်းသေကို ထည့်ပါ။ |
|\(\alpha m\) |စာလုံးဝှက်စာသား အစိတ်အပိုင်း နှစ်ခုစလုံးကို \(\alpha\) နဲ့ scale လုပ်ပါ။ |
|\(mn\) |ciphertext polynomials တွေကို မြှောက်ပြီး ပြန်ချဲ့လိုက်၊ နောက်ပြန်တန်းတင်လိုက်|

မြှောက်ခြင်းသည် စျေးကြီးသော လုပ်ငန်းစဉ်ဖြစ်သည်။ နှစ်ခုပါဝင်သော ကုဒ်စာသားများ၏ ထုတ်ကုန်တစ်ခုက သဘာဝအတိုင်း \(1\), \(s_k\) နှင့် \(s_k^2\) ဖြင့် decrypts လုပ်သော သုံးခုပါဝင်သောကုဒ်စာသားကို ဖန်တီးသည်။ Relinearization သည် \(s_k^2\) စာလုံးကို ပုံမှန် ၂ ဖွဲ့သော ကုဒ်စာသားအဖြစ် ပြန်လည်ထည့်ရန် ထုတ်ဝေထားသည့် အကဲဖြတ်ချက် သော့ကို အသုံးပြုသည်။ ထိုနည်းဖြင့် နောက်ပိုင်းတွင် ထပ်ပေါင်းခြင်းများနှင့် မြှင့်တင်မှုများကို တူညီသော ကုဒ် စာသားပုံစံဖြင့် ထိန်းသိမ်းနိုင်သည်။

BFV သည်လည်း "leveled" ဖြစ်သည် - ကုဒ်သွင်းထားသော လုပ်ဆောင်ချက်တိုင်းမှာ ဆူညံမှု ဘတ်ဂျက်တစ်ချို့ကို စားသုံးသည်။ ဤလုပ်ဆောင်မှုက ဒီဘတ်ဂျက်ကို အသစ်ပြန်လည်ဆန်းသစ်ဖို့ ciphertexts ကို bootstrap မလုပ်ပါ။ ဒီအစား, RAM-LFE ကသေးငယ်တဲ့ `ram_fhe_profile` ကိုထုတ်ဝေပြီးသတ်မှတ်ထားတဲ့ ပုန်းကွယ်သောပရိုဂရမ်ပုံစံတစ်ခုသာလက်ခံသည်။ အဆိုပါ parameters set ၏ supported depth အတွင်းတွင်အကဲဖြတ်မှုကိုထိန်းသိမ်းထားသည်။ လက်ရှိပရိုဂရမ်ပြုလုပ်ထားသော profile သည် fixed register count, fixed memory-lane count နှင့် programmed step တစ်ခုလျှင် အများဆုံး ciphertext-ciphertext မြှောက်ခြင်းများကိုခွင့်ပြုပါသည်။

RAM-LFE ဒီဇိုင်းမှာ BFV က client input ကို အများပြည်သူ ledger ဒေတာကနေနဲ့ ငွေပေးချေမှု (သို့) လမ်းကြောင်း အသုံးဝင်ဝန်ဆောင်မှုကိုသာမြင်တဲ့ လေ့လာသူတွေကနေ ပုန်းကွယ်ထားတယ်။ ဒါကကွင်းဆက်ဟာ အလိုလို ကုဒ်သွင်းထားတဲ့ အစီအစဉ်တွေကို ကိုယ်တိုင်လုပ်ဆောင်တာ မဆိုလိုပါဘူး။ Torii Resolver Runtime သည် BFV လျှို့ဝှက်ပစ္စည်းကို ပိုင်ဆိုင်နေဆဲဖြစ်ပြီး၊ ဖွဲ့စည်းထားသော ပုန်းကွယ်သောအစီအစဉ်ကို အကဲဖြတ်ပြီး ခွင့်ပြုသည့်ထွက်ကုန်များကို ဖော်ထုတ်ကာ ရလဒ်ကို သက်သေထူပြသည်။ နောက်တော့ Ledger ကအကန့်သတ်ချက်များကို စစ်ဆေးပြီး on-chain မူဝါဒဆိုင်ရာ တာဝန်ယူမှုနှင့်ပတ်သက်၍ သက်သေခံမှုကိုစစ်ဆေးပြီး အများသုံးကျော့ (သို့မဟုတ်) အထောက်အထား metadata ကို Resolver ပြုလုပ်သည်။

Identifier အသုံးပြုမှု ကိစ္စက ရည်ရွယ်ချက်အရ ရိုးရှင်းတဲ့ ကိုယ်စားပြုချက်ကို ရွေးချယ်တယ်။ ပုံမှန်လုပ်ထားတဲ့ string ကို အောက်ပါအတိုင်း ကုဒ်သွင်းထားတာပါ။

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

အစိတ်အပိုင်းတိုင်းကို ၎င်း၏ ကိုယ်ပိုင် BFV scalar ciphertext အဖြစ် encrypt လုပ်ထားသည်။ ထိုပုံစံက ပုံမှန်ပြုလုပ်ခြင်းနှင့် envelope validation ကိုရှင်းလင်းစေသည်၊ ငွေအိတ်များကို အများပြည်သူသတ်မှတ်ချက်များမှ encrypted request များကိုတည်ဆောက်ခွင့်ပေးပြီး resolver သည် stable receipt transcript တစ်ခုသို့ညီမျှသော encrypt input များကို canonicalize လုပ်နိုင်သည်။

### BFV လက်စွပ်ပုံစံ {#bfv-ring-model}

BFV backends တွေမှာ negacyclic polynomial ring ကို သုံးပါတယ်။

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

ပြီးတော့ ရိုးရှင်းတဲ့ စာသားကြိုး:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

ဘယ်နေရာမှာ:

- \(n\) သည် `polynomial_degree` ဖြစ်သည်၊ စွမ်းအား ၂
- \(q\) သည် `ciphertext_modulus` ဖြစ်သည်။
- \(t\) သည် `plaintext_modulus` ဖြစ်သည်။
- \(q > t\) နှင့် \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Plaintext ကော်ဖစ်ကိန်း vectors တွေကို ကော်ဖိတ်ကိန်းတစ်ခုစီကို scale လုပ်ပြီး ကုဒ်သွင်းပေးပါတယ်။

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

decryption center-lifts ကို coefficient တစ်ခုစီကို:

$$
v = c_0 + c_1 s_k \in R_q
$$

နောက်ပြီး \(R_t\) သို့ ပြန်လည်ထည့်သွင်းပါ

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

ဒီမှာ \(s_k\) အဲဒါက BFV လျှို့ဝှက်သော့ polynomial အပြင်ဘက်မဟုတ်ဘဲ RAM-LFE resolver လျှို့ဝှက်ချက် \(s\).

### BFV အဓိကမျိုးဆက် {#bfv-key-generation}

BFV key material ကို encrypted identifier input အတွက် resolver secret နဲ့ associated data တစ်ခုချင်းစီအတွက် deterministic ဖြစ်စေပါတယ်။

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG ကို အောက်ပါအတိုင်း မျိုးစေ့စိုက်ပါ။

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

အဓိက generator နမူနာများ:

- \(s_k \in \{-1,0,1\}^n\) ကို Modulo \(q\) အဖြစ် တင်ပြထားသည်။
- \(a \leftarrow R_q\) တစ်ပုံစံတည်း
- \(e \in \{-1,0,1\}^n\)

အများသုံး သော့က-

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

\(R_q\) ထဲက ကြိုးထုတ်ကုန်အဖြစ် \(s_k^2\) ကို ပြန်လည်ချိတ်ဆက်ရန်။ အခြေခံ-\(B\) ဂဏန်းတိုင်းအတွက် \(j\) အတွက်၊ အသေးစားဖြန့်ဝေမှုမှ နမူနာ \(a_j\) ကို တစ်ပုံစံတည်းနဲ့ \(e_j\) ကို ထုတ်ယူပြီး နောက်မှာ ဖော်ပြပါ:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

ပြည်သူလူထု BFV မူဝါဒ metadata များမှာ public key ကိုပါ ၀ င်သည်။ `max_input_bytes`. နိုင်ငံတကာ BFV လျှို့ဝှက်သော့နဲ့ relinearization key တွေဟာ Resolver Runtime မှာ ရှိနေတုန်းပါ။

### BFV ကုဒ်သွင်းခြင်းနှင့် လုပ်ဆောင်ချက်များ {#bfv-encryption-and-operations}

Plaintext polynomial \(m\) ကို encrypt လုပ်ဖို့ အကောင်အထည်ဖော်မှု မျိုးစေ့က နောက်ထပ် ChaCha20 RNG တစ်ခုကို:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

\(u,e_1,e_2 \in \{-1,0,1\}^n\) ကို နမူနာယူပြီး တွက်ချက်တယ်။

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

ကုဒ်စာသားက \(c=(c_0,c_1)\) ပါ။

ဟိုမိုမော်ဖစ် ပေါင်းထည့်ခြင်းသည် အစိတ်အပိုင်းဆိုင်ရာ အသိပညာရှိသည်:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

လတ်တလောစာသား scalar \(\alpha\) ကို coefficient zero changes only \(c_0\) သို့ ထည့်သွင်းခြင်း။

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Plaintext scalar \(\alpha\) ဖြင့် မြှောက်ခြင်းအားဖြင့် အစိတ်အပိုင်း နှစ်ခုစလုံးကို ကျယ်ပြန့်စေသည်-

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

c_0,c _1)\) နှင့် \(d=(d_0,d_1)\) အတွက်၊ ပိုးမွှားစာသား မြှောက်ခြင်းသည် အရွယ်အစားသုံးခုပါတဲ့ ပိုးမႊားစာသားကို ပထမဦးဆုံး တွက်ချက်ပြီး ကော်ဖိုင်နန်းတစ်ခုစီကို \(t/q\) ဖြင့် ပြန်လည်တွက်ပေးသည်။

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

အထက်ပါထုတ်ကုန်အားလုံးသည် \(R_q\) တွင်နေဂါသကလစ်ကြိုးထုတ်ကုန်များဖြစ်ပါသည်။ ထို့နောက် \(\tilde c_2\) ကိုအခြေခံ-\(B\) များစွာကိန်းများအဖြစ်ခွဲခြားသည်။

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

ရလဒ်က နှစ်ခုပါဝင်တဲ့ BFV ကုဒ်စာပေပါ။

### Identifier ကုဒ်စာသားအဖုံး {#identifier-ciphertext-envelope}

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

`max_input_bytes + 1` အထိရှိပြီး ကျန်တဲ့ slot တွေအားလုံးဟာ သုညပါ။ scalar slot တစ်ခုစီကို coefficient-zero plaintext polynomial \([m_i]\) အဖြစ် encrypt လုပ်ထားတာပါ။

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

လျှို့ဝှက်မှတ်သားရေးအဖုံးက:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

\(M=\mathrm{max\_input\_bytes}\) ရှိသည်။

### BFV Affine Backend {#bfv-affine-backend}

`bfv-affine-sha3-256-v1` အတွက် runtime သည် BFV key material ကို \(s\) နှင့် \(A\) တို့မှ ပထမဦးဆုံးထုတ်ယူသည်။ ထုတ်ယူထားသော အများပြည်သူ parameters များသည်အဆက်မပြတ် commit လုပ်ထားသည့် အများပြည်သူ parameter များနှင့်တိကျစွာညီမျှရမည်ဖြစ်သည်။

ချောမွေ့တဲ့ ပတ်လမ်းမျိုးစေ့က-

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

ဤမျိုးစေ့မှ runtime နမူနာများ, modulo \(t\), 32-တန်း affine circuit ကို:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

ဘယ်မှာ \(m_i\) Homeomorphically ဆိုရင် စာလုံးပေါင်းတွေအပေါ် တူညီတဲ့တန်ဖိုးကို တွက်ချက်တယ်။

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Resolver က \(C_j\) တစ်ခုစီကို decrypt လုပ်ပေးပြီး နောက်ဆက်တွဲ plaintext ကိုက်ညီချက်အားလုံးကို သုညဖြစ်ဖို့ တောင်းဆိုကာ coefficient-zero တန်ဖိုးတွေကို byte အဖြစ်ပြောင်းပေးပြီး form တွေမှာ:

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

### BFV ပရိုဂရမ်လုပ်ထားတဲ့ Backend {#bfv-programmed-backend}

`bfv-programmed-sha3-256-v1` အတွက် အများပြည်သူသတ်မှတ်ချက်များမှာ BFV မှတ်သားရေး ကုဒ်သွင်းခြင်းသတ်မှတ်ချက်တွေနဲ့ ပုန်းကွယ်တဲ့ပရိုဂရမ် Digest ကို ထည့်သွင်းထားပါတယ်-

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

လက်ရှိ RAM-FHE ပရိုဖိုင်သည်:

|ကွင်း |တန်ဖိုး |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

Torii သို့တင်သွင်းထားသော plaintext input ကို BFV envelope ထဲတွင် ပံ့ပိုးပေးခြင်းမပြုမီမှာ encrypt လုပ်ထားပါသည်။ server-side encryption အတွက် deterministic seed ကတော့:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Externally provided encrypted input အတွက် resolver က identifier envelope ကို decrypts လုပ်ပြီး executing မလုပ်ခင် ဒီ deterministic envelope ထဲကို ပြန်လည်encrypt လုပ်ပေးပါတယ်။ အဲဒီ canonicalization ဟာ receipt hash တွေကို semantically equal BFV ciphertext တွေမှာ တည်ငြိမ်အောင် ထိန်းထားတယ်။

ပထမဦးဆုံး လျှို့ဝှက်ထားတဲ့ မှတ်ဉာဏ်လမ်းကြောင်းတွေက အောက်ပါကနေ ရတာပါ။

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 လမ်းကြောင်းတစ်ခုစီအတွက် Runtime နမူနာများ \(r_j \in [0,t)\) နဲ့ stores a ကို BFV encrypt text ကို encrypt လုပ်ခြင်း \(r_j\). အဲဒီနောက်မှာ ပုန်းကွယ်နေတဲ့ ပရိုဂရမ်က ကုဒ်သွင်းထားတဲ့ မှတ်ပုံတင်များနဲ့ ကုဒ်သွင်းထားသော မှတ်ဉာဏ်ကို အကောင်အထည်ဖော်ပါတယ်။

|ညွှန်ကြားချက်|အက္ခရာ |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), ပြီးရင် ပြန်တန်းတင်လိုက်ပါ။|
|`SelectEqZero(dst, cond, z, nz)` |\(R_{\mathrm{cond}}\) ကို decrypt လုပ်ပါ။ သုညရှိရင် \(R_z\) ကိုရွေးပါ၊ မဟုတ်ရင်တော့ \(R_{nz}\). |
|`Output(src)` |\(R_{\mathrm{src}}\) ကို output register စာရင်းထဲ ထည့်သွင်းပါ။ |

ညွှန်ကြားချက် tape ပြီးဆုံးပြီးနောက် Resolver က output register တစ်ခုစီကို decrypts လုပ်ပြီး coefficient zero ကို byte အဖြစ်ပြောင်းပြီး those bytes တွေကို concatenates:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

ပရိုဂရမ်ပြုလုပ်ထားသော backend hash များမှာ:

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

default programmed identifier tape မှာ input slot (၆၄) ခုရှိပါတယ်။ slot တစ်ခုစီအတွက် \(i\) ဆိုရင် input slot ကို load လုပ်ပြီး memory lane \(i \bmod 32\) ကို loads လုပ်ပြီး add လုပ်ပေးပြီး result ကို output လုပ်ပါတယ်။

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### ထုတ်ကုန် hash များနှင့် လက်မှတ်များ {#output-hashes-and-receipts}

အထွေထွေ RAM-LFE အကောင်အထည်ဖော်မှုလက်မှတ်က raw output ကို လက်မှတ်ထိုးခြင်းမဟုတ်ဘဲ output hash ကိုလက်မှတ်ထိုးသည်။

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE အကောင်အထည်ဖော်မှုလက်မှတ်များအတွက်၊ ဆက်စပ်သော ဒေတာသည် ပရိုဂရမ်ရှာဖွေရေးဘိုက်များဖြစ်ပါသည်။

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

လက်မှတ်ရေးထိုးထားတဲ့ လက်ခံစာရဲ့ အသုံးဝင်ပစ္စည်းက-

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

`signed` mode အတွက်:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

စစ်ဆေးခြင်းသည် `resolver_public_key` ဖြင့် လက်မှတ်ကိုစစ်ဆေးပြီး ဤညီမျှမှုအားလုံးမှာ မပါကလက်မှတ်အား ပယ်ချသည်။

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

ဖုန်းခေါ်ဆိုသူက `output_hex` ကို ပေးပို့ပါက စစ်ဆေးသူကလည်း:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` mode အတွက် သက်သေခံစာမှာ လက်မှတ်အစား အထောက်အထားအဖုံးတစ်ပုံး ပါပါတယ်။ စစ်ဆေးမှုက အတည်ပြုချက် backend, circuit id, public-input schema hash, verifying-key hash နဲ့ exposed public instances တွေဟာ proof verifier metadata နဲ့ encoded receipt-payload hash ကိုက်ညီမှုရှိလားဆိုတာစစ်ဆေးပါတယ်။

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

မျှော်မှန်းထားသော အများပြည်သူ instance များမှာ element တစ်ခုပါတဲ့ column လေးခုဖြစ်ပါတယ် Column \(j\) မှာ bytes \(h_{8j}\ldots h_{8j+7}\) ပါပြီး နောက်မှာ zero byte ၂၄ ခုရှိပါတယ်

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Identifier ပရိုဂျက်ခြင်း {#identifier-projection}

Identifier Resolution သည် user-facing opaque account identifier အဖြစ် generic backend `opaque_hash` ကိုအသုံးပြုခြင်းမရှိပါ။ ၎င်းသည် RAM-LFE output hash ကို identifier-specific domains များမှတစ်ဆင့် ပရိုဂျက်သည်။

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

`IdentifierResolutionReceipt` သည် ပိုမြင့်မားသော အသုံးဝင်ဝန်ပိုးကို လက်မှတ်ထိုးသည်-

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

လက်မှတ်ရေးထိုးထားတဲ့ မှတ်ပုံတင်လက်မှတ်များအတွက်-

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` သည် လက်မှတ် (သို့) အထောက်အထားသည် သက်ဝင်မှုရှိလျှင်သာ လက်ခံလက်မှတ်ကို လက်ခံသည်၊ ထည့်သွင်းထားသော RAM-LFE အကောင်အထည်ဖော်မှု အသုံးဝင်ဝန်ဆောင်မှုသည် ရည်ညွှန်းသည့် အစီအစဉ် မူဝါဒနှင့် ကိုက်ညီပြီး `uaid` နှင့် `account_id` တို့သည် တောင်းဆိုနေသော အမိန့်ချမှတ်ချက်ဖြစ်သည်။

## အကောင်အထည်ဖော်မှု စီးဆင်းမှု {#execution-flow}

အထွေထွေ RAM-LFE အကောင်အထည်ဖော်မှုမှာ အောက်ပါပုံစံရှိသည်-

1. အုပ်ချုပ်မှု (သို့) လုပ်ငန်းရှင် မှတ်ပုံတင် `RamLfeProgramPolicy`
2. ပိုင်ရှင်က မူဝါဒကို တက်ကြွစေတယ်။
3. ဖောက်သည်က Torii မှ အများပြည်သူရေးရာ metadata ကိုဖတ်တယ်။
4. Client က Resolver ကို input form တစ်ခုကို အတိအကျတင်ပေးတယ်။ Plaintext `input_hex` ဒါမှမဟုတ် encrypted input envelope BFV ပါ။
5. Runtime က ပုန်းနေတဲ့ပရိုဂရမ်ကို အကဲဖြတ်ပြီး ပြန်လာပေးတယ်။ `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash`, နှင့် a `RamLfeExecutionReceipt`.
6. Client (သို့) backend က ထုတ်ဝေထားတဲ့ မူဝါဒကို နှိုင်းယှဉ်ပြီး လက်မှတ်ရယူမှုကို စစ်ဆေးပြီး ပြန်လည်ပေးပို့ထားသော `output_hex` သည်လက်မှတ်ရယူသူရဲ့ `output_hash` ကို ဟက်ရှ်ဖြစ်သည်ကို ရွေးချယ်မှုအရ စစ်ဆေးတယ်။
7. `ClaimIdentifier` လို အဆင့်မြင့် ညွှန်ကြားချက်တစ်ခုမှာ မူကြမ်း input ကို ထည့်သွင်းခြင်းအစား သက်သေခံလက်မှတ်ကို ထည့်သွင်းနိုင်ပါတယ်။

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

Identifier မူဝါဒများသည် RAM-LFE ကို တိကျစွာ အသုံးပြုခြင်းဖြစ်သည်။ ၎င်းတို့သည် ယေဘုယျပရိုဂရမ်မူဝါဒ၏အထက်တွင် စီးပွားရေးနာမည်နေရာနှင့် ပုံမှန်သတ်မှတ်မှုစည်းမျဉ်းကို ထည့်သွင်းသည်။

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

Identifier layer မှာ RAM-LFE လက်မှတ်ကို အသုံးပြုပြီး ချိတ်ဆက်ပေးပါတယ်။

- `policy_id`
- လျှို့ဝှက် လုပ်ဆောင်ချက်ဖြင့် ရယူထားသော မရှင်းလင်းတဲ့ မှတ်သားစရာ
- အချိုးသတ်ချက် `receipt_hash`
- ငွေစာရင်း UAID
- တရားဝင် `account_id`
- အထွေထွေ RAM-LFE အကောင်အထည်ဖော်မှု အသုံးဝင်လစာ

User-facing onboarding အတွက် Account aliases ကို ပုဂ္ဂလိက ID တွေနဲ့ သီးခြားထားပါ။ Aliases တွေဟာ အများပြည်သူအမည်တွေပါ၊ ဖုန်းနံပါတ်တွေ၊ အီးမေးလ်လိပ်စာတွေနဲ့ အလားတူတန်ဖိုးတွေက ID မူဝါဒတွေနဲ့ လက်မှတ်တွေကနေ စီးဆင်းသင့်ပါတယ်။

## Torii လမ်းကြောင်းများ {#torii-routes}

App ကို ဦးတည်တဲ့ လမ်းကြောင်းမိသားစုကို ဖွင့်ထားတဲ့အခါ Torii က RAM-LFE နဲ့ Identifier Assistant တွေကို ဖော်ပြပါတယ်။

|လမ်းကြောင်း |ရည်ရွယ်ချက်|
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |RAM-LFE ပရိုဂရမ် မူဝါဒများနှင့် အများပြည်သူ အကောင်အထည်ဖော်မှု မီတာဒေတာများကို ပြသပါ။ |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |`input_hex` (သို့) `encrypted_input` ကနေ ပရိုဂရမ် တစ်ခုကို အကောင်အထည်ဖော်ပြီး output hash တွေနဲ့ stateless receipt ကိုပြန်ပို့ပါ။ |
|`POST /v1/ram-lfe/receipts/verify` |`RamLfeExecutionReceipt` ကို ထုတ်ပြန်ထားတဲ့ မူဝါဒနဲ့ စစ်ဆေးပြီး ရွေးချယ်စရာအနေနဲ့ `output_hex` နဲ့ `output_hash` ကို နှိုင်းယှဉ်ပါ။ |
|`GET /v1/identifier-policies` |Identifier မူဝါဒများ၊ Normalization Mode များ၊ Resolver Key များနှင့် Encrypted Input Metadata များကို စာရင်းပေးပါ။ |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |`ClaimIdentifier` ထဲမှာ အသုံးပြုသူ ထည့်သွင်းနိုင်မယ့် လက်မှတ်ထုတ်ပေးပါ။ |
|`POST /v1/identifiers/resolve` |Active Claim ရှိပါက ချိတ်ဆက်ထားသောစာရင်းသို့ Normalized Identifier input ကို ဖြေရှင်းပါ။ |
|`GET /v1/identifiers/receipts/{receipt_hash}` |စစ်ဆေးရေးနှင့် ထောက်ပံ့ရေး ကိရိယာများအတွက် လက်မှတ် hash ဖြင့် persisted identifier claim ကိုရှာဖွေပါ။ |

`/openapi` သို့မဟုတ် `/openapi.json` စာရွက်စာတမ်းများကို ဤလမ်းကြောင်းများနှင့် ဆောက်လုပ်ရန်မတိုင်ခင် အမြဲစစ်ဆေးပါ။ ရယူနိုင်မှုသည် node build နှင့် network profile ကိုမူတည်သည်။

## Node Runtime {#node-runtime}

Torii လုပ်နေဆဲပါ။ RAM-LFE Runtime ကို အောက်မှာ သတ်မှတ်ထားပါတယ် `torii.ram_lfe.programs[*]`, keyed by `program_id`. ဖွဲ့စည်းထားသော အစီအစဉ်တိုင်းသည် ချုပ်ဆက်ရေး မူဝါဒဆိုင်ရာ ကတိပေးချက်နှင့် ကိုက်ညီပြီး အကဲဖြတ်ရန် လိုအပ်သည့် runtime ပစ္စည်းများကို ဖြည့်ဆည်းပေးရမည်။ Identifier Routes တွေဟာ ဒီ Runtime ကိုပဲ ပြန်သုံးကြတယ်၊ သီးခြား Identifier-Resolver Configuration Surface တစ်ခု မလိုပါဘူး။

ကွင်းဆက်ပေါ်က မူဝါဒကို မှတ်ပုံတင်ခြင်းသည် ၎င်းဘာသာ မလုံလောက်ပါ။ ရည်မှန်းချက် node သည် လမ်းကြောင်းမိသားစုကိုလည်းဖေါ်ပြရမည်ဖြစ်ပြီး လုပ်ဆောင်ရန်မျှော်လင့်ထားသော အစီအစဉ်များအတွက် လိုက်ဖက်တဲ့ runtime ပစ္စည်းရှိရမည်။

## စီမံခန့်ခွဲရေး စောင့်ရှောက်ရေး ရထားများ {#operational-guardrails}

- မူဝါဒတွေ မလုပ်ဆောင်တာကို မှတ်ပုံတင်ပါ၊ အများပြည်သူရဲ့ metadata တွေကို စစ်ဆေးပြီး ဒါတွေကို တက်ကြွစေပါ။
- အကဲဖြတ်သူ လျှို့ဝှက်ချက်တွေကို ဖုံးကွယ်ထားပါ၊ Resolver လက်မှတ်ရေးထိုးတဲ့ သော့တွေ၊ BFV စာရွက်စာတမ်းတွေ၊ မှတ်ပုံတင်တွေ၊ ငွေကြေးလွှဲပြောင်းမှုတွေနဲ့ ဖောက်သည်စုတွေထဲက လျှို့ဝှက်ပစ္စည်းတွေပါ။
- Account aliases, transaction metadata, events (သို့) world-state fields များတွင် raw identifiers ကို မထည့်ပါနဲ့။
- SDK က စစ်ဆေးသူကို ဖေါ်ပြတဲ့အခါ အဆင့်မြင့် ညွှန်ကြားချက်တွေ မတင်ခင် ဝယ်သူဘက်က လက်မှတ်တွေကို စစ်ဆေးပါ။
- သက်တမ်းကုန်ဆုံးတဲ့ ကွင်းတွေကို အသုံးပြုပါ၊ ရှေးဟောင်းလက်မှတ်တွေဟာ ထာဝရ မတည်ငြိမ်သင့်ပါ။
- ပရိုဂရမ် (သို့) ID မူဝါဒသစ်တစ်ခုကို မှတ်ပုံတင်ခြင်း၊ ဖောက်သည်များကို ရွှေ့ပြောင်းခြင်းနဲ့ ရယူမှုအသစ်တွေ စီးဆင်းတာနဲ့ မူဝါဒဟောင်းကို ပိတ်လိုက်ခြင်းဖြင့် လည်ပတ်ပါ။

## ဆက်စပ်သော အကြောင်းအရာများ {#related-topics}

- [ပုဂ္ဂလိက ဒေတာနေရာအတွက် ပံ့ပိုးမှု အခွန်များ ](/my/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii အဆုံးသတ်ချက်များ](/my/reference/torii-endpoints.md#app-and-sora-route-families)
- [အမည်မသိ ငွေပေးချေမှု](/my/blockchain/anonymous-transactions.md)
