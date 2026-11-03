---
translation_locale: ka
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# შექმენით და განახორციელეთ ჭკვიანი ხელშეკრულება {#build-and-deploy-a-smart-contract}

## შედეგები {#outcome}

შეამოწმეთ და დააკომპილირეთ Kotodama V1 კონტრაქტი, ლოკალურად გაუშვით მისი საჯარო view ფუნქცია, განათავსეთ შემოწმებული IVM არტეფაქტი ცხადად არჩეული, უფლებამოსილი ანგარიშის მიერ გადახდილი საფასურით და წაიკითხეთ განთავსებული view Torii-ის მეშვეობით.

## წინაპირობები {#prerequisites}

- Iroha წყარო კოდის სამუშაო ასლი პროტოკოლის დასრულებისას `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust და Cargo-ში.
- მიმდინარე `iroha` CLI და `musubi` (სამუშაო ასლში გაუშვით როგორც `cargo run -p musubi --`), ასევე დაფინანსებული Taira კლიენტი გვერდიდან [Taira-სთან დაკავშირება](./connect-to-taira.md).
- აბსოლუტური გზა `IROHA_CONFIG`-ში. Musubi-ის ქსელური მიბმა ინახავს მითითებას ამ კლიენტის ფაილზე და განთავსებას მისი ანგარიშის გასაღებით აწერს ხელს.
- ალიასზე უფლებამოსილება. აღმასრულებელი მოითხოვს `CanManageAccountAlias`-ს კონტრაქტის ზუსტი ალიასისთვის ან მისი მშობელი არეალისთვის: მფლობელი დომენისთვის `name::domain.dataspace`-ის შემთხვევაში, ან მონაცემთა სივრცისთვის `name::dataspace`-ის შემთხვევაში. რეგისტრირებულ ანგარიშებს კოდის რეგისტრაციის ცალკე ნებართვა არ სჭირდება, ხოლო დაცული სახელთა სივრცეები დამატებით ქსელის მმართველობის სამუშაო პროცესსაც მოითხოვს. მაგალითები იყენებს `cookbook_tuple::universal`-ს; Taira-ზე ის ჩაანაცვლეთ ალიასით თქვენს საკუთრებაში არსებულ დომენში, ან განათავსეთ გენერირებულ ლოკალურ ქსელში, რომლის გენეზისიც ალიასის არეალს ანიჭებს.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## ნაბიჯები {#steps}

### 1. ცნობილი ხელშეკრულების ასლი Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

მუშაობა ჩაკეტილი Iroha სამუშაო ასლი და ასახვა კომპილატორის tuple-ბრუნვის ნიმუში, ასე რომ წყარო და ინსტრუმენტების ჯაჭვი რჩება იმავე პროტოკოლის დასრულების.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

სრული წყარო კოდი მცირეა: ერთი კერძო დამხმარე `fn` და ერთი საჯარო, მხოლოდ წაკითხვადი `view fn`, რომელიც ცხადად უშვებს ნებისმიერ გამომძახებელს:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama მიზნად ისახავს Iroha ვირტუალურ მანქანას და მის მიმდინარე ABI. ეს არ არის WASM ან EVM წყარო ენა.

### 2. შემოწმება, მშენებლობა და არტეფაქტის შემოწმება {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

პირველი აგება აქვეყნებს არტეფაქტსა და ავთენტიფიცირებულ თანმხლებ ფაილებს. მეორე მხოლოდ წაკითხვის `--verify` რეჟიმში მუშაობს და შეცდომით სრულდება, თუ არსებული რომელიმე შედეგი მიმდინარე წყაროს ზუსტად არ ემთხვევა. `.to` ფაილი და მისი მანიფესტი ერთ, შემოწმებულ აგების შედეგად განიხილეთ.

### 3. განახორციელეთ ბაიტების კოდი ადგილობრივად {#_3-run-the-bytecode-locally}

`compute` არის საჯარო, მხოლოდ წაკითხვადი `view fn`. გაუშვით ის `debug-view`-ით, რომელიც კომპილირებულ ბაიტკოდს ლოკალურად ასრულებს არასავალდებულო სატესტო მონაცემებზე, ტრანზაქციის წარდგენისა და გადახდის გარეშე.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama მთლიანი რიცხვები წარმოდგენილია როგორც JSON სიმები, ამიტომ დეკოდირებული ტუპლი არის `["3", "5"]`.

### 4. შემოწმებული არტეფაქტის განთავსება Musubi-ით {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` კონტრაქტებს ათვალიერებს, მათ view ფუნქციებს უშვებს და მათ გამართვას ახორციელებს, მაგრამ მათ არ განათავსებს, ამიტომ Taira-ზე განთავსება Musubi-ით ხდება. მისი განთავსების სერვისი ატვირთავს ბაიტკოდის ნაწილებს, არეგისტრირებს შემოწმებულ მანიფესტს და აგზავნის ერთ `CommitContractDeployment` ოპერაციას. ის ყოველი ტრანზაქციისთვის იღებს საფასურის შეფასებას, უარყოფს შეფასებას, რომელიც ცვლის არჩეულ გადამხდელს, სპონსორის რევიზიას ან გაზის ზღვარს, და წინასწარ აგებულ არტეფაქტს განათავსებს მხოლოდ მას შემდეგ, რაც ფიქსირებული დამოკიდებულებებით პაკეტის აგება მისი კოდისა და ABI-ის ჰეშებს გაიმეორებს. Kagami-ით მართულ ლოკალურ ქსელში ამის ნაცვლად `kagami contract deploy` განათავსებს `./build/tuple_return_demo.to`-ს `--alias cookbook_tuple::universal --json`-ით; მისი ქვითარი `.receipt`-შია, ხოლო `kagami context show` ბეჭდავს კლიენტის კონფიგურაციას, რომელიც `IROHA_CONFIG`-ად უნდა გამოიყენოთ.

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

