---
translation_locale: dz
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: human-reviewed+reviewed-delta
---
# ཌའི་ཊ་གི་རྣམ་གཞག་འཆར་གཞི། {#data-model-schema}

ཁྱོད་ཀྱི་འབྲེལ་མཐུད་ཀྱི་དམིགས་གཏད་ཚུ་ ཕྲང་བའི་ཨེབ་ཐག་ནང་ལས་ ཐིག་ཁྲམ་འཚོལ་ཐབས། Torii གིས་ ས་ཁུདཔ་འདི་བཟོ་བཀོད་འབད་ཚར་ཞིནམ་ལས་ `GET /v1/schema` ལུ་ གནད་སྡུད་དཔེ་ཚད གཞི་བཀོད འདི་ལག་ལེན་འཐབ་འོང་།

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

གཞན་མི་བཟོ་སྐྲུན་གྱི་དོན་ལུ་ཁྱབ་བསྒྲགས་འབད་པའི་འདྲ་བཤུས་ལས་མེན་པར་ ལན་དེ་ལས་འབྲེལ་མཐུད་ཚུ་བཟོ། ལག་ལེན་ནང་ཡོད་པའི་མཐུད་གནས་ཀྱི་ལན་འདི་ དེའི་བསྡུ་སྒྲིག་འབད་པའི་གནད་སྡུད་དཔེ་ཚད་ཀྱི་དབང་འཛིན་གཞི་རྟེན་ཨིན། ཁྱོད་ཀྱི་མཉམ་སྦྲེལ་ནང་ལག་ལེན་འཐབ་པའི་མཐུད་གནས་བཟོ་སྐྲུན་དང་མཉམ་དུ་འདི་གཏན་འཁེལ་བཞག།
