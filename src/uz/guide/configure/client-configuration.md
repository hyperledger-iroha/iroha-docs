---
translation_locale: uz
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Mijozning konfiguratsiyasi {#client-configuration}

Iroha CLI va SDK mijozlari TOML konfiguratsiyasidan foydalanadilar. Repository joriy andoza kodini `defaults/client.toml` ga jo'natadi; hosil qilingan mahalliy tarmoqlar ham o'zlarining chiqish direktoriyasiga moslashadigan `client.toml` yozib oladi.

::: details Mijozning konfiguratsiya namunalari

<<< @/snippets/client.template.toml

:::

## Asosiy maydonlar {#core-fields}

Mijoz sozlamasi kamida zanjir, uning tarmoq identifikatori, Torii endpointi, hisobning tarmoq konteksti va imzolash kalitini belgilaydi:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` taqdim etilgan bitimlar tegishli bo'lgan zanjirni tanlaydi.
- `network_id` — har bir imzolangan so‘rov bog‘lanadigan, genesisdan hosil qilingan tarmoq identifikatori. `network_id` yoki `network_id_file`dan aniq bittasini sozlang; tugun bu qiymatni `GET /v1/accounts/capabilities`da e’lon qiladi.
- `torii_url` tenglikdagi nuqtalar Torii HTTP API.
- `[account].chain_discriminant` tarmoqning I105 hisob prefiksini tanlaydi. Ochiq tarmoqlar uning o‘rniga `[account].profile = "taira"` yoki `"minamoto"`dan foydalanishi mumkin. Ikkisidan biri zarur, kanonik `AccountId`ning o‘zi esa domensiz.
- `[account].public_key` va `[account].private_key` tranzaksiyalarni imzolaydi; `private_key_file` `private_key` o‘rnini bosa oladi.

Hisobot allaqachon zanjirda mavjud bo'lishi kerak. andoza mahalliy tarmoq uchun bu to'plamlangan genesis manifest tomonidan boshqariladi.

::: info Kassa sezgirligi

Iroha nomlari kanonik tahlildan so'ng holatga mos keladi. Misol uchun, `wonderland.universal`, `Wonderland.universal` va `looking_glass.universal` alohida domen literallar hisoblanadi.

:::

## Asosiy autentifikatsiya {#basic-authentication}

Opsional `[basic_auth]` bo'limi mijoz so'rovlariga HTTP `Authorization` boshliqini qo'shadi. Iroha tugunlar ushbu ma'lumotnomalarni to'g'ridan-to'g'ri talqin qilmaydilar; ularni Torii Nginx kabi terma proksi ortida bo'lganda ishlating .

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Transaksiya moslamalari {#transaction-settings}

Transaksiya xatti-harakati `[transaction]` bo'limi bilan moslanadi:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` - milisekundlarda operatsiya muddati.
- `status_timeout_ms` mijoz tranzaksiya holatini qancha vaqt kutishini nazorat qiladi.
- `nonce = true` mijozdan takrorlanayotgan operatsiyalar turli xil hashlarni keltirib chiqarishi uchun nonce qiymatini kiritishni so'raydi.

## Chegara moslamalarini ulash {#connect-queue-settings}

`iroha` CLI mahalliy navbat holati uchun ixtiyoriy `[connect]` bo‘limini ham o‘qiydi. Qayta ishlatiladigan SDK sozlamasi uni qabul qilmaydi:

```toml
[connect]
queue_root = "./queue"
```

Jarayonga mijoz tomonida navbatni mustahkam saqlash kerak bo‘lsa, bundan foydalaning. `connect.queue_root`ning standart qiymati `~/.iroha/connect`, nisbiy yo‘l esa mijoz TOML fayli joylashgan katalogga nisbatan yechiladi.

## Konfiguratsiyalarni yaratish {#generating-configurations}

Bir martalik mahalliy tarmoqlar uchun Kagami ni afzal ko'rish kerak, chunki u Iroha 3 konfiguratsiyalari, genesis, skriptlar va README ga mos keladi:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

hosil bo'lgan `./localnet/client.toml` dan CLI bilan foydalanish:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
