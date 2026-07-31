---
translation_locale: fr
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ est Iroha C' est ... STARK Il ne remplace pas l'exécution normale de la transaction ou le consensus. Les transactions sont toujours en cours ISI, IVM, et Sumeragi comme d'habitude; FastPQ Consomme le témoin d'exécution déterministe et transforme les effets soutenus en lots de preuve.

L'intégration actuelle de l'hôte comporte trois voies principales:

- les transferts numériques transparents d'actifs enregistrés lors de l'exécution des blocs
- Nexus relais de voie vérifiés dont l'enveloppe d'épreuve AXT porte une liaison FastPQ
- Les aides à l'épreuve des messages transparentes SCCP qui enveloppent une preuve de FastPQ dans une enveloppe de vérification ouverte

## Transférer le chemin du témoignage {#transfer-witness-path}

Les transferts numériques transparents créent une transcription de transfert structurée lorsque l'instruction mutant les équilibres.

- le compte source, le compte de destination, la définition des actifs et le montant
- Les soldes de l'expéditeur et du destinataire avant et après le transfert
- le hash de point d'entrée de transaction utilisé comme hash du lot
- un résumé de l'autorité dérivé du compte soumis
- une digestion de Poseidon pour les transcriptions à delta unique

Les transferts de lot utilisent une transcription avec plusieurs delta. Dans ce cas, le digeste Poseidon à delta unique est absent.

Lors de la finalisation des blocs, Iroha regroupe ces transcriptions par hash d'entrée. Le témoin d'exécution porte ensuite les paquets de transcripts originaux et les lots de transition FastPQ préparés pour le prover.

Chaque delta de transfert devient deux rangées de transition:

|La rangée|La forme de la clé|Value préalable |Après-value |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Débit de l' expéditeur |`asset/<asset-definition>/<source-account>` |le solde de l' expéditeur avant |le solde de l' expéditeur après |
|Crédit au destinataire |`asset/<asset-definition>/<destination-account>` |le solde du destinataire avant |le solde du destinataire après |

Les valeurs numériques sont normalisées en unités de témoin entières. Une valeur est rejetée pour le lotage FastPQ si elle ne peut pas être représentée comme non négative `u64` à l'échelle décimale sélectionnée.

## Les entrées publiques {#public-inputs}

Chaque lot de transition FastPQ contient des entrées publiques qui lient la preuve au contexte du bloc et de l'exécution:

|L' entrée|Le sens .|
| ------------- | --------------------------------------------------------------- |
|`dsid` |Identificateur d' espace de données codé en octets minuscules |
|`slot` |Temps de création des blocs converti en nanosecondes |
|`old_root` |La racine de l' état des parents dérivée du témoin d' exécution |
|`new_root` |Une racine post-étatique dérivée du témoin de l' exécution |
|`perm_root` |Engagement de Poseidon sur les autorisations de rôle actif |
|`tx_set_hash` |Hash sur la transaction triée et les hashs de point d'entrée déclencheur de temps |

L'hôte utilise `fastpq-lane-balanced` comme paramètre canonique pour ces lots.

## Modèle mathématique {#mathematical-model}

Cette section décrit l'arithmétique mise en œuvre par le testeur et vérificateur Rust actuel.

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ utilise Poseidon2 sur `F` pour les engagements de champ. L'éponge a la largeur `t = 3`, le taux `r = 2` et la capacité `1`. Le hash absorbe des éléments de champ dans les blocs de taux-2 et ajoute un seul élément de champ `1` avant la permutaison finale:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Les chaînes en octets sont emballées dans des extrémités minuscules de 7 octets de sorte que chaque extrémité est strictement inférieure à `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Les hashes de champs séparés par domaine sont représentés comme suit:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Pour les hash qui démarrent à partir de digests de domaine en octets, FastPQ cartographient les huit premiers octets de petit indien dans le champ:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Ici, `Hash` désigne le `iroha_crypto::Hash::new` de Iroha, un digeste Blake2bVar de 32 octets, à moins qu'une formule ne donne explicitement les noms Poseidon2 ou SHA-256.

### L'arithmétique de champ {#field-arithmetic}

Le code Rust représente les éléments de champs en tant que valeurs canoniques `u64` dans `[0,p)`. L'addition et la soustraction sont:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

La multiplication calcule d'abord le produit à 128 bits:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

