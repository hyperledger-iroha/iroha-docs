---
translation_locale: dz
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: human-reviewed
---
# གནས་སྟངས་ངོ་མ་གི་ རྒྱུ་དངོས་ཚུ་ {#real-world-assets}

དངོས་ཡོད་འཛམ་གླིང་གི་རྒྱུ་དངོས་ (RWAs) གིས་ བདག་དབང་ཡང་ན་ཚད་འཛིན་འདི་ རྒྱུན་རིམ་གུ ནང་བརྟག་མི་ མཐུད་མཚམས་ཕྱི་ལོ རྒྱུ་དངོས ཚུ་དཔེ་སྟོན་འབདཝ་ཨིན། Iroha ནང་ RWA འདི་ ངོས་འཛིན བཟོ་ཡོད་མི་ བདག་པོའི་ རྩིས་ཐོ, འབོར་ཚད་, ཚོང༌ལཱ༌ ཟུར་གནས་གནད་སྡུད, འབྱུང་ཁུངས དང་ གདམ་ཁ་ཅན་གྱི་ ཚེ་རིམ བཀག༌འཛིན༌ ཚུ་ཡོད་པའི་ རྩིས་ཁྲ ལེ་ཤ་ ཐོ་བཀོད་ཅན་ཅིག་ཨིན།

RWAs འདི་ཨང་གྲངས་རྒྱུ་དངོས་ལྷག་ལུས་ལས་སོ་སོ་ཨིན།

- ཨང་གྲངས་ཀྱི་རྒྱུ་དངོས་འདི་ རྩིས་ཐོ་ཅིག་གིས་ བདག་འཛིན་འཐབ་མི་ བསྒྱུར་བཅོས་འབད་བཏུབ་པའི་ལྷག་ལུས་ཅིག་ཨིན།
- NFT འདི་ ལག་ལེན་པ་གཅིག་དང་གཅིག་ཁར་ ཐོ་བཀོད་ཐོག་གི་ཐོ་ཡིག་ཅིག་ཨིན།
- RWA འདི་ ཚོང་འབྲེལ་གྱི་ མེ་ཊ་ཌེ་ཊ་ འབོར་ཚད་ འཛིན་བཟུང་ གྱང་ཤུགས་ བསྐྱར་གསོ་གནས་སྟངས་ འབྱུང་ཁུངས་ དེ་ལས་ ཚད་འཛིན་སྲིད་བྱུས་ཚུ་ འབག་ཚུགས་པའི་ ལེ་ཤ་ཅིག་རང་ཨིན།

རྩིས་ཐོ་འདི་གིས་ ཕང་གྷི་བཱལ་ལྷག་ལུས་རྐྱངམ་ཅིག་གི་ཚབ་ལུ་ དམིགས་བསལ་གྱི་ཨོཕ་ཅེན་ལོཊི་ཅིག་ངོ་བཏོན་དགོ་པའི་སྐབས་ RWAs ལག་ལེན་འཐབ།

## RWA ལོ {#rwa-lot}

RWA བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལས་:

