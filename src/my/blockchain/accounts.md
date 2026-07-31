---
translation_locale: my
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စာရင်းများ {#accounts}

အကောင့်ဆိုတာ ငွေပေးချေမှုများကို လက်မှတ်ထိုးနိုင်ပြီး ကိုယ်ပိုင်စာရင်းတင်သွင်းနိုင်တဲ့ အာဏာပိုင်တစ်ခုဖြစ်ပါတယ်။
လက်ရှိမှာ Iroha 3 ဒေတာပုံစံ၊ `AccountId` Canonical နဲ့ domainless ပါ။
Account controller ကနေ ရယူထားပြီး Canonically ကို encoded ဖြစ်ပါတယ် I105.
လူသားဖတ်လို့ရတဲ့ Domain နဲ့ Data Space အခြေအနေဟာ သီးခြား account alias တွေနဲ့ဆိုင်ပါတယ်။
ချည်နှောင်မှု။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Account` အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- `id`: တရားဝင် `AccountId`
- `metadata`: ကျင့်သုံးတဲ့ အကောင့် metadata
- `label`: ရွေးချယ်စရာ stable alias
- `uaid`: ရွေးချယ်စရာ Universal Account ID အသုံးပြုသူ Nexus စီးဆင်းမှု
- `opaque_ids`: အကောင့်ရဲ့ စာရင်းနဲ့ ချိတ်ဆက်ထားတဲ့ မရှင်းလင်းတဲ့ ID တွေ UAID

အကောင့်တစ်ခု ဖန်တီးဖို့ အသုံးပြုတဲ့ ငွေချေးမှု အသုံးဝင် ဝန်ဆောင်မှုက `NewAccount`. ဒါက သယ်ဆောင်ပါတယ်။
တူညီတဲ့ ကိုယ်ပိုင်လက္ခဏာ၊ မက်တာဒေတာ၊ တံဆိပ် UAID, ပြီးတော့ မရှင်းလင်းတဲ့ ID အသုံးပြုသော ကွင်းများ
မှတ်ပုံတင်စာရင်း။

`uaid` ကနောနိကကို ဖြည့်စွက်ပေးသည် `AccountId`; ဒါကို အစားမထိုးဘူး။ သုံးပါ။
ဘယ်အချိန်မှာ Nexus ဝန်ဆောင်မှုတွေမှာ တည်ငြိမ်တဲ့ အသုံးပြုသူ (သို့) အဖွဲ့အစည်း လက်ကိုင်တစ်ခု လိုအပ်ပါတယ်။
ဒေတာနေရာများ၊ ပုဂ္ဂလိကဘဝကို ထိန်းသိမ်းရန် မှတ်ပုံတင်ခြင်း သို့မဟုတ် ဝန်ဆောင်မှု အရည်အသွေးရှာဖွေခြင်း။
Runtime က တစ်နဲ့တစ်ကို ထိန်းထားတယ်။ UAID-စာရင်းအင်းအတွက် အညွှန်းကိန်း၊ မရှင်းလင်းတဲ့ မှတ်သားစရာတွေ လိုအပ်တယ်။
A မှတစ်ဆင့် ချိတ်ဆက်ရန် UAID, နှစ်ထပ် သို့မဟုတ် တိုက်မိမှု opaque ကို ပယ်ချတယ်။
မှတ်သားချက်များ။
[FHE နှင့် UAID](/my/blockchain/sora-nexus-services.md#fhe-and-uaid) အတွက် Nexus
ဝန်ဆောင်မှု အလွှာ စီးဆင်းမှု။

## အကောင့်ထိန်းချုပ်သူများ {#account-controllers}

Controller က Account က လုပ်ဆောင်ချက်တွေကို ဘယ်လို ခွင့်ပြုလဲဆိုတာ သတ်မှတ်တယ်။
flow က Ed25519 key pair ကိုသုံးတယ် ဒါပေမယ့် data model ကလည်း Richer ကိုထောက်ပံ့ပါတယ်
လက်မှတ်ပေါင်းစုံ မူဝါဒထိန်းချုပ်ရေးကိရိယာလို ထိန်းချုပ်ရေး ကိရိယာများ။

Client Configuration သည် လက်မှတ်ရေးထိုးခွင့်ကို peer မှ သီးခြား သိမ်းဆည်းထားသည်
ဖွဲ့စည်းပုံ

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

ကြည့်ပါ။ [Client ကို configuration](/my/guide/configure/client-configuration.md) နှင့်
[အဓိကမျိုးဆက်](/my/guide/security/generating-cryptographic-keys.md) အတွက်
လက်ရှိ key formats တွေ။

## ဒါကို စမ်းကြည့်ပါ။ Taira {#try-it-on-taira}

ကနောကျမ်းစာအချို့ကို ဖော်ပြပါ IDs အများပြည်သူထံမှ Taira testnet:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

အကောင့်အင်းအမြစ်ကို စစ်ဆေးရန် အကောင့်ကို ကူးယူပါ ID ပထမအခေါက်ကတည်းက URL- ကုဒ်
ဒါကို လမ်းကြောင်းမှာ မထားခင်ပါ။ Python snippet က ဒါကို ပထမဆုံးလုပ်တယ်။
စာရင်းဝင်စာရင်း:

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

အကောင့်တစ်ခု ဖန်တီးခြင်း (သို့) မွမ်းမံခြင်းဟာ လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှုပါ။
ရေနွေးကြိုးမှ ရင်းနှီးမြှုပ်နှံရန် လိုအပ်ပါသည်။ Taira အပိုင်း (၁)
[ချိတ်ဆက် SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md).

## မှတ်ပုံတင်ခြင်းနှင့် ခွင့်ပြုချက်များ {#registration-and-permissions}

မှတ်ပုံတင်ထားပြီး မှတ်ပုံတင်မထားသေးတဲ့ အကောင့်များ
[`Register` နှင့် `Unregister`](/my/blockchain/instructions.md#un-register)
ညွှန်ကြားချက်။ Active Runtime validator က ဘယ်သူက အကောင့်တွေ ဖန်တီးနိုင်မလဲဆိုတာ ဆုံးဖြတ်ပေးတယ်။
ဘယ်လို ခွင့်ပြုချက် လက်မှတ်တွေ (သို့) အခန်းကဏ္ဍတွေ လိုအပ်လဲဆိုတာပါ။

မှတ်ပုံတင်ပြီးနောက် အကောင့်တစ်ခုက:

- ငွေပေးချေမှုကို လက်မှတ်ထိုးခြင်း
- ပိုင်ဆိုင်မှု အရင်းအမြစ်များ
- ကိုယ်ပိုင်ဒေသများ
- Roles နဲ့ permission tokens တွေကို လက်ခံရရှိဖို့
- သိုလှောင်ထားသော metadata
- အမည်မဖော်လိုသူ၊ ပြန်လည်ထူထောင်ရေး၊ Nexus အမည်က စီးဆင်းသွားတဲ့အခါ
  features တွေကို enable လုပ်ထားတယ်

## အမည်ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-identity-issues}

ငွေပေးချေမှုတစ်ခု မမျှော်လင့်ဘဲ ပယ်ချခံရရင်

- client public key က လက်မှတ်ရေးထိုးဖို့ အသုံးပြုတဲ့ private key နဲ့ ကိုက်ညီပါတယ်။
- စာရင်းကို ဘီဘီစီမှာ မှတ်ပုံတင်ထားခဲ့သည် (သို့) ချုပ်ဆိုထားသော ငွေပေးချေမှုတစ်ခုဖြင့်
- အာဏာပိုင်က ညွှန်ကြားချက်အရ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေရှိတယ်
- stringent account field တွေမှာ canonical ကိုသုံးတယ်။ I105 အကောင့် ID, ဖတ်လို့ရတဲ့ အခါမှာ
  အမည်များကို Active Account alias binding ဖြင့် ဖြေရှင်းပေးပါသည်။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [ခွင့်ပြုချက်များ](/my/blockchain/permissions.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [Client ဖွဲ့စည်းပုံ](/my/guide/configure/client-configuration.md)
- [SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md)
