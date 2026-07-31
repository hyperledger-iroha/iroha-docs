---
translation_locale: uz
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Izanami bilan xaroba sinovlari {#chaos-testing-with-izanami}

Izanami - yuqori tomondagi xaos orqestratoridir. Iroha ish o'rni.
bir martalik mahalliy ishga tushiradi Iroha klaster, konfiguratsiya qilinadigan ish yukini taqdim etadi;
va o'z tengdoshlariga xatolarni injeksiya qiladi, shunda operatorlar
tarmoq nazorat qilinmagan holda rivojlanishda davom etadi.

Ishlab chiqarishdan oldingi chidamlilik tekshiruvlari, regressiya reproduksiyasi uchun Izanamidan foydalanish
Ishlab chiqarish tarmog'iga yo'naltirmang: vosita
u boshlaydigan tengdoshlarga ega bo'lish uchun mo'ljallangan, shu jumladan tengdoshlarni qayta ishga tushirish, saqlash
to'plamlar, sun'iy paket yo'qotish va mahalliy CPU yoki disk bosimini.

## Oldingi shartlar {#prerequisites}

Izanami-ni ishga tushirish
[Iroha manbai omborxona](https://github.com/hyperledger-iroha/iroha),
Ushbu hujjatlarning omboridan olinmagan:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

Ikkilamchiga tarmoqlarni yaratish va manipulyatsiya qilish uchun aniq ruxsat berish kerak
Tengdoshlar. `--allow-net` har bir no-TUI ishga tushirish yoki qo'llash `allow_net` yo'nalishi
ko'rsatilgan TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Interaktiv ishga tushirish konfiguratsiyasi uchun:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami davom etadi . TUI va CLI foydalanuvchi konfiguratsiya direktoriyasi ostida sozlamalar, shuning uchun
Oldingi profildan qayta foydalanishdan oldin ko'rsatiladigan sozlamalarni qayta ko'rib chiqish.

## Boshlangʻich yoʻnalish {#baseline-run}

Shiddatli xatolarni qo'shishdan oldin bitta qayta tiklanishi mumkin bo'lgan boshlang'ich chiziqdan boshlash:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

Ushbu ishga tushirish faqat klaster talab qilingan blok maqsadga yetsa, muvaffaqiyatli bo'ladi.
vaqtning o'tishi doirasida rivojlanishni davom ettiradi va ixtiyoriy p95 ostida qoladi
blok intervalining chegaralari.

Buyruqni yozib qo'y, urug'! Iroha qo'shish, tengdoshlar soni, noto'g'ri tengdoshlarning soni
Ish yuklari profil, maqsad TPS, va loglar bilan kechikish chegaralari.
Ushbu qiymatlarni boshqa operator o'sha xato namunasini takrorlay olmaydi.

## Ish yuklari profillari {#workload-profiles}

Izanami ikkita ish yuk profiliga ega:

| Profil  | Undan foydalanish                                         | Izohlar                                  |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` | Uzoq cho'kish va qayta tiklanishi mumkin bo'lgan ishlash tekshiruvlari | Ishlab chiqarish xavfsiz retseptlarni yoqtiradi          |
| `chaos`  | Muvaffaqiyat yo'nalishidagi qoplama                              | Niyat bilan bekor qilingan retseptlar kiradi |

Avval barqaror profildan foydalaning:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Boshlang ' ich chiziqlar allaqachon tushunilgan boʻlganda xarobaga oʻtish:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Shartnomalarni ishga tushirish retseptlari aniq ko'rsatilmaganda, barqaror ishlarda o'chiritiladi
ruxsat etiladi:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Foydalanish `--nexus` o'tishda o'rnatilgan SORA Nexus koʻrsatkichlar
oqimdan yuqori ish o'rinlari.

## Xatolarni nazorat qilish {#fault-controls}

Qachon `--faulty` noldan katta bo'lsa, kamida bitta xato xulosasi
O'z navbatida, xatolar o'rnatilgan bo'lishi mumkin.
kasallanmaganlar `=false`.

| Xato                    | CLI bayroq                                   | U nimalarni oʻz ichiga oladi                          |
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
| Avtobus va qayta ishga tushirish        | `--fault-enable-crash-restart`             | Tengdosh jarayonning yo'qolishi va tiklanishi             |
| saqlashni olib tashlash va qayta ishga tushirish | `--fault-enable-wipe-storage`              | Yo'qolgan mahalliy davlatdan tiklanish          |
| Amalga bo'lmaydigan tranzaksiya spam | `--fault-enable-spam-invalid-transactions` | Qabul qilish va rad etish yo'llari              |
| Tarmoqning kechiktirilishi          | `--fault-enable-network-latency`           | Sekin gapirish va kechiktirilgan konsensus xabarlari |
| Tarmoq partitsiyasi        | `--fault-enable-network-partition`         | Vaqtinchalik ishonchli tengdoshlardan ajralish           |
| P2P paket yo'qotish          | `--fault-enable-network-packet-loss`       | Ilovalar ramkalari trafikini kamaytirish          |
| CPU stress               | `--fault-enable-cpu-stress`                | Mahalliy tasdiqlash va rejalashtirish bosimlari   |
| Diskni toʻldirish          | `--fault-enable-disk-saturation`           | Mahalliy saqlash bosimi                     |

Faqat paketni yo'qotish uchun:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 20 \
  --faulty 5 \
  --duration 800s \
  --fault-window-start 133s \
  --fault-window-end 266s \
  --tps 200 \
  --submitters 20 \
  --max-inflight 512 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=false \
  --fault-enable-network-packet-loss=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --fault-network-packet-loss-percent 75 \
  --seed 42
```

Foydalanish `--fault-window-start` va `--fault-window-end` nazorat qilish uchun
Injeksiyadan oldin va keyin o'zgarish davrida.
ishga tushirish shovqinini xatolik ta'siridan ajratish osonroq.

## Ssenariy shakllari {#scenario-shapes}

Yuqoridagi Izanami kataloglari blockchain kommunikatsiya muvaffaqiyatsizligining umumiy xaritalarini taqdim etadi
shakllar CLI profillar. Siz ularni xuddi shu bayroqlar bilan modellashingiz mumkin:

| Ssenariy              | Tipik shakli                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Maqsadli yuk         | `--faulty 0`, yuqori `--tps`, bir kishi, yuqori `--max-inflight`                                                         |
| Oʻtkinchi xato     | Faqat cheklangan xatolar oynasida crash/resetartni qo'llash                                                                  |
| Toʻplam yoʻqotish           | Faqat paketni yo'qotishni qo'llash, odatda andoza 75% yo'qotish darajasi bilan                                                          |
| Toʻxtatish va tiklanish | Kataklash / qaytadan ishga tushirish bilan katta xatoliklarni o'z ichiga oladi                                                                    |
| Rahbarlar izolyatsiyasi      | Faqat tarmoq partitsiyasi yoki paket yo'qotish xatolari bilan bitta nosoz tenglamani ishlating; Izanami quyidagicha Sumeragi yetakchi telemetriyasi |

Bir vaqtning o'zida bir o'zgaruvchini to'g'ri saqlang. Agar siz tengdoshlar sonini o'zgartirsangiz, ish yuklari
profil, xatolar oynasi va TPS Shu bilan birga, natijasi qiyin
ta'lim berish.

## Qaranglar {#what-to-watch}

Yugurish paytida ishlashni tasdiqlash uchun ishlatiladigan signallarga e'tibor bering:

- har bir o'zboshimchalik bilan harakatlanayotgan tengdoshlari bo'ylab blok balandligi
- taqdim etilgan, qabul qilingan, rad etilgan va muddati tugagach bo'lgan operatsiyalar
- navbat chuqurligi, navbat to'ylash va oxirgi nuqtadagi qarshi bosim
- ko'rinish o'zgarishlari, tiklanish yo'llari, yo'qolgan bloklar va yo'q bo'lgan quorum
  sertifikatlar
- RBC orqaga chiqish, yig'ilishlar davom etishi va konsensus trafikining kamayishi yoki kechiktirilishi
- CPU, xotira, disk va tengdoshlarni o'zlashtiruvchi uy egasi tarmog'ining to'ldirilishi

Validatsiya-tushkunlik tahlilini amalga oshirish uchun asosiy to'plamdagi debug loglarini qo'llash:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Har bir blok chiqarib yuborishi kerak `block validation timings` bilan `stateless_ms`,
`execution_ms`, va `total_ms`. Oʻsha vaqtlarni p95 blok bilan taqqoslang
o'zgarishdan oldin intervallar, ko'rinishni o'zgartirish hisoblagichlari va navbatdagi bosim
konsensus vaqt belgilari.

## Natijalarni ta'riflash {#interpreting-results}

Barcha tanlangan tengdoshlar bloklarni davom ettirganida harakatni sog'lom deb hisoblang,
orqaga tushish bog'lanmasdan o'smaydi va xatolar yangi tiklanish sabab bo'lmaydi
Konfiguratsiya qilingan oyna tugagandan so'ng faoliyat.

Agar:

- blok progressi to ' xtashlari `--progress-timeout`
- tenglikdagi balandliklar farq qiladi va qayta konvergent bo'lmaydi
- p95 kechikish muddati o'tadi `--latency-p95-threshold`
- Chiqindi darcha yopilgandan keyin navbatlar ko'payadi
- rad etilgan yoki muddati tugab ketgan tranzaksiyalar tanlangan
  ish haqi
- Parvardigorlar bilan qayta ishga tushirish, saqlashni o'chirib tashlash yoki paketlarni yo'qotishdan tiklash uchun qo'llanma talab etiladi
  tozalash

Muvaffaqiyat bo'lgach, bir xil urug' va bitta kamroq xato turi bilan qayta ishga tushiring.
ish yukini va vaqtni qayta tiklanishi mumkin bo'lib, xatolikni kamaytiradi
yuzasi.

## Bogʻliq sahifalar {#related-pages}

- [Ishlab chiqarish va o'lchovlar](./metrics.md)
- [Yugurish Iroha Yolg'iz metallda](./running-iroha-on-bare-metal.md)
- [Torii oxirgi nuqtalar](../../reference/torii-endpoints.md)
