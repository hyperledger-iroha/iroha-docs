---
translation_locale: dz
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# གནས་སྟངས་ངོ་མ་གི་ རྒྱུ་དངོས་ཚུ་ {#real-world-assets}

Real-world assets (RWAs) འདི་ chain གྱི་ཕྱི་ཁར་ཡོད་མི་ assets modelཨིན་པའི་ནང་ owner ཡང་ན་ controlའདི་ chain ནང་ལུ་ བརྟག་ཞིབ་འབད་ཡོདཔ་ཨིན། Iroha ལུ་ RWA གིས་བཀོད་སྒྲིག་འབད་ཡོད་པའི་ ledger lot བཟོ་སྐྲུན་འབད་མི་ identifier, སྦྱིན་བདག་རྩིས་ཁྲ་, ཆེ་རིམ་, ཚོང་འབྲེལ་ metadata, provenance, དང་ optional lifecycle controls ཡོདཔ་ཨིན།

RWAs གྱངས་ཁ་ཅན་གྱི་ རྒྱུ་དངོས་གི་ལྷག་ལུས་ཚུ་ལས་ཁྱད་པར་ཅན་ཨིན།

- ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་འདི་ རྩིས་ཁྲ་ཅིག་གིས་བཞག་མི་དངུལ་རྐྱང་ཆ་མཉམ་ཨིན།
- NFT འདི་ ལག་ལེན་པ་གཅིག་དང་གཅིག་ཁར་ ཐོ་བཀོད་ཐོག་གི་ཐོ་ཡིག་ཅིག་ཨིན།
- RWA འདི་ ཚོང་འབྲེལ་གྱི་བརྡ་དོན་ཚུ་ མཁོ་སྒྲུབ་འབད་ཚུགས་མི་ ཐོ་བཀོད་ཅིག་ཨིན་ དེ་ནང་ ལས་སྡེའི་བརྡ་དོན་ཁྱོན་ཆེ་དྲགས་དང་ གྱངས་ཁ་ཆེ་ཤོས་ དེ་ལས་ གསོག་འཇོག་གི་གནས་སྟངས་དང་ འབྱུང་ཁུངས་ དེ་ལས་ སྲིད་བྱུས་དེ་ཡོདཔ་ཨིན།

RWAs ལག་ལེན་འཐབ་ནི་དེ་ ལྡོག་ཕྱོགས་ཡིག་ཆའི་ནང་ སྦ་སྒོར་གྱི་གྲལ་ཐིག་ལས་བརྒལ་མེད་མི་ཅིག་ལུ་ ངོ་སྤྲོད་འབད་དགོ་པའི་སྐབས་ཨིན།

## RWA ལོ {#rwa-lot}

RWA བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལས་:

- `id`: བཟོ་སྐྲུན་འབད་ཡོད་པའི་ ཀ་ནན་གྱི་ངོ་རྟགས་ RWA འདི་ `<hash>$<domain>`སྦེ་སྟོན་འབདཝ་ཨིན།
- `owned_by`: རྩིས་ཁྲ་དེ་ ད་རེས་ སྣུམ་འཁོར་གྱི་ས་ཁོངས་ནང་ཡོད་མི་དེ་ཨིན།
- `quantity`: བཀྲམ་སྤེལ་འབད་ཡོད་པའི་ ཨང་གྲངས་ཚུ་
- `spec`: ཐོ་བཀོད་ཚད་གཞིའི་ཐོ་ཚུ་ དཔེར་ན་ ཨང་བཅུ་གི་ཐིག་ཁྲམ་
- `primary_reference`: ཐོ་བཀོད་དང་འབྲེལ་བའི་ཡིག་ཆ་དང་ ཡིག་ཚང་གི་མིང་ཐོ་བཀོད་ཚུ་
- `status`: ཚོང་འབྲེལ་གྱི་གནས་སྟངས་ཀྱི་ ཡིག་ཆ་འདི་ གདམ་ཁ་རྐྱབས་ཅིག་ཨིན།
- `metadata`: ཚོང་འབྲེལ་གྱི་གནས་སྟངས་དང་ ཚད་འཛིན་འབད་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་མི་ ས་ཆ་ཐུང་ཀུ་ JSON།
- `parents`: ཐོ་བཀོད་འབད་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་མི་ ཐོན་ཁུངས་ཀྱི་ཐོ་བཀོད་ཚུ་
- `controls`: ཁྲི་འཛིན་གྱི་རྩིས་ཁྲ་དང་ ཁྲི་འཛིན་གི་འགན་ཁུར་ དེ་ལས་ འགན་འཁྲི་འཛིན་སྐྱོང་འཐབ་ཐངས་ཚུ་
- `is_frozen`དང་ `held_quantity`: སྲོལ་རྒྱུན་གྱི་དུས་ཡུན་ལུ་བརྟེན་ བཀག་ཆ་འབད་ཡོད་པའི་གནས་ཚུལ།

