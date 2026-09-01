---
translation_locale: fr
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ est le chemin de preuve STARK de Iroha pour les effets d'exécution sélectionnés. Il ne remplace pas l'exécution normale des transactions ni le consensus. Les transactions restent exécuter ISI, IVM et Sumeragi comme d'habitude ; FastPQ consomme le témoin d'exécution déterministe et transforme les effets pris en charge en lots de preuves.

L'intégration actuelle de l'hôte comporte trois axes principaux :

- transferts d'actifs numériques transparents enregistrés pendant l'exécution des blocs
- Nexus relais de voie d'exécution vérifiés dont le conteneur de données de preuve AXT porte un lien FastPQ
- SCCP assistants de preuve de message transparent qui enveloppent une preuve FastPQ dans un conteneur de données à vérification ouverte

## Transférer le chemin du témoin {#transfer-witness-path}

Les transferts numériques transparents créent une transcription de transfert structurée lorsque l'instruction modifie les soldes. La transcription enregistre :

- le compte source, le compte de destination, la définition de l'actif et le montant
- soldes de l'expéditeur et du destinataire avant et après le transfert
- le hachage cryptographique du point d'entrée de la transaction utilisé comme hachage cryptographique du lot
- une valeur de résumé cryptographique principale d'autorisation dérivée du compte soumetteur
- une valeur de résumé cryptographique Poseidon pour des transcriptions à delta unique

Les transferts par lots utilisent une seule transcription avec plusieurs deltas. Dans ce cas, la valeur de digest cryptographique Poseidon à delta unique est absente.

Lors de la finalisation du bloc, Iroha regroupe ces transcriptions par hachage cryptographique d’entrée. Le témoin d’exécution transporte ensuite à la fois les ensembles de transcriptions originaux et les lots de transition FastPQ préparés pour le prouveur.

Chaque delta de transfert devient deux lignes de transition :

| Rang |Forme de la clé|Valeur préalable|Post-valeur|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Débit de l'expéditeur| `asset/<asset-definition>/<source-account>`      |solde de l'expéditeur avant|solde de l'expéditeur après|
|Crédit du destinataire| `asset/<asset-definition>/<destination-account>` |solde du récepteur avant|solde du récepteur après|

Les valeurs numériques sont normalisées en unités témoins entières. Une valeur est rejetée pour le regroupement FastPQ si elle ne peut pas être représentée comme un `u64` non négatif à l'échelle décimale sélectionnée.

## Entrées publiques {#public-inputs}

Chaque lot de transition FastPQ comporte des entrées publiques qui lient la preuve au bloc et au contexte d'exécution :

|Entrée|Sens|
| ------------- | --------------------------------------------------------------- |
| `dsid`        |Identifiant de l'espace de données encodé en tant qu'octets en format little-endian|
| `slot`        |Temps de création du bloc converti en nanosecondes|
| `old_root`    |Racine de l'état parent dérivée du témoin d'exécution|
| `new_root`    |Racine de l'état postérieure dérivée du témoin d'exécution|
| `perm_root`   |Engagement de Poséidon concernant les autorisations de rôle actif|
| `tx_set_hash` |hachage cryptographique sur le point d'entrée des hachages cryptographiques de transaction triés et déclenchés par le temps|

L'hôte utilise `fastpq-lane-balanced` comme l'ensemble de paramètres canonique pour ces lots.

## Modèle mathématique {#mathematical-model}

Cette section décrit l'arithmétique mise en œuvre par le prouveur et le vérificateur Rust actuels. Toutes les opérations sur les champs ci-dessous se font sur le champ premier Goldilocks :

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ utilise Poseidon2 plutôt que `F` pour les engagements de champ. L'éponge a une largeur de `t = 3`, un débit de `r = 2` et une capacité de `1`. Le hachage cryptographique absorbe les éléments du champ par blocs de débit 2 et ajoute un seul élément de champ `1` avant la permutation finale :

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Les chaînes d'octets sont regroupées en segments de 7 octets en little-endian de sorte que chaque segment soit strictement inférieur à `p` :

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Les hachages cryptographiques de champs séparés par domaine sont représentés comme suit :

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Pour les hachages issus d’empreintes sur le domaine des octets, FastPQ projette dans le champ les huit premiers octets little-endian :

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Ici, `Hash` signifie Iroha's `iroha_crypto::Hash::new`, une valeur de hachage cryptographique Blake2bVar de 32 octets, sauf si une formule nomme explicitement Poseidon2 ou SHA-256.