La réduction Goldilocks utilise alors l'identité:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Si:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

puis le réducteur compute:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

L'implémentation ajoute ou soustrait conditionnellement `p` jusqu'à ce que le résultat soit canonique.

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Permutation {#poseidon2-permutation}

L'état de permutation Poseidon2 est:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Son S-box est:

$$
S(x)=x^5
$$

FastPQ Il utilise quatre rondes complètes, cinquante-sept rondes partielles, puis quatre autres rondes completes. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` est:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Une ronde partielle est:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Toutes les addition et multiplication sont en `F`. La matrice canonique MDS est:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Le champ hash commence à partir de l'état zéro. Pour chaque bloc complet rate-2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Le dernier bloc ajoute le `1` L'élément de rembourrage avant une dernière permutation. `x_0`.

### Obligation de l'entrée publique {#public-input-binding}

L'hôte encode un id de l'espace de données en écrivant sa valeur `u64` dans les huit premiers octets petit-endian du champ de 16 bytes:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Le temps de création d'un bloc est converti de millisecondes en nanosecondes:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Le hash de l'ensemble des transactions est un hash de domaine en octets sur les hashs d'entrée triés:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

où `h_i` sont les hashes des transactions triées et des points d'entrée du déclencheur de temps. Dans la preuve publique IO, si `perm_root` ou `tx_set_hash` est totalement zéro, le prover remplit les valeurs de rétroaction:

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

### La normalisation numérique {#numeric-normalization}

Pour chaque delta de transfert, l'échelle décimale cible est la échelle maximale tranchée sur le montant et les deux instantanés d'équilibre:

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

Une `Numeric` valeur avec la mantissa `m` et l'échelle `q` n'est accepté que lorsque `m >= 0` et `q <= s`. Il est FastPQ la valeur du témoin est:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Le résultat normalisé doit correspondre à `u64`.

### Ordre canonique {#canonical-ordering}

Avant la construction des traces, le lot est trié par clé de transition, rang d'exploitation et indice d'insertion original:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

L'engagement de commande est un hachage de champ Poseidon2 sur le domaine `fastpq:v1:ordering` et le codage Norito des transitions triées:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

où `P` est un emballage de 7 bytes, `E` est Norito le codage, `D_o` est `fastpq:v1:ordering`, et `T*` est la liste de transition triée.

### Équations de transfert {#transfer-equations}

Pour un montant de transfert `a`, le solde de l'expéditeur `f` et le solde du destinataire `t`, FastPQ valide les valeurs des témoins normalisées avant la construction de la trace:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Les lignes de transition codent ensuite:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

À l'intérieur de la trace, les delta signés sont réduits à `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Le digeste de transfert unique-delta facultatif commande la préimage de transfert codée:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Pour les transcriptions de transfert multi-delta, le format actuel exige l'absence de ce digeste de haut niveau.

L'autorité d'accueil digère les transcriptions de transfert:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Les rangées de traces {#trace-rows}

La liste de transition triée doit contenir `n` La longueur de la trace est le prochain pouvoir de deux:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Les lignes `0..n-1` sont actives; les lignes `n..N-1` sont des lignes de rembourrage. Chaque ligne réelle possède un ensemble de sélecteur d'opération:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Toutes les colonnes de sélection sont booléennes:

$$
s(s-1)=0
$$

Les lignes de recherche des autorisations sont exactement les lignes d'attribution du rôle et de révocation du rôle:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Pour les lignes de l'opération numérique:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Le constructeur suit également les zones de delta par actif:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Seules les rangées de menthe et de brûlure mettent à jour le compteur d'approvisionnement:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Les méta-données et les colonnes traces de l'espace de données sont des hachages de champs dérivés avant la matérialisation de rangées:

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

Le hachage des métadonnées, le hachage de l'espace de données et la fente sont stables sur les lignes adjacentes de traces:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Transférer les colonnes de Merkle {#transfer-merkle-columns}

Les lignes de transfert portent un chemin Merkle rare à 32 niveaux. Si une preuve d'hôte manque, le prover synthétise un chemin déterministe à partir de la clé de ligne, du pré-équilibre et si la ligne est du côté expéditeur ou du côté récepteur.

Pour les chemins synthétiques, le sel aromatique est `fastpq:smt:from` pour les lignes d'expéditeur et `fastpq:smt:to` pour les lignées de récepteur:

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

Les feuilles et les nœuds internes sont:

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

La trace enregistre le bit. `b_l`, sœurs `s_l`, nœud d'entrée `x_l`, et le nœud de sortie `x_{l+1}` Avec la convention de branche du code:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Hashs d'autorisation {#permission-hashes}

Les lignes attribution et révocation de rôles hash le témoin d'autorisation:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

La table d'autorisation hôte trient les entrées par octets de rôle, octets de permission et octets d'époque, puis construit un arbre de Poseidon2 Merkle:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Les niveaux de largeur irrégulière dupliquent l'élément final.

### L'engagement à la trace {#trace-commitment}

Pour chaque colonne de trace `c`, FastPQ interpose d'abord les valeurs de la colonne sur le domaine de trace et hashes le vecteur du coefficient:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

La racine trace est une racine de Poseidon2 Merkle sur les engagements des colonnes:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

L'engagement de trace finale est un hash en octets sur le domaine, l'ensemble des paramètres, la forme de trace, les digestions de colonnes et la racine de trace:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

où `D_c` est `fastpq:v1:trace_commitment`.

### AIR Composition {#air-composition}

La valeur de composition V1 AIR est une combinaison linéaire de résidus locaux à la rangée.

$$
\alpha_0,\alpha_1 \in F
$$

Pour chaque paire de rangées adjacente `(i,i+1)`, le prover calcule:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Les résidus `rho` sont, dans l'ordre des codes:

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

Pour les lignes avec colonnes numériques:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Et pour les colonnes de contexte par lots stables:

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

Le vérificateur recompte `A_i` pour les ouvertures de rangées dans l'échantillon et le compare à la valeur de composition engagée en vertu de la racine Merkle de la composition AIR.

### Produit de recherche {#lookup-product}

L'accumulateur de recherche des autorisations utilise le défi Fiat-Shamir `gamma`. Au cours des évaluations d'extension à faible degré de `s_perm` et `perm_hash`, le produit en cours d'exécution est:

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

Les dossiers de preuve:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Extension à faible degré {#low-degree-extension}

Que `omega_T` soit le générateur de domaine de trace, `omega_E` le générator de domaine d'évaluation et `g` l'offset coset configuré. Pour une colonne de trace avec des valeurs `v_i`, l'interpolation produit des coefficients `a_j` tels que:

$$
f(\omega_T^i)=v_i
$$

L'extension à faible degré évalue le même polynôme sur le cosèt:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

La mise en œuvre le calcule en multipliant les coefficients par les pouvoirs du coset compensé avant FFT:

$$
a'_j = a_j g^j
$$

et ensuite évaluer `a'` sur le domaine d'évaluation.

Les États membres CPU FFT est une transformation iterative de radix-2 Cooley-Tukey sur les entrées inversées par bits. `L`, demi-longueur `H=L/2`, et la racine de l'étape:

$$
\omega_L=\omega^{N/L}
$$

chaque papillon fait le calcul:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

L'inverse FFT effectue la même transformation que `omega^{-1}` et s'échelle par la taille du domaine inverse:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Avant utilisation, les racines du catalogue sont validées:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Pour des domaines plus petits dérivés de la racine du catalogue, le générateur est:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Haches de rangée et de feuilles {#row-and-leaf-hashes}

Après LDE, FastPQ hash chaque rangée dans toutes les colonnes de LDE. Pour les colonnes `m`:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Si les hashes de rangées sont toujours dans le domaine trace plutôt que dans le domaine d'évaluation, le prover interpelle et étend cette colonne de hash de rangée unique avec le même processus coset LDE.

### Les ouvertures de Merkle {#merkle-openings}

Les valeurs LDE sont regroupées en morceaux de:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Chaque pièce de feuille est:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Les parents de Merkle sont:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Les niveaux odd dupliquent le dernier nœud. Les chemins de requête sont vérifiés en hashant à gauche ou à droite selon la parité de l'indice de feuille de requête à chaque niveau.

Pour une feuille à l'indice `i`, un chemin `(s_0,\ldots,s_{d-1})` est vérifié par rapport à la racine `R` par la récurrence de:

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

Le chèque ne passe que lorsque:

$$
y_d=R
$$

Les feuilles de rangées AIR sont:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

Les feuilles de composition AIR sont:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

L'ouverture de la requête LDE vérifie également que la valeur ouverte à l'indice d'évaluation `i` est présente dans sa partie authentifiée:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Plongé {#fri-folding}

FRI s'engage à AIR évaluations de la composition. `l`, Les échantillons de transcriptions sont un défi. `beta_l`. La couche est rembourrée à un multiple de l'arité en répétant la dernière valeur. Chaque groupe d'arité se replie pour:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

où `a` est l'arité de FRI. Le vérificateur vérifie, pour chaque chaîne de requêtes échantillonnée, que:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

et authentifie chaque groupe ouvert FRI par rapport à la racine de couche FRI correspondante.

### Transcription de l'entreprise Fiat-Shamir {#fiat-shamir-transcript}

Le catalogue des paramètres canoniques étiquette le hash de la transcription comme SHA3-256. L'implémentation actuelle du prover et du vérificateur dérive les octets de défi avec `iroha_crypto::Hash::new`, qui est un digeste Blake2bVar de 32 bytes, puis réduit les huit premiers octets de petit endien à `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Les appels de défi ajoutent le résumé complet à l'état de la transcription.

1. public IO, version du protocole, version des paramètres et nom du paramètre
2. LDE racine et racine des traces
3. `gamma`
4. Les défis en matière de composition AIR `alpha_0`, `alpha_1`
5. la racine des traces AIR et la racine de composition AIR
6. grand produit de recherche
7. Les racines des couches FRI et les défis de `beta_l`
8. indices de requête échantillonnés

L'échantillonnage de requête continue à dessiner des digests de défi de 32 octets et à les lire sous forme de morceaux `u64` jusqu'à ce qu'il ait le nombre d'indices uniques requis:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

L'ensemble échantillonné est retourné dans l'ordre trié.

### Reprise du vérificateur {#verifier-replay}

Le vérificateur recalcule d'abord l'engagement du lot:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

et nécessite:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Elle renouvelle également le public IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Chaque champ doit correspondre au public de la preuve IO octet par octet. Le vérificateur reconstruit ensuite la même transcription et en déduit le même:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Pour chaque requête dans l'échantillon `q`, il vérifie:

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

et:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

Les États membres AIR l'ouverture de composition doit être authentifiée sous `R_air_composition`. Les États membres FRI la chaîne commence alors à partir de la même `A_q` et doit se terminer par une définition authentifiée FRI feuille sous le terminal FRI la racine.

## Ce que vérifie le proverbe {#what-the-prover-checks}

Avant de construire la trace, le testeur FastPQ canonize l'ordre du lot par clé de transition, rang d'opération et ordre d'insertion. Les lignes de transfert nécessitent également des métadonnées de transcription.

En ce qui concerne les transcriptions de transfert, les vérifications à l'extrémité du document comprennent:

- le solde de l'expéditeur ne doit pas être inférieur au débit
- Le `sender_after` doit être égal à `sender_before - amount`
- Le `receiver_after` doit être égal à `receiver_before + amount`
- La transcription doit couvrir chaque ligne de transfert du lot.
- une digestion de Poseidon à un seul delta, lorsqu'elle est présente, doit correspondre à la préimage de la transcription.
- à condition que les preuves de Merkle rares soient décodées en version 1; les voies manquantes sont remplies de preuves synthétiques déterministes.

La trace contient des colonnes de sélection pour le transfert, la monnaie, la combustion, l'octroi du rôle, la révocation du rôle, le jeu de métadonnées et les lignes de recherche d'autorisations.

## Provérateur Lane {#prover-lane}

`irohad` démarre la voie du prover FastPQ au démarrage si le backend du prover peut être initialisé. La voie est une tâche d'arrière-plan avec une file d'attente délimitée. Après qu'un bloc produit un témoin d'exécution, le chemin de commande soumet un travail du prover contenant le bloc hash, la hauteur, la vue et le témoin.

Si la voie ne fonctionne pas ou si la file d'attente est pleine, le travail est omis et le traitement normal du bloc se poursuit. Cela signifie que la voie de l'arrière-plan prover n'est pas une entrée de transaction ou une passerelle de consensus.

L'allée construit un prover avec:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` Laissez le testeur choisir l'arrière-plan disponible. `cpu` l'exécution des pins à la CPU. `gpu` préférences GPU l'exécution, avec CPU fallback lorsque le backend ne peut pas utiliser les noyaux demandés.

## Vérification {#verification}

La vérification de la preuve FastPQ reconstruit l'engagement canonique du lot et remplace la transcription publique. Le vérificateur vérifie la version du protocole, la version définie par paramètres, les limites de répétition, l'engagment des traces, les entrées publiques, les ouvertures Merkle échantillonnées, les ouvres AIR et la chaîne de requêtes FRI.

Les limites de répétition par défaut comprennent:

|Limite .|Par défaut |
| ------------------ | ------: |
|Les lignes de transition |     256 |
|Taille de charge utile du lot |256 KiB |
|FRI couches |      16 |
|Les ouvertures de requêtes |     128 |

## Réseaux vérifiés Nexus {#nexus-verified-relays}

Nexus AXT les enveloppes de preuve peuvent intégrer un `AxtFastpqBinding`. Quand ? `RegisterVerifiedLaneRelay` l'exécute, Iroha:

1. vérifie l'enveloppe du relais de la voie et le matériau d'étanchéité FastPQ
2. vérifie l'espace de données et la racine du manifeste
3. décode l'enveloppe de preuve AXT
4. nécessite un `fastpq_binding`
5. reconstruit le lot FastPQ à partir de cette liaison;
6. décode la preuve intégrée FastPQ
7. appelle le vérificateur FastPQ sur le lot et la preuve reconstruits

Si la vérification réussit, Iroha stocke un `VerifiedLaneRelayRecord` contenant la référence du relais, l'enveloppe d'origine, le hash de charge utile de preuve, la hauteur de vérification, la racine manifeste et la liaison FastPQ.

Les enveloppes de relais de voie contiennent également un matériau de preuve compact FastPQ. Le matériau est une digestion sur l'identifiant de la voie, l'identification de l'espace de données, la hauteur du bloc, la hauteurs de vérification, le hash d'en-tête de bloc, le hash de règlement et la racine manifeste. Un relais n'est admissible à la fusion que s'il possède à la fois un matériau d'épreuve QC et un matériale d'éprouvation FastPQ valide.

### AXT Les mathématiques liées {#axt-binding-math}

Pour les enveloppes Nexus AXT, `AxtFastpqBinding` est canonisé avant la répétition de la preuve. Les valeurs par défaut du paramètre vide sont `fastpq-lane-balanced`; l'identifiant et la version par défaut des vérificateurs vides sont `fastpq` et `v1`; le type de réclamation est découpé et classé en bas.

Les entrées publiques AXT FastPQ sont des hashes de octets déterministes:

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

Les touches de transition AXT sont:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

Dans la demande `authorization` est insérée une ligne relative à l'octroi de crédits:

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

et une ligne de métadonnées liant la politique d'autorisation. La demande `compliance` insère deux lignes de métadonnée: une pour les politiques et une pour les espaces de données cibles.

Pour `tx_predicate` et `value_conservation`, une quantité d'effet explicite est utilisée lorsque la liaison contient un montant source ou de destination positif. Sinon, le code dérive d'une quantité déterministique limitée:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Ensuite, on utilise les mêmes équations de transfert:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Les identifiants de compte d'expéditeur et de destinataire synthétiques sont générés à partir de graines clés:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Le hash du lot de transfert est:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

Le dépôt du manifeste de lot AXT est SHA-256 sur le code Norito de l'association canonique:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Des preuves de messages transparents {#sccp-transparent-message-proofs}

La boîte d'aide SCCP utilise également FastPQ pour les preuves transparentes de messages à chaîne croisée. Ce chemin est séparé de la voie de vérification en arrière-plan `irohad`. Il construit un lot FastPQ directement à partir d'un paquet et d'un manifeste de preuves de message SCCP, puis enveloppe la preuve résultante pour une vérification ouverte.

Le lot SCCP utilise le `fastpq-lane-balanced` et trois transitions de métadonnées:

|La clé .|Opération |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Ses entrées publiques sont dérivées de la preuve interne transparente SCCP:

|FastPQ entrée |SCCP source |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Les 16 premiers octets d' une digestion de Blake2b sur la déclaration hash|
|`slot` |La hauteur de la finale |
|`old_root` |Hash de charge utile |
|`new_root` |La racine de l' engagement |
|`perm_root` |Hash du bloc de finalisation |
|`tx_set_hash` |Hachage de déclaration |

Les encodeurs canoniques SCCP écrivent des nombres entiers en minuscules et encodent les matrices de octets de longueur variable comme suit:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

La chaîne en octets d'entrée publique transparente est:

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

Les octets des déclarations transparents sont la concaténation de version, la famille de chaînes, les domaines locaux et contreparties, le modèle de sécurité, la gouvernance d'ancrage, le codec du compte, le modèle d'achèvement, l'objectif du vérificateur, la famille du backend du vérificteur, les champs chaîne/backend/manifestés préfixés à longueur, le hash liant destination; la clé codec de compte, le type de charge utile, les octets d'entrée publics et le hash de charge utile.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

L'identifiant de l'espace de données FastPQ pour ce chemin de preuve est les seize premiers octets d'un autre digeste Blake2b préfixé:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

Le lot SCCP FastPQ est exactement le:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

puis triés selon la même règle de commande FastPQ.

L'engagement du vérificateur OpenVerify est SHA-256 sur le nom de l'arrière-plan du message SCCP et le descripteur canonique du vérifiateur FastPQ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Le brut FastPQ la preuve est Norito- codé dans un `StarkFriOpenProofV1`, puis enveloppé dans un `OpenVerifyEnvelope` avec arrière-plan `Stark`. SCCP la vérification reconstruit le même FastPQ le lot du paquet et du manifeste, vérifie les métadonnées de l'enveloppe de vérification ouverte et appelle les FastPQ vérificateur sur le lot reconstruit et la preuve.

## Ensembles de paramètres {#parameter-sets}

Le catalogue des paramètres canoniques expose deux ensembles de paramètres. La voie d'accueil utilisant actuellement `fastpq-lane-balanced`.

|Paramètre |Objectif |champ |Les haches |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |un débit de fournisseur équilibré |L' extension quadratique de Goldilocks |Les engagements de Poseidon2, catalogue SHA3 étiquette |Résumé 8, explosion 8, 46 questions |
|`fastpq-lane-latency` |les voies sensibles à la latence |L' extension quadratique de Goldilocks |Les engagements de Poseidon2, catalogue SHA3 étiquette |Résumé 16, explosion 16, 34 questions |

Les deux cibles sont la sécurité à 128 bits et utilisent une taille de domaine de trace de `2^16`. Le code de répétition de transcription Rust V1 dérive actuellement les octets de défi Fiat-Shamir avec `iroha_crypto::Hash::new` plutôt que d'invoquer directement SHA3-256.

Les constantes de catalogue exactes utilisées par le proveur Rust sont les suivantes:

|Constante .|`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## Configuration {#configuration}

La configuration de FastPQ est placée sous `zk.fastpq`.

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

Les mêmes étiquettes d'exécution et de télémétrie peuvent être écartées à partir de `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Les variables d'environnement sont également pris en charge pour les champs de configuration. FastPQ-les variables spécifiques comprennent:

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

## Métriques {#metrics}

Lorsque la télémétrie est activée, FastPQ exporte des métriques pour la sélection de l'arrière-plan et le comportement en cours d'exécution de Metal:

|La métrique |Le sens .|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Le mode d' exécution demandé et résolu par backend et les étiquettes de l' appareil |
|`fastpq_poseidon_pipeline_total` |Voie du pipeline Poseidon demandée et résolue |
|`fastpq_metal_queue_depth` |Limite de file d'attente métallique, nombre maximal en vol, nombre d'expéditions et fenêtre de prélèvement |
|`fastpq_metal_queue_ratio` |La queue métallique est occupée et les rapports de chevauchement |
|`fastpq_zero_fill_duration_ms` |Durée de remplissage zéro pour les roulements métalliques |
|`fastpq_zero_fill_bandwidth_gbps` |Largeur de bande à remplissage zéro dérivée |

Pour la triation générale des performances, utilisez-les avec les signaux de consensus et de file d'attente énumérés dans [Performance and Metrics ](/fr/guide/advanced/metrics.md).

## Références connexes {#related-reference}

- [Schéma de modèle de données ](/fr/reference/data-model-schema.md) pour les détails du type généré
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [Les options `irohad` FastPQ](/fr/reference/irohad-cli.md#arg-fastpq-execution-mode)
