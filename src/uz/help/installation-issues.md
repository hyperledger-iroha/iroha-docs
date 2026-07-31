---
translation_locale: uz
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻrnatish muammolarini hal qilish {#troubleshooting-installation-issues}

Ushbu bo'limda Iroha 3 o'rnatish uchun muammolarni hal qilish maslahatlari mavjud. Agar siz duch kelayotgan muammo bu erda tasvirlanmagan bo'lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog'lanishingiz mumkin.

## Tezkor tekshirishlar {#quick-checks}

Ko'pgina o'rnatish muvaffaqiyatsizliklari to'rtta joydan kelib chiqadi:

- Rust asbob-uskunalar zanjirini yuqori tomonga ishlaydigan ish maydonida o'rnatilgan versiyadan kattaroqroq
- `cargo` yoki `rustc` o'zgartirilgan qurilmalarga o'xshash `rustup`
- `pkg-config` yoki CMake kabi mavjud bo'lmagan tizim qurilishi vositalari
- manbai o'zgartirilganidan so'ng oldindan hosil bo'lgan qisqartmalar yoki mahalliy qurilmalar

Iroha manbai hisobidan quyidagilardan boshlanadi:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Agar `cargo metadata` muvaffaqiyatsiz tugasa, `pnpm refresh:iroha --source /path/to/iroha` ishga tushirishdan oldin mahalliy asbob-uskunalar zanjirini tuzating, chunki yangilanish joriy ma'lumotlar modeli sxemasini yaratish uchun Kagami ni ilova qilishi mumkin.

## Muammoni hal qilish Rust asboblar to'plami {#troubleshooting-rust-toolchain}

Ba'zan, narsalar rejalashtirilganiday bo'lmaydi. Ayniqsa agar siz `rust` bir muncha vaqt oldin tizimingizda, lekin yangilanmagan. Python: XKCD bu qanday ko'rinishi mumkinligi haqida mashhur misol bor:

<div class="flex justify-center">

![Python atrof muhitda muammolarni hal qilish komiks](/img/install-troubles.png)

</div>

### Rust versiyasini tekshiring {#check-rust-version}

Sizning va bizning aqlimizni saqlab qolish manfaatini ko'zlab, ishonch hosil qilingki, sizda to'g'ri versiyasi `cargo` to'g'ri versiyasi bilan juftlangan `rustc`. Joriy yuqori darajadagi ish o ' rinlari `rust-version = "1.92"` va asbob-uskunalar zanjirini oʻrnatadi `rust-toolchain.toml`. Tarjimalarni ko'rsatish uchun,

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

va keyin

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Agar sizda yuqori versiyalar bo'lsa, yaxshi. Agar sizda pastroq versiyalar bo'lsa , uni yangilash uchun quyidagi buyruqni bajarishingiz mumkin:

```bash
$ rustup toolchain update stable
```

### Oʻrnatish joyini tekshirish {#check-installation-location}

Agar siz kamroq versiya raqamlarini olsangiz va vositalar zanjirini yangilagan bo'lsangiz va u ishlamagan bo'lsa... aytsak, bu umumiy muammo, lekin uning umumiy yechimlari yo'q.

Birinchidan, siz foydalanmoqchi bo'lgan versiya qaysi joyda o'rnatilganini aniqlang:

```bash
$ rustup which rustc
$ rustup which cargo
```

Asboblar zanjirlarining foydalanuvchi o'rnatishlari odatda `~/.rustup/toolchains/stable-*/bin/`. Agar shunday bo'lsa,

```bash
$ rustup toolchain update stable
```

va bu sizning muammolaringizni hal qilishi kerak.

### Rust andoza versiyasini tekshiring {#check-the-default-rust-version}

Boshqa variant shundaki, sizda `stable` asboblar zanjiri mavjud, ammo u andoza sifatida belgilanmagan.

```bash
$ rustup default stable
```

Agar siz `nightly` versiyasini o'rnatgan bo'lsangiz yoki muayyan Rust versiyasini sozlagan bo'lsangiz, lekin uni o'chirib qo'yishni unutib qo'ygan bo'lsangiz bu sodir bo'ladi.

### Boshqa Rust versiyalari mavjudligini tekshirish {#check-if-there-are-other-rust-versions}

Turmush o'rtog'ining muammolarini hal qilishda davom etayotganimizda, biz shell aliaslari bo'lishi mumkin:

```bash
$ type rustc
$ type cargo
```

Agar bular `rustup which *` ishga tushirganingizda ko'rgan joylardan boshqa joylarga ishora qilinsa, unda sizda muammo bor.

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

chunki shell aliaslaringizni qanday qayta tuzishingizdan qat'iy nazar, buzilgan bo'lishi mumkin bo'lgan ichki mantiqaning mavjudligi.

Eng sodda yechim - foydalanmagan versiyalarni olib tashlashdir.

Biroq, bu aytish osonroq, chunki u rustup ning barcha o'rnatilgan va siz uchun mavjud bo'lgan versiyalarini kuzatib borishni anglatadi. Odatda, faqat ikkita: Ushbu qo'llanma boshida buyruqni ishga tushirganingizda sizning uy jildingizdagi standart joyga o'rnatilgan va tizim paketi menejeri versiyasi. Ilk qism uchun (Linux) tarqatish qo'llanmasiga murojaat qiling, (`apt remove rust`).

```bash
$ rustup toolchain list
```

Va keyin, har bir `<toolchain>` uchun (bo'sh burchaklarsiz, albatta):

```bash
$ rustup remove <toolchain>
```

Bundan so'ng, ishonch hosil qiling

```bash
$ cargo --help
```

Buyruq topilmagan xatoga olib keladi, ya'ni sizda faol Rust asbob-uskunalar zanjirini o'rnatish yo'q. So'ng:

```bash
$ rustup toolchain install stable
```

## Python asboblar zanjirini xatolarga yo'l qo'yish {#troubleshooting-python-toolchain}

Oʻrnatilganda Python Pipoda ishlatiladigan velosiped paketlari [Python mijozlarni oʻrnatish](/uz/guide/tutorials/python.md), siz "iroha" kabi xatoga duch kelishingiz mumkin_Piton-*.whl bu platformada qo'llab-quvvatlanadigan velosiped emas".

Ushbu xato pip eskirganligini anglatadi, shuning uchun uni yangilash kerak. Birinchidan, OS yangilanishlarini tekshirish va tizimni yangilash tavsiya etiladi.

Agar bu ishlamasa, foydalanuvchi direktoriyangiz uchun `pip` ni yangilashni sinab ko'rishingiz mumkin.

`python -m pip install --upgrade pip`

O'zingizning uy direktoriyangizda `pip` o'rnatilganligiga ishonch hosil qiling. Buni qilish uchun `whereis pip`ni ishga tushiring va `/home/username/.local/bin/pip` yo'llar orasida bo'ladimi-yo'qligini tekshiring. Agar yo'q bo'lsa, shellingizning `PATH` o'zgaruvchini yangilang.

Agar muammo davom etsa, iltimos [ bizga ](/uz/help/) murojaat qilib, natijalarni xabar qiling.

```
python --version
python3 --version
pip --version
pip3 --version
```
