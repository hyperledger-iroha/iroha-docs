---
translation_locale: ba
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Конгресстарҙың исемдәре {#naming-conventions}

Иҫәптәрҙе, домендарҙы йәки активтарҙы атағанда, һеҙ Iroha та ҡулланылған түбәндәге конвенцияларҙы иҫтә тотоу кәрәк:

1. Конструкцияларҙың айырым төрҙәре өсөн ҡулланылған бер нисә һаҡланған айырғыс бар:

   - `@` хисап исемдәре һәм иҫәп/халыҡ асҡысы формалары өсөн тәғәйенләнгән.
   - `#` активтар билдәләмәһе алфавиттары һәм активтар балансы буквалдары өсөн һаҡланған
   - `::` контракт исемдәре өсөн һаҡлана
   - `.` домендар һәм мәғлүмәт майҙансыҡтары квалификацияһы өсөн тәғәйенләнгән
   - `$` `name$domain.dataspace` кеүек NFT идентификаторҙары өсөн һаҡлана

2. Исем буш булмаҫҡа, Unicode NFC формаһында булырға, оҙонлоғо 255 UTF-8 байттан артмаҫҡа һәм аралыҡ, идара итеү һәм ике яҡлы йүнәлеште идара итеү символдарын үҙ эсенә алмаҫҡа тейеш.

## Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Йәмәғәт активы алиасын уның каноник актив билдәләмәһе ID-һына хәл итегеҙ:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Быны активтарҙы билдәләү исемлеге менән сағыштырығыҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` тамғаһы активтың алфавитын домен контексынан айыра. Әгәр һеҙ аңлы рәүештә активдың алфавиты йәки актив балансы һүҙмә-һүҙен яҙмаһағыҙ, уны ябай исемдәрҙән һаҡлағыҙ.
