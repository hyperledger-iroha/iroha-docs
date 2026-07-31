---
translation_locale: dz
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE འདི་ Random-Access Machine Laconic Function Evaluation ཟེར་མི་འདི་ཨིན། Iroha ནང་ལུ་འདི་ སྤྱིར་བཏང་གི་སྦ་བཞག་པའི་འགན་ཁུར་གྱི་ཐིག་ཁྲམ་ཨིན་མི་ ལས་རིམ་ཚུ་གི་དོན་ལུ་ཨིནམ་ད་ མི་མང་གི་སྲིད་བྱུས་དེ་ ལྕགས་ཐག་གུ་ཨིན་རུང་ བརྟག་ཞིབ་འབད་ནིའི་ logic, གསང་བའི་གདམ་ཁ་དང་ raw inputཚུ་ འཛམ་གླིང་རྒྱལ་ཁབ་ལུ་བྲིས་མི་བཏུབ་ཨིན་མས། འདི་ SORA Nexus ངོས་འཛིན་འབད་ཐངས་ལས་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། དཔེར་ན་ སྒེར་གྱི་ཁ་བྱང་དང་ བརྒྱུད་འཕྲིན་འཚོལ་ཐངས་ཚུ་དང་འདྲ། དེ་ལས་ གློག་རིག་གི་ཁ་ཐུག་གི་ལམ་ལུགས་ཚུ་ ལག་ལེན་འབད་ནི་ལུ་ Node Profile གིས་ རྩ་སྒྲིག་ཅིག་བཟོཝ་ད་ སྤྱིར་བཏང་གི་ Torii ལས་རིམ་ལག་ལེན་ནང་ལུ་ གྲོགས་རམ་སྦེ་ཡང་བཏོན་ཚུགས།

ལྕགས་ཐག་གིས་ སྲིད་བྱུས་གི་བཅའ་གཏད་དང་ ངོས་ལེན་བརྟག་དཔྱད་ཀྱི་ metadata འདི་བཞག་ཡོདཔ་ཨིན། Resolver ཡང་ན་ Torii runtime གིས་སྦ་ཡོད་པའི་ལས་རིམ་འདི་བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ ངོས་ལེན་ཅན་གྱི་ outputརྐྱངམ་གཅིག་སླར་ལོག་འབདཝ་ཨིན། དེ་ལས་ client, support tooling ཡང་ན་ ledger གི་བཀོད་རྒྱ་ཚུ་གིས་ ཐོ་བཀོད་འབད་མི་ སྲིད་བྱེདཔ་ལུ་རྒྱབ་སྐྱོར་འབད་ཚུགས་པའི་ ངོས་ལེན་ཅིག་ བསྡུ་སྒྲིག་ཨིན།

## མིང་བཏགས་ནི་ {#naming}

མིང་བཏགས་ཐོ་བཀོད་དེ་ ཁག་ཆེཝ་ཨིན།

|དུས་ཚོད། |དོན་དག་ |
| --- | --- |
|`ram_lfe` |ཕྱི་ཁའི་སྦ་བཞག་པའི་འགན་ཁུར་གྱི་རྣམ་གཞག་: ལས་རིམ་གི་སྲིད་བྱུས་, ཁས་བླངས་ཚུ་, ལག་ལེན་ཐོ་བཀོད་དང་ ཐོ་བཀོད་ཐོ་བཀོད་ཀྱི་ལམ་ལུགས་ཚུ་|
|`BFV` |Brakerski/Fan-Vercauteren གི་ homomorphic encryption scheme འདི་ encrypted input RAM-LFE backends གིས་ལག་ལེན་འཐབ་ཨིན། |
|`ram_fhe_profile` |BFV གི་དོན་ལུ་ ཁྱད་ཅན་ metadata སྦ་གསང་ཅན་གྱི་ལག་ལེན་འཕྲུལ་ཆས་འདི་ཨིན། འདི་ RAM-LFE གི་མིང་གཉིས་པ་མེན།|

གནད་སྡུད་དཔེ་རིམ་ནང་ `RamLfeProgramPolicy` དང་ `RamLfeExecutionReceipt` འདི་ RAM-LFE གི་དབྱེ་བ་ཚུ་ཨིན། BFV ཚད་གཞིའི་ཁྱད་ཚད་དང་ ཨེབ་གཏང་ཚིག་ཡིག་གི་ཁེབས་ དེ་ལས་སྦ་བཞག་མི་ RAM-FHE ལས་རིམ་གྱི་བཟོ་རྣམ་འདི་ སྲིད་བྱུས་ཅིག་གིས་ལག་ལེན་འཐབ་མི་ ཨེབ་གཏང་ཅན་གྱི་ ལག་ལེན་རྒྱབ་སྒྲིལ་ལུ་གཏོགས་ཡོདཔ་ཨིན།

## ཐོ་བཀོད་འབད་མི་འདི་ {#what-it-records}

RAM-LFE ལས་རིམ་གི་སྲིད་བྱུས་འདི་ འཛམ་གླིང་ནང་ར་ `program_id` གིས་ ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན། སྲིད་བྱུས་འདི་གིས་ནང་ལུ་:

- སྲིད་བྱུས་དེ་ རྩ་སྒྲིག་འབད་ནི་དང་ རྩ་སྒྲིག་གཏང་ནི་ ཡང་ན་ ཐབས་ལམ་གཞན་ཅིག་ལུ་འགྱུར་བཅོས་འབད་ཚུགས་མི་ བདག་འཛིན་རྩིས་ཁྲ་
- ཚོང་མགྲོན་པ་ཚུ་ལུ་ གསལ་བསྒྲགས་འབད་མི་ backend
- ཐོ་བཀོད་རྒྱབ་སྐྱོར་གྱི་ལམ་ལུགས་ `signed` ཡང་ན་ `proof`
- སྦ་བཞག་མི་ ལས་རིམ་གྱི་ metadata དང་ evaluator གསང་བའི་དོན་ལུ་ ཁས་བླངས་འབད་
- ཐོ་བཀོད་འབད་ཡོད་པའི་ཡི་གུ་ཚུ་གི་དོན་ལུ་ Resolver public key
- གདམ་ཁ་རྐྱབས་ཅན་གྱི་ མི་མང་གི་ ཨེབ་གཏང་འབད་ཡོད་པའི་ metadataཚུ་ དཔེར་ན་ BFV ཚད་གཞི་དང་ `ram_fhe_profile`
- `active` གི་བརྡ་སྟོན་དེ་ སྲིད་བྱུས་དེ་གིས་ འཁྲུན་ཆོད་གསརཔ་སྤྲོད་ཚུགས་ཨིན་ན་མེན་ན་ བསྐྱར་ཞིབ་འབད་འབདཝ་ཨིན།

གསང་བ་སྦ་བཞག་མི་ གསང་བའི་ཡིག་ཆ་དང་ ཡིག་འབྲུ་ངོ་མ་གི་ ངོ་རྟགས་ཅན་གྱི་གོང་ཚད་ དེ་ལས་ ཡིག་གཟུགས་སྦ་བཞག་མི་འདི་ འཛམ་གླིང་གནས་སྟངས་ནང་བཞག་མི་བཏུབ་ཨིན། ཁྱོད་ཀྱིས་ ཁས་བླངས་ཚུ་དང་ མཚམས་འཇོག་འབད་མ་བཏུབ་པའི་ ཧེཤ་ཚུ་དང་ ངོས་ལེན་ཧེཤ་ཚུ་ དེ་ལས་ ཨེབ་གཏང་ཡིག་ཆ་དང་ ལས་རིམ་ལག་ལེན་འཐབ་མི་ཚུ་ མཚམས་བཅོས་འབད་མ་བཏུབ་མི་ སྲིད་བྱུས་ཀྱི་གོང་ཚད་ཅིག་སྦེ་བརྩི་དགོ།

## རྒྱབ་སྐྱོར་ཚུ་ {#backends}

ད་ལྟོའི་ RAM-LFE རྒྱབ་སྐྱོར་དེ་ Backend ངོས་འཛིན་འབད་མི་༣ ལུ་གཙོ་བོ་བསྟེན་ཡོདཔ་ཨིན།

