---
translation_locale: fr
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE représente l'évaluation de la fonction laconique de la machine d'accès aléatoire. En Iroha, c'est la couche de fonction cachée générique pour les programmes dont la politique publique est en chaîne, mais dont la logique d'évaluation, le secret ou l'entrée brute ne devraient pas être écrits à l'état mondial. Il est utilisé par les flux d'identifiants SORA Nexus, tels que la recherche privée de téléphone ou de courrier électronique, et peut également être exposé en tant qu'assistant générique à l'exécution du programme Torii lorsqu'un profil de nœud permet les itinéraires face à l'application.

La chaîne stocke les métadonnées d'engagement de la politique et de vérification des reçus. Un résolveur ou Torii runtime évalue le programme caché, renvoie uniquement la sortie autorisée et attache un reçu que les clients, l'outillage de support ou les instructions du registre peuvent vérifier contre la politique enregistrée.

## Nommage {#naming}

La division des noms est importante:

|Durée |Le sens .|
| --- | --- |
|`ram_lfe` |L'abstraction externe de la fonction cachée: politiques du programme, engagements, reçus d'exécution et mode de vérification des reçus. |
|`BFV` |Le schéma de cryptage homomorphe Brakerski/Fan-Vercauteren utilisé par les arrière-plans RAM-LFE à entrée cryptée. |
|`ram_fhe_profile` |BFV - métadonnées spécifiques à la machine d'exécution cryptée programmée. Ce n'est pas un deuxième nom pour RAM-LFE. |

Dans le modèle de données, `RamLfeProgramPolicy` et `RamLfeExecutionReceipt` sont des types RAM-LFE. Les paramètres BFV, les enveloppes de texte crypté et le profil du programme caché RAM-FHE appartiennent au backend d'exécution crypté utilisé par une politique.

## Ce qu'il raconte {#what-it-records}

Une politique du programme RAM-LFE est enregistrée à l'échelle mondiale par `program_id`.

- le compte du propriétaire qui peut activer, désactiver ou modifier autrement la politique
- l'arrière-plan annoncé aux clients
- le mode de vérification du reçu, soit `signed` ou `proof`;
- un engagement pour les métadonnées cachées du programme et le secret de l'évaluateur
- la clé publique de résolution pour les reçus signés
- les métadonnées de saisie en cryptage public facultatives, telles que les paramètres BFV et `ram_fhe_profile`
- un drapeau `active` qui contrôle si la police peut émettre de nouveaux reçus

Le secret caché, la valeur d'identifiant de texte clair et le corps du programme caché ne sont pas stockés dans l'état mondial. Les clients doivent traiter les engagements, les hashes opaques, les hashs de réception, les chiffres et les digests de programmes comme des valeurs protocoles opaques.

## Rétrospectifs {#backends}

Le support actuel RAM-LFE est axé sur trois identifiants back-end:

|Retour en arrière .|Utilisation |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |Évaluation liée à l'engagement PRF. |
|`bfv-affine-sha3-256-v1` |BFV appuyée par l'évaluation secrète des affinités sur les espaces d'identification cryptés. |
|`bfv-programmed-sha3-256-v1` |L'exécution programmée prise en charge par BFV sur les registres cryptés et les voies de mémoire. |

Pour les politiques d'identification, l'arrière-plan programmé BFV est le chemin moderne important. Il permet aux portefeuilles de crypter les entrées normalisées localement, permet au résolveur d'évaluer sans voir un identifiant public dans la transaction, et renvoie un reçu qui lie le hash de sortie à la politique du programme enregistrée.

## Mathématiques {#math}

Cette section décrit l'algèbre de niveau d'implémentation utilisée par le code actuel RAM-LFE. Ce n'est pas une preuve de sécurité; c'est la transcription déterministe et le modèle d'évaluation crypté sur lequel les politiques, les reçus et les clients doivent s'entendre.

### Notation {#notation}

Laissez-moi:

- \(H(m)\) être Iroha `Hash::new(m)`: Blake2b-32 sur `m`, le bit le moins important du byte final étant forcé à `1`.
- \(N(x)\) est le codage canonique Norito de `x`.
- \(a \parallel b\) signifie la concaténation de chaîne en octets.
- \(\opérateurname{le64}(i)\) être le codage petit-endian de 8 bytes d'un entier non signé.
- \(s\) être le résolveur secret détenu à l'extérieur de l'état mondial.
- \(P\) sont des paramètres d'ordre public.
- \(A\) sont les données associées requises.
- \(x\) sont des octets d'entrée normalisés ou une enveloppe d'entrée cryptée codée par Norito, selon le backend.

