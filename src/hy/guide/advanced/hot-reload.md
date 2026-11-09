---
translation_locale: hy
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha տաք վերբեռնվածություն Docker պահոցում {#hot-reload-iroha-in-a-docker-container}

Թեժ վերաբեռնումը կիրառեք միայն տեղային վրիպազերծման համար։ Docker-ում նույն վերանայման գործարկվող ֆայլերով չորս վավերացնող հանգույց կառուցելու և գործարկելու համար հետևեք [Լանչում Iroha 3](/hy/get-started/launch-iroha.md) ուղեցույցին։

## Փոխարինեք հանգույցի գործարկվող ֆայլը {#replace-the-peer-binary}

Ստեղծեք Linux- ի հետ համատեղելի դեյմոնների բինար ՝ վերեւի աշխատանքային տարածքից:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Կփոխել այն գործող հանգույցային կոնտեյներ, ապա վերագործարկել այն կոնտեյները:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Կոնտեյները գտնելու համար օգտագործեք `docker ps`։ Նախքան ծառայության գործարկվող ֆայլը փոխարինելը՝ ստուգեք դրա ուղին պատկերի մեջ։

## Գինեզիսը վերակառուցել մեկ անգամ օգտագործվող ցանցում {#recommit-genesis-in-a-disposable-network}

Նոր սկզբնաբլոկի համար հանգույցի պահոցը պետք է դատարկ լինի։ Նույն ցանցը վերագործարկելու համար գործարկեք `python3 poc.py down` և ապա `python3 poc.py up`։ `state/` գրացուցակը պահեք իր չորս Docker հատորների հետ միասին։

## Օգտագործեք հարմարվողական կազմաձեւում {#use-custom-configuration}

Ներկայիս հանգույցային կոնֆիգուրացիան TOML է: Կապեք կամ պատճենեք առաջադրված `config.toml`, `genesis.signed.nrt` եւ դրանց հետ կապված հիմնական ֆայլերը պատկերով սպասվող պահեստային ուղիների մեջ, այնուհետեւ վերսկսեք հանգույցը: Պահպանեք ստեղծված ֆայլերը միասին. տարբեր Kagami երթեւեկություններից ֆայլերի խառնումը կարող է առաջացնել deserialization կամ համաձայնության ձախողումներ:
