---
translation_locale: ka
translation_source: /blockchain/instructions.md
translation_source_hash: 86d253317376ad8d7a8c0e30689c7e0c0cd786af83299dd5ac1a904c653192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha ინსტრუქციის ოპერაციები {#iroha-special-instructions}

როდესაც [როგორ მუშაობს Iroha](/ka/blockchain/iroha-explained)-ზე ვისაუბრეთ, ჩვენ ვთქვით, რომ Iroha ინსტრუქციის ოპერაციები ერთადერთი გზაა მსოფლიო მდგომარეობის შეცვლისთვის. თუ წაიკითხეთ ამ სახელმძღვანელოში მოცემული ენის სპეციფიკური სახელმძღვანელოები, თქვენ უკვე ნახეთ რამდენიმე ინსტრუქცია: `Register<Account>` და `Mint<Numeric>`.

აქ მოცემულია Iroha ინსტრუქციის ოპერაციების სრული სია:

|ინსტრუქცია |აღწერილობა |
| --------------------------------------------------------- | ------------------------------------------------ |
|[რეგისტრაცია/რეგისტრაციის გაუქმება](#un-register) |ბლოკჩეინზე ახალ სუბიექტს ID მიანიჭეთ.|
|[Mint/Burn](#mint-burn) |Mint/burn ციფრული აქტივები ან გააქტიურება განმეორებები. |
|[SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |ბლოკჩეინ-ის ობიექტების მეტამონაცემები განახლება.|
|[SetParameter](#setparameter) |აწესრიგეთ ქსელის ფართო პარამეტრი. |
|[Grant/Revoke](#grant-revoke) |მისცეს ან ამოიღოს ნებართვები და როლები. |
|[გადარიცხვა](#transfer) |გადარიცხვა საკუთრების ან აქტივების ღირებულების. |
|[ნაციონალური საფინანსო და აქტივების ჩაკეტვა](#native-escrow-and-asset-locks) |ნომერული აქტივების ჩაკეტვა პროტოკოლით. |
|[ატომური კერძო ანგარიშსწორება](#atomic-private-settlement) |მართეთ კონფიდენციალური პულები და ატომური პაკეტები. |
|[ExecuteTrigger](#executetrigger) |ტრიგერების შესრულება.|
|[Log/Custom/Upgrade](#other-instructions) |ჩანაწერი, გაფართოება ან განახლება შესრულების გარემოს ქცევა. |

დავიწყოთ Iroha ინსტრუქციის ოპერაციების შეჯამებით; რა ობიექტები შეიძლება დაიძახოს თითოეული ინსტრუქცია და რა ინსტრუქციები არის ხელმისაწვდომი თითოეულ ობიექტისთვის.

## შეჯამება {#summary}

თითოეული ინსტრუქციისათვის არსებობს ობიექტების ჩამონათვალი, რომელზეც ეს ინსტრუქცია შეიძლება განხორციელდეს. მაგალითად, გადაცემის ვარიანტები ფარავს ბლოკჩეინის რეესტრის ობიექტებისა და ციფრული აქტივების მფლობელობას, ხოლო გამოშვება ფარავს ციფრულ აქტივებს და ახდენს გამეორებას.

ზოგიერთი ინსტრუქცია მოითხოვს დანიშნულების მითითებას. მაგალითად, თუ აქტივები გადარიცხავთ, ყოველთვის უნდა მიუთითოთ, რომელ ანგარიშზე გადარიცხავენ ისინი. მეორე მხრივ, როდესაც რაღაცას რეგისტრირებთ, მხოლოდ ის ობიექტი გჭირდებათ, რომელიც გსურთ რეგისტრაცია.

|ინსტრუქცია |ობიექტები|დანიშნულება |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) | ჩვეულებრივი დომენის, მონაცემთა სივრცის ფსევდონიმისა და ანგარიშის ფსევდონიმის გამართვა | |
|[რეგისტრაცია/გადარეგისტრირება](#un-register) |ანგარიშები, აქტივების განსაზღვრება, NFTs, როლები, მატჩები, ქსელის კვანძები; დომენის მოხსნა |                      |
|[Mint/Burn](#mint-burn) |ციფრული აქტივები, გააქტიურება განმეორებები |ანგარიშები ან ტრიგერები |
|[SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |ობიექტები, რომლებსაც აქვთ [მეტამონაცემები](./metadata.md): დომენები, ანგარიშები, აქტივების განმარტებები, NFTs, RWAs, ტრიგერი |                      |
|[SetParameter](#setparameter) |ქსელის პარამეტრები |                      |
|[Grant/Revoke](#grant-revoke) |[როლები, ნებართვის ნიშნები](/ka/blockchain/permissions.md) |ანგარიშები ან როლები |
|[გადარიცხვა](#transfer) |დომენები, აქტივების განმარტებები, ციფრული აქტივები, NFTs |ანგარიშები |
|[ადგილობრივი ესქრო და აქტივების საკეტები](#native-escrow-and-asset-locks) |რიცხვითი აქტივების ესქროები, აქტივების საკეტები, პირობითი ესქროები |მყიდველები, დანიშნულების ანგარიშები ან დავის დროს თანხის განაწილება |
|[ატომური კერძო ფინანსური ოპერაციების ანგარიშსწორება](#atomic-private-settlement) |მარშრუტის მასშტაბით კონფიდენციალური პროტოკოლის მონაცემთა ჯგუფები, პოლიტიკის როტაციები, საბოლოო ბუნდები და გაწყვეტის მარკერები |                      |
|[ExecuteTrigger](#executetrigger) |ტრიგერები |                      |
|[Log/Custom/Upgrade](#other-instructions) |ჟურნალები, შემსრულებლისთვის სპეციფიკური დატვირთვები, შემსრულებლის განახლებები |                      |

ასევე არსებობს ISI შეხედვის სხვა გზა, რაც შეეხება ბლოკჩეინის რეესტრის ობიექტს, რომელსაც ისინი ეხებიან:

|მიზანი |ინსტრუქცია |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|ანგარიში |ანგარიშების რეგისტრაცია/გადარეგისტრირება, აქტივების მიღება, ანგარიშის განახლების მეტამონაცემები, ნებართვის მინიჭება/მოხსნა და როლები |
|დომენი |უზრუნველყოს დომენის დაყენება, არარეგისტრირდეს დომენები, გადაიტანოს დომენის მფლობელობა, განაახლოს დომენის მეტამონაცემები |
|აქტივების განსაზღვრა |რეგისტრაციის/რეგისტრაციის გაუქმების განმარტებები, საკუთრების გადაცემა, მეტადატატის განახლება |
|აქტივები |ნომერული რაოდენობა, გადაცემის რაოდენობა |
|საფინანსო დავალიანება|გახსნა, მიღება, გადახდის აღნიშვნა გამოგზავნილი, გათავისუფლება, გაუქმება, დავები, გადაწყვეტა, ჩამოტვირთვა ან ამოწურულია მშობლიური აღკვეთის დოკუმენტები |
|NFT |რეგისტრაცია/გადარეგისტრირება NFTs, საკუთრების გადაცემა, მეტადატობის განახლება |
|RWA |რეგისტრაცია პარტიების, გადაცემის რაოდენობა, შენახვა/გადაშვება, გაყინვა/გაყინვის გაუქმება, შეძენა, გაერთიანება, მეტამონაცემების განახლება და კონტროლი |
|ტრიგერი |რეგისტრაცია/გადარეგისტრირება, მეტყველების განმეორება/დამწვრობა, განხორციელება, განახლება. |
|მსოფლიო |რეგისტრაცია/გადარეგისტრირება ქსელის კვანძებისა და როლების, პარამეტრების განსაზღვრა, აღმასრულებლის განახლება |

## CLI მაგალითები {#cli-examples}

ამ გვერდზე მოცემული მაგალითები ითვალისწინებს, რომ თქვენ აწარმოებთ ბრძანებებს ძირითადი Iroha სამუშაო სივრცედან ადგილობრივი კლიენტის ჩვეულებრივი კონფიგურაციის წინააღმდეგ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

თუ დაყენებული გაქვთ `iroha` ბინარული ფაილი, მის ნაცვლად გამოიყენეთ `iroha --config ./defaults/client.toml`. ტრანზაქციის გამგზავნი ბრძანებები ასევე გადასცემს `--fee-payer authority`-ს, რაც საკომისიოს ხელმომწერ ანგარიშს აკისრებს; CLI ხელმოწერამდე ზუსტ საკომისიოს ითვლის. ქვემოთ მოცემული შემავსებლები თქვენი ქსელის მნიშვნელობებით შეცვალეთ:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

საჯარო Taira სატესტო ქსელისთვის გამოიყენეთ Taira კლიენტის კონფიგურაცია და დააფინანსეთ მისი ანგარიში გვერდზე [სატესტო XOR-ის მიღება Taira-ზე](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) აღწერილი მომზადების ეტაპიანი ტოკენების მიღების პროცესით. საკომისიოს მქონე მაგალითების გაშვებამდე შეამოწმეთ, რომ საკომისიო აქტივის ბალანსი ჩანს:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Taira-ზე ჩაწერებიც იმავე `--fee-payer authority` არჩევანს იყენებს და CLI საკომისიოს Taira-ს საკომისიო აქტივში ითვლის. ტრანზაქციის მეტამონაცემებს არ დაურთოთ საკომისიოს გასაღებები, მაგალითად `gas_asset_id`; კლიენტი მათ უარყოფს:

```bash
cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --fee-payer authority \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` პირველ გამოშვებაში დომენებისა და მათი SNS იჯარების შექმნის ჩვეულებრივი გზაა. ის დეკლარაციულად აკავშირებს ზუსტ მონაცემთა სივრცეს, მფლობელს, იჯარის ვადასა და ფასის შემოწმების პირობას, შემდეგ კი საჭირო მდგომარეობას ატომურად ქმნის ან ასწორებს. გამოიყენეთ ავთენტიფიცირებული `POST /v1/aliases/setup/plan` ბოლო წერტილი ან შესაბამისი CLI პროცესი:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./domain.plan.json
```

განზრახვა და გეგმა არის საიდუმლოების გარეშე, მაგრამ მოქმედებს ნაბიჯის ნიშნები და წარადგენს ჩვეულებრივ ტრანზაქციას კონფიგურირებული ანგარიშით. გეგმა არის დაკავშირებული მისი ჯაჭვი, ავტორიზაციის პრინციპალი, ცოცხალი სახელმწიფოს ანკერი და ვადია; არასოდეს გამოიყენოთ ერთი სხვა ქსელზე .

## რეგისტრაცია და რეგისტრაციის გაუქმება {#un-register}

რეგისტრაცია და არარეგისტრირება არის ინსტრუქციები, რომლებიც გამოიყენება ბლოკჩეინზე ახალ სუბიექტს პირადობის მოწმობის გასაცემად.

ყველაფერი, რაც შეიძლება დარეგისტრირდეს არის როგორც `Registrable` და `Identifiable`, მაგრამ არა ყველაფერი, რაც არის `Identifiable` არის `Registrable`. უმეტესობა რამ არის რეგისტრირებული პირდაპირ, მაგრამ ზოგიერთ შემთხვევაში წარმოდგენა ბლოკჩეინში აქვს მნიშვნელოვნად მეტი მონაცემები. უსაფრთხოებისა და შესრულების მიზეზების გამო, ჩვენ ვიყენებთ მშენებლებს ასეთი მონაცემთა სტრუქტურებისთვის (მაგალითად, `NewAccount`), ხოლო ქსელის კვანძური რეგისტრაცია აქვს სპეციალური მტკიცებულება საკუთრების ინსტრუქცია. როგორც წესი, ყველაფერი, რაც შეიძლება იყოს რეგისტრირებული, ასევე შეიძლება იყოს არარეგისტრირებელი, მაგრამ ეს არ არის რთული და სწრაფი წესი.

შეგიძლიათ დაარეგისტრიროთ ანგარიშები, აქტივების განსაზღვრებები, NFTs ობიექტები, ქსელის კვანძები, როლები და ტრიგერები. დომენის გამართვა იყენებს `EnsureAlias`-ს; ნედლი `Register::Domain` დატვირთვა გენეზისისა და საწყისი ჩატვირთვისთვისაა განკუთვნილი. კვანძის რეგისტრაცია იყენებს `RegisterPeerWithPop`-ს, რომელიც კვანძის გასაღების ფლობის მტკიცებულებას შეიცავს. სუბიექტების სახელებზე დაწესებული შეზღუდვების გასაცნობად იხილეთ ჩვენი [სახელდების წესები](/ka/reference/naming.md).

RWA პარტიები შექმნილია სპეციალური `RegisterRwa` ინსტრუქციის მეშვეობით. მიმდინარე კოდი არ გამოხატავს `UnregisterRwa` ინსტრუქციას; გამოიყენეთ `RedeemRwa` აღნიშნული რაოდენობის ამოღებისათვის.

::: info

გაითვალისწინეთ, რომ იმის მიხედვით, თუ როგორ გადაწყვეტთ თქვენი [ბლოკჩეინის გენეზისის ბლოკი](/ka/guide/configure/genesis.md) დააყენოთ `genesis.json` (კონკრეტულად, მოიცავს თუ არა თქვენ რეგისტრაცია ნებართვის ნიშნების), პროცესი ანგარიშის რეგისტრაციის შეიძლება იყოს ძალიან განსხვავებული. ზოგადად, ჩვენ შეგვიძლია შევაჯამოთ ეს ასე.

- საჯარო ბლოკჩეინში, ნებისმიერ ადამიანს უნდა შეეძლოს ანგარიშის რეგისტრაცია.
- კერძო ბლოკჩეინში შეიძლება არსებობდეს ანგარიშების რეგისტრაციის უნიკალური პროცესი. ჩვეულებრივ კერძო ბლოკჩეინი-ში, ანუ ბლოკჩეინში, სადაც არ არსებობს რაიმე უნიკალური პროცესები ანგარიშების დარეგისტრირებისთვის, საჭიროა ანგარიში სხვა ანგარიშის რეგისტრაციისთვის.

ჩვენ ვსაუბრობთ ამ განსხვავებების შესახებ ძალიან დეტალურად, როდესაც [შეადარეთ კერძო და საჯარო ბლოკჩეინები](/ka/guide/configure/modes.md).

:::

::: info

ქსელის კვანძების რეგისტრაცია ამჟამად ერთადერთი საშუალებაა, რომ ქსელში შეემატოს ქსელური თანატოლები, რომლებიც არ იყვნენ საწყისი ნდობლივი ქსელის თანათოლიკების ნაწილი.

:::

გამოიყენეთ ენის სპეციფიკური სახელმძღვანელო ბლოკჩეინის ობიექტების რეგისტრაციისთვის:

|ენა |სახელმძღვანელო |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |გამოიყენეთ [Iroha CLI](/ka/get-started/operate-iroha-via-cli.md) დომენების შექმნაზე და ანგარიშებისა და აქტივების რეგისტრაციაზე. |
|Rust |გამოიყენეთ [Rust მასწავლებელი](/ka/guide/tutorials/rust.md). |
|Kotlin/Java |გამოიყენეთ [Kotlin/Java](/ka/guide/tutorials/kotlin-java.md). |
|Python |გამოიყენეთ [Python მასწავლებელი](/ka/guide/tutorials/python.md). |
|JavaScript/TypeScript |გამოიყენეთ [JavaScript/TypeScript](/ka/guide/tutorials/javascript.md). |

დაგეგმეთ და გამოიყენეთ ჩვეულებრივი დომენის კონფიგურაცია, შემდეგ დაარეგისტრირეთ დომენი, როდესაც ის აღარ არის საჭირო:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain unregister --id docs.universal
```

რეგისტრირებული ან არარეგისტრირებელი ანგარიშები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account unregister --id "$BOB"
```

დარეგისტრირებული და არარეგისტრირებელი აქტივების განსაზღვრები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition register \
  --domain docs.universal \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition unregister --id "$ASSET_DEF"
```

რეგისტრაცია და არარეგისტრირება NFTs. NFT რეგისტრაციის შინაარსი JSON იკითხება სტანდარტული შეღებისგან:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft unregister --id 'badge$docs.universal'
```

რეგისტრაციის და არარეგისტრირების როლები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role unregister --id operators
```

რეგისტრირება და არარეგისტრირების ტრიგერი. გამოშვების რეგისტრაციისთვის საჭიროა ან შედგენილი IVM ბაიტო კოდი, ან სერიალიზებული ინსტრუქციის სია. ეს მაგალითი აშენებს `Log` ინსტრუქციას CLI-ით და მიჰყავს მას ტრიგერი რეგისტრაციაში.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --emit-instructions \
  tx ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger unregister --id hourly_cleanup
```

რეგისტრაცია და არარეგისტრირება ქსელის კვანძები. გენერირეთ BLS გასაღები და PoP `kagami`, თუ თქვენ ჯერ კიდევ არ გაქვთ ისინი:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger peer unregister --key "$PEER_KEY"
```

## მენტა/ბერნი {#mint-burn}

გამოშვება და განადგურება შეიძლება გულისხმობდეს ციფრულ აქტივებსა და საგამოძრავებელ აქტივებს, რომლებსაც შეზღუდული რაოდენობის გამეორება აქვთ. ზოგიერთი აქტივი შეიძლება დეკლარირდეს როგორც არაკომპეტენტური, რაც იმას ნიშნავს, რომ ის შეიძლება გამოყოფილი იყოს მხოლოდ ერთხელ რეგისტრაციის შემდეგ.

აქტივები გაცემულია კონკრეტულ ანგარიშზე, როგორც წესი ის, რომელმაც აქტივი პირველად დაარეგისტრირა. აქტივების რაოდენობა არ არის უარყოფითი, ასე რომ თქვენ ვერასდროს შეგიძლიათ ჰქონდეთ `$-1.0` აქტივი ან განადგუროთ უარყოფითია თანხა და მიიღოთ გამოშვება.

გამოიყენეთ ენის სპეციფიკური სახელმძღვანელო ბლოკჩეინის აქტივების გასაცემად:

- [CLI](/ka/get-started/operate-iroha-via-cli.md)
- [Rust](/ka/guide/tutorials/rust.md)
- [Kotlin/Java](/ka/guide/tutorials/kotlin-java.md)
- [Python](/ka/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ka/guide/tutorials/javascript.md)

აქ მოცემულია აქტივების განადგურების მაგალითები:

- [CLI](/ka/get-started/operate-iroha-via-cli.md)
- [Rust](/ka/guide/tutorials/rust.md)

გაცემა და განადგურება ციფრული აქტივების:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

გამოშვება და განადგურება საგამოძრავებელი გამეორებები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger burn --id hourly_cleanup --repetitions 1
```

## გადარიცხვა {#transfer}

გენერული გადარიცხვის ვარიანტები მოიცავს დომინებს, აქტივების განმარტებებს, რიცხვობრივ აქტივებს და NFTs. RWA რაოდენობის მოძრაობა იყენებს სპეციალურ `TransferRwa` და `ForceTransferRwa` ინსტრუქციებს, რომლებიც აღწერილია [რეალური აქტივები](/ka/blockchain/rwas.md) .

ამ მიზნით, ანგარიშს უნდა მიენიჭოს [აქტივების გადაცემის ნებართვა](/ka/reference/permissions.md). ნახეთ მაგალითი იმის შესახებ, თუ როგორ უნდა გადაიტანონ აქტივები [CLI](/ka/get-started/operate-iroha-via-cli.md) ან [Rust](/ka/guide/tutorials/rust.md).

ციფრული აქტივების გადარიცხვა:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

სატრანსფერო დომენი, აქტივების განსაზღვრა და NFT საკუთრება:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## ადგილობრივი ესქრო და აქტივი ჩაკეტვა-ები {#native-escrow-and-asset-locks}

ადგილობრივი ესქროს ინსტრუქციები რიცხვით აქტივებს რეესტრის მიერ მართულ პროტოკოლის მეურვეობაში კეტავს. ისინი გამოიყენება მარკეტპლეისის სტილის ანგარიშსწორებისთვის, აქტივების ზოგადი საკეტებისთვის და ატესტატორზე მიბმული პირობითი ესქროებისთვის.

მარკეტპლეისის ესქრო იყენებს `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute` და `ResolveEscrowDispute` ინსტრუქციებს. აქტივების ზოგადი საკეტები იყენებს `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock` და `ExpireAssetLock` ინსტრუქციებს. პირობითი ესქრო იყენებს `OpenConditionalEscrow`, `AttestEscrowCondition` და `ExpireConditionalEscrow` ინსტრუქციებს.

ესენი ISIs ამჟამად არ აქვს პირველი კლასის CLI ბრძანებები. გამოიყენეთ ტიპიზებული SDK მშენებლები ან სერიალიზებული ინსტრუქციის დატვირთვები, და იხილეთ [ნაციონალური აქტივების დაფარვა](/ka/blockchain/escrow.md) სიცოცხლის ციკლის დეტალების, ნებართვების, მოთხოვნების, მოვლენებისათვის და Rust მაგალითები.

## Atomic კერძო ფინანსური ოპერაციების ანგარიშსწორება {#atomic-private-settlement}

მართული ატომური კერძო ანგარიშსწორების ინსტრუქციების ოჯახი გამჭვირვალე ადგილობრივი AMX-ისგან განცალკევებულია. `ActivatePrivateSettlementPoolV1` რედაქტირებული მმართველობის პროექციისა და კანონიკური საწყისი ვალდებულებების საფუძველზე მარშრუტის ფარგლებში ერთ კონფიდენციალურ პულს ქმნის. `FinalizeAtomicPrivateSettlementV1` კომიტეტის მიერ დამოწმებულ ერთ სრულ პაკეტს ატომურად იყენებს, ხოლო `AbortAtomicPrivateSettlementV1` მხოლოდ სპონსორის მიერ ავტორიზებულ საჯარო საბოლოო მარკერს აქვეყნებს.

`RotatePrivateSettlementPoolPolicyV1` შეზღუდულია კონფიდენციალურობის მმართველობაზე. იგი მოითხოვს ზუსტ მიმდინარე მმართველობის კრიპტოგრაფიულ დიჯესტს, ინახავს მარშრუტს, პროტოკოლის მონაცემთა ჯგუფს, აქტივების დამაკავშირებელ კრიპტოგრაფიული ვალდებულების მნიშვნელობას, სახელმწიფო საზღვარს, განმეორებითი კომპლექტებს და საბოლოო პროტოკოლური შედეგების ჩანაწერებს; აწარმოებს საჯარო რევიზიას ერთი მაჩვენებლით და იყენებს უფრო ახალ აუდიტორულ საკვანძო ეპოქას. როტაცია აქტიურდება მისი ჩართვის სიმაღლეზე და ვერ იზიარებს ამ სიმაღლეს იმავე მარშრუტის / პულინის პროტოკოლური შედეგების ჩანაწერთან. საჯარო რევიზიონის ხაზი ინახავს ქვითრებს, რომლებიც დასრულებულია როტაციის განახლების წინ - მოქმედი და ზუსტი გათამაშება idempotent; ფრენის დროს ძველი პოლიტიკის ბუნდები ვერ იხურება. ოპერატორებმა უნდა შეინახონ ძველი დეკრიფციის გასაღები შენახული კაფსულებისთვის ან მართონ და ტესტის კაფსულის გადახვევა მათი განადგურებამდე.

ეს გზა ნაგულისხმევად გამორთულია და საწარმოო გამოყენებისთვის კვალიფიკაცია დადასტურებული არ აქვს. კონფიგურაციის, უფლებამოსილების, აუდიტის, აღდგენისა და გამოშვების მოთხოვნებისთვის იხილეთ [მონაცემთა სივრცეებს შორის ატომური კერძო ანგარიშსწორების შესრულება](/ka/get-started/atomic-private-settlement).

## დაფინანსება/შეღავათი {#grant-revoke}

გრანტის და მოხსნის ინსტრუქციები გამოიყენება ანგარიშზე [ნებართვები და როლები](permissions.md).

`Grant` გამოიყენება მუდმივად მომხმარებლისთვის ან ერთი ნებართვის მისაცემად, ან ნებართვების ჯგუფის ("როლი"). მინიჭებული როლები და ნებართვები შეიძლება ამოღებულ იქნას მხოლოდ `Revoke` ინსტრუქციის მეშვეობით. როგორც ასეთი, ეს ინსტრუქციები უნდა იყოს გამოყენებული ფრთხილად.

გაცემა და მოხსნა როლი ანგარიშზე:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account role revoke --id "$BOB" --role operators
```

ნებართვების მინიჭება და გაუქმება. ნებართვის ბრძანებები კითხულობს ნებართვების ობიექტს სტანდარტული შეყვანისგან:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account permission revoke --id "$BOB"
```

როლზე ნებართვის მინიჭება და მოხსნა:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

ეს ინსტრუქციები განახორციელებს ობიექტს [მეტამონაცემები](/ka/blockchain/metadata.md). გამოიყენეთ `SetKeyValue` მეტამონაცემთა შესასვლელად ან მის შეცვლაში, ხოლო `RemoveKeyValue` - მისი წაშლაში.

მეტამონაცემები `set` ბრძანებები კითხულობს JSON ღირებულებას სტანდარტული შესასვლელიდან:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger domain meta remove --id docs.universal --key environment
```

იგივე ნიმუშია ხელმისაწვდომი ანგარიშებისათვის, აქტივების განსაზღვრებისთვის NFTs, RWAs და ტრიგერი ფაქტორებისთვის:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` ცვლის ქსელის მასშტაბური პარამეტრები, რომლებიც აქტიური მონაცემების მოდელის და აღმასრულებლის მიერ არის გამოხატული.

პარამეტრის დაყენება ერთი პარამეტრიანი JSON ობიექტის ჩაბარებით სტანდარტულ შესასვლელში:

```bash
printf '{"Sumeragi":{"MaxClockDriftMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ეს ინსტრუქცია გამოიყენება [ტრიგერი](./triggers.md) შესრულებისათვის.

CLI ნაგულისხმევი `execute` ფილტრით რეგისტრირებული ტრიგერისთვის აგზავნის ხელით შესრულების `ExecuteTrigger` ინსტრუქციას, სურვილისამებრ JSON არგუმენტებით, და შეუძლია ტრიგერის შესრულების მოვლენების გამოწერა:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  trigger execute docs_on_call --args-json '{"reason":"manual run"}'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events --timeout 30s trigger-execute
```

## სხვა ინსტრუქციები {#other-instructions}

Iroha ასევე ასახავს შესრულების გარემოსა და აღმასრულებლის ინტეგრაციის უფრო დაბალი დონის ინსტრუქციებს:

- `Log`: განხორციელებისას გამოუშვას ჩანაწერი.
- `CustomInstruction`: გადაადგილება აღმასრულებლისთვის სპეციფიური JSON დატვირთვები
- `Upgrade`: გააქტიურეთ აღსრულების განახლება

წარადგინეთ ინსტრუქცია `Log` პინგის დამხმარე პირთან:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  tx ping --log-level INFO --msg "hello from docs"
```

წარადგინეთ განკუთვნილი აღმასრულებლის ინსტრუქცია სერიალიზებული `InstructionBox`. დატვირთვის ფორმა არის აღმასრულებელი სპეციფიკური, ასე რომ წარმოქმნას ინსტრუქციას შეესაბამება SDK ან აღმასრულებელ ინსტრუმენტის:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  tx stdin
```

განახლება აღმასრულებელი კომპილიზებული IVM ბაიტო კოდის ფაილიდან:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