RAM-LFE utilise des haches séparées par domaine. Les formules ci-dessous nomment les domaines selon leur but; leurs chaînes de octets actuelles sont:

|Symbole |Chaîne de domaine |
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

### L'engagement politique {#policy-commitment}

L'engagement politique lie les paramètres publics et le secret de résolution cachée à un backend.

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Ensuite , la transcription complète de la politique est codée:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

et le hash de politique publié est:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Le `PolicyCommitment` en chaîne est:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

L'évaluation recompte la même valeur à partir du secret de l'exécution. Si le hash recomputé diffère, l'évaluation échoue avec un désaccord d'engagement.

### HKDF-SHA3-512 Retour en arrière {#hkdf-sha3-512-backend}

Pour `hkdf-sha3-512-prf-v1`, la sortie est l'entrée normalisée elle-même, mais l'identifiant opaque et le hachage de reçus sont des sorties liées secrètement PRF.

La transcription de la demande est:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

Le sel HKDF et la clé de pseudorandom sont:

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

Le matériau de réception lie également l'identifiant opaque:

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

L' arrière-plan est de retour:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### Préparateur BFV {#bfv-primer}

BFV est un schéma de cryptage homomorphe basé sur le réseau. "Homomorphe" signifie qu'un programme peut ajouter et multiplier des valeurs cryptées et, après décryptage, obtenir le même résultat que s'il avait effectué les ajouts et multiplication sur les valeurs du texte clair.

Pour RAM-LFE, BFV est utilisé comme mécanisme d'entrée crypté:

1. Un portefeuille normalise une valeur privée, comme un numéro de téléphone ou une adresse e-mail.
2. Le portefeuille transforme les octets en petits espaces entiers.
3. Chaque slot est crypté avec la clé publique BFV du résolveur.
4. Le temps d'exécution du résolveur évalue le programme caché sur ces chiffrements.
5. Le temps d'exécution décrypte uniquement la sortie du programme caché et signe ou prouve un reçu.

BFV est l'arithmétique exacte des nombres entiers et non approximative. C'est pourquoi il est mieux adapté aux octets d'identification et aux petits modules Les calculs sont plus basés sur l'inference du modèle de point flottant. Iroha C' est le courant BFV l'utilisation, chaque fente cryptée porte un modulo de valeur scalaire \(t\), Le texte de chiffrement lui-même vit modulo un nombre entier beaucoup plus grand \(q\). L'écart entre \(q\) et \(t\) permet de déchiffrer le bruit introduit par les opérations de chiffrement et d'homomorphie.

Un texte de chiffrement BFV a deux composantes polynomielles:

$$
c=(c_0,c_1)
$$

La clé secrète est un autre polynôme \(s_k\). Le décryptage combine les composants:

$$
v = c_0 + c_1s_k
$$

Si le texte cryptographique a été correctement formé et que le bruit est encore suffisamment faible, \(v\) est proche du texte simple à l'échelle. La rotation récupère le coefficient de texte simple modulo \(t\).

|Opération simple |L' opération de texte crypté |
| --- | --- |
|\(m+n\) |Ajouter des composants de texte crypté. |
|\(m+\alpha\) |Ajoutez une constante de texte clair à l'échelle dans \(c_0\). |
|\(\alpha m\) |Écaillez les deux composants du texte crypté par \(\alpha\). |
|\(mn\) |Multipliez les polynômes de texte chiffré, redimensionnez, puis relineez. |

La multiplication est l'opération coûteuse. Un produit de deux chiffres à deux composants crée naturellement un chiffre à trois composants qui se décrypte avec \(1\), \(s_k\) et \(s_k^2\). Relinearization utilise une clé d'évaluation publiée pour replier le terme \(s_k^2\) dans un texte chiffré à deux composants normal. Cela maintient des ajouts et des multiplications ultérieurs en utilisant la même forme du texte chiffré.

BFV est également "nivelé": chaque opération cryptée consomme un budget de bruit. Cette mise en œuvre ne démarre pas les textes chiffrés pour rafraîchir ce budget. Au lieu de cela, RAM-LFE publie un petit `ram_fhe_profile` et accepte seulement une forme de programme cachée limitée. Cela maintient l'évaluation dans la profondeur prise en charge de l'ensemble de paramètres. Le profil programmé actuel permet un nombre fixe du registre, un nombre fixe des voies de mémoire et au plus une multiplication de texte chiffré par étape programmée.

