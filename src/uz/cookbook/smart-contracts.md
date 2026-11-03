---
translation_locale: uz
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Aqlli Shartnomani Qurish va Ishga Tushirish {#build-and-deploy-a-smart-contract}

## Natija {#outcome}

Kotodama V1 shartnomasini tekshiring va kompilyatsiya qiling, uning ochiq view funksiyasini mahalliy ishga tushiring, tekshirilgan IVM artefaktini vakolat hisobi to‘laydigan, aniq tanlangan to‘lovlar bilan joylashtiring va joylashtirilgan view funksiyasini Torii orqali o‘qing.

## Oldingi talablar {#prerequisites}

- `c8c872461e92f04325c350cdd952f4276e96f9dc` commitidagi Iroha manba daraxti, Rust va Cargo.
- Joriy `iroha` CLI va `musubi` (manba nusxasida `cargo run -p musubi --` sifatida ishga tushiriladi), shuningdek [Taira-ga ulanish](./connect-to-taira.md) bo‘limidagi moliyalashtirilgan Taira mijozi.
- `IROHA_CONFIG` dagi mutlaq yo‘l. Musubi’ning tarmoq bog‘lamasi ushbu mijoz fayliga havolani saqlaydi va joylashtirishni uning hisob kaliti bilan imzolaydi.
- Taxallus vakolati. Ijrochi aniq shartnoma taxallusi yoki uning yuqori doirasi uchun `CanManageAccountAlias` ni talab qiladi: `name::domain.dataspace` uchun egalik qiluvchi domen, `name::dataspace` uchun esa ma’lumotlar makoni. Ro‘yxatdan o‘tgan hisoblarga kodni ro‘yxatdan o‘tkazish uchun alohida ruxsat kerak emas, himoyalangan nomlar makonlari esa tarmoqning boshqaruv jarayonini ham talab qiladi. Misollarda `cookbook_tuple::universal` ishlatiladi; Taira-da uni o‘zingiz egalik qiladigan domendagi taxallusga almashtiring yoki genezisi taxallus doirasini beradigan yaratilgan mahalliy tarmoqda joylashtiring.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Qadamlar {#steps}

### 1. Ma'lum yaxshi Kotodama V1 shartnomani nusxalash {#_1-copy-a-known-good-kotodama-v1-contract}

Qattiq bog‘langan Iroha checkout ichida ishlang va compilerning tuple-return namunasini nusxa oling, shunda manba va toolchain bir xil protokolni yakunlashda qoladi.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

To‘liq manba kichik: bitta xususiy yordamchi `fn` va har bir chaqiruvchiga aniq ruxsat beradigan bitta ochiq, faqat o‘qiladigan `view fn`:

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

Kotodama Iroha Virtual Mashinasiga va uning joriy ABI ga mo‘ljallangan. Bu WASM yoki EVM manba tili emas.

### 2. Artezanni tekshiring, qurib chiqing va tasdiqlang {#_2-check-build-and-verify-the-artifact}

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

Birinchi qurilish artefaktni va autentifikatsiyalangan sidecarlarni nashr qiladi. Ikkinchi qurilish faqat o‘qish rejimida `--verify` ishlaydi va agar mavjud chiqishlar joriy manbaga to‘liq mos kelmasa, xato beradi. `.to` faylini va uning manifestini bitta ko‘rib chiqilgan qurilish chiqishi sifatida qabul qiling.

### 3. Baytkodni mahalliy ravishda ishga tushiring {#_3-run-the-bytecode-locally}

`compute` — ochiq, faqat o‘qiladigan `view fn`. Uni `debug-view` bilan ishga tushiring: u kompilyatsiya qilingan baytkodni ixtiyoriy sinov ma’lumotlari bilan mahalliy bajaradi, tranzaksiya yubormaydi va uning uchun to‘lamaydi.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama butun sonlar JSON qatorlar sifatida ko‘rsatiladi, shuning uchun dekodlangan juftlik `["3", "5"]` bo‘ladi.

### 4. Tekshirilgan artefaktni Musubi bilan joylashtirish {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` shartnomalarni tekshiradi, ularning view funksiyalarini chaqiradi va nosozliklarini tuzatadi, lekin ularni joylashtirmaydi, shuning uchun Taira joylashtirishlari Musubi orqali bajariladi. Uning joylashtirish xizmati baytkod bo‘laklarini yuklaydi, tekshirilgan manifestni ro‘yxatdan o‘tkazadi va bitta `CommitContractDeployment` amalini yuboradi. U har bir tranzaksiya uchun narx so‘raydi, tanlangan to‘lovchi, homiy reviziyasi yoki gaz chegarasini o‘zgartiradigan narxni rad etadi va qulflangan paket qurilishi artefaktning kod va ABI xeshlarini qayta hosil qilgandan keyingina oldindan qurilgan artefaktni joylashtiradi. Kagami boshqaradigan mahalliy tarmoqda buning o‘rniga `kagami contract deploy` `./build/tuple_return_demo.to` ni `--alias cookbook_tuple::universal --json` bilan joylashtiradi; uning kvitansiyasi `.receipt` ostida bo‘ladi, `kagami context show` esa `IROHA_CONFIG` sifatida ishlatiladigan mijoz sozlamasini chiqaradi.

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

Bog‘lama `--fee-payer authority` dan foydalanadi; Musubi imzolashdan oldin Taira to‘lov aktividagi aniq to‘lov narxini oladi. Qaytarilgan to‘lov aktivini joriy kran siyosati e’lon qiladigan aktiv bilan solishtiring. Shartnoma chaqiruvlari to‘lov tanlovini faqat turlangan jonli narx orqali qabul qiladi; `gas_asset_id` tranzaksiya metama’lumoti birinchi reliz kelishuvining qismi emas.

### 5. Joylashtirilgan view funksiyasini o‘qish {#_5-read-the-deployed-view}

`contract view` faqat o‘qiladigan kirish nuqtasini Torii-da tranzaksiya va to‘lovsiz bajaradi. View funksiyasining tranzaksiya shakli yo‘q: Torii chaqiruv marshrutlarida view selektorini rad etadi.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Tekshirish {#verify}

Taxallusni yeching, Torii joylashtirilgan view funksiyasi uchun ko‘rsatgan kod xeshi bo‘yicha reyestrdagi manifestni oling va o‘sha view funksiyasini kanonik manzil orqali ishga tushiring:

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

Joylashtirish faqat joylashtirish kvitansiyasi saqlangan artefaktni tekshirilgan deb ko‘rsatganda, taxallus qaytarilgan manzilga yechilganda, manifest o‘sha kod xeshi ostida o‘qilganda hamda mahalliy va Torii view chaqiruvlari `["3", "5"]` ni qaytarganda yakunlangan hisoblanadi.

## Muammolarni bartaraf etish {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` yoki ijrochining `authority is not permitted to manage contract alias` xabari hisob bu taxallusni bog‘lay olmasligini anglatadi. O‘zingiz egalik qiladigan domendagi taxallusdan foydalaning yoki aniq taxallus ruxsatini yoxud uning domen yoki ma’lumotlar makoni ruxsatini shu doira egasidan oling; mahalliy tarmoqda uni genezisda bering.
- Himoyalangan nomlar makoni rad etilishi taxallus nomlar makoni boshqaruv ostida ekanini anglatadi. Tasdiqlovchi hisob ID-larini sanab o‘tish tasdiq dalili emas; shu nomlar makoni uchun tarmoqning boshqaruv jarayonidan (`iroha app gov deploy propose`) foydalaning yoki undan tashqaridagi taxallusni tanlang.
- Manifest yoki ABI mos kelmasligi baytkod, manifest va tugunning bajarish muhiti bir xil artefaktni tavsiflamayotganini anglatadi. Mahkamlangan commitda qayta quring, so‘ng qurishni `--verify` bilan qayta ishga tushiring.
- `fee quote changed ... gas bound` so‘ralgan yozma niyat va jonli kotirovka mos kelmasligini bildiradi. Imzolangan tranzaksiyani o‘zgartirish o‘rniga qayta tekshiring.
- To‘xtatilgan joylashtirish o‘zining imzolangan rejasini jurnalda saqlaydi. Yangi rejani imzolash o‘rniga uni `musubi deploy --resume <JOURNAL>` bilan tiklang.
- `is read-only and cannot be invoked as a transaction` yoki `is not a kotoage or lifecycle entrypoint` xabari `compute` chaqiruv buyrug‘iga yuborilganini anglatadi. Bu namuna `view fn` ni e’lon qiladi, shuning uchun mahalliy ravishda `debug-view` dan, Torii-da esa `view` dan foydalaning.
- Shartnoma chaqiruvlari musbat turlangan gaz chegarasini talab qiladi. Birinchi reliz chaqiruv shartnomasi yuqori darajadagi gaz yoki to‘lov aktivi metama’lumotlarini rad etadi.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi Kotodama V1 buyrug‘ining amalga oshirilishi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Tuple-ni qaytaruvchi manba namunasi pinlangan manba-kod reviziyasida](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- Mahkamlangan commitdagi [Musubi joylashtirish buyrug‘i](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) va [mahalliy shartnoma joylashtirish xizmati](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [Pimini belgilangan manba-kod reviziyasida shartnoma integratsiya testlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Aqlli shartnomalar](/uz/blockchain/smart-contracts.md)
- [CLI murojaat](/uz/get-started/operate-iroha-via-cli.md)
