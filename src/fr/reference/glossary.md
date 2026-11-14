---
translation_locale: fr
translation_source: /reference/glossary.md
translation_source_hash: 4d3a8e3aa88291edbaac5b52039d2aad160d89fb83c085c21030a531c93258f4
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# Glossaire <!-- omit in toc --> {#glossary}

Ici, vous pouvez trouver des définitions de toutes les entités liées à Iroha.

- [pair réseau](#peer)
- [Actif](#asset)
- [Tolérance aux fautes byzantines (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Composants](#iroha-components)
  - [Sumeragi (Empereur)](#sumeragi-emperor)
  - [Torii (Porte)](#torii-gate)
  - [Kura (Entrepôt)](#kura-warehouse)
  - [Kagami(Enseignant et Modèle et/ou miroir)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Arbre de Merkle (arbre de hachage cryptographique)](#merkle-tree-hash-tree)
  - [Contrats intelligents](#smart-contracts)
  - [Déclencheurs](#triggers)
  - [Gestion des versions](#versioning)
  - [Hijiri (système de réputation des pairs du réseau)](#hijiri-peer-reputation-system)
- [modules fonctionnels d’Iroha](#iroha-modules)
- [Iroha Opérations d'instruction (ISI)](#iroha-special-instructions-isi)
  - [Opérations d'instruction de l'utilitaire Iroha](#utility-iroha-special-instructions)
  - [Opérations d'instruction de base Iroha](#core-iroha-special-instructions)
  - [Opérations d'instruction spécifiques au domaine Iroha](#domain-specific-iroha-special-instructions)
  - [Personnalisé Iroha Instruction spéciale](#custom-iroha-special-instruction)
- [Iroha Requête](#iroha-query)
- [Changer de vue](#view-change)
- [Vue de l'état mondial (WSV)](#world-state-view-wsv)
- [Leader](#leader)

## Registres de blockchain {#blockchain-ledgers}

Les registres blockchain sont des systèmes de tenue de registres numériques qui utilisent la technologie blockchain pour conserver les dossiers financiers. Ils tirent leur nom des livres anciens utilisés pour les registres financiers tels que les prix, les actualités et les informations sur les transactions.

Pendant le Moyen Âge, les registres de la blockchain étaient ouverts à la consultation publique et à la vérification de leur exactitude. Cette idée se reflète dans les systèmes basés sur la blockchain qui peuvent vérifier la validité des données stockées.

## pair réseau {#peer}

Un pair est un processus de nœud Iroha qui accepte les connexions d’autres pairs et d’applications clientes. Une machine peut héberger plusieurs pairs, chacun ayant sa propre configuration et son propre stockage. Chaque pair qui démarre le consensus à partir d’un état vide authentifie et applique la genèse signée du réseau ; les pairs restaurés à partir d’instantanés authentifiés reprennent à partir de cet état.

D'autres blockchains peuvent se référer au même concept en tant que nœud ou validateur.

Un pair réseau peut être un processus sur son système hôte. Il peut également être contenu dans un conteneur Docker et un pod Kubernetes.

## Actif {#asset}

Dans le contexte des blockchains, un actif est la représentation d'un objet de valeur sur la blockchain.

Des informations supplémentaires sur les actifs sont disponibles [ici](/fr/blockchain/assets.md).

### Actifs fongibles {#fungible-assets}

De tels actifs peuvent être facilement échangés contre d'autres actifs du même type parce qu'ils sont interchangeables.

À titre d'exemple, toutes les unités de la même monnaie sont égales dans leur valeur et peuvent être utilisées pour acheter des biens. En général, les actifs fongibles sont identiques en apparence, à l'exception de l'usure des billets et des pièces de monnaie.

### Actifs non fongibles {#non-fungible-assets}

Les actifs non fongibles sont uniques et précieux en raison de leurs caractéristiques spécifiques et de leur rareté ; leur valeur ne peut pas être comparée à celle d'autres actifs.

- La valeur d'une peinture peut varier en fonction de l'artiste, de la période à laquelle elle a été peinte et de l'intérêt que le public lui porte.
- Deux maisons dans la même rue peuvent avoir des niveaux d'entretien différents.
- Les fabricants de bijoux proposent généralement une gamme de différents modèles.

### Actifs pouvant être créés {#mintable-assets}

Un actif est frappable si davantage du même type peut être émis.

### Actifs non frappables {#non-mintable-assets}

Si le montant initial d'un actif est spécifié une fois et ne change pas, il est considéré comme non-mintable.

Le [bloc genesis de la blockchain](/fr/guide/configure/genesis.md) définit ces informations pour la configuration Iroha.

## Tolérance aux fautes byzantines (BFT) {#byzantine-fault-tolerance-bft}

Propriété qui permet de fonctionner correctement dans un réseau comportant une certaine proportion d’acteurs malveillants. Un comité Sumeragi compte exactement `3f + 1` validateurs et tolère jusqu’à `f` validateurs byzantins, soit moins d’un tiers du comité.

## Iroha Composants {#iroha-components}

Rust modules contenant la fonctionnalité Iroha.

### Sumeragi (Empereur) {#sumeragi-emperor}

Le module Iroha responsable du consensus.

### Torii (Porte) {#torii-gate}

Module contenant la logique de traitement des requêtes entrantes du [pair](#peer). Il reçoit, accepte et achemine les instructions entrantes et les requêtes HTTP, et permet à l’opérateur d’inspecter la configuration.

### Kura (Entrepôt) {#kura-warehouse}

Stockage persistant des blocs. Kura conserve sur disque les blocs signés, les hachages de blocs, les index de hauteur, les fichiers annexes de récupération et les métadonnées de la liste de validation. La [vue de l’état mondial](#world-state-view-wsv) est reconstruite à partir des blocs Kura lorsqu’aucun instantané de l’état n’est disponible ou que celui-ci est en retard sur le stockage local des blocs. Voir [Stockage Kura](/fr/blockchain/world.md#kura-storage).

### Kagami(Enseignant et Modèle et/ou miroir) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Générateur de données couramment utilisées. Il peut générer des paires de clés cryptographiques, des blocs genesis de blockchain, de la documentation, etc.

### Arbre de Merkle (arbre de hachage cryptographique) {#merkle-tree-hash-tree}

Une structure de données utilisée pour valider et vérifier l'état à chaque hauteur de bloc. L'implémentation actuelle de Iroha est un arbre binaire. Voir [Wikipédia](https://en.wikipedia.org/wiki/Merkle_tree) pour plus de détails.

### Contrats intelligents {#smart-contracts}

Les contrats intelligents sont des programmes basés sur la blockchain qui s'exécutent lorsqu'un ensemble spécifique de conditions est rempli. Dans Iroha 3, les contrats intelligents sont écrits en Kotodama et compilés en bytecode IVM (`.to`) ; un contrat modifie l'état en émettant des [instructions spéciales d'Iroha](#core-iroha-special-instructions) par des appels hôtes.

### Déclencheurs {#triggers}

Un type d'événement qui permet d'invoquer une instruction spéciale Iroha lors du commit d'un bloc spécifique, à un moment donné (avec certaines réserves), etc. Plus d'informations sur les déclencheurs [ici](/fr/blockchain/triggers.md).

### Gestion des versions {#versioning}

La première version d’Iroha 3 prend en charge une seule version canonique du format de transmission des blocs. Le point d’accès `/v1/api/version` renvoie `SignedBlock::WIRE_VERSION` après l’application de la genèse et une réponse d’indisponibilité avant celle-ci. Il indique le format de transmission pris en charge ; il ne négocie pas la compatibilité entre des dispositions de protocole différentes et n’autorise pas une mise à niveau du réseau.

### Hijiri (système de réputation des pairs du réseau) {#hijiri-peer-reputation-system}

Le système de réputation des pairs et des comptes d'Iroha. Ses paramètres détenus par le consensus contiennent la politique de frais Hijiri et les enregistrements de risque des comptes, et des registres d'observateurs gouvernés émettent des attestations de compte qui ajustent le score de risque d'un compte.

## Modules fonctionnels d’Iroha {#iroha-modules}

Extensions tierces pour Iroha qui fournissent des fonctionnalités personnalisées.

## Iroha Opérations d'instruction (ISI) {#iroha-special-instructions-isi}

Une bibliothèque de contrats intelligents fournie avec Iroha. Ceux-ci peuvent être invoqués soit via des transactions, soit via des écouteurs d'événements enregistrés. Plus d'informations sur ISI [ici](/fr/blockchain/instructions.md).

#### Opérations d'instruction de l'utilitaire Iroha {#utility-iroha-special-instructions}

Cet ensemble de [isi](#iroha-special-instructions-isi) contient des instructions qui ne modifient pas une entité propre à un domaine, telles que `Log`, `ExecuteTrigger`, `SetParameter` et `Upgrade`. Iroha 3 n'a pas d'instructions `If`, `Notify` ou `Sequence`.

### Opérations d'instruction de base Iroha {#core-iroha-special-instructions}

[Instructions spéciales](#iroha-special-instructions-isi) fourni avec chaque déploiement Iroha. Ceux-ci incluent certains [spécifique au domaine](#domain-specific-iroha-special-instructions) ainsi que [instructions d'utilisation](#utility-iroha-special-instructions).

### Opérations d'instruction spécifiques au domaine Iroha {#domain-specific-iroha-special-instructions}

Instructions liées aux activités spécifiques au domaine : actifs, comptes, domaines, gestion des pairs du réseau). Celles-ci fournissent les outils nécessaires pour apporter des modifications au [Vue de l'État mondial](#world-state-view-wsv) de manière sûre et sécurisée.

### Personnalisé Iroha Instruction spéciale {#custom-iroha-special-instruction}

Instructions fournies dans [modules fonctionnels d’Iroha](#iroha-modules), par des clients ou des tiers. Celles-ci ne peuvent être créées qu'en utilisant [les Instructions de Base](#core-iroha-special-instructions). Il n'est pas recommandé de forker et de modifier le code source de Iroha, les opérations d'instruction non convenues par [pairs du réseau](#peer) lors d'un déploiement Iroha seront considérées comme des fautes, ainsi [pairs du réseau](#peer) exécutant une instance modifiée verra son accès révoqué.

## Iroha Requête {#iroha-query}

Une demande de lecture de la vue de l'État mondial sans modifier ladite vue. Plus d'informations sur les requêtes [ici](/fr/blockchain/queries.md).

## Changer de vue {#view-change}

Un processus qui a lieu en cas de tentative échouée de consensus. Cela implique généralement l'élection d'un nouveau [Leader](#leader).

## Vue de l'état mondial (WSV) {#world-state-view-wsv}

Représentation en mémoire de l'état actuel de la blockchain. Le WSV contient le `World`, les hachages cryptographiques des blocs validés, les index de transactions, topologie de consensus et index dérivés utilisés par les requêtes. Il n'est mis à jour que par des blocs validés et peut être reconstruit à partir de [Kura](#kura-warehouse). Voir [Vue de l'État du Monde](/fr/blockchain/world.md#world-state-view-wsv).

## Leader {#leader}

Pour chaque hauteur et chaque vue, Sumeragi détermine le proposant de façon déterministe à partir du comité, de la graine authentifiée de sélection du leader et de l’historique validé des leaders ignorés. Un [changement de vue](#view-change) passe au prochain membre admissible du comité selon les mêmes règles de [tolérance aux fautes byzantines](#byzantine-fault-tolerance-bft).
