---
translation_locale: uz
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha ni sozlash {#configuring-iroha}

Mahalliy tarmoq tengdosh konfiguratsiyasi quyida o‘rnatilgan TOML fayllar. Bu zanjir ustida o‘zgartirilgan konfiguratsiyadan farq qiladi [`SetParameter`](/uz/blockchain/instructions.md#setparameter) ko'rsatmalar. Ishlab chiqarish xatti-harakati konfiguratsiyada ifodalanishi kerak fayl yoki on-chain parametr; muhit o'zgaruvchilari xususiyat eshiklari emas.

Foydalanish [`--config`](../iroha3d-cli#arg-config) CLI konfiguratsiya faylining yo‘lini ko‘rsatish uchun argument.

## Shablon {#template}

Har bir parametrning batafsil tasnifi uchun iltimos, [Parametrlar](./params.md) manbasiga murojaat qiling.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Konfiguratsiya fayllarini tuzish {#composing-configuration-files}

TOML konfiguratsiya fayllarida qo'shimcha `extends` maydon mavjud bo'lib, u boshqa TOML fayl(lar)ga ishora qiladi. Bu bitta yo'l yoki bir nechta yo'llar bo'lishi mumkin:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha `extends` ichida ko‘rsatilgan barcha fayllarni rekursiv ravishda o‘qiydi va ularni qatlamlarga joylashtiradi, bunda keyingilari parametr darajasida oldingilar ustiga yoziladi. Masalan, `config.toml` ni o‘qishda:

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

Hosil bo‘lgan konfiguratsiya `a.toml` dan `chain`, `b.toml` dan `max_content_len`, va `config.toml` dan `torii.address` bo‘ladi (`b.toml` ustiga yoziladi).

## Muammolarni bartaraf etish {#troubleshooting}

O'tkazish [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI konfiguratsiya qanday o‘qilganini va tahlil qilinganini kuzatish uchun bayroq.
