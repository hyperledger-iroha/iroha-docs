---
translation_locale: my
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဂါနသဇ် စာရင်း {#genesis-reference}

လက်ရှိမှာ Iroha 3 အလုပ်ဖြစ်စဉ်၊ `genesis.json` manifesto က ပထမဦးဆုံးကို သရုပ်ဖော်တယ်။
ကွန်ရက်စတင်ချိန်တွင် အသုံးပြုမည့် ငွေကြေးလုပ်ငန်းများနှင့် ပမာဏများ။

လက်မှတ်ရေးထိုးထားတဲ့ အနုပညာလက်ရာဟာ တူညီသူတွေကို ဖြန့်ဝေပေးထားတာပါ။ Norito- ကုဒ်သွင်းထားတယ်။ `.nrt` ဖိုင်
ထုတ်ကုန်များ `kagami genesis sign`.

## အဓိကနယ်ပယ်များ {#main-fields}

မျိုးရိုးဗီဇထုတ်ပြန်ချက်က

- `chain` သံကြိုးမှတ်တမ်းအတွက်
- `executor` ရွေးချယ်စရာ အကောင်အထည်ဖော်သူ အဆင့်မြှင့်ခြင်း bytecode path အတွက်
- `ivm_dir` အတွက် IVM trigger များနှင့် upgrade များဖြင့် အသုံးပြုသော library များ
- `consensus_mode` မူလပုံစံအတွက် ပြက္ခဒိန်မှာ ကြော်ငြာထားတာပါ။
- `transactions` စနစ်တကျ သတ်မှတ်ချက်များ၊ ညွှန်ကြားချက်များ၊ trigger များနှင့် topology များအတွက်
- `crypto` ပထမဦးဆုံး crypto snapshot အတွက်

အတွင်းပိုင်း `transactions`, topology entries pair peer ids နှင့် PoPs စုပေါင်း:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## ပြသချက်တစ်ခု ဖန်တီးပါ {#generate-a-manifest}

အသုံးပြုခြင်း Kagami Template တစ်ခုကို ဖန်တီးရန်:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

အများပြည်သူအတွက် SORA Nexus ဒေတာနေရာ၊ `npos` မျှော်မှန်းထားတဲ့ သဘောတူညီမှုပုံစံပါ။
အခြား Iroha 3 တပ်ဆင်မှုတွေမှာ ရည်မှန်းချက်အပေါ် မူတည်ပြီး ခွင့်ပြုထားတဲ့အကြောင်း (သို့) NPoS ကို အသုံးပြုနိုင်ပါတယ်။
ကိုယ်စားလှယ်လောင်း

## လက်မှတ်ရေးထိုးခြင်း {#sign-the-manifest}

စာရွက်စာတမ်းကို ပြင်ဆင်ပြီးနောက် JSON, စေလွှတ်လို့ရတဲ့ ကိရိယာတစ်ခုမှာ လက်မှတ်ထိုးပါ။ `.nrt` ဘလော့က:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` စာရင်းအင်းကနေ genesis public key ကို ဖတ်ပြီး အသုံးပြုတယ်။
ဖြန့်ချိနိုင်သည့် လက်မှတ်ထိုးထားသော ထုတ်ကုန်များအတွက် ပေးပို့ထားသော သီးသန့် သော့၊ မျိုးစေ့နှင့် အယ်လ်ဂိုရစ်သမ်
result က peers တွေရဲ့ config ထဲက reference လုပ်သင့်တဲ့ file ပါ။

## ဖွဲ့စည်းခြင်း `irohad` {#configure-irohad}

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

Generator implementation နှင့် command details များအတွက်
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
