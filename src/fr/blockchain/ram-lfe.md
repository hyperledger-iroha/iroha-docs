---
translation_locale: fr
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE Il s'agit de l'évaluation de la fonction laconique des machines d'accès aléatoire.
Iroha, Il s'agit de la couche générique des fonctions cachées pour les programmes dont la politique publique
est en chaîne, mais dont la logique d'évaluation, le secret ou l'entrée brute ne doit pas être
Elle est utilisée par SORA Nexus les flux d'identification, tels que
recherche par téléphone privé ou par courrier électronique, et peut également être exposée en tant que générique Torii
aide à l'exécution du programme lorsqu'un profil de nœud permet les itinéraires face à l'application.

La chaîne stocke les métadonnées relatives à l'engagement en matière de politique et à la vérification des reçus.
résolvent ou Torii runtime évalue le programme caché, ne renvoie que le
d'exécution autorisée, et attache un reçu que les clients, outils de support, ou
les instructions du registre peuvent être vérifiées par rapport à la politique enregistrée.

## Nommage {#naming}

La division des noms est importante:

| Définition | La signification |
| --- | --- |
| `ram_lfe` | L'abstraction extérieure des fonctions cachées: politiques du programme, engagements, reçus d'exécution et mode de vérification des reçus. |
| `BFV` | Le schéma de cryptage homomorphe Brakerski/Fan-Vercauteren utilisé par l'entrée chiffrée RAM-LFE Les arrière-plan. |
| `ram_fhe_profile` | BFV- les métadonnées spécifiques à la machine d'exécution cryptée programmée. RAM-LFE. |

Dans le modèle de données, `RamLfeProgramPolicy` et `RamLfeExecutionReceipt` sont
RAM-LFE Les types. BFV les paramètres, enveloppes de texte chiffré et le caché
RAM-FHE le profil du programme appartient à l'arrière-plan d'exécution cryptée utilisé par un
La politique.

## Ce qu'il raconte {#what-it-records}

Une RAM-LFE la politique du programme est enregistrée dans le monde entier par `program_id`. La politique
contient:

- le compte propriétaire qui peut activer, désactiver ou muter le
  politique
- le backend annoncé aux clients
- le mode de vérification des reçus, soit `signed` ou `proof`
- un engagement envers les métadonnées cachées du programme et le secret de l'évaluateur
- la clé publique de résolution des reçus signés
- des métadonnées de saisie cryptées publiques facultatives, telles que: BFV paramètres et
  `ram_fhe_profile`
- une `active` drapeau qui contrôle si la politique peut émettre de nouveaux reçus

Le secret caché, la valeur d'identifiant de texte clair et le corps du programme caché sont
Les clients doivent traiter les engagements, les hashes opaques,
les hashs de réception, les chiffres et les digests de programme en tant que valeurs opaques du protocole.

## Les arrière-plan {#backends}

Courant RAM-LFE Le support est axé sur trois identifiants backend:

| Retour en arrière | Utilisation |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | Engagement obligatoire PRF l'évaluation. |
| `bfv-affine-sha3-256-v1` | BFV- une évaluation secrète par rapport à des espaces d'identification cryptés. |
| `bfv-programmed-sha3-256-v1` | BFV- l'exécution programmée par des registres cryptés et des voies de mémoire. |

Pour les politiques d'identification, le programme BFV le backend est l'important moderne
Il permet aux portefeuilles de chiffrer les entrées normalisées localement, permet au résolveur
évaluer sans voir un identifiant public dans la transaction, et renvoyer une
réception qui lie le hash de sortie à la politique du programme enregistré.

## Les maths {#math}

Cette section décrit l'algèbre au niveau de la mise en œuvre utilisée par le courant
RAM-LFE Ce n'est pas une preuve de sécurité, c'est la transcription déterministe
et le modèle d'évaluation crypté que les politiques, reçus et clients doivent
Je suis d'accord.

### Notation {#notation}

Laissez:

- Il faut que je le fasse. Iroha `Hash::new(m)`: Blake2b-32 est terminé. `m`, avec le moins
  une partie significative du octet final forcée à `1`.
- Il faut être canonique. Norito codification de `x`.
- \(a \parallel b\) la concaténation moyenne des chaînes en octets.
- \(\opérateurname{le64}(i)\) être le codage en petit indien de 8 octets d'une
  un nombre entier non signé.
- \(s\) être le résolveur secret détenu à l'extérieur de l'Etat mondial.
- \(P\) être des paramètres de politique publique.
- \(A\) être demandé des données associées.
- \(x\) être des octets d'entrée normalisés ou un Norito-encodé -entré crypté
  enveloppe, selon le backend.

