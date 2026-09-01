---
translation_locale: ka
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK მასწავლებლები {#sdk-tutorials}

ეს გვერდები შეაჯამებს Iroha 3 კლიენტის შესასვლელ პუნქტებს, რომლებიც გზავნილია ძირითადი სამუშაო სივრცედან, მათ შორის კანონიკური პაკეტის სახელები, ინსტალაციის გზები და მინიმალური საწყისი წერტილები.

## რეკომენდებული ბრძანება {#recommended-order}

1. [დამონტაჟება Iroha 3](/ka/get-started/install-iroha.md)
2. [გაშვება Iroha 3](/ka/get-started/launch-iroha.md)
3. აირჩიეთ SDK:
   - [Rust](/ka/guide/tutorials/rust.md)
   - [Python](/ka/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ka/guide/tutorials/javascript.md)
   - [Kotlin, Android და Java](/ka/guide/tutorials/kotlin-java.md)
   - [Swift და iOS](/ka/guide/tutorials/swift.md)
4. შეამოწმეთ [აპლიკაციების მაგალითი](/ka/guide/tutorials/sample-apps.md), როდესაც გსურთ სრულყოფილი კლიენტის განაცხადის რეფერენცია.
5. გამოიყენეთ [ჩასმული Kaigi](/ka/guide/tutorials/kaigi.md) როდესაც გსურთ დაამატოთ საფულის მხარდაჭერილი აუდიო/ვიდეო შეხვედრები თქვენს აპლიკაციაში.
6. გამოიყენეთ [Musubi შეფუთვები](/ka/guide/tutorials/musubi.md), როდესაც თქვენ გჭირდებათ განმეორებითი გამოყენების საწყისი ბიბლიოთეკები Kotodama ჩაკეტილი ქსელზე რეესტრის დამოკიდებულებით.

## ნიმუშები {#samples}

აღმავალი სამუშაო სივრცე შეიცავს JavaScript რეცეპტებს და Swift/iOS ნიმუშების პროექტებს. Android-ისთვის, დაიწყეთ Kotlin SDK მოდულებით და მათი გამოცდები.

- [აპლიკაციების მაგალითის მიმოხილვა](/ka/guide/tutorials/sample-apps.md)
- [ჩასმა Kaigi აპლიკაციაში JavaScript](/ka/guide/tutorials/kaigi.md)

## ჭეშმარიტების წყარო {#source-of-truth}

ყველა SDK გვერდი აქ არის მიღებული მიმდინარე ძირითადი სამუშაო სივრცედან:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (გავა სარკე Kotlin-ს ზედაპირის პირველი Android)
- `IrohaSwift`
- `crates/musubi`

ეჭვის დროს, უპირატესობა README და პაკეტის მეტამონაცემები ამ დირექტორებში; ისინი აღწერენ წყარო რევიზიის თქვენ აშენებთ.
