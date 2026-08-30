---
translation_locale: mn
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Docker контейнерт халуун дахин ачаалл Iroha {#hot-reload-iroha-in-a-docker-container}

Орон нутгийн хэсгээс сэргээхэд зөвхөн халуун зардлыг ашигла. Байгалийн хэвийн хөгжлийн тулд зургийг сэргээн босгох эсвэл шинэхэн Kagami багцыоос үүсгэсэн Docker Compose тундрыг дахин эхлүүлэх нь дээр байна.

## Дундаж давхаргыг солих {#replace-the-peer-binary}

Linux-тай нийцсэн Daemon двойны бүтээлийг тоног төхөөрөмжээр ашиглах:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Энэ хэсгийг гүйлгээ хийж буй хоолойгоор нунтаглаж, дараа нь хоолойгоо дахин эхлүүлнэ:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Контейнерийн нэрийг баталгаажуулахын тулд `docker ps` -ийг ашиглах. Тулгарсан багт нь ижил төстэй контейнерүүдийг `./docker-compose.yml` -ээр тодорхойлж байна.

## Женезийг нэг удаа хэрэглэх сүлжээгээр дахин ашигла {#recommit-genesis-in-a-disposable-network}

Нөхөр нь зөвхөн хадгаламж нь хол байх үед л генез үйлддэг. Нэг удаа ашиглах Docker сүлжээний хувьд, тасалбарыг зогсоож, үүсгэсэн байдлыг арилгаж, гарын үсэг зурсан генез бандлыг нөхөн сэргээж эсвэл солиод, дахин эхлүүлнэ:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Үндсэн бодит байдлыг хадгалах ёстой сүлжээнд үүсэл орлуулахгүй байх.

## Хэрэглээний тохируулалт {#use-custom-configuration}

Одоогийн дундаж конфигураци нь TOML. үүсгэсэн `config.toml`, `genesis.signed.nrt` болон холбогдох гол файлуудыг зургийн хүлээсэн контейнерийн зам руу байгуулж, дараа нь дундаж эхлүүлнэ. . Бүтээсэн файлуудыг хамт хадгалах; өөр өөр Kagami гүйлгээний файлуудыг солих нь десерялаж, тохиролцооны алдааг бий болгодог.
