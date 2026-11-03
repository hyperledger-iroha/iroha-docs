---
translation_locale: uz
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Taira-ga ulanish {#connect-to-taira}

## Natija {#outcome}

Taira-ga ulanish mumkinligini tasdiqlang, mahalliy mijoz sozlamasidan kanonik I105 hisob ID-sini hosil qiling, imzolovchini sinov tarmog‘i XOR bilan moliyalashtiring va to‘lovi aniq hisoblangan bitta nazorat tranzaksiyasini yuboring. Bu retsept Minamoto-ga hech qachon yozuv yubormaydi.

## Oldindan shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyingi versiya hamda joriy `iroha` va `kagami` bajariluvchi fayllari.
- Taira zanjiri, aniq `network_id`, so‘nggi nuqtasi, hisob profili va alohida sinov tarmog‘i kaliti bilan yaratilgan `taira.client.toml`. [Taira mijoz sozlamasini yaratish](/uz/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ko‘rsatmalariga amal qiling va faylni manba nazoratiga kiritmang.
- Kran jurnali uchun yozish mumkin bo‘lgan ishchi katalog: `iroha taira account faucet prepare` `./taira-faucet` katalogini faqat egasi foydalana oladigan qilib yaratadi va mavjud katalogni almashtirishni rad etadi.

## Qadamlar {#steps}

### 1. Jarayon ishlashi va tayyorlikni ajratish {#_1-separate-liveness-from-readiness}

`/livez`, `/health` va `/readyz` — oddiy matn qaytaradigan sinovlar; `/status` JSON qaytaradi. Konsensusga qabul qilish yoki boshqa zarur quyi tizim ishlamayotganda, ishlayotgan tugun `/readyz` dan qonuniy ravishda `503` qaytarishi mumkin.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` dan faqat jarayon javob berayotganini aniqlash uchun foydalaning. Trafikni qabul qilish uchun `/readyz` dan foydalaning. Uning `503` javobi to‘siq tafsilotlarisiz `service_unavailable` xato konvertidir, shuning uchun uni uzilish deb baholashdan oldin quyidagi diagnostikani ishga tushiring.

### 2. Ochiq diagnostikani ishga tushirish {#_2-run-the-public-diagnostics}

Bu tekshiruv faqat o‘qiydi va imzolovchi sozlamasini yuklamaydi:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Diagnostika DNS, TLS, zanjir yoki so‘nggi nuqtaning qat’iy xatosini bildirsa, yozuvga o‘tmang. Ochiq navbatning to‘lishi vaqtinchalik; kuting va cheklangan qayta urinish siyosati bilan takrorlang.

### 3. Sirni chiqarmasdan Taira hisob ID-sini hosil qilish {#_3-derive-the-taira-account-id-without-printing-a-secret}

Sozlamadan faqat ochiq kalitni o‘qing, so‘ng uni Taira I105 profili bilan kodlang. Hisob ID-sida domen bo‘lmaydi; `[account].profile` faqat uning tarmoq prefiksini tanlaydi.

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

Kran siyosati joriy to‘lov aktivi ta’rifini ko‘rsatadi. Boshqa tarmoq yoki eski ishga tushirishdan ID ko‘chirish o‘rniga, uning Base58 ID-sini saqlang. Siyosat imzolanmagan, faqat parametrlarni aniqlash uchun beriladigan ma’lumotdir, shuning uchun avtomatlashtirish har bir javobga ishonish o‘rniga o‘zi kutgan emitent, aktiv ta’rifi va miqdorni qat’iy belgilab qo‘yishi kerak.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` ish isbotini yechadi va aniq imzolangan tranzaksiyani saqlaydi; `submit` uni bir marta yuboradi va tranzaksiya qo‘llangandan keyin ishini tugatadi. `submit` `Pending` haqida xabar bersa yoki vaqti tugasa, yangi da’vo tayyorlash o‘rniga ayni sozlama va jurnal bilan `taira account faucet resume` ni ishga tushiring. So‘ng qoldiqni ko‘pi bilan bir daqiqa davomida takroran so‘rang.

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

Har bir Taira yozish amali uchun `--fee-payer authority` dan foydalaning. Bu tanlov imzoga bog‘lanadi, CLI esa imzolashdan oldin Taira to‘lov aktividagi aniq to‘lov narxini oladi.

## Tekshirish {#verify}

Jurnal ko‘rsatmasini yuboring, JSON kvitansiyasini saqlang va `Applied` yakuniy holatini kuting. `--no-wait` ni bermaslik dastlabki yuborishni ham tasdiqni kutishga majbur qiladi; holatni alohida o‘qish konveyerning yakuniy holatini isbotlaydi.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Oxirgi buyruq faqat aniq global holat ma’lumoti reyestr holati bo‘yicha aniqlangan `Applied` yakuniy holatini ko‘rsatgandan keyingina muvaffaqiyatli bo‘ladi. Xeshni sinov dalillarida saqlang; u bilan birga maxfiy kalitni yoki to‘liq mijoz sozlamasini hech qachon saqlamang.

## Muammolarni hal qilish {#troubleshooting}

- Faqat JSON so‘ralganda `/livez`, `/health` va `/readyz` `406` qaytaradi, chunki ular `text/plain` formatida javob beradi. Yuqorida ko‘rsatilgan `Accept` sarlavhalarini yuboring.
- `/livez` va `/status` ishlayotganida ham `/readyz` `service_unavailable` xato konverti bilan `503` qaytarishi mumkin. Tayyorlikni kuting yoki `iroha taira doctor` ni ishga tushiring; kalitlarni qayta yaratish tugun tayyorligini o‘zgartirmaydi.
- `submit` paytidagi kranning `502` javobi yoki vaqt tugashi da’vo natijasini noma’lum qoldiradi: yangi da’vo tayyorlash o‘rniga ayni sozlama va jurnal bilan `taira account faucet resume` ni ishga tushiring. Eskirgan ish isboti tayanchi `prepare` ni muvaffaqiyatsiz qiladi; yangi jurnal katalogida qaytadan tayyorlang.
- I105 prefiksi xatosi ochiq kalit noto‘g‘ri profil bilan kodlanganini anglatadi. `iroha tools address convert --profile taira` buyrug‘ini qayta ishga tushiring.
- To‘lov narxining rad etilishi odatda vakolat hisobi moliyalashtirilmaganini yoki sozlangan `network_id` Taira-niki emasligini anglatadi. `--fee-payer` ning yo‘qligi yoki `--metadata` dagi `gas_asset_id` kabi to‘lov kaliti narx olinishidan oldin mahalliy darajada xato beradi.
- Bu nazorat tranzaksiyasi muvaffaqiyatli bo‘lsa ham, ro‘yxatdan o‘tkazish, chiqarish yoki nomlar makonini boshqarish rad etilishi mumkin. Bu amallar alohida bajarish muhiti ruxsatlarini talab qiladi; Taira vakolati berilmagan bo‘lsa, ularni yaratilgan mahalliy tarmoqda mashq qiling.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- Mahkamlangan commitdagi [Taira CLI diagnostikasi va nazorat tranzaksiyasi manbasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) hamda [kran buyruqlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [Mahkamlangan commitdagi aniq to‘lov tanlovi va CLI yuborish manbasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira hisobi va krani qo‘llanmasi](/uz/get-started/sora-nexus-dataspaces.md)
- [Mijoz sozlamasi](/uz/guide/configure/client-configuration.md)
- [Tranzaksiyalar](/uz/blockchain/transactions.md)
