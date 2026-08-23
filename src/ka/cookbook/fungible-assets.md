---
translation_locale: ka
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 6b50c995afaf9f46df6fdaab31add40b106cfa12fdaa31dabbb74448486f87f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ფუნქციური აქტივები {#fungible-assets}

## შედეგები {#outcome}

შეამოწმეთ პირდაპირი Taira აქტივების განსაზღვრები და შეავსეთ რეესტრი, მონეტა, გადარიცხვა, წვის და ბალანსის შემოწმების ნაკადი გენერირებულ ადგილობრივ ქსელში.  რეცეპტი იყენებს კანონიკურად განუსაზღვრელ Base58 აქტივების განსაზღვრაზე IDs, დომენით კვალიფიციურ საყვედურებებზე, დომენის გარეშე I105 ანგარიშზე IDs და მკაფიო გადასახადების გადახდას.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან, Node.js 24, და მიმდინარე `iroha` CLI.
- მხოლოდ წაკითხვის საშუალებით Taira.
- წაკითხვის გასვლისთვის, [დან წარმოქმნილი ადგილობრივი ქსელი Launch Iroha](/ka/get-started/launch-iroha.md), `./localnet/client.toml` და Torii ზე `http://127.0.0.1:8080`.

## ნაბიჯები {#steps}

### 1. შეამოწმეთ Taira განმარტებები ხელმომწერის გარეშე {#_1-inspect-taira-definitions-without-a-signer}

აქტივების განმარტებები შეიცავს გაუმჭვირვალე Base58 ID, ჩვენების სახელწოდება, mintability პოლიტიკა, ციფრული მასშტაბი, ვარიანტული alias, მფლობელი და საერთო რაოდენობა. კონკრეტული ბალანსის ასევე მოიცავს მისი მფლობელის ანგარიში და ვარიანტის მონაცემთა სივრცის სფერო.

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

ჩართეთ JavaScript ფორმა `node taira-assets.mjs`. საჯარო აქტივი IDs არის შიშველი Base58 ღირებულებები; წაკითხადი მნიშვნელობა, როგორიცაა `cookbook_credit#wonderland.universal` არის alias, რომელიც გადაწყდება ერთ-ერთ მათგანს IDs.

### 2. მომზადება ადგილობრივი თვითმმართველობის და მიმართულებისათვის {#_2-prepare-the-local-authority-and-destination}

გამოიყვანეთ ადგილობრივი ორგანო გენერირებულ კონფიგურაციაში არსებული საჯარო გასაღებიდან და აირჩიეთ სხვა რეგისტრირებული ანგარიში, როგორც მიმღები. არ არის დაბეჭდილი კერძო გასაღები.

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

ეს მხოლოდ ადგილობრივი ID არის მოქმედი არასწორი Base58 აქტივის განსაზღვრის მისამართი. alias უზრუნველყოფს ადამიანის მიერ წაკითხილ პროექციას `domain.dataspace`. მასშტაბის `2` საშუალებას იძლევა ორი ფრაქციონალური ციფრები; გამორიცხვა `--mint-once` ინარჩუნებს გათვალისწინებულ `Infinitely` პოლიტიკას.

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

არ გამოიყენოთ ეს ID Taira. საჯარო ქსელის რეგისტრაციისთვის საჭიროა ახალი კანონიკური ID, თქვენი განაცხადისთვის გამოყოფილი დომენი / alias, გადასახადი დაფინანსება და აქტივების რეგისტრაციის ნებართვა runtime.

### 4. მინა, გადატანა და დამწვრობა {#_4-mint-transfer-and-burn}

ყველა დაწერის ბრძანება ხაზგასმით ირჩევს ავტორიტეტს, როგორც საფასურის გადამხდელს. CLI ციტატებს ზუსტ ტრანზაქციას ხელმოწერამდე და ელოდება დეფოლტად.

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

ცეცხლის შემდეგ, ელოდეთ წყაროს ბალანსს `64.50`, მიზნების ბალანტს `25.50` და საერთო რაოდენობას `90.00`.

::: warning ნებართვის საზღვარი

Taira-ზე, მიაწერეთ საპირფარეშოდან მიღებული `taira.tx-metadata.json` და გამოიყენეთ `--fee-payer authority` თითოეული წერისათვის. რეგისტრაციისა და მონტირებისათვის საჭიროა აქტიური ვალიდატორის ნებართვა; გადაცემა და დამწვრობა მოითხოვს უფლებამოსილებას წყარო ბალანსზე. საპირფრეშო ფინანსირებული ანგარიში არ არის ავტომატურად გამომცემელი.

:::

## შემოწმება {#verify}

წაიკითხეთ ორივე კონკრეტული ბალანსი და შემდეგ განსაზღვრა. ეს post-სახელმწიფო შეკითხვები წარმატების კრიტერიუმია; წარდგენის მიღება თავისთავად არ არის.

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

აპლიკაციის განცხადებებში უნდა შედარდეს ციფრული მნიშვნელობები, როგორც ფიქსირებული წერტილის დეციმალები და არა ორმაგი მცურავი წერტილის ღირებულებები და უნდა შემოწმდეს განსაზღვრა ID, ასევე ანგარიში.

## პრობლემების აღმოფხვრა {#troubleshooting}

- ID, რომელიც შეიცავს `#`, არის საიდუმლო ან კონკრეტული ბალანსი ლიტერალური და არა კანონიკური აქტივის განსაზღვრა ID. გამოიყენეთ ცარიელი Base58 ღირებულება `--definition`-ით, ან გადადით დაბმული საიდუმლოს `--definition-alias`.
- `Scale` შეცდომები ნიშნავს, რომ რაოდენობას აქვს უფრო მეტი ფრაქციონალური ციფრები, ვიდრე განსაზღვრა აძლევს საშუალებას.
- `Mintability` უარყოფა ნიშნავს `Once`, `Not` ან `Limited(n)` პოლიტიკის ამოწურვას. არ გადაწეროთ ისტორია; გამოიყენეთ პოლიტიკა, რომელიც დაბრუნებულია განსაზღვრის გამოკითხვის დროს.
- ნაბიჯი 2 მიზანმიმართულად ირჩევს რეგისტრირებულ დანიშნულების ანგარიშს. თუ აქტივების მიღება არის `ExplicitOnly`, განსაზღვრეთ დანიშნულება ბალანსის ავტორიზებული ნიშნით მიმდინარეობა გადარიცხვის წინ. ანალოგიური სახელწოდების CLI მცველი არ რეგისტრირებს ანგარიშს ან ბალანსს; ის აბორტებს სხვა ინსტრუქციის დამატების ნაცვლად.
- საფასურის უარყოფა ხდება ჩვეულებრივი ინსტრუქციის წარმატებამდე. აირჩიეთ გადამხდელი, გამოიყენეთ ქსელის საფასური აქტივების მეტადატალი და შეამოწმეთ მისი ბალანსი.
- თუ ფიქსირებული ადგილობრივი განსაზღვრა უკვე არსებობს ადრეული გაშვებიდან, დაიწყეთ ახლად წარმოქმნილი ადგილობრივი ქსელი ან გააგრძელეთ მისი არსებული მდგომარეობა. არასოდეს შეცვალოთ არასწორად ჩამოყალიბებული შემთხვევითი სიგარეტი Base58 ID.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [აქტივების სიცოცხლის ციკლის ინტეგრაციის ტესტები ჩაკეტილი კომიტეტზე ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/asset.rs)
- [Rust აქტივების კონსტრუქციის მაგალითები დაწესებულ ვალდებულებაზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/examples/tutorial.rs)
- [აქტივები](/ka/blockchain/assets.md)
- [ინსტრუქციები](/ka/blockchain/instructions.md)
- [ნებართვის ქაღალდები](/ka/reference/permissions.md)
- [JavaScript და TypeScript](/ka/guide/tutorials/javascript.md)
