---
translation_locale: uz
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operatsiya xavfsizligi {#operational-security}

Operativ xavfsizlik (OPSEC) xavfsizlik va tavakkalchilikni boshqarish bo'yicha tizimli yondashuvdir, bu asosan ma'lum foydalanish holatlari uchun qabul qilingan strategiyalar va maslahatlar to'plami hisoblanadi.

<abbr title="Operational Security">OPSEC</abbr> aksariyat kompaniyalar uchun o'z aktivlarining mavjudligi va barqarorligini kafolatlashning standart amaliyotidir. Bu jismoniy xavfsizlik kabi omillarni hisobga olishni o'z ichiga oladi (masalan, nazorat qilinmagan post-it notlari sezgir ma'lumotlarni saqlamasligiga ishonch hosil qilish), xavfsiz kommunikatsiya protokollarini (masalan , sezgir hujjatlarni kodlanmagan orqali yubormaslik) SMS), tahdid tahlili (masalan, potensial zararli tomonlarni aniqlash, eng so'nggi hujum usullari haqida bilish), kadrlar o'qitishi (masalan , xodimlar kuzatib bormasdan) <abbr title="Operational Security">OPSEC</abbr> chora-tadbirlar, ular _oʻzi_, er yoki kech, samarali emasligini isbotlaydi) va xavfni kamaytirish (masalan, qattiq disklaringizni shifrlash va USB qurilmalar).

Oʻsha paytdan beri Iroha moliyaviy daftar sifatida ishga tushirilishi ehtimoldan yiroq emas, <abbr title="Operational Security">OPSEC</abbr> Ushbu mavzuda shaxslar va tashkilotlar tomonidan qo'llaniladigan strategiyalar va yondashuvlar haqida gap boradi. Iroha o'zlarining faoliyatida keng xavfsizlik protokolining bir qismi sifatida ko'rib chiqishlari kerak.

Ushbu mavzudagi yo'nalishlarga amal qilish va ularni qabul qilish to'liq xavfsizlikka erishish uchun zarur qadamdir, ammo bu o'zi yetarli emas. [Xavfsizlik](./index.md) bo'lim va ayniqsa quyidagi mavzular:

- [Xavfsizlik prinsiplari](./security-principles.md)
- [Maxfiy soʻz xavfsizligi](./password-security.md)

## Tavsiya etilgan OPSEC Oʻzgarishlar {#recommended-opsec-measures}

- Hushyor bo'ling. [koʻp ehtimoldan yiroq emas](https://arxiv.org/pdf/2209.08356.pdf) blokchaynda o'z aktivlarini yo'qotishning usullari ularning hissiy ma'lumotlarini berishdir.

- Disklaringizni shifrlang. Chiqish qurilmalarini shifrlash sizning ma'lumotlaringizni himoya qilishlariga imkon beradi, hatto hujumchi hardwarega kirish imkoniyatiga ega bo'lsa ham. Buni portabel qurilmalar uchun qilish ikki baravar muhimdir.

- Ishonchli dasturiy ta'minotdan foydalaning. Tekislash mumkin bo'lgan ikkilamchi qurilmalar orqali jo'natilgan va siz manbadan yaratgan dastur eng ishonchli hisoblanadi. Muhokama qilinmagan xususiy yoki ochiq manbali dasturiy taʼminot jiddiy qabul qilinishi kerak bo'lgan potensial xavfdir.

- Havoli ma'lumotlarga ega bo'lgan portativ qurilmalarni hech qachon nazoratsiz qoldirmang.

- Ikkilamchi paketlarda imzolarni tekshirish. Bu ichkarida ishlatiladigan ommaviy kalitning kriptografiyasidan juda farq qilmaydi Iroha.

- To'g'ri yo'ldan ozdirmaslik uchun, kompyuteringizni nazoratsiz qoldirganingizda uni himoya qiling.

- Xavfsizlikni oʻrnatish [havo bo'shliqlari](https://en.wikipedia.org/wiki/Air_gap_(networking)) kalitlaringizning joylashuvi. Birinchidan, kalitlarni shifrlang va keyin ularni _Faqat offline_ uskuna, ideal holda elektromagnitli shield o'rnatilgan. [Hardver kalitlari](./storing-cryptographic-keys.md#using-a-hardware-key) maxsus ushbu maqsad uchun mo'ljallangan.

- Har doim dasturiy ta'minotingizni barcha qurilmalarda, shu jumladan kompyuter va telefonlarda eng so'nggi versiyasiga yangilanishda saqlang.

- Maxfiy so'zlar va kriptografik kalitlarni muntazam ravishda yangilash uchun ro'yxatni ishlab chiqish. Ushbu faol yondashuv umumiy xavfsizlik holatini oshirishga katta hissa qo'shadi, chunki harakatdagi maqsadga erishish ancha qiyinroq.

## Brauzerlardan foydalanish {#using-browsers}

Agar ariza Iroha tarmoqni oʻz ichiga oladi UI, Sizning brauzeringiz xavfsizlikka yordam berishi mumkin yoki bu xavfli bo'lishi mumkin.

Internetni qidirish xavfsizligini oshirish uchun quyidagi chora-tadbirlarni ko'rib chiqing:

- Xavfsizlik modellari yomon bo'lgani va foydalanuvchilarining ma'lumotlarini chiqarib yuborishi bilan tanilgan brauzerlardan foydalanmang.
  
  Siz har qanday brauzerda maxfiylik qonunbuzarliklari va xavfsizlik muammolarini qidirishingiz mumkin. [ushbu maqola brauzerning maxfiyligi toʻgʻrisida](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) ko'chma brauzerlar (masalan, Chrome, Safari, Opera, Vivaldi, Edge va boshqalar) odatda ularning kodi jamoatchilikdan yashirilganligi sababli audit qilish juda qiyin bo'lishiga e'tibor bering.

- Foydalanuvchilarining shaxsiy hayoti va xavfsizligini baholash va himoya qilishning mustahkam tarixini o'z ichiga olgan brauzerlarga afzallik berish:
  - [Liberewolf](https://librewolf.net/), [Yuzli mushuk](https://www.gnu.org/software/gnuzilla/), [Oʻt qoʻshish](https://github.com/dr460nf1r3/firedragon-browser), va boshqalar Mozilla Firefox-ning yaxshi o'rnatilgan forklari qo'shimcha xavfsizlik xususiyatlari bilan.
  - [O'qilgan xrom](https://github.com/ungoogled-software/ungoogled-chromium)  qo'shimcha xavfsizlik choralari bilan takomillashtirilgan va Google bilan bog'liq barcha veb-xizmatlarni olib tashlagan Google Chrome-ning yuqori darajada audit qilingan ochiq manbali versiyasi.
  - [Jasoratli](https://brave.com/)  yuqori darajada audit qilingan ochiq manbali versiya [Google Chromium](https://www.chromium.org/Home/) qo'shimcha xavfsizlik choralari bilan kuchaytirilgan; <abbr title="Virtual Private Network">VPN</abbr> va reklamalarni blokirovka qilish funktsiyasi.
  - [Falkon](https://www.falkon.org/)  ochiq manbali Qt-ga asoslangan veb-brauzer (bu erda `QtWebEngine`, qadoqlash [Google Chromium](https://www.chromium.org/Home/)) xavfsizligi haqida ma'lum tarixga ega; [KDE doʻkon sahifasi](https://store.falkon.org/browse/).
  - [Qutebrowser](https://qutebrowser.org/)  ochiq manbali Qt-ga asoslangan veb-brauzer (bu erda `QtWebEngine`, qadoqlash [Google Chromium](https://www.chromium.org/Home/)) xavfsizligi haqida ma'lum tarixga ega; minimalist GUI; ko'plab xavfsizlik mutaxassislari uchun tanlangan brauzer hisoblanadi.

- Qoʻllanmalarni qoʻllash `JavaScript` zarur bo'lmasa.

- Pluginlar uchun brauzerning tuzilgan cheklash mexanizmidan foydalanib, o'rnatilgan plaginlarning kirish huquqlarini cheklang.

- Muhim operatsiyalardan oldin va keyin cookie-fayllarni olib tashlang. **Oʻzimni qoʻllab - quvvatlang** yoki **Meni eslang .** Shuni yodda tutingki, ba'zi veb-saytlarda bu xususiyat andoza ravishda qo'llanilgan.

- Reklamalar blokirovkasidan foydalaning. Bu nafaqat reklamalarni bloklaydi, balki saytni kuzatish xususiyatlarini ham o'chirib qo'yadi. Siz ishlatadigan brauzerga qarab, reklamani blokirovka qilish tarkibiy xususiyat bo'lmasligi mumkin.

- O'ziga o'xshash belgilardan ehtiyot bo'ling (masalan, `0`, `θ`, `O`, `О`, `ዐ` va `߀` Bu kabi tafsilotlarga e'tibor qaratish sizni phishing hujumidan qutqaradi.

- Internetdan qochish UI elektron pochta mijozlarini ish stoli mijozlari foydasiga. Uni ishlatishdan oldin, imzolash va tasdiqlash uchun ish stoli elektron pochtasi mijozingizni o'rnating GPG kalit imzolar.

- Veb-ga asoslangan xabarlash xizmatlaridan foydalanishdan ehtiyot bo'ling. `electron` Framework) diskordning veb-versiyasi ochiq bo'lgan Google Chromium oynasi kabi ko'plab hujumlarga duchor bo'ladi.

- Agar iloji bo'lsa, brauzeringizni so'nggi versiyaga yangilash. Yangilanishlar ko'pincha xavfsizlikning xavfli tuzatishlarini o'z ichiga oladi.

- Qaysi brauzer kengaytmalarini o'rnatishingizga ehtiyot bo'ling. Faqat tanilgan va ishonchli manbalardan olingan kengaytmalar bilan foydalaning. Xaroyib kengaytmalar sizning ma'lumotlaringiz va maxfiyligingizga ta'sir qilishi mumkin.

- Turli vazifalar uchun alohida brauzer profillarini yaratish. Har kuni brauzerlash uchun bir profildan foydalaning va yuqori xavfsizlik va xotirjam ma'lumotlarni o'z ichiga olgan faoliyat uchun boshqalardan foydalaning. Shu tarzda, har kuni brauzerlik uchun profilga o'rnatilgan kengaytmalar xavfsiz ma'lumotlar orqali maxfiy ma'lumotlarga kirishi mumkin emas.

- Browseringizning portativ versiyasidan foydalanish USB flash disk. Ushbu usul xavfsizlik xatosi o'rnatilgan plaginlardan biriga profillar orasidagi ma'lumotlarga kirish huquqini bergan taqdirda ham, sizning xavfsizlik bilan bog'liq profilingiz alohida va olib tashlab olinadigan qurilmada saqlanishini ta'minlaydi.

- Qurilmangizda tasodifan saqlangan ehtimoldan yiroq bo'lmagan ma'lumotlarni olib tashlash uchun brauzeringizning kecha va kukilarini vaqti-vaqti bilan tozalash.

## Qayta tiklash rejasi {#recovery-plan}

Muhim vaziyatlarda, masalan, kalitni yo'qotganda yoki xavfsizlik buzilishi yuz berganda, yaxshi tuzilgan va oldindan tayyorlangan tiklash rejasi muhimdir.

Tashkilotlar o'z tiklanish rejasini ishlab chiqishda quyidagi asosiy jihatlarni e'tiborga olishlari kerak:

- O'z navbatida, kalitni yo'qotish yoki boshqa xavfsizlik hodisalari sodir bo'lganda amal qilish kerak bo'lgan bosqichma-bosqich tartib-taomillarni ko'rsating. Ushbu qadamlar foydalanuvchilar va/yoki xodimlar uchun osonlikcha ochiq va tushunarliligini ta'minlash.

- Xavfsizlik buzilishlari va ehtimoldan yiroq bo'lgan tahdidlar, masalan, siquv yoki yo'qolgan kriptografik kalitlar va parollarni darhol xabar qilish uchun foydalanish mumkin bo'lgan aloqa kanalini yaratish.

- Agar siz asbob-uskuna kalitlaridan foydalansangiz (masalan, [YubiKey](https://www.yubico.com/products/) yoki [SoloKeys O'z-o'zi](https://solokeys.com/collections/all)) xavfsizlik chorasi sifatida redundantlik strategiyasini qabul qilishni o'ylab ko'ring. Ikki kalitni saqlang: bittasini kundalik foydalanish uchun va ikkinchisini xavfsiz joyda saqlash.

- Xavfsizlik bo'linishi yoki buzilganligi haqida xabar berilganda, zarar ko'rgan kalitlar va maxfiy soʻzlarni almashtirish yoki ularni oʻchirib tashlash orqali darhol harakat qiling.

- O'zingizning tiklanish rejangizni muntazam ravishda ko'rib chiqish va yangilash. Bu sizning xavfsizlik manzarangiz rivojlanayotganda reja tegishli va samarali qolishini ta'minlaydi.

::: warning

Shuni yodda tutingki, tiklash rejasi shunchaki boshqa hujjat emas. Aksincha, u kutilmagan qiyinchiliklarni yengishga yordam beradigan jonli yo'ldir.

:::
