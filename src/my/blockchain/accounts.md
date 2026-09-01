---
translation_locale: my
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အကောင့်များ {#accounts}

Iroha 3 ဒေတာပုံစံတွင်, `AccountId` သည် single protocol-standard နှင့် domainless ဖြစ်သည်။ အကောင့်ထိန်းချုပ်ရေးမှူးထံမှ ရယူထားပြီး [I105](/my/reference/i105.md) အဖြစ် Single Protocol Standard ပုံစံတွင် ကုဒ်သွင်းထားသည်။ လူသားဖတ်ရှုနိုင်သော Domain နှင့် Data Space အခြေအနေသည် သီးခြား Account-alias ချုပ်နှောင်ချက်များထဲ ပါဝင်သည်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Account` တွင်:

- `id`: Single Protocol Standard `AccountId`
- `metadata`: အလိုလိုစာရင်း metadata များ
- `label`: ရွေးချယ်စရာ stable alias
- `uaid`: ရွေးချယ်စရာ Universal Account ID ကို Nexus စီးဆင်းမှုအတွက် အသုံးပြုသည်။
- `opaque_ids`: အကောင့်၏ UAID သို့ ချိတ်ဆက်ထားသော မရှင်းလင်းသော မှတ်သားချက်များ

အကောင့်တစ်ခု ဖန်တီးရန် အသုံးပြုသော ငွေချေးမှု အသုံးဝင်မှုသည် `NewAccount` ဖြစ်သည်။ ၎င်းတွင် မှတ်ပုံတင်ထားသည့် အကောင့်က သုံးသော Identity, Metadata, Label, UAID နှင့် opaque ID ကွင်းများနှင့်အတူတူပါသည်။

`uaid` သည် Single Protocol-Standard `AccountId` ကိုဖြည့်စွက်ပေးသည်၊ ၎င်းကိုအစားထိုးခြင်းမဟုတ်ပါ။ Nexus ဝန်ဆောင်မှုများအတွက်ဒေတာနေရာများအကြား တည်ငြိမ်သောအသုံးပြုသူ သို့မဟုတ် အဖွဲ့အစည်းကိုင်တွယ်မှုလိုအပ်တဲ့အခါ အသုံးပြုပါ ဆော့ဖ်ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်သည် တစ်မှတစ်ဆင့် UAID-ကောင့်ညွှန်းကိန်းကို ထိန်းသိမ်းထားသည်၊ ပွင့်လင်းမြင်သာမှုမရှိသော မှတ်သားစရာများကို UAID မှတစ်ဆင့် ချိတ်ဆက်ရန်လိုအပ်ပြီး နှစ်ထပ် သို့မဟုတ် တိုက်မိသည့် ပွင့်လင်းမမြင်သာတဲ့ မှတ်သားစရာတွေကို ငြင်းပယ်သည်။ Nexus ဝန်ဆောင်မှု အလွှာ စီးဆင်းမှုအတွက် [FHE နှင့် UAID](/my/blockchain/sora-nexus-services.md#fhe-and-uaid) ကိုကြည့်ပါ။

## Account controller များ {#account-controllers}

Controller က အကောင့်က လုပ်ဆောင်ချက်တွေကို ဘယ်လို ခွင့်ပြုတယ်ဆိုတာကို သတ်မှတ်ပါတယ်။ Default client flow မှာ Ed25519 key pair ကိုသုံးပေမဲ့ data model ကလည်း multisignature policy controller တွေလို ချမ်းသာတဲ့ controllers တွေကို ထောက်ပံ့ပါတယ်။

Client Configuration က Signature Authorization Principle ကို Network Peer Configuration နဲ့ သီးခြား သိမ်းထားတယ်။

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

[Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md) နှင့် [အဓိကမျိုးဆက်](/my/guide/security/generating-cryptographic-keys.md) တို့ကို ကြည့်ပါ။

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira စစ်ဆေးရေးကွန်ရက်မှ Single Protocol Standard Account ID များကို ဖော်ပြပါ-

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Account assets တွေကို စစ်ဆေးဖို့ ပထမဦးဆုံး Technical invocation ကနေ account ID ကို ကူးယူပြီး path ထဲမထည့်ခင် URL-encode လုပ်ပါ။ ဒီ Python snippet ကတော့ ပထမဆုံးစာရင်းတင်ထားတဲ့ account အတွက် ဒီလိုလုပ်ပါတယ်။

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

အကောင့်တစ်ခု ဖန်တီးခြင်း (သို့) မွမ်းမံခြင်းသည် လက်မှတ်ထိုးထားသော ငွေပေးချေမှုဖြစ်ပြီး [SORA Nexus ဒေတာနေရာများနှင့် ချိတ်ဆက်ခြင်း](/my/get-started/sora-nexus-dataspaces.md) တွင်ဖော်ပြထားသည့် testnet မှထောက်ပံ့သော Taira setup ကိုလိုအပ်သည်။

## မှတ်ပုံတင်ခြင်းနှင့် ခွင့်ပြုချက်များ {#registration-and-permissions}

စာရင်းမှတ်ပုံတင်ထားပြီး မှတ်ပုံတင်မထားသေးတဲ့စာရင်း [`Register` နှင့် `Unregister`](/my/blockchain/instructions.md#un-register) ညွှန်ကြားချက်များ။ Active software execution environment ကို validator က ဆုံးဖြတ်ပေးတယ်။ မည်သူက အကောင့်တွေ ဖန်တီးနိုင်ပြီး ဘယ်ခွင့်ပြုချက် လက်မှတ်များ (သို့) အခန်းကဏ္ဍများ လိုအပ်လဲ။

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
- အကောင့်က blockchain genesis မှာ မှတ်ပုံတင်ထားတယ် (သို့) ပြီးဆုံးသွားတဲ့ ငွေပေးချေမှုတစ်ခုမှာ
- ခွင့်ပြုချက်ရသူမှာ ညွှန်ကြားချက်အရ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေရှိတယ်
- stringent account field တွေမှာ single protocol-standard I105 account ID ကိုသုံးပြီး ဖတ်လို့ရတဲ့ နာမည်တွေကို active account alias binding နဲ့ ဖြေရှင်းပေးပါတယ်။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [ခွင့်ပြုချက်များ](/my/blockchain/permissions.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md)
