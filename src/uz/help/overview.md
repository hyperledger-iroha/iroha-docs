---
translation_locale: uz
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Muammolarni hal qilish {#troubleshooting}

Ushbu bo ' lim siz bilan ishlashda muammolarga duch kelsangiz yordam berish uchun mo ' ljallangan.
Iroha. Agar biror narsa noto'g'ri bo'lsa, iltimos [kalitlarni tekshirish](#check-the-keys)
Agar bu yordam bermasa, muammolarni hal qilish ko'rsatmalarini tekshiring
har bir bosqichda:

- [Oʻrnatish muammolari](./installation-issues.md)
- [Konfiguratsiya masalalari](./configuration-issues.md)
- [Ishlab chiqarish masalalari](./deployment-issues.md)
- [Integratsiya masalalari](./integration-issues.md)

Agar siz boshdan kechirayotgan muammo bu erda tasvirlanmagan bo'lsa, biz bilan bog'laning
[Telegram](https://t.me/hyperledgeriroha).

## Ochiqlarni tekshiring {#check-the-keys}

Aksariyat muammolar tengsiz kalitlar natijasida yuzaga keladi.
ushbu qoidaga rioya qilish: **Agar biror narsa noto'g'ri bo'lsa, kalitlarni tekshiring
birinchi**.

Bu yerda tez bir tushuntirish: xatoni farqlash mumkin emas
tengdoshlarning kalitlari arraydagi kalitlar bilan mos kelmasa paydo boʻladigan xabarlar
ishonchli tengdoshlar, chunki bu tengdoshlarning ommaviy kalitini oshkor qiladi.
atrof muhit orqali aniqlangan kalitlar bilan Helm diagrammalari yoki Kubernetes joylashtirishlari mavjud
o'zgaruvchilarni, konfiguratsiya qilingan
[`public_key`](/uz/reference/peer-config/params.md#param-public-key),
[`private_key`](/uz/reference/peer-config/params.md#param-private-key), va
[`trusted_peers`](/uz/reference/peer-config/params.md#param-trusted-peers)
yuqori darajadagi xatolarni tekshirishdan oldin qiymatlar.

Agar shubha bo'lsa, [yangi kalitlar juftligini yaratish](/uz/guide/security/generating-cryptographic-keys.md).
