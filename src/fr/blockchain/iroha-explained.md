---
translation_locale: fr
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 16acd0a607bbec336ff336363478a3a0deeb24ad9a2ad59e753c9f65134b061f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha Expliqué {#iroha-explained}

Iroha 3 est la plateforme Hyperledger Iroha de première version. Le même noyau prend en charge les réseaux auto-hébergés et le modèle d'exécution SORA Nexus pour les espaces de données et le routage multi-voies.

## Blocs de construction de base {#core-building-blocks}

- `iroha3d` exécute des pairs réseau
- Torii est la passerelle client et opérateur
- Sumeragi gère le consensus
- Norito est le [format binaire canonique](/fr/reference/norito.md)
- IVM exécute des contrats intelligents portables et du bytecode
- Kotodama compile des contrats `.ko` de haut niveau en bytecode `.to` IVM
- Kagami prépare des clés, la genèse de la blockchain, des profils et des réseaux locaux
- SORA Nexus les plans de service ajoutent Soracloud, Inrou, SoraNet, SoraFS, et SoraDNS pour l'hébergement d'applications, le transport privé, le stockage et la nomination

## Modèle d'exécution {#execution-model}

Chaque changement de l'état du monde se produit toujours par le biais de transactions. Les transactions contiennent des instructions ou du bytecode IVM, et Torii est le principal moyen pour les clients de les soumettre ou d'en observer les effets.

- les espaces de données fournissent des environnements pour les données institutionnelles, l’autorité, les politiques et les applications
- les voies apportent des capacités de routage et de certification au sein de ces environnements
- une racine d’espace de données signée indépendamment possède son propre état et sa finalité locale

## Espaces de données et racines d’exécution {#multi-dataspace-architecture}

Une entrée au catalogue des espaces de données définit un environnement et son identité. Cette entrée seule n’établit pas une racine d’exécution indépendante. Les voies publiques certifient des lots de transactions destinés à être exécutés par la chaîne globale ; une racine d’espace de données signée indépendamment possède son propre état, son comité et sa finalité locale.

`DataSpaceCatalog` définit les espaces de données, tandis que `LaneCatalog` définit les voies. Chaque voie référence exactement un espace de données par `dataspace_id` ; un espace de données peut contenir plusieurs voies. `DataSpaceId` et `LaneId` sont des identités distinctes, et un alias de voie ne crée pas un autre espace de données.

Lors de l'exécution du logiciel, un espace de données est représenté par un `DataSpaceId` numérique et des métadonnées du catalogue. `DataSpaceId::UNIVERSAL` est réservé en tant que `0` ; le catalogue par défaut contient l'espace de données `universal`. Chaque espace de données configuré possède :

- un identifiant numérique unique
- un alias unique tel que `universal` ou un nom institutionnel explicitement enregistré
- une description optionnelle pour les surfaces de l'opérateur
- une valeur non nulle `fault_tolerance` utilisée pour dimensionner les comités de relais

Les voies sont les ressources de routage et de certification liées à ces espaces de données. Une entrée de voie contient un `LaneId`, le `DataSpaceId` qu’elle dessert, un alias, une visibilité (`public` ou `restricted`), un profil de stockage (`full_replica`, `commitment_only` ou `split_replica`), un schéma de preuve et, facultativement, des métadonnées de gouvernance, de règlement et d’ordonnancement. L’environnement d’exécution déduit de ce catalogue la géométrie de stockage de chaque voie, notamment les noms de segments Kura et les préfixes de clés déterministes.

Le chemin de routage est :

1. La configuration construit des `DataSpaceCatalog`, `LaneCatalog` et `LaneRoutingPolicy` validés. Le routage SORA Nexus est obligatoire. Sur la racine globale, plusieurs espaces de données, plusieurs voies ou un routage non standard exigent le profil SORA Nexus (`--sora`) et NPoS ; une racine d’espace de données signée indépendamment fonctionne en mode Permissioned.
2. La file d’attente des transactions détermine un `RoutingPlan` à partir de la transaction et de l’état validé. Chaque route de coordinateur ou de participant contient un ID de voie et un ID d’espace de données ; les plans AMX natifs conservent l’ensemble complet des participants.
3. Pour l’exécution globale, les lots complets du plan de contrôle et les coordinateurs entre espaces de données utilisent la voie `0`. Les cibles précises non universelles d’instruction ou d’adresse de contrat sélectionnent une voie fixe admise, avec l’espace de données et le comité correspondants, avant l’application des règles de compte ou d’étiquette d’instruction. Les autres opérations suivent les règles explicites validées et le partitionnement par défaut ; les cibles universelles précises restent sur les voies universelles.
4. Chaque route est vérifiée par rapport aux catalogues et à l’état actif des voies. Les IDs inconnus et les incompatibilités entre voie et espace de données sont rejetés ; une cible privée indisponible ne peut pas se rabattre sur l’exécution universelle. Plusieurs cibles d’espaces de données peuvent produire un plan AMX natif. La métadonnée de transaction `amx_policy` définie à `reject_cross_dataspace` rejette les plans entre espaces de données. Un plan de routage seul n’autorise ni n’achève un règlement entre racines indépendantes.
5. La télémétrie rend l’affectation observable sous forme d’activité et de travail en attente par voie dans l’instantané des voies de `/status` (`teu_lane_commit`).

Les identifiants d’objets sont donc essentiels. Les domaines incluent l’alias d’espace de données dans leur ID, par exemple `payments.universal`, afin de permettre le routage des écritures portant sur un domaine. Les comptes restent canoniques et sans domaine : le même compte peut être lié à différents périmètres applicatifs sans changer son `AccountId`. Les définitions d’actifs peuvent porter une projection de domaine ou d’espace de données, permettant aux opérations sur les actifs d’hériter de la bonne route d’espace de données.

Sans les paramètres spécifiques à SORA Nexus, le nœud utilise une seule voie et l’espace de données `universal`. Le profil SORA Nexus fourni remplace cette configuration par un catalogue de trois voies : `core` pour la voie publique universelle, `governance` pour le trafic de gouvernance et `zk` pour les pièces jointes à divulgation nulle de connaissance et le trafic de déploiement de contrats.

Les trois voies fournies sont publiques et référencent le même espace de données `universal`. Elles séparent les catégories de charge de travail :

| Espace de données | Voie | Raison d’être |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | Trafic ordinaire du registre public et routage par défaut. |
| `universal` | `governance` | Gouvernance publique et trafic de SORA Parliament. |
| `universal` | `zk` | Trafic public de pièces jointes à divulgation nulle de connaissance et de déploiement de contrats. |

`DataSpaceId::UNIVERSAL == 0` est la valeur de base réservée. Les noms `governance` et `zk` ci-dessus désignent des voies et non des espaces de données distincts. Des frontières institutionnelles différentes nécessitent des entrées explicites d’espaces de données ; une exécution indépendante nécessite en outre une racine authentifiée indépendamment.

Ces relations sont fixées, à la révision épinglée, par les [constructeurs de profils](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_config/src/parameters/actual.rs), [l’implémentation des voies](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs) et [le contrat des racines indépendantes](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md).

Sumeragi utilise toujours la disponibilité des charges utiles RS16 signées et la récupération des corps certifiés. Ces chemins font partie du protocole de consensus Iroha 3 et ne peuvent pas être désactivés par un profil de déploiement.

Le comportement d'exécution du logiciel provient des fichiers de configuration et des paramètres en chaîne. Les variables d'environnement ne sont pas des commutateurs de fonctionnalités en production.

## Lire ensuite {#read-next}

- [Services de SORA Nexus](/fr/blockchain/sora-nexus-services.md)
- [Lancer Iroha 3](/fr/get-started/launch-iroha.md)
- [Monde, WSV, et stockage Kura](/fr/blockchain/world.md)
- [référence de genèse de la blockchain](/fr/reference/genesis.md)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md)
