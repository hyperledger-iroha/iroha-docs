---
translation_locale: my
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ {#real-world-assets}

Real-world assets (RWAs) သည်အပိုင်ဆိုင်မှု သို့မဟုတ် ထိန်းချုပ်မှုကိုကွင်းဆက်ပေါ်တွင် ခြေရာခံထားသောချိတ်ဆက်ပြင်ပအရင်းအမြစ်ပုံစံဖြစ်သည်။ Iroha တွင် RWA သည်ထုတ်လုပ်သည့်မှတ်ပုံတင်မှတ်တမ်း၊ ပိုင်ရှင်စာရင်း၊ အရေအတွက်တစ်ခု၊ စီးပွားရေးမီတာဒေတာများ၊ မူလနေရာနှင့်ရွေးချယ်စရာသက်တမ်းလည်ပတ်ရေးစက်ဝန်းထိန်းချုပ်မှုများရှိသည့် မှတ်ပုံတင် blockchain ledger များဖြစ်သည်။

RWAs သည် ကိန်းဂဏန်းအရ အရင်းအမြစ်လက်ကျန်များနှင့် ကွဲပြားသည်။

- ဂဏန်းအရင်းအမြစ်ဆိုသည်မှာ အကောင့်တစ်ခုတွင် ထိန်းသိမ်းထားသော fungible balance ဖြစ်ပါသည်။
- NFT ဆိုသည်မှာ တစ်ခုတည်းသော ပိုင်ရှင်တစ်ဦးနှင့်အတူ တသီးတသန့် ချိတ်ဆက်ထားသည့် မှတ်တမ်းဖြစ်ပါသည်။
- RWA ဆိုသည်မှာ လုပ်ငန်းဆိုင်ရာ metadata များ၊ အရေအတွက်များ၊ သိမ်းဆည်းထားမှုများ၊ အအေးခံခြင်း၊ ပြန်လည်ဖြည့်စွက်မှုအခြေအနေများ၊ မူလနေရာများနှင့် ထိန်းချုပ်သူ၏မူဝါဒများကို သယ်ဆောင်နိုင်သော ပဲရစ်ဖြစ်သည်။

RWAs ကို blockchain ledger သည် fungible balance တစ်ခုတည်းမဟုတ်ဘဲ specific off-chain lot တစ်ခုကို ကိုယ်စားပြုရန်လိုအပ်သည့်အခါ အသုံးပြုပါ။

## RWA ပမာဏ {#rwa-lot}

RWA အပိုင်းတွင် အောက်ပါအတိုင်း ပါဝင်သည်-

- `id`: ထုတ်ပေးသော Single Protocol Standard RWA ID ကို `<hash>$<domain>` အဖြစ် ပြသသည်။
- `owned_by`: လက်ရှိတွင် လတ်တလောပိုင်ဆိုင်နေသော အကောင့်
- `quantity`: အစုလိုက်အပြုံလိုက် ကိုယ်စားပြုထားသော ကြွင်းချက်အရေအတွက်
- `spec`: ဒသမကိန်းအတိုင်းအတာလို အရေအတွက်သတ်မှတ်ချက်။
- `primary_reference`: အဓိက ချိတ်ဆက်မှုအပြင် ပရိုတိုကောလ် ရလဒ် မှတ်တမ်း၊ လက်မှတ်၊ ငွေစက္ကူ (သို့) မှတ်ပုံတင် အညွှန်း
- `status`: လုပ်ငန်းအခြေအနေ စာသားကို ရွေးချယ်ပါ။
- `metadata`: စီးပွားရေးအခြေအနေနှင့် ညွှန်းကိန်းတင်ခြင်းအတွက် အသုံးပြုသော အသေးစား JSON ကွင်းများ။
- `parents`: ဤပမာဏကို ထုတ်ယူရန် အသုံးပြုသော အရင်းအမြစ်များ
- `controls`: ထိန်းချုပ်သူစာရင်း၊ ထိန်းချုပ်သူအခန်းကဏ္ဍများနှင့် ထိန်းချုပ်သူလုပ်ငန်းများကို ခွင့်ပြုထားသည်
- `is_frozen` နှင့် `held_quantity`: ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်က အားဖြည့်ပေးသော သက်တမ်းပတ်ဝန်းကျင် အခြေအနေ

WSV အပြင်တွင် ဥပဒေဆိုင်ရာ စာရွက်စာတမ်းကြီးများ၊ စစ်ဆေးမှု အစီရင်ခံစာများနှင့် စစ်ဆေးရေး ဘက်ဂျက်များကို သိုလှောင်ထားပြီးနောက် URI, SoraFS လမ်းကြောင်း (သို့မဟုတ်) နည်းပညာ အထောက်အထားကို RWA မီတာဒေတာထဲ ထည့်ပါ။

## အထောက်အထားများ {#identifiers}

`RegisterRwa` သည် requesting client-selected `id` ကိုလက်မခံဘဲ၊ `owner` field ကိုလည်း လက်မခံပါ။ transaction authorization principal သည်ပထမဆုံး `owned_by` အကောင့်ဖြစ်လာပြီး software စီမံခန့်ခွဲမှု ပတ်ဝန်းကျင်က ရည်မှန်းချက်ဒိုမီနိုင်မှာ `RwaId` ကိုဖန်တီးတယ်။

RWA ID ရဲ့ စာသားပုံစံက-

```text
<generated-hash>$<domain>
```

ဥပမာ-

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

`primary_reference` သို့မဟုတ် `metadata` တွင် လျှောက်လွှာများ၏ လုပ်ငန်းအမှတ်တံဆိပ်ကို သိမ်းထားပြီးနောက် `RwaEvent::Created`, `FindRwas`၊ `/v1/rwas` မှထုတ်လုပ်သော `RwaId` သို့မဟုတ် ငွေပေးချေမှု ပြီးဆုံးပြီးနောက် သတ်မှတ်ထားသည့် စူးစမ်းရှာဖွေရေးလမ်းကြောင်းကို ရှာဖွေရန် လိုအပ်သည်။

## သက်တမ်း စက်ဝန်း {#lifecycle}

ပုံမှန် RWA အလုပ်ဖြစ်စဉ်များမှာ အောက်ပါအရာတွေ ပါဝင်ပါတယ်။

|လုပ်ဆောင်ချက်|အကောင်အထည်ဖော်ထားသော အပြုအမူ|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Domain တစ်ခုမှာ Generated-ID Lot ကို ဖန်တီးပါ။ ငွေပေးချေခွင့်ပြုမှု မူလကိန်းက `owned_by` ဖြစ်လာတယ်။ |
|`TransferRwa` |တစ်ခြားအကောင့်သို့အရေအတွက်ပြောင်းပါ။ အပြည့်အဝလွှဲပြောင်းခြင်းသည် `owned_by` ကိုပြောင်းလဲနိုင်သည်။ တစ်စိတ်တစ်ပိုင်းလွှဲပြောင်းမှုသည်ထုတ်လုပ်သော ID နှင့်အတူ သီးသန့်ကလေးစုကိုဖန်တီးသည်။ |
|`HoldRwa` |ထိန်းချုပ်ရေးကိရိယာနဲ့ `hold_enabled` ကို သတ်မှတ်ဖို့ လိုအပ်ပါတယ်။|
|`ReleaseRwa` |ထိန်းသိမ်းထားသော ပမာဏကို ဖယ်ရှားပါ။ configured controller နဲ့ `hold_enabled` ကိုလိုအပ်တယ်။ |
|`FreezeRwa` |သာမန်ပိုင်ရှင် လုပ်ငန်းတွေကို ပိတ်လိုက်ပါ Configured controller နဲ့ `freeze_enabled` လိုပါတယ်။ |
|`UnfreezeRwa` |ပုံမှန်ပိုင်ရှင် လုပ်ငန်းတွေကို ပြန်လည်ဖွင့်ပေးပါ။ ကွန်ပြူတာ ထိန်းချုပ်ရေးစနစ်နဲ့ `freeze_enabled` ကို လိုအပ်ပါတယ်။ |
|`RedeemRwa` |အရေအတွက်ကို လည်ပတ်မှုမှအမြဲတမ်း နှုတ်ယူပါ။ `redeem_enabled` မှန်တဲ့အခါ ပိုင်ရှင် (သို့) ထိန်းချုပ်သူက တင်ပြနိုင်ပါတယ်။ |
|`MergeRwas` |တူညီတဲ့ နယ်ပယ်နဲ့ သီးခြားသတ်မှတ်ချက်ရှိတဲ့ မိဘအစုတွေကနေ ထုတ်ထားတဲ့ ကလေးအစုကို ပေါင်းစပ်ပါ။ |
|`ForceTransferRwa` |Controller စီးဆင်းမှုတစ်ခုမှတစ်ဆင့် အရေအတွက်ကို ရွေ့ရှားပါ။ configured controller နှင့် `force_transfer_enabled` ကိုလိုအပ်သည်။ |
|`SetRwaControls` |ပဲခူးထိန်းချုပ်ရေး မူဝါဒကို အစားထိုးပါ။ ပိုင်ရှင် (သို့) ထိန်းချုပ်သူ လိုအပ်တယ်။|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |အစု metadata ကို update လုပ်ပါ။ ပိုင်ရှင် (သို့) ထိန်းချုပ်သူကို လိုအပ်တယ်။ အေးခဲတဲ့ အစုတွေက ထိန်းချုပ်သူလိုပါတယ်။ |

လက်ရှိကုဒ်မှာ `UnregisterRwa` မှာ ညွှန်ကြားချက်မရှိပါ။ ကိုယ်စားပြုထားတဲ့ ပမာဏကို ပို့ပေးတဲ့အခါ၊ စားသုံးတဲ့အခါ၊ သတ်မှတ်တဲ့အခါ (သို့) အခြားနည်းနဲ့ လည်ပတ်မှုကနေ ဖယ်ရှားတဲ့အခါ `RedeemRwa` နဲ့ ချိတ်ဆက်ထားတဲ့ လတ်တစ်လတ်ကို ဖျက်သိမ်းဖို့ပါ။

## Metadata နှင့် Controls များ {#metadata-and-controls}

အသေးစိတ် အချက်အလက်များအတွက် metadata များကို အသုံးပြုပြီး အက်ပ်များကို လတ်တလောတွင် ရှာဖွေ၊ စစ်ဆေးနိုင်ရန် ကူညီပေးပါမည်။

- ရင်းနှီးမြှုပ်နှံမှု အမျိုးအစား၊ ထုတ်ပြန်သူ၊ ထိန်းသိမ်းသူ သို့မဟုတ် မှတ်ပုံတင် အညွှန်း
- သိုလှောင်ရုံ၊ ထုပ်ပိုးခန်း၊ ISIN, ငွေစက္ကူစာရင်း (သို့) လိုင်စင်အမှတ်တံဆိပ်
- Certifications နှင့် Legal Documents များအတွက် content cryptographic hashes များ
- SoraFS ပိုကြီးမားတဲ့ အထောက်အထားအစုအတွက် လမ်းကြောင်းများ (သို့) နည်းပညာထုတ်ပြန်ချက် ကိုးကားမှု။
- Off-chain ဝန်ဆောင်မှုများမှ အသုံးပြုသော maturity, jurisdiction သို့မဟုတ် compliance tags များ

အကောင်အထည်ဖော်ထားသော `RwaControlPolicy` တွင် အောက်ပါ ကွင်းများရှိသည် -

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

Controller အကောင့်များနှင့် Roles များသည် သက်ဆိုင်ရာ Boolean Flag များမှအခွင့်ပြုသောလုပ်ဆောင်ချက်များကိုသာဆောင်ရွက်နိုင်သည်။ လက်ရှိထိန်းချုပ်မှု အသုံးဝင်မှုတွင် Controller Identities နှင့် Operation Flag များပါဝင်သည်။ Transfer allow-lists နှင့် nested `transfers` စည်းမျဉ်းများသည်ဤအသုံးဝင်မှု၏အပြင်သို့ဖြစ်သည်။

## မေးမြန်းချက်များ၊ ဖြစ်ရပ်များနှင့် APIs {#queries-events-and-apis}

အသုံးပြုခြင်း [`FindRwas`](/my/reference/queries.md#assets-nfts-and-rwas) မှတ်ပုံတင်ခြင်း RWA တိုက်ရိုက် update တွေလိုတဲ့ Application တွေက subscribe လုပ်လို့ရပါတယ်။ [`Rwa` ဒေတာဖြစ်ရပ်များ](/my/blockchain/filters.md#data-event-filters) ဖန်တီး၊ ပိုင်ရှင်ပြောင်း၊ ခွဲ၊ ပေါင်းစပ်၊ ပြန်လည်ဝယ်၊ အေးခဲ၊ မအေးခဲ ကျင်းပ၊ ထုတ်လွှတ်ခြင်း၊ အင်အားလွှဲပြောင်းခြင်း၊ ထိန်းချုပ်မှု ပြောင်းလဲခြင်းနှင့် မီတာဒေတာဖြစ်ရပ်များ။

Torii ကွင်းဆက်အခြေအနေလမ်းကြောင်းများကို ဖေါ်ပြထားသည် `/v1/rwas` နှင့် `/v1/rwas/query`, ဒါ့အပြင် စူးစမ်းရှာဖွေရေးလမ်းကြောင်းတွေလည်း ရှိပါတယ်။ `/v1/explorer/rwas` နှင့် `/v1/explorer/rwas/{rwa_id}` ဒီလမ်းကြောင်းမိသားစုကို ဖွင့်ထားတဲ့အခါ Generated Client တွေက Live [`/openapi.json`](/my/reference/torii-endpoints.md#common-endpoints) node တစ်ခုက ဖော်ပြတဲ့ တိကျတဲ့ တုံ့ပြန်မှုပုံစံအတွက် စာရွက်စာတမ်းပါ။

### Taira တွင် ဤလုပ်ငန်းစဉ်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira ကတော့ လက်ရှိမှာ RWA ပွဲတွေ မှတ်ပုံတင်ထားလားဆိုတာ စစ်ဆေးပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

စာရင်းပေးပါ RWA တိုက်ရိုက် ထုတ်လွှင့်ထားသော လမ်းကြောင်းများ Taira OpenAPI စာရွက်စာတမ်း:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

ပွင့်လင်းသော `items` ထုတ်လွှင့်မှုသည် အများပြည်သူအတွက် မှတ်ပုံတင်ထားခြင်း မရှိသေးသည့်အခါ မျှော်လင့်ရသည်။ မှတ်ပုံတင်ခြင်း၊ လွှဲပြောင်းခြင်း၊ ထိန်းသိမ်းခြင်း၊ အအေးခံခြင်းနှင့် ပြန်လည်ဝယ်ယူခြင်းတို့သည် လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုများဖြစ်သည်။

## စမ်းကြည့်ပါ {#try-it}

အောက်ပါဥပမာများသည် Python SDK မျက်နှာပြင်များကို [မျှဝေထားသော Setup](/my/guide/tutorials/python.md#shared-setup) မှအသုံးပြုသည်။ ငွေပေးချေမှု မတင်မီတွင် အကောင့် ID များ၊ ပုဂ္ဂလိက သော့များနှင့် ထုတ်လုပ်သော အစုအဝေး ID များကို မိမိ၏ ကွန်ရက်မှ တန်ဖိုးများဖြင့် အစားထိုးပါ။

### ရှာဖွေပါ RWA API လမ်းကြောင်းများ {#discover-rwa-api-routes}

Read Only နမူနာမှာ Running Torii node ကို App-facing RWA လမ်းကြောင်းတွေကို ဖွင့်ထားတာကို တောင်းဆိုပါတယ်။

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

စာရင်းက အလွတ်ဖြစ်ပါက RWA ညွှန်ကြားချက်များနှင့် အခြား Torii APIs မှတစ်ဆင့် မေးမြန်းမှုများကို node ကထောက်ပံ့နိုင်သော်လည်း ရွေးချယ်စရာ JSON လမ်းကြောင်းမိသားစုကို ဖော်ပြခြင်းမရှိပါ။

### Warehouse Protocol ရလဒ် မှတ်တမ်းကို မှတ်ပုံတင်ပါ။ {#register-a-warehouse-receipt}

လုပ်ငန်းဆောင်ရွက်မှုတစ်ခုဟာ လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှုတစ်ခု ဖြစ်လာတဲ့အခါ မူကြမ်းကို အသုံးပြုပါ။ စီးပွားရေးပရိုတိုကော ရလဒ် မှတ်တမ်းနံပါတ်သည် `primary_reference` သို့သွားပြီး ငွေပေးချေးမှု ပြီးဆုံးပြီးနောက် blockchain ledger ID ကို ဖန်တီးသည်။

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

ငွေပေးချေမှု ပြီးဆုံးပြီးနောက် စာရင်းက RWA ID များကို ဖန်တီးသည်။ Chain-state လမ်းကြောင်းများတွင် တစ်ခုတည်းသော ပရိုတိုကောစံညွှန်း ID များကို ဖော်ပြထားသည်၊ ID ကို `primary_reference` သို့ ပြန်လည်သတ်မှတ်ရန်လိုအပ်တဲ့အခါ ဖြစ်ရပ်များ သို့မဟုတ် Explorer အသေးစိတ်လမ်းကြောင်းများကို အသုံးပြုပါ။

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Explorer ကို ခွင့်ပြုထားတဲ့ node တွေဟာ ပိုကြွယ်ဝတဲ့ projections တွေကိုလည်း ပြန်ပို့နိုင်ပါတယ်-

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### ယာယီရပ်ဆိုင်းခြင်းနှင့်အတူ ရွှေ့ပြောင်းခြင်း {#transfer-with-a-temporary-hold}

RWA ID ကို အသုံးပြုပြီး ချိတ်ဆက်မှုကနေ ပြန်ပို့ပေးပါ။ ဒီဥပမာမှာ `alice` သည်ပိုင်ရှင်ဖြစ်တယ်လို့ ယူဆပြီး `hold_enabled` နဲ့ ထိန်းချုပ်သူအဖြစ်လည်း သတ်မှတ်ထားတယ်။

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

`ReleaseRwa` ကို ချိတ်ဆက်မှုအပြင် လုပ်ငန်းစဉ် အောင်မြင်ပြီးနောက် တင်ပြပါ

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Controls နှင့် Audit Metadata များကိုထည့်သွင်းခြင်း {#add-controls-and-audit-metadata}

Controls နှင့် metadata တို့သည် သီးခြားဖြစ်ပါသည်။ Controller Policy အတွက် controls များကိုအသုံးပြုပြီး Applications သို့မဟုတ် Auditors တွေကပြသရန်လိုအပ်သော အချက်အလက်များအတွက် metadata ကိုသုံးပါ။

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ပြန်လည်သိမ်းဆည်းခြင်း (သို့) ထုတ်ပယ်ခြင်း ပမာဏ {#redeem-or-retire-quantity}

`RedeemRwa` ကို တင်သွင်းခြင်းသည် ကိုယ်စားပြုထားသော ကွင်းဆက်ပြင်ပ အရင်းအမြစ်ကို ပေးပို့ခြင်း၊ စားသုံးခြင်း၊ ဖျက်သိမ်းခြင်း သို့မဟုတ် အခြားနည်းလမ်းဖြင့် လည်ပတ်မှုမှ ဖယ်ရှားပြီးနောက်ဖြစ်သည်။ ဤအချက်က တင်ပြထားသော ပမာဏကို အစုအဝေးမှ အမြဲတမ်းနှုတ်ယူသည်။ ပမာဏမှာ `redeem_enabled` ရှိရမည်ဖြစ်သည်။ cryptographic လက်မှတ်ထိုးသူသည်ပိုင်ရှင် သို့မဟုတ် ထိန်းချုပ်သူဖြစ်ရမည်။

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### လိုက်နာမှု စစ်ဆေးရာတွင် အေးခဲစေခြင်း {#freeze-during-compliance-review}

`FreezeRwa` ကို တင်ပြပါ ၀ င်သည့်အခါ ချိတ်ဆက်မှုအပြင် စာရင်းစစ်ဆေးမှုက သာမန်ပိုင်ရှင်လုပ်ငန်းများကို ပိတ်ဆို့ရန်လိုအပ်သည်။ cryptographic လက်မှတ်ထိုးသူသည် ထိန်းချုပ်သူဖြစ်ရမည်ဖြစ်သည်။ Lot တွင် `freeze_enabled` ပါရှိရပါမည်။

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

`UnfreezeRwa` ကို ပြန်လည်စစ်ဆေးပြီးနောက် တင်ပြပါ-

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ငွေကြေးပေးချေမှု {#invoice-receivable}

ငွေပေးချေမှု စာရင်းကို RWA စာရင်းနံပါတ်ကို ထည့်သွင်းထားခြင်းဖြင့် `primary_reference` မှတ်ပုံတင်ပြီးနောက် ထုတ်ပေးထားတဲ့ ID ကို လွှဲပြောင်းဖို့နဲ့ ပြန်ဆပ်ဖို့ သုံးပါ။

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

ငွေကြေးပေးချေမှု (သို့) ပေးချေမှု ရှိပါက ထုတ်လုပ်ထားသော စာရင်းအင်း ID ကို အသုံးပြုပါ။

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

ရင်းနှီးမြှုပ်နှံမှုအပြင် ငွေကြေးပူးပေါင်းဆောင်ရွက်ချက်များကို ဖြေရှင်းပြီးနောက် ကိုယ်စားပြုထားသော ပမာဏကို ပြန်လည်ဖြည့်ဆည်းခြင်း

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ကာဗွန်ကရက်ဒစ် အငြိမ်းစား {#carbon-credit-retirement}

အဆိုပြုထားတဲ့ ကာဗွန်ကရက်ဒစ်များကို လည်ပတ်မှုမှ ဖယ်ရှားရန် `RedeemRwa` ကို တင်ပြပါ။ ကွင်းဆက်အပြင်မှာ ရှိတဲ့ လက်မှတ် (သို့) မှတ်ပုံတင် အထောက်အထားကို မီတာဒေတာထဲ သိမ်းဆည်းပါ။

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### နှစ်ခု ပေါင်းစပ်ပါ {#merge-two-lots}

Lots များကို ပေါင်းစပ်ခြင်းသည် ချိတ်ဆက်မှုအပြင် နေရာနှစ်ခု စုစည်းသောအခါဖြစ်ပါသည်။ မိဘများသည် domain တစ်ခုတည်းရှိပြီး အရေအတွက်သတ်မှတ်ချက်တစ်ခုတည်းကိုအသုံးပြုရမည်ဖြစ်သည်။ ဆော့ဝဲလုပ်ဆောင်ရေးဝန်းကျင်က child lot ID ကိုဖန်တီးသည်။

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Python ငွေပေးချေမှု အပြည့်အဝအတွက် [လက်တွေ့လောကဆိုင်ရာ အရင်းအမြစ်များ](/my/guide/tutorials/python.md#real-world-assets) ကို ကြည့်ပါ။

## ဆက်စပ်သော စာရွက်စာတမ်းများ {#related-docs}

- [ပိုက်ဆံများ](/my/blockchain/assets.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [Iroha သင်ကြားမှု လုပ်ငန်းများ](/my/blockchain/instructions.md)
- [မေးခွန်းများ](/my/reference/queries.md#assets-nfts-and-rwas)
- [Torii API အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md#app-and-sora-route-families)