- `id`: བཟོ་སྐྲུན་འབད་ཡོད་པའི་ ཀ་ནན་གྱི་ངོ་རྟགས་ RWA འདི་ `<hash>$<domain>`སྦེ་སྟོན་འབདཝ་ཨིན།
- `owned_by`: ད་ལྟོ་ལོཊི་འདི་བདག་དབང་འབད་མི་རྩིས་ཐོ།
- `quantity`: མང་ཚོགས་ཀྱིས་མཚོན་པའི་ ཁྱད་དུ་འཕགས་པའི་འབོར་ཚད།
- `spec`: འབོར་ཚད་གསལ་བཀོད་ དཔེར་ན་ ཚག་འཇལ་ཚད་བཟུམ།
- `primary_reference`: གཙོ་བོ་ཨོཕ་-ཅེན་འབྱོར་འཛིན་ ལག་ཁྱེར་ བྱུང་འཛིན་ ཡང་ན་ ཐོ་བཀོད་གཞི་བསྟུན།
- `status`: གདམ་ཁ་ཅན་གྱི་ཚོང་འབྲེལ་གནས་ཚད་ཚིག་ཡིག
- `metadata`: ཚོང་འབྲེལ་གྱི་གནས་སྟངས་དང་ ཚད་འཛིན་འབད་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་མི་ ས་ཆ་ཐུང་ཀུ་ JSON།
- `parents`: འབྱུང་ཁུངས་ལོཊི་ཚུ་ ལོ་ཊི་འདི་བཏོན་ནིའི་དོན་ལུ་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།
- `controls`: ཚད་འཛིན་རྩིས་ཐོ་ཚུ་ ཚད་འཛིན་འགན་ཁུར་ཚུ་ དང་ ལྕོགས་ཅན་ཚད་འཛིན་བཀོལ་སྤྱོད་ཚུ།
- `is_frozen` དང་ `held_quantity`: རན་ཊའིམ་གྱིས་ བསྟར་སྤྱོད་འབད་ཡོད་པའི་ མི་ཚེ་འཁོར་རིམ་གནས་སྟངས།

ལྕགས་ཐག་ནང་གི་ ནང་དོན་གནད་སྡུད་གྱི་ཁལ་འདི་ ཉམ་ཆུང་སྦེ་བཞག་ནི། ཁྲིམས་ཀྱི་ཡིག་ཆ་སྦོམ་དང་ བརྟག་ཞིབ་སྙན་ཞུ་ དེ་ལས་ ལྟ་རྟོག་གི་ཐིག་ཁྲམ་ཚུ་ WSV གི་ཕྱི་ཁར་བཞག་ཞིནམ་ལས་ URI ཡང་ན་ SoraFS ཕྲང་ལམ་ ཡང་ན་ ཁ་གསལ་ཁ་བྱང་ཅིག་ RWA མེ་ཊ་ཌའི་ཊ་ནང་བཙུགས་འོང་།

## ངོས་འཛིན་འབད་མི་ཚུ་ {#identifiers}

`RegisterRwa` གིས་ ཁ་སླབ་མི་གིས་གདམ་ཁ་རྐྱབ་མི་ `id` ངོས་ལེན་མི་འབད་ དེ་ལས་ `owner` ས་སྒོ་ཅིག་ངོས་ལེན་མི་འབད། བརྗེ་སོར་གནང་བ་གཙོ་བོ་འདི་ འགོ་ཐོག་ `owned_by` རྩིས་ཐོ་ལུ་འགྱུརཝ་ཨིནམ་དང་ མཉེན་ཆས་ལག་བསྟར་མཉེན་ཆས་གྱིས་ དམིགས་གཏད་མངའ་ཁོངས་ནང་ `RwaId` བཟོ་བཏོན་འབདཝ་ཨིན།

RWA ID གི་ཚིག་ཡིག་རྣམ་པ་ནི།

```text
<generated-hash>$<domain>
```

དཔེར་ན་:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

གློག་རིམ་ཚུ་གིས་ ཁོང་རའི་ཚོང་འབྲེལ་ངོས་འཛིན་འདི་ `primary_reference` ཡང་ན་ `metadata` ནང་ལུ་གསོག་འཇོག་འབད་དགོཔ་ཨིན་ དེ་ལས་ `RwaId` ལས་ བཟོ་བཏོན་འབད་ཡོད་པའི་ `RwaEvent::Created` འདི་ `FindRwas` དང་ `/v1/rwas` ཡང་ན་ འཚོལ་ཞིབ་འབད་མི་འདི་གི་ཤུལ་ལས་ འཚོལ་ཞིབ་འབད་དགོ།

## སྲོལ་འཁོར་ {#lifecycle}

