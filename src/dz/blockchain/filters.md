---
translation_locale: dz
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# གློག་ཐིག་ཚུ་ {#filters}

འབྱུང་རྐྱེན་འབྱུང་ཁུངས་དང་ འགོ་བཙུགས་ནིའི་གནས་སྟངས་ཚུ་ གསོག་ཐིག་འབདཝ་ཨིན། ད་ལྟོའི་གནས་ཚད་མཐོ་ཤོས་གི་ འབྱུང་རྐྱེན་སེལ་འཐུ་འབད་མི་འདི་ `EventFilterBox`ཨིན། འདི་ཡང་ འབྱུང་རྐྱེན་གྱི་བཟའ་ཚན་འདི་དང་གཅིག་ཁར་བསྡོམས་ཚུགས།

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

ལཱ་གི་རྒྱུན་ལམ་ལུ་ འགྱུར་ལྡནམ་སྦེ་ བཟོ་ཚུགས་པའི་ ཐིག་ཁྲམ་ཆུང་ཤོས་འདི་ ལག་ལེན་འཐབ་ཨིན། `DataEventFilter::Any`བཟུམ་འབད་མི་ ཐིག་ཁྲ་སྦོམ་ཚུ་ ནད་གཞི་བརྟག་དཔྱད་ཀྱི་དོན་ལུ་ ཕན་ཐོགས་ཅན་ཨིན་ དེ་འབདཝ་ད་ དེ་ཚུ་གིས་ ལས་རིམ་རེ་གིས་ འགོ་བཙུགས་ནི་དང་ subscriber འདྲ་མཉམ་བཟོ་ནི་གི་ ཟད་འགྲོ་སྤྲོད་ནི་ཨིན་མས།

## གནས་སྡུད་བྱུང་རྐྱེན་ཚུ་ བཀྲམ་སྟོན་འབདཝ་ཨིན། {#data-event-filters}

`DataEventFilter` གིས་ ལེ་ཇིར་ཌ་གི་ གནད་དོན་ཚུ་དང་ཕྱདཔ་ད་ཨིན། འདི་ནང་ལུ་ ད་ལྟོའི་འགྱུར་བཅོས་ཚུ་ནང་:

|ཁྱད་པར་ཅན་ |འབྱུང་རྐྱེན་གྱི་བཟའ་ཚན་ |
| --- | --- |
|`Any` |གནད་དོན་ག་ཅི་ཡང་འབྱུང་འོང་།|
|`Peer` |གྲྭ་ཚང་གི་ཚེ་རིང་མཐའ་འཁོར་གྱི་བྱུང་རྐྱེན་ |
|`Domain` |Domain གི་ཚེ་རིང་འཁོར་དང་ metadata events |
|`Account` |རྩིས་ཁྲ་གི་ཚེ་རིམ་, metadata, alias, དང་ ངོ་རྟགས་འབྱུང་ཁུངས། |
|`Asset` |རྒྱུ་དངོས་གི་གནས་ཚད་དང་ metadata བྱུང་རྐྱེན་ཚུ་|
|`AssetDefinition` |རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ཚེ་རིང་། སྲིད་བྱུས་དང་ metadata events |
|`Nft` |NFT ཚེ་རིང་འཁོར་དང་ མེ་ཊ་ཌའི་ཊ་གི་བྱུང་རྐྱེན་ཚུ་ |
|`Rwa` |གནས་སྟངས་ངོ་མ་གི་ རྒྱུ་དངོས་ཚུ་གི་ཚེ་རིང་རིམ་གྱི་བྱུང་རྐྱེན་ཚུ་ |
|`Trigger` |སྲོལ་རྒྱུན་འཁོར་དང་ metadata གི་བྱུང་རྐྱེན་ཚུ་ |
|`Role` |འགན་འཁྲི་ཚེ་རིང་གི་བྱུང་རྐྱེན་ཚུ་ |
|`Configuration` |ལྕགས་ཐག་ནང་ལུ་ གཞི་སྒྲིག་གི་བྱུང་རྐྱེན་ཚུ་ |
|`Executor` |Runtime Executor གི་བྱུང་རྐྱེན་ཚུ་ |
|`Proof` |དཔྱད་ཡིག་བརྟག་དཔྱད་ སྲོལ་འཁོར་གྱི་བྱུང་རྐྱེན་ཚུ་ |
|`Confidential` |ཉེན་ཁ་ཅན་གྱི་ རྒྱུ་དངོས་གི་བྱུང་རྐྱེན་ཚུ་ |
|`VerifyingKey` |ཐོ་བཀོད་ལྡེ་མིག་ཚུ་ བརྟག་དཔྱད་འབད་ནི་ |
|`RuntimeUpgrade` |Runtime ཡར་དྲག་གཏང་ནིའི་ ལས་རིམ་ཚུ་ |
|`Soradns` |Resolver directory governance events འདི་སེལ་འཐུ་འབད་ |
|`Sorafs` |SoraFS gateway compliance events |
|`SpaceDirectory` |Space Directory གིས་ མི་ཚེའི་འཁོར་ལོའི་བྱུང་རྐྱེན་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན། |
|`Escrow` |རང་བཞིན་གྱི་རྒྱུ་དངོས་ཚུ་གི་ ཉེན་སྲུང་གི་ཚེ་རིང་ནང་ལུ་ འབྱུང་རྐྱེན་ཚུ་ |
|`Offline` |Offline settlement events  གྲོས་བསྡུར་འབད་ཐངས་ཚུ་|
|`Oracle` |Oracle ཕི་ཌ་གི་བྱུང་རྐྱེན་ཚུ་ |
|`Social` |ནད་འབུབ་ཀྱི་ stimulus events |
|`Bridge` |Bridge events |
|`Governance` |གཞུང་སྐྱོང་གི་ལས་རིམ་ཚུ་  གཞུང་སྐྱོང་གི་འགན་ཁུར་འདི་ ལག་ལེན་འཐབ་པའི་སྐབས་ |

