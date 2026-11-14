---
translation_locale: hy
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

Հանգույցի ընթացիկ կարգավորումը TOML ձևաչափով է։ Kagami-ն յուրաքանչյուր վավերացնողի համար գրում է մեկ `peerN.toml`՝ `genesis.signed.nrt`-ի, `genesis.public_key`-ի և `genesis.expected_hash`-ի հետ միասին. `kagami docker`-ի ստեղծած Compose ֆայլը դրանք միացնում է կոնտեյների մեջ։ Ֆայլերը ձեռքով պատճենելու փոխարեն վերստեղծեք այն, ապա վերագործարկեք հանգույցը։ Ստեղծված ֆայլերը պահեք միասին. տարբեր Kagami գործարկումներից ֆայլերի խառնումը կարող է առաջացնել ապասերիալացման կամ կոնսենսուսի ձախողումներ։
