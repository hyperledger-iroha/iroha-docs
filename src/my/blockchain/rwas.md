---
translation_locale: my
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ {#real-world-assets}

လက်တွေ့ကမ္ဘာက ပိုင်ဆိုင်မှု (RWAs) ပိုင်ဆိုင်မှု (သို့) ထိန်းချုပ်မှုရှိသည့် ချိတ်ဆက်မထားသော အရင်းအမြစ်ပုံစံများ
ချိတ်ဆက်ထားတာကို ခြေရာခံထားပါတယ်။ Iroha, တစ် RWA မှတ်ပုံတင်ထားသော စာရင်းအင်းတစ်ခုပါ
ထုတ် generated identifier, owner account, quantity, business metadata
အရင်းအမြစ်နဲ့ ရွေးချယ်စရာ သက်တမ်း စက်ဝန်း ထိန်းချုပ်မှု။

RWAs အရေအတွက်အရ အရင်းအမြစ်စာရင်းများနှင့် မတူကြပါ။

- ကိန်းဂဏန်းအရင်းအမြစ်သည် အကောင့်တစ်ခုတွင် ထိန်းသိမ်းထားသော fungible balance ဖြစ်သည်။
- တစ် NFT တစ်ခုတည်းသော ပိုင်ရှင်နှင့်အတူ တစ်ကိုယ်ရေ ချိတ်ဆက်ထားသော မှတ်တမ်းတစ်ခုဖြစ်သည်။
- တစ် RWA ဒါက စီးပွားရေး metadata တွေ၊ ပမာဏတွေ၊ သိမ်းဆည်းထားနိုင်တဲ့
  freezes, redeem state, provenance နှင့် controller policy များ

အသုံးပြုခြင်း RWAs စာရင်းအင်းမှာ ချိတ်ဆက်မှုမရှိတဲ့ သီးသန့် အစုကို ကိုယ်စားပြုဖို့ လိုအပ်တဲ့အခါ
မှိုကျတဲ့ ဟန်ချက်ညီမှုအစားပါ။

## RWA လတ်တလော {#rwa-lot}

အန် RWA အစုလိုက်အပြုံလိုက်ပါဝင်သည်-

- `id`: ထုတ်ပေးထားတဲ့ Canonical RWA အမှတ်တံဆိပ်ကို
  `<hash>$<domain>`
- `owned_by`: လောလောဆယ် မြေကွက်ပိုင်ဆိုင်သူရဲ့ အကောင့်
- `quantity`: ပဲခူးမှာ ကိုယ်စားပြုထားတဲ့ ကျန်တဲ့ အရေအတွက်
- `spec`: အရေအတွက် သတ်မှတ်ချက်များ၊ ဥပမာ ဆယ်စုကိန်းအတိုင်းအတာများ
- `primary_reference`: လက်မှတ်၊ လက်မှတ်၊ ငွေစက္ကူစာရင်းများ
  မှတ်ပုံတင်အကိုးအကား
- `status`: ရွေးချယ်စရာ လုပ်ငန်းအခြေအနေ စာသား
- `metadata`: အချိုးအစား JSON စီးပွားရေး အခြေအနေနှင့် ညွှန်းကိန်းတင်ခြင်းအတွက် အသုံးပြုသော ကွင်းများ
- `parents`: ဒီပမာဏကို ထုတ်ယူဖို့ အသုံးပြုတဲ့ အရင်းအမြစ် ပမာဏ
- `controls`: Controller account များ၊ Controller ၏ အခန်းကဏ္ဍများနှင့် Controller ကို enable လုပ်ထားခြင်း
  လုပ်ငန်းများ
- `is_frozen` နှင့် `held_quantity`: သက်တမ်းပတ်ဝန်းကျင် အခြေအနေကို runtime နဲ့ ချိတ်ဆက်ထားတယ်။

သံကြိုးပေါ်က အသုံးဝင်ပစ္စည်းကို ညှိထားပါ။ ကြီးမားတဲ့ ဥပဒေဆိုင်ရာ စာရွက်စာတမ်းတွေကို သိမ်းဆည်း၊ စစ်ဆေး
အစီရင်ခံစာများနှင့် စစ်ဆေးမှုအစုများကို WSV, ပြီးရင် အစာခြေခံထားပါ။ URI, SoraFS
လမ်းကြောင်း (သို့) ပြတ်သားတဲ့ ရည်ညွှန်းချက် RWA metadata တွေ။

## မှတ်သားချက်များ {#identifiers}

`RegisterRwa` ရွေးချယ်ခံရတဲ့ ဖုန်းခေါ်ဆိုသူကို လက်မခံဘူး။ `id`, ဒါကို လက်မခံဘူး။
တစ် `owner` ကဏ္ဍ: ငွေပေးချေမှု အာဏာပိုင်သည် ပထမဦးဆုံး `owned_by`
account ကို runtime က generates `RwaId` ပစ်မှတ် domain ထဲမှာပါ။

စာသားပုံစံ RWA ID ဖြစ်ပါသည်။

```text
<generated-hash>$<domain>
```

ဥပမာ-

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

လျှောက်လွှာများတွင် ၎င်းတို့၏ လုပ်ငန်းအမှတ်တံဆိပ်ကို `primary_reference`
ဒါမှမဟုတ် `metadata`, ပြီးရင် ဖန်တီးထားတဲ့ `RwaId` မှ
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ဒါမှမဟုတ် စူးစမ်းရှာဖွေရေး လမ်းကြောင်း သတ်မှတ်ချက်
ငွေလဲလှယ်မှု ကတိပေးပြီးနောက်

## သက်တမ်း စက်ဝန်း {#lifecycle}

ပုံမှန် RWA အလုပ်ခွင်များမှာ:

| လုပ်ဆောင်ချက်                                  | အကောင်အထည်ဖော်ထားသော ပြုမူပုံ                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | ထုတ်လုပ်ထားတဲ့...ID ဒေသတစ်ခုအတွင်းရှိ ပမာဏများ; ငွေပေးချေမှုအာဏာပိုင်သည် `owned_by`.                                       |
| `TransferRwa`                              | ပမာဏကို အခြားစာရင်းသို့ ရွှေ့ပါ။ ငွေလွှဲပြောင်းမှုတစ်ခုလုံး ပြောင်းလဲနိုင်သည် `owned_by`; တစ်စိတ်တစ်ပိုင်း လွှဲပြောင်းမှုက ကလေးစုကို ဖန်တီးတယ်။ |
| `HoldRwa`                                  | ထိန်းချုပ်ရေးကိရိယာကို ဖွဲ့စည်းထားပြီး `hold_enabled`.                                                     |
| `ReleaseRwa`                               | ထိန်းသိမ်းထားတဲ့ ပမာဏကို ဖယ်ရှားပါ။ `hold_enabled`.                                                 |
| `FreezeRwa`                                | ပုံမှန်ပိုင်ရှင် လုပ်ငန်းတွေကို ပိတ်လိုက်ပါ `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | ပုံမှန်ပိုင်ရှင် လုပ်ငန်းတွေကို ပြန်လည်ဖွင့်ပေးပါ။ `freeze_enabled`.                                |
| `RedeemRwa`                                | ပိုင်ရှင် (သို့) ထိန်းချုပ်သူနှင့် `redeem_enabled`.                                                  |
| `MergeRwas`                                | မိဘစုစုတွေထဲက ဒေသတစ်ခုတည်းနဲ့ သီးခြားကိန်းကို ထုတ်ပေးထားတဲ့ ကလေးစုအဖြစ် ပေါင်းစပ်ပါ။                              |
| `ForceTransferRwa`                         | Controller စီးဆင်းမှုမှတစ်ဆင့် အရေအတွက်ကိုပြောင်းပါ။ `force_transfer_enabled`.                    |
| `SetRwaControls`                           | ပဲခူးထိန်းချုပ်ရေး မူဝါဒကို အစားထိုးပါ။ ပိုင်ရှင် (သို့) ထိန်းချုပ်သူ လိုအပ်တယ်။                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | ပဲခူး metadata ကို update လုပ်ပါ။ ပိုင်ရှင် (သို့) ထိန်းချုပ်သူကို လိုအပ်တယ်။ အေးခဲတဲ့ ပဲခွာတွေမှာ ထိန်းချုပ်သူလိုအပ်ပါတယ်။                                 |

မရှိဘူး။ `UnregisterRwa` လက်ရှိကုဒ်မှာ ညွှန်ကြားချက်ပါ။
ချိတ်ဆက်မှုအပြင်မှာ `RedeemRwa` ကိုယ်စားပြုထားတဲ့ ပမာဏကို ပို့ပေးတဲ့အခါ
စားသုံး၊ စိုက်ပျိုး၊ ဒါမှမဟုတ် အခြားနည်းနဲ့ လည်ပတ်မှုမှ ထုတ်ပစ်တယ်။

## မီတာဒေတာများနှင့် ထိန်းချုပ်မှုများ {#metadata-and-controls}

Application တွေကို ရှာဖွေ၊ စစ်ဆေးရာမှာ ကူညီပေးမယ့် အသေးစိတ် အချက်အလက်တွေအတွက် metadata ကို အသုံးပြုပါ။
ပဲခူး:

- ရင်းနှီးမြှုပ်နှံမှု အမျိုးအစား၊ ထုတ်လွှင့်သူ၊ ထိန်းသိမ်းသူ သို့မဟုတ် မှတ်ပုံတင် စာရင်းအထောက်အထား
- သိုလှောင်ခန်း၊ ထုပ်ပိုးခန်း၊ ISIN, ငွေကြေးရင်းစာရင်း (သို့) လိုင်စင်မှတ်ပုံတင်များ
- သက်သေခံစာများနှင့် ဥပဒေဆိုင်ရာ စာရွက်စာတမ်းများအတွက် အကြောင်းအရာ hashes
- SoraFS ပိုကြီးတဲ့ အထောက်အထားစုတွေအတွက် လမ်းကြောင်းများ (သို့) ထင်ရှားတဲ့ ရည်ညွှန်းချက်များ
- Off-chain ဝန်ဆောင်မှုများမှ အသုံးပြုသော maturity, jurisdiction သို့မဟုတ် compliance tags များ

အကောင်အထည်ဖော်ထားသော `RwaControlPolicy` အောက်ပါ ကွင်းများရှိသည်-

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

Controller account နဲ့ role တွေကို controller ကသာ လုပ်ခွင့်ပြုထားပါတယ်
ကိုက်ညီတဲ့ Boolean Flag ကဖွင့်ထားတဲ့ Operations တွေကို
အသုံးဝင်သော ဝန်ဆောင်မှုသည် ခွင့်ပြုချက်စာရင်းလွှဲပြောင်းရေး မူဝါဒမဟုတ်ပါ
`transfers` စည်းမျဉ်းတွေ။

## မေးခွန်းများ၊ ဖြစ်ရပ်များနှင့် APIs {#queries-events-and-apis}

အသုံးပြုခြင်း [`FindRwas`](/my/reference/queries.md#assets-nfts-and-rwas) စာရင်းသွင်းရန်
မှတ်ပုံတင်ထား RWA တိုက်ရိုက် update လုပ်ဖို့လိုတဲ့ app တွေက subscribe လုပ်လို့ရတယ်
[`Rwa` ဒေတာဖြစ်ရပ်များ](/my/blockchain/filters.md#data-event-filters) ဖန်ဆင်းထားတဲ့အတွက်၊
ပိုင်ရှင်ပြောင်း၊ ခွဲထွက်၊ ပေါင်းစပ်၊ ပြန်လည်ဝယ်ယူ၊ အေးခဲ၊ ဖယ်ရှားထား၊ ထိန်းသိမ်းထား၊ လွှတ်တင်ထား
အင်အားလွှဲပြောင်းမှု၊ ထိန်းချုပ်မှု ပြောင်းလဲမှုနဲ့ metadata ဖြစ်ရပ်တွေပေါ့။

Torii ကွင်းဆက်အခြေအနေလမ်းကြောင်းများကို ဖော်ပြသည် `/v1/rwas` နှင့် `/v1/rwas/query`,
ဒါ့အပြင် စူးစမ်းလေ့လာရေး လမ်းကြောင်းတွေလည်း ရှိပါတယ်။ `/v1/explorer/rwas` နှင့်
`/v1/explorer/rwas/{rwa_id}` အဲဒီလမ်းကြောင်း မိသားစုကို ဖွင့်ထားတဲ့အခါမှာ
ဖောက်သည်တွေက Live ကို ပိုနှစ်သက်သင့်ပါတယ်။
[`/openapi`](/my/reference/torii-endpoints.md#common-endpoints) မှတ်တမ်း
node တစ်ခုရဲ့ တုံ့ပြန်မှုပုံစံကို တိတိကျကျပါ။

### ဒါကို စမ်းကြည့်ပါ။ Taira {#try-it-on-taira}

အများပြည်သူကို စစ်ဆေးပါ Taira လက်ရှိတွင် မှတ်ပုံတင်ထားသည် RWA များစွာ:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

စာရင်းပေးပါ RWA အွန်လိုင်းမှ ထုတ်လွှင့်ထားသော လမ်းကြောင်းများ Taira OpenAPI စာရွက်စာတမ်း

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

အလွတ် `items` ထုတ်ကုန်ထုတ်လုပ်မှုသည် အများပြည်သူအစုလိုက်မှတ်ပုံတင်ခြင်း မရှိသေးသည့်အခါမျှော်လင့်ထားသည်။
မှတ်ပုံတင်ခြင်း၊ လွှဲပြောင်းခြင်း၊ ထိန်းသိမ်းခြင်း၊ အေးဆေးခြင်းနှင့် ပြန်လည်ဝယ်ယူခြင်းတို့သည် လက်မှတ်ထိုးထားသော ငွေပေးချေမှုဖြစ်သည်။

## စမ်းကြည့်ပါ {#try-it}

အောက်ပါဥပမာများတွင် Python SDK မျက်နှာပြင်များ
[မျှဝေထားသော Setup](/my/guide/tutorials/python.md#shared-setup). အစားထိုးရန်
အကောင့် IDs, ပုဂ္ဂလိက သော့တွေ၊ ထုတ်လုပ်ထားတဲ့ ပဲ IDs သင့်ကိုယ်ပိုင် တန်ဖိုးထားမှုတွေနဲ့
ငွေပေးချေမှု မတင်မီက ကွန်ရက်။

### ရှာဖွေပါ RWA API လမ်းကြောင်းများ {#discover-rwa-api-routes}

Read Only နမူနာက Run ကိုမေးတယ်။ Torii ဘယ် app ကို မျက်နှာပြုတဲ့ node ကို RWA
လမ်းကြောင်းများ:

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

စာရင်းက အလွတ်ရှိရင် node က ထောက်ပံ့နေဆဲ ဖြစ်နိုင်ပါတယ်။ RWA ညွှန်ကြားချက်များနှင့်
အခြားနည်းလမ်းများဖြင့် မေးမြန်းခြင်း Torii APIs, ဒါပေမဲ့ ရွေးချယ်စရာကို မဖေါ်ပြဘူး။ JSON
လမ်းကြောင်း မိသားစု။

### သိုလှောင်ခုံလက်မှတ် မှတ်ပုံတင် {#register-a-warehouse-receipt}

လုပ်ငန်းဆောင်ရွက်မှုတစ်ခုဟာ လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှု တစ်ခုဖြစ်လာတဲ့အခါ မူကြမ်းကို သုံးပါ။
လုပ်ငန်းလက်မှတ် နံပါတ်က ဝင်လာတယ် `primary_reference`; စာအုပ်ကြီး ID ရှိသည်
ရင်းနှီးမြှုပ်နှံမှု အမိန့်ချမှတ်ပြီးနောက် ပေါ်ပေါက်လာသည်

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

ငွေပေးချေမှု ကတိပြုပြီးနောက် စာရင်းကို ဖန်တီးသည် RWA IDs. ချင်းပြည်နယ်လမ်းကြောင်းများ
ကနောနိကကို ဖေါ်ပြပါ IDs; သင်ဟာ Event တွေကို သုံးတဲ့အခါ ဒါမှမဟုတ် Explorer အသေးစိတ် လမ်းကြောင်းတွေကို
ကိုက်ညီဖို့လိုအပ်ပါတယ် ID ပြန်သွားပါ `primary_reference` သို့မဟုတ် metadata:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Explorer ကို ခွင့်ပြုထားသော node များသည် ပိုမိုချမ်းသာသော projections များကိုပြန်လည်ပို့နိုင်သည်။

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### ယာယီရပ်ဆိုင်းခြင်းဖြင့် ရွှေ့ပြောင်းခြင်း {#transfer-with-a-temporary-hold}

ထုတ်လုပ်ထားသော RWA ID ဒီဥပမာက
`alice` ပိုင်ရှင်ဖြစ်ပြီး Controller အဖြစ်လည်း သတ်မှတ်ထားပါတယ်
`hold_enabled`.

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

ချိတ်ဆက်မှုအပြင်ဖြစ်စဉ် ပြီးဆုံးတဲ့အခါ ထိန်းချုပ်မှုကို လွှတ်ပေးပါ။

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Controls နှင့် Audit Metadata များကိုထည့်သွင်းခြင်း {#add-controls-and-audit-metadata}

Controller Policy အတွက် Controller တွေကို အသုံးပြုပါ။
လျှောက်လွှာများ သို့မဟုတ် စာရင်းစစ်ဆေးသူများက ပြသရန် လိုအပ်သော အချက်အလက်များအတွက် မက်တာဒေတာများ:

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

### ငွေကြေး ပြန်ဆပ်ခြင်း သို့မဟုတ် အငြိမ်းစားယူခြင်း {#redeem-or-retire-quantity}

ကွင်းဆက်ပြင်ပ အရင်းအမြစ်ကို ပေးပို့ပြီးနောက် ပြန်လည်ဖြည့်စွက်မှုအရေအတွက်၊
စားသုံးခြင်း၊ အငြိမ်းစားယူခြင်း သို့မဟုတ် အခြားနည်းဖြင့် လည်ပတ်မှုမှ ထုတ်ပယ်ခြင်း။
`redeem_enabled`, လက်မှတ်ရေးထိုးသူက ပိုင်ရှင် (သို့) ထိန်းချုပ်သူဖြစ်ရပါမယ်။

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### လိုက်နာမှု စစ်ဆေးစဉ် အေးခဲခြင်း {#freeze-during-compliance-review}

သံမဏိကွင်းပြင် အပြန်အလှန် သုံးသပ်ချက်တစ်ခုဟာ သာမန်ပိုင်ရှင် လုပ်ငန်းတွေကို ပိတ်ပင်ဖို့လိုတဲ့အခါ အများကြီး အေးခဲစေတယ်။
လက်မှတ်ရေးထိုးသူဟာ ထိန်းချုပ်သူ ဖြစ်ဖို့လိုပြီး လတ်တလောမှာ `freeze_enabled`.

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

စာမေးပွဲ ပြီးသွားတဲ့အခါ အေးဆေးအောင်လုပ်ပါ။

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

### ငွေကြေးစရိတ် {#invoice-receivable}

ငွေပေးချေမှု စာရင်းကို RWA လတ်တလောမှာ ငွေကြေးဖိုင်နံပါတ်ကို
`primary_reference` မှတ်ပုံတင်ပြီးတဲ့နောက် ထုတ်ထားတဲ့ ID
ငွေလွှဲပြောင်းခြင်းနဲ့ ပြန်လည်ဝယ်ယူခြင်းအတွက်ပါ။

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

ငွေကြေးပေးချေမှု (သို့) ပေးချေမှုရှိပါက ထုတ်လုပ်သော ငွေစက္ကူအစုကို အသုံးပြုပါ။ ID:

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

ကွင်းဆက်အပြင် ငွေပေးချေမှုပြီးနောက် ကိုယ်စားပြုငွေကြေးကို ပြန်လည်ဝယ်ယူပါ

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ကာဗွန်ချေးငွေ အငြိမ်းစား {#carbon-credit-retirement}

ငွေတောင်းခံပြီးနောက် ချေးငွေတွေကို အငြိမ်းစားယူဖို့ ပြန်လည်ဖြည့်စွက်မှုကို သုံးပါ။
စက်လှေအပြင်မှာ ရှိတဲ့ လက်မှတ် (သို့) မှတ်ပုံတင် အထောက်အထားကို ညွှန်ပြပါ-

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

### နှစ်ခု ပေါင်းစပ်ပေးပါ {#merge-two-lots}

ချိတ်ဆက်မှုအပြင်မှာရှိတဲ့ နေရာနှစ်ခုကို ပေါင်းစည်းတဲ့အခါ လတ်တလော ပေါင်းစပ်ပေးပါ။ မိဘတွေက
Runtime က runtime ကို generates
ကလေးများ ID.

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

အပြည့်အဝ Python ငွေပေးချေမှုဥပမာ၊ ကြည့်ပါ
[လက်တွေ့ကမ္ဘာဆိုင်ရာ အရင်းအမြစ်များ](/my/guide/tutorials/python.md#real-world-assets).

## ဆက်စပ်သော စာတမ်းများ {#related-docs}

- [အရင်းအမြစ်များ](/my/blockchain/assets.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [Iroha အထူးညွှန်ကြားချက်များ](/my/blockchain/instructions.md)
- [မေးခွန်းများ](/my/reference/queries.md#assets-nfts-and-rwas)
- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md#app-and-sora-route-families)
