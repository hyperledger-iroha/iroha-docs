---
translation_locale: my
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# blockchain genesis ရည်ညွှန်းချက် {#genesis-reference}

လက်ရှိ Iroha 3 အလုပ်ဖြစ်စဉ်တွင် `genesis.json` နည်းပညာထုတ်ပြန်ချက်သည် ကွန်ရက်စတင်ချိန်တွင် အသုံးပြုမည့် ပထမဦးဆုံး ငွေလဲလှယ်မှုများနှင့် ပမာဏများကို ဖော်ပြထားသည်။

Norito ကို ကုဒ်သွင်းထားတဲ့ `.nrt` ဖိုင်ကို `kagami genesis sign` က ထုတ်ပေးထားပြီး ကွန်ယက်တူညီသူတွေကို ဖြန့်ဝေတဲ့ လက်မှတ်ထိုးလက်ရာပါ။

## အဓိကနယ်ပယ်များ {#main-fields}

blockchain genesis နည်းပညာ manifesto တစ်ခုက ဒီလိုကို သတ်မှတ်နိုင်ပါတယ်။

- `chain` ကွင်းဆက်အမှတ်တံဆိပ်
- manifest ထဲရှိ အကောင့် literal များကို ကုဒ်သွင်းရာတွင် သုံးသော I105 ကွန်ရက်ရှေ့ဆက်အတွက် `chain_discriminant`
- `executor`အတွက် ရွေးချယ်စရာ အကောင်အထည်ဖော်သူ upgrade bytecode လမ်းကြောင်း
- `ivm_dir` အတွက် trigger များနှင့် upgrade များဖြင့် အသုံးပြုသော IVM စာြကည့်တိုက်များ
- `consensus_mode` Technical Manifesto တွင် ကြော်ငြာထားသော အစောပိုင်းပုံစံအတွက်
- `wire_protocol_version` ပထမထုတ်ဝေမှု၏ consensus ကွန်ရက်ပေးပို့မှု ပရိုတိုကော ဗားရှင်းအတွက်
- `consensus_fingerprint` consensus ပါရာမီတာများ၏ ရွေးချယ်နိုင်သော အမျိုးအစားသတ်မှတ်ထားသည့် fingerprint အတွက်၊ JSON manifest များတွင် ၎င်းကို အတိအလင်း ဖော်ပြသည်
- `transactions` အတိုင်းအတာ update များ၊ ညွှန်ကြားချက်များ၊ trigger များနှင့် topology များအတွက်
- လက်မှတ်ထိုးထားသော Sumeragi အမြင့် context parameter များအတွက် `sumeragi_context`
- ချိန်းက လက်ခံသော လက်မှတ်ထိုးခြင်းနှင့် controller algorithm အတိအကျများအတွက် `crypto_admission_policy`၊ ၎င်းတို့ကို `allowed_algorithms` တွင် စာရင်းပြုထားသည်

`transactions` အတွင်းရှိ ချိတ်ဆက်ဖွဲ့စည်းပုံမှတ်တမ်းများသည် peer အမှတ်အသားများနှင့် PoPs တို့ကို တွဲထားသည်။

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Technical Manifesto ကို ဖန်တီးပါ။ {#generate-a-manifest}

Template ထုတ်လုပ်ရန် Kagami ကို သုံးပါ။ လက်ခံခွင့်ရ algorithm တစ်ခုစီအတွက် `--allowed-signing` ကို စံငယ်စဉ်ကြီးလိုက် အစဉ်အတိုင်း ထပ်မံထည့်ပါ။ Kagami သည် ချန်ထားသော algorithm များကို ဖြည့်မပေးပါ:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

အများသုံး SORA Nexus ဒေတာနယ်ပယ်အတွက် မျှော်မှန်းထားသော သဘောတူညီမှုနည်းလမ်းသည် `npos` ဖြစ်သည်။ အခြား Iroha 3 ဖြန့်ချိတပ်ဆင်မှုများတွင် ပစ်မှတ်ပရိုဖိုင်အပေါ် မူတည်၍ ခွင့်ပြုချက်အခြေပြုနည်းလမ်း သို့မဟုတ် NPoS ကို သုံးနိုင်သည်။

## Technical Manifesto ကို လက်မှတ်ရေးထိုးပါ။ {#sign-the-manifest}

JSON ကို တည်းဖြတ်ပြီး အတည်ပြုပြီးနောက်၊ ဖြန့်ချိနိုင်သော `.nrt` ဘလော့တစ်ခုထဲတွင် လက်မှတ်ထိုးပါ။

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` သည် ပိုင်ရှင်ထိန်းထားသော လင့်ခ်တစ်ခုတည်းရှိ ပုံမှန်ဖိုင်ထဲရှိ ကိုယ်ပိုင်ကီးမှ genesis ကီးအတွဲကို ဆင်းသက်ထုတ်ယူပြီး ဖြန့်ချိနိုင်သော လက်မှတ်ထိုးဘလော့ခ်ကို ထုတ်ပေးသည်။ ၎င်းသည် ထုတ်ပြန်ထားသော genesis အများသုံးကီးနှင့် ကိုက်ညီရန် လိုအပ်စေလိုပါက `--expected-public-key` ကို ပေးပါ။ ဖိုင်တွင် စံသတ်မှတ်ကိုယ်ပိုင်ကီး multihash တစ်ခုနှင့် နောက်ဆက်တွဲစာကြောင်းအသစ် ပါရမည်။ Kagami သည် သင်္ကေတလင့်ခ်များနှင့် `0600` မဟုတ်သော ခွင့်ပြုချက်ပုံစံများကို ငြင်းပယ်သည်။ command လိုင်းမှ ကိုယ်ပိုင်ကီးအကြမ်းများကို လက်မခံပါ။ ရလဒ်ဖိုင်ကို peer များက ၎င်းတို့၏ ပြင်ဆင်သတ်မှတ်မှုမှ ညွှန်းရမည်။

## `iroha3d` ကို ဖွဲ့စည်းခြင်း {#configure-iroha3d}

Daemon ကို လက်မှတ်ထိုးထားသော genesis ဘလော့ခ်နှင့် မျှော်မှန်းဟက်ရှ်ကို သတ်မှတ်ချည်နှောင်ထားသော ဖိုင်သို့ ညွှန်ပြပါ။ `kagami genesis sign --expected-hash-out` က ထိုဖိုင်ကို ရေးသားပြီး နိုဒ်သည် အသစ်စတင်ချိန်နှင့် ပြန်စတင်ချိန် နှစ်မျိုးစလုံးတွင် ၎င်းကို လိုအပ်သည်:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## ဆက်စပ်သော ကိရိယာများ {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Generator implementation နဲ့ command details တွေအတွက် [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md) ကို ကြည့်ပါ။
