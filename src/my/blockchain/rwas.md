---
translation_locale: my
translation_source: /blockchain/rwas.md
translation_source_hash: cbdc6d766fb90bea7e68dc67f2c705bb1638340feeb2fca9f2dd43a727ac03e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ {#real-world-assets}

Real-world assets (RWAs) ဆိုသည်မှာ ချိတ်ဆက်မှုအပြင်ရှိ ပိုင်ဆိုင်မှု သို့မဟုတ် ထိန်းချုပ်မှုများကို ချိတ်ဆက်ချက်တွင် ခြေရာခံထားသော ချိတ်ဆက်ခြင်းမော်ဒယ်များဖြစ်သည်။ Iroha တွင် RWA သည်ထုတ်လုပ်သည့် မှတ်ပုံတင်မှတ်တမ်း၊ ပိုင်ရှင်စာရင်း၊ အရေအတွက်၊ စီးပွားရေးမီတာဒေတာ၊ မူလနေရာနှင့် ရွေးချယ်စရာ သက်တမ်းလည်ပတ်မှုထိန်းချုပ်မှုများပါ ၀ င်သော မှတ်ပုံတင်စာအုပ်စုတစ်ခုဖြစ်သည်။

RWAs သည် ကိန်းဂဏန်းအရ အရင်းအမြစ်လက်ကျန်များနှင့် ကွဲပြားသည်။

- ဂဏန်းအရင်းအမြစ်ဆိုသည်မှာ အကောင့်တစ်ခုတွင် ထိန်းသိမ်းထားသော fungible balance ဖြစ်ပါသည်။
- NFT ဆိုသည်မှာ တစ်ခုတည်းသော ပိုင်ရှင်တစ်ဦးနှင့်အတူ တသီးတသန့် ချိတ်ဆက်ထားသည့် မှတ်တမ်းဖြစ်ပါသည်။
- RWA ဆိုသည်မှာ လုပ်ငန်းဆိုင်ရာ metadata များ၊ အရေအတွက်များ၊ သိမ်းဆည်းထားမှုများ၊ အအေးခံခြင်း၊ ပြန်လည်ဖြည့်စွက်မှုအခြေအနေများ၊ မူလနေရာများနှင့် ထိန်းချုပ်သူ၏မူဝါဒများကို သယ်ဆောင်နိုင်သော ပဲရစ်ဖြစ်သည်။

RWAs ကို သုံးပါက စာရင်းအင်းမှာ ချိတ်ဆက်မှုမရှိတဲ့ သီးသန့်လတ်ကို ကိုယ်စားပြုဖို့ လိုအပ်တဲ့အခါ fungible balance တစ်ခုတည်းအစားပါ။

## RWA ပမာဏ {#rwa-lot}

RWA အပိုင်းမှာ အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- `id`: ထုတ်ပေးသော Canonical identifier RWA ကို `<hash>$<domain>` အဖြစ် ပြသသည်။
- `owned_by`: လက်ရှိတွင် လတ်တလောပိုင်ဆိုင်နေသော အကောင့်
- `quantity`: အစုလိုက်အပြုံလိုက် ကိုယ်စားပြုထားသော ကြွင်းချက်အရေအတွက်
- `spec`: ဒသမကိန်းအတိုင်းအတာလို အရေအတွက်သတ်မှတ်ချက်။
- `primary_reference`: ချိတ်ဆက်မှုအပြင် အဓိကလက်မှတ်၊ လက်မှတ်၊ ငွေစက္ကူ (သို့) မှတ်ပုံတင် အထောက်အထား
- `status`: လုပ်ငန်းအခြေအနေ စာသားကို ရွေးချယ်ပါ။
- `metadata`: စီးပွားရေးအခြေအနေနှင့် ညွှန်းကိန်းတင်ခြင်းအတွက် အသုံးပြုသော အသေးစား JSON ကွင်းများ။
- `parents`: ဤပမာဏကို ထုတ်ယူရန် အသုံးပြုသော အရင်းအမြစ်များ
- `controls`: ထိန်းချုပ်သူစာရင်း၊ ထိန်းချုပ်သူအခန်းကဏ္ဍများနှင့် ထိန်းချုပ်သူလုပ်ငန်းများကို ခွင့်ပြုထားသည်
- `is_frozen` နှင့် `held_quantity`: သက်တမ်းပတ်ဝန်းကျင်အခြေအနေကို runtime အားဖြင့် ချမှတ်ထားပါသည်။

WSV အပြင်ဘက်တွင် ဥပဒေဆိုင်ရာ စာရွက်စာတမ်းများ၊ စစ်ဆေးမှု အစီရင်ခံစာများနှင့် စစ်ဆေးရေး ဘက်ဂျက်များကို သိုလှောင်ထားပြီးနောက် URI, SoraFS လမ်းကြောင်း သို့မဟုတ် RWA မီတာဒေတာထဲသို့ ပြတ်သားသော ရည်ညွှန်းချက်တစ်ခု ထည့်ပါ။

## အထောက်အထားများ {#identifiers}

`RegisterRwa` သည်ခေါ်သူရွေးချယ်သော `id` ကိုလက်မခံ၊ `owner` ကွင်းကိုလက်မခံ။ ငွေပေးချေမှုအာဏာပိုင်သည်ပထမဦးဆုံး `owned_by` အကောင့်ဖြစ်လာပြီး runtime သည်ရည်မှန်းချက်ဒိုမင်တွင် `RwaId` ကိုဖန်တီးသည်။

RWA ID စာသားပုံစံမှာ-

```text
<generated-hash>$<domain>
```

ဥပမာ-

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

`primary_reference` သို့မဟုတ် `metadata` တွင် လျှောက်လွှာများ၏ လုပ်ငန်းအမှတ်တံဆိပ်ကို သိမ်းထားပြီးနောက် `RwaEvent::Created`၊ `FindRwas`၊ `/v1/rwas` မှထုတ်လုပ်သော `RwaId` သို့မဟုတ် ငွေပေးချေမှု ကတိပြုပြီးနောက် သတ်မှတ်ထားသည့် စူးစမ်းရှာဖွေရေးလမ်းကြောင်းကို ရှာဖွေရန် လိုအပ်ပါသည်။

## သက်တမ်း စက်ဝန်း {#lifecycle}

ပုံမှန် RWA အလုပ်ဖြစ်စဉ်များမှာ အောက်ပါအရာတွေ ပါဝင်ပါတယ်။

|လုပ်ဆောင်ချက်|အကောင်အထည်ဖော်ထားသော အပြုအမူ|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |ID ထိုးထွင်းကို ဒိုမင်တစ်ခုမှာ ဖန်တီးပါ။ ငွေပေးချေမှုအာဏာပိုင်သည် `owned_by` ဖြစ်လာသည်။ |
|`TransferRwa` |ပမာဏကို အခြားအကောင့်သို့ ရွှေ့ပါ။ အပြည့်အဝလွှဲပြောင်းခြင်းသည် `owned_by` ကိုပြောင်းလဲနိုင်သည်။ တစ်စိတ်တစ်ပိုင်း လွှဲပြောင်းမှုသည် ID ကိုဖန်တီးသော သီးခြားကလေးစုတစ်ခု ဖန်တီးသည်။ |
|`HoldRwa` |ထိန်းချုပ်ရေးကိရိယာနဲ့ `hold_enabled` ကို သတ်မှတ်ဖို့ လိုအပ်ပါတယ်။|
|`ReleaseRwa` |ထိန်းသိမ်းထားသော ပမာဏကို ဖယ်ရှားပါ။ configured controller နဲ့ `hold_enabled` ကိုလိုအပ်တယ်။ |
|`FreezeRwa` |သာမန်ပိုင်ရှင် လုပ်ငန်းတွေကို ပိတ်လိုက်ပါ Configured controller နဲ့ `freeze_enabled` လိုပါတယ်။ |
|`UnfreezeRwa` |ပုံမှန်ပိုင်ရှင် လုပ်ငန်းတွေကို ပြန်လည်ဖွင့်ပေးပါ။ ကွန်ပြူတာ ထိန်းချုပ်ရေးစနစ်နဲ့ `freeze_enabled` ကို လိုအပ်ပါတယ်။ |
|`RedeemRwa` |အရေအတွက်ကို လည်ပတ်မှုမှအမြဲတမ်း နှုတ်ယူပါ။ `redeem_enabled` မှန်တဲ့အခါ ပိုင်ရှင် (သို့) ထိန်းချုပ်သူက တင်ပြနိုင်ပါတယ်။ |
|`MergeRwas` |တူညီတဲ့ နယ်ပယ်နဲ့ သီးခြားသတ်မှတ်ချက်ရှိတဲ့ မိဘအစုတွေကနေ ထုတ်ထားတဲ့ ကလေးအစုကို ပေါင်းစပ်ပါ။ |
|`ForceTransferRwa` |Controller စီးဆင်းမှုတစ်ခုမှတစ်ဆင့် အရေအတွက်ကို ရွေ့ရှားပါ။ configured controller နှင့် `force_transfer_enabled` ကိုလိုအပ်သည်။ |
|`SetRwaControls` |ပဲခူးထိန်းချုပ်ရေး မူဝါဒကို အစားထိုးပါ။ ပိုင်ရှင် (သို့) ထိန်းချုပ်သူ လိုအပ်တယ်။|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |အစု metadata ကို update လုပ်ပါ။ ပိုင်ရှင် (သို့) ထိန်းချုပ်သူကို လိုအပ်တယ်။ အေးခဲတဲ့ အစုတွေက ထိန်းချုပ်သူလိုပါတယ်။ |

လက်ရှိကုဒ်မှာ `UnregisterRwa` ညွှန်ကြားချက်မရှိပါ။ ကိုယ်စားပြုထားတဲ့ ပမာဏကို ပို့ပေးတဲ့အခါ၊ သောက်သုံးတဲ့အခါ၊ သတ်မှတ်တဲ့အခါ (သို့) အခြားနည်းနဲ့ လည်ပတ်မှုကနေ ဖယ်ရှားတဲ့အခါ `RedeemRwa` နဲ့ ကွင်းဆက်အပြင် လတ်တစ်လတ်ကို ထုတ်ယူပါ။

## Metadata နှင့် Controls များ {#metadata-and-controls}

အသေးစိတ် အချက်အလက်များအတွက် metadata များကို အသုံးပြုပြီး အက်ပ်များကို လတ်တလောတွင် ရှာဖွေ၊ စစ်ဆေးနိုင်ရန် ကူညီပေးပါမည်။

- ရင်းနှီးမြှုပ်နှံမှု အမျိုးအစား၊ ထုတ်ပြန်သူ၊ ထိန်းသိမ်းသူ သို့မဟုတ် မှတ်ပုံတင် အညွှန်း
- သိုလှောင်ရုံ၊ ထုပ်ပိုးခန်း၊ ISIN, ငွေစက္ကူစာရင်း (သို့) လိုင်စင်အမှတ်တံဆိပ်
- အတည်ပြုချက်များနှင့် ဥပဒေဆိုင်ရာ စာရွက်စာတမ်းများအတွက် အကြောင်းအရာ hashes
- SoraFS ပိုကြီးမားတဲ့ အထောက်အထားအစုအတွက် လမ်းကြောင်းများ (သို့) ပြတ်သားသော ရည်ညွှန်းချက်များ
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

Torii သည် `/v1/rwas` နှင့် `/v1/rwas/query` ကဲ့သို့သောချိတ်ဆက်အခြေအနေလမ်းကြောင်းများကိုဖွင့်ထားသည်၊ ထို့အပြင် ထိုလမ်းကြောင်းမိသားစုအား ဖွင့်ထားသည့်အခါ `/v1/explorer/rwas` နှင့် `/v1/explorer/rwas/{rwa_id}` ကဲ့သို့သော စူးစမ်းရှာဖွေရေးလမ်းကြောင်းများကိုဖြည့်ဆည်းပေးသည်။ ထုတ်လုပ်သောဖောက်သည်များသည် node တစ်ခုမှပြသသောတိကျတဲ့ တုံ့ပြန်မှုပုံစံအတွက် တိုက်ရိုက် [`/openapi`](/my/reference/torii-endpoints.md#common-endpoints) စာရွက်စာတမ်းကိုသာ ကြိုက်နှစ်သက်ရမည်။

### Taira မှာ စမ်းကြည့်ပါ။ {#try-it-on-taira}

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

အောက်ပါဥပမာများတွင် Python SDK မျက်နှာပြင်များကို [ Shared Setup](/my/guide/tutorials/python.md#shared-setup) မှ အသုံးပြုသည်။ ငွေပေးချေမှု မတင်မီ Account IDs၊ Private Keys နှင့် Generated Lot IDs တို့ကို မိမိ၏ကွန်ရက်မှ တန်ဖိုးများဖြင့် အစားထိုးလိုက်ပါ။

### ရှာဖွေပါ RWA API လမ်းကြောင်းများ {#discover-rwa-api-routes}

Read Only နမူနာမှာ Running Torii node ကို App-facing RWA လမ်းကြောင်းတွေကို ဖွင့်ထားတာကို တောင်းဆိုပါတယ်။

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

စာရင်းက အလွတ်ဖြစ်ပါက RWA ညွှန်ကြားချက်များနှင့် အခြား Torii APIs မှတစ်ဆင့် မေးမြန်းမှုများကို node ကထောက်ပံ့နိုင်သော်လည်း ရွေးချယ်စရာ JSON လမ်းကြောင်းမိသားစုကို ဖော်ပြခြင်းမရှိပါ။

### သိုလှောင်ခုံလက်မှတ် မှတ်ပုံတင် {#register-a-warehouse-receipt}

လုပ်ငန်းဆောင်ရွက်မှုတစ်ခုဟာ လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှု တစ်ခုဖြစ်လာတဲ့အခါ မူကြမ်းကို အသုံးပြုပါ။ စီးပွားရေးလက်မှတ် နံပါတ်က `primary_reference` ထဲသို့သွားပြီး ငွေပေးချေးမှု ကတိပြုပြီးနောက် စာရင်းအင်း ID ကို ဖန်တီးပါတယ်။

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

ငွေပေးချေမှု ကန့်သတ်ချက်များပြီးနောက်၊ စာရင်းကို ဖန်တီး RWA IDs. Chain-state လမ်းကြောင်းတွေက Canonical ကို ဖော်ပြတယ်။ IDs; event (သို့) explorer အသေးစိတ်လမ်းကြောင်းများကို အသုံးပြုပါ ID ပြန်သွားပါ `primary_reference` သို့မဟုတ် metadata:

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

RWA ID ကွင်းဆက်က ပြန်လည်ထုတ်ပေးထားတာကို အသုံးပြုပါ။ ဒီဥပမာမှာ `alice` သည်ပိုင်ရှင်ဖြစ်တယ်လို့ ယူဆပြီး `hold_enabled` ဖြင့် ထိန်းချုပ်ရေးစနစ်အဖြစ်လည်း သတ်မှတ်ထားပါတယ်။

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

### ငွေပြန်ဆပ်ခြင်း (သို့) အငြိမ်းစားယူခြင်း {#redeem-or-retire-quantity}

`RedeemRwa` ကို တင်သွင်းခြင်းသည် ကိုယ်စားပြုသော ကွင်းဆက်ပြင်ပ အရင်းအမြစ်ကို ပေးပို့ခြင်း၊ စားသုံးခြင်း၊ အငြိမ်းစားယူခြင်း သို့မဟုတ် အခြားနည်းလမ်းဖြင့် လည်ပတ်မှုမှ ဖယ်ရှားပြီးနောက်ဖြစ်သည်။ ဤသည်မှာ တင်ပြထားသည့် ပမာဏကို လတ်တလောတွင် လျှော့ချပေးသည်။ လတ်တစ်လတ်တွင် `redeem_enabled` ရှိရမည်။ လက်မှတ်ရေးထိုးသူသည် ပိုင်ရှင် (သို့) ထိန်းချုပ်သူဖြစ်ရမည်ဖြစ်သည်။

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### လိုက်နာမှု စစ်ဆေးရာတွင် အေးခဲစေခြင်း {#freeze-during-compliance-review}

`FreezeRwa` ကို တင်ပြပါက ချိတ်ဆက်မှုအပြင် စစ်ဆေးမှုက သာမန်ပိုင်ရှင် လုပ်ငန်းတွေကို ပိတ်ဆို့ဖို့လိုပါတယ်။ လက်မှတ်ထိုးသူဟာ ထိန်းချုပ်ရေးမှူးဖြစ်ရပါမယ်။ ကောက်ကြောင်းမှာ `freeze_enabled` ရှိရမှာပါ။

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

ငွေပေးချေမှု စာရင်းကို RWA စာရင်းနံပါတ်ကို သိုလှောင်ခြင်းဖြင့် `primary_reference` မှတ်ပုံတင်ပြီးတဲ့နောက်မှာ ထုတ်လုပ်ထားတဲ့ ID ငွေလွှဲပြောင်းခြင်းနဲ့ ပြန်လည်ဝယ်ယူခြင်းအတွက်ပါ။

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

ငွေကြေးထောက်ပံ့မှု (သို့မဟုတ်) ပေးချေမှုရှိပါက ထုတ်ပေးသော Faktura Lot ID ကို အသုံးပြုပါ။

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

ကွင်းဆက်အပြင် ငွေပေးချေမှုပြီးနောက် ကိုယ်စားပြုထားသော ပမာဏကို ပြန်လည်ဖြည့်ဆည်းရန် -

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

ကွင်းဆက်အပြင် နေရာနှစ်ခု ပေါင်းစည်းတဲ့အခါ လတ်တလောပေါင်းစပ်ပါ။ မိဘတွေဟာ တူညီတဲ့ နယ်ပယ်မှာရှိပြီး ပမာဏ သတ်မှတ်ချက်တစ်ခုတည်းကို သုံးဖို့လိုပါတယ်။ Runtime ဟာ ကလေးလတ် ID ကို ဖန်တီးတယ်။

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

Python ငွေလဲလှယ်မှု အပြည့်အစုံအတွက် [Real-World Assets](/my/guide/tutorials/python.md#real-world-assets) ကို ကြည့်ရှုပါ။

## ဆက်စပ်သော စာရွက်စာတမ်းများ {#related-docs}

- [အရင်းအမြစ်များ](/my/blockchain/assets.md)
- [metadata](/my/blockchain/metadata.md)
- [Iroha အထူးညွှန်ကြားချက်များ](/my/blockchain/instructions.md)
- [မေးမြန်းချက်များ ](/my/reference/queries.md#assets-nfts-and-rwas)
- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md#app-and-sora-route-families)
