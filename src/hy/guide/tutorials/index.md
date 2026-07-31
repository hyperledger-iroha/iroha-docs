---
translation_locale: hy
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Դասընթացներ {#sdk-tutorials}

Այս էջերը ամփոփում են հիմնական աշխատանքային տարածքից ուղարկված Iroha 3 հաճախորդի մուտքի կետերը, ներառյալ կանոնիկ փաթեթների անունները, տեղադրման ուղիները եւ նվազագույն սկիզբը:

## Առաջարկված կարգը {#recommended-order}

1. [տեղադրում Iroha 3](/hy/get-started/install-iroha.md)
2. [Ծրագիր Iroha 3](/hy/get-started/launch-iroha.md)
3. Ընտրեք SDK:
   - [Rust](/hy/guide/tutorials/rust.md)
   - [Python](/hy/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/hy/guide/tutorials/javascript.md)
   - [Kotlin, Android եւ Java](/hy/guide/tutorials/kotlin-java.md)
   - [Swift եւ iOS](/hy/guide/tutorials/swift.md)
4. Վերանայեք [ օրինակային հավելվածները](/hy/guide/tutorials/sample-apps.md), երբ ցանկանում եք ամբողջական հաճախորդի հավելվածի հղում:
5. Օգտագործեք [Embed Kaigi](/hy/guide/tutorials/kaigi.md), երբ ցանկանում եք ավելացնել դրամապանակի աջակցությամբ աուդիո / տեսահոլովակ հանդիպումներ ձեր սեփական հավելվածում:
6. Օգտագործեք [Musubi փաթեթները](/hy/guide/tutorials/musubi.md), երբ ձեզ անհրաժեշտ է կրկնակի օգտագործվող Kotodama աղբյուրային գրադարաններ ՝ կապված շղթայի վրա գրանցման կախվածություններով:

## Նմուշներ {#samples}

Upstream աշխատանքային տարածքը պարունակում է JavaScript բաղադրատոմսեր եւ Swift/iOS նմուշ նախագծեր: Android համար սկսեք Kotlin SDK մոդուլների եւ դրանց փորձարկումների հետ:

- [Օրինակային հավելվածների շրջանառություն](/hy/guide/tutorials/sample-apps.md)
- [Kaigi ներմուծել JavaScript հավելվածի մեջ ](/hy/guide/tutorials/kaigi.md)

## Ճշմարտության աղբյուր {#source-of-truth}

Բոլոր SDK էջերը բխում են ներկայիս վերածննդային աշխատանքային տարածքից.

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java հայելու Kotlin-ի առաջին մակերեսը Android)
- `IrohaSwift`
- `crates/musubi`

Երբ կասկածում եք, նախընտրեք README եւ փաթեթային մետադատները այդ அடைերում. դրանք նկարագրում են աղբյուրի վերանայման, որը դուք կառուցում եք:
