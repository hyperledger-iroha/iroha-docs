---
translation_locale: fr
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# RAM-LFE {#ram-lfe}

RAM-LFE signifie Évaluation de Fonction Laconic sur Machine à Accès Aléatoire. Dans Iroha, il s'agit de la couche générique de fonction cachée pour les programmes dont la politique publique est sur la blockchain mais dont la logique de l'évaluateur, le secret ou l'entrée brute ne doit pas être écrite dans l'état mondial. Il est utilisé par les flux d'identification SORA Nexus, tels que la recherche de téléphone privé ou d'e-mail, et peut également être exposé comme un assistant d'exécution de programme Torii générique lorsque le profil d'un nœud active les routes accessibles par l'application.

La chaîne stocke l’engagement de politique et les métadonnées de vérification du reçu. Un résolveur ou un environnement d’exécution de Torii évalue le programme caché, ne renvoie que la sortie autorisée et joint un reçu que les clients, les outils de support ou les instructions du registre peuvent vérifier par rapport à la politique enregistrée.

## Nommer {#naming}

La séparation des noms est importante :

|Terme|Signification|
| --- | --- |
| `ram_lfe` |L'abstraction de fonction cachée externe : politiques du programme, engagements, reçus d'exécution et mode de vérification des reçus.|
| `BFV` |Le schéma de chiffrement homomorphe Brakerski/Fan-Vercauteren utilisé par les backends à entrée chiffrée RAM-LFE.|
| `ram_fhe_profile` |Métadonnées spécifiques à BFV pour la machine d'exécution chiffrée programmée. Ce n'est pas un second nom pour RAM-LFE.|

Dans le modèle de données, `RamLfeProgramPolicy` et `RamLfeExecutionReceipt` sont des types RAM-LFE. Les paramètres BFV, les conteneurs de données chiffrées et le profil de programme caché RAM-FHE appartiennent au backend d'exécution chiffrée utilisé par une politique.

## Ce que cela enregistre {#what-it-records}

Une politique de programme RAM-LFE est enregistrée mondialement par `program_id`. La politique contient :

- le compte propriétaire qui peut activer, désactiver ou autrement modifier la politique
- le backend annoncé aux clients
- le mode de vérification des reçus, soit `signed` soit `proof`
- un engagement envers les métadonnées du programme caché et le secret de l'évaluateur
- la clé publique du résolveur pour les reçus signés
- métadonnées d'entrée chiffrées publiques optionnelles, telles que les paramètres BFV et `ram_fhe_profile`
- un indicateur `active` qui détermine si la politique peut émettre de nouveaux reçus

Le secret caché, la valeur d'identifiant en texte clair et le corps du programme caché ne sont pas stockés dans l'état mondial. Les clients doivent traiter les engagements, les hachages opaques, les hachages des reçus, les textes chiffrés et les résumés cryptographiques du programme comme des valeurs de protocole opaques.

## Backends {#backends}

Le support actuel RAM-LFE est centré sur trois identifiants backend :

|Backend|Utiliser|
| --- | --- |
| `hkdf-sha3-512-prf-v1` |Évaluation liée à l'engagement PRF.|
| `bfv-affine-sha3-256-v1` |BFV - évaluation affine secrète soutenue sur des emplacements d'identifiants chiffrés.|
| `bfv-programmed-sha3-256-v1` |BFV-prise en charge de l'exécution programmée sur des registres chiffrés et des voies d'exécution mémoire.|

Pour les politiques d'identifiant, le backend programmé BFV est le chemin moderne important. Il permet aux portefeuilles de chiffrer localement les entrées normalisées, et permet au résolveur d'évaluer sans voir un identifiant public dans la transaction, et renvoie un reçu qui lie le hachage de sortie à la politique du programme enregistrée.

## Mathématiques {#math}

Cette section décrit l’algèbre d’implémentation qu’utilise le code RAM-LFE actuel. Il ne s’agit pas d’une preuve de sécurité, mais de la transcription déterministe et du modèle d’évaluation chiffrée sur lesquels les politiques, les reçus et les clients doivent s’accorder.

### Notation {#notation}

Soit :

