---
translation_locale: uz
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# tarmoq tengdoshlarini boshqarish {#peer-management}

Agar siz tilga xos qo'llanmalardan birortasini kuzatgan bo'lsangiz, endi odamlar qo'shilmoqchi bo'ladigan yaxshi ishlaydigan tarmog'ingiz bor.

## Ommaviy blokcheyn {#public-blockchain}

Ochiq tarmoqda, tarmoq hamkorini qabul qilish hali ham zanjir siyosati qarori hisoblanadi. Tugun to‘g‘ri dasturiy ta’minotni ishga tushirishi va Torii ga ulanishi mumkin, lekin u tarmoq uning tarmoq hamkorligi identifikatorini qabul qilgandan keyingina konsensusda ishtirok etadi.

## Xususiy Blockchain {#private-blockchain}

Bank muhitida har kimning xohlagan payt qo‘shilishiga ruxsat berish xavfsizlik xataridir. Shu sabab yopiq Iroha joylashtirishlari odatda ochiq topishga tayanmay, tugunlar topologiyasini konfiguratsiya va boshlang‘ich holatda qat’iy belgilaydi.

### Tarmoq sheriklarini ro'yxatdan o'tkazish {#registering-peers}

Tarmoqdagi tarmoq hamkasbini qo'shish uchun uni qo'lda ro'yxatdan o'tkazish kerak. Keling, bu jarayonni yakunlash uchun qaysi qadamlarni bajarish kerakligini muhokama qilaylik.

#### 1. Foydalanuvchiga ruxsatlarni berish {#_1-grant-the-user-permissions}

Tarmoq tengdoshini ro‘yxatdan o‘tkazadigan hisobda mos keladigan `Permission` bo‘lishi kerak. Bu `Role` orqali yoki bevosita ruxsat berish shaklida berilishi mumkin.

Akkount vaqt o'tishi bilan tarmoq tengdoshlarini boshqaradigan bo'lsa, rol bering. Tarmoq tengdoshlarini boshqa holda boshqarmaydigan akkount tomonidan bir martalik ro'yxatdan o'tkazish uchun to'g'ridan-to'g'ri ruxsat bering.

::: info

Standart ijrochi tarmoq peerlarini ro‘yxatdan o‘tkazish va ro‘yxatdan chiqarish uchun `CanManagePeers` ruxsat tokenidan foydalanadi.

:::

Biz ruxsatlar va rollarni [alohida bob](/uz/blockchain/permissions.md) da batafsil muhokama qilamiz.

#### 2. Tarmoq hamkasbini sozlash {#_2-set-up-a-peer}

Yangi tarmoq ishtirokchisiga ruxsatlar berilgandan so‘ng, u o‘rnatilishi kerak.

Tugunni qabul qilishdan oldin joriy tugun konfiguratsiyasini so‘rang. Torii shu maqsadda tugun parametrlari va imkoniyatlari yakuniy nuqtalarini taqdim etadi. Tugunni dastlabki ishga tushirish bu qiymatlarni avtomatik kelishtirmaydi: operatorlar taymautlar, to‘plam hajmlari va konsensusga daxldor boshqa sozlamalar tarmoqqa mosligini tekshirishi kerak.

Jarayonni soddalashtirish uchun, tarmoq administratoridan `config.toml`ning maxfiy ma'lumotlar, masalan tarmoq tengdosh shaxsiy kalitlarini o'z ichiga olmaydigan qisqartirilgan versiyasini so'rashingiz mumkin.

#### 3. Ko‘rsatmani taqdim eting {#_3-submit-the-instruction}

Tugun ishga tushgach, uni ro‘yxatdan o‘tkazish ko‘rsatmasini yuboring. Tugun aloqa o‘rnatish jarayonidan o‘tib, tarmoq bilan xabar almasha boshlaydi.

::: tip

Tarmoq qo‘shnisi ro‘yxatdan o‘tkazish ko‘rsatmasini yuborish yangi tarmoq qo‘shnisi jarayonini ishga tushirmaydi (va ishga tushira olmaydi).

:::

### Tarmoq ishtirokchilarini ro'yxatdan chiqarish {#unregistering-peers}

Tarmoq ishtirokchilarini ro‘yxatdan o‘tkazmaslik haqida nima deyish mumkin? Xavfsizlik sabablariga ko‘ra, bu jarayon bir tomonlama amalga oshiriladi. Tarmoq, tarmoq ishtirokchisini olib tashlamoqchi ekanligini kelishib oladi, lekin tarmoq ishtirokchisi o‘zi, nima uchun hech kim uning bilan gaplashmayotganini ko‘p bilmaydi.

Ko'p hollarda, agar siz tarmoq hamkasbini ro'yxatdan chiqarishni xohlasangiz, buni Bizans xatosi sababli qilishingiz kerak. Faqat shu tarmoq hamkasbini “g'oyib qilish” tarmoqdagi zararli shaxsning hayotini qiyinlashtiradi.
