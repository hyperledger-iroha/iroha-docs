---
translation_locale: dz
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API ཀོ་ནི་ཟོལ {#torii-api-console}

གློག་ཐག་འདི་ལག་ལེན་འཐབ་ OpenAPI སྒྲིག་གཞི་ཅིག་ལས་ཐོན་ཡོདཔ་ཨིན། Torii མཐའན་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་ བརྟག་ཞིབ་འབད་ནི་དང་ བརྟག་དཔྱད་གྱི་ཞུ་ཡིག་གཏང་ནི་ དེ་ལས་ ཨེབ་གཏང་འབད་ནི་ curl བཀའ་རྒྱ་ཚུ་ བཏོན་ཞིནམ་ལས་ ཁྱོད་ཀྱིས་ client code བཟོ་ཚུགས།

<ToriiApiConsole />

## དགོས་མཁོ་ཚུ་ {#requirements}

- Torii མཐའ་མཇུག་གི་ཐིག་ཁྲམ་ནང་ `/openapi.json` གསལ་སྟོན་འབད་དགོ།
- བལྟ་བཤལཔ་བརྟག་དཔྱད་འདི་ CORS གིས་ འ་ནི་ཡིག་ཆའི་འབྱུང་ཁུངས་ལུ་ ངོས་ལེན་འབད་དགོཔ་ཨིན།
- ཌའི་ལོག་ལག་ལེན་འཐབ་མི་གིས་ ཐད་ཀར་དུ་ མཇུག་མཐའན་མཇུག་གི་གནས་སྟངས་ལུ་ ལྷོད་ཚུགས་དགོཔ་ཨིན།
- ཀོ་ཌ་བཟོ་སྐྲུན་ལུ་ Node.js, pnpm དེ་ལས་ OpenAPI Generatorགི་དོན་ལུ་ Java runtime དགོཔ་ཨིན།

console འདི་ defaultསྦེ་ `https://taira.sora.org` ལུ་འབདཝ་ཨིན། ས་གནས་བཟོ་སྐྲུན་འདི་ འཕྲུལ་ཆས་ནང་ལུ་ ཁྱོད་ཀྱིས་ Torii རྒྱུག་པའི་སྐབས་ སྤྱིར་བཏང་ལུ་ `http://127.0.0.1:8080` ལུ་ལཱ་འབད་འོང་།

## དང་པ་ར་ Taira བརྟག་དཔྱད་འབད་ {#try-taira-first}

ཁྱོད་ཀྱིས་ client བཟོ་མ་ཚར་བའི་ཧེ་མར་ ཁྱོད་ཀྱིས་ public OpenAPI document འདི་ཁྱོད་ཀྱི་འཕྲུལ་ཆས་ནང་ལས་ལག་ལེན་འཐབ་ཚུགསཔ་ཨིན་ན་བརྟག་དཔྱད་འབད་:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

འདི་གི་ཤུལ་ལས་ `https://taira.sora.org/openapi.json` འདི་ ཀྲུང་གོ་བོད་ཀྱི་ནང་ཨེབ་གཏང་འབད་ཞིནམ་ལས་ ཀློག་བཏུབ་པའི་ལམ་ལུགས་ཅིག་ བརྟག་དཔྱད་འབད་ དཔེར་ན་ `GET /status`, `GET /v1/domains` ཡང་ན་ `GET /v1/assets/definitions`. ཁྱོད་ཀྱི་ runtime གནས་སྟངས་ནང་ལས་ གསང་བ་ཚུ་ ལེན་མི་ SDK དང་ CLI ཌའི་ལོག་གི་དོན་ལུ་ ཐོ་བཀོད་ཅན་གྱི་ཚོང་འབྲེལ་དང་ སྒེར་གྱི་ལྡེ་མིག་གི་རྒྱུན་འགྲུལ་སླར་གསོ་འབད་ཚུགས།

## བཟོ་སྐྲུན་འབད་མི་ ཚོང་མགྲོན་པ་ {#generated-clients}

ཇི་ནེ་རེ་ཊར་གྱི་བཀའ་རྒྱ་འདི་ console ལུ་ཨེབ་གཏང་འབད་ཡོད་པའི་ OpenAPI ཡིག་ཆ་དེ་རང་ ལག་ལེན་འཐབ་ཨིན། འདི་ JSON ལས་འཛིན་, Explorer, app, དང་ telemetry ཕྲང་ལམ་ཚུ་གི་དོན་ལུ་ཕན་ཐོགས་ཡོདཔ་ཨིན།

ཐོ་བཀོད་ཅན་གྱི་རྩིས་དེབ་ཀྱི་ ཕྱིར་ཚོང་གྱི་དོན་ལུ་ ཐོ་བཀོད་ཀྱི་དྲི་ཚུ་དང་ Norito- རང་ལུགས་ཀྱི་ཁེ་ཕན་གྱི་མཁོ་ཆས་ཚུ་ གཞུང་གི་ཁ་ཐུག་ལས་ Iroha SDKs. OpenAPI ཚོང་མགྲོན་པ་ཚུ་གིས་ ཐོ་བཀོད་དང་རྩིས་ཁྲ་གི་ལྡེ་མིག་ཚུ་ འཛིན་སྐྱོང་འབད་ནི་ ཡང་ན་ ཨེན་ཀོ་ཌམ་རྐྱབ་མི་ཚུགས། Norito ཚོང་འབྲེལ་གྱི་སྡེ་ཚན་ཚུ་ ཁྱོད་གི་དོན་ལུ་ཨིན།

OpenAPI ཇི་ནེརེ་ཊར་གིས་ རྒྱབ་སྐྱོར་འབད་མི་ཇི་ནེརེ་ཚུ་ བརྟག་ཞིབ་འབད་ནིའི་དོན་ལུ་:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
