---
translation_locale: mn
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ухаалаг гэрээг бүтээж, байрлуулах {#build-and-deploy-a-smart-contract}

## Үр дүн {#outcome}

Шалгаж, Kotodama V1 гэрээг компиляцлaж, түүний нийтийн орц цэгийг локалдаа гүйцэтгэж, батлагдсан IVM бүтээлийг байрлуулж, байрлуулсан орц цэгийг симуляц хийж, гүйлгээ гарын үсэг зурах данснаас төлсөн тодорхой төлбөрийн үнийн үнэлгээтэй хамт илгээнэ үү.

## Өмнөх шаардлага {#prerequisites}

- Iroha эх кодын ажиллах хувилбар нь протоколын эцсийн хэлэлцээр дээр `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust, ба Cargo-д байна.
- Одоогийн `iroha` CLI болон [Taira-д холбогдох](./connect-to-taira.md)-ээс санхүүжигдсэн Taira хэрэглэгч.
- `IROHA_CONFIG` ба `IROHA_PRIVATE_KEY_FILE`-д бүхэл замууд. Түлхүүр файл нь эзэмшигчийн эзлэн барьсан, нэг холбоосын энгийн файл байх ёстой бөгөөд горим нь `0600`; байрлуулах туслах программд зориудаар дотоод хувийн түлхүүр аргумент байхгүй.
- Taira операторын зөвшөөрөл. Гэрээний кодыг бүртгэхэд `CanRegisterSmartContractCode` шаардлагатай бөгөөд хамгаалалттай байрлуулалтуудад засаглалын атрибуц болон хэрэгжүүлэлт шаардагдах боломжтой. Хэрэв Taira уг нэвтрэх эрхийг олгоогүй бол зөвшөөрлийг олгодог блокчэйн генезис бүхий үүсгэсэн локал сүлжээнд байрлуулалтыг хий.

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

## Алхамууд {#steps}

### 1. Мэдэгдсэн сайн Kotodama V1 гэрээг хуулах {#_1-copy-a-known-good-kotodama-v1-contract}

Пинтэй Iroha шалгах хэсэгт дотор нь ажиллаад компиляторын tuple-ийг буцаах жишээг хуулж, эх сурвалж ба хэрэгслийн гинж нь ижил протоколын эцсийн байдлыг хадгалах.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Бүтэн эх сурвалж нь жижиг бөгөөд одоогийн `seiyaku`/`kotoage` синтаксийг ашиглана:

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

Kotodama нь Iroha Виртуал Машин болон түүний одоогийн ABI-г чиглүүлж байна. Энэ нь WASM эсвэл EVM эх сурвалжийн хэл биш юм.

### 2. Урлан бүтээлийг шалгах, барих, баталгаажуулах {#_2-check-build-and-verify-the-artifact}

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

Эхний бүтээц нь артефактыг болон баталгаажсан сайдкаруудыг нийтэлдэг. Хоёр дахь нь зөвхөн унших горимд `--verify` ажиллаж, өмнөх гаралт одоогийн эх үүсвэртэй яг таарахгүй бол амжилтгүй болно. `.to` файлыг болон түүний техникийн үзлэгийн файлыг нэг харьцсан бүтээцийн гаралт гэж үзнэ үү.

### 3. Байт кодыг локал дээр ажиллуулна {#_3-run-the-bytecode-locally}

`compute` бол олон нийтийн `kotoage` орц юм. Үүнийг `debug-call` ашиглан ажиллуул, энэ нь гүйлгээ илгээхгүйгээр эсвэл төлбөр төлөхгүйгээр локал туршилтын файлууд дээр гүйцэтгэгдэнэ.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama бүхэл тоонуудыг JSON мөрүүдээр дүрсэлдэг тул кодыг тайлсан tuple нь `["3", "5"]` байна.

### 4. Уг эх хэлний туслагчийн хооронд дамжуулах {#_4-deploy-through-the-native-helper}

Туслах програм байт кодын хэсгүүдийг оруулж, гарын үсэг бүхий техникийн жагсаалтыг бүртгэж, нэг `CommitContractDeployment` үйлдлийг илгээдэг. Энэ нь бүх гүйлгээг төлбөрийн үнээр тооцоолж, сонгогдсон төлөгч эсвэл гүйлгээг гүйцэтгэх зардлын хязгаар өөрчлөгдсөн үнэлгээг эс хүлээнэ.

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

Хоосон `charge_limits` хүсэлт нь хуулбарласан хөрөнгийн танигч биш болно: туслах нь гарын үсэг зурахаас өмнө яг амьд үнийн саналыг хүлээн авдаг. Буцаж ирсэн төлбөрийн хөрөнгийг одоогийн тестнет санхүүжүүлэх үйлчилгээний хариутай харьцуул. гэрээний дуудлагууд зөвхөн бичгийн амьд үнийн саналын дагуу төлбөрийг сонгохыг хүлээн авдаг; `gas_asset_id` гүйлгээний мета өгөгдөл нь анхны гарсан гэрээний хэсэг биш юм.

### 5. Суулгасан орцын цэгийг симуляци хийж, дуудах {#_5-simulate-and-call-the-deployed-entrypoint}

Симуляци нь нийтэд нээлттэй орцоор Torii-д гаргахад оруулахгүйгээр ажиллуулдаг. Дараах техникийн дуудлага нь гүйлгээ бөгөөд үүний улмаас эрх олгох гол төлөгчийг тодорхой зааж сонгодог. Аль алины командыг 1,500,000 гүйлгээний гүйцэтгэлийн зардлын хязгаартаа барьдаг.

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

## Баталгаажуулах {#verify}

Нэршлийг задлаад, буцаагдсан кодын криптографийн хэшийг ашиглан гинжийн дээрх техникийн manifest-ийг авах, мөн нэг протокол стандартад нийцсэн хаягаар ижил олон нийтийн орох цэгийг симуляци хийх:

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

Суурилуулалт зөвхөн дараах нөхцлүүд биелсэн тохиолдолд л дуусгавар болно: овог нэр нь буцаагдсан хаяг руу зааж байвал, техникийн жагсаалт адил кодын криптографын hash дээр уншигдаж байвал, локал болон Torii симуляциуд `["3", "5"]` үр дүнг буцааж байвал, мөн илгээсэн техникийн дуудлага `Applied` хүртэл хүрсэн байвал.

## Алдааг олох болон засах {#troubleshooting}

- `CanRegisterSmartContractCode` алдаанууд нь Taira операторын эрхийг өгөх эсвэл localnet дээр genesis/bootstrap өөрчлөлт хийхийг шаарддаг. Энгийн акаунт дараа нь өөрөө энэ эрхийг олгож чадахгүй.
- Удирдлага эсвэл хамгаалагдсан эгнээгээс татгалзах нь тухайн сүлжээнд шаардлагатай яг зөв зөвшөөрөгчийн атрибутыг ашиглан хэрэгжүүлэх хэрэгтэй гэсэн үг юм. Зөвшөөрөгчийн жагсаалтыг зохицуул; дансны ID бүтээж болохгүй.
- Манифест эсвэл ABI зөрөх нь bytecode, манифест болон зангилааны гүйцэтгэх орчин нэг артефактыг тайлбарлахгүй байгааг илтгэнэ. Тогтоосон commit дээр `--verify` ашиглан дахин бүтээнэ.
- `fee quote changed ... gas bound` нь хүссэн бичгийн зорилго ба амьд үнийн санал хоорондоо зөрж байгааг илэрхийлнэ. Гарын үсэг зурсан гүйлгээг өөрчлөхийн оронд дахин шалга.
- Тархах туслах inline түлхүүрүүд, нээлттэй түлхүүр-файлын горимууд, симбол холбоосууд, олон удаа холбоос үүсгэсэн файлуудыг сүлжээний илгээхээс өмнө татгалздаг.
- Зөвхөн харах зориулалттай эхлэх цэгийн алдаа нь `compute`-ийг буруу командын гэр бүлээр дамжуулсан гэсэн үг юм. Энэ жишээ нь `kotoage`-ийг тунхаглаж байна, тиймээс техникийн дуудах симуляци эсвэл илгээлийг ашигла.
- Гэрээний дуудлага нь төрөлжсөн, эерэг gas хязгаар шаардана. Эхний гаргалтын дуудлагын гэрээ дээд түвшний gas эсвэл шимтгэлийн хөрөнгийн мета өгөгдлийг татгалзана.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Kotodama V1 тушаалын хэрэгжилт тогтоосон эх кодын хувилбарт](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Тодорхойлсон эх кодын хувилбарт Tuple буцаах эх жишээ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Бэхлэгдсэн эх кодын хувилбар дахь угсаатны байрлуулалтын туслах](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Гэрээний интеграцийн тестүүдийг тогтоосон эх кодын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Өөрөө гүйцэтгэгдэх гэрээнүүд](/mn/blockchain/smart-contracts.md)
- [CLI лавлагаа](/mn/get-started/operate-iroha-via-cli.md)
