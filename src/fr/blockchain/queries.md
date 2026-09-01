---
translation_locale: fr
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: bing-translator-llm
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Requêtes {#queries}

Les abonnés aux événements et les filtres peuvent suivre les changements dans l'état de la blockchain. Utilisez une requête lorsque vous avez besoin d'une vue directe de l'état actuel.

Les requêtes sont de petits objets ressemblant à des instructions. Envoyez-en une à un pair du réseau Iroha pour recevoir des détails de sa vue de l'état actuel du monde.

Un réseau peut divulguer d'autres informations. Les informations sur l'état du monde interrogeables sont le seul type garanti d'être disponible sur chaque réseau Iroha.

Pour chaque déploiement de Iroha, il peut y avoir d'autres informations disponibles. Par exemple, la disponibilité des données télémétriques dépend des administrateurs du réseau. C'est entièrement leur décision de savoir s'ils veulent ou non allouer de la puissance de traitement pour suivre le travail au lieu de l'utiliser pour effectuer le travail réel. En revanche, certaines fonctions sont toujours nécessaires, par exemple avoir accès à votre solde de compte.

Les résultats des requêtes peuvent être [triée](#sorting), [paginé](#pagination) et [filtré](#filters) côté pair simultanément. Le tri est effectué de manière lexicographique sur les clés de métadonnées. Le filtrage peut être effectué sur une variété de principes, allant des méthodes spécifiques au domaine (filtres d'adresse individuels IP) aux méthodes de sous-chaîne comme `begins_with` combinées à l'aide d'opérations logiques.

## Essayez-le sur Taira {#try-it-on-taira}

Taira expose des helpers de requête en lecture seule sur JSON pour les ressources courantes. Utilisez-les pour pratiquer la pagination et la gestion des réponses avant de connecter un SDK :

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Pour le diagnostic des applications, gardez ces vérifications de base séparées des tests de transactions signées. Un échec de requête en lecture seule indique généralement la disponibilité du point de terminaison API, la connectivité réseau ou la compatibilité de la route avant de pointer vers la configuration du signataire cryptographique.

## Créer une requête {#create-a-query}

Utilisez les générateurs de requêtes typés de SDK ou CLI. Par exemple, le modèle de données actuel expose `FindAccounts` pour la liste des comptes :

```rust
let query = FindAccounts;
```

Voici un exemple de requête qui trouve les actifs de Alice :

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Pagination {#pagination}

Pour les requêtes singulières et les petites requêtes itérables, vous pouvez utiliser `client.request` pour soumettre une requête et obtenir le résultat en une seule fois.

Cependant, des requêtes itérables larges telles que `FindAccounts`, `FindAssets` ou `FindBlocks` peuvent renvoyer de grands ensembles de résultats. Utilisez la pagination pour réduire la charge sur le pair réseau et le client.

Pour construire un `Pagination`, vous devez appeler `client.request_with_pagination(query, pagination)`, où le `pagination` est construit comme suit :

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filtres {#filters}

Lorsque vous créez une requête, vous pouvez utiliser un filtre pour ne renvoyer que les résultats qui correspondent au filtre spécifié.

Les filtres sont spécifiques à la requête. Par exemple, les requêtes de compte peuvent être restreintes par l'identité du compte ou les métadonnées, tandis que les requêtes d'actifs peuvent être restreintes par l'actif. définition, compte titulaire ou projection de domaine. Utilisez les générateurs de requêtes typés de SDK autant que possible afin que le type de filtre corresponde au type de sortie de la requête.

## Tri {#sorting}

Iroha peut trier les éléments avec [métadonnées](/fr/blockchain/metadata.md) par ordre lexicographique si vous fournissez une clé de tri lors de la construction de la requête. Un cas d'utilisation typique est que les comptes disposent d'une entrée de métadonnées `registered-on` qui, lorsqu'elle est triée, vous permet de voir l'historique d'enregistrement du compte.

Le tri ne s'applique qu'aux entités qui ont [métadonnées](/fr/blockchain/metadata.md), car la clé de métadonnées est utilisée pour trier les résultats de la requête.

Vous pouvez combiner le tri avec la pagination et les filtres. Notez que le tri est une fonctionnalité optionnelle, la plupart des requêtes avec pagination n'en auront pas besoin.

## Référence {#reference}

Vérifiez le [liste des requêtes existantes](/fr/reference/queries.md) pour des informations détaillées à leur sujet.
