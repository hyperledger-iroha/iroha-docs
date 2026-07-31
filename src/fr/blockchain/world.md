---
translation_locale: fr
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Le monde {#world}

`World` est l'entité globale qui contient d'autres entités. `World`
est constitué de:

- Iroha [paramètres de configuration](/fr/guide/configure/client-configuration.md)
- pairs inscrits
- domaines enregistrés
- enregistré [déclencheurs](/fr/blockchain/triggers.md)
- enregistré
  [les rôles](/fr/blockchain/permissions.md#permission-groups-roles)
- enregistré
  [Définitions de jetons d'autorisation](/fr/blockchain/permissions.md#permission-tokens)
- jetons d'autorisation pour tous les comptes
- [la chaîne des validateurs de temps d'exécution](/fr/blockchain/permissions.md#runtime-validators)

Lorsque les domaines, les pairs ou les rôles sont enregistrés ou non enregistrés, le `World`
est la cible du (non) registre
[instruction](/fr/blockchain/instructions.md).

## Le point de vue mondial sur l'état (WSV) {#world-state-view-wsv}

World State View est la représentation en mémoire de la blockchain actuelle
Il s'agit notamment de la `World`, les hashs de bloc engagés, les indices des transactions,
Les charges utiles de bloc complet sont desservies à partir de
Kura au lieu d'être dupliqué comme mutable WSV les données.

Les WSV est l'état où les requêtes sont lues et que l'exécution du bloc mutera.
L'historique durable est stocké dans les livres de la Bible.
[Kura](#kura-storage), et le WSV peut être reconstruit à partir de Kura des blocs ou chargés
de l'état d'un instantané et puis pris par la lecture plus récente Kura Les blocs.

### C' est quoi ? WSV Les traces {#what-the-wsv-tracks}

Les WSV est plus large que le `World` En pratique, il contient:

- le `World`: Paramètres, pairs, domaines, comptes, actifs, NFTs, les rôles,
  permissions, déclencheurs, données d'exécution et autres modèles de données enregistrés
  objets
- hashes de bloc engagés et la plus récente hauteur engagée
- Indices de transaction à bloc utilisés par les requêtes et les reçus
- la topologie actuelle et précédente de l'engagement utilisée par consensus
- indices de mémoire dérivés de blocs engagés, tels que la disponibilité des données
  les engagements, les curseurs de réception, les intentions de pin et les marqueurs de projection de requête
- les instantanés de configuration de temps d'exécution nécessaires à l'exécution des blocs déterministes,
  tels que la cryptographie, la gouvernance, les pipelines, le contenu, le règlement et Nexus
  réglages

Les requêtes reçoivent normalement une réponse en lecture seule `StateView` Ces structures ont été éliminées.
view est un instantané cohérent pour l'exécution de requête; il ne permet pas direct
mutation de la WSV.

### Comment le WSV Les changements {#how-the-wsv-changes}

WSV Les modifications sont mises en scène avant d'être engagées.
la couverture de l'état à l'échelle des blocs, et chaque transaction acceptée applique son
les instructions dans une superposition à l'échelle des transactions.
les transactions sont exécutées dans le même contexte de bloc.
les effets de la transaction pour le bloc.

Après que le consensus a engagé un bloc, le paire enquiert d'abord le bloc engagé
dans Kura. Si cette étape d'enchère échoue, le WSV n'est pas avancée et le
La boucle de consensus réessaye ou requiert la charge utile du bloc.
accepté dans le Kura La file d'attente Iroha s'applique aux effets de bloc après exécution,
les indices dérivés, et engage la mise en scène WSV modifications au titre d'un
Les lecteurs n'observent pas une
Le bloc.

La règle essentielle du consensus est que les pairs doivent atteindre la même WSV de la
les mêmes blocs engagés. WSV les instructions de contournement des données et
les pairs ne seront pas d'accord pendant la validation ou la répétition.

### Démarrer et réécrire {#startup-and-replay}

Au démarrage, Iroha démarre Kura Il apprend d'abord la hauteur du bloc stocké.
Il essaie ensuite de charger un instantané d'état.
l'instantané est rejeté comme récupérable, Iroha crée un état initial et
remplacement des blocs engagés de Kura. Si une prise de vue est valide mais en arrière Kura,
seule la plage d'altitude manquante est reproduite.

La reproduction valide chaque bloc stocké, reconstruit la liste d'engagement pour ce
la hauteur, s'applique les effets de blocage à WSV, et s'engage à
Cela signifie que Kura est la voie de récupération pour le WSV, alors que les instantanés sont
une optimisation qui évite de reproduire toute la chaîne.

## Kura Le stockage {#kura-storage}

_Kura_ est Iroha Il stocke des blocs signés et
Il ne stocke pas une seconde copie mutable de la WSV.

Kura le stockage est enraciné à [`kura.store_dir`](/fr/reference/peer-config/params.md#param-kura-store-dir).
Dans cette racine, les données de bloc sont divisées par voie ou segment.
pour un segment sont:

| Chemin | Le but |
| --- | --- |
| `blocks/<segment>/blocks.data` | Leur coordonnées Norito- Charges de blocs signés. |
| `blocks/<segment>/blocks.index` | Taille fixe `(start, length)` les entrées qui la hauteur de bloc de carte à octets dans `blocks.data`. |
| `blocks/<segment>/blocks.hashes` | Bloquez les hashes par hauteur pour une recherche rapide et une validation de démarrage. |
| `blocks/<segment>/blocks.count.norito` | Marqueur d'engagement durable enregistrant le nombre d'entrées de l'indice de bloc sûres à utiliser. |
| `blocks/<segment>/da_blocks/` | Charges utiles de bloc évacuées conservées à l'extérieur `blocks.data` Quand l'application du budget de disque déplace des corps anciens hors du dossier chaud. |
| `blocks/<segment>/pipeline/sidecars.norito` et `sidecars.index` | Les voitures de récupération du pipeline sont claviées par hauteur. |
| `blocks/<segment>/pipeline/roster_sidecars.norito` et `roster_sidecars.index` | Récemment, des couloirs de bord à commande utilisés par la synchronisation et le replay de bloc. |
| `merge_ledger/<segment>.log` | Les entrées du registre de fusion alignées sur les blocs engagés. |
| `commit-rosters.norito` | Les certificats d'engagement et les points de contrôle de validation sont conservés pour les blocs récents. |

Kura conserve un vecteur compact en mémoire pour la chaîne: chaque hauteur a le
Le bloc hash et, optionnellement, le corps du bloc.
et le plus récent [`kura.blocks_in_memory`](/fr/reference/peer-config/params.md#param-kura-blocks-in-memory)
Les blocs non génétiques gardent leur corps dans la mémoire.
a été retiré de la mémoire et rechargé Kura les dossiers lorsque cela est nécessaire.

Lors de l'initialisation, `strict` le mode valide les blocs stockés à partir du bloc
les charges utiles et réécrit le fichier hash si nécessaire. `fast` mode démarre à partir de stocké
les méta-données hash/index et reviennent à une initialisation stricte si ces métadonnées
est incompatible. Kura détecte une queue corrompue, il prune le stockage à la
le dernier bloc validé.

Kura l'écrivain ajoute des blocs
les charges utiles, les hashes et les entrées d'index, puis avance le marqueur de compte durable
Lorsque la mise en œuvre du budget disque est
actives, Kura peut purger des segments retraités ou évacuer les corps de blocs plus âgés dans
`da_blocks/` tout en gardant les hash et les entrées d'index disponibles pour validation
et à la recherche.
