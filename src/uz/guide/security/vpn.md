---
translation_locale: uz
translation_source: /guide/security/vpn.md
translation_source_hash: 020591f0d7c5560dfb2e9f3f4537f429cbeba864c3eb022856d42addcf32e225
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Virtual xususiy tarmoqlar {#virtual-private-networks}

<abbr title="Virtual Private Network">VPN</abbr> - bu Iroha xizmatlariga kim etib borishi mumkinligini cheklaydigan tarmoq nazorati. Bu sertifikatlovchilar, dasturlarning orqa tomoni va operatorlar ochiq internet yo'nalishlari o'rniga xususiy manzillar orqali muloqot qilishlari kerak bo'lgan xususiy va konsorsium joylashtirish uchun eng foydali hisoblanadi.

VPN Iroha tengdosh kalitlari, hisob kalitlari, ruxsatnomalar, yong'in devor qoidalari, monitoring yoki xavfsiz kalitlarni saqlashni almashtirmaydi. Uni joylashtirish chegarasidagi bir qatlam sifatida qabul qiling: VPN tarmog'i mavjudligini qisqartiradi, Iroha konfiguratsiyasi va boshqaruv esa qaysi tengdoshlar va hisoblarga ishonish kerakligi haqida qaror qiladi.

## VPN-dan qachon foydalanish kerak {#when-to-use-a-vpn}

Quyidagi hollarda VPN dan foydalaning:

- validatorlar turli tashkilotlarda yoki turli xosting muhitlarida ishlatiladi
- Torii faqat dasturlarning orqa tomoni, operatorlar yoki ishonchli mijozlar tomonidan mavjud bo'lishi kerak
- Metriklar, jurnallar, SSH yoki boshqa boshqaruv oxirgi nuqtalari xususiy operatorlar tarmog'ida qolishi kerak
- Sinov yoki bosqichma-bosqich o'rnatish tarmog'i ommaviy oxirgi nuqtalarni oshkor qilmasdan ishlab chiqarish kirish nazoratlariga o'xshashi kerak.

VPN har bir ishga tushirish uchun talab qilinmaydi. Ommaviy tarmoqlar Torii ni ommaviy darvoza, yukni muvozanatlash vositasi yoki qaytarib yuboruvchi vosita orqali qasddan ochib berishlari mumkin. Hatto shunday holatda ham, iloji boricha cheklangan tarmoqlarda validatorning o'rta-o'rta trafik va boshqaruv oxirgi nuqtalarini saqlang.

::: tip

Bir brauzer VPN faqat ushbu brauzerdan trafikni himoya qiladi. U `iroha3d`, CLI, SDK, SSH, o'lchovlarni yoki ehtiyot saqlash trafikini himoya qilmaydi, agar bu jarayonlar bir xil xususiy tarmoq orqali yo'naltirilmagan bo'lsa.

:::

## Ishlab chiqarish usuli {#deployment-pattern}

Xususiy validator mesh uchun har bir validatorga barqaror VPN manzili yoki xususiy DNS nomi berilsin. Tengdoshlarni o'zlarining reklama qilingan tengdoshlar bilan tengdoshlarning manzillariga ushbu tarmoq orqali boshqa validatorlardan murojaat qilish mumkin bo'lishi uchun moslashtiring:

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

Joriy tengdoshga berilgan manzildan foydalanish `network.address` va `network.public_address`. Har bir tengdosh o'zining ishonchli tengdoshlarining identifikatsiyalarini ro'yxatga olishi kerak, ammo ularning manzillari uning o'zidan olinadi VPN yo'nalish jadvali.

Mijoz va CLI konfiguratsiyalari Torii oxirgi nuqtasiga qaratilgan bo'lishi kerak, unga VPN yoki nazorat qilinadigan ichki darvoza orqali erishish mumkin:

```toml
torii_url = "http://10.20.0.11:8080"
```

Agar Torii VPN dan tashqarida mavjud bo'lishi kerak bo'lsa, uni TLS bilan ta'minlaydigan qaytarib o'tish vositachi yoki yukni muvozanatlash vositasi orqasidan qo'ying; autentifikatsiya, stavkalarni cheklash va ro'yxatdan o'tkazish. Umumiy internetga to'g'ridan-to'g'ri o'rtacha portlar yoki boshqaruv oxirgi nuqtalarini ochib bermaslik kerak.

## Firewall qoidalari {#firewall-rules}

VPN mavjud bo'lganda ham host va bulutdagi firewall qoidalaridan foydalaning:

|Xizmat |Tavsiya etilgan kirish |
| --- | --- |
|Tengdoshlik portlari |Boshqa tasdiqlovchi VPN manzili faqat |
|Torii |Ilovalar orqa fonlari, operatorlar yoki ishonchli mijozlarning VPN doirasi |
|Metriklar va sogʻliqni saqlash tekshiruvlari |Operatorlar tarmog ' ida monitoring tizimlari |
|SSH va boshqaruv |Bastion host, imtiyozli operator VPN doirasi yoki shishalarni buzish jarayoni |
|Backups va saqlashni takrorlash |Xususiy tarmoqdagi zaxira tizimlari |

Dastlabki rad etish qoidalari keng ruxsat berish qoidalariga qaraganda audit qilish osonroq. Yangi tengdosh tarmoqga qo'shilganda, VPN a'zoligini, yong'in devorining ruxsat berish ro'yxatini va Iroha ishonchli tengdosh konfiguratsiyasini bitta muvofiqlashtirilgan o'zgarish sifatida yangilab oling.

## Operativ tekshiruv ro'yxati {#operational-checklist}

- VPN implementatsiyasi, masalan, WireGuard, IPsec yoki tashkilot tomonidan tasdiqlangan boshqaruvchi xususiy tarmoqni tanlash.
- Har bir uy egasi va operator uchun VPN yagona ma'lumotlardan foydalaning. VPN kalitlarini validatorlar o'rtasida taqsimlamang.
- VPN ma'lumotnomalarini Iroha xususiy kalitlaridan va genesis imzolash materialidan ajratib turing.
- VPN kechikish vaqtini, paketlarni yo'qotishni, qayta ulanishlarni va yo'nalish o'zgarishlarini kuzating.
- MTU samaradorligini sinab ko'ring. Paketning parchalanishi intermitent tenglamchi yoki Torii xatolarga o'xshashi mumkin.
- VPN o'rtacha, Torii, metrikalar, SSH va ehtiyot oxirgi nuqtalarga yetib borishga ruxsat etilgan hujjat.
- Uy egasi, operator tili yoki tashkilot tarmoqni tark etganda VPN ma'lumotnomalarini aylantiring.
- Validatorlar o'rtasidagi yagona yo'l sifatida bitta VPN darvozadan qoching. Ishlab chiqarish tarmoqlari uchun ortiqcha darvozalarni yoki joydan joyga yo'nalishlarni rejalashtiring.
- VPN hodisalarga javob berish mashg'ulotlarida xatolarni o'z ichiga oling, shunda operatorlar tarmoq partitsiyasini Iroha jarayonida xatolik sodir bo'lganidan qachon ajratib olishlarini biladilar.

## Bogʻliq sahifalar {#related-pages}

- [Xavfsizlik prinsiplari](/uz/guide/security/security-principles.md)
- [Operatsiyaviy xavfsizlik](/uz/guide/security/operational-security.md)
- [Tarmoqni ishga tushirish uchun kalitlar ](/uz/guide/configure/keys-for-network-deployment.md)
- [Tengdoshlar boshqaruvi](/uz/guide/configure/peer-management.md)
- [Tengdoshlar konfiguratsiyasi ma'lumotnomasi ](/uz/reference/peer-config/index.md)
