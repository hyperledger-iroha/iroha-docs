---
translation_locale: uz
translation_source: /guide/security/vpn.md
translation_source_hash: 020591f0d7c5560dfb2e9f3f4537f429cbeba864c3eb022856d42addcf32e225
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Virtual Shaxsiy Tarmoqlar {#virtual-private-networks}

<abbr title="Virtual Private Network">VPN</abbr> — bu tarmoq nazorati bo‘lib, kim Iroha xizmatlariga kira olishini cheklaydi. Bu xususiy va konsortsium joylashtirishlarida eng foydali bo‘lib, ular validatorlar, ilova backendlari va operatorlar ochiq internet yo‘llari o‘rniga xususiy manzillar orqali muloqot qilishlari kerak bo‘lgan holatlarda ishlatiladi.

A VPN Iroha tarmoq hamkasbi kalitlarini, hisob kirish kalitlarini, ruxsatlarni, firewall qoidalarini, monitoringni yoki xavfsiz kalit saqlashni almashtirmaydi. Uni bir qatlam sifatida qabul qiling joylashtirish chegarasi: VPN tarmoq yetib borishini toraytiradi, Iroha konfiguratsiyasi va boshqaruvi qaysi tarmoq tengdoshlari va hisoblar ishonchli ekanligini belgilaydi.

## VPN ni qachon ishlatish kerak {#when-to-use-a-vpn}

Quyidagi hollarda VPN dan foydalaning:

- validatorlar turli tashkilotlar tomonidan yoki turli hosting muhitlarida ishlaydi
- Torii faqatgina ilova orqa tugmalari, operatorlar yoki ishonchli mijozlar tomonidan kirish mumkin bo‘lishi kerak
- metrikalar, jurnallar, SSH yoki boshqa ma'muriy API tugunlar maxfiy operator tarmog‘ida qolishi kerak
- sinov yoki sahnalashtirish tarmog‘i ishlab chiqarish kirish nazoratiga o‘xshash bo‘lishi kerak, lekin jamoatchilik API tugunlarini oshkor qilmasligi lozim

Har bir joylashtirishga VPN kerak emas. Ochiq tarmoqlar Torii’ni ochiq darvoza, yuk muvozanatlagich yoki teskari proksi orqali ataylab taqdim etishi mumkin. Shunda ham tasdiqlovchilarning tugunlararo trafigi va boshqaruv yakuniy nuqtalarini imkon qadar cheklangan tarmoqda saqlang.

::: tip

Faqat bitta brauzer VPN shu brauzerning trafigini himoya qiladi. U `iroha3d`, CLI, SDK, SSH, metrikalarni yoki zaxira trafﬁkini himoya qilmaydi, agar bu jarayonlar xususiy tarmoq orqali yo'naltirilmasa.

:::

## Joylashtirish naqshi {#deployment-pattern}

Xususiy validatorlar tarmog‘ida har bir validatorga barqaror VPN manzili yoki xususiy DNS nomi bering. Tugunlarni shunday sozlangki, ular e’lon qilgan tugunlararo manzillarga shu tarmoqdagi boshqa validatorlar kira olsin:

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

Hozirgi tarmoq tengdoshiga `network.address` va `network.public_address` da belgilangan manzildan foydalaning. Har bir tarmoq tengdoshi bir xil ishonchli tarmoq tengdoshlari identifikatorlarini ro'yxatga olishi kerak, ammo o'zining VPN marshrut jadvalidan yetib boriladigan manzillar bilan.

Mijoz va CLI konfiguratsiyalari VPN orqali yoki nazorat qilinadigan ichki gateway orqali yetib boriladigan Torii API endpointiga yo'naltirilishi kerak:

```toml
torii_url = "http://10.20.0.11:8080"
```

Torii VPN tashqarisida ishlashi kerak bo‘lsa, uni TLS, autentifikatsiya, tezlik cheklash va jurnallashni ta’minlaydigan teskari proksi yoki yuk muvozanatlagich ortiga qo‘ying. Xom tugunlararo portlar yoki ma’muriy yakuniy nuqtalarni bevosita ochiq internetga chiqarmang.

## Firewall Qoidalari {#firewall-rules}

Xost va bulutli firewall qoidalaridan VPN mavjud bo‘lsa ham foydalaning:

|Xizmat|Tavsiya etilgan kirish|
| --- | --- |
| Tugunlararo port | Faqat boshqa tasdiqlovchilarning VPN manzillari |
| Torii |Ilova backendlari, operatorlar yoki ishonchli mijoz VPN diapazonlari|
|Metrixlar va salomatlik tekshiruvlari|Operator tarmog‘idagi monitoring tizimlari|
|SSH va ma'muriyat|Bastion host, imtiyozli operator VPN diapazoni, yoki break-glass jarayoni|
|Zaxira nusxalari va saqlash takrorlanishi|Shaxsiy tarmoqdagi zahira tizimlari|

Default-deny qoidalari keng ruxsat berish qoidalariga qaraganda audit qilish osonroq. Yangi tarmoq ishtirokchisi tarmoqqa qo'shilganda, VPN a'zolik, firewall ruxsatlar ro'yxati va Iroha ishonchli tarmoq ishtirokchisi konfiguratsiyasini birlashtirilgan o'zgarish sifatida yangilang.

## Operatsion tekshiruv ro‘yxati {#operational-checklist}

- Auditi qilingan va faol ravishda yangilanayotgan VPN implementatsiyasini tanlang, masalan, WireGuard, IPsec yoki tashkilot tomonidan tasdiqlangan boshqariladigan xususiy tarmoq.
- Har bir mezbon va operator uchun noyob VPN credentiallarini ishlating. VPN kalitlarni validatorlar o‘rtasida bo‘lishmang.
- VPN ma'lumotlarini Iroha shaxsiy kalitlari va blokcheyn genesis imzolash materialidan alohida saqlang.
- Monitor VPN kechikish, paket yo‘qotish, qayta ulanish va yo‘l o‘zgarishlarini. Konsensus barqaror bo‘lmagan tarmoq holatlariga sezgir.
- Samarali MTU ni sinab ko'ring. Paketlarning parchalanishi tarmoqdagi uzluksiz hamkasb yoki Torii xatoliklari kabi ko'rinishi mumkin.
- Qaysi VPN diapazonlari tugunlararo portlar, Torii, metrikalar, SSH va zaxira yakuniy nuqtalariga kira olishini hujjatlashtiring.
- Tarmoqni tark etganda mezbon, operator hisob qaydnomasi yoki tashkilot uchun VPN credentiallarini aylantiring.
- Foydalanuvchilar orasida yagona VPN darvozani yagona yo‘l sifatida ishlatishdan saqlaning. Ishlab chiqarish tarmoqlari uchun ortiqcha darvozalar yoki saytlararo yo‘llarni rejalashtiring.
- VPN muvaffaqiyatsizliklarni hodisaga javob mashqlariga qo‘shing, shunda operatorlar tarmoq bo‘linishini Iroha jarayon muvaffaqiyatsizligidan qachon ajratishni bilishadi.

## Tegishli sahifalar {#related-pages}

- [Xavfsizlik printsiplari](/uz/guide/security/security-principles.md)
- [Operatsion Xavfsizlik](/uz/guide/security/operational-security.md)
- [Tarmoqni joylashtirish uchun kalitlar](/uz/guide/configure/keys-for-network-deployment.md)
- [tarmoq tengdoshlarini boshqarish](/uz/guide/configure/peer-management.md)
- [tarmoq tengdosh konfiguratsiyasi ma'lumotnomasi](/uz/reference/peer-config/index.md)
