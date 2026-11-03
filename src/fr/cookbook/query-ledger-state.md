---
translation_locale: fr
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Interroger l'état du grand livre blockchain {#query-ledger-state}

## Résultat {#outcome}

Lisez et projetez les ressources Taira JSON, puis utilisez les requêtes de collection Torii depuis le CLI et le SDK Rust avec des filtres, un tri, une projection côté serveur, des limites de page et une continuation opaque par `next_cursor`. Vous éviterez aussi de faire passer les listes par des requêtes typées signées, qui ne les filtrent, ne les trient ni ne les projettent.

## Prérequis {#prerequisites}

- `curl`, `jq`, Node.js 24, et le `iroha` CLI actuel.
- Accès en lecture seule Taira.
- Pour les exemples CLI, une configuration client pour Taira ou un réseau local généré.
- Pour l'exemple Rust, un projet épinglé à la même révision source Iroha que le réseau cible.

## Étapes {#steps}

### 1. Parcourez une ressource publique Taira {#_1-page-through-a-public-taira-resource}

Les routes de ressources sont utiles pour les tableaux de bord et les vérifications rapides. Demandez JSON, liez chaque page, et ne projetez que les champs dont l'application a besoin après avoir vérifié la réponse.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
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
  cursor = page.next_cursor
} while (cursor)
```

:::

Cette surface HTTP pagine avec `limit` et un `next_cursor` opaque ; renvoyez-le tel quel comme `cursor` jusqu'à ce qu'il soit `null`. `total` n'apparaît que lorsque vous demandez `include_total=true`, ce qui coûte un parcours complet.

### 2. Filtrer une collection avec le CLI {#_2-filter-a-collection-with-the-cli}

Le CLI envoie le filtre, la projection et la taille de page au point de terminaison de la collection et imprime une page, `{items, next_cursor}`. Ajoutez `--all` pour suivre `next_cursor` jusqu'à ce qu'il soit `null`.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Le filtrage se fait avant la pagination. Chaque collection n'accepte que ses propres champs ; un champ inconnu renvoie `invalid_filter` au lieu de ne correspondre à rien.

### 3. Trier par une clé de métadonnées stable {#_3-sort-by-a-stable-metadata-key}

Les clés de tri des collections acceptent les champs déclarés et `metadata.<key>` ; préfixez une clé par `-` pour l'ordre décroissant. Les lignes sans la clé sont triées en premier dans l'ordre croissant et les égalités suivent l'identité de la ligne, donc utilisez une clé remplie de manière cohérente dans toute la collection.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` est une projection côté serveur : `--select id,metadata` ne renvoie que ces champs, et un champ inconnu renvoie `invalid_select`. Les requêtes typées signées renvoient toujours des éléments entiers ; projetez donc leurs résultats côté client avec `jq` ou JavaScript comme indiqué ci-dessus.

### 4. Laissez l'itérateur Rust suivre les curseurs opaques {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` définit la taille de page. L'itérateur renvoyé par `list` ne demande la page suivante avec le `next_cursor` du serveur qu'après consommation de la page courante, et `take` borne le résultat logique. Ici, `client` est un `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

Un `next_cursor` est une position opaque de jeu de clés liée à sa collection, à son chemin, à son filtre et à son tri. Ne l'analysez ni ne le synthétisez jamais, et ne le réutilisez pas avec un autre filtre ou un autre tri ; Torii le rejette avec `invalid_cursor`. Les lignes insérées ou supprimées entre les pages ne font jamais répéter ni sauter de lignes sans rapport à une page ultérieure.

## Vérifier {#verify}

Le filtre de domaine exact ne doit renvoyer que `universal.universal`. Vérifiez le résultat plutôt que de compter uniquement une sortie CLI réussie :

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Pour les requêtes d'application paginées, testez également que les identifiants ne se répètent pas d'une page à l'autre, que la limite logique demandée n'est jamais dépassée, et qu'un curseur rejeté fait reprendre à partir d'un point de contrôle documenté.

## Dépannage {#troubleshooting}

- Une requête singulière n'accepte pas les paramètres filtrables, de tri, de pagination ou de récupération itérables. Utilisez la requête de liste correspondante lorsque ces contrôles sont nécessaires.
- `limit` est la taille de page, pas le résultat total : au moins 1 et au plus le `torii.app_api_max_list_limit` du nœud (500 par défaut) ; la valeur par défaut de Torii est 100. Suivez `next_cursor`, `--all` ou l'itérateur du SDK pour en lire davantage.
- `invalid_cursor` signifie que le curseur est mal formé ou appartient à une autre collection, un autre chemin, un autre filtre ou un autre tri. Redémarrez la requête ; n'essayez pas de réparer la valeur opaque.
- Un filtre sélectif peut renvoyer une page courte ou vide avec un `next_cursor` non nul. Continuez à le suivre jusqu'à ce qu'il soit `null`.
- `--filter` et le paramètre HTTP `filter` utilisent la grammaire textuelle de Torii, par exemple `id = "universal.universal"` ou `exists(metadata.tier)`. Un objet prédicat JSON n'est pas un texte de filtre et échoue comme `filter` invalide.
- Les requêtes larges et illimitées augmentent le travail des pairs du réseau et la mémoire du client. Définissez une limite logique et une taille de page appropriées au consommateur.
- Le `/v1/query` signé n'est pas l'API de liste. Il admet les requêtes singulières et quelques démarrages itérables non filtrés, et refuse les autres, comme `FindDomains` ou `FindAssetDefinitions`, avec `signed_query_shape_not_admitted`. Les points de terminaison de collection, les commandes `list` du CLI et les lecteurs de collection du SDK partagent une même grammaire de filtre, de tri et de curseur.

## Source et documents connexes {#source-and-related-docs}

- [Contrat des requêtes de collection Torii au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Lectures de collection et itérateur de curseur Rust au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Admission des requêtes signées au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Requêtes](/fr/blockchain/queries.md)
- [Référence de requête](/fr/reference/queries.md)
- [JavaScript et TypeScript](/fr/guide/tutorials/javascript.md)
