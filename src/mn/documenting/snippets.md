---
translation_locale: mn
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Кодны снэппеттер {#code-snippets}

Оролцож буй хэсгүүд нь тэдгээрийг бүтээсэн Iroha шинэчлэлийн код, конфигурац, схематай холбогдсон жишээг хадгалах.

## Iroha шинэчлэлтийн эд зүйлс {#refreshing-iroha-artifacts}

Iroha-аас үүдэлтэй үзлэгүүд нь энгийн сайтын бүтээн байгуулалтад сүлжээний хүртээмж эсвэл ах дүү хадгаламжийн хэрэгцээ шаардлагагүй байхын тулд шалгагдана. Тэднийг тодорхой шинэчлэх:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Тэнд бүртгэгдсэн [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) ажлын урсгал цэвэр эх үүсвэрийн хяналтын дагуу `provenance/iroha.json`, нөхөн сэргээдэг `/src/snippets` болон Torii OpenAPI хүйтэн зураг, шинэчлэл SHA-256 Hashes. Тодорхойлолт болон эх үүсвэрийн өөрчлөлтийг нэгтгэж үзнэ үү. VitePress бүтээн байгуулалт нь өөрчлөх салбар авахгүйгээр бүртгэгдсэн файлуудыг хэрэглэж байна.

## Сниппеттерд хамруулсан {#including-snippets}

[VitePress код-снайптын синтаксис ](https://vitepress.dev/guide/markdown#import-code-snippets)-ийг ашиглан үүсгэсэн эсвэл орон нутгийн эх үүсвэрийг багтааарай:

```md
<<< @/snippets/client.template.toml
```

Нэрлэгдсэн код бүс нутгийг түүний бүсийн нэрийг нэмээд багтааж болно:

```md
<<< @/example_code/lorem.rs#ipsum
```

Хөдөлмөрийн бичгийн жишээг бага байлгаарай. Олон нийтийн интерфейс, конфигурацийн загварууд, бүтээгдсэн схема, команд гаргахын тулд шинэчилсэн эх үүсвэрийн артефактыг сонгоно.