Dans cette conception RAM-LFE, BFV cache l'entrée du client des données du registre public et des observateurs qui ne voient que la charge utile de la transaction ou de la route. Cela ne signifie pas que la chaîne exécute elle-même des programmes chiffrés arbitraires. Le résolveur Torii runtime possède toujours le matériel secret BFV, évalue le programme caché configuré, décrypte la sortie autorisée et atteste le résultat.

Le cas d'utilisation de l'identifiant choisit délibérément une simple représentation.

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Chaque élément est crypté comme son propre BFV texte chiffré scalaire. Cette forme rend la normalisation et la validation de l'enveloppe explicites, permet aux portefeuilles de créer des requêtes cryptées à partir de paramètres publics, et permet au résolveur de canoniser les entrées cryptées équivalentes dans une transcription stable de réception.

### Modèle d'anneau BFV {#bfv-ring-model}

Les arrière-plans BFV utilisent l'anneau polynomial négacyclique:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

et anneaux de texte clair:

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

Déchiffrement du centre-élévateur pour chaque coefficient de:

$$
v = c_0 + c_1 s_k \in R_q
$$

il le fait ensuite retourner à \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Ici \(s_k\) est le polynôme de clé secrète BFV, et non le résolveur secret extérieur RAM-LFE \(s\).

### BFV Génération clé {#bfv-key-generation}

Pour les entrées d'identifiants cryptés, le matériau clé BFV est déterminant par résolveur et les données secrètes associées:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

Le BFV RNG est semé comme suit:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Les échantillons de générateurs clés:

- \(s_k \in \{-1,0,1\}^n\), représenté par le modulo \(q\)
- \(a \leftarrow R_q\) uniformément
- \(e \in \{-1,0,1\}^n\)

La clé publique est:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Pour la relinearisation, \(s_k^2\) doit être le produit de l'anneau dans \(R_q\). Pour chaque chiffre de base-\(B\) \(j\), prenez l'échantillon \(a_j\) uniformément et \(e_j\) à partir de la petite distribution, puis publiez:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Le public BFV les métadonnées de la politique contiennent \((n,q,t,B)\), la clé publique et `max_input_bytes`. Les États membres BFV La clé secrète et la clé de relinearisation restent dans le temps d'exécution du résolveur.

### BFV Le chiffrement et les opérations {#bfv-encryption-and-operations}

Pour chiffrer un polynôme de texte clair \(m\), l'implémentation produit une autre ChaCha20 RNG à partir de:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Il prélève des échantillons \(u,e_1,e_2 \in \{-1,0,1\}^n\) et calcule:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Le texte du chiffrement est \(c=(c_0,c_1)\).

L'addition homomorphe est composante:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

L'ajout d'une échelle de texte clair \(\alpha\) au coefficient zéro ne change que \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Multiplication par une échelle de texte clair \(\alpha\) équivaut aux deux composants:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Pour deux textes de chiffrement \(c=(c_0,c _1)\) et \(d=(d_0,d_1)\), la multiplication du texte de chiffrement calcule d'abord un texte de chiffrage de trois tailles et mesure chaque coefficient en arrière par \(t/q\):

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

Tous les produits ci-dessus sont des produits d'anneaux négacycliques dans \(R_q\). Puis \(\tilde c_2\) est décomposé en polynômes de base-\(B\):

$$
\tilde c_2 = \sum_j B^j u_j
$$

et réallinérifiés:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Le résultat est encore une fois un texte chiffré à deux composants BFV.

### Enveloppe de texte de chiffrement {#identifier-ciphertext-envelope}

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

et toutes les fentes restantes sont zéro jusqu'à `max_input_bytes + 1`. Chaque fente scalaire est cryptée comme le polynôme de texte clair à coefficient zéro \([m_i]\). La graine de chiffrement par fente est:

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

### BFV Retour en arrière {#bfv-affine-backend}

Pour `bfv-affine-sha3-256-v1`, le temps d'exécution dérive d'abord du matériau clé BFV de \(s\) et \(A\). Les paramètres publics dérivés doivent correspondre exactement aux paramètres publiques engagés en chaîne.

