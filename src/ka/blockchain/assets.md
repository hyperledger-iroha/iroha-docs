---
translation_locale: ka
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# აქტივები {#assets}

ან Iroha ქონება არის რიცხვობრივი ბალანსი, რომელსაც ანგარიში ინახავს.
ბალანსი მიუთითებს `AssetDefinition`, და განსაზღვრა აღწერს, თუ როგორ
ეს აქტივი შეიძლება დასახელდეს, გაფორმდეს, გამოითვალოს და გაიყოს.

## აქტივების განსაზღვრა {#asset-definition}

ან `AssetDefinition` შეიცავს:

- `id`: კანონიკური აქტივების განსაზღვრის მისამართი
- `name`: ადამიანის მიერ წაკითხული გამოსახულების სახელი
- `description`: ადამიანის მიერ გასაკვირი განმარტება
- `alias`: ნომერები `<name>#<domain>.<dataspace>` ან
  `<name>#<dataspace>` ფორმა
- `spec`: ციფრული სიზუსტე და საწონასწოროების შეზღუდვები
- `mintable`: მენეგატიურობის პოლიტიკა
- `logo`: ნებაყოფლობით `SoraFS` URI
- `metadata`: ნებაყოფლობითი საკვანძო ღირებულების მეტა მონაცემები
- `balance_scope_policy`: არის თუ არა ბალანსი გლობალური ან
  მონაცემთა სივრცის შეზღუდვა
- `owned_by`: ანგარიში, რომელმაც დარეგისტრირა ან ფლობს განსაზღვრა
- `total_quantity`: გამოშვებული რაოდენობის საერთო რაოდენობა
- `confidential_policy`: დაცული აქტივების ოპერაციების პოლიტიკა

აქტივების განსაზღვრა IDs არის კანონიკური არაპროკაზმული მისამართები. როდესაც განსაზღვრა
შექმნილია დომენისა და სახელის მიხედვით, Iroha შეუძლია შეინარჩუნოს ეს დომენი/სახელი
პროექტირება UX და კითხვები, მაგრამ კანონიკური ტექსტის ფორმა არის წარმოქმნილი
მისამართი.

## აქტივების ბალანსი {#asset-balance}

ან `Asset` შეიცავს:

- `id`: დასახელება `AssetId`, რომელიც აერთიანებს აქტივების განსაზღვრას, მფლობელის ანგარიშს;
  და ვარიანტური ბალანსის მოცულობა
- `value`: ბ) `Numeric` ბალანსი

მფლობელის ანგარიში კანონიკური და დომენის გარეშეა. აქტივების განსაზღვრა შეიძლება იყოს:
მონაცემთა სივრცე-კვალიფიციური დომენის ფარგლებში პროექტირებული, მაგალითად
`payments.universal`.

## სათამაშოები {#mintability}

ქონების განსაზღვრები მხარს უჭერს ამ მოდებს mintability:

| რეჟიმი         | მნიშვნელობა                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | ეალასტიკური მიწოდება. აქტივს შეუძლია განმეორებით დაწვა და დამუშავება.    |
| `Once`       | ფსკვნთჟკთრვ ჟჲპნთწ, მჲზვ ეა ჟვ ნაოპაგნვ ჲე კჲდარჲ გპვმვ ეა დჲ ოჲბყპნა.        |
| `Not`        | მუდმივი მიწოდების ტოკი, რომელიც შეიძლება დაიწვას, მაგრამ არ გადახდეს.       |
| `Limited(n)` | სათამაშოების მოწყობა ნებადართულია დამატებითი ოპერაციების შეზღუდული რაოდენობისათვის. |

გამოყენება `Infinitely` ნორმალური ელასტიკური აქტივებისათვის და `Once` ან `Limited(n)` სამედიცინო
მუდმივი ან შეზღუდული მიწოდების აქტივები. არ გამოიყენოს `Not` როგორც დასაწყისი
პოლიტიკა, თუ აქტივების მიწოდება უკვე არ არის დადგენილი.

## ბალანსის მოცულობა {#balance-scope}

სააგენტო `balance_scope_policy` კონტროლებს, თუ როგორ ხდება ბალანშების ჩაკეტვა:

- `Global`: ერთი ბალანსის ქვაბი ანგარიშზე და აქტივების განსაზღვრაზე
- `DataspaceRestricted`: ბალანსი განკუთვნილია მონაცემთა სივრცის კონტექსტით

მონაცემთა სივრცეზე შეზღუდული სალონები სასარგებლოა, როდესაც იგივე აქტივის განსაზღვრა
გამოყენებულია მრავალჯერადი Nexus მონაცემთა სივრცეები, მაგრამ ბალანსი უნდა დარჩეს იზოლირებული.

## სცადე. Taira {#try-it-on-taira}

ეს მხოლოდ წაკითხვის ზარები აჩვენებს რეალურ აქტივების განსაზღვრას საზოგადოებაზე Taira სატესტო ქსელი:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

მოძებნეთ მიმდინარეობა Taira XOR საფასური აქტივების განსაზღვრა:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ეძებეთ განმარტებები, რომლებიც შეიცავს მეტა მონაცემებს:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

სამივე მაგალითი წაკითხულია. Taira, გამოყენება a
საბანკო ფინანსური ანგარიში და დაცული ნაკადი
[შეხება SORA Nexus მონაცემთა ბაზები](/ka/get-started/sora-nexus-dataspaces.md).

საფასურის გადახდისთვის Taira აქტივის მაგალითი, შეინახეთ საფანელის დამხმარე
[მიიღეთ Testnet XOR დაწვრილებით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
როგორც `taira_faucet_claim.py`, შემდეგ მოითხოვეთ საბანქის აქტივი და გამოიყენეთ იგი როგორც
ტრანზაქციული გაზის აქტივი:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

მაშინ შეავსეთ `--metadata ./taira.tx-metadata.json` დაწვრილებით `ledger asset mint`,
`ledger asset burn`, და `ledger asset transfer` ოპვრთნაჲ.

## ინსტრუქციები {#instructions}

ქონება შეიძლება დარეგისტრირდეს, გადახდოს, დაიწვას და გადაიტანოს Iroha
სპეციალური ინსტრუქციები:

- [`Register` და `Unregister`](/ka/blockchain/instructions.md#un-register)
- [`Mint` და `Burn`](/ka/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ka/blockchain/instructions.md#transfer)
- [`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue)

იხილეთ ასევე:

- [CLI სახელმძღვანელო](/ka/get-started/operate-iroha-via-cli.md)
- [Rust გაკვეთილი](/ka/guide/tutorials/rust.md)
- [Python გაკვეთილი](/ka/guide/tutorials/python.md)
- [JavaScript/TypeScript გაკვეთილი](/ka/guide/tutorials/javascript.md)
- [მონაცემთა მოდელი](/ka/blockchain/data-model.md)
- [NFTs](/ka/blockchain/nfts.md)
