---
translation_locale: mn
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Халуун дахин ачаалалт Iroha нь Docker Саванд {#hot-reload-iroha-in-a-docker-container}

Зөвхөн локал алдааг олж засахад халуун ачаалал ашигла. Энгийн локал хөгжүүлэлтэд хэв шинжийг дахин байгуулах эсвэл шинэ Kagami багцаас үүсгэсэн Docker Compose стекээ дахин эхлүүлэхийг илүүд үзнэ үү.

## Сүлжээний хамтрагч Binary-г солих {#replace-the-peer-binary}

Дээд түвшний ажлын орчингоос Linux-тэй нийцсэн демон бинар гаргаж ав:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Үүнийг ажиллаж байгаа сүлжээний оролцогч контейнерт хуулж, дараа нь тэр контейнерийг дахин эхлүүлнэ үү:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Савны нэрийг нотлохын тулд `docker ps`-ийг ашиглана уу. Үүссэн стэкт сүлжээний түнш савнууд `./docker-compose.yml`-ээр тодорхойлогддог.

## Нэг удаагийн сүлжээнд блокчэйн үүсгэгчийг дахин амлах {#recommit-genesis-in-a-disposable-network}

Сүлжээний хамтрагч нь сан нь хоосон үед л блокчэйн генийг эхлүүлдэг. Түр хэрэглээний Docker сүлжээний хувьд багцыг зогсоож, үүсгэсэн төлөвийг устгаж, гарын үсэг зурсан блокчэйн гений багцыг дахин үүсгэх эсвэл солиж, дахин эхлүүлнэ:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Төлөв байдал нь хадгалагдах ёстой сүлжээнд блокчейн генезисийг сольж болохгүй.

## Өөрийн тохиргоог ашиглах {#use-custom-configuration}

Одоогийн сүлжээний хөршийн тохиргоо нь TOML байна. Үүсгэсэн `config.toml`, `genesis.signed.nrt` ба холбогдох түлхүүр файлуудыг савны замууд руу холбох mount хийх эсвэл хуулж оруулна уу зураг, дараа нь сүлжээний хөршийг дахин эхлүүл. Үүсгэсэн файлуудыг нэгт байлга; өөр өөр Kagami ажиллуулсан файлуудыг холих нь десериализаци эсвэл нийцлийн алдаа үүсгэж болзошгүй.