La graine de circuit affine est:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

À partir de cette graine, les échantillons en cours d'exécution, modulo \(t\), un circuit affini de 32 rangées:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

où \(m_i\) sont les fentes d'identifiant décryptées. Homomorphiquement, il calcule la même valeur sur des textes cryptés:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Le résolveur décrypte chaque \(C_j\), exige que tous les coefficients de texte ordinaire arrière soient zéro, convertit les valeurs du coefficient-zéro en octets et forme:

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

### BFV L'arrière-plan programmé {#bfv-programmed-backend}

Pour `bfv-programmed-sha3-256-v1`, les paramètres publics comprennent les paramèters de cryptage de l'identifiant BFV, ainsi qu'un digeste du programme caché:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Le profil actuel RAM-FHE est le suivant:

|champ |La valeur |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

L'entrée de texte clair présentée à Torii est cryptée dans la même enveloppe BFV avant l'exécution.

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Pour les entrées cryptées fournies à l'extérieur, le résolveur décrypte l'enveloppe d'identifiant et la recrypte sur cette enveloppe déterministique avant de l'exécuter. Cette canonisation maintient les hashes de réception stables sur des chiffres sémantiquement égaux BFV.

Les voies de mémoire cryptées initiales sont dérivées des:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

Pour chacune des 32 voies, les échantillons de temps d'exécution \(r_j \in [0,t)\) et stocke un texte chiffré BFV cryptant \(r_j\). Le programme caché exécute ensuite sur des registres cryptés et la mémoire cryptée:

|Instruction |L' algèbre|
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |R _ {\mathrm{dst}} \leftrow \operatorname{Enc}(a)\) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), puis relineer |
|`SelectEqZero(dst, cond, z, nz)` |Déchiffrer \(R_{\mathrm{cond}}\); sélectionner \(R_z\) lorsqu'il est zéro, sinon \(R_{nz}\). |
|`Output(src)` |Ajouter \(R_{\mathrm{src}}\) à la liste du registre de sortie. |

Une fois la bande d'instructions terminée, le résolveur décrypte chaque registre de sortie, convertit le coefficient zéro en un octet et concaténage ces octets:

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

Le ruban d'identification par défaut programmé a 64 fentes d'entrée. Pour chaque fente \(i\), il charge la fente d'entrée, charge la voie de mémoire \(i \bmod 32\), les ajoute et donne le résultat:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Hashs de sortie et reçus {#output-hashes-and-receipts}

Le reçu d'exécution générique RAM-LFE ne signe pas la sortie brute. Il signale le hash de sortie:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Pour les reçus d'exécution Torii RAM-LFE, les données associées sont les octets de l'identifiant du programme canonique:

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

Pour le mode `signed`:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

La vérification vérifie la signature avec `resolver_public_key` et rejette le reçu, à moins que toutes ces équations ne soient:

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

Pour le mode `proof`, l'attestation porte une enveloppe de preuve au lieu d'une signature. La vérification vérifie que le backend de la preuve, l'identifiant du circuit, le hash du schéma d'entrée publique, le hash de la clé de vérification et les instances publiques exposées correspondent aux métadonnées du vérificateur de preuve et au hash des reçus payload codés.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Les instances publiques attendues sont quatre colonnes à un élément. La colonne \(j\) contient des octets \(h_{8j}\ldots h_{8j+7}\) suivis de 24 octets zéro:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Projection de l'identifiant {#identifier-projection}

La résolution de l'identifiant n'utilise pas le backend générique `opaque_hash` En tant qu'identifiant de compte opaque à l'utilisateur. RAM-LFE hash de sortie à travers des domaines spécifiques à l'identifiant:

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

`ClaimIdentifier` n'accepte le reçu que lorsque la signature ou la preuve est valide, que la charge utile d'exécution intégrée RAM-LFE correspond à la politique du programme référencée et que les `uaid` et `account_id` sont l'obligation requise.

## Flux d'exécution {#execution-flow}

L'exécution générique RAM-LFE a la forme suivante:

