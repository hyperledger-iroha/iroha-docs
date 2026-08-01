---
translation_locale: my
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဇင်နဝါရီ ကိုးကားချက် {#genesis-reference}

လက်ရှိ Iroha 3 အလုပ်ဖြစ်စဉ်တွင် `genesis.json` မန်နီစတာသည် ကွန်ရက် စတင်ချိန်တွင် အသုံးပြုမည့် ပထမဦးဆုံး ငွေလဲလှယ်မှုများနှင့် ပမာဏများကို ဖော်ပြထားသည်။

လက်မှတ်ရေးထိုးထားပြီး အဖော်တွေကို ဖြန့်ဝေထားတဲ့ အနုပညာပစ္စည်းက Norito ကုဒ်တပ်ထားတဲ့ `.nrt` ဖိုင်ဖြစ်ပြီး `kagami genesis sign` ကထုတ်လုပ်ထားပါတယ်။

## အဓိကနယ်ပယ်များ {#main-fields}

မျိုးရိုးဗီဇထုတ်ပြန်ချက်တစ်ခုက ဖော်ပြနိုင်ပါတယ်

- `chain` ကွင်းဆက်အမှတ်တံဆိပ်
- `executor`အတွက် ရွေးချယ်စရာ အကောင်အထည်ဖော်သူ upgrade bytecode လမ်းကြောင်း
- `ivm_dir` အတွက် trigger များနှင့် upgrade များဖြင့် အသုံးပြုသော IVM စာြကည့်တိုက်များ
- `consensus_mode` လိပ်ပြာမှာ ကြော်ငြာထားတဲ့ အစောပိုင်းပုံစံအတွက်
- `transactions` အတိုင်းအတာ update များ၊ ညွှန်ကြားချက်များ၊ trigger များနှင့် topology များအတွက်
- `crypto` ပထမဦးဆုံး crypto snapshot အတွက်

`transactions` အတွင်းတွင် topology entries များသည် peer id နှင့် PoPs တို့ကို ပေါင်းစပ်ထားသည်-

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## သရုပ်ဖော်ချက်တစ်ခု ဖန်တီးပါ {#generate-a-manifest}

ပုံစံတစ်ခု ဖန်တီးရန် Kagami ကို အသုံးပြုပါ။

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

အများပြည်သူ SORA Nexus ဒေတာနေရာအတွက် `npos` သည်မျှော်လင့်ထားသော သဘောတူညီမှုပုံစံဖြစ်သည်။ အခြား Iroha 3 ဖြန့်ချိမှုများတွင် ရည်မှန်းချက် ပရိုဖိုင်အပေါ် မူတည်၍ ခွင့်ပြုချက် သို့မဟုတ် NPoS ကို အသုံးပြုနိုင်သည်။

## လက်မှတ်ရေးထိုးခြင်း {#sign-the-manifest}

JSON ကို တည်းဖြတ်ပြီး အတည်ပြုပြီးနောက်၊ ဖြန့်ချိနိုင်သော `.nrt` ဘလော့တစ်ခုထဲတွင် လက်မှတ်ထိုးပါ။

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` သည် manifest မှ genesis public key ကိုဖတ်ပြီး ဖြန့်ဖြူးနိုင်သော လက်မှတ်ထိုးထားတဲ့ ဘလော့ကိုထုတ်လုပ်ရန်ပေးသွင်းထားသော private key၊ seed နှင့် algorithm ကိုအသုံးပြုသည်။ ရလဒ်မှာ peers များသည်သူတို့၏ config မှ reference လုပ်သင့်သည့် file ဖြစ်ပါသည်။

## `irohad` ကို ဖွဲ့စည်းခြင်း {#configure-irohad}

လက်မှတ်ထိုးထားတဲ့ Genesis Block ကို Daemon ကို ညွှန်ပြပါ။

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## ဆက်စပ်သော ကိရိယာများ {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

ဗီဇထုတ်လုပ်သူ အကောင်အထည်ဖော်မှုနှင့် ညွှန်ကြားချက် အသေးစိတ်အတွက် [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md) ကိုကြည့်ရှုပါ။