- \(H(m)\) être Iroha `Hash::new(m)` : Blake2b-32 sur `m`, avec le bit le moins significatif du dernier octet forcé à `1`.
- \(N(x)\) est l'encodage canonique Norito de `x`.
- \(a \parallel b\) signifie concaténation de chaînes d'octets.
- \(\operatorname{le64}(i)\) être l'encodage sur 8 octets en little-endian d'un entier non signé.
- \(s\) être le secret du résolveur conservé en dehors de l'état du monde.
- \(P\) être des paramètres de politique publique.
- \(A\) être demander des données associées.
- \(x\) peut être des octets d'entrée normalisés ou un conteneur de données d'entrée chiffrées encodé en Norito, selon le backend.

RAM-LFE utilise des hachages à domaines séparés. Les formules ci-dessous nomment les domaines selon leur usage ; leurs chaînes d'octets actuelles sont :

|Symbole|Chaîne de domaine|
| --- | --- |
| \(D_{\mathrm{policy}}\) | `iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{secret}}\) | `iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{salt}}\) | `iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_opaque}}\) | `iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_receipt}}\) | `iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{opaque}}\) | `iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{receipt}}\) | `iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{affine\_circuit}}\) | `iroha.ram_lfe.bfv_affine.circuit.v1` |
| \(D_{\mathrm{affine\_opaque}}\) | `iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
| \(D_{\mathrm{affine\_receipt}}\) | `iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
| \(D_{\mathrm{program\_memory}}\) | `iroha.ram_lfe.bfv_program.memory.v1` |
| \(D_{\mathrm{program\_opaque}}\) | `iroha.ram_lfe.bfv_program.opaque_hash.v1` |
| \(D_{\mathrm{program\_receipt}}\) | `iroha.ram_lfe.bfv_program.receipt_hash.v1` |
| \(D_{\mathrm{program\_digest}}\) | `iroha.ram_lfe.bfv_program.digest.v1` |
| \(D_{\mathrm{output}}\) | `iroha.ram_lfe.output_hash.v1` |
| \(D_{\mathrm{id\_opaque}}\) | `iroha.ram_lfe.identifier.opaque_hash.v1` |
| \(D_{\mathrm{id\_receipt}}\) | `iroha.ram_lfe.identifier.receipt_hash.v1` |
| \(D_{\mathrm{bfv\_keygen}}\) | `iroha.crypto.fhe.bfv.keygen.v1` |
| \(D_{\mathrm{bfv\_encrypt}}\) | `iroha.crypto.fhe.bfv.encrypt.v1` |
| \(D_{\mathrm{id\_keygen}}\) | `iroha.crypto.fhe.bfv.identifier.keygen.v1` |
| \(D_{\mathrm{id\_slot}}\) | `iroha.crypto.fhe.bfv.identifier.slot.v1` |

### Engagement politique {#policy-commitment}

Un engagement de politique lie les paramètres publics et le secret du résolveur caché à un backend. Tout d'abord, le secret est engagé séparément :

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Ensuite, la transcription complète de la politique est encodée :

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

et le hachage de la politique publiée est :

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Le `PolicyCommitment` sur la blockchain est :

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

L’évaluation recalcule la même valeur à partir du secret de l’environnement d’exécution. Si le hachage diffère, l’évaluation échoue en raison d’une incompatibilité de l’engagement.

### Moteur HKDF-SHA3-512 {#hkdf-sha3-512-backend}

Pour `hkdf-sha3-512-prf-v1`, la sortie est l’entrée normalisée elle-même, mais l’identifiant opaque et le hachage du reçu sont des sorties liées au secret de la PRF.

La transcription de la demande est :

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

Le sel HKDF et la clé pseudorandom sont :

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Le matériau opaque est expansé et haché :

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

le protocole enregistre le résultat du matériel lie en outre l'identifiant opaque :

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

Le backend renvoie :

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV Apprêt {#bfv-primer}

BFV est un schéma de chiffrement homomorphe basé sur des treillis. "Homomorphe" signifie qu'un programme peut additionner et multiplier des valeurs chiffrées et, après déchiffrement, obtenir le même résultat que s'il avait effectué les additions et multiplications sur les valeurs en clair.

Pour RAM-LFE, BFV est utilisé comme mécanisme d'entrée chiffrée :

1. Un portefeuille normalise une valeur privée, telle qu'un numéro de téléphone ou une adresse e-mail.
2. Le portefeuille transforme les octets en petites cases d'entiers.
3. Chaque emplacement est chiffré avec la clé publique BFV du résolveur.
4. L’environnement d’exécution du résolveur évalue le programme caché sur ces textes chiffrés.
5. L’environnement d’exécution déchiffre uniquement la sortie du programme caché et signe ou prouve un reçu.

BFV est une arithmétique entière exacte, et non une arithmétique approximative. C'est pourquoi elle convient mieux à l'identification des octets et aux petits calculs modulaires qu'à l'inférence de modèles à virgule flottante. Dans l'utilisation actuelle de Iroha en BFV, chaque emplacement chiffré transporte une valeur scalaire modulo \(t\), généralement un octet ou un champ de longueur octet. Le texte chiffré lui-même vit modulo un entier beaucoup plus grand \(q\). L'écart entre \(q\) et \(t\) donne de la marge de déchiffrement pour le bruit que l'encryption et les opérations homomorphiques introduisent.

Un chiffrement BFV possède deux composants polynomiaux :

$$
c=(c_0,c_1)
$$

La clé secrète est un autre polynôme \(s_k\). Le déchiffrement combine les composants :

$$
v = c_0 + c_1s_k
$$

Si le texte chiffré a été correctement formé et que le bruit est encore suffisamment faible, \(v\) est proche du texte en clair mis à l'échelle. L'arrondi permet de récupérer le coefficient du texte en clair modulo \(t\). La propriété utile est que les opérations sur le texte chiffré préservent cette structure :

|Opération simple|Opération de texte chiffré|
| --- | --- |
| \(m+n\) |Ajouter des composants de texte chiffré.|
| \(m+\alpha\) |Ajouter une constante en texte clair mise à l'échelle dans \(c_0\).|
| \(\alpha m\) |Mettez à l'échelle les deux composants du texte chiffré par \(\alpha\).|
| \(mn\) |Multiplier les polynômes chiffrés, réduire l'échelle, puis relinéariser.|

La multiplication est l'opération coûteuse. Le produit de deux textes chiffrés à deux composants crée naturellement un texte chiffré à trois composants qui se déchiffre avec \(1\), \(s_k\), et \(s_k^2\). La relinéarisation utilise une clé d'évaluation publiée pour replier le terme \(s_k^2\) dans un texte chiffré normal à deux composants. Cela permet de conserver les additions et multiplications ultérieures en utilisant la même forme de texte chiffré.

BFV est également « nivelé » : chaque opération chiffrée consomme une certaine réserve de bruit. Cette implémentation ne réamorce pas les textes chiffrés pour renouveler cette réserve. À la place, RAM-LFE publie un petit `ram_fhe_profile` et accepte uniquement une forme de programme caché limitée. Cela maintient l'évaluation dans la profondeur supportée par l'ensemble de paramètres. Le profil programmé actuel permet un nombre fixe de registres, un nombre fixe de voies mémoire, et au maximum une multiplication chiffrement-chiffrement par étape programmée.

Dans cette conception de RAM-LFE, BFV masque les entrées du client aux données publiques du registre distribué et aux observateurs qui ne voient que la transaction ou la charge utile de la route. Cela ne signifie pas que la chaîne exécute elle-même des programmes chiffrés arbitraires. L’environnement d’exécution du résolveur Torii détient toujours le matériel secret BFV, évalue le programme caché configuré, déchiffre la sortie autorisée et atteste le résultat. Le registre vérifie ensuite cette attestation par rapport à l’engagement de politique sur la chaîne et à la clé publique du résolveur ou aux métadonnées de preuve.

Le cas d'utilisation de l'identifiant choisit une représentation simple intentionnellement. Une chaîne normalisée est encodée comme :

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Chaque élément est chiffré dans son propre texte chiffré scalaire BFV. Cette forme explicite la normalisation et la validation de l’enveloppe, permet aux portefeuilles de construire des demandes chiffrées à partir des paramètres publics et permet au résolveur de canoniser des entrées chiffrées équivalentes en un reçu stable.

### BFV Modèle d'anneau {#bfv-ring-model}

Les backends BFV utilisent l'anneau polynomial n-acyclique :

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

et anneau en clair :

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

où :

- \(n\) est `polynomial_degree`, une puissance de deux
- \(q\) est `ciphertext_modulus`
- \(t\) est `plaintext_modulus`
- \(q > t\) et \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Les vecteurs de coefficients en texte clair sont encodés en mettant à l'échelle chaque coefficient :

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Le centre de décryptage soulève chaque coefficient de :

$$
v = c_0 + c_1 s_k \in R_q
$$

puis le ramène dans \(R_t\) :

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Voici \(s_k\) le polynôme de clé secrète BFV, pas le secret du résolveur externe RAM-LFE \(s\).

### BFV Génération de clé {#bfv-key-generation}

Pour l'entrée d'identifiant chiffré, le matériel de clé BFV est déterministe selon le secret du résolveur et les données associées :

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

Le BFV RNG est semé comme :

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Les échantillons du générateur de clés :

- \(s_k \in \{-1,0,1\}^n\), représenté modulo \(q\)
- \(a \leftarrow R_q\) uniformément
- \(e \in \{-1,0,1\}^n\)

La clé publique est :

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Pour la relinéarisation, soit \(s_k^2\) le produit d'anneau dans \(R_q\). Pour chaque chiffre en base-\(B\) \(j\), échantillonner \(a_j\) de manière uniforme et \(e_j\) à partir de la petite distribution, puis publier :

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Les métadonnées de la politique publique BFV contiennent \((n,q,t,B)\), la clé publique et `max_input_bytes`. La clé secrète BFV et la clé de relinéarisation restent dans l’environnement d’exécution du résolveur.

### BFV Chiffrement et opérations {#bfv-encryption-and-operations}

Pour chiffrer un polynôme en clair \(m\), l'implémentation initialise un autre ChaCha20 RNG à partir de :

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Il prélève un échantillon \(u,e_1,e_2 \in \{-1,0,1\}^n\) et calcule :

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Le texte chiffré est \(c=(c_0,c_1)\).

L'addition homomorphe se fait composant par composant :

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Ajouter un scalaire en texte clair \(\alpha\) au coefficient zéro ne change que \(c_0\) :

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

La multiplication par un scalaire en clair \(\alpha\) met à l'échelle les deux composants :

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Pour deux textes chiffrés \(c=(c_0,c_1)\) et \(d=(d_0,d_1)\), la multiplication de textes chiffrés calcule d'abord un texte chiffré de taille trois et met à l'échelle chaque coefficient en le ramenant à \(t/q\) :

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

Tous les produits ci-dessus sont des produits d'anneaux négacycliques dans \(R_q\). Ensuite, \(\tilde c_2\) est décomposé en polynômes en base-\(B\) :

$$
\tilde c_2 = \sum_j B^j u_j
$$

et relinéarisé :

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Le résultat est à nouveau un texte chiffré à deux composants BFV.

### Conteneur de données de texte chiffré d'identifiant {#identifier-ciphertext-envelope}

Une chaîne d'octets saisie en identifiant :

$$
x=(x_0,\ldots,x_{\ell-1})
$$

est encodé dans des cases scalaires :

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

et tous les emplacements restants sont nuls jusqu'à `max_input_bytes + 1`. Chaque emplacement scalaire est chiffré comme le polynôme en clair à coefficient zéro \([m_i]\). La graine de chiffrement par emplacement est :

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Le conteneur de données d'identifiant chiffré est :

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

où \(M=\mathrm{max\_input\_bytes}\).

### BFV Backend Affine {#bfv-affine-backend}

Pour `bfv-affine-sha3-256-v1`, l’exécution du logiciel dérive d’abord le matériau clé BFV à partir de \(s\) et \(A\). Les paramètres publics dérivés doivent correspondre exactement aux paramètres publics engagés sur la chaîne.

La graine du circuit affine est :

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

À partir de cette graine, l’environnement d’exécution échantillonne, modulo \(t\), un circuit affine de 32 lignes :

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

où \(m_i\) sont les emplacements d'identificateurs décryptés. Homomorphiquement, il calcule la même valeur sur les textes chiffrés :

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Le résolveur déchiffre chaque \(C_j\), exige que tous les coefficients en clair finaux soient nuls, convertit les valeurs de coefficient nul en octets, et forme :

$$
O=(y_0,\ldots,y_{31})
$$

Puis :

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

### BFV Backend programmé {#bfv-programmed-backend}

Pour `bfv-programmed-sha3-256-v1`, les paramètres publics regroupent les paramètres de chiffrement de l’identifiant BFV et un hachage du programme caché :

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Le profil actuel RAM-FHE est :

|Champ|Valeur|
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

Les données en clair soumises à Torii sont chiffrées dans le même conteneur de données BFV avant l'exécution. La graine déterministe pour ce chiffrement côté serveur est :

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Pour les entrées chiffrées fournies de manière externe, le résolveur déchiffre le conteneur de données d'identifiant et le rechiffre dans ce conteneur de données déterministe avant l'exécution. Cette normalisation canonique maintient les hachages des reçus stables entre des textes chiffrés BFV sémantiquement équivalents.

Les voies d'exécution de la mémoire cryptée initiale sont dérivées de :

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

Pour chacune des 32 voies d’exécution, l’environnement échantillonne \(r_j \in [0,t)\) et stocke un texte chiffré BFV qui chiffre \(r_j\). Le programme caché s’exécute ensuite sur des registres et une mémoire chiffrés :

|Instruction|Algèbre|
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), puis relinéariser |
| `SelectEqZero(dst, cond, z, nz)` |Déchiffrer \(R_{\mathrm{cond}}\) ; choisir \(R_z\) lorsqu'il est zéro, sinon \(R_{nz}\).|
| `Output(src)` |Ajoutez \(R_{\mathrm{src}}\) à la liste des registres de sortie.|

Après que la bande d'instructions se termine, le résolveur décrypte chaque registre de sortie, convertit le coefficient zéro en octet et concatène ces octets :

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Les hachages génériques du backend programmé sont :

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

Le ruban d'identification programmé par défaut dispose de 64 emplacements d'entrée. Pour chaque emplacement \(i\), il charge l'emplacement d'entrée, charge la voie d'exécution de la mémoire \(i \bmod 32\), les additionne et affiche le résultat :

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Hachages et reçus de sortie {#output-hashes-and-receipts}

Le reçu d’exécution générique RAM-LFE ne signe pas la sortie brute. Il signe le hachage de la sortie :

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Pour les reçus d’exécution RAM-LFE de Torii, les données associées sont les octets de l’identifiant de programme canonique :

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

La charge utile du reçu signé est :

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

Pour le mode `signed` :

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

La vérification contrôle la signature avec `resolver_public_key` et rejette le reçu si l’une de ces égalités n’est pas satisfaite :

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

Si l'appelant fournit `output_hex`, le vérificateur vérifie également :

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

En mode `proof`, l’attestation contient une enveloppe de preuve plutôt qu’une signature. La vérification contrôle que le backend de preuve, l’identifiant du circuit, le hachage du schéma des entrées publiques, le hachage de la clé de vérification et les instances publiques exposées correspondent aux métadonnées du vérificateur et au hachage de la charge utile encodée du reçu. Soit :

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Les instances publiques attendues sont quatre colonnes à un élément. La colonne \(j\) contient les octets \(h_{8j}\ldots h_{8j+7}\) suivis de 24 octets nuls :

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Projection d'identifiant {#identifier-projection}

La résolution des identifiants n'utilise pas le backend générique `opaque_hash` comme identifiant de compte opaque destiné à l'utilisateur. Elle projette le hash cryptographique de sortie RAM-LFE à travers des domaines spécifiques à l'identifiant :

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

Un `IdentifierResolutionReceipt` signe une charge utile de niveau supérieur :

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Pour les reçus signés d’identifiant :

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` n’accepte le reçu que si la signature ou la preuve est valide, si la charge d’exécution RAM-LFE intégrée correspond à la politique de programme référencée et si `uaid` et `account_id` constituent la liaison revendiquée.

