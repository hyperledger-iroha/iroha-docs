---
translation_locale: hy
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Musubi Kotodama Փաթեթներ {#musubi-kotodama-packages}

Musubi -ը Kotodama աղբյուրային փաթեթների առաջին թողարկման փաթեթի կառավարիչն է: Այն լուծում է ճշգրիտ շղթայի վրա կախվածության գրաֆիկը, հաստատում է SoraFS աղբյուրային արխիվներ, կազմում եւ թեստավորում է ընտրված աշխատանքային տարածքը, կառուցում կանոնիկ CAR արխիվեր եւ հրապարակում անփոխարինելի թողարկումներ Iroha միջոցով։

Օգտագործեք Musubi, երբ անհրաժեշտ է:

- հրապարակել վերաօգտագործելի Kotodama գործառույթների գրադարաններ
- Նշեք ճշգրիտ անցումային գրաֆիկը `Musubi.lock`
- վերակառուցել կախվածության աղբյուրը վերջնականացված SoraFS արխիվային պարտավորություններից
- կառուցել եւ փորձարկել մեկ փաթեթ կամ մի քանի փաթեթի աշխատանքային տարածք
- ստուգել, հրապարակել, դուրս հանել, պահպանել կամ alias փաթեթներ միջոցով առցանց գրանցման

## Փաթեթների անուններ {#package-names}

Canonical փաթեթավորման ընտրիչները օգտագործում են:

```text
namespace/package
```

Ճիշտ թողարկման նույնականացողները ավելացնում են տարբերակ.

```text
namespace/package@version
```

Անունների տարածքից առաջ չկա առաջատար `@`: Անունային տարածքը կամ տվյալների տարածքի արմատն է, ինչպիսիք են `universal`-ը, կամ դոմեյնի համար որակավորված տվյալների տարածք, ինչպիսին է `dex.universal`: Գլխավոր գրասենյակը կապում է այդ կառուցվածքային անունների տարածությունը կայուն տնային տվյալների տարածքին, նախքան փաթեթը կարող է պահանջել:

## Մանիֆեստ և կողպման ֆայլ {#manifest-and-lockfile}

Փաթեթում օգտագործվում է փակ առաջին թողարկման `Musubi.toml` schema. Manifesto- ն պետք է հայտարարի `manifest-version = 1`, Kotodama հրատարակություն `"1"`, եւ IVM ABI տարբերակ `1`; չկա այլընտրանքային հաղորդագրություն կամ ABI ռեժիմը:

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

Կախվածությունները կարող են օգտագործել ճշգրիտ տարբերակներ, խնամքի կամ թիլդի պահանջներ, վայրի քարտեր, ինչպիսիք են `1.*`, եւ կոմայի առանձին համեմատական հավաքածուներ, ինչպիսիք են`>=1.0.0,<2.0.0`. Կախվածության աղյուսակի բանալին հանդիսանում է ծնողի տեղական ներմուծման alias; `package` միշտ կանոնիկ ռեգիստրի ընտրողն է:

`Musubi.lock` կապում է գրաֆիկը ճշգրիտ գենեսից ստացված `NetworkId` եւ վերջնականացված ռեգիստրի նկար: Այն գրառում է ընտրված աշխատանքային տարածքի արմատները եւ անփոխարինելի թողարկման հանգույցները, ներառյալ թողարկումը, աղբյուրը, ինտերֆեյսը, արխիվը, ABI եւ ճշգրիտ կախվածության եզրային պարտավորությունները: Parallel տարբերակները թույլատրվում են, երբ լուծված գրաֆիկը պահանջում է դրանք.

## Կոնֆիգուրում Taira SoraFS Հեռանում {#configure-taira-sorafs-fetching}

Taira-ը այս աշխատանքային հոսքի հանրային փորձարկման ցանցն է: Սկսեք Taira հաճախորդի կոնֆիգուրացիայից ՝ գրանցված շղթայով եւ ներկայիս փաթեթավորված գենեզից բխող ցանցի նույնականությամբ, այնուհետեւ ավելացրեք մատակարարին հատուկ հավաստագրված ստուգման կապերը ներքեւում: Taira վերափոխումը կարող է փոխել `NetworkId`; թարմացնել այն ստորագրված տեղակայման պրոֆիլից, փոխարենը կայուն շղթայից UUID: Հաշվագրի ստորագրման նյութը եւ մատակարարի օպերատորի բանալիները պետք է մնան միայն սեփականատիրոջ գործնական ժամկետային ֆայլերում.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

Բացահայտեք Taira ընդունված պրովայդերները հանրային փորձարկման ցանցի արմատից.

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Հաճախորդի կատալոգը տրամադրում է մատակարարի ինքնությունը եւ գովազդվող վերջային կետերը: Ընտրված մատակարարից ստացեք համապատասխանող օպերատորի թույլտվություն: Runtime- ը օգտագործում է այդ բանալին սահմանված հոսքի տոքեր պահանջելու համար. Տոքերները ոչ թե CLI փաստարկներ են, ո՛չ էլ փակման ֆայլերի բովանդակություն:

Մի օգտագործեք Taira հավաստիացնող պին URL ՝ որպես `url`: Գրանցված հավաստիացողները ներմուծել են SoraFS պահեստամասը անջատված: Նրանց `https://taira-validator-{1,2,3,4}.sora.org` վերջային կետերը ընդունում են պինի գրանցումը, մինչդեռ արխիվային ընթերցումները օգտագործում են ընտրված թույլատրված մատակարարի HTTPS ծագումը:

## Տեղական աշխատանքային հոսք {#local-workflow}

Upstream Iroha աշխատանքային տարածքի արմատից, ստեղծեք կամ մուտքագրեք փաթեթների ցուցակը եւ գործարկեք Musubi Cargo- ի միջոցով:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` լուծում է վերջնականացված գրանցման գրաֆիկը, թարմացումներ `Musubi.lock`, երբ թույլատրվում է, եւ լրացնում անփոխարինելի տեղական պահեստը հավատարմագրված SoraFS վայրերից: `check`, `build`, `test` եւ `package` կատարում են նույն գրաֆի եւ պահեստային ստուգումները նախքան իրենց աշխատանքները.

Օգտագործեք `--locked` ՝ ցանկացած փակման ֆայլի փոփոխություն մերժելու համար: Օգտագործիր `--offline` միայն այն դեպքում, երբ եւ՛ գրանցամատյան ինդեքսը, եւ՛ բոլոր պահանջվող արխիվները արդեն պահված են պահեստում: `--frozen` միավորում է այդ երկու սահմանափակումները: Առցանց պահեստը ձախողվում է. Musubi երբեք չի գրում չլուծված փակման գործիք:

Կախվածության աղբյուրները կապված են `math::add()` նման որակավորված զանգերի վերանորոգմամբ deterministic ներքին Kotodama անունների հետ: Չարտահանված ֆունկցիայի նկատմամբ կախվածության կանչը մերժվում է: Ներկրած գրադարանները բացահայտում են գործառույթները. տեղական `[[contract]]` եւ `[[test]]` թիրախները մնում են հստակ փաթեթային նպատակներ:.

## Քեշային ստուգում եւ վերանորոգում {#cache-verification-and-repair}

Հանրային պահեստային հրամանները գործում են անփոխարինելի, գրանցամատյանով հաստատված արխիվներում.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` կարանտինները կոռուպցում են վստահելի սերունդներին եւ վերափոխում են ճշգրիտ արխիվները, երբ վերջնական մատակարարի ապացույցները թույլ են տալիս: Պլորինգը դիտավորյալ փակվում է կենդանի ոչ դատարկ մուտացիայի համար. օգտագործեք `--dry-run` ՝ դասակարգված թեկնածուներին ստուգելու համար:

## Փաթեթավորում եւ հրատարակություն {#packaging-and-publishing}

Ստուգեք մաքուր դրական ֆայլերի հավաքածուն նախքան գրելը արխիվ, ապա կառուցել կանոնիկ փաթեթը.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` գրում է `target/package/<namespace>-<name>-<version>.car`. CAR-ը կապում է կանոնական փաթեթային մանիֆեստը, իմաստային թողարկման մանիֆեստը, ճշգրիտ ստուգման կողպեքը, աղբյուրի ծառը, ինտերֆեյսի ամփոփագիրը և SoraFS արխիվի պարտավորությունը: Առաջին թողարկման մեջ չկա առանձին `pack`, `--car-out`, `--sorafs-manifest-out` կամ `--source-plan-out` հրամաններ CLI.

Հրապարակումը ստորագրված, վերսկսելի ցանցային աշխատանքային հոսք է: Ընտրված `client.toml` պետք է պարունակի պահանջվող `[musubi.publication]` պարտավորությունները, ինչպես նաեւ հաշիվը եւ Taira ցանցի կարգավորումը: Փաթեթը պետք է պարունակում է ճիշտ մեկ աշխատատեղի անդամ.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Օգտագործել `--detach` Գործողության օրագիրն ու սերմերի մուտքի սահմանը տեւականից հետո վերադառնալու համար: Շարունակեք երկարատեւ աշխատանքը ՝ `publish --resume <operation-id> --config client.toml`. Կեղտոտը `--recover <operation-id>` ուղին միայն վերակառուցում է անհետ կորած անփոխարինելի օժանդակ գրառումները մաքրված նախքան մուտքի ամսագրի համար: `--dry-run` կամ ընդհանուր հանրային բեռնման հետապնդում; Run `package --list` եւ `package` տեղական թռիչքի նախապատրաստման համար:

## Գրանցման հարցումներ եւ կյանքի ցիկլ {#registry-queries-and-lifecycle}

Նույն Taira հաճախորդի կարգավորմամբ ստուգեք եւ ստուգեք վերջնականացված գրանցումը.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

Yanking- ը բացառում է նոր բանաձեւերից անփոխարինելի թողարկումը, մինչդեռ գոյություն ունեցող ճշգրիտ կողպեքները շարունակում են վերարտադրվել: Նախ կարդացեք ներկայիս yank վերանայմանը, ապա ներկայացրեք համեմատել եւ սահմանել մուտացիա.

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Օգտագործեք `unyank` նույն փաթեթ, տարբերակ, եւ նոր կարդացած վերանայման հետաձգել այդ վիճակը: Փաթեթի սեփականության եւ պահպանման դերը վերահսկողություն հրապարակել, yank, metadata, եւ արխիվային տեղակայման թույլտվությունները: Գլոբալ կեղծանունները ունեն իրենց սեփական գնի գրանցում, վերանայելու պատմություն եւ համեմատել եւ սահմանել վերանայմաններ. դրանք չեն փաթեթների սեփականության շոտքուղիներ:

## Iroha մակերեւույթներ {#iroha-surfaces}

Musubi օգտագործվում է առաջին թողարկման V1 հրահանգներ եւ հարցումներ.

|մակերեւույթը|Նպատակ|
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Կապակցեք անունների տարածքը նրա կայուն տնային տվյալների տարածքի հետ: |
|`RegisterMusubiArchiveV1` |Գրանցել անփոխարինելի վավերացված աղբյուրային արխիվի պարտավորություն: |
|`AddMusubiArchiveLocationV1` |Ավելացնել կամ վերականգնել ապացուցված SoraFS արխիվային վայրը: |
|`PublishMusubiReleaseV1` |Պահանջել կամ թարմացնել փաթեթ եւ հրապարակել մեկ անփոխարինելի թողարկում: |
|`SetMusubiReleaseYankV1` |Համեմատեք եւ տեղադրեք ճշգրիտ ազատման ձգված վիճակը: |
|`InviteMusubiPackageMaintainerV1` |Սկսեք բացասական փաթեթային դերի հրավիրման հոսքը: |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Գրանցվեք կամ վերանայեք կառավարված գլոբալ alias- ը: |
|`AssertMusubiReleaseDigestV1` |Պնդիր ճշգրիտ անփոխարինելի արտանետման մաշկը: |
|`FindMusubiExactPackageV1` |Կարդացեք մեկ ճշգրիտ փաթեթ եւ դրա վերանայմանները: |
|`FindMusubiExactReleaseV1` |Կարդացեք մեկ ճշգրիտ արձանագրություն: |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Բացահայտեք կամ ցուցակագրեք վերջնականացված ազատման թեկնածուները: |
|`FindMusubiArchiveLocationsV1` |Կարդացեք վերջնականացված մատակարարների կողմից աջակցված արխիվային վայրերը: |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Կարդացեք ներկայիս թիրախի գաղտնաբառը կամ դրա անփոփոխ պատմությունը: |

Torii Բացահայտում է հավելվածի երթուղիների ընտանիքը `/v1/musubi/*`. MCP գործիքները օգտագործում են հոսքը `iroha.musubi.queries.*` եւ `iroha.musubi.instructions.*` անուններ: Տեսեք [Torii վերջնական կետեր](/hy/reference/torii-endpoints.md) եւ [հարցման հղում](/hy/reference/queries.md) ավելի լայնի համար API քարտեզ։
