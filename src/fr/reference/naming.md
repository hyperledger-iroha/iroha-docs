---
translation_locale: fr
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Nommer les assemblées {#naming-conventions}

Lorsque vous nommez des comptes, des domaines ou des actifs, vous devez garder à l'esprit les conventions suivantes utilisées dans Iroha:

1. Il existe un certain nombre de séparateurs réservés qui sont utilisés pour certains types de constructions:

   - `@` est réservé aux pseudonymes des comptes et aux formulaires de compte/clés publiques à scope
   - `#` est réservé aux pseudonymes de définition d'actif et à la littéralité du solde des actifs
   - `::` est réservé aux pseudonymes contractuels
   - `.` est réservé à la qualification du domaine et de l'espace de données
   - `$` est réservé aux formulaires textuels à scope de déclencheur
   - `%` est réservé aux formulaires textuels validés par un validateur

2. Le nombre maximum de caractères (y compris les caractères UTF-8) qu'un nom peut contenir est limité par deux facteurs: `[0, u32::MAX]` et l'espace de pile actuellement alloué.

## Essayez le sur Taira {#try-it-on-taira}

Résoudre un alias d'actif public dans sa définition canonique d'actifs ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Comparez cela à la liste des définitions d'actifs:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

Le caractère `#` sépare un alias d'actif du contexte de domaine. Gardez-le à l'écart des noms ordinaires, sauf si vous écrivez intentionnellement un alias ou une balance d'actifs littéralement.
