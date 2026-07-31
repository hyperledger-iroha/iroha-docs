---
translation_locale: fr
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Glossaire <!-- omit in toc --> {#glossary}

Vous trouverez ici les définitions de tous Iroha- les entités liées.

- [Peer](#peer)
- [Les actifs](#asset)
- [Tolérance aux défauts byzantine (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Components](#iroha-components)
  - [Sumeragi - Je vous en prie !](#sumeragi-emperor)
  - [Torii - Je vous en prie .](#torii-gate)
  - [Kura - Je vous en prie .](#kura-warehouse)
  - [Kagami(enseignant et exemplaire et/ou miroir)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Arbre de mercule (arbre de hasch)](#merkle-tree-hash-tree)
  - [Contrats intelligents](#smart-contracts)
  - [Les déclencheurs](#triggers)
  - [Rédaction](#versioning)
  - [Hijiri (système de réputation par les pairs)](#hijiri-peer-reputation-system)
- [Iroha Les modules](#iroha-modules)
- [Iroha Instructions spéciales (ISI)](#iroha-special-instructions-isi)
  - [Utilisation Iroha Instructions spéciales](#utility-iroha-special-instructions)
  - [Le noyau Iroha Instructions spéciales](#core-iroha-special-instructions)
  - [Domaine spécifique Iroha Instructions spéciales](#domain-specific-iroha-special-instructions)
  - [Les produits à usage ordinaire Iroha Instruction spéciale](#custom-iroha-special-instruction)
- [Iroha Résumé](#iroha-query)
- [Vue de changement](#view-change)
- [La vision de l'état mondial (WSV)](#world-state-view-wsv)
- [Le chef de file](#leader)

## Les comptes de la blockchain {#blockchain-ledgers}

Les registres de blockchain sont des systèmes numériques qui utilisent la blockchain.
Les données financières sont nommées d'après les méthodes traditionnelles
livres qui ont été utilisés pour des documents financiers tels que les prix, les nouvelles et
les informations relatives aux transactions.

Pendant le Moyen Âge, les livres étaient ouverts au public.
Cette idée se reflète dans la blockchain
les systèmes pouvant vérifier la validité des données stockées.

## Peer {#peer}

Un paire dans Iroha signifie un Iroha l'instance de traitement à laquelle d'autres Iroha processus
et les applications client peuvent se connecter.
Une seule machine peut accueillir plusieurs Iroha Des pairs.
Les pairs sont égaux quant à leurs ressources et capacités,
avec une exception importante: un seul des pairs
le bloc de génèse à l'étape de démarrage du Iroha le réseau.

D'autres chaînes de blocs peuvent se référer au même concept qu'un nœud ou un validateur.

Un paire peut être un processus sur son système hôte.
Elle peut également être contenue dans un Docker un conteneur et une capsule Kubernetes.

## Les actifs {#asset}

Dans le contexte des chaînes de blocs, un actif est la représentation d'une valeur
l'objet sur la blockchain.

Des informations supplémentaires sur les actifs sont disponibles
[Je suis là.](/fr/blockchain/assets.md).

### Les actifs fonciers {#fungible-assets}

Ces actifs peuvent être facilement échangés contre d'autres actifs du même type parce que
Ils sont interchangeables.

Par exemple, toutes les unités de la même monnaie sont égales en valeur et
Les actifs fonciers sont généralement identiques dans les pays tiers.
l'apparence, à l'exception de l'usure des billets et pièces.

### Actifs non volatils {#non-fungible-assets}

Les actifs non fongibles sont uniques et précieux en raison de leur spécificité
les caractéristiques et la rareté; leur valeur ne peut être comparée à d'autres actifs.

- La valeur d'une peinture peut varier en fonction de l'artiste, du temps qu'elle a été
  et l'intérêt du public pour elle.
- Deux maisons sur la même rue peuvent avoir des niveaux d'entretien différents.
- Les fabricants de bijoux proposent généralement une gamme de modèles différents.

### Actifs à conserver {#mintable-assets}

Un actif peut être émis si plusieurs actifs du même type peuvent être émis.

### Les actifs non exploitables {#non-mintable-assets}

Si le montant initial d'un actif est spécifié une fois et ne change pas, il
est considéré comme non évitable.

Les [Bloc de la Genèse](/fr/guide/configure/genesis.md) définit ces informations pour
le Iroha la configuration.

## Tolérance aux défauts byzantine (BFT) {#byzantine-fault-tolerance-bft}

La propriété de pouvoir fonctionner correctement avec un réseau contenant une
un certain pourcentage d'acteurs malveillants. Iroha est capable de fonctionner
avec jusqu'à 33% d'acteurs malveillants dans son réseau peer-to-peer.

## Iroha Components {#iroha-components}

Rust modules contenant Iroha fonctionnalité.

### Sumeragi - Je vous en prie ! {#sumeragi-emperor}

Les Iroha module responsable du consensus.

### Torii - Je vous en prie . {#torii-gate}

Module avec la logique de traitement des demandes entrées pour le [de même](#peer). Il est utilisé pour
recevoir, accepter et diriger les instructions entrées; HTTP des questions, ainsi que
comme mises à jour de configuration en temps d'exécution.

### Kura - Je vous en prie . {#kura-warehouse}

Un bloc de stockage permanent. Kura boutiques signées blocs, bloc hashes, hauteur
les indices, les couloirs de récupération et les métadonnées sur le disque.
[Le point de vue sur l'état du monde](#world-state-view-wsv) est reconstruit à partir de Kura les blocs lorsqu'une
l'imagerie d'état n'est pas disponible ou derrière le magasin de bloc local.
[Kura stockage](/fr/blockchain/world.md#kura-storage).

### Kagami(enseignant et exemplaire et/ou miroir) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Générateur de données couramment utilisées. Il peut générer des paires de clés cryptographiques,
les blocs de génèse, la documentation, etc.

### Arbre de mercule (arbre de hasch) {#merkle-tree-hash-tree}

Une structure de données utilisée pour valider et vérifier l'état de chaque bloc
la hauteur. Iroha La mise en œuvre actuelle est un arbre binaire.
[Wikipédia](https://en.wikipedia.org/wiki/Merkle_tree) Pour plus de détails.

### Contrats intelligents {#smart-contracts}

Les contrats intelligents sont des programmes basés sur la blockchain qui s'exécutent lorsqu'un ensemble spécifique
Les conditions sont remplies. Iroha les contrats intelligents sont mis en œuvre en utilisant
[le noyau Iroha instructions spéciales](#core-iroha-special-instructions).

### Les déclencheurs {#triggers}

Un type d'événement qui permet d'invoquer un Iroha l'instruction spéciale à des
bloc commit, temps (avec quelques précautions), etc. Plus sur les déclencheurs
[Je suis là.](/fr/blockchain/triggers.md).

### Rédaction {#versioning}

Chaque demande est étiquetée avec le API La version à laquelle elle appartient.
permet une combinaison de différentes versions binaires de Iroha client/coéquipier
L'interopérabilité des logiciels, ce qui permet à son tour de mettre à niveau les logiciels dans le
Iroha le réseau.

### Hijiri (système de réputation par les pairs) {#hijiri-peer-reputation-system}

Iroha Le système de réputation permet d'accorder la priorité à la communication avec [les pairs](#peer)
qui ont une bonne track-record et réduisent les dommages pouvant être causés par
malveillants [les pairs](#peer).

## Iroha Les modules {#iroha-modules}

Extensions de tiers à Iroha qui fournissent des fonctionnalités sur mesure.

## Iroha Instructions spéciales (ISI) {#iroha-special-instructions-isi}

Une bibliothèque de contrats intelligents fournie par Iroha. Ces informations peuvent être invoquées via:
En ce qui concerne les transactions ou les auditeurs d'événements enregistrés. ISI
[Je suis là.](/fr/blockchain/instructions.md).

#### Utilisation Iroha Instructions spéciales {#utility-iroha-special-instructions}

Cette série de [à l'intérieur](#iroha-special-instructions-isi) contient des éléments logiques
des instructions comme `If`, Résultats de l'enquête `Notify` et des compositions comme
`Sequence`. Ils sont principalement utilisés comme
[instructions personnalisées](#custom-iroha-special-instruction).

### Le noyau Iroha Instructions spéciales {#core-iroha-special-instructions}

[Instructions spéciales](#iroha-special-instructions-isi) fourni avec chaque
Iroha Le déploiement.
[domaine spécifique](#domain-specific-iroha-special-instructions) ainsi que
[instructions d'utilisation](#utility-iroha-special-instructions).

### Domaine spécifique Iroha Instructions spéciales {#domain-specific-iroha-special-instructions}

Instructions relatives aux activités spécifiques au domaine: actifs, comptes,
Ces domaines fournissent les outils nécessaires pour
Les modifications apportées aux [Le point de vue sur l'état du monde](#world-state-view-wsv) dans un lieu sûr et
de façon sûre.

### Les produits à usage ordinaire Iroha Instruction spéciale {#custom-iroha-special-instruction}

Instructions fournies dans [Iroha Les modules](#iroha-modules), par les clients ou 3e
Les parties ne peuvent être construites que par
[Les instructions de base](#core-iroha-special-instructions). Forcage et
modifiant le Iroha le code source n'est pas recommandé, comme instructions spéciales
non convenu par le [les pairs](#peer) dans une Iroha le déploiement sera traité comme des défauts,
ainsi [les pairs](#peer) l'exécution d'une instance modifiée aura leur accès révoqué.

## Iroha Résumé {#iroha-query}

Une demande de lecture du World State View sans modifier ce point de vue.
les questions [Je suis là.](/fr/blockchain/queries.md).

## Vue de changement {#view-change}

Un processus qui se déroule en cas d'échec d'une tentative de consensus.
Généralement, cela implique l'élection d'un nouveau [Le chef de file](#leader).

## La vision de l'état mondial (WSV) {#world-state-view-wsv}

La représentation en mémoire de l'état actuel de la blockchain. WSV contient
le `World`, hashes de blocs engagés, indices de transactions, topologie consensuelle,
Il est mis à jour uniquement par le biais de
blocs et peut être reconstruit à partir de [Kura](#kura-warehouse). Vous voyez ?
[Le point de vue sur l'état du monde](/fr/blockchain/world.md#world-state-view-wsv).

## Le chef de file {#leader}

Dans un réseau iroha, un paire est sélectionné au hasard et accordé le
Le privilège de former le prochain bloc peut être révoqué en
les réseaux qui atteignent
[Torrance de faille byzantine](#byzantine-fault-tolerance-bft) par le biais
[changement de vue](#view-change).