ལྕགས་ཐག་ནང་གི་ ཁེ་ཕན་གྱི་ཁལ་འདི་ ཉམ་ཆུང་སྦེ་བཞག་ནི། ཁྲིམས་ཀྱི་ཡིག་ཆ་སྦོམ་དང་ བརྟག་ཞིབ་སྙན་ཞུ་ དེ་ལས་ ལྟ་རྟོག་གི་ཐིག་ཁྲམ་ཚུ་ WSV གི་ཕྱི་ཁར་བཞག་ཞིནམ་ལས་ URI ཡང་ན་ SoraFS ཕྲང་ལམ་ ཡང་ན་ ཁ་གསལ་ཁ་བྱང་ཅིག་ RWA མེ་ཊ་ཌའི་ཊ་ནང་བཙུགས་འོང་།

## ངོས་འཛིན་འབད་མི་ཚུ་ {#identifiers}

`RegisterRwa` གིས་ caller-choice `id` དང་ `owner` field འདི་ཡང་མ་ལེན་པར་ཡོདཔ་ཨིན། transaction authorityའདི་ འགོ་ཐོག་གི་ `owned_by` account ཨིན། དེ་ལས་ runtimeགིས་ དམིགས་གཏད་ domainནང་ལུ་ `RwaId` བཟོ་ཚུགས།

RWA ID གི་ཡི་གུ་བཟོ་རྣམ་འདི་:

```text
<generated-hash>$<domain>
```

དཔེར་ན་:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

ཞུ་ཡིག་ཚུ་གིས་ ཁོང་རའི་ཚོང་འབྲེལ་ངོ་རྟགས་དེ་ `primary_reference` ཡང་ན་ `metadata` ལུ་བཞག་ཞིནམ་ལས་ `RwaId` ལས་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ `RwaEvent::Created`, `FindRwas`, `/v1/rwas` ཡང་ན་ ཚོང་ལཱ་གི་བཅའ་མར་ལེན་པའི་ཤུལ་ལས་ གཞི་བཙུགས་འབད་མི་འཚོལ་མི་ལམ་སྟོན་ཚུ་ འཚོལ་དགོཔ་ཨིན་མས།

## སྲོལ་འཁོར་ {#lifecycle}

སྤྱིར་བཏང་ RWA ལཱ་གི་ལམ་ལུགས་ཚུ་ནང་:

