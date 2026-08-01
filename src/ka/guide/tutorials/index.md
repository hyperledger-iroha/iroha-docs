---
translation_locale: ka
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK მასწავლებლები {#sdk-tutorials}

ეს გვერდები შეაჯამებს Iroha 3 კლიენტის შესასვლელ წერტილებს, რომლებიც გზავნილია ძირითადი სამუშაო სივრცედან, მათ შორის კანონიკური პაკეტების სახელები, ინსტალაციის გზები და მინიმალური საწყისი წერტილები.

## რეკომენდებული ბრძანება {#recommended-order}

1. [დამონტაჟება Iroha 3](/ka/get-started/install-iroha.md)
2. [გაშვება Iroha 3](/ka/get-started/launch-iroha.md)
3. აირჩიეთ SDK:
   - [Rust](/ka/guide/tutorials/rust.md)
   - [Python](/ka/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ka/guide/tutorials/javascript.md)
   - [Kotlin, Android და Java](/ka/guide/tutorials/kotlin-java.md)
   - [Swift და iOS](/ka/guide/tutorials/swift.md)
4. შეამოწმეთ [ ნიმუში აპლიკაციები](/ka/guide/tutorials/sample-apps.md) როდესაც გსურთ სრულყოფილი კლიენტის აპლიკაციის მითითება.
5. გამოიყენეთ [Embed Kaigi](/ka/guide/tutorials/kaigi.md), როდესაც გსურთ დაამატოთ საფულის მხარდაჭერილი აუდიო/ვიდეო შეხვედრები თქვენს აპლიკაციაში.
6. გამოიყენეთ [Musubi პაკეტები](/ka/guide/tutorials/musubi.md), როდესაც თქვენ გჭირდებათ განმეორებით გამოყენებადი Kotodama წყარო ბიბლიოთეკები ჩართული ჯაჭვის რეესტრის დამოკიდებულებით.

## ნიმუშები {#samples}

აღმავალი სამუშაო სივრცე შეიცავს JavaScript რეცეპტებს და Swift/iOS ნიმუშების პროექტებს. Android-ისთვის, დაიწყეთ Kotlin SDK მოდულებით და მათი გამოცდები.

- [აპლიკაციების მაგალითის მიმოხილვა](/ka/guide/tutorials/sample-apps.md)
- [შეყვანილი Kaigi აპლიკაციაში JavaScript ](/ka/guide/tutorials/kaigi.md)

## ჭეშმარიტების წყარო {#source-of-truth}

ყველა SDK გვერდი აქ არის მიღებული მიმდინარე upstream სამუშაო სივრცედან:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (გავა სარკე Kotlin-ს ზედაპირის პირველი Android)
- `IrohaSwift`
- `crates/musubi`

ეჭვის დროს, უპირატესობა README და პაკეტის მეტა მონაცემები ამ დირექტორებში; ისინი აღწერენ წყარო რევიზიის თქვენ აშენებთ.
