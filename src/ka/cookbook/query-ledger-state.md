---
translation_locale: ka
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# საკვანძო-ბლოკჩეინის რეესტრი სახელმწიფო {#query-ledger-state}

## შედეგები {#outcome}

წაიკითხეთ და დააპროეცირეთ Taira-ს JSON რესურსები, შემდეგ CLI-დან და Rust SDK-დან გამოიყენეთ Torii-ის კოლექციების მოთხოვნები ფილტრებით, დალაგებით, სერვერის მხარეს პროექციით, გვერდის ლიმიტებით და გაუმჭვირვალე `next_cursor`-ით გაგრძელებით. ასევე ჩამონათვალებისთვის არ გამოიყენებთ ხელმოწერილ ტიპიზებულ მოთხოვნებს, რომლებიც მათ არ ფილტრავს, არ ალაგებს და არ აპროეცირებს.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Node.js 24, და მიმდინარე `iroha` CLI.
- მხოლოდ წაკითხვის საშუალებით Taira.
- CLI-ის მაგალითებისთვის: კლიენტის კონფიგურაცია Taira-სთვის ან გენერირებული ლოკალური ქსელისთვის.
- Rust მაგალითისთვის, პროექტი მიზნული ქსელის მსგავსად იგივე Iroha წყარო რევიზიონზეა ჩართული.

## ნაბიჯები {#steps}

### 1. გვერდი საჯარო რესურსში Taira {#_1-page-through-a-public-taira-resource}

რესურსების მარშრუტები სასარგებლოა დაშბორდებისა და სიგარეტის შემოწმებისთვის. ითხოვეთ JSON, შეაერთეთ თითოეული გვერდი და გამოაქვეყნეთ მხოლოდ ის ველები, რომლებიც საჭიროა აპლიკაციის მიერ პასუხის შემოწმების შემდეგ.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
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
  cursor = page.next_cursor
} while (cursor)
```

:::

ეს HTTP ზედაპირი გვერდებად ყოფს `limit`-ით და გაუმჭვირვალე `next_cursor`-ით; დააბრუნეთ ის უცვლელად როგორც `cursor`, სანამ არ გახდება `null`. `total` ჩნდება მხოლოდ მაშინ, როდესაც ითხოვთ `include_total=true`-ს, რაც სრულ სკანირებას მოითხოვს.

### 2. გაფილტრეთ კოლექცია CLI-ით {#_2-filter-a-collection-with-the-cli}

CLI ფილტრს, პროექციას და გვერდის ზომას კოლექციის საბოლოო წერტილს უგზავნის და ბეჭდავს ერთ გვერდს, `{items, next_cursor}`. დაამატეთ `--all`, რათა `next_cursor`-ს მიჰყვეთ, სანამ ის `null` არ გახდება.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

ფილტრაცია გვერდებად დაყოფამდე ხდება. თითოეული კოლექცია მხოლოდ საკუთარ ველებს იღებს; უცნობი ველი, იმის ნაცვლად რომ არაფერს დაემთხვეს, `invalid_filter`-ს აბრუნებს.

### 3. დალაგება სტაბილური მეტამონაცემების გასაღების მიხედვით {#_3-sort-by-a-stable-metadata-key}

კოლექციის დალაგების გასაღებები იღებს გამოცხადებულ ველებს და `metadata.<key>`-ს; კლებადი რიგისთვის გასაღებს წინ დაურთეთ `-`. გასაღების არმქონე მწკრივები ზრდადი რიგით პირველები ლაგდება, ხოლო თანაბარ მნიშვნელობებს მწკრივის იდენტობა განსაზღვრავს, ამიტომ გამოიყენეთ გასაღები, რომელიც მთელ კოლექციაში თანმიმდევრულადაა შევსებული.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` სერვერის მხარეს პროექციაა: `--select id,metadata` აბრუნებს მხოლოდ ამ ველებს, ხოლო უცნობი ველი აბრუნებს `invalid_select`-ს. ხელმოწერილი ტიპიზებული მოთხოვნები ყოველთვის სრულ ელემენტებს აბრუნებს, ამიტომ მათი შედეგები კლიენტის მხარეს დააპროეცირეთ `jq`-ით ან JavaScript-ით, როგორც ზემოთ.