|Backend |ལག་ལེན་འཐབ་ |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |ཁས་བླངས་ཅན་གྱི་བརྟག་དཔྱད་ PRF. |
|`bfv-affine-sha3-256-v1` |BFV གིས་རྒྱབ་སྐྱོར་འབད་མི་ གསང་བའི་རྩིས་ཞིབ་འདི་ སྦ་གསང་ཅན་གྱི་ ངོ་རྟགས་སྒོ་ར་སྒོ་ཚུ་ནང་ལུ་ཨིན།|
|`bfv-programmed-sha3-256-v1` |BFV གིས་རྒྱབ་སྐྱོར་འབད་ཡོདཔ་ཨིན། སྦ་ཆག་བཀོད་ཡོད་པའི་ ཐོ་བཀོད་དང་ དྲན་ཐོའི་ལམ་བརྒྱུད་དེ་ལག་ལེན་བསྟར་སྤྱོད་འབདཝ་ཨིན།|

ངོས་འཛིན་གྱི་ སྲིད་བྱུས་ཚུ་གི་དོན་ལུ་ ལས་རིམ་སྒྲིག་འབད་ཡོད་མི་ BFV backendའདི་ དེང་སང་གི་ལམ་དེ་ཨིན། དེ་གིས་ wallet ཚུ་ནང་ རང་བཞིན་གནས་སྟངས་ཀྱི་འཛུལ་སྒོ་ཚུ་ ནང་འཁོད་ལུ་ ཨེབ་གཏང་འབད་ཚུགསཔ་བཟོཝ་ཨིན། འདི་གིས་ resolver ལུ་ transactionནང་ལུ་ public identifier མ་མཐོང་པར་ evalue འབད་བཅུགཔ་ཨིན། ཨེབ་ཐོར་དེ་ ཐོ་བཀོད་ཅན་གྱི་ ལས་རིམ་ སྲིད་བྱུས་ལུ་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ འཁྲུན་ཆོད་ཅིག་ སླར་ལོག་འབདཝ་ཨིན།

## རྩིས་རིག་པ་ {#math}

འ་ནི་ཐིག་ཁྲམ་འདི་ ད་ལྟོའི་ RAM-LFE ཀོ་ཌི་གིས་ལག་ལེན་འཐབ་མི་ ལག་ལེན་གྱི་གནས་ཚད་ཀྱི་ ཨེལ་ཇི་བེ་རེ་ལུ་བཤད་དོ་ཡོདཔ་ཨིན། འདི་ ཉེན་སྲུང་གི་རྟགས་མ་ཨིནམ་ལས་ སྲིད་བྱུས་དང་ འོས་འབབ་ དེ་ལས་ ཚོང་མགྲོན་པ་ཚུ་གིས་ གྲོས་བསྟུན་འབད་དགོ་པའི་ ཐོ་བཀོད་ཡིག་འབྲུ་དང་ ཨེབ་གཏང་ཅན་གྱི་བརྟག་དཔྱད་རྣམ་གཞག་ཨིན།

### བརྡ་བཀོད་ཚུ་ {#notation}

བཏང་གཏང་:

- \(H(m)\) འབད་ནི་ Iroha `Hash::new(m)`: Blake2b-32 over `m`, མཇུག་མཐའན་མཇུག་གི་ byte གི་ཉུང་ཤོས་ bit ལུ་བཙུགས། `1`.
- \(N(x)\) གིས་ `x` གི་ ཀ་ནོ་ནིཀིཌ་དེ་ Norito ཨིན་ཨིན།
- \(a \parallel b\) བའི་ཊི་ཐིག་ཕྲ་ཕྲ་བསྡོམས་ཀྱི་དོན་ལས་ཨིན།
- \(\operatorname{le64}(i) \) ཨང་གྲངས་ཡོངས་མ་ཡིག་རྟགས་མ་བཀོད་པའི་ 8-bayt གི་ཨ་ཙི་ཨེན་ཌི་ཨའི་ཨེབ་གཏང་འབད་ནི་ཨིན།
- \(s\) འཛམ་གླིང་གི་རྒྱལ་ཁབ་ཀྱི་ཕྱི་ཁར་བཞག་མི་ གསང་བའི་ resolver འབད་ནི་ཨིན།
- \(P\) གཞུང་གི་སྲིད་བྱུས་ཀྱི་ཚད་གཞི་ཚུ་ཨིན།
- \(A\) འབྲེལ་བ་ཡོད་པའི་ གནད་དོན་ཚུ་ དགོཔ་ཨིན།
- \(x\) ཚད་ལྡན་ནང་བཙུགས་མི་ Byte ཡང་ན་ Norito ལུ་ཨེབ་གཏང་འབད་ཡོད་པའི་ ཨེབ་ལྡེ་ཚུ་ཨིན། འདི་ backend གི་ཁ་ཐུག་ལས་ཨིན་མས།

RAM-LFE གིས་ domain-separated hashes ལག་ལེན་འཐབ་ཨིན། འོག་གི་བཀོད་ཚིག་འདི་ནང་ལུ་ domain གི་དོན་ལས་མིང་བཏགས་ཡོདཔ་ཨིན། ཁོང་རའི་གནས་སྐབས་ཀྱི་ byte string འདི་ཚུ་:

|རྟགས་མཚན་ |Domain string |
| --- | --- |
|\(D_{\mathrm{policy}}\) |`iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{secret}}\) |`iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{salt}}\) |`iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_opaque}}\) |`iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_receipt}}\) |`iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{opaque}}\) |`iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{receipt}}\) |`iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{affine\_circuit}}\) |`iroha.ram_lfe.bfv_affine.circuit.v1` |
|\(D_{\mathrm{affine\_opaque}}\) |`iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
|\(D_{\mathrm{affine\_receipt}}\) |`iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
|\(D_{\mathrm{program\_memory}}\) |`iroha.ram_lfe.bfv_program.memory.v1` |
|\(D_{\mathrm{program\_opaque}}\) |`iroha.ram_lfe.bfv_program.opaque_hash.v1` |
|\(D_{\mathrm{program\_receipt}}\) |`iroha.ram_lfe.bfv_program.receipt_hash.v1` |
|\(D_{\mathrm{program\_digest}}\) |`iroha.ram_lfe.bfv_program.digest.v1` |
|\(D_{\mathrm{output}}\) |`iroha.ram_lfe.output_hash.v1` |
|\(D_{\mathrm{id\_opaque}}\) |`iroha.ram_lfe.identifier.opaque_hash.v1` |
|\(D_{\mathrm{id\_receipt}}\) |`iroha.ram_lfe.identifier.receipt_hash.v1` |
|\(D_{\mathrm{bfv\_keygen}}\) |`iroha.crypto.fhe.bfv.keygen.v1` |
|\(D_{\mathrm{bfv\_encrypt}}\) |`iroha.crypto.fhe.bfv.encrypt.v1` |
|\(D_{\mathrm{id\_keygen}}\) |`iroha.crypto.fhe.bfv.identifier.keygen.v1` |
|\(D_{\mathrm{id\_slot}}\) |`iroha.crypto.fhe.bfv.identifier.slot.v1` |

### སྲིད་བྱུས་ཀྱི་ ཁས་བླངས་ {#policy-commitment}

སྲིད་བྱུས་གི་ ཁས་བླངས་ཅིག་གིས་ མི་མང་གི་ཚད་གཞི་དང་ གསང་བའི་ resolver གསང་བ་ཚུ་ backend ལུ་བཅའ་མར་གཏོགསཔ་ཨིན། དང་པ་རང་ གསང་བ་དེ་སོ་སོར་སྦེ་བཅའ་མར་གཏོགས་ཡོདཔ་ཨིན།

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

དེ་ལས་ སྲིད་བྱུས་ཀྱི་ཡིག་འབྲུ་ཆ་ཡོངས་བསྡོམས་འདི་ ཨེབ་གཏང་འབདཝ་ཨིན།

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

དེ་ལས་ གསལ་བསྒྲགས་འབད་ཡོད་པའི་ སྲིད་བྱུས་འདི་:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

`PolicyCommitment` འབྲེལ་མཐུད་འབད་ཡོད་པའི་ནང་ཐིག་འདི་:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

བརྟག་ཞིབ་འདི་ Runtime གསང་བའི་ནང་ལས་ གནས་གོང་གཅིག་རང་བསྐྱར་རྩིས་འབདཝ་ཨིན། བསྐྱར་ཞིབ་འབད་ཡོད་པའི་ཧེཤ་དེ་ ཁྱད་པར་ཡོད་པ་ཅིན་ བརྟག་ཞིབ་དེ་ ཁས་བླངས་མ་མཐུན་པའི་ཐོག་ལས་ ཕོག་འོང་།

### HKDF-SHA3-512 Backend {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1`གི་དོན་ལུ་ ཕྱིར་ཐོན་འབད་ཐངས་འདི་ རང་བཞིན་གནས་སྟངས་ནང་འཛུལ་ནི་ཨིནམ་ད་ ཨིན་རུང་ དྭངས་གསལ་མེད་པའི་ ངོས་འཛིན་དང་ ཐོ་བཀོད་ཧེཤ་ཚུ་ གསང་བའི་བཅའ་ཁྲིམས་ཅན་གྱི་ PRF ཐོན་ཐངས་ཨིན།

