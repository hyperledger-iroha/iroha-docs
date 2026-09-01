---
translation_locale: fr
translation_source: /blockchain/iroha-explained.md
translation_source_hash: ba591b2c1aa819837177625b1ae457b5fa492197576dc690b19ca2897562a436
translation_status: machine-validated
translation_engine: bing-translator-llm
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

- Les configurations conscientes de Nexus peuvent définir plusieurs voies d'exécution
- les espaces de données isolent les charges de travail tout en restant partie du même modèle de registre de blockchain
- La politique de routage décide quelle voie d'exécution et quel espace de données gèrent une catégorie de travail

## Architecture Multi-Espaces de Données {#multi-dataspace-architecture}

Un espace de données délimite le routage et l’espace de noms ; ce n’est pas une blockchain distincte. L’environnement d’exécution conserve un seul `World`, un seul modèle de transaction et un seul pipeline de consensus. Nexus ajoute des catalogues qui indiquent au nœud comment répartir le travail entre les voies et comment nommer les espaces de données desservis par ces voies.

Lors de l'exécution du logiciel, un espace de données est représenté par un `DataSpaceId` numérique et des métadonnées du catalogue. `DataSpaceId::UNIVERSAL` est réservé en tant que `0` ; le catalogue par défaut contient l'espace de données `universal`. Chaque espace de données configuré possède :

- un identifiant numérique unique
- un alias unique tel que `universal`, `governance` ou `zk`
- une description optionnelle pour les surfaces de l'opérateur
- une valeur non nulle `fault_tolerance` utilisée pour dimensionner les comités de relais

Les voies d’exécution sont les routes d’exécution et de stockage rattachées à ces espaces de données. Une entrée de voie comporte un `LaneId`, le `DataSpaceId` qu’elle dessert, un alias, une visibilité (`public` ou `restricted`), un profil de stockage (`full_replica`, `commitment_only` ou `split_replica`), un schéma de preuve ainsi que, facultativement, des métadonnées de gouvernance, de règlement et de planification. L’environnement d’exécution déduit de ce catalogue la géométrie de stockage de chaque voie, notamment les noms des segments Kura et les préfixes de clés déterministes.

Le chemin de routage est :

1. La configuration crée un `DataSpaceCatalog`, `LaneCatalog` et `LaneRoutingPolicy` validé. Plusieurs voies d'exécution, plusieurs espaces de données ou un routage non par défaut nécessitent `nexus.enabled = true`.
2. La file d'attente des transactions demande au routeur de voie d'exécution active un `RoutingDecision` contenant un ID de voie d'exécution et un ID d'espace de données.
3. Les règles de routage explicites peuvent correspondre par autorité/compte ou par étiquette d'instruction. En l'absence d'une règle correspondante, le routeur peut dériver l'espace de données à partir des identifiants de domaine, des projections de définition d'actifs, des autorisations limitées à l'espace de données, des parties de transfert de règlement ou de la portée du compte lié du principal d'autorisation.
4. La route résolue est vérifiée par rapport aux deux catalogues. Les voies d'exécution inconnues, les espaces de données inconnus et les incompatibilités voie/espace de données sont des erreurs de routage déterministes. Si une transaction écrit sur deux cibles de l'espace de données différentes, elle est rejetée en tant que route conflictuelle ; le règlement inter-espaces de données DVP/PVP est acheminé via la voie d'exécution du coordinateur universel.
5. Sumeragi et la télémétrie maintiennent l'affectation visible comme voie d'exécution et activité de l'espace de données, rétrospective des arriérés et des engagements.

C'est pourquoi les identifiants d'objet sont importants. Les domaines incluent l'alias de l'espace de données dans leur ID, par exemple `payments.universal`, afin que les écritures limitées au domaine puissent être acheminées. Les comptes restent canoniques et sans domaine. de sorte que le même compte peut être lié à différents périmètres d'application sans changer son `AccountId`. Les définitions d'actifs peuvent porter une projection de domaine/espace de données, ce qui permet aux opérations sur les actifs d'hériter du chemin correct de l'espace de données.

Sans les remplacements de Nexus, le nœud utilise une seule voie d'exécution et l'espace de données `universal`. Le profil SORA inclus remplace cela par un catalogue à trois voies : `core` pour la voie d'exécution publique universelle, `governance` pour le trafic de gouvernance, et `zk` pour le trafic de pièces jointes à connaissance zéro et de déploiement de contrats.

Ces trois valeurs par défaut existent pour séparer les classes de charge de travail :

|Espace de données|voie d'exécution|Pourquoi cela existe|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal`| `core`       |Espace de données par défaut réservé (`DataSpaceId::UNIVERSAL == 0`) pour le trafic du grand livre public ordinaire de la blockchain et le routage de secours.|
| `governance` | `governance` |Voie d'exécution restreinte pour le trafic de gouvernance et du parlement, afin que l'activité du plan de contrôle ne soit pas mélangée avec les écritures des applications générales.|
| `zk`         |`zk`|Voie d'exécution restreinte pour les preuves à divulgation nulle de connaissance, les pièces jointes et le routage du déploiement de contrats, gardant les flux de travail lourds en preuves séparés des écritures normales.|

Seul `universal` est la ligne de base réservée. `governance` et `zk` sont des choix de profil SORA encodés dans le catalogue et la politique de routage inclus ; les opérateurs peuvent définir un catalogue différent lorsqu'ils ont besoin de limites de dataverse différentes.

Sumeragi utilise toujours la disponibilité des données et la diffusion fiable. Ces chemins font partie du protocole de consensus Iroha 3 et ne peuvent pas être désactivés par un profil de déploiement.

Le comportement d'exécution du logiciel provient des fichiers de configuration et des paramètres en chaîne. Les variables d'environnement ne sont pas des commutateurs de fonctionnalités en production.

## Lire ensuite {#read-next}

- [Services de SORA Nexus](/fr/blockchain/sora-nexus-services.md)
- [Lancer Iroha 3](/fr/get-started/launch-iroha.md)
- [Monde, WSV, et stockage Kura](/fr/blockchain/world.md)
- [référence de genèse de la blockchain](/fr/reference/genesis.md)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md)
