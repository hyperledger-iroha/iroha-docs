---
translation_locale: uz
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Joriy tugun konfiguratsiyasi TOML formatida. Kagami har bir validator uchun `genesis.signed.nrt`, `genesis.public_key` va `genesis.expected_hash` bilan birga bitta `peerN.toml` yozadi; `kagami docker` yaratgan Compose fayli ularni konteynerga ulaydi. Fayllarni qo‘lda ko‘chirish o‘rniga uni qayta yarating, keyin tugunni qayta ishga tushiring. Yaratilgan fayllarni birga saqlang; turli Kagami ishlaridagi fayllarni aralashtirish deserializatsiya yoki konsensus xatolariga olib kelishi mumkin.
