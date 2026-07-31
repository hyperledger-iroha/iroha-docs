---
translation_locale: ka
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# შეთანხმების მატრიცა {#compatibility-matrix}

შეთავსების მატრიქსი აჩვენებს ჯვარედინ-SDK სცენარების გაფართოება მიმდინარე
Iroha 3 დოკუმენტების შედგენა. დეფოლუტურად, გვერდი ატვირთავს ბუნდლი სნაპჩოტი გენერირებული
და შეკრული, [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
რევიზია.

მატრიცა შედგება:

- **ისტორიები** პირველი კოლონაში
- **SDKs** დანარჩენი კოლონების ფარგლებში
- **სტატუსის სიმბოლოები** დაფარული, წარუმატებელი და დაკარგული მონაცემებისათვის

ანგარიშსწორება ხდება მხოლოდ განახლების სამუშაო პროცესით შემოწმებული შედეგების მიხედვით, ან
ვერ შედგა. სცენარები, რომლებიც არ ადასტურებს ჩაკეტილი რევიზიის შესახებ, ნაჩვენებია როგორც
დაკარგული მონაცემები, ვიდრე სხვა წყარო რევიზიიდან მიღებული შედეგების მემკვიდრეობა.

<CompatibilityMatrixTable />

::: info
კომპლექტი `VITE_COMPAT_MATRIX_URL` მხოლოდ იმისთვის, რომ შეკრული სურათის ჩაშლისთვის
თავსებადი ცოცხალი backend. ამ ცვლადის გარეშე, გვერდის დატვირთვა
`src/public/compat-matrix.json`.
:::