### 4. მოდით Rust იტერატორს გაუმჭვირვალე კურსორების დაცვა. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` გვერდის ზომას ადგენს. `list`-ის მიერ დაბრუნებული იტერატორი შემდეგ გვერდს სერვერის `next_cursor`-ით მხოლოდ მიმდინარე გვერდის ამოწურვის შემდეგ ითხოვს, ხოლო `take` ლოგიკურ შედეგს ზღუდავს. აქ `client` არის `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` არის გაუმჭვირვალე პოზიცია გასაღებთა ნაკრებში, რომელიც მიბმულია თავის კოლექციაზე, გზაზე, ფილტრსა და დალაგებაზე. არასოდეს გაარჩიოთ ან ხელოვნურად შექმნათ ის, და ნუ გამოიყენებთ მას სხვა ფილტრით ან დალაგებით; Torii ასეთ მოთხოვნას `invalid_cursor`-ით უარყოფს. გვერდებს შორის ჩამატებული ან წაშლილი მწკრივები შემდგომ გვერდზე დაუკავშირებელ მწკრივებს არასოდეს გაიმეორებს და არ გამოტოვებს.

## შემოწმება {#verify}

ზუსტი დომენის ფილტრი უნდა დაბრუნდეს მხოლოდ `universal.universal`. შეამოწმეთ შედეგი, ნაცვლად იმისა, რომ დათვალოთ წარმატებული CLI გასვლა მარტო:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

გვერდებად დაყოფილი აპლიკაციის მოთხოვნებისთვის ასევე შეამოწმეთ, რომ ID-ები გვერდებს შორის არ მეორდება, მოთხოვნილი ლოგიკური ლიმიტი არასოდეს გადაიჭარბება და უარყოფილი კურსორის შემთხვევაში მოთხოვნა დოკუმენტირებული საკონტროლო წერტილიდან თავიდან იწყება.

## პრობლემების აღმოფხვრა {#troubleshooting}

- ცალკეული მოთხოვნა არ იღებს განმეორებადი ფილტრების, დალაგების, გვერდების ან ჩამოტვირთვის პარამეტრებს. გამოიყენეთ შესაბამისი სიის მოთხოვნა, როდესაც ეს კონტროლები საჭიროა.
- `limit` გვერდის ზომაა და არა მთლიანი შედეგი: მინიმუმ 1 და მაქსიმუმ კვანძის `torii.app_api_max_list_limit` (ნაგულისხმევად 500); Torii-ის ნაგულისხმევი მნიშვნელობაა 100. მეტის წასაკითხად მიჰყევით `next_cursor`-ს, `--all`-ს ან SDK-ის იტერატორს.
- `invalid_cursor` ნიშნავს, რომ კურსორი არასწორად არის ფორმირებული ან სხვა კოლექციას, გზას, ფილტრს ან დალაგებას ეკუთვნის. მოთხოვნა თავიდან დაიწყეთ; გაუმჭვირვალე მნიშვნელობის შეკეთებას ნუ ეცდებით.
- შერჩევითმა ფილტრმა შეიძლება დააბრუნოს მოკლე ან ცარიელი გვერდი არაცარიელი `next_cursor`-ით. მიჰყევით მას, სანამ ის `null` არ გახდება.
- `--filter` და HTTP-ის `filter` პარამეტრი Torii-ის ტექსტურ გრამატიკას იღებს, მაგალითად `id = "universal.universal"` ან `exists(metadata.tier)`. JSON პრედიკატის ობიექტი ფილტრის ტექსტი არ არის და არასწორი `filter`-ის სახით მარცხდება.
- ფართო, შეუზღუდავი მოთხოვნები ზრდის ქსელის კვანძების დატვირთვას და კლიენტის მეხსიერების მოხმარებას. დააყენეთ მომხმარებელი კოდისთვის შესაფერისი ლოგიკური ლიმიტი და გვერდის ზომა.
- ხელმოწერილი `/v1/query` ჩამონათვალის API არ არის. ის უშვებს ერთეულოვან მოთხოვნებს და იტერირებადი მოთხოვნების რამდენიმე ფილტრის გარეშე დაწყებას, ხოლო სხვებს, მაგალითად `FindDomains`-ს ან `FindAssetDefinitions`-ს, `signed_query_shape_not_admitted`-ით უარყოფს. კოლექციების საბოლოო წერტილები, CLI-ის `list` ბრძანებები და SDK-ის კოლექციების წამკითხველები ფილტრის, დალაგებისა და კურსორის ერთსა და იმავე გრამატიკას იყენებენ.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [Torii-ის კოლექციების მოთხოვნების კონტრაქტი დამაგრებული წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Rust-ის კოლექციების წაკითხვა და კურსორის იტერატორი დამაგრებული წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [ხელმოწერილი მოთხოვნების დაშვება დამაგრებული წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [კითხვები](/ka/blockchain/queries.md)
- [შეკითხვის რეფერენცია](/ka/reference/queries.md)
- [JavaScript და TypeScript](/ka/guide/tutorials/javascript.md)
