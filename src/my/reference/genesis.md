---
translation_locale: my
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကမ္ဘာဦးအကိုးအကား {#genesis-reference}

လက်ရှိမှာတော့ Iroha 3 အလုပ်အသွားအလာ၊ a `genesis.json` manifest သည် ပထမအချက်ကို ဖော်ပြသည်။
ကွန်ရက်စတင်သောအခါတွင် အသုံးပြုမည့် ငွေပေးငွေယူများနှင့် ကန့်သတ်ချက်များ။

လုပ်ဖော်ကိုင်ဖက်များထံ ဖြန့်ဝေထားသော လက်မှတ် ရေးထိုးထားသည့် ပစ္စည်းတစ်ခုဖြစ်သည်။ Norito- ကုဒ်လုပ်ထားသည်။ `.nrt` ဖိုင်
ထုတ်လုပ်သည်။ `kagami genesis sign`.

## အဓိက နယ်ပယ်များ {#main-fields}

ဥပါဒ် ထင်ရှားစွာ သတ်မှတ်နိုင်သည်-

- `chain` ကွင်းဆက်အမှတ်အသားအတွက်
- `executor` ရွေးချယ်နိုင်သော executor တစ်ခုအတွက် bytecode လမ်းကြောင်းကို အဆင့်မြှင့်ပါ။
- `ivm_dir` အတွက် IVM အစပျိုးမှုများနှင့် အဆင့်မြှင့်တင်မှုများဖြင့် အသုံးပြုသည့် စာကြည့်တိုက်များ
- `consensus_mode` မန်နီးဖက်စ်မှ ကြော်ငြာထားသော ကနဦးမုဒ်အတွက်
- `transactions` ကန့်သတ်ဘောင်မွမ်းမံမှုများ၊ ညွှန်ကြားချက်များ၊ အစပျိုးမှုများ နှင့် topology အတွက်
- `crypto` ကနဦး crypto လျှပ်တစ်ပြက်အတွက်

အထဲမှာ `transactions`, topology entries များသည် peer ids နှင့် တွဲထားသည်။ PoPs အတူ-

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Manifest တစ်ခုကို ဖန်တီးပါ။ {#generate-a-manifest}

သုံးပါ။ Kagami နမူနာပုံစံတစ်ခုဖန်တီးရန်-

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

လူထုအတွက် SORA Nexus ဒေတာအာကာသ၊ `npos` မျှော်မှန်းထားသော သဘောတူညီမှုမုဒ်ဖြစ်သည်။
တခြား Iroha 3 ဖြန့်ကျက်မှုသည် ပစ်မှတ်ပေါ် မူတည်၍ ခွင့်ပြုချက် သို့မဟုတ် NPoS ကို အသုံးပြုနိုင်သည်။
ကိုယ်ရေးအကျဉ်း။

## Manifest ကို လက်မှတ်ထိုးပါ။ {#sign-the-manifest}

တည်းဖြတ်ပြီးပါက မှန်ကန်ကြောင်း အတည်ပြုပါ။ JSON, ၎င်းကို ဖြန့်ကျက်နိုင်သောအဖြစ်သို့ လက်မှတ်ရေးထိုးပါ။ `.nrt` ပိတ်ဆို့ခြင်း-

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` manifest မှ genesis public key ကိုဖတ်ပြီး အသုံးပြုသည်။
ပိုင်ရှင်-ကိုင်ဆောင်ထားသော၊ single-link ပုံမှန်ဖိုင်မှ သီးသန့်သော့ကို ထုတ်လုပ်သည်။
အသုံးချနိုင်သော ဆိုင်းဘုတ်များ။ဖိုင်တွင် canonical private-key တစ်ခု ပါဝင်ရပါမည်။
multihash နောက်တွင် လိုင်းအသစ်တစ်ခု၊ Kagami ပုံဆောင်လင့်ခ်များနှင့် အခြားမုဒ်များကို ငြင်းပယ်သည်။
ထက် `0600`. အကြမ်းထည်သီးသန့်သော့များကို command line တွင် လက်မခံပါ။ရလဒ်
ရွယ်တူများသည် ၎င်းတို့၏ config မှ ကိုးကားရမည့် ဖိုင်ဖြစ်သည်။

## စီစဉ်ပေးသည်။ `iroha3d` {#configure-iroha3d}

လက်မှတ်ရေးထိုးထားသော genesis block တွင် daemon ကိုညွှန်ပြပါ-

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## ဆက်စပ်ကိရိယာများ {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

ဂျင်နရေတာ အကောင်အထည်ဖော်မှုနှင့် အမိန့်ပေးမှုအသေးစိတ်အတွက်၊ တွင် ကြည့်ရှုပါ။
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
