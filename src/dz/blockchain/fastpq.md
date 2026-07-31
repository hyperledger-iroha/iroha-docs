---
translation_locale: dz
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ འདི་ Iroha གིས་ བཙག་འཐུ་འབད་ཡོད་མི་ལག་ལེན་གྱི་གྲུབ་འབྲས་ཚུ་གི་དོན་ལུ་ STARK སྟོན་ཐོ་བཀོད་ལམ་ཨིན། འདི་གིས་རྒྱུན་ཆད་ཅན་གྱི་ལག་ལེན་གྱི་ལག་ལེན་དང་མཐུན་རྐྱེན་ཚུ་ བསྒྱུར་བཅོས་མི་འབདཝ་ཨིན། ལག་ལེན་དེ་ ཧེ་མ་བཟུམ་སྦེ་ར་ ISI, IVM དང་ Sumeragi གི་ཐོག་ལས་ལག་ལེན་འཐབ་དོ་ཡོདཔ་མས། FastPQ གིས་ དངོས་གྲུབ་ཅན་གྱི་ལག་ལེན་གྱི་དཔང་པོ་བཙུགས་ཏེ་ རྒྱབ་སྐྱོར་འབད་ཡོད་པའི་གྲུབ་འབྲས་ཚུ་ གྲུབ་རྟགས་ཀྱི་ བཀྲམ་སྤེལ་འབད་འོང་།

ད་ལྟོའི་མགྲོན་སྡེ་མཐུན་སྒྲིལ་ནང་ལུ་ མང་ཤོས་ལམ་གསུམ་ཡོདཔ་ཨིན།

- བཀྲམ་སྤེལ་གྱི་སྐབས་ལུ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ གྱངས་ཁ་ཅན་གྱི་ རྒྱུ་དངོས་ཀྱི་གནས་གོང་ཚུ་
- Nexus བརྟག་ཞིབ་འབད་ཡོད་པའི་ ཕྲང་ལམ་འགྲེམ་སྟོན་ཐིག་ whose AXT proof envelope bears a FastPQ binding
- SCCP གསལ་བའི་བརྡ་དོན་བརྟག་དཔྱད་འཕྲུལ་ཆས་ཚུ་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལུ་ སྒོ་ཕྱེ་ཡོད་པའི་བརྟག་དཔྱད་ཁེབས་ནང་ FastPQ ཕྲང་རྟགས་བཀབ་དགོ།

## འཛོམ་དཔང་འབད་ནི་གི་ལམ་ བཏོན་གཏང་ {#transfer-witness-path}

ཐད་ཀར་དུ་ཨང་གྲངས་གནས་སྤེལ་གྱིས་ སྒྲིག་གཞི་ཚུ་ བསྒྱུར་བཅོས་འབད་བའི་སྐབས་ ཡིག་གཟུགས་གནས་སྤེལ་གྱི་ཡིག་འབྲུ་བཟོ་ཡོདཔ་ཨིན། ཡིག་འབྲུ་ཚུ་:

- གཞི་རྟེན་རྩིས་ཁྲ། འགྲོ་འགྲུལ་གྱི་རྩིས་ཁྲ། རྒྱུ་དངོས་གི་འགྲེལ་བཤད་དང་ དངུལ་ཕོགས་ཚུ་
- བཏང་མི་དང་ སྤྲོད་མི་ཚུ་གི་མཐུན་རྐྱེན་ཚུ་ བཏང་མ་ཚར་བའི་ཧེ་མ་དང་ དེ་གི་ཤུལ་ལས་
- བཀྲམ་སྤེལ་གྱི་དོན་ལུ་ ལག་ལེན་འཐབ་མི་ ཕྱིར་ཚོང་གི་འཛུལ་སྒོ་གི་ hash
- རྩིས་སྤྲོད་འབད་མི་རྩིས་ཁྲ་ནང་ལས་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་དབང་འཛིན་གྱི་ཐོ་ཡིག་
- single-delta transcripts གི་དོན་ལུ་ Poseidon digest

བཀྲམ་སྤེལ་གྱི་དོན་ལས་ ཨང་གྲངས་མང་ཤོས་ཀྱི་ཌེ་ལཊ་ཚུ་ཡོད་པའི་ ཡིག་འབྲུ་གཅིག་ལག་ལེན་འཐབ་ཨིན། འདི་འབདཝ་ལས་ ཌེ་ལཱཊ་གཅིགཔ་གི་ Poseidon ཌི་ཇི་ཨེསི་ཌོན་འདི་མེད་ཚུགས།

བཀྲམ་སྤེལ་མཇུག་བསྡུ་བའི་སྐབས་ Iroha གིས་ ཨེན་ཊི་པིནཊི་ཧེཤ་གི་ཐོག་ལས་ ཡིག་འབྲུ་འདི་སྡེ་ཚན་བཟོ་དོ་ཡོདཔ་ཨིན། འདི་འབདཝ་ལས་ ལག་ལེན་གྱི་དཔང་པོ་གིས་ ཨེབ་གོང་ཡིག་འབྲུ་དང་ FastPQ སྦྲེལ་ཐིག་གཉིས་ཆ་ར་ གྲ་སྒྲིག་འབད་ཡོདཔ་ཨིན།

བསྒྱུར་བཅོས་ཀྱི་ཌེ་ཊ་རེ་ལུ་ འབྲེལ་མཐུད་གྲལ་རིམ་གཉིས་འགྱོ་དོ་ཡོདཔ་ཨིན།

|གྲལ་ཐིག་ |ལྡེ་མིག་གི་བཟོ་རྣམ་|སྔོན་གོང་ཚད་ |གནས་གོང་མཐར་ཐུག་ |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|བཀྲམ་སྤེལ་འབད་མི་ |`asset/<asset-definition>/<source-account>` |བཏང་མི་གི་མཐུན་སྒྲིལ་ སྔོན་ལུ་ |བཏང་མི་གི་དངུལ་རྩིས་ |
|སྐྱིན་འགྲུལ་ཐོབ་མི་ |`asset/<asset-definition>/<destination-account>` |འཁྲུན་ཆོད་མ་གྲུབ་པའི་ཧེ་མ་ |འཁྲུངས་སྐར་རྩིས་ཚད། |

ཨང་གྲངས་ཀྱི་གོང་ཚད་ཚུ་ དངོས་གྲུབ་ཅན་གྱི་ཨང་གྲངས་ཅིག་ལུ་ རང་བཞིན་གནས་སྟངས་ནང་བསྒྱུར་བཅོས་འབདཝ་ཨིན། FastPQ བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལས་གོང་ཚད་འདི་ ཆ་མེད་གཏང་པ་ཅིན་ གདམ་ཁ་རྐྱབ་མི་ བཅུ་མའི་ཐིག་ཚད་ནང་ལུ་ ཁེ་ཕན་མེད་པའི་ `u64` སྦེ་ངོ་སྟོན་མི་ཚུགས་པས།

## མི་མང་གི་ནང་དོན་ཚུ་ {#public-inputs}

FastPQ བསྒྱུར་བཅོས་ཀྱི་སྡེ་ཚན་རེ་ལུ་ མི་མང་གི་ནང་དོན་ཚུ་ཡོདཔ་ལས་ དཔྱད་ཡིག་དེ་ བཀྲམ་སྤེལ་དང་ལག་ལེན་གྱི་གནས་སྟངས་ལུ་ འབྲེལ་མཐུད་འབད་ཡོདཔ་ཨིན།

|ནང་ཐིག་ |དོན་དག་ |
| ------------- | --------------------------------------------------------------- |
|`dsid` |ཌེ་ཊ་ས་པི་སི་གི་ ངོ་རྟགས་འདི་ ཨེན་ཌི་ཡཱན་ཨ་ཙི་ཅིག་སྦེ་ཨེབ་གཏང་འབད་ཡོདཔ་ཨིན།|
|`slot` |སྦྲག་བཟོ་སྐྲུན་གྱི་དུས་ཚོད་འདི་ ན་ནཱོ་དི་ཀི་ལོ་མི་ཊར་ལུ་བསྒྱུར་བཅོས་འབདཝ་ཨིན།|
|`old_root` |ཕམ་གི་མངའ་སྡེའི་རྩ་བ་འདི་ ཁྲིམས་སྲུང་འགག་པ་ལུ་ འཛོམ་དཔང་འབད་མི་ནང་ལས་ འབྱུང་ཡོདཔ་ཨིན།|
|`new_root` |ཁྲིམས་སྲུང་འགག་པ་གིས་ འཁྲུན་ཆོད་འབད་བའི་སྐབས་ འཛོམ་དཔང་འབད་མི་ལུ་བརྟེན་ |
|`perm_root` |ཤུགས་ཅན་གྱི་ འགན་འཁྲི་གི་ཆོག་ཐམ་ལུ་ Poseidon ཁས་བླངས་ |
|`tx_set_hash` |Hash ཌའི་ལོག་ལག་ལེན་དང་དུས་རྒྱུན་ཨེབ་ཐོ་བཀོད་འབད་ཐངས་ hashes |

host གིས་ `fastpq-lane-balanced` འདི་འདི་ kanonic parameter set སྦེ་ལག་ལེན་འཐབ་ཨིན།

## རྩིས་ཀྱི་རྣམ་གཞག་ {#mathematical-model}