ཞུ་ཡིག་གི་ ཡིག་སྣོད་འདི་:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF ཚྭ་དང་པེསི་ཌོ་རན་དོམ་ལྡེ་མིག་འདི་:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

དྭངས་འཕྲོས་མ་མཐོང་མི་ མཁོ་ཆས་ཚུ་ རྒྱ་སྐྱེད་འབད་ཞིནམ་ལས་ ཧེཤ་འབད་:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

བཏང་ཐོ་བཀོད་ཡིག་སྣུམ་གྱིས་ དྭངས་འཕྲོས་མེད་པའི་ ID འདི་ཡང་བསྡམས་ཏེ་ཡོདཔ་ཨིན།

$$
m_r =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK},
D_{\mathrm{hkdf\_receipt}} \parallel T_{\mathrm{req}}
\parallel \mathrm{opaque\_id}, 32)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{receipt}} \parallel m_r \parallel \mathrm{opaque\_id})
$$

backend འདི་སླར་ལོག་འབདཝ་ཨིན།

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV དཔྱད་ཡིག་ {#bfv-primer}

BFV འདི་ཐིག་ལེ་ལུ་གཞི་བཞག་སྟེ་ homomorphic encryption scheme ཨིན། "homomorphic"ཟེར་བ་ཅིན་ ལས་རིམ་ཅིག་གིས་ ཨེབ་གཏང་འབད་ཡོད་པའི་གནས་གོང་ཚུ་སྣེ་ལེན་དང་ལྡནམ་བཟོ་ཚུགས་ནི་དང་ ཨེབ་གཏང་ཚར་བའི་ཤུལ་ལས་ ཨེབ་གཏང་དང་ལྡནམ་སྦེ་ བཟོ་ཚུགས་ནི་ཨིནམ་ད་ བསྐྱར་གསོ་དང་ལྡནམ་འགྱུར་གྱི་གྲུབ་འབྲས་དེ་ དྭངས་གསལ་ཡིག་གི་ གནས་གོང་ཚུ་ནང་ལུ་འབདཝ་ཨིན།

RAM-LFE གི་དོན་ལུ་ BFV གིས་ སྦྲགས་ཡོད་པའི་འཛུལ་སྒོ་འཕྲུལ་ཆས་སྦེ་ ལག་ལེན་འཐབ་ཨིན།

1. དངུལ་ཁུག་ཅིག་གིས་ སྒེར་གྱི་གོང་ཚད་ དཔེར་ན་ འགྲུལ་འཕྲིན་ཨང་གྲངས་ ཡང་ན་ བརྒྱུད་འཕྲིན་ཁ་བྱང་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན།
2. དངུལ་ཁུག་གིས་ བའི་ཊི་ཚུ་ ཨང་ཆ་མཉམ་གི་ས་སྒོ་ཆུང་ཀུ་ཅིག་ལུ་བསྒྱུར་བཅོས་འབདཝ་ཨིན།
3. སེལོཊ་རེ་ལུ་ Resolver གི་ public key BFV དང་གཅིག་ཁར་སྦྲེལ་འབདཝ་ཨིན།
4. Resolver runtime གིས་ སྦ་བཞག་མི་ལས་རིམ་འདི་ codetext གི་ཐོག་ལས་ བརྟག་ཞིབ་འབདཝ་ཨིན།
5. Runtime གིས་སྦ་བཞག་མི་ ལས་རིམ་ཐོན་ཐངས་དང་ རྟགས་མཚན་ཚུ་རྐྱངམ་གཅིག་ གསོག་འཇོག་འབདཝ་ཨིན། ཡང་ན་ བཏང་ཐོ་བཀོད་ཅིག་ སྟོན་ཚུགས།

BFV འདི་འབདཝ་ལས་ ཨང་གྲངས་ཡོངས་ཀྱི་རྩིས་རིག་དང་ ཚོད་དཔག་གི་རྩིས་རིག་མེན་པས་ འདི་འབདཝ་ལས་ ངོ་རྟགས་ཅན་ byte དང་ཆུང་བ་ modular ཚུ་གི་དོན་ལུ་ ལེགས་ཤོམ་ཨིན། རྩིས་ཁྲ་ལས་ floating-point བཟོ་རྣམ་མཐར་འཁྱོལ་བའི་ནང་ Iroha ད་ལྟོའི་ BFV ལག་ལེན་འཐབ་ཐངས་, སྦྲགས་གཏངམ་རེ་ལུ་ scalar value modulo གཅིག་འབག་ཡོདཔ་ཨིན། \(t\), འཕྲལ་འཕྲལ་ར་ byte ཡང་ན་ byte-length field འདི་ཨིན། code text རང་གིས་རང་འདི་ ལྗིད་ཚད་མང་ཤོས་ཅིག་ modulo བཟོ་སྟེ་སྡོད་ཡོདཔ་ཨིན། \(q\). བར་ན་གི་ཁྱད་པར་འདི་ \(q\) དང་ \(t\) ཨེབ་གཏང་དང་ homomorphic ལས་སྣ་ཚུ་གིས་ འཕྱགས་བདའ་མི་ དབྱངས་ཅན་ཚུ་གི་དོན་ལུ་ གསལ་བཀོད་འབད་ནིའི་ ས་གོ་བྱིན་ཡོདཔ་ཨིན།

BFV codetext ནང་ལུ་ polynomial གི་ཡན་ལག་གཉིས་ཡོད།

$$
c=(c_0,c_1)
$$

གསང་བའི་ལྡེ་མིག་འདི་ Polynomial \(s_k\) ཨིན། ཨེབ་གཏང་ཐངས་དེ་གི་ཡན་ལག་ཚུ་བསྡོམས་འབདཝ་ཨིན།

$$
v = c_0 + c_1s_k
$$

གལ་སྲིད་ ཨེབ་གཏང་ཚིག་ཡིག་འདི་ ལེགས་ཤོམ་སྦེ་བཟོ་ཡོདཔ་དང་ དབྱངས་ཅན་དེ་ ཉམ་ཆུང་ཡོད་པ་ཅིན་ \(v\) གིས་ ཚད་འཇལ་ཚར་མི་ ཨེབ་གཏང་ཡིག་གི་སྦོ་ལོགས་ཁར་ཨིན། Roundingགིས་ ཨེབ་གཏང་འབད་ཡོད་པའི་ཨེབ་གཏང་ཚིག་གཞི་གྲངས་ modulo \(t\) སླར་ལོག་འབདཝ་ཨིན། ཁེ་ཕན་ཅན་གྱི་ཁྱད་ཆོས་འདི་ ཨེབ་གཏང་ཁ་ཡིག་གི་ལག་ལེན་གྱིས་ བཟོ་བཀོད་འདི་ བདག་འཛིན་འབདཝ་ཨིན་མས།

|སྤྱིར་བཏང་ལཱ་ |ཨེབ་གཏང་ཡིག་སྣོད་ལག་ལེན་ |
| --- | --- |
|\(m+n\) |ཨེབ་ལྡེ་ཡིག་སྣོད་ཚུ་ ཁ་སྐོང་རྐྱབས། |
|\(m+\alpha\) |\(c_0\) ལུ་ ཚད་གཞི་སྒྲིག་རྐྱང་ཡིག་རྒྱུན་བསྡུད། |
|\(\alpha m\) |ཨང་གཉིས་ཆ་ར་ code text components ལུ་ \(\alpha\) སྦེ་ scale. |
|\(mn\) |code text polynomials མང་ལྡེ་སྦེ་ བསྒྱུར་བཅོས་འབད་ཞིནམ་ལས་ relinearize |

ཨང་ལྡོག་འདི་ བྱ་བ་ཁག་ཆེ་ཏོག་ཏོ་ཅིག་ཨིན་ སྦྲགས་ཡིག་ཆ་༢ གི་ཐོན་སྐྱེད་གིས་ རང་བཞིན་གྱིས་ \(1\), \(s_k\) དང་ \(s_k^2\)དང་གཅིག་ཁར་ གསུམ་གྱི་ཡིག་ཆ་ཅིག་བཟོ་དོ་ཡོདཔ་ཨིན། Relinearization གིས་ \(s_k^2\) གི་ཚིག་ཡིག་འདི་ རང་ལུགས་ཀྱི་ཆ་ཤས་གཉིས་ཡོད་པའི་ ཨེབ་རྟ་ནང་ལོག་སྤེལ་འབད་ནིའི་དོན་ལུ་ གསལ་བཀོད་གི་ལྡེ་མིག་ཅིག་ལག་ལེན་འཐབ་ཨིན། འདི་གིས་ཤུལ་ལས་ ཨེབ་རྟ་དང་ཨེབ་རྟ་ཚུ་ ལག་ལེན་འཐབ་སྟེ་ ཨེབ་རྟ་ཡི་གུ་བཟོ་རྣམ་གཅིག་རང་ བཟོ་འོང་།

BFV འདི་ཡང་ "leveled" ཨིན། ཨེབ་གཏང་འབད་ཡོད་པའི་ལག་ལེན་རེ་གིས་ སྒྲ་དབྱངས་དུམ་གྲ་ཅིག་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། འ་ནི་ལག་ལེན་འདི་གིས་ འཆར་དངུལ་དེ་ གསར་བཅོས་འབད་ནིའི་དོན་ལུ་ ཀི་པིར་ཊེཀསི་ཊར་ཚུ་ bootstrap མི་འབདཝ་ཨིན། དེ་ཚབ་ལུ་, RAM-LFE གིས་ `ram_fhe_profile` ཆུང་ཀུ་ཅིག་བསྐྲུལཝ་ཨིན། དེ་གིས་ཚད་ལྡན་སྦས་བཞག་མི་ ལས་རིམ་བཟོ་རྣམ་རྐྱངམ་གཅིག་ལུ་ ཆ་འཇོག་བྱེད། འདི་གིས་བརྟག་དཔྱད་དེ་ གནས་ཚད་གཞི་ གཞི་སྒྲིག་གི་ རྒྱབ་སྐྱོར་འབད་མི་གཏིང་ནང་བཞག་ཡོདཔ་ཨིན། ད་ལྟོའི་ལས་རིམ་བཀོད་མི་ཡིག་གཟུགས་འདི་གིས་ ཐོ་བཀོད་ཅན་གྱི་ ཐོ་བཀོད་ཀྱི་གྲངས་རྩིས་དང་ དྲན་ཐོའི་ལམ་གྱི་གྲངས་རྩིས་ དེ་ལས་ ཨང་ཆེ་ཤོས་ཅིག་རང་ ལས་རིམ་བཀོད་མི་ཐོ་བཀོད་ཐོག་ལུ་ ཤོག་ལེབ་ཡིག་ཆ་-ཨང་གྲངས་ཡིག་ཆ་ཡར་སེང་གཅིག་འབད་ཚུགསཔ་ཨིན།

འ་ནི་ RAM-LFE བཟོ་བཀོད་ནང་ལུ་ BFV གིས་ མི་མང་གི་རྩིས་དེབ་ཀྱི་ གནད་སྡུད་ལས་ ཌའི་ཊི་ཨར་དང་ བལྟ་རྟོག་པ་ཚུ་ལས་ མཐོང་མི་ཅ་ཆས་དང་ལམ་གྱི་ཁེ་ཕན་འདི་རྐྱངམ་གཅིག་མཐོང་དོ་ཡོདཔ་ཨིན། འདི་ཡང་ ལྕགས་ཐག་འདི་གིས་ རང་གིས་རང་ལུ་ ཐབས་ཤེས་མེད་པར་ ཨེབ་གཏང་ཅན་གྱི་ ལས་རིམ་ཚུ་ལག་ལེན་འཐབ་མ་བཅུགཔ་ཨིན་མས། Torii resolver runtime གིས་ BFV གསང་བའི་ཡིག་སྣོད་དེ་ བདག་འཛིན་འཐབ་དོ་ཡོདཔ་ལས་ བཀག་སྒྲིག་འབད་མི་སྦ་བཞག་མི་ ལས་རིམ་འདི་ བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ ངོས་ལེན་ཅན་གྱི་ཐོན་ཐངས་ཚུ་ ཁ་གསལ་སྦེ་བཏོན་ཏེ་ གྲུབ་འབྲས་ལུ་ ཐོ་བཀོད་འབདཝ་ཨིན། དེའི་ཤུལ་ལུ་ ledger གིས་ ལྕགས་ཐག་གི་ སྲིད་བྱུས་ཀྱི་ ཁས་བླངས་དང་བསྟུན་པའི་ སྒྲིག་གཞི་ཚུ་ བདེན་དཔྱད་འབད་དེ་ མི་མང་གི་ལྡེ་མིག་ ཡང་ན་ དཔྱད་རྟགས་ཀྱི་ metadata འདི་ resolve བཟོ་ཚུགས།

ངོས་འཛིན་གྱི་ལག་ལེན་འཐབ་ཐངས་འདི་ དམིགས་གཏད་ཐོག་ལུ་ ངོ་ཚབ་འཇམ་ཏོང་ཏོ་ཅིག་ གདམ་ཁ་རྐྱབས་ཨིན། རང་བཞིན་གནས་གོང་གི་ string འདི་ ཀོ་ཌ་འབདཝ་ཨིན།

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

གནད་སྡུད་རེ་ལུ་ རང་སོའི་ BFV scalar ciphertextསྦེ་ ཨེབ་གཏང་འབད་ཡོདཔ་ཨིན། འདི་གི་བཟོ་རྣམ་འདི་གིས་ ནོར་མཱལ་དང་ ཤོག་སྒྲིལ་གྱི་བདེན་ཁུངས་འདི་ གསལ་ཏོག་ཏོ་སྦེ་བཟོཝ་ཨིན། དེ་གིས་དངུལ་ཁུག་ཚུ་ མི་མང་གི་ཚད་འཛིན་ཚུ་ལས་ ཨེབ་གཏང་ཅན་གྱི་ཞུ་ཡིག་བཟོ་ནི་ལུ་ གོ་སྐབས་ཐོབ་ཡོདཔ་མ་ཚད་ བཀྲམ་སྤེལ་འཕྲུལ་ཆས་དེ་གིས་ གནས་གོང་ཀྱི་ཨེབ་གཏང་ཐོ་བཀོད་འབད་མི་འདྲ་མཉམ་ཚུ་ སྒྲིང་སྒྲི་ཡོད་པའི་ ངོས་ལེན་ཐོ་བཀོད་ཀྱི་ནང་ ཀ་ནོ་ནི་ཀ་འབད་ཚུགསཔ་ཨིན་མས།

### BFV ཅོག་སྒྲི་གི་རྣམ་གཞག་ {#bfv-ring-model}

BFV backends གིས་ negacyclic polynomial ring ལག་ལེན་འཐབ་ཨིན།

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

ཝང་ཡིག་འབྲུ་གི་སྒྲོམ་:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

འོག་གི་ཤོག་ལེབ་ཚུ་

- \(n\)འདི་ `polynomial_degree`ཨིན། གློག་ཤུགས་གཉིས་
- \(q\)འདི་ `ciphertext_modulus`ཨིན།
- \(t\)འདི་ `plaintext_modulus`ཨིན།
- \(q > t\)དང་ \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Plaintext coefficient vectors འདི་ coefficientསོ་སོ་ལུ་ scale བཟོ་ཐོག་ལས་ code འབདཝ་ཨིན།

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

decryption center-lifts འདི་:

$$
v = c_0 + c_1 s_k \in R_q
$$

དེ་ལས་ \(R_t\) ལུ་ལོག་བཏོག་འབདཝ་ཨིན།

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

འདི་ནང་ལུ་ \(s_k\)འདི་ BFV གསང་བའི་ལྡེ་མིག་གི་ polynomial ཨིན། ཕྱི་ཁའི་ RAM-LFE resolver གསང་བ་ \(s\)མེན་པས།

### BFV Key Generation {#bfv-key-generation}

སྦྲགས་ཡོད་པའི་ ངོས་འཛིན་ཡིག་སྣོད་ཚུ་གི་དོན་ལུ་ BFV key material འདི་ resolver secretion དང་འབྲེལ་བའི་ data གི་ཐད་ཁར་ deterministicཨིན།

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG འདི་ འ་ནི་ནང་བཙུགས་འབདཝ་ཨིན།

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

གཞི་རྟེན་ཐོན་སྐྱེད་དཔེ་རིམ་ཚུ་:

- \(s_k \in \{-1,0,1\}^n\), modulo \(q\) གིས་ངོ་ཚབ་འབད་ཡོདཔ་ཨིན།
- \(a \leftarrow R_q\) གཅིག་མཚུངས་སྦེ་
- \(e \in \{-1,0,1\}^n\)

མི་མང་གི་ལྡེ་མིག་འདི་:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

རེ་རེ་ལའི་ཡཱནར་བཟོ་ནིའི་དོན་ལུ་ \(s_k^2\) གིས་ \(R_q\) ནང་གི་ ཅོག་སྒྲོམ་ཐོན་སྐྱེད་ཨིན། གཞི་རྟེན་-\(B\) ཨང་གྲངས་རེ་གི་དོན་ལུ་ \(j\) འདྲ་མཉམ་སྦེ་ བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ \(a_j\) དང་ \(e_j\) གི་དཔེ་སྟོན་འདི་ དབྱེ་བ་ཆུང་ནང་ལས་བཏོན་ཞིནམ་ལས་:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

མི་མང་གི་ BFV སྲིད་བྱུས་ཀྱི་ metadata ནང་ \(((n,q,t,B)\), མི་མང་ལྡེ་མིག་དང་ `max_input_bytes` ཡོདཔ་ཨིན། གསང་བའི་ལྡེ་མིག་ BFV དང་ relinearization key འདི་ resolver runtime ལུ་གནས་ཡོདཔ་ཨིན།

### BFV ཨེབ་གཏང་དང་ལག་ལེན་ཚུ་ {#bfv-encryption-and-operations}

\(m\) ཝང་ཡིག་འབྲུ་མང་གྲངས་ཅིག་ ཨེབ་ལྡེ་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འདི་གིས་ ChaCha20 RNG ལས་གཞན་གཅིག་བཙུགསཔ་ཨིན།

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

བརྟག་དཔྱད་འདི་ \(u,e_1,e_2 \in \{-1,0,1\}^n\) དང་རྩིས་སྟོནམ་ཨིན།

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

ཨེབ་གཏང་ཡིག་འདི་ \(c=(c_0,c_1)\) ཨིན།

དབྱེ་ཁག་གི་ཐད་ལུ་ homomorphic addition འདི་འབདཝ་ཨིན།

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

ཀི་པེན་ཊེཀསི་ scalar \(\alpha\) གྱངས་ཁ་ ༠ གི་འགྱུར་བཅོས་རྐྱངམ་ཅིག་ \(c_0\) ལུ་སྣོན་འབད་ནི།

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

ཨང་གཉིས་ཆ་ར་ལུ་ ཝང་ཊེཀསི་ཊཱལ་ \(\alpha\) ཀྱིས་ལྡནམ་བཟོ་ནི་:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

ཨང་ཡིག་གཉིས་ཀྱི་དོན་ལུ་ \(c=(c_0,c _1)\) དང་ \(d=(d_0,d_1) \), ཨང་ཡིག་གི་ཨང་གྲངས་འདི་ འགོ་དང་པ་ ཨང་གྲངས་ ༣ གི་ཨང་ཡིག་ཅིག་རྩིས་ཏེ་ ཀའི་ཨང་གྲངས་རེ་ལུ་ \(t/q\) ལུ་རྒྱབ་སྐྱོར་འབདཝ་ཨིན།:

$$
\tilde c_0 = \left\lfloor \frac{t(c_0 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_1 =
\left\lfloor \frac{t(c_0 d_1 + c_1 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_2 = \left\lfloor \frac{t(c_1 d_1)}{q} \right\rceil \bmod q
$$

གོང་གི་ཐོན་སྐྱེད་ཚུ་ག་ར་ \(R_q\)ནང་ལུ་ ནེ་ག་སི་ཀཱལིག་ ཅ་ལ་གྱི་ཐོན་སྐྱེད་ཚུ་ཨིན། འདི་གི་ཤུལ་ལས་ \(\tilde c_2\) འདི་ གཞི་རྟེན་-\(B\) ལྡན་གྲངས་སྦེ་བརླག་གཏང་ནུག

$$
\tilde c_2 = \sum_j B^j u_j
$$

ཡང་བསྐྱར་ཕྲང་སྒྲིག་འབདཝ་ཨིན།

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

གྲུབ་འབྲས་དེ་ཡང་ སྦྲགས་ཡིག་ཆ་གཉིས་ཆ་ར་ BFV ཨིན་ཨིན།

### ངོས་འཛིན་ཨེབ་གཏང་ཡིག་སྣོད་ ཤོག་སྒྲིལ་ {#identifier-ciphertext-envelope}

ངོས་འཛིན་སྣོད་ byte string:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

འདི་ scalar slots ལུ་ code འབདཝ་ཨིན།

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

དེ་ལས་ལྷག་ལུས་ཀྱི་ས་སྒོ་ཚུ་ ༠ ལས་ ༡ ཚུན་ `max_input_bytes + 1` ཨིན། ས་གནས་ཀྱི་ས་སྒོ་རེ་རེ་ལུ་ coefficient-zero plaintext polynomial \([m_i]\) སྦེ་སྦྲེལ་འབདཝ་ཨིན། སྣུམ་འཁོར་རེ་ནང་གི་སྦྲེལ་གྱི་སོན་འདི་:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

སྦྲགས་ཡོད་པའི་ ངོས་འཛིན་ཡིག་གཟུགས་འདི་:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

འདི་ནང་ལུ་ \(M=\mathrm{max\_input\_bytes}\) ཨིན།

### BFV ཨ་ཕི་ནེཌ་གི་རྒྱབ་ཐིག་ {#bfv-affine-backend}

`bfv-affine-sha3-256-v1`གི་དོན་ལུ་ རྒྱུན་སྐྱོང་དུས་ཚོད་འདི་འགོ་དང་པ་ BFV གི་ལྡེ་མིག་གི་རྒྱུ་རྫས་ཚུ་ \(s\) དང་ \(A\) ལས་བཏོན་དགོཔ་ཨིན། འབྱུང་འབབ་ཡོད་མི་ མི་མང་གི་ཚད་གཞི་དེ་ ལྕགས་ཐག་ནང་ལུ་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ མི་མང་གི་ཚད་འཛིན་ཚུ་དང་འདྲན་འདྲ་སྦེ་གནས་དགོ།

རྒྱུགས་ཀྱི་ཐིག་ཚད་འདི་:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

འ་ནི་དོག་མ་ལས་ དུས་རྒྱུན་གྱི་དཔེ་སྟོན་ཚུ་, modulo \(t\), 32-row affinine circuit:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

འདི་ནང་ལུ་ \(m_i\) གིས་ གསལ་བཀོད་འབད་ཡོད་པའི་ ངོས་འཛིན་གྱི་ས་སྒོ་ཚུ་ཨིན། Homomorphically གྱིས་ codetext གི་ནང་འཁོད་ལུ་གོང་ཚད་འདི་རང་རྩིས་འབདཝ་ཨིན།

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Resolver གིས་ \(C_j\)རེ་རེ་ལུ་ dekrypts བཏོན་དོ་ཡོདཔ་ད་ ཤུལ་མའི་ plaintext coefficients ཆ་མཉམ་འདི་ zero ཨིན་ཟེར་ དགོངསམ་ཨིན། coefficient-zero values འདི་ bytes ལུ་བསྒྱུར་བཅོས་འབདཝ་ཨིན། དེ་ལས་ form:

$$
O=(y_0,\ldots,y_{31})
$$

འདི་གི་ཤུལ་ལས་:

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{affine\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{affine\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_id})
$$

### BFV ཌོག་ཊར་ཨེབ་གཏང་འབད་ཡོདཔ་ཨིན། {#bfv-programmed-backend}

`bfv-programmed-sha3-256-v1`གི་དོན་ལུ་ སྒེར་གྱི་བརྡ་དོན་ཚུ་ནང་ BFV ངོ་རྟགས་ཀྱི་སྦྲེལ་རྐྱང་གི་བརྡ་དོན་ཚུ་ དེ་ལས་སྦ་བཞག་པའི་ལས་རིམ་ཅིག་ སྦྲེལ་འབད་ཡོདཔ་ཨིན།

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

ད་ལྟོའི་ RAM-FHE འདྲ་བཤུས་འདི་:

|ས་ཁོངས་ |གནས་གོང་ |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

Torii ལུ་ བཏང་མི་ Plaintext ནང་ཐིག་འདི་ ལག་ལེན་མ་འཐབ་པའི་ཧེ་མར་ BFV ཤོག་སྒྲིལ་ནང་རང་ ཨེབ་གཏང་འབད་ཡོདཔ་ཨིན། འདི་གི་དོན་ལུ་ Server-side encryption གི་དོན་ལུ་ deterministic seed ནི་:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

ནང་འཁོད་ལས་ སྦྲགས་ཡོད་པའི་ནང་ཐོ་བཀོད་འབད་ནིའི་དོན་ལུ་ resolver གིས་ ངོས་འཛིན་གྱི་ཁེབས་འདི་ dekrypts དང་ སླར་ཡང་ code དེ་ executing གི་ཧེ་མར་ deterministic envelope ལུ་སླར་ལོག་འབདཝ་ཨིན། འདི་ canonicalization གིས་ receipt hashes འདི་ semantically equal BFV ciphertext ཚུ་ནང་ལུ་གནས་བརྟན་སྦེ་བཞག་ཡོདཔ་ཨིན།

འགོ་ཐོག་གི་ སྦྲགས་ཡོད་པའི་ དྲན་ཐོའི་ལམ་འདི་:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

ཕྲང་ལམ་༣༢ གི་གྲལ་ལས་རེ་རེའི་དོན་ལུ་ Runtime Sample \(r_j \in [0,t)\) ཚུ་བཏོན་ཞིནམ་ལས་ BFV ཨེབ་རྟ་ཡིག་འབྲུ་ \(r_j\) གསོག་འཇོག་འབདཝ་ཨིན། དེ་ལས་སྦ་བཞག་མི་ ལས་རིམ་འདི་གིས་ ཨེབ་རྟ་བཀོད་ཡོད་པའི་ ཐོ་བཀོད་དང་ ཨེབ་གཏང་ཅན་གྱི་ དྲན་ཐོའི་ཐོག་ལས་ ལག་ལེན་འཐབ་ཨིན།

|བརྡ་སྟོན་ |རྩིས་རིག་པ་ |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftrow \operatorname{Enc}(a) \) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), དེ་ལས་བསྐྱར་ཕྲང་སྒྲིག་ |
|`SelectEqZero(dst, cond, z, nz)` |\(R_{\mathrm{cond}}\) སླར་ལོག་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ \(R_z\) གདམ་ཁ་རྐྱབ་པ་ཅིན་ ༠ ཡང་ན་ \(R_{nz}\) |
|`Output(src)` |\(R_{\mathrm{src}}\) འདི་ཐོན་སྐྱེད་ཐོ་ཡིག་གི་ནང་ཐོ་བཀོད་འབད་ནི་ཨིན། |

བརྡ་སྟོན་ཐིག་ཁྲམ་མཇུག་བསྡུ་ཞིནམ་ལས་ resolver གིས་ output register ཆ་མཉམ་འདི་ decrypts བསྒྱུར་བཅོས་འབད་ཞིནམ་ལས་ coefficient zero to a byte ལུ་བསྒྱུར་བཅོས་འབད་ཞིནམ་ད།

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

སྤྱིར་བཏང་བཀོད་སྒྲིག་འབད་ཡོད་པའི་ backend hashs འདི་ཚུ་ཨིན།

$$
\mathrm{opaque\_hash} =
H(D_{\mathrm{program\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash}_{\mathrm{program}} =
H(D_{\mathrm{program\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_hash})
$$

ཨེན་པི་ཊི་ཨེམ་ཨེཕ་ཌ་ལཱསི་ (default programmed identifier tape) ནང་ལུ་ ཨེན་པུཊ (input slots) ༦༤ ཡོདཔ་ཨིན། ཨེན་པུབ་རེ་གི་དོན་ལུ་ \(i\) འདི་གིས་ ཨེན་པོཊ (in input slot) བསྡུ་སྒྲིག་འབད་ཞིནམ་ལས་ ཨེན་པུར་ (memory lane) \(i \bmod 32\) བསྡུ་བསྒྱོམ་འབད་ཞིནམ་ལས་ མཐའན་མཇུག་གི་གྲུབ་འབྲས་འདི་འཐོན་འོང་།

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### གྲུབ་འབྲས་དང་ ཐོབ་ཐངས་ཚུ་ {#output-hashes-and-receipts}

སྤྱིར་བཏང་གི་ RAM-LFE ཕྱིར་བཏོན་ཡི་གུ་འདི་ raw output ལུ་རྟགས་མ་བཙུགས་པར་ output hash ལུ་རྟགས་བཀོད་འབདཝ་ཨིན།

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE གི་ལག་ལེན་གྱི་ཐོ་བཀོད་ཚུ་གི་དོན་ལུ་ འབྲེལ་གཏོགས་འབད་ཡོད་པའི་ གནད་སྡུད་འདི་ ཀ་ནོ་ནི་ཀཱན་གྱི་ ལས་རིམ་ངོ་རྟགས་ཅན་ བའི་ཊི་ཨིན།

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

ཡིག་སྣོད་ཡིག་སྣེ་ལེན་གྱི་ལག་འཁྱེར་འདི་:

$$
R =
(\mathrm{program\_id},
\mathrm{program\_digest},
\mathrm{backend},
\mathrm{verification\_mode},
\mathrm{output\_hash},
\mathrm{associated\_data\_hash},
\mathrm{executed\_at\_ms},
\mathrm{expires\_at\_ms})
$$

`signed` གནས་སྟངས་གི་དོན་ལུ་:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

དབྱེ་དཔྱད་དེ་ `resolver_public_key` ལུ་རྟགས་མཚན་བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ བཏང་ཐོ་བཀོད་འདི་ ཆ་མེད་གཏང་དོ་ཡོདཔ་མ་གཏོགས་ འ་ནི་ཆ་མཉམ་འདི་ནང་ལུ་:

$$
R.\mathrm{program\_id} = \mathrm{policy.program\_id}
$$

$$
R.\mathrm{backend} = \mathrm{policy.backend}
$$

$$
R.\mathrm{verification\_mode} = \mathrm{policy.verification\_mode}
$$

$$
R.\mathrm{program\_digest} =
\mathrm{policy.public\_parameters.hidden\_program\_digest}
$$

$$
R.\mathrm{associated\_data\_hash} =
H(N(\mathrm{policy.program\_id}))
$$

འབའ་མི་ཚུ་གིས་ `output_hex` བཏང་པ་ཅིན་ བདེན་དཔྱད་འབད་མི་དེ་ཡང་:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` ཐབས་ལམ་གྱི་ཐད་ལུ་ སྒྲུབ་རྟགས་འདི་ ངོས་འཛིན་གི་ཚབ་ལུ་ གྲུབ་རྟགས་ཀྱི་ཁེབས་ཅིག་བཀལཝ་ཨིན། དངོས་ལེན་དཔྱད་ནི་དེ་ གྲུབ་རྟགས་རྒྱབ་ཕྱོགས་, ས་ཀིཊི་ཨེམ་ཌི་ (circuit id), མི་མང་ནང་འོང་ཐོ་བཀོད་འཆར་གཞིའི་ཧེཤ་ (public input schema hash) ཚུ་དང་ བརྟག་ཞིབ་ལྡེ་མིག་ (verifying-key hash) དེ་ལས་ གསལ་སྟོན་འབད་ཡོད་པའི་ མི་མང་གི་གནས་སྟངས་ཚུ་གིས་ གྲུབ་རྟགས་བརྟག་དཔྱད་འཕྲུལ་ཆས་ metadata དང་ ཨེབ་གཏང་ཐོ་བསྡུད་ (receipt payload hash) འདི་འདྲ་མཉམ་ཨིན་ཟེར་བརྟག་དཔྱད་འབདཝ་ཨིན། འཁྲུན་ཆོད་འདི་:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

སྤྱིར་བཏང་བརྡ་དོན་འདི་ ཨེ་རེ་གཅིག་ཨིན་པའི་ ཀི་ལོ་མི་ཊར་༤ ཨིན། ཀི་ལོ་མ་ \(j\) འདི་ནང་ Byte \(h_{8j}\ldots h_{8j+7}\) ཡོད་པའི་ཤུལ་ལུ་ Null byte ༢༤ ཡོདཔ་:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### ངོས་འཛིན་འབད་ནིའི་འཆར་གཞི་ {#identifier-projection}

ངོས་འཛིན་ཐིག་ཁྲམ་འདི་ ལག་ལེན་འཐབ་མི་ backend `opaque_hash` འདི་ user-facing opaque account identifier སྦེ་ལག་ལེན་འཐབ་མི་ཨིན། འདི་གིས་ RAM-LFE output hash འདི་ identifier-specific domains གི་ནང་འཁོད་ལུ་བཏོན་འབདཝ་ཨིན།

$$
\mathrm{opaque\_id}_{\mathrm{id}} =
H(D_{\mathrm{id\_opaque}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash})
$$

$$
\mathrm{receipt\_hash}_{\mathrm{id}} =
H(D_{\mathrm{id\_receipt}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash}
\parallel \mathrm{opaque\_id}_{\mathrm{id}})
$$

`IdentifierResolutionReceipt` གིས་ མཐོ་ཚད་གི་ཁེ་ཕན་གྱི་ཐོ་བཀོད་གུ་རྟགས་བཀོད་འབདཝ་ཨིན།

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

ངོས་འཛིན་གྱི་ཡི་གུ་གི་མིང་ཐོ་ཚུ་:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` གིས་ ངོས་ལེན་དེ་ ཆ་འཇོག་འབད་ཡོདཔ་ད་ རྟགས་མཚན་དང་ བདེན་ཁུངས་འདི་བདེན་པ་ཡིན་པའི་སྐབས་རྐྱངམ་གཅིག་ཨིན། RAM-LFE ལག་ལེན་འཐབ་ནིའི་ཅ་ལ་ནང་བཙུགས་ཏེ་ཡོད་མི་དེ་ བཀྲམ་སྟོན་འབད་ཡོད་པའི་ ལས་རིམ་གི་ སྲིད་བྱུས་དང་མཐུནམ་ཨིནམ་མ་ཚད་ `uaid` དང་ `account_id` འདི་ཡང་ བསྡུ་སྒྲིག་འབད་ནི་ལུ་ ཞུ་གཏུགས་འབད་ཡོདཔ་ཨིན།

## ལག་བསྟར་སྤྱོད་འབད་ཐངས་ {#execution-flow}

RAM-LFE སྤྱིར་བཏང་གི་ལག་ལེན་འདི་ འདི་བཟུམ་སྦེ་ཨིན།

1. གཞུང་སྐྱོང་དང་ ལས་འཛིན་གྱི་ཐོ་ཡིག་ `RamLfeProgramPolicy`
2. སྦྱིན་བདག་འདི་གིས་ སྲིད་བྱུས་འདི་ལག་ལེན་འཐབ་ཚུགས།
3. ཚོང་མགྲོན་པ་གིས་ Torii ལས་ གཞུང་གི་ལམ་ལུགས་ཀྱི་ བརྡ་བཀོད་ཚུ་ལྷག་ཚུགས།
4. འབུབ་འདི་གིས་ resolver ལུ་ ཐོ་བཀོད་ཡིག་སྣོད་ཅིག་རང་བཙུགསཔ་ཨིན།: plaintext `input_hex` ཡང་ན་ BFV སྦྲེལ་ཡོད་པའི་ཐོ་བཀོད་ཁེབས་འདི་ཨིན།
5. Runtime གིས་སྦ་བཞག་མི་ ལས་རིམ་འདི་བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` དེ་ལས་ `RamLfeExecutionReceipt` བཏོན་འབདཝ་ཨིན།
6. མཁན་པོ་ཡང་ན་རྒྱབ་ཕྱོགས་མཇུག་གིས་ བརྒྱུད་འཕྲིན་དེ་སྙན་བསྐྲུན་པའི་ སྲིད་བྱུས་དང་ཕྱདཔ་ད་ བརྒྱུད་འཕྲིན་འདི་ལོག་གཏོ `output_hex` གིས་ བརྒྱུད་འཕྲིན་གྱི་ `output_hash` ལུ་ཧེཤ་འབད་ཡོདཔ་ཨིན་ན་ལུ་བརྟག་དཔྱད་འབདཝ་ཨིན།
7. མཐོ་རིམ་གནས་ཚད་ཀྱི་བསླབ་བྱ་ དཔེར་ན་ `ClaimIdentifier` གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཡི་གུ་ཚུ་ ནང་བཙུགས་འབད་ནི་མེན་པར་ ཨེབ་གཏང་འབད་ཚུགསཔ་ཨིན།

```mermaid
flowchart LR
    client["Wallet or application"] --> policy["Read program policy"]
    policy --> input["Normalize and optionally encrypt input"]
    input --> torii["Torii RAM-LFE runtime"]
    torii --> eval["Hidden evaluator"]
    eval --> receipt["Output and execution receipt"]
    receipt --> verify["Client or ledger verifies receipt"]
    verify --> claim["Use receipt in higher-level flow"]
```

## ངོས་འཛིན་འབད་ནིའི་ སྲིད་བྱུས་ {#identifier-policies}

ངོས་འཛིན་ཅན་གྱི་ སྲིད་བྱུས་འདི་ RAM-LFE གི་ལག་ལེན་ངོ་མ་ཨིན། ཁོང་གིས་ སྤྱིར་བཏང་ལས་རིམ་གྱི་སྲིད་བྱུས་ཀྱི་གུ་ལུ་ ཚོང་འབྲེལ་གི་མིང་ཐོ་བཀོད་དང་ གནས་ཚད་ཅན་བཟོ་ནི་གི་ ཁྲིམས་ལུགས་བཙུགས་དོ་ཡོདཔ་ཨིན།

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "<POLICY_OWNER>",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "phone#team",
  owner = "<POLICY_OWNER>",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "phone#team")
```

ངོས་འཛིན་གྱི་ཐིག་ཁྲམ་ནང་ RAM-LFE བརྒྱུད་འཕྲིན་འདི་ལག་ལེན་འཐབ་ཐོག་ལས་:

- `policy_id`
- གསང་བའི་འགན་ཡིག་གིས་བཏོན་མི་ དྭངས་འཕྲོས་མེད་པའི་ངོ་རྟགས་འདི་
- ཚད་འཛིན་འབད་ཐངས་ `receipt_hash`
- རྩིས་ཁྲ་དེ་ UAID
- ཀ་ནོ་ནི་ཀཱན་གྱི་ `account_id`
- སྤྱིར་བཏང་ RAM-LFE ལག་ལེན་གྱི་འགན་ཁུར་

ལག་ལེན་པ་ཁ་ཐུག་གི་ འཛུལ་ཞུགས་ཀྱི་དོན་ལུ་ སྒེར་གྱི་ངོ་རྟགས་ཚུ་ལས་ ངོས་འཛིན་གྱི་མིང་སོ་སོ་སྦེ་བཞག་དགོ། ངོ་མཚན་འདི་ མི་མང་གི་མིང་ཨིན། གློག་འཕྲིན་ཨང་གྲངས་དང་ ཡོངས་འབྲེལ་ཁ་བྱང་ དེ་ལས་ འདི་བཟུམ་མའི་ གནས་གོང་ཚུ་ ངོ་རྟགས་ཀྱི་ སྲིད་བྱུས་དང་ འཁྲུན་ཆོད་ཚུ་གི་ཐོག་ལས་ རྒྱུན་འགྲུལ་འཐབ་དགོཔ་ཨིན་མས།

## Torii འགྲུལ་ལམ་ཚུ་ {#torii-routes}

གློག་འཕྲིན་ཁ་ཐུག་གི་ལམ་གྱི་བཟའ་ཚན་འདི་ རྩ་སྒྲིག་འབད་ཚརཝ་ད་ Torii གིས་ RAM-LFE དང་ ངོ་རྟགས་བཀོད་མི་ཆ་རོགས་ཚུ་ལུ་ གསལ་སྟོན་འབདཝ་ཨིན།

|ལམ་ཐིག་ |དམིགས་གཏད་ |
| --- | --- |
|`GET /v1/ram-lfe/program-policies` | གྲོས་བསྡུར་འབད་མི་ཚུ་དང་ གྲོས་བསྡུས། RAM-LFE ལས་རིམ་གྱི་ སྲིད་བྱུས་དང་ མི་མང་གི་ལག་ལེན་འབད་ཐངས་ཀྱི་ metadata. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |`input_hex` ཡང་ན་ `encrypted_input`ལས་ ལས་རིམ་གཅིག་ལག་ལེན་འཐབ་སྟེ་ ཨེབ་གཏང་འབད་ཞིནམ་ལས་ ཕྱིར་བཏོན་ཧེཤ་ཚུ་དང་ མངའ་སྡེའི་མེད་ཐོ་བཀོད་ཅིག་སླར་ལོག་འབདཝ་ཨིན། |
|`POST /v1/ram-lfe/receipts/verify` |ཁྱོད་ཀྱིས་ `RamLfeExecutionReceipt` འདི་གསལ་བསྒྲགས་འབད་མི་ སྲིད་བྱུས་དང་ཕྱདཔ་ད་བརྟག་དཔྱད་འབད་ཞིནམ་ལས་ གདམ་ཁ་རྐྱབ་པ་ཅིན་ `output_hex` དང་ `output_hash` ཚུ་བསྡོམས་གཏང་དགོ།|
|`GET /v1/identifier-policies` |ངོས་འཛིན་གྱི་སྲིད་བྱུས་ཚུ་ ཐོ་བཀོད་འབད་ཐབས། སྒྲིག་འཇུག་གི་གནས་སྟངས་དང་ resolver keys དེ་ལས་ encrypted-input metadataཚུ་ |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |ལག་ལེན་འཐབ་མི་ཅིག་གིས་ `ClaimIdentifier`ནང་ལུ་བཙུགས་ཚུགས་པའི་ བཏང་ཐོ་བཀོད་འདི་བཏོན་དགོ།|
|`POST /v1/identifiers/resolve` |གཞི་སྒྲིག་གི་རྩིས་ཁྲ་ལུ་ ངོས་འཛིན་ཡིག་སྣོད་ཚུ་སེལ་འཐུ་འབད་ཐབས།|
|`GET /v1/identifiers/receipts/{receipt_hash}` |དབྱེ་ཞིབ་དང་ རྒྱབ་སྐྱོར་ལག་ཆས་ཚུ་གི་དོན་ལུ་ འཁྲུན་ཆོད་ཧེཤ་གི་ཐོག་ལས་ ངོས་འཛིན་འབད་ནིའི་ཁས་ལེན་དེ་ བརྟག་དཔྱད་འབད་ནི་ཨིན། |

འ་ནི་ལམ་ཚུ་དང་མ་རྐྱབ་པའི་ཧེ་མར་ དམིགས་གཏད་ལྡེ་མིག་གི་ `/openapi` ཡང་ན་ `/openapi.json` ཡིག་ཆ་ཚུ་བརྟག་དཔྱད་འབད་ཚུགས། གྲུབ་འབྲས་འདི་ node build དང་ network profile ལུ་བསྟུན་ཨིན།

## Node Runtime {#node-runtime}

Torii གྱི་ བྱ་རིམ་ནང་ཡོད་པའི་ runtime RAM-LFE འདི་ `torii.ram_lfe.programs[*]` གི་འོག་ལུ་ གཞི་སྒྲིག་འབད་ཡོདཔ་ད་ keyed by`program_id` གིས་ གཞི་སྒྲིག་འབད་ཡོདཔ་ཨིན། ལས་རིམ་སོ་སོ་ཅིག་གིས་ on-chain སྲིད་བྱུས་གི་ ཁས་བླངས་དང་བསྟུན་ཏེ་ བཏང་དགོཔ་ཨིནམ་མ་ཚད་ འཁྲུན་ཆོད་ཚུ་བརྟག་དཔྱད་འབད་ནི་དང་ བདེན་ཁུངས་བཀལ་ནིའི་དོན་ལུ་ དགོས་མཁོ་ཅན་གྱི་ runtime ཐོན་སྐྱེད་ཚུ་ གྲོང་གསལ་སྦེ་བྱིན་དགོ། ངོས་འཛིན་ལམ་ལུགས་ཚུ་གིས་ དུས་ཡུན་དེ་ཡང་ ལོག་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ལས་ ངོས་འཛིན་འཕྲུལ་ཆས་སེལ་འཐུ་འབད་ནིའི་ ས་ཁོངས་སོ་སོ་ཅིག་ དགོཔ་མེདཔ།

སྲིད་བྱུས་ནང་ ཐོ་བཀོད་འབད་ནི་འདི་ རང་གིས་རང་ལུ་མ་ལངམ་ཨིན། དམིགས་གཏད་གྱི་ཨེབ་ཐག་དེ་ཡང་ རུ་ཊ་གི་བཟའ་ཚན་བཏོན་དགོཔ་ཨིནམ་མ་ཚད་ ལས་རིམ་ཚུ་གི་དོན་ལུ་ འགོ་བཙུགས་ནིའི་དུས་ཚོད་དང་བསྟུན་པའི་ གནད་དོན་ཡོད་དགོཔ་ཨིན།

## ལས་འགུལ་གྱི་སྲུང་སྐྱོབ་ལམ་ {#operational-guardrails}

- སྲིད་བྱུས་ཚུ་ ཐོ་བཀོད་འབད་མ་ཚུགསཔ་ བཟོ་ནི་ དེ་ལས་ མི་སེར་གྱི་བརྡ་དོན་ཚུ་ བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ དེ་ཚུ་སླར་ལོག་འབདཝ་ཨིན།
- གནས་གོང་བརྟག་དཔྱད་འབད་མི་ གསང་བ་ཚུ་སྦ་བཞག་ནི་ resolver signing keys དང་ BFV གསང་བའི་ཡིག་སྣོད་ཚུ་ནང་ ཡིག་སྣོད་, ཐོ་བཀོད་, བྱ་སྟབས་མ་བདེཝ་ཚུ་དང་ client bundles ནང་།
- རྩིས་ཁྲ་གི་མིང་དང་ ཕྱིར་ཚོང་གྱི་བརྡ་དོན་ དེ་ལས་ ལས་རིམ་ཚུ་ ཡང་ན་ འཛམ་གླིང་རྒྱལ་ཁབ་ཀྱི་ ས་ཁོངས་ཚུ་ནང་ རིན་གོང་ཅན་གྱི་ ངོ་རྟགས་མ་བཙུགས་དགོ།
- ཁྱོད་ཀྱིས་ SDK གིས་ བདེན་དཔྱད་འབད་མི་ཅིག་བཏོན་པའི་སྐབས་ལུ་ མཐོ་རིམ་གནས་ཚད་ཀྱི་བསླབ་བྱ་ཚུ་མ་བཏང་བའི་ཧེ་མར་ དངུལ་ཁང་གི་ངོས་ལེན་ཚུ་ ཌོག་ཊར་གྱི་ཁ་ཐུག་ལས་ བརྟག་ཞིབ་འབད་བྱིན་དགོ།
- དུས་ཡུན་ཚང་བའི་ས་སྒོ་ཚུ་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ རིན་བསྡུར་མ་དངུལ་འདི་ དུས་རྒྱུན་གྱི་དོན་ལུ་ ལག་ལེན་མ་འཐབ་པར་སྡོད་འོང་།
- ལས་རིམ་གསརཔ་ ཡང་ན་ ངོ་རྐྱང་གི་སྲིད་བྱུས་ཅིག་ ཐོ་བཀོད་འབད་ཞིནམ་ལས་ དུས་རྒྱུན་གྱི་སྲིད་བྱུས་དེ་ སེལ་འཐུ་འབད། དེ་ལས་ འོང་འབབ་གསརཔ་དེ་ཐོན་པའི་བསྒང་ལས་ སྲིད་བྱུས་རྙིངམ་འདི་སེལ་འཐུ་འབད།

## འབྲེལ་བའི་གནད་དོན་ཚུ་ {#related-topics}

- [སྒེར་གྱི་གནས་སྡུད་ཀྱི་དོན་ལུ་རྒྱབ་སྐྱོར་གྱི་འཐུས་](/dz/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii མཐའ་མཇུག་གི་ཐོ་བཀོད་](/dz/reference/torii-endpoints.md#app-and-sora-route-families)
- [རྣམ་རྟོག་ཅན་གྱི་ཚོང་འབྲེལ་ཚུ་](/dz/blockchain/anonymous-transactions.md)