|ལས་འགུལ་ |ལག་ལེན་འཐབ་མི་ སྤྱོད་ལམ་ |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |ཌོ་मेनནང་ལུ་ ཐོན་སྐྱེད་འབད་མི་- ID ལོཊ་ཅིག་བཟོ་ནི་; ཚོང་འབྲེལ་དབང་འཛིན་དེ་ `owned_by` ཨིན།|
|`TransferRwa` |ཨང་གྲངས་དེ་རྩིས་གཞན་ཅིག་ལུ་སྤོ་བཤུད་འབད། ཡོངས་ཁྱབ་གནས་གོང་འདི་ `owned_by` བསྒྱུར་བཅོས་འབད་ཚུགས། ཡན་ལག་གནས་གོང་གྱིས་ ཨ་ལོ་གི་སྡེ་ཚན་བཟོ་ཡོདཔ་ཨིན། |
|`HoldRwa` |གྲ་སྒྲིག་འབད་ཡོད་པའི་ལག་ལེན་འཛིན་སྐྱོང་དང་ `hold_enabled` དགོཔ་ཨིན།|
|`ReleaseRwa` |བཀག་བཞག་མི་ མང་ཚད་འདི་བཏོན་གཏང་། སྒྲིག་གཞི་སྒྲིག་འབད་ཡོད་པའི་འཛིན་སྐྱོང་དང་ `hold_enabled` དགོཔ་ཨིན། |
|`FreezeRwa` |སྤྱིར་བཏང་བདག་འཛིན་འཐབ་པའི་ལཱ་ཚུ་བཀག་སྡོམ་འབད་ཡོདཔ་ཨིན། སྒྲིག་གཞི་སྒྲིག་ཅན་གྱི་འཛིན་སྐྱོང་དང་ `freeze_enabled` དགོཔ་ཨིན།|
|`UnfreezeRwa` |སྤྱིར་བཏང་བདག་འཛིན་གྱི་ལཱ་ཚུ་ སླར་ལོག་འབད་ཚུགས། སྒྲིག་གཞི་སྒྲིག་ཡོད་པའི་ལག་ལེན་དང་ `freeze_enabled` དགོཔ་ཨིན། |
|`RedeemRwa` |ཨང་གྲངས་འདི་སླར་ལོག་འབད་དགོ་ སྦྱིན་བདག་དང་འཛིན་སྐྱོང་ དེ་ལས་ `redeem_enabled` དགོཔ་ཨིན།|
|`MergeRwas` |ཨང་གྲངས་འདི་ ཕམ་སྡེ་ཚན་དང་ ཌོ་མེ་ནེསི་གཅིག་ཡོད་མི་ལས་ བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ ཨ་ལོ་སྡེ་ཚན་ཅིག་ བཟོ་སྐྲུན་འབདཝ་ཨིན། |
|`ForceTransferRwa` |ཚད་གཞི་དེ་སེལ་འཐུ་འབད་ནིའི་ལམ་ལུགས་ཅིག་ལས་ སྤོ་བཤུད་འབད། སེལ་འཐུ་འབད་ཡོད་པའི་ལམ་ལུགས་དང་ `force_transfer_enabled` དགོཔ་ཨིན།|
|`SetRwaControls` |སྣུམ་འཁོར་གྱི་འཛིན་སྐྱོང་གི་ སྲིད་བྱུས་འདི་ བསྒྱུར་བཅོས་འབད་དགོ་ སྦྱིན་བདག་དང་འཛིན་སྐྱོང་འཐབ་མི་ཅིག་ དགོཔ་ཨིན།|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |ལོཊ་གི་བརྡ་དོན་ཚུ་ ད་ལྟོའི་གནས་གོང་བཟོཝ་ཨིན། བདག་འཛིན་ ཡང་ན་ འཛིན་སྐྱོང་འཐབ་མི་ཅིག་ དགོཔ་ཨིན། མགོན་གཏང་ཡོད་པའི་ ལཱཊ་ཚུ་གིས་ འཛིན་སྐྱོང་འབད་མི་ཚུ་ དགོཔ་ཨིན་མས།|

ད་ལྟོའི་ཀོ་བིཌ་ནང་ `UnregisterRwa` གི་བསླབ་བྱ་མེདཔ་ཨིན། `RedeemRwa` གིས་ བཀག་ཆ་འབད་ཡོད་པའི་ ཨང་གྲངས་ཚུ་ བཏབ་ཚར་ཞིནམ་ལས་ ཟད་འགྲོ་བཏང་ཚར་ཞིནམ་ལས་ ཡང་ན་ ཐབས་ལམ་གཞན་ཅིག་ཁར་ རྒྱུན་འགྲུལ་ནང་ལས་བཏོན་གཏང་པའི་སྐབས་ ལྕགས་ཐག་གི་ཕྱི་ཁར་ སྣུམ་འཁོར་གྱི་ཨང་གྲངས་གཅིག་སླར་ལོག་འབདཝ་ཨིན།

## Metadata དང་ Controls {#metadata-and-controls}

གནད་དོན་ཁག་ཅིག་གི་དོན་ལུ་ metadata ལག་ལེན་འཐབ་ནི་འདི་གིས་ applications ལུ་ lot ངོ་ཤེས་དང་བརྟག་དཔྱད་འབད་ནི་ལུ་ཆ་རོགས་འབདཝ་ཨིན།

