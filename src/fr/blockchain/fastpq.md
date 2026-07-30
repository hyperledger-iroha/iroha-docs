---
translation_locale: fr
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f3fbbec3a88de06dcfb733e85f834fa98afdb29df411a193c08f26f6b2cd943
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ

FastPQ est Irohale chemin de la preuve STARK pour les effets d'exécution sélectionnés.
ne remplace pas l'exécution normale des transactions ou le consensus.
passer par l'ISI, IVM, et Sumeragi comme d'habitude; FastPQ consomme le
l'exécution déterministe témoigne et transforme les effets soutenus en preuve
des lots.

L'intégration actuelle de l'hôte comporte trois voies principales:

- transferts numériques transparents d'actifs enregistrés lors de l'exécution de blocs
- Les relais de voie vérifiés Nexus dont l'enveloppe AXT porte un FastPQ
  liant
- Les aides à la preuve de message transparentes du SCCP qui enveloppent une preuve de FastPQ dans une
  enveloppe de vérification ouverte

## La voie du témoignage

Les transferts numériques transparents créent une transcription de transfert structurée lorsque
L'instruction change les équilibres.

- le compte source, le compte de destination, la définition des actifs et le montant
- les soldes de l'expéditeur et du destinataire avant et après le transfert
- le hash de point d'entrée de transaction utilisé comme hash de lot
- un résumé de l'autorité dérivé du compte soumis
- une digestion Poseidon pour les transcriptions à delta unique

Les transferts de lots utilisent une transcription avec plusieurs delta.
Poseidon digeste à delta unique est omis jusqu'à ce que les digestes à delta sont
Il est disponible.

À la finalisation du bloc, Iroha regroupe ces transcriptions par hash de point d'entrée.
Le témoin de l'exécution porte alors les paquets originaux de transcriptions et
les lots de transition FastPQ préparés pour le testeur.

Chaque delta de transfert devient deux lignes de transition:

| Régie             | La forme de la clé                                        | Value préalable               | Value postérieure             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| Débit par expéditeur    | `asset/<asset-definition>/<source-account>`      | le solde de l'expéditeur avant   | le solde de l'expéditeur après   |
| Crédit au destinataire | `asset/<asset-definition>/<destination-account>` | le solde du destinataire avant | le solde du destinataire après |

Les valeurs numériques sont normalisées en unités entières témoins.
rejeté pour les lots FastPQ s'il ne peut pas être représenté comme non négatif
`u64` à l'échelle décimale sélectionnée.

## Les entrées publiques

Chaque lot de transition FastPQ contient des entrées publiques qui lient la preuve à
le contexte du bloc et de l'exécution:

| Résultats de l'enquête         | La signification                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | Identificateur d'espace de données codé en octets de petite taille             |
| `slot`        | Temps de création de blocs converti en nanosecondes                    |
| `old_root`    | L'état-maître de l'exécution dérivé du témoin            |
| `new_root`    | Racine post-étatique dérivée du témoin de l'exécution              |
| `perm_root`   | L'engagement de Poseidon sur les autorisations de rôle actif                |
| `tx_set_hash` | Hash sur les transactions triées et les hashs d'entrée de point de déclenchement de temps |

L' hôte utilise `fastpq-lane-balanced` en tant que paramètre canonique défini pour
ces lots.

## Modèle mathématique

Cette section décrit l'arithmétique mise en œuvre par la Rust actuelle
Toutes les opérations sur le terrain se déroulent au-dessous des Goldenilocks.
champ principal:

$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$

FastPQ utilise Poseidon2 sur `F` L'éponge a une largeur
`t = 3`, taux `r = 2`, et la capacité `1`. Le hachage absorbe les éléments de champ dans
le taux-2 bloque et ajoute un seul élément de champ `1` avant la finale
la permutation:

$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$

Les chaînes en octets sont emballées dans des membres enendiens de 7 octets de sorte que chaque membre est
strictement ci-dessous `p`- Je ne sais pas.

$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$

Les hashs de champs séparés par domaine sont représentés comme suit:

