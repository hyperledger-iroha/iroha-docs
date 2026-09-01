---
translation_locale: ka
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# საკვანძო-ბლოკჩეინის რეესტრი სახელმწიფო {#query-ledger-state}

## შედეგები {#outcome}

წაკითხვა და პროექტირება Taira JSON რესურსები, შემდეგ გამოიყენეთ ტიპირებული Iroha მოთხოვნები ფილტრებით, ლოგიკური გვერდების განლაგებით, სორტირებით, მოძიების ზომებით და მხოლოდ წინასწარი კურსორის გაგრძელებით. თქვენ ასევე თავიდან აიცილებთ შერჩევითი პროექციის გამოყენებას, სანამ სერვერი შეაფასებს გადაგზავნილ `--select` tuple- ს.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Node.js 24, და მიმდინარე `iroha` CLI.
- მხოლოდ წაკითხვის საშუალებით Taira.
- ხელმოწერილი ტიპირებული მოთხოვნის მაგალითებისათვის, კლიენტის კონფიგურაცია Taira ან გენერირებული ლოკალური ქსელი.
- Rust მაგალითისთვის, პროექტი მიზნული ქსელის მსგავსად იგივე Iroha წყარო რევიზიონზეა ჩართული.

## ნაბიჯები {#steps}

### 1. გვერდი საჯარო რესურსში Taira {#_1-page-through-a-public-taira-resource}

რესურსების მარშრუტები სასარგებლოა დაშბორდებისა და სიგარეტის შემოწმებისთვის. ითხოვეთ JSON, შეაერთეთ თითოეული გვერდი და გამოაქვეყნეთ მხოლოდ ის ველები, რომლებიც საჭიროა აპლიკაციის მიერ პასუხის შემოწმების შემდეგ.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

აღნიშნული HTTP ზედაპირი იყენებს `limit` და `offset`. ჩვეულებრივად მოექცევით გამორიცხულ ან შეზღუდულ `total` რეჟიმს, როდესაც მარშრუტი უფრო იაფად ითვლის რეჟიმზე.

### 2. ფილტრება და პარტიის CLI ტიპირებული შეკითხვა {#_2-filter-and-batch-a-typed-cli-query}

CLI სერიალიზებს ტიპირებულ გამუდმებელს მოთხოვნას და მოყვება სერვერის გაგრძელების კურსორებს შინაგანად. აქ ლოგიკური შედეგი შეზღუდულია ერთი რიგით, ხოლო `--fetch-size 1` აკონტროლებს მაქსიმალურ პარტასს, რომელიც მიიღება თითოეულ ბრუნვითი მოგზაურობით.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

ფილტრირება ხდება გვერდების განთავსებამდე. გამოიყენეთ შეკითხვის სპეციფიკური ტიპირებული პრედიკატები; ანგარიშის ან აქტივის პრედიკატი არ შეიძლება უსაფრთხოდ გამოყენებულ იქნას დომენისთვის.

### 3. დალაგება სტაბილური მეტამონაცემების გასაღების მიხედვით {#_3-sort-by-a-stable-metadata-key}

ტიპირებული მოთხოვნის სორტირება არის ლექსიკოგრაფიული ერთ მეტამონაცემთა გასაღებაზე. ამ გასაღების გარეშე ელემენტები მიჰყვებიან შესრულების გარემოს განსაზღვრულ რიგგარეშს, ამიტომ გამოიყენეთ საკვანძო, რომელიც მუდმივად დასახლებულია კოლექციაზე.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

ჩანახული CLI პარსირებს `--select` JSON და გადაგზავნის სელექტორის ტუპლს, მაგრამ მიმდინარე მსუბუქი მოთხოვნა DSL არ აფასებს ამ სელექტორს სერვერზე. ჯერჯერობით არ შეიქმნას პროექტირების კონტრაქტი მის გარშემო . გამოიყენეთ SDK ტიპირებული პროექცია მხოლოდ მას შემდეგ, რაც მიზნობრივი შესრულების გარემო მხარს უჭერს მას ან პროექტირეთ დამტკიცებული შედეგის კლიენტის მხარეს `jq` ან JavaScript ზემოთ აღნიშნულით.

