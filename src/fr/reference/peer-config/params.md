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

## Niveau de la racine {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Chaîne ID qui doit être incluse dans chaque transaction. Utilisé pour prévenir les attaques de répétition.

Une attaque de répétition est une tentative de soumettre une transaction valide à un réseau différent de celui pour lequel elle était destinée. Étant donné que le `chain` fait partie de la charge utile des transactions signées, une transaction signée pour une chaîne est rejetée par des pairs utilisant une autre chaîne ID.

<param-table type=string env=CHAIN />

::: groupe de codes

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

La clé publique du coéquipier. Les coéquipiers validateurs de consensus doivent utiliser les clés BLS-Normales.

<param-table type="public-key" env="PUBLIC_KEY" />

::: groupe de codes

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

La clé privée du pair doit correspondre à `public_key`; les pairs validateurs de consensus doivent utiliser BLS-Les clés normales.

<param-table type="private-key" env="PRIVATE_KEY" />

::: groupe de codes

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

Liste des pairs de confiance prédéfinis.

Les validateurs de consensus doivent utiliser des clés BLS-normales. Pour chaque validateur, fournissez également une entrée correspondante [`trusted_peers_pop`](#param-trusted-peers-pop).

<param-table env="TRUSTED_PEERS">
<template #type>

Array of peer strings. Utilisez `PUBLIC_KEY@ADDRESS` lorsque l'adresse P2P est connue; le bare `PUBLIC_KEY` est également accepté et permet de découvrir l'adresse des pairs à partir du bavardage.

</template>
</param-table>

::: groupe de codes

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

Array d'objets avec les champs `public_key` et `pop_hex`

</template>
</param-table>

::: groupe de codes

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

Chemin de fichier vers la charge utile du bloc génèse signé générée par `kagami genesis sign`. Les profils générés écrivent généralement ceci comme un fichier Norito `.nrt`.

<param-table type="file-path" env="GENESIS" />

::: groupe de codes

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

::: groupe de codes

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

Adresse pour la communication p2p à des fins de consensus (sumeragi) et de synchronisation par bloc (bloc_sync).

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: groupe de codes

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

Adresse de pair à pair (externe, telle que vue par les autres pairs).

Il sera bavardé à des pairs liés afin qu'ils puissent le bavarder à d'autres pairs.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: groupe de codes

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

::: groupe de codes

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

L'intervalle de temps entre les demandes à des pairs pour le bloc le plus récent.

Le bavardage plus fréquent réduit le temps de synchronisation, mais peut surcharger le réseau.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: groupe de codes

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Nombre maximal de transactions dans un message de plaisanterie.

Une taille plus petite entraîne un temps de synchronisation plus long, mais utile si vous avez une perte élevée de paquets.

<param-table type=number default-value=500 />

::: groupe de codes

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Periode de bavardage en attente d'une transaction entre pairs.

Le bavardage plus fréquent réduit le temps de synchronisation, mais peut surcharger le réseau.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: groupe de codes

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Durée de temps après laquelle la connexion avec les pairs est interrompue si le paire est inactif.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: groupe de codes

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Adresse à laquelle le serveur Torii doit écouter et auquel le client (s) fait ses demandes.

<param-table type=socket-addr env=API_ADDRESS />

::: groupe de codes

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

Le nombre maximum d'octets dans un corps de demande brute accepté par les points d'extrémité [Torii ](/fr/reference/torii-endpoints.md).

Cette limite est utilisée pour prévenir les attaques de DOS.

<param-table>
<template #type>

Nombre (en octets)

</template>
<template #default-value>

`64_000_000` (64 millions d'octets)

</template>
</param-table>

::: groupe de codes

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Le temps pendant lequel une requête peut rester dans le magasin si elle n'est pas consultée.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: groupe de codes

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

La limite supérieure du nombre de requêtes en direct.

<param-table type=number default-value=128 />

::: groupe de codes

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

La limite supérieure du nombre de requêtes en direct pour un seul utilisateur.

<param-table type=number default-value=128 />

::: groupe de codes

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Arboriste {#logger}

### `logger.level` {#param-logger-level}

Verbosité générale en matière d'enregistrement (voir [`logger.filter`](#param-logger-filter) pour la configuration affinée).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Chaîne, valeurs possibles:

- `TRACE`: Tous les événements, y compris les opérations à faible niveau.
- `DEBUG`: Messages de débogage, utiles pour le diagnostic.
- `INFO`: Des messages d'information généraux.
- `WARN`: Avertissements qui indiquent des problèmes potentiels.
- `ERROR`: Erreurs perturbant le fonctionnement normal mais permettant la poursuite de l'exploitation.

Choisissez le niveau qui convient le mieux à votre cas d'utilisation. Consultez [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) pour plus de détails sur l'utilisation des différents niveaux de journaux.

</template>
</param-table>

::: groupe de codes

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip Mise à jour de l'heure d'exécution

Ce paramètre est soumis à une mise à jour de la configuration du temps d'exécution par l'intermédiaire des terminaux Torii de l'opérateur.

:::

### `logger.filter` {#param-logger-filter}

Filtres de journaux raffinés en plus de [`logger.level`](#param-logger-level). Permet de personnaliser la verbosité de journalement par cible.

<param-table type=string env=LOG_FILTER>
<template #type>

Chaque directive peut avoir un niveau de verbosité maximal correspondant qui permet (par exemple, sélectionne pour) des intervalles et des événements correspondants. Iroha considère que les niveaux moins exclusifs (comme `trace` ou `info`) sont plus verbeux que les niveaux plus exclusives (comme`error` ou `warn`).

A un niveau élevé, la syntaxe des directives est composée de plusieurs parties:

```
target[span{field=value}]=level
```

Pour plus de détails, voir la documentation [`tracing-subscriber`](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: groupe de codes

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info Compatibilité avec le [`logger.level`](#param-logger-level)

`logger.filter` fonctionne conjointement avec [`logger.level`](#param-logger-level) et aucun des deux ne superpose l'autre.

Par exemple, si `logger.level` est fixé à `INFO` et `logger.filter` est fixé à `iroha_core=debug`, l'ensemble de filtres résultant sera `info,iroha_core=debug` (c'est à dire: `info` pour tous les modules, `debug` pour `iroha_core`).

:::

::: tip Mise à jour de l'heure d'exécution

Ce paramètre est soumis à une mise à jour de la configuration du temps d'exécution par l'intermédiaire des terminaux Torii de l'opérateur.

:::

### `logger.format` {#param-logger-format}

Le format des journaux.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Chaîne, valeurs possibles:

- `full`: Le formatateur par défaut. Il émet des journaux lisibles par l'homme, en ligne unique pour chaque événement qui se produit, avec le contexte d'espace actuel affiché avant la représentation formattée de l'événement.
- `compact`: Une variante du formatateur par défaut, optimisée pour les longueurs de lignes courtes. Les champs du contexte d'étendue actuel sont ajoutés aux champs de l'événement formaté et les noms d'étendu ne sont pas affichés; le niveau de verbosité est abrégé à un seul caractère.
- `pretty`: Émet des journaux de plusieurs lignes extrêmement beaux, optimisés pour la lisibilité humaine. Ceci est principalement destiné à être utilisé dans le développement local et le débogage, ou pour les applications de ligne de commande, lorsque l'analyse automatisée et le stockage compact des journaux sont moins prioritaires que la lisibilité et l'attrait visuel.
- `json`: Sorties de journaux JSON délimités en nouvelle ligne. Ceci est destiné à l'utilisation dans la production avec des systèmes où les journaux structurés sont consommés comme JSON par des outils d'analyse et de visualisation. La sortie JSON n'est pas optimisée pour la lisibilité humaine.

Pour plus de détails et des résultats d'échantillonnage, voir la documentation [`tracing-subscriber` ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: groupe de codes

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura est le moteur de stockage persistant de Iroha (en japonais pour entrepôt).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Au plus N derniers blocs seront stockés dans la mémoire.

Les anciens blocs seront supprimés de la mémoire et chargés du disque si nécessaire.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: groupe de codes

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Mode d'initialisation Kura

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Chaîne, valeurs possibles:

- `strict`: validation stricte de tous les blocs
- `fast`: Initialisation rapide avec seulement des contrôles de base

</template>
</param-table>

::: groupe de codes

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Désigne le répertoire où les blocs sont stockés.

Voir aussi: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: groupe de codes

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

::: groupe de codes

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

::: groupe de codes

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

La limite supérieure du nombre de transactions en attente dans la file d'attente pour un seul utilisateur.

Utilisez cette option pour appliquer une throttling.

<param-table type=number default-value=65_536 />

::: groupe de codes

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

La transaction sera abandonnée après cette période si elle est toujours en file d'attente.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: groupe de codes

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Le commutateur de débogage uniquement pour l'exercice des chemins de manipulation de la fourchette douce Sumeragi. Laissez cela désactivé en dehors des tests contrôlés; le modifier sur un réseau de production en cours d'exécution peut amener les pairs à ne pas être d'accord sur le comportement consensuel.

<param-table type=bool default-value=false />

::: groupe de codes

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Une prise de vue {#snapshot}

Ce module est responsable de la lecture et de l'écriture d'images instantanées du [World State View](/fr/blockchain/world#world-state-view-wsv).

Les snapshots stockent un point de contrôle sérialisé du World State View afin qu'un pair puisse redémarrer sans reproduire chaque bloc de Kura. Kura reste l'historique durable des blocs et la source de vérité pour la reproduction; les snapshots sont une voie d'accélération. Lors du démarrage, Iroha vérifie les métadonnées d'instantané avec la chaîne configurée et les blocs stockés avant de décider de charger un instantané ou de revenir à la reproduction.

::: tip Éliminer les instantanés

Dans le cas où quelque chose ne va pas avec le système de snapshots, et que vous souhaitiez commencer à partir d'une page vide (en termes de snapshot), vous pouvez supprimer l'annuaire spécifié par [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Le mode dans lequel fonctionne le système Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Chaîne, valeurs possibles:

- `read_write`: Iroha crée des instantanés avec une période spécifiée par [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Lors du démarrage, Iroha lit un instantané existant (le cas échéant) et vérifie qu'il est à jour avec le stockage de blocs.
- `readonly`: similaire à `read_write` mais Iroha ne crée aucun instantané.
- `disabled`: Iroha ne crée pas de nouveaux instantanés ni ne lit un instantané existant au démarrage.

</template>
</param-table>

::: groupe de codes

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

La fréquence des prises de vue.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: groupe de codes

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

L'annuaire où stocker les instantanés.

Voir aussi: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: groupe de codes

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## Télémétrie {#telemetry}

La télémétrie exporte le diagnostic des pairs vers un collecteur de télémétrique externe. Configurez à la fois `telemetry.name` et `telemetry.url` lorsqu'un paire doit faire rapport à un collecteur; omettez la section lorsque la téléméthérie n'est pas utilisée.

`name` et `url` doivent être associés.

Toutes les sections `telemetry` sont facultatives.

### `telemetry.name` {#param-telemetry-name}

Le nom du nœud sera affiché sur la télémétrie.

<param-table type=string />

::: groupe de codes

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Le WebSocket URL du collecteur de télémétrie.

<param-table type=string />

::: groupe de codes

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

La période minimale d'attente avant la reconnexion.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: groupe de codes

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

L'exponente maximale de 2 qui est utilisée pour augmenter le délai entre les reconnections.

<param-table type=number default-value=4 />

::: groupe de codes

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Le chemin du fichier pour écrire la télémétrie à

<param-table type=file-path />

::: groupe de codes

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
