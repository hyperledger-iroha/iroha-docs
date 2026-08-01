---
translation_locale: hy
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha տաք վերբեռնվածություն Docker պահոցում {#hot-reload-iroha-in-a-docker-container}

Օգտագործեք սառը վերբեռնում միայն տեղական թերագրման համար: Բնականոն տեղական զարգացման համար նախընտրեք վերակառուցել նկարը կամ վերսկսել ստեղծված Docker Compose փաթեթը նոր Kagami փաթեթի միջոցով:

## Փոխանակել զուգընկերների երկկողմը {#replace-the-peer-binary}

Ստեղծեք Linux- ի հետ համատեղելի դեյմոնների բինար ՝ վերեւի աշխատանքային տարածքից:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Կփոխել այն գործող զուգընկերային կոնտեյներ, ապա վերագործարկել այն կոնտեյները:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Օգտագործեք `docker ps` կոնտեյների անվանումը հաստատելու համար: Ստեղծված փաթեթում զուգընկերային կոնտեյները սահմանվում են `./localnet/docker-compose.yml`.

## Գինեզիսը վերակառուցել մեկ անգամ օգտագործվող ցանցում {#recommit-genesis-in-a-disposable-network}

Պերը կատարում է գեներեզը միայն այն ժամանակ, երբ դրա պահեստը դատարկ է: Մեկ անգամ օգտագործվող Docker ցանցի համար դադարեցրեք փաթեթը, հեռացրեք ստեղծված վիճակը, վերածեք կամ փոխարինեք ստորագրված գեներիզային փաթեթի եւ սկսեք նորից.

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Մի փոխարինեք գենեզը ցանցի վրա, որի վիճակը պետք է պահպանվի:

## Օգտագործեք հարմարվողական կազմաձեւում {#use-custom-configuration}

Ներկայիս զուգընկերային կոնֆիգուրացիան TOML է: Կապեք կամ պատճենեք առաջադրված `config.toml`, `genesis.signed.nrt` եւ դրանց հետ կապված հիմնական ֆայլերը պատկերով սպասվող պահեստային ուղիների մեջ, այնուհետեւ վերսկսեք զուգընկերը: Պահպանեք ստեղծված ֆայլերը միասին. տարբեր Kagami երթեւեկություններից ֆայլերի խառնումը կարող է առաջացնել deserialization կամ համաձայնության ձախողումներ:
