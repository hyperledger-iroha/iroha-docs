---
translation_locale: az
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Ağıllı müqavilə yaradın və yerləşdirin {#build-and-deploy-a-smart-contract}

## Nəticə {#outcome}

Kotodama V1 müqaviləsini yoxlayın və kompilyasiya edin, onun ictimai view funksiyasını lokal olaraq işə salın, yoxlanılmış IVM artefaktını açıq şəkildə seçilmiş və səlahiyyətli hesab tərəfindən ödənilən ödəniş haqları ilə yerləşdirin və yerləşdirilmiş view funksiyasını Torii vasitəsilə oxuyun.

## Tələb olunan əvvəlcədən şərtlər {#prerequisites}

- `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust və Cargo-da protokolun yekunlaşdırılması zamanı Iroha mənbə kodunun işlək nüsxəsi.
- Cari `iroha` CLI və `musubi` (işçi nüsxədə `cargo run -p musubi --` kimi işə salın), həmçinin [Taira-ya qoşulun](./connect-to-taira.md) səhifəsindən maliyyələşdirilmiş Taira müştərisi.
- `IROHA_CONFIG` daxilində mütləq yol. Musubi-nin şəbəkə bağlantısı bu müştəri faylına istinadı saxlayır və yerləşdirməni onun hesab açarı ilə imzalayır.
- Alias səlahiyyəti. İcraçı müqavilənin dəqiq aliası və ya onun ana əhatəsi üçün `CanManageAccountAlias` tələb edir: `name::domain.dataspace` üçün sahib domen, `name::dataspace` üçün isə məlumat məkanı. Qeydiyyatdan keçmiş hesablara ayrıca kod qeydiyyatı icazəsi lazım deyil, qorunan ad sahələri isə əlavə olaraq şəbəkənin idarəetmə iş axınını tələb edir. Nümunələr `cookbook_tuple::universal` istifadə edir; Taira-da onu sahib olduğunuz domendəki alias ilə əvəz edin və ya genezisi alias əhatəsini verən yaradılmış lokal şəbəkədə yerləşdirin.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Addımlar {#steps}

### 1. Məlum-olar yaxşı Kotodama V1 müqaviləni kopyalayın {#_1-copy-a-known-good-kotodama-v1-contract}

Pinlənmiş Iroha çekaut daxilində işləyin və mənbə və alət dəstinin eyni protokol yekunlaşmasında qalması üçün tərtibçinin cüt-təkrarlanan qaytarış nümunəsini kopyalayın.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Tam mənbə kodu kiçikdir: bir şəxsi köməkçi `fn` və hər çağırana açıq şəkildə icazə verən bir ictimai, yalnız oxunan `view fn`:

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

Kotodama Iroha Virtual Maşını və onun cari ABI-ini hədəfləyir. Bu, WASM və ya EVM mənbə dili deyil.

### 2. Artefakti yoxlayın, yaradın və təsdiqləyin {#_2-check-build-and-verify-the-artifact}

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

Birinci quruluş artefaktı və təsdiqlənmiş yan yük maşınlarını yayımlayır. İkincisi yalnız oxuma rejimində `--verify` işləyir və mövcud çıxışlardan hər hansı biri cari mənbə ilə tam uyğun deyilsə, uğursuz olur. `.to` faylını və onun texniki manifestini bir baxılmış quruluş çıxışı kimi nəzərdən keçirin.

### 3. Baytkodu yerli olaraq işə salın {#_3-run-the-bytecode-locally}

`compute` ictimai, yalnız oxunan `view fn` funksiyasıdır. Onu `debug-view` ilə işə salın; o, kompilyasiya olunmuş baytkodu əməliyyat təqdim etmədən və onun üçün ödəniş etmədən istəyə bağlı sınaq verilənləri üzərində lokal olaraq icra edir.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama tam ədədlər JSON sətrlər kimi göstərilir, buna görə dekodlanmış tuple `["3", "5"]` olur.

### 4. Yoxlanılmış artefaktı Musubi ilə yerləşdirin {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` müqavilələri yoxlayır, onların view funksiyalarını işə salır və sazlayır, lakin onları yerləşdirmir, buna görə Taira-da yerləşdirmələr Musubi vasitəsilə aparılır. Onun yerləşdirmə xidməti baytkod hissələrini yükləyir, yoxlanılmış manifesti qeydiyyatdan keçirir və bir `CommitContractDeployment` əməliyyatı təqdim edir. O, hər əməliyyat üçün ödəniş qiyməti təxminini alır, seçilmiş ödəyicini, sponsor reviziyasını və ya qaz həddini dəyişən təxmini rədd edir və əvvəlcədən qurulmuş artefaktı yalnız kilidlənmiş paket qurması onun kod və ABI heşlərini təkrar əldə etdikdən sonra yerləşdirir. Kagami ilə idarə olunan lokal şəbəkədə isə bunun əvəzinə `kagami contract deploy` `./build/tuple_return_demo.to` faylını `--alias cookbook_tuple::universal --json` ilə yerləşdirir; onun qəbzi `.receipt` altındadır, `kagami context show` isə `IROHA_CONFIG` kimi istifadə ediləcək müştəri konfiqurasiyasını çap edir.

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

Bağlantı `--fee-payer authority` istifadə edir; Musubi imzalamadan əvvəl dəqiq haqqı Taira-nın ödəniş aktivində hesablayıb göstərir. Qaytarılan tutulma aktivini cari testnet maliyyələşdirmə xidməti siyasətinin dərc etdiyi aktivlə müqayisə edin. Müqavilə çağırışları ödəniş seçimini yalnız tipli canlı təxmin vasitəsilə qəbul edir; `gas_asset_id` əməliyyat metadatası ilk buraxılış müqaviləsinin hissəsi deyil.

### 5. Yerləşdirilmiş view funksiyasını oxuyun {#_5-read-the-deployed-view}

`contract view` yalnız oxunan giriş nöqtəsini Torii üzərində əməliyyat və ödəniş haqqı olmadan icra edir. View funksiyasının əməliyyat forması yoxdur: Torii öz çağırış marşrutlarında view seçicisini rədd edir.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Yoxla {#verify}

Aliası həll edin, Torii-nin yerləşdirilmiş view üçün bildirdiyi kod heşi ilə zəncirdəki manifesti əldə edin və eyni view funksiyasını kanonik ünvanla işə salın:

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

Yerləşdirmə yalnız yerləşdirmə qəbzi saxlanılan artefaktı yoxlanılmış kimi göstərdikdə, alias qaytarılan ünvana həll olunduqda, manifest eyni kod heşi altında oxuna bildikdə və lokal və Torii view funksiyaları `["3", "5"]` qaytardıqda tamamlanmış sayılır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` və ya icraçının `authority is not permitted to manage contract alias` xətası hesabın həmin aliası bağlaya bilməyəcəyini bildirir. Sahib olduğunuz domendəki aliasdan istifadə edin və ya həmin əhatənin sahibindən dəqiq alias icazəsini, yaxud onun domen və ya məlumat məkanı icazəsini alın; lokal şəbəkədə onu genezisdə verin.
- Qorunan ad sahəsi rəddi aliasın ad sahəsinin idarəetmə altında olduğunu bildirir. Təsdiqləyici hesab ID-lərinin sadalanması təsdiq sübutu deyil; həmin ad sahəsi üçün şəbəkənin idarəetmə iş axınından (`iroha app gov deploy propose`) istifadə edin və ya ondan kənarda alias seçin.
- Manifest və ya ABI uyğunsuzluğu baytkodun, manifestin və şəbəkə qovşağının proqram icra mühitinin eyni artefaktı təsvir etmədiyini bildirir. Sabitlənmiş mənbə kodu reviziyasında yenidən qurun, sonra qurmanı `--verify` ilə təkrar işə salın.
- `fee quote changed ... gas bound` tələb olunan yazılmış niyyət və canlı təklifin uyğun gəlmədiyini göstərir. İmzalanmış əməliyyatı dəyişdirmək yerine yenidən yoxlayın.
- Yarımçıq qalmış yerləşdirmə imzalanmış planını jurnalda saxlayır. Yeni plan imzalamaq əvəzinə onu `musubi deploy --resume <JOURNAL>` ilə bərpa edin.
- `is read-only and cannot be invoked as a transaction` və ya `is not a kotoage or lifecycle entrypoint` `compute` funksiyasının çağırış əmrinə göndərildiyini bildirir. Bu nümunə `view fn` elan edir, ona görə lokalda `debug-view`, Torii-də isə `view` işlədin.
- Müqavilə çağırışları müsbət tipli əməliyyat icra xərci limiti tələb edir. Birinci buraxılış texniki çağırış müqaviləsi üst səviyyə əməliyyat icra xərci və ya ödəniş-aktiv metadatasını rədd edir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu reviziyasında Kotodama V1 əmrinin implementasiyası](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Sabitlənmiş mənbə kodu versiyasında tuple qaytaran mənbə nümunəsi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- Sabitlənmiş mənbə kodu reviziyasında [Musubi yerləşdirmə əmri](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) və [daxili müqavilə yerləşdirmə xidməti](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [Sabitlənmiş mənbə kodu reviziyasında müqavilə inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Ağıllı müqavilələr](/az/blockchain/smart-contracts.md)
- [CLI istinad](/az/get-started/operate-iroha-via-cli.md)
