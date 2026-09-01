---
translation_locale: ka
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ფუნქციური აქტივები {#fungible-assets}

## შედეგები {#outcome}

შეამოწმეთ აქტივების ცოცხალი Taira განსაზღვრები და შეავსეთ რეესტრი, გამოშვება, გადაცემა, განადგურება და ბალანსის შემოწმების ნაკადი გენერირებულ ლოკალურ ქსელში. რეცეპტი იყენებს კანონიკურ არასწორ Base58 აქტივების განსაზღვრის ID- ს, დომენის კვალიფიცირებული ალტერნატივებს, დომენების გარეშე I105 ანგარიშის ID- ს და აშკარად გადახდის საფასურს.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან, Node.js 24, და მიმდინარე `iroha` CLI.
- მხოლოდ წაკითხვის საშუალებით Taira.
- წაკითხვის გასვლისთვის, წარმოქმნილი ადგილობრივი ქსელი [გაშვება Iroha](/ka/get-started/launch-iroha.md)-დან, `./localnet/client.toml` და Torii-თან ერთად `http://127.0.0.1:8080`.

## ნაბიჯები {#steps}

### 1. შეამოწმეთ Taira განსაზღვრები კრიპტოგრაფიული ხელმოწერის გარეშე. {#_1-inspect-taira-definitions-without-a-signer}

აქტივების განმარტებები შეიცავს არაგამჭვირვალე Base58 ID- ს, ჩვენების სახელწოდებას, აქტივების ემისიის პოლიტიკას, ციფრულ მასშტაბს, ვარიანტურ ალიასებს, მფლობელს და საერთო რაოდენობას. კონკრეტული ბალანსში შედის ასევე მისი მფლობელის ანგარიში და ვარიანტის მონაცემთა სივრცე.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

განახორციელეთ JavaScript ფორმა `node taira-assets.mjs`. საჯარო აქტივების ID-ები არის შიშველი Base58 ღირებულებები; წაკითხადი მნიშვნელობა, როგორიცაა `cookbook_credit#wonderland.universal` არის ალიასი რომელიც გადაწყვეტს ერთ-ერთ ამ ID-ს.

### 2. მოამზადეთ ადგილობრივი ავტორიზაციის სათაური და მიმართულება {#_2-prepare-the-local-authority-and-destination}

გამოიყვანეთ ადგილობრივი ავტორიზაციის პრინციპალი გენერირებულ კონფიგურაციაში არსებული საჯარო გასაღებიდან და აირჩიეთ სხვა რეგისტრირებული ანგარიში როგორც მიმღები. არ არის დაბეჭდილი კერძო გასაღები.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. დაარეგისტრირეთ ციფრული განსაზღვრება {#_3-register-a-numeric-definition}

ეს ადგილობრივი მხოლოდ ID არის მოქმედი პრეფიქსის გარეშე Base58 აქტივების განსაზღვრის მისამართი. ალიასი უზრუნველყოფს ადამიანის მიერ წაკითხული `domain.dataspace` პროექცია. მასშტაბური `2` საშუალებას ორ ცალკეულ ციფრებს; გამორიცხვა `--mint-once` ინარჩუნებს გათვალისწინებული `Infinitely` პოლიტიკა.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

არ გამოიყენოთ ეს ID Taira. საჯარო ბლოკჩეინის ქსელის რეგისტრაციისთვის საჭიროა ახალი კანონიკური ID, თქვენი აპლიკაციისთვის გამოყოფილი დომენი / ალტერნატივა, საფასურის დაფინანსება და შესრულების გარემოს აქტივების რეგისტრაციის ნებართვა

### 4. გამოშვება, გადაცემა და განადგურება {#_4-mint-transfer-and-burn}

ყველა დაწერის ბრძანება აირჩევს ავტორიზაციის სათაურის გადამხდელად. CLI ციტირებს ზუსტ ტრანზაქციას სანამ ხელმოწერა და ელოდება დეფოლუტურად.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

განადგურების შემდეგ, ელოდეთ წყაროს ბალანსს `64.50`, დანიშნულების ბალანსას `25.50` და საერთო რაოდენობას `90.00`.

::: warning ნებართვის საზღვარი

Taira-ზე, მიაწერეთ საფანჯროდან გამომდინარე `taira.tx-metadata.json` და გამოიყენეთ `--fee-payer authority` თითოეული წერისათვის. რეგისტრაციისა და გამოცემისათვის საჭიროა აქტიური ვალიდატორის ნებართვა; გადაცემა და განადგურება საჭიროებს ავტორიზაციის პრინციპს წყაროს ბალანსზე. ტესტნეტის მიერ დაფინანსებული ანგარიში არ არის ავტომატურად გამომცემელი.

:::

## შემოწმება {#verify}

წაიკითხეთ ორივე კონკრეტული ბალანსი და შემდეგ განსაზღვრა. ეს post-სახელმწიფო შეკითხვები წარმატების კრიტერიუმია; წარდგენის პროტოკოლის შედეგების რეგისტრაცია თავისთავად არ არის.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

აპლიკაციის განცხადებებმა უნდა შეადარონ ციფრული მნიშვნელობები, როგორც ფიქსირებული წერტილის დეციმალები და არა ორმაგი მცურავი წერტილის მნიშვნელობა და უნდა შემოწმონ განსაზღვრის ID-ი და ანგარიში.

## პრობლემების აღმოფხვრა {#troubleshooting}

- ID, რომელიც შეიცავს `#`, არის ალიასი ან ბეტონის ბალანსი ლიტერალური, და არა კანონიკური აქტივის განსაზღვრის ID. გამოიყენეთ ცარიელი Base58 ღირებულება `--definition`-ით, ან გადაიტანეთ დაბმული საიდუმო სახელი `--definition-alias`.
- `Scale` შეცდომები ნიშნავს, რომ რაოდენობას აქვს უფრო მეტი ფრაქციონალური ციფრები, ვიდრე განსაზღვრა აძლევს საშუალებას.
- `Mintability` უარყოფა ნიშნავს `Once`, `Not` ან `Limited(n)` პოლიტიკის გამოშვების ამოწურვას ან აკრძალვას. არ გადაწეროთ ისტორია; გამოიყენეთ პოლიტიკა, რომელიც დაბრუნებულია განსაზღვრის კითხვით.
- ნაბიჯი 2 მიზანმიმართულად ირჩევს რეგისტრირებულ დანიშნულების ანგარიშს. თუ აქტივების მიღება არის `ExplicitOnly`, განსაზღვრეთ დანიშნულება ბალანსის ავტორიზებული ნიშნით მიმდინარეობა გადარიცხვის წინ. ანალოგიური სახელწოდების CLI მცველი არ რეგისტრირებს ანგარიშს ან ბალანსს; ის აბორტებს სხვა ინსტრუქციის დამატების ნაცვლად.
- საფასურის უარყოფა ხდება ჩვეულებრივი ინსტრუქციის წარმატებამდე. აირჩიეთ გადამხდელი, გამოიყენეთ ქსელის საფასური აქტივების მეტადატალი და შეამოწმეთ მისი ბალანსი.
- თუ ფიქსირებული ადგილობრივი განსაზღვრა უკვე არსებობს ადრეული გაშვების შემდეგ, დაიწყეთ ახლად წარმოქმნილი ადგილობრივი ქსელი ან გააგრძელეთ მისი არსებული მდგომარეობა. არასოდეს შეცვალოთ არასწორად ჩამოყალიბებული შემთხვევითი სტრიკი Base58 ID- ით.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [აქტივების სიცოცხლის ციკლის ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust აქტივების კონსტრუქციის მაგალითები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [აქტივები](/ka/blockchain/assets.md)
- [ინსტრუქციები](/ka/blockchain/instructions.md)
- [ნებართვის ტოკენები](/ka/reference/permissions.md)
- [JavaScript და TypeScript](/ka/guide/tutorials/javascript.md)