### 4. მოდით Rust იტერატორს გაუმჭვირვალე კურსორების დაცვა. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` ზღუდავს ლოგიკურ შედეგს. `FetchSize` აკონტროლებს თითოეული სერვერის პარტიას. დაბრუნებული იტერატორი გამჭვირვალედ აგზავნის გაგრძელების მოთხოვნებს სერვერის მიერ შექმნილი კურსორის გამოყენებით.

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

`ForwardCursor` არის ავტორიტეტის დაკავებული, პროცესის ადგილობრივი და მხოლოდ წინასწარი. არასოდეს გააანალიზოთ იგი, სინთეზირეთ იგი, გაუზიარეთ იგი ავტორიზაციის პრინციპებს შორის ან შეინარჩუნეთ ის როგორც პორტატული რეზიუმე ტოკი Torii შემთხვევებში. თუ ის ამოიწურა, განახორციელეთ ორიგინალური მოთხოვნა განზრახ აპლიკაციების დონეზე კონტროლის წერტილით.

## შემოწმება {#verify}

ზუსტი დომენის ფილტრი უნდა დაბრუნდეს მხოლოდ `wonderland.universal`. შეამოწმეთ შედეგი, ნაცვლად იმისა, რომ დათვალოთ წარმატებული CLI გასვლა მარტო:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

გვერდითი აპლიკაციების მოთხოვნისთვის, ასევე შეამოწმეთ, რომ ID-ები არ განმეორდება გვერდებზე, სთხოვილი ლოგიკური ლიმიტი არასდროს გადაჭარბდება და ვადაგასული კურსერის შემდეგ ხელახლა იწყება დოკუმენტური გამშვები პუნქტისგან.

## პრობლემების აღმოფხვრა {#troubleshooting}

- ცალკეული მოთხოვნა არ იღებს განმეორებადი ფილტრების, დალაგების, გვერდების ან ჩამოტვირთვის პარამეტრებს. გამოიყენეთ შესაბამისი სიის მოთხოვნა, როდესაც ეს კონტროლები საჭიროა.
- `fetch_size` არის არა ნულოვანი პარტიის მინიშნება, და არა საერთო შედეგის ლიმიტი. მიმდინარე გაურკვეველია `100` და შესრულების გარემო უარყოფს მნიშვნელობებს მის მაქსიმუმზე მაღლა.
- უცნობი, ამოწურული ან უცხო კურსერი განზრახ არ შეიძლება განმეორებით გამოყენებულ იქნას. განაახლეთ მოთხოვნა; ნუ ცდილობთ გაუმჭვირვალე მნიშვნელობის გამოსწორებას.
- მეტამონაცემების დალაგება არ არის ზოგადი ველის დახარისხება. თუ თითოეული ნივთი არ შეიცავს შერჩეული გასაღები, დოკუმენტაცია დაკარგული გასაღები რიგით ან აირჩიეთ სხვა სტრატეგია.
- CLI პარსირებს და გადმოსცემს `--select`, მაგრამ მიმდინარე სერვერი არ აფასებს მსუბუქი სელექტორის ტუპლს. გამოიყენეთ კლიენტის მხრიდან პროექცია, თუ სერვერის მხრიდან სელექტორის მხარდაჭერა არ არის შემოწმებული განთავსებული შესრულების გარემოსთვის.
- ფართო შეუზღუდავი მოთხოვნები ზრდის ქსელის კვანძების მუშაობას, კლიენტის მეხსიერებას და კურსერის სიცოცხლის რისკს. დაადგინეთ ლოგიკური ლიმიტი და მოძიების ზომა შესაბამისი მომხმარებლისთვის .
- საჯარო JSON რესურსის პარამეტრები და ხელმოწერილი ტიპირებული მოთხოვნის პარამეტრები არის დაკავშირებული, მაგრამ არა ცვალებად სერიალიზაციის ფორმატებს. უპირატესობა აქვს SDK ან CLI ტიპირებულ მოთხოვნის მონაცემთა კონტეინერებისთვის .

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [კურსორზე დაფუძნებული გვერდებად დაყოფის ინტეგრაციის ტესტები დამაგრებულ საწყისი კოდის რევიზიაში](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [შეკითხვის შემქმნელის ქცევა და სელექტორი დამაგრებული წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [მოთხოვნის პარამეტრები და კურსერის მოდელი ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [კითხვები](/ka/blockchain/queries.md)
- [შეკითხვის რეფერენცია](/ka/reference/queries.md)
- [JavaScript და TypeScript](/ka/guide/tutorials/javascript.md)