སྤྱིར་བཏང་RWA ལས་ཀའི་རྒྱུན་རིམ་ནང་།

| བཀོལ་སྤྱོད་ | ལག་ལེན་འཐབ་ཡོད་པའི་སྤྱོད་ལམ། |
| | -------------------------------------------- -------------------------------------------- |
| `RegisterRwa` | མངའ་ཁོངས་ནང་ལུ་ བཟོ་བཏོན་འབད་ཡོད་པའི་-ཨའི་ཌི་ལོཊི་ཅིག་གསར་བསྐྲུན་འབད། བརྗེ་སོར་དབང་ཚད་འདི་ `owned_by` ལུ་འགྱུརཝ་ཨིན། |
| `TransferRwa` | རྩིས་ཐོ་གཞན་ཅིག་ལུ་འབོར་ཚད་སྤོ་བཤུད་འབད། གནས་སོར་ཆ་ཚང་གིས་ `owned_by` བསྒྱུར་བཅོས་འབད་ཚུགས། ཆ་ཤས་སྤོ་བཤུད་ཅིག་གིས་ བཟོ་བཏོན་འབད་ཡོད་པའི་ཨའི་ཌི་དང་གཅིག་ཁར་ ཆ་ལག་ལོཊི་སོ་སོ་ཅིག་གསར་བསྐྲུན་འབདཝ་ཨིན། |
|`HoldRwa` |མང་ཚད་འདི་ཟུར་བཞག་འབད། སྒྲིག་བཀོད་འབད་ཡོད་པའི ཚད་འཛིན་པ དང་ `hold_enabled` དགོཔ་ཨིན། |
| `ReleaseRwa` | བཀག་བཞག་ཡོད་པའི་འབོར་ཚད་རྩ་བསྐྲད་གཏང་། རིམ་སྒྲིག་འབད་ཡོད་པའི་ཚད་འཛིན་དང་ `hold_enabled` དགོཔ་ཨིན། |
|`FreezeRwa` |སྤྱིར་བཏང་བདག་འཛིན་འཐབ་པའི་ལཱ་ཚུ་བཀག་སྡོམ་འབད་ཡོདཔ་ཨིན། སྒྲིག་གཞི་སྒྲིག་ཅན་གྱི་འཛིན་སྐྱོང་དང་ `freeze_enabled` དགོཔ་ཨིན།|
|`UnfreezeRwa` |སྤྱིར་བཏང་བདག་འཛིན་གྱི་ལཱ་ཚུ་ སླར་ལོག་འབད་ཚུགས། སྒྲིག་གཞི་སྒྲིག་ཡོད་པའི་ལག་ལེན་དང་ `freeze_enabled` དགོཔ་ཨིན། |
|`RedeemRwa` |ཨང་ཚད་འདི་ དུས་རྒྱུན་དུ་རྒྱུན་འགྲུལ་ནང་ལས་བཏོན་གཏང་ཨིན། སྦྱིན་བདག་དང་ལག་ལེན་འཐབ་མི་ཅིག་གིས་ `redeem_enabled` བདེན་པ་ཨིན་པ་ཅིན་ བཏབ་ཚུགས།|
| `MergeRwas` | ཕམ་ལོཊི་ཚུ་ལས་ འབོར་ཚད་ཚུ་ མངའ་ཁོངས་གཅིག་མཚུངས་དང་ གསལ་བཀོད་ཚུ་ བཟོ་བཏོན་འབད་ཡོད་པའི་ ཨ་ལུའི་ལོཊི་ནང་ལུ་ མཉམ་སྡེབ་འབད། |
|`ForceTransferRwa` |ཚད་གཞི་དེ་སེལ་འཐུ་འབད་ནིའི་ལམ་ལུགས་ཅིག་ལས་ སྤོ་བཤུད་འབད། སེལ་འཐུ་འབད་ཡོད་པའི་ལམ་ལུགས་དང་ `force_transfer_enabled` དགོཔ་ཨིན།|
|`SetRwaControls` |རྒྱུ་དངོས་ཆ་ཚན་གྱི་འཛིན་སྐྱོང་གི་ སྲིད་བྱུས་འདི་ བསྒྱུར་བཅོས་འབད་དགོ་ སྦྱིན་བདག་དང་འཛིན་སྐྱོང་འཐབ་མི་ཅིག་ དགོཔ་ཨིན།|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |ལོཊ་གི་བརྡ་དོན་ཚུ་ ད་ལྟོའི་གནས་གོང་བཟོཝ་ཨིན། བདག་འཛིན་ ཡང་ན་ འཛིན་སྐྱོང་འཐབ་མི་ཅིག་ དགོཔ་ཨིན། མགོན་གཏང་ཡོད་པའི་ ལཱཊ་ཚུ་གིས་ འཛིན་སྐྱོང་འབད་མི་ཚུ་ དགོཔ་ཨིན་མས།|

