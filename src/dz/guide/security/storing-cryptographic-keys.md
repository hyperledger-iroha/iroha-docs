---
translation_locale: dz
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# ཨེབ་གཏང་འབད་ནིའི་ལྡེ་མིག་ཚུ་བཞག་ནི། {#storing-cryptographic-keys}

Private key གིས་ འདི་གི་ authority ལུ་ཆོག་མཆན་ཡོད་པའི་ལཱ་ཆ་མཉམ་ལུ་ཆོག་མཆན་བཀོད་ཚུགས། Private key འདི་ནམ་ཡང་བགོ་བཤའ་མ་རྐྱབ། Seed material, recovery secrets, bearer tokens དང་ exported key files ཚུ་ཡང་ དེ་དང་འདྲ་བའི་ཉེན་སྲུང་ནང་བཞག་དགོ།

བཟོ་སྐྲུན་འགོ་འདྲེན་འཐབ་པའི་ཧེ་མར་ སྲུང་སྐྱོབ་གི་འཆར་གཞི་འདི་ གདམ་ཁ་རྐྱབས། འཆར་གཞི་དེ་གིས་ ཉེན་ཁ་ཅན་གྱི་གོང་ཚད་དང་རྩིས་ཁྲ་འཛིན་སྐྱོང་གི་ལམ་ལུགས་ དེ་ལས་ བཙུགས་ནིའི་ལཱ་དེ་ ལོག་སྤྱོད་འབད་ནི་གི་ བྱ་རིམ་ཚུ་དང་མཐུན་དགོ།

## སྲུང་སྐྱོབ་ཀྱི་ཚད་གཞི་ཚུ་ ངེས་གཏན་རྐྱབས། {#define-the-custody-boundary}

- Authority, public key, algorithm, environment, purpose, custodian, storage location, backup དང་ replacement procedure རེ་རེའི་ཐོ་ཡིག་བཞག།
- Development, test, production, routine transaction, governance, deployment དང་ recovery ཚུ་གི་དོན་ལུ་ key སོ་སོར་ལག་ལེན་འཐབ།
- མི་དང་ process ཚུ་ལུ་ ཁོང་རའི་ role གིས་དགོ་པའི་ key ཚུ་རྐྱངམ་ཅིག་གི་ access བྱིན།
- Risk model གིས་དགོ་ཟེར་བའི་སྐབས་ high-value ཡང་ན་ governance signing ལུ་ independent approval དགོ།
- Signer གྱིས་ག་ཅི་ཅིག་གི་ network དང་ authority ལག་ལེན་འཐབ་ཆོགཔ་ཨིན་ན་ཐོ་བཀོད་འབད། Signing service གིས་ scope དེ་གི་ཕྱི་ཁའི་ཞུ་བ་ཚུ་ངེས་པར་དུ་ཆ་མེད་གཏང་དགོ།

## གནས་སྡུད་བཞག་སའི་ ཐབས་ལམ་ཚུ་ གདམ་ཁ་རྐྱབས། {#choose-an-appropriate-storage-method}

Local development, controlled test ཡང་ན་ secure custody handoff གི་དོན་ལུ་ key འདི་ permission-restricted file ནང་ export འབད་ཆོག། རྒྱབ་སྐྱོར་ཡོད་པའི་ Unix platform གུ་ `kagami` གིས་ key directory གསརཔ་བཟོ་:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Parent directory ཡོད་དགོ། Target འདི་གསརཔ་ ཡང་ན་ current user གྱི་བདག་དབང་ནང་ཡོད་མི་ mode `0700`, symbolic link མེད་མི་དང་ སྟོངམ་ཨིན་དགོ། Kagami གིས་ `public.key` དང་ `private.key` འདི་ mode `0600` ནང་བྲིས་འོང་། `--pop` གིས་ `pop.hex` ཡང་འབྲི་འོང་། Kagami གིས་ owner-only filesystem rules ཚུ་ལག་ལེན་འཐབ་མ་ཚུགས་པའི་ platform གུ་ command འདི་འཛོལ་བ་སྟོན་ཏེ་མཚམས་འཇོག་འབད་འོང་།

