---
translation_locale: uz
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 263e058a0877e1a3c48b6514b127bc56022e3d244284e0b72881743a4aee0f58
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira raqamiga ulanish {#connect-to-taira}

## Natija {#outcome}

Taira ga erishish mumkinligini tasdiqlang, mahalliy mijoz konfiguratsiyasidan kanonik I105 hisobini ID olish, imzochiga testnet XOR yordamida mablag' ajrating va bitta to'lov ko'rsatilgan kanari bitimini taqdim eting. Ushbu retsept hech qachon Minamoto raqamiga yozishni yubormaydi.

## Oldingi shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyin va joriy `iroha` va `kagami` ikkilamchilar.
- Taira zanjiri, oxirgi nuqtasi, hisob profili va maxsus testnet kalitidan foydalanib yaratilgan `taira.client.toml`. [ga amal qiling Taira mijoz konfiguratsiyasini](/uz/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) yaratish va faylni manba nazorati ostida saqlang.
- Ishga tayyor `taira_faucet_claim.py` [dan Testnetni XOR olish Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-da, mijoz konfiguratsiyasi yonida saqlanadi.

## qadamlar {#steps}

### 1. Tayyorlik va jonlilikni ajratish {#_1-separate-liveness-from-readiness}

`/livez` oddiy matndagi jarayonlar muddatini o'tkazish sondasidir. `/status`, `/health` va `/readyz` qaytish JSON. Kerakli kichik tizim bloklanganida ishlaydigan nod tayyorlik sondelaridan qonuniy ravishda `503` qaytishi mumkin. .

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` dan faqat jarayon javob beradimi yoki yo'qmi qaror qilish uchun foydalaning. `/readyz`dan trafikni kirish uchun foydalaning va JSON blokirining tafsilotlarini tekshirib ko'ring, keyin `503`ni uzluk sifatida qabul qiling.

### 2. Jamoat diagnostikalarini o'tkazish {#_2-run-the-public-diagnostics}

Ushbu tekshiruv faqat o'qiladi va imzolovchi konfiguratsiyasini yuklamaydi:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Shifokor qattiq DNS, TLS, zanjir yoki oxirgi nuqta muvaffaqiyatsiz qolgani haqida xabar berganida, yozishni davom ettirmang. To'yilgan ommaviy navbat o'tkaziladi; kutish va cheklangan siyosat bilan yana bir bor sinab ko'ring.

### 3. Taira hisob ID sirni bosib chiqarmasdan {#_3-derive-the-taira-account-id-without-printing-a-secret}

Faqat konfigidan ochiq kalitni o'qing, so'ngra uni Taira I105 profili bilan kodlang. `[account].domain` qiymati yo'naltirish kontekstini taqdim etadi; u ID hisobining bir qismi emas.

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

Chiqish domensiz kanonik I105 manzili hisoblanadi. `wallet@payments.universal` kabi nomlar aliasdir va ularni qat'iy hisob maydonlarida ishlatishdan oldin hal qilinishi kerak.

### 4. Amaldagi Taira to'lov aktivini talab qilish {#_4-claim-the-current-taira-fee-asset}

Fauxet javoblari to'lov aktivlari ta'rifini aniqlash uchun haqiqat manbai hisoblanadi. Boshqa tarmoqdan yoki eski ishlatiladigan ID nusxasini ko'chirmasdan qaytarib berilgan Base58 ID saqlang.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Tekislikni eng ko'p bir daqiqa davomida o'rganing. Moliyalashtirish operatsiyasi ko'rinishdan oldin kranni `202 Accepted` qaytarib berish mumkin.

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

`gas_asset_id` - bu bitim metadatalari. aniq `--fee-payer authority` tanlovi imzoga bog'liq bo'lib, CLI imzolanishdan oldin to'g'ri to'lov taklifini oladi.

## Tekshirish {#verify}

Log yo'l-yo'riqlarini taqdim eting, JSON rasmini saqlang va qo'llaniladigan yakuniylikni kuting. `--no-wait` ning chiqarib tashlanishi dastlabki taqdimotni tasdiqlanishini kutib turadi; aniq holatni o'qish oxirgi quvur holatini isbotlaydi.

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

Oxirgi buyruq faqat tranzaksiya andoza `Applied` terminal holatiga yetgandan so'ng muvaffaqiyatli bo'ladi. Hashni sinov dalillarida saqlang; hech qachon xususiy kalit yoki to'liq mijoz konfiguratsiyasini u bilan saqlashingiz shart emas.

## Muammolarni hal qilish {#troubleshooting}

- `/livez` qaytarish `406` so'ralganda JSON chunki bu yakuniy nuqta `text/plain`. Joʻnatish `Accept: text/plain` yuqorida ko'rsatilganidek.
- `/health` yoki `/readyz` `503` ni `/livez` va `/status` ishlayotgan bo'lsa ham, mashinada o'qiladigan bloker bilan qaytarib berishlari mumkin. Bu blokerni tuzatish yoki kutish; regeneratsiya qilish kalitlari nodlar tayyorligini o'zgartirmaydi.
- `502` kran, vaqt o'tishi yoki ishlaydigan ishning jadalligi bo'lmagan anker - bu davlat xizmati muvaffaqiyatsiz tugadi.
- O ' zbekiston Respublikasi I105 prefix xatosi shuni anglatadiki, ochiq kalit noto'g'ri profil bilan kodlangan. `iroha tools address convert --profile taira`.
- To'lov kvotasi rad etilishi odatda organ mablag' bilan ta'minlanmaganligini, to'lov aktivlarining metadatalari eskirganligi yoki aniq to'lov to'lovchi tanlanmaganligini anglatadi.
- Ushbu operatsiya muvaffaqiyatli bo'lganidan so'ng ro'yxatdan o'tish, qalinlashtirish yoki nomlar maydonini boshqarish hali ham rad etilishi mumkin. Bu operatsiyalar alohida ishga tushirish vaqti ruxsatnomalarini talab qiladi; Taira kirish huquqi berilmaganida hosil qilingan mahalliy tarmoqda ularni mashq qiling.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Taira CLI diagnostikasi va to'g'ri yozib qo'yilgan commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)dagi kanari manbai
- [Xususan to'lovni tanlash va CLI qo'yilgan majburiyatdagi taqdim etish manbai](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira hisob va kran qo'llanma](/uz/get-started/sora-nexus-dataspaces.md)
- [Xizmatchi konfiguratsiyasi](/uz/guide/configure/client-configuration.md)
- [Operatsiyalar](/uz/blockchain/transactions.md)
