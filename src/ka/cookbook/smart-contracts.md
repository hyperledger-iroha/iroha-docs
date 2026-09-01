---
translation_locale: ka
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# შექმენით და განახორციელეთ ჭკვიანი ხელშეკრულება {#build-and-deploy-a-smart-contract}

## შედეგები {#outcome}

შეამოწმეთ და შეადგინეთ Kotodama V1 ხელშეკრულება, განახორციელეთ მისი საჯარო შესასვლელი ადგილი ადგილობრივად, განათავსეთ შემოწმებული IVM არტეფაქტი, სიმულირეთ განთავსებული შესასვლელო ადგილი და წარუდგინეთ იგი ტრანზაქციის ხელმომწერი ანგარიშის მიერ გადახდილი საფასურის ფასით გამოკვეთილად.

## წინაპირობები {#prerequisites}

- Iroha წყარო კოდის სამუშაო ასლი პროტოკოლის დასრულებისას `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust და Cargo-ში.
- ამჟამინდელი `iroha` CLI დაფინანსებული Taira კლიენტი [გაერთიანება Taira](./connect-to-taira.md).
- აბსოლუტური ბილიკები `IROHA_CONFIG` და `IROHA_PRIVATE_KEY_FILE`. საკვანძო ფაილი უნდა იყოს მფლობელის მიერ განთავსებული, ერთბმული რეგულარული ფაილი რეჟიმით `0600`; დანერგვის დამხმარეს მიზანმიმართულად არ აქვს კერძო გასაღების არგუმენტი.
- Taira ოპერატორის დამტკიცება. ხელშეკრულების კოდის რეგისტრაცია საჭიროებს `CanRegisterSmartContractCode`, ხოლო დაცული განთავსებები შეიძლება მოითხოვოს მმართველობის ატრიბუცია და კანონმდებლობა. თუ Taira არ მიანიჭა ეს წვდომა, განხორციელეთ განთავსება გენერირებულ ლოკალურ ქსელში, რომლის ბლოკჩეინის წარმოშობითაც იძლევა ნებართვა.

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## ნაბიჯები {#steps}

### 1. ცნობილი ხელშეკრულების ასლი Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

მუშაობა ჩაკეტილი Iroha სამუშაო ასლი და ასახვა კომპილატორის tuple-ბრუნვის ნიმუში, ასე რომ წყარო და ინსტრუმენტების ჯაჭვი რჩება იმავე პროტოკოლის დასრულების.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

სრული წყარო პატარაა და გამოიყენება მიმდინარე `seiyaku`/`kotoage` სინტაქსი:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama მიზნად ისახავს Iroha ვირტუალურ მანქანას და მის მიმდინარე ABI. ეს არ არის WASM ან EVM წყარო ენა.

### 2. შემოწმება, მშენებლობა და არტეფაქტის შემოწმება {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

პირველი აგება აქვეყნებს არტეფაქტსა და ავთენტიფიცირებულ თანმხლებ ფაილებს. მეორე მხოლოდ წაკითხვის `--verify` რეჟიმში მუშაობს და შეცდომით სრულდება, თუ არსებული რომელიმე შედეგი მიმდინარე წყაროს ზუსტად არ ემთხვევა. `.to` ფაილი და მისი მანიფესტი ერთ, შემოწმებულ აგების შედეგად განიხილეთ.

### 3. განახორციელეთ ბაიტების კოდი ადგილობრივად {#_3-run-the-bytecode-locally}

`compute` არის საჯარო `kotoage` შესასვლელი პუნქტი. განახორციელეთ იგი `debug-call`-ით, რომელიც ტესტის ადგილობრივ არტეფაქტებთან შედარებით იმოქმედებს ტრანზაქციის წარდგენისა ან გადახდის გარეშე.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama მთლიანი რიცხვები წარმოდგენილია როგორც JSON სიმები, ამიტომ დეკოდირებული ტუპლი არის `["3", "5"]`.

### 4. განლაგება ადგილობრივი დამხმარის საშუალებით {#_4-deploy-through-the-native-helper}

დამხმარე ატვირთავს ბაიტების კოდის ნაჭრებს, რეგისტრირებს ხელმოწერილ ტექნიკურ მანიფესს და წარადგენს ერთ `CommitContractDeployment` ოპერაციას. იგი ყოველ ტრანზაქციას საფასურით ციტირებს და უარს ამბობს შეთავაზებაზე, რომელიც ცვლის შერჩეულ გადამხდელს ან ტრანზაკციის შესრულების ხარჯებს.

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

ცარიელი `charge_limits` თხოვნა არ არის კოპირებული აქტივის იდენტიფიკატორი: დამხმარე ხელმოსაწერამდე იღებს ზუსტ ცოცხალ შეთავაზებას. შეადარეთ დაბრუნებული საფასური აქტივი ტესტური მონეტების გამცემის მიმდინარე პასუხთან. ხელშეკრულების ინვოკაციები იღებენ საფასურის შერჩევის უფლებას მხოლოდ ტიპირებული ცოცხალი შეთავაზების მეშვეობით; `gas_asset_id` ტრანზაქციის მეტამონაცემები არ შედის პირველი გამოშვების ხელშეკარგულების ნაწილი.

### 5. სიმულირაცია და გამოძახება განთავსებული შესასვლელი პუნქტი {#_5-simulate-and-call-the-deployed-entrypoint}

სიმულაცია აწარმოებს საჯარო შესასვლელ პუნქტს Torii წარდგენის გარეშე. შემდეგი ტექნიკური მოწოდება არის ტრანზაქცია და შესაბამისად ხაზგასმით ირჩევს ავტორიზაციის ძირითადი გადასახადის გადამხდელს. ორივე ბრძანება ამაყობს 1,500,000 ტრანზაკციის შესრულების ხარჯის ლიმიტს .

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## შემოწმება {#verify}

ამოხსნა ალიასი, მოძიება ქსელზე ტექნიკური მანიფესტი დაბრუნებული კოდის კრიპტოგრაფიული ჰეშით და სიმულაცია იმავე საჯარო შესასვლელი წერტილი კანონიკური მისამართით:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

განთავსება სრულდება მხოლოდ მაშინ, როდესაც ალიასი დარეგისტრირებულია დაბრუნებულ მისამართზე, ტექნიკური მანიფესტი წაკითხულია იმავე კოდის კრიპტოგრაფიული ჰეშის ქვეშ, ადგილობრივი და Torii სიმულაციების დაბრუნება `["3", "5"]`, ხოლო წარდგენილი ტექნიკური მოწოდება აღწევს `Applied`.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `CanRegisterSmartContractCode` ჩავარდნისათვის საჭიროა Taira ოპერატორის გრანტი ან ადგილობრივ ქსელში გენეზის/ბოტსტრაპის ცვლილება. ჩვეულებრივი ანგარიში ამ ნებართვის დამოუკიდებლად მინიჭებას ფაქტის შემდეგ არ შეუძლია.
- მმართველობა ან დაცული მარშრუტის უარყოფა ნიშნავს, რომ განთავსებას სჭირდება ზუსტი დამტკიცების ატრიბუცია, რომელიც ამ ქსელის მიერ მოითხოვება. კოორდინირეთ დამტკიცებულთა სია; არ შეიქმნას ანგარიშის ID-ები.
- მანიფესტის ან ABI-ის შეუსაბამობა ნიშნავს, რომ ბაიტკოდი, მანიფესტი და კვანძის შესრულების გარემო ერთსა და იმავე არტეფაქტს არ აღწერს. ჩანიშნულ კომიტზე თავიდან ააგეთ `--verify`-ით.
- `fee quote changed ... gas bound` ნიშნავს მოთხოვნილ ტიპირებულ განზრახვას და ცოცხალ შეთავაზებას, რომელიც არ ეთანხმება. ხელმოწერილი ტრანზაქციის შეცვლის ნაცვლად, გადაიხადე წინაპირობა.
- განთავსების დამხმარე უარყოფს ჩადგმული გასაღები, ნებადართული საკვანძო ფაილი რეჟიმები, სიმბოლური ბმულები და მრავლობითი დაკავშირებული ფაილები ქსელის წარდგენამდე.
- მხოლოდ ხედვის შესასვლელი წერტილის შეცდომა ნიშნავს, რომ `compute` არასწორი ბრძანების ოჯახის მეშვეობით გადაიყვანეს. ეს ნიმუში აცხადებს `kotoage`, ასე რომ გამოიყენეთ ტექნიკური მოწოდების სიმულაცია ან წარდგენა.
- კონტრაქტის გამოძახებები დადებით ტიპიზებულ გაზის ლიმიტს მოითხოვს. პირველი გამოშვების გამოძახების კონტრაქტი ზედა დონის გაზის ან საკომისიო აქტივის მეტამონაცემებს უარყოფს.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [Kotodama V1 ბრძანების განხორციელება ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [ორჯერ დაბრუნების წყარო ნიმუში დამაგრებული წყარო კოდის რევიზიის](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [მშობლიური განთავსების დამხმარე დამაგრებული წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [კონტრაქტის ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [ჭკვიანი ხელშეკრულებები](/ka/blockchain/smart-contracts.md)
- [რეფერენცია CLI](/ka/get-started/operate-iroha-via-cli.md)
