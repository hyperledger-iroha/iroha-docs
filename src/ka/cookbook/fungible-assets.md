---
translation_locale: ka
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ფუნქციური აქტივები {#fungible-assets}

## შედეგები {#outcome}

შეამოწმეთ Taira-ს ცოცხალი ქსელის აქტივების განსაზღვრებები და გენერირებულ ლოკალურ ქსელში ბოლომდე გაიარეთ გამოშვების, გადაცემის, განადგურებისა და ბალანსის შემოწმების ნაკადი. რეცეპტი იყენებს კანონიკურ, პრეფიქსის გარეშე Base58 აქტივის განსაზღვრების ID-ებს, დომენის გარეშე I105 ანგარიშის ID-ებს და საფასურის ცხად გადახდას.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო ახალი ვერსია, Node.js 24 და მიმდინარე CLIs: `iroha` და `kagami`.
- მხოლოდ წაკითხვის საშუალებით Taira.
- ჩაწერისთვის: ლოკალური ქსელი ბრძანებით `kagami localnet generate --peers 4 --out-dir ./localnet`, როგორც გვერდზე [Iroha-ს გაშვება](/ka/get-started/launch-iroha.md), დამატებული `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa`-ით. ის იძლევა `./localnet/client.toml`-ს და Torii-ს მისამართზე `http://127.0.0.1:8080`.

## ნაბიჯები {#steps}

### 1. შეამოწმეთ Taira განსაზღვრები კრიპტოგრაფიული ხელმოწერის გარეშე. {#_1-inspect-taira-definitions-without-a-signer}

აქტივების განსაზღვრებები შეიცავს გაუმჭვირვალე Base58 ID-ს, საჩვენებელ სახელს, გამოშვების პოლიტიკას, რიცხვით მასშტაბს, არასავალდებულო ალიასს, მფლობელს, არასავალდებულო მფლობელ დომენს ან მონაცემთა სივრცეს, ბალანსის პოლიტიკას და ჯამურ რაოდენობას. კონკრეტული ბალანსი ასევე მოიცავს ანგარიშს, რომელზეც ის ირიცხება, და მონაცემთა სივრცის არასავალდებულო არეალს.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

გენერირებულ კონფიგურაციაში არსებული საჯარო გასაღებიდან გამოიყვანეთ ლოკალური უფლებამოსილი ანგარიში, შემდეგ შექმენით გასაღებების წყვილი ახალი მიმღები ანგარიშისთვის და დაარეგისტრირეთ იგი. პირადი გასაღები არ იბეჭდება.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. გამოიყენეთ კლიენტის საკუთრებაში არსებული რიცხვითი განსაზღვრება {#_3-use-a-client-owned-numeric-definition}

გენეზისის გარეთ განსაზღვრება რეგისტრირდება მფლობელი `--domain`-ის ქვეშ, რომელსაც ხელმომწერი ფლობს, გენერირებული ლოკალური ქსელის კლიენტი კი არცერთ დომენს არ ფლობს. `--asset-definition-id`-ით გენერირებულ ლოკალურ ქსელში ეს განსაზღვრება უკვე არსებობს: გენეზისმა ის შეუზღუდავი მასშტაბით დაარეგისტრირა, კლიენტი მის მფლობელად დანიშნა და კლიენტისთვის 1,000,000,000 ერთეული გამოუშვა.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

ეს ID Taira-ზე ხელახლა არ გამოიყენოთ. საჯარო ქსელში რეგისტრაციას სჭირდება ახალი კანონიკური ID, მფლობელი დომენი, რომელსაც თქვენი ანგარიში ფლობს (გადაეცემა `ledger asset definition register`-ს როგორც `--domain`), `CanManageAssetDefinitionAlias` ნებართვის მინიჭება ნებისმიერი ალიასისთვის და საფასურის დაფინანსება.

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

განადგურების შემდეგ, ელოდეთ წყაროს ბალანსს `1000000064.50`, დანიშნულების ბალანსას `25.50` და საერთო რაოდენობას `1000000090.00`.

::: warning ნებართვის საზღვარი

Taira-ზე ყოველი ჩაწერისთვის გამოიყენეთ `--fee-payer authority`; CLI ხელმოწერამდე იღებს ზუსტი საფასურის შეფასებას Taira-ს საფასურის აქტივში. რეგისტრაციისთვის საჭიროა განსაზღვრების `--domain`-ის ფლობა, ალიასს კი დამატებით სჭირდება `CanManageAssetDefinitionAlias`. გამოშვებისთვის საჭიროა განსაზღვრების ფლობა ან `CanMintAssetWithDefinition` ან `CanMintAssetToAccount` ნებართვის ქონა; გადაცემასა და განადგურებას სჭირდება უფლებამოსილება წყაროს ბალანსზე. გამცემის მიერ დაფინანსებული ანგარიში ავტომატურად არ არის გამომცემი.

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
- მე-2 ნაბიჯი დანიშნულების ანგარიშს ცხადად არეგისტრირებს, ამიტომ გადაცემა მაშინაც მუშაობს, როდესაც ანგარიშების დაშვების რეჟიმია `ExplicitOnly`. მსგავსი სახელის მქონე CLI დამცავი არც ანგარიშს არეგისტრირებს და არც ბალანსს; დამატებითი ინსტრუქციის დამატების ნაცვლად ის ოპერაციას წყვეტს.
- საფასურის უარყოფა ინსტრუქციის ჩვეულებრივ წარმატებამდე ხდება. აირჩიეთ გადამხდელი, CLI-ის საფასურის შეფასებაში შეამოწმეთ საფასურის აქტივი და მაქსიმუმი და გადაამოწმეთ ეს ბალანსი.
- იმავე ლოკალურ ქსელში ხელახალი გაშვება წინა ბალანსებიდან იწყება, ხოლო `kagami keys` უარს ამბობს არსებულ `./cookbook-recipient`-ზე. გაუშვით ახლად გენერირებული ლოკალური ქსელი და წაშალეთ ეს დირექტორია, ან აბსოლუტური მნიშვნელობების ნაცვლად შეადარეთ ბალანსის ცვლილებები. Base58 ID-ის ნაცვლად არასოდეს გამოიყენოთ არასწორად ფორმირებული შემთხვევითი სტრიქონი.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [აქტივების სიცოცხლის ციკლის ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust აქტივების კონსტრუქციის მაგალითები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [აქტივები](/ka/blockchain/assets.md)
- [ინსტრუქციები](/ka/blockchain/instructions.md)
- [ნებართვის ტოკენები](/ka/reference/permissions.md)
- [JavaScript და TypeScript](/ka/guide/tutorials/javascript.md)