$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$

Pour les hash qui commencent par des digests de domaine en octets, FastPQ cartographies les huit premiers
octets de petit endien dans le champ:

$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$

Je vous en prie. `Hash` les moyens IrohaJe suis là . `iroha_crypto::Hash::new`, un Blake2bVar de 32 octets
digeste, à moins qu'une formule ne donne explicitement des noms Poseidon2 ou SHA-256.

### L'arithmétique de champ

Le code Rust représente les éléments de champs comme canoniques `u64` les valeurs en
`[0,p)`. L'addition et la soustraction sont:

$
a +_F b = (a+b)\bmod p
$

$
a -_F b = (a-b)\bmod p
$

La multiplication calcule d'abord le produit de 128 bits:

$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$

La réduction de l'orlot utilise alors l'identité:

$
2^{64}\equiv2^{32}-1\pmod p
$

Si:

$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$

le réducteur compute ensuite:

$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$

La mise en œuvre ajoute ou soustrait conditionnellement `p` jusqu'à ce que le résultat soit
Les nombres entiers signés, tels que les deltas d'équilibre, sont intégrés par:

$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$

### Poseidon2 Permutation

L'état de permutation de Poseidon2 est:

$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$

Sa boîte S est:

$
S(x)=x^5
$

FastPQ utilise quatre tours complets, cinquante-sept tours partiels, puis quatre autres
Une ronde complète avec des constantes rondes
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` est:

$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$

Une ronde partielle est:

$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$

Toutes les additions et multiplication sont en `F`La matrice MDS canonique est:

$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$

Le hash du champ commence à partir de l'état zéro.
`(u,v)`- Je ne sais pas.

$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$

Le dernier bloc ajoute le `1` élément de rembourrage avant la dernière
La sortie est `x_0`- Je ne sais pas .

### Obligatoire pour les entrées publiques

L' hôte encode un identifiant d' espace de données en écrivant son `u64` valeur dans la première
huit octets de petit indien du champ de 16 octets:

$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$

Le temps de création de blocs est converti de millisecondes en nanosecondes:

$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$

Le hash de transaction est un hash de domaine en octets sur le point d'entrée trié
les haches:

$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$

où `h_i` sont des hashes de point d'entrée de transaction tricotés et de déclencheur de temps.
l'IO de preuve publique, si `perm_root` ou `tx_set_hash` est tout à zéro, le
le prover remplit les valeurs de retrait:

$
\operatorname{perm\_root} =
\begin{cases}
0^{32},& \text{if there are no permission hashes}\\
\operatorname{Hash}(\texttt{fastpq:v1:perm\_root}\|p_0\|\cdots\|p_{n-1}),
& \text{otherwise}
\end{cases}
$

$
\operatorname{tx\_set\_hash}_{fallback} =
\operatorname{Hash}(\texttt{fastpq:v1:tx\_set}\|\operatorname{ordering\_hash})
$

### Normalisation numérique

Pour chaque delta de transfert, l'échelle décimale cible est la taille maximale
l'échelle sur le montant et les instantanés de l'équilibre:

$
s =
\max(
\operatorname{scale}(a),
\operatorname{scale}(f_0),
\operatorname{scale}(f_1),
\operatorname{scale}(t_0),
\operatorname{scale}(t_1)
)
$

Une `Numeric` valeur avec mantissa `m` et l'échelle `q` n'est accepté que lorsque
`m >= 0` et `q <= s`Sa valeur de témoin FastPQ est:

$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$

Le résultat normalisé doit s'intégrer `u64`- Je ne sais pas .

### Ordre canonique

Avant la construction des traces, le lot est trié par clé de transition, opération
rang et indice d'insertion original:

$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$

L'engagement de commande est un champ Poseidon2 hash sur le domaine
`fastpq:v1:ordering` et le Norito codification des transitions triées:

$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$

où `P` est un emballage de 7 bytes, `E` est Norito la codification, `D_o` est
`fastpq:v1:ordering`, et `T*` est la liste de transition triée.

### Équations de transfert

Pour un montant de transfert `a`, équilibre de l'expéditeur `f`, et le solde du destinataire `t`Il y en a .
FastPQ valide les valeurs normalisées des témoins avant de construire la trace:

$
f_0 \geq a
$

$
f_1 = f_0 - a
$

$
t_1 = t_0 + a
$

Les lignes de transition codent ensuite:

$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$

$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$

À l'intérieur de la trace, les delta signés sont réduits en `F`- Je ne sais pas.

$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$

Le digeste de transfert de delta unique facultatif commet le transfert codé
préimage:

$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$

Pour les transcriptions de transfert multi-delta, le code actuel exige ceci:
la digestion de niveau supérieur doit être absente jusqu'à ce que les plomberie à digestion par delta soient disponibles.

L'autorité d'accueil digère pour les transcriptions de transfert:

$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$

### Les rangées de traces

La liste de transitions triée doit contenir `n` la longueur de la trace est
la puissance suivante de deux:

$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$

Les rangées `0..n-1` sont actives; rangées `n..N-1` Chaque vraie rangée a
un ensemble de sélecteurs d'opération:

$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$

Toutes les colonnes de sélecteur sont booléennes:

$
s(s-1)=0
$

Les lignes de recherche des autorisations sont exactement les lignes d'octroi de rôles et de révocation de rôles:

$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$

Pour les lignes d'opération numérique:

$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$

Le constructeur suit également les delta par actif:

$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$

Seules les rangées de menthe et de brûlure mettent à jour le compteur d'approvisionnement:

$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$

Les méta-données et les colonnes traces de l'espace de données sont des hachages de champs dérivés avant la ligne
matérialisation:

$
\operatorname{metadata\_hash} =
\begin{cases}
0,& \text{if metadata is empty}\\
H_D(E(\text{metadata})),& \text{otherwise}
\end{cases}
$

$
\operatorname{dsid\_trace}=H_D(\operatorname{public\_input\_dsid})
$

Le hachage des métadonnées, le hachage de l'espace de données et la fente sont stables à travers les espaces adjacents
les lignes de traces:

$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$

$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$

$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$

### Transférer les colonnes de Merkle

Les lignes de transfert portent un chemin de Merkle rare de 32 niveaux.
manquant, le prover synthétise un chemin déterministe à partir de la touche de ligne,
pré-équilibre, et si la ligne est du côté expéditeur ou du côté récepteur.

Pour les chemins synthétiques, le sel de saveur est `fastpq:smt:from` pour les rangées d'expéditeur
et `fastpq:smt:to` pour les rangées de récepteurs:

$
K =
\operatorname{Hash}(\texttt{fastpq:smt:key|}\|\operatorname{salt}\|\operatorname{key})
$

$
V =
\operatorname{Hash}(\texttt{fastpq:smt:value|}\|\operatorname{salt}\|\operatorname{le64}(\operatorname{balance}))
$

$
b_\ell = \operatorname{bit}_\ell(K)
$

$
s_\ell =
\operatorname{Hash}(
\texttt{fastpq:smt:sibling|}\|
\operatorname{le64}(\ell)\|K\|\operatorname{le64}(\operatorname{balance})\|\operatorname{salt}
)
$

Les feuilles synthétiques et les nœuds internes sont:

$
L = \operatorname{Hash}(
\texttt{fastpq:smt:leaf|}\|
K\|V
)
$

$
N_{\ell+1} =
\operatorname{Hash}(
\texttt{fastpq:smt:node|}\|
\operatorname{left}_\ell\|
\operatorname{right}_\ell
)
$

La trace enregistre le bit. `b_l`, frère `s_l`, nœud d'entrée `x_l`, et
nœud de sortie `x_{l+1}` Avec la convention de branche du code:

$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$

### Hashs de permis

Les lignes d' accord et de révocation de rôles hash le témoin de permis:

$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$

La table d'autorisation de l'hôte sort les entrées par octets de rôle, autorisation
en octets, et en octets d'époque, puis construit un arbre de Merkle Poseidon:

$
M_0[j]=h_{\text{perm},j}
$

$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$

Les niveaux de largeur odd dupliquent l'élément final.

### L'engagement de trace

Pour chaque colonne de traces `c`, FastPQ interpelle d' abord les valeurs des colonnes sur
le domaine de trace et le vecteur de coefficient hash:

$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$

La racine trace est une racine de Poseidon2 Merkle sur les engagements de colonne:

$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$

L'engagement de trace final est un hash en octets sur le domaine, paramètre,
forme de traces, digestion des colonnes et racine de traces:

$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$

où `D_c` est `fastpq:v1:trace_commitment`- Je ne sais pas .

### Composition de l'air

La valeur de composition V1 AIR est une combinaison linéaire de résidus locaux de rangée.
Les échantillons de transcriptions présentent deux défis:

$
\alpha_0,\alpha_1 \in F
$

Pour chaque paire de rangées adjacente `(i,i+1)`, l'expert compute:

$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$

Les résidus `rho` sont, dans l'ordre du code:

$
\rho=s(s-1)
\quad\text{for each selector column}
$

$
\rho =
s_{\text{active}} -
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}}+
s_{\text{role\_grant}}+s_{\text{role\_revoke}}+s_{\text{meta\_set}})
$

$
\rho =
s_{\text{perm}}-(s_{\text{role\_grant}}+s_{\text{role\_revoke}})
$

$
\rho =
s_{\text{active},i+1}(1-s_{\text{active},i})
$

Pour les lignes avec colonnes numériques:

$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$

Et pour les colonnes de contexte de lot stables:

$
\rho =
\operatorname{metadata\_hash}_i-\operatorname{metadata\_hash}_{i+1}
$

$
\rho =
\operatorname{dsid}_i-\operatorname{dsid}_{i+1}
$

$
\rho =
\operatorname{slot}_i-\operatorname{slot}_{i+1}
$

Le vérificateur recompte `A_i` pour les ouvertures de rangées échantillonnées et les contrôles
contre la valeur de composition engagée dans le cadre de la composition AIR Merkle
la racine.

### Produit de recherche

L'accumulateur de recherche de permis utilise le défi Fiat-Shamir `gamma`- Je ne sais pas .
En ce qui concerne les évaluations d'extension à faible degré de `s_perm` et `perm_hash`, le
le produit courant est:

$
z_0=1
$

$
z_{i+1}=
\begin{cases}
z_i\cdot(w_i+\gamma),& s_{\text{perm},i}\ne0\\
z_i,& s_{\text{perm},i}=0
\end{cases}
$

Les dossiers de preuve:

$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$

### Extension à faible degré

Laissez `omega_T` être le générateur de domaine de suivi, `omega_E` le
générateur de domaine d'évaluation, et `g` l'offset de coset configuré. Pour un
colonne trace avec des valeurs `v_i`, l'interpolation produit des coefficients `a_j`
tels que:

$
f(\omega_T^i)=v_i
$

L'extension à faible degré évalue le même polynôme sur le coset:

$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$

La mise en œuvre complète ce calcul en multipliant les coefficients par les pouvoirs de
le coefficient de compensation avant FFT:

$
a'_j = a_j g^j
$

et ensuite évaluer `a'` dans le domaine de l'évaluation.

