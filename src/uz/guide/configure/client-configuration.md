---
translation_locale: uz
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Mijozning konfiguratsiyasi {#client-configuration}

Iroha CLI va SDK mijozlari TOML konfiguratsiyasidan foydalanadilar. Repository joriy andoza kodini `defaults/client.toml` ga jo'natadi; hosil qilingan mahalliy tarmoqlar ham o'zlarining chiqish direktoriyasiga moslashadigan `client.toml` yozib oladi.

::: details Mijozning konfiguratsiya namunalari

<<< @/snippets/client.template.toml

:::

## Asosiy maydonlar {#core-fields}

Kamida, mijoz konfiguratsiyasi zanjirni, Torii oxirgi nuqtani va imzo hisobini aniqlaydi:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` taqdim etilgan bitimlar tegishli bo'lgan zanjirni tanlaydi.
- `torii_url` tenglikdagi nuqtalar Torii HTTP API.
- `[account].domain` CLI qisqartmalari va manzilni tanlash kodlash orqali ishlatiladi; kanonik `AccountId` o'zidan domensiz.
- `[account].public_key` va `[account].private_key` bitimlarini imzolash.

Hisobot allaqachon zanjirda mavjud bo'lishi kerak. andoza mahalliy tarmoq uchun bu to'plamlangan genesis manifest tomonidan boshqariladi.

::: info Kassa sezgirligi

Iroha nomlari kanonik tahlildan so'ng holatga mos keladi. Misol uchun, `wonderland.universal`, `Wonderland.universal` va `looking_glass.universal` alohida domen literallar hisoblanadi.

:::

## Asosiy autentifikatsiya {#basic-authentication}

Opsional `[basic_auth]` bo'limi mijoz so'rovlariga HTTP `Authorization` boshliqini qo'shadi. Iroha tengdoshlar ushbu ma'lumotnomalarni to'g'ridan-to'g'ri talqin qilmaydilar; ularni Torii Nginx kabi terma proksi ortida bo'lganda ishlating .

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
- `nonce = true` mijozdan takrorlanayotgan operatsiyalar turli xil hashlarni keltirib chiqarishi uchun bitta notni kiritishni so'raydi.

## Chegara moslamalarini ulash {#connect-queue-settings}

Joriy Iroha mijozlari mahalliy navbat holati uchun `[connect]` bo'limidan ham foydalanishlari mumkin:

```toml
[connect]
queue_root = "./queue"
```

Ish oqimi uchun uzoq muddatli mijoz tomoni navbatda saqlash kerak bo'lganda buni qo'llang.

## Konfiguratsiyalarni yaratish {#generating-configurations}

Bir martalik mahalliy tarmoqlar uchun Kagami ni afzal ko'rish kerak, chunki u Iroha 3 konfiguratsiyalari, genesis, skriptlar va README ga mos keladi:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

hosil bo'lgan `./localnet/client.toml` dan CLI bilan foydalanish:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
