---
translation_locale: ka
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama შეფუთვები {#musubi-kotodama-packages}

Musubi არის პირველი გამოშვების პაკეტის მენეჯერი Kotodama წყარო პაკეტებისთვის. იგი გადაწყვეტს ზუსტ გრაფიკას დამოკიდებულების ქსელზე, აuthenticates SoraFS წყარო არქივები, შედგება და ტესტირებს შერჩეულ სამუშაო სივრცეს, ქმნის ერთპიროვნულ პროტოკოლურ სტანდარტზე CAR არსებულ არქივებს და აქვეყნებს შეუცვლელ რელიზებს Iroha საშუალებით.

გამოიყენეთ Musubi, როდესაც საჭიროა:

- გამოაქვეყნეთ განმეორებადი ფუნქციის ბიბლიოთეკები Kotodama
- დააკვეთეთ ზუსტი გარდამავალი გრაფიკი `Musubi.lock`
- რეკონსტრუქცია დამოკიდებულების წყარო განსაზღვრული SoraFS არქივის კრიპტოგრაფიული ვალდებულებების ღირებულებებიდან
- შექმნა და გამოცდა ერთი პაკეტის ან მრავალპაკეტის სამუშაო სივრცეში
- შეამოწმოს, გამოაქვეყნოს, ამოიღოს, შეინარჩუნოს ან ალიას პაკეტები ქსელზე არსებული რეესტრის საშუალებით

## პაკეტის სახელები {#package-names}

კანონიკური პაკეტის სელექტორები იყენებენ:

```text
namespace/package
```

ზუსტი გამოშვების იდენტიფიკატორები დამატება ვერსია:

```text
namespace/package@version
```

სახელის სივრცეში არ არსებობს ლიდერი `@`. სახელების სივრცე ან არის მონაცემთა სივრცის ფესვი, როგორიცაა `universal` ან დომენის კვალიფიცირებული მონაცემთა სიახლე, როგორიცაა `dex.universal`. ბლოკჩეინის რეესტრი ამავე სტრუქტურულ სახელების სიფართოს ერთ სტაბილურ საწყისი მონაცემთა სიფართოზე აკავშირებს სანამ პაკეტი შეიძლება მოითხოვონ.

## ტექნიკური მანიფესტი და დაბლოკვის ფაილი {#manifest-and-lockfile}

პაკეტში გამოყენებულია დახურული პირველი გამოშვება `Musubi.toml` სქემა. ტექნიკური მანიფესტში უნდა გამოცხადდეს: `manifest-version = 1`, Kotodama გამოცემა `"1"`, და IVM ABI ვერსია `1`; არ არსებობს ალტერნატიული ტექნიკური მანიფესტი; ან ABI რეჟიმი.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

დამოკიდებულებამ შეიძლება გამოიყენოს ზუსტი ვერსიები, მოთხოვნები ზრუნვა ან tilde, ჯოკერები როგორიცაა `1.*`, და კომა-განცალკევებული შედარების ნაკრები, როგორიცაა `>=1.0.0,<2.0.0`. დამოკიდებულება ცხრილის გასაღები არის მშობლიური ადგილობრივი იმპორტის ალიასი; `package` ყოველთვის კანონიკური რეესტრის სელექტორია.

`Musubi.lock` უკავშირებს გრაფიკს ზუსტად გენეზისიდან გამომდინარე `NetworkId` და საბოლოო რეესტრის სურათს. ის აღნიშნავს შერჩეულ სამუშაო სივრცის ფესვებს და შეუცვლელ გათავისუფლების კვანძებს, გათავისუფლება, წყარო, ინტერფეისი, არქივი, ABI და ზუსტი დამოკიდებულების საზღვრის კრიპტოგრაფიული ვალდებულება. პარალელური ვერსიები დასაშვებია მაშინ, როდესაც გადაჭრილი გრაფიკი მათ საჭიროებს.

## კონფიგურაცია Taira SoraFS მოზიდვა {#configure-taira-sorafs-fetching}

Taira არის ამ სამუშაო პროცესის საჯარო ტესტნეტი. დაიწყეთ კონფიგურაციაზე Taira კლიენტი ჩანახული ჯაჭვი და მიმდინარე ჩაკეტილი გენეზისიდან გამომდინარე ქსელის იდენტურობით, შემდეგ დაამატეთ მომწოდებლის სპეციფიკური ავთენტური მოძიების კავშირები ქვემოთ. Taira განახლება შეუძლია შეცვალოს `NetworkId`; განაახლოს იგი ხელმოწერილი განთავსების პროფილისგან, ნაცვლად იმისა, რომ ეს გამოიყოს სტაბილური ჯაჭვიდან UUID. ანგარიშის ხელმოწერის მასალა და მომწოდებლის ოპერატორის გასაღები უნდა დარჩეს მხოლოდ მფლობელის შესრულების გარემოს ფაილებში.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

აღმოაჩინეთ Taira-ის დაშვებული პროვაიდერები საჯარო ტესტნეტის ფესვიდან:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

პროვაიდერის კატალოგი უზრუნველყოფს პროვაიდორის ვინაობას და რეკლამირებულ API საბოლოო წერტილებს. მიიღეთ შესაბამისი ოპერატორის ავტორიზაცია შერჩეული პროვაიდერიდან. შესრულების გარემო იყენებს ამ გასაღებას, რათა მოითხოვოს შეზღუდული ნაკადის ტოკენები; ტოკენი არ არის არც CLI არგუმენტები და არც საკეტი ფაილების შინაარსი.

არ გამოიყენოთ Taira დამტკიცების პინი URL როგორც `url`. შემოწმებულმა ვალიდატორებმა ჩაშალეს: SoraFS შეზღუდული შენახვა. მათი `https://taira-validator-{1,2,3,4}.sora.org` API საბოლოო წერტილები იღებენ პინი რეგისტრაციას, ხოლო არქივის წაკითხვები იყენებენ შერჩეულ დაშვებულ პროვაიდერს HTTPS წარმოშობა.

## ადგილობრივი სამუშაო პროცესები {#local-workflow}

აღმავალი Iroha სამუშაო სივრცის ფესვიდან, შექმენით ან შეიყვანეთ პაკეტის დირექტორი და განახორციელეთ Musubi Cargo- ით:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` ხსნის საბოლოო რეესტრის გრაფიკას, განახლებაებს `Musubi.lock`, როდესაც ამის საშუალება აქვს, და სავსებს შეუცვლელ ადგილობრივ კეშს ავთენტიფიცირებული SoraFS ადგილმდებარეობიდან. `check`, `build`, `test` და `package` ასრულებენ იმავე გრაფიკასა და კეშის შემოწმებას საკუთარი მუშაობის წინ .

გამოიყენეთ `--locked` ნებისმიერი საკეტის ფაილში ცვლილების უარყოფისთვის. გამოიყენეთ `--offline` მხოლოდ მაშინ, როდესაც რეესტრის ინდექსი და ყველა საჭირო არქივი უკვე დაცულია. `--frozen` აერთიანებს ამ ორ შეზღუდვას. ოფლაინ კეიფი წარუმატებელია; Musubi არასოდეს წერს გაურკვეველ საკეტს ფაილზე.

დამოკიდებულების წყაროები დაკავშირებულია გადაწერით კვალიფიციური ტექნიკური მოწოდებები, როგორიცაა `math::add()` დეტერმინისტური შიდა Kotodama სახელებს. დამოკიდებულების ტექნიკური არექსპორტირებულ ფუნქციაზე გამოძახება უარყოფითია. იმპორტირებული ბიბლიოთეკები ამჟღავნებენ ფუნქციებს; ადგილობრივი `[[contract]]` და `[[test]]` სამიზნეები კვლავ რჩებიან პაკეტის მკაფიო მიზნებად.

## კეიშის შემოწმება და გამოსწორება {#cache-verification-and-repair}

საჯარო კეიშის ბრძანებები მუშაობს უცვლელზე, რომელიც გამოქვეყნებულია რეესტრის არქივში:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` კარანტინი კორუმფირებს საიმედო შთამომავლებს და ახდენს ზუსტი არქივების გადამოწმებას, როდესაც ამის საშუალებას აძლევს საბოლოო პროვაიდერის მტკიცებულებები. გადაჭრა მიზანმიმართულად ჩაკეტულია ცოცხალი არაცარიელი მუტაციის გამო; გამოიყენეთ `--dry-run` კლასიფიცირებული კანდიდატების შესამოწმებლად.

## შეფუთვა და გამოცემა {#packaging-and-publishing}

შეამოწმეთ სუფთა დადებითი ფაილის ნაკრები არქივის დაწერამდე, შემდეგ შექმენით კანონიკური პაკეტი:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` დაწერს `target/package/<namespace>-<name>-<version>.car`. CAR აკავშირებს კანონიკური პაკეტის ტექნიკურ მანიფესტს, სემანტიკური გათავისუფლების ტექნიკური მანიფესიტს, ზუსტ შემოწმების საკეტს, წყარო ხეს, ინტერფეისის კრიპტოგრაფიული დიჯესტი და SoraFS არქივის კრიპტოგრაფიული ვალდებულება. პირველ გამოცემაში CLI არ არსებობს ცალკეული ბრძანებები `pack`, `--car-out`, `--sorafs-manifest-out` ან `--source-plan-out` .

გამოქვეყნება არის ხელმოწერილი, განახლებადი ქსელის სამუშაო მიმდინარეობა. შერჩეული `client.toml` უნდა შეიცავდეს საჭირო `[musubi.publication]` კავშირებს, ასევე ანგარიშს და Taira ქსელის კონფიგურაციას. შეავსეთ ზუსტად ერთი სამუშაო სივრცის წევრი:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

გამოიყენეთ `--detach` ოპერაციის ჟურნალის და თესლის შესვლის საზღვრის გამძლეობის შემდეგ დაბრუნებისათვის. განაგრძეთ მდგრადი ოპერაცია `publish --resume <operation-id> --config client.toml`-ით. უფრო ვიწრო გზა `--recover <operation-id>` მხოლოდ რეკონსტრუქციებს არ არის გამოქვეყნებული `--dry-run` ან ზოგადი საჯარო ატვირთების ჩამორთმევა; გაუშვით `package --list` და `package` ადგილობრივი ფრენის წინასწარი.

## რეგისტრაციის კითხვები და სიცოცხლის ციკლი {#registry-queries-and-lifecycle}

ძებნა და შემოწმება დასრულებული რეესტრის იგივე Taira კლიენტის კონფიგურაცია:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

იანკინგი გამორიცხავს ახალი რეზოლუციების შეუცვლელ გამოშვებას, მაშინ როდესაც არსებული ზუსტი საკეტები კვლავ განახლებადია. ჯერ წაიკითხეთ მიმდინარე იანკის გადახედვა და შემდეგ წარადგინეთ შედარება-დაყენება მუტაცია:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

ამ მდგომარეობის შესაბრუნებლად `unyank` იმავე პაკეტით, ვერსიითა და ახლად წაკითხული რევიზიით გამოიყენეთ. პაკეტის მფლობელობა და მომვლელის როლები გამოქვეყნების, გამოხმობის, მეტამონაცემებისა და არქივის მდებარეობის ნებართვებს აკონტროლებს. გლობალურ ალიასებს საკუთარი ფასიანი რეგისტრაცია, სამიზნის შეცვლის ისტორია და შედარება-დაყენების რევიზიები აქვს; ისინი პაკეტის მფლობელობის შემოვლითი გზა არ არის.

## Iroha ზედაპირები {#iroha-surfaces}

Musubi იყენებს V1 ინსტრუქციას და შეკითხვებს პირველი გამოშვების შესახებ:

|ზედაპირი |მიზანი |
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |ბმული სახელის სივრცე მისი სტაბილური საშინაო მონაცემთა სივრცე. |
|`RegisterMusubiArchiveV1` |რეგისტრირება შეუცვლელი ავთენტიფიცირებული წყარო არქივის კრიპტოგრაფიული ვალდებულება. |
|`AddMusubiArchiveLocationV1` |დამატება ან განახლება დამტკიცებული SoraFS არქივის ადგილმდებარეობა. |
|`PublishMusubiReleaseV1` |მოითხოვეთ ან განახორციელეთ პაკეტი და გამოაქვეყნეთ ერთი შეუცვლელი გამოშვება. |
|`SetMusubiReleaseYankV1` |შეადარეთ და დააყენეთ ზუსტი გათავისუფლების მოზიდული მდგომარეობა. |
|`InviteMusubiPackageMaintainerV1` |დაიწყეთ საპაკეტო როლების ზეპირი მოწვევის ნაკადი. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |დარეგისტრირეთ ან განახორციელეთ რეგისტრირებული გლობალური ალიასი სახელი. |
|`AssertMusubiReleaseDigestV1` |ადასტურეთ ზუსტი უცვლელი გათავისუფლების კრიპტოგრაფიული დიჯესტი. |
|`FindMusubiExactPackageV1` |წაიკითხეთ ერთი ზუსტი პაკეტი და მისი რევიზიები. |
|`FindMusubiExactReleaseV1` |წაკითხეთ ერთი ზუსტი გამოსვლის სურათი. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |გადაწყვიტეთ ან ჩამოთვალეთ დასრულებული გამოშვების კანდიდატები. |
|`FindMusubiArchiveLocationsV1` |წაიკითხეთ განსაზღვრული პროვაიდერის მიერ მხარდაჭერილი არქივის ადგილები. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |წაკითხეთ ამჟამინდელი ალიასი ნიშანი ან მისი უცვლელი ისტორია. |

Torii აჩვენებს აპლიკაციის მარშრუტის ოჯახს ქვემოთ: `/v1/musubi/*`. MCP ინსტრუმენტები იყენებენ მიმდინარე `iroha.musubi.queries.*` და `iroha.musubi.instructions.*` სახელები. იხილეთ [Torii API საბოლოო წერტილები](/ka/reference/torii-endpoints.md) და [შეკითხვის რეფერენცია](/ka/reference/queries.md) უფრო ფართოზე API რუკა.
