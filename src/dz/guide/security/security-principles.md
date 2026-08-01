---
translation_locale: dz
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# ཉེན་སྲུང་གི་གཞི་རྩ་ཚུ་ {#security-principles}

Iroha ལེན་ཐོ་འདི་གིས་ མཚན་རྟགས་བཀོད་པའི་བཀོད་རྒྱ་ཚུ་བདེན་དཔྱད་འབད་དེ་ ཆོག་ཐམ་ཚུ་ལག་ལེན་འཐབ་ཨིན། འདི་གིས་སྒེར་གྱི་ལྡེ་མིག་, hosts, applications, operator workstations ཡང་ན་ གཞུང་སྐྱོང་གི་ལམ་ལུགས་ཚུ་ ཉེན་སྲུང་མི་འབད། བགོ་བཀྲམ་དེ་གིས་ འ་ནི་ལམ་ལུགས་ཚུ་ཉེན་སྐྱོབ་འབད་དགོ།

Iroha དྲ་རྒྱ་བཟོ་ནི་དང་ ལག་ལེན་འཐབ་པའི་སྐབས་ འ་ནི་གཞི་རྩ་ཚུ་ལག་ལེན་འཐབ་དགོ།

## དབང་ཚད་འདི་ ཉེན་སྲུང་གི་ས་མཚམས་ཅིག་སྦེ་བརྩི་དགོ། {#treat-authority-as-a-security-boundary}

- སྒེར་གྱི་ལྡེ་མིག་ཅིག་ཚད་འཛིན་འབད་མི་ མི་ངོམ་ཡང་ན་ process གིས་ ལྡེ་མིག་དེ་ལུ་སྤྲོད་ཡོད་པའི་དབང་ཚད་ཀྱི་ཐོག་ལས་ལཱ་འབད་ཚུགས།
- གནས་སྟངས་དང་ ལས་སྣ་འགན་ཁག་རེ་རེ་ལུ་ དབང་ཚད་ཁྱད་པར་ཅན་ཅིག་བྱིན་ནི།
- production ལྡེ་མིག་དང་ recovery ལྡེ་མིག་ཚུ་ routine development དང་ test credentials ཚུ་ལས་སོ་སོར་བཞག་དགོ།
- དབང་ཚད་རེ་རེའི་ཇོ་བདག་ག་ཨིན་ན་ signer ག་ཏེ་བཞག་ཡོད་ན་ དེ་ལས་དབང་ཚད་དེ་ག་དེ་སྦེ་ཚབ་བཙུགས་ནི་ཡང་ན་ཆ་མེད་གཏང་ནི་ཨིན་ན་ ཐོ་བཀོད་འབད་དགོ།

[Public-Key Cryptography](./public-key-cryptography.md)དང་ [Storing Cryptographic Keys](./storing-cryptographic-keys.md) ལུ་བལྟ་ཚུགས།

## ཉུང་ཤོས་ཐོབ་ཐངས་ཚུ་ ལག་ལེན་འཐབ་ {#apply-least-privilege}

- འགན་འཁྲི་ཅིག་ལུ་དགོ་པའི་ Iroha permissions, host access དང་ network access རྐྱངམ་གཅིག་སྤྲོད་དགོ།
- routine transaction signing འདི་ governance, deployment དང་ recovery authority ལས་སོ་སོར་བཞག་དགོ།
- validator membership, privileged permissions ཡང་ན་ high-value assets ལུ་ཕན་གནོད་འབྱུང་ཚུགས་པའི་བསྒྱུར་བཅོས་ཚུ་ལུ་ རང་དབང་ཅན་གྱི་ཆ་འཇོག་དགོ།
- འགན་འཁྲི་བསྒྱུར་བཅོས་འབད་བའི་ཤུལ་ལུ་ འཛུལ་སྒོ་བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་ དགོས་མཁོ་མེད་མི་འཛུལ་སྒོ་ཚུ་བཏོན་གཏང་།

## སྲུང་སྐྱོབ་ཀྱི་གོ་རིམ་ཚུ་ ལག་ལེན་འཐབ་ {#use-layers-of-protection}

- ལག་རྟགས་བཀོད་མི་, applications, operating systems, networks དང་ physical access ཚུ་ཉེན་སྐྱོབ་འབད་དགོ། ཚད་འཛིན་གཅིག་ལུ་རྐྱངམ་གཅིག་བརྟེན་མ་དགོ།
- བགོ་བཀྲམ་གྱི་དོན་ལུ་དགོ་པའི་ Torii, peer, monitoring དང་ application routes ཚུ་རྐྱངམ་གཅིག་ཕྱིར་སྟོན་འབད་དགོ།
- administrative access དང་ sensitive data གི་དོན་ལུ་ authenticated དང་ encrypted channels ཚུ་ལག་ལེན་འཐབ་དགོ།
- systems ཚུ་ patched སྦེ་བཞག་ཞིནམ་ལས་ བགོ་བཀྲམ་གྱིས་ལག་ལེན་མ་འཐབ་པའི་ services ཚུ་མེདཔ་གཏང་དགོ།
- secrets ཚུ་ source control, command lines, logs, tickets, chat དང་ public documentation ནང་མ་བཙུགས་པར་བཞག་དགོ།

