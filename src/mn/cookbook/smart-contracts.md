---
translation_locale: mn
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Ухаалаг гэрээг бүтээж, байрлуулах {#build-and-deploy-a-smart-contract}

## Үр дүн {#outcome}

Kotodama V1 гэрээг шалгаж, компиляц хийгээд, түүний нийтийн view функцийг локалаар ажиллуулж, баталгаажсан IVM артефактыг эрх бүхий данс төлөх, тодорхой сонгосон төлбөртэйгээр байрлуулж, байрлуулсан view функцийг Torii-ээр уншина.

## Өмнөх шаардлага {#prerequisites}

- Iroha эх кодын ажиллах хувилбар нь протоколын эцсийн хэлэлцээр дээр `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust, ба Cargo-д байна.
- Одоогийн `iroha` CLI болон `musubi` (эх кодын хуулбарт `cargo run -p musubi --` хэлбэрээр ажиллуулна), мөн [Taira-д холбогдох](./connect-to-taira.md) хэсгээс авсан санхүүжүүлсэн Taira клиент.
- `IROHA_CONFIG` дахь абсолют зам. Musubi-ийн сүлжээний холболт энэ клиент файлын лавлагааг хадгалж, байрлуулалтад түүний дансны түлхүүрээр гарын үсэг зурдаг.
- Alias-ийн эрх мэдэл. Гүйцэтгэгч нь гэрээний яг alias эсвэл түүний эх хүрээнд `CanManageAccountAlias`-г шаарддаг: `name::domain.dataspace`-ийн хувьд харьяалах домэйн, `name::dataspace`-ийн хувьд өгөгдлийн орон зай. Бүртгэлтэй дансуудад кодын бүртгэлийн тусдаа зөвшөөрөл хэрэггүй бөгөөд хамгаалагдсан нэрийн орон зайнууд мөн сүлжээний засаглалын ажлын урсгалыг шаарддаг. Жишээнүүд `cookbook_tuple::universal`-г ашигладаг; Taira дээр үүнийг өөрийн эзэмшдэг домэйн дахь alias-аар солих, эсвэл genesis нь alias-ийн хүрээг олгодог үүсгэсэн локал сүлжээнд байрлуул.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Алхамууд {#steps}

### 1. Мэдэгдсэн сайн Kotodama V1 гэрээг хуулах {#_1-copy-a-known-good-kotodama-v1-contract}

Пинтэй Iroha шалгах хэсэгт дотор нь ажиллаад компиляторын tuple-ийг буцаах жишээг хуулж, эх сурвалж ба хэрэгслийн гинж нь ижил протоколын эцсийн байдлыг хадгалах.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Бүрэн эх код жижиг: нэг хувийн туслах `fn` болон бүх дуудагчийг тодорхой зөвшөөрдөг, зөвхөн унших нэг нийтийн `view fn`:

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

Kotodama нь Iroha Виртуал Машин болон түүний одоогийн ABI-г чиглүүлж байна. Энэ нь WASM эсвэл EVM эх сурвалжийн хэл биш юм.

### 2. Урлан бүтээлийг шалгах, барих, баталгаажуулах {#_2-check-build-and-verify-the-artifact}

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

Эхний бүтээц нь артефактыг болон баталгаажсан сайдкаруудыг нийтэлдэг. Хоёр дахь нь зөвхөн унших горимд `--verify` ажиллаж, өмнөх гаралт одоогийн эх үүсвэртэй яг таарахгүй бол амжилтгүй болно. `.to` файлыг болон түүний техникийн үзлэгийн файлыг нэг харьцсан бүтээцийн гаралт гэж үзнэ үү.

### 3. Байт кодыг локал дээр ажиллуулна {#_3-run-the-bytecode-locally}

`compute` нь зөвхөн унших нийтийн `view fn` юм. Үүнийг `debug-view`-ээр ажиллуул; энэ нь компиляц хийсэн байт кодыг сонголттой туршилтын өгөгдөл ашиглан локалаар гүйцэтгэдэг бөгөөд гүйлгээ илгээдэггүй, төлбөр төлдөггүй.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama бүхэл тоонуудыг JSON мөрүүдээр дүрсэлдэг тул кодыг тайлсан tuple нь `["3", "5"]` байна.

### 4. Баталгаажсан артефактыг Musubi-ээр байрлуулах {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` нь гэрээг шалгаж, view-г ажиллуулж, дибаг хийдэг ч байрлуулдаггүй тул Taira дээрх байрлуулалт Musubi-ээр явагдана. Түүний байрлуулалтын үйлчилгээ байт кодын хэсгүүдийг байршуулж, баталгаажсан манифестыг бүртгээд, нэг `CommitContractDeployment` үйлдлийг илгээдэг. Энэ нь гүйлгээ бүрт үнийн санал авч, сонгосон төлөгч, ивээн тэтгэгчийн хувилбар эсвэл gas хязгаарыг өөрчилсөн үнийн саналаас татгалздаг бөгөөд түгжигдсэн багцын бүтээлт урьдчилан бүтээсэн артефактын код болон ABI хэшийг дахин гаргаж чадсаны дараа л түүнийг байрлуулдаг. Kagami-ийн удирддаг локал сүлжээнд оронд нь `kagami contract deploy` нь `./build/tuple_return_demo.to`-г `--alias cookbook_tuple::universal --json`-тэй байрлуулдаг; түүний баримт `.receipt` доор байх бөгөөд `kagami context show` нь `IROHA_CONFIG` болгон ашиглах клиентийн тохиргоог хэвлэдэг.

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

Холболт нь `--fee-payer authority`-г ашигладаг; Musubi нь гарын үсэг зурахаас өмнө яг төлбөрийг Taira-ийн төлбөрийн хөрөнгөөр тооцоолж, үнийн санал гаргадаг. Буцаж ирсэн төлбөрийн хөрөнгийг faucet-ийн одоогийн бодлогын нийтэлсэн хөрөнгөтэй харьцуул. Гэрээний дуудлагууд төлбөрийн сонголтыг зөвхөн төрөлжсөн, бодит цагийн үнийн саналаар хүлээн авдаг; `gas_asset_id` гүйлгээний метадата нь анхны хувилбарын гэрээний нөхцөлд хамаарахгүй.

### 5. Байрлуулсан view функцийг унших {#_5-read-the-deployed-view}

`contract view` нь зөвхөн унших орох цэгийг Torii дээр гүйлгээ, төлбөргүйгээр гүйцэтгэдэг. View функц гүйлгээний хэлбэргүй: Torii өөрийн дуудлагын маршрутууд дээр view сонгогчийг татгалздаг.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Баталгаажуулах {#verify}

Alias-ийг тодруулж, байрлуулсан view функцийн хувьд Torii-ийн мэдээлсэн кодын хэшээр сүлжээн дээрх манифестыг татаж аваад, ижил view функцийг каноник хаягаар ажиллуул:

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

Байрлуулалт зөвхөн дараах тохиолдолд дууссан тооцогдоно: байрлуулалтын баримт хадгалсан артефактыг баталгаажсан гэж мэдээлсэн, alias буцаагдсан хаяг руу тодорхойлогддог, манифест ижил кодын хэшээр уншигддаг, мөн локал болон Torii-ийн view дуудлагууд `["3", "5"]`-г буцаадаг.

## Алдааг олох болон засах {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`, эсвэл гүйцэтгэгчийн `authority is not permitted to manage contract alias` нь тухайн данс тэр alias-ийг холбох эрхгүй гэсэн үг. Өөрийн эзэмшдэг домэйн дахь alias-ийг ашигла, эсвэл яг тухайн alias-ийн эрхийн олголт, эсвэл түүний домэйн эсвэл өгөгдлийн орон зайн эрхийн олголтыг тэр хүрээний эзэмшигчээс ав; localnet дээр үүнийг genesis-д олго.
- Хамгаалагдсан нэрийн орон зайн татгалзал нь alias-ийн нэрийн орон зай засаглалын хяналтад байгааг илэрхийлнэ. Батлагчдын дансны ID-г жагсаах нь батламжийн нотолгоо биш; тэр нэрийн орон зайд сүлжээний засаглалын ажлын урсгалыг (`iroha app gov deploy propose`) ашигла, эсвэл түүнээс гадуурх alias сонго.
- Манифест эсвэл ABI-ийн зөрүү нь байт код, манифест болон зангилааны гүйцэтгэх орчин ижил артефактыг дүрслэхгүй байгааг илтгэнэ. Тогтоосон commit дээр дахин бүтээгээд, дараа нь бүтээлтийг `--verify`-тэй дахин ажиллуул.
- `fee quote changed ... gas bound` нь хүссэн бичгийн зорилго ба амьд үнийн санал хоорондоо зөрж байгааг илэрхийлнэ. Гарын үсэг зурсан гүйлгээг өөрчлөхийн оронд дахин шалга.
- Тасалдсан байрлуулалт гарын үсэгтэй төлөвлөгөөгөө журналд хадгалдаг. Шинэ төлөвлөгөөнд гарын үсэг зурахын оронд үүнийг `musubi deploy --resume <JOURNAL>`-ээр сэргээ.
- `is read-only and cannot be invoked as a transaction` эсвэл `is not a kotoage or lifecycle entrypoint` нь `compute`-ийг дуудлагын команд руу илгээсэн гэсэн үг. Энэ жишээ `view fn`-ийг зарладаг тул локалаар `debug-view`, Torii дээр `view`-г ашигла.
- Гэрээний дуудлага нь төрөлжсөн, эерэг gas хязгаар шаардана. Эхний гаргалтын дуудлагын гэрээ дээд түвшний gas эсвэл шимтгэлийн хөрөнгийн мета өгөгдлийг татгалзана.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Тогтоосон commit дахь Kotodama V1 командын хэрэгжүүлэлт](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Тодорхойлсон эх кодын хувилбарт Tuple буцаах эх жишээ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- Тогтоосон commit дахь [Musubi-ийн байрлуулах команд](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) болон [гэрээ байрлуулах уугуул үйлчилгээ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [Гэрээний интеграцийн тестүүдийг тогтоосон эх кодын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Өөрөө гүйцэтгэгдэх гэрээнүүд](/mn/blockchain/smart-contracts.md)
- [CLI лавлагаа](/mn/get-started/operate-iroha-via-cli.md)