La CPU FFT est une transformation iterative radix-2 Cooley-Tukey sur
Les entrées inversées par bits. `L`, demi-longueur `H=L/2`, et de la scène
la racine:

$
\omega_L=\omega^{N/L}
$

chaque papillon compte:

$
u=x_j
$

$
v=x_{j+H}\cdot\omega_L^j
$

$
x_j'=u+v,\qquad x_{j+H}'=u-v
$

La FFT inverse effectue la même transformation avec `omega^{-1}` et les balances par le
taille de domaine inverse:

$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$

Les racines du catalogue sont validées avant utilisation:

$
\omega^{2^k}=1
$

$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$

Pour les petits domaines dérivés de la racine du catalogue, le générateur est:

$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$

### Les haches de rangées et de feuilles

Après LDE, FastPQ hashes chaque ligne sur toutes les colonnes LDE. `m` les colonnes:

$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$

Si les hashes de ligne sont toujours sur le domaine de trace plutôt que sur l'évaluation
domaine, le prover interpelle et étend cette colonne de hash de ligne unique
avec le même procédé de LDE coset.

### Les ouvertures de Merkle

Les valeurs de LDE sont regroupées en morceaux de:

$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$

Chaque morceau de feuille est:

$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$

Les parents de Merkle sont:

$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$

