---
translation_locale: mn
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Халуун дахин ачаалалт Iroha нь Docker Саванд {#hot-reload-iroha-in-a-docker-container}

Шууд дахин ачаалахыг зөвхөн дотоод орчинд алдаа оношлоход ашиглана уу. Нэг эх кодын хувилбараас бүтээсэн хоёртын файлуудаар Docker дээр дөрвөн баталгаажуулагч ажиллуулахдаа [Эхлүүлэх Iroha 3](/mn/get-started/launch-iroha.md) зааврыг дагана уу.

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

Контейнерийг олохын тулд `docker ps` командыг ашиглана уу. Демоныг солихын өмнө дүрс дэх замыг нь шалгана уу.

## Нэг удаагийн сүлжээнд блокчэйн үүсгэгчийг дахин амлах {#recommit-genesis-in-a-disposable-network}

Шинэ эхлэлийн блок ашиглахын тулд зангилааны хадгалах сан хоосон байх ёстой. Ижил сүлжээг дахин эхлүүлэхдээ эхлээд `python3 poc.py down`, дараа нь `python3 poc.py up` командыг ажиллуулна уу. `state/` лавлахыг сүлжээний дөрвөн Docker ботьтой хамт хадгална уу.

## Өөрийн тохиргоог ашиглах {#use-custom-configuration}

Одоогийн зангилааны тохиргоо нь TOML юм. Kagami баталгаажуулагч бүрт `genesis.signed.nrt`, `genesis.public_key` болон `genesis.expected_hash`-тай нэг `peerN.toml` бичдэг; `kagami docker`-оос гарсан Compose файл тэдгээрийг контейнерт холбож өгнө. Файлуудыг гараар хуулахын оронд түүнийг дахин үүсгээд, дараа нь зангилааг дахин эхлүүлнэ үү. Үүсгэсэн файлуудыг хамт байлгана уу; өөр өөр Kagami ажиллуулалтаас гарсан файлуудыг холивол десериализацийн эсвэл зөвшилцлийн алдаа гарч болзошгүй.