მიბმა იყენებს `--fee-payer authority`-ს; Musubi ხელმოწერამდე იღებს ზუსტი საფასურის შეფასებას Taira-ს საფასურის აქტივში. დაბრუნებული ჩამოსაჭრელი აქტივი შეადარეთ იმ აქტივს, რომელსაც გამცემის მიმდინარე პოლიტიკა აქვეყნებს. კონტრაქტის გამოძახებები საფასურის არჩევანს მხოლოდ ტიპიზებული მიმდინარე შეფასებით იღებს; `gas_asset_id` ტრანზაქციის მეტამონაცემები პირველი გამოშვების კონტრაქტის ნაწილი არ არის.

### 5. წაიკითხეთ განთავსებული view {#_5-read-the-deployed-view}

`contract view` Torii-ზე ასრულებს მხოლოდ წაკითხვად შესასვლელ წერტილს ტრანზაქციისა და საფასურის გარეშე. view-ს ტრანზაქციული ფორმა არ აქვს: Torii თავის გამოძახების მარშრუტებზე view-ს სელექტორს უარყოფს.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## შემოწმება {#verify}

ამოხსენით ალიასი, მოიპოვეთ ჯაჭვზე არსებული მანიფესტი იმ კოდის ჰეშით, რომელსაც Torii განთავსებული view-სთვის აცნობებს, და გაუშვით იგივე view კანონიკური მისამართით:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

განთავსება დასრულებულია მხოლოდ მაშინ, როდესაც განთავსების ქვითარი შენახულ არტეფაქტს შემოწმებულად აცხადებს, ალიასი დაბრუნებულ მისამართად იხსნება, მანიფესტი იმავე კოდის ჰეშით იკითხება, ხოლო ლოკალური და Torii-ის view-ები აბრუნებს `["3", "5"]`-ს.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`, ან აღმასრულებლის `authority is not permitted to manage contract alias`, ნიშნავს, რომ ანგარიშს არ შეუძლია ამ ალიასის მიბმა. გამოიყენეთ ალიასი თქვენს საკუთრებაში არსებულ დომენში, ან ამ არეალის მფლობელისგან მიიღეთ ზუსტი ალიასის ნებართვა ან მისი დომენის ან მონაცემთა სივრცის ნებართვა; ლოკალურ ქსელში ის გენეზისში მიანიჭეთ.
- დაცული სახელთა სივრცის უარყოფა ნიშნავს, რომ ალიასის სახელთა სივრცე მმართველობის კონტროლქვეშაა. დამამტკიცებელი ანგარიშების ID-ების ჩამოთვლა დამტკიცების მტკიცებულება არ არის; ამ სახელთა სივრცისთვის გამოიყენეთ ქსელის მმართველობის სამუშაო პროცესი (`iroha app gov deploy propose`), ან აირჩიეთ ალიასი მის გარეთ.
- მანიფესტის ან ABI-ის შეუსაბამობა ნიშნავს, რომ ბაიტკოდი, მანიფესტი და კვანძის შესრულების გარემო ერთსა და იმავე არტეფაქტს არ აღწერს. ხელახლა ააგეთ ჩანიშნულ კომიტზე, შემდეგ კი აგება ხელახლა გაუშვით `--verify`-ით.
- `fee quote changed ... gas bound` ნიშნავს მოთხოვნილ ტიპირებულ განზრახვას და ცოცხალ შეთავაზებას, რომელიც არ ეთანხმება. ხელმოწერილი ტრანზაქციის შეცვლის ნაცვლად, გადაიხადე წინაპირობა.
- შეწყვეტილი განთავსება თავის ხელმოწერილ გეგმას ჟურნალში ინახავს. ახალი გეგმის ხელმოწერის ნაცვლად აღადგინეთ ის `musubi deploy --resume <JOURNAL>`-ით.
- `is read-only and cannot be invoked as a transaction` ან `is not a kotoage or lifecycle entrypoint` ნიშნავს, რომ `compute` გამოძახების ბრძანებას გადაეცა. ეს ნიმუში აცხადებს `view fn`-ს, ამიტომ ლოკალურად გამოიყენეთ `debug-view`, ხოლო Torii-ზე — `view`.
- კონტრაქტის გამოძახებები დადებით ტიპიზებულ გაზის ლიმიტს მოითხოვს. პირველი გამოშვების გამოძახების კონტრაქტი ზედა დონის გაზის ან საკომისიო აქტივის მეტამონაცემებს უარყოფს.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [Kotodama V1 ბრძანების იმპლემენტაცია დამაგრებული წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [ორჯერ დაბრუნების წყარო ნიმუში დამაგრებული წყარო კოდის რევიზიის](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Musubi-ის განთავსების ბრძანება](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) და [კონტრაქტების განთავსების ნატიური სერვისი](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) დამაგრებული წყარო კოდის რევიზიისას
- [კონტრაქტის ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [ჭკვიანი ხელშეკრულებები](/ka/blockchain/smart-contracts.md)
- [რეფერენცია CLI](/ka/get-started/operate-iroha-via-cli.md)