### Arithmétique de champ {#field-arithmetic}

Le code Rust représente les éléments de champ comme des valeurs `u64` canoniques en `[0,p)`. L'addition et la soustraction sont :

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

La multiplication calcule d'abord le produit sur 128 bits :

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

La réduction Goldilocks utilise ensuite l'identité :

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Si :

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

puis le réducteur calcule :

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

La mise en œuvre ajoute ou soustrait conditionnellement `p` jusqu'à ce que le résultat soit canonique. Les entiers signés, tels que les variations de solde, sont intégrés par :

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Permutation de Poseidon2 {#poseidon2-permutation}

L'état de permutation Poseidon2 est :

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Sa boîte S est :

$$
S(x)=x^5
$$

FastPQ utilise quatre tours complets, cinquante-sept tours partiels, puis encore quatre tours complets. Un tour complet avec les constantes de tour `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` est :

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Un tour partiel est :

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Toutes les additions et multiplications sont dans `F`. La matrice canonique MDS est :

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Le champ de hachage cryptographique commence à l'état zéro. Pour chaque bloc complet de taux 2 `(u,v)` :

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Le bloc final ajoute l'élément de remplissage `1` avant une dernière permutation. La sortie est `x_0`.

### Liaison de saisie publique {#public-input-binding}

L'hôte encode un identifiant d'espace de données en écrivant sa valeur `u64` dans les huit premiers octets en little-endian du champ de 16 octets :

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Le temps de création du bloc est converti de millisecondes en nanosecondes :

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Le hachage de l’ensemble de transactions est calculé dans le domaine des octets à partir des hachages des points d’entrée triés :

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

où `h_i` sont des transactions triées et des hachages cryptographiques de point d'entrée déclenchés par le temps. Dans la preuve publique IO, si `perm_root` ou `tx_set_hash` sont tous zéro, le prouveur remplit les valeurs de secours :

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

### Normalisation numérique {#numeric-normalization}

Pour chaque delta de transfert, l'échelle décimale cible est l'échelle maximale tronquée de la somme et des deux vues de données de points de solde dans le temps :

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

Une valeur `Numeric` avec une mantisse `m` et une échelle `q` n'est acceptée que lorsque `m >= 0` et `q <= s`. Sa valeur témoin FastPQ est :

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Le résultat normalisé doit tenir dans `u64`.

### Ordonnancement canonique {#canonical-ordering}

Avant la construction de la trace, le lot est trié par clé de transition, rang de l'opération et indice d'insertion d'origine :

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

L'engagement de commande est un hachage cryptographique d'un champ Poseidon2 sur le domaine `fastpq:v1:ordering` et le codage Norito des transitions triées :

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

où `P` est un paquet de 7 octets, `E` est un encodage Norito, `D_o` est `fastpq:v1:ordering`, et `T*` est la liste des transitions triée.

### Équations de transfert {#transfer-equations}

Pour un montant de transfert `a`, solde de l'expéditeur `f` et solde du destinataire `t`, FastPQ valide les valeurs normalisées du témoin avant de construire la trace :

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Les lignes de transition encodent ensuite :

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

À l'intérieur de la trace, les deltas signés sont réduits en `F` :

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

La valeur facultative de condensé cryptographique de transfert à delta unique engage le préimage de transfert encodé :

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Pour les transcriptions de transfert multi-delta, le format actuel exige que cette valeur de condensé cryptographique de niveau supérieur soit absente.

La valeur du résumé cryptographique principal d'autorisation de l'hôte pour les transcriptions de transfert est :

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Tracer des lignes {#trace-rows}

Laissez la liste de transitions triée contenir `n` lignes réelles. La longueur de la trace est la prochaine puissance de deux :

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Les lignes `0..n-1` sont actives ; les lignes `n..N-1` sont des lignes de remplissage. Chaque ligne réelle a un sélecteur d'opération défini :

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Toutes les colonnes de sélection sont booléennes :

$$
s(s-1)=0
$$

Les lignes de recherche d'autorisation sont exactement des lignes d'attribution et de révocation de rôle :

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Pour les lignes d'opérations numériques :

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Le constructeur suit également les deltas par actif en cours :

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Seules les lignes de distribution et de destruction mettent à jour le compteur d'approvisionnement :

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Les colonnes de trace des métadonnées et de l’espace de données sont des hachages de champ dérivés avant la matérialisation des lignes :

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

Le hachage des métadonnées, celui de l’espace de données et l’emplacement restent stables entre les lignes adjacentes de la trace :

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Transférer les colonnes Merkle {#transfer-merkle-columns}

Les lignes de transfert comportent un chemin Merkle clairsemé de 32 niveaux. Si une preuve de l'hôte est manquante, le prouveur synthétise un chemin déterministe à partir de la clé de la ligne, du pré-solde et de savoir si la ligne correspond au côté expéditeur ou destinataire.

Pour les chemins synthétiques, le sel de saveur est `fastpq:smt:from` pour les lignes de l'expéditeur et `fastpq:smt:to` pour les lignes du destinataire :

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

La feuille synthétique et les nœuds internes sont :

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

La trace enregistre le bit `b_l`, le pair `s_l`, le nœud d'entrée `x_l` et le nœud de sortie `x_{l+1}` à chaque niveau. Avec la convention de branche du code :

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Hachages cryptographiques de permission {#permission-hashes}

Attribuer et révoquer des rôles lignes hash cryptographique la permission témoin :

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

La table des permissions de l'hôte root trie les entrées par octets de rôle, octets de permission et octets d'époque, puis construit un arbre de Merkle Poseidon2 :

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Les niveaux de largeur impair dupliquent le dernier élément.

### Tracer l'engagement {#trace-commitment}

Pour chaque colonne de trace `c`, FastPQ interpole d'abord les valeurs de la colonne sur le domaine de la trace et hache ensuite de manière cryptographique le vecteur de coefficients :

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

La racine de trace est une racine Merkle Poseidon2 sur les engagements de colonnes :

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

L’engagement final de la trace est un hachage d’octets portant sur le domaine, le jeu de paramètres, la forme de la trace, les empreintes des colonnes et la racine de la trace :

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

où `D_c` est `fastpq:v1:trace_commitment`.

### Composition AIR {#air-composition}

La valeur de composition V1 AIR est une combinaison linéaire de résidus locaux à la ligne. La transcription échantillonne deux défis :

$$
\alpha_0,\alpha_1 \in F
$$

Pour chaque paire de lignes adjacentes `(i,i+1)`, le vérificateur calcule :

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Les résidus `rho` sont, dans l'ordre du code :

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

Pour les lignes avec des colonnes numériques :

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Et pour les colonnes de contexte de lot stables :

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

Le vérificateur recalcule `A_i` pour les ouvertures de lignes échantillonnées et le compare à la valeur de composition engagée sous la racine Merkle de composition AIR.

### Rechercher un produit {#lookup-product}

L'accumulateur de recherche de permissions utilise le défi Fiat-Shamir `gamma`. Sur les évaluations de l'extension de faible degré de `s_perm` et `perm_hash`, le produit en cours est :

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

Le procès-verbal indique :

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Extension de faible degré {#low-degree-extension}

Soit `omega_T` le générateur du domaine de trace, `omega_E` le générateur du domaine d'évaluation, et `g` le décalage de coset configuré. Pour une colonne de trace avec les valeurs `v_i`, l'interpolation produit des coefficients `a_j` tels que :

$$
f(\omega_T^i)=v_i
$$

L'extension de faible degré évalue le même polynôme sur le coset :

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

L'implémentation calcule cela en multipliant les coefficients par les puissances du décalage du coset avant FFT :

$$
a'_j = a_j g^j
$$

puis en évaluant `a'` sur le domaine d'évaluation.

Le CPU FFT est une transformée itérative radix-2 de Cooley-Tukey sur des entrées inversées par bits. À la longueur de stade `L`, à la moitié de la longueur `H=L/2`, et à la racine de stade :

$$
\omega_L=\omega^{N/L}
$$

chaque papillon calcule :

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

L'inverse FFT exécute la même transformation avec `omega^{-1}` et met à l'échelle selon la taille inverse du domaine :

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Les racines du catalogue sont validées avant utilisation :

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Pour les domaines plus petits dérivés de la racine du catalogue, le générateur est :

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Hachages cryptographiques Row et Leaf {#row-and-leaf-hashes}

Après LDE, FastPQ hache cryptographique chaque ligne à travers toutes les LDE colonnes. Pour `m` colonnes :

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Si les hachages cryptographiques de ligne sont encore sur le domaine de trace plutôt que sur le domaine d'évaluation, le prouveur interpole et étend cette seule colonne de hachage de ligne avec le même processus de coset LDE.

### Ouvertures de Merkle {#merkle-openings}

Les valeurs LDE sont regroupées en blocs de :

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Chaque morceau de feuille est :

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Les parents de Merkle sont :

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Les niveaux impairs dupliquent le dernier nœud. Les chemins de requête sont vérifiés en hachant à gauche ou à droite selon la parité de l'indice de la feuille de la requête à chaque niveau.

Pour une feuille à l'index `i`, un chemin `(s_0,\ldots,s_{d-1})` se vérifie par rapport à la racine `R` par la récurrence :

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

Le contrôle ne passe que lorsque :

$$
y_d=R
$$

AIR les feuilles de la rangée de trace sont :

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR les feuilles de composition sont :

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

L'ouverture de la requête LDE vérifie également que la valeur ouverte à l'indice d'évaluation `i` est présente dans son segment authentifié :

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Pliage {#fri-folding}

FRI s'engage à effectuer des évaluations de composition de AIR. Pour chaque tour `l`, la transcription prend un échantillon de défi `beta_l`. La couche est remplie jusqu'à un multiple de l'arity en répétant la dernière valeur. Chaque groupe de taille arity se replie en :

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

où `a` est l'arity FRI. Le vérificateur vérifie, pour chaque chaîne de requêtes échantillonnée, que :

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

et authentifie chaque groupe FRI ouvert par rapport à la racine de couche correspondante FRI.

### Transcription Fiat-Shamir {#fiat-shamir-transcript}

Le catalogue de paramètres canoniques étiquette le hachage cryptographique de la transcription comme SHA3-256. L'implémentation actuelle du prouveur et du vérificateur dérive les octets de défi avec `iroha_crypto::Hash::new`, qui est une valeur de digest cryptographique Blake2bVar de 32 octets. puis réduit les huit premiers octets en little-endian en `F` :

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Les appels de défi ajoutent la valeur complète du condensé cryptographique à l'état de la transcription. L'ordre de rejouage est :

1. public IO, version du protocole, version du paramètre, et nom du paramètre
2. LDE racine et trace racine
3. `gamma`
4. AIR défis de composition `alpha_0`, `alpha_1`
5. AIR racine de trace et AIR racine de composition
6. rechercher grand produit
7. FRI couches racines et `beta_l` défis
8. indices de requête échantillonnés

L'échantillonnage des requêtes continue de tirer des digests cryptographiques de 32 octets et de les lire comme des morceaux en petit-boutiste `u64` jusqu'à ce qu'il ait le nombre demandé d'indices uniques :

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

L'ensemble échantillonné est renvoyé dans l'ordre trié.

### Vérifier Replay {#verifier-replay}

Le vérificateur recalcule d'abord l'engagement par lot :

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

et nécessite :

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Il reconstruit également le IO public :

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Chaque champ doit correspondre au IO public de la preuve octet par octet. Le vérificateur reconstruit ensuite le même transcript et en déduit la même chose :

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Pour chaque requête échantillonnée `q`, il vérifie :

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

et :

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

L'ouverture de la composition AIR doit s'authentifier sous `R_air_composition`. La chaîne FRI commence ensuite à partir du même `A_q` et doit se terminer par une feuille finale FRI authentifiée sous la racine terminale FRI.

## Ce que le vérificateur contrôle {#what-the-prover-checks}

Avant de construire la trace, le prouveur FastPQ canonise l'ordre du lot par clé de transition, rang de l'opération et ordre d'insertion. Les lignes de transfert nécessitent également des métadonnées de transcription. Un lot avec des lignes de transfert mais sans transcriptions de transfert est invalide.

Pour les relevés de notes de transfert, les vérifications du côté du fournisseur incluent :

- le solde de l'expéditeur ne doit pas être inférieur à zéro
- `sender_after` doit être égal à `sender_before - amount`
- `receiver_after` doit être égal à `receiver_before + amount`
- la transcription doit couvrir chaque ligne de transfert dans le lot
- lorsqu’il est présent, le condensé Poseidon à delta unique doit correspondre à la préimage de la transcription
- les preuves de Merkle clairsemées fournies doivent être décodées comme version 1 ; les chemins manquants sont remplis par des preuves synthétiques déterministes

La trace contient des colonnes de sélecteur pour le transfert, l'émission, la destruction, l'octroi de rôle, la révocation de rôle, la définition des métadonnées et les lignes de recherche de permissions. Les lignes d'opérations numériques comportent également des deltas signés, des deltas cumulés par actif et des compteurs d'approvisionnement.

## Voie d'exécution du prouveur {#prover-lane}

`iroha3d` démarre la voie d'exécution du FastPQ prover au démarrage si le backend du prover peut être initialisé. La voie d'exécution est une tâche en arrière-plan avec une file d'attente limitée. Après qu'un bloc produit un témoin d'exécution, le chemin de validation soumet un travail de prouveur contenant le hachage cryptographique du bloc, sa hauteur, sa vue et son témoin.

Si la voie d'exécution ne fonctionne pas ou si la file d'attente est pleine, le travail est ignoré et le traitement normal du bloc continue. Cela signifie que la voie d'exécution du prouveur en arrière-plan n'est pas une porte d'admission des transactions ni de consensus. C'est un chemin de production de preuve sur un état qui a déjà été exécuté.

La voie d'exécution construit un prouveur avec :

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Les deux paramètres par défaut sont `cpu`. Sélectionner `gpu` est une demande explicite en mode échec fermé : si le support GPU n'est pas compilé ou si un backend GPU demandé échoue au pré-vol, la voie d’exécution du prouveur reste désactivée. La première version n’a pas de valeur `auto` et ne bascule pas d’un mode demandé GPU vers CPU.

## Vérification {#verification}

FastPQ La vérification de la preuve reconstruit l'engagement de lot canonique et rejoue le transcript public. Le vérificateur vérifie la version du protocole, la version de l'ensemble de paramètres, les limites de répétition, l'engagement de trace, les entrées publiques, les ouvertures de Merkle échantillonnées, les ouvertures AIR et la chaîne de requêtes FRI.

Les limites de lecture par défaut incluent :

|Limiter|Par défaut|
| ------------------ | ------: |
|Lignes de transition|     256 |
|Taille de la charge par lot|256 KiB|
| FRI couches         |      16 |
|Rechercher des ouvertures|     128 |

## Nexus Relais Vérifiés {#nexus-verified-relays}

Nexus AXT les conteneurs de données de preuve peuvent intégrer un `AxtFastpqBinding`. Lorsque `RegisterVerifiedLaneRelay` s'exécute, Iroha :

1. vérifie le conteneur de données de relais de la voie d'exécution et le matériel de preuve FastPQ
2. vérifie l’espace de données et la racine du manifeste technique
3. déchiffre le conteneur de données de preuve AXT
4. nécessite un `fastpq_binding`
5. reconstruit le lot FastPQ à partir de cette liaison
6. déchiffre la preuve intégrée FastPQ
7. appelle le vérificateur FastPQ sur le lot recomposé et la preuve

Si la vérification réussit, Iroha stocke un `VerifiedLaneRelayRecord` contenant la référence du relais, le conteneur de données original, le hachage cryptographique de la charge utile de preuve, la hauteur de vérification, la racine du manifeste technique, et la liaison FastPQ.

Les enveloppes de relais de voie transportent aussi du matériel de preuve FastPQ compact. Ce matériel résume l’identifiant de la voie, l’identifiant de l’espace de données, la hauteur du bloc, la hauteur de vérification, le hachage de l’en-tête du bloc, le hachage du règlement et la racine du manifeste. Un relais ne peut être fusionné que s’il possède à la fois un QC et du matériel de preuve FastPQ valide.

### AXT Liaison Math {#axt-binding-math}

Pour les conteneurs de données Nexus AXT, `AxtFastpqBinding` est canoniqué avant la relecture de la preuve. Les valeurs de paramètre vides par défaut sont `fastpq-lane-balanced` ; l'identifiant et la version vérificateur vides par défaut sont `fastpq` et `v1` ; le type de réclamation est tronqué et mis en minuscules.

Les entrées publiques AXT FastPQ sont des hachages cryptographiques d'octets déterministes :

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

Les clés de transition AXT sont :

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

La réclamation `authorization` insère une ligne d'attribution de rôle :

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

et une ligne de métadonnées liant la politique d'autorisation. La revendication `compliance` insère deux lignes de métadonnées : une pour la politique et une pour les espaces de données cibles.

Pour `tx_predicate` et `value_conservation`, un montant d'effet explicite est utilisé lorsque la liaison contient un montant source ou destination positif. Sinon, le code dérive un montant déterministe borné :

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Ensuite, les mêmes équations de transfert sont utilisées :

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Les identifiants de compte expéditeur et destinataire synthétiques sont générés à partir de graines de clés :

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Le hachage cryptographique du lot de transfert est :

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

La valeur de condensat cryptographique du manifeste technique du lot AXT est SHA-256 sur le codage Norito de la liaison canonique :

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Preuves de message transparentes {#sccp-transparent-message-proofs}

Le paquet logiciel d'assistance SCCP utilise également FastPQ pour des preuves de messages inter-chaînes transparentes. Ce chemin est séparé de la voie d'exécution du prouveur en arrière-plan `iroha3d`. Il construit un lot FastPQ directement à partir d'un ensemble de preuves de message SCCP et d'un manifeste technique, puis enveloppe la preuve résultante pour une vérification ouverte.

Le lot SCCP utilise `fastpq-lane-balanced` et trois transitions de métadonnées :

|Clé|Opération|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Ses entrées publiques sont dérivées de la preuve interne transparente SCCP :

| FastPQ saisie | SCCP source                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        |Les 16 premiers octets d'une valeur de condensé cryptographique Blake2b sur le hachage cryptographique de l'énoncé|
| `slot`        |Hauteur de finalité|
| `old_root`    |Hachage cryptographique de la charge utile|
| `new_root`    |Racine de l'engagement|
| `perm_root`   |Hachage cryptographique de bloc de finalité|
| `tx_set_hash` |Déclaration de hachage cryptographique|

Les encodeurs canoniques SCCP écrivent les entiers en petit-boutiste et encodent les tableaux d'octets à longueur variable comme suit :

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

La chaîne d'octets de saisie publique transparente est :

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

Les octets de l'énoncé transparent sont la concaténation de la version, de la famille de chaînes, des domaines locaux et de la contrepartie, du modèle de sécurité, de la gouvernance de l'ancre, du codec de compte, du modèle de finalité, de la cible du vérificateur, de la famille de backend du vérificateur, des champs de chaîne/backend/manifest préfixés par la longueur, liaison de destination hachage cryptographique, clé de codec de compte, type de charge utile, octets d'entrée publique et hachage cryptographique de la charge utile. Le hachage cryptographique de l'énoncé est :

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

L'identifiant d'espace de données FastPQ pour ce chemin de preuve est les seize premiers octets d'une autre valeur de hachage cryptographique Blake2b préfixée :

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

Le lot SCCP FastPQ est exactement :

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

puis trié selon la même règle de classement FastPQ.

L'engagement du vérificateur OpenVerify est SHA-256 sur le nom du backend du message SCCP et le descripteur de vérificateur canonique FastPQ :

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

La preuve brute FastPQ est encodée en Norito dans un `StarkFriOpenProofV1`, puis enveloppée dans un `OpenVerifyEnvelope` avec un backend `Stark`. La vérification SCCP reconstruit le même FastPQ lot provenant du bundle et du manifeste technique, vérifie les métadonnées du conteneur de données de vérification ouvert, et appelle le vérificateur FastPQ sur le lot reconstruite et la preuve.

## Ensembles de paramètres {#parameter-sets}

Le catalogue de paramètres canonique expose deux ensembles de paramètres. La voie d'exécution du prouveur hôte utilise actuellement `fastpq-lane-balanced`.

|Paramètre|But|Champ|hachages cryptographiques| FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |débit de vérificateur équilibré|Extension quadratique Boucles d'Or|Engagements Poseidon2, catalogue SHA3 étiquette|arithmétique 8, explosion 8, 46 requêtes|
| `fastpq-lane-latency`  |voies d'exécution sensibles à la latence|Extension quadratique Boucles d'Or|Engagements Poseidon2, catalogue SHA3 étiquette|arithmétique 16, explosion 16, 34 requêtes|

Les deux visent une sécurité de 128 bits et utilisent une taille de domaine de trace de `2^16`. Le code de lecture de transcript Rust V1 dérive actuellement les octets de défi Fiat-Shamir avec `iroha_crypto::Hash::new` plutôt qu'en invoquant directement SHA3-256.

Les constantes exactes du catalogue utilisées par le prouveur Rust sont :

|Constant| `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
| `trace_root`         |   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
| `fri_blowup`         |                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
| `fri_queries`        |                     46 |                    34 |

## Configuration {#configuration}

La configuration de FastPQ se trouve sous `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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

Les mêmes étiquettes d'exécution et de télémétrie peuvent être remplacées depuis `iroha3d` :

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Les variables d'environnement sont également prises en charge pour les champs de configuration. Les variables spécifiques à FastPQ incluent :

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

Lorsque la télémétrie est activée, FastPQ exporte des métriques sur la sélection du backend et le comportement de l’environnement d’exécution Metal :

|Métrique|Signification|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Mode d'exécution demandé et résolu par les étiquettes du backend et de l'appareil|
| `fastpq_poseidon_pipeline_total`  |Chemin de pipeline de traitement Poseidon demandé et résolu|
| `fastpq_metal_queue_depth`        |Limite de file d'attente Metal, nombre maximum en vol, nombre de dispatch, et fenêtre d'échantillonnage|
|`fastpq_metal_queue_ratio`        |Queue métallique ratios d'occupation et de chevauchement|
| `fastpq_zero_fill_duration_ms`    |Durée de remplissage à zéro de l’hôte pour les exécutions Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Bande passante à remplissage de zéros dérivée|

Pour le triage de performance général, utilisez ceux-ci avec les signaux de consensus et de file d'attente listés dans [Performance et mesures](/fr/guide/advanced/metrics.md).

## Référence Connexe {#related-reference}

- [Schéma du modèle de données](/fr/reference/data-model-schema.md) pour la vue de données ponctuelle de type nœud-autoritaire
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [Options FastPQ d’`iroha3d`](/fr/reference/iroha3d-cli.md#fastpq-overrides)
