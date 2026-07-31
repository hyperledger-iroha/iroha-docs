---
translation_locale: fr
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Paramètres de configuration {#configuration-parameters}

[toc]

## Niveau de racine {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

La chaîne ID Il doit être inclus dans chaque transaction.

Une attaque de répétition est une tentative de soumettre une transaction valide à un autre
La Commission a décidé de mettre en place un programme d'élargissement des `chain` fait partie de
la charge utile des transactions signées, une transaction signée pour une chaîne est rejetée
par des pairs qui utilisent une autre chaîne ID.

<param-table type=string env=CHAIN />

::: code-group

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

La clé publique de la coéquipière. BLS- Des clés normales.

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

La clé privée de la paire doit correspondre `public_key`; les pairs validateurs de consensus
doit être utilisé BLS- Des clés normales.

<param-table type="private-key" env="PRIVATE_KEY" />

::: code-group

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

Liste des pairs de confiance prédéfinis.

Les validateurs de consensus doivent BLS- Pour chaque validateur, aussi
fournir une correspondance [`trusted_peers_pop`](#param-trusted-peers-pop) Entrée.

<param-table env="TRUSTED_PEERS">
<template #type>

Array de chaînes parallèles. `PUBLIC_KEY@ADDRESS` lorsque le P2P l'adresse est connue;
à nu `PUBLIC_KEY` est également accepté et permet de découvrir l'adresse des pairs à partir
- Je ne sais pas.

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers = [
    "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
    "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338",
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS='[
  "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
  "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338"
]'
```

:::

### `trusted_peers_pop` {#param-trusted-peers-pop}

BLS les entrées de preuve de possession pour les pairs de confiance du validateur.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Array d'objets avec `public_key` et `pop_hex` champs

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers_pop = [
  { public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2", pop_hex = "8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08" },
  { public_key = "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77", pop_hex = "a14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913" },
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS_POP='[
  {"public_key":"ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2","pop_hex":"0x8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08"},
  {"public_key":"ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77","pop_hex":"0xa14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913"}
]'
```

:::

## Genèse {#genesis}

### `genesis.file` {#param-genesis-file}

Voie de fichier vers la charge utile du bloc génèse signé générée par `kagami genesis sign`.
Les profils générés écrivent généralement ceci comme un Norito `.nrt` Le dossier.

<param-table type="file-path" env="GENESIS" />

::: code-group

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

La clé publique de la paire de clés génèse.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: code-group

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## Réseau {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Adresse pour la communication p2p pour consensus (sumeragi) et synchronisation de bloc (bloc)_synchronisation des objectifs.

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: code-group

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

Adresse de pair à pair (externe, telle que vue par d'autres pairs).

Ils seront bavardés à des pairs connectés afin qu'ils puissent le bavarder à d'autres pairs.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: code-group

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

Le nombre de blocs qui peuvent être envoyés dans un seul message de synchronisation.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

L'intervalle de temps entre les demandes aux pairs pour le bloc le plus récent.

Les bavardages plus fréquents réduisent le temps de synchronisation, mais peuvent surcharger le réseau.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Nombre maximal de transactions dans un message de plaisanterie.

Une taille plus petite permet un temps de synchronisation plus long, mais utile si vous avez une perte de paquets élevée.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Période de bavardage en attendant la transaction entre pairs.

Les bavardages plus fréquents réduisent le temps de synchronisation, mais peuvent surcharger le réseau.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Durée de temps après laquelle la connexion avec le partenaire est interrompue si le partenaire n'est pas en activité.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Adresse à laquelle le Torii Le serveur doit écouter et à qui le client (s) fait ses demandes.

<param-table type=socket-addr env=API_ADDRESS />

::: code-group

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

Le nombre maximal d'octets dans un corps de demande brute accepté par le
[Torii points de fin](/fr/reference/torii-endpoints.md).

Cette limite est utilisée pour prévenir DOS Des attaques.

<param-table>
<template #type>

Nombre (de octets)

</template>
<template #default-value>

`64_000_000` 64 millions de octets

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Le temps qu'une requête peut rester dans le magasin si elle n'est pas consultée.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

La limite supérieure du nombre de requêtes en direct.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Limite supérieure du nombre de requêtes en direct pour un seul utilisateur.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Le logger {#logger}

### `logger.level` {#param-logger-level}

_Général_ verbosité de saisie (voir [`logger.filter`](#param-logger-filter) pour une configuration raffinée).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Chaîne, valeurs possibles:

- `TRACE`: Tous les événements, y compris les opérations de bas niveau.
- `DEBUG`: Messages de débogage, utiles pour le diagnostic.
- `INFO`: Messages d'information généraux.
- `WARN`: Des avertissements indiquant des problèmes potentiels.
- `ERROR`: Erreurs qui perturbent le fonctionnement normal mais permettent la poursuite du fonctionnement.

Choisissez le niveau qui vous convient le mieux.
[Débit de débit en pile](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) pour les autres
détails sur la façon d'utiliser les différents niveaux de journaux.

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip Mise à jour de l'heure d'exécution

Ce paramètre est soumis à une mise à jour de la configuration du temps d'exécution Torii les points d'extrémité de l'opérateur.

:::

### `logger.filter` {#param-logger-filter}

Filtres de journaux raffinés en plus [`logger.level`](#param-logger-level). Permet de personnaliser la verbosité d'enregistrement
par-_cible_.

<param-table type=string env=LOG_FILTER>
<template #type>

Chaque directive peut avoir une verbosité maximale correspondante.
_niveau_ qui permettent (par exemple, _sélectionne pour_) et des événements correspondants. Iroha considère des niveaux moins exclusifs (comme
`trace` ou `info`Il faut que les niveaux plus verbaux soient supérieurs aux niveaux plus exclusifs (par exemple: `error` ou `warn`).

À un niveau élevé, la syntaxe des directives se compose de plusieurs parties:

```
target[span{field=value}]=level
```

Pour plus de détails, voir
[`tracing-subscriber` documentation](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info Compatibilité avec [`logger.level`](#param-logger-level)

`logger.filter` ouvrages _ensemble_ avec [`logger.level`](#param-logger-level) et aucun ne renverse l'autre.

Par exemple, si `logger.level` est fixé à `INFO` et `logger.filter` est fixé à `iroha_core=debug`, le filtre résultant
l'ensemble sera `info,iroha_core=debug` (c'est à dire: `info` pour tous les modules, `debug` pour `iroha_core`).

:::

::: tip Mise à jour de l'heure d'exécution

Ce paramètre est soumis à une mise à jour de la configuration du temps d'exécution Torii les points d'extrémité de l'opérateur.

:::

### `logger.format` {#param-logger-format}

Le format des journaux.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Chaîne, valeurs possibles:

- `full`: Le formatateur par défaut. Cela émet des journaux lisibles par l'homme, en une seule ligne pour chaque événement qui se produit, avec le
  le contexte d'espace actuel affiché avant la représentation formatée de l'événement.
- `compact`: Une variante du formatateur par défaut, optimisée pour les longueurs de lignes courtes.
  sont ajoutés aux champs de l'événement formaté et les noms d'espace ne sont pas affichés; le niveau de verbosité est abrégé en
  Un seul personnage.
- `pretty`: Il émet des journaux à plusieurs lignes, extrêmement beaux et optimisés pour la lisibilité humaine.
  utilisés dans le développement local et le débogage, ou pour les applications de ligne de commande, où l'analyse automatisée et la compactisation
  le stockage des journaux est moins prioritaire que la lisibilité et l'attrait visuel.
- `json`: Résultats délimités en nouvelle ligne JSON Les logs sont destinés à une utilisation de production avec des systèmes où les logs structurés
  sont consommées comme JSON Il s'agit d'un outil d'analyse et de visualisation. JSON La production n'est pas optimisée pour la lisibilité humaine.

Pour plus de détails et d'échantillons, voir
[`tracing-subscriber` documentation](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

_Kura_ est le moteur de stockage persistant de Iroha (en japonais pour _entrepôt_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Au plus N derniers blocs seront stockés dans la mémoire.

Les blocs plus anciens seront supprimés de la mémoire et chargés du disque si nécessaire.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: code-group

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura mode d'initialisation

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Chaîne, valeurs possibles:

- `strict`: validation stricte de tous les blocs
- `fast`: Initialisation rapide avec seulement des contrôles de base

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Indique le répertoire où les blocs sont stockés.

Voir aussi: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

Drapeau pour permettre l'impression de nouveaux blocs à la console.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: code-group

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## La file d'attente {#queue}

### `queue.capacity` {#param-queue-capacity}

La limite supérieure du nombre de transactions en attente dans la file d'attente.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

La limite supérieure du nombre de transactions en attente dans la file d'attente pour un seul utilisateur.

Utilisez cette option pour appliquer l'étranglement.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

La transaction sera annulée après cette période si elle est toujours en file d'attente.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Commutateur de débogage pour l'exercice Sumeragi Les chemins de manutention à fourchettes douces.
désactivé en dehors des essais contrôlés; le remplacer sur un réseau de production en cours d'exécution
peut faire discuter les pairs sur le comportement consensuel.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Une prise de vue {#snapshot}

Ce module est chargé de lire et d'écrire des instantanés
[Le point de vue sur l'état du monde](/fr/blockchain/world#world-state-view-wsv).

Les captures instantanées stockent un point de contrôle sérialisé du World State View afin qu'un paire puisse
redémarrer sans réinitialiser chaque bloc de Kura. Kura reste le bloc durable
l'histoire et la source de vérité pour la répétition; les instantanés sont un chemin d'accélération.
Au démarrage, Iroha Vérifie les métadonnées instantanées par rapport à la chaîne configurée et au
les blocs stockés avant de décider de télécharger un instantané ou de revenir à la reproduction.

::: tip Effacer les instantanés

Dans le cas où quelque chose ne va pas avec le système d'instantanés, et vous voulez commencer à partir d'une page vide (en termes de
les instantanés), vous pouvez supprimer le répertoire spécifié par [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Le mode de fonctionnement du système Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Chaîne, valeurs possibles:

- `read_write`: Iroha crée des instantanés avec une période spécifiée par:
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Au démarrage, Iroha lire une capture instantanée existante (le cas échéant)
  et vérifie qu'il est à jour avec le stockage des blocs.
- `readonly`: Par exemple: `read_write` mais Iroha Ça ne crée pas de photos.
- `disabled`: Iroha ne crée pas de nouveaux instantanés et ne lit pas un instantané existant lors du démarrage.

</template>
</param-table>

::: code-group

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

La fréquence des instantanés.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Directory où stocker des instantanés.

Voir aussi: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## Télémétrie {#telemetry}

Télémétrie exporte les diagnostics par pairs à un collecteur de télémétriez externe.
les deux `telemetry.name` et `telemetry.url` lorsqu'un coéquipier doit rendre compte à un
le collecteur; omettre la section lorsque la télémétrie n'est pas utilisée.

`name` et `url` Ils doivent être coupés.

Tout le monde `telemetry` La section est facultative.

### `telemetry.name` {#param-telemetry-name}

Le nom du nœud doit être affiché sur la télémétrie.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Les WebSocket URL de la collectionneur de télémétrie.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

La période minimale d'attente avant la reconnexion.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

L'exponent maximal de 2 qui est utilisé pour augmenter le retard entre les reconnections.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Le filepath pour écrire la télémétrie de développement à

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