འ་ནི་ཐིག་ཁྲམ་འདི་ ད་ལྟོའི་ Rust བརྟག་ཞིབ་དང་བརྟག་དཔྱད་འབད་མི་དེ་གིས་ ལག་ལེན་འཐབ་མི་ རྩིས་རྩིས་དེ་ གསལ་བཀོད་འབདཝ་ཨིན། འོག་གི་ Field Operations ཚུ་ Goldilocks prime field གི་གུ་ལུ་ཨིན།

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། `F` ས་ཞིང་གི་འགན་ཁུར་ཚུ་གི་དོན་ལུ་ ཨོསི་པོན་ཆུའི་རྒྱ་ཚད་འདི་ `t = 3`, བརྒྱ་ཆ་ `r = 2`, དང་ ཐོན་ཤུགས་ `1`. ཧེཤ་འདི་གིས་ ཚད་རིམ་-2 གི་སྦྲག་ཚུ་ནང་ ས་ཁོངས་ཀྱི་要素ཚུ་ མུ་མཐུད་འབད་ཞིནམ་ལས་ ས་ཁོངས་ཀྱི་ཨེ་ལི་མེ་ཊཱོན་གཅིག་ མཐུད་བཀལཝ་ཨིན། `1` མཐའན་མཇུག་གི་ བསྒྱུར་བཅོས་མ་འབད་གོང་ལུ་:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Byte strings འདི་ 7-byte ཆུང་ཀུ་-endian ཡན་ལག་ཚུ་ནང་སྦ་བཞག་ཡོདཔ་ལས་ ཡན་ལག་རེ་ `p` གི་འོག་ལུ་ཨིན།

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Domain-separated field hashes འདི་འདི་:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

hashes གི་དོན་ལུ་ byte-domain digests ལས་འགོ་བཙུགསཔ་ད་, FastPQ གིས་ first eight little-endian bytes འདི་ field ལུ་ mapps:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

འ་ནཱ་ `Hash` གིས་ Iroha གི་ `iroha_crypto::Hash::new` ཟེར་མི་འདི་ Blake2bVar གྱི་ 32-byte ཌི་ཇི་ཨེསི་ཨིནམ་མ་གཏོགས་ དཔེར་ན་ formula ཅིག་གིས་ Poseidon2 ཡང་ན་ SHA-256 ལུ་ གསལ་ཏོག་ཏོ་སྦེ་མིང་བཏགས་མ་བྱིན་པར་ཨིན།

### Field Arithmetic {#field-arithmetic}

འདི་ཚུ་ Rust code གིས་ field elementཚུ་ canonicalསྦེ་ངོ་ཚབ་འབདཝ་ཨིན། `u64` གནས་གོང་ཚུ་ནང་ `[0,p)`. ཡར་སེང་དང་མར་ཕབ་ནི་ འདི་ཚུ་ཨིན།

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

ཨང་གྲངས་འདི་གིས་ འགོ་དང་པ་ བི་ཊ་༡༢༨ གི་ཐོན་སྐྱེད་རྩིས་སྟོནམ་ཨིན།

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks མར་ཕབ་དེ་ཤུལ་ལས་ ངོ་རྟགས་འདི་ལག་ལེན་འཐབ་ཨིན།

$$
2^{64}\equiv2^{32}-1\pmod p
$$

གལ་སྲིད་:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

དེ་ལས་ reducer གིས་རྩིས་སྟོནམ་ཨིན།

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

