---
translation_locale: mn
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ашигтвортой байдлын асуудал {#troubleshooting}

Энэ хэсэг нь татай ажиллахдаа асуудал үүссэн тохиолдолд туслах зорилготой. Iroha. Хэрвээ ямар нэгэн асуудал гарч ирвэл... [нэгийг шалгаарай](#check-the-keys) Нэгдүгээрт, энэ нь туслахгүй бол бүх ээлжинд алдааг шийдвэрлэх журамт шалгаарай:

- [Нэвтрүүлгийн асуудал](./installation-issues.md)
- [Байгууллагын асуудал](./configuration-issues.md)
- [Хөдөлмөрийн хэрэгслийн асуудал](./deployment-issues.md)
- [Интеграцийн асуудал](./integration-issues.md)

Хэрэв танд тохиолдож буй асуудал энд тодорхойлдоггүй бол [Telegram ](https://t.me/hyperledgeriroha)-ээр бидэнтэй холбоо бариарай.

## Үндсэн цөмүүдийг шал {#check-the-keys}

Ихэнх асуудал нь өрсөлдөхгүй түлхүүний улмаас үүсдэг. Тийм учраас бид дараагийн дүрмийг баримтлахыг зөвлөж байна: Хэрэв ямар нэгэн алдаа гарсан бол хамгийн түрүүнд түлхүүүүдийг шалгаарай.

Энэ нь хурдан тайлбарлахад: Танай өрсөлдөгчдийн түлхүүр нь итгэмжлэгдсэн өрсөлдөгчдийн жагсаалтын түлхүүдтэй нийцэхгүй байх үед үүсэх алдааны мэдээллийг ялгаатай болгох боломжгүй, учир нь энэ нь өрсөлдөгчийн олон нийтийн түлхлийг илрүүлэх болно. Иймд, та орчны өөрчлөлтүүдийг дамжуулан тодорхойлсон товчтой Helm диаграмын эсвэл Kubernetes-ийн хэрэглээтэй бол өндөр түвшний алдааг шалгахын өмнө тохируулсан [`public_key`](/mn/reference/peer-config/params.md#param-public-key),[`private_key`](/mn/reference/peer-config/params.md#param-private-key) болон [`trusted_peers`](/mn/reference/peer-config/params.md#param-trusted-peers) хэмжээнүүдийг харьцуулж үзээрэй.

Хэрэв эргэлзээ байгаа бол [ шинэ дуудлагаг бий болгох ](/mn/guide/security/generating-cryptographic-keys.md).
