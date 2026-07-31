---
translation_locale: uz
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operatsiya xavfsizligi {#operational-security}

Operatsiyaviy xavfsizlik (OPSEC) - bu xavfsizlik va ta'sirni boshqarish bo'yicha tizimli yondashuv, bu asosan ma'lum foydalanish holatlari uchun qabul qilingan strategiyalar va maslahatlar to'plami bo'lib, ruxsatsiz kirish va ma'lumotlarni shubha ostiga qo'yishning oldini olish maqsadida amalga oshiriladi.

<abbr title="Operational Security">OPSEC</abbr> ko'pchilik kompaniyalar uchun o'z aktivlarining mavjudligi va barqarorligini kafolatlash uchun standart amaliyotdir. Bu jismoniy xavfsizlik kabi omillarni hisobga olishni o'z ichiga oladi (masalan, nazorat qilinmagan post-it notlari noqulay ma'lumotlarga ega emasligiga ishonch hosil qilish), xavfsiz aloqa protokollari (masalan, o'ziga xos ma'lumotlarni shifrlanmagan SMS orqali yubormaslik), xavf-xatar tahlillari (masal uchun, potensial zararli tomonlarni aniqlash, eng so'nggi hujum usullarini bilish), xodimlar o'qitishi (masal üçin, <abbr title="Operational Security">OPSEC</abbr> chora-tadbirlariga rioya qilmaydigan xodimlar); ular ilgari yoki keyin samarasiz bo'lib ko'rinadi) va ta'sirni kamaytirish (masalan, qattiq disklaringiz va USB qurilmalaringizni shifrlash).

Iroha moliyaviy daftar sifatida ishga tushirilishi ehtimoldan yiroq emasligi sababli, <abbr title="Operational Security">OPSEC</abbr> chora-tadbirlari va amaliyotlarini jiddiy qabul qilish kerak. Ushbu mavzu Iroha bilan shug'ullanuvchi shaxslar va tashkilotlar o'z faoliyatini amalga oshirishda qanday strategiya va yondashuvlarni ko'rib chiqishlari kerakligini tasvirlaydi. keng xavfsizlik protokollari.

Biroq, ushbu mavzudagi yo'nalishlarni qo'llab-quvvatlash va qabul qilish to'liq xavfsizlikka erishish uchun zarur qadamdir. O'zingizning xavfsizligingizni yanada yaxshilash uchun, qolgan [Xavfsizlik](./index.md) bo'lim va ayniqsa, quyidagi mavzular:

- [Xavfsizlik prinsiplari](./security-principles.md)
- [Maxfiy so'z xavfsizligi](./password-security.md)

## OPSEC tavsiya etilgan chora-tadbirlar {#recommended-opsec-measures}

- Hushyor bo'ling. [ eng ehtimoldan yiroq ](https://arxiv.org/pdf/2209.08356.pdf) yo'l blockchainda o'z aktivlarini yo'qotish uchun ularning sezgir ma'lumotlarini berish orqali.

- Disklaringizni shifrlang. Chiptalash qurilmalari sizning ma'lumotlaringizni himoya qilishlariga imkon beradi, hatto hujumchi hardwarega kirish imkoniyatiga ega bo'lsa ham. Buni portabel qurilmalar uchun qilish ikki baravar muhimdir.

- Ishonchli dasturiy ta'minotdan foydalaning. Tekislash mumkin bo'lgan ikkilamchi qurilmalar orqali jo'natilgan va siz manbadan yaratgan dastur eng ishonchli hisoblanadi. Muhokama qilinmagan mulkdorlik yoki ochiq manbali dasturlar jiddiy qabul qilinishi kerak bo'lgan potensial xavfdir.

- Xavfsiz ma'lumotlarga ega portativ qurilmalarni hech qachon nazoratsiz qoldirmang. Sizning qurilmangizni o'g'irlash uchun bir soniya bo'shliq etarli.

- Ikkilamchi paketlardagi imzolarni tekshiring. Bu Iroha ichida ishlatiladigan ommaviy kalitning kriptografiyasidan juda farq qilmaydi.

- Ruxsatsiz kirishning oldini olish uchun, uni nazorat qilinmagan holda qoldirganingizda laptop yoki shaxsiy kompyuteringizni har doim himoya qiling. Kuchli maxfiy so'zlardan foydalaning, ekranni qulflab qo'ying va qurilmalaringizni xavfsiz saqlash uchun eng yaxshi amaliyotlarga amal qiling.

- Xavfsizlikni oʻrnatish [havo bo'shliqlari](https://en.wikipedia.org/wiki/Air_gap_(networking)) kalitlaringizning joylashishi. Birinchidan, kalitlarni shifrlang, so'ngra ularni faqat offline qurilmada saqlang, ideal holda elektromagnitli himoya o'rnatilgan bo'lsa. [Hardver kalitlari](./storing-cryptographic-keys.md#using-a-hardware-key) maxsus ushbu maqsad uchun mo'ljallangan.

- Har doim dasturiy ta'minotingizni barcha qurilmalarda, shu jumladan kompyuterlar va telefonlarda eng so'nggi versiyasiga yangilanishda saqlang. Doimiy yangilanishlar zaifliklarni tuzatishga yordam beradi va bunday zaifliklar oshkor bo'lishidan oldin ham eskirgan dastur bilan bog'liq bo'lishi mumkin bo'lgan xavfni kamaytiradi.

- Maxfiy so'zlarni va kriptografik kalitlarni muntazam ravishda yangilash uchun ro'yxatni ishlab chiqish. Ushbu faol yondashuv umumiy xavfsizlik holatini yaxshilashga katta hissa qo'shadi, chunki harakatdagi maqsadga erishish ancha qiyin bo'ladi.

## Brauzerlardan foydalanish {#using-browsers}

Agar Iroha bilan bog'langan arizalarda UI veb-sayti mavjud bo'lsa, brauzeringiz xavfsizlikka ko'maklashishi yoki xavfli bo'lishi mumkin. Ayniqsa, o'rnatishni tanlagan plaginlar haqida gap ketganda ehtiyot bo'lish juda muhimdir.

Browsing xavfsizligini oshirish uchun quyidagi chora-tadbirlarni koʻrib chiqing:

- Xavfsizlik modellariga ega bo'lgan va foydalanuvchilarining ma'lumotlarini shubha ostiga qo'ygan brauzerlardan foydalanishdan yiroqlashing. Siz har qanday brauzer uchun maxfiylik buzilishlari va xavfsizlik muammolarini qidirishingiz mumkin. Misol uchun, [ ushbu brauzer maxfiyligi haqidagi maqola](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) turli xil brauzerlar va ular qanchalik xavfsizligini muhokama qiladi. Shuni yodda tutingki, xususiy brauzerlar (masalan, Chrome, Safari, Opera, Vivaldi, Edge va boshqalar) odatda ularning kodi jamoatchilikdan yashirilganligi sababli audit qilish juda qiyin bo'ladi, ya'ni ular qanchalik xavfsiz ekaniga ishonchingiz komil emas.

- Foydalanuvchilarining shaxsiy hayoti va xavfsizligini baholash va himoya qilishda mustahkam tarixga ega bo'lgan brauzerlarga afzallik berish:
  - [Librewolf](https://librewolf.net/), [Icecat](https://www.gnu.org/software/gnuzilla/), [Firedragon](https://github.com/dr460nf1r3/firedragon-browser), va boshqalar Mozilla Firefox-ning qo'shimcha xavfsizlik xususiyatlari bilan yaxshi o'rnatilgan furklari .
  - [O'qilgan xrom](https://github.com/ungoogled-software/ungoogled-chromium)  qo'shimcha xavfsizlik choralari bilan takomillashtirilgan Google Chrome-ning yuqori darajada audit qilingan ochiq manbali versiyasi va barcha Google bilan bog'liq veb-xizmatlar olib tashlandi.
  - [Brave](https://brave.com/)  [Google Chromiumning yuqori darajada audit qilingan ochiq manbali versiyasi ](https://www.chromium.org/Home/) qo'shimcha xavfsizlik choralari bilan takomillashtirilgan; u <abbr title="Virtual Private Network"> VPN </abbr> va reklama blokir funktsiyalariga ega.
  - [Falkon](https://www.falkon.org/)  ochiq manbali Qt-ga asoslangan veb-brauzer (bu erda `QtWebEngine`, qadoqlash uchun [Google Chromium](https://www.chromium.org/Home/)) xavfsizligi haqida ma'lum tarixga ega; uning [KDE doʻkon sahifasi](https://store.falkon.org/browse/).
  - [Qutebrowser](https://qutebrowser.org/)  ochiq manbali Qt-ga asoslangan veb-brauzer ( `QtWebEngine` asosida qurilgan, [Google Chromium ](https://www.chromium.org/Home/) uchun qadoqlama; xavfsizligi bilan tan olingan; minimalist GUI bilan noyob klaviaturaga qaratilgan yondashuv mavjud; ko'plab xavfsizlik mutaxassislari uchun eng yaxshi brauzer hisoblanadi.

- Agar zarur bo'lmasa, `JavaScript` ni qo'llashdan yiroqlashing.

- Pluginlar uchun brauzerning tuzilgan cheklov mexanizmidan foydalanib, o'rnatilgan plaginlarning kirish huquqlarini cheklash.

- Muhim operatsiyalardan oldin va keyin cookie-fayllarni o'chirib tashlang. Meni Login qiling yoki meni eslab qolish xususiyatini qo'lga kiritmaslik uchun ehtiyot bo'ling. Ba'zi veb-saytlarda bu xususiyat andoza ravishda qo'llanilganligini unutmang.

- Reklamalar blokirovkasidan foydalaning. Bu nafaqat reklamalarni bloklaydi, balki saytni kuzatish xususiyatlarini ham o'chiradi. Siz ishlatadigan brauzerga qarab, reklama blokiri o'rnatilgan xususiyat bo'lmasligi mumkin.

- Shunga o'xshash belgilardan ehtiyot bo'ling (masalan: `0`, `θ`, `O`, `О`, `ዐ` va `߀` Bu kabi tafsilotlarga e'tibor qaratish sizni phishing hujumidan qutqaradi.

- Web UI elektron pochta mijozlaridan foydalaning. Uni ishlatishdan oldin, GPG kalit imzolarini imzolash va tasdiqlash uchun ish stoli elektron pochtasi mijozingizni o'rnating.

- Vebga asoslangan xabar berish xizmatlaridan qoching. Misol uchun, Discord (bu mashhur `electron` framework bilan qurilgan) diskordning veb-versiyasi ochiq bo'lgan Google Chromium oynasi kabi ko'plab hujumlarga duchor bo'ladi.

- Agar iloji bo'lsa, brauzeringizni so'nggi versiyaga yangilash. Yangilanishlar ko'pincha xavfsizlikning xavfli tuzatishlarini o'z ichiga oladi, bu esa zaifliklarni bartaraf etadi.

- Qanday brauzer kengaytmalarini o'rnatishingizga ehtiyot bo'ling. Faqat tanilgan va ishonchli manbalardan olingan kengaytmalarni ishlating. Yomon kengaytmalar sizning ma'lumotlaringizga va maxfiyligingizga ta'sir qilishi mumkin.

- Turli vazifalar uchun alohida brauzer profillari yarating. Har kuni brauzerlash uchun bir profildan foydalaning va yuqori xavfsizlik va xotirjam ma'lumotlarni o'z ichiga olgan faoliyat uchun boshqalardan foydalaning. Shu tarzda, har kuni brauzerlik uchun profilga o'rnatilgan kengaytmalar xavfsiz ma'lumotlar orqali maxfiy ma'lumotlarga kirish imkoniyatiga ega emas.

- Browseringizning portativ versiyasidan USB flash diskga nusxa olishdan foydalaning. Ushbu usul xavfsizlik xatosi o'rnatilgan plaginlardan biriga profillar orasidagi ma'lumotlarga kirish huquqini bergan taqdirda ham, sizning xavfsizlik bilan bog'liq profilingiz alohida va olib tashlanadigan qurilmada saqlanishini ta'minlaydi.

- Qurilmangizda tasodifan saqlanayotgan ehtimoldan yiroq bo'lmagan sezgir ma'lumotlarni olib tashlash uchun brauzeringizning kecha va kukilarini vaqti-vaqti bilan o'chiring.

## Qayta tiklash rejasi {#recovery-plan}

Shoshilinch holatlarda, masalan, kalitni yo'qotish yoki xavfsizlik buzilishiga duch kelganda: Yaxshi tuzilgan va oldindan tayyorlangan tiklanish rejasi muhim hayot tarzi hisoblanadi. Bu borada aniq choralar ko'rish mumkin bo'lgan zararni kamaytirishga va xavfsizlikni tezda tiklashga yordam beradi.

Tashkilotlar o'z tiklanish rejasini ishlab chiqishda quyidagi asosiy jihatlarni e'tiborga olishlari kerak:

- O'lchani yo'qotish yoki boshqa xavfsizlik hodisalari sodir bo'lganda amal qilish kerak bo'lgan bosqichma-bosqich tartib-taomillarni ko'rsating. Ushbu qadamlar foydalanuvchilar va/yoki xodimlar uchun osonlikcha ochiq va tushunarliligini ta'minlang.

- Xavfsizlik buzilishlari va ehtimoldan yiroq bo'lgan xavf-xatarlar, masalan, siquv yoki yo'qolgan kriptografik kalitlar va maxfiy so'zlar haqida tezda xabar berish uchun foydalanish mumkin bo'lgan kommunikatsiya kanalini yaratish.

- Agar siz xavfsizlik chorasi sifatida asbob-uskuna kalitlaridan (masalan, [YubiKey](https://www.yubico.com/products/) yoki [ SoloKeys Solo](https://solokeys.com/collections/all)) foydalanayotgan bo'lsangiz, redundansiya strategiyasini qabul qilishni o'ylab ko'ring. Ikki kalitni saqlang: biri kundalik foydalanish uchun va boshqasi xavfsiz joyda saqlanadi. Ushbu ehtiyot chorasi asosiy kalitga zarar yetkazilgan yoki yo'qolgan taqdirda ham, kirish imkoniyatini ta'minlaydi.

- Xavfsizlikni buzish yoki bo'shash haqida xabar berilganda, zarar ko'rgan kalitlar va maxfiy so'zlarni almashtirish yoki ularni o'chirib tashlash orqali darhol chora ko'ring.

- O'zingizning tiklanish rejangizni muntazam ravishda ko'rib chiqing va yangilab turing. Bu sizning xavfsizlik manzarangiz rivojlanayotganda, reja tegishli va samarali qolishini ta'minlaydi.

::: ogohlantirish

Shuni yodda tutingki, tiklash rejasi shunchaki boshqa hujjat emas. Aksincha, u kutilmagan qiyinchiliklarni yengishga yordam beradigan hayot tarzi bo'lib xizmat qiladi. Muqobil vaziyatlarni oldindan ko'rib chiqish va aniq yo'l xaritasini tuzish orqali, siz operatsiya xavfsizligini mustahkamlaysiz va har qanday xavfsizlik hodisasiga samarali javob berishga tayyorligingizni oshirasiz.

:::