## ལག་ལེན་ཚུ་ བསྐྱར་ཞིབ་འབད་ཚུགསཔ་བཟོ། {#make-deployments-reviewable}

- གསང་བ་མེན་པའི་ configuration དང་ deployment automation ཚུ་ version control ནང་བཞག་དགོ།
- binaries, configuration, genesis material, validator membership, permissions དང་ public routes ཚུ་གི་བསྒྱུར་བཅོས་ཚུ་བསྐྱར་ཞིབ་འབད་དགོ།
- བགོ་བཀྲམ་མ་འབད་བའི་ཧེ་མར་ release artifacts ཚུ་བདེན་དཔྱད་འབད་དགོ། ཆ་འཇོག་གྲུབ་པའི་ versions དང་ hashes ཚུ་ཐོ་བཀོད་འབད་དགོ།
- production ནང་ལུ་ལཱ་འབད་ནི་ཨིན་པའི་ binary དང་ configuration གི་མཉམ་སྡེབ་ངོ་མ་དེ་བརྟག་དཔྱད་འབད་དགོ།
- network གི་ deterministic behavior དེ་བསྲུང་དགོ། Hardware acceleration གིས་ peer-visible results ཚུ་འགྱུར་བཅོས་འབད་མི་ཆོག།

## བལྟ་རྟོག་འབད་ནི་དང་ བདེན་དཔང་ཉར་ཚགས་འབད་དགོ། {#monitor-and-preserve-evidence}

- peer health, consensus progress, permission changes, privileged instructions, authentication failures དང་ unexpected configuration changes ཚུ་ལུ་བལྟ་རྟོག་འབད་དགོ།
- ཁག་ཆེ་བའི་བརྡ་སྟོན་ཚུ་ གནོད་སྐྱོན་བྱུང་མིའི་ host ལུ་མ་བརྟེན་པའི་ system ཅིག་ལུ་གཏང་དགོ།
- འབྲེལ་ཡོད་པའི་ logs, ledger references, configuration snapshots དང་ transaction hashes ཚུ་ ཡིད་ཆེས་ཅན་གྱི་ timestamps དང་གཅིག་ཁར་བཞག་དགོ།
- མེད་པའི་ monitoring data འདི་ ཞིབ་དཔྱད་དགོ་པའི་ operational problem ཅིག་སྦེ་བརྩི་དགོ།

## འགོ་མ་བཙུགས་པའི་ཧེ་མར་ བསྐྱར་གསོ་གི་གྲ་སྒྲིག་འབད་ {#prepare-recovery-before-launch}

- བྱ་སྟབས་མ་བདེཝ་ཅིག་ གསལ་སྟོན་འབད་ཚུགས་མི་དང་ བསྐྱར་གསོ་འབད་ནི་ལུ་ ངོས་ལེན་འབད་ཚུགས་མི་ཚུ་ ངེས་པར་དུ་བཟོ་དགོ།
- backup, restore, key replacement, permission revocation དང་ peer recovery procedures ཚུ་བརྟག་དཔྱད་འབད་དགོ།
- incident སྐབས་ལུ་ trusted release artifacts, configuration, genesis records དང་ inventories ཚུ་ཐོབ་ཚུགསཔ་སྦེ་བཞག་དགོ།
- དང་པ་ reads དང་ monitoring སླར་གསོ་འབད་དགོ། recovered network དང་ dependent applications ཚུ་གི་ checks ཆ་མཉམ་མ་འགྲུབ་ཚུན་ writes ཚུ་ལོག་འགོ་བཙུགས་མི་ཆོག།
- བྱ་སྟབས་མ་བདེཝ་རེ་བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་ controls, automation དང་ exercises ཚུ་དུས་མཐུན་བཟོ་དགོ།

::: warning

Ledger ལས་སྣ་ཚུ་ ལོག་བསྒྱུར་མ་ཚུགསཔ་འོང་། recovery ཡང་ན་ governance transaction མ་བཙུགས་པའི་ཧེ་མར་ སྔོན་ལས་བསྐྱར་ཞིབ་འབད་མི་བྱ་རིམ་ཚུ་ལག་ལེན་འཐབ་ཞིནམ་ལས་ དགོ་པའི་ངོས་ལེན་ཚུ་ལེན་དགོ།

:::

[ལག་ལེན་གྱི་ ཉེན་སྲུང་](./operational-security.md)དང་ [སེལ་འཐུ་འབད་ནིའི་དོན་ལུ་ གྲ་སྒྲིག་འབད་ནི་ ](../best-practices/release-readiness.md)ཚུ་ འཕྲོ་མཐུད་འབད་ནི།
