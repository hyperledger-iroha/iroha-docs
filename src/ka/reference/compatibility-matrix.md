---
translation_locale: ka
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# თავსებადობის მატრიცა {#compatibility-matrix}

თავსებადობის მატრიცის მიხედვით,SDK სცენარების გაფართოება მიმდინარე წლისთვის Iroha 3 დოკუმენტების ნაკრები. გათვალისწინებით, გვერდი ატვირთავს შეკრული სნაპშოტი გენერირებული pined [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) რევიზია.

მატრიცის შემადგენლობა შედგება:

- მოთხრობები პირველ სვეტში
- SDKs დანარჩენ სვეტებში
- სტატუსის სიმბოლოები დაფარული, წარუმატებელი და დაკარგული მონაცემებისთვის

მხოლოდ განახლების სამუშაო ნაკადის მიერ შემოწმებული შედეგები იუწყება, როგორც დაფარული ან წარუმატებელი. სცენარები, რომლებიც არ ადასტურებს ჩაკეტილ რევიზიას, ნაჩვენებია როგორც დაკარგული მონაცემები, ვიდრე სხვა წყარო რევიზიიდან მიღებული შედეგების მემკვიდრეობა.

<CompatibilityMatrixTable />

::: ინფორმაცია
დააყენეთ `VITE_COMPAT_MATRIX_URL` მხოლოდ იმისთვის, რომ შეფუთული სნაპჩოტი კომპეტენციური ცოცხალი ბეიკ-ენდით დააბრუნოს. ამ ცვლადი გარეშე გვერდი იტვირთება `src/public/compat-matrix.json` .
:::
