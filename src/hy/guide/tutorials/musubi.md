---
translation_locale: hy
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Փաթեթներ {#musubi-kotodama-packages}

Musubi -ը Kotodama աղբյուրային փաթեթների փաթեթի կառավարիչն է: Այն մշակողներին տալիս է Cargo-ի նման աշխատանքային հոսք ՝ համատեղելի Kotodama գործառույթներ կիսելու համար, միաժամանակ պահպանելով փաթեդի ինքնությունը կապված SORA եւ Iroha անունների տարածքների հետ, այլ ոչ թե գլոբալ առաջին եկող անվանումների աղյուսակում:

Օգտագործեք Musubi, երբ անհրաժեշտ է:

- հրապարակել վերանայելի Kotodama աղբյուրային գրադարաններ
- Պին ճշգրիտ անցումային աղբյուրի կախվածությունները `Musubi.lock`
- վերակառուցել կախվածության աղբյուրը ստուգված SoraFS արխիվային պարտավորություններից
- միացնել փաթեթների անվան տարածությունը նույն անվան տարածքում գտնվող dapp պայմանագրային aliases- ների հետ
- ստուգել, հրապարակել, ներբեռնել կամ alias փաթեթները ցանցային գրանցման միջոցով:

## Փաթեթների անուններ {#package-names}

Քանոնիկ փաթեթավորման ID- ների օգտագործումը.

```text
namespace/package
```

Ճշգրիտ թողարկման հղումներ օգտագործվում են.

```text
namespace/package@version
```

`@` անունների տարածությունից առաջ չկա: `@` բաժանորդը հատկացվում է տարբերակային հաջորդականության համար:

Անվանային տարածքի սեգմենտը համապատասխանում է Kotodama dapp պայմանագրի կեղծանունների կողմից օգտագործվող հաջորդականությանը.

|Փաթեթի ID |Կապված պայմանագրի կեղծանունի ձեւը |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Անվան տարածքները ունեն կամ `<dataspace>` կամ `<domain>.<dataspace>` ձեւ: Երբ փաթեթը ունի dapp հղում, Musubi ստուգում է, որ յուրաքանչյուր կապված պայմանագրի alias- ը օգտագործում է նույն անվան տարածության հետապնդիչը որպես փաթեթի:

## Բացահայտված {#manifest}

Փաթեթը սկսվում է `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

Կախվածությունները կարող են օգտագործել ճշգրիտ տարբերակներ, խնամքի պահանջներ, թիլդային պահանջներ, վայրի քարտեր, ինչպիսիք են `1.*`, կամ համեմատական ցուցակներ, ինչպիսին է `>=1.0.0,<2.0.0`.

`Musubi.lock` գրանցում է ընտրված անցողական գրաֆը շղթայի ռեգիստրիից: Յուրաքանչյուր փակված հանգույց պահում է իր կանոնիկ փաթեթային ref, ընտրված պահանջը, SoraFS manifest digest, աղբյուրի արխիվի հաշշը, բայտների քանակը, ֆայլերի քանակը, արտահանված գործառույթները, դետերմինիստական աղբյուրի Արխիվի պլանը եւ կախվածության կեղծանավորները:. Կարճ կեղծանունները լուծվում են նախքան դրանք մուտք գործելը փակման ֆայլում:

## Տեղական աշխատանքային հոսք {#local-workflow}

Iroha աշխատանքային տարածքի արմատից վերեւում, վազեք Musubi Cargo- ի միջոցով.

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

Օգտագործեք `install --offline` ՝ ճշգրիտ տարբերակի կախվածությունների համար չլուծված փակման ֆայլը գրելու համար առանց բջիջի հարցումը կատարելու: Օգտագործիր `install --locked` ՝ CI-ում, որպեսզի մերժեք հնացած փակման գործածույթը:

`build` կապում է պահված կախվածության աղբյուրները ՝ վերանորոգելով զանգեր, ինչպիսիք են `math::add()` ՝ որոշողական ներքին Kotodama գործառույթների անուններով: Այն մերժում է կոչերը այն գործառույթներին, որոնք կախվածությունը չի արտահանել: Musubi v1 գրադարանները միայն ֆունկցիաներ են' կախվածության աղբյուրներ, որոնք պարունակում են պետական հայտարարություններ, գործարկիչներ, կոտոբա բլոկներ, կոնստանտներ կամ այլ ոչ-ֆունկցիոն պայմանագրային տարրեր մերժվում են:

## Գրքի աղբյուրը Archives {#fetching-source-archives}

Musubi կարող է գտնել անհետ կորած կախվածության աղբյուրները լուծման ընթացքում կամ ավելի ուշ միջոցով պահեստային ենթհրամաններ:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Գեյթվեյի կենդանի ներբեռնումները օգտագործում են մեկ կամ ավելի SoraFS մուտքի մատակարարների բնութագրեր.

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Հաճախորդի օգտակար բեռների ֆայլերը եւ մուտքի մատակարարները միմյանց բացառվում են մեկ առաքման գործողության համար: Եթե բաց է մնացել ավելի քան մեկ փակված փաթեթ, յուրաքանչյուր մուտքի մատակարարի տարածքը պետք է օգտագործվի `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` կամ `manifest=<64-hex SoraFS manifest digest>`.

Գեյթվեյը `base-url` եւ `privacy-url` արժեքները պետք է օգտագործվեն `https://` տեղական փորձարկման մուտք գործիչները կարող են օգտագործել `http://localhost`, `http://127.0.0.1`, կամ `http://[::1]` միայն `--gateway-allow-insecure-localhost`. Stream տոքերն runtime հավատարմագրեր են եւ չեն գրված է `Musubi.lock`.

## Գրականություն {#publishing}

`pack` հաշվարկում է deterministic BLAKE3-256 Աղբյուրի արխիվային хэշը գումարած աղբյուրի բայթը եւ ֆայլերը հաշվում են: Երբ `--car-out`, `--sorafs-manifest-out`, կամ `--source-plan-out` է մատակարարվում, այն նաեւ կառուցում է որոշմանական SoraFS CAR օգտակար բեռ, SoraFS մատչելի, եւ Musubi նույն աղբյուրի ֆայլերի հավաքածուից աղբյուրի արխիվային պլան:

Նախքան հրապարակումը օգտագործեք չոր վազք:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Առանց `--dry-run`, `publish` գրում է նախընտրական արվեստի գործիքներ `.musubi/dist/<namespace>/<name>/<version>/`, ընտրական կերպով բեռնում է manifest եւ payload միջոցով Torii Էս է SoraFS պահեստային փայտի ավարտական կետը `--upload`, գրանցում է ստեղծված SoraFS փաթեթ, եւ ներկայացնում `PublishMusubiRelease` Կառուցված Iroha հաճախորդը:

Հրապարակված հաղորդագրությունները պետք է ներառեն հետեւյալը.

- ոչ դատարկ կանոնական աղբյուրի արխիվ
- վճռական աղբյուրի արխիվային ծրագիր
- առնվազն մեկ արտահանված Kotodama գործառույթ
- կախվածության արձանագրությունները, որոնք չեն ընտրում զեղչված թողարկումները
- dapp հղում, երբ ներկա է, որի պայմանագրային կեղծանունները համապատասխանում են փաթեթի անվան տարածությանը

## Գրանցման հարցեր եւ կյանքի ցիկլ {#registry-queries-and-lifecycle}

Փնտրեք եւ ստուգեք գրանցամատյանը՝ օգտագործելով:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking- ը թաքցնում է նոր բանաձեւությունից ազատումը, բայց պահպանում է գոյություն ունեցող փակման ֆայլերը կրկնվող:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi-ը խուսափում է գլոբալ անվանումների կոտորածից՝ ստեղծելով `namespace/package` -ի քանոնիկ փաթեթային անունը: Անունների տարածքում հրապարակումը պետք է թույլատրվի նույն սեփականության կամ պատվիրված թույլտվությունների մոդելով, որը օգտագործվում է այդ Kotodama dapp անունների տարածքի համար: Համաշխարհային կրճատված կեղծանունները բաժանվում են փաթեթի սեփականությունից. `SetMusubiShortAlias`-ը պահանջում է `CanSetMusubiShortAlias` թույլտվություն, եւ նպատակային փաթեթը պետք է արդեն ունենա առնվազն մեկ ակտիվ թողարկում:

## Iroha մակերեւույթներ {#iroha-surfaces}

Musubi օգտագործում է առաջին դասի Iroha հրահանգներ եւ հարցումներ.

|մակերեւույթը|Նպատակ |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Հրապարակեք անփոխարինելի փաթեթավորման թողարկում: |
|`YankMusubiRelease` |Նշեք, որ ներկա արձակուրդը հանվել է: |
|`SetMusubiShortAlias` |Կապել կուրացված գլոբալ կարճ գաղտնաբառը փաթեթային նույնականացման համար: |
|`AssertMusubiReleaseExists` |Պահանջվում է կոնկրետ փաթեթային տարբերակ գոյություն ունենալու համար: |
|`FindMusubiReleaseByRef` |Գտեք լիցենզիան ըստ փաթեթի հստակ հղման: |
|`FindMusubiPackageVersions` |Փաթեթային ID- ի տարբերակների ցանկը: |
|`FindMusubiPackageReleases` |Հավաքի ID- ի համար թողարկման ամփոփումները ցուցադրեք: |
|`SearchMusubiPackages` |Փնտրեք փաթեթների ամփոփումները անունների տարածքով եւ տեքստով: |
|`FindMusubiShortAliasByName` |Բացահայտեք կարճ գաղտնաբառը:|

Torii բացահայտում է Musubi HTTP երթուղի ընտանիքը `/v1/musubi/`. Գործակալին ուղղված MCP գործիքները բացահայտվում են որպես `iroha.musubi.` կեղծանուններ, տես [Torii վերջնական կետեր](/hy/reference/torii-endpoints.md) եւ [հարցման հղում](/hy/reference/queries.md) ավելի լայնի համար API քարտեզ։
