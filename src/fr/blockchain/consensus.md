---
translation_locale: fr
translation_source: /blockchain/consensus.md
translation_source_hash: fdc9a35ac2e43acda076104063b5a364feb5060a70473b51cf016b8adb1306d3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Consensus {#consensus}

Les transactions entrent dans une file d'attente avant que Sumeragi ne les propose dans un bloc. Les validateurs valident et exécutent indépendamment la proposition, puis signent uniquement la transition d'état qu'ils peuvent reproduire. Un bloc est validé après que le quorum requis de validateurs est d'accord sur ce résultat et que la charge utile correspondante est disponible.

Tous les réseaux Iroha 3 utilisent des manifestes techniques et des morceaux RS16 de disponibilité des données signés, ainsi qu'une récupération par un organisme certifié. La disponibilité des données est une exigence de consensus, et non une fonctionnalité de déploiement optionnelle.

## Sumeragi {#sumeragi}

Sumeragi est le moteur de consensus tolérant aux fautes byzantines de Iroha. Il prend les transactions de la file d'attente, fait en sorte que les pairs du réseau de validateurs s'accordent sur le même bloc ordonné, et ne finalise ce bloc qu'après qu'un nombre suffisant de validateurs aient reproduit le même résultat et signé le certificat d'engagement du consensus.

### Proposition et chemin de commit {#proposal-and-commit-path}

Sumeragi fait avancer le registre blockchain d'un bloc à la fois. À chaque hauteur, un validateur agit en tant que proposant pour la vue actuelle. Le proposant puise les transactions éligibles dans la file d'attente, construit un bloc candidat et annonce la proposition à l'ensemble actif des validateurs.

Le même pipeline de traitement Sumeragi est utilisé à la fois dans les déploiements avec permission et dans ceux utilisant le Proof-of-Stake Nominé (NPoS) :

1. Un validateur propose un bloc à partir des transactions en attente.
2. Les validateurs valident la proposition en exécutant les transactions contre le même état mondial.
3. Les validateurs échangent des votes et des certificats de quorum de consensus pour la hauteur et la vue actuelles.
4. Une fois que le quorum de validation est atteint, les pairs du réseau valident le bloc et mettent à jour leur état du monde.

Les validateurs ne signent que les données qu'ils peuvent reproduire localement. Avant de voter, un validateur vérifie que la proposition appartient à la chaîne, à la hauteur et à la vue prévues ; que les signatures et les limites des transactions respectent les règles du protocole ; que le routage de la voie d'exécution et la validation de l'exécutant soient déterministes ; et que l'exécution de la charge utile produit la transition d'état attendue. Si le résultat local diffère, le validateur rejette la proposition au lieu de voter pour elle.

Les votes sont de petits messages de consensus signés. Ils se réfèrent au bloc proposé, à la hauteur, à la vue et à l'identité du validateur. Les signatures vérifiées forment des certificats de quorum de préparation et d'engagement du consensus. Un certificat de commit de consensus est la preuve durable que suffisamment de validateurs ont observé le même résultat pour le même bloc. Chaque validateur envoie ses votes Prepare et Commit au comité complet ; tout validateur peut agréger le nombre de votes égaux requis et diffuser le certificat résultant.

### Quorum et observateurs {#quorum-and-observers}

Le protocole de première version n’admet qu’un comité de vote exact de taille `3f + 1`, compris entre 4 et 31 validateurs. Les tailles valides sont donc 4, 7, 10, et ainsi de suite jusqu’à 31. Pour `n = 3f + 1`, la tolérance aux fautes byzantines vaut `f` et le quorum de validation `2f + 1`. La génération de la genèse et la validation au démarrage rejettent toute autre taille de comité.

Les pairs observateurs du réseau peuvent synchroniser les blocs validés, mais ils ne proposent pas, ne votent pas et ne comptent pas pour le quorum de validation. Utilisez des observateurs lorsqu'un déploiement a besoin de capacité de requête locale, d'indexation, de surveillance ou de réplication régionale des blocs sans augmenter le nombre de validateurs votants.

### Changements de vue et récupération {#view-changes-and-recovery}

Une vue est la tentative de Sumeragi de finaliser une hauteur avec un proposeur et un calendrier donnés. Si la proposition, la charge, le vote ou la validation n’avance plus, le cadenceur du consensus peut faire passer la hauteur à une vue ultérieure. Un changement de vue ne réécrit pas un bloc validé : il modifie la façon dont les validateurs tentent d’achever la hauteur en attente et reporte le quorum ou la preuve de validation les plus élevés connus afin d’éviter des blocs contradictoires.

La récupération de la charge utile est distincte de la décision de finalité. Un pair du réseau pourrait recevoir un certificat de quorum ou de validation du consensus avant d'avoir la totalité de la charge utile du bloc. Dans ce cas, le pair du réseau demande des fragments de charge utile signés RS16 ou un corps certifié, vérifie les octets récupérés par rapport aux hachages cryptographiques annoncés, et ce n'est qu'ensuite qu'il applique le bloc à l'état du monde et à Kura.

### Modes de consensus {#consensus-modes}

Le mode sélectionné détermine la formation et le fonctionnement de l’ensemble des validateurs. Il est déclaré par [`consensus_mode`](/fr/reference/genesis.md) dans la genèse signée et figé dans le contexte de chaque hauteur. La configuration locale `[sumeragi]` ne choisit que le rôle du nœud et les limites finies des blocs, de la file d’attente, de l’environnement d’exécution, du stockage et de la politique de clés ; elle ne peut remplacer ni le mode ni la cadence des blocs. Tous les validateurs doivent partager la même genèse signée, la même topologie, les mêmes données de pairs de confiance et les mêmes paramètres effectifs de Sumeragi.

|Mode|Meilleure adaptation|Ensemble de validateurs|Focus opérationnel|
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Avec permission|Réseaux privés, de consortium ou gérés par un opérateur|Les validateurs proviennent de la topologie des pairs de confiance convenue pour le déploiement|Maintenez identiques sur tous les validateurs la genèse signée, les pairs de confiance, leurs clés et les paramètres de Sumeragi|
|NPoS|Réseaux publics ou orientés Nexus où la validation suit les politiques de nomination et de participation|Le profil NPoS sélectionne les validateurs, généralement entre les époques, et exige des clés BLS et des preuves de possession|Maintenez alignés dans tout le réseau les instantanés de participation, les entrées signées d’époque et d’élection, les PoPs des validateurs et la cadence immuable des blocs|

::: tip Mode autorisé

Utilisez le mode autorisé lorsque la liste des validateurs est un choix opérationnel explicite. C’est le point de départ habituel pour les réseaux Iroha auto-hébergés car les changements de membres sont des actions délibérées de gouvernance ou d’administrateur. La règle opérationnelle importante est que chaque validateur doit fonctionner avec la même vue de la genèse de la blockchain, des pairs réseau de confiance, des BLS preuves de possession et des paramètres Sumeragi. Un seul pair du réseau avec une topologie différente ou un bloc de genèse de blockchain signé peut empêcher le réseau de s'engager.

:::

::: tip mode NPoS

Utilisez le mode NPoS lorsque le profil de déploiement s'attend à ce que la participation des validateurs soit déterminée par la nomination et l'état des mises. Les déploiements publics SORA Nexus utilisent NPoS, et leurs profils générés incluent les identités des validateurs BLS, les preuves de possession, les paramètres d'époque, et les paramètres NPoS Sumeragi nécessaires au démarrage. Les changements d'époque peuvent remplacer l'ensemble de validateurs actif à des hauteurs définies, donc les opérateurs doivent surveiller à la fois la santé du consensus et l'état des mises ou des nominations qui alimentent le prochain roster.

:::

## Consensus multivoie {#multilane-consensus}

Le chemin de consensus multi-voies de Iroha est mis en œuvre via la voie d'exécution Nexus et la configuration de l'espace de données. Il ne démarre pas une instance de consensus distincte pour chaque voie d'exécution. Sumeragi finalise toujours un flux de blocs commandé ; les voies d'exécution décrivent comment les transactions sont acheminées, planifiées, comptabilisées et stockées dans ce flux.

La configuration d'exécution du logiciel construit trois éléments de l'état de voie d'exécution :

- `nexus.lane_catalog` : les voies d'exécution configurées, chacune avec un `LaneId` numérique, un alias, un espace de données, une visibilité, un profil de stockage, un schéma de preuve et des métadonnées.
- `nexus.dataspace_catalog` : les espaces de données configurés, chacun avec un `DataSpaceId` numérique et une valeur de tolérance aux pannes utilisée pour le dimensionnement du comité de relais.
- `nexus.routing_policy` : la paire de voie/espaces de données par défaut et les règles de routage ordonnées qui peuvent correspondre aux comptes ou aux chemins d'instructions.

Lorsqu'une transaction entre dans la file d'attente, le routeur de la voie d'exécution la résout en un `RoutingDecision { lane_id, dataspace_id }`. En mode à voie unique, il s'agit toujours de la voie d'exécution `0` et de l'espace de données universel. En mode Nexus, le routeur configuré applique des règles à l'échelle du domaine de données, le routage de règlement, les règles de compte, les règles de routage explicites, et enfin la route par défaut. La voie d'exécution résolue et l'espace de données doivent exister dans leurs catalogues, et la voie d'exécution doit être liée à l'espace de données résolu ; sinon, la transaction est rejetée avant d'être mise en file d'attente.

La file d'attente conserve cette décision de routage avec le hachage cryptographique de la transaction afin que les étapes suivantes n'aient pas à la déduire à nouveau. La construction de la proposition utilise ensuite les métadonnées de la voie d'exécution de deux manières :

- Il entrelace les transactions par voie d'exécution afin qu'une voie d'exécution ne domine pas le bloc simplement parce que ses transactions ont été mises en file d'attente en premier.
- Il s'applique aux limites par unité d'exécution de transaction par voie (TEU). Les transactions qui dépasseraient la capacité configurée d'une voie d'exécution sont reportées et remises en file d'attente, sauf que la première transaction surchargée pour une voie d'exécution peut être admise pour éviter un blocage vivant.

Lors de la préparation du candidat, Sumeragi agrège la charge utile proposée par voie d'exécution et espace de données et dérive les identités de disponibilité des données locales à la voie. Les totaux enregistrés incluent le nombre de transactions, les segments, les octets de charge utile et TEU. Après l'engagement, ces totaux deviennent la voie d'exécution et les vues de données ponctuelles d'engagement de l'espace de données exposées via des diagnostics authentifiés Sumeragi. Si un bloc contient des enregistrements de résultat du protocole de règlement de voie d'exécution, le traitement du bloc crée également des engagements de règlement de voie d'exécution et des données de relais conteneurs qui lient l'en-tête de bloc, le certificat de validation du consensus, le hachage cryptographique de l'engagement de disponibilité des données, la preuve de règlement et la taille de la charge utile de la voie d'exécution.

## Disponibilité des données et récupération de la charge utile {#data-availability-and-payload-recovery}

Sumeragi v2 transporte la disponibilité globale de la charge utile via des messages signés RS16 `PayloadManifest` et `PayloadChunk`. Le leader envoie le manifeste technique signé au comité complet et distribue initialement des morceaux déterministes à l’Ensemble A. Un validateur peut préparer un vote uniquement après avoir reconstruit le corps canonique, validé le manifeste technique et les hachages cryptographiques des segments, et stocké le corps de manière durable. et en complétant la validation déterministe. Si le chemin rapide s'interrompt, la récupération élargit la livraison des segments au Jeu B. La récupération du corps certifié et la synchronisation des blocs fournissent le chemin de récupération borné lorsqu'un pair du réseau prend connaissance de la finalité avant de recevoir le corps.

L'exécution multilane dérive en outre un hachage cryptographique déterministe de propriété de charge utile et un hachage cryptographique d'instance RBC local à la voie pour chaque sujet de voie d'exécution. Ces identités lient les propositions de voie d'exécution et les certificats à la transaction porteuse globale ; elles ne constituent pas une session de consensus global distincte. Un bloc se finalise toujours uniquement lorsque le pair du réseau dispose d'un certificat de validation de consensus valide et de la charge utile correspondante localement.

Utilisez les interfaces de l'opérateur authentifié plutôt qu'un point de terminaison RBC API séparé :

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` rapporte la hauteur, la vue, la phase, les certificats et l'état de vivacité autoritatifs.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` affiche des diagnostics non contraignants sur la file, le pipeline, NPoS, les voies et les espaces de données, notamment la propriété de la charge utile de chaque voie.
- Les signaux Prometheus tels que `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total` et `sumeragi_da_gate_satisfied_total` séparent la récupération des corps manquants, les portails de disponibilité des données et le traitement des messages ; voir [Performance et métriques](/fr/guide/advanced/metrics.md).

Kura utilise la configuration de voie d'exécution dérivée pour la disposition du stockage. Chaque voie d'exécution reçoit des noms de stockage déterministes tels que `blocks/lane_000_core` et `merge_ledger/lane_000_core_merge.log` ; les changements dans le cycle de vie de la voie d'exécution peuvent provisionner, mettre hors service ou renommer ces segments sans modifier l'ordre global des blocs.
