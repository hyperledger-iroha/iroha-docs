---
translation_locale: hy
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ծննդոց {#genesis}

Genesis- ը սահմանում է սկիզբական շղթայի վիճակը: խմբագրելի աղբյուրը JSON մանիֆեսն է, եւ Iroha 3 հանգույցը սպառում է ստորագրված Norito գործարքի ֆայլ:

::: details Նախնական գեներեզի մանիֆեսը

<<< @/snippets/genesis.json

:::

## Ֆայլեր {#files}

Upstream պահեստը առաքում է կանխարգելված մանիֆես `defaults/genesis.json`. Kagami-արտադրված ցանցերը գրում են իրենց սեփական մանիֆեստը եւ ստորագրված գործարքը արտադրանքի ցուցակի մեջ.

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Այդ ցուցակում ստեղծված `README.md` գրանցում է ընտրված պրոֆիլի համար ճշգրիտ ֆայլերը եւ գործարկման հրամանները:

## Զուգընկերների կազմավորումը {#peer-configuration}

Նշվում է, որ `config.toml`-ի `[genesis]` բաժնում ստորագրված գեներիզային գործարքի գործընկերները

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Համացանցի բոլոր զուգընկերները պետք է համաձայնեն ստորագրված գեներիզ գործարքի եւ գեներեզի հանրային բանալին:

## Ծննդոցի ստորագրությունը {#signing-genesis}

Եթե դուք ձեռքով խմբագրում եք մանիֆեսը, հաստատեք եւ ստորագրեք այն նախքան սկսելը զուգընկերներ:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS կամ Nexus պրոֆիլների համար ներառեք տոպոլոգիան եւ ստեղծված պրոֆիլի կողմից պահանջվող BLS Բնության ապացույցները: Kagami `localnet`, `wizard` եւ պրոֆիզայի արտադրման հրամանները ավտոմատ կերպով կզբաղվեն այդ մանրամասներով:

## Ծննդոցի վերագործարկումը {#recommitting-genesis}

Պարերը կատարում են գենեզը միայն այն ժամանակ, երբ դրա պահեստն դատարկ է: Մեկ անգամ օգտագործվող տեղական ցանցում նոր գենեզի փորձարկելու համար դադարեցրեք զուգընկերներին, հանեք ստեղծված պետության ցուցակը եւ սկսեք նոր ստորագրված գենեզից: Մի փոխարինեք Գենեզը վազող ցանցում, քանի դեռ յուրաքանչյուր հավաստավորիչ չի համակարգում նույն միգրացիան.
