---
translation_locale: uz
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Aqlli Shartnomani Qurish va Ishga Tushirish {#build-and-deploy-a-smart-contract}

## Natija {#outcome}

Kotodama V1 shartnomasini tekshiring va kompilyatsiya qiling, uning ochiq kirish nuqtasini mahalliy bajaring, tekshirilgan IVM artefaktini joylashtiring, joylashtirilgan kirish nuqtasini simulyatsiya qiling va vakolat hisobi to‘laydigan aniq narx so‘rovi bilan yuboring.

## Oldingi talablar {#prerequisites}

- `0010c5a70039eac101a4846499ba9ceaf43eb65c` commitidagi Iroha manba daraxti, Rust va Cargo.
- Hozirgi `iroha` CLI plus moliyalashtirilgan Taira mijozdan [Taira ga ulaning](./connect-to-taira.md).
- `IROHA_CONFIG` va `IROHA_PRIVATE_KEY_FILE` dagi mutlaq yo‘llar. Kalit fayl egasiga tegishli, yagona havolali oddiy fayl bo‘lishi va `0600` rejimida bo‘lishi kerak; deploy yordamchisi qasddan ichki xususiy kalit argumentiga ega emas.
- Taira operator tasdiqi. Shartnoma kodi ro'yxatga olinishi uchun `CanRegisterSmartContractCode` talab qilinadi va himoyalangan joylashtirishlar hukumat attributsiyasi va bajarilishini talab qilishi mumkin. Agar Taira ushbu kirishni bermagan bo'lsa, ruxsatni beradigan blokcheyn genesi bo'lgan yaratilgan mahalliy tarmoqda joylashtirishni amalga oshiring.

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

## Qadamlar {#steps}

### 1. Ma'lum yaxshi Kotodama V1 shartnomani nusxalash {#_1-copy-a-known-good-kotodama-v1-contract}

Qattiq bog‘langan Iroha checkout ichida ishlang va compilerning tuple-return namunasini nusxa oling, shunda manba va toolchain bir xil protokolni yakunlashda qoladi.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Toʻliq manba kichik va hozirgi `seiyaku`/`kotoage` sintaksisini ishlatadi:

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

Kotodama Iroha Virtual Mashinasiga va uning joriy ABI ga mo‘ljallangan. Bu WASM yoki EVM manba tili emas.

### 2. Artezanni tekshiring, qurib chiqing va tasdiqlang {#_2-check-build-and-verify-the-artifact}

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

Birinchi qurilish artefaktni va autentifikatsiyalangan sidecarlarni nashr qiladi. Ikkinchi qurilish faqat o‘qish rejimida `--verify` ishlaydi va agar mavjud chiqishlar joriy manbaga to‘liq mos kelmasa, xato beradi. `.to` faylini va uning manifestini bitta ko‘rib chiqilgan qurilish chiqishi sifatida qabul qiling.

### 3. Baytkodni mahalliy ravishda ishga tushiring {#_3-run-the-bytecode-locally}

`compute` ochiq `kotoage` kirish nuqtasidir. Uni `debug-call` bilan ishga tushiring, bu mahalliy test materiallariga qarshi bajariladi, tranzaksiya yuborish yoki to‘lash talab qilinmaydi.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama butun sonlar JSON qatorlar sifatida ko‘rsatiladi, shuning uchun dekodlangan juftlik `["3", "5"]` bo‘ladi.

### 4. Mahalliy yordamchi orqali joylashtirish {#_4-deploy-through-the-native-helper}

Yordamchi baytkod bo‘laklarini yuklaydi, imzolangan manifestni ro‘yxatdan o‘tkazadi va bitta `CommitContractDeployment` amalini yuboradi. U har bir tranzaksiya uchun narx so‘raydi va tanlangan to‘lovchi yoki gaz chegarasini o‘zgartiradigan narxni rad etadi.

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

Bo'sh `charge_limits` so'rov nusxa olingan aktiv identifikatori emas: yordamchi imzolashdan oldin aniq jonli narxni qabul qiladi. Qaytarilgan to'lov aktivini joriy sinov tarmog‘i krani javobi bilan solishtiring. shartnoma chaqiriqlari to‘lovni faqat yozilgan jonli kotirovka orqali qabul qiladi; `gas_asset_id` tranzaksiya metama'lumotlari birinchi nashr shartnomasining qismi emas.

### 5. Joylashtirilgan kirish nuqtasini simulyatsiya qilish va chaqirish {#_5-simulate-and-call-the-deployed-entrypoint}

Simulyatsiya Torii da jamoat kirish nuqtasini topshirmasdan ishga tushiradi. Quyidagi texnik chaqiruv tranzaksiya bo‘lib, shuning uchun avtorizatsiya qiluvchi asosiy to‘lovchini aniq ko‘rsatadi. Har ikkala buyruq 1,500,000 tranzaksiya bajarish xarajatlari chegarasini bog‘laydi.

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

## Tekshirish {#verify}

Taxallusni yeching, qaytarilgan kod xeshi bo‘yicha reyestrdagi manifestni oling va o‘sha ochiq kirish nuqtasini kanonik manzil orqali simulyatsiya qiling:

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

Joylashtirish faqat alias qaytarilgan manzilga yo'naltirilganda, manifest bir xil kod kriptografik hash ostida o'qilishi mumkin bo'lganda, lokal va Torii simulyatsiyalar `["3", "5"]` ni qaytarganda va topshirilgan texnik chaqiriq `Applied` ga yetganda to'liq bo'ladi.

## Muammolarni bartaraf etish {#troubleshooting}

- `CanRegisterSmartContractCode` xatoliklar Taira operator ruxsati yoki localnet-da genesis/bootstrap o‘zgartirishni talab qiladi. Oddiy hisob qaydnomasi ushbu ruxsatni keyinroq o‘zi bermay oladi.
- Boshqaruv yoki himoyalangan yo‘l rad etilishi shuni anglatadiki, joylashtirish ushbu tarmoq talab qiladigan aniq tasdiqlovchi belgilanishini talab qiladi. Tasdiqlovchi ro‘yxatini muvofiqlashtiring; hisob identifikatorlarini ixtiro qilmang.
- Manifest yoki ABI mos kelmasligi baytkod, manifest va tugunning bajarish muhiti bir xil artefaktni tavsiflamayotganini anglatadi. Mahkamlangan commitda `--verify` bilan qayta quring.
- `fee quote changed ... gas bound` so‘ralgan yozma niyat va jonli kotirovka mos kelmasligini bildiradi. Imzolangan tranzaksiyani o‘zgartirish o‘rniga qayta tekshiring.
- Deploy yordamchisi tarmoq orqali yuborishdan oldin inline kalitlarini, ruxsat beruvchi kalit-fayl rejimlarini, simbollik bog‘lamalarni va bir nechta bog‘langan fayllarni rad etadi.
- Faqat ko‘rishga mo‘ljallangan kirish nuqtasi xatosi `compute` noto‘g‘ri buyruqlar oilasi orqali yo‘naltirilganini anglatadi. Bu namuna `kotoage` ni e’lon qiladi, shuning uchun chaqiruvni simulyatsiya qiling yoki yuboring.
- Shartnoma chaqiruvlari musbat turlangan gaz chegarasini talab qiladi. Birinchi reliz chaqiruv shartnomasi yuqori darajadagi gaz yoki to‘lov aktivi metama’lumotlarini rad etadi.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Kotodama V1 buyruq ijrosi belgilangan manba-kod reviziyasida](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Tuple-ni qaytaruvchi manba namunasi pinlangan manba-kod reviziyasida](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Tayanch kod manbasining tasdiqlangan revisiyasida mahalliy joylashtirish yordamchisi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Pimini belgilangan manba-kod reviziyasida shartnoma integratsiya testlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Aqlli shartnomalar](/uz/blockchain/smart-contracts.md)
- [CLI murojaat](/uz/get-started/operate-iroha-via-cli.md)
