---
translation_locale: mn
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
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

Одоогийн сүлжээний хөршийн тохиргоо нь TOML байна. Үүсгэсэн `config.toml`, `genesis.signed.nrt` ба холбогдох түлхүүр файлуудыг савны замууд руу холбох mount хийх эсвэл хуулж оруулна уу зураг, дараа нь сүлжээний хөршийг дахин эхлүүл. Үүсгэсэн файлуудыг нэгт байлга; өөр өөр Kagami ажиллуулсан файлуудыг холих нь десериализаци эсвэл нийцлийн алдаа үүсгэж болзошгүй.
