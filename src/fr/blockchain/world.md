---
translation_locale: fr
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Le monde {#world}

`World` est l'entité globale qui contient d'autres entités. `World` est composé de:

- Iroha [paramètres de configuration](/fr/guide/configure/client-configuration.md)
- les pairs inscrits
- domaines enregistrés
- des déclencheurs enregistrés [ ](/fr/blockchain/triggers.md)
- les rôles enregistrés [](/fr/blockchain/permissions.md#permission-groups-roles)
- enregistré [Définitions de jetons d'autorisation](/fr/blockchain/permissions.md#permission-tokens)
- jetons d'autorisation pour tous les comptes
- [la chaîne des validateurs de temps d'exécution ](/fr/blockchain/permissions.md#runtime-validators)

Lorsque des domaines, des pairs ou des rôles sont enregistrés ou non enregistrés, le `World` est la cible de l'instruction [ sur (non) le registre ](/fr/blockchain/instructions.md).

## Vue de l'État mondial (WSV) {#world-state-view-wsv}

World State View est la représentation en mémoire de l'état actuel de la blockchain. Il comprend les `World`, les hashs de bloc engagés, les indices de transaction et les pairs élus pour l'époque actuelle. Les charges utiles des blocs entiers sont servies à partir de Kura plutôt que dupliquées comme données mutables WSV.

Les États membres WSV C'est l'état où les requêtes sont lues et que l'exécution de blocage mutera. L' historique durable est stocké dans [Kura](#kura-storage), et le WSV peuvent être reconstruites à partir de Kura blocs ou chargés à partir d'une capture instantanée de l'état et ensuite pris en charge par la lecture plus récente Kura Les blocs.

### Quelles sont les traces WSV {#what-the-wsv-tracks}

Le WSV est plus large que l'objet `World` et contient en pratique:

- le `World`: paramètres, pairs, domaines, comptes, actifs, NFTs, rôles, autorisations, déclencheurs, données de l'exécuteur et autres objets enregistrés du modèle de données
- hashes de blocs engagés et la plus récente hauteur engagée
- Indices de transaction à blocage utilisés par les requêtes et les reçus
- la topologie des engagements actuelle et précédente utilisée par consensus
- indices de mémoire dérivés de blocs engagés, tels que les engagements en matière de disponibilité des données, les curseurs de réception, les intentions de pin et les marqueurs de projection de requête
- les instantanés de configuration en temps d'exécution nécessaires à l'exécution des blocs déterministes, tels que la cryptographie, la gouvernance, le pipeline, le contenu, le règlement et les paramètres Nexus

Les requêtes reçoivent normalement une seule lecture `StateView` sur ces structures. Une vue est un instantané cohérent pour l'exécution de la requête; elle ne permet pas une mutation directe de la WSV.

### Comment le WSV change {#how-the-wsv-changes}

Les modifications WSV sont en phase avant d'être engagées. L'exécution de bloc crée une superposition d'état à l'échelle du bloc, et chaque transaction acceptée applique ses instructions dans une superposition à l' échelle de la transaction. Les déclencheurs de temps sont évalués après les effets des transactions pour le bloc.

Une fois que le consensus a engagé un bloc, le peer requiert d'abord le bloc engagé dans Kura. Si cette étape de réquisition échoue, le WSV n'est pas avancé et la boucle du consensus tente à nouveau ou requiert la charge utile du bloc. Lorsque le bloc est accepté dans la file d'attente de Kura, Iroha applique les effets du bloc post-exécution, met à jour les indices dérivés et commet les changements en étapes WSV sous un verrou d'état. Cela empêche les lecteurs d'observer un bloc partiellement engagé.

La règle essentielle du consensus est que les pairs doivent atteindre la même WSV Les éditions locales directes vers WSV Les données contournent les instructions et font que les pairs ne sont pas d'accord pendant la validation ou la reproduction.

### Le démarrage et la répétition {#startup-and-replay}

Lors du démarrage, Iroha initialise d'abord Kura et apprend la hauteur de bloc stockée. Il essaie ensuite de charger un instantané d'état. Si aucun instantané n'est disponible, ou si un instant est rejeté en tant que récupérable, Iroha crée un état initial et remplace les blocs engagés à partir de Kura. Si une prise de vue instantanée est valide mais derrière Kura, seule la plage d'altitude manquante est reproduite.

Replay valide chaque bloc stocké, reconstruit la liste de commit pour cette hauteur, applique les effets de bloc au WSV et commande l'état résultant. Cela signifie que Kura est le chemin de récupération du WSV, tandis que les instantanés sont une optimisation qui évitent la répétition de toute la chaîne.

## Kura Le stockage {#kura-storage}

Kura est Iroha Il stocke des blocs signés et des métadonnées de récupération. WSV.

Le stockage de Kura est enraciné à [`kura.store_dir`](/fr/reference/peer-config/params.md#param-kura-store-dir).

|Le chemin .|Objectif |
| --- | --- |
|`blocks/<segment>/blocks.data` |Charges de bloc signées en cadres Norito contigus. |
|`blocks/<segment>/blocks.index` |Les entrées de taille fixe `(start, length)` indiquent la hauteur du bloc de carte en octets dans `blocks.data`. |
|`blocks/<segment>/blocks.hashes` |Bloquer les hashes par hauteur pour une recherche rapide et une validation de démarrage. |
|`blocks/<segment>/blocks.count.norito` |Marqueur d'engagement durable enregistrant le nombre d'entrées d'index de bloc qui sont sûres à utiliser. |
|`blocks/<segment>/da_blocks/` |Charges utiles de bloc évacuées gardées à l'extérieur `blocks.data` lorsque la mise en œuvre du budget disque déplace les corps anciens hors du fichier chaud. |
|`blocks/<segment>/pipeline/sidecars.norito` et `sidecars.index` |Les chariots de récupération des pipelines sont clés en fonction de la hauteur du bloc.|
|`blocks/<segment>/pipeline/roster_sidecars.norito` et `roster_sidecars.index` |Récemment utilisés par la synchronisation et le replay de blocs. |
|`merge_ledger/<segment>.log` |Les entrées du registre de fusion alignées sur les blocs engagés. |
|`commit-rosters.norito` |Les certificats d'engagement et les points de contrôle de validation sont conservés pour les blocs récents. |

Kura conserve un vecteur compact en mémoire pour la chaîne: chaque hauteur a le bloc hash et, optionnellement, le corps du bloc. Le bloc de génèse reste caché, et les derniers blocs non-génésis [ `kura.blocks_in_memory`](/fr/reference/peer-config/params.md#param-kura-blocks-in-memory) gardent leurs corps dans la mémoire. Les corps de blocs plus anciens sont retirés de la mémoire et rechargés à partir des fichiers Kura si nécessaire.

Au cours de l'initialisation, le mode `strict` valide les blocs stockés des charges utiles du bloc et réécrit le fichier hash si nécessaire. Le mode `fast` commence à partir de métadonnées hash/index stockées et revient à une initialisation stricte si ces métadonnées sont incohérentes. Si Kura détecte une queue corrompu, il prune le stockage jusqu'au dernier bloc validé.

Kura écrit de nouveaux blocs à travers un rédacteur d'arrière-plan. L'écrivain ajoute des charges utiles de bloc, des haches et des entrées d'index, puis fait avancer le marqueur de compte durable selon la politique fsync configurée. Lorsque l'application du budget des disques est active, Kura peut éliminer les segments retirés ou expulser les corps de blocs plus anciens dans `da_blocks/` tout en gardant les hashes et les entrées d'index disponibles pour la validation et la recherche.
