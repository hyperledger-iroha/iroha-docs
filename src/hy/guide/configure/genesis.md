---
translation_locale: hy
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: google-translate+reviewed-delta+reviewed-first-release-source-amendment
---
# Գենեզիս {#genesis}

Գենեզիսը սահմանում է շղթայի սկզբնական վիճակը:Խմբագրելի աղբյուրը ա JSON դրսևորվում է, և ան Iroha 3 հանգույցը սպառում է ստորագրված Norito գործարքի ֆայլ:

::: details Կանխադրված ծագման դրսևորում

<<< @/snippets/genesis.json

:::

## Ֆայլեր {#files}

Հիմնական աղբյուրի պահոցը լռելյայն սկզբնական ձևանմուշ է տրամադրում `defaults/genesis.template.json`-ում։ Ձևանմուշն անավարտ է և չի կարող վավերացվել, ստորագրվել կամ օգտագործվել հանգույցի կողմից, մինչև `kagami genesis materialize`-ը այն չվերածի մանիֆեստի։ Kagami-ով ստեղծված ցանցերն իրենց մանիֆեստն ու ստորագրված գործարքը գրում են ելքային պանակում․

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Ստեղծվածը `README.md` այդ գրացուցակում գրանցում է ճշգրիտ ֆայլերը և գործարկում հրամաններ ընտրված պրոֆիլի համար:

## Հանգույցների կոնֆիգուրացիա {#peer-configuration}

Հանգույցները `config.toml`-ի `[genesis]` բաժնում նշում են ստորագրված ծագման գործարքը և դրա սպասվող հեշն ամրագրում առանձին ֆայլում․

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

Ցանցի բոլոր հանգույցները պետք է համաձայնեն ստորագրված ծագման գործարքի և ծագման հանրային բանալու շուրջ։ Սպասվող հեշի ֆայլը պարտադիր է ինչպես առաջին, այնպես էլ կրկնակի մեկնարկի ժամանակ․ այն գրում է `kagami genesis sign --expected-hash-out`-ը։

## Ստորագրելով Գենեզիսը {#signing-genesis}

Եթե ​​դուք խմբագրում եք մանիֆեստը ձեռքով, հաստատեք և ստորագրեք այն նախքան հանգույցները սկսելը.

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` պետք է լինի սեփականատիրոջ կողմից պահվող ռեժիմ-`0600`, միայնակ կապ սովորական ֆայլ, որը պարունակում է մեկ կանոնական մասնավոր բանալու մուլտիհեշ և վերջնական նոր գիծ. Kagami մերժում է խորհրդանշական կապերը և երբեք չի ընդունում հում ծագման մասնավորը բանալին հրամանի տողում:

NPoS կամ SORA Nexus պրոֆիլների համար ներառեք ստեղծված պրոֆիլի պահանջած տոպոլոգիան և BLS տիրապետման ապացույցները։ Kagami-ի `localnet generate`, `wizard` և `sora-network generate` հրամաններն ավտոմատ մշակում են այդ մանրամասները։

## Գենեզիսի վերահաստատում {#recommitting-genesis}

Նոր ցանցը մեկնարկում է իր ստորագրված սկզբնաբլոկից։ Ժամանակավոր տեղային ցանցում այլ սկզբնաբլոկ փորձարկելու համար կանգնեցրեք հանգույցները, հեռացրեք դրանց ստեղծած վիճակի պանակը և մեկնարկեք նոր ստորագրված սկզբնաբլոկով։ Գործող ցանցում սկզբնաբլոկի փոխարինումը երբեք չպետք է օգտագործվի որպես արդիականացման միջոց։ Արձանագրության սահմանումների փոփոխությունները պահանջում են կառավարման միջոցով հաստատվող ընտրության անցումներ և ընտրված սահմանումների ու պարտավորությունների համար որակավորման ստուգումներ։
