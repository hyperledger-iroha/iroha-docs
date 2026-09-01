---
translation_locale: dz
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: human-reviewed
---
# ཌའི་ཊ་གི་རྣམ་གཞག་འཆར་གཞི། {#data-model-schema}

ཁྱོད་ཀྱི་འབྲེལ་མཐུད་ཀྱི་དམིགས་གཏད་ཚུ་ ཕྲང་བའི་ཨེབ་ཐག་ནང་ལས་ ཐིག་ཁྲམ་འཚོལ་ཐབས། Torii གིས་ ས་ཁུདཔ་འདི་བཟོ་བཀོད་འབད་ཚར་ཞིནམ་ལས་ `GET /v1/schema` ལུ་ གནད་སྡུད་དཔེ་ཚད གཞི་བཀོད འདི་ལག་ལེན་འཐབ་འོང་།

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

ཐོ་བཀོད་འབད་ཡོད་པའི་ཡིག་ཆའི་དུམ་གྲ་ནང་ལས་ བསྡུ་སྒྲིག་ཚུ་ བཟོ་མ་ཚུགས། འདི་ཚུ་གི་འབྱུང་ཁུངས་ཀྱི་གནས་སྟངས་འདི་ སྒུག་སྟེ་ཡོད་པའི་བར་ན་ཨིན། ཕྲང་ལམ་གྱི་ལན་དེ་ ཐོ་བཀོད་ཀྱི་ གནད་སྡུད་རྣམ་གཞག་ལུ་ ཆ་རྐྱེན་ཅན་ཅིག་ཨིན་; ཁྱོད་ཀྱི་མཐུན་སྒྲིལ་གིས་ལག་ལེན་འཐབ་མི་ ལྡེ་མིག་བཟོ་སྐྲུན་དང་མཉམ་འབྲེལ་སྦེ་བཞག་འོང་།
