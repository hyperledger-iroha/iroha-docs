---
translation_locale: fr
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: a81f6cc04befb0b92a0a01c2cb3c1ecbbc631ce1f2a923cb046241c295db7806
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# L'état de l'enquête {#query-ledger-state}

## Le résultat {#outcome}

Lire et projeter les ressources Taira JSON, puis utiliser des requêtes typées Iroha avec des filtres, une pagination logique, un tri, des tailles de récupération et la continuation du curseur en avant seulement. Vous éviterez également de vous fier à la projection sélectrice avant que le serveur n'évalue le tuple `--select`.

## Conditions préalables {#prerequisites}

- `curl`, `jq`, Node.js 24 et le courant `iroha` CLI.
- Accès en lecture seulement Taira.
- Pour les exemples de requêtes typées signées, une configuration du client pour Taira ou un réseau local généré.
- Dans l'exemple Rust, un projet fixé à la même révision de source Iroha que le réseau cible.

## Les étapes {#steps}

### 1. Une page dans une ressource publique Taira {#_1-page-through-a-public-taira-resource}

Les itinéraires des ressources sont utiles pour les tableaux de bord et les contrôles de fumée. Demandez JSON, liez chaque page, et projettez uniquement les champs dont l'application a besoin après avoir vérifié la réponse.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

Cette surface HTTP utilise `limit` et `offset`. Traiter un `total` omis ou délimité comme normal lorsque le trajet utilise un mode de comptage moins cher.

### 2. Filtrer et partager une requête typée CLI {#_2-filter-and-batch-a-typed-cli-query}

Le CLI sérialise une requête itérable typée et suit les curseurs de continuation du serveur en interne. Ici, le résultat logique est limité à une ligne, tandis que `--fetch-size 1` contrôle le lot maximal récupéré par aller-retour.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Le filtrage se produit avant la pagination. Utilisez des prédicates typés spécifiques à la requête; un prédicat pour un compte ou un actif ne peut pas être réutilisé en toute sécurité pour un domaine.

### 3. trier par une clé de métadonnées stable {#_3-sort-by-a-stable-metadata-key}

Le tri de requête typé est lexicographique sur une clé de métadonnées. Les éléments sans cette clé suivent l'ordre défini du temps d'exécution, alors utilisez une clé peuplée de manière cohérente dans la collection.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

Les personnes enregistrées CLI les parses `--select` JSON et renvoie le tuple de sélecteur, mais la requête légère actuelle DSL n'évalue pas ce sélecteur sur le serveur. Ne construisez pas encore un contrat de projection autour d'elle. SDK la projection seulement après que le temps d'exécution cible l'ait supporté, ou projeter le côté client du résultat validé avec `jq` ou JavaScript comme ci-dessus.

### Laissez l'itérateur Rust suivre des curseurs opaques. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` limite l'ensemble de résultats logiques. `FetchSize` contrôle chaque lot de serveur. L'itérateur retourné envoie transparemment des demandes de continuation en utilisant le curseur généré par le serveur.

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

Un `ForwardCursor` est lié à l'autorité, basé sur le processus et uniquement orienté vers l'avenir. Ne jamais l'analyser, le synthétiser, le partager entre les autorités ou le maintenir en tant que jeton de CV portable dans toutes les instances du Torii. S'il expire, redémarrez la requête originale avec un point de contrôle délibéré au niveau de l'application.

## Vérifiez {#verify}

Le filtre de domaine exact ne devrait retourner que `wonderland.universal`. Vérifiez le résultat plutôt que de compter une sortie réussie CLI seule:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Pour les requêtes d'application paginées, vérifiez également que IDs ne se répète pas sur plusieurs pages, que la limite logique demandée n'est jamais dépassée et que le redémarrage après l'expiration d'un cursor commence à partir d'un point de contrôle documenté.

## Résolution des problèmes {#troubleshooting}

- Une requête singulière n'accepte pas les paramètres de filtrage, de tri, de pagination ou de récupération itérables. Utilisez la requête de liste correspondante lorsque ces contrôles sont nécessaires.
- `fetch_size` est un indice de lot non zéro, pas la limite totale du résultat. La valeur par défaut actuelle est `100` et le temps d'exécution rejette des valeurs supérieures à son maximum.
- Un curseur inconnu, expiré ou étranger n'est pas intentionnellement réutilisable. Réinitialiser la requête; ne tentez pas de réparer la valeur opaque.
- Le tri des métadonnées n'est pas un tri des champs général. Si chaque élément ne contient pas la clé sélectionnée, documenter l'ordre de la clé manquante ou choisir une autre stratégie.
- Le CLI analyse et renvoie `--select`, mais le serveur actuel n'évalue pas le tuple de sélecteur léger. Appliquez la projection côté client à moins que le support du sélecteur côté serveur ne soit vérifié pour l'exécution déployée.
- Des requêtes sans limites étendues augmentent le travail des pairs, la mémoire du client et les risques liés à la durée de vie du cursor.
- Le public JSON Les paramètres de ressources et les paramètres signés de requête typée sont liés, mais pas des formats de fil interchangeables. SDK ou CLI Pour les enveloppes de requête typées.

## Sources et documents connexes {#source-and-related-docs}

- [Tests d'intégration de la pagination supportée par le curseur à l'accord fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/pagination.rs)
- [Le comportement du constructeur de requête et du sélecteur sur le comit fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Paramètres de requête et modèle de curseur à l'engagement fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/parameters.rs)
- [Les questions ](/fr/blockchain/queries.md)
- [Référence à la requête ](/fr/reference/queries.md)
- [JavaScript et TypeScript](/fr/guide/tutorials/javascript.md)
