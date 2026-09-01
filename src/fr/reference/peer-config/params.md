---
translation_locale: fr
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: bing-translator-llm

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Paramètres de configuration {#configuration-parameters}

[[sommaire]]

## Niveau racine {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ID de chaîne qui doit être inclus dans chaque transaction. Utilisé pour prévenir les attaques par rejeu.

Une attaque par rejeu est une tentative de soumettre une transaction valide à un réseau différent de celui pour lequel elle était destinée. Comme le `chain` fait partie de la charge utile signée de la transaction, une transaction signée pour une chaîne est rejetée par les nœuds du réseau qui utilisent un autre identifiant de chaîne.

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

Clé publique du pair du réseau. Les pairs du réseau validateur du consensus doivent utiliser des clés BLS-Normales.

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

Clé privée du pair du réseau. Elle doit correspondre à `public_key` ; les pairs du réseau validateur de consensus doivent utiliser des clés BLS-Normales.

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

Liste des pairs réseau de confiance prédéfinis.

Les validateurs de consensus doivent utiliser BLS-Clés normales des pairs du réseau. Pour chaque validateur, fournissez également une correspondance [`trusted_peers_pop`](#param-trusted-peers-pop) entrée.

<param-table env="TRUSTED_PEERS">
<template #type>

Tableau de chaînes de pairs réseau. Utilisez `PUBLIC_KEY@ADDRESS` lorsque l'adresse P2P est connue ; le simple `PUBLIC_KEY` est également accepté et permet à l'adresse du pair réseau d'être découverte via le gossip.

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

BLS entrées de preuve de possession pour les pairs du réseau de confiance du validateur.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Tableau d'objets avec les champs `public_key` et `pop_hex`

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

## genèse de la blockchain {#genesis}

### `genesis.file` {#param-genesis-file}

Chemin du fichier vers la charge utile du bloc genesis de la blockchain signé généré par `kagami genesis sign`. Les profils générés écrivent couramment ceci comme un fichier Norito `.nrt`.

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

Clé publique de la paire de clés genesis de la blockchain.

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

Adresse pour la communication p2p à des fins de consensus (sumeragi) et de synchronisation de blocs (block_sync).

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

Adresse pair-à-pair externe, telle que la voient les autres pairs du réseau.

Sera colporté aux pairs connectés du réseau afin qu'ils puissent le colporter à d'autres pairs du réseau.

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

L'intervalle de temps entre les demandes aux pairs du réseau pour le bloc le plus récent.

Des commérages plus fréquents raccourcissent le temps de synchronisation, mais peuvent surcharger le réseau.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Nombre maximal de transactions dans un message de lot de commérages.

Une taille plus petite conduit à un temps de synchronisation plus long, mais elle est utile si vous avez une perte de paquets élevée.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Période de commérages en attente de transaction entre pairs du réseau.

Des commérages plus fréquents raccourcissent le temps de synchronisation, mais peuvent surcharger le réseau.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Durée après laquelle la connexion avec le pair réseau est terminée si le pair réseau est inactif.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Adresse à laquelle le serveur Torii doit écouter et à laquelle le(s) client(s) envoient leurs requêtes.

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

Le nombre maximal d'octets dans un corps de requête brut accepté par le [Torii API points de terminaison](/fr/reference/torii-endpoints.md).

Cette limite est utilisée pour prévenir les attaques DOS.

<param-table>
<template #type>

Nombre (d'octets)

</template>
<template #default-value>

`64_000_000` (64 millions d'octets)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Le temps pendant lequel une requête peut rester dans le magasin si elle n'est pas consultée.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

La limite supérieure du nombre de requêtes en cours.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

La limite supérieure du nombre de requêtes en cours pour un seul utilisateur.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Journaliseur {#logger}

### `logger.level` {#param-logger-level}

Verbosité générale des journaux (voir [`logger.filter`](#param-logger-filter) pour une configuration raffinée).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Chaîne, valeurs possibles :

- `TRACE` : Tous les événements, y compris les opérations de bas niveau.
- `DEBUG` : Messages de niveau débogage, utiles pour le diagnostic.
- `INFO` : Messages d'information générale.
- `WARN` : Avertissements indiquant des problèmes potentiels.
- `ERROR` : Erreurs qui perturbent le fonctionnement normal mais permettent de continuer à fonctionner.

Choisissez le niveau qui convient le mieux à votre cas d'utilisation. Reportez-vous à [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) pour des détails supplémentaires sur la façon d'utiliser différents niveaux de journalisation.

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

::: tip mise à jour de l’environnement d’exécution

Ce paramètre peut être mis à jour dans la configuration de l’environnement d’exécution au moyen des points de terminaison opérateur de l’API Torii.

:::

### `logger.filter` {#param-logger-filter}

Filtres de journal affinés en plus de [`logger.level`](#param-logger-level). Permet de personnaliser la verbosité des journaux par cible.

<param-table type=string env=LOG_FILTER>
<template #type>

Chaîne, composée d'une ou plusieurs directives séparées par des virgules. Chaque directive peut avoir un niveau de verbosité maximum correspondant qui active (par exemple, sélectionne) les plages et événements correspondants. Iroha considère que les niveaux moins exclusifs (comme `trace` ou `info`) sont plus verbeux que les niveaux plus exclusifs (comme `error` ou `warn`).

À un niveau élevé, la syntaxe des directives se compose de plusieurs parties :

```
target[span{field=value}]=level
```

Pour plus de détails, voir [`tracing-subscriber` documentation](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Composition avec [`logger.level`](#param-logger-level)

`logger.filter` travaille ensemble avec [`logger.level`](#param-logger-level) et aucun ne remplace un autre.

Par exemple, si `logger.level` est défini sur `INFO` et `logger.filter` est défini sur `iroha_core=debug`, l'ensemble de filtres résultant sera `info,iroha_core=debug` (c'est-à-dire `info` pour tous les modules, `debug` pour `iroha_core`).

:::

::: tip mise à jour de l’environnement d’exécution

Ce paramètre peut être mis à jour dans la configuration de l’environnement d’exécution au moyen des points de terminaison opérateur de l’API Torii.

:::

### `logger.format` {#param-logger-format}

Format des journaux.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Chaîne, valeurs possibles :

- `full` : Le formateur par défaut. Il émet des journaux lisibles par l'homme, sur une seule ligne, pour chaque événement qui se produit, avec le contexte de span actuel affiché avant la représentation formatée de l'événement.
- `compact` : Une variante du formateur par défaut, optimisée pour les courtes longueurs de ligne. Les champs du contexte de span actuel sont ajoutés aux champs de l'événement formaté, et les noms de span ne sont pas affichés ; le niveau de verbosité est abrégé en un seul caractère.
- `pretty` : Émet des journaux excessivement jolis et multi-lignes, optimisés pour la lisibilité humaine. Ceci est principalement destiné à être utilisé en développement local et le débogage, ou pour les applications en ligne de commande, où l'analyse automatisée et le stockage compact des journaux sont moins prioritaires que la lisibilité et l'attrait visuel.
- `json` : Génère des journaux JSON séparés par des sauts de ligne. Cela est destiné à une utilisation en production avec des systèmes où les journaux structurés sont consommés comme JSON par des outils d'analyse et de visualisation. La sortie JSON n'est pas optimisée pour la lisibilité humaine.

Pour plus de détails et d'exemples de résultats, voir [`tracing-subscriber` documentation](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura est le moteur de stockage persistant de Iroha (japonais pour entrepôt).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Au maximum N derniers blocs seront stockés en mémoire.

Les blocs plus anciens seront supprimés de la mémoire et chargés depuis le disque si nécessaire.

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

Kura mode d'initialisation. `strict` est le mode normal et par défaut : il valide l'historique canonique, les artefacts de récupération, les index auxiliaires et la comptabilité du stockage avant que le nœud ne devienne actif.

`fast` est un mode d'urgence à service dégradé pour restaurer la visibilité opérationnelle lorsqu'un audit complet du démarrage risquerait une panne. Il nécessite un stockage préalablement initialisé par `strict` et une génération de vue des données à un point précis dans le temps contenant exactement cinq artefacts : `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito` et `snapshot.merkle.json`. Une signature d'opérateur séparée par domaine lie la valeur de l'empreinte cryptographique de la charge utile annoncée et le manifeste technique limité ; Le manifeste technique lie la longueur de la charge utile, l'identité de la chaîne/réseau, la hauteur/hash du terminal, le hash cryptographique de la politique SCCP, et la présence de la lignée de démarrage. Fast rejette la lignée bootstrap et nécessite exactement le même marqueur/compte/limite de tip que durable Kura. Les nœuds de première version acceptent exactement ces cinq artefacts et rejettent tout autre ensemble de compte ou de nom de fichier d'artefact.

Le mode Fast inventorie ces cinq noms et lie par métadonnées les fichiers de charge utile et de Merkle, mais il ne lit, ne hache, n’analyse ni ne décode leur contenu. Il construit un World/Nexus minimal à partir du manifeste signé, mappe en lecture seule le préfixe exact du hachage de Kura et laisse fermés l’instantané de World, le tableau des hachages de blocs, l’historique des transactions, les index dérivés et les journaux de récupération durables. Les audits Merkle, canoniques et sémantiques des instantanés, la réconciliation historique des blocs, de la finalité et de SCCP, la récupération de la hauteur active de Sumeragi, les journaux de fusion et de requêtes, le manifeste de voie et les sources de conformité, les archives SoraFS adossées à Kura, la comptabilité récursive du stockage et les réconciliateurs de services facultatifs restent différés. L’admission des transactions locales, les propositions, le vote, les écritures canoniques et les producteurs auxiliaires restent désactivés. Kura refuse lui-même le démarrage d’un processus d’écriture et les mutations durables ; les files de persistance du pipeline et de FASTPQ rejettent immédiatement le travail au lieu de le conserver ou de l’encoder. Les APIs de lecture de Kura désactivent aussi la réparation et la synchronisation de durabilité : les fichiers auxiliaires temporaires ne sont pas promus, les artefacts de voie manquants ne sont pas publiés et les barrières de progression ne sont pas synchronisées sur disque par `fsync`. Sumeragi et la diffusion des transactions ne sont pas lancés. Torii n’expose que les opérations de santé, de disponibilité, de préparation, de pairs et de configuration ; la version d’API, l’état, les métriques et toutes les routes ordinaires d’état et d’historique restent indisponibles. La préparation reste indisponible jusqu’à un redémarrage en mode Strict.

Utilisez `fast` uniquement pour un incident. Une fois que le service est stable, arrêtez le nœud, restaurez `strict`, et redémarrez afin que chaque vérification différée et reconstruction d'index s'exécute avant que la production ne reprenne. Le mode rapide ne nécessite pas le journal de fusion différée et ne crée, ne répare, ne tronque ni n'importe le stockage canonique ; les suffixes non publiés et les étapes de récupération auxiliaires en attente sont ignorés sans être lus ou modifiés, puis laissés pour la récupération stricte. La lignée de la vue de données ponctuelle uniquement avec hachage importée reste indisponible. Une vue de données ponctuelle actuelle manquante ou invalide échoue immédiatement ; Fast ne revient jamais à une reconstruction par rejouage du monde vide ou historique.

<param-table default-value=strict>
<template #type>

Chaîne, valeurs possibles :

- `strict` : validation complète et production normale
- `fast` : démarrage d'urgence limité avec production mise en quarantaine jusqu'à un redémarrage strict

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Spécifie le répertoire[^paths] où les blocs sont stockés.

Voir aussi : [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Drapeau pour activer l'affichage des nouveaux blocs dans la console.

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

## Queue {#queue}

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

Utilisez cette option pour appliquer la limitation.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

La transaction sera abandonnée après ce délai si elle est toujours dans la file d'attente.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Interrupteur réservé au débogage pour tester les chemins de gestion du soft-fork Sumeragi. Laissez-le désactivé en dehors des tests contrôlés ; le modifier sur un réseau de production en fonctionnement peut provoquer des désaccords entre les pairs du réseau concernant le comportement du consensus.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Règlement Privé Atomique {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` régit le chemin séparé `AtomicPrivateSettlementV1`. Il est désactivé par défaut. La configuration de `enabled = true` nécessite également un `activation_height` ; l’admission échoue toujours de manière fermée à moins que la capacité en chaîne, le délai de préavis, le profil de preuve fixe et la gouvernance du pool/audit ne soient actifs.

Les principales limites sont `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, et `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` doit être un sous-ensemble strictement croissant des classes de remplissage V1. `permitted_policy_versions` n'accepte que V1.

`max_capsule_bytes` mesure les Norito octets canoniques du `PrivateSettlementAuditCapsuleV1` complet, y compris AAD, la valeur de nonce cryptographique, le texte chiffré, le cadrage vectoriel, et chaque ligne DEK enveloppée par l'auditeur ; ce n'est pas une limite de texte chiffré uniquement. Chaque classe de remplissage activée doit s'adapter au conteneur de données à capsule complète conservateur pour au moins `default_min_auditor_approvals` auditeurs. Ce paramètre d'approbation est également un plancher régi : Torii rejette une politique nouvellement admise avec une valeur `min_approvals` inférieure et rejette toute capsule réelle dépassant la limite d'octets canonique.

Ces paramètres n'ont aucun contournement d'activation de la variable d'environnement de production. Voir [Exécuter un règlement privé atomique inter-espaces de données](/fr/get-started/atomic-private-settlement) pour l'exemple complet de configuration et les exigences opérationnelles. Le chemin n'est pas qualifié pour la production tant que les étapes de validation externes documentées n'ont pas été franchies.

## vue des données à un moment donné {#snapshot}

Ce module est responsable de la lecture et de l'écriture des vues de données à un instant donné du [Vue de l'État mondial](/fr/blockchain/world#world-state-view-wsv).

Les vues de données à un instant donné stockent un point de contrôle sérialisé de la Vue de l'État du Monde afin qu'un pair du réseau puisse redémarrer sans rejouer chaque bloc depuis Kura. Kura reste l'historique de blocs durable et la source de vérité pour le rejouage ; les vues de données à un instant donné sont un chemin d'accélération. Au démarrage, Iroha vérifie les métadonnées de la vue des données ponctuelles par rapport à la chaîne configurée et aux blocs stockés avant de décider de charger une vue des données ponctuelles ou de revenir à la lecture.

::: tip Effacer les vues de données à un instant donné

Au cas où il y aurait un problème avec le système de vues de données à un instant donné, et vous voulez commencer à partir d'une page blanche (en termes de vues de données à un moment donné), vous pourriez supprimer le répertoire spécifié par [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Le mode dans lequel le système de vue des données à un instant donné fonctionne.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Chaîne, valeurs possibles :

- `read_write`: Iroha crée des vues de données à un instant donné avec une période spécifiée par [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Au démarrage, Iroha lit une vue de données existante à un moment donné (le cas échéant) et vérifie qu'elle est à jour avec le stockage des blocs.
- `readonly` : Semblable à `read_write` mais Iroha ne crée aucun instantané.
- `disabled` : Iroha ne crée ni de nouvelles vues de données à un moment donné ni ne lit une vue existante au démarrage.

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

Fréquence des instantanés.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Répertoire où stocker les instantanés.

Voir aussi : [`kura.store_dir`](#param-kura-store-dir)

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

La télémétrie exporte les diagnostics des pairs réseau vers un collecteur de télémétrie externe. Configurez à la fois `telemetry.name` et `telemetry.url` lorsqu'un pair réseau doit signaler à un collecteur ; omettez la section lorsque la télémétrie n'est pas utilisée.

`name` et `url` doivent être appariés.

Toute la section `telemetry` est facultative.

### `telemetry.name` {#param-telemetry-name}

Le nom du nœud à afficher sur la télémétrie.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Le WebSocket URL du collecteur de télémétrie.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

La période minimale à attendre avant de se reconnecter.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

L'exposant maximal de 2 qui est utilisé pour augmenter le délai entre les reconnexions.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Le chemin du fichier pour écrire dev-telemetry

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
