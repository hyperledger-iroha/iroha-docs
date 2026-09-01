---
translation_locale: my
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပိုက်ဆံများ {#assets}

Iroha အရင်းအမြစ်သည် အကောင့်တစ်ခုတွင် ထိန်းသိမ်းထားသော ကိန်းဂဏန်းစာရင်းဖြစ်သည်။ ကွန်ကရစ်စာရင်းတိုင်းမှာ `AssetDefinition` ကို ညွှန်ပြပြီး အဓိပ္ပါယ်ဖွင့်ဆိုချက်သည် ထိုအရင်းအမြစ်ကို မည်သို့အမည်ပေးခြင်း၊ ထုတ်လွှင့်ခြင်း၊ ပြသခြင်းနှင့် ခွဲခြားနိုင်သည်ကို ဖော်ပြသည်။

## အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက် {#asset-definition}

`AssetDefinition` တွင် အောက်ပါအချက်များ ပါဝင်သည် -

- `id`: Single Protocol Standard အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်လိပ်စာ
- `name`: လူဖတ်လို့ရတဲ့ မျက်နှာပြင်အမည်
- `description`: လူဖတ်လို့ရတဲ့ ရွေးချယ်စရာ သရုပ်ဖော်ချက်
- `alias`: `<name>#<domain>.<dataspace>` သို့မဟုတ် `<name>#<dataspace>` ပုံစံများတွင် ရွေးချယ်စရာ အမည်မဖော်လိုပါ။
- `spec`: ငွေကြေးပမာဏအတွက် ကိန်းဂဏန်း တိကျမှုနှင့် ကန့်သတ်ချက်များ
- `mintable`: အရင်းအမြစ်ထုတ်လွှင့်ရေးမူဝါဒ
- `logo`: ရွေးချယ်စရာရှိသည် `SoraFS` URI
- `metadata`: key value ကို အလိုလို metadata လုပ်ပါ။
- `balance_scope_policy`: ငွေကြေးစာရင်းများက ကမ္ဘာလုံးဆိုင်ရာလား (သို့) ဒေတာနေရာများအတွက် ကန့်သတ်ထားမှုလား
- `owned_by`: အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို မှတ်ပုံတင်ထားသည့် သို့မဟုတ် ပိုင်ဆိုင်ထားသော စာရင်း
- `total_quantity`: ထုတ်လွှင့်ထားသော စုစုပေါင်းပမာဏ
- `confidential_policy`: ပိတ်ပင်ထားသော အရင်းအမြစ်လုပ်ငန်းများအတွက် မူဝါဒ

Asset Definition IDs သည် single protocol-standard ပွင့်လင်းမြင်သာမှုမရှိသောလိပ်စာများဖြစ်သည်။ အဓိပ္ပါယ်ဖွင့်ဆိုချက်တစ်ခုသည်ဒိုမင်တစ်ခုနှင့်နာမည်တစ်ခုမှတည်ဆောက်သောအခါ, Iroha သည် UX နှင့်မေးမြန်းမှုများအတွက် domain/name စီမံကိန်းကိုသိမ်းထားနိုင်သည်၊ သို့သော် Single Protocol-standard စာသားပုံစံကထုတ်လုပ်သည့်လိပ်စာဖြစ်သည်။

## ရင်းနှီးမြှုပ်နှံမှု ဟန်ချက်ညီမှု {#asset-balance}

`Asset` တွင် အောက်ပါအချက်များ ပါဝင်သည် -

- `id`: အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်၊ ပိုင်ရှင်စာရင်းနှင့် ရွေးချယ်စရာအရင်းအမြစ်လက်ကျန်ကဏ္ဍကို ပေါင်းစပ်ထားသော `AssetId`။
- `value`: `Numeric` ငွေကြေးပမာဏ

ရင်းနှီးမြှုပ်နှံသူစာရင်းသည် Single Protocol Standard နှင့် Domainless ဖြစ်သည်။ အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို ဒေတာနေရာအရ ကျွမ်းကျင်သော domain တစ်ခုအောက်တွင် စီမံခန့်ခွဲနိုင်သည်၊ ဥပမာ `payments.universal`။

## အရင်းအမြစ် ထုတ်လွှင့်မှု မူဝါဒ {#mintability}

အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များသည် ဤအရင်းအမြစ်ထုတ်လွှင့်ရေး မူဝါဒပုံစံများကို ထောက်ခံသည်။

|Mode ကို|အဓိပ္ပါယ်|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |အရင်းအမြစ်ကို ထပ်ခါထပ်ခါ ထုတ်ပေးပြီး ဖျက်ဆီးနိုင်ပါတယ်။|
|`Once` |Fixed Supply Token ကို တစ်ကြိမ် ထုတ်ပေးပြီး ဖျက်ဆီးနိုင်တယ်။|
|`Not` |ဖျက်ဆီးနိုင်ပေမဲ့ ပြန်မထုတ်ပေးနိုင်တဲ့ Fixed Supply Token ပါ။ |
|`Limited(n)` |မူဝါဒက အရင်းအမြစ်အစိတ်အပိုင်းသစ်တွေကို ထပ်မံလုပ်ဆောင်မှု အနည်းဆုံးမှာ ထုတ်ဝေခွင့်ပြုပါတယ်။ |

ပုံမှန် elastic assets အတွက် `Infinitely` နှင့် fixed supply သို့မဟုတ် bounded supply assets များအတွက် `Once` (သို့မဟုတ်) `Limited(n)` ကို အသုံးပြုပါ။ asset supply က တည်ငြိမ်နေမှသာ `Not` ကို မူလမူဝါဒအဖြစ် မသုံးပါနဲ့။

## အရင်းအမြစ်စာရင်းအကွာအဝေး {#balance-scope}

`balance_scope_policy` သည် ငွေကြေးပမာဏကို ဘယ်လိုခွဲခြားထားသလဲဆိုတာကို ထိန်းချုပ်ပေးပါတယ်။

- `Global`: ငွေစာရင်းနှင့် အရင်းအမြစ် သတ်မှတ်ချက်တစ်ခုစီအတွက် ငွေကြေးပမာဏခွဲခြားမှုတစ်ခု
- `DataspaceRestricted`: ငွေကြေးညီမျှမှုများကို ဒေတာနေရာ အခြေအနေအရ ခွဲခြားထားပါသည်။

Nexus ဒေတာနေရာများစွာမှာ တူညီတဲ့ အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို သုံးတဲ့အခါ ဒေတာနေရာကန့်သတ်ထားတဲ့ ငွေကြေးကျန်ရစ်မှုဟာ အသုံးဝင်ပေမဲ့ ငွေကြေးစာရင်းတွေက သီးခြားနေရပါမယ်။

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

API တောင်းဆိုချက်များတွင် ပြည်သူ့စစ်ဆေးရေးကွန်ရက် Taira တွင် ရင်းနှီးမြှုပ်နှံမှုဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို ဖော်ပြထားသည်

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

Taira တွင် အရင်းအမြစ်များကို ထုတ်လွှင့်ရန်၊ ဖျက်ဆီးရန် သို့မဟုတ် လွှဲပြောင်းရန် testnet မှ ရံပုံငွေပေးချေသည့်စာရင်းနှင့် [SORA Nexus ဒေတာနေရာများနှင့် ချိတ်ဆက်ခြင်း](/my/get-started/sora-nexus-dataspaces.md) တွင် ထိန်းသိမ်းထားသော စီးဆင်းမှုကို အသုံးပြုပါ။

Taira အခွန်ပေးသော အရင်းအမြစ်ဥပမာအတွက် testnet ငွေကြေးထောက်ပံ့ရေး ဝန်ဆောင်မှု အကူအညီကို [Testnet XOR ကို Taira သို့ခေါ်ယူပါ။](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) မှ `taira_faucet_claim.py` အဖြစ် သိမ်းဆည်းပြီး testnet ငွေချေးရေးဝန်ဆောင်မှုအရင်းအမြစ်ကို ပထမဦးဆုံး တောင်းဆိုကာ ငွေချေးမှု စီမံခန့်ခွဲမှု ကုန်ကျစရိတ်အရင်းအမြစ်ကို အသုံးပြုပါ။

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

`ledger asset mint`၊ `ledger asset burn` နှင့် `ledger asset transfer` command များတွင် `--metadata ./taira.tx-metadata.json` ကို ထည့်သွင်းပါ။

## ညွှန်ကြားချက် {#instructions}

အရင်းအမြစ်များကို Iroha ညွှန်ကြားမှုလုပ်ငန်းများဖြင့် မှတ်ပုံတင်ခြင်း၊ ထုတ်လွှင့်ခြင်း၊ ဖျက်ဆီးခြင်းနှင့် လွှဲပြောင်းနိုင်ပါသည်။

- [`Register` နှင့် `Unregister`](/my/blockchain/instructions.md#un-register)
- [`Mint` နှင့် `Burn`](/my/blockchain/instructions.md#mint-burn)
- [`Transfer`](/my/blockchain/instructions.md#transfer)
- [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue)

နောက်တစ်ချက်ကြည့်ပါ-

- [CLI လမ်းညွှန်](/my/get-started/operate-iroha-via-cli.md)
- [Rust သင်ခန်းစာ](/my/guide/tutorials/rust.md)
- [Python သင်ခန်းစာ](/my/guide/tutorials/python.md)
- [JavaScript/TypeScript သင်ကြားချက်](/my/guide/tutorials/javascript.md)
- [ဒေတာပုံစံ](/my/blockchain/data-model.md)
- [NFTs](/my/blockchain/nfts.md)
