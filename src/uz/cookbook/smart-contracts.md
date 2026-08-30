---
translation_locale: uz
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 67778f9fc4f2b6fa0288f5921402cf5509515aae678e98b8192e103dfe284db3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aqlli shartnoma tuzish va uni amalga oshirish {#build-and-deploy-a-smart-contract}

## Natija {#outcome}

Kotodama V1 shartnomasini tekshirish va tuzish, uning ommaviy kirish joyini mahalliy ravishda bajarish, tasdiqlangan IVM artefaktni ishga tushirish, ishga tushirilgan kirish joyini simulyatsiya qilish va uni mutlaqo ko'rsatilgan organ tomonidan to'lanadigan haq bilan taqdim etish.

## Oldingi shartlar {#prerequisites}

- Iroha manbai checking at commit `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust, va Cargo.
- Joriy `iroha` CLI qo'shimcha mablag ' bilan ta'minlangan Taira mijoz [Bogʻlanish Taira](./connect-to-taira.md).
- Muqobil yo ' nalishlar `IROHA_CONFIG` va `IROHA_PRIVATE_KEY_FILE`. Yopiq fayl egalik qiladigan, bitta bog'liq odatdagi fayl bo'lishi kerak `0600`; qo'shish yordamchisi niyatda xususiy kalit bilan bog'liq hech qanday dalilga ega emas.
- Taira operatorining ruxsatnomasi. Shartnoma kodini ro'yxatdan o'tkazish uchun `CanRegisterSmartContractCode` talab etiladi va himoyalangan joylashtirishlar boshqaruv taqsimoti va qonuniylashtirishni talab qilishi mumkin. Agar Taira bu kirish huquqini bermasa, jo'natilgan mahalliy tarmog'da joylashtirishni amalga oshiradi.

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

## qadamlar {#steps}

### 1. Ma'lum bo'lgan yaxshi Kotodama V1 shartnomasining nusxasi {#_1-copy-a-known-good-kotodama-v1-contract}

O'rnatilgan Iroha checkout ichida ishlating va kompilyerning tuple-return namunasini nusxa oling, shunda manba va asboblar zanjiri bir xil commitda qolishadi.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

To'liq manba kichik bo'lib, joriy `seiyaku`/`kotoage` sintaksidan foydalaniladi:

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

Kotodama maqsadlari Iroha Virtual mashina va uning joriy qismi ABI. Bu o'z navbatida WASM yoki EVM manba tili.

### 2. Artefaktni tekshirish, qurish va tasdiqlash {#_2-check-build-and-verify-the-artifact}

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

Birinchi qurilish artefakt va tasdiqlangan yon mashinalarni nashr etadi. Ikkinchisi faqat o'qiladigan `--verify` rejimida ishlaydi va mavjud bo'lgan biron bir chiqish joriy manbaga to'g'ri mos kelmasa, muvaffaqiyatsizlikka uchraydi. `.to` faylini va uning manifestini qayta ko'rib chiqilgan qurilish natijasi sifatida qabul qiling.

### 3. Byte kodini mahalliy ravishda ishga tushiring {#_3-run-the-bytecode-locally}

`compute` - bu ommaviy `kotoage` kirish punkti. Uni `debug-call` bilan ishga tushiring, u tranzaksiya taqdim etmasdan yoki haq to'lamasdan mahalliy o'rnatishlarga qarshi bajaradi.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama to'liq raqamlari JSON simlari sifatida aks ettiriladi, shuning uchun tarjima qilingan tuple `["3", "5"]` hisoblanadi.

### 4. Yerli yordamchi orqali ishga tushirish {#_4-deploy-through-the-native-helper}

Yordamchi bytecode qismlarini yuklaydi, imzolangan manifestni ro'yxatdan o'tkazadi va bitta `CommitContractDeployment` operatsiyasini taqdim etadi. U har bir tranzaksiyani to'lov bilan taqqoslaydi va tanlangan to'lovchi yoki gaz bog'liqligini o'zgartiradigan taklifni rad etadi.

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

Bo'sh `charge_limits` so'rovi nusxa ko'chirilgan aktiv identifikatori emas: yordamchi imzolashdan oldin aniq jonli taklifni qabul qiladi. qaytarilgan to'lov aktivini joriy kran javob. Shartnoma qo'ng'iroqlari faqat tiklangan jonli taklif orqali to'lovni tanlashni qabul qiladi; `gas_asset_id` muomala metadatalari birinchi nashr shartnomasining bir qismi emas.

### 5. O'rnatilgan kirish punktini simulyatsiya qilish va qo'llash {#_5-simulate-and-call-the-deployed-entrypoint}

Simulyatsiya Torii da ommaviy kirish punktini taqdim etmasdan o'tkazadi. Quyidagi qo'ng'iroq tranzaksiya bo'lib, shuning uchun vakolat to'lovini to'lovchini aniq tanlaydi. Ikkala buyruq ham 1,500,000 gazni cheklashni bog'laydi.

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

Alias-ni hal qiling, zanjirdagi manifestni qaytarilgan kod hash bilan oling va bir xil ommaviy kirish nuqtasini kanonik manzil orqali simulyatsiya qiling:

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

Jo'natish faqat alias qaytarib yuborilgan manzilga o'zgarganda, manifest bir xil kod hash, mahalliy va Torii simulyatsiyalari qaytishi `["3", "5"]` ostida o'qilishi mumkin bo'lganda to'liq bo'ladi va taqdim etilgan qo'ng'iroq `Applied` ga yetadi.

## Muammolarni hal qilish {#troubleshooting}

- `CanRegisterSmartContractCode` xatolari uchun Taira operator grantini yoki localnetda genesis/bootstrap o'zgarishini talab qiladi. Oddiy hisobvaraq ushbu ruxsatni faktdan keyin o'zi berolmaydi.
- Boshqaruv yoki himoyalangan yoʻnalishlarni rad etish , ishga tushirish uchun toʻgʻri tasdiqlov talab etiladi . o'sha tarmoq tomonidan talab etiladigan ma'lumotlar; tasdiqlovchilar ro'yxatini muvofiqlashtirish; hisobni yaratmaslik IDs.
- Manifesto yoki ABI mos kelmasligi - bu bytecode, manifest va nod ish vaqti bir xil artefaktni tasvirlamaydi degan ma'noni anglatadi. `--verify`.
- `fee quote changed ... gas bound` so'ragan tizilgan niyat va jonli quote kelishmovchilikni anglatadi. imzolangan tranzaksiyani o'zgartirishning o'rniga qayta ko'rib chiqish.
- Tarqatish yordamchisi tarmoqni taqdim etishdan oldin chiziqdagi kalitlarni, ruxsat beruvchi kalit fayl rejimlarini, sim havolalarini va bog'langan fayllarni ko'paytirishni rad etadi.
- Faqat ko'rish uchun kirish nuqtasi xatosi `compute` noto'g'ri buyruq oilasi orqali yo'naltirilganligini anglatadi. Ushbu namuna `kotoage` deb e'lon qiladi, shuning uchun qo'ng'iroq simulyatsiyasi yoki taqdimotdan foydalaning.
- Shartnoma qo'ng'iroqlari ijobiy gaz cheklovini talab qiladi. Birinchi chiqarilgan chaqiriq shartnomasi eng yuqori darajadagi gaz yoki to'lov aktivlari metadatalarini rad etadi.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Kotodama V1 buyruqni qat'iy qo'yishda amalga oshirish](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Tuple-return manbai namunasini qatlamli commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs) o'rnatilgan commit-da mahalliy joylashtirishga yordamchi
- [](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs) to'g'rilashtirilgan majburiyatda shartnoma integratsiyasi sinovlari
- [Aqlli shartnomalar](/uz/blockchain/smart-contracts.md)
- [CLI ma'lumotnomasi](/uz/get-started/operate-iroha-via-cli.md)
