---
translation_locale: ka
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama შეფუთვები {#musubi-kotodama-packages}

Musubi არის პაკეტის მენეჯერი Kotodama წყარო პაკეტებისთვის. იგი აძლევს დეველოპერებს Cargo-ს მსგავს სამუშაო პროცესს კომპოზიციური Kotodama ფუნქციების გასაზიარებლად, ხოლო პაკეტის იდენტობის შენარჩუნება დაკავშირებულია SORA და Iroha სახელის სივრცეებთან, ნაცვლად გლობალური სახელითა ცხრილის.

გამოიყენეთ Musubi, როდესაც საჭიროა:

- გამოაქვეყნოს განმეორებით გამოსაყენებელი Kotodama წყარო ბიბლიოთეკები
- პინი ზუსტი გარდამავალი წყაროზე დამოკიდებულებები `Musubi.lock`
- რეკონსტრუქცია დამოკიდებულების წყარო დადასტურებული SoraFS არქივის ვალდებულებების მიხედვით
- დაკავშირება პაკეტის სახელის სივრცე dapp კონტრაქტის aliases იმავე სახელების სივრცე
- შეამოწმოს, გამოაქვეყნოს, ამოიღოს ან ალიას პაკეტები ქსელში არსებული რეესტრის მეშვეობით

## პაკეტის სახელები {#package-names}

კანონიკური შეფუთვის ID-ების გამოყენება:

```text
namespace/package
```

ზუსტი გამოშვების მითითებების გამოყენება:

```text
namespace/package@version
```

სახელის სივრცის წინ არ არის მითითებული `@`. `@` გამყოფი განკუთვნილია ვერსიის სათავეში.

დასახელების სივრცის სეგმენტი შეესაბამება Kotodama dapp ხელშეკრულების ანალიზის გამოყენებულ საკვანძო სიტყვებს:

|პაკეტის იდენტიფიკაცია |დაკავშირებული ხელშეკრულების ალიას ფორმა |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

დასახელების სივრცეებს აქვთ ან `<dataspace>` ან `<domain>.<dataspace>` ფორმა. როდესაც პაკეტს აქვს dapp ბმული, Musubi აამოწმებს, რომ ყველა დაკავშირებული ხელშეკრულების alias იყენებს იგივე სახელის სივრცის სათავე როგორც პაკეტი.

## გამოცხადება {#manifest}

შეფუთვა იწყება `Musubi.toml`:

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

დამოკიდებულებამ შეიძლება გამოიყენოს ზუსტი ვერსიები, ფრთხილობის მოთხოვნები, ტილდის მოთხოვნებია, გარეგნული ბარათები, როგორიცაა `1.*`, ან შედარების სიები, როგორიც არის `>=1.0.0,<2.0.0`.

`Musubi.lock` აღნიშნავს შერჩეულ ტრანზიტულ გრაფიკს ქსელის რეესტრიდან. თითოეული ჩაკეტილი კვანძი ინახავს მის კანონიკურ პაკეტს, შეირჩილებულ მოთხოვნას, SoraFS მანიფესტის დიგესტს, წყარო არქივის ჰეში, ბაიტების რაოდენობა, ფაილების რაოდენობა, ექსპორტირებული ფუნქციები, დეტერმინისტური წყარო არქივის გეგმა და დამოკიდებულების საიდუმლოებები. მოკლე საიდუმლოს გადაჭრა ხდება სანამ ისინი შედიან საკეტი ფაილში.

## ადგილობრივი სამუშაო პროცესები {#local-workflow}

აღმავალი Iroha სამუშაო სივრცის ფესვიდან, გაუშვით Musubi Cargo- ში:

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

გამოიყენეთ `install --offline` ზუსტი ვერსიის დამოკიდებულებებისათვის გადაუწყვეტლივ საკეტო ფაილისთვის დაწერისთვის, ბმულის გამოკითხვის გარეშე. გამოიყენეთ `install --locked` CI-ში მოძველებული საკეტების ფაილის უარყოფისთვის.

`build` უკავშირდება განთავსებული დამოკიდებულების წყაროები, გადაწერით მოწოდებები, როგორიცაა `math::add()` დეტერმინისტური შიდა Kotodama ფუნქციის სახელებს. იგი უარყოფს მოწოდებებს იმ ფუნქციებზე, რომლებიც დამოკიდებულება არ ექსპორტირებულა. Musubi v1 ბიბლიოთეკები არის მხოლოდ ფუნქციური: დამოკიდებულების წყაროები, რომლებიც შეიცავს სახელმწიფო დეკლარაციებს, triggers, kotoba ბლოკები, კონსტანტები, ან სხვა non-ფუნქცია ხელშეკრულების ელემენტები უარყოფითად.

## წყაროს მიღება Archives {#fetching-source-archives}

Musubi შეუძლია მოიპოვოს დაკარგული დამოკიდებულების წყაროები, როდესაც გადაწყვეტს ან მოგვიანებით კეიშის ქვებრძანებების მეშვეობით:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

პირდაპირი კარიბჭეების მიღება იყენებს ერთ ან მეტ SoraFS კარიბხელის პროვაიდერის სპეციფიკაციას:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

მომწოდებლის სასარგებლო ტვირთის ფაილები და კარიბჭეების პროვაიდერები ერთმანეთისგან გამორიცხულია ერთი შეძენის ოპერაციისთვის. თუ გააჩნია ერთზე მეტი ჩაკეტილი პაკეტი, თითოეული კარიბხელის პროვაიდერი უნდა იყოს `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` ან `manifest=<64-hex SoraFS manifest digest>`.

კარები. `base-url` და `privacy-url` ღირებულებები უნდა გამოიყენოს `https://` დეფოლუტურად. ადგილობრივი ტესტირების კარიბჭეები შეიძლება გამოიყენოს `http://localhost`, `http://127.0.0.1`, ან `http://[::1]` მხოლოდ `--gateway-allow-insecure-localhost`. ნაკადი tokens არის runtime credentials და არ არიან ჩაწერილი `Musubi.lock`.

## გამოცემა {#publishing}

`pack` ითვლება დეტერმინისტური BLAKE3-256 წყარო არქივის ჰეში პლუს წყარო ბაიტი და ფაილი ითვლება. როდესაც `--car-out`, `--sorafs-manifest-out` ან `--source-plan-out` არის მიწოდებული, ის ასევე აშენებს დეტერმინისტურ SoraFS CAR სასარგებლო ტვირთს, SoraFS მანიფესტს და Musubi წყარო არქივის გეგმას იმავე წყარო ფაილების კომპლექსიდან.

გამოქვეყნებამდე გამოიყენეთ მშრალი გაშვება:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

გარეშე `--dry-run`, `publish` დაწერს ნორმატიული არტეფაქტები ქვემოთ `.musubi/dist/<namespace>/<name>/<version>/`, optional ატვირთავს manifesto და სასარგებლო ტვირთი მეშვეობით Torii აჟიოტაჟი SoraFS სათავსო პინის საბოლოო წერტილი `--upload`, რეგისტრირებს წარმოქმნილ SoraFS pin, და წარუდგენს `PublishMusubiRelease` კონფიგურირებული Iroha კლიენტი.

გამოქვეყნებული ცნობები უნდა შეიცავდეს:

- არა ცარიელი კანონიკური წყარო არქივი
- დეტერმინისტური წყარო არქივის გეგმა
- მინიმუმ ერთი ექსპორტირებული Kotodama ფუნქცია
- დამოკიდებულების ჩანაწერები, რომლებიც არ ირჩევენ გაშლილ განთავისუფლებებს
- dapp ბმული, თუ არსებობს, რომლის სახელწოდებაც შეთანხმებით შეესაბამება პაკეტის სახელის სივრცეს

## რეგისტრაციის კითხვები და სიცოცხლის ციკლი {#registry-queries-and-lifecycle}

მოძებნეთ და შეამოწმეთ რეესტრი:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

იანკინგი მალავს გათავისუფლებას ახალი რეზოლუციისგან, მაგრამ ინარჩუნებს არსებულ ჩაკეტვის ფაილებს განახლებად:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi თავიდან აიცილებს გლობალურ სახელების შეკრებას, რომ გააკეთოს `namespace/package` კანონიკური პაკეტის სახელი. სახელის სივრცეში გამოქვეყნება უნდა იყოს ავტორიზებული იმავე მფლობელის ან დელეგირებული ნებართვის მოდელის მიერ, რომელიც გამოიყენება იმ Kotodama dapp სახელების სივრცესთვის . კურირებული გლობალური მოკლე საიდუმლოები განცალკევებულია პაკეტის მფლობელობისგან: `SetMusubiShortAlias` საჭიროებს `CanSetMusubiShortAlias` ნებართვას, ხოლო სამიზნე პაკეტს უკვე უნდა ჰქონდეს მინიმუმ ერთი აქტიური გამოშვება.

## Iroha ზედაპირები {#iroha-surfaces}

Musubi გამოიყენება პირველი კლასის Iroha ინსტრუქციები და შეკითხვები:

|ზედაპირი |მიზანი |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |გამოაქვეყნეთ შეუცვლელი პაკეტის განთავსება. |
|`YankMusubiRelease` |ვ ჟჲბჲქთ ჲეჟსკვნარაჲრჲ.|
|`SetMusubiShortAlias` |კურირებული გლობალური მოკლე ანალიზი შეაერთეთ პაკეტის ID- სთან. |
|`AssertMusubiReleaseExists` |საჭიროა კონკრეტული პაკეტის ვერსიის არსებობა. |
|`FindMusubiReleaseByRef` |ოჲჱნავეთ ჟლვევრაჲ ჱა ოპვრთნარაჲ. |
|`FindMusubiPackageVersions` |პაკეტის ID- ის ვერსიების ჩამონათვალი. |
|`FindMusubiPackageReleases` |ჩამოთვალეთ შეჯამებები, რომლებიც გამოქვეყნდება პაკეტის ID- ისთვის. |
|`SearchMusubiPackages` |ძებნა პაკეტის შეჯამებები სახელის სივრცე და ტექსტით. |
|`FindMusubiShortAliasByName` |ოჲჟლვევ ეა ჟვ ოპაგთმ ჟრფა.|

Torii აჩვენებს: Musubi HTTP გზის ოჯახი ქვემოთ `/v1/musubi/`. სააგენტოს მიმართ MCP ინსტრუმენტები გამოფენილია, როგორც `iroha.musubi.` ალიანსები. იხილეთ [Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md) და [შეკითხვის რეფერენცია](/ka/reference/queries.md) უფრო ფართოდ API რუკა.
