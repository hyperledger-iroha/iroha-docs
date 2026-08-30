---
translation_locale: dz
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` འདི་ཐིག་ཚད་ཅན་ Iroha 3 འདྲ་མཉམ་གྱི་ Daemonཨིན། Cargo སྦ་སྒོར་དེ་ `irohad`ཟེར་མིང་བཏགས་ཡོདཔ་ད་ དེ་འབདཝ་ལས་ གཞི་རྟེན་དངུལ་ཁང་ནང་ལས་ བིན་རི་འདི་འབོ་འབད།:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

མི་མང་གི་ Taira བརྟག་དཔྱད་འབད་ཐངས་ཀྱི་དོན་ལུ་ པར་འདི་ `iroha3d_taira` ལག་ལེན་འཐབ་ཡོདཔ་ཨིན། འདི་ཡང་ CLI དེ་བཟུམ་བཟོཝ་ཨིན། འདི་ཡང་ Taira ལྕགས་ཐག་དང་ བདེན་ཁུངས་སྐྱེལ་འཕྲུལ་ཆས་ གཞི་སྒྲིག་ དེ་ལས་ ཐོ་བཀོད་འབད་ཐངས་ཀྱི་ལྡེ་མིག་ཚུ་ བཏོན་དོ་ཡོདཔ་ཨིན། ཁྱོད་ཀྱིས་ Taira སྒྲིག་གཞི་འདི་ སྒོ་བསྡམ་ནིའི་དུས་ཚོད་ཀྱི་ ངོས་འཛིན་ཚུ་ ཁ་ཕྱེ་མ་བཅུག་པར་ རྩ་སྒྲིག་འབད་:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

ལས་འཛིན་གྱིས་ ལག་ལེན་འཐབ་པའི་ཧེ་མར་ Taira གི་ཁྱད་ཐོ་ཚུ་བཏོན་དགོཔ་ཨིན། ཐོ་བཀོད་འབད་ཡོད་པའི་ དཔྱད་ཡིག་འདི་ནང་ལུ་ དཔེ་སྒྲོམ་ཚུ་ཡོདཔ་ཨིན། ལས་འཛིན་གྱིས་ དཔེ་སྟོན་བཀོད་ཐངས་ཚུ་ བསྒྱུར་བཅོས་འབད་དགོཔ་ཨིན། Nexus ཡང་ན་ བཟོ་སྐྲུན་གྱི་ SoraFS གཞི་སྒྲིག་ཚུ་ལག་ལེན་འཐབ་ནི་མི་འོང་། ཁྱོད་ཀྱིས་ Taira དང་གཅིག་ཁར་བརྟག་དཔྱད་འབདཝ་ད་

## `--config` {#arg-config}

- ཐབས་ཅིག་: ཡིག་སྣོད་ལམ་
- མཆོག: `-c`

[ peer configure](/dz/reference/peer-config/index.md) ལུ་འགྱོ་ནིའི་ལམ་.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- ཐབས་ཅིག་: ཡིག་སྣོད་ལམ་

ཁ་ optional genesis manifest JSON སྤྱིར་བཏང་གྲོས་མཐུན་གྱི་དོན་ལས་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

## `--check-config` {#arg-check-config}

གྲོས་ཐག་བཅད་མི་ སྒྲིག་གཞི་དང་ གཞི་རྟེན་འབྱུང་ཁུངས་ཀྱི་ ཐོན་སྐྱེད་ཚུ་ ངོས་འཛིན་འབད་ཞིནམ་ལས་ མཐུད་སྦྲེལ་མཐུད་ལམ་སེལ་འཐུ་མ་འབད་བར་ ཕྱི་ཁར་ཐོན་དགོ།

## Kagemusha ཁྱད་ཚད་ཀྱི་ལྡེ་མིག་ཚུ་ {#kagemusha-qualification-seals}

འ་ནི་ཡིག་སྣོད་ལམ་གྱི་གདམ་ཁ་འདི་ `--check-config` དགོས་མཁོ་དང་ ཀ་གེ་མུ་ཤ་གི་སྦྱོང་བརྡར་ཚུ་མ་བྲིས་པའི་ཧེ་མར་ དམ་ཚིག་ཅན་གྱི་ཐོ་བཀོད་འབད་:

- `--write-kagemusha-catalog-qualification-seal <PATH>` གིས་ ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།
- `--write-kagemusha-validator-qualification-seal <PATH>`གིས་ ས་གནས་ཀྱི་བརྟག་དཔྱད་འབད་མི་ཚུ་ལུ་ གྲོས་སྒྲིག་ཅན་གྱི་མིང་རྟགས་བཀོད་མི་ གོང་འཕེལ་གཏང་ནི་གི་ ཐོ་བཀོད་དང་འབྲེལ་བའི་ ཁྱད་ཚད་སྤྲོད་འབདཝ་ཨིན།

ཐུབ་རྟགས་གཉིས་ཆ་ར་ གཅིག་གིས་གཅིག་ལུ་ མགུ་འཐོམ་ཡོདཔ་ཨིན།

## `--trace-config` {#arg-trace-config}

- མདའ་རྟགས་དབྱེ་བ་:
- མཐའ་འཁོར་གནས་སྟངས་: `TRACE_CONFIG`

སྒྲིག་གཞི་ཐིག་ཁྲམ་ཚུ་ ཀློག་ཞིནམ་ལས་ བརྟག་ཞིབ་འབད་བའི་སྐབས་ ཐོ་བཀོད་ཐོ་ཡིག་ཚུ་ རྩ་སྒྲིག་འབད་ཚུགས།

## `--config-blake3` {#arg-config-blake3}

- ཐབས་ལམ་: ཨང་གྲངས་༦༤ འབད་མི་ hexadecimal BLAKE3 digest
- དགོས་མཁོ་ཚུ་: `--config`

གཞི་སྒྲིག་ཡིག་སྣོད་ནང་ བའི་ཊི་ཚུ་ མཉམ་འབྲེལ་འབད་དགོཔ་ཨིན། ཡུན་བརྟན་ཅན་གྱི་ཡིག་སྣོད་འདི་ འཇམ་ཏོང་ཏོ་སྦེ་བཟོ་དགོཔ་ཨིན་ འདི་ནང་ལུ་ `extends` ཚུ་མི་ཚུད་འོང་།

## `--terminal-colors` {#arg-terminal-colors}

- ཐབས་ཅིག་: Boolean, `--terminal-colors=true` ཡང་ན་ `--terminal-colors=false`སྦེ་བཏང་ཡོདཔ་ཨིན།
- སྔོན་སྒྲིག་: ཚད་འཛིན་འབད་ནིའི་ནུས་པ་བཏོན་ཐབས།
- མཐའ་འཁོར་གནས་སྟངས་: `TERMINAL_COLORS`

ཚད་འཛིན་འབད་ཐངས་ ANSI ཚོས་གཞི་ཐོན་ཐབས།

## `--language` {#arg-language}

- ཐིག་ཁྲམ་: string

Daemon བརྡ་དོན་ཚུ་གི་དོན་ལུ་ལག་ལེན་འཐབ་མི་ལམ་ལུགས་ཡིག་ཆ་འདི་ ཆ་མེད་གཏང་དགོ།

## `--sora` {#arg-sora}

- མདའ་རྟགས་དབྱེ་བ་:
- མཐའ་འཁོར་གནས་སྟངས་: `IROHA_SORA_PROFILE`

Sora Nexus འདྲ་བཤུས་འདི་སེལ་འཐུ་འབད། གནད་དོན་འདི་ SoraFS, SoraNet ལག་པའི་ལྕོགས་གྲུབ་དང་ ལེན་ལམ་མང་ཤོས་ཀྱི་མཐུན་རྐྱེན་ཚུ་ གཞི་སྒྲིག་འབད་ཡོདཔ་ཨིན། ཨ་རྟག་རང་འདི་ Flag དང་གཅིག་ཁར་ Taira launcher བཏོན་གཏང་།

## FastPQ ཚད་འཛིན་འབད་ཐབས། {#fastpq-overrides}

`--fastpq-execution-mode <MODE>`དང་ `--fastpq-poseidon-mode <MODE>` གིས་ `cpu` ཡང་ན་ `gpu`རྐྱངམ་ཅིག་ ཆ་འཇོག་འབད་ཡོདཔ་ཨིན། ལྷག་ལུས་ཀྱི་ གདམ་ཁ་ཚུ་ telemetry labels གི་ཚབ་ལུ་:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

དཔེར་ན་:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## གྲོགས་རམ་ཐོན་ཡོདཔ་ཨིན། {#generated-help}

འོག་གི་ཐོན་ཐངས་ཆ་མཉམ་འདི་ Iroha གཞི་རྟེན་བཅའ་ཡིག་ནང་ལས་ ཐོན་སྐྱེད་འབད་ཡོདཔ་ཨིན།

<<< @/snippets/iroha3d-help.md
