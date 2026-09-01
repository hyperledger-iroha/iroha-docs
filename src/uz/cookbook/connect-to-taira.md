---
translation_locale: uz
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira-ga ulanish {#connect-to-taira}

## Natija {#outcome}

Taira-ga ulanish mumkinligini tasdiqlang, mahalliy mijoz sozlamasidan kanonik I105 hisob ID-sini hosil qiling, imzolovchini sinov tarmog‘i XOR bilan moliyalashtiring va to‘lovi aniq hisoblangan bitta nazorat tranzaksiyasini yuboring. Bu retsept Minamoto-ga hech qachon yozuv yubormaydi.

## Oldindan shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyingi versiya hamda joriy `iroha` va `kagami` bajariluvchi fayllari.
- Taira zanjiri, so‘nggi nuqtasi, hisob profili va alohida sinov tarmog‘i kaliti bilan yaratilgan `taira.client.toml`. [Taira mijoz sozlamasini yaratish](/uz/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ko‘rsatmalariga amal qiling va faylni manba nazoratiga kiritmang.
- [Taira-da sinov tarmog‘i XOR-ni olish](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bo‘limidagi ishga tayyor `taira_faucet_claim.py`, mijoz sozlamasi yonida saqlangan bo‘lishi kerak.

## Qadamlar {#steps}

### 1. Jarayon ishlashi va tayyorlikni ajratish {#_1-separate-liveness-from-readiness}

`/livez` — oddiy matn qaytaradigan jarayon ishlashi sinovi. `/status`, `/health` va `/readyz` JSON qaytaradi. Zarur quyi tizim bloklangan bo‘lsa, ishlayotgan tugun tayyorlik sinovlaridan qonuniy ravishda `503` qaytarishi mumkin.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` dan faqat jarayon javob berayotganini aniqlash uchun foydalaning. Trafikni qabul qilishda `/readyz` ga qarang va `503` ni uzilish deb baholashdan oldin uning JSON-dagi to‘siq tafsilotlarini tekshiring.

### 2. Ochiq diagnostikani ishga tushirish {#_2-run-the-public-diagnostics}

Bu tekshiruv faqat o‘qiydi va imzolovchi sozlamasini yuklamaydi:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Diagnostika DNS, TLS, zanjir yoki so‘nggi nuqtaning qat’iy xatosini bildirsa, yozuvga o‘tmang. Ochiq navbatning to‘lishi vaqtinchalik; kuting va cheklangan qayta urinish siyosati bilan takrorlang.

### 3. Sirni chiqarmasdan Taira hisob ID-sini hosil qilish {#_3-derive-the-taira-account-id-without-printing-a-secret}

Sozlamadan faqat ochiq kalitni o‘qing, so‘ng uni Taira I105 profili bilan kodlang. `[account].domain` qiymati yo‘naltirish kontekstini beradi; u hisob ID-sining qismi emas.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

Natija domensiz kanonik I105 manzilidir. `wallet@payments.universal` kabi nomlar taxallus bo‘lib, qat’iy hisob maydonlarida ishlatilishidan oldin yechilishi kerak.

### 4. Joriy Taira to‘lov aktivini olish {#_4-claim-the-current-taira-fee-asset}

Kran javobi to‘lov aktivi ta’rifining vakolatli manbaidir. Boshqa tarmoq yoki eski ishga tushirishdan ID ko‘chirish o‘rniga, qaytarilgan Base58 ID-ni saqlang.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Qoldiqni ko‘pi bilan bir daqiqa davomida takroran so‘rang. Moliyalashtirish tranzaksiyasi ko‘rinishidan oldin kran `202 Accepted` qaytarishi mumkin.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` — tranzaksiya metama’lumoti. Aniq `--fee-payer authority` tanlovi imzoga bog‘lanadi, CLI esa imzolashdan oldin to‘lovning aniq hisobini oladi.

## Tekshirish {#verify}

Jurnal ko‘rsatmasini yuboring, JSON kvitansiyasini saqlang va `Applied` yakuniy holatini kuting. `--no-wait` ni bermaslik dastlabki yuborishni ham tasdiqni kutishga majbur qiladi; holatni alohida o‘qish konveyerning yakuniy holatini isbotlaydi.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Oxirgi buyruq faqat tranzaksiya standart `Applied` yakuniy holatiga yetgach muvaffaqiyatli bo‘ladi. Xeshni sinov dalillarida saqlang; u bilan birga maxfiy kalitni yoki to‘liq mijoz sozlamasini hech qachon saqlamang.

## Muammolarni hal qilish {#troubleshooting}

- JSON so‘ralganda `/livez` `406` qaytaradi, chunki bu so‘nggi nuqta `text/plain`. Yuqoridagidek `Accept: text/plain` yuboring.
- `/livez` va `/status` ishlayotganida ham `/health` yoki `/readyz` mashina o‘qiy oladigan to‘siq bilan `503` qaytarishi mumkin. To‘siqni bartaraf eting yoki uning yo‘qolishini kuting; kalitlarni qayta yaratish tugun tayyorligini o‘zgartirmaydi.
- Kranning `502` javobi, vaqt tugashi yoki eskirgan ish isboti tayanchi — ochiq xizmat xatosi. Yangi topshiriqni oling va keyinroq qayta urinib ko‘ring.
- I105 prefiksi xatosi ochiq kalit noto‘g‘ri profil bilan kodlanganini anglatadi. `iroha tools address convert --profile taira` buyrug‘ini qayta ishga tushiring.
- To‘lov hisobining rad etilishi odatda vakolat hisobi moliyalashtirilmagani, to‘lov aktivi metama’lumoti eskirgani yoki aniq to‘lovchi tanlanmaganini anglatadi.
- Bu nazorat tranzaksiyasi muvaffaqiyatli bo‘lsa ham, ro‘yxatdan o‘tkazish, chiqarish yoki nomlar makonini boshqarish rad etilishi mumkin. Bu amallar alohida bajarish muhiti ruxsatlarini talab qiladi; Taira vakolati berilmagan bo‘lsa, ularni yaratilgan mahalliy tarmoqda mashq qiling.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi Taira CLI diagnostikasi va nazorat tranzaksiyasi manbasi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Mahkamlangan commitdagi aniq to‘lov tanlovi va CLI yuborish manbasi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira hisobi va krani qo‘llanmasi](/uz/get-started/sora-nexus-dataspaces.md)
- [Mijoz sozlamasi](/uz/guide/configure/client-configuration.md)
- [Tranzaksiyalar](/uz/blockchain/transactions.md)
