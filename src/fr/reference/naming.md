---
translation_locale: fr
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Conventions de nommage {#naming-conventions}

Lorsque vous nommez des comptes, des domaines ou des actifs, vous devez garder à l'esprit les conventions suivantes utilisées dans Iroha :

1. Il existe un certain nombre de séparateurs réservés qui sont utilisés pour des types spécifiques de constructions :

   - `@` est réservé aux alias de compte et aux formulaires de compte/clé publique ciblés
   - `#` est réservé aux alias de définition d'actifs et aux littéraux de solde d'actifs
   - `::` est réservé aux alias de contrat
   - `.` est réservé à la qualification de domaine et d'espace de données
   - `$` est réservé aux identifiants NFT tels que `name$domain.dataspace`

2. Un nom doit être non vide, en forme Unicode NFC, d'une longueur maximale de 255 octets UTF-8, et exempt de caractères d'espacement, de caractères de contrôle et de caractères de contrôle bidirectionnel.

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