Les niveaux étranges dupliquent le dernier nœud.
droit selon la parité de l'indice de feuille de requête à chaque niveau.

Pour une feuille à l'index `i`, un chemin `(s_0,\ldots,s_{d-1})` vérifient par rapport à
racine `R` par récurrence:

$
y_0=L_i
$

$
y_{k+1}=
\begin{cases}
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),y_k,s_k),
& \lfloor i/2^k\rfloor \equiv 0 \pmod 2\\
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),s_k,y_k),
& \lfloor i/2^k\rfloor \equiv 1 \pmod 2
\end{cases}
$

Le chèque ne passe que lorsque:

$
y_d=R
$

Les feuilles de rangées de traces AIR sont:

$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$

Les feuilles de composition AIR sont:

$
L^{\text{comp}}_i = H_D(i\|A_i)
$

L'ouverture de la requête LDE vérifie également si la valeur ouverte à l'indice d'évaluation
`i` est présent dans sa pièce authentifiée:

$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$

$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$

$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$

### Réglage de l'IRF

L'IRF s'engage à effectuer des évaluations de la composition de l'air. `l`, le
échantillons de transcriptions un défi `beta_l`La couche est rembourrée à un multiple
de l'arité en répétant la dernière valeur.

$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$

où `a` Le vérificateur vérifie, pour chaque requête échantillonnée
chaîne, qui:

