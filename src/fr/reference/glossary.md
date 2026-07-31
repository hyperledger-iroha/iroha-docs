---
translation_locale: fr
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Le glossaire <!-- omit in toc --> {#glossary}

Vous trouverez ici les définitions de toutes les entités Iroha liées.

- [Peer](#peer)
- [Actifs ](#asset)
- [Tolérance aux défauts byzantine (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha Les composants](#iroha-components)
  - [Sumeragi (empereur)](#sumeragi-emperor)
  - [Torii (porte)](#torii-gate)
  - [Kura (entrepôt)](#kura-warehouse)
  - [Kagami(L'enseignant et l'exemple et/ou le miroir)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Arbre de mercule (arbre de hasch) ](#merkle-tree-hash-tree)
  - [Contrats intelligents ](#smart-contracts)
  - [Les déclencheurs ](#triggers)
  - [Rédaction de versions](#versioning)
  - [Hijiri (système de réputation par les pairs) ](#hijiri-peer-reputation-system)
- [Les modules Iroha](#iroha-modules)
- [Iroha Instructions spéciales (ISI) ](#iroha-special-instructions-isi)
  - [Utilisation Iroha Instructions spéciales](#utility-iroha-special-instructions)
  - [Le noyau Iroha Instructions particulières](#core-iroha-special-instructions)
  - [Spécificité de domaine Iroha Instructions spéciales](#domain-specific-iroha-special-instructions)
  - [À l'usage Iroha Instruction spéciale](#custom-iroha-special-instruction)
- [Iroha Recherche](#iroha-query)
- [Modification de la vue ](#view-change)
- [Voir l'état mondial (WSV) ](#world-state-view-wsv)
- [Directeur ](#leader)

## Les comptes de la blockchain {#blockchain-ledgers}

Les livres de blockchain sont des systèmes numériques d'enregistrement qui utilisent la technologie blockchain pour enregistrer les documents financiers.

À l'époque médiévale, les livres de livre étaient ouverts à la vue du public et à la vérification de l'exactitude.

## Les pairs {#peer}

Un peer dans Iroha désigne une instance de processus Iroha à laquelle d'autres processus et applications clients Iroha peuvent se connecter. Une seule machine peut héberger plusieurs peers Iroha. Les pairs sont égaux en ce qui concerne leurs ressources et capacités, à l'exception d'une exception importante: un seul des pairs exécute le bloc de génèse au stade du démarrage du réseau Iroha.

D'autres chaînes de blocs peuvent faire référence au même concept qu'un nœud ou un validateur.

Un peer peut être un processus sur son système hôte, il peut également être contenu dans un conteneur Docker et une capsule Kubernetes.

## Les actifs {#asset}

Dans le contexte des chaînes de blocs, un actif est la représentation d'un objet précieux sur la blockchain.

Des informations supplémentaires sur les actifs sont disponibles ici [](/fr/blockchain/assets.md).

### Les actifs fonciers {#fungible-assets}

Ces actifs peuvent être facilement échangés contre d'autres actifs du même type, car ils sont interchangeables.

Par exemple, toutes les unités d'une même monnaie sont égales en valeur et peuvent être utilisées pour acheter des biens.

### Actifs non volatils {#non-fungible-assets}

Les actifs non volatils sont uniques et précieux en raison de leurs caractéristiques spécifiques et de leur rareté; leur valeur ne peut pas être comparée à d'autres actifs.

- La valeur d'une peinture peut varier en fonction de l'artiste, du temps qu'elle a été peinte et de l'intérêt que le public porte à elle.
- Deux maisons sur la même rue peuvent avoir des niveaux d'entretien différents.
- Les fabricants de bijoux offrent généralement une variété de modèles différents.

### Actifs à conserver {#mintable-assets}

Un actif peut être émis si plusieurs d'un même type peuvent être émises.

### Les actifs non exploitables {#non-mintable-assets}

Si le montant initial d'un actif est spécifié une fois et ne change pas, il est considéré comme non négociable.

Le bloc [Genèse](/fr/guide/configure/genesis.md) définit cette information pour la configuration Iroha.

## tolérance aux défauts byzantine (BFT) {#byzantine-fault-tolerance-bft}

Propriété de pouvoir fonctionner correctement avec un réseau contenant un certain pourcentage d'acteurs malveillants. Iroha est capable de fonctionner avec jusqu'à 33% d'actifs malveillantes dans son réseau peer-to-peer.

## Components Iroha {#iroha-components}

Les modules Rust contenant la fonctionnalité Iroha.

### Sumeragi (Empereur) {#sumeragi-emperor}

Le module Iroha chargé du consensus.

### Torii (porte) {#torii-gate}

Module avec la logique de traitement des requêtes entrantes pour le [peer](#peer). Il est utilisé pour recevoir, accepter et diriger les instructions entrantes et les requêtes HTTP, ainsi que les mises à jour de configuration en cours d'exécution.

### Kura (entrepôt) {#kura-warehouse}

Stockage en bloc persistant. Kura stocke des blocs signés, des hashes de blocs, des indices d'altitude, des sidecars de récupération et des métadonnées de commit-roster sur le disque. [World State View](#world-state-view-wsv) est reconstruit à partir de blocs Kura lorsqu'un instantané d'état n'est pas disponible ou derrière le magasin local de blocs. Voir [Kura stockage ](/fr/blockchain/world.md#kura-storage).

### Kagami(L'enseignant et l'exemple et/ou le miroir) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Générateur pour les données couramment utilisées. Il peut générer des paires de clés cryptographiques, des blocs de génèse, une documentation, etc.

### Arbre de mercule (arbre du hasch) {#merkle-tree-hash-tree}

Une structure de données utilisée pour valider et vérifier l'état à chaque hauteur de bloc. La mise en œuvre actuelle de Iroha est un arbre binaire. Voir [ Wikipédia](https://en.wikipedia.org/wiki/Merkle_tree) pour plus de détails.

### Contrats intelligents {#smart-contracts}

Les contrats intelligents sont des programmes basés sur la chaîne de blocs qui s'exécutent lorsqu'un certain nombre de conditions sont remplies. Iroha les contrats intelligents sont mis en œuvre en utilisant [le noyau Iroha instructions spéciales](#core-iroha-special-instructions).

### Les déclencheurs {#triggers}

Un type d'événement qui permet d'invoquer une instruction spéciale Iroha à un bloc spécifique, à l'heure (avec quelques précautions), etc. Plus sur les déclencheurs [ ici](/fr/blockchain/triggers.md).

### Rédaction {#versioning}

Chaque demande est étiquetée avec la version API à laquelle elle appartient. Elle permet une combinaison de différentes versions binaires du logiciel client/peer Iroha d'interagir, ce qui permet à son tour des mises à niveau logicielles dans le réseau Iroha.

### Hijiri (système de réputation par les pairs) {#hijiri-peer-reputation-system}

Iroha Il permet d'accorder la priorité à la communication avec les [les pairs](#peer) qui ont une bonne track-record, et de réduire les dommages qui peuvent être causés par la malveillance [les pairs](#peer).

## Les modules Iroha {#iroha-modules}

Extensions tierces à Iroha qui fournissent une fonctionnalité personnalisée.

## Iroha Instructions spéciales (ISI) {#iroha-special-instructions-isi}

Une bibliothèque de contrats intelligents fournie par Iroha. Ils peuvent être invoqués par des transactions ou par des auditeurs d'événements enregistrés. ISI [Je suis là.](/fr/blockchain/instructions.md).

#### Utilisation Iroha Instructions spéciales {#utility-iroha-special-instructions}

Cet ensemble de [à l'intérieur](#iroha-special-instructions-isi) contient des instructions logiques telles que `If`, Résultats de l'enquête `Notify` et des compositions comme `Sequence`. Ils sont principalement utilisés comme [les instructions personnalisées](#custom-iroha-special-instruction).

### Instructions spéciales du noyau Iroha {#core-iroha-special-instructions}

[Des instructions spéciales ](#iroha-special-instructions-isi) fournies avec chaque déploiement de Iroha comprennent certaines [domaines spécifiques](#domain-specific-iroha-special-instructions) ainsi que des instructions d'utilité [](#utility-iroha-special-instructions).

### Instructions spéciales spécifiques au domaine Iroha {#domain-specific-iroha-special-instructions}

Instructions relatives aux activités spécifiques à un domaine: actifs, comptes, domaines, gestion par les pairs). Ils fournissent les outils nécessaires pour apporter des changements à la [Le point de vue sur l'état du monde](#world-state-view-wsv) d'une manière sûre et sûre.

### L'instruction spéciale sur les douanes Iroha {#custom-iroha-special-instruction}

Instructions fournies dans [Iroha Les modules](#iroha-modules), Il ne peut être construit que par des clients ou d'autres. [Les instructions de base](#core-iroha-special-instructions). Forcage et modification de la Iroha le code source n'est pas recommandé, car des instructions spéciales ne sont pas convenues par [les pairs](#peer) dans une Iroha le déploiement sera traité comme des défauts, donc [les pairs](#peer) l'exécution d'une instance modifiée aura leur accès révoqué.

## Iroha Enquête {#iroha-query}

Une demande de lecture du World State View sans modifier cette vue. [Je suis là.](/fr/blockchain/queries.md).

## Vue de changement {#view-change}

Un processus qui se déroule en cas d'échec d'une tentative de consensus. [Le chef](#leader).

## Vue de l'état du monde (WSV) {#world-state-view-wsv}

Représentation en mémoire de l'état actuel de la blockchain. WSV contient le `World`, les hashs de bloc engagés, les indices de transaction, la topologie consensuelle et les indices dérivés utilisés par les requêtes. Il est mis à jour uniquement par le biais de blocs engagés et peut être reconstruit à partir de [Kura](#kura-warehouse). Voir [ World State View](/fr/blockchain/world.md#world-state-view-wsv).

## Le chef {#leader}

Dans un réseau iroha, un paire est sélectionné au hasard et il lui est accordé le privilège spécial de former le prochain bloc. Ce privilège peut être révoqué dans les réseaux qui atteignent [ la résistance à la faille byzantine ](#byzantine-fault-tolerance-bft) via [view change](#view-change).