ལག་ལེན་འདི་གིས་ `p` གྲུབ་འབྲས་འདི་ ཀ་ནོ་ནི་ཀཱལ་འབད་ནི་ཚུན་ཚོད་ གནས་སྟངས་ཅན་སྦེ་བསྡོམས་ ཡང་ན་ མར་ཕབ་འབདཝ་ཨིན། མཚམས་སྦྱོར་འབད་ཡོད་པའི་ཆ་མཉམ་ཚུ་ དཔེར་ན་ balance deltas འདི་ཚུ་ནང་བཙུགས་ཡོདཔ་ཨིན།

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 བསྒྱུར་བཅོས་ {#poseidon2-permutation}

Poseidon2 གི་ permutation state འདི་འདི་ཨིན།

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

དེའི་ S-box འདི་འདི་ཨིན།

$$
S(x)=x^5
$$

FastPQ གིས་ full round བཞི་, partial rounds ལྔ་བཅུ་བདུན་, དེ་ལས་ full round བརྒྱ་ཆ་བཞི་ ལག་ལེན་འཐབ་ཨིན། full round ཀྱིས་ round constants `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` བཟོ་ནི་འདི་:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

མཐའ་ཟུར་གྱི་འཁོར་ལོ་བཏབ་ནི་འདི་:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

additions དང་ multiplications ཆ་མཉམ་འདི་ `F`ནང་ལུ་ཡོདཔ་ཨིན། canonical MDS matrix འདི་འདི་ཨིན།

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Field hash འདི་ zero state ལས་འགོ་བཙུགས་ཨིན། ཚད་གཞི་-2 གི་མཐའ་མ་ `(u,v)` གི་དོན་ལུ་:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

མཇུག་མཐའན་མཇུག་གི་པཱལ་འདི་གིས་ `1` བཀྲམ་སྤེལ་གྱི་ ཨེལམོནཌི་དེ་ མཐའ་མའི་འགྱུར་བཅོས་ཀྱི་ཧེ་མར་ མཐུད་སྦྲེལ་འབདཝ་ཨིན། གྲུབ་འབྲས་འདི་ `x_0`.

### མི་མང་གི་བརྡ་དོན་ཚུ་ བསྡུ་སྒྲིག་འབད་ནི་ {#public-input-binding}

host གིས་ data space id འདི་ `u64` value འདི་ 16-byte field གི་ little-endian byte ༨ དང་པ་ནང་འབྲི་ཐོག་ལས་ codeའབདཝ་ཨིན།

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

སྦྲག་བཟོ་ནིའི་དུས་ཚོད་འདི་ milliseconds ལས་ nanoseconds ལུ་བསྒྱུར་བཅོས་འབདཝ་ཨིན།

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Transaction-set hash འདི་ byte-domain hash ཚུ་ནང་ sorted entry point hash ཚུ་ནང་ལུ་ཨིན།

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

འདི་ནང་ལུ་ `h_i` བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ Transaction དང་ Time-Trigger Entry Point Hashes ཚུ་ཨིན། དངོས་གྲུབ་གསལ་སྒྲགས་ནང་ IO ལུ་འབད་བ་ཅིན་ `perm_root` ཡང་ན་ `tx_set_hash` དེ་ཚུ་ག་ར་ ༠ ཨིན་པ་ཅིན་ Prover གིས་ fallback values སླར་ལོག་བཀང་འོང་།

$$
\operatorname{perm\_root} =
\begin{cases}
0^{32},& \text{if there are no permission hashes}\\
\operatorname{Hash}(\texttt{fastpq:v1:perm\_root}\|p_0\|\cdots\|p_{n-1}),
& \text{otherwise}
\end{cases}
$$

$$
\operatorname{tx\_set\_hash}_{fallback} =
\operatorname{Hash}(\texttt{fastpq:v1:tx\_set}\|\operatorname{ordering\_hash})
$$

### ཨང་གྲངས་ཀྱི་ཚད་ལྡན་བཟོ་ནི་ {#numeric-normalization}

ཌེ་ཊཱལ་གནས་སྤོ་རེ་གི་དོན་ལུ་ དམིགས་གཏད་བཅུ་མའི་ཐིག་ཚད་དེ་ མཁོ་ཆས་དང་ཆ་སྙོམས་གཉིས་ཆ་ར་གི་མཐའ་མཚམས་ཀྱི་ཐིག་ཚད་འདི་ཨིན།

$$
s =
\max(
\operatorname{scale}(a),
\operatorname{scale}(f_0),
\operatorname{scale}(f_1),
\operatorname{scale}(t_0),
\operatorname{scale}(t_1)
)
$$

`m` དང་ཚད་གཞི་ `q` ཡོད་མི་ `Numeric`གི་གོང་ཚད་འདི་ `m >= 0`དང་ `q <= s` ལུ་རྐྱངམ་ཅིག་ཆ་ལེན་འབད་ཡོདཔ་ཨིན། འདི་གི་དོན་ལུ་ FastPQ གི་དཔང་རྟགས་ཀྱི་གོང་ཚད་འདི་:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

གྲུབ་འབྲས་ཚད་ལྡན་འདི་ `u64` ནང་ཐིག་འབད་དགོཔ་ཨིན།

### ཀ་ནོ་སི་ཀཱན་གྱི་བཀའ་རྒྱ་ {#canonical-ordering}

ཟུར་གྱི་བཟོ་སྐྲུན་མ་འབད་པའི་ཧེ་མར་ བཀྲིས་སྒང་དེ་ གནས་སྤོ་ལྡེ་མིག་དང་ ལག་ལེན་གནས་ཚད་ དེ་ལས་ རང་ལུགས་ཀྱི་ཐིག་ཁྲམ་ཚུ་དང་འཁྲིལ་ཏེ་ དབྱེ་བ་ཕྱེ་དོ་ཡོདཔ་ཨིན།

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

བཀའ་རྒྱ་བཀོད་པའི་འགན་ཁུར་འདི་ Poseidon2 ས་ཁོངས་ཀྱི་ཧེཤ་དེ་ domain `fastpq:v1:ordering` དང་ Norito ཨེབ་གཏང་འབད་ཡོད་པའི་བརྒྱུད་རིམ་ཚུ་ཨིན།

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

འདི་ནང་ལུ་ `P`འདི་ བི་ཊ་༧ གི་སྦ་སྒོར་ཨིནམ་ད་ `E`འདི་ Norito ཨེབ་གཏང་འབད་ནི་དང་ `D_o`དེ་ `fastpq:v1:ordering` དེ་ལས་ `T*`འདི་དབྱེ་སྒྲིག་འབད་ཡོད་པའི་འགྱུར་བཅོས་གི་ཐོ་ཡིགཨིན་མས།

### བརྗེ་སོར་གྱི་ཆ་སྙོམས་ཚུ་ {#transfer-equations}

སྐྱིན་འགྲུལ་བསྐྱོད་གྱི་དོན་ལུ་ `a`, བཀྲམ་སྤེལ་འབད་ཐངས་ `f`, དེ་ལས་ སྐྱིན་འགྲུལ་ལེན་མི་གི་མཐུན་རྐྱེན་ `t`, FastPQ མཐུན་རྐྱེན་ཚུ་བཟོ་མ་ཚར་བའི་ཧེ་མ་ རྟགས་མཚན་གྱི་གནས་གོང་ཚུ་ གཏན་འཁེལ་འབད་:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

གནས་སྤོ་འགྲུལ་གྱི་གྲལ་ཐིག་འདི་ འ་ནི་ལས་ཀ་འདི་གིས་ ཨེབ་གཏང་འབདཝ་ཨིན།

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

འོག་གི་ཐིག་ཁྲམ་ནང་ ཐོ་བཀོད་འབད་མི་ཌེ་ལཊ་ཚུ་ `F` ལུ་ མར་ཕབ་འབད་ཡོདཔ་ཨིན།

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

གདམ་ཁ་རྐྱབས་ཀྱི་ single-delta transfer digest གིས་ codeed transfer preimage བསྡུ་སྒྲིག་འབདཝ་ཨིན།

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

ཌེ་ལཊ་མང་རབས་ཀྱི་ ཡིག་སྣོད་ཚུ་གི་དོན་ལུ་ ད་ལྟོའི་བཟོ་དབྱིབས་འདི་ མཐོ་ཤོས་གནས་ཚད་གི་ཡིག་སྣོད་འདི་མེད་དགོཔ་ཨིན།

གནས་སྤོ་ཡིག་ཚང་གི་དོན་ལུ་ འཛུལ་སྐྱོང་དབང་འཛིན་གྱིས་ བཏང་མི་ ཡིག་ཆ་འདི་

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### འོག་གི་གྲལ་རིམ་ཚུ་ {#trace-rows}

འགྱུར་ལྡོག་གི་ཐོ་ཡིག་ནང་ལུ་ `n` ངོ་མ་གྲལ་ཐིག་ཚུ་ཡོད་བཅུག་ ཤུལ་མའི་རིང་ཚད་འདི་གཉིས་ལས་ལྷག་པའི་ནུས་ཤུགས་ཨིན།

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

ཐིག་ཁྲམ་ `0..n-1` འདི་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ ཐིག་ཁྲ་ `n..N-1`འདི་ བཀྲམ་སྤེལ་ཐིག་ཁྲམ་ཨིན། ཐིག་ཁྲམ་གྱི་ཆ་ཤས་རེ་ལུ་ བྱ་སྤྱོད་སེལ་འཐུ་འབགཔ་གཅིག་ཡོད་:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

སེལ་འཐུ་འབད་མི་ཚུ་ག་ར་ Boolean ཨིན།

$$
s(s-1)=0
$$

ངོས་ལེན་འཚོལ་བའི་གྲལ་ཐིག་འདི་ འགན་འཁྲི་བྱིན་ནི་དང་ འགན་འཁྲིའི་ཕྱིར་འབུད་འབད་ནིའི་གྲལ་ཐིག་ཚུ་ཨིན།

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

ཨང་གྲངས་ལག་ལེན་གྱི་གྲལ་ཐིག་ཚུ་གི་དོན་ལུ་:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

བཟོ་སྐྲུན་འབད་མི་ཚུ་གིས་ཡང་ རྒྱུ་དངོས་རེ་ལུ་ ཌེ་ལཊ་ཚུ་ བརྟག་ཞིབ་འབདཝ་ཨིན།

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

འབུབ་དང་མེ་ཏོག་གི་གྲལ་ཐིག་རྐྱངམ་གཅིག་གིས་ བཀྲམ་སྤེལ་གྱི་རྩིས་ཁྲ་འདི་ ད་ལྟོའི་རིང་ལུ་བཟོ་བཀོད་འབདཝ་ཨིན།

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

metadata དང་ dataspace trace columns འདི་ row materialization གི་སྔོན་ལུ་ ཐོན་སྐྱེད་འབད་ཡོད་པའི་ field hashesཨིན།

$$
\operatorname{metadata\_hash} =
\begin{cases}
0,& \text{if metadata is empty}\\
H_D(E(\text{metadata})),& \text{otherwise}
\end{cases}
$$

$$
\operatorname{dsid\_trace}=H_D(\operatorname{public\_input\_dsid})
$$

metadata hash ཌེ་ཊ་ས་པི་སི་ hash དང་ slot འདི་ཉེ་འདབས་ལུ་ཡོད་པའི་ trace rows གི་ནང་འཁོད་ལུ་བརྟན་ཏོག་ཏོ་ཨིན།

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Merkle ཀི་ལོ་མི་ཊར་ཚུ་སྤེལ་ {#transfer-merkle-columns}

བརྒྱུད་སྤེལ་ཐིག་ཚུ་ནང་ལུ་ ཚད་༣༢ འབད་མི་ Merkle ཐབས་ལམ་ཅིག་ཡོདཔ་ཨིན། host proof མེད་པ་ཅིན་ prover གིས་ row key དང་ pre-balance ལས་ deterministic path གཅིག་སྒྲིལ་འབདཝ་ཨིན། དེ་ལས་ arrayའདི་ sender ཡང་ན་ receiver side ཨིན་མིན་འདུག་མེན་ན་ཨིན།

གློག་རྫས་ཀྱི་ལམ་གྱི་དོན་ལུ་ མུ་ཏིག་གི་བྲོཝ་འདི་ `fastpq:smt:from` བཏང་མི་ཐོ་བཀོད་དང་ `fastpq:smt:to` ལེན་མིའི་ཐོ་བཀོད་ཀྱི་ཆེད་དུ་ཨིན།

$$
K =
\operatorname{Hash}(\texttt{fastpq:smt:key|}\|\operatorname{salt}\|\operatorname{key})
$$

$$
V =
\operatorname{Hash}(\texttt{fastpq:smt:value|}\|\operatorname{salt}\|\operatorname{le64}(\operatorname{balance}))
$$

$$
b_\ell = \operatorname{bit}_\ell(K)
$$

$$
s_\ell =
\operatorname{Hash}(
\texttt{fastpq:smt:sibling|}\|
\operatorname{le64}(\ell)\|K\|\operatorname{le64}(\operatorname{balance})\|\operatorname{salt}
)
$$

ལྕགས་ཤོག་དང་ ནང་འཁོད་ཨེབ་ཐག་ཚུ་འདི་:

$$
L = \operatorname{Hash}(
\texttt{fastpq:smt:leaf|}\|
K\|V
)
$$

$$
N_{\ell+1} =
\operatorname{Hash}(
\texttt{fastpq:smt:node|}\|
\operatorname{left}_\ell\|
\operatorname{right}_\ell
)
$$

ཤུལ་རྟགས་འདི་ བཏོན་ཐོ་བཀོད་འབདཝ་ཨིན། `b_l`, སྤུན་ཆ་ཚུ་ `s_l`, ནང་ཐིག་ཨན་ཌི་ `x_l`, ཕྱིར་ཐོན་འབད་ཐངས་ཚུ་ `x_{l+1}` ཐིམ་ཕུག་གི་གནས་ཚད་ག་ར་ནང་། ཁྲིམས་ལུགས་ཀྱི་ཞལ་འཛོམས་ནང་ལུ་:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### ངོས་ལེན་གྱི་ཧེཤ་ཚུ་ {#permission-hashes}

འགན་འཁྲི་བྱིན་ནི་དང་ བཏོན་གཏང་ནིའི་གྲལ་ཐིག་ཚུ་ ངོས་ལེན་ཅན་གྱི་དཔང་པོ་འདི་ ཧེཤ་འབད་:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

host permission tables root གིས་ནང་དོན་ཚུ་ role byte, permission byte དང་ epoch byte ཚུ་གིས་དབྱེ་བ་ཕྱེ་ཞིནམ་ལས་ Poseidon2 Merkle tree བཟོ་ཡོདཔ་ཨིན།

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Odd-width levels གིས་མཇུག་གི་ element འདི་ཡང་ལོག་འབདཝ་ཨིན།

### འགྲུལ་སྐྱོད་འབད་ནིའི་འགན་ཁུར་ {#trace-commitment}

ཟུར་ཐོ་རེ་གི་དོན་ལུ་ `c`, FastPQ གིས་ འགོ་དང་པ་ ཟུར་ཐོ་ domain གི་ནང་ལུ་ column valuesཚུ་ interpolates འབད་ནི་དང་ coefficient vector འདི་ hashesའབདཝ་ཨིན།

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

འོག་གི་གྲལ་ཐིག་གི་རྩ་བ་འདི་ Poseidon2 Merkle གི་རྩ་བ་ལས་ ཀི་ལོ་མི་ཊར་གྱི་འགན་ཁུར་ཚུ་ཨིན།

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

མཐའན་མཇུག་གི་ཐིག་ཁྲམ་བཅའ་ཡིག་འདི་ domain, parameter set, trace shape, column digests དང་ trace root གི་ནང་ལུ་ byte hash ཨིན།

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

`D_c`འདི་ `fastpq:v1:trace_commitment`ཨིན།

### AIR བཟོ་བཀོད་ {#air-composition}

V1 AIR བཟོ་བཀོད་གྱི་གོང་ཚད་འདི་ གྲལ་ཐིག་གི་གནས་ཀྱི་ལྷག་ལུས་ཚུ་གི་གྲལ་ཐིག་ཅིག་ཨིན། ཡིག་འབྲུ་འདི་དཀའ་ངལ་གཉིས་ལུ་བལྟ་ཚུགས།

$$
\alpha_0,\alpha_1 \in F
$$

གྲལ་ཐིག་གཉིས་ཆ་ར་ `(i,i+1)` གི་དོན་ལུ་ བརྟག་ཞིབ་འབད་མི་ཚུ་གིས་:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

ལྷག་ལུས་ཚུ་ `rho` འདི་ ཀོ་ཌ་གི་རིམ་པ་བཞིན་དུ་ཨིན།

$$
\rho=s(s-1)
\quad\text{for each selector column}
$$

$$
\rho =
s_{\text{active}} -
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}}+
s_{\text{role\_grant}}+s_{\text{role\_revoke}}+s_{\text{meta\_set}})
$$

