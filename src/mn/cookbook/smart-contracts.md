---
translation_locale: mn
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ухаалаг гэрээ байлгаж хэрэгжүүлээрэй {#build-and-deploy-a-smart-contract}

## Үр дүн {#outcome}

Kotodama V1 гэрээг шалгаж, боловсруулж, түүний олон нийтийн нэвтрүүлгийн цэгт орон нутгаар гүйцэтгэж, баталгаажуулсан IVM артефактыг ашиглаж, хэрэглэгдэж буй нэвтрүүлэх цэгтийг шинжилгээ хийж, албан байгууллагаас ялангуяа дурдсан төлбөрөөр өргөн мэдүүлсэн.

## Урьдчилсан шаардлага {#prerequisites}

- Iroha эх үүсвэрийн төлбөрийг `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust болон Cargo-д хангах.
- Одоогийн `iroha` CLI болон Taira үйлчлүүлэгчээс санхүүжүүлсэн [ харилцагч нь Taira ](./connect-to-taira.md)-д холбогдсон байна.
- Үндсэн чиглэлүүд `IROHA_CONFIG` болон `IROHA_PRIVATE_KEY_FILE`. Үндсэн файл нь эзэмшигчтэй, нэг холболттай тогтмол файл байх ёстой `0600`; Нэвтрүүлэгт туслах нь санаатайгаар хувийн ач холбогдолтой аргумент гаргахгүй байна.
- Taira үйлдвэрийн зөвшөөрөл. Гэрээний код бүртгүүлэх нь `CanRegisterSmartContractCode` шаарддаг бөгөөд хамгаалалттай ашиглалтын хувьд засаглал олгох, батлах шаардлагатай болно. Хэрэв Taira энэ боломжийг олгоогүй бол тухайн үйл ажиллагааг эх үүсвэр нь зөвшөөрлийг олгодог генезистэй орон нутгийн сүлжээ дээр гүйцэтгэээрэй.

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

## Хадгалт {#steps}

### 1. Мэдэгдэх сайн Kotodama V1 гэрээний хувилбар {#_1-copy-a-known-good-kotodama-v1-contract}

Iroha хяналтын сангийн дотор ажиллаж, компиляторын тупли-эргүүцлийн үлгэрийг нунтаглаж эх үүсвэр болон хэрэгслийн сүлжээг ижил үүрэг гүйцэтгэхээр үлдэнэ.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Бүхэл бүтэн эх үүсвэр нь бага бөгөөд одоогийн `seiyaku`/`kotoage` синтаксисыг ашигладаг:

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

Kotodama нь Iroha Виртуал машин болон түүний одоогийн ABI хэсгийг зорилт болгодог. Энэ бол WASM эсвэл EVM эх хэл биш.

### 2. Артефактыг шалгаж, барьж, баталгаажуулна {#_2-check-build-and-verify-the-artifact}

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

Эхний барилга нь артефакт болон баталгаажуулсан хавсралтын автомашин хэвлүүлж байна. Хоёр дахь нь зөвхөн уншигч `--verify` хэлбэрээр ажилладаг бөгөөд одоогийн эх үүсвэртэй яг нийцэхгүй бол хүчингүй болно. `.to` файл, түүний манифест нь нэг шалгагдсан барилга бүтээлийн гараатай харьцуулаарай.

### 3. Байт кодыг орон нутгийн хувьд ажиллуул. {#_3-run-the-bytecode-locally}

`compute` нь олон нийтийн `kotoage` нэвтрүүлгийн цэг юм. Энэ нь тухайн гүйлгээг ирүүлэхгүй, төлбөргүйгээр орон нутгийн түвшний эсрэг гүйцэтгэдэг `debug-call` ашиглан ажиллуулж болно.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama бүтэн тоог JSON жирээр дурддаг тул уншилтгүй тупл нь `["3", "5"]` юм.

### 4. Тус нутгийн туслалцаа эзэмшигчээр дамжуулан ашиглах {#_4-deploy-through-the-native-helper}

Хөдөлмөрийн туслах байткодын хэсгийг борлуулж, гарын үсэг зурсан манфист бүртгүүлж, нэг `CommitContractDeployment` үйлдлийг өргөн мэдүүлнэ. Энэ нь аливаа гүйлгээний төлбөрийг санаж, сонгогдсон төлөгч эсвэл газын бондыг өөрчлөх саналыг татгалзах болно.

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

Үгүй `charge_limits` хүсэлт нь хөрөнгийн тодруулсан тодорхойлогч биш юм: туслагч нь гарын үсэг зурахаасаа өмнө үнэн зөв шууд саналыг хүлээн авдаг. Буцаасан төлбөрийн хөрөнгийг одоогийн цахилгаан хариутай харьцуулаарай. Гэрээний дуудлагад хуучин `gas_asset_id` метабараа нэмэхгүй.

### 5. Хөдөлмөрийн нэвтрүүлгийн цэг рүү хийнэ, дуудлах {#_5-simulate-and-call-the-deployed-entrypoint}

Симулятор нь Torii нэвтрэх олон нийтийн цэг дээр ирүүлэхгүйгээр ажилладаг. Дараах дуудлага бол гүйлгээ бөгөөд энэ нь байгууллагын төлбөрийн төлөгчийг тодорхой сонгодог юм.

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

## Бүртгэнэ {#verify}

Үндсэн нэрсийг шийдэж, буцаасан код хэшээр зах зээлийн манифстийг аваарай, мөн ижил олон нийтийн нэвтрүүлгийн цэгтийг канончиллын хаягаар хийнэ:

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

Хөдөлгөөн нь зөвхөн буцааж өгсөн хаяг руу шилжсэн үедээ дуусдаг, манфист ижил код хэшийн дор уншиж болно, орон нутгийн болон Torii шинжилгээний хариу `["3", "5"]`, өргөн мэдүүлсэн дуудлага `Applied` -д хүрнэ.

## Ашигтвортой байдлыг шийдвэрлэх {#troubleshooting}

- `CanRegisterSmartContractCode` алдаа нь Taira үйлдвэрийн гүйцэтгэгчд олгох ёс эсвэл lokalnet дээр үүсэл / буутстрап өөрчлөлт хийх шаардлагатай.
- Удирдах ёс эсвэл хамгаалалттай замын татгалз нь ашиглалтанд оруулалтаар тодорхой зөвшөөрөл хэрэгтэй гэсэн үг юм тухайн сүлжээний шаардлагыг бүрдүүлэх; зөвшөөрөгчийн жагсаалтыг зохицуулах; бүртгэл бүтээхгүй байх IDs.
- Манифест эсвэл ABI үл тохиромжтой нь байткод, манифест, түймрийн гүйлгээний цаг нь ижил артефактыг тодорхойлдоггүй гэсэн үг юм. `--verify` -тэй холбогдсон commit-д дахин бариарай.
- `fee quote changed ... gas bound` гэдэг нь хүсэлтээ оруулсан зорилго, шууд саналыг зөрчсөн гэсэн үг. Гарын үсэг зурсан гүйлгээг өөрчлөхөөс илүү дахин урьдчилан сэргийлэх.
- Хөдөлмөрийн туслагч нь сүлжээний өргөн мэдүүлэхээс өмнө зайны түлхүүр, зөвшөөрөлтэй түлхэгийн файлын хэв маяг, симланк, холбогдсон файлуудыг дахин нэмэгдүүлэхийг үгүйсгэдэг.
- Зөвхөн үзэл баримтын нэвтрүүлгийн нүктейн алдаа нь `compute` буруу командын гэр бүлээр дамжуулан чиглэгдсэн гэсэн үг юм. Энэ үлгэр жишээ нь `kotoage` гэж мэдэгдэж байна, тиймээс дуудлага бэлтгэх эсвэл өргөн мэдүүлэх ашиглана.
- Гэрээний дуудлага нь эерэг хэлбэрийн газрын хязгаар шаарддаг. Хамгийн өндөр түвшний хуучин газ эсвэл төлбөрийн хөрөнгийн метабараа хүлээн зөвшөөрөхгүй байна.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Kotodama V1 командны хэрэгжилт хаалттай байгуулсан үүрэг гүйцэтгэхэд ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [Үргэлтийн эх үүсвэрийн үлгэрэл ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko) шилжилтэд
- [Үндэсний нэвтрүүлгийн туслагч ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs) байнгын үүрэг дээр
- [Гэрээний нэгтгэл шинжилгээ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs) байгуулсан үүрэг гүйцэтгэх
- [Ухаалаг гэрээ](/mn/blockchain/smart-contracts.md)
- [CLI дуудлага](/mn/get-started/operate-iroha-via-cli.md)
