---
translation_locale: mn
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Байгууллага, удирдлага {#configuration-and-management}

Iroha конфигурац нь хоёр бүрэн эрхт давхартай:

- **орон нутгийн хамтарч, үйлчлүүлэгчдийн конфигураци**, хадгалах TOML файл, унших
  үйл явцыг эхлүүлэх
- **зах зээлийн конфигурац**, үйл ажиллагааны явцад өөрчлөлт орсон
  [`SetParameter`](/mn/blockchain/instructions.md#setparameter)

Нөөцний тодорхойлолт, хаяг, бүртгэл, хадгаламж,
үйлчлүүлэгчийн гарын үсэг зурах түлхүүр.
Хүлжээний дагуу, тодорхойлолттайгаар дахин тоглож байна.

Үйлдвэрлэлийн зан үйл нь эдгээр конфигурацийн давхаргаас ирсэн байх ёстой. Байгаль орчин
Үндэсний хэрэгслийн туршилтын өгөгдлийг нийлүүлэхэд тохиромжтой өөрчлөх боломжтой, гэхдээ
Тэд үйлдвэрлэлийн онцлог цэгүүд биш бөгөөд үүрэг гүйцэтгэгчдийг залгамждаггүй
зохион байгуулалт.

Төв конфигурацийн эхлэх цэгүүд нь:

- [Эхлэл](/mn/guide/configure/genesis.md)
- [Хэрэглэгчийн конфигурац](/mn/guide/configure/client-configuration.md)
- [Сүлжээг ашиглах түлш](/mn/guide/configure/keys-for-network-deployment.md)
- [Хөдөө металл дээр гүйдэг](/mn/guide/advanced/running-iroha-on-bare-metal.md)
- [Эдгээрийн конфигурацын сүлжээ](/mn/reference/peer-config/index.md)