$$
\rho =
s_{\text{perm}}-(s_{\text{role\_grant}}+s_{\text{role\_revoke}})
$$

$$
\rho =
s_{\text{active},i+1}(1-s_{\text{active},i})
$$

གྲལ་ཐིག་ཚུ་ནང་ ཨང་གྲངས་ཀ་ཚུ་ཡོད་མི་ཚུ་གི་དོན་ལུ་:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

དེ་ལས་ བཀྲམ་སྤེལ་གྱི་གནས་སྟངས་ཀྱི་ གྲལ་ཐིག་ཚུ་གི་དོན་ལུ་:

$$
\rho =
\operatorname{metadata\_hash}_i-\operatorname{metadata\_hash}_{i+1}
$$

$$
\rho =
\operatorname{dsid}_i-\operatorname{dsid}_{i+1}
$$

$$
\rho =
\operatorname{slot}_i-\operatorname{slot}_{i+1}
$$

དབྱེ་ཞིབ་འབད་མི་ཚུ་གིས་ `A_i` བརྟག་དཔྱད་འབད་ཡོད་པའི་གྲལ་ཐིག་ཁ་ཕྱེ་ཚུ་གི་དོན་ལུ་ སླར་ཡང་རྩིས་སྟོནམ་ཨིན། དེ་ལས་ AIR སྒྲིག་གཞི་ Merkle root གྱི་འོག་ལུ་ ཁས་བླངས་འབད་མི་ གྲོས་བསྡུར་གྱི་གོང་ཚད་དང་ཕྱདཔ་ད་བརྟག་དཔྱད་འབདཝ་ཨིན།

### ཞིབ་འཚོལ་ཐོན་སྐྱེད་ {#lookup-product}

ངོས་ལེན་འཚོལ་བའི་གློག་བརྙན་འདི་ Fiat-Shamir གྱི་དཀའ་ངལ་ `gamma` ལག་ལེན་འཐབ་ཨིན། `s_perm` དང་ `perm_hash` གི་གནས་ཚད་དམའ་ཤོས་ཀྱི་གོང་འཕེལ་བརྟག་དཔྱད་ཚུ་ནང་ལུ་ དོ་འགྲན་འབད་མི་ཐོན་སྐྱེད་འདི་:

$$
z_0=1
$$

$$
z_{i+1}=
\begin{cases}
z_i\cdot(w_i+\gamma),& s_{\text{perm},i}\ne0\\
z_i,& s_{\text{perm},i}=0
\end{cases}
$$

དཔྱད་ཡིག་ཚུ་:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### རྒྱ་བསྐྱེད་ཚད་དམའ་ཤོས་ཅིག་ {#low-degree-extension}

བཏང་གཏང་ `omega_T` ཤུལ་འཛིན་གྱི་ས་ཁོངས་བཟོ་སྐྲུན་འབད་མི་འདི་ཨིན། `omega_E` ཚད་འཛིན་གྱི་ས་ཁོངས་བཟོ་སྐྲུན་འབད་མི་འདི་དང་ `g` གཞི་སྒྲིག་འབད་ཡོད་པའི་ coset offset ཨིན། གནས་གོང་ཚུ་ཡོད་མི་ trace columnགི་དོན་ལུ་ `v_i`, interpolation གིས་ coefficients བཟོཝ་ཨིན། `a_j` འདི་བཟུམ་སྦེ་:

$$
f(\omega_T^i)=v_i
$$

འོག་གི་གནས་ཚད་ཀྱི་ཁྱབ་སྒྲགས་འདི་ coset གི་ polynomial དེ་བཟུམ་སྦེ་ evaluates:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

ལག་ལེན་གྱིས་འདི་ FFT གི་སྔོན་ལས་ coset offsetགི་དབང་ཤུགས་ཚུ་དང་གཅིག་ཁར་ ཁྱད་ཚད་ཚུ་སྤེལ་ཐོག་ལས་རྩིས་སྟོནམ་ཨིན།

$$
a'_j = a_j g^j
$$

དེ་ལས་ `a'` བརྟག་ཞིབ་འབད་སའི་ ས་ཁོངས་ནང་ལུ་ བརྟག་དཔྱད་འབདཝ་ཨིན།

CPU FFT འདི་ བི་ཊ་ལོག་བཏབ་པའི་ ནང་ཐོ་བཀོད་ཚུ་ནང་ལུ་ iterative radix-2 Cooley-Tukey འགྱུར་བ་ཨིན། དུས་ཡུན་རིང་ཚད་ `L`, དུས་ཡུན་ཕྱེད་ཀ་ `H=L/2`དང་ དུས་ཡུན་རྩ་ལུ་:

$$
\omega_L=\omega^{N/L}
$$

གླང་རེ་རེའི་རྩིས་ཁྲ་ཚུ་:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

FFT གིས་ `omega^{-1}` དང་འདྲན་འདྲ་སྦེ་བསྒྱུར་བཅོས་འབད་ཡོདཔ་མ་ཚད་ གྱངས་ཁ་དེ་ཡང་ གྱངས་ཁུག་གི་ཚད་གཞི་དང་བསྟུན་ཨིན།

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

ལག་ལེན་འཐབ་པའི་ཧེ་མར་ ཐོ་བཀོད་གི་རྩ་བ་ཚུ་ དམ་ཚིག་ཅན་བཟོ་དགོ།

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Catalogue rootལས་ འཐོབ་མི་ domain ཆུང་ཤོས་ཚུ་གི་དོན་ལུ་ generator འདི་འདི་ཨིན།

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### གྲལ་ཐིག་དང་ ལྡེ་མིག་ཚུ་ {#row-and-leaf-hashes}

LDE གི་ཤུལ་ལས་ FastPQ གིས་ LDE ཀི་ལོ་མི་ཊར་ཚུ་ནང་ ཐིག་ཁྲམ་རེ་ཐོ་བཀོད་འབདཝ་ཨིན། `m` གི་དོན་ལུ་:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

གལ་སྲིད་ row-hashes འདི་ evaluation domain གྱི་ཚབ་ལུ་ trace domain ནང་ལུ་ཡོད་པ་ཅིན་, prover གིས་ single-row-hash column དེ་ same coset LDE བྱ་རིམ་དང་གཅིག་ཁར་ interpolates དང་ extendsའབདཝ་ཨིན།

### Merkle སྒོ་ཕྱུག {#merkle-openings}

LDE ཚད་གཞི་ཚུ་ བསྡུ་སྒྲིག་འབད་ཡོདཔ་ཨིན།

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

ཤོག་ལེབ་དུམ་གྲ་རེ་འདི་:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merkle གི་ཕམ་འདི་:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

ཨར་ཌ་གི་གནས་ཚད་ཚུ་གིས་ མཐའ་མཇུག་གི་ཨེབ་ཐག་འདི་ བཏོན་དོ་ཡོདཔ་ཨིན། སླར་ལོག་ལམ་ཚུ་ ཐེ་ཚོམ་རེ་ལུ་ སླར་ལོག་ཤོག་ལེབ་ཀྱི་ཐོ་བཀོད་འདྲ་མཉམ་དང་འཁྲིལ་ཏེ་ བྱང་དང་གཡས་ཁ་ཐུག་ལུ་ ཧེཤ་འབད་ཐོག་ལས་བརྟག་དཔྱད་འབདཝ་ཨིན།

