---
translation_locale: ka
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კოდის ნაჭრები {#code-snippets}

გენერირებული ნაწყვეტები ინახავს მაგალითებს კოდის, კონფიგურაციის და სქემებისგან
დასახელება Iroha რევიზია, რომელმაც ისინი შექმნა.

## განტვირთვა Iroha ხელოვნური ნივთები {#refreshing-iroha-artifacts}

Iroha-დამოყვანილი ნაწყვეტები შემოწმებულია ისე, რომ ჩვეულებრივი საიტის მშენებლობა არ საჭიროებს
ქსელზე წვდომა ან ძმური რეპოზიტორი. განახორციელეთ ისინი მკაფიოდ:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

დარეგისტრირებული
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
სამუშაო მიმდინარეობა ადასტურებს სუფთა წყაროს გადახდის შეფასებას `provenance/iroha.json`,
რეგენერაცია `/src/snippets` და Torii OpenAPI გადაღება და განახლებები SHA-256
hashes. შეხედეთ შინაარსის და წარმოშობის ცვლილებები ერთად. ნორმალური დამოკიდებულება
დამონტაჟება და VitePress builds მოხმარება ჩანახული ფაილები გარეშე
მუტირებადი ტოტის მოპოვება.

## შპს "სნიპეტები" {#including-snippets}

გამოიყენეთ
[VitePress კოდის ნაწილის სინტაქსი](https://vitepress.dev/guide/markdown#import-code-snippets)
გათვალისწინებული უნდა იყოს წარმოქმნილი ან ადგილობრივი წყარო:

```md
<<< @/snippets/client.template.toml
```

დასახელებული კოდის რეგიონი შეიძლება შეიტანოს მისი რეგიონის სახელწოდების დამატებით:

```md
<<< @/example_code/lorem.rs#ipsum
```

ხელით დაწერილი ნიმუშების რაოდენობა მცირედ შეინახეთ.
ინტერფეისები, კონფიგურაციის შაბლონები, გენერირებული სქემები და ბრძანების გამოსავალი.
