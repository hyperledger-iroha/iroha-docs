---
translation_locale: ka
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# შექმენით და განახორციელეთ ჭკვიანი ხელშეკრულება {#build-and-deploy-a-smart-contract}

## შედეგები {#outcome}

შეამოწმეთ და შეადგინეთ Kotodama V1 ხელშეკრულება, განახორციელეთ მისი საჯარო შესასვლელი ადგილობრივად, განათავსეთ შემოწმებული IVM არტეფაქტი, სიმულირირეთ განთავსებული შესასვლელის პუნქტი და წარუდგინეთ იგი ხელისუფლების მიერ მკაფიოდ მითითებული გადასახადის თანხა.

## წინაპირობები {#prerequisites}

- Iroha წყაროზე გადარიცხვა კომიტეტზე `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust და ტვირთში.
- მიმდინარე `iroha` CLI პლუს დაფინანსებული Taira კლიენტი [დაკავშირდით Taira](./connect-to-taira.md).
- აბსოლუტური ბილიკები `IROHA_CONFIG` და `IROHA_PRIVATE_KEY_FILE`. საკვანძო ფაილი უნდა იყოს მფლობელის მიერ განთავსებული, ერთბმული რეგულარული ფაილი რეჟიმით `0600`; დანერგვის დამხმარეს მიზანმიმართულად არ აქვს კერძო გასაღების არგუმენტი.
- Taira ოპერატორის დამტკიცება. ხელშეკრულების კოდის რეგისტრაცია მოითხოვს `CanRegisterSmartContractCode`, ხოლო დაცული განთავსებები შეიძლება მოითხოვოს მმართველობის მინიჭება და კანონმდებლობა. თუ Taira არ აძლევს ამ წვდომას, განახორციელეთ განთავსება გენერირებულ ადგილობრივ ქსელში, რომლის წარმოშობითაც ნებართვა იძლევა.

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

მუშაობა ჩაკეტილი Iroha checkout და ასახვა კომპილატორის tuple-ბრუნვა ნიმუში, ასე რომ წყარო და ინსტრუმენტების ჯაჭვი რჩება იმავე commit.

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

პირველი ნაგებობა აქვეყნებს არტეფაქტს და ავტორიზებულ გვერდითი მანქანებს. მეორე მუშაობს მხოლოდ წაკითხვის რეჟიმში `--verify` და ჩავარდება, თუ რომელიმე არსებული გამოსავალი ზუსტად არ შეესაბამება მიმდინარე წყაროს. განიხილეთ `.to` ფაილი და მისი მანიფისი როგორც ერთი გადამოწმებული ნაგებობის გამოსავალი.

### 3. განახორციელეთ ბაიტების კოდი ადგილობრივად {#_3-run-the-bytecode-locally}

`compute` არის საჯარო `kotoage` შესასვლელი პუნქტი. განახორციელეთ იგი `debug-call`-ით, რომელიც ადგილობრივი მოწყობილობების წინააღმდეგ იმოქმედებს ისე, რომ ტრანზაქციის წარდგენა ან გადახდა არ მოხდება.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama მთლიანი რიცხვები წარმოდგენილია როგორც JSON სიმები, ამიტომ დეკოდირებული ტუპლი არის `["3", "5"]`.

### 4. განლაგება ადგილობრივი დამხმარის საშუალებით. {#_4-deploy-through-the-native-helper}

დამხმარე ატვირთავს ბაიტკოდის ნაჭრებს, რეგისტრირებს ხელმოწერილ მანიფესს და წარუდგენს ერთ `CommitContractDeployment` ოპერაციას. იგი ყოველ ტრანზაქციას საფასურით ციტირებს და უარს ამბობს ციტატაზე, რომელიც შეცვლის შერჩეულ გადამხდელს ან გაზის ბაინდს.

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

ცარიელი `charge_limits` მოთხოვნა არ არის კოპირებული აქტივის იდენტიფიკატორი: დამხმარე ხელმომწერამდე იღებს ზუსტ ცოცხალ შეთავაზებას. შეადარეთ დაბრუნებული საფასურის აქტივი ამჟამინდელ რეაგირებასთან. ხელშეკრულების ზარებში არ მიაერთეთ მემკვიდრეობითი `gas_asset_id` მეტა მონაცემები.

### 5. სიმულაცია და ზარი განთავსებული შესასვლელი პუნქტის {#_5-simulate-and-call-the-deployed-entrypoint}

სიმულაცია აწარმოებს საჯარო შესასვლელ პუნქტს Torii წარდგენის გარეშე. შემდეგი ზარი არის ტრანზაქცია და შესაბამისად ხაზგასმით ირჩევს ავტორიტეტული გადასახადის გადამხდელს. ორივე ბრძანება ამაყობს 1500 000 გაზის ლიმიტს.

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

ამოხსნათ alias, მოიტანეთ ქსელში მანიფესტი დაბრუნებული კოდის ჰეშით და სიმულაცია იმავე საჯარო შესასვლელი წერტილი კანონიკური მისამართით:

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

განთავსება სრულდება მხოლოდ მაშინ, როდესაც ანალიზი დარეგისტრირებულია დაბრუნებულ მისამართზე, მანიფესტის წაკითხვა ხდება იმავე კოდის ჰეშის ქვეშ, ადგილობრივი და Torii სიმულაციების დაბრუნება `["3", "5"]`, ხოლო წარდგენილი ზარი აღწევს `Applied`.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `CanRegisterSmartContractCode` ჩავარდნისათვის საჭიროა Taira ოპერატორის გრანტი ან ადგილობრივ ქსელში გენეზის/ბოტსტრაპის ცვლილება. ჩვეულებრივი ანგარიში ამ ნებართვის დამოუკიდებლად მინიჭებას ფაქტის შემდეგ არ შეუძლია.
- მმართველობა ან დაცული მარშრუტის უარყოფა ნიშნავს, რომ განთავსებას სჭირდება ზუსტი დამტკიცების მინიჭება, რომელიც ამ ქსელის მიერ მოითხოვს. კოორდინირეთ დამტკიცების ჩამონათვალი; არ შექმნან ანგარიში IDs.
- manifest ან ABI შეუსაბამობა ნიშნავს, რომ ბაიტო კოდი, manifest და node runtime არ აღწერენ იმავე არტეფაქტს. აღადგინეთ ჩაკეტილ commit- ზე `--verify`.
- `fee quote changed ... gas bound` ნიშნავს მოთხოვნილ ტიპირებულ განზრახვას და ცოცხალ შეთავაზებას, რომელიც არ ეთანხმება. ხელმოწერილი ტრანზაქციის შეცვლის ნაცვლად, გადაიხადე წინაპირობა.
- განთავსების დამხმარე უარყოფს inline გასაღები, ნებადართული საკვანძო ფაილი რეჟიმები, symlinks და მრავლობითი დაკავშირებული ფაილები ქსელის წარდგენამდე.
- მხოლოდ ნახვა შესასვლელი წერტილის შეცდომა ნიშნავს, რომ `compute` არასწორი ბრძანების ოჯახის მეშვეობით გადაიყვანეს. ეს ნიმუში აცხადებს `kotoage`, ამიტომ გამოიყენეთ მოწოდების სიმულაცია ან წარდგენა.
- ხელშეკრულების ზარები მოითხოვს პოზიტიურ ტიპირებულ გაზის ლიმიტს. უმაღლესი დონის მემკვიდრეობითი გაზი ან საფასური აქტივების მეტა მონაცემები უარყოფითად არის გამოყენებული.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [Kotodama V1 ბრძანების განხორციელება ჩაკეტილ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [ტუპლის დაბრუნების წყარო ნიმუში ჩაკეტილი კომიტზე ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [ადგილობრივი განთავსების დამხმარე ჩაკეტილ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [ხელშეკრულების ინტეგრაციის ტესტები ჩაკეტილი კომპიუტერზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs)
- [ჭკვიანი ხელშეკრულებები](/ka/blockchain/smart-contracts.md)
- [რეფერენცია CLI ](/ka/get-started/operate-iroha-via-cli.md)