ཤོག་ལེབ་ཅིག་ `i` ལུ་ཐོ་བཀོད་འབད་ཡོདཔ་ད་ Path `(s_0,\ldots,s_{d-1})` གིས་ རྩ་ `R` གི་ཐད་ཁར་ སླར་ལོག་འབད་བའི་ཐོག་ལས་བརྟག་དཔྱད་འབདཝ་ཨིན།

$$
y_0=L_i
$$

$$
y_{k+1}=
\begin{cases}
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),y_k,s_k),
& \lfloor i/2^k\rfloor \equiv 0 \pmod 2\\
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),s_k,y_k),
& \lfloor i/2^k\rfloor \equiv 1 \pmod 2
\end{cases}
$$

སྐྱིན་འགྲུལ་དེ་ ཤུལ་ལས་རྐྱངམ་གཅིག་ བཏབ་ཨིན།

$$
y_d=R
$$

AIR ཕྲ་རིང་གི་གྲལ་ཐིག་ཚུ་:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR བཟོ་སྐྲུན་གྱི་ཤོག་ལེབ་ཚུ་:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE འདྲི་བའི་སྒོ་ཕྱེ་ཐངས་འདི་ཡང་ བརྟག་དཔྱད་འབད་དོ་ཡོདཔ་ད་ བརྟག་ཞིབ་གཞི་འཛིན་ `i` ལུ་ཁ་ཕྱེཝ་གི་གོང་ཚད་དེ་ དངོས་གྲུབ་ཅན་གྱི་ཆ་ཤས་ནང་ཡོད་མེད་ཟེར་ཨིན་མས།

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI ཕབ་ཆག་ {#fri-folding}

FRI གིས་ AIR བཟོ་བཀོད་བརྟག་དཔྱད་འབད་ནི་ལུ་ ཁས་བླངས་འབད་ཡོདཔ་ཨིན། མཐའ་འཁོར་རེ་གི་དོན་ལུ་ `l` ཨེབ་རྟ་དཔེ་སྒྲོམ་འདི་ བརྩོན་འགྲུས་ `beta_l` ཨིན། ཚགས་ཁེབས་དེ་མཐའ་མའི་གོང་ཚད་ལོག་བཤུབ་ཐོག་ལས་ ཨེ་རི་གི་གྱངས་ཁ་ཅིག་སྦེ་བཀབ་ཨིན། ཨེ་རི་ཚད་ཀྱི་སྡེ་ཚན་རེ་རེ་གིས་:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

where `a` is the FRI arity. verifier གིས་ བརྟག་ཞིབ་འབད་མི་དེ་ བརྟག་དཔྱད་འབད་མི་འདི་ལུ་ བརྟག་དཔྱད་འབད་བ་ཅིན་ བརྟག་དཔྱད་ཀྱི་གྲལ་རིམ་རེ་གི་དོན་ལུ་:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

དེ་ལས་སྒོ་ཕྱེ་མི་ FRI སྡེ་ཚན་རེ་ལུ་ འོས་འབབ་ཅན་གྱི་ FRI layer root དང་གཅིག་ཁར་ བདེན་ཁུངས་འབདཝ་ཨིན།

### Fiat-Shamir ཡིག་སྣོད་ {#fiat-shamir-transcript}

canonical parameters catalogue གིས་ transcript hash འདི་ SHA3-256 སྦེ་ཐོ་བཀོད་འབདཝ་ཨིན། ད་ལྟོའི་ prov དང་ verifier ལག་ལེན་གྱིས་ challenge bytesའདི་ `iroha_crypto::Hash::new` ལུ་བཏོན་དོ་ཡོདཔ་ད་ འདི་གིས་ 32-byte Blake2bVar digest བཟོ་སྟེ་ཡོདཔ་ལས་ ཨང་དང་པ་གི་ little-endian byte བརྒྱད་དེ་ `F` ལུ་ མར་ཕབ་འབད་ཡོདཔ་ཨིན།

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

བརྩོན་འགྲུས་ཀྱི་ཅ་ལ་ཚུ་ ཡིག་འབྲུ་གི་གནས་སྟངས་ནང་ སྦྱོར་བ་ཡོངས་བསྡོམས་བཀང་ཨིན། སླར་ལོག་འབད་ནིའི་རིམ་ནི་འདི་ཨིན།

1. མི་མང་གི་ IO, བརྒྱུད་འཕྲིན་གྱི་རྣམ་འགྱུར་, ཁྱད་ཚད་ཀྱི་རྣམ་འགྱུར་དང་ ཁྱད་ཚད་གི་མིང་
2. LDE རྩ་དང་ ཤུལ་རྟགས་ཀྱི་རྩ་
3. `gamma`
4. AIR བཟོ་བཀོད་ཀྱི་དཀའ་ངལ་ཚུ་ `alpha_0`, `alpha_1`
5. AIR སྣུམ་འཁོར་གྱི་རྩ་དང་ AIR སྦྱོར་བ་ཀྱི་རྩ་
6. ཞིབ་འཚོལ་སྦོམ་ཐོན་སྐྱེད་
7. FRI layer roots དང་ `beta_l` challenges
8. དཔྱད་ཡིག་གི་དྲི་བཀོད་ཐོ་ཚུ་

བརྟག་ཞིབ་འབད་ཐངས་འདི་གིས་ 32-byte འབག་འོང་ཐངས་ཚུ་བཏོན་ཏེ་ ཨེན་ཌི་ཨེན་ `u64` གི་དུམ་གྲ་ཅིག་སྦེ་ལྷག་སྟེ་བཞག་དོ་ཡོདཔ་ད་ དེ་བསྒང་ ཨེན་ཌིཀསི་གི་གྱངས་ཁ་འདི་ དགོས་མཁོ་ཅན་མ་བྱུང་ཚུན་ཚོད་:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

བརྟག་དཔྱད་འབད་མི་འདི་ དབྱེ་རིམ་བཞིན་དུ་ལོག་གཏང་དགོ།

### བརྟག་དཔྱད་འཕྲུལ་ཆས་ ལོག་སྤྱོད་འབད་ {#verifier-replay}

དབྱེ་ཞིབ་འབད་མི་ཚུ་གིས་ དང་པ་ར་ བཀྲམ་སྤེལ་གྱི་ ཁས་བླངས་དེ་ ལོག་རྩིས་དཔྱད་འབདཝ་ཨིན།

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

དེ་ལས་ དགོས་མཁོ་ཚུ་:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

ཡང་བསྐྱར་བཟོ་བསྐྲུན་འབད་མི་ མི་མང་ IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

ས་ཁོངས་སོ་སོ་གིས་ ཐུབ་སྟོན་གྱི་སྤྱིར་བཏང་ IO byte-for-byte འདི་དང་མཐུནམ་འབད་དགོཔ་ཨིན། སླར་ལོག་བརྟག་དཔྱད་འབད་མི་དེ་གིས་ ཡིག་འབྲུ་དེ་རང་བསྐྱར་བཟོ་ཞིནམ་ལས་ དངོས་ལེན་འདི་རང་བཏོན་འོང་།

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

དཔྱད་བརྗོད་བཀོད་མི་དྲི་བ་རེ་གི་དོན་ལུ་ `q`, འདི་གིས་བརྟག་དཔྱད་འབདཝ་ཨིན།

$$
\operatorname{MerkleVerify}(
R_{\text{lde}},
L_{\lfloor q/B_{\text{lde}}\rfloor},
\lfloor q/B_{\text{lde}}\rfloor,
\pi_{\text{lde}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_q,
q,
\pi_{\text{air,current}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_{q+1\bmod N_{\text{eval}}},
q+1\bmod N_{\text{eval}},
\pi_{\text{air,next}}
)
$$

དེ་ལས་:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

འདི་ཚུ་ AIR བཟོ་བཀོད་སྒོ་ཕྱེས་པའི་སྐབས་ དངོས་འཛིན་འབད་དགོཔ་ཨིན། `R_air_composition`. འདི་ཚུ་ FRI ལྕགས་ཐག་འདི་དེ་ནང་ལས་འགོ་བཙུགས་ཏེ་ `A_q` ཤུལ་མ་མཇུག་བསྡུ་ནི་དེ་ བདེན་ཁུངས་བཀལ་མི་ མཇུག་བསྡུཝ་ཅིག་ཨིན། FRI ཤོག་ལེབ་འདི་ terminal གི་འོག་ལུ་ཨིན། FRI རྩ་བ་འདི་

## ཤེས་རབ་ཅན་གྱིས་བརྟག་དཔྱད་འབད་མི་འདི་ {#what-the-prover-checks}

སྒྲིག་གཞི་བཟོ་མ་ཚར་བའི་ཧེ་མར་ FastPQ བརྟག་ཞིབ་འབད་མི་དེ་གིས་ ཨང་གི་རིམ་ལུགས་དེ་ གནས་སྤོ་ལྡེ་མིག་དང་ ལས་འགུལ་གྱི་གྲལ་ཐིག་ དེ་ལས་ བཙུགས་པའི་རིམ་བརྒྱུད་དེ་ ཀ་ནོ་ནི་ཀིསི་བཟོཝ་ཨིན། བརྒྱུད་འཕྲིན་གྲལ་ཐིག་ཚུ་གིས་ཡང་ ཡིག་སྣོད་ཡིག་སྣོད་ཚུ་ དགོཔ་ཨིན། ཡིག་སྣོད་གྲལ་ཐིག་ཡོད་མི་ཅིག་ཨིན་རུང་ ཡིག་སྣོད་རྩ་བ་ལས་ར་མེད་པ་ཅིན་ ཆ་མེད་ཨིན།

གནས་སྤོ་བཤུད་ཀྱི་ཡིག་ཆ་ཚུ་གི་དོན་ལུ་ བརྟག་དཔྱད་ཚུ་ནང་ལུ་:

- བཏང་མི་གི་རྒྱ་ཁྱོན་འདི་ མར་འབབ་འགྱོ་མ་ཚུགསཔ་ཨིན།
- `sender_after` ཚད་འདི་ `sender_before - amount` ཨིན་ཨིན།
- `receiver_after` ཚད་འདི་ `receiver_before + amount` ཨིན་ཨིན།
- ཡིག་སྣོད་དེ་ བཀྲམ་སྤེལ་གྱི་གྲལ་རིམ་རེ་ལུ་ ཐོ་བཀོད་འབད་དགོཔ་ཨིན།
- ཌེ་ལཊ་གཅིག་འབད་མི་ Poseidon ཌི་གེ་སི་ཊོན་འདི་ཡོད་པའི་བསྒང་ལས་ ཨེབ་གཏང་ཡིག་ཐོག་གི་ སྔོན་སྒྲིག་བརྙན་དང་མཐུནམ་འབྱུང་འོང་།
- མཉམ་ཆུང་-Merkle proofs འདི་ version 1 སྦེ་ decode འབད་དགོཔ་ཨིན། missing paths འདི་ deterministic synthetic proofs གིས་གང་ཡོདཔ་ཨིན།

འོག་གི་གྲལ་ཐིག་ནང་ལུ་ བསྒྱུར་བཅོས་འབད་ནིའི་དོན་ལུ་ གདམ་ཁ་རྐྱབ་མི་ ཀི་ལོ་མི་ཊར་ཚུ་ཡོདཔ་ད་ ཨང་གྲངས་ཀྱི་ལག་ལེན་གྱི་གྲལ་ཐིག་ནང་ ལག་ལེན་ཌེ་ལཊ་ཚུ་བཀོད་ཡོད་པའི་ཁར་ རྒྱུ་དངོས་རེ་ལུ་ ལག་ལེན་ཌེལ་ཊ་དང་ གྲོང་གསེབ་རྩིས་ཁྲ་ཚུ་ཡང་ཡོདཔ་ཨིན།

## དཔྱད་རིག་གི་ལམ་ {#prover-lane}

`irohad` གིས་ FastPQ བཀྲམ་སྟོན་ལམ་འདི་འགོ་བཙུགསཔ་ད་ བཀྲམ་སྤེལ་རྒྱབ་སྒྲིལ་འདི་ འགོ་འདྲེན་འཐབ་ཚུགས་པ་ཅིན་ འགོ་བཙུགས་འབདཝ་ཨིན། བཀྲམ་བཤད་ལམ་དེ་ མཐའ་ཟུར་གྲལ་ཐིག་ཅིག་ཡོད་མི་ མཐོང་སྣང་གི་ལཱ་ཨིན། སྦྲག་ཅིག་གིས་ལག་ལེན་གྱི་དཔང་རྟགས་བཟོ་ཚར་བའི་ཤུལ་ལས་ commit ལམ་འདི་གིས་ བཀྲམ་བཤདཔ་ལཱ་ནང་ལུ་ block hash, མཐོ་ཚད་,མཐོངམ་དང་དཔང་རྟགས་ཚུ་ཡོདཔ་འོང་

ག་དེམ་ཅིག་སྦེ་ ཕྲང་ལམ་དེ་ བརྩོན་ཤུགས་མེད་པ་ཅིན་ ཡང་ན་ ལེའུ་འདི་ལྟེམ་ལྟེ་སྦེ་ཡོདཔ་ཨིན་པ་ཅིན་ ལཱ་འདི་སེལ་འཐུ་འབད་ནི་དང་ རང་ལུགས་ཀྱི་སྦྲག་ལག་ལེན་འཐབ་ནི་འདི་ འགོ་བཙུགས་འོང་། འདི་གིས་འབད་ རྒྱབ་བཤུད་རྐྱབ་པའི་ཕྲང་ལམ་འདི་ གནད་དོན་གྱི་ འཛུལ་ཞུགས་ཡང་ན་ གྲོས་འཆམ་སྒོ་ར་མེན་རུང་ མངའ་སྡེའི་ནང་ལུ་ དངོས་ལེན་ཐོན་སྐྱེད་ལམ་ཅིག་ཨིན་མི་འདི་ ལག་ལེན་འཐབ་ཚར་ནུག

ཕྲང་ལམ་འདི་ནང་ལུ་ བལྟ་བཤལཔ་ཅིག་བཟོ་ཡོདཔ་ཨིན།

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` གིས་ བརྟག་ཞིབ་འབད་མི་ཚུ་ལུ་ གཞི་བཙུགས་འབད་བཏུབ་པའི་ backend གདམ་ཁ་རྐྱབ་བཅུགཔ་ཨིན། `cpu` པིན་གྱི་ལག་ལེན་འདི་ CPU ལུ་འདེམས་སྟོན་འབདཝ་ཨིན། `gpu` གིས་ GPU ལག་ལེན་ལུ་དགའ་དོ་ཡོདཔ་ད་ CPU འདི་ backend གིས་ requested kernels ལག་ལེན་འཐབ་མ་ཚུགསཔ་ཅིག་ཨིན་མས།

## དབྱེ་ཞིབ་ {#verification}

FastPQ བརྟག་དཔྱད་འདི་གིས་ ཀ་ནོ་ནི་ཀཱན་གྱི་ བཀྲམ་སྤེལ་གྱི་འགན་ཁུར་དེ་བསྐྱར་བཟོ་སྟེ་ མི་མང་གི་ཡིག་འབྲུ་འདི་ལོག་གཏོགསཔ་ཨིན། བརྟག་ཞིབ་འབད་མི་དེ་གིས་ གྲོས་ཆོད་ཀྱི་བཟོ་བཀོད་དང་ ཁྱད་ཚད་གཞི་སྒྲིག་པའི་བཟོ་བཀོད་ཀྱི་ཚད་འཛིན་ཚུ་ ལོག་སྤྱོད་འབད་ནི་ལུ་ བཀག་ཆ་འབདཝ་ཨིན། ཤུལ་མའི་བཟོ་བཀོད། མི་སེར་གྱི་ནང་ཐོ་བཀོད་ཚུ་ དཔེར་ན་ Merkle སྒོ་ཕྱུག། AIR སྒོ་ཕྱོག། དེ་ལས་ FRI དྲི་བཀོད་ ལྕགས་ཚལ་ཚུ་ བརྟག་ཞིབ་འབདཝ་ཨིན།

གློག་བརྙན་བསྐྱར་རྐྱབ་ནིའི་ཚད་གཞི་ཚུ་ནང་:

|ས་མཚམས་ |སྔོན་སྒྲིག་འབདཝ་ཨིན།|
| ------------------ | ------: |
|གནས་སྤོ་རིམ་གྱི་གྲལ་ཐིག་ |     256 |
|བཀྲམ་སྤེལ་གྱི་ཁེ་རྒུད་ཀྱི་ཚད་ |༢༦༥ KiB |
|FRI ས་གོ་ཚུ་ |      16 |
|དྲི་བཀོད་སྒོ་ཕྱུག |     128 |

## Nexus བརྟག་ཞིབ་འབད་ཡོད་པའི་ རེ་རེ་ཚུ་ {#nexus-verified-relays}

Nexus AXT དཔྱད་ཡིག་གི་ཁེབས་ཚུ་ནང་ལུ་ `AxtFastpqBinding`. ནམ་དུས་ལུ་ `RegisterVerifiedLaneRelay` འཁྲུན་ཆོད་ཚུ་ Iroha:

1. རྒྱུན་འགྲུལ་ལམ་གྱི་ བརྒྱུད་འབྲེལ་ཁྱབ་སྒྲགས་དང་ FastPQ ཚོད་བསྲེ་རྫས་ཚུ་ བདེན་དཔྱད་འབདཝ་ཨིན།
2. ཌེ་ཊ་ས་པི་སི་དང་ manifest root འདི་བརྟག་དཔྱད་འབདཝ་ཨིན།
3. AXT དཔྱད་ཡིག་གི་ཁེབས་འདི་ རྩ་སྒྲིག་འབདཝ་ཨིན།
4. ཁྱོད་ཀྱིས་ `fastpq_binding` དགོཔ་ཨིན།
5. FastPQ བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལས་ བསྡུ་སྒྲིག་འབད་ནི་འདི་གིས་
6. ཨེབ་ལྡེ་ཌར་འབད་མི་ FastPQ སྟོན་ཐོ་བཀོད་འབད་མི་ཚུ་
7. བཟོ་སྐྲུན་བསྐྱར་བཟོ་མི་ བཀྲམ་སྤེལ་འབད་ཡོད་པའི་ཐོག་ལུ་ FastPQ འཛིན་ཞིབ་འབད་མི་ཚུ་ལུ་ བཏོན་གཏང་ནི་དང་ གསལ་སྟོན་འབདཝ་ཨིན།

བརྟག་དཔྱད་དེ་ གྲུབ་འབྲས་ཐོན་པ་ཅིན་ Iroha གིས་ `VerifiedLaneRelayRecord` འབྲེལ་མཐུད་ཁ་བྱང་དང་ ངོ་མ་ཁེབས་ དེ་ལས་ བརྟག་དཔྱད་སྣོད་ཧེཤ་དང་ བརྟག་དཔྱད་མཐོ་ཚད་ དེ་ལས་ manifest root དང་ FastPQ binding ཚུ་རྩིས་ཏེ་བཞག་འོང་།

ཕྲང་ལམ་འགྲེམ་སྤེལ་གྱི་ཁེབས་ཚུ་ནང་ཡང་ FastPQ དངོས་གྲུབ་ཀྱི་རྫས་རྫས་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། རྫས་རྫས་འདི་ ལེན་ ID, data space id, block height, verification height, block header hash, settlement hash, and manifest root གི་སྟེང་ལུ་ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན། འབྲེལ་མཐུད་འབད་མི་འདི་ QC དང་ ཆ་གནས་ཅན་གྱི་ FastPQ འདི་གཉིས་ཆ་ར་ནང་ཡོད་པའི་སྐབས་རྐྱངམ་ཅིག་ མཐུད་སྦྲེལ་འབད་ནི་ལུ་ ངོས་ལེན་འབད་ཡོདཔ་ཨིན།

### AXT བསྡུ་སྒྲིག་གི་རྩིས་རིག་ {#axt-binding-math}

Nexus AXT ཤོག་སྒྲིལ་ཚུ་གི་དོན་ལུ་ བརྟག་ཞིབ་བསྐྱར་བཟོ་བའི་ཧེ་མ་ `AxtFastpqBinding` འདི་ ཀ་ནོ་ནི་ཀིསི་སྦེ་བཟོ་ཡོདཔ་ཨིན། གྲུབ་རྟགས་སྟོངམ་གི་གོང་ཚད་ཚུ་ default ལུ་ `fastpq-lane-balanced`; empty verifier id དང་ version default ལུ་ `fastpq`དང་ `v1`; claim type འདི་ trimmed དང་ lowercased ཨིན་ཨིན།

AXT FastPQ མི་མང་གི་ནང་ཐོ་བཀོད་འདི་ deterministic byte hashes ཨིན།

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT བསྒྱུར་བཅོས་ཀྱི་ལྡེ་མིག་འདི་:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization`གི་ཞུ་ཡིག་ནང་ གྲོས་འདེབས་སྤྲོད་ནིའི་གྲལ་ཐིག་ཅིག་བཙུགས་ཡོདཔ་ཨིན།

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

`compliance` ཞུ་བ་ནང་ བརྡ་དོན་རྣམ་གྲངས་གཉིས་ཀྱི་གྲལ་ཐིག་བཙུགས་ཡོདཔ་ཨིན། གཅིག་འདི་ སྲིད་བྱུས་དང་གཞན་དེ་ དམིགས་གཏད་ཀྱི་ གནད་སྡུད་ས་ཁོངས་ཚུ་གི་དོན་ལུ་ཨིན།

`tx_predicate` དང་ `value_conservation`གི་དོན་ལུ་ བསྡུ་སྒྲིག་ནང་ལུ་ འབྱུང་ཁུངས་དང་ དམིགས་གཏད་གྱི་གནས་གོང་ཚུ་ཡོད་པའི་སྐབས་ གསལ་སྟོན་ཅན་གྱི་གྲུབ་འབྲས་ཀྱི་གནས་གོང་ལག་ལེན་འཐབ་ཨིན། དེ་མེན་པ་ཅིན་ code གིས་ ངེས་གཏན་གི་གནས་གོང་ཅིག་བཏོན་འོང་།

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

དེའི་ཤུལ་ལས་ བསྒྱུར་བཅོས་ཀྱི་ཆ་སྙོམས་འདི་རང་ ལག་ལེན་འཐབ་ཨིན།

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

གློག་ཐག་ར་བ་བཏང་མི་དང་ སྤྲོད་མི་ཚུ་གི་རྩིས་ཁྲ་ IDs འདི་ Key Seeds ལས་ ཐོན་སྐྱེད་འབདཝ་ཨིན།

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

བཏང་ནིའི་སྡེ་ཚན་གྱི་ཧེཤ་འདི་:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT བཀྲམ་སྤེལ་འབད་ནིའི་བརྡ་དོན་འདི་ SHA-256 ཌའི་ལོག་ལུ་ Norito ཀན་ནོག་གི་བཅའ་ཡིག་གི་ལྡེ་མིག་ཁར་:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP བརྡ་དོན་གསལ་སྒྲགས་ཚུ་ {#sccp-transparent-message-proofs}

SCCP རྒྱབ་སྐྱོར་སྒྲོམ་དེ་ཡང་ མཚམས་འབྲེལ་ཐོག་ལས་ བརྡ་དོན་བརྟག་དཔྱད་འབད་ནིའི་དོན་ལུ་ FastPQ ལག་ལེན་འཐབ་ཨིན། འ་ནི་ལམ་འདི་ `irohad` ཀྱི་རྒྱབ་ཕྱོགས་བརྡ་སྟོན་ལམ་ལས་སོ་སོ་ཨིན། འདི་གིས་ FastPQ བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལས་ ཐད་ཀར་དུ་ SCCP བརྡ་འཕྲིན་ལག་ཁྱེར་དང་ ཌའི་ལོག་ནང་ལས་ བཟོ་སྐྲུན་འབད་ཞིནམ་ལས་ ཐོན་སྐྱེད་འབད་མི་ལག་ཁྱེར་དེ་ སྒོ་ཕྱེས་ཐོག་ལས་ བདེན་དཔྱད་འབད་ནིའི་དོན་ལུ་ ལེགས་བཅོས་འབདཝ་ཨིན།

SCCP བཀྲམ་སྤེལ་འབད་ནི་འདི་གིས་ `fastpq-lane-balanced` དང་ metadata གནས་རིམ་གསུམ་ལག་ལེན་འཐབ་ཨིན།

|ལྡེ་མིག་|ལས་འགུལ་ |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

ཌའི་ལོག་གི་སྒོ་སྒྲིག་ཚུ་ SCCP གསལ་བའི་ ནང་འཁོད་བརྟག་དཔྱད་ནང་ལས་ཐོབ་ཡོདཔ་ཨིན།

|FastPQ ནང་ཐིག་ |SCCP ཐོན་ཁུངས་|
| ------------- | ---------------------------------------------------------- |
|`dsid` |འགོ་དང་པ་ 16 Byte གི་ Blake2b གྱི་རྩིས་ཐོ་བཀོད་འབད་ཐོ་བཀོད་ཀྱི་ཧེཤ་|
|`slot` |མཐའ་མཇུག་གི་མཐོ་ཚད་ |
|`old_root` |ཁེ་ཕན་གྱི་ཁེ་རྒུད་ |
|`new_root` |ཁས་བླངས་ཀྱི་རྩ་བ་ |
|`perm_root` |མཐའན་མཇུག་གི་སྒོ་ར་ཐིག་ hash |
|`tx_set_hash` |སྙན་ཞུ་ཚུ་ |

SCCP ཀ་ནོ་སི་ཀོཌར་ཚུ་གིས་ ཨེན་ཇི་ཨང་ཆུང་ཀུ་ཚུ་འབྲི་དོ་ཡོདཔ་དང་ བསྒྱུར་བཅོས་འབད་ཚུགས་པའི་རིང་ཚད་ཀྱི་ Byte arrays འདི་བཟུམ་བཟོ་དོ་ཡོདཔ་ཨིན།

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

མཐོང་གསལ་ཅན་གྱི་ མི་མང་གི་ནང་དོན་ byte string འདི་འདི་ཨིན།

$$
P =
\operatorname{version}\|
\operatorname{message\_id}\|
\operatorname{payload\_hash}\|
\operatorname{le32}(\operatorname{target\_domain})\|
\operatorname{commitment\_root}\|
\operatorname{le64}(\operatorname{finality\_height})\|
\operatorname{finality\_block\_hash}
$$

གསལ་བའི་གསལ་སྒྲགས་ཀྱི་ Byte འདི་ཡང་ ཝིན་ཌིང་གི་ལྡེ་མིག་ཚུ་ཨིན། ལྕགས་ཐག་བཟའ་ཚང་། ས་གནས་དང་ལྡེ་གཡོགཔ་ཚུ་གི་མིང་། སྲུང་སྐྱོབ་རྣམ་གཞག་། མགུ་འཐོམ་ལམ་ལུགས་། རྩིས་ཁྲ་ codec། མཇུག་བསྡོམས་རྣམ་གཞག་ དེ་ལས་ བརྒྱུད་འཛིན་གྱི་ དམིགས་གཏད་། བརྒྱུད་འཛིན་ backend བཟའ་ཚང་། ཡུན་ཚད་ལས་ སྔོན་སྒྲིག་འབད་ཡོད་པའི་ ལྕགས་རྟགས་/རྒྱབ་སྐྱོར་/མངོན་སུམ་ Fields དམིགས་ཡུལ་བཅའ་གཏུགས་ hash། account codec key, payload type, public input byte, and payload hash འདི་འདི་:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

འ་ནི་བརྟག་དཔྱད་ལམ་གྱི་དོན་ལུ་ FastPQ ཌེ་ཊ་ས་པི་སི་ ID འདི་ Blake2b ཌའི་ཇེསི་ཅིག་གི་ སྔོན་སྒྲིག་འབད་ཡོད་པའི་ ༡༦ བའི་ཊི་ཨིན་:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ བཀྲམ་སྤེལ་འབད་མི་འདི་:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

དེ་ལས་ FastPQ ཚད་འཛིན་གྱི་ཁྲིམས་ལུགས་དེ་དང་འཁྲིལ་ཏེ་དབྱེ་ཞིབ་འབདཝ་ཨིན།

OpenVerify བརྟག་ཞིབ་འབད་ནིའི་འགན་ཁུར་འདི་ SHA-256 ཨིན། SCCP བརྡ་དོན་རྒྱབ་ཕྱོགས་མིང་དང་ ཀ་ནོ་ནིཀསི་ FastPQ བརྟག་དཔྱད་འབད་ནིའི་འགྲེལ་བཤད་ནང་ལུ་:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

དུམ་གྲ་ཅིག་མ་བཙུགས། FastPQ བདེན་ཁུངས་འདི་ Norito-code འདི་ནང་ལུ་ `StarkFriOpenProofV1`, དེ་ལས་ སྦ་སྒོར་ནང་བཀབ་སྟེ་ `OpenVerifyEnvelope` backend དང་གཅིག་ཁར་ `Stark`. SCCP དབྱེ་ཞིབ་དེ་ཡང་ འདི་བཟུམ་སྦེ་ར་ བཟོ་དོ་ཡོདཔ་ཨིན། FastPQ བཀྲམ་སྤེལ་དང་གསལ་སྒྲགས་ནང་ལས་ བཀྲམ་སྟོན་འབད་ཞིནམ་ལས་ དབྱེ་ཞིབ་ཁུག་སྒོ་ཕྱེ་ཡོད་པའི་བརྟག་དཔྱད་ཐོ་བཀོད་ནང་ metadata བཏོན་གཏང་ཞིནམ་ལས་ FastPQ བསྐྱར་བཟོ་འབད་མི་ སྣུམ་འཁོར་གྱི་རྟགས་མཚན་དང་ དབྱེ་དཔྱད་འབད་ཐབས།

## པ་ར་མི་ཊར་ གཞི་སྒྲིག་ཚུ་ {#parameter-sets}

canonical parameter catalogue གིས་ parameters set གཉིས་བཏོན་ཡོདཔ་ཨིན། host prover lane འདི་ནང་ལུ་ `fastpq-lane-balanced` ལག་ལེན་འཐབ་ཨིན།

|ཁྱད་ཚད་ |དམིགས་གཏད་ |ས་ཁོངས་ |ཧེཤ་ |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |བཀྲམ་སྟོན་འབད་ནིའི་ཐོ་བཀོད་ཚད་མཉམ་ |Goldilocks quadratic extension |Poseidon2གི་ ཁས་བླངས་ཚུ་ ཐིག་ཁྲམ་ SHA3 ལུ་ཐོ་བཀོད་ |ཨེ་རི་ཊ་ 8, བཱལ་ཨོཕ་ 8, 46 དྲི་བཀོད་ |
|`fastpq-lane-latency` |དུས་ཡུན་ཐུང་ཀུ་ལུ་ གནོད་སྐྱོན་འབྱུང་ནིའི་ལམ་ |Goldilocks quadratic extension |Poseidon2གི་ ཁས་བླངས་ཚུ་ ཐིག་ཁྲམ་ SHA3 ལུ་ཐོ་བཀོད་ |arity 16, blowup 16, 34 དྲི་བཀོད་ |

གཉིས་ཆ་ར་གིས་ ༡༢༨ བི་ཊ་གི་ ཉེན་སྲུང་ལུ་ དམིགས་གཏད་འབད་དོ་ཡོདཔ་དང་ `2^16` གི་ ཌོ་མ་ནའི་ཐིག་ཚད་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། Rust V1 ཡིག་སྒྱུར་བསྐྱངས་ནི་གི་ code འདི་ ད་རེས་ Fiat-Shamir challenge bytes ལུ་ `iroha_crypto::Hash::new` ལུ་ཁ་ཐུག་ལས་ ཐད་ཀར་དུ་ SHA3-256 ལུ་ཁ་བསྒྱུར་འབདཝ་ཨིན།

Rust proverགིས་ལག་ལེན་འཐབ་མི་ ཐོ་བཀོད་ཡིག་རྒྱུན་གྱི་ རྟག་བརྟན་འདི་:

|རྟག་བརྟན་སྦེ་ |`fastpq-lane-balanced` |`fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
|`target_security` |                    128 |                   128 |
|`grinding_bits` |                     23 |                    21 |
|`trace_log_size` |                     16 |                    16 |
|`trace_root` |`0x002a247f81c6f850` |`0x6a9f4eb38fb9b892` |
|`lde_log_size` |                     19 |                    20 |
|`lde_root` |`0x60263388dbbf9b2a` |`0x9c9c3a571b6f89ac` |
|`permutation_size` |                 65,536 |                65,536 |
|`lookup_log_size` |                     19 |                    20 |
|`omega_coset` |`0x6af325e825ad5c18` |`0x3a5fd4171e3c3a4d` |
|`fri_arity` |                      8 |                    16 |
|`fri_blowup` |                      8 |                    16 |
|`fri_max_reductions` |                      8 |                     6 |
|`fri_queries` |                     46 |                    34 |

## བཟོ་བཀོད་ {#configuration}

FastPQ སྒྲིག་གཞི་འདི་ `zk.fastpq` གི་འོག་ལུ་བཞག་ཡོདཔ་ཨིན།

```toml
[zk.fastpq]
execution_mode = "auto"
poseidon_mode = "auto"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
metal_debug_fused = false
```

ལག་ལེན་དང་ གློག་ཐག་ར་བ་གི་མིང་ཐོ་འདི་ `irohad` ལས་ལོག་གཏང་ནི།

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

གནས་སྟངས་ཀྱི་འགྱུར་ལྡེ་ཚུ་ཡང་སྒྲིག་གཞི་གྱི་ས་ཁོངས་ཚུ་གི་དོན་ལུ་ རྒྱབ་སྐྱོར་འབད་ཡོདཔ་ཨིན། FastPQ གི་ཐད་ལུ་འགྱུར་ལྡེ་ཚུ་ཡང་:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`
- `FASTPQ_DEBUG_FUSED`

## ཚད་འཇལ་ཐངས་ཚུ་ {#metrics}

FastPQ གིས་ ཊེ་ལི་མེ་ཏྲ་འདི་ ལག་ལེན་འཐབ་པའི་སྐབས་ Backend བཙག་འཐུ་དང་ Metal Runtime སྤྱོད་ལམ་གི་དོན་ལུ་ metricཚུ་ཕྱིར་བཏོན་འབདཝ་ཨིན།

|Metric |དོན་དག་ |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |backend དང་འཕྲུལ་ཆས་གི་ཐོ་བཀོད་ལུ་བརྟེན་ requested and resolved execution mode |
|`fastpq_poseidon_pipeline_total` |Poseidon pipeline path requested དང་ resolved ཟེར་མི་འདི་ཨིན།|
|`fastpq_metal_queue_depth` |ལྕགས་ཀྱི་གྲལ་ཐིག་ཚད་, གནམ་གྲུ་ནང་ཨང་ཆེ་ཤོས་ཀྱི་གྲངས་རྩིས་, བཏང་ནིའི་གྲངས་རྩིས་, དང་དཔེ་བསྡུར་ སྒོ་སྒྲིག་ |
|`fastpq_metal_queue_ratio` |ལྕགས་ཀྱི་གྲལ་རིམ་ busy དང་ overlap ratios |
|`fastpq_zero_fill_duration_ms` |Metal runs གི་དོན་ལུ་ host zero-fill དུས་ཡུན་|
|`fastpq_zero_fill_bandwidth_gbps` |འབྱུང་ཁུངས། ཟིན་ཐོ་ཁྱབ་ཚད་ bandwidth |

སྤྱིར་བཏང་གྲུབ་འབྲས་དབྱེ་ཞིབ་གི་དོན་ལུ་ [གྲུབ་འབྲས་དང་རྩིས་ཐོ་བཀོད་](/dz/guide/advanced/metrics.md)ནང་ལུ་ གྲོས་བསྟུན་དང་གྲལ་རིམ་བརྡ་སྟོན་ཚུ་དང་གཅིག་ཁར་ ལག་ལེན་འཐབ་དགོ།

## འབྲེལ་བའི་ཁ་བྱང་ {#related-reference}

- [བཟོ་སྐྲུན་འབད་ཡོད་པའི་དབྱེ་བ་ཚུ་གི་དོན་ལུ་ ཌའི་ཊ་གི་རྣམ་གྲངས།](/dz/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ གདམ་ཁ་ཚུ་](/dz/reference/irohad-cli.md#arg-fastpq-execution-mode)
