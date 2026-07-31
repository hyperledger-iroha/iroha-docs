---
translation_locale: uz
translation_source: /guide/security/security-principles.md
translation_source_hash: ca78f72b2e319a67a5fa5c74126de108cd552cdc758e3a2b981f7a7930a3b61e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xavfsizlik prinsiplari {#security-principles}

Tashkilotlar va alohida foydalanuvchilar Iroha qurilmalari bilan xavfsiz aloqalarni ta'minlash uchun birgalikda ishlashlari kerak. Ushbu mavzu ushbu hamkorlikning asosiy prinsiplarini tushuntiradi.

## Umumiy xavfsizlik tamoyillari {#general-security-principles}

1. [Virtual xususiy tarmoqdan ](./vpn.md) (VPN) foydalaning:

    - Xavfsiz ma'lumotlar yoki resurslarga, ayniqsa ommaviy tarmoqlar orqali kirish uchun <abbr title="Virtual Private Network">VPN</abbr>-dan foydalanib, ma'lumotingizni himoya qiladigan xavfsiz aloqa o'rnating.

2. Tarmoqni himoya qilish uchun firewalldan foydalaning:

    - Uy va/yoki ofis tarmoqlarini qo'llab-quvvatlash uchun ruxsatsiz kirishlarga qarshi kurashish va u bilan bog'liq qurilmalarni viruslar va zararli dasturlardan himoya qilishda yordam beradigan firewall o'rnating.

3. Jismoniy va raqamli ma'lumotlarni himoya qilish:

    - Xavfsiz ma'lumotlarni o'z ichiga olgan jismoniy hujjatlarni xavfsiz joyda himoya qilish va raqamli hujjatlar shifrlanganligini va parol bilan himoyalangan jildlarga saqlanishini ta'minlash.

4. Maʼlumotlarni muntazam saqlash:

    - Har doim muhim ma'lumotlaringizning nusxalarini xavfsiz joyda saqlang. Shunday qilib, agar siz ma'lumotni yo'qotsangiz yoki biror narsa noto'g'ri bo'lsa, tezda hamma narsani qayta tiklashingiz mumkin. Ushbu zaxiralarni odatda ma'lumotingizni saqlagan joyingizdan boshqacha xavfsiz joyda saqlashingiz kerak.

## Har bir foydalanuvchi uchun xavfsizlik prinsiplari {#security-principles-for-individual-users}

1. Qattiq autentifikatsiya qoidalariga amal qiling:

    - Barcha hisoblar uchun kuchli va noyob maxfiy so'zlardan foydalanish.

    - Hech qachon parollarni qayta ishlatmang.

    - <abbr title="Two-Factor Authentication">2FA</abbr>-ni iloji boricha o'rnating. <abbr title="Two-Factor Authentication">2FA</abbr> umumiy xavfsizlikni nafaqat parol talab qilib, balki <abbr title="One-Time Password">OTP</abbr>, barmoq izlari yoki uchinchi tomon ilovalariga asoslangan autentifikatsiya (masalan, Google Authenticator) kabi qo'shimcha omillarni ham yaxshilaydi.

    - SMS autentifikatsiyasini ikkinchi omil sifatida ishlatishdan qoching. Zararli dasturiy ta'minot barcha SMS xabarlaringizni kuzatib bormayotganiga hech qanday kafolat yo'q. Masalan, Android dasturlari faqat ular uchun mo'ljallangan xabarlarga kirish bilan cheklanishi mumkin emas.

2. Raqamli aloqalarda ehtiyot bo'ling: - Barcha olingan elektron pochta xabarlarining imzolarini imzolash va tasdiqlash uchun elektron pochta mijozini o'rnating. Agar siz jo'natganning manzilini o'zgartirib, hatto bank sifatida suratga olishingiz mumkin bo'lsa - da, imzo soxtalashtirish mumkin emas. - HTML xabarlarini ham, tashqi resurslarni ham noma'lum yoki tasdiqlanmagan manzillardan yuklashni o'chirib qo'ying.

    - Shak-shubhasiz elektron pochta xabarlarini, havolalarni va shaxsiy ma'lumotlarni so'rashni aniqlash va ulardan qochish uchun keng tarqalgan phishing usullari haqida bilib oling.

    - Barcha olingan elektron pochta xabarlarining imzolarini imzolash va tasdiqlash uchun elektron pochta mijozini o'rnating. Jo'natuvchining manzilini aks ettirish mumkin bo'lsa-da, hatto bank sifatida suratga olish ham mumkin, ammo imzonani soxtalashtirish mumkin emas.

3. Shaxsiy ma'lumotlarni himoya qilish:

    - O'zingiz bilmagan odamlar bilan, ayniqsa telefon yoki Internet orqali muloqot qilayotganingizda, shaxsiy ma'lumotlarni bo'lishishdan ehtiyot bo'ling.

    - O'zingiz bilan muloqot qilayotgan shaxslar yoki tashkilotlarni mustaqil ravishda tekshirishni o'ylab ko'ring, ularning kimligini tasdiqlash uchun.

    - Ijtimoiy tarmoqlarda o'zingizning shaxsiy ma'lumotlaringizga e'tiborli bo'ling, chunki zararli tomonlar ushbu ma'lumotlardan foydalanishi mumkin.

## Tashkilotlar uchun xavfsizlik tamoyillari {#security-principles-for-organisations}

1. To'g'ri xavfsizlik siyosati va tartib-taomillarini belgilash:

    - Xavfsiz ma'lumotlar bilan shug'ullanadigan barcha xodimlar uchun aniq xavfsizlik siyosati va protokollarini ishlab chiqish; ushbu yo'l-yo'riqlarga amal qilish uchun xodimlarni puxta o'qitish, beparvolik xavfini kamaytirish.

    - Barcha xodimlar uchun xavfsizlik siyosati ochiqligini va o'zgaruvchi xavfsizlik manzaralarini aks ettirish uchun muntazam ravishda qayta ko'rib chiqilishi va yangilanishini ta'minlash.

    - Xavfsizlik siyosatlarini ishchilar uchun ko'proq tanish va amaliyotga noloyiq qilish uchun misollar va voqealari bilan ta'minlang.

2. Xodimlarning e'tiborini oshirish:

    - Xodimlarga ma'lumotlar va operatsion xavfsizlik chora-tadbirlari to'g'risida ta'lim berish. Tashkilot xavfsizligini mustahkamlashda ko'proq xabardorlik va keng o'qitish muhimdir.

    - Xodimlarni har qanday shubhali faoliyat yoki xavfsizlik tashvishlari haqida darhol xabar berishga rag'batlantiring.

3. Jismoniy infratuzilmani himoya qilish:

    - Serverlar va infratuzilmalarga jismoniy kirishni cheklash. Faqatgina vakolatli xodimlarga cheklangan hududlarga kirishga ruxsat beruvchi kirish nazoratlarini o'rnatish.

    - O'zgarayotgan xavfsizlik ehtiyojlariga moslashish uchun kirish nazorat choralari muntazam ravishda qayta ko'rib chiqilishi va yangilanishini ta'minlash.

    - Jismoniy xavfsizlikni oshirish uchun sog'lom hududlar uchun biometrik kirish nazoratlarini joriy etish haqida o'ylamang.

4. Xavfsizlik nazoratini amalga oshirish:

    - Harakatlarni sinchkovlik bilan tekshiradigan va xavfsizlikni buzish mumkin bo'lgan holatlarni aniqlaydigan keng qamrovli xavfsizlik monitoringi tizimini joriy etish.

    - Xavfsizlik xodimlarini har qanday noyob yoki ruxsatsiz faoliyat to'g'risida tezda xabardor qilish uchun avtomatik ogohlantirishlarni amalga oshirish.

    - Tizimning anomaliyalar va mumkin bo'lgan tahdidlarni aniqlash qobiliyatini oshirish uchun mashina o'rganish algoritmlaridan foydalanishni o'ylab ko'ring.

    - Ma'lumotlar bazasi xavfsizligini nazorat qilish, dasturiy ta'minot zaifliklarini aniqlash, kuzatish va bartaraf etish hamda tasdiqlangan ro'yxatga kiritilmagan ruxsatsiz dasturlar mavjudligi uchun kritik mashinalarda muntazam tekshiruvlar o'tkazish uchun xodimlarni ishga tushirish yoki tayinlash.

5. Takrorlanadigan xavfsizlik auditlarini o'tkazish:

    - Xavfsizlik holatlarini baholash va belgilangan xavfsizlik chora-tadbirlarining umumiy qabul qilingan standartlar va qoidalarga muvofiqligini tasdiqlash uchun muntazam ravishda xavfsizlik auditlarini o'tkazish.

    - Tashkilotingizning xavfsizlik holatiga yuzxotirchiliksiz baho berish uchun tashqi xavfsizlik mutaxassislarini vaqti-vaqti bilan baholash uchun ishga yollashni o'ylang.

6. Kirishlarni nazorat qilish tizimini joriy etish:

    - Xodimlarning faqat o'z vazifalari uchun zarur bo'lgan resurslar va ma'lumotlarga ega bo'lishlarini ta'minlash uchun rolga asoslangan kirish nazorat tizimini yaratish.

7. Doimiy yaxshilanishni qabul qiling:

    - Xavfsizlikning uzluksiz jarayon ekanligini tan olish.Xavfsizlik choralarini doimiy ravishda baholash va yangi paydo bo'layotgan tahdidlar va qiyinchiliklarni bartaraf etish uchun ularni faol kuchaytirish.

    - Xodimlarni xavfsizlikni yaxshilash bo'yicha takliflar kiritishga undaydigan, doimiy takomillashtirish madaniyatini kuchaytiradigan takroraning tuzish haqida o'ylab ko'ring.