- རྒྱུ་དངོས་གི་དབྱེ་རིམ་དང་ དངུལ་ཁང་གི་དངུལ་ཁང་དང་ གཏན་འཁེལ་གྱི་ཐོ་ཡིག་ཚུ་
- Warehouse, vault, ISIN, གློ་བུར་གྱི་རྩིས་ཁྲ་དང་ ཡང་ན་ ཤོག་ལེབ་ཀྱི་ངོ་རྟགས་ཚུ་
- འཛིན་སྐྱོང་དང་ ཁྲིམས་ཀྱི་ཡིག་ཆ་ཚུ་གི་དོན་ལས་ འབྲེལ་གཏོགས་འབད་ཡོད་པའི་ཧེཤ་ཚུ་
- SoraFS ཐབས་ལམ་ཚུ་ ཡང་ན་ བརྡ་བཀོད་གི་ཁ་བྱང་ཚུ་ རིན་བསྡུར་རྟགས་སྦོམ་ཚུ་གི་དོན་ལུ་
- ཚོད་བསྲེ་དང་བཅའ་ཁྲིམས་ཀྱི་གནས་ཚད་ ཡང་ན་ གྲོས་བསྟུན་གྱི་ཐོ་བཀོད་ཚུ་ ཞབས་ཏོག་ཚུ་ནང་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན།

གཞི་བཙུགས་འབད་ཡོད་པའི་ `RwaControlPolicy` ནང་ལུ་ འ་ནི་ས་ཁོངས་ཚུ་ཡོདཔ་ཨིན།

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

རྩིས་ཁྲ་དང་ འགན་འཁྲི་འཛིན་སྐྱོང་འཐབ་མི་ཚུ་ལུ་ བཀྲམ་སྤེལ་འབད་ནིའི་ གོ་སྐབས་ཡོདཔ་ད་ ལག་ལེན་འཐབ་མི་གིས་ བྱ་སྤྱོད་ཚུ་རྐྱངམ་གཅིག་ འབད་ཆོག་ནི་ཨིན་པས། ད་ལྟོའི་ལག་ལེན་གྱི་འགན་ཁུར་འདི་ allow-list རྒྱུན་འགྲུལ་གི་ སྲིད་བྱུས་ཅིག་མེན་ནི་དང་ ནང་འཁོད་ལུ་ nested `transfers` ཁྲིམས་ལུགས་ཚུ་མེདཔ།

## དྲི་བཀོད་དང་བྱུང་རྐྱེན་ཚུ་ དེ་ལས་ APIs {#queries-events-and-apis}

