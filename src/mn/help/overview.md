---
translation_locale: mn
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хөгжлийн асуудлыг шийдвэрлэх {#troubleshooting}

Энэ хэсэг нь татай ажиллахдаа асуудал тулгарахад туслах зорилготой.
Iroha. Хэрэв ямар нэгэн асуудал гарч ирвэл... [нэгийг шалгаарай](#check-the-keys)
Хэрэв энэ нь туслахгүй бол, алдааны шийдлийн заалыг шалгаарай
үе шат бүр:

- [Нэвтрүүлгийн асуудал](./installation-issues.md)
- [Байгууллагын асуудал](./configuration-issues.md)
- [Хөдөлмөрийн асуудал](./deployment-issues.md)
- [Интеграцийн асуудал](./integration-issues.md)

Хэрэв та дурдаж буй асуудал энд тодорхойлдоггүй бол бидэнтэй холбоо бариарай
[Телеграм](https://t.me/hyperledgeriroha).

## Хүйчүүдийг шалгаарай {#check-the-keys}

Ихэнх асуудлууд нь өрсөлдөхгүй түлхүүрний үр дүнд үүсдэг.
Энэ дүрмийг дагаж мөрдөх: **Хэрэв ямар нэгэн асуудал гарч ирвэл, цөмөө шалгаарай.
нэгдүгээр**.

Энэ нь хурдан тайлбар: алдааг өөрчлөх боломжгүй
дуудлага нь өрсөлдөгчдийн түлхүүр нь массийн түлхүүдэд нийцэхгүй байх үед үүсдэг
Энэ нь хамтын ажиллагааны ачкыйг илрүүлнэ.
Хелмийн зураг эсвэл Байгаль орчинд тодорхойлсон товчтой Kubernetes-ийн хэрэглээ
өөрчлөлийг харьцуулаарай
[`public_key`](/mn/reference/peer-config/params.md#param-public-key),
[`private_key`](/mn/reference/peer-config/params.md#param-private-key), болон
[`trusted_peers`](/mn/reference/peer-config/params.md#param-trusted-peers)
дээд түвшний алдааг шалгахын өмнө үнэ цэнэтэй.

Хэрвээ эргэлзэж байгаа бол [шинэ цөмөө бий болгох](/mn/guide/security/generating-cryptographic-keys.md).
