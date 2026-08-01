---
translation_locale: ka
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კოდის ნაჭრები {#code-snippets}

გენერირებული ნაწყვეტები ინახავს მაგალითებს, რომლებიც უკავშირდება კოდს, კონფიგურაციას და სქემებს Iroha რევიზიონიდან, რომელმაც ისინი შექმნა.

## სუფთა Iroha ხელნაკეთი ნივთები {#refreshing-iroha-artifacts}

Iroha-დან გამომდინარე ნაწყვეტები შემოწმებულია ისე, რომ ჩვეულებრივი საიტის მშენებლობები არ საჭიროებს ქსელზე წვდომას ან ძმური რეპოზიტორიის. განახორციელეთ ისინი მკაფიოდ:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

შემოწმებული [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) სამუშაო ნაკადი ადასტურებს სუფთა წყაროდან გადახდის შეფასებას `provenance/iroha.json`-თან, რეგენერირებს `/src/snippets` და Torii OpenAPI სურათს. და განახლებები SHA-256 ჰეშები. შეამოწმეთ შინაარსი და წარმოშობის ცვლილებები ერთად. ჩვეულებრივი დამოკიდებულების ინსტალაცია და VitePress ბილდები მოიხმარენ შემოწმებულ ფაილებს გარდამტეხი ფილიალის მოპოვების გარეშე.

## ჩათვლით სნაპეტები {#including-snippets}

გამოიყენეთ [VitePress კოდის ნაწილის სინტაქსი ](https://vitepress.dev/guide/markdown#import-code-snippets) გენერირებული ან ადგილობრივი წყაროების შესატანად:

```md
<<< @/snippets/client.template.toml
```

დასახელებული კოდის რეგიონის შეტანა შესაძლებელია მისი რეგიონის სახელწოდების დამატებით:

```md
<<< @/example_code/lorem.rs#ipsum
```

ხელით დაწერილი მაგალითები უნდა იყოს მცირე. უპირატესობა აქვს განახლებულ წყარო არტეფაქტებს საჯარო ინტერფეისების, კონფიგურაციის შაბლონების, გენერირებული სქემებისა და ბრძანებების გამომუშავებისათვის.