Private-key file འདི་ unencrypted export ཨིན། འདི་ source control, shared folders, logs, tickets, chat དང་ build artifacts ཚུ་གི་ཕྱི་ཁར་བཞག་དགོ། Production key འདི་ approved custody boundary ནང་ནང་འདྲེན་འབད་ཞིནམ་ལས་ deployment procedure དང་འཁྲིལ་ཏེ་ export file བཏོན་གཏང་། Development key འདི་ production ནང་ལོག་ལག་ལེན་མ་འཐབ།

བཟོ་སྐྲུན་གྱི་དོན་ལུ་ བསྐྱར་ཞིབ་འབད་ཡོད་པའི་ ཉེན་སྲུང་གི་ཚད་གཞི་ཚུ་ གདམ་ཁ་རྐྱབ་ནི།

- Hardware security module ཡང་ན་ hardware-backed keystore
- Operating-system ཡང་ན་ mobile keystore
- Isolated signing service
- Key འདི་ authorized workload ལུ་རྐྱངམ་ཅིག་བྱིན་མི་ secret manager

Selected integration གིས་རྒྱབ་སྐྱོར་འབད་པ་ཅིན་ key material འདི་ non-exportable སྦེ་བཞག། Custody system གིས་ Iroha authority ལུ་དགོ་པའི་ algorithm དང་ signing operation གཉིས་རྒྱབ་སྐྱོར་འབད་མི་འདི་ངེས་གཏན་བཟོ།

Encryption at rest གིས་ stored copy འདི་རྐྱངམ་ཅིག་སྲུང་འོང་། Unauthorized process ཡང་ན་ operator གྱིས་ decrypted bytes ཐོབ་པའི་ཤུལ་ལུ་ key འདི་སྲུང་མི་ཚུགས། Host སྒྲིང་སྒྲི་བཟོ་, runtime access བཀག་དམ་འབད་ དེ་ལས་ signing activity ལྟ་རྟོག་འབད།

## ཐོ་བཀོད་འབད་ནིའི་ལཱ་རིམ་ཚུ་ སྲུང་སྐྱོབ་འབད་ {#protect-signing-workflows}

- Named operator identities, strong authentication དང་ signing systems ལུ་ audited access ལག་ལེན་འཐབ།
- Raw keys ཚུ་ command-line arguments, shell history, environment dumps, process listings, crash reports དང་ application logs ཚུ་ནང་ནམ་ཡང་མ་བཙུགས།
- Signer འདི་ དགོས་མཁོའི་ལཱ་རྐྱངམ་ཅིག་གི་དོན་ལུ་ unlock འབད། ལག་ལེན་འཐབ་ཚརཝ་ད་ session ཁ་བསྡམ་ ཡང་ན་ expire འབད།
- ངོས་ལེན་མ་འབད་བའི་ཧེ་མར་ དབང་ཚད་དང་དྲ་རྒྱ་དང་ ལམ་སྟོན་ དེ་ལས་ རྒྱུ་དངོས་དང་འཐུས་ཚུ་བཏོན་དགོ།
- ཁྱད་ལྡན་དང་གོང་མཐོའི་ཚོང་འབྲེལ་ཚུ་གི་དོན་ལུ་ གསལ་ཏོག་ཏོ་སྦེ་ ངོས་ལེན་འབད་དགོཔ་ཨིན།
- Custom client integration གིས་ signing delegate འབད་ཚུགས་པ་ཅིན་ raw private keys ཚུ་ browser pages དང་ general-purpose application processes གི་ཕྱི་ཁར་བཞག།

Plain-text client configuration འདི་ local development དང་ controlled test ལུ་རྐྱངམ་ཅིག་འོས་འབབ་ཡོད། Production integration གིས་ approved custody boundary ཐོག་ལས་ signature ཐོབ་དགོ། Standard Iroha CLI གིས་ private key འདི་ client configuration ནང་ལས་ལྷག་ཨིནམ་དང་ generic external-signer adapter མེད། Custom client གིས་ transaction payload hash བཟོ་ཞིནམ་ལས་ external signer གྱིས་བཟོ་མི་ signature མཐུད་ཚུགས།

## ཨེབ་གཏང་དང་ལྡེ་མིག་ཚུ་སླར་ལོག་འབདཝ་ཨིན། {#back-up-and-recover-keys}

