---
translation_locale: ka
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama შეფუთვები {#musubi-kotodama-packages}

Musubi არის პირველი გამოშვების პაკეტების მენეჯერი Kotodama წყარო პაკეტებისთვის. იგი გადაწყვეტს ზუსტ ჯაჭვზე დამოკიდებულების გრაფიკს, აuthenticates SoraFS წყარო არქივები, შედგება და ტესტირებს შერჩეულ სამუშაო სივრცეს, ქმნის კანონიკურ CAR არქივებს და აქვეყნებს შეუცვლელ რელიზებს Iroha საშუალებით.

გამოიყენეთ Musubi, როდესაც საჭიროა:

- გამოაქვეყნეთ განმეორებადი ფუნქციის ბიბლიოთეკები Kotodama
- დააკვეთეთ ზუსტი გარდამავალი გრაფიკი `Musubi.lock`
- რეკონსტრუქცია დამოკიდებულების წყარო განსაზღვრული SoraFS არქივის ვალდებულებებისგან
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

სახელის სივრცეში არ არსებობს ლიდერი `@`. სახელების სივრცე არის ან მონაცემთა სივრცის ფესვი, როგორიცაა `universal` ან დომენის კვალიფიცირებული მონაცემები სივრცე, როგორიცაა `dex.universal`. მთავარ წიგნს უკავშირდება სტრუქტურული სახელების სიახლე ერთი სტაბილური საწყისი მონაცემების სივრცეს, სანამ პაკეტი შეიძლება მოითხოვოს.

## მანიფესტი და Lockfile {#manifest-and-lockfile}

პაკეტში გამოყენებულია დახურული პირველი გამოშვება `Musubi.toml` სქემა. მანიფესტში უნდა აღინიშნოს `manifest-version = 1`, Kotodama გამოცემა `"1"`, და IVM ABI ვერსია `1`; არ არსებობს ალტერნატიული მანიფესტი, ან ABI რეჟიმი.

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

დამოკიდებულებამ შეიძლება გამოიყენოს ზუსტი ვერსიები, მოთხოვნები ზრუნვა ან tilde, ველური ბარათები, როგორიცაა `1.*`, და კომა-განცალკეული შედარების ნაკრები, როგორიცაა `>=1.0.0,<2.0.0`. დამოკიდებულება ცხრილის გასაღები არის მშობლიური ადგილობრივი იმპორტის alias; `package` ყოველთვის კანონიკური რეესტრი სელექტორი.

`Musubi.lock` უკავშირებს გრაფიკს ზუსტად გენეზიდან გამომდინარე `NetworkId` და საბოლოო რეესტრის სურათს. ის აღნიშნავს შერჩეულ სამუშაო სივრცის ფესვებსა და შეუცვლელ გათავისუფლების კვანძებს, მათ შორის გათავისუფლება, წყარო, ინტერფეისი, არქივი, ABI და ზუსტი დამოკიდებულების საწინააღმდეგო ვალდებულებები. პარალელური ვერსიები დასაშვებია, როდესაც გადაჭრილი გრაფიკი ამას საჭიროებს.

## კონფიგურაცია Taira SoraFS მოზიდვა {#configure-taira-sorafs-fetching}

Taira არის ამ სამუშაო პროცესის საჯარო ტესტნეტი. დაიწყეთ Taira კლიენტის კონფიგურაციიდან შემოწმებული ჯაჭვისა და ქსელის იდენტურობით, შემდეგ დაამატეთ მომწოდებლისთვის სპეციფიკური ავთენტური მოძიების კავშირები ქვემოთ . ანგარიშის ხელმოწერის მასალა და პროვაიდერის ოპერატორის გასაღები უნდა დარჩეს მხოლოდ მფლობელის მიერ განთავსებულ ფაილებში.

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

მომწოდებლის კატალოგი უზრუნველყოფს მომწოდებლის ვინაობასა და რეკლამირებულ საბოლოო წერტილებს. მიიღეთ შესაბამისი ოპერატორის ავტორიზაცია შერჩეული მომწოდებლისგან. runtime იყენებს ამ გასაღებელს, რათა მოითხოვოს შეზღუდული ნაკადის ტოკენები; ტოკენი არ არის არც CLI არგუმენტები და არც საკეტის ფაილის შინაარსი .

არ გამოიყენოთ Taira ვალიდატორის პინი URL როგორც `url`. ჩაშენებულმა ვალიდატორებმა შეწყვიტეს შენახვა SoraFS. მათი `https://taira-validator-{1,2,3,4}.sora.org` საბოლოო წერტილები იღებენ პინის რეგისტრაციას, ხოლო არქივის წაკითხვები იყენებს შერჩეულ დაშვებული პროვაიდერის HTTPS წარმომავლობას.

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

დამოკიდებულების წყაროები დაკავშირებულია იმით, რომ გადაწერენ კვალიფიციურ მოწოდებებს, როგორიცაა `math::add()` დეტერმინისტულ შიდა Kotodama სახელებს. დამოკიდებულების მოწოდება არექსპორტირებულ ფუნქციაზე უარყოფა. იმპორტირებული ბიბლიოთეკები გამოფენს ფუნქციებს; ადგილობრივი `[[contract]]` და `[[test]]` სამიზნეები რჩებიან მკაფიო პაკეტის სამიზნეებად.

## კეიშის შემოწმება და გამოსწორება {#cache-verification-and-repair}

საჯარო კეიშის ბრძანებები იმოქმედებს შეუცვლელ, რეესტრის მიერ ჩართულ არქივებზე:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` კარანტინი კორუმფირებს საიმედო შთამომავლებს და ახდენს ზუსტი არქივების გადამოწმებას, როდესაც საბოლოო პროვაიდერის მტკიცებულებები ამის საშუალებას იძლევა. Musubi უარყოფს ცოცხალ არაცარიელ ჭრილობის მუტაციას. გამოიყენეთ `--dry-run` კლასიფიცირებული კანდიდატების შესამოწმებლად.

## შეფუთვა და გამოცემა {#packaging-and-publishing}

შეამოწმეთ სუფთა დადებითი ფაილების ნაკრები არქივის დაწერამდე, შემდეგ შექმენით კანონიკური პაკეტი:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` წერს `target/package/<namespace>-<name>-<version>.car`. CAR უკავშირდება კანონიკური პაკეტის მანიფესტი, სემანტიკური გათავისუფლების მანიფესი, ზუსტი შემოწმების საკეტი, წყარო ხე, ინტერფეისი  digest და SoraFS არქივის ვალდებულება. პირველი გამოშვების `pack`, `--car-out`, `--sorafs-manifest-out` ან `--source-plan-out` ბრძანებები ცალკე არ არსებობს CLI.

გამოქვეყნება არის ხელმოწერილი, განახლებადი ქსელის სამუშაო მიმდინარეობა. შერჩეული `client.toml` უნდა შეიცავდეს წარმოების `[musubi.publication]` კავშირებს, ასევე ანგარიშს და Taira ქსელის კონფიგურაციას. პაკეტი ზუსტად ერთი სამუშაო სივრცის წევრი:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

გამოიყენეთ `--detach` ოპერაციის ჟურნალის და თესლის შესვლის საზღვრის გამძლეობის შემდეგ დაბრუნებისათვის. განაგრძეთ მდგრადი ოპერაცია `publish --resume <operation-id> --config client.toml`-ით. უფრო ვიწრო გზა `--recover <operation-id>` მხოლოდ რეკონსტრუქციებს არ არსებობს გამოცემა `--dry-run` ან ზოგადი საჯარო ატვირთების ჩამორთმევა; მოძრაობა `package --list` და `package` ადგილობრივი ფრენის წინასწარი.

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

გამოიყენეთ `unyank` იგივე პაკეტი, ვერსია და ახლად წაკითხული რევიზიონი ამ მდგომარეობის შესაქმნელად. პაკეტის მფლობელობა და შენარჩუნების როლები კონტროლი გამოაქვეყნოს, yank, metadata, და არქივის ადგილმდებარეობის ნებართვები. გლობალურ საგნებს აქვთ საკუთარი ფასების რეგისტრაცია, გადამიზნების ისტორია და შედარება-დაყენება რევიზიები; ისინი არ არიან პაკეტის მფლობელობის გასწორებები.

## Iroha ზედაპირები {#iroha-surfaces}

Musubi იყენებს V1 ინსტრუქციას და შეკითხვებს პირველი გამოშვების შესახებ:

|ზედაპირი |მიზანი |
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |ბმული სახელის სივრცე მისი სტაბილური საშინაო მონაცემთა სივრცე. |
|`RegisterMusubiArchiveV1` |რეგისტრირება შეუცვლელი ავთენტიფიცირებული წყარო არქივის ვალდებულება. |
|`AddMusubiArchiveLocationV1` |დამატება ან განახლება დამტკიცებული SoraFS არქივის ადგილმდებარეობა. |
|`PublishMusubiReleaseV1` |მოითხოვეთ ან განახორციელეთ პაკეტი და გამოაქვეყნეთ ერთი შეუცვლელი გამოშვება. |
|`SetMusubiReleaseYankV1` |შეადარეთ და დააყენეთ ზუსტი გათავისუფლების მოზიდული მდგომარეობა. |
|`InviteMusubiPackageMaintainerV1` |დაიწყეთ საპაკეტო როლების ზეპირი მოწვევის ნაკადი. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |დარეგისტრირეთ ან განახორციელეთ რეგისტრირებული გლობალური საიდუმლო სახელი. |
|`AssertMusubiReleaseDigestV1` |ოჲჟლავა ოპვრთნალჲ ჟრანთმვნარაჲ. |
|`FindMusubiExactPackageV1` |წაიკითხეთ ერთი ზუსტი პაკეტი და მისი რევიზიები. |
|`FindMusubiExactReleaseV1` |წაკითხეთ ერთი ზუსტი გამოსვლის სურათი. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |გადაწყვიტეთ ან ჩამოთვალეთ დასრულებული გამოშვების კანდიდატები. |
|`FindMusubiArchiveLocationsV1` |წაიკითხეთ განსაზღვრული პროვაიდერის მიერ მხარდაჭერილი არქივის ადგილები. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |წაკითხეთ ამჟამინდელი საიდუმლო ნიშანი ან მისი უცვლელი ისტორია. |

Torii გამოხატავს აპლიკაციის მარშრუტის ოჯახს `/v1/musubi/`. MCP ინსტრუმენტები იყენებენ მიმდინარე `iroha.musubi.queries.` და `iroha.musubi.instructions.*` სახელებს. იხილეთ [Torii საბოლოო წერტილები ](/ka/reference/torii-endpoints.md) და [ შეკითხვის რეფერენცია ](/ka/reference/queries.md) უფრო ფართო რუკისათვის API.
