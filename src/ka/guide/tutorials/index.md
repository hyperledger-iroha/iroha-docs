---
translation_locale: ka
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK მასწავლებლები {#sdk-tutorials}

ამ გვერდებზე მოცემულია Iroha 3 კლიენტების შესასვლელი პუნქტები, რომლებიც გზავნილია ძირითადი
სამუშაო სივრცე, მათ შორის კანონიკური პაკეტის სახელები, ინსტალაციის გზები და მინიმალური
საწყისი წერტილები.

## რეკომენდებული ბრძანება {#recommended-order}

1. [დამონტაჟება Iroha 3](/ka/get-started/install-iroha.md)
2. [გაშვება Iroha 3](/ka/get-started/launch-iroha.md)
3. აირჩიეთ ერთი SDK:
   - [Rust](/ka/guide/tutorials/rust.md)
   - [Python](/ka/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ka/guide/tutorials/javascript.md)
   - [Kotlin, Android, და Java](/ka/guide/tutorials/kotlin-java.md)
   - [Swift და iOS](/ka/guide/tutorials/swift.md)
4. განხილვა [აპლიკაციების ნიმუში](/ka/guide/tutorials/sample-apps.md) როდესაც გინდათ
   კლიენტის განცხადების სრული რეფერენცია.
5. გამოყენება [ჩასმული Kaigi](/ka/guide/tutorials/kaigi.md) როდესაც გსურთ დაამატოთ
   საფულის მხარდაჭერილი აუდიო/ვიდეო შეხვედრები თქვენს საკუთარ აპლიკაციაში.
6. გამოყენება [Musubi პაკეტები](/ka/guide/tutorials/musubi.md) როდესაც საჭიროა განმეორებითი გამოყენების საშუალებები
   Kotodama წყარო ბიბლიოთეკები ჩაკეტილი ქსელზე რეესტრის დამოკიდებულებით.

## ნიმუშები {#samples}

სამუშაო სივრცეში შედის: JavaScript რეცეპტები და Swift/iOS ნიმუში
პროექტებისთვის. Android, დაიწყეთ Kotlin SDK მოდულები და მათი გამოცდები.

- [აპლიკაციების მაგალითის მიმოხილვა](/ka/guide/tutorials/sample-apps.md)
- [ჩასმული Kaigi ა JavaScript აპლიკაცია](/ka/guide/tutorials/kaigi.md)

## ჭეშმარიტების წყარო {#source-of-truth}

ყველა SDK აქ მოცემული გვერდები არის მიღებული მიმდინარე ზემოთმავალი სამუშაო სივრცედან:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java სარკე Kotlin- პირველი. Android ზედაპირი)
- `IrohaSwift`
- `crates/musubi`

როცა ეჭვი გაქვს, README და ამ დირექტორებში მოთავსებული პაკეტის მეტა მონაცემები;
ისინი აღწერენ წყარო რევიზიონს, რომელსაც შენ აშენებ.
