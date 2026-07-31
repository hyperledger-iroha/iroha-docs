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

# Les questions {#queries}

Bien que la plupart des informations sur l'état de la blockchain peut être
obtenu, comme nous l'avons montré précédemment, en utilisant un abonnement à l'événement et un filtre
réduire la portée des événements à ceux qui vous intéressent, parfois il faut
Prenez une approche plus directe. _les questions_.

Les requêtes sont de petits objets similaires à des instructions qui, lorsqu'ils sont envoyés à un Iroha
Parents, demandez une réponse avec des détails de la vision actuelle du monde.

Ce n'est pas nécessairement le seul type d'information disponible sur
le réseau, mais c'est le seul type d'information qui est _garantie_ à
être accessibles sur tous les réseaux.

Pour chaque déploiement de Iroha, Il pourrait y avoir d'autres informations disponibles.
Par exemple, la disponibilité des données télémétriques dépend du réseau.
C'est entièrement à eux de décider s'ils veulent ou non
attribuer une puissance de traitement pour suivre le travail au lieu de l'utiliser pour effectuer les
En revanche, certaines fonctions sont toujours requises.
accès au solde de votre compte.

Les résultats des enquêtes peuvent être [triés](#sorting), [pages](#pagination)
et [filtré](#filters) - Le tri est terminé.
Le filtrage peut être effectué sur une variété de
les principes, à partir de domaines spécifiques (individuels IP les masques de filtre d'adresse) à
méthodes de sous-chaîne telles que `begins_with` combinés à l'aide d'opérations logiques.

## Essayez-le . Taira {#try-it-on-taira}

Taira expose les aides à la requête en lecture seulement JSON Pour les ressources communes.
pour pratiquer la pagination et le traitement des réponses avant de câbler un SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Pour le diagnostic de l'application, gardez ces contrôles de fumée séparés des transactions signées
les tests. Une défaillance de requête en lecture seulement indique généralement la disponibilité du point final,
l'accessibilité du réseau ou la compatibilité des itinéraires avant qu'il ne pointe vers la configuration de signataire.

## Créer une requête {#create-a-query}

Utilisez des constructeurs de requêtes typées à partir du SDK ou CLI. Par exemple, les données actuelles
expositions de modèle `FindAccounts` pour les comptes inscrits à la liste:

```rust
let query = FindAccounts;
```

Voici un exemple d'une requête qui trouve les actifs d'Alice:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Paginaison {#pagination}

Pour les requêtes singulières et les petites requêtes itérables, vous pouvez utiliser `client.request`
pour soumettre une requête et obtenir le résultat en une seule fois.

Cependant, de larges requêtes récurrentes telles que `FindAccounts`, `FindAssets`, ou
`FindBlocks` utilisez la pagination pour réduire le chargement sur
le paire et le client.

Pour construire une `Pagination`, Vous devez appeler
`client.request_with_pagination(query, pagination)`, où le `pagination`
est construit comme suit:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filtres {#filters}

Lorsque vous créez une requête, vous pouvez utiliser un filtre pour retourner uniquement les résultats
qui correspondent au filtre spécifié.

Les filtres sont spécifiques à la requête.
l'identité du compte ou des métadonnées, tandis que les requêtes d'actifs peuvent être réduites par actif
La définition, le compte du titulaire ou la projection de domaine. SDK C' est une requête typée
constructeurs lorsque cela est possible afin que le type de filtre correspond au type de sortie de la requête.

## Réglage {#sorting}

Iroha peut trier les éléments avec [métadonnées](/fr/blockchain/metadata.md)
lexique si vous fournissez une clé à trier pendant la construction
Un cas d'utilisation typique est que les comptes doivent avoir un `registered-on`
entrée de métadonnées, qui, lorsqu'elle est triée, vous permet de voir le compte
les antécédents d'enregistrement.

Le tri ne s'applique qu'aux entités qui ont
[métadonnées](/fr/blockchain/metadata.md), comme la clé de métadonnées est utilisée pour
sélectionner les résultats de la requête.

Vous pouvez combiner le tri avec la pagination et les filtres.
une fonctionnalité facultative, la plupart des requêtes avec pagination ne le auront pas besoin.

## Références {#reference}

Vérifiez le [liste des requêtes existantes](/fr/reference/queries.md) pour obtenir des informations détaillées à leur sujet.
