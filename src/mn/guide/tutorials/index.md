---
translation_locale: mn
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Сургалтууд {#sdk-tutorials}

Эдгээр хуудсууд Iroha 3 үйлчлүүлэгчдийн гарын үсэгт орох цэгүүд
ажлын орон зай, тэр дундаа Canonical paketeйн нэрүүд, инсталляцийн замыг болон хамгийн бага
эхлэлийн цэг.

## Зөвлөмжтэй захирамж {#recommended-order}

1. [Нэвтрүүлэг Iroha 3](/mn/get-started/install-iroha.md)
2. [Нэвтрүүлэг Iroha 3](/mn/get-started/launch-iroha.md)
3. Нэгөө сонго SDK:
   - [Rust](/mn/guide/tutorials/rust.md)
   - [Python](/mn/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/mn/guide/tutorials/javascript.md)
   - [Kotlin, Android, болон Java](/mn/guide/tutorials/kotlin-java.md)
   - [Swift болон iOS](/mn/guide/tutorials/swift.md)
4. Үндсэн хуулийн [загварын хэрэгсэл](/mn/guide/tutorials/sample-apps.md) Хэрэв та
   үйлчлүүлэгчдэд зориулсан өргөдөлний бүрэн сүлжээ.
5. Хэрэглээ [Хөгжүүлсэн Kaigi](/mn/guide/tutorials/kaigi.md) нэмэх үед
   өөрийн аппликейшнээр гар утас / видео уулзалт хийх.
6. Хэрэглээ [Musubi багц](/mn/guide/tutorials/musubi.md) дахин ашиглах хэрэгцээ хэрэгтэй үед
   Kotodama эх сурвалжийн номын сүлжээний бүртгэлийн хамаарлыг байлгасан.

## Үргэлт {#samples}

Үүнээс дээш урсгалтай ажлын орон зай нь JavaScript зохиол, Swift/iOS үлгэрэл
төслүүдэд зориулагдсан. Android, " Kotlin SDK модуль болон тэдгээрийн туршилтууд.

- [Үргэлт хэрэгслийн үзлэг](/mn/guide/tutorials/sample-apps.md)
- [Хөгжүүлсэн Kaigi а JavaScript хэрэгсэл](/mn/guide/tutorials/kaigi.md)

## Үнэний эх үүсвэр {#source-of-truth}

Бүгд SDK энд буй хуудсууд одоогийн үр дэсний ажлын орон зайдээс үүдэлтэй:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java-ийн үзэсгэлэн Kotlin- Нэгдүгээрт Android гадаргуу)
- `IrohaSwift`
- `crates/musubi`

Хэрэв эргэлзэж байгаа бол README болон эдгээр захиалгад багцтай метабарууд;
Таны бүтээсэн эх үүсвэрийн шинэчлэлийг тодорхойлдог.
