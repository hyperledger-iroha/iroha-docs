---
translation_locale: fr
translation_source: /blockchain/queries.md
translation_source_hash: 0a32b75b78d5bcde0d2b84b58d440b18e545559dfd9772dd6508ad41e972bf6e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Questions posées {#queries}

Bien que la plupart des informations sur l'état de la blockchain puissent être obtenues, comme nous l'avons montré précédemment, en utilisant un abonné d'événement et un filtre pour restreindre la portée des événements à ceux qui vous intéressent, parfois vous devez prendre une approche plus directe. Entrez des requêtes.

Les requêtes sont de petits objets comme des instructions qui, lorsqu'ils sont envoyés à un Iroha paire, provoquent une réponse avec des détails de la vision actuelle de l'état du monde.

Ce n'est pas nécessairement le seul type d'information disponible sur le réseau, mais c'est le seul type de renseignements qui est garanti pour être accessible sur tous les réseaux.

Pour chaque déploiement de Iroha, il pourrait y avoir d'autres informations disponibles. C'est entièrement à eux de décider s'ils veulent ou non allouer la puissance de traitement pour suivre le travail au lieu de l'utiliser pour effectuer le travail réel.

Les résultats des requêtes peuvent être triés [](#sorting), [paginés](#pagination) et [filtrés](#filters) par les pairs à la fois. Le tri est effectué lexicographiquement sur les touches de métadonnées. Le filtrage peut être effectué sur une variété de principes, allant des domaines spécifiques (masques individuels de filtre d'adresse IP) aux méthodes de sous-chaîne telles que `begins_with` combinées à l'aide d'opérations logiques.

## Essayez le sur Taira {#try-it-on-taira}

Taira expose les aides à la requête en lecture seulement sur JSON pour des ressources communes. Utilisez-les pour pratiquer la pagination et le traitement des réponses avant de câbler un SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Pour le diagnostic d'applications, gardez ces contrôles de fumée séparés des tests de transaction signés. Une défaillance de requête en lecture seule indique généralement la disponibilité du point final, la facilité d'accès au réseau ou la compatibilité de l'itinéraire avant qu'elle ne pointe vers la configuration du signer.

## Créer une requête {#create-a-query}

Utilisez des constructeurs de requêtes typés à partir du SDK ou CLI. Par exemple, le modèle de données actuel expose `FindAccounts` pour les comptes d'inscription:

```rust
let query = FindAccounts;
```

Voici un exemple d'une requête qui trouve les actifs d'Alice:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Paginaison {#pagination}

Pour les requêtes singulières et les petites requêtes itérables, vous pouvez utiliser `client.request` pour soumettre une requête et obtenir le résultat en un seul coup.

Cependant, des requêtes répétitives larges telles que `FindAccounts`, `FindAssets` ou `FindBlocks` peuvent renvoyer de grands ensembles de résultats.

Pour construire un `Pagination`, vous devez appeler `client.request_with_pagination(query, pagination)`, où le `pagination` est construit comme suit:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Les filtres {#filters}

Lorsque vous créez une requête, vous pouvez utiliser un filtre pour retourner uniquement les résultats qui correspondent au filtre spécifié.

Les filtres sont spécifiques aux requêtes. Par exemple, les requêtes de compte peuvent être réduites par l'identité du compte ou les métadonnées, tandis que les requêtes d'actifs peuvent être réduits par la définition d'actif, le compte du titulaire ou la projection de domaine. Utilisez les constructeurs de requêtes typés du SDK lorsque cela est possible afin que le type de filtre correspond au type de sortie de la requête.

## Réglage {#sorting}

Iroha peut trier les éléments avec [métadonnées](/fr/blockchain/metadata.md) L'objectif de la requête est d'élaborer un code lexicographique si vous fournissez une clé à trier au cours de la construction de la requêtes. Un cas d'utilisation typique est que les comptes aient un `registered-on` Entrée de métadonnées, qui, lorsqu'elle est triée, vous permet de visualiser l'historique d'enregistrement du compte.

Le tri ne s'applique qu'aux entités qui possèdent [ métadonnées](/fr/blockchain/metadata.md), car la clé de métadonnées est utilisée pour trier les résultats des requêtes.

Vous pouvez combiner le tri avec la pagination et les filtres. Notez que le tri est une fonctionnalité facultative, la plupart des requêtes avec pagination ne l'auront pas besoin.

## Références {#reference}

Consultez la liste [ des requêtes existantes ](/fr/reference/queries.md) pour obtenir des informations détaillées à leur sujet.
