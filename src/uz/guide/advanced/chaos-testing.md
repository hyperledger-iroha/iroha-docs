---
translation_locale: uz
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Izanami bilan tartibsizlik sinovlari {#chaos-testing-with-izanami}

Izanami Iroha ish maydonida chaosnet orkestratoridir. U bir martalik mahalliy Iroha klasterini ishga tushiradi, konfiguratsiya qilinadigan ish yukini taqdim etadi va tanlangan tengdoshlarga xatolarni o'tkazadi, shunda operatorlar tarmoq nazorat qilingan nosozlikda muvaffaqiyat qozonishini tekshirishlari mumkin.

Ishlab chiqarishdan oldingi chidamlilik tekshiruvlari, regressiya reproduksiyasi va konsensusni o'zgartirish uchun Izanami-dan foydalaning. Ishlab chiqarish tarmog'iga yo'naltirmang: vositani ishga tushirgan tengdoshlarga ega bo'lish uchun mo'ljallangan, shu jumladan tengdoshlarni qayta boshlash, saqlash to'plamlari, vaqtinchalik ishonchli tenglamalar partitsiyalari va mahalliy CPU yoki disk bosimlari.

## Oldingi shartlar {#prerequisites}

Izanami-ni [Iroha manbai omboridan ](https://github.com/hyperledger-iroha/iroha), ushbu hujjatlar omboridan emas, ishga tushiring:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

Ikkilamchiga tarmoqdagi tengdoshlarni yaratish va manipulyatsiya qilish uchun aniq ruxsat berish kerak. Oʻtish `--allow-net` har bir non-TUI ishga tushirish yoki qo'llash `allow_net` bilan TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Interaktiv ishga tushirish konfiguratsiyasi uchun:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami TUI va CLI sozlamalarini foydalanuvchi konfiguratsiya direktoriyasi ostida saqlaydi. Birinchi nashr faylida bitta aniq V1 layout byti mavjud; oldindan nashr qilingan yoki boshqacha tarzda ko'rsatilmagan sozlamalar rad etiladi va migratsiya qilishning o'rniga qayta yaratilishi kerak. Joriy profilni qayta ishlatishdan oldin ko'rsatiladigan sozlamalarni tekshiring.

## Boshlangʻich yoʻnalish {#baseline-run}

Shiddatli xatolarni qo'shishdan oldin bitta qayta tiklanishi mumkin bo'lgan boshlang'ich chiziq bilan boshlash:

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

Ushbu o'tish faqat klaster so'ralgan blokni maqsadga yetkazsa, vaqt bo'yicha muvaffaqiyat qozonsa va p95 bloki oralig'i chegaralaridan past bo'lsa, muvaffaqiyatli bo'ladi.

Buyruq, urug', Iroha qo'shish, tengdoshlar soni, noto'g'ri tengdoshlarning soni, ish og'irligi profili, maqsad TPS va kechikish darajasi ro'yxatini yozib oling. Ushbu qiymatlarsiz boshqa operator o'sha xato namunasini takrorlay olmaydi .

## Ish yuklari profillari {#workload-profiles}

Izanami ikkita ish yuk profiliga ega:

|Profil |Undan foydalaning .|Izohlar |
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable` |Uzoq choʻkish va qayta tiklanishi mumkin boʻlgan ishlash tekshiruvlari |Ishlab chiqarish xavfsiz retseptlarni yaxshi koʻradi |
|`chaos` |Muvaffaqiyat yoʻnalishidagi qoplama |Niyat bilan bekor qilingan retseptlarni oʻz ichiga oladi |

Avvalo barqaror profildan foydalaning:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Boshlang ' ich chizigʻi allaqachon tushunilgan boʻlganda xaroba profilliga oʻting:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Shartnomalarni ishga tushirish retseptlari aniq ruxsat etilmagan taqdirda, barqaror harakatlarda o'chiritiladi:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

`--nexus` ishga tushirilishi kerak bo'lganda ishlatilsin SORA Nexus oldindan o'rnatilgan ish maydonidan foydalanish.

## Xatolarni nazorat qilish {#fault-controls}

Qachon `--faulty` noldan katta bo'lsa, kamida bitta xatolar xulosasi qo'llanilishi kerak. O'z navbatida, bo'l bayroqlarini o'chirib qo'yish mumkin. `=false`.

|Xato |CLI bayrog'i|U nimalarni oʻz ichiga oladi ?|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Kasallik va qayta ishga tushirish |`--fault-enable-crash-restart` |Tengdoshlar jarayonining yoʻqolishi va tiklanishi |
|saqlashni olib tashlash va qayta ishga tushirish |`--fault-enable-wipe-storage` |Yoʻqolgan mahalliy davlatdan tiklanish |
|Toʻgʻri yoʻllanma spam |`--fault-enable-spam-invalid-transactions` |Qabul qilish va rad etish yoʻllari |
|Tarmoqning kechiktirilishi |`--fault-enable-network-latency` |Sekin gʻiybatlar va kechiktirilgan konsensus xabarlari |
|Tarmoq partitsiyasi |`--fault-enable-network-partition` |Vaqtinchalik ishonchli tengdoshlar izolyatsiyasi |
|CPU bosim |`--fault-enable-cpu-stress` |Mahalliy tasdiqlash va rejalashtirish bosimlari |
|Diskni toʻylash |`--fault-enable-disk-saturation` |Mahalliy saqlash bosimi |

Faqat tarmoq bo'limlari bilan ishlaydigan ish uchun:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

`--fault-window-start` va `--fault-window-end` dan foydalanib, sug'orilgan xatoga qadar va undan keyin nazorat qilingan doimiy holat davrini saqlang. Bu ishga tushirish shovqinini xato ta'siridan ajratishni osonlashtiradi.

## Ssenariy shakllari {#scenario-shapes}

Yuqori oqimdagi Izanami katalogida CLI profillariga umumiy blokcheyn aloqa muvaffaqiyatsizligining shakllari xarita qilinadi. Siz ularni bir xil bayroqlar bilan namunalashingiz mumkin:

|Ssenariy |Tipik shakl |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Maqsadli yuklama |`--faulty 0`, yuqori `--tps`, bitta ariza beruvchi, yuqori `--max-inflight` |
|Vaqtinchalik xato |Faqat cheklangan xatolar oynasining ichida crash / restartni qoʻllash |
|Toʻxtatish va tiklanish |Hujum / qaytadan ishga tushirish bilan katta nosoz tenglamchilarni ishlatish |
|Liderning izolyatsiyasi |Toʻgʻri bitta nosoz tengdoshni faqat tarmoq boʻlimida xato bilan ishlating; Izanami Sumeragi yetakchi telemetriyani izlaydi |

Bir vaqtning o'zida bitta o'zgaruvchini to'g'ri saqlang. Agar siz tengdoshlari sonini, ish yukining profilini, xatolar oynasini va TPS ni bir vaqtda o'zgartirsangiz, natijani tushuntirish qiyin bo'ladi.

## Nimalarga e'tibor berish kerak {#what-to-watch}

Dastur davomida ishlashni tasdiqlash uchun ishlatiladigan o'sha signallarni kuzatib boring:

- har bir harakatlanuvchi tengdoshi bo'ylab blok balandligi rivojlanishi
- taqdim etilgan, qabul qilingan, rad etilgan va muddati tugagach bo'lgan operatsiyalar
- navbat chuqurligi, navbat to'ldirilishi va oxirgi nuqtadagi qarshi bosim
- ko'rinish o'zgarishlari, tiklanish yo'llari, yo'qolgan bloklar va yo'q bo'lgan quorum sertifikatlari
- imzolangan RS16 mavjudlik zaxirasi, kutilayotgan yig'ilishlar va kechiktirilgan konsensus trafiklari
- CPU, xotira, disk va tengdoshlari ishlaydigan uy egasi tarmog'ining to'ldirilishi

Baholash kechiktirilganligi tahlili uchun asosiy to'plamdagi xatolar ro'yxatini yoqing:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Har bir blok chiqarib yuborishi kerak `block validation timings` bilan `stateless_ms`, `execution_ms`, va `total_ms`. O'sha vaqtlarni p95 blok intervallari, ko'rinish o'zgarishi hisoblagichlari va navbatdagi bosim bilan taqqoslang.

## Natijalarni tarjima qilish {#interpreting-results}

Barcha tanlangan tengdoshlari bloklarni amalga oshirishni davom ettirganida, cheksiz orqaga tushmagan va xatolar konfiguratsiyalangan oynaning tugashidan so'ng yangi tiklanish faoliyatini keltirib chiqarishni to'xtatganda harakatni sog'lom deb hisoblang.

Yugurishni muvaffaqiyatsizlik deb hisoblang:

- `--progress-timeout` dan ortiq bo'lgan bloklarning rivojlanish stalllari
- Tengdoshlarning balandliklari farq qiladi va qayta konvergent bo'lmaydi
- p95 kechikish vaqti `--latency-p95-threshold` dan oshadi
- xatolar oynasi yopilgandan so'ng navbatlar davom etadi
- rad etilgan yoki muddati tugagach bo'lgan operatsiyalar tanlangan ish haqi bilan tushuntirilmaydi
- Partiyalarni qayta ishga tushirish, saqlashni olib tashlash yoki tiklash uchun qo'lda tozalash kerak.

Muvaffaqiyat yo'q bo'lganidan so'ng, bir xil urug' va bitta kamroq xato turi bilan qaytadan ishga tushiring. Bu ish yukini va vaqtni qayta tiklash imkonini beradi.

## Bogʻliq sahifalar {#related-pages}

- [Ishlab chiqarish va ko'rsatkichlar](./metrics.md)
- [Iroha Bare Metal](./running-iroha-on-bare-metal.md) bilan ishlaydi
- [Torii oxirgi nuqtalari](../../reference/torii-endpoints.md)
