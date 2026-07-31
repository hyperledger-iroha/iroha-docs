---
translation_locale: uz
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻrnatish muammolarini hal qilish {#troubleshooting-installation-issues}

Ushbu boʻlimda muammolarni hal qilish uchun maslahatlar mavjud Iroha 3 o'rnatish.
siz boshdan kechirayotgan muammo bu yerda tasvirlanmagan,
biz bilan bog'laning [Telegram](https://t.me/hyperledgeriroha).

## Tezkor tekshirishlar {#quick-checks}

Ko'pgina o'rnatish xatolari to'rtta joydan biriga kelib chiqadi:

- a) Rust asboblar zanjirasi yuqori tomonga ishlaydigan ish maydonida oʻrnatilgan versiyadan kattaroq
- `cargo` yoki `rustc` boshqa qurilmalarga o'tish `rustup`
- mavjud bo'lmagan tizim qurilishi vositalari, masalan, C kompileri; `pkg-config`, yoki CMake
- manbai o'zgartirilganidan so'ng tugallanmagan qismlar yoki mahalliy qurilish artefaktlari
  tahrirlar

O ' zbekiston Respublikasining Iroha manbai checking, quyidagilardan boshlanadi:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Agar `cargo metadata` muvaffaqiyatsiz tugadi, ishga tushirishdan oldin mahalliy asboblar zanjirini tuzatish
`pnpm refresh:iroha --source /path/to/iroha`, chunki yangilanish chaqirish mumkin
Kagami joriy ma'lumotlar modeli sxemasini yaratish uchun.

## Muammolarni hal qilish Rust Asboblar zanjirasi {#troubleshooting-rust-toolchain}

Ba'zan ishlar rejalashtirilgancha bo'lmaydi. `rust` sizning
bir muncha vaqt oldin, lekin yangilanmadi.
Python: XKCD bu qanday ko'rinishi mumkinligining mashhur misollari bor:

<div class="flex justify-center">

![Python muhit muammolarni hal qilish komiks](/img/install-troubles.png)

</div>

### Tekshirish Rust versiyasi {#check-rust-version}

Sizning va bizning aqlimizni saqlab qolish uchun, siz
to'g'ri versiyaga ega bo'lish `cargo` to'g'ri versiyasi bilan juftlangan `rustc`.
Joriy yuqori darajadagi ish o ' rinlari `rust-version = "1.92"` va pinlar
asboblar zanjirida kanal `rust-toolchain.toml`. Versiyalarni ko'rsatish uchun

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

va keyin

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Agar sizda yuqori versiyalar bo'lsa, yaxshi. Agar sizda past versiyalar bo'lsa
uni yangilash uchun quyidagi buyruqni ishga tushirish mumkin:

```bash
$ rustup toolchain update stable
```

### Oʻrnatish joyini tekshirish {#check-installation-location}

Agar siz kamroq versiya raqamlarini olsangiz **va** siz asboblar zanjirini yangiladingiz va u
ishlamagan... aytaylik, bu umumiy muammo, lekin u hech qanday
umumiy yechim.

Birinchidan, siz foydalanmoqchi bo'lgan versiya qaerda ekanligini aniqlang
o'rnatilgan:

```bash
$ rustup which rustc
$ rustup which cargo
```

Asbob-uskunalar zanjirlarining foydalanuvchi oʻrnatishlari _odatda_ yo'nalishi
`~/.rustup/toolchains/stable-*/bin/`. Agar shunday bo'lsa, siz
yugurishi mumkin

```bash
$ rustup toolchain update stable
```

va bu sizning muammolaringizni hal qilishi kerak.

### Oldindan koʻrsatilganni tekshirish Rust versiyasi {#check-the-default-rust-version}

Boshqa variant - bu sizda yangilik bor `stable` asbob-uskunalar zanjir, lekin u
andoza sifatida o'rnatilmagan.

```bash
$ rustup default stable
```

Agar siz `nightly` versiyasi yoki ma'lum
Rust versiyasi, lekin uni o'rnatishni unutib yubordi.

### Boshqalar bor-yo'qligini tekshirish Rust versiyalar {#check-if-there-are-other-rust-versions}

Qushlar cho'g'ini hal etishni davom ettirsak, biz shell
nomlar:

```bash
$ type rustc
$ type cargo
```

Agar bular yugurishda ko'rganingizdan boshqa joylarga ishora qilsa
`rustup which *`, Agar sizda muammo bor bo'lsa, uni to'xtatish yetarli emas.
faqat

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

chunki siz qanday qilib o'zingizdan foydalanishingizdan qat'i nazar, buzilishi mumkin bo'lgan ichki mantiqa mavjud.
shell aliaslaringizni qayta tashkil qiling.

Eng sodda yechim - foydalanmagan versiyalarni olib tashlashdir.

Bu osonroq _aytdi_ ko'proq _bajarilgan_, Biroq, bu barcha o'zgarishlarni kuzatishni o'z ichiga oladi
tahrirga qarang rustup o'rnatilgan va siz uchun mavjud. Odatda, faqat
ikkinchisi: tizim paketi menejeri versiyasi va unga o'rnatilgan
Komandaning oʻrnatilganida uy jildingizdagi standart joy
Ushbu darsning boshida. Ilk uchun (Linux)
tarqatish qo'llanmasi (`apt remove rust`). Ikkinchisi uchun:

```bash
$ rustup toolchain list
```

Va keyin, har bir `<toolchain>` (shuningdek, burchaklar bo'lmasa):

```bash
$ rustup remove <toolchain>
```

Shundan so'ng, ishonch hosil qiling

```bash
$ cargo --help
```

buyrug'i topilmagan xatoga olib keladi, ya'ni sizda aktiv mavjud emas Rust
asboblar zanjirini o'rnatilgan. so'ngra:

```bash
$ rustup toolchain install stable
```

## Muammolarni hal qilish Python asbob-uskunalar zanjiri {#troubleshooting-python-toolchain}

Oʻrnatilganda Python Pipoda ishlatiladigan velosiped paketlari [Python mijozlarni oʻrnatish](/uz/guide/tutorials/python.md), siz quyidagi kabi xatolarga duch kelishingiz mumkin:
"Iroha"_piton-*.Whl bu platformada qo'llab-quvvatlanadigan velosiped emas".

Ushbu xatoga ko'ra pip eskirgan, shuning uchun uni yangilash kerak.
Avvalo, sizning OS tizimni yangilash va modernizatsiya qilish uchun.

Agar bu ishlamasa, siz yangilanishni sinab ko'rishingiz mumkin `pip` foydalanuvchi direktoriyangiz uchun.

`python -m pip install --upgrade pip`

Shuni ta'minlash `pip` Bu sizning uy direktoriyangizga o'rnatilgan. Buni qilish uchun `whereis pip` va tekshirish `/home/username/.local/bin/pip` yo'llar orasida. Agar yo'q bo'lsa, shellingizni yangilash `PATH` o'zgaruvchi.

Agar muammo davom etsa, iltimos [biz bilan bog'laning](/uz/help/) va natijalarni xabar qiling.

```
python --version
python3 --version
pip --version
pip3 --version
```