བཀྲིས་སྒང་གི་ གློག་ཐིག་མང་ཤོས་ཅིག་གིས་ གདམ་ཁ་རྐྱབ་བཏུབ་པའི་ ID མཉམ་བསྡུར་དང་ འབྱུང་རྐྱེན་-set mask འདི་ཡང་མཁོ་སྒྲུབ་འབད་ཡོདཔ་ཨིན། དཔེ་འབད་བ་ཅིན་ རྒྱུ་དངོས་གློག་ཐིག་ཅིག་གིས་ རྒྱུ་དངོས་གཅིག་ ཡང་ན་ རྒྱུ་དངོས་ལས་རིམ་གྱི་སྡེ་ཚན་ཅིག་དང་འདྲ་མཉམ་བཟོ་ཚུགས་ནི་ཨིནམ་ད་ trigger filter གིས་ trigger ID དང་ trigger event set ཚུ་དང་འདྲ་མཉམ་བཟོ་བར་ཨིན།

## གློག་སྣུམ་གྱི་ཐིག་ཁྲམ་ཚུ་ {#pipeline-filters}

pipeline filter འདི་ block དང་ transaction མཉམ་འབྲེལ་དང་ witness events ཚུ་བཟུམ་སྦེ་ processing འབྱུང་རྐྱེན་ཚུ་དང་བསྡུཝ་ཨིན། ལག་ལེན་འཐབ་ནི་དེ་ operational subscriptions, block-processing dashboards, and triggers that react to pipeline state rather than ledger data objectsགི་དོན་ལུ་ཨིན།

## ཐིག་ཁྲམ་ཚུ་ {#trigger-filters}

trigger འདི་ `EventFilterBox`སྦེ་བཞག་ཡོདཔ་ཨིན། trigger action འདི་ཡང་:

- འོག་གི་ཤོག་ལེབ་ཚུ་
- སླར་ལོག་འབད་ནིའི་ སྲིད་བྱུས་
- ཁྲི་འཛིན་གྱི་རྩིས་ཁྲ་
- གདམ་ཁ་རྐྱབས་ཅིག་ཨིན་མི་ དུས་ཚོད་སེལ་འཐུ་འབད་ནིའི་ སྲིད་བྱུས་
- metadata

trigger authority འདི་ executable གིས་ དགོས་པའི་ ངོས་ལེན་ཚུ་ཡོད་དགོཔ་ཨིན། དམིགས་གཏད་ཅན་གྱི་ལག་རྩལ་རྩིས་ཁྲ་འདི་ ཡུན་རིང་གི་ trigger ཚུ་གི་དོན་ལུ་ གདམ་ཁ་རྐྱབ་ཡོདཔ་ཨིན།

## འདྲི་དཔྱད་ཐིག་ཁྲ། {#query-filters}

ཐད་ཀར་ཐོ་ཚུ་ འབྱུང་རྐྱེན་ཐད་ཀར་ལས་སོ་སོ་ཨིན། བསྒྱུར་བཅོས་འབད་བཏུབ་པའི་དྲི་བ་ཚུ་གིས་ predicate དང་ selector རྒྱབ་སྐྱོར་བཏོན་ཚུགས། SDK ལས་ query-specific typeed filter ལག་ལེན་འཐབ་ དེ་འབདཝ་ལས་ filter input འདི་ཡང་ query output type ལུ་ pas འབད།

འདི་ཡང་བལྟ་:

- [གནད་དོན་ཚུ་](/dz/blockchain/events.md)
- [Native Asset Escrow](/dz/blockchain/escrow.md#queries-and-events)
- [ཐིག་ཁྲམ་ཚུ་](/dz/blockchain/triggers.md)
- [དྲི་བཀོད་ཚུ་](/dz/blockchain/queries.md)
- [དྲི་བཀོད་གི་ཁ་བྱང་](/dz/reference/queries.md)