## Flux d'exécution {#execution-flow}

Une exécution générique RAM-LFE suit cette forme :

1. La gouvernance ou un opérateur enregistre `RamLfeProgramPolicy`.
2. Le propriétaire active la politique.
3. Le client lit les métadonnées de la politique publique à partir de Torii.
4. Le client soumet exactement un formulaire de saisie au résolveur : du texte brut `input_hex` ou un conteneur de données d'entrée chiffré BFV.
5. L’environnement d’exécution évalue le programme caché et renvoie `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` et un `RamLfeExecutionReceipt`.
6. Le client ou le backend vérifie le reçu par rapport à la politique publiée et peut vérifier que la valeur `output_hex` renvoyée produit le hachage `output_hash` du reçu.
7. Une instruction de niveau supérieur, telle que `ClaimIdentifier`, peut intégrer le reçu attesté plutôt que l’entrée brute.

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

## Politiques d'identifiant {#identifier-policies}

Les politiques d'identifiant sont une utilisation concrète de RAM-LFE. Elles ajoutent un espace de noms commercial et une règle de normalisation en plus d'une politique de programme générique :

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

La couche d’identification utilise le reçu RAM-LFE pour lier :

- `policy_id`
- l'identifiant opaque dérivé de la fonction cachée
- le déterministe `receipt_hash`
- le compte UAID
- le canonique `account_id`
- la charge utile d'exécution générique RAM-LFE

