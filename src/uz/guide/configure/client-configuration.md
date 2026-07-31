---
translation_locale: uz
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Mijozning konfiguratsiyasi {#client-configuration}

Iroha CLI va SDK mijozlar foydalanadi TOML Repozitoriya
to ' g ' ri o ' zgarish `defaults/client.toml`; ishlab chiqarilgan mahalliy tarmoqlar ham yozadi
muvofiqlashtirish `client.toml` chiqindilar direktoriyasiga kiriting.

::: details Mijoz konfiguratsiyasi namuna

<<< @/snippets/client.template.toml

:::

## Asosiy maydonlar {#core-fields}

Hech bo'lmaganda, mijoz konfiguratsiyasi zanjirni aniqlaydi; Torii yakuniy nuqta va
imzolash hisobi:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` taqdim etilgan operatsiyalar tegishli bo'lgan zanjirni tanlaydi.
- `torii_url` tengdagi nuqtalar Torii HTTP API.
- `[account].domain` qo'llaniladi CLI qisqartmalar va manzilni tanlash kodlash;
  kanonik `AccountId` o'z-o'zi domensiz.
- `[account].public_key` va `[account].private_key` bitimlarni imzolash.

Hisobot allaqachon zanjirda mavjud bo'lishi kerak.
Bu o'z navbatida, "Bundled Genesis Manifesto" tomonidan boshqariladi.

::: info O'lchamlar sezgirligi

Iroha nomlar kanonik tahlildan so'ng holatga mos keladi.
`wonderland.universal`, `Wonderland.universal`, va
`looking_glass.universal` alohida domenlar bo'lgan.

:::

## Asosiy autentifikatsiya {#basic-authentication}

O'z navbatida `[basic_auth]` bo ' limda qo ' shilgan HTTP `Authorization` sarlavha
mijozlarning talablari. Iroha tengdoshlar ushbu ma'lumotnomalarni to'g'ridan-to'g'ri talqin qilmaydi;
ular qachon Torii Nginx kabi orqa tarafli vakilning orqasida.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Transaksiya moslamalari {#transaction-settings}

Transaksiya xatti-harakati `[transaction]` bo'lim:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` miligersekundlarda operatsiya muddati hisoblanadi.
- `status_timeout_ms` mijoz tranzaksiya uchun qancha vaqt kutishini nazorat qiladi
  holati.
- `nonce = true` mijozdan takrorlanayotgan operatsiyalar boʻyicha hisobni kiritishni soʻraydi
  turli xil hashlarni ishlab chiqaradi.

## Satr moslamalarini ulash {#connect-queue-settings}

Joriy Iroha mijozlar ham tanlovdan foydalanishlari mumkin `[connect]` mahalliy bo'lim
navbat holati:

```toml
[connect]
queue_root = "./queue"
```

Ish oqimi uchun uzoq muddatli mijoz tomoni navbatdagi saqlash kerak bo'lganda buni ishlating.

## Konfiguratsiyalarni yaratish {#generating-configurations}

Bir martalik mahalliy tarmoqlar uchun afzal Kagami chunki u moslashishni yozadi Iroha
3 konfig, genesis, skriptlar va a README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Yaratilgan `./localnet/client.toml` bilan CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
