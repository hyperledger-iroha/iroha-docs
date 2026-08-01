---
translation_locale: dz
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` གིས་ Iroha 3 འདྲན་འདྲ་ daemon འགོ་བཙུགས་ཡོདཔ་ཨིན།

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- ཐབས་ཅིག་: ཡིག་སྣོད་ལམ་
- མཆོག: `-c`

[བཟོ་རྣམ་](/dz/reference/peer-config/index.md) ཌའི་ལོག་ནང་ཐོ་བཀོད་འབདཝ་ཨིན།

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- ཐབས་ཅིག་: ཡིག་སྣོད་ལམ་

genesis manifest JSON ཡིག་སྣོད་ལུ་ གདམ་ཁ་རྐྱབ་བཏུབ་ཨིན། འདི་ལག་ལེན་འཐབ་ནི་དེ་ deployment གིས་ Kagami ཀྱིས་བཟོ་བའི་ manifest དང་ཕྱདཔ་ད་ startup བཏོན་པའི་སྐབས་ ལག་ལེན་འཐབ་འོང་།

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

སྒྲིག་གཞི་བཀླག་ནི་དང་ བརྟག་ཞིབ་འབད་ཐངས་ཀྱི་ཐོ་ཡིག་ཚུ་ སེལ་འཐུ་འབད། སྒྲིག་གཞི་འཛོལ་བ་སེལ་ནི་ལུ་ ཕན་ཐོགས་འབྱུང་འོང་།

- མདའ་རྟགས་དབྱེ་བ་:
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- རིགས་: Boolean, ཡང་ན་ `--terminal-colors=false` ཡང་ན་ `--terminal-colors=true`
- རང་བཞིན་བརྟག་དཔྱད་འབད་ནིའི་མཐའ་མཚམས་ རྒྱབ་སྐྱོར་
- ENV: `TERMINAL_COLORS`

ཡང་ན་ ANSI ཚོས་གཞི་ཐོན་ཐངས་བཟོ་བཅོས་འབད་ནི་ཨིན་ན་མེན་

གཞི་སྒྲིག་འབད་ཐོག་ལས་ Iroha གིས་ མཐའན་མཇུག་གི་ཐིག་ཁྲམ་འདི་གིས་ འཐོན་སྐྱེད་མདངས་ཅན་ལུ་ རྒྱབ་སྐྱོར་འབདཝ་ཨིན་ན་མེན་ན་ བཏོན་འོང་།

ཝང་གསལ་སྦེ་ཚོས་གཞི་ཚུ་ རྩ་མེད་གཏང་ནིའི་དོན་ལུ་:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- ཐབས་ཅིག་: གློག་ཐག་

Daemon བརྡ་དོན་ཚུ་གི་དོན་ལུ་ལག་ལེན་འཐབ་མི་ལམ་ལུགས་ཡིག་ཆ་འདི་ ཆ་མེད་གཏང་དགོ།

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- མདའ་རྟགས་དབྱེ་བ་:

SoraFS གི་དོན་ལུ་ Sora Nexus ཌའི་ལོག་གི་ཐོ་ཡིག་འདི་བཟོ་བཀོད་འབད།, SoraNet ལག་པར་འཁྱུ་ནི་དང་ ལྕང་ལམ་མང་རབས་ཅིག་ནང་ གྲོས་བསྟུན་འབད་ཐངས་ཚུ་ཨིན།

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- ཐབས་ལམ་: `auto`, `cpu` ཡང་ན་ `gpu`

FASTPQ བལྟ་བཤལཔ་གི་ལག་ལེན་གྱི་ ཐབས་ལམ་སེལ་འཐུ་འབད།

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- ཐབས་ལམ་: `auto`, `cpu` ཡང་ན་ `gpu`

FASTPQ Poseidon pipeline གི་གནས་སྟངས་འདི་སེལ་འཐུ་འབད།

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- ཐབས་ཅིག་: གློག་ཐག་

FASTPQ ཊེ་ལི་མེ་ཊི་རི་འཕྲུལ་ཆས་གི་དབྱེ་རིམ་གྱི་མིང་ཐོ་བཀོད་འབད་མ་དགོ་།

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- ཐབས་ཅིག་: གློག་ཐག་

FASTPQ ཊེ་ལི་མེ་ཏིརི་ཅིབ་བཟའ་ཚང་གི་མིང་ཐོ་བཀོད་འབད་མ་བཏུབ་།

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- ཐབས་ཅིག་: གློག་ཐག་

FASTPQ telemetry GPU གྱི་རིགས་ཀྱི་མིང་ཐོ་བཀོད་འབད་མ་བཏུབ་ཨིན།

```shell
irohad --fastpq-gpu-kind integrated
```
