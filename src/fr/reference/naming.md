---
translation_locale: fr
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Conventions de nommage {#naming-conventions}

Lorsque vous nommez des comptes, des domaines ou des actifs, vous devez garder à l'esprit les conventions suivantes utilisées dans Iroha :

1. Il existe un certain nombre de séparateurs réservés qui sont utilisés pour des types spécifiques de constructions :

   - `@` est réservé aux alias de compte et aux formulaires de compte/clé publique ciblés
   - `#` est réservé aux alias de définition d'actifs et aux littéraux de solde d'actifs
   - `::` est réservé aux alias de contrat
   - `.` est réservé à la qualification de domaine et d'espace de données
   - `$` est réservé aux formes textuelles à portée de déclenchement
   - `%` est réservé aux formes textuelles à l'échelle du validateur

2. Le nombre maximum de caractères (y compris les caractères UTF-8) qu'un nom peut avoir est limité par deux facteurs : `[0, u32::MAX]` et l'espace de pile actuellement alloué.

## Essayez-le sur Taira {#try-it-on-taira}

Résoudre un alias d'actif public en son ID de définition d'actif canonique :

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Comparez cela avec la liste de définition des actifs :

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

Le caractère `#` sépare un alias d'actif du contexte de domaine. Évitez de l'utiliser dans les noms simples à moins que vous ne rédigiez intentionnellement un alias d'actif ou une valeur littérale de solde d'actif.
