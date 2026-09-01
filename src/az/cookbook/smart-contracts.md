---
translation_locale: az
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ağıllı müqavilə yaradın və yerləşdirin {#build-and-deploy-a-smart-contract}

## Nəticə {#outcome}

Kotodama V1 müqaviləsini yoxlayın və tərtib edin, onun ictimai giriş nöqtəsini yerli olaraq icra edin, təsdiqlənmiş IVM artefaktını yerləşdirin, yerləşdirilmiş giriş nöqtəsini simulyasiya edin və əməliyyatın imzalanma hesabı tərəfindən ödənilən açıq şəkildə göstərilmiş ödəniş qiyməti ilə təqdim edin.

## Tələb olunan əvvəlcədən şərtlər {#prerequisites}

- `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust və Cargo-da protokolun yekunlaşdırılması zamanı Iroha mənbə kodunun işlək nüsxəsi.
- Hazırkı `iroha` CLI ilə birlikdə [Taira-ə qoşul](./connect-to-taira.md) -dən maliyyələşdirilmiş Taira müştəri.
- `IROHA_CONFIG` və `IROHA_PRIVATE_KEY_FILE`də tam yollar. Açar fayl sahibi tərəfindən saxlanılan, tək-linkli adi fayl olmalı və rejimi `0600` olmalıdır; yerləşdirmə köməkçisi bilərəkdən heç bir inline şəxsi açar arqumentinə malik deyil.
- Taira operator təsdiqi. Müqavilə kodunun qeydiyyatı `CanRegisterSmartContractCode` tələb edir və qorunan yerləşdirmələr idarəetmə təhlili və icrasını tələb edə bilər. Əgər Taira bu girişi verməyibsə, icazəni təmin edən blokçeyn başlanğıcı olan yaradılmış yerli şəbəkədə yerləşdirməni yerinə yetirin.

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

## Addımlar {#steps}

### 1. Məlum-olar yaxşı Kotodama V1 müqaviləni kopyalayın {#_1-copy-a-known-good-kotodama-v1-contract}

Pinlənmiş Iroha çekaut daxilində işləyin və mənbə və alət dəstinin eyni protokol yekunlaşmasında qalması üçün tərtibçinin cüt-təkrarlanan qaytarış nümunəsini kopyalayın.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Tam mənbə kiçikdir və mövcud `seiyaku`/`kotoage` sintaksisini istifadə edir:

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

Kotodama Iroha Virtual Maşını və onun cari ABI-ini hədəfləyir. Bu, WASM və ya EVM mənbə dili deyil.

### 2. Artefakti yoxlayın, yaradın və təsdiqləyin {#_2-check-build-and-verify-the-artifact}

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

Birinci quruluş artefaktı və təsdiqlənmiş yan yük maşınlarını yayımlayır. İkincisi yalnız oxuma rejimində `--verify` işləyir və mövcud çıxışlardan hər hansı biri cari mənbə ilə tam uyğun deyilsə, uğursuz olur. `.to` faylını və onun texniki manifestini bir baxılmış quruluş çıxışı kimi nəzərdən keçirin.

### 3. Baytkodu yerli olaraq işə salın {#_3-run-the-bytecode-locally}

`compute` bir ictimai `kotoage` giriş nöqtəsidir. Onu `debug-call` ilə işlədin, bu isə əməliyyatı təqdim etmədən və ya ödəniş etmədən yerli test artefaktları üzərində icra edir.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama tam ədədlər JSON sətrlər kimi göstərilir, buna görə dekodlanmış tuple `["3", "5"]` olur.

### 4. Yerli köməkçi vasitəsilə yerləşdirin {#_4-deploy-through-the-native-helper}

Köməkçi bayt kodu parçalarını yükləyir, imzalanmış texniki manifesto qeydiyyatdan keçirir və bir `CommitContractDeployment` əməliyyatı təqdim edir. O, hər əməliyyat üçün ödəniş təklifini təqdim edir və seçilmiş ödəyici və ya əməliyyatın icra xərci həddini dəyişən təklifi qəbul etmir.

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

Boş `charge_limits` sorğusu kopyalanmış aktiv identifikatoru deyil: köməkçi imzalamaqdan əvvəl dəqiq canlı təklifi qəbul edir. Qaytarılmış ödəniş aktivini cari testnet maliyyələşdirmə xidməti cavabı ilə müqayisə edin. Kontrakt çağırışları yalnız tipli canlı təklif vasitəsilə ödəniş seçimini qəbul edir; `gas_asset_id` əməliyyat metadatası ilk buraxılış kontraktının bir hissəsi deyil.

### 5. Yerləşdirilmiş giriş nöqtəsini simulasiya edin və çağırın {#_5-simulate-and-call-the-deployed-entrypoint}

Simulyasiya Torii üzərində ictimai giriş nöqtəsini təqdim etmədən işə salır. Aşağıdakı texniki çağırış bir əməliyyatdır və buna görə də səlahiyyət verən əsas ödənişçini açıq şəkildə seçir. Hər iki əmr 1,500,000 əməliyyat icra xərcləri limitini bağlayır.

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

## Yoxla {#verify}

Əvəzinə keçidi həll edin, qaytarılan kod kriptoqrafik xashı ilə blokzincirdəki texniki manifesti əldə edin və eyni ictimai giriş nöqtəsini tək bir protokol-standart ünvanla simulyasiya edin:

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

Yerləşdirmə yalnız alias qaytarılan ünvana həll olunduqda, texniki manifest eyni kod kriptoqrafik hash altında oxuna bildikdə, lokal və Torii simulyasiyaları `["3", "5"]` nəticəsini verdikdə və təqdim edilmiş texniki çağırış `Applied`-ə çatdıqda tamamlanır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `CanRegisterSmartContractCode` xətaları Taira operator izni və ya localnet üzərində genesis/bootstrap dəyişiklik tələb edir. Adi hesab sonra bu icazəni öz-özünə verə bilməz.
- İdarəetmə və ya qorunan zolaq rədd edilməsi o deməkdir ki, yerləşdirmə həmin şəbəkə tərəfindən tələb olunan dəqiq təsdiqləyici təyin edilməsini tələb edir. Təsdiqləyici siyahısını koordinasiya edin; hesab ID-ləri icad etməyin.
- Texniki manifest və ya ABI uyğunsuzluğu, baytkodun, texniki manifestin və node proqram təminatı icra mühitinin eyni artefaktı təsvir etmədiyi deməkdir. `--verify` ilə qeyd olunmuş source-code reviziyasında yenidən qurun.
- `fee quote changed ... gas bound` tələb olunan yazılmış niyyət və canlı təklifin uyğun gəlmədiyini göstərir. İmzalanmış əməliyyatı dəyişdirmək yerine yenidən yoxlayın.
- Yerləşdirmə köməkçisi, şəbəkəyə göndərilmədən əvvəl daxili açarları, icazəli açar-fayl rejimlərini, simvolik keçidləri və çoxlu əlaqəli faylları rədd edir.
- Yalnız baxış giriş nöqtəsi xətası o deməkdir ki, `compute` səhv əmrlər ailəsi vasitəsilə yönləndirilib. Bu nümunə `kotoage`-i elan edir, buna görə texniki çağırış simulyasiyasından və ya təqdimatından istifadə edin.
- Müqavilə çağırışları müsbət tipli əməliyyat icra xərci limiti tələb edir. Birinci buraxılış texniki çağırış müqaviləsi üst səviyyə əməliyyat icra xərci və ya ödəniş-aktiv metadatasını rədd edir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Kotodama V1 əmrinin tətbiqi möhkəmlədilmiş mənbə kodu versiyasında](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Sabitlənmiş mənbə kodu versiyasında tuple qaytaran mənbə nümunəsi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Sabitlənmiş mənbə kodu revisiyasında yerli yerləşdirmə köməkçisi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Sabitlənmiş mənbə kodu reviziyasında müqavilə inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Ağıllı müqavilələr](/az/blockchain/smart-contracts.md)
- [CLI istinad](/az/get-started/operate-iroha-via-cli.md)