ཁྱོད་ཀྱིས་ [`FindRwas`](/dz/reference/queries.md#assets-nfts-and-rwas) ལག་ལེན་འཐབ་སྟེ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ RWA ལོཊ་ཚུ་བཀོད་ཐོ་རྐྱབས་ཚུགས། འོག་གི་གནས་སྟངས་ནང་ ད་ལྟོའི་གནས་སྟངས་ལུ་ དགོས་མཁོ་ཅན་གྱི་ལག་ལེན་ཚུ་གིས་ [`Rwa` ཌེ་ཊ་གི་བྱུང་རྐྱེན་](/dz/blockchain/filters.md#data-event-filters) བཟོ་སྐྲུན་འབད་, ཇོ་བདག་གིས་བསྒྱུར་བཅོས་འབད་, བཀྲམ་སྤེལ་འབད་, མཉམ་འབྲེལ་འབད་, གསོལ་གཏང་འབད་, སྒྲིང་སྒྲི་བཟོ་, སྒྲིང་འཇགས་འབད་, སྤར་གཏང་འབད་, དབང་ཤུགས་ཀྱི་ཐོག་ལས་གནས་སྤོར་འབད་, སྲུང་འཛིན་གྱི་འགྱུར་བཅོས་འབད་, དང་ metadata འབྱུང་རྐྱེན་ཚུ་ཨིན།

Torii ལྕགས་ཐག་གི་གནས་སྟངས་ཀྱི་ལམ་སྟོན་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན། དཔེར་ན། `/v1/rwas` དང་ `/v1/rwas/query`, གཞན་ཡང་འཚོལ་ཞིབ་ལམ་ཚུ་ དཔེར་ན་ `/v1/explorer/rwas` དང་ `/v1/explorer/rwas/{rwa_id}` རྒྱུན་འགྲུལ་ལམ་གྱི་བཟའ་ཚན་འདི་ འགོ་བཙུགས་ཡོདཔ་ད་ བཟོ་སྐྲུན་འབད་མི་མཁོ་ཆས་ཚུ་གིས་ [`/openapi`](/dz/reference/torii-endpoints.md#common-endpoints) ཐོ་བཀོད་འདི་ node གིས་བཏོན་མི་ response form གྱི་དོན་ལུ་ཨིན།

### Taira ལུ་ བརྟག་དཔྱད་རྐྱབས། {#try-it-on-taira}

མི་མང་ Taira གིས་ ད་རེས་ RWA ལྡོག་ཕྱོགས་ཚུ་ནང་ ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན་ན་ བརྟག་དཔྱད་འབད་:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

RWA ཕྲང་ལམ་ཚུ་བཏོན་ནི་ Taira OpenAPI ཡིག་སྣོད་ནང་མཐོང་ཚུགསཔ་ཨིན།

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

`items` སྟོང་པ་ཐོན་ཐངས་འདི་ ཐོ་བཀོད་འབད་མ་ཚར་བའི་སྐབས་ མཇུག་བསྡུ་དགོཔ་ཨིན། ཐོ་བཀོད་ཀྱི་ལཱ་དང་ བརྗེ་སོར་འབད་ནི་ དེ་ལས་ བསྡུ་འཛིན་འབད་ནི་དང་ མཚམས་འཇོག་འབད་ནི་ དེ་ལས་ བསྐྱིན་འགྲུལ་ལེན་ནི་ཚུ་ ངོ་རྟགས་བཀོད་མི་ ཚོང་འབྲེལ་ཚུ་ཨིན།

## དཔྱད་ཞིབ་འབད་ {#try-it}

འོག་གི་དཔེ་ཁྲ་ཚུ་ནང་ Python SDK གི་ས་ཁོངས་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ [Shared Setup](/dz/guide/tutorials/python.md#shared-setup).རྩིས་ཁྲ་ IDs དང་ སྒེར་གྱི་ལྡེ་མིག་ཚུ་ དེ་ལས་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་བཱོལ་ IDs ཚུ་ ཚོང་འབྲེལ་མ་བཙུགས་པའི་ཧེ་མ་ རང་སོའི་དྲ་ལམ་ནང་ལས་ གནས་གོང་ཚུ་དང་གཅིག་ཁར་ བསྒྱུར་བཅོས་འབད་དགོ།

### RWA API ཕྲང་ལམ་ཚུ་འཚོལ་འབད། {#discover-rwa-api-routes}

འ་ནི་ལྷག་ཐངས་རྐྱངམ་གཅིག་གིས་ དཔེ་སྟོན་འབད་ཚུགས་པ་ཅིན་ བྱ་བའི་ Torii མཚམས་སྦྱོར་འབད་ནི་འདི་གིས་ app-facing RWA ཕྲང་ལམ་ཚུ་ རྩ་སྒྲིག་འབད་ཚུགསཔ་ཨིན།

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

ཐོ་བཀོད་འདི་སྟོངམ་ཡོད་པ་ཅིན་ node གིས་ RWA གི་བསླབ་བྱ་དང་དྲི་ཚུ་གཞན་ Torii APIs གྱི་ཐོག་ལས་ རྒྱབ་སྐྱོར་འབད་ཚུགས་རུང་ འདི་གིས་ optional JSON ཕྲང་ལམ་བཟའ་ཚན་བཏོན་མི་ཨིན།

### ཅ་དམ་ཁང་གི་ ཐོབ་ཐོ་བཀོད་འབད་ {#register-a-warehouse-receipt}

ལས་འཛིན་གྱི་ལས་འགུལ་ཅིག་གིས་ ཐོ་བཀོད་ཅན་གྱི་ཚོང་འབྲེལ་ལག་ལེན་ཅིག་ལུ་འགྱུར་བའི་སྐབས་ གྲོས་འཆར་ལག་ལེན་འཐབ་ཨིན། ཚོང་འབྲེལ་ཡི་གུ་གི་ཨང་གྲངས་འདི་ `primary_reference` ལུ་འགྱོ་དོ་ཡོདཔ་ད་ མཁན་ཆེན་ ID གྱིས་ ཚོང་འབྲེལ་འཐབ་པའི་ཤུལ་ལས་ ཐོན་སྐྱེད་འབདཝ་ཨིན།

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

ཚོང་འབྲེལ་འཐབ་པའི་ཤུལ་ལས་ ཐོ་བཀོད་བཟོཝ་ཨིན། RWA IDs ལྕགས་ཀྱུའི་གནས་སྟངས་ཀྱི་ལམ་ལུགས་ཚུ་གིས་ ཀ་ནོ་ནི་ཀཱན་གྱི་ IDs གསལ་སྟོན་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ ID སླར་ལོག་ལུ་ `primary_reference` ཡང་ན་ མེ་ཊ་ཌའི་ཊ་ཚུ་དང་བསྡོམས་དགོ་པ་ཅིན་ འབྱུང་རྐྱེན་དང་འཚོལ་ཞིབ་འབད་ནིའི་ལམ་ལུགས་ཚུ་ལག་ལེན་འཐབ་:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Explorer-activated node ཚུ་གིས་ཡང་ Richer Projections འདི་ལོག་གཏང་ཚུགས།

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### གནས་སྐབས་ཅིག་གི་དོན་ལུ་ བསྒྱུར་བཅོས་འབད་ནི་ {#transfer-with-a-temporary-hold}

RWA ID ཇི་ནེརཌ་གིས་སླར་ལོག་འབད་མི་འདི་ལག་ལེན་འཐབ་ཨིན། དཔེ་འདི་ནང་ལུ་ `alice` འདི་སྦྱིན་བདག་ཨིནམ་སྦེ་བཀོད་དོ་ཡོདཔ་དང་ འདི་ཡང་ `hold_enabled` ལུ་འཛིན་སྐྱོང་པ་སྦེ་བཟོ་ཡོདཔ་ཨིན།

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

ལྕགས་ཐག་གི་ཕྱི་ཁར་ བྱ་རིམ་མཇུག་བསྡུ་བའི་བསྒང་ལས་ བཀག་བཞག་མི་འདི་སེལ་འཐུ་འབད།

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Controls དང་ Audit Metadata ཚུད་འབད། {#add-controls-and-audit-metadata}

ཚད་འཛིན་དང་ metadata འདི་སོ་སོ་ཨིན། Controller སྲིད་བྱུས་གི་དོན་ལུ་ controls ལག་ལེན་འཐབ་ནི་ དེ་ལས་ applications ཡང་ན་ auditorཚུ་གིས་སྟོན་དགོ་མི་ གནད་དོན་ཚུ་གི་དོན་ལུ་ metadata:

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

### བསྐྱིན་ཚབ་མ་དངུལ་ ཡང་ན་ དངུལ་ཕོགས་མ་དངུལ་ {#redeem-or-retire-quantity}

བསྐྱིན་འགྲུལ་གྱི་གོང་ཚད་དེ་ བགོ་བཀྲམ་འབད་ཚར་ཞིནམ་ལས་ ཟད་འགྲོ་བཏང་ཡོདཔ་དང་ ཟད་འགྲོ་བསྡུ་ལེན་འབད་ཚར་ཞིནམ་ལས་ ཕྱིར་བཏོན་འབད་ཚར་བའི་ཤུལ་ལས་ཨིན། ཨང་གྲངས་འདི་ `redeem_enabled` དང་ ངོ་རྟགས་རྐྱབ་མི་དེ་ ཇོ་བདག་ ཡང་ན་ བདག་འཛིན་འཐབ་མི་ཅིག་སྦེ་དགོཔ་ཨིན།

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### སྒྲིག་གཞི་ཚུ་ བསྐྱར་ཞིབ་འབད་བའི་སྐབས་ མཚམས་འཇོག་འབད་ {#freeze-during-compliance-review}

གྲལ་ཐིག་ལས་ཕྱི་ཁར་ བསྐྱར་ཞིབ་འབད་མི་དེ་གིས་ རྒྱུན་ལྡན་བདག་འཛིན་གྱི་ལཱ་ཚུ་བཀག་ནི་ཨིནམ་ད་ མཚམས་འཇོག་འབད་མི་དེ་ འཛིན་སྐྱོང་འཐབ་མི་ཅིག་ཨིན་པའི་ཁར་ གྲལ་ཐོའི་ནང་ `freeze_enabled` ཡོད་པའི་གནས་ཚུལ།

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

བསྐྱར་ཞིབ་མཇུག་བསྡུ་བའི་བསྒང་ལས་ དེ་སེལ་འཐུ་འབད།

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

### འཁྲུན་ཆོད་ཐོབ་ཐབས། {#invoice-receivable}

གློ་བུར་ཡིག་འདི་ RWA བཏང་ཐོག་ལས་ ཐོ་བཀོད་འབད་ཞིནམ་ལས་ གློ་བུར་གྱི་ཨང་གྲངས་དེ་ `primary_reference` དང་ གསལ་བཀོད་ཚུ་ནང་བཞག་དགོ། ཐོ་བཀོད་ཀྱི་ཤུལ་ལས་ ཕྱིར་འབུད་དང་བསྐྱར་གསོ་གི་དོན་ལུ་ ཐོན་སྐྱེད་འབད་མི་ ID ལག་ལེན་འཐབ་འོང་།

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

འཁྲུན་ཆོད་ཚུ་ དངུལ་རྐྱང་སྦེ་སྤྲོད་ནི་དང་ ཡང་ན་ སྤྲོད་པའི་སྐབས་ལུ་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་རྩིས་ཁྲ་ ID ལག་ལེན་འཐབ་དགོ།

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

བསྡུ་སྒྲིག་འབད་ཡོད་པའི་དངུལ་ཕོགས་ཚུ་ ཕྱིར་འབུད་འབད་ནི།

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ཀེ་བ་ནེཌ་གི་ཁེ་རྒུད་འཐུས་སྤྲོད་ནི་ {#carbon-credit-retirement}

སྐྱིན་འགྲུལ་ལེན་པའི་ཤུལ་ལས་ དངུལ་ཕོགས་སླར་ལོག་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་ཨིན། metadata འདི་ Off-chain བྱིན་ཡོད་པའི་ལག་ཁྱེར་དང་ ཡང་ན་ ཐོ་བཀོད་རྟགས་ལུ་ བཏོན་ཡོདཔ་ཨིན།

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

### ཨང་གཉིས་བསྡོམས་འབད་ {#merge-two-lots}

ལོཊ་ཚུ་ མཉམ་འབྲེལ་འབད་དོ་ཡོདཔ་ད་ ལྕགས་ཐག་ལས་ ཕྱི་ཁ་གི་གནས་སྟངས་གཉིས་ གཅིག་ཁར་བསྡོམས་ཨིན། ཕམ་ཚུ་གིས་ ས་ཁོངས་གཅིག་ནང་སྡོད་དགོཔ་མ་ཚད་ ཚད་གཞི་དེ་ཡང་ ལག་ལེན་འཐབ་དགོ། རུལ་ཐིམ་གྱིས་ ཨ་ལོ་ལོཊ་ ID བཟོ་ཚུགས།

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

Python ཕྱིར་ཚོང་གི་དཔེ་ཚད་འདི་བལྟ་བ་ཅིན་ [real-world assets](/dz/guide/tutorials/python.md#real-world-assets).

## འབྲེལ་ཡོད་ཡིག་ཆ་ཚུ་ {#related-docs}

- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [metadata](/dz/blockchain/metadata.md)
- [Iroha ཁྱད་ཆོས་ཀྱི་བསླབ་བྱ་ཚུ་](/dz/blockchain/instructions.md)
- [དྲི་བཀོད་ཚུ་](/dz/reference/queries.md#assets-nfts-and-rwas)
- [Torii ཚད་མཇུག་གི་ཐིག་ཁྲ།](/dz/reference/torii-endpoints.md#app-and-sora-route-families)
