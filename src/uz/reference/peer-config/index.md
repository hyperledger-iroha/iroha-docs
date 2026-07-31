---
translation_locale: uz
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konfigurarlash Iroha {#configuring-iroha}

Mahalliy tengdoshlar konfiguratsiyasi TOML fayllar. Bu zanjirda bo'lganidan farq qiladi
tahrirda oʻzgartirilgan [`SetParameter`](/uz/blockchain/instructions.md#setparameter)
ko'rsatmalar. Ishlab chiqarish xatti-harakati konfiguratsiya faylida tasvirlanishi kerak
yoki zanjirdagi parametr; atrof muhit o'zgaruvchilari xususiyat darvozalari emas.

Foydalanish [`--config`](../irohad-cli#arg-config) CLI Konfiguratsiya fayliga yo'lni aniqlash uchun argument.

## Moddiy {#template}

Har bir parametrning batafsil tavsifi uchun [Parametrlar](./params.md) ma'lumotnoma.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Konfiguratsiya fayllarini tuzish {#composing-configuration-files}

TOML konfiguratsiya fayllari qo'shimcha `extends` boshqa maydonlarga ko'rsatilgan TOML fayl(s). Bu bitta yo'l yoki
ko'p yo'nalishlar:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha ushbu maqolada koʻrsatilgan barcha fayllarni qayta tiklanadi . `extends` Va ularni qatlam-qatlam qilib qoʻydik.
parametr darajasida oldingilar. Masalan, agar o'qish `config.toml`:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

The natijada konfiguratsiya boʻladi `chain` bilan `a.toml`, `max_content_len` bilan `b.toml`, va `torii.address` bilan
`config.toml` (o'chirish) `b.toml`).

## Muammolarni hal qilish {#troubleshooting}

Oʻtish [`--trace-config`](../irohad-cli#arg-trace-config) CLI Konfiguratsiya qanday o'qilishi va tahlil qilinishini ko'rish uchun bayroq.
