---
translation_locale: mn
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SDK Сургалтууд {#sdk-tutorials}

Эдгээр хуудас нь үндсэн ажлын талбараас илгээгдсэн Iroha 3 клиентийн нэвтрэх цэгүүдийг, үүнд нэг протоколын стандарт багцын нэрс, суулгах замууд, ба хамгийн бага эхлэх цэгүүдийг хураангуйлан үзүүлнэ.

## Зөвлөсөн захиалга {#recommended-order}

1. [Суурилуулна уу Iroha 3](/mn/get-started/install-iroha.md)
2. [Эхлүүлэх Iroha 3](/mn/get-started/launch-iroha.md)
3. Нэг SDK сонгоно уу:
   - [Rust](/mn/guide/tutorials/rust.md)
   - [Python](/mn/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/mn/guide/tutorials/javascript.md)
   - [Kotlin, Android, ба Java](/mn/guide/tutorials/kotlin-java.md)
   - [Swift ба iOS](/mn/guide/tutorials/swift.md)
4. Бүтэн клиент програмын лавлах хүсвэл [туршилтын аппликейшнүүд](/mn/guide/tutorials/sample-apps.md)-ыг нягтална уу.
5. Өөрийн апп-д түрийвчээр баталгаажсан аудио/видео уулзалтуудыг нэмэхийг хүсвэл [Оруулах Kaigi](/mn/guide/tutorials/kaigi.md)-г ашиглаарай.
6. Давтан ашиглах боломжтой Kotodama эх сурвалжын сангуудыг дотоод бүртгэлд тодорхойлогдсон хамааралттайгаар ашиглах хэрэгтэй бол [Musubi багц](/mn/guide/tutorials/musubi.md) хэрэглэх.

## Дээжүүд {#samples}

Дээд түвшний ажлын талбар нь JavaScript жор болон Swift/iOS жишээ төслүүдийг агуулсан. Android-ийн хувьд Kotlin SDK модулиуд болон тэдгээрийн туршилтаас эхэл.

- [Жишээ аппликейшнүүдийн тойм](/mn/guide/tutorials/sample-apps.md)
- [Эмбед Kaigi-ийг JavaScript апп-д оруулах](/mn/guide/tutorials/kaigi.md)

## Үнэнийн эх сурвалж {#source-of-truth}

Энд байгаа бүх SDK хуудас нь одоогийн дээд түвшний ажлын орчноос гаралтай:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Kotlin-р Android гадаргуугийн Java толь)
- `IrohaSwift`
- `crates/musubi`

Та эргэлзэж байвал тэндхүү директоруудын README болон пакетны метадатаг илүүд үзээрэй; тэд таны бүтээж буй эх эх хувилбарыг тайлбарладаг.
