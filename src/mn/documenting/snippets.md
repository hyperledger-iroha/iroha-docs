---
translation_locale: mn
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Кодын хэсгүүд {#code-snippets}

Үүсгэсэн хэсгүүдийн жишээнүүдийг тэднийг гаргасан Iroha хувилбарын код, тохиргоо, схемүүдтэй холбосон хэвээр үлдээдэг.

## Шинэчилж байна Iroha Урлах зүйлс {#refreshing-iroha-artifacts}

Iroha-аас үүсгэсэн хэсгүүдийг шалгаж оруулдаг тул энгийн сайт бүтээхэд сүлжээний нэвтрэлт эсвэл ахлах репозитори шаардлагагүй болно. Үүнийг тодорхой заавал шинэчил:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Баталгаажсан `etc/refresh-iroha.ts` урсгал нь цэвэр эх сурвалжийн шалгалтыг `provenance/iroha.json`-лүү шалгаж, `/src/snippets` болон Torii OpenAPI цаг хугацааны цэгийн өгөгдлийн үзэлтийг дахин үүсгэнэ, мөн SHA-256 криптографийн хэшийг шинэчилдэг. Агуулга ба гарал үүсэл өөрчлөлтийг хамтдаа хяна. Энгийн хамааралтай суулгалт ба VitePress бүтээн байгуулалтууд нь өөрчлөгддөг салбарыг татаж авахгүйгээр хадгалсан файлуудыг ашигладаг.

## Шуурхай хэсгүүдийг оруулах {#including-snippets}

Үүсгэсэн эсвэл локал эх сурвалжийг оруулахын тулд [VitePress код-сниппет синтакс](https://vitepress.dev/guide/markdown#import-code-snippets)-ыг ашиглана уу:

```md
<<< @/snippets/client.template.toml
```

Нэрлэсэн код бүсийг түүний бүсийн нэрийг нэмснээр оруулах боломжтой:

```md
<<< @/example_code/lorem.rs#ipsum
```

Гарын үсгээр бичсэн жишээ багатай байлга. Олон нийтийн интерфэйс, тохиргооны загвар, үүсгэсэн схем, командын гаралтад шинэчилсэн эх эх үүсвэрийн баримлыг ашиглахыг илүүд үз.