$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$

et authentifie chaque groupe FRI ouvert contre la couche FRI correspondante
la racine.

### Transcription de Fiat-Shamir

Le catalogue de paramètres canoniques étiquette le hash de transcription comme SHA3-256.
L'implémentation actuelle de prover et de vérificateur dérive des octets de défi avec
`iroha_crypto::Hash::new`, ce qui est une digestion de 32 bytes Blake2bVar, alors
réduit les huit premiers bytes de petit indien en `F`- Je ne sais pas.

$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$

Les appels de défi ajoutent le résumé complet à l'état de la transcription.
l'ordre est le suivant:

1. public IO, version du protocole, version du paramètre et nom du paramètre
2. Racine et traces de LDE
3. `gamma`
4. Défis liés à la composition de l'air `alpha_0`Il y en a . `alpha_1`
5. Racine des traces de l'air et racine de la composition de l'air
6. grand produit
7. Les racines de la couche IRF et `beta_l` Les défis
8. Indices de requête échantillonnés

L'échantillonnage de requête continue à dessiner des digests de défi de 32 bytes et les lit comme
petit endien `u64` les morceaux jusqu'à ce qu'il ait le nombre d'unités uniques demandé
indices:

$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$

L'ensemble échantillonné est retourné dans l'ordre trié.

### Reprise du vérificateur

Le vérificateur recalcule d'abord l'engagement du lot:

$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$

et nécessite:

$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$

Elle rétablit également les IO publiques:

$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$

Chaque champ doit correspondre à l'OI public de la preuve par octet par octet.
puis reconstruit la même transcription et dérive la même:

$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$

Pour chaque requête échantillonnée `q`, il vérifie:

$
\operatorname{MerkleVerify}(
R_{\text{lde}},
L_{\lfloor q/B_{\text{lde}}\rfloor},
\lfloor q/B_{\text{lde}}\rfloor,
\pi_{\text{lde}}
)
$

$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_q,
q,
\pi_{\text{air,current}}
)
$

$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_{q+1\bmod N_{\text{eval}}},
q+1\bmod N_{\text{eval}},
\pi_{\text{air,next}}
)
$

