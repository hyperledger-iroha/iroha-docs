---
translation_locale: hy
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha տաք վերբեռնվածություն Docker պահոցում {#hot-reload-iroha-in-a-docker-container}

Օգտագործեք սառը վերբեռնում միայն տեղական թերագրման համար: Բնականոն տեղական զարգացման համար նախընտրեք վերակառուցել նկարը կամ վերսկսել ստեղծված Docker Compose փաթեթը նոր Kagami փաթեթի միջոցով:

## Փոխանակել զուգընկերների երկկողմը {#replace-the-peer-binary}

Ստեղծեք Linux- ի հետ համատեղելի դեյմոնների բինար ՝ վերեւի աշխատանքային տարածքից:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Կփոխել այն գործող զուգընկերային կոնտեյներ, ապա վերագործարկել այն կոնտեյները:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Օգտագործեք `docker ps` կոնտեյների անվանումը հաստատելու համար: Ստեղծված փաթեթում զուգընկերային կոնտեյները սահմանվում են `./docker-compose.yml`.

## Գինեզիսը վերակառուցել մեկ անգամ օգտագործվող ցանցում {#recommit-genesis-in-a-disposable-network}

Պերը կատարում է գեներեզը միայն այն ժամանակ, երբ դրա պահեստը դատարկ է: Մեկ անգամ օգտագործվող Docker ցանցի համար դադարեցրեք փաթեթը, հեռացրեք ստեղծված վիճակը, վերածեք կամ փոխարինեք ստորագրված գեներիզային փաթեթի եւ սկսեք նորից.

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Մի փոխարինեք գենեզը ցանցի վրա, որի վիճակը պետք է պահպանվի:

## Օգտագործեք հարմարվողական կազմաձեւում {#use-custom-configuration}

Ներկայիս զուգընկերային կոնֆիգուրացիան TOML է: Կապեք կամ պատճենեք առաջադրված `config.toml`, `genesis.signed.nrt` եւ դրանց հետ կապված հիմնական ֆայլերը պատկերով սպասվող պահեստային ուղիների մեջ, այնուհետեւ վերսկսեք զուգընկերը: Պահպանեք ստեղծված ֆայլերը միասին. տարբեր Kagami երթեւեկություններից ֆայլերի խառնումը կարող է առաջացնել deserialization կամ համաձայնության ձախողումներ:
