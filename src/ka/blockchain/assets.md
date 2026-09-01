---
translation_locale: ka
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
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
- `balance_scope_policy`: არის თუ არა ბალანსები გლობალური ან მონაცემთა სივრცეში შეზღუდული;
- `owned_by`: ანგარიში, რომელმაც დაარეგისტრირა ან ფლობს განსაზღვრას
- `total_quantity`: გამოშვებული საერთო რაოდენობა
- `confidential_policy`: დაცული აქტივების ოპერაციების პოლიტიკა

აქტივების განსაზღვრის ID-ები არის კანონიკური არაგამჭვირვალე მისამართები. როდესაც განსაზღვრება აშენებულია დომენიდან და სახელით, Iroha შეუძლია შეინახოს ეს დომენი / სახელის პროექცია UX და მოთხოვნები, მაგრამ კანონიკური ტექსტის ფორმა წარმოქმნილია მისამართი .

## ქონების ბალანსი {#asset-balance}

`Asset` შეიცავს:

- `id`: `AssetId`, რომელიც აერთიანებს აქტივების განსაზღვრას, მფლობელის ანგარიშს და ვალუტის ბალანსის ვარიანტს.
- `value`: ბალანსი `Numeric`

ანგარიშის მფლობელი არის კანონიკური და დომენების გარეშე. აქტივების განსაზღვრა შეიძლება იყოს პროექტირებული მონაცემთა სივრცე-კვალიფიციური დომენის ქვეშ, მაგალითად `payments.universal`.

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
- `DataspaceRestricted`: ანგარიშსწორებები დაყოფილია მონაცემთა სივრცის კონტექსტით.

მონაცემთა სივრცეზე შეზღუდული ბალანსი სასარგებლოა, როდესაც ერთსა და იმავე აქტივის განსაზღვრა გამოიყენება მრავალ Nexus მონაცემთა სფეროში, მაგრამ ბალანციები უნდა დარჩეს იზოლირებული.

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

სამივე მაგალითი წაკითხულია. Taira-ზე აქტივების გამოსაცემად, განადგურებისთვის ან გადასატანისთვის გამოიყენეთ ტესტნეტის მიერ დაფინანსებული ანგარიში და დაცული ნაკადი [დაკავშირება SORA Nexus მონაცემთა სივრცეებთან](/ka/get-started/sora-nexus-dataspaces.md).

Taira-ზე საკომისიოს გადამხდელი აქტივის მაგალითისთვის [Taira-ზე სატესტო XOR-ის მიღების](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) დამხმარე სკრიპტი შეინახეთ როგორც `taira_faucet_claim.py`, ჯერ გამცემიდან მოითხოვეთ აქტივი და შემდეგ ის ტრანზაქციის შესრულების საკომისიო აქტივად გამოიყენეთ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

შემდეგ შეიყვანეთ `--metadata ./taira.tx-metadata.json` ბრძანებებზე `ledger asset mint`, `ledger asset burn` და `ledger asset transfer`.

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