et:

$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$

L'ouverture de la composition AIR doit être authentifiée par: `R_air_composition`- Je ne sais pas .
La chaîne de l'IRF commence alors à partir du même `A_q` et doit se terminer par un
la feuille finale FRI authentifiée sous la racine FRI terminale.

## Ce que vérifie le proverbe

Avant de construire la trace, le testeur FastPQ canonique l'ordre de lot
par clé de transition, rang d'opération et ordre d'insertion.
nécessitent des métadonnées de transcription. Un lot avec des lignes de transfert mais pas de transfert
les transcriptions sont invalides.

Pour les transcriptions de transfert, les vérifications à l'extérieur comprennent:

- le solde de l'expéditeur ne doit pas être inférieur
- `sender_after` doit être égal `sender_before - amount`
- `receiver_after` doit être égal `receiver_before + amount`
- la transcription doit couvrir chaque ligne de transfert du lot
- une digestion de Poseidon à delta unique, lorsqu'elle est présente, doit correspondre à la transcription
  préimage
- à condition que les preuves de Merkle rares doivent être décodées en version 1; les chemins manquants sont
  remplies de preuves synthétiques déterministes

La trace contient des colonnes de sélection pour le transfert, la menthe, la combustion, la remise de rôles,
révocation de rôle, ensemble de métadonnées et lignes de recherche d'autorisation.
Les lignes contiennent également des deltas signées, des deltas par actif et des fournitures
Les comptoirs.

## Le professeur Lane

`irohad` démarre la voie de l'analyseur FastPQ au démarrage si l'arrière-plan de l'analyseur peut
La voie est une tâche d'arrière-plan avec une file d'attente limitée.
Le bloc produit un témoin d'exécution, le chemin du délit soumet un travail de vérificateur
contenant le bloc hash, la hauteur, la vue et le témoin.

Si la voie ne fonctionne pas ou si la file d'attente est pleine, le travail est omis et
Le traitement normal des blocs se poursuit.
Ce n'est pas un portail d'admission ou de consensus de transaction.
chemin sur l'état qui a déjà été exécuté.

