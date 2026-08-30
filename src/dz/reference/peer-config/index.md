---
translation_locale: dz
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# གཞི་སྒྲིག་འབད་ Iroha {#configuring-iroha}

ས་གནས་ཀྱི་ མཉམ་འབྲེལ་བཟོ་རྣམ་འདི་ TOML ཡིག་སྣོད་ཚུ་ནང་ གཞི་སྒྲིག་འབདཝ་ཨིན། འདི་ [`SetParameter`](/dz/blockchain/instructions.md#setparameter) གི་བཀོད་རྒྱ་བརྒྱུད་དེ་ བསྒྱུར་བཅོས་འབད་མི་ On-chain སྒྲིག་གཞི་ལས་ཁྱད་པར་ཅན་ཨིན། བཟོ་སྐྲུན་འབད་ནིའི་ བྱ་སྤྱོད་འདི་ སྒྲིག་གཞི་བཟོ་ཐངས་ཡིག་སྣོད་ ཡང་ན་ On-chain ཁྱད་ཚད་ནང་ལུ་ངོ་སྤྲོད་འབད་དགོཔ་ཨིན། གནས་སྟངས་འགྱུར་ལྡེ་མིག་ཚུ་ features gatesམེན།

གཞི་སྒྲིག་ཡིག་སྣོད་ལུ་ལམ་སྟོན་འབད་ནིའི་དོན་ལུ་ [`--config`](../iroha3d-cli#arg-config)CLI གྲོས་བསྡུར་ལག་ལེན་འཐབ་ཨིན།

## དཔྱད་ཡིག་འདི་ {#template}

ཁྱད་ཚད་རེ་རེ་གྱི་གསལ་བཤད་ཚུ་གི་དོན་ལུ་ [Parameters](./params.md) འབྲི་ཤོག་ལུ་བལྟ་དགོ།

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## སྒྲིག་གཞི་བཟོ་སྐྲུན་འབད་ཐབས། {#composing-configuration-files}

TOML སྒྲིག་གཞི་ཡིག་སྣོད་ཚུ་ནང་ `extends` གྱི་ས་ཁོངས་གཞན་ཅིག་ཡོདཔ་ད་ འདི་གིས་ TOML ཡིག་སྣོད་གཞན་ཚུ་ལུ་ བཏོན་དོ་ཡོདཔ་ཨིན། འདི་ལམ་གཅིག་ ཡང་ན་ལམ་མང་ཤོས་ཅིག་ལུ་འགྱུར་ཚུགས།

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha གིས་ `extends` ནང་བཀོད་ཡོད་པའི་ཡིག་སྣོད་ཚུ་ སླར་ལོག་སྦེ་ལྷག་སྟེ་ བསྡུ་སྒྲིག་འབད་དོ་ཡོདཔ་ད་ མཐའན་མཇུག་གི་ཡིག་སྣོད་ཚུ་གིས་ ཚད་གཞིའི་གནས་ཚད་ནང་ལུ་ སྔོན་བྱོན་གྱི་ཡིག་སྣོད་ཚུ་ལུ་ ཡིག་སྣོད་སྦེ་འབྲི་དོ་ཡོདཔ་ཨིན། དཔེར་ན་ `config.toml` ཀློག་ཐངས་འདི་:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

གཞི་སྒྲིག་འདི་ `a.toml` ལས་ `chain` དང་ `max_content_len` ལས་ `b.toml` དེ་ལས་ `torii.address` ལས་ `config.toml` (overwrites `b.toml`) འབད་ནི་ཨིན་པས།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

སྒྲིག་གཞི་འདི་ག་དེ་སྦེ་བཀླག་ནི་དང་ བརྟག་ཞིབ་འབད་ཡི་ག་གི་ཤུལ་རྟགས་བལྟ་ནིའི་དོན་ལུ་ [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI ཌིང་སྒྲི་བབ་གཏང་དགོ།