ད་ལྟོའི་ཨང་རྟགས་ནང་ `UnregisterRwa` བཀོད་རྒྱ་མེད། ངོ་ཚབ་འབད་མི་འབོར་ཚད་འདི་ བཀྲམ་སྤེལ་འབད་བའི་སྐབས་ ཟ་སྤྱོད་འབད་བའི་སྐབས་ གཞི་བཅག་སྟེ་ ཡང་ན་ དེ་མེན་པ་ཅིན་ བཀྲམ་སྤེལ་ལས་བཏོན་གཏང་པའི་སྐབས་ `RedeemRwa` དང་ཅིག་ཁར་ རིམ་སྒྲིག་མེད་པའི་ ལོཊ་ཅིག་ དགོངས་ཞུ་འབད།

## གནས་བརྡ་དང་ཚད་འཛིན་ {#metadata-and-controls}

གློག་རིམ་ཚུ་གིས་ ལོཊི་ངོས་འཛིན་དང་བདེན་དཔྱད་འབད་ནི་ལུ་ ཕན་ཐོགས་པའི་ བདེན་པ་ཆུང་ཀུ་ཚུ་གི་དོན་ལུ་ མེ་ཊ་ཌེ་ཊ་ལག་ལེན་འཐབ།

- རྒྱུ་དངོས་དབྱེ་རིམ་ བཀྲམ་སྤེལ་པ་ བདག་འཛིན་འཐབ་མི་ ཡང་ན་ ཐོ་བཀོད་གཞི་བསྟུན།
- མཛོད་ཁང་། བང་མཛོད་། ISIN བྱུང་འཛིན་ཡང་ན་ལག་ཁྱེར་ངོས་འཛིན་བྱེད་མཁན།
- བདེན་དཔང་དང་ཁྲིམས་དོན་ཡིག་ཆ་ཚུ་གི་དོན་ལུ་ ནང་དོན་ཧ་ཤི་ཚུ།
- SoraFS ཐབས་ལམ་ཚུ་ ཡང་ན་ བརྡ་བཀོད་གི་ཁ་བྱང་ཚུ་ རིན་བསྡུར་རྟགས་སྦོམ་ཚུ་གི་དོན་ལུ་
- དུས་ཚོད་དང་དབང་ཚད་ ཡང་ན་ བསྟར་སྤྱོད་ཀྱི་རྟགས་མཚན་ཚུ་ ཕྱི་ཁའི་རྒྱུན་རིམ་ཞབས་ཏོག་ཚུ་གིས་ ལག་ལེན་འཐབ་ཨིན།

ལག་ལེན་འཐབ་ཡོད་པའི་ `RwaControlPolicy` ལུ་ ས་སྒོ་འདི་ཚུ་ཡོདཔ་ཨིན།

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

