---
translation_locale: my
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပိုက်ဆံများ {#assets}

Iroha အရင်းအမြစ်သည်စာရင်းတစ်ခုတွင် ထိန်းသိမ်းထားသော ကိန်းဂဏန်းညီညွတ်မှုဖြစ်သည်။ ကွန်ကရစ်ညီညွတ်မှုကတိုင်းမှာ `AssetDefinition` ကို ညွှန်ပြပြီး အဓိပ္ပါယ်ဖွင့်ဆိုချက်သည် ထိုအရင်းအမြစ်ကိုအမည်ပေးခြင်း၊ သတ္တုထုတ်ခြင်း၊ ပြသခြင်းနှင့်ခွဲခြားခြင်းတို့ကို ဖော်ပြသည်။

## အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက် {#asset-definition}

`AssetDefinition` တွင် အောက်ပါအချက်များ ပါဝင်သည် -

- `id`: အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုခြင်းဆိုင်ရာ တရားဝင်လိပ်စာ
- `name`: လူဖတ်လို့ရတဲ့ မျက်နှာပြင်အမည်
- `description`: လူဖတ်လို့ရတဲ့ ရွေးချယ်စရာ သရုပ်ဖော်ချက်
- `alias`: `<name>#<domain>.<dataspace>` သို့မဟုတ် `<name>#<dataspace>` ပုံစံများတွင် ရွေးချယ်စရာ အမည်မဖော်လိုပါ။
- `spec`: ငွေကြေးပမာဏအတွက် ကိန်းဂဏန်း တိကျမှုနှင့် ကန့်သတ်ချက်များ
- `mintable`: စိတ်ချရမှု မူဝါဒ
- `logo`: ရွေးချယ်စရာရှိသည် `SoraFS` URI
- `metadata`: key value ကို အလိုလို metadata လုပ်ပါ။
- `balance_scope_policy`: ငွေကြေးစာရင်းများက ကမ္ဘာလုံးဆိုင်ရာလား (သို့) ဒေတာနေရာများအတွက် ကန့်သတ်ထားမှုလား
- `owned_by`: အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို မှတ်ပုံတင်ထားသည့် သို့မဟုတ် ပိုင်ဆိုင်ထားသော စာရင်း
- `total_quantity`: ထုတ်လွှင့်ထားသော စုစုပေါင်းပမာဏ
- `confidential_policy`: ပိတ်ပင်ထားသော အရင်းအမြစ်လုပ်ငန်းများအတွက် မူဝါဒ

Asset Definition IDs သည် canonical opaque address များဖြစ်သည်။ အဓိပ္ပာယ်ဖွင့်ဆိုချက်တစ်ခုသည်ဒိုမင်တစ်ခုနှင့်အမည်တစ်ခုမှတည်ဆောက်သောအခါ, Iroha သည် UX နှင့်မေးမြန်းမှုများအတွက် domain / name projection ကိုထိန်းသိမ်းနိုင်သည်၊ သို့သော် canonical text form သည်ထုတ်လုပ်သောလိပ်စာဖြစ်သည်။

## ရင်းနှီးမြှုပ်နှံမှု ဟန်ချက်ညီမှု {#asset-balance}

`Asset` တွင် အောက်ပါအချက်များ ပါဝင်သည် -

- `id`: အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်၊ ပိုင်ရှင်စာရင်းနှင့် ရွေးချယ်စရာ ငွေကြေးပမာဏကို ပေါင်းစပ်ထားသော `AssetId`
- `value`: `Numeric` ငွေကြေးပမာဏ

ပိုင်ရှင်အကောင့်သည် ကနွန်နီကာဖြစ်ပြီး ဒိုမင်မရှိပါ။ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုမှုကို ဒေတာနေရာအရ ကျွမ်းကျင်တဲ့ဒိုမင်တစ်ခုအောက်မှာ စီမံခန့်ခွဲနိုင်သည်၊ ဥပမာ `payments.universal`။

## မွှေနိုင်မှု {#mintability}

Asset Definitions တွေက mintability mode တွေကို ထောက်ပံ့ပေးပါတယ်။

|Mode ကို|အဓိပ္ပါယ်|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |အရင်းအမြစ်ကို အကြိမ်ကြိမ် ထုတ်ပြီး မီးရှို့နိုင်ပါတယ်။|
|`Once` |Fixed Supply Token ကို တစ်ကြိမ်လုပ်ပြီး လောင်ကျွမ်းနိုင်ပါတယ်။|
|`Not` |မီးရှို့လို့ ရပေမဲ့ ပြန်မထုတ်နိုင်တဲ့ တည်ငြိမ်တဲ့ ထောက်ပံ့မှု အမှတ်တံဆိပ်ပါ။|
|`Limited(n)` |ကန့်သတ်ထားတဲ့ နောက်ထပ် လုပ်ငန်းတွေ အတွက် Minting ကို ခွင့်ပြုပါတယ်။ |

ပုံမှန် elastic assets အတွက် `Infinitely` နှင့် fixed supply သို့မဟုတ် bounded supply assets များအတွက် `Once` (သို့မဟုတ်) `Limited(n)` ကို အသုံးပြုပါ။ asset supply က တည်ငြိမ်နေမှသာ `Not` ကို မူလမူဝါဒအဖြစ် မသုံးပါနဲ့။

## ငွေကြေးပမာဏ {#balance-scope}

`balance_scope_policy` သည် ငွေကြေးပမာဏကို ထိန်းချုပ်ပေးသည်မှာ-

- `Global`: အကောင့်တစ်ခုစီအတွက် ငွေစာရင်းအိတ်တစ်လုံးနှင့် အရင်းအမြစ်သတ်မှတ်ချက်
- `DataspaceRestricted`: ငွေကြေးညီမျှမှုများကို ဒေတာနေရာ အခြေအနေအရ ခွဲခြားထားပါသည်။

Nexus ဒေတာနေရာများစွာမှာ တူညီတဲ့ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို သုံးတဲ့အခါ ဒေတာနေရာကန့်သတ်ထားတဲ့ ငွေကြေးကျန်ရစ်မှုဟာ အသုံးဝင်ပေမဲ့ ငွေကြေးစာရင်းတွေက သီးခြားနေရပါမယ်။

## Taira မှာ စမ်းကြည့်ပါ။ {#try-it-on-taira}

ဒီစာဖတ်လို့သာရတဲ့ ဖုန်းခေါ်ဆိုမှုတွေဟာ အများပြည်သူ Taira စစ်ဆေးရေးကွန်ရက်မှာ တကယ့် အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေကို ပြသပါတယ်။

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

လက်ရှိ Taira XOR အခွန်အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကိုရှာပါ။

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

နမူနာသုံးခုစလုံးကို ဖတ်နိုင်ပါတယ် Taira, ရေပိုက်မှ ငွေကြေးထောက်ပံ့တဲ့ အကောင့်ကို သုံးပြီး ထိန်းသိမ်းထားတဲ့ စီးဆင်းမှုကို [ချိတ်ဆက် SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md).

ငွေပေးချေခြင်း Taira အရင်းအမြစ်ဥပမာ, မှ faucet အကူအညီကို Save from [Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) အတိုင်း `taira_faucet_claim.py`, ဒီနောက် faucet အရင်းအမြစ်ကို ပထမဦးဆုံး တောင်းဆိုပြီး ငွေပေးချေမှု ဓာတ်ငွေ့အရင်းအမြစ်အဖြစ် သုံးပါ။

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

`ledger asset mint`၊ `ledger asset burn` နှင့် `ledger asset transfer` command များတွင် `--metadata ./taira.tx-metadata.json` ကို ထည့်သွင်းပါ။

## ညွှန်ကြားချက် {#instructions}

အရင်းအမြစ်များကို Iroha အထူးညွှန်ကြားချက်များဖြင့် မှတ်ပုံတင်၊ ငွေကြေးထုတ်လုပ်ခြင်း၊ မီးရှို့ခြင်းနှင့် လွှဲပြောင်းနိုင်ပါသည်။

- [`Register` နှင့် `Unregister`](/my/blockchain/instructions.md#un-register)
- [`Mint` နှင့် `Burn`](/my/blockchain/instructions.md#mint-burn)
- [`Transfer`](/my/blockchain/instructions.md#transfer)
- [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue)

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [CLI လမ်းညွှန်](/my/get-started/operate-iroha-via-cli.md)
- [Rust သင်ကြားချက်](/my/guide/tutorials/rust.md)
- [Python သင်ကြားချက်](/my/guide/tutorials/python.md)
- [JavaScript/TypeScript သင်ခန်းစာ](/my/guide/tutorials/javascript.md)
- [ဒေတာပုံစံ ](/my/blockchain/data-model.md)
- [NFTs](/my/blockchain/nfts.md)