RAM-LFE Les formules ci-dessous nomment les domaines par
but; leurs chaînes de octets actuelles sont:

| Le symbole | Chaîne de domaine |
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

L'engagement politique lie les paramètres publics et le résolveur secret caché à
Tout d'abord, le secret est commis séparément:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Ensuite, la transcription complète de la politique est codée:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

et le hash de politique publié est:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

La chaîne `PolicyCommitment` est:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

L'évaluation recompte la même valeur du secret de l'exécution.
le hash recomputé diffère, l'évaluation échoue avec un déséquilibre d'engagement.

### HKDF-SHA3-512 Retour en arrière {#hkdf-sha3-512-backend}

Pour `hkdf-sha3-512-prf-v1`, la sortie est l'entrée normalisée elle-même,
l'identifiant opaque et le hash du reçu sont confidentiels PRF Les résultats.

La transcription de la demande est:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

Les HKDF le sel et la clé pseudorandom sont:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Le matériau opaque est élargi et haché:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

Le matériel de réception lie également l'identifiant opaque:

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

Le backend retourne:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV Primaire {#bfv-primer}

BFV est un schéma de cryptage homomorphe basé sur le réseau.
qu'un programme peut ajouter et multiplier des valeurs cryptées et, après décryptage,
obtenir le même résultat que s'il avait effectué les ajouts et les multiplications
sur les valeurs de texte clair.

Pour RAM-LFE, BFV est utilisé comme mécanisme d'entrée crypté:

1. Un portefeuille normalise une valeur privée, comme un numéro de téléphone ou un courriel
   l'adresse.
2. Le portefeuille transforme les octets en petits espaces entiers.
3. Chaque fente est cryptée avec le résolveur BFV clé publique.
4. Le temps d'exécution du résolveur évalue le programme caché sur ces chiffres.
5. Le temps d'exécution décrypte uniquement la sortie du programme caché et signes ou prouve une
   Le reçu.

BFV C'est l'arithmétique exacte des nombres entiers, pas l'aritmétique approximative.
mieux adapté aux octets d'identification et aux petits calculs modulaires que
En ce qui concerne la définition de l'échantillon, il convient d'examiner les caractéristiques des Iroha C' est le courant BFV utilisation, chacune chiffrée
la fente porte une valeur scalaire modulo \(t\), généralement un octet ou une longueur de octet
Le texte chiffré lui-même vit modulo un nombre entier beaucoup plus grand \(q\). Les
différence entre \(q\) et \(t\) donne de la place au décryptage pour le bruit que le chiffrement
et introduire des opérations homomorphes.

Une BFV le texte cryptographique a deux composantes polynomielles:

$$
c=(c_0,c_1)
$$

La clé secrète est un autre polynôme \(s_k\). Le décryptage combine les
composants:

$$
v = c_0 + c_1s_k
$$

Si le texte chiffré a été formé correctement et que le bruit est encore assez petit,
\(v\) est proche du texte clair à l'échelle.
coefficient modulo \(t\). La propriété utile est que les opérations de texte chiffré
préserver cette structure:

| Opération simple | Opération de texte cryptographique |
| --- | --- |
| \(m+n\) | Ajoutez des composants de texte crypté. |
| \(m+\alpha\) | Ajoutez une constante de texte ordinaire à l' échelle dans \(c_0\). |
| \(\alpha m\) | L'échelle des deux composants de texte crypté par \(\alpha\). |
| \(mn\) | Multipliez les polynômes de texte chiffré, rééchellez, puis relineez. |

La multiplication est une opération coûteuse.
ciphertexts crée naturellement un texte chiffré à trois composants qui décrypte avec
\(1\), \(s_k\), et \(s_k^2\). La redéfinition utilise une clé d'évaluation publiée
pour plier le \(s_k^2\) le terme de retour dans un texte chiffré à deux composants normaux.
conserve des ajouts et des multiplications ultérieurs en utilisant la même forme de texte chiffré.

BFV est également "niveaux": chaque opération cryptée consomme un budget de bruit.
Cette mise en œuvre ne démarre pas les chiffres pour rafraîchir ce budget.
Au lieu de cela, RAM-LFE publie une petite `ram_fhe_profile` et n'accepte qu'une limite
forme du programme caché. qui garde l'évaluation dans le ensemble de paramètres
La profondeur actuelle programmée permet un registre fixe
compte, nombre fixe de voies mémoire et au plus un texte chiffré
multiplication par étape programmée.

Dans cette RAM-LFE la conception, BFV cache les données du client à partir des données publiques et
Il ne s'agit pas d'un
La chaîne exécute elle-même des programmes cryptés arbitraires. Torii résolveur
Le temps de fonctionnement possède toujours le BFV le matériel secret, évalue la configuration cachée
le programme, décrypte la sortie autorisée et atteste le résultat.
vérifie ensuite l'attestation contre l'engagement en matière de politique sur chaîne et
résoudre les métadonnées de clé publique ou de preuve.

Le cas d'utilisation de l'identifiant choisit délibérément une simple représentation.
la chaîne normalisée est codée comme suit:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Chaque élément est crypté comme le sien BFV Le texte de chiffrement scalaire.
normalisation et validation explicite de l'enveloppe, permet aux portefeuilles de construire crypté
les requêtes de paramètres publics, et permet au résolveur canonize équivalent
les entrées cryptées dans une transcription stable du reçu.

### BFV Modèle d'anneau {#bfv-ring-model}

Les BFV Les arrière-plan utilisent l'anneau polynomial négacyclique:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

et anneau de texte clair:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

où:

- \(n\) est `polynomial_degree`, une puissance de deux
- \(q\) est `ciphertext_modulus`
- \(t\) est `plaintext_modulus`
- \(q > t\) et \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Les vecteurs des coefficients de texte clair sont codés en écaillant chaque coefficient:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Le déchiffrement du centre-élévateur pour chaque coefficient de:

$$
v = c_0 + c_1 s_k \in R_q
$$

puis le fait retourner en \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Je vous en prie. \(s_k\) est le BFV polynôme de clé secrète, pas l'extérieur RAM-LFE résolveur
le secret \(s\).

### BFV Génération clé {#bfv-key-generation}

Pour les entrées d'identifiants cryptés, BFV le matériau clé est déterministe par
Les données secrètes du résolveur et associées:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

Les BFV RNG est semé comme suit:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Les échantillons de générateurs clés:

- \(s_k \in \{-1,0,1\}^n\), modulo représenté \(q\)
- \(a \leftarrow R_q\) uniformément
- \(e \in \{-1,0,1\}^n\)

La clé publique est:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Pour la relinéarisation, laissez \(s_k^2\) être le produit de l'anneau dans \(R_q\). Pour chaque
la base\(B\) chiffre \(j\), échantillon \(a_j\) uniformément et \(e_j\) de la petite
distribuer, puis publier:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Le public BFV Les métadonnées de la politique contiennent \((n,q,t,B)\), la clé publique et
`max_input_bytes`. Les BFV la clé secrète et la clé de relinéarisation restent dans le
Le temps de fonctionnement du résolveur.

### BFV Le chiffrement et les opérations {#bfv-encryption-and-operations}

Pour chiffrer un polynôme de texte simple \(m\), la mise en œuvre des semences d'une autre
ChaCha20 RNG de:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Il les échantillons \(u,e_1,e_2 \in \{-1,0,1\}^n\) et les calculs:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Le texte de chiffrement est c=c_0,c_1)\).