- Recovery policy གིས་ backup དགོ་ཟེར་མི་ key ཚུ་རྐྱངམ་ཅིག་ backup འབད།
- Backup ཚུ་ encrypt འབད་དེ་ live signer ལས་སོ་སོར་བཞག།
- Backup ལུ་ live key དང་འདྲ་བའི་ access དང་ approval controls ལག་ལེན་འཐབ།
- Separation of duties དགོ་པ་ཅིན་ recovery credentials ཚུ་ independent custody ནང་བཞག།
- Production key material གསལ་བཀོད་མ་འབད་བར་ restoration བརྟག་དཔྱད་འབད།
- Backup creation, access, restore དང་ destruction རེ་རེ་ཐོ་བཀོད་དང་བསྐྱར་ཞིབ་འབད།

Iroha སྒེར་གྱི་ལྡེ་མིག་ཅིག་ལུ་ འབྲེལ་བ་མེད་མི་ wallet mnemonic format གིས་ངོ་ཚབ་འབད་ཚུགས་ཟེར་ མནོ་བསམ་མ་གཏང་པར་ ལག་ལེན་འཐབ་ནི་རྐྱངམ་གཅིག་ Recovery Format འདི་ སེལ་འཐུ་འབད་ཡོད་མི་ custody systemགིས་ རྒྱབ་སྐྱོར་འབད་དེ་ བརྟག་དཔྱད་འབདཝ་ཨིན།

## Exposed ཡང་ན་ retired key ཚུ་བརྗེ་སོར་འབད། {#replace-exposed-or-retired-keys}

འབྱུང་རྐྱེན་མ་འབྱུང་པའི་ཧེ་མར་ བསྒྱུར་བཅོས་འབད་དགོཔ་འདི་ གྲ་སྒྲིག་འབདཝ་ཨིན། བྱ་རིམ་དེ་གིས་:

1. Key འདི་ exposed ཡང་ན་ retired ཨིན་ཟེར་ག་གིས་གསལ་བསྒྲགས་འབད་ཚུགས་ག
2. གནོད་པ་ཐོབ་མི་ signer འདི་ག་དེ་སྦེ་ isolate འབད་ནི་ཨིན་ན
3. Key གསརཔ་ག་དེ་སྦེ་བཟོ་ནི་དང་ approved custody ནང་ག་དེ་སྦེ་བཞག་ནི་ཨིན་ན
4. Account གི་དོན་ལུ་ authorized controller replacement ཡང་ན་ social recovery གིས་ replacement canonical `AccountId` ག་དེ་སྦེ་བཟོ་ནི་དང་ linked state ག་དེ་སྦེ་སྤོ་ནི་ཨིན་ན
5. Node ཡང་ན་ peer གི་དོན་ལུ་ authorized on-chain consensus-key rotation ཡང་ན་ disablement འདི་ BLS PoP, activation and overlap policy, local key configuration, `trusted_peers_pop` དང་ deployment topology དང་ག་དེ་སྦེ་མཉམ་འབྲེལ་འབད་ནི་ཨིན་ན
6. Dependent configurations, applications དང་ operators གིས་ `AccountId`, public key ཡང་ན་ peer identity གསརཔ་ག་དེ་སྦེ་ལག་ལེན་འཐབ་ནི་ཨིན་ན
7. Key རྙིངམ་གི་ authority ག་དེ་སྦེ་བཏོན་ནི་དང་ copy ཚུ་ archive ཡང་ན་ destroy ག་དེ་སྦེ་འབད་ནི་ཨིན་ན
8. ཤུལ་ལས་ network དང་ dependent applications ག་དེ་སྦེ་བརྟག་དཔྱད་འབད་ནི་ཨིན་ན

::: warning

Encryption ཡང་ན་ password གསརཔ་གིས་ copied private key འདི་ལོག་སྟེ་ཉེན་སྲུང་ཅན་བཟོ་མི་ཚུགས། Exposure དོགས་པ་ཡོད་པ་ཅིན་ key ལག་ལེན་མཚམས་འཇོག་འབད་ཞིནམ་ལས་ approved replacement ཡང་ན་ revocation procedure ལག་ལེན་འཐབ།

:::

[ཨེབ་རྟ་ལྡེ་མིག་བཟོ་ནི་](./generating-cryptographic-keys.md), [ལག་ལེན་གྱི་ ཉེན་སྲུང་](./operational-security.md)དང་ [ ཉེན་སྲུང་གི་གཞི་རྩ་](./security-principles.md)བལྟ་དགོ།