La voie construit un prover avec:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` laisse le testeur choisir le backend disponible. `cpu` l'exécution des pins
à la CPU. `gpu` préférer l'exécution de la GPU, avec une chute de la CPU où le
le backend ne peut pas utiliser les noyaux demandés.

## Vérification

La vérification à la preuve de la rapidité de la PQ renouvelle l'engagement canonique du lot et
Le vérificateur vérifie la version du protocole,
la version de paramètre-ensemble, les limites de lecture, l'engagement en matière de trace, les entrées publiques,
les ouvertures Merkle, les ouvertures AIR et la chaîne de requêtes FRI ont été échantillonnées.

Les limites de lecture par défaut comprennent:

| Limite              | Par défaut |
| ------------------ | ------: |
| Les lignes de transition    |     256 |
| Taille de charge utile du lot | 256 KiB |
| Les couches de l'IRF         |      16 |
| Les ouvertures de requêtes     |     - le nombre de personnes concernées |

## Relais vérifiés Nexus

Les enveloppes à épreuve Nexus AXT peuvent intégrer un `AxtFastpqBinding`Quand ?
`RegisterVerifiedLaneRelay` exécute, Iroha- Je ne sais pas.

1. vérifie l'enveloppe du relais de la voie et le matériau à épreuve FastPQ
2. Vérifie l'espace de données et la racine du manifeste
3. décode l'enveloppe de preuve AXT
4. nécessite une `fastpq_binding`
5. reconstruit le lot FastPQ à partir de cette liaison
6. décode la preuve FastPQ intégrée
7. appelle le vérificateur FastPQ sur le lot reconstruit et la preuve

Si la vérification réussit, Iroha dépôt un `VerifiedLaneRelayRecord`
contenant la référence du relais, l'enveloppe originale, le hash de charge utile de preuve,
hauteur de vérification, racine manifeste et liaison FastPQ.

Les enveloppes de relais de voie sont également équipées d'un matériau compact à épreuve de FastPQ.
est un digeste sur l'identifiant de la voie, l'identifiant de l'espace de données, la hauteur du bloc, la vérification
hauteur, hash d'en-tête de bloc, hash de règlement et racine manifeste.
fusion admissible uniquement lorsqu'elle dispose à la fois d'une preuve de qualité et d'une preuve de FastPQ valide
le matériel.

### AXT mathématiques obligatoires

Pour les enveloppes Nexus AXT, `AxtFastpqBinding` est canonisé avant la preuve
les valeurs de paramètre vide par défaut à `fastpq-lane-balanced`• vide
id du vérificateur et version par défaut à `fastpq` et `v1`; le type de réclamation est coupé
et réduits à la baisse.

Les entrées publiques AXT FastPQ sont des hashes de octets déterministes:

$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$

$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$

$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$

$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$

$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$

$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$

Les clés de transition AXT sont:

$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$

Les `authorization` la demande insère une rangée d'allocation de rôle:

$
\operatorname{role\_id}=\operatorname{claim\_digest}
$

$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$

$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$

La politique d'autorisation est liée par une ligne de métadonnées. `compliance` réclamation
Il insère deux lignes de métadonnées: une pour les politiques et une pour les bases de données cibles.

Pour `tx_predicate` et `value_conservation`, un montant explicite de l'effet est
utilisé lorsque la liaison contient un montant source ou de destination positif.
Dans le cas contraire, le code dérive d'une quantité déterministe limitée:

$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$

Ensuite, les mêmes équations de transfert sont utilisées:

$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$

$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$

Les identifiants synthétiques des comptes d'expéditeur et de destinataire sont générés à partir de graines clés:

$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$

Le hash du lot de transfert est:

$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$

Le dépistage du manifeste du lot AXT est SHA-256 sur le Norito le codage de la
lier canonique:

$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$

## Les preuves du message transparent du SCCP

La boîte d'aide du SCCP utilise également FastPQ pour des messages transversaux transparents
Ce chemin est séparé de la `irohad` - Il y a une piste d'arrivée.
construit un lot FastPQ directement à partir d'un paquet de preuve de message SCCP et
l'écriture de l'écriture de l'écriture de l'écriture de l'écriture de l'écriture de l'écriture;

Utilisation du lot SCCP `fastpq-lane-balanced` et trois transitions de métadonnées:

| La clé                             | L'opération |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Ses entrées publiques sont dérivées de la preuve interne transparente du SCCP:

| Résultats de l'analyse  | Source de la SCCP                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | Les 16 premiers octets d'une digestion Blake2b sur la déclaration hash |
| `slot`        | Hauteur de finalisation                                            |
| `old_root`    | Hash de charge utile                                               |
| `new_root`    | Root de l'engagement                                            |
| `perm_root`   | Hash du bloc de finalisation                                        |
| `tx_set_hash` | Hash de déclaration                                             |

Les encodeurs canoniques du SCCP écrivent des nombres entiers petit-endian et encodent
les matrices en octets de longueur variable comme suit:

$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$

La chaîne en octets d'entrée publique transparente est:

$
P =
\operatorname{version}\|
\operatorname{message\_id}\|
\operatorname{payload\_hash}\|
\operatorname{le32}(\operatorname{target\_domain})\|
\operatorname{commitment\_root}\|
\operatorname{le64}(\operatorname{finality\_height})\|
\operatorname{finality\_block\_hash}
$

Les octets transparents sont la concaténation de version, chaîne
domaines familiaux, locaux et de contrepartie, modèle de sécurité, gouvernance de l'ancre,
codec de compte, modèle de finalisation, cible du vérificateur, famille de backend du vérificateur,
champs de chaîne/arrière-plan/manifeste préfixés à la longueur, hash de liaison de destination,
la clé codec de compte, le type de charge utile, les octets d'entrée publics et le hash de charge utile.
hash de la déclaration est:

$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$

L' id du espace de données FastPQ pour ce chemin de preuve est les 16 premiers octets de
un autre digeste Blake2b préfixe:

$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$

Le lot FastPQ du SCCP est exactement:

$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$

$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$

$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$

puis trié selon la même règle de commande FastPQ.

L'engagement du vérificateur OpenVerify est SHA-256 sur le backend du message SCCP
nom et descripteur canonique du vérificateur FastPQ:

$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$

La preuve brute de FastPQ est Norito- codé dans un `StarkFriOpenProofV1`, alors
enveloppé dans un `OpenVerifyEnvelope` avec arrière-plan `Stark`- vérification du SCCP
reconstruit le même lot FastPQ à partir du paquet et du manifeste, vérifie le
ouvrir les métadonnées de l'enveloppe de vérification et appeler le vérificateur FastPQ sur le
Le lot reconstruit et la preuve.

## Ensembles de paramètres

Le catalogue de paramètres canoniques expose deux ensembles de paramètres.
usages actuels de prover lane `fastpq-lane-balanced`- Je ne sais pas .

| Paramètre              | Le but                    | champs                          | Les haches                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | débit équilibré de l'appareil | L'extension quadratique de Goldilocks | Les engagements de Poseidon2, étiquette SHA3 du catalogue | Résumé de l'article 8, résumé de l'article 8   |
| `fastpq-lane-latency`  | voies sensibles à la latence    | L'extension quadratique de Goldilocks | Les engagements de Poseidon2, étiquette SHA3 du catalogue | Résumé de l'article 16 |

Ils visent à la fois la sécurité à 128 bits et utilisent une taille de domaine de trace de `2^16`Le ...
Le code de répétition de la transcription Rust V1 dérive actuellement du défi Fiat-Shamir
octets avec `iroha_crypto::Hash::new` au lieu d'invoquer directement
SHA3-256.

Les constantes de catalogue exactes utilisées par le testeur Rust sont:

| Constante             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    - le nombre de personnes concernées |                   - le nombre de personnes concernées |
| `grinding_bits`      |                     23 - La réforme |                    Les États membres |
| `trace_log_size`     |                     16 |                    16 |
| `trace_root`         |   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 Les États membres |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 Les États membres |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 Les États membres |                    16 |
| `fri_blowup`         |                      8 Les États membres |                    16 |
| `fri_max_reductions` |                      8 Les États membres |                     6 |
| `fri_queries`        |                     Les États membres |                    Les États membres |

## Configuration

La configuration FastPQ est ancrée sous `zk.fastpq`- Je ne sais pas .

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

Les mêmes étiquettes d'exécution et de télémétrie `irohad`- Je ne sais pas.

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Les variables d'environnement sont également prises en charge pour les champs de configuration.
Les variables spécifiques au FastPQ comprennent:

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

## Mesures

Lorsque la télémétrie est activée, FastPQ exporte des métriques pour la sélection de backend et
Le comportement de l'exécution métallique:

| Métrique                            | La signification                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | Mode d'exécution demandé et résolu par backend et étiquettes de périphériques          |
| `fastpq_poseidon_pipeline_total`  | Voie du pipeline Poseidon demandée et résolue                               |
| `fastpq_metal_queue_depth`        | Limite de file d'attente métallique, nombre maximal de vol, nombre d'expéditions et fenêtre d'échantillonnage |
| `fastpq_metal_queue_ratio`        | Les rapports d'occupation et de chevauchement des files d'attente métalliques                                         |
| `fastpq_zero_fill_duration_ms`    | Durée de remplissage de l'hôte zéro pour les circuits métalliques                                      |
| `fastpq_zero_fill_bandwidth_gbps` | Largeur de bande de remplissage à zéro dérivé                                                 |

Pour le tri des performances générales, utilisez ces éléments avec le consensus et la file d'attente
signaux énumérés dans [Performance et mesures](/guide/advanced/metrics.md)- Je ne sais pas .

## Références connexes

- [Schéma de modèle de données](/reference/data-model-schema.md) pour le type généré
  détails
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` Options FastPQ](/reference/irohad-cli.md#arg-fastpq-execution-mode)
