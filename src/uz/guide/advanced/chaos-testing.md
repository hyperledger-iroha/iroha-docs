---
translation_locale: uz
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Izanami bilan Chaqiriq Testi {#chaos-testing-with-izanami}

Izanami yuqori darajadagi Iroha ish maydonida chaosnet boshqaruvchisidir. U ishlatiladigan mahalliy Iroha klasterni ishga tushiradi, sozlanadigan ish yukini yuboradi va tanlangan tarmoq birikmalariga xatoliklarni kiritadi, shunda operatorlar tarmoq nazorat ostidagi nosozlikda ham rivojlanishni davom ettirayotganligini tekshirishi mumkin.

Oldingi ishlab chiqarish chidamliligi tekshiruvlari, regressiya takrorini va konsensus sozlamalarini amalga oshirish uchun Izanami-dan foydalaning. Uni ishlab chiqarish tarmog‘iga yo‘naltirmang: bu vosita shunday mo‘ljallangan tarmoq tengdoshlarini egallash, shu jumladan tarmoq tengdoshlarini qayta ishga tushirish, saqlashni tozalash, vaqtinchalik ishonchli tengdoshlar bo‘limlari va mahalliy CPU yoki disk bosimi.

## Oldingi talablar {#prerequisites}

Izanami-ni bu hujjat repositorysidan emas, [Iroha manba ombori](https://github.com/hyperledger-iroha/iroha) dan ishga tushiring:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

Ikkiyuzlamali fayl tarmoqdagi tengdoshlarni yaratish va boshqarishga aniq ruxsat berilishi kerak. Har bir TUI bo'lmagan ishga tushirish uchun `--allow-net` ni o'tkazing yoki TUI dagi `allow_net` ni yoqing.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Interfaol ishga tushirish konfiguratsiyasi uchun:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami foydalanuvchi konfiguratsiya papkasi ostida TUI va CLI sozlamalarni saqlaydi. Birinchi chiqarilgan faylda bitta aniq V1 tartib bayti mavjud; chiqarilishdan oldingi yoki boshqa versiyasiz sozlamalar rad etiladi va ular ko‘chirilish o‘rniga qayta yaratilishi kerak. Joriy profilni qayta ishlatishdan oldin ko'rsatilgan sozlamalarni ko'rib chiqing.

## Asosiy Yugurish {#baseline-run}

Jiddiy xatolarni qo‘shishdan oldin, bir nusxalanadigan boshlang‘ich nuqtadan boshlang:

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

Bu ish faqat klaster so‘ralgan blok maqsadiga yetganida, vaqt tugash muddati ichida taraqqiyot qilganida va ixtiyoriy p95 blok intervalli chegarasidan pastda qolganida muvaffaqiyatli bo‘ladi.

Buyruq, urug‘, Iroha protokolini yakunlash, tarmoq qo‘shnilar soni, nosoz qo‘shni soni, ish yukining profili, maqsad TPS va kechikish chegarasini loglar bilan qayd eting. Ushbu qiymatlar bo‘lmasa, boshqa operator bir xil xatolik naqshini takrorlay olmaydi.

## Ish yuklamasi profillari {#workload-profiles}

Izanamining ikki ish yuklanishi profili mavjud:

|Profil|Buni ishlating| Eslatmalar |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` |Uzoq cho‘zilgan yugurishlar va takrorlanadigan ishlash tekshiruvlari|Ijro xavfsiz retseptlarni qo'llab-quvvatlaydi|
| `chaos`  |Muvaffaqiyatsizlik yo'li qamrovi|Ataylab noto‘g‘ri retseptlarni o‘z ichiga oladi|

Avvalo barqaror profilni ishlating:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Asosiy ma'lumot allaqachon tushunilganida, tartibsizlik profiliga o'ting:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

Shartnoma joylashtirish retseptlari faqat aniq ruxsat berilgan bo'lsa, barqaror ishga tushirishlarda o‘chirilgan:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Yuqori oqim ish maydonidan kiritilgan SORA Nexus standartlarini ishlatish kerak bo'lganda `--nexus` dan foydalaning.

## Nosozlik nazorati {#fault-controls}

`--faulty` noldan katta bo‘lganda, kamida bitta nosozlik ssenariysi yoqilgan bo‘lishi kerak. Nosozlik almashtirgichlari standart bo‘yicha yoqilgan, va mantiqiy bayroqlar `=false` yordamida o‘chirilishi mumkin.

|Xato| CLI bayroq |U nima mashq qiladi|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Yomon ishlash va qayta ishga tushirish| `--fault-enable-crash-restart`             |tarmoq tengdoshi jarayoni yo‘qotish va tiklash|
|Xotirani tozalang va qayta ishga tushiring| `--fault-enable-wipe-storage`              |Mahalliy holat yo‘qolishidan tiklanish|
|Noto‘g‘ri tranzaksiya spam| `--fault-enable-spam-invalid-transactions` |Qabul va rad etish yo'llari|
|Tarmoq kechikishi| `--fault-enable-network-latency`           |Sekin mish-mish va kechikkan kelishuv xabarlari|
|Tarmoq bo'linishi| `--fault-enable-network-partition`         |Vaqtinchalik ishonchli tengdoshlardan izolyatsiya|
|CPU stress| `--fault-enable-cpu-stress`                |Mahalliy tekshiruv va jadval bosimi|
|Disk to‘yinganligi| `--fault-enable-disk-saturation`           |Mahalliy saqlash bosimi|

Faqat tarmoq bo'linishi bilan ishlash uchun:

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

`--fault-window-start` va `--fault-window-end` dan foydalanib, kiritilgan nosozlikdan oldin va keyin nazorat qilinadigan barqaror davrni saqlang. Bu ishga tushirish shovqini va nuqson ta'sirini ajratishni osonlashtiradi.

## Ssenariy Shakllari {#scenario-shapes}

Upstream Izanami katalogi umumiy blokcheyn aloqa-xatolik shakllarini CLI profillariga xaritalaydi. Siz ularni bir xil bayroqlar bilan modellashtirishingiz mumkin:

|Ssenariy|Odatdagi shakl|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Maqsadli yuk| `--faulty 0`, yuqori `--tps`, bitta taqdim etuvchi, yuqori `--max-inflight`|
|Vaqtinchalik nosozlik|Faqat cheklangan nosozlik oynasi ichida xato/qayta ishga tushirishni yoqish|
|To‘xtash va tiklanish|Avariya/qayta ishga tushirish bilan katta nosoz tengdoshlar populyatsiyasidan foydalaning|
|Liderning izolyatsiyasi|Faqat tarmoq-bo‘linish xatosiga ega bitta nosoz tarmoq tugunini ishlating; Izanami Sumeragi yetakchi telemetriyasini kuzatadi|

Bir vaqtda bitta o'zgaruvchini barqaror saqlang. Agar siz tarmoq tengdoshlari sonini, ish yukini profili, xato oynasini va TPS ni bir xil ishda o'zgartirsangiz, natijani tushunish qiyin bo'ladi.

## Nimani tomosha qilish {#what-to-watch}

Yugurish paytida, ishlashni tasdiqlash uchun ishlatiladigan bir xil signalarga e'tibor bering:

- har bir ishlayotgan tarmoq peerida blok-balandligi davomiyligi
- taqdim etilgan, qabul qilingan, rad etilgan va vaqti tugagan tranzaksiyalar
- navbat chuqurligi, navbat to'yinganligi va API tugun qarshiligi
- o‘zgarishlarni ko‘rish, tiklash yo‘llari, yetishmayotgan bloklar va yetishmayotgan quorom sertifikatlari
- imzolangan RS16 mavjudlik ortiqchiligi, kutayotgan sessiyalar, va kechiktirilgan konsensus trafigi
- CPU, xotira, disk va tarmoq resurslarining tarmoq tengdoshlarini ishga tushirgan hostda to'lib ketishi

Tekshirish-kechikish tahlili uchun asosiy tsikl nosozlik jurnalini yoqing:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Har bir blok `stateless_ms`, `execution_ms` va `total_ms` bilan `block validation timings`ni chiqarishi kerak. Konsensus taymerlarini o‘zgartirishdan oldin ushbu vaqtlarni p95 blok intervallari, ko‘rish-o‘zgartirish sanagichlari va navbat bosimi bilan solishtiring.

## Natijalarni talqin qilish {#interpreting-results}

Agar tanlangan barcha tarmoq peerlari bloklarni yakunlashni davom ettirsa, ortiqcha zaxira cheksiz oshmasa va xatoliklar sozlangan oynaning tugashidan keyin yangi tiklash faoliyatini keltirib chiqarmasa, yugurishni sog'lom deb baholang.

Quyidagi hollarda yugurishni muvaffaqiyatsizlik deb hisoblang:

- blok jarayoni `--progress-timeout` dan ko'proq vaqt to'xtab qoladi
- tarmoq tengdoshlari balandliklari farq qiladi va qayta birlashmaydi
- p95 kechikishi `--latency-p95-threshold` dan oshadi
- xatolik oynasi yopilgandan keyin navbatlar qolgan ish davomida o'sadi
- rad etilgan yoki vaqti tugagan tranzaksiyalar tanlangan ish yuklamasi bilan izohlanmaydi
- tarmoq tengdoshini qayta ishga tushirish, saqlashni tozalash yoki bo‘limni tiklash qo‘lda tozalashni talab qiladi

Muvaffaqiyatsizlikdan keyin, xuddi shu urug' bilan va bir xil xato turini kamaytirib qayta ishga tushiring. Bu ish yukini va vaqtini qayta ishlab chiqariladigan holda saqlaydi va muvaffaqiyatsizlik yuzasini toraytiradi.

## Tegishli sahifalar {#related-pages}

- [Ijro etish va o‘lchovlar](./metrics.md)
- [Bare Metal-da Iroha ni ishga tushirish](./running-iroha-on-bare-metal.md)
- [Torii API oxir nuqtalar](../../reference/torii-endpoints.md)
