---
translation_locale: mn
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Алдааг олох болон засах {#troubleshooting}

Энэ хэсэг нь та Iroha-тай ажиллаж байхдаа асуудалтай тулгарвал туслахад зориулагдсан болно. Юу нэгэн зүйл буруу болсон тохиолдолд эхлээд [түлхүүрүүдийг шалга](#check-the-keys) хийнэ үү. Хэрэв энэ тус болохгүй бол, шат шатны асуудлыг шийдвэрлэх зааврыг шалгана уу:

- [Суулгахтай холбоотой асуудлууд](./installation-issues.md)
- [Тохиргооны асуудлууд](./configuration-issues.md)
- [Түгээмэл асуудлууд](./deployment-issues.md)
- [Нэгтгэлийн асуудлууд](./integration-issues.md)

Хэрэв та тулгарч буй асуудал энд тодорхойлогдоогүй бол [Телеграм](https://t.me/hyperledgeriroha) хаягаар бидэнтэй холбогдоно уу.

## Түлхүүрүүдийг шалга {#check-the-keys}

Ихэнх асуудлууд таарахгүй түлхүүрүүдээс үүдэлтэй байдаг. Тийм учраас бид дараах дүрмийг дагахыг зөвлөж байна: Юу нэгл буруу болвол эхлээд түлхүүрүүдийг шалгаарай.

Энд хурц тодорхой тайлбар байна: Сүлжээний хамтрагчдын түлхүүрүүд таарахгүй тохиолдолд үүсдэг алдааны мэдэгдлүүдийг ялгах боломжгүй юм Найдвартай сүлжээний холбоотнуудын массив дахь түлхүүрийг тааруулна, учир нь энэ нь сүлжээний холбоотнуудын нийтийн түлхүүрийг ил гаргах болно. Тиймээс, хэрэв таныг Helm-ийн чартууд буюу Kubernetes-ийн түгээлтүүд орчинын хувьсагчуудаар тодорхойлсон түлхүүрүүдтэй бол тохируулсан зүйлсийг харьцуулна уу [`public_key`](/mn/reference/peer-config/params.md#param-public-key), [`private_key`](/mn/reference/peer-config/params.md#param-private-key), болон [`trusted_peers`](/mn/reference/peer-config/params.md#param-trusted-peers) өндөр түвшний алдааг судлахын өмнөх утгууд.

Хэрвээ эргэлзэж байвал, [шинэ түлхүүрийн хос үүсгэх](/mn/guide/security/generating-cryptographic-keys.md).