L'addition homomorphe est composante:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Ajout d'une échelle de texte clair \(\alpha\) uniquement aux modifications du coefficient zéro
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Multiplication par une échelle de texte clair \(\alpha\) l'échelle des deux composants:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Pour deux textes chiffrés \(c=(c_0,c_1)\) et d = d_0,d_1)\), texte chiffré
La multiplication compute d'abord un texte chiffré de trois tailles et mesure chacun
coefficient de retour par \(t/q\):

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

Tous les produits ci-dessus sont des produits de ringes négacycliques \(R_q\). Alors ...
\(\tilde c_2\) est décomposé en base-\(B\) les polynômes:

$$
\tilde c_2 = \sum_j B^j u_j
$$

et rallinéarisé:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Le résultat est à nouveau un composant à deux BFV le texte crypté.

### Identifiant chiffrement enveloppe {#identifier-ciphertext-envelope}

Une chaîne d'entrée en octets d'identifiant:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

est codé dans des espaces scalaires:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

et toutes les machines à sous restantes sont zéro jusqu'à `max_input_bytes + 1`. Chaque écalier
la fente est cryptée comme le polynôme de texte clair à coefficient zéro \([m_i]\).
La graine de chiffrement par fente est:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

L'enveloppe d'identifiant cryptée est:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

où \(M=\mathrm{max\_input\_bytes}\).

### BFV Un retour à la mode {#bfv-affine-backend}

