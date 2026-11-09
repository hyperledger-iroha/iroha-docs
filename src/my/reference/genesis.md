---
translation_locale: my
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# blockchain genesis ရည်ညွှန်းချက် {#genesis-reference}

လက်ရှိ Iroha 3 အလုပ်ဖြစ်စဉ်တွင် `genesis.json` နည်းပညာထုတ်ပြန်ချက်သည် ကွန်ရက်စတင်ချိန်တွင် အသုံးပြုမည့် ပထမဦးဆုံး ငွေလဲလှယ်မှုများနှင့် ပမာဏများကို ဖော်ပြထားသည်။

Norito ကို ကုဒ်သွင်းထားတဲ့ `.nrt` ဖိုင်ကို `kagami genesis sign` က ထုတ်ပေးထားပြီး ကွန်ယက်တူညီသူတွေကို ဖြန့်ဝေတဲ့ လက်မှတ်ထိုးလက်ရာပါ။

## အဓိကနယ်ပယ်များ {#main-fields}

blockchain genesis နည်းပညာ manifesto တစ်ခုက ဒီလိုကို သတ်မှတ်နိုင်ပါတယ်။

- `chain` ကွင်းဆက်အမှတ်တံဆိပ်
- `executor`အတွက် ရွေးချယ်စရာ အကောင်အထည်ဖော်သူ upgrade bytecode လမ်းကြောင်း
- `ivm_dir` အတွက် trigger များနှင့် upgrade များဖြင့် အသုံးပြုသော IVM စာြကည့်တိုက်များ
- `consensus_mode` Technical Manifesto တွင် ကြော်ငြာထားသော အစောပိုင်းပုံစံအတွက်
- `transactions` အတိုင်းအတာ update များ၊ ညွှန်ကြားချက်များ၊ trigger များနှင့် topology များအတွက်
- `crypto` စတုတ္ထ crypto point-in-time ဒေတာအမြင်အတွက်

`transactions` အတွင်းရှိ ချိတ်ဆက်ဖွဲ့စည်းပုံမှတ်တမ်းများသည် peer အမှတ်အသားများနှင့် PoPs တို့ကို တွဲထားသည်။

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Technical Manifesto ကို ဖန်တီးပါ။ {#generate-a-manifest}

ပုံစံတစ်ခု ဖန်တီးရန် Kagami ကို အသုံးပြုပါ။

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

အများပြည်သူ SORA Nexus ဒေတာနေရာအတွက် `npos` သည်မျှော်လင့်ထားသော သဘောတူညီမှုပုံစံဖြစ်သည်။ အခြား Iroha 3 ဖြန့်ချိမှုများတွင် ရည်မှန်းချက် ပရိုဖိုင်အပေါ် မူတည်၍ ခွင့်ပြုချက် သို့မဟုတ် NPoS ကို အသုံးပြုနိုင်သည်။

## Technical Manifesto ကို လက်မှတ်ရေးထိုးပါ။ {#sign-the-manifest}

JSON ကို တည်းဖြတ်ပြီး အတည်ပြုပြီးနောက်၊ ဖြန့်ချိနိုင်သော `.nrt` ဘလော့တစ်ခုထဲတွင် လက်မှတ်ထိုးပါ။

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` သည် manifest မှ genesis အများသုံးကီးကို ဖတ်ပြီး ဖြန့်ချိနိုင်သော လက်မှတ်ထိုးဘလော့ခ်ကို ထုတ်ပေးရန် ပိုင်ရှင်ထိန်းထားသော လင့်ခ်တစ်ခုတည်းရှိ ပုံမှန်ဖိုင်မှ ကိုယ်ပိုင်ကီးကို အသုံးပြုသည်။ ဖိုင်တွင် စံသတ်မှတ်ကိုယ်ပိုင်ကီး multihash တစ်ခုနှင့် နောက်ဆက်တွဲစာကြောင်းအသစ် ပါရမည်။ Kagami သည် သင်္ကေတလင့်ခ်များနှင့် `0600` မဟုတ်သော ခွင့်ပြုချက်ပုံစံများကို ငြင်းပယ်သည်။ command လိုင်းမှ ကိုယ်ပိုင်ကီးအကြမ်းများကို လက်မခံပါ။ ရလဒ်ဖိုင်ကို peer များက ၎င်းတို့၏ ပြင်ဆင်သတ်မှတ်မှုမှ ညွှန်းရမည်။

## `iroha3d` ကို ဖွဲ့စည်းခြင်း {#configure-iroha3d}

လက်မှတ်ထိုးထားတဲ့ blockchain genesis block ကို daemon ကို ညွှန်ပြပါ။

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

Generator implementation နဲ့ command details တွေအတွက် [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md) ကို ကြည့်ပါ။
