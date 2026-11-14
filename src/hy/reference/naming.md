---
translation_locale: hy
translation_source: /reference/naming.md
translation_source_hash: 1d4d698597542d9c84284d0b87dae8a1825d3ab39ff38dd32bb204d41291c83d
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link
---
# Կոնվենցիաների անվանումը {#naming-conventions}

Հաշվետքերի, տիրույթների կամ ակտիվների անվանումի ժամանակ պետք է հիշեք Iroha-ում օգտագործվող հետեւյալ կոնվենցիաները.

1. Կան մի շարք հատկացված բաժանիչներ, որոնք օգտագործվում են կոնկրետ տիպի շինությունների համար.

   - `@` պահվում է հաշիվների գաղտնաբառերի եւ նպատակային հաշիվների/հասարակական բանալիների ձեւերի համար:
   - `#` պահվում է ակտիվների սահմանման կեղծանունների եւ ակտիվների մնացորդի բառերի համար
   - `::` պահպանվում է պայմանագրային կեղծանունների համար
   - `.` պահվում է տիրույթի եւ տվյալների տարածքի որակավորման համար
   - `$` պահվում է գրական ձեւերի համար, որոնք օգտագործվում են trigger-scoped
   - `%` պահված է վավերացողի կողմից ստացված տեքստային ձեւերի համար

2. UTF-8 տառերի առավելագույն թիվը, որը կարող է ունենալ անվանումը, սահմանափակվում է երկու գործոններով. `[0, u32::MAX]` եւ ներկայումս հատկացված փաթեթային տարածությունը:

## Փորձեք այն Taira {#try-it-on-taira}

Բացահայտել հանրային ակտիվի alias-ը իր կանոնական ակտիվների սահմանման մեջ ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Համեմատեք այն ակտիվների սահմանման ցուցակի հետ.

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` նիշը բաժանում է ակտիվի alias- ը դոմեյնային համատեքստից: Պահպանեք այն պարզ անուններից, քանի դեռ դուք միտումնավոր չեք գրում ակտիվների alias կամ ակտիվների մնացորդի բառացի անվանման:
