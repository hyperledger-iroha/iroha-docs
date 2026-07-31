---
translation_locale: ka
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama პაკეტები {#musubi-kotodama-packages}

Musubi არის პაკეტის მენეჯერი Kotodama წყარო პაკეტები.
დეველოპერები Cargo მსგავსი სამუშაო ნაკადი გაზიარების კომპოზიციური Kotodama ფუნქციები
პაკეტის იდენტობის შენარჩუნება SORA და Iroha სახელის სივრცეების ნაცვლად
გლობალური პირველი შემოსვლის სახელების ცხრილი.

გამოყენება Musubi როდესაც საჭიროა:

- გამოაქვეყნებს განმეორებითი გამოყენების საშუალებას Kotodama წყარო ბიბლიოთეკები
- პინ ზუსტი გარდამავალი წყარო დამოკიდებულებები `Musubi.lock`
- რეკონსტრუქცია დამოკიდებულების წყაროს მიერ შემოწმებული SoraFS არქივის ვალდებულებები
- შეაერთეთ პაკეტის სახელების სივრცე Dapp კონტრაქტის aliases იმავე
  სახელების სივრცე
- შეამოწმოს, გამოაქვეყნოს, ამოიღოს ან ალიას პაკეტები ქსელზე რეესტრის მეშვეობით

## პაკეტის სახელები {#package-names}

გამოყენება კანონიკური შეფუთვის ID:

```text
namespace/package
```

ზუსტი გამოშვების მითითებების გამოყენება:

```text
namespace/package@version
```

არ არსებობს წამყვანი `@` ნომერების სივრცეზე. `@` გამყოფი რეზერვებულია
ვარიანტის სათავეში.

სახელების სივრცის სეგმენტი შეესაბამება გამოყენებულ სათავეს Kotodama dapp ხელშეკრულება
სათაურები:

| შეფუთვის იდენტიფიკაცია                | დაკავშირებული ხელშეკრულების ანალიზის ფორმა |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

სახელის სივრცეებს აქვთ ან `<dataspace>` ან `<domain>.<dataspace>` ფორმა. როდესაც
პაკეტს აქვს Dapp ბმული, Musubi შემოწმება, რომ ყველა დაკავშირებული ხელშეკრულების alias
გამოიყენება იგივე სახელის სივრცეში, როგორც პაკეტი.

## მანიფესტი {#manifest}

პაკეტი იწყება: `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

დამოკიდებულებამ შეიძლება გამოიყენოს ზუსტი ვერსიები, მოთხოვნების დაცვა, tilde
მოთხოვნები, ველური ბარათები `1.*`, ან შედარების სია, როგორიცაა:
`>=1.0.0,<2.0.0`.

`Musubi.lock` აღწერს შერჩეული ტრანზიტიული გრაფიკი ქსელზე
რეგისტრი. თითოეული ჩაკეტილი კვანძი ინახავს თავის კანონიკური პაკეტის refer, შეირჩა
მოთხოვნა, SoraFS manifest digest, წყარო არქივის ჰეში, ბაიტების რაოდენობა, ფაილი
გათვლა, ექსპორტირებული ფუნქციები, დეტერმინისტური წყარო არქივის გეგმა და
დამოკიდებულების საიდუმლოები. მოკლე საიდუმლოს გადაჭრა ხდება, სანამ ისინი შედიან
კვრთის ფაილი.

## ადგილობრივი სამუშაო პროცესები {#local-workflow}

ზემოდან. Iroha სამუშაო სივრცის root, run Musubi სატვირთო საშუალებით:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

გამოყენება `install --offline` დაწეროს გადაუჭრელი საკეტი ფაილი ზუსტი ვერსიისთვის
დამოკიდებულებების გარეშე შეკითხვა კვანძი. გამოყენება `install --locked` დაწვრილებით CI დაწვრილებით
უარი თქვას მოძველებულ ბლოკფაილზე.

`build` ბმულები cached დამოკიდებულება წყაროების გადაწერით ზარები, როგორიცაა
`math::add()` დეტერმინისტური შიდა Kotodama ფუნქციის სახელები. ის უარყოფს
მოწოდებები იმ ფუნქციებზე, რომელთა ექსპორტი დამოკიდებულებამ არ გააკეთა. Musubi v1 ბიბლიოთეკები
მხოლოდ ფუნქციური: დამოკიდებულების წყაროები, რომლებიც შეიცავს სახელმწიფო დეკლარაციებს;
ტრიგერები, ქოტბას ბლოკები, კონსტანტები ან სხვა არფუნქციური ხელშეკრულების ობიექტები
უარყოფითად იქცევიან.

## წყაროების მოპოვება Archives {#fetching-source-archives}

Musubi შეიძლება მოიპოვოს დაკარგული დამოკიდებულების წყაროები, როდესაც გადაწყვეტა ან მოგვიანებით
კეიშის ქვეკომენდაციების საშუალებით:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

პირდაპირი კარიბჭის აღება ერთი ან რამდენიმე SoraFS კარიბჭეების მიმწოდებლის სპეციფიკა:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

პროვაიდერის სასარგებლო ტვირთების ფაილები და გეტვეის პროვაიდერები ერთმანეთისგან გამორიცხულია
მოძიების ოპერაცია. თუ ერთიზე მეტი ჩაკეტილი პაკეტი აკლია, შეამოწმეთ თითოეული
გატვირთვის პროვაიდერი `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, ან
`manifest=<64-hex SoraFS manifest digest>`.

კარი. `base-url` და `privacy-url` მნიშვნელობები უნდა გამოიყენოს `https://` დეფოლუტურად.
ადგილობრივი სატესტო კარიბჭეები შეიძლება გამოყენებულ იქნას `http://localhost`, `http://127.0.0.1`, ან
`http://[::1]` მხოლოდ `--gateway-allow-insecure-localhost`. დინება
ტოქენები runtime credentials და არ არის ჩაწერილი `Musubi.lock`.

## გამომცემლობა {#publishing}

`pack` გამოთვლის დეტერმინისტური BLAKE3-256 საწყისი არქივის ჰეში პლუს
წყარო ბაიტი და ფაილების რაოდენობა. როდესაც `--car-out`, `--sorafs-manifest-out`, ან
`--source-plan-out` არის მიწოდებული, ის ასევე აშენებს დეტერმინისტური SoraFS
CAR სასარგებლო ტვირთი, SoraFS მანიფესტი, და Musubi წყარო არქივის გეგმა იგივე
წყარო ფაილების კომპლექტი.

გამოქვეყნებამდე გამოიყენეთ მშრალი გაშვება:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

გარეშე `--dry-run`, `publish` დაწერს ნორმატიული არტეფაქტები ქვემოთ
`.musubi/dist/<namespace>/<name>/<version>/`, ვარიანტურად ატვირთავს
მანიფესტი და სასარგებლო ტვირთის საშუალებით Torii ეს არის SoraFS სათავსო პინის ბოლო წერტილი
`--upload`, რეგისტრირებს წარმოქმნილ SoraFS pin, და submits
`PublishMusubiRelease` კონფიგურირებული Iroha კლიენტი.

გამოქვეყნებული ცნობები უნდა შეიცავდეს:

- არაცარიელი კანონიკური წყარო არქივი
- დეტერმინისტური წყარო არქივის გეგმა
- მინიმუმ ერთი ექსპორტირებული Kotodama ფუნქცია
- დამოკიდებულების ჩანაწერები, რომლებიც არ ირჩევენ გაშლილ რეჟიმებს
- dapp ბმული, თუ არსებობს, რომლის სახელწოდებაც შეთანხმებით შეესაბამება პაკეტს
  სახელების სივრცე

## რეგისტრაციის კითხვები და სიცოცხლის ციკლი {#registry-queries-and-lifecycle}

შეამოწმეთ რეესტრი:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

იანკინგი მალავს გათავისუფლებას ახალი რეზოლუციიდან, მაგრამ ინარჩუნებს არსებულ ფაილებს
განახლებადი:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi თავიდან აცილებს გლობალური სახელი squatting `namespace/package` დასახელება
კანონიკური პაკეტის სახელი. სახელების სივრცეში გამოქვეყნება უნდა იყოს ავტორიზებული
იგივე მფლობელობის ან დელიგირებული ნებართვის მოდელი, რომელიც გამოიყენეს ამ მიზნით Kotodama
dapp სახელების სივრცე. კურირებული გლობალური მოკლე aliases არის ცალკე შეფუთვა
საკუთრება: `SetMusubiShortAlias` მოითხოვს `CanSetMusubiShortAlias`
ნებართვა და მიზნობრივი პაკეტი უნდა შეიცავდეს მინიმუმ ერთ აქტიურ
გათავისუფლება.

## Iroha ზედაპირები {#iroha-surfaces}

Musubi გამოყენება პირველი კლასის Iroha ინსტრუქციები და შეკითხვები:

| ზედაპირი                      | მიზანი                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | გამოაქვეყნეთ შეუცვლელი პაკეტის განთავისუფლება.              |
| `YankMusubiRelease`          | ჟრანთჟრთნარაჲ ოპვჟრგჲლწნაჲ, კჲდარჲ ვ ნაპაგთმ.                |
| `SetMusubiShortAlias`        | კრებული გლობალური მოკლე ალექსანდრე პაკეტის იდენტიფიკატორთან. |
| `AssertMusubiReleaseExists`  | საჭიროა კონკრეტული პაკეტის ვერსიის არსებობა.       |
| `FindMusubiReleaseByRef`     | ოჲჱნავეთ ჟრფნჲ ნაოპაგთლწნთკა.        |
| `FindMusubiPackageVersions`  | ჩამოთვალეთ პარაკლისის ID- ის ვერსიები.                    |
| `FindMusubiPackageReleases`  | შეაწერეთ რეზიუმები, რომლებიც გამოქვეყნებულია პაკეტის ID- ისთვის.           |
| `SearchMusubiPackages`       | მოძებნეთ პაკეტის შეჯამებები სახელების სივრცით და ტექსტით.    |
| `FindMusubiShortAliasByName` | ოჲჟლვეგაქ ჟჲბჲპთნარა.                     |

Torii ამტკიცებს, რომ Musubi HTTP გზის ოჯახი ქვემოთ `/v1/musubi/*`.
სააგენტოს მიმართ MCP ინსტრუმენტები გამოფენილია როგორც `iroha.musubi.*` ალიასები. იხილეთ
[Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md) და
[შეკითხვის რეფერენცია](/ka/reference/queries.md) უფრო ფართოდ API რუკა.
