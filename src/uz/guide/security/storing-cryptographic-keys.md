---
translation_locale: uz
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kriptografik kalitlarni saqlash {#storing-cryptographic-keys}

Sizning hissiy ma'lumotlaringiz faqat kriptografik kalitlarni himoya qilish uchun <abbr title="Operational Security">OPSEC</abbr> amaliyotlarini qabul qilsangizgina maxfiy qoladi. Ijtimoiy muhandislik tahdidlari, kimdir hokimiyatga ega bo'lgan shaxs sifatida o'zini qo'zg'atgan odam sizni ularga shaxsiy kriptografik kalitingizni berishga urinayotganda, haqiqiy. Har doim ehtiyot bo'ling va shaxsiy kalitingizni baham ko'rmang, uni o'zingizning xonangizning kalitlarini faqat ishonchli kishilar uchun ajratganingiz kabi qabul qiling.

<abbr title="Operational Security">OPSEC</abbr> va uning eng yaxshi amaliyotlari to'g'risida ko'proq ma'lumot olish uchun [Operatsiyaviy xavfsizlik ](./operational-security)-ni ko'ring.

## Kriptografik kalitlarni raqamli saqlash {#storing-cryptographic-keys-digitally}

Kriptografik kalitlarni raqamli himoya qilish haqida gap ketganda, asosan faqat ikkita yondashuv mavjud[SSH](https://www.ssh.com/) va [GPG](https://www.gnupg.org/). Ushbu usullar sizning kriptografik kalitlaringizga ruxsatsiz kirishning oldini olish uchun xavfsizlik qatlamlarini taqdim etadi.

Ko'plab Iroha arxitektura qarorlari Secure Shell (`SSH`) protokolining prinsiplariga ta'sir ko'rsatdi, shuning uchun ushbu bo'lim asosan `SSH` yondashuvga qaratilgan. Iroha ekotizimida kriptografik kalitlaringizni saqlash uchun protokolni qanday samarali amalga oshirish kerakligi to'g'risida ko'rsatmalar berish.

### SSH va SSH vositalaridan foydalanish {#using-ssh-and-ssh-agent}

Xavfsiz shell protokoli (`SSH`) - bu virtual darvoza sifatida xizmat qiladigan kriptografik tarmoq protokoli, xavfli bo'lishi mumkin bo'lgan tarmoqlar orqali masofadan tashqarida ishlaydigan mashinalarga xavfsiz kirish imkoniyatini yaratish SSH Bu tizimlar bilan masofaviy aloqa o'tkazishning samarali usulini ta'minlaydi, bu esa jismoniy aloqa talab qilinmasdan. Bu borada, `SSH` ikkita asosiy autentifikatsiya mexanizmini taklif qiladi: an'anaviy parolga asoslangan yondashuv va xavfsizroq davlat-xususiy kalit juftlik usuli.

`SSH` haqida ko'proq ma'lumot olish uchun [ga qarang SSH Akademiyasi mavzusi](https://www.ssh.com/academy/ssh).

Login jarayonini soddalashtirish va takrorlanuvchi kirishni chetlab o'tish uchun `SSH` kalitlarini SSH Agent (`ssh-agent`) bilan birlashtirib qo'yish mumkin, bu yordamchi dastur sizning `SSH` kalitlaringizni va/yoki parolingizni sessiya davomida eslaydi. Ushbu o'rnatish `SSH` darvoza boshqa mashinalarga ulanish chog'ida kalitlarga osonlikcha kirish imkonini beradi.

Bu erda ish oqimi quyidagicha bo'ladi: sizning ommaviy kalitingiz masofadagi tizimda saqlanadi va shaxsiy kalitingizni xavfsiz saqlash kerak. Uzoq tizimga kirish kerak bo'lganda, `ssh-agent` O'zingizning ommaviy kalitingizni kirish tizimiga yuborish uchun qadamlar qo'yadi. [musobaqa](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) faqatgina shaxsiy kalitingiz to'g'ri javob bera oladi. `ssh-agent` bu qiyinchilikni o'zingizning xususiy kalitingizdan foydalangan holda hal qiladi va to'g'ri javobni masofani uzluksiz tizimga yuboradi. Agar javob tizim kutgan narsalarga muvofiq bo'lsa, sizga kirish huquqi beriladi.

`ssh-agent` ning go'zalligi shundaki, u seans davomida shaxsiy kalitingizni saqlaydi, shuning uchun har safar masofadan o'tgan tizimga ulanganingizda parol yoki xususiy kalit parol so'zlarini kiritishingiz shart emas.

`ssh-agent` to'g'risida ko'proq ma'lumot olish uchun [, tegishli SSH akademiyasi mavzusini](https://www.ssh.com/academy/ssh/agent) ko'ring.

::: info Izoh

`SSH` protokoli va `ssh-agent` vositasi to'g'risida batafsil ma'lumot olish uchun quyidagi mavzularni ko'rib chiqing [SSH Akademiya ](https://www.ssh.com/academy):

  - [Bu nima ? SSH (Xavfsiz shell)?](https://www.ssh.com/academy/ssh)
  - [ssh-agent: Ssh-agentni, agentni yuborish va agent protokolini](https://www.ssh.com/academy/ssh/agent) qanday konfiguratsiya qilish kerak

:::

### Maxfiy soʻzlarni boshqarish dasturi qoʻshish {#adding-a-password-manager-program}

`SSH` kalitlaringizning xavfsizligini password bilan himoya qilish tavsiya etiladi, bu sizning hissiy ma'lumotlaringizni olishni maqsad qilgan zararli tomonlar yo'lida qo'shimcha to'siq bo'ladi.

Har xil parol boshqaruvchilari foydalanuvchi parollari va `SSH` kalitlarini vaqtincha saqlash uchun ishlatilishi mumkin. aniqlik uchun, [KeePass](https://keepass.info/) Linuxga asoslangan operatsion tizimlarda ishlaydigan [KeePassXC](https://keepassxc.org/) port sifatida ishlatiladi .

KeePassXC ni qanday o'rnatish kerakligi to'g'risida ko'rsatmalar uchun quyidagi [Konfiguratsiya qilish KeePassXC](#configuring-keepassxc) bo'limini ko'ring.

![KeePassXC: `Main` ekran UI](../../../img/KeePassXC.png)

KeePassXC xavfsizlik, moslashuvchanlik va nazoratni kuchaytiradi. U nafaqat maxfiy so'zlarni, balki `SSH` kalitlarini ham saqlaydi. kalitlarni saqlash uchun ishlatilganda, ushbu parol boshqaruvchisi `ssh-agent` ni saqlangan kalitlar bilan ta'minlaydi; KeePassXC oynasi yopilganidan so'ng, ular o'z xotirasidan tezda olib tashlanadi.

::: manzil

Nazariy jihatdan, har qanday KeePass portlar [rasmiy veb-saytida koʻrsatilgan](https://keepass.info/download.html) quyidagilardan birini tavsiya etamiz: [KeePassX](https://www.keepassx.org/) yoki [KeePassXC](https://keepassxc.org/).

:::

#### KeePassXC ni sozlash {#configuring-keepassxc}

KeePassXC ni o'rnatish uchun quyidagi qadamlarni bajaring:

1. KeePassXC ni ishga tushiring, so'ngra asboblar > moslamalarga boring yoki yuqoridagi UI paneldan Gear tugmasini tanlang.

2. Ko'rinadigan ilova o'rnatishlari tabida chap menyudan SSH Agentni tanlang va keyin SSH Agent integratsiyasini qo'llashga ruxsat berishni tanlash qutisini tanlang.

   ::: info Maʼlumot uchun ekran rasmini koʻrsatish

   ![KeePassXC `SSH Agent` tab: SSH Agentni qo'llash](../../../img/keepassxc_ssh_agent.png)

   :::

3. Yangi KeePassXC ma'lumotlar bazasini yaratish. Ko'rsatmalar uchun [KeePassXC Foydalanuvchi qo'llanmalarini ko'rish > Birinchi ma'lumot bazasini yaratish ](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

4. Siz yaratgan KeePassXC ma'lumotlar bazasida saqlashni istagan har bir kalit uchun quyidagi qadamlarni bajaring:

   - Ma'lumotlar bazasiga yangi yozuv qo'shing. Ko'rsatmalar uchun [KeePassXC Foydalanuvchi qo'llanma > Birinchi ma'lumotlar bazasini yaratish](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database)-ni ko'ring.

   - Yangi yozuv qo'shilganda, kalitni o'z ichiga olgan faylni quyidagi usul bilan qo'shib qo'ying: chap menyudan Advanced tanlang, so'ngra Qo'shish bo'limida Qo'shishni tanlang, ko'rinadigan Tanlang fayllar oynasida kerakli faylni tanlang.

   - Yangi yozuv qo'shilganda chap menyudan SSH Agentni tanlang, so'ngra Xususiy kalit bo'limida Qo'shish menyusidan qo'shgan kalit faylini tanlang; so'ngra quyidagi xatcho'plarni tanlang:

      - Ma'lumotlar bazasi ochilgan/qopilganda agentga kalit qo'shish

      - Ma'lumotlar bazasi yopilganda / qulflanganida agentdan kalitni olib tashlash.

      - Ushbu kalitdan foydalanilganda foydalanuvchi tomonidan tasdiqlashni talab qiling

   - Agar kerak bo'lsa, ro'yxatga boshqa o'zgartirishlar kiriting.

   - Tayyor bo'lganda, yozuvni saqlash uchun OK tanlang.

   ::: details Koʻrsatkich ekran koʻrinishlarini koʻrsatish

   ![KeePassXC `Advanced` tab: Xususiy kalitga ilova qo'shish](../../../img/keepassxc_private_key.png)

   ![KeePassXC `SSH Agent` tab: Xususiy kalitni qo'shish](../../../img/keepassxc_pk_agent.png)

   :::

##### Kutilgan natijalar {#expected-results}

- Kriptografik va `shh` kalitlari KeePassXC ma'lumotlar bazasida KeePassXC oynasi ochiq bo'lganda kirish mumkin bo'lgan yozuvlar sifatida saqlashadi.

- O'rnatilgan kriptografiya va `ssh` kalitlari ruxsat olish uchun zarur bo'lganda foydalanish mumkin.

- saqlangan kriptografik va `ssh` kalitlar uydan olib tashlanadi `ssh-agent` bir marta KeePassXC deraza yopilgan.

::: info Izoh

`ssh-agent` ushbu kalitdan foydalanilganda foydalanuvchilarni tasdiqlashni talab qilish variantini qo'llab-quvvatlamagan holda, unga kalit bergan jarayonni kuzatmasligi mumkin. Agar parol boshqaruvchisi jarayonida zararli dastur yoki tizim xizmati tomonidan `SIGKILL` signal orqali to'xtalsa, Unix tizim dasturlari `SIGKILL` ni ushlab bo'lmaydi, shuning uchun kalit `ssh-agent` da qolishi mumkin.

:::

## Kriptografik kalitlarni saqlash {#storing-cryptographic-keys-physically}

Offlayn xavfsizlikning eng yuqori darajasini izlayotganlar uchun kriptografik kalitlarni saqlash imkoniyati raqamli tarmoqlardan to'liq uzilganligini ta'minlaydi va shu bilan birga ruxsatsiz kirish xavfini kamaytiradi. Jismoniy variantni tan olish turli xil xavfsizlik ehtiyojlarini qondirishga bag'ishlanganligimizni ta'kidlaydi.

### Hardver kalitidan foydalanish {#using-a-hardware-key}

Bizning jamoamiz asbob-uskuna kalitlarini eng yaxshi xavfsizlik choralaridan biri deb hisoblaydi. Hardver kaliti USB port orqali ulashadigan va odatiy flash-drive o'lchamli kompakt qurilma. U mashinaga ulashganda faqat xavfsizlik bilan bog'liq voqealarni qayta ishlash. Bu sizga qurilmani xavfsizlikni buzish holatida osonlikcha uzatib qo'yishga imkon beradi yoki kerak bo'lganda uni boshqa mashina bilan qayta ulashga imkon beradi.

Biroq, har biri o'zining noyob APIs ga ega bo'lgan hardware kalitlarining ko'plab brendlari mavjudligi sababli sizning ehtiyojlaringizga eng mos keladigan kalitni topish uchun bozorni tadqiq qilish muhimdir.

Hozirga qadar, bizning jamoamiz ichki sinovdan o'tgan [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) juda ko'p ijobiy xususiyatlarga ega bo'lganligi isbotlangan asbob-uskuna kalitlari, shu jumladan API funktsionalligi.

Biroq, e'tiborga olish kerak bo'lgan muqobil kamchilik bor. [HMAC qiyinchilik-javob autentifikatsiyasini ](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) amalga oshirish va ushbu javob uchun tegishli xususiy kalitni saqlash zaiflikni yaratishi mumkin. Ushbu o'rnatish hujumchilarga YubiKey 5C xotirasida saqlangan ma'lumot haqida bilimdon taxmin qilish imkonini berishi mumkin, shu bilan birgalikda umumiy xavfsizlikni buzishi mumkin.

Yaxshiyamki, bu zaiflikni YubiKey 5Cdan foydalanishning alternativa yondashuvini qo'llash orqali kamaytirish mumkin. Fikr shundaki, siz kriptografik va `SSH` kalitlaringizni saqlaydigan KeePassXC ma'lumotlar bazasiga xavfsiz kirish uchun YubiKey 5Cdan foydalaning. Ushbu usul hatto foydali deb topilishi mumkin, chunki u ko'pgina maxfiy so'zlarning xavfsizligidan ustundir va KeePassXC ma'lumotlar bazasi sovuq bo'lgan taqdirda zararli tomon sizning qurilma kalitingizga ega bo'lishi kerakligini anglatadi.

::: ma'lumot

Yuqoridagi usul haqida ko'proq ma'lumot olish uchun quyidagilardan birining javobini ko'ring: KeePassXC ishlab chiquvchilar[Janek Bevendorff](https://github.com/phoerious) Quyidagilarga StackExchange savol:

[Foydalanish oqilonami ? KeePassXC bilan YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### Mnemonik so'zlardan foydalanish {#using-a-mnemonic-phrase}

Boshqa tomondan, siz shaxsiy kalitni bir qator so'zlar sifatida yodga olishingiz mumkin, bu mnemonik ibora deb tanilgan. Bu usul ko'plab pulkalarda qo'llaniladi va 25 ta aniq so'zni eslab qolishni talab qiladi. Ko'pchilik parol boshqaruvchilari, shu jumladan ilgari muhokama qilinganlar KeePassXC, mnemonik hasharotlarni yaratish.
