---
translation_locale: fr
translation_source: /reference/norito.md
translation_source_hash: ff258251887109f6cb28241235caea8e1b6a69df10df60cb7b2e7c2507004b4e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Norito {#norito}

Norito est Iroha C'est la couche de sérialisation canonique.
quand les pairs, SDKs, CLI outils, Torii, Kura, et les artefacts générés doivent être d'accord
sur la même charge utile.

Utilisation Norito lorsque les données font partie du consensus, de la signature, du hachage, de la persistance;
ou croisés SDK l'interopérabilité. JSON lorsqu'un point final offre explicitement une
projection lisible par l'homme pour les opérateurs, les tableaux de bord ou le débogage rapide.

## Où ? Norito Il apparaît {#where-norito-appears}

| Surfaces | Comment ? Norito est utilisé |
| --- | --- |
| Transactions et requêtes | Charges utiles de transaction et de requête signées transmises par Torii sont codés comme Norito. |
| Genèse | `kagami genesis sign` produit une signature `.nrt` blocage que les pairs chargent au démarrage. |
| Torii Réponses typées | Endpoints qui prennent en charge l'utilisation de réponses binaires typées `Accept: application/x-norito`. |
| SDKs | Rust, Python, JavaScript, Kotlin- Je vous en prie. Swift, et Android les clients utilisent Norito constructeurs ou liaisons au lieu de bytes assemblés à la main. |
| Kura stockage | Les charges utiles à bloc, les voitures de récupération, les listes et les marqueurs d'engagement sont stockés comme Norito- des données encadrées. |
| Manifestes | Nexus, la disponibilité des données, SoraFS, l'utilisation de flux et de manifestes face à l'application Norito lorsque le manifeste doit être signé ou haché. |
| En streaming | Norito Utilisation de la diffusion en continu Norito des manifestes, des en-têtes de segment, des cadres de commande et des appareils de conformité. |

Norito Il s'agit d'un langage déterministe et
codec qui contient des transactions, des appels contractuels, des manifestes et des types API
les charges utiles.

## Modèle de charge utile {#payload-model}

Chaque câble ou disque Norito la charge utile est encadrée par un en-tête suivi de la
Les charges utiles sans en-tête ou nues sont réservées aux
le hachage, les points de référence et l'aide APIs qui enveloppe immédiatement le résultat dans un
en-tête avant transport.

| champ de titre | Taille | Le but |
| --- | ---: | --- |
| La magie | 4 octets | ASCII `NRT0`, utilisé pour rejeter les Norito les données précoces. |
| Le major . | 1 octet | Formatation de la version principale. `0`. |
| Minors | 1 octet | Indice de décode fixe v1. `0x00`; Les options de mise en page sont en direct dans les drapeaux. |
| Hash de schéma | 16 octets | Identification de type utilisée par les décodeurs typés pour rejeter des charges utiles inattendues. |
| Compression | 1 octet | `0 = None`, `1 = Zstd`. Les valeurs inconnues sont rejetées. |
| Longueur de la charge utile | 8 octets | Longueur non comprimée de la charge utile comme petit enjeu `u64`. |
| CRC64 | 8 octets | CRC64-XZ la somme vérifiée de la charge utile non comprimée. |
| Les drapeaux | 1 octet | Les drapeaux de mise en page pour les longueurs compactes, les séquences emballées et les traits emballés. |

L'en-tête est de 40 octets. Les décodeurs valident la magie, version, drapeau pris en charge
masque, la longueur de la charge utile, la somme de contrôle et le hash du schéma avant de reconstituer le
valeur typée.

## Drapeaux de mise en page {#layout-flags}

Norito stocke les options de mise en page dans le dernier octet d'en-tête.
émetteur `COMPACT_LEN` (`0x02`) pour les préfixes compacts de longueur par valeur.
Les préfixes de longueur fixe restent lisibles lorsque les appelants codent avec
`flags = 0x00`.

| Drapeau | Hex | Le statut | Effets |
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` | Soutenue | Encode les collections de taille variable avec une table d'offsets plus un bloc de données contigu. |
| `COMPACT_LEN` | `0x02` | Par défaut | Utilise des varins non signés canoniques pour les préfixes de longueur par valeur. |
| `PACKED_STRUCT` | `0x04` | Soutenue | Les codes générés par les structs dérivés sont des charges utiles de terrain emballées. |
| `VARINT_OFFSETS` | `0x08` | Réservé | Réjection dans v1; les compensations de séquences emballées sont à largeur fixe `u64`. |
| `COMPACT_SEQ_LEN` | `0x10` | Réservé | Rejeté dans v1; les en-têtes de longueur de séquence de niveau supérieur sont à largeur fixe `u64`. |
| `FIELD_BITSET` | `0x20` | Soutenue par les exigences | Ajout d'un ensemble de bits pour les structs emballés afin que seuls les champs qui nécessitent des tailles explicites portent des préfixes de taille. `PACKED_STRUCT` et `COMPACT_LEN`. |

Les drapeaux sont explicites.
Les combinaisons inconnues ou non valides sont rejetées de manière à ce que
que tous les pairs interprètent une charge utile de la même manière.

## Règles de codage {#encoding-rules}

Norito utilise des dispositions déterministes pour les formes de données communes qui apparaissent dans
le Iroha modèle de données:

- Les cordes sont `[len][utf8-bytes]`; `len` suivant: `COMPACT_LEN` lorsque cela est possible.
- Les longueurs par valeur utilisent des varines compactes lorsque `COMPACT_LEN` est réglé, sinon
  un petit enjeu fixe de 8 octets `u64`.
- Les en-têtes de longueur de séquence sont fixes à 8 octets `u64` dans v1.
- `Vec<u8>` est codé comme `[len_u64][raw-bytes]` au lieu d'une longueur par octet.
- Utilisation des séquences emballées `(len + 1)` monotone `u64` les compensations suivie des
  charges utiles d'éléments concatenés.
- Les cartes encodent le nombre d' entrées avec fixe `u64` et utilisez l'ordre déterministe des clés.
  `HashMap` les entrées sont triées par clé avant de codage; `BTreeMap` utilise ses
  ordre naturel.
- `BigInt` utilise des octets de complément de deux avec un `u32` longueur en octets
  et une plaque à 512 bits.
- `Numeric` est codé comme `(mantissa, scale)`, où la mantissa stocke le
  la valeur entière et l'échelle stockent le nombre de chiffres fractionnés.

Ces règles comptent pour les signatures et les hashes. SDKs qui construisent la même
une transaction logique doit produire les mêmes octets canoniques.

## Les haches de schéma {#schema-hashes}

Typé Norito les charges utiles portent un hash de schéma de 16 octets dans l'en-tête.
le hash est dérivé du nom de type entièrement qualifié.
hashing du schéma structural dérivent le hash du schéma canonique à la place.

Les décodeurs de type rejettent les désaccords de schéma.
décoding d'une valeur valide Norito cadre comme le mauvais type et est le mode de défaillance habituel
lorsqu'une SDK le paquet de fixation dérive du modèle de données des nœuds.

## Compression et accélération {#compression-and-acceleration}

Norito prend en charge la compression explicite et adaptative sans modifier le logique
charge utile:

| Caractéristiques | Le but |
| --- | --- |
| `to_bytes` | Encodez une charge utile non compressée avec en-tête. |
| `to_compressed_bytes` | Encoder avec Zstd et enregistrer la balise de compression dans l'en-tête. |
| `to_bytes_auto` | Appliquez des heuristiques déterministes pour décider si la compression en vaut la peine. |
| CRC64 accélération | Utilisation portable CRC64-XZ partout, avec CLMUL sur x86_64 ou PMULL sur aarch64 lorsque cela est disponible. |
| GPU CRC64 et de compression | Le métal ou CUDA les aides peuvent accélérer de grandes charges utiles, puis tomber à nouveau CPU les chemins. |

L'accélération du matériel ne change jamais le contenu décodé. CRC et JSON
les accélérateurs doivent correspondre aux bits de sortie portables.
diffèrent entre les CPU et GPU les encoders, mais la charge utile décodée et Norito en-tête
Les métadonnées restent déterminantes pour la validation.

## JSON Le soutien {#json-support}

Norito inclut un natif JSON la pile pour les points d'extrémité et les outils nécessaires JSON
sans quitter le Norito système de type.

| JSON caractéristique | Cas d'utilisation |
| --- | --- |
| `norito::json::{to_json, from_json}` | Type déterministe JSON le code/décodage. |
| Les jolies et les écrivaines | CLI sortie, fixation et diffusion `std::io` l'intégration. |
| DOM les valeurs | La manipulation programmée par Norito Je suis là . JSON modèle de valeur. |
| Tapeur rapide JSON | Décode/encode de chauffage basé sur des bandes structurelles DTO les chemins. |
| Lecteur de copie zéro | Scan de jeton qui emprunte des chaînes de l'entrée lorsque cela est possible. |
| Accélérateurs de phase 1 | Facultatif AVX2, NEON, de métal, ou CUDA l'indexation structurelle avec rétrécissement scalaire. |

Iroha le code devrait préférer `norito::json` les aides à la typographie API les charges utiles.
à l'état normal `serde_json` les risques de déviation du schéma pour les voies de production et
comportement de manipulation sur le terrain attendu par SDKs et Torii les extracteurs.

## Appui dérivé {#derive-support}

Rust Les types de données utilisent généralement des macros dérivés plutôt que du codec manuel.
La couche dérivée peut générer Norito codecs binaires, schémas et JSON Les aides.

Les attributs de champs communs sont:

| Attribut | Effets |
| --- | --- |
| `#[norito(rename = "other")]` | Utilise un nom sérialisé stable pour le schéma et JSON la compatibilité. |
| `#[norito(skip)]` | Il élimine le champ et le remplit de `Default` tout en décodant. |
| `#[norito(default)]` | Utilisation `Default` lorsqu'une charge utile décodée ne transporte pas le champ. |
| `#[norito(skip_serializing_if = "...")]` | Omit les champs de JSON lorsque le prédicat correspond, tout en préservant les défauts de décoding déterministique. |

Les dérivés exposent également des indices de longueur codée et des calculs de longueur exacte lorsque
Les codeurs utilisent ces indices pour réserver des tampons et éviter les copies supplémentaires.

## Familles de récipients {#crate-feature-families}

Lors de la construction Iroha ou SDK des liaisons à partir de la source, Norito caractéristiques sélectionner qui
les aides et accélérateurs sont disponibles:

| Famille de caractéristiques | Ce qu'il permet |
| --- | --- |
| `derive` | Macros procéduraux réexportés pour les systèmes binaires, schéma et JSON dérivé. |
| `compression` | Zstd support pour les charges utiles en cascade d'en-tête |
| `packed-seq` | Des tableaux de collecte emballés à l'aide de tables d'offsets. |
| `packed-struct` | Des structures générées par des dérivés. |
| `compact-len` | Préfixes de longueur par valeur de Varint. |
| `columnar` | Norito Blocs de colonne, adaptatifs AoS/NCB codecs de rangée et vues empruntées pour les chemins lourds à scanner; inclus dans la norme par défaut `node-codec` ensemble de fonctionnalités. |
| `strict-safe` | Convertit les paniques décodées dans des voies faillibles en erreurs structurées. |
| `simd-accel` | CPU l'accélération, le cas échéant, avec une rétroaction déterministe. |
| `json` | Native JSON parseur, écrivain, DOM, des dérivés de type, et des chemins rapides. |
| `json-std-io` | Les aides au lecteur et à l'écrivain couchées sur JSON - Je vous en supplie. |
| `metal-stage1`, `cuda-stage1` | Facultatif GPU JSON les retombées de l'indice structurel. |
| `metal-stage2` | Classification optionnelle des métadonnées métalliques pour les JSON une bande structurelle. |
| `metal-crc64`, `cuda-crc64` | Facultatif GPU CRC64 les aides pour de grandes charges utiles. |
| `gpu-compression` | Le métal ou CUDA Zstd accélération pour les grandes charges utiles. |
| `stage1-validate` | Validation de débogage qui compare accéléré JSON indices structurels par rapport à la production scalaire. |

La disponibilité des fonctionnalités peut varier entre SDKs et de libérer les profils.
Le format reste régi par l'en-tête et le schéma, pas par les drapeaux de construction locaux.

## Torii et Norito RPC {#torii-and-norito-rpc}

Torii exposés JSON pour de nombreuses routes d'opérateur, mais les routes binaires typées utilisent
Norito. Le type de média pour le courant typé Norito HTTP les corps sont
`application/x-norito`.

Utilisez ces en-têtes lorsqu'un point final accepte ou retourne Norito:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Lorsqu'un point final prend en charge les deux représentations, les clients peuvent envoyer une explicite
liste des préférences:

```http
Accept: application/x-norito, application/json
```

Les défaillances de décode sont affichées comme typiées Torii les erreurs et le calcul par télémétrie.
Les raisons courantes comprennent la magie non valide, version non prise en charge, fonctionnalité non prise en compte
drapeau, coefficient de contrôle défectueux, malformé UTF-8, étiquette enum invalide et désaccord de schéma.

Norito RPC le transport est sélectionné par configuration de transport.
Les tableaux de bord doivent suivre la latence des demandes, les défaillances, les connexions actives,
octets de réponse, et `torii_norito_decode_failures_total` séparément de JSON
Le trafic.

## Norito En streaming {#norito-streaming}

Norito Le streaming étend la même approche déterministe aux médias et en temps réel
les surfaces de transport.

| Fonction de diffusion en continu | Le but |
| --- | --- |
| Manifestes | Déclarer les engagements des segments, les itinéraires de confidentialité, les capacités, le profil du codec, la suite de cryptage et les métadonnées clés du contenu. |
| Titres de segment | Bind le numéro du segment, la durée, le nombre de pièces, le timing, le mode entropie, le résumé audio et les racines Merkle. |
| Engagements par morceaux | Laissez les téléspectateurs et les relais vérifier les morceaux de charge utile contre le manifeste avant de servir ou décoder. |
| Cadres de contrôle | Portez des annonces manifestes, des commentaires, des mises à jour clés et des négociations sur les capacités. |
| HPKE mises à jour clés | Faites tourner les secrets de transport en utilisant la suite négociée et des comptoirs qui augmentent monotonnellement. |
| Négociation sur la capacité | Intersecte les bits de fonctionnalités pris en charge, les limites des datagrammes, la cadence de rétroaction et les exigences en matière de confidentialité. |
| FEC et les commentaires | Utilise les rapports déterministes des récepteurs et les décisions de parité pour les trajectoires en temps réel de perte. |
| Vecteurs de conformité | Les appareils multilingues prouvent SDKs décodez les mêmes manifestes, segments et courants d'entropie. |

Les codecs et profils d'entropie spécifiques au flux sont séparés du noyau
Norito format de transaction/demand, mais leurs manifestes et données de contrôle utilisent toujours
Norito pour que le routage, la facturation, la reproduction et les preuves d'audit restent reproducibles.

## Conseils d'exploitation {#operational-guidance}

- Je préfère SDK les constructeurs et les liaisons générées par rapport à celles fabriquées manuellement Norito Les octets.
- Traiter l'incohérence du schéma comme un problème de version ou d'installation, et non pas comme une transition
  défaillance du réseau.
- Restez `.nrt`, `.norito`, et des artefacts manifestes avec la libération ou l'incident
  Le groupe qui les a produits.
- Utilisation JSON les projections pour les tableaux de bord et l'inspection manuelle, Norito comme
  la source de vérité pour les données signées, hachées ou persistantes.
- Lors de l'ajout d'un nouveau type Torii point final, documentant si elle accepte ou non JSON,
  Norito, ou les deux, et exposer les types de contenu pris en charge dans `/openapi`.
- Lors de l'activation des accélérateurs, effectuer des tests de parité contre la sortie scalaire avant
  Les défaillances de l'accélérateur devraient être réduites au lieu de changer.
  la sémantique de charge utile.

## Pages connexes {#related-pages}

- [Torii points de fin](/fr/reference/torii-endpoints.md)
- [Références de la Genèse](/fr/reference/genesis.md)
- [Schéma de modèle de données](/fr/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/fr/guide/tutorials/javascript.md)
- [Python SDK](/fr/guide/tutorials/python.md)
- [Swift et iOS SDK](/fr/guide/tutorials/swift.md)

## Références en amont {#upstream-references}

- [Norito spécification de format](https://github.com/hyperledger-iroha/iroha/blob/main/norito.md)
- [Norito boîte README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/norito/README.md)
