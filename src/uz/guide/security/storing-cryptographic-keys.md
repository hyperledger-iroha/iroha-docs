---
translation_locale: uz
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kriptografik kalitlarni saqlash {#storing-cryptographic-keys}

Sizning hissiy ma'lumotlaringiz faqat qabul qilsangiz maxfiy qoladi <abbr title="Operational Security">OPSEC</abbr> Kriptografik kalitlarni himoya qilish bo'yicha amaliyotlar. Ijtimoiy muhandislik tahdidlari, u erda kimdir o'zini hokimiyatga ega shaxs sifatida ko'rsatgan holda sizni shaxsiy kriptografik kalitingizni berish uchun manipulyatsiya qilishga harakat qiladi. Har doim ehtiyot bo'ling va xususiy kalitingizni baham ko'rishdan qoching.

Ma'lumot olish uchun <abbr title="Operational Security">OPSEC</abbr> va eng yaxshi amaliyotlar, qarang [Operatsiya xavfsizligi](./operational-security).

## Kriptografik kalitlarni raqamli saqlash {#storing-cryptographic-keys-digitally}

Kriptografik kalitlarni raqamli ravishda himoya qilish haqida gap ketganda, asosan faqat ikkita yondashuv[SSH](https://www.ssh.com/) va [GPG](https://www.gnupg.org/) mavjud. Ushbu usullar kriptografik kalitlaringizning ruxsatsiz kirishini oldini olish uchun xavfsizlik qatlamlarini ta'minlaydi.

Koʻpchilik Iroha Arxitektura qarorlari **Xavfsiz shell** (`SSH`) protokoli, shuning uchun ushbu bo'lim asosan `SSH` yo'nalishida kriptografik kalitlarni saqlash uchun protokolni samarali amalga oshirish haqida ko'rsatmalar taqdim etadi. Iroha ekotizim.

### Foydalanish SSH va SSH Agent {#using-ssh-and-ssh-agent}

**Xavfsiz shell protokoli** (`SSH`) - bu virtual darvoza sifatida xizmat qiladigan kriptografik tarmoq protokoli bo'lib, ehtimol o'ta xavfsiz bo'lmagan tarmoqlar orqali masofadan tashqarida ishlaydigan mashinalarga xavfsiz kirish imkonini beradi. SSH Keyaccess ma'lumotlari. Bu tizimlar bilan masofaviy aloqa qilishning samarali usulini ta'minlaydi, bu holda jismoniy mavjudlik zarur emas. `SSH` ikkita asosiy autentifikatsiya mexanizmini taklif etadi: an'anaviy parol asosida yondashish va xavfsizroq jamoat-xususiy kalit juftligi usuli.

Ma'lumot olish uchun `SSH`, koʻrish [bogʻliq SSH Akademiya mavzusi](https://www.ssh.com/academy/ssh).

Login jarayonini soddalashtirish va takrorlanuvchi kirishni chetga surish uchun `SSH` kalitlar bilan **SSH Agent** (`ssh-agent`)Sizni eslaydigan yordamchi dasturi `SSH` o'tirish muddati uchun kalitlar va/yoki parol. `SSH` boshqa mashinalarga ulanish vaqtida kalitlarga osonlikcha kirish uchun darvoza.

Bu erda ish oqimi quyidagicha bo'ladi: siz o'zingizning jamoatchilik kalitingizni masofada saqlashingiz va shaxsiy kalitingizni xavfsiz saqlang. `ssh-agent` o ' zingizga xabar berish uchun qadamlar _jamoatchilik_ O'rnatilgan tizimga kirish kalitini. Uzoq tizim [musobaqa](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) faqat sizning _xususiy_ kalit to'g'ri javob berishi mumkin. `ssh-agent` ushbu qiyinchilikni o ' zlashtirish uchun _xususiy_ Agar javob tizim kutgan narsaga mos kelsa, sizga kirish huquqi beriladi.

O'sha yerning go'zalligi `ssh-agent` Bu sizning shaxsiy kalitingizni seans davomida saqlaydi, shuning uchun har safar masofadan o'tgan tizimga ulanish paytida parol yoki xususiy kalit parol so'zlarini kiritishga hojat yo'q.

Ushbu hujjatning `ssh-agent`, koʻrish [bogʻliq SSH Akademiya mavzusi](https://www.ssh.com/academy/ssh/agent).

::: info Izoh

Bu mavzular haqida batafsil ma'lumot olish uchun `SSH` protokol va `ssh-agent` vosita, quyidagilarni ko'ring [SSH Akademiya](https://www.ssh.com/academy) mavzular:

  - [Nima SSH (Xavfsiz shell)?](https://www.ssh.com/academy/ssh)
  - [ssh-agent: qanday qilib ssh agentni, agentni yuborish va agent protokolini sozlash kerak](https://www.ssh.com/academy/ssh/agent)

:::

### Maxfiy soʻz boshqaruvchisi dasturini qoʻshish {#adding-a-password-manager-program}

Oʻzingizning uyingiz xavfsizligini oshirish tavsiya etiladi `SSH` kalitlarni parol bilan himoya qilish orqali, bu sizning hissiy ma'lumotlaringizni olishni maqsad qilgan zararli tomonlarning yo'lida qo'shimcha to'siq sifatida xizmat qiladi.

Foydalanuvchilarning parollarini saqlash uchun turli xil parol menejerlaridan foydalanish mumkin `SSH` kalitlari vaqtincha. [KeePass](https://keepass.info/) so'zlarni boshqarish uchun misol sifatida ishlatiladi. [KeePassXC](https://keepassxc.org/) Linuxga asoslangan operatsion tizimlarda ishlaydigan port.

O'rnatish usuli bo'yicha ko'rsatmalar uchun KeePassXC koʻrish [Konfigurarlash KeePassXC](#configuring-keepassxc) quyida keltirilgan qism.

![KeePassXC: `Main` ekran UI](../../../img/KeePassXC.png)

KeePassXC U nafaqat parollarni, balki `SSH` kalitlarni saqlash uchun ishlatilayotganda, bu parol boshqaruvchisi `ssh-agent` saqlangan kalitlar bilan, keyinchalik tezda uning xotirasidan KeePassXC deraza yopilgan.

::: tip

Nazariy jihatdan, KeePass portlar [rasmiy veb-saytida koʻrsatilgan](https://keepass.info/download.html) asosiy saqlash maqsadlarida foydalanish mumkin.
Quyidagilardan birini tavsiya etamiz: [KeePassX](https://www.keepassx.org/) yoki [KeePassXC](https://keepassxc.org/).

:::

#### Konfigurarlash KeePassXC {#configuring-keepassxc}

Konfiguratsiyalash uchun KeePassXC, quyidagi qadamlarni bajaring:

1. Uchratish KeePassXC, keyin ketish **Asboblar** > **Sozlamalar**, yoki **Ishchi** Yuqoridan tugma UI panel.

2. O ' zbekiston Respublikasida **Ilovalar moslamalari** koʻrinadigan tabni tanlang **SSH Agent** Chap menyudan, soʻngra **Qoʻllash SSH Agent integratsiyasi** chek qutisi.

   ::: info Maʼlumot uchun ekran koʻrinishini koʻrsatish

   ![KeePassXC `SSH Agent` Tab: qoʻllash SSH Agent](../../../img/keepassxc_ssh_agent.png)

   :::

3. Yangi yaratish KeePassXC Ma'lumotlar bazasi. [KeePassXC Foydalanuvchi qoʻllanma > Birinchi maʼlumotlar bazasini yaratish](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

4. Har bir kalit uchun siz saqlash istaydi KeePassXC Siz yaratgan ma'lumotlar bazasi, quyidagi qadamlarni bajaring:

   - Ma'lumotlar bazasiga yangi yozuv qo'shing. [KeePassXC Foydalanuvchi qoʻllanma > Birinchi maʼlumotlar bazasini yaratish](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

   - Yangi yozuv qo'shilganda, kalitni o'z ichiga olgan faylni quyidagi usul bilan bog'lang: **Avvalgi** Chap menyudan tanlang , keyin tanlang **Qoʻshish** bilan **Qo'shimchalar** bo'limda kerakli faylni tanlang **Fayllarni tanlash** ko'rinadigan deraza.

   - Yangi yozuv qo'shilganda tanlang **SSH Agent** Chap menyudan qoʻshgan kalit faylini tanlang **Qo'shish** menyuda **Xususiy kalit** bo'lim; so'ngra quyidagi xatcho'plarni tanlang:

      - **Ma'lumotlar bazasi ochilganda/qovurilganda agentga kalit qo'shish**

      - **Ma'lumotlar bazasi yopilganda/qopilganda agentdan kalitni olib tashlash**

      - **Ushbu kalitdan foydalanilganda foydalanuvchi tomonidan tasdiqlashni talab qiling**

   - Agar kerak bo'lsa, yozuvni boshqa o'zgartirish.

   - Tayyor bo'lganda tanlang **OK** kirishni saqlash uchun.

   ::: details Maʼlumotlarni koʻrsatish

   ![KeePassXC `Advanced` Tab: Xususiy kalit ilovalarini qoʻshish](../../../img/keepassxc_private_key.png)

   ![KeePassXC `SSH Agent` Tab: Xususiy kalit ilovalarini qoʻshish](../../../img/keepassxc_pk_agent.png)

   :::

##### Kutilgan natijalar {#expected-results}

- Kriptografik va `shh` kalitlar bir KeePassXC Ma'lumotlar bazasi KeePassXC deraza ochiq.

- saqlangan kriptografik va `ssh` kalitlar ruxsat olish uchun zarur bo'lganda ishlatilishi mumkin.

- saqlangan kriptografik va `ssh` kalitlar o'chirilgan `ssh-agent` bir marta KeePassXC deraza yopilgan.

::: info Izoh

O ' zbekiston Respublikasining **Ushbu kalitdan foydalanilganda foydalanuvchi tomonidan tasdiqlashni talab qiling** tanlov, `ssh-agent` kalitni taqdim etgan jarayon ustidan nazorat qilmasligi mumkin. Agar parol boshqaruvchi jarayoni zararli dastur yoki tizim xizmati tomonidan `SIGKILL` signal, kalit ehtimol `ssh-agent`, Unix tizim dasturlari intercept qila olmaydi `SIGKILL`.

:::

## Kriptografik kalitlarni saqlash {#storing-cryptographic-keys-physically}

Offline xavfsizlikning eng yuqori darajasini izlayotganlar uchun kriptografik kalitlarni saqlash imkoniyati raqamli tarmoqlardan to'liq uzilganligini ta'minlaydi va shu yo'sin ruxsatsiz kirish xavfini kamaytiradi.

### Hardver kalitidan foydalanish {#using-a-hardware-key}

Bizning jamoamiz uskunalar kalitlarini eng yaxshi xavfsizlik choralaridan biri deb hisoblaydi. USB port va odatiy flash-drive o'lchamiga ega bo'lgan. faqat mashina bilan ulanish chog'ida xavfsizlik bilan bog'liq hodisalarni o'zgartiradi. Bu sizga qurilmani xavfsizlik buzilishi yuz bergan taqdirda osonlikcha uzatib qo'yish yoki kerak bo'lganda uni boshqa mashina bilan qayta ulash imkonini beradi.

Biroq, juda ko'p brendlar mavjud Hardver kalitlari har biri o'zining noyob APIs Sizning ehtiyojlaringizga mos keladigan kalitni topish uchun bozorni tadqiq qilish muhimdir.

Hozircha, bizning jamoamiz ichki sinovlarda ishtirok etdi [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) juda ko'p ijobiy xususiyatlarga ega bo'lgan, shu jumladan ko'p qirrali API funktsionalligi.

Biroq, e'tiborga olish mumkin bo'lgan kamchiliklar bor. [HMAC Muammo-javob autentifikatsiyasi](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) va tegishli ma'lumotni saqlash _xususiy_ Ushbu o'rnatish hujumchilar tomonidan tajriba bilan ta'minlangan ma'lumotlar to'g'risida taxmin qilish imkonini berishi mumkin. YubiKey 5C xotirasi, shu bilan birga umumiy xavfsizlikni buzadi.

Yaxshiyamki, ushbu zaiflikni o'zlashtirish uchun alternativa yondashuvdan foydalanish mumkin. YubiKey 5C. Fikrimiz YubiKey 5C KeePassXC kriptografik va `SSH` Bu usul hatto foydali deb topilishi mumkin, chunki u ko'pgina parollarning xavfsizligini oshirib boradi va zararli tomon uchun sizning apparat kalitingizga ega bo'lish zarur. KeePassXC ma'lumotlar bazasi sotuvdi.

::: info

haqida ko'proq o'qish uchun _yuqoridagi usul_, javobini ko'ring KeePassXC ishlab chiquvchilar[Janek Bevendorff](https://github.com/phoerious) Quyidagilarga StackExchange savol:

[Foydalanish oqilonami ? KeePassXC bilan YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### Mnemonik soʻzlardan foydalanish {#using-a-mnemonic-phrase}

Boshqa tomondan, siz xususiy kalitni bir qator so'zlar sifatida yodlab olishingiz mumkin. _mnemonik so'z_. Ushbu usul ko'plab hamyonlarda qo'llaniladi va 25 ta aniq so'zni eslab qolishni talab qiladi. KeePassXC, mnemonik parol so'zlari ishlab chiqarishni taklif etadi.
