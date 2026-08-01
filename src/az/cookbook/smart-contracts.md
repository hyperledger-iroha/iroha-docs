---
translation_locale: az
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ağıllı müqavilə qurun və tətbiq edin {#build-and-deploy-a-smart-contract}

## Nəticə {#outcome}

Kotodama V1 müqaviləsinin yoxlanılması və tərtib edilməsi, onun ictimai giriş nöqtəsini yerli səviyyədə icra etmək; təsdiqlənmiş IVM artefaktı yerləşdirin, yerləşdirilmiş giriş nöqtəsini təxmin edin; və açıq şəkildə qeyd olunan bir orqan tərəfindən ödənilən ödənişlə təqdim edilir.

## Əvvəlki şərtlər {#prerequisites}

- Iroha, `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust və Cargo ünvanlarında bir mənbə yoxlama.
- Gündəlik `iroha` CLI əlavə maliyyələşdirilmiş Taira müştəri [Bağlantı Taira](./connect-to-taira.md).
- Mümkün olmayan yollar `IROHA_CONFIG` və `IROHA_PRIVATE_KEY_FILE`. Klavye faylı mode ilə sahibinin saxladığı, bir bağlantılı müntəzəm fayl olmalıdır `0600`; İstifadəçi məqsədyönlü olaraq gizli açarlı heç bir mübahisə etməyib.
- Taira operatorun təsdiqlənməsi. Müqavilə kodunun qeydiyyatı `CanRegisterSmartContractCode` tələb edir və qorunan yerləşdirmələr idarəetmə təyinatı və qanunvericiliyi tələb edə bilər. Əgər Taira bu giriş təmin etməyibsə, icazəni verilən mənşəli yerli şəbəkədə yerləşdirilməsini həyata keçirsin.

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

## Dərslər {#steps}

### 1. Məlum olan müqavilənin Kotodama V1 nüsxəsi {#_1-copy-a-known-good-kotodama-v1-contract}

Bağlanmış Iroha kassa daxilində çalışın və tərtibçinin tuple-return nümunəsini kopyalayın ki, mənbə və vasitə zəncirləri eyni komitdə qalsınlar.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Tam mənbə kiçikdir və hazırkı `seiyaku`/`kotoage` sintaksından istifadə edir:

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

Kotodama Iroha Virtual Maşını və onun hazırkı ABI hədəfidir. Bu, WASM və EVM mənbə dili deyil.

### 2. Əsərləri yoxlayın, tikin və təsdiqləyin. {#_2-check-build-and-verify-the-artifact}

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

Birinci quraşdırma artefaktı və təsdiqlənmiş yan maşınları yayımlayır. İkincisi yalnız oxunma `--verify` rejimində işləyir və mövcud olan hər hansı bir çıxışı cari mənbə ilə tam uyğun deyilsə, uğursuz olur. `.to` faylını və manifestini nəzərdən keçirilən bir quraşdırma çıxışı kimi qəbul edin.

### 3. Byte kodunu yerli olaraq icra edin. {#_3-run-the-bytecode-locally}

`compute` ictimai `kotoage` giriş nöqtəsidir. Bir əməliyyat üçün təqdim etmədən və ya ödəmədən yerli qurğulara qarşı icra edən `debug-call` ilə idarə edin.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama tam rəqəmləri JSON simvolları kimi tərcümə olunur, belə ki, kəşf edilmiş tuple `["3", "5"]` olur.

### 4. Yerli köməkçi vasitəsilə yerləşdirin. {#_4-deploy-through-the-native-helper}

Yardımçı bytecode parçalarını yükləyir, imzalanan manifestı qeydiyyatdan keçirir və bir `CommitContractDeployment` əməliyyatı təqdim edir. Hər bir əməliyyat üçün ödəniş quote verir və seçilmiş ödəyicini və ya qaz bağını dəyişdirən bir təklifdən imtina edir.

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

Boş `charge_limits` tələbi kopyalanmış bir aktiv kimliyi deyil: köməkçi imzalanmadan əvvəl dəqiq canlı quote qəbul edir. Geri qaytarılan ödəniş aktivini cari kran cavabı ilə müqayisə edin. Müqavilə çağırışlarına miras qalan `gas_asset_id` metadataları əlavə etməyin.

### 5. İstifadə olunmuş giriş nöqtəsini simulyasiya edin və çağırın. {#_5-simulate-and-call-the-deployed-entrypoint}

Simulyasiya ictimai giriş nöqtəsini Torii daxil etmədən icra edir. Aşağıdakı çağırış bir əməliyyatdır və buna görə də səlahiyyət haqqı ödəyicisini açıq şəkildə seçir. Hər iki əmr 1500,000 qaz həddini bağlayır.

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

## Tətbiq edin {#verify}

Əksi adı həll edin, silsilədəki manifestı qaytarılmış kod həşi ilə əldə edin və eyni ictimai giriş nöqtəsini kanonik ünvanla simulyasiya edin:

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

İstifadə yalnız alias geri qaytarılmış ünvana uyğunlaşdıqda tamamlanır, manifest eyni kod hash altında oxuna bilər. yerli və Torii simulyasiyaların qaytarılması `["3", "5"]`, və təqdim edilən çağırış `Applied`.

## Problemlərin həlli {#troubleshooting}

- `CanRegisterSmartContractCode` uğursuzluqları üçün Taira operator grantı və ya localnet-də genesis/bootstrap dəyişikliyi tələb olunur.
- İdarəetmə və ya qorunan zolağın rədd edilməsi deməkdir ki, tətbiq həmin şəbəkənin tələb etdiyi dəqiq təsdiqləyici təyinatına ehtiyac duyur. Təsdiqləyici siyahısını əlaqələndirin; hesab IDs icad etməyin.
- Manifest və ya ABI uyğunsuzluq deməkdir ki, bytecode, manifest və node runtime eyni artefakt təsvir etmir. `--verify`.
- `fee quote changed ... gas bound` tələb olunan yazılmış niyyət və canlı quote razı deyil. İmzalanmış bir əməliyyat dəyişdirmək əvəzinə yenidən əvvəlcədən.
- Deploy köməkçisi şəbəkə təqdim etməzdən əvvəl xətti açarları, icazəli açar fayl rejimlərini, simlinkləri və əlaqəli sənədləri çoxaldır.
- Yalnız görünüş giriş nöqtəsi səhv `compute` yanlış əmr ailəsi vasitəsilə yönəldilir deməkdir. Bu nümunə `kotoage` bəyan edir, buna görə də zəng simulyasiyasından və ya təqdimatdan istifadə edin.
- Müqavilə çağırışları müsbət qaz məhdudiyyətini tələb edir. Ən yüksək səviyyəli irsi qaz və ya ödəniş aktivinin metadataları rədd edilir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Kotodama V1 əmrinin bağlanmış komitdə icrası ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [Tüple-return mənbə nümunəsi sabitləşdirilmiş komitdə](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Bağlanmış komitdə yerli yerləşdirmə köməkçisi](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Müqavilə inteqrasiya sınaqları bağlanmış komitdə ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs)
- [Ağıllı müqavilələr](/az/blockchain/smart-contracts.md)
- [CLI istinadı](/az/get-started/operate-iroha-via-cli.md)
