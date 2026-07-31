---
translation_locale: uz
translation_source: /guide/security/security-principles.md
translation_source_hash: ca78f72b2e319a67a5fa5c74126de108cd552cdc758e3a2b981f7a7930a3b61e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xavfsizlik prinsiplari {#security-principles}

Tashkilotlar va alohida foydalanuvchilar bilan xavfsiz aloqalarni ta'minlash uchun birgalikda ishlashlari kerak Iroha Ushbu mavzu ushbu hamkorlikning asosiy tamoyillarini tushuntiradi.

## Umumiy xavfsizlik prinsiplari {#general-security-principles}

1. A [Virtual xususiy tarmoq](./vpn.md) (VPN):

    - Har qachon o'z tajribasiga ega bo'lgan ma'lumotlar yoki resurslarga, ayniqsa ommaviy tarmoqlar orqali kirish uchun <abbr title="Virtual Private Network">VPN</abbr> ma'lumotlaringizni himoya qiladigan xavfsiz aloqa o'rnatish.

2. Tarmoqni himoya qilish uchun firewalldan foydalanish:

    - Uy va/yoki ofis tarmoqlarini o'rnatish uchun ruxsatsiz kirishlarga qarshi kurashishga yordam beradigan yong'in devori barpo etish va u bilan bog'liq qurilmalarni viruslar va zararli dasturlardan himoya qilish.

3. Jismoniy va raqamli ma'lumotlarni himoya qilish:

    - Xotirjam ma'lumotlarni o'z ichiga olgan jismoniy hujjatlarni xavfsiz joyda himoya qilish va raqamli hujjatlar shifrlanganligini va parol bilan himoyalangan jildlarda saqlanishini ta'minlash.

4. Maʼlumotlarni muntazam ravishda oldindan koʻchirib turish:

    - Har doim muhim ma'lumotlaringizning nusxalarini xavfsiz joyda saqlang. Agar siz ma'lumotni yo'qotsangiz yoki biron narsa noto'g'ri bo'lsa, tezda hamma narsani qayta tiklay olasiz. Ushbu ehtiyot qismlarni odatda ma'lumotlaringizni saqlash uchun boshqa xavfsiz joyda ushlab turing.

## Ayrim foydalanuvchilar uchun xavfsizlik prinsiplari {#security-principles-for-individual-users}

1. Qattiq autentifikatsiya qoidalariga amal qiling:

    - Barcha hisoblar uchun kuchli va noyob parollardan foydalaning.

    - Hech qachon parollarni qayta ishlatmang.

    - Oʻrnatilgan <abbr title="Two-Factor Authentication">2FA</abbr> iloji boricha. <abbr title="Two-Factor Authentication">2FA</abbr> umumiy xavfsizlikni yaxshilaydi, nafaqat parol talab qiladi, balki <abbr title="One-Time Password">OTP</abbr>, barmoq izlari yoki uchinchi tomon dasturlariga asoslangan autentifikatsiya (masalan, Google Authenticator).

    - Foydalanishdan qochish SMS Ikkinchi omil sifatida autentifikatsiya. Zararli dasturiy ta'minot sizning barcha tizimlaringizni kuzatib bormayotganiga kafolat yo'q SMS xabarlar. Masalan, Android ilovalar faqat ular uchun mo'ljallangan xabarlarga kirish bilan cheklanishi mumkin emas.

2. Raqamli muloqotda ehtiyot bo'ling:
    - Barcha olingan elektron pochta xabarlarining imzolarini imzolash va tasdiqlash uchun elektron pochta mijozini o'rnating. Jo'natuvchining manzilini aks ettirish mumkin bo'lsa-da, hatto bank sifatida suratga olish ham mumkin, ammo imzo soxtalashtirish mumkin emas.
    - Ikkalasi ham oʻchirilsin HTML xabarlar va tashqi resurslarni noma'lum yoki tasdiqlanmagan manzillardan yuklash.

    - Shubhasiz elektron pochta xabarlarini, havolalarni va shaxsiy ma'lumotlaringizni so'rashni aniqlash va ulardan qochish uchun keng tarqalgan phishing usullari haqida bilib oling.

    - Barcha olingan elektron pochta xabarlarining imzolarini imzolash va tasdiqlash uchun elektron pochta mijozini o'rnating. Jo'natuvchining manzilini aks ettirish mumkin bo'lsa-da, hatto bank sifatida suratga olish ham mumkin, ammo imzo soxtalashtirish mumkin emas.

3. Shaxsiy ma'lumotlarni himoya qilish:

    - O'zingiz bilmagan odamlar bilan, ayniqsa telefon yoki Internet orqali muloqot qilayotganingizda, shaxsiy ma'lumotlarni bo'lishishdan ehtiyot bo'ling.

    - O'zingiz bilan muloqot qilayotgan shaxslar yoki tashkilotlarni mustaqil ravishda tadqiq qilib, ularning kimligini tasdiqlang.

    - Ijtimoiy tarmoqlarda o'zingizning shaxsiy ma'lumotlaringizga e'tiborli bo'ling, chunki zararli tomonlar ushbu ma'lumotlardan foydalanishi mumkin.

## Tashkilotlar uchun xavfsizlik prinsiplari {#security-principles-for-organisations}

1. To'g'ri xavfsizlik siyosati va tartib-taomillarini belgilash:

    - Xavfsiz ma'lumotlar bilan shug'ullanadigan barcha xodimlar uchun aniq xavfsizlik siyosati va protokollarini ishlab chiqish.

    - Barcha xodimlar uchun xavfsizlik siyosati ochiqligini va o'zgaruvchan xavfsizlik manzaralarini aks ettirish uchun muntazam ravishda qayta ko'rib chiqilishi va yangilanishini ta'minlash.

    - Xavfsizlik siyosatlarini ishchilar uchun yanada tanish va amaliyotga noloyiq qilish uchun misollar va scenariolar bilan ta'minlang.

2. Xodimlarning xabardorligini oshirish:

    - Xodimlarga ma'lumotlar va operatsion xavfsizlik chora-tadbirlari to'g'risida ta'lim berish.

    - Xodimlarni har qanday shubhali faoliyat yoki xavfsizlik tashvishlari haqida darhol xabar berishga undang.

3. Jismoniy infratuzilmani himoya qilish:

    - Serverlar va infratuzilmalarga jismoniy kirish cheklang. Faqatgina vakolatli xodimlarga cheklangan hududlarga kirishga ruxsat beradigan kirish nazoratlarini o'rnating.

    - O'zgaruvchan xavfsizlik ehtiyojlariga moslashish uchun kirish nazorat choralari muntazam ravishda qayta ko'rib chiqilishi va yangilanishini ta'minlash.

    - Jismoniy xavfsizlikni oshirish uchun sog'lom hududlarda biometrik kirish nazoratlarini joriy etish haqida o'ylab ko'ring.

4. Xavfsizlik monitoringini amalga oshirish:

    - Harakatlarni sinchkovlik bilan tekshiradigan va xavfsizlik bo'yicha bo'lishi mumkin bo'lgan buzilishlarni aniqlaydigan keng qamrovli xavfsizlik monitoring tizimini amalga oshirish.

    - O'zgacha yoki ruxsatsiz faoliyat haqida xavfsizlik xodimlarini darhol xabardor qilish uchun avtomatik ogohlantirishlarni amalga oshirish.

    - Tizimning anomaliyalar va mumkin bo'lgan tahdidlarni aniqlash qobiliyatini oshirish uchun mashina o'rganish algoritmlaridan foydalanishni ko'rib chiqing.

    - Ma'lumotlar bazasi xavfsizligini nazorat qilish, dasturiy ta'minot zaifliklarini aniqlash, kuzatish va bartaraf etish hamda tasdiqlangan ro'yxatga kiritilmagan ruxsatsiz dastur mavjudligi uchun kritik mashinalarda muntazam tekshiruvlar o'tkazish uchun xodimlarni ishga tushirish yoki tayinlash.

5. Tekrarlik bilan xavfsizlik auditlarini o'tkazish:

    - Xavfsizlik holatlarini baholash va belgilangan xavfsizlik chora-tadbirlarining umumiy qabul qilingan standartlar va qoidalarga muvofiqligini tasdiqlash uchun muntazam xavfsizlik auditlarini o'tkazish.

    - Tashkilotingizning xavfsizlik holatiga yuzxotirchiliksiz baho berish uchun, tashqi xavfsizlik mutaxassislarini muntazam ravishda baholash uchun ishga yollash haqida o'ylab ko'ring.

6. Kirishlarni nazorat qilish tizimini joriy etish:

    - Xodimlarning faqat o'z vazifalari uchun zarur bo'lgan resurslar va ma'lumotlarga ega bo'lishlarini ta'minlash uchun rolga asoslangan kirish nazorat tizimini yaratish.

7. Doimiy yaxshilanishni qabul qiling:

    - Xavfsizlikning uzluksiz jarayon ekanligini tan olish.Xavfsizlik chora-tadbirlarini doimiy ravishda baholash va yangi paydo bo'layotgan tahdidlar va qiyinchiliklarni bartaraf etish uchun ularni faol kuchaytirish.

    - Xodimlarni xavfsizlikni yaxshilash bo'yicha takliflar kiritish uchun rag'batlantiradigan, doimiy takomillashtirish madaniyatini kuchaytiradigan takrorlama to'plamini yaratish haqida o'ylab ko'ring.