ཚད་འཛིན་རྩིས་ཐོ་དང་འགན་ཁུར་ཚུ་གིས་ འབྲེལ་མཐུན་བུ་ལིན་དར་ཆ་ཚུ་གིས་ལྕོགས་ཅན་བཟོ་ཡོད་པའི་བཀོལ་སྤྱོད་ཚུ་རྐྱངམ་ཅིག་འབད་ཚུགས། ད་ལྟོའི་ཚད་འཛིན་ནང་དོན་གནད་སྡུད་ནང་ ཚད་འཛིན་ངོ་རྟགས་དང་ བཀོལ་སྤྱོད་ཀྱི་དར་ཆ་ཚུ་ཡོདཔ་ཨིན། སྤོ་བཤུད་ཆོག་པའི་ཐོ་ཡིག་དང་ ནང་འཁོད་ `transfers` ལམ་ལུགས་ཚུ་ འདི་གི་ཕྱི་ཁར་ཡོདཔ་ཨིན།

## དྲི་བཀོད་དང་བྱུང་རྐྱེན་ཚུ་ དེ་ལས་ APIs {#queries-events-and-apis}

ཁྱོད་ཀྱིས་ [`FindRwas`](/dz/reference/queries.md#assets-nfts-and-rwas) ལག་ལེན་འཐབ་སྟེ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ RWA ལོཊ་ཚུ་བཀོད་ཐོ་རྐྱབས་ཚུགས། འོག་གི་གནས་སྟངས་ནང་ ད་ལྟོའི་གནས་སྟངས་ལུ་ དགོས་མཁོ་ཅན་གྱི་ལག་ལེན་ཚུ་གིས་ [`Rwa` ཌེ་ཊ་གི་བྱུང་རྐྱེན་](/dz/blockchain/filters.md#data-event-filters) བཟོ་སྐྲུན་འབད་, ཇོ་བདག་གིས་བསྒྱུར་བཅོས་འབད་, བཀྲམ་སྤེལ་འབད་, མཉམ་འབྲེལ་འབད་, གསོལ་གཏང་འབད་, སྒྲིང་སྒྲི་བཟོ་, སྒྲིང་འཇགས་འབད་, སྤར་གཏང་འབད་, དབང་ཤུགས་ཀྱི་ཐོག་ལས་གནས་སྤོར་འབད་, སྲུང་འཛིན་གྱི་འགྱུར་བཅོས་འབད་, དང་ ཟུར་གནས་གནད་སྡུད འབྱུང་རྐྱེན་ཚུ་ཨིན།

Torii གིས་ `/v1/rwas` དང་ `/v1/rwas/query`བཟུམ་ ལྕགས་ཐག་གི་གནས་སྟངས་ཀྱི་ལམ་སྟོན་ཚུ་བཏོན་ནི་ཨིནམ་མ་ཚད་ ལམ་འཚོལ་མི་ལམ་ཚུ་ཡང་ `/v1/explorer/rwas`དང་ `/v1/explorer/rwas/{rwa_id}` འདི་བཟུམ་གྱི་ལམ་སྟོན་བཟའ་ཚན་འདི་ འོག་ལུ་བཀོད་ཡོདཔ་ད་ ཇི་ནེརཌ་གིས་ཨེབ་གཏང་འབད་ཡོད་པའི་ ཐོ་བཀོད་དེ་ ཧེང་སྐལ་ར་ [`/openapi.json`](/dz/reference/torii-endpoints.md#common-endpoints) ལུ་ གཞི་སྒྲིག་འབད་དགོཔ་ཨིན།

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

མི་མང་ས་ཁོངས་ཚུ་ ད་ལྟོ་ཡང་ ཐོ་བཀོད་མ་འབད་བའི་སྐབས་ `items` ཐོན་འབྲས་སྟོངམ་འདི་ རེ་བ་བསྐྱེདཔ་ཨིན། ཐོ་བཀོད་དང་ སྤོ་བཤུད་ བཀག་བཞག་ གྱང་ཤུགས་ དེ་ལས་ བསྐྱར་གསོ་ཚུ་ མཚན་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་ཚུ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#try-it}

འོག་གི་དཔེ་ཁྲ་ཚུ་ནང་ Python SDK གི་ས་ཁོངས་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ [མཉམ་འབྲེལ་མཐུན་རྐྱེན་](/dz/guide/tutorials/python.md#shared-setup).རྩིས་ཐོ་ IDs དང་ སྒེར་གྱི་ལྡེ་མིག་ཚུ་ དེ་ལས་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་བཱོལ་ IDs ཚུ་ ཚོང་འབྲེལ་མ་བཙུགས་པའི་ཧེ་མ་ རང་སོའི་དྲ་ལམ་ནང་ལས་ གནས་གོང་ཚུ་དང་གཅིག་ཁར་ བསྒྱུར་བཅོས་འབད་དགོ།

### RWA API ཕྲང་ལམ་ཚུ་འཚོལ་འབད། {#discover-rwa-api-routes}

འ་ནི་ལྷག་ཐངས་རྐྱངམ་གཅིག་གིས་ དཔེ་སྟོན་འབད་ཚུགས་པ་ཅིན་ བྱ་བའི་ Torii མཚམས་སྦྱོར་འབད་ནི་འདི་གིས་ གློག་རིམ་ཕྱོགས་ཀྱི RWA ཕྲང་ལམ་ཚུ་ རྩ་སྒྲིག་འབད་ཚུགསཔ་ཨིན།

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

ཐོ་བཀོད་འདི་སྟོངམ་ཡོད་པ་ཅིན་ མཐུད་མཚམས གིས་ RWA གི་བསླབ་བྱ་དང་དྲི་ཚུ་གཞན་ Torii APIs གྱི་ཐོག་ལས་ རྒྱབ་སྐྱོར་འབད་ཚུགས་རུང་ འདི་གིས་ གདམ་ཁ་ཅན JSON ཕྲང་ལམ་བཟའ་ཚན་བཏོན་མི་ཨིན།

### ཅ་དམ་ཁང་གི་ ཐོབ་ཐོ་བཀོད་འབད་ {#register-a-warehouse-receipt}

ཚོང་འབྲེལ་གྱི་བྱ་བ་གཅིག་གིས་ མིང་རྟགས་བཀོད་ཡོད་པའི་ཚོང་འབྲེལ་གཅིག་ལུ་འགྱུར་དགོཔ་ད་ ཟིན་བྲིས་ཅིག་ལག་ལེན་འཐབ། ཚོང་འབྲེལ་གྱི་འབྱོར་རྟགས་ཨང་གྲངས་འདི་ `primary_reference` ནང་ལུ་འགྱོཝ་ཨིན། རྩིས་ཐོ་ཨའི་ཌི་འདི་ ཚོང་འབྲེལ་ཁས་བླངས་འབད་བའི་ཤུལ་ལས་ བཟོ་བཏོན་འབདཝ་ཨིན།

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

ཚོང་འབྲེལ་ཁས་བླངས་འབད་བའི་ཤུལ་ལས་ བཟོ་བཏོན་འབད་ཡོད་པའི་ RWA IDs ཚུ་ཐོ་བཀོད་འབད། རིམ་སྒྲིག་གནས་སྟངས་ཀྱི་ལམ་ཚུ་གིས་ ཚད་ལྡན་ཨའི་ཌི་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ཨའི་ཌི་ཅིག་ལོག་སྟེ་ `primary_reference` ཡང་ན་ མེ་ཊ་ཌེ་ཊ་ལུ་མཐུན་སྒྲིག་འབད་དགོཔ་ད་ བྱུང་ལས་ཚུ་ཡང་ན་ འཚོལ་ཞིབ་ཁ་གསལ་འགྲུལ་ལམ་ཚུ་ལག་ལེན་འཐབ།

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

འཚོལ་ཞིབ་ལྕོགས་ཅན་བཟོ་ཡོད་པའི་མཐུད་མཚམས་ཚུ་གིས་ཡང་ དམིགས་ཚད་ཕྱུགཔོ་ཚུ་སླར་ལོག་འབད་ཚུགས།

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### གནས་སྐབས་ཅིག་གི་དོན་ལུ་ བསྒྱུར་བཅོས་འབད་ནི་ {#transfer-with-a-temporary-hold}

རིམ་སྒྲིག་གིས་སླར་ལོག་འབད་མི་ བཟོ་བཏོན་འབད་ཡོད་པའི་ RWA ID ལག་ལེན་འཐབ། དཔེ་འདི་གིས་ `alice` འདི་ ཇོ་བདག་ཨིནམ་སྦེ་ བསམ་ཞིབ་འབདཝ་ཨིནམ་དང་ དེ་ཡང་ `hold_enabled` དང་ཅིག་ཁར་ ཚད་འཛིན་སྦེ་ རིམ་སྒྲིག་འབད་ཡོདཔ་ཨིན།

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

`ReleaseRwa` འདི་ ཨོཕ་-ཅེན་བྱ་རིམ་མཐར་འཁྱོལ་བའི་ཤུལ་ལས་ བཙུགས།

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ཚད་འཛིན་དང་རྩིས་ཞིབ་ཀྱི་གནས་བརྡ་ཚུད་འབད། {#add-controls-and-audit-metadata}

ཚད་འཛིན་དང་མེ་ཊ་ཌེ་ཊ་ཚུ་སོ་སོ་ཨིན། ཚད་འཛིན་སྲིད་བྱུས་དང་ གློག་རིམ་ཡང་ན་རྩིས་ཞིབ་པ་ཚུ་གིས་བཀྲམ་སྟོན་འབད་དགོ་པའི་བདེན་པ་ཚུ་གི་དོན་ལུ་ ཚད་འཛིན་ཚུ་ལག་ལེན་འཐབ།

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

ངོ་ཚབ་འབད་མི་ རྒྱུན་རིམ་ཕྱི་ཁའི་རྒྱུ་དངོས་འདི་ བཀྲམ་སྤེལ་འབད་བའི་ཤུལ་ལས་ ཟ་སྤྱོད་འབད་ཚར་བའི་ཤུལ་ལས་ དགོངས་ཞུ་འབད་ཚར་བའི་ཤུལ་ལས་ ཡང་ན་ དེ་མེན་པ་ཅིན་ བཀྲམ་སྤེལ་ལས་བཏོན་བཏང་ཚར་བའི་ཤུལ་ལས་ `RedeemRwa` བཙུགས། འདི་གིས་ གཏན་འཇགས་སྦེ་ བཙུགས་ཡོད་པའི་འབོར་ཚད་འདི་ ལོཊི་ལས་ ཕབ་བཏངམ་ཨིན། ལོཊི་འདི་ལུ་ `redeem_enabled` འོང་དགོ། མིང་རྟགས་བཀོད་མི་འདི་ ཇོ་བདག་ཡང་ན་ ཚད་འཛིན་འབད་མི་ཅིག་འོང་དགོ།

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### སྒྲིག་གཞི་ཚུ་ བསྐྱར་ཞིབ་འབད་བའི་སྐབས་ མཚམས་འཇོག་འབད་ {#freeze-during-compliance-review}

སྡེབ་ཐག་ཕྱི་ཁར བསྐྱར་ཞིབ་ གིས་ བདག་པོ གྱི་སྤྱིར་བཏང་ལཱ་ཚུ་བཀག་དགོ་པ་ཅིན་ `FreezeRwa` ཕུལ། མིང་རྟགས་འགོད་མི འདི་ ཚད་འཛིན་པ ཨིན་དགོ་ དེ་ལས་ རྒྱུ་དངོས་ཆ་ཚན ནང་ `freeze_enabled` ཡོད་དགོ།

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

བསྐྱར་ཞིབ་འདི་འགྱོ་བའི་ཤུལ་ལས་ `UnfreezeRwa` བཙུགས།

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

`primary_reference` དང་ མེ་ཊ་ཌེ་ཊ་ནང་ བྱུང་འཛིན་ཨང་གྲངས་གསོག་འཇོག་འབད་དེ་ བྱུང་འཛིན་ཅིག་ RWA ལོཊི་སྦེ་ ངོ་བཏོན་འབད། ཐོ་བཀོད་འབད་ཚར་བའི་ཤུལ་ལས་ སྤོ་བཤུད་དང་ བསྐྱར་ལེན་གྱི་དོན་ལུ་ བཟོ་བཏོན་འབད་ཡོད་པའི་ཨའི་ཌི་འདི་ལག་ལེན་འཐབ།

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

ཐོབ་དགོཔ་འདི་ མ་དངུལ་བཏང་པའི་སྐབས་ ཡང་ན་ སྤྲོད་པའི་སྐབས་ བཟོ་བཏོན་འབད་ཡོད་པའི་ བྱུང་འཛིན་ལོཊི་ཨའི་ཌི་འདི་ལག་ལེན་འཐབ།

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

འབྲེལ་མཐུད་ལས་ཕྱི་ཁར་གཞིས་ཆགས་འབད་བའི་ཤུལ་ལས་ ངོ་ཚབ་འབད་ཡོད་པའི་དངུལ་འབོར་འདི་ བསྐྱར་ལོག་འབད།

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ཀེ་བ་ནེཌ་གི་ཁེ་རྒུད་འཐུས་སྤྲོད་ནི་ {#carbon-credit-retirement}

བཀོལ་སྤྱོད་ལས་ ཐོབ་བརྗོད་བཀོད་ཡོད་པའི་ ནག་རྫས་བུ་ལོན་ཚུ་ བཏོན་གཏང་ནིའི་དོན་ལུ་ `RedeemRwa` བཙུགས། མེ་ཊ་ཌེ་ཊ་ནང་ ཨོཕ་ཅེན་ལག་ཁྱེར་ཡང་ན་ ཐོ་བཀོད་བདེན་ཁུངས་འདི་གསོག་འཇོག་འབད།

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

རིམ་སྒྲིག་ཕྱི་ཁའི་གནས་རིམ་གཉིས་མཉམ་བསྡོམས་འབད་བའི་སྐབས་ ལོཊི་ཚུ་མཉམ་བསྡོམས་འབད། ཕམ་ཚུ་ མངའ་ཁོངས་གཅིག་ནང་འོང་དགོཔ་དང་ འབོར་ཚད་གཅིག་པའི་གསལ་བཀོད་ལག་ལེན་འཐབ་དགོ། རན་ཊའིམ་གྱིས་ ཆ་ལག་ལོཊི་ཨའི་ཌི་འདི་བཟོ་བཏོན་འབདཝ་ཨིན།

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

Python ཕྱིར་ཚོང་གི་དཔེ་ཚད་འདི་བལྟ་བ་ཅིན་ [ངོ་མ-འཛམ་གླིང རྒྱུ་དངོས་ཚུ](/dz/guide/tutorials/python.md#real-world-assets).

## འབྲེལ་ཡོད་ཡིག་ཆ་ཚུ་ {#related-docs}

- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [ཟུར་གནས་གནད་སྡུད](/dz/blockchain/metadata.md)
- [Iroha ཁྱད་ཆོས་ཀྱི་བསླབ་བྱ་ཚུ་](/dz/blockchain/instructions.md)
- [དྲི་བཀོད་ཚུ་](/dz/reference/queries.md#assets-nfts-and-rwas)
- [Torii ཚད་མཇུག་གི་ཐིག་ཁྲ།](/dz/reference/torii-endpoints.md#app-and-sora-route-families)
