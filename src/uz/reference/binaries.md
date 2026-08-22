---
translation_locale: uz
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# Bilan ishlash Iroha Ikkilik {#working-with-iroha-binaries}

The Iroha 3 Operatorning ish jarayoni uchta asosiy ikkilik atrofida aylanadi:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) tengdosh demonini ishga tushirish uchun
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) uchun CLI va operator buyruqlari
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) kalitlar, genezis, lokal tarmoqlar va profillar uchun

## Manbadan yaratish {#build-from-source}

Yuqoridagi ish maydoni ildizidan:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Reliz ikkiliklari keyin mavjud bo'ladi `target/release/`.

Buyruqlar yuzasini tekshirish uchun:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## To'g'ridan-to'g'ri ombordan ishga tushirish {#run-directly-from-the-repository}

Agar siz global miqyosda biror narsani o'rnatishni xohlamasangiz, foydalaning `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Rasm {#docker-image}

Yuqori oqimdagi ish maydoni foydalanadi `kagami localnet` va `kagami docker` hosil qilish
Docker Compose tekshirilgan kodga mos keladigan fayllar.The `hyperledger/iroha:dev`
tasvir ushbu yaratilgan fayllar bilan ishlatilishi mumkin.

ni ishga tushiring CLI konteynerda:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Yugurish Kagami konteynerda:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Tengdosh ishga tushirish uchun avval localnet yarating va faylni tuzing:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Qaysi ikkilikdan foydalanishim kerak? {#which-binary-should-i-use}

- Foydalanish `irohad` tengdoshlaringizni ishga tushirayotganingizda yoki ishlayotganingizda.
- Foydalanish `iroha` daftarni so'rash, tranzaktsiyalarni topshirish yoki operatorning so'nggi nuqtalarini tekshirish kerak bo'lganda.
- Foydalanish `kagami` sizga kalitlar, genezis manifestlari, profil to'plamlari yoki mahalliy tarmoq aktivlari kerak bo'lganda.

## Kagemusha nashri va chiqarilishi {#kagemusha-release-publication-and-rollout}

Kagemusha V4 nashr qilish va faollashtirish alohida himoyalangan chegaralarni kesib o'tadi:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` hisoblanadi
  faqat macOS uchun, faqat root nashriyotchisi.U mahkamlanganlarni tasdiqlaydi Kagami ikkilik va
  aniq o'n olti-fayl nomzod, yo'q nashr
  `promotion-record-v4.norito` almashtirishsiz va faqat muvaffaqiyat haqida xabar beradi
  aniq o'n yetti-fayl targ'ib ozod tekshiradi keyin.
- `iroha offline kagemusha rollout-v4 create-expectations` imzolanganligini tasdiqlaydi
  bron qilish, to'rtta buyurtma qilingan validator malaka muhri, aniq
  allaqachon ruxsat berilgan tranzaksiya simi va ishonchli yakunlangan langar
  imzolangan umidlarni almashtirmasdan nashr qilish.
- `iroha offline kagemusha rollout-v4 submit` aniq talab qiladi
  `--write-authorized` rozilik.U doimiy ravishda jurnalga yozib boradi va aniqlikni qayta tekshiradi
  tarmoq yozish yoki qayta urinishdan oldin kutilgan.An `Applied` holat emas
  yetarli: buyruq ham bajarilgan blokni, yakuniy vorisni tekshiradi
  zanjir, va to'liq avtorizatsiyaga ega tranzaksiya simi.
- `iroha offline kagemusha rollout-v4 finalize-receipt` xuddi shu isbot bilan
  mustahkamlangan dalillarni faqat aniq yuborish jurnali qayta tekshirilgandan
  keyingina to'playdi, ularni mustaqil kvitansiya emitenti bilan imzolaydi va
  kanonik kvitansiyani almashtirmasdan nashr etadi.

Tekshirilgan Kagemusha ishlab chiqarishga tayyor ish jarayoni faqat tekshirish uchun mo'ljallangan.
Bu autentifikatsiya qilingan nashriyotchini chaqirmaydi, validator malakasini nashr etadi
muhr qo'ying, faollashtirishni yuboring yoki yakuniy kvitansiyani yarating.Muvaffaqiyatli ish jarayoni
shuning uchun ishga tushirish na reklamani, na jonli tarqatishni isbotlamaydi.

Bu buyruqlar mahalliy ibtidoiy bo'lib, jonli dalillar o'rnini bosmaydi.A
haqiqiy jismoniy App Attest va holda ishlab chiqarishni yo'lga qo'yish bloklangan qoladi
nomzod artefaktlari, barcha to'rtta himoyalangan xost muhrlari, ish vaqti boshqaruvi va
kirishlarni imzolash, jonli to'rtta-validator taqdim etish va yakuniy dalillar, va
kanonik samarali konfiguratsiya proyeksiyasi.Shaxsiy kalitlarni saqlang,
autentifikatsiya materiali va himoyalangan reklamaga xos identifikatorlar
ish vaqtini saqlash;ularni manba tomonidan boshqariladigan hujjatlarga ko'chirmang yoki
operator chiptalari.
