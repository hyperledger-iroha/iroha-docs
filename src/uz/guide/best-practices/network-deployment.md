---
translation_locale: uz
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 7839268b8c1f6700b0c26652e3308fa4e8acef4717d8527c609b6f30fb8c84ab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tarmoq joylashtirish {#network-deployment}

Iroha tarmog‘ini muvofiqlashtirilgan tizim sifatida qabul qiling. Validatorlar tarmoq boshlanishi va bloklarni yakuniylashtirishni davom ettirishdan oldin blokcheyn genesisini, topologiyasini, ishonchli tarmoq hamkasblarini va konsensusga oid konfiguratsiyani ma’qullashlari kerak.

## Muhitni ajratish {#environment-separation}

- Mahalliy rivojlantirish, umumiy testnet, staging va ishlab chiqarish uchun alohida konfiguratsiya to‘plamlarini saqlang.
- Har bir ishlatilmaydigan bo‘lmagan muhit uchun yangi kalitlar yaratish. Ishlab chiqarishda localnet yoki Taira kalit materialini qayta ishlatmang.
- Tugun konfiguratsiyasi, mijoz konfiguratsiyasi, imzolangan boshlang‘ich holat, skriptlar va joylashtirish qaydlarini bitta versiyalangan reliz artefakti sifatida saqlang.
- Maxfiy kalitlarni repozitoriyalar va joylashtirish shablonlaridan tashqarida saqlang.

Buni [Tarmoqni joylashtirish uchun kalitlar](/uz/guide/configure/keys-for-network-deployment.md) ko‘ring.

## blokcheyn januzi va Topologiya {#genesis-and-topology}

- Profil talab qilsa, har bir tasdiqlovchi ayni imzolangan boshlang‘ich tranzaksiya, ishonchli tugunlar to‘plami, topologiya va tasdiqlovchi egalik dalillaridan foydalansin.
- Kamida to‘rt validatorni kamida Bizans nuqsoniga chidamli joylashtirish uchun ishlating.
- Qobiliyat rejalashtirishda validatorlarni kuzatuvchilardan ajrating. Kuzatuvchilar ovoz bermaydi, taklif kiritsa yoki yig‘maydi, lekin ular hali ham xotirani, blok sinxronizatsiyasini va tarmoq kengligini iste’mol qiladi.
- Blokcheyn boshlanishi, ijrochisi va topologiya o‘zgarishlarini yagona ishtirokchi tahrirlari sifatida emas, balki muvofiqlashtirilgan migratsiyalar sifatida ko‘ring.

Qarang [blokcheyn genesis](/uz/reference/genesis.md), [tarmoq tengdosh boshqaruvi](/uz/guide/configure/peer-management.md), va [Ijro etish va o‘lchovlar](/uz/guide/advanced/metrics.md#node-count-and-quorum).

## Torii va Tarmoqga Kirish {#torii-and-network-access}

- Torii ni mezbon yoki shaxsiy tarmoqdan tashqarida ochiq bo‘lganda teskari proksi yoki devor ortida joylashtiring.
- TLS ni tugating va joylashuv talab qilganda edge da asosiy autentifikatsiya, tezlik cheklovlari va so‘rov o‘lchami nazoratlarini qo‘llang.
- Atrof-muhit tomonidan talab qilinadigan faqat API endpointlarni nashr eting. Operator va telemetriya yo‘llari jamoat faqat o‘qish uchun mo‘ljallangan yo‘llardan ko‘ra cheklangan bo‘lishi kerak.
- Tarmoq tengdoshlarining masofaviy trafikni to'g'ridan-to'g'ri qabul qilmasligi kerak bo'lganda, tinglovchi manzillarni host-lokal interfeyslarga bog'lang.

Buni [Torii API oxir nuqtalar](/uz/reference/torii-endpoints.md) va [Virtual Shaxsiy Tarmoqlar](/uz/guide/security/vpn.md) ko‘ring.

## Konsensus va salohiyat {#consensus-and-capacity}

- Konsensus taymerlarini sozlashdan oldin joylashtirishni o‘lchang. Vaqtni qisqartirish faqat tarmoq, saqlash va bajarish qatlamlari yetib boradigan bo‘lsa, kechikishni kamaytirishi mumkin.
- Faqat o'tkazuvchanlikning qisqa namunalari bilan cheklanmay, navbat yo'nalishini kuzating. Barqaror yuk ostida navbat o'sishi tarmoqning ortiqcha yuklanganini bildiradi.
- Har bir benchmark uchun samarali Sumeragi parametrlarni, telemetriya profilini, validatorlar sonini, tarmoq RTT, ish yukining shaklini va apparat tafsilotlarini yozib oling.
- Bir vaqtning o‘zida bitta chegaralangan navbat yoki payloadni tiklash limitini o‘zgartiring va oldingi va keyingi kechikish, trafik, xotira va orqa bosim dalillarini saqlang.

Buni [Ijro va Mezonlar](/uz/guide/advanced/metrics.md) ko‘ring.

## Bare-Metal va Jarayon Boshqaruvi {#bare-metal-and-process-management}

- Har bir tarmoq hamkasbining `config.toml`, shaxsiy kaliti, saqlash katalogi va portlarini alohida saqlang.
- Aniq qayta ishga tushirish, jurnal yozish va resurs siyosatlari bilan systemd kabi jarayon menejerlaridan foydalaning.
- Sinov topologiyasini boshqariladigan hostlarga tarjima qilganingizda, yaratilgan README va Kagami localnet paketlaridagi start buyruqlarini saqlang.

Buni [Bare Metal-da Iroha ni ishga tushirish](/uz/guide/advanced/running-iroha-on-bare-metal.md) ko‘ring.
