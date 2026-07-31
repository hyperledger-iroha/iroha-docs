---
translation_locale: my
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အရင်းအမြစ်များ {#assets}

အန် Iroha အရင်းအမြစ်ဆိုတာ အကောင့်တစ်ခုမှာရှိတဲ့ ကိန်းဂဏန်းစာရင်းပါ။
balance points ကို `AssetDefinition`, ပြီးတော့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်က ဘယ်လို
အဲဒီအက်ဆစ်ကို နာမည်တပ်နိုင်တယ်၊ ထိုးထွင်း၊ ပြသနိုင်ပြီး ခွဲခြားနိုင်ပါတယ်။

## အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက် {#asset-definition}

အန် `AssetDefinition` အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- `id`: ကန်နီကလစ် အရင်းအမြစ်သတ်မှတ်ချက်လိပ်စာ
- `name`: လူဖတ်လို့ရတဲ့ display နာမည်
- `description`: လူဖတ်လို့ရတဲ့ ရွေးချယ်စရာ သရုပ်ဖော်ချက်
- `alias`: ရွေးချယ်စရာ alias များ `<name>#<domain>.<dataspace>` ဒါမှမဟုတ်
  `<name>#<dataspace>` ပုံစံ
- `spec`: ဂဏန်းဆိုင်ရာ တိကျမှုနှင့် ဟန်ချက်များအတွက် ကန့်သတ်ချက်များ
- `mintable`: အချိုးအစားမညီသော မူဝါဒ
- `logo`: ရွေးချယ်စရာ `SoraFS` URI
- `metadata`: key-value metadata များ
- `balance_scope_policy`: ငွေကြေးညီမျှမှုသည် ကမ္ဘာလုံးဆိုင်ရာလား
  ဒေတာနေရာ ကန့်သတ်ချက်များ
- `owned_by`: သတ်မှတ်ချက်ကို မှတ်ပုံတင်ထားသူ (သို့) ပိုင်ဆိုင်ထားသော အကောင့်
- `total_quantity`: ထုတ်လွှင့်ထားသော စုစုပေါင်းအရေအတွက်
- `confidential_policy`: ပိတ်ပင်ထားသော အရင်းအမြစ်များအတွက် မူဝါဒ

အရင်းအမြစ် သတ်မှတ်ချက် IDs ကန်နီကလစ် မရှင်းလင်းတဲ့လိပ်စာတွေပါ။
ဒိုမင်တစ်ခုနဲ့ နာမည်တစ်ခုကနေ တည်ဆောက်ထားတာပါ။ Iroha ဒီဒိုမီနိုင်း/နာမည်ကို သိမ်းထားနိုင်တယ်
စီမံကိန်းအတွက် UX ကန်နိုနစ်စာသားပုံစံက generated
လိပ်စာ။

## ငွေကြေးပမာဏ {#asset-balance}

အန် `Asset` အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- `id`: တစ် `AssetId`, အရင်းအမြစ် သတ်မှတ်ချက်၊ ပိုင်ရှင်စာရင်းကို ပေါင်းစပ်ထားသည်
  ရွေးချယ်စရာ ဘားလန်အကန့်အသတ်
- `value`: (က) `Numeric` ဟန်ချက်ညီမှု

ငွေကြေးအထောက်အပံ့အခွန်သည် တရားဝင်ဖြစ်ပြီး domainless ဖြစ်သည်။
ဥပမာ ဒေတာနေရာအတွက် ကျွမ်းကျင်တဲ့ နယ်ပယ်တစ်ခုအောက်မှာ စီမံကိန်းချထားတာပါ။
`payments.universal`.

## မင်တာနိုင်မှု {#mintability}

Asset Definitions တွေက mintability mode တွေကို ထောက်ပံ့ပေးပါတယ်။

| Mode ကို         | အဓိပ္ပါယ်                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | အရင်းအမြစ်ကို အကြိမ်ကြိမ် လုပ်ပြီး မီးရှို့နိုင်ပါတယ်။    |
| `Once`       | စဉ်ဆက်မပြတ် ထောက်ပံ့မှု အမှတ်တံဆိပ်ကို တစ်ကြိမ်လုပ်ပြီး လောင်ကျွမ်းနိုင်ပါတယ်။        |
| `Not`        | မီးရှို့လို့ ရပေမဲ့ ပြန်မလုပ်နိုင်တဲ့ စံချိန်တင် ထောက်ပံ့မှု အမှတ်တံဆိပ်ပါ။       |
| `Limited(n)` | ငွေကြေးထုတ်လုပ်ခြင်းသည် ထပ်မံလုပ်ဆောင်မှု အနည်းအကျဉ်းအတွက် ခွင့်ပြုထားသည်။ |

အသုံးပြုခြင်း `Infinitely` ပုံမှန် elastic assets တွေအတွက် `Once` ဒါမှမဟုတ် `Limited(n)` အတွက်
Fixed supply (သို့) Limited supply assets များကို မသုံးရပါ။ `Not` အစပိုင်းအဖြစ်
မူဝါဒက အရင်းအမြစ်ပံ့ပိုးမှု မတည်ငြိမ်ဘူးဆိုရင်ပေါ့။

## ငွေကြေးပမာဏ {#balance-scope}

နိုင်ငံခြားရေး `balance_scope_policy` balance တွေကို ဘက်ကစ်ချထားပုံကို ထိန်းချုပ်ပေးတယ်။

- `Global`: ငွေစာရင်းနှင့် အရင်းအမြစ် သတ်မှတ်ချက်တစ်ခုအတွက် ဘန်ဒယ်တစ်လုံး
- `DataspaceRestricted`: balance တွေကို data space context နဲ့ ခွဲခြားထားပါတယ်။

ဒေတာနေရာကန့်သတ်ထားတဲ့ ငွေကြေးစာရင်းတွေဟာ တူညီတဲ့ အရင်းအမြစ် သတ်မှတ်ချက်ရှိတဲ့အခါ အသုံးဝင်ပါတယ်။
များပြားသောအတွက် အသုံးပြု Nexus ဒေတာနေရာတွေရှိပေမဲ့ ဘားလန်တွေက သီးခြားနေဖို့လိုတယ်။

## ဒါကို စမ်းကြည့်ပါ။ Taira {#try-it-on-taira}

ဒီဖတ်လို့သာရတဲ့ ဖုန်းခေါ်ဆိုမှုတွေဟာ အများပြည်သူအတွက် တကယ့် အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေကို ပြသတယ်။ Taira testnet:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

current ကိုရှာပါ Taira XOR အခွန်အင်းအမြစ် သတ်မှတ်ချက်:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

metadata ပါတဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေကို ရှာပါ။

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

နမူနာသုံးခုစလုံးကို ဖတ်နိုင်ပါတယ်။ Taira, a ကိုသုံးပါ
ရေနံကြိုးကဏ္ဍမှ ငွေကြေးထောက်ပံ့မှု အကောင့်နှင့် ထိန်းသိမ်းထားသော စီးဆင်းမှု
[ချိတ်ဆက် SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md).

အခွန်ပေးခြင်း Taira asset နမူနာ, ကန့်သတ်ချက်မှ faucet အကူအညီ
[Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
အတိုင်း `taira_faucet_claim.py`, ဒီနောက် faucet အရင်းအမြစ်ကို ပထမဆုံး တောင်းဆိုပြီး
ကုန်သွယ်မှု ဓာတ်ငွေ့ အရင်းအမြစ်:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

အဲဒီနောက်မှာ ထည့်ပါ `--metadata ./taira.tx-metadata.json` အပေါ် `ledger asset mint`,
`ledger asset burn`, နှင့် `ledger asset transfer` အမိန့်ပေးတယ်။

## ညွှန်ကြားချက်များ {#instructions}

အရင်းအမြစ်များကို မှတ်ပုံတင်နိုင်သည်၊ ငွေကြေးထုတ်လုပ်ခြင်း၊ မီးရှို့ခြင်းနှင့် လွှဲပြောင်းနိုင်သည် Iroha
အထူးညွှန်ကြားချက်များ

- [`Register` နှင့် `Unregister`](/my/blockchain/instructions.md#un-register)
- [`Mint` နှင့် `Burn`](/my/blockchain/instructions.md#mint-burn)
- [`Transfer`](/my/blockchain/instructions.md#transfer)
- [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue)

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [CLI လမ်းညွှန်](/my/get-started/operate-iroha-via-cli.md)
- [Rust သင်ခန်းစာ](/my/guide/tutorials/rust.md)
- [Python သင်ခန်းစာ](/my/guide/tutorials/python.md)
- [JavaScript/TypeScript သင်ခန်းစာ](/my/guide/tutorials/javascript.md)
- [ဒေတာပုံစံ](/my/blockchain/data-model.md)
- [NFTs](/my/blockchain/nfts.md)
