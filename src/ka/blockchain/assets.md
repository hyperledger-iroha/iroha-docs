---
translation_locale: ka
translation_source: /blockchain/assets.md
translation_source_hash: 4d0a3f54a0c70d08d11160b9ec66d6538aa2c49c7771a13e4a070b61a9cb3e4b
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# აქტივები {#assets}

Iroha აქტივი არის ციფრული ბალანსი, რომელსაც ფლობს ანგარიში. თითოეული კონკრეტული ბალანზი მიუთითებს `AssetDefinition`, და განსაზღვრება აღწერს იმას, თუ როგორ შეიძლება ამ აქტივის დასახელება, გამოშვება, ჩვენება და გაყოფა.

## აქტივების განსაზღვრა {#asset-definition}

`AssetDefinition` შეიცავს:

- `id`: კანონიკური აქტივების განსაზღვრის მისამართი
- `name`: ადამიანის მიერ წაკითხული გამოსახულების სახელწოდება
- `description`: ავარიული აღწერა, რომელიც ადამიანისათვის წაკითხულია
- `alias`: ფორმით `<name>#<domain>.<dataspace>` ან `<name>#<dataspace>` წარსული ალიასი
- `spec`: ციფრული სიზუსტე და წონასწორობის შეზღუდვები
- `mintable`: აქტივების გამოშვების პოლიტიკის პოლიტიკა
- `logo`: არასწორია `SoraFS` URI
- `metadata`: საკვანძო მნიშვნელობის თვითნებური მეტამონაცემები.
- `balance_scope_policy`: ბალანსები გლობალურია თუ მონაცემთა სივრცით შეზღუდული
- `owned_by`: ანგარიში, რომელმაც დაარეგისტრირა ან ფლობს განსაზღვრას
- `total_quantity`: გამოშვებული საერთო რაოდენობა
- `confidential_policy`: დაცული აქტივების ოპერაციების პოლიტიკა

აქტივების განსაზღვრის ID-ები არის კანონიკური არაგამჭვირვალე მისამართები. როდესაც განსაზღვრება აშენებულია დომენიდან და სახელით, Iroha შეუძლია შეინახოს ეს დომენი / სახელის პროექცია UX და მოთხოვნები, მაგრამ კანონიკური ტექსტის ფორმა წარმოქმნილია მისამართი .

## ქონების ბალანსი {#asset-balance}

`Asset` შეიცავს:

- `id`: `AssetId`, რომელიც აერთიანებს აქტივების განსაზღვრას, მფლობელის ანგარიშს და ვალუტის ბალანსის ვარიანტს.
- `value`: ბალანსი `Numeric`

მფლობელის ანგარიში კანონიკურია და დომენს არ შეიცავს. აქტივის განსაზღვრება შეიძლება წარმოდგენილი იყოს მონაცემთა სივრცით დაზუსტებულ დომენში, მაგალითად `payments.universal`.

## აქტივების ემისიის პოლიტიკა {#mintability}

აქტივების განსაზღვრები მხარს უჭერს ამ აქტივთა ემისიის პოლიტიკის რეჟიმებს:

|რეჟიმი |მნიშვნელობა |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |ელასტიკური მიწოდება. აქტივი შეიძლება გაიცემოს და განადგურდეს არაერთხელ. |
|`Once` |ფიქსირებული მიწოდების ტოკენი. მისი გამოშვება მხოლოდ ერთხელაა შესაძლებელი, შემდეგ კი — დაწვა.|
|`Not` |მუდმივი მიწოდების ქაღალდი, რომელიც შეიძლება განადგურდეს, მაგრამ აღარ გაიცემა. |
|`Limited(n)` |პოლიტიკა საშუალებას იძლევა ახალი აქტივების ერთეულების გამოშვება დამატებითი ოპერაციების შეზღუდულ რაოდენობაში. |

გამოიყენეთ `Infinitely` ნორმალური ელასტიკური აქტივებისათვის და `Once` ან `Limited(n)` ფიქსირებული მიწოდების ან შეზღუდული მიწოდების აქტივებისთვის. არ გამოიყენოთ `Not` როგორც საწყისი პოლიტიკა, თუ აქტივების მიწოდება უკვე არ არის დადგენილი.

## აქტივების ბალანსის მოცულობა {#balance-scope}

`balance_scope_policy` აკონტროლებს, თუ როგორ ხდება ბალანსების გაყოფა:

- `Global`: ერთი ბალანდის გაყოფა ანგარიშზე და აქტივების განსაზღვრა
- `DataspaceRestricted`: ბალანსები მონაცემთა სივრცის კონტექსტის მიხედვით იყოფა

მონაცემთა სივრცით შეზღუდული ბალანსები გამოსადეგია, როცა აქტივის ერთი განსაზღვრება SORA Nexus-ის რამდენიმე მონაცემთა სივრცეში გამოიყენება, მაგრამ ბალანსები იზოლირებული უნდა დარჩეს.

## განახორციელეთ ეს სამუშაო პროცესი Taira {#try-it-on-taira}

აღნიშნული API მხოლოდ წაკითხვის მოთხოვნები აჩვენებს რეალურ აქტივების განმარტებებს საჯარო Taira ტესტის ქსელში:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

იპოვეთ მიმდინარე Taira XOR საფასური აქტივის განსაზღვრა:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

მოძებნეთ დეფინიციები, რომლებიც ატარებენ მეტამონაცემებს:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

სამივე მაგალითი წაკითხვაა. Taira-ზე აქტივების გამოსაშვებად, დასაწვავად ან გადასარიცხად გამოიყენეთ სატესტო ტოკენების გამცემი სერვისით დაფინანსებული ანგარიში და გვერდზე [SORA Nexus-ის მონაცემთა სივრცეებთან დაკავშირება](/ka/get-started/sora-nexus-dataspaces.md) აღწერილი შემოწმებადი პროცესი.

Taira-ზე საკომისიოს მქონე აქტივის მაგალითისთვის ჯერ დააფინანსეთ ხელმომწერი გვერდზე [სატესტო XOR-ის მიღება Taira-ზე](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) აღწერილი მომზადების ეტაპიანი ტოკენების მიღების პროცესით. შემდეგ `ledger asset mint`, `ledger asset burn` და `ledger asset transfer` ბრძანებებს გადასცით `--fee-payer authority`; CLI ხელმოწერამდე ითვლის ზუსტ საკომისიოს Taira-ს საკომისიო აქტივში:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## ინსტრუქციები {#instructions}

ქონების რეგისტრაცია, გამოშვება, განადგურება და გადაცემა შესაძლებელია Iroha ინსტრუქციის ოპერაციებით:

- [`Register` და `Unregister`](/ka/blockchain/instructions.md#un-register)
- [`Mint` და `Burn`](/ka/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ka/blockchain/instructions.md#transfer)
- [`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue)

იხილეთ ასევე:

- [CLI სახელმძღვანელო](/ka/get-started/operate-iroha-via-cli.md)
- [Rust მასწავლებელი](/ka/guide/tutorials/rust.md)
- [Python მასწავლებელი](/ka/guide/tutorials/python.md)
- [JavaScript/TypeScript სახელმძღვანელო](/ka/guide/tutorials/javascript.md)
- [მონაცემთა მოდელი](/ka/blockchain/data-model.md)
- [NFTs](/ka/blockchain/nfts.md)
