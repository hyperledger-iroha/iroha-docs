---
translation_locale: uz
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Virtual xususiy tarmoqlar {#virtual-private-networks}

A <abbr title="Virtual Private Network">VPN</abbr> tarmoq nazoratini amalga oshiradi
yetib borishi mumkin bo'lgan cheklovlar Iroha Xususiy va ijtimoiy xizmatlar uchun eng foydali
muvofiqlashtiruvchilar, dasturlarning orqa tomoni va operatorlari mavjud bo'lgan konsorsiumlarni ishga tushirish
ochiq internet yo'nalishlari o'rniga xususiy manzillar orqali muloqot qilishlari kerak.

A VPN o'rnini bosmaydi Iroha tengdosh kalitlar, hisob kalitlari, ruxsatnomalar, yong'in devori
qoidalari, monitoring yoki xavfsiz kalit saqlash.
joylashtirish chegarasi: VPN tarmoqlarga yetib borishni qisqartirish, Iroha
Konfiguratsiya va boshqaruv qaysi tengdoshlar va hisoblarga ishonish kerakligini hal qiladi.

## Qachon foydalanish VPN {#when-to-use-a-vpn}

A VPN qachon:

- validatorlar turli tashkilotlarda yoki turli xostingda ishlatiladi
  atrof muhit
- Torii faqat dasturlarning orqa tomoni, operatorlari yoki ishonchli foydalanuvchilar tomonidan amalga oshirilishi kerak
  mijozlar
- metrikalar, jurnallar, SSH, yoki boshqa ma'muriyat oxirgi punktlari xususiy
  operatorlar tarmog'i
- sinov yoki bosqichlash tarmog'i ishlab chiqarish kirish nazoratlariga o'xshash bo'lishi kerak
  jamoatchilikning oxirgi nuqtalarini ochib berish

A VPN har bir ishga tushirish uchun talab qilinmaydi.
oshkor qilish Torii Umumiy darvoza, yukni muvozanatlash vositasi yoki orqa tomondan vakil orqali.
bu holatda, validatorning o'z-o'zlarining trafik va boshqaruv oxirgi nuqtalarini
iloji boricha cheklangan tarmoq.

::: tip

Brauzer VPN faqat ushbu brauzerdan trafikni himoya qiladi.
`irohad`, CLI, SDK, SSH, ko'rsatkichlar yoki ehtiyot trafik, agar ushbu jarayonlar
bir xil xususiy tarmoq orqali yo'naltirilgan.

:::

## Ishlab chiqarish usuli {#deployment-pattern}

Xususiy validator mesh uchun har bir validatorga barqaror VPN manzili yoki
xususiy DNS O'z tengdoshlariga reklama qilingan tengdoshlari manzillari
boshqa tasdiqlovchilardan ushbu tarmoq orqali yetib borishi mumkin:

```toml
trusted_peers = [
  "PUBLIC_KEY_1@10.20.0.11:1337",
  "PUBLIC_KEY_2@10.20.0.12:1337",
  "PUBLIC_KEY_3@10.20.0.13:1337",
  "PUBLIC_KEY_4@10.20.0.14:1337",
]

[network]
address = "10.20.0.11:1337"
public_address = "10.20.0.11:1337"

[torii]
address = "10.20.0.11:8080"
```

Joriy tengdoshlariga berilgan manzildan foydalanish `network.address` va
`network.public_address`. Har bir tengdosh o'xshash ishonchli tengdosh shaxslarni ro'yxatga olishi kerak,
lekin u o'z manzilidan yetib boradigan manzillar bilan VPN yo'nalish jadvali.

mijoz va CLI konfiguratsiyalar bir Torii o'tish orqali yetib boradigan oxirgi nuqta
ko'rsatilgan VPN yoki nazorat qilingan ichki darvoza orqali:

```toml
torii_url = "http://10.20.0.11:8080"
```

Agar Torii O ' zbekiston Respublikasining VPN, uni orqa tomiriga o'rnatish yoki
yukni muvozanatlash vositasi TLS, autentifikatsiya, stavkalarni cheklash va yozuv.
Quruq bir-biriga tenglashtirilgan portlar yoki ma'lumotlarni to'g'ridan-to'g'ri
ommaviy Internet.

## Firewall qoidalari {#firewall-rules}

Host va bulut firewall qoidalari VPN mavjud:

| Xizmat | Ruxsat etilgan kirish |
| --- | --- |
| Tengdoshlik portlari | Boshqa tasdiqlovchi VPN faqat manzillar |
| Torii | Ilovalar orqa tomoni, operatorlari yoki ishonchli mijoz VPN ranglar |
| Metriklar va sog'liqni saqlash tekshiruvlari | Operatorlar tarmog'idagi monitoring tizimlari |
| SSH va boshqaruv | Bastion uy egasi, imtiyozli operator VPN rang yoki shisha parchalanish jarayoni |
| Nishonchalar va saqlashni takrorlash | Xususiy tarmoqdagi zaxira tizimlari |

Dastlabki rad etish qoidalari keng ruxsat berish qoidalariga qaraganda audit qilish osonroq.
tarmoqga qo'shilsa, VPN a'zolik, firewall ruxsatlar ro'yxati va Iroha
bir koordinatsiyalangan o'zgarish sifatida ishonchli tengdoshlar konfiguratsiyasi.

## Operativ tekshiruv ro'yxati {#operational-checklist}

- Tekshirilgan va faol saqlanadigan bir tanlang VPN amalga oshirish, masalan:
  WireGuard, IPsec yoki tashkilot tomonidan tasdiqlangan xususiy tarmoq.
- Oʻziga xosdan foydalanish VPN har bir uy egasi va operator uchun ma'lumotlar. VPN kalitlar
  tasdiqlovchilar o'rtasida.
- saqlang VPN ma'lumotlar Iroha Xususiy kalitlar va genesis imzosi
  material.
- Monitor VPN kechikish, paket yo'qotishi, qayta ulanish va yo'nalish o'zgarishlari.
  tarmoqning doimiy turishmovchiligiga nisbatan sezgir bo'ladi.
- samaradorligini tekshirish MTU. Paketning parchalanishi oraliq tenglamlarga oʻxshaydi
  yoki Torii xatolar.
- Hujjat VPN ranglar tengdoshlarga yetib borishga ruxsat etiladi; Torii, metrikalar,
  SSH, va qo'shimcha oxirgi nuqtalar.
- Aylaning VPN uy egasi, operator hisobvarag'i yoki tashkilot ketganda ma'lumotlar
  tarmoq.
- Birovdan qoch VPN sertifikatlovchilar o'rtasidagi yagona yo'l sifatida kirish darvozalari.
  ishlab chiqarish tarmoqlari uchun ortiqcha darvozalar yoki joy-sayt yo'nalishlari.
- Qayd etish VPN incident javob mashg'ulotlari muvaffaqiyatsiz tugadi, shuning uchun operatorlar qachon
  tarmoq partitsiyasini Iroha jarayon muvaffaqiyatsiz tugadi.

## Bogʻliq sahifalar {#related-pages}

- [Xavfsizlik prinsiplari](/uz/guide/security/security-principles.md)
- [Operatsiya xavfsizligi](/uz/guide/security/operational-security.md)
- [Tarmoqni ishga tushirishning kalitlari](/uz/guide/configure/keys-for-network-deployment.md)
- [Tengdoshlarni boshqarish](/uz/guide/configure/peer-management.md)
- [Tengdoshlar bilan taqqoslash](/uz/reference/peer-config/index.md)