Pour l’intégration des utilisateurs, séparez les alias de compte des identifiants privés. Les alias sont des noms publics ; les numéros de téléphone, adresses e-mail et valeurs similaires doivent passer par les politiques d’identification et les reçus.

## Points d’accès Torii {#torii-routes}

Lorsque la famille de routes côté application est activée, Torii expose RAM-LFE et les assistants d'identifiant :

|Route|But|
| --- | --- |
| `GET /v1/ram-lfe/program-policies` |Listez les politiques de programme RAM-LFE actives et inactives ainsi que les métadonnées d'exécution publiques.|
| `POST /v1/ram-lfe/programs/{program_id}/execute` |Exécutez un programme depuis `input_hex` ou `encrypted_input` et renvoyez les hachages de sortie ainsi qu'un reçu sans état.|
| `POST /v1/ram-lfe/receipts/verify` |Vérifiez un `RamLfeExecutionReceipt` par rapport à la politique publiée et comparez éventuellement `output_hex` à `output_hash`.|
| `GET /v1/identifier-policies` |Listez les politiques d'identification, les modes de normalisation, les clés de résolveur et les métadonnées d'entrée chiffrée.|
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Émettre le registre des résultats du protocole qu'un utilisateur peut intégrer dans `ClaimIdentifier`.|
| `POST /v1/identifiers/resolve` |Résoudre une entrée d'identifiant normalisé vers le compte lié lorsqu'une réclamation active existe.|
| `GET /v1/identifiers/receipts/{receipt_hash}` |Recherchez une déclaration d’identifiant persistante par le hachage du reçu pour les besoins d’audit et de support.|

