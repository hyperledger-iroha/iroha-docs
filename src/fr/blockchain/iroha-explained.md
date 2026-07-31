---
translation_locale: fr
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Expliqué {#iroha-explained}

Iroha 3 est la première version Hyperledger Iroha Le même noyau.
supporte les réseaux auto-hébergés et SORA Nexus modèle d'exécution des données
espaces et itinéraire à plusieurs voies.

## Blocs de construction fondamentaux {#core-building-blocks}

- **`irohad`** des pairs
- **Torii** est la passerelle client et opérateur
- **Sumeragi** gère le consensus
- **Norito** est le [format binaire canonique](/fr/reference/norito.md)
- **IVM** exécute des contrats intelligents portables et un code octal
- **Kotodama** compile des documents de haut niveau `.ko` les contrats à IVM `.to` code par défaut
- **Kagami** prépare les clés, la génèse, les profils et les réseaux locaux
- **SORA Nexus aéronefs de service** ajouter Soracloud, Dans le cadre de l'accord, SoraNet, SoraFS, et
  SoraDNS pour l'hébergement d'applications, le transport de la vie privée, le stockage et la dénomination

## Modèle d'exécution {#execution-model}

Chaque changement dans l'état mondial se produit toujours par des transactions.
Les transactions comportent des instructions ou IVM code octal et Torii C'est la voie principale.
les clients les soumettent ou observent leurs effets.

- Nexus- les configurations conscientes peuvent définir plusieurs voies
- Les espaces de données isolent les charges de travail tout en restant partie du même modèle de registre
- la politique de routage détermine quelle voie et quel espace de données gérer une classe de travail

## Architecture multi-espace de données {#multi-dataspace-architecture}

Un espace de données est une frontière entre le routage et l'espace des noms, pas une blockchain séparée.
Le temps d'exécution en a encore un. `World`, un modèle de transaction et un consensus
Le pipeline. Nexus ajoute des catalogues qui indiquent au nœud comment fonctionner la partition
et comment nommer les espaces de données que ces voies servent.

Au moment de l'exécution, un espace de données est représenté par une `DataSpaceId` et
les métadonnées du catalogue. `DataSpaceId::UNIVERSAL` est réservé comme `0`; le défaut
le catalogue contient les `universal` chaque espace de données configuré a:

- un chiffre unique ID
- un alias unique tel que `universal`, `governance`, ou `zk`
- une description facultative des surfaces de l'opérateur
- un non-zéro `fault_tolerance` valeur utilisée pour mesurer les comités de relais

Les voies d'exécution et de stockage liées à ces bases de données sont les voies d
l'entrée de la voie a `LaneId`, le `DataSpaceId` Il sert, un alias,
la visibilité (`public` ou `restricted`), profil de stockage (`full_replica`,
`commitment_only`, ou `split_replica`), système de preuve et optionnel
Les données de gestion, de règlement et des métadonnées du planificateur.
la géométrie de stockage par voie du présent catalogue, y compris Kura nom des segments
et des préfixes de clés déterministes.

Le parcours est le suivant:

1. La configuration construit une validation `DataSpaceCatalog`, `LaneCatalog`, et
   `LaneRoutingPolicy`. Plusieurs voies, plusieurs espaces de données ou non par défaut
   l'itinéraire doit être `nexus.enabled = true`.
2. La file d'attente de transaction demande au routeur de la voie active
   `RoutingDecision` contenant une voie ID et espace de données ID.
3. Les règles explicites de routage peuvent être correspondantes par autorité/compte ou par instruction
   sans une règle correspondante, le routeur peut dériver l'espace de données
   domaine IDs, projections de définition des actifs, autorisations à l'échelle du espace de données;
   étapes de règlement ou la portée du compte lié de l'autorité.
4. La route résolue est vérifiée par rapport aux deux catalogues.
   Les espaces de données inconnus et les déséquilibres entre voie et espace de données sont déterministes
   erreurs de routage. Si une transaction écrit à deux espaces de données différents
   les objectifs, il est rejeté comme une route contradictoire; espace de données croisée DVP/PVP
   le règlement est effectué par la voie du coordinateur universel.
5. Sumeragi et la télémétrie maintient l'affectation visible comme voie et espace de données
   des instantanés d'activité, de retard et d'engagement.

C'est pourquoi les identifiants d'objets sont importants.
dans leur ID, par exemple `payments.universal`, afin que les écrits à la portée de domaine peuvent
Les comptes restent canoniques et sans domaine, donc le même compte
peut être liée à différentes applications sans modifier son
`AccountId`. Les définitions d'actifs peuvent contenir une projection de domaine/espace de données,
Ce qui permet aux opérations d'actifs d'hériter de la bonne route du espace de données.

Sans Nexus le nœud utilise une seule voie et la `universal`
L'espace de données. SORA Le profil le remplace par une voie à trois voies
le catalogue: `core` pour la voie publique universelle, `governance` pour la gouvernance
la circulation, et `zk` pour l'attachement à la connaissance zéro et le déploiement contractuel
Le trafic.

Ces trois défauts existent pour séparer les classes de charge de travail:

| Espace de données    | Lane est là.         | Pourquoi il existe                                                                                                                                       |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal`  | `core`       | Espace de données par défaut réservé (`DataSpaceId::UNIVERSAL == 0`) pour le trafic public ordinaire et l'acheminement en arrière.                                 |
| `governance` | `governance` | L'activité de contrôle-plan n'est donc pas mélangée à l'application générale écrites.                      |
| `zk`         | `zk`         | Lane restreint pour les preuves de connaissance zéro, les pièces jointes et le routage du déploiement contractuel, en gardant les flux de travail lourds en preuve séparés des écritures normales. |

Seulement `universal` est la ligne de base réservée. `governance` et `zk` sont SORA
les choix de profil codés dans la politique du catalogue et du routage groupé;
Les opérateurs peuvent définir un catalogue différent lorsqu'ils ont besoin d'un espace de données différent
les limites.

Sumeragi Il s'agit d'une méthode de communication qui utilise toujours la disponibilité des données et une diffusion fiable.
une partie du Iroha 3 protocole de consensus et ne peut pas être désactivé par un déploiement
le profil.

Le comportement en cours d'exécution est basé sur les fichiers de configuration et les paramètres de la chaîne.
Les variables environnementales ne sont pas des portes de caractéristiques de production.

## Lire la suite {#read-next}

- [SORA Nexus services](/fr/blockchain/sora-nexus-services.md)
- [Lancement Iroha 3](/fr/get-started/launch-iroha.md)
- [Le monde, WSV, et Kura stockage](/fr/blockchain/world.md)
- [Références de la Genèse](/fr/reference/genesis.md)
- [Torii points de fin](/fr/reference/torii-endpoints.md)
