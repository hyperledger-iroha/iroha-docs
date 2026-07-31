---
translation_locale: ka
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha სპეციალური ინსტრუქციები {#iroha-special-instructions}

როდესაც ჩვენ ვისაუბრეთ [როგორ Iroha ფუნქციონირებს](/ka/blockchain/iroha-explained), ჩვენ
თქვა, რომ Iroha სპეციალური ინსტრუქციები ერთადერთი გზაა სამყაროს შეცვლისთვის.
რა სახის სპეციალური ინსტრუქციები გვაქვს?
ამ გაკვეთილში ენის სპეციფიკური სახელმძღვანელოები, თქვენ უკვე ნახეთ რამდენიმე
ინსტრუქცია: `Register<Account>` და `Mint<Numeric>`.

აქ არის სრული სია Iroha სპეციალური ინსტრუქციები:

| ინსტრუქცია                                               | აღწერილობა                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [რეგისტრაცია/გადარეგისტრირება](#un-register)                       | გადმომცემეთ ID ბლოკჩეინზე ახალ სუბიექტს.    |
| [მენტა/ბერნი](#mint-burn)                                   | ნომერული აქტივები ან გამშვები განმეორებები. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | ბლოკჩეინის ობიექტების მეტა მონაცემები განახლება.               |
| [SetParameter](#setparameter)                             | აწესრიგეთ ქსელის ფართო პარამეტრი.                      |
| [დაფინანსება/შეღავათი](#grant-revoke)                             | აძლევს ან ამოიღებს ნებართვებს და როლებს.            |
| [გადარიცხვა](#transfer)                                     | საკუთრების ან აქტივების ღირებულების გადარიცხვა.               |
| [ნაციონალური საფინანსო და აქტივების ჩაკეტვა](#native-escrow-and-asset-locks) | ნომერული აქტივები ჩაკეტეთ პროტოკოლში.     |
| [ExecuteTrigger](#executetrigger)                         | ოპვრთნარჲ ჟრანთრვ.                                |
| [რეგისტრაცია/საკომფორტაციო განახლება](#other-instructions)                 | დაწერეთ, გააფართოვეთ ან გააუმჯობესეთ გამშვები დროის ქცევა.        |

დავიწყოთ შეჯამებით Iroha სპეციალური ინსტრუქციები; რა ობიექტებია თითოეული
ინსტრუქცია შეიძლება მოითხოვოს და რა ინსტრუქციები არის ხელმისაწვდომი თითოეული
საგანი.

## შემაჯამებელი {#summary}

თითოეული ინსტრუქციისათვის არსებობს იმ ობიექტების ჩამონათვალი, რომელზეც ეს ინსტრუქცია
შეიძლება ჩატარდეს. მაგალითად, გადაცემის ვარიანტები ფარავს საკუთრებაში არსებულ ლიდერის ობიექტებს
და ციფრული აქტივები, ხოლო მონტირება მოიცავს ციფრულ აქტივებს და გამამოძრავებელი
განმეორება.

ზოგიერთი ინსტრუქცია საჭიროებს დანიშნულების მითითებას. მაგალითად, თუ
თქვენ გადარიცხავთ აქტივებს, ყოველთვის უნდა დაასახელოთ რომელ ანგარიშზე ხართ
სხვა მხრივ, როდესაც თქვენ რეგისტრირებთ რაღაცას,
გჭირდებათ მხოლოდ ის ობიექტი, რომელსაც გსურთ დარეგისტრირდეთ.

| ინსტრუქცია                                               | ობიექტები                                                                                                 | დანიშნულების ადგილი          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | ჩვეულებრივი დომენი, მონაცემთა სივრცის ანალიზი და ანგარიშის ანალიზის კონფიგურაცია                                                 |                      |
| [რეგისტრაცია/გადარეგისტრირება](#un-register)                       | ანგარიშსწორება, აქტივების განსაზღვრა; NFTs, როლები, მატჩები, თანატოლები; დომენის ამოღება                                |                      |
| [მენტა/ბერნი](#mint-burn)                                   | ციფრული აქტივები, გამშვები განმეორებები                                                                     | ანგარიშები ან გამომწვევი ფაქტორები |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | ობიექტები, რომლებსაც აქვთ [მეტა მონაცემები](./metadata.md): დომენები, ანგარიშები, აქტივების განსაზღვრა; NFTs, RWAs, გამამოძრავებელი |                      |
| [SetParameter](#setparameter)                             | ქსელის პარამეტრები                                                                                        |                      |
| [დაფინანსება/შეღავათი](#grant-revoke)                             | [როლები, ნებართვის ნიშნები](/ka/blockchain/permissions.md)                                                  | ანგარიშები ან როლები    |
| [გადარიცხვა](#transfer)                                     | დომენები, აქტივების განსაზღვრები, ციფრული აქტივები; NFTs                                                        | ანგარიშები             |
| [ნაციონალური საფინანსო და აქტივების ჩაკეტვა](#native-escrow-and-asset-locks) | ნომერული აქტივების საფინანსო დავალიანებები, აქტივების ჩაკეტვა, ანონიმური ვალდებულებები                                    | მყიდველები, მიმართულებები ან სადავო განხეთქილებები |
| [ExecuteTrigger](#executetrigger)                         | გამამოძრავებელი                                                                                                |                      |
| [რეგისტრაცია/საკომფორტაციო განახლება](#other-instructions)                 | ჩანაწერები, აღსრულების სპეციფიკური სასარგებლო ტვირთები, აღმასრულებლის განახლება                                                     |                      |

ასევე არსებობს სხვა გზა, რომ შეხედოთ ISI, ლიდერის ობიექტის მიხედვით
ისინი შეეხებიან:

| მიზანი           | ინსტრუქციები                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| ანგარიში          | ანგარიშის რეგისტრაცია/გადარეგისტრირება, აქტივების მიღება, ანგარიშის განახლების მეტა მონაცემები, ნებართვის მინიჭება/მოხსნა და როლები    |
| დომენი           | უზრუნველყოს დომენის დაყენება, არარეგისტრირდეს დომენები, გადაიტანოს დომენის მფლობელობა, განაახლოს დომენის მეტა მონაცემები                    |
| აქტივების განსაზღვრა | რეგისტრაციის/რეგისტრაციის გაუქმების განსაზღვრები, საკუთრების გადაცემა, მეტატალღის განახლება                                         |
| აქტივები            | ნატურალური რაოდენობა, გადარიცხული რაოდენობა                                                        |
| საფინანსო გადასახადი           | გახსნა, მიღება, გადახდის აღნიშვნა გამოგზავნილი, გათავისუფლება, გაუქმება, დავა, გადაწყვეტა, ჩამოტვირთვა ან ვადის მშობლიური აღკვეთის დოკუმენტები |
| NFT              | რეგისტრაცია/გადარეგისტრირება NFTs, საკუთრების გადაცემა, მეტატალღების განახლება                                                |
| RWA              | დარეგისტრირება, გადაცემის რაოდენობა, შენახვა/გადაშვება, გაყინვა/გაყინვის გაუქმება, შეძენა, გაერთიანება, მეტა მონაცემების განახლება და კონტროლი |
| გამამოძრავებელი          | რეგისტრირება/რეგისტრირების გაუქმება, მეტყველება/გაწვის გამშვები განმეორებები, გამშვები ამოქმედება, განახლება გამშვები მეტა მონაცემები                 |
| მსოფლიო            | რეგისტრირება/რეგისტრირების გაუქმება თანატოლებისა და როლების, პარამეტრების დადგენა, აღსრულებლის განახლება                                    |

## CLI მაგალითები {#cli-examples}

ამ გვერდზე მოცემული მაგალითები ვარაუდობენ, რომ თქვენ აწარმოებთ ბრძანებებს ზემოდან
Iroha სამუშაო სივრცე ადგილობრივი კლიენტის დეფოლტური კონფიგურაციის წინააღმდეგ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

თუ თქვენ დაამონტაჟეთ `iroha` ბინარული, გამოყენება
`iroha --config ./defaults/client.toml` ნაცვლად. შეცვალეთ ადგილის მფლობელები
ქვემოთ მოცემულია თქვენი ქსელის ღირებულებები:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

საზოგადოების მიმართ მიზნად Taira testnet, გამოიყენეთ a Taira კლიენტის კონფიგურაცია.
სანამ ფასიანი მაგალითები გაუშვით, შეინახეთ საფანქნის დამხმარე
[მიიღეთ Testnet XOR დაწვრილებით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
როგორც `taira_faucet_claim.py`, შემდეგ სარჩელის სატესტო ქსელი XOR საპირფარეშოდან:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

მას შემდეგ, რაც საფანჯარაზე დაფინანსებული აქტივი ხილული იქნება, დაუმატეთ საჭირო გაზის აქტივი.
ტრანზაქციების დაწერის მეტა მონაცემები:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` არის ჩვეულებრივი პირველი გამოშვების გზა დომენების შექმნისთვის და
მათი SNS იჯარით. იგი დეკლარაციურად აკავშირებს მონაცემთა სივრცეს, მფლობელს,
ტერმინი, და ციტირება დაცვა, შემდეგ ქმნის ან შეკეთებს ყველა საჭირო სახელმწიფო ატომურად.
გამოიყენეთ ავთენტიფიცირებული `POST /v1/aliases/setup/plan` საბოლოო წერტილი ან შედარება
CLI სამუშაო მიმდინარეობა:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

განზრახვა და გეგმა არის საიდუმლო თავისუფალი, მაგრამ მოქმედება ნაბიჯები ნიშნები და წარადგენს
ჩვეულებრივი ტრანზაქცია კონფიგურირებული ანგარიშით.
ჯაჭვი, ავტორიტეტი, ცოცხალი სახელმწიფოს ანკერი და ვადა; არასოდეს გამოიყენოთ ერთმანეთი
ქსელი.

## რეგისტრაცია {#un-register}

რეგისტრაცია და არარეგისტრირება არის ინსტრუქციები, რომლებიც გამოიყენება ID ა-ზე
ახალი ობიექტი ბლოკჩეინზე.

ყველაფერი, რაც შეიძლება დარეგისტრირდეს არის ორივე `Registrable` და `Identifiable`,
მაგრამ არა ყველაფერი, რაც `Identifiable` არის `Registrable`. უმრავლესობა
დარეგისტრირებულია პირდაპირ, მაგრამ ზოგიერთ შემთხვევაში blockchain წარმომადგენლობა
უსაფრთხოებისა და შესრულების მიზეზების გამო, ჩვენ ვიყენებთ
ამ მონაცემთა სტრუქტურების შემქმნელები (მაგალითად, `NewAccount`), და თანატოლები
რეგისტრაციაში აქვს სპეციალური მტკიცებულება საკუთრების შესახებ. როგორც წესი,
ყველაფერი, რაც შეიძლება დარეგისტრირდეს, ასევე შეიძლება იყოს არარეგისტრირებული, მაგრამ ეს არ არის
რთული და სწრაფი წესი.

შეგიძლიათ დარეგისტრიროთ ანგარიშები, აქტივების განსაზღვრები, NFTs, თანატოლები, როლები და
დომენის დაყენების გამოყენება `EnsureAlias`; ნედლეული `Register::Domain` სასარგებლო ტვირთი
განკუთვნილია genesis/bootstrap-ისთვის.
`RegisterPeerWithPop`, კჲი თმა ეჲკაჟრგჲ ჱა ფჲლვგრა.
[კონვენციების სახელწოდება](/ka/reference/naming.md) შეზღუდვების შესახებ ინფორმაციის მიღება
დააყენეთ საიტი სახელები.

RWA პარტიები შექმნილია სპეციალური `RegisterRwa` ინსტრუქცია.
ამჟამინდელი კოდი არ ასახავს `UnregisterRwa` ინსტრუქცია; გამოყენება
`RedeemRwa` წარმოდგენილი რაოდენობის გადასატანად.

::: info

გაითვალისწინეთ, რომ დამოკიდებულია იმაზე, თუ როგორ გადაწყვეტთ თქვენი
[გენეზიის ბლოკი](/ka/guide/configure/genesis.md) დაწვრილებით `genesis.json`
(განსაკუთრებით, შეეხება თუ არა ნებართვის რეგისტრაციას
ანგარიშის რეგისტრაციის პროცესი შეიძლება ძალიან განსხვავებული იყოს.
გენერალო, შეგვიძლია ასე შევაჯამოთ:

- ა-ში _საზოგადოება_ ბლოკჩეინით, ნებისმიერ ადამიანს უნდა შეეძლოს ანგარიში ჩაწერა.
- ა-ში _კერძო_ blockchain, შეიძლება იყოს უნიკალური პროცესი რეგისტრაციისთვის
  ანგარიშები. _ტიპიური_ კერძო ბლოკჩეინი, ანუ ბლოკშეინი
  ნებისმიერი უნიკალური პროცესები ანგარიშების რეგისტრაციის, თქვენ უნდა ანგარიში
  დაარეგისტრირეთ სხვა ანგარიში.

ჩვენ ვსაუბრობთ ამ განსხვავებებზე დეტალურად, როდესაც
[შეადარეთ კერძო და საჯარო ბლოკჩენი](/ka/guide/configure/modes.md).

:::

::: info

თანატოლების რეგისტრაცია ამჟამად ერთადერთი გზაა, რომ დაამატოთ თანატოლები, რომლებიც არ იყვნენ
ქსელში განთავსებული ორიგინალური ნდობის პარტნიორის ნაწილი.

:::

Refer ენის სპეციფიკური სახელმძღვანელოების ერთ-ერთს, რომელიც გაგიყვანს
ბლოკჩეინში ობიექტების რეგისტრაციის პროცესი:

| ენები              | სახელმძღვანელო                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | გამოიყენეთ [Iroha CLI](/ka/get-started/operate-iroha-via-cli.md) დომენების შექმნა და ანგარიშებისა და აქტივების რეგისტრაცია. |
| Rust                  | გამოიყენეთ [Rust გაკვეთილი](/ka/guide/tutorials/rust.md).                                                      |
| Kotlin/ჯავა           | გამოიყენეთ [Kotlin/Java მასწავლებელი](/ka/guide/tutorials/kotlin-java.md).                                        |
| Python                | გამოიყენეთ [Python გაკვეთილი](/ka/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | გამოიყენეთ [JavaScript/TypeScript გაკვეთილი](/ka/guide/tutorials/javascript.md).                               |

დაგეგმეთ და გამოიყენეთ ჩვეულებრივი დომენის კონფიგურაცია, შემდეგ გამოწერეთ დომენი, როდესაც ის არ არის
ხანგრძლივი საჭიროება:

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

რეგისტრირებული და არარეგისტრირებელი ანგარიშები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

რეგისტრირებული და არარეგისტრირებელი აქტივების განსაზღვრები:

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

რეგისტრაცია და არარეგისტრირება NFTs. NFT რეგისტრაცია მისი შინაარსი კითხულობს JSON საგანგებო
სტანდარტული შეყვანა:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

რეგისტრაციის და არარეგისტრირების როლები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

დარეგისტრირება და არარეგისტრირების ტრიგერები.
შედგენილი IVM bytecode ან სერიალიზებული ინსტრუქციის სია. ეს მაგალითი აშენებს
ბ) `Log` ინსტრუქცია CLI და ატარებს მას საგამოშვო რეგისტრაციაში:

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

დარეგისტრირება და გაუქმება თანატოლების. BLS საკვანძო და PoP მქონე `kagami`
თუ თქვენ მათ ჯერ არ გაქვთ:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## მენტა/ბერნი {#mint-burn}

ფუნტი და დამწვრობა შეიძლება გულისხმობდეს ციფრულ აქტივებს და გამამოძრავებლებს, რომლებსაც შეზღუდული რაოდენობის
განმეორების რაოდენობა. ზოგიერთი აქტივი შეიძლება გამოცხადდეს როგორც არამქვეყნებელი, ანუ
რომ ისინი რეგისტრაციის შემდეგ მხოლოდ ერთხელ შეიძლება გადახდეს.

ქონება გადახდილია კონკრეტულ ანგარიშზე, როგორც წესი, ისეთ ანგარიშზე რომელიც რეგისტრირებულია
ქონების რაოდენობა არ არის უარყოფითი, ასე რომ თქვენ შეგიძლიათ
არასოდეს `$-1.0` ან უარყოფითი თანხა და მიიღეთ მინა.

ენის სპეციფიკური სახელმძღვანელოების ერთ-ერთს მიაკითხეთ, რათა გაგიყვანოთ
ბლოკჩეინში აქტივების მოპოვების პროცესი:

- [CLI](/ka/get-started/operate-iroha-via-cli.md)
- [Rust](/ka/guide/tutorials/rust.md)
- [Kotlin/ჯავა](/ka/guide/tutorials/kotlin-java.md)
- [Python](/ka/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ka/guide/tutorials/javascript.md)

აქ მოცემულია ქონების დამწვრობის მაგალითები:

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

მენტისა და დამწვრობის საგამოწვევო განმეორებები:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## გადარიცხვა {#transfer}

გადარიცხვა საკუთრების ან ღირებულების გადატანა ანგარიშებს შორის.
ვარიანტები მოიცავს დომენებს, აქტივების განსაზღვრებს, ციფრულ აქტივებს და NFTs. RWA
რაოდენობის მოძრაობა იყენებს დანიშნული `TransferRwa` და `ForceTransferRwa`
ინსტრუქციები, რომლებიც აღწერილია [რეალურ სამყაროში არსებული აქტივები](/ka/blockchain/rwas.md).

ამისათვის, ანგარიშსწორება აუცილებელია
[აქტივების გადაცემის უფლება](/ka/reference/permissions.md). მიუთითეთ
მაგალითი, თუ როგორ უნდა გადაიტანოს აქტივები
[CLI](/ka/get-started/operate-iroha-via-cli.md) ან
[Rust](/ka/guide/tutorials/rust.md).

ციფრული აქტივების გადარიცხვა:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

გადაცემის დომენი, აქტივების განსაზღვრა და NFT საკუთრება:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Native Escrow და Asset Locks {#native-escrow-and-asset-locks}

Native escrow instructions lock numeric assets in ledger-managed protocol (ნაციონალური საფინანსო ინსტრუქციები ჩაკეტოს ციფრული აქტივები მთავრობის მიერ მართულ პროტოკოლში)
მფლობელობა. ისინი გამოიყენება ბაზრის სტილის ანგარიშსწორებისთვის, ზოგადი აქტივების
ბლოკები და ანონიმური დაცული საფინანსო ნაკადები.

საბაზრო საფარდების გამოყენება `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, და `ResolveEscrowDispute`. ზოგადი აქტივების საკეტი გამოყენება
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, და
`ExpireAssetLock`. Anonymous escrow ასახავს ბაზრის სიცოცხლის ციკლს
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, და
`ResolveAnonymousEscrowDispute`.

ესენი ISIs ამჟამად არ აქვს პირველი კლასის CLI ბრძანებები. გამოიყენეთ დაწერილი SDK
დამშენებლები ან სერიალიზებული ინსტრუქციის სასარგებლო ტვირთები, და იხილეთ
[ნაციონალური აქტივების გადახდა](/ka/blockchain/escrow.md) სიცოცხლის ციკლის დეტალებისთვის,
ნებართვები, გამოკითხვები, მოვლენები და Rust მაგალითები.

## დაფინანსება/შეღავათი {#grant-revoke}

ანგარიშსწორებისთვის გამოიყენება დაფინანსებისა და მოხსნის ინსტრუქციები
[ნებართვები და როლები](permissions.md).

`Grant` გამოიყენება მომხმარებლისთვის ან ერთჯერადი ნებართვის მუდმივად მინიჭებისთვის, ან
ნებართვების ჯგუფი ("როლი"). მინიჭებული როლები და ნებართვები შეიძლება მხოლოდ
გადაიყვანოს `Revoke` ინსტრუქცია. როგორც ასეთი, ეს ინსტრუქციები უნდა
გამოიყენება ფრთხილად.

გაცემა და მოხსნა როლი ანგარიშზე:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

ნებართვის ქაღალდების მინიჭება და გაუქმება. ნებართვების ბრძანებები კითხულობს ნებართვას
საგანი სტანდარტული შესასვლელიდან:

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

ეს ინსტრუქციები განახლება ობიექტი [მეტა მონაცემები](/ka/blockchain/metadata.md). გამოყენება
`SetKeyValue` მეტა მონაცემების შეტანა ან შეცვლა; და `RemoveKeyValue` დაწვრილებით
ერთი წაშალე.

მეტა მონაცემები `set` ბრძანებები წაიკითხეთ JSON ღირებულება სტანდარტული შესასვლელიდან:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

იგივე ნიმუშია ხელმისაწვდომი ანგარიშების, აქტივების განსაზღვრისთვის, NFTs, RWAs,
და გამომწვევი:

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

`SetParameter` აქტიური მონაცემებით გამოხატული მთელი ქსელის პარამეტრების ცვლილებები
მოდელი და აღმასრულებელი.

პარამეტრის დაყენება ერთი პარამეტრით JSON სტანდარტის ობიექტი
შემოტანა:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ეს ინსტრუქცია გამოიყენება აღსრულებისათვის [გამამოძრავებელი](./triggers.md).

სააგენტო CLI შეუძლია დაარეგისტრიროს triggers და გამოწეროს trigger შესრულების მოვლენები
პირდაპირ. ის არ უზრუნველყოფს ტიპირებულ `execute trigger` ბრძანება, ასე რომ
წარადგინეთ სახელმძღვანელო `ExecuteTrigger` ინსტრუქცია, წარმოქმნას სერიალიზებული
`InstructionBox` დაწყებული SDK ან აღმასრულებელი ინსტრუმენტი და გადასცეს შედეგად JSON
მასაჟი `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## სხვა ინსტრუქციები {#other-instructions}

Iroha აგრეთვე გამოფენს ქვედა დონის ინსტრუქციებს გამშვები დროისა და აღსრულებისათვის
ინტეგრაცია:

- `Log`: გაშვება ჩანაწერის რეგისტრაციის დროს
- `CustomInstruction`: აღსრულებლისთვის სპეციფიკური ტარება JSON სასარგებლო ტვირთები
- `Upgrade`: ააქტიურეთ აღმასრულებელი განახლება

წარადგინეთ a `Log` ინსტრუქცია პინგ ჰელპერით:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

წარადგინეთ განკუთვნილი აღმასრულებელი ინსტრუქცია როგორც სერიალიზებული `InstructionBox`. სააგენტო
სასარგებლო ტვირთის ფორმა არის აღმასრულებელი სპეციფიკური, ასე რომ გენერირება ინსტრუქცია
შედარება SDK ან აღსრულების ინსტრუმენტები:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

განახლება აღმასრულებელი კომპილიზებული IVM ბაიტკოდის ფაილი:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
