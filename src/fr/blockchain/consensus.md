---
translation_locale: fr
translation_source: /blockchain/consensus.md
translation_source_hash: ebdf564d607b96f7f186637044d80b2f1bb7c9fbe6080a061d27d02ec6f8cf62
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Consensus {#consensus}

Les transactions entrent dans une file d'attente avant que Sumeragi ne les propose dans un bloc. Les validateurs valident et exécutent indépendamment la proposition, puis signent uniquement la transition d'état qu'ils peuvent reproduire. Un bloc est validé après que le quorum requis de validateurs est d'accord sur ce résultat et que la charge utile correspondante est disponible.

Tous les réseaux Iroha 3 utilisent des manifestes techniques et des morceaux RS16 de disponibilité des données signés, ainsi qu'une récupération par un organisme certifié. La disponibilité des données est une exigence de consensus, et non une fonctionnalité de déploiement optionnelle.

## Sumeragi {#sumeragi}

Sumeragi est le moteur de consensus tolérant aux fautes byzantines de Iroha. Il prend les transactions de la file d'attente, fait en sorte que les pairs du réseau de validateurs s'accordent sur le même bloc ordonné, et ne finalise ce bloc qu'après qu'un nombre suffisant de validateurs aient reproduit le même résultat et signé le certificat d'engagement du consensus.

### Proposition et chemin de commit {#proposal-and-commit-path}

Sumeragi fait progresser le registre d’une hauteur de bloc à la fois. À chaque hauteur, un validateur est le proposant de la vue courante. Il prélève les transactions admissibles dans la file d’attente, construit un bloc candidat et annonce sa proposition à l’ensemble actif des validateurs. Les chaînes inactives ne produisent aucun bloc vide.

Le même pipeline de traitement Sumeragi est utilisé à la fois dans les déploiements avec permission et dans ceux utilisant le Proof-of-Stake Nominé (NPoS) :

1. Un validateur propose un bloc à partir des transactions en attente.
2. Les validateurs valident la proposition en exécutant les transactions contre le même état mondial.
3. Les validateurs échangent des votes et des certificats de quorum de consensus pour la hauteur et la vue actuelles.
4. Une fois que le quorum de validation est atteint, les pairs du réseau valident le bloc et mettent à jour leur état du monde.

Les validateurs ne signent que les données qu'ils peuvent reproduire localement. Avant de voter, un validateur vérifie que la proposition appartient à la chaîne, à la hauteur et à la vue prévues ; que les signatures et les limites des transactions respectent les règles du protocole ; que le routage de la voie d'exécution et la validation de l'exécutant soient déterministes ; et que l'exécution de la charge utile produit la transition d'état attendue. Si le résultat local diffère, le validateur rejette la proposition au lieu de voter pour elle.

Les votes sont de petits messages de consensus signés. Ils se réfèrent au bloc proposé, à la hauteur, à la vue et à l'identité du validateur. Les signatures vérifiées forment des certificats de quorum de préparation et d'engagement du consensus. Un certificat de commit de consensus est la preuve durable que suffisamment de validateurs ont observé le même résultat pour le même bloc. Les validateurs de l'ensemble A envoient normalement leurs votes Prepare et Commit à la queue proxy (proxy tail) du tour, qui agrège exactement le nombre de votes égaux requis et diffuse le certificat. Si un certificat tarde, les validateurs de l'ensemble B votent aussi auprès de la queue proxy ; en dernier recours, chaque validateur diffuse son vote et tout validateur peut agréger le certificat.

### Quorum et observateurs {#quorum-and-observers}

Le protocole de la première version n’admet qu’un comité votant de taille exactement `3f + 1`, comprenant de 4 à 31 validateurs. Les tailles valides sont donc 4, 7, 10, et ainsi de suite jusqu’à 31. Pour `n = 3f + 1`, le nombre de fautes byzantines tolérées est `f` et le quorum de commit est `2f + 1`. La génération de la genèse et la validation au démarrage rejettent toute autre taille de comité. Chaque PrepareQC, CommitQC et TimeoutCert contient exactement `q = n - f` votes de validateurs de poids égal ; tout ensemble de signataires excédant ce nombre est rejeté.

Les pairs observateurs du réseau peuvent synchroniser les blocs validés, mais ils ne proposent pas, ne votent pas et ne comptent pas pour le quorum de validation. Utilisez des observateurs lorsqu'un déploiement a besoin de capacité de requête locale, d'indexation, de surveillance ou de réplication régionale des blocs sans augmenter le nombre de validateurs votants.

### Changements de vue et récupération {#view-changes-and-recovery}

Une vue est la tentative de Sumeragi de finaliser une hauteur avec un proposeur et un calendrier donnés. Si la proposition, la charge, le vote ou la validation n’avance plus, le cadenceur du consensus peut faire passer la hauteur à une vue ultérieure. Un changement de vue ne réécrit pas un bloc validé : il modifie la façon dont les validateurs tentent d’achever la hauteur en attente et reporte le quorum ou la preuve de validation les plus élevés connus afin d’éviter des blocs contradictoires.

La récupération de la charge utile est distincte de la décision de finalité. Un pair du réseau pourrait recevoir un certificat de quorum ou de validation du consensus avant d'avoir la totalité de la charge utile du bloc. Dans ce cas, le pair du réseau demande des fragments de charge utile signés RS16 ou un corps certifié, vérifie les octets récupérés par rapport aux hachages cryptographiques annoncés, et ce n'est qu'ensuite qu'il applique le bloc à l'état du monde et à Kura.

### Modes de consensus {#consensus-modes}

Le mode sélectionné détermine la formation et le fonctionnement de l’ensemble des validateurs. Il est déclaré dans la genèse signée au moyen de [`consensus_mode`](/fr/reference/genesis.md) et figé dans le contexte de chaque hauteur. La configuration locale `[sumeragi]` sélectionne le rôle du nœud, la garde des clés de signature, les chemins des enregistrements de sûreté ainsi que les dérogations documentées aux délais et à la synchronisation. Les limites de blocs et de transactions, le mode de consensus et la cadence proviennent de la genèse signée et de l’état validé. Les validateurs doivent partager la même genèse signée, la même topologie, les mêmes données de pairs de confiance et les mêmes paramètres Sumeragi effectifs.

|Mode|Meilleure adaptation|Ensemble de validateurs|Focus opérationnel|
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Avec permission|Réseaux privés, de consortium ou gérés par un opérateur|Les validateurs proviennent de la topologie des pairs de confiance convenue pour le déploiement|Maintenez identiques sur tous les validateurs la genèse signée, les pairs de confiance, leurs clés et les paramètres de Sumeragi|
| NPoS | Réseaux publics ou orientés SORA Nexus dont la validation suit les règles de nomination et de mise en jeu | Les validateurs sont sélectionnés par le profil NPoS, généralement par époques, et doivent posséder des clés BLS accompagnées de preuves de possession | Maintenir la cohérence entre les instantanés des mises, les entrées signées des époques et élections, les PoPs des validateurs et la cadence immuable des blocs sur tout le réseau |

::: tip Mode autorisé

Utilisez le mode autorisé lorsque la liste des validateurs est un choix opérationnel explicite. C’est le point de départ habituel pour les réseaux Iroha auto-hébergés car les changements de membres sont des actions délibérées de gouvernance ou d’administrateur. La règle opérationnelle importante est que chaque validateur doit fonctionner avec la même vue de la genèse de la blockchain, des pairs réseau de confiance, des BLS preuves de possession et des paramètres Sumeragi. Un seul pair du réseau avec une topologie différente ou un bloc de genèse de blockchain signé peut empêcher le réseau de s'engager.

:::

::: tip mode NPoS

Utilisez le mode NPoS lorsque le profil de déploiement s'attend à ce que la participation des validateurs soit déterminée par la nomination et l'état des mises. Les déploiements publics SORA Nexus utilisent NPoS, et leurs profils générés incluent les identités des validateurs BLS, les preuves de possession, les paramètres d'époque, et les paramètres NPoS Sumeragi nécessaires au démarrage. Les changements d'époque peuvent remplacer l'ensemble de validateurs actif à des hauteurs définies, donc les opérateurs doivent surveiller à la fois la santé du consensus et l'état des mises ou des nominations qui alimentent le prochain roster.

:::

## Consensus multivoie {#multilane-consensus}

Les espaces de données définissent les environnements des données, de l’autorité, des politiques et des applications. Leurs voies ajoutent de la capacité de diffusion et de certification. Les catalogues sont distincts : `nexus.dataspace_catalog` définit les espaces de données et `nexus.lane_catalog` définit les voies, chacune référençant un espace de données. Plusieurs voies peuvent partager le même espace de données.

Pour l’exécution globale publique, la voie `0` est séquencée par l’instance Sumeragi globale. Chaque autre génération active de voie exécute une instance distincte du même cœur Sumeragi, avec son comité et ses paramètres de consensus fixés. Son bloc certifié contient un lot ordonné de transactions dont l’admission est vérifiée par rapport à un point d’ancrage global validé. La certification d’une voie ne modifie pas l’état global.

La chaîne globale fusionne les blocs certifiés suivants de chaque voie, dans la continuité des précédents. L’exécution du bloc global résultant applique ces transactions dans l’ordre canonique, et le CommitQC global finalise cette exécution. Un certificat de voie seul ne suffit donc pas à affirmer qu’une transaction a modifié l’état global. L’identité de la voie, sa génération, la fraîcheur du point d’ancrage, la garde des sources et les limites contiguës de fusion restent vérifiées pendant toute la récupération et l’exécution.

La politique `sumeragi_lane_policy` validée gouverne les voies fixes, les routes, les comités et l’ajustement automatique de capacité. Un catalogue de configuration seul n’active pas une voie de consensus. Les cibles précises d’espaces de données doivent correspondre à une voie admise ; une route privée indisponible est rejetée au lieu d’être exécutée comme du travail universel. Les lots complets du plan de contrôle empruntent la voie `0` pour permettre la progression des transitions de catalogue et d’activation.

Une racine d’espace de données signée indépendamment constitue une frontière d’exécution distincte, avec son propre état et sa finalité locale. Enregistrer une entrée au catalogue des espaces de données ne crée pas cette racine. L’atomicité entre racines utilise le protocole AMX distinct. La qualification monétaire et celle du réseau complet pour cette voie restent à établir pour le candidat épinglé.

Consultez, à la révision épinglée, [l’implémentation des voies](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs), [le contrat des voies](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_lanes.md), [le contrat des espaces de données indépendants](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) et [l’état de qualification](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_goals.md).

## Disponibilité des données et récupération de la charge utile {#data-availability-and-payload-recovery}

Sumeragi V1 assure la disponibilité globale des charges utiles au moyen de messages RS16 signés `PayloadManifest` et `PayloadChunk`. Le chef envoie le manifeste signé et chaque ligne signée à tous les autres membres du comité ainsi qu’aux membres qui rejoignent le comité suivant. Un validateur ne peut voter Prepare qu’après avoir reconstruit le corps canonique, validé le manifeste et les hachages des fragments, stocké durablement le corps et terminé la validation déterministe. Un pair auquel il manque des lignes les demande avec `PayloadRequest`. La récupération des corps certifiés et la synchronisation des blocs fournissent une procédure de récupération bornée lorsqu’un pair apprend la finalité avant de recevoir le corps.

Chaque instance de voie possède son propre contexte authentifié de disponibilité et de certificats. Les vérifications de fusion globale lient son lot certifié et sa charge utile d’origine à la génération et au point d’ancrage attendus. Un pair n’applique la finalité globale que si la charge utile globale correspondante et un CommitQC valide sont disponibles localement.

Utilisez les interfaces de l'opérateur authentifié plutôt qu'un point de terminaison RBC API séparé :

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` rapporte la hauteur, la vue, la phase, les certificats et l'état de vivacité autoritatifs.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` fournit des diagnostics sans valeur d’autorité sur la pression exercée sur la file d’attente des transactions, l’état de l’élection NPoS et le statut des manifestes de gouvernance des voies.
- Les séries Prometheus par instance telles que `sumeragi_fetch_requests_total` (`kind="body"` pour les corps manquants, `kind="sync"` pour le rattrapage), `sumeragi_view_changes_total`, `sumeragi_round_stage` et `sumeragi_dropped_total` portent une étiquette `lane` et distinguent la récupération des corps manquants, les changements de vue et les rejets des files d’attente bornées ; voir [Performance et métriques](/fr/guide/advanced/metrics.md).

Les magasins de blocs des voies conservent les lots certifiés et les enregistrements sources nécessaires à la fusion et à la récupération. Leur cycle de vie suit la génération de voie validée ; un nom de répertoire de stockage n’autorise ni une nouvelle voie ni une nouvelle racine d’exécution.
