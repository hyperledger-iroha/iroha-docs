---
translation_locale: my
translation_source: /blockchain/accounts.md
translation_source_hash: d956bfb8c698fa463ef9fa84a91d50cf0e2100885eba670121ad78753f87d88d
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# အကောင့်များ {#accounts}

အကောင့်သည် transaction များကို လက်မှတ်ထိုးနိုင်ပြီး လယ်ဂျာ အခြေအနေကို ပိုင်ဆိုင်နိုင်သော authority ဖြစ်သည်။ လက်ရှိ Iroha 3 ဒေတာမော်ဒယ်တွင် `AccountId` သည် စံသတ်မှတ်ထားသော တစ်သမတ်တည်းပုံစံဖြစ်ပြီး domain မပါဝင်ပါ။ ၎င်းကို အကောင့်ထိန်းချုပ်သူမှ ဆင်းသက်ရယူပြီး [I105](/my/reference/i105.md) အဖြစ် စံပုံစံအတိုင်း ကုဒ်သွင်းသည်။ လူဖတ်ရှုနိုင်သော domain နှင့် data space ဆိုင်ရာ အကြောင်းအရာသည် သီးခြား အကောင့် alias ချိတ်ဆက်မှုများတွင် ရှိသည်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Account` တွင်:

- `id`: Single Protocol Standard `AccountId`
- `metadata`: အလိုလိုစာရင်း metadata များ
- `label`: ရွေးချယ်စရာ stable alias
- `uaid`: SORA Nexus လုပ်ငန်းစဉ်များတွင် အသုံးပြုသော မဖြစ်မနေမဟုတ်သည့် Universal Account ID
- `opaque_ids`: အကောင့်၏ UAID သို့ ချိတ်ဆက်ထားသော မရှင်းလင်းသော မှတ်သားချက်များ

အကောင့်ဖန်တီးရန် သုံးသည့် transaction payload သည် `NewAccount` ဖြစ်သည်။ မှတ်ပုံတင်ပြီး အကောင့်တွင် သုံးသည့် အထောက်အထား၊ metadata၊ အညွှန်း၊ UAID နှင့် အတွင်းအဓိပ္ပာယ်မဖော်ပြသော သတ်မှတ်နံပါတ် အကွက်များကိုပင် ၎င်းက သယ်ဆောင်သည်။

`uaid` သည် စံသတ်မှတ်ထားသော `AccountId` ကို ဖြည့်စွက်ပေးခြင်းဖြစ်ပြီး အစားထိုးခြင်း မဟုတ်ပါ။ SORA Nexus ဝန်ဆောင်မှုများတွင် data space များအကြား တည်ငြိမ်သော အသုံးပြုသူ သို့မဟုတ် အဖွဲ့အစည်း handle၊ ကိုယ်ရေးလုံခြုံမှုကို ထိန်းသိမ်းသော စာရင်းသွင်းမှု သို့မဟုတ် ဝန်ဆောင်မှုစွမ်းရည် ရှာဖွေမှု လိုအပ်သောအခါ ၎င်းကို အသုံးပြုပါ။ လုပ်ဆောင်မှုစနစ်သည် UAID နှင့် အကောင့်အကြား တစ်ခုနှင့်တစ်ခု ကိုက်ညီသော အညွှန်းကို ထိန်းသိမ်းပြီး အတွင်းအဓိပ္ပါယ် မဖော်ပြသော identifier များကို UAID မှတစ်ဆင့် ချိတ်ဆက်ရန် လိုအပ်ကာ ထပ်နေသော သို့မဟုတ် တိုက်ဆိုင်နေသော identifier များကို ငြင်းပယ်သည်။ SORA Nexus ဝန်ဆောင်မှုအလွှာ၏ လုပ်ငန်းစဉ်ကို [FHE နှင့် UAID](/my/blockchain/sora-nexus-services.md#fhe-and-uaid) တွင် ကြည့်ပါ။

## Account controller များ {#account-controllers}

အကောင့်က လုပ်ဆောင်ချက်များကို မည်သို့ခွင့်ပြုမည်ကို controller က သတ်မှတ်သည်။ ပုံမှန် client လုပ်ငန်းစဉ်တွင် Ed25519 ကီးအတွဲကို သုံးသော်လည်း ဒေတာမော်ဒယ်သည် လက်မှတ်များစွာလိုအပ်သည့် မူဝါဒ controller ကဲ့သို့ ပိုမိုစုံလင်သော controller များကိုလည်း ပံ့ပိုးသည်။

Client ပြင်ဆင်သတ်မှတ်မှုတွင် လက်မှတ်ထိုးသည့် authority အကောင့်ကို peer ပြင်ဆင်သတ်မှတ်မှုနှင့် သီးခြား သိမ်းဆည်းသည်။

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

လက်ရှိ ကီးပုံစံများအတွက် [client ပြင်ဆင်သတ်မှတ်မှု](/my/guide/configure/client-configuration.md) နှင့် [ကီးထုတ်လုပ်ခြင်း](/my/guide/security/generating-cryptographic-keys.md) ကို ကြည့်ပါ။

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira စစ်ဆေးရေးကွန်ရက်မှ Single Protocol Standard Account ID များကို ဖော်ပြပါ-

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.label // "-")] | @tsv'
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

ဤလုပ်ဆောင်ချက်များသည် အများပြည်သူ ဖတ်ရှုနိုင်သော လုပ်ဆောင်ချက်များဖြစ်သည်။ အကောင့်ဖန်တီးခြင်း သို့မဟုတ် အပ်ဒိတ်လုပ်ခြင်းသည် လက်မှတ်ထိုးထားသော transaction ဖြစ်ပြီး [Taira နှင့် Minamoto ကို အသုံးပြု၍ SORA Nexus ပေါ်တွင် တည်ဆောက်ခြင်း](/my/get-started/sora-nexus-dataspaces.md) တွင် ဖော်ပြထားသည့် faucet မှ ငွေဖြည့်ထားသော Taira ပြင်ဆင်မှု လိုအပ်သည်။

## မှတ်ပုံတင်ခြင်းနှင့် ခွင့်ပြုချက်များ {#registration-and-permissions}

အကောင့်များကို ယေဘုယျ [`Register` နှင့် `Unregister`](/my/blockchain/instructions.md#un-register) ညွှန်ကြားချက်များဖြင့် မှတ်ပုံတင်ခြင်းနှင့် မှတ်ပုံတင်ပယ်ဖျက်ခြင်း ပြုလုပ်သည်။ လက်ရှိ runtime ၏ စစ်ဆေးသူ က မည်သူသည် အကောင့်ဖန်တီးနိုင်ကြောင်းနှင့် မည်သည့် ခွင့်ပြုချက် token များ သို့မဟုတ် role များ လိုအပ်ကြောင်းကို ဆုံးဖြတ်သည်။

မှတ်ပုံတင်ပြီးနောက် အကောင့်တစ်ခုမှာ:

- ငွေပေးချေမှု လက်မှတ်ထိုးခြင်း
- ရင်းနှီးမြုပ်နှံမှု
- ကိုယ်ပိုင်ဒေသများ
- အခန်းကဏ္ဍများနှင့် ခွင့်ပြုချက် လက်မှတ်များကို ရရှိရန်
- သိုလှောင်ထားသော metadata
- သက်ဆိုင်ရာလုပ်ဆောင်ချက်များ ဖွင့်ထားသောအခါ alias၊ ကီးအစားထိုးခြင်း၊ ပြန်လည်ရယူခြင်းနှင့် SORA Nexus အထောက်အထား လုပ်ငန်းစဉ်များတွင် ပါဝင်ရန်

## ကိုယ်ပိုင်လက္ခဏာပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-identity-issues}

ရောင်းဝယ်မှုကို မမျှော်လင့်ဘဲ ပယ်ချလိုက်ရင်:

- client ၏ အများသုံးကီးသည် လက်မှတ်ထိုးရန် သုံးသည့် ကိုယ်ပိုင်ကီးနှင့် ကိုက်ညီရမည်
- အကောင့်က blockchain genesis မှာ မှတ်ပုံတင်ထားတယ် (သို့) ပြီးဆုံးသွားတဲ့ ငွေပေးချေမှုတစ်ခုမှာ
- ခွင့်ပြုချက်ရသူမှာ ညွှန်ကြားချက်အရ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေရှိတယ်
- stringent account field တွေမှာ single protocol-standard I105 account ID ကိုသုံးပြီး ဖတ်လို့ရတဲ့ နာမည်တွေကို active account alias binding နဲ့ ဖြေရှင်းပေးပါတယ်။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [ခွင့်ပြုချက်များ](/my/blockchain/permissions.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [SORA Nexus data space များ](/my/get-started/sora-nexus-dataspaces.md)
