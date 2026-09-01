---
translation_locale: fr
translation_source: /reference/norito.md
translation_source_hash: b3b7c03bc0df3f7fa3df7e44b0ec8d755d615f9edca66bbcfe5613c33c8afbfe
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Norito {#norito}

Norito est la couche de sérialisation canonique de Iroha. C'est le format binaire utilisé lorsque les pairs du réseau, SDKs, les outils CLI, Torii, Kura, et les artefacts générés doivent être d'accord sur exactement la même charge utile.

Utilisez Norito lorsque les données font partie du consensus, de la signature, du hachage, de la persistance ou de l'interopérabilité cross-SDK. Utilisez JSON lorsqu'un point de terminaison API offre explicitement une projection lisible par l'homme pour les opérateurs, les tableaux de bord ou le débogage rapide.

## Où Norito apparaît {#where-norito-appears}

|Surface|Comment Norito est utilisé|
| --- | --- |
|Transactions et requêtes|Les transactions signées et les charges utiles de requête soumises via Torii sont encodées en tant que Norito.|
|genèse de la blockchain| `kagami genesis sign` produit un bloc `.nrt` signé que les pairs du réseau chargent au démarrage. |
| Torii réponses saisies | API les points de terminaison qui prennent en charge des réponses binaires typées utilisent `Accept: application/x-norito`. |
| SDKs |Les clients Rust, Python, JavaScript, Kotlin/Java, Swift et Android utilisent des constructeurs ou des liaisons Norito au lieu d'octets assemblés à la main.|
|Stockage Kura|Les charges de blocs, annexes de récupération, listes et marqueurs de validation sont stockés dans des trames Norito.|
|manifestes techniques| Nexus, disponibilité des données, SoraFS, streaming, et manifestes techniques orientés vers l'application utilisent Norito lorsque le manifeste technique doit être signé ou haché. |
| Diffusion en continu | Norito Streaming utilise des manifestes Norito, des en-têtes de segment, des trames de contrôle et des vecteurs de test de conformité. |

Norito n'est pas un langage de contrat intelligent. C'est le conteneur de données déterministe et le codec qui transporte les transactions, les appels de contrat, les manifestes techniques et les charges utiles typées API.

## Modèle de charge utile {#payload-model}

Chaque charge utile Norito sur le réseau ou sur disque est encadrée par un en-tête suivi des octets de charge utile encodés. Les charges utiles sans en-tête, ou nues, sont réservées au hachage interne, aux benchmarks et aux APIs d'assistance qui enveloppent immédiatement le résultat dans un en-tête avant le transport.

|Champ d'en-tête|Taille|But|
| --- | ---: | --- |
|Magie|4 octets| ASCII `NRT0`, utilisé pour rejeter tôt les données non-Norito. |
|majeure|1 octet|Format de la version majeure. Les charges utiles actuelles utilisent `0`.|
|mineure|1 octet|Décoder l'indice pour v1. La valeur actuelle est `0x00`. Les indicateurs décrivent la disposition.|
|Schéma de hachage cryptographique|16 octets|Identité de type utilisée par les décodeurs typés pour rejeter les charges utiles inattendues.|
|Compression|1 octet| `0 = None`, `1 = Zstd`. Les valeurs inconnues sont rejetées. |
|Longueur de la charge utile|8 octets|Longueur de la charge utile non compressée en format little-endian `u64`. |
| CRC64 |8 octets|CRC64-XZ somme de contrôle de la charge utile non compressée.|
|Drapeaux|1 octet|Drapeaux de disposition pour les longueurs compactes, les séquences emballées et les structures emballées.|

L'en-tête fait 40 octets. Les décodeurs valident le magic, la version, le masque de drapeaux supporté, la longueur de la charge utile, le checksum et le hachage cryptographique du schéma avant de reconstruire la valeur typée.

## Drapeaux de disposition {#layout-flags}

Norito stocke les choix de disposition dans le dernier octet de l'en-tête. Les assistants v1 par défaut émettent `COMPACT_LEN` (`0x02`) pour des préfixes de longueur compacts par valeur. Les préfixes de longueur à largeur fixe explicites restent lisibles lorsque les appelants encodent avec `flags = 0x00`.

|Drapeau|Hex|Statut|Effet|
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` |Pris en charge|Encode des collections de taille variable avec une table de décalage ainsi qu'un bloc de données contigu.|
| `COMPACT_LEN` | `0x02` |Par défaut|Utilise des varints non signés canoniques pour les préfixes de longueur par valeur.|
| `PACKED_STRUCT` | `0x04` |Pris en charge|Encode les structures générées par derive en tant que charges utiles de champ compactées.|
| `VARINT_OFFSETS` | `0x08` |Réservé|Rejeté dans v1 ; les offsets de séquences empaquetées ont une largeur fixe `u64`.|
| `COMPACT_SEQ_LEN` | `0x10` |Réservé|Rejeté dans v1 ; les en-têtes de longueur de séquence de niveau supérieur ont une largeur fixe `u64`.|
| `FIELD_BITSET` | `0x20` |Pris en charge avec des exigences|Ajoute un bitset pour les structures compactes afin que seules les champs nécessitant des tailles explicites portent des préfixes de taille. Nécessite `PACKED_STRUCT` et `COMPACT_LEN`.|

Les drapeaux sont explicites. Les décodeurs n'inférent pas la mise en page à partir de la forme de la charge utile, de la version mineure ou d'heuristiques. Les combinaisons inconnues ou invalides sont rejetées afin que tous les pairs du réseau interprètent une charge utile de la même manière.

## Règles de codage {#encoding-rules}

Norito utilise des dispositions déterministes pour les formes de données courantes qui apparaissent dans le modèle de données Iroha :

- Les chaînes sont `[len][utf8-bytes]` ; `len` suit `COMPACT_LEN` lorsqu'elles sont activées.
- Lorsque `COMPACT_LEN` est défini, une longueur par valeur utilise un varint compact.
- Lorsque `COMPACT_LEN` est absent, une longueur par valeur est un `u64` de 8 octets en little-endian.
- Les en-têtes de longueur de séquence sont des `u64` à 8 octets en little-endian fixes dans la v1.
- `Vec<u8>` est encodé comme `[len_u64][raw-bytes]` au lieu d'une longueur par octet.
- Les séquences emballées utilisent des offsets monotones `u64` `(len + 1)` suivis des charges utiles des éléments concaténées.
- Les cartes codent le nombre d'entrées avec `u64` fixe et utilisent un ordre de clé déterministe. Les entrées `HashMap` sont triées par clé avant le codage ; `BTreeMap` utilise son ordre naturel.
- `BigInt` utilise des octets en complément à deux en little-endian avec une longueur d'octet de `u32` et une limite de 512 bits.
- `Numeric` est encodé en tant que `(mantissa, scale)`, où la mantisse stocke la valeur entière et l'échelle stocke le nombre de chiffres fractionnaires.

Ces règles sont importantes pour les signatures et les hachages cryptographiques. Deux SDKs qui construisent la même transaction logique doivent produire les mêmes octets canoniques.

## Schéma de hachages cryptographiques {#schema-hashes}

Les charges utiles tapées Norito contiennent un hachage cryptographique de schéma de 16 octets dans l'en-tête. Le hachage cryptographique par défaut est dérivé du nom de type entièrement qualifié. Les versions qui activent le hachage de schéma structurel dérivent le hachage cryptographique à partir du schéma canonique à la place.

Les décodeurs typés rejettent les incompatibilités de schéma. Cela protège les clients contre le décodage accidentel d'une trame Norito valide comme étant de mauvais type et constitue le mode d'échec habituel lorsqu'un bundle d'artefacts de test SDK s'écarte du modèle de données du nœud.

## Compression et Accélération {#compression-and-acceleration}

Norito prend en charge la compression explicite et adaptative sans modifier la charge utile logique :

|Fonctionnalité|But|
| --- | --- |
| `to_bytes` |Encoder un en-tête suivi d'une charge utile non compressée.|
| `to_compressed_bytes` |Encodez avec Zstd et enregistrez l'étiquette de compression dans l'en-tête.|
| `to_bytes_auto` |Appliquez des heuristiques déterministes pour décider si la compression vaut la peine.|
|CRC64 accélération|Utilise CRC64-XZ portable partout, avec CLMUL sur x86_64 ou PMULL sur aarch64 lorsque disponible.|
|GPU CRC64 et compression|Les assistants métalliques facultatifs ou CUDA peuvent accélérer de grandes charges utiles, puis revenir aux chemins CPU.|

L'accélération matérielle ne modifie jamais le contenu décodé. Les accélérateurs CRC et JSON doivent correspondre sortie portable bit à bit. Les octets de trame Zstd peuvent différer entre les encodeurs CPU et GPU, mais la charge utile décodée et les métadonnées d'en-tête Norito restent déterministes pour la validation.

## Prise en charge de JSON {#json-support}

Norito inclut une pile native JSON pour les points de terminaison API et les outils qui nécessitent JSON sans quitter le système de types Norito.

|JSON fonctionnalité|Cas d'utilisation|
| --- | --- |
| `norito::json::{to_json, from_json}` |Encodage/décodage typé déterministe JSON.|
|Jolies et aides écrivains| CLI sortie, artefacts de test, et intégration `std::io` en streaming. |
|DOM valeurs|Manipulation programmatique via le modèle de valeur JSON de Norito.|
|Saisi rapidement JSON|Décodage/encodage basé sur des bandes structurelles pour les chemins chauds DTO.|
|Lecteur sans copie|Analyse de jetons qui emprunte des chaînes depuis l'entrée lorsque c'est possible.|
|Accélérateurs de stade 1|Indexation structurelle optionnelle AVX2, NEON, Metal, ou CUDA avec recours à un scalaire.|

Le code d’Iroha doit privilégier les assistants `norito::json` pour les charges utiles d’API typées. L’ajout direct de `serde_json` aux chemins de production risque de s’écarter du schéma et du traitement des champs attendus par les SDKs et les extracteurs de Torii.

## Dériver le support {#derive-support}

Les types de données Rust utilisent généralement des macros derive plutôt que du code de codec manuel. La couche derive peut générer des codecs binaires Norito, des schémas et des helpers JSON.

Les attributs courants des champs sont :

|Attribut|Effet|
| --- | --- |
| `#[norito(rename = "other")]` |Utilise un nom sérialisé stable pour le schéma et la compatibilité JSON.|
| `#[norito(skip)]` |L'encodeur omet le champ. Le décodeur fournit sa valeur `Default`.|
| `#[norito(default)]` |Utilise `Default` lorsqu’une charge utile décodée ne contient pas le champ.|
| `#[norito(skip_serializing_if = "...")]` |Omet les champs de JSON lorsque le prédicat correspond, tout en préservant les valeurs par défaut de décodage déterministes.|

Les dérivés exposent également des indices de longueur encodée et des calculs de longueur exacte lorsque cela est possible. Les encodeurs utilisent ces indices pour réserver des tampons et éviter des copies supplémentaires.

## familles de fonctionnalités du paquet logiciel {#crate-feature-families}

Lors de la compilation des liaisons Iroha ou SDK à partir du code source, les fonctionnalités Norito permettent de sélectionner quels assistants et accélérateurs sont disponibles :

|Famille de fonctionnalités|Ce que cela permet|
| --- | --- |
| `derive` |Macros procédurales réexportées pour les dérivés binaire, schéma et JSON.|
| `compression` |Support de Zstd pour les charges utiles encadrées par un en-tête.|
| `packed-seq` |Mises en page de collections compactes utilisant des tables de décalage.|
| `packed-struct` |Dispositions de structures générées par derive avec empaquetage.|
| `compact-len` |Préfixes de longueur par valeur de type Varint.|
| `columnar` |Norito Blocs de colonnes, codecs de lignes adaptatifs AoS/NCB, et vues empruntées pour des chemins à balayage intensif ; inclus dans l’ensemble de fonctionnalités par défaut `node-codec`.|
| `strict-safe` |Convertit les paniques de décodage dans les chemins faillibles en erreurs structurées.|
| `simd-accel` |CPU accélération lorsque disponible, avec repli déterministe.|
| `json` |Analyseur natif JSON, écrivain, DOM, dérivés typés et chemins rapides.|
| `json-std-io` |Aides pour lecteurs et écrivains superposées sur la pile JSON.|
| `metal-stage1`, `cuda-stage1` |Optionnel GPU JSON backends d'index structurel.|
| `metal-stage2` |Classification facultative des métadonnées Metal pour le ruban structurel JSON.|
| `metal-crc64`, `cuda-crc64` | Optionnel GPU CRC64 aides pour de grandes charges utiles. |
| `gpu-compression` |Accélération métallique facultative ou CUDA Zstd pour les charges utiles volumineuses.|
| `stage1-validate` |Validation de débogage qui compare les indices structurels accélérés JSON avec la sortie scalaire.|

La disponibilité des fonctionnalités peut différer entre SDKs et les profils de version. Le format de transmission reste régi par l'en-tête et le schéma, et non par les indicateurs de compilation locaux.

## Torii et Norito RPC {#torii-and-norito-rpc}

Torii expose JSON pour de nombreuses routes opérateur, mais les routes binaires typées utilisent Norito. Le type de média pour les corps Norito HTTP typés actuels est `application/x-norito`.

Utilisez ces en-têtes lorsqu'un point de terminaison API accepte ou renvoie des Norito typés :

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Lorsque un point de terminaison API prend en charge les deux représentations, les clients peuvent envoyer une liste de préférences explicite :

```http
Accept: application/x-norito, application/json
```

Les échecs de décodage apparaissent sous forme d'erreurs typées Torii et sont comptés par la télémétrie. Les raisons courantes incluent un magic invalide, une version non prise en charge, un indicateur de fonctionnalité non pris en charge, une incompatibilité de somme de contrôle, un UTF-8 mal formé, un tag d'énumération invalide et une incompatibilité de schéma.

Norito RPC le transport est sélectionné via la configuration du transport. Les tableaux de bord de l'opérateur doivent suivre la latence des requêtes, les échecs, les connexions actives, les octets de réponse, et `torii_norito_decode_failures_total` séparément du trafic JSON.

## Norito Diffusion en continu {#norito-streaming}

Norito Le streaming étend la même approche déterministe aux médias et aux surfaces de transport en temps réel. Ses éléments clés sont :

|Fonction de streaming|But|
| --- | --- |
|manifestes techniques|Déclarer les engagements de segments, les itinéraires de confidentialité, les capacités, le profil du codec, la suite de chiffrement et les métadonnées de clé de contenu.|
|En-têtes de segment|Lier le numéro de segment, la durée, le nombre de segments, le timing, le mode d'entropie, le résumé audio et les racines Merkle.|
|Engagements en morceaux|Laissez les spectateurs et les relais vérifier les fragments de charge utile par rapport au manifeste technique avant de les diffuser ou de les décoder.|
|Trames de contrôle|Transmettre des annonces de manifeste technique, des retours, des mises à jour clés et des négociations de capacités.|
| HPKE mises à jour des clés |Faites tourner les secrets de transport en utilisant la suite négociée et des compteurs augmentant de manière monotone.|
|Négociation des capacités|Interagit avec les bits de fonctionnalité pris en charge, les limites de datagramme, la cadence des retours d'information et les exigences de confidentialité.|
| FEC et retour d'information |Utilise des rapports de récepteur déterministes et des décisions de parité pour les chemins en temps réel avec pertes.|
|Vecteurs de conformité|Les artefacts de test inter-langues prouvent que SDKs décode les mêmes manifestes techniques, segments et flux d'entropie.|

Les codecs spécifiques au streaming et les profils d'entropie sont séparés du format de transaction/requête principal Norito, mais leurs manifestes techniques et leurs données de contrôle utilisent toujours Norito, afin que l'acheminement, la facturation, la relecture et les preuves d'audit restent reproductibles.

## Directives opérationnelles {#operational-guidance}

- Préférez les constructeurs SDK et les liaisons générées aux octets Norito faits à la main.
- Considérez la non-correspondance de schéma comme un problème de version ou d'artefact de test, et non comme une défaillance réseau passagère.
- Archiver `.nrt`, `.norito` et les artefacts de manifeste technique dans le paquet de version ou d'incident qui les a produits.
- Utilisez Norito comme source de vérité pour les données signées, hachées ou persistées. Utilisez les projections JSON pour les tableaux de bord et l'inspection manuelle.
- Lors de l'ajout d'un nouvel endpoint typé Torii API, documentez s'il accepte JSON, Norito, ou les deux, et exposez les types de contenu pris en charge dans `/openapi.json`.
- Avant d'activer un accélérateur, exécutez des tests de parité sur la sortie scalaire. Si un accélérateur échoue, utilisez la solution de repli scalaire déterministe. La sémantique de la charge utile doit rester inchangée.

## Pages liées {#related-pages}

- [Torii API points de terminaison](/fr/reference/torii-endpoints.md)
- [référence de genèse de la blockchain](/fr/reference/genesis.md)
- [Schéma du modèle de données](/fr/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/fr/guide/tutorials/javascript.md)
- [Python SDK](/fr/guide/tutorials/python.md)
- [Swift et iOS SDK](/fr/guide/tutorials/swift.md)

## Références en amont {#upstream-references}

- [Norito spécification de format](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/norito.md)
- [Norito crate README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/norito/README.md)
