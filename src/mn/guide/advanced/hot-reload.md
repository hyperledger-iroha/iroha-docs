---
translation_locale: mn
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Халуун ачаалал Iroha а Docker Төгсгүйн {#hot-reload-iroha-in-a-docker-container}

Орон нутгийн засварын тулд зөвхөн халуун зардлыг ашигла.
зургийг сэргээн босгох эсвэл үүсгэсэн зургийг дахин эхлүүлэх Docker Compose а
шинэ Kagami Хүлээн.

## Дундаж дугаар давхаргыг солих {#replace-the-peer-binary}

Linux-тай нийцсэн Daemon бинарыг тоног төхөөрөмжээс бүтээх:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Энэ хэсгийг гүйлгээ хийж буй эгнэрийн контейнерт копилж, дараа нь энэ контейнерээ дахин эхлүүлээрэй:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Хэрэглээ `docker ps` Тоног бүтээсэн баглаанд
агууламж нь: `./localnet/docker-compose.yml`.

## Женезийг нэг удаа ашиглаж болно {#recommit-genesis-in-a-disposable-network}

Хөгжлийн хүн зөвхөн хадгаламж нь хол байх үедээ л үүсэл байгуулах юм. Docker
сүлжээ, тулаан зогсоож, үүсгэсэн байдлыг арилгаж,
Генезисийн гарын үсэг зурсан багц, дахин эхлүүлнэ:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Үндсэн суурь тогтолцоог хэвээр үлдээх ёстой сүлжээний орлогын оронд оруулма.

## Хувьцаасан тохируулалтыг ашигла {#use-custom-configuration}

Одоогийн дундаж хувилбар нь TOML. Нөхөрөгдөл үүсгэгдсэн
`config.toml`, `genesis.signed.nrt`, болон холбогдох гол файлуудыг контейнерт
зураг хүлээсэн зам, дараа нь дундаж эхлүүлэх. үүсгэсэн файлуудыг хадгалах
хамтдаа; янз бүрийн файлуудыг солих Kagami гүйлтийн үр дүнд дизериализ, эсвэл
Үндсэн санал нэгдлийн алдаа.
