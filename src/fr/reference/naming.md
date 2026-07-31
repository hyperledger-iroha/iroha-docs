---
translation_locale: fr
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Nommer les assemblées {#naming-conventions}

Lorsque vous nommez des comptes, des domaines ou des actifs, vous devez garder à l'esprit
les conventions suivantes utilisées dans Iroha:

1. Il existe un certain nombre de séparateurs réservés qui sont utilisés pour des
   types de constructions:

   - `@` est réservé aux pseudonymes des comptes et aux formulaires de compte/clés publiques à scope
   - `#` est réservé aux aliases de définition d'actifs et au littéraux du solde des actifs
   - `::` est réservé aux pseudonymes contractuels
   - `.` est réservé à la qualification de domaine et d'espace de données
   - `$` est réservé aux formulaires textuels à scope déclencheur
   - `%` est réservé aux formulaires textuels validateurs

2. Le nombre maximum de caractères (y compris UTF-8 un nom peut être
   a est limitée par deux facteurs: `[0, u32::MAX]` et les
   espace de pile alloué.

## Essayez-le . Taira {#try-it-on-taira}

Résoudre un alias d'actif public dans sa définition canonique d'actifs ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Comparez cela avec la liste de définition d'actifs:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

Les `#` Le caractère sépare un alias d'actif du contexte du domaine.
de noms simples, sauf si vous écrivez intentionnellement un alias ou un actif
équilibre littéral.
