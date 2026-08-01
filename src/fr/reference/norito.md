---
translation_locale: fr
translation_source: /reference/norito.md
translation_source_hash: 4297b0ff795a5cdb6556424e89de7191522271519aa36720ed45a695ad402211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Norito {#norito}

Norito est Iroha est la couche de sérialisation canonique. C'est le format en octets utilisé quand les pairs, SDKs, CLI outils, Torii, Kura, et les artefacts générés doivent être d'accord sur la même charge utile.

Utilisation Norito Lorsque les données font partie d'un consensus, de la signature, du hachage, de la persistance ou de l'intersection SDK l'interopérabilité. JSON lorsqu'un point final offre explicitement une projection lisible par l'homme pour les opérateurs, les tableaux de bord ou un débogage rapide.

## Où Norito apparaît {#where-norito-appears}

|La surface|Comment Norito est utilisé |
| --- | --- |
|Transactions et requêtes |Les charges utiles de transaction et de requête signées soumises par l'intermédiaire de Torii sont codées comme Norito. |
|Genèse .|`kagami genesis sign` produit un bloc signé `.nrt` qui correspond à la charge au démarrage. |
|Torii les réponses typées |Les terminaux qui prennent en charge les réponses binaires typées utilisent `Accept: application/x-norito`. |
|SDKs | Rust, Python, JavaScript, Kotlin/ Java, Swift, et Android les clients utilisent Norito les constructeurs ou liaisons au lieu des bytes assemblés à la main. |
|Kura stockage |Les charges utiles de bloc, les voitures de récupération, les listes et les marqueurs d'engagement sont stockés en tant que données encadrées Norito. |
|Manifestations |Nexus, la disponibilité des données, SoraFS, le streaming et les manifestes face à l'application utilisent Norito lorsque le manifeste doit être signé ou haché. |
|Le streaming |Norito La diffusion en continu utilise des manifestes Norito, des en-têtes de segment, des cadres de contrôle et des appareils de conformité. |

Norito n'est pas un langage de contrat intelligent. C'est l'enveloppe déterministe et le codec qui transportent les transactions, les appels contractuels, les manifestes et les charges utiles API typées.

## Modèle de charge utile {#payload-model}

Chaque charge utile sur fil ou disque Norito est encadré par une en-tête suivie des octets de charge utile codés. Les charges utiles sans en-têtes, ou nues, sont réservées pour le hachage interne, les repères et l'assistant APIs qui emballent immédiatement le résultat dans une en-teinte avant le transport.

|champ d' en-tête |Taille |Objectif |
| --- | ---: | --- |
|La magie .|4 octets |ASCII `NRT0`, utilisé pour rejeter prématurément les données non provenant de Norito. |
|Le major .|1 octet |Le format de la version principale. Les charges utiles actuelles utilisent `0`. |
|Je suis mineure .|1 octet |La valeur actuelle est `0x00`. Des drapeaux décrivent la disposition. |
|Le schéma hash |16 octets |L'identité de type utilisée par les décodeurs typés pour rejeter des charges utiles inattendues |
|Compression |1 octet |`0 = None`, `1 = Zstd`. Les valeurs inconnues sont rejetées. |
|Longueur de la charge utile |8 octets |La longueur de la charge utile non comprimée comme petit enjean `u64`. |
|CRC64 |8 octets |CRC64-XZ somme vérifiée de la charge utile non compressée. |
|Des drapeaux|1 octet |Les drapeaux de mise en page pour les longueurs compactes, les séquences emballées et les traits emballés. |

L'en-tête est de 40 octets. Les décodeurs valident la magie, la version, le masque de drapeau pris en charge, la longueur de la charge utile, la somme de contrôle et le hash du schéma avant de reconstruire la valeur tapée.

## Les drapeaux de mise en page {#layout-flags}

Norito les options de mise en page sont stockées dans le byte d'en-tête final. `COMPACT_LEN` (`0x02`Les préfixes explicites de longueur fixe restent lisibles lorsque l'appelant code avec `flags = 0x00`.

|Le drapeau|Hex |Le statut |L' effet |
| --- | ---: | --- | --- |
|`PACKED_SEQ` |`0x01` |Soutenue |Il encode des collections de taille variable avec une table d'offsets plus un bloc de données contigu. |
|`COMPACT_LEN` |`0x02` |Par défaut |Utilise des verrons non signés canoniques pour les préfixes de longueur par valeur. |
|`PACKED_STRUCT` |`0x04` |Soutenue |Les codes générés par les structs sont des charges utiles de champ emballées. |
|`VARINT_OFFSETS` |`0x08` |Réservé .|Rejeté dans v1; les compensations de séquences emballées sont à largeur fixe `u64`. |
|`COMPACT_SEQ_LEN` |`0x10` |Réservé .|Rejeté dans v1; les en-têtes de longueur de séquence du niveau supérieur sont à largeur fixe `u64`. |
|`FIELD_BITSET` |`0x20` |Soutenue par des exigences | Ajout d'un ensemble de bits pour les textes emballés afin que seuls les champs qui nécessitent des tailles explicites aient des préfixes de taille. `PACKED_STRUCT` et `COMPACT_LEN`. |

Les drapeaux sont explicites. Les décodeurs ne déduisent pas la mise en page à partir de la forme de la charge utile, de la version mineure ou des heuristes. Les combinaisons inconnues ou invalides sont rejetées de sorte que tous les pairs interprètent une charge utile de la même manière.

## Règles de codage {#encoding-rules}

Norito utilise des dispositions déterministiques pour les formes de données communes figurant dans le modèle de données Iroha:

- Les chaînes sont `[len][utf8-bytes]`; `len` suit `COMPACT_LEN` lorsqu'elle est activée.
- Lorsque `COMPACT_LEN` est réglé, une longueur par valeur utilise un vernis compact.
- Lorsque `COMPACT_LEN` n'est pas disponible, une longueur par valeur est un petit indice de 8 bytes `u64`.
- Les en-têtes de longueur de séquence sont fixes à 8 bytes avec un petit indice `u64` dans v1.
- `Vec<u8>` est codé comme `[len_u64][raw-bytes]` au lieu d'une longueur par octet.
- Les séquences emballées utilisent des compensations monotoniques `(len + 1)` `u64` suivies par les charges utiles d'éléments concatenés.
- Les cartes encodent le nombre d' entrées avec fixe `u64` et utilisez l'ordre de la clé déterministe. `HashMap` les entrées sont triées par clé avant le codage; `BTreeMap` utilise son ordre naturel.
- `BigInt` utilise des octets complémentaires de deux avec une longueur d'octet `u32` et un plafond de 512 bits.
- `Numeric` est codé comme `(mantissa, scale)`, où la mantissa stocke la valeur du nombre entier et l'échelle stocke le nombre de chiffres fractionnels.

Ces règles sont importantes pour les signatures et les hashes. Deux SDKs qui construisent la même transaction logique doivent produire les mêmes octets canoniques.

## Hashes de schéma {#schema-hashes}

Les charges utiles typées Norito contiennent un hash de schéma de 16 octets dans l'en-tête. Le hash par défaut est dérivé du nom de type entièrement qualifié. Les constructions qui permettent le hachage du schéma structural dérivent le hash du schéma canonique à la place.

Les décodeurs de type rejettent les désaccords du schéma. Cela protège les clients contre le décoding accidentel d'un cadre valide Norito en tant que type incorrect et est le mode d'échec habituel lorsqu'un bundle de fixation SDK dérive du modèle de données de nœud.

## La compression et l'accélération {#compression-and-acceleration}

Norito prend en charge la compression explicite et adaptative sans modifier la charge utile logique:

|Caractéristique |Objectif |
| --- | --- |
|`to_bytes` |Encodez une en-tête suivie d'une charge utile non compressée. |
|`to_compressed_bytes` |Encoder avec Zstd et enregistrer la balise de compression dans l'en-tête. |
|`to_bytes_auto` |Appliquez des heuristiques déterministes pour décider si la compression en vaut la peine. |
|CRC64 accélération |Utilise CRC64-XZ portable partout, avec CLMUL sur x86_64 ou PMULL sur aarch64, lorsqu'il est disponible. |
|GPU CRC64 et la compression |Les aides métalliques optionnelles ou CUDA peuvent accélérer les grandes charges utiles, puis revenir sur les voies CPU. |

L'accélération du matériel ne change jamais le contenu décodé. CRC et JSON les accélérateurs doivent correspondre à la sortie portable bit-for-bit. CPU et GPU les codeurs, mais la charge utile décodée et Norito Les métadonnées d'en-tête restent déterminantes pour la validation.

## JSON Appui {#json-support}

Norito comprend une pile native JSON pour les points d'extrémité et l'outillage qui nécessitent JSON sans quitter le système de type Norito.

|JSON fonctionnalité |Cas d' utilisation |
| --- | --- |
|`norito::json::{to_json, from_json}` |Déterministique de type JSON code/décode. |
|Belle et écrivaine de l' aide |CLI de sortie, de fixation et d'intégration en streaming `std::io`. |
|Les valeurs DOM |La manipulation programmatique par le modèle de valeur JSON de Norito. |
|Type rapide JSON |Décode/encode basé sur des bandes structurelles pour les chemins chauds DTO. |
|Lecteur de copie zéro |Scan de jeton qui emprunte des chaînes à l'entrée lorsque cela est possible. |
|Accélérateurs de phase 1 |L'indexation structurelle facultative AVX2, NEON, métallique ou CUDA avec rétrécissement scalaire. |

Iroha le code devrait préférer `norito::json` auxiliaires pour les types API Charges utiles. Ajout de plain `serde_json` les risques de divergence des schémas et du comportement de manipulation sur le terrain attendus par SDKs et Torii les extracteurs.

## Appui dérivé {#derive-support}

Rust Les types de données utilisent généralement des macro dérivées plutôt que du codec manuel. Norito codecs, schémas binaires et JSON Les aides.

Les attributs de champs communs sont:

|Attribut |L' effet |
| --- | --- |
|`#[norito(rename = "other")]` |Utilise un nom sérialisé stable pour la compatibilité du schéma et de JSON. |
|`#[norito(skip)]` |Le codeur omet le champ. Le décodeur fournit sa valeur `Default`. |
|`#[norito(default)]` |Utilise `Default` lorsqu'une charge utile décodée ne porte pas le champ. |
|`#[norito(skip_serializing_if = "...")]` |Élimine les champs de JSON lorsque le prédicat correspond, tout en préservant des défauts de décoding déterministique. |

Les dérivés exposent également des indices de longueur codées et des calculs de longueur exacte lorsque cela est possible. Les codeurs utilisent ces conseils pour réserver des tampons et éviter les copies supplémentaires.

## Familles à carreaux {#crate-feature-families}

Lorsque des liaisons Iroha ou SDK sont construites à partir de la source, les caractéristiques Norito sélectionnent les aides et accélérateurs disponibles:

|La famille des caractéristiques |Qu' est-ce que cela permet ?|
| --- | --- |
|`derive` |Les macros procéduraux réexportés pour les dérivés binaires, schéma et JSON. |
|`compression` |Zstd support pour les charges utiles en casque. |
|`packed-seq` |Layouts de collecte emballés à l'aide de tables d'offsets. |
|`packed-struct` |Des conceptions structurelles générées par des dérivés. |
|`compact-len` |Préfixes Varint par longueur de valeur. |
|`columnar` |Norito Blocs de colonne, codecs de rangées adaptatifs AoS/NCB et vues empruntées pour les chemins lourds à scanner; inclus dans l'ensemble par défaut de fonctionnalités `node-codec`. |
|`strict-safe` |Convertit les paniques décodées dans des voies faillibles en erreurs structurées. |
|`simd-accel` |CPU accélération, le cas échéant, avec déclin déterministe. |
|`json` |Parser natif JSON, rédacteur, DOM, dérivées typées et voies rapides. |
|`json-std-io` |Des assistants de lecteur et d'écrivain placés sur la pile JSON |
| `metal-stage1`, `cuda-stage1` |Les retombées de l'indice structurel GPU JSON sont facultatives |
|`metal-stage2` |Classification optionnelle des métadonnées métalliques pour le ruban de structure JSON. |
| `metal-crc64`, `cuda-crc64` |Auxiliaires optionnels GPU CRC64 pour les grandes charges utiles. |
|`gpu-compression` |Accélération optionnelle en métal ou CUDA Zstd pour les grandes charges utiles. |
|`stage1-validate` |Validation de débogage qui compare les indices structurels accélérés JSON avec la sortie scalaire. |

La disponibilité des fonctionnalités peut varier entre SDKs et les profils de sortie. Le format du fil reste régi par l'en-tête et le schéma, pas par les drapeaux de construction locaux.

## Torii et Norito RPC {#torii-and-norito-rpc}

Torii expose JSON pour de nombreuses routes d'opérateur, mais les routes binaires typées utilisent Norito. Le type de média pour les corps de courant typés Norito HTTP est `application/x-norito`.

Utiliser ces en-têtes lorsqu'un point final accepte ou retourne Norito:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Lorsqu'un point final prend en charge les deux représentations, les clients peuvent envoyer une liste de préférences explicite:

```http
Accept: application/x-norito, application/json
```

Les défaillances de décode sont affichées comme des erreurs de typage Torii et comptées par télémétrie. Les raisons courantes comprennent la magie invalide, la version non prise en charge, le drapeau de fonctionnalité non pris en charge, l'incohérence du checksum, un malformé UTF-8, une balise enum invalide et une incompatibilité du schéma.

Norito RPC Le transport est sélectionné par la configuration du transport. doit suivre la latence des requêtes, les défaillances, les connexions actives, les octets de réponse et `torii_norito_decode_failures_total` séparément de JSON La circulation.

## Norito Diffusion en continu {#norito-streaming}

Norito Le streaming étend la même approche déterministe aux médias et aux surfaces de transport en temps réel. Ses principaux éléments sont:

|Fonction de diffusion |Objectif |
| --- | --- |
|Manifestations |Déclarer les engagements du segment, les itinéraires de confidentialité, les capacités, le profil du codec, la suite de cryptage et les métadonnées clés du contenu. |
|En-têtes de segment |Le numéro de segment, la durée, le nombre de pièces, le timing, le mode entropie, le résumé audio et les racines Merkle. |
|Engagements par morceaux |Laissez les téléspectateurs et les relais vérifier la charge utile par rapport au manifeste avant de servir ou décoder. |
|Les cadres de contrôle |Envoyer des annonces manifestes, des commentaires, des mises à jour clés et des négociations sur les capacités |
|HPKE des mises à jour clés |Retournez les secrets de transport à l'aide de la suite négociée et des comptoirs qui augmentent monotonnellement. |
|Les négociations sur la capacité |Intersecte les bits de fonctionnalités pris en charge, les limites du datagramme, la cadence de rétroaction et les exigences de confidentialité. |
|FEC et les commentaires |Utilise des rapports de récepteurs déterministes et des décisions de parité pour les trajectoires en temps réel. |
|Vecteurs de conformité |Les appareils multilingues prouvent que SDKs décode les mêmes manifestes, segments et flux d'entropie. |

Les codecs et les profils d'entropie spécifiques à la diffusion en continu sont séparés du format de transaction / requête principal Norito, mais leurs manifestes et données de contrôle utilisent toujours Norito afin que le routage, la facturation, la reproduction et les preuves d'audit restent reproducibles.

## Conseils opérationnels {#operational-guidance}

- préférer les constructeurs SDK et les liaisons générées à des octets Norito fabriqués à la main.
- Traiter l'incohérence du schéma comme un problème de version ou de fixation, et non pas comme une défaillance transitoire du réseau.
- L'archive `.nrt`, `.norito`, et les artefacts manifestes dans le paquet de libération ou d'incident qui les a produits.
- Utilisation Norito en tant que source de vérité pour les données signées, hachées ou persistantes. JSON projections pour les tableaux de bord et l'inspection manuelle.
- Lors de l'ajout d'un nouveau point final Torii typé, documenter si celui-ci accepte JSON, Norito ou les deux, et exposer les types de contenu pris en charge dans `/openapi`.
- Avant d'activer un accélérateur, exécutez des tests de parité contre la sortie scalaire. Si un accélèreur échoue, utilisez le déclin scalaire déterministe.

## Pages connexes {#related-pages}

- [points d'extrémité Torii](/fr/reference/torii-endpoints.md)
- [Référencement de la Genèse](/fr/reference/genesis.md)
- [Schéma de modèle de données](/fr/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/fr/guide/tutorials/javascript.md)
- [Python SDK](/fr/guide/tutorials/python.md)
- [Swift et iOS SDK](/fr/guide/tutorials/swift.md)

## Références en amont {#upstream-references}

- [spécification du format Norito](https://github.com/hyperledger-iroha/iroha/blob/main/norito.md)
- [Norito boîte README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/norito/README.md)
