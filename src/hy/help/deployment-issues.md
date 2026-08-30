---
translation_locale: hy
translation_source: /help/deployment-issues.md
translation_source_hash: 5c7d26b39d4ddf4e7e164f7bef79c9e1659db51587fb0dde9cf3f1dc0e3b057b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Տեղադրման խնդիրների լուծումը {#troubleshooting-deployment-issues}

Այս բաժինը առաջարկում է խնդիրների լուծման խորհուրդներ Iroha 3 տեղակայումների համար: Եթե խնդիրը չի նկարագրվել այստեղ, կապվեք մեզ հետ [Telegram](https://t.me/hyperledgeriroha).

## Սկսեք ստեղծված արվեստի գործիքներով: {#start-with-generated-artifacts}

Տեղական եւ փորձարկման տեղակայման համար նախընտրեք Kagami կողմից ստեղծված արվեստի գործիքներ ձեռքով գրված զուգահեռ ֆայլերի փոխարեն.

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Ստեղծված ցուցակը պարունակում է զուգընկերների կոնֆիգներ, գենեզի նյութեր, սկիզբային գրառումներ եւ README ՝ Iroha 3 կառուցման գծի համար:

## Դեռահասները չեն սկսում {#peer-does-not-start}

Նախ ստուգեք հետեւյալ կետերը.

- `iroha3d --config <path>` կետերը, որոնք գտնվում են գործընկերոջ սեփական TOML ֆայլում:
- `public_key` եւ `private_key` զուգընկերային կոնֆիգում պատկանում են նույն բանալիների զույգին:
- `genesis.public_key` համապատասխանում է գենեզիսային գործարքի ստորագրման համար օգտագործված բանալին:
- վավերացնող զուգընկերների ինքնությունները օգտագործում են BLS-նորմալ բանալիներ, եւ `trusted_peers_pop` պարունակում է տեղական բանալի եւ վստահելի զուգընկերի սեփականության ապացույցի գրառումներ:
- Torii եւ P2P նավահանգիստները դեռեւս չեն կապված այլ գործընթացի հետ:
- Kura խանութների ցուցակը պատկանում է նույն շղթայի եւ չի կրկնվել մեկ այլ ցանցային պրոֆիլից:

Օգտագործեք config tracing, երբ daemon- ը կարդում է ավելի քան մեկ TOML շերտ.

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker եւ Համադրում {#docker-and-compose}

Generate Compose from the current Kagami localnet output so that the command-line arguments and config files match the checked-out code: Ստեղծեք կազմել ներկա localnet ելքից, որպեսզի հրամանատարի գծի փաստարկները եւ կոնֆիգերի ֆայլերը համապատասխանում են ստուգված կոդին.

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Եթե կոմպոզատոր տեղադրումը սկսվում է, ապա կանգ է առնում, ստուգեք դեյմոնների օրագրերը ՝

- անհամապատասխան `chain`
- մեկ զուգընկեր, որը օգտագործում է այլ գենեզի գործարք կամ դրսեւորում
- գովազդված P2P հասցեներ, որոնք գործում են միայն կոնտեյներային ցանցում:
- տեղական ծավալի վերաօգտագործումը վերականգնումից հետո

Երբ փորձարկում եք նոր գեներեզ, հանեք հին Kura ծավալները, նախքան վերսկսելը: Հին բլոկների պահպանումը նոր գեենեզիսով թույլ կտա կրկնօրինակումը անհաջողություն ունենա.

## Կուբերնետներ {#kubernetes}

Kubernetes- ի համար, յուրաքանչյուր վավերացնողին վերաբերվեք որպես պետական ենթակառուցվածք.

- տալ յուրաքանչյուր զուգընկերին կայուն ինքնության բանալին եւ կայուն մշտական ծավալ:
- բաց թողնել P2P հասցեները, որոնք այլ գործընկերներ կարող են լուծել կլաստերի ներսից:
- տեղադրել config եւ genesis ֆայլերը որպես անփոխարինելի config հանելու համար
- գործարկել բոլոր գենեզի կամ տոպոլոգիայի փոփոխությունները կանխամտածված, ոչ թե որպես ավտոմատ ձեւավորման քարտեզի թարմացում:

Եթե պոդը վերսկսվում է բազմիցս, համեմատեք պոդում ներկայացված կոնֆիգը սպասվող [`peer.template.toml`](/hy/reference/peer-config/index.md#template)-ի հետ եւ ստուգեք, թե արդյոք զուգընկերն կրկնում է հին Kura տվյալները:

## Սորայի պրոֆիլ {#sora-profile}

Iroha 3 տեղակայումները, որոնք օգտագործում են Nexus, SoraFS կամ բազմակողմանի հոսքեր, պետք է սկսեն դեյմոնը՝ Սորա պրոֆիլն ակտիվացնելով.

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

Օգտագործեք նույն պրոֆիլը միեւնույն ցանցի վավերացողների միջեւ:
