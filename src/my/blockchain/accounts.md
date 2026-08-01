---
translation_locale: my
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အကောင့်များ {#accounts}

အကောင့်သည် ငွေပေးချေမှုများကို လက်မှတ်ရေးထိုးနိုင်သော အာဏာပိုင်တစ်ခုဖြစ်ပြီး ကိုယ်ပိုင်စာအုပ်အခြေအနေဖြစ်သည်။ လက်ရှိ Iroha 3 ဒေတာပုံစံတွင်, `AccountId` သည် Canonical နှင့် domainless ဖြစ်သည်: ၎င်းကိုအကောင့်ထိန်းချုပ်သူမှရယူပြီး Canonically ကို encoded အဖြစ် I105။ လူသားဖတ်လို့ရတဲ့ ဒိုမင်နဲ့ ဒေတာဇုန် အခြေအနေဟာ သီးခြားစာရင်းအမည်တွေ ချည်နှောင်မှုတွေမှာ ပါဝင်ပါတယ်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Account` တွင်:

- `id`: တရားဝင်စာရင်း `AccountId`
- `metadata`: အလိုလိုစာရင်း metadata များ
- `label`: ရွေးချယ်စရာ stable alias
- `uaid`: ရွေးချယ်စရာ Universal Account ID ကို Nexus စီးဆင်းမှုအတွက် အသုံးပြုသည်။
- `opaque_ids`: အကောင့်၏ UAID သို့ ချိတ်ဆက်ထားသော မရှင်းလင်းသော မှတ်သားချက်များ

အကောင့်တစ်ခု ဖန်တီးရန် အသုံးပြုသည့် ငွေချေးမှု အသုံးဝင်မှုသည် `NewAccount` ဖြစ်သည်။ ၎င်းတွင် မှတ်ပုံတင်ထားသော အကောင့်က သုံးသော ကိုယ်ပိုင်လက္ခဏာ၊ မီတာဒေတာ၊ လိပ်စာ၊ UAID နှင့် ပွင့်လင်းမြင်သာခြင်းမရှိသော ID ကွင်းများနှင့်အတူတူပါရှိသည်။

`uaid` သည် Canonical `AccountId` ကိုဖြည့်စွက်သည်၊ ၎င်းကိုအစားထိုးခြင်းမရှိပါ။ Nexus ဝန်ဆောင်မှုများအတွက်ဒေတာနေရာများအကြား တည်ငြိမ်သောအသုံးပြုသူ (သို့မဟုတ်) အဖွဲ့အစည်းကိုင်တွယ်မှုလိုအပ်သည့်အခါ အသုံးပြုပါ Runtime သည် တစ်မှတစ်ဆင့် UAID-to-account အညွှန်းကိန်းကို ထိန်းသိမ်းထားသည်၊ ပွင့်လင်းမြင်သာမှုမရှိသော မှတ်သားစရာများကို UAID မှတစ်ဆင့် ချိတ်ဆက်ရန်လိုအပ်ပြီး အထွေထွေ သို့မဟုတ် တိုက်မိသည့် ပွင့်လင်းမမြင်သာတဲ့ မှတ်သားစရာတွေကို ငြင်းပယ်သည်။ [FHE နှင့် UAID ](/my/blockchain/sora-nexus-services.md#fhe-and-uaid) ကိုကြည့်ပါ Nexus ဝန်ဆောင်မှုလွှာ စီးဆင်းမှုအတွက်။

## Account controller များ {#account-controllers}

Controller က အကောင့်က လုပ်ဆောင်ချက်တွေကို ဘယ်လို ခွင့်ပြုတယ်ဆိုတာကို သတ်မှတ်ပါတယ်။ Default client flow မှာ Ed25519 key pair ကိုသုံးပေမဲ့ data model ကလည်း multisignature policy controller တွေလို ချမ်းသာတဲ့ controllers တွေကို ထောက်ပံ့ပါတယ်။

Client configuration က Signing Authority ကို peer configuration ကနေ သီးခြား သိမ်းထားတယ်။

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

ကြည့်ပါ။ [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md) နှင့် [အဓိကမျိုးဆက်](/my/guide/security/generating-cryptographic-keys.md) လက်ရှိ key formats တွေအတွက်ပါ။

## Taira မှာ စမ်းကြည့်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira testnet မှ ကန်နီကလစ်စာရင်း IDs အနည်းငယ်ကို ဖော်ပြပါ-

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

အကောင့်အရင်းအမြစ်များကို စစ်ဆေးရန် ပထမခေါ်ဆိုမှုမှ ID အကောင့်ကို ကူးယူပြီး လမ်းကြောင်းထဲ မထည့်မီ URL ကို ကုဒ်သွင်းပါ။ ဤ Python snippet သည် ပထမဆုံးစာရင်းတင်ထားသော အကောင့်အတွက် ဒီလိုလုပ်သည်-

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

အကောင့်တစ်ခု ဖန်တီးခြင်း (သို့) မွမ်းမံခြင်းသည် လက်မှတ်ထိုးထားသော ငွေပေးချေမှုဖြစ်ပြီး faucet မှ ရင်းနှီးမြှုပ်နှံရန်လိုအပ်သည်။ Taira ဖွဲ့စည်းပုံ [ချိတ်ဆက် SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md).

## မှတ်ပုံတင်ခြင်းနှင့် ခွင့်ပြုချက်များ {#registration-and-permissions}

အကောင့်များကို [`Register` နှင့် `Unregister`](/my/blockchain/instructions.md#un-register) ညွှန်ကြားချက်များနှင့်အတူ မှတ်ပုံတင်ထားပြီး မှတ်ပုံတင်ခြင်းမရှိပါ။ မည်သူက အကောင့်များ ဖန်တီးနိုင်ကြောင်း၊ မည်သည့်ခွင့်ပြုလက်မှတ်များ (သို့မဟုတ်) အခန်းကဏ္ဍများလိုအပ်သည်ကို တက်ကြွသော runtime validator ကဆုံးဖြတ်သည်။

မှတ်ပုံတင်ပြီးနောက် အကောင့်တစ်ခုမှာ:

- ငွေပေးချေမှု လက်မှတ်ထိုးခြင်း
- ရင်းနှီးမြုပ်နှံမှု
- ကိုယ်ပိုင်ဒေသများ
- အခန်းကဏ္ဍများနှင့် ခွင့်ပြုချက် လက်မှတ်များကို ရရှိရန်
- သိုလှောင်ထားသော metadata
- Nexus အမည်မဖော်လိုသူ၊ rekey၊ ပြန်လည်ထူထောင်ရေးနှင့် ကိုယ်ပိုင်လက္ခဏာ စီးဆင်းမှုများတွင် ပါဝင်ပါသည်

## ကိုယ်ပိုင်လက္ခဏာပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-identity-issues}

ရောင်းဝယ်မှုကို မမျှော်လင့်ဘဲ ပယ်ချလိုက်ရင်:

- client public key သည် လက်မှတ်ရေးထိုးရန် အသုံးပြုသည့် private key နှင့် ကိုက်ညီသည်
- ငွေစာရင်းကို ဘီဘီစီမှာ မှတ်ပုံတင်ခဲ့သည် (သို့) ချုပ်ဆိုထားသော ငွေပေးချေမှုဖြင့် မှတ်ပုံတင်ထားသည်
- အာဏာပိုင်က ညွှန်ကြားချက်အရ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေ ရှိတယ်။
- stringent account field တွေမှာ Canonical I105 account ID ကိုသုံးပြီး ဖတ်လို့ရတဲ့ နာမည်တွေကို Active Account-alias binding ဖြင့် ဖြေရှင်းပေးပါတယ်။

နောက်တစ်ချက်ကြည့်ပါ-

- [ခွင့်ပြုချက်များ ](/my/blockchain/permissions.md)
- [metadata](/my/blockchain/metadata.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md)
