---
translation_locale: fr
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Monde {#world}

`World` est l'entité mondiale qui contient d'autres entités. Le `World` se compose de :

- Iroha [paramètres de configuration](/fr/guide/configure/client-configuration.md)
- pairs de réseau enregistrés
- domaines enregistrés
- enregistré [déclencheurs](/fr/blockchain/triggers.md)
- enregistré [rôles](/fr/blockchain/permissions.md#permission-groups-roles)
- enregistré [définitions de jeton d'autorisation](/fr/blockchain/permissions.md#permission-tokens)
- jetons d'autorisation pour tous les comptes
- [la chaîne de validateurs d'exécution de logiciels](/fr/blockchain/permissions.md#runtime-validators)

Lorsque des domaines, des pairs réseau ou des rôles sont enregistrés ou désenregistrés, le `World` est la cible de l'([instruction](/fr/blockchain/instructions.md)enregistrement).

## Vue de l'État mondial (WSV) {#world-state-view-wsv}

La vue de l'état mondial est la représentation en mémoire de l'état actuel de la blockchain. Elle inclut le `World`, les hachages cryptographiques des blocs soumis, les index des transactions et les pairs du réseau élus pour l'époque actuelle. Les charges utiles complètes des blocs sont servies à partir de Kura plutôt que dupliquées en tant que données WSV modifiables.

Le WSV est l'état que les requêtes lisent et que l'exécution de bloc modifie. Ce n'est pas en soi la source de vérité durable. L'historique durable est stocké dans [Kura](#kura-storage), et le WSV peut être reconstruit à partir des blocs Kura ou chargé à partir d’une vue de données à un instant donné, puis rattrapé en rejouant les blocs Kura plus récents.

### Quels sont les WSV Pistes {#what-the-wsv-tracks}

Le WSV est plus large que l'objet `World`. En pratique, il contient :

- le `World` : paramètres, pairs du réseau, domaines, comptes, actifs, NFTs, rôles, permissions, déclencheurs, données de l'exécuteur et autres objets du modèle de données enregistrés
- blocs engagés des hachages cryptographiques et la dernière hauteur engagée
- index de transaction à bloc utilisés par les requêtes et les enregistrements de résultats du protocole
- la topologie des commits actuelle et précédente utilisée par le consensus
- index en mémoire dérivés des blocs engagés, tels que les engagements de disponibilité des données, les curseurs d’enregistrement des résultats du protocole, les intentions de verrouillage et les marqueurs de projection de requête
- vues de données ponctuelles de configuration d'exécution logicielle nécessaires pour l'exécution déterministe des blocs, telles que la cryptographie, la gouvernance, le pipeline de traitement, le contenu, le règlement et les paramètres Nexus

Les requêtes reçoivent normalement un `StateView` en lecture seule sur ces structures. Une vue est une vue cohérente des données à un instant donné pour l'exécution des requêtes ; elle ne permet pas la modification directe du WSV.

### Comment le WSV change {#how-the-wsv-changes}

WSV les modifications sont mises en scène avant d'être validées. L'exécution du bloc crée une superposition d'état à portée de bloc, et chaque transaction acceptée applique ses instructions dans un Superposition limitée à la transaction. Les déclencheurs de données invoqués par ces transactions s'exécutent dans le même contexte de bloc. Les déclencheurs temporels sont évalués après les effets de la transaction pour le bloc.

Après que le consensus valide un bloc, le pair du réseau met d'abord le bloc validé en file d'attente dans Kura. Si cette étape de mise en file d'attente échoue, le WSV n'est pas avancé et la boucle de consensus réessaye ou remet en file d'attente la charge utile du bloc. Lorsque le bloc est accepté dans la file d'attente de Kura, Iroha applique les effets du bloc après exécution, met à jour les index dérivés et valide les modifications mises en attente de WSV sous un verrou de vue d'état. Cela empêche les lecteurs d'observer un bloc partiellement validé.

La règle critique de consensus est que les pairs du réseau doivent atteindre le même WSV à partir des mêmes blocs engagés. Les modifications locales directes des données WSV contournent les instructions et feront que les pairs du réseau ne seront pas d'accord lors de la validation ou de la relecture.

### Démarrage et Relecture {#startup-and-replay}

Au démarrage, Iroha initialise d'abord Kura et apprend la hauteur de bloc stockée. Il tente ensuite de charger un instantané de l'état. Si aucune vue des données à un moment précis n'est disponible, ou si une vue des données à un moment précis est rejetée comme récupérable, Iroha crée un état initial et rejoue les blocs validés à partir de Kura. Si une vue des données à un instant précis est valide mais en retard par rapport à Kura, seule la plage de hauteur manquante est rejouée.

Replay valide chaque bloc stocké, reconstruit la liste des commits pour cette hauteur, applique les effets du bloc au WSV, et valide l'état résultant. Cela signifie que Kura est le chemin de récupération pour le WSV, tandis que les vues de données à un instant donné sont une optimisation qui évite de rejouer toute la chaîne.

## Kura Stockage {#kura-storage}

Kura est le stockage de blocs persistant de Iroha. Il stocke des blocs signés et des métadonnées de récupération. Il ne stocke pas une seconde copie mutable du WSV.

Kura le stockage est enraciné à [`kura.store_dir`](/fr/reference/peer-config/params.md#param-kura-store-dir). Dans cette racine, les données de bloc sont divisées par voie d'exécution ou segment. Les fichiers principaux d'un segment sont :

|Chemin|But|
| --- | --- |
| `blocks/<segment>/blocks.data` |Charges utiles de blocs signés encadrés Norito contigus.|
| `blocks/<segment>/blocks.index` |Entrées de taille fixe `(start, length)` qui correspondent à la hauteur du bloc aux octets dans `blocks.data`.|
| `blocks/<segment>/blocks.hashes` |Hachages de blocs par hauteur pour une recherche rapide et la validation au démarrage.|
| `blocks/<segment>/blocks.count.norito` |Marqueur d'engagement durable enregistrant combien d'entrées d'index de blocs sont sûres à utiliser.|
| `blocks/<segment>/da_blocks/` |Les charges utiles des blocs expulsés sont conservées à l'extérieur `blocks.data` lorsque l'application du budget disque déplace les anciens corps hors du fichier chaud.|
| `blocks/<segment>/pipeline/sidecars.norito` et `sidecars.index` |Enregistrements auxiliaires de récupération du pipeline, indexés par hauteur de bloc.|
| `blocks/<segment>/pipeline/roster_sidecars.norito` et `roster_sidecars.index` |Enregistrements auxiliaires récents de la liste des commits utilisés par la synchronisation des blocs et la relecture.|
| `merge_ledger/<segment>.log` |Entrées du grand livre de fusion alignées avec les blocs engagés.|
| `commit-rosters.norito` |Certificats de commit conservés et points de contrôle des validateurs pour les blocs récents.|

Kura conserve un vecteur compact en mémoire pour la chaîne : chaque hauteur contient le hachage cryptographique du bloc et, éventuellement, le corps du bloc. Le bloc de genèse de la blockchain reste mis en cache, et le plus récent [`kura.blocks_in_memory`](/fr/reference/peer-config/params.md#param-kura-blocks-in-memory) les blocs non-génésiques gardent leurs corps en mémoire. Les corps de blocs plus anciens sont supprimés de la mémoire et rechargés à partir de Kura fichiers lorsque nécessaire.

Lors de l'initialisation, le mode `strict` valide les blocs stockés à partir des charges de blocs et réécrit le fichier de hachage cryptographique si nécessaire. Le mode `fast` commence à partir des données stockées métadonnées de hachage/index et revient à une initialisation stricte si ces métadonnées sont incohérentes. Si Kura détecte une queue corrompue, il tronque le stockage jusqu'au dernier bloc validé.

Kura écrit de nouveaux blocs via un écrivain en arrière-plan. L'écrivain ajoute les charges utiles des blocs, les hachages cryptographiques et les entrées d'index, puis fait progresser le marqueur de nombre durable selon la politique fsync configurée. Lorsque l'application du quota disque est active, Kura peut purger les segments désaffectés ou évincer les anciens blocs de données dans `da_blocks/` tout en gardant les hachages cryptographiques et les entrées d'index disponibles pour la validation et la recherche.
