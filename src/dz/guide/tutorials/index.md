---
translation_locale: dz
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK སློབ་སྟོན་ཚུ་ {#sdk-tutorials}

འ་ནི་ཤོག་ལེབ་ཚུ་ནང་ Iroha 3 ཌོག་ཊར་གྱི་འཛུལ་སྒོ་ཚུ་ མང་ཤོས་ཀྱི་ལཱ་ས་ཁོངས་ནང་ལས་གཏང་གཏངམ་ཨིནམ་ད་ འདི་ཚུ་གི་གྲས་ལས་ ཕབ་ལེནཌ་གི་མིང་དང་ གཞི་བཙུགས་ལམ་ དེ་ལས་ འགོ་བཙུགས་སའི་གནས་ཚད་ཆུང་ཤོས་ཅིག་ཨིན་མས།

## གྲོས་འཆར་བཀོད་རྒྱ་ {#recommended-order}

1. [གཞི་བཙུགས་འབད་ Iroha 3](/dz/get-started/install-iroha.md)
2. [འགོ་འདྲེན་འཐབ་ Iroha 3](/dz/get-started/launch-iroha.md)
3. ཁྱོད་ཀྱིས་ SDK ཅིག་འཐུ་འབད།
   - [Rust](/dz/guide/tutorials/rust.md)
   - [Python](/dz/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/dz/guide/tutorials/javascript.md)
   - [Kotlin, Android དང་ Java](/dz/guide/tutorials/kotlin-java.md)
   - [Swift དང་ iOS](/dz/guide/tutorials/swift.md)
4. ཁྱོད་ཀྱིས་ client application Reference ཡོངས་ཁྱབ་ཅིག་དགོ་པ་ཅིན་ [ sample apps](/dz/guide/tutorials/sample-apps.md) བལྟ་དགོ།
5. ཁྱོད་ཀྱིས་ [Embed Kaigi](/dz/guide/tutorials/kaigi.md) ལག་ལེན་འཐབ་ད་ ཁྱོད་རའི་ལག་ལེན་ནང་ལུ་ བརྒྱུད་འཕྲིན་རྒྱབ་སྐྱོར་འབད་མི་ སྒྲ་དང་གློག་བརྙན་ཞལ་འཛོམས་ཚུ་བཙུགས་དགོ་པའི་སྐབས་།
6. [Musubi སྦ་སྒོར་](/dz/guide/tutorials/musubi.md) ལག་ལེན་འཐབ་ད་ ཁྱོད་ཀྱིས་ ལོག་སྤྱོད་འབད་ཚུགས་པའི་ Kotodama གཞི་རྟེན་དཔེ་མཛོད་ཚུ་ ལྕགས་ཐག་གི་གུ་ ཐོ་བཀོད་འབད་མི་ ཐོ་བཀོད་ཀྱི་གཞི་བསྟུན་ཚུ་དང་གཅིག་ཁར་ལག་ལེན་འཐབ་དགོ།

## དཔྱད་བརྗོད་ཚུ་ {#samples}

ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་ཁོངས་ནང་ལུ་ JavaScript འདྲ་བཤུས་དང་ Swift/iOS དཔེ་སྟོན་གྱི་འཆར་གཞི་ཚུ་ཡོདཔ་ཨིན། Android གི་དོན་ལུ་ Kotlin SDK ཚད་གཞག་དང་ འདི་ཚུ་གི་བརྟག་དཔྱད་ཚུ་ལས་འགོ་བཙུགས་དགོ།

- [དཔེ་སྒྲོམ་ལག་ལེན་གྱི་ སྤྱིར་བཏང་བལྟ་ཐིག་](/dz/guide/tutorials/sample-apps.md)
- [Kaigi ནང་བཙུགས་འབད་ JavaScript app](/dz/guide/tutorials/kaigi.md)

## བདེན་པའི་འབྱུང་ཁུངས་ {#source-of-truth}

འ་ནི་ SDK ཤོག་ལེབ་ཚུ་ ད་ལྟོའི་ Upstream སྒྲིག་འཇུག་གི་ས་ཁོངས་ནང་ལས་བཏོན་ཡོདཔ་ཨིན།

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java mirror of the Kotlin-first Android surface)
- `IrohaSwift`
- `crates/musubi`

དོགས་པ་ཆགས་པའི་སྐབས་ལུ་ འདི་ཚུ་གི་ནང་ README དང་ ཕབ་ལེཊ་གི་ metadata ཚུ་ གདམ་ཁ་རྐྱབས། དེ་ཚུ་གིས་ ཁྱོད་ཀྱིས་བཟོ་དོ་ཡོད་པའི་ གཞི་རྟེན་བསྐྱར་བཅོས་འདི་བཤད་ནི་ཨིན།
