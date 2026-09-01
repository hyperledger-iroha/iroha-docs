---
translation_locale: dz
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: human-reviewed
---
# SDK སློབ་སྟོན་ཚུ་ {#sdk-tutorials}

ཤོག་ལེབ་འདི་ཚུ་གིས་ ལཱ་གི་ས་སྒོ་གཙོ་བོ་ལས་བཏོན་པའི་ Iroha 3 ཞབས་ཏོག་ལེན་མིའི་འཛུལ་སྒོ་ཚུ་བསྡུས་དོན་སྦེ་སྟོནམ་ཨིན། འདི་ནང་ ཚད་ལྡན་ཐུམ་སྒྲིལ་མིང་ གཞི་བཙུགས་འགྲུལ་ལམ་ དེ་ལས་ འགོ་བཙུགས་སའི་ས་ཚིགས་ཉུང་མཐའ་ཚུ་ཚུདཔ་ཨིན།

## གྲོས་འཆར་བཀོད་རྒྱ་ {#recommended-order}

1. [གཞི་བཙུགས་འབད་ Iroha 3](/dz/get-started/install-iroha.md)
2. [འགོ་འདྲེན་འཐབ་ Iroha 3](/dz/get-started/launch-iroha.md)
3. ཁྱོད་ཀྱིས་ SDK ཅིག་འཐུ་འབད།
   - [Rust](/dz/guide/tutorials/rust.md)
   - [Python](/dz/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/dz/guide/tutorials/javascript.md)
   - [Kotlin, Android དང་ Java](/dz/guide/tutorials/kotlin-java.md)
   - [Swift དང་ iOS](/dz/guide/tutorials/swift.md)
4. ཁྱོད་ལུ་ མཁོ་སྤྲོད་འབད་མི་གློག་རིམ་གཞི་བསྟུན་ཆ་ཚང་དགོཔ་ད་ [དཔེ་ཚད་གློག་རིམ་](/dz/guide/tutorials/sample-apps.md) བསྐྱར་ཞིབ་འབད།
5. ཁྱོད་ཀྱིས་ [Kaigi ནང་འཛུལ་འབད་ནི།](/dz/guide/tutorials/kaigi.md) ལག་ལེན་འཐབ་ད་ ཁྱོད་རའི་ལག་ལེན་ནང་ལུ་ བརྒྱུད་འཕྲིན་རྒྱབ་སྐྱོར་འབད་མི་ སྒྲ་དང་གློག་བརྙན་ཞལ་འཛོམས་ཚུ་བཙུགས་དགོ་པའི་སྐབས་།
6. [Musubi ཆ་ཚན་](/dz/guide/tutorials/musubi.md) ལག་ལེན་འཐབ་ད་ ཁྱོད་ཀྱིས་ ལོག་སྤྱོད་འབད་ཚུགས་པའི་ Kotodama གཞི་རྟེན་དཔེ་མཛོད་ཚུ་ ལྕགས་ཐག་གི་གུ་ ཐོ་བཀོད་འབད་མི་ ཐོ་བཀོད་ཀྱི་གཞི་བསྟུན་ཚུ་དང་གཅིག་ཁར་ལག་ལེན་འཐབ་དགོ།

## དཔྱད་བརྗོད་ཚུ་ {#samples}

ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་ཁོངས་ནང་ལུ་ JavaScript འདྲ་བཤུས་དང་ Swift/iOS དཔེ་སྟོན་གྱི་འཆར་གཞི་ཚུ་ཡོདཔ་ཨིན། Android གི་དོན་ལུ་ Kotlin SDK ཚད་གཞག་དང་ འདི་ཚུ་གི་བརྟག་དཔྱད་ཚུ་ལས་འགོ་བཙུགས་དགོ།

- [དཔེ་སྒྲོམ་ལག་ལེན་གྱི་ སྤྱིར་བཏང་བལྟ་ཐིག་](/dz/guide/tutorials/sample-apps.md)
- [Kaigi ནང་བཙུགས་འབད་ JavaScript གློག་རིམ](/dz/guide/tutorials/kaigi.md)

## བདེན་པའི་འབྱུང་ཁུངས་ {#source-of-truth}

འདིར་ཡོད་པའི་ SDK ཤོག་ལེབ་ཚུ་ཆ་མཉམ་ ད་ལྟོའི་ཡར་འཕེལ་གྱི་ལཱ་གི་ས་སྒོ་ལས་འབྱུང་ཡོདཔ་ཨིན།

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Kotlin-དང་པ Android མཐུད་ངོས གི་ Java འདྲ་བཤུས་)
- `IrohaSwift`
- `crates/musubi`

དོགས་པ་ཡོད་པའི་སྐབས་ སྣོད་ཐོ་དེ་ཚུ་ནང་ README དང་ ཐུམ་སྒྲིལ་མེ་ཊ་ཌེ་ཊ་ཚུ་ དགའ་གདམ་འབད། ཁོང་གིས་ ཁྱོད་ཀྱིས་བཟོ་བསྐྲུན་འབད་བའི་བསྒང་ཡོད་མི་ འབྱུང་ཁུངས་བསྐྱར་ཞིབ་འདི་འགྲེལ་བཤད་རྐྱབ་ཨིན།
