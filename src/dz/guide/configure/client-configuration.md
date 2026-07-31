---
translation_locale: dz
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ཞི་གཡོགཔ་ཚུ་ གཞི་སྒྲིག་འབདཝ་ཨིན། {#client-configuration}

Iroha CLI དང་ SDK ཚོང་མགྲོན་པ་ཚུ་གིས་ ལག་ལེན་འཐབ་ནི་ TOML སྒྲིག་འཇུག་བྱས་ཚད། ཐེངས་ 10 ལས་ཉུང་བ། ཐོན་རིམ་ 5.7.1 ནང་དུ་ཚོད་ལྟ་བྱས་ཟིན། ལོ 5 སྔོན་ལ་གསར་བཅོས་བྱས། `defaults/client.toml`; བཟོ་སྐྲུན་འབད་ཡོད་པའི་ ས་གནས་ཀྱི་ཐོ་བཀོད་ཚུ་ཡང་ བཀྲམ་སྤེལ་འབདཝ་ཨིན། `client.toml` ཁོང་རའི་ཐོན་སྐྱེད་ཐོ་ཡིག་ནང་བཙུགས་དགོ།

::: details ཞི་གཡོགཔ་གི་བཟོ་རྣམ་ template

<<< @/snippets/client.template.toml

:::

## གཞི་རྟེན་ས་ཁོངས་ཚུ་ {#core-fields}

ཁྱོད་ཀྱིས་ Torii མཐའ་མཇུག་གི་སྒོ་སྒྲིག་དང་མིང་རྟགས་བཀོད་པའི་རྩིས་ཁྲ་ཚུ་ ངེས་པར་དུ་ལག་ལེན་ཅན་གྱི་ཡིག་སྣོད་ནང་བཙུགས་དགོཔ་ཨིན།

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` གིས་ བགོ་བཀྲམ་འབད་མི་ཅ་ལ་དེ་ བཙག་འཐུ་འབད་ཡོདཔ་ཨིན།
- `torii_url` གྲྭ་ཚང་གི་ཐིག་ཚད་ Torii HTTP API
- `[account].domain` འདི་ CLI shortcuts དང་ address-selector encoding ཀྱིས་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ canonical `AccountId` འདི་རང་ domainless ཨིན་ཨིན།
- `[account].public_key`དང་ `[account].private_key`གི་བར་ན་ ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།

རྩིས་ཁྲ་འདི་ ཧེ་མ་ལས་ ལྕགས་ཐག་ནང་ལུ་ཡོད་དགོཔ་ཨིན། རང་ལུགས་ཀྱི་ ས་གནས་ཁ་ཐུག་གི་དྲ་རྒྱ་གི་དོན་ལུ་ འདི་མཐུན་འབྲེལ་འབྱུང་ཁུངས། བཟོ་སྐྲུན་ཡིག་ཆའི་ཐོག་ལས་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

::: info གནད་དོན་ཚུ་གི་དོན་ལུ་ ཉེན་སྲུང་དང་ལྡནམ་ཨིན།

Iroha གི་མིང་འདི་ ཀ་ནོ་ནི་ཀཱན་གྱི་ བརྟག་ཞིབ་འབད་བའི་ཤུལ་ལས་ གནད་དོན་ལུ་ཚོར་བ་ཅན་ཨིན། དཔེར་ན་ `wonderland.universal`, `Wonderland.universal`དང་ `looking_glass.universal` འདི་དབྱེ་ཁག་ཅན་གྱི་ ས་ཁོངས་ཡིག་འབྲུ་ཚུ་ཨིན།

:::

## གཞི་རྟེན་བདེན་འཛིན་ཐོ། {#basic-authentication}

གདམ་ཁ་རྐྱབ་མི་ `[basic_auth]` བསྡུ་སྒྲིག་ནང་ལུ་ HTTP `Authorization` མགོ་ཡིག་འདི་ ཌོག་ཊར་གྱི་ཞུ་གཏེར་ལུ་བཙུགས་ཡོདཔ་ཨིན། Iroha འདྲན་འདྲ་ཚུ་གིས་ འ་ནི་ཨང་རྟགས་ཚུ་ཐད་ཀར་དུ་བསྒྱུར་བཅོས་མ་འབད་བ་ཅིན་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ Torii འདི་ Nginxབཟུམ་ཅིག་ཨིན་པའི་རྒྱབ་འགལ་བརྡ་ཚབ་ཀྱི་རྒྱབ་ལས་ཨིན།

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## ཚོང་འབྲེལ་གྱི་ གཞི་སྒྲིག་ཚུ་ {#transaction-settings}

ཕྱིར་ཚོང་གི་སྤྱོད་ལམ་འདི་ `[transaction]` བསྡོམས་ཐོག་ལས་བཟོ་ཡོདཔ་ཨིན།

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` ཕྱིར་ཚོང་གྱི་ཚེ་ཚད་འདི་ མིལིས་ཀན་ཌ་ཚུ་ནང་ཨིན།
- `status_timeout_ms` གིས་ ཚོང་མགྲོན་པ་ཚུ་གིས་ ཕྱིར་ཚོང་གི་གནས་སྟངས་ལུ་བལྟ་བར་ ག་དེམ་ཅིག་སྒུག་སྡོད་དོ་ཡོདཔ་ཨིན་ན་ བཏོན་འཛིན་འབདཝ་ཨིན།
- `nonce = true` གིས་ ཚོང་མགྲོན་པ་ལུ་ nonce མཉམ་འབྲེལ་འབད་དགོཔ་སྦེ་ཞུ་དོ་ཡོདཔ་ད་ འདི་འབདཝ་ལས་ ལོག་སྟེ་ར་ ཕྱིར་ཚོང་འཐབ་པའི་སྐབས་ ཁྱད་པར་ཅན་གྱི་ hash ཐོན་སྐྱེད་འབདཝ་ཨིན།

## ཤོག་སྒྲིལ་ གཞི་སྒྲིག་ཚུ་མཐུད་སྦྲེལ་འབད་ {#connect-queue-settings}

ད་ལྟོའི་ Iroha ཌོག་ཊར་ཚུ་གིས་ རང་བཞིན་གྱི་གྲལ་ཐིག་གནས་ཀྱི་དོན་ལུ་ གདམ་ཁ་རྐྱབ་མི་ `[connect]` ཤོག་ལེབ་དེ་ཡང་ལག་ལེན་འཐབ་ཚུགས།

```toml
[connect]
queue_root = "./queue"
```

འ་ནི་ལག་ལེན་འདི་ ལཱ་འབད་ཐངས་ཅིག་གིས་ དུས་ཡུན་རིངམོ་སྦེ་ client-side queue storage དགོས་པའི་སྐབས་ ལག་ལེན་འཐབ་ཨིན།

## སྒྲིག་གཞི་བཟོ་ཐབས། {#generating-configurations}

ཐོ་བཀོད་འབད་བཏུབ་པའི་ ས་གནས་ཁ་ཐུག་གི་དྲ་རྒྱ་ཚུ་གི་དོན་ལུ་ Kagami གདམ་ཁ་རྐྱབས། ག་ཅི་སྨོ་ཟེར་བ་ཅིན་ འདི་གིས་ Iroha 3 སྒྲིག་གཞི་ཚུ་དང་ genesis, scripts དེ་ལས་ README འདི་མཉམ་བསྡུར་རྐྱབ་དོ་ཡོདཔ་:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

བཟོ་སྐྲུན་འབད་མི་ `./localnet/client.toml` འདི་ CLI དང་གཅིག་ཁར་ལག་ལེན་འཐབ་དགོ།

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
