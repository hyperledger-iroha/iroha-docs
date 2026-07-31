---
translation_locale: mn
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Сургалтууд {#sdk-tutorials}

Эдгээр хуудсууд Iroha 3 үйлчлүүлэгчдийн ажлын хэсгээс шилжүүлсэн нэвтрэх цэгүүдийг товчлуулж байна, тэр дундаа санхүүгийн багцын нэрүүд, суурилтын замыг болон хамгийн бага эхлэлийн цэгүүд.

## Зөвлөмжтэй захирамж {#recommended-order}

1. [Нөөц Iroha 3](/mn/get-started/install-iroha.md)
2. [Iroha 3](/mn/get-started/launch-iroha.md)
3. SDK гэж сонгох:
   - [Rust](/mn/guide/tutorials/rust.md)
   - [Python](/mn/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/mn/guide/tutorials/javascript.md)
   - [Kotlin, Android, Java](/mn/guide/tutorials/kotlin-java.md)
   - [Swift болон iOS](/mn/guide/tutorials/swift.md)
4. Хэрэглэгчийн хэрэгслийн бүрэн сүлжээг хүсвэл [ үлгэрийн аппликейшнүүд](/mn/guide/tutorials/sample-apps.md)-ийг шалгаарай.
5. [Эмбейд Kaigi](/mn/guide/tutorials/kaigi.md)-ийг ашиглан өөрийн аппликейшн дээр хөрөнгийн дэмжлэгтэй аудио/видео уулзалт нэмэх болно.
6. [Musubi багц](/mn/guide/tutorials/musubi.md)-г ашиглах боломжтой Kotodama эх сурвалжийн номын санд зангилааны бүртгэлийн хамааралтай байх шаардлагатай үед хэрэглэж болно.

## Үргэлт {#samples}

Өмнөговь ажлын орон нутагт JavaScript рецепт, Swift/iOS үлгэрийн төсөл байдаг. Android-ийн хувьд Kotlin SDK модул болон тэдгээрийн туршилтыг эхлүүлээрэй.

- [Судалгааны загварын үзлэг](/mn/guide/tutorials/sample-apps.md)
- [Kaigi-ийг JavaScript -ийн хэрэгслийн ](/mn/guide/tutorials/kaigi.md) дотор багтаасан

## Үнэний эх үүсвэр {#source-of-truth}

Бүх SDK хуудсууд одоогийн эргэлтийн ажлын хэсгээс гаралтай:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java дэлгэц нь Kotlin-ний анхны Android гадаргуу)
- `IrohaSwift`
- `crates/musubi`

Хэрэв эргэлзэж байгаа бол README болон багцын метадэтгэлийг эдгээр захиалгуудад аваарай; тэдгээр нь та барьж буй эх үүсвэрийн шинэчлэлийг тодорхойлдог.
