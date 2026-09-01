---
translation_locale: uz
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# O'rnatish muammolarini bartaraf etish {#troubleshooting-installation-issues}

Ushbu bo‘lim Iroha 3 o‘rnatishda muammolarni hal qilish bo‘yicha maslahatlarni taklif qiladi. Agar siz duch kelayotgan muammo bu yerda tasvirlanmagan bo‘lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog‘laning.

## Tezkor tekshiruvlar {#quick-checks}

O'rnatishdagi ko'pchilik muvaffaqiyatsizliklar to'rtta joydan biridan kelib chiqadi:

- yuqori darajadagi ish joyi tomonidan belgilangan versiyadan eski Rust vosita zanjiri
- `cargo` yoki `rustc` `rustup` dan boshqacha o‘rnatishga olib kelmoqda
- C kompilyatori, `pkg-config` yoki CMake kabi tizim qurilish vositalari yo‘q
- manba o‘zgarishlarini o‘zgartirgandan so‘ng eskirgan yaratilgan parchalar yoki mahalliy qurilish artefaktlari

Iroha manba-kod ishchi nusxasidan boshlang:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Agar `cargo metadata` muvaffaqiyatsiz bo‘lsa, `pnpm refresh:iroha --source /path/to/iroha` ni ishga tushirishdan oldin mahalliy vosita zanjirini tuzating, chunki yangilash joriy ma’lumot-modeli sxemasini yaratish uchun Kagami ni ishga tushirishi mumkin.

## Muammolarni bartaraf etish Rust Vositalar zanjiri {#troubleshooting-rust-toolchain}

Ba’zan, narsalar rejalashtirilgani kabi bo‘lmaydi. Ayniqsa, agar siz bir oz vaqt oldin tizimingizda `rust` bo‘lgan bo‘lsa, lekin yangilamagan bo‘lsangiz. Shunga o‘xshash muammo Python da yuz berishi mumkin: XKCD ning buni qanday ko‘rinishi mumkinligiga mashhur misoli mavjud:

<div class="flex justify-center">

![Python atrof-muhit bilan bog‘liq muammolarni aniqlash komiksi](/img/install-troubles.png)

</div>

### Rust versiyasini tekshiring {#check-rust-version}

O'zingizning va bizning aqlimizni saqlash maqsadida, `cargo`ning to'g'ri versiyasi `rustc`ning to'g'ri versiyasi bilan juft ekanligiga ishonch hosil qiling. Joriy upstream ish maydoni `rust-version = "1.92"`ni e'lon qiladi va `rust-toolchain.toml`da vosita kanali pin qiladi. Versiyalarni ko'rsatish uchun, qil

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

va keyin

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Agar sizda yuqori versiyalar bo'lsa, hammasi yaxshi. Agar sizda past versiyalar bo'lsa, uni yangilash uchun quyidagi buyruqni bajarishingiz mumkin:

```bash
$ rustup toolchain update stable
```

### O'rnatish joyini tekshiring {#check-installation-location}

Agar siz pastroq versiya raqamlarini olsangiz va siz vosita zanjirini yangilagan bo‘lsangiz va u ishlamagan bo‘lsa… aytaylik, bu umumiy muammo, lekin uning umumiy yechimi yo‘q.

Birinchidan, siz ishlatmoqchi bo‘lgan versiya qayerga o‘rnatilganini aniqlab olishingiz kerak:

```bash
$ rustup which rustc
$ rustup which cargo
```

Foydalanuvchi tomonidan o‘rnatilgan asboblar zanjirlari odatda `~/.rustup/toolchains/stable-*/bin/` da bo‘ladi. Agar shunday bo‘lsa, siz ishlata olishingiz kerak

```bash
$ rustup toolchain update stable
```

va bu sizning muammolaringizni hal qilishi kerak.

### Standart Rust versiyasini tekshiring {#check-the-default-rust-version}

Boshqa variant shundaki, sizda yangilangan `stable` asboblar to'plami mavjud, lekin u standart sifatida o'rnatilmagan. Quyidagini ishga tushiring:

```bash
$ rustup default stable
```

`nightly` versiyasini o‘rnatish yoki keyinroq bekor qilmasdan ma’lum bir Rust versiyasini belgilash bu muammoning yuzaga kelishiga sabab bo‘lishi mumkin.

### Boshqa Rust versiyalari bor-yo'qligini tekshiring {#check-if-there-are-other-rust-versions}

Muammo aniqlashning chuqur yo‘lidan davom etib, bizda shell aliaslari bo‘lishi mumkin:

```bash
$ type rustc
$ type cargo
```

Agar bu nuqtalar `rustup which *`ni ishga tushirganingizda ko‘rgan joydan boshqalarga ishora qilsa, unda muammo bor. Shu kabi laqablarnio‘rnatish yetarli emasligini unutmang:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

Ichki mantiq shaley aliaslaringizni qanday joylashtirishingizdan qat'i nazar, baribir buzilishi mumkin.

Eng oddiy yechim foydalanmaydigan versiyalarni o'chirib tashlash bo'ladi.

Biroq, bu qilishdan ko‘ra aytish osonroq, chunki bu sizga o‘rnatilgan va mavjud bo‘lgan rustup ning barcha versiyalarini kuzatishni talab qiladi. Odatda, faqat ikkita mavjud: tizim paket menejeri versiyasi va darslikning boshida buyrug‘ni ishga tushirganingizda uyingiz papkasidagi standart joyga o‘rnatilgan versiya. Birinchisi uchun, (Linux) tarqatmangizning qo‘llanmasiga murojaat qiling, (`apt remove rust`). Ikkinchisi uchun, quyidagilarni bajaring:

```bash
$ rustup toolchain list
```

Va shundan so‘ng, har bir `<toolchain>` uchun (albatta burchak qavslarisiz):

```bash
$ rustup remove <toolchain>
```

Vositalar zanjirini olib tashlagandan so'ng, bu buyruq buyruq-topilmadi xatosini ko‘rsatishi kerak:

```bash
$ cargo --help
```

U xato hech qanday faol Rust vositalar to'plami o'rnatilmaganligini tasdiqlaydi. Keyin quyidagini ishga tushiring:

```bash
$ rustup toolchain install stable
```

## Muammolarni bartaraf etish Python toolchain {#troubleshooting-python-toolchain}

Siz [Python mijoz sozlamalari](/uz/guide/tutorials/python.md) vaqtida pip yordamida Python Wheel paketini o‘rnatganingizda, quyidagi xatoga duch kelishingiz mumkin: "iroha_python-*.whl bu platformada qo‘llab-quvvatlanadigan wheel emas".

Bu xato pip eskirganligini anglatadi, shuning uchun uni yangilashingiz kerak. Avvalo, OS ni yangilanishlar uchun tekshirish va tizimni yangilash tavsiya etiladi.

Agar bu ishlamasa, foydalanuvchi katalogingiz uchun `pip` ni yangilashga urinib ko‘rishingiz mumkin.

`python -m pip install --upgrade pip`

Uy papkangizga o'rnatilgan `pip` ga ishonch hosil qiling. Buni qilish uchun `whereis pip` ni ishlating va `/home/username/.local/bin/pip` yo'llar orasida borligini tekshiring. Agar yo'q bo'lsa, shellingizning `PATH` o'zgaruvchisini yangilang.

Agar muammo davom etsa, iltimos [biz bilan bog'laning](/uz/help/) qilishingiz va natijalarni xabar qilishingizni so‘raymiz.

```
python --version
python3 --version
pip --version
pip3 --version
```
