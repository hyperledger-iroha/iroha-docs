---
translation_locale: ka
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კონფიგურაცია და მართვა {#configuration-and-management}

Iroha კონფიგურაციას აქვს ორი ავტორიტეტული ფენა:

- **ადგილობრივი პარტნიორი და კლიენტის კონფიგურაცია**, ინახება TOML ფაილები და წაიკითხეთ
  პროცესის დაწყება
- **ქსელზე კონფიგურაცია**, შეცვლილია ტრანზაქციებით
  [`SetParameter`](/ka/blockchain/instructions.md#setparameter)

გამოიყენეთ ადგილობრივი კონფიგურაცია კვანძის იდენტობის, მისამართების, ჩანაწერების, შენახვისა და
კლიენტის ხელმოწერის გასაღები. გამოიყენეთ ქსელის კონფიგურაცია მნიშვნელობებისთვის, რომლებიც უნდა შეთანხმდეს
ქსელის მიერ და გადაღებულია დეტერმინისტურად.

წარმოების ქცევა უნდა მოდიოდეს ამ კონფიგურაციის ფენებიდან. გარემო
ცვლადი შეიძლება იყოს მოსახერხებელი ადგილობრივი ინსტრუმენტებისთვის სატესტო შეყვანების მიწოდებისთვის, მაგრამ
ისინი არ წარმოადგენენ საწარმოო მახასიათებლების კარიბჭეს და არ შეცვლიან ვალდებულებებს
კონფიგურაცია.

კონფიგურაციის ძირითადი შესასვლელი წერტილებია:

- [იანესისი](/ka/guide/configure/genesis.md)
- [კლიენტის კონფიგურაცია](/ka/guide/configure/client-configuration.md)
- [ქსელის განთავსების გასაღები](/ka/guide/configure/keys-for-network-deployment.md)
- [შიშველი ლითონის ფონზე.](/ka/guide/advanced/running-iroha-on-bare-metal.md)
- [პარტნიორის კონფიგურაციის რეფერენცია](/ka/reference/peer-config/index.md)
