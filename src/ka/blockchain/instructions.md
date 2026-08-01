---
translation_locale: ka
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha სპეციალური ინსტრუქციები {#iroha-special-instructions}

როდესაც ჩვენ ვისაუბრეთ [როგორ Iroha ოპერირებს](/ka/blockchain/iroha-explained), ვთქვით, რომ Iroha სპეციალიზებული ინსტრუქციები არის ერთადერთი გზა მსოფლიო სახელმწიფოს შეცვლისთვის. რა სახის სპეციალური ინსტრუქციები გვაქვს? თუ წაიკითხეთ ენის სპეციფიკური სახელმძღვანელოები ამ გაკვეთილში, თქვენ უკვე ნახეთ რამდენიმე ინსტრუქცია: `Register<Account>` და `Mint<Numeric>`.

Iroha სპეციალური ინსტრუქციის სრული ჩამონათვალი:

|ინსტრუქცია |აღწერილობა |
| --------------------------------------------------------- | ------------------------------------------------ |
| [რეგისტრაცია/გადარეგისტრირება](#un-register) |გადმოეცით ID ახალ ეთენტს ბლოკჩეინზე. |
| [მინა/ბერნი](#mint-burn) |Mint/burn ციფრული აქტივები ან გააქტიურება განმეორებები. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |ბლოკჩეინ-ს ობიექტების მეტა მონაცემები განახლება.|
| [SetParameter](#setparameter) |აწესრიგეთ ქსელის ფართო პარამეტრი. |
| [დაფინანსება/გამოწვევა](#grant-revoke) |მისცეს ან ამოიღოს ნებართვები და როლები. |
| [გადაცემა](#transfer) |გადარიცხვა საკუთრების ან აქტივების ღირებულების. |
| [ნაციონალური საფინანსო და აქტივების ჩაკეტვა](#native-escrow-and-asset-locks) |ნომერული აქტივების ჩაკეტვა პროტოკოლით. |
| [ExecuteTrigger](#executetrigger) |ვ თჱდლვზექ ჟრანთრვ.|
| [რეგისტრაცია/ჩვეულებრივი წესები/განახლება](#other-instructions)|ჟანრი, გაგრძელება ან განახლება runtime ქცევა. |

დავიწყოთ Iroha სპეციალური ინსტრუქციების შეჯამებით; რა ობიექტები შეიძლება მოითხოვოს თითოეული ინსტრუქცია და რა ინსტრუქციის ხელმისაწვდომია თითოეულ ობიექტისთვის.

## შეჯამება {#summary}

თითოეული ინსტრუქციისათვის არსებობს ობიექტების ჩამონათვალი, რომელზეც ეს ინსტრუქცია შეიძლება შესრულდეს. მაგალითად, გადაცემის ვარიანტები მოიცავს საკუთრებაში არსებულ ლიდერის ობიექტებსა და ციფრულ აქტივებს, ხოლო მონტირება მოიცავს ციფრული აქტივებს და იწვევს განმეორებას.

ზოგიერთი ინსტრუქცია მოითხოვს დანიშნულების მითითებას. მაგალითად, თუ აქტივები გადარიცხავთ, ყოველთვის უნდა მიუთითოთ, რომელ ანგარიშზე გადარიცხავენ ისინი. მეორე მხრივ, როდესაც რაღაცას რეგისტრირებთ, მხოლოდ ის ობიექტი გჭირდებათ, რომელიც გსურთ რეგისტრაცია.

|ინსტრუქცია |ობიექტები|დანიშნულება |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |ჩვეულებრივი დომენი, მონაცემთა სივრცის ანალიზი და ანგარიშის ანალიზის აწყობა |                      |
| [რეგისტრაცია/გადარეგისტრირება](#un-register) |ანგარიშები, აქტივების განსაზღვრება, NFTs, როლები, მატჩები, თანატოლები; დომენის მოხსნა |                      |
| [მინა/ბერნი](#mint-burn) |ციფრული აქტივები, გააქტიურება განმეორებები |ანგარიშები ან გამომწვევები |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |ობიექტები, რომლებსაც აქვთ [მეტodata](./metadata.md): დომენები, ანგარიშები, აქტივების განმარტებები, NFTs, RWAs, გამომწვევი |                      |
| [SetParameter](#setparameter) |ქსელის პარამეტრები |                      |
| [დაფინანსება/გამოწვევა](#grant-revoke) | [როლები, ნებართვის ნიშნები ](/ka/blockchain/permissions.md) |ანგარიშები ან როლები |
| [გადაცემა](#transfer) |დომენები, აქტივების განმარტებები, ციფრული აქტივები, NFTs |ანგარიშები |
| [ნაციონალური საფინანსო და აქტივების ჩაკეტვა](#native-escrow-and-asset-locks) |ნომერული აქტივების დაფარვა, აქტივების ჩაკეტვა, ანონიმური დაფარვის ვალდებულებები |მყიდველები, მიმართულებები ან სადავო განხეთქილება |
| [ExecuteTrigger](#executetrigger) |ტრიგერები |                      |
| [რეგისტრაცია/ჩვეულებრივი წესები/განახლება](#other-instructions)|ჩანაწერები, აღსრულების სპეციფიკური სასარგებლო ტვირთები, აღმასრულებელი განახლება |                      |

ასევე არსებობს ISI -ის შესწავლის სხვა გზა, მათ მიერ შეხების მთავარობის ობიექტის მიხედვით:

|მიზანი |ინსტრუქცია |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|ანგარიში |ანგარიშების რეგისტრაცია/გადარეგისტრირება, აქტივების მიღება, ანგარიშის განახლების მეტა მონაცემები, ნებართვის მინიჭება/მოხსნა და როლები |
|დომენი |უზრუნველყოს დომენის დაყენება, არარეგისტრირდეს დომენები, გადაიტანოს დომენის მფლობელობა, განაახლოს დომენის მეტა მონაცემები |
|აქტივების განსაზღვრა |რეგისტრაციის/რეგისტრაციის გაუქმების განმარტებები, საკუთრების გადაცემა, მეტადატატის განახლება |
|აქტივები |ნომერული რაოდენობა, გადაცემის რაოდენობა |
|საფინანსო |გახსნა, მიღება, გადახდის აღნიშვნა გამოგზავნილი, გათავისუფლება, გაუქმება, დავები, გადაწყვეტა, ჩამოტვირთვა ან ამოწურულია მშობლიური აღკვეთის დოკუმენტები |
|NFT |რეგისტრაცია/გადარეგისტრირება NFTs, საკუთრების გადაცემა, მეტადატობის განახლება |
|RWA |რეგისტრაცია პარტიების, გადაცემის რაოდენობა, შენახვა/გადაშვება, გაყინვა/გაყინვის გაუქმება, შეძენა, გაერთიანება, მეტა მონაცემების განახლება და კონტროლი |
|ტრიგერი |რეგისტრაცია/გადარეგისტრირება, მეტყველების განმეორება/დამწვრობა, განხორციელება, განახლება. |
|მსოფლიო |რეგისტრირება/რეგისტრირების გაუქმება თანატოლებისა და როლების, პარამეტრების დადგენა, აღმასრულებლის განახლება |

## CLI მაგალითები {#cli-examples}

ამ გვერდზე მოცემული მაგალითები ითვალისწინებს, რომ თქვენ აწარმოებთ ბრძანებებს upstream Iroha სამუშაო სივრცედან ადგილობრივი კლიენტის ჩვეულებრივი კონფიგურაციის წინააღმდეგ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

თუ თქვენ დააინსტალირეთ `iroha` ბინარი, გამოიყენეთ `iroha --config ./defaults/client.toml` ამის ნაცვლად. შეცვალეთ ქვემოთ მოცემული ადგილის მფლობელები თქვენი ქსელის მნიშვნელობებით:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

საჯარო Taira ტესტნეტის მიმართვისას გამოიყენეთ Taira კლიენტის კონფიგურაცია. გადასახადის გადახდის მაგალითების ჩატარებამდე, შეინახეთ ქვაბის დამხმარე [გან. მიიღეთ Testnet XOR Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) როგორც `taira_faucet_claim.py`, შემდეგ მოითხოვეთ testnet XOR ქვაბიდან:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

მას შემდეგ, რაც საბანქის მიერ დაფინანსებული აქტივი ხილული იქნება, მოითხოვეთ გაზის აქტივების მეტა მონაცემები, რათა ჩაწეროთ ტრანზაქცია:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` არის ჩვეულებრივი პირველი გამოშვების გზა დომენების შექმნისა და მათი SNS იჯარის ხელშეკრულებისთვის. იგი დეკლარაციურად აკავშირებს ზუსტ მონაცემთა სივრცეს, მფლობელს, ლიზინგს ტერმინი, და ციტირების დაცვა, შემდეგ ქმნის ან შეკეთებს ყველა საჭირო მდგომარეობა ატომურად. გამოიყენეთ ავთენტიფიცირებული `POST /v1/aliases/setup/plan` საბოლოო წერტილი ან შესაბამისი CLI სამუშაო პროცესის:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

განზრახვა და გეგმა არ არის საიდუმლო, მაგრამ მოქმედებს ნაბიჯების ნიშნები და წარადგენს ჩვეულებრივ ტრანზაქციას კონფიგურირებული ანგარიშით. გეგმა არის დაკავშირებული მისი ჯაჭვი, ავტორიტეტი, ცოცხალი სახელმწიფოს ანკერი და ვადია; არასოდეს გამოიყენოთ ერთი სხვა ქსელზე .

## (Un) რეგისტრაცია {#un-register}

რეგისტრაცია და არარეგისტრირება არის ინსტრუქციები, რომლებიც გამოიყენება ID-ის მისაცემად ახალ სუბიექტს ბლოკჩეინზე.

ყველაფერი, რაც შეიძლება დარეგისტრირდეს არის როგორც `Registrable` და `Identifiable`, მაგრამ არა ყველაფერი, რაც არის `Identifiable` არის `Registrable`. უმეტესობა რამ არის რეგისტრირებული უშუალოდ, მაგრამ ზოგიერთ შემთხვევაში წარმოდგენა ბლოკჩეინში ბევრად მეტი მონაცემები აქვს. უსაფრთხოებისა და შესრულების მიზეზების გამო, ჩვენ ვიყენებთ კონსტრუქციონერებს ასეთი მონაცემთა სტრუქტურებისთვის (მაგალითად, `NewAccount`), ხოლო თანატოლთა რეგისტრაციას აქვს სპეციალური მტკიცებულება საკუთრების შესახებ ინსტრუქცია. როგორც წესი, ყველაფერი, რაც შეიძლება რეგისტრირდეს, ასევე შეიძლება იყოს არარეგისტრირებული, მაგრამ ეს რთული და სწრაფი წესი არაა.

თქვენ შეგიძლიათ დარეგისტრიროთ ანგარიშები, აქტივების განსაზღვრები, NFTs, თანატოლები, როლები და გამომწვევები. დომენის კონფიგურაცია იყენებს `EnsureAlias`; ნედლეული `Register::Domain` სასარგებლო ტვირთი არის გათვალისწინებული genesis / bootstrap- ისთვის. პარტნიორის რეგისტრაცია იყენებს `RegisterPeerWithPop`, რომელიც თანახმა გასაღების ფლობის მტკიცებულებას ატარებს. შეამოწმეთ ჩვენი [ სახელწოდების კონვენციები](/ka/reference/naming.md), რათა გაეცნოთ ორგანიზაციის სახელებზე დაწესებული შეზღუდვების შესახებ.

RWA პარტიები შექმნილია სპეციალური `RegisterRwa` ინსტრუქციის მეშვეობით. მიმდინარე კოდი არ გამოხატავს `UnregisterRwa` ინსტრუქციას; გამოიყენეთ `RedeemRwa` წარმოდგენილი რაოდენობის გასაუქმებლად.

::: info

გაითვალისწინეთ, რომ იმის მიხედვით, თუ როგორ გადაწყვეტთ დააყენოთ თქვენი [გენეზის ბლოკი](/ka/guide/configure/genesis.md) `genesis.json` (კერძოდ, შეიცავს თუ არა თქვენ რეგისტრაცია ნებართვის ნიშნები), პროცესი ანგარიშის რეგისტრაციის შეიძლება იყოს ძალიან განსხვავებული. ზოგადად, ჩვენ შეგვიძლია შევაჯამოთ იგი ასე:

- საჯარო ბლოკჩეინში, ნებისმიერ ადამიანს უნდა შეეძლოს ანგარიშის რეგისტრაცია.
- კერძო ბლოკჩეინში შეიძლება არსებობდეს ანგარიშების რეგისტრაციის უნიკალური პროცესი. ჩვეულებრივ კერძო blockchain-ში, ანუ ბლოკშეინში, სადაც არ არსებობს რაიმე უნიკალური პროცესები ანგარიშების დარეგისტრირებისთვის, საჭიროა ანგარიში სხვა ანგარიშის რეგისტრაციისთვის.

ჩვენ ვსაუბრობთ ამ განსხვავებების შესახებ ძალიან დეტალურად, როდესაც [ შევადარებთ კერძო და საჯარო ბლოკჩეინებს ](/ka/guide/configure/modes.md).

:::

::: info

თანატოლების რეგისტრაცია ამჟამად ერთადერთი საშუალებაა, რომ ქსელში დაამატოთ თანატოლები, რომლებიც არ იყვნენ ნდობისთვის განკუთვნილი თავდაპირველი პარტნიორის ნაწილი.

:::

გამოიყენეთ ენის სპეციფიკური სახელმძღვანელო ბლოკჩეინის ობიექტების რეგისტრაციისთვის:

|ენა |სახელმძღვანელო |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |გამოიყენეთ [Iroha CLI](/ka/get-started/operate-iroha-via-cli.md) დომენების დასამუშავებლად და ანგარიშებისა და აქტივების რეგისტრაციისთვის. |
|Rust |გამოიყენეთ [Rust სახელმძღვანელო](/ka/guide/tutorials/rust.md). |
|Kotlin/Java |გამოიყენეთ [Kotlin/Java სახელმძღვანელო](/ka/guide/tutorials/kotlin-java.md). |
|Python |გამოიყენეთ [Python სახელმძღვანელო](/ka/guide/tutorials/python.md). |
|JavaScript/TypeScript |გამოიყენეთ [JavaScript/TypeScript სახელმძღვანელო ](/ka/guide/tutorials/javascript.md). |

დაგეგმეთ და გამოიყენეთ ჩვეულებრივი დომენის კონფიგურაცია, შემდეგ დაარეგისტრირეთ დომენი, როდესაც ის აღარ არის საჭირო:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

რეგისტრირებული ან არარეგისტრირებელი ანგარიშები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

დარეგისტრირებული და არარეგისტრირებელი აქტივების განსაზღვრები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

რეგისტრაცია და არარეგისტრირება NFTs. NFT-ის რეგისტრაციის შინაარსი JSON იკითხება სტანდარტული შეყვანიდან:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

რეგისტრირებისა და არარეგისტრირების როლები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

რეგისტრირება და არარეგისტრირების გამომწვევი. გამოშვების რეგისტრაციისთვის საჭიროა ან შედგენილი IVM ბაიტო კოდი, ან სერიალიზებული ინსტრუქციის სია. ეს მაგალითი აშენებს `Log` ინსტრუქციას CLI-ით და მიჰყავს მას გამომწვევი რეგისტრაციაში.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

რეგისტრირება და არარეგისტრირების პარტნიორები. გენერაცია BLS გასაღები და PoP ერთად `kagami`, თუ თქვენ ჯერ კიდევ არ გაქვთ ისინი:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## მენტა/ბერნი {#mint-burn}

ფუნტირება და დამწვრობა შეიძლება გულისხმობდეს ციფრულ აქტივებსა და გამოწვევებს შეზღუდული რაოდენობის განმეორებით. ზოგიერთი აქტივი შეიძლება დეკლარირდეს როგორც არაფუნტული, რაც იმას ნიშნავს, რომ ისინი მხოლოდ ერთხელ შეიძლება დაიდოს რეგისტრაციის შემდეგ.

ქონება იწერება კონკრეტულ ანგარიშზე, ჩვეულებრივ ისეთზე, სადაც აქტივი რეგისტრირებულია. აქტივების რაოდენობა არ არის ნეგატიური, ასე რომ თქვენ ვერასდროს შეგიძლიათ `$-1.0` აქტივი ან წვას უარყოფითი თანხა და მიიღოს mint.

გამოიყენეთ ენის სპეციფიკური სახელმძღვანელო ბლოკჩეინის აქტივებისთვის:

- [CLI](/ka/get-started/operate-iroha-via-cli.md)
- [Rust](/ka/guide/tutorials/rust.md)
- [Kotlin/Java](/ka/guide/tutorials/kotlin-java.md)
- [Python](/ka/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ka/guide/tutorials/javascript.md)

აქ მოცემულია ქონების დამწვარი მაგალითები:

- [CLI](/ka/get-started/operate-iroha-via-cli.md)
- [Rust](/ka/guide/tutorials/rust.md)

ნომერული აქტივები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

ტრიგერების განმეორება mint და burn:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## გადარიცხვა {#transfer}

გენერული გადარიცხვის ვარიანტები მოიცავს დომინებს, აქტივების დეფინიციებს, ციფრულ აქტივებს და NFTs. RWA რაოდენობის მოძრაობა იყენებს სპეციალურ `TransferRwa` და `ForceTransferRwa` ინსტრუქციებს, რომლებიც აღწერილია [ რეალური სამყაროს აქტივებში](/ka/blockchain/rwas.md) .

ამისათვის, ანგარიშსწორება უნდა გაიწიოს [აქტივების გადაცემის ნებართვა](/ka/reference/permissions.md). მიუთითეთ მაგალითზე, თუ როგორ უნდა გადაიხადოს აქტივები [CLI](/ka/get-started/operate-iroha-via-cli.md) ან [Rust](/ka/guide/tutorials/rust.md).

ციფრული აქტივების გადარიცხვა:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

სატრანსფერო დომენი, აქტივების განსაზღვრა და NFT საკუთრება:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Native Escrow და Asset Lock-ები {#native-escrow-and-asset-locks}

Native escrow instructions lock numeric assets in ledger-managed protocol custody. ისინი გამოიყენება ბაზრის სტილის დაფარვისთვის, ზოგადი აქტივების საკეტებისთვის და ანონიმური დაცული escrow ნაკადებისათვის.

საბაზრო საფარდების გამოყენება `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, და `ResolveEscrowDispute`. ზოგადი აქტივების ჩაკეტვის გამოყენება `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, და `ExpireAssetLock`. Anonymous escrow ასახავს ბაზრის სიცოცხლის ციკლს `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, და `ResolveAnonymousEscrowDispute`.

ესენი ISIs ამჟამად არ აქვს პირველი კლასის CLI ბრძანებები. გამოიყენეთ typed SDK მშენებლები ან სერიალიზებული ინსტრუქციის სასარგებლო ტვირთები, და იხილეთ [ნაციონალური აქტივების დაფარვა](/ka/blockchain/escrow.md) სიცოცხლის ციკლის დეტალების, ნებართვების, გამოკითხვების, მოვლენებისათვის და Rust მაგალითები.

## დაფინანსება/შეღავათი {#grant-revoke}

გაცემის და მოხსნის ინსტრუქციები გამოიყენება ანგარიშზე [ ნებართვებისა და როლებისათვის ](permissions.md).

`Grant` გამოიყენება მუდმივად მომხმარებლისთვის ან ერთი ნებართვის მისაცემად, ან ნებართვების ჯგუფის ("როლი"). მინიჭებული როლები და ნებართვები შეიძლება ამოღებულ იქნას მხოლოდ `Revoke` ინსტრუქციის მეშვეობით. როგორც ასეთი, ეს ინსტრუქციები უნდა იყოს გამოყენებული ფრთხილად.

გაცემა და მოხსნა როლი ანგარიშზე:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

ნებართვების მინიჭება და გაუქმება. ნებართვის ბრძანებები კითხულობს ნებართვების ობიექტს სტანდარტული შეყვანისგან:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

როლზე ნებართვის მინიჭება და მოხსნა:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

ეს ინსტრუქციები განახორციელებს ობიექტის [ მეტა მონაცემების](/ka/blockchain/metadata.md) განახლებას. გამოიყენეთ `SetKeyValue` მეტა მონაცემთა შესასვლელად ან შეცვლისთვის და `RemoveKeyValue` მათ წაშლისათვის.

Metadata `set` ბრძანებები კითხულობს JSON ღირებულებას სტანდარტული შესასვლელიდან:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

იგივე ნიმუშია ხელმისაწვდომი ანგარიშებისათვის, აქტივების განსაზღვრისთვის NFTs, RWAs და გამომწვევი ფაქტორებისთვის:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` ცვლის ქსელის მასშტაბური პარამეტრები, რომლებიც აქტიური მონაცემების მოდელის და აღმასრულებლის მიერ არის გამოხატული.

პარამეტრის დაყენება ერთი პარამეტრიანი JSON ობიექტის ჩაბარებით სტანდარტულ შესასვლელში:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

აღნიშნული ინსტრუქცია გამოიყენება [ ტრიგერების ](./triggers.md) შესრულებისთვის.

CLI შეუძლია დაარეგისტრიროს გამოწვევები და გამოიწეროს გამოწვევის შესრულების მოვლენები პირდაპირ. იგი არ უზრუნველყოფს `execute trigger` ბრძანება, ასე რომ წარადგინეთ სახელმძღვანელო `ExecuteTrigger` ინსტრუქცია, წარმოქმნას სერიალიზებული `InstructionBox` SDK ან აღმასრულებელი ინსტრუმენტით და გადასცეს შედეგად მიღებული JSON მასაჟი `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## სხვა ინსტრუქციები {#other-instructions}

Iroha ასევე ასახავს უფრო დაბალი დონის ინსტრუქციებს გაშვების დროისა და აღსრულების ინტეგრაციის შესახებ:

- `Log`: განხორციელებისას გამოუშვას ჩანაწერი.
- `CustomInstruction`: გადაადგილება აღმასრულებლისთვის სპეციფიური JSON სასარგებლო ტვირთები
- `Upgrade`: გააქტიურეთ აღსრულების განახლება

წარადგინეთ ინსტრუქცია `Log` პინგის დამხმარე პირთან:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

წარადგინეთ განკუთვნილი აღმასრულებლის ინსტრუქცია სერიალიზებული `InstructionBox`. სასარგებლო ტვირთის ფორმა არის აღმასრულებელი სპეციფიკური, ასე რომ წარმოქმნას ინსტრუქციას შეესაბამება SDK ან აღმასრულებელ ინსტრუმენტის:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

განახლება აღმასრულებელი კომპილიზებული IVM ბაიტო კოდის ფაილიდან:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