Vérifiez toujours le document `/openapi.json` du nœud cible avant de construire en utilisant ces routes. La disponibilité dépend de la construction du nœud et du profil réseau.

## Environnement d'exécution Node {#node-runtime}

L’environnement d’exécution RAM-LFE intégré à Torii se configure sous `torii.ram_lfe.programs[*]`, avec `program_id` comme clé. Chaque programme configuré doit correspondre à l’engagement de politique sur la chaîne et fournir le matériel d’exécution nécessaire pour évaluer et attester les reçus. Les routes d’identifiant réutilisent ce même environnement ; elles ne nécessitent pas de surface de configuration distincte pour le résolveur d’identifiants.

Enregistrer une politique sur la chaîne n'est pas suffisant en soi. Un nœud cible doit également exposer la famille de routes et disposer du matériel d'exécution logicielle correspondant aux programmes qu'il est censé exécuter.

## Garde-fous opérationnels {#operational-guardrails}

- Les politiques d'enregistrement sont inactives, vérifiez les métadonnées publiques, puis activez-les.
- Gardez les secrets des évaluateurs, les clés de signature des résolveurs et le matériel secret BFV hors des documents, des journaux, des transactions et des bundles clients.
- Ne mettez pas d'identifiants bruts dans les alias de compte, les métadonnées de transaction, les événements ou les champs de l'état du monde.
- Vérifiez les reçus côté client avant de soumettre des instructions de niveau supérieur lorsque le SDK expose un vérificateur.
- Utilisez des champs d’expiration afin que les reçus obsolètes ne restent pas valides indéfiniment.
- Effectuez la rotation en enregistrant un nouveau programme ou une nouvelle politique d’identifiant, en migrant les clients puis en désactivant l’ancienne politique lorsque les nouveaux reçus circulent.

## Sujets liés {#related-topics}

- [Frais de parrainage pour un espace de données privé](/fr/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md#app-and-sora-route-families)
- [Transactions anonymes](/fr/blockchain/anonymous-transactions.md)
