---
translation_locale: hy
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# Աշխատելով հետ Iroha Երկուականներ {#working-with-iroha-binaries}

Այն Iroha 3 Օպերատորի աշխատանքային հոսքը պտտվում է երեք հիմնական երկուականների շուրջ.

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) հասակակիցների դեյմոն վարելու համար
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) համար CLI և օպերատորի հրամանները
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) բանալիների, genesis-ի, լոկալ ցանցերի և պրոֆիլների համար

## Կառուցել աղբյուրից {#build-from-source}

Վերին հոսքի աշխատանքային տարածքի արմատից.

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Թողարկման երկուականներն այնուհետև հասանելի են այստեղ `target/release/`.

Հրամանի մակերեսը ստուգելու համար.

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Գործարկեք անմիջապես պահեստից {#run-directly-from-the-repository}

Եթե ​​դուք չեք ցանկանում գլոբալ որևէ բան տեղադրել, օգտագործեք `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Պատկեր {#docker-image}

Վերին հոսքի աշխատանքային տարածքը օգտագործում է `kagami localnet` և `kagami docker` առաջացնել
Docker Compose ֆայլեր, որոնք համապատասխանում են դուրս գրված ծածկագրին:Այն `hyperledger/iroha:dev`
պատկերը կարող է օգտագործվել այդ ստեղծվող ֆայլերի հետ:

Գործարկել CLI տարայի մեջ.

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Վազիր Kagami տարայի մեջ.

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Գործընկերների գործարկման համար նախ ստեղծեք տեղական ցանց և Կազմեք ֆայլ՝

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Ո՞ր երկուականը պետք է օգտագործեմ: {#which-binary-should-i-use}

- Օգտագործեք `irohad` երբ դուք սկսում եք կամ գործում եք հասակակիցների հետ:
- Օգտագործեք `iroha` երբ Ձեզ անհրաժեշտ է հարցումներ կատարել մատյանում, ներկայացնել գործարքներ կամ ստուգել օպերատորի վերջնակետերը:
- Օգտագործեք `kagami` երբ ձեզ անհրաժեշտ են բանալիներ, գենեզի մանիֆեստներ, պրոֆիլային փաթեթներ կամ տեղական ցանցի ակտիվներ:

## Kagemusha Release Publication and Rollout {#kagemusha-release-publication-and-rollout}

Կագեմուշա V4 հրապարակումը և ակտիվացումը հատում են առանձին պաշտպանված սահմանները.

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` է
  միայն macOS-ի համար, միայն արմատային հրատարակիչ:Այն նույնականացնում է ամրացվածը Kagami երկուական և
  ճշգրիտ տասնվեց ֆայլի թեկնածուն, հրապարակում է բացակաները
  `promotion-record-v4.norito` առանց փոխարինման և հաղորդում է միայն հաջողության մասին
  ճշգրիտ տասնյոթ ֆայլի խթանված թողարկումը հաստատելուց հետո:
- `iroha offline kagemusha rollout-v4 create-expectations` ստուգում է ստորագրվածը
  ամրագրում, չորս պատվիրված վավերացնողի որակավորման կնիք, ճշգրիտ
  արդեն իսկ լիազորված գործարքի լարը, և վստահելի վերջնական խարիսխը նախկինում
  ստորագրված ակնկալիքների հրապարակում՝ առանց փոխարինման։
- `iroha offline kagemusha rollout-v4 submit` պահանջում է հստակ
  `--write-authorized` համաձայնություն.Այն կայունորեն գրանցում և վերստուգում է ճշգրիտը
  ակնկալիքները նախքան ցանցը գրելը կամ նորից փորձելը:Ան `Applied` կարգավիճակը չէ
  բավական է. հրամանը նաև ստուգում է կատարված բլոկը, վերջնական իրավահաջորդը
  շղթա և ամբողջական թույլտվություն կրող գործարքի մետաղալար:
- `iroha offline kagemusha rollout-v4 finalize-receipt` հավաքում է նույն՝
  ապացույցով խարսխված վկայությունը միայն ներկայացման ճշգրիտ մատյանի կրկնակի
  ստուգումից հետո, ստորագրում է այն անկախ անդորրագրի թողարկողի միջոցով և
  հրապարակում կանոնական անդորրագիրը՝ առանց փոխարինման։

Ստուգված Kagemusha-ի արտադրության պատրաստության աշխատանքային հոսքը միայն ստուգման է:
Այն չի կանչում վավերացված հրատարակչին, հրապարակել վավերացնողի որակավորում
կնքում, ներկայացրեք ակտիվացում կամ ստեղծեք վերջնական անդորրագիր:Հաջող աշխատանքային հոսք
Հետևաբար, վազքը չի ապացուցում ոչ առաջխաղացում, ոչ էլ ուղիղ հեռարձակում:

Այս հրամանները տեղական պրիմիտիվներ են, այլ ոչ թե կենդանի ապացույցների փոխարինողներ:Ա
արտադրության թողարկումը մնում է արգելափակված՝ առանց իրական ֆիզիկական App Attest-ի և
թեկնածու արտեֆակտներ, բոլոր չորս պաշտպանված հյուրընկալող կնիքները, գործարկման ժամանակի կառավարումը և
ստորագրման տվյալները, կենդանի չորս վավերացնողի ներկայացումը և վերջնական ապացույցները, և
կանոնական արդյունավետ կոնֆիգուրացիայի պրոյեկցիա:Պահպանեք անձնական բանալիներ,
Նույնականացման նյութը և գովազդին հատուկ նույնացուցիչները պաշտպանված են
գործարկման պահառություն;մի պատճենեք դրանք աղբյուրի կողմից վերահսկվող փաստաթղթերում կամ
օպերատորի տոմսեր.
