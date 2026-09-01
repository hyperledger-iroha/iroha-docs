---
translation_locale: fr
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Interroger l'état du grand livre blockchain {#query-ledger-state}

## Résultat {#outcome}

Lisez et projetez les ressources Taira JSON, puis utilisez des requêtes typées Iroha avec des filtres, une pagination logique, un tri, des tailles de récupération et une continuation du curseur en avant seulement. Vous éviterez également de vous fier à la projection du sélecteur avant que le serveur n'évalue le tuple transféré `--select`.

## Prérequis {#prerequisites}

- `curl`, `jq`, Node.js 24, et le `iroha` CLI actuel.
- Accès en lecture seule Taira.
- Pour des exemples de requêtes typées signées, une configuration client pour Taira ou un réseau local généré.
- Pour l'exemple Rust, un projet épinglé à la même révision source Iroha que le réseau cible.

## Étapes {#steps}

### 1. Parcourez une ressource publique Taira {#_1-page-through-a-public-taira-resource}

Les routes de ressources sont utiles pour les tableaux de bord et les vérifications rapides. Demandez JSON, liez chaque page, et ne projetez que les champs dont l'application a besoin après avoir vérifié la réponse.

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

Cette surface HTTP utilise `limit` et `offset`. Traitez un `total` omis ou limité comme normal lorsque le trajet utilise un mode de comptage moins coûteux.

### 2. Filtrer et regrouper une requête tapée CLI {#_2-filter-and-batch-a-typed-cli-query}

Le CLI sérialise une requête itérable typée et suit en interne les curseurs de continuation du serveur. Ici, le résultat logique est limité à une ligne, tandis que `--fetch-size 1` contrôle le nombre maximum de lots récupérés par aller-retour.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Le filtrage se fait avant la pagination. Utilisez des prédicats typés spécifiques à la requête ; un prédicat pour un compte ou un actif ne peut pas être réutilisé en toute sécurité pour un domaine.

### 3. Trier par une clé de métadonnées stable {#_3-sort-by-a-stable-metadata-key}

Le tri des requêtes tapées est lexicographique sur une clé de métadonnées. Les éléments sans cette clé suivent l'ordre défini par l'exécution du logiciel, donc utilisez une clé remplie de manière cohérente dans toute la collection.

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

Le CLI enregistré analyse `--select` JSON et transmet le tuple de sélecteur, mais la requête légère actuelle DSL n'évalue pas ce sélecteur sur le serveur. Ne construisez pas encore de contrat de projection autour de celui-ci. Utilisez une projection typée SDK uniquement après que l'environnement d'exécution du logiciel cible la prenne en charge, ou projetez le résultat validé côté client avec `jq` ou JavaScript comme indiqué ci-dessus.

### 4. Laissez l'itérateur Rust suivre les curseurs opaques {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` délimite l'ensemble de résultats logique. `FetchSize` contrôle chaque lot de serveur. L'itérateur retourné envoie de manière transparente des requêtes de continuation en utilisant le curseur généré par le serveur.

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

Un `ForwardCursor` est lié à l'autorité, local au processus et à sens unique. Ne l'analysez jamais, ne le synthétisez pas, ne le partagez pas entre des entités d'autorisation, et ne le conservez pas comme un jeton de résumé portable entre les instances Torii. S'il expire, relancez la requête originale avec un point de contrôle délibéré au niveau de l'application.

## Vérifier {#verify}

Le filtre de domaine exact ne doit renvoyer que `wonderland.universal`. Vérifiez le résultat plutôt que de compter uniquement une sortie CLI réussie :

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Pour les requêtes d'application paginées, testez également que les identifiants ne se répètent pas d'une page à l'autre, que la limite logique demandée n'est jamais dépassée, et que la nouvelle tentative après l'expiration d'un curseur reprend à partir d'un point de contrôle documenté.

## Dépannage {#troubleshooting}

- Une requête singulière n'accepte pas les paramètres filtrables, de tri, de pagination ou de récupération itérables. Utilisez la requête de liste correspondante lorsque ces contrôles sont nécessaires.
- `fetch_size` est un indice de lot non nul, pas la limite totale des résultats. La valeur par défaut actuelle est `100`, et l'exécution du logiciel rejette les valeurs supérieures à son maximum.
- Un curseur inconnu, expiré ou étranger n'est volontairement pas réutilisable. Redémarrez la requête ; n'essayez pas de réparer la valeur opaque.
- Le tri des métadonnées n'est pas un tri de champ général. Si chaque élément ne porte pas la clé sélectionnée, documentez l'ordre des clés manquantes ou choisissez une autre stratégie.
- Le CLI analyse et transmet `--select`, mais le serveur actuel n’évalue pas le tuple de sélecteur léger. Appliquez la projection côté client sauf si le support du sélecteur côté serveur est vérifié pour l'environnement d'exécution logiciel déployé.
- Les requêtes larges et illimitées augmentent le travail des pairs du réseau, la mémoire du client et le risque lié à la durée de vie du curseur. Définissez une limite logique et une taille de récupération appropriée au consommateur.
- Les paramètres de ressource publics JSON et les paramètres de requête typés signés sont des formats de sérialisation liés mais non interchangeables. Préférez SDK ou CLI pour les conteneurs de données de requête typée.

## Source et documents connexes {#source-and-related-docs}

- [Tests d'intégration de la pagination par curseur au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Comportement du générateur de requêtes et du sélecteur au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Paramètres de requête et modèle de curseur au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Requêtes](/fr/blockchain/queries.md)
- [Référence de requête](/fr/reference/queries.md)
- [JavaScript et TypeScript](/fr/guide/tutorials/javascript.md)
