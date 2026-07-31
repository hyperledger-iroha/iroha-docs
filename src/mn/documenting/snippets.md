---
translation_locale: mn
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Кодны снайппеттер {#code-snippets}

Тухайн хувилбаруудад код, конфигурац, схематай холбогдсон жишээг хадгалдаг.
УИХ-ын гишүүн Iroha тэдгээрийг бүтээсэн шинэчлэл.

## Уламжлах Iroha Бүтээгдэхүүн {#refreshing-iroha-artifacts}

Iroha-сэрлэгдсэн хувилбаруудыг шалгах тул хэвийн сайтын бүтээн байгуулалтад шаардлагагүй
Сүлжээний нэвтрүүлэг эсвэл ах дүүгийн хадгаламж. Тэднийг тодорхой шинэчлэх:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

-Тэглэгдсэн
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
ажлын урсгал цэвэр эх үүсвэрийн хяналтын `provenance/iroha.json`,
сэргээдэг `/src/snippets` болон Torii OpenAPI Урьдчилсан зураг, шинэчлэл SHA-256
хэшүүд. Тодорхойлолт, эх үүсвэр өөрчлөгдөж байна
тоног төхөөрөмж VitePress бүтээн байгуулалтууд бүртгэгдсэн файлуудыг хэрэглэж
Үргэлттэй салбарыг авдаг.

## Сниппеттерд хамруулсан {#including-snippets}

Хөдөлмөрийн
[VitePress код-снайптетийн синтаксис](https://vitepress.dev/guide/markdown#import-code-snippets)
үүссэн эсвэл орон нутгийн эх үүсвэр:

```md
<<< @/snippets/client.template.toml
```

Үүнд нэрлэгдсэн код бүс нутгийг түүний бүсийн нэрийг нэмээд багтааж болно:

```md
<<< @/example_code/lorem.rs#ipsum
```

Хөдөлмөрийн үлгэр жишээг бага байлгаарай. Нийт нийтэд зориулсан шинэчилсэн эх үүсвэрийн артефактыг илүүд үздэг
интерфейс, конфигурацийн загварууд, үүсгэсэн схема болон команд гаргах .