Pour `bfv-affine-sha3-256-v1`, la durée de fonctionnement dérive d'abord BFV matériau clé de
\(s\) et \(A\). Les paramètres publics dérivés doivent correspondre exactement au public
les paramètres engagés sur la chaîne.

La graine du circuit affine est:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

À partir de cette graine, les échantillons en cours d'exécution, modulo \(t\), un circuit affine de 32 rangées:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

où \(m_i\) sont les fentes d'identification décryptées.
la même valeur sur les textes cryptés:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Le résolveur décrypte chacun \(C_j\), nécessite tous les textes clairs arrière
des coefficients à zéro, convertit les valeurs de coefficient-zéro en octets, et
les formulaires:

$$
O=(y_0,\ldots,y_{31})
$$

Puis:

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

### BFV Un arrière-plan programmé {#bfv-programmed-backend}

Pour `bfv-programmed-sha3-256-v1`, les paramètres publics enveloppent le BFV identifiant
Paramètres de cryptage plus un digeste du programme caché:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Le courant RAM-FHE le profil est:

| champs | La valeur |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

Les entrées de texte clair soumises à: Torii est crypté dans le même BFV enveloppe
La semence déterministe pour ce chiffrement côté serveur est:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Pour les entrées cryptées fournies à l'extérieur, le résolveur décrypte l'identifiant
l'enveloppe et le re-encrypte sur cette enveloppe déterministe avant de l'exécuter.
Cette canonisation maintient les hashs de réception stables à travers l'égalité sémantique
BFV les textes chiffrés.

Les voies de mémoire cryptées initiales sont dérivées de:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

Pour chacune des 32 voies, les échantillons de temps d'exécution_j \in [0,t)\) et stocke un BFV
cryptage du texte chiffré \(r_j\). Le programme caché exécute alors sur crypté
enregistrements et mémoire cryptée:

| Instructions | L'algebra |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | Il y en a une._Le nom de l'opérateur |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), puis re-linéaire |
| `SelectEqZero(dst, cond, z, nz)` | Déchiffrement \(R_{\mathrm{cond}}\); choisir \(R_z\) lorsque c'est zéro, sinon \(R_{nz}\). |
| `Output(src)` | Appendice \(R_{\mathrm{src}}\) à la liste du registre de sortie. |

Une fois la bande d'instructions terminée, le résolveur décrypte chaque sortie
enregistrer, convertir le coefficient zéro en un octet et concatener ces octets:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Les hashs génériques de backend programmés sont:

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

