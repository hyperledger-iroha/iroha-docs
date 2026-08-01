---
translation_locale: fr
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Questions posées {#queries}

Les abonnés à l'événement et les filtres peuvent suivre les changements dans l'état de la blockchain. Utilisez une requête lorsque vous avez besoin d'une vue directe de l'État actuel.

Les requêtes sont de petits objets qui ressemblent à des instructions. Envoyez-en un à un Iroha pour recevoir les détails de sa vision actuelle de l'état du monde.

Un réseau peut exposer d'autres informations. L'information des États du monde recherchable est le seul type garanti d'être disponible sur chaque Iroha réseau.

Pour chaque déploiement de Iroha, il peut y avoir d'autres informations disponibles Par exemple, la disponibilité des données de télémétrie dépend des administrateurs du réseau. C'est entièrement à eux de décider s'ils veulent ou non les allouer. La puissance de traitement permet de suivre le travail au lieu de l'utiliser pour effectuer le travail réel. En revanche, certaines fonctions sont toujours requises, par exemple l'accès au solde de votre compte.

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

Les filtres sont spécifiques à la requête. Par exemple, les requêtes de compte peuvent être réduites par l'identité du compte ou des métadonnées, tandis que les requêtes d'actifs peuvent être réduits par actif définition, compte de titulaire ou projection de domaine. Utilisez les constructeurs de requêtes typées du SDK dans la mesure du possible afin que le type de filtre correspond au type de sortie de la requête.

## Réglage {#sorting}

Iroha peut trier les éléments avec [métadonnées](/fr/blockchain/metadata.md) L'objectif de la requête est d'élaborer un code lexicographique si vous fournissez une clé à trier au cours de la construction de la requêtes. Un cas d'utilisation typique est que les comptes aient un `registered-on` Entrée de métadonnées, qui, lorsqu'elle est triée, vous permet de visualiser l'historique d'enregistrement du compte.

Le tri ne s'applique qu'aux entités qui possèdent [ métadonnées](/fr/blockchain/metadata.md), car la clé de métadonnées est utilisée pour trier les résultats des requêtes.

Vous pouvez combiner le tri avec la pagination et les filtres. Notez que le tri est une fonctionnalité facultative, la plupart des requêtes avec pagination ne l'auront pas besoin.

## Références {#reference}

Consultez la liste [ des requêtes existantes ](/fr/reference/queries.md) pour obtenir des informations détaillées à leur sujet.
