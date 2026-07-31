---
translation_locale: uz
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ni sozlash {#configuring-iroha}

Mahalliy tengdosh konfiguratsiyasi TOML fayllarida o'rnatilgan. Bu [`SetParameter`](/uz/blockchain/instructions.md#setparameter) ko'rsatmalari orqali o'zgartirilgan zanjirdagi konfiguratsiyadan farq qiladi. Mahsulot xatti-harakati konfiguratsiya fayli yoki zanjirdagi parametrda ifoda etilishi kerak; atrof muhit o'zgaruvchilari xususiyat darvozalari emas.

Konfiguratsiya fayliga yo'lni aniqlash uchun [`--config`](../irohad-cli#arg-config) CLI argumentidan foydalaning.

## Namuna {#template}

Har bir parametrning batafsil tavsifi uchun [Parameterlar](./params.md) ko'rsatkichini ko'rib chiqing.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Konfiguratsiya fayllarini tuzish {#composing-configuration-files}

TOML konfiguratsiya fayllarida `extends` qo'shimcha maydoni mavjud bo'lib, boshqa TOML fayllariga ishora qiladi. Bu bitta yo'l yoki ko'p yo'l bo'lishi mumkin:

::: kod guruhi

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha `extends` da ko'rsatilgan barcha fayllarni takror o'qib, ularni qatlamlarga ajratadi va oxirgi qatlamlar oldingilarini parametr darajasida qayta yozadi. Masalan, agar `config.toml` o'qigan bo'lsa:

::: kod guruhi

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

Natijada `a.toml` dan `chain`, `max_content_len` dan `b.toml` va `torii.address` dan `config.toml` (o'chirishlar `b.toml`) konfiguratsiya qilinadi.

## Muammolarni hal qilish {#troubleshooting}

Konfiguratsiya qanday o'qilishi va tahlil qilinishini ko'rish uchun [`--trace-config`](../irohad-cli#arg-trace-config) CLI bayroqini o'tkazib yuboring.