1. La gouvernance ou les registres d'un opérateur `RamLfeProgramPolicy`.
2. Le propriétaire active la police.
3. Le client lit les métadonnées d'ordre public de Torii.
4. Le client soumet exactement un formulaire d'entrée au résolveur: texte clair `input_hex` ou enveloppe d'entrée cryptée BFV.
5. Le temps d'exécution évalue le programme caché et renvoie `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` et un `RamLfeExecutionReceipt`.
6. Le client ou le backend vérifie la réception par rapport à la politique publiée, en vérifiant optionnellement que le `output_hex` retourné est lié au `output_hash` de la réception.
7. Une instruction de niveau supérieur, telle que `ClaimIdentifier`, peut intégrer le reçu attesté au lieu d'intégrer l'entrée brute.

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

## Politiques relatives à l'identification {#identifier-policies}

Les politiques d'identification sont une utilisation concrète de RAM-LFE. Elles ajoutent un espace de noms d'entreprise et une règle de normalisation au-dessus d'une politique de programme générique:

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

La couche d'identification utilise le reçu RAM-LFE pour lier:

- `policy_id`
- l'identifiant opaque dérivé de la fonction cachée
- la déterministique `receipt_hash`
- le compte est UAID
- le canonique `account_id`
- la charge utile d'exécution générique RAM-LFE

Pour l'intégration en face de l'utilisateur, gardez les pseudonymes des comptes séparés des identifiants privés. Les pseudonymes sont des noms publics; les numéros de téléphone, les adresses e-mail et autres valeurs similaires doivent circuler dans les politiques d'identification et les reçus.

## Route Torii {#torii-routes}

Lorsque la famille de routes orientée vers l'application est activée, Torii expose le RAM-LFE et les aides à l'identification:

|Route |Objectif |
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |Liste des politiques de programme actives et inactives RAM-LFE et des métadonnées d'exécution publique. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |Exécuter un programme à partir de `input_hex` ou `encrypted_input` et retourner les hashes de sortie plus un reçu sans état. |
|`POST /v1/ram-lfe/receipts/verify` |Vérifiez un `RamLfeExecutionReceipt` par rapport à la politique publiée et comparez optionnellement le `output_hex` au `output_hash`. |
|`GET /v1/identifier-policies` |Liste des politiques d'identification, des modes de normalisation, des clés de résolution et des métadonnées de saisie cryptées. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Émettre le reçu que l'utilisateur peut insérer dans `ClaimIdentifier`. |
|`POST /v1/identifiers/resolve` |Résoudre une entrée d'identifiant normalisé sur le compte lié lorsqu'il existe une réclamation active. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |Rechercher une demande d'identification persistante en utilisant un hash de réception pour les outils d'audit et de soutien. |

Vérifiez toujours le document `/openapi` ou `/openapi.json` du nœud cible avant de construire par rapport à ces routes. La disponibilité dépend de la construction du node et du profil réseau.

## Temps d'exécution du nœud {#node-runtime}

Torii C' est en cours . RAM-LFE le temps d'exécution est configuré sous: `torii.ram_lfe.programs[*]`, clés par `program_id`. Chaque programme configuré doit être conforme à l'engagement de la politique en chaîne et fournir le matériel nécessaire pour évaluer et Les routes d'identification réutilisent ce même temps d'exécution; elles ne nécessitent pas une surface de configuration séparée identifiant-résolveur.

L'enregistrement d'une politique sur la chaîne ne suffit pas par lui-même. Un nœud cible doit également exposer la famille de routes et avoir le matériel d'exécution correspondant pour les programmes qu'il s'attend à exécuter.

## Roues de garde opérationnelles {#operational-guardrails}

- Enregistrer les politiques inactives, vérifier les métadonnées publiques, puis les activer.
- Gardez les secrets de l'évaluateur cachés, les clés de signature du résolveur et le matériel secret BFV hors des documents, logs, transactions et paquets de clients.
- Ne mettez pas d'identifiants bruts dans des pseudonymes de compte, des métadonnées de transaction, des événements ou des champs d'état mondial.
- Vérifier les reçus du côté client avant de soumettre des instructions de niveau supérieur lorsque le SDK expose un vérificateur.
- Utilisez des champs d'expiration où les reçus obsolètes ne devraient pas rester valables à jamais.
- Rotate en enregistrant un nouveau programme ou une nouvelle politique d'identification, en migrant les clients et en désactivant l'ancienne politique dès que de nouveaux reçus circulent.

## Sujets connexes {#related-topics}

- [Les frais de parrainage pour un espace de données privé ](/fr/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Points d'arrêt](/fr/reference/torii-endpoints.md#app-and-sora-route-families)
- [Les opérations anonymes ](/fr/blockchain/anonymous-transactions.md)
