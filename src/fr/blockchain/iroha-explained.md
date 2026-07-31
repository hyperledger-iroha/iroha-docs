---
translation_locale: fr
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Expliqué {#iroha-explained}

Iroha 3 est la plateforme Hyperledger Iroha de première sortie. Le même noyau prend en charge les réseaux auto-hébergés et le modèle d'exécution SORA Nexus pour les espaces de données et le routage multiligneux.

## Blocs de construction fondamentaux {#core-building-blocks}

- `irohad` mène des pairs
- Torii est la passerelle du client et de l'exploitant
- Sumeragi gère le consensus
- Norito est le format binaire canonique de [](/fr/reference/norito.md)
- IVM exécute des contrats intelligents portables et un code octal
- Kotodama compile les contrats de haut niveau `.ko` avec le code octal IVM `.to`
- Kagami prépare les clés, l'origine, les profils et les réseaux locaux
- SORA Nexus ajouter des avions de service Soracloud, À l'intérieur, SoraNet, SoraFS, et SoraDNS pour l'hébergement d'applications, le transport de la vie privée, le stockage et la dénomination

## Modèle d'exécution {#execution-model}

Chaque changement dans l'état du monde se produit toujours par des transactions. Les transactions contiennent des instructions ou IVM code octal, et Torii est la principale façon dont les clients les soumettent ou observent leurs effets.

- Les configurations Nexus-conscientes peuvent définir plusieurs voies
- les espaces de données isolent les charges de travail tout en restant partie du même modèle de registre
- la politique de routage détermine quelle voie et l'espace de données gérer une classe de travail

## L'architecture multi-espace de données {#multi-dataspace-architecture}

Un espace de données est une limite de routage et d'espace de noms, pas une blockchain séparée. Le temps d'exécution a encore un `World`, un modèle de transaction et un pipeline de consensus. Nexus ajoute des catalogues qui indiquent au nœud comment partager le travail entre les voies et comment nommer les espaces de données que ces voies servent.

À l'heure d'exécution, un espace de données est représenté par un métadonnées numérique `DataSpaceId` et catalogue. `DataSpaceId::UNIVERSAL` est réservé comme `0`; le catalogue par défaut contient l'espace de données `universal`. Chaque espace de donnée configuré a:

- un chiffre unique ID
- un pseudonyme unique tel que `universal`, `governance` ou `zk`;
- une description facultative des surfaces de l'opérateur
- une valeur non nulle `fault_tolerance` utilisée pour mesurer les comités de relais

Les files d'attente sont les routes d'exécution et de stockage liées à ces espaces de données. Une entrée de file porte un `LaneId`, le `DataSpaceId` qu'elle sert, un alias, la visibilité (`public` ou `restricted`), le profil de stockage (`full_replica`, `commitment_only`, ou `split_replica`), le schéma de preuve et la gouvernance facultative, la règlementation, et les métadonnées du planificateur. Le temps d'exécution dérive de la géométrie de stockage par voie de ce catalogue, y compris les noms des segments Kura et les préfixes de clé déterministe.

Le parcours est le suivant:

1. La configuration construit un `DataSpaceCatalog`, `LaneCatalog` et `LaneRoutingPolicy` validés. Plusieurs voies, plusieurs espaces de données ou routage non par défaut nécessitent `nexus.enabled = true`.
2. La file d'attente des transactions demande au routeur de la voie active une `RoutingDecision` qui contient une voie ID et un espace de données ID.
3. Les règles explicites de routage peuvent correspondre par autorité/compte ou par étiquette d'instructions. Sans une règle de correspondance, le routeur peut dériver l'espace de données du domaine IDs, des projections de définition d'actif, des autorisations étendues par espace de données, des pattes de règlement ou la portée du compte lié de l'autorité.
4. L'itinéraire résolu est vérifié par rapport aux deux catalogues. Si une transaction s'adresse à deux cibles différentes de l'espace de données, elle est rejetée en tant que route conflictuelle; le règlement entre les espaces de données DVP/PVP est parcouru dans la voie du coordinateur universel.
5. Sumeragi et la télémétrie maintiennent l'affectation visible sous forme d'activités de voie et d'espace de données, de backlogs et d'engagements.

C'est pourquoi les identifiants d'objets sont importants. Les domaines incluent l'alias espace de données dans leur ID, par exemple `payments.universal`, de sorte que les écrits à scope de domaine peuvent être routés. Les comptes restent canoniques et sans domaine, de sorte qu'un même compte peut être lié à différents champs d'application sans changer son `AccountId`. Les définitions d'actifs peuvent contenir une projection de domaine/espace de données, ce qui permet aux opérations d'actif d'hériter de la bonne route de l'espace de data.

Sans Nexus surcharges, le nœud utilise une seule voie et l'espace de données `universal`. Le profil SORA regroupé la remplace par un catalogue à trois voies: `core` pour la voie publique universelle, `governance` pour le trafic de gouvernance et `zk` pour le trafic d'attachement à connaissance zéro et de déploiement contractuel.

Ces trois paramètres existent pour séparer les classes de charge de travail:

|espace de données |Lane .|Pourquoi il existe ?|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal` |`core` |Espace de données par défaut réservé (`DataSpaceId::UNIVERSAL == 0`) pour le trafic public ordinaire du registre et l'itinéraire de retour. |
|`governance` |`governance` |L'activité du plan de contrôle n'est donc pas mélangée à l'application générale. |
|`zk` |`zk` |Lane restreint pour les preuves de connaissance zéro, les pièces jointes et le routage du déploiement contractuel, en gardant les flux de travail lourds en preuve séparés des écritures normales. |

Seule `universal` est la ligne de base réservée. `governance` et `zk` sont des choix de profil SORA codés dans le catalogue groupé et la politique de routage; les opérateurs peuvent définir un catalogue différent lorsqu'ils ont besoin de limites différentes de l'espace de données.

Sumeragi utilise toujours la disponibilité des données et une diffusion fiable. Ces chemins font partie du protocole de consensus Iroha 3 et ne peuvent pas être désactivés par un profil de déploiement.

Le comportement en temps d'exécution est basé sur les fichiers de configuration et les paramètres de la chaîne. Les variables environnementales ne sont pas des portes de caractéristiques de production.

## Lire la suite {#read-next}

- [Les services SORA Nexus ](/fr/blockchain/sora-nexus-services.md)
- [Lancement Iroha 3](/fr/get-started/launch-iroha.md)
- [Le monde, WSV et le stockage Kura ](/fr/blockchain/world.md)
- [Référencement de la Genèse](/fr/reference/genesis.md)
- [points d'extrémité Torii](/fr/reference/torii-endpoints.md)
