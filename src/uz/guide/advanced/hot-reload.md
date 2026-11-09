---
translation_locale: uz
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Issiq Qayta Yuklash Iroha bir Docker konteynerda {#hot-reload-iroha-in-a-docker-container}

Tezkor qayta yuklashdan faqat mahalliy nosozliklarni tuzatishda foydalaning. Docker’da bir xil manba versiyasidan yigʻilgan bajariladigan fayllar bilan toʻrtta validatorni ishga tushirish uchun [Ishga tushurish Iroha 3](/uz/get-started/launch-iroha.md) qoʻllanmasiga amal qiling.

## Tarmoq qo‘shnisi Binary ni almashtiring {#replace-the-peer-binary}

Yuqori oqim ish maydonchasidan Linux-ga mos daemon ikkilik faylini tuzing:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Uni ishlayotgan tugun konteyneriga ko‘chiring, so‘ng o‘sha konteynerni qayta ishga tushiring:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Konteynerni topish uchun `docker ps` buyrugʻidan foydalaning. Demonni almashtirishdan oldin uning tasvirdagi yoʻlini tekshiring.

## Bir martalik Tarmoqda blockchain asosini qayta majbur qilish {#recommit-genesis-in-a-disposable-network}

Yangi genezis bloki uchun tugun ombori boʻsh boʻlishi kerak. Oʻsha tarmoqni qayta ishga tushirish uchun avval `python3 poc.py down`, keyin `python3 poc.py up` buyrugʻini bajaring. `state/` katalogini tarmoqning toʻrtta Docker jildi bilan birga saqlang.

## Maxsus Sozlamalardan Foydalaning {#use-custom-configuration}

Joriy tugun konfiguratsiyasi TOML formatida. Yaratilgan `config.toml`, `genesis.signed.nrt` va tegishli kalit fayllarini tasvir kutgan konteyner yo‘llariga ulang yoki ko‘chiring, keyin tugunni qayta ishga tushiring. Yaratilgan fayllarni birga saqlang; turli Kagami ishlaridagi fayllarni aralashtirish deserializatsiya yoki konsensus xatolariga olib kelishi mumkin.
