---
translation_locale: ka
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# აქტივები {#assets}

Iroha აქტივი არის რიცხვობრივი ბალანსი, რომელიც ფუნქციონირებს ანგარიშში. თითოეული კონკრეტული ბალანზი მიუთითებს `AssetDefinition`, და განსაზღვრება აღწერს, თუ როგორ შეიძლება ამ აქტივის დასახელება, დამონტაჟება, ჩვენება და გაყოფილია.

## აქტივების განსაზღვრა {#asset-definition}

`AssetDefinition` შეიცავს:

- `id`: ქანონიკური აქტივების განსაზღვრის მისამართი
- `name`: ადამიანის მიერ წაკითხული გამოსახულების სახელწოდება
- `description`: ავარიული აღწერა, რომელიც ადამიანისათვის წაკითხულია
- `alias`: ფორმით `<name>#<domain>.<dataspace>` ან `<name>#<dataspace>` წარსული ალექსანდრე
- `spec`: ციფრული სიზუსტე და წონასწორობის შეზღუდვები
- `mintable`: მინაგებობის პოლიტიკა
- `logo`: არასწორია `SoraFS` URI
- `metadata`: საკვანძო მნიშვნელობის თვითნებური მეტა მონაცემები.
- `balance_scope_policy`: არის თუ არა ბალანსები გლობალური ან მონაცემთა სივრცეში შეზღუდული;
- `owned_by`: ანგარიში, რომელმაც დაარეგისტრირა ან ფლობს განსაზღვრას
- `total_quantity`: გამოშვებული საერთო რაოდენობა
- `confidential_policy`: დაცული აქტივების ოპერაციების პოლიტიკა

აქტივების განსაზღვრა IDs არის კანონიკური არაგამჭვირვალე მისამართები. როდესაც განსაზღვრება აშენდება დომენიდან და სახელისგან, Iroha შეუძლია შეინახოს ეს დომენი / სახელი პროექცია UX და გამოკითხვები, მაგრამ კანონიკური ტექსტის ფორმა წარმოქმნილი მისამართია.

## ქონების ბალანსი {#asset-balance}

`Asset` შეიცავს:

- `id`: `AssetId`, რომელიც აერთიანებს აქტივების განსაზღვრას, მფლობელის ანგარიშს და ვარიანტური ბალანსის მოქმედების სფეროს
- `value`: ბალანსი `Numeric`

ანგარიშის მფლობელი კანონიკური და დომენის გარეშეა. აქტივების განსაზღვრა შეიძლება პროგნოზირდეს მონაცემთა სივრცე-კვალიფიციური დომენის ქვეშ, მაგალითად `payments.universal`.

## სათამაშოები {#mintability}

ქონების განსაზღვრები მხარს უჭერს ამ მოდებს mintability:

|რეჟიმი |მნიშვნელობა |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |ეალასტიკური მიწოდება. აქტივს შეუძლია განმეორებით დააბრუნოს და წვას. |
|`Once` |ფსკრაჟთრვ ოპვრთრთნწ, მჲზვ ეა ჟვ ნაოპაგწრ თ კაჱგაქ.|
|`Not` |მუდმივი მიწოდების სიმბოლო, რომელიც შეიძლება დაიწვას, მაგრამ არ გადახდეს ისევ.|
|`Limited(n)` |პოლიტიკა საშუალებას იძლევა ახალი აქტივების ერთეულების გამოშვება დამატებითი ოპერაციების შეზღუდულ რაოდენობაში. |

გამოიყენეთ `Infinitely` ნორმალური ელასტიკური აქტივებისათვის და `Once` ან `Limited(n)` ფიქსირებული მიწოდების ან შეზღუდული მიწოდების აქტივებისთვის. არ გამოიყენოთ `Not` როგორც საწყისი პოლიტიკა, თუ აქტივების მიწოდება უკვე არ არის დადგენილი.

## ბალანსის მოცულობა {#balance-scope}

`balance_scope_policy` აკონტროლებს, თუ როგორ ხდება ბალანდების ჩაკეტვა:

- `Global`: ერთი ბალანსი ქვაბით ანგარიშზე და აქტივების განსაზღვრაზე
- `DataspaceRestricted`: ანგარიშსწორებები დაყოფილია მონაცემთა სივრცის კონტექსტით.

მონაცემთა სივრცეზე შეზღუდული ბალანსი სასარგებლოა, როდესაც ერთსა და იმავე აქტივის განსაზღვრა გამოიყენება მრავალ Nexus მონაცემთა სფეროში, მაგრამ ბალანციები უნდა დარჩეს იზოლირებული.

## სცადეთ Taira {#try-it-on-taira}

ეს მხოლოდ წაკითხვის ზარები აჩვენებს რეალურ აქტივების განსაზღვრებს საჯარო Taira ტესტნეტზე:

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

მოძებნეთ დეფინიციები, რომლებიც ატარებენ მეტა მონაცემებს:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

სამივე მაგალითი წაკითხულია. Taira-ზე აქტივების დაფარვის, დამწვრობის ან ტრანსფერისათვის გამოიყენეთ საბანქეტით დაფინანსებული ანგარიში და დაცული ნაკადი [დაკავშირდით SORA Nexus მონაცემთა ბაზებზე](/ka/get-started/sora-nexus-dataspaces.md).

საფასურის გადახდისას Taira აქტივის მაგალითისთვის, შეინახეთ ქვაბის დამხმარე [Get Testnet XOR on Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) როგორც `taira_faucet_claim.py`, შემდეგ მოითხოვეთ ქვაბიანი აქტივი ჯერ და გამოიყენეთ იგი როგორც გზის ობიექტი ოპერაციაში:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

შემდეგ შეიყვანეთ `--metadata ./taira.tx-metadata.json` ბრძანებებზე `ledger asset mint`, `ledger asset burn` და `ledger asset transfer`.

## ინსტრუქციები {#instructions}

ქონების რეგისტრაცია, დამზადება, წვის და გადაცემა შესაძლებელია Iroha სპეციალური ინსტრუქციით:

- [`Register` და `Unregister`](/ka/blockchain/instructions.md#un-register)
- [`Mint` და `Burn`](/ka/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ka/blockchain/instructions.md#transfer)
- [`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue)

იხილეთ ასევე:

- [CLI სახელმძღვანელო](/ka/get-started/operate-iroha-via-cli.md)
- [Rust სახელმძღვანელო](/ka/guide/tutorials/rust.md)
- [Python სახელმძღვანელო](/ka/guide/tutorials/python.md)
- [JavaScript/TypeScript სახელმძღვანელო](/ka/guide/tutorials/javascript.md)
- [მონაცემთა მოდელი](/ka/blockchain/data-model.md)
- [NFTs](/ka/blockchain/nfts.md)