La bande d'identifiant programmée par défaut a 64 fentes d'entrée.
\(i\), Il charge la fente d'entrée, il charge la voie de mémoire \(i \bmod 32\), les ajoute,
et donne le résultat:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Hashs et reçus de sortie {#output-hashes-and-receipts}

Le générique RAM-LFE Le reçu d'exécution ne signe pas la sortie brute.
le hash de sortie:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Pour Torii RAM-LFE les reçus d'exécution, les données associées sont le canonique
octets d'identifiant de programme:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

La charge utile du reçu signé est:

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

Pour `signed` mode:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

La vérification de la signature `resolver_public_key` et rejette le
réception, à moins que toutes ces équivalences ne portent:

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

Si l'appelant fournit `output_hex`, le vérificateur vérifie également:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

Pour `proof` mode, l'attestation porte une enveloppe de preuve au lieu d'une
La vérification vérifie que le backend de la preuve, l'identifiant du circuit,
hash de schéma d'entrée publique, hash de clé de vérification et instances publiques exposées
correspondent aux métadonnées du vérificateur de preuve et au hash codé de charge d'achat des reçus.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Les instances publiques attendues sont quatre colonnes à un élément. \(j\)
contient des octets \(h_{8j}\ldots h_{8j+7}\) suivis de 24 octets zéro:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Projection de l'identifiant {#identifier-projection}

La résolution de l'identifiant n'utilise pas le backend générique `opaque_hash` comme le
L'identifiant de compte opaque à l'utilisateur. RAM-LFE hash de sortie
par des domaines spécifiques à l'identifiant:

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

Une `IdentifierResolutionReceipt` signe une charge utile de niveau supérieur:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Pour les reçus d'identification signés:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` n'accepte le reçu que lorsque la signature ou la preuve est
valides, le système intégré RAM-LFE la charge utile d'exécution correspond au programme de référence
La politique et les `uaid` et `account_id` sont les obligations liées à la demande.

## Flux d'exécution {#execution-flow}

Un générique RAM-LFE l'exécution est de la forme suivante:

1. Gouvernance ou registre d'un opérateur `RamLfeProgramPolicy`.
2. Le propriétaire active la police.
3. Le client lit les métadonnées des politiques publiques de Torii.
4. Le client soumet exactement un formulaire d'entrée au résolveur: texte clair
   `input_hex` ou un chiffré BFV enveloppe d'entrée.
5. Le runtime évalue le programme caché et retourne `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, et une
   `RamLfeExecutionReceipt`.
6. Le client ou le backend vérifie la réception en fonction de la politique publiée,
   optionnel de vérifier que le retour `output_hex` hashes au reçu
   `output_hash`.
7. Une instruction de niveau supérieur, telle que `ClaimIdentifier`, peut intégrer le
   réception attestée au lieu d'intégrer l'entrée brute.

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

## Politiques d'identification {#identifier-policies}

Les politiques d'identification sont une utilisation concrète des RAM-LFE. Ils ajoutent une entreprise
règle d'espace de noms et de normalisation en plus d'une politique générique du programme:

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

La couche d'identification utilise les RAM-LFE réception à lier:

- `policy_id`
- l'identifiant opaque dérivé de la fonction cachée
- le déterminisme `receipt_hash`
- le compte est UAID
- le canonique `account_id`
- le générique RAM-LFE charge utile d'exécution

Pour l'intégration en face de l'utilisateur, gardez les pseudonymes des comptes séparés du privé
Les aliases sont des noms publics, des numéros de téléphone, des adresses électroniques et
des valeurs similaires devraient circuler dans les politiques d'identification et les reçus.

## Torii Route {#torii-routes}

Lorsque la famille des itinéraires face à l'application est activée, Torii exposés RAM-LFE et
aides à l'identification:

| Route | Le but |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | Liste active et inactive RAM-LFE les politiques du programme et les métadonnées de l'exécution publique. |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | Exécuter un programme à partir `input_hex` ou `encrypted_input` et de retourner des hashs de sortie plus un reçu sans état. |
| `POST /v1/ram-lfe/receipts/verify` | Vérifiez un `RamLfeExecutionReceipt` par rapport à la politique publiée et comparer optionnellement `output_hex` à `output_hash`. |
| `GET /v1/identifier-policies` | Liste des politiques d'identification, des modes de normalisation, des clés de résolution et des métadonnées d'entrée cryptées. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | Émettre le reçu que l'utilisateur peut intégrer `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | Résoudre une entrée d'identifiant normalisé dans le compte lié lorsqu'une réclamation active existe. |
| `GET /v1/identifiers/receipts/{receipt_hash}` | Recherchez une demande d'identification persistante en utilisant un hash de réception pour les outils d'audit et de support. |

Vérifiez toujours les nœuds cibles `/openapi` ou `/openapi.json` document précédent
La disponibilité dépend de la construction du nœud et
profil réseau.

## Temps d'exécution du nœud {#node-runtime}

Torii C' est en cours . RAM-LFE la durée de fonctionnement est configurée en
`torii.ram_lfe.programs[*]`, à clé par `program_id`. Chaque programme configuré
doit correspondre à l'engagement de la politique en chaîne et doit fournir le temps d'exécution
Le matériel nécessaire à l'évaluation et à l'attestation des reçus.
le même temps d'exécution; ils ne nécessitent pas une configuration séparée identifiant-résolveur
à la surface.

L'enregistrement d'une politique en chaîne ne suffit pas par lui-même.
Les données de l'expérience sont également fournies par les autorités compétentes.
les programmes qu'il est prévu d'exécuter.

## Garde-roues opérationnelles {#operational-guardrails}

- Enregistrer les politiques inactives, vérifier les métadonnées publiques, puis les activer.
- Gardez les secrets des évaluateurs cachés, les clés de signature du résolveur, et BFV le secret
  des documents, des journaux, des transactions et des paquets de clients.
- Ne pas mettre d'identifiants bruts dans les pseudonymes de compte, les métadonnées des transactions,
  les événements, ou des champs d'état mondial.
- Vérifiez les reçus du côté client avant de soumettre des instructions de niveau supérieur
  lorsque le SDK exposer un vérificateur.
- Utilisez des champs d'expiration où les reçus périmés ne devraient pas rester valables à jamais.
- Rotation en enregistrant un nouveau programme ou une nouvelle politique d'identification, clients migrateurs,
  et de désactiver l'ancienne politique une fois que les nouveaux reçus sont entrés.

## Sujets connexes {#related-topics}

- [Frais de parrainage pour un espace de données privé](/fr/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Les points de fin](/fr/reference/torii-endpoints.md#app-and-sora-route-families)
- [Transactions anonymes](/fr/blockchain/anonymous-transactions.md)
